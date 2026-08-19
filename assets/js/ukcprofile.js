/* Ukreate — creator profile, creator side.

   This used to be its own ~20-section scroll, a different design of the
   same page the hotel side already rendered as four clean tabs. It is now
   a thin adapter: build a normalised model off D.me and hand it to
   window.UKPROFILE.render (ukprofile.js), the same function ukcreators.js
   calls on the hotel side. What used to drift between two hand-built pages
   can only drift now if the SHARED renderer itself is wrong — see
   ukprofile.js for the actual layout and the section-merge notes.

   "This is exactly what a hotel sees" — the framing that motivated this
   restructure — is now literally true. A "Preview as a hotel" toggle
   renders the exact hotel-mode output, editing affordances stripped.

   Framing matters on this side: this whole surface is the pride wall. Empty
   sections invite, they never scold, and nothing is ever labelled incomplete. */
(function () {
  var D = window.UKC, V = window.UKCV;
  if (!D || !V) return;
  var head = V.head;

  /* ================= build the model ================= */
  function media(key) { var mm = D.media(key); return { img: (mm || {}).src || '', video: (mm || {}).kind === 'video' }; }

  function bestWork() {
    return (D.me.work || []).slice().sort(function (x, y) { return (y.plays || 0) - (x.plays || 0); }).map(function (w) {
      var mm = media(w.m);
      return { t: w.t, plays: w.plays, saves: w.saves, img: mm.img };
    });
  }
  function formatAvg() {
    var by = {};
    (D.me.work || []).forEach(function (x) {
      var k = x.fmt; if (!k) return;
      by[k] = by[k] || { plays: 0, n: 0 };
      by[k].plays += (x.plays || 0); by[k].n += 1;
    });
    return Object.keys(by).map(function (k) {
      return { k: k, v: Math.round(by[k].plays / by[k].n) };
    }).sort(function (a, b) { return b.v - a.v; });
  }
  /* Same ranked-cities read placesStats() used to do inline: which cities
     have had a real shoot (collab stage >= 3) vs. only a pitch sent. */
  function places() {
    var seen = {}, list = [];
    function add(city, lat, lng, made, id) {
      if (!city) return;
      var k = String(city);
      if (!seen[k]) { seen[k] = { city: k, made: 0, pitched: 0, lat: lat, lng: lng, id: id || k,
        cc: window.ukCCOf ? window.ukCCOf(city) : null }; list.push(seen[k]); }
      if (typeof lat === 'number' && typeof seen[k].lat !== 'number') { seen[k].lat = lat; seen[k].lng = lng; }
      seen[k][made ? 'made' : 'pitched'] += 1;
    }
    (D.collabs || []).forEach(function (c) {
      var s = D.stay(c.stay);
      if (s && c.stage >= 3) add(s.city, s.lat, s.lng, true, s.id);
    });
    (D.pitches || []).forEach(function (p) {
      var s = (D.stays || []).filter(function (x) { return x.hotel === p.hotel; })[0];
      add(p.city, s && s.lat, s && s.lng, false, s && s.id);
    });
    list.sort(function (a, b) { return (b.made - a.made) || (b.pitched - a.pitched); });
    return list;
  }
  var SHARES = [46, 27, 15, 8, 4];
  function audienceCountries() {
    var names = String(D.me.tops || window.UKME.tops || '').split(',').map(function (x) { return x.trim(); }).filter(Boolean);
    return names.map(function (n, i) { return { n: n, pct: SHARES[i] || 2 }; });
  }

  function buildModel() {
    var me = D.me;
    /* Reliability/rating/reach numbers were never pulled from window.UKME
       into D.me on this side (only rates/collabTypes/age/gender/tops were)
       — the profile page itself never showed them before, computing its
       own separate "By the numbers" instead. The Overview KPI strip is now
       shared with the hotel side and needs the SAME four numbers a hotel
       sees, so those come straight off window.UKME, the one literal both
       apps start from — never independently recomputed, so they cannot
       read differently on the two sides. */
    var M = window.UKME || {};
    var A = window.UKATTRIB;
    var att = A ? A.totals(A.forCreator(me.id || 'c1')) : null;
    var academyCert = me.academyCert || (D.academy && D.academy.length > 0 && D.academy.every(function (l) { return l.done; }));
    var bookings = A ? A.byKey('channel', A.forCreator(me.id || 'c1'))
      .filter(function (r) { return r.confirmed.count; })
      .map(function (r) { return { channelName: r.channelName, count: r.confirmed.count }; }) : [];
    var work = (me.work || []).filter(function (w) { return w.plays; });
    var plays = work.reduce(function (a, w) { return a + w.plays; }, 0);
    var saves = work.reduce(function (a, w) { return a + (w.saves || 0); }, 0);

    /* markets (creatorHead's "Covers" line, {n,cc} with a real flag) has no
       equivalent on this side — window.UKME only ever carried `been`
       ({n,lat,lng} for the map, no country code). [ASSUMPTION] the home
       base gets a real flag, resolved off `me.city` ("Lisbon, Portugal")
       via the same window.ukCCOf gazetteer the rest of the product uses;
       any further destinations in `been` are city names alone with no
       country to resolve, so they show without a flag rather than a
       guessed one. */
    var homeCC = window.ukCCOf ? window.ukCCOf(me.city) : null;
    var markets = [{ n: String(me.city || '').split(',')[0].trim(), cc: homeCC }]
      .concat((M.been || []).slice(1).map(function (b) { return { n: b.n, cc: null }; }));

    return {
      id: me.id, n: me.n, h: me.h, img: me.img, city: me.city, niche: me.niche,
      plats: me.plats || [],
      f: (window.UKME && window.UKME.total) ? window.UKME.total() : (me.plats || []).reduce(function (a, p) { return a + (p.f || 0); }, 0),
      type: M.type, cats: M.cats || [], markets: markets, free: M.free, makes: [],
      verified: me.verified, academyCert: academyCert, academyModules: me.academyModules || [],
      collabTypes: me.collabTypes || [], allCollabTypes: D.COLLAB_TYPES, rates: me.rates || {},
      stats: {
        eng: M.eng, reach: M.reach, stays: M.stays, ontime: M.ontime, rating: M.rating,
        age: me.age || M.age, gender: me.gender || M.gender, tops: me.tops || M.tops
      },
      langs: me.langs || M.langs,
      langsList: String(me.langs || M.langs || '').split(',').map(function (x) { return x.trim(); }).filter(Boolean),
      reliability: { ontime: M.ontime, resp: M.resp, turn: M.free ? '' : '' },
      resp: M.resp,
      proof: M.proof,
      been: (M.been || []).map(function (b, i) { return { n: b.n, lat: b.lat, lng: b.lng, cc: i === 0 ? homeCC : null }; }),
      worked: M.worked || [],
      work: (me.work || []).map(function (w) { var mm = media(w.m); return { t: w.t, plays: w.plays, saves: w.saves, img: mm.img, video: mm.video }; }),
      topStays: (me.topStays || []).map(function (s) { var mm = media(s.m); return { hotel: s.hotel, city: s.city, when: s.when, note: s.note, img: mm.img }; }),
      partnerWork: (me.partnerWork || []).map(function (w) { var mm = media(w.m); return { t: w.t, hotel: w.hotel, plays: w.plays, out: w.out, rights: w.rights, img: mm.img }; }),
      itinerary: me.itinerary ? (function (it) {
        var mm = media(it.m);
        return { t: it.t, city: it.city, days: it.days, blurb: it.blurb, img: mm.img,
          stops: it.stops.map(function (s) { var sm = media(s.m); return { d: s.d, t: s.t, note: s.note, img: sm.img }; }) };
      })(me.itinerary) : null,
      audienceCountries: audienceCountries(),
      reachTrend: [],
      bestWork: bestWork(),
      formatAvg: formatAvg(),
      savesPer1000: work.length ? Math.round(saves / (plays || 1) * 1000) : null,
      bookingsByChannel: bookings,
      places: places(),
      /* 2c — taste made visible: everything saved across every collection,
         flattened (collection membership is private organisation, not
         shown here). Read straight off ukdiscover.js's own store — same
         session, no need for the UKME round trip the hotel side needs to
         read this from a separate page. */
      savedInspiration: (D.dsCollections ? D.dsCollections() : []).reduce(function (a, c) {
        return a.concat(D.dsItemsIn(c.id));
      }, []).filter(function (id, i, arr) { return arr.indexOf(id) === i; })
        .map(D.discoverBy).filter(Boolean).map(function (it) {
          var mm = media(it.m);
          return { id: it.id, img: mm.img, video: mm.video, t: it.t, byN: it.by.n };
        })
    };
  }

  function profile(st) {
    st = st || {};
    var m = buildModel();
    var preview = !!st.profPreview;

    var actionsHtml =
      (D.me.member ? '' : '<button class="ukGhost" type="button" data-goto="member">Get verified</button>') +
      '<button class="ukGhost' + (preview ? ' is-on' : '') + '" type="button" data-profpreview="' + (preview ? '0' : '1') + '">' +
        (preview ? 'Back to editing' : 'Preview as a hotel') + '</button>';

    var previewBanner = preview
      ? '<div class="ukNoteBanner" role="status">This is exactly what a hotel sees when they open your profile. ' +
        '<button class="ukGhost ukGhost--sm" type="button" data-profpreview="0">Back to editing</button></div>'
      : '';

    return head('Your profile', 'This is what a hotel sees. Make yourself impossible to ignore.') +
      window.UKPROFILE.render(m, st, {
        mode: preview ? 'hotel' : 'owner',
        actionsHtml: preview ? '' : actionsHtml,
        previewBanner: previewBanner
      });
  }

  /* ---- inline editor for travel type / age / interests ----
     Rates and arrangements moved onto the Rates tab (ukprofile.js); this
     page still owns the parts of "how you travel" that are not about
     money — reached the same way it always was. */
  function editme(st) {
    var me = D.me;
    function row(label, list, sel, key, hint) {
      return '<p class="ukField_l">' + label + '</p>' +
        '<div class="ukChoice">' + list.map(function (t) {
          var on = Array.isArray(sel) ? sel.indexOf(t) > -1 : sel === t;
          return '<button class="ukPick' + (on ? ' is-on' : '') + '" type="button" ' +
            (Array.isArray(sel) ? 'aria-pressed="' + on + '" data-metog="' + key + '"' : 'data-meset="' + key + '"') +
            ' data-val="' + t + '">' + t + '</button>';
        }).join('') + '</div>' +
        '<p class="ukWhy">' + hint + '</p>';
    }
    return head('Make your profile irresistible',
                'None of this is required. Each one is another way a hotel can picture ' +
                'you at their property — and another filter you turn up in.') +
      '<section class="ukPanel">' +
        row('What kind of traveller are you?', D.TRAVEL_TYPES, me.types, 'types',
            'Pick as many as fit. This is the single field hotels filter on most, ' +
            'so it is the quickest win on this page.') +
        '<div style="height:20px"></div>' +
        row('Your age', D.AGE_BANDS, me.age, 'age',
            'A range, never an exact age.') +
        '<div style="height:20px"></div>' +
        row('What are you into?', D.INTERESTS, me.interests, 'interests',
            'A few is plenty. It is the detail that makes you a person rather than a follower count.') +
        '<button class="ukBtn ukStart_go" type="button" data-goto="profile" style="margin-top:24px">Done</button>' +
      '</section>';
  }

  V.profile = profile;
  V.editme = editme;

  /* toggles work on the live profile object, so the change is visible
     immediately — and on window.UKME too, the shared record the hotel side
     actually reads (ukdata.js's creator merge). Every field toggled here
     goes through UKME_SET, so a rate or arrangement set here is what a
     hotel sees, not a copy of it. */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-metog]');
    if (el) {
      var list = D.me[el.dataset.metog], v = el.dataset.val, i = list.indexOf(v);
      if (i > -1) list.splice(i, 1); else list.push(v);
      if (window.UKME_SET) window.UKME_SET((function (o) { o[el.dataset.metog] = list.slice(); return o; })({}));
      /* collabTypes is edited inline on the Rates tab now (profile page);
         everything else (traveller types, interests) still lives on the
         separate editme() page — repaint whichever one is actually open. */
      if (window.UKCGO) window.UKCGO(el.dataset.metog === 'collabTypes' ? 'profile' : 'editme');
      return;
    }
    el = e.target.closest('[data-meset]');
    if (el) {
      D.me[el.dataset.meset] = el.dataset.val;
      if (window.UKME_SET) window.UKME_SET((function (o) { o[el.dataset.meset] = el.dataset.val; return o; })({}));
      if (window.UKCGO) window.UKCGO('editme');
      return;
    }
    el = e.target.closest('[data-profpreview]');
    if (el) {
      (window.UKCSTATE ? window.UKCSTATE('profile') : {}).profPreview = el.dataset.profpreview === '1';
      if (window.UKCGO) window.UKCGO('profile');
      return;
    }
    el = e.target.closest('[data-proftab]');
    if (el) {
      (window.UKCSTATE ? window.UKCSTATE('profile') : {}).profTab = el.dataset.proftab;
      if (window.UKCGO) window.UKCGO('profile');
      return;
    }
    el = e.target.closest('[data-profchan]');
    if (el) {
      (window.UKCSTATE ? window.UKCSTATE('profile') : {}).profChan = el.dataset.profchan;
      if (window.UKCGO) window.UKCGO('profile');
      return;
    }
  });

  /* One rate per PAID arrangement type, typed in beside the type it belongs
     to. Kept as it is typed rather than on blur, the same discipline the
     pitch draft in ukcpitch.js already uses. */
  document.addEventListener('input', function (e) {
    var el = e.target.closest('[data-merate]');
    if (!el) return;
    D.me.rates = D.me.rates || {};
    var v = el.value === '' ? null : Math.max(0, Number(el.value) || 0);
    D.me.rates[el.dataset.merate] = v;
    if (window.UKME_SET) {
      var rates = Object.assign({}, window.UKME.rates || {});
      rates[el.dataset.merate] = v;
      window.UKME_SET({ rates: rates });
    }
  });
})();
