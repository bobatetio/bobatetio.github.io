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

  function read() {
    /* a URL flag wins once and is then remembered, so ?as=new can be pasted to
       somebody and the pages they navigate to afterwards stay in that view */
    try {
      var q = new URLSearchParams(location.search).get('as');
      if (q === 'new' || q === 'live') { localStorage.setItem(KEY, q); return q; }
      return localStorage.getItem(KEY) || 'live';
    } catch (e) { return 'live'; }
  }
  var MODE = read();

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

  /* the switcher, for the account menu on both sides */
  function menuHtml() {
    var live = !isNew();
    return '<div class="ukMenu_rule"></div>' +
      '<p class="ukMenu_head ukDemo_h">Demo view</p>' +
      '<button class="ukMenu_i ukDemo_i' + (live ? ' is-on' : '') + '" type="button" role="menuitem" ' +
        'data-demo="live">Established account' +
        (live ? '<span class="ukDemo_tick" aria-hidden="true">✓</span>' : '') + '</button>' +
      '<button class="ukMenu_i ukDemo_i' + (live ? '' : ' is-on') + '" type="button" role="menuitem" ' +
        'data-demo="new">First-time account' +
        (live ? '' : '<span class="ukDemo_tick" aria-hidden="true">✓</span>') + '</button>';
  }

  return { mode: mode, isNew: isNew, set: set, strip: strip, menuHtml: menuHtml };
})();
