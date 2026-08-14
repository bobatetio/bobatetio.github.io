/* ---------------- shared vocabularies ----------------
   What a creator shoots, and what they make. Both apps must use the same words:
   a creator's declared categories and a hotel's filters are the same list, so the
   two sides can never describe the same person differently. Defined here because
   this file is the one module both /app/ and /creator/ load.
   Origin: the creator onboarding (ukcmatch.js), which now reads from here. */
window.UKVOCAB = {
  SHOOTS: [
    'Wellness & spa', 'Luxury & design', 'Food & drink', 'Adventure & outdoors',
    'Family travel', 'Budget & backpacking', 'Solo travel', 'Couples & honeymoon',
    'Digital nomad & remote work', 'Eco & sustainable', 'Culture & city',
    'Nature & wildlife', 'Nightlife & events', 'Beach & islands',
    'Mountain & ski', 'Road trips'
  ],
  FORMATS: [
    'Reels', 'UGC video', 'Photos', 'B-roll', 'Stories',
    'Carousels', 'Drone & aerial', 'Long-form / YouTube'
  ],
  /* Where they post. Narrowed from eight to the four that actually carry UGC
     travel content — Facebook, Snapchat, X and LinkedIn are gone. This list
     was written out twice before — once in the creator onboarding, once in
     the hotel views — and the two copies could drift. One list now, each
     entry carrying its real brand mark, so a future change to this set only
     happens in one place. */
  PLATFORMS: [
    { k:'ig', n:'Instagram', s:'/assets/img/brand/instagram.svg' },
    { k:'tt', n:'TikTok',    s:'/assets/img/brand/tiktok.svg' },
    { k:'yt', n:'YouTube',   s:'/assets/img/brand/youtube.svg' },
    { k:'pi', n:'Pinterest', s:'/assets/img/brand/pinterest.svg' }
  ],
  /* a creator declares up to five of each; no entry ranks above another */
  MAX_PICKS: 5
};

/* ---------------- the signed-in creator ----------------
   Amara Mensah was two different people. The hotel's roster had her at 128K
   followers across Instagram and TikTok, shooting "Wellness & spa", with 23
   stays behind her and a 4.9 rating. Her own profile in the creator app had her
   at 21K, in the 5K–25K band, shooting "Wellness & slow travel", unverified.
   Same name, same handle, same city, same person — and every number different.

   That is not a cosmetic mismatch. The hotel's fit score is computed against the
   band, so the two apps disagreed about whether she was a match for a stay, and
   the creator side's whole argument — that a smaller audience which actually
   watches is worth more than a big one that scrolls past — was contradicted by
   the number the hotel was reading.

   Her public record lives here, in the file both apps load, and both derive from
   it. The creator app owns the editing of it; the hotel app only reads. Anything
   genuinely one-sided — what a hotel privately thinks of her, what she has not
   published yet — stays in that side's own data. */
window.UKME = {
  id: 'c1',
  n: 'Amara Mensah',
  h: '@amaratravels',
  img: '/assets/img/fc/av/av-01.jpg',
  city: 'Lisbon, Portugal',
  /* one phrase, not two. "Wellness & spa" is the category a hotel filters on;
     it is the first of her declared subjects, and the longer line is how she
     describes herself. Both are kept because both are used. */
  niche: 'Wellness & slow travel',
  type: 'Wellness & spa',
  cats: ['Wellness & spa', 'Luxury & design', 'Culture & city'],
  langs: 'English, Portuguese',
  bio: 'Slow mornings, good light, hotels worth waking up early for.',
  /* every channel she posts on, with its own count. The two apps used to widen
     this list separately, by different rules, so the hotel saw her on three
     platforms and she saw herself on four. */
  plats: [
    { k:'ig', n:'Instagram', f:12400 },
    { k:'tt', n:'TikTok',    f:8600 },
    { k:'yt', n:'YouTube',   f:6400 },
    { k:'pi', n:'Pinterest', f:3800 }
  ],
  band: '5K - 25K',
  verified: false,
  /* Earned by finishing every Academy lesson, not by paying for membership —
     a separate credibility signal from `verified`, computed live wherever a
     creator's own D.academy is read (ukcviews.js profile()) since lessons
     complete over a session; this stored flag is what the OTHER app (which
     never sees that live progress) reads instead. */
  academyCert: false,
  /* what she has actually delivered — the hotel's roster reads these */
  stays: 6,
  ontime: 100,
  eng: '6.4%',
  rating: 4.9,
  reach: '4.2K per post',
  resp: 'within 4 hours',
  age: '25-34 (58%)',
  gender: '71% women',
  tops: 'Portugal, UK, Germany',
  free: 'From 12 Mar',
  proof: 'Her last resort feature drove 340 saves and a three-week booking bump for the property.',
  been: [
    { n:'Lisbon',    lat:38.72, lng:-9.14 },
    { n:'Marrakesh', lat:31.63, lng:-8.0 },
    { n:'Tulum',     lat:20.21, lng:-87.46 },
    { n:'Milan',     lat:45.46, lng:9.19 }
  ],
  worked: [
    { h:'Casa Azul Tulum', out:'3 videos, 12 photos' },
    { h:'Riad Amber',      out:'1 video, 8 photos' }
  ],
  /* the total is the sum across platforms, never one platform's count */
  total: function () {
    return this.plats.reduce(function (a, p) { return a + (p.f || 0); }, 0);
  }
};

/* The fields above are a LITERAL — same starting values because both apps
   load the same file, not because they share a live object. /app/ and
   /creator/ are separate pages; a plain `window.UKME.x = y` in one only
   ever touches that page's own copy and is gone the moment it navigates or
   reloads, which meant a creator's own edits (collab types, rates, Academy
   badges) never actually reached a hotel that opened her profile fresh —
   they looked shared right up until the hotel side's own page load proved
   they were not. Same fix UKShared already uses two blocks down for a
   collaboration: localStorage, same origin, read by both. Persists only
   the fields a creator actually edits from her own side; everything else
   stays the plain literal above. */
(function () {
  var KEY = 'uk_me_edits_v1';
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } }
  function save(all) { try { localStorage.setItem(KEY, JSON.stringify(all)); } catch (e) {} }
  Object.assign(window.UKME, load());
  window.UKME_SET = function (patch) {
    Object.assign(window.UKME, patch);
    var all = load();
    Object.assign(all, patch);
    save(all);
  };
})();

/* Ukreate — the one shared truth for a collaboration that exists on both sides.
   Hotel (/app/) and creator (/creator/) are separate script/data worlds — but for
   any collaboration that is genuinely the same real-world thing on both sides, there
   must be exactly one truth, not two that can drift. This is the single place that
   truth is read from and written to. It lives in localStorage (same origin, so both
   apps already share it) and every mutator on both sides that touches shared fields
   goes through here — never straight to a local, per-side object. */
window.UKShared = (function () {
  var KEY = 'uk_shared_collabs_v1';

  function loadAll() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; }
  }
  function saveAll(all) {
    try { localStorage.setItem(KEY, JSON.stringify(all)); } catch (e) {}
  }
  function get(linkId) { return loadAll()[linkId] || null; }
  /* Seeds the record the first time either side asks for it. Later visits, from
     either side, keep whatever is really there — the seed never overwrites a real
     action that has already happened. */
  function ensure(linkId, seed) {
    var all = loadAll();
    if (!all[linkId]) { all[linkId] = seed; saveAll(all); }
    return all[linkId];
  }
  function set(linkId, patch) {
    var all = loadAll();
    all[linkId] = Object.assign({}, all[linkId] || {}, patch);
    saveAll(all);
    return all[linkId];
  }
  function pushMsg(linkId, msg) {
    var all = loadAll();
    var rec = all[linkId] || {};
    rec.msgs = (rec.msgs || []).concat([msg]);
    all[linkId] = rec;
    saveAll(all);
    return rec;
  }
  return { get: get, ensure: ensure, set: set, pushMsg: pushMsg };
})();

/* ---------------- flags ----------------
   The country in a "City, Country" string, resolved to the flag both apps
   already ship at /assets/img/flags/<cc>.svg (the full ISO set — every code
   used below already exists on disk, nothing new to add). Was hand-copied
   into the hotel side only, one entry short of what the data actually uses
   (e.g. "Cape Town, South Africa" vs the creator side's own "Cape Town, SA"),
   which is why a lookup by name has to carry both spellings of anything that
   appears both ways. One map now, so a country used on one side is a country
   both sides can flag. */
window.UKCC = { Portugal:'pt', USA:'us', Mexico:'mx', Norway:'no', Japan:'jp',
  India:'in', SA:'za', 'South Africa':'za', Italy:'it', Morocco:'ma', Spain:'es',
  France:'fr', UK:'gb', Indonesia:'id', Florida:'us', UAE:'ae', Iceland:'is',
  Greece:'gr', Australia:'au', Switzerland:'ch', Ghana:'gh', Germany:'de',
  Austria:'at', Sweden:'se', Singapore:'sg', Brazil:'br', Canada:'ca',
  'New Zealand':'nz' };
window.ukFlagFor = function (loc) {
  var cc = window.ukCCOf(loc);
  return cc ? '<img class="ukCrFlag" src="/assets/img/flags/' + cc + '.svg" alt="" ' +
    'loading="lazy" decoding="async">' : '';
};
window.ukCCOf = function (loc) {
  var country = String(loc || '').split(',').pop().trim();
  return window.UKCC[country] || null;
};
