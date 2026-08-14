/* Ukreate — the flat dotted world map.

   Replaces the spinning globe (assets/js/ukdotmap.js, no longer loaded) with a flat,
   always-fully-visible dotted map — the same land data, the same dot-field language,
   the same colour tokens (--map-dot / --map-dot-on / --map-sea / --map-grid /
   --uk-gold), but laid out equirectangular rather than orthographic, and able to draw
   an animated curved line from a "home" point to every other pin — which the globe
   never did, and which is the one real new capability this file adds.

   Land is the same precomputed grid the globe reads (assets/data/land-grid.json), so
   this surface and the old one (where it is still used, if anywhere) can never drift
   apart. Rendered as one static SVG dot-field, built once per host and never redrawn
   per frame — a flat map has nothing to rotate, so there is no animation loop to run
   at all outside the pin layer's own CSS/SMIL animations.

   Pins keep the exact shape the globe's pins() already took — {id, lat, lng, name,
   sub, cc, on} — so callers do not change beyond swapping which engine they mount.
   The pin marked "on" (or pins[0] if none is) is the line's start; every other pin
   gets a curved arc drawn to it. A single pin gets its marker with no line — there
   is nothing to connect it to. */
window.UKWORLDMAP = (function () {
  var GRID_URL = '/assets/data/land-grid.json';
  var grid = null, loading = null;
  var VB_W = 1000, VB_H = 500;

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

  /* Flat equirectangular projection onto the 1000x500 viewBox — the same formula
     an SVG dotted-map or a flight-path map always uses. */
  function project(lat, lng) {
    return { x: (lng + 180) * (VB_W / 360), y: (90 - lat) * (VB_H / 180) };
  }

  /* Land as flat points, built once and reused by every instance — a fixed lattice,
     not something that needs rebuilding per zoom the way the globe's did, since this
     map never rotates and only ever shows the whole world. Longitude spacing widens
     toward the poles (divided by cos(lat)) so the lattice reads evenly once stretched
     flat instead of bunching at the equator and thinning at the poles the way a
     naive fixed-step grid would under this projection. */
  var landCache = null;
  function landPoints() {
    if (landCache) return landCache;
    var stepDeg = 1.4;
    var out = [];
    for (var lat = -84; lat <= 84; lat += stepDeg) {
      var cosLat = Math.max(0.12, Math.cos(lat * Math.PI / 180));
      var lngStep = stepDeg / cosLat;
      for (var lng = -180; lng < 180; lng += lngStep) {
        if (!isLand(grid, lng, lat)) continue;
        var p = project(lat, lng);
        out.push(p.x, p.y);
      }
    }
    landCache = new Float32Array(out);
    return landCache;
  }

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; }); }

  var NS = 'http://www.w3.org/2000/svg';
  function svgEl(tag, attrs) {
    var el = document.createElementNS(NS, tag);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  }

  /* A curved path between two points, the same construction a flight-path map
     always uses: bow the midpoint up, away from whichever point is higher, so a
     line between two close points still reads as an arc and not a straight rule. */
  function curve(a, b) {
    var mx = (a.x + b.x) / 2, my = Math.min(a.y, b.y) - Math.max(24, Math.abs(a.x - b.x) * 0.14);
    return 'M ' + a.x + ' ' + a.y + ' Q ' + mx + ' ' + my + ' ' + b.x + ' ' + b.y;
  }

  function mount(host, opts) {
    opts = opts || {};
    host.classList.add('ukMap--live');

    var svg = svgEl('svg', { viewBox: '0 0 ' + VB_W + ' ' + VB_H, class: 'ukMap_svg',
      preserveAspectRatio: 'xMidYMid meet' });
    var sea = svgEl('rect', { x: 0, y: 0, width: VB_W, height: VB_H, class: 'ukMap_sea' });
    var dotLayer = svgEl('g', { class: 'ukMap_dots' });
    var arcLayer = svgEl('g', { class: 'ukMap_arcs' });
    var pinLayer = svgEl('g', { class: 'ukMap_pinDots' });
    svg.appendChild(sea);
    svg.appendChild(dotLayer);
    svg.appendChild(arcLayer);
    svg.appendChild(pinLayer);
    host.appendChild(svg);

    /* the label chips are real DOM, positioned by percentage over the SVG, so text
       stays crisp and selectable the same way the globe's pin cards always were */
    var labelLayer = document.createElement('div');
    labelLayer.className = 'ukMap_pins';
    host.appendChild(labelLayer);

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

    var view = { lat: opts.lat === undefined ? 0 : opts.lat, lng: opts.lng === undefined ? 0 : opts.lng,
      zoom: opts.zoom || 1 };
    var HOME = { lat: view.lat, lng: view.lng, zoom: view.zoom };
    var MIN_Z = 1, MAX_Z = 5;
    var pinsData = [], pinChips = [];

    function clampZ(z) { return Math.max(MIN_Z, Math.min(MAX_Z, z)); }

    /* zoom/pan is a plain CSS transform on the SVG (the dots and pin dots) —
       a flat map has no camera to rotate, only a window to move. The label
       LAYER gets the same transform, so a chip's POSITION still tracks its
       point correctly at any pan/zoom; but each chip then gets its own
       counter-scale of 1/zoom, so the chip's own SIZE and its type stay
       exactly as designed regardless of zoom. A label is read, not zoomed —
       it should look the same whether the map under it is at 1x or 5x. */
    function apply(instant) {
      var p = project(view.lat, view.lng);
      /* At MIN_Z the visible window already equals the whole 1000x500 map, so
         there is no room to centre on anything — a translate here just pushes
         the map (and its sea rect) off to one side and exposes blank frame on
         the other, exactly the "white space" bug this caused. Clamping the
         centre to how far the window can actually move keeps it a no-op at
         MIN_Z and a partial pan near an edge at any zoom, instead of a flat
         translate that assumes there is always room. */
      var maxOffX = Math.max(0, (VB_W - VB_W / view.zoom) / 2);
      var maxOffY = Math.max(0, (VB_H - VB_H / view.zoom) / 2);
      var cx = Math.min(VB_W / 2 + maxOffX, Math.max(VB_W / 2 - maxOffX, p.x));
      var cy = Math.min(VB_H / 2 + maxOffY, Math.max(VB_H / 2 - maxOffY, p.y));
      var tx = (VB_W / 2 - cx) * (view.zoom / VB_W) * 100;
      var ty = (VB_H / 2 - cy) * (view.zoom / VB_H) * 100;
      var t = 'scale(' + view.zoom + ') translate(' + tx / view.zoom + '%, ' + ty / view.zoom + '%)';
      var dur = instant ? 'none' : 'transform .5s cubic-bezier(.2,.7,.3,1)';
      svg.style.transition = labelLayer.style.transition = dur;
      svg.style.transformOrigin = labelLayer.style.transformOrigin = '50% 50%';
      svg.style.transform = labelLayer.style.transform = t;
      var inv = 1 / view.zoom;
      pinChips.forEach(function (chip) {
        chip.style.transition = dur;
        chip.style.transform = 'translate(-50%,calc(-100% - 10px)) scale(' + inv + ')';
      });
      host.classList.toggle('is-pannable', view.zoom > MIN_Z + 0.001);
    }
    function to(lat, lng, zoom, instant) {
      view.lat = lat; view.lng = lng; view.zoom = clampZ(zoom || view.zoom);
      apply(instant);
    }

    /* At MIN_Z the whole world is on screen and every pin reads as a speck —
       "zoomed out" and "showing the map properly" are not the same thing. This
       picks the tightest zoom that still keeps every point in the given list
       inside the frame (with room for its label chip), centred on their
       midpoint, instead of every map defaulting to the full flat world. One
       point gets a fixed, comfortably-close zoom since there is no spread to
       measure. */
    function fitFor(list) {
      if (!list || !list.length) return { lat: 0, lng: 0, zoom: MIN_Z };
      var minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
      list.forEach(function (p) {
        if (p.lat < minLat) minLat = p.lat;
        if (p.lat > maxLat) maxLat = p.lat;
        if (p.lng < minLng) minLng = p.lng;
        if (p.lng > maxLng) maxLng = p.lng;
      });
      var lat = (minLat + maxLat) / 2, lng = (minLng + maxLng) / 2;
      var spanLat = maxLat - minLat, spanLng = maxLng - minLng;
      if (spanLat < 6 && spanLng < 6) return { lat: lat, lng: lng, zoom: 3.4 };
      var pad = 1.5;
      return { lat: lat, lng: lng, zoom: clampZ(Math.min(360 / (spanLng * pad), 180 / (spanLat * pad))) };
    }
    function fit(list, instant) {
      var f = fitFor(list || pinsData);
      to(f.lat, f.lng, f.zoom, instant);
      return f;
    }

    ui.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-mz]'); if (!btn) return;
      var k = btn.dataset.mz;
      if (k === 'home') return to(HOME.lat, HOME.lng, HOME.zoom);
      to(view.lat, view.lng, clampZ(view.zoom * (k === 'in' ? 1.35 : 0.74)));
    });

    /* drag to pan — the one piece of the old globe (rotate) this map never
       carried over. A flat map has no rotation, only a window sliding over a
       fixed surface, so a pixel of drag converts straight to degrees via the
       same linear projection everything else here already uses. */
    var drag = null;
    function rectW() { return host.getBoundingClientRect().width || 1; }
    /* at MIN_Z the whole world already fits the box — there is nowhere left
       to pan to, and dragging just crops one edge and shows blank space
       past the other (exactly what happened before this check existed).
       Panning only starts to mean something once zoomed in past that. */
    function canPan() { return view.zoom > MIN_Z + 0.001; }
    function onDown(e) {
      if (!canPan() || e.target.closest('[data-mz]') || e.target.closest('[data-pin]')) return;
      drag = { x: e.clientX, y: e.clientY, lat: view.lat, lng: view.lng };
      host.classList.add('is-grabbing');
      host.setPointerCapture && host.setPointerCapture(e.pointerId);
    }
    function onMove(e) {
      if (!drag) return;
      var w = rectW();
      var degPerPx = (VB_W / w) * (360 / VB_W) / view.zoom;   /* = (360/w)/zoom */
      var dLng = (e.clientX - drag.x) * degPerPx;
      var dLat = (e.clientY - drag.y) * degPerPx * (VB_H / VB_W);
      view.lng = drag.lng - dLng;
      view.lat = Math.max(-85, Math.min(85, drag.lat + dLat));
      apply(true);
    }
    function onUp(e) {
      if (!drag) return;
      drag = null;
      host.classList.remove('is-grabbing');
      host.releasePointerCapture && e && host.releasePointerCapture(e.pointerId);
    }
    host.addEventListener('pointerdown', onDown);
    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerup', onUp);
    host.addEventListener('pointercancel', onUp);

    function drawLand() {
      dotLayer.textContent = '';
      var pts = grid ? landPoints() : new Float32Array(0);
      var frag = document.createDocumentFragment();
      var r = 1.15;
      for (var i = 0; i < pts.length; i += 2) {
        var c = svgEl('circle', { cx: pts[i], cy: pts[i + 1], r: r, class: 'ukMap_dot' });
        frag.appendChild(c);
      }
      dotLayer.appendChild(frag);
    }

    /* Arcs are opt-in, not automatic. They tell one true story — home base out
       to everywhere this person has shot — and that story only exists on a
       page that actually has a home pin (a creator's own profile). A plain
       browsing map (every hosted stay, every creator on the roster) has no
       "home" among its pins; drawing radiating lines from an arbitrary first
       one to a few dozen others is not a route, it is noise, and at any real
       pin count it reads as the whole map sitting crooked rather than as
       a map with too many lines on it. */
    var lastOpts = {};
    function build(list, opts) {
      opts = lastOpts = opts || lastOpts || {};
      pinsData = list || [];
      arcLayer.textContent = '';
      pinLayer.textContent = '';
      labelLayer.innerHTML = '';
      if (!pinsData.length) return;

      var home = pinsData.filter(function (p) { return p.on; })[0] || pinsData[0];
      var homePt = project(home.lat, home.lng);
      var drawArcs = !!opts.arcs && pinsData.length > 1 && pinsData.length <= 8;
      pinChips = [];

      pinsData.forEach(function (p, i) {
        var pt = project(p.lat, p.lng);
        var isHome = p === home;

        if (drawArcs && !isHome) {
          var path = svgEl('path', {
            d: curve(homePt, pt), class: 'ukMap_arc', style: 'animation-delay:' + (i * .18) + 's'
          });
          arcLayer.appendChild(path);
        }

        var dot = svgEl('circle', { cx: pt.x, cy: pt.y, r: isHome ? 5 : 4,
          class: 'ukMap_pinDot' + (p.on ? ' is-on' : '') });
        pinLayer.appendChild(dot);
        var ring = svgEl('circle', { cx: pt.x, cy: pt.y, r: isHome ? 5 : 4,
          class: 'ukMap_pinRing' + (p.on ? ' is-on' : ''), style: 'animation-delay:' + (i * .18) + 's' });
        pinLayer.appendChild(ring);

        var chip = document.createElement('span');
        chip.className = 'ukMapPin' + (p.on ? ' is-on' : '');
        chip.dataset.pin = String(i);
        chip.style.left = (pt.x / VB_W * 100) + '%';
        chip.style.top = (pt.y / VB_H * 100) + '%';
        chip.innerHTML = (p.cc ? '<img class="ukMapPin_f" src="/assets/img/flags/' + esc(p.cc) +
            '.svg" alt="" loading="lazy" decoding="async">' : '') +
          '<span class="ukMapPin_b"><span class="ukMapPin_n">' + esc(p.name || '') + '</span>' +
          (p.sub ? '<span class="ukMapPin_s">' + esc(p.sub) + '</span>' : '') + '</span>';
        labelLayer.appendChild(chip);
        pinChips.push(chip);
      });
      var inv = 1 / view.zoom;
      pinChips.forEach(function (c) { c.style.transform = 'translate(-50%,calc(-100% - 10px)) scale(' + inv + ')'; });
    }

    loadGrid().then(function () { drawLand(); apply(true); });

    return {
      el: host,
      view: view,
      draw: function () {},
      to: to,
      fit: fit,
      frame: function () {},
      pins: build,
      hotspots: function () {},
      resume: function () { if (host.parentNode) { drawLand(); build(pinsData); apply(true); } }
    };
  }

  return { mount: mount, loadGrid: loadGrid };
})();
