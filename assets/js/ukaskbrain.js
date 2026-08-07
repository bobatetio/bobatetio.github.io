/* Ukreate — the assistant's reasoning, in the browser. Loaded by BOTH apps.

   There is no model behind this. The server can call Sonnet when it has a key,
   and the panel prefers that when it is available — but with no key the endpoint
   was silently returning canned strings, which is why the bar behaved like a dead
   search box no matter what anyone typed.

   So this is a real engine rather than a stand-in: it holds the same slots the
   Host a creator form holds, asks for exactly the ones it is missing, one at a
   time, and offers every answer as chips built from the product's own
   vocabularies. It cannot improvise a sentence, and it does not pretend to — but
   it can genuinely complete the job, which the mock could not.

   The important rule it enforces: NOTHING is offered until everything is known.
   "Find me wellness creators" does not jump to a result — it asks what else it
   needs first, because a half-specified search is a worse answer than a question. */
window.UKASKBRAIN = (function () {

  function uniq(a) { return a.filter(function (v, i, s) { return s.indexOf(v) === i; }); }
  function has(hay, needle) { return String(hay || '').toLowerCase().indexOf(needle) > -1; }
  function titles(list, n) { return (list || []).slice(0, n || 8); }

  /* ---- the product's real vocabularies, read live so chips can never offer
          something the rest of the app cannot deliver ---- */
  function vocab() {
    var V = window.UKVOCAB || {};
    var D = window.UK || window.UKC || {};
    var creators = (window.UK && window.UK.creators) || [];
    var cats = [];
    creators.forEach(function (c) { (c.cats || [c.type]).forEach(function (t) { if (t) cats.push(t); }); });
    return {
      shoots:  uniq(cats.length ? cats : (V.SHOOTS || [])),
      formats: (V.FORMATS || []).slice(),
      markets: uniq(creators.reduce(function (a, c) {
        (c.markets || []).forEach(function (m) { a.push(m.n); }); return a; }, [])),
      includes: ['Room', 'Breakfast', 'All meals', 'One spa treatment', 'Dinner for two',
                 'Airport transfer', 'Late checkout', 'Pool and gym access'],
      nights: ['1 night', '2 nights', '3 nights', '4 nights', '5 nights'],
      capacity: ['1 creator', '2 creators', '3 creators', '4 creators', '5 creators'],
      platforms: ((window.UKV && window.UKV.PLATFORMS) || []).map(function (p) { return p.n; }),
      when: ['This month', 'Next month', 'In three months', 'Midweek only', 'A specific weekend', 'No fixed date']
    };
  }

  /* ---- slots. Same fields Host a creator asks for, in the order a person would
          actually think about them: what you give, then what you get, then who
          and when. ---- */
  var HOTEL_STAY = [
    { k:'nights',   q:'How many nights are you offering?',            multi:false, chips:function (v) { return v.nights; } },
    { k:'includes', q:'What does the stay include?',                  multi:true,  chips:function (v) { return v.includes; } },
    { k:'deliver',  q:'And what do you want back?',                   multi:true,  chips:function (v) { return titles(v.formats, 8); } },
    { k:'shoots',   q:'What kind of creator fits this?',              multi:true,  chips:function (v) { return titles(v.shoots, 8); } },
    { k:'capacity', q:'How many creators can you host?',              multi:false, chips:function (v) { return v.capacity; } },
    { k:'when',     q:'When is it for?',                              multi:false, chips:function (v) { return v.when; } }
  ];
  var HOTEL_FIND = [
    { k:'shoots',   q:'What kind of creator are you after?',          multi:true,  chips:function (v) { return titles(v.shoots, 8); } },
    { k:'formats',  q:'What should they be able to make?',            multi:true,  chips:function (v) { return titles(v.formats, 8); } },
    { k:'plats',    q:'Anywhere in particular they should post?',     multi:true,  chips:function (v) { return v.platforms.concat(['Anywhere']); } },
    { k:'avail',    q:'Do they need to be free now?',                 multi:false, chips:function () { return ['Available now', 'Any time']; } }
  ];
  var CREATOR_FIND = [
    { k:'style',    q:'What kind of place are you after?',            multi:true,  chips:function (v) { return titles(v.shoots, 8); } },
    { k:'where',    q:'Anywhere you want to be?',                     multi:true,  chips:function (v) { return titles(v.markets, 8).concat(['Anywhere']); } },
    { k:'when',     q:'When could you travel?',                       multi:false, chips:function (v) { return v.when; } }
  ];

  var INTENTS = {
    stay:        { side:'hotel',   slots:HOTEL_STAY,   view:'host',      cta:'Open Host a creator' },
    findCreator: { side:'hotel',   slots:HOTEL_FIND,   view:'creators',  cta:'Show me who fits' },
    findStay:    { side:'creator', slots:CREATOR_FIND, view:'discover',  cta:'Show me these stays' }
  };

  /* ---- reading the opening line ----
     Not language understanding: keyword matching against the same vocabularies the
     chips come from. It only has to get the INTENT right and pick up anything the
     person already said, because everything after that is asked explicitly. */
  function detect(side, text) {
    var t = String(text || '').toLowerCase();
    if (side === 'creator') return 'findStay';
    var wantsStay = has(t, 'stay') || has(t, 'host') || has(t, 'launch') || has(t, 'weekend') ||
                    has(t, 'offer') || has(t, 'room') || has(t, 'night') || has(t, 'campaign') ||
                    has(t, 'fill') || has(t, 'midweek');
    return wantsStay ? 'stay' : 'findCreator';
  }

  /* anything the opening line already answers is not asked again */
  function prefill(intent, text, v) {
    var t = String(text || '').toLowerCase(), slots = {};
    var nights = t.match(/(\d+)\s*night/);
    if (nights) slots.nights = [nights[1] + (nights[1] === '1' ? ' night' : ' nights')];
    var cap = t.match(/(\d+)\s*creator/);
    if (cap) slots.capacity = [cap[1] + (cap[1] === '1' ? ' creator' : ' creators')];
    var hitShoots = v.shoots.filter(function (s) {
      return has(t, s.toLowerCase().split(' &')[0]);
    });
    if (hitShoots.length) { slots.shoots = hitShoots; slots.style = hitShoots; }
    var hitFormats = v.formats.filter(function (f) { return has(t, f.toLowerCase().split(' /')[0]); });
    if (hitFormats.length) { slots.formats = hitFormats; slots.deliver = hitFormats; }
    var hitMarkets = v.markets.filter(function (m) { return has(t, m.split(',')[0].toLowerCase()); });
    if (hitMarkets.length) slots.where = hitMarkets;
    if (has(t, 'weekend')) slots.when = ['A specific weekend'];
    if (has(t, 'midweek')) slots.when = ['Midweek only'];
    return slots;
  }

  /* ---- the loop ---- */
  function start(side, text) {
    var v = vocab();
    var key = detect(side, text);
    var st = { intent:key, slots: prefill(key, text, v), asked: [] };
    return step(side, st, opening(side, key, st.slots));
  }

  function opening(side, key, slots) {
    var known = Object.keys(slots).length;
    if (side === 'creator') return known ? 'Good brief. Let me narrow it.' : 'Let us find you somewhere.';
    if (key === 'stay') return known ? 'Right, I can shape that into a stay.' : 'Let us build the stay.';
    return known ? 'Got it. A couple more things and I can pull the list.' : 'Happy to find them.';
  }

  /* Answer a slot, then hand back the next question — or the finished card. */
  function step(side, st, message) {
    var v = vocab();
    var def = INTENTS[st.intent];
    var next = null;
    for (var i = 0; i < def.slots.length; i++) {
      var sl = def.slots[i];
      if (!st.slots[sl.k] || !st.slots[sl.k].length) { next = sl; break; }
    }

    if (next) {
      return {
        kind: 'ask',
        state: st,
        message: message || '',
        question: next.q,
        slot: next.k,
        multi: next.multi,
        chips: next.chips(v).slice(0, 10),
        mock: false
      };
    }
    return { kind: 'done', state: st, message: message || 'That is everything I need.',
             summary: summarise(side, st), cta: def.cta, view: def.view,
             prefill: toPrefill(side, st), mock: false };
  }

  function answer(side, st, slotKey, values) {
    st.slots[slotKey] = (values || []).slice();
    if (st.asked.indexOf(slotKey) < 0) st.asked.push(slotKey);
    return step(side, st, ack(slotKey, values));
  }

  function ack(k, values) {
    var n = (values || []).length;
    if (!n) return 'Noted.';
    if (k === 'nights')   return 'Good.';
    if (k === 'includes') return n > 1 ? 'That is a generous one.' : 'Simple and clear.';
    if (k === 'deliver')  return 'That is a fair ask for it.';
    if (k === 'shoots')   return 'Right kind of person.';
    if (k === 'capacity') return 'Noted.';
    return 'Got it.';
  }

  /* ---- what it assembled, in the reader's own words ---- */
  function summarise(side, st) {
    var s = st.slots, rows = [];
    function add(l, k) { if (s[k] && s[k].length) rows.push([l, s[k].join(', ')]); }
    if (st.intent === 'stay') {
      add('You give', 'nights'); add('Included', 'includes');
      add('You get', 'deliver'); add('Creator', 'shoots');
      add('Capacity', 'capacity'); add('When', 'when');
    } else if (st.intent === 'findCreator') {
      add('They shoot', 'shoots'); add('They make', 'formats');
      add('They post on', 'plats'); add('Availability', 'avail');
    } else {
      add('Kind of place', 'style'); add('Where', 'where'); add('When', 'when');
    }
    return rows;
  }

  /* ---- the handoff. Shapes the answers into what each view already accepts, so
          nothing here is a parallel creation path. ---- */
  function toPrefill(side, st) {
    var s = st.slots;
    if (st.intent === 'stay') {
      var nights = (s.nights && s.nights[0] || '').match(/\d+/);
      var cap = (s.capacity && s.capacity[0] || '').match(/\d+/);
      var del = {};
      (s.deliver || []).forEach(function (d) { del[d] = del[d] ? del[d] + 1 : 1; });
      return { step: 1, form: {
        pkg: 'blank',
        nights: nights ? nights[0] : '',
        incList: (s.includes || []).slice(),
        inc: (s.includes || []).join(', '),
        del: del,
        type: (s.shoots && s.shoots[0]) || (window.UK && window.UK.property.cat) || '',
        capacity: cap ? cap[0] : '',
        photos: [], guide: {}, brief: '', date: '', reach: '',
        visibility: 'public', invited: []
      } };
    }
    if (st.intent === 'findCreator') {
      return { niche: (s.shoots || []).slice(), makes: (s.formats || []).slice(),
               plat: [], avail: (s.avail || [])[0] === 'Available now' ? 'now' : 'all' };
    }
    return { style: (s.style || [])[0] || 'all' };
  }

  return { start: start, answer: answer, vocab: vocab, INTENTS: INTENTS };
})();
