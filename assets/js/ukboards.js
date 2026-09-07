/* Ukreate — mood boards (feature 5). Creator side only.
   The creator's taste, made visible. Boards are organised by destination, budget or
   vibe, which is how creators already think about a trip. Media-first and vertical
   by default; every slot declares its ratio.

   Creation is deliberately light: name it, pick how it is organised, and it exists.
   Structure is suggested, never required. */
(function () {
  var D = window.UKC, V = window.UKCV;
  if (!D || !V) return;

  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) {
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; }); };
  var m = V.media, head = V.head;

  function kindOf(k) {
    return D.BOARD_KINDS.filter(function (x) { return x.k === k; })[0] || D.BOARD_KINDS[0];
  }

  /* ---------------- index ---------------- */
  function boards(st) {
    var making = st.making;

    return head('Mood boards', 'Your taste, in one place. Hotels look at these to see how you see.') +

      (making ? maker(st) : '') +

      '<div class="ukBoards">' +
        (making ? '' : '<button class="ukMoodNew" type="button" data-newboard>' +
          '<span class="ukMoodNew_p" aria-hidden="true">+</span>' +
          '<span class="ukMoodNew_t">Start a board</span>' +
          '<span class="ukMoodNew_s">A place, a budget, or a feeling</span></button>') +

        D.boards.map(function (b, i) {
          var k = kindOf(b.kind);
          return '<article class="ukMoodCard" data-board="' + b.id + '" tabindex="0" role="button" ' +
            'aria-label="Open board ' + esc(b.t) + '">' +
            '<span class="ukMoodCard_m">' + m(b.cover, b.t, '', i < 2) + '</span>' +
            '<span class="ukMoodCard_b">' +
              '<span class="ukMoodCard_k">' + esc(k.l) + '</span>' +
              '<span class="ukMoodCard_t">' + esc(b.t) + '</span>' +
              '<span class="ukMoodCard_s">' + esc(b.sub) + '</span>' +
              '<span class="ukMoodCard_n">' + b.picks.length + ' pick' + (b.picks.length === 1 ? '' : 's') +
                (b.shared ? ' &middot; on your profile' : '') + '</span>' +
            '</span></article>';
        }).join('') +
      '</div>' +

      '<p class="ukWhy" style="margin-top:20px">Boards are yours by default. Put one on your profile ' +
      'when you like how it looks, and take it down whenever you want.</p>';
  }

  /* ---------------- the maker: three fields, none of them blank ---------------- */
  function maker(st) {
    var mk = st.mk || (st.mk = { t:'', kind:'destination', sub:'' });
    var k = kindOf(mk.kind);
    return '<section class="ukPanel ukMaker">' +
      '<div class="ukPanel_head"><h3 class="ukPanel_title">Start a board</h3>' +
        '<button class="ukGhost" type="button" data-cancelboard>Cancel</button></div>' +
      '<p class="ukAsk">Two answers and it exists. You can rename it and add picks any time.</p>' +
      '<label class="ukField"><span class="ukField_l">Call it something</span>' +
        '<input class="ukField_i" id="ukBoardT" data-mk="t" value="' + esc(mk.t) + '" ' +
        'placeholder="' + esc(SUGGEST[mk.kind]) + '"></label>' +
      '<p class="ukField_l" style="margin-top:16px">How is it organised?</p>' +
      '<div class="ukChoice">' + D.BOARD_KINDS.map(function (x) {
        return '<button class="ukPick' + (mk.kind === x.k ? ' is-on' : '') + '" type="button" ' +
          'data-mkset="kind" data-val="' + x.k + '">' + esc(x.l) + '</button>'; }).join('') + '</div>' +
      '<p class="ukWhy">' + esc(k.hint) + '. This only decides how picks get grouped, ' +
      'and you can change it later.</p>' +
      '<label class="ukField" style="margin-top:16px"><span class="ukField_l">A line about it' +
        '<span class="ukOpt">Optional</span></span>' +
        '<input class="ukField_i" id="ukBoardS" data-mk="sub" value="' + esc(mk.sub) + '" ' +
        'placeholder="' + esc(SUGGEST_SUB[mk.kind]) + '"></label>' +
      '<button class="ukBtn ukStart_go" type="button" data-makeboard style="margin-top:20px">' +
      'Create the board</button>' +
    '</section>';
  }
  /* never a blank field: the placeholder is a real, usable suggestion */
  var SUGGEST = { destination:'Portugal, off-season', budget:'Great stays under £150',
                  vibe:'Quiet mornings' };
  var SUGGEST_SUB = { destination:'Lisbon to the Algarve', budget:'Per night, and worth it',
                      vibe:'The whole point of the trip' };

  /* ---------------- one board ---------------- */
  function board(st) {
    var b = D.board(st.board);
    if (!b) return V.empty('That board is not here', 'It may have been removed.',
      '<button class="ukBtn" type="button" data-goto="boards">Back to your boards</button>');
    var k = kindOf(b.kind);

    /* picks group under whatever the board is organised by */
    var groups = {};
    b.picks.forEach(function (p) { (groups[p.tag] = groups[p.tag] || []).push(p); });
    var keys = Object.keys(groups);

    return '<button class="ukBack" type="button" data-goto="boards">&larr; All boards</button>' +
      '<section class="ukBoardHead">' +
        '<div><p class="ukMoodCard_k">' + esc(k.l) + '</p>' +
          '<h2 class="ukBoardHead_t">' + esc(b.t) + '</h2>' +
          '<p class="ukBoardHead_s">' + esc(b.sub) + '</p>' +
          '<p class="ukBoardHead_n">' + esc(b.note) + '</p></div>' +
        '<div class="ukBoardHead_a">' +
          '<button class="ukBtn" type="button" data-shareboard="' + b.id + '">' +
            (b.shared ? 'On your profile' : 'Put it on your profile') + '</button>' +
          '<button class="ukGhost" type="button" data-ack="You will be able to add picks from any stay">' +
            'Add a pick</button>' +
        '</div>' +
      '</section>' +

      (b.shared ? '<p class="ukAsk">This one is on your profile, so hotels can see it.</p>' : '') +

      keys.map(function (tag) {
        return '<section class="ukPanel"><div class="ukPanel_head">' +
          '<h3 class="ukPanel_title">' + esc(tag) + '</h3>' +
          '<span class="ukCount">' + groups[tag].length + '</span></div>' +
          '<div class="ukReels">' + groups[tag].map(function (p, i) {
            return '<figure class="ukReel">' + m(p.m, p.t, '', i < 3) +
              '<figcaption><span class="ukReel_t">' + esc(p.t) + '</span>' +
              '<span class="ukReel_s">' + esc(p.note) + '</span></figcaption></figure>';
          }).join('') + '</div></section>';
      }).join('') +

      (b.picks.length ? '' :
        '<div class="ukPanel"><div class="ukEmpty">' +
          '<p class="ukEmpty_t">Nothing pinned yet</p>' +
          '<p class="ukEmpty_p">Add the first thing that made you want to make this board. ' +
          'One pick is a board; the rest follows.</p></div></div>');
  }

  V.boards = boards;
  V.board = board;
})();
