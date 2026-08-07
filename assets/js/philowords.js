/* Scroll-linked word reveal for the big-video caption: words start grayed out
   and brighten to white one after another as the caption rises through the
   viewport. Purely opacity-driven off scroll position. */
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
    var cap = document.querySelector('.philoBigCaption');
    if (!cap || cap.dataset.words === '1') return;
    var words = cap.querySelectorAll('.philoWord');
    if (!words.length) return;
    cap.dataset.words = '1';
    var N = words.length;
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return; // CSS leaves words at a steady visible opacity

    function frame() {
      var r = cap.getBoundingClientRect();
      var vh = window.innerHeight || 800;
      // 0 as the caption enters the lower viewport, 1 once it has risen past the middle
      var progress = clamp((vh * 0.82 - r.top) / (vh * 0.72), 0, 1);
      var spread = progress * (N + 2);
      for (var i = 0; i < N; i++) {
        var b = clamp(spread - i, 0, 1);
        words[i].style.opacity = (0.26 + 0.68 * b).toFixed(3);
      }
      if (ukIdleRun) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // only animate while the section is anywhere near the viewport
  if ('IntersectionObserver' in window) {
    var t = document.querySelector('.philoBigCaption');
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
