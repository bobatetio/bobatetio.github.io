# Ukreate and Cloudbeds

Auto mode's connection to the hotel's Cloudbeds PMS. It reads the calendar, and keeps Cloudbeds in step with auto mode: every confirmed creator stay is a reservation in Cloudbeds, so the creator is on the hotel's own arrivals list, and nothing else Ukreate made is. No dependencies, Node 18+.

## Try it now, without keys

```
CB_SANDBOX=1 node cloudbeds/server.mjs
```

Runs a stand-in Cloudbeds on this computer (sandbox.mjs): an approval screen marked Sandbox, a sample property with four room types and real-looking availability, reservations, room blocks and webhooks. In the app: Auto mode, Connect Cloudbeds.

## How it works

| Auto mode needs | Cloudbeds API (v1.3) |
|---|---|
| Hotel connects once | API key automatic delivery: approve in Cloudbeds, code exchanged at `hotels.cloudbeds.com/api/v1.3/access_token` for a `cbat_` key, sent as `Authorization: Bearer` |
| Property, room types | `getHotelDetails`, `getRoomTypes` |
| Free rooms and rates, night by night | `getRatePlans` with `detailedRates=true` |
| A confirmed creator | `postReservation`: payment `cash`, Ukreate's source (`getSources`), the stay's id as `thirdPartyIdentifier`, the creator-stay rate if `CB_CREATOR_RATE_ID` is set, no confirmation email |
| If a reservation cannot be made | `postRoomBlock` (`blocked_dates`), and the app is told it fell back |
| A creator cancels, or dates move | `putReservation` with `status=canceled` (or `deleteRoomBlock`), then rebook |
| Staying current | `postWebhook` for reservation, room block and availability events; a key check every minute |

Keeping in step is a reconcile: the app sends every confirmed creator stay to `POST /sync`; the service books what is missing, cancels what should not be there, and rebooks anything whose dates or room changed. Sending the same list twice changes nothing.

Ukreate never asks for permission to write rates, so it cannot change one.

## Going live

1. Join the Cloudbeds partner programme (Partner Dev Account) and list Ukreate in the Cloudbeds Marketplace.
2. In the partner app, tick the permissions in `client.mjs` (`SCOPES`; check the exact names against Cloudbeds' scope table) and register the redirect URI `<CB_PUBLIC>/callback`.
3. Put the keys in `cloudbeds/.env`:

```
CLOUDBEDS_CLIENT_ID=...
CLOUDBEDS_CLIENT_SECRET=...
CB_PUBLIC=https://cloudbeds.ukreate.com   # where Cloudbeds can reach this service (webhooks, redirect)
CB_APP=https://app.ukreate.com/app/
CB_CREATOR_RATE_ID=                       # optional: the hotel's zero-rate creator stay plan
```

4. Ask each hotel to add a booking source named "Ukreate" in Cloudbeds, so creator stays are easy to report on.

Not yet verified against a real Cloudbeds account: the exact scope names, the `adults`/`children` format on `postReservation`, and the `deleteRoomBlock` / `deleteWebhook` method names. The sandbox follows the documented shapes; check these on a partner test property first.

## Tests

```
node cloudbeds/test.mjs
```
