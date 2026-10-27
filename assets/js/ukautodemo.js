/* Ukreate — auto mode, console controls for review. Hotel side, demo only.

   Type ukDemo.help() in the browser console. Every command changes the same
   records the screen reads and redraws it in place, so you watch the feature
   move between states live, without reloading. Actions run "as" an app go
   through the real functions and land in Activity marked "via <app>", exactly
   as they would if that app had called the connector.

   Nothing here runs on its own: no timers, no fake events. It only does what
   you type. To remove it, delete this file and its <script> tag. */
(function () {
  var A = window.UKAUTO, D = window.UK;
  if (!A || !document.querySelector('[data-ukapp]')) return;
  var F = A.fmt;

  var STATES = {
    none:      'Not connected to Cloudbeds',
    requested: 'Setup requested from the Ukreate team',
    off:       'Connected, auto mode not turned on yet',
    running:   'On and running, with stays confirmed',
    full:      'On, nothing listed: the calendar is full',
    cancelled: 'A creator cancelled',
    dropped:   'Cloudbeds connection lost',
    paused:    'Paused by the hotel'
  };
  var APPS = { claude:'Claude', chatgpt:'ChatGPT', codex:'Codex', gemini:'Gemini',
               grok:'Grok', perplexity:'Perplexity', muse:'Muse', mistral:'Mistral' };
  var TABS = { overview:1, arrivals:1, needs:1, activity:1, results:1, apps:1, limits:1 };

  function show(tab) {
    if (window.UKGO) window.UKGO('auto');
    if (tab && window.UKAUTOST) window.UKAUTOST().tab = tab;
    if (window.UKREPAINT) window.UKREPAINT();
  }
  function appName(k) {
    var n = APPS[String(k || '').toLowerCase()];
    if (!n) throw new Error('Unknown app "' + k + '". Use one of: ' + Object.keys(APPS).join(', '));
    return n;
  }
  function ok(msg) { console.log('%c✓ ' + msg, 'color:#0b6a7d;font-weight:700'); return undefined; }
  function needsRunning() {
    var S = A.state();
    if (S.conn !== 'live' && S.conn !== 'dropped') throw new Error('Auto mode is not set up in this state. Try ukDemo.state("running") first.');
  }

  var api = {
    /* ---------- where you are ---------- */
    help: function () {
      console.log('%cUkreate auto mode: console controls', 'font:700 15px Lato,sans-serif;color:#8a6414');
      console.table([
        { command:'ukDemo.state("running")', does:'Jump to a state: ' + Object.keys(STATES).join(', ') },
        { command:'ukDemo.states()',          does:'List every state and what it means' },
        { command:'ukDemo.status()',          does:'Print where things stand now' },
        { command:'ukDemo.tab("apps")',       does:'Open a tab: ' + Object.keys(TABS).join(', ') },
        { command:'ukDemo.cloudbeds("connect")', does:'Cloudbeds connects, or "drop" to lose the connection' },
        { command:'ukDemo.access("act")',     does:'What apps may do: off, look, act' },
        { command:'ukDemo.connect("chatgpt")',does:'That app calls in (shows Connected, or Waiting for your OK when access is off)' },
        { command:'ukDemo.disconnect("chatgpt")', does:'Forget that app' },
        { command:'ukDemo.guide("grok")',     does:'Open an app’s setup guide' },
        { command:'ukDemo.as("chatgpt").pause()', does:'An app acts. Also: .resume(), .decide("q1","move"), .takeBack("L3"), .limits({ max:8 }), .cancel("as14")' },
        { command:'ukDemo.drives()',          does:'Drive connections and recent deliveries' },
        { command:'ukDemo.content("as11")',   does:'That stay\u2019s content arrives: saved to every connected drive' },
        { command:'ukDemo.reset()',           does:'Back to the start: not connected, nothing on' }
      ]);
      return undefined;
    },
    states: function () {
      console.table(Object.keys(STATES).map(function (k) { return { state:k, means:STATES[k] }; }));
      return undefined;
    },
    status: function () {
      var S = A.state(), m = A.model(), a = S.assist || {};
      var acc = !a.on ? 'off' : a.level === 'act' ? 'act' : 'look';
      console.table([{
        state: S.scn + (STATES[S.scn] ? ' (' + STATES[S.scn] + ')' : ''),
        booking: S.conn, mode: S.mode, apps_may: acc,
        on_offer: m.open.length, confirmed: m.coming.length, needs_you: m.queue.length
      }]);
      var seen = a.seen || {};
      var rows = Object.keys(APPS).map(function (k) {
        var n = APPS[k];
        return { app:n, last_used: seen[n] ? F.when(seen[n]) : '', tried: (a.tried || {})[n] ? F.when(a.tried[n]) : '' };
      });
      console.table(rows);
      return undefined;
    },

    /* ---------- move between states ---------- */
    state: function (k) {
      if (!STATES[k]) throw new Error('Unknown state "' + k + '". Use one of: ' + Object.keys(STATES).join(', '));
      A.scenario(k);
      var st = window.UKAUTOST && window.UKAUTOST();
      if (st) { st.tab = null; st.step = null; st.guideAt = null; st.seenCancel = false; st.seenFwd = false; }
      show();
      return ok('State: ' + STATES[k]);
    },
    tab: function (t) {
      if (!TABS[t]) throw new Error('Unknown tab "' + t + '". Use one of: ' + Object.keys(TABS).join(', '));
      show(t);
      return ok('Opened ' + t);
    },
    cloudbeds: function (what) {
      var S = A.state();
      if (what === 'connect') {
        if (S.conn === 'live') throw new Error('Cloudbeds is already connected.');
        A.confirm(); show(); return ok('Cloudbeds connected');
      }
      if (what === 'drop') {
        needsRunning();
        if (window.UKCLOUDBEDS_DEMO) window.UKCLOUDBEDS_DEMO.drop();
        S.conn = 'dropped'; S.droppedAt = F.now(); A.save(); show(); return ok('Cloudbeds connection lost');
      }
      throw new Error('Use ukDemo.cloudbeds("connect") or ukDemo.cloudbeds("drop")');
    },
    booking: function (what) { return api.cloudbeds(what === 'confirm' ? 'connect' : what); },

    /* ---------- apps ---------- */
    access: function (level) {
      var map = { off:{ on:false }, look:{ on:true, level:'read' }, act:{ on:true, level:'act' } };
      if (!map[level]) throw new Error('Use "off", "look" or "act"');
      A.setAssist(map[level]); show();
      return ok('Apps may: ' + level);
    },
    /* what a real app's first call does on the connector: an attempt is always
       recorded; it only counts as connected when access allows it */
    connect: function (k) {
      var n = appName(k), a = A.state().assist || {}, now = F.now(), patch = { app:n, lastTryAt:now,
        tried: Object.assign({}, a.tried || {}, (function (o) { o[n] = now; return o; })({})) };
      if (a.on) { patch.lastAt = now; patch.seen = Object.assign({}, a.seen || {}, (function (o) { o[n] = now; return o; })({})); }
      A.setAssist(patch); show(window.UKAUTOST && window.UKAUTOST().tab === 'apps' ? 'apps' : null);
      return ok(a.on ? n + ' connected' : n + ' tried to connect, but access is Off');
    },
    disconnect: function (k) {
      var n = appName(k), a = A.state().assist || {};
      var seen = Object.assign({}, a.seen || {}), tried = Object.assign({}, a.tried || {});
      delete seen[n]; delete tried[n];
      A.setAssist({ seen:seen, tried:tried }); show();
      return ok(n + ' forgotten');
    },
    guide: function (k) {
      appName(k);
      var st = window.UKAUTOST();
      st.guideApp = String(k).toLowerCase(); st.guideWay = null; st.guideAt = F.now();
      show(st.tab || null);
      return ok('Opened the ' + APPS[st.guideApp] + ' guide. Now try ukDemo.connect("' + st.guideApp + '")');
    },

    /* ---------- an app acting, through the real functions ---------- */
    as: function (k) {
      var n = appName(k);
      function run(label, fn) {
        needsRunning();
        var a = A.state().assist || {};
        if (!a.on) throw new Error('Access is Off, so ' + n + ' would be refused. Run ukDemo.access("act") first.');
        if (a.level !== 'act') throw new Error('Access is Look only, so ' + n + ' would be refused. Run ukDemo.access("act") first.');
        A.as(n);
        try { fn(); } finally { A.as(null); }
        var now = F.now();
        A.setAssist({ lastAt:now, app:n, seen:Object.assign({}, a.seen || {}, (function (o) { o[n] = now; return o; })({})) });
        show();
        return ok(n + ': ' + label + '. See Activity, marked via ' + n);
      }
      return {
        pause:    function () { return run('paused auto mode', function () { if (A.state().mode === 'on') A.pause(); }); },
        resume:   function () { return run('turned auto mode back on', function () { if (A.state().mode !== 'on') A.turnOn(); }); },
        decide:   function (id, option) { return run('answered ' + id + ' with ' + option, function () { A.decide(id, option); }); },
        takeBack: function (id) { return run('took back offer ' + id, function () { A.takeBack(id); }); },
        cancel:   function (id) { return run('cancelled stay ' + id, function () { A.cancelStay(id); }); },
        limits:   function (o) {
          var KEYS = { max:'max', ahead:'ahead', close:'close', std:'std' };
          return run('changed limits', function () {
            Object.keys(o || {}).forEach(function (k) { if (KEYS[k]) A.setLimit(KEYS[k], o[k]); });
          });
        }
      };
    },

    /* ---------- content delivery ---------- */
    drives: function () {
      var DL = window.UKDELIVERY;
      if (!DL) throw new Error('Content delivery is not loaded on this page.');
      return DL.refresh().then(function () {
        var st = DL.state();
        if (!st.up) { console.log('The delivery service is not running. Start it: UKD_SANDBOX=1 node delivery/server.mjs'); return; }
        console.log(st.sandbox ? 'Sandbox mode: files go to delivery/sandbox-drives/' : 'Live providers');
        console.table(st.providers.map(function (p) { return { drive:p.name, connected:p.connected, account:p.account || '' }; }));
        if (st.deliveries.length) console.table(st.deliveries.slice(0, 10).map(function (d) {
          return { stay:d.title, drive:d.provider, status:d.status, files:d.files.length, folder:d.folder || '' }; }));
      });
    },
    /* a stay's content arriving: the same call the platform makes when posts land */
    content: function (stayId) {
      var DL = window.UKDELIVERY;
      if (!DL) throw new Error('Content delivery is not loaded on this page.');
      return DL.refresh().then(function () {
        if (!DL.state().up) throw new Error('The delivery service is not running. Start it: UKD_SANDBOX=1 node delivery/server.mjs');
        if (!DL.connected().length) throw new Error('No drive is connected. Connect one in Auto mode, Results, Content delivery.');
        return DL.deliverAutoStay(stayId);
      }).then(function (r) {
        if (!r.queued) throw new Error(r.reason || 'Nothing to send for ' + stayId + '. Try a finished stay like as11.');
        show('results');
        ok('Content from ' + stayId + ' is on its way to ' + DL.connected().map(function (p) { return p.name; }).join(', ') + '. Watch Content delivery.');
      });
    },

    reset: function () { return api.state('none'); }
  };

  window.ukDemo = api;
  console.log('%cUkreate auto mode%c  Type ukDemo.help() to drive it from here.',
    'background:#0B2F52;color:#efc470;font:700 12px Lato,sans-serif;padding:3px 8px;border-radius:6px',
    'color:#5f6367;font:400 12px Lato,sans-serif');
})();
