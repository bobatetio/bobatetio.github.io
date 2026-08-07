/* Ukreate — onboarding, moment one.
   The whole job: get the property into the system and show them something real
   as fast as possible. Three visible steps, nothing deferrable asked for.
   Moment two does not live here — the rest of the profile is gathered inside
   "Host a creator", at the point each answer is actually needed. */
(function () {
  var root = document.querySelector('[data-ukstart]');
  if (!root) return;

  var D = window.UK;
  var stage = document.getElementById('ukStage');
  var rail  = document.getElementById('ukRail');

  var STEPS = ['Property', 'City', 'Photos', 'Creators'];
  var f = { name: '', city: '', photo: null, picked: false, sugIx: -1, invited: {},
            shotIx: 0, cropIx: null, annMenu: false };
  var step = 0;

  /* Cities we can show a real local network for. Anything else still works —
     we widen to the country rather than showing an empty result. */
  var NEAR = {
    'miami':    ['c2','c4','c3','c5'],
    'florida':  ['c2','c4','c3','c5'],
    'london':   ['c9','c6','c10','c1'],
    'lisbon':   ['c1','c9','c6','c5'],
    'marrakesh':['c10','c6','c9','c1'],
    'oslo':     ['c5','c1','c8','c6'],
    'kyoto':    ['c6','c9','c1','c4'],
    'sydney':   ['c8','c4','c2','c7']
  };
  function nearby(city) {
    var key = (city || '').toLowerCase().trim();
    var hit = Object.keys(NEAR).filter(function (k) { return key.indexOf(k) > -1; })[0];
    return (NEAR[hit] || ['c1','c2','c6','c9']).map(function (id) { return D.creator(id); });
  }

  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) {
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; }); };

  function paintRail() {
    rail.innerHTML = STEPS.map(function (s, i) {
      return '<li class="' + (i < step ? 'is-done' : i === step ? 'is-now' : '') + '">' +
        '<span class="ukStart_dot">' + (i < step ? '<svg class="ukTick" viewBox="0 0 12 12" aria-hidden="true">' +
            '<path d="M2.6 6.35 4.85 8.6 9.4 3.75" fill="none" stroke="currentColor" ' +
            'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' : i + 1) + '</span>' +
        '<span class="ukStart_lb">' + s + '</span></li>';
    }).join('');
  }

  /* ---------- step 1: the smallest possible entry ---------- */
  /* PLUG-IN POINT — geocoding. Suggestions come from UKCITYMAP's lookup today;
     swap in a real places API and only this function changes. */
  function suggest(q) {
    q = String(q || '').toLowerCase().trim();
    if (!q || !window.UKCITYMAP || f.picked) return [];
    var seen = {};
    return Object.keys(UKCITYMAP.CITIES || {}).filter(function (k) {
      return k.indexOf(q) === 0 && !seen[k] && (seen[k] = 1);
    }).slice(0, 5).map(function (k) {
      var pt = UKCITYMAP.CITIES[k];
      var n = D.creators.filter(function (c) {
        return typeof c.lat === 'number' && UKCITYMAP.km(pt[0], pt[1], c.lat, c.lng) <= REACH_KM;
      }).length;
      return { label: k.replace(/\b\w/g, function (m) { return m.toUpperCase(); }), n: n };
    });
  }

  /* "Within reach" is a few hours to the property, not a continent: at the old
     2500km every European market returned the same 159 people, which is not a
     supply answer a hotel can act on. */
  var REACH_KM = 300;

  /* The number in the caption and the people on the globe are the same set. Both
     come from this: creators within reach of the chosen city. */
  function availableNear(city) {
    if (!window.UKCITYMAP) return null;
    var pt = UKCITYMAP.resolve(city);
    if (!pt) return null;
    return D.creators.filter(function (c) {
      return typeof c.lat === 'number' &&
             UKCITYMAP.km(pt.lat, pt.lng, c.lat, c.lng) <= REACH_KM;
    });
  }

  function stepOne() {
    return '<div class="ukStart_grid">' +
      '<section class="ukStart_ask">' +
        /* Hotel onboarding was already light — one name, one city, an optional
           photo — so this isn't a new step, just a line of orientation ahead of
           the first field, the same job creator onboarding's new welcome screen
           does at a scale that fits how short this flow already is. */
        '<p class="ukStart_kicker">Let&rsquo;s find creators for your property — about a minute.</p>' +
        '<h1 class="ukStart_h">First, your property name.</h1>' +
        '<p class="ukStart_p">The name creators will see. You can change it later.</p>' +
        /* the headline already asks for it, so the label only repeats itself on screen;
           it stays in the DOM so the field is still named for screen readers */
        '<label class="ukField"><span class="ukField_l ukSrOnly">Property name</span>' +
        '<input class="ukField_i" id="pname" data-k="name" value="' + esc(f.name) + '" ' +
        'placeholder="MiraGrace Estate" autocomplete="organization"></label>' +
        /* Nothing to continue to until there is a name, and a dead button sitting
           there is just an instruction you cannot follow. It appears on the first
           keystroke instead. */
        (f.name.trim()
          ? '<div class="ukNav ukNav--inline">' +
              '<button class="ukBtn ukNav_go" type="button" data-next>Continue</button>' +
              '<span class="ukEnter"><kbd class="ukEnter_k">&#8629;</kbd>Or press Enter</span>' +
            '</div>'
          : '') +
      '</section>' +

      '</div>';
  }

  /* ---------- step 2: where the property is ---------- */
  function stepCity() {
    var list = availableNear(f.city);
    var sugs = suggest(f.city);
    return '<div class="ukStart_grid">' +
      '<section class="ukStart_ask">' +
        '<h1 class="ukStart_h">Where is ' + esc(f.name.trim() || 'your property') + '?</h1>' +
        '<p class="ukStart_p">We use the city to show you creators who cover your market.</p>' +
        '<div class="ukField ukLoc">' +
          /* the headline asks the question; the label only repeats it on screen */
          '<label class="ukField_l ukSrOnly" for="pcity">City</label>' +
          '<span class="ukLoc_in">' +
            '<input class="ukField_i" id="pcity" data-k="city" value="' + esc(f.city) + '" ' +
              'placeholder="start typing a city" autocomplete="off" spellcheck="false" ' +
              'role="combobox" aria-expanded="' + (sugs.length ? 'true' : 'false') + '" ' +
              'aria-controls="ukLocList" aria-autocomplete="list">' +
            '<span class="ukLoc_ico" data-icon="search" aria-hidden="true"></span>' +
          '</span>' +
          (sugs.length
            ? '<ul class="ukLoc_list" id="ukLocList" role="listbox" aria-label="Matching cities">' +
              sugs.map(function (sg, i) {
                return '<li class="ukLoc_opt' + (i === f.sugIx ? ' is-on' : '') + '" role="option" ' +
                  'aria-selected="' + (i === f.sugIx) + '" data-pick="' + esc(sg.label) + '">' +
                  '<span class="ukLoc_c">' + esc(sg.label) + '</span>' +
                  '<span class="ukLoc_n">' + sg.n + ' creator' + (sg.n === 1 ? '' : 's') + '</span></li>';
              }).join('') + '</ul>'
            : '') +
        '</div>' +
        '<div class="ukNav">' +
          '<button class="ukGhost ukNav_back" type="button" data-back>Back</button>' +
          '<button class="ukBtn ukNav_go" type="button" data-next ' +
          (f.city.trim() ? '' : 'disabled') + '>Continue</button>' +
        '</div>' +
      '</section>' +

      '<aside class="ukStart_mirror ukStart_pane ukStart_mirror--globe">' +
        '<div class="ukGlobeSlot" id="ukGlobeSlot"></div>' +
        '<div class="ukGlobeCap">' +
          (list && list.length
            ? '<h2 class="ukStart_mh">' + list.length + ' creator' + (list.length === 1 ? '' : 's') +
                ' who cover ' + esc(f.city.trim()) + '</h2>' +
              '<p class="ukStart_mp">Vetted, and ready to create at your property.</p>'
            : '<p class="ukStart_mp ukGlobeCap_wait">Type your city to see who covers it.</p>') +
        '</div>' +
      '</aside></div>';
  }

  /* ---------- step 2: their own rooms, uploaded ----------
     The old version offered four stock photos and admitted in its own hint that they
     were stand-ins. Handing a hotel someone else's rooms to pass off as theirs is not
     a shortcut, it is a wrong answer. This takes real files. */
  function shotIx() {
    var n = (f.photos || []).length;
    if (!n) return 0;
    f.shotIx = ((f.shotIx || 0) % n + n) % n;
    return f.shotIx;
  }

  /* Drag-to-reframe, the tiles and the crop maths all live in ukshots.js now, so
     this page and the in-app gate render one component rather than two copies of
     it. The handlers below stay here because they are wired to this page's own
     `f` and paint(). */
  function cropEditor() { return window.UKSHOTS ? window.UKSHOTS.editor(f) : ''; }

  function stepTwo() {
    var shots = f.photos || (f.photos = []);
    return '<div class="ukStart_grid">' +
      '<section class="ukStart_ask">' +
        '<h1 class="ukStart_h">Show creators your hotel</h1>' +
        '<p class="ukStart_p">One room is enough. Add the rest now, or whenever suits you.</p>' +

        (window.UKSHOTS ? window.UKSHOTS.tiles(f) : '') +

        '<div class="ukNav">' +
          '<button class="ukGhost ukNav_back" type="button" data-back>Back</button>' +
          '<button class="ukBtn ukNav_go" type="button" data-next>Continue</button>' +
        '</div>' +
        (shots.length ? '' : '<button class="ukNav_skip" type="button" data-next>Skip for now</button>') +
      '</section>' +

      '<aside class="ukStart_mirror ukStart_pane">' +
        '<div class="ukPane_mid">' +
          /* The listing as a creator meets it: the photograph carries the facts on
             pills, and the block beneath carries the name and where it is. No nightly
             rate, because nothing here is sold by the night: what a creator is
             deciding is whether the property is worth the trip. */
          '<article class="ukLst">' +
            '<div class="ukLst_m">' +
              (shots.length
                ? '<img class="ukLst_img" src="' + shotOut(shots[shotIx()]) + '" alt="">'
                : '<div class="ukLst_img ukLst_img--empty"><span>Your first room sits here</span></div>') +
              '<div class="ukLst_pills">' +
                '<span class="ukLst_pill"><span data-icon="people"></span>' +
                  (availableNear(f.city) || []).length + ' creators cover this city</span>' +
                '<span class="ukLst_pill"><img src="/assets/img/fc/star.svg" alt="" ' +
                  'width="12" height="12">New</span>' +
              '</div>' +
              /* the arrows only exist while the pointer is on the card, the way the
                 reference does it, so at rest the photograph is the whole surface */
              (shots.length > 1
                ? ['-1', '1'].map(function (d) {
                    return '<button class="ukLst_arw ukLst_arw--' + (d === '-1' ? 'p' : 'n') +
                      '" type="button" data-shot="' + d + '" aria-label="' +
                      (d === '-1' ? 'Previous' : 'Next') + ' photo">' +
                      /* a drawn chevron: the &lsaquo; glyph is a quotation mark, sized
                         and centred to a font's rules rather than the button's */
                      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' +
                      (d === '-1' ? 'M14.5 5.5 8 12l6.5 6.5' : 'M9.5 5.5 16 12l-6.5 6.5') +
                      '" fill="none" stroke="currentColor" stroke-width="2.1" ' +
                      'stroke-linecap="round" stroke-linejoin="round"/></svg></button>';
                  }).join('')
                : '') +
            '</div>' +
            '<div class="ukLst_b">' +
              '<h3 class="ukLst_t">' + esc(f.name || 'Your property') + '</h3>' +
              '<p class="ukLst_sub">' + esc(f.city || 'Your city') + '</p>' +
              '<p class="ukLst_meta"><strong>Hosted stay</strong> &middot; you set the nights</p>' +
            '</div>' +
          '</article>' +
        '</div>' +
        '<div class="ukGlobeCap">' +
          '<h2 class="ukStart_mh">This is what a creator sees</h2>' +
          '<p class="ukStart_mp">It fills out as you add rooms and keep the rest of ' +
          'your profile current. The more complete it is, the more creators get in touch.</p>' +
        '</div>' +
      '</aside></div>';
  }

  /* ---------- step 3: who covers this market, with the panel kept ---------- */
  /* ---------- creator card ---------- */

  function fmtN(n) {
    if (typeof n !== 'number' || !n) return '\u2014';
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
    return String(n);
  }
  function orDash(v) { return (v === 0 || v === null || v === undefined || v === '') ? '\u2014' : v; }

  /* Official full-colour marks, fetched and kept as files. Never redrawn in code:
     a hand-made approximation of a brand logo is always wrong. */
  /* Official national flags, keyed off the country the location string ends with.
     Files, not emoji: the regional-indicator glyphs do not render on Windows at all,
     which would leave a blank where a flag should be. */
  var CC = {
    'USA':'us', 'UK':'gb', 'Portugal':'pt', 'Spain':'es', 'France':'fr',
    'Germany':'de', 'Norway':'no', 'Switzerland':'ch', 'Morocco':'ma', 'UAE':'ae',
    'Ghana':'gh', 'South Africa':'za', 'SA':'za', 'Japan':'jp', 'Indonesia':'id',
    'Mexico':'mx', 'Australia':'au', 'Italy':'it', 'India':'in'
  };
  /* The card used to show a handle and a home city. A creator now has one handle per
     platform, so a single "@" is arbitrary; and where they live says nothing about
     whether they can shoot here. This computes what the hotel actually needs: what of
     their coverage overlaps this market, never more than two names. */
  function coversLine(c, viewerCity, anchored) {
    var list = (c.covers && c.covers.length) ? c.covers : (c.loc ? [c.loc] : []);
    if (!list.length) return null;
    var v = String(viewerCity || '').toLowerCase().trim();
    var hitIx = v ? list.findIndex(function (x) {
      return x.toLowerCase().indexOf(v) > -1;
    }) : -1;

    if (hitIx > -1) {
      var hit = list[hitIx];
      /* anchored to one hotel's market — name it in full, nothing else competes */
      if (anchored) return { cities: [hit], more: 0 };
      return { cities: [hit.split(',')[0]], more: list.length - 1 };
    }
    /* they do not cover this market: show range rather than a false anchor */
    return { cities: list.slice(0, 2).map(function (x) { return x.split(',')[0]; }),
             more: Math.max(0, list.length - 2) };
  }

  function flagFor(loc) {
    var country = String(loc || '').split(',').pop().trim();
    return CC[country] || null;
  }

  var PLAT = {
    ig: { n:'Instagram', s:'/assets/img/brand/instagram.svg' },
    tt: { n:'TikTok',    s:'/assets/img/brand/tiktok.svg' },
    yt: { n:'YouTube',   s:'/assets/img/brand/youtube.svg' },
    fb: { n:'Facebook',  s:'/assets/img/brand/facebook.svg' },
    sc: { n:'Snapchat',  s:'/assets/img/brand/snapchat.svg' }
  };

  /* PLUG-IN POINT — clip stills.
     Real 9:16 frames come from the creator's own recent posts once there is a media
     endpoint. Until then these are portrait photographs already in the library,
     cropped to 9:16 and rotated per creator so no two cards in view show the same
     three. They stand in for the frames; they are not claimed to be that creator's
     work. */
  /* Each poster is a frame lifted from its own clip, so the still and the video are
     the same shot. Scenery that merely looked nice was not what a hotel is judging:
     these are creators working. */
  var CLIPS = [
    { v:'/assets/video/ugc/ugc-01.mp4', p:'/assets/img/uk/clips/ugc-01.jpg' },
    { v:'/assets/video/ugc/ugc-02.mp4', p:'/assets/img/uk/clips/ugc-02.jpg' },
    { v:'/assets/video/ugc/ugc-03.mp4', p:'/assets/img/uk/clips/ugc-03.jpg' },
    { v:'/assets/video/ugc/ugc-04.mp4', p:'/assets/img/uk/clips/ugc-04.jpg' },
    { v:'/assets/video/ugc/ugc-05.mp4', p:'/assets/img/uk/clips/ugc-05.jpg' },
    { v:'/assets/video/ugc/ugc-06.mp4', p:'/assets/img/uk/clips/ugc-06.jpg' },
    { v:'/assets/video/ugc/ugc-07.mp4', p:'/assets/img/uk/clips/ugc-07.jpg' },
    { v:'/assets/video/ugc/ugc-08.mp4', p:'/assets/img/uk/clips/ugc-08.jpg' },
    { v:'/assets/video/ugc/ugc-09.mp4', p:'/assets/img/uk/clips/ugc-09.jpg' },
    { v:'/assets/video/ugc/ugc-10.mp4', p:'/assets/img/uk/clips/ugc-10.jpg' }
  ];
  function clipsFor(ix) {
    var out = [];
    for (var i = 0; i < 4; i++) out.push(CLIPS[(ix * 4 + i) % CLIPS.length]);
    return out;
  }

  /* Three states rather than a date the reader has to interpret. The dot carries it,
     and hovering says it in words. */
  var AVAIL = {
    now:   { c:'is-now',   t:'Available now' },
    soon:  { c:'is-soon',  t:'Not free right now. Was available recently.' },
    later: { c:'is-later', t:'Has not been available for a while.' }
  };
  function availOf(c) {
    if (c.avail && AVAIL[c.avail]) return AVAIL[c.avail];
    return /now/i.test(c.free || '') ? AVAIL.now : AVAIL.soon;
  }

  /* the verified mark, supplied as artwork and recoloured to the brand token */
  /* Single source now in ukicons.js (window.UK_VET_D), which loads before this
     file on every page — a local copy here was how the badge drifted before. */
  var VET_D = window.UK_VET_D;

  function creatorCard(c, ix) {
    var av = availOf(c);
    var plats = (c.p || []).map(function (k) { return PLAT[k]; }).filter(Boolean);
    var cats = (c.cats && c.cats.length ? c.cats : [c.type]).filter(Boolean);
    var extra = Math.max(0, cats.length - 2);

    /* "Audience" rather than followers: it is the total across the platforms whose
       marks sit beside it, which is the number that decides whether hosting this
       person reaches anyone. Avg reach is per post, and the two are not the same. */
    var stats = [
      ['Audience',   fmtN(c.f)],
      ['Avg reach',  orDash(String(c.reach || '').replace(/\s*per post/, ''))],
      ['Engagement', orDash(c.eng)],
      ['Rating',     c.rating ? String(c.rating) : '\u2014', true],
      ['Stays',      orDash(c.stays)]
    ];

    return '<li class="ukCrCard">' +
      '<div class="ukCrCard_top">' +
        '<span class="ukCrAv">' +
          '<img src="' + c.img + '" alt=""' + (ix < 3 ? '' : ' loading="lazy" decoding="async"') + '>' +
          '<span class="ukCrAv_dot ' + av.c + '" title="' + esc(av.t) + '" ' +
            'role="img" aria-label="' + esc(av.t) + '"></span>' +
        '</span>' +

        '<span class="ukCrCard_id">' +
          '<span class="ukCrCard_n">' + esc(c.n) +
            /* inline rather than an <img> so the mark takes the deep token: the badge
               is ours, and the blue it ships in belongs to someone else's product */
            (c.vet === false ? '' :
              '<svg class="ukCrVet" viewBox="0 0 30.51 30.51" role="img" aria-label="Vetted">' +
              '<title>Vetted creator</title>' +
              '<path fill-rule="evenodd" clip-rule="evenodd" fill="currentColor" d="' +
              VET_D + '"/></svg>') +
          '</span>' +
          (function () {
            var cov = coversLine(c, f.city, true);
            if (!cov) return '';
            var lead = cov.cities[0];
            return '<span class="ukCrCard_m">Covers ' +
              (flagFor(lead)
                ? '<img class="ukCrFlag" src="/assets/img/flags/' + flagFor(lead) + '.svg" alt="" ' +
                  'loading="lazy" decoding="async">'
                : '') +
              esc(cov.cities.join(', ')) +
              (cov.more ? '<span class="ukCoversMore" title="' +
                esc((c.covers || []).join(', ')) + '">+' + cov.more + '</span>' : '') +
            '</span>';
          })() +
          '<span class="ukCrTags">' +
            /* two fit the row; the counter only starts from the third onwards */
            cats.slice(0, 2).map(function (t) {
              return '<span class="ukCrTag">' + esc(t) + '</span>';
            }).join('') +
            (extra > 0 ? '<span class="ukCrTag ukCrTag--n" title="' +
              esc(cats.slice(2).join(', ')) + '">+' + extra + '</span>' : '') +
          '</span>' +
        '</span>' +

        /* opposite the name, stacked left over right, each carrying a ring in the
           card colour so overlapping marks stay separable */
        '<span class="ukCrPlats">' + plats.map(function (pl) {
          return '<img class="ukCrPlat" src="' + pl.s + '" alt="' + esc(pl.n) + '" ' +
            'title="' + esc(pl.n) + '" loading="lazy" decoding="async">';
        }).join('') + '</span>' +
      '</div>' +

      '<span class="ukCrClips">' + clipsFor(ix).map(function (cl, i) {
        return '<span class="ukCrClip" data-clip="' + esc(cl.v) + '" tabindex="0" role="button" ' +
          'aria-label="Play clip ' + (i + 1) + '">' +
          '<img src="' + cl.p + '" alt=""' +
            (ix < 2 ? '' : ' loading="lazy" decoding="async"') + '>' +
          /* one solid disc with the triangle knocked out of it, so the frame shows
             through the play mark itself */
          '<svg class="ukCrPlay" viewBox="0 0 44 44" aria-hidden="true">' +
            /* corners eased with quadratics through each vertex, not a stroke: a
               stroke would fill the hole the triangle is cut out of */
            '<path fill-rule="evenodd" clip-rule="evenodd" d="M22 0C9.85 0 0 9.85 0 22' +
            's9.85 22 22 22 22-9.85 22-22S34.15 0 22 0Z' +
            'M17.6 16.8Q17.6 13.2 20.6 15.2L27.8 20Q30.8 22 27.8 24' +
            'L20.6 28.8Q17.6 30.8 17.6 27.2L17.6 16.8Z"/>' +
          '</svg></span>';
      }).join('') + '</span>' +

      '<span class="ukCrStats">' + stats.map(function (st) {
        return '<span class="ukCrStat"><span class="ukCrStat_v">' +
          (st[2] ? '<img class="ukCrStar" src="/assets/img/fc/star.svg" alt="" ' +
                   'width="11" height="11">' : '') +
          esc(st[1]) + '</span>' +
          '<span class="ukCrStat_l">' + esc(st[0]) + '</span></span>';
      }).join('') + '</span>' +
    '</li>';
  }

  function invited() { return Object.keys(f.invited).length; }

  /* only one clip runs at a time */
  function stopClips(except) {
    root.querySelectorAll('.ukCrClip.is-playing').forEach(function (el) {
      if (el === except) return;
      var v = el.querySelector('video');
      if (v) v.pause();
      el.classList.remove('is-playing');
    });
  }


  /* ---------- the announcement card, as a real image ----------
     Drawn to a canvas at 1080x1350 rather than screenshotting the DOM: it is the only
     way to get a file out of the browser without a rasteriser library, and it gives a
     properly sized social asset instead of whatever the panel happened to measure.

     // PLUG-IN POINT — share targets.
     navigator.share carries the file straight into the OS sheet where that exists
     (iOS, Android, Safari, Edge). Everywhere else it downloads. A server-rendered
     card, per-network crops, or a prefilled caption would all hang off this same
     handler; nothing above it needs to change. */
  var CARD_W = 1080, CARD_H = 1350;

  /* Only the networks with a real web share endpoint are listed. Instagram and TikTok
     have none — they take an upload from the device — so they are served by Download
     rather than by a button that would open nothing.

     // PLUG-IN POINT — a public card URL.
     These endpoints share a link, not a file: they fetch whatever the URL's Open
     Graph tags describe. Until the card is hosted somewhere public, they carry the
     site and the hotel attaches the downloaded image. Point CARD_URL at a per-hotel
     announcement page with og:image set to the rendered card and every one of these
     starts previewing the card itself; nothing else here changes. */
  var NETS = [
    { k:'facebook', n:'Facebook', i:'/assets/img/brand/facebook.svg' },
    { k:'linkedin', n:'LinkedIn', i:'/assets/img/brand/linkedin.svg' },
    { k:'x',        n:'X',        i:'/assets/img/brand/x.svg' },
    { k:'whatsapp', n:'WhatsApp', i:'/assets/img/brand/whatsapp.svg' }
  ];
  function shareTo(kind) {
    var CARD_URL = location.origin + '/';
    var text = (f.name.trim() || 'Our property') + ' is now on uKreate. ' +
               'Open to vetted travel creators.';
    var u = encodeURIComponent(CARD_URL), t = encodeURIComponent(text);
    var to = {
      facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + u,
      linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=' + u,
      x:        'https://twitter.com/intent/tweet?text=' + t + '&url=' + u,
      whatsapp: 'https://wa.me/?text=' + encodeURIComponent(text + ' ' + CARD_URL)
    }[kind];
    if (to) window.open(to, '_blank', 'noopener,noreferrer,width=640,height=640');
  }

  function loadImg(src) {
    return new Promise(function (res, rej) {
      var i = new Image();
      i.crossOrigin = 'anonymous';
      i.onload = function () { res(i); };
      i.onerror = rej;
      i.src = src;
    });
  }

  function wrapLines(ctx, text, maxW) {
    var words = String(text).split(' '), lines = [], line = '';
    for (var i = 0; i < words.length; i++) {
      var t = line ? line + ' ' + words[i] : words[i];
      if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = words[i]; }
      else line = t;
    }
    if (line) lines.push(line);
    return lines;
  }

  function drawCard() {
    var c = document.createElement('canvas');
    c.width = CARD_W; c.height = CARD_H;
    var ctx = c.getContext('2d');
    var prop = f.name.trim() || 'Your property';
    var shot = (f.photos && f.photos.length) ? shotOut(f.photos[0]) : null;

    /* Waiting on fonts gets the headline drawn in Marcellus rather than a fallback
       serif, but document.fonts.ready hangs whenever the webfont request does, and a
       card that never renders is worse than one drawn in the fallback. */
    var ready = Promise.race([
      (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve(),
      new Promise(function (r) { setTimeout(r, 1500); })
    ]);

    return ready.then(function () {
      return shot ? loadImg(shot).catch(function () { return null; }) : null;
    }).then(function (img) {
      if (img) {
        /* cover, so the photograph is never squeezed to the card's ratio */
        var ir = img.width / img.height, cr = CARD_W / CARD_H, sw, sh;
        if (ir > cr) { sh = img.height; sw = sh * cr; } else { sw = img.width; sh = sw / cr; }
        ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, 0, 0, CARD_W, CARD_H);
      } else {
        var g = ctx.createLinearGradient(0, 0, CARD_W, CARD_H);
        g.addColorStop(0, '#0B2F52'); g.addColorStop(0.55, '#08233D'); g.addColorStop(1, '#061829');
        ctx.fillStyle = g; ctx.fillRect(0, 0, CARD_W, CARD_H);
      }
      /* the scrim is what makes the type legible over any photograph, so it is drawn
         whether or not one was uploaded */
      var s = ctx.createLinearGradient(0, CARD_H * 0.28, 0, CARD_H);
      s.addColorStop(0, 'rgba(6,24,41,0)');
      s.addColorStop(0.55, 'rgba(6,24,41,.72)');
      s.addColorStop(1, 'rgba(6,24,41,.94)');
      ctx.fillStyle = s; ctx.fillRect(0, 0, CARD_W, CARD_H);

      return loadImg('/assets/img/ukreate-logo-white.svg').catch(function () { return null; });
    }).then(function (logo) {
      var pad = 84;

      var y = CARD_H - pad;
      ctx.fillStyle = 'rgba(255,255,255,.84)';
      ctx.font = '400 34px Lato, sans-serif';
      ctx.fillText('Now open to vetted travel creators.', pad, y);
      y -= 78;

      ctx.fillStyle = '#ffffff';
      ctx.font = '400 68px Marcellus, Georgia, serif';
      var lines = wrapLines(ctx, prop + ' is now on uKreate', CARD_W - pad * 2).slice(0, 4);
      for (var i = lines.length - 1; i >= 0; i--) { ctx.fillText(lines[i], pad, y); y -= 80; }

      /* the lockup sits above the sentence, the same order the card has on screen */
      if (logo) {
        var lh = 76, lw = lh * (logo.width / logo.height || 3.07);
        ctx.drawImage(logo, pad - 22, y - lh + 34, lw, lh);
      }
      return c;
    });
  }

  function exportCard(btn, how) {
    var label = btn.textContent;
    btn.disabled = true;
    drawCard().then(function (c) {
      return new Promise(function (res) { c.toBlob(res, 'image/png'); });
    }).then(function (blob) {
      if (!blob) throw new Error('no blob');
      var name = (f.name.trim() || 'ukreate').toLowerCase().replace(/[^a-z0-9]+/g, '-')
                   .replace(/^-|-$/g, '') + '-on-ukreate.png';
      var file = new File([blob], name, { type: 'image/png' });

      function save() {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      }

      /* Download always writes a file. Share hands it to the OS sheet where one
         exists and falls back to the file where it does not, so neither option can
         leave the hotel with nothing. */
      if (how === 'share' && navigator.canShare && navigator.canShare({ files: [file] })) {
        return navigator.share({ files: [file], title: 'We are now on Ukreate' })
          .catch(function (err) { if (!err || err.name !== 'AbortError') save(); });
      }
      save();
    }).catch(function (err) {
      if (err && err.name === 'AbortError') return;   // the share sheet was dismissed
      btn.classList.add('is-bad');
      setTimeout(function () { btn.classList.remove('is-bad'); }, 2200);
    }).then(function () {
      btn.disabled = false;
      if (btn.textContent !== label) btn.textContent = label;
    });
  }

  function stepThree() {
    var list = availableNear(f.city) || nearby(f.city);
    var prop = f.name.trim() || 'Your property';
    var shot = (f.photos && f.photos.length) ? shotOut(f.photos[0]) : null;
    return '<div class="ukStart_grid">' +
      '<section class="ukStart_ask ukStart_ask--wide">' +
        '<h1 class="ukStart_h">' + esc(f.name.trim() || 'Your property') + ' is now on ' +
          '<span class="ukWordmark"><img src="/assets/img/ukreate-wordmark.svg" alt="uKreate"></span>!</h1>' +
        '<p class="ukStart_p">Every one of these is vetted, and covers your market — ' +
        'they travel here, so they can shoot here.</p>' +

        /* The point of this step is that the network is not empty. The list scrolls
           inside the card so the page itself still never leaves the viewport. */
        '<ul class="ukCrList">' + list.slice(0, 5).map(creatorCard).join('') + '</ul>' +

        /* the list shows five; the sentence accounts for the rest, so the number here
           and the number on the globe are the same number */
        (list.length > 5
          ? '<p class="ukMore">and ' + (list.length - 5) + ' more who cover ' +
            esc(f.city.trim() || 'you') + '</p>'
          : '') +

        '<div class="ukNav">' +
          '<button class="ukGhost ukNav_back" type="button" data-back>Back</button>' +
          '<a class="ukBtn ukNav_go" href="/app/">Go to your dashboard</a>' +
        '</div>' +
      '</section>' +

      /* The globe carried no information the left column was not already stating, so
         this step ends on something the hotel can use: a branded announcement they can
         post. The creator peek underneath keeps the "here is who is waiting" pull the
         globe caption had, without pretending to be the hero. */
      '<aside class="ukStart_mirror ukStart_pane ukStart_pane--ann">' +
        '<article class="ukAnn" data-anncard aria-label="Announcement card for ' +
          esc(prop) + '">' +
          '<div class="ukAnn_m">' +
            (shot
              ? '<img class="ukAnn_img" src="' + shot + '" alt="" width="1080" height="1350">'
              : '<div class="ukAnn_img ukAnn_img--brand" aria-hidden="true"></div>') +
            '<div class="ukAnn_scrim" aria-hidden="true"></div>' +

            '<div class="ukAnn_menu">' +
              '<button class="ukAnn_dots" type="button" data-annmenu aria-haspopup="menu" ' +
                'aria-expanded="' + (f.annMenu ? 'true' : 'false') + '" aria-label="Card options">' +
                '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="2"/>' +
                '<circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>' +
              '</button>' +
              (f.annMenu
                ? '<div class="ukAnn_pop" role="menu">' +
                    '<button class="ukAnn_opt" type="button" role="menuitem" data-annact="download">' +
                      'Download image</button>' +
                    (window.navigator.canShare
                      ? '<button class="ukAnn_opt" type="button" role="menuitem" data-annact="share">' +
                        'Share\u2026</button>'
                      : '') +
                    '<span class="ukAnn_sep" role="separator"></span>' +
                    NETS.map(function (n) {
                      return '<button class="ukAnn_opt ukAnn_opt--net" type="button" role="menuitem" ' +
                        'data-annnet="' + n.k + '">' +
                        '<img src="' + n.i + '" alt="" width="18" height="18">Share to ' +
                        esc(n.n) + '</button>';
                    }).join('') +
                  '</div>'
                : '') +
            '</div>' +

            '<div class="ukAnn_b">' +
              '<img class="ukAnn_logo" src="/assets/img/ukreate-logo-white.svg" alt="Ukreate" ' +
                'width="510" height="166">' +
              '<h2 class="ukAnn_h">' + esc(prop) + ' is now on uKreate</h2>' +
              '<p class="ukAnn_p">Now open to vetted travel creators.</p>' +
            '</div>' +
          '</div>' +
        '</article>' +

        '<div class="ukAnn_peek">' +
          (list.length
            ? '<span class="ukPeek_av">' + list.slice(0, 4).map(function (c) {
                return '<img src="' + c.img + '" alt="" loading="lazy" decoding="async">';
              }).join('') + '</span>' +
              '<p class="ukPeek_t">and ' + list.length + ' vetted creator' +
                (list.length === 1 ? '' : 's') + ' covering ' + esc(f.city.trim() || 'you') + '</p>'
            : '<p class="ukPeek_t">We will match creators as soon as we can.</p>') +
        '</div>' +
      '</aside></div>';
  }


  /* The globe is expensive to build and the stage is rewritten on every keystroke, so
     it is built once in the shell and moved in and out of whichever step wants it.
     Parking it on <body> before the wipe is what keeps the canvas alive. */
  var globeHold = null;
  function parkGlobe() {
    globeHold = globeHold || document.getElementById('ukGlobeHold');
    if (!globeHold) return;
    /* hide first, unconditionally: on a step with no slot it would otherwise sit in
       the page at full width, over the form */
    globeHold.hidden = true;
    if (globeHold.parentNode !== document.body) document.body.appendChild(globeHold);
  }
  function placeGlobe() {
    var slot = document.getElementById('ukGlobeSlot');
    if (globeHold && slot) { slot.appendChild(globeHold); globeHold.hidden = false; }
    requestAnimationFrame(fitGlobe);
  }
  /* size it to whatever the panel has left after the caption, so it grows on tall
     screens and never pushes the page past the fold */
  function fitGlobe() {
    var panel = root.querySelector('.ukStart_pane');
    var hold = globeHold;
    if (!panel || !hold || hold.hidden) return;
    var cap = panel.querySelector('.ukGlobeCap');
    var capH = cap ? cap.offsetHeight : 0;
    var padY = 96, padX = 72;
    var w = Math.max(220, Math.min(panel.clientWidth - padX, panel.clientHeight - capH - padY));
    hold.style.width = w + 'px';
    for (var t = 0; t < 3; t++) {
      var over = (hold.getBoundingClientRect().height + capH + padY) - panel.clientHeight;
      if (over <= 0) break;
      w = Math.max(220, w - over - 2);
      hold.style.width = w + 'px';
    }
  }
  window.addEventListener('resize', fitGlobe);

  /* Pointer drag on the crop preview. Moving right reveals more of the left edge, so
     the focal point moves the opposite way to the pointer. */
  (function () {
    var box = null, sh = null, sx = 0, sy = 0, fx0 = 0, fy0 = 0;
    root.addEventListener('pointerdown', function (e) {
      var b = e.target.closest('[data-cropbox]');
      if (!b) return;
      box = b; sh = f.photos[f.cropIx];
      if (!sh) { box = null; return; }
      sx = e.clientX; sy = e.clientY; fx0 = sh.fx; fy0 = sh.fy;
      b.setPointerCapture(e.pointerId);
      b.classList.add('is-dragging');
      e.preventDefault();
    });
    root.addEventListener('pointermove', function (e) {
      if (!box || !sh) return;
      var r = box.getBoundingClientRect();
      sh.fx = Math.min(1, Math.max(0, fx0 - (e.clientX - sx) / r.width));
      sh.fy = Math.min(1, Math.max(0, fy0 - (e.clientY - sy) / r.height));
      var img = box.querySelector('img');
      if (img) img.style.objectPosition = (sh.fx * 100).toFixed(1) + '% ' + (sh.fy * 100).toFixed(1) + '%';
    });
    root.addEventListener('pointerup', function () {
      if (box) box.classList.remove('is-dragging');
      box = null; sh = null;
    });
  })();

  /* Step one is a single centred card; step two is a split screen. Repainting alone
     teleports the card across the page and pops the panel into existence. FLIP turns
     that into one movement: measure where the card sat, let the repaint happen, then
     play it from the old position to the new one while the panel slides in from the
     right edge behind it. Movement only, no fades, so nothing has to be waited for. */
  var REDUCED = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SLIDE = 520;

  function advance() {
    var wasSolo = step === 0;
    if (!wasSolo || REDUCED) { step++; paint(); return; }

    var movers = ['#ukRail', '.ukStart_ask'];
    var before = movers.map(function (sel) {
      var el = root.querySelector(sel);
      return el ? el.getBoundingClientRect().left : null;
    });

    step++;
    paint();

    movers.forEach(function (sel, i) {
      var el = root.querySelector(sel);
      if (!el || before[i] === null) return;
      var dx = before[i] - el.getBoundingClientRect().left;
      if (!dx) return;
      el.style.transition = 'none';
      el.style.transform = 'translate3d(' + dx.toFixed(1) + 'px,0,0)';
      requestAnimationFrame(function () {
        el.style.transition = 'transform ' + SLIDE + 'ms cubic-bezier(.22,.61,.36,1)';
        el.style.transform = 'translate3d(0,0,0)';
      });
      setTimeout(function () { el.style.transition = ''; el.style.transform = ''; }, SLIDE + 90);
    });

    var pane = root.querySelector('.ukStart_pane');
    if (pane) {
      pane.classList.add('is-sliding');
      setTimeout(function () { pane.classList.remove('is-sliding'); fitGlobe(); }, SLIDE + 90);
    }
  }

  function paint(keepFocus) {
    paintRail();
    /* step one has no panel, so the column runs to the middle of the page instead */
    root.classList.toggle('ukStart--solo', step === 0);
    /* the final step's panel is content, not decoration, so it stacks on narrow
       widths instead of being hidden the way the globe panel is */
    root.classList.toggle('ukStart--ann', step === 3);
    parkGlobe();
    stage.innerHTML = (step === 0 ? stepOne() : step === 1 ? stepCity() :
                       step === 2 ? stepTwo() : stepThree()) +
                      (f.cropIx !== null && f.cropIx !== undefined ? cropEditor() : '');
    placeGlobe();
    /* step 2 shows the listing card instead, so the globe sits that one out */
    if (step === 1 && window.UKCITYMAP) {
      window.UKCITYMAP.show({ city: f.city, people: availableNear(f.city) || [], radiusKm: REACH_KM });
    }
    root.querySelectorAll('[data-icon]').forEach(function (el) {
      if (el.firstChild) return;
      el.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
        ((window.UKICONS || {})[el.dataset.icon] || '') + '</svg>';
      el.classList.add('ukIco', 'ukIco--on');
    });
    if (keepFocus) {
      var el = document.getElementById(keepFocus);
      if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
    }
  }

  /* Real files, read locally into data URLs. Nothing is uploaded anywhere yet; when
     there is a storage layer this is the one place that changes. */
  /* ---------- room photos ----------
     Every listing photo is cropped to one ratio before it is ever shown. A grid of
     phone photos at whatever aspect they happened to be shot at is the difference
     between a listing that looks run and one that looks abandoned, and the creator
     side renders these in fixed tiles either way. The crop is centred to start with
     and the host can drag the focal point; the original is kept, so re-cropping
     never degrades. */
  /* See ukshots.js. */
  var SHOT_ADVICE = (window.UKSHOTS && window.UKSHOTS.ADVICE) ||
    'Landscape, 1600 \u00d7 1200 or larger. We crop to 4:3 for the listing.';
  function shotOut(sh) { return window.UKSHOTS ? window.UKSHOTS.out(sh) : (sh.out || sh.src); }
  function cropShot(sh, done) { window.UKSHOTS.cropShot(sh, done); }
  function takeFiles(fileList) { window.UKSHOTS.takeFiles(fileList, f, paint); }

  ['dragenter','dragover'].forEach(function (ev) {
    root.addEventListener(ev, function (e) {
      var t = e.target.closest('.ukShotAdd'); if (!t) return;
      e.preventDefault(); t.classList.add('is-over');
    });
  });
  ['dragleave','drop'].forEach(function (ev) {
    root.addEventListener(ev, function (e) {
      var t = e.target.closest('.ukShotAdd'); if (!t) return;
      e.preventDefault(); t.classList.remove('is-over');
      if (ev === 'drop' && e.dataTransfer) takeFiles(e.dataTransfer.files);
    });
  });

  root.addEventListener('change', function (e) {
    var input = e.target.closest('[data-shotin]');
    if (!input || !input.files || !input.files.length) return;
    takeFiles(input.files);
  });

  root.addEventListener('input', function (e) {
    var i = e.target.closest('[data-k]');
    if (!i) return;
    f[i.dataset.k] = i.value;
    /* typing again reopens the suggestions they had dismissed or chosen from */
    if (i.dataset.k === 'city') { f.picked = false; f.sugIx = -1; }
    paint(i.id);          // the mirror and the globe update live as the city is typed
  });

  /* The hint beside the button promises this, so it is wired before anything else:
     Enter on the property name is the same action as pressing Continue. */
  root.addEventListener('keydown', function (e) {
    if (e.target.closest && e.target.closest('[data-clip]') &&
        (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      e.target.closest('[data-clip]').click();
      return;
    }
    if (e.target.id === 'pname' && e.key === 'Enter') {
      e.preventDefault();
      if (f.name.trim()) advance();
      return;
    }
    if (e.target.id !== 'pcity') return;
    var opts = root.querySelectorAll('.ukLoc_opt');
    if (!opts.length) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      f.sugIx = (f.sugIx + (e.key === 'ArrowDown' ? 1 : -1) + opts.length) % opts.length;
      paint('pcity');
    } else if (e.key === 'Enter' && f.sugIx > -1) {
      e.preventDefault();
      pickCity(opts[f.sugIx].dataset.pick);
    } else if (e.key === 'Escape') {
      f.picked = true; f.sugIx = -1; paint('pcity');
    }
  });

  function pickCity(label) {
    f.city = label; f.picked = true; f.sugIx = -1;
    paint('pcity');
  }

  root.addEventListener('mousedown', function (e) {
    var o = e.target.closest('[data-pick]');
    if (o) { e.preventDefault(); pickCity(o.dataset.pick); }
  });

  root.addEventListener('click', function (e) {
    var rm = e.target.closest('[data-unshot]');
    if (rm) { f.photos.splice(+rm.dataset.unshot, 1); f.shotIx = 0; return paint(); }

    var arw = e.target.closest('[data-shot]');
    if (arw) { f.shotIx = shotIx() + (+arw.dataset.shot); return paint(); }

    var mb = e.target.closest('[data-annmenu]');
    if (mb) { f.annMenu = !f.annMenu; paint(); return; }

    var net = e.target.closest('[data-annnet]');
    if (net) { var k = net.dataset.annnet; f.annMenu = false; paint(); shareTo(k); return; }

    var act = e.target.closest('[data-annact]');
    if (act) {
      var how = act.dataset.annact;
      f.annMenu = false;
      paint();
      exportCard(root.querySelector('[data-annmenu]'), how);
      return;
    }
    /* anywhere else closes it */
    if (f.annMenu && !e.target.closest('.ukAnn_menu')) { f.annMenu = false; paint(); }

    var cr = e.target.closest('[data-crop]');
    if (cr) { f.cropIx = +cr.dataset.crop; return paint(); }
    if (e.target.closest('[data-cropcancel]')) { f.cropIx = null; return paint(); }
    if (e.target.closest('[data-cropsave]')) {
      var sh = f.photos[f.cropIx];
      f.cropIx = null;
      if (sh) { cropShot(sh, paint); return; }
      return paint();
    }

    /* A tile becomes the video only when it is asked for: eighty <video> elements
       on the step would preload eighty files nobody has clicked. One plays at a
       time, so a card is never a wall of moving pictures. */
    var clip = e.target.closest('[data-clip]');
    if (clip) {
      if (clip.querySelector('video')) {
        var vid = clip.querySelector('video');
        if (vid.paused) { stopClips(clip); vid.play(); } else { vid.pause(); }
        clip.classList.toggle('is-playing', !vid.paused);
        return;
      }
      stopClips(clip);
      var v = document.createElement('video');
      v.src = clip.dataset.clip;
      v.poster = clip.querySelector('img').src;
      v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'auto';
      v.setAttribute('playsinline', '');
      clip.appendChild(v);
      clip.classList.add('is-playing');
      v.play().catch(function () { clip.classList.remove('is-playing'); });
      return;
    }

    if (e.target.closest('[data-back]')) {
      if (step > 0) { step--; paint(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
      return;
    }
    if (e.target.closest('[data-next]')) {
      if (step < 3) { advance(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    }
  });

  paint();
})();
