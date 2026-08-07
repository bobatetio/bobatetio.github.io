/* Comparison cards: scroll-scrubbed convergence.
   The two cards start upright and apart (side by side); as the section
   scrolls up through the viewport they slide together, rotate, and overlap
   into the intertwined pose. Fully reversible with scroll direction.
   Disabled on small screens (cards stack) and for reduced-motion. */
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

  var ROT = 4;    // final tilt, degrees
  var DX = 39;    // inward slide each card, px (closes the 60px gap + ~18px overlap)

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  function init() {
    var cards = document.querySelector('.ukComp_cards');
    if (!cards || cards.dataset.converge === '1') return;
    var wo = cards.querySelector('.ukCard--without');
    var wa = cards.querySelector('.ukCard--way');
    if (!wo || !wa) return;
    cards.dataset.converge = '1';

    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    function frame() {
      if (reduce || window.innerWidth <= 720) {
        wo.style.transform = ''; wa.style.transform = '';
        requestAnimationFrame(frame);
        return;
      }
      var r = cards.getBoundingClientRect();
      var vh = window.innerHeight || 800;
      // 0 when the cards first enter from the bottom, 1 once they've risen to ~40% up
      var p = clamp((vh - r.top) / (vh * 0.6), 0, 1);
      var e = p * p * (3 - 2 * p); // smoothstep

      wo.style.transform = 'translateX(' + (e * DX).toFixed(1) + 'px) rotate(' + (-e * ROT).toFixed(2) + 'deg)';
      wa.style.transform = 'translateX(' + (-e * DX).toFixed(1) + 'px) rotate(' + (e * ROT).toFixed(2) + 'deg)';

      if (ukIdleRun) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // only animate while the section is anywhere near the viewport
  if ('IntersectionObserver' in window) {
    var t = document.querySelector('.ukComp_cards');
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
