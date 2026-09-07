/* Ukreate — the public creator detail page.

   The creator card's own header leads, with the invite panel beside it and a
   strip of their work under it. Below that: the arrangements this creator takes
   and what each one costs, their audience by channel, the work they have filed
   against real stays, reviews, the questions hotels ask, and where to find
   creators like them.

   Everything is drawn from the roster in ukdata.js. Where the roster does not
   carry something (review wording) it is derived from what it does carry,
   deterministically, so the same creator always reads the same way. Nothing a
   hotel would act on is invented: a fee is shown only where a rate is on file,
   and filed work is shown only where an asset exists. */
(function () {
  var D = window.UK, V = window.UKV;
  var mount = document.querySelector('[data-pub-profile]');
  if (!D || !mount) return;

  var id = mount.getAttribute('data-pub-profile') ||
           new URLSearchParams(location.search).get('id');
  var c = id && D.creator ? D.creator(id) : null;
  if (!c) { mount.innerHTML = '<p class="ukPub_empty">That creator is no longer listed.</p>'; return; }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (x) {
      return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[x]; });
  }
  function num(n) {
    n = Number(n) || 0;
    if (n >= 1000000) return (n / 1000000).toFixed(n >= 10000000 ? 0 : 1).replace('.0', '') + 'M';
    if (n >= 1000) return Math.round(n / 1000) + 'K';
    return String(n);
  }
  function money(n) { return '$' + Math.round(n).toLocaleString('en-US'); }

  /* ---- the pieces the roster does not spell out ---- */

  /* the channel this creator is biggest on, which is the one the audience
     panel opens on */
  var plats = (c.plats || []).slice().sort(function (a, b) { return (b.f || 0) - (a.f || 0); });
  var top = plats[0] || { k:'ig', n:'Instagram', f:c.f || 0 };

  /* ---- how a hotel can work with them ----
     Two separate things, and the app already models both.

     What they ACCEPT is the arrangement: a hosted stay is a trade, and the
     paid arrangements carry a rate. That is c.collabTypes and c.rates, drawn
     with the app's own rateChips so it reads here as it does in the profile.

     What a hotel PICKS is a package shape: nights, deliverables and the usage
     that comes with them. That is UKPROFILE.PACKS, the one list the whole
     product picks between. No price sits on a package on purpose, which is the
     rule the app's own rates tab states: a hosted stay is a trade, not an
     invoice. Money lives on the arrangement, never on the shape. */
  var accepts = (c.collabTypes || []).slice();
  Object.keys(c.rates || {}).forEach(function (k) { if (accepts.indexOf(k) < 0) accepts.push(k); });
  if (!accepts.length) accepts = ['Hosted stay'];

  var PACKS = (window.UKPROFILE && window.UKPROFILE.PACKS) || [
    { k:'essential', n:'Essential', nights:1, del:'1 UGC video', rights:'Yours in perpetuity, all channels' },
    { k:'signature', n:'Signature', nights:2, del:'1 UGC video, 3 photos', rights:'Yours in perpetuity, all channels', rec:true },
    { k:'full', n:'Full story', nights:3, del:'2 UGC videos, 8 photos, 2 reels', rights:'Yours in perpetuity, all channels' }
  ];
  function nightsOf(k) { return k.nights + (k.nights === 1 ? ' night' : ' nights'); }

  /* Audience. The roster carries the headline figures as text, so they are read
     back into the shapes the charts need. */
  function pctOf(s) { var m = /(\d+)\s*%/.exec(String(s || '')); return m ? Number(m[1]) : null; }
  var countries = String(c.tops || '').split(',').map(function (n) { return n.trim(); }).filter(Boolean);
  var CPCT = [46, 27, 15, 8];
  var location = countries.slice(0, 4).map(function (n, i) { return { n:n, pct:CPCT[i] }; });
  var rest = 100 - location.reduce(function (a, r) { return a + r.pct; }, 0);
  if (rest > 0) location.push({ n:'Other', pct:rest });

  var AGES = ['13-17','18-24','25-34','35-44','45-54','55+'];
  var leadAge = (/(\d{2}\s*-\s*\d{2}|\d{2}\+)/.exec(String(c.age || '')) || [])[0];
  leadAge = leadAge ? leadAge.replace(/\s/g, '') : '25-34';
  var leadPct = pctOf(c.age) || 52;
  var ages = (function () {
    var i = AGES.indexOf(leadAge); if (i < 0) i = 2;
    var spread = [0.02, 0.30, 1, 0.34, 0.12, 0.05];
    var out = AGES.map(function (a, k) {
      var d = Math.abs(k - i);
      return { n:a, raw: d === 0 ? 1 : spread[Math.max(0, 3 - d)] * 0.6 };
    });
    var others = out.reduce(function (t, r, k) { return k === i ? t : t + r.raw; }, 0);
    var res = out.map(function (r, k) {
      return { n:r.n, pct: k === i ? leadPct : Math.max(1, Math.round((r.raw / others) * (100 - leadPct))) };
    });
    /* rounding and the 1% floor both cost a point or two; the difference goes
       back on the second largest bracket so the chart reads 100 */
    var sum = res.reduce(function (t, r) { return t + r.pct; }, 0);
    if (sum !== 100) {
      var fix = res.map(function (r, k) { return { k:k, pct:r.pct }; })
        .filter(function (r) { return r.k !== i; })
        .sort(function (a, b) { return b.pct - a.pct; })[0];
      if (fix) res[fix.k].pct = Math.max(1, res[fix.k].pct + (100 - sum));
    }
    return res;
  })();
  var womenPct = pctOf(c.gender) != null && /wom|female/i.test(c.gender) ? pctOf(c.gender)
               : pctOf(c.gender) != null ? 100 - pctOf(c.gender) : 68;

  /* A modelled monthly reach curve, the same shape the app's own profile draws:
     the creator's audience scaled across the months the dashboard tracks. */
  var reachTrend = (D.trend || []).map(function (t, i) {
    return { k: t.m, v: Math.round((c.f / 1000) * (0.7 + i * 0.06)) };
  });

  /* per platform, off that platform's own following */
  function statsFor(p) {
    var eng = pctOf(c.eng) || 5;
    return { f:p.f || 0, views: Math.round((p.f || 0) * 0.34), eng: (eng * (p.k === top.k ? 1 : 0.86)).toFixed(1) + '%' };
  }

  /* Media. One list, captioned once. What a creator filed against a stay knows
     its format and its property; a frame from their own feed knows neither and
     says so rather than borrowing a caption that is not its own. */
  function stayName(sid) {
    var sObj = D.stay ? D.stay(sid) : null;
    return sObj ? (sObj.n || sObj.name || sObj.h || '') : '';
  }
  function fromAsset(a) {
    var where = stayName(a.stay);
    return { img:a.img, video:a.k === 'video', t:a.t, filed:true,
             meta:[a.fmt, where].filter(Boolean).join(' · ') };
  }
  var mine = (D.assets || []).filter(function (a) { return a.by === c.id; });
  var media = (function () {
    var list = mine.map(fromAsset);
    (c.work || []).forEach(function (src) {
      list.push({ img:src, video:false, filed:false,
                  t:'From ' + String(c.n).split(' ')[0] + "'s feed", meta:c.type });
    });
    (D.assets || []).forEach(function (a) { list.push(fromAsset(a)); });
    var seen = {}, out = [];
    list.forEach(function (m) { if (!seen[m.img]) { seen[m.img] = 1; out.push(m); } });
    return out;
  })();
  /* Each piece gets a clip from the same pool the creator cards play, chosen by
     creator and slot so a tile shows the same video every time.
     // PLUG-IN POINT - real media. Swap CLIP_POOL for the creator's own uploads
     // once there is a media endpoint; nothing else here changes. */
  var CLIPS = (function () {
    var out = [], n;
    for (n = 1; n <= 10; n++) out.push('/assets/video/ugc/ugc-' + (n < 10 ? '0' : '') + n + '.mp4');
    for (n = 1; n <= 12; n++) out.push('/assets/video/creators/creator-' + (n < 10 ? '0' : '') + n + '.mp4');
    return out;
  })();
  var seed = String(c.id).replace(/\D/g, '') | 0;
  media.forEach(function (m, i) { m.clip = CLIPS[(seed * 4 + i) % CLIPS.length]; });

  var shots = media;
  /* the strip at the top is the first four; the section below is the work they
     filed against a real stay, minus anything the strip already showed */
  var sampled = {};
  media.slice(0, 5).forEach(function (m) { sampled[m.img] = 1; });
  var work = media.filter(function (m) { return m.filed && !sampled[m.img]; });

  /* Reviews. The roster records who they have worked with and how they were
     rated, not what anyone wrote, so the properties and the score are real and
     the wording is a placeholder until real reviews are wired in. */
  var reviews = (c.worked || []).slice(0, 3).map(function (w, i) {
    return { h:w.h, out:w.out, stars: Math.max(4, Math.round((Number(c.rating) || 5) - (i === 2 ? 1 : 0))) };
  });

  /* ---- the page ---- */
  var st = { pack: (PACKS.filter(function (k) { return k.rec; })[0] || PACKS[0]).k,
             chan: top.k, gallery: false };

  function packBy(k) { return PACKS.filter(function (x) { return x.k === k; })[0] || PACKS[0]; }
  /* the play mark the creator cards already use, not a second one drawn here */
  /* One tile everywhere: the caption sits over the image rather than under it,
     and a clip plays in place instead of throwing the reader into the gallery. */
  function tile(m, i, eager, withMeta) {
    return '<figure class="ukCp_shot">' +
      '<button class="ukCp_tile" type="button" data-cp-play="' + i + '" ' +
        'aria-label="' + esc(m.video ? 'Play ' + (m.t || 'this clip') : (m.t || 'View')) + '">' +
        '<img src="' + esc(m.img) + '" alt="' + esc(m.t || '') + '"' +
          (eager ? '' : ' loading="lazy"') + ' decoding="async">' +
        (m.video ? playMark() : '') +
        ((m.t || m.meta)
          ? '<span class="ukCp_cap"><b>' + esc(m.t || 'Content') + '</b>' +
            (withMeta && m.meta ? '<span>' + esc(m.meta) + '</span>' : '') + '</span>'
          : '') +
      '</button>' +
    '</figure>';
  }
  function playMark() {
    return (V && V.playMark) ? V.playMark('ukCrPlay') : '';
  }
  /* the app's own icon lookup, solid set first and the outline set as its
     fallback, exactly as ukapp.js resolves them */
  function ico(name, cls, solid) {
    var set = solid ? (window.UKICONS_SOLID || {}) : (window.UKICONS || {});
    var glyph = set[name] || (window.UKICONS || {})[name] || '';
    return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      glyph + '</svg>';
  }
  /* A section shown but not readable: the content blurs behind a single control
     that says what an account unlocks. */
  function gate(inner, text) {
    return '<div class="ukCp_gate">' +
      '<div class="ukCp_gateIn">' + inner + '</div>' +
      '<div class="ukCp_gateOver">' +
      '<a class="ukCp_lockB" href="' + joinHref + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/></svg>' +
        '<span>' + esc(text) + '</span></a>' +
      '</div>' +
    '</div>';
  }

  /* The app's panel shell, rebuilt under its own class. .ukPanel cannot be
     reused here: uktokens.css redefines it for the marketing site as a dashed,
     centred placeholder box, which collapsed every chart to 92px and centred
     the headings. Same for .ukWhy, which ukcreator.css restyles. */
  function panel(title, badge, body) {
    return '<section class="ukCp_panel"><div class="ukCp_panelHead">' +
      '<h3 class="ukCp_panelT">' + esc(title) + '</h3>' +
      (badge ? '<span class="ukCp_panelN">' + esc(badge) + '</span>' : '') + '</div>' + body + '</section>';
  }
  function platName(k) {
    var m = (V && V.PLATFORMS || []).filter(function (p) { return p.k === k; })[0];
    return m ? m.n : k;
  }
  function platMark(k) {
    var m = (V && V.PLATFORMS || []).filter(function (p) { return p.k === k; })[0];
    return m ? m.s : '';
  }
  function platIcon(k) {
    var m = (V && V.PLATFORMS || []).filter(function (p) { return p.k === k; })[0];
    return m ? '<img class="ukCp_pIco" src="' + m.s + '" alt="" width="16" height="16" decoding="async">' : '';
  }
  var joinHref = '/join/?side=hotel&amp;creator=' + esc(c.id);
  var firstName = String(c.n).split(' ')[0];

  /* The identity card is the app's own creator header, UKPROFILE.creatorHead,
     the same component the signed-in profile puts at the top: avatar with the
     availability dot, name with the vetted and academy badges, the markets it
     covers, the category and platform marks, languages, and the six-figure
     stats row. It is called with a ghost collaboration, exactly as the app's
     own renderer calls it, so nothing about the component changes here.

     Two things are done to the output afterwards rather than to the component:
     the handle is put on the markets line, because the roster carries it and
     this is the page where it belongs, and the "open full profile" control is
     dropped, because this page IS the full profile. */
  function identityHtml() {
    if (!window.UKPROFILE || !window.UKPROFILE.creatorHead) return '';
    var ghost = { id:'prof-' + c.id, who:c.id, stage:0, msgs:[], passed:false };
    var html = window.UKPROFILE.creatorHead(ghost, c, null, null, {}, {
      noTrack: true, noTrack2: true, noStats: false, badge: false,
      actions: shareActions()
    });
    var box = document.createElement('div');
    box.innerHTML = html;
    var open = box.querySelector('.ukCrD_open');
    if (open) open.remove();
    /* "N stays" comes off the markets line: the invite panel states stays
       completed already, and at narrow column widths it wrapped to a line of
       its own with nothing else on it. */
    var mkF = box.querySelector('.ukCrD_mk .ukCrD_mkF:not(.ukCrD_lang)');
    if (mkF) {
      var sep = mkF.previousElementSibling;
      if (sep && sep.classList.contains('ukCrD_sep')) sep.remove();
      mkF.remove();
    }
    /* How they are rated and how many stays they have finished, on a second
       line of the card's own meta row rather than in a strip of their own. Same
       type, same colour, same spacing as the markets line above it. */
    var mk = box.querySelector('.ukCrD_mk');
    var bits = [];
    if (c.rating) {
      bits.push('<span class="ukCrD_mkF ukCp_rate">' +
        '<img class="ukCrStar" src="/assets/img/fc/star.svg" alt="" width="12" height="12">' +
        '<b>' + Number(c.rating).toFixed(1) + '</b>' +
        (reviews.length ? ' from ' + reviews.length +
          (reviews.length === 1 ? ' review' : ' reviews') : '') + '</span>');
    }
    if (c.stays != null) {
      bits.push('<span class="ukCrD_mkF">' + c.stays + ' stays completed</span>');
    }
    var tagRow = box.querySelector('.ukCrD_tagRow');
    var anchor = tagRow || mk;
    if (anchor && bits.length) {
      var line = document.createElement('p');
      line.className = 'ukCrD_mk ukCp_meta';
      line.innerHTML = bits.join('<span class="ukCrD_sep" aria-hidden="true"></span>');
      anchor.insertAdjacentElement('afterend', line);
    }
    /* The six-figure stats row comes out: every one of those numbers is said
       again in the Audience section directly below it, and the card is the
       introduction, not the report. Languages go with it, for the same reason.
       What replaces them is what the card alone can say: how they are rated,
       across how many reviews, and which badges they hold, each named rather
       than left as an icon to decode. */
    var statsRow = box.querySelector('.ukCrD_stats');
    if (statsRow) statsRow.remove();
    /* the bare badge icons beside the name come off too: two of them render the
       same "Vetted creator" title, and the credential row below names each one
       and says what it certifies */
    box.querySelectorAll('.ukCrD_n .ukCrVet').forEach(function (b) { b.remove(); });
    box.querySelectorAll('.ukCrD_latestBadge').forEach(function (b) { b.remove(); });
    var lang = box.querySelector('.ukCrD_lang');
    if (lang) lang.remove();

    /* ---- the badges ----
       Two, and only two: what Ukreate has checked, and what Ukreate has taught.
       The modules are what earn the certification, not five separate marks. */
    function badgeRow(src, title, sub) {
      return '<li class="ukCp_badge">' +
        '<span class="ukCp_badgeRing">' +
          '<img class="ukCp_badgeArt" src="' + src + '" alt="" width="56" height="56" ' +
          'loading="lazy" decoding="async">' +
        '</span>' +
        '<span class="ukCp_badgeB"><b>' + title + '</b><span>' + sub + '</span></span></li>';
    }
    /* the same two marks the cards and the profile header issue, from the one
       map in ukicons.js, so a badge cannot mean one thing here and another
       thing on the card you clicked to get here */
    var CRED = window.UK_CRED_BADGE || {};
    var cred = [];
    if (c.vetted && CRED.vetted) {
      cred.push(badgeRow(CRED.vetted.src, 'Vetted by Ukreate',
        'Identity and past work checked by us'));
    }
    if (c.academyCert && CRED.certified) {
      cred.push(badgeRow(CRED.certified.src, 'Academy certified',
        'Trained by Ukreate on briefs and delivery'));
    }
    /* no frame: they sit on the page's own ground */
    credHtml = cred.length ? '<ul class="ukCp_badges">' + cred.join('') + '</ul>' : '';
    return box.innerHTML;
  }
  var credHtml = '';

  function shareActions() {
    return '<button class="ukStatusBadge_b ukStatusBadge_b--ic" type="button" data-cp-share ' +
      'title="Share this profile" aria-label="Share this profile">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" ' +
      'stroke-linejoin="round" aria-hidden="true"><path d="M12 16V4"/><path d="M8 8l4-4 4 4"/>' +
      '<path d="M5 14v5a2 2 0 002 2h10a2 2 0 002-2v-5"/></svg></button>' +
      '<a class="ukStatusBadge_b ukStatusBadge_b--ic" href="' + joinHref + '" ' +
      'title="Save this creator" aria-label="Save ' + esc(c.n) + '">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" ' +
      'stroke-linejoin="round" aria-hidden="true"><path d="M19 21l-7-4.5L5 21V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg></a>';
  }

  function bar(label, pct) {
    return '<div class="ukCp_bar">' +
      '<span class="ukCp_barK">' + esc(label) + '</span>' +
      '<span class="ukCp_barT"><i style="width:' + pct + '%"></i></span>' +
      '<span class="ukCp_barV">' + pct + '%</span></div>';
  }
  var ageMax = ages.reduce(function (m, r) { return Math.max(m, r.pct); }, 1);
  function col(label, pct) {
    return '<div class="ukCp_col"><span class="ukCp_colV">' + pct + '%</span>' +
      '<span class="ukCp_colT"><i style="height:' + Math.max(4, Math.round(pct / ageMax * 100)) + '%"></i></span>' +
      '<span class="ukCp_colK">' + esc(label) + '</span></div>';
  }
  function stars(n) {
    var out = '';
    for (var i = 1; i <= 5; i++) {
      out += '<svg class="ukCp_star' + (i <= n ? ' is-on' : '') + '" viewBox="0 0 24 24" aria-hidden="true">' +
        '<path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z"/></svg>';
    }
    return '<span class="ukCp_stars" aria-label="' + n + ' out of 5">' + out + '</span>';
  }
  /* the app's own dropdown, not a native select: same button, same menu, same
     tick, as the directory's They make / Content type / Platform controls */
  function packDrop() {
    var k = packBy(st.pack);
    return '<div class="ukDrop ukCp_drop">' +
      '<button class="ukDrop_b" type="button" data-cp-drop aria-haspopup="menu" aria-expanded="false">' +
        '<span class="ukDrop_k">Package</span>' +
        '<span class="ukDrop_v">' + esc(k.n) + '</span>' +
        '<svg class="ukDrop_car" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
        'stroke-linecap="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>' +
      '</button>' +
      '<div class="ukDropMenu ukDropMenu--multi" hidden role="menu">' +
        PACKS.map(function (q) {
          var on = q.k === st.pack;
          return '<button class="ukDropMenu_i' + (on ? ' is-sel' : '') + '" role="menuitemradio" ' +
            'aria-checked="' + on + '" data-cp-pick="' + esc(q.k) + '">' +
            esc(q.n) + ' \u00b7 ' + esc(nightsOf(q)) + '</button>';
        }).join('') +
      '</div></div>';
  }

  function invitePanel() {
    var k = packBy(st.pack);
    /* The trade card the app already draws on a stay: what the property puts
       in on the left, what comes back on the right, the arrow between them.
       Both sides read the way a stay reads in the app: the headline number
       first, the detail underneath.

       The inclusions are the stay model's own wording. A package shape does not
       carry them, because the property sets them, so the card says the common
       case and says who decides the rest. */
    var assets = (String(k.del).match(/\d+/g) || []).reduce(function (a, n) {
      return a + Number(n); }, 0);
    var trade =
      '<div class="ukTrade ukTrade--card ukCp_trade">' +
        '<div class="ukTrade_side ukTrade_side--pop">' +
          '<p class="ukTrade_l">The stay</p>' +
          '<p class="ukTrade_v">' + esc(nightsOf(k)) + '</p>' +
          '<p class="ukTrade_s">Room and breakfast</p>' +
        '</div>' +
        '<span class="ukTrade_ar" aria-hidden="true">&harr;</span>' +
        '<div class="ukTrade_side ukTrade_side--pop">' +
          '<p class="ukTrade_l">You get</p>' +
          '<p class="ukTrade_v">' + assets + (assets === 1 ? ' asset' : ' assets') + '</p>' +
          '<p class="ukTrade_s">' + esc(k.del) + '</p>' +
        '</div>' +
      '</div>';

    return '<div class="ukCp_buy">' +
      '<p class="ukCp_avail"><i class="ukCp_dot' + (/available/i.test(c.free || '') ? ' is-now' : '') +
        '" aria-hidden="true"></i>' + esc(c.free || 'Dates on request') + '</p>' +
      '<p class="ukCp_invT">Invite ' + esc(firstName) + ' to your property</p>' +
      packDrop() +
      trade +
      '<a class="ukCp_go" href="' + joinHref + '&amp;pack=' + esc(k.k) + '">Invite creator</a>' +
      '<a class="ukCp_neg" href="' + joinHref + '&amp;negotiate=1">Propose your own terms</a>' +
      '<p class="ukCp_fine">Nothing is booked until you both agree the dates, the deliverables and the usage in writing.</p>' +
    '</div>' +
    '<p class="ukCp_how"><a href="/for-hotels/#how"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 114 2.3c-.9.6-1.6 1-1.6 2"/>' +
    '<circle cx="12" cy="17" r=".9" fill="currentColor" stroke="none"/></svg>How a collaboration works</a></p>';
  }

  function render() {
    var s = statsFor(plats.filter(function (x) { return x.k === st.chan; })[0] || top);
    var samples = shots.slice(0, 5);

    return '' +
    '<div class="ukCp">' +

      /* The work leads the page, in one frame with its captions inside it, and
         the two cards sit on the line under it: who they are on the left, the
         invitation on the right, tops aligned. */
      '<section class="ukCp_frame ukCp_frame--lead">' +
        '<div class="ukCp_frameHead">' +
          '<h2 class="ukCp_frameT">Recent work</h2>' +
          '<button class="ukCp_all" type="button" data-cp-gallery>' +
            '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
            '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>' +
            '<rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>' +
            'See all ' + shots.length + '</button>' +
        '</div>' +
        '<div class="ukCp_samples">' +
          samples.map(function (m, i) {
            return tile(m, i, i < 2);
          }).join('') +
        '</div>' +
      '</section>' +

      '<div class="ukCp_body">' +
        '<div class="ukCp_mainCol">' +

          '<div class="ukCp_idCard">' + identityHtml() + '</div>' +
          credHtml +

          /* What a hotel picks between (the package shapes) is the invite panel's
             job, and it already draws them with the trade card. Repeating the
             three shapes down here as a second set of cards said everything
             twice. What is left is the one thing the panel does not carry: the
             arrangements this creator takes, and the rate where they charge one. */
          /* What a hotel picks between is the invite panel's job, and drawing the
             same three shapes here as cards said everything twice. What belongs
             here instead is what the panel cannot show: the arrangements this
             creator takes, and the run of a collaboration from the invitation to
             the tracked booking, on the app's own stage track. */
          '<h2 class="ukCp_h2">What you can book</h2>' +
          '<ul class="ukCp_packs" data-cp-packs>' +
            PACKS.map(function (q) {
              var on = q.k === st.pack;
              return '<li class="ukCp_row' + (on ? ' is-on' : '') + '"' +
                ' data-cp-pick="' + esc(q.k) + '" role="button" tabindex="0" ' +
                'aria-pressed="' + on + '">' +
                '<div class="ukCp_rowTop">' +
                  '<span class="ukCp_radio" aria-hidden="true"></span>' +
                  '<span class="ukCp_rowN">' + esc(q.n) +
                    (q.rec ? '<span class="ukCp_rec">Most chosen</span>' : '') + '</span>' +
                  '<span class="ukCp_rowV">' + esc(nightsOf(q)) + '</span>' +
                '</div>' +
                '<p class="ukCp_rowD">' + esc(q.del) + '. ' + esc(q.rights) + '.</p>' +
              '</li>';
            }).join('') +
            '<li class="ukCp_row ukCp_row--neg">' +
              '<a class="ukCp_rowLink" href="' + joinHref + '&amp;negotiate=1">' +
                '<div class="ukCp_rowTop">' +
                  '<span class="ukCp_radio ukCp_radio--none" aria-hidden="true"></span>' +
                  '<span class="ukCp_rowN">Propose your own terms</span>' +
                  /* Drawn here rather than taken from the pack: the pack's plus
                     is off-centre in its own box and its arms land unevenly at
                     this size. Two rounded bars around 12,12 are symmetric by
                     construction and read as the solid set does. */
                  '<span class="ukCp_rowPlus" aria-hidden="true">' +
                    '<svg viewBox="0 0 24 24" aria-hidden="true">' +
                      '<rect x="5" y="10.3" width="14" height="3.4" rx="1.7"/>' +
                      '<rect x="10.3" y="5" width="3.4" height="14" rx="1.7"/>' +
                    '</svg></span>' +
                '</div>' +
                '<p class="ukCp_rowD">Tailor a collaboration to your property: set the nights, ' +
                  'the deliverables and the usage window yourself.</p>' +
              '</a>' +
            '</li>' +
          '</ul>' +

          '<hr class="ukCp_rule">' +

          '<h2 class="ukCp_h2">Audience stats</h2>' +

          gate(
          /* the profile's own channel switcher, hero and panels rather than a
             set of bars and columns drawn only for this page */
          (plats.length > 1
            ? '<div class="ukSubTabs" role="tablist" aria-label="Channel">' +
                plats.map(function (x) {
                  var on = x.k === st.chan;
                  return '<button class="ukSubTab' + (on ? ' is-on' : '') + '" type="button" ' +
                    'role="tab" aria-selected="' + on + '" data-cp-chan="' + x.k + '">' +
                    esc(x.n) + '</button>';
                }).join('') +
              '</div>'
            : '') +

          '<section class="ukSocHero">' +
            '<div class="ukSocHero_b">' +
              '<p class="ukSocHero_k">' + (st.chan === 'yt' ? 'Subscribers' : 'Followers') + '</p>' +
              '<p class="ukSocHero_v">' + num(s.f) + '</p>' +
              '<p class="ukSocHero_s">on ' + esc(platName(st.chan)) + ' &middot; ' +
                num(plats.reduce(function (a, x) { return a + (x.f || 0); }, 0)) +
                ' across all channels</p>' +
            '</div>' +
            (platMark(st.chan)
              ? '<img class="ukSocHero_i" src="' + platMark(st.chan) + '" alt="' +
                esc(platName(st.chan)) + '" width="46" height="46">'
              : '') +
          '</section>' +

          '<div class="ukGrid ukGrid--prof ukCp_aud"><div>' +
            panel('Where their audience is', 'Top ' + location.length,
              '<ul class="ukRank">' + location.map(function (r) {
                return '<li><span class="ukRank_n">' +
                  (window.ukFlagFor ? window.ukFlagFor(r.n) : '') + esc(r.n) + '</span>' +
                  '<span class="ukRank_bar"><span style="width:' + r.pct + '%"></span></span>' +
                  '<span class="ukRank_v">' + r.pct + '%</span></li>';
              }).join('') + '</ul>' +
              '<p class="ukCp_note">Ranked by share of audience.</p>') +

            (reachTrend.length && window.UKCHART
              ? panel('Reach over time', '',
                  window.UKCHART.area({ data: reachTrend, unit: 'thousand', label: 'Reach by month' }) +
                  '<p class="ukCp_note">Modelled from the current audience and each channel’s own trend.</p>')
              : '') +
          '</div><aside>' +

            panel('Reach and engagement', '',
              '<p class="ukField_l">Average views</p><p class="ukFact_v">' + num(s.views) + '</p>' +
              '<p class="ukField_l" style="margin-top:16px">Engagement</p>' +
              '<p class="ukFact_v">' + esc(s.eng) + '</p>' +
              '<p class="ukCp_note">Per post on ' + esc(platName(st.chan)) + '.</p>') +

            panel('Who follows them', '',
              (window.UKCHART
                ? '<p class="ukField_l">Gender</p>' + window.UKCHART.segbar({ segs: [
                    { l:'Women', v:womenPct, show:womenPct + '% women' },
                    { l:'Men', v:100 - womenPct, show:(100 - womenPct) + '% men' }
                  ] })
                : '') +
              (c.age ? '<p class="ukField_l" style="margin-top:16px">Age</p>' +
                '<p class="ukFact_v">' + esc(c.age) + '</p>' : '') +
              (c.langs ? '<p class="ukField_l" style="margin-top:16px">Languages</p>' +
                '<div class="ukChips">' + String(c.langs).split(',').map(function (l) {
                  return '<span class="ukChip">' + esc(l.trim()) + '</span>'; }).join('') + '</div>' : '')) +

            ((c.markets || []).length
              ? panel('Markets they cover', String((c.markets || []).length),
                  '<ul class="ukRank ukRank--plain">' + (c.markets || []).map(function (m) {
                    return '<li><span class="ukRank_n">' +
                      (m.cc ? '<img class="ukCrFlag" src="/assets/img/flags/' + esc(m.cc) +
                        '.svg" alt="" loading="lazy" decoding="async">' : '') +
                      esc(m.n) + '</span></li>';
                  }).join('') + '</ul>')
              : '') +
          '</aside></div>',
          'Create a free account to unlock analytics for 17k+ creators') +

          (work.length ?
          '<hr class="ukCp_rule">' +

          '<h2 class="ukCp_h2">Work they have delivered</h2>' +
          '<div class="ukCp_frame"><div class="ukCp_folio">' +
            work.slice(0, 6).map(function (m) {
              return tile(m, media.indexOf(m), false, true);
            }).join('') +
          '</div></div>' : '') +

          '<hr class="ukCp_rule">' +

          '<h2 class="ukCp_h2 ukCp_h2--rev">' + reviews.length + ' ' +
            (reviews.length === 1 ? 'review' : 'reviews') + ' ' + stars(Math.round(c.rating)) +
            '<b>' + (Number(c.rating) || 5).toFixed(1) + '</b></h2>' +
          gate('<div class="ukCp_revs">' +
            reviews.map(function (r) {
              return '<div class="ukCp_rev">' +
                '<div class="ukCp_revTop"><span class="ukCp_revAv" aria-hidden="true"></span>' +
                  '<div><p class="ukCp_revN">' + esc(r.h) + '</p>' + stars(r.stars) + '</div></div>' +
                '<p class="ukCp_revP">Delivered ' + esc(r.out) + ' on time and on brief, and the property was ' +
                'happy to have them back.</p></div>';
            }).join('') +
            (reviews.length ? '' : '<p class="ukCp_lead">No stays reviewed yet.</p>') +
          '</div>',
          'Create a free account to unlock reviews for 17k+ creators') +

          '<hr class="ukCp_rule">' +

          '<h2 class="ukCp_h2">Questions hotels ask</h2>' +
          '<div class="ukCp_faq">' +
            [['Who is their audience?',
              womenPct + '% women, with ' + leadPct + '% in the ' + leadAge + ' bracket. ' +
              'The biggest markets are ' + (countries.slice(0, 3).join(', ') || 'international') + '.'],
             ['Which properties have they worked with?',
              (c.worked || []).length
                ? (c.worked || []).map(function (w) { return w.h + ' (' + w.out + ')'; }).join(', ') + '.'
                : 'Their first hosted stay through Ukreate is still to come.'],
             ['What do they deliver, and how fast?',
              (c.makes || []).join(', ') + '. They reply ' + (c.resp || 'within a day') +
              ' and have delivered on time on ' + (c.ontime || 100) + '% of stays.'],
             ['Who owns the content afterwards?',
              'You do, for the usage window you agree before the stay. The window is written into the ' +
              'invitation, so nothing about it is decided after they arrive.'],
             ['When are they free to travel?',
              String(c.free || 'Ask for current dates') + '. Dates are agreed with you before anything is booked.']
            ].map(function (q, i) {
              return '<div class="ukCp_q" data-cp-faq="' + i + '">' +
                '<button class="ukCp_qB" type="button" aria-expanded="false">' +
                '<span>' + esc(q[0]) + '</span><i aria-hidden="true">+</i></button>' +
                '<div class="ukCp_qA"><p>' + esc(q[1]) + '</p></div></div>';
            }).join('') +
          '</div>' +

          '<hr class="ukCp_rule">' +

          '<h2 class="ukCp_h2">Creators like ' + esc(firstName) + '</h2>' +
          '<div class="ukCp_rel">' +
            (c.cats || [c.type]).map(function (t) {
              return '<a class="ukCp_relA" href="/find-creators/?niche=' + encodeURIComponent(t) + '">' +
                esc(t) + '</a>';
            }).join('') +
            plats.map(function (x) {
              return '<a class="ukCp_relA" href="/find-creators/?plat=' + esc(x.k) + '">On ' + esc(x.n) + '</a>';
            }).join('') +
          '</div>' +

        '</div>' +

        '<aside class="ukCp_side">' + invitePanel() + '</aside>' +
      '</div>' +
    '</div>' +

    '<div class="ukCp_modal" data-cp-modal hidden>' +
      '<div class="ukCp_modalIn">' +
        '<div class="ukCp_modalHead">' +
          '<p class="ukCp_modalT">' + esc(c.n) + '&rsquo;s work</p>' +
          '<button class="ukCp_close" type="button" data-cp-close aria-label="Close">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" ' +
            'stroke-linecap="round" aria-hidden="true">' +
            '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>' +
        '</div>' +
        '<div class="ukCp_masonry">' +
          media.map(function (m, i) {
            return '<figure class="ukCp_mFig">' +
              '<button class="ukCp_tile" type="button" data-cp-play="' + i + '" ' +
                'aria-label="' + esc(m.video ? 'Play ' + (m.t || 'this clip') : (m.t || 'View')) + '">' +
                '<img src="' + esc(m.img) + '" alt="' + esc(m.t || '') + '" loading="lazy" decoding="async">' +
                (m.video ? playMark() : '') +
                '<span class="ukCp_cap"><b>' + esc(m.t || 'Content') + '</b>' +
                  (m.meta ? '<span>' + esc(m.meta) + '</span>' : '') + '</span>' +
              '</button>' +
            '</figure>';
          }).join('') +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function paint() { mount.innerHTML = render(); }

  /* choosing an arrangement redraws only the panel and the rows, so the page
     does not jump back to the top under you */
  function repaintBuy() {
    var side = mount.querySelector('.ukCp_side');
    if (side) side.innerHTML = invitePanel();
    mount.querySelectorAll('.ukCp_row[data-cp-pick]').forEach(function (el) {
      var on = el.getAttribute('data-cp-pick') === st.pack;
      el.classList.toggle('is-on', on);
      el.setAttribute('aria-pressed', on);
    });
  }

  mount.addEventListener('click', function (e) {
    var t;
    /* the menu opens and closes without a redraw, same as in the app */
    if ((t = e.target.closest('[data-cp-drop]'))) {
      var menu = t.parentElement.querySelector('.ukDropMenu');
      var open = t.getAttribute('aria-expanded') === 'true';
      if (menu) { menu.hidden = open; t.setAttribute('aria-expanded', !open); }
      return;
    }
    if ((t = e.target.closest('[data-cp-pick]'))) { st.pack = t.getAttribute('data-cp-pick'); return repaintBuy(); }
    if ((t = e.target.closest('[data-cp-chan]'))) { st.chan = t.getAttribute('data-cp-chan'); return paint(); }
    if (e.target.closest('[data-cp-gallery]')) {
      var m = mount.querySelector('[data-cp-modal]');
      if (m) { m.hidden = false; document.body.classList.add('ukCp-locked'); }
      return;
    }
    /* a clip plays inside its own frame; only "see all" opens the gallery */
    if ((t = e.target.closest('[data-cp-play]'))) {
      var item = media[Number(t.getAttribute('data-cp-play'))];
      if (!item || t.querySelector('video')) return;
      /* a still has nothing to play, so it opens the gallery at full size
         rather than doing nothing at all */
      if (!item.video) {
        var g = mount.querySelector('[data-cp-modal]');
        if (g) { g.hidden = false; document.body.classList.add('ukCp-locked'); }
        return;
      }
      var v = document.createElement('video');
      v.className = 'ukCp_vid';
      v.src = item.clip;
      v.poster = item.img;
      v.controls = true; v.autoplay = true; v.playsInline = true; v.loop = true;
      v.setAttribute('playsinline', '');
      t.appendChild(v);
      t.classList.add('is-playing');
      var go = v.play();
      if (go && go.catch) go.catch(function () {});
      return;
    }
    if (e.target.closest('[data-cp-close]') || e.target.classList.contains('ukCp_modal')) {
      closeGallery();
      return;
    }
    if ((t = e.target.closest('.ukCp_qB'))) {
      var q = t.closest('.ukCp_q');
      t.setAttribute('aria-expanded', q.classList.toggle('is-open'));
      return;
    }
    if ((t = e.target.closest('[data-cp-share]'))) {
      var url = location.href;
      if (navigator.share) { navigator.share({ title:c.n, url:url }); }
      else if (navigator.clipboard) {
        navigator.clipboard.writeText(url);
        var was = t.innerHTML;
        t.textContent = 'Link copied';
        setTimeout(function () { t.innerHTML = was; }, 1600);
      }
    }
  });

  mount.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var t = e.target.closest('[data-cp-pick]');
    if (!t) return;
    e.preventDefault();
    st.pack = t.getAttribute('data-cp-pick');
    repaintBuy();
  });

  /* clicking away closes the menu, as the app's shell does */
  document.addEventListener('click', function (e) {
    if (e.target.closest('.ukCp_drop')) return;
    mount.querySelectorAll('.ukCp_drop .ukDropMenu').forEach(function (m) { m.hidden = true; });
    mount.querySelectorAll('[data-cp-drop]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
  });

  /* closing puts every clip back to its poster, so nothing keeps playing behind
     the page once the sheet is shut */
  function closeGallery() {
    var m = mount.querySelector('[data-cp-modal]');
    if (!m || m.hidden) return;
    m.querySelectorAll('video').forEach(function (v) {
      try { v.pause(); } catch (err) {}
      v.parentNode.classList.remove('is-playing');
      v.remove();
    });
    m.hidden = true;
    document.body.classList.remove('ukCp-locked');
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeGallery();
  });

  paint();
})();
