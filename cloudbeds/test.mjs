#!/usr/bin/env node
/* End-to-end test of the Cloudbeds connection against the sandbox Cloudbeds.
   Run: node cloudbeds/test.mjs   (own ports and a scratch store; touches nothing real) */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'cb-test-'));
const P = { svc: 4697, sandbox: 4698 };
const svc = spawn('node', [path.join(HERE, 'server.mjs')], { stdio: ['ignore', 'ignore', 'pipe'], env: Object.assign({}, process.env, {
  CB_SANDBOX: '1', CB_PORT: P.svc, CB_SANDBOX_PORT: P.sandbox, CB_STORE: path.join(TMP, 'store.json'), CB_PUBLIC: `http://localhost:${P.svc}`, CB_APP: 'http://localhost:1/app/', CB_HEALTH_MS: '400' }) });
let svcLog = ''; svc.stderr.on('data', (d) => { svcLog += d; });
const S = `http://localhost:${P.svc}`, SB = `http://localhost:${P.sandbox}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const get = (u) => fetch(u, { redirect: 'manual' });
const post = (u, b) => fetch(u, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: b ? JSON.stringify(b) : undefined });
const status = async () => (await fetch(S + '/status')).json();
const box = async () => (await fetch(SB + '/__sandbox/state')).json();
const sync = async (stays) => (await post(S + '/sync', { stays })).json();
let passed = 0, failed = 0;
const check = (n, ok, d) => { if (ok) { passed++; console.log('  ✓ ' + n); } else { failed++; console.log('  ✗ ' + n + (d ? '  -> ' + d : '')); } };
async function connect(deny) {
  const start = await get(S + '/connect'), consent = new URL(start.headers.get('location'));
  if (consent.origin !== SB) throw new Error('sign-in went to ' + consent.origin + ', not the sandbox');
  const page = await (await get(consent.toString())).text();
  if (!page.includes('Sandbox')) throw new Error('sandbox approval screen did not load');
  const ap = await get(`${SB}/__approve?redirect_uri=${encodeURIComponent(consent.searchParams.get('redirect_uri'))}&state=${consent.searchParams.get('state')}${deny ? '&deny=1' : ''}`);
  const cb = await get(ap.headers.get('location'));
  return new URL(cb.headers.get('location')).searchParams.get('cb');
}
for (let i = 0; i < 50; i++) { try { await fetch(S + '/status'); break; } catch { await sleep(100); } }

const LEILA = { id: 'as12', name: 'Leila Haddad', roomType: 'Garden suite', from: '2027-03-23', to: '2027-03-25', guests: 2 };
const BROOK = { id: 'as13', name: 'Brooklyn Reyes', roomType: 'Deluxe king', from: '2027-03-25', to: '2027-03-27', guests: 1 };
try {
  console.log('\nConnecting');
  check('cancelling approval comes back as denied', (await connect(true)) === 'denied');
  check('approving connects to the property', (await connect()) === 'connected' && (await status()).property.name === 'MiraGrace Estate');
  const st = await status();
  check('the key is never exposed', !JSON.stringify(st).includes('cbat_'));
  check('all seven webhooks are registered', st.webhooks === 7 && (await box()).hooks.length === 7);

  console.log('\nReading the calendar');
  const cal = await (await fetch(S + '/calendar?from=2027-03-23&to=2027-03-30')).json();
  const g = cal.roomTypes.find((t) => t.name === 'Garden suite');
  check('four room types with units', cal.roomTypes.length === 4 && g.units === 12);
  check('night-by-night free rooms and the base rate', Object.keys(g.nights).length === 7 && g.nights['2027-03-23'].rate === 420 && g.nights['2027-03-23'].free >= 0);

  console.log('\nKeeping Cloudbeds in step');
  const before = g.nights['2027-03-23'].free;
  let r = await sync([LEILA, BROOK]);
  let b = await box();
  const leila = b.reservations.find((x) => x.thirdPartyIdentifier === 'as12');
  check('confirmed creators become reservations', r.changes.filter((c) => c.did === 'booked').length === 2 && leila && leila.status === 'confirmed');
  check('as cash, from the Ukreate source, tagged with the stay', leila.paymentMethod === 'cash' && leila.source === 's-9-1' && leila.guest === 'Leila Haddad');
  const after = (await (await fetch(S + '/calendar?from=2027-03-23&to=2027-03-24')).json()).roomTypes.find((t) => t.name === 'Garden suite').nights['2027-03-23'].free;
  check('the booked room comes out of availability', after === before - 1, before + ' -> ' + after);
  r = await sync([LEILA, BROOK]);
  check('sending the same stays again changes nothing', r.changes.length === 0 && (await box()).reservations.filter((x) => x.status === 'confirmed' && x.thirdPartyIdentifier).length === 2);
  r = await sync([LEILA, Object.assign({}, BROOK, { from: '2027-03-26', to: '2027-03-28' })]);
  b = await box();
  check('a date change cancels and rebooks', r.changes.some((c) => c.did === 'cancelled') && r.changes.some((c) => c.did === 'booked') &&
    b.reservations.some((x) => x.thirdPartyIdentifier === 'as13' && x.status === 'confirmed' && x.startDate === '2027-03-26'));
  r = await sync([LEILA]);
  check('a stay no longer confirmed is cancelled', r.changes.some((c) => c.stay === 'as13' && c.did === 'cancelled') &&
    !(await box()).reservations.some((x) => x.thirdPartyIdentifier === 'as13' && x.status === 'confirmed'));

  console.log('\nWhen a reservation cannot be made');
  await post(`${SB}/__sandbox/fail?method=postReservation&n=1&status=400`);
  r = await sync([LEILA, BROOK]);
  check('falls back to blocking the room, and says so', r.changes.some((c) => c.stay === 'as13' && c.did === 'blocked' && c.fallback) && (await box()).blocks.length === 1);
  r = await sync([LEILA]);
  check('the block is removed when the stay goes', r.changes.some((c) => c.did === 'unblocked') && (await box()).blocks.length === 0);

  console.log('\nCloudbeds telling us things');
  await post(`${SB}/__sandbox/book?roomType=Deluxe%20king&from=2027-04-01&to=2027-04-03`); await sleep(300);
  check('an outside booking arrives by webhook', (await status()).events.some((e) => e.object === 'reservation' && e.action === 'created'));
  const mine = (await status()).holds.find((h) => h.stay === 'as12');
  await post(`${SB}/__sandbox/cancel?reservationID=${mine.ref}`); await sleep(300);
  check('a creator stay cancelled inside Cloudbeds is noticed', !(await status()).holds.some((h) => h.stay === 'as12'));
  r = await sync([LEILA]);
  check('and the next sync books it again', r.changes.some((c) => c.stay === 'as12' && c.did === 'booked'));

  console.log('\nLosing and fixing the connection');
  await post(`${SB}/__sandbox/revoke`);
  await sleep(1000);
  check('removing Ukreate in Cloudbeds shows as lost within the health check, no booking change needed', !!(await status()).broken);
  const blocked = await post(S + '/sync', { stays: [LEILA] });
  check('nothing is attempted while it is lost', blocked.status >= 400);
  check('reconnecting clears it and keeps what was booked', (await connect()) === 'connected' && !(await status()).broken && (await status()).holds.some((h) => h.stay === 'as12'));
  await post(S + '/disconnect');
  check('disconnecting removes the webhooks, and reconnecting left no duplicates', !(await status()).connected && (await box()).hooks.length === 0);
} catch (e) { failed++; console.log('\nCrashed: ' + e.stack + '\n' + svcLog.slice(-1500)); }
finally { console.log(`\n${passed} passed, ${failed} failed`); svc.kill(); fs.rmSync(TMP, { recursive: true, force: true }); process.exit(failed ? 1 : 0); }
