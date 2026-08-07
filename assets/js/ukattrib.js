/* Ukreate — attribution depth: the booking lifecycle, the full tracking object,
   and the commissionable basis. One record, read by both /app/ and /creator/.

   Why this file exists separately from ukdata.js / ukcdata.js: an attributed
   booking is the one object that genuinely belongs to both sides. The hotel sees
   revenue and the creator sees commission, but they are two views of the same
   row, and if each side kept its own copy they would drift the moment a booking
   cancelled. This is loaded by both apps and is the only place a booking's state
   is written.

   The previous model treated an attributed booking as final and binary — a
   number that only ever went up. Real attribution has a lifecycle: a room can be
   booked and then cancelled, or booked and never turned up for. Commission is
   payable only once the stay has actually been consumed, never at booking. */
window.UKATTRIB = (function () {

  /* ---------------- persistence ----------------
     Seeding both apps from the same rows makes them look connected, but they are
     only identical until one of them changes something. A booking cancelled on
     the hotel side has to be gone on the creator side too, so every state change
     is written here and both apps rehydrate from it on load. */
  var KEY = 'uk_bookings_v1';
  function loadStates() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; }
  }
  function saveStates() {
    var out = { basis: BASIS.mode, states: {}, reversals: reversals };
    bookings.forEach(function (b) {
      /* only what an event can change — the rest is regenerated from the seed */
      out.states[b.id] = { state: b.state, history: b.history };
    });
    try { localStorage.setItem(KEY, JSON.stringify(out)); } catch (e) {}
  }
  function rehydrate() {
    var saved = loadStates();
    if (!saved.states) return;
    if (saved.basis && BASIS.share[saved.basis]) BASIS.mode = saved.basis;
    bookings.forEach(function (b) {
      var r = saved.states[b.id];
      if (r) { b.state = r.state; b.history = r.history || b.history; }
    });
    reversals = saved.reversals || [];
    applyBasis();
  }

  /* ---------------- the lifecycle ----------------
     Real states set by real events, not inferred from a flag. Cancelled and
     No-show are branch states: they leave the payable path and reverse whatever
     had already been counted. */
  var FLOW = ['clicked', 'booked', 'pending', 'consumed', 'approved', 'paid'];
  var REVERSING = ['cancelled', 'noshow'];

  var STATE = {
    clicked:   { t:'Clicked',   grp:'lead',      hotel:'Link clicked',        creator:'Someone clicked' },
    booked:    { t:'Booked',    grp:'pending',   hotel:'Booked, not yet stayed', creator:'Booked — not yours yet' },
    pending:   { t:'Pending',   grp:'pending',   hotel:'Awaiting the stay',   creator:'Waiting on the stay' },
    consumed:  { t:'Consumed',  grp:'confirmed', hotel:'Stayed',              creator:'They stayed' },
    approved:  { t:'Approved',  grp:'confirmed', hotel:'Confirmed by you',    creator:'Approved' },
    paid:      { t:'Paid',      grp:'confirmed', hotel:'Settled',             creator:'Paid out' },
    cancelled: { t:'Cancelled', grp:'reversed',  hotel:'Cancelled',           creator:'Cancelled' },
    noshow:    { t:'No-show',   grp:'reversed',  hotel:'No-show',             creator:'No-show' }
  };

  /* Commission is payable only once the stay has actually happened. A booking is
     not money — this is the single rule the old model was missing. */
  function isPayable(b) { return b.state === 'consumed' || b.state === 'approved' || b.state === 'paid'; }
  function isPending(b) { return b.state === 'booked' || b.state === 'pending'; }
  function isReversed(b) { return REVERSING.indexOf(b.state) > -1; }
  function grpOf(b) { return (STATE[b.state] || {}).grp || 'lead'; }

  /* ---------------- the commissionable basis ----------------
     The deck leaves open whether commission is calculated on room rate, package,
     total booking value or net revenue. The old model quietly assumed "all of
     booking value" and buried it inside a multiply. It is an input now, so the
     numbers stay honest when the real basis is confirmed.

     // PLUG-IN POINT — commissionable basis and exclusion rules.
     Replace BASIS + commissionableFor() with the confirmed contractual rules
     (blackout dates, excluded rate plans, room types, markets). The shape a real
     implementation must return is unchanged: an explicit amount per booking,
     plus a reason when a booking is not commissionable at all. */
  var BASIS = {
    mode: 'room',
    modes: [
      { k:'room',    t:'Room rate only',   n:'Room revenue, excluding extras and taxes' },
      { k:'package', t:'Room + package',   n:'Room plus anything bundled into the rate' },
      { k:'total',   t:'Total booking',    n:'Everything on the folio at time of booking' },
      { k:'net',     t:'Net revenue',      n:'Total, less taxes and non-commissionable extras' }
    ],
    /* what share of booking value each basis treats as commissionable */
    share: { room:0.78, package:0.9, total:1, net:0.84 }
  };

  /* Seeded exclusions, structural rather than cosmetic: a booking can genuinely
     be non-commissionable, and the totals respect it. */
  var EXCLUDED_RATE_PLANS = ['Staff rate', 'Group contract'];

  function commissionableFor(b) {
    if (EXCLUDED_RATE_PLANS.indexOf(b.ratePlan) > -1) {
      return { amount: 0, excluded: b.ratePlan.toLowerCase() + ' is not commissionable' };
    }
    return { amount: Math.round(b.bookingValue * (BASIS.share[BASIS.mode] || 1)), excluded: null };
  }

  function applyBasis() {
    bookings.forEach(function (b) {
      var c = commissionableFor(b);
      b.commissionableAmount = c.amount;
      b.commissionable = !c.excluded;
      b.excludedReason = c.excluded;
    });
  }
  function setBasis(mode) {
    if (!BASIS.share[mode]) return BASIS.mode;
    BASIS.mode = mode; applyBasis(); saveStates(); return BASIS.mode;
  }

  /* ---------------- seeded bookings ----------------
     Generated deterministically from the per-collaboration attribution rows the
     app already had, so the granular records and the existing summaries describe
     the same world rather than two. No Math.random: the same booking must carry
     the same state on every paint. */
  var CHANNELS = [
    { k:'ig', n:'Instagram', places:['Reel', 'Story', 'Carousel'] },
    { k:'tt', n:'TikTok',    places:['Video', 'Photo post'] },
    { k:'yt', n:'YouTube',   places:['Short', 'Long-form'] }
  ];
  var ROOMS = ['Garden suite', 'Standard king', 'Deluxe double', 'Poolside cabana'];
  /* mostly commissionable, with the occasional excluded plan — enough that the
     exclusion path is exercised by real data rather than only in theory */
  var RATE_PLANS = ['Flexible', 'Advance purchase', 'Bed & breakfast', 'Flexible',
                    'Advance purchase', 'Bed & breakfast', 'Staff rate', 'Flexible',
                    'Advance purchase', 'Bed & breakfast', 'Group contract', 'Flexible'];
  /* the mix a real 90-day window settles into: most stays happen, a few do not */
  var STATE_MIX = ['paid','approved','consumed','consumed','approved','pending','booked','consumed',
                   'cancelled','approved','consumed','paid','booked','consumed','noshow','approved',
                   'consumed','pending','approved','consumed','paid','consumed','booked','approved',
                   'consumed','cancelled','approved','consumed','paid','consumed','approved'];

  var bookings = [];

  function seed(rows) {
    bookings = [];
    var n = 0;
    rows.forEach(function (r, ri) {
      var perNights = r.nights / r.bookings;
      var perValue  = r.revenue / r.bookings;
      for (var i = 0; i < r.bookings; i++, n++) {
        var ch = CHANNELS[(ri + i) % CHANNELS.length];
        var place = ch.places[(i + ri) % ch.places.length];
        var nights = Math.max(1, Math.round(perNights + ((i % 3) - 1) * 0.5));
        var value = Math.round(perValue * (nights / Math.max(perNights, 0.5)));
        bookings.push({
          id: 'bk' + (n + 1),
          /* the tracking object the deck specifies, in full */
          creator_id: r.who,
          campaign_id: r.stay,
          content_id: 'a' + ((n % 9) + 1),
          channel: ch.k,
          channelName: ch.n,
          placement: place,
          hotel_id: 'mg',
          click_id: 'clk_' + r.code.toLowerCase().replace(/[^a-z0-9]/g, '') + '_' + (i + 1),
          collab: r.collab,
          link: r.link,
          /* the reservation side */
          reservation_id: 'RES-' + (10480 + n),
          checkIn: r.live,
          checkOut: r.live,
          roomType: ROOMS[(ri + i) % ROOMS.length],
          nights: nights,
          bookingValue: value,
          currency: 'USD',
          ratePlan: RATE_PLANS[(i * 2 + ri) % RATE_PLANS.length],
          promoCode: r.code,
          /* lifecycle */
          state: STATE_MIX[n % STATE_MIX.length],
          history: []
        });
      }
    });
    bookings.forEach(function (b) { b.history = [{ state: b.state, at: 'seeded' }]; });
    applyBasis();
    return bookings;
  }

  /* ---------------- moving a booking, and reversing one ----------------
     A reversal is a real event with its own ledger entry, not just a number that
     quietly stops being counted. The ledger is what lets a dashboard say "£X came
     out again this period" instead of showing a total that silently shrank. */
  var reversals = [];

  function setState(id, next, at) {
    var b = bookings.filter(function (x) { return x.id === id; })[0];
    if (!b || !STATE[next] || b.state === next) return null;
    var was = b.state, wasCounted = isPayable(b) || isPending(b);
    b.state = next;
    b.history.push({ state: next, at: at || 'just now' });
    if (REVERSING.indexOf(next) > -1 && wasCounted) {
      reversals.push({
        booking: b.id, from: was, to: next, at: at || 'just now',
        value: b.bookingValue, nights: b.nights,
        commission: commissionOf(b), creator_id: b.creator_id, campaign_id: b.campaign_id
      });
    }
    /* moving back onto the payable path un-reverses it */
    if (REVERSING.indexOf(was) > -1 && REVERSING.indexOf(next) === -1) {
      reversals = reversals.filter(function (r) { return r.booking !== b.id; });
    }
    saveStates();
    return b;
  }
  function advance(id, at) {
    var b = bookings.filter(function (x) { return x.id === id; })[0];
    if (!b) return null;
    var i = FLOW.indexOf(b.state);
    if (i < 0 || i === FLOW.length - 1) return b;
    return setState(id, FLOW[i + 1], at);
  }

  /* ---------------- rates ----------------
     Read from the hotel data when it is present so there is one commission model,
     not two. Falls back for the creator app, which does not load ukdata.js. */
  function rates() {
    var c = (window.UK && window.UK.COMMISSION) || { uk:4, creator:4, ota:22 };
    return c;
  }
  function commissionOf(b) {
    if (!b.commissionable) return 0;
    return Math.round(b.commissionableAmount * rates().creator / 100);
  }
  function platformFeeOf(b) {
    if (!b.commissionable) return 0;
    return Math.round(b.commissionableAmount * rates().uk / 100);
  }

  /* ---------------- totals that reconcile ----------------
     Every figure is derived from the states, so confirmed + pending + reversed
     always equals the whole. Nothing is stored twice. */
  function empty() {
    return { count:0, nights:0, value:0, commissionable:0, commission:0, fee:0 };
  }
  function add(t, b) {
    t.count += 1; t.nights += b.nights; t.value += b.bookingValue;
    t.commissionable += b.commissionableAmount;
    t.commission += commissionOf(b); t.fee += platformFeeOf(b);
    return t;
  }

  function totals(filter) {
    var rows = bookings.filter(filter || function () { return true; });
    var out = {
      confirmed: empty(), pending: empty(), reversed: empty(),
      clicks: 0, excluded: 0
    };
    rows.forEach(function (b) {
      if (b.state === 'clicked') { out.clicks += 1; return; }
      if (!b.commissionable) out.excluded += 1;
      if (isPayable(b))       add(out.confirmed, b);
      else if (isPending(b))  add(out.pending, b);
      else if (isReversed(b)) add(out.reversed, b);
    });
    /* gross is what was ever counted; net is what survived */
    out.gross = {
      count: out.confirmed.count + out.pending.count,
      nights: out.confirmed.nights + out.pending.nights,
      value: out.confirmed.value + out.pending.value
    };
    out.all = out.gross.count + out.reversed.count;
    out.reversalRate = out.all ? Math.round(out.reversed.count / out.all * 100) : 0;
    return out;
  }

  /* ---------------- performance ----------------
     The richer tracking object is what makes these possible: without placement
     and channel on the row, "which placement converts" is unanswerable. */
  function byKey(key, filter) {
    var map = {};
    bookings.filter(filter || function () { return true; }).forEach(function (b) {
      if (b.state === 'clicked') return;
      var k = b[key];
      if (!map[k]) map[k] = { key:k, channel:b.channel, channelName:b.channelName, placement:b.placement,
                              confirmed:empty(), pending:empty(), reversed:empty() };
      if (isPayable(b))       add(map[k].confirmed, b);
      else if (isPending(b))  add(map[k].pending, b);
      else if (isReversed(b)) add(map[k].reversed, b);
    });
    return Object.keys(map).map(function (k) { return map[k]; })
      .sort(function (a, b) { return b.confirmed.value - a.confirmed.value; });
  }
  /* genuinely computed, not a hardcoded string */
  function topPlacement(filter) {
    var rows = byKey('placement', filter).filter(function (r) { return r.confirmed.count; });
    if (!rows.length) return null;
    var top = rows[0];
    return { placement: top.placement, channelName: top.channelName,
             bookings: top.confirmed.count, value: top.confirmed.value, nights: top.confirmed.nights };
  }

  /* ROAS and effective CPA. A hosted stay is not billed in cash, so the "spend"
     a hotel actually gives up is the room it did not sell plus the commission it
     pays out — that is the honest denominator here, and it is stated rather
     than hidden.
     // PLUG-IN POINT — real cost basis. Replace roomCost with the property's own
     rate/opportunity cost once finance confirms how a comped room is valued. */
  function performance(filter, roomCost) {
    var t = totals(filter);
    var nightsGiven = roomCost && roomCost.nights ? roomCost.nights : 0;
    var rate = roomCost && roomCost.rate ? roomCost.rate : 0;
    var spend = (nightsGiven * rate) + t.confirmed.commission + t.confirmed.fee;
    return {
      spend: spend,
      revenue: t.confirmed.value,
      roas: spend ? t.confirmed.value / spend : 0,
      cpa: t.confirmed.count ? Math.round(spend / t.confirmed.count) : 0,
      nights: t.confirmed.nights
    };
  }

  /* ---------------- the seed lives here, not in either app ----------------
     Both /app/ and /creator/ must see the same bookings. When these rows lived in
     ukdata.js the creator app — which does not load it — had nothing to read, so
     the two sides would have described different worlds. This is the one copy.
     // PLUG-IN POINT — replace with the Partnerize feed. Shape per row is the
     per-campaign summary; the granular records are generated from it below. */
  var SEED_ROWS = [
    { id:'r1', collab:'x6', who:'c10', stay:'s4', code:'LEILA-MG',  link:'ukr.at/mg-leila',
      live:'18 Jul 2026', clicks:2140, impressions:47600, bookings:31, nights:74, revenue:41850, window:'90 days' },
    { id:'r2', collab:'x5', who:'c1',  stay:'s2', code:'AMARA-MG',  link:'ukr.at/mg-amara',
      live:'12 Feb 2027', clicks:1680, impressions:33800, bookings:22, nights:48, revenue:26400, window:'90 days' },
    { id:'r3', collab:'x4', who:'c6',  stay:'s2', code:'THEO-MG',   link:'ukr.at/mg-theo',
      live:'02 Feb 2027', clicks:1290, impressions:32100, bookings:14, nights:31, revenue:18900, window:'90 days' },
    { id:'r4', collab:'x3', who:'c9',  stay:'s1', code:'SOFIA-MG',  link:'ukr.at/mg-sofia',
      live:'26 Jan 2027', clicks:870,  impressions:24800, bookings:9,  nights:19, revenue:12150, window:'90 days' },
    { id:'r5', collab:'x2', who:'c5',  stay:'s1', code:'NADIA-MG',  link:'ukr.at/mg-nadia',
      live:'19 Jan 2027', clicks:640,  impressions:21200, bookings:6,  nights:13, revenue:7800,  window:'90 days' }
  ];
  /* the summary rows describe what actually survived the lifecycle */
  function summarise() {
    SEED_ROWS.forEach(function (r) {
      var t = totals(function (b) { return b.collab === r.collab; });
      r.bookings = t.confirmed.count + t.pending.count;
      r.nights   = t.confirmed.nights + t.pending.nights;
      r.revenue  = t.confirmed.value + t.pending.value;
      r.confirmed = t.confirmed; r.pendingT = t.pending; r.reversedT = t.reversed;
    });
  }
  seed(SEED_ROWS);
  rehydrate();          /* whatever either app has already changed wins over the seed */
  summarise();

  return {
    FLOW: FLOW, REVERSING: REVERSING, STATE: STATE, CHANNELS: CHANNELS,
    rows: function () { return SEED_ROWS; },
    BASIS: BASIS, setBasis: setBasis, applyBasis: applyBasis,
    seed: seed,
    all: function () { return bookings; },
    forCreator: function (id) { return function (b) { return b.creator_id === id; }; },
    forCollab:  function (id) { return function (b) { return b.collab === id; }; },
    forCampaign:function (id) { return function (b) { return b.campaign_id === id; }; },
    isPayable: isPayable, isPending: isPending, isReversed: isReversed, grpOf: grpOf,
    setState: setState, advance: advance, reload: rehydrate,
    /* the app can hand back a bigger row set once its own seed has run */
    reseed: function (rows) {
      SEED_ROWS.length = 0;
      rows.forEach(function (r) { SEED_ROWS.push(r); });
      seed(SEED_ROWS); rehydrate(); summarise();
      return SEED_ROWS;
    },
    reset: function () { try { localStorage.removeItem(KEY); } catch (e) {} },
    reversals: function () { return reversals.slice(); },
    commissionOf: commissionOf, platformFeeOf: platformFeeOf,
    totals: totals, byKey: byKey, topPlacement: topPlacement, performance: performance
  };
})();
