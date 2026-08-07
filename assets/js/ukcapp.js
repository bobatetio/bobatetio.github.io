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
    { group:'Find work', items:[
      { id:'stays',  title:'Discover stays', icon:'search' },
      { id:'pitch',  title:'Pitch Pilot',    icon:'star' },
      { id:'earn',   title:'Earnings',       icon:'bag' }
    ]},
    { group:'You', items:[
      { id:'boards',  title:'Mood boards',  icon:'eye' },
      { id:'kit',     title:'Media kit',    icon:'idcard' },
      { id:'academy', title:'Academy',      icon:'book' },
      { id:'community',title:'Community',   icon:'chat', out:true }
    ]}
  ];

  /* "Your profile" and "Account" are reachable from the account menu now, not
     the left rail — but the account menu still routes to them by id, so their
     page titles have to resolve even without a matching NAV entry. */
  var TITLES = { member:'Membership', apply:'Apply for this stay', editme:'How you travel',
                 hotel:'Hotel', board:'Board', guide:'Guest guide',
                 profile:'Your profile', account:'Account' };
  NAV.forEach(function (g) { g.items.forEach(function (i) { TITLES[i.id] = i.title; }); });

  var q = function (s) { return root.querySelector(s); };
  var view = 'home';
  var S = {};
  function st() { return (S[view] = S[view] || {}); }

  function svg(name) {
    return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
           ((window.UKICONS || {})[name] || '') + '</svg>';
  }
  function icons(scope) {
    (scope || root).querySelectorAll('[data-icon]:not(.ukIco--on)').forEach(function (el) {
      el.innerHTML = svg(el.dataset.icon);
      el.classList.add('ukIco', 'ukIco--on');
    });
  }

  function paintNav() {
    var needs = D.collabs.filter(function (c) { return D.STAGES[c.stage].mine && c.stage < 5; }).length;
    q('#ukNav').innerHTML = NAV.map(function (g) {
      return '<div class="ukSide_group"><p class="ukSide_gLabel">' + g.group + '</p>' +
        g.items.map(function (it) {
          var n = it.id === 'collabs' && needs ? '<span class="ukSide_count">' + needs + '</span>' : '';
          return '<button class="ukSide_link' + (it.id === view ? ' is-active' : '') + '" type="button" ' +
            'data-go="' + it.id + '"' + (it.id === view ? ' aria-current="page"' : '') + '>' +
            '<span class="ukIco ukIco--on">' + svg(it.icon) + '</span>' +
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
    if (view === 'apply')    return V.apply(s);
    if (view === 'pitch')    return window.UKCP.pitch(s);
    if (view === 'earn')     return V.earn(s);
    if (view === 'profile')  return V.profile(s);
    if (view === 'kit')      return V.kit(s);
    if (view === 'academy')  return V.academy(s);
    if (view === 'community')return V.community(s);
    if (view === 'member')   return V.member(s);
    if (view === 'account')  return V.account(s);
    if (view === 'editme')   return V.editme(s);
    if (view === 'hotel')    return V.hotel(s);
    if (view === 'boards')   return V.boards(s);
    if (view === 'board')    return V.board(s);
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
    if (view === 'boards' && s.board) return 'Board';
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
    if (!slot || !window.UKDOTMAP) return;
    if (!sMapHost) {
      sMapHost = document.createElement('div');
      sMapHost.className = 'ukMap';
      sMapHost.setAttribute('aria-hidden', 'true');
    }
    if (sMapHost.parentNode !== slot) slot.appendChild(sMapHost);

    var pts = [];
    try { pts = JSON.parse(slot.getAttribute('data-cstaymap') || '[]'); } catch (er) { pts = []; }

    if (!sMap) sMap = window.UKDOTMAP.mount(sMapHost, { lat: 20, lng: 0, zoom: FIT });
    else if (sMap.resume) sMap.resume();
    if (!sMap) return;

    var key = pts.map(function (p) { return p.id; }).join(',');
    if (key !== sMapKey) { if (sMap.pins) sMap.pins(pts); sMapKey = key; }

    var sel = pts.filter(function (p) { return p.on; })[0];
    if (sMap.to) sMap.to(sel ? sel.lat : 20, sel ? sel.lng : 0, FIT);
  }

  function paintView(keep) {
    var now = paintCrumb() || TITLES[view] || 'Ukreate';
    document.title = now + ' · Ukreate for creators';
    var dyn = q('.ukView');
    dyn.innerHTML = render();
    icons(dyn);
    mountStayMap();
    /* the stay card measures itself once it is on the page — this is what puts
       the "+N" on a list that does not fit, and it never ran on this side */
    if (window.UKSTAY) { window.UKSTAY.clamp(dyn); placeStayPop(); }
    if (!keep) window.scrollTo(0, 0);   // instant: a smooth reset moves hit targets mid-click
  }

  function placeStayPop() {
    var s2 = st();
    if (!s2.stayPop) return;
    if (!window.UKSTAY.place(s2.stayPop, document)) s2.stayPop = null;
  }

  function go(next) { pushTrail(next); view = next; paintNav(); paintView(); closeSide(); closeMenu(); }
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
    if ((el = e.target.closest('[data-crumb]'))) {
      var cid = el.dataset.crumb, cs = S[cid];
      if (cs) { cs.thread = null; cs.stay = null; cs.board = null; cs.composerMode = null; cs.modalOpen = null; }
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
    if ((el = e.target.closest('[data-savedf]'))) { s.saved = el.dataset.savedf === 'saved'; s.pgStays = 1; return repaint(); }
    if ((el = e.target.closest('[data-view]')))  { s.view = el.dataset.view;   return repaint(); }
    if ((el = e.target.closest('[data-tab]')))   { s.tab = el.dataset.tab;     return repaint(); }
    if ((el = e.target.closest('[data-stage]'))) { s.stageF = el.dataset.stage;return repaint(); }
    if ((el = e.target.closest('[data-style]'))) { s.style = el.dataset.style; s.pgStays = 1; return repaint(); }
    if ((el = e.target.closest('[data-pin]')))   { s.pin = el.dataset.pin;     return repaint(); }
    if (e.target.closest('[data-clearf]'))       { s.q=''; s.style='all'; s.saved=false; return repaint(); }
    if (e.target.closest('[data-savedonly]'))    { s.saved = !s.saved;         return repaint(); }

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
    if ((el = e.target.closest('[data-staypop]'))) {
      s.stayPop = s.stayPop === el.dataset.staypop ? null : el.dataset.staypop;
      paintView(true);
      return placeStayPop();
    }
    if (e.target.closest('[data-staypop-close]')) { s.stayPop = null; return paintView(true); }

    if ((el = e.target.closest('[data-open]'))) { s.open = el.dataset.open; return paintView(); }
    if (e.target.closest('[data-back]')) {
      if (s.delivering) { s.delivering = null; s.picked = null; return paintView(); }
      if (s.lesson) { s.lesson = null; return paintView(); }
      s.open = null; s.thread = null; return paintView();
    }
    if ((el = e.target.closest('[data-apply]'))) {
      view = 'apply'; st().stay = el.dataset.apply; paintNav(); return paintView();
    }
    if (e.target.closest('[data-newboard]'))    { s.making = true; return paintView(); }
    if (e.target.closest('[data-cancelboard]')) { s.making = false; s.mk = null; return paintView(); }
    if ((el = e.target.closest('[data-mkset]'))) { (s.mk = s.mk || {})[el.dataset.mkset] = el.dataset.val; return paintView(); }
    if (e.target.closest('[data-makeboard]')) {
      var mk = s.mk || {};
      var b = D.addBoard({
        t: (mk.t || '').trim() || (root.querySelector('#ukBoardT') || {}).placeholder || 'New board',
        kind: mk.kind || 'destination',
        sub: (mk.sub || '').trim() || (root.querySelector('#ukBoardS') || {}).placeholder || '',
        note: '', cover: 'reel1', shared: false, picks: []
      });
      s.making = false; s.mk = null;
      view = 'board'; st().board = b.id; paintNav(); return paintView();
    }
    if ((el = e.target.closest('[data-shareboard]'))) {
      var bb = D.board(el.dataset.shareboard);
      if (bb) bb.shared = !bb.shared;
      return paintView();
    }

    if (e.target.closest('[data-editme]')) { go('editme'); return; }
    if ((el = e.target.closest('[data-hotel]'))) { view = 'hotel'; st().stay = el.dataset.hotel; paintNav(); return paintView(); }
    if ((el = e.target.closest('[data-board]'))) { view = 'board'; st().board = el.dataset.board; paintNav(); return paintView(); }
    if ((el = e.target.closest('[data-guide]'))) { view = 'guide'; st().guide = el.dataset.guide; paintNav(); return paintView(); }
    if ((el = e.target.closest('[data-sendapply]'))) {
      var sid = el.dataset.sendapply;
      D.collabs.unshift({ id:'k' + Date.now(), stay:sid, stage:0, when:'just now', unread:0, fresh:true,
        msgs:[{ by:'me', at:'just now', tx:(root.querySelector('#ukApplyMsg') || {}).value || 'I would love to be considered for this stay.' }] });
      view = 'collabs'; S.collabs = { sent:true }; paintNav(); return paintView();
    }
    if ((el = e.target.closest('[data-thread]'))) { s.thread = el.dataset.thread; s.delivering = null; s.picked = null; return paintView(); }

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
    if ((el = e.target.closest('[data-lesson]'))) { s.lesson = el.dataset.lesson; return paintView(); }
    if ((el = e.target.closest('[data-watched]'))) {
      var L = D.academy.filter(function (x) { return x.id === el.dataset.watched; })[0];
      if (L) L.done = true;
      return repaint();
    }
    if (e.target.closest('[data-clearpp]')) {
      s.q = ''; s.fstyle = null; s.fvibe = null; s.fbudget = null; s.pgPitch = 1; return repaint();
    }
    if (e.target.closest('[data-join]')) { D.me.member = true; D.me.verified = true; paintNav(); return paintView(); }
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


  paintNav();
  paintView();
  icons();
})();
