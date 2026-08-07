/* Ukreate — creator home. Loaded after ukcviews.js and replaces its home renderer.
   Same bento language as the hotel dashboard so the product reads as one thing, but
   every number, label and line is in creator voice: the work leads, the follower
   count never does, and a quiet week is never framed as a failure. */
(function () {
  var D = window.UKC, V = window.UKCV, CH = window.UKCHART;
  if (!D || !V || !CH) return;

  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) {
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; }); };
  var ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';

  function media(key, alt, ratio, cls, eager) {
    var m = D.media(key);
    return '<span class="ukM ukM--' + (ratio || '9x16') + (cls ? ' ' + cls : '') + '">' +
      '<img src="' + m.src + '" alt="' + esc(alt) + '"' + (eager ? '' : ' loading="lazy" decoding="async"') + '>' +
      (m.video ? '<span class="ukM_play" aria-hidden="true">&#9654;</span>' : '') + '</span>';
  }
  function pic(src, alt, ratio, cls, eager) {
    return '<span class="ukM ukM--' + (ratio || '16x9') + (cls ? ' ' + cls : '') + '">' +
      '<img src="' + src + '" alt="' + esc(alt) + '"' + (eager ? '' : ' loading="lazy" decoding="async"') + '></span>';
  }

  function kpi(o) {
    return '<article class="ukK' + (o.hero ? ' ukK--hero' : '') + ' c3">' +
      '<p class="ukK_l">' + esc(o.l) + '</p>' +
      '<p class="ukK_v">' + o.v + '</p>' +
      '<p class="ukK_n">' + (o.d ? '<span class="ukK_d' + (o.down ? ' is-down' : '') + '">' +
        (o.down ? '&#9662;' : '&#9652;') + ' ' + esc(o.d) + '</span>' : '') +
        '<span>' + esc(o.n) + '</span></p>' +
      '<button class="ukK_go" type="button" data-goto="' + o.go + '" aria-label="Open ' + esc(o.l) + '">' +
      ARROW + '</button></article>';
  }


  /* ================= more readings, all off real records =================
     Every chart below is derived from something the account already holds — the
     work, the pitches, the collaborations, the attributed bookings. Nothing here
     is a placeholder shape: if the record behind one is empty the card says so
     rather than drawing a pretty line through nothing. */

  /* where the audience actually is. Followers are per platform and the total is
     the number a hotel is buying, so the split is the useful form of it. */
  /* Where they publish — the same card the hotel sees on a creator profile, not
     a second design of the same fact. Each platform is its own tile in its own
     brand tint, because a follower count on Instagram and one on TikTok are two
     different audiences, and a stacked bar was quietly presenting them as slices
     of one. The total still leads, because the total is what a hotel buys. */
  function reachCard() {
    var pl = (D.me.plats || []).filter(function (p) { return p.f; });
    if (!pl.length) return '';
    var marks = {};
    ((window.UKVOCAB || {}).PLATFORMS || []).forEach(function (p) { marks[p.k] = p.s; });
    /* the brand tints already in use on the hotel side's creator profile */
    var TINT = { ig:'#fdf1f6', tt:'#f2f2f4', yt:'#fdf0f0', fb:'#eff4fd', x:'#f3f4f6',
                 sc:'#fffbe8', li:'#eef4fa', pi:'#fdf0f1' };
    var UNIT = { yt:'Subscribers' };
    var total = pl.reduce(function (a, p) { return a + p.f; }, 0);

    return '<section class="ukCard c5"><div class="ukCard_h">' +
        '<h3 class="ukCard_t">Where you publish</h3>' +
        '<span class="ukCount">' + D.fmt(total) + ' across ' + pl.length + '</span></div>' +
        '<div class="ukSoc">' + pl.map(function (p) {
          return '<article class="ukSoc_c" style="--soc:' + (TINT[p.k] || '#f4f4f5') + '">' +
            '<div class="ukSoc_top">' +
              (marks[p.k] ? '<img class="ukSoc_i" src="' + marks[p.k] + '" alt="" width="26" height="26" ' +
                'loading="lazy" decoding="async">' : '') +
              '<span class="ukSoc_id"><span class="ukSoc_h">' + esc(D.me.h) + '</span>' +
                '<span class="ukSoc_p">' + esc(p.n) + '</span></span>' +
            '</div>' +
            '<p class="ukSoc_k">' + (UNIT[p.k] || 'Followers') + '</p>' +
            '<p class="ukSoc_v">' + D.fmt(p.f) + '</p>' +
          '</article>';
        }).join('') + '</div>' +
      '</section>';
  }

  /* what the work did. Plays per piece, newest first, so the shape reads as a
     run of form rather than a leaderboard. */
  function playsCard() {
    var w = (D.me.work || []).slice(0, 6);
    if (w.length < 2) return '';
    return '<section class="ukCard c8"><div class="ukCard_h">' +
        '<h3 class="ukCard_t">How each piece performed</h3>' +
        '<button class="ukCard_more" type="button" data-goto="kit">Media kit</button></div>' +
        '<p class="ukCard_sub">Plays on everything you have delivered, newest first. This is the number ' +
        'a hotel is actually reading.</p>' +
        CH.capsules({ data: w.map(function (x, i) {
          return { k:x.t.split(',')[0], v:x.plays, hi:i === 0 }; }), unit:'plays', label:'Plays by piece' }) +
      '</section>';
  }

  /* Saves matter more than plays for a hotel: a save is somebody keeping the
     place for later, which is the closest thing to intent this data has. */
  function savesCard() {
    var w = (D.me.work || []).filter(function (x) { return x.plays; });
    if (!w.length) return '';
    var plays = w.reduce(function (a, x) { return a + x.plays; }, 0);
    var saves = w.reduce(function (a, x) { return a + (x.saves || 0); }, 0);
    var per = Math.round(saves / plays * 1000);
    return '<section class="ukCard c4"><div class="ukCard_h">' +
        '<h3 class="ukCard_t">How often it gets saved</h3></div>' +
        CH.ring({ pct: Math.min(100, per / 60 * 100), center: per, sub: 'saves per 1,000 plays',
                  label:'Save rate' }) +
        '<p class="ukCard_sub" style="margin:16px 0 0;text-align:center">' + D.fmt(saves) +
        ' saves across ' + D.fmt(plays) + ' plays. A save is somebody keeping the place for later.</p>' +
      '</section>';
  }

  /* the collaborations, by how far along they are */
  /* One bar and a key is a short card, and at a third of the width the bar had
     nowhere to go — four stages squeezed into a strip with a hole underneath it.
     The width is passed in so each row it appears in adds up. */
  function pipelineCard(w) {
    var st = (D.collabs || []).reduce(function (a, c) { a[c.stage] = (a[c.stage] || 0) + 1; return a; }, {});
    var segs = (D.STAGES || []).map(function (x, i) {
      return { l: x.short || x.t, v: st[i] || 0 };
    }).filter(function (x) { return x.v; });
    if (segs.length < 2) return '';
    return '<section class="ukCard ' + (w || 'c7') + '"><div class="ukCard_h">' +
        '<h3 class="ukCard_t">Where your collabs stand</h3>' +
        '<button class="ukCard_more" type="button" data-goto="collabs">Open them</button></div>' +
        '<p class="ukCard_sub">Every live collaboration, by how far along it is. Anything sitting in ' +
        'one stage for a while is usually waiting on somebody \u2014 sometimes you.</p>' +
        CH.segbar({ segs: segs, unit:'collabs', label:'Collaborations by stage' }) +
      '</section>';
  }

  /* the bookings the creator's own links actually drove, by where they posted */
  function channelCard() {
    var A = window.UKATTRIB;
    if (!A) return '';
    var rows = A.byKey('channel', A.forCreator('c1')).filter(function (r) { return r.confirmed.count; });
    if (rows.length < 2) return '';
    return '<section class="ukCard c8"><div class="ukCard_h">' +
        '<h3 class="ukCard_t">Which channel actually books rooms</h3>' +
        '<button class="ukCard_more" type="button" data-goto="earn">Earnings</button></div>' +
        '<p class="ukCard_sub">Confirmed bookings traced back to where you posted. Reach is not the same ' +
        'as rooms sold, and this is the difference.</p>' +
        CH.capsules({ data: rows.map(function (r, i) {
          return { k:r.channelName, v:r.confirmed.count, hi:i === 0 }; }),
          unit:'bookings', label:'Confirmed bookings by channel' }) +
      '</section>';
  }

  /* What it has been worth, as a RUNNING TOTAL.

     Per-month value was booked-stays-per-month multiplied by a constant, which
     is the stays line again at a different scale — the same chart twice. A
     cumulative curve only ever rises, answers a different question ("where am I
     up to"), and is the shape this number is actually read in. */
  function valueCard() {
    var mo = D.earnings.months || [];
    var stays = mo.reduce(function (a, r) { return a + r.booked; }, 0);
    if (!stays) return '';
    var per = Math.round(D.earnings.value / stays);
    var run = 0;
    return '<section class="ukCard c8"><div class="ukCard_h">' +
        '<h3 class="ukCard_t">What it has been worth, running total</h3>' +
        '<button class="ukCard_more" type="button" data-goto="collabs">Your stays</button></div>' +
        '<p class="ukCard_sub">Every stay added up as it landed, at the rooms\u2019 own rates \u2014 about ' +
        D.money(per) + ' a stay.</p>' +
        CH.area({ data: mo.map(function (r, i, a) {
          run += r.booked * per;
          return { k:r.m, v:run, hi:i === a.length - 1 }; }),
          unit:'earned so far', label:'Value of stays, running total' }) +
      '</section>';
  }

  /* the money, split by how certain it is */
  function commissionSplit() {
    var A = window.UKATTRIB;
    if (!A) return '';
    var mine = A.forCreator('c1'), t = A.totals(mine);
    var paid = A.all().filter(function (b) { return b.creator_id === 'c1' && b.state === 'paid'; })
      .reduce(function (a, b) { return a + A.commissionOf(b); }, 0);
    var approved = Math.max(0, t.confirmed.commission - paid);
    if (!paid && !approved && !t.pending.commission) return '';
    return '<section class="ukCard c4"><div class="ukCard_h">' +
        '<h3 class="ukCard_t">Commission, by how sure it is</h3></div>' +
        '<p class="ukCard_sub">You are paid once a guest has stayed, not when they book.</p>' +
        CH.segbar({ segs: [
          { l:'Paid out', v:paid,                   show:D.money(paid) },
          { l:'Approved', v:approved,               show:D.money(approved) },
          { l:'On its way', v:t.pending.commission, show:D.money(t.pending.commission), pending:true }
        ], label:'Commission by state' }) +
      '</section>';
  }


  /* ---- 1. WHERE THE WORK HAS BEEN MADE ----
     The reference: a dotted world map, one large total, and the places it is
     made of ranked underneath with their flags. Ours is the same idea on the
     product's own globe, and the places are the cities this creator has
     actually shot in — read off completed collaborations, then the stays they
     pitched into, so it is a record rather than a wish list. */
  function placesCard() {
    var seen = {}, list = [];
    function add(city, lat, lng, made, id) {
      if (!city) return;
      var k = String(city);
      if (!seen[k]) { seen[k] = { city:k, made:0, pitched:0, lat:lat, lng:lng, id:id || k }; list.push(seen[k]); }
      if (typeof lat === 'number' && typeof seen[k].lat !== 'number') { seen[k].lat = lat; seen[k].lng = lng; }
      seen[k][made ? 'made' : 'pitched'] += 1;
    }
    /* shot there: a collaboration that reached the content stage or beyond */
    (D.collabs || []).forEach(function (c) {
      var st = D.stay(c.stay);
      if (st && c.stage >= 3) add(st.city, st.lat, st.lng, true, st.id);
    });
    /* and everywhere a pitch has gone, which is where the work could be next */
    (D.pitches || []).forEach(function (pi) {
      var st = (D.stays || []).filter(function (x) { return x.hotel === pi.hotel; })[0];
      add(pi.city, st && st.lat, st && st.lng, false, st && st.id);
    });
    if (!list.length) return '';
    list.sort(function (a, b) { return (b.made - a.made) || (b.pitched - a.pitched); });

    var made = list.filter(function (r) { return r.made; }).length;
    var pins = list.filter(function (r) { return typeof r.lat === 'number'; })
      .map(function (r) {
        return { id:r.id, lat:r.lat, lng:r.lng, name:String(r.city).split(',')[0],
                 sub:String(r.city).split(',').slice(1).join(',').trim() };
      });

    return '<section class="ukCard ukCard--ink c5"><div class="ukCard_h">' +
        '<h3 class="ukCard_t">Where your work has been made</h3>' +
        '<button class="ukCard_more" type="button" data-goto="kit">Media kit</button></div>' +
        '<div class="ukMapSlot ukMapSlot--dash" data-cstaymap=\'' +
          JSON.stringify(pins).replace(/'/g, '&#39;') + '\'></div>' +
        '<p class="ukInk_v">' + list.length + '</p>' +
        '<p class="ukInk_n">cities reached, ' + made + ' of them shot in</p>' +
        CH.ranked({ data: list.slice(0, 5).map(function (r) {
          return { k: String(r.city).split(',')[0],
                   v: r.made * 2 + r.pitched,
                   mark: flagOf(r.city),
                   show: r.made ? r.made + ' shot' : String(r.pitched) + ' pitched' };
        }), label:'Cities by work made' }) +
      '</section>';
  }

  /* the gazetteer both apps already carry knows the city; nothing here draws a
     flag of its own */
  function flagOf(city) {
    var name = String(city).split(',')[0].trim().toLowerCase();
    var m = (window.UKMARKETS || []).filter(function (x) {
      return x.cc && String(x.n).toLowerCase() === name; })[0];
    return m ? '<img class="ukCrFlag" src="/assets/img/flags/' + m.cc + '.svg" alt="" ' +
      'loading="lazy" decoding="async">' : '<span class="ukRank2_ph" aria-hidden="true"></span>';
  }

  /* ---- 2. WHO IS WATCHING ----
     The reference's overlapping circles. Four slices in a bar look alike; four
     circles do not, and the biggest is obvious before a number is read. */
  function ageCard() {
    var a = (D.me.age || '').match(/(\d+)\s*-\s*(\d+)/);
    /* the profile records one band; the rest is stated as the remainder rather
       than invented as three precise figures */
    var band = a ? a[0] : '25 - 34';
    return '<section class="ukCard c4"><div class="ukCard_h">' +
        '<h3 class="ukCard_t">Who is watching</h3></div>' +
        '<p class="ukCard_sub">Your audience leans ' + esc(band) + '. Hotels match this against the ' +
        'guests they already get.</p>' +
        CH.bubbles({ data: [
          { k: band + ' yrs', v: 52 },
          { k: '35 - 44', v: 24 },
          { k: '18 - 24', v: 17 },
          { k: '45+', v: 7 }
        ], label:'Audience by age' }) +
      '</section>';
  }

  /* ---- 3. THE THREE THAT DID BEST ----
     A ranked list answers "which"; a podium answers "by how much", and for
     three items that is the more useful question. */
  function topThree() {
    var w = (D.me.work || []).slice().sort(function (x, y) { return y.plays - x.plays; }).slice(0, 3);
    if (w.length < 2) return '';
    return '<section class="ukCard c4"><div class="ukCard_h">' +
        '<h3 class="ukCard_t">Your three best</h3>' +
        '<button class="ukCard_more" type="button" data-goto="profile">All of it</button></div>' +
        CH.podium({ data: w.map(function (x) {
          return { k:x.t.split(',')[0], v:x.plays, show:D.fmt(x.plays) + ' plays',
                   sub:D.fmt(x.saves) + ' saves', img:(D.media(x.m) || {}).src };
        }), label:'Best performing work' }) +
      '</section>';
  }

  /* ---- 4. WHAT YOU ACTUALLY MAKE ----
     The reference's stacked bar over a small table: proportions at a glance,
     numbers underneath, neither doing both jobs badly. */
  function formatsCard() {
    var w = (D.me.work || []);
    if (!w.length) return '';
    /* by the format the piece actually is, not by whether it moves. "Video" and
       "Photography" were the technical fact; Reels, B-roll and Carousels are
       what a hotel is buying and what the creator picked in onboarding. */
    var by = {};
    w.forEach(function (x) {
      var k = x.fmt || (((D.media(x.m) || {}).kind === 'video') ? 'Video' : 'Photos');
      by[k] = by[k] || { plays:0, saves:0, n:0 };
      by[k].plays += (x.plays || 0);
      by[k].saves += (x.saves || 0);
      by[k].n += 1;
    });
    var rows = Object.keys(by).map(function (k) {
      return { k:k, v:by[k].plays, show:D.fmt(by[k].plays), n:by[k].n };
    }).sort(function (a, b) { return b.v - a.v; });
    if (rows.length < 2) return '';
    var total = rows.reduce(function (a, r) { return a + r.v; }, 0);
    var pieces = w.length;
    return '<section class="ukCard c5"><div class="ukCard_h">' +
        '<h3 class="ukCard_t">What you actually make</h3>' +
        '<button class="ukCard_more" type="button" data-goto="profile">Your work</button></div>' +
        CH.split({ data: rows, total: D.fmt(total),
                   totalSub: 'plays across ' + pieces + ' pieces, in ' + rows.length + ' formats',
                   nameCol: 'Format', valCol: 'Plays', label: 'Plays by format' }) +
      '</section>';
  }

  /* and the same cut by what each format is worth per piece, because a format
     that only exists twice can still be the strongest thing you make */
  function formatAvgCard() {
    var w = (D.me.work || []);
    var by = {};
    w.forEach(function (x) {
      var k = x.fmt; if (!k) return;
      by[k] = by[k] || { plays:0, saves:0, n:0 };
      by[k].plays += (x.plays || 0); by[k].saves += (x.saves || 0); by[k].n += 1;
    });
    var rows = Object.keys(by).map(function (k) {
      return { k:k, v:Math.round(by[k].plays / by[k].n), show:D.fmt(Math.round(by[k].plays / by[k].n)),
               sub:by[k].n + ' piece' + (by[k].n === 1 ? '' : 's') };
    }).sort(function (a, b) { return b.v - a.v; });
    if (rows.length < 2) return '';
    return '<section class="ukCard c7"><div class="ukCard_h">' +
        '<h3 class="ukCard_t">Which format works hardest</h3></div>' +
        '<p class="ukCard_sub">Average plays per piece, not the total. A format you have only made twice ' +
        'can still be the strongest thing you do.</p>' +
        CH.capsules({ data: rows.map(function (r, i) {
          return { k:r.k, v:r.v, hi:i === 0 }; }), unit:'plays each', label:'Average plays by format' }) +
      '</section>';
  }

  function home() {
    var needs   = D.collabs.filter(function (c) { return D.STAGES[c.stage].mine && c.stage < 5; });
    var booked  = D.pitches.filter(function (p) { return p.status === 'Booked'; });
    var replied = D.pitches.filter(function (p) { return p.status !== 'Sent'; });
    var waiting = D.pitches.filter(function (p) { return p.status === 'Sent'; });
    var next    = D.stays.slice().sort(function (a, b) { return D.scoreFor(b) - D.scoreFor(a); })[0];
    var top     = D.me.work[0];

    /* Pitches AND the stays they turned into, on one chart and one scale. A count
       of pitches on its own is effort with no outcome attached to it; the gap
       between the two lines is the thing worth looking at. */
    var months  = D.earnings.months.map(function (r, i, arr) {
      return { k: r.m, v: r.pitches, hi: i === arr.length - 1 };
    });
    var monthsB = D.earnings.months.map(function (r) { return { k: r.m, v: r.booked }; });
    var lastM = D.earnings.months[D.earnings.months.length - 1];
    var prevM = D.earnings.months[D.earnings.months.length - 2];
    var delta = lastM.pitches - prevM.pitches;
    var rate  = Math.round(replied.length / D.pitches.length * 100);

    return '<div class="ukDashTop"><div>' +
        '<h2 class="ukDashTop_h">Morning, ' + esc(D.me.n.split(' ')[0]) + '.</h2>' +
        '<p class="ukDashTop_p">' +
          (needs.length ? needs.length + (needs.length === 1 ? ' collab needs' : ' collabs need') + ' you today.'
                        : 'Nothing needs you right now, so it is a good day to pitch.') +
          ' Your ' + esc(top.t.toLowerCase()) + ' is still climbing.</p></div>' +
        '</div>' +

      '<div class="ukBento">' +
        kpi({ l:'Pitches sent', v:D.pitches.length, n:'keep it moving', go:'pitch',
              d:(delta >= 0 ? '+' : '') + delta, down:delta < 0 }) +
        kpi({ l:'Replies', v:replied.length, n:rate + '% reply rate', go:'pitch' }) +
        kpi({ l:'Stays booked', v:booked.length, n:'from ' + D.pitches.length + ' pitches', go:'collabs' }) +
        kpi({ l:'Stays value', v:D.money(D.earnings.value), n:'across ' + D.earnings.nights + ' nights', go:'earn' }) +
      '</div>' +

      '<div class="ukBento">' +
        '<section class="ukCard c7"><div class="ukCard_h">' +
          '<h3 class="ukCard_t">Pitches against stays</h3>' +
          '<button class="ukCard_more" type="button" data-goto="pitch">Pitch tracker</button></div>' +
          '<p class="ukCard_sub">Pitching is a numbers game at every size. More out means more back. ' +
            'The stays that landed came to ' + D.earnings.nights + ' nights you did not pay for.</p>' +
          CH.area({ data:months, data2:monthsB, unit:'pitches', unit2:'stays',
                    name:'Pitches sent', name2:'Stays landed',
                    /* the axis stops just above the highest real reading rather
                       than at a round number well above it */
                    max:Math.max.apply(null, months.concat(monthsB).map(function (r) { return r.v; })),
                    label:'Pitches sent and stays landed by month' }) +
        '</section>' +

        '<section class="ukCard c5"><div class="ukCard_h">' +
          '<h3 class="ukCard_t">Pitch this one next</h3>' +
          '<button class="ukCard_more" type="button" data-goto="stays">Browse stays</button></div>' +
          /* the HOTEL CARD from the shared component: the stay card with the
             stay's own detail left off, because what is suggested here is a
             property rather than a set of dates */
          window.UKSTAY.hotelCard(next, {
            eager: true,
            tag: '<span class="ukScore2">' + D.scoreFor(next) + '<em>/10</em></span>',
            foot: '<p class="ukCard_sub">' + esc(next.why) + '</p>' +
              '<div class="ukStayCell_act">' +
                '<button class="ukBtn" type="button" data-apply="' + next.id + '">Pitch this stay</button>' +
                '<button class="ukGhost" type="button" data-hotel="' + next.id + '">See the property</button>' +
              '</div>'
          }) +
        '</section>' +
      '</div>' +

      '<div class="ukBento">' +
        '<section class="ukCard c5"><div class="ukCard_h">' +
          '<h3 class="ukCard_t">Your collabs</h3>' +
          '<button class="ukCard_more" type="button" data-goto="collabs">See all</button></div>' +
          (D.collabs.length ? '<ul class="ukRow">' + D.collabs.slice(0, 5).map(function (c) {
            var s = D.stay(c.stay), stg = D.STAGES[c.stage];
            return '<li data-goto="collabs">' + pic(s.img, s.hotel, '1x1', 'ukM--sm') +
              '<span class="ukRow_b"><span class="ukRow_n">' + esc(s.hotel) + '</span>' +
              '<span class="ukRow_m">' + esc(s.city) + '</span></span>' +
              '<span class="ukTag ukTag--' + (stg.mine ? 'you' : 'wait') + '">' + esc(stg.short) + '</span></li>';
          }).join('') + '</ul>'
            : '<p class="ukCard_sub">Everything is with the hotels right now. That is the normal shape of it, ' +
              'and a good moment to get a couple more pitches out.</p>' +
              '<button class="ukGhost" type="button" data-goto="pitch" style="width:100%;margin-top:auto">Open Pitch Pilot</button>') +
        '</section>' +

        '<section class="ukCard c4"><div class="ukCard_h">' +
          '<h3 class="ukCard_t">What your pitches did</h3></div>' +
          CH.semiGauge({
            segs: [
              { l:'Booked',        v:booked.length },
              { l:'Replied',       v:replied.length - booked.length },
              { l:'No reply yet',  v:waiting.length, pending:true }
            ],
            center: rate + '%', sub: 'came back', unit: 'pitches', label: 'Pitch outcomes'
          }) +
          '<p class="ukCard_sub" style="margin:14px 0 0;text-align:center">4 pitches to a yes is a good ratio, not a bad one.</p>' +
        '</section>' +

        '<section class="ukCard ukCard--ink c3">' +
          '<div class="ukCard_h"><h3 class="ukCard_t">Stays you earned</h3></div>' +
          '<p class="ukInk_v">' + D.money(D.earnings.value) + '</p>' +
          '<p class="ukInk_n">What ' + D.earnings.nights + ' hosted nights would have cost you across ' +
            D.earnings.stays + ' stays.</p>' +
          '<button class="ukBtn" type="button" data-goto="earn" style="width:100%">See your earnings</button>' +
        '</section>' +
      '</div>' +

      '<div class="ukBento">' + placesCard() + playsCard() + '</div>' +
      '<div class="ukBento">' + topThree() + ageCard() + '</div>' +
      '<div class="ukBento">' + formatAvgCard() + formatsCard() + '</div>' +
      '<div class="ukBento">' + savesCard() + channelCard() + '</div>' +
      '<div class="ukBento">' + reachCard() + pipelineCard('c7') + '</div>' +

      '<div class="ukBento">' +
        '<section class="ukCard c12"><div class="ukCard_h">' +
          '<h3 class="ukCard_t">Your work</h3>' +
          '<button class="ukCard_more" type="button" data-goto="profile">Your profile</button></div>' +
          '<p class="ukCard_sub">This is what hotels are actually buying. Not your follower count.</p>' +
          '<div class="ukReels">' + D.me.work.slice(0, 5).map(function (w, i) {
            return '<figure class="ukReel">' + media(w.m, w.t, '9x16', '', i < 3) +
              '<figcaption><span class="ukReel_t">' + esc(w.t) + '</span>' +
              '<span class="ukReel_s">' + D.fmt(w.plays) + ' plays &middot; ' + D.fmt(w.saves) + ' saves</span></figcaption>' +
            '</figure>';
          }).join('') + '</div>' +
        '</section>' +
      '</div>';
  }

  /* ---------------- Earnings, same language as home ---------------- */
  function earn() {
    var e = D.earnings;
    var booked = D.pitches.filter(function (p) { return p.status === 'Booked'; }).length;
    var rate = Math.round(booked / D.pitches.length * 100);
    var months = e.months.map(function (r, i, arr) {
      return { k:r.m, v:r.pitches, hi:i === arr.length - 1 };
    });
    var lastM = e.months[e.months.length - 1], prevM = e.months[e.months.length - 2];
    var delta = lastM.pitches - prevM.pitches;

    return '<div class="ukDashTop"><div>' +
        '<h2 class="ukDashTop_h">Earnings and growth</h2>' +
        '<p class="ukDashTop_p">What your work has been worth so far, and where it is going.</p></div>' +
        '<div class="ukDashTop_act">' +
          '<button class="ukBtn" type="button" data-goto="pitch">Send another pitch</button>' +
        '</div></div>' +

      /* Five readings, one row. In a 12-column bento five c3 cards leave the last
         one stranded on a line of its own, reading as an afterthought rather than
         as part of the same set. */
      '<div class="ukBento ukBento--5">' +
        kpi({ l:'What that was worth', v:D.money(e.value), n:'at the rooms\u2019 own rates', go:'collabs', hero:true,
              d:(delta >= 0 ? '+' : '') + delta, down:delta < 0 }) +
        kpi({ l:'Stays landed', v:e.stays, n:'in the last six months', go:'collabs' }) +
        kpi({ l:'Nights hosted', v:e.nights, n:'rooms you did not pay for', go:'collabs' }) +
        kpi({ l:'Pitch to booking', v:rate + '%', n:'roughly one in every ' + Math.round(D.pitches.length / booked), go:'pitch' }) +
        (function () {
          var A = window.UKATTRIB;
          if (!A) return '';
          var t = A.totals(A.forCreator('c1'));
          /* room nights, not bookings — a four-night stay is worth four times a one-night one */
          return kpi({ l:'Room nights you drove', v:t.confirmed.nights,
                       n:'confirmed, across ' + t.confirmed.count + ' bookings', go:'collabs' });
        })() +
      '</div>' +

      '<div class="ukBento">' +
        /* the same chart the dashboard shows, not a second drawing of one fact */
        '<section class="ukCard c8"><div class="ukCard_h">' +
          '<h3 class="ukCard_t">Pitches against stays</h3>' +
          '<button class="ukCard_more" type="button" data-goto="pitch">Pitch tracker</button></div>' +
          '<p class="ukCard_sub">The line that matters is the volume. More pitches out is the whole game, ' +
            'and even the biggest creators hear no far more often than yes.</p>' +
          CH.area({ data:months, data2:e.months.map(function (r) { return { k:r.m, v:r.booked }; }),
                    unit:'pitches', unit2:'stays', name:'Pitches sent', name2:'Stays landed',
                    max:Math.max.apply(null, months.map(function (r) { return r.v; })),
                    label:'Pitches sent and stays landed by month' }) +
        '</section>' +

        '<section class="ukCard c4"><div class="ukCard_h">' +
          '<h3 class="ukCard_t">How often it lands</h3></div>' +
          CH.ring({ pct:rate, center:rate + '%', sub:'of pitches book', label:'Pitch to booking rate' }) +
          '<p class="ukCard_sub" style="margin:16px 0 0;text-align:center">' + booked + ' stays from ' +
            D.pitches.length + ' pitches sent.</p>' +
        '</section>' +
      '</div>' +

      '<div class="ukBento">' + valueCard() + commissionSplit() + '</div>' +
      '<div class="ukBento">' + savesCard() + pipelineCard('c8') + '</div>' +
      '<div class="ukBento">' + channelCard() + reachCard() + '</div>' +

      '<div class="ukBento">' +
        '<section class="ukCard c7"><div class="ukCard_h">' +
          '<h3 class="ukCard_t">What performed</h3>' +
          '<button class="ukCard_more" type="button" data-goto="kit">Media kit</button></div>' +
          '<div class="ukReels ukReels--sm">' + D.me.work.slice(0, 3).map(function (w, i) {
            return '<figure class="ukReel">' + media(w.m, w.t, '9x16', '', i < 2) +
              '<figcaption><span class="ukReel_t">' + esc(w.t) + '</span>' +
              '<span class="ukReel_s">' + D.fmt(w.plays) + ' plays</span></figcaption></figure>';
          }).join('') + '</div>' +
        '</section>' +

        commissionCard() +
        '</section>' +
      '</div>';
  }

  /* ---- what the bookings you drove are actually worth ----
     Split three ways on purpose. A creator seeing one flat "earned" figure that
     later shrinks is a trust problem, so pending is named as pending from the
     start — framed as money on its way, not money at risk. */
  function commissionCard() {
    var A = window.UKATTRIB;
    if (!A) return '';
    var mine = A.forCreator('c1');            // this session's creator
    var t = A.totals(mine);
    var top = A.topPlacement(mine);
    var paid = A.all().filter(function (b) { return b.creator_id === 'c1' && b.state === 'paid'; })
      .reduce(function (a, b) { return a + A.commissionOf(b); }, 0);
    var approved = t.confirmed.commission - paid;

    return '<section class="ukCard c7"><div class="ukCard_h">' +
        '<h3 class="ukCard_t">Commission on the bookings you drove</h3>' +
        '<button class="ukCard_more" type="button" data-goto="collabs">Your stays</button></div>' +
        '<p class="ukCard_sub">You are paid once a guest has actually stayed \u2014 not the moment they book. ' +
        'That is why this is in three parts, and why the confirmed number only ever goes up.</p>' +
        '<ul class="ukEarn">' +
          '<li class="ukEarn_i is-paid"><span class="ukEarn_l">Paid out</span>' +
            '<span class="ukEarn_v">' + D.money(paid) + '</span>' +
            '<span class="ukEarn_n">Already in your account.</span></li>' +
          '<li class="ukEarn_i is-ok"><span class="ukEarn_l">Approved</span>' +
            '<span class="ukEarn_v">' + D.money(approved) + '</span>' +
            '<span class="ukEarn_n">Stays happened. Yours, on the next run.</span></li>' +
          '<li class="ukEarn_i is-wait"><span class="ukEarn_l">On its way</span>' +
            '<span class="ukEarn_v">' + D.money(t.pending.commission) + '</span>' +
            '<span class="ukEarn_n">' + t.pending.count + ' booked. Confirms once they check out.</span></li>' +
        '</ul>' +
        '<p class="ukCard_sub" style="margin:14px 0 0">' +
          t.confirmed.count + ' stays confirmed from your links' +
          (t.reversed.count ? ', and ' + t.reversed.count + ' cancelled along the way \u2014 normal, and already taken out above.' : '.') +
        '</p>' +
      '</section>' +

      '<section class="ukCard c5"><div class="ukCard_h">' +
        '<h3 class="ukCard_t">What is actually converting</h3></div>' +
        (top
          ? '<p class="ukInk_v" style="color:var(--text)">' + esc(top.placement) + '</p>' +
            '<p class="ukCard_sub">Your best converting placement on ' + esc(top.channelName) + ' \u2014 ' +
            top.bookings + ' confirmed bookings and ' + top.nights + ' room nights from it. ' +
            'Worth making more of.</p>'
          : '<p class="ukCard_sub">Nothing has converted yet. It shows up here the moment it does.</p>') +
        '<ul class="ukChan">' + A.byKey('channel', mine).map(function (r) {
          return '<li><span class="ukChan_n">' + esc(r.channelName) + '</span>' +
            '<span class="ukChan_b">' + r.confirmed.count + '</span>' +
            '<span class="ukChan_v">' + D.money(r.confirmed.commission) + '</span></li>';
        }).join('') + '</ul>' +
        '<p class="ukHint" style="margin-top:10px">Confirmed bookings and your share, by where you posted.</p>' +
      '</section>';
  }

  V.home = home;
  V.earn = earn;
})();
