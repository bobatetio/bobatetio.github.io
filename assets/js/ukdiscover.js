/* Ukreate — Discover (creator side only).
   Feed first, curation second. This is the platform's own delivered work,
   browsable for inspiration — the Pinterest model, not a blank mood board.
   Every card reuses the hotel side's Content library patterns (.ukLib*
   grid, .ukDrop multi-select filters, .ukSubTabs) rather than a parallel
   system, and every media slot points at the same MEDIA manifest and ratio
   rules the rest of the app already uses. No new media files, no new
   content records beyond the lightweight metadata below. */
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
     no per-item consent field to fall out of sync with that. `featured`
     is the separate, unrelated flag: Ukreate hand-picking a genuine
     standout, not a permission check. */
  var AV = '/assets/img/fc/av/av-';
  D.discover = [
    { id:'d1', m:'reel1', t:'Sunset arrival at the riad', stay:'s3',
      by:{ n:'Priya Nair', av:AV+'02.jpg' }, format:'Reels', niche:'Culture & city',
      perf:{ plays:52300, saves:2380 }, featured:true },
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
      perf:{ plays:44100, saves:2050 }, featured:true },
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
  function discoverFeatured() { return discoverVisible().filter(function (i) { return i.featured; }); }
  D.discoverBy = discoverBy;
  D.discoverVisible = discoverVisible;
  D.discoverFeatured = discoverFeatured;

  /* ---------------- saving, organised into collections ----------------
     UKFAVS (assets/js/ukfavs.js) is a flat two-list bookmark set with no
     room for a creator-named grouping, so it is not what "organise into
     collections" needs — this is modelled the way ukboards.js modelled a
     creator-owned list before it, in-memory, same as the rest of the
     account's mutable state. */
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
    if (at > -1) { list.splice(at, 1); return false; }
    list.push(itemId); return true;
  }
  function dsMove(itemId, fromId, toId) {
    if (saves[fromId]) { var at = saves[fromId].indexOf(itemId); if (at > -1) saves[fromId].splice(at, 1); }
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
  D.dsHas = dsHas; D.dsToggle = dsToggle; D.dsMove = dsMove; D.dsNewCollection = dsNewCollection;
  D.dsForMarket = dsForMarket;

  /* ---------------- filters, ported from the hotel Content library ----------------
     Same .ukDrop / .ukDropMenu--multi markup, same data-mset/data-mval
     contract, just two facets instead of five: what it is (UKVOCAB.FORMATS)
     and what it is about (UKVOCAB.SHOOTS) — the same two vocabularies the
     library already draws its own filters from, not new lists. */
  var TICK = '<span class="ukDropMenu_box" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M5 12.5l4.5 4.5L19 7"/></svg></span>';
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

  function discCard(i) {
    var s = D.stay(i.stay);
    return '<article class="ukDiscCard" data-discitem="' + i.id + '" tabindex="0" role="button" ' +
      'aria-label="Open ' + esc(i.t) + '">' +
      '<div class="ukDiscCard_m">' + m(i.m, i.t, '', false) +
        (i.featured ? '<span class="ukDiscCard_featured">Featured</span>' : '') +
        discSaveBtn(i.id) + '</div>' +
      '<div class="ukDiscCard_b">' +
        '<p class="ukDiscCard_t">' + esc(i.t) + '</p>' +
        '<p class="ukDiscCard_by"><img src="' + esc(i.by.av) + '" alt="" width="20" height="20" loading="lazy" decoding="async">' +
          '<span>' + esc(i.by.n) + '</span> &middot; <span>' + esc(s.hotel) + '</span></p>' +
        '<div class="ukDiscCard_tags"><span class="ukChip">' + esc(i.format) + '</span>' +
          '<span class="ukChip">' + esc(i.niche) + '</span></div>' +
      '</div></article>';
  }

  /* ---------------- the feed page ---------------- */
  function feedTab(st) {
    var pool = discoverVisible();
    var shown = pool.filter(function (i) { return discPass(i, st); });
    var noFilter = !(st.dFmt || []).length && !(st.dNiche || []).length;
    var featured = noFilter ? discoverFeatured() : [];
    var pg = paginate(shown, st.pgDisc, 12, 'pgDisc');
    return (featured.length
        ? '<section class="ukDiscFeatured"><div class="ukPanel_head">' +
            '<h3 class="ukPanel_title">Featured</h3>' +
            '<span class="ukHint">Picked by the Ukreate team as ones worth learning from</span></div>' +
            '<div class="ukDiscGrid">' + featured.map(discCard).join('') + '</div></section>'
        : '') +
      '<div class="ukToolbar ukCrBar">' + DFILT.map(function (f) { return discDrop(f, pool, st); }).join('') + '</div>' +
      (pg.rows.length
        ? '<div class="ukDiscGrid">' + pg.rows.map(discCard).join('') + '</div>' + (pg.nav || '')
        : empty('Nothing matches that yet', 'Clear a filter or two and the feed opens back up.'));
  }

  function savedTab(st) {
    var cols = dsCollections();
    var any = cols.some(function (c) { return dsItemsIn(c.id).length; });
    if (!any) return empty('Nothing saved yet', 'Bookmark a piece from the feed and it lands here, sorted into a collection you name.');
    return cols.map(function (c) {
      var items = dsItemsIn(c.id).map(discoverBy).filter(Boolean);
      if (!items.length) return '';
      return '<section class="ukDiscColl"><h3 class="ukStaySection_t">' + esc(c.t) +
        ' <span class="ukCount">' + items.length + '</span></h3>' +
        '<div class="ukDiscGrid">' + items.map(discCard).join('') + '</div></section>';
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
    return head('Discover', 'Real work, already made on Ukreate. See what is landing, then save what fits where you are headed.') +
      '<div class="ukSubTabs" role="tablist" aria-label="Discover">' +
        [['feed','Feed'],['saved','Saved']].map(function (t) {
          var on = t[0] === sub;
          return '<button class="ukSubTab' + (on ? ' is-on' : '') + '" type="button" role="tab" ' +
            'aria-selected="' + on + '" data-dsub="' + t[0] + '">' + t[1] +
            (t[0] === 'saved' ? ' <span class="ukCount">' + Object.keys(saves).reduce(function (a,k){return a+saves[k].length;},0) + '</span>' : '') +
          '</button>';
        }).join('') + '</div>' +
      (sub === 'saved' ? savedTab(st) : feedTab(st));
  }

  /* ---------------- opening a piece ---------------- */
  function discoverItem(st) {
    var i = discoverBy(st.discItem);
    if (!i) return empty('Not found', 'That piece is not in Discover.');
    var s = D.stay(i.stay);
    return '<div class="ukGrid ukGrid--thread">' +
        '<div><div class="ukDiscOpen_m">' + m(i.m, i.t, 'ukM--hero', true) + '</div></div>' +
        '<aside class="ukPanel ukSticky">' +
          '<div class="ukPanel_head"><h3 class="ukPanel_title">' + esc(i.t) + '</h3></div>' +
          '<p class="ukDiscOpen_by"><img src="' + esc(i.by.av) + '" alt="" width="32" height="32" loading="lazy" decoding="async">' +
            '<span>' + esc(i.by.n) + '</span></p>' +
          '<dl class="ukFacts ukFacts--stack" style="margin-top:14px">' +
            '<div><dt>Property</dt><dd>' + esc(s.hotel) + '</dd></div>' +
            '<div><dt>Market</dt><dd>' + esc(s.city) + '</dd></div>' +
            '<div><dt>Type</dt><dd>' + esc(i.format) + '</dd></div>' +
            '<div><dt>About</dt><dd>' + esc(i.niche) + '</dd></div>' +
          '</dl>' +
          /* Honesty rule: real performance where it exists, nothing invented
             where it does not — no placeholder, no "coming soon", just a
             quieter card with less in it. */
          (i.perf
            ? '<div class="ukDiscPerf"><p class="ukDiscPerf_lb">What it achieved</p>' +
              '<div class="ukDiscPerf_row"><span class="ukDiscPerf_v">' + D.fmt(i.perf.plays) + '</span><span>plays</span></div>' +
              '<div class="ukDiscPerf_row"><span class="ukDiscPerf_v">' + D.fmt(i.perf.saves) + '</span><span>saves</span></div>' +
            '</div>'
            : '') +
          discSaveBtn(i.id, 'ukBtn ukCard_cta ukCard_cta--gapped ukDiscOpen_save', true) +
        '</aside>' +
      '</div>';
  }

  V.discover = discover;
})();
