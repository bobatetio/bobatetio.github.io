/* Ukreate — shared auth states.
   One module for validation, errors, the busy state and password reset, used by the
   hotel door, the creator door and the shared door. The three screens had drifted
   apart because each was written in its own pass; anything stateful now lives here
   so they cannot drift again.

   PLUG-IN POINT — credential checking.
   This is also what makes the side question go away. /signin/ currently routes on
   what the device last used, which is a proxy, not the account: someone can type
   creator credentials on a device that last logged in as a hotel. Once the endpoint
   resolves a role from the credentials, delete the picker in uksignin.js and route
   on the role the response returns.
   Nothing here talks to a server. validate() only checks that the form is fillable;
   it cannot tell you whether the password is right, because there is no user store
   (see the auth audit in BUILD_LOG.md). When a real auth endpoint exists, call it
   from the submit handler and pass its failure message to UKAUTHX.fail(). The error
   surface, the busy state and the focus handling are already built for that.

   PLUG-IN POINT — password reset.
   sendReset() shows the confirmation a real flow would show, but sends no mail.
   Replace its body with the reset-token request; the panel and its states stay. */
window.UKAUTHX = (function () {
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) {
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; }); };

  /* ---- inline error, announced and tied to the field it belongs to ---- */
  function fail(root, msg, fieldName) {
    var form = root.querySelector('#ukForm');
    var box = root.querySelector('#ukErr');
    if (!box) {
      box = document.createElement('p');
      box.id = 'ukErr';
      box.className = 'ukAuth_err';
      box.setAttribute('role', 'alert');
      form.insertBefore(box, form.firstChild);
    }
    box.textContent = msg;
    clearMarks(root);
    if (fieldName === 'terms') {
      var wrap = root.querySelector('.ukTerms');
      if (wrap) wrap.classList.add('is-bad');
      var cb = root.querySelector('[name=terms]');
      if (cb) { cb.setAttribute('aria-describedby', 'ukErr'); cb.focus(); }
      return false;
    }
    if (fieldName) {
      var f = root.querySelector('[name=' + fieldName + ']');
      if (f) {
        f.classList.add('is-bad');
        f.setAttribute('aria-invalid', 'true');
        f.setAttribute('aria-describedby', 'ukErr');
        f.focus();
      }
    }
    return false;
  }
  function clearMarks(root) {
    var t = root.querySelector('.ukTerms'); if (t) t.classList.remove('is-bad');
    root.querySelectorAll('.ukField_i').forEach(function (f) {
      f.classList.remove('is-bad');
      f.removeAttribute('aria-invalid');
      f.removeAttribute('aria-describedby');
    });
  }
  function clear(root) {
    var box = root.querySelector('#ukErr');
    if (box) box.remove();
    clearMarks(root);
  }

  /* ---- validation. Written out rather than left to the browser so the wording is
     ours and the same on every screen. ---- */
  function validate(root, opts) {
    opts = opts || {};
    clear(root);
    if (opts.names) {
      var fn = root.querySelector('[name=first]'), ln = root.querySelector('[name=last]');
      if (fn && !(fn.value || '').trim()) return fail(root, 'Tell us your first name.', 'first');
      if (ln && !(ln.value || '').trim()) return fail(root, 'And your last name.', 'last');
    }
    var email = root.querySelector('[name=email]');
    var pw = root.querySelector('[name=password]');
    var v = (email.value || '').trim();
    if (!v) return fail(root, 'Enter the email on your account.', 'email');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v))
      return fail(root, 'That email address does not look right. Check it and try again.', 'email');
    if (opts.prop) {
      var prop = root.querySelector('[name=prop]');
      if (prop && !(prop.value || '').trim())
        return fail(root, 'Tell us what the property is called. You can change it later.', 'prop');
    }
    if (!pw.value) return fail(root, 'Enter your password.', 'password');
    if (opts.isNew && pw.value.length < 8)
      return fail(root, 'Pick a password with at least 8 characters.', 'password');
    if (opts.phone) {
      var ph = root.querySelector('[name=phone]');
      if (ph) {
        var digits = (ph.value || '').replace(/[^\d]/g, '');
        if (!digits) return fail(root, 'Add a phone number so a hotel can reach you.', 'phone');
        if (digits.length < 7) return fail(root, 'That phone number looks too short. Check it and try again.', 'phone');
      }
    }
    if (opts.site) {
      var site = root.querySelector('[name=site]');
      if (site) {
        var v2 = (site.value || '').trim();
        if (!v2) return fail(root, 'Add the website for the property.', 'site');
        /* accepts yourproperty.com as readily as https://yourproperty.com: asking a
           hotel to type a scheme is asking them to fail the form */
        if (!/^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(v2))
          return fail(root, 'That website does not look right. Check it and try again.', 'site');
      }
    }
    if (opts.terms) {
      var tc = root.querySelector('[name=terms]');
      if (tc && !tc.checked)
        return fail(root, 'Please accept the Terms of Service and Privacy Policy to carry on.', 'terms');
    }
    return true;
  }

  /* ---- busy state: the button says what is happening and stops repeat submits ---- */
  function busy(btn, label) {
    if (!btn) return;
    btn.dataset.idle = btn.textContent;
    btn.textContent = label;
    btn.disabled = true;
    btn.setAttribute('aria-busy', 'true');
    btn.classList.add('is-busy');
  }
  function idle(btn) {
    if (!btn || !btn.dataset.idle) return;
    btn.textContent = btn.dataset.idle;
    btn.disabled = false;
    btn.removeAttribute('aria-busy');
    btn.classList.remove('is-busy');
  }

  /* Hand off after a beat so the busy state is actually seen. Real auth replaces the
     timeout with the request itself. */
  function go(href, btn, label) {
    busy(btn, label);
    setTimeout(function () { window.location.href = href; }, 480);
  }

  /* ---- password reset, as a real state rather than a dead link ---- */
  /* ukAuth_h / ukAuth_sub, not the onboarding pair: this panel replaces the login
     card, so its heading and lede have to be the same size and alignment as the one
     it replaced rather than jumping to the larger onboarding scale. */
  function resetPanel(o) {
    return '<h1 class="ukAuth_h">' + esc(o.title) + '</h1>' +
      '<p class="ukAuth_sub">' + esc(o.lede) + '</p>' +
      '<form id="ukResetForm" novalidate>' +
        /* The lede above already says what to type, so the label is redundant on
           screen. It stays in the DOM for screen readers rather than being deleted,
           which would leave the field unnamed. */
        '<label class="ukField"><span class="ukField_l ukSrOnly">Email</span>' +
        '<input class="ukField_i" name="remail" type="email" autocomplete="email" ' +
        'placeholder="' + esc(o.ph) + '" required></label>' +
        '<button class="ukBtn ukStart_go" type="submit" id="ukResetGo">Send the reset link</button>' +
      '</form>';
  }

  /* The way back out of the reset panel lives in the header, where it takes the slot
     the create-an-account link normally holds. One back affordance, in the one place
     every screen keeps its secondary link. */
  function backLink(label) {
    return '<button class="ukAuth_link ukAuth_linkBtn" type="button" data-mode="old">' +
      esc(label) + '</button>';
  }
  function resetSent(email) {
    return '<div class="ukAuth_sent">' +
      '<span class="ukAuth_sentIco" aria-hidden="true">&#10003;</span>' +
      '<h1 class="ukAuth_h">Check your inbox.</h1>' +
      '<p class="ukAuth_sub">If there is an account on <strong>' + esc(email) + '</strong> ' +
      'a reset link is on its way. It expires in an hour.</p>' +
      '<p class="ukHint">Nothing arrived? Look in spam, then try again in a minute.</p>' +
    '</div>';
  }
  /* PLUG-IN POINT — replace with the real reset-token request. */
  function sendReset(email, done) { setTimeout(function () { done(email); }, 520); }

  /* ---- Google sign-in ----
     PLUG-IN POINT — OAuth.
     googleBtn() renders the real control; onGoogle() currently just hands off the
     same way the password form does, because there is no OAuth client. Replace
     onGoogle()'s body with the Google Identity flow and route on the role the token
     resolves to. The markup, the busy state and the divider stay as they are. */
  /* `where` is 'above' when the button sits before the form and 'below' when it sits
     after it. Either way the divider goes between the two, so it always separates
     the one-tap route from the typed one rather than floating above everything. */
  function googleBtn(label, where) {
    var btn = '<button class="ukGoogle" type="button" data-google>' +
      '<img src="/assets/img/brand/google-g.svg" alt="" width="18" height="18" aria-hidden="true">' +
      '<span>' + esc(label) + '</span></button>';
    var or = '<div class="ukOr"><span>or</span></div>';
    return where === 'above' ? btn + or : or + btn;
  }
  function onGoogle(btn, side, dest) {
    busy(btn, 'Opening Google\u2026');
    try { localStorage.setItem('uk_side', side); } catch (e) {}
    setTimeout(function () { window.location.href = dest; }, 480);
  }

  return { fail:fail, clear:clear, validate:validate, busy:busy, idle:idle, go:go, backLink:backLink,
           googleBtn:googleBtn, onGoogle:onGoogle,
           resetPanel:resetPanel, resetSent:resetSent, sendReset:sendReset, esc:esc };
})();
