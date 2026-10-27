/* Ukreate and Cloudbeds: the API calls, against Cloudbeds' documented API (v1.3).

   Connecting uses Cloudbeds' recommended "API key automatic delivery": the hotel
   approves Ukreate in Cloudbeds, comes back with a one-time code, and the code is
   exchanged for a long-lived key (cbat_...) sent as "Authorization: Bearer".
   Every request body is form-encoded, as Cloudbeds requires.

   Permissions asked for are only what auto mode uses: read rooms, rates and
   reservations; write reservations and room blocks; manage webhooks. Rate writes
   (patchRate) are deliberately never requested, so Ukreate cannot change a rate
   even by mistake.

   SANDBOX: every https URL goes through u(). With CB_PROVIDER_BASE set,
   https://host/path becomes <base>/host/path, which is how sandbox.mjs stands in
   for Cloudbeds without changing the code that talks to the real thing. */

const BASE = process.env.CB_PROVIDER_BASE || '';
export const u = (url) => (BASE ? url.replace(/^https:\/\//, BASE.replace(/\/$/, '') + '/') : url);
export const API = 'https://api.cloudbeds.com/api/v1.3/';
export const AUTH_URL = 'https://api.cloudbeds.com/api/v1.3/oauth';
export const TOKEN_URL = 'https://hotels.cloudbeds.com/api/v1.3/access_token';
/* the permissions to tick in the Cloudbeds partner app. read:rate, write:reservation
   and delete:roomblock are as Cloudbeds' reference names them; check the exact
   names of the rest against the "About PMS API" scope table when registering. */
export const SCOPES = ['read:hotel', 'read:roomtype', 'read:room', 'read:rate', 'read:reservation', 'write:reservation',
  'read:roomblock', 'write:roomblock', 'delete:roomblock', 'read:source', 'read:webhook', 'write:webhook', 'delete:webhook'];

export class CloudbedsError extends Error {
  constructor(status, message, retryable) { super(message); this.status = status; this.retryable = !!retryable; }
}

/* one call: form bodies, a bearer key, Cloudbeds' { success, data, message } envelope */
export async function call(key, method, name, params = {}) {
  const flat = flatten(params);
  let url = u(API + name), body;
  if (method === 'GET' || method === 'DELETE') { const q = new URLSearchParams(flat).toString(); if (q) url += '?' + q; }
  else body = new URLSearchParams(flat).toString();
  let res;
  try {
    res = await fetch(url, { method, body, headers: Object.assign({ Authorization: 'Bearer ' + key },
      body ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}) });
  } catch (e) { throw new CloudbedsError(0, 'Could not reach Cloudbeds: ' + e.message, true); }
  const text = await res.text();
  let data = null; try { data = JSON.parse(text); } catch {}
  if (!res.ok || (data && data.success === false)) {
    const msg = (data && (data.message || data.error)) || text || res.statusText;
    throw new CloudbedsError(res.status, `Cloudbeds ${name} said ${res.status}: ${String(msg).slice(0, 300)}`, res.status === 429 || res.status >= 500);
  }
  return data;
}
/* Cloudbeds reads nested params as rooms[0][roomTypeID]=... */
function flatten(o, pre = '', out = {}) {
  for (const [k, v] of Object.entries(o)) {
    if (v === undefined || v === null) continue;
    const key = pre ? `${pre}[${k}]` : k;
    if (typeof v === 'object') flatten(v, key, out); else out[key] = String(v);
  }
  return out;
}

export function authUrl(cfg, redirect, state) {
  /* as documented: client_id, redirect_uri, state. Permissions are chosen once in the
     partner app's settings, not sent here. */
  return u(AUTH_URL + '?' + new URLSearchParams({ client_id: cfg.id, redirect_uri: redirect, state }));
}
export async function exchange(cfg, code, redirect) {
  let res;
  try {
    res = await fetch(u(TOKEN_URL), { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:api-key', client_id: cfg.id, client_secret: cfg.secret, redirect_uri: redirect, code }) });
  } catch (e) { throw new CloudbedsError(0, 'Could not reach Cloudbeds: ' + e.message, true); }
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) throw new CloudbedsError(res.status, 'Cloudbeds did not issue a key: ' + (data.error_description || data.error || res.status));
  return data.access_token;   /* cbat_... */
}

/* ---------- what auto mode reads ---------- */
export async function property(key) {
  const r = await call(key, 'GET', 'getHotelDetails');
  const d = r.data || {};
  return { id: String(d.propertyID || ''), name: d.propertyName || 'Your property', currency: (d.propertyCurrency && d.propertyCurrency.currencyCode) || null };
}
export async function roomTypes(key, propertyID) {
  const r = await call(key, 'GET', 'getRoomTypes', { propertyIDs: propertyID });
  return (r.data || []).map((t) => ({ id: String(t.roomTypeID), name: t.roomTypeName, units: +(t.roomTypeUnits || 0) }));
}
/* night-by-night free rooms and the lowest base rate, per room type */
export async function calendar(key, propertyID, from, to) {
  const types = await roomTypes(key, propertyID);
  const r = await call(key, 'GET', 'getRatePlans', { propertyIDs: propertyID, startDate: from, endDate: to, detailedRates: 'true' });
  const byType = {};
  for (const t of types) byType[t.id] = { id: t.id, name: t.name, units: t.units, nights: {} };
  for (const plan of r.data || []) {
    const t = byType[String(plan.roomTypeID)]; if (!t) continue;
    for (const d of plan.roomRateDetailed || []) {
      const n = t.nights[d.date] || (t.nights[d.date] = { free: +d.roomsAvailable, rate: null });
      n.free = Math.max(n.free, +d.roomsAvailable);
      const rate = +(d.rateBase || d.totalRate);
      if (!plan.isDerived && rate && (n.rate === null || rate < n.rate)) n.rate = rate;
    }
  }
  return Object.values(byType);
}
export async function sourceId(key, propertyID, name = 'Ukreate') {
  const r = await call(key, 'GET', 'getSources', { propertyIDs: propertyID });
  const s = (r.data || []).find((x) => String(x.sourceName || '').toLowerCase().includes(name.toLowerCase()));
  /* a primary source is sent with "-1" appended (Cloudbeds' Reservation FAQs) */
  return s ? String(s.sourceID) + (s.isThirdParty ? '' : '-1') : null;
}

/* ---------- what auto mode writes ----------
   A confirmed creator becomes a real reservation, so they appear on the hotel's
   own Cloudbeds arrivals list: paid as "cash" so no card is needed, tagged with
   Ukreate's source and the stay's id, on the hotel's creator-stay rate when it has
   one, and with no confirmation email to the creator from the hotel's system. */
export async function book(key, propertyID, hold) {
  const r = await call(key, 'POST', 'postReservation', {
    propertyID, sourceID: hold.sourceID || undefined, thirdPartyIdentifier: hold.id,
    startDate: hold.from, endDate: hold.to,
    guestFirstName: hold.firstName, guestLastName: hold.lastName, guestEmail: hold.email, guestCountry: hold.country || 'US', guestZip: hold.zip || '00000',
    rooms: [{ roomTypeID: hold.roomTypeID, quantity: 1, roomRateID: hold.rateID || undefined }],
    adults: [{ roomTypeID: hold.roomTypeID, quantity: hold.guests || 1 }], children: [{ roomTypeID: hold.roomTypeID, quantity: 0 }],
    paymentMethod: 'cash', sendEmailConfirmation: 'false',
    guestRequirements: 'Ukreate creator stay. No charge for the room.'
  });
  return { kind: 'reservation', ref: String(r.reservationID) };
}
export async function cancelReservation(key, reservationID) {
  await call(key, 'PUT', 'putReservation', { reservationID, status: 'canceled' });
}
/* the fallback when a reservation cannot be made: the room comes out of sale */
export async function block(key, propertyID, hold) {
  const r = await call(key, 'POST', 'postRoomBlock', { propertyID, roomBlockType: 'blocked_dates',
    roomBlockReason: 'Ukreate creator stay: ' + hold.firstName + ' ' + hold.lastName, startDate: hold.from, endDate: hold.to,
    rooms: [{ roomTypeID: hold.roomTypeID }] });
  return { kind: 'block', ref: String(r.roomBlockID) };
}
export async function unblock(key, propertyID, roomBlockID) {
  await call(key, 'DELETE', 'deleteRoomBlock', { propertyID, roomBlockID });
}

/* ---------- staying current ---------- */
export const EVENTS = [['reservation', 'created'], ['reservation', 'status_changed'], ['reservation', 'dates_changed'],
  ['reservation', 'deleted'], ['roomblock', 'created'], ['roomblock', 'removed'], ['availability', 'closeout_changed']];
export async function subscribe(key, propertyID, endpointUrl) {
  const ids = [];
  for (const [object, action] of EVENTS) {
    const r = await call(key, 'POST', 'postWebhook', { propertyID, object, action, endpointUrl });
    ids.push(String(r.data && r.data.subscriptionID || r.subscriptionID));
  }
  return ids;
}
export async function unsubscribe(key, propertyID, ids) {
  for (const id of ids || []) await call(key, 'DELETE', 'deleteWebhook', { propertyID, subscriptionID: id }).catch(() => {});
}
