/* Ukreate — city globe for hotel onboarding.

   The decorative orbit put creator faces on a Fibonacci sphere: pretty, but it said
   nothing. This places REAL creators at their REAL coordinates, aims the globe at the
   city the hotel just typed, and shows how thick the coverage is around that point.

   It reuses globe-originkit's scene and camera rather than drawing a second one, so
   the markers stay locked to the surface: same radius, same rotation, same
   perspective, same limb occlusion.

   // PLUG-IN POINT — geocoding.
   CITIES is a small lookup covering the markets in the seeded data. Replace resolve()
   with a real geocoder (Mapbox Geocoding, Google Places, Nominatim) and everything
   downstream keeps working: it only needs {lat, lng, label} back.

   // PLUG-IN POINT — tiles.
   This draws our own dotted globe. To move to Mapbox GL with `projection: 'globe'`,
   replace the renderer here and feed it the same resolve() output and creator list.
   That needs a Mapbox access token, which the project does not have yet. */
window.UKCITYMAP = (function () {
  var RAD = Math.PI / 180;

  /* PLUG-IN POINT — geocoding lookup */
  var CITIES = {
    'miami':      [25.76, -80.19], 'florida':  [27.99, -81.76],
    'london':     [51.51,  -0.13], 'lisbon':   [38.72,  -9.14],
    'marrakesh':  [31.63,  -8.00], 'marrakech':[31.63,  -8.00],
    'oslo':       [59.91,  10.75], 'kyoto':    [35.01, 135.77],
    'sydney':     [-33.87, 151.21],'tulum':    [20.21, -87.46],
    'zermatt':    [46.02,   7.75], 'accra':    [ 5.60,  -0.19],
    'munich':     [48.14,  11.58], 'paris':    [48.86,   2.35],
    'new york':   [40.71, -74.01], 'barcelona':[41.39,   2.17],
    'cape town':  [-33.92, 18.42], 'bali':     [-8.34, 115.09],
    'dubai':      [25.20,  55.27], 'tokyo':    [35.68, 139.69]
  };

  function resolve(city) {
    var key = String(city || '').toLowerCase().trim();
    if (!key) return null;
    var hit = Object.keys(CITIES).filter(function (k) { return key.indexOf(k) > -1; })[0];
    return hit ? { lat: CITIES[hit][0], lng: CITIES[hit][1], label: city.trim() } : null;
  }

  /* great-circle distance in km, for the density read */
  function km(aLat, aLng, bLat, bLng) {
    var dLat = (bLat - aLat) * RAD, dLng = (bLng - aLng) * RAD;
    var s = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(aLat * RAD) * Math.cos(bLat * RAD) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 6371 * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  }

  function vec(lat, lng) {
    var la = lat * RAD, lo = lng * RAD;
    return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)];
  }
  function smoothstep(a, b, x) {
    var t = (x - a) / (b - a); t = t < 0 ? 0 : t > 1 ? 1 : t;
    return t * t * (3 - 2 * t);
  }

  var MARKER_MUL = 1.045;   // markers sit just off the surface
  var GLOBE_R = 1, CAM_D = 3.2, FOV = 50;

  var field = null, items = [], raf = null, ratio = 0.13, cityPin = null;

  function build(host, people, city) {
    host.innerHTML = '';
    items = [];
    cityPin = null;

    if (city) {
      /* Dot only. A name written on the globe gets covered the moment a couple of
         creators land near it, and reads as debris when it does. The caption under
         the panel already names the city. */
      var cp = document.createElement('span');
      cp.className = 'ukCityPin';
      cp.innerHTML = '<span class="ukCityPin_dot"></span>';
      host.appendChild(cp);
      cityPin = { el: cp, p: vec(city.lat, city.lng) };
    }

    /* Everyone inside the reach radius sits within a few hundred kilometres of the
       city, which at this zoom is a couple of pixels: plotting each one by its own
       coordinates stacked thirty faces into a single blob. So the city keeps its real
       position and the people cluster around it in screen space, a sample of faces
       plus a counter carrying the rest. The number in the caption is still the true
       total; this is an avatar stack, not a claim about who lives where. */
    var FACES = 6;
    var shown = people.slice(0, FACES);
    var rest = people.length - shown.length;

    shown.forEach(function (c, i) {
      var el = document.createElement('span');
      el.className = 'ukCityMark is-near';
      var disc = document.createElement('span');
      disc.className = 'ukCityMark_d';
      disc.style.transitionDelay = (0.05 * i).toFixed(2) + 's';
      var img = document.createElement('img');
      img.src = c.img; img.alt = ''; img.width = 120; img.height = 120;
      img.loading = 'lazy'; img.decoding = 'async';
      disc.appendChild(img);
      el.appendChild(disc);
      host.appendChild(el);
      items.push({ el: el, ring: i, of: shown.length + (rest > 0 ? 1 : 0) });
    });

    if (rest > 0) {
      var more = document.createElement('span');
      more.className = 'ukCityMark ukCityMark--more is-near';
      more.innerHTML = '<span class="ukCityMark_d ukCityMark_more">+' + rest + '</span>';
      /* The delay belongs on the disc, exactly as it does for a face. On the outer
         marker it applied to the per-frame transform instead, restarting that
         transition every frame so it never got past the delay and the counter stayed
         at identity scale while every avatar around it scaled with the globe. */
      more.firstChild.style.transitionDelay = (0.05 * shown.length).toFixed(2) + 's';
      host.appendChild(more);
      items.push({ el: more, ring: shown.length, of: shown.length + 1 });
    }

    requestAnimationFrame(function () { host.classList.add('is-in'); });
  }

  function draw() {
    if (!field) return;
    var boxH = field.clientHeight || field.offsetHeight || 0;
    if (!boxH) { raf = requestAnimationFrame(draw); return; }

    var live = window.__ukGlobe;
    var rotY = live ? live.rotY : 0, tilt = live ? live.tiltX : 0;
    var gR = live ? live.radius : GLOBE_R;
    var camD = live ? live.camera : CAM_D, fov = live ? live.fov : FOV;

    var size = boxH * ratio;
    field.style.setProperty('--mark-size', size.toFixed(2) + 'px');

    var r = gR * MARKER_MUL;
    var f = (boxH / 2) / Math.tan((fov * Math.PI) / 360);
    var cosY = Math.cos(rotY), sinY = Math.sin(rotY);
    var cosT = Math.cos(tilt), sinT = Math.sin(tilt);

    /* the angle at which the sphere starts eclipsing a marker, solved rather than
       tuned, so the fade sits exactly on the visible limb */
    var occ = (gR * gR - Math.sqrt(Math.max(0, (camD * camD - gR * gR) * (r * r - gR * gR)))) / (camD * r);
    occ = occ < -1 ? -1 : occ > 1 ? 1 : occ;
    var fadeHi = Math.cos(Math.max(0, Math.acos(occ) - 0.22));

    function place(el, p, scaleMul) {
      var x0 = p[0] * r, y0 = p[1] * r, z0 = p[2] * r;
      var x1 = x0 * cosY + z0 * sinY;
      var z1 = -x0 * sinY + z0 * cosY;
      var y2 = y0 * cosT - z1 * sinT;
      var z2 = y0 * sinT + z1 * cosT;
      var depth = camD - z2;
      if (depth <= 0.01) { el.style.opacity = '0'; return null; }
      var alpha = smoothstep(occ, fadeHi, z2 / r);
      var sc = (camD / depth) * (scaleMul || 1);
      var px = (x1 / depth) * f, py = -(y2 / depth) * f;
      el.style.transform = 'translate3d(calc(-50% + ' + px.toFixed(2) + 'px), ' +
        'calc(-50% + ' + py.toFixed(2) + 'px), 0) scale(' + sc.toFixed(4) + ')';
      el.style.opacity = alpha.toFixed(3);
      el.style.zIndex = String(Math.round(400 - depth * 60));
      return { x: px, y: py, alpha: alpha, scale: sc, depth: depth };
    }

    /* a cluster member: same scale and fade as the city it belongs to, offset in
       screen space so the ring holds its shape as the globe turns */
    function placeAt(el, at, dx, dy) {
      el.style.transform = 'translate3d(calc(-50% + ' + (at.x + dx).toFixed(2) + 'px), ' +
        'calc(-50% + ' + (at.y + dy).toFixed(2) + 'px), 0) scale(' + at.scale.toFixed(4) + ')';
      el.style.opacity = at.alpha.toFixed(3);
      el.style.zIndex = String(Math.round(401 - at.depth * 60));
    }

    /* one projection for the city, and the cluster hangs off it */
    var anchor = cityPin ? place(cityPin.el, cityPin.p, 1) : null;
    if (anchor) {
      var ringR = size * 1.75;
      for (var i = 0; i < items.length; i++) {
        var a = (i / items.length) * Math.PI * 2 - Math.PI / 2;
        placeAt(items[i].el, anchor,
          Math.cos(a) * ringR, Math.sin(a) * ringR * 0.78);
      }
    } else {
      for (var j = 0; j < items.length; j++) items[j].el.style.opacity = '0';
    }

    raf = requestAnimationFrame(draw);
  }

  /* ---- public: point the globe at a city and show who covers it ---- */
  function show(opts) {
    field = document.getElementById('ukCityMarks');
    if (!field) return null;
    ratio = parseFloat(getComputedStyle(field).getPropertyValue('--mark-ratio')) || 0.13;

    var city = resolve(opts.city);
    var people = (opts.people || []).filter(function (c) {
      return typeof c.lat === 'number' && typeof c.lng === 'number';
    });

    var within = 0;
    if (city) {
      var reach = opts.radiusKm || 300;
      people.forEach(function (c) {
        c.d = km(city.lat, city.lng, c.lat, c.lng);
        c.near = c.d <= reach;
        if (c.near) within++;
      });
      /* nearest first, so the faces on show are the ones closest to the property */
      people = people.filter(function (c) { return c.near; })
                     .sort(function (a, b) { return a.d - b.d; });
    } else {
      /* Nothing to say yet. An empty globe that is simply turning reads as waiting;
         faces scattered over it before a city is chosen read as noise. */
      people = [];
    }

    build(field, people, city);

    if (window.UKGLOBE) {
      if (city) window.UKGLOBE.aim(city.lat, city.lng);
      else window.UKGLOBE.spin(true);
    }
    if (raf === null) raf = requestAnimationFrame(draw);

    return { city: city, total: people.length, within: within };
  }

  return { show: show, resolve: resolve, km: km, CITIES: CITIES };
})();
