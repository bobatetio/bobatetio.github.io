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
  creator shoots, what they make, where they post), `UKME` (the signed-in
  creator's public record — the hotel's roster row and her own profile both
  derive from it) and `UKShared`, the single record for a collaboration that
  genuinely exists on both sides.
- `assets/js/ukstays.js` — **the stay registry.** A stay published by a hotel is
  written here, and the creator app reads its Discover list out of it. One shape,
  two readings: `toHotel()` and `toCreator()` are the only translation in the
  system. The seeded stays in each app are the rest of the market.
- `assets/js/ukapply.js` — **applications.** A creator applying to a published
  stay writes here; the hotel reads it as an inquiry and answers on the same
  record, so the creator sees the yes or the no. Distinct from `ukpitchin.js`: a
  pitch has no stay behind it and asks "shall I build one", an application hangs
  off a published stay and asks "yes or no".
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
before the card. (`[data-apply]` sits above `[data-open]` for exactly this
reason — a stay card is clickable and has buttons inside it.)

### How the two sides talk to each other

Every crossing is a record in `localStorage` on the shared origin, read and
written by both apps. Nothing is duplicated per side.

| Record | Direction | What crosses |
| --- | --- | --- |
| `UKSTAYS` | hotel → creator | a published stay appears in Discover |
| `UKAPPLY` | creator → hotel | an application appears as an inquiry; the hotel's yes or no comes back |
| `UKPITCHIN` | creator → hotel | a Pitch Pilot pitch, with no stay behind it |
| `UKINVITE` | hotel → creator | an invitation to a stay; a private stay is one by definition |
| `UKShared` | both | the live collaboration: stage, messages, dates, delivery |
| `UKREVIEWS` | both | neither side sees the other's review until both are in |
| `UKATTRIB` | both | bookings traced to a creator's link or code |
| `UKFAVS` · `UKNOTIFY` | per side | saved items, and notifications derived from all of the above |

To watch a full loop: publish a stay in `/app/`, open `/creator/` in another tab,
apply to it from Discover, then answer it back in `/app/`.

**One object, one home, one state.** The creator side has two lists and they
hand off rather than overlap:

- **Pitch Pilot** owns the outbound phase — to pitch, waiting, replied. While a
  pitch is out there is no collaboration, only a hope.
- **Your collabs** owns the collaboration, and it begins at *Onboarding*, the
  moment a hotel says yes.

So the creator's list has no Inquiry stage. On the hotel side Inquiry is a real
decision point; from this side it means "waiting on them", which is Pitch
Pilot's Waiting lane. Having it in both places is what let one hotel sit in two
lists with two different answers — Fjordheim Lodge was `Complete` in one and
`Responded` in the other. `reconcilePipeline()` in `ukcdata.js` enforces the
handoff: an unanswered "collaboration" is recorded as a pitch and leaves the
collab list, and a pitch whose hotel now has a live collaboration stops carrying
a state and carries a pointer to it. Pitch Pilot's last lane is a receipt, not a
status.

Note that a stay's state comes from an **application**, which is stay-specific,
never from a pitch, which is property-level. MiraGrace offers thirteen stays;
keying on the property name put all thirteen in whatever lane one answered pitch
was in.

**Two id spaces overlap.** Both apps seed stays starting at `s1`, and they mean
different properties — the hotel's `s7` is MiraGrace's, the creator's `s7` is
Casa Boa Vista's. Where a published stay collides with a seeded one belonging to
a *different* property, the incoming stay is namespaced `mg-…` rather than
replacing it. Where the property matches, what the hotel published wins, because
the seed's copy was out of date. Order matters here: `ukcmatch.js` adds the rest
of the market after `ukcdata.js` runs, so the registry is hydrated from there —
hydrating earlier let a hotel stay take an id before the property that already
owned it had loaded.

### Two demo views

The seeded data describes an **established** account. To see the first hour
instead — which is the experience every real user actually has — append
`?as=new`, or use **Demo view** at the bottom of the account menu.

    /app/?as=new        a hotel that signed up five minutes ago
    /creator/?as=new    a creator who has done nothing yet
    /app/?as=live       the default: an account that has been running a while

The cut is **yours versus the market**. In the first-time view your own activity
is empty — no stays, no collaborations, no content, no pitches, no earnings —
but the creator network and the published stays are untouched, because they do
not belong to you and they are the reason you signed up. `ukdemo.js` does the
stripping; the view also implies the onboarding state, since an established
account has by definition already onboarded.

This is a review control, not a product feature. Delete `ukdemo.js`, its two
`strip()` calls and the menu slot to remove it.

### Onboarding

Sign-up lands you in the app, not on a form. Two tiers, in `ukonboard.js`:

**Tier one** is a short gate — a modal over the live app, one question per
screen. It asks only for what the product needs in order to tell the truth: a
creator's subjects and size band (every fit score is computed against the band),
a hotel's name, city and category (what creators read, and what the match runs
on). Four screens for a hotel, three for a creator, deliberately asymmetric — a
property signing up has made a considered decision, a creator is phone-first.

Behind the modal sits the **marketplace**, not the user's own dashboard. A new
account's dashboard is empty; the creator network and the live stays are not,
and they are the reason someone signed up. `obBackdrop()` switches the view for
exactly this.

**Tier two** is a checklist at the top of the dashboard, and every line is asked
of the live records — "Publish your first stay" is done when the registry holds
one. It stops rendering entirely once nothing is left, because a finished
checklist is clutter.

Nothing in it is a new component. The step card, progress rail, intent picker,
pill choices, fields and nav buttons are the ones `/start/` already used, inside
the app's own modal shell.

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
- **The hotel app is the reference.** Where both sides do the same job, the
  hotel's component is the one to use: `head()` and its split variant for page
  headers, `.ukStatusBadge` for whose-move-is-it, `.ukTrack` for the stage rail,
  `.ukTableWrap`/`.ukTable` for tables, `.ukCards` for a card grid, `UKCHART`
  for every chart, and `ukstaycard.js` for a stay or a hotel. Before building
  something, check whether `/app/` already has it.

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
