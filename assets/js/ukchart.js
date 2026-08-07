/* Ukreate — chart primitives. Plain SVG, no dependencies, works on both sides.

   Series colours live in ukdash.css as --c1/--c2/--c3 so light and dark each get
   their own validated steps. Both sets were run through the palette validator:
     light  #1596b0 / #d7a543 / #2fae8f  — band, chroma, CVD, normal-vision all pass
     dark   #1e93a9 / #b98a33 / #2ba286  — all six checks pass
   Light carries a sub-3:1 contrast relief, which is why every chart here ships a
   legend and direct labels rather than relying on colour alone.

   "No data yet" is a hatched texture, never a colour, so it reads in greyscale
   and in forced-colors too. */
window.UKCHART = (function () {
  var uid = 0;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) {
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; }); };

  /* one hatch pattern per chart instance so ids never collide */
  function hatch(id) {
    return '<pattern id="' + id + '" width="7" height="7" patternUnits="userSpaceOnUse" ' +
      'patternTransform="rotate(45)"><rect width="7" height="7" fill="none"/>' +
      '<line x1="0" y1="0" x2="0" y2="7" stroke="currentColor" stroke-width="3.2" opacity=".22"/></pattern>';
  }

  /* round a max value up to a friendly axis top (1/2/2.5/5/10 * 10^n) so grid
     labels never show "13.75 bookings" */
  function niceMax(v) {
    if (v <= 0) return 1;
    var mag = Math.pow(10, Math.floor(Math.log(v) / Math.LN10));
    var n = v / mag;
    /* The ladder used to jump 5 -> 10, so a peak of 53,885 produced an axis of
       100,000 and every bar sat in the bottom half of the plot. The extra rungs
       keep the tallest bar near the top where it can be read. */
    var step = n <= 1 ? 1 : n <= 1.5 ? 1.5 : n <= 2 ? 2 : n <= 2.5 ? 2.5
             : n <= 3 ? 3 : n <= 4 ? 4 : n <= 5 ? 5 : n <= 6 ? 6
             : n <= 7.5 ? 7.5 : n <= 8 ? 8 : 10;
    return step * mag;
  }

  /* ---------------------------------------------------------------
     Capsule bars — magnitude over an ordered period (the Donezo read).
     v === null means "not yet", drawn as hatch rather than a zero bar,
     because a zero bar and an unknown bar are different facts.
     One series, so no legend: the card title names it.
     Grid: four evenly spaced horizontal gridlines with the value they
     represent on the left, so a reader can place a bar's height without
     hovering it.
  ---------------------------------------------------------------- */
  function capsules(o) {
    /* Built from HTML rather than SVG on purpose: a stretched viewBox turns a
       circular cap into an ellipse, and the capsule end is the whole point. */
    var d = o.data || [];
    var rawMax = o.max || Math.max.apply(null, d.map(function (r) { return r.v || 0; }).concat([1]));
    var max = niceMax(rawMax);
    var bars = d.map(function (r) {
      var pending = r.v === null || r.v === undefined;
      var h = pending ? 58 : Math.max(9, 100 * (r.v / max));
      var val = pending ? 'Nothing yet' : r.v + (o.unit ? ' ' + o.unit : '');
      return '<div class="ukBars_c"><div class="ukBars_b' + (pending ? ' is-pending' : r.hi ? ' is-hi' : '') +
        '" style="height:' + h.toFixed(1) + '%" tabindex="0" role="img"' +
        ' data-tip="' + esc(r.k) + '|' + esc(val) + '"' +
        ' aria-label="' + esc(r.k) + ': ' + esc(val) + '"></div></div>';
    }).join('');
    var steps = 4;
    var axis = [];
    for (var i = steps; i >= 0; i--) {
      var v = Math.round(max * i / steps);
      axis.push('<span>' + v + '</span>');
    }
    return '<div class="ukCh ukCh--caps' + (o.cls ? ' ' + o.cls : '') + '" role="group" aria-label="' + esc(o.label || 'Chart') + '">' +
      '<div class="ukCh_plot">' +
        '<div class="ukCh_axis" aria-hidden="true">' + axis.join('') + '</div>' +
        '<div class="ukCh_grid"><div class="ukBars">' + bars + '</div></div>' +
      '</div>' +
      '<div class="ukCh_keys">' + d.map(function (r) {
        return '<span>' + esc(r.k) + '</span>'; }).join('') + '</div></div>';
  }

  /* ---------------------------------------------------------------
     Semi gauge — part-to-whole with a headline share in the middle.
     Legend is mandatory here (more than one category), and each row
     carries its own value so identity is never colour-alone.
  ---------------------------------------------------------------- */
  function semiGauge(o) {
    var segs = o.segs || [], id = 'ukh' + (++uid);
    var total = segs.reduce(function (a, s) { return a + s.v; }, 0) || 1;
    var R = 42, cx = 50, cy = 52, sw = 13, gapDeg = 3;
    function arc(a0, a1) {
      var p0 = [cx + R * Math.cos(Math.PI * a0 / 180), cy + R * Math.sin(Math.PI * a0 / 180)];
      var p1 = [cx + R * Math.cos(Math.PI * a1 / 180), cy + R * Math.sin(Math.PI * a1 / 180)];
      return 'M' + p0[0].toFixed(2) + ' ' + p0[1].toFixed(2) + 'A' + R + ' ' + R + ' 0 ' +
        (a1 - a0 > 180 ? 1 : 0) + ' 1 ' + p1[0].toFixed(2) + ' ' + p1[1].toFixed(2);
    }
    var at = 180, paths = '';
    segs.forEach(function (s, i) {
      var span = 180 * (s.v / total);
      var a0 = at + (i ? gapDeg / 2 : 0), a1 = at + span - (i < segs.length - 1 ? gapDeg / 2 : 0);
      at += span;
      if (a1 <= a0) return;
      var stroke = s.pending ? 'url(#' + id + ')' : 'var(--c' + (i + 1) + ')';
      paths += '<path class="ukCh_arc" d="' + arc(a0, a1) + '" fill="none" stroke="' + stroke +
        '" stroke-width="' + sw + '" stroke-linecap="round" tabindex="0"' +
        ' data-tip="' + esc(s.l) + '|' + s.v + (o.unit ? ' ' + o.unit : '') + '"' +
        ' aria-label="' + esc(s.l) + ': ' + s.v + '"></path>';
    });
    var legend = segs.map(function (s, i) {
      return '<li><span class="ukCh_sw' + (s.pending ? ' is-hatch' : '') + '" data-c="' + (i + 1) + '"></span>' +
        '<span class="ukCh_lg_l">' + esc(s.l) + '</span>' +
        '<span class="ukCh_lg_v">' + s.v + '</span></li>';
    }).join('');
    return '<div class="ukCh ukCh--gauge">' +
      '<div class="ukCh_dial"><svg viewBox="0 0 100 62" role="group" aria-label="' + esc(o.label || 'Breakdown') + '">' +
      '<defs>' + hatch(id) + '</defs>' + paths + '</svg>' +
      '<div class="ukCh_mid"><strong>' + esc(o.center) + '</strong><span>' + esc(o.sub || '') + '</span></div></div>' +
      '<ul class="ukCh_lg">' + legend + '</ul></div>';
  }

  /* ---------------------------------------------------------------
     Ring — one value against its own target. A hero number that
     happens to have a dial, so no legend and no tooltip layer.
  ---------------------------------------------------------------- */
  function ring(o) {
    var pct = Math.max(0, Math.min(100, o.pct));
    var R = 40, C = 2 * Math.PI * R;
    var ticks = '';
    for (var i = 0; i < 60; i++) {
      var a = (i / 60) * 2 * Math.PI - Math.PI / 2;
      var r0 = 47, r1 = i % 5 === 0 ? 43 : 45;
      ticks += '<line x1="' + (50 + r0 * Math.cos(a)).toFixed(2) + '" y1="' + (50 + r0 * Math.sin(a)).toFixed(2) +
        '" x2="' + (50 + r1 * Math.cos(a)).toFixed(2) + '" y2="' + (50 + r1 * Math.sin(a)).toFixed(2) +
        '" stroke="currentColor" stroke-width=".8" opacity="' + (i % 5 === 0 ? '.34' : '.16') + '"/>';
    }
    return '<div class="ukCh ukCh--ring">' +
      '<svg viewBox="0 0 100 100" role="img" aria-label="' + esc(o.label || '') + ' ' + pct + '%">' +
      '<g class="ukCh_ticks">' + ticks + '</g>' +
      '<circle cx="50" cy="50" r="' + R + '" fill="none" stroke="var(--c1-track)" stroke-width="8"/>' +
      '<circle class="ukCh_ringv" cx="50" cy="50" r="' + R + '" fill="none" stroke="var(--c1)" stroke-width="8" ' +
      'stroke-linecap="round" stroke-dasharray="' + C.toFixed(2) + '" ' +
      'stroke-dashoffset="' + (C * (1 - pct / 100)).toFixed(2) + '" transform="rotate(-90 50 50)"/></svg>' +
      '<div class="ukCh_mid"><strong>' + esc(o.center) + '</strong><span>' + esc(o.sub || '') + '</span></div></div>';
  }

  /* ---------------------------------------------------------------
     Segmented share bar — the Crextio strip. Reads left to right as
     one whole; each segment is labelled in place, so no legend box.
  ---------------------------------------------------------------- */
  function segbar(o) {
    var segs = o.segs || [], id = 'ukh' + (++uid);
    var total = segs.reduce(function (a, s) { return a + s.v; }, 0) || 1;
    return '<div class="ukCh ukCh--seg"><svg width="0" height="0" aria-hidden="true"><defs>' + hatch(id) + '</defs></svg>' +
      '<div class="ukSeg">' + segs.map(function (s, i) {
        var pc = s.v / total * 100;
        return '<div class="ukSeg_i' + (s.pending ? ' is-hatch' : '') + '" data-c="' + (i + 1) + '" ' +
          'style="flex:' + pc.toFixed(3) + ' 1 0" tabindex="0" ' +
          'data-tip="' + esc(s.l) + '|' + esc(s.show != null ? s.show : s.v + (o.unit ? ' ' + o.unit : '')) + '" ' +
          'aria-label="' + esc(s.l) + ': ' + esc(s.show != null ? s.show : s.v) + '"><span>' +
          esc(s.show != null ? s.show : Math.round(pc) + '%') + '</span></div>';
      }).join('') + '</div>' +
      '<ul class="ukSeg_k">' + segs.map(function (s, i) {
        return '<li><span class="ukCh_sw' + (s.pending ? ' is-hatch' : '') + '" data-c="' + (i + 1) + '"></span>' +
          esc(s.l) + '</li>'; }).join('') + '</ul></div>';
  }

  /* ---------------------------------------------------------------
     Area — smooth trend with a crosshair. One series, so the title
     names it and no legend is needed. Same axis/gridline treatment as
     capsules(): four evenly spaced horizontal gridlines with the value
     they represent on the left.
  ---------------------------------------------------------------- */
  /* One series or two. Two share ONE scale on purpose: the whole point of putting
     pitches and stays on the same chart is that you can see the gap between them,
     and a second axis would have drawn that gap wherever it liked. */
  function area(o) {
    var d = o.data || [], d2 = o.data2 || null, W = 300, H = 96, pad = 6;
    var all = d.map(function (r) { return r.v || 0; })
      .concat((d2 || []).map(function (r) { return r.v || 0; }));
    var rawMax = Math.max.apply(null, all.concat([1]));
    var max = o.max || niceMax(rawMax * 1.08);
    function project(rows) {
      return rows.map(function (r, i) {
        return [pad + (W - pad * 2) * (rows.length === 1 ? .5 : i / (rows.length - 1)),
                H - 10 - (H - 24) * (r.v / max)];
      });
    }
    var pt = project(d);
    /* Catmull-Rom to cubic, so the curve passes through every real reading */
    function curve(p) {
      var out = 'M' + p[0][0].toFixed(2) + ' ' + p[0][1].toFixed(2);
      for (var i = 0; i < p.length - 1; i++) {
        var p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
        out += 'C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(2) + ' ' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(2) +
          ' ' + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(2) + ' ' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(2) +
          ' ' + p2[0].toFixed(2) + ' ' + p2[1].toFixed(2);
      }
      return out;
    }
    var line = curve(pt);
    var pt2 = d2 && d2.length ? project(d2) : null;
    var line2 = pt2 ? curve(pt2) : '';
    var gid = 'ukg' + (++uid);
    /* Dots are HTML, positioned in percent: the path may be stretched by the
       viewBox but a marker must stay a circle. */
    function marks(rows, p, unit, cls) {
      return rows.map(function (r, i) {
        return '<button class="ukCh_dot' + (cls ? ' ' + cls : '') + '" type="button" style="left:' +
          (p[i][0] / W * 100).toFixed(2) + '%;top:' + (p[i][1] / H * 100).toFixed(2) + '%" ' +
          'data-tip="' + esc(r.k) + '|' + r.v + (unit ? ' ' + unit : '') + '" ' +
          'aria-label="' + esc(r.k) + ': ' + r.v + (unit ? ' ' + unit : '') + '"></button>';
      }).join('');
    }
    var dots = marks(d, pt, o.unit) + (pt2 ? marks(d2, pt2, o.unit2 || o.unit, 'ukCh_dot--b') : '');
    var steps = 4, axis = [];
    for (var s = steps; s >= 0; s--) {
      axis.push('<span>' + Math.round(max * s / steps) + '</span>');
    }
    return '<div class="ukCh ukCh--area" role="group" aria-label="' + esc(o.label || 'Trend') + '">' +
      '<div class="ukCh_plot">' +
        '<div class="ukCh_axis" aria-hidden="true">' + axis.join('') + '</div>' +
        '<div class="ukCh_grid">' +
          '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" aria-hidden="true">' +
          '<defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="var(--c1)" stop-opacity=".26"/>' +
          '<stop offset="1" stop-color="var(--c1)" stop-opacity="0"/></linearGradient></defs>' +
          '<path d="' + line + 'L' + pt[pt.length - 1][0].toFixed(2) + ' ' + H + 'L' + pt[0][0].toFixed(2) + ' ' + H + 'Z" fill="url(#' + gid + ')"/>' +
          '<path d="' + line + '" fill="none" stroke="var(--c1)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>' +
          (line2
            ? '<path d="' + line2 + '" fill="none" stroke="var(--c2)" stroke-width="2.2" ' +
              'stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>'
            : '') +
          '</svg>' + dots +
        '</div>' +
      '</div>' +
      '<div class="ukCh_keys">' + d.map(function (r) { return '<span>' + esc(r.k) + '</span>'; }).join('') + '</div>' +
      /* two series need naming; one names itself in the card's own title */
      (line2
        ? '<div class="ukCh_leg">' +
            '<span class="ukCh_leg_i"><i class="ukCh_sw"></i>' + esc(o.name || 'Series one') + '</span>' +
            '<span class="ukCh_leg_i"><i class="ukCh_sw ukCh_sw--b"></i>' + esc(o.name2 || 'Series two') + '</span>' +
          '</div>'
        : '') + '</div>';
  }

  /* A reading's own shape, inside its card. No axis, no labels and no dots: at
     this size they would be noise, and the number beside it is the fact. The
     line is the only thing that carries — is this going up or down. It takes the
     palette's colour by direction, so a fall is never drawn as a rise. */
  function spark(o) {
    var d = (o.data || []).filter(function (r) { return r && typeof r.v === 'number'; });
    if (d.length < 2) return '';
    var W = 120, H = 34, pad = 2;
    var vals = d.map(function (r) { return r.v; });
    var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals);
    var span = hi - lo || 1;
    var pt = d.map(function (r, i) {
      return [pad + (W - pad * 2) * (i / (d.length - 1)),
              H - pad - (H - pad * 2) * ((r.v - lo) / span)];
    });
    var line = 'M' + pt[0][0].toFixed(2) + ' ' + pt[0][1].toFixed(2);
    for (var i = 0; i < pt.length - 1; i++) {
      var p0 = pt[i - 1] || pt[i], p1 = pt[i], p2 = pt[i + 1], p3 = pt[i + 2] || p2;
      line += 'C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(2) + ' ' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(2) +
        ' ' + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(2) + ' ' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(2) +
        ' ' + p2[0].toFixed(2) + ' ' + p2[1].toFixed(2);
    }
    var up = d[d.length - 1].v >= d[0].v;
    var gid = 'uks' + (++uid);
    return '<span class="ukSpark' + (up ? '' : ' is-down') + '" aria-hidden="true">' +
      '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none">' +
      '<defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="currentColor" stop-opacity=".22"/>' +
      '<stop offset="1" stop-color="currentColor" stop-opacity="0"/></linearGradient></defs>' +
      '<path d="' + line + 'L' + W + ' ' + H + 'L0 ' + H + 'Z" fill="url(#' + gid + ')" stroke="none"/>' +
      '<path d="' + line + '" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>' +
      '</svg></span>';
  }

  /* =============================================================
     The shapes below were asked for by reference — dashboards the
     product owner liked the look of — and rebuilt in this palette
     rather than copied. No new colour language: teal is the live
     reading, gold is the one waiting on somebody, ink is the total.
  ============================================================= */

  /* RANKED — a big total with the rows it is made of underneath, each with its
     own mark and value. Reads as one fact and its breakdown, which a plain list
     never quite does. Pairs with the dotted globe above it. */
  function ranked(o) {
    var d = (o.data || []).slice(0, o.limit || 6);
    if (!d.length) return '';
    var max = Math.max.apply(null, d.map(function (r) { return r.v || 0; }).concat([1]));
    return '<div class="ukRank2" role="group" aria-label="' + esc(o.label || 'Ranked') + '">' +
      d.map(function (r) {
        return '<div class="ukRank2_i">' +
          (r.mark || '<span class="ukRank2_ph" aria-hidden="true"></span>') +
          '<span class="ukRank2_n">' + esc(r.k) + '</span>' +
          '<span class="ukRank2_bar" aria-hidden="true"><i style="width:' +
            (100 * (r.v / max)).toFixed(1) + '%"></i></span>' +
          '<span class="ukRank2_v">' + esc(r.show != null ? r.show : r.v) + '</span>' +
        '</div>';
      }).join('') + '</div>';
  }

  /* BUBBLES — a split where the sizes are the point. Four slices in a bar all
     look alike; four circles do not, and the biggest one is obvious before you
     have read a single number. Laid out by hand rather than packed, because a
     packing solver for four values is a lot of machinery for a shape that is
     always the same shape. */
  function bubbles(o) {
    var d = (o.data || []).slice(0, 4).sort(function (a, b) { return b.v - a.v; });
    if (!d.length) return '';
    var total = d.reduce(function (a, r) { return a + r.v; }, 0) || 1;
    /* Where each circle sits and how much of the box it may take. They OVERLAP
       on purpose: separated, four discs read as four unrelated readings, and the
       whole reason for this shape over a bar is that you see one audience with
       one dominant part of it. Ordered biggest first, and the stacking order is
       set so a smaller disc always sits over a larger one. */
    var SPOT = [
      { x: 33, y: 55, s: 1.00 },
      { x: 63, y: 30, s: 0.74 },
      { x: 66, y: 74, s: 0.64 },
      { x: 87, y: 45, s: 0.44 }
    ];
    var big = Math.sqrt(d[0].v);
    return '<div class="ukBub" role="group" aria-label="' + esc(o.label || 'Split') + '">' +
      d.map(function (r, i) {
        var sp = SPOT[i] || SPOT[3];
        /* area, not diameter, carries the value — a circle twice as wide is four
           times the ink, which would read as four times the number */
        var rel = Math.sqrt(r.v) / big;
        var size = Math.max(74, 210 * rel * sp.s);
        var pc = Math.round(r.v / total * 100);
        return '<span class="ukBub_i" data-c="' + (i + 1) + '" tabindex="0" ' +
          'style="width:' + size.toFixed(0) + 'px;height:' + size.toFixed(0) + 'px;' +
          'left:' + sp.x + '%;top:' + sp.y + '%;z-index:' + (i + 2) + '" ' +
          'data-tip="' + esc(r.k) + '|' + pc + '%" ' +
          'aria-label="' + esc(r.k) + ': ' + pc + '%">' +
          '<span class="ukBub_v">' + pc + '%</span>' +
          '<span class="ukBub_k">' + esc(r.k) + '</span></span>';
      }).join('') + '</div>';
  }

  /* PODIUM — first, second and third.

     It WAS three vertical columns with the title and the number inside them, and
     at a third of a card each that is about 110px of usable width: "Walking the
     old town" became "Walking the...", "34K plays" became "34K pla...". A chart
     that truncates the thing it is ranking is not ranking anything.

     Laid on its side there is a whole card width for the name, the bar still
     carries the "by how much", and the order is the reading order. */
  function podium(o) {
    var d = (o.data || []).slice(0, 3);
    if (d.length < 2) return '';
    var max = Math.max.apply(null, d.map(function (r) { return r.v || 0; }).concat([1]));
    return '<div class="ukPod" role="group" aria-label="' + esc(o.label || 'Top three') + '">' +
      d.map(function (r, i) {
        return '<div class="ukPod_i" data-c="' + (i + 1) + '" tabindex="0" ' +
          'data-tip="' + esc(r.k) + '|' + esc(r.show != null ? r.show : r.v) + '">' +
          '<span class="ukPod_r">' + (i + 1) + '</span>' +
          (r.img ? '<img class="ukPod_m" src="' + r.img + '" alt="" loading="lazy" decoding="async">' : '') +
          '<span class="ukPod_b">' +
            '<span class="ukPod_k">' + esc(r.k) + '</span>' +
            '<span class="ukPod_bar" aria-hidden="true"><i style="width:' +
              (100 * (r.v / max)).toFixed(1) + '%"></i></span>' +
          '</span>' +
          '<span class="ukPod_n">' +
            '<span class="ukPod_v">' + esc(r.show != null ? r.show : r.v) + '</span>' +
            (r.sub ? '<span class="ukPod_s">' + esc(r.sub) + '</span>' : '') +
          '</span>' +
        '</div>';
      }).join('') + '</div>';
  }

  /* SPLIT — one stacked bar and the table that reads it out. The bar gives the
     proportions at a glance and the rows give the numbers, so neither has to do
     both jobs badly. */
  function split(o) {
    var d = (o.data || []).filter(function (r) { return r.v; });
    if (!d.length) return '';
    var total = d.reduce(function (a, r) { return a + r.v; }, 0) || 1;
    return '<div class="ukSplit" role="group" aria-label="' + esc(o.label || 'Split') + '">' +
      (o.total != null
        ? '<p class="ukSplit_t">' + esc(o.total) + '</p>' +
          (o.totalSub ? '<p class="ukSplit_ts">' + esc(o.totalSub) + '</p>' : '')
        : '') +
      '<div class="ukSplit_bar">' + d.map(function (r, i) {
        return '<span class="ukSplit_s" data-c="' + (i + 1) + '" tabindex="0" ' +
          'style="flex:' + (r.v / total * 100).toFixed(3) + ' 1 0" ' +
          'data-tip="' + esc(r.k) + '|' + Math.round(r.v / total * 100) + '%" ' +
          'aria-label="' + esc(r.k) + '"></span>';
      }).join('') + '</div>' +
      '<div class="ukSplit_rows">' +
        '<div class="ukSplit_h"><span>' + esc(o.nameCol || 'What') + '</span>' +
          '<span>Share</span><span>' + esc(o.valCol || 'Total') + '</span></div>' +
        d.map(function (r, i) {
          return '<div class="ukSplit_r">' +
            '<span class="ukSplit_n"><i class="ukSplit_d" data-c="' + (i + 1) + '"></i>' + esc(r.k) + '</span>' +
            '<span class="ukSplit_p">' + Math.round(r.v / total * 100) + '%</span>' +
            '<span class="ukSplit_v">' + esc(r.show != null ? r.show : r.v) + '</span>' +
          '</div>';
        }).join('') +
      '</div></div>';
  }

  /* SCORE — a mark out of a hundred, drawn as an arc, with the reading beside
     it. Used where a single verdict is genuinely useful and the number alone
     would be a bare assertion. */
  function score(o) {
    var pct = Math.max(0, Math.min(100, o.v));
    var R = 34, C = Math.PI * R;      /* half circumference: this is a half arc */
    return '<div class="ukScoreArc" role="img" aria-label="' + esc(o.label || 'Score') + ': ' + pct + '">' +
      '<svg viewBox="0 0 100 62" aria-hidden="true">' +
        '<path d="M16 52a34 34 0 0 1 68 0" fill="none" stroke="var(--c1-track)" ' +
          'stroke-width="9" stroke-linecap="round"/>' +
        '<path d="M16 52a34 34 0 0 1 68 0" fill="none" stroke="var(--c1)" stroke-width="9" ' +
          'stroke-linecap="round" stroke-dasharray="' + C.toFixed(2) + '" ' +
          'stroke-dashoffset="' + (C * (1 - pct / 100)).toFixed(2) + '"/>' +
      '</svg>' +
      '<span class="ukScoreArc_v">' + pct + '<em>/' + (o.of || 100) + '</em></span>' +
      (o.sub ? '<span class="ukScoreArc_s">' + esc(o.sub) + '</span>' : '') +
    '</div>';
  }

  /* METER — one proportion as a plain track. For a two-way split where a whole
     segmented bar would be three components for one number. */
  function meter(o) {
    var pct = Math.max(0, Math.min(100, o.pct));
    return '<div class="ukMeter" role="img" aria-label="' + esc(o.label || '') + '">' +
      (o.l || o.r
        ? '<div class="ukMeter_lb"><span>' + esc(o.l || '') + '</span><span>' + esc(o.r || '') + '</span></div>'
        : '') +
      '<div class="ukMeter_t"><i style="width:' + pct.toFixed(1) + '%"></i></div>' +
    '</div>';
  }

  /* ---------------------------------------------------------------
     Hover layer. An SVG chart in a browser is interactive by default,
     so every mark that carries data-tip gets a tooltip and a focus
     ring. One delegated listener for the whole document.
  ---------------------------------------------------------------- */
  var tip;
  function show(el) {
    var parts = (el.getAttribute('data-tip') || '').split('|');
    if (!parts[0]) return;
    if (!tip) { tip = document.createElement('div'); tip.className = 'ukTip'; tip.setAttribute('role','status'); document.body.appendChild(tip); }
    tip.innerHTML = '<span class="ukTip_k">' + esc(parts[0]) + '</span><span class="ukTip_v">' + esc(parts[1] || '') + '</span>';
    tip.classList.add('is-on');
    var r = el.getBoundingClientRect();
    var t = tip.getBoundingClientRect();
    var left = r.left + r.width / 2 - t.width / 2;
    tip.style.left = Math.max(8, Math.min(window.innerWidth - t.width - 8, left)) + 'px';
    tip.style.top = (r.top - t.height - 10 < 8 ? r.bottom + 10 : r.top - t.height - 10) + 'px';
  }
  function hide() { if (tip) tip.classList.remove('is-on'); }

  document.addEventListener('pointerover', function (e) {
    var el = e.target.closest && e.target.closest('[data-tip]'); if (el) show(el);
  });
  document.addEventListener('pointerout', function (e) {
    if (e.target.closest && e.target.closest('[data-tip]')) hide();
  });
  document.addEventListener('focusin', function (e) {
    var el = e.target.closest && e.target.closest('[data-tip]'); if (el) show(el);
  });
  document.addEventListener('focusout', hide);
  window.addEventListener('scroll', hide, true);

  return { capsules: capsules, semiGauge: semiGauge, ring: ring, segbar: segbar,
           area: area, spark: spark, ranked: ranked, bubbles: bubbles, podium: podium,
           split: split, score: score, meter: meter };
})();
