/* Proven Results — case-study carousel + video lightbox.
   Ported verbatim from the previous Ukreate build; only the asset paths are
   localised (images/ -> /assets/img/uk/, sample clips -> /assets/video/ugc/). */
(function () {
  function init() {
    var prevBtn = document.getElementById('cs-prev');
    var nextBtn = document.getElementById('cs-next');
    if (!prevBtn || !nextBtn || prevBtn.dataset.cs === '1') return;
    prevBtn.dataset.cs = '1';

    var studies = [
      { logo: '/assets/img/uk/f3d7a04e-92ac-48d6-b34f-62eb519b38b9.png', alt: 'Marriott International',
        problem: 'Wanted to fill rooms during a slow mid-week period without discounting rates or training guests to wait for a deal',
        solution: 'Booked 3 creators for 2-night stays and a UGC-only content package targeting business travelers',
        stat1: '340K', label1: 'Total Reach', stat2: '28', label2: 'Deliverables', stat3: '6.2%', label3: 'Booking Rate' },
      { logo: '/assets/img/uk/550ed7e7-9d13-4c0a-b531-702daccc270c.png', alt: 'Aman Resorts',
        problem: 'Wanted to reach younger luxury travelers discovering Aman for the first time',
        solution: 'Partnered with 2 adventure-luxury creators for immersive 4-night stays with full native posting rights',
        stat1: '1.2M', label1: 'Total Reach', stat2: '45', label2: 'Deliverables', stat3: 'Condé Nast', label3: 'Featured In' },
      { logo: '/assets/img/uk/112fb671-b0cb-44a9-b43f-b2cdf6f24ec4.png', alt: 'Hyatt Regency',
        problem: 'Launching a newly renovated rooftop pool & bar and needed buzz before the official opening',
        solution: 'Hosted 4 food & lifestyle creators for an exclusive pre-opening night with full rooftop access',
        stat1: '520K', label1: 'Total Reach', stat2: '89K', label2: 'Booking Clicks', stat3: '4.8%', label3: 'Conversion' },
      { logo: '/assets/img/uk/8c5ed993-2564-4ef7-bf14-429ae1367ce2.png', alt: 'Small Luxury Hotels',
        problem: 'Member properties needed authentic storytelling content to compete against OTA-driven discovery',
        solution: 'Matched 5 slow-travel micro-creators with SLH properties across Italy and Portugal for long-form stays',
        stat1: '290K', label1: 'Total Reach', stat2: '52', label2: 'Deliverables', stat3: '3.1×', label3: 'ROAS' },
      { logo: '/assets/img/uk/2e593547-cb6d-4ac1-8259-accdcc04833c.png', alt: 'Four Seasons',
        problem: 'Launching a new wellness retreat concept and needed aspirational content before the press trip',
        solution: 'Curated a 3-creator wellness collaboration with a 5-night Maldives stay and spa exclusives',
        stat1: '2.1M', label1: 'Total Reach', stat2: '67', label2: 'Deliverables', stat3: '21%', label3: 'Engagement' }
    ];

    var idx = 0;

    function updateButtons() {
      var isFirst = idx === 0, isLast = idx === studies.length - 1;
      prevBtn.disabled = isFirst;
      prevBtn.style.background = isFirst ? 'rgba(217,164,65,0.06)' : '#d9a441';
      prevBtn.style.cursor = isFirst ? 'default' : 'pointer';
      prevBtn.querySelector('svg').setAttribute('stroke', isFirst ? '#d9a441' : '#fff');
      prevBtn.querySelector('svg').style.opacity = isFirst ? '0.3' : '1';
      nextBtn.disabled = isLast;
      nextBtn.style.background = isLast ? 'rgba(217,164,65,0.06)' : '#d9a441';
      nextBtn.style.cursor = isLast ? 'default' : 'pointer';
      nextBtn.querySelector('svg').setAttribute('stroke', isLast ? '#d9a441' : '#fff');
      nextBtn.querySelector('svg').style.opacity = isLast ? '0.3' : '1';
    }

    function render() {
      var s = studies[idx];
      document.getElementById('cs-logo').src = s.logo;
      document.getElementById('cs-logo').alt = s.alt;
      document.getElementById('cs-problem').textContent = s.problem;
      document.getElementById('cs-solution').textContent = s.solution;
      document.getElementById('cs-stat1').textContent = s.stat1;
      document.getElementById('cs-label1').textContent = s.label1;
      document.getElementById('cs-stat2').textContent = s.stat2;
      document.getElementById('cs-label2').textContent = s.label2;
      document.getElementById('cs-stat3').textContent = s.stat3;
      document.getElementById('cs-label3').textContent = s.label3;
      updateButtons();
    }

    nextBtn.addEventListener('click', function () { if (idx < studies.length - 1) { idx++; render(); } });
    prevBtn.addEventListener('click', function () { if (idx > 0) { idx--; render(); } });
    render();

    // video lightbox
    var modal = document.getElementById('cs-modal');
    var video = document.getElementById('cs-modal-video');
    var closeBtn = document.getElementById('cs-modal-close');
    if (modal && video && closeBtn && modal.dataset.cs !== '1') {
      modal.dataset.cs = '1';
      document.querySelectorAll('.cs-thumb[data-video]').forEach(function (thumb) {
        thumb.addEventListener('click', function () {
          video.src = thumb.dataset.video;
          modal.classList.add('is-open');
          video.play().catch(function () {});
        });
      });
      var closeModal = function () { modal.classList.remove('is-open'); video.pause(); video.src = ''; };
      closeBtn.addEventListener('click', closeModal);
      modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  document.addEventListener('swup:contentReplaced', init);
})();
