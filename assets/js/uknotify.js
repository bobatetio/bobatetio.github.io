/* Ukreate — notifications. Loaded by BOTH /app/ and /creator/.

   The top bar used to carry a chat icon with a hardcoded badge that opened the
   collaborations list. That is not a notification: it was a link with a number
   painted on it, and the number was a literal typed into the HTML.

   Notifications here are DERIVED, never stored as a separate truth. Every item is
   computed from state that already exists — a collaboration waiting on you, an
   invitation you have not answered, a review you can now read. Nothing can drift,
   because there is nothing to keep in sync: if the underlying thing is resolved,
   the notification is simply not generated on the next read.

   What IS stored is the small amount that cannot be derived: which items you have
   seen, and which kinds you want to be told about. */
window.UKNOTIFY = (function () {
  var SEEN = 'uk_notify_seen_v1';
  var PREFS = 'uk_notify_prefs_v1';

  /* The kinds, and what each one means on each side. A kind a reader has switched
     off is not generated at all — it does not arrive and sit there unread. */
  var KINDS = [
    { k:'move',    t:'Waiting on you',      d:'A collaboration that cannot move until you act' },
    { k:'invite',  t:'Invitations',         d:'Invitations sent to you, and answers to yours' },
    { k:'content', t:'Content delivered',   d:'Work submitted for review' },
    { k:'booking', t:'Bookings',            d:'A tracked link turned into a booking' },
    { k:'review',  t:'Reviews',             d:'A review you can now read' }
  ];

  function read(key, fallback) {
    try { var v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; }
    catch (e) { return fallback; }
  }
  function write(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }

  function prefs() {
    var p = read(PREFS, {});
    var out = {};
    KINDS.forEach(function (k) { out[k.k] = p[k.k] !== false; });   /* on unless switched off */
    return out;
  }
  function setPref(kind, on) {
    var p = read(PREFS, {});
    p[kind] = !!on;
    write(PREFS, p);
  }

  function seen() { return read(SEEN, []); }
  function isSeen(id) { return seen().indexOf(id) > -1; }
  function markSeen(ids) {
    var all = seen();
    (ids || []).forEach(function (id) { if (all.indexOf(id) < 0) all.push(id); });
    /* the list is a record of what has been read, not a log: cap it so it cannot
       grow without limit on a busy account */
    write(SEEN, all.slice(-400));
  }
  function markAllSeen(list) { markSeen((list || []).map(function (n) { return n.id; })); }

  /* The generator is handed a side-specific reader so this module never has to
     know the shape of either app's data. Each app registers one at boot. */
  var sources = [];
  function source(fn) { sources.push(fn); }

  function all() {
    var on = prefs();
    var out = [];
    sources.forEach(function (fn) {
      var got;
      try { got = fn() || []; } catch (e) { got = []; }
      got.forEach(function (n) {
        if (!n || !n.id || !n.kind) return;
        if (!on[n.kind]) return;                     /* switched off: never generated */
        n.seen = isSeen(n.id);
        out.push(n);
      });
    });
    /* newest first where a weight is given, otherwise generation order */
    out.sort(function (a, b) { return (b.at || 0) - (a.at || 0); });
    return out;
  }
  function unread() { return all().filter(function (n) { return !n.seen; }); }

  function reset() { write(SEEN, []); write(PREFS, {}); }

  return {
    KINDS: KINDS, prefs: prefs, setPref: setPref,
    source: source, all: all, unread: unread,
    markSeen: markSeen, markAllSeen: markAllSeen, isSeen: isSeen, reset: reset
  };
})();
