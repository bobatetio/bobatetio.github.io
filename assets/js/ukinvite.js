/* Ukreate — invitations. One record, written by both /app/ and /creator/.

   An inquiry is a creator putting their hand up. An invitation is the same
   relationship started from the other end: the hotel went looking, found someone
   specific, and asked them.

   Which is why an accepted invitation SKIPS INQUIRY. Inquiry exists so a hotel
   can sift people it did not choose. When the hotel did the choosing, asking it
   to then formally "approve" the creator it just hand-picked is ceremony. The
   creator's acceptance is the commitment moment, and it lands the collaboration
   straight in the post-approval stage.

   Capacity is the governing mechanism, and it is the same number the hiring
   helper already reasons about — how many creators this stay can actually host.
   A hotel may deliberately invite more people than it has room for, expecting
   declines. When the slots fill, the rest are told, warmly and immediately.
   Leaving people hanging, or letting them accept into a stay that is already
   full, is the fastest way to lose creators. */
window.UKINVITE = (function () {
  var KEY = 'uk_invitations_v1';

  /* The signed-in creator is Amara Mensah, who is c1 on the hotel's roster. Both
     apps must key an invitation by the same id or the hotel would send to c1 and
     the creator would look for one addressed to "me" and find nothing. */
  var ME = 'c1';

  function loadAll() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; }
  }
  function saveAll(all) {
    try { localStorage.setItem(KEY, JSON.stringify(all)); } catch (e) {}
  }

  /* One invitation per stay. Inviting more people later tops up the same record
     rather than starting a second one, so remaining capacity is counted once. */
  function forStay(stayId) { return loadAll()[stayId] || null; }
  function all() {
    var a = loadAll();
    return Object.keys(a).map(function (k) { return a[k]; });
  }

  function ensure(stayId, capacity) {
    var a = loadAll();
    if (!a[stayId]) {
      a[stayId] = { stay: stayId, capacity: capacity || 1, invitees: [], at: 'just now' };
      saveAll(a);
    } else if (capacity && a[stayId].capacity !== capacity) {
      a[stayId].capacity = capacity; saveAll(a);
    }
    return a[stayId];
  }

  /* ---- counts, derived rather than stored, so they can never drift ---- */
  function accepted(inv) { return (inv.invitees || []).filter(function (i) { return i.state === 'accepted'; }); }
  function open(inv)     { return (inv.invitees || []).filter(function (i) { return i.state === 'sent'; }); }
  function slotsLeft(inv){ return Math.max(0, inv.capacity - accepted(inv).length); }
  function isFull(inv)   { return slotsLeft(inv) === 0; }
  /* more people asked than there are beds: the creator is entitled to know */
  function isCompetitive(inv) { return open(inv).length + accepted(inv).length > inv.capacity; }

  /* Called after every acceptance. The moment the last slot goes, everyone still
     holding an open invitation is moved to 'filled' — a real state with a real
     message, not silence and not an expiry nobody sees. */
  function closeIfFull(inv) {
    if (!isFull(inv)) return inv;
    inv.invitees.forEach(function (i) {
      if (i.state === 'sent') { i.state = 'filled'; i.at = 'just now'; }
    });
    return inv;
  }

  /* ---- hotel side ---- */
  function invite(stayId, creatorIds, capacity) {
    var a = loadAll();
    var inv = a[stayId] || { stay: stayId, capacity: capacity || 1, invitees: [], at: 'just now' };
    if (capacity) inv.capacity = capacity;
    (creatorIds || []).forEach(function (cid) {
      var has = inv.invitees.filter(function (i) { return i.creator === cid; })[0];
      /* topping up: someone who declined can be asked again on a later round,
         but an open or accepted invitation is never duplicated */
      if (has && (has.state === 'sent' || has.state === 'accepted')) return;
      if (has) { has.state = 'sent'; has.at = 'just now'; return; }
      inv.invitees.push({ creator: cid, state: 'sent', at: 'just now' });
    });
    /* a top-up into a stay that is already full closes straight away */
    closeIfFull(inv);
    a[stayId] = inv; saveAll(a);
    return inv;
  }

  function cancel(stayId, creatorId) {
    var a = loadAll(), inv = a[stayId];
    if (!inv) return null;
    inv.invitees = inv.invitees.filter(function (i) { return i.creator !== creatorId; });
    a[stayId] = inv; saveAll(a);
    return inv;
  }

  /* ---- creator side ---- */
  function respond(stayId, creatorId, answer) {
    var a = loadAll(), inv = a[stayId];
    if (!inv) return null;
    var me = inv.invitees.filter(function (i) { return i.creator === creatorId; })[0];
    if (!me || me.state !== 'sent') return inv;      // filled or already answered
    if (answer === 'accept') {
      if (isFull(inv)) { me.state = 'filled'; me.at = 'just now'; }
      else { me.state = 'accepted'; me.at = 'just now'; closeIfFull(inv); }
    } else {
      /* declining ends it here. Nothing is recorded against them, and the record
         keeps no reason — a no is a no. */
      me.state = 'declined'; me.at = 'just now';
    }
    a[stayId] = inv; saveAll(a);
    return inv;
  }

  function stateFor(stayId, creatorId) {
    var inv = forStay(stayId);
    if (!inv) return null;
    var me = inv.invitees.filter(function (i) { return i.creator === creatorId; })[0];
    return me ? me.state : null;
  }
  /* every stay this creator has been asked to, in whatever state */
  function mine(creatorId) {
    return all().map(function (inv) {
      var me = (inv.invitees || []).filter(function (i) { return i.creator === creatorId; })[0];
      return me ? { inv: inv, me: me } : null;
    }).filter(Boolean);
  }

  function reset() { saveAll({}); }

  return {
    ME: ME,
    forStay: forStay, all: all, ensure: ensure, invite: invite, cancel: cancel,
    respond: respond, stateFor: stateFor, mine: mine, reset: reset,
    accepted: accepted, open: open, slotsLeft: slotsLeft,
    isFull: isFull, isCompetitive: isCompetitive
  };
})();
