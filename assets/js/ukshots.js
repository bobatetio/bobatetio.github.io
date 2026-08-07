/* Ukreate - the property's photographs. Add, reframe, remove.

   THIS IS THE ONE FROM /start/. It was written for the original hotel onboarding
   and it is the only real version of this in the product: a drop area that also
   takes a file picker, tiles with a remove and a Reframe control, and a crop
   editor you drag to choose the focal point, which writes the actual cropped
   file through a canvas.

   When onboarding moved into the app the photographs step was rebuilt from
   nothing: a grid of thumbnails with a remove button, no crop, no drag-and-drop.
   That is a worse answer to a question this already answers properly, and it
   also invented a `.ukShot` class that collided with the content library's card
   of the same name.

   So it lives here now and both call it. The state object is passed in rather
   than owned, because the start page keeps its answers in `f` and the in-app
   gate keeps them in localStorage, and neither should have to adopt the other's
   storage to reuse a component. Every class name below is one ukapp.css already
   defines; nothing here is new.

   WHY CROP AT ALL. Every listing photo is cropped to one ratio before it is ever
   shown. A grid of phone photos at whatever aspect they happened to be shot at is
   the difference between a listing that looks run and one that looks abandoned,
   and the creator side renders these in fixed tiles either way. The crop starts
   centred and the host drags the focal point; the original is kept, so
   re-cropping never degrades.

   // PLUG-IN POINT - real uploads. takeFiles() is where a signed upload would
   // replace the FileReader, and shotOut() is what every reader of a photo asks
   // for, so the shape does not change. */
window.UKSHOTS = (function () {
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' })[c];
    });
  }

  var SHOT_AR = 4 / 3, SHOT_W = 1280, SHOT_H = 960, MAX = 8;
  var ADVICE = 'Landscape, 1600 × 1200 or larger. We crop to 4:3 for the listing.';

  /* what every reader of a photo asks for: the cropped file if there is one */
  function out(sh) { return sh.out || sh.src; }

  /* The same arithmetic object-position uses, so the editor preview and the
     written file are the same crop rather than two guesses at it. */
  function cropShot(sh, done) {
    var img = new Image();
    img.onload = function () {
      var c = document.createElement('canvas');
      c.width = SHOT_W; c.height = SHOT_H;
      var ctx = c.getContext('2d');
      var ir = img.width / img.height, sw, sh2;
      if (ir > SHOT_AR) { sh2 = img.height; sw = sh2 * SHOT_AR; }
      else { sw = img.width; sh2 = sw / SHOT_AR; }
      ctx.drawImage(img, (img.width - sw) * sh.fx, (img.height - sh2) * sh.fy, sw, sh2,
                    0, 0, SHOT_W, SHOT_H);
      try { sh.out = c.toDataURL('image/jpeg', 0.86); } catch (e) { sh.out = sh.src; }
      done && done();
    };
    img.onerror = function () { sh.out = sh.src; done && done(); };
    img.src = sh.src;
  }

  /* one path for files, whether they arrive by picker or by drop */
  function takeFiles(fileList, st, repaint) {
    st.photos = st.photos || [];
    var files = [].slice.call(fileList).slice(0, MAX - st.photos.length);
    var pending = files.length;
    if (!pending) return;
    files.forEach(function (file) {
      if (!/^image\//.test(file.type)) { if (!--pending) repaint(); return; }
      var fr = new FileReader();
      fr.onload = function () {
        var sh = { src: fr.result, fx: 0.5, fy: 0.5 };
        st.photos.push(sh);
        cropShot(sh, function () { if (!--pending) repaint(); });
      };
      fr.onerror = function () { if (!--pending) repaint(); };
      fr.readAsDataURL(file);
    });
  }

  /* ---- the tiles ---- */
  function tiles(st) {
    var shots = st.photos || [];
    return '<div class="ukShots">' +
      shots.map(function (sh, i) {
        return '<figure class="ukShotTile">' +
          '<img src="' + out(sh) + '" alt="Room photo ' + (i + 1) + '">' +
          '<button class="ukShotTile_x" type="button" data-unshot="' + i + '" ' +
          'aria-label="Remove photo ' + (i + 1) + '">&times;</button>' +
          '<button class="ukShotTile_c" type="button" data-crop="' + i + '">Reframe</button>' +
          '</figure>';
      }).join('') +
      (shots.length < MAX
        ? '<label class="ukShotAdd">' +
            '<input type="file" accept="image/*" multiple data-shotin hidden>' +
            '<span class="ukShotAdd_p" aria-hidden="true">+</span>' +
            '<span class="ukShotAdd_t">' + (shots.length ? 'Add more rooms' : 'Drag photos here, or browse') + '</span>' +
            (shots.length ? '' : '<span class="ukShotAdd_s">One room or the whole property. Add as many as you like.</span>') +
          '</label>'
        : '') +
    '</div>' +
    '<p class="ukHint">' + (shots.length
      ? shots.length + ' photo' + (shots.length === 1 ? '' : 's') +
        ' added, cropped to 4:3. Drag to reframe any of them.'
      : esc(ADVICE)) + '</p>';
  }

  /* ---- the crop editor ----
     The preview IS the crop the canvas will write: an <img> covering a 4:3 box
     with object-position bound to the focal point. */
  function editor(st) {
    var sh = (st.photos || [])[st.cropIx];
    if (!sh) return '';
    return '<div class="ukCropWrap" data-cropwrap>' +
      '<div class="ukCropPanel">' +
        '<h2 class="ukCropPanel_h">Reframe this room</h2>' +
        '<p class="ukCropPanel_p">Drag the photo to choose what stays in the crop. ' +
          esc(ADVICE) + '</p>' +
        '<div class="ukCropBox" data-cropbox>' +
          '<img src="' + sh.src + '" alt="" style="object-position:' +
            (sh.fx * 100).toFixed(1) + '% ' + (sh.fy * 100).toFixed(1) + '%">' +
          '<span class="ukCropGrid" aria-hidden="true"></span>' +
        '</div>' +
        '<div class="ukCropNav">' +
          '<button class="ukGhost ukNav_back" type="button" data-cropcancel>Cancel</button>' +
          '<button class="ukBtn ukNav_go" type="button" data-cropsave>Save crop</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function body(st) {
    return tiles(st) + (st.cropIx !== null && st.cropIx !== undefined ? editor(st) : '');
  }

  /* ---- the interactions, driven by the caller's repaint ----
     A caller wires these once with the state it owns. Everything below is the
     behaviour from /start/, unchanged: the drag maths, the drop target, and the
     rule that a cancelled crop restores the focal point it opened with. */
  function wire(root, getState, repaint) {
    var box = null, sh = null, sx = 0, sy = 0, fx0 = 0, fy0 = 0;

    /* Moving right reveals more of the LEFT edge, so the focal point moves the
       opposite way to the pointer. */
    root.addEventListener('pointerdown', function (e) {
      var b = e.target.closest && e.target.closest('[data-cropbox]');
      if (!b) return;
      var st = getState();
      box = b; sh = (st.photos || [])[st.cropIx];
      if (!sh) { box = null; return; }
      sx = e.clientX; sy = e.clientY; fx0 = sh.fx; fy0 = sh.fy;
      b.setPointerCapture(e.pointerId);
      b.classList.add('is-dragging');
      e.preventDefault();
    });
    root.addEventListener('pointermove', function (e) {
      if (!box || !sh) return;
      var r = box.getBoundingClientRect();
      sh.fx = Math.min(1, Math.max(0, fx0 - (e.clientX - sx) / r.width));
      sh.fy = Math.min(1, Math.max(0, fy0 - (e.clientY - sy) / r.height));
      var img = box.querySelector('img');
      if (img) img.style.objectPosition = (sh.fx * 100).toFixed(1) + '% ' + (sh.fy * 100).toFixed(1) + '%';
    });
    root.addEventListener('pointerup', function () {
      if (box) box.classList.remove('is-dragging');
      box = null; sh = null;
    });

    ['dragenter','dragover'].forEach(function (ev) {
      root.addEventListener(ev, function (e) {
        var t = e.target.closest && e.target.closest('.ukShotAdd'); if (!t) return;
        e.preventDefault(); t.classList.add('is-over');
      });
    });
    ['dragleave','drop'].forEach(function (ev) {
      root.addEventListener(ev, function (e) {
        var t = e.target.closest && e.target.closest('.ukShotAdd'); if (!t) return;
        e.preventDefault(); t.classList.remove('is-over');
        if (ev === 'drop' && e.dataTransfer) takeFiles(e.dataTransfer.files, getState(), repaint);
      });
    });

    root.addEventListener('change', function (e) {
      var input = e.target.closest && e.target.closest('[data-shotin]');
      if (!input || !input.files || !input.files.length) return;
      takeFiles(input.files, getState(), repaint);
    });

    root.addEventListener('click', function (e) {
      var el, st = getState();
      if ((el = e.target.closest && e.target.closest('[data-unshot]'))) {
        (st.photos || []).splice(Number(el.dataset.unshot), 1);
        return repaint();
      }
      if ((el = e.target.closest && e.target.closest('[data-crop]'))) {
        st.cropIx = Number(el.dataset.crop);
        /* remembered so Cancel can put it back exactly as it was */
        var s2 = st.photos[st.cropIx];
        if (s2) { s2._fx = s2.fx; s2._fy = s2.fy; }
        return repaint();
      }
      if (e.target.closest && e.target.closest('[data-cropcancel]')) {
        var c = (st.photos || [])[st.cropIx];
        if (c && c._fx !== undefined) { c.fx = c._fx; c.fy = c._fy; }
        st.cropIx = null;
        return repaint();
      }
      if (e.target.closest && e.target.closest('[data-cropsave]')) {
        var s3 = (st.photos || [])[st.cropIx];
        if (!s3) { st.cropIx = null; return repaint(); }
        cropShot(s3, function () { st.cropIx = null; repaint(); });
        return;
      }
    });
  }

  return {
    body: body, tiles: tiles, editor: editor, wire: wire,
    takeFiles: takeFiles, cropShot: cropShot, out: out,
    ADVICE: ADVICE, MAX: MAX
  };
})();
