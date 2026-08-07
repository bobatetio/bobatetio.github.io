/* Interactivity + reveals for the new Ukreate sections:
   - scroll-reveal (fade/rise) for section heads and cards
   - Featured Creators: dots track horizontal scroll position
   - Proven Results: prev/next cycles the 4 case studies
   - Testimonials: prev/next + dots cycle the quotes
   - FAQ: accordion toggle */
(function () {
  function ready(fn){ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); }

  function reveals() {
    var els = document.querySelectorAll('.uk_head, .ukEx, .ukCrd, .ukPf_card, .ukPr_card, .ukFc_inner, .ukResults_stage, .ukT_stage, .ukNews_inner, .ukFaq_head, .ukFoot_inner');
    els.forEach(function (e) { e.classList.add('ukUp'); });
    if (!('IntersectionObserver' in window)) { els.forEach(function(e){e.classList.add('is-in');}); return; }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  function creatorsDots() {
    var track = document.querySelector('.ukCreators_track');
    var dots = document.querySelectorAll('.ukCreators_dot');
    if (!track || !dots.length) return;
    var cards = track.querySelectorAll('.ukCrd');
    function sync() {
      var mid = track.scrollLeft + track.clientWidth / 2, best = 0, bd = 1e9;
      cards.forEach(function (c, i) { var cx = c.offsetLeft + c.offsetWidth / 2; var d = Math.abs(cx - mid); if (d < bd) { bd = d; best = i; } });
      dots.forEach(function (d, i) { d.classList.toggle('is-on', i === best); });
    }
    track.addEventListener('scroll', sync, { passive: true });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { if (cards[i]) cards[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }); }); });
    // center the featured card initially
    var center = track.querySelector('.ukCrd--center');
    if (center) track.scrollLeft = center.offsetLeft + center.offsetWidth / 2 - track.clientWidth / 2;
    sync();
  }

  function carousel(slideSel, arrowSel, dotSel) {
    var slides = Array.prototype.slice.call(document.querySelectorAll(slideSel));
    if (!slides.length) return;
    var dots = dotSel ? document.querySelectorAll(dotSel) : [];
    var cur = 0;
    function go(n) {
      cur = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle('is-on', i === cur); });
      if (dots.length) dots.forEach(function (d, i) { d.classList.toggle('is-on', i === cur); });
    }
    document.querySelectorAll(arrowSel).forEach(function (btn) {
      btn.addEventListener('click', function () { go(cur + (parseInt(btn.dataset.dir, 10) || 1)); });
    });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); }); });
    go(0);
  }

  function faq() {
    var items = document.querySelectorAll('.ukFaq_item');
    items.forEach(function (it) {
      var q = it.querySelector('.ukFaq_q'), a = it.querySelector('.ukFaq_a');
      if (!q || !a) return;
      q.addEventListener('click', function () {
        var open = q.getAttribute('aria-expanded') === 'true';
        items.forEach(function (o) {
          var oq = o.querySelector('.ukFaq_q'), oa = o.querySelector('.ukFaq_a');
          if (oq) oq.setAttribute('aria-expanded', 'false');
          if (oa) oa.style.maxHeight = null;
        });
        if (!open) { q.setAttribute('aria-expanded', 'true'); a.style.maxHeight = a.scrollHeight + 'px'; }
      });
    });
  }

  function init() {
    reveals();
    creatorsDots();
    carousel('.ukRes_slide', '.ukRes_arrow', null);
    carousel('.ukT_card', '.ukT_arrow', '.ukT_dot');
    faq();
  }
  ready(init);
  document.addEventListener('swup:contentReplaced', init);
})();
