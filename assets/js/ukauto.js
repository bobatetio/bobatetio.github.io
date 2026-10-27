/* Ukreate — auto mode. Hotel side.

   WHAT IT IS. The hotel connects Cloudbeds once and sets a handful of limits.
   From then on we watch their calendar, list the rooms that are going to sit
   empty as creator stays, match creators, and book each confirmed creator into
   Cloudbeds as a creator stay, so they are on the hotel's own arrivals list. The hotel's job is to welcome them at the desk.
   They spend an empty room, never cash: there is no budget anywhere in here.

   THE TWO RULES IT IS HELD TO.
   Assistant, not director: every limit is the hotel's, every automatic action can
   be taken back or questioned from the activity log, and anything outside the
   limits comes to the hotel as a question rather than being decided for them.
   Real states, not inferred: connection and mode are records, not guesses. Nothing
   advances on a timer. The Cloudbeds connection is whatever the connection
   service (cloudbeds/server.mjs, via ukcloudbeds.js) reports.

   ONE SOURCE. Every screen reads model(), which is built from one list of stays,
   one list of listings and one list of exceptions. Nights filled, stays
   confirmed, posts made and commission paid are all sums over the same records,
   so they cannot disagree between screens.

   // PLUG-IN POINT — the Cloudbeds calendar. calendar() and forward() stand in
   for the availability the Cloudbeds service already reads (GET /calendar, from
   programme; state.conn stands in for the connection record. Replace those two
   seams and the screens do not change. */
window.UKAUTO = (function () {
  var D = window.UK;
  var KEY = 'uk_auto_v1';
  /* the same demo clock as ukdata.js, so every date here agrees with the app */
  var NOW = '2027-03-20';

  /* ---------------- dates ---------------- */
  var MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var MONL = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var WK = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  function dt(iso) { var p = iso.slice(0, 10).split('-'); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); }
  function iso(d) { return d.toISOString().slice(0, 10); }
  function add(isoS, n) { var d = dt(isoS); d.setUTCDate(d.getUTCDate() + n); return iso(d); }
  function diff(a, b) { return Math.round((dt(b) - dt(a)) / 86400000); }
  function day(isoS, wd) { var d = dt(isoS); return (wd ? WK[d.getUTCDay()] + ' ' : '') + d.getUTCDate() + ' ' + MON[d.getUTCMonth()]; }
  /* "23-25 Mar", or "30 Mar-1 Apr" across a month: one line, no dashes of the long kind */
  function range(from, n) {
    var a = dt(from), b = dt(add(from, n));
    if (a.getUTCMonth() === b.getUTCMonth()) return a.getUTCDate() + '-' + b.getUTCDate() + ' ' + MON[b.getUTCMonth()];
    return a.getUTCDate() + ' ' + MON[a.getUTCMonth()] + '-' + b.getUTCDate() + ' ' + MON[b.getUTCMonth()];
  }
  function clock(stamp) {
    var t = (stamp.split('T')[1] || '09:00').split(':'), h = +t[0], m = t[1];
    return (h % 12 || 12) + ':' + m + ' ' + (h < 12 ? 'AM' : 'PM');
  }
  function when(stamp) { return day(stamp) + ', ' + clock(stamp); }
  /* user actions happen "now": the demo date, at the real time of day */
  function later(stamp, mins) {
    var d = new Date(Date.UTC(+stamp.slice(0, 4), +stamp.slice(5, 7) - 1, +stamp.slice(8, 10),
      +stamp.slice(11, 13), +stamp.slice(14, 16) + mins));
    return d.toISOString().slice(0, 16);
  }
  function nowStamp() {
    var d = new Date();
    return NOW + 'T' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
  }
  function money(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
  function num(n) { return Math.round(n).toLocaleString('en-US'); }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : (many || one + 's')); }

  /* ---------------- the property's rooms ----------------
     Room types and rates as Cloudbeds reports them. The rate is the hotel's own
     usual rate, which is what the cost view prices a creator stay at. */
  var ROOMS = [
    { k:'garden', n:'Garden suite',     rate:420, count:12, f:1.00 },
    { k:'king',   n:'Deluxe king',      rate:310, count:30, f:1.02 },
    { k:'ocean',  n:'Ocean view suite', rate:560, count:8,  f:1.03 },
    { k:'villa',  n:'Spa villa',        rate:890, count:4,  f:0.90 }
  ];
  var ROOM = {}; ROOMS.forEach(function (r) { ROOM[r.k] = r; });

  var STANDARDS = [
    { k:'r40', n:'Rated 4.0 and up', min:4.0 },
    { k:'r45', n:'Rated 4.5 and up', min:4.5 },
    { k:'r48', n:'Rated 4.8 and up', min:4.8 }
  ];
  function standard(k) { return STANDARDS.filter(function (s) { return s.k === k; })[0] || STANDARDS[1]; }
  /* measured, not modelled: how many creators on Ukreate meet it today */
  function meeting(k) {
    var min = standard(k).min;
    return D.creators.filter(function (c) { return (c.rating || 0) >= min; }).length;
  }

  /* ---------------- calendar ----------------
     // PLUG-IN POINT — Cloudbeds availability (getRatePlans, detailed rates). For every night and room type:
     e, how many rooms went unsold, and late[d], how many were sold d days before
     the night. From those two, "unsold k days out" is e plus the late sales inside
     k days, which is exactly what we would have seen on the day we decided. */
  function rng(seed) {
    var h = 1779033703 ^ seed.length;
    for (var i = 0; i < seed.length; i++) { h = Math.imul(h ^ seed.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; }
    return function () {
      h = Math.imul(h ^ h >>> 16, 2246822507); h = Math.imul(h ^ h >>> 13, 3266489909);
      return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
  }
  var MF = [0.84, 0.93, 0.99, 0.95, 0.9, 0.93, 0.97, 0.96, 0.86, 0.88, 0.9, 0.96];
  var CAL = {};
  function night(isoS, rk, full) {
    var key = isoS + rk + (full ? 'f' : '');
    if (CAL[key]) return CAL[key];
    var r = rng(key), room = ROOM[rk], d = dt(isoS), wd = d.getUTCDay(), m = d.getUTCMonth();
    var base = wd === 5 || wd === 6 ? 0.95 : wd === 0 ? 0.7 : 0.74;
    var holiday = (m === 11 && d.getUTCDate() >= 20) || (m === 0 && d.getUTCDate() <= 2);
    var occ = full ? 0.995 : Math.min(1, (holiday ? 0.99 : base * MF[m] * room.f) + (r() - 0.5) * 0.12);
    var sold = Math.min(room.count, Math.max(0, Math.round(room.count * occ)));
    var late = []; for (var i = 0; i < 60; i++) late.push(0);
    var L = Math.round(sold * (0.34 + r() * 0.1));
    for (var j = 0; j < L; j++) { late[Math.min(59, Math.floor(-Math.log(1 - r()) * 11))]++; }
    return (CAL[key] = { e: room.count - sold, late: late });
  }
  function unsoldAt(n, k) { var u = n.e; for (var i = 0; i < k && i < 60; i++) u += n.late[i]; return u; }
  var HIST_FROM = '2026-12-01', HIST_TO = '2027-03-19';
  /* the average late sales our own rule allows for, per room type and weekend or not */
  var EXP = {};
  function expLate(rk, weekend, k) {
    var key = rk + weekend + k;
    if (EXP[key] != null) return EXP[key];
    var sum = 0, cnt = 0;
    for (var x = HIST_FROM; x <= HIST_TO; x = add(x, 1)) {
      var wd = dt(x).getUTCDay(), we = wd === 5 || wd === 6;
      if (we !== weekend) continue;
      var n = night(x, rk), s = 0;
      for (var i = 0; i < k && i < 60; i++) s += n.late[i];
      sum += s; cnt++;
    }
    return (EXP[key] = cnt ? sum / cnt : 0);
  }
  /* THE LISTING RULE, stated once and used by both the preview and the live
     listings: of the rooms still unsold k days out, we only offer the ones beyond
     what your own history says you normally sell from that point. The last rooms
     that could still sell are never touched. */
  function listable(isoS, rk, k, full) {
    var n = night(isoS, rk, full), wd = dt(isoS).getUTCDay();
    return Math.max(0, unsoldAt(n, k) - Math.ceil(expLate(rk, wd === 5 || wd === 6, k)));
  }
  /* blackout ranges are dated for the year ahead; the preview applies them to the
     same days a year earlier, and says so */
  function blacked(isoS, bos, shiftYear) {
    return (bos || []).some(function (b) {
      var f = b.from, t = b.to;
      if (shiftYear) { f = (+f.slice(0, 4) - 1) + f.slice(4); t = (+t.slice(0, 4) - 1) + t.slice(4); }
      return isoS >= f && isoS <= t;
    });
  }

  /* ---------------- the preview ----------------
     Replays the listing rule over the last three full months. "Went empty" is
     read straight off the calendar: measured. "Would have filled" assumes
     creators applied for every room we offered: an estimate, and labelled one. */
  var STAY_N = 2;
  function preview(set) {
    var months = ['2026-12', '2027-01', '2027-02'];
    return months.map(function (mk) {
      var from = mk + '-01', to = add(add(from, 32).slice(0, 7) + '-01', -1);
      var went = 0, stays = 0, filled = 0, sold = 0;
      var left = {};
      for (var x = from; x <= to; x = add(x, 1)) {
        ROOMS.forEach(function (r) {
          if (!set.rooms[r.k] || blacked(x, set.blackouts, true)) return;
          went += night(x, r.k).e;
        });
      }
      for (var y = from; y <= to && stays < set.max; y = add(y, 1)) {
        var y2 = add(y, 1);
        for (var ri = 0; ri < ROOMS.length; ri++) {
          var rk = ROOMS[ri].k;
          if (!set.rooms[rk] || blacked(y, set.blackouts, true) || blacked(y2, set.blackouts, true)) continue;
          var ka = rk + y, kb = rk + y2;
          if (left[ka] == null) left[ka] = listable(y, rk, set.ahead);
          if (left[kb] == null) left[kb] = listable(y2, rk, set.ahead);
          if (left[ka] < 1 || left[kb] < 1) continue;
          left[ka]--; left[kb]--; stays++;
          [y, y2].forEach(function (z) {
            var ek = 'e' + rk + z;
            if (left[ek] == null) left[ek] = night(z, rk).e;
            if (left[ek] > 0) { left[ek]--; filled++; } else sold++;
          });
          break;
        }
      }
      return { m: MONL[+mk.slice(5) - 1], went: went, stays: stays, filled: filled, sold: sold };
    });
  }

  /* The basis for the one estimate on the results page: of the rooms that were
     still unsold k days out last winter, the share that then went empty.
     Measured off the calendar; applying it to creator stays is the estimate. */
  function emptyShare(set) {
    var went = 0, open = 0;
    for (var x = HIST_FROM; x <= HIST_TO; x = add(x, 1)) {
      ROOMS.forEach(function (r) {
        if (!set.rooms[r.k]) return;
        var n = night(x, r.k); went += n.e; open += unsoldAt(n, set.close);
      });
    }
    return open ? went / open : 0;
  }

  /* ---------------- live listings, from the calendar ahead ----------------
     What turning auto mode on actually lists: the same rule, applied to the
     nights inside the release window, up to the monthly limit. */
  function forward(set, full, taken) {
    var out = [], perMonth = {};
    (taken || []).forEach(function (s) { var m = s.from.slice(0, 7); perMonth[m] = (perMonth[m] || 0) + 1; });
    var start = add(NOW, set.close), end = add(NOW, set.ahead);
    for (var x = start; x < end; x = add(x, 1)) {
      var x2 = add(x, 1), m = x.slice(0, 7);
      if ((perMonth[m] || 0) >= set.max) continue;
      /* start each search at the next room type along, so offers spread across
         rooms instead of always landing on the first type that qualifies */
      for (var rj = 0; rj < ROOMS.length; rj++) {
        var rk = ROOMS[(rj + out.length) % ROOMS.length].k;
        if (!set.rooms[rk] || blacked(x, set.blackouts) || blacked(x2, set.blackouts)) continue;
        if (listable(x, rk, diff(NOW, x), full) < 1 || listable(x2, rk, diff(NOW, x2), full) < 1) continue;
        out.push({ id:'F' + rk + x, room:rk, from:x, n:STAY_N, listedAt:null, apps:0, fresh:true });
        perMonth[m] = (perMonth[m] || 0) + 1;
        x = x2;   /* the next offer starts after this one ends, so they do not stack */
        break;
      }
    }
    return out;
  }

  /* ---------------- the running record ----------------
     A property that turned auto mode on on 12 January. Eleven stays are done,
     four are confirmed, three rooms are on offer. Posts carry their own views and
     clicks; bookings are split into guests who have stayed and guests still to
     come, and commission is only ever paid on the first. */
  var STAYS = [
    { id:'as1',  cr:'c2',  room:'garden', from:'2027-01-18', n:2, listedAt:'2027-01-12T07:40', matchedAt:'2027-01-14T10:12', apps:3,
      make:'1 Reel, 5 photos', posts:[[38400,512],[21900,288]], bk:{ stayed:[2,1680], pending:[0,0] }, deliveredAt:'2027-01-23T18:05' },
    { id:'as2',  cr:'c9',  room:'king',   from:'2027-01-21', n:2, listedAt:'2027-01-12T07:41', matchedAt:'2027-01-15T09:30', apps:4,
      make:'1 Reel, 1 Story set', posts:[[44100,601],[12800,149]], bk:{ stayed:[1,930], pending:[0,0] }, deliveredAt:'2027-01-26T12:40' },
    { id:'as3',  cr:'c13', room:'ocean',  from:'2027-01-26', n:2, listedAt:'2027-01-13T07:35', matchedAt:'2027-01-18T15:02', apps:2,
      make:'1 Reel, 5 photos', posts:[[29700,377],[18300,214]], bk:{ stayed:[1,1120], pending:[0,0] }, deliveredAt:'2027-02-01T09:15' },
    { id:'as4',  cr:'c6',  room:'garden', from:'2027-02-02', n:2, listedAt:'2027-01-19T07:38', matchedAt:'2027-01-22T11:47', apps:7,
      make:'2 Reels, 6 photos', posts:[[96200,1412],[40300,522]], bk:{ stayed:[4,3610], pending:[0,0] }, deliveredAt:'2027-02-07T16:20' },
    { id:'as5',  cr:'c16', room:'king',   from:'2027-02-09', n:2, listedAt:'2027-02-03T14:21', matchedAt:'2027-02-04T08:55', apps:5,
      make:'1 Reel, 1 Story set', posts:[[33500,410],[15200,176]], bk:{ stayed:[1,620], pending:[0,0] }, deliveredAt:'2027-02-14T19:02' },
    { id:'as6',  cr:'c3',  room:'ocean',  from:'2027-02-15', n:3, listedAt:'2027-01-31T07:44', matchedAt:'2027-02-05T13:10', apps:4,
      make:'2 Reels, 5 photos', posts:[[52800,733],[27400,301]], bk:{ stayed:[2,2240], pending:[0,0] }, deliveredAt:'2027-02-22T10:31' },
    { id:'as7',  cr:'c19', room:'king',   from:'2027-02-22', n:2, listedAt:'2027-02-06T07:36', matchedAt:'2027-02-10T17:25', apps:6,
      make:'1 Reel, 5 photos', posts:[[61900,845],[22600,268]], bk:{ stayed:[2,1490], pending:[1,780] }, deliveredAt:'2027-02-27T14:48' },
    { id:'as8',  cr:'c5',  room:'garden', from:'2027-02-24', n:2, listedAt:'2027-02-09T07:42', matchedAt:'2027-02-12T12:03', apps:3,
      make:'1 Reel, 1 Story set', posts:[[24800,296],[11700,131]], bk:{ stayed:[0,0], pending:[1,840] }, deliveredAt:'2027-03-01T11:20' },
    { id:'as9',  cr:'c22', room:'king',   from:'2027-03-02', n:2, listedAt:'2027-02-14T07:39', matchedAt:'2027-02-18T10:44', apps:8,
      make:'2 Reels, 6 photos', posts:[[71300,1004],[30900,377]], bk:{ stayed:[1,760], pending:[2,1520] }, deliveredAt:'2027-03-07T15:05' },
    { id:'as10', cr:'c8',  room:'ocean',  from:'2027-03-08', n:3, listedAt:'2027-02-20T07:33', matchedAt:'2027-02-24T16:18', apps:5,
      make:'2 Reels, 8 photos', posts:[[88600,1236],[35100,463]], bk:{ stayed:[0,0], pending:[3,3360] }, deliveredAt:'2027-03-14T13:12' },
    { id:'as11', cr:'c7',  room:'garden', from:'2027-03-15', n:2, listedAt:'2027-02-27T07:45', matchedAt:'2027-03-03T09:58', apps:4,
      make:'1 Reel, 5 photos', posts:[[19400,252],[9800,117]], bk:{ stayed:[0,0], pending:[0,0] }, deliveredAt:'2027-03-19T18:40' },

    { id:'as12', cr:'c10', room:'garden', from:'2027-03-23', n:2, listedAt:'2027-03-02T07:40', matchedAt:'2027-03-06T11:22', apps:6, guests:2,
      make:'1 Reel, 1 Story set, 6 photos',
      desk:['Arriving around 3pm by car and needs a parking space.',
            'Travelling with one other person.',
            'Wants to film the pool before 9am on Wednesday, so let the pool team know.'] },
    { id:'as13', cr:'c4',  room:'king',   from:'2027-03-25', n:2, listedAt:'2027-03-04T08:05', matchedAt:'2027-03-09T15:47', apps:9, guests:1,
      make:'2 Reels, 8 photos',
      desk:['Late arrival after 10pm, so keep the room ready for night check-in.',
            'Vegetarian. Breakfast will be part of the content.'] },
    { id:'as14', cr:'c1',  room:'ocean',  from:'2027-04-02', n:2, listedAt:'2027-03-08T07:31', matchedAt:'2027-03-12T10:04', apps:4, guests:1,
      make:'1 Reel, 5 photos',
      desk:['Arriving by taxi around noon and may ask to leave bags early.'] },
    { id:'as15', cr:'c25', room:'king',   from:'2027-04-06', n:2, listedAt:'2027-03-10T07:52', matchedAt:'2027-03-15T16:30', apps:3, guests:1,
      make:'1 Reel, 1 Story set',
      desk:['First stay with you. Travelling alone.'] }
  ];
  var LISTINGS = [
    { id:'L1', room:'garden', from:'2027-03-29', n:2, listedAt:'2027-03-18T07:36', apps:5 },
    { id:'L2', room:'king',   from:'2027-04-01', n:2, listedAt:'2027-03-17T07:44', apps:2 },
    { id:'L3', room:'king',   from:'2027-04-14', n:2, listedAt:'2027-03-19T07:29', apps:0 }
  ];
  /* a cancellation from February, already handled, that the log still shows */
  var OLD_CANCEL = { cr:'c11', room:'king', from:'2027-02-09', n:2, at:'2027-02-03T14:20', relistedAt:'2027-02-03T14:21' };
  var CONNECTED_AT = '2027-01-09T16:12', ON_AT = '2027-01-12T07:30';

  /* only genuine exceptions reach the hotel */
  var QUEUE = [
    { id:'q1', k:'dates', stay:'as15', to:'2027-04-07', at:'2027-03-19T18:12',
      t:function (m) { var s = m.stay('as15'), c = D.creator(s.cr);
        return c.n + ' wants to move ' + range(s.from, s.n) + ' to ' + range('2027-04-07', s.n) + '. Flight changed.'; },
      rec:'Move it',
      why:function () { return 'A Deluxe king is free on 8 Apr'; },
      acts:[['move','Move to 7-9 Apr'],['keep','Keep 6-8 Apr']] },
    { id:'q2', k:'limits', cr:'c9', room:'villa', from:'2027-04-16', n:2, at:'2027-03-20T08:03',
      t:function () { return 'Sofia Marchetti asked for a Spa villa, 16-18 Apr.'; },
      rec:'Decline',
      why:function () { return 'Spa villas are outside your limits'; },
      acts:[['decline','Decline'],['allow','Allow this once']] }
  ];
  var FLAG = { id:'q3', k:'flag', cr:'c28', listing:'L1', alt:'c13', at:'2027-03-20T07:58',
    t:function () { return 'Elif Demir gained 41,000 followers in six days. Held back from Garden suite, 29-31 Mar.'; },
    rec:'Match Aiko Tanaka instead',
    why:function () { return 'Often bought followers. Aiko is rated 4.7'; },
    acts:[['alt','Match Aiko instead'],['keep','Match Elif anyway']] };

  /* ---------------- limits ---------------- */
  var DEF_SET = {
    max: 6,
    rooms: { garden:true, king:true, ocean:true, villa:false },
    blackouts: [
      { from:'2027-12-02', to:'2027-12-06', n:'Art Basel week' },
      { from:'2027-12-22', to:'2028-01-02', n:'Christmas and New Year' }
    ],
    ahead: 45, close: 5, std: 'r45'
  };
  function copy(o) { return JSON.parse(JSON.stringify(o)); }

  /* ---------------- state ----------------
     conn:  none | requested | live | dropped
     mode:  off | on | paused     (off means it has never been turned on)
     scn:   which demo scenario the base records come from */
  var SCN = {
    none:      { conn:'none',      mode:'off' },
    requested: { conn:'requested', mode:'off', reqAt:'2027-03-20T09:30', req:{ who:'Maria Lopez', how:'maria.lopez@miragrace.com', note:'In the office on weekdays until 5pm.' } },
    off:       { conn:'live',      mode:'off', connAt:'2027-03-20T10:02' },
    full:      { conn:'live',      mode:'on',  connAt:'2027-03-16T11:20', onAt:'2027-03-16T11:34', full:true },
    running:   { conn:'live',      mode:'on',  connAt:CONNECTED_AT, onAt:ON_AT, base:true },
    cancelled: { conn:'live',      mode:'on',  connAt:CONNECTED_AT, onAt:ON_AT, base:true, cancel:true },
    dropped:   { conn:'dropped',   mode:'on',  connAt:CONNECTED_AT, onAt:ON_AT, base:true, droppedAt:'2027-03-19T23:40' },
    paused:    { conn:'live',      mode:'paused', connAt:CONNECTED_AT, onAt:ON_AT, base:true, pausedAt:'2027-03-19T16:02' }
  };
  function fresh(k) {
    var p = copy(SCN[k] || SCN.none);
    p.scn = SCN[k] ? k : 'none';
    p.set = copy(DEF_SET);
    p.decided = {}; p.taken = {}; p.cancelled = {}; p.contest = {}; p.user = []; p.undone = {};
    /* Claude or ChatGPT: off until the hotel turns it on, and read-only unless
       they say otherwise. The connector enforces this, not just the screen. */
    p.assist = { on:false, level:'read', app:null, lastAt:null };
    p.rev = 0;
    return p;
  }
  function load() {
    try {
      var q = new URLSearchParams(location.search).get('auto');
      if (q && SCN[q]) { var f = fresh(q); save(f); return f; }
      var v = JSON.parse(localStorage.getItem(KEY));
      if (v && v.scn === 'pending') { v.scn = 'none'; v.conn = 'none'; }
      if (v && v.scn) { if (!v.undone) v.undone = {}; if (!v.assist) v.assist = { on:false, level:'read' }; return v; }
    } catch (e) {}
    return fresh(window.UKAUTO_DEFAULT || 'none');
  }
  var onSave = null, seenRev = 0;
  function save(s) {
    var v = s || S;
    /* above anything seen from the connector, so a save here never lands on
       the same number as a change made over there and silently replaces it */
    v.rev = Math.max(v.rev || 0, seenRev) + 1;
    try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {}
    if (onSave) try { onSave(v); } catch (e) {}
  }
  /* adopt a newer copy, from the browser or from the connector */
  function replace(v) {
    if (!v || !v.scn) return false;
    ['undone','assist'].forEach(function (k) { if (!v[k]) v[k] = k === 'assist' ? { on:false, level:'read' } : {}; });
    S = v; try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {}
    return true;
  }
  function reload() { S = load(); return S; }
  var S = load();
  /* the demo's first-time account has not connected anything either */
  if (window.UKDEMO && window.UKDEMO.isNew() && S.scn !== 'none' && !/[?&]auto=/.test(location.search)) S = fresh('none');

  function scenario(k) {
    var keep = S.assist, rev = S.rev || 0;
    S = fresh(k); S.assist = keep || S.assist; S.rev = rev; save();
  }
  function reset() { try { localStorage.removeItem(KEY); } catch (e) {} S = fresh('none'); }
  /* who is acting: null for the person at the screen, or the assistant's name
     when the connector is calling. Every entry it writes carries that name. */
  var ACTOR = null;
  function as(name) { ACTOR = name || null; }
  function log(t, extra) {
    S.user.push(Object.assign({ id:'u' + Date.now() + S.user.length, at:nowStamp(), t:t, kind:'you' },
      ACTOR ? { via:ACTOR } : {}, extra || {}));
  }

  /* ---------------- the model every screen reads ---------------- */
  function model() {
    var set = S.set;
    var stays = S.base ? copy(STAYS) : [];
    var listings = S.base ? copy(LISTINGS) : [];
    var queue = S.base ? QUEUE.slice() : [];
    var events = [];

    if (S.cancel) {
      stays.forEach(function (s) { if (s.id === 'as14') { s.cancelledAt = '2027-03-20T09:12'; s.byCreator = true; } });
      listings.push({ id:'L4', room:'ocean', from:'2027-04-02', n:2, listedAt:'2027-03-20T09:13', apps:0, relist:'as14' });
      queue.push(FLAG);
    }
    /* turned on from scratch in this session: the calendar ahead decides */
    if (S.fwd) listings = listings.concat(S.fwd);

    /* the hotel's answers to the queue change the records they are about */
    queue = queue.filter(function (q) {
      var a = S.decided[q.id];
      if (!a) return true;
      if (q.k === 'dates' && a.v === 'move') stays.forEach(function (s) { if (s.id === q.stay) { s.movedFrom = s.from; s.from = q.to; } });
      if (q.k === 'limits' && a.v === 'allow') stays.push({ id:'as16', cr:q.cr, room:q.room, from:q.from, n:q.n,
        listedAt:null, matchedAt:a.at, apps:1, guests:1, make:'1 Reel, 5 photos', exception:true,
        desk:['Asked for a Spa villa. You made an exception for this stay.'] });
      if (q.k === 'flag') {
        listings = listings.filter(function (l) { return l.id !== q.listing; });
        var L = LISTINGS.filter(function (l) { return l.id === q.listing; })[0];
        stays.push({ id:'as17', cr:a.v === 'alt' ? q.alt : q.cr, room:L.room, from:L.from, n:L.n, listedAt:L.listedAt,
          matchedAt:a.at, apps:L.apps, guests:1, make:'1 Reel, 5 photos', desk:['Matched after you reviewed the profile.'] });
      }
      return false;
    });

    /* things the hotel took back */
    listings = listings.filter(function (l) { return !S.taken[l.id]; });
    stays.forEach(function (s) { if (S.cancelled[s.id]) { s.cancelledAt = S.cancelled[s.id]; s.byHotel = true; } });

    var live = S.conn === 'live' && S.mode === 'on';
    listings.forEach(function (l) {
      l.state = S.mode === 'paused' ? 'down' : S.conn === 'dropped' ? 'hidden' : 'open';
    });

    var done = [], coming = [], gone = [];
    stays.forEach(function (s) {
      if (s.cancelledAt) gone.push(s);
      else if (add(s.from, s.n) <= NOW) done.push(s);
      else coming.push(s);
    });
    coming.sort(function (a, b) { return a.from < b.from ? -1 : 1; });
    var week = coming.filter(function (s) { return diff(NOW, s.from) <= 7; });

    /* sums, over the same records, for every screen */
    var nights = done.reduce(function (a, s) { return a + s.n; }, 0);
    var posts = [], views = 0, clicks = 0;
    done.forEach(function (s, i) {
      (s.posts || []).forEach(function (p, j) {
        posts.push({ stay:s, views:p[0], clicks:p[1], asset:D.assets[(10 + posts.length) % D.assets.length] });
        views += p[0]; clicks += p[1];
      });
    });
    var bStayed = 0, rStayed = 0, bPend = 0, rPend = 0;
    done.forEach(function (s) {
      bStayed += s.bk.stayed[0]; rStayed += s.bk.stayed[1];
      bPend += s.bk.pending[0]; rPend += s.bk.pending[1];
    });
    var given = done.reduce(function (a, s) { return a + s.n * ROOM[s.room].rate; }, 0);
    var rate = (D.COMMISSION && D.COMMISSION.creator || 4) / 100;
    var paid = done.filter(function (s) { return s.bk.stayed[0] > 0; }).map(function (s) {
      return { stay:s, amt:Math.round(s.bk.stayed[1] * rate), b:s.bk.stayed[0], at:add(add(s.from, s.n), 30) + 'T09:00' };
    }).filter(function (p) { return p.at.slice(0, 10) <= NOW; });
    var paidSum = paid.reduce(function (a, p) { return a + p.amt; }, 0);

    var m = {
      set:set, live:live, stays:stays, done:done, coming:coming, week:week, gone:gone,
      listings:listings, open:listings.filter(function (l) { return l.state === 'open'; }),
      queue:queue, nights:nights, posts:posts, views:views, clicks:clicks,
      bStayed:bStayed, rStayed:rStayed, bPend:bPend, rPend:rPend, given:given, paid:paid, paidSum:paidSum,
      stay:function (id) { return stays.filter(function (s) { return s.id === id; })[0]; }
    };
    m.log = activity(m);
    return m;
  }

  /* ---------------- the activity log ----------------
     Built from the same records, in the words a person would use. Each entry
     says what it can be answered with: take it back while that still means
     something, otherwise question it. */
  function activity(m) {
    var out = [];
    function push(at, t, kind, ref, act) { var e = { id:kind + ':' + ref + ':' + at, at:at, t:t, kind:kind, ref:ref, act:act }; out.push(e); return e; }
    if (S.connAt) push(S.connAt, 'Cloudbeds connected.', 'conn', 'c', null);
    if (S.onAt) push(S.onAt, S.base ? 'Robert Torres turned on auto mode.' : 'Auto mode was turned on.', 'you', 'on', null);
    if (S.base) {
      push(OLD_CANCEL.at, D.creator(OLD_CANCEL.cr).n + ' cancelled, ' + range(OLD_CANCEL.from, OLD_CANCEL.n) + '.', 'cancel', 'old', null);
      push(OLD_CANCEL.relistedAt, 'Cancelled it in Cloudbeds and offered the nights again.', 'list', 'old', null);
    }
    m.stays.forEach(function (s) {
      var c = D.creator(s.cr), r = ROOM[s.room].n, dates = range(s.from, s.n);
      var upcoming = !s.cancelledAt && add(s.from, s.n) > NOW;
      if (s.listedAt) push(s.listedAt, 'Listed ' + r + ', ' + dates + '. Unsold ' + diff(s.listedAt, s.from) + ' days out.', 'list', s.id, null);
      if (s.matchedAt) {
        push(s.matchedAt, s.exception ? 'Confirmed ' + c.n + ', ' + r + ', ' + dates + '. Your exception.'
          : 'Matched ' + c.n + ', ' + dates + '. Rated ' + c.rating + ', ' + plural(s.apps, 'applicant') + '.', 'match', s.id,
          upcoming ? { k:'cancel', l:'Cancel this stay' } : null);
        push(later(s.matchedAt, 1),
          'Booked ' + c.n + ' into Cloudbeds as a creator stay, ' + r + ', ' + dates + '.', 'close', s.id, null);
      }
      if (s.cancelledAt) {
        var by = S.cancelBy && S.cancelBy[s.id];
        var ce = push(s.cancelledAt, s.byHotel ? (by || 'You') + ' cancelled ' + c.n + ', ' + dates + '.' :
          c.n + ' cancelled, ' + dates + '.', 'cancel', s.id, null);
        if (by) ce.via = by;
        push(later(s.cancelledAt, 1),
          'Cancelled the creator stay in Cloudbeds, ' + dates + '. The room can sell again.', 'list', s.id + 'r', null);
      }
      if (s.deliveredAt) push(s.deliveredAt, c.n + ' delivered ' + plural(s.posts.length, 'post') + '.', 'content', s.id, null);
    });
    m.paid.forEach(function (p) {
      var c = D.creator(p.stay.cr);
      push(p.at, 'Paid ' + c.n + ' ' + money(p.amt) + ' on ' + plural(p.b, 'booking') + '. Guests had stayed.', 'pay', p.stay.id, { k:'contest', l:'Question this' });
    });
    m.listings.forEach(function (l) {
      if (!l.listedAt) return;
      push(l.listedAt, 'Listed ' + ROOM[l.room].n + ', ' + range(l.from, l.n) + '. Unsold ' +
        diff(l.listedAt, l.from) + ' days out.', 'list', l.id, l.state === 'open' ? { k:'take', l:'Take back' } : null);
    });
    /* only the seeded demo pause is derived; a pause made here is in S.user */
    if (S.pausedAt && S.pausedAt === (SCN[S.scn] || {}).pausedAt) push(S.pausedAt, 'Robert Torres paused auto mode.', 'you', 'pause', null);
    if (S.droppedAt) push(S.droppedAt, 'Cloudbeds connection lost. Listing stopped.', 'conn', 'drop', null);
    /* real drive saves join the log, on the demo clock at the real time of day */
    var DL = typeof window !== 'undefined' && window.UKDELIVERY;
    if (DL && DL.state().up) DL.state().deliveries.forEach(function (d) {
      if (d.status === 'sending') return;
      var t = new Date(d.doneAt || d.at), at = NOW + 'T' + ('0' + t.getHours()).slice(-2) + ':' + ('0' + t.getMinutes()).slice(-2);
      var pv = DL.state().providers.filter(function (x) { return x.k === d.provider; })[0] || { name:d.provider };
      var ok = d.files.filter(function (x) { return x.ok && !x.skipped; }).length;
      if (!ok && d.status === 'delivered') return;   /* nothing new: already there */
      push(at, d.status === 'delivered' ? 'Saved ' + plural(ok, 'file') + ' from ' + (d.title || '').split(',')[0] + ' to ' + pv.name + '.'
        : 'Could not save everything from ' + (d.title || '').split(',')[0] + ' to ' + pv.name + '.', 'content', 'dlv' + d.id, null);
    });
    S.user.forEach(function (u, i) {
      var e = Object.assign({}, u);
      e.seq = i + 1;   /* things done in the same minute keep the order they happened in */
      e.t = (e.via || 'You') + ' ' + e.t.charAt(0).toLowerCase() + e.t.slice(1);
      if (e.undo) e.act = S.undone[e.id] ? null : { k:'undo', l:'Undo' };
      if (S.undone[e.id]) e.undoneAt = S.undone[e.id];
      out.push(e);
    });
    out.forEach(function (e) {
      if (S.contest[e.id]) e.contested = S.contest[e.id];
      if (!e.act && e.kind !== 'you' && e.kind !== 'conn' && !e.contested) e.act = { k:'contest', l:'Question this' };
    });
    out.sort(function (a, b) { return a.at < b.at ? 1 : a.at > b.at ? -1 : (b.seq || 0) - (a.seq || 0); });
    return out;
  }

  /* ---------------- actions ---------------- */
  function turnOn() {
    S.mode = 'on'; S.onAt = S.onAt || nowStamp();
    if (S.pausedAt) { delete S.pausedAt; log('Turned auto mode back on.', { undo:{ k:'pause' } }); }
    else if (!S.base) {
      S.fwd = forward(S.set, S.full, []).map(function (l) { l.listedAt = nowStamp(); return l; });
      log('Turned on auto mode.');
    }
    save();
  }
  function pause() {
    var m = model();
    S.mode = 'paused'; S.pausedAt = nowStamp();
    log('Paused auto mode. ' + plural(m.open.length, 'offer') + ' taken down.', { undo:{ k:'resume' } });
    save();
  }
  function decide(qid, v) {
    var q = QUEUE.concat([FLAG]).filter(function (x) { return x.id === qid; })[0];
    if (!q) return;
    var m = model();
    S.decided[qid] = { v:v, at:nowStamp() };
    var t = '';
    if (q.k === 'dates') {
      var s = m.stay(q.stay), c = D.creator(s.cr);
      t = v === 'move' ? 'Moved ' + c.n + ' to ' + range(q.to, s.n) + '.'
        : 'Kept ' + c.n + ' on ' + range(s.from, s.n) + '.';
    }
    if (q.k === 'limits') t = v === 'allow' ? 'Allowed Sofia Marchetti a Spa villa, 16-18 Apr.'
      : 'Declined Sofia Marchetti\u2019s Spa villa request.';
    if (q.k === 'flag') t = v === 'alt' ? 'Matched Aiko Tanaka, 29-31 Mar.'
      : 'Matched Elif Demir, 29-31 Mar.';
    log(t);
    save();
  }
  function takeBack(lid) {
    var l = model().listings.filter(function (x) { return x.id === lid; })[0];
    if (!l) return;
    S.taken[lid] = nowStamp();
    log('Took back ' + ROOM[l.room].n + ', ' + range(l.from, l.n) + '.', { undo:{ k:'untake', id:lid } });
    save();
  }
  function cancelStay(sid) {
    var s = model().stay(sid);
    if (!s) return;
    S.cancelled[sid] = nowStamp();
    if (ACTOR) { S.cancelBy = S.cancelBy || {}; S.cancelBy[sid] = ACTOR; }
    save();
  }
  function contest(eid, note) {
    S.contest[eid] = { at:nowStamp(), note:note };
    log('Questioned an entry.', { ref:eid });
    save();
  }
  function request(req) {
    S.conn = 'requested'; S.reqAt = nowStamp(); S.req = req; save();
  }
  /* connected, or reconnected after it was lost: the Cloudbeds approval came back */
  function confirm() {
    S.conn = 'live'; S.connAt = nowStamp();
    if (S.droppedAt) { delete S.droppedAt; log('Reconnected Cloudbeds. Listing again.'); }
    save();
  }
  function disconnect() {
    S.conn = 'none'; S.mode = 'off'; S.base = false; S.fwd = null;
    ['connAt','onAt','pausedAt','droppedAt','acceptedAt','reqAt'].forEach(function (k) { delete S[k]; });
    save();
  }
  var LIM_N = { max:'Stays a month', rooms:'Room types', blackouts:'Blackout dates', ahead:'Offer from', close:'Offer until', std:'Who can stay' };
  function setLimit(k, v) {
    var prev = copy(S.set[k]);
    S.set[k] = v;
    /* a change at the screen is saved silently as it is made; one made through
       Claude or ChatGPT is written down, with the old value kept for undo */
    if (ACTOR) log('Changed ' + LIM_N[k].toLowerCase() + ' to ' + limText(k, v) + '.', { undo:{ k:'limit', key:k, prev:prev } });
    save();
  }
  function limText(k, v) {
    if (k === 'rooms') return ROOMS.filter(function (r) { return v[r.k]; }).map(function (r) { return r.n; }).join(', ') || 'none';
    if (k === 'blackouts') return plural(v.length, 'range');
    if (k === 'std') return standard(v).n;
    if (k === 'ahead') return v + ' days ahead';
    if (k === 'close') return v + ' days before';
    return String(v);
  }
  function untake(lid) { delete S.taken[lid]; }
  /* the inverse of an action, where one exists */
  function undo(id) {
    var e = S.user.filter(function (u) { return u.id === id; })[0];
    if (!e || !e.undo || S.undone[id]) return false;
    var u = e.undo;
    if (u.k === 'resume') { S.mode = 'on'; delete S.pausedAt; }
    if (u.k === 'pause') { S.mode = 'paused'; S.pausedAt = nowStamp(); }
    if (u.k === 'untake') untake(u.id);
    if (u.k === 'limit') S.set[u.key] = u.prev;
    S.undone[id] = nowStamp();
    log('Undid: ' + e.t.charAt(0).toLowerCase() + e.t.slice(1));
    save();
    return true;
  }
  function setAssist(patch) { S.assist = Object.assign({}, S.assist || {}, patch); save(); }
  function hook(fn) { onSave = fn; }

  /* ---------------- the local connector ----------------
     When the Claude / ChatGPT connector is running on this computer it keeps the
     one copy of this state (mcp/state.json) and serves it on localhost:4398.
     The app sends every save there and picks up the connector's changes. This is
     reading real state, not a timer standing in for events: if nothing changed
     over there, nothing changes here.
     // PLUG-IN POINT — in production both sides read the property's record
     from the API and this bridge goes away. */
  var BRIDGE = 'http://localhost:4398/state', bridge = 'unknown', onChange = null;
  function bridgeUp() { return bridge === 'up'; }
  function push(v) {
    if (typeof fetch !== 'function' || bridge !== 'up') return;
    fetch(BRIDGE, { method:'PUT', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify(v) }).catch(function () {});
  }
  function pull() {
    if (typeof fetch !== 'function' || typeof document === 'undefined' || !document.querySelector('[data-ukapp]')) return Promise.resolve();
    return fetch(BRIDGE, { cache:'no-store' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (remote) {
      var was = bridge; bridge = 'up';
      if (remote && remote.rev) seenRev = Math.max(seenRev, remote.rev);
      if (remote && remote.scn && (remote.rev || 0) > (S.rev || 0)) { replace(remote); if (onChange) onChange(); }
      else if (!remote || (S.rev || 0) > (remote.rev || 0)) push(S);
      if (was !== 'up' && onChange) onChange();
    }).catch(function () {
      var was = bridge; bridge = 'down';
      if (was === 'up' && onChange) onChange();
    });
  }
  /* a static demo (window.UKD_STATIC) has no connector on this computer to talk to */
  if (typeof window !== 'undefined' && !window.UKD_STATIC && window.fetch && typeof document !== 'undefined' && document.querySelector && document.querySelector('[data-ukapp]')) {
    onSave = push;
    /* quick while the connector answers, so the page hears Claude within
       seconds; a slow check otherwise, so a computer without it is left alone */
    /* the next check is timed from the answer to this one, not from asking it */
    var tick = function () { pull().then(function () { setTimeout(tick, bridge === 'up' ? 3000 : 30000); }); };
    tick();
    document.addEventListener('visibilitychange', function () { if (!document.hidden) pull(); });
  }
  function watch(fn) { onChange = fn; }

  return {
    bridgeUp:bridgeUp, watch:watch,
    NOW:NOW, ROOMS:ROOMS, ROOM:ROOM, STANDARDS:STANDARDS, STAY_N:STAY_N, SCN:SCN,
    state:function () { return S; }, save:save, scenario:scenario, reset:reset, replace:replace, reload:reload, hook:hook,
    as:as, undo:undo, setAssist:setAssist, LIM_N:LIM_N,
    model:model, preview:preview, forward:forward, emptyShare:emptyShare, meeting:meeting, standard:standard,
    turnOn:turnOn, pause:pause, decide:decide, takeBack:takeBack, cancelStay:cancelStay, contest:contest,
    request:request, confirm:confirm, disconnect:disconnect, setLimit:setLimit, log:log,
    fmt:{ day:day, range:range, when:when, clock:clock, money:money, num:num, plural:plural, add:add, diff:diff, MONL:MONL, now:nowStamp }
  };
})();
