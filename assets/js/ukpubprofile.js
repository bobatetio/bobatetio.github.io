/* Ukreate — the public creator profile.

   This is the app's profile, not a marketing version of it. The model builder
   below is the adapter from ukcreators.js creatorProfile() with the same field
   mapping, and it hands off to window.UKPROFILE.render in 'hotel' mode, which
   is the same renderer the signed-in hotel sees: same four tabs, same section
   order, same components, rates included.

   One thing changes. actionsHtml, which in the app is Hire / save / tracked
   link, becomes a signup prompt. A visitor sees everything and can act on
   nothing, and the wall sits on the action rather than on the view. */
(function () {
  var D = window.UK;
  var mount = document.querySelector('[data-pub-profile]');
  if (!D || !mount || !window.UKPROFILE) return;

  var id = mount.getAttribute('data-pub-profile') ||
           new URLSearchParams(location.search).get('id');
  var c = id && D.creator ? D.creator(id) : null;
  if (!c) { mount.innerHTML = '<p class="ukPub_empty">That creator is no longer listed.</p>'; return; }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (x) {
      return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[x]; });
  }

  /* the app's own state shape; only the three keys the renderer reads */
  var st = { profTab: 'overview', profChan: null, map: null, creator: c.id };
  (function () {
    var t = new URLSearchParams(location.search).get('tab');
    if (t) st.profTab = t;
  })();

  /* ---- model: ukcreators.js creatorProfile(), field for field ---- */
  function model() {
    var work = (D.assets || []).slice(0, 6);
    return {
      id: c.id, n: c.n, h: c.h, img: c.img, city: c.loc, niche: c.type,
      plats: c.plats || [],
      f: c.f, type: c.type, cats: c.cats || [], markets: c.markets || [],
      free: c.free, makes: c.makes || [],
      verified: c.vetted, academyCert: c.academyCert, academyModules: c.academyModules || [],
      collabTypes: c.collabTypes || [], rates: c.rates || {},
      stats: { eng: c.eng, reach: c.reach, stays: c.stays, ontime: c.ontime,
               rating: c.rating, age: c.age, gender: c.gender, tops: c.tops },
      langs: c.langs,
      langsList: String(c.langs || '').split(',').map(function (x) { return x.trim(); }).filter(Boolean),
      reliability: { ontime: c.ontime, resp: c.resp, turn: c.turn },
      resp: c.resp, proof: c.proof,
      been: (c.been || []).map(function (b) {
        var mk = (c.markets || []).filter(function (x) { return x.n === b.n; })[0];
        return { n: b.n, lat: b.lat, lng: b.lng, cc: mk ? mk.cc : null };
      }),
      worked: c.worked || [],
      work: work.map(function (a) { return { t: a.t, plays: null, saves: null, img: a.img, video: a.k === 'video' }; }),
      topStays: [], partnerWork: [], itinerary: null,
      audienceCountries: String(c.tops || '').split(',').map(function (n, i) {
        return { n: n.trim(), pct: [46, 27, 15, 8, 4][i] || 2 };
      }).filter(function (r) { return r.n; }),
      reachTrend: (D.trend || []).map(function (t, i) {
        return { k: t.m, v: Math.round((c.f / 1000) * (0.7 + i * 0.06)) };
      }),
      bestWork: [], formatAvg: [], savesPer1000: null, bookingsByChannel: [],
      places: (c.been || []).map(function (b) {
        var mk = (c.markets || []).filter(function (x) { return x.n === b.n; })[0];
        return { city: b.n, lat: b.lat, lng: b.lng, id: c.id + '-' + b.n, cc: mk ? mk.cc : null };
      }),
      trackedHtml: '',
      savedInspiration: c.savedInspiration || []
    };
  }

  /* ---- the gate: operator voice, and clear about what an account is for ---- */
  var actionsHtml =
    '<a class="ukStatusBadge_b is-go" href="/join/?side=hotel&amp;creator=' + esc(c.id) + '">Hire this creator</a>' +
    '<a class="ukStatusBadge_b ukStatusBadge_b--ic" href="/join/?side=hotel" ' +
      'title="Save this creator" aria-label="Save ' + esc(c.n) + '">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M19 21l-7-4.5L5 21V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg></a>';

  /* The header's tracked link and discount code belong to a live collaboration.
     A signed-out visitor has none, so the panel would be showing a link to a
     booking that does not exist. render() derives noTrack from the mode rather
     than taking it as an option, so the panel is lifted back out here. */
  function stripTracked(html) {
    var i = html.indexOf('<div class="ukTrackMini">');
    if (i < 0) return html;
    var d = 1, k = i + 25;
    while (d > 0 && k < html.length) {
      var o = html.indexOf('<div', k), c = html.indexOf('</div>', k);
      if (c < 0) break;
      if (o >= 0 && o < c) { d++; k = o + 4; } else { d--; k = c + 6; }
    }
    return html.slice(0, i) + html.slice(k);
  }

  function paint() {
    mount.innerHTML =
      stripTracked(window.UKPROFILE.render(model(), st, { mode: 'hotel', actionsHtml: actionsHtml })) +
      '<aside class="ukPubGate">' +
        '<p class="ukPubGate_t">Everything above is open. Inviting ' + esc(String(c.n).split(' ')[0]) + ' is the part that needs an account.</p>' +
        '<p class="ukPubGate_p">Set up your property and you can send the invitation, agree the nights and deliverables, ' +
        'and keep what comes back. It takes a few minutes and nothing publishes until you say so.</p>' +
        '<a class="btn btn--gold" href="/join/?side=hotel&amp;creator=' + esc(c.id) + '">' +
        '<strong class="btnRoll"><span data-hover="Set up your property"><em>Set up your property</em></span></strong></a>' +
      '</aside>';
  }

  /* the renderer's tab bar posts back through data-prof-tab, same as in the app */
  mount.addEventListener('click', function (e) {
    var t = e.target.closest('[data-proftab]');
    if (t) {
      e.preventDefault();
      st.profTab = t.getAttribute('data-proftab');
      paint();
      var p = new URLSearchParams(location.search);
      p.set('tab', st.profTab);
      history.replaceState(null, '', '?' + p.toString());
    }
  });

  paint();
})();
