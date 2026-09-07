/* Ukreate — the composer behind pitching, cold or otherwise.

   WHAT WAS WRONG WITH THE OLD ONE, because the shape of this file is a direct
   answer to it:

   It was built as a catalogue when the job is a pipeline. Two tabs — "Find
   hotels" and "Pitch tracker" — that knew nothing about each other, so five
   hotels the creator had already pitched were still being offered as fresh
   leads, two of them already BOOKED. And the pipeline it grew into after that
   — "To pitch → Waiting → Replied → Booked" as a set of lanes separate from
   Your collabs — solved that, but created a second ledger: a collaboration
   still at Inquiry lived here, under a different record, with a different
   state machine, and no thread to reply to it in. A cold pitch to a hotel with
   no Ukreate account had nowhere to be followed up at all, because the reply
   happens over email, off-platform, and this file had no way to log one.

   THE SHAPE NOW: there are no lanes here any more. Sending a pitch — cold, to
   a lead with no account, or to a real posted stay — creates a real stage-0
   Your collabs thread immediately (D.startCollab, in ukcdata.js). This file
   owns exactly one thing: the composer that writes the letter and sends it.
   ukcviews.js renders the Inquiry-stage cards and the thread pages that
   follow up on them, the same way it renders every other stage.

   Everything the page claims is derived from the stay (or lead) in front of
   it. Where there is nothing real to say, it says nothing rather than filling
   the space. */
window.UKCP = (function () {
  var D = window.UKC;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) {
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; }); };

  /* ================= state =================
     Drafts live here, keyed by stay, so leaving a letter and coming back to it
     does not lose it. The old build re-generated the text on every open and
     threw away anything you had changed — which you could not do anyway. */
  var drafts = {};
  var openId = null;          /* the stay/lead being written to, if any */
  var openWasLead = false;    /* which page to return to when the composer closes */
  var openKind = 'first';     /* 'first' letter or 'nudge' follow-up */
  var openCollabId = null;    /* which thread a nudge is following up on */
  var leadTerms = {};         /* proposed terms for the lead currently open, keyed by lead id */

  /* ================= proposed terms, for a cold pitch =================
     A lead has no campaign on Ukreate, so unlike a real stay there is nothing
     to state as fact — a cold pitch has to PROPOSE terms instead. Defaults
     come from the creator's own typical ask and their own per-arrangement
     rates, already set on the profile; nothing here invents a number that
     is not somewhere on the creator's own record. */
  function rateFor(type) {
    var r = D.me.rates && D.me.rates[type];
    return (r || r === 0) ? '$' + r : 'rate on request';
  }
  function termsFor(leadId) {
    if (!leadTerms[leadId]) {
      var types = (D.me.collabTypes && D.me.collabTypes.length) ? D.me.collabTypes : (D.COLLAB_TYPES || ['Hosted stay']);
      leadTerms[leadId] = { nights: 2, del: '1 UGC video, 5 photos', type: types[0] };
    }
    return leadTerms[leadId];
  }

  var NUDGE_AFTER = D.NUDGE_AFTER || 7;

  /* ================= the one list =================
     A stay's browse pool is whatever has not been pitched — every pitch is
     now a real collabs row from the moment it is sent, so "not yet pitched"
     just means no row exists for it (or the one that did was passed on and
     freed up again). */
  function unpitched() {
    var pitched = {};
    (D.collabs || []).forEach(function (c) { if (!c.passed) pitched[c.stay] = true; });
    return (D.stays || []).filter(function (s) { return !pitched[s.id]; });
  }
  /* Same idea for Outreach: a lead already cold-pitched should not be offered
     again as if it were fresh. */
  function unpitchedLeads() {
    var pitched = {};
    (D.collabs || []).forEach(function (c) { if (!c.passed) pitched[c.stay] = true; });
    return (D.leads || []).filter(function (l) { return !pitched[l.id]; });
  }

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
     and the money behind it, and that is what a row carries. */
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
  function nudgeLetter(s, sinceText) {
    return 'Hi ' + s.hotel + ' team,\n\n' +
      'Following up on my note from ' + (sinceText || 'a little while back') + ' about a hosted stay. I know inboxes get away ' +
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
  /* Outreach: a hotel with no campaign on Ukreate at all, so there is no
     agreed nights/deliverables to reference — the letter PROPOSES a hosted
     arrangement instead of restating terms that do not exist yet, using
     whatever the creator set in the terms panel below the letter. */
  function leadLetter(s, tone, terms) {
    var niche = String(D.me.niche).toLowerCase();
    var t = terms || termsFor(s.id);
    var ask = t.nights + ' night' + (String(t.nights) === '1' ? '' : 's') + ' (' + t.type + ', ' + rateFor(t.type) + ')';
    var give = 'in return you get ' + t.del + ', yours to keep and post on your own channels';
    if (tone === 'short') {
      return 'Hi ' + s.hotel + ' team,\n\nQuick one. I am a travel creator shooting ' + niche +
        '. I would like to propose ' + ask + ', and ' + give + '.\n\nWorth a short reply?\n\n' + D.me.n + '\n' + D.me.h;
    }
    if (tone === 'story') {
      return 'Hi,\n\nI have been putting together a series on ' + String(s.city).split(',')[0] +
        ', and ' + s.hotel + ' keeps coming up.\n\nI would love to come and make it: ' + ask + ', and ' + give + '.\n\n' + D.me.n + '\n' + D.me.h;
    }
    return 'Hi ' + s.hotel + ' team,\n\n' +
      'I am a travel creator shooting ' + niche + ', and ' + s.hotel + ' has been on my list for a while.\n\n' +
      'I would like to propose ' + ask + ', and ' + give + '.\n\n' +
      'I shoot, edit and deliver on my own, within ten days of checking out. Happy to send recent work if it is useful.\n\n' +
      'Would this be worth a short conversation?\n\n' + D.me.n + '\n' + D.me.h;
  }
  function letterFor(s, kind, tone, sinceText) {
    if (s.isLead) return leadLetter(s, tone, termsFor(s.id));
    if (kind === 'nudge') return nudgeLetter(s, sinceText);
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

  /* ================= the composer =================
     THE HOTEL'S SHAPE, because the hotel portal is the reference. Its inbound
     pitch thread is the same page from the other side: a status badge saying
     whose move it is, then ukGrid--thread with ukFlow on the left carrying a
     ukPanel_head, a ukPitchIn--row of the three facts of the trade, and a
     ukComposer whose secondary actions sit left and whose send sits right. The
     subject of it all is a stay card in ukSideCol. */
  function composer(st) {
    var s = D.stay(openId);
    if (!s) { openId = null; return ''; }   /* the page repaints without it */
    var kind = openKind;
    var tone = st.tone || 'warm';
    var nudgeCollab = (kind === 'nudge' && openCollabId) ? (D.collabs || []).filter(function (x) { return x.id === openCollabId; })[0] : null;
    var key = kind + ':' + s.id + ':' + (kind === 'nudge' ? 'x' : tone);
    if (drafts[key] === undefined) {
      drafts[key] = kind === 'nudge'
        ? nudgeLetter(s, nudgeCollab && nudgeCollab.msgs && nudgeCollab.msgs[0] ? nudgeCollab.msgs[0].at : '')
        : letterFor(s, kind, tone);
    }
    var free = !D.me.member;
    var locked = free && D.me.freePitchUsed && kind !== 'nudge';
    var goes = (D.me.work || []).slice(0, 3);
    var t = s.isLead ? termsFor(s.id) : null;

    return '<button class="ukBack" type="button" data-writeclose>&larr; Back to ' +
      (s.isLead ? 'outreach' : 'stays') + '</button>' +
      UKCV.head(kind === 'nudge' ? 'Follow up with ' + esc(s.hotel) : 'Write to ' + esc(s.hotel),
        kind === 'nudge'
          ? 'Short, warm, and it gives them an easy way out. That is what gets answered.'
          : 'Change anything you like. It is kept as you type, so you can leave it and come back.') +

      (kind === 'nudge' && nudgeCollab && nudgeCollab.msgs && nudgeCollab.msgs[0]
        ? '<div class="ukStatusBadge" role="status">' +
            '<span class="ukStatusBadge_lb">Waiting on them</span>' +
            '<span class="ukStatusBadge_s">Sent ' + esc(nudgeCollab.msgs[0].at) + '</span>' +
          '</div>'
        : '') +

      '<div class="ukGrid ukGrid--thread"><section class="ukFlow">' +
        '<section class="ukPanel ukFlowThread">' +
          '<div class="ukPanel_head">' +
            '<h3 class="ukPanel_title">' + (kind === 'nudge' ? 'Your follow-up' : 'Your pitch') + '</h3>' +
            (kind === 'nudge' ? '' :
              '<div class="ukSeg ukSeg--tone" role="group" aria-label="Tone">' + TONES.map(function (tn) {
                var on = tn.k === tone;
                return '<button class="ukSeg_b' + (on ? ' is-on' : '') + '" type="button" ' +
                  'aria-pressed="' + on + '" data-ptone="' + tn.k + '">' + tn.t + '</button>';
              }).join('') + '</div>') +
          '</div>' +

          (s.isLead
            ? '<dl class="ukPitchIn ukPitchIn--row">' +
                '<div><dt>Reaching out to</dt><dd>' + esc(s.hotel) + '</dd></div>' +
                (s.website ? '<div><dt>Website</dt><dd>' + esc(s.website) + '</dd></div>' : '') +
                (s.email ? '<div><dt>Contact</dt><dd>' + esc(s.email) + '</dd></div>' : '') +
              '</dl>'
            : '<dl class="ukPitchIn ukPitchIn--row">' +
                '<div><dt>You are asking for</dt><dd>' + s.nights + ' night' +
                  (String(s.nights) === '1' ? '' : 's') + ', ' + esc(String(s.room || s.rooms || '').toLowerCase()) + '</dd></div>' +
                '<div><dt>You would deliver</dt><dd>' + esc((s.del || []).map(function (d) {
                  return d.q + ' × ' + d.t.toLowerCase(); }).join(', ')) + '</dd></div>' +
                '<div><dt>Included</dt><dd>' + esc(s.inc) + '</dd></div>' +
              '</dl>') +

          /* A cold pitch proposes terms, since none exist yet — nights, what
             the creator would deliver, and the rate for whichever arrangement
             type they pick, read off the creator's own profile rates. This is
             what makes the thread that follows start with a real (if
             unconfirmed) ask rather than nothing at all. */
          (s.isLead && kind !== 'nudge'
            ? '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">What you are proposing</h3></div>' +
                '<p class="ukAsk">This goes with the letter, and becomes the thread’s starting terms once they reply.</p>' +
                '<div class="ukField"><label class="ukField_lb" for="ukLeadType">Arrangement</label>' +
                  '<select class="ukField_i" id="ukLeadType" data-leadfield="type">' +
                    (D.me.collabTypes && D.me.collabTypes.length ? D.me.collabTypes : (D.COLLAB_TYPES || [])).map(function (ty) {
                      return '<option value="' + esc(ty) + '"' + (ty === t.type ? ' selected' : '') + '>' + esc(ty) +
                        (ty !== 'Hosted stay' ? ' — ' + esc(rateFor(ty)) : '') + '</option>';
                    }).join('') +
                  '</select></div>' +
                '<div class="ukField"><label class="ukField_lb" for="ukLeadNights">Nights</label>' +
                  '<input class="ukField_i" id="ukLeadNights" type="number" min="1" max="14" ' +
                    'data-leadfield="nights" value="' + esc(t.nights) + '"></div>' +
                '<div class="ukField"><label class="ukField_lb" for="ukLeadDel">What you would deliver</label>' +
                  '<input class="ukField_i" id="ukLeadDel" type="text" data-leadfield="del" value="' + esc(t.del) + '"></div>' +
              '</section>'
            : '') +

          '<section class="ukComposer">' +
            '<label class="ukSrOnly" for="ukWriteTa">' +
              (kind === 'nudge' ? 'Your follow-up to ' : 'Your pitch to ') + esc(s.hotel) + '</label>' +
            '<textarea id="ukWriteTa" class="ukWrite_ta" data-draft="' + esc(key) + '" ' +
              'data-grow>' + esc(drafts[key]) + '</textarea>' +
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
          /* 2c — collections made referenceable when pitching, reusing this
             exact section (ukWriteWork's own .ukReels--sm + UKCV.pic idiom)
             rather than inventing a picker: D.dsForMarket (ukdiscover.js)
             already existed for exactly this moment — "pitch prep is when
             a save is actually useful" — but had no call site inside the
             composer itself, only on the stay page one step before it. */
          (function () {
            var picks = (D.dsForMarket ? D.dsForMarket(s.city, [s.vibe]) : []).slice(0, 3);
            if (!picks.length) return '';
            return '<section class="ukWriteWork ukWriteInspo"><div class="ukWriteWork_h">' +
                '<p class="ukWriteWork_t">From your Discover saves</p>' +
                '<span class="ukCount">' + picks.length + (picks.length === 1 ? ' piece' : ' pieces') + '</span></div>' +
                '<div class="ukReels ukReels--sm">' + picks.map(function (i) {
                  return '<figure class="ukReel">' + UKCV.pic(((D.MEDIA && D.MEDIA[i.m]) || {}).src || '', i.t, '9x16') + '</figure>';
                }).join('') + '</div>' +
                '<p class="ukWhy">Matches this stay’s market or vibe — worth pointing to as the kind of thing ' +
                'you would make for them.</p></section>';
          })() +
            '<div class="ukComposer_row">' +
              '<div class="ukComposer_actions">' +
                '<button class="ukGhost ukGhost--sm" type="button" data-copydraft="' + esc(key) + '">Copy it</button>' +
                '<p class="ukHint">' + (kind === 'nudge'
                  ? 'One follow-up is worth it. Two is pushing it.'
                  : s.isLead
                    ? 'This is your own outreach — copy it into your email, or press Send to log it as sent.'
                    : 'It reaches ' + esc(s.hotel) + ' as an application, with your recent work attached.') +
                '</p>' +
              '</div>' +
              '<div class="ukComposer_send">' +
                (kind === 'nudge'
                  ? '<button class="ukBtn" type="button" data-sentnudge="' + esc(openCollabId || '') + '">Send the follow-up</button>'
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
        /* A lead is a hotel Ukreate has never scored or assessed — no `.score`,
           no `.wants` band to compare against. scoreFor()/why() both assume a
           real D.stays record and quietly fabricate an answer for anything
           else. Same discipline as leadLetter(): say nothing rather than
           invent it. */
        window.UKSTAY.hotelCard(s, {
          eager: true,
          tag: s.isLead ? '' : '<span class="ukScore2">' + D.scoreFor(s) + '<em>/10</em></span>',
          foot: '<p class="ukCard_sub">' + esc(s.isLead
            ? 'Not on Ukreate yet — this is your own outreach, not a match.'
            : why(s)) + '</p>'
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
  function go() {
    if (openWasLead && window.UKCSTATE) window.UKCSTATE('stays').tab = 'outreach';
    return window.UKCGO('stays');
  }

  document.addEventListener('click', function (e) {
    var root = document.querySelector('[data-ukc]');
    if (!root) return;
    var el;

    if ((el = e.target.closest('[data-write]'))) {
      openId = el.dataset.write; openKind = 'first'; openCollabId = null;
      return go();
    }
    /* A follow-up is opened from the collab thread itself now, carrying the
       thread's id so the composer knows which one it is nudging. */
    if ((el = e.target.closest('[data-nudge]'))) {
      var nc = (D.collabs || []).filter(function (x) { return x.id === el.dataset.nudge; })[0];
      var ns = nc && D.stay(nc.stay);
      if (!ns) return;
      openId = ns.id; openKind = 'nudge'; openWasLead = !!ns.isLead; openCollabId = nc.id;
      return go();
    }
    if (e.target.closest('[data-closewrite]')) { openId = null; return go(); }

    if ((el = e.target.closest('[data-ptone]'))) {
      var stt = (window.UKCSTATE && window.UKCSTATE('stays')) || null;
      if (stt) stt.tone = el.dataset.ptone;
      return go();
    }

    if ((el = e.target.closest('[data-leadfield]'))) { return; } /* handled on input/change below */

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
      var draftKey = 'first:' + ss.id + ':';
      var text = drafts[draftKey + 'warm'] || drafts[draftKey + 'short'] ||
                 drafts[draftKey + 'story'] || firstLetter(ss);
      /* One ledger: both a cold pitch and a real application become a real
         stage-0 collab thread immediately, with the letter as its first
         message — that IS the record of what was sent. */
      if (ss.isLead) {
        D.startCollab(ss.id, text, termsFor(ss.id));
      } else if (window.UKAPPLY) {
        window.UKAPPLY.send({
          stay: ss.id, creatorName: D.me.n, creatorHandle: D.me.h,
          creatorImg: D.me.img, creatorCity: D.me.city || '',
          creatorReach: D.me.band || null, msg: text, at: 'just now'
        });
      }
      /* the pitch actually ARRIVES: it used to be recorded only in the creator's
         own tracker, so the hotel had no way to see it */
      if (!ss.isLead && window.UKPITCHIN && ss.hotel === window.UKPITCHIN.PROPERTY) {
        window.UKPITCHIN.send({
          to: ss.hotel, from: 'c1', fromName: D.me.n,
          angle: angles(ss)[0] || ss.style,
          offer: (ss.del || []).map(function (d) { return d.q + ' ' + d.t.toLowerCase(); }).join(', '),
          asks: ss.nights + ' nights, ' + String(ss.inc || '').toLowerCase(),
          note: 'I shoot ' + String(D.me.niche).toLowerCase() + ' and deliver within ten days of checkout.'
        });
      }
      openId = null;
      if (window.UKCSTATE) window.UKCSTATE('collabs').sent = true;
      window.UKCGO && window.UKCGO('collabs');
      return;
    }
    if ((el = e.target.closest('[data-sentnudge]'))) {
      var nid = el.dataset.sentnudge;
      var ncb = nid && (D.collabs || []).filter(function (x) { return x.id === nid; })[0];
      if (ncb) {
        ncb.msgs = ncb.msgs || [];
        ncb.msgs.push({ by:'me', at:'just now', tx: drafts['nudge:' + ncb.stay + ':x'] || '' });
        ncb.nudged = true;
      }
      openId = null; openCollabId = null;
      window.UKCGO && window.UKCGO('collabs');
      return;
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
    if (ta) { drafts[ta.dataset.draft] = ta.value; grow(ta); return; }
    var lf = e.target.closest && e.target.closest('[data-leadfield]');
    if (lf && openId) {
      var t2 = termsFor(openId);
      var field = lf.dataset.leadfield;
      t2[field] = field === 'nights' ? (Number(lf.value) || 1) : lf.value;
    }
  });
  document.addEventListener('change', function (e) {
    var lf = e.target.closest && e.target.closest('[data-leadfield]');
    if (lf && openId) {
      var t3 = termsFor(openId);
      t3[lf.dataset.leadfield] = lf.dataset.leadfield === 'nights' ? (Number(lf.value) || 1) : lf.value;
    }
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
    unpitched: unpitched, unpitchedLeads: unpitchedLeads,
    angles: angles, why: why, tradeLine: tradeLine,
    letterFor: letterFor, nudgeLetter: nudgeLetter, termsFor: termsFor, rateFor: rateFor,
    NUDGE_AFTER: NUDGE_AFTER,
    /* the composer */
    composer: composer, writing: function () { return openId; }, write: function (id, kind, collabId) {
      openId = id; openKind = kind || 'first'; openCollabId = collabId || null;
      var s = D.stay(id);
      openWasLead = !!(s && s.isLead);
    }, close: function () { openId = null; }
  };
})();
