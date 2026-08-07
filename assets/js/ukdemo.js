/* Ukreate — which account you are looking at. Loaded by both apps.

   The seeded data describes an ESTABLISHED account: a hotel with twenty stays,
   fourteen collaborations and a full content library; a creator with six months
   of pitches, delivered work and earnings. That is the right demo for almost
   everything — but it means the first-hour experience, which is the one every
   real user actually has, could never be looked at.

   So there are two views of the same build:

     live  an account that has been running a while. The default.
     new   the first hour. Onboarding not done, and none of YOUR activity has
           happened yet.

   THE CUT IS "yours" VERSUS "the market". A brand-new hotel has no stays and no
   collaborations — but the creator network is still there, because it does not
   belong to them and it is the reason they signed up. A brand-new creator has no
   pitches and no work, but every published stay is still on offer. Emptying the
   market as well would show a product with nothing in it, which is not what a
   new account sees and not what anyone is buying.

   This is a demo control, not a product feature. It exists so the two
   experiences can be reviewed side by side without clearing storage by hand. */
window.UKDEMO = (function () {
  var KEY = 'uk_demo_mode_v1';

  var FRESH = false;
  function read() {
    /* A URL flag wins once and is then remembered, so ?as=new can be pasted to
       somebody and the pages they navigate to afterwards stay in that view.
       It also counts as an explicit switch: arriving on ?as=new with answers
       from a previous session left platforms already connected on a screen that
       is meant to be someone's first, which is the opposite of what the flag
       was asked for. */
    try {
      var q = new URLSearchParams(location.search).get('as');
      if (q === 'new' || q === 'live') {
        FRESH = true;
        localStorage.setItem(KEY, q);
        return q;
      }
      return localStorage.getItem(KEY) || 'live';
    } catch (e) { return 'live'; }
  }
  var MODE = read();
  /* ukonboard.js loads after this, so the clearing waits for it */
  if (FRESH) {
    document.addEventListener('DOMContentLoaded', function () {
      if (window.UKONBOARD) window.UKONBOARD.reset();
    });
  }

  function mode() { return MODE; }
  function isNew() { return MODE === 'new'; }

  function set(next) {
    try {
      localStorage.setItem(KEY, next);
      /* The onboarding record follows from the view rather than being set beside
         it — ukonboard.js treats an established account as already onboarded.
         All that is needed here is to clear any answers the reviewer typed. */
      if (window.UKONBOARD) window.UKONBOARD.reset();
      /* the cross-app records are activity too */
      if (next === 'new') {
        if (window.UKSTAYS)  window.UKSTAYS.reset();
        if (window.UKAPPLY)  window.UKAPPLY.reset();
        if (window.UKINVITE) window.UKINVITE.reset();
        if (window.UKPITCHIN) window.UKPITCHIN.reset();
        try { localStorage.removeItem('uk_shared_collabs_v1'); } catch (e) {}
        try { localStorage.removeItem('uk_favourites_v1'); } catch (e) {}
      }
    } catch (e) {}
    location.href = location.pathname;
  }

  /* ---- the strip ----
     Called by each app's data file with the arrays that belong to the account.
     Everything handed in is emptied; anything not handed in is the market and
     stays exactly as it is. */
  function strip(lists) {
    if (!isNew()) return;
    (lists || []).forEach(function (a) { if (Array.isArray(a)) a.length = 0; });
  }

  /* ---- the dock ----
     A floating switch rather than an item in the account menu, for two reasons.
     The gate covers that menu in the first-time view, so the one place you most
     need to switch back from was the one place you could not reach it. And it
     was a second control doing a job the URL flag already did, in a place you
     had to go looking for.

     It collapses to a pill, because a review control should be legible without
     occupying the design it is there to let you review. It mounts itself and
     handles its own clicks, so removing the feature is deleting one file and
     two strip() calls. */
  var OPEN_KEY = 'uk_demo_dock_v1';
  /* Collapsed unless asked for. A control that exists so you can look at the
     design should not be sitting on top of the design when you arrive. */
  function dockOpen() {
    try { return localStorage.getItem(OPEN_KEY) === '1'; } catch (e) { return false; }
  }
  function setDockOpen(v) {
    try { localStorage.setItem(OPEN_KEY, v ? '1' : '0'); } catch (e) {}
  }

  function dockHtml() {
    var live = !isNew();
    var open = dockOpen();
    return '<div class="ukDock' + (open ? ' is-open' : '') + '">' +
      '<button class="ukDock_tab" type="button" data-demo-toggle ' +
        'aria-expanded="' + open + '" aria-controls="ukDockBody" ' +
        'title="Demo view">' +
        '<span class="ukDock_dot' + (live ? '' : ' is-new') + '" aria-hidden="true"></span>' +
        '<span class="ukDock_now">' + (live ? 'Established' : 'First-time') + '</span>' +
        '<svg class="ukDock_car" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
          'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<path d="m6 9 6 6 6-6"/></svg>' +
      '</button>' +
      '<div class="ukDock_body" id="ukDockBody"' + (open ? '' : ' hidden') + '>' +
        '<p class="ukDock_h">Demo view</p>' +
        '<button class="ukDock_i' + (live ? ' is-on' : '') + '" type="button" data-demo="live">' +
          '<span class="ukDock_t">Established account</span>' +
          '<span class="ukDock_s">Running a while. Stays, collabs, earnings.</span></button>' +
        '<button class="ukDock_i' + (live ? '' : ' is-on') + '" type="button" data-demo="new">' +
          '<span class="ukDock_t">First-time account</span>' +
          '<span class="ukDock_s">The first hour. Onboarding, and nothing done yet.</span></button>' +
        trackRows() +
      '</div>' +
    '</div>';
  }

  /* ---- booking tracking status, for review ----
     Hotel side only: the creator app has no attribution surfaces of its own to
     gate, and putting a hotel's instrumentation state in a creator's dock would
     be nonsense. Same reason the account switch is here rather than in a menu:
     the whole point of the not-started state is that it changes what several
     pages are, and nobody can review that without a way to stand in it.
     ?tracking=none and ?tracking=pending do the same job from a pasted URL. */
  function trackRows() {
    var T = window.UKTRACK;
    if (!T || !document.querySelector('[data-ukapp]')) return '';
    var now = T.status();
    return '<div class="ukDock_rule"></div>' +
      '<p class="ukDock_h">Booking tracking</p>' +
      [['live','Live','Attribution reporting. The demo default.'],
       ['pending','In setup','Setup underway, figures held back.'],
       ['none','Not started','Nothing instrumented. No figures anywhere.']
      ].map(function (r) {
        return '<button class="ukDock_i' + (now === r[0] ? ' is-on' : '') + '" type="button" ' +
          'data-track="' + r[0] + '"><span class="ukDock_t">' + r[1] + '</span>' +
          '<span class="ukDock_s">' + r[2] + '</span></button>';
      }).join('');
  }

  function mount() {
    var host = document.getElementById('ukDemoDock');
    if (!host) {
      host = document.createElement('div');
      host.id = 'ukDemoDock';
      document.body.appendChild(host);
    }
    host.innerHTML = dockHtml();
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-demo-toggle]');
    if (el) { setDockOpen(!dockOpen()); return mount(); }
    var trk = e.target.closest && e.target.closest('[data-track]');
    if (trk && window.UKTRACK) return window.UKTRACK.set(trk.dataset.track);
    var pick = e.target.closest && e.target.closest('[data-demo]');
    if (pick) set(pick.dataset.demo);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else { mount(); }

  return { mode: mode, isNew: isNew, set: set, strip: strip, mount: mount };
})();
