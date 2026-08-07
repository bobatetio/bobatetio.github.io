/* Creator orbit — creator portraits laid out on a Fibonacci sphere that shares
   the dotted globe's radius, tilt and rotation, so the faces read as pinned to
   points on the Earth rather than floating loose over it. Positions are
   projected through the same perspective camera globe-originkit.js uses, so the
   two stay locked no matter how the emblem is sized. Each badge fades out as it
   passes behind the limb and back in on the other side. */
(function () {
  /* Resolve assets from this script's own location, so the same file works on the
     local server and under the / GitHub Pages base without editing paths. */
  var BASE = (function () {
    var s = (document.currentScript && document.currentScript.src) || '';
    var i = s.indexOf('/assets/js/');
    return i > -1 ? s.slice(0, i) : '';
  })();
  var SRC = [];
  for (var oi = 1; oi <= 11; oi++) {
    SRC.push(BASE + '/assets/img/uk/orbit/orbit-' + (oi < 10 ? '0' : '') + oi + '.webp');
  }

  // ---- camera + rotation, mirrored from globe-originkit.js -------------------
  // The globe publishes its live rotation on window.__ukGlobe; these constants
  // are the fallback for when three.js or the land mask never loads.
  var FOV = 50;
  var SCALE_CFG = 8;
  var SCALE_MUL = 0.2 + ((SCALE_CFG - 1) / 19) * 1.8;
  var GLOBE_R = SCALE_MUL;
  var CAM_D = 2.5 / SCALE_MUL;
  var TILT = (22 * Math.PI) / 180;   // CFG.initialLatitude
  var LON0 = (-28 * Math.PI) / 180;  // CFG.initialLongitude
  var STEP = -0.18 * 0.01;           // speed 2, direction 'left'
  var LERP = 0.104;                  // smoothing 8

  // ---- orbit tuning ---------------------------------------------------------
  var ORBIT_MUL = 1.07;          // just clear of the surface, so faces peek past the limb
  var SIZE_RATIO = 0.076;        // badge diameter at the globe's centre plane, as a share of the emblem
  /* A mount can override the ratio with --orbit-ratio, so the same component can
     sit in a huge hero and in a small onboarding panel and read correctly in both. */
  function ratioFor(el) {
    var v = parseFloat(getComputedStyle(el).getPropertyValue('--orbit-ratio'));
    return isFinite(v) && v > 0 ? v : SIZE_RATIO;
  }
  var BREATHE = 0.016;           // radial drift, keeps them feeling airborne without unpinning them
  var FADE_ARC = (26 * Math.PI) / 180; // how far before the limb a face starts dissolving

  function smoothstep(a, b, x) {
    var t = (x - a) / (b - a);
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    return t * t * (3 - 2 * t);
  }

  // Evenly spaced points on a unit sphere, offset so none land on the poles.
  function fibonacciSphere(n) {
    var pts = [], ga = Math.PI * (3 - Math.sqrt(5));
    for (var i = 0; i < n; i++) {
      var y = 1 - (2 * i + 1) / n;
      var r = Math.sqrt(Math.max(0, 1 - y * y));
      var th = i * ga;
      pts.push([Math.cos(th) * r, y, Math.sin(th) * r]);
    }
    return pts;
  }

  function build(field) {
    var pts = fibonacciSphere(SRC.length);
    var items = [];

    for (var i = 0; i < SRC.length; i++) {
      var item = document.createElement('div');
      item.className = 'ukOrbit_item';
      var disc = document.createElement('span');
      disc.className = 'ukOrbit_disc';
      disc.style.transitionDelay = (0.09 * i).toFixed(2) + 's';
      var img = document.createElement('img');
      img.src = SRC[i];
      img.alt = '';
      img.width = 240;
      img.height = 240;
      img.loading = 'lazy';
      img.decoding = 'async';
      disc.appendChild(img);
      item.appendChild(disc);
      field.appendChild(item);
      items.push({ el: item, p: pts[i], phase: i * 1.7 });
    }

    // The stat callouts sit at fixed spots over the emblem; a face drifting under
    // one of them recedes so the figures stay readable. Measured from the live
    // DOM so the zones follow the callouts if they ever move.
    var zones = [];
    function measureZones() {
      zones = [];
      var host = field.parentNode;
      if (!host) return;
      var fb = field.getBoundingClientRect();
      var cx = fb.left + fb.width / 2, cy = fb.top + fb.height / 2;
      var badges = host.querySelectorAll('[data-stat-badge]');
      for (var i = 0; i < badges.length; i++) {
        var b = badges[i].getBoundingClientRect();
        if (!b.width || !b.height) continue;
        zones.push({ x: b.left + b.width / 2 - cx, y: b.top + b.height / 2 - cy, rx: b.width / 2, ry: b.height / 2 });
      }
    }

    var badgePx = 0;
    function measure() {
      var h = field.clientHeight || field.offsetHeight || 0;
      badgePx = h * ratioFor(field);
      field.style.setProperty('--orbit-size', badgePx.toFixed(2) + 'px');
      measureZones();
      return h;
    }
    var boxH = measure();

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var rot = LON0, target = LON0;

    function draw(t) {
      if (!boxH) return;
      var live = window.__ukGlobe;
      var rotY, tilt, gR, camD, fov;
      if (live) {
        rotY = live.rotY; tilt = live.tiltX; gR = live.radius; camD = live.camera; fov = live.fov;
      } else {
        // globe never mounted — run the same rotation locally so the ring still turns
        if (!reduce) { target += STEP; rot += (target - rot) * LERP; }
        rotY = rot; tilt = TILT; gR = GLOBE_R; camD = CAM_D; fov = FOV;
      }
      var orbitR = gR * ORBIT_MUL;
      var f = (boxH / 2) / Math.tan((fov * Math.PI) / 360);
      var cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      var cosT = Math.cos(tilt), sinT = Math.sin(tilt);

      // Angle off the camera axis at which the globe starts eclipsing a badge —
      // the line of sight goes tangent to the sphere there. Solving m(theta)=gR
      // for cos(theta) gives this; it moves with the orbit radius, so the fade
      // stays glued to the real limb instead of a tuned-by-eye constant.
      var occ = (gR * gR - Math.sqrt((camD * camD - gR * gR) * (orbitR * orbitR - gR * gR))) / (camD * orbitR);
      occ = occ < -1 ? -1 : occ > 1 ? 1 : occ;
      var fadeLo = occ;
      var fadeHi = Math.cos(Math.max(0, Math.acos(occ) - FADE_ARC));

      for (var i = 0; i < items.length; i++) {
        var it = items[i], p = it.p;
        var r = orbitR;
        if (!reduce) r *= 1 + BREATHE * Math.sin(t * 0.0007 + it.phase);

        // three.js applies Euler 'XYZ' as Rx · Ry, matching globeGroup's rotation
        var x0 = p[0] * r, y0 = p[1] * r, z0 = p[2] * r;
        var x1 = x0 * cosY + z0 * sinY;
        var z1 = -x0 * sinY + z0 * cosY;
        var y2 = y0 * cosT - z1 * sinT;
        var z2 = y0 * sinT + z1 * cosT;

        var depth = camD - z2;
        if (depth <= 0.01) { it.el.style.opacity = '0'; continue; }

        var alpha = smoothstep(fadeLo, fadeHi, z2 / r);

        var sx = (x1 / depth) * f;
        var sy = -(y2 / depth) * f;
        var sc = camD / depth;

        var half = (badgePx * sc) / 2;
        for (var z = 0; z < zones.length; z++) {
          var zn = zones[z];
          var ddx = (sx - zn.x) / (zn.rx + half);
          var ddy = (sy - zn.y) / (zn.ry + half);
          var yielded = 0.28 + 0.72 * smoothstep(0.72, 1.12, Math.sqrt(ddx * ddx + ddy * ddy));
          if (yielded < 1) alpha *= yielded;
        }

        it.el.style.transform =
          'translate3d(calc(-50% + ' + sx.toFixed(2) + 'px), calc(-50% + ' + sy.toFixed(2) + 'px), 0) scale(' + sc.toFixed(4) + ')';
        it.el.style.opacity = alpha.toFixed(3);
        it.el.style.zIndex = String(Math.round(400 - depth * 60));
      }
    }

    var raf = null;
    function frame(t) { draw(t || 0); raf = requestAnimationFrame(frame); }
    function start() { if (raf === null) raf = requestAnimationFrame(frame); }
    function stop() { if (raf !== null) { cancelAnimationFrame(raf); raf = null; } }

    draw(0);

    if ('ResizeObserver' in window) {
      new ResizeObserver(function () { boxH = measure(); draw(0); }).observe(field);
    } else {
      window.addEventListener('resize', function () { boxH = measure(); draw(0); });
    }

    if ('IntersectionObserver' in window) {
      var seen = false;
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            if (!seen) { seen = true; field.classList.add('is-in'); }
            if (reduce) draw(0); else start();
          } else {
            stop();
          }
        });
      }, { threshold: 0 }).observe(field);
    } else {
      field.classList.add('is-in');
      if (!reduce) start();
    }
  }

  function init() {
    var field = document.getElementById('ukCreatorOrbit');
    if (!field || field.dataset.orbit === '1') return;
    field.dataset.orbit = '1';
    try { build(field); } catch (e) { /* decorative — never block the page */ }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  document.addEventListener('swup:contentReplaced', init);
})();
