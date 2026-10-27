/* A stand-in Cloudbeds for the sandbox and the tests.

   Answers at <base>/<real host>/<real path>, the way client.mjs rewrites its URLs
   when CB_PROVIDER_BASE is set, and holds Ukreate to the documented contract:
   a one-time code exchanged for a cbat_ key, a bearer key on every call, form
   bodies, postReservation's required fields and payment methods, availability
   that actually runs out, and webhooks posted to whatever was subscribed.

   Test hooks (sandbox only):
     POST /__sandbox/book?roomType=Deluxe%20king&from=&to=   a guest books through another channel
     POST /__sandbox/cancel?reservationID=                     the hotel cancels inside Cloudbeds
     POST /__sandbox/revoke                                    the hotel disconnects Ukreate in Cloudbeds
     POST /__sandbox/fail?method=postReservation&n=1&status=400
     GET  /__sandbox/state                                     reservations, blocks and webhooks, for tests */
import http from 'node:http';
import crypto from 'node:crypto';

const ASSETS = (process.env.CB_ASSETS || 'http://localhost:4399').replace(/\/$/, '');
const rand = (n = 8) => crypto.randomBytes(n).toString('hex');
const PROPERTY = { propertyID: '198765', propertyName: 'MiraGrace Estate', propertyCurrency: { currencyCode: 'USD' } };
const TYPES = [
  { roomTypeID: '501', roomTypeName: 'Garden suite', roomTypeUnits: 12, rate: 420 },
  { roomTypeID: '502', roomTypeName: 'Deluxe king', roomTypeUnits: 30, rate: 310 },
  { roomTypeID: '503', roomTypeName: 'Ocean view suite', roomTypeUnits: 8, rate: 560 },
  { roomTypeID: '504', roomTypeName: 'Spa villa', roomTypeUnits: 4, rate: 890 }
];
let S;
function reset() { S = { codes: new Set(), keys: new Set(), reservations: [], blocks: [], hooks: [], fail: {} }; }
reset();

const nights = (from, to) => { const out = []; for (let d = new Date(from + 'T00:00:00Z'); d < new Date(to + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + 1)) out.push(d.toISOString().slice(0, 10)); return out; };
/* a steady base occupancy so the calendar looks like a real hotel's, always
   leaving a room free: the app's demo calendar lists nights as empty, and the
   sandbox should agree with it. A sold-out night is tested with __sandbox/fail. */
const baseTaken = (t, date) => { const h = crypto.createHash('md5').update(t.roomTypeID + date).digest()[0]; const wd = new Date(date + 'T00:00:00Z').getUTCDay();
  return Math.min(t.roomTypeUnits - 1, Math.round(t.roomTypeUnits * ((wd === 5 || wd === 6 ? 0.85 : 0.6) + (h / 255) * 0.15))); };
function free(t, date) {
  const live = S.reservations.filter((r) => r.status !== 'canceled' && r.roomTypeID === t.roomTypeID && nights(r.startDate, r.endDate).includes(date)).length;
  const held = S.blocks.filter((b) => b.roomTypeID === t.roomTypeID && nights(b.startDate, b.endDate).includes(date)).length;
  return Math.max(0, t.roomTypeUnits - baseTaken(t, date) - live - held);
}
function fire(event, extra) {
  for (const h of S.hooks) if (h.object + '/' + h.action === event) {
    fetch(h.endpointUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.assign({ version: '1.0', event, timestamp: Date.now() / 1000, propertyID: PROPERTY.propertyID }, extra)) }).catch(() => {});
  }
}

const read = (req) => new Promise((ok) => { let b = ''; req.on('data', (c) => { b += c; }); req.on('end', () => ok(b)); });
const send = (res, code, o, head) => { res.writeHead(code, Object.assign({ 'Content-Type': 'application/json' }, head || {})); res.end(o === undefined ? '' : JSON.stringify(o)); };
/* rooms[0][roomTypeID]=x back into { rooms:[{ roomTypeID:x }] } */
function unflatten(params) {
  const out = {};
  for (const [k, v] of params) {
    const parts = k.split(/\[|\]/).filter(Boolean); let o = out;
    parts.forEach((p, i) => { if (i === parts.length - 1) o[p] = v; else o = o[p] = o[p] || (/^\d+$/.test(parts[i + 1]) ? [] : {}); });
  }
  return out;
}

function consent(q) {
  const allow = `/__approve?redirect_uri=${encodeURIComponent(q.get('redirect_uri'))}&state=${encodeURIComponent(q.get('state') || '')}`;
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Cloudbeds (sandbox)</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f5f3ef;font:15px/1.5 -apple-system,Segoe UI,Lato,sans-serif;color:#102e37}
.c{width:min(440px,calc(100% - 32px));background:#fff;border:1px solid rgba(16,46,55,.12);border-radius:20px;padding:28px;box-shadow:0 20px 50px -20px rgba(16,46,55,.25)}
.s{display:inline-block;padding:4px 9px;border-radius:99px;background:#fbeed2;color:#8a6414;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
.l{display:flex;align-items:center;gap:12px;margin:18px 0 12px}.l img{width:44px;height:44px;border-radius:22.5%}
h1{font-size:20px;margin:0}p,ul{color:#5f6367;margin:6px 0 0}ul{padding-left:18px}
.a{display:flex;gap:10px;margin-top:22px}.a a{flex:1;text-align:center;padding:12px;border-radius:12px;text-decoration:none;font-weight:700}
.y{background:#102e37;color:#fff}.n{border:1px solid rgba(16,46,55,.2);color:#102e37}</style></head>
<body><div class="c"><span class="s">Sandbox</span>
<div class="l"><img src="${ASSETS}/assets/img/uk/pms/cloudbeds.png" alt=""><h1>Connect Ukreate to ${PROPERTY.propertyName}?</h1></div>
<p>This stands in for Cloudbeds' own app approval while Ukreate has no Cloudbeds partner keys.</p>
<ul><li>Read rooms, rates and reservations</li><li>Add creator stays as reservations, and cancel them</li><li>Ukreate cannot change your rates</li></ul>
<div class="a"><a class="n" href="${allow}&deny=1">Cancel</a><a class="y" href="${allow}">Connect app</a></div></div></body></html>`;
}

async function route(req, res) {
  const url = new URL(req.url, 'http://x'), p = url.pathname, q = url.searchParams, M = req.method;

  /* test hooks */
  if (p === '/__sandbox/state') return send(res, 200, { reservations: S.reservations, blocks: S.blocks, hooks: S.hooks });
  if (p === '/__sandbox/reset') { reset(); return send(res, 200, { ok: true }); }
  if (p === '/__sandbox/revoke') { S.keys.clear(); return send(res, 200, { ok: true }); }
  if (p === '/__sandbox/fail') { S.fail[q.get('method')] = { n: +q.get('n') || 1, status: +q.get('status') || 500 }; return send(res, 200, { ok: true }); }
  if (p === '/__sandbox/book') {
    const t = TYPES.find((x) => x.roomTypeName === q.get('roomType')) || TYPES[1];
    const r = { reservationID: 'R' + rand(4), roomTypeID: t.roomTypeID, startDate: q.get('from'), endDate: q.get('to'), status: 'confirmed', source: 'Expedia', guest: 'Outside guest' };
    S.reservations.push(r); fire('reservation/created', { reservationID: r.reservationID }); return send(res, 200, r);
  }
  if (p === '/__sandbox/cancel') {
    const r = S.reservations.find((x) => x.reservationID === q.get('reservationID'));
    if (r) { r.status = 'canceled'; fire('reservation/status_changed', { reservationID: r.reservationID, status: 'canceled' }); }
    return send(res, 200, { ok: !!r });
  }

  /* approving the app, and the key exchange */
  if (M === 'GET' && p === '/api.cloudbeds.com/api/v1.3/oauth') { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); return res.end(consent(q)); }
  if (M === 'GET' && p === '/__approve') {
    const back = new URL(q.get('redirect_uri')); back.searchParams.set('state', q.get('state'));
    if (q.get('deny')) back.searchParams.set('error', 'access_denied'); else { const c = 'code' + rand(); S.codes.add(c); back.searchParams.set('code', c); }
    res.writeHead(302, { Location: back.toString() }); return res.end();
  }
  if (M === 'POST' && p === '/hotels.cloudbeds.com/api/v1.3/access_token') {
    const f = Object.fromEntries(new URLSearchParams(await read(req)));
    if (f.grant_type !== 'urn:ietf:params:oauth:grant-type:api-key') return send(res, 400, { error: 'unsupported_grant_type' });
    if (!S.codes.has(f.code)) return send(res, 400, { error: 'invalid_grant', error_description: 'code unknown, used or expired' });
    S.codes.delete(f.code); const key = 'cbat_' + rand(14); S.keys.add(key);
    return send(res, 200, { access_token: key, token_type: 'Bearer' });
  }

  /* the API */
  const m = p.match(/^\/api\.cloudbeds\.com\/api\/v1\.3\/(\w+)$/);
  if (!m) return send(res, 404, { success: false, message: 'sandbox has no ' + M + ' ' + p });
  const name = m[1];
  if (!S.keys.has((req.headers.authorization || '').replace(/^Bearer /, ''))) return send(res, 401, { success: false, message: 'Invalid or revoked API key' });
  const f = S.fail[name];
  if (f && f.n > 0) { f.n--; return send(res, f.status, { success: false, message: 'sandbox: forced failure of ' + name }); }
  const raw = M === 'GET' || M === 'DELETE' ? url.searchParams : new URLSearchParams(await read(req));
  const P = unflatten(raw);

  if (name === 'getHotelDetails') return send(res, 200, { success: true, data: PROPERTY });
  if (name === 'getRoomTypes') return send(res, 200, { success: true, data: TYPES.map(({ rate, ...t }) => t) });
  if (name === 'getSources') return send(res, 200, { success: true, data: [
    { sourceID: 's-1', sourceName: 'Walk-In', isThirdParty: false }, { sourceID: 's-4', sourceName: 'Expedia', isThirdParty: true },
    { sourceID: 's-9', sourceName: 'Ukreate', isThirdParty: false }] });
  if (name === 'getRatePlans') {
    if (!P.startDate || !P.endDate) return send(res, 400, { success: false, message: 'startDate and endDate are required' });
    const ds = nights(P.startDate, P.endDate);
    const data = [];
    for (const t of TYPES) {
      const detail = (k) => ds.map((date) => ({ date, rateBase: Math.round(t.rate * k), totalRate: Math.round(t.rate * k), roomsAvailable: free(t, date), closedToArrival: false, minLos: 1, maxLos: 30 }));
      data.push({ rateID: t.roomTypeID + '01', isDerived: false, roomTypeID: t.roomTypeID, roomTypeName: t.roomTypeName, roomsAvailable: Math.min(...ds.map((d) => free(t, d))), ratePlanNamePublic: 'Best available', roomRateDetailed: P.detailedRates === 'true' ? detail(1) : undefined });
      data.push({ rateID: t.roomTypeID + '02', isDerived: true, roomTypeID: t.roomTypeID, roomTypeName: t.roomTypeName, roomsAvailable: Math.min(...ds.map((d) => free(t, d))), ratePlanNamePublic: 'Members', roomRateDetailed: P.detailedRates === 'true' ? detail(0.9) : undefined });
    }
    return send(res, 200, { success: true, data });
  }
  if (name === 'postReservation') {
    const need = ['startDate', 'endDate', 'guestFirstName', 'guestLastName', 'guestCountry', 'guestZip', 'guestEmail', 'paymentMethod'];
    const miss = need.filter((k) => !P[k]);
    if (!P.rooms || !P.rooms[0] || !P.rooms[0].roomTypeID || !P.rooms[0].quantity) miss.push('rooms');
    if (miss.length) return send(res, 400, { success: false, message: 'Missing required: ' + miss.join(', ') });
    if (!['cash', 'credit', 'ebanking', 'pay_pal'].includes(P.paymentMethod)) return send(res, 400, { success: false, message: 'Invalid paymentMethod' });
    const t = TYPES.find((x) => x.roomTypeID === P.rooms[0].roomTypeID);
    if (!t) return send(res, 400, { success: false, message: 'Unknown roomTypeID' });
    if (nights(P.startDate, P.endDate).some((d) => free(t, d) < 1)) return send(res, 400, { success: false, message: 'No availability for the requested dates' });
    const r = { reservationID: 'R' + rand(4), roomTypeID: t.roomTypeID, startDate: P.startDate, endDate: P.endDate, status: 'confirmed',
      source: P.sourceID, thirdPartyIdentifier: P.thirdPartyIdentifier, guest: P.guestFirstName + ' ' + P.guestLastName, paymentMethod: P.paymentMethod };
    S.reservations.push(r); fire('reservation/created', { reservationID: r.reservationID });
    return send(res, 200, { success: true, reservationID: r.reservationID, status: 'confirmed', guestFirstName: P.guestFirstName, guestLastName: P.guestLastName, startDate: P.startDate, endDate: P.endDate, grandTotal: 0 });
  }
  if (name === 'putReservation') {
    const r = S.reservations.find((x) => x.reservationID === P.reservationID);
    if (!r) return send(res, 404, { success: false, message: 'Reservation not found' });
    if (P.status) { r.status = P.status; fire('reservation/status_changed', { reservationID: r.reservationID, status: r.status }); }
    return send(res, 200, { success: true });
  }
  if (name === 'postRoomBlock') {
    if (!['blocked_dates', 'out_of_service', 'courtesy_hold'].includes(P.roomBlockType)) return send(res, 400, { success: false, message: 'Invalid roomBlockType' });
    const b = { roomBlockID: 'B' + rand(4), roomTypeID: P.rooms && P.rooms[0] && P.rooms[0].roomTypeID, startDate: P.startDate, endDate: P.endDate, reason: P.roomBlockReason };
    S.blocks.push(b); fire('roomblock/created', { roomBlockID: b.roomBlockID });
    return send(res, 200, { success: true, roomBlockID: b.roomBlockID });
  }
  if (name === 'deleteRoomBlock') {
    const n = S.blocks.length; S.blocks = S.blocks.filter((b) => b.roomBlockID !== P.roomBlockID);
    if (n === S.blocks.length) return send(res, 404, { success: false, message: 'Room block not found' });
    fire('roomblock/removed', { roomBlockID: P.roomBlockID }); return send(res, 200, { success: true });
  }
  if (name === 'postWebhook') {
    const h = { subscriptionID: 'W' + rand(4), object: P.object, action: P.action, endpointUrl: P.endpointUrl };
    S.hooks.push(h); return send(res, 200, { success: true, data: { subscriptionID: h.subscriptionID } });
  }
  if (name === 'deleteWebhook') { S.hooks = S.hooks.filter((h) => h.subscriptionID !== P.subscriptionID); return send(res, 200, { success: true }); }
  send(res, 404, { success: false, message: 'sandbox does not implement ' + name });
}

export function startSandbox(port) {
  return new Promise((ok) => { const s = http.createServer((q, r) => route(q, r).catch((e) => send(r, 500, { success: false, message: e.message }))); s.listen(port, '127.0.0.1', () => ok(s)); });
}
