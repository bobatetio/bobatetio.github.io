/* For Hotels hero — the Ask bar's marketing-side behaviour.

   The bar is the app's Ask AI component, but this page is not the app: there is
   no signed-in hotel, no seeded stays to reason over, and no key to answer with.
   So it does the one honest thing a marketing page can: it carries what the
   operator typed into sign-up, where the real Ask AI picks it up. It does not
   fake a reply.

   The examples are the hotel-side placeholders out of assets/js/ukask.js, so the
   bar says the same things here as it does inside. The difference is that they
   are typed out rather than swapped in, because on a landing page the point is
   to show an operator what a question to this thing looks like, and watching one
   appear reads as an invitation in a way a static string does not. */
(function () {
  var form = document.querySelector('[data-hero-ask]');
  if (!form) return;
  var input = form.querySelector('[data-ask-q]');
  if (!input) return;

  var reduced = !!(window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* The hotel set is initHotel()'s from ukask.js, verbatim. The creator page
     mounts the same bar with initCreator()'s set, handed over on the form so
     one script drives both heroes rather than two copies drifting apart. */
  var LINES = (function () {
    var raw = form.getAttribute('data-ask-lines');
    if (raw) { try { var a = JSON.parse(raw); if (a && a.length) return a; } catch (e) {} }
    return [
      'I need creators for a weekend launch...',
      'I have an empty room next Tuesday...',
      'Find me creators who fit wellness and design...'
    ];
  })();

  var TYPE = 46;      // per character, going in
  var ERASE = 24;     // coming back out, faster: nobody reads a deletion
  var HOLD = 2200;    // long enough to read the finished line
  var GAP = 420;      // beat between one line clearing and the next starting

  var line = 0, chars = 0, erasing = false, timer = null, stopped = false;

  /* The caret blinks the way a real one does, so the line reads as something
     being typed rather than a string with a bar stuck on the end. */
  var caretOn = true, caretTimer = null;
  var text = '';
  function paint(t) { text = t; input.setAttribute('placeholder', t + (caretOn ? '\u258f' : '\u2007')); }
  caretTimer = setInterval(function () {
    if (stopped) return;
    caretOn = !caretOn;
    input.setAttribute('placeholder', text + (caretOn ? '\u258f' : '\u2007'));
  }, 530);

  function step() {
    if (stopped) return;
    var full = LINES[line];

    if (!erasing) {
      chars++;
      paint(full.slice(0, chars));
      if (chars >= full.length) { erasing = true; timer = setTimeout(step, HOLD); return; }
      timer = setTimeout(step, TYPE);
      return;
    }

    chars--;
    paint(full.slice(0, chars));
    if (chars <= 0) {
      erasing = false;
      line = (line + 1) % LINES.length;
      timer = setTimeout(step, GAP);
      return;
    }
    timer = setTimeout(step, ERASE);
  }

  /* Stop the moment the field is someone else's: a caret animating under a
     person's own typing is noise, and it never comes back for that visit. */
  function stop() {
    stopped = true;
    if (timer) { clearTimeout(timer); timer = null; }
    if (caretTimer) { clearInterval(caretTimer); caretTimer = null; }
    input.setAttribute('placeholder', LINES[0]);
  }

  if (reduced) {
    input.setAttribute('placeholder', LINES[0]);
  } else {
    input.addEventListener('focus', stop, { once: true });
    input.addEventListener('input', stop, { once: true });
    timer = setTimeout(step, 700);
  }

  /* a chip is a worked example of what to type, so it fills the field rather
     than submitting: the operator still sees and edits the sentence */
  form.addEventListener('click', function (e) {
    var chip = e.target.closest('[data-ask-fill]');
    if (!chip) return;
    stop();
    input.value = chip.getAttribute('data-ask-fill');
    input.focus();
    try { input.setSelectionRange(input.value.length, input.value.length); } catch (err) {}
  });

  /* an empty field should still reach sign-up, just without a query string */
  form.addEventListener('submit', function () {
    if (!input.value.trim()) input.removeAttribute('name');
  });
})();
