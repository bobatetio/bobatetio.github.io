/* Ukreate — Bookings & ROI.
   Fully built and clickable. Runs on SEEDED DEMONSTRATION DATA: attribution tracking
   is not live, every screen says so, and nothing here is presented as real revenue.
   Loaded after ukviews.js and replaces the stub renderer. */
(function () {
  var D = window.UK, V = window.UKV;
  if (!D || !V) return;

  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) {
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; }); };
  function img(src, alt, cls, eager) {
    return '<img class="' + (cls || '') + '" src="' + src + '" alt="' + esc(alt) + '"' +
           (eager ? '' : ' loading="lazy" decoding="async"') + '>';
  }
  function head(t, s) {
    return '<div class="ukPageHead_row"><div class="ukPageHead"><h2>' + t + '</h2>' +
      (s ? '<p>' + s + '</p>' : '') + '</div>' +
      /* the animated mark, the same file the calculator's own header uses — an
         outline glyph here and a Lottie there made them look like two features */
      '<button class="ukGhost ukCalcEntry" type="button" data-calc-open>' +
        '<span class="ukCalcEntry_ic" aria-hidden="true" data-lottie-src="/assets/lottie/calc-icon.json?v=3" ' +
          'data-lottie-loop="false"></span><span>Affordability calculator</span></button></div>';
  }
  function stat(l, v, n) {
    return '<div class="ukStat"><p class="ukStat_label">' + l + '</p>' +
           '<p class="ukStat_value">' + v + '</p><p class="ukStat_note">' + n + '</p></div>';
  }

  var TABS = [
    { id:'overview', t:'Overview' },
    { id:'creators', t:'By creator' },
    { id:'stays',    t:'By hosted stay' },
    { id:'tracking', t:'Links & codes' }
  ];
  var RANGES = ['Last 30 days','Last 90 days','This year','All time'];
  var VIEW_IC = {
    grid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/></svg>',
    list:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>'
  };

  function roi(st) {
    /* ---- nothing to report, and why ----
       If this property's booking tracking is not live there is no honest version
       of this page: every figure on it is attributed, and attribution needs the
       booking flow instrumented first. So the page changes job rather than
       showing zeroes or, worse, seeded figures. The tabs go with it. Links and
       codes would otherwise hand a hotel a link and label it Live.

       The calculator stays in the page head. It is a projection from the hotel's
       own rates rather than a report of anything, so it is the one thing here an
       uninstrumented property can still use, and it answers the question the
       explanation raises. */
    if (!D.trackingLive()) {
      var T = window.UKTRACK;
      return head('Bookings and ROI', T.state().sub) + T.panel();
    }

    var tab = st.tab || 'overview';
    if (!TABS.some(function (t) { return t.id === tab; })) tab = 'overview';
    var range = st.range || 'Last 90 days';

    return head('Bookings and ROI',
      'What your hosted stays sent back in direct bookings, and what it cost you against an OTA.') +
      /* Tabs, period and sort on one line. "Top by" used to sit on a second bar
         under the first, so a page about numbers opened with two rows of controls
         before a single number appeared. The calculator stays with the page head:
         it is a different job, not a filter. */
      '<div class="ukToolbar ukToolbar--split">' +
        '<div class="ukFilters ukFilters--tabs" role="tablist" aria-label="ROI views">' + TABS.map(function (t) {
          var on = t.id === tab;
          return '<button class="ukFilter' + (on ? ' is-on' : '') + '" type="button" role="tab" ' +
            'aria-selected="' + on + '" data-tab="' + t.id + '"><span class="ukFilter_lb">' + t.t + '</span></button>';
        }).join('') + '</div>' +
        '<div class="ukToolbar_meta">' +
          (tab === 'creators' || tab === 'stays' ? sortDrop(st.roiSort || 'revenue') : '') +
          '<div class="ukDrop"><button class="ukDrop_b" type="button" data-drop-toggle ' +
            'aria-haspopup="menu" aria-expanded="false">' +
            '<span class="ukDrop_k">Period</span><span class="ukDrop_v">' + esc(range) + '</span>' +
            '<svg class="ukDrop_car" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
              'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>' +
          '</button><div class="ukDropMenu" hidden role="menu">' + RANGES.map(function (r) {
            return '<button class="ukDropMenu_i' + (r === range ? ' is-sel' : '') + '" role="menuitem" ' +
              'data-range="' + esc(r) + '">' + r + '</button>';
          }).join('') + '</div></div>' +
          /* Grid or list, farthest right, exactly where Creators and Discover put
             it. Only on the three tabs that are lists of things — Overview is a
             dashboard and has nothing to switch. */
          (tab === 'overview' ? '' :
            '<div class="ukSeg ukSeg--ic" role="group" aria-label="View">' +
              [['grid','Grid'],['list','List']].map(function (v) {
                var on = (st.roiView || 'grid') === v[0];
                return '<button class="ukSeg_b' + (on ? ' is-on' : '') + '" type="button" ' +
                  'data-roiview="' + v[0] + '" aria-pressed="' + on + '">' +
                  (VIEW_IC[v[0]] || '') + '<span>' + v[1] + '</span></button>';
              }).join('') + '</div>') +
        '</div>' +
      '</div>' +
      (tab === 'overview' ? overview(range) : tab === 'creators' ? byCreator(st) :
       tab === 'stays' ? byStay(st) : tracking(st));
  }

  /* What a hosted stay actually costs: the nights given away at the property's
     own rate, plus the commission paid on what they brought back. Stated, not
     buried, because it is the denominator under ROAS and CPA.
     // PLUG-IN POINT — real cost basis. Swap for the property's own opportunity
     cost per comped night once finance confirms how a hosted room is valued. */
  function hostedCost() {
    var nights = D.stays.reduce(function (a, s) { return a + (Number(s.nights) || 0); }, 0);
    var t = D.roiTotals(D.attribution);
    var rate = t.nights ? Math.round(t.revenue / t.nights) : 250;
    return { nights: nights, rate: rate };
  }

  /* confirmed / pending / reversed, and they genuinely sum to the whole */
  function ledger(at) {
    var rows = [
      { k:'confirmed', t:'Confirmed', n:'The guest stayed. This money is real.',
        v:at.confirmed.value, c:at.confirmed.count, nights:at.confirmed.nights },
      { k:'pending',   t:'Pending',   n:'Booked, not yet stayed. Can still change.',
        v:at.pending.value, c:at.pending.count, nights:at.pending.nights },
      { k:'reversed',  t:'Reversed',  n:'Cancelled or no-show. Taken back out.',
        v:at.reversed.value, c:at.reversed.count, nights:at.reversed.nights }
    ];
    return '<ul class="ukLedger">' + rows.map(function (r) {
      return '<li class="ukLedger_i is-' + r.k + '">' +
        '<span class="ukLedger_t">' + r.t + '</span>' +
        '<span class="ukLedger_v">' + (r.k === 'reversed' && r.v ? '\u2212' : '') + D.money(r.v) + '</span>' +
        '<span class="ukLedger_c">' + r.c + (r.c === 1 ? ' booking' : ' bookings') +
          (r.nights ? ' \u00b7 ' + r.nights + ' nights' : '') + '</span>' +
        '<span class="ukLedger_n">' + r.n + '</span></li>';
    }).join('') + '</ul>' +
    '<p class="ukCard_sub" style="margin:14px 0 0">' + at.all + ' bookings in total, ' +
      at.reversalRate + '% reversed. Commission is only ever paid on the confirmed line.</p>';
  }

  function overview(range) {
    var t = D.roiTotals(D.attribution), C = D.COMMISSION;
    var CH = window.UKCHART;
    var A = window.UKATTRIB;
    var rev = D.trend.map(function (x) { return { k:x.m, v:x.revenue }; });
    var last = D.trend[D.trend.length - 1], prev = D.trend[D.trend.length - 2];
    var dRev = Math.round((last.revenue - prev.revenue) / prev.revenue * 100);
    var conv = (t.bookings / t.clicks * 100).toFixed(1);

    /* Attributed revenue used to be shown as one confident figure. It cannot be:
       a booking can still cancel or no-show, and until the stay has happened the
       money is not real. Confirmed leads, pending sits beside it, and what has
       already reversed is stated rather than quietly netted off. */
    var at = A.totals();
    var perf = A.performance(null, hostedCost());

    return '<div class="ukBento">' +
        dk({ l:'Revenue confirmed', v:D.money(at.confirmed.value), n:'stays taken, ' + at.confirmed.count + ' bookings', hero:true,
             d:(dRev >= 0 ? '+' : '') + dRev + '%', down:dRev < 0 }) +
        dk({ l:'Still pending', v:D.money(at.pending.value), n:at.pending.count + ' booked, not yet stayed' }) +
        dk({ l:'ROAS', v:perf.roas.toFixed(1) + '\u00d7', n:'on ' + D.money(perf.spend) + ' given up' }) +
        dk({ l:'Effective CPA', v:D.money(perf.cpa), n:'per confirmed booking' }) +
      '</div>' +

      '<div class="ukBento">' +
        '<section class="ukCard c12"><div class="ukCard_h">' +
          '<h3 class="ukCard_t">Where the attributed money actually stands</h3>' +
          '<span class="ukCard_pill" aria-hidden="true">' + esc(range) + '</span></div>' +
          '<p class="ukCard_sub">A booking is not revenue until the guest has stayed. These three add up to ' +
            'every booking your creators have ever driven, so nothing is hidden in a net figure.</p>' +
          ledger(at) +
        '</section>' +
      '</div>' +

      '<div class="ukBento">' +
        dk({ l:'Direct bookings', v:t.bookings, n:'booked on your own site' }) +
        dk({ l:'Average booking', v:D.money(Math.round(t.revenue / t.bookings)), n:'per reservation' }) +
        dk({ l:'Content to booking', v:conv + '%', n:'of clicks convert' }) +
        dk({ l:'Room nights', v:at.confirmed.nights, n:'confirmed, across all stays' }) +
      '</div>' +

      '<div class="ukBento">' +
        '<section class="ukCard c8"><div class="ukCard_h">' +
          '<h3 class="ukCard_t">Revenue attributed over time</h3>' +
          '<span class="ukCard_pill" aria-hidden="true">' + esc(range) + '</span></div>' +
          '<p class="ukCard_sub">Every month since your first hosted stay. The step up in April follows two ' +
            'creators publishing in the same fortnight.</p>' +
          CH.area({ data:rev, unit:'attributed', label:'Attributed revenue by month' }) +
        '</section>' +

        '<section class="ukCard ukCard--ink c4">' +
          '<div class="ukCard_h"><h3 class="ukCard_t">Kept, not paid out</h3></div>' +
          '<p class="ukInk_v">' + D.money(t.saved) + '</p>' +
          '<p class="ukInk_n">What an OTA would have taken on the same ' + t.bookings +
            ' bookings, at ' + C.ota + '% against your ' + (C.uk + C.creator) + '%.</p>' +
          '<button class="ukBtn" type="button" data-tab="tracking" style="width:100%">How this is tracked</button>' +
        '</section>' +
      '</div>' +

      /* The two breakdowns belong here, next to the trend they decompose. On
         their own tabs they sat above a grid that already ranked the same rows,
         so the chart repeated the list underneath it. Here they answer the
         question the overview actually raises: the total moved, who moved it. */
      '<div class="ukBento">' +
        '<section class="ukCard c6"><div class="ukCard_h">' +
          '<h3 class="ukCard_t">Attributed revenue by creator</h3>' +
          '<span class="ukCard_pill" aria-hidden="true">Top 8</span></div>' +
          CH.capsules({ data:topCreators(8), unit:'attributed', cls:'ukCh--rank', label:'Attributed revenue by creator' }) +
        '</section>' +
        '<section class="ukCard c6"><div class="ukCard_h">' +
          '<h3 class="ukCard_t">Attributed revenue by stay</h3>' +
          '<span class="ukCard_pill" aria-hidden="true">Top 8</span></div>' +
          CH.capsules({ data:topStays(8), unit:'attributed', cls:'ukCh--rank', label:'Attributed revenue by stay' }) +
        '</section>' +
      '</div>' +

      '<div class="ukBento">' +
        '<section class="ukCard c7"><div class="ukCard_h">' +
          '<h3 class="ukCard_t">Where your ' + (C.uk + C.creator) + '% goes</h3></div>' +
          '<p class="ukCard_sub">Half to Ukreate, half to the creator who actually drove the booking, ' +
            'so they are paid on what they bring in. An OTA takes its cut either way.</p>' +
          CH.segbar({ segs:[
            { l:'Ukreate', v:C.uk, show:C.uk + '% to Ukreate' },
            { l:'Creator', v:C.creator, show:C.creator + '% to the creator' }
          ] }) +
          '<p class="ukCard_sub" style="margin:14px 0 0">The other ' + (100 - C.uk - C.creator) +
            '% of every attributed booking stays with you.</p>' +
        '</section>' +

        '<section class="ukCard c5"><div class="ukCard_h">' +
          '<h3 class="ukCard_t">Against an OTA</h3></div>' +
          '<ul class="ukRow">' +
            '<li><span class="ukRow_b"><span class="ukRow_n">You paid</span>' +
              '<span class="ukRow_m">Ukreate at ' + (C.uk + C.creator) + '%</span></span>' +
              '<span class="ukRow_r">' + D.money(t.commission) + '</span></li>' +
            '<li><span class="ukRow_b"><span class="ukRow_n">An OTA would have taken</span>' +
              '<span class="ukRow_m">At ' + C.ota + '% of the same revenue</span></span>' +
              '<span class="ukRow_r">' + D.money(t.otaWould) + '</span></li>' +
          '</ul>' +
          '<p class="ukCard_sub" style="margin:14px 0 0">You kept <strong>' + D.money(t.saved) +
            '</strong> on the same bookings.</p>' +
        '</section>' +
      '</div>';
  }

  function topCreators(n) {
    return perCreator().sort(function (a, b) { return b.revenue - a.revenue; })
      .slice(0, n).map(function (r) {
        var cr = D.creator(r.who);
        return { k: cr ? cr.n.split(' ')[0] : r.who, v: r.revenue };
      });
  }
  function stayGroups() {
    var g = {};
    D.attribution.forEach(function (r) { (g[r.stay] = g[r.stay] || []).push(r); });
    return g;
  }
  function topStays(n) {
    var g = stayGroups();
    return Object.keys(g).map(function (sid) {
      var s2 = D.stay(sid);
            var k = s2 ? s2.t.split(',')[0].split(' ').slice(0, 2).join(' ') : sid;
      return { k:k, v: D.roiTotals(g[sid]).revenue };
    }).sort(function (a, b) { return b.v - a.v; }).slice(0, n);
  }

  /* "Top" needs a stated measure or it is just an opinion. Revenue is the default
     because it is what the page is about, but the creator who drove the most
     bookings is not always the one who drove the most money, and both are worth
     being able to see. */
  var SORTS = [
    { k:'revenue',  n:'Revenue'  },
    { k:'bookings', n:'Bookings' },
    { k:'clicks',   n:'Clicks'   }
  ];
  function sortDrop(cur) {
    var sel = SORTS.filter(function (o) { return o.k === cur; })[0] || SORTS[0];
    return '<div class="ukDrop"><button class="ukDrop_b" type="button" data-drop-toggle ' +
      'aria-haspopup="menu" aria-expanded="false">' +
      '<span class="ukDrop_k">Top by</span><span class="ukDrop_v">' + esc(sel.n) + '</span>' +
      '<svg class="ukDrop_car" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>' +
    '</button><div class="ukDropMenu" hidden role="menu">' + SORTS.map(function (o) {
      return '<button class="ukDropMenu_i' + (o.k === cur ? ' is-sel' : '') + '" role="menuitem" ' +
        'data-roisort="' + o.k + '">' + o.n + '</button>';
    }).join('') + '</div></div>';
  }

  var ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';
  function dk(o) {
    return '<article class="ukK' + (o.hero ? ' ukK--hero' : '') + ' c3">' +
      '<p class="ukK_l">' + esc(o.l) + '</p><p class="ukK_v">' + o.v + '</p>' +
      '<p class="ukK_n">' + (o.d ? '<span class="ukK_d' + (o.down ? ' is-down' : '') + '">' +
        (o.down ? '&#9662;' : '&#9652;') + ' ' + esc(o.d) + '</span>' : '') +
        '<span>' + esc(o.n) + '</span></p></article>';
  }

  function kpi(l, v, n, hero) {
    return '<div class="ukKpi' + (hero ? ' is-hero' : '') + '"><p class="ukStat_label">' + l + '</p>' +
      '<p class="ukKpi_v">' + v + '</p><p class="ukStat_note">' + n + '</p></div>';
  }

  /* The creator card the rest of the product uses, with this page's numbers
     under it — rather than a fourth shape that only exists here. */
  /* One row per creator, not per tracked link. A creator who has worked two of
     your stays has two attribution records, and listing both put the same person
     on the page twice with half their numbers under each face. */
  function perCreator() {
    var g = {};
    D.attribution.forEach(function (r) {
      var a = g[r.who] || (g[r.who] = { who:r.who, bookings:0, revenue:0, clicks:0 });
      a.bookings += r.bookings; a.revenue += r.revenue; a.clicks += r.clicks;
    });
    return Object.keys(g).map(function (k) { return g[k]; });
  }

  function byCreator(st) {
    var by = (st || {}).roiSort || 'revenue';
    var rows = perCreator().sort(function (a, b) { return b[by] - a[by]; });
    var pg = V.paginate(rows, (st || {}).pgRoiC, 9, 'pgRoiC');
    if ((st || {}).roiView === 'list') return creatorList(pg.rows) + pg.nav;
    return '<div class="ukCrGrid">' + pg.rows.map(function (r, i) {
        var cr = D.creator(r.who);
        if (!cr) return '';
        var comm = Math.round(r.revenue * (D.COMMISSION.uk + D.COMMISSION.creator) / 100);
        return V.creatorCard(cr, i, { actions: false, foot:
          numbers([
            ['Bookings',   r.bookings],
            ['Revenue',    D.money(r.revenue)],
            ['Commission', D.money(comm)],
            ['Clicks',     r.clicks.toLocaleString('en-US')]
          ]) +
          '<div class="ukCrCard_act">' +
            '<button class="ukBtn ukBtn--sm" type="button" data-invite-open="' + cr.id + '">Invite creator</button>' +
            '<button class="ukGhost ukGhost--sm" type="button" data-creator="' + cr.id + '">View profile</button>' +
          '</div>' });
      }).join('') + '</div>' + pg.nav;
  }

  /* The performance numbers sit in the same strip the card already uses for its
     own stats — same rhythm, same weight, no rules between them. A <dl> dropped
     into the bottom of a card is not a design; this is the card's own footer
     language, borrowed. */
  /* The same rows a spreadsheet would give you: for scanning and comparing, which
     is what a list view is for. The grid is for browsing. */
  function creatorList(rows) {
    return '<div class="ukPanel ukTableWrap"><table class="ukTable">' +
      '<thead><tr><th scope="col">Creator</th><th scope="col">Bookings</th><th scope="col">Revenue</th>' +
      '<th scope="col">Commission</th><th scope="col">Clicks</th><th scope="col"></th></tr></thead><tbody>' +
      rows.map(function (r) {
        var cr = D.creator(r.who);
        if (!cr) return '';
        var comm = Math.round(r.revenue * (D.COMMISSION.uk + D.COMMISSION.creator) / 100);
        return '<tr><th scope="row"><span class="ukTable_who">' + img(cr.img, cr.n, 'ukAv') +
            '<span><span class="ukTable_n">' + esc(cr.n) + '</span>' +
            '<span class="ukTable_s">' + esc(cr.loc) + '</span></span></span></th>' +
          '<td>' + r.bookings + '</td><td>' + D.money(r.revenue) + '</td>' +
          '<td>' + D.money(comm) + '</td><td>' + r.clicks.toLocaleString('en-US') + '</td>' +
          '<td class="ukTable_act"><button class="ukGhost ukGhost--sm" type="button" data-creator="' +
            cr.id + '">View</button></td></tr>';
      }).join('') + '</tbody></table></div>';
  }

  function stayList(ids, group) {
    return '<div class="ukPanel ukTableWrap"><table class="ukTable">' +
      '<thead><tr><th scope="col">Stay</th><th scope="col">Bookings</th><th scope="col">Revenue</th>' +
      '<th scope="col">Commission</th><th scope="col">Kept</th><th scope="col"></th></tr></thead><tbody>' +
      ids.map(function (sid) {
        var s2 = D.stay(sid), t = D.roiTotals(group[sid]);
        if (!s2) return '';
        return '<tr><th scope="row"><span class="ukTable_who">' + img(s2.img, s2.t, 'ukAv') +
            '<span><span class="ukTable_n">' + esc(s2.t) + '</span>' +
            '<span class="ukTable_s">' + s2.nights + ' nights &middot; ' + esc(String(s2.rooms || s2.room).toLowerCase()) + '</span></span></span></th>' +
          '<td>' + t.bookings + '</td><td>' + D.money(t.revenue) + '</td>' +
          '<td>' + D.money(t.commission) + '</td><td>' + D.money(t.saved) + '</td>' +
          '<td class="ukTable_act"><button class="ukGhost ukGhost--sm" type="button" data-invitestay-open="' +
            s2.id + '">Host again</button></td></tr>';
      }).join('') + '</tbody></table></div>';
  }

  function numbers(pairs) {
    return '<dl class="ukCardNums" style="--n:' + pairs.length + '">' + pairs.map(function (p) {
      return '<div class="ukCardNum"><dd class="ukCardNum_v">' + p[1] +
        '</dd><dt class="ukCardNum_l">' + esc(p[0]) + '</dt></div>';
    }).join('') + '</dl>';
  }

  /* The same stay card the hosted-stays page uses, with this page's numbers
     under it — one stay looks like one stay wherever you meet it. */
  function byStay(st) {
    var by = (st || {}).roiSort || 'revenue';
    var group = stayGroups();
    var ids = Object.keys(group).sort(function (a, b) {
      return D.roiTotals(group[b])[by === 'clicks' ? 'clicks' : by] -
             D.roiTotals(group[a])[by === 'clicks' ? 'clicks' : by];
    });
    /* The stay card the product uses everywhere else, with this page's numbers in
       its own foot rather than a second card shape invented for this tab. Same
       actions as the hosted-stays page, because a stay that paid for itself should
       be repeatable from wherever you notice that.

       NB the comment sits ABOVE the return, not between `return` and its value:
       a line break there makes automatic semicolon insertion return undefined,
       which is exactly how this grid rendered empty the first time. */
    if ((st || {}).roiView === 'list') return stayList(ids, group);
    return '<div class="ukStayGrid ukStayGrid--roi">' + ids.map(function (sid, i) {
        var st2 = D.stay(sid), t = D.roiTotals(group[sid]);
        if (!st2) return '';
        return V.stayCard({
          id: st2.id, t: st2.t, img: st2.img, shots: st2.imgs || null,
          nights: st2.nights, rooms: st2.rooms || st2.room, inc: st2.inc,
          incList: null, rights: st2.rights,
          del: st2.del
        }, null, {
          eager: i < 3, pop: (st || {}).stayPop,
          foot: numbers([
            ['Bookings',   t.bookings],
            ['Revenue',    D.money(t.revenue)],
            ['Commission', D.money(t.commission)],
            ['Kept',       D.money(t.saved)]
          ]) +
          '<div class="ukStayCard_act">' +
            '<button class="ukBtn ukBtn--sm" type="button" data-invitestay-open="' + st2.id + '">Host this stay again</button>' +
            '<button class="ukGhost ukGhost--sm" type="button" data-goto="stays">View stay</button>' +
          '</div>'
        });
      }).join('') + '</div>';
  }

  /* The commissionable basis was a hidden assumption — a flat multiply on booking
     value. It is a stated, adjustable input now, so every commission figure on
     the page moves with it and nobody is quoting a number whose basis they
     cannot see. */
  function basisPanel() {
    var A = window.UKATTRIB, at = A.totals();
    return '<section class="ukPanel"><div class="ukPanel_head">' +
      '<h3 class="ukPanel_title">What commission is calculated on</h3></div>' +
      '<p class="ukAsk">Not yet fixed with the partner, so it is an input rather than an assumption. ' +
      'Changing it re-costs every booking on this page.</p>' +
      '<div class="ukFilters" role="radiogroup" aria-label="Commissionable basis">' +
        A.BASIS.modes.map(function (m) {
          var on = A.BASIS.mode === m.k;
          return '<button class="ukFilter' + (on ? ' is-on' : '') + '" type="button" role="radio" ' +
            'aria-checked="' + on + '" data-basis="' + m.k + '">' + esc(m.t) + '</button>';
        }).join('') +
      '</div>' +
      '<p class="ukWhy">' + esc((A.BASIS.modes.filter(function (m) { return m.k === A.BASIS.mode; })[0] || {}).n || '') + '</p>' +
      '<dl class="ukFacts ukFacts--stack" style="margin-top:14px">' +
        '<div><dt>Commissionable, confirmed bookings</dt><dd>' + D.money(at.confirmed.commissionable) + '</dd></div>' +
        '<div><dt>Creator commission on that</dt><dd>' + D.money(at.confirmed.commission) + '</dd></div>' +
        '<div><dt>Bookings excluded outright</dt><dd>' + at.excluded + ' (staff and group rates)</dd></div>' +
      '</dl>' +
      '<p class="ukHint">Exclusions are structural: an excluded booking still counts as a booking, ' +
      'but carries no commissionable amount at all.</p></section>' +

    '<section class="ukPanel"><div class="ukPanel_head">' +
      '<h3 class="ukPanel_title">The booking lifecycle</h3></div>' +
      '<p class="ukAsk">A tracked click is not a booking, and a booking is not money. Commission becomes ' +
      'payable only once the guest has actually stayed.</p>' +
      '<ol class="ukHow">' +
        '<li><span>1</span><div><p class="ukHow_t">Clicked, then booked</p>' +
        '<p class="ukHow_p">Attributed to the creator, but nothing is owed yet.</p></div></li>' +
        '<li><span>2</span><div><p class="ukHow_t">Consumed</p>' +
        '<p class="ukHow_p">The guest stayed. This is the point commission becomes payable.</p></div></li>' +
        '<li><span>3</span><div><p class="ukHow_t">Approved, then paid</p>' +
        '<p class="ukHow_p">You confirm it, and the creator is paid on their share.</p></div></li>' +
        '<li><span>4</span><div><p class="ukHow_t">Cancelled or no-show</p>' +
        '<p class="ukHow_p">Reverses out of both your totals and the creator\u2019s. Nothing is owed.</p></div></li>' +
      '</ol></section>';
  }

  function tracking(st) {
    var sub = (st && st.roiSub) === 'how' ? 'how' : 'links';
    return '<div class="ukSubTabs" role="tablist" aria-label="Links and codes">' +
        [['links','The links'],['how','How it works']].map(function (t) {
          var on = t[0] === sub;
          return '<button class="ukSubTab' + (on ? ' is-on' : '') + '" type="button" role="tab" ' +
            'aria-selected="' + on + '" data-roisub="' + t[0] + '">' + t[1] + '</button>';
        }).join('') + '</div>' +
      (sub === 'how' ? howItWorks() : theLinks(st));
  }

  /* the reference half: what commission is calculated on, the lifecycle, and how
     attribution is done — reading, not doing */
  function howItWorks() {
    return '<div class="ukHowPanels">' +
      basisPanel() +
      '<section class="ukPanel"><div class="ukPanel_head">' +
      '<h3 class="ukPanel_title">How attribution works</h3></div>' +
      '<p class="ukAsk">Every collaboration gets its own tracked link and discount code, so two creators ' +
      'on the same stay never overlap and each is paid for what they actually drove.</p>' +
      '<ol class="ukHow">' +
        '<li><span>1</span><div><p class="ukHow_t">A link and a code are generated</p>' +
        '<p class="ukHow_p">Created automatically once a collaboration reaches the brief stage.</p></div></li>' +
        '<li><span>2</span><div><p class="ukHow_t">Your creator uses them</p>' +
        '<p class="ukHow_p">Link in bio, code on screen. Both point at your own booking page, never an OTA.</p></div></li>' +
        '<li><span>3</span><div><p class="ukHow_t">Bookings are attributed here</p>' +
        '<p class="ukHow_p">Within a 90 day window, with the commission owed shown against each one.</p></div></li>' +
      '</ol></section>' +
    '</div>';
  }
  /* the doing half: the links and codes themselves, with pagination */
  /* Copy belongs to the value it copies, so it lives inside the field as an icon
     rather than as a word-sized button parked beside it. The label stays above:
     a link and a code are different things and the row has to say which is which. */
  var COPY_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<rect x="9" y="9" width="11" height="11" rx="2.5"/>' +
    '<path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>';
  function field(label, value) {
    return '<div class="ukTrackRow"><span class="ukTrackRow_l">' + esc(label) + '</span>' +
      '<span class="ukCode"><code class="ukCode_v">' + esc(value) + '</code>' +
      '<button class="ukCode_cp" type="button" data-ack="Copied" data-copy="' + esc(value) + '" ' +
        'title="Copy ' + esc(label.toLowerCase()) + '" aria-label="Copy ' + esc(label.toLowerCase()) + '">' +
        COPY_ICON + '</button></span></div>';
  }

  function theLinks(st) {
    var pg = V.paginate(D.attribution, (st || {}).pgLinks, 9, 'pgLinks');
    if ((st || {}).roiView === 'list') {
      return '<div class="ukPanel ukTableWrap"><table class="ukTable">' +
        '<thead><tr><th scope="col">Creator</th><th scope="col">Stay</th><th scope="col">Tracked link</th>' +
        '<th scope="col">Code</th><th scope="col">Live since</th><th scope="col">Window</th></tr></thead><tbody>' +
        pg.rows.map(function (r) {
          var cr = D.creator(r.who), s2 = D.stay(r.stay);
          return '<tr><th scope="row"><span class="ukTable_who">' + img(cr.img, cr.n, 'ukAv') +
              '<span class="ukTable_n">' + esc(cr.n) + '</span></span></th>' +
            '<td>' + esc(s2.t) + '</td>' +
            '<td><code class="ukCode ukCode--flat">' + esc(r.link) + '</code></td>' +
            '<td><code class="ukCode ukCode--flat">' + esc(r.code) + '</code></td>' +
            '<td>' + esc(r.live) + '</td><td>' + esc(r.window) + '</td></tr>';
        }).join('') + '</tbody></table></div>' + pg.nav;
    }
    return '<div class="ukCards">' + pg.rows.map(function (r) {
        var cr = D.creator(r.who), s = D.stay(r.stay);
        return '<article class="ukCard"><div class="ukCard_pad">' +
          '<div class="ukCard_top"><div class="ukWho">' + V.who(cr, img(cr.img, cr.n, 'ukAv'), 'ukProfLink--av') +
            '<div><h3 class="ukCard_t">' + esc(cr.n) + '</h3>' +
            '<p class="ukCard_sub">' + esc(s.t) + '</p></div></div>' +
            '<span class="ukTag ukTag--you">Live</span></div>' +
          field('Tracked link', r.link) + field('Discount code', r.code) +
          '<dl class="ukFacts">' +
            '<div><dt>Live since</dt><dd>' + r.live + '</dd></div>' +
            '<div><dt>Attribution window</dt><dd>' + r.window + '</dd></div>' +
          '</dl>' +
          '<button class="ukGhost ukCard_cta" type="button" data-ack="Regenerated">Regenerate code</button>' +
        '</div></article>';
      }).join('') + '</div>' +
      '<p class="ukWhy">Regenerating a code never breaks bookings already attributed. Past attributions keep ' +
      'the code they were made with.</p>' + pg.nav;
  }

  V.roi = roi;   // replaces the stub from the first pass
})();
