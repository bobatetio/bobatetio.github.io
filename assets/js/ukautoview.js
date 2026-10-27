/* Ukreate — auto mode, the screens. Hotel side.

   Built from the hotel app's own parts: head(), the .ukK tiles, .ukCard and
   .ukPanel, the tab strip, .ukSteps, .ukNum, .ukSwitch, .ukSeg, .ukTag, the post
   card and UKCHART. What is new here is only what did not exist: the
   measured / estimate label, the arrival card, the activity log and the limits.

   Everything reads UKAUTO.model(), so a number on one tab is the same number on
   every other. The reader is a general manager or a front desk lead, so the
   words are theirs: empty nights, creator stays, we listed these rooms. */
(function () {
  var A = window.UKAUTO, D = window.UK, V = window.UKV;
  var root = document.querySelector('[data-ukapp]');
  if (!A || !V || !root) return;
  var F = A.fmt;

  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; }); };
  function repaint() { if (window.UKREPAINT) window.UKREPAINT(); }

  function av(cr, cls) {
    return V.who(cr, '<img class="ukAu_av' + (cls ? ' ' + cls : '') + '" src="' + cr.img + '" alt="' + esc(cr.n) + '" loading="lazy" decoding="async">');
  }
  /* the honesty label: a measured figure and a modelled one never look alike */
  function src(k) {
    return k === 'e'
      ? '<span class="ukSrc ukSrc--e" title="Worked out from your calendar, not counted">Estimate</span>'
      : '<span class="ukSrc ukSrc--m" title="Counted from real records">Measured</span>';
  }
  function tile(o) {
    return '<article class="ukK c' + (o.c || 3) + '">' +
      '<p class="ukK_l">' + esc(o.l) + '</p>' +
      '<p class="ukK_v' + (o.muted ? ' ukK_v--none' : '') + '">' + o.v + '</p>' +
      '<p class="ukK_n">' + (o.src ? src(o.src) : '') + '<span>' + esc(o.n) + '</span></p>' +
      (o.tab ? '<button class="ukK_go" type="button" data-tab="' + o.tab + '" aria-label="Open ' + esc(o.l) + '">' +
        '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' : '') +
      '</article>';
  }
  function cap(t) { return t.charAt(0).toUpperCase() + t.slice(1); }
  function roomDates(o) { return A.ROOM[o.room].n + ', ' + F.range(o.from, o.n); }

  /* ================= the page ================= */
  function auto(s) {
    var S = A.state();
    /* a notification can ask for a tab by name */
    if (s.thread) { s.tab = s.thread; s.thread = null; }
    /* one wrapper for every auto mode screen, so the spacing between stacked
       cards is set once instead of being forgotten card by card */
    var body = (S.mode === 'off' || S.conn === 'none' || S.conn === 'requested')
      ? setup(s, S) : running(s, S);
    return '<div class="ukAuPage">' + body + '</div>';
  }

  function powerSwitch(S) {
    var on = S.mode === 'on';
    return '<div class="ukAuPower">' +
      '<span class="ukAuPower_t"><span class="ukAuPower_l">Auto mode</span>' +
        '<span class="ukAuPower_s">' + (on ? 'On' : 'Paused') + '</span></span>' +
      '<button class="ukSwitch' + (on ? ' is-on' : '') + '" type="button" role="switch" aria-checked="' + on + '" ' +
        'data-au-power aria-label="Auto mode"><span class="ukSwitch_k"></span></button></div>';
  }

  /* ---- the building blocks that keep every screen short ----
     facts(): label / value rows instead of a paragraph. note(): a state card
     made of a title, facts, optional steps and actions. */
  function facts(rows) {
    return '<dl class="ukAuFacts">' + rows.filter(Boolean).map(function (r) {
      return '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>';
    }).join('') + '</dl>';
  }
  function steps(list) {
    return '<ol class="ukAuHow_l">' + list.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol>';
  }
  function note(tone, title, rows, extra, acts) {
    return '<section class="ukPanel ukAuNote is-' + tone + '"><p class="ukAuNote_t">' + title + '</p>' +
      (rows ? facts(rows) : '') + (extra || '') +
      (acts ? '<div class="ukAuNote_act">' + acts + '</div>' : '') + '</section>';
  }
  /* Cloudbeds: one approval in Cloudbeds, straight back here */
  function cbConnect(label, cls) {
    var CB = window.UKCLOUDBEDS;
    return '<a class="' + (cls || 'ukBtn') + ' ukCbGo" href="' + (CB ? CB.connectUrl() : '#') + '">' + label + '</a>';
  }
  function cbLogo() { return '<img class="ukCxLogo" src="/assets/img/uk/pms/cloudbeds.png" alt="" width="44" height="44" decoding="async">'; }

  /* ================= setup ================= */
  var STEPS = ['Connect Cloudbeds', 'Set your limits', 'Turn it on'];
  var SUB = 'Empty nights become creator stays. You spend rooms, not money.';
  function setup(s, S) {
    var live = S.conn === 'live';
    var step = s.step != null ? s.step : (live ? 1 : 0);
    if (step > 0 && S.conn === 'none') step = 0;
    return V.head('Auto mode', SUB) +
      '<ol class="ukSteps">' + STEPS.map(function (t, i) {
        var doneI = i === 0 ? live : i === 1 ? step > 1 : false;
        return '<li class="' + (i === step ? 'is-now' : doneI ? 'is-done' : '') + '">' +
          '<button type="button" data-au-step="' + i + '"' + (i > 0 && S.conn === 'none' ? ' disabled' : '') + '>' +
          '<span>' + (i + 1) + '</span>' + t + '</button></li>';
      }).join('') + '</ol>' +
      '<div class="ukGrid ukGrid--thread ukAuSetup"><div>' +
        (step === 0 ? connectStep(s, S) : step === 1 ? limitsStep(s, S) : onStep(s, S)) +
      /* reachable before setup is finished: looking things up works from day one */
      '</div><aside>' + appsTeaser(s, S) + '</aside></div>';
  }


  function rules() {
    function col(k, items) {
      return '<div><p class="ukAuRules_k">' + k + '</p><ul>' + items.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div>';
    }
    return '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">What we can and cannot do</h3></div>' +
      '<div class="ukAuRules">' +
        col('We read', ['Which rooms are sold or free', 'Room types and rates']) +
        col('We do', ['Book each confirmed creator into Cloudbeds as a creator stay, at no charge', 'Cancel it if they cancel']) +
        col('We never', ['Change your rates', 'Touch a paid booking', 'Hold a room that could sell']) +
      '</div></section>';
  }

  function connectStep(s, S) {
    var body = '', CB = window.UKCLOUDBEDS, flash = CB && CB.peekFlash();
    var fl = flash && flash.result !== 'connected' ? note(flash.result === 'denied' ? 'calm' : 'warn',
      flash.result === 'denied' ? 'Cloudbeds was not connected' : flash.result === 'not-set-up' ? 'Cloudbeds needs Ukreate\u2019s partner keys first' : 'Could not connect Cloudbeds',
      null, '<p class="ukAuNote_p">' + (flash.result === 'denied' ? 'The approval was cancelled. Nothing changed.'
        : flash.result === 'not-set-up' ? 'Add them to cloudbeds/.env (see cloudbeds/README.md), or run the service in sandbox mode.' : 'The approval did not finish. Try again.') + '</p>',
      '<button class="ukGhost ukGhost--sm" type="button" data-au-cbflash>Got it</button>') : '';
    if (S.conn === 'requested') {
      body = note('wait', 'Setup requested',
        [['Sent', F.when(S.reqAt)], ['With', esc(S.req.who)], ['Contact', esc(S.req.how)], ['Listing', 'Starts once connected']],
        '', '<button class="ukBtn" type="button" data-au-step="1">Set your limits</button>' + cbConnect('Connect it myself', 'ukGhost'));
    } else {
      body = '<section class="ukPanel ukCbConnect"><div class="ukCbConnect_h">' + cbLogo() +
          '<div><h3 class="ukPanel_title">Connect Cloudbeds</h3><p class="ukHint">Approve Ukreate in Cloudbeds and you come straight back here.</p></div></div>' +
        '<div class="ukAuNote_act">' + cbConnect('Connect Cloudbeds') +
          (s.path === 'assist' ? '' : '<button class="ukGhost" type="button" data-au-path="assist">Ask us to do it</button>') + '</div>' +
        (s.path === 'assist' ? assistForm(s) : '') +
        '<p class="ukHint ukAuOnly">Cloudbeds only, for now.</p></section>';
    }
    /* before anyone connects, say plainly what connecting means */
    return fl + (S.conn === 'none' ? rules() + body : body + rules());
  }
  function assistForm(s) {
    var r = s.req || {};
    return '<div class="ukAuHow">' +
      '<label class="ukField"><span class="ukField_l">Who has the login?</span>' +
        '<input class="ukField_i" data-au-req="who" value="' + esc(r.who || '') + '" placeholder="Their name"></label>' +
      '<label class="ukField"><span class="ukField_l">Email or phone</span>' +
        '<input class="ukField_i" data-au-req="how" value="' + esc(r.how || '') + '"></label>' +
      '<label class="ukField"><span class="ukField_l">Anything else</span>' +
        '<textarea class="ukField_i" rows="2" data-au-req="note">' + esc(r.note || '') + '</textarea></label>' +
      '<p class="ukHint" id="ukAuReqHint">You can set your limits while you wait.</p>' +
      '<button class="ukBtn ukBtn--sm" type="button" data-au-req-send>Send request</button></div>';
  }

  /* ---- the limits, used by setup and by the Limits tab ---- */
  function lim(t, hint, body, col) {
    return '<div class="ukAuLim' + (col ? ' ukAuLim--col' : '') + '"><div class="ukAuLim_q"><p class="ukAuLim_t">' + t + '</p>' +
      (hint ? '<p class="ukHint">' + hint + '</p>' : '') + '</div>' + body + '</div>';
  }
  function limits(S, noteTx) {
    var st = S.set;
    return '<section class="ukPanel ukAuLimits"><div class="ukPanel_head"><h3 class="ukPanel_title">Your limits</h3>' +
        (noteTx ? '<span class="ukCard_pill" aria-hidden="true">' + noteTx + '</span>' : '') + '</div>' +
      lim('Stays a month', A.STAY_N + ' nights, one room each',
        '<div class="ukNum">' +
          '<button class="ukNum_b" type="button" data-au-max="-1" aria-label="One fewer"' + (st.max <= 1 ? ' disabled' : '') + '>&minus;</button>' +
          '<input class="ukNum_i" type="number" inputmode="numeric" min="1" max="20" value="' + st.max + '" data-au-maxi aria-label="Stays a month">' +
          '<button class="ukNum_b" type="button" data-au-max="1" aria-label="One more"' + (st.max >= 20 ? ' disabled' : '') + '>+</button>' +
          '<span class="ukNum_u">' + (st.max === 1 ? 'stay' : 'stays') + '</span></div>') +
      lim('Room types', '', A.ROOMS.map(function (r) {
          var on = !!st.rooms[r.k];
          return '<div class="ukToggleRow"><div class="ukToggleRow_b"><p class="ukToggleRow_t">' + r.n + '</p>' +
            '<p class="ukToggleRow_s">' + r.count + ' rooms, ' + F.money(r.rate) + ' a night</p></div>' +
            '<button class="ukSwitch' + (on ? ' is-on' : '') + '" type="button" role="switch" aria-checked="' + on + '" ' +
              'data-au-room="' + r.k + '" aria-label="' + r.n + '"><span class="ukSwitch_k"></span></button></div>';
        }).join(''), true) +
      lim('Blackout dates', 'Never offered',
        '<ul class="ukAuBo">' + st.blackouts.map(function (b, i) {
          return '<li><span class="ukAuBo_n">' + esc(b.n || 'Blackout') + '</span>' +
            '<span class="ukAuBo_d">' + F.day(b.from) + ' ' + b.from.slice(0, 4) + ' to ' + F.day(b.to) + ' ' + b.to.slice(0, 4) + '</span>' +
            '<button class="ukGhost ukGhost--sm" type="button" data-au-bo-del="' + i + '">Remove</button></li>';
        }).join('') + '</ul>' +
        '<div class="ukAuBoAdd">' +
          '<label class="ukField"><span class="ukField_l">From</span><input class="ukField_i" type="date" data-au-bo="from" min="' + A.NOW + '"></label>' +
          '<label class="ukField"><span class="ukField_l">To</span><input class="ukField_i" type="date" data-au-bo="to" min="' + A.NOW + '"></label>' +
          '<label class="ukField"><span class="ukField_l">Name</span><input class="ukField_i" data-au-bo="n" placeholder="Wedding weekend"></label>' +
          '<button class="ukGhost" type="button" data-au-bo-add>Add</button></div>' +
        '<p class="ukHint" id="ukAuBoHint"></p>', true) +
      lim('When to offer a room', 'Creators get at least ' + F.plural(st.close, 'day') + ' notice',
        '<div class="ukAuWin">' +
          '<label class="ukField"><span class="ukField_l">From</span>' + sel('ahead', st.ahead, [14, 21, 30, 45, 60], 'days ahead') + '</label>' +
          '<label class="ukField"><span class="ukField_l">Until</span>' + sel('close', st.close, [2, 3, 5, 7, 10], 'days before') + '</label>' +
        '</div>', true) +
      lim('Who can stay', A.meeting(st.std) + ' creators qualify today',
        '<div class="ukSeg" role="group" aria-label="Who can stay">' + A.STANDARDS.map(function (x) {
          return '<button class="ukSeg_b' + (st.std === x.k ? ' is-on' : '') + '" type="button" aria-pressed="' + (st.std === x.k) + '" data-au-std="' + x.k + '">' + x.n + '</button>';
        }).join('') + '</div>', true) +
      '</section>';
  }
  function sel(k, v, opts, unit) {
    return '<select class="ukSelect" data-au-win="' + k + '">' + opts.map(function (o) {
      return '<option value="' + o + '"' + (o === v ? ' selected' : '') + '>' + o + ' ' + unit + '</option>';
    }).join('') + '</select>';
  }

  /* ---- the preview: the part that makes a careful hotel say yes ---- */
  function previewPanel(S) {
    var headT = '<div class="ukPanel_head"><h3 class="ukPanel_title">What this would have done</h3>';
    if (S.conn !== 'live') {
      return '<section class="ukPanel ukAuPrev">' + headT + '</div>' +
        '<p class="ukAsk">Shows once Cloudbeds is connected, using your real last three months.</p></section>';
    }
    var rows = A.preview(S.set), last = rows[rows.length - 1], sold = 0;
    rows.forEach(function (r) { sold += r.sold; });
    return '<section class="ukPanel ukAuPrev">' + headT + '<span class="ukCard_pill" aria-hidden="true">Last 3 months</span></div>' +
      '<p class="ukAuPrev_h">' + last.m + ': about ' + F.plural(last.filled, 'empty night') + ' filled.</p>' +
      '<div class="ukTableWrap"><table class="ukTable ukAuPrev_t"><thead><tr><th>Month</th>' +
        '<th>Went empty ' + src('m') + '</th><th>Would fill ' + src('e') + '</th><th>Stays</th></tr></thead><tbody>' +
        rows.map(function (r) {
          return '<tr><td>' + r.m + '</td><td class="ukAuNum">' + F.num(r.went) + '</td>' +
            '<td class="ukAuNum">about ' + r.filled + '</td><td class="ukAuNum">' + r.stays + '</td></tr>';
        }).join('') + '</tbody></table></div>' +
      facts([
        ['Went empty', 'From your calendar'],
        ['Would fill', 'The most it could have done'],
        ['Risk', sold ? F.plural(sold, 'night') + ' you later sold' : 'No lost bookings'],
        ['Blackouts', 'Applied to last year']
      ]) + '</section>';
  }

  function limitsStep(s, S) {
    var CB = window.UKCLOUDBEDS, f = CB && CB.peekFlash(), st = CB && CB.state();
    var ok = f && f.result === 'connected' ? note('good', 'Cloudbeds is connected', [['Property', esc(st && st.property ? st.property.name : 'Your property')],
        ['Next', 'Set your limits, then turn it on']], '', '<button class="ukGhost ukGhost--sm" type="button" data-au-cbflash>Got it</button>') : '';
    return ok + limits(S, 'Limits, not a budget') + previewPanel(S) +
      '<div class="ukAuNext"><button class="ukBtn" type="button" data-au-step="2">Next</button></div>';
  }

  function onStep(s, S) {
    var st = S.set, live = S.conn === 'live';
    var rooms = A.ROOMS.filter(function (r) { return st.rooms[r.k]; }).map(function (r) { return r.n; });
    return '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">Ready when you are</h3></div>' +
      facts([
        ['Stays', 'Up to ' + st.max + ' a month'],
        ['Rooms', rooms.length ? rooms.join(', ') : 'None picked'],
        ['Offered', st.ahead + ' to ' + st.close + ' days out'],
        ['Who', A.standard(st.std).n],
        ['Blackouts', st.blackouts.length || 'None']
      ]) +
      (live ? '' : '<p class="ukAuWait">Available once Cloudbeds is connected.</p>') +
      '<div class="ukAuGo"><p class="ukHint">Starts now. Pause any time.</p>' +
        '<button class="ukBtn" type="button" data-au-on' + (live && rooms.length ? '' : ' disabled') + '>Turn on auto mode</button></div>' +
      '</section>' + (live ? previewPanel(S) : '');
  }

  /* ================= running ================= */
  var TABS = [['overview','Overview'],['arrivals','Arrivals'],['needs','Needs you'],['activity','Activity'],['results','Results'],['apps','Connected apps'],['limits','Settings']];
  function running(s, S) {
    var m = A.model();
    var tab = s.tab && TABS.some(function (t) { return t[0] === s.tab; }) ? s.tab : 'overview';
    var counts = { arrivals:m.week.length, needs:m.queue.length };
    return V.head('Auto mode', SUB, powerSwitch(S)) +
      '<div class="ukToolbar"><div class="ukFilters ukFilters--tabs ukAuTabs" role="tablist" aria-label="Auto mode">' +
        TABS.map(function (t) {
          var on = t[0] === tab, n = counts[t[0]];
          return '<button class="ukFilter' + (on ? ' is-on' : '') + '" type="button" role="tab" aria-selected="' + on + '" data-tab="' + t[0] + '">' +
            '<span class="ukFilter_lb">' + t[1] + '</span>' + (n ? '<span class="ukFilter_ct">' + n + '</span>' : '') + '</button>';
        }).join('') + '</div></div>' +
      standing(s, S, m, tab) +
      (tab === 'overview' ? overview(s, S, m) : tab === 'arrivals' ? arrivals(s, S, m) : tab === 'needs' ? needs(s, S, m) :
       tab === 'activity' ? activity(s, S, m) : tab === 'results' ? results(s, S, m) : tab === 'apps' ? apps(s, S, m) : limitsTab(s, S, m));
  }

  /* States that change what the whole feature is doing sit above every tab. */
  function standing(s, S, m, tab) {
    if (S.conn === 'dropped') {
      return note('warn', 'Cloudbeds connection lost', [
          ['Since', F.when(S.droppedAt)],
          ['Paused', 'New listings, and ' + F.plural(m.listings.length, 'open offer') + ' hidden'],
          ['Safe', F.plural(m.coming.length, 'confirmed stay') + ', already booked in Cloudbeds']
        ], (s.asked ? '<p class="ukHint">Sent. We will reconnect it with whoever looks after Cloudbeds.</p>' : ''),
        cbConnect('Reconnect Cloudbeds') +
        (s.asked ? '' : '<button class="ukGhost" type="button" data-au-ask>Ask us to do it</button>'));
    }
    if (S.mode === 'paused') {
      return note('calm', 'Auto mode is paused', [
          ['Since', F.when(S.pausedAt)],
          ['Offers', 'Taken down'],
          ['Confirmed', m.coming.length ? F.plural(m.coming.length, 'stay') + ' still going ahead' : 'None affected']
        ], '', '<button class="ukBtn" type="button" data-au-power>Turn back on</button>');
    }
    if (tab !== 'overview') return '';
    if (S.full) {
      return note('good', 'Nothing to list. Good news.', [
        ['Why', 'Calendar full for ' + S.set.ahead + ' days'],
        ['Next', 'We list as soon as a night looks empty']]);
    }
    var gone = m.gone.filter(function (x) { return x.byCreator; })[0];
    if (gone && !s.seenCancel) {
      var c = D.creator(gone.cr), relist = m.listings.filter(function (l) { return l.relist === gone.id; })[0];
      return note('calm', esc(c.n) + ' cancelled, ' + F.range(gone.from, gone.n), [
          ['Told us', F.when(gone.cancelledAt)],
          ['Room', 'Creator stay cancelled in Cloudbeds'],
          relist ? ['Nights', 'Offered to creators again'] : null,
          ['You', 'Nothing to do']
        ], '', (relist ? '<button class="ukGhost" type="button" data-au-take="' + relist.id + '">Do not offer again</button>' : '') +
          '<button class="ukGhost" type="button" data-au-seen>Got it</button>');
    }
    if (S.fwd && !s.seenFwd) {
      return note('good', 'Auto mode is on', [
          ['Listed', m.open.length ? F.plural(m.open.length, 'room') + ', just now' : 'Nothing yet'],
          ['Why', m.open.length ? 'Nights your history says will not sell' : 'No empty nights coming up']
        ], '', '<button class="ukGhost" type="button" data-au-seenfwd>Got it</button>');
    }
    return '';
  }

  /* ---------------- overview ---------------- */
  function overview(s, S, m) {
    var nights = function (list) { return list.reduce(function (a, x) { return a + x.n; }, 0); };
    var next = m.coming[0];
    return (m.queue.length ?
        '<div class="ukTodo"><div class="ukTodo_text"><p class="ukTodo_title">' + F.plural(m.queue.length, 'thing needs', 'things need') + ' you</p>' +
        '<p class="ukTodo_sub">' + cap(m.queue.map(function (q) { return QK[q.k]; }).join(', ')) + '</p></div>' +
        '<button class="ukBtn ukBtn--sm" type="button" data-tab="needs">Review</button></div>' : '') +
      '<div class="ukBento">' +
        tile({ c:4, l:'On offer', v:m.open.length, n:m.open.length ? F.plural(nights(m.open), 'night') :
          S.mode === 'paused' ? 'taken down' : S.conn === 'dropped' ? 'hidden' : 'nothing to list' }) +
        tile({ c:4, l:'Confirmed', v:m.coming.length, n:m.coming.length ? F.plural(nights(m.coming), 'night') : 'no one yet', tab:'arrivals' }) +
        tile({ c:4, l:'Arriving this week', v:m.week.length,
          n:m.week.length ? m.week.map(function (x) { return D.creator(x.cr).n.split(' ')[0] + ' ' + F.day(x.from, true).split(' ')[0]; }).join(', ')
            : next ? 'next ' + F.day(next.from, true) : 'nobody booked', tab:'arrivals' }) +
      '</div>' +
      '<div class="ukBento">' +
        '<section class="ukCard c7"><div class="ukCard_h"><h3 class="ukCard_t">Arriving this week</h3>' +
          '<button class="ukCard_more" type="button" data-tab="arrivals">Arrivals sheet</button></div>' +
          (m.week.length ? '<ul class="ukAuRows">' + m.week.map(function (x) {
            var c = D.creator(x.cr);
            return '<li class="ukAuRow">' + av(c) + '<div class="ukAuRow_b"><p class="ukAuRow_t">' + esc(c.n) + '</p>' +
              '<p class="ukAuRow_m">' + A.ROOM[x.room].n + ', ' + F.plural(x.guests || 1, 'guest') + '</p></div>' +
              '<p class="ukAuRow_r">' + F.day(x.from, true) + '<span>to ' + F.day(F.add(x.from, x.n), true) + '</span></p></li>';
          }).join('') + '</ul>'
          : '<p class="ukAsk ukAuQuiet">Nobody this week.' + (next ? ' Next: ' + esc(D.creator(next.cr).n) + ', ' + F.day(next.from, true) + '.' : '') + '</p>') +
        '</section>' +
        '<section class="ukCard c5"><div class="ukCard_h"><h3 class="ukCard_t">On offer</h3></div>' +
          (m.listings.length ? '<ul class="ukAuRows">' + m.listings.map(function (l) {
            return '<li class="ukAuRow"><div class="ukAuRow_b"><p class="ukAuRow_t">' + roomDates(l) + '</p>' +
              '<p class="ukAuRow_m">' + (l.state === 'open'
                ? (l.apps ? F.plural(l.apps, 'applicant') : 'No applicants yet')
                : l.state === 'down' ? 'Taken down' : 'Hidden') + '</p></div>' +
              (l.state === 'open' ? '<button class="ukGhost ukGhost--sm" type="button" data-au-take="' + l.id + '">Take back</button>' : '') + '</li>';
          }).join('') + '</ul>'
          : '<p class="ukAsk ukAuQuiet">' + (S.full ? 'Calendar full.' : 'Nothing on offer.') + '</p>') +
        '</section>' +
      '</div>' +
      '<section class="ukCard"><div class="ukCard_h"><h3 class="ukCard_t">Latest</h3>' +
        '<button class="ukCard_more" type="button" data-tab="activity">All activity</button></div>' +
        logList(s, m.log.slice(0, 5), true) + '</section>';
  }

  /* ---------------- arrivals ---------------- */
  function arrivals(s, S, m) {
    var soon = m.coming.filter(function (x) { return F.diff(A.NOW, x.from) <= 7; });
    var later = m.coming.filter(function (x) { return F.diff(A.NOW, x.from) > 7; });
    var mail = s.mail != null ? s.mail : (function () { try { return localStorage.getItem('uk_desk_mail_v1') || ''; } catch (e) { return ''; } })();
    if (!m.coming.length) return V.empty('Nobody booked in yet', 'Arrivals show here once a creator is confirmed.');
    return '<section class="ukPanel ukAuDesk"><div class="ukAuDesk_b"><p class="ukAuDesk_t">For the front desk</p></div>' +
        '<div class="ukAuDesk_act"><button class="ukGhost" type="button" data-au-print>Print</button>' +
        '<label class="ukSrOnly" for="ukAuMail">Front desk email</label>' +
        '<input class="ukField_i ukAuDesk_i" id="ukAuMail" type="email" placeholder="frontdesk@yourhotel.com" value="' + esc(mail) + '" data-au-mailto>' +
        '<button class="ukBtn ukBtn--sm" type="button" data-au-mail>Email it</button></div>' +
        '<p class="ukHint ukAuDesk_h" id="ukAuMailHint"></p></section>' +
      '<div class="ukArrSheet">' +
        '<h3 class="ukArrSheet_h">Creator arrivals</h3>' +
        (soon.length ? '<h4 class="ukSub">This week</h4><div class="ukArrs">' + soon.map(arrCard).join('') + '</div>' : '') +
        (later.length ? '<h4 class="ukSub">Later</h4><div class="ukArrs">' + later.map(arrCard).join('') + '</div>' : '') +
      '</div>';
  }
  function arrCard(x) {
    var c = D.creator(x.cr);
    return '<article class="ukArr">' +
      '<div class="ukArr_who">' + av(c, 'ukAu_av--lg') + '<div><p class="ukArr_n">' + esc(c.n) + '</p>' +
        '<p class="ukArr_h">' + esc(c.h) + ', rated ' + Number(c.rating).toFixed(1) + '</p></div></div>' +
      '<dl class="ukArr_f">' +
        '<div><dt>Arrives</dt><dd>' + F.day(x.from, true) + '</dd></div>' +
        '<div><dt>Leaves</dt><dd>' + F.day(F.add(x.from, x.n), true) + '</dd></div>' +
        '<div><dt>Room</dt><dd>' + A.ROOM[x.room].n + '</dd></div>' +
        '<div><dt>Guests</dt><dd>' + (x.guests || 1) + '</dd></div>' +
      '</dl>' +
      '<div class="ukArr_s"><p class="ukArr_k">Will make</p><p class="ukArr_v">' + esc(x.make) + '</p></div>' +
      '<div class="ukArr_s"><p class="ukArr_k">Desk notes</p><ul class="ukArr_l">' +
        (x.desk || []).map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') +
        '<li>No charge. Creator stay, already in Cloudbeds.</li></ul></div>' +
      (x.movedFrom ? '<p class="ukArr_note">Moved from ' + F.range(x.movedFrom, x.n) + '</p>' : '') +
      '</article>';
  }
  function deskText(m) {
    return 'Creator arrivals, MiraGrace Estate\n\n' + m.coming.map(function (x) {
      var c = D.creator(x.cr);
      return c.n + ' (' + c.h + ')\n' +
        'Arrives ' + F.day(x.from, true) + ', leaves ' + F.day(F.add(x.from, x.n), true) + '\n' +
        A.ROOM[x.room].n + ', ' + F.plural(x.guests || 1, 'guest') + '\n' +
        'Will make: ' + x.make + '\n' +
        (x.desk || []).map(function (d) { return '  ' + d; }).join('\n') +
        '\n  No charge. Creator stay.';
    }).join('\n\n');
  }

  /* ---------------- needs you ---------------- */
  var QK = { dates:'a date change', limits:'a request outside your limits', flag:'a profile we held back' };
  var QT = { dates:'Date change', limits:'Outside your limits', flag:'Profile held back' };
  function needs(s, S, m) {
    if (!m.queue.length) return V.empty('Nothing needs you', 'That is how it should look.');
    return m.queue.map(function (q) {
      return '<article class="ukPanel ukAuQ"><div class="ukAuQ_top"><span class="ukTag ukTag--you">' + QT[q.k] + '</span>' +
          '<span class="ukWhen">' + F.when(q.at) + '</span></div>' +
        '<p class="ukAuQ_t">' + esc(q.t(m)) + '</p>' +
        facts([['We would', esc(q.rec)], ['Why', esc(q.why(m))]]) +
        '<div class="ukAuQ_act">' + q.acts.map(function (a, i) {
          return '<button class="' + (i === 0 ? 'ukBtn' : 'ukGhost') + '" type="button" data-au-decide="' + q.id + ':' + a[0] + '">' + a[1] + '</button>';
        }).join('') + '</div></article>';
    }).join('');
  }

  /* ---------------- activity ---------------- */
  var LOGF = [['all','Everything'],['rooms','Rooms'],['stays','Creators'],['money','Payments'],['you','You']];
  var LOGK = { rooms:['list','close'], stays:['match','cancel','content'], money:['pay'], you:['you'] };
  function activity(s, S, m) {
    var f = s.logF || 'all';
    var list = f === 'all' ? m.log : m.log.filter(function (e) { return LOGK[f].indexOf(e.kind) > -1; });
    var pg = V.paginate(list, s.logPage, 25, 'logPage');
    return '<div class="ukFilters ukAuLogF" role="group" aria-label="Show">' + LOGF.map(function (x) {
        return '<button class="ukFilter' + (f === x[0] ? ' is-on' : '') + '" type="button" aria-pressed="' + (f === x[0]) + '" data-au-logf="' + x[0] + '">' +
          '<span class="ukFilter_lb">' + x[1] + '</span></button>';
      }).join('') + '</div>' +
      '<section class="ukCard">' + (pg.rows.length ? logList(s, pg.rows) : '<p class="ukAsk ukAuQuiet">Nothing here yet.</p>') + pg.nav + '</section>';
  }
  function logList(s, rows, compact) {
    var out = '', lastDay = '';
    rows.forEach(function (e) {
      var d = e.at.slice(0, 10);
      if (!compact && d !== lastDay) {
        if (lastDay) out += '</ol>';
        out += '<h4 class="ukLog_d">' + (d === A.NOW ? 'Today' : d === F.add(A.NOW, -1) ? 'Yesterday' : F.day(d, true) + ' ' + d.slice(0, 4)) + '</h4><ol class="ukLog">';
        lastDay = d;
      }
      if (compact && !lastDay) { out += '<ol class="ukLog">'; lastDay = 'x'; }
      out += '<li class="ukLog_i"><span class="ukLog_t">' + (compact ? F.when(e.at) : F.clock(e.at)) + '</span>' +
        '<span class="ukLog_dot" data-k="' + e.kind + '" aria-hidden="true"></span>' +
        '<div class="ukLog_b"><p class="ukLog_p">' + esc(e.t) +
          (e.via ? ' <span class="ukTag ukTag--wait ukLog_via">via ' + esc(e.via) + '</span>' : '') + '</p>' +
          (e.undoneAt ? '<p class="ukLog_c">Undone ' + F.when(e.undoneAt) + '</p>' : '') +
          (compact ? '' : logAct(s, e)) + '</div></li>';
    });
    return out + (lastDay ? '</ol>' : '');
  }
  function logAct(s, e) {
    if (e.contested) return '<p class="ukLog_c">Questioned ' + F.when(e.contested.at) + '. We will reply here.</p>';
    if (!e.act) return '';
    if (s.contestOpen === e.id) {
      return '<div class="ukLog_form"><label class="ukField"><span class="ukField_l">What was wrong?</span>' +
        '<textarea class="ukField_i" rows="2" data-au-contest-note></textarea></label>' +
        '<div class="ukLog_act"><button class="ukBtn ukBtn--sm" type="button" data-au-contest-send="' + esc(e.id) + '">Send</button>' +
        '<button class="ukGhost ukGhost--sm" type="button" data-au-contest-x>Never mind</button></div></div>';
    }
    if (e.act.k === 'cancel' && s.cancelAsk === e.ref) return cancelAsk(e.ref);
    var attr = e.act.k === 'undo' ? 'data-au-undo="' + esc(e.id) + '"' :
      e.act.k === 'take' ? 'data-au-take="' + e.ref + '"' : e.act.k === 'cancel' ? 'data-au-cancel="' + e.ref + '"'
      : 'data-au-contest="' + esc(e.id) + '"';
    return '<div class="ukLog_act"><button class="ukLinkBtn" type="button" ' + attr + '>' + e.act.l + '</button></div>';
  }
  function cancelAsk(sid) {
    var x = A.model().stay(sid), c = D.creator(x.cr);
    return '<div class="ukLog_form"><p class="ukLog_p">Cancel ' + esc(c.n) + ', ' + F.range(x.from, x.n) + '?</p>' +
      facts([['Creator', 'Told today'], ['Room', 'Back on sale']]) +
      '<div class="ukLog_act">' +
      '<button class="ukGhost ukGhost--danger ukGhost--sm" type="button" data-au-cancel-yes="' + sid + '">Cancel the stay</button>' +
      '<button class="ukGhost ukGhost--sm" type="button" data-au-cancel-x>Keep it</button></div></div>';
  }

  /* ---------------- results ---------------- */
  function results(s, S, m) {
    if (!m.done.length) return V.empty('Nothing to show yet', 'Results start after the first stay ends.');
    var T = window.UKTRACK, tracked = T ? T.isLive() : true;
    var share = A.emptyShare(S.set), likely = Math.round(m.nights * share);
    var first = m.done.map(function (x) { return x.from.slice(0, 7); }).sort()[0];
    var months = [];
    for (var k = first; k <= A.NOW.slice(0, 7); k = F.add(k + '-01', 32).slice(0, 7)) months.push(k);
    var bars = months.map(function (mk, i) {
      var v = m.done.filter(function (x) { return x.from.slice(0, 7) === mk; }).reduce(function (a, x) { return a + x.n; }, 0);
      return { k:F.MONL[+mk.slice(5) - 1].slice(0, 3) + (mk === A.NOW.slice(0, 7) ? ' so far' : ''), v:v, hi:i === months.length - 1 };
    });
    var pg = V.paginate(m.posts, s.postPage, 12, 'postPage');
    function cost(l, v, n, muted) {
      return '<div><p class="ukAuCost_l">' + l + '</p><p class="ukAuCost_v' + (muted ? ' ukK_v--none' : '') + '">' + v + '</p>' +
        '<p class="ukHint">' + n + '</p></div>';
    }
    return '<div class="ukBento">' +
        tile({ l:'Nights filled', v:m.nights, src:'m', n:'all unsold when listed' }) +
        tile({ l:'Posts', v:m.posts.length, src:'m', n:'from ' + F.plural(m.done.length, 'stay') }) +
        tile({ l:'Views', v:F.num(m.views), src:'m', n:'on creators’ accounts' }) +
        tile({ l:'Clicks to book', v:F.num(m.clicks), src:'m', n:'to your booking page' }) +
      '</div>' +
      '<div class="ukBento">' +
        '<section class="ukCard c7"><div class="ukCard_h"><h3 class="ukCard_t">Nights filled</h3>' + src('m') + '</div>' +
          window.UKCHART.capsules({ data:bars, unit:'nights', label:'Nights filled by creator stays, by month' }) + '</section>' +
        '<section class="ukCard c5 ukAuEst"><div class="ukCard_h"><h3 class="ukCard_t">Would they have sold?</h3>' + src('e') + '</div>' +
          '<p class="ukAuEst_v">About ' + likely + ' of ' + m.nights + '</p>' +
          '<p class="ukAuEst_n">would have stayed empty anyway.</p>' +
          facts([['Based on', 'Last winter'], ['Rule', Math.round(share * 100) + '% of rooms unsold ' + S.set.close + ' days out stayed empty']]) +
        '</section>' +
      '</div>' +
      '<section class="ukCard ukAuCost"><div class="ukCard_h"><h3 class="ukCard_t">Cost and return</h3>' + src('m') + '</div>' +
        '<div class="ukAuCost_g">' +
          cost('Rooms given', F.money(m.given), F.plural(m.nights, 'night') + ' at your rate') +
          (tracked
            ? cost('Bookings back', F.money(m.rStayed), F.plural(m.bStayed, 'booking') + ' stayed. ' + m.bPend + ' more to come.')
            : cost('Bookings back', 'Not tracked yet', 'Booking tracking is not live', true)) +
          cost('Paid to creators', F.money(m.paidSum), 'Only after guests stayed') +
        '</div>' +
        '<p class="ukHint ukAuCost_n">Your rate is the ceiling. Most of these nights would not have sold.</p>' +
      '</section>' +
      '<section class="ukCard"><div class="ukCard_h"><h3 class="ukCard_t">What they made</h3>' + src('m') + '</div>' +
        '<div class="ukAuPosts">' + pg.rows.map(function (p) {
          var c = D.creator(p.stay.cr), a = Object.assign({}, p.asset, { t:c.n, on:F.range(p.stay.from, p.stay.n), time:'' });
          return '<div class="ukAuPost">' + V.postCard(a, null, {}) +
            '<p class="ukAuPost_s"><span><b>' + F.num(p.views) + '</b> views</span><span><b>' + F.num(p.clicks) + '</b> clicks</span></p></div>';
        }).join('') + '</div>' + pg.nav + '</section>' +
      delivery(true);
  }

  /* ---------------- content delivery ----------------
     Real connections, held by the delivery service (delivery/server.mjs); this
     only shows them. Each drive is a row like the connected apps: its own icon,
     the account it is connected to, one action. The log below is what was saved
     where, with a way to retry anything that did not make it. */
  var DRIVE_SUB = { gdrive:'Saved to your Drive', dropbox:'Saved to your Dropbox', onedrive:'Saved to your OneDrive', box:'Saved to your Box' };
  var FLASH = {
    connected:  function (n) { return { tone:'good', t:n + ' is connected', s:'New content from every stay will be saved there as it arrives.' }; },
    denied:     function (n) { return { tone:'calm', t:n + ' was not connected', s:'The sign-in was cancelled. Nothing changed.' }; },
    failed:     function (n) { return { tone:'warn', t:'Could not connect ' + n, s:'The sign-in did not finish. Try again.' }; },
    'not-set-up': function (n) { return { tone:'warn', t:n + ' needs Ukreate’s keys first', s:'Add them to delivery/.env (see delivery/README.md), or run the service in sandbox mode.' }; }
  };
  function driveLogo(k, cls) {
    return '<img class="ukCxLogo' + (cls ? ' ' + cls : '') + '" src="/assets/img/uk/drives/' + k + '.png" alt="" width="44" height="44" decoding="async">';
  }
  function realTime(iso) {
    var d = new Date(iso); if (isNaN(d)) return '';
    var today = new Date().toDateString() === d.toDateString();
    return (today ? 'Today' : d.toLocaleDateString(undefined, { day:'numeric', month:'short' })) + ', ' +
      d.toLocaleTimeString(undefined, { hour:'numeric', minute:'2-digit' });
  }
  function delivery(withLog) {
    var DL = window.UKDELIVERY, st = DL ? DL.state() : { up:false, providers:[], deliveries:[] };
    var flash = DL && DL.peekFlash(), fl = '';
    if (flash && FLASH[flash.result]) {
      var pv = st.providers.filter(function (x) { return x.k === flash.k; })[0];
      var f = FLASH[flash.result](pv ? pv.name : 'The drive');
      fl = note(f.tone, f.t, null, '<p class="ukAuNote_p">' + f.s + '</p>', '<button class="ukGhost ukGhost--sm" type="button" data-au-flash>Got it</button>');
    }
    var rows = st.up === false
      ? '<p class="ukAsk ukAuQuiet">The delivery service is not running on this computer. Start it with <code>node delivery/server.mjs</code>, or add <code>UKD_SANDBOX=1</code> to try it without keys.</p>'
      : st.up === null ? '<p class="ukAsk ukAuQuiet">Checking your drives…</p>'
      : '<ul class="ukCxList">' + st.providers.map(function (p) {
          var on = p.connected;
          return '<li class="ukCxRow">' + driveLogo(p.k) +
            '<div class="ukCxRow_b"><p class="ukCxRow_n">' + p.name + '</p>' +
              '<p class="ukCxRow_s">' + (on ? esc(p.account) : 'Not connected') + '</p></div>' +
            '<span class="ukCxStat ukCxStat--' + (on ? 'on' : 'none') + '"><i aria-hidden="true"></i>' + (on ? 'Connected' : 'Not connected') + '</span>' +
            (on ? '<button class="ukGhost ukGhost--sm" type="button" data-au-dsc="' + p.k + '">Disconnect</button>'
                : '<a class="ukBtn ukBtn--sm ukCxConnect" href="' + DL.connectUrl(p.k) + '">Connect</a>') + '</li>';
        }).join('') + '</ul>';
    var log = '';
    if (withLog && st.up) {
      var list = st.deliveries.slice(0, 8);
      log = '<div class="ukDlv"><p class="ukDlv_h">Recent deliveries</p>' + (list.length ? '<ul class="ukDlv_l">' + list.map(function (d) {
          var ok = d.files.filter(function (x) { return x.ok; }).length, n = d.files.length;
          var pv = st.providers.filter(function (x) { return x.k === d.provider; })[0] || { name:d.provider };
          var stt = d.status === 'sending' ? 'Saving…' : d.status === 'delivered' ? 'Saved' : d.status === 'partial' ? ok + ' of ' + n + ' saved' : 'Not saved';
          var tone = d.status === 'delivered' ? 'on' : d.status === 'sending' ? 'wait' : 'warn';
          var open = !st.sandbox && d.folderLink && /^https?:/.test(d.folderLink) ? '<a class="ukLinkBtn" href="' + esc(d.folderLink) + '" target="_blank" rel="noopener">Open folder</a>' : '';
          return '<li class="ukDlv_i">' + driveLogo(d.provider, 'ukCxLogo--sm') +
            '<div class="ukDlv_b"><p class="ukDlv_t">' + esc(d.title || d.stay) + '</p>' +
              '<p class="ukDlv_m">' + F.plural(n, 'file') + ' to ' + esc(pv.name) + ', ' + realTime(d.doneAt || d.at) +
                (d.folder ? ' · ' + esc(d.folder) : '') + '</p>' +
              (d.status !== 'delivered' && d.status !== 'sending' && (d.error || (d.files.filter(function (x) { return !x.ok; })[0] || {}).error)
                ? '<p class="ukDlv_e">' + esc(d.error || d.files.filter(function (x) { return !x.ok; })[0].error) + '</p>' : '') +
            '</div>' +
            '<span class="ukCxStat ukCxStat--' + tone + '"><i aria-hidden="true"></i>' + stt + '</span>' +
            (d.status === 'failed' || d.status === 'partial' ? '<button class="ukGhost ukGhost--sm" type="button" data-au-retry="' + d.id + '">Retry</button>' : open) +
            '</li>';
        }).join('') + '</ul>'
        : '<p class="ukAsk ukAuQuiet">' + (DL.connected().length ? 'Nothing saved yet. The next content that arrives will appear here.' : 'Connect a drive and new content will be saved there as it arrives.') + '</p>') +
        '</div>';
    }
    return fl + '<section class="ukPanel ukDlvPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">Content delivery</h3>' +
        (st.sandbox ? '<span class="ukTag ukTag--wait" title="Files go to delivery/sandbox-drives on this computer">Sandbox</span>' : '') + '</div>' +
      '<p class="ukAsk">Content from every stay is saved to your drive the moment it arrives.</p>' +
      rows + log + '</section>';
  }

  /* ---------------- limits tab ---------------- */
  function limitsTab(s, S, m) {
    return '<div class="ukAuSettings">' +
      limits(S, 'New listings only') + delivery(false) +
      previewPanel(S) +
      cloudbedsPanel(s, S) +
      '</div>';
  }

  /* ---- the Cloudbeds connection, in Settings ---- */
  function cloudbedsPanel(s, S) {
    var CB = window.UKCLOUDBEDS, st = CB ? CB.state() : { up:false };
    var holds = st.holds || [], lost = st.broken || S.conn === 'dropped';
    var nRes = holds.filter(function (h) { return h.kind !== 'block'; }).length, nBlk = holds.length - nRes;
    var held = [nRes || !nBlk ? F.plural(nRes, 'reservation') : null, nBlk ? F.plural(nBlk, 'room block') : null].filter(Boolean).join(', ');
    return '<section class="ukPanel"><div class="ukCbConnect_h">' + cbLogo() +
        '<div><h3 class="ukPanel_title">Cloudbeds</h3>' +
        '<p class="ukHint">' + (st.connected ? esc(st.property ? st.property.name : 'Connected') : 'Not connected') + '</p></div>' +
        (st.sandbox ? '<span class="ukTag ukTag--wait">Sandbox</span>' : '') + '</div>' +
      (st.up === false
        ? '<p class="ukAsk ukAuQuiet">The Cloudbeds service is not running on this computer. Start it with <code>CB_SANDBOX=1 node cloudbeds/server.mjs</code>.</p>'
        : facts([
            ['Status', lost ? 'Connection lost' : st.connected ? 'Connected' : 'Not connected'],
            st.connected ? ['Creator stays', held] : null,
            st.lastSync ? ['Last checked', realTime(st.lastSync)] : null
          ]) +
        '<div class="ukAuNote_act">' + (lost || !st.connected ? cbConnect(lost ? 'Reconnect Cloudbeds' : 'Connect Cloudbeds') : '') +
          (st.connected && !s.discAsk ? '<button class="ukGhost" type="button" data-au-disc>Disconnect</button>' : '') + '</div>' +
        (s.discAsk ? facts([['Stops', 'Auto mode and open offers'], ['Keeps', 'Creator stays already booked in Cloudbeds']]) +
          '<div class="ukAuNote_act"><button class="ukGhost ukGhost--danger" type="button" data-au-disc-yes>Disconnect</button>' +
          '<button class="ukGhost" type="button" data-au-disc-x>Keep it</button></div>' : '')) +
      '</section>';
  }

  /* ================= Connected apps =================
     One registry drives the whole tab. Each app carries its official icon (the
     maker's own App Store or marketplace artwork, in assets/img/uk/apps), the
     name it introduces itself with, and the truth about today:

       now     runs Ukreate on this computer, so it can connect today
       hosted  only reaches services on the internet, so it waits for our
               hosted version

     Three parts, one job each: the apps, what they may do (one choice), and
     what they did (only when there is something). Connecting is a guide in a
     dialog; its only claim is the one it can see, the app calling in. */
  var SERVER = '/Users/bob/Code/ukreate-2.0/mcp/server.mjs';
  /* the connector link apps paste in.
     // PLUG-IN POINT — the public https address once the connector is hosted;
     cloud apps (ChatGPT, Grok, Perplexity, Muse, Mistral, Claude on the web)
     can only reach it there. */
  var LINK = window.UKCX_LINK || 'http://localhost:4398/mcp';
  /* Steps are [title, text to copy, { href, label } to open]. The ChatGPT, Grok,
     Perplexity and Muse routes are the ones verified click by click for the same
     apps on PostSnag's dashboard (McpPage.tsx STEPS_BY_ASSISTANT). */
  var APPS = [
    { k:'claude', n:'Claude', sub:'Desktop app, Claude Code or the web',
      ways:[
        { k:'desktop', n:'Desktop app', steps:[
          ['Open Claude, then Settings, Developer, Edit config'],
          ['Paste this in, save, and restart Claude', JSON.stringify({ mcpServers:{ ukreate:{ command:'node', args:[SERVER] } } }, null, 2)] ] },
        { k:'code', n:'Claude Code', steps:[ ['Run this in your terminal', 'claude mcp add ukreate -- node ' + SERVER] ] },
        { k:'web', n:'On the web', steps:[
          ['Copy your Ukreate link', LINK],
          ['In Settings, open Connectors and add a custom connector', null, { href:'https://claude.ai/customize/connectors?modal=add-custom-connector', label:'Open Claude' }],
          ['Name it Ukreate, paste the link, and add it'] ] } ] },
    { k:'chatgpt', n:'ChatGPT', sub:'On the web or the desktop app', note:'Custom connectors need a ChatGPT Pro or Business plan.',
      ways:[ { k:'web', n:'ChatGPT', steps:[
        ['Open Settings, Connectors, Advanced', null, { href:'https://chatgpt.com/#settings/Connectors/Advanced', label:'Open ChatGPT' }],
        ['Turn on Developer mode'],
        ['Add a new connector and name it Ukreate', null, { href:'https://chatgpt.com/plugins', label:'Open ChatGPT' }],
        ['Paste your Ukreate link into Connection', LINK],
        ['Submit, then approve the connection'] ] } ] },
    { k:'codex', n:'Codex', file:'codex.svg', sub:'Codex app, CLI or IDE extension',
      ways:[
        { k:'cli', n:'Command', steps:[ ['Run this in your terminal', 'codex mcp add ukreate -- node ' + SERVER] ] },
        { k:'toml', n:'Config file', steps:[
          ['Open ~/.codex/config.toml'],
          ['Add this, save, and restart Codex', '[mcp_servers.ukreate]\ncommand = "node"\nargs = ["' + SERVER + '"]'] ] } ] },
    { k:'gemini', n:'Gemini', sub:'Gemini CLI',
      ways:[ { k:'cli', n:'Gemini CLI', steps:[ ['Run this in your terminal', 'gemini mcp add ukreate node ' + SERVER] ] } ] },
    { k:'grok', n:'Grok', sub:'grok.com',
      ways:[ { k:'web', n:'Grok', steps:[
        ['Open Skills and Connectors, then the Connectors tab', null, { href:'https://grok.com/connectors', label:'Open Grok' }],
        ['Click New Connector, then choose Custom'],
        ['Name it Ukreate and paste your link', LINK],
        ['Click Add Connector'] ] } ] },
    { k:'perplexity', n:'Perplexity', sub:'perplexity.ai', note:'Custom connectors need a Perplexity Pro or Enterprise plan.',
      ways:[ { k:'web', n:'Perplexity', steps:[
        ['In Account settings, click Custom connector and choose Remote', null, { href:'https://www.perplexity.ai/account/connectors', label:'Open Perplexity' }],
        ['Name it Ukreate'],
        ['Paste your link into MCP Server URL', LINK],
        ['Tick the acknowledgement and click Add'] ] } ] },
    { k:'muse', n:'Muse', sub:'Muse from Meta',
      ways:[ { k:'chat', n:'Muse', steps:[
        ['Copy this message', 'Can you please add the Ukreate MCP for me?\n' + LINK],
        ['Open Muse, paste it, and send', null, { href:'https://muse.ai', label:'Open Muse' }],
        ['Click Connect when Muse asks'] ] } ] },
    { k:'mistral', n:'Mistral', sub:'Le Chat',
      ways:[ { k:'web', n:'Le Chat', steps:[
        ['Open Intelligence, then Connectors', null, { href:'https://chat.mistral.ai', label:'Open Le Chat' }],
        ['Add a connector and choose Custom MCP connector'],
        ['Name it Ukreate, paste your link, and connect', LINK] ] } ] }
  ];
  function appOf(k) { return APPS.filter(function (a) { return a.k === k; })[0]; }
  var ASK = ['Who is arriving this week?', 'What needs my answer?', 'Pause auto mode'];
  var ACCESS = [
    { k:'off',  ic:'lock',  t:'Off',          s:'No app can see or change anything.' },
    { k:'look', ic:'eye',   t:'Look only',    s:'Apps answer questions. Nothing changes.' },
    { k:'act',  ic:'check', t:'Look and act', s:'Apps can pause, change limits and answer requests. Every step shows in Activity.' }
  ];
  function access(S) { var a = S.assist || {}; return !a.on ? 'off' : a.level === 'act' ? 'act' : 'look'; }
  function logo(k, cls) {
    var f = (appOf(k) || {}).file || k + '.png';
    return '<img class="ukCxLogo' + (cls ? ' ' + cls : '') + '" src="/assets/img/uk/apps/' + f + '" alt="" width="44" height="44" loading="lazy" decoding="async">';
  }
  function seenAt(S, app) { var a = S.assist || {}; return (a.seen || {})[app.n] || null; }
  function triedAt(S, app) { var a = S.assist || {}; return (a.tried || {})[app.n] || null; }
  function appStatus(S, app) {
    var acc = access(S), seen = seenAt(S, app), tried = triedAt(S, app);
    if (acc !== 'off' && seen) return { k:'on', t:'Connected', s:'Last used ' + F.when(seen) };
    if (acc === 'off' && tried) return { k:'wait', t:'Waiting for your OK', s:'Tried ' + F.when(tried) + '. Choose what apps may do.' };
    return { k:'none', t:'Not connected', s:app.sub };
  }
  function status(st) { return '<span class="ukCxStat ukCxStat--' + st.k + '"><i aria-hidden="true"></i>' + st.t + '</span>'; }
  function row(S, app) {
    var st = appStatus(S, app);
    return '<li class="ukCxRow">' + logo(app.k) +
      '<div class="ukCxRow_b"><p class="ukCxRow_n">' + app.n + '</p><p class="ukCxRow_s">' + esc(st.s) + '</p></div>' +
      status(st) +
      '<button class="' + (st.k === 'on' ? 'ukGhost ukGhost--sm' : 'ukBtn ukBtn--sm') + '" type="button" data-au-guide="' + app.k + '">' +
        (st.k === 'on' ? 'Setup guide' : 'Connect') + '</button></li>';
  }
  function appsList(S, compact) {
    return '<ul class="ukCxList' + (compact ? ' ukCxList--compact' : '') + '">' +
      APPS.map(function (a) { return row(S, a); }).join('') + '</ul>';
  }

  function accessChoice(S) {
    var cur = access(S);
    return '<div class="ukCxAccess" role="radiogroup" aria-label="What connected apps may do">' + ACCESS.map(function (o) {
      var on = o.k === cur;
      return '<button class="ukCxAccess_o' + (on ? ' is-on' : '') + '" type="button" role="radio" aria-checked="' + on + '" data-au-access="' + o.k + '">' +
        '<span class="ukCxAccess_ic" data-icon="' + o.ic + '"></span>' +
        '<span class="ukCxAccess_b"><span class="ukCxAccess_t">' + o.t + '</span><span class="ukCxAccess_s">' + o.s + '</span></span>' +
        '<span class="ukCxAccess_r" aria-hidden="true"></span></button>';
    }).join('') + '</div>';
  }

  function apps(s, S, m) {
    var mine = m.log.filter(function (e) { return e.via; }).slice(0, 5);
    return '<p class="ukAsk ukCxIntro">Run auto mode from a chat: ask who is arriving, pause it, or answer a request.</p>' +
      '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">Apps</h3></div>' + appsList(S) + '</section>' +
      '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">What connected apps may do</h3></div>' +
        accessChoice(S) + (s.accessSaved ? '<p class="ukHint ukCxAccess_saved" role="status">Saved. ' + s.accessSaved + '</p>' : '') + '</section>' +
      (mine.length
        ? '<section class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">What they did</h3>' +
            '<button class="ukPanel_more" type="button" data-tab="activity">All activity</button></div>' + logList(s, mine, true) + '</section>'
        : '');
  }
  function appsTeaser(s, S) {
    return '<section class="ukPanel ukCxSide"><div class="ukPanel_head"><h3 class="ukPanel_title">Run it from a chat</h3></div>' +
      appsList(S, true) + '</section>';
  }

  function guide(s, S) {
    var app = s.guideAt && appOf(s.guideApp);
    if (!app) return '';
    var way = app.ways.filter(function (w) { return w.k === s.guideWay; })[0] || app.ways[0];
    var a = S.assist || {}, acc = access(S), seen = seenAt(S, app), tried = triedAt(S, app);
    /* heard = this app called in after the guide opened; nothing else counts */
    var heardOk = acc !== 'off' && seen && seen >= s.guideAt;
    var heardOff = !heardOk && acc === 'off' && tried && tried >= s.guideAt;
    var n = 0;
    function step(t, body) { n++; return '<li><span class="ukCxGuide_n">' + n + '</span><div class="ukCxGuide_b"><p class="ukCxGuide_t">' + t + '</p>' + (body || '') + '</div></li>'; }
    function block(txt) { return '<div class="ukCxCode"><pre>' + esc(txt) + '</pre><button class="ukCxCode_b" type="button" data-au-copytext="' + esc(txt) + '">Copy</button></div>'; }
    /* a side sheet over the whole app, not a dialog inside the page: the page
       area sits under the top bar and sidebar, so anything centred in it loses
       its top. Header and status stay put; only the steps scroll. */
    return '<div class="ukCxSheetWrap" data-au-guide-bg>' +
      '<aside class="ukCxSheet" role="dialog" aria-modal="true" aria-labelledby="ukCxGuideT">' +
        '<header class="ukCxSheet_h"><div class="ukCxSheet_top">' + logo(app.k) +
            '<div class="ukCxSheet_tt"><p class="ukCxSheet_k">Connect</p><h3 class="ukCxSheet_t" id="ukCxGuideT">' + app.n + '</h3></div>' +
            '<button class="ukCxGuide_x" type="button" data-au-guide="close" aria-label="Close">&times;</button></div>' +
          (app.ways.length > 1 ? '<div class="ukSeg ukCxSheet_seg" role="tablist" aria-label="How you use ' + app.n + '">' + app.ways.map(function (w) {
              var on = w.k === way.k;
              return '<button class="ukSeg_b' + (on ? ' is-on' : '') + '" type="button" role="tab" aria-selected="' + on + '" data-au-guideway="' + w.k + '">' + w.n + '</button>';
            }).join('') + '</div>' : '') +
        '</header>' +
        '<div class="ukCxSheet_b"><ol class="ukCxGuide_l">' +
          (acc === 'off' ? step('Choose what apps may do', '<div class="ukCxGuide_acc">' + ACCESS.slice(1).map(function (o) {
              return '<button class="ukGhost ukGhost--sm" type="button" data-au-access="' + o.k + '">' + o.t + '</button>'; }).join('') + '</div>') : '') +
          way.steps.map(function (st) {
          return step(st[0], (st[1] ? block(st[1]) : '') +
            (st[2] ? '<a class="ukGhost ukGhost--sm ukCxOpen" href="' + st[2].href + '" target="_blank" rel="noopener">' + st[2].label + '</a>' : ''));
        }).join('') +
          step('Ask ' + app.n + ' something', '<div class="ukCxGuide_ask">' + ASK.map(function (q) {
            return '<button class="ukChip ukCxGuide_q" type="button" data-au-copytext="' + esc(q) + '">' + esc(q) + '</button>'; }).join('') + '</div>') +
        '</ol>' + (app.note ? '<p class="ukHint ukCxNote">' + app.note + '</p>' : '') + '</div>' +
        '<footer class="ukCxSheet_f"><div class="ukCxGuide_live is-' + (heardOk ? 'ok' : heardOff ? 'warn' : 'wait') + '" role="status" aria-live="polite"><i aria-hidden="true"></i><span>' +
          (heardOk ? 'Connected. ' + app.n + ' called in ' + F.when(seen) + '.'
           : heardOff ? app.n + ' reached us, but access is Off. Choose Look only or Look and act.'
           : 'Waiting for ' + app.n + '. This updates on its own when it calls in.') + '</span>' +
          (heardOk ? '<button class="ukBtn ukBtn--sm" type="button" data-au-guide="close">Done</button>' : '') + '</div></footer>' +
      '</aside></div>';
  }

  /* The sheet lives in its own host on <body>, outside the page area, and is
     redrawn whenever the page is: open only while auto mode is on screen and the
     guide is open, so navigating away closes it with the page. */
  function syncGuide() {
    var host = document.getElementById('ukCxHost');
    if (!host) { host = document.createElement('div'); host.id = 'ukCxHost'; document.body.appendChild(host); }
    var onAuto = !!root.querySelector('.ukView [class*="ukAu"], .ukView .ukCxIntro');
    var s = st(), html = onAuto ? guide(s, A.state()) : '';
    var was = !!host.firstChild;
    host.innerHTML = html;
    document.documentElement.classList.toggle('ukCxLocked', !!html);
    if (html && !was) { var x = host.querySelector('.ukCxGuide_x'); if (x) x.focus(); }
  }
  var viewEl = root.querySelector('.ukView');
  if (viewEl && window.MutationObserver) new MutationObserver(syncGuide).observe(viewEl, { childList:true });

  V.auto = auto;
  /* only the auto mode page redraws when the connector changes something, so a
     form half-filled on another page is never wiped */
  A.watch(function () { if (root.querySelector('[class*="ukAu"]')) repaint(); });
  if (window.UKCLOUDBEDS) {
    window.UKCLOUDBEDS.onChange(function () { if (root.querySelector('[class*="ukAu"]')) repaint(); });
    /* back from Cloudbeds' approval screen: land on auto mode */
    if (window.UKCLOUDBEDS.peekFlash()) window.addEventListener('load', function () {
      setTimeout(function () { if (window.UKGO) { window.UKAUTOST().step = null; window.UKGO('auto'); } }, 0);
    });
  }
  if (window.UKDELIVERY) {
    window.UKDELIVERY.onChange(function () { if (root.querySelector('[class*="ukAu"]')) repaint(); });
    /* back from Google, Dropbox, Microsoft or Box: show where it landed */
    if (window.UKDELIVERY.peekFlash()) window.addEventListener('load', function () {
      setTimeout(function () { if (window.UKGO) { window.UKGO('auto'); var st = window.UKAUTOST(); st.tab = 'results'; repaint(); } }, 0);
    });
  }

  /* ================= events =================
     Its own listener, registered before the shell's, and every branch here stops
     the event once handled so the shell never sees a click it does not know. */
  function done(e) { e.stopImmediatePropagation(); repaint(); }
  function st() { return window.UKAUTOST ? window.UKAUTOST() : {}; }
  root.addEventListener('click', function (e) {
    var el, s = st(), t = e.target;
    if (!t.closest || !(t.closest('.ukView') || t.closest('#ukCxHost'))) return;
    if ((el = t.closest('[data-au-step]'))) { s.step = +el.dataset.auStep; window.scrollTo(0, 0); return done(e); }
    if ((el = t.closest('[data-au-path]'))) { s.path = el.dataset.auPath; return done(e); }
    if (t.closest('[data-au-req-send]')) {
      var r = s.req || {};
      if (!(r.who || '').trim() || !(r.how || '').trim()) {
        var h = root.querySelector('#ukAuReqHint');
        if (h) h.textContent = 'Add a name and a way to reach them.';
        e.stopImmediatePropagation(); return;
      }
      A.request({ who:r.who.trim(), how:r.how.trim(), note:(r.note || '').trim() });
      s.path = null; return done(e);
    }
    if ((el = t.closest('[data-au-max]'))) {
      A.setLimit('max', Math.max(1, Math.min(20, A.state().set.max + +el.dataset.auMax))); return done(e);
    }
    if ((el = t.closest('[data-au-room]'))) {
      var rs = Object.assign({}, A.state().set.rooms); rs[el.dataset.auRoom] = !rs[el.dataset.auRoom];
      A.setLimit('rooms', rs); return done(e);
    }
    if ((el = t.closest('[data-au-std]'))) { A.setLimit('std', el.dataset.auStd); return done(e); }
    if ((el = t.closest('[data-au-bo-del]'))) {
      var bos = A.state().set.blackouts.slice(); bos.splice(+el.dataset.auBoDel, 1); A.setLimit('blackouts', bos); return done(e);
    }
    if (t.closest('[data-au-bo-add]')) {
      var f = {}; root.querySelectorAll('[data-au-bo]').forEach(function (i) { f[i.dataset.auBo] = i.value.trim(); });
      var hint = root.querySelector('#ukAuBoHint');
      if (!f.from || !f.to) { if (hint) hint.textContent = 'Pick both dates.'; e.stopImmediatePropagation(); return; }
      if (f.to < f.from) { if (hint) hint.textContent = 'The end is before the start.'; e.stopImmediatePropagation(); return; }
      A.setLimit('blackouts', A.state().set.blackouts.concat([{ from:f.from, to:f.to, n:f.n || 'Blackout' }])); return done(e);
    }
    if (t.closest('[data-au-on]')) { A.turnOn(); s.step = null; s.tab = 'overview'; window.scrollTo(0, 0); return done(e); }
    if (t.closest('[data-au-power]')) {
      if (A.state().mode === 'on') A.pause(); else A.turnOn();
      return done(e);
    }
    if ((el = t.closest('[data-au-undo]'))) { A.undo(el.dataset.auUndo); return done(e); }
    if ((el = t.closest('[data-au-guide]'))) {
      if (el.dataset.auGuide === 'close') s.guideAt = null;
      else { s.guideApp = el.dataset.auGuide; s.guideWay = null; s.guideAt = F.now(); }
      return done(e);
    }
    if (t.matches && t.matches('[data-au-guide-bg]')) { s.guideAt = null; return done(e); }
    if ((el = t.closest('[data-au-guideway]'))) { s.guideWay = el.dataset.auGuideway; return done(e); }
    if ((el = t.closest('[data-au-access]'))) {
      var k = el.dataset.auAccess;
      A.setAssist(k === 'off' ? { on:false } : { on:true, level:k === 'act' ? 'act' : 'read' });
      s.accessSaved = k === 'off' ? 'Apps are switched off.' : k === 'act' ? 'Apps can look and act.' : 'Apps can look only.';
      return done(e);
    }
    if ((el = t.closest('[data-au-copytext]'))) {
      e.stopImmediatePropagation();
      var txt = el.dataset.auCopytext, lab = el.querySelector('em') || el, was = lab.textContent;
      var ok = function () { lab.textContent = 'Copied'; setTimeout(function () { lab.textContent = was; }, 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(ok, ok); else ok();
      return;
    }
    if ((el = t.closest('[data-au-dsc]'))) { e.stopImmediatePropagation(); window.UKDELIVERY.disconnect(el.dataset.auDsc); return; }
    if ((el = t.closest('[data-au-retry]'))) { e.stopImmediatePropagation(); el.disabled = true; window.UKDELIVERY.retry(el.dataset.auRetry); return; }
    if (t.closest('[data-au-flash]')) { window.UKDELIVERY.takeFlash(); return done(e); }
    if ((el = t.closest('[data-au-take]'))) { A.takeBack(el.dataset.auTake); return done(e); }
    if ((el = t.closest('[data-au-cancel]'))) { s.cancelAsk = el.dataset.auCancel; return done(e); }
    if (t.closest('[data-au-cancel-x]')) { s.cancelAsk = null; return done(e); }
    if ((el = t.closest('[data-au-cancel-yes]'))) { A.cancelStay(el.dataset.auCancelYes); s.cancelAsk = null; return done(e); }
    if ((el = t.closest('[data-au-decide]'))) {
      var p = el.dataset.auDecide.split(':'); A.decide(p[0], p[1]); return done(e);
    }
    if ((el = t.closest('[data-au-contest]'))) { s.contestOpen = el.dataset.auContest; return done(e); }
    if (t.closest('[data-au-contest-x]')) { s.contestOpen = null; return done(e); }
    if ((el = t.closest('[data-au-contest-send]'))) {
      var note = root.querySelector('[data-au-contest-note]');
      A.contest(el.dataset.auContestSend, note ? note.value.trim() : ''); s.contestOpen = null; return done(e);
    }
    if ((el = t.closest('[data-au-logf]'))) { s.logF = el.dataset.auLogf; s.logPage = 1; return done(e); }
    if (t.closest('[data-au-seen]')) { s.seenCancel = true; return done(e); }
    if (t.closest('[data-au-seenfwd]')) { s.seenFwd = true; return done(e); }
    if (t.closest('[data-au-ask]')) { s.asked = true; return done(e); }
    if (t.closest('[data-au-disc]')) { s.discAsk = true; return done(e); }
    if (t.closest('[data-au-disc-x]')) { s.discAsk = false; return done(e); }
    if (t.closest('[data-au-disc-yes]')) {
      if (window.UKCLOUDBEDS) window.UKCLOUDBEDS.disconnect();
      A.disconnect(); s.discAsk = false; s.step = 0; s.tab = null; return done(e);
    }
    if (t.closest('[data-au-cbflash]')) { window.UKCLOUDBEDS.takeFlash(); return done(e); }
    if (t.closest('[data-au-print]')) {
      e.stopImmediatePropagation();
      document.body.classList.add('ukPrintArr');
      var off = function () { document.body.classList.remove('ukPrintArr'); window.removeEventListener('afterprint', off); };
      window.addEventListener('afterprint', off);
      window.print();
      return;
    }
    if (t.closest('[data-au-mail]')) {
      e.stopImmediatePropagation();
      var to = (s.mail || '').trim(), mh = root.querySelector('#ukAuMailHint');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) { if (mh) mh.textContent = 'Add an email address first.'; return; }
      try { localStorage.setItem('uk_desk_mail_v1', to); } catch (x) {}
      var m = A.model();
      window.location.href = 'mailto:' + encodeURIComponent(to) + '?subject=' + encodeURIComponent('Creator arrivals') +
        '&body=' + encodeURIComponent(deskText(m));
      if (mh) mh.textContent = 'Opened in your email app.';
      return;
    }
  });
  document.addEventListener('keydown', function (e) {
    var s = st();
    if (e.key === 'Escape' && s.guideAt) { s.guideAt = null; repaint(); }
  });
  root.addEventListener('input', function (e) {
    var t = e.target, s = st();
    if (t.dataset.auReq) { s.req = s.req || {}; s.req[t.dataset.auReq] = t.value; }
    if (t.hasAttribute('data-au-mailto')) s.mail = t.value;
  });
  root.addEventListener('change', function (e) {
    var t = e.target;
    if (t.dataset.auWin) { A.setLimit(t.dataset.auWin, +t.value); e.stopImmediatePropagation(); repaint(); }
    if (t.hasAttribute('data-au-maxi')) {
      var v = Math.max(1, Math.min(20, Math.round(+t.value || 1)));
      A.setLimit('max', v); e.stopImmediatePropagation(); repaint();
    }
  });
})();
