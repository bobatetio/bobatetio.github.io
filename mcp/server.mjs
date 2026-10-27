#!/usr/bin/env node
/* Ukreate auto mode, for Claude and ChatGPT.

   An MCP server over stdio, with no dependencies. It does not re-implement auto
   mode: it loads the app's own assets/js/ukauto.js (and the data it reads) into
   a sandbox, so every answer and every action runs the exact code the hotel's
   screen runs. The two cannot disagree.

   ONE COPY OF THE STATE. mcp/state.json. This process also serves it on
   http://localhost:4398/state, and the hotel app syncs with it while it is
   running, so anything done here shows up on screen, marked "via Claude".

   PERMISSIONS ARE ENFORCED HERE, not only on screen. The hotel turns access on
   in Auto mode, Settings, and picks Look only or Look and act. A tool that
   changes anything refuses unless both are true, every call, re-read from disk.

   Run:   node mcp/server.mjs
   Claude Desktop config:  { "mcpServers": { "ukreate": { "command": "node", "args": ["<repo>/mcp/server.mjs"] } } }
   Claude Code:            claude mcp add ukreate -- node <repo>/mcp/server.mjs

   // PLUG-IN POINT — production. The hosted version swaps stdio for Streamable
   HTTP with OAuth sign-in (what ChatGPT and Claude on the web require), and the
   sandbox + state file for the property's API. The tool list stays the same. */
import vm from 'node:vm';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const STATE = process.env.UKREATE_STATE || path.join(HERE, 'state.json');   /* a separate file keeps tests off the real one */
const KEY = 'uk_auto_v1';
const PORT = +(process.env.UKREATE_BRIDGE_PORT || 4398);
const log = (...a) => process.stderr.write('[ukreate] ' + a.join(' ') + '\n');

/* ---------------- the state file ---------------- */
function readState() { try { return fs.readFileSync(STATE, 'utf8'); } catch { return null; } }
function writeState(txt) {
  const tmp = STATE + '.tmp';
  fs.writeFileSync(tmp, txt); fs.renameSync(tmp, STATE);
}

/* ---------------- the app's own code, in a sandbox ---------------- */
const noop = () => {};
const store = {};
const ctx = {
  console: { log: noop, warn: noop, error: noop }, URLSearchParams, Date, Math, JSON, setTimeout, clearTimeout,
  localStorage: {
    getItem: (k) => (k === KEY ? readState() : (k in store ? store[k] : null)),
    setItem: (k, v) => { if (k === KEY) writeState(String(v)); else store[k] = String(v); },
    removeItem: (k) => { delete store[k]; }
  },
  location: { search: '', pathname: '/app/', href: '' },
  document: {
    querySelector: () => null, querySelectorAll: () => [], addEventListener: noop, getElementById: () => null,
    createElement: () => ({ style: {}, setAttribute: noop, appendChild: noop }), readyState: 'complete',
    body: { appendChild: noop, classList: { add: noop, remove: noop } }, documentElement: {}
  },
  navigator: { userAgent: 'node' }, addEventListener: noop, matchMedia: () => ({ matches: false, addEventListener: noop })
};
ctx.window = ctx; ctx.self = ctx;
vm.createContext(ctx);
for (const f of ['ukshared', 'uktrack', 'ukdemo', 'ukstays', 'ukapply', 'ukattrib', 'ukpitchin', 'ukinvite', 'ukdata', 'ukauto']) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'assets/js', f + '.js'), 'utf8'), ctx, { filename: f + '.js' });
}
const A = ctx.UKAUTO, D = ctx.UK, F = A.fmt;
if (!A) { log('could not load ukauto.js'); process.exit(1); }

/* ---------------- the bridge the hotel app syncs with ---------------- */
/* Apps that connect by link (ChatGPT, Grok, Perplexity, Muse, Mistral, Claude on
   the web) talk MCP over HTTP: JSON-RPC posted to /mcp, answered as JSON. Each
   session remembers which app opened it, so Activity names the right one.
   // PLUG-IN POINT — those apps run in the cloud, so they need this served at a
   public https address (with sign-in) before they can reach it. */
const SESSIONS = new Map();
function mcpHttp(req, res) {
  if (req.method === 'DELETE') { SESSIONS.delete(req.headers['mcp-session-id']); res.writeHead(200); return res.end(); }
  if (req.method !== 'POST') { res.writeHead(405, { Allow: 'POST, DELETE' }); return res.end(); }
  let body = '';
  req.on('data', (c) => { body += c; if (body.length > 1e6) req.destroy(); });
  req.on('end', () => {
    let msg; try { msg = JSON.parse(body); } catch { res.writeHead(400, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify(fail(null, -32700, 'Parse error'))); }
    const list = Array.isArray(msg) ? msg : [msg];
    let sid = req.headers['mcp-session-id'];
    const init = list.find((m) => m.method === 'initialize');
    if (init) { sid = Math.random().toString(36).slice(2) + Date.now().toString(36); SESSIONS.set(sid, appName(init.params && init.params.clientInfo)); }
    APP = SESSIONS.get(sid) || 'An app';
    const out = list.map(handle).filter(Boolean);
    const head = { 'Content-Type': 'application/json' };
    if (sid) head['Mcp-Session-Id'] = sid;
    if (!out.length) { res.writeHead(202, head); return res.end(); }
    res.writeHead(200, head); res.end(JSON.stringify(Array.isArray(msg) ? out : out[0]));
  });
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Mcp-Session-Id, Mcp-Protocol-Version, Authorization');
  res.setHeader('Access-Control-Expose-Headers', 'Mcp-Session-Id');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  if (req.url.split('?')[0] === '/mcp') return mcpHttp(req, res);
  if (req.url !== '/state') { res.writeHead(404); return res.end(); }
  if (req.method === 'GET') {
    const txt = readState();
    if (!txt) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end(txt);
  }
  if (req.method === 'PUT') {
    let body = '';
    req.on('data', (c) => { body += c; if (body.length > 2e6) req.destroy(); });
    req.on('end', () => {
      try {
        const next = JSON.parse(body), cur = JSON.parse(readState() || '{}');
        /* strictly newer wins; an older or same-numbered copy never overwrites */
        if (next && next.scn && (next.rev || 0) > (cur.rev || 0)) writeState(JSON.stringify(next));
        res.writeHead(204); res.end();
      } catch { res.writeHead(400); res.end(); }
    });
    return;
  }
  res.writeHead(405); res.end();
});
server.on('error', (e) => log(e.code === 'EADDRINUSE' ? `bridge already running on ${PORT}, sharing it` : 'bridge: ' + e.message));
server.listen(PORT, '127.0.0.1', () => log(`bridge on http://localhost:${PORT}/state, MCP over HTTP on http://localhost:${PORT}/mcp`));

/* ---------------- helpers ---------------- */
let APP = 'Claude';
/* which app is calling, from the name it introduces itself with */
function appName(ci) {
  const n = String((ci && ci.name) || '').toLowerCase();
  const KNOWN = [['codex', 'Codex'], ['gemini', 'Gemini'], ['claude', 'Claude'], ['chatgpt', 'ChatGPT'], ['openai', 'ChatGPT'],
    ['grok', 'Grok'], ['perplexity', 'Perplexity'], ['muse', 'Muse'], ['mistral', 'Mistral'], ['le chat', 'Mistral']];
  const hit = KNOWN.find(([k]) => n.includes(k));
  return hit ? hit[1] : ((ci && ci.name) || 'An app');
}
const cr = (id) => D.creator(id);
const room = (k) => A.ROOM[k].n;
function stay(x) {
  const c = cr(x.cr);
  return { id: x.id, creator: c.n, handle: c.h, rating: c.rating, room: room(x.room),
    arrives: F.day(x.from, true), leaves: F.day(F.add(x.from, x.n), true), nights: x.n,
    guests: x.guests || 1, will_make: x.make, desk_notes: (x.desk || []).concat(['No charge. Creator stay.']),
    moved_from: x.movedFrom ? F.range(x.movedFrom, x.n) : undefined };
}
function modeText(S) {
  if (S.conn === 'none') return 'Not set up: Cloudbeds is not connected';
  if (S.conn === 'requested') return 'Setup requested, waiting on the Ukreate team';
  if (S.conn === 'dropped') return 'Cloudbeds connection lost: nothing new is being listed';
  if (S.mode === 'paused') return 'Paused by the hotel';
  if (S.mode === 'off') return 'Connected, not turned on yet';
  return S.full ? 'On, nothing to list: the calendar is full' : 'On';
}
class Refusal extends Error {}
function gate(write) {
  A.reload();
  /* every attempt is recorded, so the hotel's screen can say "Claude reached us"
     even when access is still off */
  A.setAssist({ lastTryAt: nowStamp(), app: APP, tried: Object.assign({}, (A.state().assist || {}).tried || {}, { [APP]: nowStamp() }) });
  const S = A.state(), a = S.assist || {};
  if (!a.on) throw new Refusal('Access for connected apps is off for this hotel. Turn it on in Ukreate: Auto mode, Connected apps.');
  if (write && a.level !== 'act') throw new Refusal('This hotel allows Look only. To make changes, choose "Look and act" in Ukreate: Auto mode, Connected apps.');
  if (write && S.mode === 'off' && S.conn !== 'live') throw new Refusal('Auto mode is not set up yet. ' + modeText(S) + '.');
  /* last used, per app, so each row on the hotel's screen tells its own truth */
  const now = nowStamp();
  A.setAssist({ lastAt: now, app: APP, seen: Object.assign({}, a.seen || {}, { [APP]: now }) });
  return A.state();
}
function nowStamp() { const d = new Date(); return A.NOW + 'T' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }
function act(fn) { A.as(APP); try { return fn(); } finally { A.as(null); } }
/* the sentence just written to Activity, exactly as the hotel will read it */
function lastDone() {
  const u = A.state().user, last = u[u.length - 1];
  const e = last && A.model().log.find((x) => x.id === last.id);
  return e ? e.t : 'Done.';
}

/* ---------------- tools ----------------
   Read tools answer from the same model the screen draws. Act tools call the
   same functions the screen's buttons call, as the named assistant. */
const LEVELS = { r40: 'Rated 4.0 and up', r45: 'Rated 4.5 and up', r48: 'Rated 4.8 and up' };
const ROOM_KEYS = A.ROOMS.map((r) => r.k);
const TOOLS = [
  { name: 'get_status', write: false, title: 'Auto mode status',
    description: 'Overall state of auto mode for the hotel: on, paused or not set up, what is on offer, who is confirmed, who arrives this week, and how many decisions are waiting.',
    inputSchema: { type: 'object', properties: {} },
    run() {
      const S = A.state(), m = A.model();
      return { summary: `${modeText(S)}. ${m.open.length} on offer, ${m.coming.length} confirmed, ${m.week.length} arriving this week, ${m.queue.length} waiting on the hotel.`,
        status: modeText(S), on_offer: m.open.length, confirmed: m.coming.length, arriving_this_week: m.week.map(stay),
        decisions_waiting: m.queue.length, today: F.day(A.NOW, true) + ' ' + A.NOW.slice(0, 4) };
    } },
  { name: 'list_arrivals', write: false, title: 'Creator arrivals',
    description: 'Confirmed creator stays, soonest first, with everything the front desk needs: dates, room, guests, what they agreed to make, and desk notes.',
    inputSchema: { type: 'object', properties: { days: { type: 'integer', minimum: 1, maximum: 120, description: 'Only arrivals within this many days. Default: all.' } } },
    run({ days }) {
      const m = A.model();
      const list = m.coming.filter((x) => !days || F.diff(A.NOW, x.from) <= days).map(stay);
      return { summary: list.length ? `${list.length} confirmed ${list.length === 1 ? 'arrival' : 'arrivals'}.` : 'Nobody confirmed in that window.', arrivals: list };
    } },
  { name: 'list_offers', write: false, title: 'Rooms on offer',
    description: 'Rooms currently offered to creators: room type, dates, applicants, and whether the offer is open, taken down (paused) or hidden (connection lost).',
    inputSchema: { type: 'object', properties: {} },
    run() {
      const m = A.model();
      const list = m.listings.map((l) => ({ id: l.id, room: room(l.room), dates: F.range(l.from, l.n), applicants: l.apps, state: l.state }));
      return { summary: `${m.open.length} open ${m.open.length === 1 ? 'offer' : 'offers'}.`, offers: list };
    } },
  { name: 'list_decisions', write: false, title: 'Decisions waiting',
    description: 'The exceptions auto mode will not decide on its own (date changes, requests outside the limits, profiles held back), each with the recommended answer, the reason, and the options to pass to decide.',
    inputSchema: { type: 'object', properties: {} },
    run() {
      const m = A.model();
      const list = m.queue.map((q) => ({ id: q.id, kind: q.k, asked: F.when(q.at), request: q.t(m), recommended: q.rec, why: q.why(m),
        options: q.acts.map((a) => ({ option: a[0], label: a[1] })) }));
      return { summary: list.length ? `${list.length} waiting.` : 'Nothing waiting. That is how it should look.', decisions: list };
    } },
  { name: 'get_activity', write: false, title: 'Activity log',
    description: 'What auto mode did, newest first, in plain sentences. Entries made through Claude or ChatGPT say so.',
    inputSchema: { type: 'object', properties: {
      limit: { type: 'integer', minimum: 1, maximum: 100, description: 'How many entries. Default 20.' },
      kind: { type: 'string', enum: ['all', 'rooms', 'creators', 'payments', 'hotel'], description: 'Filter. Default all.' } } },
    run({ limit = 20, kind = 'all' }) {
      const K = { rooms: ['list', 'close'], creators: ['match', 'cancel', 'content'], payments: ['pay'], hotel: ['you'] };
      const rows = A.model().log.filter((e) => kind === 'all' || K[kind].includes(e.kind)).slice(0, limit);
      return { entries: rows.map((e) => ({ id: e.id, when: F.when(e.at), what: e.t, via: e.via, undone: e.undoneAt ? F.when(e.undoneAt) : undefined, can_undo: !!(e.act && e.act.k === 'undo') })) };
    } },
  { name: 'get_results', write: false, title: 'Results',
    description: 'What auto mode produced. Every figure is labelled measured (counted from real records) or estimate (worked out). Bookings are only reported when booking tracking is live.',
    inputSchema: { type: 'object', properties: {} },
    run() {
      const S = A.state(), m = A.model();
      if (!m.done.length) return { summary: 'No results yet. They start once the first creator stay has ended.' };
      const share = A.emptyShare(S.set), tracked = ctx.UKTRACK ? ctx.UKTRACK.isLive() : true;
      return {
        measured: { nights_filled: m.nights, stays_completed: m.done.length, posts: m.posts.length, views: m.views, clicks_to_booking_page: m.clicks,
          rooms_given_at_own_rate: F.money(m.given), paid_to_creators: F.money(m.paidSum),
          bookings: tracked ? { stayed: m.bStayed, stayed_value: F.money(m.rStayed), still_to_stay: m.bPend, still_to_stay_value: F.money(m.rPend) } : 'Not tracked: booking tracking is not live for this hotel' },
        estimate: { nights_that_would_have_stayed_empty: `about ${Math.round(m.nights * share)} of ${m.nights}`,
          basis: `Last winter, ${Math.round(share * 100)}% of rooms still unsold ${S.set.close} days out stayed empty.` }
      };
    } },
  { name: 'get_limits', write: false, title: 'Limits',
    description: 'The hotel\'s limits for auto mode: stays per month, room types, blackout dates, when rooms can be offered, and the minimum creator rating.',
    inputSchema: { type: 'object', properties: {} },
    run() { return limitsOut(A.state().set); } },
  { name: 'preview_limits', write: false, title: 'Preview limit changes',
    description: 'Replay proposed limits over the last three months of the hotel\'s calendar without saving anything. Use before set_limits to show the hotel what a change would do.',
    inputSchema: limitsSchema(),
    run(args) {
      const set = mergeLimits(JSON.parse(JSON.stringify(A.state().set)), args);
      return { note: 'Nothing saved. "Went empty" is measured from the calendar; "would fill" is an estimate, the most it could have done.',
        limits: limitsOut(set), months: A.preview(set).map((r) => ({ month: r.m, went_empty: r.went, would_fill_about: r.filled, stays: r.stays, nights_that_later_sold: r.sold })) };
    } },
  { name: 'decide', write: true, title: 'Answer a decision',
    description: 'Answer one waiting decision with one of its options (from list_decisions). Confirm the choice with the hotel first unless they already told you which option.',
    inputSchema: { type: 'object', required: ['decision_id', 'option'], properties: {
      decision_id: { type: 'string' }, option: { type: 'string', description: 'One of the option values from list_decisions.' } } },
    run({ decision_id, option }) {
      const m = A.model(), q = m.queue.find((x) => x.id === decision_id);
      if (!q) throw new Refusal(`No waiting decision "${decision_id}". Call list_decisions for the current ones.`);
      if (!q.acts.some((a) => a[0] === option)) throw new Refusal(`"${option}" is not an option here. Options: ${q.acts.map((a) => a[0]).join(', ')}.`);
      act(() => A.decide(decision_id, option));
      return { done: lastDone() };
    } },
  { name: 'set_auto_mode', write: true, title: 'Pause or turn on',
    description: 'Pause auto mode (open offers come down straight away, confirmed stays still go ahead) or turn it back on.',
    inputSchema: { type: 'object', required: ['on'], properties: { on: { type: 'boolean' } } },
    run({ on }) {
      const S = A.state();
      if (S.conn !== 'live') throw new Refusal(modeText(S) + '. Fix the connection first.');
      if (on && S.mode === 'on') return { done: 'Already on.' };
      if (!on && S.mode !== 'on') return { done: 'Already paused.' };
      act(() => (on ? A.turnOn() : A.pause()));
      return { done: lastDone(), undo: 'The hotel can undo this from Activity.' };
    } },
  { name: 'set_limits', write: true, title: 'Change limits',
    description: 'Change one or more limits. Only the fields given change. Applies to new offers only; confirmed stays are never affected. Consider preview_limits first.',
    inputSchema: limitsSchema(),
    run(args) {
      const before = JSON.parse(JSON.stringify(A.state().set)), after = mergeLimits(JSON.parse(JSON.stringify(before)), args);
      const changed = Object.keys(after).filter((k) => JSON.stringify(after[k]) !== JSON.stringify(before[k]));
      if (!changed.length) return { done: 'Nothing to change.' };
      act(() => changed.forEach((k) => A.setLimit(k, after[k])));
      return { done: changed.map((k) => A.LIM_N[k]).join(', ') + ' changed.', limits: limitsOut(A.state().set), undo: 'Each change can be undone from Activity.' };
    } },
  { name: 'take_back_offer', write: true, title: 'Take back an offer',
    description: 'Stop offering a room to creators. Use list_offers for ids.',
    inputSchema: { type: 'object', required: ['offer_id'], properties: { offer_id: { type: 'string' } } },
    run({ offer_id }) {
      const l = A.model().open.find((x) => x.id === offer_id);
      if (!l) throw new Refusal(`No open offer "${offer_id}". Call list_offers.`);
      act(() => A.takeBack(offer_id));
      return { done: `Took back ${room(l.room)}, ${F.range(l.from, l.n)}.`, undo: 'The hotel can undo this from Activity.' };
    } },
  { name: 'cancel_stay', write: true, destructive: true, title: 'Cancel a confirmed stay',
    description: 'Cancel a confirmed creator stay. The creator is told and the room goes back on sale. This cannot be undone, so it needs confirm: true, and you must ask the hotel before sending it.',
    inputSchema: { type: 'object', required: ['stay_id', 'confirm'], properties: {
      stay_id: { type: 'string', description: 'From list_arrivals.' }, confirm: { type: 'boolean', description: 'Must be true. Only after the hotel said yes.' } } },
    run({ stay_id, confirm }) {
      const x = A.model().coming.find((s) => s.id === stay_id);
      if (!x) throw new Refusal(`No confirmed stay "${stay_id}". Call list_arrivals.`);
      if (confirm !== true) throw new Refusal('Not cancelled. Ask the hotel first, then send confirm: true.');
      act(() => A.cancelStay(stay_id));
      return { done: `Cancelled ${cr(x.cr).n}, ${F.range(x.from, x.n)}. The creator is told and the room is back on sale.` };
    } }
];
function limitsSchema() {
  return { type: 'object', properties: {
    max_stays_per_month: { type: 'integer', minimum: 1, maximum: 20 },
    room_types: { type: 'object', description: 'Room type on/off. Keys: ' + ROOM_KEYS.join(', '), properties: Object.fromEntries(ROOM_KEYS.map((k) => [k, { type: 'boolean', description: room(k) }])) },
    offer_from_days_ahead: { type: 'integer', enum: [14, 21, 30, 45, 60] },
    offer_until_days_before: { type: 'integer', enum: [2, 3, 5, 7, 10] },
    who_can_stay: { type: 'string', enum: Object.keys(LEVELS), description: Object.entries(LEVELS).map(([k, v]) => `${k}: ${v}`).join('; ') },
    add_blackout: { type: 'object', required: ['from', 'to'], properties: { from: { type: 'string', format: 'date' }, to: { type: 'string', format: 'date' }, name: { type: 'string' } } },
    remove_blackout: { type: 'string', description: 'Name of a blackout range to remove.' } } };
}
function mergeLimits(set, a) {
  if (a.max_stays_per_month != null) set.max = Math.max(1, Math.min(20, a.max_stays_per_month | 0));
  if (a.room_types) set.rooms = Object.assign({}, set.rooms, Object.fromEntries(Object.entries(a.room_types).filter(([k]) => ROOM_KEYS.includes(k))));
  if (a.offer_from_days_ahead != null) set.ahead = a.offer_from_days_ahead;
  if (a.offer_until_days_before != null) set.close = a.offer_until_days_before;
  if (a.who_can_stay && LEVELS[a.who_can_stay]) set.std = a.who_can_stay;
  if (a.add_blackout) {
    const b = a.add_blackout;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(b.from) || !/^\d{4}-\d{2}-\d{2}$/.test(b.to) || b.to < b.from) throw new Refusal('Blackout dates must be YYYY-MM-DD, with the end on or after the start.');
    set.blackouts = set.blackouts.concat([{ from: b.from, to: b.to, n: b.name || 'Blackout' }]);
  }
  if (a.remove_blackout) {
    const n = set.blackouts.length;
    set.blackouts = set.blackouts.filter((b) => b.n.toLowerCase() !== String(a.remove_blackout).toLowerCase());
    if (set.blackouts.length === n) throw new Refusal(`No blackout called "${a.remove_blackout}".`);
  }
  return set;
}
function limitsOut(set) {
  return { max_stays_per_month: set.max,
    room_types: Object.fromEntries(A.ROOMS.map((r) => [r.k, { name: r.n, on: !!set.rooms[r.k], rooms: r.count, usual_rate: F.money(r.rate) }])),
    offer_from_days_ahead: set.ahead, offer_until_days_before: set.close, who_can_stay: LEVELS[set.std],
    creators_who_qualify_today: A.meeting(set.std),
    blackouts: set.blackouts.map((b) => ({ name: b.n, from: b.from, to: b.to })) };
}

/* ---------------- MCP over stdio ---------------- */
const INSTRUCTIONS = [
  'Runs Ukreate auto mode for one hotel: empty nights become creator stays. The hotel spends empty rooms, not money.',
  'Speak like a hotel manager would: empty nights, creator stays, arrivals. Say which figures are measured and which are estimates.',
  'Before changing anything, check get_status. Recommend, do not decide: for decide and cancel_stay, confirm with the person unless they already told you exactly what to do.',
  'Every change is written to the hotel\'s Activity log under your app name, and most can be undone there.'
].join(' ');
const send = (msg) => process.stdout.write(JSON.stringify(msg) + '\n');
const reply = (id, result) => ({ jsonrpc: '2.0', id, result });
const fail = (id, code, message) => ({ jsonrpc: '2.0', id, error: { code, message } });

function handle(msg) {
  const { id, method, params = {} } = msg;
  if (method === 'initialize') {
    APP = appName(params.clientInfo);
    return reply(id, { protocolVersion: params.protocolVersion || '2025-06-18', capabilities: { tools: { listChanged: false } },
      serverInfo: { name: 'ukreate-auto-mode', title: 'Ukreate auto mode', version: '1.0.0' }, instructions: INSTRUCTIONS });
  }
  if (method === 'ping') return reply(id, {});
  if (method === 'tools/list') {
    return reply(id, { tools: TOOLS.map((t) => ({ name: t.name, title: t.title, description: t.description, inputSchema: t.inputSchema,
      annotations: { title: t.title, readOnlyHint: !t.write, destructiveHint: !!t.destructive, idempotentHint: !t.write, openWorldHint: false } })) });
  }
  if (method === 'tools/call') {
    const t = TOOLS.find((x) => x.name === params.name);
    if (!t) return fail(id, -32602, `Unknown tool: ${params.name}`);
    try {
      gate(t.write);
      const out = t.run(params.arguments || {});
      return reply(id, { content: [{ type: 'text', text: JSON.stringify(out, null, 2) }], structuredContent: out });
    } catch (e) {
      if (!(e instanceof Refusal)) log(t.name, e.stack || e.message);
      return reply(id, { isError: true, content: [{ type: 'text', text: e instanceof Refusal ? e.message : 'Something went wrong: ' + e.message }] });
    }
  }
  if (id === undefined || id === null) return null;   /* notifications need no answer */
  return fail(id, -32601, `Method not found: ${method}`);
}

/* stdio: Claude Desktop, Claude Code, Codex and Gemini start this file themselves */
readline.createInterface({ input: process.stdin }).on('line', (line) => {
  if (!line.trim()) return;
  let msg; try { msg = JSON.parse(line); } catch { return send(fail(null, -32700, 'Parse error')); }
  (Array.isArray(msg) ? msg : [msg]).forEach((m) => { const r = handle(m); if (r) send(r); });
});
process.stdin.on('end', () => { server.close(); process.exit(0); });
log('ready');
