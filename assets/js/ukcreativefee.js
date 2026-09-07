/* Ukreate — creative fees (feature 6a/6c). Creator side only.
   The second revenue stream: cash for the work itself, distinct from a
   booking commission (which needs a guest to actually check in) and from a
   referral commission (which needs someone else's membership to renew). A
   fee is owed once the hotel has approved the delivered work — the same
   "payable" moment ukattrib.js already uses for a booking, not the moment
   a stay was merely agreed.

   No new record type duplicating D.collabs: a fee-bearing collab already
   carries everything needed (D.stay(c.stay).fee, c.contentStatus). The one
   genuinely new thing is whether it has actually been PAID OUT yet, which
   this tracks in the same small localStorage-ledger shape ukreferral.js
   uses, keyed by collab id.
   // PLUG-IN POINT — real payout status. Today a creator's own "paid" flag
   is set locally with no money having moved; a real payments processor
   would set this from a payout webhook instead. */
window.UKFEE = (function () {
  var KEY = 'uk_feepaid_v1';

  function loadPaid() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; }
  }
  function savePaid(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }

  /* every collab that is actually owed a fee, whatever state it is in */
  function rows(D) {
    return (D.collabs || []).map(function (c) {
      var s = D.stay(c.stay);
      if (!s || !s.fee || !s.collabType || s.collabType === 'Hosted stay') return null;
      var paidMap = loadPaid();
      var state = c.contentStatus === 'published' || c.contentStatus === 'approved'
        ? (paidMap[c.id] ? 'paid' : 'approved')
        : 'pending';
      return { collab:c.id, stay:s.id, hotel:s.hotel, collabType:s.collabType, fee:s.fee, state:state };
    }).filter(Boolean);
  }

  function totals(D) {
    var out = { pending:{count:0, fee:0}, approved:{count:0, fee:0}, paid:{count:0, fee:0} };
    rows(D).forEach(function (r) { out[r.state].count++; out[r.state].fee += r.fee; });
    return out;
  }

  function markPaid(collabId) {
    var o = loadPaid(); o[collabId] = true; savePaid(o);
  }

  return { rows: rows, totals: totals, markPaid: markPaid };
})();
