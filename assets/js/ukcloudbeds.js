/* Ukreate — Cloudbeds, the app's side. Hotel app.

   The Cloudbeds connection service (cloudbeds/server.mjs) holds the hotel's key
   and talks to Cloudbeds; this file is how auto mode talks to it.

   CONNECTING sends the hotel to Cloudbeds to approve Ukreate, and back here.
   KEEPING IN STEP: whenever the confirmed creator stays change (a stay is
   matched, moved, allowed as an exception or cancelled), the full list goes to
   the service, which books, rebooks or cancels in Cloudbeds to match. Sending
   the same list twice does nothing, so a missed change corrects itself.
   A LOST CONNECTION (the hotel removed Ukreate inside Cloudbeds, or the key
   stopped working) is real state here too: auto mode shows it as lost.

   // PLUG-IN POINT — in production the platform syncs server side when a stay is
   confirmed, so Cloudbeds never depends on the hotel's browser being open. */
window.UKCLOUDBEDS = (function () {
  var BASE = window.UKCB_BASE || 'http://localhost:4397';
  var ST = { up:null, connected:false, sandbox:false, property:null, broken:null, holds:[], events:[], log:[] };
  var listeners = [], flash = null, lastSent = null, busy = false;
  function changed() { listeners.forEach(function (fn) { try { fn(); } catch (e) {} }); }

  function A() { return window.UKAUTO; }
  /* what Cloudbeds should hold: every confirmed creator stay, by its own id */
  function desired() {
    var a = A(); if (!a) return [];
    return a.model().coming.map(function (x) {
      var c = window.UK.creator(x.cr);
      return { id:x.id, name:c ? c.n : 'Ukreate creator', roomType:a.ROOM[x.room].n, from:x.from, to:a.fmt.add(x.from, x.n), guests:x.guests || 1 };
    });
  }

  function refresh() {
    if (typeof fetch !== 'function') return Promise.resolve();
    return fetch(BASE + '/status', { cache:'no-store' }).then(function (r) { return r.json(); }).then(function (d) {
      var before = JSON.stringify(ST);
      ST = { up:true, connected:d.connected, sandbox:d.sandbox, property:d.property, broken:d.broken, holds:d.holds || [],
        events:d.events || [], log:d.log || [], lastSync:d.lastSync, configured:d.configured };
      reflect();
      if (JSON.stringify(ST) !== before) changed();
    }).catch(function () {
      if (ST.up !== false) { ST = { up:false, connected:false, holds:[], events:[], log:[] }; changed(); }
    });
  }
  /* the service's connection is the truth; auto mode's state follows it */
  function reflect() {
    var a = A(); if (!a) return;
    var S = a.state();
    if (ST.connected && !ST.broken && (S.conn === 'none' || S.conn === 'requested' || S.conn === 'dropped') && flash && flash.result === 'connected') a.confirm();
    if (ST.connected && ST.broken && S.conn === 'live') { S.conn = 'dropped'; S.droppedAt = a.fmt.now(); a.save(); }
  }
  function syncNow() {
    var a = A();
    if (!a || !ST.up || !ST.connected || ST.broken || busy) return;
    if (a.state().conn !== 'live') return;
    var want = JSON.stringify(desired());
    if (want === lastSent) return;
    busy = true;
    fetch(BASE + '/sync', { method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify({ stays:JSON.parse(want) }) })
      .then(function (r) { return r.json().then(function (d) { if (r.ok) lastSent = want; return d; }); })
      .catch(function () {}).then(function () { busy = false; return refresh(); });
  }
  function tick() {
    refresh().then(function () { syncNow(); setTimeout(tick, ST.up ? 2500 : 30000); });
  }

  function connectUrl() { return BASE + '/connect'; }
  function disconnect() { return fetch(BASE + '/disconnect', { method:'POST' }).then(refresh); }
  function state() { return ST; }
  function onChange(fn) { listeners.push(fn); }

  /* coming back from Cloudbeds' approval screen */
  try {
    var q = new URLSearchParams(location.search), r = q.get('cb');
    if (r) {
      flash = { result:r }; q.delete('cb');
      history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q : ''));
    }
  } catch (e) {}

  /* ---------- static demo: Cloudbeds, in the page ----------
     A published demo cannot reach the service. It gets the same flow under the
     Sandbox label: a marked approval screen, then creator stays booked into a
     stand-in Cloudbeds held in the browser. */
  if (window.UKD_STATIC) {
    var KEY = 'ukcb_static_v1';
    var load = function () { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
    var keep = function (v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} };
    var DS = load();
    var put = function () {
      ST = { up:true, connected:!!DS.on, sandbox:true, configured:true, broken:DS.broken || null,
        property:DS.on ? { name:'MiraGrace Estate', id:'198765' } : null, holds:DS.holds || [], events:[], log:[], lastSync:DS.lastSync || null };
      keep(DS); reflect(); changed();
    };
    refresh = function () { return Promise.resolve(); };
    connectUrl = function () { return '#ukcb-connect'; };
    disconnect = function () { DS = {}; put(); return Promise.resolve(); };
    syncNow = function () {
      var a = A(); if (!a) return;
      /* the demo dock jumps between states; the stand-in Cloudbeds follows them */
      var conn = a.state().conn, was0 = JSON.stringify(DS);
      if (conn === 'none' || conn === 'requested') DS = {};
      else if (conn === 'dropped') { if (!DS.broken) DS = { on:true, holds:DS.holds || [], broken:{ at:new Date().toISOString(), message:'Ukreate was removed in Cloudbeds' } }; }
      else { DS.on = true; DS.broken = null; DS.holds = DS.holds || []; }
      if (JSON.stringify(DS) !== was0) put();
      if (!DS.on || DS.broken || conn !== 'live') return;
      var want = desired(), was = JSON.stringify(DS.holds || []);
      DS.holds = want.map(function (s) { return { stay:s.id, kind:'reservation', ref:'R' + s.id.toUpperCase(), name:s.name, roomType:s.roomType, from:s.from, to:s.to }; });
      if (JSON.stringify(DS.holds) !== was) { DS.lastSync = new Date().toISOString(); put(); }
    };
    tick = function () { syncNow(); setTimeout(tick, 1500); };
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href="#ukcb-connect"]');
      var yes = e.target.closest && e.target.closest('[data-ukcb-allow]'), no = e.target.closest && e.target.closest('[data-ukcb-cancel]');
      if (a) {
        e.preventDefault(); e.stopPropagation();
        var host = document.createElement('div'); host.className = 'ukdConsent';
        host.innerHTML = '<div class="ukdConsent_c" role="dialog" aria-modal="true" aria-labelledby="ukcbT"><span class="ukdConsent_s">Sandbox</span>' +
          '<div class="ukdConsent_l"><img src="assets/img/uk/pms/cloudbeds.png" alt=""><h2 id="ukcbT">Connect Ukreate to MiraGrace Estate?</h2></div>' +
          '<p>This stands in for Cloudbeds’ own app approval in the demo. In the live product the hotel approves Ukreate inside Cloudbeds.</p>' +
          '<ul><li>Read rooms, rates and reservations</li><li>Add creator stays as reservations, and cancel them</li><li>Ukreate cannot change your rates</li></ul>' +
          '<div class="ukdConsent_a"><button type="button" class="ukGhost" data-ukcb-cancel>Cancel</button><button type="button" class="ukBtn" data-ukcb-allow>Connect app</button></div></div>';
        document.body.appendChild(host); return;
      }
      if (yes || no) {
        e.target.closest('.ukdConsent').remove();
        flash = { result:yes ? 'connected' : 'denied' };
        if (yes) { DS = { on:true, holds:[] }; }
        put(); syncNow();
      }
    }, true);
    /* the demo dock can break it, the way a hotel removing Ukreate in Cloudbeds would */
    window.UKCLOUDBEDS_DEMO = { drop:function () { DS.broken = { at:new Date().toISOString(), message:'Ukreate was removed in Cloudbeds' }; put(); } };
    put();
  }

  if (document.querySelector('[data-ukapp]')) tick();
  return { state:state, refresh:refresh, onChange:onChange, connectUrl:connectUrl, disconnect:disconnect, syncNow:function () { syncNow(); },
    takeFlash:function () { var f = flash; flash = null; return f; }, peekFlash:function () { return flash; } };
})();
