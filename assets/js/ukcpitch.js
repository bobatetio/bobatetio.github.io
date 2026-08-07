/* Ukreate — Pitch Pilot.

   WHAT WAS WRONG WITH THE OLD ONE, because the shape of this file is a direct
   answer to it:

   It was built as a catalogue when the job is a pipeline. Two tabs — "Find
   hotels" and "Pitch tracker" — that knew nothing about each other, so five
   hotels the creator had already pitched were still being offered as fresh
   leads, two of them already BOOKED. Twenty-two near-identical cards with no
   starting point, ranked by a score that is 8 or higher on nineteen of them.
   Four of the five style filters matched no stay at all. The one part that
   claimed to be intelligence — "angles that would land" — was three hardcoded
   strings repeated on every card. And the pitch itself, the whole point of the
   feature, opened inside a 340px grid cell as an uneditable block of text, after
   a full page repaint that scrolled it out of view.

   THE SHAPE NOW: one list, four states, one page.

     To pitch → Waiting → Replied → Booked

   A hotel is in exactly one of them, so a hotel you have pitched cannot be
   offered to you again, and the tracker is not a separate place — it is the same
   list further along. What needs doing today sits above it, because the real
   question a creator opens this with is "what do I do now", not "show me
   hotels". Writing takes over the page, in the same two-column shape the
   collaboration thread uses, and the letter is editable and kept.

   Everything the page claims is derived from the stay in front of it. Where
   there is nothing real to say, it says nothing rather than filling the space. */
window.UKCP = (function () {
  var D = window.UKC;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) {
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; }); };

  /* ================= state =================
     Drafts live here, keyed by stay, so leaving a letter and coming back to it
     does not lose it. The old build re-generated the text on every open and
     threw away anything you had changed — which you could not do anyway. */
  var drafts = {};
  var openId = null;          /* the stay being written to, if any */
  var openKind = 'first';     /* 'first' letter or 'nudge' follow-up */

  /* ================= how long ago =================
     The seeded pitches carry a day and a month and no year, so there is nothing
     to measure "today" against. Rather than invent a date, the most recent pitch
     is taken as six days old and the rest are measured back from it — the
     spacing between them is real, which is all the follow-up rule needs. */
  var MON = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 };
  function dayNum(on) {
    var m = String(on || '').match(/(\d{1,2})\s+([A-Za-z]{3})/);
    if (!m) return null;
    return MON[m[2]] * 31 + Number(m[1]);
  }
  var NEWEST = (function () {
    var ns = (D.pitches || []).map(function (p) { return dayNum(p.on); }).filter(function (n) { return n !== null; });
    return ns.length ? Math.max.apply(null, ns) : 0;
  })();
  function daysAgo(p) {
    var n = dayNum(p.on);
    return n === null ? 0 : (NEWEST - n) + 6;
  }
  var NUDGE_AFTER = 7;        /* one follow-up, after a week. Two is pushing it. */

  /* ================= the one list =================
     A stay and a pitch are the same subject at different points, so they are
     joined here once and every view reads the result. */
  /* A stay's state comes from an APPLICATION to that stay — applications are
     stay-specific, and that is the whole point of them. Keying on the hotel
     NAME instead meant one pitch to a property marked every stay that property
     offers: MiraGrace has thirteen, so a single answered pitch put all thirteen
     in the same lane. */
  function rows() {
    var A = window.UKAPPLY;
    return (D.stays || []).map(function (s) {
      var ap = A && A.all().filter(function (x) {
        return x.stay === s.id && x.creator === A.ME && x.state !== 'withdrawn';
      })[0];
      var state = !ap ? 'to'
                : ap.state === 'approved' ? 'booked'
                : ap.state === 'passed'   ? 'to'      /* a no frees it to try again later */
                : 'waiting';
      var p = ap ? { id: ap.id, on: ap.at, via: 'Ukreate', note: '', nudged: ap.nudged,
                     status: ap.state === 'approved' ? 'Booked' : 'Sent' } : null;
      return { stay: s, pitch: p, state: state,
               days: p ? daysAgo(p) : 0,
               due: !!p && state === 'waiting' && daysAgo(p) >= NUDGE_AFTER && !p.nudged };
    });
  }

  /* Pitches are property-level: a creator wrote to a hotel, not to one of its
     stays, and often to a property with nothing published at all. Each is its
     own row rather than being smeared across that property's listings. */
  function loose() {
    return (D.pitches || []).map(function (p) {
      var state = p.converted ? 'booked'
                : p.status === 'Responded' ? 'replied' : 'waiting';
      return { stay: null, pitch: p, state: state,
               days: daysAgo(p),
               due: !p.converted && p.status === 'Sent' && daysAgo(p) >= NUDGE_AFTER && !p.nudged };
    });
  }
  function all() { return rows().concat(loose()); }

  var LANES = [
    { id:'to',      t:'To pitch' },
    { id:'waiting', t:'Waiting' },
    { id:'replied', t:'Replied' },
    { id:'booked',  t:'Became collabs' }
  ];

  /* ================= what to say =================
     Derived from the stay in front of you: what the property is, what the stay
     actually includes, and what they have asked to be made. The old build showed
     the same three lines on all twenty-two hotels, which is worse than showing
     nothing — it taught you the research was not real. */
  function angles(s) {
    var out = [];
    var inc = String(s.inc || '').split(',').map(function (x) { return x.trim(); }).filter(Boolean);
    /* the room is always the first thing anyone wants to see */
    if (s.room) out.push('The ' + String(s.room).toLowerCase() + ', first light');
    /* anything the stay throws in beyond the room is the part guests do not
       already have footage of */
    inc.slice(1).forEach(function (x) {
      var t = x.toLowerCase();
      if (/breakfast|meal|dinner|menu|tasting/.test(t)) out.push('Breakfast, properly shot');
      else if (/spa|hammam|treatment|massage/.test(t)) out.push('The ' + t + ', slow and quiet');
      else if (/trip|tour|excursion|cenote|dive|safari/.test(t)) out.push('The ' + t + ', start to finish');
      else out.push(x.charAt(0).toUpperCase() + x.slice(1));
    });
    /* and what they have actually asked for shapes the last one */
    var wantsVideo = (s.del || []).some(function (d) { return /video|reel/i.test(d.t); });
    out.push(wantsVideo ? 'A walk through, no voiceover' : 'The view they never photograph');
    return out.filter(function (v, i, a) { return v && a.indexOf(v) === i; }).slice(0, 3);
  }

  /* the fit, said in words. The number is on the card; a hotel is not a mark
     out of ten and nineteen of twenty-two scoring 8+ never told anyone anything */
  function why(s) {
    if (s.why) return s.why;
    return D.fitNote(s);
  }

  /* What one row says that the row under it does not. Sixteen of the stays ask
     for the same "1 ugc video, 4 photos", so printing the deliverables on every
     line made three quarters of the list identical — the same failure as the old
     hardcoded angles. What genuinely varies is the length, the kind of property
     and the money behind it, and that is what a row carries. The deliverables
     live in the composer, next to the letter, where they change what you write. */
  function tradeLine(s) {
    return [s.nights + ' night' + (String(s.nights) === '1' ? '' : 's'), s.style, s.budget]
      .filter(Boolean).join(' · ');
  }

  /* ================= letters ================= */
  function firstLetter(s) {
    var give = (s.del || []).map(function (d) { return d.q + ' ' + d.t.toLowerCase(); }).join(' and ');
    return 'Hi ' + s.hotel + ' team,\n\n' +
      'I am a travel creator shooting ' + String(D.me.niche).toLowerCase() + ', and ' + s.hotel +
      ' has been on my list for a while.\n\n' +
      'I would like to propose a hosted stay: ' + s.nights + ' night' + (String(s.nights) === '1' ? '' : 's') +
      ', and in return you get ' + give + ' — yours to keep and post on your own channels, however you like.\n\n' +
      'I shoot, edit and deliver on my own, within ten days of checking out. Happy to send recent work if it is useful.\n\n' +
      'Would this be worth a short conversation?\n\n' + D.me.n + '\n' + D.me.h;
  }
  function nudgeLetter(s, p) {
    return 'Hi ' + s.hotel + ' team,\n\n' +
      'Following up on my note from ' + p.on + ' about a hosted stay — I know inboxes get away from all of us.\n\n' +
      'The offer stands: ' + s.nights + ' night' + (String(s.nights) === '1' ? '' : 's') +
      ' in exchange for content you keep and use on your own channels.\n\n' +
      'If it is not the right time, a no is genuinely useful and I will stop taking up your inbox.\n\n' +
      D.me.n;
  }
  var TONES = [
    { k:'warm',   t:'Warm' },
    { k:'short',  t:'Short' },
    { k:'story',  t:'Story' }
  ];
  function letterFor(s, p, kind, tone) {
    if (kind === 'nudge') return nudgeLetter(s, p);
    if (tone === 'short') {
      return 'Hi ' + s.hotel + ' team,\n\nQuick one. I am a travel creator shooting ' +
        String(D.me.niche).toLowerCase() + '. ' + s.nights + ' night' + (String(s.nights) === '1' ? '' : 's') +
        ' hosted, and you get ' + (s.del || []).map(function (d) { return d.q + ' ' + d.t.toLowerCase(); }).join(' and ') +
        ' to keep and post.\n\nWorth a short reply?\n\n' + D.me.n;
    }
    if (tone === 'story') {
      var a = angles(s)[0] || 'the early morning, before anyone is up';
      return 'Hi,\n\nI have been putting together a series on ' + String(s.city).split(',')[0] +
        ', and ' + s.hotel + ' keeps coming up. The shot I keep returning to is ' +
        String(a).toLowerCase() + '.\n\nI would love to come and make it: a hosted stay of ' + s.nights +
        ' night' + (String(s.nights) === '1' ? '' : 's') + ', and the work is yours to keep.\n\n' + D.me.n;
    }
    return firstLetter(s);
  }

  /* ================= the page ================= */
  function pitch(st) {
    if (openId) return composer(st);

    var list = all();
    var lane = LANES.some(function (l) { return l.id === st.lane; }) ? st.lane : 'to';
    var due = list.filter(function (r) { return r.due; });
    var toAnswer = list.filter(function (r) { return r.state === 'replied'; });

    var counts = {};
    LANES.forEach(function (l) {
      counts[l.id] = list.filter(function (r) { return r.state === l.id; }).length;
    });

    var q = String(st.q || '').toLowerCase();
    var fs = st.fstyle || 'Any style', fb = st.fbudget || 'Any budget';
    var shown = list.filter(function (r) {
      if (r.state !== lane) return false;
      var s = r.stay;
      var name = (s ? s.hotel + ' ' + s.city + ' ' + s.style : r.pitch.hotel + ' ' + r.pitch.city).toLowerCase();
      if (q && name.indexOf(q) < 0) return false;
      if (fs !== 'Any style' && (!s || s.style !== fs)) return false;
      if (fb !== 'Any budget' && (!s || s.budget !== fb)) return false;
      return true;
    });
    /* the ones most worth writing to first, then the ones waiting longest */
    shown.sort(function (a, b) {
      if (lane === 'to') return (b.stay ? D.scoreFor(b.stay) : 0) - (a.stay ? D.scoreFor(a.stay) : 0);
      return b.days - a.days;
    });

    /* Seventeen at once is the overwhelm this tool exists to remove. The best
       eight are the shortlist; the rest are one press away for anyone who wants
       to work through them. Only "to pitch" is capped — the other lanes are a
       record, and a record you cannot see all of is not one. */
    var CAP = 8;
    var capped = lane === 'to' && !st.showAll && shown.length > CAP;
    var visible = capped ? shown.slice(0, CAP) : shown;

    return UKCV.head('Pitch Pilot',
      'The outbound half of your work: who is worth writing to, what you have sent, and who owes ' +
      'you an answer. The moment one says yes it becomes a collaboration and moves to Your collabs.') +
      todayStrip(due, toAnswer, counts) +
      lanes(lane, counts) +
      bar(st, fs, fb, shown.length, lane) +
      (shown.length
        ? '<div class="ukPanel ukPitchList"><ul class="ukPL">' +
            visible.map(function (r) { return row(r, lane); }).join('') + '</ul>' +
            (capped
              ? '<button class="ukGhost ukPL_more" type="button" data-ppf="showAll" data-ppv="1">' +
                'Show the other ' + (shown.length - CAP) + '</button>'
              : '') +
          '</div>'
        : emptyLane(lane, st));
  }

  /* ---- the only thing above the list that is not the list ----
     Shown when something is genuinely due. When nothing is, it says so in one
     line rather than manufacturing a task. */
  function todayStrip(due, toAnswer, counts) {
    if (!due.length && !toAnswer.length) {
      return '<div class="ukToday ukToday--calm"><p class="ukToday_t">Nothing is waiting on you.</p>' +
        '<p class="ukToday_p">' + counts.waiting + ' pitch' + (counts.waiting === 1 ? ' is' : 'es are') +
        ' still out and none are old enough to chase. A good moment to send a new one.</p></div>';
    }
    /* One panel, not two gold slabs competing. Answering a hotel that has
       already replied beats chasing one that has not, so that is the item with
       the button; the nudge sits under it in the same block. */
    var items = [];
    if (toAnswer.length) items.push({
      n: toAnswer.length,
      t: toAnswer.length === 1 ? 'A hotel replied' : toAnswer.length + ' hotels replied',
      p: 'Answer these before you send anything new.',
      lane: 'replied', cta: 'See them'
    });
    if (due.length) items.push({
      n: due.length,
      t: due.length === 1 ? 'One pitch is due a nudge' : due.length + ' pitches are due a nudge',
      p: 'Sent over a week ago with no reply. One follow-up roughly doubles the chance of an ' +
         'answer, and two is pushing it.',
      lane: 'waiting', cta: 'See them'
    });

    return '<div class="ukToday"><p class="ukToday_h">Before you send anything new</p>' +
      items.map(function (it, i) {
        return '<div class="ukToday_i"><span class="ukToday_n">' + it.n + '</span>' +
          '<span class="ukToday_b"><span class="ukToday_t">' + it.t + '</span>' +
          '<span class="ukToday_p">' + it.p + '</span></span>' +
          '<button class="' + (i ? 'ukGhost' : 'ukBtn') + '" type="button" data-lane="' + it.lane + '">' +
          it.cta + '</button></div>';
      }).join('') + '</div>';
  }

  function lanes(lane, counts) {
    return '<div class="ukFilters ukFilters--tabs ukPLanes" role="tablist" aria-label="Where your pitches stand">' +
      LANES.map(function (l) {
        var on = l.id === lane;
        return '<button class="ukFilter' + (on ? ' is-on' : '') + '" type="button" role="tab" ' +
          'aria-selected="' + on + '" data-lane="' + l.id + '">' +
          '<span class="ukFilter_lb">' + l.t + '</span>' +
          (counts[l.id] ? '<span class="ukFilter_ct">' + counts[l.id] + '</span>' : '') + '</button>';
      }).join('') + '</div>';
  }

  /* ---- narrowers, built from the stays that actually exist ----
     The old list offered Boutique, Luxury, Eco lodge and City hotel, none of
     which matched a single stay: four of five options could only ever return
     nothing. */
  function opts(key) {
    var seen = {};
    (D.stays || []).forEach(function (s) { if (s[key]) seen[s[key]] = 1; });
    return Object.keys(seen).sort();
  }
  var CHEV = '<svg class="ukDrop_car" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  function drop(label, none, list, val, key) {
    return '<div class="ukDrop"><button class="ukDrop_b" type="button" data-drop-toggle ' +
      'aria-haspopup="menu" aria-expanded="false">' +
      '<span class="ukDrop_k">' + esc(label) + '</span>' +
      '<span class="ukDrop_v">' + esc(val) + '</span>' + CHEV + '</button>' +
      '<div class="ukDropMenu" hidden role="menu">' +
        [none].concat(list).map(function (o) {
          return '<button class="ukDropMenu_i' + (o === val ? ' is-sel' : '') + '" role="menuitem" ' +
            'data-ppf="' + esc(key) + '" data-ppv="' + esc(o) + '">' + esc(o) + '</button>';
        }).join('') + '</div></div>';
  }
  function bar(st, fs, fb, n, lane) {
    var narrowed = fs !== 'Any style' || fb !== 'Any budget' || st.q;
    return '<div class="ukToolbar ukToolbar--split ukCrBar">' +
        '<div class="ukCrBar_l">' +
          '<label class="ukSearch"><span data-icon="search"></span>' +
          '<input type="search" placeholder="Search a hotel or a city" value="' + esc(st.q || '') +
          '" data-q aria-label="Search"></label>' +
          '<span class="ukCrBar_gap" aria-hidden="true"></span>' +
          drop('Kind of stay', 'Any style', opts('style'), fs, 'fstyle') +
          drop('Budget', 'Any budget', opts('budget'), fb, 'fbudget') +
          (narrowed ? '<button class="ukGhost ukGhost--sm" type="button" data-clearpp>Clear</button>' : '') +
        '</div>' +
        '<span class="ukCount">' + n + ' ' + (lane === 'to' ? 'to write to' : 'here') + '</span>' +
      '</div>';
  }

  /* ---- a row, not a card ----
     Twenty-two cards is a wall. A row is scannable, and the thing that matters
     on it — what you do next — sits in the same place on every one. */
  function row(r, lane) {
    var s = r.stay, p = r.pitch;
    var name = s ? s.hotel : p.hotel;
    var place = s ? s.city : (p.city || '');
    var free = !D.me.member;
    var locked = free && D.me.freePitchUsed && lane === 'to';

    var right =
      lane === 'to'
        ? '<button class="ukBtn ukPL_go" type="button" data-write="' + esc(s.id) + '">' +
            (locked ? 'See the draft' : 'Write the pitch') + '</button>'
      : lane === 'waiting'
        /* A nudge is written FROM the stay — its nights, its inclusions. A pitch
           logged against a hotel that is not on the roster has no stay behind it,
           so there is nothing to write from and offering the button would have
           been a control that quietly did nothing. It still needs to be moved
           along, so it gets the status controls instead. */
        ? (r.due && s
            ? '<button class="ukBtn ukPL_go" type="button" data-nudge="' + esc(p.id) + '">Send a nudge</button>'
            : s
              ? '<span class="ukPL_wait">' + r.days + ' days out</span>'
              : '<div class="ukPL_set">' +
                  '<button class="ukGhost ukGhost--sm" type="button" data-setst="' + esc(p.id) + '|Responded">They replied</button>' +
                  '<button class="ukGhost ukGhost--sm" type="button" data-setst="' + esc(p.id) + '|Passed">They passed</button>' +
                '</div>')
      : lane === 'replied'
        ? '<div class="ukPL_set">' +
            '<button class="ukBtn ukPL_go" type="button" data-setst="' + esc(p.id) + '|Booked">It is booked</button>' +
            '<button class="ukGhost ukGhost--sm" type="button" data-setst="' + esc(p.id) + '|Passed">They passed</button>' +
          '</div>'
        /* Booked is not a state this page owns. The moment a hotel says yes the
         relationship stops being a pitch and becomes a collaboration, which
         lives in Your collabs with its own lifecycle. Leaving it here as a
         status meant the same hotel sat in two places with two answers —
         Fjordheim was "Complete" in one and "Responded" in the other. So this
         lane is a receipt, and the only thing it offers is the way across. */
      : '<button class="ukGhost ukPL_go" type="button" data-goto="collabs">Open the collab</button>';

    var meta =
      lane === 'to' ? esc(tradeLine(s))
      : lane === 'booked'
        ? 'They said yes \u2014 this is a collaboration now, and it is tracked in Your collabs.'
      : (p.via ? esc(p.via) + ' · ' : '') + 'sent ' + esc(p.on) +
        (r.state === 'waiting' ? ' · no reply yet' : '') +
        (p.note ? ' · ' + esc(p.note) : '');

    return '<li class="ukPL_i' + (r.due ? ' is-due' : '') + '">' +
      (s ? UKCV.pic(s.img, name, '1x1', 'ukM--sm') : '<span class="ukPL_ph" aria-hidden="true"></span>') +
      '<span class="ukPL_b">' +
        '<span class="ukPL_top">' +
          '<span class="ukPL_n">' + esc(name) + '</span>' +
          (place ? '<span class="ukPL_c">' + esc(place) + '</span>' : '') +
          (lane === 'to' && s ? '<span class="ukPL_fit">' + D.scoreFor(s) + '/10 fit</span>' : '') +
          (r.due ? '<span class="ukTag ukTag--wait">Due a nudge</span>' : '') +
        '</span>' +
        '<span class="ukPL_m">' + meta + '</span>' +
        (lane === 'to' ? '<span class="ukPL_w">' + esc(why(s)) + '</span>' : '') +
      '</span>' +
      '<span class="ukPL_r">' + right + '</span>' +
    '</li>';
  }

  function emptyLane(lane, st) {
    var M = {
      to:      ['Nothing left to write to',
                'Every hotel that fits you has been pitched. Loosen the filters, or come back — new stays land most weeks.'],
      waiting: ['Nothing is out right now', 'Anything you send shows up here until they answer.'],
      replied: ['No replies waiting', 'When a hotel comes back to you, it lands here first.'],
      booked:  ['Nothing has converted yet',
                'When a hotel says yes, the pitch stops being a pitch. It moves to Your collabs, ' +
                'and a receipt for it appears here.']
    }[lane];
    return UKCV.empty(M[0], M[1],
      lane === 'to'
        ? '<button class="ukGhost" type="button" data-clearpp>Clear the filters</button>'
        : '<button class="ukBtn" type="button" data-lane="to">Find someone to pitch</button>');
  }

  /* ================= the composer =================
     Full width, and the same two-column shape as a collaboration thread: the
     thing you are writing on the left, who you are writing to on the right. The
     old build put this in a grid cell 340px wide. */
  function composer(st) {
    var s = D.stay(openId);
    if (!s) { openId = null; return pitch(st); }
    var p = (D.pitches || []).filter(function (x) { return x.hotel === s.hotel; })[0];
    var kind = openKind;
    var tone = st.tone || 'warm';
    var key = kind + ':' + s.id + ':' + (kind === 'nudge' ? 'x' : tone);
    if (drafts[key] === undefined) drafts[key] = letterFor(s, p, kind, tone);
    var free = !D.me.member;
    var locked = free && D.me.freePitchUsed && !(p && kind === 'nudge');

    return UKCV.head(kind === 'nudge' ? 'Follow up with ' + s.hotel : 'Write to ' + s.hotel,
      kind === 'nudge'
        ? 'Short, warm, and it gives them an easy way out. That is what gets answered.'
        : 'Change anything you like. It is kept as you type, so you can leave it and come back.') +
      '<div class="ukGrid ukGrid--thread">' +
        '<section class="ukPanel ukWrite">' +
          (kind === 'nudge' ? '' :
            '<div class="ukTones" role="group" aria-label="Tone">' + TONES.map(function (t) {
              return '<button class="ukTone' + (t.k === tone ? ' is-on' : '') + '" type="button" ' +
                'data-ptone="' + t.k + '">' + t.t + '</button>';
            }).join('') + '</div>') +
          '<label class="ukField ukWrite_f"><span class="ukSrOnly">Your pitch</span>' +
            '<textarea class="ukField_i ukWrite_ta" data-draft="' + esc(key) + '" ' +
            'aria-label="Your pitch">' + esc(drafts[key]) + '</textarea></label>' +
          '<div class="ukWrite_act">' +
            '<button class="ukBtn" type="button" data-copydraft="' + esc(key) + '">Copy it</button>' +
            (kind === 'nudge'
              ? '<button class="ukGhost" type="button" data-sentnudge="' + esc(p.id) + '">I sent the nudge</button>'
              : '<button class="ukGhost" type="button" data-sent="' + esc(s.id) + '">I sent it</button>') +
            '<button class="ukGhost" type="button" data-closewrite>Back to the list</button>' +
          '</div>' +
          (locked
            ? '<div class="ukSeam"><p class="ukSeam_t">That was your free one.</p>' +
              '<p class="ukSeam_p">Verified members get this on every hotel: three tones, the contact that ' +
              'actually reads it, and the follow-up written for you. A dollar a day.</p>' +
              '<button class="ukBtn" type="button" data-goto="member">See what verified gets you</button></div>'
            : '') +
        '</section>' +

        '<aside class="ukSideCol">' +
          window.UKSTAY.hotelCard(s, {
            eager: true,
            tag: '<span class="ukScore2">' + D.scoreFor(s) + '<em>/10</em></span>',
            foot: '<p class="ukCard_sub">' + esc(why(s)) + '</p>'
          }) +
          '<section class="ukPanel"><div class="ukPanel_head">' +
            '<h3 class="ukPanel_title">What they are offering</h3></div>' +
            '<dl class="ukFacts ukFacts--stack">' +
              '<div><dt>The stay</dt><dd>' + s.nights + ' nights, ' + esc(String(s.room).toLowerCase()) + '</dd></div>' +
              '<div><dt>Included</dt><dd>' + esc(s.inc) + '</dd></div>' +
              '<div><dt>They want</dt><dd>' + esc((s.del || []).map(function (d) {
                return d.q + ' × ' + d.t.toLowerCase(); }).join(', ')) + '</dd></div>' +
            '</dl>' +
          '</section>' +
          '<section class="ukPanel"><div class="ukPanel_head">' +
            '<h3 class="ukPanel_title">Angles that fit this one</h3></div>' +
            '<p class="ukAsk">Read off what this stay actually includes, not a general list.</p>' +
            '<div class="ukChips">' + angles(s).map(function (a) {
              return '<span class="ukChip">' + esc(a) + '</span>'; }).join('') + '</div>' +
          '</section>' +
          '<section class="ukPanel"><div class="ukPanel_head">' +
            '<h3 class="ukPanel_title">When to send it</h3></div>' +
            '<ul class="ukTips">' +
              '<li><strong>Tuesday or Wednesday morning</strong>, their time. Monday inboxes are a graveyard.</li>' +
              '<li><strong>Follow up once, after a week.</strong> Pitch Pilot will tell you when.</li>' +
              '<li><strong>Email beats a DM here</strong> — this one has a real marketing contact.</li>' +
            '</ul>' +
          '</section>' +
        '</aside>' +
      '</div>';
  }

  /* ================= events ================= */
  function go() { return window.UKCGO('pitch'); }

  document.addEventListener('click', function (e) {
    var root = document.querySelector('[data-ukc]');
    if (!root) return;
    var el;

    if ((el = e.target.closest('[data-write]'))) {
      openId = el.dataset.write; openKind = 'first';
      return go();
    }
    if ((el = e.target.closest('[data-nudge]'))) {
      var np = (D.pitches || []).filter(function (x) { return x.id === el.dataset.nudge; })[0];
      var ns = np && (D.stays || []).filter(function (x) { return x.hotel === np.hotel; })[0];
      if (!ns) return;
      openId = ns.id; openKind = 'nudge';
      return go();
    }
    if (e.target.closest('[data-closewrite]')) { openId = null; return go(); }

    if ((el = e.target.closest('[data-ptone]'))) {
      var stt = (window.UKCSTATE && window.UKCSTATE('pitch')) || null;
      if (stt) stt.tone = el.dataset.ptone;
      return go();
    }

    if ((el = e.target.closest('[data-copydraft]'))) {
      var k = el.dataset.copydraft;
      if (navigator.clipboard) navigator.clipboard.writeText(drafts[k] || '');
      el.textContent = 'Copied';
      setTimeout(function () { el.textContent = 'Copy it'; }, 1500);
      return;
    }

    /* Sending is what spends the free pitch — not opening a draft. The old build
       burned it the moment you clicked a card, so you could lose it by looking. */
    if ((el = e.target.closest('[data-sent]'))) {
      var ss = D.stay(el.dataset.sent);
      if (!ss) return;
      if (!D.me.member) D.me.freePitchUsed = true;
      D.addPitch({ hotel: ss.hotel, city: ss.city, on: 'today', via: 'Email', status: 'Sent', note: '' });
      /* the pitch actually ARRIVES: it used to be recorded only in the creator's
         own tracker, so the hotel had no way to see it */
      if (window.UKPITCHIN && ss.hotel === window.UKPITCHIN.PROPERTY) {
        window.UKPITCHIN.send({
          to: ss.hotel, from: 'c1', fromName: D.me.n,
          angle: angles(ss)[0] || ss.style,
          offer: (ss.del || []).map(function (d) { return d.q + ' ' + d.t.toLowerCase(); }).join(', '),
          asks: ss.nights + ' nights, ' + String(ss.inc || '').toLowerCase(),
          note: 'I shoot ' + String(D.me.niche).toLowerCase() + ' and deliver within ten days of checkout.'
        });
      }
      openId = null;
      return go();
    }
    if ((el = e.target.closest('[data-sentnudge]'))) {
      var pn = (D.pitches || []).filter(function (x) { return x.id === el.dataset.sentnudge; })[0];
      if (pn) { pn.nudged = true; pn.note = 'Followed up once.'; }
      openId = null;
      return go();
    }

    if ((el = e.target.closest('[data-setst]'))) {
      var parts = el.dataset.setst.split('|');
      var sp = (D.pitches || []).filter(function (x) { return x.id === parts[0]; })[0];
      if (!sp) return;
      if (parts[1] === 'Passed') {
        /* a no is a no: it leaves the pipeline rather than sitting in it forever */
        D.pitches.splice(D.pitches.indexOf(sp), 1);
      } else {
        sp.status = parts[1];
      }
      return go();
    }

    if ((el = e.target.closest('[data-lane]'))) {
      var s2 = (window.UKCSTATE && window.UKCSTATE('pitch')) || null;
      if (s2) { s2.lane = el.dataset.lane; s2.q = ''; s2.showAll = 0; }
      openId = null;
      return go();
    }
    if (e.target.closest('[data-clearpp]')) {
      var s4 = (window.UKCSTATE && window.UKCSTATE('pitch')) || null;
      if (s4) { s4.q = ''; s4.fstyle = 'Any style'; s4.fbudget = 'Any budget'; s4.showAll = 0; }
      return go();
    }
  });

  /* the letter is kept as it is typed, so leaving the page does not lose it */
  document.addEventListener('input', function (e) {
    var ta = e.target.closest && e.target.closest('[data-draft]');
    if (ta) drafts[ta.dataset.draft] = ta.value;
  });

  return { pitch: pitch };
})();
