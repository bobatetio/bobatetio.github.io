/* Ukreate — creator screens.
   Voice: mentor and hype-person. Media first, vertical by default.
   Every media slot declares its ratio via .ukM--9x16 / --4x5 / --1x1 / --16x9. */
window.UKCV = (function () {
  var D = window.UKC;

  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) {
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; }); };

  /* The same page header the hotel side uses, including its split variant: a
     page whose primary action belongs beside the title now has somewhere to put
     it, instead of floating it into the body. */
  function head(t, s, aside) {
    var body = '<h2>' + t + '</h2>' + (s ? '<p>' + s + '</p>' : '');
    if (!aside) return '<div class="ukPageHead">' + body + '</div>';
    return '<div class="ukPageHead ukPageHead--split"><div class="ukPageHead_txt">' + body + '</div>' +
      '<div class="ukPageHead_aside">' + aside + '</div></div>';
  }
  function empty(t, p, cta) {
    return '<div class="ukPanel ukStub"><div class="ukEmpty"><p class="ukEmpty_t">' + t + '</p>' +
      '<p class="ukEmpty_p">' + p + '</p>' + (cta || '') + '</div></div>';
  }
  /* one media helper. ratio is always declared. */
  function m(key, alt, cls, eager) {
    var a = D.media(key);
    return '<span class="ukM ukM--' + a.ratio + ' ' + (cls || '') + '">' +
      '<img src="' + a.src + '" alt="' + esc(alt || '') + '"' +
      (eager ? '' : ' loading="lazy" decoding="async"') + '>' +
      /* the one play mark used across the product: a filled disc with the triangle
         cut out of it, not a glyph sitting on a plate */
      (a.kind === 'video'
        ? '<svg class="ukM_play" viewBox="0 0 44 44" aria-hidden="true"><path fill-rule="evenodd" ' +
          'clip-rule="evenodd" d="M22 0C9.85 0 0 9.85 0 22s9.85 22 22 22 22-9.85 22-22S34.15 0 22 0Z' +
          'M17.6 16.8Q17.6 13.2 20.6 15.2L27.8 20Q30.8 22 27.8 24L20.6 28.8Q17.6 30.8 17.6 27.2L17.6 16.8Z"/></svg>'
        : '') +
    '</span>';
  }
  function pic(src, alt, ratio, cls, eager) {
    return '<span class="ukM ukM--' + ratio + ' ' + (cls || '') + '">' +
      '<img src="' + src + '" alt="' + esc(alt || '') + '"' +
      (eager ? '' : ' loading="lazy" decoding="async"') + '></span>';
  }
  function stageSay(s) { return s.mine ? s.sayMine : s.say; }

  /* The bookmark from the project's own icon pack, outline and solid. NOT a star:
     a star already means a rating on these cards — the 4.9 in the stats strip and
     the review stars — and NOT the old &#9829; glyph, which is squat and changes
     shape with whatever font renders it. A bookmark is what a shortlist is. */
  var FAV_OUT = '<svg class="ukFav_i" viewBox="0 0 17.5 19.505" aria-hidden="true"><path d="M0.75 16.75V2.75C0.75 1.64543 1.64543 0.75 2.75 0.75H14.75C15.8546 0.75 16.75 1.64543 16.75 2.75V16.75C16.75 18.3981 14.8685 19.3389 13.55 18.35L9.95 15.65C9.23889 15.1167 8.26111 15.1167 7.55 15.65L3.95 18.35C2.63153 19.3389 0.75 18.3981 0.75 16.75Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var FAV_SOL = '<svg class="ukFav_i" viewBox="0 0 16 18.0036" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 5.75V16C0 17.6481 1.88153 18.5889 3.2 17.6L6.8 14.9C7.51111 14.3667 8.48889 14.3667 9.2 14.9L12.8 17.6C14.1185 18.5889 16 17.6481 16 16V5.75H0ZM0 4.25H16V2C16 0.895431 15.1046 0 14 0H2C0.895431 0 0 0.895431 0 2V4.25Z" fill="currentColor"/></svg>';
  function favIcon(on) { return on ? FAV_SOL : FAV_OUT; }



  var HEART_ICON_UNUSED = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.7-4.7-9.6-9.2C1 8.4 2.7 4.7 6.2 4.1c2-.4 3.9.5 5 2 1.1-1.5 3-2.4 5-2 3.5.6 5.2 4.3 3.7 7.7C19.7 16.3 12 21 12 21Z"/></svg>';

  /* The same pagination the hotel app uses, ported verbatim so a long list behaves
     identically on both sides rather than one of them scrolling forever. */
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

  var VIEW_IC = {
    grid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/></svg>',
    list:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
    map:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="m9 3-6 3v15l6-3 6 3 6-3V3l-6 3-6-3Z"/><path d="M9 3v15M15 6v15"/></svg>'
  };
  var CHEV = '<svg class="ukDrop_car" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';

  /* ============================ 1 — home ============================ */
  function home() {
    var needs = D.collabs.filter(function (c) { return D.STAGES[c.stage].mine && c.stage < 5; });
    var booked = D.pitches.filter(function (p) { return p.status === 'Booked'; }).length;
    var replied = D.pitches.filter(function (p) { return p.status !== 'Sent'; }).length;
    var next = D.stays.slice().sort(function (a, b) { return D.scoreFor(b) - D.scoreFor(a); })[0];
    var top = D.me.work[0];

    return '<div class="ukCHi"><div>' +
        '<h2 class="ukCHi_h">Morning, ' + esc(D.me.n.split(' ')[0]) + '.</h2>' +
        '<p class="ukCHi_p">Your riad reel is still climbing. ' +
        (needs.length ? needs.length + (needs.length === 1 ? ' collab needs you' : ' collabs need you') + ' today.' :
         'Nothing needs you right now, so it is a good day to pitch.') + '</p></div>' +
      '</div>' +

      /* their own work, first thing they see */
      '<section class="ukPanel ukCWork"><div class="ukPanel_head">' +
        '<h3 class="ukPanel_title">Your work</h3>' +
        '<button class="ukPanel_more" type="button" data-goto="profile">Your profile</button></div>' +
        '<p class="ukAsk">This is what hotels are actually buying. Not your follower count.</p>' +
        '<div class="ukReels">' + D.me.work.slice(0, 5).map(function (w, i) {
          return '<figure class="ukReel">' + m(w.m, w.t, '', i < 3) +
            '<figcaption><span class="ukReel_t">' + esc(w.t) + '</span>' +
            '<span class="ukReel_s">' + D.fmt(w.plays) + ' plays · ' + D.fmt(w.saves) + ' saves</span></figcaption>' +
          '</figure>';
        }).join('') + '</div>' +
      '</section>' +

      '<div class="ukKpis">' +
        kpi('Pitches sent', D.pitches.length, 'keep it moving', 'pitch') +
        kpi('Replies', replied, Math.round(replied / D.pitches.length * 100) + '% reply rate', 'pitch') +
        kpi('Stays booked', booked, 'from ' + D.pitches.length + ' pitches', 'collabs') +
        kpi('Stays value', D.money(D.earnings.value), 'across ' + D.earnings.nights + ' nights', 'earn') +
      '</div>' +

      '<div class="ukGrid ukGrid--dash">' +
        '<section class="ukPanel"><div class="ukPanel_head">' +
          '<h3 class="ukPanel_title">Your collabs</h3>' +
          '<button class="ukPanel_more" type="button" data-goto="collabs">See all</button></div>' +
          (needs.length ? '<ul class="ukList ukList--rows">' + needs.map(function (c) {
            var s = D.stay(c.stay), stg = D.STAGES[c.stage];
            return '<li data-goto="collabs">' + pic(s.img, s.hotel, '1x1', 'ukM--sm') +
              '<span class="ukList_body"><span class="ukList_name">' + esc(s.hotel) + '</span>' +
              '<span class="ukList_meta">' + esc(s.city) + '</span></span>' +
              '<span class="ukTag ukTag--you">' + esc(stageSay(stg)) + '</span></li>';
          }).join('') + '</ul>'
            : empty('Nothing waiting on you', 'Everything is with the hotels right now. Good time to send a couple more pitches.')) +
        '</section>' +

        '<section class="ukPanel ukCNext"><div class="ukPanel_head">' +
          '<h3 class="ukPanel_title">Pitch this one next</h3></div>' +
          pic(next.img, next.hotel, '16x9', '', true) +
          '<h4 class="ukCNext_n">' + esc(next.hotel) + '</h4>' +
          '<p class="ukCNext_m">' + esc(next.city) + ' · scored ' + D.scoreFor(next) + '/10 for you</p>' +
          '<p class="ukWhy">' + esc(next.why) + '</p>' +
          '<button class="ukBtn" type="button" data-apply="' + next.id + '">Pitch this stay</button>' +
          '<button class="ukGhost" type="button" data-goto="stays">Browse more</button>' +
        '</section>' +
      '</div>';
  }
  function kpi(l, v, n, go) {
    return '<button class="ukKpi ukKpi--go" type="button" data-goto="' + go + '">' +
      '<span class="ukStat_label">' + l + '</span><span class="ukKpi_v">' + v + '</span>' +
      '<span class="ukStat_note">' + n + '</span></button>';
  }

  /* ============================ 5 — collabs ============================ */
  /* ---- being invited ----
     Someone went looking and picked you. That is a different feeling from a pitch
     being answered and the page should say so. It also has to be straight with
     them: if eight people were asked for three rooms, being one of eight is a
     materially different proposition, and finding that out only when you lose is
     how you lose a creator's trust for good. */
  function invitations(st) {
    var I = window.UKINVITE;
    if (!I) return '';
    var mine = I.mine(I.ME).filter(function (r) { return r.me.state !== 'declined'; });
    if (!mine.length) return '';

    return '<section class="ukPanel ukInvIn"><div class="ukPanel_head">' +
      '<h3 class="ukPanel_title">You were invited</h3>' +
      '<span class="ukCount">' + mine.length + '</span></div>' +
      mine.map(function (r) {
        var stay = D.stay(r.inv.stay);
        if (!stay) return '';
        var left = I.slotsLeft(r.inv), open = I.open(r.inv).length, comp = I.isCompetitive(r.inv);

        if (r.me.state === 'accepted') {
          return '<article class="ukInvIn_i is-in"><div class="ukInvIn_b">' +
            '<p class="ukInvIn_t">' + esc(stay.hotel) + ' \u00b7 ' + esc(stay.city) + '</p>' +
            '<p class="ukInvIn_p">You are in. It is in your collabs now, already past approval \u2014 ' +
            'they picked you, so there was nothing to approve.</p></div></article>';
        }
        if (r.me.state === 'filled') {
          /* the kind version of "too late" — never silence, never a blank expiry */
          return '<article class="ukInvIn_i is-gone"><div class="ukInvIn_b">' +
            '<p class="ukInvIn_t">' + esc(stay.hotel) + '</p>' +
            '<p class="ukInvIn_p">This one filled up before you answered. Nothing to do with you or your ' +
            'work \u2014 they asked a few people at once and the rooms went. You are still on their list.</p>' +
            '<button class="ukGhost ukGhost--sm" type="button" data-goto="stays">Find another stay</button>' +
          '</div></article>';
        }
        return '<article class="ukInvIn_i"><img class="ukInvIn_img" src="' + esc(stay.img) + '" alt="">' +
          '<div class="ukInvIn_b">' +
            '<p class="ukInvIn_k">They came looking for you</p>' +
            '<p class="ukInvIn_t">' + esc(stay.hotel) + ' \u00b7 ' + esc(stay.city) + '</p>' +
            '<p class="ukInvIn_p">' + stay.nights + ' nights, ' + esc(stay.room.toLowerCase()) + '. ' +
              esc(stay.inc) + '. You would create ' +
              esc(stay.del.map(function (d) { return d.q + ' \u00d7 ' + d.t.toLowerCase(); }).join(', ')) + '.</p>' +
            (comp
              ? '<p class="ukInvIn_c">Worth knowing: they asked ' + (open + I.accepted(r.inv).length) +
                ' creators for ' + r.inv.capacity + ' room' + (r.inv.capacity === 1 ? '' : 's') +
                '. Being asked at all means they rate your work \u2014 but if you want it, do not sit on it.</p>'
              : '<p class="ukInvIn_c ukInvIn_c--calm">' + left + ' of ' + r.inv.capacity +
                ' rooms still open, and no one else is waiting on your answer.</p>') +
            '<div class="ukInvIn_act">' +
              '<button class="ukBtn" type="button" data-inv-accept="' + r.inv.stay + '">Yes, I am in</button>' +
              '<button class="ukGhost" type="button" data-inv-decline="' + r.inv.stay + '">Not this one</button>' +
            '</div>' +
          '</div></article>';
      }).join('') + '</section>';
  }

  function collabs(st) {
    if (D.hydrateLinked) D.hydrateLinked();
    if (st.thread) return thread(st);
    /* The lifecycle here begins at Onboarding, not Inquiry. On the hotel side
       Inquiry is a real stage — somebody has to decide. From this side it means
       "waiting on them", which is exactly Pitch Pilot's Waiting lane, and having
       it in both places is what let one hotel sit in two lists with two
       different answers. A collaboration starts when a hotel says yes. */
    var f = st.stageF == null ? '1' : String(st.stageF);
    var list = D.collabs.filter(function (c) { return String(c.stage) === f; });
    return head('Your collabs',
      'Every stay a hotel has said yes to, from the package through to sign-off. ' +
      'Anything still waiting on an answer is in Pitch Pilot.',
      '<button class="ukGhost" type="button" data-goto="pitch">Pitch Pilot</button>') +
      invitations(st) +
      (st.sent ? '<p class="ukCheer" role="status">Pitch sent. Nice one. Hotels usually reply within a few days, and no reply for a week is normal rather than a no.</p>' : '') +
      '<div class="ukToolbar"><div class="ukFilters ukFilters--tabs" role="tablist" aria-label="Filter your collaborations by lifecycle stage">' +
        D.STAGES.map(function (stage, i) {
          if (i === 0) return '';        /* Inquiry lives in Pitch Pilot */
          var n = D.collabs.filter(function (c) { return c.stage === i; }).length;
          return '<button class="ukFilter' + (f === String(i) ? ' is-on' : '') + '" type="button" role="tab" aria-selected="' + (f === String(i)) + '" data-stage="' + i + '">' +
            '<span class="ukFilter_lb">' + stage.short + '</span>' + (n ? '<span class="ukFilter_ct">' + n + '</span>' : '') + '</button>';
        }).join('') + '</div></div>' +
      /* THE HOTEL CARD, the shared component — the hotel side's collaboration
         list leads with the creator card because the creator is the subject
         there; here the subject is the property, and that card already exists.
         This was a bespoke .ukBoardCard: a 16:9 photograph over a name, two per
         row and twice the height of anything on the hotel side. */
      (list.length ? '<div class="ukCards">' + list.map(function (c, i) {
        var stay = D.stay(c.stay), mine = D.collabMine(c);
        return '<div class="ukCollabCell" data-thread="' + c.id + '" tabindex="0" role="button" ' +
          'aria-label="Open your collab with ' + esc(stay.hotel) + '">' +
          window.UKSTAY.hotelCard(stay, {
            eager: i < 3,
            tag: c.unread ? '<span class="ukDot">' + c.unread + '</span>' : '',
            foot: track(c.stage, true) + statusBadge(c, mine) + cardPreview(c, stay)
          }) + '</div>';
      }).join('') + '</div>'
        : empty('Nothing at that stage',
                'Try another stage. Anything you are still waiting to hear about is in Pitch Pilot.',
                '<button class="ukBtn" type="button" data-goto="pitch">Open Pitch Pilot</button>'));
  }

  /* The hotel's .ukStatusBadge, not a second component doing its job. Both sides
     answer the same question on a collaboration card — whose move is it, and
     what is the next thing — and this side had grown its own .ukNext to do it,
     with different type and a different tint. Only the words differ, because the
     answer genuinely differs: "With your host" is not "With the creator". */
  function statusBadge(c, mine) {
    var lb = c.stage === 4 ? 'Done' : mine ? 'Your move' : 'With your host';
    return '<div class="ukStatusBadge' + (mine ? ' is-mine' : '') + '" role="status">' +
      '<span class="ukStatusBadge_lb">' + esc(lb) + '</span>' +
      '<span class="ukStatusBadge_say">' + esc(D.collabSay(c)) + '</span>' +
    '</div>';
  }

  function track(stage, mini) {
    var checkGlyph = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.6 6.35 4.85 8.6 9.4 3.75" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    return '<ol class="ukTrack' + (mini ? ' ukTrack--mini' : '') + '">' + D.STAGES.map(function (stg, i) {
      var cls = i < stage ? 'is-done' : i === stage ? 'is-now' : '';
      return '<li class="' + cls + '"><span class="ukTrack_dot">' + (i < stage ? checkGlyph : '') + '</span><span class="ukTrack_lb">' + stg.short + '</span></li>';
    }).join('') + '</ol>';
  }

  function truncate(tx, max) {
    tx = String(tx || '').trim();
    if (tx.length <= max) return tx;
    var cut = tx.slice(0, max);
    var sp = cut.lastIndexOf(' ');
    if (sp > max * 0.6) cut = cut.slice(0, sp);
    return cut.replace(/[,;:]$/, '') + '\u2026';
  }
  function lastOf(arr) { return arr.length ? arr[arr.length - 1] : null; }
  function quotePreview(tx, label) {
    return '<div class="ukPreview ukPreview--msg"><span class="ukPreview_q" aria-hidden="true">&#8220;</span><p class="ukPreview_tx"><span class="ukSrOnly">' + esc(label) + ': </span>' + esc(truncate(tx, 108)) + '</p></div>';
  }
  function emptyPreview(tx) {
    return '<div class="ukPreview ukPreview--empty"><p class="ukPreview_tx ukPreview_tx--muted">' + esc(tx) + '</p></div>';
  }
  function cardPreview(c, stay) {
    var dates = D.packageDates ? D.packageDates(c) : (c.dates || {});
    var brief = D.packageBrief ? D.packageBrief(c) : (c.brief || {});
    if (c.stage === 4) return c.delivered && c.delivered.length ? '<div class="ukPreview ukPreview--thumbs">' + c.delivered.slice(0, 4).map(function (id) { var w = D.work(id); return w ? m(w.m, w.t, 'ukThumbWrap') : ''; }).join('') + '</div>' : emptyPreview('Wrapped and archived.');
    if (c.stage === 3) return c.delivered && c.delivered.length ? '<div class="ukPreview ukPreview--thumbs">' + c.delivered.slice(0, 4).map(function (id) { var w = D.work(id); return w ? m(w.m, w.t, 'ukThumbWrap') : ''; }).join('') + '</div>' : emptyPreview('Your host is reviewing the handover.');
    if (c.stage === 2) {
      var latest = lastOf(c.msgs || []);
      return latest ? quotePreview(latest.tx, 'Latest update') : emptyPreview('Your package is ready and the shoot is next.');
    }
    if (c.stage === 1) {
      if (dates.from && dates.to) return '<div class="ukPreview ukPreview--dates"><span class="ukPreview_ic" aria-hidden="true">' + CAL_ICON + '</span><span class="ukPreview_dates">' + esc(fmtRange(dates.from, dates.to)) + '</span></div>';
      if (brief && brief.title) return quotePreview(brief.title, 'Final brief');
      return emptyPreview('The stay package is ready.');
    }
    var inquiry = lastOf(c.msgs || []);
    return inquiry ? quotePreview(inquiry.tx, 'Latest message') : emptyPreview('No messages yet.');
  }

  var CAL_ICON = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="15" rx="3" stroke="currentColor" stroke-width="1.5"/><path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  var CLIP_ICON = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 12.5 13.5 7a3 3 0 0 1 4.24 4.24L11 18a5 5 0 0 1-7.07-7.07L10.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var CAM_ICON = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2.5" y="7" width="14" height="11" rx="2.5" stroke="currentColor" stroke-width="1.5"/><path d="M16.5 10.7 21 8v9l-4.5-2.7" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>';

  function fmtDate(iso) {
    if (!iso) return '';
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
  }
  function fmtRange(from, to) { return fmtDate(from) + '\u2009\u2013\u2009' + fmtDate(to); }

  function statusBadge(c) {
    var mine = D.collabMine(c);
    var lb = c.stage === 4 ? 'Done' : mine ? 'Your move' : 'With your host';
    return '<div class="ukStatusBadge' + (mine ? ' is-mine' : '') + '" role="status"><span class="ukStatusBadge_lb">' + esc(lb) + '</span><span class="ukStatusBadge_say">' + esc(D.collabSay(c)) + '</span></div>';
  }

  function threadEntry(mg, c, stay) {
    var who = mg.by === 'me' ? 'You' : esc(stay.hotel);
    if (mg.kind === 'dates' && mg.dates) {
      var ttl = (mg.dates.accepted || mg.dates.finalized || mg.dates.status === 'accepted') ? 'Stay dates locked in' : 'Dates proposed';
      return '<div class="ukEntry ukEntry--dates"><span class="ukEntry_ic">' + CAL_ICON + '</span><div class="ukEntry_b"><p class="ukEntry_t">' + ttl + '</p><p class="ukEntry_d">' + esc(fmtRange(mg.dates.from, mg.dates.to)) + '</p><p class="ukEntry_at">' + who + ' · ' + esc(mg.at) + '</p></div></div>';
    }
    if (mg.kind === 'brief' && mg.brief) {
      var brief = mg.brief;
      return '<div class="ukEntry ukEntry--brief"><span class="ukEntry_ic">' + CLIP_ICON + '</span><div class="ukEntry_b"><p class="ukEntry_t">Final brief</p>' +
        (brief.file || brief.link ? '<p class="ukEntry_d">Attached ' + (brief.file ? 'document: ' + esc(brief.file) : 'link: ' + esc(brief.link)) + '</p>' : '<p class="ukEntry_d">' + esc([brief.title, brief.deliverables].filter(Boolean).join(' — ')) + '</p>' + (brief.notes ? '<p class="ukEntry_p">' + esc(brief.notes) + '</p>' : '')) + '<p class="ukEntry_at">' + who + ' · ' + esc(mg.at) + '</p></div></div>';
    }
    if (mg.kind === 'guide' && mg.guide) {
      return '<div class="ukEntry ukEntry--guide"><span class="ukEntry_ic">' + CLIP_ICON + '</span><div class="ukEntry_b"><p class="ukEntry_t">Guest guide shared</p><p class="ukEntry_d">' + esc(mg.guide.prop) + '</p><details class="ukEntry_guide"><summary>Open the guide</summary>' + (mg.guide.sections || []).map(function (sec) { return '<div class="ukEntry_guideS"><p class="ukEntry_guideT">' + esc(sec.t) + '</p><p class="ukEntry_guideP">' + esc(sec.tx) + '</p></div>'; }).join('') + '</details><p class="ukEntry_at">' + who + ' · ' + esc(mg.at) + '</p></div></div>';
    }
    if (mg.kind === 'changereq') {
      return '<div class="ukEntry ukEntry--change"><span class="ukEntry_ic">' + CAM_ICON + '</span><div class="ukEntry_b"><p class="ukEntry_t">Your host would love a small tweak</p>' + (mg.note ? '<p class="ukEntry_d">' + esc(mg.note) + '</p>' : '') + '<p class="ukEntry_at">' + who + ' · ' + esc(mg.at) + '</p></div></div>';
    }
    return '<div class="ukMsg' + (mg.by === 'me' ? ' is-me' : '') + '"><p class="ukMsg_tx">' + esc(mg.tx || '').replace(/\n/g, '<br>') + '</p><p class="ukMsg_at">' + who + ' · ' + esc(mg.at) + '</p></div>';
  }

  function threadPanel(c, stay) {
    return '<section class="ukPanel ukFlowThread"><div class="ukPanel_head"><h3 class="ukPanel_title">Conversation</h3><span class="ukCount">' + c.msgs.length + (c.msgs.length === 1 ? ' message' : ' messages') + '</span></div>' +
      (c.msgs.length ? '<div class="ukMsgs" id="ukMsgs">' + c.msgs.map(function (msg) { return threadEntry(msg, c, stay); }).join('') + '</div>' : '<div class="ukMsgs ukMsgs--empty" id="ukMsgs"><p class="ukEmpty_t">No messages yet</p><p class="ukEmpty_p">Keep it warm and simple. One clear note beats a long one.</p></div>') +
      '</section>';
  }

  function referenceDeck(c, stay) {
    var dates = D.packageDates ? D.packageDates(c) : (c.dates || {});
    var brief = D.packageBrief ? D.packageBrief(c) : (c.brief || {});
    var guide = D.guideSnapshot ? D.guideSnapshot(c) : c.guide;
    return '<div class="ukReference"><div class="ukReference_grid">' +
      '<div class="ukReference_block"><p class="ukReference_k">Dates</p><p class="ukReference_v">' + esc(fmtRange(dates.from, dates.to)) + '</p><p class="ukReference_s">' + stay.nights + ' nights · ' + esc(stay.room.toLowerCase()) + '</p></div>' +
      '<div class="ukReference_block"><p class="ukReference_k">The stay</p><p class="ukReference_s">' + esc(stay.inc) + '</p><p class="ukReference_s">' + esc(stay.del.map(function (d) { return d.q + ' × ' + d.t.toLowerCase(); }).join(', ')) + '</p></div></div>' +
      '<div class="ukReference_block ukReference_block--brief"><p class="ukReference_k">Final brief</p><p class="ukReference_v ukReference_v--sm">' + esc(brief.title || stay.hotel) + '</p><ul class="ukReference_list">' +
        (brief.deliverables ? '<li><strong>Deliverables</strong><span>' + esc(brief.deliverables) + '</span></li>' : '') +
        (brief.deadline ? '<li><strong>Deadline</strong><span>' + esc(fmtDate(brief.deadline)) + '</span></li>' : '') +
        (brief.link ? '<li><strong>Link</strong><span>' + esc(brief.link) + '</span></li>' : '') +
        (brief.file ? '<li><strong>File</strong><span>' + esc(brief.file) + '</span></li>' : '') +
      '</ul>' + (brief.notes ? '<p class="ukReference_s ukReference_s--body">' + esc(brief.notes) + '</p>' : '') + '</div>' +
      '<div class="ukReference_block"><p class="ukReference_k">Guest guide</p>' +
        (guide ? '<details class="ukReference_guide"><summary>Open the guide</summary><div class="ukReference_sections">' + (guide.sections || []).map(function (sec) { return '<div class="ukReference_sec"><p class="ukReference_secT">' + esc(sec.t) + '</p><p class="ukReference_secP">' + esc(sec.tx) + '</p></div>'; }).join('') + '</div></details>' : '<p class="ukReference_s">No guest guide came through on this one.</p>') +
      '</div></div>';
  }

  function composerPlain(c, stay, opts) {
    opts = opts || {};
    return '<section class="ukPanel ukComposer">' + (opts.note ? '<p class="ukAsk">' + opts.note + '</p>' : '') + '<label class="ukSrOnly" for="ukReply">Write a message to ' + esc(stay.hotel) + '</label><textarea id="ukReply" rows="3" placeholder="' + esc(opts.placeholder || 'Write a message') + '"></textarea><div class="ukComposer_row"><div class="ukComposer_actions">' + (opts.actions || '') + '</div><div class="ukComposer_send"><span class="ukHint" id="ukSendHint" role="status" aria-live="polite"></span><button class="ukBtn ukBtn--sec" type="button" data-send="' + c.id + '">Send</button></div></div><div class="ukSrOnly" aria-live="polite">Composer updated for the current collaboration stage.</div></section>';
  }

  function composerInquiry(c, stay) {
    return composerPlain(c, stay, { note:'Inquiry is pure conversation. You can ask a question, share availability, or simply keep it warm while the hotel decides.', placeholder:'Reply to the inquiry' });
  }
  function composerOnboarding(c, stay) {
    return '<section class="ukPanel ukComposer ukComposer--reference"><div class="ukPanel_head"><h3 class="ukPanel_title">Your onboarding pack</h3></div><p class="ukAsk">Everything is locked in here: dates, final brief and the guest guide. Most creators only need a quick note back.</p>' + referenceDeck(c, stay) + '<label class="ukSrOnly" for="ukReply">Add an optional note for ' + esc(stay.hotel) + '</label><textarea id="ukReply" rows="3" placeholder="Optional note about arrivals, timings, or anything practical"></textarea><div class="ukComposer_row"><div class="ukComposer_actions"></div><div class="ukComposer_send"><span class="ukHint" id="ukSendHint" role="status" aria-live="polite"></span><button class="ukBtn ukBtn--sec" type="button" data-send="' + c.id + '">Send note</button></div></div></section>';
  }
  function composerCreating(c, stay) {
    if (!c.creatingStarted) {
      return '<section class="ukPanel ukComposer"><div class="ukPanel_head"><h3 class="ukPanel_title">Ready to start?</h3></div><p class="ukAsk">When you begin filming, mark it here. It is a real signal your host sees on their side.</p><div class="ukComposer_row"><div class="ukComposer_actions"><button class="ukBtn" type="button" data-startshoot="' + c.id + '">Mark as shooting</button></div><div class="ukComposer_send"></div></div></section>';
    }
    return composerPlain(c, stay, { note:'You have marked this as shooting. When the work is ready, hand it over from the panel below.', placeholder:'Share a quick update with your host' });
  }
  function composerContent(c, stay) {
    var note = c.contentStatus === 'changesRequested'
      ? 'Your host would love a small tweak. Reply here if you want to clarify anything, then send a revised handover below.'
      : 'Your handover is with the host now. This thread stays open while they review it.';
    return composerPlain(c, stay, { note:note, placeholder:'Write a message' });
  }
  /* Stars as radio buttons, so the control is the platform's own and keeps its
     keyboard and screen-reader behaviour. Mirrors the hotel side exactly: a hosted
     stay is a trade between two parties who each took a risk, and both get to say
     how it went. */
  function starPick(value) {
    return '<span class="ukStars" role="radiogroup" aria-label="Rating out of five">' +
      [1,2,3,4,5].map(function (n) {
        return '<label class="ukStars_s' + (value >= n ? ' is-on' : '') + '">' +
          '<input type="radio" name="ukRate" value="' + n + '" ' + (value === n ? 'checked ' : '') +
            'data-starpick aria-label="' + n + (n === 1 ? ' star' : ' stars') + '">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5-5.9-3.1-5.9 3.1 1.2-6.5L2.5 9.5l6.6-.9z"/></svg></label>';
      }).join('') + '</span>';
  }
  function starsOut(n) {
    return '<span class="ukStars ukStars--out" role="img" aria-label="' + n + ' out of 5">' +
      [1,2,3,4,5].map(function (i) {
        return '<span class="ukStars_s' + (n >= i ? ' is-on' : '') + '">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5-5.9-3.1-5.9 3.1 1.2-6.5L2.5 9.5l6.6-.9z"/></svg></span>';
      }).join('') + '</span>';
  }

  /* Reviews are keyed on the SHARED link where a collaboration has one, not on the
     per-app collaboration id: the hotel calls it x6 and the creator calls it k5,
     and keyed separately the two sides would each be reviewing into their own
     private record and never see the other. Same derivation the attribution and
     invitation records already use. */
  function reviewKey(c) { return (c && c.link) || (c && c.id); }

  function reviewBlock(c, stay, st) {
    var R = window.UKREVIEWS;
    if (!R) return '';
    st = st || {};
    var key = reviewKey(c);
    var mine = R.mine(key, 'creator');
    var theirs = R.theirs(key, 'creator');
    var editing = st.reviewEdit || !mine;
    var who = (stay && stay.hotel) || 'your host';

    return '<section class="ukPanel ukReview">' +
      '<div class="ukPanel_head"><h3 class="ukPanel_title">How did it go?</h3>' +
        (mine && !st.reviewEdit ? '<button class="ukGhost ukGhost--sm" type="button" data-reviewedit>Edit</button>' : '') +
      '</div>' +
      (editing
        ? '<p class="ukAsk">Your rating of ' + esc(who) + '. They are rating you too, and neither ' +
            'review is shown to the other until both are in.</p>' +
          '<div class="ukReview_pick">' + starPick((mine && mine.stars) || 0) + '</div>' +
          '<textarea class="ukField_i ukField_ta ukReview_ta" id="ukReviewText" rows="3" ' +
            'placeholder="Was the room what they promised? Were they easy to deal with?">' +
            esc((mine && mine.text) || '') + '</textarea>' +
          '<div class="ukComposer_row"><div class="ukComposer_actions"></div>' +
            '<div class="ukComposer_send"><button class="ukBtn" type="button" ' +
              'data-review-save="' + key + '" data-side="creator">' +
              (mine ? 'Update review' : 'Leave review') + '</button></div></div>'
        : '<div class="ukReview_mine"><p class="ukReview_k">You said</p>' + starsOut(mine.stars) +
            (mine.text ? '<p class="ukReview_tx">' + esc(mine.text) + '</p>' : '') + '</div>') +
      '<div class="ukReview_them"><p class="ukReview_k">' + esc(who) + '</p>' +
        (!theirs ? '<p class="ukReview_wait">Nothing yet.</p>'
          : theirs.blind ? '<p class="ukReview_wait">Written, and held until yours is in.</p>'
          : starsOut(theirs.stars) + (theirs.text ? '<p class="ukReview_tx">' + esc(theirs.text) + '</p>' : '')) +
      '</div></section>';
  }

  function composerComplete(c, stay, st) {
    return '<section class="ukPanel ukComposer ukComposer--done"><p class="ukAsk">All wrapped up. This thread stays here for reference, and the work keeps helping your profile and media kit.</p><div class="ukComposer_row"><div class="ukComposer_actions"><button class="ukGhost ukGhost--sm" type="button" data-goto="profile">Open your profile</button><button class="ukGhost ukGhost--sm" type="button" data-goto="kit">Open your media kit</button></div></div></section>' +
      reviewBlock(c, stay, st);
  }
  function composer(c, stay, st) {
    if (c.stage === 4) return composerComplete(c, stay, st);
    if (c.stage === 3) return composerContent(c, stay);
    if (c.stage === 2) return composerCreating(c, stay);
    if (c.stage === 1) return composerOnboarding(c, stay);
    return composerInquiry(c, stay);
  }

  function deliveryConnection(c, stay) {
    if (c.stage === 2 && c.creatingStarted && !c.delivered) {
      return '<section class="ukPanel ukDeliverLink"><div class="ukPanel_head"><h3 class="ukPanel_title">Hand over your work</h3><span class="ukCount">Creator action</span></div><p class="ukAsk">Your host already has the brief and the guide. When you are ready, send the work through the same delivery flow you already use.</p><button class="ukBtn" type="button" data-startdeliver="' + c.id + '">Open the handover flow</button></section>';
    }
    if (c.stage === 3 && c.contentStatus === 'changesRequested') {
      return '<section class="ukPanel ukDeliverLink"><div class="ukPanel_head"><h3 class="ukPanel_title">Send the revised handover</h3><span class="ukCount">Creator action</span></div><p class="ukAsk">You can resend the package once the small tweak is ready.</p><button class="ukBtn" type="button" data-startdeliver="' + c.id + '">Send a revised handover</button></section>';
    }
    if (c.delivered && c.delivered.length) return deliveredPanel(c) + proofPanel(c);
    return '';
  }

  /* ---- proof of posting ----
     Distinct from the handover above it. Handing over is giving the hotel assets
     they own; this is the public link to the post that actually went live, which
     is what ties your tracked link to a real placement and lets a booking be
     attributed to it. Placed here, in the creator-action column beside the
     handover, because that is where the existing structure puts things you do —
     [REVIEW] the collaboration lifecycle is mid-restructure, so this deliberately
     adds no stage and changes no stage logic; it appears once work is delivered. */
  function proofPanel(c) {
    var proofs = c.proofs || [];
    var A = window.UKATTRIB;
    var places = (A ? A.CHANNELS : []).map(function (ch) {
      return '<optgroup label="' + esc(ch.n) + '">' + ch.places.map(function (pl) {
        return '<option value="' + esc(ch.k + '|' + pl) + '">' + esc(pl) + '</option>';
      }).join('') + '</optgroup>';
    }).join('');

    return '<section class="ukPanel ukPostProof"><div class="ukPanel_head">' +
      '<h3 class="ukPanel_title">Show where it went live</h3>' +
      '<span class="ukCount">Creator action</span></div>' +
      '<p class="ukAsk">Paste the public link to your post. This is what connects your tracked link to the ' +
      'real thing, so the bookings it drives are counted as yours. It is not another handover \u2014 ' +
      'your host already has the files.</p>' +
      (proofs.length
        ? '<ul class="ukPostProof_l">' + proofs.map(function (pr) {
            return '<li><span class="ukPostProof_pl">' + esc(pr.placement) + '</span>' +
              '<a class="ukPostProof_u" href="' + esc(pr.url) + '" target="_blank" rel="noopener">' + esc(pr.url) + '</a>' +
              '<span class="ukPostProof_at">' + esc(pr.at) + '</span></li>';
          }).join('') + '</ul>'
        : '') +
      '<div class="ukPostProof_form">' +
        '<label class="ukField"><span class="ukField_l">Link to the live post</span>' +
        '<input class="ukField_i" id="ukProofUrl" type="url" inputmode="url" ' +
        'placeholder="https://instagram.com/reel/..." data-proof-url></label>' +
        '<label class="ukField"><span class="ukField_l">Where it was posted</span>' +
        '<select class="ukField_i" id="ukProofPlace" data-proof-place>' + places + '</select></label>' +
      '</div>' +
      '<span class="ukHint" id="ukProofHint" role="status" aria-live="polite"></span>' +
      '<button class="ukBtn" type="button" data-proof-send="' + c.id + '">Submit proof of posting</button>' +
    '</section>';
  }

  function thread(st) {
    if (D.hydrateLinked) D.hydrateLinked();
    var c = D.collabs.filter(function (x) { return x.id === st.thread; })[0];
    var stay = D.stay(c.stay);
    if (st.delivering) return deliver(st, c, stay);
    return '<button class="ukBack" type="button" data-back>&larr; All collabs</button>' +
      '<div class="ukCollabHead2"><div class="ukCollabHead2_id">' + pic(stay.img, stay.hotel, '1x1', 'ukM--sm', true) + '<div><h2 class="ukCollabHead_n">' + esc(stay.hotel) + '</h2><p class="ukCollabHead_m"><span>' + esc(stay.city) + '</span><span class="ukCollabHead_dot" aria-hidden="true"></span><span>' + stay.nights + ' nights</span><span class="ukCollabHead_dot" aria-hidden="true"></span><span>' + esc(stay.room) + '</span></p></div></div>' + statusBadge(c) + '</div>' +
      '<div class="ukGrid ukGrid--thread"><section class="ukFlow">' + (c.justDelivered ? cheer(c, stay) : '') + threadPanel(c, stay) + composer(c, stay, st) + deliveryConnection(c, stay) + '</section><aside class="ukSideCol"><section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">Where this stands</h3></div>' + track(c.stage) + '</section><section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">The deal</h3></div><dl class="ukFacts ukFacts--stack"><div><dt>You get</dt><dd>' + stay.nights + ' nights, ' + esc(stay.room.toLowerCase()) + '</dd></div><div><dt>Included</dt><dd>' + esc(stay.inc) + '</dd></div><div><dt>You create</dt><dd>' + esc(stay.del.map(function (d) { return d.q + ' × ' + d.t.toLowerCase(); }).join(', ')) + '</dd></div><div><dt>Usage</dt><dd>' + esc(stay.rights) + '</dd></div></dl><p class="ukWhy">Usage means they can post it on their own channels. That is the whole point of UGC, and it is why they do not need you to be huge.</p></section></aside></div>';
  }

  function deliver(st, c, stay) {
    var picked = st.picked || {};
    var chosen = D.me.work.filter(function (w) { return picked[w.id]; });
    var vids = chosen.filter(function (w) { return D.media(w.m).kind === 'video'; }).length;
    var pics = chosen.length - vids;
    var askV = stay.del.filter(function (d) { return /video|reel/i.test(d.t); }).reduce(function (a, d) { return a + d.q; }, 0);
    var askP = stay.del.filter(function (d) { return /photo/i.test(d.t); }).reduce(function (a, d) { return a + d.q; }, 0);
    var short = (vids < askV) || (pics < askP);
    return '<button class="ukBack" type="button" data-back>&larr; Back to the collab</button>' + head('Hand over your work', 'Pick what goes to ' + esc(stay.hotel) + '. You can send more later if you shoot something better.') +
      '<div class="ukGrid ukGrid--thread"><div><section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">Your work</h3><span class="ukCount">' + chosen.length + ' selected</span></div><p class="ukAsk">Tap the pieces you are handing over. Lead with the one you are proudest of — it is usually the one they end up posting.</p><div class="ukReels ukPickGrid">' + D.me.work.map(function (w, i) {
        var on = !!picked[w.id];
        return '<button class="ukPickReel' + (on ? ' is-on' : '') + '" type="button" data-pickwork="' + w.id + '" aria-pressed="' + (on ? 'true' : 'false') + '">' + m(w.m, w.t, '', i < 3) + '<span class="ukPickReel_c" aria-hidden="true">' + (on ? '&#10003;' : '') + '</span><span class="ukReel_t">' + esc(w.t) + '</span></button>';
      }).join('') + '</div><button class="ukGhost" type="button" data-ack="Coming up">Upload something new</button></section></div>' +
      '<aside class="ukPanel ukSticky"><div class="ukPanel_head"><h3 class="ukPanel_title">What they asked for</h3></div><ul class="ukAsked">' + stay.del.map(function (d) {
        var isV = /video|reel/i.test(d.t), have = isV ? vids : pics;
        return '<li class="' + (have >= d.q ? 'is-met' : '') + '"><span class="ukAsked_n">' + esc(d.t) + '</span><span class="ukAsked_c">' + Math.min(have, d.q) + ' of ' + d.q + '</span></li>';
      }).join('') + '</ul>' +
      (short ? '<p class="ukSoothe">You are under what they asked for. You can still send it — most hosts are relaxed about the exact count if the work is good — but it is worth a note in the thread.</p>' : '<p class="ukCheer" style="margin:14px 0 0">That covers the brief. Nice.</p>') +
      '<button class="ukBtn ukCard_cta" type="button" data-senddeliver="' + c.id + '"' + (chosen.length ? '' : ' disabled') + '>Hand over ' + (chosen.length || '') + (chosen.length === 1 ? ' piece' : ' pieces') + '</button>' + (chosen.length ? '' : '<p class="ukHint">Pick at least one piece to hand over.</p>') +
      '<p class="ukWhy">They get the right to post these on their own channels. You keep them too, and they go straight onto your media kit.</p></aside></div>';
  }

  function cheer(c, stay) {
    return '<section class="ukCheerBig" role="status"><div><p class="ukHero_eyebrow">Delivered</p><h3 class="ukCheerBig_t">That is a wrap on ' + esc(stay.hotel) + '</h3><p class="ukCheerBig_p">Your work is with them. This one goes on your media kit and your profile, which makes the next pitch easier.</p><div class="ukHero_cta"><button class="ukBtn" type="button" data-goto="kit">See your media kit</button><button class="ukGhost" type="button" data-goto="stays">Find the next one</button></div></div><div class="ukCheerBig_m">' + (c.delivered || []).slice(0, 3).map(function (id) { var w = D.work(id); return w ? m(w.m, w.t) : ''; }).join('') + '</div></section>';
  }

  function deliveredPanel(c) {
    return '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">What you delivered</h3><span class="ukCount">' + c.delivered.length + ' pieces</span></div><div class="ukReels">' + c.delivered.map(function (id) { var w = D.work(id); return w ? '<figure class="ukReel">' + m(w.m, w.t) + '<figcaption><span class="ukReel_t">' + esc(w.t) + '</span></figcaption></figure>' : ''; }).join('') + '</div></section>';
  }

  /* ============================ 3 — discover stays ============================ */
  function stays(st) {
    if (st.open) return stayDetail(st);
    var view = st.view || 'grid';
    var q = (st.q || '').toLowerCase(), sf = st.style || 'all';
    var list = D.stays.filter(function (s) {
      if (st.saved && !s.saved) return false;
      if (q && (s.hotel + ' ' + s.city + ' ' + s.style).toLowerCase().indexOf(q) < 0) return false;
      if (sf !== 'all' && s.style !== sf) return false;
      return true;
    });
    var styles = ['all'].concat(D.stays.map(function (s) { return s.style; })
      .filter(function (v, i, a) { return a.indexOf(v) === i; }));

    return head('Discover stays', 'Hotels that actually want to work with creators like you.',
      '<button class="ukBtn" type="button" data-goto="pitch">Open Pitch Pilot</button>') +
      '<div class="ukToolbar ukToolbar--split ukCrBar">' +
        '<div class="ukCrBar_l">' +
          '<label class="ukSearch"><span data-icon="search"></span>' +
          '<input type="search" placeholder="Search a city or a vibe" value="' + esc(st.q || '') + '" data-q aria-label="Search stays"></label>' +
          '<div class="ukFilters ukFilters--tabs" role="group" aria-label="Saved">' +
            [['all','All'],['saved','Saved']].map(function (a) {
              var on = (a[0] === 'saved') === !!st.saved;
              return '<button class="ukFilter' + (on ? ' is-on' : '') + '" type="button" ' +
                'aria-pressed="' + on + '" data-savedf="' + a[0] + '"><span class="ukFilter_lb">' + a[1] + '</span></button>';
            }).join('') + '</div>' +
          '<span class="ukCrBar_gap" aria-hidden="true"></span>' +
          /* sixteen kinds of stay wrapped to three rows of pills and pushed the
             results off the screen; it is a menu, like every other long list */
          '<div class="ukDrop"><button class="ukDrop_b" type="button" data-drop-toggle ' +
            'aria-haspopup="menu" aria-expanded="false">' +
            '<span class="ukDrop_k">Kind of stay</span>' +
            '<span class="ukDrop_v">' + (sf === 'all' ? 'Every kind' : esc(sf)) + '</span>' +
            CHEV + '</button>' +
            '<div class="ukDropMenu" hidden role="menu">' + styles.map(function (t) {
              return '<button class="ukDropMenu_i' + (t === sf ? ' is-sel' : '') + '" role="menuitem" ' +
                'data-style="' + esc(t) + '">' + (t === 'all' ? 'Every kind of stay' : esc(t)) + '</button>';
            }).join('') + '</div></div>' +
        '</div>' +
        '<div class="ukSeg ukSeg--ic" role="group" aria-label="View">' +
          [['grid','Grid'],['list','List'],['map','Map']].map(function (v) {
            return '<button class="ukSeg_b' + (v[0] === view ? ' is-on' : '') + '" type="button" data-view="' + v[0] +
              '" aria-pressed="' + (v[0] === view ? 'true' : 'false') + '">' +
              (VIEW_IC[v[0]] || '') + '<span>' + v[1] + '</span></button>'; }).join('') +
        '</div>' +
      '</div>' +

      (!list.length
        ? empty('Nothing matches that yet',
            'Try a wider search. There are ' + D.stays.length + ' stays open right now, and new ones land most weeks.',
            '<button class="ukBtn" type="button" data-clearf>Clear the filters</button>')
        : view === 'map' ? stayMap(list, st)
        : view === 'list' ? stayList(list)
        : stayGrid(list, st));
  }

  /* THE stay card — the same object the hotel renders. See ukstaycard.js. This
     used to be a lookalike built out of .ukStay classes: a different shape for
     the same thing, on the two sides of one trade, so nothing fixed on one side
     ever reached the other. What is genuinely creator-side rides ON the card
     rather than replacing it: the score and the save control lie over the photo,
     and the foot carries this side's two actions. */
  function stayCard(s, i, st) {
    st = st || {};
    var over = (s.published ? '<span class="ukTag ukTag--you ukStayNew">Just published</span>' : '') +
      '<span class="ukScore2">' + D.scoreFor(s) + '<em>/10</em></span>' +
      '<button class="ukHeart' + (s.saved ? ' is-on' : '') + '" type="button" data-save="' + s.id + '" ' +
      'aria-pressed="' + (s.saved ? 'true' : 'false') + '" aria-label="' +
      (s.saved ? 'Remove ' : 'Save ') + esc(s.hotel) + (s.saved ? ' from saved' : '') + '">' +
      favIcon(s.saved) + '</button>';
    return '<div class="ukStayCell" data-open="' + s.id + '" tabindex="0" role="button" ' +
      'aria-label="Open ' + esc(s.hotel) + '">' +
      window.UKSTAY.card(s, null, {
        eager: i < 3,
        shot: (st.shots || {})[s.id] || 0,
        pop: st.stayPop,
        tag: over,
        /* The hotel labels the creator's half of the trade "You get". Read from
           here it is what THEY get, and leaving the hotel's word on it made the
           card look like the creator was being handed the deliverables. */
        getLabel: 'They get',
        propGo: { attr:'hotel', val:s.id, title:'See the property' },
        foot: '<div class="ukStayCell_act">' +
          applyCta(s) +
          '<button class="ukGhost" type="button" data-hotel="' + s.id + '">See the property</button>' +
        '</div>'
      }) + '</div>';
  }

  /* A creator who has already applied should not be offered the button again —
     the application is on the shared record, so both sides know it exists and
     the answer is pending with the hotel. */
  function applyCta(s, cls) {
    var A = window.UKAPPLY;
    var sent = A && A.applied(s.id);
    if (!sent) {
      return '<button class="ukBtn' + (cls ? ' ' + cls : '') + '" type="button" ' +
        'data-apply="' + s.id + '">Pitch this stay</button>';
    }
    var said = sent.state === 'approved' ? 'They said yes'
             : sent.state === 'passed'   ? 'They passed'
             : 'Applied \u2014 waiting on them';
    return '<button class="ukGhost' + (cls ? ' ' + cls : '') + '" type="button" ' +
      'data-goto="collabs">' + said + '</button>';
  }

  function stayGrid(list, st) {
    var pg = paginate(list, (st || {}).pgStays, 12, 'pgStays');
    return '<div class="ukGrid ukGrid--stays">' + pg.rows.map(function (s, i) {
      return stayCard(s, i, st);
    }).join('') + '</div>' + pg.nav;
  }

  function stayList(list) {
    return '<div class="ukPanel"><ul class="ukList ukList--rows">' + list.map(function (s) {
      return '<li data-open="' + s.id + '" tabindex="0" role="button">' +
        pic(s.img, s.hotel, '1x1', 'ukM--sm') +
        '<span class="ukList_body"><span class="ukList_name">' + esc(s.hotel) + '</span>' +
        '<span class="ukList_meta">' + esc(s.city) + ' · ' + s.nights + ' nights · ' + esc(s.inc) + '</span></span>' +
        '<span class="ukWhen">' + esc(s.from) + '</span>' +
        '<span class="ukTag ukTag--you">' + D.scoreFor(s) + '/10</span></li>';
    }).join('') + '</ul></div>';
  }

  /* The flat lat/long grid was a diagram of a map. This is the globe the hotel
     app and both onboardings already use, so a place looks like the same place
     everywhere in the product. */
  function stayMap(list, st) {
    var sel = st.pin && list.some(function (s) { return s.id === st.pin; }) ? st.pin : null;
    var placed = list.filter(function (s) { return s.lat && s.lng; });
    var pts = placed.map(function (s) {
      return { id:s.id, lat:s.lat, lng:s.lng, name:s.hotel, sub:s.city,
               cc:s.cc || null, on:s.id === sel };
    });
    return '<div class="ukHybrid">' +
      '<div class="ukHybrid_map">' +
        '<div class="ukMapSlot ukMapSlot--tall" data-cstaymap=\'' + JSON.stringify(pts).replace(/'/g, '&#39;') + '\'></div>' +
        '<p class="ukMap_note">' + placed.length + ' of ' + list.length +
          ' open stays are placed. Select one to bring it to the front.</p>' +
      '</div>' +
      '<div class="ukHybrid_side">' + list.map(function (s) {
        return '<article class="ukMini' + (s.id === sel ? ' is-on' : '') + '" data-pin="' + s.id + '" ' +
          'tabindex="0" role="button" aria-label="Highlight ' + esc(s.hotel) + '">' +
          pic(s.img, s.hotel, '1x1', 'ukM--sm ukMini_av') +
          '<div class="ukMini_b"><p class="ukMini_n">' + esc(s.hotel) + '</p>' +
          '<p class="ukMini_m">' + esc(s.city) + '</p>' +
          '<p class="ukMini_s">' + s.nights + ' nights &middot; scored ' + D.scoreFor(s) + '/10</p></div>' +
          '<span class="ukTag ukTag--you">' + D.scoreFor(s) + '/10</span>' +
          (s.id === sel ? '<div class="ukMini_act">' +
            '<button class="ukBtn ukBtn--sm" type="button" data-open="' + s.id + '">See the stay</button>' +
          '</div>' : '') +
        '</article>';
      }).join('') + '</div></div>';
  }


  function stayDetail(st) {
    var s = D.stay(st.open);
    return '<button class="ukBack" type="button" data-back>&larr; All stays</button>' +
      '<div class="ukGrid ukGrid--stay">' +
        '<div>' + pic(s.img, s.hotel, '16x9', 'ukM--hero', true) +
          '<h2 class="ukCHead_n" style="margin-top:16px">' + esc(s.hotel) + '</h2>' +
          '<p class="ukCHead_m">' + esc(s.city) + ' · ' + esc(s.style) + '</p>' +
          '<p class="ukWhy">' + esc(s.why) + '</p>' +
          '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">What they are asking for</h3></div>' +
            '<div class="ukChips">' + s.del.map(function (d) {
              return '<span class="ukChip">' + d.q + ' × ' + esc(d.t.toLowerCase()) + '</span>'; }).join('') + '</div>' +
            '<p class="ukWhy">UGC means content they post on their own channels. They are buying your eye, not your audience.</p>' +
          '</section>' +
        '</div>' +
        '<aside class="ukPanel ukSticky">' +
          '<span class="ukScore3">' + D.scoreFor(s) + '<em>/10</em><span>pitch-friendly</span></span>' +
          '<p class="ukFit">' + esc(D.fitNote(s)) + '</p>' +
          '<dl class="ukFacts ukFacts--stack">' +
            '<div><dt>You get</dt><dd>' + s.nights + ' nights, ' + esc(s.room.toLowerCase()) + '</dd></div>' +
            '<div><dt>Included</dt><dd>' + esc(s.inc) + '</dd></div>' +
            '<div><dt>Dates</dt><dd>' + esc(s.from) + ' to ' + esc(s.to) + '</dd></div>' +
            '<div><dt>Usage</dt><dd>' + esc(s.rights) + '</dd></div>' +
          '</dl>' +
          applyCta(s, 'ukCard_cta') +
          '<button class="ukGhost ukCard_cta" type="button" data-hotel="' + s.id + '">See the property</button>' +
          '<button class="ukGhost ukCard_cta" type="button" data-save="' + s.id + '">' +
            (s.saved ? 'Saved' : 'Save for later') + '</button>' +
          '<p class="ukHint">Pitching costs you nothing and they see your work, not your numbers.</p>' +
        '</aside></div>';
  }

  /* ============================ 4 — apply ============================ */
  function apply(st) {
    var s = D.stay(st.stay);
    var draft = 'Hi ' + s.hotel + ' team,\n\nI would love to be considered for the ' +
      s.nights + '-night stay in ' + s.city.split(',')[0] + '. I shoot ' + D.me.niche.toLowerCase() +
      ', and I can deliver ' + s.del.map(function (d) { return d.q + ' ' + d.t.toLowerCase(); }).join(' and ') +
      ' within ten days of checking out.\n\nHappy to work to whatever brief you set.\n\n' + D.me.n;

    return '<button class="ukBack" type="button" data-back>&larr; Back to the stay</button>' +
      head('Pitch ' + esc(s.hotel), 'One message. We have written a first draft from your profile — change anything.') +
      '<div class="ukGrid ukGrid--thread"><div>' +
        '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">Your message</h3></div>' +
          '<label class="ukSrOnly" for="ukApplyMsg">Your pitch message</label>' +
          '<textarea class="ukField_i" id="ukApplyMsg" rows="9">' + esc(draft) + '</textarea>' +
          '<p class="ukWhy">Short beats clever. Say what you shoot, what you will deliver, and when.</p>' +
        '</section>' +
        '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">What they will see</h3></div>' +
          '<div class="ukReels">' + D.me.work.slice(0, 4).map(function (w) {
            return '<figure class="ukReel">' + m(w.m, w.t) + '</figure>'; }).join('') + '</div>' +
          '<p class="ukWhy">Your three most-saved pieces go with every pitch. This is the part that lands.</p>' +
        '</section>' +
        '<div class="ukNav2"><span></span><div class="ukNav2_r">' +
          '<button class="ukGhost" type="button" data-ack="Saved">Save as draft</button>' +
          (window.UKAPPLY && window.UKAPPLY.applied(s.id)
            ? '<button class="ukGhost" type="button" data-goto="collabs">Already applied \u2014 open the thread</button>'
            : '<button class="ukBtn" type="button" data-sendapply="' + s.id + '">Send my pitch</button>') +
          '</div></div>' +
      '</div>' +
      '<aside class="ukPanel ukSticky"><div class="ukPanel_head"><h3 class="ukPanel_title">The trade</h3></div>' +
        '<div class="ukTrade"><div class="ukTrade_side"><p class="ukTrade_l">You get</p>' +
          '<p class="ukTrade_v">' + s.nights + ' nights</p><p class="ukTrade_s">' + esc(s.inc) + '</p></div>' +
          '<span class="ukTrade_ar" aria-hidden="true">&harr;</span>' +
          '<div class="ukTrade_side"><p class="ukTrade_l">You create</p>' +
          '<p class="ukTrade_v">' + s.del.reduce(function (a, d) { return a + d.q; }, 0) + ' pieces</p>' +
          '<p class="ukTrade_s">They keep and post them</p></div></div>' +
        '<p class="ukWhy">No money changes hands on a hosted stay. You are trading your work for the room, ' +
        'and the content stays useful to you both.</p>' +
        '<p class="ukLead">Nothing is locked in. They reply, then you agree dates together.</p>' +
      '</aside></div>';
  }

  /* ============================ 7 — earnings ============================ */
  /* earn() used to live here and drew its own bar chart out of divs
     (.ukChart_col / _bar / _tip) — the only hand-rolled chart in the product,
     while everything else went through UKCHART. ukcdash.js has replaced this
     view since, so the code was dead as well as divergent. */
  function st2(l, v, n) {
    return '<div class="ukKpi"><p class="ukStat_label">' + l + '</p><p class="ukKpi_v">' + v + '</p>' +
      '<p class="ukStat_note">' + n + '</p></div>';
  }

  /* ============================ 2b — profile ============================ */
  function profile() {
    var me = D.me;
    return head('Your profile', 'This is what a hotel sees. Make yourself impossible to ignore.') +
      '<section class="ukProf">' +
        '<div class="ukProf_id">' + pic(me.img, me.n, '1x1', 'ukM--avxl', true) +
          '<div><h2 class="ukProf_n">' + esc(me.n) +
            (me.verified ? '<span class="ukChip ukChip--v">' + window.ukVetBadge('ukChipVet') + 'Verified</span>' : '') + '</h2>' +
            '<p class="ukProf_m">' + esc(me.h) + ' · ' + esc(me.city) + '</p>' +
            '<p class="ukProf_m">' + esc(me.niche) + '</p></div></div>' +
        '<div class="ukProf_act">' +
          '<button class="ukBtn" type="button" data-goto="kit">Make my media kit</button>' +
          (me.member ? '' : '<button class="ukGhost" type="button" data-goto="member">Get verified</button>') +
        '</div>' +
      '</section>' +

      '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">Your work</h3>' +
        '<button class="ukGhost" type="button" data-ack="Coming up">Add a piece</button></div>' +
        '<p class="ukAsk">Lead with the pieces you are proudest of. Hotels scroll this first and decide fast.</p>' +
        '<div class="ukReels">' + me.work.map(function (w, i) {
          return '<figure class="ukReel">' + m(w.m, w.t, '', i < 3) +
            '<figcaption><span class="ukReel_t">' + esc(w.t) + '</span>' +
            '<span class="ukReel_s">' + D.fmt(w.plays) + ' plays · ' + D.fmt(w.saves) + ' saves</span></figcaption>' +
          '</figure>'; }).join('') + '</div></section>' +

      '<div class="ukGrid">' +
        '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">Where you post</h3></div>' +
          '<ul class="ukPlats">' + me.plats.map(function (p) {
            return '<li><span class="ukPlats_n">' + p.n + '</span><span class="ukPlats_f">' + D.fmt(p.f) + '</span></li>';
          }).join('') + '</ul>' +
          '<p class="ukWhy">Plenty of creators land stays at this size. Hotels want content for their own feeds, ' +
          'and a smaller audience that actually watches is worth more than a big one that scrolls past.</p>' +
        '</section>' +
        '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">What you offer</h3></div>' +
          '<p class="ukAsk">Set once, reused in every pitch. Change it any time.</p>' +
          [['Signature','2 nights','1 video + 3 photos'],['Full story','3 nights','2 videos + 8 photos']].map(function (p) {
            return '<div class="ukCPack"><p class="ukCPack_n">' + p[0] + '</p>' +
              '<p class="ukCPack_d">' + p[1] + ' · ' + p[2] + '</p>' +
              '<p class="ukCPack_r">They keep and post the content</p></div>'; }).join('') +
          '<p class="ukWhy">No prices here on purpose. A hosted stay is a trade, not an invoice.</p>' +
        '</section>' +
      '</div>';
  }

  /* ============================ 11 — media kit ============================ */
  function kit() {
    var me = D.me;
    var total = me.plats.reduce(function (a, p) { return a + p.f; }, 0);
    return head('Your media kit', 'One page you can send to any hotel or brand, on or off Ukreate.',
      '<button class="ukBtn" type="button" data-ack="Link copied">Copy the link</button>') +
      '<div class="ukToolbar"><span class="ukCount">Updates itself as your work does</span>' +
        '<button class="ukGhost" type="button" data-ack="Link copied">Copy share link</button>' +
        '<button class="ukBtn" type="button" data-ack="Preparing your PDF">Download as PDF</button></div>' +
      '<article class="ukKit">' +
        '<header class="ukKit_top">' + pic(me.img, me.n, '1x1', 'ukM--avxl', true) +
          '<div><h3 class="ukKit_n">' + esc(me.n) + '</h3>' +
            '<p class="ukKit_m">' + esc(me.h) + ' · ' + esc(me.city) + '</p>' +
            '<p class="ukKit_b">' + esc(me.bio) + '</p></div>' +
          '<div class="ukKit_stats">' +
            '<div><dt>Audience</dt><dd>' + D.fmt(total) + '</dd></div>' +
            '<div><dt>Avg plays</dt><dd>' + D.fmt(Math.round(me.work.reduce(function (a, w) { return a + w.plays; }, 0) / me.work.length)) + '</dd></div>' +
            '<div><dt>Stays</dt><dd>' + D.earnings.stays + '</dd></div>' +
          '</div>' +
        '</header>' +
        /* One tile shape across the strip. Each asset carries its own ratio, so
           the kit was rendering three portrait frames next to two landscape ones
           and the caption baselines never lined up — on the page a creator sends
           to a hotel, of all places. */
        '<div class="ukKit_work">' + me.work.slice(0, 6).map(function (w, i) {
          return '<figure class="ukReel ukReel--kit">' + m(w.m, w.t, '', i < 3) +
            '<figcaption><span class="ukReel_s">' + D.fmt(w.plays) + ' plays</span></figcaption></figure>';
        }).join('') + '</div>' +
        '<footer class="ukKit_foot"><p><strong>Worked with</strong> ' +
          /* stages are 0-4 and Complete IS 4, so === 5 matched nothing and the
             one line on the kit that proves a creator has done this before was
             always empty. Same off-by-one the hotel dashboard had. */
          D.collabs.filter(function (c) { return c.stage >= 4; }).map(function (c) {
            return esc(D.stay(c.stay).hotel); }).join(', ') + '</p>' +
          '<p class="ukKit_by">Made with Ukreate</p></footer>' +
      '</article>' +
      '<p class="ukWhy">A media kit is just your work, your numbers and who you have worked with, on one page. ' +
      'Brands ask for it constantly, so yours is always ready.</p>';
  }

  /* ============================ 9 — academy ============================ */
  function academy(st) {
    if (st.lesson) return lesson(st);
    var done = D.academy.filter(function (l) { return l.done; }).length;
    var pct = Math.round(done / D.academy.length * 100);
    var mods = D.academy.map(function (l) { return l.mod; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
    return head('Academy', 'Short videos on how this actually works. Watch one before your next pitch.') +
      '<section class="ukPanel ukProgWrap"><div class="ukPanel_head">' +
        '<h3 class="ukPanel_title">Your progress</h3>' +
        '<span class="ukCount">' + done + ' of ' + D.academy.length + ' done</span></div>' +
        '<div class="ukProg"><span style="width:' + pct + '%"></span></div>' +
        (done ? '<p class="ukWhy">Nice. Keep going — the pitching module is the one that changes your reply rate.</p>' : '') +
      '</section>' +
      mods.map(function (mod) {
        return '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">' + esc(mod) + '</h3></div>' +
          '<div class="ukLessons">' + D.academy.filter(function (l) { return l.mod === mod; }).map(function (l, i) {
            return '<article class="ukLesson' + (l.done ? ' is-done' : '') + '" tabindex="0" role="button" ' +
              'data-lesson="' + l.id + '" aria-label="Play ' + esc(l.t) + '">' + m(l.m, l.t, '', i < 2) +
              '<div class="ukLesson_b"><p class="ukLesson_t">' + esc(l.t) + '</p>' +
              '<p class="ukLesson_d">' + esc(l.d) + '</p>' +
              '<p class="ukLesson_m">' + l.len + (l.done ? ' · watched' : '') + '</p></div></article>';
          }).join('') + '</div></section>';
      }).join('');
  }

  function lesson(st) {
    var l = D.academy.filter(function (x) { return x.id === st.lesson; })[0];
    var all = D.academy;
    var i = all.indexOf(l);
    var next = all[i + 1];
    return '<button class="ukBack" type="button" data-back>&larr; All lessons</button>' +
      '<div class="ukGrid ukGrid--lesson">' +
        '<div>' +
          '<div class="ukPlayer">' + m(l.m, l.t, 'ukM--player', true) +
            '<button class="ukPlayer_go" type="button" data-ack="Playing" aria-label="Play ' + esc(l.t) + '">' +
            '<span aria-hidden="true">&#9654;</span></button>' +
            '<span class="ukPlayer_len">' + l.len + '</span></div>' +
          '<h2 class="ukCHead_n" style="margin-top:18px">' + esc(l.t) + '</h2>' +
          '<p class="ukCHead_m">' + esc(l.mod) + ' · ' + l.len + '</p>' +
          '<section class="ukPanel" style="margin-top:16px">' +
            '<div class="ukPanel_head"><h3 class="ukPanel_title">The short version</h3></div>' +
            '<p class="ukLessonNotes">' + esc(l.notes || l.d) + '</p>' +
            '<p class="ukHint">Notes are here so you can skim it now and watch properly later.</p>' +
          '</section>' +
        '</div>' +
        '<aside class="ukPanel ukSticky">' +
          '<button class="ukBtn ukCard_cta" type="button" data-watched="' + l.id + '"' +
            (l.done ? ' disabled' : '') + '>' + (l.done ? 'Watched' : 'Mark as watched') + '</button>' +
          (next ? '<div class="ukRule"></div><p class="ukField_l">Up next</p>' +
            '<article class="ukLesson" data-lesson="' + next.id + '" tabindex="0" role="button">' +
            m(next.m, next.t) + '<div class="ukLesson_b"><p class="ukLesson_t">' + esc(next.t) + '</p>' +
            '<p class="ukLesson_m">' + next.len + '</p></div></article>'
            : '<p class="ukWhy">That is the last one in the Academy. Go and pitch something.</p>') +
        '</aside></div>';
  }

  /* ============================ 10 — community ============================ */
  function community() {
    return head('The creator community', 'The part of Ukreate that lives somewhere else, on purpose.') +
      '<section class="ukDoor">' +
        '<div class="ukDoor_b">' +
          '<p class="ukHero_eyebrow">Opens in a new tab</p>' +
          '<h3 class="ukDoor_t">Where the other creators are</h3>' +
          '<p class="ukDoor_p">Ask what a hotel is like before you pitch it. Share a stay that went well. ' +
          'Find someone shooting the same city next month. The community runs on its own platform so it can ' +
          'do that job properly, and your Ukreate account gets you in.</p>' +
          '<div class="ukHero_cta"><button class="ukBtn" type="button" data-goto="community">Open the community</button></div>' +
          '<p class="ukHint">You will not lose your place here.</p>' +
        '</div>' +
        '<div class="ukDoor_m">' + ['reel2','shot3','reel5','shot1'].map(function (k, i) {
          return m(k, '', '', i < 2); }).join('') + '</div>' +
      '</section>';
  }

  /* ============================ 8 — membership ============================ */
  function member() {
    var p = D.MEMBER_PRICE;
    if (D.me.member) {
      return head('Membership', 'You are verified. Here is what that is doing for you.') +
        '<section class="ukCheerBig"><div><p class="ukHero_eyebrow">Verified creator</p>' +
        '<h3 class="ukCheerBig_t">Hotels can see you properly now</h3>' +
        '<p class="ukCheerBig_p">Your badge is live, you are in the recommendations hotels see, and Pitch Pilot ' +
        'is fully unlocked. Renews at ' + D.money(p.month) + ' a month.</p>' +
        '<div class="ukHero_cta"><button class="ukBtn" type="button" data-goto="pitch">Open Pitch Pilot</button>' +
        '<button class="ukGhost" type="button" data-ack="Opened">Manage billing</button></div></div>' +
        '<div class="ukCheerBig_m">' + ['reel1','reel3','shot2'].map(function (k) { return m(k, ''); }).join('') + '</div>' +
        '</section>';
    }
    return head('Get verified', 'A dollar a day. It pays for itself the first time you land a stay.') +
      '<div class="ukGrid ukGrid--stay">' +
        '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">What changes</h3></div>' +
          '<ul class="ukTicks">' +
            '<li>Apply to any hosted stay on the board, not just browse them</li>' +
            '<li>Pitch Pilot writes your pitches and gives you the contact</li>' +
            '<li>A verified badge on your profile, which hotels filter for</li>' +
            '<li>You show up in the creators Ukreate recommends to hotels</li>' +
            '<li>The full Academy</li>' +
            '<li>Commission on direct bookings, when that switches on</li>' +
          '</ul>' +
          '<p class="ukWhy">One landed stay is usually worth a few hundred in rooms. This is a dollar a day.</p>' +
        '</section>' +
        '<aside class="ukPanel ukSticky ukJoin">' +
          '<p class="ukJoin_p">' + D.money(p.day) + '<em>a day</em></p>' +
          '<p class="ukJoin_s">Billed ' + D.money(p.month) + ' monthly, or ' + D.money(p.year) + ' for the year.</p>' +
          '<button class="ukBtn ukCard_cta" type="button" data-join>Get verified</button>' +
          '<p class="ukHint">Cancel any time. Your work and your collabs stay yours either way.</p>' +
        '</aside></div>';
  }

  /* ============================ 0b — account ============================ */
  var ATABS = [ {id:'contact',t:'Contact details'}, {id:'password',t:'Password'},
                {id:'payout',t:'Payout details'}, {id:'plan',t:'Subscription'} ];

  function account(st) {
    var tab = st.tab && ATABS.some(function (t) { return t.id === st.tab; }) ? st.tab : 'contact';
    return head('Account', 'The boring but important bits.') +
      '<div class="ukGrid ukGrid--set">' +
        '<nav class="ukPanel ukSetNav" aria-label="Account sections">' + ATABS.map(function (t) {
          return '<button class="ukSetNav_i' + (t.id === tab ? ' is-on' : '') + '" type="button" data-tab="' + t.id + '"' +
            (t.id === tab ? ' aria-current="true"' : '') + '>' + t.t + '</button>'; }).join('') + '</nav>' +
        '<div>' + (
          tab === 'contact'  ? aContact() :
          tab === 'password' ? aPassword() :
          tab === 'payout'   ? aPayout() : aPlan()
        ) + '</div></div>';
  }
  function field(l, v, hint, type) {
    return '<label class="ukField"><span class="ukField_l">' + l + '</span>' +
      '<input class="ukField_i" type="' + (type || 'text') + '" value="' + esc(v) + '">' +
      (hint ? '<span class="ukHint">' + hint + '</span>' : '') + '</label>';
  }
  function aContact() {
    return '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">Contact details</h3></div>' +
      field('Your name', D.me.n) + field('Email', 'amara@amaratravels.com', 'Hotels reply to this address.', 'email') +
      field('Phone', '+351 912 555 018', 'Only shown once a stay is confirmed.', 'tel') +
      field('Where you are based', D.me.city) +
      '<button class="ukBtn" type="button" data-ack="Saved">Save changes</button></section>';
  }
  function aPassword() {
    return '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">Password</h3></div>' +
      field('Current password', '', '', 'password') + field('New password', '', 'At least 8 characters.', 'password') +
      '<button class="ukBtn" type="button" data-ack="Updated">Update password</button>' +
      '<div class="ukRule"></div>' +
      '<h4 class="ukSub">Sign out</h4><p class="ukHint" style="margin-bottom:14px">Signs you out on this device only.</p>' +
      '<button class="ukGhost" type="button" data-signout>Sign out</button></section>';
  }
  function aPayout() {
    return '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">Payout details</h3></div>' +
      '<p class="ukAsk">Hosted stays do not pay cash, so you do not need this yet. It is here for when commission on ' +
      'direct bookings switches on, and for any paid collab you agree directly with a hotel.</p>' +
      field('Account name', 'Amara Mensah') + field('IBAN', 'PT50 0002 0123 1234 5678 9015 4') +
      field('Country', 'Portugal') +
      '<button class="ukBtn" type="button" data-ack="Saved">Save payout details</button></section>';
  }
  function aPlan() {
    var p = D.MEMBER_PRICE;
    return '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">Subscription</h3></div>' +
      (D.me.member
        ? '<div class="ukPlan"><div><p class="ukPlan_n">Verified creator</p>' +
          '<p class="ukPlan_p">Full Pitch Pilot, apply to any stay, verified badge, the whole Academy.</p></div>' +
          '<p class="ukPlan_v">' + D.money(p.month) + '<em>a month</em></p></div>' +
          '<p class="ukWhy">Renews on the 12th. Cancel any time and you keep your work, your collabs and your media kit.</p>' +
          '<button class="ukGhost" type="button" data-ack="Opened">Manage billing</button>'
        : '<div class="ukPlan"><div><p class="ukPlan_n">Free</p>' +
          '<p class="ukPlan_p">Browse stays, see scores, build your profile and your media kit.</p></div>' +
          '<p class="ukPlan_v">' + D.money(0) + '</p></div>' +
          '<p class="ukWhy">Verified is a dollar a day and unlocks applying and Pitch Pilot.</p>' +
          '<button class="ukBtn" type="button" data-goto="member">See what verified gets you</button>') +
      '</section>';
  }

  return {
    /* earn is not here: ukcdash.js owns that view and assigns V.earn itself */
    home:home, collabs:collabs, stays:stays, apply:apply, profile:profile,
    kit:kit, academy:academy, community:community, member:member, account:account,
    empty:empty, media:m, pic:pic, head:head, track:track, paginate:paginate,
    /* the shared stay card as this side dresses it, so the dashboard, Pitch Pilot
       and the mood boards all show the one card rather than three near-misses */
    stayCard:stayCard
  };
})();
