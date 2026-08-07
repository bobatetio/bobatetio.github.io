/* Cylinder carousel — builds the drum from a roster and spins it.
   Rotation runs on rAF rather than a CSS animation because we need the live
   angle to decide which cards face the viewer: only those play their video, so
   ten clips are never decoding at once. */
(function () {
  var ROSTER = [
    { v: 'ugc-01', av: 'av-01', name: 'Maya Lin',       flag: '🇸🇬', loc: 'Marina Bay',   chips: ['Testimonials', 'POV Vlogs'],      rating: '4.9', jobs: '132 jobs completed' },
    { v: 'ugc-02', av: 'av-02', name: 'Lena Petrou',    flag: '🇬🇷', loc: 'Oia',          chips: ['Hotel Tours', 'B-Roll'],          rating: '4.8', jobs: '98 jobs completed' },
    { v: 'ugc-03', av: 'av-03', name: 'Amira Hassan',   flag: '🇦🇪', loc: 'Jumeirah',     chips: ['Luxury Reels', 'Testimonials'],   rating: '4.7', jobs: '87 jobs completed' },
    { v: 'ugc-04', av: 'av-04', name: 'Ava Bennett',    flag: '🇬🇧', loc: 'Notting Hill', chips: ['Lifestyle', 'POV Vlogs'],         rating: '5.0', jobs: '154 jobs completed' },
    { v: 'ugc-05', av: 'av-05', name: 'Stella Laurent', flag: '🇫🇷', loc: 'Le Marais',    chips: ['Fashion', 'B-Roll'],              rating: '4.6', jobs: '76 jobs completed' },
    { v: 'ugc-06', av: 'av-06', name: 'Marco Rossi',    flag: '🇮🇹', loc: 'Trastevere',   chips: ['Food & Dining', 'Vlogs'],         rating: '4.9', jobs: '121 jobs completed' },
    { v: 'ugc-07', av: 'av-07', name: 'Priya Nair',     flag: '🇲🇻', loc: 'Maafushi',     chips: ['Resort Tours', 'Drone'],          rating: '4.8', jobs: '93 jobs completed' },
    { v: 'ugc-08', av: 'av-08', name: 'Sofia Reyes',    flag: '🇺🇸', loc: 'South Beach',  chips: ['Golden Hour', 'Reels'],           rating: '4.7', jobs: '68 jobs completed' },
    { v: 'ugc-09', av: 'av-09', name: 'Kanya Som',      flag: '🇹🇭', loc: 'Thonglor',     chips: ['Poolside', 'B-Roll'],             rating: '4.9', jobs: '112 jobs completed' },
    { v: 'ugc-10', av: 'av-10', name: 'Diego Marin',    flag: '🇪🇸', loc: 'El Born',      chips: ['Drone', 'Hotel Tours'],           rating: '4.8', jobs: '105 jobs completed' }
  ];

  var SPIN = 360 / 32;   // degrees per second — the component's 32s per turn
  var PLAY_ARC = 46;     // a card plays while within this many degrees of centre
  var EASE = 0.09;       // how quickly the drum eases up to speed
  var SEATS = 20;        // seats on the ring — see buildSeats()
  var PERSP = 1.2;       // perspective as a fraction of the ring radius

  /* The ring has to be far wider than the viewport, so only a shallow slice of
     it crosses the screen. Radius grows with the seat count, so 10 clips are
     dealt twice around 20 seats. Each clip's two seats sit exactly 180 apart
     and the visible arc is ~142 degrees, so a pair can never both be on screen. */
  function buildSeats(roster) {
    var seats = [], half = SEATS / 2;
    for (var i = 0; i < SEATS; i++) seats.push(roster[i % half % roster.length]);
    return seats;
  }

  function el(tag, cls, parent) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (parent) parent.appendChild(n);
    return n;
  }

  // Phones get still portraits rather than 20 video elements. The drum reads the
  // same, but the page went from ~105MB to a fraction of it.
  var STILLS = window.matchMedia && window.matchMedia('(max-width: 900px)').matches;
  var PORTRAITS = ['orbit-01','orbit-02','orbit-03','orbit-04','orbit-05','orbit-06',
                   'orbit-07','orbit-08','orbit-09','orbit-10','orbit-11'];

  function buildCard(c, idx) {
    var card = el('div', 'ukCyl_card');
    card.setAttribute('role', 'group');
    card.setAttribute('aria-label', c.name + ', ' + c.loc);

    if (STILLS) {
      var img = document.createElement('img');
      img.src = '/assets/img/uk/orbit/' + PORTRAITS[idx % PORTRAITS.length] + '.webp';
      img.alt = ''; img.width = 240; img.height = 240;
      img.loading = 'lazy'; img.decoding = 'async';
      card.appendChild(img);
      return { el: card, video: null, playing: false };
    }

    var vid = document.createElement('video');
    vid.src = '/assets/video/ugc/' + c.v + '.mp4';
    vid.muted = true; vid.loop = true; vid.playsInline = true;
    vid.setAttribute('muted', ''); vid.setAttribute('playsinline', '');
    vid.preload = 'metadata';
    // park on a real frame so a paused card is never a black rectangle
    vid.addEventListener('loadedmetadata', function () {
      try { if (vid.paused) vid.currentTime = 0.05; } catch (e) {}
    }, { once: true });
    card.appendChild(vid);

    return { el: card, video: vid, playing: false };
  }

  function build(host) {
    var seats = buildSeats(ROSTER);
    var n = seats.length;
    var drum = el('div', 'ukCyl_drum', host);
    host.style.setProperty('--n', n);

    var cards = seats.map(function (c, i) {
      var card = buildCard(c, i);
      drum.appendChild(card.el);
      return card;
    });

    // Ring radius: half a card plus a gap, projected out by the half-angle.
    // translateZ stays NEGATIVE, as in the source component: that seats the ring
    // behind the origin so we look at the concave inside of the drum. The middle
    // of the arc is the far wall (smallest) and the sides curve toward the
    // camera (largest) — the wide U. A positive Z would bulge it the other way.
    var step = 360 / n;
    function layout() {
      var w = parseFloat(getComputedStyle(host).getPropertyValue('--w')) || 330;
      var gap = 8;
      var radius = (0.5 * w + 0.5 * gap) / Math.tan((Math.PI / 180) * (step / 2));
      // Perspective as a share of the radius: this sets how deep the U bows.
      // Higher is flatter — the near edges now project ~1.5x the far middle
      // rather than ~2.1x. The ratio holds at every breakpoint.
      host.style.perspective = (radius * PERSP).toFixed(0) + 'px';
      cards.forEach(function (c, i) {
        c.el.style.transform = 'rotateY(' + (i * step) + 'deg) translateZ(' + (-radius).toFixed(1) + 'px)';
      });
    }
    layout();
    if ('ResizeObserver' in window) new ResizeObserver(layout).observe(host);

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var angle = 0;          // current drum rotation, degrees
    var speed = reduce ? 0 : SPIN;
    var wanted = speed;
    var last = 0, raf = null;

    function frame(t) {
      var dt = last ? Math.min((t - last) / 1000, 0.1) : 0;
      last = t;
      speed += (wanted - speed) * EASE;
      angle = (angle + speed * dt) % 360;
      drum.style.transform = 'rotateY(' + angle + 'deg)';

      // a card's own facing = drum angle + its seat on the ring
      for (var i = 0; i < cards.length; i++) {
        var face = (angle + i * step) % 360;
        if (face > 180) face -= 360;
        if (face < -180) face += 360;
        var front = Math.abs(face) <= PLAY_ARC;
        var c = cards[i];
        if (!c.video) continue;
        if (front && !c.playing) {
          c.playing = true;
          var p = c.video.play();
          if (p && p.catch) p.catch(function () {});
        } else if (!front && c.playing) {
          c.playing = false;
          c.video.pause();
        }
      }
      raf = requestAnimationFrame(frame);
    }

    function start() { if (raf === null) { last = 0; raf = requestAnimationFrame(frame); } }
    function stop() {
      if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
      cards.forEach(function (c) { if (c.video && c.playing) { c.playing = false; c.video.pause(); } });
    }

    drum.style.transform = 'rotateY(0deg)';
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { en.isIntersecting ? start() : stop(); });
      }, { threshold: 0 }).observe(host);
    } else {
      start();
    }
  }

  function init() {
    var host = document.querySelector('[data-cylinder]');
    if (!host || host.dataset.ready === '1') return;
    host.dataset.ready = '1';
    try { build(host); } catch (e) { /* decorative — never block the page */ }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  document.addEventListener('swup:contentReplaced', init);
})();
