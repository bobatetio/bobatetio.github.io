/* For Creators page behaviour.
   - scroll reveals (.fcUp -> .is-in)
   - membership card 3D tilt toward the cursor (same feel as the How It Works cards)
   - stat count-up when the strip enters view
   - testimonial videos: autoplay muted in view, one-at-a-time sound toggle
   - FAQ accordion
   All effects are reduced-motion aware. */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  /* ---------- scroll reveals ---------- */
  function reveals() {
    var els = document.querySelectorAll('.fcUp');
    if (!els.length) return;
    if (!('IntersectionObserver' in window) || reduce) {
      els.forEach(function (e) { e.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- membership card tilt ---------- */
  function tilt() {
    var card = document.querySelector('.fcCard[data-tilt]');
    if (!card || reduce) return;
    var wrap = card.parentElement;
    wrap.addEventListener('pointermove', function (e) {
      if (window.innerWidth <= 860) return;
      var r = card.getBoundingClientRect();
      var dx = clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 2), -1, 1);
      var dy = clamp((e.clientY - (r.top + r.height / 2)) / (r.height / 2), -1, 1);
      card.style.transform = 'rotateY(' + (dx * 9).toFixed(2) + 'deg) rotateX(' + (-dy * 9).toFixed(2) + 'deg) translateZ(0)';
    });
    wrap.addEventListener('pointerleave', function () { card.style.transform = ''; });
  }

  /* ---------- stat count-up ---------- */
  function stats() {
    var nums = document.querySelectorAll('.fcStat_n');
    if (!nums.length || !('IntersectionObserver' in window) || reduce) return;
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        var el = en.target, raw = el.textContent.trim();
        // split "$2,500+" -> prefix "$", number 2500, suffix "+"
        var m = raw.match(/^([^\d]*)([\d.,]+)([^\d]*)$/);
        if (!m) return;
        var pre = m[1], suf = m[3];
        var digits = m[2].replace(/,/g, '');
        var target = parseFloat(digits);
        if (!isFinite(target)) return;
        var decimals = (digits.split('.')[1] || '').length;
        var grouped = m[2].indexOf(',') > -1;
        var dur = 1150, t0 = null;
        function fmt(v) {
          var s = decimals ? v.toFixed(decimals) : String(Math.round(v));
          if (grouped) s = Number(s).toLocaleString('en-US');
          return pre + s + suf;
        }
        function step(ts) {
          if (t0 === null) t0 = ts;
          var p = clamp((ts - t0) / dur, 0, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = fmt(target * eased);
          if (p < 1) requestAnimationFrame(step); else el.textContent = raw;
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { io.observe(n); });
  }

  /* ---------- testimonial videos ---------- */
  var ICON_MUTED = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M17 9l4 6M21 9l-4 6"/></svg>';
  var ICON_ON = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M16 9a4 4 0 0 1 0 6M19 7a7 7 0 0 1 0 10"/></svg>';

  function videos() {
    var figs = Array.prototype.slice.call(document.querySelectorAll('.fcVid'));
    if (!figs.length) return;
    var items = figs.map(function (f) {
      return { v: f.querySelector('video'), btn: f.querySelector('.fcVid_sound'), on: false, seen: false };
    });

    function safePlay(v) { if (!v) return; var p = v.play(); if (p && p.catch) p.catch(function () {}); }

    function paint(it) {
      if (!it.btn) return;
      it.btn.innerHTML = it.on ? ICON_ON : ICON_MUTED;
      it.btn.setAttribute('aria-pressed', it.on ? 'true' : 'false');
      it.btn.setAttribute('aria-label', it.on ? 'Mute video' : 'Unmute video');
      it.btn.classList.toggle('is-on', it.on);
    }

    items.forEach(function (it) {
      if (!it.v) return;
      it.v.muted = true;
      ['loadeddata', 'canplay'].forEach(function (ev) {
        it.v.addEventListener(ev, function () { if (it.seen) safePlay(it.v); });
      });
      paint(it);
      if (it.btn) {
        it.btn.addEventListener('click', function (e) {
          e.preventDefault();
          it.on = !it.on;
          // only one soundtrack at a time
          items.forEach(function (o) { if (o !== it) { o.on = false; if (o.v) o.v.muted = true; paint(o); } });
          it.v.muted = !it.on;
          if (it.on) safePlay(it.v);
          paint(it);
        });
      }
    });

    if (!('IntersectionObserver' in window)) { items.forEach(function (it) { it.seen = true; safePlay(it.v); }); return; }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        var it = items[figs.indexOf(en.target)];
        if (!it || !it.v) return;
        it.seen = en.isIntersecting;
        if (en.isIntersecting) safePlay(it.v);
        else { it.v.pause(); if (it.on) { it.on = false; it.v.muted = true; paint(it); } }
      });
    }, { threshold: 0.28 });
    figs.forEach(function (f) { io.observe(f); });
  }

  /* ---------- FAQ ---------- */
  function faq() {
    var items = document.querySelectorAll('.fcFaq_item');
    items.forEach(function (it) {
      var q = it.querySelector('.fcFaq_q'), a = it.querySelector('.fcFaq_a');
      if (!q || !a) return;
      q.addEventListener('click', function () {
        var open = q.getAttribute('aria-expanded') === 'true';
        items.forEach(function (o) {
          var oq = o.querySelector('.fcFaq_q'), oa = o.querySelector('.fcFaq_a');
          if (oq) oq.setAttribute('aria-expanded', 'false');
          if (oa) oa.style.maxHeight = null;
        });
        if (!open) { q.setAttribute('aria-expanded', 'true'); a.style.maxHeight = a.scrollHeight + 'px'; }
      });
    });
  }

  /* ---------- smooth in-page anchors ---------- */
  function anchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (!id || id === '#') return;
        var t = document.querySelector(id);
        if (!t) return;
        e.preventDefault();
        t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      });
    });
  }

  function init() {
    reveals(); tilt(); stats(); videos(); faq(); anchors();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
