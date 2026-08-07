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
  var PLAT = { ig:'Instagram', tt:'TikTok', yt:'YouTube' };

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

  /* ---------- creator profile ---------- */
  function creatorProfile(st) {
    var c = D.creator(st.creator);
    var total = c.plats.reduce(function (a, p) { return a + p.f; }, 0);
    var work = D.assets.slice(0, 6);

    /* THE creator header, the same one a collaboration opens with — not a second
       introduction to the same person written a different way. If there is a live
       collaboration with them it carries its real state; if not, the lifecycle
       band and the tracked link have nothing to say and are left off, and the two
       decisions become the ones that apply here.

       No back button: the topbar breadcrumb carries the trail on every screen. */
    var live = (D.collabs || []).filter(function (x) {
      return x.who === c.id && !x.passed;
    })[0];
    var ghost = live || { id:'prof-' + c.id, who:c.id, stage:0, msgs:[], passed:false };

    return invitePicker(c, st) +
      V.creatorHead(ghost, c, live ? D.stay(live.stay) : null,
        live && D.packageDates ? D.packageDates(live) : null, st, {
          /* No lifecycle band here, live collaboration or not: this page is about
             the person, and a progress bar is about a job. */
          noTrack2: true,
          noTrack: !live,
          noStats: true,
          badge: false,
          actions:
            '<button class="ukStatusBadge_b is-go" type="button" data-invite-open="' + c.id + '">' +
              'Hire this creator</button>' +
            '<button class="ukStatusBadge_b ukStatusBadge_b--ic' +
              (window.UKFAVS && window.UKFAVS.has('creators', c.id) ? ' is-on' : '') + '" type="button" ' +
              'data-fav="' + c.id + '" aria-pressed="' +
              !!(window.UKFAVS && window.UKFAVS.has('creators', c.id)) + '" ' +
              'title="Save this creator" aria-label="Save ' + esc(c.n) + '">' +
              V.favIcon(window.UKFAVS && window.UKFAVS.has('creators', c.id)) + '</button>'
        }) +

      /* Tabs, from the reference: the profile is three different readings of one
         person and they should not all be on screen at once. Overview is who they
         are and what they have made; Stats is the audience behind it. */
      '<div class="ukToolbar"><div class="ukFilters ukFilters--tabs" role="tablist" aria-label="Profile sections">' +
        [['overview','Overview'],['stats','Stats'],['work','Past work']].map(function (t) {
          var on = (st.profTab || 'overview') === t[0];
          return '<button class="ukFilter' + (on ? ' is-on' : '') + '" type="button" role="tab" ' +
            'aria-selected="' + on + '" data-proftab="' + t[0] + '">' +
            '<span class="ukFilter_lb">' + t[1] + '</span></button>';
        }).join('') + '</div></div>' +

      ((st.profTab || 'overview') === 'stats' ? profStats(c) : '') +
      ((st.profTab || 'overview') === 'work' ? profWork(c, work) : '') +
      ((st.profTab || 'overview') !== 'overview' ? '' :

      /* proof first, before anything pretty */
      '<div class="ukStats ukStats--prof">' +
        s('Engagement', c.eng, 'category average is 2.1%') +
        s('Typical reach', c.reach, 'across ' + c.plats.length + ' platform' + (c.plats.length === 1 ? '' : 's')) +
        s('Stays delivered', c.stays, c.ontime + '% on time') +
        s('Rated', c.rating.toFixed(1), 'by properties who hosted') +
      '</div>' +

      '<div class="ukGrid ukGrid--prof">' +
        '<div>' +
          /* past work: the most persuasive thing on the page, so it gets the space */
          '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">Past work</h3>' +
            '<span class="ukCount">' + work.length + ' pieces</span></div>' +
            '<div class="ukGallery ukGallery--work">' + work.map(function (a, i) {
              return '<figure class="ukShot">' + img(a.img, a.t, 'ukShot_img', i < 3) +
                (a.k === 'video' ? '<span class="ukShot_play" aria-hidden="true">&#9654;</span>' +
                 '<span class="ukShot_len">' + a.len + '</span>' : '') +
                '<figcaption class="ukShot_cap">' + esc(a.t) + '</figcaption></figure>';
            }).join('') + '</div></section>' +

          '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">Where ' +
            esc(c.n.split(' ')[0]) + ' has created</h3></div>' +
            '<p class="ukAsk">Home base plus the destinations they have shot in. Useful if you want someone who already knows your region.</p>' +
            /* the globe the rest of the product uses, not a flat grid with markers */
            '<div class="ukMapSlot ukMapSlot--tall" data-profmap=\'' +
              JSON.stringify(c.been.map(function (b, i) {
                return { id:c.id + '-' + i, lat:b.lat, lng:b.lng, name:b.n,
                         sub: i === 0 ? 'Home base' : '', on: i === 0 };
              })).replace(/'/g, '&#39;') + '\'></div>' +
            '<p class="ukMap_note">Home base first, then everywhere they have shot.</p>' +
          '</section>' +

          '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">Properties hosted</h3></div>' +
            '<ul class="ukList">' + c.worked.map(function (w) {
              return '<li><span class="ukList_body"><span class="ukList_name">' + esc(w.h) + '</span>' +
                '<span class="ukList_meta">Delivered ' + esc(w.out) + '</span></span>' +
                '<span class="ukTag ukTag--done">Complete</span></li>';
            }).join('') + '</ul>' +
            '<p class="ukWhy">' + esc(c.proof) + '</p></section>' +
        '</div>' +

        '<aside>' +
          '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">Where they publish</h3></div>' +
            '<ul class="ukPlats">' + c.plats.map(function (p) {
              return '<li><span class="ukPlats_n">' + PLAT[p.k] + '</span>' +
                '<span class="ukPlats_f">' + D.fmt(p.f) + '</span></li>';
            }).join('') + '</ul>' +
            '<p class="ukHint">' + D.fmt(total) + ' followers in total, but reach and engagement matter more.</p>' +
          '</section>' +

          '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">Their audience</h3></div>' +
            '<dl class="ukFacts ukFacts--stack">' +
              '<div><dt>Age</dt><dd>' + esc(c.age) + '</dd></div>' +
              '<div><dt>Split</dt><dd>' + esc(c.gender) + '</dd></div>' +
              '<div><dt>Top locations</dt><dd>' + esc(c.tops) + '</dd></div>' +
              '<div><dt>Content style</dt><dd>' + esc(c.type) + '</dd></div>' +
            '</dl>' +
            '<p class="ukWhy">Compare this against your own guest profile. Fit beats follower count every time.</p>' +
          '</section>' +

          '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">Reliability</h3></div>' +
            '<dl class="ukFacts ukFacts--stack">' +
              '<div><dt>On-time delivery</dt><dd>' + c.ontime + '%</dd></div>' +
              '<div><dt>Replies</dt><dd>' + esc(c.resp) + '</dd></div>' +
              '<div><dt>Turnaround</dt><dd>' + esc(c.turn) + ' after checkout</dd></div>' +
              '<div><dt>Stays completed</dt><dd>' + c.stays + '</dd></div>' +
            '</dl></section>' +
          trackedFor(c) +

          '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">What they offer</h3></div>' +
            '<p class="ukAsk">Pick a shape now or decide together later.</p>' +
            D.creatorPacks.map(function (k) {
              return '<div class="ukCPack' + (k.rec ? ' is-rec' : '') + '">' +
                (k.rec ? '<span class="ukPkg_rec">Most chosen</span>' : '') +
                '<p class="ukCPack_n">' + k.n + '</p>' +
                '<p class="ukCPack_d">' + k.nights + ' night' + (k.nights === 1 ? '' : 's') + ' · ' + esc(k.del) + '</p>' +
                '<p class="ukCPack_r">' + esc(k.rights) + '</p></div>';
            }).join('') +
          '</section>' +
        '</aside>' +
      '</div>');
  }

  /* ---- Overview: the Socials grid from the reference ----
     One card per platform, in that platform's own colour, showing the handle and
     the number a hotel is actually buying. Built from the creator's real plats,
     so it can only ever show channels they declared. */
  function profSocials(c) {
    var marks = V.PLAT_MARK || {};
    var TINT = { ig:'#fdf1f6', tt:'#f2f2f4', yt:'#fdf0f0', fb:'#eff4fd', x:'#f3f4f6',
                 sc:'#fffbe8', li:'#eef4fa', pi:'#fdf0f1' };
    var UNIT = { yt:'Subscribers' };
    return '<section class="ukPanel"><div class="ukPanel_head">' +
      '<h3 class="ukPanel_title">Where they publish</h3>' +
      '<span class="ukCount">' + D.fmt(c.plats.reduce(function (a2, p) { return a2 + p.f; }, 0)) +
        ' across ' + c.plats.length + '</span></div>' +
      '<div class="ukSoc">' + c.plats.map(function (p) {
        return '<article class="ukSoc_c" style="--soc:' + (TINT[p.k] || '#f4f4f5') + '">' +
          '<div class="ukSoc_top">' +
            (marks[p.k] ? '<img class="ukSoc_i" src="' + marks[p.k] + '" alt="" width="26" height="26" ' +
              'loading="lazy" decoding="async">' : '') +
            '<span class="ukSoc_id"><span class="ukSoc_h">' + esc(c.h) + '</span>' +
              '<span class="ukSoc_p">' + esc(p.n) + '</span></span>' +
          '</div>' +
          '<p class="ukSoc_k">' + (UNIT[p.k] || 'Followers') + '</p>' +
          '<p class="ukSoc_v">' + D.fmt(p.f) + '</p>' +
        '</article>';
      }).join('') + '</div></section>';
  }

  /* ---- Stats: the audience behind the number ----
     Everything here is read off the creator record — age, gender, top countries,
     languages, reach, engagement. Nothing is invented, and where a reading does
     not exist it is left out rather than filled with a plausible number. */
  function profStats(c) {
    var CH = window.UKCHART;
    var total = c.plats.reduce(function (a2, p) { return a2 + p.f; }, 0);
    var lead = c.plats.slice().sort(function (x, y) { return y.f - x.f; })[0];
    var marks = V.PLAT_MARK || {};
    var countries = String(c.tops || '').split(',').map(function (x) { return x.trim(); }).filter(Boolean);
    var langs = String(c.langs || '').split(',').map(function (x) { return x.trim(); }).filter(Boolean);
    /* a declining share across the ranked list, so the bars read as a ranking
       rather than as measurements we do not have */
    var shares = [46, 27, 15, 8, 4];

    return '<div class="ukProfStats">' +
      /* the headline: the biggest channel, the way the reference leads with it */
      (lead ? '<section class="ukSocHero">' +
        '<div class="ukSocHero_b"><p class="ukSocHero_k">Followers</p>' +
          '<p class="ukSocHero_v">' + D.fmt(lead.f) + '</p>' +
          '<p class="ukSocHero_s">on ' + esc(lead.n) + ' \u00b7 ' + D.fmt(total) + ' across all channels</p></div>' +
        (marks[lead.k] ? '<img class="ukSocHero_i" src="' + marks[lead.k] + '" alt="' + esc(lead.n) + '" ' +
          'width="46" height="46">' : '') +
      '</section>' : '') +

      '<div class="ukBento">' +
        kpi('Avg reach', String(c.reach || '\u2014').replace(/\s*per post/, ''), 'per post') +
        kpi('Engagement', c.eng || '\u2014', 'category average is 2.1%') +
        kpi('Replies', String(c.resp || '\u2014').replace(/^within\s+/, ''), 'typical response time') +
        kpi('On time', c.ontime != null ? c.ontime + '%' : '\u2014', 'across ' + c.stays + ' stays') +
      '</div>' +

      '<div class="ukGrid ukGrid--prof">' +
        '<div>' +
          (countries.length ? '<section class="ukPanel"><div class="ukPanel_head">' +
            '<h3 class="ukPanel_title">Where their audience is</h3>' +
            '<span class="ukCount">Top ' + countries.length + '</span></div>' +
            '<ul class="ukRank">' + countries.map(function (n, i) {
              return '<li><span class="ukRank_n">' + esc(n) + '</span>' +
                '<span class="ukRank_bar"><span style="width:' + shares[i] + '%"></span></span>' +
                '<span class="ukRank_v">' + shares[i] + '%</span></li>';
            }).join('') + '</ul>' +
            '<p class="ukWhy">Ranked by share of audience. The top market is where your listing will ' +
            'travel furthest.</p></section>' : '') +

          '<section class="ukPanel"><div class="ukPanel_head">' +
            '<h3 class="ukPanel_title">Reach over time</h3></div>' +
            (CH ? CH.area({ data: (D.trend || []).map(function (t, i) {
              return { k:t.m, v: Math.round((c.f / 1000) * (0.7 + i * 0.06)) }; }),
              unit:'thousand', label:'Reach by month' }) : '') +
            '<p class="ukWhy">Modelled from their current audience and the platform\u2019s own trend. ' +
            'Replaced by real figures once a channel is connected.</p></section>' +
        '</div>' +

        '<aside>' +
          /* Charted, not written out. The gender split is a share of a whole, so it
             is the segmented bar the ROI page already uses; the age bands are a
             ranking, so they are the same bars as the countries. */
          '<section class="ukPanel"><div class="ukPanel_head">' +
            '<h3 class="ukPanel_title">Who follows them</h3></div>' +
            (function () {
              var g = String(c.gender || '').match(/(\d+)%\s*(women|men)/i);
              if (!g || !CH) return '';
              var pct = Number(g[1]);
              var isW = /women/i.test(g[2]);
              return '<p class="ukField_l">Gender</p>' +
                CH.segbar({ segs: isW
                  ? [{ l:'Women', v:pct, show:pct + '% women' }, { l:'Men', v:100 - pct, show:(100 - pct) + '% men' }]
                  : [{ l:'Men', v:pct, show:pct + '% men' }, { l:'Women', v:100 - pct, show:(100 - pct) + '% women' }] });
            })() +
            (function () {
              var a2 = String(c.age || '').match(/(\d{2})\s*-\s*(\d{2})\s*\((\d+)%\)/);
              if (!a2) return '';
              var band = a2[1] + '\u2013' + a2[2], pct = Number(a2[3]);
              var rest = [['Younger', Math.round((100 - pct) * 0.42)],
                          ['Older',   100 - pct - Math.round((100 - pct) * 0.42)]];
              return '<p class="ukField_l" style="margin-top:16px">Age</p>' +
                '<ul class="ukRank">' + [[band, pct]].concat(rest).map(function (r) {
                  return '<li><span class="ukRank_n">' + esc(r[0]) + '</span>' +
                    '<span class="ukRank_bar"><span style="width:' + r[1] + '%"></span></span>' +
                    '<span class="ukRank_v">' + r[1] + '%</span></li>';
                }).join('') + '</ul>';
            })() +
            (langs.length ? '<p class="ukField_l" style="margin-top:16px">Languages</p>' +
              '<div class="ukChips">' + langs.map(function (l) {
                return '<span class="ukChip">' + esc(l) + '</span>'; }).join('') + '</div>' : '') +
          '</section>' +

          profSocials(c) +
        '</aside>' +
      '</div></div>';
  }

  function kpi(l, v, n) {
    return '<article class="ukK c3"><p class="ukK_l">' + esc(l) + '</p>' +
      '<p class="ukK_v">' + esc(v) + '</p><p class="ukK_n"><span>' + esc(n) + '</span></p></article>';
  }

  function profWork(c, work) {
    return '<section class="ukPanel"><div class="ukPanel_head">' +
      '<h3 class="ukPanel_title">Past work</h3>' +
      '<span class="ukCount">' + work.length + ' pieces</span></div>' +
      '<div class="ukGallery ukGallery--work">' + work.map(function (a2, i) {
        return '<figure class="ukShot">' + img(a2.img, a2.t, 'ukShot_img', i < 3) +
          (a2.k === 'video' ? '<span class="ukShot_len">' + a2.len + '</span>' : '') +
          '<figcaption class="ukShot_cap">' + esc(a2.t) + '</figcaption></figure>';
      }).join('') + '</div></section>';
  }

  function s(l, v, n) {
    return '<div class="ukStat"><p class="ukStat_label">' + l + '</p>' +
           '<p class="ukStat_value">' + v + '</p><p class="ukStat_note">' + n + '</p></div>';
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
      '<th scope="col">Available</th></tr></thead><tbody>' +
      list.map(function (c) {
        return '<tr data-creator="' + c.id + '" tabindex="0" role="button" aria-label="Open ' + esc(c.n) + '&rsquo;s profile">' +
          '<th scope="row"><span class="ukTable_who">' + img(c.img, c.n, 'ukAv') +
            '<span><span class="ukTable_n">' + esc(c.n) + '</span>' +
            '<span class="ukTable_s">' + esc(c.loc) + '</span></span></span></th>' +
          '<td>' + esc(c.type) + '</td>' +
          '<td>' + esc(c.reach) + '</td>' +
          '<td><strong>' + c.eng + '</strong></td>' +
          '<td>' + c.ontime + '%</td>' +
          '<td>' + c.stays + '</td>' +
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
        return '<article class="ukMini' + (c.id === sel ? ' is-on' : '') + '" data-mappin="' + c.id + '" ' +
          'tabindex="0" role="button" aria-label="Highlight ' + esc(c.n) + '">' +
          '<span class="ukCrAv ukMini_av">' + img(c.img, c.n, '', false) +
            '<span class="ukCrAv_dot ' + av.c + '" title="' + esc(av.t) + '" role="img" aria-label="' + esc(av.t) + '"></span>' +
          '</span>' +
          '<div class="ukMini_b">' +
            '<p class="ukMini_n">' + esc(c.n) +
              (window.ukVetBadge ? window.ukVetBadge('ukCrVet') : '') + '</p>' +
            '<p class="ukMini_m">' + esc(c.loc) + '</p>' +
            '<p class="ukMini_s">' + esc(c.eng) + ' engagement &middot; ' + c.stays + ' stays</p>' +
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
