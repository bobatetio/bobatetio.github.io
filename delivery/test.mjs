#!/usr/bin/env node
/* End-to-end test of content delivery against the sandbox providers.
   Run: node delivery/test.mjs
   Starts its own service, sandbox and file server on spare ports with a scratch
   store, so it never touches delivery/store.json or the real sandbox drives. */
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'ukd-test-'));
const P = { svc: 4596, sandbox: 4597, files: 4598 };
const FILES = {
  'small.jpg': crypto.randomBytes(50 * 1024),
  'big.mp4': crypto.randomBytes(3 * 1024 * 1024 + 12345),   /* above every lowered threshold: chunked everywhere */
  'later.png': crypto.randomBytes(80 * 1024),
  'flaky.png': crypto.randomBytes(70 * 1024),
  'stubborn.png': crypto.randomBytes(60 * 1024)
};
const NAMES = { gdrive: 'Google Drive', dropbox: 'Dropbox', onedrive: 'OneDrive', box: 'Box' };

/* the files the service will fetch, as if from the app */
const fileSrv = http.createServer((req, res) => {
  const f = FILES[req.url.replace(/^\/files\//, '')];
  if (!f) { res.writeHead(404); return res.end(); }
  res.writeHead(200); res.end(f);
}).listen(P.files);

const svc = spawn('node', [path.join(HERE, 'server.mjs')], { stdio: ['ignore', 'ignore', 'pipe'], env: Object.assign({}, process.env, {
  UKD_SANDBOX: '1', UKD_PORT: P.svc, UKD_SANDBOX_PORT: P.sandbox, UKD_STORE: path.join(TMP, 'store.json'),
  UKD_SANDBOX_DIR: path.join(TMP, 'drives'), UKD_ASSETS: `http://localhost:${P.files}`, UKD_APP: `http://localhost:${P.files}/app/`,
  UKD_BACKOFF: '10', UKD_GOOGLE_CHUNK: String(256 * 1024), UKD_DROPBOX_SINGLE: String(1024 * 1024), UKD_DROPBOX_CHUNK: String(512 * 1024),
  UKD_ONEDRIVE_SINGLE: String(1024 * 1024), UKD_ONEDRIVE_CHUNK: String(640 * 1024), UKD_BOX_SINGLE: String(1024 * 1024), UKD_SANDBOX_BOX_PART: String(1024 * 1024)
}) });
let svcLog = ''; svc.stderr.on('data', (d) => { svcLog += d; });

const S = `http://localhost:${P.svc}`, SB = `http://localhost:${P.sandbox}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const get = (u) => fetch(u, { redirect: 'manual' });
const post = (u, body) => fetch(u, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
let passed = 0, failed = 0;
function check(name, ok, detail) {
  if (ok) { passed++; console.log('  ✓ ' + name); }
  else { failed++; console.log('  ✗ ' + name + (detail ? '  -> ' + detail : '')); }
}
async function status() { return (await (await fetch(S + '/status')).json()); }
async function settle(id) {
  for (let i = 0; i < 200; i++) { const d = (await status()).deliveries.find((x) => x.id === id); if (d && d.status !== 'sending') return d; await sleep(50); }
  throw new Error('delivery ' + id + ' never finished');
}
async function connect(k, deny) {
  const start = await get(`${S}/connect/${k}`);
  const consent = new URL(start.headers.get('location'));
  /* the browser must land on the sandbox's sign-in screen, never the real provider */
  if (consent.origin !== SB) throw new Error('sign-in went to ' + consent.origin + ' instead of the sandbox');
  const page = await get(consent.toString());
  if (page.status !== 200 || !(await page.text()).includes('Sandbox')) throw new Error('the sandbox sign-in screen did not load');
  const approve = await get(`${SB}/__approve?p=${k}&redirect_uri=${encodeURIComponent(consent.searchParams.get('redirect_uri'))}&state=${consent.searchParams.get('state')}${deny ? '&deny=1' : ''}`);
  const cb = await get(approve.headers.get('location'));
  return new URL(cb.headers.get('location')).searchParams.get('result');
}
const onDisk = (k, title, name) => { try { return fs.readFileSync(path.join(TMP, 'drives', NAMES[k], 'Ukreate', title, name)); } catch { return null; } };
const deliver = (title, names) => post(S + '/deliver', { stay: { id: 'stay-' + title, title }, files: names.map((n) => ({ name: n, url: '/files/' + n })) }).then((r) => r.json());

for (let i = 0; i < 50; i++) { try { await fetch(S + '/status'); break; } catch { await sleep(100); } }

try {
  for (const k of Object.keys(NAMES)) {
    console.log(`\n${NAMES[k]}`);
    check('refusing on the sign-in screen comes back as denied', (await connect(k, true)) === 'denied');
    check('signing in connects', (await connect(k)) === 'connected');
    const st = (await status()).providers.find((p) => p.k === k);
    check('status shows the account, never a token', st.connected && st.account === 'gm@miragrace-sandbox.test' && !JSON.stringify(await status()).includes('-acc-'));

    /* only this provider connected for the per-provider checks */
    for (const other of Object.keys(NAMES)) if (other !== k) await post(`${S}/disconnect/${other}`);
    const title = `Leila Haddad, 23-25 Mar ${k}`;
    const r1 = await deliver(title, ['small.jpg', 'big.mp4']);
    const d1 = await settle(r1.deliveries[0]);
    check('delivers a small and a chunked large file', d1.status === 'delivered', JSON.stringify(d1.files));
    check('bytes on disk match exactly', onDisk(k, title, 'small.jpg')?.equals(FILES['small.jpg']) && onDisk(k, title, 'big.mp4')?.equals(FILES['big.mp4']));

    const d2 = await settle((await deliver(title, ['small.jpg', 'big.mp4'])).deliveries[0]);
    const listed = fs.readdirSync(path.join(TMP, 'drives', NAMES[k], 'Ukreate', title));
    check('delivering again uploads nothing twice', d2.files.every((f) => f.skipped) && listed.length === 2, listed.join(', '));

    await post(`${SB}/__sandbox/expire?p=${k}`);
    const d3 = await settle((await deliver(title, ['later.png'])).deliveries[0]);
    check('an expired token is refreshed and the upload goes through', d3.status === 'delivered' && onDisk(k, title, 'later.png')?.equals(FILES['later.png']), d3.files[0] && d3.files[0].error);

    await post(`${SB}/__sandbox/fail?p=${k}&n=2&status=503`);
    const d4 = await settle((await deliver(title, ['flaky.png'])).deliveries[0]);
    check('temporary server errors are retried', d4.status === 'delivered', d4.files[0] && d4.files[0].error);

    await post(`${SB}/__sandbox/fail?p=${k}&n=40&status=503`);
    const d5 = await settle((await deliver(title, ['stubborn.png'])).deliveries[0]);
    check('a persistent failure is recorded, not hidden', d5.status === 'failed');
    await post(`${SB}/__sandbox/fail?p=${k}&n=0`);
    await post(`${S}/retry/${d5.id}`);
    const d6 = await settle(d5.id);
    check('retrying a failed delivery completes it', d6.status === 'delivered' && onDisk(k, title, 'stubborn.png')?.equals(FILES['stubborn.png']));

    await post(`${S}/disconnect/${k}`);
    check('disconnecting forgets the drive', !(await status()).providers.find((p) => p.k === k).connected);
  }

  console.log('\nAll four at once');
  for (const k of Object.keys(NAMES)) await connect(k);
  const all = await deliver('Brooklyn Reyes, 25-27 Mar', ['small.jpg']);
  const results = await Promise.all(all.deliveries.map(settle));
  check('one delivery fans out to every connected drive', results.length === 4 && results.every((d) => d.status === 'delivered'));
  check('no drive connected means nothing is queued', (await (async () => { for (const k of Object.keys(NAMES)) await post(`${S}/disconnect/${k}`); return (await deliver('x', ['small.jpg'])).queued === false; })()));
} catch (e) {
  failed++; console.log('\nCrashed: ' + e.stack + '\n' + svcLog.slice(-1500));
} finally {
  console.log(`\n${passed} passed, ${failed} failed`);
  svc.kill(); fileSrv.close(); fs.rmSync(TMP, { recursive: true, force: true });
  process.exit(failed ? 1 : 0);
}
