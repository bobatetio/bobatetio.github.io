/* Ukreate marketing navbar behaviour: mobile menu toggle + scroll-aware pill.
   Idempotent, so it is safe to run again after a client-side page transition. */
(function () {
  function init() {
    var nav = document.querySelector('.aeroNav');
    if (!nav || nav.dataset.aeroReady === '1') return;
    nav.dataset.aeroReady = '1';

    var burger = nav.querySelector('.aeroNav_burger');
    var links = nav.querySelector('.aeroNav_links');
    if (burger && links) {
      var setOpen = function (open) {
        burger.classList.toggle('is-open', open);
        links.classList.toggle('is-open', open);
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      };
      burger.addEventListener('click', function () {
        setOpen(!burger.classList.contains('is-open'));
      });
      links.addEventListener('click', function (e) {
        if (e.target.closest('a')) setOpen(false);
      });
      addEventListener('keydown', function (e) {
        if (e.key === 'Escape') setOpen(false);
      });
    }

    // scroll-aware state: transparent over the hero, solid white pill + dark text after it
    var toggleScrolled = function (scrolled) { nav.classList.toggle('is-scrolled', scrolled); };
    var navH = nav.offsetHeight || 88;
    var hero = document.querySelector('.homeHeader');
    if (hero && 'IntersectionObserver' in window) {
      // hero fills the first viewport; once its bottom passes the nav, go solid
      new IntersectionObserver(function (entries) {
        toggleScrolled(!entries[0].isIntersecting);
      }, { rootMargin: '-' + navH + 'px 0px 0px 0px', threshold: 0 }).observe(hero);
    } else {
      var sentinel = document.querySelector('[data-aero-sentinel]');
      if (sentinel && 'IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          toggleScrolled(!entries[0].isIntersecting);
        }, { threshold: 0 }).observe(sentinel);
      } else {
        addEventListener('scroll', function () {
          toggleScrolled((window.scrollY || window.pageYOffset || 0) > navH);
        }, { passive: true });
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  // re-check after swup page transitions (nav persists, sentinel may be re-rendered)
  document.addEventListener('swup:contentReplaced', init);
})();

/* hero scroll button: glide to the next section */
document.addEventListener('click', function (e) {
  var b = e.target.closest && e.target.closest('.heroScroll');
  if (!b) return;
  var next = document.querySelector('.homePhilosophy') || document.querySelector('#swup section');
  if (!next) return;
  var top = next.getBoundingClientRect().top + (window.pageYOffset || 0) - 40;
  window.scrollTo({ top: top, behavior: 'smooth' });
});
