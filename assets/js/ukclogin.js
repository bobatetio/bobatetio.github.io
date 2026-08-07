/* Ukreate — creator sign in / sign up. Creator-only; hotels have their own door. */
(function () {
  var root = document.querySelector('[data-ukclogin]');
  if (!root) return;
  root.querySelectorAll('[data-icon]').forEach(function (el) {
    el.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      ((window.UKICONS || {})[el.dataset.icon] || '') + '</svg>';
    el.classList.add('ukIco', 'ukIco--on');
  });
  if (/[?&]out=1/.test(location.search)) root.querySelector('#ukOut').hidden = false;

  // The front door (/join/) sends creators here with ?new=1 so they land on sign-up, not sign-in.
  var mode = /[?&]new=1/.test(location.search) ? 'new' : 'old';
  var pw = root.querySelector('[name=password]');
  var ask = root.querySelector('.ukStart_ask');
  var askHTML = ask.innerHTML;   // keep the real form to restore
  var sentTo = '';

  function paint() {
    /* reset is a real state, not a dead link */
    if (mode === 'reset' || mode === 'sent') {
      var cross = root.querySelector('.ukAuth_cross');
      if (cross) cross.innerHTML = UKAUTHX.backLink('Back to sign in');
      ask.innerHTML = mode === 'sent'
        ? UKAUTHX.resetSent(sentTo, 'Back to sign in')
        : UKAUTHX.resetPanel({ title:'Let’s get you back in.', lede:'Give us the email on your account and we will send a link to set a new password.', ph:'you@yourname.com' });
      return;
    }
    if (!root.querySelector('#ukForm')) { ask.innerHTML = askHTML; bind(); }
    var isNew = mode === 'new';
    // Always name the side out loud, so nobody signs up on the wrong half of the product.
    root.querySelector('#ukSide').textContent = isNew
      ? 'Creating a creator account' : 'For travel creators';
    root.querySelector('#ukTitle').textContent = isNew ? 'Let’s get you started.' : 'Welcome back.';
    root.querySelector('#ukLede').textContent = isNew
      ? 'Two minutes and you’ll see hotels you could pitch this week.'
      : 'Let’s see who replied.';
    root.querySelector('#ukSubmit').textContent = isNew ? 'Create my account' : 'Sign in';
    root.querySelector('#ukPwLabel').textContent = isNew ? 'Pick a password' : 'Password';
    pw.setAttribute('autocomplete', isNew ? 'new-password' : 'current-password');
    pw.setAttribute('placeholder', isNew ? 'at least 8 characters' : 'your password');
    root.querySelectorAll('.ukNewOnly').forEach(function (n) { n.hidden = !isNew; });
    root.querySelectorAll('.ukOldOnly').forEach(function (n) { n.hidden = isNew; });
    var gWrap = root.querySelector('#ukGoogleWrap');
    if (gWrap && !gWrap.firstChild) gWrap.innerHTML = UKAUTHX.googleBtn('Log in with Google', 'above');
    root.querySelector('#ukSwap').innerHTML = 'New here? <a class="ukAuth_link" href="/join/">Create an account</a>';
  }
  root.addEventListener('submit', function (e) {
    if (e.target.id !== 'ukResetForm') return;
    e.preventDefault();
    var f = e.target.querySelector('[name=remail]');
    var v = (f.value || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
      return UKAUTHX.fail(root, 'Enter the email on your account so we know where to send it.', 'remail');
    }
    UKAUTHX.busy(e.target.querySelector('#ukResetGo'), 'Sending\u2026');
    UKAUTHX.sendReset(v, function (to) { sentTo = to; mode = 'sent'; paint(); });
  });

  root.addEventListener('click', function (e) {
    var g = e.target.closest('[data-google]');
    if (g) { return UKAUTHX.onGoogle(g, 'creator', '/creator/'); }
    if (e.target.closest('[data-reset]')) { mode = 'reset'; paint(); return; }
    var m = e.target.closest('[data-mode]');
    if (m) { mode = m.dataset.mode; paint(); pw = root.querySelector('[name=password]'); root.querySelector('[name=email]').focus(); return; }
    var r = e.target.closest('[data-reveal]');
    if (r) {
      pw = root.querySelector('[name=password]');
      var hid = pw.type === 'password';
      pw.type = hid ? 'text' : 'password';
      r.setAttribute('aria-pressed', hid ? 'true' : 'false');
      r.setAttribute('aria-label', hid ? 'Hide password' : 'Show password');
    }
  });
  function bind() {
    var form = root.querySelector('#ukForm');
    if (!form || form.dataset.bound) return;
    form.dataset.bound = '1';
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var isNew = mode === 'new';
      if (!UKAUTHX.validate(root, { isNew: isNew, prop: false && isNew })) return;
      // Tell the shared door which side this device last used, so /signin/ can skip the picker.
      try { localStorage.setItem('uk_side', 'creator'); } catch (err) {}
      UKAUTHX.go(isNew ? '/creator/start/' : '/creator/', root.querySelector('#ukSubmit'),
        isNew ? 'Setting you up\u2026' : 'Signing you in\u2026');
    });
    form.addEventListener('input', function () { UKAUTHX.clear(root); });
  }
  bind();
  paint();
})();
