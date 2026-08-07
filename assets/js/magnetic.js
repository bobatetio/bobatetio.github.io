/* Magnetic buttons: every .btn drifts toward the cursor while hovered
   (offset from centre * 0.35), springs back on leave, and shrinks on press.
   The translate is composed with the glare button's hover-scale (1.02) and
   tap-scale (0.96) into a single inline transform so the two effects never
   fight over the same property. Disabled under reduced-motion. */
(function () {
  var K = 0.35;                 // pull strength (matches the reference * 0.35)
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function init() {
    var btns = document.querySelectorAll('.btn');
    Array.prototype.forEach.call(btns, function (el) {
      if (el.dataset.magnetic === '1') return;
      el.dataset.magnetic = '1';

      var mx = 0, my = 0, inside = false, pressed = false;

      function render() {
        if (!inside) { el.style.transform = ''; return; } // hand back to CSS
        el.style.transform =
          'translate(' + mx.toFixed(1) + 'px,' + my.toFixed(1) + 'px) scale(' +
          (pressed ? 0.96 : 1.02) + ')';
      }

      el.addEventListener('mouseenter', function () { inside = true; render(); });
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        mx = (e.clientX - r.left - r.width / 2) * K;
        my = (e.clientY - r.top - r.height / 2) * K;
        inside = true;
        render();
      });
      el.addEventListener('mouseleave', function () {
        inside = false; pressed = false; render();
      });
      el.addEventListener('mousedown', function () { pressed = true; render(); });
      window.addEventListener('mouseup', function () {
        if (pressed) { pressed = false; render(); }
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  document.addEventListener('swup:contentReplaced', init);
})();
