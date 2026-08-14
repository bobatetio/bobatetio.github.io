/* Ukreate — creator screens.
   Voice: mentor and hype-person. Media first, vertical by default.
   Every media slot declares its ratio via .ukM--9x16 / --4x5 / --1x1 / --16x9. */
window.UKCV = (function () {
  var D = window.UKC;

  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) {
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; }); };

  /* The flag for a "City, Country" string — the hotel side's own mechanism,
     moved into ukshared.js so both apps flag the same country list rather
     than this side never having had one at all. */
  function flagFor(loc) { return window.ukFlagFor(loc); }

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

  /* The one icon pack, the same one the ask bar and calculator already draw
     from — never a hand-drawn glyph invented for a single page. */
  function icon(name) {
    var g = (window.UKICONS || {})[name];
    return g ? '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' + g + '</svg>' : '';
  }
  /* The pack's solid set is small — home, chat, plus, bag, idcard, star,
     search, nothing else — so a name with no filled version falls back to
     its outline rather than a glyph invented to fill the gap. */
  function iconSolid(name) {
    var g = (window.UKICONS_SOLID || {})[name];
    return g ? '<svg viewBox="0 0 24 24" aria-hidden="true">' + g + '</svg>' : icon(name);
  }

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
              '<span class="ukList_meta">' + flagFor(s.city) + esc(s.city) + '</span></span>' +
              '<span class="ukTag ukTag--you">' + esc(stageSay(stg)) + '</span></li>';
          }).join('') + '</ul>'
            : empty('Nothing waiting on you', 'Everything is with the hotels right now. Good time to send a couple more pitches.')) +
        '</section>' +

        '<section class="ukPanel ukCNext"><div class="ukPanel_head">' +
          '<h3 class="ukPanel_title">Pitch this one next</h3></div>' +
          pic(next.img, next.hotel, '16x9', '', true) +
          '<h4 class="ukCNext_n">' + esc(next.hotel) + '</h4>' +
          '<p class="ukCNext_m">' + flagFor(next.city) + esc(next.city) + ' · scored ' + D.scoreFor(next) + '/10 for you</p>' +
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
            '<p class="ukInvIn_t">' + esc(stay.hotel) + ' \u00b7 ' + flagFor(stay.city) + esc(stay.city) + '</p>' +
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
            '<p class="ukInvIn_t">' + esc(stay.hotel) + ' \u00b7 ' + flagFor(stay.city) + esc(stay.city) + '</p>' +
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

  /* The stay picker and the two-view switch, same pairing the hotel side uses
     so a creator who has used both apps recognises the control rather than
     relearning it. "All stays" carries the creator's own photo, the same way
     the hotel's version carries the property's — there being no single
     property to stand in for "all" on this side. */
  var CHEV_ICON = '<svg class="ukStayFilter_car" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  function stayFilter(stayF, stays) {
    var sel = stayF === 'all' ? null : stays.filter(function (s) { return s.id === stayF; })[0];
    var allImg = D.me.img;
    return '<div class="ukStayFilter"><button class="ukStayFilter_btn" data-stayf-toggle aria-haspopup="menu" aria-expanded="false" aria-label="Filter by stay">' +
      '<img class="ukStayFilter_img" src="' + esc(sel ? sel.img : allImg) + '" alt="">' +
      '<span class="ukStayFilter_val">' + (sel ? esc(sel.hotel) : 'All stays') + '</span>' + CHEV_ICON + '</button>' +
      '<div class="ukStayMenu" hidden role="menu">' +
        '<button class="ukStayMenu_i' + (stayF === 'all' ? ' is-sel' : '') + '" data-stayf="all" role="menuitem">' +
          '<img src="' + esc(allImg) + '" alt="" class="ukStayMenu_i_img">' +
          '<span class="ukStayMenu_i_txt">All stays</span></button>' +
        stays.map(function (s) {
          return '<button class="ukStayMenu_i' + (s.id === stayF ? ' is-sel' : '') + '" data-stayf="' + s.id + '" role="menuitem">' +
            '<img src="' + esc(s.img) + '" alt="" class="ukStayMenu_i_img">' +
            '<span class="ukStayMenu_i_txt">' + esc(s.hotel) + '</span></button>';
        }).join('') +
      '</div></div>';
  }
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
  function viewSwitch(cview) {
    return '<div class="ukSeg ukSeg--ic" role="group" aria-label="How your collabs are laid out">' +
      [['cards','Cards'],['board','Board']].map(function (v) {
        var on = cview === v[0];
        return '<button class="ukSeg_b' + (on ? ' is-on' : '') + '" type="button" data-cview="' + v[0] + '" ' +
          'aria-pressed="' + (on ? 'true' : 'false') + '">' + VIEW_ICON[v[0]] + '<span>' + v[1] + '</span></button>';
      }).join('') + '</div>';
  }
  var FLAG_ICON = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 21V4.5m0 0h11.2c.7 0 1 .8.6 1.3L15 9.4l2.8 3.6c.4.5.1 1.3-.6 1.3H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function stageTone(i) {
    if (i === 4) return 'done';
    return D.STAGES[i].mine ? 'you' : 'wait';
  }
  function kanCard(c) {
    var stay = D.stay(c.stay);
    var brief = D.packageBrief ? D.packageBrief(c) : (c.brief || {});
    var dels = (stay.del || []).map(function (d) { return d.q + ' × ' + d.t; });
    var shown = dels.slice(0, 3), extra = dels.length - shown.length;
    var when = brief.deadline ? fmtDate(brief.deadline) : '';
    var file = c.delivered && c.delivered.length ? c.delivered.length + (c.delivered.length === 1 ? ' file' : ' files') : '';

    return '<article class="ukKanCard" data-thread="' + c.id + '" tabindex="0" role="button" ' +
      'aria-label="Open your collab with ' + esc(stay.hotel) + '">' +
      '<h4 class="ukKanCard_t">' + esc(stay.hotel) + '</h4>' +
      '<div class="ukKanCard_chips">' + shown.map(function (d) {
        return '<span class="ukChip">' + esc(d) + '</span>'; }).join('') +
        (extra > 0 ? '<span class="ukChip">+' + extra + '</span>' : '') + '</div>' +
      '<div class="ukKanCard_rule"></div>' +
      '<p class="ukKanCard_row"><img class="ukKanCard_av" src="' + esc(stay.img) + '" alt="" loading="lazy" decoding="async">' +
        '<span class="ukKanCard_who">' + flagFor(stay.city) + esc(stay.city) + '</span></p>' +
      (when ? '<p class="ukKanCard_row"><span class="ukKanCard_ic">' + FLAG_ICON + '</span>' +
        '<span class="ukKanCard_when">' + esc(when) + '</span></p>' : '') +
      (file ? '<span class="ukKanCard_file">' + CLIP_ICON + '<span>' + esc(file) + '</span></span>' : '') +
      cardActions(c) +
    '</article>';
  }

  /* The hotel's card-level actions, not a second pattern: a compact one-line
     row that only appears on the two stages that are genuinely the creator's
     move to make from the board, same as the hotel's stage 0/3 pair. Every
     other stage already says whose move it is via the column's own tag, so a
     verbose "Your move / With your host" line on every card was saying it a
     second time, and doing it in two lines instead of one. */
  function cardActions(c) {
    if (!D.collabMine(c)) return '';
    var b = '';
    if (c.stage === 2) {
      b = !c.creatingStarted
        ? '<button class="ukCardAct_b is-go" type="button" data-startshoot="' + c.id + '">Start shooting</button>'
        : '<button class="ukCardAct_b is-go" type="button" data-startdeliver="' + c.id + '">Hand over</button>';
      b += '<button class="ukCardAct_b" type="button" data-thread="' + c.id + '">Open</button>';
    } else if (c.stage === 3) {
      b = c.contentStatus === 'approved'
        ? '<button class="ukCardAct_b is-go" type="button" data-publish="' + c.id + '">Mark published</button>'
        : '<button class="ukCardAct_b is-go" type="button" data-startdeliver="' + c.id + '">Resend</button>';
      b += '<button class="ukCardAct_b" type="button" data-thread="' + c.id + '">Open</button>';
    }
    return b ? '<div class="ukCardAct" data-cardact>' + b + '</div>' : '';
  }
  function board(st, stayF, myStays, scoped) {
    var note = stayF === 'all'
      ? 'The whole lifecycle at once. Every collab sits in the stage it has reached.'
      : 'One stay, followed across every stage of the lifecycle.';
    return head('Your collabs', note, stayFilter(stayF, myStays) + viewSwitch('board')) +
      '<div class="ukKan ukKan--4" role="list">' + D.STAGES.map(function (stage, i) {
        if (i === 0) return '';        /* Inquiry lives in Pitch Pilot */
        var col = scoped.filter(function (c) { return c.stage === i; });
        return '<section class="ukKan_col" role="listitem" aria-label="' + esc(stage.short) + ', ' + col.length + '">' +
          '<div class="ukKan_head">' +
            '<span class="ukTag ukTag--' + stageTone(i) + '">' + esc(stage.short) + '</span>' +
            '<span class="ukKan_ct">' + col.length + '</span>' +
          '</div>' +
          '<div class="ukKan_body">' +
            (col.length ? col.map(kanCard).join('')
              : '<p class="ukKan_none">Nothing at this stage.</p>') +
          '</div></section>';
      }).join('') + '</div>';
  }

  function collabs(st) {
    if (D.hydrateLinked) D.hydrateLinked();
    if (st.thread) return thread(st);
    /* Inquiry is a real stage here now, same as the hotel side — it used to
       live entirely on Stays instead, under Waiting/Replied, which meant
       checking on something you had already sent meant leaving Your collabs
       to a different page, then coming back once a hotel said yes. Inquiry
       holds two different things a hotel can be doing with a pitch — sitting
       on it, or having come back with something — so it gets a sub-tab each,
       the same shape the hotel side uses for its own Inquiry stage. */
    var P = window.UKCP;
    var cview = st.cview === 'board' ? 'board' : 'cards';
    var stayF = st.stayF || 'all';
    var real = D.collabs.filter(function (c) { return c.stage >= 1; });
    var myStays = [];
    real.forEach(function (c) {
      var stay = D.stay(c.stay);
      if (stay && !myStays.some(function (s) { return s.id === stay.id; })) myStays.push(stay);
    });
    var scoped = real.filter(function (c) { return stayF === 'all' || c.stay === stayF; });
    if (cview === 'board') return board(st, stayF, myStays, scoped);

    var f = stayF === 'all' ? (st.stageF == null ? '1' : String(st.stageF)) : (st.stageF == null ? null : String(st.stageF));
    var pCounts = P ? P.counts() : {};
    var list = scoped.filter(function (c) {
      if (f === 'late') return D.isOverdue && D.isOverdue(c);
      return f == null || String(c.stage) === f;
    });
    var tabs = '<div class="ukToolbar"><div class="ukFilters ukFilters--tabs" role="tablist" aria-label="Filter your collaborations by lifecycle stage">' +
        D.STAGES.map(function (stage, i) {
          var n = i === 0 ? (pCounts.waiting || 0) + (pCounts.replied || 0)
                           : scoped.filter(function (c) { return c.stage === i; }).length;
          return '<button class="ukFilter' + (f === String(i) ? ' is-on' : '') + '" type="button" role="tab" aria-selected="' + (f === String(i)) + '" data-stage="' + i + '">' +
            '<span class="ukFilter_lb">' + stage.short + '</span>' + (n ? '<span class="ukFilter_ct">' + n + '</span>' : '') + '</button>';
        }).join('') +
        /* Not a seventh stage, same flag the hotel side carries — a way of
           slicing Creating, not a place after Complete. Told straight: it is
           the creator's own work that is running behind. */
        (function () {
          var lateN = scoped.filter(function (c) { return D.isOverdue && D.isOverdue(c); }).length;
          if (!lateN && f !== 'late') return '';
          return '<button class="ukFilter ukFilter--late' + (f === 'late' ? ' is-on' : '') + '" ' +
            'type="button" role="tab" aria-selected="' + (f === 'late') + '" data-stage="late">' +
            '<span class="ukFilter_lb">Overdue</span>' +
            (lateN ? '<span class="ukFilter_ct">' + lateN + '</span>' : '') + '</button>';
        })() +
      '</div></div>';

    if (f === '0') {
      var sub = st.inqSub === 'replied' ? 'replied' : 'waiting';
      return head('Your collabs', 'Every stay a hotel has said yes to, from package through sign-off.',
          stayFilter(stayF, myStays) + viewSwitch(cview)) +
        invitations(st) +
        (st.sent ? '<p class="ukCheer" role="status">Pitch sent. Nice one. Hotels usually reply within a few days, and no reply for a week is normal rather than a no.</p>' : '') +
        tabs +
        (P ? P.dueStrip() : '') +
        '<div class="ukSubTabs" role="tablist" aria-label="Kind of inquiry">' +
          '<button class="ukSubTab' + (sub === 'waiting' ? ' is-on' : '') + '" type="button" role="tab" ' +
            'aria-selected="' + (sub === 'waiting') + '" data-inqsub="waiting">Waiting' +
            (pCounts.waiting ? ' <span class="ukSubTab_ct">' + pCounts.waiting + '</span>' : '') + '</button>' +
          '<button class="ukSubTab' + (sub === 'replied' ? ' is-on' : '') + '" type="button" role="tab" ' +
            'aria-selected="' + (sub === 'replied') + '" data-inqsub="replied">Replied' +
            (pCounts.replied ? ' <span class="ukSubTab_ct">' + pCounts.replied + '</span>' : '') + '</button>' +
        '</div>' +
        (P ? P.laneList(sub, st) : '');
    }

    return head('Your collabs',
      'Every stay a hotel has said yes to, from package through sign-off.',
      stayFilter(stayF, myStays) + viewSwitch(cview)) +
      invitations(st) +
      (st.sent ? '<p class="ukCheer" role="status">Pitch sent. Nice one. Hotels usually reply within a few days, and no reply for a week is normal rather than a no.</p>' : '') +
      tabs +
      (stayF !== 'all' && f == null ? '<p class="ukStageNote" role="status">Showing every collab tied to ' + esc(D.stay(stayF).hotel) + '.</p>' : '') +
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
            /* The hotel side's own composition, matched exactly: the tracker,
               then EITHER the card's action buttons OR one plain status line
               — never a boxed badge stacked on top of both — then the
               preview, then the buttons for real. A card that can act does
               not also need a badge repeating that it can. */
            foot: track(c.stage, true) +
              (cardActions(c) ? '' :
                '<p class="ukNext"><span class="ukNext_lb">' +
                  esc(c.stage === 4 ? 'Done' : mine ? 'Your move' : 'With your host') + '</span>' +
                  '<span class="ukNext_say">' + esc(D.collabSay(c)) + '</span></p>') +
              cardPreview(c, stay) + cardActions(c)
          }) + '</div>';
      }).join('') + '</div>'
        : empty('Nothing at that stage', 'Try another stage.'));
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
    /* Plain stills, same as the hotel's own card preview — no play mark, no
       forced square crop. A grid card is a status glance, not a player. */
    if (c.stage === 4) return c.delivered && c.delivered.length ? '<div class="ukPreview ukPreview--thumbs">' + c.delivered.slice(0, 4).map(function (id) { var w = D.work(id); var a = D.media(w.m); return a ? '<img class="ukThumb" src="' + esc(a.src) + '" alt="' + esc(w.t) + '" loading="lazy" decoding="async">' : ''; }).join('') + '</div>' : emptyPreview('Wrapped and archived.');
    if (c.stage === 3) return c.delivered && c.delivered.length ? '<div class="ukPreview ukPreview--thumbs">' + c.delivered.slice(0, 4).map(function (id) { var w = D.work(id); var a = D.media(w.m); return a ? '<img class="ukThumb" src="' + esc(a.src) + '" alt="' + esc(w.t) + '" loading="lazy" decoding="async">' : ''; }).join('') + '</div>' : emptyPreview('Your host is reviewing the handover.');
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
  var CHECK_ICON = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.6 6.35 4.85 8.6 9.4 3.75" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var REFRESH_ICON = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 11A8 8 0 0 0 6.3 6.3L4 8.6M4 13a8 8 0 0 0 13.7 4.7L20 15.4M4 4v4.6h4.6M19.4 15.4H14.8V20" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';

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

  /* The hotel side's own shape: one card, headed "Conversation," and whatever
     the current stage needs from you — reply, mark as shooting, hand over
     work, publish, submit proof — lives inside that same card, not scattered
     across separate boxed panels below it. `.ukFlowThread .ukComposer` (in
     ukapp.css) is what actually flattens the nested composer content so it
     reads as a continuation of the thread rather than a card inside a card. */
  /* The corner-arrows are hand-drawn the same way the map's own zoom/home
     buttons are (ukworldmap.js) — a plain geometric glyph for a control this
     icon pack has no symbol for, not a brand mark standing in for one that
     exists. */
  var FOCUS_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4H5a1 1 0 0 0-1 1v4M15 4h4a1 1 0 0 1 1 1v4M9 20H5a1 1 0 0 1-1-1v-4M15 20h4a1 1 0 0 0 1-1v-4"/></svg>';
  var UNFOCUS_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h4a1 1 0 0 0 1-1V4M20 9h-4a1 1 0 0 1-1-1V4M4 15h4a1 1 0 0 1 1 1v4M20 15h-4a1 1 0 0 0-1 1v4"/></svg>';

  function threadPanel(c, stay, st) {
    return '<section class="ukPanel ukFlowThread' + (st.focus ? ' is-focus' : '') + '" id="ukMsgPanel"><div class="ukPanel_head">' +
      '<div class="ukPanel_headTxt"><h3 class="ukPanel_title">Conversation</h3><span class="ukCount">' + c.msgs.length + (c.msgs.length === 1 ? ' message' : ' messages') + '</span></div>' +
      '<button class="ukFocusToggle' + (st.focus ? ' is-on' : '') + '" type="button" data-focus-toggle aria-pressed="' + !!st.focus + '">' +
        (st.focus ? UNFOCUS_ICON : FOCUS_ICON) + '<span>' + (st.focus ? 'Exit focus' : 'Focus on this') + '</span></button>' +
    '</div>' +
      (c.msgs.length ? '<div class="ukMsgs" id="ukMsgs">' + c.msgs.map(function (msg) { return threadEntry(msg, c, stay); }).join('') + '</div>' : '<div class="ukMsgs ukMsgs--empty" id="ukMsgs"><p class="ukEmpty_t">No messages yet</p><p class="ukEmpty_p">Keep it warm and simple. One clear note beats a long one.</p></div>') +
      composer(c, stay, st) +
      '</section>';
  }

  /* Dates, nights, room and inclusions used to be repeated here — that is the
     stay card's own job now, sitting alone in the sidebar, so this deck only
     carries what the card doesn't: the final brief and the guest guide. */
  function referenceDeck(c, stay) {
    var brief = D.packageBrief ? D.packageBrief(c) : (c.brief || {});
    var guide = D.guideSnapshot ? D.guideSnapshot(c) : c.guide;
    return '<div class="ukReference"><div class="ukReference_grid">' +
      '<div class="ukReference_block ukReference_block--brief"><p class="ukReference_k">Final brief</p><p class="ukReference_v ukReference_v--sm">' + esc(brief.title || stay.hotel) + '</p><ul class="ukReference_list">' +
        (brief.deliverables ? '<li><strong>Deliverables</strong><span>' + esc(brief.deliverables) + '</span></li>' : '') +
        (brief.deadline ? '<li><strong>Deadline</strong><span>' + esc(fmtDate(brief.deadline)) + '</span></li>' : '') +
        (brief.link ? '<li><strong>Link</strong><span>' + esc(brief.link) + '</span></li>' : '') +
        (brief.file ? '<li><strong>File</strong><span>' + esc(brief.file) + '</span></li>' : '') +
      '</ul>' + (brief.notes ? '<p class="ukReference_s ukReference_s--body">' + esc(brief.notes) + '</p>' : '') + '</div>' +
      '<div class="ukReference_block"><p class="ukReference_k">Guest guide</p>' +
        (guide ? '<details class="ukReference_guide"><summary>Open the guide</summary><div class="ukReference_sections">' + (guide.sections || []).map(function (sec) { return '<div class="ukReference_sec"><p class="ukReference_secT">' + esc(sec.t) + '</p><p class="ukReference_secP">' + esc(sec.tx) + '</p></div>'; }).join('') + '</div></details>' : '<p class="ukReference_s">No guest guide came through on this one.</p>') +
      '</div></div></div>';
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
  /* The stage's own action — mark as shooting, hand over work — sits right in
     the conversation card, same as the composer above it, rather than as a
     separate boxed panel underneath. */
  function composerCreating(c, stay) {
    var base = !c.creatingStarted
      ? '<section class="ukPanel ukComposer"><div class="ukPanel_head"><h3 class="ukPanel_title">Ready to start?</h3></div><p class="ukAsk">When you begin filming, mark it here. It is a real signal your host sees on their side.</p><div class="ukComposer_row"><div class="ukComposer_actions"><button class="ukBtn" type="button" data-startshoot="' + c.id + '">Mark as shooting</button></div><div class="ukComposer_send"></div></div></section>'
      : composerPlain(c, stay, { note:'You have marked this as shooting. When the work is ready, hand it over from the panel below.', placeholder:'Share a quick update with your host' });
    return base + deliveryConnection(c, stay);
  }
  function composerContent(c, stay) {
    var note = c.contentStatus === 'changesRequested'
      ? 'Your host would love a small tweak. Reply here if you want to clarify anything, then send a revised handover below.'
      : c.contentStatus === 'approved'
      ? 'Approved — it is theirs now, on every channel. Publish it whenever you are ready, then tell us it is live below.'
      : 'Your handover is with the Ukreate team for a quick check. It moves to ' + esc(stay.hotel) + ' as soon as that is done.';
    return composerPlain(c, stay, { note:note, placeholder:'Write a message' }) + deliveryConnection(c, stay);
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
      return '<section class="ukPanel ukComposer ukDeliverLink"><div class="ukPanel_head"><h3 class="ukPanel_title">Hand over your work</h3><span class="ukCount">Creator action</span></div><p class="ukAsk">Your host already has the brief and the guide. When you are ready, send the work through the same delivery flow you already use.</p><button class="ukBtn" type="button" data-startdeliver="' + c.id + '">Start the handover</button></section>';
    }
    if (c.stage === 3 && c.contentStatus === 'changesRequested') {
      return deliveredPanel(c) + '<section class="ukPanel ukComposer ukDeliverLink"><div class="ukPanel_head"><h3 class="ukPanel_title">Send the revised handover</h3><span class="ukCount">Creator action</span></div><p class="ukAsk">You can resend the package once the small tweak is ready.</p><button class="ukBtn" type="button" data-startdeliver="' + c.id + '">Send a revised handover</button></section>';
    }
    /* approved but not yet public -- the only thing left to do is post it */
    if (c.contentStatus === 'approved') return deliveredPanel(c) + publishPanel(c);
    /* published -- proof of posting (and what it has earned) can only be shown
       from here on, since before this there was nothing live to link to */
    if (c.contentStatus === 'published') return deliveredPanel(c) + proofPanel(c);
    if (c.delivered && c.delivered.length) return deliveredPanel(c);
    return '';
  }

  /* Between approval and proof of posting: the hotel already owns the files,
     but the collaboration itself does not finish until this actually happens. */
  function publishPanel(c) {
    return '<section class="ukPanel ukComposer ukPostProof"><div class="ukPanel_head">' +
      '<h3 class="ukPanel_title">Approved -- you can publish it</h3>' +
      '<span class="ukCount">Creator action</span></div>' +
      '<p class="ukAsk">Your host approved this and it is already in their library, yours to keep credit for. ' +
      'Post it to your channels whenever you are ready, then let us know it is live so the tracked link and ' +
      'the engagement it earns start counting toward you.</p>' +
      '<span class="ukHint" id="ukPublishHint" role="status" aria-live="polite"></span>' +
      '<button class="ukBtn" type="button" data-publish="' + c.id + '">I have published this</button>' +
    '</section>';
  }

  /* ---- proof of posting ----
     Only reachable once contentStatus is 'published' (see deliveryConnection
     above) — proving a post is live only makes sense once one actually is.
     Distinct from the handover above it: handing over is giving the hotel
     assets they already own; this is the public link to the post that actually
     went out, which is what ties the tracked link to a real placement and lets
     a booking, and its engagement, be attributed to it. */
  function proofPanel(c) {
    var proofs = c.proofs || [];
    var A = window.UKATTRIB;
    var places = (A ? A.CHANNELS : []).map(function (ch) {
      return '<optgroup label="' + esc(ch.n) + '">' + ch.places.map(function (pl) {
        return '<option value="' + esc(ch.k + '|' + pl) + '">' + esc(pl) + '</option>';
      }).join('') + '</optgroup>';
    }).join('');

    return '<section class="ukPanel ukComposer ukPostProof"><div class="ukPanel_head">' +
      '<h3 class="ukPanel_title">Show where it went live</h3>' +
      '<span class="ukCount">Creator action</span></div>' +
      '<p class="ukAsk">Paste the public link to your post. This is what connects your tracked link to the ' +
      'real thing, so the bookings and the engagement it drives are counted as yours.</p>' +
      (proofs.length
        ? '<ul class="ukPostProof_l">' + proofs.map(function (pr) {
            return '<li><span class="ukPostProof_pl">' + esc(pr.placement) + '</span>' +
              '<a class="ukPostProof_u" href="' + esc(pr.url) + '" target="_blank" rel="noopener">' + esc(pr.url) + '</a>' +
              (pr.impressions ? '<span class="ukPostProof_eng">' + D.fmt(pr.impressions) + ' impressions so far</span>' : '') +
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

  var HOTEL_OPEN_ICON = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 4h6v6M20 4l-8.5 8.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 14.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';

  /* The hotel side's own .ukCrD — the party on the other end of the deal gets
     one rich band at the top of the thread, not a thin strip. Its footer IS
     the stage track (no separate "Where this stands" panel anywhere else on
     the page), the same way the hotel side folds it into its own creator
     card rather than giving it a panel of its own.

     c is optional: before you have pitched, there is no collab yet to carry a
     status or a stage, so the browsing-side stay page passes none and gets the
     same header with the status badge and track left off, rather than a second,
     hand-built header that drifts from this one. */
  function hotelHead(c, stay, st) {
    /* Vibe and Budget used to sit here, but neither is ever actually collected
       from a hotel — the "host a creator" flow has no field for either, so
       every real published stay showed the same two fallback words no matter
       what the hotel did. Audience band and party size are genuinely what a
       hotel sets when it publishes a stay. */
    var stats = [
      ['Audience wanted', stay.wants || '—'],
      ['Party size', stay.guests ? (Number(stay.guests) <= 1 ? 'Just you' : String(stay.guests)) : '—'],
      ['Fit for you', (D.scoreFor ? D.scoreFor(stay) : '—') + '/10', true]
    ];
    return '<section class="ukCrD"><div class="ukCrD_grid">' +
      '<div class="ukCrD_who">' +
        '<span class="ukCrAv ukCrAv--xl ukCrAv--sq"><img src="' + esc(stay.img) + '" alt=""></span>' +
        '<div class="ukCrD_id">' +
          '<h2 class="ukCrD_n">' + esc(stay.hotel) +
            '<button class="ukCrD_open" type="button" data-hotel="' + esc(stay.id) + '" ' +
              'title="See the property" aria-label="See ' + esc(stay.hotel) + '’s full profile">' + HOTEL_OPEN_ICON + '</button>' +
          '</h2>' +
          '<p class="ukCrD_mk"><span class="ukCrD_mkK">Located in</span>' +
            '<span class="ukCrD_mkI">' + flagFor(stay.city) + esc(stay.city) + '</span></p>' +
          (stay.style ? '<div class="ukCrD_tagRow"><span class="ukCrTags"><span class="ukCrTag">' + esc(stay.style) + '</span></span></div>' : '') +
          '<ul class="ukCrD_stats">' + stats.map(function (s) {
            return '<li><span class="ukCrD_sv">' +
              (s[2] ? '<img class="ukCrStar" src="/assets/img/fc/star.svg" alt="" width="10" height="10">' : '') +
              esc(s[1]) + '</span><span class="ukCrD_sl">' + esc(s[0]) + '</span></li>';
          }).join('') + '</ul>' +
        '</div>' +
      '</div>' +
      (c ? '<div class="ukCrD_side">' + statusBadge(c) + '</div>' : '') +
    '</div>' + (c ? '<div class="ukCrD_track">' + track(c.stage) + '</div>' : '') + '</section>';
  }

  /* The hotel side's principle: the stay card carries its own frame and
     already names the stay, so a second panel headed "The deal" said the
     same nights, room and deliverables twice. One card, in the sidebar,
     same as the hotel side's collab thread. */
  function threadStayCard(stay, dates) {
    return window.UKSTAY.card(stay, dates, {
      property: { name: stay.hotel, city: stay.city, cc: window.ukCCOf ? window.ukCCOf(stay.city) : null },
      propGo: { attr:'hotel', val: stay.id, title:'See the property' },
      /* the hotel's own label is "You get" (them getting the deliverables);
         read from this side it is what THEY get, same fix already applied to
         the stay card on the browse grid. */
      getLabel: 'They get'
    });
  }

  function thread(st) {
    if (D.hydrateLinked) D.hydrateLinked();
    var c = D.collabs.filter(function (x) { return x.id === st.thread; })[0];
    var stay = D.stay(c.stay);
    if (st.delivering) return deliver(st, c, stay);
    var dates = D.packageDates ? D.packageDates(c) : (c.dates || {});
    /* The breadcrumb in the top bar already reads "Your collabs > <hotel>" and
       goes back to the list the same way this button did — a second one here
       said it twice. */
    return '<div class="ukThreadPage' + (st.focus ? ' is-focus' : '') + '">' +
      hotelHead(c, stay, st) +
      '<div class="ukGrid ukGrid--thread"><section class="ukFlow">' +
        (c.justDelivered ? cheer(c, stay) : '') + threadPanel(c, stay, st) +
      '</section><aside class="ukSideCol">' + threadStayCard(stay, dates) + '</aside></div>' +
    '</div>';
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
        return '<button class="ukPickReel' + (on ? ' is-on' : '') + '" type="button" data-pickwork="' + w.id + '" aria-pressed="' + (on ? 'true' : 'false') + '">' + m(w.m, w.t, '', i < 3) + '<span class="ukPickReel_c" aria-hidden="true">' + (on ? CHECK_ICON : '') + '</span><span class="ukReel_t">' + esc(w.t) + '</span></button>';
      }).join('') + '</div><button class="ukGhost ukGhost--icon" type="button" data-ack="Coming up">' + REFRESH_ICON + '<span>Upload something new</span></button></section></div>' +
      '<aside class="ukPanel ukSticky"><div class="ukPanel_head"><h3 class="ukPanel_title">What they asked for</h3></div><ul class="ukAsked">' + stay.del.map(function (d) {
        var isV = /video|reel/i.test(d.t), have = isV ? vids : pics;
        return '<li class="' + (have >= d.q ? 'is-met' : '') + '"><span class="ukAsked_n">' + esc(d.t) + '</span><span class="ukAsked_c">' + Math.min(have, d.q) + ' of ' + d.q + '</span></li>';
      }).join('') + '</ul>' +
      (short ? '<p class="ukSoothe">You are under what they asked for. You can still send it — most hosts are relaxed about the exact count if the work is good — but it is worth a note in the thread.</p>' : '<p class="ukCheer" style="margin:14px 0 0">That covers the brief. Nice.</p>') +
      '<button class="ukBtn ukCard_cta ukCard_cta--gapped" type="button" data-senddeliver="' + c.id + '"' + (chosen.length ? '' : ' disabled') + '>Hand over ' + (chosen.length || '') + (chosen.length === 1 ? ' piece' : ' pieces') + '</button>' + (chosen.length ? '' : '<p class="ukHint">Pick at least one piece to hand over.</p>') +
      '<p class="ukWhy">They get the right to post these on their own channels. You keep them too, and they go straight onto your media kit.</p></aside></div>';
  }

  function cheer(c, stay) {
    return '<section class="ukCheerBig" role="status"><div><p class="ukHero_eyebrow">Sent for review</p><h3 class="ukCheerBig_t">That is a wrap on ' + esc(stay.hotel) + '</h3><p class="ukCheerBig_p">The Ukreate team gives it a quick look first, then it lands with ' + esc(stay.hotel) + '. You will see it move here the moment that happens.</p><div class="ukHero_cta"><button class="ukBtn" type="button" data-goto="stays">Find your next stay</button></div></div><div class="ukCheerBig_m">' + (c.delivered || []).slice(0, 3).map(function (id) { var w = D.work(id); return w ? m(w.m, w.t) : ''; }).join('') + '</div></section>';
  }

  function deliveredPanel(c) {
    return '<section class="ukPanel ukComposer"><div class="ukPanel_head"><h3 class="ukPanel_title">What you delivered</h3><span class="ukCount">' + c.delivered.length + ' pieces</span></div><div class="ukReels">' + c.delivered.map(function (id) { var w = D.work(id); return w ? '<figure class="ukReel">' + m(w.m, w.t) + '<figcaption><span class="ukReel_t">' + esc(w.t) + '</span></figcaption></figure>' : ''; }).join('') + '</div></section>';
  }

  /* ============================ 3 — stays ============================
     ONE JOB: find a stay to pitch. This used to also carry the whole pitch
     pipeline — Waiting, Replied, Became collabs — as lanes over the same list,
     which meant a creator had to come here to check on something they had
     already sent, then leave again once a hotel said yes. That pipeline is now
     Your collabs' own Inquiry tab, the same way the hotel side keeps its
     inquiries in Collaborations rather than on its stay-listing page. This page
     only ever shows what has not been pitched yet. */
  var WEB_ICON = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" ' +
    'stroke="currentColor" stroke-width="1.5"/><path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3Z" ' +
    'stroke="currentColor" stroke-width="1.5"/></svg>';
  var MAIL_ICON = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="2.5" ' +
    'stroke="currentColor" stroke-width="1.5"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ============================ 3 — find work ============================
     One page, two tabs — Stays (warm, already on Ukreate, full campaign
     detail) and Outreach (cold, reached directly, thinner cards because
     there is genuinely less to show before a hotel has answered). They used
     to be two nav items and two pages, which meant a fresh account landing
     on an empty Stays tab never discovered the 240 hotels waiting on
     Outreach, and a search typed on one taught the other nothing.

     Search, the kind-of-stay filter and Saved all live on `st` — the one
     state bucket this whole page shares — so switching tabs never drops
     them; only which list is being read through them changes. */
  function stays(st) {
    var P = window.UKCP;
    if (P && P.writing()) return P.composer(st);
    if (st.open) return stayDetail(st);

    var view = st.view || 'grid';
    var q = (st.q || '').toLowerCase(), sf = st.style || 'all';
    /* Already-pitched stays leave this list. They have not gone anywhere: they
       are in Your collabs, under Inquiry. */
    var stayPool = P ? P.unpitched() : D.stays;
    var stays_ = stayPool.filter(function (s) {
      if (st.saved && !s.saved) return false;
      if (q && (s.hotel + ' ' + s.city + ' ' + s.style).toLowerCase().indexOf(q) < 0) return false;
      if (sf !== 'all' && s.style !== sf) return false;
      return true;
    });
    var styles = ['all'].concat(stayPool.map(function (s) { return s.style; })
      .filter(function (v, i, a) { return a.indexOf(v) === i; }));
    /* Ranked by fit, best first. This is what Pitch Pilot's shortlist was, and it
       belongs on the cards that already carry the score rather than on a second
       page listing the same hotels in a different order. */
    stays_ = stays_.slice().sort(function (a, b) { return D.scoreFor(b) - D.scoreFor(a); });

    var leadPool = D.leads || [];
    var leads_ = leadPool.filter(function (l) {
      return !q || (l.hotel + ' ' + l.city).toLowerCase().indexOf(q) > -1;
    });

    /* Considered default: land wherever there is genuinely something to see,
       judged against the real pool rather than a momentary empty search —
       Stays when it has live campaigns, Outreach when it does not (a brand
       new market with nothing posted yet still has hotels worth reaching
       cold). Decided once and then left alone, so picking a tab sticks even
       if a search briefly empties it out. */
    if (st.tab !== 'stays' && st.tab !== 'outreach') {
      st.tab = stayPool.length ? 'stays' : 'outreach';
    }
    var tab = st.tab;

    /* The ask bar comes down out of the top bar and becomes this page's
       search — the same move the hotel side's Creators page already makes.
       One input that understands a sentence beats a second, plainer one
       stacked above the same results. The shell moves the mounted bar into
       this slot (see rescueAsk/placeAsk in ukcapp.js). It answers into `q`
       regardless of which tab reads it, which is what makes the search
       shared rather than a second copy per tab. */
    return head('Stays', 'Hotels that actually want to work with creators like you.') +
      '<div class="ukCrFind" data-ask-slot></div>' +

      '<div class="ukFilters ukFilters--tabs" role="tablist" aria-label="Find work">' +
        '<button class="ukFilter' + (tab === 'stays' ? ' is-on' : '') + '" type="button" role="tab" ' +
          'aria-selected="' + (tab === 'stays') + '" aria-controls="ukFindPanel" data-tab="stays">' +
          '<span class="ukFilter_lb">Stays</span><span class="ukFilter_ct">' + stays_.length + '</span></button>' +
        '<button class="ukFilter' + (tab === 'outreach' ? ' is-on' : '') + '" type="button" role="tab" ' +
          'aria-selected="' + (tab === 'outreach') + '" aria-controls="ukFindPanel" data-tab="outreach">' +
          '<span class="ukFilter_lb">Outreach</span><span class="ukFilter_ct">' + leads_.length + '</span></button>' +
      '</div>' +

      (tab === 'stays'
        ? '<div class="ukToolbar ukToolbar--split ukCrBar">' +
            '<div class="ukCrBar_l">' +
              '<button class="ukFilter' + (st.saved ? ' is-on' : '') + '" type="button" ' +
                'aria-pressed="' + !!st.saved + '" data-savedonly><span class="ukFilter_lb">Saved</span></button>' +
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
          '</div>'
        : '') +

      '<div id="ukFindPanel" role="tabpanel" aria-label="' + (tab === 'stays' ? 'Stays' : 'Outreach') + '">' +
        (tab === 'outreach'
          ? (!leads_.length
              ? empty('Nothing matches that yet', 'Try a different name or place.')
              : '<div class="ukOutreachGrid">' + leads_.map(leadCard).join('') + '</div>')
          : (!stays_.length
              ? empty('Nothing matches that yet',
                  'Try a wider search. There are ' + D.stays.length + ' stays open right now, and new ones land most weeks.',
                  '<button class="ukBtn" type="button" data-clearf>Clear the filters</button>')
              : view === 'map' ? stayMap(stays_, st)
              : view === 'list' ? stayList(stays_)
              : stayGrid(stays_, st))) +
      '</div>';
  }

  /* ============================ 3b — outreach cards ============================
     The cold half of "find work": hotels not on Ukreate at all, no campaign,
     nothing but who they are and how to reach them. Deliberately thin — a
     stay card with nights and deliverables would be showing terms that do
     not exist yet. Pitching one still goes through the same composer (see
     ukcpitch.js's isLead branch); the difference is entirely in what there
     is to show before that. */

  function leadCard(l) {
    var socials = (l.socials || []).map(function (s) {
      return '<span class="ukLeadCard_soc">' + esc(s.handle) + '</span>';
    }).join('');
    return '<div class="ukLeadCard">' +
      window.UKSTAY.hotelCard(l, {
        eager: true,
        foot: '<div class="ukLeadCard_contact">' +
            (l.website ? '<p class="ukLeadCard_row">' + WEB_ICON + '<span>' + esc(l.website) + '</span></p>' : '') +
            (l.email ? '<p class="ukLeadCard_row">' + MAIL_ICON + '<span>' + esc(l.email) + '</span></p>' : '') +
            (socials ? '<p class="ukLeadCard_row ukLeadCard_row--soc">' + socials + '</p>' : '') +
          '</div>' +
          '<button class="ukBtn ukCard_cta" type="button" data-apply="' + esc(l.id) + '">Pitch this hotel</button>'
      }) +
    '</div>';
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
      /* Just the arrangement here, not the amount too — trade() now shows
         the real dollar figure inside the card body itself, and a second
         copy of the same number in the photo badge was decoration, not
         information. */
      (s.collabType && s.collabType !== 'Hosted stay'
        ? '<span class="ukTag ukTag--you ukStayNew">' + esc(s.collabType) + '</span>' : '') +
      '<span class="ukScore2" title="How well this stay fits your audience size" ' +
        'aria-label="Fit score: ' + D.scoreFor(s) + ' out of 10, based on your audience size">' +
        D.scoreFor(s) + '<em>/10</em></span>' +
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
        /* A fixed item count, not a pixel line-height, so two cards side by
           side never present the same kind of list two different ways just
           because one hotel's inclusions happen to be a shorter phrase. */
        capAt: 2,
        /* The hotel labels the creator's half of the trade "You get". Read from
           here it is what THEY get, and leaving the hotel's word on it made the
           card look like the creator was being handed the deliverables. */
        getLabel: 'They get',
        propGo: { attr:'hotel', val:s.id, title:'See the property' },
        foot: '<div class="ukStayCell_act">' +
          applyCta(s) +
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
        pic(s.img, s.hotel, '4x3', 'ukM--sm') +
        '<span class="ukList_body"><span class="ukList_name">' + esc(s.hotel) + '</span>' +
        '<span class="ukList_meta">' + flagFor(s.city) + esc(s.city) + ' · ' + s.nights + ' nights · ' + esc(s.inc) + '</span></span>' +
        '<span class="ukWhen">' + esc(s.from) + '</span>' +
        '<span class="ukTag ukTag--you" title="How well this stay fits your audience size">' +
          D.scoreFor(s) + '/10</span></li>';
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
          '<p class="ukMini_m">' + flagFor(s.city) + esc(s.city) + '</p>' +
          '<p class="ukMini_s">' + s.nights + ' nights &middot; scored ' + D.scoreFor(s) + '/10</p></div>' +
          '<span class="ukTag ukTag--you" title="How well this stay fits your audience size">' +
            D.scoreFor(s) + '/10</span>' +
          (s.id === sel ? '<div class="ukMini_act">' +
            '<button class="ukBtn ukBtn--sm" type="button" data-open="' + s.id + '">See the stay</button>' +
          '</div>' : '') +
        '</article>';
      }).join('') + '</div></div>';
  }


  /* The list image and the main image are the same set of photos, not two
     different ones — the list is every photo in a smaller frame, one of
     them (whichever is active) also blown up in the main frame. Click a
     different list image and the main frame follows it. Fewer than four
     real photos still gets four list slots; the empty ones sit dim so the
     row never collapses down to however many photos happen to exist. */
  function stayHero(s, id, ix) {
    var shots = (s.imgs && s.imgs.length ? s.imgs : [s.img]).filter(Boolean);
    ix = Math.min(Math.max(0, ix || 0), shots.length - 1);
    var slots = [];
    for (var n = 0; n < 4; n++) slots.push(shots[n] !== undefined ? { src: shots[n], i: n } : null);
    return '<div class="ukStayHero" data-open="' + id + '">' +
      '<div class="ukStayHero_thumbs">' + slots.map(function (o) {
        if (!o) return '<span class="ukStayHero_thumb ukStayHero_thumb--empty" aria-hidden="true"></span>';
        return '<button class="ukStayHero_thumb' + (o.i === ix ? ' is-on' : '') + '" type="button" data-stayshot="' + o.i + '" ' +
          'aria-label="Photo ' + (o.i + 1) + ' of ' + shots.length + '"' + (o.i === ix ? ' aria-current="true"' : '') + '>' +
          '<img src="' + o.src + '" alt="" loading="lazy" decoding="async"></button>';
      }).join('') + '</div>' +
      '<div class="ukStayHero_main"><img src="' + shots[ix] + '" alt="' + esc(s.hotel) + '" loading="eager" decoding="async"></div>' +
    '</div>';
  }

  /* Picked for what each fact actually is, not whatever was closest to hand:
     a stay is booked, so nights gets the book glyph; a date range is a
     schedule, so it gets list; a room is a building, not a dashboard (the
     one solid glyph shaped like a house also has a UI-panel look to it at
     this size, so the room fact stays outline). people is the only human
     figure this pack has — there is no pair/group glyph to swap to. */
  var STAY_FACT_ICON = { nights: 'book', room: 'building', guests: 'people', dates: 'list', got: 'wallet', score: 'star' };
  function stayFact(iconName, value, label) {
    return '<li>' + iconSolid(STAY_FACT_ICON[iconName] || iconName) +
      '<span><b>' + esc(value) + '</b>' + esc(label) + '</span></li>';
  }

  /* A row with a real icon in a circle, not just a checkmark — used for every
     list this page shows. Deliverables map onto icons this product already
     has for exactly this (video/image, the same ones a media grid uses); an
     inclusion that names a room type gets the building glyph; anything else
     gets a plain check rather than a guessed icon this icon pack does not
     actually have (there is no fork, no spa, no wifi glyph in it — a page
     is not "detailed" for pretending otherwise). */
  function iconRow(name, label) {
    return '<li><span class="ukIconBadge">' + icon(name) + '</span><span>' + esc(label) + '</span></li>';
  }
  function inclusionIcon(label) {
    return /room|suite|cabana|cabin|loft|king|double/i.test(label) ? 'building' : 'check';
  }
  function deliverableIcon(type) {
    var l = type.toLowerCase();
    if (/video|reel|b-?roll|long.?form|drone|aerial/.test(l)) return 'video';
    if (/photo|carousel|story|stories/.test(l)) return 'image';
    return 'check';
  }

  /* One card, under the photos, split the way the trade itself is split: the
     left is what the stay IS (the hotel's name and every real detail about
     it), the right is what it TAKES to get it (the trade — CD.trade(), the
     same function every stay card in the product renders — and the three
     actions). Two halves of one card, not a details card here and a second
     card in a sidebar saying half of it again. */
  /* Pitching again a stay you are already in makes no sense — the banner
     above this same card already says so. So the primary action here is not
     unconditionally applyCta()'s "Pitch this stay": if a collab already
     exists for this stay, the honest primary action is opening it. */
  function stayPrimaryCta(s, c, cls) {
    if (c) return '<button class="ukBtn ' + cls + '" type="button" data-thread="' + c.id + '">Open the conversation</button>';
    return applyCta(s, cls);
  }

  function stayIntro(s, CD, shotIx, c) {
    var delLine = (s.del || []).map(function (d) { return d.q + ' × ' + d.t.toLowerCase(); }).join(', ');
    var facts = [stayFact('nights', s.nights + (String(s.nights) === '1' ? ' night' : ' nights'), 'Length of stay')];
    if (s.room) facts.push(stayFact('room', s.room, 'Room type'));
    if (s.guests) facts.push(stayFact('guests', Number(s.guests) <= 1 ? 'Just you' : String(s.guests), 'Party size'));
    facts.push(stayFact('dates', CD.fmtRange(s.from, s.to), 'Dates'));
    facts.push(stayFact('got', delLine, 'They get'));
    facts.push(stayFact('score', D.scoreFor(s) + '/10', 'Pitch-friendly'));
    /* The trade card used to repeat this same nights/room/dates/assets in its
       own two boxes off to the right. Once every one of those facts lives in
       this one strip there is nothing left for that card to say, so it is
       gone rather than kept around to agree with itself. */
    return '<section class="ukPanel ukStayIntro">' +
      stayHero(s, s.id, shotIx) +
      '<div class="ukStayIntro_top">' +
        '<div><h2 class="ukStayIntro_n">' + esc(s.hotel) +
          (s.style ? ' <span class="ukChip">' + esc(s.style) + '</span>' : '') + '</h2>' +
          '<p class="ukStayIntro_addr">' + flagFor(s.city) + esc(s.city) + '</p></div>' +
        '<div class="ukStayIntro_act">' +
          stayPrimaryCta(s, c, 'ukBtn--sm') +
          (c ? '' : '<button class="ukGhost ukGhost--sm" type="button" data-hotel="' + s.id + '">See the property</button>') +
          '<span class="ukStayIntro_actDiv" aria-hidden="true"></span>' +
          '<button class="ukStayIntro_save' + (s.saved ? ' is-on' : '') +
            '" type="button" data-save="' + s.id + '" aria-label="' + (s.saved ? 'Saved' : 'Save for later') + '">' +
            favIcon(s.saved) + '</button>' +
        '</div>' +
      '</div>' +
      '<p class="ukStayIntro_value">' + esc(s.room) + ' &middot; ' + esc(s.inc) + '</p>' +
      '<ul class="ukStayIntro_facts">' + facts.join('') + '</ul>' +
      '<p class="ukStayIntro_whyT">Why pitch this stay</p>' +
      '<p class="ukStayIntro_why">' + esc(D.fitNote(s)) + ' ' + esc(s.why) + '</p>' +
    '</section>';
  }

  /* A real callout, not filler: if this stay already has a thread — a pitch
     already sent, a reply already in — that status comes from D.collabs, the
     one place it actually lives, instead of the page repeating "pitch this
     stay" as if nothing had happened yet. */
  function stayCollabFor(s) {
    return (D.collabs || []).filter(function (x) { return x.stay === s.id; })[0] || null;
  }

  /* A real callout, not filler: if this stay already has a thread — a pitch
     already sent, a reply already in — that status comes from D.collabs, the
     one place it actually lives, instead of the page repeating "pitch this
     stay" as if nothing had happened yet. c.stage is the STAGE'S INDEX into
     D.STAGES (the same number track() steps through), not a key — read as a
     string match against stg.key this always missed and the line under here
     never said which stage it was, in every single case. */
  function stayThreadNote(s, c) {
    if (!c) return '';
    var stg = D.STAGES && D.STAGES[c.stage];
    return '<div class="ukCheer" data-thread="' + c.id + '" role="button" tabindex="0" style="cursor:pointer">' +
      'You already reached out about this one' + (stg ? ' — ' + esc(stg.short) + ': ' + esc(stg.say) : '') +
      '. Open the conversation.</div>';
  }

  /* Flat, unboxed sections — no card, just a heading and a rule above it —
     for everything below the intro card. One continuous sheet of content,
     the way the reference reads, rather than a stack of separate cards. */
  function staySection(title, body) {
    return '<section class="ukStaySection"><h3 class="ukStaySection_t">' + title + '</h3>' + body + '</section>';
  }

  var GUIDE_ICON = { welcome: 'home', access: 'lock', local: 'star', house: 'list', safety: 'bell' };
  var GUIDE_LABEL = { welcome: 'Welcome', access: 'Wi-Fi and access', local: 'Nearby, worth your time',
    house: 'House notes', safety: 'Safety and contacts' };
  function stayGuide(s) {
    if (!s.guide) return '';
    var keys = ['welcome', 'access', 'local', 'house', 'safety'];
    return staySection('Guest guide',
      '<p class="ukStaySection_lead">What ' + esc(s.hotel) + ' sends every creator once a stay is confirmed:</p>' +
      '<ul class="ukGuideList">' + keys.filter(function (k) { return s.guide[k]; }).map(function (k) {
        return '<li><span class="ukIconBadge">' + icon(GUIDE_ICON[k]) + '</span>' +
          '<div><b>' + GUIDE_LABEL[k] + '</b><p>' + esc(s.guide[k]) + '</p></div></li>';
      }).join('') + '</ul>');
  }

  /* A brief is not always four short chips — a hotel can write a long note,
     drop in a link, or attach a PDF (the composer on their side supports all
     three: assets/js/ukviews.js briefFields()). This page reads whichever of
     those actually came through on c.brief once a collab exists, instead of
     only ever showing the stay's generic deliverable list. Pre-pitch, there
     is no collab yet and so no brief text to show — the deliverable chips
     are what the stay itself already advertises, and that stays as-is. */
  function stayBrief(s, c, got) {
    var b = c && c.brief;
    var chips = '<ul class="ukIconGrid">' + s.del.map(function (d) {
      return iconRow(deliverableIcon(d.t), d.q + ' × ' + d.t.toLowerCase()); }).join('') + '</ul>';
    if (!b) {
      return '<p class="ukStaySection_lead">In exchange, they are asking for ' + got + ' piece' + (got === 1 ? '' : 's') +
        ' of content:</p>' + chips +
        '<p class="ukHint">UGC means content they post on their own channels. They are buying your eye, not your audience.</p>';
    }
    return (b.title ? '<p class="ukStayBrief_t">' + esc(b.title) + '</p>' : '') +
      (b.notes ? '<p class="ukStayBrief_notes">' + esc(b.notes) + '</p>' : '') +
      chips +
      (b.deadline ? '<p class="ukHint">Due ' + esc(b.deadline) + '</p>' : '') +
      (b.link ? '<a class="ukGhost ukGhost--sm ukStayBrief_link" href="' + esc(b.link) +
        '" target="_blank" rel="noopener">' + icon('chevron') + esc(b.link) + '</a>' : '') +
      (b.file ? '<p class="ukStayBrief_file">' + icon('book') + esc(b.file) + '</p>' : '');
  }

  function stayDetail(st) {
    var s = D.stay(st.open);
    var CD = window.UKSTAY;
    var shotIx = (st.shots && st.shots[s.id]) || 0;
    var incList = String(s.inc || '').split(',').map(function (x) { return x.trim(); }).filter(Boolean);
    var got = (s.del || []).reduce(function (a, d) { return a + (d.q || 0); }, 0);
    var pt = { id: s.id, lat: s.lat, lng: s.lng, on: true, name: s.hotel, sub: s.city,
      cc: window.ukCCOf ? window.ukCCOf(s.city) : null };
    var c = stayCollabFor(s);
    /* If anything the creator has already saved from Discover fits this
       stay's market or vibe, surface it right here — pitch prep is the
       moment a save is actually useful, not a shelf it sits on. */
    var forMarket = D.dsForMarket ? D.dsForMarket(s.city, [s.vibe]) : [];
    return '<div>' +
        stayThreadNote(s, c) +
        stayIntro(s, CD, shotIx, c) +
        (forMarket.length ? staySection('Saved inspiration for ' + esc(s.city.split(',').pop().trim()),
          '<p class="ukStaySection_lead">From your Discover saves — worth a look before you pitch.</p>' +
          '<div class="ukDiscGrid">' + forMarket.slice(0, 3).map(function (i) {
            return '<article class="ukDiscCard" data-discitem="' + i.id + '" tabindex="0" role="button" ' +
              'aria-label="Open ' + esc(i.t) + '">' +
              '<div class="ukDiscCard_m">' + m(i.m, i.t, '', false) + '</div>' +
              '<div class="ukDiscCard_b"><p class="ukDiscCard_t">' + esc(i.t) + '</p>' +
              '<p class="ukDiscCard_by"><span>' + esc(i.by.n) + '</span></p></div></article>';
          }).join('') + '</div>') : '') +
        (incList.length ? staySection('Room amenities',
          '<p class="ukStaySection_lead">Everything the host is covering for this stay:</p>' +
          '<ul class="ukIconGrid">' + incList.map(function (x) {
            return iconRow(inclusionIcon(x), x); }).join('') + '</ul>') : '') +
        stayGuide(s) +
        staySection('The brief', stayBrief(s, c, got)) +
        (s.lat != null ? staySection('Location',
          '<p class="ukStaySection_lead">' + flagFor(s.city) + esc(s.city) +
            ' &middot; dropped at the property’s own coordinates, ' + s.lat.toFixed(2) + ', ' + s.lng.toFixed(2) + '.</p>' +
          '<div class="ukMapSlot ukMapSlot--tall" data-cstaymap=\'' + JSON.stringify([pt]).replace(/'/g, '&#39;') + '\'></div>') : '') +
      '</div>';
  }

  /* ============================ 4 — apply ============================ */

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
    var academyCert = me.academyCert || (D.academy && D.academy.length > 0 && D.academy.every(function (l) { return l.done; }));
    return head('Your profile', 'This is what a hotel sees. Make yourself impossible to ignore.') +
      '<section class="ukProf">' +
        '<div class="ukProf_id">' + pic(me.img, me.n, '1x1', 'ukM--avxl', true) +
          '<div><h2 class="ukProf_n">' + esc(me.n) +
            (me.verified ? '<span class="ukChip ukChip--v">' + window.ukVetBadge('ukChipVet') + 'Verified</span>' : '') +
            (academyCert ? '<span class="ukChip ukChip--academy">' + window.ukVetBadge('ukChipVet') + 'Academy certified</span>' : '') + '</h2>' +
            '<p class="ukProf_m">' + esc(me.h) + ' · ' + flagFor(me.city) + esc(me.city) + '</p>' +
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
            '<p class="ukKit_m">' + esc(me.h) + ' · ' + flagFor(me.city) + esc(me.city) + '</p>' +
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

  var LESSON_CHECK = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.6 6.35 4.85 8.6 9.4 3.75" ' +
    'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* One badge per module, earned the moment its last lesson is — plus the
     full certification once every module is. Unearned ones stay visible and
     dimmed rather than disappearing, because a locked badge is the thing
     that turns a video library into a reason to come back: it says exactly
     what finishing gets you next, not that you have fallen short. Reuses
     the one seal icon the app already has for a credential (ukVetBadge —
     the same mark Verified and Academy certified already draw), never a
     second badge graphic invented just for this. */
  function badgeSection(st) {
    var mods = D.academy.map(function (l) { return l.mod; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
    var earned = D.academyModules ? D.academyModules() : [];
    var prog = D.academyProgress ? D.academyProgress() : { done:0, total:D.academy.length };
    var cert = D.me.academyCert;
    var justBadgedMod = st.justBadgedMod; st.justBadgedMod = null;

    return (justBadgedMod
      ? '<section class="ukCheer" role="status" style="display:flex;align-items:center;gap:10px">' +
          window.ukVetBadge('ukChipVet') +
          '<span>' + esc(justBadgedMod) + ' badge earned. It is on your profile now, and hotels see it too.</span></section>'
      : '') +
      '<section class="ukPanel ukAcadBadges">' +
        '<div class="ukPanel_head"><h3 class="ukPanel_title">Your badges</h3>' +
          '<span class="ukCount2">' + prog.done + ' of ' + prog.total + ' lessons</span></div>' +
        '<p class="ukAsk">One badge per module. Finish every lesson in it and it is yours — hotels see ' +
          'exactly what you have completed, not just that you signed up.</p>' +
        '<div class="ukBadgeGrid">' + mods.map(function (mod) {
          var on = earned.indexOf(mod) > -1;
          var n = D.academy.filter(function (l) { return l.mod === mod; }).length;
          var done = D.academy.filter(function (l) { return l.mod === mod && l.done; }).length;
          return '<button class="ukBadge' + (on ? ' is-on' : '') + '" type="button" data-acadmod="' + esc(mod) +
            '" aria-label="' + esc(mod) + (on ? ', badge earned' : ', ' + done + ' of ' + n + ' lessons done') + '">' +
            window.ukVetBadge('ukBadge_ic') +
            '<span class="ukBadge_t">' + esc(mod) + '</span>' +
            '<span class="ukBadge_s">' + (on ? 'Earned' : done + ' of ' + n + ' lessons') + '</span>' +
          '</button>';
        }).join('') + '</div>' +
        '<div class="ukBadgeCert' + (cert ? ' is-on' : '') + '">' +
          window.ukVetBadge('ukBadge_ic ukBadge_ic--cert') +
          '<div><p class="ukBadgeCert_t">' + (cert ? 'Academy certified' : 'Full certification') + '</p>' +
          '<p class="ukBadgeCert_s">' + (cert
            ? 'Every module done. It is on your profile, and every hotel sees it.'
            : (prog.total - prog.done) + ' lesson' + (prog.total - prog.done === 1 ? '' : 's') + ' left across ' +
              (mods.length - earned.length) + ' module' + (mods.length - earned.length === 1 ? '' : 's') + '.') +
          '</p></div>' +
        '</div>' +
      '</section>';
  }

  function academy(st) {
    if (st.lesson) return lesson(st);
    var mods = D.academy.map(function (l) { return l.mod; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
    var modF = st.acadMod || 'all';
    var shown = D.academy.filter(function (l) { return modF === 'all' || l.mod === modF; });
    var justCert = st.justCertified; st.justCertified = false;
    return head('Academy', 'Short videos on how this actually works. Watch one before your next pitch.') +
      (justCert
        ? '<section class="ukCheer" role="status" style="display:flex;align-items:center;gap:10px">' +
            window.ukVetBadge('ukChipVet') +
            '<span>Academy certified. It is on your profile now, and hotels see it too.</span></section>'
        : '') +
      badgeSection(st) +
      '<div class="ukTabs" role="tablist" aria-label="Module">' +
        '<button class="ukTabs_b' + (modF === 'all' ? ' is-on' : '') + '" type="button" role="tab" ' +
          'aria-selected="' + (modF === 'all') + '" data-acadmod="all">All modules</button>' +
        mods.map(function (mod) {
          var on = modF === mod;
          return '<button class="ukTabs_b' + (on ? ' is-on' : '') + '" type="button" role="tab" ' +
            'aria-selected="' + on + '" data-acadmod="' + esc(mod) + '">' + esc(mod) + '</button>';
        }).join('') +
      '</div>' +
      '<div class="ukAcadGrid">' + shown.map(academyCard).join('') + '</div>';
  }

  /* One card per lesson, in the reference's own course-card shape: a 16:9
     cover with its module as a corner badge, title, a lessons/duration meta
     row where the reference put lessons/students, a rule, then status and
     the primary action — same slot the reference gave its price and
     "Start Course" button. */
  function academyCard(l) {
    return '<article class="ukAcadCard' + (l.done ? ' is-done' : '') + '" tabindex="0" role="button" ' +
      'data-lesson="' + l.id + '" aria-label="' + (l.done ? 'Watched: ' : 'Start ') + esc(l.t) + '">' +
      '<div class="ukAcadCard_m">' + m(l.m, l.t, 'ukAcadCard_img', false) +
        '<span class="ukAcadCard_badge">' + esc(l.mod) + '</span>' +
        '<span class="ukAcadCard_len">' + l.len + '</span>' +
      '</div>' +
      '<div class="ukAcadCard_b">' +
        '<p class="ukAcadCard_t">' + esc(l.t) + '</p>' +
        '<p class="ukAcadCard_meta">' + CLOCK_ICON + '<span>' + l.len + '</span>' +
          '<span class="ukAcadCard_dot" aria-hidden="true">&middot;</span>' + MODULE_ICON + '<span>' + esc(l.mod) + '</span></p>' +
        '<div class="ukAcadCard_rule"></div>' +
        '<div class="ukAcadCard_foot">' +
          '<span class="ukAcadCard_status">' + (l.done ? STATUS_ICON + ' Watched' : 'Not started') + '</span>' +
          '<span class="ukAcadCard_go">' + (l.done ? 'Rewatch' : 'Start') +
            '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" ' +
            'stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
        '</div>' +
      '</div></article>';
  }

  /* The lesson page's sticky aside is the full curriculum, not just the next
     clip — a real course keeps you inside it, so anything else in the
     Academy is one click away without dropping back to the index. */
  var CLOCK_ICON = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 7v5l3.5 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var MODULE_ICON = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="4.5" width="17" height="15" rx="2.5" stroke="currentColor" stroke-width="1.5"/><path d="M3.5 9.5h17" stroke="currentColor" stroke-width="1.5"/></svg>';
  var STATUS_ICON = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M8.3 12.3 10.7 14.7 15.7 9.3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var LIST_ICON = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 6.5h12M8 12h12M8 17.5h12M4 6.5h.01M4 12h.01M4 17.5h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  var CHEV_DOWN = '<svg class="ukAcadCurric_car" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';

  function acadStat(icon, val, lb) {
    return '<li class="ukAcadStat"><span class="ukAcadStat_ic" aria-hidden="true">' + icon + '</span>' +
      '<span class="ukAcadStat_v">' + val + '</span><span class="ukAcadStat_l">' + lb + '</span></li>';
  }

  function lesson(st) {
    var all = D.academy;
    var l = all.filter(function (x) { return x.id === st.lesson; })[0];
    var mods = all.map(function (x) { return x.mod; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
    var inMod = all.filter(function (x) { return x.mod === l.mod; });
    var posInMod = inMod.indexOf(l) + 1;
    var doneTotal = all.filter(function (x) { return x.done; }).length;
    if (!st.curricOpen) { st.curricOpen = {}; st.curricOpen[l.mod] = true; }

    return '<h1 class="ukAcadLesson_h">' + esc(l.t) + '</h1>' +
      '<ul class="ukAcadStats">' +
        acadStat(CLOCK_ICON, l.len, 'Length') +
        acadStat(MODULE_ICON, esc(l.mod), 'Module') +
        acadStat(STATUS_ICON, l.done ? 'Watched' : 'Not started', 'Status') +
        acadStat(LIST_ICON, 'Lesson ' + posInMod + ' of ' + inMod.length, 'In this module') +
      '</ul>' +
      '<div class="ukAcadLesson">' +
      '<div class="ukAcadLesson_main">' +
        '<button class="ukAcadPlayer16" type="button" data-lessonplay="' + esc(l.id) + '" aria-label="Play ' + esc(l.t) + '">' +
          m(l.m, l.t, 'ukAcadPlayer16_m', true) +
          '<span class="ukAcadPlayer16_len">' + l.len + '</span></button>' +
        '<section class="ukPanel">' +
          '<div class="ukPanel_head"><h3 class="ukPanel_title">The short version</h3></div>' +
          '<p class="ukLessonNotes">' + esc(l.notes || l.d) + '</p>' +
          '<p class="ukHint">Notes are here so you can skim it now and watch properly later.</p>' +
        '</section>' +
        '<section class="ukPanel" style="margin-top:16px">' +
          '<div class="ukPanel_head"><h3 class="ukPanel_title">Summary</h3></div>' +
          '<dl class="ukFacts">' +
            '<div><dt>Module</dt><dd>' + esc(l.mod) + '</dd></div>' +
            '<div><dt>Length</dt><dd>' + l.len + '</dd></div>' +
            '<div><dt>Status</dt><dd>' + (l.done ? 'Watched' : 'Not started') + '</dd></div>' +
            '<div><dt>Position</dt><dd>Lesson ' + posInMod + ' of ' + inMod.length + '</dd></div>' +
            '<div><dt>Academy progress</dt><dd>' + doneTotal + ' of ' + all.length + ' watched</dd></div>' +
          '</dl>' +
        '</section>' +
        (l.res ? '<section class="ukPanel" style="margin-top:16px">' +
          '<div class="ukPanel_head"><h3 class="ukPanel_title">Resources</h3></div>' +
          '<button class="ukAcadRes" type="button" data-goto="' + esc(l.res.go) + '">' +
            '<span class="ukAcadRes_ic" aria-hidden="true">' + CLIP_ICON + '</span>' +
            '<span class="ukAcadRes_b"><span class="ukAcadRes_t">' + esc(l.res.t) + '</span>' +
            '<span class="ukAcadRes_s">' + esc(l.res.s) + '</span></span>' +
            '<span class="ukAcadRes_go" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none">' +
              '<path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" ' +
              'stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
          '</button>' +
        '</section>' : '') +
      '</div>' +
      '<aside class="ukPanel ukSticky ukAcadCurric">' +
        '<div class="ukAcadCurric_top"><span>My progress</span><span>' + doneTotal + '/' + all.length + '</span></div>' +
        '<h3 class="ukPanel_title" style="margin-bottom:6px">Course content</h3>' +
        mods.map(function (mod) {
          var lessons = all.filter(function (x) { return x.mod === mod; });
          var modDone = lessons.filter(function (x) { return x.done; }).length;
          var open = !!st.curricOpen[mod];
          return '<div class="ukAcadCurric_grp' + (open ? ' is-open' : '') + '">' +
            '<button class="ukAcadCurric_modBtn" type="button" data-curric-toggle="' + esc(mod) + '" ' +
              'aria-expanded="' + open + '">' + CHEV_DOWN +
              '<span class="ukAcadCurric_modT">' + esc(mod) + '</span>' +
              '<span class="ukAcadCurric_modN">' + modDone + '/' + lessons.length + '</span></button>' +
            (open ? '<ul class="ukAcadCurric_l">' + lessons.map(function (x) {
              return '<li class="' + (x.id === l.id ? 'is-now' : '') + (x.done ? ' is-done' : '') + '">' +
                '<button type="button" data-lesson="' + x.id + '" aria-current="' + (x.id === l.id) + '">' +
                  '<span class="ukAcadCurric_tick" aria-hidden="true">' + (x.done ? LESSON_CHECK : '') + '</span>' +
                  '<span class="ukAcadCurric_t">' + esc(x.t) + '</span>' +
                  '<span class="ukAcadCurric_len">' + x.len + '</span>' +
                '</button></li>';
            }).join('') + '</ul>' : '') +
          '</div>';
        }).join('') +
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
        '<div class="ukHero_cta"><button class="ukBtn" type="button" data-goto="stays">Find your next stay</button>' +
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
          tab === 'payout'   ? aPayout(st) : aPlan()
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
  /* Where booking commissions, creative fees and referral commissions all land
     once they clear — see Earnings for the three streams themselves. This is
     the destination, not the plumbing: no payout run actually reads these
     fields yet.
     // PLUG-IN POINT — real payouts. A live integration (Stripe Connect,
     // PayPal Payouts, or similar) needs: identity/tax verification per
     // payment method before the first payout, a payout schedule and minimum
     // threshold, and a webhook back into ukattrib.js / ukcreativefee.js /
     // ukreferral.js to flip each stream's "approved" money to "paid" once a
     // transfer actually clears — the same transition markPaid() in each
     // of those modules stands in for today. */
  function aPayout(st) {
    var METHODS = ['Bank transfer', 'PayPal'];
    var method = (st && st.pay) || METHODS[0];
    return '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">Payout details</h3></div>' +
      '<p class="ukAsk">Where your booking commissions, creative fees and membership referrals get paid out to, ' +
        'once each clears. Real transfers are not switched on yet — saving here just holds your details ready.</p>' +
      '<p class="ukField_l">Payout method</p><div class="ukChoice">' + METHODS.map(function (m) {
        return '<button class="ukPick' + (method === m ? ' is-on' : '') + '" type="button" ' +
          'data-pay="' + esc(m) + '">' + esc(m) + '</button>';
      }).join('') + '</div>' +
      (method === 'PayPal'
        ? field('PayPal email', 'amara@amaratravels.com', '', 'email')
        : field('Account name', 'Amara Mensah') + field('IBAN', 'PT50 0002 0123 1234 5678 9015 4') +
          field('Country', 'Portugal')) +
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
    home:home, collabs:collabs, stays:stays, profile:profile,
    kit:kit, academy:academy, community:community, member:member, account:account,
    empty:empty, media:m, pic:pic, head:head, track:track, paginate:paginate,
    /* the shared stay card as this side dresses it, so the dashboard, Pitch Pilot
       and the mood boards all show the one card rather than three near-misses */
    stayCard:stayCard
  };
})();
