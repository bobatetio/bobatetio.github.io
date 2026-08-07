/* Ukreate — connecting where a creator posts. One implementation, two homes.

   This was written for the creator onboarding page (ukcstart.js) and it is the
   only real version of this interaction in the product: two buckets with a main
   profile and the rest, drag to change which is main, and an OAuth stand-in that
   redirects, asks for consent, sometimes fails, and can be retried.

   When onboarding moved inside the app it was NOT carried across — a pill asking
   the creator to estimate their own audience went in instead. That is a worse
   answer to a question this already answers properly: a connected platform gives
   the real follower count, the real handle, and the band falls out of it rather
   than being guessed.

   So it lives here now and both sides call it. The state object is passed in
   rather than owned, because the onboarding page keeps its answers in `f` and the
   in-app gate keeps them in localStorage, and neither should have to adopt the
   other's storage to reuse a component.

   // PLUG-IN POINT — real OAuth. Everything below the redirect beat is where a
   // real provider's authorize URL and callback would take over; resolve() is
   // what a real callback ultimately calls with. */
window.UKPLATCONNECT = (function () {
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' })[c];
    });
  }
  function platforms() {
    return ((window.UKVOCAB || {}).PLATFORMS || []);
  }
  function platOf(k) {
    return platforms().filter(function (p) { return p.k === k; })[0] || { k:k, n:k };
  }
  function fmt(n) {
    return n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace('.0', '') + 'K' : String(n);
  }

  /* What a real callback would hand back. Seeded per platform so a creator's
     numbers are the same every time they connect the same account. */
  function resolve(k, name, done) {
    var seed = { ig:12400, tt:8600, yt:3100, fb:4200, sc:2600, x:1900, li:1400, pi:5200 };
    setTimeout(function () {
      done({
        handle: (String(name || '').trim().split(' ')[0] || 'you').toLowerCase().replace(/[^a-z]/g, ''),
        f: seed[k] || 2000
      });
    }, 620);
  }

  function platMark(p) {
    return p.s
      ? '<img class="ukPlatMark" src="' + p.s + '" alt="" width="20" height="20">'
      : '<span class="ukPlatMark ukPlatMark--none" aria-hidden="true"></span>';
  }

  /* No "Make main" button: the row already says how, and repeating it as a
     control on every secondary row was what forced two lines. */
  function platRow(row, i, isMain) {
    var p = platOf(row.k);
    return '<div class="ukPlatRow' + (isMain ? ' is-main' : '') + '" draggable="true" ' +
      'data-plat="' + i + '" role="listitem">' +
      '<span class="ukGrip" aria-hidden="true"></span>' +
      platMark(p) +
      '<span class="ukPlatRow_b">' +
        '<span class="ukPlatRow_n">' + esc(p.n) + '</span>' +
        '<span class="ukPlatRow_h">@' + esc(row.handle) + '</span>' +
      '</span>' +
      '<span class="ukPlatRow_f">' + fmt(row.f) + '</span>' +
      '<button class="ukPlatRow_x" type="button" data-unplat="' + i + '" ' +
        'aria-label="Disconnect ' + esc(p.n) + '">&times;</button></div>';
  }

  /* ---- what connecting actually feels like ----
     A platform going from "not connected" to "connected" the instant you tap it
     reads as a switch being flipped, not an account being reached. Real OAuth
     leaves the page, asks a real question, and sometimes just fails — so this is
     a short version of all three. */
  function oauthModal(oauth) {
    if (!oauth) return '';
    var p = platOf(oauth.k), stage = oauth.stage, body;
    if (stage === 'redirect') {
      body = '<div class="ukOAuth_mid"><span class="ukOAuth_spin" aria-hidden="true"></span>' +
        '<p class="ukOAuth_t">Taking you to ' + esc(p.n) + '…</p></div>';
    } else if (stage === 'consent') {
      body = '<div class="ukOAuth_who">' + platMark(p) + '<span>' + esc(p.n) + '</span></div>' +
        '<h2 class="ukOAuth_h">Let Ukreate connect your ' + esc(p.n) + '?</h2>' +
        '<ul class="ukOAuth_list">' +
          '<li>See your public profile and handle</li>' +
          '<li>See your posts, to show your recent work</li>' +
          '<li>Nothing is posted on your behalf</li>' +
        '</ul>' +
        '<div class="ukOAuth_row">' +
          '<button class="ukGhost" type="button" data-oauth-cancel>Cancel</button>' +
          '<button class="ukBtn" type="button" data-oauth-allow>Allow</button>' +
        '</div>';
    } else if (stage === 'connecting') {
      body = '<div class="ukOAuth_mid"><span class="ukOAuth_spin" aria-hidden="true"></span>' +
        '<p class="ukOAuth_t">Connecting your ' + esc(p.n) + '…</p></div>';
    } else {
      body = '<div class="ukOAuth_who ukOAuth_who--err">' + platMark(p) +
          '<span>' + esc(p.n) + '</span></div>' +
        '<h2 class="ukOAuth_h">Couldn’t connect your ' + esc(p.n) + '.</h2>' +
        '<p class="ukOAuth_p">That happens sometimes. The connection dropped before it ' +
          'finished, so nothing was added.</p>' +
        '<div class="ukOAuth_row">' +
          '<button class="ukGhost" type="button" data-oauth-cancel>Cancel</button>' +
          '<button class="ukBtn" type="button" data-oauth-retry>Try again</button>' +
        '</div>';
    }
    return '<div class="ukOAuth_scrim" data-oauth-scrim role="presentation">' +
      '<div class="ukOAuth_card" role="dialog" aria-modal="true" ' +
        'aria-label="Connect ' + esc(p.n) + '">' + body + '</div></div>';
  }

  /* The step body. `st` carries { plats:[], oauth:null } and belongs to the
     caller — this only reads and renders it. */
  function body(st) {
    var plats = st.plats || [];
    var left = platforms().filter(function (p) {
      return !plats.some(function (r) { return r.k === p.k; });
    });
    return (plats.length
      /* Two buckets, but only once there is something in them: an empty pair of
         trays is a question nobody asked. */
      ? '<div class="ukBuckets">' +
          '<div class="ukBucket ukBucket--main" data-bucket="main" aria-label="Main profile">' +
            '<p class="ukBucket_l">Main</p>' + platRow(plats[0], 0, true) +
          '</div>' +
          '<div class="ukBucket ukBucket--sec" data-bucket="sec" aria-label="Other platforms">' +
            '<p class="ukBucket_l">Also on</p>' +
            (plats.length > 1
              ? plats.slice(1).map(function (r, i) { return platRow(r, i + 1, false); }).join('')
              : '<p class="ukBucket_e">Connect another and drag it here, or drag this one down.</p>') +
          '</div>' +
        '</div>' +
        (plats.length > 1
          ? '<p class="ukHint ukHint--drag">Drag any of these to swap which one is main.</p>'
          : '')
      : '') +
      /* tapping one opens the connect dialog — there is no adder panel and no
         second step */
      (left.length
        ? '<div class="ukChoice ukChoice--plats">' + left.map(function (p) {
            var busy = !!st.oauth && st.oauth.k === p.k;
            return '<button class="ukPick ukPick--plat' + (busy ? ' is-busy' : '') + '" type="button" ' +
              'data-doconnect="' + p.k + '"' + (st.oauth ? ' disabled' : '') + '>' +
              platMark(p) + esc(p.n) + '</button>';
          }).join('') + '</div>'
        : '') +
      (plats.length
        ? '<p class="ukHint">' + fmt(total(st)) + ' across ' + plats.length +
          (plats.length === 1 ? ' platform' : ' platforms') + '.</p>'
        : '') +
      oauthModal(st.oauth);
  }

  function total(st) {
    return (st.plats || []).reduce(function (a, p) { return a + (p.f || 0); }, 0);
  }
  /* The band is not a question when the platforms are connected — it falls out
     of the number, using the same four bands the matcher scores against. */
  function bandFor(n) {
    if (n >= 100000) return '100K+';
    if (n >= 25000) return '25K - 100K';
    if (n >= 5000) return '5K - 25K';
    return 'Under 5K';
  }

  /* ---- the interaction, driven by the caller's repaint ---- */
  function start(st, k, repaint) {
    if (st.oauth) return;
    st.oauth = { k: k, stage: 'redirect' };
    repaint();
    setTimeout(function () {
      if (!st.oauth || st.oauth.k !== k) return;      /* cancelled while redirecting */
      st.oauth.stage = 'consent';
      repaint();
    }, 640);
  }
  function allow(st, name, repaint) {
    if (!st.oauth) return;
    var k = st.oauth.k;
    st.oauth.stage = 'connecting';
    repaint();
    setTimeout(function () {
      if (!st.oauth || st.oauth.k !== k) return;
      /* real connects fail sometimes — a network blip, a provider timeout, a
         consent that does not come back clean. One in five is enough to be a
         real possibility without every third connect breaking. */
      if (Math.random() < 0.2) { st.oauth.stage = 'error'; return repaint(); }
      resolve(k, name, function (res) {
        st.plats = (st.plats || []).concat([{ k:k, handle:res.handle, f:res.f }]);
        st.oauth = null;
        repaint();
      });
    }, 780);
  }
  function cancel(st, repaint) { st.oauth = null; repaint(); }
  function drop(st, i) {
    var plats = st.plats || [];
    if (i < 0 || i >= plats.length) return;
    plats.splice(i, 1);
  }
  function makeMain(st, i) {
    var plats = st.plats || [];
    if (i <= 0 || i >= plats.length) return;
    plats.unshift(plats.splice(i, 1)[0]);
  }

  return {
    body: body, oauthModal: oauthModal, platRow: platRow, platMark: platMark,
    start: start, allow: allow, cancel: cancel, drop: drop, makeMain: makeMain,
    total: total, bandFor: bandFor, platforms: platforms, platOf: platOf, fmt: fmt
  };
})();
