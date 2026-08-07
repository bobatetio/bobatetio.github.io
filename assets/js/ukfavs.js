/* Ukreate — favourites. Loaded by BOTH /app/ and /creator/.

   A hotel keeps a shortlist of creators it would host again; a creator keeps a
   shortlist of properties worth pitching. Same gesture, both directions, because
   both sides are shopping.

   Deliberately private and one-sided: favouriting is a note to yourself, not a
   signal to the other party. A creator who could see they had been shortlisted
   would read it as an offer, and a hotel that could see it would price against
   it. Nothing here is ever shown to the person being favourited.

   localStorage on the shared origin, the way UKATTRIB, UKINVITE and UKREVIEWS
   already are. */
window.UKFAVS = (function () {
  var KEY = 'uk_favs_v1';

  function loadAll() {
    try {
      var raw = JSON.parse(localStorage.getItem(KEY) || '{}');
      return { creators: raw.creators || [], stays: raw.stays || [] };
    } catch (e) { return { creators: [], stays: [] }; }
  }
  function saveAll(all) {
    try { localStorage.setItem(KEY, JSON.stringify(all)); } catch (e) {}
  }

  /* 'creators' is the hotel's shortlist of people; 'stays' is the creator's
     shortlist of properties. Two lists, one record, so neither app has to know
     about the other's storage. */
  function list(kind) { return loadAll()[kind === 'stays' ? 'stays' : 'creators'].slice(); }
  function has(kind, id) { return list(kind).indexOf(id) > -1; }
  function count(kind) { return list(kind).length; }

  function toggle(kind, id) {
    var all = loadAll();
    var k = kind === 'stays' ? 'stays' : 'creators';
    var at = all[k].indexOf(id);
    if (at > -1) all[k].splice(at, 1); else all[k].push(id);
    saveAll(all);
    return at < 0;               /* true when it has just been added */
  }

  function reset() { saveAll({ creators: [], stays: [] }); }

  return { list: list, has: has, count: count, toggle: toggle, reset: reset };
})();
