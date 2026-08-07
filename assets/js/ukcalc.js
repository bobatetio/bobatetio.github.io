/* Ukreate — Creator affordability calculator (popup modal). Hotel side only.

   This deliberately does not invent a parallel model of the business: every number
   comes from data and formulas the rest of the app already uses.
   - Tier night-counts come straight from D.packages (Starter/Standard/Feature), the
     same three shapes Host a Creator step 1 offers.
   - The savings formula is exactly D.roiTotals's OTA-commission comparison —
     revenue x D.COMMISSION.ota is what an OTA would have taken, revenue x
     (D.COMMISSION.uk + D.COMMISSION.creator) is what Ukreate/the creator actually
     take, and the difference is what the dashboard's and the ROI page's
     "Kept, not paid out" cards already call "saved". Same inputs, same maths.
   - The default nightly rate is derived from D.attribution (the same rows the ROI
     page sums), not a made-up number: total attributed revenue / total nights
     across every tracked booking. */
(function () {
  var D = window.UK;
  if (!D) return;

  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) {
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; }); };

  var CALC_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2"/>' +
    '<path d="M8 7h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h.01M12 19h.01M16 19h.01"/></svg>';
  var CLOSE_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
  /* Row icons reuse the same exported icon pack as the rest of the app (window.UKICONS)
     rather than one-off custom outlines, so these read as the same visual language. */
  function packIcon(name) {
    return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' + ((window.UKICONS || {})[name] || '') + '</svg>';
  }
  var BED_ICON = packIcon('building');
  var TAG_ICON = packIcon('bag');
  var PCT_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 5 5 19M7 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/></svg>';
  var ARROW_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';

  function money(n) { return D.money(Math.round(n)); }

  /* Same rows the ROI page sums, so the default rate this calculator opens with is
     the property's own real average, not an invented placeholder. */
  function defaultRate() {
    /* Only when the attributed rows are real. For a property whose booking
       tracking is not live they are seeded demonstration data, and opening a
       calculator on a rate derived from bookings that hotel never had would be
       the same lie the ROI page was just stopped from telling. The field is
       editable and typing your own rate over it is the first thing anyone does.
       // PLUG-IN POINT — the property's own published nightly rate. */
    if (!D.trackingLive()) return 250;
    var t = D.roiTotals(D.attribution);
    return t.nights ? Math.round(t.revenue / t.nights) : 250;
  }

  var STATE = null;
  function state() {
    if (!STATE) STATE = { nights: 30, rate: defaultRate(), ota: D.COMMISSION.ota };
    return STATE;
  }

  function tierRows() {
    var s = state();
    return D.packages.map(function (p) {
      var n = parseInt(p.nights, 10) || 1;
      return { id: p.id, n: p.n, tierNights: n, stays: Math.max(0, Math.floor(s.nights / n)), rec: !!p.rec };
    });
  }

  /* Which tier the CTA pre-suggests: the recommended package if the available
     nights actually support it at least once, otherwise whichever tier they do
     support — so the suggestion is never a shape the hotel cannot actually run. */
  function bestTier(rows) {
    var rec = rows.filter(function (r) { return r.rec; })[0];
    if (rec && rec.stays > 0) return rec;
    var can = rows.filter(function (r) { return r.stays > 0; });
    return can.length ? can[can.length - 1] : rows[0];
  }

  function calcResults() {
    var s = state();
    var revenue = s.nights * s.rate;
    var commission = revenue * (D.COMMISSION.uk + D.COMMISSION.creator) / 100;
    var otaWould = revenue * s.ota / 100;
    return { revenue: revenue, commission: commission, otaWould: otaWould, saved: otaWould - commission };
  }

  function tierMarkup() {
    var rows = tierRows(), best = bestTier(rows);
    return rows.map(function (r) {
      var isBest = r.id === best.id && r.stays > 0;
      return '<li class="ukCalcTier' + (isBest ? ' is-best' : '') + '">' +
        '<span class="ukCalcTier_b"><span class="ukCalcTier_n">' + esc(r.n) +
          (r.rec ? '<span class="ukCalcTier_rec">Recommended</span>' : '') + '</span>' +
        '<span class="ukCalcTier_s">' + r.tierNights + (r.tierNights === 1 ? ' night' : ' nights') + ' each</span></span>' +
        '<span class="ukCalcTier_v">' + r.stays + (r.stays === 1 ? ' stay' : ' stays') + '</span></li>';
    }).join('');
  }

  function resultMarkup() {
    var s = state(), res = calcResults();
    return '<p class="ukCalcSaved_l">You could keep</p>' +
      '<p class="ukCalcSaved" data-calc-saved>' + money(res.saved) + '</p>' +
      '<p class="ukCalcSaved_n" data-calc-note>What an OTA would have taken on the same ' + s.nights +
        (s.nights === 1 ? ' night' : ' nights') + ' at ' + money(s.rate) + '/night, at ' + s.ota +
        '% against your ' + (D.COMMISSION.uk + D.COMMISSION.creator) + '%.</p>';
  }

  function panelMarkup() {
    var s = state();
    return '<div class="ukCalcWrap" data-calc-wrap hidden>' +
      '<div class="ukCalcPanel" role="dialog" aria-modal="true" aria-labelledby="ukCalcTitle" data-calc-panel>' +
        '<button class="ukCalcClose" type="button" data-calc-close aria-label="Close calculator">' + CLOSE_ICON + '</button>' +
        '<div class="ukCalcHead">' +
          '<span class="ukCalcHead_ic" aria-hidden="true" data-lottie-src="/assets/lottie/calc-icon.json?v=3" data-lottie-loop="false"></span>' +
          '<div><h2 id="ukCalcTitle" class="ukCalcHead_t">Creator affordability calculator</h2>' +
          '<p class="ukCalcHead_p">See how many creators your empty nights can host, and what that saves against an OTA.</p></div>' +
        '</div>' +
        '<div class="ukCalcBody">' +
          '<div class="ukCalcGroup">' +
            '<p class="ukCalcGroup_l">Your nights</p>' +
            '<label class="ukCalcRow"><span class="ukCalcRow_ic" aria-hidden="true">' + BED_ICON + '</span>' +
              '<span class="ukCalcRow_b"><span class="ukCalcRow_lbl">Empty nights available</span>' +
              '<span class="ukCalcRow_hint">Over the period you are planning for</span></span>' +
              '<input class="ukCalcRow_in" type="number" min="0" step="1" inputmode="numeric" ' +
                'aria-label="Empty nights available" data-calc-field="nights" value="' + s.nights + '"></label>' +
            '<label class="ukCalcRow"><span class="ukCalcRow_ic" aria-hidden="true">' + TAG_ICON + '</span>' +
              '<span class="ukCalcRow_b"><span class="ukCalcRow_lbl">Average nightly rate</span>' +
              /* The hint has to describe where the number in the field actually
                 came from. Without live tracking there are no tracked bookings for
                 it to have come from, and the honest answer is that it is a
                 starting point to type over. */
              '<span class="ukCalcRow_hint">' + (D.trackingLive()
                ? 'From your tracked bookings' : 'A starting point. Enter your own rate.') +
              '</span></span>' +
              '<span class="ukCalcRow_pre">$</span>' +
              '<input class="ukCalcRow_in" type="number" min="0" step="1" inputmode="numeric" ' +
                'aria-label="Average nightly rate" data-calc-field="rate" value="' + s.rate + '"></label>' +
            '<label class="ukCalcRow"><span class="ukCalcRow_ic" aria-hidden="true">' + PCT_ICON + '</span>' +
              '<span class="ukCalcRow_b"><span class="ukCalcRow_lbl">Typical OTA commission</span>' +
              '<span class="ukCalcRow_hint">What you would pay to sell these nights through an OTA</span></span>' +
              '<input class="ukCalcRow_in" type="number" min="0" max="100" step="1" inputmode="numeric" ' +
                'aria-label="Typical OTA commission percentage" data-calc-field="ota" value="' + s.ota + '"></label>' +
          '</div>' +
          '<div class="ukCalcGroup">' +
            '<p class="ukCalcGroup_l">What you could host</p>' +
            '<ul class="ukCalcTiers" data-calc-tiers>' + tierMarkup() + '</ul>' +
          '</div>' +
          '<div class="ukCalcGroup ukCalcGroup--result">' +
            '<div class="ukCalcResult" data-calc-result aria-live="polite">' + resultMarkup() + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="ukCalcFoot">' +
          '<button class="ukGhost" type="button" data-calc-action="creators">See who is available to host</button>' +
          '<button class="ukBtn" type="button" data-calc-action="host" data-tier="' + bestTier(tierRows()).id + '">' +
            'Start hosting <span data-calc-tiername>&mdash; ' + esc(bestTier(tierRows()).n) + '</span></button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  var lastFocused = null;

  function wrapEl() { return document.querySelector('[data-calc-wrap]'); }

  function refresh() {
    var wrap = wrapEl();
    if (!wrap) return;
    var rows = tierRows(), best = bestTier(rows);
    wrap.querySelector('[data-calc-tiers]').innerHTML = tierMarkup();
    wrap.querySelector('[data-calc-result]').innerHTML = resultMarkup();
    var hostBtn = wrap.querySelector('[data-calc-action="host"]');
    hostBtn.dataset.tier = best.id;
    var tierNameEl = hostBtn.querySelector('[data-calc-tiername]');
    if (tierNameEl) tierNameEl.textContent = '\u2014 ' + best.n;
  }

  function focusables(panel) {
    return Array.prototype.slice.call(
      panel.querySelectorAll('button, input, [href], [tabindex]:not([tabindex="-1"])')
    ).filter(function (el) { return !el.disabled && el.offsetParent !== null; });
  }

  function onKeydown(e) {
    var wrap = wrapEl();
    if (!wrap || wrap.hidden) return;
    if (e.key === 'Escape') { closeCalc(); return; }
    if (e.key !== 'Tab') return;
    var panel = wrap.querySelector('[data-calc-panel]');
    var f = focusables(panel);
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function onClick(e) {
    var wrap = wrapEl();
    if (!wrap || wrap.hidden) return;
    if (e.target === wrap) { closeCalc(); return; }
    if (e.target.closest('[data-calc-close]')) { closeCalc(); return; }
    if (e.target.closest('[data-calc-action="creators"]')) {
      closeCalc();
      if (window.UKGO) window.UKGO('creators');
      return;
    }
    var hostBtn = e.target.closest('[data-calc-action="host"]');
    if (hostBtn) {
      var tierId = hostBtn.dataset.tier;
      var pkg = D.packages.filter(function (p) { return p.id === tierId; })[0] ||
                D.packages.filter(function (p) { return p.rec; })[0];
      closeCalc();
      if (window.UKPREFILL && pkg) {
        window.UKPREFILL('host', { form: {
          pkg: pkg.id, nights: pkg.nights, inc: pkg.inc, reach: pkg.reach,
          type: (D.property && D.property.cat) || '', del: Object.assign({}, pkg.del), date: ''
        } });
      } else if (window.UKGO) window.UKGO('host');
      return;
    }
  }

  function onInput(e) {
    var f = e.target.closest('[data-calc-field]');
    if (!f) return;
    var key = f.dataset.calcField;
    var v = parseFloat(f.value);
    if (isNaN(v) || v < 0) return;
    if (key === 'ota') v = Math.min(100, v);
    state()[key] = v;
    refresh();
  }

  function openCalc() {
    lastFocused = document.activeElement;
    var wrap = wrapEl();
    if (!wrap) {
      document.body.insertAdjacentHTML('beforeend', panelMarkup());
      wrap = wrapEl();
      wrap.addEventListener('click', onClick);
      wrap.addEventListener('input', onInput);
    } else {
      // reset the form fields to the live state each time it reopens, so the numbers
      // never go stale between visits (e.g. a booking landed and moved the average rate)
      state().rate = defaultRate();
      wrap.querySelector('[data-calc-field="nights"]').value = state().nights;
      wrap.querySelector('[data-calc-field="rate"]').value = state().rate;
      wrap.querySelector('[data-calc-field="ota"]').value = state().ota;
      refresh();
    }
    wrap.hidden = false;
    document.body.classList.add('uk-calc-open');
    wrap.querySelector('[data-calc-close]').focus();
  }

  function closeCalc() {
    var wrap = wrapEl();
    if (!wrap || wrap.hidden) return;
    wrap.hidden = true;
    document.body.classList.remove('uk-calc-open');
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  document.addEventListener('keydown', onKeydown);
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-calc-open]')) { e.preventDefault(); openCalc(); }
  });

  window.UKCALC = { open: openCalc, close: closeCalc, icon: CALC_ICON, arrowIcon: ARROW_ICON };
})();
