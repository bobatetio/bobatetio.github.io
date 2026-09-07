/* Ukreate — hero type tuner. LOCAL ONLY.

   A panel for adjusting the hero's typography live, so the size/leading/
   tracking/case/alignment conversation can happen in the browser instead of
   over screenshots. It writes a single <style> block and prints the CSS it
   produced, ready to paste back.

   It refuses to run anywhere but localhost, and it is loaded from its own file
   so deleting the file and its <script> tag removes it completely. */
(function () {
  var LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  if (!LOCAL) return;

  var KEY = 'ukTune.v1';
  var FONTS = ['Marcellus', 'Marcellus SC', 'Oranienbaum', 'DM Serif Display', 'Lato', 'Inter'];

  /* Defaults are read off the page rather than hardcoded, so the panel opens
     showing what the stylesheet actually says and stays a no-op until a control
     is touched. Hardcoding them meant the panel silently overrode the file with
     whatever the values happened to be when it was written. */
  function px(v) { return parseFloat(v) || 0; }
  function readPage() {
    var h1 = document.querySelector('.legionHero_title');
    var ln = document.querySelector('.legionHero_line');
    var ld = document.querySelector('.legionHero_lede');
    var mn = document.querySelector('.legionHero_main');
    var ct = getComputedStyle(h1), ce = getComputedStyle(ln), cd = getComputedStyle(ld);
    var size = px(ce.fontSize);
    /* read leading and tracking from the line, which is where they now live */
    var fam = (ct.fontFamily || '').split(',')[0].replace(/['"]/g, '').trim();
    return {
      lines: [].map.call(document.querySelectorAll('.legionHero_line'),
                function (n) { return n.textContent; }).join('\n'),
      lede: ld ? ld.textContent.trim() : '',
      family: fam || 'Marcellus',
      size: Math.round(size),
      lh: +(px(ce.lineHeight) / (size || 1)).toFixed(2),
      ls: +((px(ce.letterSpacing) / (size || 1)) * 100).toFixed(1),
      tt: ct.textTransform === 'none' ? 'none' : ct.textTransform,
      align: getComputedStyle(mn).textAlign === 'start' ? 'left' : getComputedStyle(mn).textAlign,
      ledeSize: +px(cd.fontSize).toFixed(1),
      ledeLh: +(px(cd.lineHeight) / (px(cd.fontSize) || 1)).toFixed(2),
      ledeWidth: 61,
      badge: 1, gap: 14,
      bg: Math.round(parseFloat(getComputedStyle(document.querySelector('.ukHeroBg')).opacity) * 100)
    };
  }
  var D = readPage();
  var S = Object.assign({}, D);
  var touched = false;
  try {
    var saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved) { Object.assign(S, saved); touched = true; }
  } catch (e) {}

  var style = document.createElement('style'); style.id = 'ukTuneStyle';
  document.head.appendChild(style);

  function css() {
    var jc = S.align === 'center' ? 'center' : S.align === 'right' ? 'flex-end' : 'flex-start';
    return [
/* leading and tracking go on the lines: the h1 is 16px, the lines carry the
   display size, so em/unitless values must resolve there */
'.legionHero_title{font-family:\'' + S.family + '\',Georgia,serif;text-transform:' + S.tt + '}',
'.legionHero_line{font-size:' + S.size + 'px;line-height:' + S.lh +
'  ;letter-spacing:' + (S.ls/100) + 'em;margin-inline:' + (S.align==='center'?'auto':'0') + '}',
'.legionHero_lede{font-size:' + S.ledeSize + 'px;line-height:' + S.ledeLh + ';',
'  max-width:' + S.ledeWidth + 'ch;margin-inline:' + (S.align==='center'?'auto':'0') + ';text-align:' + S.align + '}',
'.legionHero_main{text-align:' + S.align + '}',
'.legionHero_main>*+*{margin-top:' + S.gap + 'px}',
'.homeHeader_contents.layer{align-items:' + jc + '}',
'.hero__buttons{justify-content:' + jc + '}',
'.hero__badge{align-self:' + jc + ';opacity:' + S.badge + '}',
'.ukHeroBg{opacity:' + (S.bg/100) + '}'
    ].join('\n');
  }

  function applyLines() {
    var h1 = document.querySelector('.legionHero_title');
    var lede = document.querySelector('.legionHero_lede');
    if (h1) h1.innerHTML = S.lines.split('\n').filter(function (l) { return l.trim(); })
      .map(function (l) { return '<span class="legionHero_line">' + l + '</span>'; }).join('');
    if (lede) lede.textContent = S.lede;
  }

  function render() {
    /* nothing is written until a control is used, so an untouched panel cannot
       change what the stylesheet renders */
    style.textContent = touched ? css() : '';
    var out = document.getElementById('ukTuneOut');
    if (out) out.value = css();
    if (touched) { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  }

  /* ---------- the panel ---------- */
  var p = document.createElement('div');
  p.id = 'ukTune';
  p.innerHTML =
    '<header><b>Hero type</b><span><button data-act="reset">Reset</button>' +
    '<button data-act="fold">&minus;</button></span></header><div class="ukTune_b">' +
    '<label>Headline — one line per row<textarea data-k="lines" rows="3"></textarea></label>' +
    '<label>Sub-headline<textarea data-k="lede" rows="3"></textarea></label>' +
    '<label>Typeface<select data-k="family">' + FONTS.map(function (f) {
      return '<option value="' + f + '">' + f + '</option>'; }).join('') + '</select></label>' +
    '<label>Case<select data-k="tt">' +
      ['none','capitalize','uppercase','lowercase'].map(function (v) {
        return '<option value="' + v + '">' + v + '</option>'; }).join('') + '</select></label>' +
    '<label>Align<select data-k="align">' +
      ['left','center','right'].map(function (v) {
        return '<option value="' + v + '">' + v + '</option>'; }).join('') + '</select></label>' +
    row('size','Size', 20, 110, 1, 'px') +
    row('lh','Line height', 0.85, 1.8, 0.01, '') +
    row('ls','Tracking', -6, 6, 0.1, '/100em') +
    row('gap','Stack gap', 0, 60, 1, 'px') +
    row('ledeSize','Sub size', 12, 28, 0.5, 'px') +
    row('ledeLh','Sub leading', 1.2, 2.2, 0.05, '') +
    row('ledeWidth','Sub measure', 30, 90, 1, 'ch') +
    row('badge','Badge opacity', 0, 1, 0.05, '') +
    row('bg','Photo opacity', 0, 100, 1, '%') +
    '<label>CSS<textarea id="ukTuneOut" rows="7" readonly></textarea></label>' +
    '<button data-act="copy" class="ukTune_copy">Copy CSS</button></div>';
  document.body.appendChild(p);

  function row(k, label, min, max, step, unit) {
    return '<label class="ukTune_r"><span>' + label +
      ' <i data-v="' + k + '"></i><em>' + unit + '</em></span>' +
      '<input type="range" data-k="' + k + '" min="' + min + '" max="' + max +
      '" step="' + step + '"></label>';
  }

  // seed every control from state
  p.querySelectorAll('[data-k]').forEach(function (el) { el.value = S[el.dataset.k]; });
  function labels() {
    p.querySelectorAll('[data-v]').forEach(function (n) { n.textContent = S[n.dataset.v]; });
  }

  p.addEventListener('input', function (e) {
    var k = e.target.dataset.k; if (!k) return;
    touched = true;
    S[k] = e.target.type === 'range' ? parseFloat(e.target.value) : e.target.value;
    if (k === 'lines' || k === 'lede') applyLines();
    labels(); render();
  });

  p.addEventListener('click', function (e) {
    var a = e.target.dataset.act;
    if (a === 'fold') { p.classList.toggle('is-fold');
      e.target.textContent = p.classList.contains('is-fold') ? '+' : '−'; }
    if (a === 'reset') { S = Object.assign({}, D); touched = false;
      try { localStorage.removeItem(KEY); } catch (err) {}
      p.querySelectorAll('[data-k]').forEach(function (el) { el.value = S[el.dataset.k]; });
      applyLines(); labels(); render(); }
    if (a === 'copy') { var o = document.getElementById('ukTuneOut');
      o.select(); document.execCommand('copy');
      e.target.textContent = 'Copied'; setTimeout(function () { e.target.textContent = 'Copy CSS'; }, 1200); }
  });

  applyLines(); labels(); render();
})();
