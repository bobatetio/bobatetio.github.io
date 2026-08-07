/* Philosophy-section video: the card shows a thumbnail with a play button;
   clicking it opens a full-screen lightbox with the video playing large.
   The iframe is created only on open and destroyed on close, so playback
   always stops and nothing streams in the background. */
(function () {
  var lightbox = null;
  var lastFocus = null;

  function buildLightbox() {
    var box = document.createElement('div');
    box.className = 'philoLightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Video player');
    box.innerHTML =
      '<button class="philoLightbox_close" type="button" aria-label="Close video">' +
        '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">' +
        '<path d="M4 4l10 10M14 4L4 14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
        '</svg>' +
      '</button>' +
      '<div class="philoLightbox_stage"><div class="philoLightbox_frame"></div></div>';
    document.body.appendChild(box);

    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.closest('.philoLightbox_close')) close();
    });
    return box;
  }

  function open(id) {
    if (!lightbox) lightbox = buildLightbox();
    lastFocus = document.activeElement;

    var frame = lightbox.querySelector('.philoLightbox_frame');
    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + id +
                 '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
    iframe.title = 'Video';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    frame.appendChild(iframe);

    document.documentElement.classList.add('philoLightbox-open');
    requestAnimationFrame(function () { lightbox.classList.add('is-open'); });
    var closeBtn = lightbox.querySelector('.philoLightbox_close');
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    document.documentElement.classList.remove('philoLightbox-open');
    // destroy the iframe so audio/playback stops immediately
    var frame = lightbox.querySelector('.philoLightbox_frame');
    if (frame) frame.innerHTML = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });

  function init() {
    var els = document.querySelectorAll('[data-philo-video]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.dataset.ready === '1') continue;
      el.dataset.ready = '1';

      // scroll-reveal: let the theme's built-in .homePhilosophy_video grow-in
      // (scale .88 -> 1, fade in) play once when the player scrolls into view.
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries, obs) {
          entries.forEach(function (en) {
            if (en.isIntersecting) { en.target.classList.add('is-in'); obs.unobserve(en.target); }
          });
        }, { threshold: 0.25 }).observe(el);
      } else {
        el.classList.add('is-in');
      }

      var id = el.getAttribute('data-video-id');
      if (!id) continue;

      var inner = el.querySelector('.homePhilosophy_videoInner');
      if (!inner) continue;

      // poster thumbnail (falls back if maxres isn't available)
      var img = document.createElement('img');
      img.className = 'philoThumb';
      img.alt = '';
      img.loading = 'lazy';
      img.src = 'https://img.youtube.com/vi/' + id + '/maxresdefault.jpg';
      img.addEventListener('error', function () {
        if (this.src.indexOf('maxresdefault') !== -1) {
          this.src = this.src.replace('maxresdefault', 'hqdefault');
        }
      });
      inner.appendChild(img);

      var btn = document.createElement('button');
      btn.className = 'philoPlay';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Play video');
      btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 15 15" aria-hidden="true">' +
                      '<path d="M4.5 3.2v8.6L12 7.5z" fill="currentColor"/></svg>';
      inner.appendChild(btn);

      (function (vid) {
        el.addEventListener('click', function () { open(vid); });
      })(id);
      el.style.cursor = 'pointer';
    }

    // reveal the "Creator Revolution" card the same way (slide/fade up on scroll)
    var box = document.querySelector('.philoVideoBox');
    if (box && box.dataset.reveal !== '1') {
      box.dataset.reveal = '1';
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries, obs) {
          entries.forEach(function (en) {
            if (en.isIntersecting) { en.target.classList.add('is-in'); obs.unobserve(en.target); }
          });
        }, { threshold: 0.2 }).observe(box);
      } else {
        box.classList.add('is-in');
      }
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  document.addEventListener('swup:contentReplaced', init);
})();
