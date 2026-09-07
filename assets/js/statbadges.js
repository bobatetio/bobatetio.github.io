/* Philosophy stat column (Creator reach / Countries / Hotel partners / OTA
   commission). This script only adds .is-in once the column scrolls into view;
   the rise and the stagger are CSS. */
(function () {
  function init() {
    var fields = document.querySelectorAll('[data-stat-field]');
    for (var f = 0; f < fields.length; f++) {
      var field = fields[f];
      if (field.dataset.ready === '1') continue;
      field.dataset.ready = '1';

      var badges = field.querySelectorAll('[data-stat-badge]');


      // Count each figure up from zero when the band reveals. The written value
      // is parsed rather than hard-coded, so "12M+", "300+" and "0%" all keep
      // their own prefix, suffix and formatting.
      function countUp(el) {
        var raw = el.dataset.value || el.textContent;
        el.dataset.value = raw;
        var m = raw.match(/^(\D*)([\d.,]+)(.*)$/);
        if (!m) return;
        var pre = m[1], suf = m[3];
        var digits = m[2].replace(/,/g, '');
        var target = parseFloat(digits);
        if (isNaN(target)) return;
        var decimals = (digits.split('.')[1] || '').length;
        var grouped = m[2].indexOf(',') !== -1;
        var dur = 1100, t0 = null;
        function fmt(v) {
          var out = v.toFixed(decimals);
          if (grouped) out = out.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          return pre + out + suf;
        }
        function step(ts) {
          if (t0 === null) t0 = ts;
          var k = Math.min((ts - t0) / dur, 1);
          var e = 1 - Math.pow(1 - k, 3);   // ease-out, settles rather than stops
          el.textContent = fmt(target * e);
          if (k < 1) requestAnimationFrame(step); else el.textContent = raw;
        }
        el.textContent = fmt(0);
        requestAnimationFrame(step);
      }

      function reveal() {
        for (var i = 0; i < badges.length; i++) {
          badges[i].classList.add('is-in');
          var num = badges[i].querySelector('.philoStat_num');
          // start each count as its own row arrives, matching the stagger
          if (num) (function (n, d) { setTimeout(function () { countUp(n); }, d); })(num, i * 120);
        }
      }

      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries, obs) {
          if (entries[0].isIntersecting) { reveal(); obs.disconnect(); }
          // negative bottom margin so the reveal starts once the column is
          // properly into the viewport, not the moment its top edge clips the
          // bottom edge — otherwise it has finished playing before you see it
        }, { threshold: 0, rootMargin: '0px 0px -22% 0px' }).observe(field);
      } else {
        reveal();
      }
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  document.addEventListener('swup:contentReplaced', init);
})();
