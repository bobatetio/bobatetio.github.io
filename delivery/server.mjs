#!/usr/bin/env node
/* Ukreate content delivery service.

   The hotel connects a drive once. From then on, every piece of content a
   creator delivers for a stay is uploaded into
       Ukreate / <Creator>, <dates>
   in every drive the hotel connected. Tokens live here, server side, and are
   never sent to the browser.

   Run:            node delivery/server.mjs            (real providers; needs keys)
   Sandbox:        UKD_SANDBOX=1 node delivery/server.mjs
                   starts stand-ins for all four providers (sandbox.mjs) and
                   writes the delivered files to delivery/sandbox-drives/.
   Keys:           delivery/.env, see delivery/README.md.

   Endpoints (all JSON, CORS-open for the local app):
     GET  /status                  providers, connections, recent deliveries
     GET  /connect/:provider       sends the hotel to the provider to approve
     GET  /callback/:provider      the provider sends them back here
     POST /disconnect/:provider
     POST /deliver                 { stay:{ id, title }, files:[{ name, url }] }
     POST /retry/:deliveryId       try the failed files of one delivery again */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));

/* ---------- configuration: delivery/.env, then the environment ---------- */
(function loadEnv() {
  try {
    fs.readFileSync(path.join(HERE, '.env'), 'utf8').split('\n').forEach((line) => {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    });
  } catch {}
})();
const SANDBOX = process.env.UKD_SANDBOX === '1';
const PORT = +(process.env.UKD_PORT || 4396);
const PUBLIC = (process.env.UKD_PUBLIC || `http://localhost:${PORT}`).replace(/\/$/, '');
const APP = process.env.UKD_APP || 'http://localhost:4399/app/';
const ASSETS = (process.env.UKD_ASSETS || 'http://localhost:4399').replace(/\/$/, '');
const STORE = process.env.UKD_STORE || path.join(HERE, 'store.json');
const BACKOFF = +(process.env.UKD_BACKOFF || 1000);
const SANDBOX_PORT = +(process.env.UKD_SANDBOX_PORT || 4495);
if (SANDBOX) process.env.UKD_PROVIDER_BASE = process.env.UKD_PROVIDER_BASE || `http://localhost:${SANDBOX_PORT}`;
const { PROVIDERS, ProviderError, u } = await import('./providers.mjs');
const log = (...a) => process.stderr.write('[delivery] ' + a.join(' ') + '\n');

function cfg(p) {
  if (SANDBOX) return { id: 'sandbox-' + p.k, secret: 'sandbox-secret' };
  return { id: process.env[p.env + '_CLIENT_ID'], secret: process.env[p.env + '_CLIENT_SECRET'] };
}
const configured = (p) => { const c = cfg(p); return !!(c.id && c.secret); };
const redirectFor = (k) => `${PUBLIC}/callback/${k}`;

/* ---------- the store: connections and the delivery log ---------- */
function load() {
  try { return JSON.parse(fs.readFileSync(STORE, 'utf8')); } catch { return { connections: {}, deliveries: [] }; }
}
let DB = load();
function save() { const t = STORE + '.tmp'; fs.writeFileSync(t, JSON.stringify(DB, null, 2)); fs.renameSync(t, STORE); }

/* ---------- connecting ---------- */
const STATES = new Map();   /* one-time OAuth state -> provider, ten minutes */
function startConnect(k) {
  const p = PROVIDERS[k];
  const state = crypto.randomBytes(16).toString('hex');
  STATES.set(state, { k, at: Date.now() });
  /* through u() like every other provider URL, so sandbox sends the browser to
     the sandbox's sign-in screen rather than the real one */
  return u(p.authUrl(cfg(p), redirectFor(k), state));
}
async function finishConnect(k, query) {
  const p = PROVIDERS[k], st = STATES.get(query.state);
  STATES.delete(query.state);
  if (!st || st.k !== k || Date.now() - st.at > 10 * 60 * 1000) throw new Error('That sign-in link has expired. Start again from Ukreate.');
  if (query.error) throw Object.assign(new Error('denied'), { denied: true });
  const tokens = await p.exchange(cfg(p), query.code, redirectFor(k));
  const conn = { tokens, connectedAt: new Date().toISOString(), sandbox: SANDBOX };
  conn.account = await p.account(conn);
  DB.connections[k] = conn; save();
  log(`${p.name} connected: ${conn.account}`);
}
async function disconnect(k) {
  const conn = DB.connections[k];
  if (!conn) return;
  await PROVIDERS[k].revoke(cfg(PROVIDERS[k]), conn).catch(() => {});
  delete DB.connections[k]; save();
}

/* ---------- calling a provider with a live token ----------
   Refreshes ahead of expiry, refreshes once more on a 401, and retries the
   errors that are worth retrying (429 and 5xx) with growing waits. */
async function withAuth(k, fn) {
  const p = PROVIDERS[k], conn = DB.connections[k];
  const refresh = async () => { conn.tokens = await p.refresh(cfg(p), conn); save(); };
  if (!conn.tokens.access || Date.now() > conn.tokens.expiresAt) await refresh();
  for (let attempt = 0; ; attempt++) {
    try { return await fn(conn); }
    catch (e) {
      if (e instanceof ProviderError && e.status === 401 && attempt === 0) { await refresh(); continue; }
      if (e instanceof ProviderError && e.retryable && attempt < 3) { await new Promise((r) => setTimeout(r, BACKOFF * 2 ** attempt)); continue; }
      throw e;
    }
  }
}

/* ---------- delivering ---------- */
const TYPES = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif', mp4: 'video/mp4', mov: 'video/quicktime', m4v: 'video/x-m4v', pdf: 'application/pdf' };
const clean = (s) => String(s).replace(/[\\/:*?"<>|\u0000-\u001f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120);
async function fetchFile(f) {
  const url = /^https?:/.test(f.url) ? f.url : ASSETS + (f.url.startsWith('/') ? '' : '/') + f.url;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Could not read ${f.name} (${r.status})`);
  const bytes = Buffer.from(await r.arrayBuffer());
  const ext = (f.name.split('.').pop() || '').toLowerCase();
  return { name: clean(f.name), type: TYPES[ext] || r.headers.get('content-type') || 'application/octet-stream', bytes };
}
const already = (k, stayId, name) => DB.deliveries.some((d) => d.provider === k && d.stay === stayId &&
  d.files.some((f) => f.ok && f.name === name));

async function deliverTo(k, job, entry) {
  const names = ['Ukreate', clean(job.stay.title || job.stay.id)];
  const folder = await withAuth(k, (conn) => PROVIDERS[k].ensureFolder(conn, names));
  entry.folder = names.join(' / '); entry.folderLink = folder.link;
  for (const f of job.files) {
    const name = clean(f.name);
    if (entry.retryOnly && !entry.retryOnly.includes(name)) continue;
    if (already(k, job.stay.id, name)) { upsertFile(entry, { name, ok: true, skipped: true }); continue; }
    try {
      const file = await fetchFile(f);
      const r = await withAuth(k, (conn) => PROVIDERS[k].upload(conn, folder, file));
      upsertFile(entry, { name, ok: true, link: r.link, bytes: file.bytes.length });
    } catch (e) { upsertFile(entry, { name, ok: false, error: e.message }); }
    save();
  }
}
function upsertFile(entry, f) {
  const i = entry.files.findIndex((x) => x.name === f.name);
  if (i > -1) entry.files[i] = f; else entry.files.push(f);
}
function finish(entry) {
  const ok = entry.files.filter((f) => f.ok).length;
  entry.status = !entry.files.length ? 'failed' : ok === entry.files.length ? 'delivered' : ok ? 'partial' : 'failed';
  entry.doneAt = new Date().toISOString(); delete entry.retryOnly; save();
}

const RUNNING = new Set();
async function deliver(job) {
  const connected = Object.keys(DB.connections);
  if (!connected.length) return { queued: false, reason: 'No drive connected' };
  const ids = [];
  for (const k of connected) {
    const entry = { id: crypto.randomBytes(6).toString('hex'), provider: k, stay: job.stay.id, title: job.stay.title,
      at: new Date().toISOString(), status: 'sending', files: [], job };
    DB.deliveries.unshift(entry); ids.push(entry.id);
    RUNNING.add(entry.id);
    deliverTo(k, job, entry)
      .catch((e) => { entry.error = e.message; job.files.forEach((f) => { if (!entry.files.some((x) => x.name === clean(f.name))) upsertFile(entry, { name: clean(f.name), ok: false, error: e.message }); }); })
      .finally(() => { RUNNING.delete(entry.id); finish(entry); log(`${PROVIDERS[k].name}: ${entry.title} ${entry.status}`); });
  }
  DB.deliveries = DB.deliveries.slice(0, 200); save();
  return { queued: true, deliveries: ids };
}
async function retry(id) {
  const entry = DB.deliveries.find((d) => d.id === id);
  if (!entry) throw new Error('No such delivery');
  if (!DB.connections[entry.provider]) throw new Error(PROVIDERS[entry.provider].name + ' is no longer connected');
  entry.retryOnly = entry.files.filter((f) => !f.ok).map((f) => f.name);
  entry.status = 'sending'; entry.error = undefined; save();
  RUNNING.add(id);
  deliverTo(entry.provider, entry.job, entry).catch((e) => { entry.error = e.message; })
    .finally(() => { RUNNING.delete(id); finish(entry); });
  return { retrying: id };
}

/* ---------- what the app sees: never a token ---------- */
function status() {
  return {
    sandbox: SANDBOX,
    providers: Object.values(PROVIDERS).map((p) => {
      const c = DB.connections[p.k];
      return { k: p.k, name: p.name, configured: configured(p), connected: !!c, account: c ? c.account : null,
        connectedAt: c ? c.connectedAt : null, sandbox: c ? !!c.sandbox : SANDBOX };
    }),
    deliveries: DB.deliveries.slice(0, 40).map(({ job, ...d }) => d)
  };
}

/* ---------- HTTP ---------- */
const json = (res, code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(obj)); };
const back = (res, params) => { res.writeHead(302, { Location: APP + (APP.includes('?') ? '&' : '?') + new URLSearchParams(params) }); res.end(); };
const body = (req) => new Promise((ok, no) => { let b = ''; req.on('data', (c) => { b += c; if (b.length > 1e6) req.destroy(); }); req.on('end', () => { try { ok(b ? JSON.parse(b) : {}); } catch (e) { no(e); } }); });

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  const url = new URL(req.url, PUBLIC), parts = url.pathname.split('/').filter(Boolean);
  const k = parts[1], p = k && PROVIDERS[k];
  try {
    if (req.method === 'GET' && url.pathname === '/status') return json(res, 200, status());
    if (req.method === 'GET' && parts[0] === 'connect' && p) {
      if (!configured(p)) return back(res, { drive: k, result: 'not-set-up' });
      res.writeHead(302, { Location: startConnect(k) }); return res.end();
    }
    if (req.method === 'GET' && parts[0] === 'callback' && p) {
      try { await finishConnect(k, Object.fromEntries(url.searchParams)); return back(res, { drive: k, result: 'connected' }); }
      catch (e) { log(p.name, 'connect failed:', e.message); return back(res, { drive: k, result: e.denied ? 'denied' : 'failed' }); }
    }
    if (req.method === 'POST' && parts[0] === 'disconnect' && p) { await disconnect(k); return json(res, 200, status()); }
    if (req.method === 'POST' && url.pathname === '/deliver') {
      const job = await body(req);
      if (!job.stay || !job.stay.id || !Array.isArray(job.files) || !job.files.length) return json(res, 400, { error: 'Send { stay:{ id, title }, files:[{ name, url }] }' });
      return json(res, 202, await deliver(job));
    }
    if (req.method === 'POST' && parts[0] === 'retry' && parts[1]) return json(res, 202, await retry(parts[1]));
    json(res, 404, { error: 'Not found' });
  } catch (e) { log(e.stack || e.message); json(res, 500, { error: e.message }); }
});

if (SANDBOX) {
  const { startSandbox } = await import('./sandbox.mjs');
  await startSandbox(SANDBOX_PORT);
  log(`sandbox providers on http://localhost:${SANDBOX_PORT}, files go to delivery/sandbox-drives/`);
}
server.listen(PORT, '127.0.0.1', () => log(`content delivery on ${PUBLIC} (${SANDBOX ? 'SANDBOX' : 'live providers'})`));
export { server };
