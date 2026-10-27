#!/usr/bin/env node
/* Ukreate's Cloudbeds connection.

   Holds the hotel's Cloudbeds key (never sent to the browser), reads the
   calendar, and keeps Cloudbeds in step with auto mode: every confirmed creator
   stay is a reservation in Cloudbeds, and nothing else Ukreate made is.

   KEEPING IN STEP. The app sends the full list of confirmed creator stays to
   POST /sync. The service compares it with what it has booked and books what is
   missing, cancels what should not be there, and rebooks any stay whose dates or
   room changed. Sending the same list twice changes nothing, so a missed call
   is corrected by the next one. Cloudbeds' own changes arrive on POST /webhook.

   Run:      node cloudbeds/server.mjs                 (needs Ukreate's Cloudbeds keys)
   Sandbox:  CB_SANDBOX=1 node cloudbeds/server.mjs    (a stand-in Cloudbeds on this computer)

   Endpoints: GET /status, GET /connect, GET /callback, POST /disconnect,
              GET /calendar?from=&to=, POST /sync, POST /webhook */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
(function loadEnv() {
  try {
    fs.readFileSync(path.join(HERE, '.env'), 'utf8').split('\n').forEach((line) => {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    });
  } catch {}
})();
const SANDBOX = process.env.CB_SANDBOX === '1';
const PORT = +(process.env.CB_PORT || 4397);
const PUBLIC = (process.env.CB_PUBLIC || `http://localhost:${PORT}`).replace(/\/$/, '');
const APP = process.env.CB_APP || 'http://localhost:4399/app/';
const STORE = process.env.CB_STORE || path.join(HERE, 'store.json');
const SANDBOX_PORT = +(process.env.CB_SANDBOX_PORT || 4497);
const GUEST_EMAIL = process.env.CB_GUEST_EMAIL || 'creators@ukreate.com';
if (SANDBOX) process.env.CB_PROVIDER_BASE = process.env.CB_PROVIDER_BASE || `http://localhost:${SANDBOX_PORT}`;
const CB = await import('./client.mjs');
const log = (...a) => process.stderr.write('[cloudbeds] ' + a.join(' ') + '\n');
const cfg = () => SANDBOX ? { id: 'sandbox-ukreate', secret: 'sandbox-secret' } : { id: process.env.CLOUDBEDS_CLIENT_ID, secret: process.env.CLOUDBEDS_CLIENT_SECRET };
const configured = () => { const c = cfg(); return !!(c.id && c.secret); };

/* ---------- the store ---------- */
const fresh = () => ({ conn: null, holds: {}, events: [], log: [] });
let DB; try { DB = JSON.parse(fs.readFileSync(STORE, 'utf8')); } catch { DB = fresh(); }
function save() { const t = STORE + '.tmp'; fs.writeFileSync(t, JSON.stringify(DB, null, 2)); fs.renameSync(t, STORE); }
function note(t) { DB.log.unshift({ at: new Date().toISOString(), t }); DB.log = DB.log.slice(0, 100); }

/* a revoked or broken key shows as a lost connection, not a silent failure */
async function guarded(fn) {
  try { return await fn(); }
  catch (e) {
    if (e.status === 401 || e.status === 403) { DB.conn.broken = { at: new Date().toISOString(), message: e.message }; save(); }
    throw e;
  }
}

/* ---------- connecting ---------- */
const STATES = new Map();
async function finishConnect(q) {
  const st = STATES.get(q.state); STATES.delete(q.state);
  if (!st || Date.now() - st > 10 * 60 * 1000) throw new Error('That sign-in link has expired. Start again from Ukreate.');
  if (q.error) throw Object.assign(new Error('denied'), { denied: true });
  const key = await CB.exchange(cfg(), q.code, PUBLIC + '/callback');
  const prop = await CB.property(key);
  const conn = { key, property: prop, connectedAt: new Date().toISOString(), sandbox: SANDBOX, broken: null, webhooks: [] };
  conn.sourceID = await CB.sourceId(key, prop.id).catch(() => null);
  conn.rateID = process.env.CB_CREATOR_RATE_ID || null;
  /* reconnecting: clear the old subscriptions with the new key, so nothing is notified twice */
  if (DB.conn && DB.conn.webhooks && DB.conn.webhooks.length) await CB.unsubscribe(key, prop.id, DB.conn.webhooks).catch(() => {});
  conn.webhooks = await CB.subscribe(key, prop.id, PUBLIC + '/webhook').catch((e) => { log('webhooks not set up:', e.message); return []; });
  /* a reconnect keeps what was already booked */
  DB.conn = conn; note('Connected to ' + prop.name); save();
  log('connected:', prop.name);
}
async function disconnect() {
  if (!DB.conn) return;
  await CB.unsubscribe(DB.conn.key, DB.conn.property.id, DB.conn.webhooks).catch(() => {});
  note('Disconnected from ' + DB.conn.property.name);
  DB.conn = null; save();
}

/* ---------- keeping Cloudbeds in step with auto mode ---------- */
let syncing = Promise.resolve();
function sync(stays) { const run = syncing.then(() => doSync(stays)); syncing = run.catch(() => {}); return run; }
async function doSync(stays) {
  const c = DB.conn;
  if (!c) throw new Error('Cloudbeds is not connected');
  if (c.broken) throw new Error('The Cloudbeds connection needs reconnecting');
  const types = await guarded(() => CB.roomTypes(c.key, c.property.id));
  const want = new Map(stays.map((s) => [s.id, s]));
  const changes = [];
  const same = (h, s) => h.from === s.from && h.to === s.to && h.roomType === s.roomType;

  /* cancel what should not be there, or is there with the wrong dates or room */
  for (const [id, h] of Object.entries(DB.holds)) {
    const s = want.get(id);
    if (s && same(h, s)) continue;
    try {
      if (h.kind === 'reservation') await guarded(() => CB.cancelReservation(c.key, h.ref));
      else await guarded(() => CB.unblock(c.key, c.property.id, h.ref));
      delete DB.holds[id];
      changes.push({ stay: id, did: h.kind === 'reservation' ? 'cancelled' : 'unblocked', ref: h.ref, name: h.name, roomType: h.roomType, from: h.from, to: h.to });
    } catch (e) { changes.push({ stay: id, did: 'error', error: e.message }); }
  }
  /* book what is missing */
  for (const s of stays) {
    if (DB.holds[s.id]) continue;
    const t = types.find((x) => x.name.toLowerCase() === String(s.roomType).toLowerCase());
    if (!t) { changes.push({ stay: s.id, did: 'error', error: `No room type called "${s.roomType}" in Cloudbeds` }); continue; }
    const parts = String(s.name || 'Ukreate Creator').split(' ');
    const hold = { id: s.id, roomTypeID: t.id, from: s.from, to: s.to, guests: s.guests || 1,
      firstName: parts[0], lastName: parts.slice(1).join(' ') || 'Creator', email: s.email || GUEST_EMAIL,
      sourceID: c.sourceID, rateID: c.rateID };
    let r;
    try { r = await guarded(() => CB.book(c.key, c.property.id, hold)); }
    catch (e) {
      if (e.status === 401 || e.status === 403) { changes.push({ stay: s.id, did: 'error', error: e.message }); continue; }
      /* no reservation possible: take the room out of sale instead, and say so */
      try { r = await guarded(() => CB.block(c.key, c.property.id, hold)); r.fallback = e.message; }
      catch (e2) { changes.push({ stay: s.id, did: 'error', error: e2.message }); continue; }
    }
    DB.holds[s.id] = { kind: r.kind, ref: r.ref, name: s.name, roomType: s.roomType, from: s.from, to: s.to, at: new Date().toISOString() };
    changes.push({ stay: s.id, did: r.kind === 'reservation' ? 'booked' : 'blocked', ref: r.ref, name: s.name, roomType: s.roomType, from: s.from, to: s.to, fallback: r.fallback });
  }
  changes.filter((x) => x.did !== 'error').forEach((x) => note(`${x.did} ${x.name} ${x.roomType} ${x.from} to ${x.to}`));
  c.lastSync = new Date().toISOString(); save();
  return { changes, holds: Object.keys(DB.holds).length };
}

/* ---------- Cloudbeds telling us something changed ---------- */
function webhook(evt) {
  const e = { at: new Date().toISOString(), object: evt.object || (evt.event || '').split('/')[0], action: evt.action || (evt.event || '').split('/')[1],
    reservationID: evt.reservationID || evt.reservationId || null, status: evt.status || null, propertyID: evt.propertyID || null };
  /* one of ours cancelled from inside Cloudbeds: forget it, the next sync rebooks or Activity explains */
  const mine = Object.entries(DB.holds).find(([, h]) => h.kind === 'reservation' && h.ref === String(e.reservationID));
  if (mine) e.stay = mine[0];
  if (mine && (e.action === 'deleted' || (e.action === 'status_changed' && e.status === 'canceled'))) { delete DB.holds[mine[0]]; e.removedHold = true; }
  DB.events.unshift(e); DB.events = DB.events.slice(0, 100); save();
}

/* ---------- what the app sees: never the key ---------- */
function status() {
  const c = DB.conn;
  return { sandbox: SANDBOX, configured: configured(), connected: !!c,
    property: c ? c.property : null, connectedAt: c ? c.connectedAt : null, broken: c ? c.broken : null,
    lastSync: c ? c.lastSync || null : null, webhooks: c ? c.webhooks.length : 0,
    holds: Object.entries(DB.holds).map(([stay, h]) => ({ stay, kind: h.kind, ref: h.ref, name: h.name, roomType: h.roomType, from: h.from, to: h.to })),
    events: DB.events.slice(0, 20), log: DB.log.slice(0, 20) };
}

/* ---------- HTTP ---------- */
const json = (res, code, o) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(o)); };
const back = (res, params) => { res.writeHead(302, { Location: APP + (APP.includes('?') ? '&' : '?') + new URLSearchParams(params) }); res.end(); };
const body = (req) => new Promise((ok, no) => { let b = ''; req.on('data', (c) => { b += c; if (b.length > 1e6) req.destroy(); });
  req.on('end', () => { try { ok(!b ? {} : (req.headers['content-type'] || '').includes('json') ? JSON.parse(b) : Object.fromEntries(new URLSearchParams(b))); } catch (e) { no(e); } }); });

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  const url = new URL(req.url, PUBLIC);
  try {
    if (req.method === 'GET' && url.pathname === '/status') return json(res, 200, status());
    if (req.method === 'GET' && url.pathname === '/connect') {
      if (!configured()) return back(res, { cb: 'not-set-up' });
      const state = crypto.randomBytes(16).toString('hex'); STATES.set(state, Date.now());
      res.writeHead(302, { Location: CB.authUrl(cfg(), PUBLIC + '/callback', state) }); return res.end();
    }
    if (req.method === 'GET' && url.pathname === '/callback') {
      try { await finishConnect(Object.fromEntries(url.searchParams)); return back(res, { cb: 'connected' }); }
      catch (e) { log('connect failed:', e.message); return back(res, { cb: e.denied ? 'denied' : 'failed' }); }
    }
    if (req.method === 'POST' && url.pathname === '/disconnect') { await disconnect(); return json(res, 200, status()); }
    if (req.method === 'GET' && url.pathname === '/calendar') {
      if (!DB.conn) return json(res, 409, { error: 'Cloudbeds is not connected' });
      const from = url.searchParams.get('from'), to = url.searchParams.get('to');
      if (!/^\d{4}-\d{2}-\d{2}$/.test(from || '') || !/^\d{4}-\d{2}-\d{2}$/.test(to || '')) return json(res, 400, { error: 'Send from and to as YYYY-MM-DD' });
      return json(res, 200, { roomTypes: await guarded(() => CB.calendar(DB.conn.key, DB.conn.property.id, from, to)) });
    }
    if (req.method === 'POST' && url.pathname === '/sync') {
      const b = await body(req);
      if (!Array.isArray(b.stays)) return json(res, 400, { error: 'Send { stays:[{ id, name, roomType, from, to, guests }] }' });
      return json(res, 200, await sync(b.stays));
    }
    if (req.method === 'POST' && url.pathname === '/webhook') { webhook(await body(req)); res.writeHead(200); return res.end('ok'); }
    json(res, 404, { error: 'Not found' });
  } catch (e) { log(e.message); json(res, e.status === 401 ? 409 : 500, { error: e.message }); }
});

/* a light check of the key, so a hotel removing Ukreate inside Cloudbeds shows
   up as a lost connection within a minute, not at the next booking change */
setInterval(() => {
  const c = DB.conn;
  if (!c || c.broken) return;
  guarded(() => CB.property(c.key)).catch(() => {});
}, +(process.env.CB_HEALTH_MS || 60000));

if (SANDBOX) {
  const { startSandbox } = await import('./sandbox.mjs');
  await startSandbox(SANDBOX_PORT);
  log(`sandbox Cloudbeds on http://localhost:${SANDBOX_PORT}`);
}
server.listen(PORT, '127.0.0.1', () => log(`Cloudbeds connection on ${PUBLIC} (${SANDBOX ? 'SANDBOX' : 'live'})`));
