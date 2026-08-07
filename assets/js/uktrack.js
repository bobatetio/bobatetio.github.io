/* Ukreate — booking tracking status. Hotel side.

   THE PROBLEM THIS FIXES. Attribution only works if a property's booking flow is
   instrumented: the tracked link survives checkout, and the booking's outcome
   (booked, cancelled, no-show, consumed) comes back to us. Until that is true
   there is nothing to attribute. The build had no state for it, so every hotel
   was implicitly treated as fully wired and every ROI surface showed attributed
   revenue that an uninstrumented property could not possibly have.

   So tracking status is REAL STATE on the property record, seeded here, read by
   every surface that would otherwise print a confident revenue figure. It is not
   inferred from whether attribution rows happen to exist: a hotel with zero
   bookings and working tracking is a different sentence from a hotel we cannot
   see, and the product has to be able to say which one it is.

   WHAT THIS IS NOT. It is not an integrations hub. There are no connect buttons
   for a PMS or for Partnerize, and there should not be: which booking engine a
   property runs, whether it can preserve a click ID, and whether it can post
   lifecycle events out are an engineering conversation between Ukreate and the
   hotel, not a self-serve toggle. This file carries status and honesty. The
   plumbing lives off-platform.

   // PLUG-IN POINT — the real source of truth. status() should read the
   property's instrumentation record from the API: confirmed link-through on the
   booking engine, plus Partnerize reconciliation health (are lifecycle events
   arriving, do they balance). Replace the seed and the localStorage override
   below with that read. Everything else in the app already routes through the
   three states, so nothing downstream changes. */
window.UKTRACK = (function () {

  /* ---- the three states ----
     Deliberately three and not two. "Nothing set up" and "set up, not confirmed"
     want opposite things from the hotel: one is a prompt, the other is a please
     wait. Collapsing them would make us nag a property that is already mid-setup. */
  var STATES = {
    none: {
      k:'none', t:'Not started', tone:'done',
      short:'Booking tracking is not set up.',
      /* the page-head subtitle, replacing the one that promises figures */
      sub:'Booking tracking is not live yet, so there is nothing here we can honestly show you.',
      title:'Booking tracking is not live yet',
      body:'This page is empty because we cannot see your bookings, not because you have none. ' +
           'Attribution needs your booking flow instrumented first: the creator link carried all the ' +
           'way through checkout, and the outcome of each booking sent back to us.',
      /* The distinction the whole feature exists to make legible. */
      apart:'This is not the same as having no bookings yet. Once tracking is live and nobody has ' +
            'booked, this page will say zero, and zero will be a real number.',
      next:'Getting set up is a short conversation with your Ukreate contact about which booking ' +
           'engine you run and what it can pass through. Most properties are reporting within a fortnight.',
      cta:'Start tracking setup', ack:'We will be in touch'
    },
    pending: {
      k:'pending', t:'In setup', tone:'wait',
      short:'Booking tracking is being set up.',
      sub:'Your booking tracking is being set up. Figures appear here once the data coming back is complete.',
      title:'Booking tracking is being set up',
      body:'Your setup is underway with your Ukreate contact. Bookings may already be reaching us, ' +
           'but we hold the numbers back until they reconcile cleanly, because half a figure is worse ' +
           'than none.',
      apart:'This is not the same as having no bookings yet. Once the data is confirmed, whatever your ' +
            'creators have driven so far appears here, including anything booked during setup.',
      next:'Nothing is needed from you right now. Your Ukreate contact will confirm as soon as the ' +
           'first bookings reconcile.',
      cta:'Check setup progress', ack:'Setup is with your Ukreate contact'
    },
    live: {
      k:'live', t:'Live', tone:'you',
      short:'Booking tracking is live.',
      sub:'', title:'', body:'', apart:'', next:'', cta:'', ack:''
    }
  };

  /* What tracking buys the hotel. The same three on every surface that explains
     the unconnected state, because they are the product, not a feature list. */
  var UNLOCKS = [
    /* Every heading here is written long enough that no wrap can strand one or
       two words on a line of their own, at any of the widths these cards take. */
    { t:'Every booking traced to the content that drove it',
      p:'Each direct booking matched back to the creator, the video and the link it came from.' },
    { t:'Revenue by creator, not just view counts',
      p:'Who books rooms rather than who gets watched, so you know who to host again.' },
    { t:'Commission only on the stays that happened',
      p:'Cancellations and no-shows reverse out. You are never charged on a booking nobody took.' }
  ];

  /* ---- the seed ----
     MiraGrace is the demo account and it demos with a full ROI page, so it ships
     live. The other two states are reachable from the demo dock and from
     ?tracking=none / ?tracking=pending, which is how they get reviewed without
     anyone editing this file.
     // PLUG-IN POINT — see the file header. */
  var SEED = 'live';
  var KEY = 'uk_tracking_status_v1';

  function read() {
    try {
      var q = new URLSearchParams(location.search).get('tracking');
      if (STATES[q]) { localStorage.setItem(KEY, q); return q; }
      var s = localStorage.getItem(KEY);
      return STATES[s] ? s : SEED;
    } catch (e) { return SEED; }
  }
  var STATUS = read();

  function status() { return STATUS; }
  function state()  { return STATES[STATUS] || STATES[SEED]; }
  function isLive() { return STATUS === 'live'; }
  function set(next) {
    if (!STATES[next]) return;
    try { localStorage.setItem(KEY, next); } catch (e) {}
    STATUS = next;
    location.href = location.pathname;
  }

  /* ---- what Ukreate needs to reconcile this property's bookings ----
     Identifiers, not credentials. A hotel is asked for these on a call; showing
     them back means they can check we are matching the right property, and it
     gives support something to quote. Seeded and illustrative.
     // PLUG-IN POINT — issued by the API alongside the status above. */
  var REF = [
    { l:'Property reference', v:'UK-MG-4417',
      h:'Quote this to your Ukreate contact about anything booking related.' },
    { l:'Tracking partner account', v:'PZ-88213',
      h:'The Partnerize account your bookings reconcile against. Managed by Ukreate.' },
    { l:'Booking engine on file', v:'Direct booking engine',
      h:'What your tracked links point at. Never an OTA.' }
  ];

  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) {
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; }); };

  /* ---- the status pill ----
     Reuses the three tag tones the app already has, so status reads the same way
     a collaboration stage does. The word carries the meaning; the colour only
     seconds it, which is what keeps it legible without relying on colour. */
  function pill(cls) {
    var s = state();
    return '<span class="ukTag ukTag--' + s.tone + ' ' + (cls || '') + '">' + esc(s.t) + '</span>';
  }

  function unlocks() {
    return '<ul class="ukTrackWhy">' + UNLOCKS.map(function (u) {
      return '<li><p class="ukTrackWhy_t">' + esc(u.t) + '</p>' +
             '<p class="ukTrackWhy_p">' + esc(u.p) + '</p></li>';
    }).join('') + '</ul>';
  }

  /* ---- the honest state ----
     One writing of it, three sizes, so Bookings and ROI, the dashboard and
     Settings can never drift into describing the situation differently.

       full     the Bookings and ROI page, which has nothing else to be
       compact   the dashboard, where it stands in for the revenue cards
       settings  the status surface, which adds the identifiers */
  function panel(size) {
    if (isLive()) return '';
    var s = state();
    if (size === 'compact') {
      return '<section class="ukPanel ukTrackState ukTrackState--compact c12">' +
        '<div class="ukTrackState_h"><h3 class="ukCard_t">' + esc(s.title) + '</h3>' + pill() + '</div>' +
        '<p class="ukTrackState_p">' + esc(s.body) + '</p>' +
        '<p class="ukTrackState_apart">' + esc(s.apart) + '</p>' +
        '<button class="ukGhost" type="button" data-goto="roi">See what tracking shows you</button>' +
      '</section>';
    }
    /* 'settings' is the same panel without the reading-width cap: inside the
       settings column it has to fill its column like every panel beside it. */
    var cls = 'ukPanel ukTrackState' + (size === 'settings' ? '' : ' ukTrackState--roi');
    return '<section class="' + cls + '">' +
      '<div class="ukTrackState_h"><h3 class="ukTrackState_t">' + esc(s.title) + '</h3>' + pill() + '</div>' +
      '<p class="ukTrackState_p">' + esc(s.body) + '</p>' +
      '<p class="ukTrackState_apart">' + esc(s.apart) + '</p>' +
      '<h4 class="ukSub">What tracking gives you</h4>' +
      unlocks() +
      '<div class="ukRule"></div>' +
      '<h4 class="ukSub">What happens next</h4>' +
      '<p class="ukTrackState_next">' + esc(s.next) + '</p>' +
      '<button class="ukBtn" type="button" data-ack="' + esc(s.ack) + '">' + esc(s.cta) + '</button>' +
    '</section>';
  }

  /* The identifiers block, Settings only. Read-only by design: none of these are
     things a hotel sets, and an editable field would imply self-serve setup. */
  function refs() {
    return '<dl class="ukTrackRefs">' + REF.map(function (r) {
      return '<div><dt>' + esc(r.l) + '</dt><dd>' + esc(r.v) + '</dd>' +
             '<dd class="ukTrackRefs_h">' + esc(r.h) + '</dd></div>';
    }).join('') + '</dl>';
  }

  /* One line for the surfaces that show a tracked link outside the ROI page. The
     link genuinely exists and a creator can genuinely use it; what is not true
     yet is that anything comes back through it, and a hotel handing that link
     over deserves to know which of the two it has. */
  function linkNote() {
    if (isLive()) return '';
    var s = state();
    return '<p class="ukHint ukTrackNote">' + esc(s.short) +
      ' This link works, but bookings made through it are not reported back yet.</p>';
  }

  return {
    STATES: STATES, UNLOCKS: UNLOCKS,
    status: status, state: state, isLive: isLive, set: set,
    pill: pill, panel: panel, refs: refs, unlocks: unlocks, linkNote: linkNote
  };
})();
