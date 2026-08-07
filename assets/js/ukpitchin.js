/* Ukreate — creator pitches arriving at a hotel. Loaded by BOTH apps.

   Pitch Pilot lets a creator write to a property. Until now that pitch went
   nowhere the hotel could see it: the creator's tracker recorded that they sent
   one, and the hotel's Collaborations list knew nothing about it.

   The awkward part is that an inquiry in this product hangs off a STAY — a hotel
   published something, a creator applied to it. A pitch is the other way round:
   the creator went first, and there is no stay yet. Two ways to model that:

     (a) invent a placeholder stay when the pitch lands, or
     (b) let a pitch be an inquiry with no stay, and let the hotel turn it into
         one if they want it.

   (a) is worse. It fills the hotel's Hosted stays page with rows it did not
   create and would have to tidy up after every pitch it passes on, and it forces
   the system to guess nights, inclusions and deliverables before anyone has
   agreed to anything. So: (b). A pitch is an inquiry whose stay is empty. The
   hotel reads what the creator is offering, and either builds a stay from it —
   the host flow opens prefilled with what the pitch proposed — or passes, and
   nothing is left behind.

   Held in localStorage on the shared origin, like the other cross-app records. */
window.UKPITCHIN = (function () {
  var KEY = 'uk_pitches_in_v1';

  function loadAll() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; }
  }
  function saveAll(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}
  }

  /* Only pitches addressed to THIS property reach this hotel. The demo has one
     property, so the match is by name.
     // PLUG-IN POINT — real addressing, once properties have ids. */
  var PROPERTY = 'MiraGrace Estate';

  function all() { return loadAll(); }
  function open() { return loadAll().filter(function (p) { return p.state === 'open'; }); }
  function forProperty(name) {
    return loadAll().filter(function (p) { return p.to === (name || PROPERTY); });
  }

  function send(pitch) {
    var list = loadAll();
    /* Derived from who sent it, not from the list's length: a length-based id
       changes meaning as the list changes, so the same pitch could be added twice
       or a seed could collide with a real one. */
    var id = pitch.id || ('pi-' + String(pitch.from || 'c1'));
    if (list.some(function (p) { return p.id === id; })) return null;
    list.unshift({
      id: id,
      to: pitch.to || PROPERTY,
      from: pitch.from || 'c1',
      fromName: pitch.fromName || '',
      angle: pitch.angle || '',           /* what they want to shoot */
      offer: pitch.offer || '',           /* what they will deliver */
      asks: pitch.asks || '',             /* what they are asking for */
      note: pitch.note || '',
      at: pitch.at || 'just now',
      state: 'open'                       /* open | building | passed | hosted */
    });
    saveAll(list);
    return list[0];
  }

  /* A pitch is a message, so it can be answered. The creator's own note is the
     first entry in the thread rather than a field beside it, because that is what
     it is — and a hotel that wants to ask one question before deciding should not
     have to either commit to a stay or pass in order to do it. */
  function thread(p) {
    if (!p) return [];
    var out = (p.msgs || []).slice();
    if (p.note) out.unshift({ by:'creator', tx:p.note, at:p.at });
    return out;
  }
  function reply(id, text, by) {
    var tx = String(text || '').trim();
    if (!tx) return null;
    var list = loadAll();
    var hit = null;
    list.forEach(function (p) {
      if (p.id !== id) return;
      p.msgs = p.msgs || [];
      p.msgs.push({ by: by || 'hotel', tx: tx, at: 'just now' });
      hit = p;
    });
    saveAll(list);
    return hit;
  }

  function setState(id, state) {
    var list = loadAll();
    list.forEach(function (p) { if (p.id === id) p.state = state; });
    saveAll(list);
    return list;
  }
  function byId(id) { return loadAll().filter(function (p) { return p.id === id; })[0] || null; }

  /* Turn the pitch's own words into the host flow's fields, so a hotel opens the
     builder with the creator's proposal already in it rather than retyping what it
     just read. Everything stays editable — this is the creator's offer, not a
     commitment, and the hotel is the one publishing.

     Matched against the vocabularies the flow already uses, so nothing invents a
     new inclusion or deliverable that the pickers cannot show. Anything it cannot
     confidently match is left out rather than guessed at. */
  var INC_WORDS = [
    [/\broom\b/i,               'Room'],
    [/\ball meals?\b/i,         'All meals'],
    [/\bhalf board\b/i,         'Half board'],
    [/\bbreakfast\b/i,          'Breakfast'],
    [/\bdinner\b/i,             'Dinner for two'],
    [/\btreatment\b/i,          'One spa treatment'],
    [/\bspa\b/i,                'Full spa access'],
    [/\bpool|gym\b/i,           'Pool and gym access'],
    [/\btransfer\b/i,           'Airport transfer'],
    [/\blate checkout\b/i,      'Late checkout'],
    [/\bparking\b/i,            'Parking'],
    [/\btour\b/i,               'Guided tour'],
    [/\bwine\b/i,               'Wine tasting'],
    [/\bbike\b/i,               'Bike hire']
  ];
  var DEL_WORDS = [
    [/long[- ]?form|youtube/i,   'Long-form / YouTube'],
    [/ugc\s*video|ugc/i,         'UGC video'],
    [/\breels?\b/i,             'Reels'],
    [/\bphotos?\b/i,            'Photos'],
    [/\bstor(y|ies)\b/i,        'Stories'],
    [/\bcarousels?\b/i,         'Carousels'],
    [/\bb[- ]?roll\b/i,         'B-roll'],
    [/\bdrone|aerial\b/i,       'Drone & aerial']
  ];

  function toBrief(p) {
    if (!p) return null;
    var asks = String(p.asks || ''), offer = String(p.offer || '');

    var nights = (asks.match(/(\d+)\s*night/i) || [])[1] || '';

    var incList = [];
    INC_WORDS.forEach(function (r) {
      if (r[0].test(asks) && incList.indexOf(r[1]) < 0) incList.push(r[1]);
    });

    /* "2 UGC videos, 6 photos" -> { 'UGC video': 2, 'Photos': 6 } */
    var del = {};
    offer.split(/,|\band\b/).forEach(function (part) {
      var q = (part.match(/(\d+)/) || [])[1];
      DEL_WORDS.some(function (r) {
        if (!r[0].test(part)) return false;
        del[r[1]] = (del[r[1]] || 0) + (q ? Number(q) : 1);
        return true;
      });
    });

    return { nights: nights, incList: incList, inc: incList.join(', '), del: del };
  }

  function reset() { saveAll([]); }

  /* SEEDED DEMONSTRATION PITCHES. Six real-shaped ones so the tab can be judged
     with something in it: different angles, different asks, and a spread of what
     creators actually propose. Seeded once — a hotel that passes on them does not
     get them back on the next reload.
     // PLUG-IN POINT — remove this block once pitches arrive from the creator app
     // in production. Nothing else depends on it. */
  var SEED = [
    { from:'c6',  fromName:'Theo Nakamura',   angle:'The suites at first light, and the spa before it opens',
      offer:'1 UGC video, 6 photos', asks:'2 nights, room and breakfast',
      note:'I shoot quiet luxury interiors. Two of my last three hotel pieces were reposted by the property for a year.', at:'2 hours ago' },
    { from:'c2',  fromName:'Kelvis Carter',   angle:'A day in the life, arrival to dinner',
      offer:'2 UGC videos, 4 photos', asks:'2 nights, room and one dinner',
      note:'My audience is Miami and south Florida, which is where most of your midweek gaps are.', at:'yesterday' },
    { from:'c10', fromName:'Leila Haddad',    angle:'The rooftop and the pool, golden hour',
      offer:'1 UGC video, 8 photos', asks:'3 nights, room and breakfast',
      note:'Happy to shoot in low season if that helps you fill a quiet week.', at:'2 days ago' },
    { from:'c5',  fromName:'Nadia Halvorsen', angle:'Wellness weekend, treatments and the quiet hours',
      offer:'1 UGC video, 5 photos, 2 reels', asks:'2 nights, room and one treatment',
      note:'I only pitch places I would go anyway. This is one of them.', at:'3 days ago' },
    { from:'c7',  fromName:'Priya Raman',     angle:'The restaurant, properly shot, plus the bar at night',
      offer:'2 UGC videos, 6 photos', asks:'1 night, room and dinner for two',
      note:'Food is most of what I shoot. I can turn this around inside a week.', at:'4 days ago' },
    { from:'c4',  fromName:'Brooklyn Reyes',  angle:'A long-form piece on the property and the area around it',
      offer:'1 long-form video, 10 photos', asks:'4 nights, room and breakfast',
      note:'Longer than you usually commission, but it keeps working for years rather than days.', at:'last week' }
  ];
  /* Demo seeding. Every one of the six is present and open on load, so the tab can
     always be judged with a full set — passing one in a demo should not thin out
     the thing you are trying to look at. Keyed by id, so this tops up what is
     missing rather than appending duplicates.
     // PLUG-IN POINT — delete this block when pitches arrive for real. */
  (function seed() {
    var have = {};
    loadAll().forEach(function (p) { have[p.id] = p; });
    SEED.forEach(function (x, i) {
      var id = 'pi-seed-' + (i + 1);
      if (!have[id]) { send(Object.assign({ id: id }, x)); return; }
      if (have[id].state !== 'open') setState(id, 'open');
    });
  })();

  return {
    PROPERTY: PROPERTY,
    all: all, open: open, forProperty: forProperty,
    send: send, setState: setState, byId: byId, toBrief: toBrief,
    thread: thread, reply: reply, reset: reset
  };
})();
