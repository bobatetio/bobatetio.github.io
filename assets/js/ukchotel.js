/* Ukreate — hotel profile, seen by a creator (feature 3).
   The mirror of the creator profile: media first, then the handful of things a
   creator actually decides on. Creator side only; it reads hotel data and can
   never reach a hotel surface.

   Also carries the creator-facing read of a hotel's guest guide (feature 7). */
(function () {
  var D = window.UKC, V = window.UKCV;
  if (!D || !V) return;

  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) {
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; }); };
  var pic = V.pic, head = V.head;

  function hotel(st) {
    var s = D.stay(st.stay) || D.stays[0];
    var p = D.hotelProfile(s.id);
    var score = D.scoreFor(s);
    var fit = D.fitNote ? D.fitNote(s) : '';
    var g = p.guide ? D.guide(p.guide) : null;

    return '<button class="ukBack" type="button" data-goto="stays">&larr; Back to stays</button>' +

      /* ---- hero: the property, big ---- */
      '<section class="ukHotel_hero">' +
        pic(s.img, s.hotel + ', ' + s.city, '16x9', 'ukHotel_m', true) +
        '<div class="ukHotel_id">' +
          '<p class="ukHotel_k">' + esc(p.propType) + '</p>' +
          '<h2 class="ukHotel_n">' + esc(s.hotel) + '</h2>' +
          '<p class="ukHotel_c">' + esc(s.city) + ' &middot; ' + p.rooms + ' rooms</p>' +
          '<ul class="ukChips">' +
            '<li class="ukChip2 is-key">Scored ' + score + '/10 for you</li>' +
            '<li class="ukChip2">' + esc(s.vibe) + '</li>' +
            '<li class="ukChip2">' + esc(s.budget) + '</li>' +
          '</ul>' +
          (fit ? '<p class="ukWhy">' + esc(fit) + '</p>' : '') +
          '<div class="ukHotel_act">' +
            '<button class="ukBtn" type="button" data-apply="' + s.id + '">Pitch this stay</button>' +
            '<button class="ukGhost" type="button" data-save="' + s.id + '">' +
              (s.saved ? 'Saved' : 'Save for later') + '</button>' +
          '</div>' +
        '</div>' +
      '</section>' +

      /* ---- what they are offering: the decision ---- */
      '<div class="ukGrid">' +
        '<section class="ukPanel"><div class="ukPanel_head">' +
          '<h3 class="ukPanel_title">What they are offering</h3></div>' +
          '<ul class="ukKV">' +
            '<li><span>Room</span><span>' + esc(s.room) + '</span></li>' +
            '<li><span>Nights</span><span>' + s.nights + '</span></li>' +
            '<li><span>Dates</span><span>' + esc(s.from) + ' to ' + esc(s.to) + '</span></li>' +
            '<li><span>Included</span><span>' + esc(s.inc) + '</span></li>' +
          '</ul>' +
          '<p class="ukAsk" style="margin-top:14px">What they are asking for back</p>' +
          '<ul class="ukChips">' + s.del.map(function (d) {
            return '<li class="ukChip2 is-key">' + esc(d.t) + ' &times;' + d.q + '</li>'; }).join('') + '</ul>' +
          '<p class="ukWhy">' + esc(s.rights) + '. That is the trade: a stay for content they can post ' +
          'on their own channels.</p>' +
        '</section>' +

        '<section class="ukPanel"><div class="ukPanel_head">' +
          '<h3 class="ukPanel_title">The property</h3></div>' +
          '<p class="ukHotel_ab">' + esc(p.about) + '</p>' +
          '<p class="ukAsk" style="margin-top:14px">Who stays here</p>' +
          '<p class="ukHotel_ab">' + esc(p.persona) + '</p>' +
          '<p class="ukAsk" style="margin-top:14px">What is on site</p>' +
          '<ul class="ukChips">' + p.amen.map(function (a) {
            return '<li class="ukChip2">' + esc(a) + '</li>'; }).join('') + '</ul>' +
          '<p class="ukAsk" style="margin-top:14px">Shooting here</p>' +
          '<p class="ukWhy">' + esc(p.rules) + '</p>' +
        '</section>' +
      '</div>' +

      /* ---- the property in pictures ---- */
      '<section class="ukPanel"><div class="ukPanel_head">' +
        '<h3 class="ukPanel_title">Around the property</h3></div>' +
        '<div class="ukGallery ukGallery--strip">' + p.gallery.map(function (src, i) {
          return '<figure class="ukShot">' + pic(src, s.hotel, '4x5', 'ukShot_m', i < 2) + '</figure>';
        }).join('') + '</div>' +
      '</section>' +

      /* ---- proof: they have done this before ---- */
      '<div class="ukGrid">' +
        '<section class="ukPanel"><div class="ukPanel_head">' +
          '<h3 class="ukPanel_title">Creators they have hosted</h3></div>' +
          (p.past.length
            ? '<ul class="ukRow">' + p.past.map(function (c) {
                return '<li style="cursor:default"><span class="ukRow_b">' +
                  '<span class="ukRow_n">' + esc(c.n) + '</span>' +
                  '<span class="ukRow_m">' + esc(c.h) + '</span></span>' +
                  '<span class="ukRow_r">' + esc(c.out) + '</span></li>'; }).join('') + '</ul>'
            : '<p class="ukWhy">No hosted creators listed yet. That is not a bad sign: a property ' +
              'looking for its first creator is often the easiest yes you will get.</p>') +
          '<p class="ukWhy" style="margin-top:12px">They have hosted ' + p.hosted +
            ' stays through Ukreate and reply ' + esc(p.resp) + '.</p>' +
        '</section>' +

        '<section class="ukPanel"><div class="ukPanel_head">' +
          '<h3 class="ukPanel_title">Guest guide</h3></div>' +
          (g ? '<p class="ukAsk">They keep a guide for guests, and you get it on a hosted stay. ' +
                'It is genuinely useful for planning what to shoot, and it is a good thing to share ' +
                'with your own audience.</p>' +
               '<ul class="ukChips">' + g.sections.slice(0, 4).map(function (x) {
                 return '<li class="ukChip2">' + esc(x.t) + '</li>'; }).join('') + '</ul>' +
               '<button class="ukBtn" type="button" data-guide="' + p.guide + '" style="margin-top:16px">' +
               'Open the guide</button>'
             : '<p class="ukWhy">This property has not published a guest guide yet. Plenty have not. ' +
               'You can always ask what is worth seeing nearby once you are talking.</p>') +
        '</section>' +
      '</div>' +

      '<section class="ukPanel ukHotel_cta">' +
        '<div><h3 class="ukPanel_title">Think it fits?</h3>' +
        '<p class="ukAsk">Pitch Pilot writes the first draft. You read it, change what you want, and send.</p></div>' +
        '<div class="ukHotel_ctaB">' +
          '<button class="ukBtn" type="button" data-apply="' + s.id + '">Pitch this stay</button>' +
          '<button class="ukGhost" type="button" data-goto="stays">Keep looking</button>' +
        '</div>' +
      '</section>';
  }

  /* ---- the guide itself, read-only for the creator (feature 7) ---- */
  function guide(st) {
    var g = D.guide(st.guide);
    if (!g) return V.empty('That guide is not here', 'It may have been unpublished. Try the hotel profile.');
    return '<button class="ukBack" type="button" data-goto="stays">&larr; Back to stays</button>' +
      head(g.t, g.sub) +
      '<p class="ukAsk">Updated ' + esc(g.updated) + '. Yours for the stay, and yours to share.</p>' +
      '<div class="ukGuideRead">' + g.sections.map(function (sx) {
        return '<section class="ukPanel ukGuideRead_s">' +
          '<h3 class="ukPanel_title">' + esc(sx.t) + '</h3>' +
          '<p class="ukGuideRead_b">' + esc(sx.body) + '</p></section>';
      }).join('') + '</div>';
  }

  V.hotel = hotel;
  V.guide = guide;
})();
