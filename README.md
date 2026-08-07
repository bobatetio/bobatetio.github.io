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
| `/creator/` | Creator dashboard — stays, collaborations, earnings, media kit |
| `/login/` · `/signin/` · `/join/` | Hotel-side auth |
| `/creator/login/` | Creator-side auth |
| `/start/` · `/creator/start/` | Standalone onboarding. Superseded, nothing routes here |
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
- `assets/js/ukchips.js` — **the** multi-select picker for a long list. Type,
  and matches are ranked by where they sit in the name, then by size of place.
  Used by `/creator/start/` and by the creator gate for markets covered.
- `assets/js/ukshots.js` — **the** photograph uploader. Drop or browse, tiles with
  remove and Reframe, and a crop editor you drag to set the focal point, which
  writes the cropped file through a canvas. Used by `/start/` and the hotel gate.
- `assets/js/ukplace.js` — **the** place picker. Type, and matching cities drop
  down with their flag; picking one stores a `UKMARKETS` key. Used by the hire
  brief and by onboarding. A city is never free text: typed by hand it arrives as
  four spellings of one place, and a filter cannot tell they are the same.
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

**One object, one home, one state.** This rule is enforced twice on the creator
side, at two different seams.

**A stay lives on one page.** There used to be two: *Discover stays* and *Pitch
Pilot*, rendering the same `D.stays` list. Pitch a hotel from Discover and its
real home silently became the other page, which is the most reliable way to make
someone lose track of something. State is an attribute of an object, not another
place to keep it, so the lanes now filter one list:

    To pitch → Waiting → Replied → Became collabs

`ukcviews.stays()` owns the page; `ukcpitch.js` owns the pipeline behind it and
no longer renders a page of its own. The rail does not appear until something is
in it, so a creator who has sent nothing meets stays rather than four empty lanes
explaining a pipeline they have not started. The browse lane is cards, ranked by
fit, and everything past it is rows, because a record reads as rows.

There is **one composer**, and it writes `UKAPPLY`. There used to be two, writing
to different records: Pitch Pilot's called `D.addPitch` (property-level) while
its own lanes read `UKAPPLY` (stay-specific), so pressing "I sent it" left the
stay in *To pitch* and added a row in *Waiting*. Casa Azul Tulum sat in both at
once. Discover's composer additionally pushed a stage-0 row into `D.collabs`,
which `reconcilePipeline()` then quietly undid on the next load.

**The composer is the hotel's page from the other side.** It uses the hotel
portal's own components, because the hotel portal is the reference: `.ukBack`,
`head()`, `.ukStatusBadge` for whose move it is, `ukGrid--thread` with `.ukFlow`
and `.ukSideCol`, a `.ukPanel_head` carrying the tone as a `.ukSeg` segmented
control, the three facts of the trade as a `.ukPitchIn--row`, and a `.ukComposer`
whose secondary actions sit left and whose send sits right. It reads top to
bottom as the pitch, what goes with it, then send.

**Pitch Pilot is a capability, not a destination.** It finds the hotels, scores
them and writes the letter; the score is on the card and the letter is in the
composer. Nothing in the product routes to it as a place.

**Your collabs** owns the collaboration, and it begins at *Onboarding*, the
moment a hotel says yes. While a pitch is out there is no collaboration, only a
hope. So the creator's list has no Inquiry stage. On the hotel side Inquiry is a real
decision point; from this side it means "waiting on them", which is the Waiting
lane. Having it in both places is what let one hotel sit in two
lists with two different answers — Fjordheim Lodge was `Complete` in one and
`Responded` in the other. `reconcilePipeline()` in `ukcdata.js` enforces the
handoff: an unanswered "collaboration" is recorded as a pitch and leaves the
collab list, and a pitch whose hotel now has a live collaboration stops carrying
a state and carries a pointer to it. The last lane is a receipt, not a status.

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
instead — which is the experience every real user actually has — use the **Demo
view** dock at the bottom-right of either app, or append `?as=new`.

    /app/?as=new        a hotel that signed up five minutes ago
    /creator/?as=new    a creator who has done nothing yet
    /app/?as=live       the default: an account that has been running a while

The cut is **yours versus the market**. In the first-time view your own activity
is empty — no stays, no collaborations, no content, no pitches, no earnings —
but the creator network and the published stays are untouched, because they do
not belong to you and they are the reason you signed up. `ukdemo.js` does the
stripping; the view also implies the onboarding state, since an established
account has by definition already onboarded.

The dock is collapsed until you open it, sits above everything including the
onboarding gate, and steps to the left while the gate is up so it never lands on
the gate's own buttons.

This is a review control, not a product feature. Delete `ukdemo.js` and its two
`strip()` calls to remove it — it mounts itself and handles its own clicks, so
nothing else references it.

### How marketing hands off to the app

The two marketing pages reach the app through their sign-in and sign-up buttons,
and each one goes to **its own audience's door**:

| From | Sign in | Sign up |
| --- | --- | --- |
| `/` (for travel brands) | `/login/` | `/join/?side=hotel` |
| `/for-creators/` | `/creator/login/` | `/join/?side=creator` |

`/join/` reads `?side=` and opens straight into that form. Signing up lands in
`/app/` or `/creator/` and sets `uk_fresh_v1`; the app opens its onboarding gate
on the strength of that and clears it when the gate is finished, so a returning
account is never asked again.

**That flag is the product signal, not the demo one.** Until it existed the only
thing that opened the gate was `?as=new`, so a genuine sign-up landed in the app
and was never asked anything, while the in-app onboarding was reachable only
through the review control.

Sign-up used to submit to `/start/` and `/creator/start/`. Those came before
onboarding moved into the app, and nothing they write is read by the gate, so a
new account answered five screens on a page of its own, landed in the app, and was
asked the same things again. They still work and still render; nothing routes to
them.

### Onboarding

Sign-up lands you in the app, not on a form. Two tiers, in `ukonboard.js`:

**Tier one** is a short gate — a modal over the live app, one question per
screen, with a filled progress bar rather than a row of numbered dots.

    creator   welcome → what you shoot → what you make → connect your platforms
    hotel     welcome → what brings you here → name → city → what you are known for

It asks only for what the product needs in order to tell the truth. Note that
the creator never types a follower count: `ukplatconnect.js` is the connector the
onboarding page has always used — two buckets with a main profile, drag to change
which is main, and an OAuth stand-in that redirects, asks consent, sometimes
fails and can be retried. A connected platform gives the real handle and the real
number, and the **size band falls out of it** rather than being estimated. It also
brings the creator's recent posts across, which is the step's own promise ("we
read your work from them, so there is nothing to upload") being kept: `work()`
returns them newest-and-biggest first, deduped across accounts, in the shape
`ukcdata.js` already stores. That module is shared by the start page and the
gate; do not write a second one.
The city is not typed either: `ukplace.js` is the combobox the hire brief uses, so
a place is chosen from `UKMARKETS` with its flag beside it and stored as a key
rather than a spelling. The creator's **markets you cover** uses `ukchips.js`, the
multi-select picker `/creator/start/` has always used: 1,469 markets ranked on
where the match sits in the name before how big the place is, so Lagos beats a
village that merely contains those letters. Nothing lists until you type, because
fifteen hundred entries are a wall to read rather than a help. The answer reaches
`me.dests`, which is what the matcher scores a stay's city against. The hotel's
photographs are asked for here rather than left on the checklist, because a
property with none is not really listed.

**The modal is one size on every screen** and does not resize between questions,
so Continue never moves under the cursor. The question scrolls; the progress bar
and the buttons do not.

**The welcome is not a question**, and it is built differently for that reason. No
progress bar and no counter, because it is the door rather than the first of five
things being asked; the counter starts at 1/5 on the step after it. Its copy and
mark are centred, its heading is larger, and its one action runs the full width of
the card. The artwork sits BEHIND the step, out of flow, so it sets the height of
nothing and can run down past the copy and behind the button. It is contained,
never cropped, because the fade under it is part of the artwork rather than a
gradient drawn here. Drop a cutout PNG at
`assets/img/onboard-welcome-{hotel,creator}.png` and flip its entry in `ART`;
a side without one renders a placeholder in the same band rather than requesting
a file that is not there, because a 404 on every first paint produces a fallback
that looks exactly like real artwork having failed. Both sides have theirs now.

Behind the modal sits the **marketplace**, not the user's own dashboard. A new
account's dashboard is empty; the creator network and the live stays are not,
and they are the reason someone signed up. `obBackdrop()` switches the view for
exactly this.

**Tier two** is a checklist on the dashboard, under the greeting rather than above
it, because a page that opens on a list of chores has not said hello yet. While
anything is outstanding the line under the greeting is about setup and names what
is actually left, derived from the live checklist rather than fixed.

The rest of the dashboard waits. Everything below the four stats is a reading of
activity — bookings over time, top creators, content you own — and on an account
that has published nothing there is nothing to read; a chart drawn through zeroes
does not look empty, it looks broken. That gate is on **having something to
describe**, not on the checklist being finished: an established hotel that has
simply never used the invite feature still has an outstanding task, and hiding
twenty stays behind it would be absurd.

Every line is asked of the live records — "Publish your first stay" is done when the registry holds
one. It stops rendering entirely once nothing is left, because a finished
checklist is clutter.

Nothing the gate already asked appears on it, and nothing appears on it that a
first-time account has not genuinely left undone. The seeded property's photo and
guest guide survived the first-time strip for a while, so the checklist ticked two
lines of work nobody had done; `ukdata2.js` clears both under `?as=new`. The guest
guide is off the checklist entirely — it is written when a creator is actually
coming, not on day one for a stay that does not exist yet.

The creator's list lost two lines for the same reason. "Connect a platform" is
what the gate asks, and "Add three pieces of work" described a product where you
posted your own samples; connecting is what brings the work across. What is left
on each side is only what the account holder still has to decide.

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
