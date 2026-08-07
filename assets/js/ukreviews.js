/* Ukreate — ratings and reviews. Loaded by BOTH /app/ and /creator/.

   A hosted stay is a trade between two parties who each took a risk on the other,
   so both get to say how it went. The hotel rates the creator; the creator rates
   the hotel. Same shape, same weight, one record — because a marketplace where
   only one side is graded is a marketplace where only one side is accountable.

   Two rules the shape enforces:

   1. You can only review a collaboration you actually completed. A rating that
      anyone can leave is a rating nobody can trust.
   2. Neither side sees the other's review until both are in, or until the window
      closes. Otherwise the second review answers the first, and what you get is a
      negotiation rather than two honest accounts.

   Held in localStorage against the same origin both apps share, the way
   UKATTRIB and UKINVITE already are. */
window.UKREVIEWS = (function () {
  var KEY = 'uk_reviews_v1';
  var WINDOW_DAYS = 14;          /* after this, whatever is in is published */

  function loadAll() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; }
  }
  function saveAll(all) {
    try { localStorage.setItem(KEY, JSON.stringify(all)); } catch (e) {}
  }

  /* One record per collaboration, holding at most one review from each side. The
     collaboration id is the key both apps already agree on. */
  function forCollab(id) { return loadAll()[id] || { collab:id, hotel:null, creator:null }; }

  function leave(collabId, side, stars, text) {
    if (side !== 'hotel' && side !== 'creator') return null;
    var n = Math.round(Number(stars));
    if (!(n >= 1 && n <= 5)) return null;
    var all = loadAll();
    var rec = all[collabId] || { collab:collabId, hotel:null, creator:null };
    rec[side] = { stars:n, text:String(text || '').trim(), at: 'just now' };
    all[collabId] = rec; saveAll(all);
    return rec;
  }

  function mine(collabId, side) { return forCollab(collabId)[side]; }

  /* What the OTHER side wrote, if you are allowed to see it yet. Blind until both
     have written, so neither review is a reply to the other. */
  function theirs(collabId, side, windowClosed) {
    var rec = forCollab(collabId);
    var other = side === 'hotel' ? 'creator' : 'hotel';
    if (!rec[other]) return null;
    if (rec[side] || windowClosed) return rec[other];
    return { blind:true };
  }

  /* Every published review of one party, for a profile. */
  function about(side, matchFn) {
    var all = loadAll(), out = [];
    Object.keys(all).forEach(function (k) {
      var rec = all[k];
      var r = rec[side];
      if (!r) return;
      if (matchFn && !matchFn(k)) return;
      out.push({ collab:k, stars:r.stars, text:r.text, at:r.at });
    });
    return out;
  }

  function average(list) {
    if (!list.length) return null;
    var sum = list.reduce(function (a, r) { return a + r.stars; }, 0);
    return Math.round(sum / list.length * 10) / 10;
  }

  function reset() { saveAll({}); }

  return {
    WINDOW_DAYS: WINDOW_DAYS,
    forCollab: forCollab, leave: leave, mine: mine, theirs: theirs,
    about: about, average: average, reset: reset
  };
})();
