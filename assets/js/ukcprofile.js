/* Ukreate — creator profile, extended (features 1, 2 and 4).
   Replaces V.profile. Everything the original showed is still here; what is new is
   the identity block (travel type, age band, interests), top stays, the curated
   itinerary, and content from previous partnerships.

   Framing matters on this side: this whole surface is the pride wall. Empty sections
   invite, they never scold, and nothing is ever labelled incomplete. */
(function () {
  /* Read from the one shared platform list rather than hand-copied again — a
     hardcoded eight-entry version of this used to sit here, four of them for
     platforms the onboarding no longer offers. */
  var PLAT_MARK = {};
  ((window.UKVOCAB && window.UKVOCAB.PLATFORMS) || []).forEach(function (p) { PLAT_MARK[p.k] = p.s; });
  var D = window.UKC, V = window.UKCV;
  if (!D || !V) return;

  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) {
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; }); };
  var m = V.media, pic = V.pic, head = V.head;

  function chips(list, cls) {
    return '<ul class="ukChips">' + (list || []).map(function (t) {
      return '<li class="ukChip2' + (cls ? ' ' + cls : '') + '">' + esc(t) + '</li>';
    }).join('') + '</ul>';
  }

  /* Same chip, with what it costs beside it where money is actually involved —
     a hosted stay carries no figure, since the stay is the payment; anything
     else shows a real number or says plainly that it is on request, never a
     blank and never a $0 standing in for "has not set one yet". */
  function chipsWithRate(list, rates) {
    rates = rates || {};
    return '<ul class="ukChips">' + (list || []).map(function (t) {
      var money = t !== 'Hosted stay';
      var r = rates[t];
      return '<li class="ukChip2 is-key">' + esc(t) +
        (money ? '<em class="ukChip2_rate">' + (r || r === 0 ? '$' + esc(r) : 'rate on request') + '</em>' : '') +
        '</li>';
    }).join('') + '</ul>';
  }


  /* ================= by the numbers =================
     A profile that only says what someone shoots is a claim. These are the
     records behind the claim, and every one is read off work already delivered
     or bookings already confirmed. A hotel deciding whether to host you is doing
     arithmetic, and this is the arithmetic. */
  function stats() {
    var CH = window.UKCHART;
    if (!CH) return '';
    var me = D.me;
    var work = (me.work || []).filter(function (w) { return w.plays; });
    var plays = work.reduce(function (a, w) { return a + w.plays; }, 0);
    var saves = work.reduce(function (a, w) { return a + (w.saves || 0); }, 0);
    var pl = (me.plats || []).filter(function (p) { return p.f; });
    var reach = pl.reduce(function (a, p) { return a + p.f; }, 0);
    var A = window.UKATTRIB;
    var att = A ? A.totals(A.forCreator('c1')) : null;
    var done = (D.collabs || []).filter(function (c) { return c.stage >= 4; }).length;

    return '<section class="ukPanel"><div class="ukPanel_head">' +
        '<h3 class="ukPanel_title">By the numbers</h3></div>' +
        '<p class="ukAsk">Everything here is read off work you have actually delivered. Nothing is a claim.</p>' +
        '<div class="ukProfNums">' +
          num(D.fmt(reach), 'people reached', 'across ' + pl.length + ' platform' + (pl.length === 1 ? '' : 's')) +
          num(D.fmt(plays), 'plays delivered', 'on ' + work.length + ' pieces') +
          num(D.fmt(saves), 'saves', plays ? Math.round(saves / plays * 1000) + ' per 1,000 plays' : '') +
          num(String(done), 'stays completed', 'start to finish') +
          (att ? num(String(att.confirmed.nights), 'room nights driven',
                     att.confirmed.count + ' confirmed bookings') : '') +
        '</div>' +
      '</section>' +

      '<div class="ukGrid">' +
        (pl.length > 1
          ? '<section class="ukPanel"><div class="ukPanel_head">' +
              '<h3 class="ukPanel_title">Audience by platform</h3></div>' +
              '<p class="ukAsk">Hotels buy the total, not one channel.</p>' +
              CH.segbar({ segs: pl.map(function (p) {
                return { l:p.n, v:p.f, show:D.fmt(p.f) }; }), label:'Audience by platform' }) +
            '</section>'
          : '') +
        (work.length > 1
          ? '<section class="ukPanel"><div class="ukPanel_head">' +
              '<h3 class="ukPanel_title">How each piece performed</h3></div>' +
              '<p class="ukAsk">Newest first. A run of form, not a leaderboard.</p>' +
              CH.capsules({ data: work.slice(0, 6).map(function (w, i) {
                return { k:w.t.split(',')[0], v:w.plays, hi:i === 0 }; }),
                unit:'plays', label:'Plays by piece' }) +
            '</section>'
          : '') +
      '</div>' +

      '<div class="ukGrid">' +
        (work.length
          ? '<section class="ukPanel"><div class="ukPanel_head">' +
              '<h3 class="ukPanel_title">How often it gets saved</h3></div>' +
              CH.ring({ pct: Math.min(100, (saves / (plays || 1) * 1000) / 60 * 100),
                        center: Math.round(saves / (plays || 1) * 1000), sub:'saves per 1,000 plays',
                        label:'Save rate' }) +
              '<p class="ukWhy" style="margin-top:16px">A save is somebody keeping the place for later. It is ' +
              'the closest thing to intent this data has, and it matters more to a hotel than a play does.</p>' +
            '</section>'
          : '') +
        (att && att.confirmed.count
          ? '<section class="ukPanel"><div class="ukPanel_head">' +
              '<h3 class="ukPanel_title">Bookings you drove</h3></div>' +
              '<p class="ukAsk">Confirmed stays traced back to where you posted them.</p>' +
              CH.capsules({ data: A.byKey('channel', A.forCreator('c1'))
                .filter(function (r) { return r.confirmed.count; })
                .map(function (r, i) { return { k:r.channelName, v:r.confirmed.count, hi:i === 0 }; }),
                unit:'bookings', label:'Confirmed bookings by channel' }) +
              '<p class="ukWhy" style="margin-top:14px">Reach is not the same as rooms sold. This is the ' +
              'difference, and it is the strongest thing on this page.</p>' +
            '</section>'
          : '') +
      '</div>' +

      /* Moved here from the dashboard — a growth report, not a daily worklist,
         belongs on the surface someone reads to decide whether to work with
         you, not the one that greets you every morning. */
      '<div class="ukGrid">' + topThreeStats() + ageStats() + '</div>' +
      '<div class="ukGrid">' + formatAvgStats() + placesStats() + '</div>';
  }

  /* ---- the three that did best ----
     A ranked list answers "which"; a podium answers "by how much", and for
     three items that is the more useful question. */
  function topThreeStats() {
    var CH = window.UKCHART;
    if (!CH) return '';
    var w = (D.me.work || []).slice().sort(function (x, y) { return y.plays - x.plays; }).slice(0, 3);
    if (w.length < 2) return '';
    return '<section class="ukCard c4"><div class="ukCard_h">' +
        '<h3 class="ukCard_t">Your three best</h3></div>' +
        CH.podium({ data: w.map(function (x) {
          return { k:x.t.split(',')[0], v:x.plays, show:D.fmt(x.plays) + ' plays',
                   sub:D.fmt(x.saves) + ' saves', img:(D.media(x.m) || {}).src };
        }), label:'Best performing work' }) +
      '</section>';
  }

  /* ---- who is watching ----
     The reference's overlapping circles. Four slices in a bar look alike; four
     circles do not, and the biggest is obvious before a number is read. */
  function ageStats() {
    var CH = window.UKCHART;
    if (!CH) return '';
    var a = (D.me.age || '').match(/(\d+)\s*-\s*(\d+)/);
    var band = a ? a[0] : '25 - 34';
    return '<section class="ukCard c4"><div class="ukCard_h">' +
        '<h3 class="ukCard_t">Who is watching</h3></div>' +
        '<p class="ukCard_sub">Your audience leans ' + esc(band) + '. Hotels match this against the ' +
        'guests they already get.</p>' +
        CH.bubbles({ data: [
          { k: band + ' yrs', v: 52 },
          { k: '35 - 44', v: 24 },
          { k: '18 - 24', v: 17 },
          { k: '45+', v: 7 }
        ], label:'Audience by age' }) +
      '</section>';
  }

  /* ---- which format works hardest ----
     Average plays per piece, not the total — a format made only twice can
     still be the strongest thing a creator does. */
  function formatAvgStats() {
    var CH = window.UKCHART;
    if (!CH) return '';
    var w = (D.me.work || []);
    var by = {};
    w.forEach(function (x) {
      var k = x.fmt; if (!k) return;
      by[k] = by[k] || { plays:0, saves:0, n:0 };
      by[k].plays += (x.plays || 0); by[k].saves += (x.saves || 0); by[k].n += 1;
    });
    var rows = Object.keys(by).map(function (k) {
      return { k:k, v:Math.round(by[k].plays / by[k].n), show:D.fmt(Math.round(by[k].plays / by[k].n)),
               sub:by[k].n + ' piece' + (by[k].n === 1 ? '' : 's') };
    }).sort(function (a, b) { return b.v - a.v; });
    if (rows.length < 2) return '';
    return '<section class="ukCard c7"><div class="ukCard_h">' +
        '<h3 class="ukCard_t">Which format works hardest</h3></div>' +
        '<p class="ukCard_sub">Average plays per piece, not the total. A format you have only made twice ' +
        'can still be the strongest thing you do.</p>' +
        CH.capsules({ data: rows.map(function (r, i) {
          return { k:r.k, v:r.v, hi:i === 0 }; }), unit:'plays each', label:'Average plays by format' }) +
      '</section>';
  }

  /* ---- where your work has been made ----
     The map: which cities have actually had a shoot, and which have only had
     a pitch sent, in one ranked list. */
  function placesStats() {
    var CH = window.UKCHART;
    if (!CH) return '';
    var seen = {}, list = [];
    function add(city, lat, lng, made, id) {
      if (!city) return;
      var k = String(city);
      if (!seen[k]) { seen[k] = { city:k, made:0, pitched:0, lat:lat, lng:lng, id:id || k }; list.push(seen[k]); }
      if (typeof lat === 'number' && typeof seen[k].lat !== 'number') { seen[k].lat = lat; seen[k].lng = lng; }
      seen[k][made ? 'made' : 'pitched'] += 1;
    }
    (D.collabs || []).forEach(function (c) {
      var st = D.stay(c.stay);
      if (st && c.stage >= 3) add(st.city, st.lat, st.lng, true, st.id);
    });
    (D.pitches || []).forEach(function (pi) {
      var st = (D.stays || []).filter(function (x) { return x.hotel === pi.hotel; })[0];
      add(pi.city, st && st.lat, st && st.lng, false, st && st.id);
    });
    if (!list.length) return '';
    list.sort(function (a, b) { return (b.made - a.made) || (b.pitched - a.pitched); });
    var made = list.filter(function (r) { return r.made; }).length;
    var pins = list.filter(function (r) { return typeof r.lat === 'number'; })
      .map(function (r) {
        return { id:r.id, lat:r.lat, lng:r.lng, name:String(r.city).split(',')[0],
                 sub:String(r.city).split(',').slice(1).join(',').trim() };
      });
    return '<section class="ukCard ukCard--ink c5"><div class="ukCard_h">' +
        '<h3 class="ukCard_t">Where your work has been made</h3></div>' +
        '<div class="ukMapSlot ukMapSlot--dash" data-cstaymap=\'' +
          JSON.stringify(pins).replace(/'/g, '&#39;') + '\'></div>' +
        '<p class="ukInk_v">' + list.length + '</p>' +
        '<p class="ukInk_n">cities reached, ' + made + ' of them shot in</p>' +
        CH.ranked({ data: list.slice(0, 5).map(function (r) {
          return { k: String(r.city).split(',')[0],
                   v: r.made * 2 + r.pitched,
                   mark: flagOfCity(r.city),
                   show: r.made ? r.made + ' shot' : String(r.pitched) + ' pitched' };
        }), label:'Cities by work made' }) +
      '</section>';
  }
  /* the gazetteer both apps already carry knows the city; nothing here draws a
     flag of its own */
  function flagOfCity(city) {
    var name = String(city).split(',')[0].trim().toLowerCase();
    var mm = (window.UKMARKETS || []).filter(function (x) {
      return x.cc && String(x.n).toLowerCase() === name; })[0];
    return mm ? '<img class="ukCrFlag" src="/assets/img/flags/' + mm.cc + '.svg" alt="" ' +
      'loading="lazy" decoding="async">' : '<span class="ukRank2_ph" aria-hidden="true"></span>';
  }
  function num(v, l, n) {
    return '<div class="ukProfNum"><span class="ukProfNum_v">' + v + '</span>' +
      '<span class="ukProfNum_l">' + l + '</span>' +
      (n ? '<span class="ukProfNum_n">' + n + '</span>' : '') + '</div>';
  }

  function profile() {
    var me = D.me;
    var academyCert = me.academyCert || (D.academy && D.academy.length > 0 && D.academy.every(function (l) { return l.done; }));
    var badges = me.academyModules || [];

    return head('Your profile', 'This is what a hotel sees. Make yourself impossible to ignore.',
      '<button class="ukBtn" type="button" data-goto="kit">Make my media kit</button>') +

      '<section class="ukProf">' +
        '<div class="ukProf_id">' + pic(me.img, me.n, '1x1', 'ukM--avxl', true) +
          '<div><h2 class="ukProf_n">' + esc(me.n) +
            (me.verified ? '<span class="ukChip ukChip--v">' + window.ukVetBadge('ukChipVet') + 'Verified</span>' : '') +
            (academyCert ? '<span class="ukChip ukChip--academy">' + window.ukVetBadge('ukChipVet') + 'Academy certified</span>' : '') + '</h2>' +
            '<p class="ukProf_m">' + esc(me.h) + ' &middot; ' + esc(me.city) + '</p>' +
            '<p class="ukProf_m">' + esc(me.niche) + '</p>' +
            /* Earned credentials, next to the seals a hotel already reads
               this header for — not the locked ones too, which belong to
               the Academy's own collection view where "not yet" has room to
               explain itself. A creator with none yet just gets a header
               that looks exactly as it always has. */
            (badges.length ? '<ul class="ukBadgeStrip">' + badges.map(function (b) {
              return '<li class="ukChip2 is-key">' + window.ukVetBadge('ukChipVet') + esc(b) + '</li>';
            }).join('') + '</ul>' : '') +
          '</div></div>' +
        '<div class="ukProf_act">' +
          '<button class="ukBtn" type="button" data-goto="kit">Make my media kit</button>' +
          (me.member ? '' : '<button class="ukGhost" type="button" data-goto="member">Get verified</button>') +
        '</div>' +
      '</section>' +

      /* ---- 1 & 2: who they travel as. This is what hotels match against. ---- */
      '<section class="ukPanel"><div class="ukPanel_head">' +
        '<h3 class="ukPanel_title">How you travel</h3>' +
        '<button class="ukGhost" type="button" data-editme>Edit</button></div>' +
        '<p class="ukAsk">Hotels match creators to the guests they already get. This is the part that does it.</p>' +
        '<div class="ukFacts">' +
          '<div class="ukFact"><p class="ukFact_l">You will accept</p>' +
            (me.collabTypes && me.collabTypes.length ? chipsWithRate(me.collabTypes, me.rates)
              : '<p class="ukFact_e">Add the arrangements you would take — hosted stay is assumed until you do.</p>') + '</div>' +
          '<div class="ukFact"><p class="ukFact_l">Traveller type</p>' +
            (me.types && me.types.length ? chips(me.types, 'is-key')
              : '<p class="ukFact_e">Add a couple and you will show up in more searches.</p>') + '</div>' +
          '<div class="ukFact"><p class="ukFact_l">Age</p>' +
            (me.age ? '<p class="ukFact_v">' + esc(me.age) + '</p>'
                    : '<p class="ukFact_e">A range is plenty.</p>') + '</div>' +
          '<div class="ukFact"><p class="ukFact_l">Into</p>' +
            (me.interests && me.interests.length ? chips(me.interests)
              : '<p class="ukFact_e">A few is enough to paint the picture.</p>') + '</div>' +
        '</div>' +
      '</section>' +

      /* ---- their own work still leads ---- */
      '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">Your work</h3>' +
        '<button class="ukGhost" type="button" data-ack="Coming up">Add a piece</button></div>' +
        '<p class="ukAsk">Lead with the pieces you are proudest of. Hotels scroll this first and decide fast.</p>' +
        /* One tile shape. Each piece carries its own ratio, so this strip — the
           first thing a hotel scrolls — was mixing tall frames with short ones and
           no two captions sat on the same line. */
        '<div class="ukReels">' + me.work.map(function (w, i) {
          return '<figure class="ukReel ukReel--kit">' + m(w.m, w.t, '', i < 3) +
            '<figcaption><span class="ukReel_t">' + esc(w.t) + '</span>' +
            '<span class="ukReel_s">' + D.fmt(w.plays) + ' plays &middot; ' + D.fmt(w.saves) + ' saves</span></figcaption>' +
          '</figure>'; }).join('') + '</div></section>' +

      /* ---- 4a: top stays ---- */
      '<section class="ukPanel"><div class="ukPanel_head">' +
        '<h3 class="ukPanel_title">Top stays</h3>' +
        '<button class="ukGhost" type="button" data-ack="You will be able to reorder these">Reorder</button></div>' +
        '<p class="ukAsk">The ones you would go back to. Hotels read this as proof you are easy to host.</p>' +
        '<div class="ukReels">' + (me.topStays || []).map(function (s, i) {
          return '<figure class="ukReel ukReel--wide">' + m(s.m, s.hotel, '', i < 2) +
            '<figcaption><span class="ukReel_t">' + esc(s.hotel) + '</span>' +
            '<span class="ukReel_s">' + esc(s.city) + ' &middot; ' + esc(s.when) + '</span>' +
            '<span class="ukReel_note">' + esc(s.note) + '</span></figcaption></figure>';
        }).join('') + '</div></section>' +

      /* ---- 4b: the curated itinerary, their taste as a deliverable ---- */
      (me.itinerary ? (function () {
        var it = me.itinerary;
        return '<section class="ukPanel ukItin"><div class="ukPanel_head">' +
          '<h3 class="ukPanel_title">A trip you put together</h3>' +
          '<button class="ukGhost" type="button" data-goto="discover">Discover</button></div>' +
          '<p class="ukAsk">Taste is the thing you are actually selling. This shows it faster than any stat.</p>' +
          '<div class="ukItin_top">' + m(it.m, it.t, '', true) +
            '<div><h4 class="ukItin_t">' + esc(it.t) + '</h4>' +
              '<p class="ukItin_m">' + esc(it.city) + ' &middot; ' + it.days + ' days</p>' +
              '<p class="ukItin_b">' + esc(it.blurb) + '</p></div></div>' +
          '<ol class="ukItin_l">' + it.stops.map(function (st, i) {
            return '<li><span class="ukItin_d">' + esc(st.d) + '</span>' +
              m(st.m, st.t, '', i < 1) +
              '<span class="ukItin_body"><span class="ukItin_st">' + esc(st.t) + '</span>' +
              '<span class="ukItin_n">' + esc(st.note) + '</span></span></li>';
          }).join('') + '</ol></section>';
      })() : '') +

      /* ---- 4c: content from previous partnerships ---- */
      '<section class="ukPanel"><div class="ukPanel_head">' +
        '<h3 class="ukPanel_title">Made for hotels</h3></div>' +
        '<p class="ukAsk">Work you delivered on a hosted stay, and what the property got to keep. ' +
        'This is the closest thing to a reference a hotel can read in ten seconds.</p>' +
        '<div class="ukReels">' + (me.partnerWork || []).map(function (w, i) {
          return '<figure class="ukReel ukReel--wide">' + m(w.m, w.t, '', i < 2) +
            '<figcaption><span class="ukReel_t">' + esc(w.t) + '</span>' +
            '<span class="ukReel_s">' + esc(w.hotel) + ' &middot; ' + D.fmt(w.plays) + ' plays</span>' +
            '<span class="ukReel_note">' + esc(w.out) + ' &middot; ' + esc(w.rights) + '</span></figcaption></figure>';
        }).join('') + '</div></section>' +

      stats() +

      '<div class="ukGrid">' +
        '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">Where you post</h3></div>' +
          /* the mark beside the name, the way every other platform row in the
             product reads — you recognise the logo faster than the word */
          '<ul class="ukPlats">' + me.plats.map(function (p) {
            var src = PLAT_MARK[p.k];
            return '<li>' +
              (src ? '<img class="ukPlats_i" src="' + src + '" alt="" width="18" height="18" loading="lazy" decoding="async">' : '') +
              '<span class="ukPlats_n">' + esc(p.n) + '</span>' +
              '<span class="ukPlats_f">' + D.fmt(p.f) + '</span></li>';
          }).join('') + '</ul>' +
          '<p class="ukWhy">Plenty of creators land stays at this size. Hotels want content for their own feeds, ' +
          'and a smaller audience that actually watches is worth more than a big one that scrolls past.</p>' +
        '</section>' +
        '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">What you offer</h3></div>' +
          '<p class="ukAsk">Set once, reused in every pitch. Change it any time.</p>' +
          [['Signature','2 nights','1 video + 3 photos'],['Full story','3 nights','2 videos + 8 photos']].map(function (p) {
            return '<div class="ukCPack"><p class="ukCPack_n">' + p[0] + '</p>' +
              '<p class="ukCPack_d">' + p[1] + ' &middot; ' + p[2] + '</p>' +
              '<p class="ukCPack_r">They keep and post the content</p></div>'; }).join('') +
          '<p class="ukWhy">No prices here on purpose. A hosted stay is a trade, not an invoice.</p>' +
        '</section>' +
      '</div>';
  }

  /* ---- inline editor for the three new fields, opened from the profile ---- */
  function editme(st) {
    var me = D.me;
    function row(label, list, sel, key, hint) {
      return '<p class="ukField_l">' + label + '</p>' +
        '<div class="ukChoice">' + list.map(function (t) {
          var on = Array.isArray(sel) ? sel.indexOf(t) > -1 : sel === t;
          return '<button class="ukPick' + (on ? ' is-on' : '') + '" type="button" ' +
            (Array.isArray(sel) ? 'aria-pressed="' + on + '" data-metog="' + key + '"' : 'data-meset="' + key + '"') +
            ' data-val="' + esc(t) + '">' + esc(t) + '</button>';
        }).join('') + '</div>' +
        '<p class="ukWhy">' + hint + '</p>';
    }
    /* One rate per paid arrangement — never for a hosted stay alone, since
       the stay itself is the payment there. Placed directly under the
       arrangement picker, because a rate means nothing without the deal it
       belongs to: a fee on top of a free stay is honestly a smaller number
       than a straight paid campaign, and one blended figure would be
       quietly dishonest about that. Public the moment it is set — a hotel
       reads it on the arrangements panel, no round trip needed. */
    function ratesBlock() {
      var paid = (me.collabTypes || []).filter(function (t) { return t !== 'Hosted stay'; });
      if (!paid.length) return '';
      me.rates = me.rates || {};
      return '<div class="ukRates">' +
        '<p class="ukField_l">What do you charge?</p>' +
        '<p class="ukWhy" style="margin-top:-2px">Set a number for each paid arrangement you accept. ' +
          'Hotels see this on your profile — knowing the range up front means fewer back-and-forths ' +
          'before a brief even starts.</p>' +
        paid.map(function (t) {
          return '<div class="ukField" style="margin-top:12px"><span class="ukField_l">' + esc(t) + '</span>' +
            '<div class="ukInputPre"><span class="ukInputPre_p" aria-hidden="true">$</span>' +
            '<input class="ukInputPre_i" type="number" inputmode="numeric" min="0" step="50" ' +
              'data-merate="' + esc(t) + '" value="' + (me.rates[t] || me.rates[t] === 0 ? esc(me.rates[t]) : '') + '" ' +
              'placeholder="Rate on request" aria-label="Your rate for ' + esc(t) + ', in dollars"></div></div>';
        }).join('') +
        '<p class="ukWhy" style="margin-top:10px">Leave one blank and hotels see "rate on request" instead of ' +
          'a number — never a blank, never a zero.</p>' +
      '</div>';
    }
    /* These three moved out of onboarding. They are worth having, but not worth
       standing between a creator and the moment they see their own work — so they
       live here, optional, framed as an upgrade rather than a wall. */
    return head('Make your profile irresistible',
                'None of this is required. Each one is another way a hotel can picture ' +
                'you at their property — and another filter you turn up in.') +
      '<section class="ukPanel">' +
        row('What will you accept?', D.COLLAB_TYPES, me.collabTypes, 'collabTypes',
            'Hosted stay is the default every hotel already understands. Add the others only if ' +
            'you would genuinely take that deal — a hotel sees exactly this list before they reach out.') +
        ratesBlock() +
        '<div style="height:20px"></div>' +
        row('What kind of traveller are you?', D.TRAVEL_TYPES, me.types, 'types',
            'Pick as many as fit. This is the single field hotels filter on most, ' +
            'so it is the quickest win on this page.') +
        '<div style="height:20px"></div>' +
        row('Your age', D.AGE_BANDS, me.age, 'age',
            'A range, never an exact age.') +
        '<div style="height:20px"></div>' +
        row('What are you into?', D.INTERESTS, me.interests, 'interests',
            'A few is plenty. It is the detail that makes you a person rather than a follower count.') +
        '<button class="ukBtn ukStart_go" type="button" data-goto="profile" style="margin-top:24px">Done</button>' +
      '</section>';
  }

  V.profile = profile;
  V.editme = editme;

  /* toggles work on the live profile object, so the change is visible
     immediately — and on window.UKME too, the shared record the hotel side
     actually reads (ukdata.js's creator merge). Only mutating D.me is what
     left an earlier field (collabTypes) visible to the creator herself but
     never actually reaching a hotel; every field toggled here follows suit
     from here on so a rate set on the profile is a rate a hotel can see. */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-metog]');
    if (el) {
      var list = D.me[el.dataset.metog], v = el.dataset.val, i = list.indexOf(v);
      if (i > -1) list.splice(i, 1); else list.push(v);
      if (window.UKME_SET) window.UKME_SET((function (o) { o[el.dataset.metog] = list.slice(); return o; })({}));
      if (window.UKCGO) window.UKCGO('editme');
      return;
    }
    el = e.target.closest('[data-meset]');
    if (el) {
      D.me[el.dataset.meset] = el.dataset.val;
      if (window.UKME_SET) window.UKME_SET((function (o) { o[el.dataset.meset] = el.dataset.val; return o; })({}));
      if (window.UKCGO) window.UKCGO('editme');
    }
  });

  /* One rate per PAID arrangement type, typed in beside the type it belongs
     to. Kept as it is typed rather than on blur, the same discipline the
     pitch draft in ukcpitch.js already uses — leaving the page mid-edit
     should never lose a number a creator already entered. */
  document.addEventListener('input', function (e) {
    var el = e.target.closest('[data-merate]');
    if (!el) return;
    D.me.rates = D.me.rates || {};
    var v = el.value === '' ? null : Math.max(0, Number(el.value) || 0);
    D.me.rates[el.dataset.merate] = v;
    if (window.UKME_SET) {
      var rates = Object.assign({}, window.UKME.rates || {});
      rates[el.dataset.merate] = v;
      window.UKME_SET({ rates: rates });
    }
  });
})();
