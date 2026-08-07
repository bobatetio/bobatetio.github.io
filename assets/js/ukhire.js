/* Ukreate — hiring-strategy helper (feature 6). Hotel side only.

   Assistant, not director: every field arrives with a sensible answer already
   chosen, the recommendation appears the moment there is enough to reason from,
   and the hotel can overrule any part of it in one tap. It recommends; it never
   decides. The reasoning is always on screen, because a recommendation you cannot
   interrogate is just an instruction.

   The engine itself lives in ukdata2.js behind PLUG-IN POINT seams. */
(function () {
  /* A drawn tick, not the \u2713 glyph: the glyph is squat, sits on a font's
     metrics and changes shape with whatever font renders it. */
  var TICK = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var D = window.UK, V = window.UKV;
  if (!D || !V) return;

  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) {
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; }); };
  function img(src, alt, cls) {
    return '<img class="' + (cls || '') + '" src="' + src + '" alt="' + esc(alt) + '" loading="lazy" decoding="async">';
  }
  function head(t, s) {
    return '<div class="ukPageHead_row"><div class="ukPageHead"><h2>' + t + '</h2>' +
      (s ? '<p>' + s + '</p>' : '') + '</div>' +
      '<button class="ukGhost ukCalcEntry" type="button" data-calc-open>' +
        '<span class="ukCalcEntry_ic" aria-hidden="true" data-lottie-src="/assets/lottie/calc-icon.json?v=3" ' +
          'data-lottie-loop="false"></span><span>Affordability calculator</span></button></div>';
  }

  /* the traveller types the creator side collects, mirrored here so a hotel can aim
     at one without the two apps having to share a module (role boundary stays intact) */
  var TRAVEL = ['Family travel','Digital nomad','Eco-conscious','Luxury','Budget / backpacker',
                'Adventure / outdoors','Food & culinary','Wellness','Solo travel','Couples',
                'Slow travel','Road trips','City breaks','Beach and island','Ski and snow',
                'Diving and watersports','Culture and history','Nightlife and music',
                'Business and workation','Wildlife and safari','Festivals and events',
                'Pet-friendly','Accessible travel','Multi-generational'];

  /* the brief always starts answered, so the hotel is never staring at a blank form */
  function brief(st) {
    if (!st.brief) st.brief = {
      campaign:'seasonal', prop:'Boutique', persona:'Couples',
      travelType:'Wellness', capacity:4, dest:(D.property && D.property.city) || 'Miami, Florida'
    };
    return st.brief;
  }

  /* A menu rather than a row of chips: these lists are long enough that chips
     wrapped to three lines and the answer got lost among the options. */
  function dropRow(label, items, sel, key, hint) {
    var opts = items.map(function (it) {
      return typeof it === 'string' ? { k:it, l:it } : { k:it.k, l:it.l };
    });
    var cur = opts.filter(function (o) { return o.k === sel; })[0];
    return '<div class="ukHire_f">' +
      '<p class="ukField_l">' + label + '</p>' +
      '<div class="ukDrop ukDrop--wide"><button class="ukDrop_b" type="button" data-drop-toggle ' +
        'aria-haspopup="menu" aria-expanded="false">' +
        '<span class="ukDrop_v">' + esc(cur ? cur.l : 'Choose') + '</span>' +
        '<svg class="ukDrop_car" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
          'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>' +
      '</button><div class="ukDropMenu" hidden role="menu">' + opts.map(function (o) {
        return '<button class="ukDropMenu_i' + (o.k === sel ? ' is-sel' : '') + '" role="menuitem" ' +
          'data-brief="' + key + '" data-val="' + esc(o.k) + '">' + esc(o.l) + '</button>';
      }).join('') + '</div></div>' +
      (hint ? '<p class="ukWhy">' + hint + '</p>' : '') +
    '</div>';
  }

  function pickRow(label, items, sel, key, hint) {
    return '<div class="ukHire_f">' +
      '<p class="ukField_l">' + label + '</p>' +
      '<div class="ukChoice">' + items.map(function (it) {
        var k = typeof it === 'string' ? it : it.k, l = typeof it === 'string' ? it : it.l;
        return '<button class="ukPick' + (sel === k ? ' is-on' : '') + '" type="button" ' +
          'data-brief="' + key + '" data-val="' + esc(k) + '">' + esc(l) + '</button>';
      }).join('') + '</div>' +
      (hint ? '<p class="ukWhy">' + hint + '</p>' : '') + '</div>';
  }

  /* One field, one list, one globe — the shape the onboarding established, so a
     hotel meets the same control in both places. The query lives in view state
     rather than the brief: it is how you found the place, not part of the brief. */
  function placePicker(b, st) {
    var q = (st.destQ == null ? '' : st.destQ);
    var open = !!st.destOpen && q.trim().length > 0;
    var hits = [];
    if (open) {
      var needle = q.trim().toLowerCase();
      hits = (window.UKMARKETS || []).filter(function (d) {
        return d.n.toLowerCase().indexOf(needle) === 0;
      }).concat((window.UKMARKETS || []).filter(function (d) {
        var i = d.n.toLowerCase().indexOf(needle);
        return i > 0;
      })).slice(0, 8);
    }
    var chosen = b.destK ? (window.UKMARKETS || []).filter(function (d) { return d.k === b.destK; })[0] : null;
    return '<div class="ukPlace' + (open ? ' is-open' : '') + '">' +
      '<div class="ukPlace_wrap">' +
        (chosen && chosen.cc
          ? '<img class="ukPlace_f" src="/assets/img/flags/' + chosen.cc + '.svg" alt="" loading="lazy" decoding="async">'
          : '') +
        '<input class="ukField_i ukPlace_q" id="ukHireDest" data-destq value="' + esc(open ? q : (b.dest || '')) + '" ' +
          'placeholder="Try Miami, Kyoto, Lisbon\u2026" autocomplete="off" ' +
          'role="combobox" aria-expanded="' + open + '" aria-controls="ukPlaceList" aria-label="Your location">' +
        (open
          ? '<div class="ukPlace_drop"><ul class="ukPlace_list" id="ukPlaceList" role="listbox">' +
              (hits.length
                ? hits.map(function (d) {
                    return '<li><button class="ukPlace_o" type="button" role="option" ' +
                      'aria-selected="' + (d.k === b.destK) + '" data-destpick="' + esc(d.k) + '">' +
                      (d.cc ? '<img class="ukPlace_f" src="/assets/img/flags/' + d.cc + '.svg" alt="" loading="lazy" decoding="async">' : '') +
                      '<span class="ukPlace_on">' + esc(d.n) + '</span>' +
                      (d.sub ? '<span class="ukPlace_os">' + esc(d.sub) + '</span>' : '') +
                      '</button></li>';
                  }).join('')
                : '<li><p class="ukPlace_none">Nothing matches \u201c' + esc(q) + '\u201d.</p></li>') +
            '</ul></div>'
          : '') +
      '</div>' +
      '<div class="ukMapSlot ukMapSlot--hire" data-hiremap></div>' +
    '</div>';
  }

  function hire(st) {
    var b = brief(st);
    var rec = D.recommendMix(b);           // runs for real, every repaint
    var camp = D.CAMPAIGNS.filter(function (c) { return c.k === b.campaign; })[0] || D.CAMPAIGNS[0];

    return head('Who to host',
      'Tell us what the campaign is for and we will suggest a creator mix, with the reasoning. ' +
      'Change anything: it is a recommendation, not a plan.') +

      '<div class="ukHire">' +
        /* ---------------- the brief ---------------- */
        '<section class="ukPanel ukHire_brief">' +
          '<div class="ukPanel_head"><h3 class="ukPanel_title">Your campaign</h3></div>' +

          dropRow('What is this for?', D.CAMPAIGNS, b.campaign, 'campaign', esc(camp.hint) + '.') +
          dropRow('Your property', D.PROP_TYPES, b.prop, 'prop') +
          dropRow('Who are you trying to reach?', D.PERSONAS, b.persona, 'persona',
            'This is the single biggest input. A creator whose audience matches your guests beats a bigger one who does not.') +
          dropRow('The kind of traveller that suits you', TRAVEL, b.travelType, 'travelType',
            'Creators tell us how they travel. We match it to how your guests do.') +

          /* a count, so it is typed as a count — the old row of preset buttons
             could not express five */
          /* "How many hosted stays" was read as days, weeks and rooms by turns. It
             is a headcount: how many creators you can put up. The unit is now on
             the field itself, and the caveat moved behind an info button so it is
             there when wanted without adding a second block of text to every
             field on the form. */
          '<div class="ukHire_f">' +
            '<div class="ukField_lRow">' +
              '<label class="ukField_l" for="ukHireCap">How many creators can you host?</label>' +
              '<button class="ukInfo" type="button" data-info-toggle aria-expanded="false" ' +
                'aria-controls="ukCapWhy" aria-label="Why this matters">i</button>' +
            '</div>' +
            '<label class="ukField ukField--num ukField--unit">' +
              '<input class="ukField_i" type="number" inputmode="numeric" min="1" max="20" step="1" ' +
              'id="ukHireCap" data-briefnum="capacity" value="' + (b.capacity || 1) + '" ' +
              'aria-describedby="ukCapWhy">' +
              '<span class="ukField_u">' + ((b.capacity || 1) === 1 ? 'creator' : 'creators') + '</span>' +
            '</label>' +
            '<p class="ukWhy ukWhy--info" id="ukCapWhy" hidden>One creator, one hosted stay. We will never ' +
              'recommend more creators than you have said you can put up.</p>' +
          '</div>' +

          /* The same picker the onboarding uses: type, choose from the real market
             list, and the globe below follows the choice. Single-select, because a
             hotel is in exactly one place — the onboarding's version takes five. */
          '<div class="ukHire_f">' +
            '<p class="ukField_l">Where</p>' +
            placePicker(b, st) +
            '<p class="ukWhy">Creators are matched against how far they already travel to places like this.</p>' +
          '</div>' +
        '</section>' +

        /* ---------------- the recommendation ---------------- */
        '<section class="ukHire_out">' +
          '<article class="ukPanel ukRec">' +
            '<p class="ukRec_k">Suggested mix</p>' +
            '<h3 class="ukRec_h">' + rec.mix.map(function (m) {
              return m.n + ' ' + m.tier.l.toLowerCase() + (m.n > 1 ? ' creators' : ' creator');
            }).join(' and ') + '</h3>' +
            '<p class="ukRec_s">' + rec.total + ' hosted ' + (rec.total === 1 ? 'stay' : 'stays') +
              ' for a ' + esc(camp.l.toLowerCase()) + ' campaign' +
              (b.persona ? ' aimed at ' + esc(b.persona.toLowerCase()) : '') + '.</p>' +

            '<ul class="ukRecMix">' + rec.mix.map(function (m) {
              return '<li><span class="ukRecMix_n">' + m.n + '&times;</span>' +
                '<span class="ukRecMix_b"><span class="ukRecMix_t">' + esc(m.tier.l) +
                  ' <em>' + esc(m.tier.say) + '</em></span>' +
                '<span class="ukRecMix_w">' + esc(m.tier.note) + '</span></span></li>';
            }).join('') + '</ul>' +

            '<div class="ukRec_why"><p class="ukRec_whyT">Why this shape</p>' +
              rec.reasons.map(function (r) { return '<p class="ukRec_whyP">' + esc(r) + '</p>'; }).join('') +
            '</div>' +

            '<div class="ukRec_act">' +
              '<button class="ukBtn" type="button" data-goto="host">Open a stay for this</button>' +
              '<button class="ukGhost" type="button" data-goto="creators">Browse everyone</button>' +
            '</div>' +
          '</article>' +

          /* ---------------- who, specifically ---------------- */
          '<article class="ukPanel">' +
            '<div class="ukPanel_head"><h3 class="ukPanel_title">Who fits it</h3>' +
              '<span class="ukCount">' + rec.picks.length + ' in your network</span></div>' +
            (rec.picks.length
              ? (function () {
                  /* The whole point of a suggested mix is that you can act on it
                     in one move. Everyone is selected by default, because that is
                     what the recommendation just said; untick anyone you do not
                     want rather than building the list back up by hand. */
                  var sel = st.hirePick || (st.hirePick = rec.picks.reduce(function (a, p) { a[p.c.id] = true; return a; }, {}));
                  var n = rec.picks.filter(function (p) { return sel[p.c.id]; }).length;
                  return '<ul class="ukRecPicks">' + rec.picks.map(function (p) {
                    var on = !!sel[p.c.id];
                    return '<li>' +
                      '<button class="ukPickTog' + (on ? ' is-on' : '') + '" type="button" ' +
                        'data-hirepick="' + p.c.id + '" role="checkbox" aria-checked="' + on + '" ' +
                        'aria-label="Invite ' + esc(p.c.n) + '">' + (on ? TICK : '') + '</button>' +
                      img(p.c.img, p.c.n, 'ukAv ukAv--lg') +
                      '<div class="ukRecPicks_b">' +
                        '<p class="ukRecPicks_n">' + esc(p.c.n) +
                          '<span class="ukChip2 is-key">' + esc(p.s.tier.l) + '</span></p>' +
                        '<p class="ukRecPicks_m">' + D.fmt(p.c.f) + ' followers &middot; ' + esc(p.c.eng) +
                          ' engagement &middot; ' + flagOf(p.c) + esc(p.c.loc) + '</p>' +
                        '<p class="ukRecPicks_w">' + esc(p.why.length ? cap(p.why.join(', ')) : 'Available and reliable') + '.</p>' +
                      '</div>' +
                      '<button class="ukGhost ukGhost--sm" type="button" data-creator="' + p.c.id + '">View</button></li>';
                  }).join('') + '</ul>' +
                  '<div class="ukRecInvite">' +
                    '<button class="ukGhost ukGhost--sm" type="button" data-hirepick-all="' +
                      (n === rec.picks.length ? 'none' : 'all') + '">' +
                      (n === rec.picks.length ? 'Clear all' : 'Select all ' + rec.picks.length) + '</button>' +
                    '<button class="ukBtn" type="button" data-hireinvite' + (n ? '' : ' disabled') + '>' +
                      (n ? 'Invite ' + n + ' creator' + (n === 1 ? '' : 's') : 'Pick someone to invite') + '</button>' +
                  '</div>';
                })()
              : '<p class="ukWhy">Nobody in the network matches that brief closely yet. Widen the persona or the ' +
                'destination, or open the stay anyway and let creators apply.</p>') +
            (rec.substituted ? '<p class="ukWhy">' + rec.substituted +
              (rec.substituted === 1 ? ' of these is' : ' of these are') + ' outside the suggested band, ' +
              'because nobody in that band matches this brief yet. They are the closest fit we have. ' +
              'Opening the stay publicly will bring more in.</p>' : '') +
            (rec.shortfall ? '<p class="ukWhy">We could only fill ' + rec.picks.length + ' of the ' +
              (rec.picks.length + rec.shortfall) + '. Opening the stay publicly will bring more in.</p>' : '') +
          '</article>' +

          '<p class="ukWhy ukHire_note">This is a suggestion built from what tends to work, not a rule. ' +
          'Hotels that host one creator well usually do better than hotels that host four badly.</p>' +
        '</section>' +
      '</div>';
  }

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  /* a place is named with its flag wherever it appears, the way the market list
     and the creator card already do it */
  function flagOf(c) {
    var m = (c.markets || [])[0];
    return m && m.cc
      ? '<img class="ukCrFlag" src="/assets/img/flags/' + m.cc + '.svg" alt="" loading="lazy" decoding="async">'
      : '';
  }

  V.hire = hire;
  V.HIRE_TRAVEL = TRAVEL;
})();
