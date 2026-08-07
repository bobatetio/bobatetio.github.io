/* Ukreate — hotel (B2B) app shell.
   Hotel-only by construction: there is no runtime role switch, so creator surfaces
   cannot be reached from here. Session role is set at sign-in and fixed. */
(function () {
  var root = document.querySelector('[data-ukapp]');
  var D = window.UK;
  if (!root) return;

  // Landing here at all means this device is on the hotel side. Record it so the shared
  // door at /signin/ never asks again, including after a direct visit that skipped login.
  try { localStorage.setItem('uk_side', 'hotel'); } catch (e) {}

  /* ---------------- session ---------------- */
  var SESSION = {
    role: 'hotel',
    property: 'MiraGrace Estate',
    person: 'Robert Torres',
    initials: 'RT',
    plan: 'Hotel Access'
  };

  /* ---------------- information architecture ----------------
     Three groups so the hotel always knows whether it is working,
     growing, or administering. Flat lists hide the difference. */
  var NAV = [
    { group: 'Today', items: [
      { id: 'home',    title: 'Dashboard',      icon: 'home' },
      { id: 'collabs', title: 'Collaborations', icon: 'chat' }
    ]},
    { group: 'Grow', items: [
      { id: 'stays',    title: 'Hosted stays',   icon: 'bag' },
      { id: 'library',  title: 'Content library', icon: 'book' },   /* was 'star', the same mark as Bookings & ROI */
      { id: 'creators', title: 'Creators',       icon: 'idcard' },
      { id: 'roi',      title: 'Bookings & ROI', icon: 'star' }
    ]}
  ];

  /* Guest guide and Settings live in the account menu now, so they are no longer in
     NAV — but the page title still has to resolve when either view opens. */
  /* No 'guides' entry: the guest guide is not a property-level page any more, it
     is part of each stay. The route stays reachable so an old link still resolves,
     but nothing in the product points at it. */
  /* Who to host is guidance, not a place work lives: it recommends a shape and
     hands you back to Host a creator. It sits in the account menu with the other
     things you consult rather than in the run of pages you work through. */
  var OFF_NAV = { hire: 'Who to host', settings: 'Settings', property: 'Property profile' };
  /* library used to have no nav entry at all and was only reachable from a card */

  var TITLES = {};
  NAV.forEach(function (g) { g.items.forEach(function (i) { TITLES[i.id] = i.title; }); });
  Object.keys(OFF_NAV).forEach(function (k) { TITLES[k] = OFF_NAV[k]; });
  TITLES.host = 'Host a creator';

  var q = function (s) { return root.querySelector(s); };
  var view = 'home';

  /* ---------------- icons ---------------- */
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
     Every item is DERIVED from state that already exists, so nothing can drift out
     of sync: resolve the underlying thing and the notification is simply not
     generated on the next read. */
  if (window.UKNOTIFY) {
    /* an application arriving from the creator app is the newest thing that can
       happen to this property, and it has a deadline attached to it in practice
       — a creator waiting on an answer goes and pitches somebody else */
    window.UKNOTIFY.source(function () {
      var A = window.UKAPPLY;
      if (!A) return [];
      var mine = {};
      UK.stays.forEach(function (s) { mine[s.id] = s; });
      return A.all().filter(function (ap) {
        return ap.state === 'sent' && mine[ap.stay];
      }).map(function (ap) {
        var st = mine[ap.stay];
        return { id:'apply:' + ap.id, kind:'move', at: 6,
          t: (ap.creatorName || 'A creator') + ' applied to ' + (st.t || 'a stay'),
          s: 'Waiting on your yes or no', go:'collabs', open: ap.id };
      });
    });

    window.UKNOTIFY.source(function () {
      var out = [];
      UK.collabs.forEach(function (c) {
        var cr = UK.creator(c.who);
        if (!cr || c.passed) return;
        if (c.stage === 0 && UK.STAGES[0].mine) {
          out.push({ id:'move:' + c.id + ':0', kind:'move', at: 5,
            t: cr.n + ' wants to host with you',
            s: 'An inquiry is waiting on your approval', go:'collabs', open:c.id });
        }
        if (c.stage === 3) {
          out.push({ id:'content:' + c.id + ':' + ((c.assets || []).length), kind:'content', at: 4,
            t: cr.n + ' delivered their work',
            s: (c.assets || []).length + ' pieces ready to review', go:'collabs', open:c.id });
        }
      });
      var I = window.UKINVITE;
      if (I) I.all().forEach(function (inv) {
        var stay = UK.stay(inv.stay);
        I.accepted(inv).forEach(function (i) {
          var cr = UK.creator(i.creator);
          if (!cr || !stay) return;
          out.push({ id:'invite:' + inv.stay + ':' + i.creator, kind:'invite', at: 3,
            t: cr.n + ' accepted your invitation',
            s: stay.t, go:'stays' });
        });
      });
      var R = window.UKREVIEWS;
      if (R) UK.collabs.forEach(function (c) {
        var key = c.link || c.id;
        var their = R.theirs(key, 'hotel');
        if (their && !their.blind) {
          var cr = UK.creator(c.who);
          out.push({ id:'review:' + key, kind:'review', at: 2,
            t: (cr ? cr.n : 'A creator') + ' reviewed the stay',
            s: their.stars + ' out of 5', go:'collabs', open:c.id });
        }
      });
      var A = window.UKATTRIB;
      if (A) {
        var t = A.totals();
        if (t.confirmed.count) {
          out.push({ id:'booking:' + t.confirmed.count + ':' + t.confirmed.value, kind:'booking', at: 1,
            t: t.confirmed.count + ' bookings confirmed',
            s: UK.money(t.confirmed.value) + ' attributed to your creators', go:'roi' });
        }
      }
      return out;
    });
  }

  var NOTIFY_ICONS = {
    move:'chat', invite:'idcard', content:'book', booking:'star', review:'star'
  };

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
        : '<p class="ukNotify_none">Nothing needs you right now.</p>') +
      '<button class="ukNotify_foot" type="button" data-go="settings">Notification settings</button>';
    icons(panel);
  }

  function closeNotify() {
    var panel = q('#ukNotifyPanel');
    if (!panel) return;
    panel.hidden = true;
    var b = q('[data-notify-toggle]');
    if (b) b.setAttribute('aria-expanded', 'false');
  }

  /* ---------------- navigation ---------------- */
  function paintNav() {
    /* ONE number for "collaborations needing you", used by the sidebar and by the
       top bar's chat badge. They were two counts: the sidebar computed this, and
       the badge was a literal 5 typed into the HTML. Two different numbers for the
       same thing, on screen at the same time. */
    var mine = UK.collabs.filter(function (c) { return UK.STAGES[c.stage].mine; }).length;
    NAV.forEach(function (g) { g.items.forEach(function (i) {
      if (i.id === 'collabs') i.count = mine || null; }); });
    paintNotify();
    /* Collapsed, the promo card is hidden and the primary action went with it —
       the one thing a hotel comes here to do became unreachable from the rail.
       The same action survives the collapse as a single + button. */
    q('#ukSideCard').innerHTML =
      '<div class="ukSideCard"><h3 class="ukSideCard_t">Host a creator</h3>' +
      '<p class="ukSideCard_p">Invite a creator to shoot a hosted stay in exchange for a free room.</p>' +
      '<button class="ukSideCard_b" type="button" data-go="host">Host a creator</button></div>' +
      '<button class="ukRailAdd" type="button" data-go="host" ' +
        'title="Host a creator" aria-label="Host a creator">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" ' +
          'stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>' +
      '</button>';
    var html = NAV.map(function (g) {
        return '<div class="ukSide_group"><p class="ukSide_gLabel">' + g.group + '</p>' +
          g.items.map(function (it) {
            var active = it.id === view;
            return '<button class="ukSide_link' + (active ? ' is-active' : '') + '" type="button" ' +
              'data-go="' + it.id + '"' + (active ? ' aria-current="page"' : '') + '>' +
              '<span class="ukIco ukIco--on">' + svg(it.icon, active) + '</span>' +
              '<span class="ukSide_lbl">' + it.title + '</span>' +
              (it.count ? '<span class="ukSide_count">' + it.count + '</span>' : '') +
              '</button>';
          }).join('') + '</div>';
      }).join('');
    q('#ukNav').innerHTML = html;
    icons();
  }

  /* ---------------- views ---------------- */
  var S = {};
  function st() { return (S[view] = S[view] || {}); }

  function render() {
    var s = st();
    if (view === 'home')     return UKV.dashboard(s);
    if (view === 'collabs')  return UKV.collabs(s);
    if (view === 'host')     return UKV.host(s);
    if (view === 'stays')    return UKV.stays(s);
    if (view === 'creators') return UKV.network(s);
    if (view === 'library')  return UKV.library(s);
    if (view === 'roi')      return UKV.roi(s);
    if (view === 'settings') return UKV.settings(s);
    if (view === 'hire')     return UKV.hire(s);
    if (view === 'guides')   return UKV.guides(s);
    if (view === 'property') return UKV.property(s);
    return UKV.empty('Nothing here', 'Pick a section from the sidebar.');
  }

  /* ---------------- smart breadcrumb ----------------
     One trail for the whole app, held here rather than in any single view, so no
     screen needs to ship its own back button and every screen can say how you
     reached it. Arriving somewhere already in the trail rewinds to it instead of
     growing a loop, so bouncing between two pages never stacks up. */
  var trail = ['home'];
  /* two pages of history plus whatever is open inside the current one, so the
     trail never runs past three crumbs and the last one never has to truncate */
  var CRUMB_MAX = 2;
  var CRUMB_SEP = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9.5 5.5 6 6.5-6 6.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function pushTrail(id) {
    var at = trail.indexOf(id);
    if (at > -1) { trail.length = at + 1; return; }
    trail.push(id);
    while (trail.length > CRUMB_MAX) trail.shift();
  }

  /* Whatever is open *inside* the current view becomes the last crumb. The shell
     owns this map because only it knows the trail; views stay pure renderers. */
  function leafCrumb() {
    var s = S[view] || {};
    if (view === 'collabs' && s.pitch) {
      var P = window.UKPITCHIN, px2 = P && P.byId(s.pitch);
      return px2 ? (px2.fromName || 'Pitch') : 'Pitch';
    }
    if (view === 'collabs' && s.thread) {
      var c = UK.collabs.filter(function (x) { return x.id === s.thread; })[0];
      return c ? UK.creator(c.who).n : null;
    }
    if (view === 'creators' && s.creator) {
      var cr = UK.creator(s.creator);
      return cr ? cr.n : null;
    }
    return null;
  }

  function escHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; });
  }

  function paintCrumb() {
    var el = q('#ukCrumb');
    if (!el) return;
    /* Two crumbs at most: the page you are on, and the thing open inside it.
       Never a history. Where you were before Creators is not part of where you are
       now, and printing it made the trail grow and change depending on how you
       arrived at the same screen. On a top-level page there is no trail at all —
       "Dashboard" above a page headed Dashboard tells a reader nothing. */
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

  /* The ask bar is one mounted instance, not two. On a page that offers its own
     search slot it is moved into it and leaves the top bar; everywhere else it
     goes home. Moving the node keeps its state, its listeners and its animation
     rather than tearing down and re-mounting. */
  /* Rescued before the view is wiped, placed again after. Without the rescue the
     shell is destroyed with the page it was borrowed into and the bar never
     comes back. */
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

  /* The creators map used to be a flat lat/long grid with markers on it — a
     diagram of a map rather than the map this product already has. It runs the
     same globe the hotel onboarding uses, mounted once and moved between paints
     so its texture and animation are not rebuilt on every filter change. */
  /* The globe's radius is min(width,height) * 0.46 * zoom, so anything above about
     1.08 puts the limb outside the box: what you see then is a patch of dots hard
     against one edge rather than a planet sitting in the middle of the frame. Both
     maps sit at the zoom that keeps the whole sphere in view and rotate to a place
     instead of pushing into it. */
  var FIT = 1;
  var crMap = null, crMapHost = null, crMapKey = null;
  function mountCrMap() {
    var slot = q('[data-crmap]');
    if (!slot || !window.UKDOTMAP) return;
    if (!crMapHost) {
      crMapHost = document.createElement('div');
      crMapHost.className = 'ukMap';
      crMapHost.setAttribute('aria-hidden', 'true');
    }
    if (crMapHost.parentNode !== slot) slot.appendChild(crMapHost);

    var pts = [];
    try { pts = JSON.parse(slot.getAttribute('data-crmap') || '[]'); } catch (e) { pts = []; }

    if (!crMap) crMap = window.UKDOTMAP.mount(crMapHost, { lat: 20, lng: 0, zoom: FIT });
    else if (crMap.resume) crMap.resume();
    if (!crMap) return;

    /* rebuilding the pin layer re-frames the camera, so it only happens when the
       set of people on screen has actually changed */
    var key = pts.map(function (p) { return p.id; }).join(',');
    if (key !== crMapKey) { if (crMap.pins) crMap.pins(pts); crMapKey = key; }

    /* pins() re-frames and will zoom in to fit its markers, which is what pushed
       the sphere out of the box; hold it at the fitting zoom and rotate instead */
    var sel = pts.filter(function (p) { return p.on; })[0];
    if (crMap.to) {
      if (sel) crMap.to(sel.lat, sel.lng, FIT);
      else crMap.to(20, 0, FIT);
    }
  }

  /* The photo uploader from the property onboarding, same behaviour and the same
     4:3 crop, so a picture added to a stay looks like a picture added there. These
     are the images a creator meets on the card.
     // PLUG-IN POINT — real storage. Today the crop is held as a data URL on the
     // draft; swap cropShot's output for an upload once there is a media endpoint. */
  var SHOT_MAX = 8;
  function cropShot(sh, done) {
    var img = new Image();
    img.onload = function () {
      var W = 1200, H = 900;                    // 4:3, the ratio every card uses
      var cv = document.createElement('canvas');
      cv.width = W; cv.height = H;
      var ctx = cv.getContext('2d');
      var scale = Math.max(W / img.width, H / img.height);
      var dw = img.width * scale, dh = img.height * scale;
      ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
      try { sh.out = cv.toDataURL('image/jpeg', 0.86); } catch (e) { sh.out = sh.src; }
      done && done();
    };
    img.onerror = function () { sh.out = sh.src; done && done(); };
    img.src = sh.src;
  }

  function takeStayFiles(fileList) {
    var fm = st().form || (st().form = { del:{} });
    fm.photos = fm.photos || [];
    var files = [].slice.call(fileList).slice(0, SHOT_MAX - fm.photos.length);
    var pending = files.length;
    if (!pending) return;
    files.forEach(function (file) {
      if (!/^image\//.test(file.type)) { if (!--pending) paintView(true); return; }
      var fr = new FileReader();
      fr.onload = function () {
        var sh = { src: fr.result };
        fm.photos.push(sh);
        cropShot(sh, function () { if (!--pending) paintView(true); });
      };
      fr.onerror = function () { if (!--pending) paintView(true); };
      fr.readAsDataURL(file);
    });
  }
  root.addEventListener('change', function (e) {
    if (e.target.closest('[data-stayshot]')) takeStayFiles(e.target.files);
  });
  ['dragenter','dragover'].forEach(function (ev) {
    root.addEventListener(ev, function (e) {
      var t = e.target.closest('.ukShots--host .ukShotAdd'); if (!t) return;
      e.preventDefault(); t.classList.add('is-over');
    });
  });
  ['dragleave','drop'].forEach(function (ev) {
    root.addEventListener(ev, function (e) {
      var t = e.target.closest('.ukShots--host .ukShotAdd'); if (!t) return;
      e.preventDefault(); t.classList.remove('is-over');
      if (ev === 'drop' && e.dataTransfer) takeStayFiles(e.dataTransfer.files);
    });
  });

  function stopClips() {
    root.querySelectorAll('.ukCrClip.is-playing').forEach(function (f) {
      var v = f.querySelector('.ukCrClip_v');
      if (v) { try { v.pause(); } catch (e) {} v.remove(); }
      f.classList.remove('is-playing');
    });
  }

  /* the globe on a creator's profile: same mount pattern, its own instance so it
     does not fight the one on the creators map view */
  var pMap = null, pMapHost = null, pMapKey = null;
  function mountProfMap() {
    var slot = q('[data-profmap]');
    if (!slot || !window.UKDOTMAP) return;
    if (!pMapHost) {
      pMapHost = document.createElement('div');
      pMapHost.className = 'ukMap';
      pMapHost.setAttribute('aria-hidden', 'true');
    }
    if (pMapHost.parentNode !== slot) slot.appendChild(pMapHost);
    var pts = [];
    try { pts = JSON.parse(slot.getAttribute('data-profmap') || '[]'); } catch (e) { pts = []; }
    if (!pMap) pMap = window.UKDOTMAP.mount(pMapHost, { lat: 20, lng: 0, zoom: FIT });
    else if (pMap.resume) pMap.resume();
    if (!pMap) return;
    var key = pts.map(function (x) { return x.id; }).join(',');
    if (key !== pMapKey) { if (pMap.pins) pMap.pins(pts); pMapKey = key; }
    if (pMap.to && pts[0]) pMap.to(pts[0].lat, pts[0].lng, FIT);
  }

  function paintView(keepScroll) {
    var now = paintCrumb() || TITLES[view] || 'Ukreate';
    document.title = now + ' · ' + SESSION.property;
    stopClips();
    var dyn = q('.ukView');
    rescueAsk();                 /* before the wipe, or the mounted bar dies with it */
    dyn.innerHTML = render();
    icons(dyn);
    placeAsk();
    mountHireMap();
    mountCrMap();
    mountProfMap();
    clampLines(dyn);
    placeStayPop();
    if (!keepScroll) window.scrollTo(0, 0);   // instant: a smooth reset moves hit targets mid-click
    paintOnboard();
  }

  /* Measured after paint, because only then is the trigger's real position known.
     Fixed, so the card's own overflow can never clip it. */
  /* The stay card is overflow:hidden — it has to be, to clip the photograph to
     its corners — so a popup positioned inside it is drawn and then clipped away.
     Fixed to the viewport and placed against the badge after paint, the same way
     the creator card's own "+N" is handled. */
  /* Trim a list to two lines and add the "+N" that opens the rest.

     Done by measurement, after layout, because only the browser knows how many
     words fit a panel that is a different width on every screen. Character budgets
     were a guess: too many on a narrow card, too few on a wide one, and the visible
     symptom was a word stranded alone on line two while line one still had room. */
  /* Both of these now live in ukstaycard.js with the card they belong to, so the
     creator app gets them too — it had the card's markup and none of its
     behaviour, which is why its "+N" never appeared. */
  function clampLines(root2) { window.UKSTAY.clamp(root2 || root); }
  function placeStayPop() {
    var s3 = st();
    if (!window.UKSTAY.place(s3.stayPop, root)) s3.stayPop = null;
  }
  function placeCrPop() {
    var panel = q('[data-crpop-panel]');
    if (!panel) return;
    var s = st();
    var btn = q('[data-crpop="' + s.crPop + '"]');
    if (!btn) { s.crPop = null; return; }
    var br = btn.getBoundingClientRect();
    var left = Math.min(Math.max(8, br.left), window.innerWidth - panel.offsetWidth - 8);
    var top = br.bottom + 8;
    if (top + panel.offsetHeight > window.innerHeight - 8) top = Math.max(8, br.top - panel.offsetHeight - 8);
    panel.style.left = left + 'px';
    panel.style.top = top + 'px';
    panel.style.visibility = 'visible';
  }

  /* The same globe the creator onboarding uses to pick markets, reused here for
     the one place a hotel is. Mounted once and moved, not re-created per paint. */
  var hireMap = null, hireMapHost = null, hireMapAt = null;
  /* The globe used to mount once at a fixed mid-Atlantic camera and then sit
     there: no pin, no relationship to the "Where" field beside it, which is what
     made it read as decoration rather than a map. It follows the typed place now,
     and drops the one pin a hotel actually has. */
  function mountHireMap() {
    var slot = q('[data-hiremap]');
    if (!slot || !window.UKDOTMAP) return;
    if (!hireMapHost) {
      hireMapHost = document.createElement('div');
      hireMapHost.className = 'ukMap';
      hireMapHost.setAttribute('aria-hidden', 'true');
    }
    if (hireMapHost.parentNode !== slot) slot.appendChild(hireMapHost);

    var brief = (st().brief) || {};
    var mk = brief.destK && window.UKMARKETS
      ? window.UKMARKETS.filter(function (m) { return m.k === brief.destK; })[0] : null;
    var place = mk ? { lat:mk.lat, lng:mk.lng, n:mk.n, cc:mk.cc }
                   : (UK.placeOf ? UK.placeOf(brief.dest) : null);

    if (!hireMap) {
      hireMap = window.UKDOTMAP.mount(hireMapHost, place
        ? { lat: place.lat, lng: place.lng, zoom: FIT }
        : { lat: 25, lng: -60, zoom: FIT });
    } else if (hireMap.resume) {
      hireMap.resume();
    }
    if (!hireMap) return;

    /* An unrecognised place clears the pin rather than leaving the previous one
       sitting under a different city's name. */
    if (place) {
      if (hireMap.pins) hireMap.pins([{ lat: place.lat, lng: place.lng, name: place.n, cc: place.cc || null }]);
      if (hireMap.to && hireMapAt !== place.n) hireMap.to(place.lat, place.lng, FIT);
      hireMapAt = place.n;
    } else {
      if (hireMap.pins) hireMap.pins([]);
      hireMapAt = null;
    }
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
  var obOpen = !!window.UKONBOARD && !window.UKONBOARD.complete('hotel');
  function obNeeded() { return obOpen; }
  /* What sits behind the gate matters. A brand-new account's own dashboard is
     empty — no stays, no collaborations, nothing to look at — so blurring that
     behind the questions teases an empty room. The marketplace is not theirs and
     is already full: the creator network — the reason a hotel signed up, and it already exists. */
  function obBackdrop() {
    if (!obNeeded()) return;
    if (view === 'home' || view === 'dash') view = 'creators';
  }

  /* the demo switcher, in the account menu — a review control, not a feature */
  (function () {
    var slot = document.querySelector('#ukDemoSwitch');
    if (slot && window.UKDEMO) slot.innerHTML = window.UKDEMO.menuHtml();
  })();
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-demo]');
    if (el && window.UKDEMO) window.UKDEMO.set(el.dataset.demo);
  });

  function paintOnboard() {
    var host = q('#ukObHost') || (function () {
      var d = document.createElement('div');
      d.id = 'ukObHost';
      document.body.appendChild(d);
      return d;
    })();
    if (!obNeeded()) { host.innerHTML = ''; document.body.classList.remove('is-onboarding'); return; }
    document.body.classList.add('is-onboarding');
    host.innerHTML = window.UKONBOARD.modalHtml('hotel', obAt);
    var first = host.querySelector('input');
    if (first) first.focus();
  }

  document.addEventListener('click', function (e) {
    if (!window.UKONBOARD) return;
    var el;
    if ((el = e.target.closest('[data-ob-set]'))) {
      window.UKONBOARD.set('hotel', (function (o) { o[el.dataset.obSet] = el.dataset.obVal; return o; })({}));
      window.UKONBOARD.apply("hotel");
      return paintOnboard();
    }
    if ((el = e.target.closest('[data-ob-pick]'))) {
      var k = el.dataset.obPick, v = el.dataset.obVal, cap = Number(el.dataset.obCap) || 1;
      var cur = window.UKONBOARD.get('hotel')[k];
      var next;
      if (cap === 1) { next = cur === v ? '' : v; }
      else {
        next = Array.isArray(cur) ? cur.slice() : [];
        var at = next.indexOf(v);
        if (at > -1) next.splice(at, 1); else if (next.length < cap) next.push(v);
      }
      var patch = {}; patch[k] = next;
      window.UKONBOARD.set('hotel', patch);
      window.UKONBOARD.apply("hotel");
      return paintOnboard();
    }
    if (e.target.closest('[data-ob-back]')) { obAt = Math.max(0, obAt - 1); return paintOnboard(); }
    if (e.target.closest('[data-ob-next]')) {
      var list = window.UKONBOARD.steps('hotel');
      if (obAt < list.length - 1) { obAt += 1; return paintOnboard(); }
      window.UKONBOARD.apply('hotel');
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

  document.addEventListener('input', function (e) {
    var el = e.target.closest && e.target.closest('[data-ob-field]');
    if (!el || !window.UKONBOARD) return;
    var patch = {}; patch[el.dataset.obField] = el.value;
    window.UKONBOARD.set('hotel', patch);
    /* the Continue button enables on the first keystroke, so it is never a dead
       control sitting there as an instruction you cannot follow */
    var go = document.querySelector('[data-ob-next]');
    if (go) go.disabled = !window.UKONBOARD.steps('hotel')[obAt].done(window.UKONBOARD.get('hotel'));
  });

  function go(next) {
    if (S.host) S.host.publish = null; view = next; pushTrail(next); paintNav(); paintView(); closeSide(); closeMenu(); }
  /* the gate rides on every paint, so it survives navigation */
  
  function repaint() { paintView(true); }
  window.UKGO = go;   // views can navigate

  /* Lets a view hand another view a starting state before navigating to it — the
     seam the natural-language creator search uses to open Host a Creator with the
     date it just parsed already sitting in the form, instead of asking the hotel to
     type back in what they only just said. S is private to this closure, so this is
     the one door in. */
  window.UKPREFILL = function (viewId, patch) {
    S[viewId] = Object.assign({}, S[viewId] || {}, patch);
    go(viewId);
  };

  /* ---------------- account menu ---------------- */
  var menu = q('#ukMenu');
  function closeMenu() {
    if (!menu) return;
    menu.hidden = true;
    var t = q('[data-menu-toggle]');
    if (t) t.setAttribute('aria-expanded', 'false');
  }
  function toggleMenu() {
    var open = menu.hidden;
    menu.hidden = !open;
    q('[data-menu-toggle]').setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) { var f = menu.querySelector('button'); if (f) f.focus(); }
  }

  /* ---------------- mobile drawer ---------------- */
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

  /* ---------------- events ---------------- */
  root.addEventListener('input', function (e) {
    var gEl = e.target.closest('[data-gbody]');
    if (gEl) { var gcur = D.guideById(st().guide); if (gcur) gcur.body[gEl.dataset.gbody] = gEl.value; return; }
    var bEl = e.target.closest('[data-briefi]');
    var cg = e.target.closest('[data-cguide]');
    if (cg) {
      var cs2 = st(), col = UK.collabs.filter(function (x) { return x.id === cs2.thread; })[0];
      var stay2 = col && UK.stay(col.stay);
      if (stay2) { stay2.guide = stay2.guide || {}; stay2.guide[cg.dataset.cguide] = cg.value; }
      return;
    }
    var gf = e.target.closest('[data-guidef]');
    if (gf) {
      var gs = st(); gs.form = gs.form || { del:{} };
      gs.form.guide = gs.form.guide || {};
      gs.form.guide[gf.dataset.guidef] = gf.value;
      return;
    }
    if (e.target.closest('[data-hostinviteq]')) {
      var hq = st(); hq.hostInviteQ = e.target.value;
      var caret2 = e.target.selectionStart;
      repaint();
      var back2 = root.querySelector('[data-hostinviteq]');
      if (back2) { back2.focus(); try { back2.setSelectionRange(caret2, caret2); } catch (er2) {} }
      return;
    }
    if (e.target.closest('[data-destq]')) {
      var ds = st();
      ds.destQ = e.target.value; ds.destOpen = true;
      var caret = e.target.selectionStart;
      repaint();
      var back = root.querySelector('[data-destq]');
      if (back) { back.focus(); try { back.setSelectionRange(caret, caret); } catch (er) {} }
      return;
    }
    if (bEl) {
      var bs = st(); bs.brief = bs.brief || {}; bs.brief[bEl.dataset.briefi] = bEl.value;
      /* the globe follows the field as it is typed, without repainting the page
         out from under the caret */
      if (bEl.dataset.briefi === 'dest') mountHireMap();
      return;
    }
    var ff = e.target.closest('[data-f]');
    if (ff) {
      var s2 = st();
      if (ff.hasAttribute('data-inviteq')) { s2.inviteQ = ff.value; return repaint(); }
      if (ff.dataset.briefnum) {
        s2.brief = s2.brief || {};
        s2.brief[ff.dataset.briefnum] = Math.max(1, Math.min(20, Number(ff.value) || 1));
        return repaint();
      }
      if (ff.dataset.f === 'inviteEmail') { s2.inviteEmail = ff.value; return; }
      s2.form = s2.form || { del: {} };
      s2.form[ff.dataset.f] = ff.value;
      var live = root.querySelector('.ukSticky');
      if (live) { var fresh = document.createElement('div'); fresh.innerHTML = render();
                  var b = fresh.querySelector('.ukSticky');
                  if (b) { live.innerHTML = b.innerHTML; icons(live); } }
      return;
    }
    var f = e.target.closest('[data-q]');
    if (!f) return;
    st().q = f.value;
    var pos = f.selectionStart;
    repaint();
    var again = root.querySelector('[data-q]');
    if (again) { again.focus(); again.setSelectionRange(pos, pos); }
  });


  root.addEventListener('change', function (e) {
    var r = e.target.closest('[data-role]');
    if (r) { UK.setRole(r.dataset.role, r.value); paintView(true); return; }
  });

  /* ---------------- .ukDrop menus ----------------
     Every dropdown in the product is the same two-part shape: a [data-drop-toggle]
     button and the .ukDropMenu that follows it. The markup and the styling existed
     but nothing ever opened them, which took out the ROI period, the ROI "Top by"
     sort, the Creators content-type filter and every control on Who to host.

     Handled here, first in the chain, and deliberately WITHOUT a repaint: a repaint
     rebuilds .ukView from scratch, so opening a menu by re-rendering the page would
     destroy the menu in the same tick. The menu items underneath repaint as normal,
     which is what closes it again. */
  /* A multi-select repaints on every pick, which rebuilds the menu closed. This
     puts the same one back open so a run of choices is one interaction, not one
     interaction per value. */
  function reopenDrop(attr) {
    /* takes either a bare attribute name or a whole selector, because the generic
       data-mset filters are told apart by their VALUE and not by the attribute */
    var sel = attr.charAt(0) === '[' ? attr : '[' + attr + ']';
    var item = root.querySelector('.ukDropMenu ' + sel);
    var menu = item && item.closest('.ukDropMenu');
    if (!menu) return;
    menu.hidden = false;
    var btn = menu.parentNode.querySelector('[data-drop-toggle]');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  }

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
        /* keyboard users land on the current choice, not on the first item */
        if (opening) {
          var sel = dm.querySelector('.ukDropMenu_i.is-sel') || dm.querySelector('.ukDropMenu_i');
          if (sel) sel.focus();
        }
      }
      e.stopPropagation();
      return;
    }
    /* a press anywhere else closes them, including on a menu item — that one
       goes on to be handled by the chain below and repaints */
    if (!e.target.closest('.ukDropMenu')) closeDrops();
  }, true);

  root.addEventListener('click', function (e) {
    var _el, _s = st();
    
    // Stay filter toggle
    var sfToggle = e.target.closest('[data-stayf-toggle]');
    if (sfToggle) {
      var menu = sfToggle.nextElementSibling;
      menu.hidden = !menu.hidden;
      if (!menu.hidden) sfToggle.setAttribute('aria-expanded', 'true');
      else sfToggle.setAttribute('aria-expanded', 'false');
      return;
    }
    
    // Stay filter menu item
    var sfItem = e.target.closest('[data-stayf]');
    if (sfItem && sfItem.getAttribute('data-stayf') !== undefined) {
      var ss = st();
      ss.stayF = sfItem.dataset.stayf;
      ss.thread = null;
      ss.composerMode = null;
      ss.modalOpen = null;
      if (sfItem.dataset.stayf === 'all' && ss.stageF == null) ss.stageF = '0';
      else if (sfItem.dataset.stayf !== 'all') ss.stageF = null;
      sfItem.closest('[role="menu"]').hidden = true;
      sfToggle = sfItem.closest('.ukStayFilter').querySelector('[data-stayf-toggle]');
      if (sfToggle) sfToggle.setAttribute('aria-expanded', 'false');
      return paintView(true);
    }
    
    // Close stay filter menu when clicking outside
    if (!e.target.closest('.ukStayFilter')) {
      var openMenus = document.querySelectorAll('.ukStayMenu:not([hidden])');
      openMenus.forEach(function (m) { m.hidden = true; });
      var toggles = document.querySelectorAll('[data-stayf-toggle]');
      toggles.forEach(function (t) { t.setAttribute('aria-expanded', 'false'); });
    }
    
    if ((_el = e.target.closest('[data-brief]')))  { _s.brief = _s.brief || {}; _s.brief[_el.dataset.brief] = _el.dataset.val; return repaint(); }
    if ((_el = e.target.closest('[data-briefn]'))) { _s.brief = _s.brief || {}; _s.brief[_el.dataset.briefn] = +_el.dataset.val; return repaint(); }
    if (e.target.closest('[data-newguide]')) { var ng = D.addGuide(SESSION.property); _s.guide = ng.id; return repaint(); }
    if ((_el = e.target.closest('[data-publishguide]'))) {
      var pg = D.guideById(_el.dataset.publishguide);
      if (pg) {
        if (!pg.live) D.GUIDE_SECTIONS.forEach(function (sec) {
          if (!(pg.body[sec.k] || '').trim()) pg.body[sec.k] = sec.seed;
        });
        pg.live = !pg.live; pg.updated = 'just now';
      }
      return repaint();
    }
    if (e.target.closest('[data-gpreview]')) { _s.gpreview = !_s.gpreview; return repaint(); }
    if ((_el = e.target.closest('[data-useseed]'))) {
      var gg = D.guideById(_s.guide), sec2 = _el.dataset.useseed;
      var def = D.GUIDE_SECTIONS.filter(function (x) { return x.k === sec2; })[0];
      if (gg && def) gg.body[sec2] = def.seed;
      return repaint();
    }
    var el;
    if ((el = e.target.closest('[data-go]')))   { go(el.dataset.go); return; }
    /* ---- invitations ---- */
    if ((el = e.target.closest('[data-invite-open]'))) { st().inviteFor = el.dataset.inviteOpen; return repaint(); }
    if (e.target.closest('[data-invite-cancel]'))      { st().inviteFor = null; return repaint(); }
    if ((el = e.target.closest('[data-invite-send]'))) {
      var pick = root.querySelector('[data-invite-stay]:checked');
      var hint = root.querySelector('#ukInviteHint');
      if (!pick) { if (hint) hint.textContent = 'Pick which stay you are inviting them to first.'; return; }
      var stay = UK.stay(pick.value);
      window.UKINVITE.invite(pick.value, [el.dataset.inviteSend], stay.capacity || 1);
      st().inviteFor = null;
      return repaint();
    }
    /* multi-select from a stay */
    if ((el = e.target.closest('[data-invitestay-open]'))) { st().inviteStay = el.dataset.invitestayOpen; st().invitePick = {}; return repaint(); }
    if (e.target.closest('[data-invitestay-cancel]'))      { st().inviteStay = null; return repaint(); }
    if ((el = e.target.closest('[data-invitepick]'))) {
      st().invitePick = st().invitePick || {};
      var k = el.dataset.invitepick;
      if (st().invitePick[k]) delete st().invitePick[k]; else st().invitePick[k] = true;
      return repaint();
    }
    if ((el = e.target.closest('[data-invitestay-send]'))) {
      var ids = Object.keys(st().invitePick || {});
      var h2 = root.querySelector('#ukInviteHint');
      if (!ids.length) { if (h2) h2.textContent = 'Pick at least one creator to invite.'; return; }
      var st2 = UK.stay(el.dataset.invitestaySend);
      window.UKINVITE.invite(st2.id, ids, st2.capacity || 1);
      st().inviteStay = null; st().invitePick = {};
      return repaint();
    }
    if ((el = e.target.closest('[data-invite-cancelone]'))) {
      var parts = el.dataset.inviteCancelone.split('|');
      window.UKINVITE.cancel(parts[0], parts[1]);
      return repaint();
    }

    /* ---- who to host: pick who to invite, then invite them ---- */
    if ((el = e.target.closest('[data-hirepick]'))) {
      var hs = st(); hs.hirePick = hs.hirePick || {};
      var hid = el.dataset.hirepick;
      if (hs.hirePick[hid]) delete hs.hirePick[hid]; else hs.hirePick[hid] = true;
      return repaint();
    }
    if ((el = e.target.closest('[data-hirepick-all]'))) {
      var hs2 = st();
      if (el.dataset.hirepickAll === 'none') hs2.hirePick = {};
      else { hs2.hirePick = {}; root.querySelectorAll('[data-hirepick]').forEach(function (t) { hs2.hirePick[t.dataset.hirepick] = true; }); }
      return repaint();
    }
    if (e.target.closest('[data-hireinvite]')) {
      var hs3 = st();
      var ids = Object.keys(hs3.hirePick || {});
      if (!ids.length) return;
      /* the stay this brief is for is the one with room; fall back to the first live one */
      var target = UK.stays.filter(function (x) { return x.status === 'live'; })[0];
      if (target) window.UKINVITE.invite(target.id, ids, target.capacity || ids.length);
      hs3.invitedFrom = target ? target.t : null;
      return repaint();
    }
    if ((el = e.target.closest('[data-destpick]'))) {
      var dp = st(), mk = (window.UKMARKETS || []).filter(function (m) { return m.k === el.dataset.destpick; })[0];
      dp.brief = dp.brief || {};
      if (mk) { dp.brief.destK = mk.k; dp.brief.dest = mk.n; }
      dp.destOpen = false; dp.destQ = null;
      return repaint();
    }
    /* the caveat behind the info button, shown in place rather than as a tooltip
       that a keyboard or a touch screen cannot reach */
    if ((el = e.target.closest('[data-info-toggle]'))) {
      var panel = el.closest('.ukHire_f').querySelector('.ukWhy--info');
      if (panel) { panel.hidden = !panel.hidden; el.setAttribute('aria-expanded', String(!panel.hidden)); }
      return;
    }
    if (st().destOpen && !e.target.closest('.ukPlace')) { st().destOpen = false; st().destQ = null; paintView(true); }
    if ((el = e.target.closest('[data-brief]'))) { st().brief = st().brief || {}; st().brief[el.dataset.brief] = el.dataset.val; return repaint(); }

    /* The "+N" sits inside cards that are themselves controls — a board card opens
       the thread, a creator card opens the profile. Its handler has to come before
       theirs or the press is always claimed by the card underneath it. */
    /* what the stay includes: a set, toggled from the menu or from its own chip */
    if ((el = e.target.closest('[data-inc]'))) {
      var fm = st().form || (st().form = { del:{} });
      var list = Array.isArray(fm.incList) ? fm.incList.slice() : [];
      var at = list.indexOf(el.dataset.inc);
      if (at > -1) list.splice(at, 1); else list.push(el.dataset.inc);
      fm.incList = list;
      /* the preview and the trade panel read a sentence, so keep one in step */
      fm.inc = list.join(', ');
      var wasMenu = !!el.closest('.ukDropMenu');
      paintView(true);
      if (wasMenu) reopenDrop('data-inc');
      return;
    }
    if ((el = e.target.closest('[data-nights]'))) {
      var fn = st().form || (st().form = { del:{} });
      var cur = parseInt(fn.nights, 10);
      if (isNaN(cur)) cur = 0;
      fn.nights = String(Math.max(0, Math.min(14, cur + Number(el.dataset.nights))));
      return paintView(true);
    }
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
        if (opening2) { S[dest] = Object.assign({}, S[dest] || {}, { thread: opening2 }); }
        return go(dest);
      }
      paintNotify();
      return;
    }
    if (e.target.closest('[data-notify-clear]')) {
      window.UKNOTIFY.markAllSeen(window.UKNOTIFY.all());
      paintNotify();
      return repaint();
    }
    if ((el = e.target.closest('[data-notify-pref]'))) {
      window.UKNOTIFY.setPref(el.dataset.notifyPref, el.getAttribute('aria-checked') !== 'true');
      paintNotify();
      return repaint();
    }
    /* st(), not s2: this listener has no s2 in scope — the same trap that has
       silently broken three handlers in this file already. */
    /* Before [data-creator] and [data-thread]: the card contains a profile link
       and sits in a view where cards open threads, so a later handler would never
       see this press. */
    if ((el = e.target.closest('[data-pitchopen]')) && !e.target.closest('[data-pitchbuild],[data-pitchpass],[data-creator]')) {
      st().pitch = el.dataset.pitchopen;
      return paintView();
    }
    if ((el = e.target.closest('[data-proftab]'))) { st().profTab = el.dataset.proftab; return repaint(); }
    if ((el = e.target.closest('[data-inqsub]'))) { st().inqSub = el.dataset.inqsub; return repaint(); }
    /* A pitch becomes a stay by opening the host flow already carrying what the
       creator proposed. Nothing is created until the hotel publishes it, so
       passing leaves nothing behind to tidy up. */
    if ((el = e.target.closest('[data-pitchbuild]'))) {
      var P = window.UKPITCHIN, px = P && P.byId(el.dataset.pitchbuild);
      if (px) {
        P.setState(px.id, 'building');
        /* The whole proposal, not just the nights: what they are asking for
           becomes the stay, what they are offering becomes the deliverables, and
           their angle seeds the brief. All of it editable — this is their offer,
           and the hotel is the one publishing. */
        var b = P.toBrief(px) || {};
        st().pitch = null;
        S.host = Object.assign({}, S.host || {}, {
          step: 1,
          fromPitch: px.id,
          form: {
            pkg:'blank',
            /* They asked for this stay, so they are the one person who should
               certainly see it. Private by default — the hotel can open it up. */
            visibility: 'private',
            invited: [px.from],
            nights: b.nights || '',
            inc: b.inc || '',
            incList: b.incList || [],
            del: b.del || {},
            reach:'', photos:[], guide:{},
            brief: px.angle
              ? px.fromName + ' pitched this: ' + px.angle +
                (px.note ? '\n\n' + px.note : '')
              : '',
            type: UK.property.cat, date:''
          }
        });
      }
      return go('host');
    }
    if (e.target.closest('[data-publish-open]'))   { st().publish = 'ask';  return repaint(); }
    if (e.target.closest('[data-publish-cancel]')) { st().publish = null;   return repaint(); }
    if (e.target.closest('[data-publish-go]')) {
      var pf = st().form || {};
      if (pf.visibility === 'private' && !(pf.invited || []).length) return;

      /* Publishing used to set a flag and repaint a confirmation screen. It
         never created a stay — not in this app's own list, and certainly not
         anywhere the creator side could see one. It does both now: the stay goes
         into the shared registry, which is the same record the creator app reads
         its Discover list out of, and comes back into this app's list through
         the same door. */
      var shots = (pf.photos || []).map(function (sh) { return sh.out || sh.src; }).filter(Boolean);
      var del = Object.keys(pf.del || {}).filter(function (k) { return pf.del[k]; })
                  .map(function (k) { return { t: k, q: pf.del[k] }; });
      var nights = pf.nights || null;
      var published = window.UKSTAYS && window.UKSTAYS.publish({
        t: pf.title || ((nights ? nights + (String(nights) === '1' ? ' night at ' : ' nights at ') : 'A stay at ') +
                        D.property.name),
        /* everything the creator side needs to place and render it, resolved
           here — it cannot reach into this app's data later to fill a gap */
        property: {
          name: D.property.name, city: D.property.city, cc: D.property.cc || null,
          lat: D.property.lat, lng: D.property.lng,
          img: D.property.img, cat: D.property.cat
        },
        shots: shots.length ? shots : [D.property.img],
        img: shots[0] || D.property.img,
        nights: nights,
        capacity: pf.capacity || 1,
        rooms: pf.type || D.property.cat || 'Room',
        incList: pf.incList || [],
        inc: pf.inc || '',
        del: del,
        from: pf.date || '', to: pf.dateTo || pf.date || '',
        reach: pf.reach || '5K - 25K',
        type: pf.shoots || D.property.cat || '',
        brief: pf.brief || '', guide: pf.guide || '',
        visibility: pf.visibility === 'private' ? 'private' : 'public',
        invited: pf.invited || []
      });

      if (published) {
        D.addStay(window.UKSTAYS.toHotel(published));
        /* a private stay IS an invitation: the creators it names are the only
           ones who will ever see it, so they are invited to it by definition */
        if (published.visibility === 'private' && window.UKINVITE) {
          window.UKINVITE.invite(published.id, published.invited, published.capacity);
        }
      }
      st().publish = 'done';
      st().publishedId = published && published.id;
      return repaint();
    }
    if ((el = e.target.closest('[data-vis]'))) {
      var fv = st().form || (st().form = { del:{} });
      fv.visibility = el.dataset.vis;
      fv.invited = fv.invited || [];
      return repaint();
    }
    if ((el = e.target.closest('[data-hostpick]'))) {
      var fp = st().form || (st().form = { del:{} });
      fp.invited = fp.invited || [];
      var at2 = fp.invited.indexOf(el.dataset.hostpick);
      if (at2 > -1) fp.invited.splice(at2, 1); else fp.invited.push(el.dataset.hostpick);
      return repaint();
    }
    if ((el = e.target.closest('[data-pitchreply]'))) {
      var box = q('#ukPitchReply');
      if (!box || !box.value.trim()) { if (box) box.focus(); return; }
      if (window.UKPITCHIN) window.UKPITCHIN.reply(el.dataset.pitchreply, box.value, 'hotel');
      return repaint();
    }
    if ((el = e.target.closest('[data-pitchpass]'))) {
      if (window.UKPITCHIN) window.UKPITCHIN.setState(el.dataset.pitchpass, 'passed');
      st().pitch = null;
      return repaint();
    }
    if ((el = e.target.closest('[data-fav]'))) {
      if (window.UKFAVS) window.UKFAVS.toggle('creators', el.dataset.fav);
      return paintView(true);
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
      st().reviewEdit = false;
      return repaint();
    }
    if (e.target.closest('[data-reviewedit]')) { st().reviewEdit = true; return repaint(); }
    if (e.target.closest('[data-briefedit]')) { var be = st(); be.editBrief = !be.editBrief; return repaint(); }
    if (e.target.closest('[data-guideedit]')) { var ge = st(); ge.editGuide = !ge.editGuide; return repaint(); }
    if ((el = e.target.closest('[data-staypop]'))) {
      var sp = st();
      sp.stayPop = sp.stayPop === el.dataset.staypop ? null : el.dataset.staypop;
      paintView(true);
      return placeStayPop();
    }
    if (e.target.closest('[data-staypop-close]')) { st().stayPop = null; return paintView(true); }
    if (st().stayPop && !e.target.closest('[data-staypop-panel]')) { st().stayPop = null; paintView(true); }
    if ((el = e.target.closest('[data-stayshotstep]'))) {
      var ps = st(), n = (ps.form && ps.form.photos || []).length || 1;
      ps.prevShot = ((ps.prevShot || 0) + Number(el.dataset.stayshotstep) + n) % n;
      return paintView(true);
    }
    if ((el = e.target.closest('[data-unstayshot]'))) {
      var fs2 = st().form || (st().form = { del:{} });
      (fs2.photos || []).splice(Number(el.dataset.unstayshot), 1);
      return paintView(true);
    }
    if ((el = e.target.closest('[data-crpop]'))) {
      var cp = st();
      cp.crPop = cp.crPop === el.dataset.crpop ? null : el.dataset.crpop;
      paintView(true); return placeCrPop();
    }
    if (e.target.closest('[data-crpop-close]')) { st().crPop = null; return paintView(true); }
    if ((el = e.target.closest('[data-creator]'))) {
      if (view !== 'creators') { view = 'creators'; paintNav(); }
      st().creator = el.dataset.creator;
      return paintView();
    }
    if ((el = e.target.closest('[data-goto]'))) {
      e.preventDefault();
      go(el.dataset.goto);
      if (el.dataset.preset != null) { st().stageF = el.dataset.preset; st().thread = null; repaint(); }
      return;
    }
    if (e.target.closest('[data-menu-toggle]')) { toggleMenu(); return; }
    if (e.target.closest('[data-signout]')) { window.location.href = '/signin/?out=1'; return; }
    if (e.target.closest('[data-burger]')) { side.classList.toggle('is-open'); return; }
    if (e.target.closest('[data-siderail]')) { setRail(!side.classList.contains('is-rail')); return; }

    var s2 = st();
    if ((el = e.target.closest('[data-page]')))   {
      var pr = el.dataset.page.split(':');
      s2[pr[0]] = Number(pr[1]);
      paintView();                                  /* a new page starts at the top */
      return;
    }
    if ((el = e.target.closest('[data-roisub]'))) { s2.roiSub = el.dataset.roisub; return repaint(); }
    if ((el = e.target.closest('[data-tab]')))    { s2.tab = el.dataset.tab;       return repaint(); }
    /* the commissionable basis re-costs every booking on the page */
    if ((el = e.target.closest('[data-basis]')))  { window.UKATTRIB.setBasis(el.dataset.basis); return repaint(); }
    if ((el = e.target.closest('[data-range]')))  { s2.range = el.dataset.range;   return repaint(); }
    if ((el = e.target.closest('[data-roiview]'))) { s2.roiView = el.dataset.roiview; return repaint(); }
    if ((el = e.target.closest('[data-roisort]'))){ s2.roiSort = el.dataset.roisort; return repaint(); }
    if ((el = e.target.closest('[data-view]')))   { s2.view = el.dataset.view;     return repaint(); }
    /* Multi-select menus: a press toggles one value in a set rather than replacing
       the whole filter, and the menu stays open so several can be picked in one
       go. "All" is the empty set, not a member of it. */
    /* data-mset names the filter and data-mval carries the value, so a page with
       five of these needs no branch of its own here. The three named attributes
       beside it predate the pair and are left alone. */
    if ((el = e.target.closest('[data-mset],[data-niche],[data-plat],[data-makes]'))) {
      var isPair = el.hasAttribute('data-mset');
      var mKey = isPair ? el.dataset.mset
               : el.hasAttribute('data-niche') ? 'niche'
               : el.hasAttribute('data-plat')  ? 'plat' : 'makes';
      var mVal = isPair ? el.dataset.mval : el.dataset[mKey];
      var set = Array.isArray(s2[mKey]) ? s2[mKey].slice() : [];
      if (mVal === 'all') set = [];
      else {
        var at = set.indexOf(mVal);
        if (at > -1) set.splice(at, 1); else set.push(mVal);
      }
      s2[mKey] = set;
      s2.pgCr = 1;
      /* narrowing from page 4 of the old result set lands on a page that no
         longer exists, so every library pick starts the run again */
      s2.pgLib = 1;
      var menu = el.closest('.ukDropMenu');
      paintView(true);
      /* put the menu back the way it was: repainting rebuilt it closed. A chip
         was never in a menu, so nothing reopens. */
      if (menu) reopenDrop(isPair ? '[data-mset="' + mKey + '"]' : 'data-' + mKey);
      return;
    }
    if (e.target.closest('[data-libclear]')) {
      /* Videos/Photos is not one of these: it is the frame you are looking
         through, not a narrower you added, so clearing leaves it alone */
      ['fStay','fBy','fFmt','fNiche','fPlat'].forEach(function (k) { s2[k] = []; });
      s2.pgLib = 1;
      return repaint();
    }
    if ((el = e.target.closest('[data-avail]')))  { s2.avail = el.dataset.avail;   return repaint(); }
    if ((el = e.target.closest('[data-mappin]'))) { s2.pin = el.dataset.mappin;    return repaint(); }
    if (e.target.closest('[data-clearf]')) {
      s2.q = ''; s2.niche = []; s2.plat = []; s2.avail = 'all'; s2.makes = [];
      return repaint();
    }
    if ((el = e.target.closest('[data-status]'))) { s2.status = el.dataset.status; return repaint(); }
    if ((el = e.target.closest('[data-stage]')))  { s2.stageF = el.dataset.stage;  return repaint(); }
    if ((el = e.target.closest('[data-cview]')))  { s2.cview = el.dataset.cview;   return repaint(); }
    /* opening a thread must lose to the card's own controls, which sit inside it */
    if ((el = e.target.closest('[data-cardapprove]'))) {
      s2.thread = el.dataset.cardapprove; s2.composerMode = 'approve'; s2.modalOpen = null;
      paintView(true);        /* keepScroll: the scrollIntoView below owns the move */
      var cp = q('.ukComposer');
      if (cp) cp.scrollIntoView({ behavior:'smooth', block:'center' });
      return;
    }
    if ((el = e.target.closest('[data-thread]')) && !e.target.closest('[data-cardact]')) { s2.thread = el.dataset.thread; s2.composerMode = null; s2.modalOpen = null; return paintView(); }
    if ((el = e.target.closest('[data-cardact] [data-thread]'))) { s2.thread = el.dataset.thread; s2.composerMode = null; s2.modalOpen = null; return paintView(); }
    if (e.target.closest('[data-back]'))          { s2.thread = null; s2.creator = null; s2.composerMode = null; s2.modalOpen = null; return paintView(); }
    /* a crumb always lands on that page's top level, so clicking "Collaborations"
       while a thread is open closes the thread rather than being a no-op */
    /* the card's "+N" overflow, anchored beside the button that opened it — same
       behaviour as the creator's own card (see positionPopup in ukcstart.js) */
    /* A clip plays inside its own frame on the card. Done against the DOM rather
       than through state and a repaint: re-rendering the grid to start a video
       would rebuild every card and drop the element that was just asked to play.
       Only one runs at a time — four cards playing at once is noise, not preview. */
    if ((el = e.target.closest('[data-clip]'))) {
      var frame = el;
      if (frame.classList.contains('is-playing')) { stopClips(); return; }
      stopClips();
      var v = document.createElement('video');
      v.className = 'ukCrClip_v';
      v.src = frame.dataset.clip;
      v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true;
      v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
      frame.appendChild(v);
      frame.classList.add('is-playing');
      /* NOT named `go`: var hoists to the whole listener, and this handler shares
         that scope with the app's go() navigation function. */
      var started = v.play();
      /* a browser that refuses autoplay leaves the still in place rather than a
         black rectangle that never starts */
      if (started && started.catch) started.catch(function () { stopClips(); });
      return;
    }
    if ((el = e.target.closest('[data-play]'))) { st().playing = el.dataset.play; return repaint(); }
    if (e.target.closest('[data-play-close]'))   { st().playing = null; return repaint(); }
    if (s2.crPop && !e.target.closest('[data-crpop-panel]')) { s2.crPop = null; paintView(true); }

    if ((el = e.target.closest('[data-crumb]'))) {
      var cid = el.dataset.crumb, cs = S[cid];
      if (cs) { cs.thread = null; cs.pitch = null; cs.creator = null; cs.composerMode = null; cs.modalOpen = null; }
      return go(cid);
    }
    if ((el = e.target.closest('[data-composer-mode]'))) {
      s2.composerMode = el.dataset.composerMode === 'review' ? null : el.dataset.composerMode;
      var toComposer = el.hasAttribute('data-tocomposer');
      repaint();
      /* fired from the header: bring the panel it just opened to the reader
         rather than leaving them to go looking for it */
      if (toComposer) {
        var panel = q('.ukComposer');
        if (panel) panel.scrollIntoView({ behavior:'smooth', block:'center' });
      }
      return;
    }
    if (e.target.closest('[data-composer-cancel]'))      { s2.composerMode = null; return repaint(); }

    if ((el = e.target.closest('[data-pkg]'))) {
      /* Blank is a real starting point, not the absence of one: it clears the
         template's answers so the next three steps arrive empty rather than
         pre-filled with something the hotel then has to undo. */
      if (el.dataset.pkg === 'blank') {
        s2.form = { pkg:'blank', nights:'', inc:'', incList:[], reach:'', photos:[],
                    guide:{}, brief:'', visibility:'public', invited:[],
                    type:(s2.form && s2.form.type) || UK.property.cat, del:{}, date:'' };
        return repaint();
      }
      var pk = UK.packages.filter(function (x) { return x.id === el.dataset.pkg; })[0];
      if (!pk) return;
      s2.form = { pkg:pk.id, nights:pk.nights, inc:pk.inc,
                 incList:String(pk.inc || '').split(',').map(function (x) { return x.trim(); }).filter(Boolean),
                 reach:pk.reach, photos:(s2.form && s2.form.photos) || [],
                 type:(s2.form && s2.form.type) || UK.property.cat, del:Object.assign({}, pk.del), date:'' };
      return repaint();
    }
    if ((el = e.target.closest('[data-pick]'))) {
      s2.form = s2.form || { del: {} };
      s2.form[el.dataset.pick] = s2.form[el.dataset.pick] === el.dataset.val ? '' : el.dataset.val;
      return repaint();
    }
    if ((el = e.target.closest('[data-del]'))) {
      s2.form = s2.form || { del: {} };
      var cur = s2.form.del[el.dataset.del] || 0;
      var nxt = Math.max(0, cur + (+el.dataset.dir));
      if (nxt) s2.form.del[el.dataset.del] = nxt; else delete s2.form.del[el.dataset.del];
      return repaint();
    }
    if ((el = e.target.closest('[data-step]'))) { s2.step = +el.dataset.step; return paintView(); }

    if ((el = e.target.closest('[data-send]'))) {
      var box = root.querySelector('#ukReply');
      var txt = (box && box.value || '').trim();
      var hint = root.querySelector('#ukSendHint');
      if (!txt) {
        if (hint) hint.textContent = 'Write something first.';
        if (box) box.focus();
        return;
      }
      UK.sendMessage(el.dataset.send, txt);
      paintView(true);
      var list = root.querySelector('#ukMsgs');
      if (list) list.scrollTop = list.scrollHeight;
      var again = root.querySelector('#ukSendHint');
      if (again) again.textContent = 'Sent.';
      var ta = root.querySelector('#ukReply');
      if (ta) ta.focus();
      return;
    }

    if ((el = e.target.closest('[data-invite]'))) {
      var act = el.dataset.invite;
      if (act === 'open')   { s2.invite = true;  s2.inviteErr = null; return repaint(); }
      if (act === 'cancel') { s2.invite = false; s2.inviteErr = null; s2.inviteEmail = ''; return repaint(); }
      var box2 = root.querySelector('#ukInviteEmail');
      var em = ((box2 && box2.value) || '').trim();
      s2.inviteEmail = em;
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) {
        s2.inviteErr = 'That does not look like an email address yet.';
        return repaint();
      }
      UK.addMember(em, s2.inviteRole || 'manager');
      s2.invite = false; s2.inviteEmail = ''; s2.inviteErr = null;
      return repaint();
    }
    if ((el = e.target.closest('[data-invrole]'))) { s2.inviteRole = el.dataset.invrole; return repaint(); }
    if ((el = e.target.closest('[data-drop]'))) {
      if (window.confirm('Remove ' + el.dataset.name + ' from ' + UK.property.name + '?')) {
        UK.dropMember(el.dataset.drop);
        return repaint();
      }
      return;
    }

    if ((el = e.target.closest('[data-approve-finalize]'))) {
      var title = (root.querySelector('#ukBriefTitle') || {}).value || '';
      var del = (root.querySelector('#ukBriefDel') || {}).value || '';
      var deadline = (root.querySelector('#ukBriefDeadline') || {}).value || '';
      var notes = (root.querySelector('#ukBriefNotes') || {}).value || '';
      var link = (root.querySelector('#ukBriefLink') || {}).value || '';
      var fileEl = root.querySelector('#ukBriefFile');
      var file = fileEl && fileEl.files && fileEl.files[0] ? fileEl.files[0].name : '';
      UK.sendBrief(el.dataset.approveFinalize, { title:title.trim(), deliverables:del.trim(), deadline:deadline, notes:notes.trim(), file:file, link:link.trim() });
      s2.composerMode = null;
      paintNav();
      paintView(true);
      return;
    }
    if ((el = e.target.closest('[data-pass]'))) {
      UK.passCollab(el.dataset.pass);
      s2.thread = null; s2.composerMode = null; s2.modalOpen = null;
      paintNav();
      paintView();
      return;
    }
    if ((el = e.target.closest('[data-approve]'))) {
      UK.approve(el.dataset.approve, 'Today');
      s2.composerMode = null; s2.modalOpen = null;
      paintNav();
      paintView();
      return;
    }

    if ((el = e.target.closest('[data-reqchanges-open]')))    { s2.modalOpen = 'reqchanges'; return repaint(); }
    if (e.target.closest('[data-reqchanges-cancel]'))         { s2.modalOpen = null; return repaint(); }
    if ((el = e.target.closest('[data-reqchanges-confirm]'))) {
      var noteEl = root.querySelector('#ukReqNote');
      var note = (noteEl && noteEl.value || '').trim();
      var rHint = root.querySelector('#ukReqHint');
      if (!note) {
        if (rHint) rHint.textContent = 'Say what needs to change first.';
        if (noteEl) noteEl.focus();
        return;
      }
      var assetEls = root.querySelectorAll('[data-reqasset]:checked');
      var assetIds = Array.prototype.map.call(assetEls, function (a) { return a.dataset.reqasset; });
      UK.requestChanges(el.dataset.reqchangesConfirm, note, assetIds);
      s2.modalOpen = null;
      paintView(true);
      var list2 = root.querySelector('#ukMsgs');
      if (list2) list2.scrollTop = list2.scrollHeight;
      return;
    }

    if (e.target.closest('[data-ack]')) {
      var b = e.target.closest('[data-ack]'), was = b.textContent;
      b.textContent = b.dataset.ack || 'Done';
      b.disabled = true;
      setTimeout(function () { b.textContent = was; b.disabled = false; }, 1800);
      return;
    }
  });

  document.addEventListener('click', function (e) {
    if (menu && !menu.hidden && !menu.contains(e.target) && !e.target.closest('[data-menu-toggle]')) closeMenu();
    var np2 = document.getElementById('ukNotifyPanel');
    if (np2 && !np2.hidden && !np2.contains(e.target) && !e.target.closest('[data-notify-toggle]')) closeNotify();
    if (side.classList.contains('is-open') && !side.contains(e.target) && !e.target.closest('[data-burger]')) closeSide();
    if (e.target.closest('.ukModalWrap') && !e.target.closest('.ukModal')) { var s3 = st(); if (s3.modalOpen) { s3.modalOpen = null; repaint(); } }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var openDrop = root.querySelector('.ukDropMenu:not([hidden])');
      if (openDrop) {
        closeDrops();
        var back = openDrop.parentNode.querySelector('[data-drop-toggle]');
        if (back) back.focus();
        return;
      }
      closeMenu(); closeSide();
      var s4 = st();
      if (s4.modalOpen) { s4.modalOpen = null; repaint(); }
    }
    if (e.key === 'Enter' || e.key === ' ') {
      var t = e.target.closest('[role="button"][tabindex="0"]');
      if (t && root.contains(t)) { e.preventDefault(); t.click(); }
    }
  });

  /* ---------------- theme ---------------- */

  /* ---------------- boot ---------------- */
  obBackdrop();
  paintNav();
  paintView();
  icons();
})();
