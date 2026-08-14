/* Ukreate — creator home. Loaded after ukcviews.js and replaces its home renderer.
   Same bento language as the hotel dashboard so the product reads as one thing, but
   every number, label and line is in creator voice: the work leads, the follower
   count never does, and a quiet week is never framed as a failure. */
(function () {
  var D = window.UKC, V = window.UKCV, CH = window.UKCHART;
  if (!D || !V || !CH) return;

  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) {
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; }); };
  var ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';

  /* Checked m.video, a property no media record has ever had (the manifest
     marks a video with kind:'video') — so this never once matched, and the
     fallback it did draw was a plain text triangle standing in for the real
     play mark ukcviews.js already has as an actual icon. Same condition, same
     icon, now. */
  function media(key, alt, ratio, cls, eager) {
    var m = D.media(key);
    return '<span class="ukM ukM--' + (ratio || '9x16') + (cls ? ' ' + cls : '') + '">' +
      '<img src="' + m.src + '" alt="' + esc(alt) + '"' + (eager ? '' : ' loading="lazy" decoding="async"') + '>' +
      (m.kind === 'video'
        ? '<svg class="ukM_play" viewBox="0 0 44 44" aria-hidden="true"><path fill-rule="evenodd" ' +
          'clip-rule="evenodd" d="M22 0C9.85 0 0 9.85 0 22s9.85 22 22 22 22-9.85 22-22S34.15 0 22 0Z' +
          'M17.6 16.8Q17.6 13.2 20.6 15.2L27.8 20Q30.8 22 27.8 24L20.6 28.8Q17.6 30.8 17.6 27.2L17.6 16.8Z"/></svg>'
        : '') + '</span>';
  }
  function pic(src, alt, ratio, cls, eager) {
    return '<span class="ukM ukM--' + (ratio || '16x9') + (cls ? ' ' + cls : '') + '">' +
      '<img src="' + src + '" alt="' + esc(alt) + '"' + (eager ? '' : ' loading="lazy" decoding="async"') + '></span>';
  }

  function kpi(o) {
    return '<article class="ukK' + (o.hero ? ' ukK--hero' : '') + ' c3">' +
      '<p class="ukK_l">' + esc(o.l) + '</p>' +
      '<p class="ukK_v">' + o.v + '</p>' +
      '<p class="ukK_n">' + (o.d ? '<span class="ukK_d' + (o.down ? ' is-down' : '') + '">' +
        (o.down ? '&#9662;' : '&#9652;') + ' ' + esc(o.d) + '</span>' : '') +
        '<span>' + esc(o.n) + '</span></p>' +
      '<button class="ukK_go" type="button" data-goto="' + o.go + '" aria-label="Open ' + esc(o.l) + '">' +
      ARROW + '</button></article>';
  }

  /* A bento row built from two cards that each gate on their own data can't
     just hardcode widths that sum to 12 — either one can come back empty on
     a thin account, leaving a bare half-width row. Call each at its normal
     width first; if only one rendered, call it again at c12 instead of
     shipping a hole in the grid. */
  function pairRow(a, aw, b, bw) {
    var ah = a(aw), bh = b(bw);
    if (ah && bh) return '<div class="ukBento">' + ah + bh + '</div>';
    if (ah) return '<div class="ukBento">' + a('c12') + '</div>';
    if (bh) return '<div class="ukBento">' + b('c12') + '</div>';
    return '';
  }

  /* ================= more readings, all off real records =================
     Every chart below is derived from something the account already holds — the
     work, the pitches, the collaborations, the attributed bookings. Nothing here
     is a placeholder shape: if the record behind one is empty the card says so
     rather than drawing a pretty line through nothing. */

  /* where the audience actually is. Followers are per platform and the total is
     the number a hotel is buying, so the split is the useful form of it. */
  /* Where they publish — the same card the hotel sees on a creator profile, not
     a second design of the same fact. Each platform is its own tile in its own
     brand tint, because a follower count on Instagram and one on TikTok are two
     different audiences, and a stacked bar was quietly presenting them as slices
     of one. The total still leads, because the total is what a hotel buys. */
  function reachCard(w) {
    var pl = (D.me.plats || []).filter(function (p) { return p.f; });
    if (!pl.length) return '';
    var marks = {};
    ((window.UKVOCAB || {}).PLATFORMS || []).forEach(function (p) { marks[p.k] = p.s; });
    /* the brand tints already in use on the hotel side's creator profile */
    var TINT = { ig:'#fdf1f6', tt:'#f2f2f4', yt:'#fdf0f0', fb:'#eff4fd', x:'#f3f4f6',
                 sc:'#fffbe8', li:'#eef4fa', pi:'#fdf0f1' };
    var UNIT = { yt:'Subscribers' };
    var total = pl.reduce(function (a, p) { return a + p.f; }, 0);

    return '<section class="ukCard ' + (w || 'c5') + '"><div class="ukCard_h">' +
        '<h3 class="ukCard_t">Where you publish</h3>' +
        '<span class="ukCount">' + D.fmt(total) + ' across ' + pl.length + '</span></div>' +
        '<div class="ukSoc">' + pl.map(function (p) {
          return '<article class="ukSoc_c" style="--soc:' + (TINT[p.k] || '#f4f4f5') + '">' +
            '<div class="ukSoc_top">' +
              (marks[p.k] ? '<img class="ukSoc_i" src="' + marks[p.k] + '" alt="" width="26" height="26" ' +
                'loading="lazy" decoding="async">' : '') +
              '<span class="ukSoc_id"><span class="ukSoc_h">' + esc(D.me.h) + '</span>' +
                '<span class="ukSoc_p">' + esc(p.n) + '</span></span>' +
            '</div>' +
            '<p class="ukSoc_k">' + (UNIT[p.k] || 'Followers') + '</p>' +
            '<p class="ukSoc_v">' + D.fmt(p.f) + '</p>' +
          '</article>';
        }).join('') + '</div>' +
      '</section>';
  }

  /* what the work did. Plays per piece, newest first, so the shape reads as a
     run of form rather than a leaderboard. */
  function playsCard() {
    var w = (D.me.work || []).slice(0, 6);
    if (w.length < 2) return '';
    return '<section class="ukCard c8"><div class="ukCard_h">' +
        '<h3 class="ukCard_t">How each piece performed</h3>' +
        '<button class="ukCard_more" type="button" data-goto="kit">Media kit</button></div>' +
        '<p class="ukCard_sub">Plays on everything you have delivered, newest first. This is the number ' +
        'a hotel is actually reading.</p>' +
        CH.capsules({ data: w.map(function (x, i) {
          return { k:x.t.split(',')[0], v:x.plays, hi:i === 0 }; }), unit:'plays', label:'Plays by piece' }) +
      '</section>';
  }

  /* Saves matter more than plays for a hotel: a save is somebody keeping the
     place for later, which is the closest thing to intent this data has. */
  function savesCard(cw) {
    var w = (D.me.work || []).filter(function (x) { return x.plays; });
    if (!w.length) return '';
    var plays = w.reduce(function (a, x) { return a + x.plays; }, 0);
    var saves = w.reduce(function (a, x) { return a + (x.saves || 0); }, 0);
    var per = Math.round(saves / plays * 1000);
    return '<section class="ukCard ' + (cw || 'c4') + '"><div class="ukCard_h">' +
        '<h3 class="ukCard_t">How often it gets saved</h3></div>' +
        CH.ring({ pct: Math.min(100, per / 60 * 100), center: per, sub: 'saves per 1,000 plays',
                  label:'Save rate' }) +
        '<p class="ukCard_sub" style="margin:16px 0 0;text-align:center">' + D.fmt(saves) +
        ' saves across ' + D.fmt(plays) + ' plays. A save is somebody keeping the place for later.</p>' +
      '</section>';
  }

  /* the collaborations, by how far along they are */
  /* One bar and a key is a short card, and at a third of the width the bar had
     nowhere to go — four stages squeezed into a strip with a hole underneath it.
     The width is passed in so each row it appears in adds up. */
  function pipelineCard(w) {
    var st = (D.collabs || []).reduce(function (a, c) { a[c.stage] = (a[c.stage] || 0) + 1; return a; }, {});
    var segs = (D.STAGES || []).map(function (x, i) {
      return { l: x.short || x.t, v: st[i] || 0 };
    }).filter(function (x) { return x.v; });
    if (segs.length < 2) return '';
    return '<section class="ukCard ' + (w || 'c7') + '"><div class="ukCard_h">' +
        '<h3 class="ukCard_t">Where your collabs stand</h3>' +
        '<button class="ukCard_more" type="button" data-goto="collabs">Open them</button></div>' +
        '<p class="ukCard_sub">Every live collaboration, by how far along it is. Anything sitting in ' +
        'one stage for a while is usually waiting on somebody — sometimes you.</p>' +
        CH.segbar({ segs: segs, unit:'collabs', label:'Collaborations by stage' }) +
      '</section>';
  }

  /* the bookings the creator's own links actually drove, by where they posted */
  function channelCard(w) {
    var A = window.UKATTRIB;
    if (!A) return '';
    var rows = A.byKey('channel', A.forCreator('c1')).filter(function (r) { return r.confirmed.count; });
    if (rows.length < 2) return '';
    return '<section class="ukCard ' + (w || 'c7') + '"><div class="ukCard_h">' +
        '<h3 class="ukCard_t">Which channel actually books rooms</h3>' +
        '<button class="ukCard_more" type="button" data-goto="earn">Earnings</button></div>' +
        '<p class="ukCard_sub">Confirmed bookings traced back to where you posted. Reach is not the same ' +
        'as rooms sold, and this is the difference.</p>' +
        CH.capsules({ data: rows.map(function (r, i) {
          return { k:r.channelName, v:r.confirmed.count, hi:i === 0 }; }),
          unit:'bookings', label:'Confirmed bookings by channel' }) +
      '</section>';
  }

  /* What it has been worth, as a RUNNING TOTAL.

     Per-month value was booked-stays-per-month multiplied by a constant, which
     is the stays line again at a different scale — the same chart twice. A
     cumulative curve only ever rises, answers a different question ("where am I
     up to"), and is the shape this number is actually read in. */
  function valueCard(w) {
    var mo = D.earnings.months || [];
    var stays = mo.reduce(function (a, r) { return a + r.booked; }, 0);
    if (!stays) return '';
    var per = Math.round(D.earnings.value / stays);
    var run = 0;
    /* Real context, not a second "earned" number: what you would have paid
       for these rooms is worth knowing, but it is not money in your
       account, and sitting it beside the actual income above is what makes
       that distinction legible rather than something the page has to argue
       for. */
    return '<section class="ukCard ' + (w || 'c8') + '"><div class="ukCard_h">' +
        '<h3 class="ukCard_t">What your stays were worth, running total</h3>' +
        '<button class="ukCard_more" type="button" data-goto="collabs">Your stays</button></div>' +
        '<p class="ukCard_sub">The value of the rooms, not money in your account — every stay added up as ' +
        'it landed, at the rooms’ own rates, about ' + D.money(per) + ' a stay.</p>' +
        CH.area({ data: mo.map(function (r, i, a) {
          run += r.booked * per;
          return { k:r.m, v:run, hi:i === a.length - 1 }; }),
          unit:'in stay value', label:'Value of stays, running total' }) +
      '</section>';
  }

  /* ---- 1. WHERE THE WORK HAS BEEN MADE ----
     The reference: a dotted world map, one large total, and the places it is
     made of ranked underneath with their flags. Ours is the same idea on the
     product's own globe, and the places are the cities this creator has
     actually shot in — read off completed collaborations, then the stays they
     pitched into, so it is a record rather than a wish list. */
  /* ---- 4. WHAT YOU ACTUALLY MAKE ----
     The reference's stacked bar over a small table: proportions at a glance,
     numbers underneath, neither doing both jobs badly. */
  function formatsCard() {
    var w = (D.me.work || []);
    if (!w.length) return '';
    /* by the format the piece actually is, not by whether it moves. "Video" and
       "Photography" were the technical fact; Reels, B-roll and Carousels are
       what a hotel is buying and what the creator picked in onboarding. */
    var by = {};
    w.forEach(function (x) {
      var k = x.fmt || (((D.media(x.m) || {}).kind === 'video') ? 'Video' : 'Photos');
      by[k] = by[k] || { plays:0, saves:0, n:0 };
      by[k].plays += (x.plays || 0);
      by[k].saves += (x.saves || 0);
      by[k].n += 1;
    });
    var rows = Object.keys(by).map(function (k) {
      return { k:k, v:by[k].plays, show:D.fmt(by[k].plays), n:by[k].n };
    }).sort(function (a, b) { return b.v - a.v; });
    if (rows.length < 2) return '';
    var total = rows.reduce(function (a, r) { return a + r.v; }, 0);
    var pieces = w.length;
    return '<section class="ukCard c5"><div class="ukCard_h">' +
        '<h3 class="ukCard_t">What you actually make</h3>' +
        '<button class="ukCard_more" type="button" data-goto="profile">Your work</button></div>' +
        CH.split({ data: rows, total: D.fmt(total),
                   totalSub: 'plays across ' + pieces + ' pieces, in ' + rows.length + ' formats',
                   nameCol: 'Format', valCol: 'Plays', label: 'Plays by format' }) +
      '</section>';
  }

  /* ---- the dashboard's real job: what needs you, and what to pitch next ----
     Stats moved out entirely — Earnings already carries them, and repeating
     them here was a growth report standing in front of the door. What is
     actually useful every morning is the two questions this answers: which
     open collab is waiting on me, and which stay is worth pitching next. */
  function projectRow(c) {
    var s = D.stay(c.stay);
    var late = D.isOverdue && D.isOverdue(c);
    var mine = D.collabMine(c);
    var tone = late ? 'late' : c.stage === 4 ? 'done' : mine ? 'you' : 'wait';
    var label = late ? 'Overdue' : c.stage === 4 ? 'Done' : mine ? 'Your move' : 'With your host';
    return '<li data-open-collab="' + c.id + '" tabindex="0" role="button" ' +
      'aria-label="Open your collab with ' + esc(s.hotel) + '">' + pic(s.img, s.hotel, '4x3', 'ukM--sm') +
      '<span class="ukRow_b"><span class="ukRow_n">' + esc(s.hotel) + '</span>' +
      '<span class="ukRow_m">' + esc(D.collabSay(c)) + '</span></span>' +
      '<span class="ukTag ukTag--' + tone + '">' + esc(label) + '</span></li>';
  }

  function projectsCard(active, overdue, needsMe) {
    if (!active.length) {
      return '<section class="ukCard c7"><div class="ukCard_h">' +
          '<h3 class="ukCard_t">Your projects</h3></div>' +
          '<p class="ukCard_sub">Everything is with the hotels right now. That is the normal shape of it, ' +
          'and a good moment to get a couple more pitches out.</p>' +
          '<button class="ukGhost" type="button" data-goto="stays" style="width:100%;margin-top:auto">Find a stay to pitch</button>' +
        '</section>';
    }
    /* overdue leads, then whatever is genuinely sitting on you, then the rest —
       with anything already wrapped up sinking to the very bottom of that rest.
       needsMe is a superset of overdue (an overdue Creating collab is still
       "your move" too), so it gets deduped against overdue here rather than
       double-listing the same three collabs. */
    var needsMeOnly = needsMe.filter(function (c) { return overdue.indexOf(c) < 0; });
    var rest = active.filter(function (c) { return overdue.indexOf(c) < 0 && needsMe.indexOf(c) < 0; });
    rest.sort(function (a, b) { return (a.stage === 4 ? 1 : 0) - (b.stage === 4 ? 1 : 0); });
    /* capped to the same count Recommended for you shows — matched row styles
       plus a matched row count is what actually lands the two cards on the
       same height, not just an outer box stretched to fake it */
    var ranked = overdue.concat(needsMeOnly, rest).slice(0, 6);
    return '<section class="ukCard c7"><div class="ukCard_h">' +
        '<h3 class="ukCard_t">Your projects</h3>' +
        '<button class="ukCard_more" type="button" data-goto="collabs">See all</button></div>' +
        '<p class="ukCard_sub">' +
          (overdue.length ? overdue.length + (overdue.length === 1 ? ' collab is' : ' collabs are') +
              ' running behind — those come first below.'
            : needsMe.length ? needsMe.length + (needsMe.length === 1 ? ' collab needs' : ' collabs need') + ' you.'
            : 'Nothing needs you right now. Everything below is with a host.') + '</p>' +
        '<ul class="ukRow">' + ranked.map(projectRow).join('') + '</ul>' +
      '</section>';
  }

  /* Same .ukRow row the projects list uses — not the bigger photo card this
     used to be. Your projects and Recommended for you sit side by side and
     have to read as one height, never one taller than the other; a big photo
     card next to a compact row never lands on the same height by accident,
     matching row styles does. */
  function recRow(s) {
    return '<li data-hotel="' + s.id + '" tabindex="0" role="button" ' +
      'aria-label="See ' + esc(s.hotel) + '">' + pic(s.img, s.hotel, '4x3', 'ukM--sm') +
      '<span class="ukRow_b"><span class="ukRow_n">' + esc(s.hotel) + '</span>' +
      '<span class="ukRow_m">' + esc(s.style) + ' · ' +
        (window.ukFlagFor ? window.ukFlagFor(s.city) : '') + esc(s.city) + '</span></span>' +
      '<span class="ukScore2 ukScore2--flat">' + D.scoreFor(s) + '<em>/10</em></span>' +
      '<button class="ukGhost ukGhost--sm" type="button" data-apply="' + s.id + '">Pitch</button>' +
    '</li>';
  }

  function recsCard(picks) {
    if (!picks.length) return '';
    return '<section class="ukCard c5"><div class="ukCard_h">' +
        '<h3 class="ukCard_t">Recommended for you</h3>' +
        '<button class="ukCard_more" type="button" data-goto="stays">Browse stays</button></div>' +
        '<p class="ukCard_sub">Matched to what you shoot and host, none already pitched.</p>' +
        '<ul class="ukRow">' + picks.map(recRow).join('') + '</ul>' +
      '</section>';
  }

  /* Same shape as the hotel side's setupLine: while setup is unfinished the
     greeting's line is about setup, because nothing else on the page is a
     real reading yet on a brand-new account. */
  function setupLine(left) {
    var first = String(left[0].t).charAt(0).toLowerCase() + String(left[0].t).slice(1);
    var ing = first.replace(/^save\b/, 'saving').replace(/^send\b/, 'sending');
    if (left.length === 1) return 'One thing left to finish setting up: ' + esc(ing) + '.';
    return 'A couple of things left to finish setting up. Start by ' + esc(ing) + '.';
  }

  function home() {
    var active   = D.collabs.filter(function (c) { return c.stage >= 1; });
    var overdue  = active.filter(function (c) { return D.isOverdue && D.isOverdue(c); });
    var needsMe  = active.filter(function (c) { return D.collabMine(c); });
    var pitched  = {};
    D.pitches.forEach(function (p) { pitched[p.hotel] = true; });
    var picks    = D.stays.filter(function (s) { return !pitched[s.hotel]; })
      .sort(function (a, b) { return D.scoreFor(b) - D.scoreFor(a); }).slice(0, 6);
    var pipeline = pipelineCard('c12');
    /* The greeting comes first, then the checklist under it — the hotel side's
       order. A checklist above the greeting opened the page on a list of
       chores from an account nobody had said hello to yet. */
    var setup    = window.UKONBOARD ? window.UKONBOARD.tasks('creator') : [];
    var leftToDo = setup.filter(function (t) { return !t.done; });

    return '<div class="ukDashTop"><div>' +
        '<h2 class="ukDashTop_h">Morning, ' + esc(D.me.n.split(' ')[0]) + '.</h2>' +
        '<p class="ukDashTop_p">' + (leftToDo.length
          ? setupLine(leftToDo)
          : (overdue.length ? overdue.length + (overdue.length === 1 ? ' collab is' : ' collabs are') +
              ' running behind, and worth a look first.'
            : needsMe.length ? needsMe.length + (needsMe.length === 1 ? ' collab needs' : ' collabs need') + ' you today.'
            : active.length ? 'Nothing needs you right now, so it is a good day to pitch.'
            : 'Nothing is out yet. Pick a stay you like and we will write the first pitch with you.')) +
        '</p></div>' +
        '</div>' +

      (window.UKONBOARD ? window.UKONBOARD.checklist('creator') : '') +

      '<div class="ukBento">' +
        kpi({ l:'Needs you today', v:needsMe.length, n:needsMe.length ? 'across your open collabs' : 'all clear for now', go:'collabs' }) +
        kpi({ l:'Overdue', v:overdue.length, n:overdue.length ? 'past the brief deadline' : 'nothing running late', go:'collabs' }) +
        kpi({ l:'Open projects', v:active.length, n:active.length ? 'from onboarding to sign-off' : 'nothing open yet', go:'collabs' }) +
        kpi({ l:'Recommended', v:picks.length, n:'stays worth pitching', go:'stays' }) +
      '</div>' +

      '<div class="ukBento">' +
        projectsCard(active, overdue, needsMe) +
        recsCard(picks) +
      '</div>' +

      (pipeline ? '<div class="ukBento">' + pipeline + '</div>' : '');
  }

  /* ---------------- Earnings, same language as home ----------------
     Restructured around one spine: money first, reconciled, then the
     performance that explains it — rather than a pile of charts in the
     order they happened to be built. See earnSection() for the two-block
     divider and moneyTotals() for the honest total both blocks read from. */
  function earnSection(t, p) {
    return '<div class="ukEarnSec"><h3 class="ukEarnSec_h">' + t + '</h3>' +
      '<p class="ukEarnSec_p">' + p + '</p></div>';
  }

  function earn() {
    var e = D.earnings;
    var booked = D.pitches.filter(function (p) { return p.status === 'Booked'; }).length;
    var rate = D.pitches.length ? Math.round(booked / D.pitches.length * 100) : 0;
    var months = e.months.map(function (r, i, arr) {
      return { k:r.m, v:r.pitches, hi:i === arr.length - 1 };
    });
    var money = moneyTotals();

    return '<div class="ukDashTop"><div>' +
        '<h2 class="ukDashTop_h">Earnings and growth</h2>' +
        '<p class="ukDashTop_p">What you have actually made, then what is driving it.</p></div>' +
        '<div class="ukDashTop_act">' +
          '<button class="ukBtn" type="button" data-goto="pitch">Send another pitch</button>' +
        '</div></div>' +

      /* ============ money, reconciled, first ============
         The hero used to be "What that was worth" — the value of free
         rooms, not money — with the real earned figure buried a screen down
         inside its own card. Two big numbers on one page that do not
         reconcile is a trust problem, so the hero is the actual total now,
         "still confirming" sits right beside it instead of hiding inside a
         chart, and stay VALUE — real, just not income — stays in this
         block as the clearly-labelled context it is rather than the
         headline. */
      earnSection('Your money', 'Everything you have actually earned, across every stream — reconciled, not scattered.') +
      '<div class="ukBento">' +
        kpi({ l:'Earned so far', v:D.money(money.realized), n:'paid out or approved', go:'collabs', hero:true }) +
        kpi({ l:'Still confirming', v:D.money(money.pending), n:'on its way, not yet counted', go:'collabs' }) +
        (function () {
          var A = window.UKATTRIB;
          if (!A) return kpi({ l:'Stays landed', v:e.stays, n:'in the last six months', go:'collabs' });
          var t = A.totals(A.forCreator('c1'));
          return kpi({ l:'Room nights you drove', v:t.confirmed.nights,
                       n:'confirmed, across ' + t.confirmed.count + ' bookings', go:'collabs' });
        })() +
        kpi({ l:'What stays were worth', v:D.money(e.value), n:'value received, not money earned', go:'collabs' }) +
      '</div>' +

      (totalCard() ? '<div class="ukBento">' + totalCard() + '</div>' : '') +
      '<div class="ukBento">' + commissionCard() + '</div>' +
      (feeCard() ? '<div class="ukBento">' + feeCard() + '</div>' : '') +
      (referralCard() ? '<div class="ukBento">' + referralCard() + '</div>' : '') +
      '<div class="ukBento">' + valueCard('c12') + '</div>' +

      /* ============ performance, as the explanation ============
         Everything here answers "why", once the money above has already
         answered "what" — pitch volume and conversion, which channel
         actually converts, the work that is carrying it, and the pipeline
         behind what has not landed yet. */
      earnSection('Your growth', 'What is driving those numbers, and what is worth doing more of.') +
      '<div class="ukBento">' +
        /* the same chart the dashboard shows, not a second drawing of one fact */
        '<section class="ukCard c8"><div class="ukCard_h">' +
          '<h3 class="ukCard_t">Pitches against stays</h3>' +
          '<button class="ukCard_more" type="button" data-goto="pitch">Pitch tracker</button></div>' +
          '<p class="ukCard_sub">The line that matters is the volume. More pitches out is the whole game, ' +
            'and even the biggest creators hear no far more often than yes.</p>' +
          CH.area({ data:months, data2:e.months.map(function (r) { return { k:r.m, v:r.booked }; }),
                    unit:'pitches', unit2:'stays', name:'Pitches sent', name2:'Stays landed',
                    max:Math.max.apply(null, months.map(function (r) { return r.v; })),
                    label:'Pitches sent and stays landed by month' }) +
        '</section>' +

        '<section class="ukCard c4"><div class="ukCard_h">' +
          '<h3 class="ukCard_t">How often it lands</h3></div>' +
          CH.ring({ pct:rate, center:rate + '%', sub:'of pitches book', label:'Pitch to booking rate' }) +
          '<p class="ukCard_sub" style="margin:16px 0 0;text-align:center">' + booked + ' stays from ' +
            D.pitches.length + ' pitches sent.</p>' +
        '</section>' +
      '</div>' +

      /* Every one of these is a real record that can come back empty on a
         thin account (no attributed bookings yet, one piece of work posted),
         and each card in the pair checks its OWN data, not its neighbour's —
         so a row can't just hardcode 8+4 and assume both halves showed up.
         Whichever one actually rendered gets the full 12 instead of leaving
         a bare half-empty row. */
      pairRow(channelCard, 'c7', reachCard, 'c5') +

      '<div class="ukBento">' +
        (function () {
          var top = D.me.work.slice().sort(function (a, b) { return b.plays - a.plays; })[0];
          return '<section class="ukCard c12 ukTopVid"><div class="ukCard_h">' +
            '<h3 class="ukCard_t">Top performing video</h3>' +
            '<button class="ukCard_more" type="button" data-goto="kit">Media kit</button></div>' +
            (top
              ? '<div class="ukTopVid_row">' + media(top.m, top.t, '9x16', 'ukTopVid_m', true) +
                '<div class="ukTopVid_b"><p class="ukTopVid_t">' + esc(top.t) + '</p>' +
                '<p class="ukCard_sub" style="margin:6px 0 16px">Your best-watched piece, out of ' + D.me.work.length +
                  ' on your profile.</p>' +
                '<dl class="ukFacts"><div><dt>Plays</dt><dd>' + D.fmt(top.plays) + '</dd></div>' +
                '<div><dt>Saves</dt><dd>' + D.fmt(top.saves) + '</dd></div></dl></div></div>'
              : '<p class="ukCard_sub">Nothing posted yet.</p>');
        })() +
        '</section>' +
      '</div>' +

      pairRow(savesCard, 'c4', pipelineCard, 'c8');
  }

  /* ---- what the bookings you drove are actually worth ----
     Split three ways on purpose. A creator seeing one flat "earned" figure that
     later shrinks is a trust problem, so pending is named as pending from the
     start — framed as money on its way, not money at risk.

     This is now the ONE commission presentation on the page — it used to be
     shown twice, once here in full and once as a smaller "by how sure it is"
     ring further up, saying substantially the same thing in two different
     shapes. This is the richer of the two (it also names what is actually
     converting), so it is the one that stayed; the other was removed rather
     than kept as a second, thinner echo of it. */
  function commissionCard() {
    var A = window.UKATTRIB;
    if (!A) return '';
    var mine = A.forCreator('c1');            // this session's creator
    var t = A.totals(mine);
    var top = A.topPlacement(mine);
    var paid = A.all().filter(function (b) { return b.creator_id === 'c1' && b.state === 'paid'; })
      .reduce(function (a, b) { return a + A.commissionOf(b); }, 0);
    var approved = t.confirmed.commission - paid;

    return '<section class="ukCard c7"><div class="ukCard_h">' +
        '<h3 class="ukCard_t">Commission on the bookings you drove</h3>' +
        '<button class="ukCard_more" type="button" data-goto="collabs">Your stays</button></div>' +
        '<p class="ukCard_sub">You are paid once a guest has actually stayed — not the moment they book. ' +
        'That is why this is in three parts, and why the confirmed number only ever goes up.</p>' +
        '<ul class="ukEarn">' +
          '<li class="ukEarn_i is-paid"><span class="ukEarn_l">Paid out</span>' +
            '<span class="ukEarn_v">' + D.money(paid) + '</span>' +
            '<span class="ukEarn_n">Already in your account.</span></li>' +
          '<li class="ukEarn_i is-ok"><span class="ukEarn_l">Approved</span>' +
            '<span class="ukEarn_v">' + D.money(approved) + '</span>' +
            '<span class="ukEarn_n">Stays happened. Yours, on the next run.</span></li>' +
          '<li class="ukEarn_i is-wait"><span class="ukEarn_l">On its way</span>' +
            '<span class="ukEarn_v">' + D.money(t.pending.commission) + '</span>' +
            '<span class="ukEarn_n">' + t.pending.count + ' booked. Confirms once they check out.</span></li>' +
        '</ul>' +
        '<p class="ukCard_sub" style="margin:14px 0 0">' +
          t.confirmed.count + ' stays confirmed from your links' +
          (t.reversed.count ? ', and ' + t.reversed.count + ' cancelled along the way — normal, and already taken out above.' : '.') +
        '</p>' +
      '</section>' +

      '<section class="ukCard c5"><div class="ukCard_h">' +
        '<h3 class="ukCard_t">What is actually converting</h3></div>' +
        (top
          ? '<p class="ukInk_v" style="color:var(--text)">' + esc(top.placement) + '</p>' +
            '<p class="ukCard_sub">Your best converting placement on ' + esc(top.channelName) + ' — ' +
            top.bookings + ' confirmed bookings and ' + top.nights + ' room nights from it. ' +
            'Worth making more of.</p>'
          : '<p class="ukCard_sub">Nothing has converted yet. It shows up here the moment it does.</p>') +
        '<ul class="ukChan">' + A.byKey('channel', mine).map(function (r) {
          return '<li><span class="ukChan_n">' + esc(r.channelName) + '</span>' +
            '<span class="ukChan_b">' + r.confirmed.count + '</span>' +
            '<span class="ukChan_v">' + D.money(r.confirmed.commission) + '</span></li>';
        }).join('') + '</ul>' +
        '<p class="ukHint" style="margin-top:10px">Confirmed bookings and your share, by where you posted.</p>' +
      '</section>';
  }

  /* ---- stream 2: creative fees ----
     Cash for the work itself. Owed once a hotel approves what was
     delivered, not the moment a fee was agreed — the same "actually
     happened" line the booking-commission stream already draws. */
  function feeCard() {
    var F = window.UKFEE;
    if (!F) return '';
    var t = F.totals(D);
    if (!t.pending.count && !t.approved.count && !t.paid.count) return '';
    return '<section class="ukCard c12"><div class="ukCard_h">' +
        '<h3 class="ukCard_t">Creative fees</h3>' +
        '<button class="ukCard_more" type="button" data-goto="collabs">Your collabs</button></div>' +
        '<p class="ukCard_sub">Cash for the work itself, on top of the stay or on its own for a paid ' +
          'campaign — owed once the hotel approves what you delivered.</p>' +
        '<ul class="ukEarn">' +
          '<li class="ukEarn_i is-paid"><span class="ukEarn_l">Paid out</span>' +
            '<span class="ukEarn_v">' + D.money(t.paid.fee) + '</span>' +
            '<span class="ukEarn_n">Already in your account.</span></li>' +
          '<li class="ukEarn_i is-ok"><span class="ukEarn_l">Approved</span>' +
            '<span class="ukEarn_v">' + D.money(t.approved.fee) + '</span>' +
            '<span class="ukEarn_n">Delivered and approved. Yours, on the next run.</span></li>' +
          '<li class="ukEarn_i is-wait"><span class="ukEarn_l">In progress</span>' +
            '<span class="ukEarn_v">' + D.money(t.pending.fee) + '</span>' +
            '<span class="ukEarn_n">' + t.pending.count + (t.pending.count === 1 ? ' collab' : ' collabs') + ' still being delivered.</span></li>' +
        '</ul>' +
      '</section>';
  }

  /* ---- stream 3: membership referrals ----
     The flywheel: creators already tell other creators about a stay that
     went well, this pays them for it, for as long as whoever they sent
     stays subscribed — not a one-off bounty at signup. */
  function referralCard() {
    var R = window.UKREFER;
    if (!R) return '';
    R.setPrice(D.MEMBER_PRICE);
    var t = R.totals();
    var link = R.link(D.me);
    return '<section class="ukCard c7"><div class="ukCard_h">' +
        '<h3 class="ukCard_t">Membership referrals</h3></div>' +
        '<p class="ukCard_sub">Share your link. Anyone who joins through it and stays subscribed pays you ' +
          R.RATE + '% of their membership, every month they renew.</p>' +
        '<ul class="ukEarn">' +
          '<li class="ukEarn_i is-ok"><span class="ukEarn_l">Confirmed</span>' +
            '<span class="ukEarn_v">' + D.money(t.confirmed.commission) + '</span>' +
            '<span class="ukEarn_n">' + t.confirmed.count + (t.confirmed.count === 1 ? ' month paid' : ' months paid') + '.</span></li>' +
          '<li class="ukEarn_i is-wait"><span class="ukEarn_l">On its way</span>' +
            '<span class="ukEarn_v">' + D.money(t.pending.commission) + '</span>' +
            '<span class="ukEarn_n">This month, not yet confirmed.</span></li>' +
        '</ul>' +
        '<p class="ukCard_sub" style="margin:14px 0 0">' +
          t.referrals + (t.referrals === 1 ? ' creator referred so far.' : ' creators referred so far.') +
        '</p>' +
      '</section>' +

      '<section class="ukCard c5"><div class="ukCard_h"><h3 class="ukCard_t">Your link</h3></div>' +
        '<p class="ukCard_sub">Copy it into your bio or your next email.</p>' +
        '<button class="ukTrackMini_i" type="button" style="width:100%" data-copy="' + esc(link) + '" ' +
          'data-ack="Link copied" aria-label="Copy your referral link">' +
          '<code style="overflow:hidden;text-overflow:ellipsis">' + esc(link) + '</code></button>' +
      '</section>';
  }

  /* ---- the roll-up: three streams, one honest total ----
     Computed once, read by the hero KPI and by the full breakdown card below
     it, so the two can never quietly disagree with each other the way the
     page's own headline number used to disagree with this one. "Earned so
     far" only ever counts what actually happened — a stay that happened,
     work that got approved, a membership month that cleared — never a
     number that could still shrink. Pending stays named as pending, same
     discipline as every card that feeds it. */
  function moneyTotals() {
    var A = window.UKATTRIB, F = window.UKFEE, R = window.UKREFER;
    var bPaid = 0, bApproved = 0, bPending = 0;
    if (A) {
      var mine = A.forCreator('c1'), t = A.totals(mine);
      bPaid = A.all().filter(function (b) { return b.creator_id === 'c1' && b.state === 'paid'; })
        .reduce(function (a, b) { return a + A.commissionOf(b); }, 0);
      bApproved = Math.max(0, t.confirmed.commission - bPaid);
      bPending = t.pending.commission;
    }
    var fPaid = 0, fApproved = 0, fPending = 0;
    if (F) { var ft = F.totals(D); fPaid = ft.paid.fee; fApproved = ft.approved.fee; fPending = ft.pending.fee; }
    var rConfirmed = 0, rPending = 0;
    if (R) { R.setPrice(D.MEMBER_PRICE); var rt = R.totals(); rConfirmed = rt.confirmed.commission; rPending = rt.pending.commission; }

    var streams = [];
    if (A && (bPaid || bApproved || bPending)) streams.push({ l:'Booking commissions', v: bPaid + bApproved + bPending });
    if (F && (fPaid || fApproved || fPending)) streams.push({ l:'Creative fees', v: fPaid + fApproved + fPending });
    if (R && (rConfirmed || rPending)) streams.push({ l:'Membership referrals', v: rConfirmed + rPending });

    return {
      has: !!(A || F || R),
      realized: bPaid + bApproved + fPaid + fApproved + rConfirmed,
      pending: bPending + fPending + rPending,
      streams: streams
    };
  }

  function totalCard() {
    var m = moneyTotals();
    if (!m.has) return '';
    var realized = m.realized, pending = m.pending, streams = m.streams;
    if (!realized && !pending) return '';

    return '<section class="ukCard c12"><div class="ukCard_h">' +
        '<h3 class="ukCard_t">All your income, in one place</h3></div>' +
        '<p class="ukCard_sub">Three different kinds of money, added up. Nothing here is counted twice.</p>' +
        '<dl class="ukFacts" style="margin-bottom:16px">' +
          streams.map(function (s) { return '<div><dt>' + esc(s.l) + '</dt><dd>' + D.money(s.v) + '</dd></div>'; }).join('') +
        '</dl>' +
        '<ul class="ukEarn">' +
          '<li class="ukEarn_i is-ok"><span class="ukEarn_l">Earned so far</span>' +
            '<span class="ukEarn_v">' + D.money(realized) + '</span>' +
            '<span class="ukEarn_n">Paid out or approved, across all three streams.</span></li>' +
          '<li class="ukEarn_i is-wait"><span class="ukEarn_l">On its way</span>' +
            '<span class="ukEarn_v">' + D.money(pending) + '</span>' +
            '<span class="ukEarn_n">Still confirming, across all three.</span></li>' +
        '</ul>' +
      '</section>';
  }

  V.home = home;
  V.earn = earn;
})();
