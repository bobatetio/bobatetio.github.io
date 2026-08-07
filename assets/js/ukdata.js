/* Ukreate — hotel-side data.
   One consistent world so every screen agrees. Swap for the API later.
   Application state lives here in memory only; nothing is written to storage. */
window.UK = (function () {

  var IMG = '/assets/img/';
  var AV  = IMG + 'fc/av/';

  /* The real lifecycle after the inquiry decision.
     Inquiry is the only pre-approval stage; once a hotel approves, the collab moves
     into Onboarding with finalised dates, the edited brief, and the guest guide. */
  var STAGES = [
    { key:'inquiry',    short:'Inquiry',    mine:true,
      sayMine:'Decide whether to approve or pass', say:'You have reached out' },
    { key:'onboarding', short:'Onboarding', mine:false,
      sayMine:'Your stay package is ready',        say:'Your stay package is ready' },
    { key:'creating',   short:'Creating',   mine:false,
      sayMine:'Your creator is shooting',          say:'Your creator is shooting' },
    { key:'content',    short:'Content',    mine:true,
      sayMine:'Your content is ready to review',   say:'Your content is ready to review' },
    { key:'complete',   short:'Complete',   mine:false,
      sayMine:'All wrapped up',                    say:'All wrapped up' }
  ];

  /* ---- past the deadline ----
     NOT a sixth stage. A collaboration that has run late is still at Creating —
     the creator can deliver tomorrow and it moves on to Content exactly as it
     would have. Making it a stage would mean inventing a transition out of it and
     deciding what happens when someone delivers late, which is a worse model than
     the truth: this is a FLAG on a stage, derived from the brief's own deadline.

     Worded as a fact about the work, not a verdict on the person: "Content was due
     on the 12th" rather than "creator failed to deliver". A hotel reading this
     usually wants to send a reminder, not open a dispute, and most late work is
     late by days, not abandoned. */
  function briefDeadline(c) {
    /* window.UK, not a local `uk` — this module IS window.UK and there is no such
       local in scope here. */
    var api = window.UK;
    var b = (c && c.brief) || (api && api.packageBrief ? api.packageBrief(c) : null);
    return (b && b.deadline) || null;
  }
  /* The seeded world is set in 2027, so "now" is the demo's own clock rather than
     the wall clock — otherwise every stay would read as years overdue.
     // PLUG-IN POINT — real time. Replace with Date.now() once the data is live. */
  var NOW = '2027-03-20';
  function daysLate(c) {
    var d = briefDeadline(c);
    if (!d) return 0;
    var due = new Date(d);
    if (isNaN(due)) return 0;
    var now = new Date(NOW);
    return Math.floor((now - due) / 86400000);
  }
  /* Only while they are shooting and nothing has landed. Once anything is
     delivered the hotel's move is to review it, not to chase. */
  function isOverdue(c) {
    if (!c || c.passed || c.stage !== 2) return false;
    if ((c.assets || []).length) return false;
    return daysLate(c) > 0;
  }

  var creators = [
    { id:'c1', lat:38.72, lng:-9.14, langs:'English, Portuguese', plats:[{k:'ig',n:'Instagram',f:94000},{k:'tt',n:'TikTok',f:34000}], age:'25-34 (58%)', gender:'71% women', tops:'Portugal, UK, Germany', reach:'31K per post', resp:'within 4 hours', worked:[{h:'Casa Azul Tulum',out:'3 videos, 12 photos'},{h:'Riad Amber',out:'1 video, 8 photos'}], been:[{n:'Lisbon',lat:38.72,lng:-9.14},{n:'Marrakesh',lat:31.63,lng:-8.0},{n:'Tulum',lat:20.21,lng:-87.46},{n:'Milan',lat:45.46,lng:9.19}], n:'Amara Mensah',   h:'@amaratravels', loc:'Lisbon, Portugal',  img:AV+'av-01.jpg',
      f:128000, p:['ig','tt'], type:'Wellness & spa', stays:23, ontime:100, eng:'6.4%', rating:4.9,
      free:'From 12 Mar', bio:'Slow travel and design-led properties. Shoots, edits and delivers solo.',
      proof:'Her last resort feature drove 340 saves and a 3-week booking bump for the property.' },
    { id:'c2', lat:25.76, lng:-80.19, langs:'English, Spanish', plats:[{k:'tt',n:'TikTok',f:61000},{k:'yt',n:'YouTube',f:25400}], age:'18-24 (44%)', gender:'55% women', tops:'USA, Canada, Mexico', reach:'22K per post', resp:'within 2 hours', worked:[{h:'Palms Dania Beach',out:'2 videos, 10 photos'},{h:'Bondi Sands Hotel',out:'4 videos'}], been:[{n:'Miami',lat:25.76,lng:-80.19},{n:'Tulum',lat:20.21,lng:-87.46},{n:'Sydney',lat:-33.87,lng:151.21}], n:'Kelvis Carter',  h:'@kelvisc',      loc:'Miami, USA',        img:AV+'av-02.jpg',
      f:86400,  p:['tt','yt'], type:'Hotel & resort UGC', stays:41, ontime:98, eng:'5.1%', rating:4.7,
      free:'Available now', bio:'High-volume UGC. Fast turnaround, raw files always included.',
      proof:'41 hosted stays delivered. Fastest average turnaround on the network at 5 days.' },
    { id:'c3', lat:19.43, lng:-99.13, langs:'Spanish, English', plats:[{k:'ig',n:'Instagram',f:54200}], age:'25-34 (49%)', gender:'52% men', tops:'Mexico, USA, Spain', reach:'19K per post', resp:'within a day', worked:[{h:'Casa Azul Tulum',out:'2 videos, 14 photos'}], been:[{n:'Mexico City',lat:19.43,lng:-99.13},{n:'Tulum',lat:20.21,lng:-87.46},{n:'Lisbon',lat:38.72,lng:-9.14}], n:'Cesar Delgado',  h:'@cesargoes',    loc:'Mexico City, Mexico', img:AV+'av-03.jpg',
      f:54200,  p:['ig'], type:'Food & beverage', stays:17, ontime:94, eng:'7.2%', rating:4.8,
      free:'From 04 Apr', bio:'Restaurant and bar content for resorts. Former line cook.',
      proof:'Highest engagement rate on the network. Restaurant covers consistently outperform.' },
    { id:'c4', lat:34.05, lng:-118.24, langs:'English', plats:[{k:'yt',n:'YouTube',f:186000},{k:'ig',n:'Instagram',f:84000},{k:'tt',n:'TikTok',f:42000}], age:'25-34 (51%)', gender:'58% men', tops:'USA, UK, Australia', reach:'118K per post', resp:'within a day', worked:[{h:'Alyeska Resort',out:'1 long-form video'},{h:'Fjordheim Lodge',out:'2 videos, 6 photos'}], been:[{n:'Los Angeles',lat:34.05,lng:-118.24},{n:'Girdwood',lat:60.95,lng:-149.16},{n:'Alesund',lat:62.47,lng:6.15},{n:'Queenstown',lat:-45.03,lng:168.66}], n:'Brooklyn Reyes', h:'@brooklynr',    loc:'Los Angeles, USA',  img:AV+'av-04.jpg',
      f:312000, p:['ig','tt','yt'], type:'Travel & adventure', stays:8, ontime:100, eng:'4.4%', rating:5.0,
      free:'From 20 May', bio:'Long-form YouTube plus shorts. Averages 400k views per property feature.',
      proof:'Every stay delivered on time. Largest reach of any creator you can host this quarter.' },
    { id:'c5', lat:59.91, lng:10.75, langs:'Norwegian, English', plats:[{k:'ig',n:'Instagram',f:28800},{k:'yt',n:'YouTube',f:13000}], age:'25-34 (61%)', gender:'74% women', tops:'Norway, Sweden, Germany', reach:'14K per post', resp:'within 6 hours', worked:[{h:'Fjordheim Lodge',out:'1 video, 12 photos'}], been:[{n:'Oslo',lat:59.91,lng:10.75},{n:'Alesund',lat:62.47,lng:6.15},{n:'Zermatt',lat:46.02,lng:7.75}], n:'Nadia Halvorsen',h:'@nadiah',       loc:'Oslo, Norway',      img:AV+'av-05.jpg',
      f:41800,  p:['ig','yt'], type:'Eco & wellness', stays:12, ontime:92, eng:'8.1%', rating:4.6,
      free:'Available now', bio:'Nordic eco lodges and wild swimming. Strong 25-40 female audience.',
      proof:'Small but unusually engaged audience. 8.1% is roughly triple the category average.' },
    { id:'c6', lat:35.01, lng:135.77, langs:'Japanese, English', plats:[{k:'ig',n:'Instagram',f:151000},{k:'tt',n:'TikTok',f:52000}], age:'25-44 (63%)', gender:'64% women', tops:'Japan, USA, Singapore', reach:'47K per post', resp:'within 8 hours', worked:[{h:'Riad Amber',out:'2 videos, 20 photos'},{h:'The Mayfair Rooms',out:'1 video, 9 photos'}], been:[{n:'Kyoto',lat:35.01,lng:135.77},{n:'Marrakesh',lat:31.63,lng:-8.0},{n:'London',lat:51.51,lng:-0.13}], n:'Theo Nakamura',  h:'@theonak',      loc:'Kyoto, Japan',      img:AV+'av-06.jpg',
      f:203000, p:['ig','tt'], type:'Luxury & design', stays:31, ontime:97, eng:'5.6%', rating:4.9,
      free:'From 02 Apr', bio:'Ryokan and boutique properties. Natural light only.',
      proof:'31 stays with luxury properties. His stills are used in three hotels’ own booking pages.' },
    { id:'c7', lat:15.3, lng:74.08, langs:'English, Hindi, Konkani', plats:[{k:'ig',n:'Instagram',f:44000},{k:'tt',n:'TikTok',f:23300}], age:'18-24 (52%)', gender:'61% women', tops:'India, UAE, UK', reach:'16K per post', resp:'within 3 hours', worked:[{h:'Casa Azul Tulum',out:'1 video, 8 photos'}], been:[{n:'Goa',lat:15.3,lng:74.08},{n:'Marrakesh',lat:31.63,lng:-8.0}], n:'Priya Raman',    h:'@priyawanders', loc:'Goa, India',        img:AV+'av-07.jpg',
      f:67300,  p:['ig','tt'], type:'Boutique & budget', stays:19, ontime:95, eng:'6.9%', rating:4.5,
      free:'Available now', bio:'Affordable stays for younger travellers. Very high save rate.',
      proof:'Save rate is the highest on the network, which is the metric that precedes a booking.' },
    { id:'c8', lat:-33.92, lng:18.42, langs:'English, Afrikaans', plats:[{k:'yt',n:'YouTube',f:96000},{k:'ig',n:'Instagram',f:62000}], age:'25-34 (47%)', gender:'63% men', tops:'South Africa, UK, USA', reach:'38K per post', resp:'within a day', worked:[{h:'Bondi Sands Hotel',out:'2 videos, 8 photos'}], been:[{n:'Cape Town',lat:-33.92,lng:18.42},{n:'Sydney',lat:-33.87,lng:151.21},{n:'Queenstown',lat:-45.03,lng:168.66}], n:'Marcus Bell',    h:'@marcusbell',   loc:'Cape Town, SA',     img:AV+'av-08.jpg',
      f:158000, p:['yt','ig'], type:'Sports & outdoors', stays:26, ontime:96, eng:'4.8%', rating:4.8,
      free:'From 18 Mar', bio:'Surf, hike, dive. Works with lodges near coastline and parks.',
      proof:'Drone certified. Delivers exterior and location footage most creators cannot shoot.' },
    { id:'c9', lat:45.46, lng:9.19, langs:'Italian, English, French', plats:[{k:'ig',n:'Instagram',f:94500}], age:'25-44 (66%)', gender:'68% women', tops:'Italy, France, USA', reach:'29K per post', resp:'within 5 hours', worked:[{h:'The Mayfair Rooms',out:'4 TikToks, 6 photos'},{h:'Alpina Zermatt',out:'1 video, 15 photos'}], been:[{n:'Milan',lat:45.46,lng:9.19},{n:'London',lat:51.51,lng:-0.13},{n:'Zermatt',lat:46.02,lng:7.75}], n:'Sofia Marchetti',h:'@sofiam',       loc:'Milan, Italy',      img:AV+'av-09.jpg',
      f:94500,  p:['ig'], type:'Luxury & design', stays:22, ontime:99, eng:'5.9%', rating:4.7,
      free:'From 27 Mar', bio:'Editorial stills. Her hotel work has run in three print magazines.',
      proof:'Editorial quality. Properties routinely license her stills for print after the stay.' },
    { id:'c10', lat:31.63, lng:-8.0, langs:'Arabic, French, English', plats:[{k:'ig',n:'Instagram',f:122000},{k:'tt',n:'TikTok',f:54000}], age:'25-44 (59%)', gender:'66% women', tops:'Morocco, France, UK', reach:'43K per post', resp:'within 3 hours', worked:[{h:'Riad Amber',out:'2 videos, 20 photos'},{h:'MiraGrace Estate',out:'1 video, 9 photos'}], been:[{n:'Marrakesh',lat:31.63,lng:-8.0},{n:'Lisbon',lat:38.72,lng:-9.14},{n:'Miami',lat:25.76,lng:-80.19}],n:'Leila Haddad',   h:'@leilahaddad',  loc:'Marrakesh, Morocco',img:AV+'av-10.jpg',
      f:176000, p:['ig','tt'], type:'Luxury & design', stays:28, ontime:100, eng:'6.1%', rating:4.9,
      free:'Available now', bio:'Riads and desert camps. Works in Arabic, French and English.',
      proof:'28 stays, none late. Multilingual delivery if you need copy in more than one language.' }
  ];


  /* What each creator offers a property. The hotel chooses between these. */
  var creatorPacks = [
    { n:'Essential',  nights:1, del:'1 UGC video',                       rights:'Yours in perpetuity, all channels' },
    { n:'Signature',  nights:2, del:'1 UGC video, 3 photos',             rights:'Yours in perpetuity, all channels', rec:true },
    { n:'Full story', nights:3, del:'2 UGC videos, 8 photos, 2 reels',   rights:'Yours in perpetuity, all channels' }
  ];

  /* Three starting points for Host a Creator. The hotel picks one, then adjusts
     anything. A package is a starting point, never a commitment. */
  var packages = [
    { id:'starter', n:'Starter', rec:false,
      tag:'Testing the water',
      nights:'1', inc:'Room and breakfast', reach:'10K-50K',
      del:{ 'UGC video':1 },
      why:'One short stay, one video. The smallest useful trade, and the easiest to say yes to.' },
    { id:'standard', n:'Standard', rec:true,
      tag:'Most properties like yours choose this',
      nights:'2', inc:'Room, breakfast, one treatment or dinner', reach:'25K-100K',
      del:{ 'UGC video':1, 'Photos':3 },
      why:'A video and three photos is about a month of your own posts, a booking-page refresh and a newsletter.' },
    { id:'feature', n:'Feature', rec:false,
      tag:'A bigger moment',
      nights:'3', inc:'Room, all meals, one experience', reach:'100K+',
      del:{ 'UGC video':2, 'Photos':6, 'Reels':2 },
      why:'For a relaunch or a season opening, with a higher-reach creator and enough nights to shoot properly.' }
  ];

  /* Hosted stays. The offer is the trade, never a cash amount. */
  var stays = [
    { id:'s1', t:'Spa season, midweek', img:IMG+'hero_bg_room.jpg',
      nights:3, capacity:3, rooms:'Garden suite', inc:'Room, breakfast, one spa treatment',
      from:'04 Mar 2027', to:'07 Mar 2027', status:'live', apps:5, reach:'25K-100K',
      type:'Wellness & spa',
      del:[{t:'UGC video',q:1},{t:'Photos',q:3}],
      rights:'Yours in perpetuity, all channels' },
    { id:'s2', t:'Quiet weeks in April', img:IMG+'hero_bg_lobby.webp',
      nights:2, capacity:2, rooms:'Standard king', inc:'Room and breakfast',
      from:'12 Apr 2027', to:'14 Apr 2027', status:'live', apps:3, reach:'10K-50K',
      type:'Boutique & budget',
      del:[{t:'UGC video',q:1},{t:'Photos',q:5}],
      rights:'Yours in perpetuity, all channels' },
    { id:'s3', t:'Restaurant relaunch', img:IMG+'hero_bg_indoor.webp',
      nights:2, capacity:4, rooms:'Deluxe double', inc:'Room, tasting menu for two',
      from:'20 May 2027', to:'22 May 2027', status:'draft', apps:0, reach:'50K-250K',
      type:'Food & beverage',
      del:[{t:'UGC video',q:2},{t:'Photos',q:6}],
      rights:'Yours in perpetuity, all channels' },
    { id:'s4', t:'Summer poolside', img:IMG+'hero_bg_outdoor.webp',
      nights:4, capacity:2, rooms:'Poolside cabana', inc:'Room, all meals, activities',
      from:'02 Jul 2026', to:'06 Jul 2026', status:'closed', apps:11, reach:'100K+',
      type:'Travel & adventure',
      del:[{t:'UGC video',q:2},{t:'Photos',q:8}],
      rights:'Yours in perpetuity, all channels' }
  ];

  /* One collaboration per lifecycle stage so each final state is reachable. */
  var collabs = [
    { id:'x1', who:'c2', stay:'s1', stage:0, unread:2, when:'2 days ago',
      msgs:[{by:'them',at:'2 days ago',tx:'I would love to cover the spa season stay. I shoot fast, deliver in five days and always hand over the raw files. Happy to work to whatever brief you set.'}] },
    { id:'x2', who:'c5', stay:'s1', stage:1, unread:0, when:'yesterday',
      dates:{ status:'accepted', from:'2027-03-04', to:'2027-03-07' },
      briefSent:true,
      brief:{ title:'Spa season, midweek', deliverables:'1 UGC video, 3 photos', deadline:'2027-03-07',
              notes:'Hosted stay: 3 nights in the garden suite. Included: Room, breakfast, one spa treatment. Usage rights: Yours in perpetuity, all channels.' },
      msgs:[{by:'them',at:'4 days ago',tx:'Applying for the midweek spa stay. My audience is almost entirely women 25 to 40 planning wellness trips.'},
            {by:'me',at:'yesterday',tx:'Approved on our side. Your stay package is ready whenever you want to glance through it.'}] },
    { id:'x3', who:'c9', stay:'s1', stage:1, unread:1, when:'3 days ago',
      dates:{ status:'accepted', from:'2027-03-04', to:'2027-03-07' },
      briefSent:true,
      brief:{ title:'Garden suite, golden hour', deliverables:'1 UGC video, 3 photos', deadline:'2027-03-12',
              notes:'Lead with the garden suite at golden hour and include the spa.' },
      msgs:[{by:'me',at:'6 days ago',tx:'Your stay package is finalised and sitting here for you.'},
            {by:'them',at:'3 days ago',tx:'Brief received, all clear. I will confirm my arrival time closer to the date.'}] },
    { id:'x4', who:'c6', stay:'s2', stage:2, unread:0, when:'yesterday',
      dates:{ status:'accepted', from:'2027-04-12', to:'2027-04-14' },
      briefSent:true,
      brief:{ title:'Lobby and terrace at first light', deliverables:'1 UGC video, 5 photos', deadline:'2027-04-20',
              notes:'First light in the lobby, then the terrace over breakfast service.' },
      creatingStarted:false,
      msgs:[{by:'them',at:'2 days ago',tx:'Arrived and checked in. Shooting the lobby at first light tomorrow.'},
            {by:'me',at:'yesterday',tx:'Wonderful. Ask for Yusuf at reception if you need access anywhere.'}] },
    { id:'x5', who:'c1', stay:'s2', stage:1, unread:0, when:'yesterday',
      dates:{ status:'accepted', from:'2027-04-12', to:'2027-04-14' },
      briefSent:true,
      msgs:[{by:'them',at:'4 days ago',tx:'Loved working with MiraGrace before — I would love to cover the quiet weeks in April too.'},
            {by:'me',at:'yesterday',tx:'Approved — your stay package is ready whenever you are.'}] },
    { id:'x6', who:'c10',stay:'s4', stage:4, unread:0, when:'6 weeks ago',
      dates:{ status:'accepted', from:'2026-07-02', to:'2026-07-06' },
      briefSent:true,
      brief:{ title:'Poolside summer', deliverables:'2 UGC videos, 8 photos', deadline:'2026-07-10',
              notes:'Poolside by day, terrace at sunset, property hero shots.' },
      creatingStarted:true,
      assets:['a5','a6'], contentStatus:'approved',
      msgs:[{by:'me',at:'7 weeks ago',tx:'Content approved and downloaded. Thank you, this was one of our strongest sets this year.'},
            {by:'them',at:'6 weeks ago',tx:'Thank you. I would happily come back for the winter season.'}] },
    { id:'x7', who:'c1', stay:'s1', stage:3, unread:3, when:'6 hours ago',
      dates:{ status:'accepted', from:'2027-02-12', to:'2027-02-14' },
      briefSent:true,
      brief:{ title:'Suite walkthrough and breakfast', deliverables:'1 UGC video, 5 photos', deadline:'2027-02-19',
              notes:'Suite walkthrough, lobby at first light, breakfast service.' },
      creatingStarted:true,
      assets:['a1','a2','a3','a4'], contentStatus:'pending',
      msgs:[{by:'them',at:'6 hours ago',tx:'All delivered, a little ahead of schedule. One video and five photos, plus the raw files. The suite footage came out beautifully.'}] }
  ];

  var SHARE_STAGE_TO_LOCAL = { inquiry:0, dates:1, brief:1, onboarding:1, creating:2, review:3, content:3, done:4, complete:4 };
  var LOCAL_STAGE_TO_SHARE = ['inquiry','onboarding','creating','content','complete'];

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
  function packageDates(c) {
    var s = byId(stays, c.stay) || {};
    var from = toISO((c.dates || {}).from) || toISO(s.from);
    var to = toISO((c.dates || {}).to) || toISO(s.to);
    return { status:'accepted', from:from, to:to, by:((c.dates || {}).by || 'hotel') };
  }
  function hasBriefData(brief) {
    return !!(brief && (brief.title || brief.deliverables || brief.notes || brief.file || brief.link));
  }
  function packageBrief(c, override) {
    var s = byId(stays, c.stay) || {};
    var base = {
      title: s.t || '',
      deliverables: (s.del || []).map(function (d) { return d.q + ' ' + d.t.toLowerCase(); }).join(', '),
      deadline: addDays(toISO(s.to), 7) || toISO(s.to),
      notes: 'Hosted stay: ' + (s.nights || '') + ' nights in the ' + ((s.rooms || '').toLowerCase()) + '. Included: ' + (s.inc || '') + '. Usage rights: ' + (s.rights || '') + '.',
      file: '',
      link: ''
    };
    var merged = Object.assign({}, base, c.brief || {}, override || {});
    ['title','deliverables','notes','link','file'].forEach(function (k) { if (merged[k]) merged[k] = String(merged[k]).trim(); });
    merged.deadline = toISO(merged.deadline) || base.deadline;
    return merged;
  }
  function propertyGuideSnapshot() {
    /* window.UK is not assigned until this IIFE returns, so guard against
       being called during this module's own initial load (collabs.forEach
       below runs synchronously, before window.UK/window.UK.guides exist). */
    var uk = window.UK;
    var g = uk && (uk.guides || [])[0];
    if (!g) return null;
    return { id:g.id, prop:g.prop, live:!!g.live, sections:(uk.GUIDE_SECTIONS || []).map(function (sec) {
      return { k:sec.k, t:sec.t, tx:(g.body[sec.k] || '').trim() || sec.seed };
    }) };
  }
  function guideSnapshot(c) {
    if (c.guide) return c.guide;
    if (!c.briefSent && c.stage < 1) return null;
    return propertyGuideSnapshot();
  }
  function ensureLifecycle(c) {
    c.stage = normaliseLocalStage(c.stage || 0);
    c.passed = !!c.passed;
    if (c.passed) return c;
    if (c.stage >= 1) {
      c.dates = packageDates(c);
      c.brief = packageBrief(c);
      c.briefSent = true;
      c.guide = guideSnapshot(c);
      c.guideSent = !!c.guide;
      /* A collaboration past Inquiry has, by definition, had its package sent —
         so the thread has to show it having been sent. Without this a seeded
         onboarding collab read as though the package arrived from nowhere. */
      c.msgs = c.msgs || [];
      if (!c.msgs.some(function (m) { return m.kind === 'dates'; })) {
        c.msgs.push({ by:'me', at:'yesterday', kind:'dates',
          tx:'Finalised the stay dates.',
          dates:{ from:c.dates.from, to:c.dates.to, accepted:true, finalized:true } });
      }
      if (!c.msgs.some(function (m) { return m.kind === 'brief'; })) {
        c.msgs.push({ by:'me', at:'yesterday', kind:'brief',
          tx:'Finalised the brief for your stay package.', brief:c.brief });
      }
      if (c.guide && !c.msgs.some(function (m) { return m.kind === 'guide'; })) {
        c.msgs.push({ by:'me', at:'yesterday', kind:'guide',
          tx:'Shared the guest guide for ' + c.guide.prop + '.', guide:c.guide });
      }
    }
    if (c.stage >= 4) c.contentStatus = 'approved';
    return c;
  }
  collabs.forEach(ensureLifecycle);

  /* -------- the one shared record -------- */
  function hydrateFromShared(c) {
    if (!c.link || !window.UKShared) return;
    ensureLifecycle(c);
    var seedGuide = propertyGuideSnapshot();
    var seedDates = packageDates(c);
    var seedBrief = packageBrief(c);
    var rec = window.UKShared.ensure(c.link, {
      stage:'onboarding', passed:false, dates:seedDates, briefSent:true, brief:seedBrief,
      creatingStarted:false, contentStatus:null, assets:null, approvedNow:false,
      guideSent:!!seedGuide, guide:seedGuide, deliveredIds:null,
      msgs:[{ by:'creator', at:'4 days ago', tx:'Loved working with MiraGrace before — I would love to cover the quiet weeks in April too.' },
            { by:'hotel',   at:'yesterday',  tx:'Approved — your stay package is ready whenever you are.' }]
    });
    var sharedStage = rec.stage || 'inquiry';
    c.stage = SHARE_STAGE_TO_LOCAL[sharedStage] != null ? SHARE_STAGE_TO_LOCAL[sharedStage] : 0;
    c.passed = !!rec.passed;
    c.dates = rec.dates || packageDates(c);
    c.briefSent = rec.briefSent != null ? !!rec.briefSent : c.stage >= 1;
    c.brief = hasBriefData(rec.brief) ? rec.brief : packageBrief(c);
    c.creatingStarted = !!rec.creatingStarted;
    c.contentStatus = rec.contentStatus || (c.stage === 4 ? 'approved' : null);
    c.guideSent = rec.guideSent != null ? !!rec.guideSent : !!seedGuide;
    c.guide = rec.guide || seedGuide;
    if (rec.assets) c.assets = rec.assets;
    c.approvedNow = !!rec.approvedNow;
    c.affiliateLink = rec.affiliateLink || c.affiliateLink;
    c.deliveredIds = rec.deliveredIds || c.deliveredIds || null;
    if (rec.msgs) c.msgs = rec.msgs.map(function (m) { return Object.assign({}, m, { by: m.by === 'hotel' ? 'me' : 'them' }); });
    c.unread = 0;
    ensureLifecycle(c);
    var patch = {};
    if (!rec.dates || !rec.dates.from || !rec.dates.to) patch.dates = c.dates;
    if (!rec.briefSent || !hasBriefData(rec.brief)) { patch.briefSent = true; patch.brief = c.brief; }
    if (!rec.guideSent && c.guide) { patch.guideSent = true; patch.guide = c.guide; }
    if (Object.keys(patch).length) window.UKShared.set(c.link, patch);
  }
  function pushSharedPatch(c, patch) { if (c.link && window.UKShared) window.UKShared.set(c.link, patch); }
  function pushSharedMsg(c, msg)     { if (c.link && window.UKShared) window.UKShared.pushMsg(c.link, msg); }
  function hydrateLinked() { collabs.forEach(function (c) { c.link ? hydrateFromShared(c) : ensureLifecycle(c); }); }

  /* Every collaboration that genuinely exists on both sides gets a link, keyed by
     the pair it actually is. The signed-in creator is c1, so those are the ones
     the creator app also holds; a hotel collaboration with anyone else has no
     counterpart to link to. The id is derived from the pair rather than typed,
     which is what previously let x5 (stay s2) end up sharing a record with the
     creator's collaboration for stay s1. */
  (function initShared() {
    collabs.forEach(function (c) {
      if (c.who !== 'c1') return;
      c.link = 'mg-amara-' + c.stay;
      hydrateFromShared(c);
    });
  })();

  function collabMine(c) {
    if (c.passed) return false;
    switch (c.stage) {
      case 0: return true;
      case 1: return false;
      case 2: return false;
      case 3: return c.contentStatus !== 'approved';
      default: return false;
    }
  }
  /* Kept to one short line each: this sits beside a label that already says whose
     move it is, and it has to fit on a single row wherever it is shown. */
  function collabSay(c) {
    if (c.passed) return 'Passed';
    if (c.stage === 0) return 'Approve or pass';
    if (c.stage === 1) return 'Package sent';
    if (c.stage === 2) return c.creatingStarted ? 'Shooting under way' : 'Shoot not started';
    if (c.stage === 3) return c.contentStatus === 'changesRequested' ? 'Changes requested' : 'Content just landed';
    return 'All wrapped up';
  }
  /* Every collaboration gets one tracking link for its whole run. If a live
     attribution row already exists for it (content shipped, bookings tracked)
     that link is the source of truth; otherwise it is generated the moment
     onboarding is approved, so the shape never changes underneath a creator. */
  function affiliateFor(c) {
    var live = attribution.filter(function (r) { return r.collab === c.id; })[0];
    if (live) return live.link;
    if (c.affiliateLink) return c.affiliateLink;
    var cr = byId(creators, c.who);
    var first = (cr ? cr.n.split(' ')[0] : 'creator').toLowerCase().replace(/[^a-z0-9]/g, '');
    return 'ukr.at/' + property.code.toLowerCase() + '-' + first;
  }
  function sendBrief(collabId, brief) {
    var c = byId(collabs, collabId);
    if (!c) return null;
    var finalBrief = packageBrief(c, brief || {});
    var dates = packageDates(c);
    var guide = propertyGuideSnapshot();
    var link = affiliateFor(c);
    var dateMsg = { by:'hotel', at:'just now', tx:'Finalised the stay dates: ' + dates.from + ' to ' + dates.to + '.', kind:'dates', dates:{ from:dates.from, to:dates.to, accepted:true, finalized:true } };
    var briefMsg = { by:'hotel', at:'just now', tx:'Finalised the brief for your stay package.', kind:'brief', brief:finalBrief };
    var guideMsg = guide ? { by:'hotel', at:'just now', tx:'Shared the guest guide for ' + guide.prop + '.', kind:'guide', guide:guide } : null;
    var affMsg = { by:'hotel', at:'just now', tx:'Sent your unique affiliate link for this stay.', kind:'affiliate', link:link };
    if (c.link) {
      pushSharedPatch(c, {
        stage:'onboarding', passed:false, dates:dates,
        briefSent:true, brief:finalBrief,
        guideSent:!!guide, guide:guide,
        affiliateLink:link,
        creatingStarted:false, contentStatus:null, approvedNow:false
      });
      pushSharedMsg(c, dateMsg);
      pushSharedMsg(c, briefMsg);
      if (guideMsg) pushSharedMsg(c, guideMsg);
      pushSharedMsg(c, affMsg);
      hydrateFromShared(c);
      return c;
    }
    c.passed = false;
    c.stage = 1;
    c.dates = dates;
    c.briefSent = true;
    c.brief = finalBrief;
    c.guideSent = !!guide;
    c.guide = guide;
    c.affiliateLink = link;
    c.creatingStarted = false;
    c.contentStatus = null;
    c.unread = 0;
    c.msgs.push(Object.assign({}, dateMsg, { by:'me' }));
    c.msgs.push(Object.assign({}, briefMsg, { by:'me' }));
    if (guideMsg) c.msgs.push(Object.assign({}, guideMsg, { by:'me' }));
    c.msgs.push(Object.assign({}, affMsg, { by:'me' }));
    return c;
  }
  function passCollab(collabId) {
    var c = byId(collabs, collabId);
    if (!c) return null;
    var msg = { by:'hotel', at:'just now', tx:'Passed on this collaboration for now.', kind:'pass' };
    if (c.link) {
      pushSharedPatch(c, { passed:true, stage:'inquiry' });
      pushSharedMsg(c, msg);
      hydrateFromShared(c);
      return c;
    }
    c.passed = true;
    c.msgs.push(Object.assign({}, msg, { by:'me' }));
    return c;
  }
  function requestChanges(collabId, note, assetIds) {
    var c = byId(collabs, collabId);
    if (!c) return null;
    var tx = note ? 'Requested a change: ' + note : 'Requested changes on the delivered content.';
    var msg = { by:'hotel', at:'just now', tx:tx, kind:'changereq', note:note || '', assets:assetIds || [] };
    if (c.link) {
      pushSharedPatch(c, { stage:'content', contentStatus:'changesRequested' });
      pushSharedMsg(c, msg);
      hydrateFromShared(c);
      return c;
    }
    c.stage = 3;
    c.contentStatus = 'changesRequested';
    c.msgs.push(Object.assign({}, msg, { by:'me' }));
    return c;
  }
  function sendMessage(collabId, text) {
    var c = byId(collabs, collabId);
    if (!c || !text) return null;
    if (c.link) {
      pushSharedMsg(c, { by:'hotel', at:'just now', tx:text });
      hydrateFromShared(c);
      return c;
    }
    c.msgs.push({ by:'me', at:'just now', tx:text });
    c.unread = 0;
    return c;
  }

  /* Everything the hotel now owns. */
  var assets = [
    { id:'a1', owned:false, k:'video', img:IMG+'hero_bg_room.jpg',    t:'Garden suite walkthrough', by:'c1', stay:'s2', on:'12 Feb 2027', time:'9:14 AM', plat:'ig', len:'0:42', tags:['Suite','Interior'] },
    { id:'a2', owned:false, k:'photo', img:IMG+'hero_bg_lobby.webp',  t:'Lobby at first light',     by:'c1', stay:'s2', on:'12 Feb 2027', time:'9:20 AM', plat:'ig', tags:['Lobby','Interior'] },
    { id:'a3', owned:false, k:'photo', img:IMG+'hero_bg_indoor.webp', t:'Breakfast service',        by:'c1', stay:'s2', on:'12 Feb 2027', time:'8:02 AM', plat:'tt', tags:['Dining'] },
    { id:'a4', owned:false, k:'photo', img:IMG+'hero_bg_outdoor.webp',t:'Terrace, late afternoon',  by:'c1', stay:'s2', on:'12 Feb 2027', time:'5:41 PM', plat:'ig', tags:['Exterior'] },
    { id:'a5', owned:true, k:'video', img:IMG+'hero_bg_grand.webp',  t:'Poolside summer edit',     by:'c10',stay:'s4', on:'18 Jul 2026', time:'2:10 PM', plat:'tt', len:'1:04', tags:['Pool','Exterior'] },
    { id:'a6', owned:true, k:'photo', img:IMG+'hero_bg_hotel.webp',  t:'Property hero',            by:'c10',stay:'s4', on:'18 Jul 2026', time:'11:35 AM', plat:'ig', tags:['Exterior','Hero'] },
    { id:'a7', owned:true, k:'photo', img:IMG+'fc2/roster-1.jpg',    t:'Spa treatment room',       by:'c10',stay:'s4', on:'18 Jul 2026', time:'1:05 PM', plat:'ig', tags:['Spa','Interior'] },
    { id:'a8', owned:true, k:'photo', img:IMG+'fc2/roster-2.jpg',    t:'Guest arrival',            by:'c10',stay:'s4', on:'18 Jul 2026', time:'10:12 AM', plat:'yt', tags:['Lifestyle'] },
    { id:'a9', owned:true, k:'photo', img:IMG+'fc2/roster-3.jpg',    t:'Evening terrace',          by:'c10',stay:'s4', on:'18 Jul 2026', time:'7:48 PM', plat:'ig', tags:['Exterior','Evening'] }
  ];

  /* ================= LOAD SEED =================
     SEEDED DEMONSTRATION DATA, generated rather than typed, so the app can be
     looked at under real weight: a hotel with twenty stays and thirty-odd live
     collaborations behaves very differently from one with four, and a lot of
     layout and pagination problems only appear once a list is long.

     Deterministic on purpose — no Math.random anywhere — so the same creator
     carries the same numbers on every paint and screenshots are comparable.
     Everything below reuses the vocabularies and image pools already in the
     project; nothing here invents a new concept. */
  var GEN_NAMES = [
    'Ines Ferreira','Mateo Rivas','Aiko Tanaka','Noor Haddad','Felix Brandt',
    'Zanele Dlamini','Otto Lindqvist','Camila Duarte','Rahul Menon','Sofie Bakker',
    'Tomas Novak','Yara Salib','Hugo Almeida','Mina Park','Andre Costa',
    'Lucia Moretti','Kwame Boateng','Elif Demir'
  ];
  var GEN_HANDLES = GEN_NAMES.map(function (n) {
    return '@' + n.toLowerCase().split(' ')[0] + n.split(' ')[1].charAt(0).toLowerCase();
  });
  var GEN_CITIES = ['Lisbon, Portugal','Mexico City, Mexico','Kyoto, Japan','Marrakesh, Morocco',
    'Oslo, Norway','Milan, Italy','Cape Town, SA','Goa, India','Miami, USA','Los Angeles, USA'];
  var GEN_BIOS = [
    'Quiet interiors and long lunches. Shoots alone, edits fast.',
    'High-volume short form. Raw files always included.',
    'Design-led properties and the people who run them.',
    'Food first. Everything else is the setting.',
    'Cold water, early starts, and the rooms in between.',
    'Slow travel for people who hate rushing.'
  ];
  var GEN_PROOF = [
    'Their last property feature ran three weeks and drove a measurable booking lift.',
    'Delivers early more often than late, which almost nobody does.',
    'Highest save rate in their category, which is the metric that precedes a booking.',
    'Repeat-booked by two properties in the same quarter.'
  ];
  var GEN_FREE = ['Available now','From 12 Mar','From 04 Apr','From 20 May','From 18 Mar','From 02 Apr'];
  /* the real filenames — the set skips av-14, and guessing a range 404s */
  var AV_POOL = ['av-01.jpg','av-02.jpg','av-03.jpg','av-04.jpg','av-05.jpg','av-06.jpg','av-07.jpg',
                 'av-08.jpg','av-09.jpg','av-10.jpg','av-11.jpg','av-12.jpg','av-13.jpg','av-15.jpg'];

  GEN_NAMES.forEach(function (n, i) {
    var id = 'c' + (11 + i);
    var f = 18000 + (i * 14300) % 260000;
    /* Everyone is somewhere; a minority also post on a fourth channel, which is
       what the onboarding actually allows. The roster has to contain those people
       or the platform filter has options that can never return anybody. */
    var EXTRA = [
      { k:'fb', n:'Facebook'  }, { k:'sc', n:'Snapchat' },
      { k:'pi', n:'Pinterest' }, { k:'x',  n:'X'        }, { k:'li', n:'LinkedIn' }
    ];
    var plats = [
      { k:'ig', n:'Instagram', f: Math.round(f * 0.58) },
      { k:'tt', n:'TikTok',    f: Math.round(f * 0.27) },
      { k:'yt', n:'YouTube',   f: Math.round(f * 0.15) }
    ].slice(0, 2 + (i % 2));
    if (i % 3 === 0) {
      var ex = EXTRA[(i / 3 | 0) % EXTRA.length];
      plats.push({ k:ex.k, n:ex.n, f: Math.round(f * 0.09) });
    }
    var city = GEN_CITIES[i % GEN_CITIES.length];
    creators.push({
      id:id, n:n, h:GEN_HANDLES[i], loc:city,
      img:AV + AV_POOL[i % AV_POOL.length],
      f:f, p:plats.map(function (x) { return x.k; }), plats:plats,
      type:'Wellness & spa',                       /* replaced by the cats pass below */
      stays: 3 + (i * 5) % 34,
      ontime: 88 + (i * 3) % 13,
      eng: (3.4 + ((i * 7) % 48) / 10).toFixed(1) + '%',
      rating: Number((4.1 + ((i * 3) % 9) / 10).toFixed(1)),
      reach: D_fmt(Math.round(f * (0.22 + (i % 5) / 40))) + ' per post',
      resp: ['within 2 hours','within 4 hours','within 6 hours','within a day'][i % 4],
      turn: ['3 days','5 days','a week'][i % 3],
      free: GEN_FREE[i % GEN_FREE.length],
      langs: ['English','English, Portuguese','English, Spanish','English, Japanese',
              'English, French','English, Arabic'][i % 6],
      bio: GEN_BIOS[i % GEN_BIOS.length],
      proof: GEN_PROOF[i % GEN_PROOF.length],
      age:'25-34 (54%)', gender:'62% women', tops:'USA, UK, Germany',
      lat:0, lng:0,
      worked:[{ h:'Casa Azul Tulum', out:'2 videos, 9 photos' }],
      been:[{ n:city.split(',')[0].trim() },
            { n:['Tulum','Milan','London','Sydney','Zermatt','Marrakesh'][i % 6] },
            { n:['Lisbon','Kyoto','Goa','Oslo','Queenstown','Cape Town'][(i + 2) % 6] }]
    });
  });
  function D_fmt(n) { return n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace('.0','') + 'K' : String(n); }

  /* ---- more hosted stays ---- */
  var GEN_STAYS = [
    ['Rooftop summer nights','Poolside cabana','Room, all meals, rooftop access'],
    ['Chef\u2019s table weekends','Deluxe double','Room and the tasting menu'],
    ['Shoulder season, sea view','Sea view king','Room, breakfast, late checkout'],
    ['Spa reopening','Garden suite','Room, breakfast, two treatments'],
    ['Long stay, slow weeks','Studio suite','Room, breakfast, laundry'],
    ['Design floor preview','Design king','Room and breakfast'],
    ['Family half term','Family suite','Two rooms, all breakfasts'],
    ['Harvest week','Garden suite','Room, breakfast, vineyard tour'],
    ['Winter quiet','Standard king','Room and breakfast'],
    ['New wing launch','Deluxe double','Room, breakfast, spa access'],
    ['Midweek city break','Standard king','Room and breakfast'],
    ['Wellness reset','Garden suite','Room, all meals, daily treatment'],
    ['Surf season','Poolside cabana','Room, breakfast, board hire'],
    ['Gallery weekend','Design king','Room, breakfast, gallery pass'],
    ['Off-season escape','Sea view king','Room, half board'],
    ['Festival week','Studio suite','Room and breakfast']
  ];
  var GEN_IMGS = [IMG+'hero_bg_room.jpg', IMG+'hero_bg_lobby.webp', IMG+'hero_bg_indoor.webp',
    IMG+'hero_bg_outdoor.webp', IMG+'hero_bg_grand.webp', IMG+'hero_bg_hotel.webp',
    IMG+'fc2/roster-1.jpg', IMG+'fc2/roster-2.jpg', IMG+'fc2/roster-3.jpg', IMG+'fc2/roster-4.jpg'];
  var GEN_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Sep','Oct','Nov'];
  GEN_STAYS.forEach(function (row, i) {
    var id = 's' + (5 + i);
    var d1 = 3 + (i * 3) % 22, m = GEN_MONTHS[i % GEN_MONTHS.length];
    var nights = 2 + (i % 4);
    stays.push({
      id:id, t:row[0], img:GEN_IMGS[i % GEN_IMGS.length],
      nights:nights, capacity: 2 + (i % 4), rooms:row[1], inc:row[2],
      from: String(d1).padStart(2,'0') + ' ' + m + ' 2027',
      to:   String(d1 + nights).padStart(2,'0') + ' ' + m + ' 2027',
      status: i % 5 === 4 ? 'draft' : (i % 7 === 6 ? 'closed' : 'live'),
      apps: (i * 4) % 13, reach:['10K-50K','25K-100K','50K-250K','100K+'][i % 4],
      type:'Wellness & spa',
      del:[{ t:'UGC video', q:1 + (i % 2) }, { t:'Photos', q:3 + (i % 5) }],
      rights:'Yours in perpetuity, all channels'
    });
  });

  /* ---- more collaborations, spread across every stage ----
     Weighted so no tab is empty and the busy ones feel busy. */
  var GEN_STAGE = [0,0,0,0,0,0,1,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,0,1,2,3,0,1];
  var GEN_MSG = [
    'I would love to cover this one. I shoot fast and hand over the raw files too.',
    'Free the whole of that week and it is a short flight for me. Happy to work to your brief.',
    'Big fan of the property. I would lead on the interiors and the food.',
    'I have shot two places like yours this year, both delivered inside a week.'
  ];
  GEN_STAGE.forEach(function (stage, i) {
    var cr = creators[(i + 10) % creators.length];
    var stay = stays[(i + 4) % stays.length];
    collabs.push({
      id:'x' + (8 + i), who:cr.id, stay:stay.id, stage:stage,
      unread: stage === 0 ? (i % 3) : 0,
      when: ['2 days ago','yesterday','6 hours ago','last week','3 days ago'][i % 5],
      creatingStarted: stage >= 2,
      contentStatus: stage === 4 ? 'approved' : (stage === 3 && i % 5 === 0 ? 'changesRequested' : null),
      assets: stage >= 3 ? ['a1','a2','a3'].slice(0, 2 + (i % 2)) : null,
      msgs: [{ by:'them', at:['2 days ago','yesterday','6 hours ago'][i % 3], tx: GEN_MSG[i % GEN_MSG.length] }]
    });
  });

  /* Tracked links for the collaborations that have actually published, so the
     ROI screens carry the same weight as the rest of the app rather than five
     rows against thirty-odd collaborations. */
  (function scaleAttribution() {
    if (!window.UKATTRIB) return;
    var rows = window.UKATTRIB.rows().slice();     /* keep the five hand-written ones */
    var live = collabs.filter(function (c) { return c.stage >= 3; });
    live.forEach(function (c, i) {
      if (rows.some(function (r) { return r.collab === c.id; })) return;
      var cr = creators.filter(function (x) { return x.id === c.who; })[0];
      if (!cr) return;
      var bookings = 4 + (i * 3) % 24;
      rows.push({
        id: 'r' + (rows.length + 1), collab: c.id, who: c.who, stay: c.stay,
        code: cr.n.split(' ')[0].toUpperCase() + '-MG',
        link: 'ukr.at/mg-' + cr.n.split(' ')[0].toLowerCase(),
        live: ['12 Feb 2027','02 Feb 2027','26 Jan 2027','18 Jul 2026','04 Mar 2027'][i % 5],
        clicks: 420 + (i * 137) % 1900,
        impressions: 12000 + (i * 3100) % 42000,
        bookings: bookings,
        nights: bookings * (2 + (i % 3)),
        revenue: bookings * (820 + (i * 70) % 700),
        window: '90 days'
      });
    });
    window.UKATTRIB.reseed(rows);
  })();

  /* ---- markets and categories, as the onboarding models them ----
     A creator declares a flat list of markets they work and a flat list of what
     they shoot. Neither is ranked: there is no "base city" that outranks the rest,
     which is why `loc` is only ever an address here and never the head of the
     markets list. Both cap at UKVOCAB.MAX_PICKS, and the category words come from
     the shared vocabulary so a hotel filter and a creator profile can never
     describe the same person in different terms. */
  /* A market is always named the way onboarding names it: place and country, never
     the bare city. Same list the globe pins. */
  /* A gazetteer built from the coordinates the roster already carries, so the
     globe can fly to a typed place without a geocoding call. Keyed loosely: a
     hotel types "Miami, Florida" and the roster says "Miami". */
  var PLACES = {};
  /* 0,0 is the Gulf of Guinea, and it is what a generated creator with no
     coordinates carries. Taking it would move every city on the globe to null
     island, so an unplaced record teaches the gazetteer nothing — and a real
     reading is never overwritten by a later, vaguer one. */
  function learnPlace(n, lat, lng) {
    if (!n || !lat || !lng) return;
    var k = String(n).split(',')[0].trim().toLowerCase();
    if (PLACES[k]) return;
    PLACES[k] = { lat:lat, lng:lng, n:n };
  }
  function placeOf(name) {
    var k = String(name || '').split(',')[0].trim().toLowerCase();
    return PLACES[k] || null;
  }

  var MARKET = {
    Lisbon:['Lisbon, Portugal','pt'],      Marrakesh:['Marrakesh, Morocco','ma'],
    Tulum:['Tulum, Mexico','mx'],          Milan:['Milan, Italy','it'],
    Miami:['Miami, USA','us'],             Sydney:['Sydney, Australia','au'],
    'Mexico City':['Mexico City, Mexico','mx'], 'Los Angeles':['Los Angeles, USA','us'],
    Girdwood:['Girdwood, USA','us'],       Alesund:['Alesund, Norway','no'],
    Queenstown:['Queenstown, New Zealand','nz'], Oslo:['Oslo, Norway','no'],
    Zermatt:['Zermatt, Switzerland','ch'], Kyoto:['Kyoto, Japan','jp'],
    London:['London, UK','gb'],            Goa:['Goa, India','in'],
    'Cape Town':['Cape Town, South Africa','za']
  };
  /* seeded: which of the shared categories each creator declared */
  var CATS = {
    c1:['Wellness & spa','Luxury & design','Culture & city'],
    c2:['Luxury & design','Beach & islands','Couples & honeymoon'],
    c3:['Food & drink','Culture & city','Nightlife & events'],
    c4:['Adventure & outdoors','Road trips','Nature & wildlife','Mountain & ski'],
    c5:['Eco & sustainable','Wellness & spa','Nature & wildlife'],
    c6:['Luxury & design','Culture & city','Couples & honeymoon'],
    c7:['Budget & backpacking','Beach & islands','Solo travel'],
    c8:['Adventure & outdoors','Mountain & ski','Nature & wildlife'],
    c9:['Luxury & design','Nightlife & events','Culture & city'],
    c10:['Luxury & design','Wellness & spa','Beach & islands']
  };
  var MAXP = (window.UKVOCAB && window.UKVOCAB.MAX_PICKS) || 5;
  /* the generated roster picks from the same list the onboarding offers, so a
     loaded system shows the real spread of categories rather than 18 identical
     "Wellness & spa" creators */
  var VOCAB = (window.UKVOCAB && window.UKVOCAB.SHOOTS) || [];
  creators.forEach(function (c, i) {
    if (CATS[c.id] || !VOCAB.length) return;
    CATS[c.id] = [VOCAB[(i * 5) % VOCAB.length],
                  VOCAB[(i * 5 + 3) % VOCAB.length],
                  VOCAB[(i * 5 + 7) % VOCAB.length]]
      .filter(function (v, n, a) { return a.indexOf(v) === n; });
  });
  /* What they actually make, from the same eight formats the creator onboarding
     asks for. This is a different question from what they shoot: "Luxury & design"
     is a subject, "Reels" is a deliverable, and a hotel that needs B-roll cannot
     answer it from the subject list. Everyone declares two or three. */
  var FORMATS = (window.UKVOCAB && window.UKVOCAB.FORMATS) || [];
  creators.forEach(function (c, i) {
    if (c.makes || !FORMATS.length) return;
    c.makes = [FORMATS[(i * 3) % FORMATS.length],
               FORMATS[(i * 3 + 2) % FORMATS.length],
               FORMATS[(i * 5 + 1) % FORMATS.length]]
      .filter(function (v, n, a) { return a.indexOf(v) === n; })
      .slice(0, 2 + (i % 2));
  });

  /* Everyone was on Instagram, TikTok or YouTube and nothing else, which made
     the platform filter offer three of the eight the onboarding actually asks
     about — a filter cannot show a platform nobody has declared. Each creator
     picks up one or two more, chosen by index so a given creator always has the
     same ones, with a smaller following than their main channel: a second
     platform is a second audience, not a copy of the first. */
  (function () {
    var PL = (window.UKVOCAB && window.UKVOCAB.PLATFORMS) || [];
    var EXTRA = PL.filter(function (p) { return ['ig','tt','yt'].indexOf(p.k) < 0; });
    if (!EXTRA.length) return;
    creators.forEach(function (c, i) {
      var have = (c.plats || []).map(function (p) { return p.k; });
      var lead = (c.plats && c.plats[0] && c.plats[0].f) || 20000;
      var add = 1 + (i % 2);                       /* one or two, never more */
      for (var n = 0; n < add; n++) {
        var p = EXTRA[(i * 3 + n * 2) % EXTRA.length];
        if (have.indexOf(p.k) > -1) continue;
        have.push(p.k);
        c.plats.push({ k:p.k, n:p.n, f: Math.round(lead * (0.18 + ((i + n) % 4) * 0.09)) });
      }
      c.p = have.slice();                          /* the card's mark row */
    });
  })();

  creators.forEach(function (c) {
    var names = (c.been || []).map(function (b) { return b.n; });
    if (!names.length) names = [String(c.loc || '').split(',')[0].trim()];
    c.markets = names.slice(0, MAXP).map(function (n) {
      var m = MARKET[n];
      return m ? { n:m[0], cc:m[1] } : { n:n, cc:null };
    });
    learnPlace(c.loc, c.lat, c.lng);
    (c.been || []).forEach(function (b) { learnPlace(b.n, b.lat, b.lng); });
    c.cats = (CATS[c.id] || [c.type]).slice(0, MAXP);
    c.type = c.cats[0];   // the filter chip and the card now say the same word
  });

  /* More approved work, so the library has enough in it to show what a real
     content shelf looks like — and enough video that the video tab is a grid
     rather than one lonely tile. SEEDED DEMONSTRATION MEDIA. */
  (function moreAssets() {
    var POOL = [
      [IMG+'hero_bg_room.jpg','Suite at golden hour','Suite'],
      [IMG+'hero_bg_lobby.webp','Lobby, morning light','Lobby'],
      [IMG+'hero_bg_indoor.webp','The dining room','Dining'],
      [IMG+'hero_bg_outdoor.webp','Terrace before service','Exterior'],
      [IMG+'hero_bg_grand.webp','Pool at first light','Pool'],
      [IMG+'hero_bg_hotel.webp','Arrival','Exterior'],
      [IMG+'fc2/roster-1.jpg','Treatment room','Spa'],
      [IMG+'fc2/roster-2.jpg','Check-in','Lifestyle'],
      [IMG+'fc2/roster-3.jpg','Evening on the terrace','Evening'],
      [IMG+'fc2/roster-4.jpg','Breakfast, second sitting','Dining'],
      [IMG+'hero_bg_creator_solo.webp','Walkthrough, top floor','Suite'],
      [IMG+'hero_bg_creators.webp','The rooftop, sunset','Rooftop']
    ];
    var WHO = ['c1','c10','c6','c9','c5','c2'];
    var ON  = ['12 Feb 2027','18 Jul 2026','02 Feb 2027','26 Jan 2027','04 Mar 2027'];
    for (var i = 0; i < 22; i++) {
      var row = POOL[i % POOL.length];
      var isV = i % 3 !== 2;                       /* two videos to every photo */
      assets.push({
        id:'a' + (10 + i), owned:true, k: isV ? 'video' : 'photo',
        img:row[0], t:row[1] + (i > 11 ? ' II' : ''),
        by:WHO[i % WHO.length], stay:'s' + ((i % 4) + 1), on:ON[i % ON.length],
        time:(7 + (i % 12)) + ':' + String((i * 7) % 60).padStart(2,'0') + (i % 2 ? ' AM' : ' PM'),
        plat:['ig','tt','yt'][i % 3],
        len: isV ? '0:' + String(18 + (i * 3) % 40).padStart(2,'0') : undefined,
        tags:[row[2], isV ? 'Video' : 'Photo']
      });
    }
  })();

  /* Every asset declares WHAT IT IS and WHAT IT IS ABOUT, in the same two
     vocabularies the creator onboarding uses. They answer different questions and
     the library filters both: "Reels" is a deliverable, "Luxury & design" is a
     subject, and a hotel looking for drone footage cannot get there from a
     subject list. Derived rather than hand-written per asset, and derived from
     the CREATOR who shot it, so a piece of content can never claim a format or a
     subject its own creator does not declare. */
  (function () {
    var FMT = (window.UKVOCAB && window.UKVOCAB.FORMATS) || [];
    /* which of the eight formats can be a moving picture and which a still */
    var MOVING = ['Reels','UGC video','B-roll','Stories','Drone & aerial','Long-form / YouTube'];
    var STILL  = ['Photos','Carousels'];
    function pick(pool, i) { return pool.length ? pool[i % pool.length] : null; }

    assets.forEach(function (a, i) {
      var c = byId(creators, a.by);
      var kind = a.k === 'video' ? MOVING : STILL;
      if (!a.fmt) {
        /* their own declared formats first; the general list only if they
           declare nothing that could have produced this kind of file */
        var mine = ((c && c.makes) || []).filter(function (m) { return kind.indexOf(m) > -1; });
        a.fmt = pick(mine.length ? mine : kind.filter(function (m) { return FMT.indexOf(m) > -1; }) , i)
             || pick(kind, i);
      }
      if (!a.niche) a.niche = pick((c && c.cats) || [c && c.type].filter(Boolean), i);
      /* and the channel it was made for, again from the creator's own set: a
         file cannot have been posted somewhere its creator does not post, and
         reading it off them spreads the library across every platform anyone on
         the roster is actually on rather than the same three */
      var chans = ((c && c.plats) || []).map(function (p) { return p.k; });
      if (chans.length) a.plat = pick(chans, i + (a.k === 'photo' ? 1 : 0));
    });
  })();

  /* Portfolio stills for the creator card's clip strip. SEEDED DEMONSTRATION
     MEDIA drawn from the shared image pool, assigned by index so a given creator
     always shows the same four frames rather than reshuffling on every paint.
     Real portfolios would come from the creator's own uploads. */
  var WORK_POOL = [
    IMG+'hero_bg_room.jpg',   IMG+'hero_bg_lobby.webp',   IMG+'hero_bg_indoor.webp',
    IMG+'hero_bg_outdoor.webp', IMG+'hero_bg_grand.webp',  IMG+'hero_bg_hotel.webp',
    IMG+'fc2/roster-1.jpg',   IMG+'fc2/roster-2.jpg',     IMG+'fc2/roster-3.jpg',
    IMG+'fc2/roster-4.jpg',   IMG+'hero_bg_creator_solo.webp', IMG+'hero_bg_creators.webp'
  ];
  creators.forEach(function (c, i) {
    c.work = [0, 1, 2, 3].map(function (n) { return WORK_POOL[(i * 5 + n * 3) % WORK_POOL.length]; });
  });

  var property = {
    /* the flag sits beside the city wherever the property is named, the way every
       other place in the product is written */
    name:'MiraGrace Estate', code:'MG', city:'Miami, Florida', cc:'us', type:'Resort',
    cat:'Wellness & spa', img:IMG+'fc2/hero-hotel.jpg',
    about:'A wellness-led estate ten minutes from the water, built around a spa, two restaurants and a rooftop pool.'
  };


  /* ---- Bookings & ROI ----
     SEEDED DEMONSTRATION DATA. Attribution tracking is not live. These figures are
     plausible but invented and every ROI screen labels them as sample data. The shape
     matches how a real tracking partner would report: one row per collaboration,
     keyed to the collaboration, carrying the creator and the stay. */
  var COMMISSION = { uk: 4, creator: 4, ota: 22 };   // percent

  /* The attribution rows now live in ukattrib.js, which both apps load, so the
     hotel and creator views can never describe different bookings. */
  var attribution = (window.UKATTRIB && window.UKATTRIB.rows()) || [];



  /* monthly trend for the ROI dashboard */
  var trend = [
    { m:'Sep', bookings:4,  revenue:5400  }, { m:'Oct', bookings:6,  revenue:8100  },
    { m:'Nov', bookings:5,  revenue:6750  }, { m:'Dec', bookings:9,  revenue:12150 },
    { m:'Jan', bookings:11, revenue:14850 }, { m:'Feb', bookings:14, revenue:18900 },
    { m:'Mar', bookings:12, revenue:16200 }, { m:'Apr', bookings:21, revenue:24750 }
  ];

  /* which pieces of content actually drove bookings */
  var contentPerf = [
    { asset:'a5', bookings:19, revenue:25650, views:412000 },
    { asset:'a1', bookings:14, revenue:18900, views:186000 },
    { asset:'a2', bookings:9,  revenue:12150, views:94000  },
    { asset:'a6', bookings:7,  revenue:9450,  views:77000  }
  ];

  /* Team. Three roles sized to how a property actually works. */
  var ROLES = [
    { id:'owner',   n:'Owner',   can:'Everything, including billing and removing people.' },
    { id:'manager', n:'Manager', can:'Approve creators and content, run hosted stays. No billing.' },
    { id:'staff',   n:'Staff',   can:'View collaborations and the content library. Cannot approve or invite.' }
  ];
  var team = [
    { id:'u1', n:'Robert Torres',    e:'robert@miragrace.com', role:'owner',   status:'active',  since:'Owner since January' },
    { id:'u2', n:'Yusuf Marchetti',  e:'yusuf@miragrace.com',  role:'manager', status:'active',  since:'Front desk' },
    { id:'u3', n:'Dani Okafor',      e:'dani@miragrace.com',   role:'staff',   status:'invited', since:'Invited 2 days ago' }
  ];
  var teamSeq = 3;
  function addMember(email, role) {
    teamSeq += 1;
    var nm = email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
    var m = { id:'u' + teamSeq, n:nm, e:email, role:role, status:'invited', since:'Invited just now' };
    team.push(m); return m;
  }

  function money(n) { return '$' + n.toLocaleString('en-US'); }
  function roiTotals(rows) {
    var t = rows.reduce(function (a, r) {
      a.bookings += r.bookings; a.revenue += r.revenue; a.clicks += r.clicks; a.nights += r.nights; return a;
    }, { bookings:0, revenue:0, clicks:0, nights:0 });
    t.commission = Math.round(t.revenue * (COMMISSION.uk + COMMISSION.creator) / 100);
    t.otaWould   = Math.round(t.revenue * COMMISSION.ota / 100);
    t.saved      = t.otaWould - t.commission;
    return t;
  }

  /* Approving is the moment ownership becomes true: the collaboration completes
     and its assets enter the library. Nothing else moves them there. This is the
     one approve-and-keep path — the shared record just rides along with it, it
     never gets its own separate copy of what "approved" means. */
  function approve(collabId, today) {
    var c = collabs.filter(function (x) { return x.id === collabId; })[0];
    if (!c || !c.assets) return 0;
    c.assets.forEach(function (id) {
      var a = byId(assets, id);
      if (a && !a.owned) { a.owned = true; a.on = today || 'Today'; }
    });
    c.stage = 4;
    c.unread = 0;
    c.approvedNow = true;
    c.contentStatus = 'approved';
    if (c.link) pushSharedPatch(c, { stage:'complete', contentStatus:'approved', approvedNow:true });
    return c.assets.length;
  }

  function byId(list, id) { return list.filter(function (x) { return x.id === id; })[0]; }
  function fmt(n) { return n >= 1000 ? (n/1000).toFixed(n >= 10000 ? 0 : 1).replace('.0','') + 'K' : String(n); }

  return {
    STAGES: STAGES, creators: creators, stays: stays, collabs: collabs, packages: packages,
    attribution: attribution, COMMISSION: COMMISSION, money: money, roiTotals: roiTotals,
    creatorPacks: creatorPacks, trend: trend, contentPerf: contentPerf,
    ROLES: ROLES, team: team, addMember: addMember,
    setRole: function (id, r) { var m = team.filter(function (x) { return x.id === id; })[0]; if (m) m.role = r; },
    dropMember: function (id) { var i = team.map(function (x) { return x.id; }).indexOf(id); if (i > 0) team.splice(i, 1); },
    assets: assets, property: property,
    creator: function (id) { return byId(creators, id); },
    stay:    function (id) { return byId(stays, id); },
    asset:   function (id) { return byId(assets, id); },
    addStay: function (s) { stays.unshift(s); return s; },
    approve: approve, passCollab: passCollab,
    collabMine: collabMine, collabSay: collabSay, placeOf: placeOf,
    isOverdue: isOverdue, daysLate: daysLate, briefDeadline: briefDeadline,
    sendBrief: sendBrief, requestChanges: requestChanges, sendMessage: sendMessage, affiliateFor: affiliateFor,
    hydrateLinked: hydrateLinked, guideSnapshot: guideSnapshot, packageBrief: packageBrief, packageDates: packageDates,
    owned: function () { return assets.filter(function (a) { return a.owned; }); },
    fmt: fmt,
    initials: function (n) { return n.split(' ').map(function (w) { return w[0]; }).slice(0,2).join(''); }
  };
})();
