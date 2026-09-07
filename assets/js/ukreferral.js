/* Ukreate — membership referrals (feature 6b). Creator side only.
   A creator's own link, shared once, paying recurring commission for as
   long as whoever signs up through it stays subscribed. Same discipline as
   ukattrib.js: one shared module, one localStorage record, a real lifecycle
   instead of a flat "earned" number, honest about pending vs actually paid.

   // PLUG-IN POINT — real referral capture. Today: ukjoin.js reads a `?ref=`
   param off the signup URL and stores it in localStorage before an account
   exists to attach it to; this module reads that on the new member's first
   `data-join`. A real backend would resolve the ref code to a creator id at
   signup time server-side and stamp it on the account record itself. */
window.UKREFER = (function () {
  var KEY = 'uk_referrals_v1';
  var RATE = 20; /* [REVIEW] commission percentage of the referred member's
                     membership fee — a founder call, not invented as final. */

  function loadAll() {
    try { return JSON.parse(localStorage.getItem(KEY) || 'null') || seed(); }
    catch (e) { return seed(); }
  }
  function saveAll(list) { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} }

  /* Seeded so the earnings dashboard has something real to show before any
     live referral has actually happened in this session — three referred
     creators at different points in the same lifecycle every booking
     commission already uses: pending, confirmed (still subscribed, paying
     each month), reversed (cancelled, nothing further accrues). */
  function seed() {
    var rows = [
      { id:'r1', name:'Priya Nair', joined:'2026-04-02', state:'active',
        months:[{m:'Apr', paid:true},{m:'May', paid:true},{m:'Jun', paid:true},{m:'Jul', paid:false}] },
      { id:'r2', name:'Omar Farouk', joined:'2026-06-14', state:'active',
        months:[{m:'Jun', paid:true},{m:'Jul', paid:false}] },
      { id:'r3', name:'Diego Morales', joined:'2026-02-20', state:'lapsed',
        months:[{m:'Feb', paid:true},{m:'Mar', paid:true},{m:'Apr', paid:true}] }
    ];
    saveAll(rows);
    return rows;
  }

  function code(me) {
    var base = (me.h || me.n || 'creator').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    return base.slice(0, 10) || 'CREATOR';
  }
  function link(me) { return 'https://ukreate.com/join/?ref=' + code(me); }

  var MEMBER_PRICE = null;
  function commissionPerMonth() {
    var p = (MEMBER_PRICE && MEMBER_PRICE.month) || 29;
    return Math.round(p * RATE) / 100;
  }
  function setPrice(p) { MEMBER_PRICE = p; }

  /* pending = joined but this month has not actually cleared yet;
     confirmed = every month that genuinely paid, still accruing if active;
     reversed = a lapsed referral's un-collectible future, not its past —
     months already paid stay counted, same as a cancelled booking keeps
     the nights that already happened. */
  function totals() {
    var rows = loadAll();
    var out = { pending:{count:0, commission:0}, confirmed:{count:0, commission:0}, referrals: rows.length };
    rows.forEach(function (r) {
      r.months.forEach(function (mo) {
        if (mo.paid) { out.confirmed.count++; out.confirmed.commission += commissionPerMonth(); }
        else { out.pending.count++; out.pending.commission += commissionPerMonth(); }
      });
    });
    out.confirmed.commission = Math.round(out.confirmed.commission * 100) / 100;
    out.pending.commission = Math.round(out.pending.commission * 100) / 100;
    return out;
  }

  /* // PLUG-IN POINT — crediting a real payment. In this demo, calling this
     manually (or on a timer) is what would advance a pending month to paid,
     the same way a real membership-billing webhook would. */
  function markPaid(referredId, month) {
    var rows = loadAll();
    var r = rows.filter(function (x) { return x.id === referredId; })[0];
    if (!r) return;
    var mo = r.months.filter(function (x) { return x.m === month; })[0];
    if (mo) mo.paid = true;
    saveAll(rows);
  }

  /* the signup-side half: ukjoin.js captures the ref code before an account
     exists to attach it to (no UKREFER on that page to call into), and this
     reads it back the moment membership actually starts (data-join,
     ukcapp.js) — the ledger a real backend would instead build from a
     `referredBy` column stamped at account creation. */
  function pendingRef() {
    try { return localStorage.getItem('uk_pending_ref'); } catch (e) { return null; }
  }
  function clearPendingRef() { try { localStorage.removeItem('uk_pending_ref'); } catch (e) {} }

  return {
    rows: loadAll, code: code, link: link, RATE: RATE,
    setPrice: setPrice, commissionPerMonth: commissionPerMonth,
    totals: totals, markPaid: markPaid,
    pendingRef: pendingRef, clearPendingRef: clearPendingRef
  };
})();
