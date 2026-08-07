/* Ukreate — creator onboarding, moment one.

   Two moments, the same principle the hotel side uses: ask only what is needed to
   reach the payoff, and let the profile collect the rest later. What changed here is
   which questions belong in moment one at all.

   The old step one asked seven things — niche, one platform, one handle, one follower
   band, travel type, age, interests — and the payoff was a thin final screen. Age,
   travel type and interests have moved to the profile. What is left is the set that
   actually decides a match:

     who they are  ·  every platform they post on, each with its own reach
     what they shoot (many, not one)  ·  where they are headed

   The last of those is new and is the point of the whole rework: a travel creator's
   value is that they GO places. Matching on where they live was always the wrong
   model. Destinations are what put a creator in front of the right hotel.

   And the weight is inverted: setup is short, the work-and-matches reveal is the hero.

   Voice: mentor, not gatekeeper. The "am I big enough" fear gets answered before we
   ask for anything. */
(function () {
  var root = document.querySelector('[data-ukcstart]');
  if (!root) return;
  var D = window.UKC;
  var stage = document.getElementById('ukStage');
  var rail  = document.getElementById('ukRail');

  var STEPS = ['You', 'Where', 'What you shoot', 'Hotels'];

  var CAP = 5;               // five is a claim; fifty is noise

  var f = {
    name: '', handle: '',
    plats: [],                 // [{ k, handle, f }] — connected only; first is main
    busy: null,                // the platform mid-connect
    shoots: [], shootQ: '',    // chips + the search box behind them
    dests: [],  destQ: '',
    formats: [],               // what kind of content — a separate axis from shoots
    open: null,                // which picker is dropped down, if any
    stayIx: {},                // per-card photo index on the final step
    oauth: null,                // { k, stage } while a connect is in progress
    popup: null,                // 'covers' | 'shoots' | null — which card overflow is open
    annMenu: false               // the announcement card's own options menu
  };
  /* Three screens now come before the identity ask: a no-fields welcome, one
     cheap identity-free intent tap, and a proof moment that shows real platform
     value before requesting anything of the creator's own. Named constants
     instead of bare numbers because `step` is compared in half a dozen places
     below — a magic 0/1/3 in each would drift the moment this sequence changes
     again. Only STEP_YOU through STEP_HOTELS appear in the rail; the three
     pre-steps are orientation, not counted progress. */
  var STEP_WELCOME = 0, STEP_INTENT = 1, STEP_PROOF = 2,
      STEP_YOU = 3, STEP_WHERE = 4, STEP_SHOOT = 5, STEP_HOTELS = 6;
  var step = STEP_WELCOME;

  /* The name field stays, but it arrives already filled: it was given at signup, so
     presenting it blank would say we had not been listening. It is still editable —
     what a creator signs a contract with is not always what hotels should call them.
     Whoever just signed up on this device wins; failing that we are the seeded
     creator, which is who a direct visit to this URL is.
     // PLUG-IN POINT — session. Replace both reads with the signed-in account. */
  try { f.name = localStorage.getItem('uk_name') || ''; } catch (e0) {}
  if (!f.name) f.name = (D.me && D.me.n) || '';

  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) {
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; }); };

  function total() { return D.totalReach(f.plats); }
  function mainPlat() { return f.plats.length ? f.plats[0] : null; }

  /* PLUG-IN POINT — social connect.
     The only way a platform gets added. Tapping one runs an OAuth handshake and a
     Graph/API read that returns the handle, the follower count and the recent media;
     this stands in for that read and returns the same shape, so the real call drops
     in here and nothing above it changes. There is deliberately no hand-entry path:
     a self-reported follower count is not a number a hotel can price against. */
  function connectPlatform(k, done) {
    var seed = { ig: 12400, tt: 8600, yt: 3100, fb: 4200, sc: 2600, x: 1900, li: 1400, pi: 5200 };
    setTimeout(function () {
      done({
        handle: (f.name.trim().split(' ')[0] || 'you').toLowerCase().replace(/[^a-z]/g, ''),
        f: seed[k] || 2000
      });
    }, 620);
  }

  /* ---------- what connecting a platform actually feels like ----------
     A platform going from "not connected" to "connected" the instant you tap it
     reads as a switch being flipped, not an account being reached. Real OAuth leaves
     the page, asks a real question, and sometimes just fails — so this stands in a
     short version of all three: a redirect beat, a consent screen naming exactly
     what is being asked for, and an occasional failure with a real retry rather than
     a flow that only ever succeeds.

     // PLUG-IN POINT — real OAuth. Everything below the redirect beat is where a
     // real provider's authorize URL and callback would take over; connectPlatform()
     // above is what a real callback ultimately calls with. */
  function startOAuth(k) {
    if (f.oauth) return;
    f.oauth = { k: k, stage: 'redirect' };
    paint();
    setTimeout(function () {
      if (!f.oauth || f.oauth.k !== k) return;   // cancelled while redirecting
      f.oauth.stage = 'consent';
      paint();
    }, 640);
  }

  function allowOAuth() {
    if (!f.oauth) return;
    var k = f.oauth.k;
    f.oauth.stage = 'connecting';
    paint();
    setTimeout(function () {
      if (!f.oauth || f.oauth.k !== k) return;
      /* real connects fail sometimes — a network blip, a provider timeout, a
         consent that does not come back clean. One in five is enough to be a real
         possibility a creator can hit without every third connect breaking. */
      if (Math.random() < 0.2) { f.oauth.stage = 'error'; return paint(); }
      connectPlatform(k, function (res) {
        f.plats.push({ k: k, handle: res.handle, f: res.f });
        if (!f.handle && res.handle) f.handle = res.handle;
        f.oauth = null;
        paint();
      });
    }, 780);
  }

  function cancelOAuth() { f.oauth = null; paint(); }

  function oauthModal() {
    if (!f.oauth) return '';
    var p = D.platOf(f.oauth.k) || { n: f.oauth.k };
    var stage = f.oauth.stage;
    var body;
    if (stage === 'redirect') {
      body = '<div class="ukOAuth_mid">' +
        '<span class="ukOAuth_spin" aria-hidden="true"></span>' +
        '<p class="ukOAuth_t">Taking you to ' + esc(p.n) + '…</p>' +
      '</div>';
    } else if (stage === 'consent') {
      body =
        '<div class="ukOAuth_who">' + platMark(p) +
          '<span>' + esc(p.n) + '</span>' +
        '</div>' +
        '<h2 class="ukOAuth_h">Let Ukreate connect your ' + esc(p.n) + '?</h2>' +
        '<ul class="ukOAuth_list">' +
          '<li>See your public profile and handle</li>' +
          '<li>See your posts, to show your recent work</li>' +
          '<li>Nothing is posted on your behalf</li>' +
        '</ul>' +
        '<div class="ukOAuth_row">' +
          '<button class="ukGhost" type="button" data-oauth-cancel>Cancel</button>' +
          '<button class="ukBtn" type="button" data-oauth-allow>Allow</button>' +
        '</div>';
    } else if (stage === 'connecting') {
      body = '<div class="ukOAuth_mid">' +
        '<span class="ukOAuth_spin" aria-hidden="true"></span>' +
        '<p class="ukOAuth_t">Connecting your ' + esc(p.n) + '…</p>' +
      '</div>';
    } else {
      body =
        '<div class="ukOAuth_who ukOAuth_who--err">' + platMark(p) +
          '<span>' + esc(p.n) + '</span>' +
        '</div>' +
        '<h2 class="ukOAuth_h">Couldn\u2019t connect your ' + esc(p.n) + '.</h2>' +
        '<p class="ukOAuth_p">That happens sometimes. The connection dropped before it finished, so nothing was added.</p>' +
        '<div class="ukOAuth_row">' +
          '<button class="ukGhost" type="button" data-oauth-cancel>Cancel</button>' +
          '<button class="ukBtn" type="button" data-oauth-retry>Try again</button>' +
        '</div>';
    }
    return '<div class="ukOAuth_scrim" data-oauth-scrim role="presentation">' +
      '<div class="ukOAuth_card" role="dialog" aria-modal="true" ' +
        'aria-label="Connect ' + esc(p.n) + '">' + body + '</div>' +
    '</div>';
  }

  /* ---------- reactive reassurance ----------
     Said only once there is something true to say, and never as a count of our own
     supply: "7 of 22 hotels" tells a creator how small we are, which is our problem
     to solve, not theirs. These read off the creator's own numbers and off the shape
     of demand — which band is asked for most, what a second platform adds — so each
     line earns its place and changes as they connect more. */
  var BAND_ORDER = ['Under 5K', '5K - 25K', '25K - 100K', '100K+'];

  function m(key, alt, eager) {


    var a = D.media(key);
    return '<span class="ukM ukM--' + a.ratio + '"><img src="' + a.src + '" alt="' + esc(alt || '') + '"' +
      (eager ? '' : ' loading="lazy" decoding="async"') + '>' +
      (a.kind === 'video'
        ? '<svg class="ukM_play" viewBox="0 0 44 44" aria-hidden="true"><path fill-rule="evenodd" ' +
          'clip-rule="evenodd" d="M22 0C9.85 0 0 9.85 0 22s9.85 22 22 22 22-9.85 22-22S34.15 0 22 0Z' +
          'M17.6 16.8Q17.6 13.2 20.6 15.2L27.8 20Q30.8 22 27.8 24L20.6 28.8Q17.6 30.8 17.6 27.2L17.6 16.8Z"/></svg>'
        : '') + '</span>';
  }

  function paintRail() {
    /* the rail only counts the four identity steps — the welcome/intent/proof
       screens ahead of them are orientation, not progress, so they never appear
       in it (and are hidden entirely by .ukStart--pre, see paint()) */
    var railStep = step - STEP_YOU;
    rail.innerHTML = STEPS.map(function (s, i) {
      return '<li class="' + (i < railStep ? 'is-done' : i === railStep ? 'is-now' : '') + '">' +
        /* a drawn tick, not the ✓ glyph: the glyph is set to a font's metrics and
           sits off-centre in the dot at this size */
        '<span class="ukStart_dot">' + (i < railStep
          ? '<svg class="ukTick" viewBox="0 0 12 12" aria-hidden="true">' +
            '<path d="M2.6 6.35 4.85 8.6 9.4 3.75" fill="none" stroke="currentColor" ' +
            'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
          : i + 1) + '</span>' +
        '<span class="ukStart_lb">' + s + '</span></li>';
    }).join('');
  }

  /* No "Make main" button: the row already says how, and repeating it as a control
     on every secondary row was what forced two lines. The count sits directly left of
     the close button instead, so the whole thing reads on one line at half width. */
  function platRow(row, i, isMain) {
    var p = D.platOf(row.k) || { n: row.k };
    return '<div class="ukPlatRow' + (isMain ? ' is-main' : '') + '" draggable="true" ' +
      'data-plat="' + i + '" role="listitem">' +
      '<span class="ukGrip" aria-hidden="true"></span>' +
      platMark(p) +
      '<span class="ukPlatRow_b">' +
        '<span class="ukPlatRow_n">' + esc(p.n) + '</span>' +
        '<span class="ukPlatRow_h">@' + esc(row.handle) + '</span>' +
      '</span>' +
      '<span class="ukPlatRow_f">' + D.fmt(row.f) + '</span>' +
      '<button class="ukPlatRow_x" type="button" data-unplat="' + i + '" ' +
        'aria-label="Disconnect ' + esc(p.n) + '">&times;</button></div>';
  }

  function platMark(p) {
    return p.s
      ? '<img class="ukPlatMark" src="' + p.s + '" alt="" width="20" height="20">'
      : '<span class="ukPlatMark ukPlatMark--txt" aria-hidden="true">' + p.n.charAt(0) + '</span>';
  }

  /* ---------- step 0: welcome, no fields ----------
     Orientation before any ask, not a form with a headline attached to it. The
     wordmark moment used to live on the platform-connect screen; it belongs here
     instead, so the actual first ask (step 3, "You") can open on its own terms
     rather than doing two jobs at once. No back control — there is nothing before
     this to go back to. */
  function welcome() {
    return '<div class="ukStart_grid"><section class="ukStart_ask">' +
      '<h1 class="ukStart_h ukStart_h--mark">' +
        (f.name ? esc(f.name.split(' ')[0]) + ', welcome to ' : 'Welcome to ') +
        '<img class="ukWordmark" src="/assets/img/ukreate-wordmark.svg" alt="Ukreate">' +
      '</h1>' +
      '<p class="ukStart_p">Hotels host creators on nights they would rather see used than empty — ' +
        'you shoot, they host, you keep everything you make. Two minutes gets you set up so they ' +
        'can find you.</p>' +
      welcomePeek() +
      '<div class="ukNav ukNav--solo"><span></span>' +
        '<button class="ukBtn ukNav_go" type="button" data-next>Get started</button>' +
      '</div>' +
    '</section></div>';
  }

  /* A glimpse, not a pitch — three real hotels already on the platform, blurred
     just enough to read as a preview rather than a finished result, since nothing
     has been matched to this creator yet. Same photos and names step 2's live
     search and the final match screen use later, so nothing shown here turns out
     to have been staged. */
  function welcomePeek() {
    var sample = D.stays.slice(0, 3);
    if (!sample.length) return '';
    return '<div class="ukPeek" aria-hidden="true">' +
      '<div class="ukPeek_row">' + sample.map(function (s) {
        return '<span class="ukPeek_card"><img src="' + s.img + '" alt="" loading="lazy" decoding="async">' +
          '<span class="ukPeek_n">' + esc(s.hotel) + '</span></span>';
      }).join('') + '</div>' +
      '<p class="ukPeek_cap">A few of the hotels already on Ukreate, looking for creators right now</p>' +
    '</div>';
  }

  /* ---------- step 1: one cheap, identity-free tap ----------
     Broad intent only — never a handle, a number, or anything that needs typing.
     Tapping an option both answers it and moves on, the way a single-tap question
     should; there is nothing to "submit". Skippable, because forcing an answer to
     a question this light would be friction for its own sake — the kind Part 1's
     own brief warns against adding.

     [ASSUMPTION][REVIEW] — this step is genuinely optional per the brief ("include
     at most two... if it doesn't add real value, skip it"). Kept it, at one
     question rather than two, because it lets the proof step right after tailor
     itself ("here's how pitching looks" vs. "here's how the platform works") —
     but this is a judgement call, not a requirement, and dropping it entirely
     would still satisfy the brief. */
  function intentStep() {
    var OPTS = [
      { k: 'pitch',   t: 'Find hotels to pitch',      s: 'Jump straight into real matches.' },
      { k: 'look',    t: 'See how this works first',  s: 'Look around before connecting anything.' },
      { k: 'profile', t: 'Build my profile',          s: 'Get my platforms and work set up.' }
    ];
    return '<div class="ukStart_grid"><section class="ukStart_ask">' +
      '<h1 class="ukStart_h">What are you hoping to do here?</h1>' +
      '<p class="ukStart_p">No wrong answer — this just helps us show you the right thing first.</p>' +
      '<div class="ukIntents" role="group" aria-label="What are you hoping to do here?">' +
        OPTS.map(function (o) {
          return '<button class="ukIntent' + (f.intent === o.k ? ' is-on' : '') + '" type="button" ' +
            'data-intent="' + o.k + '">' +
            '<span class="ukIntent_t">' + o.t + '</span>' +
            '<span class="ukIntent_s">' + o.s + '</span></button>';
        }).join('') +
      '</div>' +
      '<div class="ukNav ukNav--solo">' +
        '<button class="ukGhost ukNav_back" type="button" data-back>Back</button>' +
        '<button class="ukGhost" type="button" data-skipintent>Skip for now</button>' +
      '</div>' +
    '</section></div>';
  }

  /* ---------- step 2: proof, before any ask ----------
     The creator has given almost nothing yet — maybe a name, maybe a tap — so the
     proof has to come from the platform's own data, not theirs. Real stays, real
     names, and a live filter they can actually use, typing nothing but a city,
     with no account required to see it work. This is the trust-earning moment
     "connect your account to see value" skipped.

     [ASSUMPTION][REVIEW] — built as a live, typeable search against the same
     D.stays data the final match screen and Pitch Pilot both read (not a static
     screenshot-style mock), because *experiencing* the platform responding is a
     stronger proof than being told about it. This is one reasonable reading of
     the brief's "a live, playable demonstration" option among the several it
     lists — flagging it as the specific choice made, not the only valid one. */
  function proofStep() {
    var q = (f.proofQ || '').trim();
    var list = q
      ? D.stays.filter(function (s) { return (s.hotel + ' ' + s.city + ' ' + s.style).toLowerCase().indexOf(q.toLowerCase()) > -1; })
      : D.stays;
    return '<div class="ukStart_grid"><section class="ukStart_ask">' +
      '<h1 class="ukStart_h">Hotels are already looking for creators.</h1>' +
      '<p class="ukStart_p">Try it — search a city and see what is live right now. No account needed yet.</p>' +
      '<label class="ukField"><span class="ukField_l ukSrOnly">Search a city</span>' +
        '<input class="ukField_i" id="proofQ" data-k="proofQ" value="' + esc(q) + '" ' +
        'placeholder="Try Tulum, Lisbon, Miami…" autocomplete="off"></label>' +
      '<div class="ukProof_list">' +
        (list.length
          ? list.slice(0, 4).map(proofCard).join('')
          : '<p class="ukHint">Nothing matches that yet — try Tulum, Lisbon or Marrakesh, or clear the search.</p>') +
      '</div>' +
      '<p class="ukAsk">Ready to see hotels matched to your own work?</p>' +
      '<div class="ukNav ukNav--solo">' +
        '<button class="ukGhost ukNav_back" type="button" data-back>Back</button>' +
        '<button class="ukBtn ukNav_go" type="button" data-next>Set up my profile</button>' +
      '</div>' +
    '</section></div>';
  }

  function proofCard(s) {
    return '<article class="ukProofCard">' +
      '<img src="' + s.img + '" alt="" loading="lazy" decoding="async">' +
      '<span class="ukProofCard_b"><span class="ukProofCard_n">' + esc(s.hotel) + '</span>' +
      '<span class="ukProofCard_m">' + esc(s.city) + ' &middot; ' + esc(s.style) + '</span>' +
      '<span class="ukProofCard_w">' + esc(s.why) + '</span></span></article>';
  }

  /* ---------- step 3: name, then connect what you post on ----------
     One primary action on the screen. The platforms are choices, not commands, so
     they carry no weight of their own; Continue is the only filled button. Nothing is
     explained before it has happened — the reassurance arrives attached to a real
     number once there is one. */
  function one() {
    var ready = f.name.trim() && f.plats.length;
    var left = D.PLATFORMS.filter(function (p) {
      return !f.plats.some(function (r) { return r.k === p.k; });
    });

    return '<div class="ukStart_grid">' +
      '<section class="ukStart_ask">' +
        /* The welcome moment already happened, on the screen before this one — this
           is the first real ask, so it opens on that rather than saying hello twice. */
        '<h1 class="ukStart_h">Let&rsquo;s start with where you post.</h1>' +
        '<p class="ukStart_p">Pick the profiles you already post from. We read your ' +
          'work from them, so there is nothing to upload.</p>' +

        '<p class="ukField_l ukSrOnly">Connect where you post</p>' +

        /* Two buckets, but only once there is something in them: an empty pair of
           trays is a question nobody asked. Drag moves a platform between them; the
           button beside it does the same thing for anyone not using a mouse. */
        (f.plats.length
          ? '<div class="ukBuckets">' +
              '<div class="ukBucket ukBucket--main" data-bucket="main" ' +
                'aria-label="Main profile">' +
                '<p class="ukBucket_l">Main</p>' +
                platRow(f.plats[0], 0, true) +
              '</div>' +
              '<div class="ukBucket ukBucket--sec" data-bucket="sec" ' +
                'aria-label="Other platforms">' +
                '<p class="ukBucket_l">Also on</p>' +
                (f.plats.length > 1
                  ? f.plats.slice(1).map(function (r, i) { return platRow(r, i + 1, false); }).join('')
                  : '<p class="ukBucket_e">Connect another and drag it here, or drag this one down.</p>') +
              '</div>' +
            '</div>' +
            (f.plats.length > 1
              ? '<p class="ukHint ukHint--drag">Drag any of these to swap which one is main.</p>'
              : '')
          : '') +

        /* tapping one opens the connect dialog — there is no adder panel and no
           second step */
        (left.length
          ? '<div class="ukChoice ukChoice--plats">' + left.map(function (p) {
              var busy = !!f.oauth && f.oauth.k === p.k;
              return '<button class="ukPick ukPick--plat' + (busy ? ' is-busy' : '') + '" type="button" ' +
                'data-doconnect="' + p.k + '"' + (f.oauth ? ' disabled' : '') + '>' +
                platMark(p) + esc(p.n) + '</button>';
            }).join('') + '</div>'
          : '') +

        /* The running total sits where Back would be on every later step, and
           Continue takes the same right-hand place it holds everywhere else — one
           rule for the row, not a special case for the step with nothing to go
           back to. */
        '<div class="ukNav ukNav--solo">' +
          (f.plats.length
            ? '<p class="ukTotal"><span class="ukTotal_n">' + D.fmt(total()) + '</span>' +
              '<span class="ukTotal_l">total audience</span></p>'
            : '<span></span>') +
          '<button class="ukBtn ukNav_go" type="button" data-next ' +
            (ready ? '' : 'disabled') + '>Continue</button>' +
        '</div>' +
      '</section>' +

      /* No panel on this step. Nothing has been connected yet, so there is nothing
         for the card to show — it arrives on the next screen already carrying their
         name, their marks and their clips, which is the moment worth having. */
    '</div>' + oauthModal();
  }

  /* ---------- their card, filling as they answer ----------
     The right panel is the very card hotels browse — same component, same classes —
     built from what has been answered so far. That is the point of showing it: the
     questions stop being a form and become the thing being made. Connecting a
     platform gives it a name, a handle, the marks and the clips; markets fill the
     Covers line; what they shoot fills the tags. */
  /* A gold badge with a white check, not the single-tone glyph the shared .ukCrVet
     class draws elsewhere in the app — scoped to onboarding's own two cards rather
     than changed everywhere a verified mark appears, since only these two were
     asked for. */
  /* Single source now in ukicons.js (window.UK_VET_D / window.ukVetBadge), which
     loads before this file on every page. The previous copy here dropped the
     outer-seal half of the path and kept only the checkmark — that mismatch is
     what made the badge look different depending on which screen drew it. The
     canvas export below still needs the raw path for its own Path2D trace. */
  var VET_D = window.UK_VET_D;
  function vetBadge() { return window.ukVetBadge('ukCrVet'); }

  /* "Adventure & outdoors" and "Digital nomad & remote work" cannot share a row
     with anything and still fit the card; "Food & drink" and "Nature & wildlife"
     can share one with each other. Rather than measure pixels, a character-count
     line does the same job: past it, a name is long enough to need the row alone. */
  var SHOOT_LONG_LEN = 18;
  function fitShoots(cats) {
    var shown = [];
    for (var i = 0; i < cats.length && shown.length < 2; i++) {
      var c = cats[i];
      if (c.length > SHOOT_LONG_LEN) {
        if (shown.length === 0) shown.push(c);
        break;
      }
      shown.push(c);
    }
    return shown;
  }

  function meCard() {
    var plats = f.plats.map(function (r) { return D.platOf(r.k); }).filter(Boolean);
    var dests = f.dests.map(function (k) { return D.destOf(k); }).filter(Boolean);
    var cats  = f.shoots.slice();
    var main  = mainPlat();
    var reach = total();

    /* Placeholders read as blanks to be filled rather than as missing data: the card
       is honestly incomplete at this point in the flow, and saying so is better than
       printing a dash. */
    var stats = [
      ['Audience',   reach ? D.fmt(reach) : '—'],
      ['Avg reach',  reach ? D.fmt(Math.round(reach * 0.42)) : '—'],
      ['Engagement', reach ? '6.1%' : '—'],
      ['Rating',     'New', true],
      ['Stays',      '—']
    ];

    return '<article class="ukCrCard ukCrCard--me">' +
      '<div class="ukCrCard_top">' +
        '<span class="ukCrAv">' +
          '<img src="' + D.me.img + '" alt="">' +
          /* is-now, not a made-up "is-free": that class does not exist in the shared
             card CSS, so the dot was rendering the default grey ring — effectively
             invisible against a white card */
          '<span class="ukCrAv_dot is-now" title="Available now" role="img" ' +
            'aria-label="Available now"></span>' +
        '</span>' +

        '<span class="ukCrCard_id">' +
          '<span class="ukCrCard_n">' + esc(f.name || 'Your name') + vetBadge() + '</span>' +
          /* Two markets, then a count — a plain cap rather than measuring what fits:
             predictable, and the count is a real control, not just a hover title,
             so a creator with more than two can still see every one by opening it.
             One shared circular badge (.ukMoreDot) for this and for what they
             shoot below — the same control everywhere it appears, not a different
             shape per row. */
          (dests.length
            ? '<span class="ukCrCard_m">Covers ' +
                dests.slice(0, 2).map(function (d) {
                  return (d.cc ? '<img class="ukCrFlag" src="/assets/img/flags/' + d.cc + '.svg" alt="" ' +
                    'loading="lazy" decoding="async">' : '') + esc(d.n);
                }).join(', ') +
                (dests.length > 2
                  ? ' <button class="ukMoreDot" type="button" data-popup="covers" ' +
                    'title="' + esc(dests.slice(2).map(function (d) { return d.n; }).join(', ')) + '" ' +
                    'aria-label="' + (dests.length - 2) + ' more markets">+' + (dests.length - 2) + '</button>'
                  : '') +
              '</span>'
            : '<span class="ukCrCard_m ukCrCard_m--wait">Markets you cover</span>') +
          /* Same rule for what they shoot, but the names are not all the same
             length — "Food & drink" and "Digital nomad & remote work" cannot
             both get two slots and stay on the card. A long name (over
             SHOOT_LONG_LEN characters) takes both slots for itself; two names
             at or under that length share the row the way markets do. */
          '<span class="ukCrTags">' + (function () {
            if (!cats.length) return '<span class="ukCrTag ukCrTag--wait">What you shoot</span>';
            var shown = fitShoots(cats), rest = cats.length - shown.length;
            return shown.map(function (t) { return '<span class="ukCrTag">' + esc(t) + '</span>'; }).join('') +
              (rest
                ? '<button class="ukMoreDot" type="button" data-popup="shoots" ' +
                  'title="' + esc(cats.slice(shown.length).join(', ')) + '" ' +
                  'aria-label="' + rest + ' more, what they shoot">+' + rest + '</button>'
                : '');
          })() +
          '</span>' +
        '</span>' +

        /* Capped at four: past that the overlapping stack runs wider than the
           header has room for and spills past the card's own edge. The same
           .ukMoreDot badge closes the stack — its own margin, not the platform
           marks' overlap margin, so it sits clear of the last icon instead of
           landing on top of it. */
        '<span class="ukCrPlats">' +
          plats.slice(0, 4).map(function (pl) {
            return '<img class="ukCrPlat" src="' + pl.s + '" alt="' + esc(pl.n) + '" ' +
              'title="' + esc(pl.n) + '" loading="lazy" decoding="async">';
          }).join('') +
          (plats.length > 4
            ? '<span class="ukMoreDot ukMoreDot--plat" title="' +
              esc(plats.slice(4).map(function (pl) { return pl.n; }).join(', ')) + '">+' +
              (plats.length - 4) + '</span>'
            : '') +
        '</span>' +
      '</div>' +

      '<span class="ukCrClips">' + D.me.work.slice(0, 4).map(function (w, i) {
        var a = D.media(w.m);
        return '<span class="ukCrClip"><img src="' + a.src + '" alt="' + esc(w.t) + '"' +
          (i < 2 ? '' : ' loading="lazy" decoding="async"') + '>' +
          '<svg class="ukCrPlay" viewBox="0 0 44 44" aria-hidden="true">' +
            '<path fill-rule="evenodd" clip-rule="evenodd" d="M22 0C9.85 0 0 9.85 0 22' +
            's9.85 22 22 22 22-9.85 22-22S34.15 0 22 0Z' +
            'M17.6 16.8Q17.6 13.2 20.6 15.2L27.8 20Q30.8 22 27.8 24' +
            'L20.6 28.8Q17.6 30.8 17.6 27.2L17.6 16.8Z"/>' +
          '</svg></span>';
      }).join('') + '</span>' +

      '<span class="ukCrStats">' + stats.map(function (st) {
        return '<span class="ukCrStat"><span class="ukCrStat_v">' +
          (st[2] ? '<img class="ukCrStar" src="/assets/img/fc/star.svg" alt="" ' +
                   'width="11" height="11">' : '') +
          esc(st[1]) + '</span>' +
          '<span class="ukCrStat_l">' + esc(st[0]) + '</span></span>';
      }).join('') + '</span>' +
    '</article>';
  }

  /* the panel that carries it, with a line saying what just landed on the card */
  function cardPane(note) {
    return '<aside class="ukStart_mirror ukStart_pane ukStart_pane--card">' +
      '<p class="ukStart_eyebrow ukStart_eyebrow--pane">Your card, so far</p>' +
      meCard() +
      '<p class="ukStart_mp">' + note + '</p>' +
    '</aside>' + popupModal();
  }

  /* What the card's "+N" badges open. Markets get their flag back here — the card
     itself only has room for three — and what they shoot is a plain list, since a
     niche has no flag to show. Same dialog shape as the connect step, so a second
     kind of pop-up on this screen doesn't have to be learned separately. */
  /* A popover beside the button that opened it, not a dialog in the middle of the
     screen — the button already told you what this is, so a centred modal would be
     answering a question nobody asked twice. Position is set after paint, once the
     trigger's real position on screen is known; see positionPopup(). */
  function popupModal() {
    if (!f.popup) return '';
    var isCovers = f.popup === 'covers';
    var title = isCovers ? 'Markets you cover' : 'What you shoot';
    var rows = isCovers
      ? f.dests.map(function (k) { return D.destOf(k); }).filter(Boolean).map(function (d) {
          return '<li class="ukPop_row">' +
            (d.cc ? '<img class="ukCrFlag" src="/assets/img/flags/' + d.cc + '.svg" alt="" ' +
              'loading="lazy" decoding="async">' : '') + esc(d.n) + '</li>';
        }).join('')
      : f.shoots.map(function (t) { return '<li class="ukPop_row">' + esc(t) + '</li>'; }).join('');
    return '<div class="ukPop_card" role="dialog" aria-label="' + esc(title) + '" data-popup-panel>' +
        '<div class="ukPop_head">' +
          '<h2 class="ukPop_h">' + esc(title) + '</h2>' +
          '<button class="ukPop_x" type="button" data-popup-close aria-label="Close">&times;</button>' +
        '</div>' +
        '<ul class="ukPop_list">' + rows + '</ul>' +
      '</div>';
  }

  /* Anchored to the button, clear of the card's own edges. Fixed positioning, so it
     is never clipped by the card's overflow the way an absolutely-positioned child
     of that box would be. */
  function positionPopup() {
    var panel = document.querySelector('[data-popup-panel]');
    if (!panel) return;
    var btn = document.querySelector('[data-popup="' + f.popup + '"]');
    if (!btn) { f.popup = null; return; }
    var br = btn.getBoundingClientRect();
    var pw = panel.offsetWidth, ph = panel.offsetHeight;
    var left = Math.min(Math.max(8, br.left), window.innerWidth - pw - 8);
    var top = br.bottom + 8;
    if (top + ph > window.innerHeight - 8) top = Math.max(8, br.top - ph - 8);
    panel.style.left = left + 'px';
    panel.style.top = top + 'px';
    panel.style.visibility = 'visible';
  }

  /* ---------- the announcement card, as a real image ----------
     Same technique the hotel side already built — drawn to a canvas, because that is
     the only way to get a file out of the browser without a rasteriser library — but
     not the same card. A hotel is selling a room, so its card is a photograph with a
     sentence over it. A creator is selling themselves, so this one leads with who
     they are: their own face, their verified mark, the platforms they post from, and
     the reach that is their actual currency — none of which a property photo can
     carry. 9:16 rather than the hotel's 4:5, because that is the shape a creator
     already posts in, not a shape borrowed from a listing card.

     // PLUG-IN POINT — share targets, exactly as on the hotel side: navigator.share
     carries the file straight into the OS sheet where one exists; everywhere else it
     downloads. A hosted per-creator card URL would let the network share buttons
     preview the image itself rather than the bare site link — see CARD_URL_C below. */
  var CARD_W_C = 1080, CARD_H_C = 1920;

  var NETS_C = [
    { k:'facebook', n:'Facebook', i:'/assets/img/brand/facebook.svg' },
    { k:'linkedin', n:'LinkedIn', i:'/assets/img/brand/linkedin.svg' },
    { k:'x',        n:'X',        i:'/assets/img/brand/x.svg' },
    { k:'whatsapp', n:'WhatsApp', i:'/assets/img/brand/whatsapp.svg' }
  ];
  function shareToCreator(kind) {
    var CARD_URL_C = location.origin + '/creator/';
    var text = (f.name.trim() || 'I') + ' just joined Ukreate, matched with hotels ' +
               'in the places I already travel.';
    var u = encodeURIComponent(CARD_URL_C), t = encodeURIComponent(text);
    var to = {
      facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + u,
      linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=' + u,
      x:        'https://twitter.com/intent/tweet?text=' + t + '&url=' + u,
      whatsapp: 'https://wa.me/?text=' + encodeURIComponent(text + ' ' + CARD_URL_C)
    }[kind];
    if (to) window.open(to, '_blank', 'noopener,noreferrer,width=640,height=640');
  }

  /* The card leads with a video, not whichever clip happened to be listed first —
     and specifically the one that has actually performed, since that is the proof
     a hotel or a viewer would want to see. */
  function bestVideo() {
    var work = D.me.work || [];
    var videos = work.filter(function (w) { return (D.media(w.m) || {}).kind === 'video'; });
    var pool = videos.length ? videos : work;
    return pool.reduce(function (best, w) {
      return (!best || (w.plays || 0) > (best.plays || 0)) ? w : best;
    }, null);
  }

  function loadImgC(src) {
    return new Promise(function (res, rej) {
      var i = new Image();
      i.crossOrigin = 'anonymous';
      i.onload = function () { res(i); };
      i.onerror = rej;
      i.src = src;
    });
  }

  function drawAnnounceCard() {
    var c = document.createElement('canvas');
    c.width = CARD_W_C; c.height = CARD_H_C;
    var ctx = c.getContext('2d');
    var name = f.name.trim() || 'You';
    var first = name.split(' ')[0];
    var dests = f.dests.map(function (k) { return D.destOf(k); }).filter(Boolean);
    var reach = total();
    var work = bestVideo();
    var bg = work ? D.media(work.m).src : null;

    /* document.fonts.ready hangs whenever the webfont request does, so it races a
       timeout — a card drawn in the fallback serif beats one that never renders. */
    var ready = Promise.race([
      (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve(),
      new Promise(function (r) { setTimeout(r, 1500); })
    ]);

    return ready.then(function () {
      return bg ? loadImgC(bg).catch(function () { return null; }) : null;
    }).then(function (img) {
      if (img) {
        var ir = img.width / img.height, cr = CARD_W_C / CARD_H_C, sw, sh;
        if (ir > cr) { sh = img.height; sw = sh * cr; } else { sw = img.width; sh = sw / cr; }
        ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, 0, 0, CARD_W_C, CARD_H_C);
      } else {
        var g = ctx.createLinearGradient(0, 0, CARD_W_C, CARD_H_C);
        g.addColorStop(0, '#0B2F52'); g.addColorStop(0.55, '#08233D'); g.addColorStop(1, '#061829');
        ctx.fillStyle = g; ctx.fillRect(0, 0, CARD_W_C, CARD_H_C);
      }
      var s = ctx.createLinearGradient(0, CARD_H_C * 0.34, 0, CARD_H_C);
      s.addColorStop(0, 'rgba(6,24,41,0)');
      s.addColorStop(0.55, 'rgba(6,24,41,.74)');
      s.addColorStop(1, 'rgba(6,24,41,.96)');
      ctx.fillStyle = s; ctx.fillRect(0, 0, CARD_W_C, CARD_H_C);

      var plats = f.plats.map(function (r) { return D.platOf(r.k); }).filter(Boolean).slice(0, 4);
      return Promise.all([
        loadImgC('/assets/img/ukreate-mark.svg').catch(function () { return null; }),
        loadImgC(D.me.img).catch(function () { return null; })
      ].concat(plats.map(function (pl) { return loadImgC(pl.s).catch(function () { return null; }); })));
    }).then(function (imgs) {
      var mark = imgs[0], avatar = imgs[1], platImgs = imgs.slice(2);
      var plats = f.plats.map(function (r) { return D.platOf(r.k); }).filter(Boolean).slice(0, 4);
      var pad = 76;

      /* the brand stamp is its own fixed element in the top-left corner, not
         squeezed beside the avatar — a mark that small only reads as noise, the way
         one did on an earlier pass at this exact size */
      if (mark) {
        var stampH = 64, stampW = stampH * (mark.width / mark.height || 0.83);
        ctx.drawImage(mark, pad, pad, stampW, stampH);
      }

      var y = CARD_H_C - pad;

      /* the platform marks, overlapping left over right exactly like the live card's
         own stack, sitting at the very foot the same way they sit last in the DOM */
      var pr = 22;
      for (var pi = platImgs.length - 1; pi >= 0; pi--) {
        var pImg = platImgs[pi];
        if (!pImg) continue;
        var pcx = pad + pr + pi * (pr * 1.5);
        ctx.save();
        ctx.beginPath(); ctx.arc(pcx, y - pr, pr + 2, 0, 6.2832);
        ctx.fillStyle = '#08233D'; ctx.fill();
        ctx.beginPath(); ctx.arc(pcx, y - pr, pr, 0, 6.2832); ctx.clip();
        ctx.drawImage(pImg, pcx - pr, y - pr - pr, pr * 2, pr * 2);
        ctx.restore();
      }
      if (plats.length) y -= pr * 2 + 20;

      /* the platform marks are the creator's own vocabulary, not the hotel's — this
         card can name where the reach actually lives */
      var plats = f.plats.map(function (r) { return D.platOf(r.k); }).filter(Boolean).slice(0, 4);
      ctx.font = '600 30px Lato, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,.86)';
      var capLine = (reach ? D.fmt(reach) + ' reach' : 'New on Ukreate') +
                    (dests.length ? '  ·  covers ' + dests.length + ' market' + (dests.length === 1 ? '' : 's') : '');
      ctx.fillText(capLine, pad, y);
      y -= 84;

      ctx.fillStyle = '#ffffff';
      ctx.font = '400 66px Marcellus, Georgia, serif';
      var headline = first + ' is now on Ukreate';
      var words = headline.split(' '), lines = [], line = '';
      for (var i = 0; i < words.length; i++) {
        var t = line ? line + ' ' + words[i] : words[i];
        if (ctx.measureText(t).width > CARD_W_C - pad * 2 && line) { lines.push(line); line = words[i]; }
        else line = t;
      }
      if (line) lines.push(line);
      for (var li = lines.length - 1; li >= 0; li--) { ctx.fillText(lines[li], pad, y); y -= 80; }
      y -= 10;

      /* the avatar, ringed like a Story — a creator's card leads with a face, which
         a hotel's never had to */
      var r0 = 54, cx0 = pad + r0, cy0 = y - r0 - 4;
      if (avatar) {
        ctx.save();
        ctx.beginPath(); ctx.arc(cx0, cy0, r0 + 5, 0, 6.2832);
        ctx.fillStyle = '#d7a543'; ctx.fill();
        ctx.beginPath(); ctx.arc(cx0, cy0, r0, 0, 6.2832); ctx.clip();
        var ar = avatar.width / avatar.height, asw, ash;
        if (ar > 1) { ash = avatar.height; asw = ash; } else { asw = avatar.width; ash = asw; }
        ctx.drawImage(avatar, (avatar.width - asw) / 2, (avatar.height - ash) / 2, asw, ash,
          cx0 - r0, cy0 - r0, r0 * 2, r0 * 2);
        ctx.restore();
      }

      var nameX = avatar ? pad + r0 * 2 + 20 : pad;
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 34px Lato, sans-serif';
      ctx.fillText(name, nameX, cy0 + 12);
      /* the same badge as the live card and the hotel side's own creatorCard() — a
         Path2D trace of the identical VET_D outline, not a shape drawn fresh, so a
         canvas export can never quietly diverge from what is on screen */
      var vx = nameX + ctx.measureText(name).width + 14, vy = cy0, vetSize = 30;
      ctx.save();
      ctx.translate(vx, vy - vetSize / 2);
      ctx.scale(vetSize / 30.51, vetSize / 30.51);
      ctx.fillStyle = '#ffffff';
      ctx.fill(new Path2D(VET_D), 'evenodd');
      ctx.restore();

      return c;
    });
  }

  function exportAnnounceCard(btn, how) {
    var label = btn.textContent;
    btn.disabled = true;
    drawAnnounceCard().then(function (c) {
      return new Promise(function (res) { c.toBlob(res, 'image/png'); });
    }).then(function (blob) {
      if (!blob) throw new Error('no blob');
      var name = (f.name.trim() || 'ukreate').toLowerCase().replace(/[^a-z0-9]+/g, '-')
                   .replace(/^-|-$/g, '') + '-on-ukreate.png';
      var file = new File([blob], name, { type: 'image/png' });

      function save() {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      }
      if (how === 'share' && navigator.canShare && navigator.canShare({ files: [file] })) {
        return navigator.share({ files: [file], title: 'I’m now on Ukreate' })
          .catch(function (err) { if (!err || err.name !== 'AbortError') save(); });
      }
      save();
    }).catch(function (err) {
      if (err && err.name === 'AbortError') return;
      btn.classList.add('is-bad');
      setTimeout(function () { btn.classList.remove('is-bad'); }, 2200);
    }).then(function () {
      btn.disabled = false;
      if (btn.textContent !== label) btn.textContent = label;
    });
  }

  /* The panel on this last step is content, not a progress preview any more — the
     profile is finished, so what belongs here is the thing that finishing earns:
     something to post. It replaces cardPane() only on step four; steps two and
     three keep the live card, since watching it fill in is the part worth keeping
     mid-flow. */
  function announcePane() {
    var name = f.name.trim() || 'You';
    var reach = total();
    var dests = f.dests.map(function (k) { return D.destOf(k); }).filter(Boolean);
    var plats = f.plats.map(function (r) { return D.platOf(r.k); }).filter(Boolean);
    var work = bestVideo();
    var bg = work ? D.media(work.m) : null;

    return '<aside class="ukStart_mirror ukStart_pane ukStart_pane--annC">' +
      '<article class="ukAnnC" data-anncardc aria-label="Announcement card for ' + esc(name) + '">' +
        '<div class="ukAnnC_m">' +
          (bg
            ? '<img class="ukAnnC_img" src="' + bg.src + '" alt="" width="1080" height="1920">'
            : '<div class="ukAnnC_img ukAnnC_img--brand" aria-hidden="true"></div>') +
          '<div class="ukAnnC_scrim" aria-hidden="true"></div>' +

          '<div class="ukAnnC_menu">' +
            '<button class="ukAnnC_dots" type="button" data-annmenuc aria-haspopup="menu" ' +
              'aria-expanded="' + (f.annMenu ? 'true' : 'false') + '" aria-label="Card options">' +
              '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="2"/>' +
              '<circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>' +
            '</button>' +
            (f.annMenu
              ? '<div class="ukAnnC_pop" role="menu">' +
                  '<button class="ukAnnC_opt" type="button" role="menuitem" data-annactc="download">' +
                    'Download image</button>' +
                  (window.navigator.canShare
                    ? '<button class="ukAnnC_opt" type="button" role="menuitem" data-annactc="share">' +
                      'Share…</button>'
                    : '') +
                  '<span class="ukAnnC_sep" role="separator"></span>' +
                  NETS_C.map(function (n) {
                    return '<button class="ukAnnC_opt ukAnnC_opt--net" type="button" role="menuitem" ' +
                      'data-annnetc="' + n.k + '">' +
                      '<img src="' + n.i + '" alt="" width="18" height="18">Share to ' +
                      esc(n.n) + '</button>';
                  }).join('') +
                '</div>'
              : '') +
          '</div>' +

          '<div class="ukAnnC_b">' +
            '<span class="ukAnnC_id">' +
              '<span class="ukAnnC_av"><img src="' + D.me.img + '" alt=""></span>' +
              '<span class="ukAnnC_n">' + esc(name) + vetBadge() + '</span>' +
            '</span>' +
            '<h2 class="ukAnnC_h">' + esc(name.split(' ')[0]) + ' is now on Ukreate</h2>' +
            '<p class="ukAnnC_p">' +
              (reach ? esc(D.fmt(reach)) + ' reach' : 'New on Ukreate') +
              (dests.length ? '  ·  covers ' + dests.length + ' market' + (dests.length === 1 ? '' : 's') : '') +
            '</p>' +
            (plats.length
              ? '<span class="ukAnnC_plats">' + plats.slice(0, 4).map(function (pl) {
                  return '<img src="' + pl.s + '" alt="' + esc(pl.n) + '" title="' + esc(pl.n) + '">';
                }).join('') + '</span>'
              : '') +
          '</div>' +
        '</div>' +
      '</article>' +
      '<p class="ukStart_mp">This is what a hotel opens when they find you. Post it, and you post yourself.</p>' +
    '</aside>' + popupModal();
  }

  /* A dropdown, not a bare field. Closed it is one line; opened it drops a panel
     carrying the options and — for markets — the globe, so the map lives inside the
     answer instead of standing on the page as furniture of its own. Picking lifts the
     choice into a chip above the field and leaves the panel open, because nobody
     covers exactly one market. The panel floats, so the step never grows as you
     search. Capped at five so the answer stays a claim. */
  function chipPicker(o) {
    var full = o.chosen.length >= CAP;
    var q = (o.q || '').toLowerCase().trim();
    var open = f.open === o.key && !full;

    var pool = o.options.filter(function (x) { return o.chosen.indexOf(x.k) < 0; });
    var hits;
    if (!q) {
      /* Markets open to the map alone (idle:false). Fifteen hundred of them cannot be
         browsed, so a list before anything is typed is a wall to read, not a help —
         the field's placeholder carries the examples instead. A short question like
         what you shoot does lay its options out, because there they can all be seen. */
      hits = o.idle === false ? null : pool.slice(0, o.maxIdle || 40);
    } else {
      /* Fifteen hundred markets means plain substring order is useless — typing
         "lagos" has to put Lagos before a village that merely contains the letters.
         Rank on how the match sits in the name, then break ties on how big the place
         is, so the obvious answer is the first one every time. */
      hits = pool.filter(function (x) {
        return x.n.toLowerCase().indexOf(q) > -1 || (x.sub || '').toLowerCase().indexOf(q) > -1;
      }).map(function (x) {
        var n = x.n.toLowerCase(), at = n.indexOf(q);
        var r = at === 0 ? 300
              : at > 0 && n.charAt(at - 1) === ' ' ? 200
              : at > 0 ? 120
              : 40;                                   // matched on the country instead
        if (n === q) r += 200;
        return { x: x, r: r + Math.min(90, (x.p || 0) / 260) };
      }).sort(function (a, b) { return b.r - a.r; })
        .slice(0, 40).map(function (h) { return h.x; });
    }

    var list = hits === null
      ? ''
      : hits.length
      ? '<ul class="ukPickr_list" id="' + o.key + 'Drop" role="listbox">' +
        hits.map(function (x) {
          return '<li><button class="ukPickr_o" type="button" role="option" ' +
            'aria-selected="false" data-chip="' + o.key + '" data-val="' + esc(x.k) + '">' +
            '<span class="ukPickr_on">' + esc(x.n) + '</span>' +
            (x.sub ? '<span class="ukPickr_os">' + esc(x.sub) + '</span>' : '') +
            '</button></li>';
        }).join('') + '</ul>'
      : '<p class="ukPickr_none">Nothing matches \u201c' + esc(o.q) + '\u201d.</p>';

    return '<div class="ukPickr' + (open ? ' is-open' : '') + '" data-chips="' + o.key + '">' +
      (o.chosen.length
        ? '<ul class="ukPickr_chips">' + o.chosen.map(function (k) {
            var x = o.find(k);
            return '<li class="ukChip">' + esc(x ? x.n : k) +
              '<button class="ukChip_x" type="button" data-unchip="' + o.key + '" data-val="' + esc(k) + '" ' +
              'aria-label="Remove ' + esc(x ? x.n : k) + '">&times;</button></li>';
          }).join('') + '</ul>'
        : '') +

      (full
        ? '<p class="ukPickr_full">That\u2019s your five. Remove one to swap it out.</p>'
        : '<div class="ukPickr_wrap">' +
            '<input class="ukPickr_q" id="' + o.key + 'Q" data-k="' + o.qkey + '" ' +
            'data-opens="' + o.key + '" ' +
            'value="' + esc(o.q || '') + '" placeholder="' + esc(o.ph) + '" ' +
            'role="combobox" aria-expanded="' + open + '" aria-controls="' + o.key + 'Drop" ' +
            'aria-autocomplete="list" aria-label="' + esc(o.label) + '" autocomplete="off">' +
            (o.idle === false ? '' : '<span class="ukPickr_caret" aria-hidden="true"></span>') +
            (open && list ? '<div class="ukPickr_drop">' + list + '</div>' : '') +
          '</div>') +
    '</div>';
  }

  /* ---------- step 2: what they shoot, and where they are going ----------
     The destinations question is the one that decides matches, so it is framed as
     the nicest thing we ask: dreaming, not admin. */
  function two() {
    var ready = f.dests.length > 0;
    return '<div class="ukStart_grid">' +
      '<section class="ukStart_ask">' +
        '<h1 class="ukStart_h">Tell us where you’re headed.</h1>' +
        '<p class="ukStart_p">The places you already travel, and the ones you’d go ' +
          'tomorrow. Hotels match on this before anything else.</p>' +

        '<p class="ukField_l">Markets you cover' +
          '<span class="ukCount2">' + f.dests.length + ' of ' + CAP + '</span></p>' +
        chipPicker({
          key:'dests', qkey:'destQ', q:f.destQ, chosen:f.dests,
          options: D.DESTS,
          find: function (k) { return D.destOf(k); },
          ph:'Try Miami, Bali, Lagos\u2026',
          label:'Markets you cover',
          idle: false          // nothing listed until something is typed
        }) +

        '<div class="ukMapSlot" data-mapslot></div>' +

        '<div class="ukNav">' +
          '<button class="ukGhost ukNav_back" type="button" data-back>Back</button>' +
          '<button class="ukBtn ukNav_go" type="button" data-next ' +
            (ready ? '' : 'disabled') + '>Continue</button>' +
        '</div>' +
      '</section>' +

      cardPane(f.dests.length
        ? 'Your markets are on the card. Hotels in them see you first.'
        : 'Add a market and it lands on your card.') +
    '</div>';
  }

  /* ---------- step 3: what they shoot ----------
     Its own step rather than a second field under the map: it is the answer that
     decides whether a match is a fit, and stacked underneath it read as an
     afterthought to the question above it. */
  function three() {
    var ready = f.shoots.length > 0;
    return '<div class="ukStart_grid">' +
      '<section class="ukStart_ask">' +
        '<h1 class="ukStart_h">Now, what do you shoot?</h1>' +
        '<p class="ukStart_p">Pick what your work actually is. This is what a hotel ' +
          'reads before they decide you are right for the room.</p>' +

        '<p class="ukField_l">What you shoot' +
          '<span class="ukCount2">' + f.shoots.length + ' of ' + CAP + '</span></p>' +

        /* Sixteen options, all of them short: a dropdown hid a set small enough to
           read at a glance and made choosing several a repeated open-and-close. They
           are pills you toggle, the same control the platforms use a step earlier. */
        '<div class="ukChoice ukChoice--shoots" role="group" aria-label="What you shoot">' +
          D.SHOOTS.map(function (n) {
            var on = f.shoots.indexOf(n) > -1;
            var full = !on && f.shoots.length >= CAP;
            return '<button class="ukPick ukPick--shoot' + (on ? ' is-on' : '') + '" ' +
              'type="button" data-shoot="' + esc(n) + '" aria-pressed="' + on + '"' +
              (full ? ' disabled' : '') + '>' + esc(n) + '</button>';
          }).join('') +
        '</div>' +

        /* A second, separate question on the same screen rather than a fifth step:
           subject and format are different questions but both are short picks, and
           splitting them into their own screens would repeat the same picker twice
           in a row. What you shoot says whose world this is; what kind of content
           says what a hotel actually receives \u2014 a wellness creator might be
           reels-only or might shoot reels, photo sets and a drone pass, and a hotel
           that needs UGC video is not served by a photo-only creator even when the
           niche is a perfect fit. Same vocabulary the hotel's own deliverables use
           (D.FORMATS), so a creator's answer and a hotel's ask are always the same
           words. */
        '<p class="ukField_l" style="margin-top:22px">What kind of content' +
          '<span class="ukCount2">' + f.formats.length + ' of ' + CAP + '</span></p>' +
        '<div class="ukChoice ukChoice--shoots" role="group" aria-label="What kind of content">' +
          D.FORMATS.map(function (n) {
            var on = f.formats.indexOf(n) > -1;
            var full = !on && f.formats.length >= CAP;
            return '<button class="ukPick ukPick--shoot' + (on ? ' is-on' : '') + '" ' +
              'type="button" data-format="' + esc(n) + '" aria-pressed="' + on + '"' +
              (full ? ' disabled' : '') + '>' + esc(n) + '</button>';
          }).join('') +
        '</div>' +
        (f.shoots.length >= CAP || f.formats.length >= CAP
          ? '<p class="ukHint">Five each. Tap one again to swap it out.</p>'
          : '') +

        '<div class="ukNav">' +
          '<button class="ukGhost ukNav_back" type="button" data-back>Back</button>' +
          '<button class="ukBtn ukNav_go" type="button" data-next ' +
            (ready ? '' : 'disabled') + '>Show me hotels</button>' +
        '</div>' +
      '</section>' +

      cardPane(f.shoots.length
        ? 'That is your card done. This is what hotels will see.'
        : 'Pick one and it lands on your card as a tag.') +
    '</div>';
  }

  /* ---------- step 4: the payoff ----------
     Their card is finished, so it holds the panel it has held since step two, and the
     left column turns into the thing they came for: hotels that want this. It mirrors
     the hotel side, where the same panel ended on creators they could invite. */
  /* What a creator actually needs to judge a hotel: the stay it built, not the size
     of audience it happens to be asking for — that number belongs on the hotel's own
     onboarding, not on a creator deciding whether the trip is worth taking. */
  function stayFacts(st) {
    var bits = [st.nights + ' night' + (st.nights === 1 ? '' : 's')];
    (st.del || []).forEach(function (d) {
      var singular = /s$/i.test(d.t) ? d.t.slice(0, -1) : d.t;
      var noun = d.q === 1 ? singular : singular + 's';
      /* reads as a plain list — "2 nights, 1 UGC video, 3 photos" — so it is
         lower-cased like the rest of the sentence, except a real acronym like UGC,
         which lower-casing would misspell */
      var head = noun.split(' ')[0];
      if (!(head.length > 1 && head === head.toUpperCase())) {
        noun = noun.charAt(0).toLowerCase() + noun.slice(1);
      }
      bits.push(d.q + ' ' + noun);
    });
    return bits.join(', ');
  }

  function four() {
    var picks = D.matchStays({ dests: f.dests, shoots: f.shoots, formats: f.formats, total: total() }, 4);

    return '<div class="ukStart_grid">' +
      '<section class="ukStart_ask ukStart_ask--wide">' +
        '<p class="ukStart_eyebrow">You’re live</p>' +
        '<h1 class="ukStart_h">These hotels want what you make.</h1>' +
        '<p class="ukStart_p">Matched on where you’re headed and what you shoot, ' +
          'not on how many people follow you.</p>' +

        /* The listing card the hotel built on their own onboarding, shown back here
           unchanged — this is literally what they made, so it is what a creator
           should meet. What is on it is the stay itself: nights and deliverables,
           the thing a creator is actually deciding on — not an audience band that
           belongs to the hotel's own onboarding, not a creator's decision here.
           Location moved off the photo into the body, where the rest of a
           listing's facts already live. */
        '<div class="ukLstGrid" id="ukLstGrid">' + picks.map(function (mm, i) {
          var st = mm.stay;
          var imgs = st.imgs && st.imgs.length ? st.imgs : [st.img];
          var cc = (D.placeOf(st.city) || {}).cc;
          return '<article class="ukLst" data-stay="' + esc(st.id) + '">' +
            '<div class="ukLst_m">' +
              imgs.map(function (src, k) {
                return '<img class="ukLst_img' + (k === 0 ? ' is-on' : '') + '" src="' + src + '" ' +
                  'alt="' + esc(st.hotel) + '"' + (i < 2 && k === 0 ? '' : ' loading="lazy" decoding="async"') + '>';
              }).join('') +
              (st.style ? '<div class="ukLst_pills"><span class="ukLst_pill">' +
                esc(st.style) + '</span></div>' : '') +
              /* the arrows are what move between photos; a dot row said the same
                 thing a second time and was told to go */
              (imgs.length > 1
                ? ['-1', '1'].map(function (d) {
                    return '<button class="ukLst_arw ukLst_arw--' + (d === '-1' ? 'p' : 'n') +
                      '" type="button" data-stayshot="' + d + '" aria-label="' +
                      (d === '-1' ? 'Previous' : 'Next') + ' photo">' +
                      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' +
                      (d === '-1' ? 'M14.5 5.5 8 12l6.5 6.5' : 'M9.5 5.5 16 12l-6.5 6.5') +
                      '" fill="none" stroke="currentColor" stroke-width="2.1" ' +
                      'stroke-linecap="round" stroke-linejoin="round"/></svg></button>';
                  }).join('')
                : '') +
            '</div>' +
            '<div class="ukLst_b">' +
              '<h3 class="ukLst_t">' + esc(st.hotel) + '</h3>' +
              '<p class="ukLst_sub">' +
                (cc ? '<img class="ukCrFlag" src="/assets/img/flags/' + cc + '.svg" alt="" ' +
                  'loading="lazy" decoding="async">' : '') +
                esc(st.city) + '</p>' +
              '<p class="ukLst_meta"><strong>' + esc(st.room) + '</strong> &middot; ' +
                esc(stayFacts(st)) + '</p>' +
            '</div>' +
          '</article>';
        }).join('') + '</div>' +

        '<div class="ukNav ukNav--done">' +
          '<button class="ukGhost ukNav_back" type="button" data-back>Back</button>' +
          '<a class="ukBtn ukNav_go" href="/creator/">Go to your dashboard</a>' +
        '</div>' +
      '</section>' +

      announcePane() +
    '</div>';
  }

  var destMap = null, mapHost = null, lastPins = null;

  /* The globe is built once and then MOVED into whichever dropdown is open. Every
     keystroke repaints the step, so rebuilding it there would remount a canvas and
     restart its animation on each letter typed; moving the same node keeps the
     bitmap, the listeners and the view exactly as they were. */
  function syncMap() {
    var slot = stage.querySelector('[data-mapslot]');
    if (!slot || !window.UKDOTMAP) return;      // panel closed — nothing to place
    if (!mapHost) {
      mapHost = document.createElement('div');
      mapHost.className = 'ukMap';
      mapHost.id = 'ukDestMap';
      mapHost.setAttribute('aria-hidden', 'true');
    }
    if (mapHost.parentNode !== slot) slot.appendChild(mapHost);
    var fresh = !destMap;
    if (!destMap) destMap = UKDOTMAP.mount(mapHost, { lat: 16, lng: 10, zoom: 1 });

    /* Every hotel or brand already on Ukreate, so the globe reads as a live market —
       dense where the platform already has supply, sparse where it does not — rather
       than an empty locator. Set once: these do not move as markets are picked. */
    if (fresh) {
      var seen = {}, spots = [];
      D.stays.forEach(function (st) {
        if (typeof st.lat !== 'number') return;
        var k = st.lat.toFixed(1) + ',' + st.lng.toFixed(1);
        if (seen[k]) return;
        seen[k] = 1;
        spots.push({ lat: st.lat, lng: st.lng });
      });
      destMap.hotspots(spots);
    }

    /* Only what has actually been picked goes on the globe. An empty map already
       carrying places reads as a result, and there is no result yet. */
    var picked = f.dests.map(function (k) { return D.destOf(k); })
                        .filter(function (d) { return d && typeof d.lat === 'number'; });
    var key = picked.map(function (d) { return d.k; }).join(',');

    /* Re-pinning re-frames and re-animates, so it happens when the picks change —
       not on every keystroke, which would have the globe swinging as you type. */
    if (key !== lastPins) {
      lastPins = key;
      destMap.pins(picked.map(function (d) {
        return { lat: d.lat, lng: d.lng, cc: d.cc, name: d.n,
                 /* the region line goes once there are several: on a globe this size
                    it is what turns neighbouring pins into a pile */
                 sub: picked.length > 2 ? '' : d.sub };
      }));
    } else {
      destMap.resume();                          // it was detached by the repaint
    }
  }

  /* Every market and every shoot tag renders in full — no cap picked in advance.
     This is what decides how many actually stay: as long as the row fits inside the
     card, nothing is hidden; the moment it would run past the card's own edge, items
     come off the end one at a time (never truncated mid-word, never wrapped to a
     second line) until what remains fits, and the rest fold into a single "+N" whose
     title lists exactly what it is hiding. Same rule for both rows — only the shape
     of the overflow badge differs, since a coverage line is text and a tag row is
     discrete pills. */
  /* measureEl is what has an actual box to overflow — for the tag row that is the
     row itself, but a market name's container is a plain inline span with no width
     of its own, so overflow has to be read off the block wrapper around it instead. */
  /* Step one is a single centred card; step two is a split screen. Repainting alone
     teleports the card across the page and pops the panel into existence. FLIP turns
     that into one movement: measure where the card sat, let the repaint happen, then
     play it from the old position to the new one while the panel slides in from the
     right edge behind it. Movement only, no fades, so nothing has to be waited for.
     Same technique the hotel side uses on its own step one — kept identical rather
     than reinvented, so leaving onboarding on either side feels like the same
     product. */
  var REDUCED_MOTION = window.matchMedia &&
                        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SLIDE = 520;

  function advance() {
    /* the slide-animation only matters at the one boundary where the layout
       itself changes shape — solo card to two-column-with-panel. The three
       pre-steps are solo-to-solo, so they just repaint. */
    var wasSolo = step === STEP_YOU;
    if (!wasSolo || REDUCED_MOTION) { step++; f.open = null; paint(); return; }

    var movers = ['#ukRail', '.ukStart_ask'];
    var before = movers.map(function (sel) {
      var el = root.querySelector(sel);
      return el ? el.getBoundingClientRect().left : null;
    });

    step++;
    f.open = null;
    paint();

    movers.forEach(function (sel, i) {
      var el = root.querySelector(sel);
      if (!el || before[i] === null) return;
      var dx = before[i] - el.getBoundingClientRect().left;
      if (!dx) return;
      el.style.transition = 'none';
      el.style.transform = 'translate3d(' + dx.toFixed(1) + 'px,0,0)';
      requestAnimationFrame(function () {
        el.style.transition = 'transform ' + SLIDE + 'ms cubic-bezier(.22,.61,.36,1)';
        el.style.transform = 'translate3d(0,0,0)';
      });
      setTimeout(function () { el.style.transition = ''; el.style.transform = ''; }, SLIDE + 90);
    });

    var pane = root.querySelector('.ukStart_pane');
    if (pane) {
      pane.classList.add('is-sliding');
      setTimeout(function () { pane.classList.remove('is-sliding'); }, SLIDE + 90);
    }
  }

  function paint(focus) {
    paintRail();
    /* nothing has a panel to show until platforms are connected, so the column
       runs to the middle of the page instead — the same shape the hotel side
       opens with. That covers the three new pre-steps too: none of them have
       anything for a panel to show either. */
    root.classList.toggle('ukStart--solo', step <= STEP_YOU);
    /* the rail counts identity progress; the welcome/intent/proof screens ahead
       of it aren't part of that count, so it stays off the page until step 1 */
    root.classList.toggle('ukStart--pre', step < STEP_YOU);
    /* the last panel is content rather than decoration, so it stacks on narrow widths
       instead of being dropped the way the working panels are */
    root.classList.toggle('ukStart--ann', step === STEP_HOTELS);
    stage.innerHTML =
      step === STEP_WELCOME ? welcome() :
      step === STEP_INTENT  ? intentStep() :
      step === STEP_PROOF   ? proofStep() :
      step === STEP_YOU     ? one() :
      step === STEP_WHERE   ? two() :
      step === STEP_SHOOT   ? three() : four();
    if (focus) {
      var el = document.getElementById(focus);
      if (el) { el.focus(); if (el.setSelectionRange) el.setSelectionRange(el.value.length, el.value.length); }
    }
    if (step === STEP_WHERE) syncMap();
    fitCard();
    positionPopup();
    keepPanelInView();
  }

  /* The page itself does not scroll — main is a fixed-height flex column — so the
     step card takes whatever room is left under the rail and scrolls inside it. That
     keeps the rail above and the buttons below on screen at any height, which is the
     whole point of pinning them. */
  function fitCard() {
    var ask = stage.querySelector('.ukStart_ask');
    if (!ask) return;
    ask.style.setProperty('--ask-max', 'none');
    var top = ask.getBoundingClientRect().top;
    var room = window.innerHeight - top - 16;
    ask.style.setProperty('--ask-max', Math.max(240, room) + 'px');
  }
  window.addEventListener('resize', fitCard);

  /* A panel carrying a globe is tall, and on a short screen it can open past the
     fold. Nudge the page so the whole thing is reachable — only when it actually
     overflows, so typing inside an already-visible panel never moves the view. */
  function keepPanelInView() {
    var drop = f.open && stage.querySelector('.ukPickr.is-open .ukPickr_drop');
    if (!drop) return;
    var over = drop.getBoundingClientRect().bottom - window.innerHeight + 16;
    if (over > 0) window.scrollBy(0, over);
  }

  root.addEventListener('input', function (e) {
    var i = e.target.closest('[data-k]');
    if (!i) return;
    f[i.dataset.k] = i.value;
    if (i.dataset.opens) f.open = i.dataset.opens;   // typing counts as opening it
    paint(i.id);
  });

  /* the field is the trigger: clicking it drops the panel, clicking it again while
     open puts it away, the way a select behaves */
  root.addEventListener('mousedown', function (e) {
    var i = e.target.closest('[data-opens]');
    if (!i) return;
    var k = i.dataset.opens;
    f.open = f.open === k ? null : k;
    e.preventDefault();
    paint(f.open ? k + 'Q' : null);
  });

  root.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (f.oauth && (f.oauth.stage === 'consent' || f.oauth.stage === 'error')) {
      return cancelOAuth();
    }
    if (f.popup) { f.popup = null; return paint(); }
    if (!f.open) return;
    var k = f.open;
    f.open = null;
    paint(k + 'Q');
  });

  /* anywhere else on the page closes it */
  document.addEventListener('mousedown', function (e) {
    if (!f.open || e.target.closest('.ukPickr')) return;
    f.open = null;
    paint();
  });

  /* the overflow popover: outside click closes it, and since it is anchored to a
     button rather than centred, a resize can leave it pointing at nothing — closing
     on resize is simpler and safer than re-anchoring mid-gesture */
  document.addEventListener('mousedown', function (e) {
    if (!f.popup || e.target.closest('[data-popup-panel]') || e.target.closest('[data-popup]')) return;
    f.popup = null;
    paint();
  });
  window.addEventListener('resize', function () {
    if (f.popup) { f.popup = null; paint(); }
  });

  root.addEventListener('click', function (e) {
    var el;

    if ((el = e.target.closest('[data-doconnect]'))) {
      if (f.oauth) return;
      startOAuth(el.dataset.doconnect);
      return;
    }
    if (e.target.closest('[data-oauth-allow]'))  { return allowOAuth(); }
    if (e.target.closest('[data-oauth-retry]'))  { return allowOAuth(); }
    if (e.target.closest('[data-oauth-cancel]')) { return cancelOAuth(); }
    /* the backdrop itself, not anything inside the card — and only while it is
       asking a question, not mid redirect or mid connect, the way a real permission
       prompt behaves */
    if (e.target.hasAttribute('data-oauth-scrim') && f.oauth &&
        (f.oauth.stage === 'consent' || f.oauth.stage === 'error')) {
      return cancelOAuth();
    }

    if ((el = e.target.closest('[data-popup]'))) {
      f.popup = f.popup === el.dataset.popup ? null : el.dataset.popup;
      return paint();
    }
    if (e.target.closest('[data-popup-close]'))  { f.popup = null; return paint(); }

    if (e.target.closest('[data-annmenuc]')) { f.annMenu = !f.annMenu; return paint(); }
    if ((el = e.target.closest('[data-annnetc]'))) {
      var netK = el.dataset.annnetc; f.annMenu = false; paint(); shareToCreator(netK); return;
    }
    if ((el = e.target.closest('[data-annactc]'))) {
      var howC = el.dataset.annactc;
      f.annMenu = false;
      paint();
      exportAnnounceCard(root.querySelector('[data-annmenuc]'), howC);
      return;
    }
    if (f.annMenu && !e.target.closest('.ukAnnC_menu')) { f.annMenu = false; paint(); }

    if ((el = e.target.closest('[data-makemain]'))) {
      var mi = +el.dataset.makemain;
      f.plats.unshift(f.plats.splice(mi, 1)[0]);
      return paint();
    }

    if ((el = e.target.closest('[data-unplat]'))) {
      f.plats.splice(+el.dataset.unplat, 1); return paint();
    }

    /* chips in and out; focus goes back to the search box so a keyboard run keeps
       its place through the repaint */
    if ((el = e.target.closest('[data-shoot]'))) {
      var sv = el.dataset.shoot, si = f.shoots.indexOf(sv);
      if (si > -1) f.shoots.splice(si, 1);
      else if (f.shoots.length < CAP) f.shoots.push(sv);
      return paint();
    }
    if ((el = e.target.closest('[data-format]'))) {
      var fv = el.dataset.format, fi = f.formats.indexOf(fv);
      if (fi > -1) f.formats.splice(fi, 1);
      else if (f.formats.length < CAP) f.formats.push(fv);
      return paint();
    }

    if ((el = e.target.closest('[data-chip]'))) {
      var ck = el.dataset.chip;
      if (f[ck].length < CAP && f[ck].indexOf(el.dataset.val) < 0) f[ck].push(el.dataset.val);
      f[ck === 'dests' ? 'destQ' : 'shootQ'] = '';
      /* nobody covers exactly one market, so the panel stays down after a pick —
         until the cap is reached, when there is nothing left to choose */
      if (f[ck].length >= CAP) f.open = null;
      paint(f[ck].length >= CAP ? null : ck + 'Q');
      return;
    }
    if ((el = e.target.closest('[data-unchip]'))) {
      var uk = el.dataset.unchip, ui = f[uk].indexOf(el.dataset.val);
      if (ui > -1) f[uk].splice(ui, 1);
      paint(uk + 'Q');
      return;
    }

    if ((el = e.target.closest('[data-stayshot]'))) {
      var sc = el.closest('[data-stay]'), sid = sc.dataset.stay;
      var cur = f.stayIx[sid] || 0, n = sc.querySelectorAll('.ukLst_img').length;
      f.stayIx[sid] = ((cur + (+el.dataset.stayshot)) % n + n) % n;
      /* Only this one card repaints — a full repaint would replay every stay's
         match score and reset every other card's own photo back to its first. */
      var ix = f.stayIx[sid];
      sc.querySelectorAll('.ukLst_img').forEach(function (im, k) { im.classList.toggle('is-on', k === ix); });
      return;
    }

    /* a tap both answers and advances — there is nothing to submit on a single-
       tap, identity-free question */
    if ((el = e.target.closest('[data-intent]'))) {
      f.intent = el.dataset.intent;
      advance(); window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (e.target.closest('[data-skipintent]')) {
      advance(); window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (e.target.closest('[data-back]')) {
      if (step > 0) { step--; f.open = null; paint(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
      return;
    }

    if (e.target.closest('[data-next]')) {
      /* Everything answered so far is written back before moving on, so the card in
         the panel and the matcher are reading the same person. */
      {
        /* what they said here is what the profile and the matcher both read */
        if (f.name.trim()) D.me.n = f.name.trim();
        if (f.handle)      D.me.h = f.handle.charAt(0) === '@' ? f.handle : '@' + f.handle;
        if (f.plats.length) {
          D.me.plats = f.plats.map(function (r) {
            var p = D.platOf(r.k) || { n: r.k };
            return { k: r.k, n: p.n, f: r.f, handle: r.handle };
          });
          D.me.band = D.bandOf(total());
        }
        if (f.shoots.length) { D.me.shoots = f.shoots.slice(); D.me.niche = f.shoots[0]; }
        if (f.formats.length) D.me.formats = f.formats.slice();
        if (f.dests.length)  D.me.dests = f.dests.slice();
      }
      if (step < STEP_HOTELS) { advance(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    }
  });

  /* ---------- drag between the buckets ----------
     The button on each row does the same job, so nothing here is the only way to
     reorder — this is the faster way, not the required one. */
  var dragIx = null;

  root.addEventListener('dragstart', function (e) {
    var r = e.target.closest('[data-plat]');
    if (!r) return;
    dragIx = +r.dataset.plat;
    r.classList.add('is-dragging');
    e.dataTransfer.effectAllowed = 'move';
    try { e.dataTransfer.setData('text/plain', String(dragIx)); } catch (err) {}
  });
  root.addEventListener('dragend', function () {
    root.querySelectorAll('.is-dragging').forEach(function (n) { n.classList.remove('is-dragging'); });
    root.querySelectorAll('.is-over').forEach(function (n) { n.classList.remove('is-over'); });
    dragIx = null;
  });
  root.addEventListener('dragover', function (e) {
    var b = e.target.closest('[data-bucket]');
    if (!b || dragIx === null) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    root.querySelectorAll('.is-over').forEach(function (n) {
      if (n !== b) n.classList.remove('is-over');
    });
    b.classList.add('is-over');
  });
  root.addEventListener('drop', function (e) {
    var b = e.target.closest('[data-bucket]');
    if (!b || dragIx === null) return;
    e.preventDefault();
    var moved = f.plats.splice(dragIx, 1)[0];
    if (b.dataset.bucket === 'main') f.plats.unshift(moved);
    else {
      /* dropped into "also on": if it was the main, whatever is now first takes over */
      f.plats.push(moved);
      if (!f.plats.length) f.plats = [moved];
    }
    dragIx = null;
    paint();
  });

  paint();
})();
