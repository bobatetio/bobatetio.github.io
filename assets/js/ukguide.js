/* Ukreate — digital guest guides (feature 7). Hotel side only.

   The guide is the thing that turns a hosted stay into a good hosted stay: the
   creator knows what to shoot, where to eat, and what they are allowed to do. It is
   also the most shareable thing a property owns.

   Assistant, not director: every section arrives with a real, usable default already
   written in. The hotel edits what it wants and ignores the rest, and a guide is
   publishable at any point rather than after some completeness bar. */
(function () {
  var D = window.UK, V = window.UKV;
  if (!D || !V) return;

  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) {
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; }); };
  function head(t, s) {
    return '<div class="ukPageHead"><h2>' + t + '</h2>' + (s ? '<p>' + s + '</p>' : '') + '</div>';
  }

  function current(st) {
    if (!st.guide) st.guide = (D.guides[0] || {}).id;
    return D.guideById(st.guide);
  }
  function filled(g) {
    return D.GUIDE_SECTIONS.filter(function (s) { return (g.body[s.k] || '').trim(); }).length;
  }

  function guides(st) {
    var g = current(st);

    if (!g) {
      return head('Guest guide', 'The resource that makes a hosted stay easy for a creator, and a good thing for them to share.') +
        '<div class="ukPanel"><div class="ukEmpty">' +
          '<p class="ukEmpty_t">No guide yet</p>' +
          '<p class="ukEmpty_p">We will start you with a full draft you can edit rather than a blank page. ' +
          'It takes about five minutes to make it yours.</p>' +
          '<button class="ukBtn" type="button" data-newguide>Start a guide</button></div></div>';
    }

    var n = filled(g);
    var total = D.GUIDE_SECTIONS.length;
    var preview = st.gpreview;

    return head('Guest guide',
      'What a hosted creator gets when they arrive. It shows on your property profile and inside a ' +
      'collaboration once someone is booked.') +

      '<div class="ukGuide">' +
        '<section class="ukPanel ukGuide_side">' +
          '<div class="ukPanel_head"><h3 class="ukPanel_title">' + esc(g.prop) + '</h3></div>' +
          '<p class="ukAsk">' + n + ' of ' + total + ' sections written. ' +
            (g.live ? 'It is live.' : 'It is a draft, so nobody can see it yet.') + '</p>' +
          '<div class="ukGuide_bar" role="img" aria-label="' + n + ' of ' + total + ' sections written">' +
            '<span style="width:' + Math.round(n / total * 100) + '%"></span></div>' +
          '<ul class="ukGuide_nav">' + D.GUIDE_SECTIONS.map(function (s) {
            var has = (g.body[s.k] || '').trim();
            return '<li><a href="#gs-' + s.k + '"><span class="ukGuide_navT">' + esc(s.t) + '</span>' +
              '<span class="ukGuide_navS' + (has ? ' is-on' : '') + '">' + (has ? 'Written' : 'Default') + '</span></a></li>';
          }).join('') + '</ul>' +
          '<button class="ukBtn" type="button" data-publishguide="' + g.id + '" style="width:100%;margin-top:16px">' +
            (g.live ? 'Unpublish' : 'Publish the guide') + '</button>' +
          '<button class="ukGhost" type="button" data-gpreview style="width:100%;margin-top:8px">' +
            (preview ? 'Back to editing' : 'Preview as a creator') + '</button>' +
          '<p class="ukWhy">You can publish at any point. A half-written guide is still more useful ' +
          'than none, and you can keep adding after it goes live.</p>' +
        '</section>' +

        (preview ? previewPane(g) : editPane(g)) +
      '</div>';
  }

  function editPane(g) {
    return '<section class="ukGuide_main">' + D.GUIDE_SECTIONS.map(function (s) {
      var val = g.body[s.k] || '';
      return '<article class="ukPanel ukGuide_s" id="gs-' + s.k + '">' +
        '<div class="ukPanel_head"><h3 class="ukPanel_title">' + esc(s.t) + '</h3>' +
          (val ? '' : '<button class="ukGhost" type="button" data-useseed="' + s.k + '">Use the suggestion</button>') +
        '</div>' +
        '<p class="ukAsk">' + esc(s.hint) + '.</p>' +
        '<label class="ukSrOnly" for="gt-' + s.k + '">' + esc(s.t) + '</label>' +
        '<textarea class="ukField_i ukGuide_ta" id="gt-' + s.k + '" rows="3" ' +
          'data-gbody="' + s.k + '" placeholder="' + esc(s.seed) + '">' + esc(val) + '</textarea>' +
        (val ? '' : '<p class="ukHint">Leave it and we will publish the suggestion above as written.</p>') +
      '</article>';
    }).join('') + '</section>';
  }

  /* what the creator will actually see, rendered from the same record */
  function previewPane(g) {
    return '<section class="ukGuide_main">' +
      '<p class="ukAsk">This is the creator&rsquo;s view. Empty sections fall back to the suggestion, ' +
      'so nothing ever publishes blank.</p>' +
      D.GUIDE_SECTIONS.map(function (s) {
        var val = (g.body[s.k] || '').trim() || s.seed;
        return '<article class="ukPanel ukGuide_s">' +
          '<h3 class="ukPanel_title">' + esc(s.t) + '</h3>' +
          '<p class="ukGuide_pv">' + esc(val) + '</p></article>';
      }).join('') + '</section>';
  }

  V.guides = guides;
})();
