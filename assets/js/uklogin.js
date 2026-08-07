/* Ukreate — hotel sign-in and account creation.
   Hotel-only: there is no role fork. Creators sign up from the creator site.
   New accounts route into onboarding (/start/), existing ones into the app. */
(function () {
  var root = document.querySelector('[data-uklogin]');
  if (!root) return;

  // icons
  root.querySelectorAll('[data-icon]').forEach(function (el) {
    el.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      ((window.UKICONS || {})[el.dataset.icon] || '') + '</svg>';
    el.classList.add('ukIco', 'ukIco--on');
  });

  if (/[?&]out=1/.test(location.search)) root.querySelector('#ukOut').hidden = false;

  // The front door (/join/) sends hotels here with ?new=1 so they land on sign-up, not sign-in.
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
        : UKAUTHX.resetPanel({ title:'Reset your password.', lede:'Tell us the email on the account and we will send a link to set a new one.', ph:'you@yourproperty.com' });
      return;
    }
    if (!root.querySelector('#ukForm')) { ask.innerHTML = askHTML; bind(); }
    var isNew = mode === 'new';
    // Always name the side out loud, so nobody signs up on the wrong half of the product.
    root.querySelector('#ukSide').textContent = isNew
      ? 'Creating a hotel account' : 'For hotels and travel brands';
    root.querySelector('#ukTitle').textContent = isNew ? 'Get your property in.' : 'Welcome back.';
    root.querySelector('#ukLede').textContent = isNew
      ? 'Two minutes to an account, then we show you the creators who already cover your city.'
      : 'Pick up where you left off with your hosted stays and the content waiting for you.';
    root.querySelector('#ukSubmit').textContent = isNew ? 'Create account' : 'Sign in';
    root.querySelector('#ukPwLabel').textContent = isNew ? 'Choose a password' : 'Password';
    pw.setAttribute('autocomplete', isNew ? 'new-password' : 'current-password');
    pw.setAttribute('placeholder', isNew ? 'at least 8 characters' : 'enter your password');
    root.querySelectorAll('.ukNewOnly').forEach(function (n) { n.hidden = !isNew; });
    root.querySelectorAll('.ukOldOnly').forEach(function (n) { n.hidden = isNew; });
    var gWrap = root.querySelector('#ukGoogleWrap');
    if (gWrap && !gWrap.firstChild) gWrap.innerHTML = UKAUTHX.googleBtn('Log in with Google', 'above');
    root.querySelector('#ukSwap').innerHTML = 'New to Ukreate? <a class="ukAuth_link" href="/join/">Create an account</a>';
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
    if (g) { return UKAUTHX.onGoogle(g, 'hotel', '/app/'); }
    if (e.target.closest('[data-reset]')) { mode = 'reset'; paint(); return; }
    var m = e.target.closest('[data-mode]');
    if (m) { mode = m.dataset.mode; paint(); pw = root.querySelector('[name=password]'); root.querySelector('[name=email]').focus(); return; }
    var r = e.target.closest('[data-reveal]');
    if (r) {
      pw = root.querySelector('[name=password]');
      var hidden = pw.type === 'password';
      pw.type = hidden ? 'text' : 'password';
      r.setAttribute('aria-pressed', hidden ? 'true' : 'false');
      r.setAttribute('aria-label', hidden ? 'Hide password' : 'Show password');
    }
  });

  function bind() {
    var form = root.querySelector('#ukForm');
    if (!form || form.dataset.bound) return;
    form.dataset.bound = '1';
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var isNew = mode === 'new';
      if (!UKAUTHX.validate(root, { isNew: isNew, prop: true && isNew })) return;
      // Tell the shared door which side this device last used, so /signin/ can skip the picker.
      try { localStorage.setItem('uk_side', 'hotel'); } catch (err) {}
      UKAUTHX.go(isNew ? '/start/' : '/app/', root.querySelector('#ukSubmit'),
        isNew ? 'Creating your account\u2026' : 'Signing you in\u2026');
    });
    form.addEventListener('input', function () { UKAUTHX.clear(root); });
  }
  bind();

  paint();
})();
