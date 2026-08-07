/* Ukreate - picking a place. One field, one list, one implementation.

   A city is not free text. Typed by hand it arrives as "miami", "Miami FL",
   "Miami, Florida" and "Miami Beach", which are four different places to a
   filter and one place to a person. So it is chosen from a list: start typing,
   the matches drop down with their flag, and picking one stores a key rather
   than a spelling.

   This was already built once, for the hire brief in ukhire.js, and it is the
   shape the onboarding established before that. When the hotel gate asked for a
   city it used a plain text input instead, so the same question had two
   different answers depending on which screen you were on. Now both call this.

   The flag is never on its own. A flag alone is a quiz; a flag next to the name
   is a confirmation, which is the whole job.

   The caller owns the query and the open state, because they belong to the view
   rather than to the record - how you found the place is not part of what was
   answered. UKMARKETS is the list: every country and the cities inside it.

   // PLUG-IN POINT - a real geocoder replaces hits(). Everything else is
   // presentation and would not change. */
window.UKPLACE = (function () {
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' })[c];
    });
  }
  function all() { return window.UKMARKETS || []; }
  function byKey(k) {
    if (!k) return null;
    return all().filter(function (d) { return d.k === k; })[0] || null;
  }

  /* Starts-with before contains, so typing "lis" puts Lisbon above Kalisz.
     Cities before countries, because somebody typing into a "where is your
     property" field means a place, not a nation. */
  function hits(q, limit) {
    var needle = String(q || '').trim().toLowerCase();
    if (!needle) return [];
    var lim = limit || 8;
    var starts = [], has = [];
    all().forEach(function (d) {
      var i = d.n.toLowerCase().indexOf(needle);
      if (i === 0) starts.push(d);
      else if (i > 0) has.push(d);
    });
    function rank(a, b) {
      /* a city beats a country, then the bigger place beats the smaller */
      if ((a.t === 'c') !== (b.t === 'c')) return a.t === 'c' ? -1 : 1;
      return (b.p || 0) - (a.p || 0);
    }
    return starts.sort(rank).concat(has.sort(rank)).slice(0, lim);
  }

  /* The label a picked place is stored and shown as: "Lisbon, Portugal".
     One string, one line, and the same one both sides read. */
  function label(d) {
    if (!d) return '';
    return d.t === 'c' && d.sub ? d.n + ', ' + d.sub : d.n;
  }

  function flag(cc, cls) {
    return cc
      ? '<img class="ukPlace_f' + (cls ? ' ' + cls : '') + '" src="/assets/img/flags/' +
        esc(cc) + '.svg" alt="" loading="lazy" decoding="async">'
      : '';
  }

  /* o = { id, q, open, chosen, value, ph, aria, qAttr, pickAttr, after } */
  function html(o) {
    o = o || {};
    var q = o.q == null ? '' : o.q;
    var open = !!o.open && String(q).trim().length > 0;
    var list = open ? hits(q, o.limit) : [];
    var chosen = o.chosen || null;
    var qAttr = o.qAttr || 'data-placeq';
    var pickAttr = o.pickAttr || 'data-placepick';
    var listId = (o.id || 'ukPlace') + 'List';
    return '<div class="ukPlace' + (open ? ' is-open' : '') + (chosen ? ' has-pick' : '') + '">' +
      '<div class="ukPlace_wrap">' +
        (chosen ? flag(chosen.cc) : '') +
        '<input class="ukField_i ukPlace_q" id="' + esc(o.id || 'ukPlace') + '" ' + qAttr + ' ' +
          'value="' + esc(open ? q : (o.value || '')) + '" ' +
          'placeholder="' + esc(o.ph || 'Start typing a city…') + '" autocomplete="off" ' +
          'role="combobox" aria-autocomplete="list" aria-expanded="' + open + '" ' +
          'aria-controls="' + listId + '" aria-label="' + esc(o.aria || 'Location') + '">' +
        (open
          ? '<div class="ukPlace_drop"><ul class="ukPlace_list" id="' + listId + '" role="listbox">' +
              (list.length
                ? list.map(function (d) {
                    return '<li><button class="ukPlace_o" type="button" role="option" ' +
                      'aria-selected="' + (!!chosen && d.k === chosen.k) + '" ' +
                      pickAttr + '="' + esc(d.k) + '">' +
                      flag(d.cc) +
                      '<span class="ukPlace_on">' + esc(d.n) + '</span>' +
                      (d.sub ? '<span class="ukPlace_os">' + esc(d.sub) + '</span>' : '') +
                      '</button></li>';
                  }).join('')
                : '<li><p class="ukPlace_none">Nothing matches “' + esc(q) + '”.</p></li>') +
            '</ul></div>'
          : '') +
      '</div>' + (o.after || '') +
    '</div>';
  }

  return { html: html, hits: hits, byKey: byKey, label: label, flag: flag, all: all };
})();
