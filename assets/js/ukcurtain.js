/* Light Curtain — the Originkit shader, ported to plain DOM. The GLSL and the
   pointer model are unchanged; what differs is the wiring: it reads its
   settings off data attributes, tracks the pointer on its host section rather
   than on the canvas (the canvas sits behind the content and takes no clicks),
   and only draws while it can be seen. */
(function () {
  var MAX_DPR = 2;
  var TRAIL = 8, HIST = TRAIL - 1, TRAIL_LIFE = 0.62, TRAIL_STEP = 0.022;
  var PULSES = 3, PULSE_LIFE = 1.15, PULSE_SPEED = 1.05;
  var SWAY_W = 9.5, SWAY_Z = 0.3;

  var VERT = 'attribute vec2 a_pos;void main(){gl_Position=vec4(a_pos,0.0,1.0);}';

  var FRAG = [
'#ifdef GL_FRAGMENT_PRECISION_HIGH','precision highp float;','#else','precision mediump float;','#endif',
'const int TRAIL = 8;','const int PULSES = 3;',
'uniform vec2 uRes;uniform float uTime;uniform vec2 uMouse;uniform float uHover;',
'uniform float uReach;uniform float uSway;uniform float uRush;',
'uniform vec3 uTrail[TRAIL];uniform vec3 uPulse[PULSES];',
'uniform vec3 uBg;uniform vec3 uBase;uniform vec3 uAccent;uniform vec3 uHigh;',
'uniform float uDensity;uniform float uWidth;uniform float uSpread;uniform float uStriation;',
'uniform float uAxis;',
'float sat(float x){return clamp(x,0.0,1.0);}',
'float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+34.56);return fract(p.x*p.y);}',
'float vnoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);',
'  float a=h21(i),b=h21(i+vec2(1.0,0.0));float c=h21(i+vec2(0.0,1.0)),d=h21(i+vec2(1.0,1.0));',
'  return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}',
'float fbm5(vec2 p){float s=0.0,a=0.5;for(int i=0;i<5;i++){s+=a*vnoise(p);p=p*2.03+vec2(1.7,9.2);a*=0.5;}return s;}',
'void main(){',
'  vec2 uv=gl_FragCoord.xy/uRes;float t=uTime;',
'  float rx=max(uReach,0.02);float rx2=rx*rx;',
'  float lift=0.0,blob=0.0,cenY=0.0,cenW=0.0;',
'  for(int i=0;i<TRAIL;i++){vec3 s=uTrail[i];float dx=uv.x-s.x;float dy=uv.y-s.y;',
'    float gx=s.z*exp(-(dx*dx)/rx2);lift+=gx;blob+=gx*exp(-(dy*dy)/(rx2*2.6));cenY+=gx*s.y;cenW+=gx;}',
'  float trailY=cenY/max(cenW,1e-4);',
'  float ring=0.0;',
'  for(int i=0;i<PULSES;i++){vec3 p=uPulse[i];float d=abs(uv.x-p.x)-p.y;ring+=p.z*exp(-(d*d)/0.0012);}',
'  lift=(min(lift,2.0)+ring*0.9)*uHover;blob=min(blob,1.5)*uHover;',
'  float nearP=exp(-pow(uv.x-uMouse.x,2.0)/(rx2*4.0));',
'  float xw=uv.x-uSway*0.09*(0.25+0.75*nearP)*uHover;',
'  float n1=fbm5(vec2(xw*6.5*uDensity,t*0.045));',
'  float n2=fbm5(vec2(xw*24.0*uDensity+3.1,t*0.075));',
'  float n3=vnoise(vec2(xw*210.0*uDensity,t*0.04));',
'  float n4=vnoise(vec2(xw*70.0*uDensity,4.0+t*0.03));',
'  float band=pow(sat(n1*1.30+n2*0.80-0.58+lift*0.34),1.95);band*=0.62+0.70*n4;',
'  float yc=uAxis+0.24*uSpread*(fbm5(vec2(xw*3.1*uDensity,11.0))-0.5)*2.0;',
'  yc=mix(yc,trailY,sat(cenW*1.1)*uHover*0.45);',
'  float wdt=uWidth*(0.22+0.28*n2+0.10*n1)*(1.0+0.5*uRush*sat(lift));',
'  float prof=exp(-pow(abs(uv.y-yc)/max(wdt,0.02),1.75));',
'  float inten=band*prof*(1.0-uStriation*0.5+uStriation*n3);',
'  float blend=sat(n1*1.30-n2*0.55+0.28);',
'  vec3 c=mix(uBase,uAccent,blend);',
'  float amber=sat((n2-0.70)*5.2)*sat(n1*1.6-0.35);',
'  c=mix(c,uHigh,amber*0.85);',
'  vec3 col=uBg;',
'  col+=c*pow(inten,0.88)*1.42;',
'  col+=vec3(1.0,0.94,1.0)*pow(inten,4.5)*0.65;',
'  col+=c*0.30*pow(sat(prof*band*3.0),0.70);',
'  col+=c*0.10*pow(sat(prof*1.2),1.3);',
'  col+=mix(uAccent,uHigh,sat(uRush))*blob*(0.22+0.16*uRush);',
'  col+=mix(uAccent,uHigh,0.35)*ring*prof*0.75*uHover;',
'  col+=vec3(1.0,0.95,0.92)*pow(ring,3.0)*prof*0.35*uHover;',
'  gl_FragColor=vec4(clamp(col,0.0,1.0),1.0);}'
  ].join('\n');

  function parseColor(str, fb) {
    if (!str) return fb;
    str = String(str).trim();
    if (str.charAt(0) === '#') {
      var hex = str.slice(1);
      if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
      if (hex.length >= 6) {
        var r = parseInt(hex.slice(0,2),16), g = parseInt(hex.slice(2,4),16), b = parseInt(hex.slice(4,6),16);
        if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return [r/255,g/255,b/255];
      }
    }
    return fb;
  }
  function clampN(v,lo,hi){ return v<lo?lo:v>hi?hi:v; }
  function nm(v,fb){ v=parseFloat(v); return isFinite(v)?v:fb; }

  function build(host) {
    var d = host.dataset;
    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
    host.innerHTML = '';
    host.appendChild(canvas);

    var gl = canvas.getContext('webgl', { antialias:false, alpha:false, depth:false });
    if (!gl) return;

    function compile(type, src) {
      var sh = gl.createShader(type); gl.shaderSource(sh, src); gl.compileShader(sh);
      return gl.getShaderParameter(sh, gl.COMPILE_STATUS) ? sh : null;
    }
    var vs = compile(gl.VERTEX_SHADER, VERT), fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    var prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gl.STATIC_DRAW);
    var posLoc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    var locs = {};
    function u(n){ if(!(n in locs)) locs[n] = gl.getUniformLocation(prog, n); return locs[n]; }

    var v = {
      bg:     parseColor(d.background, [.023,.094,.161]),
      base:   parseColor(d.base,       [.078,.314,.502]),
      accent: parseColor(d.accent,     [.416,.639,.867]),
      high:   parseColor(d.high,       [.878,.690,.329]),
      density:   clampN(nm(d.density,150),10,150)/50,
      speed:     clampN(nm(d.speed,50),0,100)/50,
      cw:        clampN(nm(d.curtainWidth,100),30,250)/100,
      spread:    clampN(nm(d.spread,100),0,200)/100,
      striation: clampN(nm(d.striation,55),0,100)/100,
      hover:     clampN(nm(d.hover,100),0,200)/100,
      reach:     0.02 + (clampN(nm(d.reach,30),0,100)/100)*0.18
    };
    gl.uniform3f(u('uBg'), v.bg[0],v.bg[1],v.bg[2]);
    gl.uniform3f(u('uBase'), v.base[0],v.base[1],v.base[2]);
    gl.uniform3f(u('uAccent'), v.accent[0],v.accent[1],v.accent[2]);
    gl.uniform3f(u('uHigh'), v.high[0],v.high[1],v.high[2]);
    gl.uniform1f(u('uDensity'), v.density);
    gl.uniform1f(u('uWidth'), v.cw);
    gl.uniform1f(u('uSpread'), v.spread);
    gl.uniform1f(u('uStriation'), v.striation);
    gl.uniform1f(u('uReach'), v.reach);

    /* frozen trail records, so the tail stays where it was drawn */
    /* the row the curtain is brightest along. Given a selector it tracks that
       element's centre, so the light can sit on the stream without the box
       being resized — the box height is what sets the band's thickness. */
    var axisSel = d.axis || '';
    var axis = 0.5, axisAt = 0;
    function readAxis() {
      if (!axisSel) return 0.5;
      var t = document.querySelector(axisSel);
      if (!t) return 0.5;
      var hb = host.getBoundingClientRect(), tb = t.getBoundingClientRect();
      if (!hb.height) return 0.5;
      /* uv.y counts up from the bottom in GL */
      return clampN((hb.bottom - (tb.top + tb.height / 2)) / hb.height, 0, 1);
    }

    var hx = new Float32Array(HIST), hy = new Float32Array(HIST);
    var hAge = new Float32Array(HIST).fill(TRAIL_LIFE*2);
    var head = 0, lastEmitX = .5, lastEmitY = .5;
    var trailData = new Float32Array(TRAIL*3);
    var pulseX = new Float32Array(PULSES), pulseAge = new Float32Array(PULSES).fill(PULSE_LIFE*2);
    var pulseHead = 0, pulseData = new Float32Array(PULSES*3);
    var sway = { p:.5, v:0 }, rush = 0, prevX = .5, prevY = .5;
    var ptr = { x:.5, y:.5, tx:.5, ty:.5, on:0, onTarget:0 };
    var raf = 0, last = 0, clock = 0, live = false;

    function render(now) {
      var dt = last ? Math.min(.05, (now-last)/1000) : .016;
      last = now;
      clock = (clock + dt*v.speed) % 3600;

      ptr.on += (ptr.onTarget - ptr.on) * (1 - Math.exp(-6*dt));
      var kHead = 1 - Math.exp(-22*dt);
      ptr.x += (ptr.tx - ptr.x) * kHead;
      ptr.y += (ptr.ty - ptr.y) * kHead;

      var inst = Math.hypot(ptr.tx-prevX, ptr.ty-prevY) / Math.max(dt,1e-3);
      prevX = ptr.tx; prevY = ptr.ty;
      var rushTarget = clampN(inst/2, 0, 1) * ptr.on;
      rush += (rushTarget - rush) * (1 - Math.exp(-(rushTarget>rush?14:3.2)*dt));

      sway.v += (-2*SWAY_Z*SWAY_W*sway.v - SWAY_W*SWAY_W*(sway.p - ptr.x)) * dt;
      sway.p += sway.v * dt;
      var lag = clampN((ptr.x - sway.p)*3, -1, 1);

      var my = 1 - ptr.y;
      if (ptr.on > .02 && Math.hypot(ptr.x-lastEmitX, my-lastEmitY) > TRAIL_STEP) {
        head = (head+1) % HIST;
        hx[head] = ptr.x; hy[head] = my; hAge[head] = 0;
        lastEmitX = ptr.x; lastEmitY = my;
      }
      trailData[0] = ptr.x; trailData[1] = my; trailData[2] = ptr.on;
      for (var i=0;i<HIST;i++){
        var idx = (head - i + HIST*2) % HIST;
        hAge[idx] += dt;
        var a = hAge[idx];
        var w = a >= TRAIL_LIFE ? 0 : Math.pow(1 - a/TRAIL_LIFE, 1.6) * ptr.on * .8;
        trailData[(i+1)*3] = hx[idx]; trailData[(i+1)*3+1] = hy[idx]; trailData[(i+1)*3+2] = w;
      }
      for (var j=0;j<PULSES;j++){
        pulseAge[j] += dt;
        var pa = pulseAge[j];
        pulseData[j*3] = pulseX[j];
        pulseData[j*3+1] = pa * PULSE_SPEED;
        pulseData[j*3+2] = pa >= PULSE_LIFE ? 0 : Math.pow(1 - pa/PULSE_LIFE, 2);
      }

      var dpr = Math.min(devicePixelRatio || 1, MAX_DPR);
      var bw = Math.max(1, Math.round((canvas.clientWidth||1200) * dpr));
      var bh = Math.max(1, Math.round((canvas.clientHeight||800) * dpr));
      if (canvas.width !== bw || canvas.height !== bh) { canvas.width = bw; canvas.height = bh; }
      gl.viewport(0, 0, bw, bh);

      if (now - axisAt > 400) { axisAt = now; axis = readAxis(); }
      gl.uniform1f(u('uAxis'), axis);
      gl.uniform2f(u('uRes'), bw, bh);
      gl.uniform1f(u('uTime'), clock);
      gl.uniform2f(u('uMouse'), ptr.x, my);
      gl.uniform1f(u('uHover'), Math.min(1, ptr.on) * v.hover);
      gl.uniform1f(u('uSway'), lag);
      gl.uniform1f(u('uRush'), rush);
      gl.uniform3fv(u('uTrail[0]'), trailData);
      gl.uniform3fv(u('uPulse[0]'), pulseData);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(render);
    }

    /* the pointer is tracked on the whole section: the canvas is behind the
       content, so listening on it would only catch the gaps */
    var stage = host.closest('section') || host.parentNode;
    function track(e) {
      var r = host.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return;
      ptr.tx = clampN((e.clientX - r.left)/r.width, 0, 1);
      ptr.ty = clampN((e.clientY - r.top)/r.height, 0, 1);
      if (ptr.on < .02) {                     /* cold entry: no streak across */
        ptr.x = ptr.tx; ptr.y = ptr.ty;
        sway.p = ptr.tx; sway.v = 0;
        prevX = ptr.tx; prevY = ptr.ty;
        lastEmitX = ptr.tx; lastEmitY = 1 - ptr.ty;
        hAge.fill(TRAIL_LIFE*2);
      }
      ptr.onTarget = 1;
    }
    function down(e) { track(e); pulseHead = (pulseHead+1)%PULSES;
                       pulseX[pulseHead] = ptr.tx; pulseAge[pulseHead] = 0; }
    function leave() { ptr.onTarget = 0; }
    stage.addEventListener('pointermove', track);
    stage.addEventListener('pointerenter', track);
    stage.addEventListener('pointerdown', down);
    stage.addEventListener('pointerleave', leave);

    function start(){ if(live) return; live = true; last = 0; raf = requestAnimationFrame(render); }
    function stop(){ live = false; cancelAnimationFrame(raf); }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function(es){
        es.forEach(function(en){ en.isIntersecting && !document.hidden ? start() : stop(); });
      }, { threshold: 0 }).observe(host);
    } else { start(); }
    document.addEventListener('visibilitychange', function(){ if (document.hidden) stop(); });
  }

  function init() {
    if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    [].slice.call(document.querySelectorAll('.light-curtain')).forEach(build);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
