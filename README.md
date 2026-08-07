# Ukreate 2.0

Ukreate is a two-sided marketplace for hosted stays. A hotel offers nights it was
unlikely to sell; a travel creator shoots the property and hands over content the
hotel keeps and posts on its own channels. One trade, two sides, and the record
of what it produced.

This repository holds two things:

1. **The web app** — the hotel dashboard and the creator dashboard.
2. **The marketing pages** — the public landing pages.

They share `assets/`, and they are told apart by file prefix (see below).

---

## Running it

    python3 serve.py

Then <http://localhost:8080/>. Any static file server works; `serve.py` adds
no-cache headers and one JSON endpoint used by the in-app assistant.

There is no build step. No bundler, no framework, no `npm install` required to
run the site. Edit a file, reload the page.

---

## The web app

Plain-JavaScript single-page apps. Each view is a function that returns an HTML
string; a click handler mutates state and repaints. State lives per view in a
private `S` object.

| Route | What it is |
| --- | --- |
| `/app/` | Hotel dashboard — stays, creators, collaborations, content library, bookings & ROI |
| `/creator/` | Creator dashboard — pitching, collaborations, earnings, media kit |
| `/login/` · `/signin/` · `/join/` | Hotel-side auth |
| `/creator/login/` | Creator-side auth |
| `/start/` · `/creator/start/` | Onboarding for each side |
| `/terms/` | Terms of service |

**Everything the app loads is prefixed `uk`** — `ukapp.js`, `ukcdash.js`,
`ukstaycard.js`, `ukapp.css`, `ukcreator.css`. That prefix is the boundary: if a
file starts with `uk`, it belongs to the app.

Modules worth knowing before you touch anything:

- `assets/js/ukshared.js` — the vocabularies both sides must agree on (what a
  creator shoots, what they make, where they post) and `UKShared`, the single
  record for a collaboration that genuinely exists on both sides.
- `assets/js/ukstaycard.js` — **the** stay card. Both apps render it. A hotel
  card is the same component with the stay's own detail left off. Do not write a
  second one.
- `assets/js/ukchart.js` — every chart in the product. Area, capsules, ring,
  semi-gauge, segmented bar, sparkline, ranked list, bubbles, podium, split,
  score arc, meter.
- `assets/js/ukdata.js` / `ukcdata.js` — seeded demo data for each side. **This
  is where the fake data lives.** Wiring a real API means replacing these two.
- `assets/js/ukattrib.js` — booking attribution. `ukinvite.js`, `ukreviews.js`,
  `ukfavs.js`, `uknotify.js`, `ukpitchin.js` are the cross-app records, all
  backed by `localStorage` under the shared origin.

Handler order matters. The click chain in `ukapp.js` / `ukcapp.js` is linear and
first match wins, so a control nested inside a clickable card must be answered
before the card.

## The marketing pages

| Route | Status |
| --- | --- |
| `/for-creators/` | Finished — the Creator Pro membership page |
| `/` | **Placeholder.** An index of the repo, not a real home page |
| `/philosophy-demo/` | Motion prototype |

These load their own stack — `aeronav`, `forcreators`, `cylinder`, `magnetic`,
`creator-orbit`, `philovideo`, `fc-shared` — plus their own media under
`assets/img/fc`, `assets/img/fc2` and `assets/video`. None of it is `uk`-prefixed.

The only files shared with the app are `globe-originkit.js`, the `assets/img/fc`
photography and `assets/js/vendor/`. If the marketing site is ever split into its
own repository, those three are the whole of the untangling.

---

## Conventions

- **Paths are root-relative.** `/assets/…`, `/app/`, `/creator/`. The repository
  root is the web root; do not nest the site under a sub-folder without rewriting
  them.
- **Cache-busting is manual.** Script and stylesheet tags carry `?v=N`. Bump it
  when you change the file, or the browser will keep the old one.
- **No colour is invented at the call site.** Tokens live in `ukapp.css`
  (`:root`) for the app and `forcreators.css` for marketing. Charts use exactly
  three: `--c1` teal for the live reading, `--c2` gold for the one waiting on
  someone, `--c3` green for the settled one.
- **Two typefaces.** Marcellus for display and numbers, Lato for everything else.

## Known gaps

- The marketing home page at `/` is a placeholder.
- The in-app assistant (`ukask.js` / `ukaskbrain.js`) runs a local, deterministic
  conversation engine. `serve.py` has an Anthropic-backed path, but with no API
  key present it falls back to the local engine and the response carries
  `"mock": true`.
- `assets/data/` and the seeded records in `ukdata.js` / `ukcdata.js` are
  demonstration data, not a database.
- `assets/video/` is ~54 MB. If repository size becomes a problem, that is the
  first thing to move to a CDN or Git LFS.

## Layout

    app/            hotel dashboard
    creator/        creator dashboard (+ start/, login/)
    start/ join/ login/ signin/ terms/
    for-creators/   marketing
    philosophy-demo/
    index.html      placeholder home page
    assets/
      css/ js/ img/ video/ font/ data/ vendor/
    tools/          screenshot.mjs — Playwright capture used during design review
    serve.py
