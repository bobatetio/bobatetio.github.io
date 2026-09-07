/* Testimonials carousel — ported from the previous Ukreate build.
   Prev/next steps through partner quotes; buttons disable at the ends. */
(function () {
  function init() {
    var prevBtn = document.getElementById('tc-prev');
    var nextBtn = document.getElementById('tc-next');
    if (!prevBtn || !nextBtn || prevBtn.dataset.tc === '1') return;
    prevBtn.dataset.tc = '1';

    var AV = '/assets/img/uk/testimonials-avatar.png';
    var testimonials = [
      { name: 'Sarah Chen,', role: 'Director of Digital Marketing, Aman Resorts',
        quote: "Ukreate completely changed how we approach influencer marketing. We've cut our sourcing time by 80% and the content quality is consistently excellent.", avatar: AV },
      { name: 'James Whitfield,', role: 'VP of Marketing, Four Seasons Hotels',
        quote: 'We ran our best-performing campaign of the year through Ukreate. The creator match was perfect and the content delivered 2× our expected reach.', avatar: AV },
      { name: 'Priya Nair,', role: 'Head of Brand, Hyatt Regency EMEA',
        quote: "Finally a platform that understands luxury hospitality. Vetting, contracts and payments — all in one place. It's saved us weeks of back-and-forth.", avatar: AV },
      { name: 'Luca Ferretti,', role: 'Marketing Director, Small Luxury Hotels',
        quote: "Our member properties saw a 3× ROAS from the first Ukreate campaign. The calibre of creators on this platform is unlike anything we'd found before.", avatar: AV }
    ];

    var idx = 0;

    function updateButtons() {
      var isFirst = idx === 0, isLast = idx === testimonials.length - 1;
      prevBtn.disabled = isFirst;
      prevBtn.style.background = isFirst ? 'rgba(217,164,65,0.08)' : 'rgba(217,164,65,0.35)';
      prevBtn.style.cursor = isFirst ? 'default' : 'pointer';
      prevBtn.querySelector('svg').setAttribute('stroke', isFirst ? 'rgba(255,255,255,0.3)' : '#fff');
      nextBtn.disabled = isLast;
      nextBtn.style.background = isLast ? 'rgba(217,164,65,0.3)' : '#d9a441';
      nextBtn.style.cursor = isLast ? 'default' : 'pointer';
      nextBtn.querySelector('svg').setAttribute('stroke', isLast ? 'rgba(255,255,255,0.5)' : '#fff');
    }

    function render() {
      var t = testimonials[idx];
      document.getElementById('tc-name').textContent = t.name;
      document.getElementById('tc-role').textContent = t.role;
      document.getElementById('tc-quote').textContent = t.quote;
      document.getElementById('tc-avatar-img').src = t.avatar;
      updateButtons();
    }

    nextBtn.addEventListener('click', function () { if (idx < testimonials.length - 1) { idx++; render(); } });
    prevBtn.addEventListener('click', function () { if (idx > 0) { idx--; render(); } });
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  document.addEventListener('swup:contentReplaced', init);
})();
