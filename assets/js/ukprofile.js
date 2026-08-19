/* Ukreate — the creator profile, one page, two modes.

   Before this file: the hotel's view of a creator (ukcreators.js) and a
   creator's view of themself (ukcprofile.js) were two different designs of
   the same person. The hotel side was tabbed and proof-first; the creator
   side was a single ~20-section scroll with the same audience/performance
   data told three different ways. Nothing kept them in sync except habit,
   which is exactly how they drifted.

   The fix is structural, not cosmetic: there is now ONE render function.
   Both apps call it with the same normalised model and a mode flag —
   'owner' (the creator looking at herself, with edit affordances and a
   clean-preview toggle) or 'hotel' (Hire/save/tracked-link instead). The
   underlying data still comes from two different places (a creator's own
   D.me vs. a hotel's roster record), because those are genuinely two
   different data worlds — see the adapters in ukcprofile.js and
   ukcreators.js for how each builds the model this file consumes. What
   this file guarantees is that once built, the model renders identically
   in structure: same four tabs, same section order, same components. The
   two views cannot independently drift again, because there is only one
   layout left to drift from.

   Loaded by BOTH /app/ and /creator/ — see the file header discipline
   ukshared.js and ukstaycard.js already established for shared code. */
window.UKPROFILE = (function () {
  /* Either app's data module — both ukdata.js (hotel) and ukcdata.js
     (creator) export collabMine/collabSay/STAGES/attribution/creator, which
     is what the header below (lifted verbatim from ukviews.js) needs. */
  /* A function, not a value captured at load time: this file loads before
     ukdata.js/ukcdata.js (see the load-order comment in each app's
     index.html — the stay/application registries hydrate out of this file's
     definitions), so window.UK/window.UKC do not exist yet when this IIFE
     runs. Every call site below resolves D() fresh, once both apps' data
     modules are actually up. */
  function D() { return window.UK || window.UKC; }
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; }); };
  var fmt = function (n) { return n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace('.0', '') + 'K' : String(n); };

  var PLAT_MARK = {}, PLAT_NAME = {};
  ((window.UKVOCAB && window.UKVOCAB.PLATFORMS) || []).forEach(function (p) {
    PLAT_MARK[p.k] = p.s; PLAT_NAME[p.k] = p.n;
  });
  var UNIT = { yt:'Subscribers' };

  /* One module, one badge file — the same three assets the Academy tab
     renders (ukcviews.js), moved here since creatorHead() below is shared
     with the hotel side and ukcviews.js is creator-only. ukcviews.js's own
     MODULE_BADGE/badgeImg now delegate to this copy instead of keeping a
     second one that could drift. */
  var MODULE_BADGE = {
    'Start here':  '/assets/img/badges/badge-start-here.svg',
    'Pitching':    '/assets/img/badges/badge-pitching.svg',
    'On the stay': '/assets/img/badges/badge-on-the-stay.svg'
  };
  function badgeImg(mod, cls) {
    var src = MODULE_BADGE[mod];
    if (!src) return window.ukVetBadge(cls);
    return '<img class="ukBadgeArt ' + (cls || '') + '" src="' + esc(src) + '" ' +
      'alt="' + esc(mod) + ' badge" loading="lazy" decoding="async">';
  }

  /* Package shapes a creator offers, and what a hotel picks between. Static,
     not per-creator, so it lives here once rather than duplicated per app —
     the hotel side used to own this list (D.creatorPacks in ukdata.js), the
     creator side had its own hardcoded two-tier version with no "Essential"
     option and no way to edit it. One list now, three tiers, editable only
     in owner mode. */
  var PACKS = [
    { k:'essential', n:'Essential', nights:1, del:'1 UGC video',                     rights:'Yours in perpetuity, all channels' },
    { k:'signature', n:'Signature', nights:2, del:'1 UGC video, 3 photos',           rights:'Yours in perpetuity, all channels', rec:true },
    { k:'full',      n:'Full story', nights:3, del:'2 UGC videos, 8 photos, 2 reels', rights:'Yours in perpetuity, all channels' }
  ];

  function kpi(l, v, n) {
    return '<article class="ukK c3"><p class="ukK_l">' + esc(l) + '</p>' +
      '<p class="ukK_v">' + esc(v) + '</p><p class="ukK_n"><span>' + esc(n) + '</span></p></article>';
  }
  function panel(title, badge, body) {
    return '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">' + esc(title) + '</h3>' +
      (badge ? '<span class="ukCount">' + badge + '</span>' : '') + '</div>' + body + '</section>';
  }

  /* ================= tab shell ================= */
  var TABS = [['overview', 'Overview'], ['stats', 'Stats'], ['work', 'Past work'], ['rates', 'Rates']];

  function tabBar(tab) {
    return '<div class="ukToolbar"><div class="ukFilters ukFilters--tabs" role="tablist" aria-label="Profile sections">' +
      TABS.map(function (t) {
        var on = tab === t[0];
        return '<button class="ukFilter' + (on ? ' is-on' : '') + '" type="button" role="tab" ' +
          'aria-selected="' + on + '" aria-controls="ukProfPanel" data-proftab="' + t[0] + '">' +
          '<span class="ukFilter_lb">' + t[1] + '</span></button>';
      }).join('') + '</div></div>';
  }

  /* ================= identity header =================
     Lifted verbatim from ukviews.js's creatorHead() — the header the last
     restructure rebuilt from scratch, worse, instead of reusing. This is
     the exact original: name/verified/academy badges, the "Covers" line
     with real flags and a "+N" overflow, category chips, layered platform
     marks, languages, and (unless opts.noStats) the six-figure stats row.
     ukviews.js's own creatorHead is now a thin wrapper delegating here, so
     its two remaining hotel-only callers (the pitch-inbound header and the
     collaboration-thread header) render byte-identical output to before. */
  var OPEN_ICON = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 4h6v6M20 4l-8.5 8.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 14.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  var LINK_ICON = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M10 13.5a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1.2 1.2M14 10.5a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1.2-1.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

  function who(cr, inner, cls) {
    return '<span class="ukProfLink' + (cls ? ' ' + cls : '') + '" data-creator="' + cr.id + '" ' +
      'role="link" tabindex="0" title="Open ' + esc(cr.n) + '’s profile" ' +
      'aria-label="Open ' + esc(cr.n) + '’s profile">' + inner + '</span>';
  }
  function mImg(src, alt, cls, eager) {
    return '<img class="' + (cls || '') + '" src="' + src + '" alt="' + esc(alt) + '"' +
           (eager ? '' : ' loading="lazy" decoding="async"') + '>';
  }
  function availOf(c) {
    var f = String(c.free || '');
    if (/now/i.test(f)) return { c:'is-now', t:'Available now' };
    var m = f.match(/(\d{1,2})\s+([A-Za-z]{3})/);
    if (!m) return { c:'', t:'Availability on request' };
    var soon = ['Jan','Feb','Mar','Apr'].indexOf(m[2]) > -1;
    return { c: soon ? 'is-soon' : 'is-later', t: 'Free ' + f.toLowerCase() };
  }
  /* Two, then a "+N" that opens the rest beside itself — the same rule and
     the same .ukMoreDot control a creator's own card uses everywhere else. */
  function capped(items, kind, render, max) {
    var shown = items.slice(0, max || 2), rest = items.length - shown.length;
    return shown.map(render).join('') +
      (rest > 0 ? '<button class="ukMoreDot" type="button" data-crpop="' + kind + '" ' +
        'aria-label="' + rest + ' more">+' + rest + '</button>' : '');
  }
  function statusBadge(c, actions, label) {
    var mine = D().collabMine(c);
    var lb = label === false ? '' : (label || (c.stage === 4 ? 'Done' : mine ? 'Your move' : 'With the creator'));
    return '<div class="ukStatusBadge' + (mine ? ' is-mine' : '') + (actions ? ' has-act' : '') +
      (label === false ? ' ukStatusBadge--bare' : '') + '"' +
      (actions ? '' : ' role="status"') + '>' +
      (lb ? '<span class="ukStatusBadge_lb">' + esc(lb) + '</span>' : '') +
      (actions
        ? '<span class="ukStatusBadge_act">' + actions + '</span>'
        : '<span class="ukStatusBadge_say">' + esc(D().collabSay(c)) + '</span>') +
    '</div>';
  }
  var TRACK_CHECK = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.6 6.35 4.85 8.6 9.4 3.75" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function track(stage, mini) {
    return '<ol class="ukTrack' + (mini ? ' ukTrack--mini' : '') + '">' + D().STAGES.map(function (stg, i) {
      var cls = i < stage ? 'is-done' : i === stage ? 'is-now' : '';
      return '<li class="' + cls + '"' + (i === stage ? ' aria-current="step"' : '') + '">' +
        (mini ? '<span class="ukTrack_dot">' + (i < stage ? TRACK_CHECK : '') + '</span>' : '') +
        '<span class="ukTrack_lb">' + stg.short + '</span></li>';
    }).join('') + '</ol>';
  }
  /* One popup for the whole view: the key carries which list and, on a
     grid, whose — 'markets:c4' — so a board of many cards does not need a
     dialog sitting in the DOM per card. */
  function crPopup(st, cr) {
    if (!st.crPop) return '';
    var bits = String(st.crPop).split(':');
    if (bits[1]) { cr = D().creator ? D().creator(bits[1]) : cr; if (!cr) return ''; }
    if (!cr) return '';
    var kind = bits[0];
    var title = kind === 'markets' ? 'Markets they cover' : kind === 'makes' ? 'What they make' : 'What they shoot';
    function marketRow(m) {
      return '<li class="ukPop_row">' + (m.cc ? '<img class="ukCrFlag" src="/assets/img/flags/' + m.cc + '.svg" alt="" loading="lazy" decoding="async">' : '') + esc(m.n) + '</li>';
    }
    var body;
    if (kind === 'markets') {
      var mk = cr.markets || [];
      var home = mk.slice(0, 1), rest = mk.slice(1);
      body =
        (home.length ? '<p class="ukPop_sec">Home base</p><ul class="ukPop_list">' + home.map(marketRow).join('') + '</ul>' : '') +
        (rest.length ? '<p class="ukPop_sec">Also headed to</p><ul class="ukPop_list">' + rest.map(marketRow).join('') + '</ul>' : '');
    } else {
      body = '<ul class="ukPop_list">' + ((kind === 'makes' ? cr.makes : cr.cats) || []).map(function (t) {
        return '<li class="ukPop_row">' + esc(t) + '</li>'; }).join('') + '</ul>';
    }
    return '<div class="ukPop_card" role="dialog" aria-label="' + esc(title) + '" data-crpop-panel>' +
      '<div class="ukPop_head"><h2 class="ukPop_h">' + esc(title) + '</h2>' +
        '<button class="ukPop_x" type="button" data-crpop-close aria-label="Close">&times;</button></div>' +
      body + '</div>';
  }
  /* The link a hotel most often needs is the one for the collaboration
     being looked at — compact, under the status badge, not a sidebar panel
     three scrolls down. Hotel mode only (opts.noTrack skips it in owner). */
  function trackedInline(c, cr) {
    var row = (D().attribution || []).filter(function (r) { return r.collab === c.id || r.who === cr.id; })[0];
    if (!row) return '';
    return '<div class="ukTrackMini">' +
      '<div class="ukTrackMini_r"><span class="ukTrackMini_l">Tracked link</span>' +
        '<button class="ukTrackMini_i" type="button" data-ack="Link copied" ' +
          'aria-label="Copy the tracked link">' + LINK_ICON + '<code>' + esc(row.link) + '</code></button></div>' +
      '<div class="ukTrackMini_r"><span class="ukTrackMini_l">Discount code</span>' +
        '<button class="ukTrackMini_i" type="button" data-ack="Code copied" ' +
          'aria-label="Copy the discount code"><code>' + esc(row.code) + '</code></button></div>' +
      (window.UKTRACK ? window.UKTRACK.linkNote() : '') +
    '</div>';
  }

  function creatorHead(c, cr, stay, dates, st, opts) {
    var av = availOf(cr);
    var markets = (cr.markets || []).slice(0, 5);
    var cats = (cr.cats || [cr.type]).filter(Boolean).slice(0, 5);
    var plats = (cr.plats || []).filter(function (p) { return PLAT_MARK[p.k]; });
    var stats = [
      ['Audience',   fmt(cr.f)],
      ['Avg reach',  String(cr.reach || '—').replace(/\s*per post/, '')],
      ['Engagement', cr.eng || '—'],
      ['Rating',     cr.rating ? Number(cr.rating).toFixed(1) : '—', true],
      ['On time',    cr.ontime != null ? cr.ontime + '%' : '—'],
      ['Replies',    cr.resp ? String(cr.resp).replace(/^within\s+/, '') : '—']
    ];

    return '<section class="ukCrD"><div class="ukCrD_grid">' +
        '<div class="ukCrD_who">' +
          who(cr, mImg(cr.img, cr.n, '', true) +
            '<span class="ukCrAv_dot ' + av.c + '" title="' + esc(av.t) + '" role="img" aria-label="' + esc(av.t) + '"></span>',
            'ukCrAv ukCrAv--xl ukWho--av') +
          '<div class="ukCrD_id">' +
            '<h2 class="ukCrD_n">' +
              /* The most recently earned module badge, not a strip of every
                 module's name in text — a hotel scanning a roster reads one
                 real badge at a glance faster than a row of chips it has to
                 parse, and modules complete in curriculum order, so the last
                 entry in academyModules IS the latest one earned. */
              (cr.academyModules && cr.academyModules.length
                ? badgeImg(cr.academyModules[cr.academyModules.length - 1], 'ukCrD_latestBadge')
                : '') +
              who(cr, esc(cr.n)) +
              (cr.vetted && window.ukVetBadge ? window.ukVetBadge('ukCrVet') : '') +
              (cr.academyCert && window.ukVetBadge ? window.ukVetBadge('ukCrVet ukCrVet--academy') : '') +
              '<button class="ukCrD_open" type="button" data-creator="' + cr.id + '" ' +
                'title="Open full profile" aria-label="Open ' + esc(cr.n) + '&rsquo;s full profile">' + OPEN_ICON + '</button>' +
            '</h2>' +
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
              '<span class="ukCrPlats">' + plats.map(function (p) {
                return '<img class="ukCrPlat" src="' + PLAT_MARK[p.k] + '" alt="' + esc(p.n) + '" title="' + esc(p.n) + '" loading="lazy" decoding="async">';
              }).join('') + '</span>' +
              (cr.langs ? '<span class="ukCrD_mkF ukCrD_lang">Speaks ' + esc(cr.langs) + '</span>' : '') +
            '</div>' +
            ((opts && opts.noStats) ? '' : '<ul class="ukCrD_stats">' + stats.map(function (s) {
              return '<li><span class="ukCrD_sv">' +
                (s[2] ? '<img class="ukCrStar" src="/assets/img/fc/star.svg" alt="" width="10" height="10">' : '') +
                esc(s[1]) + '</span><span class="ukCrD_sl">' + esc(s[0]) + '</span></li>';
            }).join('') + '</ul>') +
          '</div>' +
        '</div>' +
        '<div class="ukCrD_side">' +
          statusBadge(c, (opts && opts.actions) || '', opts && opts.badge) +
          ((opts && opts.noTrack) ? '' : trackedInline(c, cr)) +
        '</div>' +
      '</div>' +
      ((opts && opts.noTrack2) ? '' : '<div class="ukCrD_track">' + track(c.stage) + '</div>') +
      crPopup(st || {}, cr) +
    '</section>';
  }

  /* ================= Overview ================= */
  function overview(m, mode) {
    var out = '<div class="ukBento">' +
        kpi('Engagement', m.stats.eng || '—', 'category average is 2.1%') +
        kpi('Typical reach', m.stats.reach || '—', 'across ' + m.plats.length + ' platform' + (m.plats.length === 1 ? '' : 's')) +
        kpi('Stays delivered', m.stats.stays != null ? m.stats.stays : '—', (m.stats.ontime != null ? m.stats.ontime + '% on time' : '')) +
        kpi('Rated', m.stats.rating != null ? Number(m.stats.rating).toFixed(1) : '—', 'by properties who hosted') +
      '</div>' +

      '<div class="ukGrid ukGrid--prof"><div>' +
        panel(mode === 'owner' ? 'Your work' : 'Past work', m.work.length + (m.work.length === 1 ? ' piece' : ' pieces'),
          '<p class="ukAsk">' + (mode === 'owner'
            ? 'Lead with the pieces you are proudest of. Hotels scroll this first and decide fast.'
            : 'The most persuasive thing on the page, so it gets the space.') + '</p>' +
          workGallery(m.work, mode === 'owner', 4) +
          '<button class="ukGhost" type="button" data-proftab="work" style="margin-top:14px">See all ' + (m.work.length || '') + ' in Past work</button>') +

        (m.been && m.been.length
          ? panel('Where ' + esc((m.n || '').split(' ')[0]) + ' has created', '',
              '<p class="ukAsk">Home base plus the destinations shot in. Useful for knowing who already understands a region.</p>' +
              '<div class="ukMapSlot ukMapSlot--tall" data-profmap=\'' +
                JSON.stringify(m.been.map(function (b, i) {
                  return { id: (m.id || 'me') + '-' + i, lat: b.lat, lng: b.lng, name: b.n, cc: b.cc, sub: i === 0 ? 'Home base' : '', on: i === 0 };
                })).replace(/'/g, '&#39;') + '\'></div>' +
              '<p class="ukWhy">Home base first, then everywhere shot since.</p>')
          : '') +

        (m.worked && m.worked.length
          ? panel('Properties hosted', '',
              '<ul class="ukList">' + m.worked.map(function (w) {
                return '<li><span class="ukList_body"><span class="ukList_name">' + esc(w.h) + '</span>' +
                  '<span class="ukList_meta">Delivered ' + esc(w.out) + '</span></span>' +
                  '<span class="ukTag ukTag--done">Complete</span></li>';
              }).join('') + '</ul>' + (m.proof ? '<p class="ukWhy">' + esc(m.proof) + '</p>' : ''))
          : '') +
      '</div><aside>' +

        (m.reliability
          ? panel('Reliability', '',
              '<dl class="ukFacts ukFacts--stack">' +
                '<div><dt>On-time delivery</dt><dd>' + (m.reliability.ontime != null ? m.reliability.ontime + '%' : '—') + '</dd></div>' +
                '<div><dt>Replies</dt><dd>' + esc(m.reliability.resp || '—') + '</dd></div>' +
                '<div><dt>Turnaround</dt><dd>' + esc(m.reliability.turn || '—') + '</dd></div>' +
                '<div><dt>Stays completed</dt><dd>' + (m.stats.stays != null ? m.stats.stays : '—') + '</dd></div>' +
              '</dl>')
          : '') +

        (mode === 'hotel' ? m.trackedHtml || '' : '') +

        ratesSummaryCard(m, mode) +

      '</aside></div>';
    return out;
  }

  /* Every gallery below shares this one gradient-scrim tile: title (and,
     where real, a stat/note line) rides on the image itself via .ukM_cap
     rather than a caption underneath, so every card in a row is exactly its
     image's aspect ratio — no variable-height caption to throw off the row.
     Same gradient .ukPost_scrim/.ukLib_scrim already use elsewhere. */
  function mediaTile(ratioClass, wideClass, img, title, sub, note, video) {
    return '<figure class="ukReel' + (wideClass ? ' ukReel--wide' : ' ukReel--kit') + '">' +
      '<span class="ukM ' + ratioClass + '"><img src="' + esc(img) + '" alt="' + esc(title) + '" loading="lazy" decoding="async">' +
      (video ? '<span class="ukM_play" aria-hidden="true">&#9654;</span>' : '') +
      '<span class="ukM_scrim" aria-hidden="true"></span>' +
      '<span class="ukM_cap"><span class="ukM_capT">' + esc(title) + '</span>' +
      (sub ? '<span class="ukM_capS">' + sub + '</span>' : '') +
      (note ? '<span class="ukM_capN">' + esc(note) + '</span>' : '') +
      '</span></span></figure>';
  }

  function workGallery(work, owner, cap) {
    if (!work.length) {
      return '<p class="ukFact_e">' + (owner ? 'Nothing posted yet — add your first piece above.' : 'Nothing posted yet.') + '</p>';
    }
    return '<div class="ukReels">' + (cap ? work.slice(0, cap) : work).map(function (w) {
      /* w.plays is null, not 0, where no real per-piece count exists (the
         hotel's own demo gallery, D.assets, has never tracked one) — "0
         plays" would read as a real, dismal number rather than as data
         that was never collected. Say nothing rather than invent it. */
      return mediaTile('ukM--9x16', false, w.img, w.t,
        w.plays != null ? fmt(w.plays) + ' plays &middot; ' + fmt(w.saves || 0) + ' saves' : '', '', w.video);
    }).join('') + '</div>';
  }

  /* Summary chip row, surfaced on Overview per spec — full editing/detail
     lives on the Rates tab; this is just enough to answer "what would it
     cost" without leaving the tab a hotel is already reading. */
  function ratesSummaryCard(m, mode) {
    if (!m.collabTypes || !m.collabTypes.length) return '';
    return panel('Arrangements they will accept', '',
      '<p class="ukAsk">' + (mode === 'owner' ? 'What you have said you will take.' : 'Stated by ' + esc((m.n || '').split(' ')[0]) + ', not assumed.') + '</p>' +
      rateChips(m.collabTypes, m.rates) +
      '<button class="ukGhost" type="button" data-proftab="rates" style="margin-top:12px">See full rates</button>');
  }
  function rateChips(list, rates) {
    rates = rates || {};
    return '<ul class="ukChips">' + list.map(function (t) {
      var money = t !== 'Hosted stay';
      var r = rates[t];
      return '<li class="ukChip2 is-key">' + esc(t) +
        (money ? '<em class="ukChip2_rate">' + (r || r === 0 ? '$' + esc(r) : 'rate on request') + '</em>' : '') +
        '</li>';
    }).join('') + '</ul>';
  }

  /* ================= Stats =================
     The channel switcher replaces three scattered platform readings
     ("Audience by platform", "Where you post"/"Where they publish") with
     one: pick a channel, see its number, the total across every channel
     stays visible the whole time so the aggregate is never lost. Anything
     that genuinely needs every channel at once — which one actually books
     rooms, the audience behind the account as a whole — stays outside the
     switcher as its own card. */
  function statsTab(m, st, mode) {
    var plats = m.plats || [];
    var total = plats.reduce(function (a, p) { return a + (p.f || 0); }, 0);
    var active = (st.profChan && plats.some(function (p) { return p.k === st.profChan; })) ? st.profChan : (plats[0] && plats[0].k);
    var chan = plats.filter(function (p) { return p.k === active; })[0];

    var switcher = plats.length
      ? '<div class="ukSubTabs" role="tablist" aria-label="Channel">' + plats.map(function (p) {
          var on = p.k === active;
          return '<button class="ukSubTab' + (on ? ' is-on' : '') + '" type="button" role="tab" ' +
            'aria-selected="' + on + '" data-profchan="' + p.k + '">' + esc(PLAT_NAME[p.k] || p.n) + '</button>';
        }).join('') + '</div>' +

        (chan ? '<section class="ukSocHero">' +
          '<div class="ukSocHero_b"><p class="ukSocHero_k">' + (UNIT[chan.k] || 'Followers') + '</p>' +
            '<p class="ukSocHero_v">' + fmt(chan.f) + '</p>' +
            '<p class="ukSocHero_s">on ' + esc(PLAT_NAME[chan.k] || chan.n) + ' &middot; ' + fmt(total) + ' across all channels</p></div>' +
          (PLAT_MARK[chan.k] ? '<img class="ukSocHero_i" src="' + PLAT_MARK[chan.k] + '" alt="' + esc(chan.n) + '" width="46" height="46">' : '') +
        '</section>' : '<p class="ukFact_e">No connected channels yet.</p>')
      : '<p class="ukFact_e">No connected channels yet.</p>';

    /* [REVIEW] The spec asks for reach/engagement/performance-over-time to be
       scoped per channel. The data this app tracks — reach-over-time,
       audience age/gender/countries — is one blended figure per creator,
       not broken out per platform anywhere in the data model. Rather than
       fabricate a per-channel split with no real number behind it, those
       stay as cross-channel cards below, same discipline the rest of this
       codebase already holds to (say nothing rather than invent it). A
       later pass wiring real per-platform analytics could move them inside
       the switcher genuinely. */
    var crossChannel =
      '<div class="ukGrid ukGrid--prof"><div>' +
        (m.audienceCountries && m.audienceCountries.length
          ? panel('Where their audience is', 'Top ' + m.audienceCountries.length,
              '<ul class="ukRank">' + m.audienceCountries.map(function (r) {
                return '<li><span class="ukRank_n">' + (window.ukFlagFor ? window.ukFlagFor(r.n) : '') + esc(r.n) + '</span>' +
                  '<span class="ukRank_bar"><span style="width:' + r.pct + '%"></span></span>' +
                  '<span class="ukRank_v">' + r.pct + '%</span></li>';
              }).join('') + '</ul>' +
              '<p class="ukWhy">Ranked by share of audience.</p>')
          : '') +

        (m.reachTrend && m.reachTrend.length && window.UKCHART
          ? panel('Reach over time', '',
              window.UKCHART.area({ data: m.reachTrend, unit: 'thousand', label: 'Reach by month' }) +
              '<p class="ukWhy">Modelled from the current audience and each platform’s own trend. Replaced by real figures once a channel connects live.</p>')
          : '') +

        (m.bestWork && m.bestWork.length >= 2 && window.UKCHART
          ? panel('Your three best', '',
              /* Merges what used to be two cards: a raw "first six by plays"
                 list and this sorted top-3 podium. Same underlying pieces,
                 same metric — keeping both was the same chart twice at
                 different resolutions, so only the more informative cut
                 (ranked, with saves alongside plays) survives. */
              window.UKCHART.podium({ data: m.bestWork.slice(0, 3).map(function (w) {
                return { k: String(w.t).split(',')[0], v: w.plays, show: fmt(w.plays) + ' plays',
                         sub: fmt(w.saves || 0) + ' saves', img: w.img };
              }), label: 'Best performing work' }))
          : '') +

        (m.formatAvg && m.formatAvg.length >= 2 && window.UKCHART
          ? panel('Which format works hardest', '',
              '<p class="ukCard_sub">Average plays per piece, not the total — a format made only twice can still be the strongest thing on the page.</p>' +
              window.UKCHART.capsules({ data: m.formatAvg.map(function (r, i) {
                return { k: r.k, v: r.v, hi: i === 0 };
              }), unit: 'plays each', label: 'Average plays by format' }))
          : '') +
      '</div><aside>' +

        (m.savesPer1000 != null && window.UKCHART
          ? panel('How often it gets saved', '',
              window.UKCHART.ring({ pct: Math.min(100, m.savesPer1000 / 60 * 100), center: Math.round(m.savesPer1000),
                sub: 'saves per 1,000 plays', label: 'Save rate' }) +
              '<p class="ukWhy" style="margin-top:16px">A save is somebody keeping the place for later — the closest thing to intent this data has.</p>')
          : '') +

        (m.bookingsByChannel && m.bookingsByChannel.length && window.UKCHART
          ? panel('Which channel actually books rooms', '',
              '<p class="ukAsk">Confirmed bookings traced back to where the work was posted. Reach is not the same as rooms sold.</p>' +
              window.UKCHART.capsules({ data: m.bookingsByChannel.map(function (r, i) {
                return { k: r.channelName, v: r.count, hi: i === 0 };
              }), unit: 'bookings', label: 'Confirmed bookings by channel' }))
          : '') +

        ((m.stats.age || m.stats.gender) ? panel('Who follows them', '',
            (m.stats.gender && window.UKCHART ? (function () {
              var g = String(m.stats.gender).match(/(\d+)%\s*(women|men)/i);
              if (!g) return '';
              var pct = Number(g[1]), isW = /women/i.test(g[2]);
              return '<p class="ukField_l">Gender</p>' + window.UKCHART.segbar({ segs: isW
                ? [{ l:'Women', v:pct, show:pct + '% women' }, { l:'Men', v:100 - pct, show:(100 - pct) + '% men' }]
                : [{ l:'Men', v:pct, show:pct + '% men' }, { l:'Women', v:100 - pct, show:(100 - pct) + '% women' }] });
            })() : '') +
            (m.stats.age ? '<p class="ukField_l" style="margin-top:16px">Age</p><p class="ukFact_v">' + esc(m.stats.age) + '</p>' : '') +
            (m.langsList && m.langsList.length ? '<p class="ukField_l" style="margin-top:16px">Languages</p>' +
              '<div class="ukChips">' + m.langsList.map(function (l) { return '<span class="ukChip">' + esc(l) + '</span>'; }).join('') + '</div>' : '')
          ) : '') +

        (m.places && m.places.length
          ? panel('Where work has been made', '',
              '<div class="ukMapSlot" data-profmap=\'' + JSON.stringify(m.places.filter(function (r) { return typeof r.lat === 'number'; }).map(function (r) {
                return { id: r.id, lat: r.lat, lng: r.lng, name: String(r.city).split(',')[0], cc: r.cc, sub: String(r.city).split(',').slice(1).join(',').trim() };
              })).replace(/'/g, '&#39;') + '\'></div>' +
              '<p class="ukInk_v">' + m.places.length + '</p><p class="ukInk_n">cities reached</p>')
          : '') +
      '</aside></div>';

    return switcher + crossChannel;
  }

  /* ================= Past work ================= */
  function workTab(m, mode) {
    return panel(mode === 'owner' ? 'Your work' : 'Past work', m.work.length + (m.work.length === 1 ? ' piece' : ' pieces'),
        workGallery(m.work, mode === 'owner')) +

      (m.partnerWork && m.partnerWork.length
        ? panel('Made for hotels', '',
            '<p class="ukAsk">Work delivered on a hosted stay, and what the property kept — the closest thing to a reference readable in ten seconds.</p>' +
            '<div class="ukReels">' + m.partnerWork.map(function (w) {
              return mediaTile('ukM--16x9', true, w.img, w.t,
                esc(w.hotel) + ' &middot; ' + fmt(w.plays || 0) + ' plays', w.out + ' · ' + w.rights);
            }).join('') + '</div>')
        : '') +

      (m.topStays && m.topStays.length
        ? panel('Top stays', '', (mode === 'owner' ? '<button class="ukGhost" type="button" data-ack="You will be able to reorder these" style="float:right;margin-top:-40px">Reorder</button>' : '') +
            '<p class="ukAsk">The ones worth going back to.</p>' +
            '<div class="ukReels">' + m.topStays.map(function (s) {
              return mediaTile('ukM--16x9', true, s.img, s.hotel,
                esc(s.city) + ' &middot; ' + esc(s.when), s.note);
            }).join('') + '</div>')
        : '') +

      (m.itinerary ? (function () {
        var it = m.itinerary;
        return panel('A trip put together', '',
          '<p class="ukAsk">Taste is the thing actually being sold — this shows it faster than any stat.</p>' +
          '<div class="ukItin_top"><span class="ukM ukM--16x9"><img src="' + esc(it.img) + '" alt="' + esc(it.t) + '"></span>' +
            '<div><h4 class="ukItin_t">' + esc(it.t) + '</h4>' +
              '<p class="ukItin_m">' + esc(it.city) + ' &middot; ' + it.days + ' days</p>' +
              '<p class="ukItin_b">' + esc(it.blurb) + '</p></div></div>' +
          '<ol class="ukItin_l">' + it.stops.map(function (s, i) {
            return '<li><span class="ukItin_d">' + esc(s.d) + '</span>' +
              '<span class="ukM ukM--9x16"><img src="' + esc(s.img) + '" alt="' + esc(s.t) + '"' + (i < 1 ? '' : ' loading="lazy" decoding="async"') + '></span>' +
              '<span class="ukItin_body"><span class="ukItin_st">' + esc(s.t) + '</span>' +
              '<span class="ukItin_n">' + esc(s.note) + '</span></span></li>';
          }).join('') + '</ol>');
      })() : '') +

      /* 2c — a creator's saved taste, visible to a hotel, in both modes:
         reuses this tab's own panel()+.ukReels+mediaTile() idiom (the
         "Made for hotels"/"Top stays" shape above), not the itinerary's
         day-ordered structure above it — a collection has no day semantics
         to force onto it. Every tile is still attributed to who actually
         made it (mediaTile's sub line), never presented as this creator's
         own work — this is what she is drawn to, not what she shot. */
      (m.savedInspiration && m.savedInspiration.length
        ? panel('Saved inspiration', '',
            '<p class="ukAsk">' + (mode === 'owner'
              ? 'What you have saved from Discover — this is what a hotel sees of your taste.'
              : 'What ' + esc((m.n || '').split(' ')[0]) + ' has saved from other creators on Ukreate — a read on her taste, not her own work.') + '</p>' +
            '<div class="ukReels">' + m.savedInspiration.slice(0, 6).map(function (it) {
              return mediaTile('ukM--9x16', false, it.img, it.t, 'Saved from ' + esc(it.byN), '', it.video);
            }).join('') + '</div>')
        : '');
  }

  /* ================= Rates ================= */
  function ratesTab(m, mode) {
    var editable = mode === 'owner';
    return panel('What will you accept?', '',
        '<p class="ukAsk">' + (editable
          ? 'A hotel sees exactly this list before they reach out. Hosted stay is the default every hotel already understands — add the others only if the deal is one genuinely worth taking.'
          : 'Stated by ' + esc((m.n || '').split(' ')[0]) + ', not assumed — reach out with one of these.') + '</p>' +
        (editable
          ? '<div class="ukChoice">' + (m.allCollabTypes || m.collabTypes || []).map(function (t) {
              var on = (m.collabTypes || []).indexOf(t) > -1;
              return '<button class="ukPick' + (on ? ' is-on' : '') + '" type="button" aria-pressed="' + on + '" data-metog="collabTypes" data-val="' + esc(t) + '">' + esc(t) + '</button>';
            }).join('') + '</div>'
          : (m.collabTypes && m.collabTypes.length ? rateChips(m.collabTypes, m.rates)
            : '<p class="ukFact_e">No arrangements stated yet.</p>'))) +

      (editable && (m.collabTypes || []).filter(function (t) { return t !== 'Hosted stay'; }).length
        ? panel('What do you charge?', '',
            '<p class="ukWhy" style="margin-top:-2px">Set a number for each paid arrangement accepted. A hotel sees this on the profile — knowing the range up front means fewer back-and-forths before a brief even starts.</p>' +
            (m.collabTypes || []).filter(function (t) { return t !== 'Hosted stay'; }).map(function (t) {
              var r = (m.rates || {})[t];
              return '<div class="ukField" style="margin-top:12px"><span class="ukField_l">' + esc(t) + '</span>' +
                '<div class="ukInputPre"><span class="ukInputPre_p" aria-hidden="true">$</span>' +
                '<input class="ukInputPre_i" type="number" inputmode="numeric" min="0" step="50" ' +
                  'data-merate="' + esc(t) + '" value="' + (r || r === 0 ? esc(r) : '') + '" ' +
                  'placeholder="Rate on request" aria-label="Rate for ' + esc(t) + ', in dollars"></div></div>';
            }).join('') +
            '<p class="ukWhy" style="margin-top:10px">Leave one blank and hotels see "rate on request" — never a blank, never a zero.</p>')
        : '') +

      panel('What they offer', '',
        '<p class="ukAsk">Package shapes built from the arrangements above. ' + (editable ? 'Set once, reused in every pitch.' : 'Pick one now, or decide together later.') + '</p>' +
        '<div class="ukGrid">' + PACKS.map(function (k) {
          return '<div class="ukCPack' + (k.rec ? ' is-rec' : '') + '">' +
            (k.rec ? '<span class="ukPkg_rec">Most chosen</span>' : '') +
            '<p class="ukCPack_n">' + k.n + '</p>' +
            '<p class="ukCPack_d">' + k.nights + ' night' + (k.nights === 1 ? '' : 's') + ' &middot; ' + esc(k.del) + '</p>' +
            '<p class="ukCPack_r">' + esc(k.rights) + '</p>' +
            (editable ? '<button class="ukGhost ukGhost--sm" type="button" data-ack="Coming up">Edit</button>' : '') +
          '</div>';
        }).join('') + '</div>' +
        (!editable ? '<p class="ukWhy">No prices shown here on purpose — a hosted stay is a trade, not an invoice. Money for paid arrangements is above.</p>' : ''));
  }

  /* ================= entry point =================
     opts:
       mode          'owner' | 'hotel'
       actionsHtml   buttons for the header corner (Hire/save for hotel;
                     omit for owner — owner's actions render inside header())
       previewBanner optional HTML shown above everything, e.g. owner's
                     "you are previewing as a hotel would see this" strip
       extraHtml     anything a caller wants prepended (invite picker, etc) */
  function render(m, st, opts) {
    opts = opts || {};
    var mode = opts.mode === 'hotel' ? 'hotel' : 'owner';
    var tab = st.profTab && TABS.some(function (t) { return t[0] === st.profTab; }) ? st.profTab : 'overview';
    var body =
      tab === 'stats' ? statsTab(m, st, mode) :
      tab === 'work'  ? workTab(m, mode) :
      tab === 'rates' ? ratesTab(m, mode) :
      overview(m, mode);

    /* The header's own stats row would be the fourth place these six
       numbers show up (Overview's KPI band, the header, and Stats all say
       the same things) — noStats keeps them to the KPI band only. */
    var ghost = opts.ghost || { id: 'prof-' + m.id, who: m.id, stage: 0, msgs: [], passed: false };

    return (opts.extraHtml || '') +
      (opts.previewBanner || '') +
      creatorHead(ghost, m, opts.stay || null, opts.dates || null, st, {
        /* Tracked link + discount code is a hotel-only panel per the content
           map — a creator has no "tracked link for a collab with myself". */
        noTrack: mode !== 'hotel', noTrack2: true, noStats: true,
        badge: false, actions: opts.actionsHtml
      }) +
      tabBar(tab) +
      '<div id="ukProfPanel" role="tabpanel" aria-label="' + (TABS.filter(function (t) { return t[0] === tab; })[0] || [])[1] + '">' + body + '</div>';
  }

  return { render: render, creatorHead: creatorHead, PACKS: PACKS, rateChips: rateChips,
    MODULE_BADGE: MODULE_BADGE, badgeImg: badgeImg };
})();
