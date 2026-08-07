/* Ukreate — THE stay card. One component, rendered by both apps.

   A stay is the same object on both sides of the marketplace: the hotel is
   offering it and the creator is being offered it, but it is one trade and it
   should be one card. It used to be written twice — the hotel had this, and the
   creator side had a lookalike built from a different set of classes — so a fix
   to one never reached the other, and the two drifted apart every time either
   was touched.

   This file is the card itself. Both /app/ and /creator/ load it and neither owns
   it. The hotel passes its own property in, because on that side every stay
   belongs to the same hotel; the creator passes the property that comes with each
   stay, because on that side every stay belongs to a different one. Nothing else
   differs, and nothing else should.

   The HOTEL CARD is this same card with the stay's own detail left off — a hotel
   is what you are looking at when you have not chosen a stay yet. It is opts.of
   rather than a second component, for exactly the reason above.

   Markup and classes are unchanged from the hotel's original, so every rule in
   ukapp.css that already styles this card keeps working, and the click handlers
   (gallery arrows, the "+N" popups) keep the attribute names they already had. */
window.UKSTAY = (function () {
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' })[c];
    });
  }
  function img(src, alt, cls, eager) {
    return '<img class="' + (cls || '') + '" src="' + src + '" alt="' + esc(alt) + '"' +
      (eager ? '' : ' loading="lazy" decoding="async"') + '>';
  }

  var MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function fmtDate(d) {
    var x = new Date(d);
    return isNaN(x) ? String(d || '') : x.getDate() + ' ' + MON[x.getMonth()] + ' ' + x.getFullYear();
  }
  /* one line, always: "4–7 Mar 2027", never "4 Mar 2027 - 7 Mar 2027" */
  function fmtRange(from, to) {
    /* "22 Jan" with no year in it still parses — as the year 2001, which is how
       a stay next January came to be dated 2001 on the card. A date carrying no
       year is not a date this can format, so it is passed through as written. */
    var dated = /\d{4}/.test(String(from)) && /\d{4}/.test(String(to));
    var a = new Date(from), b = new Date(to);
    if (!dated || isNaN(a) || isNaN(b)) {
      return from && to ? String(from) + '\u2009\u2013\u2009' + String(to) : String(from || to || '');
    }
    if (a.getFullYear() === b.getFullYear()) {
      if (a.getMonth() === b.getMonth()) {
        return a.getDate() + '–' + b.getDate() + ' ' + MON[b.getMonth()] + ' ' + b.getFullYear();
      }
      return a.getDate() + ' ' + MON[a.getMonth()] + ' – ' +
             b.getDate() + ' ' + MON[b.getMonth()] + ' ' + b.getFullYear();
    }
    return fmtDate(from) + ' – ' + fmtDate(to);
  }

  /* "Yours in perpetuity, all channels" wraps inside a card panel, and the panel
     only has two lines. The long form is still what the brief and the thread say;
     this is the card's version of it. Both sides of the trade get named, because
     the same phrase means different things depending on who is reading it. */
  function shortRights(r) {
    if (!r) return 'Yours in perpetuity';
    if (/perpetuity/i.test(r)) return 'Yours in perpetuity';
    if (/keep and use/i.test(r)) return 'Theirs to keep and use';
    return r;
  }

  /* A list that must not exceed N lines. The clamp runs in the browser and adds
     the "+N" once it knows the real width; the full list rides along in the
     attribute so pressing that badge never has to go back for the data. */
  function fewOf(list, lines, key) {
    list = (list || []).filter(Boolean);
    if (!list.length) return '';
    return '<span class="ukClamp" data-clamp="' + esc(key) + '" data-lines="' + (lines || 2) + '" ' +
      'data-items="' + esc(JSON.stringify(list)) + '">' + esc(list.join(', ')) + '</span>';
  }

  /* The rest of a capped list, opened from its "+N". A title attribute is not a
     control: it needs a hover, a wait and a mouse, and a reader is entitled to
     press the thing and be shown the answer. */
  function pop(open, key, title, list) {
    if (open !== key) return '';
    return '<div class="ukPop_card ukPop_card--stay" role="dialog" aria-label="' + esc(title) + '" data-staypop-panel>' +
      '<div class="ukPop_head"><h2 class="ukPop_h">' + esc(title) + '</h2>' +
        '<button class="ukPop_x" type="button" data-staypop-close aria-label="Close">&times;</button></div>' +
      '<ul class="ukPop_list">' + list.map(function (x) {
        return '<li class="ukPop_row">' + esc(x) + '</li>'; }).join('') + '</ul></div>';
  }

  /* Where the property comes from differs by side and by nothing else: the hotel
     has one and passes it once, the creator gets a different one with every stay
     and it rides on the stay. */
  function propertyOf(stay, opts) {
    var p = opts.property || stay.property;
    if (p) return p;
    return { name: stay.hotel || '', city: stay.city || '', cc: stay.cc || null };
  }

  function gallery(stay, opts) {
    var shots = (stay.shots && stay.shots.length ? stay.shots
               : stay.imgs && stay.imgs.length ? stay.imgs
               : [stay.img]).filter(Boolean);
    var ix = Math.min(Math.max(0, opts.shot || 0), shots.length - 1);
    return '<div class="ukLst_m ukStayShots">' +
      img(shots[ix], stay.t || stay.hotel, 'ukCard_img', opts.eager) +
      (opts.tag || '') +
      (shots.length > 1
        ? ['-1','1'].map(function (d) {
            return '<button class="ukLst_arw ukLst_arw--' + (d === '-1' ? 'p' : 'n') + '" type="button" ' +
              'data-stayshotstep="' + d + '" aria-label="' + (d === '-1' ? 'Previous' : 'Next') + ' photo">' +
              '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' +
              (d === '-1' ? 'M14.5 5.5 8 12l6.5 6.5' : 'M9.5 5.5 16 12l-6.5 6.5') +
              '" fill="none" stroke="currentColor" stroke-width="2.1" ' +
              'stroke-linecap="round" stroke-linejoin="round"/></svg></button>';
          }).join('') +
          '<div class="ukLst_dots" aria-hidden="true">' + shots.map(function (_, n) {
            return '<span class="ukLst_dot' + (n === ix ? ' is-on' : '') + '"></span>'; }).join('') + '</div>'
        : '') +
    '</div>';
  }

  function propLine(pr, opts) {
    var city = pr.city
      ? (pr.cc ? '<img class="ukCrFlag" src="/assets/img/flags/' + pr.cc + '.svg" alt="" ' +
                 'loading="lazy" decoding="async">' : '') + esc(pr.city)
      : '';
    /* the hotel side links its own name to the property profile; the creator side
       links it to that hotel's page, and gets told where by opts.propGo */
    var name = opts.propGo
      ? '<span class="ukProfLink" data-' + opts.propGo.attr + '="' + esc(opts.propGo.val) + '" role="link" ' +
        'tabindex="0" title="' + esc(opts.propGo.title || 'Open the property') + '">' + esc(pr.name) + '</span>'
      : esc(pr.name);
    return '<p class="ukCard_sub">' + name + (city ? ' &middot; ' + city : '') + '</p>';
  }

  /* opts:
       shot     which gallery frame is showing
       pop      which "+N" popup is open, by its scoped key
       tag      a badge to lay over the photo
       foot     whatever the calling page puts under the trade (its own buttons)
       eager    first paint, so do not lazy-load the photo
       property the hotel this stay belongs to, when the caller knows it
       propGo   {attr, val, title} — makes the property name a link
       of       'hotel' renders the HOTEL CARD: the property and its photos, with
                the stay's own nights/inclusions/deliverables left off, because
                you have not chosen a stay yet
       head     an override for the card's heading                              */
  function card(stay, dates, opts) {
    opts = opts || {};
    var pr = propertyOf(stay, opts);
    var isHotel = opts.of === 'hotel';
    var pk = (stay.id || stay.t || pr.name || '').toString().replace(/[^a-zA-Z0-9]/g, '').slice(0, 24);

    var del = (stay.del || []).map(function (d) { return d.q + ' × ' + d.t.toLowerCase(); });
    var got = (stay.del || []).reduce(function (a, d) { return a + (d.q || 0); }, 0);
    var incList = stay.incList && stay.incList.length
      ? stay.incList
      : String(stay.inc || '').split(',').map(function (x) { return x.trim(); }).filter(Boolean);
    /* the room type leads what the stay includes, because that is what it is:
       the first thing the stay gives you */
    var rooms = stay.rooms || stay.room;
    var roomLine = (rooms ? [String(rooms).toLowerCase()] : []).concat(incList);
    var stayLine = stay.nights && stay.nights !== '—'
      ? stay.nights + (String(stay.nights) === '1' ? ' night' : ' nights')
      : 'Nights not set yet';

    /* A hotel card leads with the property, because the property IS the subject.
       A stay card leads with the stay and names the property underneath it. */
    var title = opts.head || (isHotel ? pr.name : (stay.t || pr.name));
    var sub = isHotel
      ? (stay.style || stay.type
          ? '<p class="ukCard_sub">' + esc(stay.style || stay.type) +
            (pr.city ? ' &middot; ' + esc(pr.city) : '') + '</p>'
          : (pr.city ? '<p class="ukCard_sub">' + esc(pr.city) + '</p>' : ''))
      : title === pr.name
        /* When a stay has no name of its own the property becomes the heading,
           and naming it again directly underneath said the same words twice. */
        ? (pr.city ? '<p class="ukCard_sub">' +
            (pr.cc ? '<img class="ukCrFlag" src="/assets/img/flags/' + pr.cc + '.svg" alt="" ' +
                     'loading="lazy" decoding="async">' : '') + esc(pr.city) + '</p>' : '')
        : propLine(pr, opts);

    return '<article class="ukCard ukCard--preview ukCard--stay' + (isHotel ? ' ukCard--hotel' : '') + '">' +
      gallery(stay, opts) +
      '<div class="ukCard_pad">' +
        '<h3 class="ukCard_t">' + esc(title) + '</h3>' +
        sub +

        /* The same two-panel trade the brief shows, because it is the same trade.
           A definition list underneath said it in a different shape for no reason
           and made the two halves of the deal look like unrelated facts. */
        (isHotel ? '' :
        '<div class="ukTrade ukTrade--card">' +
          '<div class="ukTrade_side ukTrade_side--pop"><p class="ukTrade_l">The stay</p>' +
            '<p class="ukTrade_v' + (stay.nights && stay.nights !== '—' ? '' : ' is-wait') + '">' +
              esc(stayLine) + '</p>' +
            /* ONE run, not two paragraphs. The room type was its own <p> and the
               inclusions another, so "design king" could never share a line with
               "Room, breakfast" however much room was left on it. */
            (roomLine.length ? '<p class="ukTrade_s">' + fewOf(roomLine, 2, 'inc:' + pk) + '</p>' : '') +
            (dates && dates.from
              ? '<p class="ukTrade_s">' + esc(fmtRange(dates.from, dates.to)) + '</p>'
              : stay.from ? '<p class="ukTrade_s">' + esc(fmtRange(stay.from, stay.to)) + '</p>' : '') +
          '</div>' +
          '<span class="ukTrade_ar" aria-hidden="true">&harr;</span>' +
          '<div class="ukTrade_side ukTrade_side--pop"><p class="ukTrade_l">' +
            esc(opts.getLabel || 'You get') + '</p>' +
            '<p class="ukTrade_v' + (got ? '' : ' is-wait') + '">' +
              (got ? got + ' asset' + (got === 1 ? '' : 's') : 'Not set yet') + '</p>' +
            /* The rights phrase is fixed, short and always true, so it gets its own
               line and never carries a "+N" — a badge after it would be offering to
               show you more rights when what it held was the deliverables. Those
               get the other line, and the badge. */
            '<p class="ukTrade_s">' + esc(shortRights(stay.rights)) + '</p>' +
            (del.length ? '<p class="ukTrade_s">' + fewOf(del, 1, 'del:' + pk) + '</p>' : '') +
          '</div>' +
        '</div>') +
        (opts.foot || '') +
      '</div>' +
      /* outside .ukCard_pad and last, so nothing the card clips can hide it */
      (isHotel ? '' : pop(opts.pop, 'inc:' + pk, 'What the stay includes', roomLine) +
                      pop(opts.pop, 'del:' + pk, 'What they create', del)) +
    '</article>';
  }

  /* the hotel card is the same card with the stay left off, never a second one */
  function hotelCard(stay, opts) {
    opts = opts || {};
    opts.of = 'hotel';
    return card(stay, null, opts);
  }

  /* ---------------- the card's own behaviour ----------------
     Two things the card cannot do in a string: measure itself, and place a popup
     next to a button whose position only exists once it is on screen. Both used
     to live in the hotel's ukapp.js, which is why the creator side had a card
     that looked right and then never clamped. They belong to the card. */

  /* Trim a run of items to N lines and add the "+N" that opens the rest.
     Done by MEASUREMENT, after layout, because only the browser knows how many
     words fit a panel that is a different width on every screen. A character
     budget was a guess: too many on a narrow card, too few on a wide one, and the
     visible symptom was one word stranded alone on the second line. */
  function clamp(root) {
    (root || document).querySelectorAll('.ukClamp[data-items]').forEach(function (el) {
      var items;
      try { items = JSON.parse(el.getAttribute('data-items')); } catch (e) { return; }
      if (!items || items.length < 2) return;

      /* each clamp says how many lines it is allowed: two where the run is the
         whole panel body, one where a fixed line already sits above it */
      var maxLines = Number(el.getAttribute('data-lines')) || 2;
      var line = parseFloat(getComputedStyle(el).lineHeight) || 16;
      var limit = line * maxLines + 1;
      el.textContent = items.join(', ');
      if (el.scrollHeight <= limit) return;          /* it all fits — nothing to do */

      var key = el.getAttribute('data-clamp');
      for (var n = items.length - 1; n >= 1; n--) {
        var rest = items.length - n;
        el.innerHTML = esc(items.slice(0, n).join(', ')) +
          ' <button class="ukMoreDot ukMoreDot--sm" type="button" data-staypop="' + esc(key) +
          '" aria-label="Show the other ' + rest + '">+' + rest + '</button>';
        if (el.scrollHeight <= limit) return;
      }
    });
  }

  /* Put the open popup beside the "+N" that asked for it, flipping above when
     there is no room below. Returns false when the button it belongs to is gone,
     so the caller can drop the state that opened it. */
  function place(openKey, root) {
    root = root || document;
    var panel = root.querySelector('[data-staypop-panel]');
    if (!panel) return true;
    var btn = root.querySelector('[data-staypop="' + openKey + '"]');
    if (!btn) return false;
    var r = btn.getBoundingClientRect();
    var w = panel.offsetWidth || 240;
    var left = Math.min(Math.max(10, r.left + r.width / 2 - w / 2), window.innerWidth - w - 10);
    var below = r.bottom + 8;
    var fitsBelow = below + panel.offsetHeight < window.innerHeight - 10;
    panel.style.left = left + 'px';
    panel.style.top = (fitsBelow ? below : Math.max(10, r.top - panel.offsetHeight - 8)) + 'px';
    panel.style.visibility = 'visible';
    return true;
  }

  /* how many frames a card's gallery has, so a stepper can wrap without the
     calling app having to know how the card chose its photos */
  function shots(stay) {
    return (stay.shots && stay.shots.length ? stay.shots
          : stay.imgs && stay.imgs.length ? stay.imgs
          : [stay.img]).filter(Boolean).length;
  }

  return { card: card, hotelCard: hotelCard, clamp: clamp, place: place, shots: shots,
           fewOf: fewOf, pop: pop, shortRights: shortRights, fmtRange: fmtRange };
})();
