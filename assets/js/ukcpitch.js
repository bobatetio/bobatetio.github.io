/* Ukreate — the pipeline behind the Stays page.

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
   list further along.

   AND THAT PAGE IS NOW "Stays". This file used to render one of its own, beside
   Discover, and the two rendered the SAME D.stays list. A stay's home changed
   silently the moment you pitched it, which is the one reliable way to make
   people lose track of things. Worse, each page had its own composer writing to
   a different record: this one called D.addPitch (property-level) while the
   lanes read UKAPPLY (stay-specific), so pressing "I sent it" left the stay in
   To pitch AND put a row in Waiting. Casa Azul Tulum sat in both at once — the
   exact failure described at the top of this file, back again one stage earlier
   because the fix had been applied to the lanes and not to the door into them.

   So there is one composer, it writes UKAPPLY, and this file no longer owns a
   page. It owns the pipeline: the rows, the lanes, the letters and the composer.
   ukcviews.stays() renders them. What needs doing today sits above it, because the real
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
  /* The month has to BE a month. "3 days ago" matched this regex as day "3" and
     month "day", so MON['day'] was undefined, undefined * 31 was NaN, and dayNum
     returned NaN rather than null. NaN passed the "not null" filter below, and
     one NaN in Math.max makes the whole answer NaN — so NEWEST was NaN, every
     pitch's age was NaN, every "days >= 7" was false, and no pitch has ever been
     due a nudge. The strip could still say two were, because it counts rows with
     due:true and there were none to count. */
  function dayNum(on) {
    var m = String(on || '').match(/(\d{1,2})\s+([A-Za-z]{3})/);
    if (!m || MON[m[2]] === undefined) return null;
    return MON[m[2]] * 31 + Number(m[1]);
  }
  /* Computed on demand, not at load. D.pitches is populated by ukcdata.js, and a
     value frozen at module-init would be whatever the list was before it filled. */
  function newest() {
    var ns = (D.pitches || []).map(function (p) { return dayNum(p.on); })
      .filter(function (n) { return n !== null && !isNaN(n); });
    return ns.length ? Math.max.apply(null, ns) : 0;
  }
  function daysAgo(p) {
    var n = dayNum(p.on);
    if (n !== null) return (newest() - n) + 6;
    /* A relative date is already the answer: "3 days ago" is three days ago. */
    var rel = String(p.on || '').match(/(\d+)\s+day/);
    return rel ? Number(rel[1]) : 0;
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
      /* A nudge is written FROM a stay: its nights and its inclusions are what
         the follow-up restates. `stay` stays null here on purpose, because that
         is what decides which LANE this row is in and a property-level pitch is
         not one of the property's stays. But if the property does have one
         published, that is what the letter is written from, so it is carried
         separately.

         Without this the nudge button could never appear: row() offered it on
         `r.due && r.stay`, and r.stay was null on every row this function makes.
         The strip above the list would say two pitches were due a nudge and the
         lane it sent you to had no way to send one. */
      var from = (D.stays || []).filter(function (x) { return x.hotel === p.hotel; })[0] || null;
      return { stay: null, from: from, pitch: p, state: state,
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
      ', and in return you get ' + give + '. All of it is yours to keep and post on your own ' +
      'channels, however you like.\n\n' +
      'I shoot, edit and deliver on my own, within ten days of checking out. Happy to send recent work if it is useful.\n\n' +
      'Would this be worth a short conversation?\n\n' + D.me.n + '\n' + D.me.h;
  }
  function nudgeLetter(s, p) {
    return 'Hi ' + s.hotel + ' team,\n\n' +
      'Following up on my note from ' + p.on + ' about a hosted stay. I know inboxes get away ' +
      'from all of us.\n\n' +
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

  /* ================= the parts the Stays page renders =================
     No page function any more. ukcviews.stays() owns the page; this hands it the
     lane rail, the rows for a lane, the strip of what is due, and the composer. */
  function counts() {
    var list = all(), out = {};
    LANES.forEach(function (l) {
      out[l.id] = list.filter(function (r) { return r.state === l.id; }).length;
    });
    return out;
  }
  /* Has anything happened yet? The rail does not exist until it would hold
     something: a creator who has sent nothing should meet a page of stays, not
     four empty lanes explaining a pipeline they have not started. */
  function started() {
    var c = counts();
    return (c.waiting + c.replied + c.booked) > 0;
  }
  /* The stays not yet pitched, which is what the browse lane shows. */
  function unpitched() {
    return rows().filter(function (r) { return r.state === 'to'; })
                 .map(function (r) { return r.stay; });
  }
  function laneRows(lane, st) {
    var list = all();
    var q = String(st.q || '').toLowerCase();
    var shown = list.filter(function (r) {
      if (r.state !== lane) return false;
      var s = r.stay;
      var name = (s ? s.hotel + ' ' + s.city + ' ' + s.style : r.pitch.hotel + ' ' + r.pitch.city).toLowerCase();
      return !q || name.indexOf(q) > -1;
    });
    shown.sort(function (a, b) { return b.days - a.days; });
    return shown;
  }
  function laneList(lane, st) {
    var shown = laneRows(lane, st);
    return shown.length
      ? '<div class="ukPanel ukPitchList"><ul class="ukPL">' +
          shown.map(function (r) { return row(r, lane); }).join('') + '</ul></div>'
      : emptyLane(lane, st);
  }
  function dueStrip() {
    var list = all();
    return todayStrip(list.filter(function (r) { return r.due; }),
                      list.filter(function (r) { return r.state === 'replied'; }),
                      counts());
  }
  function writing() { return openId; }
  function write(id, kind) { openId = id; openKind = kind || 'first'; }
  function close() { openId = null; }

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
        /* A pitch logged against a hotel with nothing published has no stay to
           write a follow-up from, so offering the button would be a control that
           quietly did nothing. It still needs moving along, so it gets the status
           controls instead. */
        ? (r.due && (s || r.from)
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
      /* The note is an annotation ("follow up on the 13th"), not the pitch. One
         seeded row carried the whole letter in it and printed it across two
         lines while every other row was one, which is what a row is for. The
         letter lives in the composer; anything long enough to be one is not a
         note and is left off. */
      : (p.via ? esc(p.via) + ' · ' : '') + 'sent ' + esc(p.on) +
        (r.state === 'waiting' ? ' · no reply yet' : '') +
        (p.note && String(p.note).length <= 60 ? ' · ' + esc(p.note) : '');

    return '<li class="ukPL_i' + (r.due ? ' is-due' : '') + '">' +
      /* A pitch made to a property with nothing published has no photograph to
         show, and four empty grey squares in a column read as a loading state
         that never finishes. The initial is not decoration: it is the only
         thing about the hotel we actually hold. */
      (s ? UKCV.pic(s.img, name, '1x1', 'ukM--sm')
         : '<span class="ukPL_ph" aria-hidden="true">' +
           esc(String(name || '?').trim().charAt(0).toUpperCase()) + '</span>') +
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
     THE HOTEL'S SHAPE, because the hotel portal is the reference. Its inbound
     pitch thread is the same page from the other side: a status badge saying
     whose move it is, then ukGrid--thread with ukFlow on the left carrying a
     ukPanel_head, a ukPitchIn--row of the three facts of the trade, and a
     ukComposer whose secondary actions sit left and whose send sits right. The
     subject of it all is a stay card in ukSideCol.

     What was here instead: a bare textarea with no panel head, custom tone pills
     that existed nowhere else, and three same-weight buttons in a row with
     "Copy it" as the primary. Nothing about it said which of the three actually
     sent the pitch, and the answer was none of them until this file started
     writing UKAPPLY. */
  function composer(st) {
    var s = D.stay(openId);
    if (!s) { openId = null; return ''; }   /* the page repaints without it */
    var p = (D.pitches || []).filter(function (x) { return x.hotel === s.hotel; })[0];
    var kind = openKind;
    var tone = st.tone || 'warm';
    var key = kind + ':' + s.id + ':' + (kind === 'nudge' ? 'x' : tone);
    if (drafts[key] === undefined) drafts[key] = letterFor(s, p, kind, tone);
    var free = !D.me.member;
    var locked = free && D.me.freePitchUsed && !(p && kind === 'nudge');
    /* A follow-up needs the pitch it follows. Without one there is nothing to
       follow up on, so it is a first letter. */
    var nudge = kind === 'nudge' && !!p;
    var goes = (D.me.work || []).slice(0, 3);

    return '<button class="ukBack" type="button" data-writeclose>&larr; Back to stays</button>' +
      UKCV.head(nudge ? 'Follow up with ' + esc(s.hotel) : 'Write to ' + esc(s.hotel),
        nudge
          ? 'Short, warm, and it gives them an easy way out. That is what gets answered.'
          : 'Change anything you like. It is kept as you type, so you can leave it and come back.') +

      /* Whose move it is, in the hotel's own badge. Before it is sent the move is
         obviously yours; once it is out, this is the only line that says how long
         they have had it. */
      (nudge && p
        ? '<div class="ukStatusBadge" role="status">' +
            '<span class="ukStatusBadge_lb">Waiting on them</span>' +
            '<span class="ukStatusBadge_s">Sent ' + esc(p.on) + ', ' + daysAgo(p) + ' days out</span>' +
          '</div>'
        : '') +

      '<div class="ukGrid ukGrid--thread"><section class="ukFlow">' +
        '<section class="ukPanel ukFlowThread">' +
          '<div class="ukPanel_head">' +
            '<h3 class="ukPanel_title">' + (nudge ? 'Your follow-up' : 'Your pitch') + '</h3>' +
            (nudge ? '' :
              /* the hotel's segmented control, not a set of pills invented here */
              '<div class="ukSeg" role="group" aria-label="Tone">' + TONES.map(function (t) {
                var on = t.k === tone;
                return '<button class="ukSeg_b' + (on ? ' is-on' : '') + '" type="button" ' +
                  'aria-pressed="' + on + '" data-ptone="' + t.k + '">' + t.t + '</button>';
              }).join('') + '</div>') +
          '</div>' +

          /* The three facts of the trade, on one row, the way the hotel states
             the same three from its side. They used to sit in a panel on the
             right called "What they are offering", which put the terms of the
             deal further from the sentence describing them than the tips were. */
          '<dl class="ukPitchIn ukPitchIn--row">' +
            '<div><dt>You are asking for</dt><dd>' + s.nights + ' night' +
              (String(s.nights) === '1' ? '' : 's') + ', ' + esc(String(s.room || s.rooms || '').toLowerCase()) + '</dd></div>' +
            '<div><dt>You would deliver</dt><dd>' + esc((s.del || []).map(function (d) {
              return d.q + ' × ' + d.t.toLowerCase(); }).join(', ')) + '</dd></div>' +
            '<div><dt>Included</dt><dd>' + esc(s.inc) + '</dd></div>' +
          '</dl>' +

          '<section class="ukComposer">' +
            '<label class="ukSrOnly" for="ukWriteTa">' +
              (nudge ? 'Your follow-up to ' : 'Your pitch to ') + esc(s.hotel) + '</label>' +
            '<textarea id="ukWriteTa" class="ukWrite_ta" data-draft="' + esc(key) + '" ' +
              'data-grow>' + esc(drafts[key]) + '</textarea>' +
          /* Under the letter, because it goes WITH the letter. On the right it read
             as a note about the pitch rather than part of it, and it left the
             left column one panel deep against four. */
          (goes.length
            ? '<section class="ukWriteWork"><div class="ukWriteWork_h">' +
                '<p class="ukWriteWork_t">What goes with it</p>' +
                '<span class="ukCount">' + goes.length +
                  (goes.length === 1 ? ' piece' : ' pieces') + '</span></div>' +
                '<div class="ukReels ukReels--sm">' + goes.map(function (w) {
                  return '<figure class="ukReel">' + UKCV.pic(
                    ((D.MEDIA && D.MEDIA[w.m]) || {}).src || '', w.t, '9x16') + '</figure>';
                }).join('') + '</div>' +
                '<p class="ukWhy">Your most-watched work is attached automatically. This is the ' +
                'part that lands.</p></section>'
            : '') +
            '<div class="ukComposer_row">' +
              '<div class="ukComposer_actions">' +
                '<button class="ukGhost ukGhost--sm" type="button" data-copydraft="' + esc(key) + '">Copy it</button>' +
                '<p class="ukHint">' + (nudge
                  ? 'One follow-up is worth it. Two is pushing it.'
                  : 'It reaches ' + esc(s.hotel) + ' as an application, with your recent work attached.') +
                '</p>' +
              '</div>' +
              '<div class="ukComposer_send">' +
                (nudge
                  ? '<button class="ukBtn" type="button" data-sentnudge="' + esc(p.id) + '">Send the follow-up</button>'
                  : '<button class="ukBtn" type="button" data-sent="' + esc(s.id) + '">Send this pitch</button>') +
              '</div>' +
            '</div>' +
          '</section>' +

          (locked
            ? '<div class="ukSeam"><p class="ukSeam_t">That was your free one.</p>' +
              '<p class="ukSeam_p">Verified members get this on every hotel: three tones, the contact that ' +
              'actually reads it, and the follow-up written for you. A dollar a day.</p>' +
              '<button class="ukBtn" type="button" data-goto="member">See what verified gets you</button></div>'
            : '') +
        '</section>' +
      '</section>' +

      '<aside class="ukSideCol">' +
        window.UKSTAY.hotelCard(s, {
          eager: true,
          tag: '<span class="ukScore2">' + D.scoreFor(s) + '<em>/10</em></span>',
          foot: '<p class="ukCard_sub">' + esc(why(s)) + '</p>'
        }) +
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
            '<li><strong>Follow up once, after a week.</strong> You will be told when.</li>' +
            '<li><strong>Email beats a DM here</strong>, and this one has a real marketing contact.</li>' +
          '</ul>' +
        '</section>' +
      '</aside>' +
    '</div>';
  }

  /* ================= events ================= */
  function go() { return window.UKCGO('stays'); }

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
      var stt = (window.UKCSTATE && window.UKCSTATE('stays')) || null;
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
      /* UKAPPLY, because that is what the lanes read. This used to write
         D.addPitch, which is property-level and belongs to pitches made to a
         hotel with nothing published: a different record, answering a different
         question. Sending therefore never moved the stay out of To pitch, and
         added a second row in Waiting for the same hotel. The application is
         also what reaches the hotel, so this is the send actually arriving. */
      var draftKey = 'first:' + ss.id + ':';
      var text = drafts[draftKey + 'warm'] || drafts[draftKey + 'short'] ||
                 drafts[draftKey + 'story'] || firstLetter(ss);
      if (window.UKAPPLY) {
        window.UKAPPLY.send({
          stay: ss.id, creatorName: D.me.n, creatorHandle: D.me.h,
          creatorImg: D.me.img, creatorCity: D.me.city || '',
          creatorReach: D.me.band || null, msg: text, at: 'just now'
        });
      }
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
      var s2 = (window.UKCSTATE && window.UKCSTATE('stays')) || null;
      if (s2) { s2.lane = el.dataset.lane; s2.q = ''; s2.showAll = 0; }
      openId = null;
      return go();
    }
    if (e.target.closest('[data-writeclose]')) { openId = null; return go(); }
    if (e.target.closest('[data-clearpp]')) {
      var s4 = (window.UKCSTATE && window.UKCSTATE('stays')) || null;
      if (s4) { s4.q = ''; s4.fstyle = 'Any style'; s4.fbudget = 'Any budget'; s4.showAll = 0; }
      return go();
    }
  });

  /* the letter is kept as it is typed, so leaving the page does not lose it */
  document.addEventListener('input', function (e) {
    var ta = e.target.closest && e.target.closest('[data-draft]');
    if (!ta) return;
    drafts[ta.dataset.draft] = ta.value;
    grow(ta);
  });

  /* A letter is not a scrolling field. The box was a fixed height and the last
     two lines of every draft sat below the fold of it, cut through the middle of
     a line, which reads as broken rather than as scrollable. It takes the height
     of what is in it. */
  function grow(ta) {
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = ta.scrollHeight + 'px';
  }
  window.UKCGROW = function (root) {
    (root || document).querySelectorAll('[data-grow]').forEach(grow);
  };

  return {
    /* the pipeline, for the one page that renders it */
    LANES: LANES, counts: counts, started: started, unpitched: unpitched,
    laneRows: laneRows, laneList: laneList, dueStrip: dueStrip, lanes: lanes,
    emptyLane: emptyLane, scoreOf: function (s) { return D.scoreFor(s); },
    /* the composer */
    composer: composer, writing: writing, write: write, close: close
  };
})();
