/* Light Bloom, ported from the React component to plain JS.

   The shader is unchanged: same vertex and fragment source, same uniforms,
   same DPR cap, same dt-correct pointer smoothing and the same CPU-side clock
   wrap. What is dropped is React itself, since this site ships static files.
   Options come off data attributes on the canvas so the colours stay in the
   markup next to everything else.

   Colours are the brand's: the ground is --uk-deep-3, the bloom rises in the
   brand blue and its hottest core is gold, so the light reads as Ukreate
   rather than as the component's default purple. */
(function () {
  var MAX_DPR = 2;

  var VERT_SRC =
    'attribute vec2 a_pos;' +
    'void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }';

  var FRAG_SRC = [
    '#ifdef GL_FRAGMENT_PRECISION_HIGH',
    'precision highp float;',
    '#else',
    'precision mediump float;',
    '#endif',
    'uniform vec2  uRes;',
    'uniform float uTime;',
    'uniform int   uStyle;',
    'uniform int   uDirection;',
    'uniform vec3  uBg;',
    'uniform vec3  uBase;',
    'uniform vec3  uAccent;',
    'uniform float uRise;',
    'uniform float uSpread;',
    'uniform float uOriginX;',
    'uniform float uLift;',
    'uniform float uShaftCount;',
    'uniform float uShaftAmount;',
    'uniform float uShaftDrift;',
    'uniform float uGrain;',
    'uniform float uVignette;',
    'float h11(float x){ return fract(sin(x * 127.1) * 43758.5453123); }',
    'float vn1(float x){',
    '  float i = floor(x); float f = fract(x);',
    '  f = f * f * (3.0 - 2.0 * f);',
    '  return mix(h11(i), h11(i + 1.0), f);',
    '}',
    'void main(){',
    '  vec2 uv = gl_FragCoord.xy / uRes;',
    '  float aspect = uRes.x / uRes.y;',
    '  float t = uTime;',
    '  float breathe = 1.0 + 0.06 * sin(t * 0.35);',
    '  float depth = mix(0.05, 1.20, uSpread);',
    '  vec2 lp; float acrossUv; float edgeCoord;',
    '  if (uDirection == 1) { lp = vec2(uOriginX, 1.0 + depth); acrossUv = uv.x; edgeCoord = 1.0 - uv.y; }',
    '  else if (uDirection == 2) { lp = vec2(-depth / aspect, uOriginX); acrossUv = uv.y; edgeCoord = uv.x; }',
    '  else if (uDirection == 3) { lp = vec2(1.0 + depth / aspect, uOriginX); acrossUv = uv.y; edgeCoord = 1.0 - uv.x; }',
    '  else { lp = vec2(uOriginX, -depth); acrossUv = uv.x; edgeCoord = uv.y; }',
    '  vec2 q = vec2((uv.x - lp.x) * aspect, uv.y - lp.y);',
    '  float d = length(q);',
    '  float k = mix(9.0, 1.4, uRise) / breathe;',
    '  float g = exp(-d * k) / max(exp(-depth * k), 1e-4);',
    '  g = clamp(g, 0.0, 1.0);',
    '  if (uStyle == 1) {',
    '    float sx = acrossUv * uShaftCount;',
    '    float dr = t * uShaftDrift;',
    '    float s = vn1(sx + dr) * 0.6 + vn1(sx * 2.17 - dr * 0.8) * 0.4;',
    '    float mask = smoothstep(0.0, 0.35, edgeCoord);',
    '    g *= mix(1.0, 0.45 + 1.25 * s, uShaftAmount * mask);',
    '  }',
    '  g = clamp(g * (1.0 + uLift * 0.25), 0.0, 1.0);',
    '  vec3 col = mix(uBg, uBase, smoothstep(0.0, 0.68, g));',
    '  col = mix(col, uAccent, smoothstep(0.58, 0.99, g));',
    '  vec2 vc = uv - 0.5; vc.x *= aspect;',
    '  col *= 1.0 - uVignette * smoothstep(0.35, 0.95, length(vc));',
    '  float rnd = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);',
    '  col += (rnd - 0.5) * (uGrain * 0.06 + 1.5 / 255.0);',
    '  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);',
    '}'
  ].join('\n');

  function parseColor(input, fb) {
    if (!input) return fb;
    var str = String(input).trim();
    if (str.charAt(0) === '#') {
      var hex = str.slice(1);
      if (hex.length === 3 || hex.length === 4) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      if (hex.length >= 6) {
        var r = parseInt(hex.slice(0, 2), 16),
            g = parseInt(hex.slice(2, 4), 16),
            b = parseInt(hex.slice(4, 6), 16);
        if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return [r / 255, g / 255, b / 255];
      }
      return fb;
    }
    var m = str.match(/[\d.]+/g);
    if (m && m.length >= 3) {
      return [Math.min(255, parseFloat(m[0])) / 255,
              Math.min(255, parseFloat(m[1])) / 255,
              Math.min(255, parseFloat(m[2])) / 255];
    }
    return fb;
  }

  function num(v, fb) { var n = parseFloat(v); return isFinite(n) ? n : fb; }

  function compile(gl, type, src) {
    var sh = gl.createShader(type);
    if (!sh) return null;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.error('LightBloom shader:', gl.getShaderInfoLog(sh));
      gl.deleteShader(sh);
      return null;
    }
    return sh;
  }

  function init(canvas) {
    if (canvas.dataset.bloomReady === '1') return;
    var gl = canvas.getContext('webgl', { antialias: false, alpha: false });
    if (!gl) { canvas.style.display = 'none'; return; }   // the CSS ground stands in
    canvas.dataset.bloomReady = '1';

    var vs = compile(gl, gl.VERTEX_SHADER, VERT_SRC);
    var fs = compile(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
    if (!vs || !fs) { canvas.style.display = 'none'; return; }
    var prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('LightBloom link:', gl.getProgramInfoLog(prog));
      canvas.style.display = 'none'; return;
    }
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var posLoc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    function U(n) { return gl.getUniformLocation(prog, n); }
    var u = { res:U('uRes'), time:U('uTime'), style:U('uStyle'), direction:U('uDirection'),
      bg:U('uBg'), base:U('uBase'), accent:U('uAccent'), rise:U('uRise'), spread:U('uSpread'),
      originX:U('uOriginX'), lift:U('uLift'), count:U('uShaftCount'), amount:U('uShaftAmount'),
      drift:U('uShaftDrift'), grain:U('uGrain'), vignette:U('uVignette') };

    var d = canvas.dataset;
    var dirName = d.direction || 'bottom';
    var v = {
      style: (d.variant || 'shafts') === 'shafts' ? 1 : 0,
      direction: dirName === 'top' ? 1 : dirName === 'left' ? 2 : dirName === 'right' ? 3 : 0,
      bg: parseColor(d.background, [0.024, 0.094, 0.161]),
      base: parseColor(d.baseColor, [0.110, 0.318, 0.514]),
      accent: parseColor(d.accentColor, [0.843, 0.647, 0.263]),
      rise: num(d.rise, 79) / 100,
      spread: num(d.spread, 72) / 100,
      speed: num(d.speed, 100) / 50,
      hover: num(d.hover, 114) / 100,
      count: Math.max(1, num(d.shaftCount, 17)),
      amount: num(d.shaftAmount, 70) / 100,
      drift: num(d.shaftDrift, 79) / 100,
      grain: num(d.grain, 12) / 100,
      vignette: num(d.vignette, 25) / 100
    };

    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var ptr = { x: 0.5, target: 0.5, on: 0, onTarget: 0 };
    var raf = 0, last = performance.now(), clock = 0, running = false;

    function draw(now) {
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock = (clock + dt * v.speed) % 3600;

      var dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      var cw = canvas.clientWidth || 1200, ch = canvas.clientHeight || 800;
      var bw = Math.max(1, Math.round(cw * dpr)), bh = Math.max(1, Math.round(ch * dpr));
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw; canvas.height = bh; gl.viewport(0, 0, bw, bh);
      }

      var kx = 1 - Math.exp(-8 * dt), ko = 1 - Math.exp(-5 * dt);
      ptr.x += (ptr.target - ptr.x) * kx;
      ptr.on += (ptr.onTarget - ptr.on) * ko;
      var travel = Math.min(1, v.hover);
      var originX = 0.5 + (ptr.x - 0.5) * travel * ptr.on;

      gl.uniform2f(u.res, bw, bh);
      gl.uniform1f(u.time, clock);
      gl.uniform1i(u.style, v.style);
      gl.uniform1i(u.direction, v.direction);
      gl.uniform3f(u.bg, v.bg[0], v.bg[1], v.bg[2]);
      gl.uniform3f(u.base, v.base[0], v.base[1], v.base[2]);
      gl.uniform3f(u.accent, v.accent[0], v.accent[1], v.accent[2]);
      gl.uniform1f(u.rise, v.rise);
      gl.uniform1f(u.spread, v.spread);
      gl.uniform1f(u.originX, originX);
      gl.uniform1f(u.lift, v.hover * ptr.on);
      gl.uniform1f(u.count, v.count);
      gl.uniform1f(u.amount, v.amount);
      gl.uniform1f(u.drift, v.drift);
      gl.uniform1f(u.grain, v.grain);
      gl.uniform1f(u.vignette, v.vignette);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (running && !reduce) raf = requestAnimationFrame(draw);
    }

    function start() {
      if (running) return;
      running = true; last = performance.now();
      raf = requestAnimationFrame(draw);
    }
    function stop() { running = false; cancelAnimationFrame(raf); }

    if (reduce) { draw(performance.now()); }        // one still frame, no loop
    else if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { e.isIntersecting ? start() : stop(); });
      }, { rootMargin: '120px 0px' }).observe(canvas);
      start();
    } else start();

    var host = canvas.parentElement || canvas;
    host.addEventListener('pointermove', function (e) {
      var r = canvas.getBoundingClientRect();
      if (v.direction === 2 || v.direction === 3) {
        var h = canvas.offsetHeight || 1, sy = r.height > 0 ? h / r.height : 1;
        ptr.target = Math.max(0, Math.min(1, 1 - ((e.clientY - r.top) * sy) / h));
      } else {
        var w = canvas.offsetWidth || 1, sx = r.width > 0 ? w / r.width : 1;
        ptr.target = Math.max(0, Math.min(1, ((e.clientX - r.left) * sx) / w));
      }
    });
    host.addEventListener('pointerenter', function () { ptr.onTarget = 1; });
    host.addEventListener('pointerleave', function () { ptr.onTarget = 0; });
    window.addEventListener('resize', function () { if (!running) draw(performance.now()); });
  }

  function boot() {
    var list = document.querySelectorAll('canvas[data-lightbloom]');
    for (var i = 0; i < list.length; i++) init(list[i]);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  document.addEventListener('swup:contentReplaced', boot);
})();
