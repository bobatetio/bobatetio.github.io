/* Ukreate — the public Stays screen.

   The mirror of /find-creators/, built the same way. Not a public lookalike of
   the creator app's Stays page: it IS that page. window.UKCV.stays(st) is the
   same function /creator/ calls to draw Find Stays, and it returns the whole
   screen — the heading, the Kind of stay dropdown, the Grid / List / Map
   switcher, THE stay card (ukstaycard.js, the one component both apps render),
   the pagination and the map. This file renders that, keeps the same state
   object the app keeps, and re-renders on the same data attributes the app's
   own handlers read, because those handlers live in ukcapp.js and ukcapp.js is
   the signed-in shell.

   What this replaces was a hand-built directory with its own card, its own
   filter bar and its own empty state, whose header note said outright that the
   card was "NOT the app's stay card". That is why a search landed somewhere
   that looked nothing like the product it was searching.

   Four things differ, and only four:

   1. Every control that would write is rewritten to a signup link. Pitch, save
      and the card's own click-through cannot act for somebody with no account,
      so they ask for one instead. Nothing is hidden; the wall is on the action.
   2. Saved stays read empty, because a shortlist belongs to an account, and the
      All / Saved pill pair comes out with them.
   3. Outreach comes out. That tab is cold hotels with their contact details on
      the card, which is a signed-in creator's working list and not something to
      publish.
   4. The fit score stops being personal. scoreFor() adjusts a stay's own score
      by how close the signed-in creator's audience band is to what the hotel
      wants; a visitor has no band, so the band is cleared and the app's own
      fallback returns the stay's base score. The chip's wording follows it.

   The app is not modified. */
(function () {
  var D = window.UKC, V = window.UKCV;
  var mount = document.querySelector('[data-pub-network]');
  if (!D || !V || !mount) return;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; });
  }

  /* ---- no signed-in creator on this page ----
     scoreFor() returns the stay's own score when the band is not one of BANDS,
     which is exactly the reading a visitor should get: how open this hotel is
     to creators, before anybody's audience is in the picture. And a saved flag
     is somebody's shortlist, so the seeded ones are cleared rather than shown
     to a visitor as their own. */
  if (D.me) D.me.band = '';
  (D.stays || []).forEach(function (s) { s.saved = false; });
  (D.leads || []).forEach(function (l) { l.saved = false; });

  /* the app's own state shape for this screen */
  var st = { view:'grid', tab:'stays', style:'all', q:'', saved:false, shots:{}, pgStays:1,
             place:'all', month:'all', nights:'all', wants:'all' };

  /* ---- the facets this page adds ----
     The app's Find Stays offers one dropdown, and it can: a signed-in creator
     arrives with a profile, and the list is already ranked against it. A
     visitor has none of that, so the only way to narrow is to say so. These
     four read fields every stay already carries, so nothing about the data
     changes and the app itself is still untouched — they are applied to the
     pool before V.stays() draws it, and their menus are drawn into the app's
     own toolbar shape beside Kind of stay. */
  var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var MONTH_FULL = { Jan:'January', Feb:'February', Mar:'March', Apr:'April', May:'May',
    Jun:'June', Jul:'July', Aug:'August', Sep:'September', Oct:'October',
    Nov:'November', Dec:'December' };
  /* the only city tails in the data that are not countries */
  var STATES = { florida:'United States', california:'United States', 'new york':'United States',
    texas:'United States', hawaii:'United States', arizona:'United States' };
  var BANDS = ['Under 5K', '5K - 25K', '25K - 100K', '100K+'];

  function placeOf(s) {
    var tail = String(s.city || '').split(',').pop().trim();
    return STATES[tail.toLowerCase()] || tail;
  }
  function monthOf(s) {
    var m = String(s.from || '').match(/\b([A-Z][a-z]{2})\b/);
    return m ? m[1] : '';
  }
  function nightsOf(s) { return s.nights ? String(s.nights) : ''; }
  function wantsOf(s) { return String(s.wants || ''); }

  var FACETS = [
    { k:'place',  label:'Where',    any:'Anywhere',    of:placeOf,
      text:function (v) { return v; },
      /* the country reads with its flag here the way it does on every card and
         every market line in the product */
      mark:function (v) { return window.ukFlagFor ? window.ukFlagFor(v) : ''; },
      order:function (a, b) { return a.localeCompare(b); } },
    { k:'month',  label:'When',     any:'Any month',   of:monthOf,
      text:function (v) { return MONTH_FULL[v] || v; },
      order:function (a, b) { return MONTHS.indexOf(a) - MONTHS.indexOf(b); } },
    { k:'nights', label:'Nights',   any:'Any length',  of:nightsOf,
      text:function (v) { return v + (v === '1' ? ' night' : ' nights'); },
      order:function (a, b) { return Number(a) - Number(b); } }
  ];
  /* Audience was a fifth menu and the row could not hold it beside the view
     switcher at any width worth designing for. It is still read out of a
     search sentence, so "stays for under 5k" narrows; it just has no menu. */

  /* every value a facet actually has in the data, in its own order */
  function facetValues(f) {
    var seen = {}, out = [];
    (D.stays || []).forEach(function (s) {
      var v = f.of(s);
      if (v && !seen[v]) { seen[v] = 1; out.push(v); }
    });
    return out.sort(f.order);
  }
  /* does one stay pass every facet that is set? */
  function facetsPass(s) {
    if (st.wants && st.wants !== 'all' && wantsOf(s) !== st.wants) return false;
    for (var i = 0; i < FACETS.length; i++) {
      var f = FACETS[i], want = st[f.k];
      if (want && want !== 'all' && f.of(s) !== want) return false;
    }
    return true;
  }

  var urlStyle = null, urlFacets = {};
  (function readUrl() {
    var p = new URLSearchParams(location.search);
    st.rawQ = p.get('q') || '';
    st.q = st.rawQ;
    st.view = p.get('view') || 'grid';
    st.style = p.get('style') || 'all';
    urlStyle = p.get('style') || null;
    urlFacets = {};
    FACETS.forEach(function (f) {
      st[f.k] = p.get(f.k) || 'all';
      urlFacets[f.k] = p.get(f.k) || null;
    });
    st.wants = p.get('wants') || 'all';
    urlFacets.wants = p.get('wants') || null;
    /* edit=1 says the filters in this URL were touched by hand. Without it a
       reload re-derives them from the sentence and every removal comes back. */
    st.edited = p.get('edit') === '1';
    st.pgStays = Number(p.get('page') || 1) || 1;
  })();
  function writeUrl() {
    var p = new URLSearchParams();
    /* the sentence that was typed, not the reduced text it was boiled down to.
       applyQuery() strips every word that named a filter, so on a search like
       "wellness creators on TikTok" nothing survived and q vanished from the
       URL. The echo still read right on arrival because rawQ was held in memory,
       but a reload or a shared link came back with the filters set and no idea
       what had been asked. The URL carries the sentence now, and readUrl feeds it
       straight back through applyQuery, so a refresh lands exactly where it was. */
    if (st.rawQ) p.set('q', st.rawQ); else if (st.q) p.set('q', st.q);
    if (st.view !== 'grid') p.set('view', st.view);
    if (st.style !== 'all') p.set('style', st.style);
    FACETS.forEach(function (f) { if (st[f.k] && st[f.k] !== 'all') p.set(f.k, st[f.k]); });
    if (st.wants && st.wants !== 'all') p.set('wants', st.wants);
    if (st.edited) p.set('edit', '1');
    if (st.pgStays > 1) p.set('page', st.pgStays);
    var qs = p.toString();
    history.replaceState(null, '', qs ? '?' + qs : location.pathname);
  }

  /* ---- the gate: rewrite the three controls that would write ---- */
  function gate(html) {
    /* Pitch this stay -> sign up, carrying which stay was being pitched */
    html = html.replace(
      /<button class="ukBtn([^"]*)" type="button" data-apply="([^"]*)">Pitch this stay<\/button>/g,
      function (m, cls, id) {
        return '<a class="ukBtn' + cls + '" href="/join/?side=creator&amp;stay=' + esc(id) +
               '">Pitch this stay</a>';
      });
    /* the heart, in one pass: rewriting only the opening tag leaves an unclosed
       anchor that swallows the rest of the card */
    html = html.replace(
      /<button class="ukHeart[^"]*" type="button" data-save="([^"]*)"[^>]*>([\s\S]*?)<\/button>/g,
      function (m, id, inner) {
        return '<a class="ukHeart" href="/join/?side=creator" title="Save this stay" ' +
               'aria-label="Save this stay">' + inner + '</a>';
      });
    /* The map rail's own button becomes the same pitch link: a visitor has one
       decision to make here, and it is whether to sign up and pitch. */
    html = html.replace(
      /<button class="ukBtn ukBtn--sm" type="button" data-open="([^"]*)">See the stay<\/button>/g,
      function (m, id) {
        return '<a class="ukBtn ukBtn--sm" href="/join/?side=creator&amp;stay=' + esc(id) +
               '">Pitch this stay</a>';
      });
    /* "See the property" is a second way into detail a visitor has no account
       for, so it comes off the card entirely. */
    html = html.replace(/<a class="ukStayCard_prop"[^>]*>[\s\S]*?<\/a>/g, '');
    html = html.replace(/<button class="ukStayCard_prop"[^>]*>[\s\S]*?<\/button>/g, '');
    return html;
  }

  /* ---- opening a stay ----
     The card is a role="button" that opens the app's own detail view. Here it
     opens that stay's page instead. Done on the click rather than by rewriting
     the element into an anchor: the card already contains an anchor (Pitch this
     stay), and an anchor inside an anchor is not markup a browser will keep.
     Keyboard follows the app's own affordance, Enter or Space on the card. */
  function openHref(el) {
    return '/join/?side=creator&stay=' + el.getAttribute('data-open');
  }
  function wantsOpen(e) {
    var el = e.target.closest ? e.target.closest('[data-open]') : null;
    if (!el || !el.getAttribute('data-open')) return null;
    if (e.target.closest('a, button')) return null;
    return el;
  }

  /* ---- no dead ends ----
     V.stays() runs the app's own filter, and the app is entitled to return
     nothing: a signed-in creator who filters themselves into a corner knows
     why. A visitor does not, and an empty grid is the worst screen a public
     directory can show. So the exact set is measured with the same predicate
     the app uses, and when it comes back under the floor the nearest stays are
     rendered after it, with the same V.stayCard(). Nothing is relabelled: the
     app's own count and filters are untouched above. */
  var FLOOR = 12;

  /* the predicate from ukcviews.js stays(), field for field */
  function exactSet() {
    var q = (st.q || '').toLowerCase(), sf = st.style || 'all';
    return (D.stays || []).filter(function (s) {
      if (st.saved && !s.saved) return false;
      if (q && (s.hotel + ' ' + s.city + ' ' + s.style).toLowerCase().indexOf(q) < 0) return false;
      if (sf !== 'all' && s.style !== sf) return false;
      if (!facetsPass(s)) return false;
      return true;
    });
  }
  function nearness(s) {
    var n = 0;
    if (st.style !== 'all' && s.style === st.style) n += 3;
    /* a stay that still answers one of the facets is nearer than one that
       answers none, so a widened list stays recognisably about the search */
    FACETS.forEach(function (f) {
      if (st[f.k] && st[f.k] !== 'all' && f.of(s) === st[f.k]) n += 2;
    });
    if (st.q) {
      var q = st.q.toLowerCase();
      if ((s.hotel + ' ' + s.city + ' ' + s.style).toLowerCase().indexOf(q) > -1) n += 3;
      /* a market that shares the country still reads as near, which is what a
         search for a place mostly means */
      var tail = String(s.city).split(',').pop().trim().toLowerCase();
      if (tail && q.indexOf(tail) > -1) n += 2;
    }
    return n + (Number(D.scoreFor ? D.scoreFor(s) : s.score) || 0) / 10;
  }

  var toppedUp = 0;
  function topUp() {
    toppedUp = 0;
    var exact = exactSet();
    if (exact.length >= FLOOR) return;
    /* When nothing matched at all, stays() draws its empty panel and no grid,
       so there is nothing to append to. The panel comes out and the nearest
       block takes its place. List and map draw their own way and are left be. */
    var grid = mount.querySelector('.ukGrid--stays');
    var empty = mount.querySelector('.ukEmpty');
    if (!grid && !empty) return;
    if (!grid && empty && st.view !== 'grid') return;
    var seen = {};
    exact.forEach(function (s) { seen[s.id] = 1; });
    var rest = (D.stays || []).filter(function (s) { return !seen[s.id]; })
      .sort(function (a, b) { return nearness(b) - nearness(a); })
      .slice(0, FLOOR - exact.length);
    if (!rest.length) return;
    toppedUp = rest.length;

    /* Into the same grid, not a second one under it. A separate grid closes the
       first one's last row wherever it happens to end, so a search with one
       exact match rendered that stay alone on a full-width row with the nearest
       ones starting a fresh grid below it. */
    var html = gate(rest.map(function (x, i) { return V.stayCard(x, exact.length + i, st); }).join(''));
    if (grid) {
      grid.insertAdjacentHTML('beforeend', html);
    } else {
      var box = empty.closest('.ukPanel') || empty;
      var made = document.createElement('div');
      made.className = 'ukGrid ukGrid--stays';
      made.innerHTML = html;
      box.insertAdjacentElement('beforebegin', made);
      box.remove();
    }
  }

  /* ---- the map view ----
     stays() renders the map's slot and its points but never draws: in the app
     that is the shell's job (mountStayMap in ukcapp.js). Same three steps here,
     against the same data-cstaymap attribute. */
  var sMap = null, sMapHost = null;
  function mountMap() {
    var slot = mount.querySelector('[data-cstaymap]');
    if (!slot || !window.UKWORLDMAP) return;
    if (!sMapHost) {
      sMapHost = document.createElement('div');
      sMapHost.className = 'ukMap';
      sMapHost.setAttribute('aria-hidden', 'true');
    }
    if (sMapHost.parentNode !== slot) slot.appendChild(sMapHost);
    var pts = [];
    try { pts = JSON.parse(slot.getAttribute('data-cstaymap') || '[]'); } catch (e) { pts = []; }
    if (!sMap) sMap = window.UKWORLDMAP.mount(sMapHost, { lat: 0, lng: 0, zoom: 1 });
    else if (sMap.resume) sMap.resume();
    if (!sMap) return;
    if (sMap.pins) sMap.pins(pts);
    var sel = pts.filter(function (p) { return p.on; })[0];
    if (sMap.fit) sMap.fit(sel ? [sel] : pts);
  }

  /* ---- the signup banner ----
     Dropped into the grid after the second row, so it arrives once the visitor
     has actually seen the stays rather than on top of them. Grid only: the list
     has its own rhythm and the map is a single frame. */
  function bannerBody() {
    return '<div class="ukPubBanner_b">' +
        '<p class="ukPubBanner_t">Create a free account to pitch for any of these stays</p>' +
        '<p class="ukPubBanner_p">Browsing is open to everyone. An account is what sends the pitch.</p>' +
      '</div>' +
      '<div class="ukPubBanner_a"><a class="btn btn--gold" href="/join/?side=creator">' +
      '<strong class="btnRoll"><span data-hover="Set up your profile"><em>Set up your profile</em></span>' +
      '</strong></a></div>';
  }
  function banner() {
    /* List and map get the same row, under the view rather than inside it: a
       table cannot take a grid child, and the map is one frame. */
    if (st.view !== 'grid') {
      var host = mount.querySelector('.ukList') || mount.querySelector('.ukMapSlot') ||
                 mount.querySelector('.ukTableWrap');
      if (!host || mount.querySelector('.ukPubBanner')) return;
      var wide = document.createElement('div');
      wide.className = 'ukPubBanner ukPubBanner--wide';
      wide.style.setProperty('--uk-banner-img', "url('/assets/img/hero/hero-creators.jpg?v=1')");
      wide.innerHTML = bannerBody();
      (host.closest('.ukPanel') || host).insertAdjacentElement('afterend', wide);
      return;
    }
    var grid = mount.querySelector('.ukGrid--stays');
    if (!grid || st.view !== 'grid') return;
    if (grid.querySelector('.ukPubBanner')) return;
    var cards = grid.querySelectorAll('.ukStayCell');
    var cols = getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length || 3;
    var after = cards[cols * 2 - 1];
    if (!after) return;
    var el = document.createElement('div');
    el.className = 'ukPubBanner';
    /* the same photograph this page's hero runs */
    el.style.setProperty('--uk-banner-img', "url('/assets/img/hero/hero-creators.jpg?v=1')");
    el.innerHTML = bannerBody();
    after.insertAdjacentElement('afterend', el);
  }

  /* List and map are drawn entirely by stays(), so a grid-only top-up left them
     on the app's empty state. Rather than patch three views three ways, the
     state itself relaxes: if the current filters return nothing, the free text
     is dropped for the render, and if that is still nothing the kind-of-stay
     filter goes too. The input and the URL keep what was typed; only what is
     matched on is widened, and the grid's top-up handles the rest. */
  function relax() {
    var undo = [];
    if (exactSet().length) return undo;
    if (st.q) { undo.push(['q', st.q]); st.q = ''; }
    /* the facets go before the kind of stay does: which kind of place somebody
       wants is the answer they are least willing to give up, and dates or a
       length are the easiest thing to have over-specified */
    ['month', 'nights', 'wants', 'place'].forEach(function (k) {
      if (exactSet().length) return;
      if (st[k] && st[k] !== 'all') { undo.push([k, st[k]]); st[k] = 'all'; }
    });
    if (!exactSet().length && st.style !== 'all') { undo.push(['style', st.style]); st.style = 'all'; }
    return undo;
  }
  function restore(undo) {
    undo.forEach(function (pair) { st[pair[0]] = pair[1]; });
  }


  /* ---- the card, read as a listing ----
     The dates belong beside the place, the way every card on the landing pages
     reads: where it is, and when. Moved rather than duplicated, which also
     takes a variable line out of the trade card so the cards sit level. */
  /* two shapes reach the card: "22 Jan - 25 Jan", and the compact
     "12-14 Apr 2027" a stay whose dates carry a year renders as. Only the first
     was matched, so those stays kept their dates down in the detail list while
     every other card had them beside the place. */
  var DATEY = /^\s*\d{1,2}\s*(?:\w{3}\s*)?[\u2013\u2014-]\s*\d{1,2}\s+\w{3}(?:\s+\d{4})?\s*$/;
  function tidyCards() {
    mount.querySelectorAll('.ukStayCell').forEach(function (cell) {
      var sub = cell.querySelector('.ukCard_sub');
      if (!sub || sub.querySelector('.ukPubStay_when')) return;
      var line = null;
      cell.querySelectorAll('.ukTrade_side .ukTrade_s').forEach(function (el) {
        if (!line && DATEY.test(el.textContent)) line = el;
      });
      if (!line) return;
      var when = document.createElement('span');
      when.className = 'ukPubStay_when';
      when.textContent = line.textContent.trim();
      var dot = document.createElement('span');
      dot.className = 'ukPubStay_dot';
      dot.setAttribute('aria-hidden', 'true');
      sub.appendChild(dot);
      sub.appendChild(when);
      line.remove();
    });
    stripRights();
    capToOne();
  }

  /* ---- the rights line ----
     "Theirs to keep and use" is a licensing statement, and it is the one line on
     the card that talks about what happens to the work rather than what the
     stay is. It comes off the public card. */
  var RIGHTS = /^(theirs to keep and use|yours in perpetuity)$/i;
  function stripRights() {
    mount.querySelectorAll('.ukTrade_side .ukTrade_s').forEach(function (el) {
      if (el.querySelector('*')) return;
      if (RIGHTS.test(el.textContent.trim())) el.remove();
    });
  }

  /* ---- one item to a line ----
     The app caps these runs at two items, which on a card this width is two
     lines as often as one. Here the run shows its first item and everything
     else goes behind the "+N", so every card's detail block is the same
     height. The badge is the card's own control; only the count changes. */
  function capToOne() {
    mount.querySelectorAll('.ukClamp[data-clamp]').forEach(function (el) {
      var btn = el.querySelector('[data-staypop]');
      var shown = el.childNodes[0] && el.childNodes[0].nodeType === 3
        ? el.childNodes[0].nodeValue : '';
      var items = shown.split(',').map(function (x) { return x.trim(); }).filter(Boolean);
      if (items.length < 2) return;
      var hidden = 0;
      if (btn) hidden = Number(String(btn.textContent).replace(/[^0-9]/g, '')) || 0;
      var rest = (items.length - 1) + hidden;
      el.childNodes[0].nodeValue = items[0] + (rest > 0 ? ' ' : '');
      if (!rest) { if (btn) btn.remove(); return; }
      if (!btn) {
        btn = document.createElement('button');
        btn.className = 'ukMoreDot ukMoreDot--sm';
        btn.type = 'button';
        btn.setAttribute('data-staypop', el.getAttribute('data-clamp'));
        el.appendChild(btn);
      }
      btn.textContent = '+' + rest;
      btn.setAttribute('aria-label', 'Show the other ' + rest);
      /* beside the run, not inside it: the run is the part held to one line,
         and a badge caught inside that clamp is the first thing to disappear */
      if (btn.parentNode === el && el.parentNode) el.parentNode.appendChild(btn);
    });
  }

  /* ---- the readout ----
     A search that quietly sets a filter and shows a grid is asking to be
     trusted. This says what it did, and every chip carries an x. */
  function chip(kind, value, label) {
    var why = st.why && st.why[kind];
    var KIND = { style:'Kind of stay', q:'Keywords' }[kind];
    if (!KIND) FACETS.forEach(function (f) { if (f.k === kind) KIND = f.label; });
    if (!KIND && kind === 'wants') KIND = 'Audience';
    return '<span class="ukRead_chip' + (why ? ' is-auto' : '') + '"' +
      (why ? ' title="Read from &quot;' + esc(why) + '&quot; in your search"' : ' title="You set this"') + '>' +
      '<b class="ukRead_k">' + esc(KIND) + '</b>' +
      '<span class="ukRead_v">' + esc(label) + '</span>' +
      '<button class="ukRead_x" type="button" data-unset="' + kind + '" ' +
      'aria-label="Remove ' + esc(KIND) + ' ' + esc(label) + '">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" ' +
      'aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line>' +
      '<line x1="6" y1="6" x2="18" y2="18"></line></svg></button></span>';
  }
  function readout(undo) {
    var slot = document.querySelector('[data-pub-read]');
    if (!slot) return;
    var chips = [];
    if (st.style && st.style !== 'all') chips.push(chip('style', st.style, st.style));
    FACETS.forEach(function (f) {
      if (st[f.k] && st[f.k] !== 'all') chips.push(chip(f.k, st[f.k], f.text(st[f.k])));
    });
    if (st.wants && st.wants !== 'all') chips.push(chip('wants', st.wants, st.wants));
    if (st.q) chips.push(chip('q', st.q, st.q));
    if (!chips.length && !st.rawQ) { slot.hidden = true; slot.innerHTML = ''; return; }
    var note = '';
    if (!chips.length) {
      note = st.edited
        ? 'Every filter is off, so this is every open stay.'
        : 'We could not match your wording to a filter, so this is every open stay.';
    } else if (toppedUp && st.edited) {
      var exactN = exactSet().length;
      note = exactN + (exactN === 1 ? ' stay matches' : ' stays match') +
        ' all of these exactly. The nearest ones follow them.';
    } else if (undo && undo.length) {
      var names = { q:'the keywords', style:'Kind of stay' };
      FACETS.forEach(function (f) { names[f.k] = f.label; });
      names.wants = 'Audience';
      note = 'Nothing matched all of these together, so ' +
        undo.map(function (u) { return names[u[0]] || u[0]; }).join(' and ') + ' was widened for this list.';
    }
    slot.hidden = false;
    slot.innerHTML =
      (chips.length
        ? '<div class="ukRead_row">' + chips.join('') +
          '<button class="ukRead_clear" type="button" data-unset="all">Clear all</button></div>'
        : '') +
      (note ? '<p class="ukRead_note">' + esc(note) + '</p>' : '');
  }

  /* The heading says what is on the page, not what the page is called. */
  function headline() {
    var el = document.querySelector('[data-pub-head]');
    if (!el) return;
    /* what is on screen, not what matched exactly: relax() and topUp() can put
       more on the page than the strict predicate returned, and a heading that
       said "no stay matches" over thirteen cards was simply wrong */
    var shown = mount.querySelectorAll('.ukStayCell').length;
    var n = shown || exactSet().length;
    /* the kind only names the set when the filter actually held: relax() can
       widen it, and then most of what is on screen is not that kind at all */
    var held = exactSet().length >= shown;
    var kind = (held && st.style && st.style !== 'all') ? st.style.toLowerCase() : '';
    /* a search that set only the added facets still narrowed the page, and the
       heading said "19 stays open to creators" over a filtered grid */
    var faceted = (st.wants && st.wants !== 'all') ||
      FACETS.some(function (f) { return st[f.k] && st[f.k] !== 'all'; });
    if (!n) el.textContent = 'No stay matches that yet';
    else if (kind || st.q || faceted || (st.style && st.style !== 'all')) {
      el.textContent = n + (kind ? ' ' + kind : '') + (n === 1 ? ' stay' : ' stays') + ' for your search';
    } else {
      el.textContent = (D.stays || []).length + ' stays open to creators';
    }
  }

  /* the menus this page adds, in the app's own dropdown shape so they sit in
     the toolbar as one row with Kind of stay rather than as a second bar */
  function facetMenus() {
    return FACETS.map(function (f) {
      var vals = facetValues(f), cur = st[f.k] || 'all';
      if (vals.length < 2) return '';
      return '<div class="ukDrop"><button class="ukDrop_b" type="button" data-drop-toggle ' +
        'aria-haspopup="menu" aria-expanded="false">' +
        '<span class="ukDrop_k">' + esc(f.label) + '</span>' +
        '<span class="ukDrop_v">' +
          (cur !== 'all' && f.mark ? f.mark(cur) : '') +
          esc(cur === 'all' ? f.any : f.text(cur)) + '</span>' +
        CHEV + '</button>' +
        '<div class="ukDropMenu" hidden role="menu">' +
          '<button class="ukDropMenu_i' + (cur === 'all' ? ' is-sel' : '') + '" role="menuitem" ' +
            'data-facet="' + f.k + ':all">' + esc(f.any) + '</button>' +
          vals.map(function (v) {
            return '<button class="ukDropMenu_i' + (v === cur ? ' is-sel' : '') + '" role="menuitem" ' +
              'data-facet="' + esc(f.k + ':' + v) + '">' +
              (f.mark ? f.mark(v) : '') + esc(f.text(v)) + '</button>';
          }).join('') +
        '</div></div>';
    }).join('');
  }
  /* the chevron the app's own dropdowns draw, copied so the added menus are not
     a second-looking control next to them */
  var CHEV = '<svg class="ukDrop_car" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<polyline points="6 9 12 15 18 9"></polyline></svg>';

  function paint() {
    /* Relaxing and topping up exist so a sentence nobody tuned never lands on an
       empty grid. A filter somebody set by hand is a different thing: picking
       Morocco and being shown twelve stays, two of them in Morocco, reads as the
       filter being ignored. So both are for the derived case only, and a
       hand-set list is exactly what was asked for, however short. */
    var undo = st.edited ? [] : relax();
    /* V.stays() filters on the app's own three fields and nothing else, so the
       facets are applied to the pool it is handed rather than by reaching into
       the app. The full list goes back immediately: topUp() and nearness() both
       need it to widen a search that came back thin. */
    var full = D.stays;
    D.stays = (full || []).filter(facetsPass);
    var drawn;
    try { drawn = gate(V.stays(st)); } finally { D.stays = full; }
    mount.innerHTML = drawn;
    restore(undo);
    /* The filters somebody set by hand are never widened — relax() is for a
       sentence nobody tuned. But a single card on a page is not a result, it is
       a page that looks broken, so the nearest stays still follow the exact
       ones and the readout says that is what happened. */
    topUp();
    /* The screen's own heading and ask slot come out: both moved up into the
       band above, which is where the app puts them too (its heading sits in the
       page frame and its ask bar is mounted from the shell). */
    var ph = mount.querySelector('.ukPageHead'); if (ph) ph.remove();
    var slot = mount.querySelector('.ukCrFind'); if (slot) slot.remove();
    /* Stays / Outreach goes: Outreach is cold hotels with their contact details
       on the card, which is a signed-in creator's working list. With it gone the
       kind-of-stay filter and the view switcher take the whole row. */
    var tabs = mount.querySelector('.ukFilters--tabs'); if (tabs) tabs.remove();
    /* With the Stays/Outreach tabs gone the toolbar had one child left, so its
       space-between had nothing to push apart and both controls sat left. The
       view switcher becomes the row's second child. */
    (function splitBar() {
      var bar = mount.querySelector('.ukCrBar');
      var right = bar && bar.querySelector('.ukCrBar_r');
      var seg = right && right.querySelector('.ukSeg');
      /* the added menus go after Kind of stay and before the view switcher, so
         the row reads as narrowing on the left and reshaping on the right */
      if (right) {
        var last = right.querySelector('.ukDrop');
        if (last) last.insertAdjacentHTML('afterend', facetMenus());
        else right.insertAdjacentHTML('afterbegin', facetMenus());
      }
      if (bar && right && seg) bar.appendChild(seg);
    })();
    /* All / Saved goes with it: a shortlist belongs to an account. */
    var sub = mount.querySelector('.ukSubTabs'); if (sub) sub.remove();
    /* the fit chip is no longer read against anybody's audience, so it stops
       saying it is */
    mount.querySelectorAll('.ukScore2, .ukTag--you').forEach(function (el) {
      if (!/fits your audience/i.test(el.getAttribute('title') || '')) return;
      el.setAttribute('title', 'How open this hotel is to working with creators');
      if (el.hasAttribute('aria-label')) {
        el.setAttribute('aria-label', 'Openness score: ' + el.textContent.trim());
      }
    });
    /* No pager on a public feed. The app pages a signed-in list; here the grid
       is a first look and the sign-up under it is how you see the rest, so the
       nav and its "Showing 1-12 of N" line both come out. */
    mount.querySelectorAll('.ukPage').forEach(function (n) { n.remove(); });
    mountMap();
    banner();
    tidyCards();
    readout(undo);
    headline();
    writeUrl();
  }

  /* ---- the search sets the filters ----
     Typing "stays in Morocco that want wellness content" should arrive with the
     kind of stay already selected, not with a blind text match. The query is
     read against the same vocabulary the dropdown is built from, so a term that
     names a kind selects it and is dropped from the free text; whatever is left
     over stays as the text search. */
  function vocab() {
    var seen = {}, out = [];
    (D.stays || []).forEach(function (s) { if (s.style && !seen[s.style]) { seen[s.style] = 1; out.push(s.style); } });
    return out;
  }
  function applyQuery(raw) {
    var q = String(raw || '');
    var low = q.toLowerCase();
    st.style = 'all';
    FACETS.forEach(function (f) { st[f.k] = 'all'; });
    st.wants = 'all';
    /* why[kind] = the word in the sentence that chose it */
    st.why = {};

    /* ---- the added facets, read off the same sentence ----
       Whatever a facet takes is struck out of the text before the next one
       looks, so "3 nights in Portugal in March" does not also survive as a
       keyword search for words the filters have already handled. */
    function take(kind, value, word) {
      st[kind] = value; st.why[kind] = word;
      low = low.split(word).join(' ');
    }
    /* where: the country or the city, whichever the sentence names */
    (function () {
      var hit = null;
      facetValues(FACETS[0]).forEach(function (v) {
        if (!hit && v.length > 3 && low.indexOf(v.toLowerCase()) > -1) hit = [v, v.toLowerCase()];
      });
      if (!hit) {
        (D.stays || []).forEach(function (x) {
          if (hit) return;
          var city = String(x.city).split(',')[0].trim().toLowerCase();
          if (city.length > 3 && low.indexOf(city) > -1) hit = [placeOf(x), city];
        });
      }
      if (hit) take('place', hit[0], hit[1]);
    })();
    /* when: a month, long or short */
    (function () {
      var hit = null;
      facetValues(FACETS[1]).forEach(function (v) {
        if (hit) return;
        var full = (MONTH_FULL[v] || v).toLowerCase();
        if (low.indexOf(full) > -1) hit = [v, full];
        else if (new RegExp('\\b' + v.toLowerCase() + '\\b').test(low)) hit = [v, v.toLowerCase()];
      });
      if (hit) take('month', hit[0], hit[1]);
    })();
    /* how long: "3 nights", "three nights", "a two night stay" */
    (function () {
      var WORDS = { one:'1', two:'2', three:'3', four:'4', five:'5' };
      var m = low.match(/\b(\d+|one|two|three|four|five)[\s-]*nights?\b/);
      if (!m) return;
      var n = WORDS[m[1]] || m[1];
      if (facetValues(FACETS[2]).indexOf(n) > -1) take('nights', n, m[0]);
    })();
    /* audience: the band a creator says they are in */
    (function () {
      var m = low.match(/\b(under\s*5k|5k\s*-\s*25k|25k\s*-\s*100k|100k\+?|100k plus)\b/);
      if (!m) return;
      var t = m[1].replace(/\s+/g, '');
      var pick = t.indexOf('under') === 0 ? 'Under 5K'
        : t.indexOf('100k') === 0 ? '100K+'
        : t.indexOf('25k-100k') === 0 ? '25K - 100K'
        : t.indexOf('5k-25k') === 0 ? '5K - 25K' : '';
      if (pick && BANDS.indexOf(pick) > -1) take('wants', pick, m[0]);
    })();

    vocab().forEach(function (n) {
      if (st.style !== 'all') return;
      /* match on either half of "Wellness & spa", so "wellness" is enough */
      var parts = n.toLowerCase().split(/\s*&\s*/);
      parts.forEach(function (p) {
        if (st.style === 'all' && p.length > 3 && low.indexOf(p) > -1) {
          st.style = n; st.why.style = p;
        }
      });
    });

    /* what the filter now carries is removed from the text, so the two do not
       narrow on the same word twice */
    if (st.style !== 'all') {
      st.style.split(/[\s&\/]+/).forEach(function (w) {
        if (w.length > 3) low = low.split(w.toLowerCase()).join(' ');
      });
    }
    /* and the connective words a sentence carries but a search should not */
    var left = low.replace(/\b(i|we|need|want|find|me|my|our|stays?|hotels?|content|who|that|shoot|shoots|for|a|an|the|in|on|with|and|fit|fits|are|is|before|after|next|somewhere|going|travelling|traveling|nights?|month|audience|around|during)\b/g, ' ')
                  .replace(/[^a-z0-9\s]/g, ' ')
                  .replace(/\s+/g, ' ').trim();

    /* What survives is checked against the stay list before it is allowed to
       narrow anything. A chip like "This would be my first hosted stay" leaves
       words no stay carries, and searching on them filters the whole list away
       over text that was never a query. */
    var corpus = (D.stays || []).map(function (s) {
      return (s.hotel + ' ' + s.city + ' ' + s.style + ' ' + (s.inc || '') + ' ' +
              (s.del || []).map(function (d) { return d.t; }).join(' ')).toLowerCase();
    }).join(' | ');
    st.q = left.split(' ').filter(function (w) {
      return w.length > 2 && corpus.indexOf(w) > -1;
    }).join(' ');
  }

  mount.addEventListener('click', function (e) {
    var t;

    var openEl = wantsOpen(e);
    if (openEl) { location.href = openHref(openEl); return; }

    /* a dropdown opens and closes without a re-render, same as in the app */
    if ((t = e.target.closest('[data-drop-toggle]'))) {
      var menu = t.parentElement.querySelector('.ukDropMenu');
      var open = t.getAttribute('aria-expanded') === 'true';
      mount.querySelectorAll('.ukDropMenu').forEach(function (m) { m.hidden = true; });
      mount.querySelectorAll('[data-drop-toggle]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
      if (menu && !open) { menu.hidden = false; t.setAttribute('aria-expanded', 'true'); }
      return;
    }

    if ((t = e.target.closest('[data-style]'))) { st.style = t.getAttribute('data-style'); st.pgStays = 1; return paint(); }
    if ((t = e.target.closest('[data-view]')))  { st.view  = t.getAttribute('data-view');  return paint(); }
    /* the card's "+N" and its panel. The app answers these in ukcapp.js, which
       is the signed-in shell and not loaded here, so the badge did nothing. */
    if ((t = e.target.closest('[data-staypop]'))) {
      var key = t.getAttribute('data-staypop');
      st.stayPop = st.stayPop === key ? null : key;
      return paint();
    }
    if (e.target.closest('[data-staypop-close]')) { st.stayPop = null; return paint(); }
    if ((t = e.target.closest('[data-clearf]'))){
      st.style = 'all'; st.q = ''; st.wants = 'all';
      FACETS.forEach(function (f) { st[f.k] = 'all'; });
      st.pgStays = 1; return paint();
    }
    /* every added menu answers through one attribute, "facet:value" */
    if ((t = e.target.closest('[data-facet]'))) {
      var fv = String(t.getAttribute('data-facet')).split(':');
      st[fv[0]] = fv.slice(1).join(':');
      st.edited = true; st.pgStays = 1;
      return paint();
    }
    /* the app pages as "key:n" through one attribute */
    if ((t = e.target.closest('[data-page]'))) {
      var v = String(t.getAttribute('data-page') || '').split(':');
      st.pgStays = Number(v[1] || v[0]) || 1;
      return paint();
    }
    /* the map's pins select a stay the way they do in the app */
    if ((t = e.target.closest('[data-pin]'))) { st.pin = t.getAttribute('data-pin'); return paint(); }
  });

  /* Enter or Space on a focused card, the same as in the app */
  mount.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var el = e.target.closest && e.target.closest('[data-open]');
    if (!el || !el.getAttribute('data-open')) return;
    e.preventDefault();
    location.href = openHref(el);
  });

  /* clicking outside closes any open dropdown, as the app's shell does */
  document.addEventListener('click', function (e) {
    if (mount.contains(e.target)) return;
    mount.querySelectorAll('.ukDropMenu').forEach(function (m) { m.hidden = true; });
    mount.querySelectorAll('[data-drop-toggle]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
  });

  /* the band sits outside the mount, so its form is bound on the document */
  /* the readout sits under the search field, outside the mount */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-unset]');
    if (!t) return;
    var kind = t.getAttribute('data-unset');
    st.edited = true;
    if (kind === 'all') {
      st.style = 'all'; st.q = ''; st.why = {}; st.wants = 'all';
      FACETS.forEach(function (f) { st[f.k] = 'all'; });
    }
    else if (kind === 'style') { st.style = 'all'; if (st.why) st.why.style = null; }
    else if (kind === 'q') { st.q = ''; }
    else if (st[kind] !== undefined) { st[kind] = 'all'; if (st.why) st.why[kind] = null; }
    st.pgStays = 1;
    paint();
  });

  document.addEventListener('submit', function (e) {
    var f = e.target.closest('[data-pub-search]');
    if (!f) return;
    e.preventDefault();
    var input = f.querySelector('[data-ask-q], [data-pub-q]');
    st.rawQ = input ? input.value : '';
    st.edited = false;
    applyQuery(st.rawQ);
    st.pgStays = 1;
    paint();
  });

  /* a search handed over from the hero lands here as ?q= and is read the same
     way a search typed on this page is */
  /* read the sentence every time, not only when no style is set: skipping it on
     a reload left st.q as the whole sentence instead of the words the style did
     not take, which matched nothing and dropped the page onto its fallback. */
  if (st.rawQ) {
    applyQuery(st.rawQ);
    if (st.edited) {
      /* the filter was touched by hand, so the URL is the whole truth about it:
         a value missing from it was removed, not simply never derived */
      st.style = urlStyle || 'all';
      if (st.style === 'all' && st.why) st.why.style = null;
      FACETS.concat([{ k:'wants' }]).forEach(function (f) {
        st[f.k] = urlFacets[f.k] || 'all';
        if (st[f.k] === 'all' && st.why) st.why[f.k] = null;
      });
    } else {
      if (urlStyle) st.style = urlStyle;
      FACETS.concat([{ k:'wants' }]).forEach(function (f) {
        if (urlFacets[f.k]) st[f.k] = urlFacets[f.k];
      });
    }
  } else {
    st.why = {};
  }
  /* the sentence that was typed into the hero comes up in the field here too,
     so the page opens on the search rather than on an empty box */
  (function prefill() {
    var i = document.querySelector('[data-pub-search] [data-ask-q]');
    if (i && st.rawQ) i.value = st.rawQ;
  })();
  paint();

  /* the CTA under the results says how many there are in total, off the same
     list the grid is drawn from */
  (function total() {
    var el = document.querySelector('[data-pub-total]');
    if (el) el.textContent = (D.stays || []).length;
  })();
})();
