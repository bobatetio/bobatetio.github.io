/* Folio reveal — the receipt fills in from the card's own scroll progress, not a
   timer, so the pace follows the reader.

   Two decisions worth knowing:
   - Lines STAY revealed once shown. The brief offered reversing on scroll-up, but
     a receipt that un-writes itself reads as a glitch, and it makes scroll-thrash
     visible. Latching also means no work at all after the card is complete.
   - Under prefers-reduced-motion everything is shown immediately and no scroll
     listener is attached.

   Scroll work is rAF-throttled: the listener only flags a frame as dirty, and the
   measuring happens once per animation frame. */
(function () {
  var START = 0.86;   // begin when the card's top has risen to 86% of the viewport
  var END = 0.36;     // last line lands when it reaches 36%

  function init() {
    var card = document.querySelector('[data-receipt]');
    if (!card || card.dataset.ready === '1') return;
    card.dataset.ready = '1';

    var lines = Array.prototype.slice.call(card.querySelectorAll('[data-line]'));
    var rule = card.querySelector('.ukFolio_rule');
    var note = document.querySelector('[data-receipt-note]');
    if (!lines.length) return;

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      lines.forEach(function (l) { l.classList.add('is-on'); });
      if (rule) rule.classList.add('is-on');
      if (note) note.classList.add('is-on');
      return;
    }

    var shown = 0;                 // latch: only ever counts up
    var total = lines.length;
    var dirty = true;
    var raf = null;
    var done = false;

    // the rule sits before the last two lines; reveal it with the line it precedes
    var ruleAfter = lines.length - 2;

    function measure() {
      raf = null;
      if (!dirty || done) return;
      dirty = false;

      var r = card.getBoundingClientRect();
      var vh = window.innerHeight || 800;
      var startY = vh * START;
      var endY = vh * END;
      var p = (startY - r.top) / (startY - endY);
      p = p < 0 ? 0 : p > 1 ? 1 : p;

      var want = Math.round(p * total);
      if (want > shown) {
        for (var i = shown; i < want; i++) {
          lines[i].classList.add('is-on');
          if (rule && i === ruleAfter - 1) rule.classList.add('is-on');
        }
        shown = want;
      }
      if (shown >= total) {
        if (rule) rule.classList.add('is-on');
        if (note) note.classList.add('is-on');
        done = true;                       // nothing left to compute
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      }
    }

    function onScroll() {
      dirty = true;
      if (raf === null) raf = requestAnimationFrame(measure);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  document.addEventListener('swup:contentReplaced', init);
})();
