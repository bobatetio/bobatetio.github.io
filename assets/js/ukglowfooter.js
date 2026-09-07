/* Ukreate — the gradient footer glow.

   A port of the Ruixen gradient footer to this codebase. Same idea, same
   numbers: one inline <svg> holding N blurred columns whose heights follow a
   gentle power falloff (tallest in the middle, short at the edges), filled with
   one vertical rainbow, pinned to the bottom of the viewport and scaled up from
   the floor over the last stretch of scroll so it reaches full height exactly
   as you hit the end of the page. No canvas, no scroll spacer.

   Gradient design inspired by Dia Browser (https://www.diabrowser.com), by way
   of the Ruixen component.

   Written as a plain module rather than a React component because this site has
   no React, no bundler and no Tailwind: it is static HTML with hand-written CSS,
   and the effect is a dozen lines of SVG either way. It mounts itself into
   .ukOutro, which already isolates a stacking context with its photograph and
   scrim at z-index -1 and its content at z-index 1, so the glow slots in at 0:
   over the picture, under the type. */
(function () {
  var VBW = 1271, VBH = 599;

  /* Floor (0) to top (1), recoloured to this site rather than the original's
     ember-to-magenta. Same rhythm — a dark base, a blue climb, a luminous
     middle, then the warm band fading out — but every stop is a colour the
     brand already uses: --uk-deep-3 through --uk-deep and the hero's radial
     blue, the Ask field's pale blue, then --uk-gold-2 and --uk-gold, closing on
     gold at zero alpha so the band dissolves rather than cutting off. */
  var STOPS = [
    [0,      '#061829'],   /* --uk-deep-3, the darkest navy on the site */
    [0.1827, '#0B2F52'],   /* --uk-deep */
    [0.2837, '#17527F'],   /* the hero radial's blue */
    [0.4135, '#E1ECFE'],   /* the pale blue the Ask frame's border carries */
    [0.5866, '#EFC470'],   /* --uk-gold-2 */
    [0.6827, '#D7A543'],   /* --uk-gold */
    [0.8029, '#B9812A'],   /* the deeper gold the buttons shade into */
    [1,      '#D7A54300']  /* gold, transparent */
  ];

  var OPT = {
    height: '30.6vh',   /* the band, and the scroll distance the reveal takes */
    minReveal: 0.045, /* a thin flat strip of rainbow before the reveal starts */
    bars: 9,
    blur: 15,
    peak: 0.98,
    valley: 0.55
  };

  function clamp01(v) { return Math.max(0, Math.min(1, v)); }

  /* short edges, tallest middle */
  function bellHeights(n, peak, valley) {
    var out = [], mid = (n - 1) / 2, i, t, eased;
    for (i = 0; i < n; i++) {
      t = mid === 0 ? 0 : Math.abs(i - mid) / mid;
      eased = 1 - Math.pow(t, 1.24);
      out.push(peak * VBH * (valley + (1 - valley) * eased));
    }
    return out;
  }

  function svgMarkup(uid) {
    var colW = VBW / OPT.bars;
    var stops = STOPS.map(function (s) {
      return '<stop offset="' + s[0] + '" stop-color="' + s[1] + '"/>';
    }).join('');
    var bars = bellHeights(OPT.bars, OPT.peak, OPT.valley).map(function (barH, i) {
      return '<g filter="url(#ukGlowBlur-' + uid + ')">' +
        '<rect x="' + (i * colW) + '" y="' + (VBH - barH) + '" ' +
        'width="' + (colW * 1.23) + '" height="' + barH + '" ' +
        'fill="url(#ukGlowGrad-' + uid + ')"/></g>';
    }).join('');
    return '<svg viewBox="0 0 ' + VBW + ' ' + VBH + '" preserveAspectRatio="none" ' +
      'fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<defs>' +
        '<linearGradient id="ukGlowGrad-' + uid + '" x1="0" y1="1" x2="0" y2="0">' + stops + '</linearGradient>' +
        '<filter id="ukGlowBlur-' + uid + '" x="-50%" y="-50%" width="200%" height="200%">' +
          '<feGaussianBlur stdDeviation="' + OPT.blur + '"/></filter>' +
      '</defs>' + bars + '</svg>';
  }

  function mount() {
    var host = document.querySelector('.ukOutro') ||
               document.querySelector('.ukMktFootWrap') ||
               document.querySelector('.ukFooter');
    if (!host || host.querySelector('.ukGlowBand')) return;

    /* room under the footer's own content for the glow to land in */
    host.classList.add('has-ukGlow');
    host.style.setProperty('--uk-glow-h', OPT.height);

    var band = document.createElement('div');
    band.className = 'ukGlowBand';
    band.setAttribute('aria-hidden', 'true');
    band.innerHTML = svgMarkup(Math.random().toString(36).slice(2, 8));
    host.appendChild(band);


    var reduced = !!(window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (reduced) {
      /* no scroll-driven motion: the strip simply sits on the floor */
      band.style.transform = 'scaleY(' + OPT.minReveal + ')';
      return;
    }

    var ticking = false;
    function measure() {
      ticking = false;
      var h = band.offsetHeight || 1;               /* offsetHeight ignores the transform */
      var left = document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
      var t = clamp01((h - left) / h);
      band.style.transform = 'scaleY(' + (OPT.minReveal + (1 - OPT.minReveal) * t) + ')';
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(measure);
    }
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    /* images and videos landing late change the page height under us */
    window.addEventListener('load', onScroll);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else { mount(); }
})();
