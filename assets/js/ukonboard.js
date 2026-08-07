/* Ukreate — onboarding, inside the app. Loaded by both /app/ and /creator/.

   IT USED TO BE A WALL. Sign up, and you were handed four steps on a page of
   their own before you had seen a single hotel or a single creator. That is the
   highest drop-off shape in software: it charges admission before showing the
   room.

   It is now two tiers, and the split is the whole idea:

   TIER ONE — a short gate, in a modal over the live app. Only the answers
   without which the product would LIE to you. A creator's size band is what
   every fit score is computed against; a hotel's city and category are what
   creators read before applying and what the match runs on. Browse before those
   exist and the app shows stays scored 10/10 against nothing, which is worse
   than a form — it teaches you the scoring is decoration.

   TIER TWO — everything else, as a checklist on the dashboard, derived from the
   real records rather than from a stored tick. Photos, work samples, the guest
   guide, the first stay. None of it blocks anything; all of it improves
   something, and each line can say exactly what.

   ASYMMETRIC ON PURPOSE. The hotel gate is four screens, the creator's three.
   A property signing up has already made a considered decision and will sit
   through more; a creator is phone-first and low-commitment, and the value they
   came for is looking at stays.

   NOTHING HERE IS A NEW COMPONENT. The step card, the progress rail, the intent
   picker, the pill choices, the fields and the nav buttons are the ones the
   original onboarding already used — .ukStart_ask, .ukStart_rail, .ukIntent,
   .ukPick, .ukField, .ukNav — rendered inside the hotel app's own modal shell. */
window.UKONBOARD = (function () {
  var KEY = 'uk_onboarding_v1';

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; }
  }
  function save(o) {
    try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {}
  }
  /* An established account has, by definition, already onboarded — so the demo
     view implies the onboarding state rather than the two being set separately.
     Without this, opening ?as=live on a clean browser showed the established
     account's full data behind a first-time gate, which is a state no real
     account is ever in. */
  var SEEDED = {
    /* Must answer every step there IS. Adding the photographs question without
       adding it here is what put the gate back in front of an account that had
       already onboarded. */
    hotel:   { intent:'fill', name:'MiraGrace Estate', city:'Miami, Florida',
               cityK:'c-us-miami', cc:'us', cat:'Wellness & spa',
               photos:['/assets/img/fc2/hero-hotel.jpg'] },
    /* Matches the STEPS above, not an older set of them. When the creator flow
       gained "what do you make" and swapped a self-declared band for connected
       platforms, this was left describing the old questions — so an established
       account came up with the gate in front of it, having answered everything
       the gate no longer asked. */
    creator: { shoots:['Wellness & spa','Luxury & design'],
               formats:['Reels','Photos'],
               plats:[{ k:'ig', handle:'amaratravels', f:12400 },
                      { k:'tt', handle:'amaratravels', f:8600 }] }
  };
  function get(side) {
    var v = load()[side];
    if (v && Object.keys(v).length) return v;
    var established = !window.UKDEMO || !window.UKDEMO.isNew();
    return established ? Object.assign({}, SEEDED[side] || {}) : {};
  }
  function set(side, patch) {
    var all = load();
    all[side] = Object.assign({}, all[side] || {}, patch);
    save(all);
    return all[side];
  }
  function reset(side) {
    var all = load();
    if (side) delete all[side]; else all = {};
    save(all);
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' })[c];
    });
  }

  /* ================= the questions =================
     Each step names the field it fills and says when it is answered. `done` is
     asked of the live value, never of a stored flag, so a step cannot claim to
     be finished when the record behind it is empty. */

  var CREATOR = [
    {
      k: 'welcome',
      /* The original onboarding opened on a welcome, not a question, and it was
         right to: the first screen has to say what this is before it asks for
         anything. Same words, same peek at three real hotels already on the
         platform — nothing shown here turns out to have been staged. */
      render: function () {
        return ask('Welcome to Ukreate',
          'Hotels trade nights they would rather fill for content. You shoot the ' +
          'property, they host your stay, and everything you make stays yours to post. ' +
          'Two minutes and they can start finding you.', '', { mark: true });
      },
      art: 'creator',
      bare: true,          /* not a question: no rail, and it does not count */
      done: function () { return true; },
      cta: 'Get started'
    },
    {
      k: 'shoots',
      render: function (f) {
        var picked = f.shoots || [];
        var CAP = (window.UKVOCAB && window.UKVOCAB.MAX_PICKS) || 5;
        return ask('What do you shoot?',
          'Pick what your work actually is. This is what a hotel reads before ' +
          'they decide you are right for the room.',
          '<p class="ukField_l">What you shoot' +
            '<span class="ukCount2">' + picked.length + ' of ' + CAP + '</span></p>' +
          picks(((window.UKVOCAB || {}).SHOOTS || []), picked, 'shoots', CAP));
      },
      done: function (f) { return (f.shoots || []).length > 0; }
    },
    {
      k: 'formats',
      /* This was missing entirely, and it is a different question. What you
         shoot says whose world this is; what you make says what a hotel actually
         receives — a wellness creator might be reels-only or might shoot reels,
         photo sets and a drone pass, and a hotel that needs UGC video is not
         served by a photo-only creator however well the niche fits. Same
         vocabulary the hotel's own deliverables use, so a creator's answer and a
         hotel's ask are always the same words. */
      render: function (f) {
        var picked = f.formats || [];
        var CAP = (window.UKVOCAB && window.UKVOCAB.MAX_PICKS) || 5;
        return ask('And what do you make?',
          'Reels, photo sets, drone passes. This is what a hotel actually receives, ' +
          'and it is a different question from what you shoot.',
          '<p class="ukField_l">What kind of content' +
            '<span class="ukCount2">' + picked.length + ' of ' + CAP + '</span></p>' +
          picks(((window.UKVOCAB || {}).FORMATS || []), picked, 'formats', CAP));
      },
      done: function (f) { return (f.formats || []).length > 0; }
    },
    {
      k: 'plats',
      /* The real connector, the one the onboarding page has always used — two
         buckets, drag to change which is main, and an OAuth stand-in that
         redirects, asks consent and sometimes fails. It replaces a pill asking
         the creator to estimate their own audience: a connected platform gives
         the real number, and the band falls out of it. */
      render: function (f) {
        var P = window.UKPLATCONNECT;
        if (!P) return ask('Where do you post?', '', '');
        return ask('Let’s start with where you post.',
          'Pick the profiles you already post from. We read your work from them, ' +
          'so there is nothing to upload.',
          P.body(liveState(f)));
      },
      done: function (f) { return (f.plats || []).length > 0; }
    }
  ];

  var HOTEL = [
    {
      k: 'welcome',
      render: function () {
        return ask('Welcome to Ukreate',
          'Travel creators shoot your property in exchange for nights you were unlikely to ' +
          'sell, and everything they make is yours to keep and post. A minute here is all ' +
          'it takes for them to start finding you.',
          '', { mark: true });
      },
      art: 'hotel',
      bare: true,          /* not a question: no rail, and it does not count */
      done: function () { return true; },
      cta: 'Get started'
    },
    {
      k: 'intent',
      render: function (f) {
        return ask('What brings you to Ukreate?',
          'There is no wrong answer here. It only decides what we show you first.',
          intents(f.intent, [
            { k:'fill',    t:'Fill rooms I was not going to sell', s:'Trade quiet nights for content.' },
            { k:'content', t:'Get content for my own channels',    s:'Photography and video I keep and use.' },
            { k:'look',    t:'See how this works first',           s:'Look around before publishing anything.' }
          ]));
      },
      done: function (f) { return !!f.intent; }
    },
    {
      k: 'name',
      render: function (f) {
        return ask('First, your property name.',
          'The name creators will see. You can change it later.',
          field('obName', 'name', f.name || '', 'MiraGrace Estate', 'Property name', 'organization'));
      },
      done: function (f) { return !!String(f.name || '').trim(); }
    },
    {
      k: 'city',
      /* Chosen from the list, never typed free. Creators filter on place, and a
         filter cannot tell that "Miami FL" and "Miami, Florida" are one city.
         UKPLACE is the picker the hire brief already uses: type, and the matches
         drop down with their flag beside the name. */
      render: function (f) {
        var P = window.UKPLACE;
        var chosen = P ? P.byKey(f.cityK) : null;
        return ask('Where is ' + esc(String(f.name || '').trim() || 'your property') + '?',
          'Start typing and pick it from the list. Creators search by place, and it ' +
          'is the first thing they filter on.',
          P ? P.html({
                id: 'obCity', q: CITYQ.q, open: CITYQ.open, chosen: chosen,
                value: f.city || '', ph: 'Try Miami, Lisbon, Kyoto…',
                aria: 'Where the property is',
                qAttr: 'data-ob-placeq', pickAttr: 'data-ob-placepick'
              })
            : field('obCity', 'city', f.city || '', 'Miami, Florida', 'City', 'address-level2'));
      },
      done: function (f) { return !!String(f.city || '').trim(); }
    },
    {
      k: 'cat',
      render: function (f) {
        return ask('What are you known for?',
          'This is what we match creators against, and what they read on your ' +
          'stays. One is enough to start.',
          picks(((window.UKVOCAB || {}).SHOOTS || []), f.cat ? [f.cat] : [], 'cat', 1));
      },
      done: function (f) { return !!f.cat; }
    },
    {
      k: 'photos',
      /* Asked here rather than left on the checklist. A creator deciding whether
         to pitch looks at the photographs before they read a word, so a property
         with none is not really listed. It was the one setup task that gated
         everything after it, and leaving it for later meant the first thing a
         hotel published was a stay nobody could see. */
      /* THE uploader from /start/: drop or browse, drag to reframe, remove.
         See ukshots.js. This step had a rebuilt-from-nothing grid with no crop
         and no drop target for a while. */
      render: function (f) {
        var S = window.UKSHOTS;
        return ask('Now some photographs of the property.',
          'Creators look at these before they read anything else. Three or four ' +
          'is plenty to start, and you can add the rest later.',
          S ? S.tiles(shotState(f)) : '');   /* the crop overlay is rendered by modalHtml */
      },
      done: function (f) { return ((SHOTS.photos || f.photos) || []).length > 0; }
    }
  ];

  /* The welcome carries one image, and it is not built from data.

     It held two real cards for a while - the actual stay card and the actual
     creator card, rendered live. They were the right components and the wrong
     idea: a welcome screen is the one place in the product that should say what
     this IS, and two dense cards full of engagement rates and stat rows answer a
     question nobody has asked yet. The cards are what you meet on the very next
     screen, in the app behind this modal.

     So it is a single image, and the artwork is supplied rather than assembled.
     Until it lands this renders a plain placeholder at the right size, because
     inventing a stand-in is how a mockup gets shipped by accident.

     // PLUG-IN POINT - drop the artwork at /assets/img/onboard-welcome-<side>.jpg
     // and it is picked up here. */
  /* Named here rather than probed for. Requesting a file that is not there in
     order to find out whether it is there costs a 404 on every first paint, and
     the fallback it triggers looks identical to real artwork having failed.

     PNG, not JPG: these are cutouts with a transparent background, and
     flattening one onto white would put a white slab inside a card that is not
     always white. */
  var ART = { hotel: true, creator: false };
  function peek(side) {
    if (!ART[side]) {
      return '<div class="ukObArt is-empty" data-obart>' +
        '<span class="ukObArt_ph" aria-hidden="true">Image</span></div>';
    }
    return '<div class="ukObArt" data-obart>' +
      '<img class="ukObArt_i" src="/assets/img/onboard-welcome-' + side + '.png" alt="">' +
    '</div>';
  }

  /* The connector mutates its own state object as the OAuth beats play out, so
     it needs a live one rather than a fresh read of storage each paint. */
  var LIVE = {};
  /* The uploader mutates its own state as crops are dragged and written, so it
     needs a live object rather than a fresh read of storage on every paint. Same
     reason the platform connector has one. */
  var SHOTS = { photos: null, cropIx: null };
  function shotState(f) {
    if (!SHOTS.photos) SHOTS.photos = (f.photos || []).slice();
    return SHOTS;
  }
  function flushShots(side) {
    if (SHOTS.photos) set(side, { photos: SHOTS.photos.slice() });
  }
  /* How you found the place is view state, not an answer, so it lives here and
     not in the saved record. */
  var CITYQ = { q: '', open: false };
  function liveState(f) {
    if (!LIVE.plats) LIVE.plats = (f.plats || []).slice();
    return LIVE;
  }
  function flushPlats(side) {
    if (LIVE.plats) set(side, { plats: LIVE.plats.slice() });
  }

  /* ---- the pieces, all of them already in the product ---- */
  /* The mark sits above the heading on the welcome, not inside it. A screen that
     opens by naming the product should show the product's own mark first. */
  function ask(h, p, body, o) {
    o = o || {};
    return '<section class="ukStart_ask' + (o.mark ? ' ukStart_ask--mark' : '') + '">' +
      (o.mark
        ? '<img class="ukOb_logo" src="/assets/img/ukreate-logo-ink.svg" alt="Ukreate" ' +
          'width="132" height="30">'
        : '') +
      '<h1 class="ukStart_h">' + h + '</h1>' +
      '<p class="ukStart_p">' + p + '</p>' + body +
    '</section>';
  }
  function intents(cur, opts) {
    return '<div class="ukIntents" role="group">' + opts.map(function (o) {
      return '<button class="ukIntent' + (cur === o.k ? ' is-on' : '') + '" type="button" ' +
        'data-ob-set="intent" data-ob-val="' + esc(o.k) + '">' +
        '<span class="ukIntent_t">' + esc(o.t) + '</span>' +
        '<span class="ukIntent_s">' + esc(o.s) + '</span></button>';
    }).join('') + '</div>';
  }
  function picks(list, picked, key, cap) {
    return '<div class="ukChoice ukChoice--shoots" role="group">' + list.map(function (n) {
      var on = picked.indexOf(n) > -1;
      var full = !on && cap > 1 && picked.length >= cap;
      return '<button class="ukPick ukPick--shoot' + (on ? ' is-on' : '') + '" type="button" ' +
        'data-ob-pick="' + esc(key) + '" data-ob-val="' + esc(n) + '" data-ob-cap="' + cap + '" ' +
        'aria-pressed="' + on + '"' + (full ? ' disabled' : '') + '>' + esc(n) + '</button>';
    }).join('') + '</div>';
  }
  function field(id, k, v, ph, label, ac) {
    return '<label class="ukField"><span class="ukField_l ukSrOnly">' + esc(label) + '</span>' +
      '<input class="ukField_i" id="' + id + '" data-ob-field="' + esc(k) + '" value="' + esc(v) + '" ' +
      'placeholder="' + esc(ph) + '" autocomplete="' + esc(ac || 'off') + '"></label>';
  }

  function steps(side) { return side === 'creator' ? CREATOR : HOTEL; }

  /* ================= the gate ================= */
  function complete(side) {
    var f = get(side);
    return steps(side).every(function (s) { return s.done(f); });
  }
  /* which screen to open on: the first unanswered one, so leaving and coming
     back does not start from the top */
  function firstOpen(side) {
    var f = get(side), list = steps(side);
    for (var i = 0; i < list.length; i++) if (!list[i].done(f)) return i;
    return list.length - 1;
  }

  /* A filled bar with Back on its left and the count on its right, rather than a
     row of numbered dots. Dots put every step on screen at once, which makes a
     four-step flow look like a form with four sections; a bar says only how far
     along you are, which is the one thing worth saying. */
  /* The welcome is not a question, so it carries no rail and is not counted. A
     counter that opens on 1/6 and then shows 2/6 on the first thing you are
     actually asked is describing a form with six fields; the questions are five
     and the welcome is the door. */
  function counted(side) {
    return steps(side).filter(function (s) { return !s.bare; });
  }
  function railHtml(side, at) {
    var list = counted(side);
    var bare = steps(side).length - list.length;   /* how many precede the count */
    at = at - bare;
    var pct = Math.round((at) / (list.length - 1) * 100);
    return '<div class="ukObBar">' +
        '<div class="ukObBar_t" aria-hidden="true"><i style="width:' + pct + '%"></i></div>' +
        '<div class="ukObBar_r">' +
          (at > 0
            ? '<button class="ukObBar_back" type="button" data-ob-back>' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
              'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
              '<path d="m15 18-6-6 6-6"/></svg>Back</button>'
            : '<span></span>') +
          '<span class="ukObBar_n">' + (at + 1) + '<em>/' + list.length + '</em></span>' +
        '</div>' +
      '</div>';
  }

  /* The modal, in the hotel app's own .ukModalWrap / .ukModal shell so it is the
     same dialog the rest of that portal uses. One question per screen with the
     rail above it: the same questions in one long form read as far more work,
     and this is the one thing worth borrowing from every onboarding that does
     this well. */
  function modalHtml(side, at) {
    var list = steps(side), f = get(side), s = list[at];
    var ready = s.done(f);
    var last = at === list.length - 1;
    return '<div class="ukModalWrap ukOb" data-ob-wrap>' +
      '<div class="ukModal ukOb_modal' + (s.art ? ' has-art' : '') + '" role="dialog" ' +
        'aria-modal="true" aria-label="Set up your account">' +
        (s.bare ? '' : railHtml(side, at)) +
        /* Outside the question, because it belongs to the card. Nested inside the
           scrolling body it counted toward that body's scroll height and put a
           scrollbar on a step that fits. */
        (s.art ? peek(s.art) : '') +
        s.render(f) +
        '<div class="ukNav ukOb_nav">' +
          '<span></span>' +
          /* No "or press Enter" hint. Enter still advances a field, because it
             should, but captioning it puts a keyboard instruction next to the
             button that already says what to do. */
          '<button class="ukBtn ukNav_go" type="button" data-ob-next' + (ready ? '' : ' disabled') + '>' +
            (s.cta || (last ? 'Finish' : 'Continue')) + '</button>' +
        '</div>' +
      '</div>' +
      /* Outside the card, the way the artwork is outside the question.
         .ukStart_ask is positioned and scrolls, so it makes a stacking context,
         and a fixed overlay rendered inside it painted UNDER the nav row that
         follows it: Save crop was visible and unclickable. */
      ((window.UKSHOTS && SHOTS.cropIx !== null && SHOTS.cropIx !== undefined)
        ? window.UKSHOTS.editor(SHOTS) : '') +
    '</div>';
  }

  /* ================= applying the answers =================
     Onboarding does not keep its own copy of anything. It writes into the record
     the rest of the product already reads — the creator's public profile is the
     one in ukshared.js that the hotel's roster derives from, so answering here
     changes what a hotel sees. */
  function apply(side) {
    var f = get(side);
    if (side === 'creator') {
      var M = window.UKME, me = window.UKC && window.UKC.me;
      if (f.shoots && f.shoots.length) {
        if (M) { M.cats = f.shoots.slice(); M.type = f.shoots[0]; }
        if (me) { me.cats = f.shoots.slice(); me.type = f.shoots[0]; }
      }
      if (f.formats && f.formats.length && me) me.makes = f.formats.slice();
      /* Connected platforms give the real handle and the real follower count, so
         the band is read off them rather than asked for. */
      var P = window.UKPLATCONNECT;
      if (P && (f.plats || []).length) {
        var plats = f.plats.map(function (r) {
          return { k:r.k, n:P.platOf(r.k).n, f:r.f };
        });
        if (M)  { M.plats = plats; M.band = P.bandFor(P.total({ plats:f.plats })); }
        if (me) { me.plats = plats.slice(); me.band = M ? M.band : me.band;
                  me.h = '@' + (f.plats[0].handle || 'you');
                  /* Connecting reads the work; the creator does not upload it.
                     This is the step's own promise being kept, and it is why
                     there is no "add three pieces of work" task anywhere. */
                  if (P.work) me.work = P.work(f.plats); }
      }
    } else {
      var p = window.UK && window.UK.property;
      if (!p) return;
      if (String(f.name || '').trim()) p.name = String(f.name).trim();
      if (String(f.city || '').trim()) p.city = String(f.city).trim();
      if (f.cc) p.cc = f.cc;
      if (f.cat) { p.cat = f.cat; p.type = p.type || f.cat; }
      /* The cropped file, not the original: every card in the product renders
         these in a fixed 4:3 tile, and the crop is the whole point of the step.
         The first one is the cover. */
      var S = window.UKSHOTS, ph = (SHOTS.photos && SHOTS.photos.length) ? SHOTS.photos : (f.photos || []);
      if (ph.length && S) {
        p.shots = ph.map(function (x) { return S.out(x); });
        p.img = p.shots[0];
      }
    }
  }

  /* ================= tier two =================
     Every line is asked of the live records. A checklist that stores its own
     ticks drifts the moment anything is deleted, and then it is lying too. */
  function tasks(side) {
    if (side === 'creator') {
      var A = window.UKAPPLY;
      /* Neither "connect a platform" nor "add three pieces of work" belongs here.
         The gate asks for the connection, and the connection is what brings the
         work across - the creator never uploads any of it. Both lines described
         a product where you declared a rough size and posted your own samples,
         and that product stopped existing when the real connector went in. What
         is left is the two things only the creator can decide. */
      return [
        { t:'Save a stay you like', s:'Anything you save is one press from a pitch.',
          go:'stays', done:(window.UKFAVS ? window.UKFAVS.count('stays') : 0) > 0 },
        { t:'Send your first pitch', s:'Four to a yes is a good ratio, not a bad one.',
          go:'pitch', done:!!(A && A.mine().length) }
      ];
    }
    var UK = window.UK || {};
    var R = window.UKSTAYS;
    /* Photographs are asked for in the gate now, so the line for them is gone
       from here: a checklist should never repeat a question already answered.
       The guest guide is off it too. It is written once the first creator is
       actually coming, and putting it in front of a hotel on day one asked them
       to write arrival notes for a stay that did not exist yet. */
    return [
      { t:'Publish your first stay', s:'Until one is live, creators cannot find you.',
        go:'host', done:!!(R && R.forProperty((UK.property || {}).name).length) },
      { t:'Invite a creator', s:'You do not have to wait to be found.',
        go:'creators', done:!!(window.UKINVITE && window.UKINVITE.all().length) }
    ];
  }

  function checklist(side) {
    var list = tasks(side);
    var left = list.filter(function (t) { return !t.done; });
    if (!left.length) return '';          /* finished: it stops existing */
    var doneN = list.length - left.length;
    return '<section class="ukObList" aria-label="Finish setting up">' +
      '<div class="ukObList_head">' +
        '<p class="ukObList_t">Finish setting up</p>' +
        '<p class="ukObList_c">' + doneN + ' of ' + list.length + ' done</p>' +
      '</div>' +
      '<div class="ukObList_bar" aria-hidden="true">' +
        '<i style="width:' + Math.round(doneN / list.length * 100) + '%"></i></div>' +
      '<ul class="ukObList_l">' + list.map(function (t) {
        return '<li class="ukObTask' + (t.done ? ' is-done' : '') + '">' +
          '<span class="ukObTask_tick">' + (t.done
            ? '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.6 6.35 4.85 8.6 9.4 3.75" ' +
              'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" ' +
              'stroke-linejoin="round"/></svg>'
            : '') + '</span>' +
          '<span class="ukObTask_b"><span class="ukObTask_t">' + esc(t.t) + '</span>' +
          '<span class="ukObTask_s">' + esc(t.s) + '</span></span>' +
          (t.done ? '' : '<button class="ukGhost ukGhost--sm" type="button" data-goto="' + t.go + '">Do it</button>') +
        '</li>';
      }).join('') + '</ul></section>';
  }

  return {
    steps: steps, get: get, set: set, reset: reset,
    complete: complete, firstOpen: firstOpen,
    modalHtml: modalHtml, apply: apply, checklist: checklist, tasks: tasks,
    /* the connector mutates this as its OAuth beats play out */
    live: function () { return liveState(get('creator')); },
    cityq: function () { return CITYQ; },
    shots: function () { return SHOTS; },
    flushShots: flushShots,
    flush: flushPlats
  };
})();
