/* Ukreate — hotel-side screen renderers.
   Assistant voice: every decision arrives with a recommendation and its reasoning.
   Media is first-class: every entity carries an image and every layout reserves room for it. */
window.UKV = (function () {
  var D = window.UK;

  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) {
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; }); };

  /* one helper so the warm stage voice is never written twice */
  function stageSay(st) { return st.mine ? st.sayMine : st.say; }

  /* `aside` is optional: when given, the headline keeps the left and the control
     sits at the far right of the same line. Every other caller is unaffected. */
  function head(t, s, aside) {
    var body = '<h2>' + t + '</h2>' + (s ? '<p>' + s + '</p>' : '');
    if (!aside) return '<div class="ukPageHead">' + body + '</div>';
    return '<div class="ukPageHead ukPageHead--split"><div class="ukPageHead_txt">' + body + '</div>' +
      '<div class="ukPageHead_aside">' + aside + '</div></div>';
  }
  function empty(t, p, cta) {
    return '<div class="ukPanel ukStub"><div class="ukEmpty">' +
      '<p class="ukEmpty_t">' + t + '</p><p class="ukEmpty_p">' + p + '</p>' +
      (cta || '') + '</div></div>';
  }
  /* lazy below the fold, eager for the first paint */
  function img(src, alt, cls, eager) {
    return '<img class="' + (cls || '') + '" src="' + src + '" alt="' + esc(alt) + '"' +
           (eager ? '' : ' loading="lazy" decoding="async"') + '>';
  }
  var plat = { ig:'Instagram', tt:'TikTok', yt:'YouTube' };
  /* A drawn tick, not the \u2713 glyph: the glyph is squat, sits on a font's
     metrics and changes shape with whatever font renders it. */
  var TICK = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';


  /* ---- pagination ----
     One helper for every long list, so page size and the control look the same
     wherever they appear. Returns the slice plus the control; when everything
     fits on one page the control renders as nothing rather than as a lonely
     disabled "1". */
  function paginate(list, page, per, key) {
    per = per || 12;
    var pages = Math.max(1, Math.ceil(list.length / per));
    var cur = Math.min(Math.max(1, page || 1), pages);
    var from = (cur - 1) * per;
    return {
      rows: list.slice(from, from + per),
      page: cur, pages: pages, total: list.length,
      nav: pages < 2 ? '' : pageNav(cur, pages, key, list.length, from, Math.min(from + per, list.length))
    };
  }
  function pageNav(cur, pages, key, total, from, to) {
    /* first, last, current and its neighbours — the rest collapse to an ellipsis
       so twenty pages do not produce twenty buttons */
    var nums = [];
    for (var i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || Math.abs(i - cur) <= 1) nums.push(i);
      else if (nums[nums.length - 1] !== '\u2026') nums.push('\u2026');
    }
    return '<nav class="ukPage" aria-label="Pagination">' +
      '<p class="ukPage_c">Showing ' + (from + 1) + '\u2013' + to + ' of ' + total + '</p>' +
      '<div class="ukPage_b">' +
        '<button class="ukPage_i" type="button" data-page="' + key + ':' + (cur - 1) + '"' +
          (cur === 1 ? ' disabled' : '') + ' aria-label="Previous page">&larr;</button>' +
        nums.map(function (n) {
          if (n === '\u2026') return '<span class="ukPage_e" aria-hidden="true">\u2026</span>';
          return '<button class="ukPage_i' + (n === cur ? ' is-on' : '') + '" type="button" ' +
            'data-page="' + key + ':' + n + '"' + (n === cur ? ' aria-current="page"' : '') + '>' + n + '</button>';
        }).join('') +
        '<button class="ukPage_i" type="button" data-page="' + key + ':' + (cur + 1) + '"' +
          (cur === pages ? ' disabled' : '') + ' aria-label="Next page">&rarr;</button>' +
      '</div></nav>';
  }

  /* A creator's name or face is always the way to their profile, on every screen.
     Wrapped rather than restyled so it works inside cards that are themselves
     clickable — the shell checks this before the card's own action. */
  function who(cr, inner, cls) {
    return '<span class="ukProfLink' + (cls ? ' ' + cls : '') + '" data-creator="' + cr.id + '" ' +
      'role="link" tabindex="0" title="Open ' + esc(cr.n) + '\u2019s profile" ' +
      'aria-label="Open ' + esc(cr.n) + '\u2019s profile">' + inner + '</span>';
  }
  /* read from the shared icon set (ukicons.js) so a glyph is never redrawn per screen */
  function ico(name) {
    var g = (window.UKICONS || {})[name];
    return g ? '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' + g + '</svg>' : '';
  }

  /* ============================ the creator card ============================
     One component, everywhere a creator is shown. It is the same card the
     creator builds during onboarding (.ukCrCard) and the same one
     the marketing site browses, so a creator sees the exact object a hotel will
     judge them by. Any surface that needs a creator renders this — the network
     grid, the collaboration thread — rather than inventing its own arrangement. */
/* One registry, the same eight the creator onboarding offers. Anything that shows
   or filters a platform mark reads it from here — a second hardcoded list of three
   is how a Snapchat creator ends up invisible in search. */
  /* the shared list — the creator onboarding offers these same eight, and this
     file used to keep its own copy of them */
  var PLATFORMS = ((window.UKVOCAB || {}).PLATFORMS || []).slice();
  var PLAT_MARK = {}, PLAT_NAME = {};
  PLATFORMS.forEach(function (p) { PLAT_MARK[p.k] = p.s; PLAT_NAME[p.k] = p.n; });
  /* the flag belongs to the country in their base, so it is read off that rather
     than stored twice */
  var CC = { Portugal:'pt', USA:'us', Mexico:'mx', Norway:'no', Japan:'jp',
             India:'in', SA:'za', Italy:'it', Morocco:'ma', Spain:'es', France:'fr', UK:'gb' };
  /* The flag for a place, from the country in its name. Used wherever a location
     is written out, so no list of places is missing them. */
  function flagFor(loc) {
    var cc = ccOf(loc);
    return cc ? '<img class="ukCrFlag" src="/assets/img/flags/' + cc + '.svg" alt="" ' +
      'loading="lazy" decoding="async">' : '';
  }

  function ccOf(loc) {
    var country = String(loc || '').split(',').pop().trim();
    return CC[country] || null;
  }
  /* free now, free soon, or not for a while — a colour alone is not a status, so
     every dot carries the same words in its label */
  function availOf(c) {
    var f = String(c.free || '');
    if (/now/i.test(f)) return { c:'is-now', t:'Available now' };
    var m = f.match(/(\d{1,2})\s+([A-Za-z]{3})/);
    if (!m) return { c:'', t:'Availability on request' };
    var soon = ['Jan','Feb','Mar','Apr'].indexOf(m[2]) > -1;
    return { c: soon ? 'is-soon' : 'is-later', t: 'Free ' + f.toLowerCase() };
  }

  /* The clips already in the project: ten UGC files and thirteen creator files.
     Counted, not assumed — an off-by-one here is a 404 in a card rather than a
     thrown error, so it fails quietly and looks like the video simply not working.
     // PLUG-IN POINT — real media. Swap for the creator's own uploads once there
     // is a media endpoint; nothing else in the card changes. */
  var CLIP_POOL = (function () {
    var out = [], n;
    for (n = 1; n <= 10; n++) out.push('/assets/video/ugc/ugc-' + (n < 10 ? '0' : '') + n + '.mp4');
    for (n = 1; n <= 13; n++) out.push('/assets/video/creators/creator-' + (n < 10 ? '0' : '') + n + '.mp4');
    return out;
  })();

  /* Card-length names for the longest words in the two vocabularies. This is
     rephrasing, not truncating: "Adventure" is a real label a reader can act on,
     where "Adventure & out…" is a broken one. The full name is what the filter
     menu and the "+N" popup show — this short form exists only where the row has
     to hold one line, which on a card it always does. */
  var TAG_SHORT = {
    'Adventure & outdoors':'Adventure',
    'Digital nomad & remote work':'Digital nomad',
    'Couples & honeymoon':'Couples',
    'Budget & backpacking':'Budget',
    'Eco & sustainable':'Eco',
    'Nightlife & events':'Nightlife',
    'Nature & wildlife':'Nature',
    'Food & drink':'Food',
    'Culture & city':'Culture',
    'Beach & islands':'Beach',
    'Mountain & ski':'Mountain',
    'Wellness & spa':'Wellness',
    'Luxury & design':'Luxury',
    'Family travel':'Family',
    'Road trips':'Road trips',
    'Solo travel':'Solo',
    'Long-form / YouTube':'Long-form',
    'Drone & aerial':'Drone',
    'UGC video':'UGC'
  };
  function shortTag(t) { return TAG_SHORT[t] || t; }

  var HEART_ICON_UNUSED = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.7-4.7-9.6-9.2C1 8.4 2.7 4.7 6.2 4.1c2-.4 3.9.5 5 2 1.1-1.5 3-2.4 5-2 3.5.6 5.2 4.3 3.7 7.7C19.7 16.3 12 21 12 21Z"/></svg>';

  /* The bookmark from the project's own icon pack, outline and solid. NOT a star:
     a star already means a rating on these cards — the 4.9 in the stats strip and
     the review stars — and NOT the old &#9829; glyph, which is squat and changes
     shape with whatever font renders it. A bookmark is what a shortlist is. */
  var FAV_OUT = '<svg class="ukFav_i" viewBox="0 0 17.5 19.505" aria-hidden="true"><path d="M0.75 16.75V2.75C0.75 1.64543 1.64543 0.75 2.75 0.75H14.75C15.8546 0.75 16.75 1.64543 16.75 2.75V16.75C16.75 18.3981 14.8685 19.3389 13.55 18.35L9.95 15.65C9.23889 15.1167 8.26111 15.1167 7.55 15.65L3.95 18.35C2.63153 19.3389 0.75 18.3981 0.75 16.75Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var FAV_SOL = '<svg class="ukFav_i" viewBox="0 0 16 18.0036" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 5.75V16C0 17.6481 1.88153 18.5889 3.2 17.6L6.8 14.9C7.51111 14.3667 8.48889 14.3667 9.2 14.9L12.8 17.6C14.1185 18.5889 16 17.6481 16 16V5.75H0ZM0 4.25H16V2C16 0.895431 15.1046 0 14 0H2C0.895431 0 0 0.895431 0 2V4.25Z" fill="currentColor"/></svg>';
  function favIcon(on) { return on ? FAV_SOL : FAV_OUT; }

  function creatorCard(c, i, opts) {
    opts = opts || {};
    var av = availOf(c);
    var cats = (c.cats && c.cats.length ? c.cats : [c.type]).filter(Boolean);
    /* Two names only share the row if they actually fit it. Measured on the pair
       rather than the first alone: "Wellness & spa" is short enough on its own
       but not next to "Luxury & design", and clipping both mid-word is worse
       than showing one and counting the rest. */
    var shown = (cats.length > 1 && (cats[0].length + cats[1].length) <= 26)
      ? cats.slice(0, 2) : cats.slice(0, 1);
    var extra = Math.max(0, cats.length - shown.length);
    var plats = (c.plats || []).filter(function (p) { return PLAT_MARK[p.k]; });
    var makes = (c.makes || []).slice(0, 5);

    /* The markets line names one place and counts the rest — the whole list has
       never fitted a card, and half a second market clipped mid-word reads worse
       than an honest "+3" you can open. */
    var markets = (c.markets || []).slice(0, 5);
    var lead = markets[0];
    var more = Math.max(0, markets.length - 1);

    /* Four frames always, so a creator with no work does not produce a shorter,
       oddly-compressed card in a grid beside creators who have some. The empty
       ones say they are empty rather than pretending to be content. */
    /* Each clip carries a real source, so it plays where it sits rather than
       throwing the reader into a lightbox. Which file a clip gets is derived from
       the creator and the slot, so a card shows the same four every time instead
       of reshuffling on each paint.
       // PLUG-IN POINT — real media. Swap CLIP_POOL for the creator's own uploads
       // once there is a media endpoint; nothing else here changes. */
    var work = (c.work || []).slice(0, 4);
    var seed = String(c.id).replace(/\D/g, '') | 0;
    var clips = [0,1,2,3].map(function (n) {
      if (!work[n]) return '<span class="ukCrClip ukCrClip--none" aria-hidden="true"></span>';
      var src = CLIP_POOL[(seed * 4 + n) % CLIP_POOL.length];
      return '<button class="ukCrClip" type="button" data-clip="' + src + '" ' +
        'aria-label="Play a clip by ' + esc(c.n) + '">' +
        img(work[n], '', '', i < 2 && n < 2) + playMark('ukCrPlay') + '</button>';
    }).join('');

    var stats = [
      ['Audience',   D.fmt(c.f)],
      ['Avg reach',  String(c.reach || '\u2014').replace(/\s*per post/, '')],
      ['Engagement', c.eng || '\u2014'],
      ['Rating',     c.rating ? c.rating.toFixed(1) : '\u2014', true],
      ['Stays',      c.stays != null ? String(c.stays) : '\u2014']
    ];
    var tag = opts.tag || 'article';

    return '<' + tag + ' class="ukCrCard' + (opts.cls ? ' ' + opts.cls : '') + '">' +
      '<div class="ukCrCard_top">' +
        '<span class="ukCrAv">' + img(c.img, c.n, '', i < 3) +
          '<span class="ukCrAv_dot ' + av.c + '" title="' + esc(av.t) + '" role="img" aria-label="' + esc(av.t) + '"></span>' +
        '</span>' +
        '<span class="ukCrCard_id">' +
          '<span class="ukCrCard_n">' + who(c, esc(c.n)) + (window.ukVetBadge ? window.ukVetBadge('ukCrVet') : '') + '</span>' +
          '<span class="ukCrCard_m">' +
            '<span class="ukCrCard_k">Covers</span>' +
            (markets.length
              ? capped(markets, 'markets:' + c.id, function (m) {
                  return '<span class="ukCrD_mkI">' +
                    (m.cc ? '<img class="ukCrFlag" src="/assets/img/flags/' + m.cc + '.svg" alt="" loading="lazy" decoding="async">' : '') +
                    esc(m.n) + '</span>';
                }, 1)
              : esc(c.loc)) +
          '</span>' +
          /* What they shoot and what they make sit with the name and the markets,
             not in a band of their own — they are part of the same introduction.
             One from each group, each shown whole, with the "+N" carrying the rest.
             The row wraps inside this column rather than clipping: there is no
             width at which "Adventure & outdoors" and "Long-form / YouTube" both
             fit here on one line, and half a word is not a label. */
          '<span class="ukCrTags">' +
            capped(cats, 'cats:' + c.id, function (t) {
              return '<span class="ukCrTag" title="' + esc(t) + '">' + esc(shortTag(t)) + '</span>'; }, 1) +
            (makes.length
              ? '<span class="ukCrTagSep" aria-hidden="true"></span>' +
                capped(makes, 'makes:' + c.id, function (t) {
                  return '<span class="ukCrTag ukCrTag--mk" title="' + esc(t) + '">' +
                    esc(shortTag(t)) + '</span>'; }, 1)
              : '') +
          '</span>' +
        '</span>' +
        '<span class="ukCrPlats">' + plats.map(function (p) {
          return '<img class="ukCrPlat" src="' + PLAT_MARK[p.k] + '" alt="' + esc(p.n) + '" title="' + esc(p.n) + '" loading="lazy" decoding="async">';
        }).join('') + '</span>' +
      '</div>' +
      /* A shortlist you keep for yourself. Never shown to the creator: one they
         could see would read as an offer. */
      (opts.actions === false ? '' : (function () {
        var on = window.UKFAVS && window.UKFAVS.has('creators', c.id);
        return '<button class="ukFav' + (on ? ' is-on' : '') + '" type="button" data-fav="' + c.id + '" ' +
          'aria-pressed="' + !!on + '" title="' + (on ? 'Remove from saved' : 'Save') + '" ' +
          'aria-label="' + (on ? 'Remove ' : 'Save ') + esc(c.n) + (on ? ' from saved' : '') + '">' +
          favIcon(on) +
        '</button>';
      })()) +

      '<span class="ukCrClips">' + clips + '</span>' +
      '<span class="ukCrStats">' + stats.map(function (s) {
        return '<span class="ukCrStat"><span class="ukCrStat_v">' +
          (s[2] ? '<img class="ukCrStar" src="/assets/img/fc/star.svg" alt="" width="11" height="11">' : '') +
          esc(s[1]) + '</span><span class="ukCrStat_l">' + esc(s[0]) + '</span></span>';
      }).join('') + '</span>' +
      (opts.actions === false ? '' :
        '<div class="ukCrCard_act">' +
          '<button class="ukBtn ukBtn--sm" type="button" data-invite-open="' + c.id + '">Invite creator</button>' +
          '<button class="ukGhost ukGhost--sm" type="button" data-creator="' + c.id + '">View profile</button>' +
        '</div>') +
      (opts.foot || '') +
    '</' + tag + '>';
  }

  /* ============================ dashboard ============================ */
  function dashboard() {
    if (D.hydrateLinked) D.hydrateLinked();
    var needsYou = D.collabs.filter(function (c) { return D.collabMine(c) && c.stage < 5; });
    var live = D.stays.filter(function (s) { return s.status === 'live'; });
    var ready = D.collabs.filter(function (c) { return c.stage === 4; });
    var active = D.collabs.filter(function (c) { return c.stage < 5; });
    var pick = D.creators[4];
    var t = D.roiTotals(D.attribution);
    var recent = D.assets.slice(0, 5);

    return (window.UKONBOARD ? window.UKONBOARD.checklist('hotel') : '') + head('Good morning, Robert',
      needsYou.length + ' collaborations need you, and a set of content has just landed.') +

      (ready.length ? (function () {
        var c = ready[0], cr = D.creator(c.who), n = (c.assets || []).length;
        return '<article class="ukHero">' +
          '<div class="ukHero_media">' + img(D.asset(c.assets[0]).img, 'Content delivered by ' + cr.n, 'ukHero_img', true) +
            '<span class="ukHero_count">' + n + ' new</span></div>' +
          '<div class="ukHero_body">' +
            '<p class="ukHero_eyebrow">Your content just landed</p>' +
            '<h3 class="ukHero_t">' + esc(cr.n) + ' delivered your ' + esc(D.stay(c.stay).t.toLowerCase()) + ' set</h3>' +
            '<p class="ukHero_p">Approve and it is yours in perpetuity, on every channel. It lands in your library the moment you do.</p>' +
            '<div class="ukHero_cta"><button class="ukBtn" type="button" data-goto="collabs" data-preset="4">Review the content</button>' +
            '<button class="ukGhost" type="button" data-goto="library">Open content library</button></div>' +
          '</div></article>';
      })() : '') +

      '<div class="ukKpis">' +
        dkpi('Content you own', D.owned().length, 'yours in perpetuity', 'library') +
        dkpi('Creators hosted', 4, 'all delivered on time', 'creators') +
        dkpi('Stays open', live.length, live.reduce(function (a, s) { return a + s.apps; }, 0) + ' creators applied', 'stays') +
        dkpi('Waiting on you', needsYou.length, needsYou.length ? 'oldest is 8 days' : 'nothing outstanding', 'collabs') +
        /* Both of these are attributed figures. ukdash.js replaces this whole view
           in the shipped app, but the fallback has to be as honest as the thing it
           falls back from, or the one time it renders is the one time we lie. */
        (D.trackingLive()
          ? dkpi('Direct bookings', t.bookings, D.money(t.revenue) + ' attributed', 'roi') +
            dkpi('Kept vs OTA', D.money(t.saved), 'on the same bookings', 'roi')
          : dkpi('Direct bookings', '&mdash;', 'booking tracking is not live', 'roi') +
            dkpi('Kept vs OTA', '&mdash;', 'nothing to compare yet', 'roi')) +
      '</div>' +

      '<div class="ukGrid ukGrid--dash">' +
        '<section class="ukPanel"><div class="ukPanel_head">' +
          '<h3 class="ukPanel_title">Active collaborations</h3>' +
          '<button class="ukPanel_more" type="button" data-goto="collabs">See all</button></div>' +
          '<ul class="ukList ukList--rows">' + active.map(function (c) {
            var cr = D.creator(c.who), mine = D.collabMine(c);
            return '<li data-goto="collabs" data-preset="' + c.stage + '">' +
              who(cr, img(cr.img, cr.n, 'ukAv'), 'ukProfLink--av') +
              '<span class="ukList_body">' + who(cr, esc(cr.n), 'ukList_name') +
              '<span class="ukList_meta">' + esc(D.stay(c.stay).t) + '</span></span>' +
              '<span class="ukTag ukTag--' + (mine ? 'you' : 'wait') + '">' + esc(D.collabSay(c)) + '</span></li>';
          }).join('') + '</ul>' +
        '</section>' +

        '<section class="ukPanel"><div class="ukPanel_head">' +
          '<h3 class="ukPanel_title">Worth hosting next</h3>' +
          '<button class="ukPanel_more" type="button" data-goto="creators">See the network</button></div>' +
          '<article class="ukSuggest">' + img(pick.img, pick.n, 'ukSuggest_img') +
            '<div><h4 class="ukSuggest_n">' + esc(pick.n) + '</h4>' +
            '<p class="ukSuggest_m">' + esc(pick.type) + ' · ' + esc(pick.loc) + '</p>' +
            '<p class="ukSuggest_p">' + esc(pick.proof) + '</p>' +
            '<p class="ukWhy">Suggested because she matches your wellness positioning and is free now.</p>' +
            '<button class="ukGhost" type="button" data-creator="' + pick.id + '">View her profile</button></div>' +
          '</article>' +
          '<div class="ukRule"></div>' +
          '<p class="ukField_l">Or start from scratch</p>' +
          '<button class="ukBtn" type="button" data-goto="host" style="width:100%">Host a creator</button>' +
        '</section>' +
      '</div>' +

      '<section class="ukPanel"><div class="ukPanel_head">' +
        '<h3 class="ukPanel_title">Recently delivered</h3>' +
        '<button class="ukPanel_more" type="button" data-goto="library">Content library</button></div>' +
        '<div class="ukGallery ukGallery--strip">' + recent.map(function (a, i) {
          var cr = D.creator(a.by);
          return '<figure class="ukShot">' + img(a.img, a.t, 'ukShot_img', i < 3) +
            (a.k === 'video' ? '<span class="ukShot_play" aria-hidden="true">&#9654;</span>' +
             '<span class="ukShot_len">' + a.len + '</span>' : '') +
            '<figcaption class="ukShot_meta"><span class="ukShot_t">' + esc(a.t) + '</span>' +
            who(cr, esc(cr.n), 'ukShot_by') + '</figcaption></figure>';
        }).join('') + '</div>' +
      '</section>';
  }
  function dkpi(l, v, n, go) {
    return '<button class="ukKpi ukKpi--go" type="button" data-goto="' + go + '">' +
      '<span class="ukStat_label">' + l + '</span>' +
      '<span class="ukKpi_v">' + v + '</span><span class="ukStat_note">' + n + '</span></button>';
  }

  /* ============================ collaborations ============================ */
  /* The stay/campaign picker and the two-view switch are shared by both views,
     so neither drifts from the other when one gets touched. */
  var CHEV_ICON = '<svg class="ukStayFilter_car" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  function stayFilter(stayF) {
    var sel = stayF === 'all' ? null : D.stay(stayF);
    /* "All stays" is the whole property, so it carries the property's own
       picture — the same one the property profile uses — rather than a glyph. */
    var allImg = D.property.img;
    return '<div class="ukStayFilter"><button class="ukStayFilter_btn" data-stayf-toggle aria-haspopup="menu" aria-expanded="false" aria-label="Filter by stay">' +
      '<img class="ukStayFilter_img" src="' + esc(sel ? sel.img : allImg) + '" alt="">' +
      '<span class="ukStayFilter_val">' + (sel ? esc(sel.t) : 'All stays') + '</span>' + CHEV_ICON + '</button>' +
      '<div class="ukStayMenu" hidden role="menu">' +
        '<button class="ukStayMenu_i' + (stayF === 'all' ? ' is-sel' : '') + '" data-stayf="all" role="menuitem">' +
          '<img src="' + esc(allImg) + '" alt="" class="ukStayMenu_i_img">' +
          '<span class="ukStayMenu_i_txt">All stays</span></button>' +
        D.stays.map(function (stay) {
          return '<button class="ukStayMenu_i' + (stay.id === stayF ? ' is-sel' : '') + '" data-stayf="' + stay.id + '" role="menuitem">' +
            '<img src="' + esc(stay.img) + '" alt="" class="ukStayMenu_i_img">' +
            '<span class="ukStayMenu_i_txt">' + esc(stay.t) + '</span></button>';
        }).join('') +
      '</div></div>';
  }

  /* Drawn on the same 24 canvas at the same 1.5 stroke as the Hugeicons set the
     rest of the app uses, so they sit beside the nav icons without looking foreign.
     Cards is a stack of cards; board is columns of differing fill. */
  var VIEW_ICON = {
    cards:'<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<rect x="3.5" y="3.5" width="7.5" height="7.5" rx="2.5" stroke="currentColor" stroke-width="1.5"/>' +
      '<rect x="13" y="3.5" width="7.5" height="7.5" rx="2.5" stroke="currentColor" stroke-width="1.5"/>' +
      '<rect x="3.5" y="13" width="7.5" height="7.5" rx="2.5" stroke="currentColor" stroke-width="1.5"/>' +
      '<rect x="13" y="13" width="7.5" height="7.5" rx="2.5" stroke="currentColor" stroke-width="1.5"/></svg>',
    board:'<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<rect x="3.5" y="4.5" width="17" height="15" rx="3" stroke="currentColor" stroke-width="1.5"/>' +
      '<path d="M9.17 4.5v15M14.83 4.5v15" stroke="currentColor" stroke-width="1.5"/></svg>'
  };
  /* the design system's own view toggle (.ukSeg / .ukSeg_b), same as the
     creator network uses — only the icon and the track styling are new */
  function viewSwitch(cview) {
    return '<div class="ukSeg ukSeg--ic" role="group" aria-label="How collaborations are laid out">' +
      [['cards','Cards'],['board','Board']].map(function (v) {
        var on = cview === v[0];
        return '<button class="ukSeg_b' + (on ? ' is-on' : '') + '" type="button" data-cview="' + v[0] + '" ' +
          'aria-pressed="' + (on ? 'true' : 'false') + '">' + VIEW_ICON[v[0]] + '<span>' + v[1] + '</span></button>';
      }).join('') + '</div>';
  }

  function collabs(st) {
    if (D.hydrateLinked) D.hydrateLinked();
    if (st.thread) return collab(st);
    if (st.pitch) return pitchDetail(st);
    var cview = st.cview === 'board' ? 'board' : 'cards';
    var stayF = st.stayF || 'all';
    var visible = D.collabs.filter(function (c) { return !c.passed; });
    var scoped = visible.filter(function (c) { return stayF === 'all' || c.stay === stayF; });
    if (cview === 'board') return board(st, stayF, scoped);

    var f = stayF === 'all' ? (st.stageF == null ? '0' : String(st.stageF)) : (st.stageF == null ? null : String(st.stageF));
    var list = scoped.filter(function (c) {
      if (f === 'late') return D.isOverdue && D.isOverdue(c);
      return f == null || String(c.stage) === f;
    });
    /* the picker already names the stay, so the line never repeats it */
    var note = stayF === 'all'
      ? 'Every hosted stay in flight, from first inquiry through to sign-off.'
      : 'One stay, followed across every stage of the lifecycle.';

    return head('Collaborations', note, stayFilter(stayF) + viewSwitch(cview)) +
      '<div class="ukToolbar">' +
        '<div class="ukFilters ukFilters--tabs" role="tablist" aria-label="Filter by lifecycle stage">' +
          D.STAGES.map(function (stage, i) {
            var n = visible.filter(function (c) { return c.stage === i; }).length;
            return '<button class="ukFilter' + (f === String(i) ? ' is-on' : '') + '" type="button" role="tab" aria-selected="' + (f === String(i)) + '" data-stage="' + i + '">' +
              '<span class="ukFilter_lb">' + stage.short + '</span>' +
              (n ? '<span class="ukFilter_ct">' + n + '</span>' : '') + '</button>';
          }).join('') +
          /* Not a sixth stage — a flag on Creating. It sits at the end of the run
             because it is a way of slicing the same lifecycle, not a place after
             the end of it. */
          (function () {
            var lateN = visible.filter(function (c) { return D.isOverdue && D.isOverdue(c); }).length;
            if (!lateN && f !== 'late') return '';
            return '<button class="ukFilter ukFilter--late' + (f === 'late' ? ' is-on' : '') + '" ' +
              'type="button" role="tab" aria-selected="' + (f === 'late') + '" data-stage="late">' +
              '<span class="ukFilter_lb">Overdue</span>' +
              (lateN ? '<span class="ukFilter_ct">' + lateN + '</span>' : '') + '</button>';
          })() +
        '</div>' +
      '</div>' +
      /* Inquiry now holds two different things: someone applying to a stay you
         published, and someone pitching you with no stay attached. They are both
         "a creator wants to work with you", so they belong under one stage — but
         they need different actions, so they get a tab each. */
      (f === '0' ? (function () {
        var P = window.UKPITCHIN;
        var pitches = P ? P.forProperty().filter(function (x) { return x.state === 'open'; }) : [];
        var sub = st.inqSub === 'pitch' ? 'pitch' : 'stay';
        var stayN = visible.filter(function (c) { return c.stage === 0; }).length;
        return '<div class="ukSubTabs" role="tablist" aria-label="Kind of inquiry">' +
          '<button class="ukSubTab' + (sub === 'stay' ? ' is-on' : '') + '" type="button" role="tab" ' +
            'aria-selected="' + (sub === 'stay') + '" data-inqsub="stay">Stay inquiries' +
            (stayN ? ' <span class="ukSubTab_ct">' + stayN + '</span>' : '') + '</button>' +
          '<button class="ukSubTab' + (sub === 'pitch' ? ' is-on' : '') + '" type="button" role="tab" ' +
            'aria-selected="' + (sub === 'pitch') + '" data-inqsub="pitch">Creator pitches' +
            (pitches.length ? ' <span class="ukSubTab_ct">' + pitches.length + '</span>' : '') + '</button>' +
        '</div>';
      })() : '') +
      (stayF !== 'all' && f == null ? '<p class="ukStageNote" role="status">Showing every collaboration tied to ' + esc(D.stay(stayF).t) + '.</p>' : '') +
      (f === 'late' ? '<p class="ukStageNote" role="status">Past the date agreed in the brief, with nothing delivered yet. ' +
        'Most late work is late by days rather than gone \u2014 a reminder usually settles it.</p>' : '') +
      (function () {
        var pg = paginate(list, st.pgCollabs, 12, 'pgCollabs');
        list = pg.rows; st.__pgNav = pg.nav;
        return '';
      })() +
      (f === '0' && st.inqSub === 'pitch' ? pitchList(st) :
       list.length ? '<div class="ukBoard">' + list.map(function (c) {
        var cr = D.creator(c.who), stay = D.stay(c.stay), mine = D.collabMine(c);
        return '<article class="ukBoardCard" data-thread="' + c.id + '" tabindex="0" role="button" aria-label="Open collaboration with ' + esc(cr.n) + '">' +
          /* platform marks sit top right of the card, level with the name, exactly
             where the creator card puts them — not halfway down beside the facts */
          '<div class="ukBoardCard_top">' + who(cr, img(cr.img, cr.n, 'ukAv ukAv--lg'), 'ukProfLink--av') +
            '<div class="ukBoardCard_id"><h3 class="ukBoardCard_n">' + who(cr, esc(cr.n)) + '</h3>' +
            '<p class="ukBoardCard_m">' + esc(stay.t) + '</p></div>' +
            '<span class="ukCrPlats ukBoardCard_pl">' +
              (cr.plats || []).filter(function (p) { return PLAT_MARK[p.k]; }).map(function (p) {
                return '<img class="ukCrPlat" src="' + PLAT_MARK[p.k] + '" alt="' + esc(p.n) +
                  '" title="' + esc(p.n) + '" loading="lazy" decoding="async">';
              }).join('') + '</span>' +
          '</div>' +
          (c.stage > 0 ? track(c.stage, true) : inquiryFacts(cr)) +
          /* when the card carries the buttons, "Approve or pass" above two buttons
             labelled Approve and Pass is the same sentence twice */
          /* A card that carries Approve and Pass does not also need a badge saying
             the move is yours: the buttons are the sentence. The line only appears
             when there is nothing to press. */
          (cardActions(c)
            ? ''
            : '<p class="ukNext"><span class="ukNext_lb">' +
                (c.stage === 4 ? 'Done' : mine ? 'Your move' : 'With the creator') + '</span>' +
                '<span class="ukNext_say">' + esc(D.collabSay(c)) + '</span></p>') +
          (D.isOverdue && D.isOverdue(c)
            ? (function () {
                var n = D.daysLate(c);
                return '<p class="ukLate"><span class="ukLate_k">Overdue</span>' +
                  '<span class="ukLate_s">Content was due ' + esc(fmtDate(D.briefDeadline(c))) +
                  ', ' + n + (n === 1 ? ' day' : ' days') + ' ago</span></p>';
              })()
            : '') +
          cardPreview(c, cr, stay) + cardActions(c) +
        '</article>';
      }).join('') + '</div>' + (st.__pgNav || '') + crPopup(st)
        : empty('Nothing here right now', stayF === 'all'
            ? 'Switch to another stage to see what is moving.'
            : 'That stay has no collaborations in this slice of the lifecycle yet.'));
  }

  /* A pitch is an inquiry with no stay. The card says what the creator is
     offering and what they are asking for, and the hotel either builds a stay
     from it or passes — nothing is created until they decide. */
  function pitchList(st) {
    var P = window.UKPITCHIN;
    var rows = P ? P.forProperty().filter(function (x) { return x.state === 'open'; }) : [];
    if (!rows.length) {
      return empty('No pitches right now',
        'When a creator writes to you through Pitch Pilot it lands here, before there is a stay ' +
        'attached. You decide whether it is worth making one.');
    }
    return '<div class="ukBoard">' + rows.map(function (x, i) {
      var cr = D.creator(x.from);
      return '<article class="ukBoardCard ukBoardCard--pitch" data-pitchopen="' + esc(x.id) + '" ' +
        'tabindex="0" role="button" aria-label="Open ' + esc(x.fromName || 'this pitch') + '&rsquo;s pitch">' +
        '<div class="ukBoardCard_top">' +
          (cr ? who(cr, img(cr.img, cr.n, 'ukAv ukAv--lg'), 'ukProfLink--av') : '') +
          '<div class="ukBoardCard_id"><h3 class="ukBoardCard_n">' + esc(x.fromName || (cr && cr.n) || 'A creator') + '</h3>' +
          '<p class="ukBoardCard_m">Pitched you directly &middot; ' + esc(x.at) + '</p></div>' +
          (cr ? '<span class="ukCrPlats ukBoardCard_pl">' + (cr.plats || []).filter(function (pp) {
            return PLAT_MARK[pp.k]; }).map(function (pp) {
              return '<img class="ukCrPlat" src="' + PLAT_MARK[pp.k] + '" alt="' + esc(pp.n) + '" loading="lazy" decoding="async">';
            }).join('') + '</span>' : '') +
        '</div>' +
        '<p class="ukPitchIn_k">No stay attached yet</p>' +
        '<dl class="ukPitchIn">' +
          (x.angle ? '<div><dt>They want to shoot</dt><dd>' + esc(x.angle) + '</dd></div>' : '') +
          (x.offer ? '<div><dt>They will deliver</dt><dd>' + esc(x.offer) + '</dd></div>' : '') +
          (x.asks  ? '<div><dt>They are asking for</dt><dd>' + esc(x.asks) + '</dd></div>' : '') +
        '</dl>' +
        (x.note ? quotePreview(x.note, 'Their note') : '') +
        '<div class="ukCardAct">' +
          '<button class="ukCardAct_b is-go" type="button" data-pitchbuild="' + esc(x.id) + '">Build a stay from this</button>' +
          '<button class="ukCardAct_b" type="button" data-pitchpass="' + esc(x.id) + '">Pass</button>' +
        '</div>' +
      '</article>';
    }).join('') + '</div>';
  }

  /* A pitch opened. There is no thread yet — nothing has been agreed, so there is
     nothing to have a conversation in — so this is the pitch itself, the creator
     behind it, and the same two decisions. Approving means building a stay, which
     is the only thing that can turn this into a real collaboration. */
  function pitchDetail(st) {
    var P = window.UKPITCHIN;
    var x = P && P.byId(st.pitch);
    if (!x) return empty('That pitch is gone', 'It may have been passed on already.');
    var cr = D.creator(x.from);
    var P = window.UKPITCHIN;
    var msgs = P ? P.thread(x) : [];
    var b = (P && P.toBrief(x)) || {};
    var them = (x.fromName || (cr && cr.n) || 'them').split(' ')[0];

    /* THE header, not a summary of it. A pitch is the same object being introduced
       as an inquiry is, so it gets the same introduction: markets with flags, what
       they shoot, platform marks, languages, the full run of numbers, and the
       lifecycle band. The only thing that differs is the pair of buttons, because
       "Approve" would approve a stay that does not exist yet. */
    var ghost = { id:'pitch-' + x.id, who:x.from, stage:0, msgs:[], passed:false };

    return (cr ? creatorHead(ghost, cr, null, null, st, {
        badge: 'Pitched you',
        noTrack: true,
        actions: '<button class="ukStatusBadge_b is-go" type="button" data-pitchbuild="' + esc(x.id) + '">' +
                   'Build a stay</button>' +
                 '<button class="ukStatusBadge_b" type="button" data-pitchpass="' + esc(x.id) + '">Pass</button>'
      }) : '') +

      '<div class="ukGrid ukGrid--thread"><section class="ukFlow">' +
        '<section class="ukPanel ukFlowThread">' +
          '<div class="ukPanel_head"><h3 class="ukPanel_title">What they are proposing</h3>' +
            '<span class="ukCount">' + msgs.length + (msgs.length === 1 ? ' message' : ' messages') + '</span></div>' +
          /* Three facts, one row. They were a two-column grid, so the third
             dropped to a second line on its own and the row read as broken. */
          '<dl class="ukPitchIn ukPitchIn--row">' +
            (x.angle ? '<div><dt>They want to shoot</dt><dd>' + esc(x.angle) + '</dd></div>' : '') +
            (x.offer ? '<div><dt>They will deliver</dt><dd>' + esc(x.offer) + '</dd></div>' : '') +
            (x.asks  ? '<div><dt>They are asking for</dt><dd>' + esc(x.asks) + '</dd></div>' : '') +
          '</dl>' +
          '<div class="ukMsgs ukMsgs--pitch">' + msgs.map(function (m) {
            var mine = m.by === 'hotel';
            return '<article class="ukMsg' + (mine ? ' is-me' : '') + '">' +
              '<div class="ukMsg_head"><span class="ukMsg_who">' +
                (mine ? esc(D.property.name) : esc(x.fromName || (cr && cr.n) || 'Creator')) + '</span>' +
                '<span class="ukMsg_when">' + esc(m.at || '') + '</span></div>' +
              '<p class="ukMsg_tx">' + esc(m.tx) + '</p></article>';
          }).join('') + '</div>' +
          '<section class="ukComposer">' +
            '<label class="ukSrOnly" for="ukPitchReply">Reply to ' + esc(them) + '</label>' +
            '<textarea id="ukPitchReply" rows="3" placeholder="Ask a question, or tell ' + esc(them) +
              ' what you could offer"></textarea>' +
            '<div class="ukComposer_row"><div class="ukComposer_actions">' +
              '<p class="ukHint">Replying does not commit you to anything.</p></div>' +
              '<div class="ukComposer_send">' +
                '<button class="ukBtn ukBtn--sec" type="button" data-pitchreply="' + esc(x.id) + '">Send</button>' +
              '</div></div>' +
          '</section>' +
        '</section>' +
      '</section>' +

      '<aside class="ukSideCol">' +
        '<div class="ukStayGhost">' +
          '<p class="ukStayGhost_k">Not a stay yet</p>' +
          stayCard({
            id: 'pitch-' + x.id,
            t: (b.nights ? b.nights + (String(b.nights) === '1' ? ' night at ' : ' nights at ') : 'A stay at ') +
               D.property.name,
            img: D.property.img,
            nights: b.nights || '',
            rooms: D.property.cat,
            inc: b.inc || '',
            incList: b.incList || [],
            rights: 'Yours in perpetuity',
            del: Object.keys(b.del || {}).map(function (k) { return { t:k, q:b.del[k] }; })
          }, null, { eager:true, pop: st.stayPop,
            /* inside the card: the decision belongs to the thing it decides */
            foot: '<p class="ukStayGhost_p">Built from what ' + esc(them) + ' asked for. Nothing is ' +
                    'published, and every value is yours to change once you open it.</p>' +
                  '<div class="ukStayGhost_act">' +
                    '<button class="ukBtn ukBtn--sm" type="button" data-pitchbuild="' + esc(x.id) + '">Build a stay from this</button>' +
                    '<button class="ukGhost ukGhost--sm" type="button" data-pitchpass="' + esc(x.id) + '">Pass</button>' +
                  '</div>' }) +
        '</div>' +
      '</aside></div>';
  }

  /* ---- board: the whole lifecycle at once, one column per stage ----
     Column accents are not a new palette. They reuse the same three tag tokens
     the rest of the app already uses for whose move it is, so the colour still
     means something: gold is on you, teal is with the creator, grey is done. */
  function stageTone(i) {
    if (i === 4) return 'done';
    return D.STAGES[i].mine ? 'wait' : 'you';
  }
  var FLAG_ICON = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 21V4.5m0 0h11.2c.7 0 1 .8.6 1.3L15 9.4l2.8 3.6c.4.5.1 1.3-.6 1.3H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function kanCard(c) {
    var cr = D.creator(c.who), stay = D.stay(c.stay);
    var brief = D.packageBrief ? D.packageBrief(c) : (c.brief || {});
    var dates = D.packageDates ? D.packageDates(c) : (c.dates || {});
    var dels = (stay.del || []).map(function (d) { return d.q + ' ' + d.t; });
    var shown = dels.slice(0, 3), extra = dels.length - shown.length;
    var when = brief.deadline ? fmtDate(brief.deadline) : (dates.from ? fmtDate(dates.from) : '');
    var file = brief.file ? brief.file
      : (c.assets && c.assets.length ? c.assets.length + (c.assets.length === 1 ? ' file' : ' files') : '');

    return '<article class="ukKanCard" data-thread="' + c.id + '" tabindex="0" role="button" ' +
      'aria-label="Open collaboration with ' + esc(cr.n) + ' on ' + esc(stay.t) + '">' +
      '<h4 class="ukKanCard_t">' + esc(stay.t) + '</h4>' +
      '<div class="ukKanCard_chips">' + shown.map(function (d) {
        return '<span class="ukChip">' + esc(d) + '</span>'; }).join('') +
        (extra > 0 ? '<span class="ukChip">+' + extra + '</span>' : '') + '</div>' +
      '<div class="ukKanCard_rule"></div>' +
      '<p class="ukKanCard_row">' + who(cr, img(cr.img, cr.n, 'ukKanCard_av'), 'ukProfLink--av') +
        who(cr, esc(cr.n), 'ukKanCard_who') + '</p>' +
      (when ? '<p class="ukKanCard_row"><span class="ukKanCard_ic">' + FLAG_ICON + '</span>' +
        '<span class="ukKanCard_when">' + esc(when) + '</span></p>' : '') +
      (file ? '<span class="ukKanCard_file">' + CLIP_ICON + '<span>' + esc(file) + '</span></span>' : '') +
      cardActions(c) +
    '</article>';
  }

  function board(st, stayF, scoped) {
    var note = stayF === 'all'
      ? 'The whole lifecycle at once. Every collaboration sits in the stage it has reached.'
      : 'One stay, followed across every stage of the lifecycle.';

    return head('Collaborations', note, stayFilter(stayF) + viewSwitch('board')) +
      '<div class="ukKan" role="list">' + D.STAGES.map(function (stage, i) {
        var col = scoped.filter(function (c) { return c.stage === i; });
        return '<section class="ukKan_col" role="listitem" aria-label="' + esc(stage.short) + ', ' + col.length + '">' +
          '<div class="ukKan_head">' +
            '<span class="ukTag ukTag--' + stageTone(i) + '">' + esc(stage.short) + '</span>' +
            '<span class="ukKan_ct">' + col.length + '</span>' +
            (i === 0 ? '<button class="ukKan_add" type="button" data-goto="host" aria-label="Host a creator to open a new inquiry">+</button>' : '') +
          '</div>' +
          '<div class="ukKan_body">' +
            (col.length ? col.map(kanCard).join('')
              : '<p class="ukKan_none">Nothing at this stage.</p>') +
          '</div></section>';
      }).join('') + '</div>';
  }

  function truncate(tx, max) {
    tx = String(tx || '').trim();
    if (tx.length <= max) return tx;
    var cut = tx.slice(0, max);
    var sp = cut.lastIndexOf(' ');
    if (sp > max * 0.6) cut = cut.slice(0, sp);
    return cut.replace(/[,;:]$/, '') + '\u2026';
  }
  function msgsBy(msgs, who) { return (msgs || []).filter(function (m) { return m.by === who; }); }
  function lastOf(arr) { return arr.length ? arr[arr.length - 1] : null; }
  function quotePreview(tx, label) {
    return '<div class="ukPreview ukPreview--msg"><span class="ukPreview_q" aria-hidden="true">&#8220;</span>' +
      '<p class="ukPreview_tx"><span class="ukSrOnly">' + esc(label) + ': </span>' + esc(truncate(tx, 108)) + '</p></div>';
  }
  function emptyPreview(tx) {
    return '<div class="ukPreview ukPreview--empty"><p class="ukPreview_tx ukPreview_tx--muted">' + esc(tx) + '</p></div>';
  }
  function cardPreview(c, cr, stay) {
    var dates = D.packageDates ? D.packageDates(c) : (c.dates || {});
    var brief = D.packageBrief ? D.packageBrief(c) : (c.brief || {});
    if (c.stage >= 3 || c.stage === 4) {
      return c.assets && c.assets.length
        ? '<div class="ukPreview ukPreview--thumbs">' + c.assets.slice(0, 4).map(function (id) {
            return img(D.asset(id).img, D.asset(id).t, 'ukThumb'); }).join('') + '</div>'
        : emptyPreview('No content has landed yet.');
    }
    if (c.stage === 2) {
      var update = lastOf(msgsBy(c.msgs, 'them')) || lastOf(c.msgs || []);
      return update ? quotePreview(update.tx, 'Latest update') : emptyPreview('The creator has the package and the shoot is underway.');
    }
    if (c.stage === 1) {
      if (brief && brief.title) return quotePreview([brief.title, brief.deliverables].filter(Boolean).join(' — '), 'Final brief');
      if (dates.from && dates.to) {
        return '<div class="ukPreview ukPreview--dates"><span class="ukPreview_ic" aria-hidden="true">' + CAL_ICON + '</span>' +
          '<span class="ukPreview_dates">' + esc(fmtRange(dates.from, dates.to)) + '</span></div>';
      }
      return emptyPreview('The stay package is ready.');
    }
    var inquiry = lastOf(msgsBy(c.msgs, 'them'));
    return inquiry ? quotePreview(inquiry.tx, cr.n + ' wrote') : emptyPreview('No message on file yet.');
  }

  var CAL_ICON = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="15" rx="3" stroke="currentColor" stroke-width="1.5"/><path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  var CLIP_ICON = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 12.5 13.5 7a3 3 0 0 1 4.24 4.24L11 18a5 5 0 0 1-7.07-7.07L10.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var CAM_ICON = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2.5" y="7" width="14" height="11" rx="2.5" stroke="currentColor" stroke-width="1.5"/><path d="M16.5 10.7 21 8v9l-4.5-2.7" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>';
  var LINK_ICON = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M10 13.5a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1.2 1.2M14 10.5a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1.2-1.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

  function fmtDate(iso) {
    if (!iso) return '';
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
  }
  /* "20 Apr 2027 - 23 Apr 2027" says the month and the year twice and wraps, which
     on a card leaves "2027" alone on a line. Within one month it is "20-23 Apr
     2027"; within one year, "28 Apr - 3 May 2027". Only a range that really does
     cross a year spells both out. */
  function fmtRange(from, to) {
    var a = new Date(from), b = new Date(to);
    if (isNaN(a) || isNaN(b)) return fmtDate(from) + '\u2009\u2013\u2009' + fmtDate(to);
    var MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    if (a.getFullYear() === b.getFullYear()) {
      if (a.getMonth() === b.getMonth()) {
        return a.getDate() + '\u2013' + b.getDate() + ' ' + MON[b.getMonth()] + ' ' + b.getFullYear();
      }
      return a.getDate() + ' ' + MON[a.getMonth()] + '\u2009\u2013\u2009' +
             b.getDate() + ' ' + MON[b.getMonth()] + ' ' + b.getFullYear();
    }
    return fmtDate(from) + '\u2009\u2013\u2009' + fmtDate(to);
  }

  /* The badge says whose move it is. When that move is the hotel's, it stops
     describing the choice in words and simply offers it: the same badge, with the
     two decisions sitting where the sentence used to. Nothing else on the screen
     has to be reached to act. */
  function statusBadge(c, actions, label) {
    var mine = D.collabMine(c);
    /* label === false means the actions speak for themselves — on a profile,
       "Hire this creator" is the whole sentence and a status word in front of it
       is describing a collaboration that does not exist. */
    var lb = label === false ? '' : (label || (c.stage === 4 ? 'Done' : mine ? 'Your move' : 'With the creator'));
    /* opts.bare: on a profile these are just two controls. The pill around them
       exists to hold a status word beside them, and there is no status here. */
    return '<div class="ukStatusBadge' + (mine ? ' is-mine' : '') + (actions ? ' has-act' : '') +
      (label === false ? ' ukStatusBadge--bare' : '') + '"' +
      (actions ? '' : ' role="status"') + '>' +
      (lb ? '<span class="ukStatusBadge_lb">' + esc(lb) + '</span>' : '') +
      (actions
        ? '<span class="ukStatusBadge_act">' + actions + '</span>'
        : '<span class="ukStatusBadge_say">' + esc(D.collabSay(c)) + '</span>') +
    '</div>';
  }

  /* Two shapes for one thing. The card keeps the original dot-over-label run it
     always had; the thread's is the segmented bar — a cell per stage, label only,
     where the filled cell and the colour carry the state without a mark. */
  var TRACK_CHECK = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.6 6.35 4.85 8.6 9.4 3.75" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function track(stage, mini) {
    return '<ol class="ukTrack' + (mini ? ' ukTrack--mini' : '') + '">' + D.STAGES.map(function (stg, i) {
      var cls = i < stage ? 'is-done' : i === stage ? 'is-now' : '';
      return '<li class="' + cls + '"' + (i === stage ? ' aria-current="step"' : '') + '>' +
        (mini ? '<span class="ukTrack_dot">' + (i < stage ? TRACK_CHECK : '') + '</span>' : '') +
        '<span class="ukTrack_lb">' + stg.short + '</span></li>';
    }).join('') + '</ol>';
  }

  function threadEntry(m, c, cr) {
    var who = m.by === 'me' ? 'You' : esc(cr.n.split(' ')[0]);
    if (m.kind === 'dates' && m.dates) {
      var ttl = (m.dates.accepted || m.dates.finalized || m.dates.status === 'accepted') ? 'Stay dates locked in' : 'Dates proposed';
      return '<div class="ukEntry ukEntry--dates"><span class="ukEntry_ic">' + CAL_ICON + '</span>' +
        '<div class="ukEntry_b"><p class="ukEntry_t">' + ttl + '</p><p class="ukEntry_d">' + esc(fmtRange(m.dates.from, m.dates.to)) + '</p><p class="ukEntry_at">' + who + ' · ' + esc(m.at) + '</p></div></div>';
    }
    if (m.kind === 'brief' && m.brief) {
      var b = m.brief;
      return '<div class="ukEntry ukEntry--brief"><span class="ukEntry_ic">' + CLIP_ICON + '</span>' +
        '<div class="ukEntry_b"><p class="ukEntry_t">Brief finalised</p>' +
        (b.file || b.link
          ? '<p class="ukEntry_d">Attached ' + (b.file ? 'document: ' + esc(b.file) : 'link: ' + esc(b.link)) + '</p>'
          : '<p class="ukEntry_d">' + esc([b.title, b.deliverables].filter(Boolean).join(' — ')) + '</p>' + (b.notes ? '<p class="ukEntry_p">' + esc(b.notes) + '</p>' : '')) +
        '<p class="ukEntry_at">' + who + ' · ' + esc(m.at) + '</p></div></div>';
    }
    if (m.kind === 'guide' && m.guide) {
      return '<div class="ukEntry ukEntry--guide"><span class="ukEntry_ic">' + CLIP_ICON + '</span>' +
        '<div class="ukEntry_b"><p class="ukEntry_t">Guest guide shared</p><p class="ukEntry_d">' + esc(m.guide.prop) + '</p>' +
        '<details class="ukEntry_guide"><summary>View the guide</summary>' + (m.guide.sections || []).map(function (sec) {
          return '<div class="ukEntry_guideS"><p class="ukEntry_guideT">' + esc(sec.t) + '</p><p class="ukEntry_guideP">' + esc(sec.tx) + '</p></div>';
        }).join('') + '</details><p class="ukEntry_at">' + who + ' · ' + esc(m.at) + '</p></div></div>';
    }
    /* the creator's proof of posting, arriving from their side */
    if (m.kind === 'proof' && m.proof) {
      return '<div class="ukEntry ukEntry--aff"><span class="ukEntry_ic">' + LINK_ICON + '</span>' +
        '<div class="ukEntry_b"><p class="ukEntry_t">Posted live</p>' +
        '<p class="ukEntry_d">' + esc(m.proof.placement) + '</p>' +
        '<p class="ukEntry_d ukEntry_d--link"><a href="' + esc(m.proof.url) + '" target="_blank" rel="noopener">' +
          esc(m.proof.url) + '</a></p>' +
        '<p class="ukEntry_p">Their published post, tied to the tracked link for this stay.</p>' +
        '<p class="ukEntry_at">' + who + ' \u00b7 ' + esc(m.at) + '</p></div></div>';
    }
    if (m.kind === 'affiliate') {
      return '<div class="ukEntry ukEntry--aff"><span class="ukEntry_ic">' + LINK_ICON + '</span>' +
        '<div class="ukEntry_b"><p class="ukEntry_t">Affiliate link sent</p>' +
        '<p class="ukEntry_d ukEntry_d--link">' + esc(m.link) + '</p>' +
        '<p class="ukEntry_p">Attached to everything published from this stay, so bookings trace back automatically.</p>' +
        '<p class="ukEntry_at">' + who + ' · ' + esc(m.at) + '</p></div></div>';
    }
    if (m.kind === 'changereq') {
      /* the thumbnail is the point: you should see what you asked about,
         not a generic camera glyph standing in for it */
      var shots = (m.assets || []).map(function (id) { return D.asset(id); }).filter(Boolean);
      /* the thumbnail replaces the camera glyph when there is one — the point of
         the entry is which piece, and a generic icon does not say that */
      return '<div class="ukEntry ukEntry--change">' +
        (shots.length
          ? '<span class="ukEntry_icShot">' + img(shots[0].img, shots[0].t, '') +
            (shots[0].k === 'video' ? '<span class="ukEntry_icPlay" aria-hidden="true">&#9654;</span>' : '') + '</span>'
          : '<span class="ukEntry_ic">' + CAM_ICON + '</span>') +
        '<div class="ukEntry_b"><p class="ukEntry_t">Changes requested</p>' + (m.note ? '<p class="ukEntry_d">' + esc(m.note) + '</p>' : '') +
        (shots.length > 1 ? '<div class="ukEntry_shots">' + shots.slice(1).map(function (a) {
          return '<span class="ukEntry_shot">' + img(a.img, a.t, 'ukEntry_shotImg') +
            (a.k === 'video' ? '<span class="ukEntry_shotV" aria-hidden="true">&#9654;</span>' : '') +
            '<span class="ukEntry_shotT">' + esc(a.t) + '</span></span>';
        }).join('') + '</div>' : '') +
        '<p class="ukEntry_at">' + who + ' · ' + esc(m.at) + '</p></div></div>';
    }
    if (m.kind === 'pass') {
      return '<div class="ukEntry ukEntry--change"><span class="ukEntry_ic">' + CAM_ICON + '</span>' +
        '<div class="ukEntry_b"><p class="ukEntry_t">Passed for now</p><p class="ukEntry_d">This collaboration was closed at inquiry.</p>' +
        '<p class="ukEntry_at">' + who + ' · ' + esc(m.at) + '</p></div></div>';
    }
    return '<div class="ukMsg' + (m.by === 'me' ? ' is-me' : '') + '"><p class="ukMsg_tx">' + esc(m.tx || '').replace(/\n/g, '<br>') + '</p><p class="ukMsg_at">' + who + ' · ' + esc(m.at) + '</p></div>';
  }

  /* ---- one conversation, not a conversation plus a set of side panels ----
     Everything a stage needs — the stay package, the delivery to review, the
     note you are writing — happens in the thread, in order, the way it actually
     happened. Splitting the package out into its own box made the thread look
     like a log of a process happening somewhere else. */
  function threadPanel(c, cr, mode, st) {
    var n = c.msgs.length;
    return '<section class="ukPanel ukFlowThread" id="ukMsgPanel">' +
      '<div class="ukPanel_head"><h3 class="ukPanel_title">Conversation</h3>' +
      '<span class="ukCount">' + n + (n === 1 ? ' message' : ' messages') + '</span></div>' +
      (n
        ? '<div class="ukMsgs" id="ukMsgs">' + c.msgs.map(function (m) { return threadEntry(m, c, cr); }).join('') + '</div>'
        : '<div class="ukMsgs ukMsgs--empty" id="ukMsgs"><p class="ukEmpty_t">No messages yet</p><p class="ukEmpty_p">Say hello to your creator. A thoughtful line about why you chose them goes a long way.</p></div>') +
      composer(c, cr, mode, st) +
      '</section>';
  }

  function referenceDeck(c, stay, opts) {
    var dates = D.packageDates ? D.packageDates(c) : (c.dates || {});
    var brief = D.packageBrief ? D.packageBrief(c) : (c.brief || {});
    var guide = D.guideSnapshot ? D.guideSnapshot(c) : c.guide;
    /* what the hotel typed against this stay, which is what should be here */
    var stayGuide = (stay && stay.guide) || (c && c.stayGuide) || null;
    if (stayGuide && Object.keys(stayGuide).some(function (k) { return (stayGuide[k] || '').trim(); })) {
      guide = { sections: (D.GUIDE_SECTIONS || []).filter(function (sec) {
        return (stayGuide[sec.k] || '').trim();
      }).map(function (sec) { return { t: sec.t, tx: stayGuide[sec.k] }; }) };
    }
    var guideFilled = !!(guide && (guide.sections || []).length);
    var editBrief = !!(opts && opts.editBrief);
    return '<div class="ukReference">' +
      '<div class="ukReference_grid">' +
        '<div class="ukReference_block"><p class="ukReference_k">Dates</p><p class="ukReference_v">' + esc(fmtRange(dates.from, dates.to)) + '</p><p class="ukReference_s">' + stay.nights + ' nights · ' + esc(stay.rooms.toLowerCase()) + '</p></div>' +
        '<div class="ukReference_block"><p class="ukReference_k">The stay</p><p class="ukReference_s">' + esc(stay.inc) + '</p><p class="ukReference_s">' + esc(stay.del.map(function (d) { return d.q + ' × ' + d.t.toLowerCase(); }).join(', ')) + '</p></div>' +
      '</div>' +
      /* The block becomes the editor rather than growing one underneath it: the
         label changes, Done sits where Edit was, and closing it shows the same
         block with the new words in it. Two copies of the brief on screen at once
         — one to read, one to type into — is how you lose track of which is real. */
      '<div class="ukReference_block ukReference_block--brief">' +
        '<div class="ukReference_head">' +
          '<p class="ukReference_k">' + (editBrief ? 'Edit the brief before it goes' : 'Final brief') + '</p>' +
          '<button class="ukGhost ukGhost--sm" type="button" data-briefedit ' +
            'aria-expanded="' + editBrief + '">' + (editBrief ? 'Done' : 'Edit') + '</button>' +
        '</div>' +
        (editBrief
          ? briefFields(brief)
          : '<p class="ukReference_v ukReference_v--sm">' + esc(brief.title || 'Untitled brief') + '</p>' +
            '<ul class="ukReference_list">' +
              (brief.deliverables ? '<li><strong>Deliverables</strong><span>' + esc(brief.deliverables) + '</span></li>' : '') +
              (brief.deadline ? '<li><strong>Deadline</strong><span>' + esc(fmtDate(brief.deadline)) + '</span></li>' : '') +
              (brief.link ? '<li><strong>Link</strong><span>' + esc(brief.link) + '</span></li>' : '') +
              (brief.file ? '<li><strong>File</strong><span>' + esc(brief.file) + '</span></li>' : '') +
            '</ul>' +
            (brief.notes ? '<p class="ukReference_s ukReference_s--body">' + esc(brief.notes) + '</p>' : '')) +
      '</div>' +

      /* The guide the hotel wrote on this stay, already here. If they wrote one it
         is shown and can be edited; if they did not, this offers to add one rather
         than reporting an absence and leaving them to go and find where. */
      '<div class="ukReference_block">' +
        '<div class="ukReference_head"><p class="ukReference_k">Guest guide</p>' +
          '<button class="ukGhost ukGhost--sm" type="button" data-guideedit ' +
            'aria-expanded="' + !!(opts && opts.editGuide) + '">' +
            ((opts && opts.editGuide) ? 'Done' : (guideFilled ? 'Edit' : 'Add one')) + '</button></div>' +
        (opts && opts.editGuide
          ? '<div class="ukGuideFields ukGuideFields--thread">' + (D.GUIDE_SECTIONS || []).map(function (sec) {
              var cur = (stayGuide && stayGuide[sec.k]) || '';
              return '<label class="ukField ukField--sub"><span class="ukField_l">' + esc(sec.t) + '</span>' +
                '<textarea class="ukField_i ukField_ta" rows="2" data-cguide="' + sec.k + '" ' +
                  'placeholder="' + esc(sec.seed) + '">' + esc(cur) + '</textarea></label>';
            }).join('') + '</div>'
          : guideFilled
            ? '<details class="ukReference_guide"><summary>Open the guide</summary><div class="ukReference_sections">' +
                (guide.sections || []).map(function (sec) {
                  return '<div class="ukReference_sec"><p class="ukReference_secT">' + esc(sec.t) + '</p>' +
                    '<p class="ukReference_secP">' + esc(sec.tx) + '</p></div>';
                }).join('') + '</div></details>'
            : '<p class="ukReference_s">Nothing written for this stay yet. Add one and it goes with the package.</p>') +
      '</div>' +
    '</div>';
  }

  function briefFields(brief) {
    brief = brief || {};
    return '<label class="ukField"><span class="ukField_l">Title</span><input class="ukField_i" id="ukBriefTitle" value="' + esc(brief.title || '') + '" placeholder="e.g. Quiet weeks in April"></label>' +
      '<label class="ukField"><span class="ukField_l">Deliverables</span><input class="ukField_i" id="ukBriefDel" value="' + esc(brief.deliverables || '') + '" placeholder="e.g. 1 UGC video, 5 photos"></label>' +
      '<label class="ukField"><span class="ukField_l">Deadline</span><input class="ukField_i" type="date" id="ukBriefDeadline" value="' + esc(brief.deadline || '') + '"></label>' +
      '<label class="ukField"><span class="ukField_l">Notes</span><textarea class="ukField_i" id="ukBriefNotes" rows="4" placeholder="Personalise the listing for this creator">' + esc(brief.notes || '') + '</textarea></label>' +
      '<div class="ukBriefAlt"><p class="ukField_l">Optional link or file</p><div class="ukBriefAlt_row">' +
        '<label class="ukUpload">' + CLIP_ICON + '<span>Attach a PDF</span><input type="file" id="ukBriefFile" accept="application/pdf" hidden></label>' +
        '<input class="ukField_i" id="ukBriefLink" value="' + esc(brief.link || '') + '" placeholder="or paste a link">' +
      '</div></div>';
  }

  function composerPlain(c, cr, opts) {
    opts = opts || {};
    return '<section class="ukPanel ukComposer">' +
      (opts.note ? '<p class="ukAsk">' + opts.note + '</p>' : '') +
      '<label class="ukSrOnly" for="ukReply">Write a message to ' + esc(cr.n) + '</label>' +
      '<textarea id="ukReply" rows="3" placeholder="' + esc(opts.placeholder || 'Write a message') + '" aria-describedby="ukComposerLive"></textarea>' +
      '<div class="ukComposer_row">' +
        '<div class="ukComposer_actions">' + (opts.actions || '') + '</div>' +
        '<div class="ukComposer_send"><span class="ukHint" id="ukSendHint" role="status" aria-live="polite"></span><button class="ukBtn ukBtn--sec" type="button" data-send="' + c.id + '">' + esc(opts.send || 'Send') + '</button></div>' +
      '</div><div class="ukSrOnly" id="ukComposerLive" aria-live="polite">Composer updated for the current collaboration stage.</div></section>';
  }

  function composerApproveReview(c, cr, st) {
    st = st || {};
    var stay = D.stay(c.stay);
    return '<section class="ukPanel ukComposer ukComposer--reference"><div class="ukPanel_head"><h3 class="ukPanel_title">Approve and send the package</h3>' +
      '<button class="ukGhost ukGhost--sm" type="button" data-composer-cancel>Back</button></div>' +
      '<p class="ukAsk">This is the full package ' + esc(cr.n.split(' ')[0]) + ' will get: stay dates, ' +
        'your brief, and the guest guide. Everything is ready to send \u2014 edit anything you want to personalise.</p>' +
      referenceDeck(c, stay, { editBrief: st.editBrief, editGuide: st.editGuide }) +
      '<div class="ukComposer_row"><div class="ukComposer_actions"><button class="ukGhost ukGhost--sm" type="button" data-pass="' + c.id + '">Pass instead</button></div>' +
        '<div class="ukComposer_send"><span class="ukHint" id="ukApproveHint" role="status" aria-live="polite"></span><button class="ukBtn" type="button" data-approve-finalize="' + c.id + '">Approve and send</button></div></div></section>';
  }

  function composerInquiry(c, cr, mode, st) {
    if (mode === 'approve') return composerApproveReview(c, cr, st);
    /* Approve and Pass live in the status badge at the top of the page. Repeating
       them here gave the same decision two sets of controls on one screen. */
    return composerPlain(c, cr, {
      note:'Approve or pass from the top of this page.',
      placeholder:'Reply to the inquiry'
    });
  }

  /* The package is something you sent them, so it reads as something you sent
     them — an entry in the thread — and the composer under it is just the next
     message. */
  function composerOnboarding(c, cr) {
    return composerPlain(c, cr, {
      note:'Anything else they should know before they arrive?',
      placeholder:'Optional note about logistics, arrivals, or tone',
      send:'Send note'
    });
  }

  function composerCreating(c, cr) {
    return composerPlain(c, cr, {
      note:'Nothing to sign off here \u2014 they move this on when they start shooting.',
      placeholder:'Keep the thread warm with any logistics or access details'
    });
  }

  /* Real brand marks, never a hand-drawn substitute. */
  var PLAT_SRC = { ig:'/assets/img/brand/instagram.svg', tt:'/assets/img/brand/tiktok.svg', yt:'/assets/img/brand/youtube.svg' };
  /* The play mark from the onboarding clip strip: a filled disc with the triangle
     cut out of it, so it reads at 20px and at 60px and never sits on a plate the
     way a glyph in a circle does. One constant, used by every surface that plays
     something — there is no reason a video looks like a different object on the
     library page than it does in a thread. */
  var PLAY_PATH = 'M22 0C9.85 0 0 9.85 0 22s9.85 22 22 22 22-9.85 22-22S34.15 0 22 0Z' +
    'M17.6 16.8Q17.6 13.2 20.6 15.2L27.8 20Q30.8 22 27.8 24L20.6 28.8Q17.6 30.8 17.6 27.2L17.6 16.8Z';
  function playMark(cls) {
    return '<svg class="' + (cls || 'ukPlayMk') + '" viewBox="0 0 44 44" aria-hidden="true">' +
      '<path fill-rule="evenodd" clip-rule="evenodd" d="' + PLAY_PATH + '"/></svg>';
  }

  function platMark(k) {
    if (!k || !PLAT_SRC[k]) return '';
    return '<img class="ukPost_plat" src="' + PLAT_SRC[k] + '" alt="' + esc(plat[k] || '') + '" width="18" height="18">';
  }

  /* One delivered piece, shown the way it was actually published: a 9:16 frame
     carrying when it went out, where it went out, and the tracking link that
     was attached to it. */
  /* The caption sits over the bottom of the frame on a gradient rather than in a
     panel beneath it: the media is the thing, and a block of white under every
     tile was what made these read as spreadsheet rows. Approved work carries a
     plain green tick — not the vetted seal, which means something else. */
  function postCard(a, link, opts) {
    opts = opts || {};
    return '<figure class="ukPost' + (opts.done ? ' ukPost--done' : '') + '">' +
      '<div class="ukPost_m">' + img(a.img, a.t, 'ukPost_img', opts.eager) +
        '<span class="ukPost_scrim" aria-hidden="true"></span>' +
        (a.k === 'video'
          ? '<button class="ukPost_play" type="button" data-play="' + a.id + '" ' +
            'aria-label="Play ' + esc(a.t) + '">' + playMark() + '</button>' +
            '<span class="ukPost_len">' + a.len + '</span>'
          : '') +
        platMark(a.plat) +
        (opts.done ? '<span class="ukPost_ok" title="Approved" role="img" aria-label="Approved">' + TICK + '</span>' : '') +
        '<figcaption class="ukPost_b">' +
          '<span class="ukPost_t">' + esc(a.t) + '</span>' +
          '<span class="ukPost_when">' + esc(a.on) + (a.time ? ' &middot; ' + esc(a.time) : '') + '</span>' +
          (link ? '<span class="ukPost_link">' + LINK_ICON + '<span>' + esc(link) + '</span></span>' : '') +
        '</figcaption>' +
      '</div></figure>';
  }

  function composerReview(c, cr, mode) {
    var changes = c.contentStatus === 'changesRequested';
    var vids = (c.assets || []).filter(function (id) { return D.asset(id).k === 'video'; }).length;
    var pics = (c.assets || []).length - vids;
    var link = D.affiliateFor ? D.affiliateFor(c) : null;
    if (mode === 'message') return composerPlain(c, cr, { placeholder:'Write a message', actions:'<button class="ukGhost ukGhost--sm" type="button" data-composer-mode="review">Back to review</button>' });
    return '<section class="ukPanel ukComposer ukComposer--review"><div class="ukPanel_head"><h3 class="ukPanel_title">' + (changes ? 'Changes requested' : 'Review the delivery') + '</h3></div>' +
      '<p class="ukAsk">' + esc(cr.n.split(' ')[0]) + ' delivered ' + (vids ? vids + (vids === 1 ? ' video' : ' videos') : '') + (vids && pics ? ' and ' : '') + (pics ? pics + (pics === 1 ? ' photo' : ' photos') : '') + '. ' +
      (changes ? 'You have already asked for a small tweak. When the revised handover lands, review it here again.' : 'Approve and it is yours on every channel, forever. It lands in your content library the moment you do.') + '</p>' +
      (c.assets && c.assets.length ? '<div class="ukPosts">' + c.assets.map(function (id, i) {
        return postCard(D.asset(id), link, { eager: i < 2 });
      }).join('') + '</div>' : '') +
      '<div class="ukComposer_row"><div class="ukComposer_actions"><button class="ukGhost ukGhost--sm" type="button" data-composer-mode="message">Send a message instead</button></div>' +
        '<div class="ukComposer_send"><span class="ukHint">Approve or request changes from the top of this page.</span></div></div></section>';
  }

  /* Complete is the only place the work is finished and owned, so the gallery
     gets the gold frame rather than the plain review border. */
  /* Stars as radio buttons, not a row of glyphs with a click handler: a rating is
     a single choice out of five and the platform already has a control for that,
     with keyboard and screen-reader behaviour we would otherwise have to rebuild
     badly. */
  function starPick(name, value) {
    return '<span class="ukStars" role="radiogroup" aria-label="Rating out of five">' +
      [1,2,3,4,5].map(function (n) {
        return '<label class="ukStars_s' + (value >= n ? ' is-on' : '') + '">' +
          '<input type="radio" name="' + name + '" value="' + n + '" ' +
            (value === n ? 'checked ' : '') + 'data-starpick aria-label="' + n +
            (n === 1 ? ' star' : ' stars') + '">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5-5.9-3.1-5.9 3.1 1.2-6.5L2.5 9.5l6.6-.9z"/></svg>' +
        '</label>';
      }).join('') + '</span>';
  }

  function starsOut(n) {
    return '<span class="ukStars ukStars--out" role="img" aria-label="' + n + ' out of 5">' +
      [1,2,3,4,5].map(function (i) {
        return '<span class="ukStars_s' + (n >= i ? ' is-on' : '') + '">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5-5.9-3.1-5.9 3.1 1.2-6.5L2.5 9.5l6.6-.9z"/></svg></span>';
      }).join('') + '</span>';
  }

  /* The review block, from whichever side is reading. Shown only on a completed
     collaboration: a rating anyone can leave is a rating nobody can trust. */
  /* Reviews are keyed on the SHARED link where a collaboration has one, not on the
     per-app collaboration id: the hotel calls it x6 and the creator calls it k5,
     and keyed separately the two sides would each be reviewing into their own
     private record and never see the other. Same derivation the attribution and
     invitation records already use. */
  function reviewKey(c) { return (c && c.link) || (c && c.id); }

  function reviewBlock(collabId, side, otherName, st) {
    var R = window.UKREVIEWS;
    if (!R) return '';
    st = st || {};
    var mine = R.mine(collabId, side);
    var theirs = R.theirs(collabId, side);
    var editing = st.reviewEdit || !mine;

    return '<section class="ukPanel ukReview">' +
      '<div class="ukPanel_head"><h3 class="ukPanel_title">How did it go?</h3>' +
        (mine && !st.reviewEdit
          ? '<button class="ukGhost ukGhost--sm" type="button" data-reviewedit>Edit</button>'
          : '') + '</div>' +

      (editing
        ? '<p class="ukAsk">Your rating of ' + esc(otherName) + '. They are rating you too, and ' +
            'neither review is shown to the other until both are in.</p>' +
          '<div class="ukReview_pick">' + starPick('ukRate', (mine && mine.stars) || 0) + '</div>' +
          '<textarea class="ukField_i ukField_ta ukReview_ta" id="ukReviewText" rows="3" ' +
            'placeholder="What was good, and what would have made it better?">' +
            esc((mine && mine.text) || '') + '</textarea>' +
          '<div class="ukComposer_row"><div class="ukComposer_actions"></div>' +
            '<div class="ukComposer_send">' +
              '<button class="ukBtn" type="button" data-review-save="' + collabId + '" ' +
                'data-side="' + side + '">' + (mine ? 'Update review' : 'Leave review') + '</button>' +
            '</div></div>'
        : '<div class="ukReview_mine"><p class="ukReview_k">You said</p>' +
            starsOut(mine.stars) +
            (mine.text ? '<p class="ukReview_tx">' + esc(mine.text) + '</p>' : '') +
          '</div>') +

      '<div class="ukReview_them"><p class="ukReview_k">' + esc(otherName) + '</p>' +
        (!theirs
          ? '<p class="ukReview_wait">Nothing yet.</p>'
          : theirs.blind
            ? '<p class="ukReview_wait">Written, and held until yours is in.</p>'
            : starsOut(theirs.stars) + (theirs.text ? '<p class="ukReview_tx">' + esc(theirs.text) + '</p>' : '')) +
      '</div>' +
    '</section>';
  }

  function composerComplete(c, cr, st) {
    var link = D.affiliateFor ? D.affiliateFor(c) : null;
    return '<section class="ukPanel ukComposer ukComposer--done"><div class="ukPanel_head"><h3 class="ukPanel_title">What you own from this stay</h3></div>' +
      '<p class="ukAsk">Approved and yours in perpetuity, on every channel. The thread stays here for reference.</p>' +
      (c.assets && c.assets.length ? '<div class="ukPosts">' + c.assets.map(function (id, i) {
        return postCard(D.asset(id), link, { eager: i < 2, done: true });
      }).join('') + '</div>' : '') +
      '<div class="ukComposer_row"><div class="ukComposer_actions"></div>' +
        '<div class="ukComposer_send"><button class="ukGhost" type="button" data-goto="library">Open your library</button></div></div></section>' +
      reviewBlock(reviewKey(c), 'hotel', cr.n, st);
  }

  function composer(c, cr, mode, st) {
    if (c.passed) return '<section class="ukPanel ukComposer ukComposer--done"><p class="ukAsk">This inquiry was passed and is now closed.</p></section>';
    if (c.stage === 4) return composerComplete(c, cr, st);
    if (c.stage === 3) return composerReview(c, cr, mode);
    if (c.stage === 2) return composerCreating(c, cr);
    if (c.stage === 1) return composerOnboarding(c, cr);
    return composerInquiry(c, cr, mode, st);
  }

  function reqChangesModal(c) {
    return '<div class="ukModalWrap"><div class="ukModal" role="dialog" aria-modal="true" aria-labelledby="ukModalTitle"><h3 class="ukModal_t" id="ukModalTitle">What needs to change?</h3>' +
      '<p class="ukAsk">This goes straight into your conversation with ' + esc(D.creator(c.who).n.split(' ')[0]) + ', so the thread stays the single source of truth.</p>' +
      (c.assets && c.assets.length
        ? '<p class="ukField_l">Which piece is this about?</p><div class="ukPick9">' + c.assets.map(function (id) {
            var a = D.asset(id);
            return '<label class="ukPick9_i"><input type="checkbox" data-reqasset="' + id + '" class="ukSrOnly">' +
              '<span class="ukPick9_m">' + img(a.img, a.t, 'ukPick9_img') +
              (a.k === 'video' ? '<span class="ukPick9_v" aria-hidden="true">&#9654;</span>' : '') + '</span>' +
              '<span class="ukPick9_t">' + esc(a.t) + '</span></label>';
          }).join('') + '</div>'
        : '') +
      '<label class="ukSrOnly" for="ukReqNote">The change you are asking for</label><textarea id="ukReqNote" rows="3" placeholder="e.g. Could we get a brighter version of the pool shot?"></textarea>' +
      '<span class="ukHint" id="ukReqHint" role="status" aria-live="polite"></span><div class="ukModal_row"><button class="ukGhost" type="button" data-reqchanges-cancel>Cancel</button><button class="ukBtn" type="button" data-reqchanges-confirm="' + c.id + '">Send to ' + esc(D.creator(c.who).n.split(' ')[0]) + '</button></div></div></div>';
  }

  /* ---- who you are dealing with, and what they asked for ----
     This is the detail view, not the grid, so the card is expanded rather than
     dropped in whole: the same parts in the same visual language (availability
     dot, vetted name, flag, tags, platform marks, clip strip, stat strip) but
     laid across the width instead of stacked in a 310px column.
     Spending width rather than height matters here — the conversation is what
     this page is for, and it has to be reachable without scrolling, so the
     lifecycle track folds into the foot of this band instead of taking a whole
     panel of its own below it. */
  /* a small, quiet way into the full profile, sat with the name rather than
     taking a button's worth of space of its own */
  var OPEN_ICON = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 4h6v6M20 4l-8.5 8.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 14.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';

  /* Two, then a "+N" that opens the rest beside itself — the same rule and the same
     .ukMoreDot control the creator's own card uses, so a capped list behaves
     identically wherever it appears. */
  function capped(items, kind, render, max) {
    var shown = items.slice(0, max || 2), rest = items.length - shown.length;
    return shown.map(render).join('') +
      (rest > 0 ? '<button class="ukMoreDot" type="button" data-crpop="' + kind + '" ' +
        'aria-label="' + rest + ' more">+' + rest + '</button>' : '');
  }

  /* One popup for the whole view. The key carries which list and, on a grid,
     whose — 'markets:c4' — so a board of twelve cards does not need twelve
     dialogs sitting in the DOM waiting to be opened. */
  function crPopup(st, cr) {
    if (!st.crPop) return '';
    var bits = String(st.crPop).split(':');
    if (bits[1]) { cr = D.creator(bits[1]); if (!cr) return ''; }
    if (!cr) return '';
    var kind = bits[0];
    var title = kind === 'markets' ? 'Markets they cover'
              : kind === 'makes'   ? 'What they make'
              : 'What they shoot';
    var rows = kind === 'markets'
      ? (cr.markets || []).map(function (m) {
          return '<li class="ukPop_row">' + (m.cc ? '<img class="ukCrFlag" src="/assets/img/flags/' + m.cc + '.svg" alt="" loading="lazy" decoding="async">' : '') + esc(m.n) + '</li>'; }).join('')
      : ((kind === 'makes' ? cr.makes : cr.cats) || []).map(function (t) {
          return '<li class="ukPop_row">' + esc(t) + '</li>'; }).join('');
    return '<div class="ukPop_card" role="dialog" aria-label="' + esc(title) + '" data-crpop-panel>' +
      '<div class="ukPop_head"><h2 class="ukPop_h">' + esc(title) + '</h2>' +
        '<button class="ukPop_x" type="button" data-crpop-close aria-label="Close">&times;</button></div>' +
      '<ul class="ukPop_list">' + rows + '</ul></div>';
  }

  /* The decision is made here, not four hundred pixels further down: on the two
     stages that are actually the hotel's move, the badge carries the real controls
     so nothing has to be scrolled to act on. Same handlers the composer uses. */
  function headActions(c) {
    if (c.passed || !D.collabMine(c)) return '';
    if (c.stage === 0) {
      return '<button class="ukStatusBadge_b is-go" type="button" data-composer-mode="approve" data-tocomposer>Approve</button>' +
        '<button class="ukStatusBadge_b" type="button" data-pass="' + c.id + '">Pass</button>';
    }
    if (c.stage === 3) {
      return '<button class="ukStatusBadge_b is-go" type="button" data-approve="' + c.id + '">Approve</button>' +
        '<button class="ukStatusBadge_b" type="button" data-reqchanges-open="' + c.id + '">Request changes</button>';
    }
    return '';
  }

  /* The decision, offered from a card without opening it. Approve at inquiry still
     goes through the package review — that is a real step, not a formality — so it
     opens the thread already in that mode rather than pretending to send blind. */
  function inquiryFacts(cr) {
    var markets = (cr.markets || []).slice(0, 5);
    var cats = (cr.cats || [cr.type]).filter(Boolean).slice(0, 5);
    /* No rating here. At inquiry the decision is whether this person fits the
       stay, and a star average is a summary of work done for other hotels — it
       belongs on the profile, not on the card where the choice is made. */
    var stats = [
      ['Audience',   D.fmt(cr.f)],
      ['Avg reach',  String(cr.reach || '\u2014').replace(/\s*per post/, '')],
      ['Engagement', cr.eng || '\u2014']
    ];
    return '<div class="ukInqF">' +
      /* the +N is a control, the same one the profile head uses, so the rest of
         the markets are one press away instead of only living in a title tooltip */
      '<p class="ukInqF_mk"><span class="ukInqF_k">Covers</span>' +
        capped(markets, 'markets:' + cr.id, function (m) {
          return '<span class="ukInqF_mkI">' +
            (m.cc ? '<img class="ukCrFlag" src="/assets/img/flags/' + m.cc + '.svg" alt="" loading="lazy" decoding="async">' : '') +
            esc(m.n) + '</span>';
        }, 1) + '</p>' +
      '<span class="ukCrTags">' + capped(cats, 'cats:' + cr.id, function (t) {
        return '<span class="ukCrTag">' + esc(t) + '</span>'; }) + '</span>' +
      '<ul class="ukInqF_s">' + stats.map(function (x) {
        return '<li><span class="ukInqF_sv">' + esc(x[1]) + '</span>' +
          '<span class="ukInqF_sl">' + esc(x[0]) + '</span></li>';
      }).join('') + '</ul>' +
    '</div>';
  }

  function cardActions(c) {
    if (c.passed || !D.collabMine(c)) return '';
    var b = '';
    if (c.stage === 0) {
      b = '<button class="ukCardAct_b is-go" type="button" data-cardapprove="' + c.id + '">Approve</button>' +
          '<button class="ukCardAct_b" type="button" data-pass="' + c.id + '">Pass</button>';
    } else if (c.stage === 3) {
      b = '<button class="ukCardAct_b is-go" type="button" data-approve="' + c.id + '">Approve</button>' +
          '<button class="ukCardAct_b" type="button" data-thread="' + c.id + '">Review</button>';
    }
    return b ? '<div class="ukCardAct" data-cardact>' + b + '</div>' : '';
  }

  /* The link a hotel most often needs is the one for the collaboration they are
     looking at, so it sits under the status badge rather than in a sidebar panel
     three scrolls down. Compact by design — the full management view is still
     Links & codes. */
  function trackedInline(c, cr) {
    var row = (D.attribution || []).filter(function (r) { return r.collab === c.id || r.who === cr.id; })[0];
    if (!row) return '';
    /* Two pills side by side, one of them a URL and one of them a word, told you
       nothing about which was which. Each carries its own label now, and the pair
       sits under the decision it belongs to rather than beside it. */
    return '<div class="ukTrackMini">' +
      '<div class="ukTrackMini_r"><span class="ukTrackMini_l">Tracked link</span>' +
        '<button class="ukTrackMini_i" type="button" data-ack="Link copied" ' +
          'aria-label="Copy the tracked link">' + LINK_ICON + '<code>' + esc(row.link) + '</code></button></div>' +
      '<div class="ukTrackMini_r"><span class="ukTrackMini_l">Discount code</span>' +
        '<button class="ukTrackMini_i" type="button" data-ack="Code copied" ' +
          'aria-label="Copy the discount code">' + '<code>' + esc(row.code) + '</code></button></div>' +
      /* the same caveat the fuller panels carry: the link works, the reporting
         behind it does not yet */
      window.UKTRACK.linkNote() +
    '</div>';
  }

  function creatorHead(c, cr, stay, dates, st, opts) {
    var av = availOf(cr);
    /* Markets are a flat list of equals, exactly as onboarding captures them, and
       each is named place-and-country. Categories come from the shared vocabulary,
       so this says the same words as the network filters. */
    var markets = (cr.markets || []).slice(0, 5);
    var cats = (cr.cats || [cr.type]).filter(Boolean).slice(0, 5);
    var plats = (cr.plats || []).filter(function (p) { return PLAT_MARK[p.k]; });
    var stats = [
      ['Audience',   D.fmt(cr.f)],
      ['Avg reach',  String(cr.reach || '\u2014').replace(/\s*per post/, '')],
      ['Engagement', cr.eng || '\u2014'],
      ['Rating',     cr.rating ? cr.rating.toFixed(1) : '\u2014', true],
      ['On time',    cr.ontime != null ? cr.ontime + '%' : '\u2014'],
      ['Replies',    cr.resp ? String(cr.resp).replace(/^within\s+/, '') : '\u2014']
    ];

    return '<section class="ukCrD">' +
      '<div class="ukCrD_grid">' +
        '<div class="ukCrD_who">' +
          who(cr, img(cr.img, cr.n, '', true) +
            '<span class="ukCrAv_dot ' + av.c + '" title="' + esc(av.t) + '" role="img" aria-label="' + esc(av.t) + '"></span>',
            'ukCrAv ukCrAv--xl ukWho--av') +
          '<div class="ukCrD_id">' +
            '<h2 class="ukCrD_n">' + who(cr, esc(cr.n)) + (window.ukVetBadge ? window.ukVetBadge('ukCrVet') : '') +
              '<button class="ukCrD_open" type="button" data-creator="' + cr.id + '" ' +
                'title="Open full profile" aria-label="Open ' + esc(cr.n) + '&rsquo;s full profile">' + OPEN_ICON + '</button>' +
            '</h2>' +
            /* one line of plain facts: where they work, how much they have done,
               what they speak. The markets carry flags but no frames — only the
               overflow badge is a control. */
            '<p class="ukCrD_mk"><span class="ukCrD_mkK">Covers</span>' +
              capped(markets, 'markets', function (m) {
                return '<span class="ukCrD_mkI">' +
                  (m.cc ? '<img class="ukCrFlag" src="/assets/img/flags/' + m.cc + '.svg" alt="" loading="lazy" decoding="async">' : '') +
                  esc(m.n) + '</span>';
              }) +
              (cr.stays != null ? '<span class="ukCrD_sep" aria-hidden="true"></span><span class="ukCrD_mkF">' + cr.stays + ' stays</span>' : '') +
            '</p>' +
            '<div class="ukCrD_tagRow">' +
              '<span class="ukCrTags">' + capped(cats, 'cats', function (t) {
                return '<span class="ukCrTag">' + esc(t) + '</span>'; }) + '</span>' +
              /* layered marks, no per-platform counts — the audience total below
                 is the number that actually matters */
              '<span class="ukCrPlats">' + plats.map(function (p) {
                return '<img class="ukCrPlat" src="' + PLAT_MARK[p.k] + '" alt="' + esc(p.n) + '" title="' + esc(p.n) + '" loading="lazy" decoding="async">';
              }).join('') + '</span>' +
              (cr.langs ? '<span class="ukCrD_mkF ukCrD_lang">Speaks ' + esc(cr.langs) + '</span>' : '') +
            '</div>' +
            /* the numbers live on the Stats tab now; repeating them in the header
               meant the same six figures twice on one screen */
            ((opts && opts.noStats) ? '' : '<ul class="ukCrD_stats">' + stats.map(function (s) {
              return '<li><span class="ukCrD_sv">' +
                (s[2] ? '<img class="ukCrStar" src="/assets/img/fc/star.svg" alt="" width="10" height="10">' : '') +
                esc(s[1]) + '</span><span class="ukCrD_sl">' + esc(s[0]) + '</span></li>';
            }).join('') + '</ul>') +
          '</div>' +
        '</div>' +
        /* A pitch reuses this header wholesale — it is the same object being
           introduced — and only swaps the two buttons, because "Approve" on a
           pitch would approve a stay that does not exist. */
        '<div class="ukCrD_side">' +
          statusBadge(c, (opts && opts.actions) || headActions(c), opts && opts.badge) +
          ((opts && opts.noTrack) ? '' : trackedInline(c, cr)) + '</div>' +
      '</div>' +
      /* the lifecycle band belongs to a collaboration; on a profile there is not
         one yet, so it has nothing to say */
      ((opts && opts.noTrack2) ? '' : '<div class="ukCrD_track">' + track(c.stage) + '</div>') +
      crPopup(st || {}, cr) +
    '</section>';
  }

  /* The link belongs where the work is. Links & Codes stays the full management
     view inside Bookings & ROI — this is a second door, not a replacement, and
     deliberately not a nav item of its own: a link only means something next to
     the bookings it produced. */
  function trackedPanel(c, cr) {
    var row = (D.attribution || []).filter(function (r) { return r.collab === c.id || r.who === cr.id; })[0];
    if (!row) return '';
    return '<section class="ukPanel"><div class="ukPanel_head">' +
      '<h3 class="ukPanel_title">Tracked link</h3></div>' +
      '<div class="ukTrackRow"><span class="ukTrackRow_l">Link</span>' +
        '<code class="ukCode">' + esc(row.link) + '</code>' +
        '<button class="ukGhost" type="button" data-ack="Copied">Copy</button></div>' +
      '<div class="ukTrackRow"><span class="ukTrackRow_l">Code</span>' +
        '<code class="ukCode">' + esc(row.code) + '</code>' +
        '<button class="ukGhost" type="button" data-ack="Copied">Copy</button></div>' +
      (D.trackingLive()
        ? '<p class="ukHint">Anything booked through these is attributed to ' + esc(cr.n.split(' ')[0]) + '.</p>'
        /* The link is real and the creator can use it today. What is not true yet
           is that anything comes back through it, and a hotel handing it over
           deserves to know which of the two it has. */
        : window.UKTRACK.linkNote()) +
    '</section>';
  }

  /* Pressing play opens the frame full size rather than trying to play a 150px
     tile in place. Seeded stills stand in for the video file itself.
     // PLUG-IN POINT — swap the still for the real asset's video source. */
  function lightbox(st) {
    if (!st.playing) return '';
    var a = D.asset(st.playing);
    if (!a) return '';
    return '<div class="ukLightbox" data-play-close role="dialog" aria-modal="true" aria-label="' + esc(a.t) + '">' +
      '<div class="ukLightbox_i">' +
        '<button class="ukLightbox_x" type="button" data-play-close aria-label="Close">&times;</button>' +
        img(a.img, a.t, '', true) +
        '<div class="ukLightbox_cap">' + esc(a.t) +
          '<span>' + esc(a.on) + (a.time ? ' \u00b7 ' + esc(a.time) : '') +
          (a.len ? ' \u00b7 ' + esc(a.len) : '') + '</span></div>' +
      '</div></div>';
  }

  function collab(st) {
    var c = D.collabs.filter(function (x) { return x.id === st.thread; })[0];
    var cr = D.creator(c.who), stay = D.stay(c.stay), mode = st.composerMode || null;
    var dates = D.packageDates ? D.packageDates(c) : (c.dates || {});
    return creatorHead(c, cr, stay, dates, st) +
      '<div class="ukGrid ukGrid--thread"><section class="ukFlow">' +
        (c.approvedNow ? ownedNow(c, cr) : '') + threadPanel(c, cr, mode, st) +
      '</section><aside class="ukSideCol">' +
        /* the card is the object itself: it carries its own frame and names the
           stay, so wrapping it in a panel headed "The stay" would say it twice */
        stayCard(stay, dates) +
      '</aside></div>' +
      (st.modalOpen === 'reqchanges' ? reqChangesModal(c) : '') +
      lightbox(st);
  }

  function ownedNow(c, cr) {
    var n = (c.assets || []).length;
    return '<section class="ukOwned" role="status"><div class="ukOwned_b"><p class="ukHero_eyebrow">All wrapped up</p><h3 class="ukOwned_t">' + n + ' assets are yours now</h3>' +
      '<p class="ukOwned_p">Approved and added to your content library. Yours on every channel, in perpetuity, with no expiry. ' + esc(cr.n.split(' ')[0]) + ' has been notified.</p>' +
      '<div class="ukHero_cta"><button class="ukBtn" type="button" data-goto="library">Open your library</button><button class="ukGhost" type="button" data-back>Back to collaborations</button></div></div>' +
      '<div class="ukOwned_m">' + (c.assets || []).slice(0, 4).map(function (id) { return img(D.asset(id).img, D.asset(id).t, 'ukOwned_i'); }).join('') + '</div></section>';
  }

  /* ============================ host a creator ============================ */
  /* The eight formats the creator onboarding asks about, not a hardcoded four.
     A hotel that wants drone footage or a long-form YouTube piece could not ask
     for it, and a creator who declares those formats could not be matched on
     them — the two halves of the product were using different vocabularies. */
  var DELS = ((window.UKVOCAB && window.UKVOCAB.FORMATS) || []).slice();
  if (!DELS.length) DELS = ['UGC video','Photos','Reels','Stories'];
  var REACH = ['10K-50K','25K-100K','50K-250K','100K+'];
  var TYPES = ['Wellness & spa','Food & beverage','Luxury & design','Travel & adventure','Boutique & budget'];
  var STEPS = ['Pick a starting point','The stay','Who you want','What they create','Preview'];

  /* the field stores the native date input's own ISO value; this is only for
     showing it back in a sentence, on the preview card and in the pre-fill chip */
  function fmtDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-US', { day:'numeric', month:'short', year:'numeric' });
  }

  function form(st) {
    if (!st.form) {
      var std = D.packages.filter(function (p) { return p.rec; })[0];
      st.form = { pkg:'', nights:std.nights, inc:std.inc, reach:std.reach,
                  type:D.property.cat, del:Object.assign({}, std.del), date:'' };
    }
    return st.form;
  }

  function host(st) {
    var f = form(st), step = st.step || 0;
    return head('Host a creator',
      'Pick the shape that fits, then change anything. Nothing publishes until you say so.') +
      '<ol class="ukSteps">' + STEPS.map(function (s, i) {
        return '<li class="' + (i < step ? 'is-done' : i === step ? 'is-now' : '') + '">' +
          '<button type="button" data-step="' + i + '"><span>' + (i+1) + '</span>' + s + '</button></li>';
      }).join('') + '</ol>' +
      /* Step one is the shape you are choosing, and "What you are trading" beside
         it was showing the trade from a package that had not been picked yet —
         four options on the left and one summary on the right that looked like all
         of them. It joins from step two, where there is a real trade to summarise
         and the numbers on screen are the ones it is describing. */
      '<div class="' + (step === 0 ? 'ukHostWide' : 'ukGrid ukGrid--thread') + '"><div>' +
        (step === 0 ? hostPkg(f) : step === 1 ? hostStay(f, st) : step === 2 ? hostWho(f, st) :
         step === 3 ? hostMake(f) : hostPreview(f, st)) +
        /* The reassurance and the actions belong on one line: the note is a footnote
           about the buttons beside it, and stacking it underneath gave a passing
           remark its own band across the page. */
        '<div class="ukNav2">' +
          (step ? '<button class="ukGhost" type="button" data-step="' + (step-1) + '">Back</button>' : '<span></span>') +
          '<div class="ukNav2_r">' +
            '<p class="ukNav2_note">Your draft is kept as you go. Leave and pick this up later.</p>' +
            '<button class="ukGhost" type="button" data-ack="Draft saved">Save as draft</button>' +
            (step < 4 ? '<button class="ukBtn" type="button" data-step="' + (step+1) + '">Continue</button>'
                      : '<button class="ukBtn" type="button" data-publish-open>Publish this stay</button>') +
          '</div></div>' +
      '</div>' + (step === 0 ? '' : hostAside(f, step)) + '</div>' +
      (st.publish === 'ask'  ? publishModal(f, st) : '') +
      (st.publish === 'done' ? publishedModal(f) : '');
  }

  /* step 1 — three starting points, give and get on each */
  function hostPkg(f) {
    return '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">Pick a starting point</h3></div>' +
      '<p class="ukAsk">Three shapes that work, or start with nothing filled in. Whichever you pick, every value is still yours to change over the next three steps.</p>' +
      '<div class="ukPkgs">' + D.packages.map(function (p) {
        var got = Object.keys(p.del).reduce(function (a, k) { return a + p.del[k]; }, 0);
        return '<button class="ukPkg' + (f.pkg === p.id ? ' is-on' : '') + (p.rec ? ' is-rec' : '') + '" ' +
          'type="button" data-pkg="' + p.id + '" aria-pressed="' + (f.pkg === p.id ? 'true' : 'false') + '">' +
          (p.rec ? '<span class="ukPkg_rec">Recommended</span>' : '') +
          '<span class="ukPkg_n">' + p.n + '</span>' +
          '<span class="ukPkg_tag">' + esc(p.tag) + '</span>' +
          '<span class="ukPkg_trade">' +
            '<span class="ukPkg_side"><span class="ukPkg_l">You give</span>' +
              '<span class="ukPkg_v">' + p.nights + (p.nights === '1' ? ' night' : ' nights') + '</span>' +
              '<span class="ukPkg_s">' + esc(p.inc) + '</span></span>' +
            '<span class="ukPkg_ar" aria-hidden="true">&harr;</span>' +
            '<span class="ukPkg_side"><span class="ukPkg_l">You get</span>' +
              '<span class="ukPkg_v">' + got + ' asset' + (got === 1 ? '' : 's') + '</span>' +
              '<span class="ukPkg_s">Yours in perpetuity</span></span>' +
          '</span>' +
          '<span class="ukPkg_del">' + Object.keys(p.del).map(function (k) {
            return '<span class="ukChip">' + p.del[k] + ' × ' + k.toLowerCase() + '</span>'; }).join('') + '</span>' +
          '<span class="ukPkg_why">' + esc(p.why) + '</span>' +
        '</button>';
      }).join('') +
        /* A hotel that already knows the trade it wants should not have to pick a
           template and then undo it. Blank clears every field and drops them into
           the same three steps with nothing pre-answered. */
        '<button class="ukPkg ukPkg--blank' + (f.pkg === 'blank' ? ' is-on' : '') + '" type="button" ' +
          'data-pkg="blank" aria-pressed="' + (f.pkg === 'blank' ? 'true' : 'false') + '">' +
          '<span class="ukPkg_n">Start blank</span>' +
          '<span class="ukPkg_tag">You already know what you want</span>' +
          '<span class="ukPkg_why">Nothing filled in. You set the nights, what is included and what comes ' +
            'back yourself, over the same three steps.</span>' +
        '</button>' +
      '</div>' +
      (f.pkg === 'blank'
        ? '<p class="ukWhy">Starting blank. The next three steps are the same, just with nothing answered for you.</p>'
        : f.pkg
          ? '<p class="ukWhy">Filled in from ' + esc((D.packages.filter(function(p){return p.id===f.pkg;})[0] || {}).n || '') +
            '. Every value is still yours to change on the next three steps.</p>'
          : '<p class="ukWhy">Not sure? Standard is what most properties your size choose, and it is the easiest to adjust in either direction.</p>') +
    '</section>';
  }

  /* What a hotel can actually put in the room. A free-text box asked the hotel to
     invent the vocabulary every time, so no two stays described the same breakfast
     the same way and nothing could be matched or counted later.
     // PLUG-IN POINT — the property's own amenities list, once there is one. */
  var INCLUDES = [
    'Room', 'Breakfast', 'All meals', 'Half board', 'Dinner for two',
    'One spa treatment', 'Full spa access', 'Pool and gym access',
    'Airport transfer', 'Late checkout', 'Welcome drink', 'Minibar',
    'Guided tour', 'Cooking class', 'Wine tasting', 'Bike hire',
    'Kayak or watersports', 'Parking', 'Pet friendly', 'Co-working desk'
  ];

  function hostStay(f, st) {
    st = st || {};
    var inc = Array.isArray(f.incList) ? f.incList : [];
    var shots = f.photos || [];
    return '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">What are you offering?</h3></div>' +
      '<p class="ukAsk">Creators are offered a stay, never a fee. You are trading nights you already have.</p>' +

      /* a count, typed as a count: steppers either side so it is obviously a
         number, and no keyboard needed to answer it */
      '<div class="ukField"><span class="ukField_l">Nights</span>' +
        '<div class="ukNum">' +
          '<button class="ukNum_b" type="button" data-nights="-1" aria-label="One night fewer">&minus;</button>' +
          '<input class="ukNum_i" type="number" inputmode="numeric" min="1" max="14" step="1" ' +
            'data-f="nights" value="' + esc(f.nights || '') + '" placeholder="0" aria-label="Nights"> ' +
          '<button class="ukNum_b" type="button" data-nights="1" aria-label="One night more">+</button>' +
          '<span class="ukNum_u">' + (String(f.nights) === '1' ? 'night' : 'nights') + '</span>' +
        '</div>' +
      '</div>' +

      /* several things, not one sentence */
      '<div class="ukField"><span class="ukField_l">What the stay includes</span>' +
        '<div class="ukDrop ukDrop--wide"><button class="ukDrop_b" type="button" data-drop-toggle ' +
          'aria-haspopup="menu" aria-expanded="false">' +
          '<span class="ukDrop_v">' + (inc.length
            ? esc(inc.length === 1 ? inc[0] : inc.length + ' things included')
            : 'Choose what is included') + '</span>' +
          '<svg class="ukDrop_car" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>' +
        '</button>' +
        '<div class="ukDropMenu ukDropMenu--multi" hidden role="menu">' + INCLUDES.map(function (x) {
          var on = inc.indexOf(x) > -1;
          return '<button class="ukDropMenu_i' + (on ? ' is-sel' : '') + '" role="menuitemcheckbox" ' +
            'aria-checked="' + on + '" data-inc="' + esc(x) + '">' +
            '<span class="ukDropMenu_box" aria-hidden="true">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" ' +
              'stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>' +
            '</span>' + esc(x) + '</button>';
        }).join('') + '</div></div>' +
        (inc.length
          ? '<div class="ukChips ukChips--inc">' + inc.map(function (x) {
              return '<button class="ukChip ukChip--x" type="button" data-inc="' + esc(x) + '" ' +
                'aria-label="Remove ' + esc(x) + '">' + esc(x) + '<span aria-hidden="true">&times;</span></button>';
            }).join('') + '</div>'
          : '') +
      '</div>' +

      '<div class="ukField"><span class="ukField_l">First night available</span>' +
        '<label class="ukDate">' +
          '<svg class="ukDate_i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>' +
          '<input class="ukDate_in" type="date" data-f="date" value="' + esc(f.date || '') + '" ' +
            'aria-label="First night available">' +
          '<span class="ukDate_v">' + (f.date ? esc(fmtDate(f.date)) : 'Any date \u2014 optional') + '</span>' +
        '</label>' +
      '</div>' +

      /* The same uploader the property onboarding uses, and the same 4:3 crop, so
         a photo added here looks like a photo added there — and these are the
         pictures a creator sees on the card. */
      '<div class="ukField"><span class="ukField_l">Photos of this stay</span>' +
        '<div class="ukShots ukShots--host">' +
          shots.map(function (sh, n) {
            return '<figure class="ukShotTile">' +
              '<img src="' + (sh.out || sh.src) + '" alt="Stay photo ' + (n + 1) + '">' +
              '<button class="ukShotTile_x" type="button" data-unstayshot="' + n + '" ' +
                'aria-label="Remove photo ' + (n + 1) + '">&times;</button>' +
            '</figure>';
          }).join('') +
          '<label class="ukShotAdd">' +
            '<input type="file" accept="image/*" multiple data-stayshot hidden>' +
            '<span class="ukShotAdd_p" aria-hidden="true">+</span>' +
            '<span class="ukShotAdd_t">' + (shots.length ? 'Add another' : 'Drag photos here, or browse') + '</span>' +
            (shots.length ? '' : '<span class="ukShotAdd_s">The first one is what creators see on the card.</span>') +
          '</label>' +
        '</div>' +
      '</div>' +

      /* The guest guide belongs to the stay, not to the property: a spa midweek and
         a rooftop summer week send a creator to different places and allow
         different things. Each stay carries its own, seeded from the sensible
         default so nobody starts at a blank page. */
      '<div class="ukField"><span class="ukField_l">Guest guide for this stay</span>' +
        '<p class="ukAsk ukAsk--sm">What a creator needs to know once they are here. ' +
          'Sent with the booking, and theirs to share.</p>' +
        '<div class="ukGuideFields">' + (D.GUIDE_SECTIONS || []).map(function (sec) {
          var val = (f.guide && f.guide[sec.k] != null) ? f.guide[sec.k] : '';
          return '<label class="ukField ukField--sub">' +
            '<span class="ukField_l">' + esc(sec.t) + '</span>' +
            '<textarea class="ukField_i ukField_ta" rows="2" data-guidef="' + sec.k + '" ' +
              'placeholder="' + esc(sec.seed) + '">' + esc(val) + '</textarea>' +
            '</label>';
        }).join('') + '</div>' +
        '<p class="ukWhy">Leave any of these and the default above is what a creator sees.</p>' +
      '</div>' +

      '<p class="ukWhy">Two nights is the most common. It gives a creator time to shoot properly ' +
        'without holding the room over a weekend.</p>' +
    '</section>';
  }

  function hostWho(f, st) {
    st = st || {};
    return '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">Who do you want to reach?</h3></div>' +
      '<p class="ukAsk">You approve every creator before anything is confirmed. This only decides who sees the listing.</p>' +

      '<p class="ukField_l">Audience size</p><div class="ukChoice">' + REACH.map(function (r) {
        return '<button class="ukPick' + (f.reach === r ? ' is-on' : '') + '" type="button" data-pick="reach" data-val="' + r + '">' + r + '</button>';
      }).join('') + '</div>' +
      '<p class="ukWhy">25K to 100K is the sweet spot for properties your size. Smaller audiences engage harder and say yes more often.</p>' +
      '<p class="ukField_l" style="margin-top:20px">Content they are known for</p><div class="ukChoice">' + TYPES.map(function (t) {
        return '<button class="ukPick' + (f.type === t ? ' is-on' : '') + '" type="button" data-pick="type" data-val="' + esc(t) + '">' + esc(t) + '</button>';
      }).join('') + '</div>' +
      '<p class="ukWhy">Pre-filled from your property profile. Wellness properties get the strongest response from spa and wellness creators.</p>' +

      /* The one question on this flow a hotel can genuinely not answer from its own
         knowledge is who to aim at. Who to host exists to answer it, so say so
         here rather than leaving them to find it. */
      '<div class="ukNudge">' +
        '<p class="ukNudge_t">Not sure who to aim at, or how many to host?</p>' +
        '<p class="ukNudge_p">Who to host reads your property and suggests a mix, with the reasoning. ' +
          'Your answers here are kept.</p>' +
        '<button class="ukGhost ukGhost--sm" type="button" data-goto="hire">Open Who to host</button>' +
      '</div>' +
    '</section>';
  }

  function hostMake(f) {
    var total = Object.keys(f.del).reduce(function (a, k) { return a + f.del[k]; }, 0);
    return '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">What should they create?</h3></div>' +
      '<p class="ukAsk">Set from your package. Nudge anything up or down.</p>' +
      '<div class="ukDels">' + DELS.map(function (d) {
        var qn = f.del[d] || 0;
        return '<div class="ukDel' + (qn ? ' is-on' : '') + '"><span class="ukDel_n">' + d + '</span>' +
          '<span class="ukStep"><button type="button" data-del="' + d + '" data-dir="-1" aria-label="Fewer ' + d + '">&minus;</button>' +
          '<b>' + qn + '</b><button type="button" data-del="' + d + '" data-dir="1" aria-label="More ' + d + '">+</button></span></div>';
      }).join('') + '</div>' +
      (total ? '' : '<p class="ukMissing">Add at least one deliverable so creators know what they are agreeing to.</p>') +
      /* The brief sits with the deliverables because it is the same decision: what
         they make, and what you want it to say. One per stay, not one per
         property — the brief for a spa midweek is not the brief for a relaunch. */
      '<div class="ukField"><span class="ukField_l">The brief</span>' +
        '<p class="ukAsk ukAsk--sm">What this shoot is for, and anything they should or should not do. ' +
          'A creator sees this before they apply.</p>' +
        '<textarea class="ukField_i ukField_ta" rows="4" data-f="brief" ' +
          'placeholder="We want the room and the terrace at first light, the spa in use, and one piece to camera about the treatment. ' +
          'Please avoid other guests, and keep the restaurant out of frame before service.">' + esc(f.brief || '') + '</textarea>' +
      '</div>' +

      '<div class="ukRights"><p class="ukRights_t">Usage rights</p>' +
        '<p class="ukRights_p">Everything delivered is <strong>yours in perpetuity</strong>, across every channel, with no expiry. This term is fixed on every hosted stay, and creators accept it before they can apply.</p></div>' +
    '</section>';
  }

  /* ============================ the stay card ============================
     The object a creator is shown when a hotel offers a stay: the picture, what
     the stay is, the facts, and what comes back. Built in the host flow ("how
     creators will see it") and browsed on the creator side, so a collaboration
     thread shows this rather than describing the same stay a second way. */
  /* First two, then a "+N" you can hover to read the rest. A stay with nine
     inclusions was writing all nine into the card and pushing it to twice the
     height of the one beside it; the card now has a fixed number of lines no
     matter how much is in the package. Same badge the creator cards use. */
  /* Fill the line, then cap. A fixed "first two" left "Room, Breakfast +1" with
     half the row empty while a long pair still wrapped — the useful limit is how
     much text fits, not how many items there are. Measured in characters, which
     is close enough for a proportional face at this size and costs no layout pass. */
  /* The full list goes in, and a post-paint pass trims it to two lines and adds
     the "+N". A character budget was a guess that could not know the panel's real
     width, so the same number was too many on a narrow card and too few on a wide
     one — which is how "gallery pass" ended up alone on a second line while the
     first line still had room. See clampLines() in ukapp.js. */
  function fewOf(list, lines, key) {
    list = (list || []).filter(Boolean);
    if (!list.length) return '';
    return '<span class="ukClamp" data-clamp="' + esc(key) + '" data-lines="' + (lines || 2) + '" ' +
      'data-items="' + esc(JSON.stringify(list)) + '">' + esc(list.join(', ')) + '</span>';
  }

  /* The rest of a capped list, opened from its "+N". A title attribute is not a
     control: it needs a hover, a wait, and a mouse, and on a card a reader is
     entitled to press the thing and be shown the answer. */
  function stayPop(open, key, title, list) {
    if (open !== key) return '';
    return '<div class="ukPop_card ukPop_card--stay" role="dialog" aria-label="' + esc(title) + '" data-staypop-panel>' +
      '<div class="ukPop_head"><h2 class="ukPop_h">' + esc(title) + '</h2>' +
        '<button class="ukPop_x" type="button" data-staypop-close aria-label="Close">&times;</button></div>' +
      '<ul class="ukPop_list">' + list.map(function (x) {
        return '<li class="ukPop_row">' + esc(x) + '</li>'; }).join('') + '</ul></div>';
  }

  /* "Yours in perpetuity, all channels" wraps in a card panel, and the panel only
     has two lines. The long form is still what the brief and the thread say — this
     is the card's version of it. */
  function shortRights(r) {
    if (!r) return 'Yours in perpetuity';
    if (/perpetuity/i.test(r)) return 'Yours in perpetuity';
    if (/keep and use/i.test(r)) return 'Theirs to keep and use';
    return r;
  }

  /* The card itself now lives in ukstaycard.js, which BOTH apps load. The
     creator side was rendering a lookalike of it built from different classes, so
     a fix made here never reached that side and the two drifted apart every time
     either was touched. What this side still owns is the one thing that genuinely
     differs: on a hotel every stay belongs to the same property, so it is passed
     in once, and its name opens the property profile. */
  function stayCard(stay, dates, opts) {
    opts = opts || {};
    opts.property = D.property;
    opts.propGo = { attr:'goto', val:'settings', title:'Open the property profile' };
    return window.UKSTAY.card(stay, dates, opts);
  }

  /* The preview drew its own card: a different title, an "Audience" row creators
     never see, and no property link. It builds a stay from the form and hands it
     to the same stayCard() the creator side renders, so "how creators will see
     it" is the object they actually get rather than a lookalike of it. */
  function hostPreview(f, st) {
    var shots = (f.photos || []).map(function (sh) { return sh.out || sh.src; }).filter(Boolean);
    var shot = (f.photos || [])[0];
    var stay = {
      t: (f.nights ? esc(f.nights) + (String(f.nights) === '1' ? ' night at ' : ' nights at ') : 'A stay at ') +
         D.property.name,
      /* the first photo added on step two IS the card image */
      img: (shot && (shot.out || shot.src)) || D.property.img,
      shots: shots.length ? shots : null,
      nights: f.nights || '\u2014',
      rooms: f.type || D.property.cat || 'Room',
      inc: f.inc || 'Not set yet',
      incList: f.incList || null,
      rights: 'Yours in perpetuity, all channels',
      del: Object.keys(f.del || {}).filter(function (k) { return f.del[k]; })
             .map(function (k) { return { t:k, q:f.del[k] }; })
    };
    var dates = f.date ? { from:f.date, to:f.date } : null;
    return '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">How creators will see it</h3></div>' +
      '<p class="ukAsk">Exactly as it appears in the network. Nothing else is shown to them.</p>' +
      '<div class="ukHostPrev">' + stayCard(stay, dates, { eager:true, shot: st && st.prevShot, pop: st && st.stayPop }) + '</div>' +
      /* who will actually meet this card, said before they publish it */
      (f.visibility === 'private'
        ? '<p class="ukWhy">Private. Only the ' + ((f.invited || []).length || 0) +
          ((f.invited || []).length === 1 ? ' creator' : ' creators') + ' you picked will see it, ' +
          'as a message they can reply to. Nobody else can find it.</p>'
        : '<p class="ukWhy">Public. Any creator on Ukreate can find this and apply, and you approve ' +
          'every one before anything is confirmed.</p>') +
      (stay.del.length ? '' :
        '<p class="ukMissing">Nothing chosen yet on step four, so creators would not know what they are ' +
        'agreeing to. Add at least one deliverable before you publish.</p>') +
    '</section>';
  }

  /* Publishing is the moment the decision about who can see it actually matters,
     so it is asked here rather than three steps earlier where it read as one more
     form field. It is also the last thing standing between a draft and a live
     listing, which is the right place for a deliberate pause. */
  function publishModal(f, st) {
    var priv = f.visibility === 'private';
    var picked = f.invited || (f.invited = []);
    var q = (st.hostInviteQ || '').trim().toLowerCase();
    var pool = D.creators.filter(function (c) {
      if (!q) return true;
      return (c.n + ' ' + c.loc + ' ' + (c.type || '')).toLowerCase().indexOf(q) > -1;
    });

    return '<div class="ukModalWrap"><div class="ukModal ukModal--wide" role="dialog" aria-modal="true" ' +
      'aria-labelledby="ukPubT">' +
      '<h3 class="ukModal_t" id="ukPubT">Who can see this stay?</h3>' +
      '<p class="ukModal_p">The last thing to decide. Everything else is set.</p>' +

      '<div class="ukChoice ukChoice--wide">' +
        [['public','Anyone on Ukreate','Creators find it and apply. Most stays are filled this way.'],
         ['private','Only creators I pick','Nobody else sees it. They get it as a message and can reply.']]
        .map(function (o) {
          var on = (f.visibility || 'public') === o[0];
          return '<button class="ukPickBig' + (on ? ' is-on' : '') + '" type="button" ' +
            'data-vis="' + o[0] + '" aria-pressed="' + on + '">' +
            '<span class="ukPickBig_t">' + o[1] + '</span>' +
            '<span class="ukPickBig_s">' + o[2] + '</span></button>';
        }).join('') +
      '</div>' +

      (priv
        ? '<div class="ukHostPick">' +
            (picked.length
              ? '<div class="ukChips ukChips--inc">' + picked.map(function (id) {
                  var c = D.creator(id);
                  return c ? '<button class="ukChip ukChip--x" type="button" data-hostpick="' + id + '" ' +
                    'aria-label="Remove ' + esc(c.n) + '">' + esc(c.n) + '<span aria-hidden="true">&times;</span></button>' : '';
                }).join('') + '</div>'
              : '<p class="ukWhy">Nobody picked yet. A private stay with no one on it goes nowhere.</p>') +
            '<label class="ukSearch ukHostPick_q"><span data-icon="search"></span>' +
              '<input type="search" placeholder="Search a creator by name or city" ' +
              'value="' + esc(st.hostInviteQ || '') + '" data-hostinviteq aria-label="Search creators"></label>' +
            /* the picker component that already exists — .ukInvitePick_i / _av / _b
               / _n / _m / _x — not a new set of class names that nothing styles */
            '<ul class="ukInvitePick">' + pool.slice(0, 6).map(function (c) {
              var on = picked.indexOf(c.id) > -1;
              return '<li><button class="ukInvitePick_i' + (on ? ' is-on' : '') + '" type="button" ' +
                'data-hostpick="' + c.id + '" role="checkbox" aria-checked="' + on + '">' +
                img(c.img, c.n, 'ukInvitePick_av') +
                '<span class="ukInvitePick_b"><span class="ukInvitePick_n">' + esc(c.n) + '</span>' +
                  /* a place is named with its flag, everywhere */
                  '<span class="ukInvitePick_m">' + D.fmt(c.f) + ' &middot; ' + flagFor(c.loc) +
                  esc(c.loc) + '</span></span>' +
                (on ? '<span class="ukInvitePick_x">' + TICK + '</span>' : '') + '</button></li>';
            }).join('') + '</ul>' +
          '</div>'
        : '') +

      '<div class="ukModal_act">' +
        '<button class="ukGhost" type="button" data-publish-cancel>Back</button>' +
        '<button class="ukBtn" type="button" data-publish-go' +
          (priv && !picked.length ? ' disabled' : '') + '>' +
          (priv ? 'Publish to ' + (picked.length || 0) + (picked.length === 1 ? ' creator' : ' creators')
                : 'Publish publicly') + '</button>' +
      '</div></div></div>';
  }

  /* Publishing is the one moment in this flow where something leaves the building,
     so it gets said plainly rather than a toast that vanishes before it is read. */
  function publishedModal(f) {
    var priv = f.visibility === 'private';
    var n = (f.invited || []).length;
    return '<div class="ukModalWrap"><div class="ukModal" role="dialog" aria-modal="true" ' +
      'aria-labelledby="ukPubD">' +
      '<span class="ukPubTick" aria-hidden="true">' + TICK + '</span>' +
      '<h3 class="ukModal_t" id="ukPubD">Your stay is live</h3>' +
      '<p class="ukModal_p">' +
        (priv
          ? 'Sent to the ' + n + (n === 1 ? ' creator' : ' creators') + ' you picked. It arrives as a ' +
            'message they can reply to, and nobody else can find it.'
          : 'Any creator on Ukreate can find it and apply. You approve every one before anything is ' +
            'confirmed, so nothing happens without you.') +
      '</p>' +
      '<div class="ukModal_act">' +
        '<button class="ukGhost" type="button" data-goto="stays">See it in Hosted stays</button>' +
        '<button class="ukBtn" type="button" data-goto="collabs">Watch for replies</button>' +
      '</div></div></div>';
  }

  function hostAside(f, step) {
    var total = Object.keys(f.del).reduce(function (a, k) { return a + f.del[k]; }, 0);
    /* Starting blank, this panel was reading "nights" with no number in front of
       it and "0 assets" as though nothing were on offer. Neither is true: nothing
       has been decided yet, and the panel should say so rather than assert an
       empty trade. */
    var nightsSaid = f.nights
      ? esc(f.nights) + (String(f.nights) === '1' ? ' night' : ' nights')
      : 'Not set yet';
    var getsSaid = total ? total + ' asset' + (total === 1 ? '' : 's') : 'Not set yet';
    return '<aside class="ukPanel ukSticky"><div class="ukPanel_head"><h3 class="ukPanel_title">What you are trading</h3></div>' +
      '<div class="ukTrade"><div class="ukTrade_side"><p class="ukTrade_l">You give</p>' +
        '<p class="ukTrade_v' + (f.nights ? '' : ' is-wait') + '">' + nightsSaid + '</p>' +
        '<p class="ukTrade_s">' + (f.inc ? esc(f.inc) : 'Add what the stay includes on step two') + '</p></div>' +
        '<span class="ukTrade_ar" aria-hidden="true">&harr;</span>' +
        '<div class="ukTrade_side"><p class="ukTrade_l">You get</p>' +
        '<p class="ukTrade_v' + (total ? '' : ' is-wait') + '">' + getsSaid + '</p>' +
        '<p class="ukTrade_s">' + (total ? 'Yours in perpetuity' : 'Choose deliverables on step four') + '</p></div></div>' +
      (total ? '<div class="ukChips" style="margin-top:14px">' + Object.keys(f.del).map(function (d) {
        return '<span class="ukChip">' + f.del[d] + ' × ' + d.toLowerCase() + '</span>'; }).join('') + '</div>' : '') +
      '<p class="ukWhy">Nights you were unlikely to sell become a content library you own and can use on every channel, for as long as you like.</p>' +
      '<p class="ukLead">You approve every creator who applies. Nothing is confirmed without you.</p>' +
    '</aside>';
  }

  /* ============================ invitations ============================
     Inviting from a stay is the multiple case: one stay, several creators, one
     send. Capacity governs — the hotel may deliberately ask more people than it
     has room for, and the panel says so plainly rather than letting them
     discover it when someone gets turned away. */
  function inviteStayPanel(st) {
    if (!st.inviteStay) return '';
    var I = window.UKINVITE, stay = D.stay(st.inviteStay);
    if (!stay) return '';
    var inv = I.ensure(stay.id, stay.capacity || 1);
    var left = I.slotsLeft(inv);
    var picked = st.invitePick || {};
    var nPicked = Object.keys(picked).length;
    var open = I.open(inv).length;

    return '<section class="ukPanel ukInvite"><div class="ukPanel_head">' +
      '<h3 class="ukPanel_title">Invite creators to ' + esc(stay.t) + '</h3>' +
      '<button class="ukGhost ukGhost--sm" type="button" data-invitestay-cancel>Cancel</button></div>' +
      '<p class="ukAsk">' + left + ' of ' + inv.capacity + ' slots left' +
        (open ? ', and ' + open + ' invitation' + (open === 1 ? '' : 's') + ' already out' : '') +
        '. You can ask more people than you have room for \u2014 whoever accepts first takes the slots, ' +
        'and the rest are told straight away.</p>' +
      '<label class="ukSearch ukInvite_q"><span data-icon="search"></span>' +
        '<input type="search" placeholder="Search a creator by name or city" value="' + esc(st.inviteQ || '') +
        '" data-inviteq aria-label="Search creators to invite"></label>' +
      '<ul class="ukInvitePick">' + D.creators.filter(function (c) {
        var q = (st.inviteQ || '').trim().toLowerCase();
        if (!q) return true;
        return (c.n + ' ' + c.loc + ' ' + (c.type || '')).toLowerCase().indexOf(q) > -1;
      }).map(function (c) {
        var state = I.stateFor(stay.id, c.id);
        var busy = state === 'sent' || state === 'accepted';
        var on = !!picked[c.id];
        return '<li><button class="ukInvitePick_i' + (on ? ' is-on' : '') + (busy ? ' is-off' : '') + '" ' +
          'type="button"' + (busy ? ' disabled' : '') + ' data-invitepick="' + c.id + '" ' +
          'aria-pressed="' + on + '">' +
          img(c.img, c.n, 'ukInvitePick_av') +
          '<span class="ukInvitePick_b"><span class="ukInvitePick_n">' + esc(c.n) + '</span>' +
          '<span class="ukInvitePick_m">' + esc(c.type) + (busy ? ' \u00b7 ' + (state === 'accepted' ? 'coming' : 'invited') : '') + '</span></span>' +
          (on ? '<span class="ukInvitePick_x" aria-hidden="true">' + TICK + '</span>' : '') +
        '</button></li>';
      }).join('') + '</ul>' +
      '<span class="ukHint" id="ukInviteHint" role="status" aria-live="polite">' +
        (nPicked > left ? 'That is ' + nPicked + ' invitations for ' + left + ' slot' + (left === 1 ? '' : 's') +
          ' \u2014 fine if you are expecting some to say no. They will each see that it is competitive.' : '') +
      '</span>' +
      '<button class="ukBtn" type="button" data-invitestay-send="' + stay.id + '">' +
        (nPicked ? 'Send ' + nPicked + ' invitation' + (nPicked === 1 ? '' : 's') : 'Send invitations') + '</button>' +
    '</section>';
  }

  /* who has been asked, and where each of them got to */
  function inviteStatus(stay) {
    var I = window.UKINVITE, inv = I.forStay(stay.id);
    if (!inv || !inv.invitees.length) return '';
    var LB = { sent:'Waiting', accepted:'Coming', declined:'Passed', filled:'Missed out' };
    var TAG = { sent:'wait', accepted:'you', declined:'done', filled:'done' };
    return '<div class="ukInviteSt"><p class="ukInviteSt_k">Invitations \u00b7 ' +
      I.slotsLeft(inv) + ' of ' + inv.capacity + ' slots left</p><ul>' +
      inv.invitees.map(function (i) {
        var c = D.creator(i.creator);
        if (!c) return '';
        return '<li>' + img(c.img, c.n, 'ukInviteSt_av') +
          '<span class="ukInviteSt_n">' + esc(c.n) + '</span>' +
          '<span class="ukTag ukTag--' + TAG[i.state] + '">' + LB[i.state] + '</span>' +
          (i.state === 'sent' ? '<button class="ukInviteSt_x" type="button" ' +
            'data-invite-cancelone="' + stay.id + '|' + c.id + '" aria-label="Withdraw the invitation to ' + esc(c.n) + '">Withdraw</button>' : '') +
        '</li>';
      }).join('') + '</ul></div>';
  }

  /* ============================ hosted stays ============================ */
  function stays(st) {
    var f = st.status || 'all';
    var list = D.stays.filter(function (s) { return f === 'all' || s.status === f; });
    var counts = { all: D.stays.length };
    ['live','draft','closed'].forEach(function (k) {
      counts[k] = D.stays.filter(function (s) { return s.status === k; }).length;
    });

    /* Same segmented control the collaboration lifecycle uses — one tab style in
       the product, not one per page. The primary action sits at the far right of
       that same line rather than floating above it. */
    return head('Hosted stays', 'Everything you have offered, and how many creators want it.',
      '<button class="ukBtn" type="button" data-goto="host">Host a creator</button>') +
      '<div class="ukToolbar ukToolbar--split">' +
        '<div class="ukFilters ukFilters--tabs" role="tablist" aria-label="Filter by status">' +
          [['all','All'],['live','Live'],['draft','Draft'],['closed','Closed']].map(function (t) {
            var on = t[0] === f;
            return '<button class="ukFilter' + (on ? ' is-on' : '') + '" type="button" role="tab" ' +
              'aria-selected="' + on + '" data-status="' + t[0] + '">' +
              '<span class="ukFilter_lb">' + t[1] + '</span>' +
              (counts[t[0]] ? '<span class="ukFilter_ct">' + counts[t[0]] + '</span>' : '') + '</button>';
          }).join('') +
        '</div>' +
      '</div>' +
      inviteStayPanel(st) +
      (function () { var pg = paginate(list, st.pgStays, 12, 'pgStays'); list = pg.rows; st.__pgS = pg.nav; return ''; })() +
      (list.length ? '<div class="ukStayGrid">' + list.map(function (s2, i2) {
          return stayListCard(s2, i2, { pop: st.stayPop, shot: st.prevShot });
        }).join('') + '</div>' + (st.__pgS || '')
        : empty('Nothing with that status', 'Switch the filter, or offer a stay to start receiving applications.',
                '<button class="ukBtn" type="button" data-goto="host">Host a creator</button>'));
  }

  /* One stay, as a card: the photograph is the thing, so it runs to the card's
     own corners and the text sits under it at a single consistent inset. The
     facts are a two-up grid rather than a stack, which is what made the old card
     so tall for so little. */
  /* Hosted stays renders the SAME stay card as the preview and the ROI tab. It had
     its own shape — a dl of four facts under a flush photograph — which is why the
     give/get panels, the inset picture, the gallery and the capped "+N" all landed
     everywhere except the page a hotel actually manages its stays from. The only
     thing that differs here is the foot: this page's own numbers and its own two
     actions. */
  function stayListCard(s, i, opts) {
    opts = opts || {};
    var I = window.UKINVITE;
    var inv = I ? I.forStay(s.id) : null;
    /* "3 of 3 left" leaves the reader to work out three of three what. */
    var cap = inv ? inv.capacity : (s.capacity || 1);
    var left = inv
      ? I.slotsLeft(inv) + ' of ' + cap + (cap === 1 ? ' creator left' : ' creators left')
      : cap + (cap === 1 ? ' creator' : ' creators');

    return stayCard({
      id: s.id, t: s.t, img: s.img, shots: s.imgs || null,
      nights: s.nights, rooms: s.rooms, inc: s.inc, incList: s.incList || null,
      rights: s.rights, del: s.del,
      status: s.status
    }, { from: s.from, to: s.to }, {
      eager: i < 3,
      shot: opts.shot,
      pop: opts.pop,
      tag: '<span class="ukTag ukTag--' + (s.status === 'live' ? 'you' : s.status === 'draft' ? 'wait' : 'done') +
        ' ukStayCard_tag">' + esc(s.status) + '</span>',
      foot: (opts.actions === false ? (opts.foot || '') :
        numbers2([['Applied', s.apps + ' creators'], ['Capacity', left]]) +
        inviteStatus(s) +
        '<div class="ukStayCard_act">' +
          '<button class="ukBtn ukBtn--sm" type="button" data-invitestay-open="' + s.id + '">Invite creators</button>' +
          '<button class="ukGhost ukGhost--sm" type="button" data-goto="collabs">' +
            (s.apps ? 'Review ' + s.apps : 'Open') + '</button>' +
        '</div>' + (opts.foot || ''))
    });
  }

  /* the same numbers strip the ROI cards use, so a stay reads the same way
     wherever its figures appear */
  function numbers2(pairs) {
    return '<dl class="ukCardNums" style="--n:' + pairs.length + '">' + pairs.map(function (p) {
      return '<div class="ukCardNum"><dd class="ukCardNum_v">' + esc(String(p[1])) +
        '</dd><dt class="ukCardNum_l">' + esc(p[0]) + '</dt></div>';
    }).join('') + '</dl>';
  }


  /* ============================ content library ============================ */
  /* Videos and Photos sit above as a pair of switches; everything else is a menu
     on one row. Each menu is a SET rather than one value — "the drone shots
     Kelvis made on the summer stay, for TikTok" is one question, and single-value
     filters made it four. Within a filter the picks are OR, across filters they
     are AND, the same rule the creators page already teaches. */
  var LIBF = [
    { k:'fStay', lb:'Stay',          none:'All stays',     many:'stays' },
    { k:'fBy',   lb:'Creator',       none:'All creators',  many:'creators' },
    /* What it IS, from the eight formats the creator onboarding asks for */
    { k:'fFmt',  lb:'They make',     none:'Any format',    many:'formats' },
    /* What it is ABOUT, from the same subject list a creator declares */
    { k:'fNiche',lb:'Content type',  none:'All types',     many:'types' },
    { k:'fPlat', lb:'Platform',      none:'All platforms', many:'platforms' }
  ];
  function libVals(a, key) {
    return key === 'fStay'  ? [a.stay]
         : key === 'fBy'    ? [a.by]
         : key === 'fFmt'   ? [a.fmt]
         : key === 'fNiche' ? [a.niche]
         : [a.plat];
  }
  function libSel(st, key) {
    var v = st[key];
    return Array.isArray(v) && v.length ? v : null;
  }
  /* skip lets a filter count its own options against everything EXCEPT itself,
     which is what makes the counts read as "picking this as well would give me N"
     instead of collapsing to the current selection. */
  function libPass(a, st, skip) {
    return LIBF.every(function (f) {
      if (f.k === skip) return true;
      var sel = libSel(st, f.k);
      if (!sel) return true;
      return libVals(a, f.k).some(function (v) { return sel.indexOf(v) > -1; });
    });
  }
  function libName(key, v) {
    if (key === 'fStay') { var s = D.stay(v); return s ? s.t : v; }
    if (key === 'fBy')   { var c = D.creator(v); return c ? c.n : v; }
    if (key === 'fPlat') return PLAT_NAME[v] || v;
    return v;
  }
  /* only ever offer a value that something in the library actually carries: a
     filter that can only return nothing is worse than no filter */
  function libOptions(all, key) {
    var seen = {}, out = [];
    all.forEach(function (a) {
      libVals(a, key).forEach(function (v) { if (v && !seen[v]) { seen[v] = 1; out.push(v); } });
    });
    if (key === 'fPlat') return PLATFORMS.map(function (p) { return p.k; }).filter(function (v) { return seen[v]; });
    /* formats and subjects keep the ORDER THEY ARE DECLARED IN, because the
       onboarding lists them that way and the two screens should agree */
    var VOC = window.UKVOCAB || {};
    var order = key === 'fFmt' ? VOC.FORMATS : key === 'fNiche' ? VOC.SHOOTS : null;
    if (order) return order.filter(function (v) { return seen[v]; });
    return out.sort(function (a, b) { return libName(key, a).localeCompare(libName(key, b)); });
  }

  /* one glyph out of the exported pack, on its own 24 canvas like everywhere else */
  function ic(name, cls) {
    return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      ((window.UKICONS || {})[name] || '') + '</svg>';
  }

  var LIB_CHEV = '<svg class="ukDrop_car" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="m6 9 6 6 6-6"/></svg>';
  var LIB_TICK = '<span class="ukDropMenu_box" aria-hidden="true">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" ' +
    'stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg></span>';

  function libDrop(f, all, st) {
    var sel = st[f.k] || [];
    var opts = libOptions(all, f.k);
    var pool = all.filter(function (a) { return libPass(a, st, f.k); });
    var ic = f.k === 'fBy' || f.k === 'fPlat';
    /* One pick names itself. Beyond that it is counted, because three stay titles
       spelled out in a button is a paragraph, not a label. */
    var lbl = !sel.length ? f.none
            : sel.length === 1 ? libName(f.k, sel[0])
            : sel.length + ' ' + f.many;

    function mark(v) {
      if (f.k === 'fPlat') {
        var m = PLAT_MARK[v];
        return m ? '<img src="' + m + '" alt="" width="16" height="16" loading="lazy" decoding="async">' : '';
      }
      var c = D.creator(v);
      return c ? '<img class="ukDropMenu_av" src="' + c.img + '" alt="" width="20" height="20" ' +
        'loading="lazy" decoding="async">' : '';
    }

    return '<div class="ukDrop"><button class="ukDrop_b" type="button" data-drop-toggle ' +
      'aria-haspopup="menu" aria-expanded="false">' +
      '<span class="ukDrop_k">' + f.lb + '</span>' +
      '<span class="ukDrop_v">' +
        (f.k === 'fPlat' && sel.length
          ? '<span class="ukDrop_marks">' + sel.slice(0, 3).map(function (v) {
              var m = PLAT_MARK[v];
              return m ? '<img src="' + m + '" alt="' + esc(libName(f.k, v)) + '" title="' +
                esc(libName(f.k, v)) + '" width="15" height="15" loading="lazy" decoding="async">' : '';
            }).join('') +
            (sel.length > 3 ? '<span class="ukDrop_more">+' + (sel.length - 3) + '</span>' : '') +
            '</span>' + (sel.length === 1 ? esc(lbl) : '')
          : esc(lbl)) +
      '</span>' + LIB_CHEV + '</button>' +
      '<div class="ukDropMenu ukDropMenu--multi" hidden role="menu">' +
        '<button class="ukDropMenu_i' + (ic ? ' ukDropMenu_i--ic' : '') + (sel.length ? '' : ' is-sel') + '" ' +
          'role="menuitemcheckbox" aria-checked="' + !sel.length + '" data-mset="' + f.k + '" data-mval="all">' +
          LIB_TICK + (ic ? '<span class="ukDropMenu_gap" aria-hidden="true"></span>' : '') + f.none + '</button>' +
        opts.map(function (v) {
          var on = sel.indexOf(v) > -1;
          var n = pool.filter(function (a) { return libVals(a, f.k).indexOf(v) > -1; }).length;
          return '<button class="ukDropMenu_i' + (ic ? ' ukDropMenu_i--ic' : '') + (on ? ' is-sel' : '') +
            (n ? '' : ' is-empty') + '" role="menuitemcheckbox" aria-checked="' + on + '" ' +
            'data-mset="' + f.k + '" data-mval="' + esc(v) + '">' + LIB_TICK +
            (ic ? mark(v) : '') +
            '<span class="ukDropMenu_lb">' + esc(libName(f.k, v)) + '</span>' +
            '<span class="ukDropMenu_ct">' + n + '</span></button>';
        }).join('') +
      '</div></div>';
  }

  function library(st) {
    var owned = D.owned();
    /* Videos and Photos, and nothing else on that line but the download. They
       are a SET like every other filter here, which is what gives you back
       "both" without an Everything tab standing next to them: neither lit and
       both lit are the same library, so the pair reads as two switches rather
       than three tabs where one is only there to undo the other two. */
    var kinds = Array.isArray(st.fKind) && st.fKind.length ? st.fKind : null;
    var all = owned.filter(function (a) { return !kinds || kinds.indexOf(a.k) > -1; });
    var list = all.filter(function (a) { return libPass(a, st, null); });
    var picks = [];
    LIBF.forEach(function (f) {
      (st[f.k] || []).forEach(function (v) { picks.push({ f:f, v:v }); });
    });
    /* the kind counts read through the menus: with a creator picked, Videos says
       how many of THEIRS there are, not how many exist */
    function kindCount(kind) {
      return owned.filter(function (a) { return a.k === kind && libPass(a, st, null); }).length;
    }
    var KINDS = [['video','Videos'],['photo','Photos']];

    return head('Content library',
      'Everything you have approved. Yours in perpetuity, on every channel, with no expiry.') +
      '<div class="ukLibTop">' +
        '<div class="ukFilters ukFilters--tabs ukLibTabs" role="group" aria-label="Videos or photos">' +
          KINDS.map(function (t) {
            var on = kinds ? kinds.indexOf(t[0]) > -1 : true, n = kindCount(t[0]);
            return '<button class="ukFilter' + (on ? ' is-on' : '') + '" type="button" ' +
              'aria-pressed="' + on + '" data-mset="fKind" data-mval="' + t[0] + '">' +
              '<span class="ukFilter_lb">' + t[1] + '</span>' +
              (n ? '<span class="ukFilter_ct">' + n + '</span>' : '') + '</button>';
          }).join('') + '</div>' +
        /* with anything on, "Download all" would be a lie about which files you
           are about to get, so the button names the set that is on screen */
        '<button class="ukGhost" type="button" data-ack="Preparing">' +
          (picks.length || (kinds && kinds.length < KINDS.length) ? 'Download these' : 'Download all') +
        '</button>' +
      '</div>' +
      '<div class="ukToolbar ukCrBar ukLibBar">' +
        '<div class="ukCrBar_l">' + LIBF.map(function (f) { return libDrop(f, all, st); }).join('') + '</div>' +
      '</div>' +
      /* Six menus can hide what is on. Every pick is also a chip you can lift
         off, so undoing one narrower never means hunting for the menu it came
         from. The chip carries the same data-mset pair, so it toggles the same
         value the menu row does. */
      (picks.length
        ? '<div class="ukChips ukChips--filters">' + picks.map(function (p) {
            return '<button class="ukChip ukChip--x" type="button" data-mset="' + p.f.k + '" ' +
              'data-mval="' + esc(p.v) + '" aria-label="Remove ' + esc(libName(p.f.k, p.v)) + '">' +
              esc(libName(p.f.k, p.v)) + '<span aria-hidden="true">&times;</span></button>';
          }).join('') +
          '<button class="ukChip ukChip--clear" type="button" data-libclear>Clear all</button></div>'
        : '') +
      (function () { var pg = paginate(list, st.pgLib, 16, 'pgLib'); list = pg.rows; st.__pgL = pg.nav; return ''; })() +
      (list.length
        ? '<div class="ukLib">' + list.map(libItem).join('') + '</div>' + (st.__pgL || '')
        : picks.length
          ? empty('Nothing matches all of that',
                  'The library holds ' + owned.length + ' approved files. Lifting one of the filters above usually brings a few back.',
                  '<button class="ukBtn" type="button" data-libclear>Clear the filters</button>')
          : empty('Nothing here yet', 'Content lands here the moment you approve a delivery.',
                  '<button class="ukBtn" type="button" data-goto="collabs">See your collaborations</button>'));
  }

  /* Video is 16:9, photos stay 4:3, and both carry their detail on the frame over
     a gradient rather than in a white block underneath. Mixed ratios sit together
     because each tile owns its own aspect rather than the grid forcing one. */
  function libItem(a, i) {
    var cr = D.creator(a.by);
    var isV = a.k === 'video';
    return '<figure class="ukLib_i' + (isV ? ' is-video' : '') + '">' +
      '<div class="ukLib_m">' + img(a.img, a.t, 'ukLib_img', i < 6) +
        '<span class="ukLib_scrim" aria-hidden="true"></span>' +
        (isV
          ? '<button class="ukPost_play" type="button" data-play="' + a.id + '" aria-label="Play ' + esc(a.t) + '">' +
            playMark() + '</button>' +
            '<span class="ukPost_len">' + esc(a.len || '') + '</span>'
          : '') +
        '<button class="ukLib_dl" type="button" data-ack="Saved" aria-label="Download ' + esc(a.t) + '">Download</button>' +
        '<figcaption class="ukLib_b">' +
          '<span class="ukLib_t">' + esc(a.t) + '</span>' +
          /* on a narrow tile the line breaks, and left alone it broke INSIDE the
             date. It may only break at the middot, so the date stays one thing. */
          '<span class="ukLib_by">' + who(cr, esc(cr.n)) +
            ' &middot; <span class="ukLib_on">' + esc(a.on) + '</span></span>' +
        '</figcaption>' +
      '</div></figure>';
  }

  /* ============================ settings ============================ */
  var SET = [
    { id:'account',  t:'Account' },
    /* Status, not setup. There is nothing to connect here and deliberately no
       button that pretends otherwise: which booking engine a property runs and
       what it can pass through is a conversation with Ukreate, not a toggle. What
       the hotel needs from this screen is to know where they stand and what to
       quote when they ask. */
    { id:'tracking', t:'Booking tracking' },
    { id:'billing',  t:'Plan & billing' },
    { id:'notify',   t:'Notifications' },
    { id:'team',     t:'Team' }
  ];

  function settings(st) {
    /* Property profile is its own page in the account menu, not a settings tab —
       it was reachable two ways and the two could show different things. */
    var tab = st.tab && SET.some(function (s2) { return s2.id === st.tab; }) ? st.tab : SET[0].id;
    return head('Settings', 'Your property, your account and who else can see it.') +
      '<div class="ukGrid ukGrid--set">' +
        '<nav class="ukPanel ukSetNav" aria-label="Settings sections">' + SET.map(function (s) {
          return '<button class="ukSetNav_i' + (s.id === tab ? ' is-on' : '') + '" type="button" data-tab="' + s.id + '"' +
                 (s.id === tab ? ' aria-current="true"' : '') + '>' + s.t + '</button>';
        }).join('') + '</nav>' +
        '<div>' + (
          tab === 'account'  ? setAccount() :
          tab === 'tracking' ? setTracking() :
          tab === 'billing'  ? setBilling() :
          tab === 'notify'   ? setNotify() : setTeam(st)
        ) + '</div>' +
      '</div>';
  }

  function field(l, v, hint) {
    return '<label class="ukField"><span class="ukField_l">' + l + '</span>' +
      '<input class="ukField_i" value="' + esc(v) + '">' +
      (hint ? '<span class="ukHint">' + hint + '</span>' : '') + '</label>';
  }
  function area(l, v, hint) {
    return '<label class="ukField"><span class="ukField_l">' + l + '</span>' +
      '<textarea class="ukField_i" rows="3">' + esc(v) + '</textarea>' +
      (hint ? '<span class="ukHint">' + hint + '</span>' : '') + '</label>';
  }
  function toggle(l, on, hint) {
    return '<div class="ukToggle"><span><span class="ukToggle_l">' + l + '</span>' +
      (hint ? '<span class="ukHint">' + hint + '</span>' : '') + '</span>' +
      '<button class="ukSwitch' + (on ? ' is-on' : '') + '" type="button" role="switch" aria-checked="' + (on ? 'true':'false') +
      '" aria-label="' + esc(l) + '"><span></span></button></div>';
  }

  /* Its own page rather than a tab inside Settings: it is the thing creators
     actually look at when deciding whether to apply, so it is not an
     administrative preference. Reached from the account menu, like Guest guide. */
  /* ================= the property, in numbers =================
     A property profile that is only a form tells the hotel nothing about how it
     is doing. These read off the same records the rest of the app runs on — the
     stays offered, who applied, what has been delivered, and what the content
     has actually driven — so the page is a mirror as well as an editor. */
  function propertyStats() {
    var CH = window.UKCHART;
    if (!CH) return '';
    var stays = D.stays || [];
    var live = stays.filter(function (x) { return x.status === 'live'; }).length;
    var draft = stays.filter(function (x) { return x.status === 'draft'; }).length;
    var closed = stays.filter(function (x) { return x.status === 'closed'; }).length;
    var apps = stays.reduce(function (a, x) { return a + (x.apps || 0); }, 0);
    var owned = (D.assets || []).filter(function (a) { return a.owned; });
    var vid = owned.filter(function (a) { return a.k === 'video'; }).length;
    var hosted = (D.collabs || []).filter(function (c) { return c.stage >= 4; }).length;
    /* The two booking charts below read attribution, so they only exist for a
       property whose tracking is live. Everything else on this page counts stays,
       applications and files, which are true regardless. Emptying the arrays is
       enough: both cards are already gated on having something to draw. */
    var trend = D.trackingLive() ? (D.trend || []) : [];
    var perf = D.trackingLive()
      ? (D.contentPerf || []).filter(function (r) { return r.bookings; }) : [];

    /* the stays that people actually applied to, biggest first */
    var top = stays.filter(function (x) { return x.apps; })
      .sort(function (a, b) { return b.apps - a.apps; }).slice(0, 6);

    return '<div class="ukBento ukBento--prop">' +
        pnum(String(stays.length), 'stays offered', live + ' live right now') +
        pnum(String(apps), 'creators applied', 'across every stay') +
        pnum(String(hosted), 'creators hosted', 'start to finish') +
        pnum(String(owned.length), 'files you own', vid + ' video, ' + (owned.length - vid) + ' photo') +
      '</div>' +

      '<div class="ukGrid">' +
        (top.length > 1
          ? '<section class="ukPanel"><div class="ukPanel_head">' +
              '<h3 class="ukPanel_title">Which stays creators want</h3>' +
              '<button class="ukGhost" type="button" data-goto="stays">Hosted stays</button></div>' +
              '<p class="ukAsk">Applications per stay. The shape of this is the clearest signal you have ' +
              'about what to offer next.</p>' +
              CH.capsules({ data: top.map(function (x, i) {
                return { k:x.t, v:x.apps, hi:i === 0 }; }), unit:'applied', label:'Applications by stay' }) +
            '</section>'
          : '') +
        (live + draft + closed
          ? '<section class="ukPanel"><div class="ukPanel_head">' +
              '<h3 class="ukPanel_title">Where your stays stand</h3></div>' +
              '<p class="ukAsk">A draft is invisible to creators until you publish it.</p>' +
              CH.segbar({ segs: [
                { l:'Live', v:live }, { l:'Draft', v:draft, pending:true }, { l:'Closed', v:closed }
              ].filter(function (x) { return x.v; }), unit:'stays', label:'Stays by state' }) +
            '</section>'
          : '') +
      '</div>' +

      '<div class="ukGrid">' +
        (trend.length > 1
          ? '<section class="ukPanel"><div class="ukPanel_head">' +
              '<h3 class="ukPanel_title">Direct bookings the content drove</h3>' +
              '<button class="ukGhost" type="button" data-goto="roi">Bookings &amp; ROI</button></div>' +
              '<p class="ukAsk">Bookings traced to a creator link or code, month by month.</p>' +
              CH.area({ data: trend.map(function (r, i, a) {
                return { k:r.m, v:r.bookings, hi:i === a.length - 1 }; }),
                unit:'bookings', label:'Direct bookings by month' }) +
            '</section>'
          : '') +
        (perf.length > 1
          ? '<section class="ukPanel"><div class="ukPanel_head">' +
              '<h3 class="ukPanel_title">The content that books rooms</h3>' +
              '<button class="ukGhost" type="button" data-goto="library">Content library</button></div>' +
              '<p class="ukAsk">Not the most watched — the most booked. They are rarely the same piece.</p>' +
              CH.capsules({ data: perf.map(function (r, i) {
                var a = D.asset(r.asset);
                return { k: a ? a.t : r.asset, v:r.bookings, hi:i === 0 }; }),
                unit:'bookings', label:'Bookings by piece of content' }) +
            '</section>'
          : '') +
      '</div>';
  }
  function pnum(v, l, n) {
    return '<article class="ukK c3"><p class="ukK_l">' + esc(l) + '</p>' +
      '<p class="ukK_v">' + v + '</p>' +
      '<p class="ukK_n"><span>' + esc(n) + '</span></p></article>';
  }

  function propertyPage(st) {
    return head('Property profile',
      'What creators see when your stays appear in the network.') +
      propertyStats() +
      '<div class="ukGrid ukGrid--thread"><div>' + setProperty({ bare: true }) + '</div>' +
      '<aside class="ukSideCol">' +
        '<section class="ukPanel"><div class="ukPanel_head">' +
        '<h3 class="ukPanel_title">How this is used</h3></div>' +
        '<p class="ukAsk">This is the profile attached to every stay you offer. A creator reads it before ' +
        'deciding whether to apply, so specifics beat adjectives.</p>' +
        '<dl class="ukFacts ukFacts--stack">' +
          '<div><dt>Stays offered</dt><dd>' + D.stays.length + '</dd></div>' +
          '<div><dt>Creators hosted</dt><dd>' + D.collabs.filter(function (c) { return c.stage === 4; }).length + '</dd></div>' +
          '<div><dt>Guest guide</dt><dd>' + ((D.guides && D.guides[0] && D.guides[0].live) ? 'Published' : 'Draft') + '</dd></div>' +
        '</dl>' +
        '<button class="ukGhost" type="button" data-goto="guides" style="width:100%;margin-top:14px">Open the guest guide</button>' +
        '</section></aside></div>';
  }

  function setProperty(opts) {
    var p = D.property;
    opts = opts || {};
    return '<section class="ukPanel">' +
      (opts.bare ? '' : '<div class="ukPanel_head"><h3 class="ukPanel_title">Property profile</h3></div>') +
      '<p class="ukAsk">This is what creators see before they apply. Properties with photos get roughly three times the applications.</p>' +
      img(p.img, p.name, 'ukSetImg') +
      '<button class="ukGhost" type="button" data-ack="Uploaded" style="margin:12px 0 20px">Replace cover photo</button>' +
      field('Property name', p.name) + field('City', p.city) + field('Property type', p.type) +
      field('What you are known for', p.cat, 'Used to match you with the right creators.') +
      area('About the property', p.about) +
      '<button class="ukBtn" type="button" data-ack="Saved">Save changes</button></section>';
  }
  function setAccount() {
    return '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">Account</h3></div>' +
      field('Your name', 'Robert Torres') + field('Email', 'robert@miragrace.com') +
      field('Phone', '+1 305 555 0148') +
      '<div class="ukRule"></div>' +
      '<h4 class="ukSub">Password</h4>' +
      '<p class="ukHint" style="margin-bottom:14px">Last changed 4 months ago.</p>' +
      '<button class="ukGhost" type="button" data-ack="Email sent">Send a reset link</button>' +
      '<div class="ukRule"></div>' +
      '<h4 class="ukSub">Sign out</h4>' +
      '<p class="ukHint" style="margin-bottom:14px">Signs you out on this device only.</p>' +
      '<button class="ukGhost" type="button" data-signout>Sign out</button></section>';
  }
  /* ---- booking tracking, in Settings ----
     Read-mostly on purpose. Status, the identifiers Ukreate reconciles this
     property against, and where the state goes next. No connect buttons for a
     PMS or for Partnerize: those integrations are engineering work agreed off
     platform, and a button here would promise a hotel something this screen
     cannot deliver. When tracking is live the panel is a receipt; when it is not,
     the same explanation the ROI page carries sits underneath, so a hotel that
     lands here from the account menu gets the whole answer in one place. */
  function setTracking() {
    var T = window.UKTRACK;
    var live = D.trackingLive();
    /* Status first, then the identifiers, then the route onward, in one panel.
       An earlier pass put the full ROI explanation underneath as a second panel
       and the screen said the same thing twice in a row. The explanation belongs
       to the page that has nothing else to show; this screen only has to answer
       where you stand and what to quote. */
    return '<section class="ukPanel">' +
        '<div class="ukPanel_head"><h3 class="ukPanel_title">Booking tracking</h3>' + T.pill() + '</div>' +
        '<p class="ukAsk">' + (live
          ? 'Bookings made through your creators’ links and codes are reported back to Ukreate and ' +
            'attributed on your Bookings and ROI page.'
          : esc(T.state().short) + ' ' + esc(T.state().apart)) +
        '</p>' +
        '<button class="ukGhost" type="button" data-goto="roi">' +
          (live ? 'Open Bookings and ROI' : 'See what tracking shows you') + '</button>' +
        '<div class="ukRule"></div>' +
        '<h4 class="ukSub">What Ukreate reconciles you against</h4>' +
        '<p class="ukHint" style="margin-bottom:2px">Ukreate holds these. You are never asked to set them ' +
          'up yourself, and nothing here is a credential.</p>' +
        T.refs() +
        (live ? '' :
          '<div class="ukRule"></div>' +
          '<h4 class="ukSub">What happens next</h4>' +
          '<p class="ukTrackState_next">' + esc(T.state().next) + '</p>' +
          '<button class="ukBtn" type="button" data-ack="' + esc(T.state().ack) + '">' +
            esc(T.state().cta) + '</button>') +
      '</section>';
  }
  function setBilling() {
    return '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">Plan &amp; billing</h3></div>' +
      '<div class="ukPlan"><div><p class="ukPlan_n">Hotel Access</p>' +
        '<p class="ukPlan_p">Browse and contact all ' + D.creators.length + ' vetted creators, unlimited hosted stays, full content library.</p></div>' +
        '<p class="ukPlan_v">$299<em>a month</em></p></div>' +
      '<p class="ukWhy">Posting a stay is always free. This tier is for browsing and contacting the network directly.</p>' +
      '<div class="ukRule"></div>' +
      '<h4 class="ukSub">Payment method</h4>' +
      '<p class="ukHint" style="margin-bottom:14px">Visa ending 4242, renews 12 August 2026.</p>' +
      '<button class="ukGhost" type="button" data-ack="Opened">Update payment method</button>' +
      '<div class="ukRule"></div>' +
      '<h4 class="ukSub">Invoices</h4>' +
      '<ul class="ukList">' + ['12 Jul 2026','12 Jun 2026','12 May 2026'].map(function (d) {
        return '<li><span class="ukList_body"><span class="ukList_name">Hotel Access</span>' +
          '<span class="ukList_meta">Paid ' + d + '</span></span><span class="ukWhen">$299.00</span>' +
          '<button class="ukGhost" type="button" data-ack="Saved">PDF</button></li>'; }).join('') + '</ul></section>';
  }
  /* Real preferences, wired to the same store the bell reads. These were five
     decorative toggles that saved nothing; a kind switched off here is not
     generated at all, so it never arrives and sits unread. */
  function setNotify() {
    var N = window.UKNOTIFY;
    if (!N) return '';
    var on = N.prefs();
    return '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">Notifications</h3>' +
      '<span class="ukCount">' + N.unread().length + ' unread</span></div>' +
      '<p class="ukAsk">What the bell tells you about. Anything switched off is never raised, ' +
      'so it will not arrive and sit there unread.</p>' +
      N.KINDS.map(function (k) {
        var isOn = on[k.k];
        return '<div class="ukToggleRow">' +
          '<div class="ukToggleRow_b"><p class="ukToggleRow_t">' + esc(k.t) + '</p>' +
            '<p class="ukToggleRow_s">' + esc(k.d) + '</p></div>' +
          '<button class="ukSwitch' + (isOn ? ' is-on' : '') + '" type="button" role="switch" ' +
            'aria-checked="' + isOn + '" data-notify-pref="' + k.k + '" ' +
            'aria-label="' + esc(k.t) + '"><span class="ukSwitch_k"></span></button>' +
        '</div>';
      }).join('') +
      '<div class="ukNotifyPrefs_act">' +
        '<button class="ukGhost" type="button" data-notify-clear>Mark everything read</button>' +
      '</div></section>';
  }

  function setTeam(st) {
    var inviting = st.invite;
    var role = st.inviteRole || 'manager';
    var err = st.inviteErr;
    return '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">Team</h3>' +
      (inviting ? '' : '<button class="ukBtn" type="button" data-invite="open">Invite someone</button>') + '</div>' +
      '<p class="ukAsk">Anyone you add can help run hosted stays. Only owners can change billing or remove people.</p>' +

      (inviting
        ? '<div class="ukInvite">' +
            '<h4 class="ukSub">Invite someone to ' + esc(D.property.name) + '</h4>' +
            '<label class="ukField"><span class="ukField_l">Work email</span>' +
            '<input class="ukField_i" id="ukInviteEmail" type="email" placeholder="name@yourproperty.com" ' +
            'value="' + esc(st.inviteEmail || '') + '" data-f="inviteEmail"></label>' +
            (err ? '<p class="ukMissing">' + esc(err) + '</p>' : '') +
            '<p class="ukField_l">What can they do?</p>' +
            '<div class="ukRolePick">' + D.ROLES.filter(function (r) { return r.id !== 'owner'; }).map(function (r) {
              return '<button class="ukOpt' + (role === r.id ? ' is-on' : '') + '" type="button" ' +
                'data-invrole="' + r.id + '" aria-pressed="' + (role === r.id ? 'true' : 'false') + '">' +
                '<span class="ukOpt_t">' + r.n + '</span><span class="ukOpt_w">' + esc(r.can) + '</span></button>';
            }).join('') + '</div>' +
            '<div class="ukNav2_r" style="margin-top:16px">' +
              '<button class="ukGhost" type="button" data-invite="cancel">Cancel</button>' +
              '<button class="ukBtn" type="button" data-invite="send">Send invitation</button></div>' +
          '</div>'
        : '') +

      (D.team.length
        ? '<ul class="ukList ukTeam">' + D.team.map(function (m) {
            var r = D.ROLES.filter(function (x) { return x.id === m.role; })[0];
            var owner = m.role === 'owner';
            return '<li>' +
              '<span class="ukList_av">' + D.initials(m.n) + '</span>' +
              '<span class="ukList_body"><span class="ukList_name">' + esc(m.n) +
                (m.status === 'invited' ? ' <span class="ukTag ukTag--wait">Invited</span>' : '') + '</span>' +
                '<span class="ukList_meta">' + esc(m.e) + ' · ' + esc(m.since) + '</span></span>' +
              (owner
                ? '<span class="ukTag ukTag--you">Owner</span>'
                : '<span class="ukRoleSel"><label class="ukSrOnly" for="role-' + m.id + '">Role for ' + esc(m.n) + '</label>' +
                  '<select class="ukSelect" id="role-' + m.id + '" data-role="' + m.id + '">' +
                  D.ROLES.filter(function (x) { return x.id !== 'owner'; }).map(function (x) {
                    return '<option value="' + x.id + '"' + (x.id === m.role ? ' selected' : '') + '>' + x.n + '</option>';
                  }).join('') + '</select></span>') +
              (owner ? '' :
                '<button class="ukGhost ukDanger" type="button" data-drop="' + m.id + '" ' +
                'data-name="' + esc(m.n) + '">' + (m.status === 'invited' ? 'Revoke' : 'Remove') + '</button>') +
            '</li>';
          }).join('') + '</ul>'
        : '<div class="ukEmpty"><p class="ukEmpty_t">Just you so far</p>' +
          '<p class="ukEmpty_p">Invite whoever covers the front desk. They can approve content when you are away.</p></div>') +

      '<div class="ukRule"></div>' +
      '<h4 class="ukSub">What each role can do</h4>' +
      '<ul class="ukRoleKey">' + D.ROLES.map(function (r) {
        return '<li><span class="ukRoleKey_n">' + r.n + '</span><span class="ukRoleKey_c">' + esc(r.can) + '</span></li>';
      }).join('') + '</ul></section>';
  }

  return {
    dashboard: dashboard, collabs: collabs, host: host, stays: stays,
 library: library, settings: settings, empty: empty,
    creatorHead: creatorHead, stayCard: stayCard, favIcon: favIcon, starsOut: starsOut, reviewBlock: reviewBlock, PLATFORMS: PLATFORMS, PLAT_MARK: PLAT_MARK, availOf: availOf, creatorCard: creatorCard, crPopup: crPopup, head: head, who: who, paginate: paginate, stayListCard: stayListCard,
    property: propertyPage
  };
})();
