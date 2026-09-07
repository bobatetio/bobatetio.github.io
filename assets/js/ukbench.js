/* Ukreate — the wider creator bench.

   The hand-authored roster in ukdata.js is ten people, written one at a time because
   the dashboards quote them by name. That is the right size for a case study and the
   wrong size for a supply question: "3 creators available near Lisbon" reads as a
   network with nobody in it.

   This generates the rest of the bench around every city the geocoder knows, so the
   count a hotel sees is a real count of real records with real coordinates, filtered
   by the same distance rule as everything else. Nothing here is a printed number.

   ILLUSTRATIVE BUT FUNCTIONAL. These are seeded records standing in for a creator
   table, not invented statistics about real people. Every one is flagged `bench:true`
   so any screen can tell the hand-written ten from the generated supply.

   // PLUG-IN POINT — creator supply.
   Delete this file the day /creators returns real rows. Everything downstream reads
   D.creators and needs no change: same shape, same fields, same coordinates.

   Deterministic on purpose: a seeded PRNG rather than Math.random, so the world is
   identical on every load. The globe repaints on each keystroke and a roster that
   reshuffled underneath it would move faces around while you type. */
(function () {
  var D = window.UK;
  var MAP = window.UKCITYMAP;
  if (!D || !MAP || !MAP.CITIES) return;

  var AV = '/assets/img/fc/av/';
  var AVATARS = 14;

  /* mulberry32: small, fast, and stable across browsers */
  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  /* Names are drawn from the region the city sits in rather than one global pool.
     A bench of twenty around Kyoto that reads as twenty Americans is the kind of
     detail that tells you the data is fake. */
  var REGIONS = {
    us: { first:['Maya','Devon','Priya','Marcus','Sienna','Cole','Naomi','Elias','Harper','Jonah','Aaliyah','Reid','Camila','Wesley','Nia','Tobias'],
          last:['Brooks','Alvarez','Whitfield','Nakamura','Okafor','延','Reyes','Sutton','Hendricks','Vasquez','Mercer','Delgado','Ellison','Barrett','Cruz','Langston'] },
    uk: { first:['Freya','Oliver','Imogen','Rhys','Isla','Callum','Beatrice','Theo','Niamh','Arthur','Saoirse','Dexter'],
          last:['Whitmore','Ashworth','Pemberton','Okonkwo','Fairbanks','Sinclair','Harrington','Baptiste','Cavendish','Iqbal','Rutherford','Nkemdirim'] },
    pt: { first:['Inês','Tomás','Beatriz','Rafael','Matilde','Gonçalo','Carolina','Duarte','Leonor','Afonso'],
          last:['Ferreira','Almeida','Carvalho','Nogueira','Teixeira','Moreira','Fonseca','Baptista','Cardoso','Esteves'] },
    es: { first:['Lucía','Álvaro','Martina','Iker','Vega','Nicolás','Paula','Bruno','Alba','Marc'],
          last:['Serrano','Vidal','Ibáñez','Bosch','Aguirre','Peralta','Roldán','Sanchis','Cabrera','Ferrer'] },
    fr: { first:['Camille','Étienne','Margaux','Hugo','Salomé','Baptiste','Océane','Léandre','Manon','Aurélien'],
          last:['Lemoine','Roussel','Delacroix','Barbier','Fontaine','Marchand','Charbonneau','Vasseur','Guillory','Beaulieu'] },
    de: { first:['Lena','Jonas','Annika','Felix','Greta','Moritz','Johanna','Lukas','Frieda','Emil'],
          last:['Brandt','Vogel','Hoffmann','Reinhardt','Sommer','Kirchner','Baumgartner','Lindqvist','Steiner','Wagner'] },
    no: { first:['Ingrid','Sondre','Astrid','Håkon','Signe','Eirik','Maren','Torbjørn','Vilde','Aksel'],
          last:['Dahl','Haugen','Bjørnstad','Lie','Nordvik','Sæther','Halvorsen','Moen','Fjeld','Strand'] },
    ch: { first:['Elin','Silvan','Noemi','Andrin','Livia','Jonas','Selina','Reto','Alina','Nico'],
          last:['Zumbrunn','Schwarz','Aebi','Kaufmann','Frei','Bachmann','Roth','Meier','Studer','Gasser'] },
    it: { first:['Giulia','Matteo','Chiara','Lorenzo','Alessia','Davide','Francesca','Riccardo','Sofia','Tommaso'],
          last:['Ricci','Barbieri','Fontana','Greco','Marchetti','Rizzo','Palumbo','Vitale','Sartori','Bellini'] },
    ma: { first:['Salma','Youssef','Hind','Reda','Nour','Karim','Imane','Anas','Sara','Bilal'],
          last:['El Amrani','Benali','Chraibi','Ouazzani','Berrada','El Fassi','Tazi','Alaoui','Bennis','Sqalli'] },
    ae: { first:['Layla','Omar','Fatima','Rashid','Noor','Khalid','Aisha','Tariq','Mariam','Zayd'],
          last:['Al Mansoori','Al Hashimi','Haddad','Al Qassimi','Nasser','Al Marri','Rahman','Al Suwaidi','Kanaan','Al Balushi'] },
    gh: { first:['Akosua','Kwame','Efua','Kofi','Adjoa','Yaw','Abena','Kojo','Ama','Nii'],
          last:['Mensah','Boateng','Owusu','Asante','Darko','Agyeman','Ofori','Quartey','Amankwah','Tetteh'] },
    za: { first:['Thandi','Sipho','Lerato','Jaco','Zanele','Ruan','Naledi','Pieter','Buhle','Anele'],
          last:['Mokoena','van der Merwe','Dlamini','Botha','Ngcobo','Pretorius','Khumalo','Naidoo','Jacobs','Zulu'] },
    jp: { first:['Yuki','Haruto','Sakura','Ren','Mei','Sota','Aoi','Kaito','Rina','Hinata'],
          last:['Tanaka','Yoshida','Nakamura','Sasaki','Fujimoto','Watanabe','Kobayashi','Ishikawa','Morita','Hasegawa'] },
    id: { first:['Ayu','Bagus','Dewi','Wayan','Sari','Putu','Intan','Gede','Nyoman','Rizky'],
          last:['Pratama','Wijaya','Santoso','Kusuma','Hartono','Nugroho','Setiawan','Halim','Suryadi','Permana'] },
    mx: { first:['Valentina','Santiago','Regina','Emiliano','Ximena','Diego','Renata','Mateo','Fernanda','Alonso'],
          last:['Herrera','Guzmán','Salazar','Montoya','Escobedo','Villalobos','Quintero','Zamora','Peña','Estrada'] },
    au: { first:['Tahlia','Jarrah','Indie','Lachlan','Marlowe','Fletcher','Sienna','Angus','Piper','Kai'],
          last:['Kirby','Donnelly','Hargrave','Whitlock','Beauchamp','Corrigan','Ashby','Mullins','Radcliffe','Teague'] }
  };
  /* strip a stray glyph that slipped into one pool rather than shipping it */
  REGIONS.us.last = REGIONS.us.last.filter(function (n) { return /^[A-Za-z' -]+$/.test(n); });

  /* city key -> [region, country label, how many sit in this market] */
  var MARKETS = {
    'miami':     ['us','USA',        24], 'florida':   ['us','USA',        18],
    'new york':  ['us','USA',        37], 'london':    ['uk','UK',         34],
    'lisbon':    ['pt','Portugal',   27], 'barcelona': ['es','Spain',      30],
    'paris':     ['fr','France',     32], 'munich':    ['de','Germany',    26],
    'oslo':      ['no','Norway',     21], 'zermatt':   ['ch','Switzerland',18],
    'marrakesh': ['ma','Morocco',    22], 'dubai':     ['ae','UAE',        27],
    'accra':     ['gh','Ghana',      19], 'cape town': ['za','South Africa',25],
    'kyoto':     ['jp','Japan',      24], 'tokyo':     ['jp','Japan',      29],
    'bali':      ['id','Indonesia',  28], 'tulum':     ['mx','Mexico',     24],
    'sydney':    ['au','Australia',  26]
  };

  var TYPES = ['Wellness & spa','Food & culinary','Adventure / outdoors','Family travel',
               'Design & architecture','Solo travel','Couples','Eco-conscious','Luxury'];
  var LANGS = { us:'English', uk:'English', pt:'Portuguese, English', es:'Spanish, English',
                fr:'French, English', de:'German, English', no:'Norwegian, English',
                ch:'German, French, English', it:'Italian, English', ma:'Arabic, French, English',
                ae:'Arabic, English', gh:'English, Twi', za:'English, Afrikaans',
                jp:'Japanese, English', id:'Indonesian, English', mx:'Spanish, English',
                au:'English' };
  var BIOS = [
    'Rooms, light, and the walk to breakfast.',
    'Shoots and edits solo. Delivers inside a week.',
    'Quiet properties and the people who run them.',
    'Small hotels, long stays, honest footage.',
    'Design-led stays and the details most people miss.',
    'Food first, then the room it was served in.',
    'Outdoors, early starts, and weather that does not cooperate.',
    'Travels with two kids, films it anyway.',
    'Coastline, cold water, and places worth the drive.',
    'Slow mornings and properties that earn a second night.'
  ];
  var FREE = ['Available now','From 04 Mar','From 09 Mar','From 12 Mar','From 18 Mar',
              'From 26 Mar','From 02 Apr','From 11 Apr'];

  function pick(r, arr) { return arr[Math.floor(r() * arr.length)]; }
  function between(r, lo, hi) { return lo + Math.floor(r() * (hi - lo + 1)); }

  /* Followers are weighted to the micro band because that is where the seeded supply
     is meant to sit (see D.TIERS): a bench that is mostly macro would quietly break
     the hiring recommendations, which cap on what a property can actually host. */
  function followers(r) {
    var roll = r();
    if (roll < 0.24) return between(r, 1200, 4900);       // nano
    if (roll < 0.78) return between(r, 5200, 49000);      // micro
    if (roll < 0.96) return between(r, 52000, 380000);    // mid
    return between(r, 520000, 1400000);                   // macro
  }

  var out = [];
  var n = 0;
  var handles = {};

  Object.keys(MARKETS).forEach(function (key, mi) {
    var pt = MAP.CITIES[key];
    if (!pt) return;
    var market = MARKETS[key];
    var region = REGIONS[market[0]];
    var count = market[2];
    var r = rng(0x9E3779B9 ^ (mi + 1) * 2654435761);
    var label = key.replace(/\b\w/g, function (m) { return m.toUpperCase(); }) + ', ' + market[1];

    for (var i = 0; i < count; i++) {
      var first = pick(r, region.first), last = pick(r, region.last);
      /* scattered around the market, not stacked on one pin: roughly 60km of jitter,
         which keeps everyone inside the city's own travelling range */
      var lat = pt[0] + (r() - 0.5) * 1.1;
      var lng = pt[1] + (r() - 0.5) * 1.1 / Math.max(0.25, Math.cos(pt[0] * Math.PI / 180));
      var f = followers(r);
      var handle = '@' + (first + last).toLowerCase().replace(/[^a-z]/g, '');
      while (handles[handle]) handle = handle + (handles[handle]++ , handles[handle]);
      handles[handle] = 1;
      n++;

      /* A creator rarely shoots one thing. One to three categories, with the first
         the one they lead with. */
      var cats = [];
      var pool = TYPES.slice();
      var howMany = r() < 0.28 ? 1 : (r() < 0.72 ? 2 : 3);
      for (var k = 0; k < howMany; k++) cats.push(pool.splice(Math.floor(r() * pool.length), 1)[0]);

      /* Availability is a state, not a sentence: free now, free again soon, or off
         the board for a while. The dot and the date both read from this. */
      var roll = r();
      var avail = roll < 0.34 ? 'now' : (roll < 0.74 ? 'soon' : 'later');
      var free = avail === 'now' ? 'Available now' : pick(r, FREE.slice(1));

      /* Where they cover, not where they sleep. A travel creator's home market is
         the least useful thing about them; this is the list a hotel is matched on. */
      var covers = [label];
      var pool = Object.keys(MARKETS).filter(function (x) { return x !== key; });
      var extra = 1 + Math.floor(r() * 3);
      for (var c2 = 0; c2 < extra; c2++) {
        var pick2 = pool.splice(Math.floor(r() * pool.length), 1)[0];
        if (!pick2) break;
        covers.push(pick2.replace(/\b\w/g, function (mm) { return mm.toUpperCase(); }) +
                    ', ' + MARKETS[pick2][1]);
      }

      out.push({
        id: 'b' + n, bench: true, cats: cats, avail: avail, vet: r() < 0.82, covers: covers,
        n: first + ' ' + last, h: handle, loc: label, img: AV + 'av-' +
          ('0' + (n % AVATARS + 1)).slice(-2) + '.jpg',
        lat: Math.round(lat * 1000) / 1000, lng: Math.round(lng * 1000) / 1000,
        f: f, eng: (2.4 + r() * 6.2).toFixed(1) + '%',
        type: cats[0],
        stays: between(r, 0, 26), ontime: between(r, 92, 100),
        rating: (4.3 + r() * 0.7).toFixed(1) * 1,
        free: free,
        langs: LANGS[market[0]] || 'English',
        age: pick(r, ['18-24','25-34','35-44']) + ' (' + between(r, 41, 68) + '%)',
        gender: between(r, 44, 82) + '% women',
        tops: market[1],
        reach: Math.round(f * (0.12 + r() * 0.2) / 1000) + 'K per post',
        resp: 'within ' + between(r, 2, 9) + ' hours',
        bio: pick(r, BIOS),
        proof: '',
        plats: [{ k:'ig', n:'Instagram', f:f }],
        /* Instagram is near universal; the rest tail off. Two or three platforms is
           the common shape, and the card shows whichever they actually publish on. */
        p: (function () {
          var out = ['ig'];
          if (r() < 0.62) out.push('tt');
          if (r() < 0.34) out.push('yt');
          if (r() < 0.22) out.push('pi');
          return out.slice(0, 4);
        })(),
        worked: [], been: [{ n: label.split(',')[0], lat: pt[0], lng: pt[1] }]
      });
    }
  });

  out.forEach(function (c) {
    if (!D.creators.some(function (x) { return x.id === c.id; })) D.creators.push(c);
  });

  /* The hand-written ten predate coverage, so they get a list too — their own market
     plus a couple they plausibly travel to. Without it they would read as covering
     nowhere, which is worse than the old home-city line. */
  var SEEDED_COVERS = {
    'Lisbon, Portugal':   ['Lisbon, Portugal', 'Marrakesh, Morocco', 'Barcelona, Spain'],
    'Miami, USA':         ['Miami, USA', 'Tulum, Mexico'],
    'Mexico City, Mexico':['Mexico City, Mexico', 'Tulum, Mexico', 'Miami, USA'],
    'Los Angeles, USA':   ['Los Angeles, USA', 'Miami, USA'],
    'Oslo, Norway':       ['Oslo, Norway', 'Zermatt, Switzerland'],
    'Kyoto, Japan':       ['Kyoto, Japan', 'Tokyo, Japan', 'Bali, Indonesia'],
    'Goa, India':         ['Goa, India', 'Bali, Indonesia', 'Dubai, UAE'],
    'Cape Town, SA':      ['Cape Town, South Africa', 'Marrakesh, Morocco'],
    'Milan, Italy':       ['Milan, Italy', 'Zermatt, Switzerland', 'Paris, France'],
    'Marrakesh, Morocco': ['Marrakesh, Morocco', 'Lisbon, Portugal']
  };
  D.creators.forEach(function (c) {
    if (!c.covers) c.covers = SEEDED_COVERS[c.loc] || (c.loc ? [c.loc] : []);
  });

  D.BENCH_COUNT = out.length;
})();
