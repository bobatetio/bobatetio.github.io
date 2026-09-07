/* Ukreate — the public Creators screen.

   Not a public lookalike of the app's directory: it IS the app's directory.
   window.UKV.network(st) is the same function /app/ calls to draw Find
   Creators, and it returns the whole screen — the "Creators" heading and its
   subhead, the All / Available / Saved tabs, the They make / Content type /
   Platform dropdowns, the Grid / List / Map switcher, the card grid and its
   pagination. This file renders that, keeps the same state object the app
   keeps, and re-renders on the same data attributes the app's own handlers
   read, because those handlers live in ukapp.js and ukapp.js is the signed-in
   shell.

   Two things differ, and only two:

   1. Every control that would write is rewritten to a signup link. Invite,
      save and the profile link cannot act for somebody with no account, so
      they ask for one instead. Nothing is hidden; the wall is on the action.
   2. Availability's "Saved" tab reads an empty shortlist, because a shortlist
      belongs to an account. It stays visible and says so.

   The app is not modified. */
(function () {
  var D = window.UK, V = window.UKV;
  var mount = document.querySelector('[data-pub-network]');
  if (!D || !V || !mount) return;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; });
  }

  /* the app's own state shape for this screen */
  var st = { view:'grid', avail:'all', niche:[], plat:[], makes:[], q:'', pgCr:1 };

  /* what the URL carried, kept aside: a filter that is in the URL was either
     derived from the sentence or toggled by hand, and either way it wins over
     what the sentence would derive again. */
  var urlF = { niche:null, plat:null, makes:null, avail:null };
  (function readUrl() {
    var p = new URLSearchParams(location.search);
    st.rawQ = p.get('q') || '';
    st.q = st.rawQ;
    st.view = p.get('view') || 'grid';
    st.avail = p.get('avail') || 'all';
    urlF.avail = p.get('avail');
    /* edit=1 says the filters in this URL were touched by hand. Without it a
       reload re-derives them from the sentence and every removal comes back. */
    st.edited = p.get('edit') === '1';
    ['niche','plat','makes'].forEach(function (k) {
      var v = p.get(k);
      if (v) { st[k] = v.split('|').filter(Boolean); urlF[k] = st[k].slice(); }
    });
    st.pgCr = Number(p.get('page') || 1) || 1;
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
    if (st.avail !== 'all') p.set('avail', st.avail);
    ['niche','plat','makes'].forEach(function (k) { if (st[k].length) p.set(k, st[k].join('|')); });
    if (st.pgCr > 1) p.set('page', st.pgCr);
    if (st.edited) p.set('edit', '1');
    var qs = p.toString();
    history.replaceState(null, '', qs ? '?' + qs : location.pathname);
  }

  /* ---- the gate: rewrite the three controls that would write ---- */
  function gate(html) {
    html = html.replace(
      /<button class="ukBtn ukBtn--sm" type="button" data-invite-open="([^"]*)">Invite creator<\/button>/g,
      function (m, id) {
        return '<a class="ukBtn ukBtn--sm" href="/join/?side=hotel&amp;creator=' + esc(id) + '">Invite creator</a>';
      });
    html = html.replace(
      /<button class="ukGhost ukGhost--sm" type="button" data-creator="([^"]*)">View profile<\/button>/g,
      function (m, id) {
        return '<a class="ukGhost ukGhost--sm" href="/find-creators/' + esc(id) + '/">View profile</a>';
      });
    /* the whole element in one pass: rewriting only the opening tag leaves an
       unclosed anchor that swallows the rest of the card */
    html = html.replace(
      /<button class="ukFav[^"]*" type="button" data-fav="([^"]*)"[^>]*>([\s\S]*?)<\/button>/g,
      function (m, id, inner) {
        return '<a class="ukFav" href="/join/?side=hotel" title="Save this creator" ' +
               'aria-label="Save this creator">' + inner + '</a>';
      });
    return html;
  }

  /* ---- no dead ends ----
     V.network() runs the app's own match(), and the app is entitled to return
     nothing: a signed-in hotel that filters itself into a corner knows why. A
     visitor does not, and an empty grid is the worst screen a public directory
     can show. So the exact set is measured with the same predicate the app
     uses, and when it comes back under the floor the nearest creators are
     rendered after it, with the same V.creatorCard(), under a heading that says
     plainly they are close rather than exact. Nothing is relabelled: the app's
     own count and filters are untouched above. */
  var FLOOR = 20;

  /* the predicate from ukcreators.js match(), field for field */
  function exactSet() {
    var q = (st.q || '').toLowerCase();
    var niches = st.niche.length ? st.niche : null;
    var plats  = st.plat.length  ? st.plat  : null;
    var makes  = st.makes.length ? st.makes : null;
    return D.creators.filter(function (c) {
      if (q && (c.n + ' ' + c.loc + ' ' + c.type).toLowerCase().indexOf(q) < 0) return false;
      if (niches && !(c.cats || [c.type]).some(function (t) { return niches.indexOf(t) > -1; })) return false;
      if (plats && !(c.plats || []).some(function (p) { return plats.indexOf(p.k) > -1; })) return false;
      if (makes && !(c.makes || []).some(function (m) { return makes.indexOf(m) > -1; })) return false;
      if (st.avail === 'now' && String(c.free || '').indexOf('Available') < 0) return false;
      if (st.avail === 'fav') return false;
      return true;
    });
  }
  function nearness(c) {
    var n = 0;
    if (st.niche.length && (c.cats || [c.type]).some(function (t) { return st.niche.indexOf(t) > -1; })) n += 3;
    if (st.makes.length && (c.makes || []).some(function (m) { return st.makes.indexOf(m) > -1; })) n += 2;
    if (st.plat.length  && (c.plats || []).some(function (p) { return st.plat.indexOf(p.k) > -1; })) n += 2;
    if (st.avail === 'now' && String(c.free || '').indexOf('Available') > -1) n += 2;
    if (st.q && (c.n + ' ' + c.loc + ' ' + c.type).toLowerCase().indexOf(st.q.toLowerCase()) > -1) n += 3;
    return n + Math.min(Number(c.rating) || 0, 5) / 10;
  }

  function topUp() {
    var exact = exactSet();
    if (exact.length >= FLOOR) return;
    /* When nothing matched at all, network() draws its empty panel and no grid,
       so there is nothing to append to. The panel comes out and the nearest
       block takes its place. List and map draw their own way and are left be. */
    var grid = mount.querySelector('.ukCrGrid');
    var empty = mount.querySelector('.ukEmpty');
    if (!grid && !empty) return;
    if (!grid && empty && st.view !== 'grid') return;
    var seen = {};
    exact.forEach(function (c) { seen[c.id] = 1; });
    var rest = D.creators.filter(function (c) { return !seen[c.id]; })
      .sort(function (a, b) { return nearness(b) - nearness(a); })
      .slice(0, FLOOR - exact.length);
    if (!rest.length) return;

    /* Into the same grid, not a second one under it.
       A separate .ukCrGrid closes the first grid's last row wherever it happens
       to end, so a search with one exact match rendered that card alone on a
       full-width row with twenty more starting a fresh grid below it. Nothing
       about the set changes: the exact matches still lead, the nearest follow in
       the same order. They simply keep flowing across the row. */
    var html = gate(rest.map(function (c, i) { return V.creatorCard(c, exact.length + i); }).join(''));
    if (grid) {
      grid.insertAdjacentHTML('beforeend', html);
    } else {
      /* the empty state sits inside its own panel, which is dashed and centred
         and would style the grid that replaces it; the whole panel goes, not
         just the message inside it */
      var box = empty.closest('.ukPanel') || empty;
      var made = document.createElement('div');
      made.className = 'ukCrGrid';
      made.innerHTML = html;
      box.insertAdjacentElement('beforebegin', made);
      box.remove();
    }
  }

  /* ---- the map view ----
     network() renders the map's slot and its points but never draws: in the app
     that is the shell's job (mountCrMap in ukapp.js). Same three steps here. */
  var crMap = null, crMapHost = null;
  function mountMap() {
    var slot = mount.querySelector('[data-crmap]');
    if (!slot || !window.UKWORLDMAP) return;
    if (!crMapHost) {
      crMapHost = document.createElement('div');
      crMapHost.className = 'ukMap';
      crMapHost.setAttribute('aria-hidden', 'true');
    }
    if (crMapHost.parentNode !== slot) slot.appendChild(crMapHost);
    var pts = [];
    try { pts = JSON.parse(slot.getAttribute('data-crmap') || '[]'); } catch (e) { pts = []; }
    if (!crMap) crMap = window.UKWORLDMAP.mount(crMapHost, { lat: 0, lng: 0, zoom: 1 });
    else if (crMap.resume) crMap.resume();
    if (!crMap) return;
    if (crMap.pins) crMap.pins(pts);
    var sel = pts.filter(function (p) { return p.on; })[0];
    if (crMap.fit) crMap.fit(sel ? [sel] : pts);
  }

  /* ---- the signup banner ----
     Dropped into the grid after the third row, so it arrives once the visitor
     has actually seen the network rather than on top of it. Grid only: the
     list has its own rhythm and the map is a single frame. */
  function bannerBody() {
    return '<div class="ukPubBanner_b">' +
        '<p class="ukPubBanner_t">Create a free account to invite any of these creators</p>' +
        '<p class="ukPubBanner_p">Browsing is open to everyone. An account is what sends the invitation.</p>' +
      '</div>' +
      '<div class="ukPubBanner_a"><a class="btn btn--gold" href="/join/?side=hotel">' +
      '<strong class="btnRoll"><span data-hover="Set up your property"><em>Set up your property</em></span>' +
      '</strong></a></div>';
  }
  function banner() {
    /* List and map get the same row, under the view rather than inside it:
       a table cannot take a grid child, and the map is one frame. */
    if (st.view !== 'grid') {
      var host = mount.querySelector('.ukTableWrap') || mount.querySelector('.ukMapSlot');
      if (!host || mount.querySelector('.ukPubBanner')) return;
      var el2 = document.createElement('div');
      el2.className = 'ukPubBanner ukPubBanner--wide';
      el2.style.setProperty('--uk-banner-img', "url('/assets/img/hero/hero-hotels.jpg?v=1')");
      el2.innerHTML = bannerBody();
      (host.closest('.ukPanel') || host).insertAdjacentElement('afterend', el2);
      return;
    }
    var grid = mount.querySelector('.ukCrGrid');
    if (!grid || st.view !== 'grid') return;
    if (grid.querySelector('.ukPubBanner')) return;
    var cards = grid.querySelectorAll('.ukCrCard');
    var cols = getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length || 3;
    var after = cards[cols * 3 - 1];
    if (!after) return;
    var el = document.createElement('div');
    el.className = 'ukPubBanner';
    /* the same photograph this page's hero runs */
    el.style.setProperty('--uk-banner-img', "url('/assets/img/hero/hero-hotels.jpg?v=1')");
    el.innerHTML = bannerBody();
    after.insertAdjacentElement('afterend', el);
  }

  /* List and map are drawn entirely by network(), so a grid-only top-up left
     them on the app's empty state. Rather than patch three views three ways,
     the state itself relaxes: if the current filters return nothing, the free
     text is dropped for the render, and if that is still nothing the narrowest
     filter goes too. The input and the URL keep what was typed; only what is
     matched on is widened, and the grid's top-up handles the rest. */
  function relax() {
    var undo = [];
    if (exactSet().length) return undo;
    if (st.q) { undo.push(['q', st.q]); st.q = ''; }
    var order = ['makes', 'plat', 'niche'];
    for (var i = 0; i < order.length && !exactSet().length; i++) {
      var k = order[i];
      if (st[k].length) { undo.push([k, st[k]]); st[k] = []; }
    }
    return undo;
  }
  function restore(undo) {
    undo.forEach(function (pair) { st[pair[0]] = pair[1]; });
  }


  /* ---- the readout ----
     A search that quietly sets three filters and shows you a grid is asking to
     be trusted. This says what it did: every filter it read out of the sentence,
     the words that caused it, and an x on each one. What it could not read is
     said too, because "we matched nothing so this is everyone" is a fact the
     visitor needs in order to know the grid is not an answer. */
  function platMeta(k) {
    return (V.PLATFORMS || []).filter(function (p) { return p.k === k; })[0] || { k:k, n:k };
  }
  function chip(kind, value, label, mark) {
    /* avail records a single phrase, the other three record one per value */
    var why = kind === 'avail'
      ? ((st.why && st.why.avail) || '')
      : ((st.why && st.why[kind] && st.why[kind][value]) || '');
    var KIND = { niche:'Content type', makes:'They make', plat:'Platform', avail:'Availability', q:'Keywords' }[kind];
    return '<span class="ukRead_chip' + (why ? ' is-auto' : '') + '"' +
      (why ? ' title="Read from &quot;' + esc(why) + '&quot; in your search"' : ' title="You set this"') + '>' +
      '<b class="ukRead_k">' + esc(KIND) + '</b>' +
      (mark ? '<img class="ukRead_ico" src="' + mark + '" alt="" width="14" height="14" decoding="async">' : '') +
      '<span class="ukRead_v">' + esc(label) + '</span>' +
      '<button class="ukRead_x" type="button" data-unset="' + kind + '" data-unset-v="' + esc(value) + '" ' +
      'aria-label="Remove ' + esc(KIND) + ' ' + esc(label) + '">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true">' +
      '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button></span>';
  }
  function readout(undo) {
    var slot = document.querySelector('[data-pub-read]');
    if (!slot) return;
    var chips = [];
    st.makes.forEach(function (m) { chips.push(chip('makes', m, m, null)); });
    st.niche.forEach(function (n) { chips.push(chip('niche', n, n, null)); });
    st.plat.forEach(function (k) { var m = platMeta(k); chips.push(chip('plat', k, m.n, m.s)); });
    if (st.avail === 'now') chips.push(chip('avail', 'now', 'Free to travel now', null));
    if (st.q) chips.push(chip('q', st.q, st.q, null));

    /* Nothing to say and nothing to show: the row stays out of the way rather
       than sitting under the field as an empty band. */
    if (!chips.length && !st.rawQ) { slot.hidden = true; slot.innerHTML = ''; return; }

    var note = '';
    if (!chips.length) {
      note = st.edited
        ? 'Every filter is off, so this is the whole network.'
        : 'We could not match your wording to a filter, so this is the whole network.';
    } else if (undo && undo.length) {
      var names = { q:'the keywords', makes:'They make', niche:'Content type', plat:'Platform' };
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

  /* The heading says what is on the page, not what the page is called: how many
     creators this search actually returned, and what narrowed it. */
  function headline() {
    var el = document.querySelector('[data-pub-head]');
    if (!el) return;
    var n = exactSet().length;
    var niche = st.niche.length === 1 ? st.niche[0].toLowerCase() : '';
    var plat = st.plat.length === 1 ? platName(st.plat[0]) : '';
    var txt;
    if (!n) {
      txt = 'No creator matches that yet';
    } else if (st.niche.length || st.plat.length || st.makes.length || st.q || st.avail === 'now') {
      txt = n + (niche ? ' ' + niche : '') + (n === 1 ? ' creator' : ' creators') +
        (plat ? ' on ' + plat : '') + ' for your search';
    } else {
      txt = (D.creators || []).length + ' vetted creators ready to travel';
    }
    el.textContent = txt;
  }
  function platName(k) {
    var m = ((V && V.PLATFORMS) || []).filter(function (p) { return p.k === k; })[0];
    return m ? m.n : k;
  }

  function paint() {
    var undo = relax();
    mount.innerHTML = gate(V.network(st));
    restore(undo);
    topUp();
    /* The screen's own heading and ask slot come out: both moved up into the
       band above, which is where the app puts them too (its heading sits in the
       page frame and its ask bar is mounted from the shell). */
    var ph = mount.querySelector('.ukPageHead'); if (ph) ph.remove();
    var slot = mount.querySelector('.ukCrFind'); if (slot) slot.remove();
    /* All / Available / Saved goes: two of the three depend on an account, and
       a visitor browsing without one is only ever looking at "all". With it
       gone the filters and the view switcher take the whole row. */
    var tabs = mount.querySelector('.ukFilters--tabs'); if (tabs) tabs.remove();
    var gap = mount.querySelector('.ukCrBar_gap'); if (gap) gap.remove();
    /* No pager on a public feed. The app pages a signed-in list; here the grid
       is a first look and the sign-up under it is how you see the rest, so the
       nav and its "Showing 1-12 of N" line both come out. */
    mount.querySelectorAll('.ukPage').forEach(function (n) { n.remove(); });
    readout(undo);
    mountMap();
    banner();
    headline();
    writeUrl();
  }

  /* ---- the search sets the filters ----
     Typing "creators in Lisbon who shoot wellness on TikTok" should arrive with
     those filters already on, not with a blind text match. The query is read
     against the same three vocabularies the dropdowns are built from, so a term
     that names a filter selects it and is dropped from the free text; whatever
     is left over stays as the text search. */
  function vocab() {
    var niches = D.creators.reduce(function (a, c) {
      (c.cats || [c.type]).forEach(function (t) { if (t && a.indexOf(t) < 0) a.push(t); });
      return a; }, []);
    var makes = {};
    D.creators.forEach(function (c) { (c.makes || []).forEach(function (m) { makes[m] = 1; }); });
    var plats = (V.PLATFORMS || []).slice();
    return { niches: niches, makes: Object.keys(makes), plats: plats };
  }
  /* ---- what a sentence actually means ----
     The vocabularies alone only catch a search that already speaks in filter
     names. Nobody types "Food & drink"; they type "we are relaunching our
     rooftop". These are the words a hotel uses for each filter value, so the
     sentence lands on a filter instead of on nothing. Every hit is recorded
     with the phrase that caused it, shown on screen, and removable. */
  var SAYS = {
    niche: {
      'Food & drink': ['rooftop','roof top','restaurant','bar','bistro','dining','diner','chef','menu','brunch','breakfast','cocktail','food','drinks','tasting','culinary','cuisine','wine','coffee','kitchen'],
      'Wellness & spa': ['spa','wellness','retreat','yoga','sauna','massage','thermal','detox','hammam','pilates','mindful'],
      'Luxury & design': ['luxury','luxurious','design','designer','suite','suites','boutique','five star','5 star','premium','upscale','interiors','interior','architecture','architect','penthouse','villa','high end'],
      'Nightlife & events': ['nightlife','club','clubbing','dj','party','parties','festival','event','events','live music','rooftop bar'],
      'Family travel': ['family','families','kids','children','child friendly','playground','toddler'],
      'Couples & honeymoon': ['couple','couples','honeymoon','romantic','romance','wedding','anniversary','proposal'],
      'Adventure & outdoors': ['adventure','hiking','hike','trekking','surf','surfing','kayak','diving','climbing','trail','outdoor','outdoors','cycling','biking'],
      'Beach & islands': ['beach','beachfront','island','islands','coast','coastal','seaside','shore','ocean','sea view','resort'],
      'Mountain & ski': ['ski','skiing','snowboard','mountain','mountains','alpine','slopes','chalet','snow'],
      'Nature & wildlife': ['safari','wildlife','nature','forest','jungle','national park','birding','lake','waterfall'],
      'Culture & city': ['city','citybreak','city break','culture','cultural','museum','urban','downtown','heritage','historic','art','gallery','old town'],
      'Eco & sustainable': ['eco','sustainable','sustainability','green','off grid','carbon','regenerative','farm'],
      'Digital nomad & remote work': ['nomad','nomads','coworking','co working','remote work','workation','long stay','laptop'],
      'Road trips': ['road trip','roadtrip','van life','vanlife','campervan','driving route','self drive'],
      'Solo travel': ['solo','solo traveller','solo traveler','travelling alone'],
      'Budget & backpacking': ['budget','backpacker','backpacking','hostel','affordable','cheap','value']
    },
    makes: {
      'Reels': ['reel','reels','short form','shortform','shorts','vertical video','short video'],
      'UGC video': ['ugc','user generated','testimonial','authentic video','native video'],
      'Photos': ['photo','photos','photography','photographer','stills','images','imagery','shots','shoot the'],
      'B-roll': ['b roll','b-roll','broll','cutaway','cutaways','footage','clips'],
      'Stories': ['story','stories','instagram story'],
      'Carousels': ['carousel','carousels','photo dump','swipe post'],
      'Drone & aerial': ['drone','aerial','birds eye','fpv','overhead shots','from above'],
      'Long-form / YouTube': ['long form','longform','vlog','vlogs','documentary','youtube video','review video']
    },
    plat: {
      ig: ['instagram','insta','the gram','ig'],
      tt: ['tiktok','tik tok','tt'],
      yt: ['youtube','you tube','yt'],
      pi: ['pinterest','pins','pin boards']
    }
  };
  /* a deadline is a filter too: it decides who can even come */
  var SOON = ['before opening','before we open','opening','open soon','opening soon','relaunch','re launch','relaunching','launch','launching','asap','as soon as possible','urgent','urgently','immediately','right away','short notice','next week','this month','in a few weeks','straight away','available now'];

  function hit(low, phrase) {
    var i = low.indexOf(phrase);
    while (i > -1) {
      var before = i === 0 ? ' ' : low.charAt(i - 1);
      var after = low.charAt(i + phrase.length) || ' ';
      if (!/[a-z0-9]/.test(before) && !/[a-z0-9]/.test(after)) return true;
      i = low.indexOf(phrase, i + 1);
    }
    return false;
  }

  function applyQuery(raw) {
    var q = String(raw || '');
    var low = ' ' + q.toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ') + ' ';
    var vb = vocab();
    st.niche = []; st.plat = []; st.makes = [];
    /* why[kind][value] = the words in the sentence that chose it */
    st.why = { niche:{}, makes:{}, plat:{}, avail:null };
    var used = [];

    function take(kind, value, phrase) {
      if (st[kind].indexOf(value) < 0) st[kind].push(value);
      var w = st.why[kind][value];
      if (!w) st.why[kind][value] = phrase;
      else if (w.indexOf(phrase) < 0) st.why[kind][value] = w + ', ' + phrase;
      used.push(phrase);
    }

    /* 1. the filter's own name, said outright */
    vb.niches.forEach(function (n) {
      n.toLowerCase().split(/\s*&\s*/).forEach(function (part) {
        if (part.length > 3 && hit(low, part)) take('niche', n, part);
      });
    });
    vb.makes.forEach(function (m) {
      var key = m.toLowerCase().split(/\s*\/\s*/)[0].trim().replace(/[^a-z0-9]+/g, ' ');
      if (key.length > 2 && hit(low, key)) take('makes', m, key);
    });
    vb.plats.forEach(function (p) {
      if (hit(low, String(p.n).toLowerCase())) take('plat', p.k, String(p.n).toLowerCase());
    });

    /* 2. the words a hotel actually uses for it */
    Object.keys(SAYS.niche).forEach(function (n) {
      if (vb.niches.indexOf(n) < 0) return;
      SAYS.niche[n].forEach(function (w) { if (hit(low, w)) take('niche', n, w); });
    });
    Object.keys(SAYS.makes).forEach(function (m) {
      if (vb.makes.indexOf(m) < 0) return;
      SAYS.makes[m].forEach(function (w) { if (hit(low, w)) take('makes', m, w); });
    });
    var pk = {}; vb.plats.forEach(function (p) { pk[p.k] = 1; });
    Object.keys(SAYS.plat).forEach(function (k) {
      if (!pk[k]) return;
      SAYS.plat[k].forEach(function (w) { if (hit(low, w)) take('plat', k, w); });
    });

    /* 3. a deadline sets availability, unless the URL already carried one */
    if (!urlF.avail) {
      st.avail = 'all';
      for (var i = 0; i < SOON.length; i++) {
        if (hit(low, SOON[i])) { st.avail = 'now'; st.why.avail = SOON[i]; used.push(SOON[i]); break; }
      }
    }

    /* what the filters now carry comes out of the free text, so the two do not
       narrow on the same word twice */
    var strip = used.concat(st.niche, st.makes,
      vb.plats.filter(function (p) { return st.plat.indexOf(p.k) > -1; }).map(function (p) { return p.n; }));
    strip.forEach(function (t) {
      String(t).toLowerCase().split(/[^a-z0-9]+/).forEach(function (w) {
        if (w.length > 2) low = low.split(w).join(' ');
      });
    });
    /* and the connective words a sentence carries but a search should not */
    var left = low.replace(/\b(i|we|need|needs|needed|want|find|me|our|us|your|creators?|content|who|that|shoot|shoots|for|a|an|the|in|on|at|to|of|with|and|or|fit|fits|are|is|be|before|after|next|my|some|new|lots|more|really|just)\b/g, ' ')
                  .replace(/[^a-z0-9\s]/g, ' ')
                  .replace(/\s+/g, ' ').trim();

    /* What survives is checked against the roster before it is allowed to
       narrow anything. A sentence like "we are relaunching our rooftop" leaves
       words no creator carries, and searching on them would filter the whole
       network away over text that was never a query. */
    var corpus = D.creators.map(function (c) {
      return (c.n + ' ' + c.loc + ' ' + c.type + ' ' +
              (c.cats || []).join(' ') + ' ' +
              (c.markets || []).map(function (m) { return m.n; }).join(' ')).toLowerCase();
    }).join(' | ');
    st.q = left.split(' ').filter(function (w) {
      return w.length > 2 && corpus.indexOf(w) > -1;
    }).join(' ');
    st.why.q = st.q;
  }

  function toggle(arr, v) {
    var i = arr.indexOf(v);
    if (i > -1) arr.splice(i, 1); else arr.push(v);
  }

  /* forget that the sentence chose this, so the chip stops reading as automatic
     and a reload does not derive it back */
  function unwhy(kind, v) {
    if (st.why && st.why[kind] && v != null) delete st.why[kind][v];
  }

  mount.addEventListener('click', function (e) {
    var t;


    /* a dropdown opens and closes without a re-render, same as in the app */
    if ((t = e.target.closest('[data-drop-toggle]'))) {
      var menu = t.parentElement.querySelector('.ukDropMenu');
      var open = t.getAttribute('aria-expanded') === 'true';
      mount.querySelectorAll('.ukDropMenu').forEach(function (m) { m.hidden = true; });
      mount.querySelectorAll('[data-drop-toggle]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
      if (menu && !open) { menu.hidden = false; t.setAttribute('aria-expanded', 'true'); }
      return;
    }

    if ((t = e.target.closest('[data-avail]'))) { st.avail = t.getAttribute('data-avail'); st.edited = true; if (st.why) st.why.avail = null; st.pgCr = 1; return paint(); }
    if ((t = e.target.closest('[data-view]')))  { st.view  = t.getAttribute('data-view');  return paint(); }
    if ((t = e.target.closest('[data-page]')))  { st.pgCr  = Number(t.getAttribute('data-page')) || 1; return paint(); }

    ['niche','plat','makes'].forEach(function (k) {
      var el = e.target.closest('[data-' + k + ']');
      if (!el) return;
      var v = el.getAttribute('data-' + k);
      st.edited = true;
      if (v === 'all') { st[k] = []; if (st.why) st.why[k] = {}; }
      else { toggle(st[k], v); if (st[k].indexOf(v) < 0) unwhy(k, v); }
      st.pgCr = 1;
      paint();
    });
  });


  /* the readout sits under the search field, outside the mount, so its
     x buttons and its clear all are bound on the document */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-unset]');
    if (!t) return;
    var kind = t.getAttribute('data-unset');
    var v = t.getAttribute('data-unset-v');
    st.edited = true;
    if (kind === 'all') {
      st.niche = []; st.plat = []; st.makes = []; st.avail = 'all'; st.q = '';
      st.why = { niche:{}, makes:{}, plat:{}, avail:null };
    } else if (kind === 'avail') {
      st.avail = 'all'; if (st.why) st.why.avail = null;
    } else if (kind === 'q') {
      st.q = '';
    } else {
      var i = st[kind].indexOf(v);
      if (i > -1) st[kind].splice(i, 1);
      unwhy(kind, v);
    }
    st.pgCr = 1;
    paint();
  });

  /* Opening a profile is the app shell's job, and the shell is not here. The
     grid's own button is rewritten to a link by gate(), but the list's rows and
     the map's pins carry data-creator and did nothing at all. */
  mount.addEventListener('click', function (e) {
    if (e.target.closest('a, button, [data-drop-toggle], [data-view], [data-avail], [data-page]')) return;
    var t = e.target.closest('[data-creator], [data-mappin]');
    if (!t) return;
    var id = t.getAttribute('data-creator') || t.getAttribute('data-mappin');
    if (id) location.href = '/find-creators/' + id + '/';
  });
  mount.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var t = e.target.closest('[data-creator], [data-mappin]');
    if (!t) return;
    e.preventDefault();
    var id = t.getAttribute('data-creator') || t.getAttribute('data-mappin');
    if (id) location.href = '/find-creators/' + id + '/';
  });

  /* clicking outside closes any open dropdown, as the app's shell does */
  document.addEventListener('click', function (e) {
    if (mount.contains(e.target)) return;
    mount.querySelectorAll('.ukDropMenu').forEach(function (m) { m.hidden = true; });
    mount.querySelectorAll('[data-drop-toggle]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
  });

  /* the band sits outside the mount, so its form is bound on the document */
  document.addEventListener('submit', function (e) {
    var f = e.target.closest('[data-pub-search]');
    if (!f) return;
    e.preventDefault();
    var input = f.querySelector('[data-ask-q], [data-pub-q]');
    st.rawQ = input ? input.value : '';
    /* a new sentence is read fresh: whatever was removed by hand belonged to
       the search before it */
    st.edited = false;
    urlF.avail = null;
    applyQuery(st.rawQ);
    st.pgCr = 1;
    paint();
  });

  /* a search handed over from the hero lands here as ?q= and is read the same
     way a search typed on this page is */
  /* The sentence is always read, not only when the URL has no filters. It used
     to be skipped once niche/plat were in the URL, which meant that on a reload
     st.q stayed the whole sentence rather than the few words left after the
     filters took their share, and matching on it emptied the results: the same
     search that showed five creators on arrival came back as "nothing matched"
     after a refresh. applyQuery runs first so the residue is right, then the
     URL's own filters are put back over the top. */
  if (st.rawQ) {
    applyQuery(st.rawQ);
    if (st.edited) {
      /* the filters were touched by hand, so the URL is the whole truth about
         them: a value missing from it was removed, not simply never derived */
      ['niche','plat','makes'].forEach(function (k) { st[k] = urlF[k] || []; });
      st.avail = urlF.avail || 'all';
      if (st.why) st.why.avail = st.avail === 'now' ? st.why.avail : null;
      ['niche','plat','makes'].forEach(function (k) {
        Object.keys(st.why[k]).forEach(function (v) { if (st[k].indexOf(v) < 0) delete st.why[k][v]; });
      });
    } else {
      ['niche','plat','makes'].forEach(function (k) { if (urlF[k]) st[k] = urlF[k]; });
    }
  } else {
    st.why = { niche:{}, makes:{}, plat:{}, avail:null };
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
    if (el) el.textContent = (D.creators || []).length;
  })();
})();
