/* The exchange, drawn: a creator's video travels left to right, crosses the
   beam, and comes out the other side as what the stay actually returned. The
   conversion is a clip on two stacked layers, so the change happens exactly at
   the beam rather than on a timer. Ported from a React/three.js reference to
   plain DOM and one 2D canvas. */
(function () {
  var band = document.querySelector('[data-uk-scan]');
  if (!band) return;

  var track  = band.querySelector('.ukScan_track');
  var beam   = (band.parentNode || band).querySelector('.ukScan_beam');
  var sparks = (band.parentNode || band).querySelector('.ukScan_sparks');
  if (!track || !beam || !sparks) return;

  var SPEED = 46;                                 /* px per second */
  var PERIOD = 6;                                 /* cards before the sequence repeats */
  var stills = (band.dataset.stills || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
  var clips  = (band.dataset.clips  || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);

  /* what a stay gives back, in the language the rest of the page uses */
  var OUTCOMES = [
    { k: 'Direct bookings', v: '12',    n: 'traced to one post' },
    { k: 'Tracked clicks',  v: '4.2K',  n: 'from the link in bio' },
    { k: 'Nights filled',   v: '9',     n: 'that were sitting open' },
    { k: 'Assets kept',     v: '34',    n: 'yours to reuse, forever' },
    { k: 'Booking rate',    v: '6.2%',  n: 'of everyone who clicked' },
    { k: 'Total reach',     v: '1.2M',  n: 'on the creator’s own feed' }
  ];


  /* two full periods, so translating by exactly one period is seamless */
  /* the figure is split so it can be counted up to on the way out */
  function parseFigure(v) {
    var m = /^([\d.]+)(.*)$/.exec(v);
    if (!m) return null;
    var dp = (m[1].split('.')[1] || '').length;
    return { n: parseFloat(m[1]), dp: dp, suffix: m[2] || '' };
  }
  var COUNT_MS = 760;
  var cards = [], n = PERIOD * 2;
  for (var i = 0; i < n; i++) {
    var o = OUTCOMES[i % OUTCOMES.length];   /* 6 into 12: repeats every period */
    var w = document.createElement('div');
    w.className = 'ukScan_card';
    var still = stills[i % stills.length];
    var face = clips.length
      ? '<video muted loop playsinline preload="none" poster="' + still + '" src="' + clips[i % clips.length] + '"></video>'
      : '<img src="' + still + '" alt="" loading="lazy" decoding="async">';
    w.innerHTML =
      '<div class="ukScan_in">' + face + '</div>' +
      '<div class="ukScan_out"><b>0</b><i>' + o.k + '</i><em>' + o.n + '</em></div>';
    track.appendChild(w);
    cards.push({ el: w, a: w.firstChild, b: w.lastChild, state: -1,
                 v: w.querySelector('video'), on: false,
                 num: w.querySelector('.ukScan_out b'), fig: parseFigure(o.v),
                 t0: 0, counting: false, done: false });
  }

  var cycle = 0;                                  /* measured, so it tracks the CSS */
  function measure() {
    var first = cards[0].el, second = cards[1].el;
    var step = second.getBoundingClientRect().left - first.getBoundingClientRect().left;
    cycle = step * PERIOD;
  }
  var pos = 0, last = 0, raf = 0, live = false;

  /* sparks thrown off the beam, carried along by the stream */
  var ctx = sparks.getContext('2d'), dpr = Math.min(devicePixelRatio || 1, 2), P = [], hot = 0;
  /* the backing store must follow the canvas's real CSS size, or the drawing
     space is stretched and the sparks drift at the wrong speed and shape */
  function sizeCanvas() {
    var w = sparks.offsetWidth, h = sparks.offsetHeight;
    if (!w || !h) return false;
    var bw = Math.round(w * dpr), bh = Math.round(h * dpr);
    if (sparks.width === bw && sparks.height === bh) return true;
    sparks.width = bw; sparks.height = bh;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    P.length = 0;                          /* respawn into the corrected space */
    return true;
  }
  function newSpark(w, h) {
    return { x: w / 2 + (Math.random() - .5) * 4, y: Math.random() * h,
             vx: Math.random() * 1.5 + .35, vy: (Math.random() - .5) * .35,
             r: Math.random() * .9 + .35, a: Math.random() * .45 + .5, life: 1,
             decay: Math.random() * .012 + .004 };
  }

  function frame(now) {
    var dt = last ? Math.min((now - last) / 1000, .05) : 0;
    last = now;

    var r = band.getBoundingClientRect();
    var beamX = r.width / 2;

    pos += SPEED * dt;                       /* left to right */
    if (cycle && pos >= cycle) pos -= cycle;
    /* the run holds two identical periods, so sliding back by one is invisible */
    track.style.transform = 'translate3d(' + (pos - cycle) + 'px,0,0)';

    /* the card is video where it has not yet crossed, outcome where it has */
    var crossing = false;
    for (var i = 0; i < cards.length; i++) {
      var c = cards[i], cr = c.el.getBoundingClientRect();
      var left = cr.left - r.left, right = left + cr.width;
      var t;
      if (right <= beamX) { t = 1; }        /* still short of the beam: all video */
      else if (left >= beamX) { t = 0; }    /* wholly through it: all outcome */
      else { t = (beamX - left) / cr.width; crossing = true; }

      var q = Math.round(t * 100);
      if (q !== c.state) {                  /* only write when it actually changes */
        c.state = q;
        c.a.style.clipPath = 'inset(0 ' + (100 - q) + '% 0 0)';
        c.b.style.clipPath = 'inset(0 0 0 ' + q + '%)';
      }

      /* the figure counts up as the card comes out the other side, then
         holds; it re-arms once the card is back to being a video */
      if (c.fig && c.num) {
        if (!c.done && !c.counting && q < 94) { c.counting = true; c.t0 = now; }
        if (q > 99 && c.done) { c.done = false; c.num.textContent = '0'; }
        if (c.counting) {
          var e = (now - c.t0) / COUNT_MS;
          if (e >= 1) { e = 1; c.counting = false; c.done = true; }
          var k = 1 - Math.pow(1 - e, 3);
          c.num.textContent = (c.fig.n * k).toFixed(c.fig.dp) + c.fig.suffix;
        }
      }

      /* a clip runs only while its card is over the band */
      if (c.v) {
        var vis = right > -60 && left < r.width + 60;
        if (vis !== c.on) {
          c.on = vis;
          if (vis) { c.v.preload = 'auto'; c.v.play().catch(function () {}); }
          else { c.v.pause(); }
        }
      }
    }
    beam.classList.toggle('is-hot', crossing);

    /* sparks, on their own canvas: the rod is its centre line */
    sizeCanvas();                          /* self-heals if layout changed under it */
    var sw = sparks.width / dpr, sh = sparks.height / dpr;
    hot += ((crossing ? 260 : 90) - hot) * .05;
    while (P.length < hot) P.push(newSpark(sw, sh));
    while (P.length > hot) P.pop();
    ctx.clearRect(0, 0, sw, sh);
    for (var j = 0; j < P.length; j++) {
      var p = P[j];
      p.x += p.vx; p.y += p.vy; p.life -= p.decay;
      if (p.life <= 0 || p.x > sw) P[j] = p = newSpark(sw, sh);
      ctx.globalAlpha = p.a * p.life;
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
    }
    ctx.globalAlpha = 1;

    raf = requestAnimationFrame(frame);
  }

  function start() { if (live) return; live = true; sizeCanvas(); measure(); last = 0; raf = requestAnimationFrame(frame); }
  function stop()  {
    live = false; cancelAnimationFrame(raf);
    cards.forEach(function (c) { if (c.v && c.on) { c.v.pause(); c.on = false; } });
  }

  addEventListener('resize', function () { if (live) { sizeCanvas(); measure(); } });
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); });

  if (matchMedia('(prefers-reduced-motion:reduce)').matches) {
    /* still, but still legible: the left half video, the right half returned */
    band.classList.add('is-still');
    measure();
    track.style.transform = 'translate3d(' + (-cycle * .5) + 'px,0,0)';
    cards.forEach(function (c, i) {
      var q = i % 2 ? 0 : 100;
      c.a.style.clipPath = 'inset(0 ' + (100 - q) + '% 0 0)';
      c.b.style.clipPath = 'inset(0 0 0 ' + q + '%)';
    });
    return;
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (en) { en.isIntersecting && !document.hidden ? start() : stop(); });
    }, { threshold: .12 }).observe(band);
  } else { start(); }
})();
