/* Ukreate — sign up. One page, one motion: land, pick a side, fill the form.

   The choice and the form live on the same page. Picking a side reveals the form
   inline; picking the other side swaps it in place, keeping anything already typed
   that still applies. There is no navigation between choosing and filling.

   Role separation is unchanged: this page only decides which door to hand off to.
   Hotel submits to /app/, creator to /creator/, and onboarding happens there.

   It used to submit to /start/ and /creator/start/, the standalone onboarding
   pages. Those came before onboarding moved into the app, and nothing they write
   is read by the in-app gate, so a new account did five screens of questions on
   a page of their own, landed in the app, and got asked the same things again.

   The cards are real radio inputs behind labels, so keyboard support, arrow keys and
   screen-reader semantics are the platform's rather than something hand-rolled. */
(function () {
  var root = document.querySelector('[data-ukjoin]');
  if (!root) return;
  var X = window.UKAUTHX;

  /* Referral capture: there is no account yet to attach this to, so it
     waits in localStorage until membership actually starts (data-join, in
     ukcapp.js) — see assets/js/ukreferral.js for the other half. */
  (function captureRef() {
    try {
      var m = location.search.match(/[?&]ref=([^&]+)/);
      if (m) localStorage.setItem('uk_pending_ref', decodeURIComponent(m[1]));
    } catch (e) {}
  })();

  var SIDES = {
    creator: {
      label: 'Sign up as a creator',
      blurb: 'Get booked by hotels that want your work.',
      email: 'you@yourname.com',
      title: 'Create your creator account',
      lede: 'Two minutes, and you’ll see hotels you could pitch this week.',
      cta: 'Create my account',
      busy: 'Setting you up…',
      go: '/creator/'
    },
    hotel: {
      label: 'Sign up as a hotel',
      blurb: 'Fill unsold nights with content you own.',
      email: 'you@yourproperty.com',
      title: 'Create your hotel account',
      lede: 'Two minutes, then we show you the creators who already cover your city.',
      cta: 'Create account',
      busy: 'Creating your account…',
      go: '/app/'
    }
  };

  /* what has been typed, kept across a side switch */
  /* one field set for both sides, exactly as specified */
  var FIELDS = ['first', 'last', 'email', 'phone', 'site', 'password'];
  var f = { side: null, first: '', last: '', email: '', phone: '', site: '', password: '', terms: false };
  var stage = root.querySelector('#ukJoinForm');
  var NEUTRAL = (root.querySelector('.ukAuth_sub') || {}).textContent || '';

  function esc(s) { return X.esc(s); }

  function paint(focusIt) {
    var pick = root.querySelector('.ukAuth_pick');
    if (pick) pick.classList.toggle('is-picked', !!f.side);
    /* The strapline carries the chosen side's line once there is one, so the same
       sentence is never on screen twice. With nothing chosen it explains Ukreate. */
    var sub = root.querySelector('.ukAuth_sub');
    if (sub) sub.textContent = f.side ? SIDES[f.side].blurb : NEUTRAL;
    if (!f.side) { stage.innerHTML = ''; stage.hidden = true; return; }
    var s = SIDES[f.side];
    stage.hidden = false;
    stage.classList.add('is-on');
    stage.innerHTML =
      '<h2 class="ukSrOnly" id="ukJoinTitle" tabindex="-1">' + esc(s.title) + '</h2>' +
      /* the one-tap route comes first, with the divider under it, so anyone taking it
         never reads past a form they are not going to fill in */
      X.googleBtn('Sign up with Google', 'above') +
      '<form id="ukForm" novalidate>' +
        '<div class="ukJoin_two">' +
          '<label class="ukField"><span class="ukField_l">First name</span>' +
            '<input class="ukField_i" name="first" autocomplete="given-name" ' +
            'placeholder="enter your first name" value="' + esc(f.first) + '" required></label>' +
          '<label class="ukField"><span class="ukField_l">Last name</span>' +
            '<input class="ukField_i" name="last" autocomplete="family-name" ' +
            'placeholder="enter your last name" value="' + esc(f.last) + '" required></label>' +
        '</div>' +
        '<div class="ukJoin_two">' +
          '<label class="ukField"><span class="ukField_l">Email</span>' +
            '<input class="ukField_i" name="email" type="email" autocomplete="email" ' +
            'placeholder="' + esc(s.email) + '" value="' + esc(f.email) + '" required></label>' +
          '<label class="ukField"><span class="ukField_l">Phone number</span>' +
            '<input class="ukField_i" name="phone" type="tel" autocomplete="tel" ' +
            'placeholder="enter your phone number" value="' + esc(f.phone) + '" required></label>' +
        '</div>' +
        (f.side === 'hotel'
          ? '<label class="ukField"><span class="ukField_l">Business website</span>' +
            '<input class="ukField_i" name="site" type="url" inputmode="url" ' +
            'autocomplete="url" spellcheck="false" placeholder="yourproperty.com" ' +
            'value="' + esc(f.site) + '" required></label>'
          : '') +
        '<label class="ukField"><span class="ukField_l">Password</span>' +
          '<span class="ukAuth_pw"><input class="ukField_i" name="password" type="password" ' +
          'autocomplete="new-password" placeholder="at least 8 characters" ' +
          'value="' + esc(f.password) + '" required>' +
          '<button class="ukAuth_reveal" type="button" data-reveal aria-label="Show password" ' +
          'aria-pressed="false"><span data-icon="eye"></span></button></span></label>' +
        '<label class="ukTerms"><input type="checkbox" name="terms"' + (f.terms ? ' checked' : '') + '>' +
          '<span>I accept the <a class="ukAuth_link" href="/terms/">Terms of Service</a> and ' +
          '<a class="ukAuth_link" href="/privacy/">Privacy Policy</a>.</span></label>' +
        /* [REVIEW] exact wording is a legal call, not a design one — this is
           the plug-in point for the real ToS clause. Consent lives here now
           rather than as a per-piece toggle later: agreeing once at signup
           is what makes a creator's delivered work eligible for Discover,
           the same way the rest of these terms apply once, not per action. */
        (f.side === 'creator'
          ? '<p class="ukHint ukTerms_note">Work you deliver to a hotel may be featured in Discover, ' +
            'our creator inspiration feed — see the Terms for how that works.</p>'
          : '') +
        '<button class="ukBtn ukStart_go" type="submit" id="ukSubmit" disabled>' + esc(s.cta) + '</button>' +
      '</form>';
    icons();
    syncCta();
    if (focusIt) root.querySelector('#ukJoinTitle').focus();
  }

  function icons() {
    root.querySelectorAll('[data-icon]').forEach(function (el) {
      if (el.firstChild) return;
      el.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
        ((window.UKICONS || {})[el.dataset.icon] || '') + '</svg>';
      el.classList.add('ukIco', 'ukIco--on');
    });
  }

  /* selecting a card reveals the form; selecting the other one swaps it in place */
  root.addEventListener('change', function (e) {
    var r = e.target.closest('input[name=ukside]');
    if (!r) return;
    keep();
    f.side = r.value;
    X.clear(root);
    paint(true);
  });

  /* keep what is still relevant when the side changes */
  function keep() {
    var form = root.querySelector('#ukForm');
    if (!form) return;
    FIELDS.forEach(function (k) {
      var el = form.querySelector('[name=' + k + ']');
      if (el) f[k] = el.value;
    });
    var t = form.querySelector('[name=terms]');
    if (t) f.terms = t.checked;
  }

  /* Every required field filled, and the terms accepted. Format is still checked on
     submit; this only decides whether the button is awake. */
  function complete() {
    if (!f.side) return false;
    var need = ['first', 'last', 'email', 'phone', 'password'];
    if (f.side === 'hotel') need.push('site');
    for (var i = 0; i < need.length; i++) {
      if (!String(f[need[i]] || '').trim()) return false;
    }
    return !!f.terms;
  }
  function syncCta() {
    var btn = root.querySelector('#ukSubmit');
    if (btn && !btn.classList.contains('is-busy')) btn.disabled = !complete();
  }

  root.addEventListener('input', function (e) {
    if (e.target.closest('#ukForm')) { keep(); X.clear(root); syncCta(); }
  });
  root.addEventListener('change', function (e) {
    if (e.target.name === 'terms') { f.terms = e.target.checked; X.clear(root); syncCta(); }
  });

  root.addEventListener('click', function (e) {
    var g = e.target.closest('[data-google]');
    if (g) {
      if (!f.side) return X.fail(root, 'Pick a side first, then Google can take you there.');
      return X.onGoogle(g, f.side, SIDES[f.side].go);
    }
    var r = e.target.closest('[data-reveal]');
    if (!r) return;
    var pw = root.querySelector('[name=password]');
    var hid = pw.type === 'password';
    pw.type = hid ? 'text' : 'password';
    r.setAttribute('aria-pressed', hid ? 'true' : 'false');
    r.setAttribute('aria-label', hid ? 'Hide password' : 'Show password');
  });

  root.addEventListener('submit', function (e) {
    if (e.target.id !== 'ukForm') return;
    e.preventDefault();
    var s = SIDES[f.side];
    keep();
    if (!X.validate(root, { isNew: true, names: true, phone: true, terms: true,
                            site: f.side === 'hotel' })) return;
    /* tell the shared login door which side this device used, and hand the name on
       to onboarding — it was asked for here, so asking again on the next screen
       reads as us having forgotten it
       // PLUG-IN POINT — session. A real backend returns the signed-up account and
       // onboarding reads it from there; this stands in until it does. */
    try {
      localStorage.setItem('uk_side', f.side);
      localStorage.setItem('uk_name', (f.first + ' ' + f.last).trim());
      /* the app opens its onboarding gate on the strength of this */
      if (window.UKONBOARD) window.UKONBOARD.markFresh();
      else localStorage.setItem('uk_fresh_v1', '1');
    } catch (err) {}
    X.go(s.go, root.querySelector('#ukSubmit'), s.busy);
  });

  /* deep links keep working: /join/?side=creator opens straight into that form */
  var pre = (location.search.match(/[?&]side=(creator|hotel)/) || [])[1];
  if (pre) {
    var input = root.querySelector('input[name=ukside][value=' + pre + ']');
    if (input) { input.checked = true; f.side = pre; }
  }
  paint(false);
  icons();
})();
