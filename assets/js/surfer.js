/* Collection Surfer — approved conveyor ride + traced descent into the
   philosophy section.
   - In the hero: the component's ride (spring-smoothed scroll, cards grow in
     perspective as they reach the front), formation sitting a little lower.
   - As the philosophy section approaches, the ride's exit path bends down
     toward the incense image (.homePhilosophy_singleImg): one continuous
     traced curve. Card 01 arrives first and replaces the incense image
     (parks centered on it, own size, own picture). Cards 02+ ride the same
     curve and seat directly behind 01 — same point, hidden inside it.
     No card ever changes size or shape.
   - Hover: the card under the cursor turns to FACE the viewer (yaw -> 0),
     springy, on top of the magnetic scale. */
(function () {
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function smooth(t) { return t * t * (3 - 2 * t); }

  var CW = 168, CH = 228;            // card size — never changes
  var SX = 150, SY = -50, SZ = -185; // rail step
  var ROT = -50;                     // card yaw on the rail
  var PER_CARD = 600;                // px of scroll per card on the ride
  var TAU_SCROLL = 0.20;             // spring feel of the ride
  var TAU_MAG = 0.08;                // springy hover (scale + facing)
  var G = Math.sqrt(SX * SX + SY * SY);

  function init() {
    var surfer = document.querySelector('.surfer[data-surfer]');
    if (!surfer || surfer.dataset.ready === '1') return;
    var slot = document.querySelector('.surferSlot');
    var scene = surfer.querySelector('.surfer_scene');
    var track = surfer.querySelector('.surfer_track');
    var cards = Array.prototype.slice.call(surfer.querySelectorAll('.surfer_card'));
    if (!scene || !track || !cards.length) return;
    surfer.dataset.ready = '1';

    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var forced = parseFloat(new URLSearchParams(location.search).get('surf'));
    var scales = cards.map(function () { return 1; });
    var vids = cards.map(function (cd) { return cd.querySelector('video'); });
    vids.forEach(function (v) {
      if (!v) return;
      v.addEventListener('loadedmetadata', function () {
        try { if (v.paused) v.currentTime = 0.05; } catch (err) {}
      }, { once: true });
    });
    var hovers = cards.map(function () { return 0; });

    /* Where the cards come to rest. This was hard-wired to
       .homePhilosophy_singleImg, the incense photograph in Izanami's philosophy
       section, because that is the page this was first written against. With
       that section gone the cards had no destination, so they never began their
       descent and rode the scroll over every section below the hero.

       A page names its own dock with [data-surfer-dock]; the Izanami selectors
       stay as the fallback so the original still runs. */
    var philo = null;
    function pickTarget() {
      philo = document.querySelector('[data-surfer-dock]') ||
              document.querySelector('.homePhilosophy_singleImg');
      if (!philo) {
        var els = document.querySelectorAll('.homePhilosophy_img');
        var best = null, bestRect = null;
        for (var j = 0; j < els.length; j++) {
          var r = els[j].getBoundingClientRect();
          if (r.width < 2) continue;
          if (!best || r.left < bestRect.left - 1) { best = els[j]; bestRect = r; }
        }
        philo = best;
      }
    }
    pickTarget();

    var mx = -99999, my = -99999;
    window.addEventListener('pointermove', function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
    window.addEventListener('pointerleave', function () { mx = -99999; my = -99999; });

    var N = Math.max(1, Math.floor(cards.length / 2)); // unique set (DOM holds 2x)
    var c = isNaN(forced) ? 0 : forced;
    var ps = 0;   // smoothed descent progress
    var last = 0;

    function frame(now) {
      var dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;

      /* The page runs swup, which replaces the whole content container. When it
         does, every node this closure captured becomes detached: the loop goes
         on transforming cards nobody can see, while the fresh cards sit wherever
         the stylesheet leaves them, which is the top-left corner. It only shows
         up where the bundle is slow enough to swap after this has started, so it
         was invisible on localhost and obvious on GitHub Pages.

         Re-initialise against the new nodes and let this loop die. */
      if (!document.contains(surfer)) {
        var fresh = document.querySelector('.surfer[data-surfer]');
        if (fresh && fresh !== surfer) { fresh.removeAttribute('data-ready'); init(); return; }
      }
      if (!slot || !document.contains(slot)) { slot = document.querySelector('.surferSlot'); philo = null; }
      if (!slot) {
        surfer.style.display = 'none';
        requestAnimationFrame(frame);
        return;
      }
      surfer.style.display = '';
      if (!philo || !document.contains(philo)) pickTarget();

      // viewport-fixed stage (never dragged by the page)
      var vw = window.innerWidth || 1440, vhh = window.innerHeight || 800;
      var sw, sh, sl, st;
      if (vw <= 900) {
        var gm = clamp(vw * 0.07, 24, 132);
        sw = vw - 2 * gm; sh = clamp(vw * 0.7, 300, 380);
        sl = gm; st = (vhh - sh) / 2;
      } else {
        var g = clamp(vw * 0.07, 24, 132);
        sw = clamp(vw * 0.42, 320, 600); sh = clamp(vw * 0.38, 340, 500);
        sl = vw - g - sw; st = (vhh - sh) / 2;
      }
      var ox = sl + sw * 0.40;
      var oy = st + sh * 0.62;              // a little lower in the hero
      track.style.perspectiveOrigin = (sl + sw * 0.10) + 'px ' + (st + sh * 0.10) + 'px';

      // spring-smoothed ride
      var scroll = window.pageYOffset || document.documentElement.scrollTop || 0;
      var target = reduce ? 0 : (isNaN(forced) ? scroll / PER_CARD : forced);
      c += (target - c) * (1 - Math.exp(-dt / TAU_SCROLL));

      // descent driver: how far the philosophy image has risen
      var pr = philo ? philo.getBoundingClientRect() : null;
      var p = pr ? clamp((vhh * 1.15 - pr.top) / (vhh * 0.80), 0, 1) : 0;
      if (reduce) p = p > 0.5 ? 1 : 0;
      ps += (p - ps) * (1 - Math.exp(-dt / 0.35));

      // dock point + traced exit curve (leaves along the rail, bends to dock)
      var px = 0, py = 0, E = 4;
      if (pr) {
        px = pr.left + pr.width / 2;
        py = pr.top + pr.height / 2;
        E = Math.max(2, Math.sqrt((px - ox) * (px - ox) + (py - oy) * (py - oy)) / G);
      }
      // curve control: pulled hard toward the left edge and kept high, so
      // the middle of the journey sweeps left early (filling the left side
      // once the headline is gone) before dropping into the dock.
      // Start and end of the journey are unchanged.
      var cx = ox - (ox - px) * 0.72;
      var cy = oy + (py - oy) * 0.22;

      // the ride accelerates into the dock as the section arrives; at p=1
      // every card (duplicates included) has poured down and seated inside 01
      var cEff = c + ps * (N - 1 + E);
      var dockScale = pr ? clamp(pr.width / CW, 1, 2) : 1;

      for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        var e = i - cEff;
        var x, y, z, baseRot, docked = false;

        if (e >= 0 || !pr) {
          if (!pr && e < 0) e = 0;
          x = ox + e * SX;
          y = oy + e * SY;
          z = e * SZ;
          baseRot = ROT;
        } else {
          var u = clamp(-e / E, 0, 1);
          var w0 = (1 - u) * (1 - u), w1 = 2 * u * (1 - u), w2 = u * u;
          x = w0 * ox + w1 * cx + w2 * px;
          y = w0 * oy + w1 * cy + w2 * py;
          // slight swell mid-descent (the ride's growth), settling flat at the
          // dock, then sinking behind card 01 so followers hide inside it
          z = -2 * i * u;
          baseRot = ROT * (1 - smooth(clamp((u - 0.7) / 0.3, 0, 1)));
          docked = u >= 0.99;
        }

        // interaction exists ONLY in the hero (on the rail); once a card has
        // left, it is passive
        var interactive = e >= 0 && !docked && i < N;
        var hoverNow = !reduce && interactive && card.matches(':hover');
        var prox = hoverNow ? 1 : 0;

        // video playback: thumbnail at rest; muted play on hover in the hero;
        // the docked first video plays automatically (still muted)
        var v = vids[i];
        if (v) {
          var want = (i === 0 && docked) || hoverNow;
          if (want && v.paused) { var pp = v.play(); if (pp && pp.catch) pp.catch(function () {}); }
          else if (!want && !v.paused) v.pause();
          card.classList.toggle('is-playing', want);
        }
        scales[i] += (1 + prox * 0.5 - scales[i]) * (1 - Math.exp(-dt / TAU_MAG));
        hovers[i] += (prox - hovers[i]) * (1 - Math.exp(-dt / TAU_MAG));

        var ry = baseRot * (1 - hovers[i]); // hovered card faces the camera

        var sc = scales[i];
        if (i === 0 && e < 0 && pr) {
          var uu = clamp(-e / E, 0, 1);
          sc *= 1 + (dockScale - 1) * smooth(clamp((uu - 0.7) / 0.3, 0, 1));
        }
        var op = i >= N ? clamp(1 - ps * 3, 0, 1) : 1;

        card.style.transform = 'translate3d(' + (x - CW / 2) + 'px,' + (y - CH / 2) + 'px,' + z + 'px)' +
          ' rotateY(' + ry + 'deg) scale(' + sc.toFixed(3) + ')';
        card.style.opacity = op.toFixed(3);
        card.style.zIndex = String(Math.round(2000 - i * 10 + hovers[i] * 8000));
        // seated cards: invisible behind 01 — no hovers, no stacked shadows
        var hidden = i > 0 && docked;
        card.style.pointerEvents = interactive && op >= 0.5 ? 'auto' : 'none';
        card.style.boxShadow = hidden ? 'none' : '';
      }

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  /* swup renamed this hook; listen for both, and for the DOM being swapped by
     anything else, so a replaced container is always picked back up. */
  ['swup:contentReplaced', 'swup:page:view', 'swup:enable'].forEach(function (ev) {
    document.addEventListener(ev, function () { setTimeout(init, 0); });
  });
  if (window.MutationObserver) {
    new MutationObserver(function () {
      var el = document.querySelector('.surfer[data-surfer]');
      if (el && el.dataset.ready !== '1') init();
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
})();
