/* Expand-on-hover strip for Featured Creators — vanilla port of the Originkit
   ExpandOnHover component. A row of creator cards: the focused one widens while
   the rest shrink to thin vertical slivers. Focus follows hover, keyboard focus
   and tap. Each card plays its UGC clip muted-looped; the focused card widens,
   reveals its profile chip, and can carry audio via its mute/unmute button
   (audio only after a user gesture, per autoplay policy). */
(function () {
  var ICON_MUTED = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M17 9l4 6M21 9l-4 6"/></svg>';
  var ICON_ON = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M16 9a4 4 0 0 1 0 6M19 7a7 7 0 0 1 0 10"/></svg>';

  function init() {
    var root = document.querySelector('.ukEx');
    if (!root || root.dataset.ex === '1') return;
    root.dataset.ex = '1';
    var scrollEl = root.querySelector('.ukEx_scroll');
    var items = Array.prototype.slice.call(root.querySelectorAll('.ukEx_item'));
    var n = items.length;
    if (!n) return;

    // when the row is wider than the viewport (many cards / small screens),
    // bring the focused card into the middle of the scroller
    function centerItem(it) {
      if (!scrollEl || scrollEl.scrollWidth <= scrollEl.clientWidth + 2) return;
      var ir = it.getBoundingClientRect(), sr = scrollEl.getBoundingClientRect();
      var delta = (ir.left + ir.width / 2) - (sr.left + sr.width / 2);
      scrollEl.scrollTo({ left: scrollEl.scrollLeft + delta, behavior: 'smooth' });
    }

    var videos = items.map(function (it) { return it.querySelector('.ukEx_video'); });
    var mutes = items.map(function (it) { return it.querySelector('.ukCf_mute'); });
    var expanded = parseInt(root.dataset.start || '0', 10) || 0;
    expanded = Math.max(0, Math.min(n - 1, expanded));
    var audioOn = false;   // focused card only, and only after a user gesture
    var onScreen = true;
    var startIndex = expanded;   // the card the effect must always resolve to
    var startIndex = expanded;   // the card the effect always resolves to

    function safePlay(v) { if (!v) return; var p = v.play(); if (p && p.catch) p.catch(function () {}); }

    // keep preload light (metadata); calling play() pulls in the data, and the
    // ready events retry play() so cards never stay stuck on a black frame
    videos.forEach(function (v) {
      if (!v) return;
      ['loadeddata', 'canplay'].forEach(function (evt) { v.addEventListener(evt, function () { sync(); }); });
    });

    function sync() {
      for (var i = 0; i < n; i++) {
        var on = i === expanded;
        items[i].classList.toggle('is-exp', on);
        items[i].setAttribute('aria-expanded', on ? 'true' : 'false');
        var v = videos[i];
        if (v) {
          // only the expanded card runs. Playing all twelve at once made the row
          // thrash and read as cards moving on their own.
          if (onScreen && on) safePlay(v);
          else if (!v.paused) { v.pause(); try { if (v.currentTime > 0.05) v.currentTime = 0.05; } catch (e) {} }
          v.muted = !(on && audioOn && onScreen);
        }
      }
      var btn = mutes[expanded];
      if (btn) {
        var a = audioOn && onScreen;
        btn.innerHTML = a ? ICON_ON : ICON_MUTED;
        btn.setAttribute('aria-pressed', a ? 'true' : 'false');
        btn.setAttribute('aria-label', a ? 'Mute video' : 'Unmute video');
        btn.classList.toggle('is-on', a);
      }
    }

    function expand(i) { if (i === expanded) return; expanded = i; sync(); centerItem(items[i]); }

    items.forEach(function (it, i) {
      it.addEventListener('mouseenter', function () { expand(i); });
      it.addEventListener('focus', function () { expand(i); });
      it.addEventListener('click', function () { expand(i); });
      it.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); expand(i); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); var t = items[(i + 1) % n]; if (t) t.focus(); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); var p = items[(i - 1 + n) % n]; if (p) p.focus(); }
      });
    });

    mutes.forEach(function (btn, i) {
      if (!btn) return;
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (i !== expanded) return;
        audioOn = !audioOn;
        // surfer.js fires this the moment the hero card seats in slot 0, so the row
    // always resolves to the first card no matter what was hovered last.
    document.addEventListener('ukex:reset', function () {
      if (expanded !== startIndex) { expanded = startIndex; sync(); }
    });

    sync();
      });
    });

    // pause + drop audio while scrolled out of view. Leaving also resets the open
    // card to the first one: the hero card always lands on slot 0, so if the row
    // kept whatever was last hovered, the arrival would target the wrong card.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (ents) {
        ents.forEach(function (en) {
          onScreen = en.isIntersecting;
          if (!onScreen) expanded = startIndex;
          sync();
        });
      }, { threshold: 0.15 }).observe(root);
    }

    sync();
    // centre the default-expanded card once layout settles (matters on mobile)
    setTimeout(function () { centerItem(items[expanded]); }, 80);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  document.addEventListener('swup:contentReplaced', init);
})();
