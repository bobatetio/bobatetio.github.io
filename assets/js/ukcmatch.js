/* Ukreate — creator matching: destinations, reach, and what they shoot.

   The old model tied a creator to one city and matched hotels by proximity. That is
   the wrong shape for this market: a travel creator's value is that they go places,
   so where they live matters far less than where they travel. Everything here is
   built on that correction — a creator declares where they are headed and what they
   shoot, and hotels are ranked against those two signals plus reach.

   Attaches to the existing UKC namespace so ukcdata.js stays reviewable.

   // PLUG-IN POINT — the matching function.
   matchStays() below really runs: it scores the seeded stay supply on destination
   overlap, style overlap and reach fit, and returns ranked results each carrying the
   reason it ranked. What it does not have is live hotel supply, real campaign briefs
   or any learning from outcomes. Replace the body of score() and swap `stays` for the
   API's rows; the shape it returns — { stay, score, reasons[] } — is what every
   caller reads, so nothing downstream changes.

   // PLUG-IN POINT — destination resolution.
   marketOf() maps a city string onto a market by lookup. A real geocoder returning
   { country, region } would replace it without touching the scorer. */
(function () {
  var D = window.UKC;
  if (!D) return;

  var L = '/assets/img/';

  /* ---------------- what a creator shoots ----------------
     Multi-select and deliberately long: a creator shoots several things, and the old
     six-option single-select forced them to misdescribe themselves. */
  D.SHOOTS = (window.UKVOCAB || {}).SHOOTS.slice();

  /* ---------------- what kind of content they make ----------------
     A different axis from what they shoot: that is subject — wellness, food, luxury.
     This is format — what a hotel actually receives. The two questions get different
     answers from the same creator (a wellness creator might shoot only reels, or
     might shoot reels, photo sets and a drone reel), and a hotel deciding whether a
     creator fits is asking both — is this creator's world a fit, and will they make
     the kind of asset I actually need.

     The canonical list a hotel's own "host a creator" step already asks for is UGC
     video, Photos and Reels (see stayFacts() and every seeded stay's `del`); this
     extends that same vocabulary rather than inventing a second one, so a creator's
     declared formats and a hotel's requested deliverables are always the same words.
     Every surface that shows a format — this selector, the creator's card, the
     matcher, a hotel's deliverable picker — should read off this one list. */
  D.FORMATS = (window.UKVOCAB || {}).FORMATS.slice();

  /* ---------------- where they post ----------------
     Each platform is added separately and carries its own handle and follower count,
     because the total across platforms is the number a hotel is actually buying. */
  /* the shared list, so onboarding and every hotel-side filter offer the same
     eight platforms and can never disagree about their names or marks */
  D.PLATFORMS = ((window.UKVOCAB || {}).PLATFORMS || []).slice();
  D.platOf = function (k) {
    for (var i = 0; i < D.PLATFORMS.length; i++) if (D.PLATFORMS[i].k === k) return D.PLATFORMS[i];
    return null;
  };

  /* total audience is the sum across platforms, never one platform's count */
  D.totalReach = function (plats) {
    return (plats || []).reduce(function (n, p) { return n + (+p.f || 0); }, 0);
  };
  D.bandOf = function (total) {
    if (total < 5000)   return 'Under 5K';
    if (total < 25000)  return '5K - 25K';
    if (total < 100000) return '25K - 100K';
    return '100K+';
  };
  var BAND_ORDER = ['Under 5K', '5K - 25K', '25K - 100K', '100K+'];

  /* ---------------- markets a creator can head for ----------------
     Every independent country, not a curated shortlist: a creator covering Georgia or
     Peru was previously unable to say so, which is exactly the signal this rework
     exists to capture. The list is generated — see ukmarkets.js. */
  D.DESTS = (window.UKMARKETS || []).slice();
  var BY_KEY = {};
  D.DESTS.forEach(function (d) { BY_KEY[d.k] = d; });
  D.destOf = function (k) { return BY_KEY[k] || null; };

  /* PLUG-IN POINT — destination resolution.
     A stay's city string is read at two levels: the city itself, and the country it
     sits in. Both matter — a creator who said Lisbon and a creator who said Portugal
     are both plausible for a Lisbon hotel, just not equally. A real geocoder returning
     a place id and an ISO code replaces this without touching the scoring. */
  var BY_CITY = {}, BY_NAME = {};
  D.DESTS.forEach(function (d) {
    var n = d.n.toLowerCase();
    if (d.t === 'n') BY_NAME[n] = d.k;                 // countries answer the tail
    else if (!BY_CITY[n] || (d.p || 0) > (BY_CITY[n].p || 0)) BY_CITY[n] = d;
  });
  var ALIAS = {
    'usa':'us', 'united states':'us', 'uk':'gb', 'united kingdom':'gb',
    'sa':'za', 'south africa':'za', 'uae':'ae', 'russia':'ru',
    'south korea':'kr', 'north korea':'kp', 'czech republic':'cz',
    'ivory coast':'ci', 'cape verde':'cv', 'east timor':'tl',
    'vatican city':'va', 'myanmar':'mm', 'burma':'mm'
  };

  /* { city: key|null, cc: 'pt'|null } — everything a stay can be matched on. */
  D.placeOf = function (city) {
    var parts = String(city || '').split(',').map(function (x) { return x.trim().toLowerCase(); });
    var head = parts[0] || '', tail = parts[parts.length - 1] || '';
    var c = BY_CITY[head] || null;
    var cc = BY_NAME[tail] || ALIAS[tail] || (c ? c.cc : null);
    return { city: c ? c.k : null, cc: cc || null };
  };
  /* kept for callers that only want one key: the most specific one there is */
  D.marketOf = function (city) {
    var p = D.placeOf(city);
    return p.city || p.cc;
  };

  /* ---------------- more open stays ----------------
     Six hotels across six countries cannot answer a destination question — whatever a
     creator picked, they would see the same three. These extend the seeded supply so
     the markets above actually have something behind them. */
  var MORE = [
    { id:'s7',  wants:'5K - 25K',   hotel:'Casa Boa Vista',    city:'Lisbon, Portugal',      img:L+'hero_bg_lobby.webp', imgs:[L+'hero_bg_lobby.webp',L+'hero_bg_room.jpg',L+'hero_bg_hotel.webp'],
      score:9, nights:2, room:'Tiled loft', style:'Culture & city',
      inc:'Room, breakfast, pastel de nata run', from:'11 Mar', to:'13 Mar' },
    { id:'s8',  wants:'Under 5K',   hotel:'Quinta do Vale',    city:'Porto, Portugal',       img:L+'fc2/hero-hotel.jpg', imgs:[L+'fc2/hero-hotel.jpg',L+'hero_bg_grand.webp',L+'fc2/hero-alt.jpg'],
      score:8, nights:3, room:'Vineyard room', style:'Food & drink',
      inc:'Room, breakfast, cellar tasting', from:'02 Apr', to:'05 Apr' },
    { id:'s9',  wants:'25K - 100K', hotel:'Mar Blau',          city:'Barcelona, Spain',      img:L+'hero_bg_hotel.webp', imgs:[L+'hero_bg_hotel.webp',L+'hero_bg_custom.webp',L+'hero_bg_room.jpg'],
      score:9, nights:2, room:'Terrace double', style:'Beach & city',
      inc:'Room, breakfast', from:'18 May', to:'20 May' },
    { id:'s10', wants:'5K - 25K',   hotel:'Dar Yasmine',       city:'Fez, Morocco',          img:L+'hero_bg_indoor.webp', imgs:[L+'hero_bg_indoor.webp',L+'fc2/cta-bg.jpg',L+'hero_bg_lobby.webp'],
      score:9, nights:3, room:'Courtyard suite', style:'Culture & city',
      inc:'Room, all meals, medina walk', from:'09 Mar', to:'12 Mar' },
    { id:'s11', wants:'Under 5K',   hotel:'Lago Sereno',       city:'Como, Italy',           img:L+'fc2/hero-alt.jpg', imgs:[L+'fc2/hero-alt.jpg',L+'hero_bg_outdoor.webp',L+'hero_bg_hotel.webp'],
      score:8, nights:2, room:'Lake view', style:'Luxury & design',
      inc:'Room, breakfast, boat hour', from:'06 Jun', to:'08 Jun' },
    { id:'s12', wants:'25K - 100K', hotel:'Maison Lumière',    city:'Paris, France',         img:L+'hero_bg_burj.webp', imgs:[L+'hero_bg_burj.webp',L+'hero_bg_lobby.webp',L+'fc2/cta-bg.jpg'],
      score:8, nights:2, room:'Attic studio', style:'Culture & city',
      inc:'Room, breakfast', from:'21 Apr', to:'23 Apr' },
    { id:'s13', wants:'5K - 25K',   hotel:'The Wren',          city:'London, UK',            img:L+'hero_bg_grand.webp', imgs:[L+'hero_bg_grand.webp',L+'fc2/hero-hotel.jpg',L+'hero_bg_outdoor.webp'],
      score:7, nights:2, room:'Loft double', style:'Culture & city',
      inc:'Room, breakfast', from:'14 May', to:'16 May' },
    { id:'s14', wants:'Under 5K',   hotel:'Nordlys Retreat',   city:'Tromsø, Norway',        img:L+'hero_bg_outdoor.webp', imgs:[L+'hero_bg_outdoor.webp',L+'fc2/pricing-bg.jpg',L+'hero_bg_burj.webp'],
      score:9, nights:3, room:'Glass cabin', style:'Nature & wildlife',
      inc:'Room, breakfast, aurora night', from:'12 Feb', to:'15 Feb' },
    { id:'s15', wants:'5K - 25K',   hotel:'Hótel Sandvík',     city:'Reykjavik, Iceland',    img:L+'fc2/cta-bg.jpg', imgs:[L+'fc2/cta-bg.jpg',L+'hero_bg_indoor.webp',L+'hero_bg_custom.webp'],
      score:8, nights:2, room:'Harbour room', style:'Adventure & outdoors',
      inc:'Room, breakfast, lagoon pass', from:'03 Oct', to:'05 Oct' },
    { id:'s16', wants:'25K - 100K', hotel:'Villa Kalypso',     city:'Santorini, Greece',     img:L+'hero_bg_room.jpg', imgs:[L+'hero_bg_room.jpg',L+'hero_bg_hotel.webp',L+'fc2/pricing-bg.jpg'],
      score:10, nights:3, room:'Cave suite', style:'Couples & honeymoon',
      inc:'Room, breakfast, sunset sail', from:'26 Jun', to:'29 Jun' },
    { id:'s17', wants:'Under 5K',   hotel:'Casa Oaxaca',       city:'Oaxaca, Mexico',        img:L+'fc2/pricing-bg.jpg', imgs:[L+'fc2/pricing-bg.jpg',L+'fc2/hero-hotel.jpg',L+'hero_bg_indoor.webp'],
      score:8, nights:3, room:'Patio room', style:'Food & drink',
      inc:'Room, breakfast, market morning', from:'15 Mar', to:'18 Mar' },
    { id:'s18', wants:'5K - 25K',   hotel:'The Marlow',        city:'New York, USA',         img:L+'hero_bg_custom.webp', imgs:[L+'hero_bg_custom.webp',L+'hero_bg_room.jpg',L+'hero_bg_burj.webp'],
      score:7, nights:2, room:'City king', style:'Culture & city',
      inc:'Room only', from:'08 Sep', to:'10 Sep' },
    { id:'s19', wants:'100K+',      hotel:'Al Noor Rooftop',   city:'Dubai, UAE',            img:L+'uk/feat-bg.jpg', imgs:[L+'uk/feat-bg.jpg',L+'hero_bg_room.jpg',L+'hero_bg_burj.webp'],
      score:7, nights:2, room:'Skyline suite', style:'Luxury & design',
      inc:'Room, breakfast, spa hour', from:'19 Nov', to:'21 Nov' },
    { id:'s20', wants:'5K - 25K',   hotel:'Machiya Kyoto',     city:'Kyoto, Japan',          img:L+'hero_bg_lobby.webp', imgs:[L+'hero_bg_lobby.webp',L+'hero_bg_custom.webp',L+'hero_bg_room.jpg'],
      score:10, nights:3, room:'Machiya house', style:'Culture & city',
      inc:'Whole house, breakfast', from:'04 Apr', to:'07 Apr' },
    { id:'s21', wants:'Under 5K',   hotel:'Ubud Green',        city:'Bali, Indonesia',       img:L+'fc2/hero-hotel.jpg', imgs:[L+'fc2/hero-hotel.jpg',L+'fc2/cta-bg.jpg',L+'hero_bg_grand.webp'],
      score:9, nights:4, room:'Jungle villa', style:'Wellness & spa',
      inc:'Room, all meals, daily yoga', from:'11 Jul', to:'15 Jul' },
    { id:'s22', wants:'25K - 100K', hotel:'Table Bay House',   city:'Cape Town, South Africa', img:L+'hero_bg_grand.webp', imgs:[L+'hero_bg_grand.webp',L+'hero_bg_outdoor.webp',L+'hero_bg_custom.webp'],
      score:9, nights:3, room:'Mountain view', style:'Adventure & outdoors',
      inc:'Room, breakfast, coast drive', from:'23 Jan', to:'26 Jan' }
  ];
  MORE.forEach(function (s) {
    s.vibe = s.vibe || 'Design led';
    s.budget = s.budget || 'Independent';
    s.del = s.del || [{ t:'UGC video', q:1 }, { t:'Photos', q:4 }];
    s.rights = 'They keep and use the content';
    s.saved = false;
    s.why = s.why || '';
    if (!D.stays.some(function (x) { return x.id === s.id; })) D.stays.push(s);
  });
  /* These arrive after ukcdata.js has run, so they get placed on the globe here.
     The published-stay registry is re-read at the same point, and for the same
     reason: it hydrated before this file existed, so a hotel's stay and one of
     these could not be compared and the id collision between them was resolved
     the wrong way round — the hotel's s7 shut out Casa Boa Vista's. */
  if (D.placeStays) D.placeStays();
  if (D.hydrateStays) D.hydrateStays();
  if (D.hydrateFavs) D.hydrateFavs();

  /* ---------------- the matcher ---------------- */
  /* Style names differ slightly between what a creator says they shoot and what a
     hotel calls its property, so near-matches count rather than only exact ones. */
  var STYLE_KIN = {
    'Wellness & spa':        ['Eco & wellness', 'Wellness & spa'],
    'Luxury & design':       ['Luxury & design', 'Boutique & design'],
    'Food & drink':          ['Food & drink'],
    'Adventure & outdoors':  ['Adventure & outdoors', 'Mountain & ski'],
    'Eco & sustainable':     ['Eco & wellness'],
    'Culture & city':        ['Culture & city', 'Beach & city'],
    'Beach & islands':       ['Beach & city', 'Beach & islands'],
    'Mountain & ski':        ['Mountain & ski'],
    'Nature & wildlife':     ['Nature & wildlife', 'Eco & wellness'],
    'Couples & honeymoon':   ['Couples & honeymoon', 'Luxury & design'],
    'Family travel':         ['Family travel', 'Beach & city']
  };
  function styleHit(shoots, style) {
    for (var i = 0; i < (shoots || []).length; i++) {
      var kin = STYLE_KIN[shoots[i]] || [shoots[i]];
      if (kin.indexOf(style) > -1) return shoots[i];
    }
    return null;
  }

  /* PLUG-IN POINT — scoring (see header).
     Destination is weighted hardest because it is the thing that decides whether a
     stay is possible at all; style decides whether it is a fit; reach only nudges. */
  function score(stay, p) {
    var pts = 0, reasons = [];
    /* Two levels, scored apart: naming the city is a stronger signal than naming the
       country it happens to be in, but both put the creator on this stay's route. */
    var place = D.placeOf(stay.city);
    var dests = p.dests || [];
    var exact = place.city && dests.indexOf(place.city) > -1;
    var wider = !exact && place.cc && dests.some(function (k) {
      var d = D.destOf(k);
      return d && d.cc === place.cc;
    });
    var onRoute = exact || wider;

    if (exact) {
      pts += 50;
      reasons.push({ k:'dest', t:'In ' + stay.city.split(',')[0] + ', where you’re headed' });
    } else if (wider) {
      pts += 38;
      var land = D.DESTS.filter(function (d) { return d.t === 'n' && d.cc === place.cc; })[0];
      reasons.push({ k:'dest', t:'In ' + (land ? land.n : stay.city.split(',').pop().trim()) +
                                   ', where you’re headed' });
    }

    var hit = styleHit(p.shoots, stay.style);
    if (hit) {
      pts += 30;
      reasons.push({ k:'style', t:'They want the ' + hit.toLowerCase() + ' work you make' });
    }

    /* Format, the third signal: niche answers "is this creator's world a fit",
       format answers "will they make the kind of asset this stay actually needs" —
       a stay asking for UGC video is not well served by a photo-only creator even
       when the niche matches perfectly. Read directly off the stay's own deliverable
       list, so a hotel's ask and a creator's declared formats are the same words
       and this never drifts out of sync with what stayFacts() shows on the card. */
    var wantFormats = (stay.del || []).map(function (d) { return d.t; });
    var formatHit = (p.formats || []).filter(function (fmt) {
      return wantFormats.indexOf(fmt) > -1;
    })[0];
    if (formatHit) {
      pts += 14;
      reasons.push({ k:'format', t:'They need ' + formatHit.toLowerCase() + ', which you shoot' });
    }

    var band = D.bandOf(p.total || 0);
    var want = BAND_ORDER.indexOf(stay.wants), have = BAND_ORDER.indexOf(band);
    if (want === have) {
      pts += 16;
      reasons.push({ k:'reach', t:'Asking for exactly your reach' });
    } else if (have > want) {
      pts += 11;
      reasons.push({ k:'reach', t:'You clear what they are asking for' });
    } else if (want - have === 1) {
      pts += 4;
      reasons.push({ k:'reach', t:'A stretch on reach, worth a pitch' });
    }

    pts += (stay.score || 0) * 0.6;          // how open the property is, as seeded
    return { stay: stay, score: Math.round(pts), reasons: reasons, onRoute: !!onRoute };
  }

  /* Ranked hotels for a creator. `p` is { dests[], shoots[], total }. */
  D.matchStays = function (p, limit) {
    p = p || {};
    var out = D.stays.map(function (s) { return score(s, p); });
    out.sort(function (a, b) { return b.score - a.score; });
    return out.slice(0, limit || 3);
  };

  /* One line a creator can read, built from the same reasons the score used, so what
     they are told is what actually happened. */
  D.matchReason = function (m) {
    var t = m.reasons.map(function (r) { return r.t; });
    if (!t.length) return 'Open to creators right now.';
    if (t.length === 1) return t[0] + '.';
    return t[0] + ', and ' + t.slice(1).join(', ').toLowerCase() + '.';
  };
})();
