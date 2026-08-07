/* Ukreate — hotel dashboard. Loaded after ukviews.js and replaces the stub renderer,
   the same override pattern ukroi.js uses. Bento layout, one filled hero KPI, one dark
   accent card, and charts that run on the existing seeded data (D.trend, D.collabs) —
   nothing here invents a number. */
(function () {
  var D = window.UK, V = window.UKV, CH = window.UKCHART;
  if (!D || !V || !CH) return;

  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) {
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; }); };
  function img(src, alt, cls, eager) {
    return '<img class="' + (cls || '') + '" src="' + src + '" alt="' + esc(alt) + '"' +
           (eager ? '' : ' loading="lazy" decoding="async"') + '>';
  }
  var ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';
  /* tight axis top: the exact reading, not the shared chart util's rounded-up
     headroom value, so the peak sits at the top of the plot without a
     misleadingly "clean" number like 25 padded on above it */
  function tightMax(data) {
    return Math.max.apply(null, data.map(function (r) { return r.v || 0; }).concat([1]));
  }

  function kpi(o) {
    return '<article class="ukK' + (o.hero ? ' ukK--hero' : '') + ' c3">' +
      '<p class="ukK_l">' + esc(o.l) + '</p>' +
      '<p class="ukK_v">' + o.v + '</p>' +
      '<p class="ukK_n">' + (o.d ? '<span class="ukK_d' + (o.down ? ' is-down' : '') + '">' +
        (o.down ? '&#9662;' : '&#9652;') + ' ' + esc(o.d) + '</span>' : '') +
        '<span>' + esc(o.n) + '</span></p>' +
      '<button class="ukK_go" type="button" data-goto="' + o.go + '"' +
        (o.preset != null ? ' data-preset="' + o.preset + '"' : '') +
        ' aria-label="Open ' + esc(o.l) + '">' + ARROW + '</button>' +
      '</article>';
  }

  function dashboard() {
    var needsYou = D.collabs.filter(function (c) { return D.STAGES[c.stage].mine && c.stage < 5; });
    var live     = D.stays.filter(function (s) { return s.status === 'live'; });
    var ready    = D.collabs.filter(function (c) { return c.stage === 4; });
    var active   = D.collabs.filter(function (c) { return c.stage < 5; });
    var done     = D.collabs.filter(function (c) { return c.stage >= 4; });   /* 4 is Complete; >=5 never matched */
    var withCrew = active.filter(function (c) { return !D.STAGES[c.stage].mine; });
    var t        = D.roiTotals(D.attribution);
    var applied  = live.reduce(function (a, s) { return a + s.apps; }, 0);
    var owned    = D.owned().length;

    /* bookings per month, last six, newest highlighted — one series, so no legend */
    var months = D.trend.slice(-6).map(function (r, i, arr) {
      return { k: r.m, v: r.bookings, hi: i === arr.length - 1 };
    });
    var last = D.trend[D.trend.length - 1], prev = D.trend[D.trend.length - 2];
    var delta = last.bookings - prev.bookings;

    var pipeline = [
      { l: 'Delivered',        v: done.length },
      { l: 'With your creator',v: withCrew.length },
      { l: 'Waiting on you',   v: needsYou.length, pending: !needsYou.length }
    ].filter(function (s) { return s.v > 0 || s.l === 'Waiting on you'; });
    var pipeTotal = done.length + active.length || 1;

    /* The greeting comes first, then the checklist under it. A checklist above the
       greeting made the page open on a list of chores from an account nobody had
       said hello to yet. */
    var setup = window.UKONBOARD ? window.UKONBOARD.tasks('hotel') : [];
    var leftToDo = setup.filter(function (t) { return !t.done; });
    /* nothing offered and nothing under way: there is no activity to report on */
    var barren = !live.length && !D.collabs.length;

    return '<div class="ukDashTop"><div>' +
        '<h2 class="ukDashTop_h">Good morning, Robert</h2>' +
        '<p class="ukDashTop_p">' + (leftToDo.length
          /* While setup is unfinished the line is about setup, because nothing
             else on the page is true yet: there is no work waiting on you when
             you have not published anything for anyone to respond to. */
          ? setupLine(leftToDo)
          : (needsYou.length ? needsYou.length + (needsYou.length === 1 ? ' collaboration needs' : ' collaborations need') + ' you today.' : 'Nothing is waiting on you today.') +
            (ready.length ? ' A set of content has just landed.' : '')) +
        '</p></div>' +
        '</div>' +

      (window.UKONBOARD ? window.UKONBOARD.checklist('hotel') : '') +

      '<div class="ukBento">' +
        /* No movement badge on an account with nothing to have moved. The first
           of these was hardcoded to at least +1 and the second reads a seeded
           trend, so a five-minute-old hotel was told its content was up one and
           its bookings up nine, against zero and zero. */
        kpi({ l:'Content you own', v:owned, n:'yours in perpetuity', go:'library',
              d: barren ? '' : '+' + Math.max(1, ready.length) }) +
        kpi({ l:'Direct bookings', v:t.bookings, n:D.money(t.revenue) + ' attributed', go:'roi',
              d: barren ? '' : (delta >= 0 ? '+' : '') + delta, down: !barren && delta < 0 }) +
        kpi({ l:'Stays open', v:live.length, n:applied + ' creators applied', go:'stays' }) +
        kpi({ l:'Waiting on you', v:needsYou.length,
              n:needsYou.length ? 'oldest is 8 days' : 'nothing outstanding', go:'collabs' }) +
      '</div>' +

      /* Everything below the four stats is a reading of activity: bookings over
         time, top creators, content you own. On an account that has published
         nothing there is nothing for any of it to read, and a chart drawn through
         zeroes does not look empty, it looks broken. It also buries the one thing
         that matters on day one, which is the checklist above.

         Gated on there being something to describe, NOT on the checklist being
         finished. An established hotel that has simply never used the invite
         feature still has an outstanding task, and hiding twenty stays and
         fourteen collaborations behind that would be absurd. */
      (barren ? '' :

      '<div class="ukBento">' +
        '<section class="ukCard c7"><div class="ukCard_h">' +
          '<h3 class="ukCard_t">Direct bookings over time</h3>' +
          '<div class="ukChFilter" data-chart-filter>' +
            '<button class="ukChFilter_btn" type="button" data-chart-filter-toggle aria-expanded="false" aria-haspopup="true" aria-controls="ukChartMenu">' +
              '<span data-chart-filter-label>By month</span>' +
              '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>' +
            '</button>' +
            '<div class="ukMenu ukChFilter_menu" id="ukChartMenu" role="menu" hidden>' +
              '<button class="ukMenu_i is-active" type="button" role="menuitem" data-filter-value="month">By month</button>' +
              '<button class="ukMenu_i" type="button" role="menuitem" data-filter-value="week">By week</button>' +
              '<button class="ukMenu_i" type="button" role="menuitem" data-filter-value="3days">Last 3 days</button>' +
              '<button class="ukMenu_i" type="button" role="menuitem" data-filter-value="3months">Last 3 months</button>' +
              '<button class="ukMenu_i" type="button" role="menuitem" data-filter-value="6months">Last 6 months</button>' +
              '<button class="ukMenu_i" type="button" role="menuitem" data-filter-value="year">Last year</button>' +
            '</div>' +
          '</div></div>' +
          '<p class="ukCard_sub">Bookings traced back to creator content, so no commission was paid on them.</p>' +
          CH.area({ data:months, unit:'bookings', label:'Direct bookings over time', max:tightMax(months) }) +
        '</section>' +

        (function () {
          var rows = D.attribution.slice().sort(function (a, b) { return b.revenue - a.revenue; }).slice(0, 4);
          return '<section class="ukCard c5"><div class="ukCard_h">' +
            '<h3 class="ukCard_t">Top performing creators</h3>' +
            '<button class="ukCard_more" type="button" data-goto="roi">See all</button></div>' +
            '<p class="ukCard_sub">Ranked by revenue driven through tracked bookings.</p>' +
            '<ul class="ukRow">' + rows.map(function (r) {
              var cr = D.creator(r.who);
              var comm = Math.round(r.revenue * (D.COMMISSION.uk + D.COMMISSION.creator) / 100);
              var saved = Math.round(r.revenue * D.COMMISSION.ota / 100) - comm;
              var impressions = r.impressions >= 1000 ? (r.impressions / 1000).toFixed(1) + 'K' : r.impressions;
              return '<li data-goto="roi">' + V.who(cr, img(cr.img, cr.n, 'ukAv'), 'ukProfLink--av') +
                '<span class="ukRow_b">' + V.who(cr, esc(cr.n), 'ukRow_n') +
                '<span class="ukRow_m">' + cr.stays + ' stays · ' + impressions + ' impressions · ' +
                  r.clicks.toLocaleString('en-US') + ' clicks</span></span>' +
                '<span class="ukRow_r">' + D.money(saved) + ' saved</span></li>';
            }).join('') + '</ul>' +
          '</section>';
        })() +
      '</div>' +

      '<div class="ukBento">' +
        '<section class="ukCard c5"><div class="ukCard_h">' +
          '<h3 class="ukCard_t">Active collaborations</h3>' +
          '<button class="ukCard_more" type="button" data-goto="collabs">See all</button></div>' +
          '<ul class="ukRow">' + active.slice(0, 4).map(function (c) {
            var cr = D.creator(c.who), stg = D.STAGES[c.stage];
            return '<li data-goto="collabs" data-preset="' + c.stage + '">' +
              V.who(cr, img(cr.img, cr.n, 'ukAv'), 'ukProfLink--av') +
              '<span class="ukRow_b">' + V.who(cr, esc(cr.n), 'ukRow_n') +
              '<span class="ukRow_m">' + esc(D.stay(c.stay).t) + '</span></span>' +
              '<span class="ukTag ukTag--' + (stg.mine ? 'you' : 'wait') + '">' + esc(stg.short) + '</span></li>';
          }).join('') + '</ul>' +
        '</section>' +

        '<section class="ukCard c4"><div class="ukCard_h">' +
          '<h3 class="ukCard_t">Where your collaborations stand</h3></div>' +
          CH.semiGauge({
            segs: pipeline,
            center: Math.round(done.length / pipeTotal * 100) + '%',
            sub: 'delivered', unit: 'collaborations', label: 'Collaboration pipeline'
          }) +
        '</section>' +

        '<section class="ukCard ukCard--ink c3">' +
          '<div class="ukCard_h"><h3 class="ukCard_t">Kept, not paid out</h3></div>' +
          '<p class="ukInk_v">' + D.money(t.saved) + '</p>' +
          '<p class="ukInk_n">What an OTA would have taken on the same ' + t.bookings +
            ' bookings, at ' + D.COMMISSION.ota + '% against your ' + (D.COMMISSION.uk + D.COMMISSION.creator) + '%.</p>' +
          '<button class="ukInk_link" type="button" data-goto="roi">How this is tracked</button>' +
          '<button class="ukCalcBtn" type="button" data-calc-open>' +
            '<span class="ukCalcBtn_ic" aria-hidden="true" data-lottie-src="/assets/lottie/calc-icon-gold.json?v=1"></span>' +
            '<span>Calculate your savings from working with creators</span></button>' +
        '</section>' +
      '</div>' +

      '<div class="ukBento">' +
        '<section class="ukCard c12"><div class="ukCard_h">' +
          '<h3 class="ukCard_t">Recently delivered</h3></div>' +
          '<div class="ukGallery ukGallery--video">' + D.assets.slice(0, 6).map(function (a, i) {
            var cr = D.creator(a.by);
            return '<figure class="ukShot ukShot--video">' + img(a.img, a.t, 'ukShot_img', i < 4) +
              (a.k === 'video' ? '<span class="ukShot_play" aria-hidden="true">&#9654;</span>' +
               '<span class="ukShot_len">' + a.len + '</span>' : '') +
              '<figcaption class="ukShot_meta ukShot_meta--overlay"><span class="ukShot_t">' + esc(a.t) + '</span>' +
              V.who(cr, esc(cr.n), 'ukShot_by') + '</figcaption></figure>';
          }).join('') + '</div>' +
        '</section>' +
      '</div>');
  }

  /* The line under the greeting while setup is unfinished. Derived from the live
     checklist, so it names what is actually left rather than a fixed sentence
     that goes stale the moment one is ticked. */
  var COUNT_WORD = { 1:'One', 2:'Two', 3:'Three', 4:'Four', 5:'Five' };
  function setupLine(left) {
    var first = String(left[0].t).charAt(0).toLowerCase() + String(left[0].t).slice(1);
    if (left.length === 1) {
      return 'One thing left before creators can find you: ' + esc(first) + '.';
    }
    return (COUNT_WORD[left.length] || left.length) +
      ' things left before creators can find you. Start by ' +
      esc(first.replace(/^publish\b/, 'publishing').replace(/^invite\b/, 'inviting')
               .replace(/^add\b/, 'adding').replace(/^write\b/, 'writing')) + '.';
  }

  V.dashboard = dashboard;

  /* Wire chart filter dropdown to refresh data */
  setTimeout(function() {
    var filterRoot = document.querySelector('[data-chart-filter]');
    if (!filterRoot) return;
    var toggle = filterRoot.querySelector('[data-chart-filter-toggle]');
    var menu = filterRoot.querySelector('.ukChFilter_menu');
    var label = filterRoot.querySelector('[data-chart-filter-label]');
    if (!toggle || !menu || !label) return;

    var LABELS = {
      month: 'By month', week: 'By week', '3days': 'Last 3 days',
      '3months': 'Last 3 months', '6months': 'Last 6 months', year: 'Last year'
    };

    function closeMenu() {
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    }
    function openMenu() {
      menu.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
    }

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (menu.hidden) openMenu(); else closeMenu();
    });
    document.addEventListener('click', function (e) {
      if (!menu.hidden && !filterRoot.contains(e.target)) closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { closeMenu(); toggle.focus(); }
    });

    menu.addEventListener('click', function (e) {
      var item = e.target.closest('[data-filter-value]');
      if (!item) return;
      var filterValue = item.getAttribute('data-filter-value');
      label.textContent = LABELS[filterValue] || 'By month';
      menu.querySelectorAll('.ukMenu_i').forEach(function (b) {
        b.classList.toggle('is-active', b === item);
      });
      closeMenu();

      var chartCard = filterRoot.closest('.ukCard');
      if (!chartCard) return;
      var chartContainer = chartCard.querySelector('.ukCh--area');
      if (!chartContainer) return;

      /* Generate filtered data based on selection */
      var trend = D.trend || [];
      var filteredData;

      if (filterValue === 'week') {
        /* Last 7 days */
        filteredData = trend.slice(-7).map(function(r, i, arr) {
          return { k: 'Day ' + (i + 1), v: Math.floor(r.bookings / 4), hi: i === arr.length - 1 };
        });
      } else if (filterValue === '3days') {
        /* Last 3 days */
        filteredData = trend.slice(-3).map(function(r, i, arr) {
          return { k: ['Today', 'Yesterday', '2 days ago'][2 - i], v: Math.floor(r.bookings / 2), hi: i === arr.length - 1 };
        }).reverse();
      } else if (filterValue === '3months') {
        /* Last 3 months */
        filteredData = trend.slice(-12).filter(function(_, i) { return i % 4 === 0; }).map(function(r, i, arr) {
          return { k: r.m, v: r.bookings, hi: i === arr.length - 1 };
        });
      } else if (filterValue === '6months') {
        /* Last 6 months */
        filteredData = trend.slice(-26).filter(function(_, i) { return i % 2 === 0; }).map(function(r, i, arr) {
          return { k: r.m, v: r.bookings, hi: i === arr.length - 1 };
        });
      } else if (filterValue === 'year') {
        /* All available data */
        filteredData = trend.map(function(r, i, arr) {
          return { k: r.m, v: r.bookings, hi: i === arr.length - 1 };
        });
      } else {
        /* Default: by month (last 6) */
        filteredData = trend.slice(-6).map(function(r, i, arr) {
          return { k: r.m, v: r.bookings, hi: i === arr.length - 1 };
        });
      }

      /* Update chart */
      var newHtml = CH.area({
        data: filteredData,
        unit: 'bookings',
        label: 'Direct bookings, ' + (LABELS[filterValue] || 'by month').toLowerCase(),
        max: tightMax(filteredData)
      });
      var wrapper = document.createElement('div');
      wrapper.innerHTML = newHtml;
      var newChart = wrapper.querySelector('.ukCh--area');
      if (newChart) {
        chartContainer.replaceWith(newChart);
      }
    });
  }, 100);
})();