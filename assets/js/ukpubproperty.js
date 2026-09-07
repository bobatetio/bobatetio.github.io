/* Ukreate — the public property detail.

   The creator page's own anatomy, read from the other side: the property's work
   leads, its identity card and the pitch panel sit on the line under it, and
   the sections below say what the stay asks for, what the property is, and what
   a creator gets back. Same components and the same stylesheet as
   ukpubcreator.js, so a hotel page and a stay page are one design.

   Everything comes from the stay record in ukcdata.js. Nothing a creator would
   act on is invented: a figure appears only where the record carries it. */
(function () {
  var D = window.UKC;
  var mount = document.querySelector('[data-pub-stay]');
  if (!D || !mount) return;

  var id = mount.getAttribute('data-pub-stay') || new URLSearchParams(location.search).get('id');
  var s = (D.stays || []).filter(function (x) { return x.id === id; })[0];
  if (!s) { mount.innerHTML = '<p class="ukPub_empty">That stay has closed.</p>'; return; }

  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) {
      return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; });
  }
  function nightsOf(n) { return n + (n === 1 ? ' night' : ' nights'); }
  var joinHref = '/join/?side=creator&amp;stay=' + esc(s.id);
  var firstWord = String(s.hotel || 'this property');

  /* ---- media ----
     The property's own frames first, then anything else the library holds, so
     the strip and the gallery are never short. */
  var CLIPS = (function () {
    var out = [], n;
    for (n = 1; n <= 10; n++) out.push('/assets/video/ugc/ugc-' + (n < 10 ? '0' : '') + n + '.mp4');
    for (n = 1; n <= 12; n++) out.push('/assets/video/creators/creator-' + (n < 10 ? '0' : '') + n + '.mp4');
    return out;
  })();
  var media = (function () {
    var list = (s.imgs || [s.img]).filter(Boolean).map(function (src, i) {
      return { img:src, video:i === 0, t:s.hotel, meta:s.city };
    });
    (D.stays || []).forEach(function (x) {
      if (x.id === s.id) return;
      (x.imgs || [x.img]).filter(Boolean).forEach(function (src) {
        list.push({ img:src, video:false, t:x.hotel, meta:x.city });
      });
    });
    var seen = {}, out = [];
    list.forEach(function (m) { if (!seen[m.img]) { seen[m.img] = 1; out.push(m); } });
    return out;
  })();
  var seed = String(s.id).replace(/\D/g, '') | 0;
  media.forEach(function (m, i) { m.clip = CLIPS[(seed * 4 + i) % CLIPS.length]; });

  /* what the hotel asks for, and how many pieces that adds up to */
  var del = s.del || [];
  var assets = del.reduce(function (a, d) { return a + (Number(d.q) || 0); }, 0);
  function delLine() {
    return del.map(function (d) {
      /* several of the labels are already plural ("Photos"), so only the
         singular ones take an s */
      var t = String(d.t).toLowerCase();
      return d.q + ' ' + (d.q > 1 && !/s$/.test(t) ? t + 's' : t);
    }).join(', ');
  }

  var st = { gallery:false };

  function playMark() {
    return (window.UKV && window.UKV.playMark) ? window.UKV.playMark('ukCrPlay') : '';
  }
  function tile(m, i, eager, withMeta) {
    return '<figure class="ukCp_shot">' +
      '<button class="ukCp_tile" type="button" data-cp-play="' + i + '" ' +
        'aria-label="' + esc(m.video ? 'Play this clip' : (m.t || 'View')) + '">' +
        '<img src="' + esc(m.img) + '" alt="' + esc(m.t || '') + '"' +
          (eager ? '' : ' loading="lazy"') + ' decoding="async">' +
        (m.video ? playMark() : '') +
        '<span class="ukCp_cap"><b>' + esc(m.t || 'The property') + '</b>' +
          (withMeta && m.meta ? '<span>' + esc(m.meta) + '</span>' : '') + '</span>' +
      '</button>' +
    '</figure>';
  }
  function panel(title, badge, body) {
    return '<section class="ukCp_panel"><div class="ukCp_panelHead">' +
      '<h3 class="ukCp_panelT">' + esc(title) + '</h3>' +
      (badge ? '<span class="ukCp_panelN">' + esc(badge) + '</span>' : '') + '</div>' + body + '</section>';
  }
  function gate(inner, text) {
    return '<div class="ukCp_gate">' +
      '<div class="ukCp_gateIn">' + inner + '</div>' +
      '<div class="ukCp_gateOver">' +
      '<a class="ukCp_lockB" href="' + joinHref + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/></svg>' +
        '<span>' + esc(text) + '</span></a>' +
      '</div>' +
    '</div>';
  }
  function bar(label, pct) {
    return '<div class="ukCp_bar">' +
      '<span class="ukCp_barK">' + esc(label) + '</span>' +
      '<span class="ukCp_barT"><i style="width:' + pct + '%"></i></span>' +
      '<span class="ukCp_barV">' + pct + '%</span></div>';
  }

  /* ---- the pitch panel ----
     What a creator decides here is whether the trade is worth their time, so
     the panel states both sides of it and nothing else. */
  function pitchPanel() {
    return '<div class="ukCp_buy">' +
      '<p class="ukCp_avail"><i class="ukCp_dot is-now" aria-hidden="true"></i>' +
        esc(s.from + ' to ' + s.to) + '</p>' +
      '<p class="ukCp_invT">Pitch to ' + esc(s.hotel) + '</p>' +

      '<div class="ukTrade ukTrade--card ukCp_trade">' +
        '<div class="ukTrade_side ukTrade_side--pop">' +
          '<p class="ukTrade_l">You get</p>' +
          '<p class="ukTrade_v">' + esc(nightsOf(s.nights)) + '</p>' +
          '<p class="ukTrade_s">' + esc(s.inc || 'Room and breakfast') + '</p>' +
        '</div>' +
        '<span class="ukTrade_ar" aria-hidden="true">&harr;</span>' +
        '<div class="ukTrade_side ukTrade_side--pop">' +
          '<p class="ukTrade_l">You deliver</p>' +
          '<p class="ukTrade_v">' + assets + (assets === 1 ? ' asset' : ' assets') + '</p>' +
          '<p class="ukTrade_s">' + esc(delLine()) + '</p>' +
        '</div>' +
      '</div>' +

      '<a class="ukCp_go" href="' + joinHref + '">Pitch this stay</a>' +
      '<a class="ukCp_neg" href="/join/?side=creator">Save for later</a>' +
      '<p class="ukCp_fine">Nothing is agreed until the hotel accepts your pitch and you both sign off ' +
        'the dates, the deliverables and the usage.</p>' +
    '</div>' +
    '<p class="ukCp_how"><a href="/for-creators/#how"><svg viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="12" r="9"/>' +
    '<path d="M9.6 9.4a2.5 2.5 0 114 2.3c-.9.6-1.6 1-1.6 2"/>' +
    '<circle cx="12" cy="17" r=".9" fill="currentColor" stroke="none"/></svg>' +
    'How a collaboration works</a></p>';
  }

  function render() {
    var samples = media.slice(0, 5);
    /* stays of the same kind, and if this one is the only one of its kind, the
       nearest thing to it rather than an empty row */
    var like = (D.stays || []).filter(function (x) { return x.id !== s.id && x.style === s.style; });
    if (!like.length) {
      like = (D.stays || []).filter(function (x) {
        return x.id !== s.id && (x.vibe === s.vibe || x.budget === s.budget);
      });
    }
    if (!like.length) like = (D.stays || []).filter(function (x) { return x.id !== s.id; });
    like = like.slice(0, 6);

    return '' +
    '<div class="ukCp">' +

      '<section class="ukCp_frame ukCp_frame--lead">' +
        '<div class="ukCp_frameHead">' +
          '<h2 class="ukCp_frameT">The property</h2>' +
          '<button class="ukCp_all" type="button" data-cp-gallery>' +
            '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
            '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>' +
            '<rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>' +
            'See all ' + media.length + '</button>' +
        '</div>' +
        '<div class="ukCp_samples">' +
          samples.map(function (m, i) { return tile(m, i, i < 2); }).join('') +
        '</div>' +
      '</section>' +

      '<div class="ukCp_body">' +
        '<div class="ukCp_mainCol">' +

          '<div class="ukCp_idCard"><section class="ukCrD"><div class="ukCrD_grid">' +
            '<div class="ukCrD_who">' +
              '<span class="ukCrAv ukCrAv--xl">' +
                '<img src="' + esc(s.img) + '" alt="" width="96" height="96" decoding="async">' +
                '<span class="ukCrAv_dot is-now" title="Open to creators" role="img" ' +
                'aria-label="Open to creators"></span></span>' +
              '<div class="ukCrD_id">' +
                '<h2 class="ukCrD_n">' + esc(s.hotel) + '</h2>' +
                '<p class="ukCrD_mk"><span class="ukCrD_mkK">In</span>' +
                  (s.cc ? '<img class="ukCrFlag" src="/assets/img/flags/' + esc(s.cc) +
                    '.svg" alt="" loading="lazy" decoding="async">' : '') +
                  '<span class="ukCrD_mkI">' + esc(s.city) + '</span>' +
                '</p>' +
                '<p class="ukCrD_mk ukCp_meta">' +
                  '<span class="ukCrD_mkF">' + esc(s.style) + '</span>' +
                  '<span class="ukCrD_sep" aria-hidden="true"></span>' +
                  '<span class="ukCrD_mkF">' + esc(s.vibe) + '</span>' +
                  '<span class="ukCrD_sep" aria-hidden="true"></span>' +
                  '<span class="ukCrD_mkF">' + esc(s.budget) + '</span>' +
                '</p>' +
              '</div>' +
            '</div>' +
          '</div></section></div>' +

          '<h2 class="ukCp_h2">What this stay asks for</h2>' +
          '<p class="ukCp_lead">' + esc(s.why || 'What the hotel is looking for on this stay.') + '</p>' +
          '<ul class="ukCp_packs">' +
            del.map(function (d) {
              return '<li class="ukCp_row is-on">' +
                '<div class="ukCp_rowTop">' +
                  '<span class="ukCp_radio" aria-hidden="true"></span>' +
                  '<span class="ukCp_rowN">' + esc(d.t) + '</span>' +
                  '<span class="ukCp_rowV">' + d.q + '</span>' +
                '</div>' +
                '<p class="ukCp_rowD">Delivered after the stay. ' + esc(s.rights) + '.</p>' +
              '</li>';
            }).join('') +
          '</ul>' +

          '<hr class="ukCp_rule">' +

          '<h2 class="ukCp_h2">Stay details</h2>' +
          '<div class="ukGrid ukGrid--prof ukCp_aud"><div>' +
            panel('What is included', '',
              '<p class="ukField_l">Room</p><p class="ukFact_v">' + esc(s.room) + '</p>' +
              '<p class="ukField_l" style="margin-top:16px">Included</p>' +
              '<p class="ukFact_v">' + esc(s.inc) + '</p>' +
              '<p class="ukField_l" style="margin-top:16px">Party size</p>' +
              '<p class="ukFact_v">' + (Number(s.guests) <= 1 ? 'Just you' : 'Room for ' + s.guests) + '</p>') +
            panel('Dates', nightsOf(s.nights),
              '<p class="ukField_l">Window</p><p class="ukFact_v">' + esc(s.from + ' to ' + s.to) + '</p>' +
              '<p class="ukCp_note">Agreed with the hotel before anything is booked.</p>') +
          '</div><aside>' +
            panel('Usage', '',
              '<p class="ukFact_v">' + esc(s.rights) + '</p>' +
              '<p class="ukCp_note">Written into the brief, not decided after you arrive.</p>') +
            panel('Who they are looking for', '',
              '<p class="ukField_l">Audience size</p><p class="ukFact_v">' + esc(s.wants) + '</p>' +
              '<p class="ukField_l" style="margin-top:16px">Tone</p>' +
              '<p class="ukFact_v">' + esc(s.vibe) + '</p>') +
          '</aside></div>' +

          '<hr class="ukCp_rule">' +

          '<h2 class="ukCp_h2">How well you fit</h2>' +
          gate(
            '<div class="ukGrid ukGrid--prof ukCp_aud"><div>' +
              panel('Fit score', s.score + ' of 10',
                bar('Audience size', Math.min(100, s.score * 10)) +
                bar('Content style', Math.min(100, s.score * 9)) +
                bar('Dates', Math.min(100, s.score * 11)) +
                '<p class="ukCp_note">Scored against your own profile once you have one.</p>') +
            '</div><aside>' +
              panel('Who else is pitching', '',
                '<p class="ukFact_v">Live</p>' +
                '<p class="ukCp_note">How many creators have pitched, and how you rank against them.</p>') +
            '</aside></div>',
            'Create a free account to see how you fit this stay') +

          '<hr class="ukCp_rule">' +

          '<h2 class="ukCp_h2">Questions creators ask</h2>' +
          '<div class="ukCp_faq">' +
            [['What exactly do I deliver?',
              delLine() + '. ' + s.rights + '.'],
             ['What does the hotel cover?',
              nightsOf(s.nights) + ' in a ' + String(s.room).toLowerCase() + '. ' + s.inc + '. ' +
              (Number(s.guests) <= 1 ? 'The stay is for you alone.' : 'There is room for ' + s.guests + '.')],
             ['When would I travel?',
              'Between ' + s.from + ' and ' + s.to + '. Exact dates are agreed with the hotel before booking.'],
             ['Who is this hotel looking for?',
              'Creators with an audience around ' + s.wants + ', shooting in a ' +
              String(s.vibe).toLowerCase() + ' register.'],
             ['What happens after I pitch?',
              'The hotel reads your profile and your past work. If they accept, you agree the brief in ' +
              'writing, then travel. Nothing is fixed until both sides sign off.']
            ].map(function (qa, i) {
              return '<div class="ukCp_q" data-cp-faq="' + i + '">' +
                '<button class="ukCp_qB" type="button" aria-expanded="false">' +
                '<span>' + esc(qa[0]) + '</span><i aria-hidden="true">+</i></button>' +
                '<div class="ukCp_qA"><p>' + esc(qa[1]) + '</p></div></div>';
            }).join('') +
          '</div>' +

          (like.length
            ? '<hr class="ukCp_rule">' +
              '<h2 class="ukCp_h2">Stays like this one</h2>' +
              '<div class="ukCp_rel">' +
                like.map(function (x) {
                  return '<a class="ukCp_relA" href="/find-stays/' + esc(x.id) + '/">' +
                    esc(x.hotel) + '</a>';
                }).join('') +
              '</div>'
            : '') +

        '</div>' +
        '<aside class="ukCp_side">' + pitchPanel() + '</aside>' +
      '</div>' +
    '</div>' +

    '<div class="ukCp_modal" data-cp-modal hidden>' +
      '<div class="ukCp_modalIn">' +
        '<div class="ukCp_modalHead">' +
          '<p class="ukCp_modalT">' + esc(s.hotel) + '</p>' +
          '<button class="ukCp_close" type="button" data-cp-close aria-label="Close">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" ' +
            'stroke-linecap="round" aria-hidden="true">' +
            '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>' +
        '</div>' +
        '<div class="ukCp_masonry">' +
          media.map(function (m, i) {
            return '<figure class="ukCp_mFig">' +
              '<button class="ukCp_tile" type="button" data-cp-play="' + i + '" ' +
                'aria-label="' + esc(m.t || 'View') + '">' +
                '<img src="' + esc(m.img) + '" alt="' + esc(m.t || '') + '" loading="lazy" decoding="async">' +
                (m.video ? playMark() : '') +
                '<span class="ukCp_cap"><b>' + esc(m.t || '') + '</b>' +
                  (m.meta ? '<span>' + esc(m.meta) + '</span>' : '') + '</span>' +
              '</button>' +
            '</figure>';
          }).join('') +
        '</div>' +
      '</div>' +
    '</div>';
  }

  mount.innerHTML = render();

  function closeGallery() {
    var m = mount.querySelector('[data-cp-modal]');
    if (!m || m.hidden) return;
    m.querySelectorAll('video').forEach(function (v) {
      try { v.pause(); } catch (err) {}
      v.parentNode.classList.remove('is-playing');
      v.remove();
    });
    m.hidden = true;
    document.body.classList.remove('ukCp-locked');
  }

  mount.addEventListener('click', function (e) {
    var t;
    if (e.target.closest('[data-cp-gallery]')) {
      var g = mount.querySelector('[data-cp-modal]');
      if (g) { g.hidden = false; document.body.classList.add('ukCp-locked'); }
      return;
    }
    if ((t = e.target.closest('[data-cp-play]'))) {
      var item = media[Number(t.getAttribute('data-cp-play'))];
      if (!item || t.querySelector('video')) return;
      if (!item.video) {
        var gg = mount.querySelector('[data-cp-modal]');
        if (gg) { gg.hidden = false; document.body.classList.add('ukCp-locked'); }
        return;
      }
      var v = document.createElement('video');
      v.className = 'ukCp_vid';
      v.src = item.clip; v.poster = item.img;
      v.controls = true; v.autoplay = true; v.loop = true; v.playsInline = true;
      v.setAttribute('playsinline', '');
      t.appendChild(v);
      t.classList.add('is-playing');
      var go = v.play();
      if (go && go.catch) go.catch(function () {});
      return;
    }
    if (e.target.closest('[data-cp-close]') || e.target.classList.contains('ukCp_modal')) {
      closeGallery();
      return;
    }
    if ((t = e.target.closest('.ukCp_qB'))) {
      var q = t.closest('.ukCp_q');
      t.setAttribute('aria-expanded', q.classList.toggle('is-open'));
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeGallery();
  });
})();
