/* Ukreate — creator-side data.
   Mirrors the hotel world: same stays, same collaborations, seen from the other end.
   All state is in memory. Every media entry declares its aspect ratio so swapping in
   real vertical footage is a src replacement, nothing more. */
window.UKC = (function () {

  var V = '/assets/img/uk/';            // portrait / vertical source
  var F = '/assets/img/fc2/';           // 4:5 feed stills
  var A = '/assets/img/fc/av/';         // 1:1 avatars
  var H = '/assets/img/';               // property & destination stills
  var L = '/assets/img/';               // 16:9 property imagery

  /* ---------- central media manifest ----------
     ratio is declarative: the slot is built at this ratio regardless of the source file. */
  /* A travel creator's portfolio is hotels and destinations, so these point at the
     property and location imagery in the repo. They previously pointed at portrait
     stock of a person looking distressed, which fought every line of copy on this
     side. [ASSUMPTION] Still no true 9:16 source here: every slot is built at the
     right ratio and centre-crops a wider still. Swapping in Robert's real creator
     video is one line each, with no layout work. */
  var MEDIA = {
    reel1: { src:H+'hero_bg_outdoor.webp', ratio:'9x16', kind:'video' },
    reel2: { src:H+'hero_bg_room.jpg',     ratio:'9x16', kind:'video' },
    reel3: { src:H+'hero_bg_indoor.webp',  ratio:'9x16', kind:'video' },
    reel4: { src:H+'hero_bg_burj.webp',    ratio:'9x16', kind:'video' },
    reel5: { src:H+'hero_bg_grand.webp',   ratio:'9x16', kind:'video' },
    reel6: { src:H+'hero_bg_hotel.webp',   ratio:'9x16', kind:'video' },
    shot1: { src:H+'hero_bg_lobby.webp',   ratio:'4x5', kind:'photo' },
    shot2: { src:F+'roster-1.jpg',         ratio:'4x5', kind:'photo' },
    shot3: { src:F+'roster-3.jpg',         ratio:'4x5', kind:'photo' },
    shot4: { src:H+'hero_bg_custom.webp',  ratio:'4x5', kind:'photo' }
  };

  /* ---------- the signed-in creator ---------- */
  var me = {
    n:'Amara Mensah', h:'@amaratravels', img:A+'av-01.jpg',
    city:'Lisbon, Portugal', niche:'Wellness & slow travel',
    plats:[{k:'ig',n:'Instagram',f:12400},{k:'tt',n:'TikTok',f:8600}],
    bio:'Slow mornings, good light, hotels worth waking up early for.',
    verified:false, member:false, band:'5K - 25K', freePitchUsed:false,
    work:[
      { id:'w1', m:'reel1', t:'Sunrise at the riad',      plays:41200, saves:1860, on:'2 weeks ago' },
      { id:'w2', m:'reel2', t:'Room tour, garden suite',  plays:28700, saves:1140, on:'3 weeks ago' },
      { id:'w3', m:'reel3', t:'Breakfast on the terrace', plays:19400, saves:840,  on:'a month ago' },
      { id:'w4', m:'shot1', t:'Pool, late afternoon',     plays:9100,  saves:520,  on:'a month ago' },
      { id:'w5', m:'reel4', t:'Walking the old town',     plays:33500, saves:1420, on:'6 weeks ago' },
      { id:'w6', m:'shot2', t:'Spa detail',               plays:7300,  saves:390,  on:'2 months ago' }
    ]
  };

  /* ---------- hotels open to creators (mirror of the hotel side's stays) ---------- */
  var stays = [
    { id:'s1', wants:'5K - 25K', vibe:'Quiet & slow', budget:'Mid-range', hotel:'MiraGrace Estate',   city:'Miami, Florida',      img:L+'hero_bg_room.jpg', imgs:[L+'hero_bg_room.jpg',L+'hero_bg_outdoor.webp',L+'hero_bg_hotel.webp'],
      lat:25.76, lng:-80.19, score:9, nights:2, room:'Garden suite',
      inc:'Room, breakfast, one spa treatment', del:[{t:'UGC video',q:1},{t:'Photos',q:3}],
      rights:'They keep and use the content', style:'Wellness & spa',
      from:'04 Mar', to:'07 Mar', saved:false, why:'Wellness property, midweek nights, and they reply fast.' },
    { id:'s2', wants:'25K - 100K', vibe:'Design led', budget:'Independent', hotel:'Casa Azul Tulum',    city:'Tulum, Mexico',       img:L+'hero_bg_outdoor.webp', imgs:[L+'hero_bg_outdoor.webp',L+'hero_bg_lobby.webp',L+'fc2/hero-alt.jpg'],
      lat:20.21, lng:-87.46, score:10, nights:3, room:'Jungle cabana',
      inc:'Room, all meals, cenote trip', del:[{t:'UGC video',q:2},{t:'Photos',q:6}],
      rights:'They keep and use the content', style:'Boutique & design',
      from:'22 Jan', to:'25 Jan', saved:true, why:'Highest score near you. They host creators most months.' },
    { id:'s3', wants:'25K - 100K', vibe:'Design led', budget:'High end', hotel:'Riad Amber',         city:'Marrakesh, Morocco',  img:L+'hero_bg_indoor.webp', imgs:[L+'hero_bg_indoor.webp',L+'hero_bg_custom.webp',L+'hero_bg_room.jpg'],
      lat:31.63, lng:-8.00, score:10, nights:4, room:'Rooftop room',
      inc:'Room, breakfast, hammam', del:[{t:'UGC video',q:2},{t:'Photos',q:8},{t:'Reels',q:2}],
      rights:'They keep and use the content', style:'Luxury & design',
      from:'04 Mar', to:'09 Mar', saved:false, why:'Your riad reel is the exact thing they are asking for.' },
    { id:'s4', wants:'Under 5K', vibe:'Quiet & slow', budget:'Mid-range', hotel:'Fjordheim Lodge',    city:'Ålesund, Norway',     img:L+'hero_bg_grand.webp', imgs:[L+'hero_bg_grand.webp',L+'fc2/cta-bg.jpg',L+'hero_bg_lobby.webp'],
      lat:62.47, lng:6.15, score:8, nights:3, room:'Fjord cabin',
      inc:'Room, breakfast, kayak morning', del:[{t:'UGC video',q:1},{t:'Photos',q:5}],
      rights:'They keep and use the content', style:'Eco & wellness',
      from:'18 Jun', to:'21 Jun', saved:false, why:'Quiet season. Rooms likely to sit empty, so they say yes more.' },
    { id:'s5', wants:'Under 5K', vibe:'Family friendly', budget:'Independent', hotel:'Palms Dania Beach',  city:'Dania Beach, Florida',img:L+'hero_bg_lobby.webp', imgs:[L+'hero_bg_lobby.webp',L+'hero_bg_outdoor.webp',L+'hero_bg_custom.webp'],
      lat:26.05, lng:-80.14, score:7, nights:2, room:'Standard king',
      inc:'Room and breakfast', del:[{t:'UGC video',q:1},{t:'Photos',q:4}],
      rights:'They keep and use the content', style:'Beach & city',
      from:'12 Apr', to:'14 Apr', saved:false, why:'Straightforward brief, good for a first collab.' },
    { id:'s6', wants:'100K+', vibe:'Adventure', budget:'High end', hotel:'Alpina Zermatt',     city:'Zermatt, Switzerland',img:L+'hero_bg_burj.webp', imgs:[L+'hero_bg_burj.webp',L+'hero_bg_lobby.webp',L+'fc2/cta-bg.jpg'],
      lat:46.02, lng:7.75, score:6, nights:2, room:'Alpine double',
      inc:'Room, half board', del:[{t:'UGC video',q:2},{t:'Photos',q:6}],
      rights:'They keep and use the content', style:'Mountain & ski',
      from:'01 Dec', to:'03 Dec', saved:false, why:'Season opening. Worth a pitch even if it feels like a stretch.' }
  ];

  /* ---------- the lifecycle, from the creator's end ----------
     Inquiry is the pitch thread. Approval sends the full package and moves the collab
     into Onboarding. From there the creator marks the stay as shooting, hands over the
     work, then waits for review and sign-off. */
  var STAGES = [
    { key:'inquiry',    short:'Inquiry',    mine:false,
      sayMine:'Your pitch is with the hotel',        say:'Your pitch is with the hotel' },
    { key:'onboarding', short:'Onboarding', mine:false,
      sayMine:'Your host sent the full package',     say:'Your host sent the full package' },
    { key:'creating',   short:'Creating',   mine:true,
      sayMine:'Bring this stay to life',             say:'Bring this stay to life' },
    { key:'content',    short:'Content',    mine:false,
      sayMine:'Your host is reviewing your work',    say:'Your host is reviewing your work' },
    { key:'complete',   short:'Complete',   mine:false,
      sayMine:'All wrapped up',                      say:'All wrapped up' }
  ];

  function toISO(d) {
    if (!d) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
    var parsed = new Date(d);
    if (isNaN(parsed.getTime())) return '';
    return parsed.toISOString().slice(0, 10);
  }
  function addDays(iso, days) {
    if (!iso) return '';
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d.getTime())) return '';
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }
  /* Seed/shared-record stage values are already in the new 5-stage scheme
     (0=Inquiry,1=Onboarding,2=Creating,3=Content,4=Complete) — just clamp. */
  function normaliseLocalStage(stage) {
    stage = stage || 0;
    if (stage > 4) return 4;
    if (stage < 0) return 0;
    return stage;
  }
  function hasBriefData(brief) {
    return !!(brief && (brief.title || brief.deliverables || brief.notes || brief.file || brief.link));
  }
  function packageDates(c) {
    var s = byId(stays, c.stay) || {};
    var from = toISO((c.dates || {}).from) || toISO(s.from);
    var to = toISO((c.dates || {}).to) || toISO(s.to);
    return { status:'accepted', from:from, to:to, by:((c.dates || {}).by || 'hotel') };
  }
  function packageBrief(c, override) {
    var s = byId(stays, c.stay) || {};
    var base = {
      title: s.hotel || '',
      deliverables: (s.del || []).map(function (d) { return d.q + ' ' + d.t.toLowerCase(); }).join(', '),
      deadline: addDays(toISO(s.to), 7) || toISO(s.to),
      notes: 'Hosted stay: ' + (s.nights || '') + ' nights in the ' + ((s.room || '').toLowerCase()) + '. Included: ' + (s.inc || '') + '. Usage rights: ' + (s.rights || '') + '.',
      file: '',
      link: ''
    };
    var merged = Object.assign({}, base, c.brief || {}, override || {});
    ['title','deliverables','notes','link','file'].forEach(function (k) { if (merged[k]) merged[k] = String(merged[k]).trim(); });
    merged.deadline = toISO(merged.deadline) || base.deadline;
    return merged;
  }
  function guideSnapshot(c) { return c.guide || null; }
  function ensureLifecycle(c) {
    c.stage = normaliseLocalStage(c.stage || 0);
    if (c.stage >= 1) {
      c.dates = packageDates(c);
      c.brief = packageBrief(c);
      c.briefSent = true;
    }
    return c;
  }

  /* ---------- the shared mirror stay ---------- */
  stays[0] = {
    id:'s1', wants:'10K - 50K', vibe:'Quiet & considered', budget:'Independent', hotel:'MiraGrace Estate', city:'Miami, Florida', img:L+'hero_bg_lobby.webp', imgs:[L+'hero_bg_lobby.webp',L+'hero_bg_room.jpg',L+'hero_bg_outdoor.webp'],
    lat:25.76, lng:-80.19, score:9, nights:2, room:'Standard king',
    inc:'Room and breakfast', del:[{t:'UGC video',q:1},{t:'Photos',q:5}],
    rights:'They keep and use the content', style:'Boutique & quiet',
    from:'12 Apr 2027', to:'14 Apr 2027', saved:false, why:'A returning host with a clear, tidy package and gentle spring dates.'
  };

  var collabs = [
    { id:'k1', stay:'s5', stage:0, when:'3 days ago', unread:0,
      msgs:[{by:'me',at:'3 days ago',tx:'Hi! I would love to cover the April midweek stay. I shoot wellness and slow travel, and I deliver within ten days of checkout.'}] },
    { id:'k2', stay:'s1', stage:1, when:'yesterday', unread:0,
      dates:{ status:'accepted', from:'2027-04-12', to:'2027-04-14' },
      briefSent:true,
      msgs:[{by:'me',at:'4 days ago',tx:'Loved working with MiraGrace before — I would love to cover the quiet weeks in April too.'},
            {by:'them',at:'yesterday',tx:'Approved — your stay package is ready whenever you are.'}] },
    { id:'k3', stay:'s2', stage:1, when:'2 days ago', unread:1,
      dates:{ status:'accepted', from:'2027-01-22', to:'2027-01-25' },
      briefSent:true,
      brief:{ title:'Cenote and jungle cabana', deliverables:'2 UGC videos, 6 photos', deadline:'2027-02-01',
              notes:'Lead with the cenote and the jungle cabana at golden hour.' },
      msgs:[{by:'them',at:'4 days ago',tx:'Your package is finalised and ready to go.'},
            {by:'them',at:'2 days ago',tx:'Take your time with the brief — everything you need is there.'}] },
    { id:'k4', stay:'s3', stage:2, when:'today', unread:0,
      creatingStarted:false,
      briefSent:true,
      brief:{ title:'Riad Amber', deliverables:'2 UGC videos, 8 photos, 2 reels', deadline:'2027-03-16',
              notes:'Lead with the rooftop room, the courtyard light, and the hammam details.' },
      dates:{ status:'accepted', from:'2027-03-04', to:'2027-03-09' },
      msgs:[{by:'them',at:'a week ago',tx:'Everything is set. Ask for Yusuf at reception when you arrive.'},
            {by:'me',at:'today',tx:'Arrived and ready to start as soon as the light softens.'}] },
    { id:'k5', stay:'s4', stage:4, when:'6 weeks ago', unread:0,
      delivered:['w1','w3'], contentStatus:'approved',
      msgs:[{by:'me',at:'7 weeks ago',tx:'All delivered, a little early. One video and five photos plus the raw files.'},
            {by:'them',at:'6 weeks ago',tx:'Approved and downloaded. Genuinely one of the best sets we have had. Come back for winter.'}] },
    { id:'k6', stay:'s6', stage:0, when:'2 weeks ago', quiet:true,
      msgs:[{by:'me',at:'2 weeks ago',tx:'Hi! Pitching for the season opening in December. Happy to work to whatever brief you set.'}] }
  ];
  collabs.forEach(ensureLifecycle);

  var SHARE_STAGE_TO_LOCAL = { inquiry:0, dates:1, brief:1, onboarding:1, creating:2, review:3, content:3, done:4, complete:4 };
  var LOCAL_STAGE_TO_SHARE = ['inquiry','onboarding','creating','content','complete'];

  function collabMine(c) {
    switch (c.stage) {
      case 0: return false;
      case 1: return false;
      case 2: return !c.creatingStarted || !c.delivered;
      case 3: return c.contentStatus === 'changesRequested';
      default: return false;
    }
  }
  function collabSay(c) {
    if (c.stage === 0) return 'Your pitch is with the hotel';
    if (c.stage === 1) return 'Your host sent the full stay package';
    if (c.stage === 2) {
      if (!c.creatingStarted) return 'Mark when you start shooting';
      return c.delivered ? 'Your handover is ready' : 'Hand over your work when it is ready';
    }
    if (c.stage === 3) return c.contentStatus === 'changesRequested' ? 'Your host would love a small tweak' : 'Your host is reviewing your work';
    return 'All wrapped up';
  }

  function hydrateFromShared(c) {
    if (!c.link || !window.UKShared) return;
    /* NOTE: do not call ensureLifecycle()/normaliseLocalStage() here or after —
       those thresholds are for the OLD 6-stage seed numbering and will corrupt
       a stage already resolved from the shared record's new 5-stage names
       (e.g. normaliseLocalStage(1) collapses "onboarding" back to "inquiry"). */
    var seedDates = packageDates(c);
    var seedBrief = packageBrief(c);
    var rec = window.UKShared.ensure(c.link, {
      stage:'onboarding', passed:false, dates:seedDates, briefSent:true, brief:seedBrief,
      creatingStarted:false, contentStatus:null, assets:null, approvedNow:false,
      guideSent:false, guide:null, deliveredIds:null,
      msgs:[{ by:'creator', at:'4 days ago', tx:'Loved working with MiraGrace before — I would love to cover the quiet weeks in April too.' },
            { by:'hotel',   at:'yesterday',  tx:'Approved — your stay package is ready whenever you are.' }]
    });
    c.stage = SHARE_STAGE_TO_LOCAL[rec.stage] != null ? SHARE_STAGE_TO_LOCAL[rec.stage] : 0;
    c.dates = rec.dates || seedDates;
    c.briefSent = rec.briefSent != null ? !!rec.briefSent : c.stage >= 1;
    c.brief = hasBriefData(rec.brief) ? rec.brief : seedBrief;
    c.creatingStarted = !!rec.creatingStarted;
    c.contentStatus = rec.contentStatus || (c.stage === 4 ? 'approved' : null);
    c.guideSent = !!rec.guideSent;
    c.guide = rec.guide || null;
    c.delivered = rec.deliveredIds || c.delivered || (c.stage >= 3 ? ['w1','w2'] : null);
    c.approvedNow = !!rec.approvedNow;
    if (rec.msgs) c.msgs = rec.msgs.map(function (m) { return Object.assign({}, m, { by: m.by === 'creator' ? 'me' : 'them' }); });
    c.unread = 0;
  }
  function pushSharedPatch(c, patch) { if (c.link && window.UKShared) window.UKShared.set(c.link, patch); }
  function pushSharedMsg(c, msg)     { if (c.link && window.UKShared) window.UKShared.pushMsg(c.link, msg); }
  function hydrateLinked() {
    hydrateApplications();
    collabs.forEach(function (c) { c.link ? hydrateFromShared(c) : ensureLifecycle(c); });
  }

  /* ---- what the hotel did with an application ----
     An application this creator sent lives on the shared record, and the hotel
     answers it there. This pulls the answer back: a yes moves the row into
     onboarding, a no takes it out of the pipeline. Without this the creator
     would sit on "waiting to hear" forever, however many times the hotel
     replied. It also adds rows for applications sent from another session, so
     the list is the record rather than a copy of it. */
  function hydrateApplications() {
    var A = window.UKAPPLY;
    if (!A) return;
    var byApp = {};
    collabs.forEach(function (c) { if (c.application) byApp[c.application] = c; });

    A.mine().forEach(function (ap) {
      var c = byApp[ap.id];
      if (!c) {
        if (ap.state === 'withdrawn') return;
        c = { id: ap.id, stay: ap.stay, stage: 0, when: ap.at || 'just now',
              unread: 0, application: ap.id, msgs: [] };
        collabs.unshift(c);
      }
      c.msgs = (ap.msgs || []).map(function (m) {
        return { by: m.by === 'creator' ? 'me' : 'them', at: m.at, tx: m.tx };
      });
      if (ap.state === 'approved' && c.stage < 1) { c.stage = 1; c.passed = false; }
      if (ap.state === 'passed') { c.passed = true; c.stage = 0; }
      if (ap.state === 'withdrawn') {
        var i = collabs.indexOf(c);
        if (i > -1) collabs.splice(i, 1);
      }
    });
  }

  /* The mirror of the hotel's mapping: the same id is derived from the same pair,
     so a collaboration about stay s1 can never share a record with one about s2.
     Only stays this creator actually has with MiraGrace are linked. */
  var MG_STAYS = ['s1', 's2'];
  (function initShared() {
    collabs.forEach(function (c) {
      if (MG_STAYS.indexOf(c.stay) < 0) return;
      c.link = 'mg-amara-' + c.stay;
      hydrateFromShared(c);
    });
  })();

  function markShooting(collabId) {
    var c = byId(collabs, collabId);
    if (!c) return null;
    var msg = { by:'creator', at:'just now', tx:'Marked as shooting — I have started filming.' };
    if (c.link) {
      pushSharedPatch(c, { stage:'creating', creatingStarted:true });
      pushSharedMsg(c, msg);
      hydrateFromShared(c);
      return c;
    }
    c.stage = 2;
    c.creatingStarted = true;
    c.msgs.push(Object.assign({}, msg, { by:'me' }));
    return c;
  }
  function sendMessage(collabId, text) {
    var c = byId(collabs, collabId);
    if (!c || !text) return null;
    if (c.link) {
      pushSharedMsg(c, { by:'creator', at:'just now', tx:text });
      hydrateFromShared(c);
      return c;
    }
    c.msgs.push({ by:'me', at:'just now', tx:text });
    c.unread = 0;
    return c;
  }
  function deliverWork(collabId, deliveredIds) {
    var c = byId(collabs, collabId);
    if (!c) return null;
    var picks = deliveredIds && deliveredIds.length ? deliveredIds.slice() : ['w1'];
    var msg = { by:'creator', at:'just now', tx:'Handed over the content and left a tidy package in the thread.', kind:'delivered' };
    if (c.link) {
      pushSharedPatch(c, { stage:'content', contentStatus:'pending', assets:['a1','a2','a3','a4'], deliveredIds:picks, creatingStarted:true });
      pushSharedMsg(c, msg);
      hydrateFromShared(c);
      c.delivered = picks;
      c.justDelivered = true;
      return c;
    }
    c.stage = 3;
    c.contentStatus = 'pending';
    c.creatingStarted = true;
    c.delivered = picks;
    c.justDelivered = true;
    c.msgs.push(Object.assign({}, msg, { by:'me' }));
    return c;
  }

  /* ---------- Pitch Pilot ---------- */
  var pitches = [
    { id:'p1', hotel:'Casa Azul Tulum',   city:'Tulum, Mexico',      on:'12 Jan', via:'Email',     status:'Booked',    note:'Replied in two days. Booked for January.' },
    { id:'p2', hotel:'MiraGrace Estate',  city:'Miami, Florida',     on:'18 Jan', via:'Email',     status:'Responded', note:'Asked about March dates.' },
    { id:'p3', hotel:'Riad Amber',        city:'Marrakesh, Morocco', on:'20 Jan', via:'Instagram', status:'Booked',    note:'DM, replied same day.' },
    { id:'p4', hotel:'Alpina Zermatt',    city:'Zermatt, Switzerland',on:'02 Feb', via:'Email',    status:'Sent',      note:'' },
    { id:'p5', hotel:'Bondi Sands Hotel', city:'Sydney, Australia',  on:'04 Feb', via:'Instagram', status:'Sent',      note:'' },
    { id:'p6', hotel:'The Mayfair Rooms', city:'London, UK',         on:'06 Feb', via:'Email',     status:'Sent',      note:'No reply yet. Follow up on the 13th.' },
    { id:'p7', hotel:'Fjordheim Lodge',   city:'Ålesund, Norway',    on:'09 Feb', via:'Email',     status:'Responded', note:'Interested for June.' }
  ];

  /* ---------- earnings & growth ---------- */
  var earnings = {
    stays: 3, nights: 9, value: 4180,
    months: [
      { m:'Sep', pitches:4,  booked:0 }, { m:'Oct', pitches:7,  booked:1 },
      { m:'Nov', pitches:6,  booked:0 }, { m:'Dec', pitches:9,  booked:1 },
      { m:'Jan', pitches:12, booked:2 }, { m:'Feb', pitches:14, booked:1 }
    ]
  };

  /* ---------- academy ---------- */
  var academy = [
    { id:'m1', notes:'Hotels are not buying your audience. They are buying content they can post on their own feed, their booking page and their newsletter. That is what UGC means. A property with 40,000 followers of its own does not need yours, it needs something good to post. Which is why 8,000 people who actually watch you beats 80,000 who scroll past.', mod:'Start here', t:'Your content is the value, not your follower count',
      len:'6 min', done:true, m:'reel5',
      d:'Why hotels buy content for their own channels, and why 8,000 engaged followers beats 80,000 quiet ones.' },
    { id:'m2', notes:'Pitch three hotels in your own city this month. You can travel there for nothing, you can reshoot if the light is bad, and you build a portfolio of real hotel work before you ask anyone far away. Local independents say yes far more often than chains.', mod:'Start here', t:'Practice on hotels in your own city',
      len:'8 min', done:true, m:'shot3',
      d:'The lowest-risk way to build a portfolio before you pitch anywhere far.' },
    { id:'m3', notes:'UGC is user generated content: content made for the brand to use themselves. No audience required, no posting obligation on your side unless you agree to it. It is the reason a creator with a small following can still be worth a room.', mod:'Start here', t:'What UGC actually means',
      len:'5 min', done:false, m:'reel6',
      d:'Content made for the hotel to post themselves. No audience required.' },
    { id:'m4', notes:'Midweek nights and off-season weeks are the ones hotels struggle to sell. A room that sits empty earns nothing, so trading it for content costs them very little. Look for Tuesday to Thursday, shoulder season, and anywhere that just opened.', mod:'Pitching', t:'Pitch hotels with empty rooms',
      len:'9 min', done:false, m:'reel2',
      d:'Off-season and midweek is where the yeses live. How to spot them.' },
    { id:'m5', notes:'Subject line: short, specific, no hype. First sentence: who you are and what you shoot. Second: what you would deliver. Third: when. Never open by asking for something. Never attach a huge media kit to a cold email, link it instead.', mod:'Pitching', t:'The email that gets opened',
      len:'11 min', done:false, m:'shot4',
      d:'Subject lines, first sentences, and the one thing to never put in a pitch.' },
    { id:'m6', notes:'DM works when the hotel has no public marketing contact and an active Instagram. Keep it to four lines. Reference a specific post of theirs. Do not send a voice note.', mod:'Pitching', t:'Sliding into the DMs, properly',
      len:'7 min', done:false, m:'reel3',
      d:'When Instagram beats email, and how to write one that does not get ignored.' },
    { id:'m7', notes:'Shoot the room before you unpack, while it is still perfect. Then breakfast, then the amenity, then the exterior at golden hour. Leave the pool for the middle of the day when the light is worst for everything else.', mod:'On the stay', t:'Shooting a hotel in one morning',
      len:'12 min', done:false, m:'reel1',
      d:'A shot list that covers the room, the food and the light before checkout.' },
    { id:'m8', notes:'Usage rights say where and how long the hotel can use your work. In perpetuity means forever, on any of their own channels. That is standard for a hosted stay and it is fine. What you should not hand over is the right to resell it or pass it to another brand.', mod:'On the stay', t:'Usage rights, in plain English',
      len:'6 min', done:false, m:'shot2',
      d:'What you are agreeing to when a hotel keeps your content, and why it is fine.' }
  ];

  /* The creator posts on more than the two channels the seed hand-wrote, the same
     way every creator on the hotel's roster does — the onboarding asks about
     eight, so a profile that can only ever show two is describing the seed
     rather than the person. Follower counts are a fraction of the lead channel:
     a second platform is a second audience, not a copy of the first. */
  (function () {
    var PL = (window.UKVOCAB && window.UKVOCAB.PLATFORMS) || [];
    if (!PL.length || !me.plats || !me.plats.length) return;
    var have = me.plats.map(function (p) { return p.k; });
    var lead = me.plats[0].f || 12000;
    ['yt', 'fb'].forEach(function (k, i) {
      if (have.indexOf(k) > -1) return;
      var meta = PL.filter(function (x) { return x.k === k; })[0];
      if (!meta) return;
      me.plats.push({ k:meta.k, n:meta.n, f: Math.round(lead * (i ? 0.31 : 0.52)) });
    });
  })();

  /* Every piece of work declares WHAT IT IS, in the same eight formats the
     creator onboarding asks about. The record already knew whether a piece was a
     video or a photograph, which is a technical fact; "Reels" and "B-roll" and
     "Carousels" are what a hotel is actually buying, and they are what the
     creator picked in onboarding. Derived from the media kind so a still can
     never be filed as a reel, and stable by index so a given piece always
     reports the same format. */
  (function () {
    var FMT = (window.UKVOCAB && window.UKVOCAB.FORMATS) || [];
    var MOVING = ['Reels','UGC video','B-roll','Stories','Drone & aerial','Long-form / YouTube']
      .filter(function (f) { return FMT.indexOf(f) > -1; });
    var STILL = ['Photos','Carousels'].filter(function (f) { return FMT.indexOf(f) > -1; });
    if (!MOVING.length || !STILL.length) return;
    (me.work || []).forEach(function (w, i) {
      if (w.fmt) return;
      var pool = (MEDIA[w.m] || {}).kind === 'video' ? MOVING : STILL;
      w.fmt = pool[i % pool.length];
    });
  })();

  var MEMBER_PRICE = { day: 1, month: 29, year: 290 };

  var BANDS = ['Under 5K','5K - 25K','25K - 100K','100K+'];
  /* A hotel's base score is how open it is to creators at all. The score a given
     creator sees adjusts for how close their size is to what that hotel hopes for —
     never below 4, because a stretch is still worth a pitch. */
  function scoreFor(stay) {
    var mine = BANDS.indexOf(me.band), want = BANDS.indexOf(stay.wants);
    if (mine < 0 || want < 0) return stay.score;
    var gap = Math.abs(mine - want);
    var adj = gap === 0 ? 1 : gap === 1 ? 0 : gap === 2 ? -2 : -3;
    return Math.max(4, Math.min(10, stay.score + adj));
  }
  function fitNote(stay) {
    var mine = BANDS.indexOf(me.band), want = BANDS.indexOf(stay.wants);
    var gap = mine - want;
    if (gap === 0) return 'Right in the size range they usually host.';
    if (Math.abs(gap) === 1) return 'Close to the size they usually host.';
    if (gap < 0) return 'They usually host a bit bigger, but smaller creators land these all the time.';
    return 'Bigger than they usually host, which is rarely a problem.';
  }

  function byId(l, id) { return l.filter(function (x) { return x.id === id; })[0]; }
  function fmt(n) { return n >= 1000 ? (n/1000).toFixed(n >= 10000 ? 0 : 1).replace('.0','') + 'K' : String(n); }
  function money(n) { return '$' + n.toLocaleString('en-US'); }

  /* Proof of posting. Stored on the shared collaboration record, not a creator-only
     copy, so the hotel sees the same evidence the creator submitted.
     // PLUG-IN POINT — a real build verifies the URL resolves to a live post and
     hands the placement to Partnerize so the click_id can be bound to it. */
  function addProof(collabId, proof) {
    var c = collabs.filter(function (x) { return x.id === collabId; })[0];
    if (!c) return null;
    var rec = { url:proof.url, channel:proof.channel, placement:proof.placement, at:'just now' };
    c.proofs = (c.proofs || []).concat([rec]);
    if (c.link && window.UKShared) {
      window.UKShared.pushMsg(c.link, {
        by:'creator', at:'just now', kind:'proof',
        tx:'Shared the live post: ' + proof.placement + ' \u2014 ' + proof.url, proof:rec
      });
    }
    return c;
  }

  /* An accepted invitation becomes a collaboration that starts at ONBOARDING,
     not Inquiry. Inquiry is where a hotel sifts people it did not choose; this
     hotel went looking and picked them, so the creator's yes is the commitment
     moment and replaces the hotel's approval. */
  function acceptInvite(stayId) {
    /* Already talking about this stay? Then accepting an invitation moves that
       same collaboration forward rather than opening a second one — but it still
       jumps past Inquiry, because the hotel choosing them is what Inquiry was
       for. Never moves a collaboration backwards. */
    var existing = collabs.filter(function (c) { return c.stay === stayId; })[0];
    if (existing) {
      existing.stage = Math.max(existing.stage, 1);
      existing.fromInvite = true;
      return existing;
    }
    var stay = stays.filter(function (s) { return s.id === stayId; })[0];
    if (!stay) return null;
    var c = {
      id: 'k' + (collabs.length + 1),
      stay: stayId,
      stage: 1,                       /* post-approval onboarding, not Inquiry */
      fromInvite: true,
      unread: 0,
      when: 'just now',
      creatingStarted: false,
      contentStatus: null,
      delivered: null,
      msgs: [
        { by:'hotel', at:'just now',
          tx:'We came looking for you for this one \u2014 really glad you said yes. Dates and the brief are below.' },
        { by:'me', at:'just now', tx:'Thank you for thinking of me. Count me in.' }
      ]
    };
    collabs.unshift(c);
    return c;
  }

  /* A pin is named with its flag, the way every other place in the product is.
     The country is already in the city string, so it is read off that rather than
     stored a second time and allowed to drift. */
  var CC = { USA:'us', Mexico:'mx', Morocco:'ma', Norway:'no', Switzerland:'ch',
             Portugal:'pt', Spain:'es', Italy:'it', UAE:'ae', UK:'gb', France:'fr',
             Iceland:'is', Greece:'gr', Japan:'jp', Indonesia:'id',
             'South Africa':'za', Florida:'us' };
  /* Only six of twenty-two stays carried coordinates, so sixteen of them simply
     did not exist on the map view. The city is already named on every stay, so the
     point is read out of the shared market list rather than hand-keyed here.

     Exported rather than run once at load: ukcmatch.js pushes another sixteen
     stays after this file has finished, and those need placing too. */
  function norm(v) {
    return String(v || '').split(',')[0].trim().toLowerCase()
      /* NFD does not decompose ø, æ or ð — they are letters, not accented vowels,
         so Tromsø folded to "troms" and matched nothing. */
      .replace(/ø/g, 'o').replace(/æ/g, 'ae').replace(/å/g, 'a').replace(/ð/g, 'd').replace(/þ/g, 'th')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\bcity\b/g, '').replace(/[^a-z ]/g, '').replace(/\s+/g, ' ').trim();
  }
  /* Three places the gazetteer spells differently from the way people book them.
     A named alias is honest and fixable; a silent miss is a stay with no location. */
  var ALIAS = { fez:'fes' };
  /* Below the gazetteer's 15,000-person floor, so they are named outright rather
     than left off the map. */
  var EXTRA = { como:{ lat:45.81, lng:9.09, cc:'it' }, tromso:{ lat:69.65, lng:18.96, cc:'no' } };
  /* a saved property is remembered between visits, from the shared store */
  function hydrateFavs() {
    if (!window.UKFAVS) return;
    var saved = window.UKFAVS.list('stays');
    stays.forEach(function (s2) { s2.saved = saved.indexOf(s2.id) > -1; });
  }

  function placeStays() {
    stays.forEach(function (s2) {
      var tail = String(s2.city || '').split(',').pop().trim();
      if (!s2.cc) s2.cc = CC[tail] || null;
      if (s2.lat && s2.lng) return;
      /* Fold accents and drop the "City" suffix before comparing: the gazetteer
         says Reykjavík, Tromsø and New York City where a stay says Reykjavik,
         Tromso and New York, and an unmatched city is a stay that vanishes off
         the map. Regions count too — Santorini is an island, not a city. */
      var city = norm(s2.city); city = ALIAS[city] || city;
      if (EXTRA[city]) { s2.lat = EXTRA[city].lat; s2.lng = EXTRA[city].lng;
                         if (!s2.cc) s2.cc = EXTRA[city].cc; return; }
      var pool = window.UKMARKETS || [];
      var hit = pool.filter(function (m) { return m.t === 'c' && norm(m.n) === city; })[0]
             || pool.filter(function (m) { return m.t === 'r' && norm(m.n) === city; })[0]
             || pool.filter(function (m) {
                  return (m.t === 'c' || m.t === 'r') && norm(m.n).indexOf(city) === 0 &&
                         norm(m.sub || '') === norm(tail);
                })[0];
      if (hit) { s2.lat = hit.lat; s2.lng = hit.lng; if (!s2.cc) s2.cc = hit.cc; }
    });
  }
  placeStays();

  /* ---- stays a hotel has actually published ----
     The seeded stays above are the rest of the market: other properties, other
     cities, demonstration data. A stay published from the hotel app is a real
     one, and it arrives through the shared registry — the same record that app
     writes to. It goes to the front of the list because it is the newest thing
     in the network, and it is marked so the UI can say so. */
  function hydrateStays() {
    var R = window.UKSTAYS;
    if (!R) return;
    var have = {};
    stays.forEach(function (s) { have[s.id] = 1; });
    R.forCreator('c1').forEach(function (rec) {
      if (have[rec.id]) return;
      have[rec.id] = 1;
      stays.unshift(rec);
    });
    placeStays();
    hydrateFavs && hydrateFavs();
  }
  hydrateStays();
  hydrateApplications();

  return {
    hydrateStays: hydrateStays,
    MEDIA: MEDIA, me: me, stays: stays, STAGES: STAGES, collabs: collabs,
    addProof: addProof, acceptInvite: acceptInvite,
    pitches: pitches, earnings: earnings, academy: academy, MEMBER_PRICE: MEMBER_PRICE,
    stay: function (id) { return byId(stays, id); }, placeStays: placeStays, hydrateFavs: hydrateFavs,
    work: function (id) { return byId(me.work, id); },
    media: function (k) { return MEDIA[k] || MEDIA.reel1; },
    addPitch: function (p) { p.id = 'p' + (pitches.length + 1); pitches.unshift(p); return p; },
    dropPitch: function (id) { var i = pitches.map(function (x) { return x.id; }).indexOf(id); if (i > -1) pitches.splice(i, 1); },
    BANDS: BANDS, scoreFor: scoreFor, fitNote: fitNote,
    markShooting: markShooting, sendMessage: sendMessage, deliverWork: deliverWork,
    hydrateLinked: hydrateLinked, collabMine: collabMine, collabSay: collabSay, packageBrief: packageBrief, packageDates: packageDates, guideSnapshot: guideSnapshot,
    fmt: fmt, money: money,
    initials: function (n) { return n.split(' ').map(function (w) { return w[0]; }).slice(0,2).join(''); }
  };
})();
