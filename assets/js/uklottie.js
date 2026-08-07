/* Ukreate — tiny shared helper for mounting Lottie animations.
   Three call sites (AI input icon, "Kept, not paid out" card art, calculator icon)
   all need the same three things: don't animate for people who asked for reduced
   motion, don't leak player instances on re-render, and don't play offscreen.

   Views here get re-rendered wholesale (innerHTML swapped) on navigation, with no
   shared per-view "mounted" hook — so rather than have every call site remember to
   re-mount after every repaint, any element carrying [data-lottie-src] is picked up
   automatically the moment it lands in the DOM, via one shared MutationObserver. */
(function () {
  var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  function mount(el, path, opts) {
    if (!el || !window.lottie || el.__ukLottie) return el && el.__ukLottie;
    opts = opts || {};
    var anim = window.lottie.loadAnimation({
      container: el, path: path, renderer: 'svg', loop: opts.loop !== false,
      autoplay: !reduced, rendererSettings: { preserveAspectRatio: opts.fit || 'xMidYMid meet' }
    });
    if (reduced) anim.goToAndStop(opts.reducedFrame || 0, true);
    el.__ukLottie = anim;

    // pause offscreen instances (dashboard cards, etc. scroll far out of view)
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (reduced) return;
          if (en.isIntersecting) anim.play(); else anim.pause();
        });
      }, { threshold: 0.05 });
      io.observe(el);
    }
    return anim;
  }

  function scan(root) {
    (root || document).querySelectorAll('[data-lottie-src]:not([data-lottie-done])').forEach(function (el) {
      el.setAttribute('data-lottie-done', '');
      mount(el, el.getAttribute('data-lottie-src'), { loop: el.getAttribute('data-lottie-loop') !== 'false' });
    });
  }

  if ('MutationObserver' in window) {
    new MutationObserver(function (muts) {
      muts.forEach(function (m) { m.addedNodes.forEach(function (n) {
        if (n.nodeType !== 1) return;
        if (n.matches && n.matches('[data-lottie-src]')) scan(n.parentNode || n);
        else if (n.querySelector) scan(n);
      }); });
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
  document.addEventListener('DOMContentLoaded', function () { scan(document); });

  window.UKLOTTIE = { mount: mount, scan: scan, reduced: reduced };
})();

