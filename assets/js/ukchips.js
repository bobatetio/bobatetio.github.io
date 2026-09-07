/* Ukreate - picking several things from a long list. The chip picker.

   THIS IS THE ONE FROM /creator/start/. It is what the original creator
   onboarding used for "Markets you cover" and for "what do you shoot": a field
   you type into, a ranked dropdown, and the answers sitting above it as chips
   you can remove.

   Extracted so the in-app gate can ask the same questions rather than a
   lookalike. The state object is passed in, the way ukplatconnect.js,
   ukplace.js and ukshots.js take theirs, because /creator/start/ keeps its
   answers in `f` and the gate keeps them in localStorage.

   Every class name below is one ukcreator.css already defines. Nothing here is
   new markup.

   WHY THE RANKING IS NOT PLAIN SUBSTRING ORDER. There are fifteen hundred
   markets. Typing "lagos" has to put Lagos above a village whose name merely
   contains those letters, so matches are scored on WHERE the match sits in the
   name, then tie-broken on how big the place is. The obvious answer is first
   every time.

   WHY MARKETS SHOW NOTHING UNTIL YOU TYPE. Fifteen hundred entries cannot be
   browsed; a list before anything is typed is a wall to read, not a help, so the
   placeholder carries the examples instead. A short list like what you shoot
   does lay its options out, because there they can all be seen. That is the
   `idle` flag. */
window.UKCHIPS = (function () {
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' })[c];
    });
  }
  var CAP = 5;               /* five is a claim; fifty is noise */

  /* The flag every market carries elsewhere in the product: .ukCrFlag, which is a
     15x11 rectangle with a 2px radius and a hairline ring, from the same
     /assets/img/flags set the cards and the "+N" popup use. Not a circle, and not
     an emoji: those are the two ways this has gone wrong before. */
  function flag(x) {
    return x && x.cc
      ? '<img class="ukCrFlag" src="/assets/img/flags/' + esc(x.cc) + '.svg" alt="" ' +
        'loading="lazy" decoding="async">'
      : '';
  }

  function rank(pool, q) {
    return pool.filter(function (x) {
      return x.n.toLowerCase().indexOf(q) > -1 || (x.sub || '').toLowerCase().indexOf(q) > -1;
    }).map(function (x) {
      var n = x.n.toLowerCase(), at = n.indexOf(q);
      var r = at === 0 ? 300
            : at > 0 && n.charAt(at - 1) === ' ' ? 200
            : at > 0 ? 120
            : 40;                                   /* matched on the country instead */
      if (n === q) r += 200;
      return { x: x, r: r + Math.min(90, (x.p || 0) / 260) };
    }).sort(function (a, b) { return b.r - a.r; })
      .slice(0, 40).map(function (h) { return h.x; });
  }

  /* o = { key, qkey, q, chosen, options, find, ph, label, idle, open, cap } */
  function html(o) {
    var cap = o.cap || CAP;
    var full = o.chosen.length >= cap;
    var q = (o.q || '').toLowerCase().trim();
    var open = !!o.open && !full;

    var pool = o.options.filter(function (x) { return o.chosen.indexOf(x.k) < 0; });
    var hits = !q
      ? (o.idle === false ? null : pool.slice(0, o.maxIdle || 40))
      : rank(pool, q);

    var list = hits === null
      ? ''
      : hits.length
      ? '<ul class="ukPickr_list" id="' + esc(o.key) + 'Drop" role="listbox">' +
        hits.map(function (x) {
          return '<li><button class="ukPickr_o" type="button" role="option" ' +
            'aria-selected="false" data-chip="' + esc(o.key) + '" data-val="' + esc(x.k) + '">' +
            /* inside the name, not beside it: .ukPickr_o is a COLUMN flex, so a
               flag as its own child stacks above the name and takes its height
               from the flex basis rather than the image. Same shape the cards
               use, where the flag sits in the line it belongs to. */
            '<span class="ukPickr_on">' + flag(x) + esc(x.n) + '</span>' +
            (x.sub ? '<span class="ukPickr_os">' + esc(x.sub) + '</span>' : '') +
            '</button></li>';
        }).join('') + '</ul>'
      : '<p class="ukPickr_none">Nothing matches “' + esc(o.q) + '”.</p>';

    return '<div class="ukPickr' + (open ? ' is-open' : '') + '" data-chips="' + esc(o.key) + '">' +
      (o.chosen.length
        ? '<ul class="ukPickr_chips">' + o.chosen.map(function (k) {
            var x = o.find(k);
            return '<li class="ukChip">' + flag(x) + esc(x ? x.n : k) +
              '<button class="ukChip_x" type="button" data-unchip="' + esc(o.key) + '" data-val="' + esc(k) + '" ' +
              'aria-label="Remove ' + esc(x ? x.n : k) + '">&times;</button></li>';
          }).join('') + '</ul>'
        : '') +

      (full
        ? '<p class="ukPickr_full">' + (cap === 1
            ? 'That’s set. Remove it to pick a different one.'
            : 'That’s your ' + cap + '. Remove one to swap it out.') + '</p>'
        : '<div class="ukPickr_wrap">' +
            '<input class="ukPickr_q" id="' + esc(o.key) + 'Q" data-k="' + esc(o.qkey) + '" ' +
            'data-opens="' + esc(o.key) + '" ' +
            'value="' + esc(o.q || '') + '" placeholder="' + esc(o.ph) + '" ' +
            'role="combobox" aria-expanded="' + open + '" aria-controls="' + esc(o.key) + 'Drop" ' +
            'aria-autocomplete="list" aria-label="' + esc(o.label) + '" autocomplete="off">' +
            (o.idle === false ? '' : '<span class="ukPickr_caret" aria-hidden="true"></span>') +
            (open && list ? '<div class="ukPickr_drop">' + list + '</div>' : '') +
          '</div>') +
    '</div>';
  }

  /* The count that sits beside the label: "2 of 5". */
  function counter(n, cap) {
    return '<span class="ukCount2">' + n + ' of ' + (cap || CAP) + '</span>';
  }

  return { html: html, counter: counter, rank: rank, CAP: CAP };
})();
