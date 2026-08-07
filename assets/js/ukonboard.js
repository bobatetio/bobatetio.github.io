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
    hotel:   { intent:'fill', name:'MiraGrace Estate', city:'Miami, Florida', cat:'Wellness & spa' },
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
          'Hotels host creators on nights they would rather see used than empty — you shoot, ' +
          'they host, you keep everything you make. Two minutes gets you set up so they can ' +
          'find you.', peek('creator'));
      },
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
          'Creators shoot your property in exchange for nights you were unlikely to sell, and ' +
          'you keep everything they make. A minute gets you set up so they can find you.',
          peek('hotel'));
      },
      done: function () { return true; },
      cta: 'Get started'
    },
    {
      k: 'intent',
      render: function (f) {
        return ask('What brings you to Ukreate?',
          'No wrong answer — this just helps us show you the right thing first.',
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
      render: function (f) {
        return ask('Where is ' + esc(String(f.name || '').trim() || 'your property') + '?',
          'Creators search by place, and it is the first thing they filter on.',
          field('obCity', 'city', f.city || '', 'Miami, Florida', 'City', 'address-level2'));
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
    }
  ];

  /* A glimpse, not a pitch — real rows already on the platform, so nothing on
     the welcome screen turns out to have been staged. The original onboarding's
     .ukPeek, with each side looking at the other side of the market. */
  function peek(side) {
    var rows = side === 'creator'
      ? ((window.UKC && window.UKC.stays) || []).slice(0, 3).map(function (s2) {
          return { img: s2.img, n: s2.hotel }; })
      : ((window.UK && window.UK.creators) || []).slice(0, 3).map(function (c) {
          return { img: c.img, n: c.n }; });
    if (!rows.length) return '';
    return '<div class="ukPeek" aria-hidden="true"><div class="ukPeek_row">' +
      rows.map(function (r) {
        return '<span class="ukPeek_card"><img src="' + r.img + '" alt="" loading="lazy" ' +
          'decoding="async"><span class="ukPeek_n">' + esc(r.n) + '</span></span>';
      }).join('') + '</div>' +
      '<p class="ukPeek_cap">' + (side === 'creator'
        ? 'A few of the hotels already on Ukreate, looking for creators right now'
        : 'A few of the creators already on Ukreate, looking for stays right now') +
      '</p></div>';
  }

  /* The connector mutates its own state object as the OAuth beats play out, so
     it needs a live one rather than a fresh read of storage each paint. */
  var LIVE = {};
  function liveState(f) {
    if (!LIVE.plats) LIVE.plats = (f.plats || []).slice();
    return LIVE;
  }
  function flushPlats(side) {
    if (LIVE.plats) set(side, { plats: LIVE.plats.slice() });
  }

  /* ---- the pieces, all of them already in the product ---- */
  function ask(h, p, body) {
    return '<section class="ukStart_ask">' +
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
  function railHtml(side, at) {
    var list = steps(side);
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
      '<div class="ukModal ukOb_modal" role="dialog" aria-modal="true" aria-label="Set up your account">' +
        railHtml(side, at) +
        s.render(f) +
        '<div class="ukNav ukOb_nav">' +
          '<span></span>' +
          '<button class="ukBtn ukNav_go" type="button" data-ob-next' + (ready ? '' : ' disabled') + '>' +
            (s.cta || (last ? 'Finish' : 'Continue')) + '</button>' +
          /* Only where there is something to type. On a screen of pills, "or
             press Enter" is an instruction about a key you were never using.
             Rendered hidden until the field has something in it, and revealed by
             the same input handler that enables the button — repainting the whole
             modal on a keystroke would take the caret with it. */
          (!last && s.render(f).indexOf('data-ob-field') > -1
            ? '<span class="ukEnter" data-ob-enter' + (ready ? '' : ' hidden') + '>' +
              '<kbd class="ukEnter_k">&#8629;</kbd>Or press Enter</span>'
            : '') +
        '</div>' +
      '</div></div>';
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
                  me.h = '@' + (f.plats[0].handle || 'you'); }
      }
    } else {
      var p = window.UK && window.UK.property;
      if (!p) return;
      if (String(f.name || '').trim()) p.name = String(f.name).trim();
      if (String(f.city || '').trim()) p.city = String(f.city).trim();
      if (f.cat) { p.cat = f.cat; p.type = p.type || f.cat; }
    }
  }

  /* ================= tier two =================
     Every line is asked of the live records. A checklist that stores its own
     ticks drifts the moment anything is deleted, and then it is lying too. */
  function tasks(side) {
    if (side === 'creator') {
      var me = (window.UKC && window.UKC.me) || {};
      var A = window.UKAPPLY;
      return [
        { t:'Connect a platform', s:'Swaps your rough size for the real number.',
          go:'profile', done:(me.plats || []).some(function (x) { return x.f; }) },
        { t:'Add three pieces of work', s:'This is what hotels are actually buying.',
          go:'profile', done:(me.work || []).length >= 3 },
        { t:'Save a stay you like', s:'Anything you save is one press from a pitch.',
          go:'stays', done:(window.UKFAVS ? window.UKFAVS.count('stays') : 0) > 0 },
        { t:'Send your first pitch', s:'Four to a yes is a good ratio, not a bad one.',
          go:'pitch', done:!!(A && A.mine().length) }
      ];
    }
    var UK = window.UK || {};
    var R = window.UKSTAYS;
    return [
      { t:'Publish your first stay', s:'Until one is live, creators cannot find you.',
        go:'host', done:!!(R && R.forProperty((UK.property || {}).name).length) },
      { t:'Add photos of the property', s:'Properties with photos get about three times the applications.',
        go:'property', done:!!(UK.property && UK.property.img) },
      { t:'Write your guest guide', s:'Answers the questions every creator asks on arrival.',
        go:'guides', done:!!(UK.guides && UK.guides[0] && UK.guides[0].live) },
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
    flush: flushPlats
  };
})();
