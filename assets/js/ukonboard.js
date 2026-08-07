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
    hotel:   { intent:'fill',  name:'MiraGrace Estate', city:'Miami, Florida', cat:'Wellness & spa' },
    creator: { intent:'pitch', shoots:['Wellness & spa'], band:'5K - 25K' }
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
      k: 'intent',
      /* Borrowed from the original creator onboarding, unchanged. It is the one
         question that earns a screen without filling a field: it decides what we
         show first, so the rest of the session is shaped by the answer. */
      render: function (f) {
        return ask('What are you hoping to do here?',
          'No wrong answer — this just helps us show you the right thing first.',
          intents(f.intent, [
            { k:'pitch',   t:'Find hotels to pitch',     s:'Jump straight into real matches.' },
            { k:'look',    t:'See how this works first', s:'Look around before setting anything up.' },
            { k:'profile', t:'Build my profile',         s:'Get my work and platforms set up.' }
          ]));
      },
      done: function (f) { return !!f.intent; }
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
      k: 'band',
      render: function (f) {
        var B = (window.UKC && window.UKC.BANDS) || ['Under 5K','5K - 25K','25K - 100K','100K+'];
        return ask('How big is your audience?',
          'Roughly is fine. Hotels match against this, and plenty of stays go to ' +
          'creators at the smaller end — a following that actually watches is ' +
          'worth more than a big one that scrolls past.',
          picks(B, f.band ? [f.band] : [], 'band', 1) +
          '<p class="ukWhy">Connect your platforms later and this is replaced by the real number.</p>');
      },
      done: function (f) { return !!f.band; }
    }
  ];

  var HOTEL = [
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

  function railHtml(side, at) {
    var f = get(side);
    return '<ol class="ukStart_rail ukOb_rail" aria-label="Progress">' +
      steps(side).map(function (s, i) {
        var done = i < at && s.done(f);
        return '<li class="' + (done ? 'is-done' : i === at ? 'is-now' : '') + '">' +
          '<span class="ukStart_dot">' + (done
            ? '<svg class="ukTick" viewBox="0 0 12 12" aria-hidden="true">' +
              '<path d="M2.6 6.35 4.85 8.6 9.4 3.75" fill="none" stroke="currentColor" ' +
              'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
            : i + 1) + '</span></li>';
      }).join('') + '</ol>';
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
        '<p class="ukOb_count">' + (at + 1) + ' of ' + list.length + '</p>' +
        s.render(f) +
        /* The gate covers the account menu, and the demo switcher lives in it —
           so in the first-time view there would be no way back to the
           established one without clearing storage. This line is a review
           control, not product: it only exists in that view. */
        (window.UKDEMO && window.UKDEMO.isNew()
          ? '<p class="ukOb_demo">Viewing the first-time account. ' +
            '<button type="button" class="ukLinkBtn" data-demo="live">Switch to the established one</button></p>'
          : '') +
        '<div class="ukNav ukOb_nav">' +
          (at > 0
            ? '<button class="ukGhost ukNav_back" type="button" data-ob-back>Back</button>'
            : '<span></span>') +
          '<button class="ukBtn ukNav_go" type="button" data-ob-next' + (ready ? '' : ' disabled') + '>' +
            (last ? 'Finish' : 'Continue') + '</button>' +
          /* the original onboarding said this next to its Continue, and the
             keystroke works here too */
          (ready && s.k !== 'intent' && !last
            ? '<span class="ukEnter"><kbd class="ukEnter_k">&#8629;</kbd>Or press Enter</span>'
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
      if (f.band) { if (M) M.band = f.band; if (me) me.band = f.band; }
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
    modalHtml: modalHtml, apply: apply, checklist: checklist, tasks: tasks
  };
})();
