/* Ukreate — content delivery, the app's side. Hotel app.

   The delivery service (delivery/server.mjs) holds the drive connections and
   does the uploading; this file is how the app talks to it. It never sees a
   token: it reads status, asks for deliveries, and sends the hotel to the
   service to connect a drive.

   WHEN CONTENT IS SENT. As soon as content exists for a stay:
     - auto mode stays: when the creator's posts arrive (there is no approval
       step in auto mode, by design)
     - hosted stays: when the hotel approves the creator's content, which is
       the moment it becomes theirs (UK.approve, wrapped below)
   Each delivery fans out to every connected drive, into
   Ukreate / <Creator>, <dates or stay>.

   // PLUG-IN POINT — in production the platform posts to the service itself
   when content lands, so delivery does not depend on the hotel's browser
   being open. The service's /deliver endpoint is that same call. */
window.UKDELIVERY = (function () {
  var BASE = window.UKD_BASE || 'http://localhost:4396';
  var ST = { up:null, sandbox:false, providers:[], deliveries:[] };
  var listeners = [], flash = null;

  function changed() { listeners.forEach(function (fn) { try { fn(); } catch (e) {} }); }
  function onChange(fn) { listeners.push(fn); }
  function state() { return ST; }

  function refresh() {
    if (typeof fetch !== 'function') return Promise.resolve();
    return fetch(BASE + '/status', { cache:'no-store' }).then(function (r) { return r.json(); }).then(function (d) {
      var before = JSON.stringify(ST);
      ST = { up:true, sandbox:d.sandbox, providers:d.providers, deliveries:d.deliveries };
      if (JSON.stringify(ST) !== before) changed();
    }).catch(function () {
      if (ST.up !== false) { ST = { up:false, sandbox:false, providers:[], deliveries:[] }; changed(); }
    });
  }
  /* quick while something is uploading, slow otherwise, silent when the service is not running */
  function tick() {
    refresh().then(function () {
      var busy = ST.deliveries.some(function (d) { return d.status === 'sending'; });
      setTimeout(tick, ST.up ? (busy ? 1500 : 6000) : 30000);
    });
  }

  function connected() { return ST.providers.filter(function (p) { return p.connected; }); }
  function connectUrl(k) { return BASE + '/connect/' + k; }
  function disconnect(k) { return fetch(BASE + '/disconnect/' + k, { method:'POST' }).then(refresh); }
  function retry(id) { return fetch(BASE + '/retry/' + id, { method:'POST' }).then(refresh); }

  function deliver(stay, files) {
    if (!ST.up || !connected().length || !files.length) return Promise.resolve({ queued:false });
    return fetch(BASE + '/deliver', { method:'POST', headers:{ 'Content-Type':'application/json' },
      body:JSON.stringify({ stay:stay, files:files }) })
      .then(function (r) { return r.json(); })
      .then(function (r) { refresh(); return r; });
  }
  function ext(src) { var m = String(src).split('?')[0].match(/\.([a-z0-9]+)$/i); return m ? m[1].toLowerCase() : 'jpg'; }

  /* an auto mode stay's posts, named for the creator so the folder reads well */
  function deliverAutoStay(stayId) {
    var A = window.UKAUTO, D = window.UK;
    if (!A) return Promise.resolve({ queued:false });
    var m = A.model(), s = m.stay(stayId);
    if (!s) return Promise.reject(new Error('No stay ' + stayId));
    var c = D.creator(s.cr), title = c.n + ', ' + A.fmt.range(s.from, s.n);
    var posts = m.posts.filter(function (p) { return p.stay.id === stayId; });
    var files = posts.map(function (p, i) { return { name:c.n + ' ' + (i + 1) + '.' + ext(p.asset.img), url:p.asset.img }; });
    return deliver({ id:'auto-' + stayId, title:title }, files);
  }

  /* a hosted stay's approved content */
  function deliverCollab(collabId) {
    var D = window.UK, c = (D.collabs || []).filter(function (x) { return x.id === collabId; })[0];
    if (!c || !c.assets || !c.assets.length) return Promise.resolve({ queued:false });
    var cr = D.creator(c.who), stay = D.stay ? D.stay(c.stay) : null;
    var title = cr.n + ', ' + ((stay && stay.t) || 'hosted stay');
    var files = c.assets.map(function (id, i) {
      var a = (D.assets || []).filter(function (x) { return x.id === id; })[0];
      return a ? { name:cr.n + ' ' + (i + 1) + '.' + ext(a.img), url:a.img } : null;
    }).filter(Boolean);
    return deliver({ id:'collab-' + collabId, title:title }, files);
  }

  /* approval is when hosted-stay content becomes the hotel's: send it then */
  if (window.UK && typeof window.UK.approve === 'function') {
    var approve = window.UK.approve;
    window.UK.approve = function (collabId) {
      var n = approve.apply(this, arguments);
      if (n) deliverCollab(collabId);
      return n;
    };
  }

  /* coming back from a provider's sign-in screen */
  try {
    var q = new URLSearchParams(location.search), k = q.get('drive');
    if (k) {
      flash = { k:k, result:q.get('result') };
      q.delete('drive'); q.delete('result');
      history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q : ''));
    }
  } catch (e) {}
  function takeFlash() { var f = flash; flash = null; return f; }

  /* ---------- static demo: the sandbox, in the page ----------
     A published demo cannot reach a delivery service. It gets the same flow in
     the page instead, under the same Sandbox label: a marked sign-in screen,
     a connected account, deliveries that save after a moment. Nothing leaves
     the browser. */
  if (window.UKD_STATIC) {
    var KEY = 'ukd_static_v1', NAMES = { gdrive:'Google Drive', dropbox:'Dropbox', onedrive:'OneDrive', box:'Box' };
    var loadS = function () { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
    var saveS = function (v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} };
    var DS = loadS(); DS.conn = DS.conn || {}; DS.del = DS.del || [];
    var sync = function () {
      ST = { up:true, sandbox:true, deliveries:DS.del.slice(0, 40), providers:Object.keys(NAMES).map(function (k) {
        return { k:k, name:NAMES[k], configured:true, connected:!!DS.conn[k], account:DS.conn[k] || null, sandbox:true }; }) };
      saveS(DS); changed();
    };
    refresh = function () { return Promise.resolve(); };
    connectUrl = function (k) { return '#ukd-connect-' + k; };
    disconnect = function (k) { delete DS.conn[k]; sync(); return Promise.resolve(); };
    retry = function (id) {
      var d = DS.del.filter(function (x) { return x.id === id; })[0];
      if (d) { d.status = 'sending'; sync(); setTimeout(function () { d.files.forEach(function (f) { f.ok = true; delete f.error; }); d.status = 'delivered'; d.doneAt = new Date().toISOString(); sync(); }, 900); }
      return Promise.resolve();
    };
    deliver = function (stay, files) {
      var on = Object.keys(DS.conn);
      if (!on.length || !files.length) return Promise.resolve({ queued:false, reason:'No drive connected' });
      var ids = on.map(function (k) {
        var already = DS.del.some(function (d) { return d.provider === k && d.stay === stay.id && d.status === 'delivered'; });
        var d = { id:Math.random().toString(36).slice(2, 10), provider:k, stay:stay.id, title:stay.title, at:new Date().toISOString(),
          status:'sending', folder:'Ukreate / ' + stay.title,
          files:files.map(function (f) { return { name:f.name, ok:false, skipped:already }; }) };
        DS.del.unshift(d);
        setTimeout(function () { d.files.forEach(function (f) { f.ok = true; }); d.status = 'delivered'; d.doneAt = new Date().toISOString(); sync(); }, 1200 + Math.random() * 800);
        return d.id;
      });
      sync(); return Promise.resolve({ queued:true, deliveries:ids });
    };
    /* the marked sign-in screen, drawn in the page */
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#ukd-connect-"]');
      var yes = e.target.closest && e.target.closest('[data-ukd-allow]'), no = e.target.closest && e.target.closest('[data-ukd-cancel]');
      if (a) {
        e.preventDefault(); e.stopPropagation();
        var k = a.getAttribute('href').replace('#ukd-connect-', ''), host = document.createElement('div');
        host.className = 'ukdConsent'; host.setAttribute('data-ukd-k', k);
        host.innerHTML = '<div class="ukdConsent_c" role="dialog" aria-modal="true" aria-labelledby="ukdT"><span class="ukdConsent_s">Sandbox</span>' +
          '<div class="ukdConsent_l"><img src="assets/img/uk/drives/' + k + '.png" alt=""><h2 id="ukdT">Allow Ukreate to use ' + NAMES[k] + '?</h2></div>' +
          '<p>This stands in for ' + NAMES[k] + '\u2019s own sign-in in the demo. In the live product this is ' + NAMES[k] + '\u2019s real screen.</p>' +
          '<ul><li>Ukreate can add files and folders it creates</li><li>Ukreate cannot see your other files</li></ul>' +
          '<div class="ukdConsent_a"><button type="button" class="ukGhost" data-ukd-cancel>Cancel</button><button type="button" class="ukBtn" data-ukd-allow>Allow</button></div></div>';
        document.body.appendChild(host);
        return;
      }
      if (yes || no) {
        var box = e.target.closest('.ukdConsent'), kk = box.getAttribute('data-ukd-k');
        box.remove();
        if (yes) DS.conn[kk] = 'gm@miragrace-demo.test';
        flash = { k:kk, result:yes ? 'connected' : 'denied' };
        sync();
      }
    }, true);
    sync();
  }
  else if (document.querySelector('[data-ukapp]')) tick();
  return { state:state, refresh:refresh, onChange:onChange, connected:connected, connectUrl:connectUrl,
    disconnect:disconnect, retry:retry, deliver:deliver, deliverAutoStay:deliverAutoStay, deliverCollab:deliverCollab,
    takeFlash:takeFlash, peekFlash:function () { return flash; } };
})();
