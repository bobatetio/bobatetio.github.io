/* Ukreate — the stay registry. One record, written by /app/ and read by both.

   A stay is the single object this marketplace turns on: the hotel publishes it,
   the creator finds it, and everything after that hangs off it. It was the one
   thing the two sides did NOT share. Each app carried its own seeded list — the
   hotel's twenty, the creator's twenty-two — that happened to reuse some ids and
   otherwise had nothing to do with each other. Publishing on the hotel side set
   a flag and repainted a confirmation screen; it never created a stay at all, so
   nothing could have crossed even if the lists had been joined.

   So: a hotel publishes into here, and the creator's Discover list reads out of
   here. The seeded stays on both sides stay where they are — they are the rest
   of the market, other properties a creator can browse — and a hotel only ever
   sees its own.

   ONE SHAPE, both readings. The hotel names a stay ("Spa season, midweek") and
   knows the property implicitly; the creator names the property and needs its
   city and coordinates to place it on a map. The record carries both, so
   neither side has to guess at the other's fields, and `forCreator()` is the
   only translation in the system.

   localStorage on the shared origin, like every other cross-app record here. */
window.UKSTAYS = (function () {
  var KEY = 'uk_stays_v1';

  function loadAll() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; }
  }
  function saveAll(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}
  }

  function all() { return loadAll(); }
  function get(id) { return loadAll().filter(function (s) { return s.id === id; })[0] || null; }

  /* Everything a hotel has published, newest first. A hotel only ever sees its
     own, which is what `property` is for — the demo runs one property, but the
     filter is the honest shape and costs nothing now. */
  function forProperty(name) {
    return loadAll().filter(function (s) {
      return !name || !s.property || s.property.name === name;
    });
  }

  /* Only what a creator is allowed to see: published, still open, and either
     public or addressed to them. A private stay is a real thing in this product
     — it goes to the named creators and nobody else. */
  function forCreator(creatorId) {
    return loadAll().filter(function (s) {
      if (s.status !== 'live') return false;
      if (s.visibility !== 'private') return true;
      return (s.invited || []).indexOf(creatorId) > -1;
    }).map(toCreator);
  }

  /* The creator side's reading of the same record. Its Discover list, its stay
     card and its scoring all expect these names; rather than teach every one of
     them a second shape, the translation happens once, here. */
  function toCreator(s) {
    var p = s.property || {};
    return {
      id: s.id,
      hotel: p.name || '',
      city: p.city || '',
      cc: p.cc || null,
      lat: p.lat, lng: p.lng,
      img: (s.shots && s.shots[0]) || s.img || '',
      imgs: (s.shots && s.shots.length ? s.shots : [s.img]).filter(Boolean),
      nights: s.nights,
      room: s.rooms || '',
      inc: s.inc || (s.incList || []).join(', '),
      del: s.del || [],
      rights: 'They keep and use the content',
      style: s.type || p.cat || '',
      /* the audience band the hotel hopes for — what the creator's fit score
         is computed against */
      wants: s.reach || '5K - 25K',
      vibe: s.vibe || 'Quiet & slow',
      budget: s.budget || 'Independent',
      score: s.score || 8,
      from: s.from || '',
      to: s.to || '',
      why: s.why || '',
      saved: false,
      /* so the creator side can tell a real published stay from its own seed */
      published: true,
      publishedAt: s.at
    };
  }

  /* The hotel's own reading. Its Hosted stays page expects `t`, `status`, `apps`
     and a flat `inc`, so a published stay arrives in the list looking like every
     other row rather than like a special case. */
  function toHotel(s) {
    return {
      id: s.id, t: s.t, img: (s.shots && s.shots[0]) || s.img || '',
      shots: s.shots || [], nights: s.nights, capacity: s.capacity,
      rooms: s.rooms, inc: s.inc || (s.incList || []).join(', '),
      incList: s.incList || [], from: s.from, to: s.to,
      status: s.status, apps: s.apps || 0, reach: s.reach, type: s.type,
      del: s.del || [], rights: s.rights || 'Yours in perpetuity, all channels',
      visibility: s.visibility, invited: s.invited || [],
      brief: s.brief || '', guide: s.guide || '',
      published: true, publishedAt: s.at
    };
  }

  function nextId() {
    var n = 0;
    loadAll().forEach(function (s) {
      var m = String(s.id).match(/^ps(\d+)$/);
      if (m) n = Math.max(n, Number(m[1]));
    });
    /* prefixed so a published stay can never collide with a seeded s1..s22 on
       either side, however many either app seeds later */
    return 'ps' + (n + 1);
  }

  /* The hotel publishing. Everything the creator side needs to render and score
     the stay has to be resolved HERE, at write time — the creator app cannot
     reach into the hotel's data to fill a gap later. */
  function publish(stay) {
    var list = loadAll();
    var rec = {
      id: stay.id || nextId(),
      t: stay.t || 'Untitled stay',
      property: stay.property || null,
      shots: (stay.shots || []).filter(Boolean),
      img: stay.img || (stay.shots || [])[0] || '',
      nights: stay.nights || null,
      capacity: stay.capacity || 1,
      rooms: stay.rooms || '',
      incList: stay.incList || [],
      inc: stay.inc || (stay.incList || []).join(', '),
      del: stay.del || [],
      rights: stay.rights || 'Yours in perpetuity, all channels',
      from: stay.from || '', to: stay.to || '',
      reach: stay.reach || '', type: stay.type || '',
      vibe: stay.vibe || '', budget: stay.budget || '', score: stay.score || 9,
      why: stay.why || '',
      brief: stay.brief || '', guide: stay.guide || '',
      visibility: stay.visibility === 'private' ? 'private' : 'public',
      invited: stay.invited || [],
      status: 'live',
      apps: 0,
      at: stay.at || 'just now'
    };
    var at = list.map(function (s) { return s.id; }).indexOf(rec.id);
    if (at > -1) list[at] = rec; else list.unshift(rec);
    saveAll(list);
    return rec;
  }

  function update(id, patch) {
    var list = loadAll();
    var s = list.filter(function (x) { return x.id === id; })[0];
    if (!s) return null;
    Object.keys(patch || {}).forEach(function (k) { s[k] = patch[k]; });
    saveAll(list);
    return s;
  }

  /* Closing a stay is not deleting it. The collaborations that came out of it
     still have to point at something. */
  function close(id) { return update(id, { status: 'closed' }); }
  function remove(id) {
    saveAll(loadAll().filter(function (s) { return s.id !== id; }));
  }
  /* counted from the applications record rather than stored, so it can never
     drift from the number of applications that actually exist */
  function countApps(id, n) { return update(id, { apps: n }); }

  function reset() { saveAll([]); }

  return {
    all: all, get: get, forProperty: forProperty, forCreator: forCreator,
    toCreator: toCreator, toHotel: toHotel,
    publish: publish, update: update, close: close, remove: remove,
    countApps: countApps, nextId: nextId, reset: reset
  };
})();
