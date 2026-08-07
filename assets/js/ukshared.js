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
  /* Where they post. The onboarding offers all eight, so every filter that names
     a platform has to be able to name all eight too. This list was written out
     twice — once in the creator onboarding, once in the hotel views — and the two
     copies could drift. One list now, each entry carrying its real brand mark. */
  PLATFORMS: [
    { k:'ig', n:'Instagram', s:'/assets/img/brand/instagram.svg' },
    { k:'tt', n:'TikTok',    s:'/assets/img/brand/tiktok.svg' },
    { k:'yt', n:'YouTube',   s:'/assets/img/brand/youtube.svg' },
    { k:'fb', n:'Facebook',  s:'/assets/img/brand/facebook.svg' },
    { k:'sc', n:'Snapchat',  s:'/assets/img/brand/snapchat.svg' },
    { k:'x',  n:'X',         s:'/assets/img/brand/x.svg' },
    { k:'li', n:'LinkedIn',  s:'/assets/img/brand/linkedin.svg' },
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
    { k:'fb', n:'Facebook',  f:3800 }
  ],
  band: '5K - 25K',
  verified: false,
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
