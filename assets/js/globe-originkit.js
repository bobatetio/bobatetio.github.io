/* Originkit dots-globe, ported from React/three to a vanilla self-mounting
   script for the static Ukreate build. Renders a slowly rotating dotted Earth
   into #ukGlobe (the philosophy emblem slot). Colours are tuned to the site:
   a subtle dark-teal sphere, warm gold land dots, a faint teal graticule.
   Land mask is built with a plain equirectangular fill (no d3-geo). */
(function () {
  /* Resolve assets from this script's own location, so the same file works on the
     local server and under the / GitHub Pages base without editing paths. */
  var BASE = (function () {
    var s = (document.currentScript && document.currentScript.src) || '';
    var i = s.indexOf('/assets/js/');
    return i > -1 ? s.slice(0, i) : '';
  })();
  var LAND_URL = BASE + '/assets/data/ne_50m_land.json';

  // ---- palette (matches the site: gold #e6b64c, teal #65d2e9, bg #0d2026) ----
  var CFG = {
    speed: 2,
    smoothing: 8,
    /* Sits on a cream page, so the globe is a paper globe: a deeper cream sphere
       with deep-teal land, rather than the old dark sphere with gold land. */
    dots: { color: 'rgba(16,46,55,0.92)', size: 5, density: 10, allDots: false },
    fill: 'dots',
    scale: 8,
    direction: 'left',
    /* start over the land hemisphere: an ocean face reads as an empty ball */
    initialLatitude: 18,
    initialLongitude: 24,
    oceanColor: '#e6e0d3',
    graticuleColor: 'rgba(16,46,55,0.10)',
    showGrid: true,
    showOutline: false,
    outlineColor: 'rgba(230,182,76,0.55)',
    outlineWidth: 1,
    markers: []
  };

  function mapLinear(v, iMin, iMax, oMin, oMax) {
    if (iMax === iMin) return oMin;
    return oMin + ((v - iMin) / (iMax - iMin)) * (oMax - oMin);
  }
  function clampN(v, a, b) { return v < a ? a : v > b ? b : v; }
  function parseAlpha(str) {
    if (!str) return 1;
    var m = str.match(/rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*(?:,\s*([\d.]+)\s*)?\)/i);
    if (m) return m[1] !== undefined ? clampN(parseFloat(m[1]), 0, 1) : 1;
    return 1;
  }
  function latLngToPosition(lat, lng) {
    var la = lat * (Math.PI / 180), lo = lng * (Math.PI / 180);
    return { x: Math.cos(la) * Math.sin(lo), y: Math.sin(la), z: Math.cos(la) * Math.cos(lo) };
  }

  function build(container, THREE, land) {
    var w = container.clientWidth || container.offsetWidth || 800;
    var h = container.clientHeight || container.offsetHeight || 800;

    var scaleMultiplier = mapLinear(clampN(CFG.scale, 1, 20), 1, 20, 0.2, 2);
    var globeRadius = scaleMultiplier;
    var cameraDistance = 2.5 / scaleMultiplier;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 1e3);
    camera.position.set(0, 0, cameraDistance);
    camera.lookAt(0, 0, 0);

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    if ('outputColorSpace' in renderer) renderer.outputColorSpace = 'srgb';
    var canvas = renderer.domElement;
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.opacity = '0';
    canvas.style.transition = 'opacity 1s ease';
    container.appendChild(canvas);

    // rotation config
    var baseSpeed = CFG.speed === 0 ? 0 : mapLinear(clampN(CFG.speed, 0, 10), 0, 10, 0, 0.9);
    var rotationSpeed = CFG.direction === 'left' ? -baseSpeed : baseSpeed;
    var smoothingN = clampN(CFG.smoothing / 10, 0, 1);
    var lerpFactor = smoothingN === 0 ? 1 : mapLinear(smoothingN, 0, 1, 0.4, 0.03);

    // ---- ocean sphere ----
    var oceanRgba = parseAlpha(CFG.oceanColor);
    var ocean = new THREE.Mesh(
      new THREE.SphereGeometry(globeRadius, 64, 64),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(CFG.oceanColor), transparent: oceanRgba < 1, opacity: oceanRgba })
    );

    var globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroup.add(ocean);

    // ---- graticule ----
    if (CFG.showGrid && parseAlpha(CFG.graticuleColor) > 0) {
      var gMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(CFG.graticuleColor), transparent: true, opacity: parseAlpha(CFG.graticuleColor) });
      var gGroup = new THREE.Group();
      var addRing = function (pts) {
        if (pts.length < 2) return;
        var geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), pts.length * 2, 0.001, 6, false);
        gGroup.add(new THREE.Mesh(geo, gMat));
      };
      var step = 15;
      for (var lat = -75; lat <= 75; lat += step) {
        var pts = [];
        for (var i = 0; i <= 64; i++) { var lng = (i / 64) * 360 - 180; var p = latLngToPosition(lat, lng); pts.push(new THREE.Vector3(p.x * globeRadius, p.y * globeRadius, p.z * globeRadius)); }
        addRing(pts);
      }
      for (var lng2 = -180; lng2 < 180; lng2 += step) {
        var pts2 = [];
        for (var j = 0; j <= 64; j++) { var la2 = (j / 64) * 180 - 90; var p2 = latLngToPosition(la2, lng2); pts2.push(new THREE.Vector3(p2.x * globeRadius, p2.y * globeRadius, p2.z * globeRadius)); }
        addRing(pts2);
      }
      globeGroup.add(gGroup);
    }

    // ---- land mask (equirectangular fill) ----
    var BW = 2048, BH = 1024;
    var mc = document.createElement('canvas'); mc.width = BW; mc.height = BH;
    var mctx = mc.getContext('2d', { willReadFrequently: true });
    mctx.fillStyle = '#000'; mctx.fillRect(0, 0, BW, BH);
    mctx.fillStyle = '#fff'; mctx.beginPath();
    var drawRing = function (ring) {
      for (var k = 0; k < ring.length; k++) {
        var x = ((ring[k][0] + 180) / 360) * BW;
        var y = ((90 - ring[k][1]) / 180) * BH;
        if (k === 0) mctx.moveTo(x, y); else mctx.lineTo(x, y);
      }
      mctx.closePath();
    };
    (land.features || []).forEach(function (f) {
      var g = f.geometry; if (!g || !g.coordinates) return;
      if (g.type === 'Polygon') g.coordinates.forEach(drawRing);
      else if (g.type === 'MultiPolygon') g.coordinates.forEach(function (poly) { poly.forEach(drawRing); });
    });
    mctx.fill();
    var px = mctx.getImageData(0, 0, BW, BH).data;
    var isOnLand = function (lng, lat) {
      var x = Math.round(((lng + 180) / 360) * BW) % BW; if (x < 0) x += BW;
      var y = clampN(Math.round(((90 - lat) / 180) * BH), 0, BH - 1);
      return px[(y * BW + x) * 4] > 128;
    };

    // ---- optional coastline outlines ----
    if (CFG.showOutline && parseAlpha(CFG.outlineColor) > 0) {
      var oMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(CFG.outlineColor), transparent: parseAlpha(CFG.outlineColor) < 1, opacity: parseAlpha(CFG.outlineColor) });
      var oGroup = new THREE.Group();
      var ringToTube = function (ring) {
        if (ring.length < 2) return;
        var stepSz = Math.max(1, Math.floor(ring.length / 220));
        var pts = [];
        for (var i = 0; i < ring.length; i += stepSz) { var p = latLngToPosition(ring[i][1], ring[i][0]); pts.push(new THREE.Vector3(p.x * globeRadius, p.y * globeRadius, p.z * globeRadius)); }
        if (pts.length >= 2) oGroup.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), pts.length * 2, (CFG.outlineWidth / 10) * 0.01, 6, false), oMat));
      };
      (land.features || []).forEach(function (f) {
        var g = f.geometry; if (!g || !g.coordinates) return;
        if (g.type === 'Polygon') ringToTube(g.coordinates[0]);
        else if (g.type === 'MultiPolygon') g.coordinates.forEach(function (poly) { ringToTube(poly[0]); });
      });
      globeGroup.add(oGroup);
    }

    // ---- dots ----
    var dotRgba = parseAlpha(CFG.dots.color);
    var dotSizeMul = mapLinear(clampN(CFG.dots.size, 1, 10), 1, 10, 0.1, 0.5);
    var dotSpacing = mapLinear(clampN(CFG.dots.density, 1, 10), 1, 10, 24, 8);
    var coords = [];
    var baseStep = dotSpacing * 0.08;
    for (var dlat = -90; dlat <= 90; dlat += baseStep) {
      var cosLat = Math.cos((Math.abs(dlat) * Math.PI) / 180);
      var lngStep = cosLat > 0.01 ? baseStep / Math.max(0.3, cosLat) : 360;
      for (var dlng = -180; dlng < 180; dlng += lngStep) {
        if (CFG.dots.allDots || isOnLand(dlng, dlat)) coords.push([dlng, dlat]);
      }
    }
    if (coords.length) {
      var dGeo = new THREE.SphereGeometry(0.01 * dotSizeMul, 5, 5);
      var dMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(CFG.dots.color), transparent: dotRgba < 1, opacity: dotRgba });
      var inst = new THREE.InstancedMesh(dGeo, dMat, coords.length);
      var mtx = new THREE.Matrix4();
      for (var c = 0; c < coords.length; c++) {
        var p3 = latLngToPosition(coords[c][1], coords[c][0]);
        mtx.makeScale(1, 1, 1);
        mtx.setPosition(p3.x * globeRadius, p3.y * globeRadius, p3.z * globeRadius);
        inst.setMatrixAt(c, mtx);
      }
      inst.instanceMatrix.needsUpdate = true;
      globeGroup.add(inst);
    }

    // ---- markers ----
    if (CFG.markers && CFG.markers.length) {
      var mGeo = new THREE.SphereGeometry(0.01 * 1.6, 16, 16);
      var mMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('rgba(230,182,76,1)') });
      CFG.markers.forEach(function (mk) {
        if (!mk || typeof mk.lat !== 'number') return;
        var p = latLngToPosition(mk.lat, mk.lng);
        var mesh = new THREE.Mesh(mGeo, mMat);
        mesh.position.set(p.x * globeRadius, p.y * globeRadius, p.z * globeRadius);
        globeGroup.add(mesh);
      });
    }

    // ---- animate ----
    var rot = { x: (CFG.initialLongitude * Math.PI) / 180, y: (CFG.initialLatitude * Math.PI) / 180 };
    var target = { x: rot.x, y: rot.y };
    var raf = null;
    function frame() {
      if (rotationSpeed !== 0) target.x += rotationSpeed * 0.01;
      var dx = target.x - rot.x, dy = target.y - rot.y;
      rot.x += dx * lerpFactor;
      rot.y += dy * lerpFactor;
      globeGroup.rotation.y = rot.x;
      globeGroup.rotation.x = rot.y;
      // published so the creator orbit can ride the same rotation and camera
      window.__ukGlobe = { rotY: rot.x, tiltX: rot.y, radius: globeRadius, camera: cameraDistance, fov: 50 };
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    }
    /* Let the page aim the globe at a real place instead of letting it spin.
       Solving the rotation that brings (lat,lng) onto the camera axis gives
       rotY = -lng and tiltX = lat, both in radians. */
    window.UKGLOBE = {
      aim: function (lat, lng) {
        target.x = -(lng * Math.PI) / 180;
        target.y = (lat * Math.PI) / 180;
        rotationSpeed = 0;
      },
      spin: function (on) { rotationSpeed = on ? CFG.speed : 0; },
      radius: function () { return globeRadius; }
    };

    renderer.render(scene, camera);
    canvas.style.opacity = '1';
    raf = requestAnimationFrame(frame);

    // ---- resize ----
    var ro = new ResizeObserver(function () {
      var nw = container.clientWidth || 800, nh = container.clientHeight || 800;
      if (!nw || !nh) return;
      camera.aspect = nw / nh; camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
      renderer.render(scene, camera);
    });
    ro.observe(container);

    // pause when off-screen to save the GPU
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (ents) {
        ents.forEach(function (en) {
          if (en.isIntersecting) { if (raf === null) raf = requestAnimationFrame(frame); }
          else if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
        });
      }, { threshold: 0 }).observe(container);
    }
  }

  function whenThree(cb, tries) {
    tries = tries || 0;
    if (window.THREE && window.THREE.Scene) return cb(window.THREE);
    if (tries > 200) return; // ~10s
    setTimeout(function () { whenThree(cb, tries + 1); }, 50);
  }

  function init() {
    var container = document.getElementById('ukGlobe');
    if (!container || container.dataset.globe === '1') return;
    container.dataset.globe = '1';
    whenThree(function (THREE) {
      fetch(LAND_URL).then(function (r) { return r.json(); }).then(function (land) {
        try { build(container, THREE, land); } catch (e) { /* fail silent, keep bg */ }
      }).catch(function () {});
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  document.addEventListener('swup:contentReplaced', init);
})();
