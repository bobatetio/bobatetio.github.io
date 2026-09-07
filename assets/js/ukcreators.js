/* Ukreate — creator profile + Find Creators (grid / list / map).
   Overrides UKV.network from the first pass and adds UKV.creatorProfile.
   Map is a projected SVG, not a tile layer: see the build log for the swap to go live. */
(function () {
  var D = window.UK, V = window.UKV;
  if (!D || !V) return;

  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) {
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; }); };
  function img(src, alt, cls, eager) {
    return '<img class="' + (cls || '') + '" src="' + src + '" alt="' + esc(alt) + '"' +
           (eager ? '' : ' loading="lazy" decoding="async"') + '>';
  }
  function head(t, s) {
    return '<div class="ukPageHead"><h2>' + t + '</h2>' + (s ? '<p>' + s + '</p>' : '') + '</div>';
  }
  /* Read from the one shared platform list rather than hand-copied again — a
     hardcoded three-only version of this used to sit here and silently had no
     entry for Pinterest, so a creator whose second platform was Pinterest
     would have rendered as "undefined" the moment this map was consulted. */
  var PLAT = {};
  ((window.UKVOCAB && window.UKVOCAB.PLATFORMS) || []).forEach(function (p) { PLAT[p.k] = p.n; });

  /* ---------- map ----------
     Equirectangular projection onto a styled SVG canvas with a graticule.
     Markers are placed from real lat/lng, so positions and interaction are true. */
  function project(lat, lng) {
    return { x: (lng + 180) / 360 * 100, y: (90 - lat) / 180 * 100 };
  }
  function ukMap(points, opts) {
    opts = opts || {};
    var lines = '';
    for (var i = 1; i < 6; i++) lines += '<line x1="0" y1="' + (i*100/6) + '" x2="100" y2="' + (i*100/6) + '"/>';
    for (var j = 1; j < 12; j++) lines += '<line x1="' + (j*100/12) + '" y1="0" x2="' + (j*100/12) + '" y2="100"/>';
    return '<div class="ukMap' + (opts.tall ? ' ukMap--tall' : '') + '">' +
      '<svg class="ukMap_grid" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' +
        '<g class="ukMap_lines">' + lines + '</g></svg>' +
      '<ul class="ukMap_pins">' + points.map(function (p) {
        var c = project(p.lat, p.lng);
        return '<li class="ukMap_pin' + (p.on ? ' is-on' : '') + '" style="left:' + c.x.toFixed(2) + '%;top:' + c.y.toFixed(2) + '%">' +
          '<button type="button" ' + (p.id ? 'data-mappin="' + p.id + '"' : 'tabindex="-1" aria-hidden="true"') +
          ' aria-label="' + esc(p.label) + '" title="' + esc(p.label) + '">' +
          (p.img ? img(p.img, p.label, 'ukMap_face') : '<span class="ukMap_dot"></span>') +
          '</button><span class="ukMap_lb">' + esc(p.label) + '</span></li>';
      }).join('') + '</ul>' +
      '<p class="ukMap_note">' + (opts.note || 'Positions are real. Live tiles drop in behind these markers.') + '</p>' +
    '</div>';
  }

  /* Inviting from a profile: the hotel already knows who, so the only question
     left is which stay. Every stay shows what it has left, because inviting into
     a full stay is the one thing this flow must not let them do by accident. */
  function invitePicker(c, st) {
    if (st.inviteFor !== c.id) return '';
    var I = window.UKINVITE;
    return '<section class="ukPanel ukInvite"><div class="ukPanel_head">' +
      '<h3 class="ukPanel_title">Which stay are you inviting ' + esc(c.n.split(' ')[0]) + ' to?</h3>' +
      '<button class="ukGhost ukGhost--sm" type="button" data-invite-cancel>Cancel</button></div>' +
      '<p class="ukAsk">They will see the stay and the brief before they decide. If they accept, it goes ' +
      'straight into onboarding \u2014 you have already chosen them, so there is nothing left to approve.</p>' +
      '<ul class="ukInvite_l">' + D.stays.filter(function (s2) { return s2.status !== 'closed'; }).map(function (s2) {
        var inv = I.ensure(s2.id, s2.capacity || 1);
        var left = I.slotsLeft(inv);
        var already = I.stateFor(s2.id, c.id);
        var blocked = left === 0 || already === 'sent' || already === 'accepted';
        return '<li><label class="ukInvite_i' + (blocked ? ' is-off' : '') + '">' +
          '<input type="radio" name="ukInviteStay" class="ukSrOnly" value="' + s2.id + '"' +
            (blocked ? ' disabled' : '') + ' data-invite-stay>' +
          '<img class="ukInvite_img" src="' + esc(s2.img) + '" alt="">' +
          '<span class="ukInvite_b"><span class="ukInvite_n">' + esc(s2.t) + '</span>' +
          '<span class="ukInvite_m">' + s2.nights + ' nights \u00b7 ' +
            (already === 'accepted' ? 'already coming'
             : already === 'sent' ? 'already invited'
             : left === 0 ? 'full' : left + ' of ' + inv.capacity + ' slots left') + '</span></span>' +
        '</label></li>';
      }).join('') + '</ul>' +
      '<span class="ukHint" id="ukInviteHint" role="status" aria-live="polite"></span>' +
      '<button class="ukBtn" type="button" data-invite-send="' + c.id + '">Send the invitation</button>' +
    '</section>';
  }

  /* The tracked link belongs where the work is, not only in a reporting tab. */
  function trackedFor(c) {
    var row = (D.attribution || []).filter(function (r) { return r.who === c.id; })[0];
    if (!row) return '';
    return '<section class="ukPanel"><div class="ukPanel_head">' +
      '<h3 class="ukPanel_title">Their tracked link</h3></div>' +
      '<div class="ukTrackRow"><span class="ukTrackRow_l">Tracked link</span>' +
        '<code class="ukCode">' + esc(row.link) + '</code>' +
        '<button class="ukGhost" type="button" data-ack="Copied">Copy</button></div>' +
      '<div class="ukTrackRow"><span class="ukTrackRow_l">Discount code</span>' +
        '<code class="ukCode">' + esc(row.code) + '</code>' +
        '<button class="ukGhost" type="button" data-ack="Copied">Copy</button></div>' +
      /* same honesty as the collaboration panel: the link exists, the reporting
         behind it may not */
      window.UKTRACK.linkNote() +
      (D.trackingLive()
        ? '<button class="ukGhost ukCard_cta" type="button" data-tab="tracking" data-goto="roi">' +
          'Manage all links and codes</button>' : '') + '</section>';
  }

  var CHEV_ICON = '<svg class="ukDrop_car" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  var VIEW_ICON = {
    grid:'<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="3.5" width="7.5" height="7.5" rx="2.5" stroke="currentColor" stroke-width="1.5"/><rect x="13" y="3.5" width="7.5" height="7.5" rx="2.5" stroke="currentColor" stroke-width="1.5"/><rect x="3.5" y="13" width="7.5" height="7.5" rx="2.5" stroke="currentColor" stroke-width="1.5"/><rect x="13" y="13" width="7.5" height="7.5" rx="2.5" stroke="currentColor" stroke-width="1.5"/></svg>',
    list:'<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6.5h16M4 12h16M4 17.5h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    map:'<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m3.5 6.5 5.5-2 6 2 5.5-2v13l-5.5 2-6-2-5.5 2v-13Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M9 4.5v13M15 6.5v13" stroke="currentColor" stroke-width="1.5"/></svg>'
  };

  /* ---------- creator profile ----------
     Thin adapter now: build a normalised model off the hotel's roster
     record and hand it to window.UKPROFILE.render (ukprofile.js), the same
     function the creator side calls on itself. The tab shell, the section
     order, the channel switcher and the Rates tab all live there — this
     file's job is only to gather what the hotel already knows about this
     creator into the shape that renderer expects, plus the hotel-only
     actions (Hire, save, tracked link, invite picker) no creator ever sees. */
  function bestWorkFor(c) {
    /* The hotel side has never carried a per-creator work array the way
       D.me.work does on the creator's own side — only a small shared demo
       gallery (D.assets). [ASSUMPTION] rather than invent per-creator play
       counts with nothing behind them, the podium/format/save-rate cards
       that need real per-piece numbers are simply left off here; they were
       never on the hotel-facing page before this restructure either. A
       future pass wiring real per-creator asset data could turn these on. */
    return [];
  }
  function creatorProfile(st) {
    var c = D.creator(st.creator);
    var work = D.assets.slice(0, 6);
    var live = (D.collabs || []).filter(function (x) { return x.who === c.id && !x.passed; })[0];

    var m = {
      id: c.id, n: c.n, h: c.h, img: c.img, city: c.loc, niche: c.type,
      plats: c.plats || [],
      /* Read directly by creatorHead() (ukprofile.js), lifted verbatim from
         the original ukviews.js header — f (raw audience total), type/cats
         (category chips), markets ({n,cc} — real flags, not the map's lat/
         lng pins), free (availability text), resp (reply time). */
      f: c.f, type: c.type, cats: c.cats || [], markets: c.markets || [], free: c.free, makes: c.makes || [],
      verified: c.vetted, academyCert: c.academyCert, academyModules: c.academyModules || [],
      collabTypes: c.collabTypes || [], rates: c.rates || {},
      stats: { eng: c.eng, reach: c.reach, stays: c.stays, ontime: c.ontime, rating: c.rating, age: c.age, gender: c.gender, tops: c.tops },
      langs: c.langs,
      langsList: String(c.langs || '').split(',').map(function (x) { return x.trim(); }).filter(Boolean),
      reliability: { ontime: c.ontime, resp: c.resp, turn: c.turn },
      resp: c.resp,
      proof: c.proof,
      /* c.markets is c.been's own city names resolved to real flags
         (ukdata.js's MARKET table), same order, truncated to MAXP=5 — the
         exact source the header's "Covers" line already reads. Map pins get
         the same flags rather than a second, invented lookup; cities past
         MAXP show with no flag, same "say nothing" discipline as everywhere
         else in this file. */
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
      reachTrend: (D.trend || []).map(function (t, i) { return { k: t.m, v: Math.round((c.f / 1000) * (0.7 + i * 0.06)) }; }),
      bestWork: bestWorkFor(c), formatAvg: [], savesPer1000: null, bookingsByChannel: [],
      places: (c.been || []).map(function (b) {
        var mk = (c.markets || []).filter(function (x) { return x.n === b.n; })[0];
        return { city: b.n, lat: b.lat, lng: b.lng, id: c.id + '-' + b.n, cc: mk ? mk.cc : null };
      }),
      trackedHtml: trackedFor(c),
      /* 2c — already resolved to {img,video,t,byN} on the creator side
         (ukdiscover.js's syncPublic, via window.UKME) since this app has
         no MEDIA manifest of its own to resolve a media key against. */
      savedInspiration: c.savedInspiration || []
    };

    var actionsHtml =
      '<button class="ukStatusBadge_b is-go" type="button" data-invite-open="' + c.id + '">Hire this creator</button>' +
      '<button class="ukStatusBadge_b ukStatusBadge_b--ic' +
        (window.UKFAVS && window.UKFAVS.has('creators', c.id) ? ' is-on' : '') + '" type="button" ' +
        'data-fav="' + c.id + '" aria-pressed="' + !!(window.UKFAVS && window.UKFAVS.has('creators', c.id)) + '" ' +
        'title="Save this creator" aria-label="Save ' + esc(c.n) + '">' +
        V.favIcon(window.UKFAVS && window.UKFAVS.has('creators', c.id)) + '</button>';

    return invitePicker(c, st) + window.UKPROFILE.render(m, st, { mode: 'hotel', actionsHtml: actionsHtml });
  }

  /* ---------- find creators ---------- */
  var VIEWS = [{ id:'grid', t:'Grid' }, { id:'list', t:'List' }, { id:'map', t:'Map' }];

  /* Every narrower is a SET now, not one value. A hotel looking for someone who
     shoots wellness OR food, on Instagram OR TikTok, is asking a normal question,
     and one-at-a-time filters made them run the search three times. Within a
     filter the picks are OR; across filters they are AND. */
  function has(st, key) {
    var v = st[key];
    return Array.isArray(v) && v.length ? v : null;
  }
  function match(st) {
    var q = (st.q || '').toLowerCase();
    var niches = has(st, 'niche'), plats = has(st, 'plat'), makes = has(st, 'makes');
    var av = st.avail || 'all';
    return D.creators.filter(function (c) {
      if (q && (c.n + ' ' + c.loc + ' ' + c.type).toLowerCase().indexOf(q) < 0) return false;
      if (niches && !(c.cats || [c.type]).some(function (t) { return niches.indexOf(t) > -1; })) return false;
      if (plats && !(c.plats || []).some(function (p) { return plats.indexOf(p.k) > -1; })) return false;
      if (makes && !(c.makes || []).some(function (m) { return makes.indexOf(m) > -1; })) return false;
      if (av === 'now' && c.free.indexOf('Available') < 0) return false;
      if (av === 'fav' && !(window.UKFAVS && window.UKFAVS.has('creators', c.id))) return false;
      return true;
    });
  }

  /* What the closed menu says. One pick names itself; several are counted, because
     three content types spelled out in a button is a paragraph, not a label. */
  function pickLabel(sel, none, one, many) {
    if (!sel || !sel.length) return none;
    if (sel.length === 1) return one(sel[0]);
    return sel.length + ' ' + many;
  }
  /* A checkbox, not a tick that appears out of nowhere. The box is always drawn,
     so the row reads as something you can switch on before you have switched it
     on — an empty column gave no sign there was anything to click there. */
  var TICK_SM = '<span class="ukDropMenu_box" aria-hidden="true">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" ' +
    'stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg></span>';

  /* "Ask in plain English" used to live here as a page-local box (parseHotelAsk(),
     askChips(), the nlform/nlhost handlers below it). It has moved to the global
     header search — reachable from every screen, not just this one — and gained a
     confirm step before it ever opens Host a creator. See assets/js/ukask.js. */

  function network(st) {
    if (st.creator) return creatorProfile(st);
    var view = st.view || 'grid';
    var list = match(st);
    /* No 'all' sentinel in the list. It is a leftover from when this filter took
       one value, and with an explicit "All types" row rendered above the list it
       was printing that option twice. Built from cats rather than type, because
       cats is what match() actually filters on — a creator's second and third
       subjects were offerable but not selectable. */
    var types = D.creators.reduce(function (a, c) {
      (c.cats || [c.type]).forEach(function (t) { if (t && a.indexOf(t) < 0) a.push(t); });
      return a;
    }, []).sort();

    /* the invite action now lives on every card, so its picker has to render
       here as well as on a profile */
    var picker = st.inviteFor ? invitePicker(D.creator(st.inviteFor), st) : '';
    /* only offer a platform somebody on the roster actually posts on: a filter
       that can only ever return nothing is worse than no filter */
    var HAS = {};
    D.creators.forEach(function (c) { (c.plats || []).forEach(function (p) { HAS[p.k] = 1; }); });
    var PLATS = (V.PLATFORMS || []).filter(function (p) { return HAS[p.k]; });
    function platOf(k) { return PLATS.filter(function (p) { return p.k === k; })[0] || null; }
    function platName(k) { var m = platOf(k); return m ? m.n : k; }
    var niche = has(st, 'niche') || [], plat = has(st, 'plat') || [], makes = has(st, 'makes') || [];
    var avail = st.avail || 'all';
    /* only offer formats somebody actually declared */
    var MADE = {};
    D.creators.forEach(function (c) { (c.makes || []).forEach(function (m) { MADE[m] = 1; }); });
    var MAKES = ((window.UKVOCAB || {}).FORMATS || []).filter(function (m) { return MADE[m]; });

    /* The ask bar comes down out of the top bar and becomes this page's search:
       on a page whose whole job is finding someone, one input should do it, and
       two search fields stacked above each other is a worse answer than one that
       understands a sentence. The shell moves the mounted bar into this slot.  */
    return head('Creators', 'Vetted travel creators, ranked by what they have actually delivered.') +
      picker +
      '<div class="ukCrFind" data-ask-slot></div>' +
      '<div class="ukToolbar ukToolbar--split ukCrBar">' +
        '<div class="ukCrBar_l">' +
          /* Availability leads: "can they even come" decides more searches than
             what they shoot does. */
          /* All, Available, Saved. "Any time" was describing a filter that was
             not on rather than naming the set you are looking at. */
          '<div class="ukFilters ukFilters--tabs" role="group" aria-label="Which creators">' +
            [['all','All'],['now','Available'],['fav','Saved']].map(function (a) {
              var on = avail === a[0];
              var n = a[0] === 'fav' && window.UKFAVS ? window.UKFAVS.count('creators') : 0;
              return '<button class="ukFilter' + (on ? ' is-on' : '') + '" type="button" ' +
                'aria-pressed="' + on + '" data-avail="' + a[0] + '"><span class="ukFilter_lb">' + a[1] + '</span>' +
                (a[0] === 'fav' && n ? '<span class="ukFilter_ct">' + n + '</span>' : '') + '</button>';
            }).join('') + '</div>' +

          '<span class="ukCrBar_gap" aria-hidden="true"></span>' +

          /* what they deliver, from the onboarding's own format list */
          '<div class="ukDrop"><button class="ukDrop_b" type="button" data-drop-toggle ' +
            'aria-haspopup="menu" aria-expanded="false">' +
            '<span class="ukDrop_k">They make</span>' +
            '<span class="ukDrop_v">' + esc(pickLabel(makes, 'Any format',
              function (m) { return m; }, 'formats')) + '</span>' +
            CHEV_ICON + '</button>' +
            '<div class="ukDropMenu ukDropMenu--multi" hidden role="menu">' +
              '<button class="ukDropMenu_i' + (makes.length ? '' : ' is-sel') + '" role="menuitemcheckbox" ' +
                'aria-checked="' + !makes.length + '" data-makes="all">' + TICK_SM + 'Any format</button>' +
              MAKES.map(function (m) {
                var on = makes.indexOf(m) > -1;
                return '<button class="ukDropMenu_i' + (on ? ' is-sel' : '') + '" role="menuitemcheckbox" ' +
                  'aria-checked="' + on + '" data-makes="' + esc(m) + '">' + TICK_SM + esc(m) + '</button>';
              }).join('') +
            '</div></div>' +

          /* what they shoot: too many to sit in a row, so it is a menu */
          '<div class="ukDrop"><button class="ukDrop_b" type="button" data-drop-toggle ' +
            'aria-haspopup="menu" aria-expanded="false">' +
            '<span class="ukDrop_k">Content type</span>' +
            '<span class="ukDrop_v">' + esc(pickLabel(niche, 'All types',
              function (t) { return t; }, 'types')) + '</span>' +
            CHEV_ICON + '</button>' +
            '<div class="ukDropMenu ukDropMenu--multi" hidden role="menu">' +
              '<button class="ukDropMenu_i' + (niche.length ? '' : ' is-sel') + '" role="menuitemcheckbox" ' +
                'aria-checked="' + !niche.length + '" data-niche="all">' + TICK_SM + 'All types</button>' +
              types.map(function (t) {
                var on = niche.indexOf(t) > -1;
                return '<button class="ukDropMenu_i' + (on ? ' is-sel' : '') + '" role="menuitemcheckbox" ' +
                  'aria-checked="' + on + '" data-niche="' + esc(t) + '">' + TICK_SM + esc(t) + '</button>';
              }).join('') +
            '</div></div>' +

          /* Platforms carry their mark in the menu AND in the closed button: the
             logo is the thing you recognise, and hiding it once a choice is made
             threw away the fastest way to read what the filter is set to. */
          '<div class="ukDrop"><button class="ukDrop_b" type="button" data-drop-toggle ' +
            'aria-haspopup="menu" aria-expanded="false">' +
            '<span class="ukDrop_k">Platform</span>' +
            /* One pick is named, because the name is short and useful. Beyond that
               the marks say it faster than words do, and past three they are
               counted in a badge rather than listed — "6 platforms" spelled out
               told you a number you could already see. */
            '<span class="ukDrop_v">' +
              (plat.length
                ? '<span class="ukDrop_marks">' + plat.slice(0, 3).map(function (k) {
                    var m = platOf(k);
                    return m ? '<img src="' + m.s + '" alt="' + esc(m.n) + '" title="' + esc(m.n) +
                      '" width="15" height="15" loading="lazy" decoding="async">' : '';
                  }).join('') +
                  (plat.length > 3
                    ? '<span class="ukDrop_more" title="' + esc(plat.slice(3).map(platName).join(', ')) +
                      '">+' + (plat.length - 3) + '</span>'
                    : '') +
                  '</span>' +
                  (plat.length === 1 ? esc(platName(plat[0])) : '')
                : 'All platforms') +
            '</span>' + CHEV_ICON + '</button>' +
            '<div class="ukDropMenu ukDropMenu--multi" hidden role="menu">' +
              /* the same tick and mark columns as the rows under it, so its label
                 starts on their line rather than floating in from the left */
              '<button class="ukDropMenu_i ukDropMenu_i--ic' + (plat.length ? '' : ' is-sel') + '" ' +
                'role="menuitemcheckbox" aria-checked="' + !plat.length + '" data-plat="all">' + TICK_SM +
                '<span class="ukDropMenu_gap" aria-hidden="true"></span>All platforms</button>' +
              PLATS.map(function (pp) {
                var on = plat.indexOf(pp.k) > -1;
                return '<button class="ukDropMenu_i ukDropMenu_i--ic' + (on ? ' is-sel' : '') + '" ' +
                  'role="menuitemcheckbox" aria-checked="' + on + '" data-plat="' + pp.k + '">' + TICK_SM +
                  '<img src="' + pp.s + '" alt="" width="16" height="16" loading="lazy" decoding="async">' +
                  esc(pp.n) + '</button>';
              }).join('') +
            '</div></div>' +
        '</div>' +
        /* the layout switch sits farthest right, as it does on collaborations */
        '<div class="ukSeg ukSeg--ic" role="group" aria-label="View">' + VIEWS.map(function (v) {
          var on = v.id === view;
          return '<button class="ukSeg_b' + (on ? ' is-on' : '') + '" type="button" data-view="' + v.id +
            '" aria-pressed="' + on + '">' + (VIEW_ICON[v.id] || '') + '<span>' + v.t + '</span></button>';
        }).join('') + '</div>' +
      '</div>' +

      (!list.length ? noneFound(st)
        : view === 'list' ? asList(list)
        : view === 'map'  ? asMap(list, st)
        : asGrid(list, st));
  }

  function noneFound(st) {
    var loose = st.avail === 'fav' ? 'saved' :
                has(st, 'makes') ? 'what they make' :
                has(st, 'niche') ? 'content type' :
                has(st, 'plat')  ? 'platform' :
                st.avail === 'now' ? 'availability' : 'search';
    return '<div class="ukPanel ukStub"><div class="ukEmpty">' +
      '<p class="ukEmpty_t">Nobody matches all of that</p>' +
      '<p class="ukEmpty_p">The network has ' + D.creators.length + ' vetted creators. Loosening the ' + loose +
      ' filter usually brings a few back.</p>' +
      '<button class="ukBtn" type="button" data-clearf>Clear filters</button></div></div>';
  }

  /* the one shared creator card, so this grid, the creator's own onboarding
     preview and the collaboration thread all show the same object */
  function asGrid(list, st) {
    var pg = V.paginate(list, (st || {}).pgCr, 12, 'pgCr');
    return '<div class="ukCrGrid">' + pg.rows.map(function (c, i) {
      return V.creatorCard(c, i);
    }).join('') + '</div>' + pg.nav + V.crPopup(st || {});
  }

  function asList(list) {
    return '<div class="ukPanel ukTableWrap"><table class="ukTable">' +
      '<thead><tr><th scope="col">Creator</th><th scope="col">Content type</th><th scope="col">Reach</th>' +
      '<th scope="col">Engagement</th><th scope="col">On time</th><th scope="col">Stays</th>' +
      '<th scope="col">From</th>' +
      '<th scope="col">Available</th></tr></thead><tbody>' +
      list.map(function (c) {
        var rateVals = Object.keys(c.rates || {}).map(function (k) { return c.rates[k]; })
          .filter(function (v) { return v || v === 0; });
        var fromRate = rateVals.length ? Math.min.apply(null, rateVals) : null;
        return '<tr data-creator="' + c.id + '" tabindex="0" role="button" aria-label="Open ' + esc(c.n) + '&rsquo;s profile">' +
          '<th scope="row"><span class="ukTable_who">' + img(c.img, c.n, 'ukAv') +
            '<span><span class="ukTable_n">' + esc(c.n) + '</span>' +
            '<span class="ukTable_s">' + esc(c.loc) + '</span></span></span></th>' +
          '<td>' + esc(c.type) + '</td>' +
          '<td>' + esc(c.reach) + '</td>' +
          '<td><strong>' + c.eng + '</strong></td>' +
          '<td>' + c.ontime + '%</td>' +
          '<td>' + c.stays + '</td>' +
          '<td>' + (fromRate != null ? '$' + D.fmt(fromRate) : '—') + '</td>' +
          '<td>' + esc(c.free) + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  }

  function asMap(list, st) {
    var sel = st.pin && list.some(function (c) { return c.id === st.pin; }) ? st.pin : null;
    /* Only creators the roster actually has coordinates for can be drawn. Saying
       so is better than silently showing eleven pins for twenty-eight people. */
    var placed = list.filter(function (c) { return c.lat && c.lng; });
    var pts = placed.map(function (c) {
      var m = (c.markets || [])[0];
      return { id:c.id, lat:c.lat, lng:c.lng, name:c.n, sub:c.loc, cc:(m && m.cc) || null,
               on: c.id === sel };
    });
    return '<div class="ukHybrid">' +
      '<div class="ukHybrid_map">' +
        '<div class="ukMapSlot ukMapSlot--tall" data-crmap=\'' + JSON.stringify(pts).replace(/'/g, '&#39;') + '\'></div>' +
        '<p class="ukMap_note">' + placed.length + ' of ' + list.length +
          ' matching creators are placed. Select anyone to bring them to the front.</p>' +
      '</div>' +
      '<div class="ukHybrid_side">' + list.map(function (c) {
        var av = V.availOf(c);
        var plats = (c.plats || []).filter(function (p) { return V.PLAT_MARK[p.k]; });
        var rateVals = Object.keys(c.rates || {}).map(function (k) { return c.rates[k]; })
          .filter(function (v) { return v || v === 0; });
        var fromRate = rateVals.length ? Math.min.apply(null, rateVals) : null;
        return '<article class="ukMini' + (c.id === sel ? ' is-on' : '') + '" data-mappin="' + c.id + '" ' +
          'tabindex="0" role="button" aria-label="Highlight ' + esc(c.n) + '">' +
          '<span class="ukCrAv ukMini_av">' + img(c.img, c.n, '', false) +
            '<span class="ukCrAv_dot ' + av.c + '" title="' + esc(av.t) + '" role="img" aria-label="' + esc(av.t) + '"></span>' +
          '</span>' +
          '<div class="ukMini_b">' +
            '<p class="ukMini_n">' + esc(c.n) +
              (window.ukCredMarks ? window.ukCredMarks(c) : '') + '</p>' +
            '<p class="ukMini_m">' + esc(c.loc) + '</p>' +
            '<p class="ukMini_s">' + esc(c.eng) + ' engagement &middot; ' + c.stays + ' stays' +
              (fromRate != null ? ' &middot; from $' + D.fmt(fromRate) : '') + '</p>' +
          '</div>' +
          '<span class="ukCrPlats ukMini_pl">' + plats.map(function (p) {
            return '<img class="ukCrPlat" src="' + V.PLAT_MARK[p.k] + '" alt="' + esc(p.n) +
              '" title="' + esc(p.n) + '" loading="lazy" decoding="async">';
          }).join('') + '</span>' +
          (c.id === sel ? '<div class="ukMini_act">' +
            '<button class="ukBtn ukBtn--sm" type="button" data-invite-open="' + c.id + '">Invite creator</button>' +
            '<button class="ukGhost ukGhost--sm" type="button" data-creator="' + c.id + '">View profile</button>' +
          '</div>' : '') +
        '</article>';
      }).join('') + '</div></div>';
  }


  V.network = network;
  V.creatorProfile = creatorProfile;
})();
