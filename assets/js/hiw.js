/* How It Works — pinned step-cycle with a reactive, growing rail.
   - Only the CURRENT numeral is white; the others are a visible gray.
   - The white leg GROWS down the line with scroll: segment 1→2 fills as you
     approach numeral 2, then recedes as segment 2→3 fills toward numeral 3.
   - Before the pin and once scrolled past, the rail is idle (gray only).
   - Card content stays on the last step while the section exits; the active
     card also tilts in 3D toward the cursor. Off on small screens. */
(function () {
  var ukIdleRun = true;
/* MOBILE_IDLE: this loop ran unconditionally at 60fps for the life of the page.
   On a phone, four scripts doing that plus the WebGL bundle was the hang. The
   loop now only runs while its own section is on screen. */
function ukIdleGate(el, run, stop) {
  if (!el || !('IntersectionObserver' in window)) { run(); return; }
  var on = false;
  new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting && !on) { on = true; run(); }
      else if (!e.isIntersecting && on) { on = false; if (stop) stop(); }
    });
  }, { rootMargin: '200px 0px' }).observe(el);
}

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  function init() {
    var stack = document.querySelector('.hiwStack');
    if (!stack || stack.dataset.hiw === '1') return;
    var steps = stack.querySelectorAll('.hiwStack_step');
    if (!steps.length) return;
    stack.dataset.hiw = '1';

    var nodes = stack.querySelectorAll('.hiwRail_node');
    var fills = stack.querySelectorAll('.hiwRail_segFill');
    var pin = stack.querySelector('.hiwStack_pin');
    var n = steps.length;

    // 3D cursor tilt on the active card (+ inner mockup parallax)
    if (pin) {
      pin.addEventListener('pointermove', function (e) {
        if (window.innerWidth <= 860) return;
        var card = stack.querySelector('.hiwStack_step.is-active .hiw__card');
        if (!card) return;
        var r = card.getBoundingClientRect();
        var dx = clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 2), -1, 1);
        var dy = clamp((e.clientY - (r.top + r.height / 2)) / (r.height / 2), -1, 1);
        card.style.transform = 'rotateY(' + (dx * 7).toFixed(2) + 'deg) rotateX(' + (-dy * 7).toFixed(2) + 'deg)';
        var img = card.querySelector('.hiw__card-img');
        if (img) img.style.transform = 'translate(' + (dx * -10).toFixed(1) + 'px,' + (dy * -8).toFixed(1) + 'px) scale(1.05)';
      });
      pin.addEventListener('pointerleave', function () {
        stack.querySelectorAll('.hiw__card').forEach(function (c) { c.style.transform = ''; });
        stack.querySelectorAll('.hiw__card-img').forEach(function (i) { i.style.transform = ''; });
      });
    }

    function frame() {
      if (window.innerWidth <= 860) { requestAnimationFrame(frame); return; }
      var r = stack.getBoundingClientRect();
      var vh = window.innerHeight || 800;
      var travel = r.height - vh;
      var rawP = travel > 0 ? (-r.top / travel) : 0;   // <0 before pin, >1 after

      // card content: keep a valid step while entering / exiting
      var stepActive = clamp(Math.floor(rawP * n), 0, n - 1);
      for (var i = 0; i < n; i++) {
        var on = i === stepActive;
        if (steps[i].classList.contains('is-active') !== on) steps[i].classList.toggle('is-active', on);
      }

      // numerals: only the current one is white; idle outside the pin
      var railActive = (rawP < 0 || rawP > 1) ? -1 : stepActive;
      for (var j = 0; j < nodes.length; j++) {
        var na = j === railActive;
        if (nodes[j].classList.contains('is-active') !== na) nodes[j].classList.toggle('is-active', na);
      }

      // growing white leg: seg1 grows toward numeral 2, then recedes as seg2
      // grows toward numeral 3 (thirds of the scroll, matching the numerals)
      var f1 = 0, f2 = 0;
      if (rawP > 0 && rawP <= 1) {
        if (rawP <= 1 / 3) { f1 = rawP * 3; f2 = 0; }
        else if (rawP <= 2 / 3) { f1 = 1 - (rawP - 1 / 3) * 3; f2 = (rawP - 1 / 3) * 3; }
        else { f1 = 0; f2 = 1; }
      }
      if (fills[0]) fills[0].style.height = (clamp(f1, 0, 1) * 100).toFixed(1) + '%';
      if (fills[1]) fills[1].style.height = (clamp(f2, 0, 1) * 100).toFixed(1) + '%';

      if (ukIdleRun) requestAnimationFrame(frame);
    }
    if (ukIdleRun) requestAnimationFrame(frame);
  }

  // only animate while the section is anywhere near the viewport
  if ('IntersectionObserver' in window) {
    var t = document.querySelector('.hiw');
    if (t) new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var was = ukIdleRun; ukIdleRun = e.isIntersecting;
        if (ukIdleRun && !was) requestAnimationFrame(function () {});
      });
    }, { rootMargin: '200px 0px' }).observe(t);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  document.addEventListener('swup:contentReplaced', init);
})();
