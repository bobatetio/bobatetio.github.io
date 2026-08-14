/* Ukreate — creator-side expansion data (features 1-5).
   Attaches to the existing UKC namespace rather than editing ukcdata.js, so the
   original data module stays reviewable and this run is easy to lift out.

   Everything seeded here is demonstration data. Anything that a real backend
   would own is marked with a PLUG-IN POINT and listed in EXPANSION_BUILD_LOG.md. */
(function () {
  var D = window.UKC;
  if (!D) return;

  var L = '/assets/img/';
  var F = '/assets/img/fc2/';

  /* ---------------- 1. travel type ----------------
     Distinct from `niche` (what they shoot). This is who they travel AS, which is
     what a hotel matches against its own guest persona. */
  D.TRAVEL_TYPES = [
    'Family travel', 'Digital nomad', 'Eco-conscious', 'Luxury',
    'Budget / backpacker', 'Adventure / outdoors', 'Food & culinary',
    'Wellness', 'Solo travel', 'Couples'
  ];

  /* ---------------- 2. age & interests ---------------- */
  // [REVIEW] Band rather than an exact age: it is the decision input hotels actually
  // use, it is far less intrusive to ask for, and it cannot go stale in the profile.
  D.AGE_BANDS = ['18 - 24', '25 - 34', '35 - 44', '45 - 54', '55+'];

  D.INTERESTS = [
    'Design & architecture', 'Local food', 'Slow mornings', 'Surfing', 'Hiking',
    'Yoga & movement', 'Coffee', 'Photography', 'Art & museums', 'Wildlife',
    'Wine & vineyards', 'Nightlife', 'Diving', 'Markets', 'Road trips'
  ];

  /* ---------------- collaboration types ----------------
     What a creator will accept, and what a hotel can offer — one vocabulary,
     read by both sides. A hosted stay is only one of four real arrangements;
     the other three involve real money, so a creator states which of these
     they will actually consider, the same way they already state their
     niches and formats. */
  D.COLLAB_TYPES = ['Hosted stay', 'Hosted stay + creative fee', 'Paid campaign'];

  /* PLUG-IN POINT — travel-type suggestion.
     Replace with: the real onboarding classifier, or simply drop it once creators
     have history to infer from. Today it maps the niche they already picked onto a
     sensible first guess so the field is never blank and never a mandate: one tap
     removes anything wrong. */
  var TYPE_HINTS = {
    'Wellness & slow travel':  ['Wellness', 'Solo travel'],
    'Food & drink':            ['Food & culinary', 'Couples'],
    'Adventure & outdoors':    ['Adventure / outdoors', 'Solo travel'],
    'Luxury & design':         ['Luxury', 'Couples'],
    'Family travel':           ['Family travel'],
    'Budget & backpacking':    ['Budget / backpacker', 'Digital nomad']
  };
  D.suggestTypes = function (niche) { return (TYPE_HINTS[niche] || ['Solo travel']).slice(); };

  /* PLUG-IN POINT — interest suggestion. Same idea: seeded map today, a real
     content classifier over their own posts later. */
  var INT_HINTS = {
    'Wellness & slow travel': ['Slow mornings', 'Yoga & movement', 'Design & architecture'],
    'Food & drink':           ['Local food', 'Markets', 'Wine & vineyards'],
    'Adventure & outdoors':   ['Hiking', 'Surfing', 'Road trips'],
    'Luxury & design':        ['Design & architecture', 'Art & museums', 'Wine & vineyards'],
    'Family travel':          ['Local food', 'Wildlife', 'Road trips'],
    'Budget & backpacking':   ['Markets', 'Hiking', 'Local food']
  };
  D.suggestInterests = function (niche) { return (INT_HINTS[niche] || ['Local food']).slice(); };

  /* the signed-in creator gains the new fields */
  D.me.types     = ['Wellness', 'Solo travel'];
  D.me.age       = '25 - 34';
  D.me.interests = ['Slow mornings', 'Design & architecture', 'Local food'];
  /* Seeded to the same two-thirds she already does — hosted stay first, plus
     being open to a fee on top. Paid campaign is a real option a creator
     can add, not assumed on. */
  D.me.collabTypes = ['Hosted stay', 'Hosted stay + creative fee'];
  /* Real numbers for the one paid arrangement she has actually turned on —
     "Hosted stay" alone never gets a rate, the stay is the payment. Left
     genuinely unset here is not the demo's job to fake; this is what an
     account that has actually filled the field in looks like. */
  D.me.rates = { 'Hosted stay + creative fee': 350 };
  /* window.UKME's own literal (ukshared.js) predates both of these fields,
     so a hotel opening her profile before either was ever manually saved
     would see none of this — the same gap markLessonDone() already closed
     for Academy badges, closed here too so what a fresh account starts
     with is what a hotel actually sees, not just what gets typed later.
     Only fills a genuinely empty record: ukshared.js already hydrated
     window.UKME from any real, persisted edit before this line runs, and
     a seed's job is to fill a gap, never to overwrite something that
     actually happened since. */
  if (window.UKME_SET && (!window.UKME.collabTypes || !window.UKME.collabTypes.length)) {
    window.UKME_SET({ collabTypes: D.me.collabTypes.slice(), rates: Object.assign({}, D.me.rates) });
  }

  /* ---------------- 4. profile: top stays, itinerary, partnership work ---------------- */
  D.me.topStays = [
    { id:'ts1', m:'reel2', hotel:'Casa Azul Tulum',  city:'Tulum, Mexico',      when:'Jan 2026',
      note:'Three nights in a jungle cabana. The room tour is still my best performing piece.' },
    { id:'ts2', m:'reel1', hotel:'Riad Amber',       city:'Marrakesh, Morocco', when:'Nov 2025',
      note:'Rooftop at sunrise, hammam in the afternoon. They reposted every frame.' },
    { id:'ts3', m:'reel5', hotel:'MiraGrace Estate', city:'Miami, Florida',     when:'Sep 2025',
      note:'Two midweek nights. Quiet property, unhurried shoot, easy people.' }
  ];

  /* A curated itinerary is the creator's taste as a deliverable. It doubles as a
     mood board (feature 5) that happens to be ordered by day. */
  D.me.itinerary = {
    id:'it1', t:'Three slow days in Lisbon', city:'Lisbon, Portugal', days:3,
    blurb:'What I actually send friends. Nothing here needs a car and nothing starts before nine.',
    m:'reel4',
    stops:[
      { d:'Day one', t:'Alfama, on foot',      m:'shot1', note:'Start late. Coffee at the top, walk down, lose the map.' },
      { d:'Day two', t:'Market and the water', m:'shot2', note:'Time Out Market early, then the ferry across for the light.' },
      { d:'Day three', t:'Sintra, slowly',     m:'shot3', note:'One palace, not four. Lunch in town afterwards.' }
    ]
  };

  D.me.partnerWork = [
    { id:'pw1', m:'reel2', hotel:'Casa Azul Tulum', t:'Room tour, garden suite',
      out:'2 videos, 6 photos', rights:'They keep and post it', plays:28700 },
    { id:'pw2', m:'reel1', hotel:'Riad Amber',      t:'Sunrise at the riad',
      out:'1 video, 8 photos', rights:'They keep and post it', plays:41200 },
    { id:'pw3', m:'reel3', hotel:'MiraGrace Estate',t:'Breakfast on the terrace',
      out:'1 video, 3 photos', rights:'They keep and post it', plays:19400 }
  ];

  /* ---------------- 3. hotel profile (creator-facing) ----------------
     Extends each stay with what a creator actually decides on. Keyed by stay id so
     nothing in the original stays array had to move. */
  var PROFILES = {
    s1: { propType:'Boutique wellness estate', rooms:34, persona:'Couples and solo guests, 30-50, wellness-led',
          about:'A quiet estate ten minutes from the water. Low-rise, heavy on garden, built around a spa ' +
                'that guests actually book rather than walk past.',
          amen:['Full spa and hammam','Two restaurants','Adults-only pool','Airport transfer'],
          rules:'Shoot anywhere except inside other guests’ rooms. Tripods fine outside peak breakfast.',
          gallery:['hero_bg_room.jpg','hero_bg_lobby.webp','hero_bg_indoor.webp','hero_bg_outdoor.webp'],
          past:[{ n:'Amara Mensah', h:'@amaratravels', out:'1 video, 3 photos' },
                { n:'Theo Nakamura', h:'@theonak',     out:'2 videos, 6 photos' }],
          resp:'usually within a day', hosted:11, guide:'g1' },
    s2: { propType:'Independent design hotel', rooms:18, persona:'Design-led couples, 28-45',
          about:'Eighteen cabanas in the jungle, five minutes from the beach road. Built by the owners, ' +
                'who still run it. No two rooms are the same.',
          amen:['Cenote access','All meals included','Bikes','Yoga deck'],
          rules:'Full run of the property before 10am. Please ask before shooting the restaurant at dinner.',
          gallery:['hero_bg_outdoor.webp','hero_bg_grand.webp','hero_bg_custom.webp'],
          past:[{ n:'Amara Mensah', h:'@amaratravels', out:'2 videos, 6 photos' },
                { n:'Sofia Marchetti', h:'@sofiam',    out:'1 video, 4 photos' }],
          resp:'usually within a day', hosted:19, guide:'g2' },
    s3: { propType:'Riad, old town', rooms:9, persona:'Couples and solo travellers, 30-45, design and food',
          about:'Nine rooms around a courtyard in the medina. Rooftop for breakfast and sunset. ' +
                'Ten minutes’ walk from the square, which is close enough and far enough.',
          amen:['Hammam','Rooftop terrace','Breakfast included','Airport pickup'],
          rules:'Rooftop is yours at sunrise. The courtyard is shared, so evenings are quieter for shooting.',
          gallery:['hero_bg_indoor.webp','hero_bg_hotel.webp','hero_bg_burj.webp'],
          past:[{ n:'Amara Mensah', h:'@amaratravels', out:'1 video, 8 photos' }],
          resp:'usually same day', hosted:7, guide:null }
  };
  var FALLBACK = { propType:'Independent property', rooms:24, persona:'Independent travellers, 25-45',
    about:'An independent property hosting creators on nights it has not sold.',
    amen:['Breakfast included','Wi-Fi throughout'], rules:'Shoot anywhere guests can go.',
    gallery:['hero_bg_hotel.webp','hero_bg_lobby.webp'], past:[], resp:'usually within two days',
    hosted:3, guide:null };

  /* PLUG-IN POINT — hotel profile content.
     Replace with: the hotel's own profile record from the hotel side of the API.
     The shape here is exactly what that record needs to return. */
  D.hotelProfile = function (stayId) {
    var p = PROFILES[stayId] || FALLBACK;
    return {
      propType:p.propType, rooms:p.rooms, persona:p.persona, about:p.about,
      amen:p.amen, rules:p.rules, past:p.past, resp:p.resp, hosted:p.hosted,
      guide:p.guide,
      gallery:p.gallery.map(function (g) { return L + g; })
    };
  };

  /* ---------------- 7. guest guide, creator-facing read ----------------
     The hotel authors this on its own side (ukguide.js). A creator only ever reads
     it, and only for a property they are hosted at or looking at.
     PLUG-IN POINT — replace with the shared guide record. */
  D.GUIDES = {
    g1: { t:'MiraGrace Estate', sub:'Everything for your stay', updated:'12 Feb 2026',
      sections:[
        { k:'welcome', t:'Welcome', body:'Check-in is from 3pm, and reception is staffed around the clock. ' +
          'Ask for Robert if anything at all is missing.' },
        { k:'access',  t:'Wi-Fi and access', body:'Network MiraGrace-Guest, password in your room folder. ' +
          'Your key card opens the spa and the pool gate until 10pm.' },
        { k:'local',   t:'Nearby, worth your time', body:'Coffee at Panther on the corner. The best swim is the ' +
          'north end of the beach, ten minutes on foot. Book Casa Nube for dinner two days ahead.' },
        { k:'amen',    t:'What is included', body:'Breakfast until 10.30, the adults-only pool, and one spa ' +
          'treatment on a hosted stay. Bikes are free and live by the side gate.' },
        { k:'house',   t:'House notes', body:'Quiet hours after 11pm in the garden wing. Tripods are welcome ' +
          'outside peak breakfast. Please ask before filming other guests.' },
        { k:'safety',  t:'Safety and contacts', body:'Reception dial 0. Local emergency 911. ' +
          'Nearest clinic is eight minutes by car and reception will call one.' }
      ] },
    g2: { t:'Casa Azul Tulum', sub:'Your stay, and the bits worth knowing', updated:'02 Mar 2026',
      sections:[
        { k:'welcome', t:'Welcome', body:'We are a small team and we all do a bit of everything. ' +
          'Whoever you find first can help.' },
        { k:'access',  t:'Wi-Fi and access', body:'Network CasaAzul, password casaazul2026. Signal is strong ' +
          'in the main house and patchy in the cabanas, which is mostly the point.' },
        { k:'local',   t:'Nearby, worth your time', body:'The cenote is fifteen minutes by bike and best before ' +
          'eleven. Taqueria Honorio for breakfast tacos, and go early.' },
        { k:'amen',    t:'What is included', body:'All meals, the cenote trip, and the bikes. ' +
          'Yoga on the deck at 8am most mornings.' },
        { k:'house',   t:'House notes', body:'Full run of the property before 10am for shooting. ' +
          'Please ask before filming in the restaurant at dinner.' },
        { k:'safety',  t:'Safety and contacts', body:'Main house is staffed until midnight. ' +
          'Emergency 911. Nearest pharmacy is on the beach road.' }
      ] }
  };
  D.guide = function (id) { return D.GUIDES[id] || null; };
})();
