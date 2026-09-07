/* Creator case studies — the carousel and the mute toggle.
   The three studies are all in the markup; this shows one at a time, so the
   copy is there with JS off. Mirrors the viral marketing page's behaviour:
   a fresh clip starts muted, because autoplay is only allowed while muted. */
(function () {
  var root = document.querySelector('[data-rs]');
  if (!root) return;
  var studies = [].slice.call(root.querySelectorAll('[data-rs-study]'));
  if (studies.length < 2) return;
  var i = 0;

  function show(n) {
    i = (n + studies.length) % studies.length;
    studies.forEach(function (s, k) {
      var on = k === i;
      s.hidden = !on;
      var v = s.querySelector('video');
      if (!v) return;
      if (on) { v.muted = true; setMuteUi(s, true); v.play().catch(function () {}); }
      else { v.pause(); }
    });
  }
  function setMuteUi(study, muted) {
    var btn = study.querySelector('[data-rs-mute]');
    if (!btn) return;
    btn.setAttribute('aria-pressed', muted ? 'false' : 'true');
    var ico = btn.querySelector('.ukRs_muteIco'); if (ico) ico.dataset.muted = muted ? 'true' : 'false';
    var sr = btn.querySelector('.ukRs_sr'); if (sr) sr.textContent = muted ? 'Unmute the video' : 'Mute the video';
  }

  root.addEventListener('click', function (e) {
    var t = e.target.closest('[data-rs-prev],[data-rs-next],[data-rs-mute]');
    if (!t) return;
    if (t.hasAttribute('data-rs-prev')) return show(i - 1);
    if (t.hasAttribute('data-rs-next')) return show(i + 1);
    var study = t.closest('[data-rs-study]');
    var v = study.querySelector('video');
    v.muted = !v.muted;
    setMuteUi(study, v.muted);
    if (!v.muted) v.play().catch(function () {});
  });

  /* the visible clip only plays once the section is on screen */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        var v = studies[i].querySelector('video');
        if (!v) return;
        if (en.isIntersecting) { v.play().catch(function () {}); } else { v.pause(); }
      });
    }, { threshold: 0.25 }).observe(root);
  }
  show(0);
})();

/* The section holds while the reader scrolls and the hotel's card dissolves
   into the creator's. Everything else — background, heading — stays put. The
   motion is short and tied directly to scroll position, so it reads as one
   continuous gesture rather than a switch firing. */
(function () {
  var hold = document.querySelector('[data-cs-hold]');
  if (!hold) return;
  var stage = hold.querySelector('.csHold_stage');
  var inner = hold.querySelector('.csHold_inner');
  var head = hold.querySelector('.results__header');
  var deck = hold.querySelector('.csDeck');
  var panels = [].slice.call(hold.querySelectorAll('[data-cs-panel]'));
  if (!stage || !inner || !head || !deck || panels.length < 2) return;

  var wide = window.matchMedia('(min-width:1000px)');
  var still = window.matchMedia('(prefers-reduced-motion:reduce)');

  /* the run of the track, as fractions of the hold: rest .. hand over ..
     rest .. leave. The first card's arrival is not on this track — it reveals
     itself once the section is reached, which is a moment, not a scrub. */
  var HOLD_1 = 0.20, SWAP_END = 0.55, HOLD_2 = 0.80;
  var OFF = 108;                        /* % of the stage a card sits offstage */
  var REVEAL_MS = 780;
  var NAV = 94, MIN_GAP = 12, MIN_BOT = 8;
  var flat = true, playing = -1;
  var target = 0, cur = 0, running = false, last = 0;
  var revStart = 0, rev = 0;

  function ease(t) { return t * t * (3 - 2 * t); }
  function clamp(t) { return t < 0 ? 0 : t > 1 ? 1 : t; }

  function loosen() {
    inner.style.paddingTop = inner.style.paddingBottom = '';
    head.style.marginBottom = '';
  }
  function goFlat() {
    flat = true;
    hold.setAttribute('data-cs-flat', '');
    loosen();
    panels.forEach(function (p) { p.style.transform = ''; });
  }

  function fit() {
    if (!wide.matches || still.matches) return goFlat();
    hold.removeAttribute('data-cs-flat');
    loosen();
    var free = stage.clientHeight - head.offsetHeight - deck.offsetHeight;
    if (free < NAV + MIN_GAP + MIN_BOT) return goFlat();
    flat = false;
    var top = Math.min(Math.max(NAV, free * 0.60), 128);
    var gap = Math.min(Math.max(MIN_GAP, free * 0.24), 38);
    var bot = free - top - gap;
    if (bot < MIN_BOT) { bot = MIN_BOT; gap = Math.max(MIN_GAP, free - top - bot); }
    /* set on the elements: the section's own heading margin outranks a variable */
    inner.style.paddingTop = Math.round(top) + 'px';
    inner.style.paddingBottom = Math.round(Math.max(bot, MIN_BOT)) + 'px';
    head.style.marginBottom = Math.round(gap) + 'px';
  }

  function readTarget() {
    var r = hold.getBoundingClientRect();
    var span = r.height - stage.offsetHeight;
    target = span > 0 ? clamp(-r.top / span) : 0;
    /* the reveal starts as soon as the stage is properly on screen; the
       observer below is only a backstop for the first paint */
    if (!revStart && !flat && r.top < innerHeight * 0.55 && r.bottom > innerHeight * 0.25) {
      revStart = performance.now();
    }
    /* only worth animating while the section is anywhere near the screen */
    return r.bottom > -200 && r.top < innerHeight + 200;
  }

  function paint(p) {
    /* the hotel's card is revealed into place, then the track takes over: it
       hands over to the creator's, which leaves as the section does */
    var swap  = ease(clamp((p - HOLD_1) / (SWAP_END - HOLD_1)));
    var leave = ease(clamp((p - HOLD_2) / (1 - HOLD_2)));

    var x0 = OFF * (1 - rev) - OFF * swap;
    var x1 = OFF * (1 - swap) - OFF * leave;

    panels[0].style.transform = 'translate3d(' + x0.toFixed(2) + '%,0,0)';
    panels[1].style.transform = 'translate3d(' + x1.toFixed(2) + '%,0,0)';

    /* only touch the DOM when the front card actually changes — writing these
       every frame forces a style recalc across both cards and costs the frame */
    var front = swap < 0.5 ? 0 : 1;
    if (front !== playing) {
      playing = front;
      panels.forEach(function (el, i) {
        el.style.pointerEvents = i === front ? 'auto' : 'none';
        el.setAttribute('aria-hidden', i === front ? 'false' : 'true');
        var v = el.querySelector('.cs-card--creator:not([hidden]) video');
        if (!v) return;
        if (i === front) { v.play().catch(function () {}); } else { v.pause(); }
      });
    }
  }

  /* The track follows the scroll on a spring rather than snapping to it. A
     wheel arrives in coarse jumps; easing toward the target each frame is what
     turns those steps into one continuous movement. Same feel as the hero. */
  var TAU = 0.11;
  function frame(now) {
    var dt = last ? Math.min((now - last) / 16.667, 3) : 1;
    last = now;
    var near = readTarget();
    cur += (target - cur) * (1 - Math.pow(1 - TAU, dt));
    if (Math.abs(target - cur) < 0.0002) cur = target;

    /* the reveal runs on its own clock, not on the scroll */
    if (revStart && rev < 1) {
      rev = ease(clamp((now - revStart) / REVEAL_MS));
      if (rev > 0.999) rev = 1;
    }

    paint(cur);
    if (near || rev < 1 || Math.abs(target - cur) > 0.0002) {
      requestAnimationFrame(frame);
    } else {
      running = false; last = 0;
    }
  }
  function kick() {
    if (flat || running) return;
    running = true; last = 0;
    requestAnimationFrame(frame);
  }

  function onScroll() { kick(); }
  function onResize() {
    fit(); playing = -1;
    if (flat) { rev = 1; return; }
    readTarget(); cur = target; paint(cur);
  }

  /* the first card reveals itself the moment the section is properly on screen */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es, ob) {
      es.forEach(function (en) {
        if (!en.isIntersecting || revStart) return;
        if (flat) { rev = 1; ob.disconnect(); return; }
        revStart = performance.now();
        ob.disconnect();
        kick();
      });
    }, { threshold: 0.45 }).observe(stage);
  } else {
    rev = 1;
  }

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onResize);
  wide.addEventListener('change', onResize);
  addEventListener('load', onResize);
  /* the heading is set in a webfont; its height is not final until that lands */
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(onResize);
  if (window.ResizeObserver) new ResizeObserver(onResize).observe(head);
  onResize();
})();
