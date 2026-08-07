/* Ukreate — creator profile, extended (features 1, 2 and 4).
   Replaces V.profile. Everything the original showed is still here; what is new is
   the identity block (travel type, age band, interests), top stays, the curated
   itinerary, and content from previous partnerships.

   Framing matters on this side: this whole surface is the pride wall. Empty sections
   invite, they never scold, and nothing is ever labelled incomplete. */
(function () {
  /* one registry, the same eight the onboarding offers */
  var PLAT_MARK = {
    ig:'/assets/img/brand/instagram.svg', tt:'/assets/img/brand/tiktok.svg',
    yt:'/assets/img/brand/youtube.svg',   fb:'/assets/img/brand/facebook.svg',
    sc:'/assets/img/brand/snapchat.svg',  x:'/assets/img/brand/x.svg',
    li:'/assets/img/brand/linkedin.svg',  pi:'/assets/img/brand/pinterest.svg'
  };
  var D = window.UKC, V = window.UKCV;
  if (!D || !V) return;

  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) {
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; }); };
  var m = V.media, pic = V.pic, head = V.head;

  function chips(list, cls) {
    return '<ul class="ukChips">' + (list || []).map(function (t) {
      return '<li class="ukChip2' + (cls ? ' ' + cls : '') + '">' + esc(t) + '</li>';
    }).join('') + '</ul>';
  }


  /* ================= by the numbers =================
     A profile that only says what someone shoots is a claim. These are the
     records behind the claim, and every one is read off work already delivered
     or bookings already confirmed. A hotel deciding whether to host you is doing
     arithmetic, and this is the arithmetic. */
  function stats() {
    var CH = window.UKCHART;
    if (!CH) return '';
    var me = D.me;
    var work = (me.work || []).filter(function (w) { return w.plays; });
    var plays = work.reduce(function (a, w) { return a + w.plays; }, 0);
    var saves = work.reduce(function (a, w) { return a + (w.saves || 0); }, 0);
    var pl = (me.plats || []).filter(function (p) { return p.f; });
    var reach = pl.reduce(function (a, p) { return a + p.f; }, 0);
    var A = window.UKATTRIB;
    var att = A ? A.totals(A.forCreator('c1')) : null;
    var done = (D.collabs || []).filter(function (c) { return c.stage >= 4; }).length;

    return '<section class="ukPanel"><div class="ukPanel_head">' +
        '<h3 class="ukPanel_title">By the numbers</h3></div>' +
        '<p class="ukAsk">Everything here is read off work you have actually delivered. Nothing is a claim.</p>' +
        '<div class="ukProfNums">' +
          num(D.fmt(reach), 'people reached', 'across ' + pl.length + ' platform' + (pl.length === 1 ? '' : 's')) +
          num(D.fmt(plays), 'plays delivered', 'on ' + work.length + ' pieces') +
          num(D.fmt(saves), 'saves', plays ? Math.round(saves / plays * 1000) + ' per 1,000 plays' : '') +
          num(String(done), 'stays completed', 'start to finish') +
          (att ? num(String(att.confirmed.nights), 'room nights driven',
                     att.confirmed.count + ' confirmed bookings') : '') +
        '</div>' +
      '</section>' +

      '<div class="ukGrid">' +
        (pl.length > 1
          ? '<section class="ukPanel"><div class="ukPanel_head">' +
              '<h3 class="ukPanel_title">Audience by platform</h3></div>' +
              '<p class="ukAsk">Hotels buy the total, not one channel.</p>' +
              CH.segbar({ segs: pl.map(function (p) {
                return { l:p.n, v:p.f, show:D.fmt(p.f) }; }), label:'Audience by platform' }) +
            '</section>'
          : '') +
        (work.length > 1
          ? '<section class="ukPanel"><div class="ukPanel_head">' +
              '<h3 class="ukPanel_title">How each piece performed</h3></div>' +
              '<p class="ukAsk">Newest first. A run of form, not a leaderboard.</p>' +
              CH.capsules({ data: work.slice(0, 6).map(function (w, i) {
                return { k:w.t.split(',')[0], v:w.plays, hi:i === 0 }; }),
                unit:'plays', label:'Plays by piece' }) +
            '</section>'
          : '') +
      '</div>' +

      '<div class="ukGrid">' +
        (work.length
          ? '<section class="ukPanel"><div class="ukPanel_head">' +
              '<h3 class="ukPanel_title">How often it gets saved</h3></div>' +
              CH.ring({ pct: Math.min(100, (saves / (plays || 1) * 1000) / 60 * 100),
                        center: Math.round(saves / (plays || 1) * 1000), sub:'saves per 1,000 plays',
                        label:'Save rate' }) +
              '<p class="ukWhy" style="margin-top:16px">A save is somebody keeping the place for later. It is ' +
              'the closest thing to intent this data has, and it matters more to a hotel than a play does.</p>' +
            '</section>'
          : '') +
        (att && att.confirmed.count
          ? '<section class="ukPanel"><div class="ukPanel_head">' +
              '<h3 class="ukPanel_title">Bookings you drove</h3></div>' +
              '<p class="ukAsk">Confirmed stays traced back to where you posted them.</p>' +
              CH.capsules({ data: A.byKey('channel', A.forCreator('c1'))
                .filter(function (r) { return r.confirmed.count; })
                .map(function (r, i) { return { k:r.channelName, v:r.confirmed.count, hi:i === 0 }; }),
                unit:'bookings', label:'Confirmed bookings by channel' }) +
              '<p class="ukWhy" style="margin-top:14px">Reach is not the same as rooms sold. This is the ' +
              'difference, and it is the strongest thing on this page.</p>' +
            '</section>'
          : '') +
      '</div>';
  }
  function num(v, l, n) {
    return '<div class="ukProfNum"><span class="ukProfNum_v">' + v + '</span>' +
      '<span class="ukProfNum_l">' + l + '</span>' +
      (n ? '<span class="ukProfNum_n">' + n + '</span>' : '') + '</div>';
  }

  function profile() {
    var me = D.me;

    return head('Your profile', 'This is what a hotel sees. Make yourself impossible to ignore.') +

      '<section class="ukProf">' +
        '<div class="ukProf_id">' + pic(me.img, me.n, '1x1', 'ukM--avxl', true) +
          '<div><h2 class="ukProf_n">' + esc(me.n) +
            (me.verified ? '<span class="ukChip ukChip--v">' + window.ukVetBadge('ukChipVet') + 'Verified</span>' : '') + '</h2>' +
            '<p class="ukProf_m">' + esc(me.h) + ' &middot; ' + esc(me.city) + '</p>' +
            '<p class="ukProf_m">' + esc(me.niche) + '</p></div></div>' +
        '<div class="ukProf_act">' +
          '<button class="ukBtn" type="button" data-goto="kit">Make my media kit</button>' +
          (me.member ? '' : '<button class="ukGhost" type="button" data-goto="member">Get verified</button>') +
        '</div>' +
      '</section>' +

      /* ---- 1 & 2: who they travel as. This is what hotels match against. ---- */
      '<section class="ukPanel"><div class="ukPanel_head">' +
        '<h3 class="ukPanel_title">How you travel</h3>' +
        '<button class="ukGhost" type="button" data-editme>Edit</button></div>' +
        '<p class="ukAsk">Hotels match creators to the guests they already get. This is the part that does it.</p>' +
        '<div class="ukFacts">' +
          '<div class="ukFact"><p class="ukFact_l">Traveller type</p>' +
            (me.types && me.types.length ? chips(me.types, 'is-key')
              : '<p class="ukFact_e">Add a couple and you will show up in more searches.</p>') + '</div>' +
          '<div class="ukFact"><p class="ukFact_l">Age</p>' +
            (me.age ? '<p class="ukFact_v">' + esc(me.age) + '</p>'
                    : '<p class="ukFact_e">A range is plenty.</p>') + '</div>' +
          '<div class="ukFact"><p class="ukFact_l">Into</p>' +
            (me.interests && me.interests.length ? chips(me.interests)
              : '<p class="ukFact_e">A few is enough to paint the picture.</p>') + '</div>' +
        '</div>' +
      '</section>' +

      /* ---- their own work still leads ---- */
      '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">Your work</h3>' +
        '<button class="ukGhost" type="button" data-ack="Coming up">Add a piece</button></div>' +
        '<p class="ukAsk">Lead with the pieces you are proudest of. Hotels scroll this first and decide fast.</p>' +
        /* One tile shape. Each piece carries its own ratio, so this strip — the
           first thing a hotel scrolls — was mixing tall frames with short ones and
           no two captions sat on the same line. */
        '<div class="ukReels">' + me.work.map(function (w, i) {
          return '<figure class="ukReel ukReel--kit">' + m(w.m, w.t, '', i < 3) +
            '<figcaption><span class="ukReel_t">' + esc(w.t) + '</span>' +
            '<span class="ukReel_s">' + D.fmt(w.plays) + ' plays &middot; ' + D.fmt(w.saves) + ' saves</span></figcaption>' +
          '</figure>'; }).join('') + '</div></section>' +

      /* ---- 4a: top stays ---- */
      '<section class="ukPanel"><div class="ukPanel_head">' +
        '<h3 class="ukPanel_title">Top stays</h3>' +
        '<button class="ukGhost" type="button" data-ack="You will be able to reorder these">Reorder</button></div>' +
        '<p class="ukAsk">The ones you would go back to. Hotels read this as proof you are easy to host.</p>' +
        '<div class="ukReels">' + (me.topStays || []).map(function (s, i) {
          return '<figure class="ukReel ukReel--wide">' + m(s.m, s.hotel, '', i < 2) +
            '<figcaption><span class="ukReel_t">' + esc(s.hotel) + '</span>' +
            '<span class="ukReel_s">' + esc(s.city) + ' &middot; ' + esc(s.when) + '</span>' +
            '<span class="ukReel_note">' + esc(s.note) + '</span></figcaption></figure>';
        }).join('') + '</div></section>' +

      /* ---- 4b: the curated itinerary, their taste as a deliverable ---- */
      (me.itinerary ? (function () {
        var it = me.itinerary;
        return '<section class="ukPanel ukItin"><div class="ukPanel_head">' +
          '<h3 class="ukPanel_title">A trip you put together</h3>' +
          '<button class="ukGhost" type="button" data-goto="boards">Your boards</button></div>' +
          '<p class="ukAsk">Taste is the thing you are actually selling. This shows it faster than any stat.</p>' +
          '<div class="ukItin_top">' + m(it.m, it.t, '', true) +
            '<div><h4 class="ukItin_t">' + esc(it.t) + '</h4>' +
              '<p class="ukItin_m">' + esc(it.city) + ' &middot; ' + it.days + ' days</p>' +
              '<p class="ukItin_b">' + esc(it.blurb) + '</p></div></div>' +
          '<ol class="ukItin_l">' + it.stops.map(function (st, i) {
            return '<li><span class="ukItin_d">' + esc(st.d) + '</span>' +
              m(st.m, st.t, '', i < 1) +
              '<span class="ukItin_body"><span class="ukItin_st">' + esc(st.t) + '</span>' +
              '<span class="ukItin_n">' + esc(st.note) + '</span></span></li>';
          }).join('') + '</ol></section>';
      })() : '') +

      /* ---- 4c: content from previous partnerships ---- */
      '<section class="ukPanel"><div class="ukPanel_head">' +
        '<h3 class="ukPanel_title">Made for hotels</h3></div>' +
        '<p class="ukAsk">Work you delivered on a hosted stay, and what the property got to keep. ' +
        'This is the closest thing to a reference a hotel can read in ten seconds.</p>' +
        '<div class="ukReels">' + (me.partnerWork || []).map(function (w, i) {
          return '<figure class="ukReel ukReel--wide">' + m(w.m, w.t, '', i < 2) +
            '<figcaption><span class="ukReel_t">' + esc(w.t) + '</span>' +
            '<span class="ukReel_s">' + esc(w.hotel) + ' &middot; ' + D.fmt(w.plays) + ' plays</span>' +
            '<span class="ukReel_note">' + esc(w.out) + ' &middot; ' + esc(w.rights) + '</span></figcaption></figure>';
        }).join('') + '</div></section>' +

      stats() +

      '<div class="ukGrid">' +
        '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">Where you post</h3></div>' +
          /* the mark beside the name, the way every other platform row in the
             product reads — you recognise the logo faster than the word */
          '<ul class="ukPlats">' + me.plats.map(function (p) {
            var src = PLAT_MARK[p.k];
            return '<li>' +
              (src ? '<img class="ukPlats_i" src="' + src + '" alt="" width="18" height="18" loading="lazy" decoding="async">' : '') +
              '<span class="ukPlats_n">' + esc(p.n) + '</span>' +
              '<span class="ukPlats_f">' + D.fmt(p.f) + '</span></li>';
          }).join('') + '</ul>' +
          '<p class="ukWhy">Plenty of creators land stays at this size. Hotels want content for their own feeds, ' +
          'and a smaller audience that actually watches is worth more than a big one that scrolls past.</p>' +
        '</section>' +
        '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">What you offer</h3></div>' +
          '<p class="ukAsk">Set once, reused in every pitch. Change it any time.</p>' +
          [['Signature','2 nights','1 video + 3 photos'],['Full story','3 nights','2 videos + 8 photos']].map(function (p) {
            return '<div class="ukCPack"><p class="ukCPack_n">' + p[0] + '</p>' +
              '<p class="ukCPack_d">' + p[1] + ' &middot; ' + p[2] + '</p>' +
              '<p class="ukCPack_r">They keep and post the content</p></div>'; }).join('') +
          '<p class="ukWhy">No prices here on purpose. A hosted stay is a trade, not an invoice.</p>' +
        '</section>' +
      '</div>';
  }

  /* ---- inline editor for the three new fields, opened from the profile ---- */
  function editme(st) {
    var me = D.me;
    function row(label, list, sel, key, hint) {
      return '<p class="ukField_l">' + label + '</p>' +
        '<div class="ukChoice">' + list.map(function (t) {
          var on = Array.isArray(sel) ? sel.indexOf(t) > -1 : sel === t;
          return '<button class="ukPick' + (on ? ' is-on' : '') + '" type="button" ' +
            (Array.isArray(sel) ? 'aria-pressed="' + on + '" data-metog="' + key + '"' : 'data-meset="' + key + '"') +
            ' data-val="' + esc(t) + '">' + esc(t) + '</button>';
        }).join('') + '</div>' +
        '<p class="ukWhy">' + hint + '</p>';
    }
    /* These three moved out of onboarding. They are worth having, but not worth
       standing between a creator and the moment they see their own work — so they
       live here, optional, framed as an upgrade rather than a wall. */
    return head('Make your profile irresistible',
                'None of this is required. Each one is another way a hotel can picture ' +
                'you at their property — and another filter you turn up in.') +
      '<section class="ukPanel">' +
        row('What kind of traveller are you?', D.TRAVEL_TYPES, me.types, 'types',
            'Pick as many as fit. This is the single field hotels filter on most, ' +
            'so it is the quickest win on this page.') +
        '<div style="height:20px"></div>' +
        row('Your age', D.AGE_BANDS, me.age, 'age',
            'A range, never an exact age.') +
        '<div style="height:20px"></div>' +
        row('What are you into?', D.INTERESTS, me.interests, 'interests',
            'A few is plenty. It is the detail that makes you a person rather than a follower count.') +
        '<button class="ukBtn ukStart_go" type="button" data-goto="profile" style="margin-top:24px">Done</button>' +
      '</section>';
  }

  V.profile = profile;
  V.editme = editme;

  /* toggles work on the live profile object, so the change is visible immediately */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-metog]');
    if (el) {
      var list = D.me[el.dataset.metog], v = el.dataset.val, i = list.indexOf(v);
      if (i > -1) list.splice(i, 1); else list.push(v);
      if (window.UKCGO) window.UKCGO('editme');
      return;
    }
    el = e.target.closest('[data-meset]');
    if (el) { D.me[el.dataset.meset] = el.dataset.val; if (window.UKCGO) window.UKCGO('editme'); }
  });
})();
