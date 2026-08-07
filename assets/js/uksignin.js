/* Ukreate — the one login door.
   HONEST INTERIM. There is no shared user store and no credential check anywhere in this
   build (see AUTH AUDIT in BUILD_LOG.md), so this cannot look an email up and decide which
   side it belongs to. Instead it remembers the last side used ON THIS DEVICE and offers a
   calm two-button choice when it does not know. When a real auth layer exists, delete the
   picker and the localStorage read: resolve the side from the session and route on that.
   Routing is all this file does. It never touches either app's internals. */
(function () {
  var root = document.querySelector('[data-uksignin]');
  if (!root) return;

  var KEY = 'uk_side';
  var SIDES = {
    hotel:   { label: 'hotel',   go: '/app/',     back: '/login/' },
    creator: { label: 'creator', go: '/creator/', back: '/creator/login/' }
  };

  function remembered() {
    var v; try { v = localStorage.getItem(KEY); } catch (e) {}
    return SIDES[v] ? v : null;
  }
  function remember(side) { try { localStorage.setItem(KEY, side); } catch (e) {} }

  root.querySelectorAll('[data-icon]').forEach(function (el) {
    el.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      ((window.UKICONS || {})[el.dataset.icon] || '') + '</svg>';
    el.classList.add('ukIco', 'ukIco--on');
  });

  if (/[?&]out=1/.test(location.search)) root.querySelector('#ukOut').hidden = false;

  /* The card is swapped wholesale for the reset panel and swapped back, so nothing
     here may hold a reference to an element inside it. Every listener below is
     delegated on root, which survives the swap. */
  var card = root.querySelector('.ukAuth_card');
  var cardHTML = card.innerHTML;
  var cross = root.querySelector('.ukAuth_cross');
  var crossHTML = cross ? cross.innerHTML : '';
  var mode = 'old', sentTo = '';

  function icons() {
    root.querySelectorAll('[data-icon]').forEach(function (el) {
      if (el.firstChild) return;
      el.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
        ((window.UKICONS || {})[el.dataset.icon] || '') + '</svg>';
      el.classList.add('ukIco', 'ukIco--on');
    });
  }

  function paint() {
    if (mode === 'reset' || mode === 'sent') {
      /* the header carries the way back out while the panel is up */
      if (cross) cross.innerHTML = window.UKAUTHX.backLink('Back to log in');
      card.innerHTML = mode === 'sent'
        ? window.UKAUTHX.resetSent(sentTo, 'Back to log in')
        : window.UKAUTHX.resetPanel({
            title: 'Reset your password.',
            lede: 'Tell us the email on the account and we will send a link to set a new one.',
            ph: 'you@yourwork.com' });
      return;
    }
    if (cross) cross.innerHTML = crossHTML;
    if (!root.querySelector('#ukForm')) card.innerHTML = cardHTML;

    var gWrap = root.querySelector('#ukGoogleWrap');
    if (gWrap && !gWrap.firstChild) {
      gWrap.innerHTML = window.UKAUTHX.googleBtn('Log in with Google', 'above');
    }
    icons();

    var side = remembered();
    root.querySelector('#ukKnown').hidden = !side;
    root.querySelector('#ukPick').hidden = !!side;
    /* The lede must not name a side. What this device remembers is not the same thing
       as the account being typed in: someone can enter creator credentials on a
       device that last logged in as a hotel, and promising to take them "back to
       your hotel account" would be a claim the form cannot keep. */
    root.querySelector('#ukLede').textContent =
      'Log in and we’ll take you to the right place.';
    /* The remembered side is conveyed by the lede alone now; there is no second
       message repeating it. */
  }

  /* validation, errors and the busy state come from the shared module, so this door
     cannot drift from the other two again */
  function fail(msg, field) { return window.UKAUTHX.fail(root, msg, field); }

  root.addEventListener('click', function (e) {
    /* No "log in to the other side" option: an account belongs to one side, so once
       someone has signed up their email already determines where they land. When real
       auth exists the side comes from the account and this question disappears
       entirely — see the credential PLUG-IN POINT in ukauthx.js. */
    var r = e.target.closest('[data-reveal]');
    if (r) {
      var pw = root.querySelector('[name=password]');
      var hid = pw.type === 'password';
      pw.type = hid ? 'text' : 'password';
      r.setAttribute('aria-pressed', hid ? 'true' : 'false');
      r.setAttribute('aria-label', hid ? 'Hide password' : 'Show password');
    }
  });

  root.addEventListener('submit', function (e) {
    if (e.target.id === 'ukResetForm') {
      e.preventDefault();
      var f = e.target.querySelector('[name=remail]');
      var v = (f.value || '').trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
        return fail('Enter the email on your account so we know where to send it.', 'remail');
      }
      window.UKAUTHX.busy(e.target.querySelector('#ukResetGo'), 'Sending\u2026');
      window.UKAUTHX.sendReset(v, function (to) { sentTo = to; mode = 'sent'; paint(); });
      return;
    }
    if (e.target.id !== 'ukForm') return;
    e.preventDefault();
    // Which side did they ask for? An explicit picker button wins; otherwise the remembered one.
    var btn = e.submitter || document.activeElement;
    var asked = btn && btn.getAttribute ? btn.getAttribute('data-side') : null;
    var side = SIDES[asked] ? asked : remembered();
    if (!side) { fail('Pick which account you are logging in to.'); return; }
    if (!window.UKAUTHX.validate(root, {})) return;

    remember(side);
    window.UKAUTHX.go(SIDES[side].go, btn && btn.tagName === 'BUTTON' ? btn : null,
      'Signing you in\u2026');
  });

  root.addEventListener('input', function () { window.UKAUTHX.clear(root); });

  /* reset panel in and out */
  root.addEventListener('click', function (e) {
    if (e.target.closest('[data-reset]')) { mode = 'reset'; paint(); return; }
    var m = e.target.closest('[data-mode]');
    if (m) {
      mode = m.dataset.mode;
      paint();
      var em = root.querySelector('[name=email]');
      if (em) em.focus();
    }
  });

  /* Google on the shared door: it can only route if this device already knows the
     side, so when it does not we ask the same one question the form asks. */
  root.addEventListener('click', function (e) {
    var g = e.target.closest('[data-google]');
    if (!g) return;
    var side = remembered();
    if (!side) return fail('Pick which account you are logging in to, then Google can take you there.');
    window.UKAUTHX.onGoogle(g, side, SIDES[side].go);
  });

  paint();
})();
