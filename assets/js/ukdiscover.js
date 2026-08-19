/* Ukreate — Discover (creator side only).
   Feed first, curation second. This is the platform's own delivered work,
   browsable for inspiration — the Pinterest model, not a blank mood board.
   Every card reuses the hotel side's Content library patterns (.ukLib*
   grid, .ukDrop multi-select filters, .ukFilters--tabs for its own primary
   Feed/Saved split) rather than a parallel system, and every media slot
   points at the same MEDIA manifest the rest of the app already uses. No
   new media files, no new content records beyond the metadata below. */
(function () {
  var D = window.UKC, V = window.UKCV;
  if (!D || !V) return;

  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) {
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; }); };
  var m = V.media, head = V.head, empty = V.empty, paginate = V.paginate;

  /* ---------------- the feed itself ----------------
     Every `m` key below is one already declared in ukcdata.js's MEDIA
     manifest — no new image or video files. `stay` points at an existing
     seeded stay, which supplies the property and market context. `by` is
     a display identity for another creator on the platform: real Amara is
     the signed-in account, these reuse the same numbered avatar set her
     own avatar comes from (assets/img/fc/av/), just a different frame —
     no new portraits were added.
     `perf` is real, reused engagement data in the same shape D.me.work
     already carries (plays/saves) — never fabricated bookings or clicks.
     Where a piece genuinely has nothing behind it yet, perf is null and
     the detail view shows nothing rather than a made-up number.
     Consent lives in the Terms of Service now (see /join/, /terms/), not
     as a flag on each piece — agreeing once at signup is what makes a
     creator's delivered work eligible here, the same way the rest of
     those terms apply once rather than per action. There is deliberately
     no per-item consent field to fall out of sync with that. */
  var AV = '/assets/img/fc/av/av-';
  D.discover = [
    { id:'d1', m:'reel1', t:'Sunset arrival at the riad', stay:'s3',
      by:{ n:'Priya Nair', av:AV+'02.jpg' }, format:'Reels', niche:'Culture & city',
      perf:{ plays:52300, saves:2380 } },
    { id:'d2', m:'reel4', t:'Rooftop, golden hour', stay:'s9',
      by:{ n:'Omar Farouk', av:AV+'03.jpg' }, format:'UGC video', niche:'Luxury & design',
      perf:{ plays:38900, saves:1710 } },
    { id:'d3', m:'shot2', t:'Poolside styling test', stay:'s9',
      by:{ n:'Priya Nair', av:AV+'02.jpg' }, format:'Photos', niche:'Luxury & design',
      perf:null },
    { id:'d4', m:'reel2', t:'Room tour, garden suite', stay:'s11',
      by:{ n:'Haruto Sato', av:AV+'04.jpg' }, format:'UGC video', niche:'Culture & city',
      perf:{ plays:24700, saves:990 } },
    { id:'d5', m:'reel5', t:'Chalet morning, first snow', stay:'s10',
      by:{ n:'Lena Fischer', av:AV+'05.jpg' }, format:'Reels', niche:'Mountain & ski',
      perf:{ plays:44100, saves:2050 } },
    { id:'d6', m:'shot4', t:'Spa detail, quiet hour', stay:'s1',
      by:{ n:'Priya Nair', av:AV+'02.jpg' }, format:'Photos', niche:'Wellness & spa',
      perf:{ plays:15200, saves:860 } },
    { id:'d7', m:'reel6', t:'Beach house, first light', stay:'s8',
      by:{ n:'Amina Kassim', av:AV+'06.jpg' }, format:'Reels', niche:'Beach & islands',
      perf:{ plays:61200, saves:3040 } },
    { id:'d8', m:'shot3', t:'Market walk, old town', stay:'s14',
      by:{ n:'Omar Farouk', av:AV+'03.jpg' }, format:'Photos', niche:'Culture & city',
      perf:null },
    { id:'d9', m:'reel3', t:'Terrace breakfast, slow morning', stay:'s2',
      by:{ n:'Diego Morales', av:AV+'07.jpg' }, format:'UGC video', niche:'Food & drink',
      perf:{ plays:29800, saves:1330 } },
    { id:'d10', m:'shot1', t:'Lobby, first impression', stay:'s6',
      by:{ n:'Lena Fischer', av:AV+'05.jpg' }, format:'Photos', niche:'Mountain & ski',
      perf:{ plays:12100, saves:540 } },
    { id:'d11', m:'reel1', t:'Gear flatlay, adventure prep', stay:'s16',
      by:{ n:'Lena Fischer', av:AV+'05.jpg' }, format:'Carousels', niche:'Adventure & outdoors',
      perf:{ plays:9700, saves:410 } },
    { id:'d12', m:'reel2', t:'City lights, rooftop set', stay:'s19',
      by:{ n:'Diego Morales', av:AV+'07.jpg' }, format:'Reels', niche:'Culture & city',
      perf:{ plays:33400, saves:1560 } }
  ];

  function discoverBy(id) { return D.discover.filter(function (x) { return x.id === id; })[0]; }
  /* Every delivered piece is eligible by default now — see the header
     comment. This still exists as its own function, not an inline
     D.discover read, so the one place that would host a real future
     exception (a takedown, a since-revoked agreement) has somewhere to
     live without every call site changing. */
  function discoverVisible() { return D.discover.slice(); }
  D.discoverBy = discoverBy;
  D.discoverVisible = discoverVisible;

  /* ---------------- saving, organised into collections ----------------
     UKFAVS (assets/js/ukfavs.js) is a flat two-list bookmark set with no
     room for a creator-named grouping, so it is not what "organise into
     collections" needs — a creator-owned, named-list model, in-memory,
     same as the rest of the account's mutable state.
     Saving is one tap into a default bucket ("Inspiration", below) — dsToggle
     never asks which collection first, so browsing stays frictionless.
     Filing into a *different* named collection is a separate, optional step
     (dsFile), never forced on the save itself. */
  var collections = [{ id:'c1', t:'Inspiration' }];
  var saves = { c1: [] };             // collection id -> [discover item ids]
  var cSeq = 1;

  function dsCollections() { return collections.slice(); }
  function dsItemsIn(collId) { return (saves[collId] || []).slice(); }
  function dsCollectionsFor(itemId) {
    return collections.filter(function (c) { return (saves[c.id] || []).indexOf(itemId) > -1; });
  }
  function dsHas(itemId) { return dsCollectionsFor(itemId).length > 0; }
  /* The card's own bookmark toggle saves straight into the first collection
     — one press, no picker in the way of a quick save. Organising across
     several named collections happens on the Saved tab, once there is
     something worth sorting. */
  function dsToggle(itemId) {
    var list = saves.c1 = saves.c1 || [];
    var at = list.indexOf(itemId);
    var on;
    if (at > -1) { list.splice(at, 1); on = false; }
    else { list.push(itemId); on = true; }
    syncPublic();
    return on;
  }
  /* 2c — a creator's saved taste, made visible to a hotel: the same
     window.UKME/UKME_SET record the rest of a creator's editable profile
     (rates, collabTypes, payout) already syncs through, since /app/ and
     /creator/ are separate sessions with no other shared channel. Only
     the fields a hotel-facing card actually needs — not collection names,
     which stay private organisation. */
  function syncPublic() {
    if (!window.UKME_SET) return;
    var ids = Object.keys(saves).reduce(function (a, k) { return a.concat(saves[k]); }, []);
    var uniq = ids.filter(function (id, idx) { return ids.indexOf(id) === idx; });
    /* Resolved to a plain image src here, not a media KEY: the hotel side
       has no MEDIA manifest/D.media() to resolve 'reel1' etc. against (its
       own D.assets is a different, unkeyed shape), so this side does the
       one lookup it can do and hands over something any page can just
       drop into an <img>. */
    var items = uniq.map(discoverBy).filter(Boolean).map(function (i) {
      var a = D.media(i.m);
      return { id: i.id, img: a.src, video: a.kind === 'video', t: i.t, byN: i.by.n };
    });
    window.UKME_SET({ savedInspiration: items });
  }
  /* Filing is single-destination, not multi-tag: a piece sits in exactly one
     collection at a time, same mental model as moving a bookmark between
     folders. Replaces dsMove (itemId, fromId, toId), which asked the caller
     to already know which collection a piece was in — dead code, no call
     site ever existed for it (grep confirmed before removal). */
  function dsFile(itemId, toId) {
    collections.forEach(function (c) {
      var list = saves[c.id];
      if (!list) return;
      var at = list.indexOf(itemId);
      if (at > -1) list.splice(at, 1);
    });
    saves[toId] = saves[toId] || [];
    if (saves[toId].indexOf(itemId) < 0) saves[toId].push(itemId);
  }
  function dsNewCollection(title) {
    cSeq++;
    var id = 'c' + cSeq;
    collections.push({ id:id, t:title });
    saves[id] = [];
    return id;
  }
  function dsRename(collId, title) {
    var c = collections.filter(function (x) { return x.id === collId; })[0];
    if (c && title) c.t = title;
  }
  /* The connection saving needs beyond a bookmark folder: surfacing back up
     while a creator is actually doing the related work. A pitch or a stay
     page is where "what worked for a place like this" is useful, so a
     save that matches the open stay's market or niche shows up right there
     — reused on stayDetail() in ukcviews.js. */
  function dsForMarket(city, niches) {
    var country = String(city || '').split(',').pop().trim();
    var savedIds = Object.keys(saves).reduce(function (a, k) { return a.concat(saves[k]); }, []);
    var uniq = savedIds.filter(function (id, i) { return savedIds.indexOf(id) === i; });
    return uniq.map(discoverBy).filter(Boolean).filter(function (it) {
      var s = D.stay(it.stay);
      var sameMarket = s && country && s.city && s.city.indexOf(country) > -1;
      var sameNiche = niches && niches.indexOf(it.niche) > -1;
      return sameMarket || sameNiche;
    });
  }
  D.dsCollections = dsCollections; D.dsItemsIn = dsItemsIn; D.dsCollectionsFor = dsCollectionsFor;
  D.dsHas = dsHas; D.dsToggle = dsToggle; D.dsFile = dsFile; D.dsNewCollection = dsNewCollection;
  D.dsRename = dsRename; D.dsForMarket = dsForMarket;

  /* ---------------- filters, ported from the hotel Content library ----------------
     Same .ukDrop / .ukDropMenu--multi markup, same data-mset/data-mval
     contract, just two facets instead of five: what it is (UKVOCAB.FORMATS)
     and what it is about (UKVOCAB.SHOOTS) — the same two vocabularies the
     library already draws its own filters from, not new lists. */
  var TICK = '<span class="ukDropMenu_box" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M5 12.5l4.5 4.5L19 7"/></svg></span>';
  var EDIT_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M15.7 4.3a2 2 0 0 1 2.8 2.8L7 18.6l-3.8.9.9-3.8Z"/></svg>';
  var PREV_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>';
  var NEXT_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
  var CHEV = '<svg class="ukDrop_car" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  var DFILT = [
    { k:'dFmt',   lb:'Type',  none:'Any type', all:(window.UKVOCAB || {}).FORMATS || [] },
    { k:'dNiche', lb:'About', none:'Any niche', all:(window.UKVOCAB || {}).SHOOTS || [] }
  ];
  function discDrop(f, pool, st) {
    var sel = st[f.k] || [];
    var opts = f.all.filter(function (v) { return pool.some(function (i) { return i[f.k === 'dFmt' ? 'format' : 'niche'] === v; }); });
    var lbl = sel.length === 1 ? sel[0] : sel.length ? sel.length + ' picked' : f.none;
    return '<div class="ukDrop"><button class="ukDrop_b" type="button" data-drop-toggle ' +
      'aria-haspopup="menu" aria-expanded="false">' +
      '<span class="ukDrop_k">' + f.lb + '</span><span class="ukDrop_v">' + esc(lbl) + '</span>' + CHEV +
      '</button><div class="ukDropMenu ukDropMenu--multi" hidden role="menu">' +
      '<button class="ukDropMenu_i' + (sel.length ? '' : ' is-sel') + '" role="menuitemcheckbox" ' +
        'aria-checked="' + !sel.length + '" data-mset="' + f.k + '" data-mval="all">' + TICK + f.none + '</button>' +
      opts.map(function (v) {
        var on = sel.indexOf(v) > -1;
        return '<button class="ukDropMenu_i' + (on ? ' is-sel' : '') + '" role="menuitemcheckbox" ' +
          'aria-checked="' + on + '" data-mset="' + f.k + '" data-mval="' + esc(v) + '">' + TICK +
          '<span class="ukDropMenu_lb">' + esc(v) + '</span></button>';
      }).join('') + '</div></div>';
  }

  function discPass(i, st) {
    var fmt = st.dFmt || [], niche = st.dNiche || [];
    if (fmt.length && fmt.indexOf(i.format) < 0) return false;
    if (niche.length && niche.indexOf(i.niche) < 0) return false;
    if (st.dBy && i.by.n !== st.dBy) return false;
    return true;
  }

  /* ---------------- cards, in the library's own idiom ---------------- */
  function discSaveBtn(id, cls, labelled) {
    var saved = dsHas(id);
    return '<button class="' + (cls || 'ukDiscCard_save') + (saved ? ' is-on' : '') + '" type="button" ' +
      'data-dsave="' + id + '" aria-pressed="' + saved + '" aria-label="' +
      (saved ? 'Remove from Saved' : 'Save for later') + '">' +
      (saved
        ? '<svg viewBox="0 0 16 18" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" ' +
          'd="M0 5.75V16C0 17.6481 1.88153 18.5889 3.2 17.6L6.8 14.9C7.51111 14.3667 8.48889 14.3667 9.2 14.9L12.8 17.6C14.1185 18.5889 16 17.6481 16 16V5.75H0ZM0 4.25H16V2C16 0.895431 15.1046 0 14 0H2C0.895431 0 0 0.895431 0 2V4.25Z" ' +
          'fill="currentColor"/></svg>'
        : '<svg viewBox="0 0 17.5 19.5" aria-hidden="true"><path d="M0.75 16.75V2.75C0.75 1.64543 1.64543 0.75 2.75 0.75H14.75C15.8546 0.75 16.75 1.64543 16.75 2.75V16.75C16.75 18.3981 14.8685 19.3389 13.55 18.35L9.95 15.65C9.23889 15.1167 8.26111 15.1167 7.55 15.65L3.95 18.35C2.63153 19.3389 0.75 18.3981 0.75 16.75Z" ' +
          'fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>') +
      (labelled ? '<span>' + (saved ? 'Saved' : 'Save for later') + '</span>' : '') +
    '</button>';
  }

  /* Filing into a collection: the single-select .ukDrop every dropdown in
     the product already is (ukcapp.js's own contract — a [data-drop-toggle]
     button plus the .ukDropMenu after it, open/close handled globally, no
     new plumbing here) — same shape as ukhire.js's dropRow(), not a new
     picker. Only ever shown once a piece is actually saved: filing is an
     optional second step on top of the one-tap save, never a gate in front
     of it. */
  function collFileDrop(itemId) {
    var cols = dsCollections();
    var current = dsCollectionsFor(itemId)[0];
    return '<div class="ukDrop ukDrop--wide ukDiscFile">' +
      '<p class="ukField_l">Collection</p>' +
      '<button class="ukDrop_b" type="button" data-drop-toggle aria-haspopup="menu" aria-expanded="false">' +
        '<span class="ukDrop_v">' + esc(current ? current.t : 'Choose a collection') + '</span>' + CHEV +
      '</button><div class="ukDropMenu" hidden role="menu">' +
        cols.map(function (c) {
          var on = !!(current && current.id === c.id);
          return '<button class="ukDropMenu_i' + (on ? ' is-sel' : '') + '" role="menuitem" ' +
            'aria-checked="' + on + '" data-dsfile="' + itemId + '" data-val="' + c.id + '">' + esc(c.t) + '</button>';
        }).join('') +
      '</div></div>';
  }

  /* Card media: one ratio for every tile regardless of the asset's own
     (reels are shot 9:16, photos vary) — same "!important, one shape
     across the strip" discipline ukprofile.js's galleries already use, so
     no card in the grid is ever shorter than its neighbours. Title and
     byline ride the image itself via .ukM_scrim/.ukM_cap (the same
     gradient-scrim tile already proven on the creator profile's Past
     work/Made for hotels galleries and the hotel content library's
     .ukLib_scrim), not a caption block underneath it. */
  function discCard(i) {
    var s = D.stay(i.stay);
    var a = D.media(i.m);
    return '<article class="ukDiscCard" data-discitem="' + i.id + '" tabindex="0" role="button" ' +
      'aria-label="Open ' + esc(i.t) + '">' +
      '<div class="ukDiscCard_m">' +
        '<span class="ukM ukM--4x5">' +
          '<img src="' + esc(a.src) + '" alt="' + esc(i.t) + '" loading="lazy" decoding="async">' +
          (a.kind === 'video'
            ? '<svg class="ukM_play" viewBox="0 0 44 44" aria-hidden="true"><path fill-rule="evenodd" ' +
              'clip-rule="evenodd" d="M22 0C9.85 0 0 9.85 0 22s9.85 22 22 22 22-9.85 22-22S34.15 0 22 0Z' +
              'M17.6 16.8Q17.6 13.2 20.6 15.2L27.8 20Q30.8 22 27.8 24L20.6 28.8Q17.6 30.8 17.6 27.2L17.6 16.8Z"/></svg>'
            : '') +
          '<span class="ukM_scrim" aria-hidden="true"></span>' +
          '<span class="ukM_cap"><span class="ukM_capT">' + esc(i.t) + '</span>' +
            '<span class="ukM_capS"><img class="ukM_capAv" src="' + esc(i.by.av) + '" alt="" width="16" height="16" ' +
              'loading="lazy" decoding="async">' +
              esc(i.by.n) + ' &middot; ' + esc(s.hotel) + '</span>' +
          '</span>' +
        '</span>' +
        discSaveBtn(i.id) +
      '</div></article>';
  }
  /* The ONE card renderer, reachable from anywhere in either data world this
     file's D also serves — the stay-detail "saved inspiration" panel
     (ukcviews.js) used to hand-carry its own stale copy of this markup and
     drifted the moment discCard's own composition changed. Now it just
     calls D.discCard. */
  D.discCard = discCard;

  /* Real-data commentary, never invented: returns '' (render nothing) unless
     the piece has real perf numbers, matching the same honesty rule the
     stat block itself already holds to. Where a performance comparison
     would be true but is not YET meaningful (fewer than 2 other same-format
     pieces with real numbers to compare against), the comparison sentence
     is dropped rather than computed off a sample of one — still no invented
     claim, just a narrower one. */
  function discInsight(i, pool) {
    if (!i.perf) return '';
    var lede = 'A ' + i.niche.toLowerCase() + ' ' + i.format.toLowerCase() + ' piece';
    var peers = pool.filter(function (x) { return x.perf && x.format === i.format && x.id !== i.id; });
    if (peers.length < 2) return lede + '.';
    var avg = peers.reduce(function (a, x) { return a + x.perf.plays; }, 0) / peers.length;
    var pct = Math.round(Math.abs(i.perf.plays / avg - 1) * 100);
    if (i.perf.plays > avg * 1.03) {
      return lede + ' that landed ' + pct + '% above the average ' + i.format.toLowerCase() +
        ' piece in Discover right now — worth studying what it did.';
    }
    if (i.perf.plays < avg * 0.97) {
      return lede + '. It came in ' + pct + '% under the average ' + i.format.toLowerCase() +
        ' piece in Discover, alongside ' + D.fmt(i.perf.saves) + ' real saves — still worth a look at the format.';
    }
    return lede + ', landing right around the average ' + i.format.toLowerCase() + ' piece in Discover.';
  }

  /* ---------------- the feed page ---------------- */
  function feedTab(st, pool) {
    var shown = pool.filter(function (i) { return discPass(i, st); });
    var pg = paginate(shown, st.pgDisc, 12, 'pgDisc');
    return (pg.rows.length
      ? '<div class="ukDiscGrid">' + pg.rows.map(discCard).join('') + '</div>' + (pg.nav || '')
      : empty('Nothing matches that yet', 'Clear a filter or two and the feed opens back up.'));
  }

  function savedTab(st) {
    var cols = dsCollections();
    var any = cols.some(function (c) { return dsItemsIn(c.id).length; });
    /* Warm, never a bare box — and it names the concept (collections) up
       front without making a choice mandatory before the first save. */
    if (!any) return empty('Nothing saved yet',
      'Tap the bookmark on anything in the feed. It starts in Inspiration — sort it into collections whenever you feel like it, there is no rush.');
    /* Every collection shown, even one nobody has filed anything into yet —
       once the creator has named it, hiding it again until it has content
       reads as the naming having silently failed. Only the very-first-ever
       empty state above skips this, since a page of "nothing here" sections
       before a single save exists is a worse welcome than one warm line. */
    return cols.map(function (c) {
      var items = dsItemsIn(c.id).map(discoverBy).filter(Boolean);
      var renaming = st.renColl === c.id;
      return '<section class="ukDiscColl"><div class="ukDiscColl_h">' +
        (renaming
          ? '<form class="ukDiscRen" data-rencoll="' + c.id + '">' +
              '<label class="ukSrOnly" for="ukRenName">Rename ' + esc(c.t) + '</label>' +
              '<input id="ukRenName" type="text" value="' + esc(c.t) + '">' +
              '<button class="ukGhost ukGhost--sm" type="button" data-rencoll-go="' + c.id + '">Save</button>' +
            '</form>'
          : '<h3 class="ukStaySection_t">' + esc(c.t) + ' <span class="ukCount">' + items.length + '</span></h3>' +
            '<button class="ukDiscColl_ed" type="button" data-rencoll-edit="' + c.id + '" ' +
              'aria-label="Rename ' + esc(c.t) + '">' + EDIT_ICON + '</button>') +
        '</div>' +
        (items.length
          ? '<div class="ukDiscGrid">' + items.map(discCard).join('') + '</div>'
          : '<p class="ukDiscColl_e">Nothing filed here yet — move a saved piece in from its own page.</p>') +
        '</section>';
    }).join('') +
    '<form class="ukDiscNewColl" data-newcoll><label class="ukSrOnly" for="ukNewCollName">New collection name</label>' +
      '<input id="ukNewCollName" type="text" placeholder="Name a new collection, e.g. “Desert properties”">' +
      '<button class="ukGhost" type="button" data-newcoll-go>New collection</button></form>';
  }

  function discover(st) {
    /* An opened piece is a sub-state of this same view, not a separate route
       — same pattern as collabs/thread and stays/open. That is what lets the
       top breadcrumb ("Discover > <title>") do the going-back on its own,
       with nothing duplicating it lower on the page. */
    if (st.discItem) return discoverItem(st);
    var sub = st.dsub === 'saved' ? 'saved' : 'feed';
    var pool = discoverVisible();
    var savedCount = Object.keys(saves).reduce(function (a, k) { return a + saves[k].length; }, 0);
    /* Tabs on the left, the type/about filters on the right — one row, same
       .ukFilters--tabs + .ukCrBar_r shape Stays/Outreach already uses, not
       the pill-style .ukSubTabs (that system is for a channel switcher
       inside a panel, not the page's own primary section tabs). Filters
       are feed-only — Saved is organised into named collections instead. */
    return head('Discover', 'Real work, already made on Ukreate. See what is landing, then save what fits where you are headed.') +
      '<div class="ukToolbar ukToolbar--split ukCrBar">' +
        '<div class="ukFilters ukFilters--tabs" role="tablist" aria-label="Discover">' +
          [['feed','Feed'],['saved','Saved']].map(function (t) {
            var on = t[0] === sub;
            return '<button class="ukFilter' + (on ? ' is-on' : '') + '" type="button" role="tab" ' +
              'aria-selected="' + on + '" aria-controls="ukDiscPanel" data-dsub="' + t[0] + '">' +
              '<span class="ukFilter_lb">' + t[1] + '</span>' +
              (t[0] === 'saved' ? '<span class="ukFilter_ct">' + savedCount + '</span>' : '') +
            '</button>';
          }).join('') + '</div>' +
        (sub === 'feed'
          ? '<div class="ukCrBar_r">' + DFILT.map(function (f) { return discDrop(f, pool, st); }).join('') + '</div>'
          : '') +
      '</div>' +
      /* Landed here from a piece's byline ("more from X") rather than picked
         from the Type/About filters — same idea, a narrower feed, but it
         needs its own way back since it did not come from a dropdown the
         creator can just reopen and clear. */
      (sub === 'feed' && st.dBy
        ? '<p class="ukDiscByFilter">Showing ' + esc(st.dBy) + '&rsquo;s work in Discover ' +
            '<button class="ukGhost ukGhost--sm" type="button" data-discby="">Show everyone</button></p>'
        : '') +
      (sub === 'saved' ? savedTab(st) : feedTab(st, pool));
  }

  /* ---------------- opening a piece ---------------- */
  function discoverItem(st) {
    var i = discoverBy(st.discItem);
    if (!i) return empty('Not found', 'That piece is not in Discover.');
    var s = D.stay(i.stay);
    var pool = discoverVisible();
    var idx = -1;
    for (var k = 0; k < pool.length; k++) { if (pool[k].id === i.id) { idx = k; break; } }
    var prev = idx > 0 ? pool[idx - 1] : null;
    var next = idx > -1 && idx < pool.length - 1 ? pool[idx + 1] : null;
    var insight = discInsight(i, pool);
    var saved = dsHas(i.id);

    /* 1a — the media keeps its own size (.ukDiscOpen_m .ukM's max-height
       cap is untouched); what changes is that the pair sits centred as one
       unit in .ukMain instead of stranded at opposite edges of a wide grid.
       .ukGrid--thread's own 1.4fr/.85fr split is wrong here — it is sized
       for a column whose content fills it, and this media (capped narrow
       by its own height limit) never does, so a fixed fraction of the
       track always leaves dead space somewhere in it, left or right of the
       media, however the media itself is aligned within that fraction.
       .ukDiscOpenGrid's left column is max-content instead — exactly as
       wide as the media actually renders — so the pair's total width is
       just media + gap + panel, and centring that (via .ukDiscOpenWrap's
       flex justify-content) leaves the same margin on both sides instead
       of a big one on the left. */
    return '<div class="ukDiscOpenWrap"><div class="ukGrid ukDiscOpenGrid">' +
        '<div><div class="ukDiscOpen_m">' + m(i.m, i.t, 'ukM--hero', true) + '</div>' +
          (prev || next
            ? '<div class="ukDiscOpen_nav">' +
                (prev ? '<button class="ukGhost ukGhost--sm" type="button" data-discitem="' + prev.id + '" aria-label="Previous: ' + esc(prev.t) + '">' + PREV_ICON + ' Previous</button>' : '') +
                (next ? '<button class="ukGhost ukGhost--sm" type="button" data-discitem="' + next.id + '" aria-label="Next: ' + esc(next.t) + '">Next ' + NEXT_ICON + '</button>' : '') +
              '</div>'
            : '') +
        '</div>' +
        '<aside class="ukPanel ukSticky">' +
          '<div class="ukPanel_head"><h3 class="ukPanel_title">' + esc(i.t) + '</h3></div>' +
          '<button class="ukDiscOpen_by" type="button" data-discby="' + esc(i.by.n) + '">' +
            '<img src="' + esc(i.by.av) + '" alt="" width="32" height="32" loading="lazy" decoding="async">' +
            '<span>See more from ' + esc(i.by.n) + '</span>' +
          '</button>' +

          /* 1b — the hero of the panel, not a footnote: the same .ukK stat
             tile the profile's own KPI row uses (ukprofile.js kpi()),
             two across rather than that row's four since a panel this
             narrow has room for two. Honesty rule unchanged: nothing here
             if i.perf is null. */
          (i.perf
            ? '<div class="ukDiscHero">' +
                '<article class="ukK"><p class="ukK_l">Plays</p><p class="ukK_v">' + D.fmt(i.perf.plays) + '</p></article>' +
                '<article class="ukK"><p class="ukK_l">Saves</p><p class="ukK_v">' + D.fmt(i.perf.saves) + '</p></article>' +
              '</div>'
            : '') +

          /* 1c — commentary, sourced only from real fields on the record
             (niche, format, and — where the sample supports it — how this
             piece's real play count compares to its peers). discInsight
             already returns '' when i.perf is null; nothing renders. */
          (insight ? '<p class="ukDiscInsight">' + esc(insight) + '</p>' : '') +

          /* 1d — tightened: bare .ukFacts (ukapp.css:623) is already a
             2-column grid; ukFacts--stack was forcing it to one column and
             is what made four facts read as six-plus rows of loose
             vertical space. Market reuses the exact flag+city+country
             pattern the header/creator-card treatment already uses
             (window.ukFlagFor, ukshared.js) — D.stay(id).city is already
             the "City, Country" string that helper expects. */
          '<dl class="ukFacts" style="margin-top:14px">' +
            '<div><dt>Property</dt><dd>' + esc(s.hotel) + '</dd></div>' +
            '<div><dt>Market</dt><dd>' + (window.ukFlagFor ? window.ukFlagFor(s.city) : '') + esc(s.city) + '</dd></div>' +
            '<div><dt>Type</dt><dd>' + esc(i.format) + '</dd></div>' +
            '<div><dt>About</dt><dd>' + esc(i.niche) + '</dd></div>' +
          '</dl>' +

          /* 1e — somewhere to go besides back: the property itself, via the
             same UKCPREFILL door the dashboard's own cross-view links
             already use (ukcapp.js:702) — not a new navigation mechanism. */
          '<button class="ukGhost ukDiscOpen_prop" type="button" data-openstay="' + esc(i.stay) + '">' +
            'See ' + esc(s.hotel) + '</button>' +

          discSaveBtn(i.id, 'ukBtn ukCard_cta ukCard_cta--gapped ukDiscOpen_save', true) +
          (saved ? collFileDrop(i.id) : '') +
        '</aside>' +
      '</div></div>';
  }

  V.discover = discover;
})();
