/* Ukreate — hotel-side expansion data and logic (features 6 and 7).
   Attaches to the existing UK namespace. Hotel side only.

   The recommendation engine below is ILLUSTRATIVE BUT FUNCTIONAL: it really runs,
   really scores the seeded creator supply, and returns a real actionable mix. What
   it does not have is live audience data or live creator supply. Both are behind
   PLUG-IN POINT seams and listed in EXPANSION_BUILD_LOG.md. */
(function () {
  var D = window.UK;
  if (!D) return;

  /* ---------------- tier definitions ----------------
     [REVIEW] Tier boundaries and the "micro is the ROI sweet spot" rule are
     commercial calls. They follow the widely used creator-marketing bands and the
     standard hospitality finding that 5K-50K accounts deliver the best
     engagement-per-cost for hosted stays. Robert should confirm both. */
  D.TIERS = [
    { k:'nano',  l:'Nano',  lo:0,      hi:5000,    say:'Under 5K',    note:'Highest engagement, smallest reach. Cheap to host, very local.' },
    { k:'micro', l:'Micro', lo:5000,   hi:50000,   say:'5K - 50K',    note:'The sweet spot for hosted stays: real engagement, real intent, easy to book.' },
    { k:'mid',   l:'Mid',   lo:50000,  hi:500000,  say:'50K - 500K',  note:'Reach with credibility. One of these anchors a campaign.' },
    { k:'macro', l:'Macro', lo:500000, hi:Infinity,say:'500K+',       note:'Awareness at scale. Expensive to host and rarely converts directly.' }
  ];
  D.tierOf = function (followers) {
    for (var i = 0; i < D.TIERS.length; i++) {
      if (followers >= D.TIERS[i].lo && followers < D.TIERS[i].hi) return D.TIERS[i];
    }
    return D.TIERS[D.TIERS.length - 1];
  };

  /* ---------------- the inputs a hotel actually has ---------------- */
  /* Four options covered a launch and a slow season and nothing else a hotel
     actually runs. These are the reasons properties give for wanting content, and
     each one changes the recommendation: a midweek gap wants volume, a rebrand
     wants reach, a restaurant wants people who shoot food. Anything added here
     must fall back cleanly in recommendMix — see WEIGHTS below. */
  D.CAMPAIGNS = [
    { k:'launch',     l:'Launch',                hint:'A new property, wing or restaurant' },
    { k:'seasonal',   l:'Seasonal push',         hint:'Fill a specific window' },
    { k:'midweek',    l:'Midweek and low nights',hint:'Move the nights that never sell' },
    { k:'evergreen',  l:'Evergreen',             hint:'Keep a library of content topped up' },
    { k:'awareness',  l:'Awareness',             hint:'Be known in a new market' },
    { k:'rebrand',    l:'Rebrand or refurb',     hint:'The property has changed and the pictures have not' },
    { k:'restaurant', l:'Restaurant or bar',     hint:'Fill covers, not just rooms' },
    { k:'spa',        l:'Spa and wellness',      hint:'Sell the treatments, not the room' },
    { k:'event',      l:'An event or a date',    hint:'A festival, a race weekend, a season opening' },
    { k:'direct',     l:'Direct bookings',       hint:'Take nights back off the OTAs' }
  ];
  D.PROP_TYPES = ['Boutique', 'Resort', 'City hotel', 'Villa or estate', 'Eco lodge',
                  'Aparthotel', 'Guesthouse or B&B', 'Hostel', 'Serviced apartments',
                  'Glamping or cabins', 'Spa or wellness retreat', 'Ski or mountain lodge',
                  'Beach or island property', 'Safari or wildlife lodge', 'Historic or heritage'];
  D.PERSONAS = ['Families', 'Couples', 'Solo travellers', 'Digital nomads',
                'Luxury travellers', 'Budget travellers', 'Adventure travellers',
                'Wellness guests', 'Food travellers', 'Honeymooners',
                'Business travellers', 'Groups and friends', 'Older travellers',
                'Pet owners', 'Accessible travellers', 'LGBTQ+ travellers'];

  /* PLUG-IN POINT — creator supply.
     Replace with: a live query against the real creator index, filtered by
     availability and destination. The shape below is what that query must return:
     followers, tier, travel types, the personas they reach, engagement and
     reliability. Today it enriches the seeded creators already in ukdata.js. */
  var SUPPLY = {
    c1:  { types:['Wellness','Solo travel','Luxury'],           reaches:['Wellness guests','Couples','Solo travellers'] },
    c2:  { types:['Budget / backpacker','Solo travel'],         reaches:['Budget travellers','Solo travellers'] },
    c3:  { types:['Luxury','Couples'],                          reaches:['Luxury travellers','Couples'] },
    c4:  { types:['Family travel'],                             reaches:['Families'] },
    c5:  { types:['Adventure / outdoors','Solo travel'],        reaches:['Adventure travellers','Solo travellers'] },
    c6:  { types:['Food & culinary','Couples'],                 reaches:['Food travellers','Couples'] },
    c7:  { types:['Digital nomad','Budget / backpacker'],       reaches:['Digital nomads','Budget travellers'] },
    c8:  { types:['Eco-conscious','Adventure / outdoors'],      reaches:['Adventure travellers','Wellness guests'] },
    c9:  { types:['Luxury','Wellness'],                         reaches:['Luxury travellers','Wellness guests'] },
    c10: { types:['Family travel','Couples'],                   reaches:['Families','Couples'] }
  };
  /* PLUG-IN POINT — creator supply, part two.
     The seeded network was written to showcase profiles, so it skews mid-tier. The
     real market does not: micro creators (5K-50K) are the large majority, and they
     are exactly the band the engine recommends most. These six make the supply
     representative enough for the recommendation to be actionable rather than
     theoretical. Replace the whole list with the live creator index. */
  var AV = '/assets/img/fc/av/';
  var MICRO = [
    { id:'c11', n:'Priya Raman',    h:'@priyaroams',   loc:'Lisbon, Portugal',    img:AV+'av-03.jpg',
      f:18400, eng:'7.8%', type:'Wellness & spa',      stays:9,  ontime:100, rating:4.9,
      free:'Available now', lat:38.72, lng:-9.14,
      langs:'English, Tamil', age:'25-34 (61%)', gender:'68% women', tops:'Portugal, UK, India',
      reach:'6K per post', resp:'within 3 hours',
      bio:'Small audience, high intent. Books out three months ahead.',
      proof:'Her last riad feature sold out the property for the following weekend.',
      plats:[{k:'ig',n:'Instagram',f:18400}], p:['ig'], worked:[], been:[] },
    { id:'c12', n:'Tomas Neder',    h:'@tomasneder',   loc:'Miami, USA',          img:AV+'av-05.jpg',
      f:31200, eng:'6.1%', type:'Hotel & resort UGC',  stays:14, ontime:99,  rating:4.8,
      free:'From 02 Mar', lat:25.76, lng:-80.19,
      langs:'English, Spanish', age:'25-34 (54%)', gender:'52% women', tops:'USA, Mexico, Brazil',
      reach:'9K per post', resp:'within 6 hours',
      bio:'Straight UGC. Raw files always included, no negotiation needed.',
      proof:'Delivered 22 usable clips from a two-night stay last season.',
      plats:[{k:'ig',n:'Instagram',f:21000},{k:'tt',n:'TikTok',f:10200}], p:['ig','tt'], worked:[], been:[] },
    { id:'c13', n:'Ama Boateng',    h:'@amaboateng',   loc:'Accra, Ghana',        img:AV+'av-07.jpg',
      f:9800,  eng:'9.2%', type:'Boutique & design',   stays:5,  ontime:100, rating:5.0,
      free:'Available now', lat:5.60, lng:-0.19,
      langs:'English, Twi', age:'25-34 (58%)', gender:'74% women', tops:'Ghana, UK, USA',
      reach:'4K per post', resp:'within 2 hours',
      bio:'Design-led properties and the people who run them.',
      proof:'Highest save rate of any creator on the network last quarter.',
      plats:[{k:'ig',n:'Instagram',f:9800}], p:['ig'], worked:[], been:[] },
    { id:'c14', n:'Jonas Vik',      h:'@jonasvik',     loc:'Ålesund, Norway',     img:AV+'av-08.jpg',
      f:44100, eng:'5.4%', type:'Mountain & ski',      stays:18, ontime:97,  rating:4.7,
      free:'From 18 Mar', lat:62.47, lng:6.15,
      langs:'English, Norwegian', age:'25-34 (49%)', gender:'44% women', tops:'Norway, Germany, UK',
      reach:'12K per post', resp:'within a day',
      bio:'Cold water, long light, properties that sit in the landscape.',
      proof:'Drove a 2-week booking bump for a fjord lodge in low season.',
      plats:[{k:'ig',n:'Instagram',f:29000},{k:'yt',n:'YouTube',f:15100}], p:['ig','yt'], worked:[], been:[] },
    { id:'c15', n:'Lena Fischer',   h:'@lenaandkids',  loc:'Munich, Germany',     img:AV+'av-09.jpg',
      f:26700, eng:'6.9%', type:'Family travel',       stays:11, ontime:100, rating:4.9,
      free:'Available now', lat:48.14, lng:11.58,
      langs:'English, German', age:'35-44 (57%)', gender:'81% women', tops:'Germany, Austria, Italy',
      reach:'8K per post', resp:'within 5 hours',
      bio:'Family travel that is honest about what it is actually like with two under ten.',
      proof:'Her family-suite review is still the top referrer for the property a year on.',
      plats:[{k:'ig',n:'Instagram',f:26700}], p:['ig'], worked:[], been:[] },
    { id:'c16', n:'Yusuf Adeyemi',  h:'@yusufeats',    loc:'Marrakesh, Morocco',  img:AV+'av-10.jpg',
      f:13500, eng:'8.3%', type:'Food & culinary',     stays:7,  ontime:98,  rating:4.8,
      free:'From 09 Mar', lat:31.63, lng:-8.00,
      langs:'English, Arabic, French', age:'25-34 (63%)', gender:'49% women', tops:'Morocco, France, UK',
      reach:'5K per post', resp:'within 4 hours',
      bio:'Kitchens, markets, and the person who cooked it.',
      proof:'Restaurant covers up 30% the fortnight after her last feature.',
      plats:[{k:'ig',n:'Instagram',f:13500}], p:['ig'], worked:[], been:[] }
  ];
  MICRO.forEach(function (c) {
    if (!D.creators.some(function (x) { return x.id === c.id; })) D.creators.push(c);
  });
  SUPPLY.c11 = { types:['Wellness','Solo travel'],            reaches:['Wellness guests','Solo travellers'] };
  SUPPLY.c12 = { types:['Couples','Luxury'],                  reaches:['Couples','Luxury travellers'] };
  SUPPLY.c13 = { types:['Luxury','Couples'],                  reaches:['Luxury travellers','Couples'] };
  SUPPLY.c14 = { types:['Adventure / outdoors','Eco-conscious'], reaches:['Adventure travellers','Solo travellers'] };
  SUPPLY.c15 = { types:['Family travel'],                     reaches:['Families','Couples'] };
  SUPPLY.c16 = { types:['Food & culinary','Solo travel'],     reaches:['Food travellers','Couples'] };

  D.supplyOf = function (c) {
    var s = SUPPLY[c.id] || { types:['Solo travel'], reaches:['Solo travellers'] };
    return { types:s.types, reaches:s.reaches, tier:D.tierOf(c.f) };
  };

  /* ---------------- the recommendation engine ----------------
     PLUG-IN POINT — the mix rules.
     Replace with: whatever the commercial team settles on, ideally tuned against
     real campaign outcomes. The interface is stable: takes the brief, returns
     { mix, reasons, picks, notes }. Nothing in the view knows how it decided.

     The rules encoded here, in plain terms:
       - micro (5K-50K) is the backbone of every mix, because that band converts
       - a launch or an awareness push needs one anchor with real reach
       - evergreen wants fewer creators working more often, not a crowd
       - never recommend more creators than the hotel has nights for
       - persona match beats follower count, always                                */
  var SHAPES = {
    launch:    { anchor:'mid',   microShare:0.75, min:3, why:'A launch needs one account with reach to make the announcement land, and a group of micro creators underneath it so the content keeps arriving for weeks afterwards.' },
    seasonal:  { anchor:null,    microShare:1.0,  min:2, why:'A seasonal window is short, so volume beats reach. Micro creators book faster, turn content around faster, and their audiences actually travel.' },
    evergreen: { anchor:null,    microShare:1.0,  min:2, why:'Evergreen is about a steady library, not a spike. Fewer creators hosted more often gives you a consistent look and people who already know the property.' },
    awareness: { anchor:'mid',   microShare:0.6,  min:3, why:'Awareness in a new market is the one case where reach is worth paying for. Anchor it with a mid-tier account, then use micro creators to make it feel like more than one voice.' },
    midweek:   { anchor:null,    microShare:1.0,  min:2, why:'Midweek nights are a volume problem, not a reach problem. Micro creators are the ones whose audiences can actually move a Tuesday, and they are the ones who will take a midweek date.' },
    rebrand:   { anchor:'mid',   microShare:0.7,  min:3, why:'A refurb is only real once people have seen it. One account with reach carries the news, and a group underneath it replaces the old library with new pictures across every channel at once.' },
    restaurant:{ anchor:null,    microShare:1.0,  min:2, why:'Covers are local and immediate, so this is a job for people whose audience is in reach of the table. Food travels best as short video, shot often, by several people rather than one.' },
    spa:       { anchor:null,    microShare:1.0,  min:2, why:'Treatments sell on trust rather than scale. A smaller creator who genuinely covers wellness will out-convert a large general travel account every time.' },
    event:     { anchor:'mid',   microShare:0.7,  min:3, why:'A date is a deadline. One anchor account gives the weekend a headline, and micro creators around it produce enough content on the day that it looks busy from the outside.' },
    direct:    { anchor:null,    microShare:1.0,  min:2, why:'Taking nights back off the OTAs is about tracked links in the hands of people whose audience books directly. That is the micro band, hosted often, each carrying their own link.' }
  };

  D.recommendMix = function (brief) {
    var shape = SHAPES[brief.campaign] || SHAPES.seasonal;
    var capacity = Math.max(1, brief.capacity || 4);

    /* How many creators. Capacity is a HARD ceiling, not a preference: the screen
       promises we will never recommend more creators than the hotel has nights for,
       so the shape's minimum can never override it. */
    var want = Math.min(capacity, Math.max(shape.min, Math.round(capacity * 0.9)));
    var anchors = shape.anchor && want >= 3 ? 1 : 0;
    var micros  = Math.max(1, want - anchors);

    var mix = [];
    if (anchors) mix.push({ tier:'mid', n:anchors });
    mix.push({ tier:'micro', n:micros });

    /* score the supply: persona match first, then travel-type, then reliability */
    var picks = D.creators.map(function (c) {
      var s = D.supplyOf(c);
      var score = 0, why = [];
      if (brief.persona && s.reaches.indexOf(brief.persona) > -1) { score += 5; why.push('reaches ' + brief.persona.toLowerCase()); }
      if (brief.travelType && s.types.indexOf(brief.travelType) > -1) { score += 4; why.push('travels the way your guests do'); }
      if (s.tier.k === 'micro') { score += 3; why.push('in the band that converts'); }
      else if (s.tier.k === 'mid' && anchors) { score += 2; why.push('the reach anchor'); }
      else if (s.tier.k === 'macro') { score -= 2; }
      if (brief.dest && (c.loc || '').toLowerCase().indexOf(String(brief.dest).toLowerCase().split(',')[0]) > -1) {
        score += 3; why.push('already in your market');
      }
      if (c.ontime >= 98) { score += 1; why.push('delivers on time'); }
      return { c:c, s:s, score:score, why:why };
    }).sort(function (a, b) { return b.score - a.score || b.c.rating - a.c.rating; });
    var all = picks.slice();
    picks = picks.filter(function (p) {
      /* preferred pool: only the tiers the mix actually calls for */
      return mix.some(function (m) { return m.tier === p.s.tier.k; });
    });

    /* fill the mix from the top of the list, tier by tier */
    var chosen = [], substituted = 0;
    mix.forEach(function (m) {
      var pool = picks.filter(function (p) { return p.s.tier.k === m.tier && chosen.indexOf(p) === -1; });
      chosen = chosen.concat(pool.slice(0, m.n));
      /* If the network cannot fill that tier, we do not silently return a short
         list: we fall back to the nearest available creators and say so, because a
         recommendation the hotel cannot act on is worse than an honest compromise. */
      var short = m.n - Math.min(m.n, pool.length);
      if (short > 0) {
        var near = all.filter(function (p) { return chosen.indexOf(p) === -1; }).slice(0, short);
        chosen = chosen.concat(near);
        substituted += near.length;
      }
    });

    var reasons = [shape.why];
    if (brief.persona) reasons.push('Everything below is ranked on whether the creator actually reaches ' +
      brief.persona.toLowerCase() + ', because a matching audience beats a bigger one every time.');
    if (capacity < shape.min) reasons.push('You said you have ' + capacity + ' hosted ' +
      (capacity === 1 ? 'night' : 'stays') + ' to give, so this is sized to that rather than to the ideal.');

    return {
      mix: mix.map(function (m) {
        var t = D.TIERS.filter(function (x) { return x.k === m.tier; })[0];
        return { n:m.n, tier:t };
      }),
      total: mix.reduce(function (a, m) { return a + m.n; }, 0),
      reasons: reasons,
      picks: chosen,
      substituted: substituted,
      shortfall: chosen.length < want ? want - chosen.length : 0
    };
  };

  /* ---------------- 7. guest guides ----------------
     PLUG-IN POINT — guide storage. Replace with the real guide record per property.
     The section keys here are the same ones the creator side reads. */
  D.GUIDE_SECTIONS = [
    { k:'welcome', t:'Welcome',              hint:'Who to ask for, and when check-in runs',
      seed:'Check-in is from 3pm and reception is staffed around the clock. Ask for the duty manager if anything at all is missing.' },
    { k:'access',  t:'Wi-Fi and access',     hint:'Network, password, what the key opens',
      seed:'Network and password are in your room folder. Your key card opens the pool gate and the gym until 10pm.' },
    { k:'local',   t:'Nearby, worth your time', hint:'The three or four you would actually send a friend to',
      seed:'Coffee at the corner place, the quiet end of the beach ten minutes on foot, and book the neighbourhood restaurant two days ahead.' },
    { k:'amen',    t:'What is included',     hint:'What the stay covers, so nobody has to ask',
      seed:'Breakfast until 10.30, the pool, and the bikes by the side gate.' },
    { k:'house',   t:'House notes',          hint:'Quiet hours, shooting, anything to know',
      seed:'Quiet hours after 11pm. Tripods are welcome outside peak breakfast. Please ask before filming other guests.' },
    { k:'safety',  t:'Safety and contacts',  hint:'Reception, emergency, nearest clinic',
      seed:'Reception dial 0. Local emergency services and the nearest clinic are listed by the door of every room.' }
  ];

  D.guides = [
    { id:'g1', prop:'MiraGrace Estate', live:true, updated:'12 Feb 2026',
      sub:'Everything for your stay',
      body:{
        welcome:'Check-in is from 3pm, and reception is staffed around the clock. Ask for Robert if anything at all is missing.',
        access:'Network MiraGrace-Guest, password in your room folder. Your key card opens the spa and the pool gate until 10pm.',
        local:'Coffee at Panther on the corner. The best swim is the north end of the beach, ten minutes on foot. Book Casa Nube for dinner two days ahead.',
        amen:'Breakfast until 10.30, the adults-only pool, and one spa treatment on a hosted stay. Bikes are free and live by the side gate.',
        house:'Quiet hours after 11pm in the garden wing. Tripods are welcome outside peak breakfast. Please ask before filming other guests.',
        safety:'Reception dial 0. Local emergency 911. Nearest clinic is eight minutes by car and reception will call one.'
      } }
  ];
  /* ---- the first-time view, for the property's OWN content ----
     ukdata.js strips the activity lists, but the property's photo and its guest
     guide were written before that runs and were left standing. The visible
     result was the setup checklist ticking "Add photos of the property" and
     "Write your guest guide" on an account that had done neither: the onboarding
     never asked for them, and the dashboard said they were done. A checklist
     that congratulates you for work you have not done is worse than no
     checklist, because every other line on it stops being believable too.

     Both belong to this hotel, so both go, and the pages behind them show their
     empty state, which is what a new account actually sees. */
  if (window.UKDEMO && window.UKDEMO.isNew()) {
    D.guides.length = 0;
    if (D.property) D.property.img = '';
  }

  D.guideById = function (id) { return D.guides.filter(function (g) { return g.id === id; })[0] || null; };
  D.addGuide = function (prop) {
    var g = { id:'g' + (D.guides.length + 1), prop:prop || D.property.n || 'Your property',
              live:false, updated:'just now', sub:'Everything for your stay', body:{} };
    D.GUIDE_SECTIONS.forEach(function (s) { g.body[s.k] = ''; });
    D.guides.unshift(g);
    return g;
  };
})();
