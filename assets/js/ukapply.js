/* Ukreate — applications. A creator putting their hand up for a published stay.
   One record, written by both apps.

   This is the other direction of the trade from ukstays.js. A hotel publishes a
   stay; a creator applies to it; the hotel approves or passes. Before this, the
   creator's "Send my pitch" pushed a row into the creator app's OWN collaboration
   list and stopped there — the hotel never learned that anyone had applied. The
   creator watched a thread that existed only on their machine.

   Not the same thing as ukpitchin.js, and worth keeping apart. A PITCH is a
   creator writing to a property with no stay behind it — the creator went first
   and there is nothing to apply to yet. An APPLICATION hangs off a stay the
   hotel has already published. The hotel's response to a pitch is "shall I build
   a stay from this"; its response to an application is "yes or no". Two
   questions, two records.

   The state machine is deliberately small, because every state has to mean
   something on both sides:

     sent      the creator applied; the hotel has not answered
     approved  the hotel said yes — this becomes a collaboration
     passed    the hotel said no. It leaves the creator's pipeline; nothing is
               recorded against them and no reason is kept, because a no is a no
     withdrawn the creator pulled out before an answer

   localStorage on the shared origin, like every other cross-app record here. */
window.UKAPPLY = (function () {
  var KEY = 'uk_applications_v1';
  /* the signed-in creator is Amara Mensah, who is c1 on the hotel's roster —
     both apps must key on the same id or neither would find the other's rows */
  var ME = 'c1';

  function loadAll() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; }
  }
  function saveAll(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}
  }

  function all() { return loadAll(); }
  function byId(id) { return loadAll().filter(function (a) { return a.id === id; })[0] || null; }
  function forStay(stayId) {
    return loadAll().filter(function (a) { return a.stay === stayId; });
  }
  function open(stayId) {
    return forStay(stayId).filter(function (a) { return a.state === 'sent'; });
  }
  function mine(creatorId) {
    var who = creatorId || ME;
    return loadAll().filter(function (a) { return a.creator === who; });
  }
  /* has this creator already applied to this stay? The apply button has to know,
     or the same person can queue up three applications to one stay */
  function applied(stayId, creatorId) {
    var who = creatorId || ME;
    return loadAll().filter(function (a) {
      return a.stay === stayId && a.creator === who &&
             a.state !== 'withdrawn' && a.state !== 'passed';
    })[0] || null;
  }

  function nextId() {
    var n = 0;
    loadAll().forEach(function (a) {
      var m = String(a.id).match(/^ap(\d+)$/);
      if (m) n = Math.max(n, Number(m[1]));
    });
    return 'ap' + (n + 1);
  }

  /* The creator applying. Everything the hotel needs to judge it is written in
     at send time — who, for which stay, what they said, and enough of their own
     record to render a row without reaching into the creator app's data. */
  function send(app) {
    var already = applied(app.stay, app.creator || ME);
    if (already) return already;          /* one live application per stay */
    var list = loadAll();
    var rec = {
      id: nextId(),
      stay: app.stay,
      creator: app.creator || ME,
      creatorName: app.creatorName || '',
      creatorHandle: app.creatorHandle || '',
      creatorImg: app.creatorImg || '',
      creatorCity: app.creatorCity || '',
      creatorReach: app.creatorReach || null,
      msg: app.msg || '',
      state: 'sent',
      at: app.at || 'just now',
      msgs: [{ by: 'creator', at: app.at || 'just now', tx: app.msg || '' }]
    };
    list.unshift(rec);
    saveAll(list);
    return rec;
  }

  function setState(id, state) {
    var list = loadAll();
    var a = list.filter(function (x) { return x.id === id; })[0];
    if (!a) return null;
    a.state = state;
    a.at = 'just now';
    saveAll(list);
    return a;
  }
  function approve(id) { return setState(id, 'approved'); }
  function pass(id)    { return setState(id, 'passed'); }
  function withdraw(id){ return setState(id, 'withdrawn'); }

  /* Either side can add to the thread, and both read the same one. */
  function reply(id, text, by) {
    var list = loadAll();
    var a = list.filter(function (x) { return x.id === id; })[0];
    if (!a || !String(text || '').trim()) return null;
    a.msgs = (a.msgs || []).concat([{ by: by || 'hotel', at: 'just now', tx: String(text).trim() }]);
    saveAll(list);
    return a;
  }

  function reset() { saveAll([]); }

  return {
    ME: ME,
    all: all, byId: byId, forStay: forStay, open: open, mine: mine, applied: applied,
    send: send, setState: setState, approve: approve, pass: pass, withdraw: withdraw,
    reply: reply, reset: reset
  };
})();
