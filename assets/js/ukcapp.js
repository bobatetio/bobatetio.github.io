/* Ukreate — creator app shell.
   Creator-only by construction. No hotel surface is routed here. */
(function () {
  var root = document.querySelector('[data-ukc]');
  if (!root) return;

  // Landing here at all means this device is on the creator side. Record it so the shared
  // door at /signin/ never asks again, including after a direct visit that skipped login.
  try { localStorage.setItem('uk_side', 'creator'); } catch (e) {}
  var D = window.UKC, V = window.UKCV;

  /* IA: what needs you now, where the work comes from, and you.
     Community is a deliberate doorway out, not a dead nav item. */
  var NAV = [
    { group:'Today', items:[
      { id:'home',    title:'Dashboard',   icon:'home' },
      { id:'collabs', title:'Your collabs',icon:'chat' }
    ]},
    /* ONE PAGE FOR A STAY, not two. "Discover stays" and "Pitch Pilot" rendered
       the same D.stays list from two places, and a stay's home silently changed
       the moment you pitched it. State is an attribute of an object, not another
       place to keep it, so the lanes filter one list rather than splitting it.
       Outreach is a genuinely different object, not the same list again — a
       hotel with no campaign on Ukreate at all — but it is still "find
       work," the same question with a warm and a cold answer, so it is a
       tab on this page rather than a second nav item competing with it. */
    { group:'Find work', items:[
      { id:'stays',    title:'Stays',    icon:'search' },
      { id:'earn',     title:'Earnings', icon:'wallet' }
    ]},
    { group:'You', items:[
      { id:'discover',title:'Discover',     icon:'image' },
      { id:'kit',     title:'Media kit',    icon:'idcard' },
      { id:'academy', title:'Academy',      icon:'book' },
      { id:'community',title:'Community',   icon:'chat', out:true }
    ]}
  ];

  /* "Your profile" and "Account" are reachable from the account menu now, not
     the left rail — but the account menu still routes to them by id, so their
     page titles have to resolve even without a matching NAV entry. */
  var TITLES = { member:'Membership', editme:'How you travel',
                 hotel:'Hotel', guide:'Guest guide',
                 profile:'Your profile', account:'Account' };
  NAV.forEach(function (g) { g.items.forEach(function (i) { TITLES[i.id] = i.title; }); });

  var q = function (s) { return root.querySelector(s); };
  var view = 'home';
  var S = {};
  function st() { return (S[view] = S[view] || {}); }

  /* Completing every Academy lesson earns the Academy's own credibility
     signal — separate from paid membership ("Verified"), and shown wherever
     that badge already is. Completing everything IN ONE MODULE earns that
     module's own badge the same way, one level down — real progress for a
     creator who has done three of eight lessons, not silence until the
     whole thing is finished. Both are recomputed fresh off the lesson
     .done flags rather than toggled by hand, so neither can say "earned"
     about something not actually finished, and both sync to window.UKME —
     the record ukcreators.js reads — so a hotel sees the same badges. */
  function markLessonDone(id) {
    var L = D.academy.filter(function (x) { return x.id === id; })[0];
    var hadMod = L && D.academyModules().indexOf(L.mod) > -1;
    if (L) L.done = true;

    var mods = D.academyModules();
    D.me.academyModules = mods;
    if (window.UKME_SET) window.UKME_SET({ academyModules: mods.slice() });
    if (L && !hadMod && mods.indexOf(L.mod) > -1) {
      S.academy = S.academy || {};
      S.academy.justBadgedMod = L.mod;
    }

    if (D.academy.every(function (x) { return x.done; })) {
      var justCert = !D.me.academyCert;
      D.me.academyCert = true;
      if (window.UKME_SET) window.UKME_SET({ academyCert: true });
      if (justCert) { S.academy = S.academy || {}; S.academy.justCertified = true; }
    }
  }

  function svg(name, solid) {
    var set = solid ? (window.UKICONS_SOLID || {}) : (window.UKICONS || {});
    var glyph = set[name] || (window.UKICONS || {})[name] || '';
    return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' + glyph + '</svg>';
  }
  function icons(scope) {
    (scope || root).querySelectorAll('[data-icon]:not(.ukIco--on)').forEach(function (el) {
      el.innerHTML = svg(el.dataset.icon, el.dataset.solid != null);
      el.classList.add('ukIco', 'ukIco--on');
    });
  }

  /* ---------------- notifications ----------------
     The bell has been in this app's header all along with nothing behind it:
     UKNOTIFY was registered by the hotel app only, so a creator was never told
     when a hotel answered them. Same module, same panel markup, this side's
     sources. */
  var NOTIFY_ICONS = { move:'chat', invite:'idcard', content:'book', booking:'star', review:'star' };

  if (window.UKNOTIFY) {
    /* what the hotel did with an application you sent */
    window.UKNOTIFY.source(function () {
      var A = window.UKAPPLY;
      if (!A) return [];
      return A.mine().filter(function (ap) {
        return ap.state === 'approved' || ap.state === 'passed';
      }).map(function (ap) {
        var stay = D.stay(ap.stay);
        var who = stay ? stay.hotel : 'A hotel';
        return ap.state === 'approved'
          ? { id:'appok:' + ap.id, kind:'move', at: 6,
              t: who + ' said yes', s:'Your stay is confirmed \u2014 open it to sort the dates',
              go:'collabs', open: ap.id }
          : { id:'appno:' + ap.id, kind:'move', at: 3,
              t: who + ' passed this time', s:'Nothing is recorded against you. Send another.',
              go:'pitch' };
      });
    });

    /* a stay published by a hotel since you last looked */
    window.UKNOTIFY.source(function () {
      var R = window.UKSTAYS;
      if (!R) return [];
      return R.forCreator('c1').slice(0, 5).map(function (s) {
        return { id:'newstay:' + s.id, kind:'invite', at: 5,
          t: s.hotel + ' published a new stay',
          s: (s.nights ? s.nights + ' nights' : 'A stay') + ' in ' + String(s.city).split(',')[0],
          go:'stays' };
      });
    });

    /* your own collaborations, when the move is yours */
    window.UKNOTIFY.source(function () {
      return D.collabs.filter(function (c) {
        return D.STAGES[c.stage] && D.STAGES[c.stage].mine && !c.passed;
      }).map(function (c) {
        var stay = D.stay(c.stay);
        return { id:'cmove:' + c.id + ':' + c.stage, kind:'move', at: 4,
          t: (stay ? stay.hotel : 'A collaboration') + ' is waiting on you',
          s: D.STAGES[c.stage].sayMine || D.STAGES[c.stage].say || '',
          go:'collabs', open: c.id };
      });
    });
  }

  function paintNotify() {
    if (!window.UKNOTIFY) return;
    var list = window.UKNOTIFY.all();
    var n = list.filter(function (x) { return !x.seen; }).length;
    var dot = q('.ukTop_dot');
    if (dot) { dot.textContent = n > 99 ? '99+' : (n || ''); dot.hidden = !n; }

    var panel = q('#ukNotifyPanel');
    if (!panel || panel.hidden) return;
    panel.innerHTML =
      '<div class="ukNotify_head"><p class="ukNotify_h">Notifications</p>' +
        (n ? '<button class="ukGhost ukGhost--sm" type="button" data-notify-all>Mark all read</button>' : '') +
      '</div>' +
      (list.length
        ? '<ul class="ukNotify_list">' + list.slice(0, 20).map(function (x) {
            return '<li><button class="ukNotify_i' + (x.seen ? '' : ' is-new') + '" type="button" ' +
              'data-notify-go="' + escHtml(x.id) + '" data-go2="' + escHtml(x.go || '') + '" ' +
              'data-open="' + escHtml(x.open || '') + '">' +
              '<span class="ukNotify_ic"><span data-icon="' + (NOTIFY_ICONS[x.kind] || 'chat') + '"></span></span>' +
              '<span class="ukNotify_b"><span class="ukNotify_t">' + escHtml(x.t) + '</span>' +
              '<span class="ukNotify_s">' + escHtml(x.s || '') + '</span></span>' +
              (x.seen ? '' : '<span class="ukNotify_new" aria-label="Unread"></span>') +
            '</button></li>';
          }).join('') + '</ul>'
        : '<p class="ukNotify_none">Nothing needs you right now.</p>');
    icons(panel);
  }

  function closeNotify() {
    var panel = q('#ukNotifyPanel');
    if (!panel) return;
    panel.hidden = true;
    var b = q('[data-notify-toggle]');
    if (b) b.setAttribute('aria-expanded', 'false');
  }

  function paintNav() {
    paintNotify();
    var needs = D.collabs.filter(function (c) { return D.STAGES[c.stage].mine && c.stage < 5; }).length;
    /* Collapsed, the promo card is hidden and the primary action went with it —
       the one thing a creator comes here to do became unreachable from the rail.
       The same action survives the collapse as a single + button, same pattern
       as the hotel side's "Host a creator" card. */
    q('#ukSideCard').innerHTML =
      '<div class="ukSideCard"><h3 class="ukSideCard_t">Pitch Pilot</h3>' +
      '<p class="ukSideCard_p">We find the hotels, score them and write the pitch. You press send.</p>' +
      '<button class="ukSideCard_b" type="button" data-goto="pitch">Find your next stay</button></div>' +
      '<button class="ukRailAdd" type="button" data-goto="pitch" ' +
        'title="Find your next stay" aria-label="Find your next stay">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" ' +
          'stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>' +
      '</button>';
    q('#ukNav').innerHTML = NAV.map(function (g) {
      return '<div class="ukSide_group"><p class="ukSide_gLabel">' + g.group + '</p>' +
        g.items.map(function (it) {
          var active = it.id === view;
          var n = it.id === 'collabs' && needs ? '<span class="ukSide_count">' + needs + '</span>' : '';
          return '<button class="ukSide_link' + (active ? ' is-active' : '') + '" type="button" ' +
            'data-go="' + it.id + '"' + (active ? ' aria-current="page"' : '') + '>' +
            '<span class="ukIco ukIco--on">' + svg(it.icon, active) + '</span>' +
            '<span class="ukSide_lbl">' + it.title + '</span>' + n +
            (it.out ? '<span class="ukOut" aria-label="opens in a new tab">&#8599;</span>' : '') + '</button>';
        }).join('') + '</div>';
    }).join('');
    q('#ukTopDot').textContent = needs || '';
    q('#ukTopDot').hidden = !needs;
    /* Name and handle used to live twice — once down in the sidebar, once again
       up in the account menu. One copy now, in the account menu, full name and
       handle rather than a first name next to a membership word that was already
       shown elsewhere on the page. */
    q('#ukAcctName').textContent = D.me.n;
    q('#ukPlanChip').textContent = D.me.h;
  }

  function render() {
    var s = st();
    if (view === 'home')     return V.home(s);
    if (view === 'collabs')  return V.collabs(s);
    if (view === 'stays')    return V.stays(s);
    if (view === 'earn')     return V.earn(s);
    if (view === 'profile')  return V.profile(s);
    if (view === 'kit')      return V.kit(s);
    if (view === 'academy')  return V.academy(s);
    if (view === 'community')return V.community(s);
    if (view === 'member')   return V.member(s);
    if (view === 'account')  return V.account(s);
    if (view === 'editme')   return V.editme(s);
    if (view === 'hotel')    return V.hotel(s);
    if (view === 'discover') return V.discover(s);
    if (view === 'guide')    return V.guide(s);
    return V.empty('Nothing here', 'Pick something from the sidebar.');
  }

  /* ---------------- smart breadcrumb ----------------
     The same trail the hotel app carries, for the same reason: the topbar used to
     repeat the page's own headline word for word, so a creator read "Your collabs"
     twice and still had no idea how they got to a thread. One trail, held in the
     shell, so no view ships its own back button. */
  var trail = ['home'];
  var CRUMB_MAX = 2;
  var CRUMB_SEP = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9.5 5.5 6 6.5-6 6.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function pushTrail(id) {
    var at = trail.indexOf(id);
    if (at > -1) { trail.length = at + 1; return; }
    trail.push(id);
    while (trail.length > CRUMB_MAX) trail.shift();
  }

  /* whatever is open inside the current view becomes the last crumb */
  function leafCrumb() {
    var s = S[view] || {};
    if (view === 'collabs' && s.thread) {
      var c = D.collabs.filter(function (x) { return x.id === s.thread; })[0];
      var stay = c && D.stay(c.stay);
      return stay ? stay.hotel : null;
    }
    if (view === 'discover' && s.stay) {
      var st2 = D.stay ? D.stay(s.stay) : null;
      return st2 ? st2.t : null;
    }
    if (view === 'stays' && s.open) {
      var st3 = D.stay ? D.stay(s.open) : null;
      return st3 ? st3.hotel : null;
    }
    if (view === 'academy' && s.lesson) {
      var l2 = (D.academy || []).filter(function (x) { return x.id === s.lesson; })[0];
      return l2 ? l2.t : null;
    }
    if (view === 'discover' && s.discItem) {
      var di = D.discoverBy ? D.discoverBy(s.discItem) : null;
      return di ? di.t : null;
    }
    return null;
  }

  function escHtml(s2) {
    return String(s2).replace(/[&<>"]/g, function (c) {
      return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; });
  }

  function paintCrumb() {
    var el = q('#ukCrumb');
    if (!el) return null;
    /* NOTHING on a top-level page. Not a trail, not even the page's own name:
       the page already carries its headline, and repeating it in the bar above is
       a crumb that leads nowhere from a place you can see you are in. The bar
       appears only when something is open INSIDE a page — "Creators > Amara
       Mensah" — because that is the only case where it tells you something and
       gives you somewhere to go back to. */
    var leaf = leafCrumb();
    if (!leaf) { el.innerHTML = ''; return TITLES[view] || 'Ukreate'; }
    var parts = [{ id:view, label:TITLES[view] || 'Ukreate' },
                 { id:null, label:leaf }];
    el.innerHTML = '<ol class="ukCrumb_l">' + parts.map(function (p, i) {
      var last = i === parts.length - 1;
      return (i ? '<li class="ukCrumb_s" aria-hidden="true">' + CRUMB_SEP + '</li>' : '') +
        '<li class="ukCrumb_i">' + (last
          ? '<h1 class="ukCrumb_now" aria-current="page">' + escHtml(p.label) + '</h1>'
          : '<button class="ukCrumb_b" type="button" data-crumb="' + p.id + '">' + escHtml(p.label) + '</button>') +
        '</li>';
    }).join('') + '</ol>';
    return parts[parts.length - 1].label;
  }

  /* The stays globe: mounted once and moved between paints, so its texture and
     animation survive a filter change. Held at the zoom that keeps the whole
     sphere inside its box — past that the limb leaves the frame and what is left
     reads as a patch of dots in a corner. */
  var FIT = 1;
  var sMap = null, sMapHost = null, sMapKey = null;
  function mountStayMap() {
    var slot = q('[data-cstaymap]');
    if (!slot || !window.UKWORLDMAP) return;
    if (!sMapHost) {
      sMapHost = document.createElement('div');
      sMapHost.className = 'ukMap';
      sMapHost.setAttribute('aria-hidden', 'true');
    }
    if (sMapHost.parentNode !== slot) slot.appendChild(sMapHost);

    var pts = [];
    try { pts = JSON.parse(slot.getAttribute('data-cstaymap') || '[]'); } catch (er) { pts = []; }

    if (!sMap) sMap = window.UKWORLDMAP.mount(sMapHost, { lat: 0, lng: 0, zoom: FIT });
    else if (sMap.resume) sMap.resume();
    if (!sMap) return;

    var key = pts.map(function (p) { return p.id; }).join(',');
    if (key !== sMapKey) { if (sMap.pins) sMap.pins(pts); sMapKey = key; }

    /* a single selected stay (or the single-pin Location card) gets a close,
       comfortable zoom; with nothing picked the frame fits every stay on
       screen as tight as it can without pushing any of them out of it */
    var sel = pts.filter(function (p) { return p.on; })[0];
    if (sMap.fit) sMap.fit(sel ? [sel] : pts);
  }

  /* The ask bar is one mounted instance, not two — the hotel side's own
     mechanism (ukapp.js), ported so a page here can offer the same search
     slot instead of duplicating a plain text filter beside it. Moving the
     node keeps its state and listeners rather than tearing it down. */
  function rescueAsk() {
    var shell = root.querySelector('[data-ask-shell]');
    var home = q('[data-ask]');
    if (shell && home && shell.parentNode !== home) home.appendChild(shell);
  }
  function placeAsk() {
    var shell = root.querySelector('[data-ask-shell]');
    if (!shell) return;
    var slot = q('[data-ask-slot]');
    var home = q('[data-ask]');
    var target = slot || home;
    if (target && shell.parentNode !== target) target.appendChild(shell);
    if (home) home.classList.toggle('is-away', !!slot);
  }

  function paintView(keep) {
    var now = paintCrumb() || TITLES[view] || 'Ukreate';
    document.title = now + ' · Ukreate for creators';
    var dyn = q('.ukView');
    rescueAsk();
    dyn.innerHTML = render();
    icons(dyn);
    placeAsk();
    mountStayMap();
    /* the stay card measures itself once it is on the page — this is what puts
       the "+N" on a list that does not fit, and it never ran on this side */
    if (window.UKSTAY) { window.UKSTAY.clamp(dyn); placeStayPop(); }
    /* the letter sizes itself to what is in it, which only the browser knows */
    if (window.UKCGROW) window.UKCGROW(dyn);
    if (!keep) window.scrollTo(0, 0);   // instant: a smooth reset moves hit targets mid-click
    paintOnboard();
  }

  function placeStayPop() {
    var s2 = st();
    if (!s2.stayPop) return;
    if (!window.UKSTAY.place(s2.stayPop, document)) s2.stayPop = null;
  }

  /* ---------------- onboarding ----------------
     The gate is a modal over the live app rather than a page of its own, so the
     product is visible behind the questions instead of being withheld until
     after them. It only asks for what the app needs in order to tell the truth
     — see ukonboard.js — and everything else is a checklist on the dashboard. */
  var obAt = 0;
  /* Open is its own state, not "are the answers complete". Deriving it from
     completeness meant the modal tore itself down the moment the last question
     was answered — the Finish button vanished from under the cursor, and the
     answers were never applied. It opens when the gate is unmet and closes when
     the person says it is done. */
  var obOpen = !!window.UKONBOARD && !window.UKONBOARD.complete('creator');
  function obNeeded() { return obOpen; }
  /* What sits behind the gate matters. A brand-new account's own dashboard is
     empty — no stays, no collaborations, nothing to look at — so blurring that
     behind the questions teases an empty room. The marketplace is not theirs and
     is already full: the stays on offer — the reason a creator signed up, and they already exist. */
  function obBackdrop() {
    if (!obNeeded()) return;
    if (view === 'home' || view === 'dash') view = 'stays';
  }

  /* The picker's dropdown is position:absolute inside .ukStart_ask, and that
     panel is the one part of the gate that scrolls (.ukOb_modal itself also
     clips at its own edge) — so a dropdown open near the bottom of a long
     question got cut off by the panel's own scroll boundary instead of
     floating above it. position:fixed alone is not enough to fix that: the
     dropdown is still a DOM descendant of .ukModalWrap, which establishes
     its own stacking context (position:fixed + z-index), so no z-index on
     the dropdown can out-rank content painted inside that context — it was
     escaping the clip but still losing to the modal's own Continue button.
     Re-parenting it to the end of <body>, past .ukModalWrap entirely, is
     what actually gets it into the root stacking context above the modal.
     Measured and placed the same way ukstaycard.js's clamp() does its own
     post-layout work. */
  function positionPickrDrops(host) {
    var dropHost = q('#ukDropHost') || (function () {
      var d = document.createElement('div');
      d.id = 'ukDropHost';
      document.body.appendChild(d);
      return d;
    })();
    dropHost.innerHTML = '';
    host.querySelectorAll('.ukPickr.is-open').forEach(function (p) {
      var input = p.querySelector('.ukPickr_q'), drop = p.querySelector('.ukPickr_drop');
      if (!input || !drop) return;
      var r = input.getBoundingClientRect();
      drop.style.position = 'fixed';
      drop.style.left = r.left + 'px';
      drop.style.right = 'auto';
      drop.style.top = (r.bottom + 6) + 'px';
      drop.style.width = r.width + 'px';
      drop.style.zIndex = '150';
      dropHost.appendChild(drop);
    });
  }

  function paintOnboard() {
    var host = q('#ukObHost') || (function () {
      var d = document.createElement('div');
      d.id = 'ukObHost';
      document.body.appendChild(d);
      return d;
    })();
    if (!obNeeded()) { host.innerHTML = ''; document.body.classList.remove('is-onboarding'); return; }
    document.body.classList.add('is-onboarding');
    host.innerHTML = window.UKONBOARD.modalHtml('creator', obAt);
    if (window.UKSTAY && window.UKSTAY.clamp) window.UKSTAY.clamp(host);
    positionPickrDrops(host);
    /* Focus back into the field, caret at the end. Every keystroke in the market
       search repaints, because the ranked list under it IS the response to the
       keystroke, and without this the input is replaced mid-word: the first
       letter registers and the rest go nowhere. Same reason the hotel gate does
       it for the city field. Hidden inputs are skipped, or the file picker on a
       photographs step would steal it. */
    var first = host.querySelector('input:not([type=file]):not([hidden])');
    if (first) {
      first.focus();
      try { first.setSelectionRange(first.value.length, first.value.length); } catch (err) {}
    }
  }

  document.addEventListener('click', function (e) {
    if (!window.UKONBOARD) return;
    var el;
    if ((el = e.target.closest('[data-ob-set]'))) {
      window.UKONBOARD.set('creator', (function (o) { o[el.dataset.obSet] = el.dataset.obVal; return o; })({}));
      window.UKONBOARD.apply("creator");
      return paintOnboard();
    }
    if ((el = e.target.closest('[data-ob-pick]'))) {
      var k = el.dataset.obPick, v = el.dataset.obVal, cap = Number(el.dataset.obCap) || 1;
      var cur = window.UKONBOARD.get('creator')[k];
      var next;
      if (cap === 1) { next = cur === v ? '' : v; }
      else {
        next = Array.isArray(cur) ? cur.slice() : [];
        var at = next.indexOf(v);
        if (at > -1) next.splice(at, 1); else if (next.length < cap) next.push(v);
      }
      var patch = {}; patch[k] = next;
      window.UKONBOARD.set('creator', patch);
      window.UKONBOARD.apply("creator");
      return paintOnboard();
    }
    /* the platform connector's own controls, run by the shared module */
    if ((el = e.target.closest('[data-doconnect]'))) {
      window.UKPLATCONNECT.start(window.UKONBOARD.live(), el.dataset.doconnect, paintOnboard);
      return;
    }
    if (e.target.closest('[data-oauth-allow]') || e.target.closest('[data-oauth-retry]')) {
      var st0 = window.UKONBOARD.live();
      if (e.target.closest('[data-oauth-retry]')) st0.oauth.stage = 'consent';
      window.UKPLATCONNECT.allow(st0, D.me.n, function () {
        /* saved BEFORE the repaint: the Finish button asks storage whether the
           step is answered, so painting first left it disabled with a platform
           visibly connected above it */
        window.UKONBOARD.flush('creator');
        paintOnboard();
      });
      return;
    }
    if (e.target.closest('[data-oauth-cancel]') || e.target.closest('[data-oauth-scrim]')) {
      if (e.target.closest('[data-oauth-card]')) return;
      window.UKPLATCONNECT.cancel(window.UKONBOARD.live(), paintOnboard);
      return;
    }
    if ((el = e.target.closest('[data-unplat]'))) {
      window.UKPLATCONNECT.drop(window.UKONBOARD.live(), Number(el.dataset.unplat));
      window.UKONBOARD.flush('creator');
      return paintOnboard();
    }
    /* the chip picker from /creator/start/: pick, remove, and close on an
       outside click, the same three behaviours it has always had. Home base
       and destinations are two instances of the same picker, so this stays
       one generic handler keyed on data-chip rather than one per field. */
    var CHIP_CAP = { home:1, dests:4 };
    var CHIP_QKEY = { home:'homeQ', dests:'destQ' };
    if ((el = e.target.closest('[data-chip]'))) {
      var field = el.dataset.chip;
      var dq = window.UKONBOARD.chipq(CHIP_QKEY[field] || 'destQ');
      var f0 = window.UKONBOARD.get('creator');
      var cur = (f0[field] || []).slice();
      var v = el.dataset.val;
      var cap = CHIP_CAP[field] || ((window.UKCHIPS && window.UKCHIPS.CAP) || 5);
      if (cur.indexOf(v) < 0 && cur.length < cap) cur.push(v);
      var patch = {}; patch[field] = cur;
      /* the same market cannot sit in both buckets at once */
      var other = field === 'home' ? 'dests' : 'home';
      if ((f0[other] || []).indexOf(v) > -1) patch[other] = f0[other].filter(function (k) { return k !== v; });
      window.UKONBOARD.set('creator', patch);
      dq.q = ''; dq.open = false;
      window.UKONBOARD.apply('creator');
      return paintOnboard();
    }
    if ((el = e.target.closest('[data-unchip]'))) {
      var ufield = el.dataset.unchip;
      var cur2 = ((window.UKONBOARD.get('creator')[ufield] || [])).filter(function (k) {
        return k !== el.dataset.val;
      });
      var upatch = {}; upatch[ufield] = cur2;
      window.UKONBOARD.set('creator', upatch);
      window.UKONBOARD.apply('creator');
      return paintOnboard();
    }
    /* #ukDropHost: the open dropdown itself, once positionPickrDrops() has
       moved it out from under .ukPickr to escape the modal's stacking
       context — a click landing on it (its own padding, not an option) is
       still a click inside the picker, not an outside click that should
       close it. */
    if (!e.target.closest('.ukPickr') && !e.target.closest('#ukDropHost')) {
      var dq2 = window.UKONBOARD.destq(), hq2 = window.UKONBOARD.chipq('homeQ');
      var wasOpen = dq2.open || hq2.open;
      dq2.open = false; dq2.q = ''; hq2.open = false; hq2.q = '';
      if (wasOpen) paintOnboard();
    }
    if (e.target.closest('[data-ob-back]')) { obAt = Math.max(0, obAt - 1); return paintOnboard(); }
    if (e.target.closest('[data-ob-next]')) {
      var list = window.UKONBOARD.steps('creator');
      if (obAt < list.length - 1) { obAt += 1; return paintOnboard(); }
      window.UKONBOARD.apply('creator');
      /* onboarded: the gate does not open again on the next visit */
      window.UKONBOARD.clearFresh();
      obOpen = false;
      obAt = 0;
      paintOnboard();
      paintNav();
      return paintView();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    if (!e.target.closest || !e.target.closest('[data-ob-field]')) return;
    var go = document.querySelector('[data-ob-next]');
    if (go && !go.disabled) { e.preventDefault(); go.click(); }
  });

  /* Scrolling .ukStart_ask while a dropdown is open moves the field it is
     anchored to; fixed positioning does not follow that on its own, since it
     is no longer part of the scrolling box's normal layout. */
  document.addEventListener('scroll', function (e) {
    var ask = e.target.closest && e.target.closest('.ukStart_ask');
    var host = q('#ukObHost');
    if (ask && host) positionPickrDrops(host);
  }, true);

  document.addEventListener('input', function (e) {
    /* typing in the market search repaints, because the ranked list under it IS
       the response to the keystroke */
    var mq = e.target.closest && e.target.closest('.ukPickr_q');
    if (mq && window.UKONBOARD) {
      var dq = window.UKONBOARD.chipq(mq.dataset.k);
      dq.q = mq.value; dq.open = true;
      return paintOnboard();
    }
    var el = e.target.closest && e.target.closest('[data-ob-field]');
    if (!el || !window.UKONBOARD) return;
    var patch = {}; patch[el.dataset.obField] = el.value;
    window.UKONBOARD.set('creator', patch);
    /* the Continue button enables on the first keystroke, so it is never a dead
       control sitting there as an instruction you cannot follow */
    var ready = window.UKONBOARD.steps('creator')[obAt].done(window.UKONBOARD.get('creator'));
    var go = document.querySelector('[data-ob-next]');
    if (go) go.disabled = !ready;
  });

  /* 'pitch' and 'apply' were pages of their own and are now lanes and a composer
     inside 'stays'. Aliased rather than hunted down: eight buttons across the
     dashboard and the hotel page said data-goto="pitch", and every one of them
     still means "take me to my pipeline". */
  var ALIAS = { pitch:'stays', apply:'stays' };
  function go(next) {
    next = ALIAS[next] || next;
    pushTrail(next); view = next; paintNav(); paintView(); closeSide(); closeMenu();
  }
  /* the gate rides on every paint, so it survives navigation */
  
  function repaint() { paintView(true); }
  window.UKCGO = go;

  /* Same door as the hotel side's UKPREFILL: hands a view a starting state before
     navigating to it. S is private to this closure, so this is the one way in —
     the global header search uses it to open a pitch draft or an application
     thread with what it already understood, instead of asking the creator to
     retype it. */
  /* A view's own state, for tools that render into a view but live in their own
     file. S is private to this closure, so this is the one way in. */
  window.UKCSTATE = function (viewId) { return (S[viewId] = S[viewId] || {}); };

  window.UKCPREFILL = function (viewId, patch) {
    S[viewId] = Object.assign({}, S[viewId] || {}, patch);
    go(viewId);
  };

  var menu = q('#ukMenu');
  function closeMenu() {
    menu.hidden = true;
    q('[data-menu-toggle]').setAttribute('aria-expanded', 'false');
  }
  var side = document.getElementById('ukSide');
  function closeSide() { side.classList.remove('is-open'); }

  /* Collapsed state is a preference, so it is remembered. The width lives on the
     shell as well as the panel, because the topbar and the main column are offset by
     it and cannot read a class on a sibling. */
  function setRail(on) {
    side.classList.toggle('is-rail', on);
    document.documentElement.classList.toggle('ukSideOn--rail', on);
    var b = side.querySelector('[data-siderail]');
    if (b) {
      b.setAttribute('aria-expanded', on ? 'false' : 'true');
      b.setAttribute('aria-label', on ? 'Expand the menu' : 'Collapse the menu');
      b.title = on ? 'Expand the menu' : 'Collapse the menu';
    }
    try { localStorage.setItem('uk_side_rail', on ? '1' : '0'); } catch (e) {}
  }
  (function () {
    var saved; try { saved = localStorage.getItem('uk_side_rail'); } catch (e) {}
    if (saved === '1') setRail(true);
  })();

  root.addEventListener('input', function (e) {
    var mkEl = e.target.closest('[data-mk]');
    if (mkEl) { var s2 = st(); (s2.mk = s2.mk || {})[mkEl.dataset.mk] = mkEl.value; return; }
    var f = e.target.closest('[data-q]');
    if (f) {
      st().q = f.value;
      var pos = f.selectionStart;
      repaint();
      var again = root.querySelector('[data-q]');
      if (again) { again.focus(); again.setSelectionRange(pos, pos); }
      return;
    }
    var k = e.target.closest('[data-k]');
    if (k) { st()[k.dataset.k] = k.value; }
  });



  /* Every dropdown in the product is a [data-drop-toggle] button plus the
     .ukDropMenu after it. Handled first, and without a repaint: a repaint rebuilds
     .ukView, so opening a menu by re-rendering would destroy it in the same tick. */
  function closeDrops(except) {
    root.querySelectorAll('.ukDropMenu').forEach(function (m) {
      if (m === except) return;
      m.hidden = true;
      var b = m.parentNode && m.parentNode.querySelector('[data-drop-toggle]');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }
  root.addEventListener('click', function (e) {
    var dt = e.target.closest('[data-drop-toggle]');
    if (dt) {
      var dm = dt.parentNode.querySelector('.ukDropMenu');
      if (dm) {
        var opening = dm.hidden;
        closeDrops(dm);
        dm.hidden = !opening;
        dt.setAttribute('aria-expanded', String(opening));
        if (opening) {
          var sel = dm.querySelector('.ukDropMenu_i.is-sel') || dm.querySelector('.ukDropMenu_i');
          if (sel) sel.focus();
        }
      }
      e.stopPropagation();
      return;
    }
    if (!e.target.closest('.ukDropMenu')) closeDrops();
  }, true);

  root.addEventListener('click', function (e) {
    var el, s = st();

    var sfToggle = e.target.closest('[data-stayf-toggle]');
    if (sfToggle) {
      var menuEl = sfToggle.nextElementSibling;
      menuEl.hidden = !menuEl.hidden;
      sfToggle.setAttribute('aria-expanded', menuEl.hidden ? 'false' : 'true');
      return;
    }
    var sfItem = e.target.closest('[data-stayf]');
    if (sfItem && sfItem.getAttribute('data-stayf') != null) {
      s.stayF = sfItem.dataset.stayf;
      s.thread = null;
      if (sfItem.dataset.stayf === 'all' && s.stageF == null) s.stageF = '1';
      else if (sfItem.dataset.stayf !== 'all') s.stageF = null;
      sfItem.closest('[role="menu"]').hidden = true;
      var sfBtn = sfItem.closest('.ukStayFilter').querySelector('[data-stayf-toggle]');
      if (sfBtn) sfBtn.setAttribute('aria-expanded', 'false');
      return repaint();
    }
    if (!e.target.closest('.ukStayFilter')) {
      root.querySelectorAll('.ukStayMenu:not([hidden])').forEach(function (m) { m.hidden = true; });
      root.querySelectorAll('[data-stayf-toggle]').forEach(function (t) { t.setAttribute('aria-expanded', 'false'); });
    }

    if ((el = e.target.closest('[data-crumb]'))) {
      var cid = el.dataset.crumb, cs = S[cid];
      if (cs) { cs.thread = null; cs.stay = null; cs.composerMode = null; cs.modalOpen = null; cs.open = null; cs.lesson = null; cs.delivering = null; cs.picked = null; cs.discItem = null; }
      return go(cid);
    }
    if ((el = e.target.closest('[data-review-save]'))) {
      var R = window.UKREVIEWS;
      var picked = root.querySelector('[data-starpick]:checked');
      var txt = root.querySelector('#ukReviewText');
      if (!picked) {
        el.textContent = 'Pick a rating first';
        setTimeout(function () { el.textContent = 'Leave review'; }, 1600);
        return;
      }
      if (R) R.leave(el.dataset.reviewSave, el.dataset.side, picked.value, txt ? txt.value : '');
      s.reviewEdit = false;
      return repaint();
    }
    if (e.target.closest('[data-reviewedit]')) { s.reviewEdit = true; return repaint(); }
    if ((el = e.target.closest('[data-go]'))) {
      if (el.dataset.go === 'community') return openCommunity();
      /* Clicking a section while already sitting inside one of its own leaves
         (a stay, a lesson, a collab thread) should land on that section's
         list, not silently reopen whatever was last open there. */
      var gs = S[el.dataset.go];
      if (gs) { gs.open = null; gs.lesson = null; gs.thread = null; gs.delivering = null; gs.picked = null; gs.discItem = null; }
      go(el.dataset.go); return;
    }
    if ((el = e.target.closest('[data-goto]'))) {
      e.preventDefault();
      if (el.dataset.goto === 'community') return openCommunity();
      go(el.dataset.goto);
      if (el.dataset.preset != null) { st().stageF = el.dataset.preset; repaint(); }
      return;
    }
    if (e.target.closest('[data-menu-toggle]')) {
      var open = menu.hidden;
      menu.hidden = !open;
      q('[data-menu-toggle]').setAttribute('aria-expanded', open ? 'true' : 'false');
      return;
    }
    if (e.target.closest('[data-signout]')) { window.location.href = '/signin/?out=1'; return; }
    if (e.target.closest('[data-burger]')) { side.classList.toggle('is-open'); return; }
    if (e.target.closest('[data-siderail]')) { setRail(!side.classList.contains('is-rail')); return; }

    if ((el = e.target.closest('[data-page]'))) {
      var bits = el.dataset.page.split(':');
      s[bits[0]] = Number(bits[1]);
      return repaint();
    }
    if ((el = e.target.closest('[data-ppf]'))) {
      s[el.dataset.ppf] = el.dataset.ppv; s.pgPitch = 1; return repaint();
    }
    if ((el = e.target.closest('[data-view]')))  { s.view = el.dataset.view;   return repaint(); }
    if ((el = e.target.closest('[data-tab]')))   { s.tab = el.dataset.tab;     return repaint(); }
    if ((el = e.target.closest('[data-pay]')))   { s.pay = el.dataset.pay;     return repaint(); }
    if ((el = e.target.closest('[data-stage]'))) { s.stageF = el.dataset.stage;return repaint(); }
    if ((el = e.target.closest('[data-cview]'))) { s.cview = el.dataset.cview; return repaint(); }
    if ((el = e.target.closest('[data-inqsub]'))) { s.inqSub = el.dataset.inqsub; return repaint(); }
    if ((el = e.target.closest('[data-style]'))) { s.style = el.dataset.style; s.pgStays = 1; return repaint(); }
    if ((el = e.target.closest('[data-pin]')))   { s.pin = el.dataset.pin;     return repaint(); }
    if (e.target.closest('[data-clearf]'))       { s.q=''; s.style='all'; s.saved=false; return repaint(); }
    if (e.target.closest('[data-savedonly]'))    { s.saved = !s.saved; s.pgStays = 1; return repaint(); }

    if (e.target.closest('[data-notify-toggle]')) {
      var np = q('#ukNotifyPanel');
      var opening = np.hidden;
      np.hidden = !opening;
      e.target.closest('[data-notify-toggle]').setAttribute('aria-expanded', String(opening));
      paintNotify();
      return;
    }
    if (e.target.closest('[data-notify-all]')) {
      window.UKNOTIFY.markAllSeen(window.UKNOTIFY.all());
      paintNotify();
      return;
    }
    if ((el = e.target.closest('[data-notify-go]'))) {
      window.UKNOTIFY.markSeen([el.dataset.notifyGo]);
      var dest = el.dataset.go2, opening2 = el.dataset.open;
      closeNotify();
      if (dest) {
        if (opening2) S[dest] = Object.assign({}, S[dest] || {}, { thread: opening2 });
        return go(dest);
      }
      paintNotify();
      return;
    }
    if ((el = e.target.closest('[data-save]'))) {
      /* Backed by the shared favourites store, so a saved property survives a
         reload and sits in the same record as the hotel's own shortlist of
         creators — one feature, two directions, not two implementations. */
      var stay = D.stay(el.dataset.save);
      if (window.UKFAVS) stay.saved = window.UKFAVS.toggle('stays', stay.id);
      else stay.saved = !stay.saved;
      return repaint();
    }
    /* ---- the shared stay card's own controls ----
       These sit INSIDE a card that is itself clickable, so they are answered
       before it: pressing a gallery arrow or a "+N" must not also open the stay.
       The behaviour comes from ukstaycard.js, the same code the hotel runs. */
    if ((el = e.target.closest('[data-stayshotstep]'))) {
      var cell = el.closest('[data-open]');
      var sid = cell && cell.dataset.open;
      var stay = sid && D.stay(sid);
      if (stay) {
        var n = window.UKSTAY.shots(stay) || 1;
        s.shots = s.shots || {};
        s.shots[sid] = ((s.shots[sid] || 0) + Number(el.dataset.stayshotstep) + n) % n;
      }
      return paintView(true);
    }
    /* The stay detail page's own thumbnail rail — jump straight to a frame
       rather than stepping to it one arrow-press at a time. Same s.shots state
       the step handler above uses, so the two never fall out of sync. */
    if ((el = e.target.closest('[data-stayshot]'))) {
      var thumbCell = el.closest('[data-open]');
      var thumbSid = thumbCell && thumbCell.dataset.open;
      if (thumbSid) {
        s.shots = s.shots || {};
        s.shots[thumbSid] = Number(el.dataset.stayshot) || 0;
      }
      return paintView(true);
    }
    if ((el = e.target.closest('[data-staypop]'))) {
      s.stayPop = s.stayPop === el.dataset.staypop ? null : el.dataset.staypop;
      paintView(true);
      return placeStayPop();
    }
    if (e.target.closest('[data-staypop-close]')) { s.stayPop = null; return paintView(true); }

    /* A stay card is clickable, and it has buttons inside it. Those buttons are
       answered FIRST: closest('[data-open]') from a button inside the card finds
       the card, so "Pitch this stay" was opening the stay detail rather than
       starting an application. */
    /* "Pitch this stay", from wherever it is pressed, opens THE composer. It used
       to open a second one that wrote to a different record than the lanes read,
       which is how a stay ended up in To pitch and Waiting at the same time. */
    if ((el = e.target.closest('[data-apply]'))) {
      var applyId = el.dataset.apply;
      window.UKCP.write(applyId);
      var isLeadTarget = D.lead && !!D.lead(applyId);
      if (isLeadTarget) window.UKCSTATE('stays').tab = 'outreach';
      return go('stays');
    }
    if ((el = e.target.closest('[data-hotel]'))) { view = 'hotel'; st().stay = el.dataset.hotel; paintNav(); return paintView(); }
    if ((el = e.target.closest('[data-open]'))) { s.open = el.dataset.open; return paintView(); }
    if (e.target.closest('[data-back]')) {
      if (s.delivering) { s.delivering = null; s.picked = null; return paintView(); }
      if (s.lesson) { s.lesson = null; return paintView(); }
      s.open = null; s.thread = null; return paintView();
    }
    if (e.target.closest('[data-editme]')) { go('editme'); return; }
    /* ---------------- Discover ---------------- */
    /* the save toggle sits inside the card's own [data-discitem] hit area, so
       it has to be checked (and stopped) before the card's own open-it click */
    if ((el = e.target.closest('[data-dsave]'))) { D.dsToggle(el.dataset.dsave); return repaint(); }
    if ((el = e.target.closest('[data-discitem]'))) {
      view = 'discover'; st().discItem = el.dataset.discitem; paintNav(); return paintView();
    }
    if ((el = e.target.closest('[data-dsub]'))) { s.dsub = el.dataset.dsub; return repaint(); }
    if (e.target.closest('[data-newcoll-go]')) {
      var nameEl = root.querySelector('#ukNewCollName');
      var name = ((nameEl && nameEl.value) || '').trim();
      if (name) D.dsNewCollection(name);
      return repaint();
    }
    if ((el = e.target.closest('[data-mset]'))) {
      var mKey = el.dataset.mset, mVal = el.dataset.mval;
      var set = Array.isArray(s[mKey]) ? s[mKey].slice() : [];
      if (mVal === 'all') set = [];
      else { var mAt = set.indexOf(mVal); if (mAt > -1) set.splice(mAt, 1); else set.push(mVal); }
      s[mKey] = set; s.pgDisc = 1;
      return repaint();
    }
    if ((el = e.target.closest('[data-guide]'))) { view = 'guide'; st().guide = el.dataset.guide; paintNav(); return paintView(); }
    /* [data-sendapply] is gone. It was the second send: it wrote UKAPPLY and then
       ALSO pushed a stage-0 row into D.collabs and navigated there, which
       contradicts the pipeline this app already settled on. Your collabs begins
       at Onboarding, the moment a hotel says yes; before that there is no
       collaboration, only a hope. reconcilePipeline() in ukcdata.js was quietly
       undoing this on the next load. Sending now writes the application and the
       stay moves to Waiting, which is where a sent pitch actually is. */
    if ((el = e.target.closest('[data-thread]')) && !e.target.closest('[data-cardact]')) { s.thread = el.dataset.thread; s.delivering = null; s.picked = null; return paintView(); }
    if ((el = e.target.closest('[data-cardact] [data-thread]'))) { s.thread = el.dataset.thread; s.delivering = null; s.picked = null; return paintView(); }

    /* opens a collab's thread from OUTSIDE the collabs view (the dashboard's
       project list) — data-thread alone writes into the current view's own
       state, which does nothing when that view isn't 'collabs' */
    if ((el = e.target.closest('[data-open-collab]'))) { window.UKCPREFILL('collabs', { thread: el.dataset.openCollab }); return; }

    if (e.target.closest('[data-focus-toggle]')) { s.focus = !s.focus; return paintView(true); }

    if ((el = e.target.closest('[data-send]'))) {
      var box = root.querySelector('#ukReply'), txt = ((box && box.value) || '').trim();
      var hint = root.querySelector('#ukSendHint');
      if (!txt) { if (hint) hint.textContent = 'Write something first.'; if (box) box.focus(); return; }
      D.sendMessage(el.dataset.send, txt);
      paintView(true);
      var l = root.querySelector('#ukMsgs'); if (l) l.scrollTop = l.scrollHeight;
      var h2 = root.querySelector('#ukSendHint'); if (h2) h2.textContent = 'Sent.';
      return;
    }
    /* ---- responding to an invitation ----
       Accepting skips Inquiry entirely and lands in onboarding: the hotel already
       chose this creator, so there is no evaluation left to perform. */
    if ((el = e.target.closest('[data-inv-accept]'))) {
      var sid = el.dataset.invAccept;
      var inv = window.UKINVITE.respond(sid, window.UKINVITE.ME, 'accept');
      var meRow = (inv.invitees || []).filter(function (i) { return i.creator === window.UKINVITE.ME; })[0];
      if (meRow && meRow.state === 'accepted') D.acceptInvite(sid);
      return paintView(true);
    }
    if ((el = e.target.closest('[data-inv-decline]'))) {
      window.UKINVITE.respond(el.dataset.invDecline, window.UKINVITE.ME, 'decline');
      return paintView(true);
    }

    if ((el = e.target.closest('[data-startdeliver]'))) { s.delivering = el.dataset.startdeliver; s.picked = {}; return paintView(); }
    /* the creator's own move once approved: post it, then say so. This is what
       actually finishes the collaboration — see markPublished in ukcdata.js */
    if ((el = e.target.closest('[data-publish]'))) {
      D.markPublished(el.dataset.publish);
      paintNav(); return paintView(true);
    }
    /* proof of posting: the public link that ties a tracked link to a real placement */
    if ((el = e.target.closest('[data-proof-send]'))) {
      var uEl = root.querySelector('[data-proof-url]');
      var pEl = root.querySelector('[data-proof-place]');
      var hint = root.querySelector('#ukProofHint');
      var url = (uEl && uEl.value || '').trim();
      if (!/^https?:\/\/.+\..+/.test(url)) {
        if (hint) hint.textContent = 'That does not look like a link yet. Paste the full address of the post.';
        if (uEl) uEl.focus();
        return;
      }
      var pick = (pEl && pEl.value || '|').split('|');
      D.addProof(el.dataset.proofSend, { url:url, channel:pick[0], placement:pick[1] });
      return paintView(true);
    }
    if ((el = e.target.closest('[data-pickwork]'))) {
      s.picked = s.picked || {};
      var wid = el.dataset.pickwork;
      if (s.picked[wid]) delete s.picked[wid]; else s.picked[wid] = true;
      return repaint();
    }
    if ((el = e.target.closest('[data-senddeliver]'))) {
      var ids = Object.keys(s.picked || {});
      D.deliverWork(el.dataset.senddeliver, ids);
      s.delivering = null; s.picked = null;
      paintNav(); return paintView();
    }
    if ((el = e.target.closest('[data-startshoot]'))) {
      D.markShooting(el.dataset.startshoot);
      paintNav(); return paintView();
    }
    if ((el = e.target.closest('[data-lesson]'))) {
      s.lesson = el.dataset.lesson;
      var lsn = D.academy.filter(function (x) { return x.id === s.lesson; })[0];
      if (lsn) { s.curricOpen = s.curricOpen || {}; s.curricOpen[lsn.mod] = true; }
      return paintView();
    }
    if ((el = e.target.closest('[data-curric-toggle]'))) {
      s.curricOpen = s.curricOpen || {};
      var modKey = el.dataset.curricToggle;
      s.curricOpen[modKey] = !s.curricOpen[modKey];
      return repaint();
    }
    if ((el = e.target.closest('[data-acadmod]'))) { s.acadMod = el.dataset.acadmod; return repaint(); }
    if ((el = e.target.closest('[data-watched]'))) {
      markLessonDone(el.dataset.watched);
      return repaint();
    }
    /* Pressing play is what "taking" a lesson actually is here — there is no
       separate "mark as watched" control on the page any more, so this is
       the one real signal a lesson happened. */
    if ((el = e.target.closest('[data-lessonplay]'))) {
      markLessonDone(el.dataset.lessonplay);
      var wasP = el.getAttribute('aria-label');
      el.setAttribute('aria-label', 'Playing');
      setTimeout(function () { el.setAttribute('aria-label', wasP); }, 1800);
      return repaint();
    }
    if (e.target.closest('[data-clearpp]')) {
      s.q = ''; s.fstyle = null; s.fvibe = null; s.fbudget = null; s.pgPitch = 1; return repaint();
    }
    if (e.target.closest('[data-join]')) {
      D.me.member = true; D.me.verified = true;
      /* the referral half of joining: if this account arrived via someone's
         link (captured before the account existed — see ukjoin.js), that is
         recorded now, the one moment membership actually starts. */
      if (window.UKREFER) window.UKREFER.clearPendingRef();
      paintNav(); return paintView();
    }
    if ((el = e.target.closest('[data-copy]'))) {
      if (navigator.clipboard) navigator.clipboard.writeText(el.dataset.copy || '');
      var copyLbl = el.getAttribute('aria-label');
      el.setAttribute('aria-label', el.dataset.ack || 'Copied');
      el.classList.add('is-copied');
      setTimeout(function () { el.setAttribute('aria-label', copyLbl); el.classList.remove('is-copied'); }, 1600);
      return;
    }
    if (e.target.closest('[data-logopen]'))  { s.logging = true;  return repaint(); }
    if (e.target.closest('[data-logclose]')) { s.logging = false; return repaint(); }
    if (e.target.closest('[data-logsave]')) {
      var h = (root.querySelector('#ukLogHotel') || {}).value || '';
      if (!h.trim()) { var f0 = root.querySelector('#ukLogHotel'); if (f0) f0.focus(); return; }
      D.addPitch({ hotel:h.trim(), city:((root.querySelector('#ukLogCity') || {}).value || '').trim(), on:'today', via:(root.querySelector('#ukLogVia') || {}).value || 'Email', status:(root.querySelector('#ukLogStatus') || {}).value || 'Sent', note:'' });
      s.logging = false;
      return repaint();
    }
    if ((el = e.target.closest('[data-ack]'))) {
      var was = el.textContent;
      el.textContent = el.dataset.ack; el.disabled = true;
      setTimeout(function () { el.textContent = was; el.disabled = false; }, 1800);
      return;
    }
  });

  document.addEventListener('click', function (e) {
    if (!menu.hidden && !menu.contains(e.target) && !e.target.closest('[data-menu-toggle]')) closeMenu();
    if (side.classList.contains('is-open') && !side.contains(e.target) && !e.target.closest('[data-burger]')) closeSide();
    var np2 = q('#ukNotifyPanel');
    if (np2 && !np2.hidden && !np2.contains(e.target) && !e.target.closest('[data-notify-toggle]')) closeNotify();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var openDrop = root.querySelector('.ukDropMenu:not([hidden])');
      if (openDrop) {
        closeDrops();
        var back = openDrop.parentNode.querySelector('[data-drop-toggle]');
        if (back) back.focus();
        return;
      } closeMenu(); closeSide(); }
    if (e.key === 'Enter' || e.key === ' ') {
      var t = e.target.closest('[role="button"][tabindex="0"]');
      if (t && root.contains(t)) { e.preventDefault(); t.click(); }
    }
  });


  obBackdrop();
  paintNav();
  paintView();
  icons();
})();
