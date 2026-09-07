/* Ukreate — the public stay detail.

   window.UKSTAY is the app's own stay card, the one component both /app/ and
   /creator/ render, carrying the gallery, the spec strip (nights, room, party,
   dates, deliverables, score), what is included and what is asked for. This
   page calls it with the same stay record the signed-in creator's Discover view
   reads, so the visitor sees the real thing rather than a summary of it.

   Two controls change. Pitch and Save are the point of action, so they become
   signup prompts in the creator's voice. Nothing else is withheld. */
(function () {
  var D = window.UKC;
  var mount = document.querySelector('[data-pub-stay]');
  if (!D || !mount || !window.UKSTAY) return;

  var id = mount.getAttribute('data-pub-stay') || new URLSearchParams(location.search).get('id');
  var s = (D.stays || []).filter(function (x) { return x.id === id; })[0];
  if (!s) { mount.innerHTML = '<p class="ukPub_empty">That stay has closed.</p>'; return; }

  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) {
      return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; });
  }

  /* the card in its creator reading: the property comes with each stay */
  var html = window.UKSTAY.card(s, null, { of: 'creator', actions: false });

  mount.innerHTML =
    '<div class="ukPubStay">' + html + '</div>' +
    '<aside class="ukPubGate">' +
      '<p class="ukPubGate_t">Everything about this stay is open. Pitching for it is the part that needs an account.</p>' +
      '<p class="ukPubGate_p">Set up your profile and you can pitch this one, save the stays you like the look of, ' +
      'and let ' + esc(s.hotel) + ' see the work you have already delivered. It is free, and it takes about ten minutes.</p>' +
      '<div class="ukPubGate_row">' +
        '<a class="btn btn--gold" href="/join/?side=creator&amp;stay=' + esc(s.id) + '">' +
          '<strong class="btnRoll"><span data-hover="Pitch this stay"><em>Pitch this stay</em></span></strong></a>' +
        '<a class="btn btn--white" href="/join/?side=creator">' +
          '<strong class="btnRoll"><span data-hover="Save for later"><em>Save for later</em></span></strong></a>' +
      '</div>' +
    '</aside>';
})();
