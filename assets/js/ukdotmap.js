/* Ukreate — the dotted globe.

   Same visual language as the hero globe: land as a field of dots, ocean a plain
   paper disc. Built rather than borrowed, for three reasons that all still hold:

     - No tile provider ships a dot-matrix style, so any of them would have meant a
       raster map that looks nothing like the rest of the product.
     - Mapbox and friends need an access token this project does not have, and a key
       is a deployment dependency for what is essentially a locator.
     - The land data is already here. The hero globe loads Natural Earth 50m land and
       rasterises it at runtime; this reads a grid precomputed from that same file,
       so the two surfaces cannot drift apart.

   Orthographic, because a market picker is about *where on earth* rather than about
   streets. Land is cached once as unit vectors and only rotated per frame, which is
   what makes a spinning 25k-dot sphere cheap enough to animate. Routes are true
   great circles lifted off the surface, so they arc the way a flight does and pass
   behind the globe when the leg wraps around the far side.

   Nothing is drawn until a market is chosen: an empty map with pins already on it
   reads as a result, and there is no result to show yet.

   // PLUG-IN POINT — geocoding.
   to() and pins() take coordinates. Callers resolve a name to a point through the
   lookups they already own (UKCITYMAP.CITIES on the hotel side, DESTS on the creator
   side). A real geocoder replaces those without touching this file. */
window.UKDOTMAP = (function () {
  var GRID_URL = '/assets/data/land-grid.json';
  var grid = null, loading = null;
  var D2R = Math.PI / 180;

  /* the hotspot badge is the real Ukreate mark, not a drawn stand-in — loaded once
     and shared by every globe instance, since it never changes between them */
  var MARK_W = 123, MARK_H = 148;   // the source SVG's own box, for its aspect ratio
  var markImg = new Image();
  var markReady = false;
  markImg.onload = function () { markReady = true; };
  markImg.src = '/assets/img/ukreate-mark.svg';

  function loadGrid() {
    if (grid) return Promise.resolve(grid);
    if (loading) return loading;
    loading = fetch(GRID_URL).then(function (r) { return r.json(); }).then(function (j) {
      var bin = atob(j.bits);
      var bytes = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      grid = { w: j.w, h: j.h, bytes: bytes, rowBytes: j.w >> 3 };
      return grid;
    }).catch(function () { return null; });
    return loading;
  }

  function isLand(g, lng, lat) {
    if (!g || lat > 90 || lat < -90) return false;
    var x = Math.floor(((lng + 180) / 360) * g.w);
    var y = Math.floor(((90 - lat) / 180) * g.h);
    x = ((x % g.w) + g.w) % g.w;
    if (y < 0 || y >= g.h) return false;
    return !!(g.bytes[y * g.rowBytes + (x >> 3)] & (128 >> (x & 7)));
  }

  function cssVar(el, k, fallback) {
    var v = getComputedStyle(el).getPropertyValue(k).trim();
    return v || fallback;
  }

  function vec(lat, lng) {
    var la = lat * D2R, lo = lng * D2R, c = Math.cos(la);
    return { x: c * Math.sin(lo), y: Math.sin(la), z: c * Math.cos(lo) };
  }

  /* Land as unit vectors, built once per dot spacing and reused every frame. The
     lattice thins toward the poles so spacing stays even on the sphere instead of
     bunching at the top. */
  var cache = {};
  function landPoints(stepDeg) {
    var key = stepDeg.toFixed(2);
    if (cache[key]) return cache[key];
    var out = [];
    for (var lat = -84; lat <= 84; lat += stepDeg) {
      var cosLat = Math.cos(Math.abs(lat) * D2R);
      var lngStep = cosLat > 0.02 ? stepDeg / cosLat : 360;
      for (var lng = -180; lng < 180; lng += lngStep) {
        if (!isLand(grid, lng, lat)) continue;
        var v = vec(lat, lng);
        out.push(v.x, v.y, v.z);
      }
    }
    var arr = new Float32Array(out);
    cache[key] = arr;
    return arr;
  }

  function mount(host, opts) {
    opts = opts || {};
    host.classList.add('ukMap--live');

    var cv = document.createElement('canvas');
    cv.className = 'ukMap_cv';
    /* The leader line and its dot live in their own layer, under every label card,
       at a fixed low z-index — never mixed into a pin's own z-index. A pin's label
       is stacked by depth so nearer ones sit on top of farther ones, but a stem is
       part of the SAME box as its label in CSS, so giving the pin z-index moves its
       stem with it: a background pin lifted to clear a clash would then draw its
       stem right over a foreground pin's card. Splitting them into a layer that is
       always beneath every card, regardless of depth, is the only way a stem can
       never cross a label it doesn't belong to. */
    var stemLayer = document.createElement('div');
    stemLayer.className = 'ukMap_stems';
    var layer = document.createElement('div');
    layer.className = 'ukMap_pins';
    host.appendChild(cv);
    host.appendChild(stemLayer);
    host.appendChild(layer);
    var ctx = cv.getContext('2d');

    var view = {
      lat: opts.lat === undefined ? 16 : opts.lat,
      lng: opts.lng === undefined ? 10 : opts.lng,
      zoom: opts.zoom || 1
    };
    var HOME = { lat: view.lat, lng: view.lng, zoom: view.zoom };
    var MIN_Z = 0.85, MAX_Z = 4.2;

    var pins = [], nodes = [], stemNodes = [], anim = null, raf = null, loop = null;
    var spots = [];   // registered hotels/brands — ambient texture, not interactive
    var T0 = performance.now(), idleAt = 0;
    var REDUCED = window.matchMedia &&
                  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var SPIN = REDUCED ? 0 : 0.055;   // degrees per frame, only while nothing is picked

    /* the usual map furniture, as real buttons so they are reachable by keyboard */
    var ui = document.createElement('div');
    ui.className = 'ukMap_ui';
    ui.innerHTML =
      '<button class="ukMap_b" type="button" data-mz="in"  aria-label="Zoom in">+</button>' +
      '<button class="ukMap_b" type="button" data-mz="out" aria-label="Zoom out">−</button>' +
      '<button class="ukMap_b" type="button" data-mz="home" aria-label="Reset the view">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" ' +
        'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg></button>';
    host.appendChild(ui);
    ui.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-mz]'); if (!btn) return;
      var k = btn.dataset.mz;
      touched();
      if (k === 'home') return to(HOME.lat, HOME.lng, HOME.zoom);
      to(view.lat, view.lng, clampZ(view.zoom * (k === 'in' ? 1.45 : 0.69)));
    });

    function clampZ(z) { return Math.max(MIN_Z, Math.min(MAX_Z, z)); }
    function touched() { idleAt = performance.now(); }

    host.addEventListener('wheel', function (e) {
      e.preventDefault();
      touched();
      view.zoom = clampZ(view.zoom * (e.deltaY > 0 ? 0.94 : 1.06));
      schedule();
    }, { passive: false });

    /* ---- the projection ----
       Rotate the point into camera space, then drop z. X is the screen offset, Y is
       up, Z is toward the viewer: Z > 0 is the near hemisphere, everything else is
       around the back of the globe. */
    var c0 = { sinLat: 0, cosLat: 1, sinLng: 0, cosLng: 1, R: 1, cx: 0, cy: 0 };
    function setCam(w, h) {
      var la0 = view.lat * D2R, lo0 = view.lng * D2R;
      c0.sinLat = Math.sin(la0); c0.cosLat = Math.cos(la0);
      c0.sinLng = Math.sin(lo0); c0.cosLng = Math.cos(lo0);
      c0.R = Math.min(w, h) * 0.46 * view.zoom;
      c0.cx = w / 2; c0.cy = h / 2;
    }
    function rot(x, y, z) {
      var X = x * c0.cosLng - z * c0.sinLng;
      var zp = x * c0.sinLng + z * c0.cosLng;
      return {
        X: X,
        Y: c0.cosLat * y - c0.sinLat * zp,
        Z: c0.sinLat * y + c0.cosLat * zp
      };
    }
    /* k lifts a point off the surface (routes arc above it). A lifted point stays
       visible past the limb, so the occlusion test is "behind the globe AND inside
       its silhouette" rather than simply Z < 0. */
    function proj(lat, lng, k) {
      var v = vec(lat, lng), r = rot(v.x, v.y, v.z);
      k = k || 1;
      var sx = c0.cx + c0.R * r.X * k;
      var sy = c0.cy - c0.R * r.Y * k;
      var vis = r.Z > 0 || Math.sqrt(r.X * r.X + r.Y * r.Y) * k > 1;
      return { x: sx, y: sy, z: r.Z, vis: vis };
    }

    function build() {
      layer.innerHTML = pins.map(function (p, i) {
        return '<span class="ukMapPin" data-pin="' + i + '">' +
          (p.cc ? '<img class="ukMapPin_f" src="/assets/img/flags/' + p.cc + '.svg" alt="" ' +
                  'loading="lazy" decoding="async">' : '') +
          '<span class="ukMapPin_b">' +
            '<span class="ukMapPin_n">' + String(p.name || '').replace(/[&<>"]/g, '') + '</span>' +
            (p.sub ? '<span class="ukMapPin_s">' + String(p.sub).replace(/[&<>"]/g, '') + '</span>' : '') +
          '</span></span>';
      }).join('');
      nodes = [].slice.call(layer.children);
      /* one stem per pin, same index order — the placement loop below positions
         each pair together */
      stemLayer.innerHTML = pins.map(function () { return '<span class="ukMapStem"></span>'; }).join('');
      stemNodes = [].slice.call(stemLayer.children);
    }

    function draw() {
      var now = performance.now() - T0;
      var rect = host.getBoundingClientRect();
      var w = Math.max(1, Math.round(rect.width));
      var h = Math.max(1, Math.round(rect.height));
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      /* backing store only — the CSS box is 100% of the host, so no pixel width is
         written back onto the element */
      if (cv.width !== w * dpr || cv.height !== h * dpr) {
        cv.width = w * dpr; cv.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      setCam(w, h);

      var R = c0.R, cx = c0.cx, cy = c0.cy;
      var ink = cssVar(host, '--map-dot', 'rgba(16,46,55,.32)');
      var hot = cssVar(host, '--map-dot-on', '#d7a543');
      var sea = cssVar(host, '--map-sea', '#e9e3d6');

      /* the ball itself */
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, 6.2832);
      ctx.fillStyle = sea;
      ctx.fill();

      /* graticule, faint — it is what makes the sphere read as turning */
      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.clip();
      ctx.strokeStyle = cssVar(host, '--map-grid', 'rgba(16,46,55,.09)');
      ctx.lineWidth = 1;
      var g, t, q, started;
      for (g = -60; g <= 60; g += 30) {                     // parallels
        ctx.beginPath(); started = false;
        for (t = -180; t <= 180; t += 6) {
          q = proj(g, t, 1);
          if (!q.vis || q.z <= 0) { started = false; continue; }
          if (!started) { ctx.moveTo(q.x, q.y); started = true; } else ctx.lineTo(q.x, q.y);
        }
        ctx.stroke();
      }
      for (g = -180; g < 180; g += 30) {                    // meridians
        ctx.beginPath(); started = false;
        for (t = -84; t <= 84; t += 4) {
          q = proj(t, g, 1);
          if (!q.vis || q.z <= 0) { started = false; continue; }
          if (!started) { ctx.moveTo(q.x, q.y); started = true; } else ctx.lineTo(q.x, q.y);
        }
        ctx.stroke();
      }
      ctx.restore();

      /* ---- land ----
         Spacing is chosen in screen pixels and then cached by angle, so zooming
         rebuilds the lattice once rather than every frame. */
      var stepDeg = Math.max(0.7, 180 / Math.max(26, (Math.PI * R) / 5.2));
      stepDeg = Math.round(stepDeg * 20) / 20;
      var pts = grid ? landPoints(stepDeg) : new Float32Array(0);
      /* size the dot from the gap between dots, not from the radius: derived from the
         radius alone they fuse into a solid mass the moment the globe is zoomed in */
      var base = Math.max(0.55, R * stepDeg * D2R * 0.32);

      /* pins as unit vectors once, so the ripple test below is a dot product */
      var pv = pins.map(function (p) { return vec(p.lat, p.lng); });
      /* the halo is sized in screen space, so zooming in tightens the patch of
         pulsing ground instead of flooding the whole view with gold */
      var nearDeg = Math.max(2.6, Math.min(11, 9 / view.zoom));
      var NEAR = 2 - 2 * Math.cos(nearDeg * D2R);

      for (var i = 0; i < pts.length; i += 3) {
        var r = rot(pts[i], pts[i + 1], pts[i + 2]);
        if (r.Z <= 0.01) continue;
        var x = cx + R * r.X, y = cy - R * r.Y;
        if (x < -4 || x > w + 4 || y < -4 || y > h + 4) continue;

        /* Distance to the nearest pin drives both the colour and the ripple: the
           phase lags with distance, so the pulse travels outward from the place
           rather than every dot blinking together. */
        var best = 9;
        for (var j = 0; j < pv.length; j++) {
          var dp = pts[i] * pv[j].x + pts[i + 1] * pv[j].y + pts[i + 2] * pv[j].z;
          var ch = 2 - 2 * dp;
          if (ch < best) best = ch;
        }
        var rad = base * (0.42 + 0.58 * r.Z);

        if (best < NEAR) {
          var d = Math.sqrt(best) / Math.sqrt(NEAR);        // 0 at the pin, 1 at the edge
          var wave = REDUCED ? 0.5 : 0.5 + 0.5 * Math.sin(now * 0.0024 - d * 4.2);
          var fall = 1 - d;
          ctx.globalAlpha = Math.min(1, (0.4 + 0.6 * wave * fall) * (0.35 + 0.65 * r.Z));
          ctx.fillStyle = hot;
          ctx.beginPath();
          ctx.arc(x, y, rad * (1.1 + 0.6 * wave * fall), 0, 6.2832);
          ctx.fill();
        } else {
          ctx.globalAlpha = 0.5 + 0.5 * r.Z;
          ctx.fillStyle = ink;
          ctx.beginPath();
          ctx.arc(x, y, rad, 0, 6.2832);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      /* ---- hotspots ----
         Every hotel or brand already on Ukreate, marked with the real Ukreate mark —
         not a drawn stand-in — so a cluster reads as "Ukreate is here" at a glance
         instead of an unexplained dot. Drawn after the land so it sits on the globe,
         and before the routes and pins so a picked market still reads as foreground. */
      if (spots.length && markReady) {
        /* sized well past "technically visible": the mark carries real detail (a
           pin shape with a play triangle inside it), and it only reads at a glance
           if it is drawn big enough to actually see that detail */
        var mh = Math.max(17, R * 0.15);
        var mw = mh * (MARK_W / MARK_H);
        for (var hI = 0; hI < spots.length; hI++) {
          var hr = rot(spots[hI].x, spots[hI].y, spots[hI].z);
          if (hr.Z <= 0.02) continue;
          var hx = cx + R * hr.X, hy = cy - R * hr.Y;
          if (hx < -mw || hx > w + mw || hy < -mh || hy > h + mh) continue;
          var k2 = 0.55 + 0.45 * hr.Z;

          /* a soft field behind it, so several close together read as a dense patch
             even before any one mark is picked out individually */
          ctx.globalAlpha = 0.16 * k2;
          ctx.fillStyle = hot;
          ctx.beginPath(); ctx.arc(hx, hy, mh * 0.85, 0, 6.2832); ctx.fill();

          ctx.globalAlpha = k2;
          ctx.drawImage(markImg, hx - mw * k2 / 2, hy - mh * k2 / 2, mw * k2, mh * k2);
        }
        ctx.globalAlpha = 1;
      }

      /* ---- routes ----
         Great circles between the markets in the order they were picked, lifted off
         the surface so a leg reads as a flight rather than a border. Drawn before
         the pins so no line crosses a label. */
      if (pins.length > 1) {
        ctx.save();
        ctx.strokeStyle = hot;
        ctx.lineWidth = 1.4;
        ctx.setLineDash([4, 4]);
        for (var a = 0; a < pins.length - 1; a++) {
          var p1 = pv[a], p2 = pv[a + 1];
          var dot = Math.max(-1, Math.min(1, p1.x * p2.x + p1.y * p2.y + p1.z * p2.z));
          var om = Math.acos(dot);
          if (om < 0.02) continue;
          var sinOm = Math.sin(om);
          var arc = Math.min(0.16, 0.045 + om * 0.05);
          var path = [], STEPS = 64;
          for (var s = 0; s <= STEPS; s++) {
            var k = s / STEPS;
            var A = Math.sin((1 - k) * om) / sinOm, B = Math.sin(k * om) / sinOm;
            var vx = p1.x * A + p2.x * B, vy = p1.y * A + p2.y * B, vz = p1.z * A + p2.z * B;
            var lift = 1 + Math.sin(k * Math.PI) * arc;
            var rr = rot(vx, vy, vz);
            var vis = rr.Z > 0 ||
                      Math.sqrt(rr.X * rr.X + rr.Y * rr.Y) * lift > 1;
            path.push(vis ? { x: cx + R * rr.X * lift, y: cy - R * rr.Y * lift } : null);
          }
          /* the leg is stroked in runs, so it disappears behind the globe cleanly */
          ctx.globalAlpha = 0.6;
          ctx.beginPath();
          var open = false;
          for (var s2 = 0; s2 < path.length; s2++) {
            var pt = path[s2];
            if (!pt) { open = false; continue; }
            if (!open) { ctx.moveTo(pt.x, pt.y); open = true; } else ctx.lineTo(pt.x, pt.y);
          }
          ctx.stroke();

          /* a plane on the leg, turned along the path, only when its stretch shows */
          var m = Math.floor(path.length / 2), mid = null, nxt = null;
          for (var o = 0; o < 12 && !mid; o++) {
            if (path[m + o] && path[m + o + 1]) { mid = path[m + o]; nxt = path[m + o + 1]; }
            else if (path[m - o] && path[m - o + 1]) { mid = path[m - o]; nxt = path[m - o + 1]; }
          }
          if (!mid) continue;
          ctx.save();
          ctx.setLineDash([]);
          ctx.globalAlpha = 0.95;
          ctx.translate(mid.x, mid.y);
          ctx.rotate(Math.atan2(nxt.y - mid.y, nxt.x - mid.x));
          ctx.beginPath();
          ctx.moveTo(6.5, 0); ctx.lineTo(-4.5, 3.6);
          ctx.lineTo(-2.6, 0); ctx.lineTo(-4.5, -3.6);
          ctx.closePath();
          ctx.fillStyle = hot; ctx.fill();
          ctx.restore();
        }
        ctx.restore();
      }

      /* ---- pins ----
         DOM, not canvas, so a flag and real text render properly. They ride the same
         projection, so they stay put as the globe turns, and vanish with the point
         they name when it rolls around the back. Two markets close together would
         stack their labels, so a second pass lifts any that overlap one already
         placed — the stem stretches instead, keeping each label on its own point. */
      var placed = [];
      var order = pins.map(function (p, i) {
        return { i: i, q: proj(p.lat, p.lng, 1) };
      }).filter(function (o) {
        var q = o.q, n = nodes[o.i], sn = stemNodes[o.i];
        if (!n) return false;
        /* Zoomed in, the sphere is wider than the box and a market can sit off to
           the side. Its label can only slide so far before the stem would leave the
           chip, so a point outside the frame drops out entirely rather than showing a
           clipped label pointing at nothing — the chips above the map still list it. */
        if (q.z <= 0.02 || q.x < 10 || q.x > w - 10 || q.y < -30 || q.y > h - 4) {
          n.style.display = 'none'; if (sn) sn.style.display = 'none'; return false;
        }
        n.style.display = '';
        if (sn) sn.style.display = '';
        return true;
      });
      /* Southernmost first. Lifting only ever moves a label up, so placing from the
         bottom keeps a northern market above a southern one — resolve them in any
         other order and the labels come out geographically upside down. */
      order.sort(function (a, b) { return b.q.y - a.q.y; });

      order.forEach(function (o) {
        var n = nodes[o.i], q = o.q;
        var bw = n.offsetWidth || 110, bh = n.offsetHeight || 30;
        var lift = 0, guard = 0;
        while (guard++ < 3) {
          var clash = placed.some(function (t) {
            return Math.abs(t.x - q.x) < (t.w + bw) / 2 - 6 &&
                   Math.abs(t.y - (q.y - lift)) < bh + 5;
          });
          if (!clash) break;
          lift += bh + 5;
        }
        /* a label pushed off the top is worse than two that touch, so give it back */
        if (q.y - lift < bh + 8) lift = 0;

        /* The chip is CENTRED on the point it names. It used to be anchored 14px
           to the left of it, which put a 78px label 25px right of its own point —
           and on a map showing one pin, that label is the heaviest thing on screen,
           so a perfectly centred globe read as pushed to the right. Wide labels
           leaned further than narrow ones, which is why it looked inconsistent.

           A pin near the frame edge still slides back inside; that slide is now
           symmetric, because the stem sits under the chip's centre rather than
           near its left edge. */
        var left = q.x - bw / 2;
        var want = Math.max(8, Math.min(w - bw - 8, left));
        var dx = want - left;

        placed.push({ x: left + dx, y: q.y - lift, w: bw });
        n.style.transform = 'translate3d(' + (left + dx).toFixed(1) + 'px,' + (q.y - lift).toFixed(1) + 'px,0)';
        n.style.opacity = String(Math.min(1, 0.25 + q.z * 3));
        n.style.zIndex = String(1000 + Math.round(q.z * 100) + Math.round(lift));

        /* The stem is computed here rather than left to CSS, because it has to reach
           from wherever the label actually ended up (after the lift above) down to
           the true point on the globe (q.x, q.y, never lifted) — the two can be a
           long way apart once a clash has pushed a label up. Its own layer keeps it
           under every card regardless. */
        var sn = stemNodes[o.i];
        if (sn) {
          var stemX = q.x + dx * 0.25;              // the true point, leaning only if the chip was clamped
          var stemTop = q.y - lift - 46 + bh;        // the label's own bottom edge
          var stemH = Math.max(0, q.y - stemTop);
          sn.style.transform = 'translate3d(' + stemX.toFixed(1) + 'px,' + stemTop.toFixed(1) + 'px,0)';
          sn.style.height = stemH.toFixed(1) + 'px';
          sn.style.opacity = n.style.opacity;
        }
      });
    }

    function schedule() {
      if (raf) return;
      raf = requestAnimationFrame(function () { raf = null; draw(); });
    }

    function to(lat, lng, zoom, instant) {
      var from = { lat: view.lat, lng: view.lng, zoom: view.zoom };
      var dLng = lng - from.lng;
      while (dLng > 180) dLng -= 360;
      while (dLng < -180) dLng += 360;
      var target = {
        lat: Math.max(-85, Math.min(85, lat)),
        lng: from.lng + dLng,
        zoom: clampZ(zoom || view.zoom)
      };
      if (anim) { cancelAnimationFrame(anim); anim = null; }
      if (instant || REDUCED) {
        view.lat = target.lat; view.lng = target.lng; view.zoom = target.zoom;
        return draw();
      }
      var t0 = null, MS = 760;
      (function step(ts) {
        if (t0 === null) t0 = ts;
        var k = Math.min(1, (ts - t0) / MS);
        var e = 1 - Math.pow(1 - k, 3);
        view.lat  = from.lat  + (target.lat  - from.lat)  * e;
        view.lng  = from.lng  + (target.lng  - from.lng)  * e;
        view.zoom = from.zoom + (target.zoom - from.zoom) * e;
        draw();
        if (k < 1) anim = requestAnimationFrame(step);
      })(performance.now());
    }

    /* Turn the globe so every picked market is on the near face, as tight as it can
       be without pushing one to the limb where its label would be unreadable. */
    function frame() {
      if (!pins.length) return;
      var vs = pins.map(function (p) { return vec(p.lat, p.lng); });

      /* Weighted toward the market just added. A plain centroid can put the newest
         pick on the far side of the globe — you choose Bali and nothing appears —
         so the last one pulls the view toward itself and is always in view. */
      var sx = 0, sy = 0, sz = 0;
      vs.forEach(function (v, i) {
        var wt = i === vs.length - 1 ? 2.5 : 1;
        sx += v.x * wt; sy += v.y * wt; sz += v.z * wt;
      });
      var len = Math.sqrt(sx * sx + sy * sy + sz * sz) || 1;
      sx /= len; sy /= len; sz /= len;

      /* if the newest is still near the limb, look straight at it instead */
      var last = vs[vs.length - 1];
      if (last.x * sx + last.y * sy + last.z * sz < Math.cos(58 * D2R)) {
        sx = last.x; sy = last.y; sz = last.z;
      }
      var lat = Math.asin(Math.max(-1, Math.min(1, sy))) / D2R;
      var lng = Math.atan2(sx, sz) / D2R;

      /* Zoom to the pins this face can show. If any market is off the back, hold the
         view wide instead — tightening onto the near ones would push the far ones
         further out of sight, which is the opposite of what picking one asked for. */
      var wide = 0, off = false;
      vs.forEach(function (v) {
        var dp = Math.max(-1, Math.min(1, v.x * sx + v.y * sy + v.z * sz));
        if (dp > Math.cos(72 * D2R)) wide = Math.max(wide, Math.acos(dp));
        else off = true;
      });
      var z = off ? 1.0
            : wide < 0.08 ? 1.7
            : 0.86 / Math.max(0.22, Math.sin(wide));
      /* it has to stay a globe: past about 1.7 the limb leaves the frame and the
         thing on screen is just a patch of dots */
      /* Capped at 1: past that the sphere's limb leaves its own box, and a globe
         cropped by its frame reads as a texture stuck in a corner rather than a
         map. Getting closer is what rotating is for. */
      to(lat, lng, Math.max(0.95, Math.min(1, z)));
    }

    /* ---- drag to rotate ---- */
    var drag = null;
    host.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.ukMapPin') || e.target.closest('.ukMap_ui')) return;
      drag = { x: e.clientX, y: e.clientY, lat: view.lat, lng: view.lng };
      host.setPointerCapture(e.pointerId);
      host.classList.add('is-grabbing');
      touched();
      if (anim) { cancelAnimationFrame(anim); anim = null; }
    });
    host.addEventListener('pointermove', function (e) {
      if (!drag) return;
      /* a drag across the disc turns it half a revolution */
      var perPx = 90 / Math.max(40, c0.R);
      view.lng = drag.lng - (e.clientX - drag.x) * perPx;
      view.lat = Math.max(-85, Math.min(85, drag.lat + (e.clientY - drag.y) * perPx));
      touched();
      schedule();
    });
    function endDrag() { drag = null; host.classList.remove('is-grabbing'); }
    host.addEventListener('pointerup', endDrag);
    host.addEventListener('pointercancel', endDrag);

    /* One rAF loop. It runs while a market is pulsing, and while the empty globe is
       turning on its own; it stops entirely once neither is true. */
    function run() {
      if (loop) { cancelAnimationFrame(loop); loop = null; }
      if (REDUCED) return;
      (function tick() {
        /* the host is moved in and out of the dropdown, so the loop stops itself the
           moment it is off the page rather than animating a canvas nobody can see */
        if (!host.isConnected) { loop = null; return; }
        /* the idle spin is for the empty state — once markets are picked the globe
           holds still so the labels stay put and readable */
        if (!pins.length && !drag && performance.now() - idleAt > 2200) {
          view.lng -= SPIN;
        }
        draw();
        loop = requestAnimationFrame(tick);
      })();
    }

    var api = {
      el: host,
      draw: draw,
      to: to,
      frame: frame,
      pins: function (list) {
        pins = (list || []).slice();
        build(); draw();
        if (pins.length) frame();
        run();
        return api;
      },
      /* Set once and left alone — unlike pins, these never move the view or carry a
         label, so there is nothing here for a repaint to react to. */
      hotspots: function (list) {
        spots = (list || []).map(function (p) { return vec(p.lat, p.lng); });
        schedule();
        return api;
      },
      /* called when the host is put back on the page after a repaint */
      resume: function () { draw(); run(); return api; },
      view: view
    };

    loadGrid().then(function () { draw(); run(); });
    window.addEventListener('resize', schedule);
    return api;
  }

  return { mount: mount, loadGrid: loadGrid };
})();
