(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();var ac=!1,oc=!1,cs=[],lc=-1,Oh=!1;function M_(n){T_(n)}function b_(){Oh=!0}function E_(){Oh=!1,ep()}function T_(n){cs.includes(n)||cs.push(n),ep()}function A_(n){let e=cs.indexOf(n);e!==-1&&e>lc&&cs.splice(e,1)}function ep(){if(!oc&&!ac){if(Oh)return;ac=!0,queueMicrotask(P_)}}function P_(){ac=!1,oc=!0;for(let n=0;n<cs.length;n++)cs[n](),lc=n;cs.length=0,lc=-1,oc=!1}var Ar,Ms,Pr,tp,cc=!0;function C_(n){cc=!1,n(),cc=!0}function R_(n){Ar=n.reactive,Pr=n.release,Ms=e=>n.effect(e,{scheduler:t=>{cc?M_(t):t()}}),tp=n.raw}function Zu(n){Ms=n}function L_(n){let e=()=>{};return[i=>{let s=Ms(i);return n._x_effects||(n._x_effects=new Set,n._x_runEffects=()=>{n._x_effects.forEach(r=>r())}),n._x_effects.add(s),e=()=>{s!==void 0&&(n._x_effects.delete(s),Pr(s))},s},()=>{e()}]}function ip(n,e){let t=!0,i,s,r=Ms(()=>{let a=n(),o=JSON.stringify(a);if(!t&&(typeof a=="object"||a!==i)){let l=typeof i=="object"?JSON.parse(s):i;queueMicrotask(()=>{e(a,l)})}i=a,s=o,t=!1});return()=>Pr(r)}async function I_(n){b_();try{await n(),await Promise.resolve()}finally{E_()}}var np=[],sp=[],rp=[];function D_(n){rp.push(n)}function Uh(n,e){typeof e=="function"?(n._x_cleanups||(n._x_cleanups=[]),n._x_cleanups.push(e)):(e=n,sp.push(e))}function ap(n){np.push(n)}function op(n,e,t){n._x_attributeCleanups||(n._x_attributeCleanups={}),n._x_attributeCleanups[e]||(n._x_attributeCleanups[e]=[]),n._x_attributeCleanups[e].push(t)}function lp(n,e){n._x_attributeCleanups&&Object.entries(n._x_attributeCleanups).forEach(([t,i])=>{(e===void 0||e.includes(t))&&(i.forEach(s=>s()),delete n._x_attributeCleanups[t])})}function N_(n){for(n._x_effects?.forEach(A_);n._x_cleanups?.length;)n._x_cleanups.pop()()}var Fh=new MutationObserver(Vh),kh=!1;function Bh(){Fh.observe(document,{subtree:!0,childList:!0,attributes:!0,attributeOldValue:!0}),kh=!0}function cp(){O_(),Fh.disconnect(),kh=!1}var Fr=[];function O_(){let n=Fh.takeRecords();Fr.push(()=>n.length>0&&Vh(n));let e=Fr.length;queueMicrotask(()=>{if(Fr.length===e)for(;Fr.length>0;)Fr.shift()()})}function wt(n){if(!kh)return n();cp();let e=n();return Bh(),e}var zh=!1,Lo=[];function U_(){zh=!0}function F_(){zh=!1,Vh(Lo),Lo=[]}function Vh(n){if(zh){Lo=Lo.concat(n);return}let e=[],t=new Set,i=new Map,s=new Map;for(let r=0;r<n.length;r++)if(!n[r].target._x_ignoreMutationObserver&&(n[r].type==="childList"&&(n[r].removedNodes.forEach(a=>{a.nodeType===1&&a._x_marker&&t.add(a)}),n[r].addedNodes.forEach(a=>{if(a.nodeType===1){if(t.has(a)){t.delete(a);return}a._x_marker||e.push(a)}})),n[r].type==="attributes")){let a=n[r].target,o=n[r].attributeName,l=n[r].oldValue,c=()=>{i.has(a)||i.set(a,[]),i.get(a).push({name:o,value:a.getAttribute(o)})},h=()=>{s.has(a)||s.set(a,[]),s.get(a).push(o)};a.hasAttribute(o)&&l===null?c():a.hasAttribute(o)?(h(),c()):h()}s.forEach((r,a)=>{lp(a,r)}),i.forEach((r,a)=>{np.forEach(o=>o(a,r))});for(let r of t)e.some(a=>a.contains(r))||sp.forEach(a=>a(r));for(let r of e)r.isConnected&&rp.forEach(a=>a(r));e=null,t=null,i=null,s=null}function hp(n){return vs(_s(n))}function Ia(n,e,t){return n._x_dataStack=[e,..._s(t||n)],()=>{n._x_dataStack=n._x_dataStack.filter(i=>i!==e)}}function _s(n){return n._x_dataStack?n._x_dataStack:typeof ShadowRoot=="function"&&n instanceof ShadowRoot?_s(n.host):n.parentNode?_s(n.parentNode):[]}function vs(n){return new Proxy({objects:n},k_)}function up(n,e){return n===null||n===Object.prototype?null:Object.prototype.hasOwnProperty.call(n,e)?n:up(Object.getPrototypeOf(n),e)}var k_={ownKeys({objects:n}){return Array.from(new Set(n.flatMap(e=>Object.keys(e))))},has({objects:n},e){return e==Symbol.unscopables?!1:n.some(t=>Object.prototype.hasOwnProperty.call(t,e)||Reflect.has(t,e))},get({objects:n},e,t){return e=="toJSON"?B_:Reflect.get(n.find(i=>Reflect.has(i,e))||{},e,t)},set({objects:n},e,t,i){let s;for(const a of n)if(s=up(a,e),s)break;s||(s=n[n.length-1]);const r=Object.getOwnPropertyDescriptor(s,e);return r?.set&&r?.get?r.set.call(i,t)||!0:Reflect.set(s,e,t)}};function B_(){return Reflect.ownKeys(this).reduce((e,t)=>(e[t]=Reflect.get(this,t),e),{})}function Hh(n){let e=i=>typeof i=="object"&&!Array.isArray(i)&&i!==null,t=(i,s="")=>{Object.entries(Object.getOwnPropertyDescriptors(i)).forEach(([r,{value:a,enumerable:o}])=>{if(o===!1||a===void 0||typeof a=="object"&&a!==null&&a.__v_skip)return;let l=s===""?r:`${s}.${r}`;typeof a=="object"&&a!==null&&a._x_interceptor?i[r]=a.initialize(n,l,r):e(a)&&a!==i&&!(a instanceof Element)&&t(a,l)})};return t(n)}function fp(n,e=()=>{}){let t={initialValue:void 0,_x_interceptor:!0,initialize(i,s,r){return n(this.initialValue,()=>z_(i,s),a=>hc(i,s,a),s,r)}};return e(t),i=>{if(typeof i=="object"&&i!==null&&i._x_interceptor){let s=t.initialize.bind(t);t.initialize=(r,a,o)=>{let l=i.initialize(r,a,o);return t.initialValue=l,s(r,a,o)}}else t.initialValue=i;return t}}function z_(n,e){return e.split(".").reduce((t,i)=>t[i],n)}function hc(n,e,t){if(typeof e=="string"&&(e=e.split(".")),e.length===1)n[e[0]]=t;else{if(e.length===0)throw error;return n[e[0]]||(n[e[0]]={}),hc(n[e[0]],e.slice(1),t)}}var dp={};function Ui(n,e){dp[n]=e}function da(n,e){let t=V_(e);return Object.entries(dp).forEach(([i,s])=>{Object.defineProperty(n,`$${i}`,{get(){return s(e,t)},enumerable:!1})}),n}function V_(n){let[e,t]=Sp(n),i={interceptor:fp,...e};return Uh(n,t),i}function H_(n,e,t,...i){try{return t(...i)}catch(s){pa(s,n,e)}}function pa(...n){return pp(...n)}var pp=G_;function $_(n){pp=n}function G_(n,e,t=void 0){n=Object.assign(n??{message:"No error message given."},{el:e,expression:t}),console.warn(`Alpine Expression Error: ${n.message}

${t?'Expression: "'+t+`"

`:""}`,e),setTimeout(()=>{throw n},0)}var hr=!0;function mp(n){let e=hr;hr=!1;let t=n();return hr=e,t}function hs(n,e,t={}){let i;return qt(n,e)(s=>i=s,t),i}function qt(...n){return gp(...n)}var gp=()=>{};function W_(n){gp=n}var _p;function q_(n){_p=n}function X_(n,e){let t={};da(t,n);let i=[t,..._s(n)],s=typeof e=="function"?j_(i,e):K_(i,e,n);return H_.bind(null,n,e,s)}function j_(n,e){return(t=()=>{},{scope:i={},params:s=[],context:r}={})=>{if(!hr){ma(t,e,vs([i,...n]),s);return}let a=e.apply(vs([i,...n]),s);ma(t,a)}}var ul={};function Y_(n,e){if(ul[n])return ul[n];let t=Object.getPrototypeOf(async function(){}).constructor,i=/^[\n\s]*if.*\(.*\)/.test(n.trim())||/^(let|const)\s/.test(n.trim())?`(async()=>{ ${n} })()`:n,r=(()=>{try{let a=new t(["__self","scope"],`with (scope) { __self.result = ${i} }; __self.finished = true; return __self.result;`);return Object.defineProperty(a,"name",{value:`[Alpine] ${n}`}),a}catch(a){return pa(a,e,n),Promise.resolve()}})();return ul[n]=r,r}function K_(n,e,t){let i=Y_(e,t);return(s=()=>{},{scope:r={},params:a=[],context:o}={})=>{i.result=void 0,i.finished=!1;let l=vs([r,...n]);if(typeof i=="function"){let c=i.call(o,i,l).catch(h=>pa(h,t,e));i.finished?(ma(s,i.result,l,a,t),i.result=void 0):c.then(h=>{ma(s,h,l,a,t)}).catch(h=>pa(h,t,e)).finally(()=>i.result=void 0)}}}function ma(n,e,t,i,s){if(hr&&typeof e=="function"){let r=e.apply(t,i);r instanceof Promise?r.then(a=>ma(n,a,t,i)).catch(a=>pa(a,s,e)):n(r)}else typeof e=="object"&&e instanceof Promise?e.then(r=>n(r)):n(e)}function Z_(...n){return _p(...n)}function J_(n,e,t={}){let i={};da(i,n);let s=[i,..._s(n)],r=vs([t.scope??{},...s]),a=t.params??[];if(e.includes("await")){let o=Object.getPrototypeOf(async function(){}).constructor,l=/^[\n\s]*if.*\(.*\)/.test(e.trim())||/^(let|const)\s/.test(e.trim())?`(async()=>{ ${e} })()`:e;return new o(["scope"],`with (scope) { let __result = ${l}; return __result }`).call(t.context,r)}else{let o=/^[\n\s]*if.*\(.*\)/.test(e.trim())||/^(let|const)\s/.test(e.trim())?`(()=>{ ${e} })()`:e,c=new Function(["scope"],`with (scope) { let __result = ${o}; return __result }`).call(t.context,r);return typeof c=="function"&&hr?c.apply(r,a):c}}var $h="x-";function Cr(n=""){return $h+n}function Q_(n){$h=n}var Io={};function Pt(n,e){return Io[n]=e,{before(t){if(!Io[t]){console.warn(String.raw`Cannot find directive \`${t}\`. \`${n}\` will use the default order of execution`);return}const i=rs.indexOf(t);rs.splice(i>=0?i:rs.indexOf("DEFAULT"),0,n)}}}function ev(n){return Object.keys(Io).includes(n)}function Gh(n,e,t){if(e=Array.from(e),n._x_virtualDirectives){let r=Object.entries(n._x_virtualDirectives).map(([o,l])=>({name:o,value:l})),a=vp(r);r=r.map(o=>a.find(l=>l.name===o.name)?{name:`x-bind:${o.name}`,value:`"${o.value}"`}:o),e=e.concat(r)}let i={};return e.map(Mp((r,a)=>i[r]=a)).filter(Ep).map(nv(i,t)).sort(sv).map(r=>iv(n,r))}function vp(n){return Array.from(n).map(Mp()).filter(e=>!Ep(e))}var uc=!1,Kr=new Map,xp=Symbol();function tv(n){uc=!0;let e=Symbol();xp=e,Kr.set(e,[]);let t=()=>{for(;Kr.get(e).length;)Kr.get(e).shift()();Kr.delete(e)},i=()=>{uc=!1,t()};n(t),i()}function Sp(n){let e=[],t=o=>e.push(o),[i,s]=L_(n);return e.push(s),[{Alpine:Lr,effect:i,cleanup:t,evaluateLater:qt.bind(qt,n),evaluate:hs.bind(hs,n)},()=>e.forEach(o=>o())]}function iv(n,e){let t=()=>{},i=Io[e.type]||t,[s,r]=Sp(n);op(n,e.original,r);let a=()=>{n._x_ignore||n._x_ignoreSelf||(i.inline&&i.inline(n,e,s),i=i.bind(i,n,e,s),uc?Kr.get(xp).push(i):i())};return a.runCleanups=r,a}var yp=(n,e)=>({name:t,value:i})=>(t.startsWith(n)&&(t=t.replace(n,e)),{name:t,value:i}),wp=n=>n;function Mp(n=()=>{}){return({name:e,value:t})=>{let{name:i,value:s}=bp.reduce((r,a)=>a(r),{name:e,value:t});return i!==e&&n(i,e),{name:i,value:s}}}var bp=[];function Wh(n){bp.push(n)}function Ep({name:n}){return Tp().test(n)}var Tp=()=>new RegExp(`^${$h}([^:^.]+)\\b`);function nv(n,e){return({name:t,value:i})=>{t===i&&(i="");let s=t.match(Tp()),r=t.match(/:([a-zA-Z0-9\-_:]+)/),a=t.match(/\.[^.\]]+(?=[^\]]*$)/g)||[],o=e||n[t]||t;return{type:s?s[1]:null,value:r?r[1]:null,modifiers:a.map(l=>l.replace(".","")),expression:i,original:o}}}var fc="DEFAULT",rs=["ignore","ref","id","data","anchor","bind","init","for","model","modelable","transition","show","if",fc,"teleport"];function sv(n,e){let t=rs.indexOf(n.type)===-1?fc:n.type,i=rs.indexOf(e.type)===-1?fc:e.type;return rs.indexOf(t)-rs.indexOf(i)}function ia(n,e,t={},i={}){return n.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0,cancelable:!0,...i}))}function xs(n,e){if(typeof ShadowRoot=="function"&&n instanceof ShadowRoot){Array.from(n.children).forEach(s=>xs(s,e));return}let t=!1;if(e(n,()=>t=!0),t)return;let i=n.firstElementChild;for(;i;)xs(i,e),i=i.nextElementSibling}function ji(n,...e){console.warn(`Alpine Warning: ${n}`,...e)}var Ju=!1;function rv(){Ju&&ji("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."),Ju=!0,document.body||ji("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"),ia(document,"alpine:init"),ia(document,"alpine:initializing"),Bh(),D_(e=>cn(e,xs)),Uh(e=>Rr(e)),ap((e,t)=>{Gh(e,t).forEach(i=>i())});let n=e=>!qo(e.parentElement,!0);Array.from(document.querySelectorAll(Cp().join(","))).filter(n).forEach(e=>{cn(e)}),ia(document,"alpine:initialized"),setTimeout(()=>{cv()})}var qh=[],Ap=[];function Pp(){return qh.map(n=>n())}function Cp(){return qh.concat(Ap).map(n=>n())}function Rp(n){qh.push(n)}function Lp(n){Ap.push(n)}function qo(n,e=!1){return an(n,t=>{if((e?Cp():Pp()).some(s=>t.matches(s)))return!0})}function an(n,e){if(n){if(e(n))return n;if(n._x_teleportBack)return an(n._x_teleportBack,e);if(n.parentNode instanceof ShadowRoot)return an(n.parentNode.host,e);if(n.parentElement)return an(n.parentElement,e)}}function av(n){return Pp().some(e=>n.matches(e))}var Ip=[];function ov(n){Ip.push(n)}var lv=1;function cn(n,e=xs,t=()=>{}){an(n,i=>i._x_ignore)||tv(()=>{e(n,(i,s)=>{i._x_marker||(t(i,s),Ip.forEach(r=>r(i,s)),Gh(i,i.attributes).forEach(r=>r()),i._x_ignore||(i._x_marker=lv++),i._x_ignore&&s())})})}function Rr(n,e=xs){e(n,t=>{N_(t),lp(t),delete t._x_marker})}function cv(){[["ui","dialog",["[x-dialog], [x-popover]"]],["anchor","anchor",["[x-anchor]"]],["sort","sort",["[x-sort]"]]].forEach(([e,t,i])=>{ev(t)||i.some(s=>{if(document.querySelector(s))return ji(`found "${s}", but missing ${e} plugin`),!0})})}var dc=[],Xh=!1;function jh(n=()=>{}){return queueMicrotask(()=>{Xh||setTimeout(()=>{pc()})}),new Promise(e=>{dc.push(()=>{n(),e()})})}function pc(){for(Xh=!1;dc.length;)dc.shift()()}function hv(){Xh=!0}function Yh(n,e){return Array.isArray(e)?Qu(n,e.join(" ")):typeof e=="object"&&e!==null?uv(n,e):typeof e=="function"?Yh(n,e()):Qu(n,e)}function mc(n){return n.split(/\s/).filter(Boolean)}function Qu(n,e){let t=s=>mc(s).filter(r=>!n.classList.contains(r)).filter(Boolean),i=s=>(n.classList.add(...s),()=>{n.classList.remove(...s)});return e=e===!0?e="":e||"",i(t(e))}function uv(n,e){let t=Object.entries(e).flatMap(([a,o])=>o?mc(a):!1).filter(Boolean),i=Object.entries(e).flatMap(([a,o])=>o?!1:mc(a)).filter(Boolean),s=[],r=[];return i.forEach(a=>{n.classList.contains(a)&&(n.classList.remove(a),r.push(a))}),t.forEach(a=>{n.classList.contains(a)||(n.classList.add(a),s.push(a))}),()=>{r.forEach(a=>n.classList.add(a)),s.forEach(a=>n.classList.remove(a))}}function Xo(n,e){return typeof e=="object"&&e!==null?fv(n,e):dv(n,e)}function fv(n,e){let t={};return Object.entries(e).forEach(([i,s])=>{t[i]=n.style[i],i.startsWith("--")||(i=pv(i)),n.style.setProperty(i,s)}),setTimeout(()=>{n.style.length===0&&n.removeAttribute("style")}),()=>{Xo(n,t)}}function dv(n,e){let t=n.getAttribute("style",e);return n.setAttribute("style",e),()=>{n.setAttribute("style",t||"")}}function pv(n){return n.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}function gc(n,e=()=>{}){let t=!1;return function(){t?e.apply(this,arguments):(t=!0,n.apply(this,arguments))}}Pt("transition",(n,{value:e,modifiers:t,expression:i},{evaluate:s})=>{typeof i=="function"&&(i=s(i)),i!==!1&&(!i||typeof i=="boolean"?gv(n,t,e):mv(n,i,e))});function mv(n,e,t){Dp(n,Yh,""),{enter:s=>{n._x_transition.enter.during=s},"enter-start":s=>{n._x_transition.enter.start=s},"enter-end":s=>{n._x_transition.enter.end=s},leave:s=>{n._x_transition.leave.during=s},"leave-start":s=>{n._x_transition.leave.start=s},"leave-end":s=>{n._x_transition.leave.end=s}}[t](e)}function gv(n,e,t){Dp(n,Xo);let i=!e.includes("in")&&!e.includes("out")&&!t,s=i||e.includes("in")||["enter"].includes(t),r=i||e.includes("out")||["leave"].includes(t);e.includes("in")&&!i&&(e=e.filter((p,x)=>x<e.indexOf("out"))),e.includes("out")&&!i&&(e=e.filter((p,x)=>x>e.indexOf("out")));let a=!e.includes("opacity")&&!e.includes("scale"),o=a||e.includes("opacity"),l=a||e.includes("scale"),c=o?0:1,h=l?kr(e,"scale",95)/100:1,u=kr(e,"delay",0)/1e3,f=kr(e,"origin","center"),d="opacity, transform",_=kr(e,"duration",150)/1e3,m=kr(e,"duration",75)/1e3,g="cubic-bezier(0.4, 0.0, 0.2, 1)";s&&(n._x_transition.enter.during={transformOrigin:f,transitionDelay:`${u}s`,transitionProperty:d,transitionDuration:`${_}s`,transitionTimingFunction:g},n._x_transition.enter.start={opacity:c,transform:`scale(${h})`},n._x_transition.enter.end={opacity:1,transform:"scale(1)"}),r&&(n._x_transition.leave.during={transformOrigin:f,transitionDelay:`${u}s`,transitionProperty:d,transitionDuration:`${m}s`,transitionTimingFunction:g},n._x_transition.leave.start={opacity:1,transform:"scale(1)"},n._x_transition.leave.end={opacity:c,transform:`scale(${h})`})}function Dp(n,e,t={}){n._x_transition||(n._x_transition={enter:{during:t,start:t,end:t},leave:{during:t,start:t,end:t},in(i=()=>{},s=()=>{}){_c(n,e,{during:this.enter.during,start:this.enter.start,end:this.enter.end},i,s)},out(i=()=>{},s=()=>{}){_c(n,e,{during:this.leave.during,start:this.leave.start,end:this.leave.end},i,s)}})}window.Element.prototype._x_toggleAndCascadeWithTransitions=function(n,e,t,i){const s=document.visibilityState==="visible"?requestAnimationFrame:setTimeout;let r=()=>s(t);if(e){n._x_transition&&(n._x_transition.enter||n._x_transition.leave)?n._x_transition.enter&&(Object.entries(n._x_transition.enter.during).length||Object.entries(n._x_transition.enter.start).length||Object.entries(n._x_transition.enter.end).length)?n._x_transition.in(t):r():n._x_transition?n._x_transition.in(t):r();return}n._x_hidePromise=n._x_transition?new Promise((a,o)=>{n._x_transition.out(()=>{},()=>a(i)),n._x_transitioning&&n._x_transitioning.beforeCancel(()=>o({isFromCancelledTransition:!0}))}):Promise.resolve(i),queueMicrotask(()=>{let a=Np(n);a?(a._x_hideChildren||(a._x_hideChildren=[]),a._x_hideChildren.push(n)):s(()=>{let o=l=>{let c=Promise.all([l._x_hidePromise,...(l._x_hideChildren||[]).map(o)]).then(([h])=>h?.());return delete l._x_hidePromise,delete l._x_hideChildren,c};o(n).catch(l=>{if(!l.isFromCancelledTransition)throw l})})})};function Np(n){let e=n.parentNode;if(e)return e._x_hidePromise?e:Np(e)}function _c(n,e,{during:t,start:i,end:s}={},r=()=>{},a=()=>{}){if(n._x_transitioning&&n._x_transitioning.cancel(),Object.keys(t).length===0&&Object.keys(i).length===0&&Object.keys(s).length===0){r(),a();return}let o,l,c;_v(n,{start(){o=e(n,i)},during(){l=e(n,t)},before:r,end(){o(),c=e(n,s)},after:a,cleanup(){l(),c()}})}function _v(n,e){let t,i,s,r=gc(()=>{wt(()=>{t=!0,i||e.before(),s||(e.end(),pc()),e.after(),n.isConnected&&e.cleanup(),delete n._x_transitioning})});n._x_transitioning={beforeCancels:[],beforeCancel(a){this.beforeCancels.push(a)},cancel:gc(function(){for(;this.beforeCancels.length;)this.beforeCancels.shift()();r()}),finish:r},wt(()=>{e.start(),e.during()}),hv(),requestAnimationFrame(()=>{if(t)return;let a=Number(getComputedStyle(n).transitionDuration.replace(/,.*/,"").replace("s",""))*1e3,o=Number(getComputedStyle(n).transitionDelay.replace(/,.*/,"").replace("s",""))*1e3;a===0&&(a=Number(getComputedStyle(n).animationDuration.replace("s",""))*1e3),wt(()=>{e.before()}),i=!0,requestAnimationFrame(()=>{t||(wt(()=>{e.end()}),pc(),setTimeout(n._x_transitioning.finish,a+o),s=!0)})})}function kr(n,e,t){if(n.indexOf(e)===-1)return t;const i=n[n.indexOf(e)+1];if(!i||e==="scale"&&isNaN(i))return t;if(e==="duration"||e==="delay"){let s=i.match(/([0-9]+)ms/);if(s)return s[1]}return e==="origin"&&["top","right","left","center","bottom"].includes(n[n.indexOf(e)+2])?[i,n[n.indexOf(e)+2]].join(" "):i}var Dn=!1;function Bn(n,e=()=>{}){return(...t)=>Dn?e(...t):n(...t)}function vv(n){return(...e)=>Dn&&n(...e)}var Op=[];function jo(n){Op.push(n)}function xv(n,e){Op.forEach(t=>t(n,e)),Dn=!0,Up(()=>{cn(e,(t,i)=>{i(t,()=>{})})}),Dn=!1}var vc=!1;function Sv(n,e){e._x_dataStack||(e._x_dataStack=n._x_dataStack),Dn=!0,vc=!0,Up(()=>{yv(e)}),Dn=!1,vc=!1}function yv(n){let e=!1;cn(n,(i,s)=>{xs(i,(r,a)=>{if(e&&av(r))return a();e=!0,s(r,a)})})}function Up(n){let e=Ms;Zu((t,i)=>{let s=e(t);return Pr(s),()=>{}}),n(),Zu(e)}function Fp(n,e,t,i=[]){switch(n._x_bindings||(n._x_bindings=Ar({})),n._x_bindings[e]=t,e=i.includes("camel")?Cv(e):e,e){case"value":wv(n,t);break;case"style":bv(n,t);break;case"class":Mv(n,t);break;case"selected":case"checked":Ev(n,e,t);break;default:kp(n,e,t);break}}function wv(n,e){if(Kh(n))n.attributes.value===void 0&&(n.value=e);else if(Do(n))Number.isInteger(e)?n.value=e:!Array.isArray(e)&&typeof e!="boolean"&&![null,void 0].includes(e)?n.value=String(e):Array.isArray(e)?n.checked=e.some(t=>Rv(t,n.value)):n.checked=!!e;else if(n.tagName==="SELECT")Pv(n,e);else{if(n.value===e)return;n.value=e===void 0?"":e}}function Mv(n,e){n._x_undoAddedClasses&&n._x_undoAddedClasses(),n._x_undoAddedClasses=Yh(n,e)}function bv(n,e){n._x_undoAddedStyles&&n._x_undoAddedStyles(),n._x_undoAddedStyles=Xo(n,e)}function Ev(n,e,t){kp(n,e,t),Av(n,e,t)}function kp(n,e,t){[null,void 0,!1].includes(t)&&Iv(e)?n.removeAttribute(e):(Bp(e)&&(t=e),Tv(n,e,t))}function Tv(n,e,t){n.getAttribute(e)!=t&&n.setAttribute(e,t)}function Av(n,e,t){n[e]!==t&&(n[e]=t)}function Pv(n,e){const t=[].concat(e).map(i=>i+"");Array.from(n.options).forEach(i=>{i.selected=t.includes(i.value)})}function Cv(n){return n.toLowerCase().replace(/-(\w)/g,(e,t)=>t.toUpperCase())}function Rv(n,e){return n==e}function yo(n){return[1,"1","true","on","yes",!0].includes(n)?!0:[0,"0","false","off","no",!1].includes(n)?!1:n?!!n:null}var Lv=new Set(["allowfullscreen","async","autofocus","autoplay","checked","controls","default","defer","disabled","formnovalidate","inert","ismap","itemscope","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","selected","shadowrootclonable","shadowrootdelegatesfocus","shadowrootserializable"]);function Bp(n){return Lv.has(n)}function Iv(n){return!["aria-pressed","aria-checked","aria-expanded","aria-selected"].includes(n)}function Dv(n,e,t){return n._x_bindings&&n._x_bindings[e]!==void 0?n._x_bindings[e]:zp(n,e,t)}function Nv(n,e,t,i=!0){if(n._x_bindings&&n._x_bindings[e]!==void 0)return n._x_bindings[e];if(n._x_inlineBindings&&n._x_inlineBindings[e]!==void 0){let s=n._x_inlineBindings[e];return s.extract=i,mp(()=>hs(n,s.expression))}return zp(n,e,t)}function zp(n,e,t){let i=n.getAttribute(e);return i===null?typeof t=="function"?t():t:i===""?!0:Bp(e)?!![e,"true"].includes(i):i}function Do(n){return n.type==="checkbox"||n.localName==="ui-checkbox"||n.localName==="ui-switch"}function Kh(n){return n.type==="radio"||n.localName==="ui-radio"}function Vp(n,e){let t;return function(){const i=this,s=arguments,r=function(){t=null,n.apply(i,s)};clearTimeout(t),t=setTimeout(r,e)}}function Hp(n,e){let t;return function(){let i=this,s=arguments;t||(n.apply(i,s),t=!0,setTimeout(()=>t=!1,e))}}function $p({get:n,set:e},{get:t,set:i}){let s=!0,r,a=Ms(()=>{let o=n(),l=t();if(s)i(fl(o)),s=!1;else{let c=JSON.stringify(o),h=JSON.stringify(l);c!==r?i(fl(o)):c!==h&&e(fl(l))}r=JSON.stringify(n()),JSON.stringify(t())});return()=>{Pr(a)}}function fl(n){return typeof n=="object"?JSON.parse(JSON.stringify(n)):n}function Ov(n){(Array.isArray(n)?n:[n]).forEach(t=>t(Lr))}var Jn={},ef=!1;function Uv(n,e){if(ef||(Jn=Ar(Jn),ef=!0),e===void 0)return Jn[n];Jn[n]=e,Hh(Jn[n]),typeof e=="object"&&e!==null&&e.hasOwnProperty("init")&&typeof e.init=="function"&&Jn[n].init()}function Fv(){return Jn}var Gp={};function kv(n,e){let t=typeof e!="function"?()=>e:e;return n instanceof Element?Wp(n,t()):(Gp[n]=t,()=>{})}function Bv(n){return Object.entries(Gp).forEach(([e,t])=>{Object.defineProperty(n,e,{get(){return(...i)=>t(...i)}})}),n}function Wp(n,e,t){let i=[];for(;i.length;)i.pop()();let s=Object.entries(e).map(([a,o])=>({name:a,value:o})),r=vp(s);return s=s.map(a=>r.find(o=>o.name===a.name)?{name:`x-bind:${a.name}`,value:`"${a.value}"`}:a),Gh(n,s,t).map(a=>{i.push(a.runCleanups),a()}),()=>{for(;i.length;)i.pop()()}}var qp={};function zv(n,e){qp[n]=e}function Vv(n,e){return Object.entries(qp).forEach(([t,i])=>{Object.defineProperty(n,t,{get(){return(...s)=>i.bind(e)(...s)},enumerable:!1})}),n}var Hv={get reactive(){return Ar},get release(){return Pr},get effect(){return Ms},get raw(){return tp},get transaction(){return I_},version:"3.15.12",flushAndStopDeferringMutations:F_,dontAutoEvaluateFunctions:mp,disableEffectScheduling:C_,startObservingMutations:Bh,stopObservingMutations:cp,setReactivityEngine:R_,onAttributeRemoved:op,onAttributesAdded:ap,closestDataStack:_s,skipDuringClone:Bn,onlyDuringClone:vv,addRootSelector:Rp,addInitSelector:Lp,setErrorHandler:$_,interceptClone:jo,addScopeToNode:Ia,deferMutations:U_,mapAttributes:Wh,evaluateLater:qt,interceptInit:ov,initInterceptors:Hh,injectMagics:da,setEvaluator:W_,setRawEvaluator:q_,mergeProxies:vs,extractProp:Nv,findClosest:an,onElRemoved:Uh,closestRoot:qo,destroyTree:Rr,interceptor:fp,transition:_c,setStyles:Xo,mutateDom:wt,directive:Pt,entangle:$p,throttle:Hp,debounce:Vp,evaluate:hs,evaluateRaw:Z_,initTree:cn,nextTick:jh,prefixed:Cr,prefix:Q_,plugin:Ov,magic:Ui,store:Uv,start:rv,clone:Sv,cloneNode:xv,bound:Dv,$data:hp,watch:ip,walk:xs,data:zv,bind:kv},Lr=Hv;function $v(n,e){const t=Object.create(null),i=n.split(",");for(let s=0;s<i.length;s++)t[i[s]]=!0;return s=>!!t[s]}var Gv=Object.freeze({}),Wv=Object.prototype.hasOwnProperty,Yo=(n,e)=>Wv.call(n,e),us=Array.isArray,na=n=>Xp(n)==="[object Map]",qv=n=>typeof n=="string",Zh=n=>typeof n=="symbol",Ko=n=>n!==null&&typeof n=="object",Xv=Object.prototype.toString,Xp=n=>Xv.call(n),jp=n=>Xp(n).slice(8,-1),Jh=n=>qv(n)&&n!=="NaN"&&n[0]!=="-"&&""+parseInt(n,10)===n,jv=n=>{const e=Object.create(null);return t=>e[t]||(e[t]=n(t))},Yv=jv(n=>n.charAt(0).toUpperCase()+n.slice(1)),Yp=(n,e)=>n!==e&&(n===n||e===e),xc=new WeakMap,Br=[],Bi,fs=Symbol("iterate"),Sc=Symbol("Map key iterate");function Kv(n){return n&&n._isEffect===!0}function Zv(n,e=Gv){Kv(n)&&(n=n.raw);const t=e0(n,e);return e.lazy||t(),t}function Jv(n){n.active&&(Kp(n),n.options.onStop&&n.options.onStop(),n.active=!1)}var Qv=0;function e0(n,e){const t=function(){if(!t.active)return n();if(!Br.includes(t)){Kp(t);try{return i0(),Br.push(t),Bi=t,n()}finally{Br.pop(),Zp(),Bi=Br[Br.length-1]}}};return t.id=Qv++,t.allowRecurse=!!e.allowRecurse,t._isEffect=!0,t.active=!0,t.raw=n,t.deps=[],t.options=e,t}function Kp(n){const{deps:e}=n;if(e.length){for(let t=0;t<e.length;t++)e[t].delete(n);e.length=0}}var gr=!0,Qh=[];function t0(){Qh.push(gr),gr=!1}function i0(){Qh.push(gr),gr=!0}function Zp(){const n=Qh.pop();gr=n===void 0?!0:n}function Ni(n,e,t){if(!gr||Bi===void 0)return;let i=xc.get(n);i||xc.set(n,i=new Map);let s=i.get(t);s||i.set(t,s=new Set),s.has(Bi)||(s.add(Bi),Bi.deps.push(s),Bi.options.onTrack&&Bi.options.onTrack({effect:Bi,target:n,type:e,key:t}))}function Nn(n,e,t,i,s,r){const a=xc.get(n);if(!a)return;const o=new Set,l=h=>{h&&h.forEach(u=>{(u!==Bi||u.allowRecurse)&&o.add(u)})};if(e==="clear")a.forEach(l);else if(t==="length"&&us(n))a.forEach((h,u)=>{(u==="length"||u>=i)&&l(h)});else switch(t!==void 0&&l(a.get(t)),e){case"add":us(n)?Jh(t)&&l(a.get("length")):(l(a.get(fs)),na(n)&&l(a.get(Sc)));break;case"delete":us(n)||(l(a.get(fs)),na(n)&&l(a.get(Sc)));break;case"set":na(n)&&l(a.get(fs));break}const c=h=>{h.options.onTrigger&&h.options.onTrigger({effect:h,target:n,key:t,type:e,newValue:i,oldValue:s,oldTarget:r}),h.options.scheduler?h.options.scheduler(h):h()};o.forEach(c)}var n0=$v("__proto__,__v_isRef,__isVue"),Jp=new Set(Object.getOwnPropertyNames(Symbol).map(n=>Symbol[n]).filter(Zh)),s0=Qp(),r0=Qp(!0),tf=a0();function a0(){const n={};return["includes","indexOf","lastIndexOf"].forEach(e=>{n[e]=function(...t){const i=ct(this);for(let r=0,a=this.length;r<a;r++)Ni(i,"get",r+"");const s=i[e](...t);return s===-1||s===!1?i[e](...t.map(ct)):s}}),["push","pop","shift","unshift","splice"].forEach(e=>{n[e]=function(...t){t0();const i=ct(this)[e].apply(this,t);return Zp(),i}}),n}function Qp(n=!1,e=!1){return function(i,s,r){if(s==="__v_isReactive")return!n;if(s==="__v_isReadonly")return n;if(s==="__v_raw"&&r===(n?e?S0:nm:e?x0:im).get(i))return i;const a=us(i);if(!n&&a&&Yo(tf,s))return Reflect.get(tf,s,r);const o=Reflect.get(i,s,r);return(Zh(s)?Jp.has(s):n0(s))||(n||Ni(i,"get",s),e)?o:yc(o)?!a||!Jh(s)?o.value:o:Ko(o)?n?sm(o):nu(o):o}}var o0=l0();function l0(n=!1){return function(t,i,s,r){let a=t[i];if(!n&&(s=ct(s),a=ct(a),!us(t)&&yc(a)&&!yc(s)))return a.value=s,!0;const o=us(t)&&Jh(i)?Number(i)<t.length:Yo(t,i),l=Reflect.set(t,i,s,r);return t===ct(r)&&(o?Yp(s,a)&&Nn(t,"set",i,s,a):Nn(t,"add",i,s)),l}}function c0(n,e){const t=Yo(n,e),i=n[e],s=Reflect.deleteProperty(n,e);return s&&t&&Nn(n,"delete",e,void 0,i),s}function h0(n,e){const t=Reflect.has(n,e);return(!Zh(e)||!Jp.has(e))&&Ni(n,"has",e),t}function u0(n){return Ni(n,"iterate",us(n)?"length":fs),Reflect.ownKeys(n)}var f0={get:s0,set:o0,deleteProperty:c0,has:h0,ownKeys:u0},d0={get:r0,set(n,e){return console.warn(`Set operation on key "${String(e)}" failed: target is readonly.`,n),!0},deleteProperty(n,e){return console.warn(`Delete operation on key "${String(e)}" failed: target is readonly.`,n),!0}},eu=n=>Ko(n)?nu(n):n,tu=n=>Ko(n)?sm(n):n,iu=n=>n,Zo=n=>Reflect.getPrototypeOf(n);function Ba(n,e,t=!1,i=!1){n=n.__v_raw;const s=ct(n),r=ct(e);e!==r&&!t&&Ni(s,"get",e),!t&&Ni(s,"get",r);const{has:a}=Zo(s),o=i?iu:t?tu:eu;if(a.call(s,e))return o(n.get(e));if(a.call(s,r))return o(n.get(r));n!==s&&n.get(e)}function za(n,e=!1){const t=this.__v_raw,i=ct(t),s=ct(n);return n!==s&&!e&&Ni(i,"has",n),!e&&Ni(i,"has",s),n===s?t.has(n):t.has(n)||t.has(s)}function Va(n,e=!1){return n=n.__v_raw,!e&&Ni(ct(n),"iterate",fs),Reflect.get(n,"size",n)}function nf(n){n=ct(n);const e=ct(this);return Zo(e).has.call(e,n)||(e.add(n),Nn(e,"add",n,n)),this}function sf(n,e){e=ct(e);const t=ct(this),{has:i,get:s}=Zo(t);let r=i.call(t,n);r?tm(t,i,n):(n=ct(n),r=i.call(t,n));const a=s.call(t,n);return t.set(n,e),r?Yp(e,a)&&Nn(t,"set",n,e,a):Nn(t,"add",n,e),this}function rf(n){const e=ct(this),{has:t,get:i}=Zo(e);let s=t.call(e,n);s?tm(e,t,n):(n=ct(n),s=t.call(e,n));const r=i?i.call(e,n):void 0,a=e.delete(n);return s&&Nn(e,"delete",n,void 0,r),a}function af(){const n=ct(this),e=n.size!==0,t=na(n)?new Map(n):new Set(n),i=n.clear();return e&&Nn(n,"clear",void 0,void 0,t),i}function Ha(n,e){return function(i,s){const r=this,a=r.__v_raw,o=ct(a),l=e?iu:n?tu:eu;return!n&&Ni(o,"iterate",fs),a.forEach((c,h)=>i.call(s,l(c),l(h),r))}}function $a(n,e,t){return function(...i){const s=this.__v_raw,r=ct(s),a=na(r),o=n==="entries"||n===Symbol.iterator&&a,l=n==="keys"&&a,c=s[n](...i),h=t?iu:e?tu:eu;return!e&&Ni(r,"iterate",l?Sc:fs),{next(){const{value:u,done:f}=c.next();return f?{value:u,done:f}:{value:o?[h(u[0]),h(u[1])]:h(u),done:f}},[Symbol.iterator](){return this}}}}function _n(n){return function(...e){{const t=e[0]?`on key "${e[0]}" `:"";console.warn(`${Yv(n)} operation ${t}failed: target is readonly.`,ct(this))}return n==="delete"?!1:this}}function p0(){const n={get(r){return Ba(this,r)},get size(){return Va(this)},has:za,add:nf,set:sf,delete:rf,clear:af,forEach:Ha(!1,!1)},e={get(r){return Ba(this,r,!1,!0)},get size(){return Va(this)},has:za,add:nf,set:sf,delete:rf,clear:af,forEach:Ha(!1,!0)},t={get(r){return Ba(this,r,!0)},get size(){return Va(this,!0)},has(r){return za.call(this,r,!0)},add:_n("add"),set:_n("set"),delete:_n("delete"),clear:_n("clear"),forEach:Ha(!0,!1)},i={get(r){return Ba(this,r,!0,!0)},get size(){return Va(this,!0)},has(r){return za.call(this,r,!0)},add:_n("add"),set:_n("set"),delete:_n("delete"),clear:_n("clear"),forEach:Ha(!0,!0)};return["keys","values","entries",Symbol.iterator].forEach(r=>{n[r]=$a(r,!1,!1),t[r]=$a(r,!0,!1),e[r]=$a(r,!1,!0),i[r]=$a(r,!0,!0)}),[n,t,e,i]}var[m0,g0]=p0();function em(n,e){const t=n?g0:m0;return(i,s,r)=>s==="__v_isReactive"?!n:s==="__v_isReadonly"?n:s==="__v_raw"?i:Reflect.get(Yo(t,s)&&s in i?t:i,s,r)}var _0={get:em(!1)},v0={get:em(!0)};function tm(n,e,t){const i=ct(t);if(i!==t&&e.call(n,i)){const s=jp(n);console.warn(`Reactive ${s} contains both the raw and reactive versions of the same object${s==="Map"?" as keys":""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`)}}var im=new WeakMap,x0=new WeakMap,nm=new WeakMap,S0=new WeakMap;function y0(n){switch(n){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function w0(n){return n.__v_skip||!Object.isExtensible(n)?0:y0(jp(n))}function nu(n){return n&&n.__v_isReadonly?n:rm(n,!1,f0,_0,im)}function sm(n){return rm(n,!0,d0,v0,nm)}function rm(n,e,t,i,s){if(!Ko(n))return console.warn(`value cannot be made reactive: ${String(n)}`),n;if(n.__v_raw&&!(e&&n.__v_isReactive))return n;const r=s.get(n);if(r)return r;const a=w0(n);if(a===0)return n;const o=new Proxy(n,a===2?i:t);return s.set(n,o),o}function ct(n){return n&&ct(n.__v_raw)||n}function yc(n){return!!(n&&n.__v_isRef===!0)}Ui("nextTick",()=>jh);Ui("dispatch",n=>ia.bind(ia,n));Ui("watch",(n,{evaluateLater:e,cleanup:t})=>(i,s)=>{let r=e(i),o=ip(()=>{let l;return r(c=>l=c),l},s);t(o)});Ui("store",Fv);Ui("data",n=>hp(n));Ui("root",n=>qo(n));Ui("refs",n=>(n._x_refs_proxy||(n._x_refs_proxy=vs(M0(n))),n._x_refs_proxy));function M0(n){let e=[];return an(n,t=>{t._x_refs&&e.push(t._x_refs)}),e}var dl={};function am(n){return dl[n]||(dl[n]=0),++dl[n]}function b0(n,e){return an(n,t=>{if(t._x_ids&&t._x_ids[e])return!0})}function E0(n,e){n._x_ids||(n._x_ids={}),n._x_ids[e]||(n._x_ids[e]=am(e))}Ui("id",(n,{cleanup:e})=>(t,i=null)=>{let s=`${t}${i?`-${i}`:""}`;return T0(n,s,e,()=>{let r=b0(n,t),a=r?r._x_ids[t]:am(t);return i?`${t}-${a}-${i}`:`${t}-${a}`})});jo((n,e)=>{n._x_id&&(e._x_id=n._x_id)});function T0(n,e,t,i){if(n._x_id||(n._x_id={}),n._x_id[e])return n._x_id[e];let s=i();return n._x_id[e]=s,t(()=>{delete n._x_id[e]}),s}Ui("el",n=>n);om("Focus","focus","focus");om("Persist","persist","persist");function om(n,e,t){Ui(e,i=>ji(`You can't use [$${e}] without first installing the "${n}" plugin here: https://alpinejs.dev/plugins/${t}`,i))}Pt("modelable",(n,{expression:e},{effect:t,evaluateLater:i,cleanup:s})=>{let r=i(e),a=()=>{let h;return r(u=>h=u),h},o=i(`${e} = __placeholder`),l=h=>o(()=>{},{scope:{__placeholder:h}}),c=a();l(c),queueMicrotask(()=>{if(!n._x_model)return;n._x_removeModelListeners.default();let h=n._x_model.get,u=n._x_model.setWithModifiers,f=$p({get(){return h()},set(d){u(d)}},{get(){return a()},set(d){l(d)}});s(f)})});Pt("teleport",(n,{modifiers:e,expression:t},{cleanup:i})=>{n.tagName.toLowerCase()!=="template"&&ji("x-teleport can only be used on a <template> tag",n);let s=of(t),r=n.content.cloneNode(!0).firstElementChild;n._x_teleport=r,r._x_teleportBack=n,n.setAttribute("data-teleport-template",!0),r.setAttribute("data-teleport-target",!0),n._x_forwardEvents&&n._x_forwardEvents.forEach(o=>{r.addEventListener(o,l=>{l.stopPropagation(),n.dispatchEvent(new l.constructor(l.type,l))})}),Ia(r,{},n);let a=(o,l,c)=>{c.includes("prepend")?l.parentNode.insertBefore(o,l):c.includes("append")?l.parentNode.insertBefore(o,l.nextSibling):l.appendChild(o)};wt(()=>{Bn(()=>{a(r,s,e),cn(r)})()}),n._x_teleportPutBack=()=>{let o=of(t);wt(()=>{a(n._x_teleport,o,e)})},i(()=>wt(()=>{r.remove(),Rr(r)}))});var A0=document.createElement("div");function of(n){let e=Bn(()=>document.querySelector(n),()=>A0)();return e||ji(`Cannot find x-teleport element for selector: "${n}"`),e}var lm=()=>{};lm.inline=(n,{modifiers:e},{cleanup:t})=>{e.includes("self")?n._x_ignoreSelf=!0:n._x_ignore=!0,t(()=>{e.includes("self")?delete n._x_ignoreSelf:delete n._x_ignore})};Pt("ignore",lm);Pt("effect",Bn((n,{expression:e},{effect:t})=>{t(qt(n,e))}));function rr(n,e,t,i){let s=n,r=l=>i(l),a={},o=(l,c)=>h=>c(l,h);return t.includes("dot")&&(e=P0(e)),t.includes("camel")&&(e=C0(e)),t.includes("capture")&&(a.capture=!0),t.includes("window")&&(s=window),t.includes("document")&&(s=document),t.includes("passive")&&(a.passive=t[t.indexOf("passive")+1]!=="false"),r=cm(t,r),t.includes("prevent")&&(r=o(r,(l,c)=>{c.preventDefault(),l(c)})),t.includes("stop")&&(r=o(r,(l,c)=>{c.stopPropagation(),l(c)})),t.includes("once")&&(r=o(r,(l,c)=>{l(c),s.removeEventListener(e,r,a)})),(t.includes("away")||t.includes("outside"))&&(s=document,r=o(r,(l,c)=>{n.contains(c.target)||c.target.isConnected!==!1&&(n.offsetWidth<1&&n.offsetHeight<1||n._x_isShown!==!1&&l(c))})),t.includes("self")&&(r=o(r,(l,c)=>{c.target===n&&l(c)})),e==="submit"&&(r=o(r,(l,c)=>{c.target._x_pendingModelUpdates&&c.target._x_pendingModelUpdates.forEach(h=>h()),l(c)})),(L0(e)||hm(e))&&(r=o(r,(l,c)=>{I0(c,t)||l(c)})),s.addEventListener(e,r,a),()=>{s.removeEventListener(e,r,a)}}function cm(n,e){if(n.includes("debounce")){let t=n[n.indexOf("debounce")+1]||"invalid-wait",i=No(t.split("ms")[0])?Number(t.split("ms")[0]):250;e=Vp(e,i)}if(n.includes("throttle")){let t=n[n.indexOf("throttle")+1]||"invalid-wait",i=No(t.split("ms")[0])?Number(t.split("ms")[0]):250;e=Hp(e,i)}return e}function P0(n){return n.replace(/-/g,".")}function C0(n){return n.toLowerCase().replace(/-(\w)/g,(e,t)=>t.toUpperCase())}function No(n){return!Array.isArray(n)&&!isNaN(n)}function R0(n){return[" ","_"].includes(n)?n:n.replace(/([a-z])([A-Z])/g,"$1-$2").replace(/[_\s]/,"-").toLowerCase()}function L0(n){return["keydown","keyup"].includes(n)}function hm(n){return["contextmenu","click","mouse"].some(e=>n.includes(e))}function I0(n,e){let t=e.filter(r=>!["window","document","prevent","stop","once","capture","self","away","outside","passive","preserve-scroll","blur","change","lazy"].includes(r));if(t.includes("debounce")){let r=t.indexOf("debounce");t.splice(r,No((t[r+1]||"invalid-wait").split("ms")[0])?2:1)}if(t.includes("throttle")){let r=t.indexOf("throttle");t.splice(r,No((t[r+1]||"invalid-wait").split("ms")[0])?2:1)}if(t.length===0||t.length===1&&lf(n.key).includes(t[0]))return!1;const s=["ctrl","shift","alt","meta","cmd","super"].filter(r=>t.includes(r));return t=t.filter(r=>!s.includes(r)),!(s.length>0&&s.filter(a=>((a==="cmd"||a==="super")&&(a="meta"),n[`${a}Key`])).length===s.length&&(hm(n.type)||lf(n.key).includes(t[0])))}function lf(n){if(!n)return[];n=R0(n);let e={ctrl:"control",slash:"/",space:" ",spacebar:" ",cmd:"meta",esc:"escape",up:"arrow-up",down:"arrow-down",left:"arrow-left",right:"arrow-right",period:".",comma:",",equal:"=",minus:"-",underscore:"_"};return e[n]=n,Object.keys(e).map(t=>{if(e[t]===n)return t}).filter(t=>t)}Pt("model",(n,{modifiers:e,expression:t},{effect:i,cleanup:s})=>{let r=n;e.includes("parent")&&(r=an(n,m=>m!==n));let a=qt(r,t),o;typeof t=="string"?o=qt(r,`${t} = __placeholder`):typeof t=="function"&&typeof t()=="string"?o=qt(r,`${t()} = __placeholder`):o=()=>{};let l=()=>{let m;return a(g=>m=g),cf(m)?m.get():m},c=m=>{let g;a(p=>g=p),cf(g)?g.set(m):o(()=>{},{scope:{__placeholder:m}})};typeof t=="string"&&n.type==="radio"&&wt(()=>{n.hasAttribute("name")||n.setAttribute("name",t)});let h=e.includes("change")||e.includes("lazy"),u=e.includes("blur"),f=e.includes("enter"),d=h||u||f,_;if(Dn)_=()=>{};else if(d){let m=[],g=p=>c(Ga(n,e,p,l()));if(h&&m.push(rr(n,"change",e,g)),u&&(m.push(rr(n,"blur",e,g)),n.form)){let p=n.form,x=()=>g({target:n});p._x_pendingModelUpdates||(p._x_pendingModelUpdates=[]),p._x_pendingModelUpdates.push(x),s(()=>{p._x_pendingModelUpdates&&p._x_pendingModelUpdates.splice(p._x_pendingModelUpdates.indexOf(x),1)})}f&&m.push(rr(n,"keydown",e,p=>{p.key==="Enter"&&g(p)})),_=()=>m.forEach(p=>p())}else{let m=n.tagName.toLowerCase()==="select"||["checkbox","radio"].includes(n.type)?"change":"input";_=rr(n,m,e,g=>{c(Ga(n,e,g,l()))})}if(e.includes("fill")&&([void 0,null,""].includes(l())||Do(n)&&Array.isArray(l())||n.tagName.toLowerCase()==="select"&&n.multiple)&&c(Ga(n,e,{target:n},l())),n._x_removeModelListeners||(n._x_removeModelListeners={}),n._x_removeModelListeners.default=_,s(()=>n._x_removeModelListeners.default()),n.form){let m=rr(n.form,"reset",[],g=>{jh(()=>n._x_model&&n._x_model.set(Ga(n,e,{target:n},l())))});s(()=>m())}n._x_model={get(){return l()},set(m){c(m)},setWithModifiers:cm(e,c)},n._x_forceModelUpdate=m=>{m===void 0&&typeof t=="string"&&t.match(/\./)&&(m=""),wt(()=>{Do(n)?Array.isArray(m)?n.checked=m.some(g=>g==n.value):n.checked=!!m:Kh(n)?typeof m=="boolean"?n.checked=yo(n.value)===m:n.checked=n.value==m:Fp(n,"value",m)})},i(()=>{let m=l();e.includes("unintrusive")&&document.activeElement.isSameNode(n)||n._x_forceModelUpdate(m)})});function Ga(n,e,t,i){return wt(()=>{if(t instanceof CustomEvent&&t.detail!==void 0)return t.detail!==null&&t.detail!==void 0?t.detail:t.target.value;if(Do(n))if(Array.isArray(i)){let s=null;return e.includes("number")?s=pl(t.target.value):e.includes("boolean")?s=yo(t.target.value):s=t.target.value,t.target.checked?i.includes(s)?i:i.concat([s]):i.filter(r=>!D0(r,s))}else return t.target.checked;else{if(n.tagName.toLowerCase()==="select"&&n.multiple)return e.includes("number")?Array.from(t.target.selectedOptions).map(s=>{let r=s.value||s.text;return pl(r)}):e.includes("boolean")?Array.from(t.target.selectedOptions).map(s=>{let r=s.value||s.text;return yo(r)}):Array.from(t.target.selectedOptions).map(s=>s.value||s.text);{let s;return Kh(n)?t.target.checked?s=t.target.value:s=i:s=t.target.value,e.includes("number")?pl(s):e.includes("boolean")?yo(s):e.includes("trim")?s.trim():s}}})}function pl(n){let e=n?parseFloat(n):null;return N0(e)?e:n}function D0(n,e){return n==e}function N0(n){return!Array.isArray(n)&&!isNaN(n)}function cf(n){return n!==null&&typeof n=="object"&&typeof n.get=="function"&&typeof n.set=="function"}Pt("cloak",n=>queueMicrotask(()=>wt(()=>n.removeAttribute(Cr("cloak")))));Lp(()=>`[${Cr("init")}]`);Pt("init",Bn((n,{expression:e},{evaluate:t})=>typeof e=="string"?!!e.trim()&&t(e,{},!1):t(e,{},!1)));Pt("text",(n,{expression:e},{effect:t,evaluateLater:i})=>{let s=i(e);t(()=>{s(r=>{wt(()=>{n.textContent=r})})})});Pt("html",(n,{expression:e},{effect:t,evaluateLater:i})=>{let s=i(e);t(()=>{s(r=>{wt(()=>{n.innerHTML=r??"",n._x_ignoreSelf=!0,cn(n),delete n._x_ignoreSelf})})})});Wh(yp(":",wp(Cr("bind:"))));var um=(n,{value:e,modifiers:t,expression:i,original:s},{effect:r,cleanup:a})=>{if(!e){let l={};Bv(l),qt(n,i)(h=>{Wp(n,h,s)},{scope:l});return}if(e==="key")return O0(n,i);if(n._x_inlineBindings&&n._x_inlineBindings[e]&&n._x_inlineBindings[e].extract)return;let o=qt(n,i);r(()=>o(l=>{l===void 0&&typeof i=="string"&&i.match(/\./)&&(l=""),wt(()=>Fp(n,e,l,t))})),a(()=>{n._x_undoAddedClasses&&n._x_undoAddedClasses(),n._x_undoAddedStyles&&n._x_undoAddedStyles()})};um.inline=(n,{value:e,modifiers:t,expression:i})=>{e&&(n._x_inlineBindings||(n._x_inlineBindings={}),n._x_inlineBindings[e]={expression:i,extract:!1})};Pt("bind",um);function O0(n,e){n._x_keyExpression=e}Rp(()=>`[${Cr("data")}]`);Pt("data",(n,{expression:e},{cleanup:t})=>{if(U0(n))return;e=e===""?"{}":e;let i={};da(i,n);let s={};Vv(s,i);let r=hs(n,e,{scope:s});(r===void 0||r===!0)&&(r={}),da(r,n);let a=Ar(r);Hh(a);let o=Ia(n,a);a.init&&hs(n,a.init),t(()=>{a.destroy&&hs(n,a.destroy),o()})});jo((n,e)=>{n._x_dataStack&&(e._x_dataStack=n._x_dataStack,e.setAttribute("data-has-alpine-state",!0))});function U0(n){return Dn?vc?!0:n.hasAttribute("data-has-alpine-state"):!1}Pt("show",(n,{modifiers:e,expression:t},{effect:i})=>{let s=qt(n,t);n._x_doHide||(n._x_doHide=()=>{wt(()=>{n.style.setProperty("display","none",e.includes("important")?"important":void 0)})}),n._x_doShow||(n._x_doShow=()=>{wt(()=>{n.style.length===1&&n.style.display==="none"?n.removeAttribute("style"):n.style.removeProperty("display")})});let r=()=>{n._x_doHide(),n._x_isShown=!1},a=()=>{n._x_doShow(),n._x_isShown=!0},o=()=>setTimeout(a),l=gc(u=>u?a():r(),u=>{typeof n._x_toggleAndCascadeWithTransitions=="function"?n._x_toggleAndCascadeWithTransitions(n,u,a,r):u?o():r()}),c,h=!0;i(()=>s(u=>{!h&&u===c||(e.includes("immediate")&&(u?o():r()),l(u),c=u,h=!1)}))});Pt("for",(n,{expression:e},{effect:t,cleanup:i})=>{let s=B0(e),r=qt(n,s.items),a=qt(n,n._x_keyExpression||"index");n._x_lookup=new Map,t(()=>k0(n,s,r,a)),i(()=>{n._x_lookup.forEach(o=>wt(()=>{Rr(o),o.remove()})),delete n._x_lookup})});function F0(n){return e=>{Object.entries(e).forEach(([t,i])=>{n[t]=i})}}function k0(n,e,t,i){t(s=>{V0(s)&&(s=Array.from({length:s},(c,h)=>h+1)),s==null&&(s=[]),s instanceof Set&&(s=Array.from(s)),s instanceof Map&&(s=Array.from(s));let r=n._x_lookup,a=new Map;n._x_lookup=a;let o=H0(s),l=Object.entries(s).map(([c,h])=>{o||(c=parseInt(c));let u=z0(e,h,c,s),f;return i(d=>{typeof d=="object"&&ji("x-for key cannot be an object, it must be a string or an integer",n),r.has(d)&&(a.set(d,r.get(d)),r.delete(d)),f=d},{scope:{index:c,...u}}),[f,u]});wt(()=>{r.forEach(u=>{Rr(u),u.remove()});let c=new Set,h=n;l.forEach(([u,f])=>{if(a.has(u)){let m=a.get(u);m._x_refreshXForScope(f),h.nextElementSibling!==m&&(h.nextElementSibling&&m.replaceWith(h.nextElementSibling),h.after(m)),h=m,m._x_currentIfEl&&(m.nextElementSibling!==m._x_currentIfEl&&h.after(m._x_currentIfEl),h=m._x_currentIfEl);return}n.content.children.length>1&&ji("x-for templates require a single root element, additional elements will be ignored.",n);let d=document.importNode(n.content,!0).firstElementChild,_=Ar(f);Ia(d,_,n),d._x_refreshXForScope=F0(_),a.set(u,d),c.add(d),h.after(d),h=d}),Bn(()=>c.forEach(u=>cn(u)))()})})}function B0(n){let e=/,([^,\}\]]*)(?:,([^,\}\]]*))?$/,t=/^\s*\(|\)\s*$/g,i=/([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/,s=n.match(i);if(!s)return;let r={};r.items=s[2].trim();let a=s[1].replace(t,"").trim(),o=a.match(e);return o?(r.item=a.replace(e,"").trim(),r.index=o[1].trim(),o[2]&&(r.collection=o[2].trim())):r.item=a,r}function z0(n,e,t,i){let s={};return/^\[.*\]$/.test(n.item)&&Array.isArray(e)?n.item.replace("[","").replace("]","").split(",").map(a=>a.trim()).forEach((a,o)=>{s[a]=e[o]}):/^\{.*\}$/.test(n.item)&&!Array.isArray(e)&&typeof e=="object"?n.item.replace("{","").replace("}","").split(",").map(a=>a.trim()).forEach(a=>{s[a]=e[a]}):s[n.item]=e,n.index&&(s[n.index]=t),n.collection&&(s[n.collection]=i),s}function V0(n){return typeof n!="object"&&!isNaN(n)}function H0(n){return typeof n=="object"&&!Array.isArray(n)}function fm(){}fm.inline=(n,{expression:e},{cleanup:t})=>{let i=qo(n);i&&(i._x_refs||(i._x_refs={}),i._x_refs[e]=n,t(()=>delete i._x_refs[e]))};Pt("ref",fm);Pt("if",(n,{expression:e},{effect:t,cleanup:i})=>{n.tagName.toLowerCase()!=="template"&&ji("x-if can only be used on a <template> tag",n);let s=qt(n,e),r=()=>{if(n._x_currentIfEl)return n._x_currentIfEl;let o=n.content.cloneNode(!0).firstElementChild;return Ia(o,{},n),wt(()=>{n.after(o),Bn(()=>cn(o))()}),n._x_currentIfEl=o,n._x_undoIf=()=>{wt(()=>{Rr(o),o.remove()}),delete n._x_currentIfEl},o},a=()=>{n._x_undoIf&&(n._x_undoIf(),delete n._x_undoIf)};t(()=>s(o=>{o?r():a()})),i(()=>n._x_undoIf&&n._x_undoIf())});Pt("id",(n,{expression:e},{evaluate:t})=>{t(e).forEach(s=>E0(n,s))});jo((n,e)=>{n._x_ids&&(e._x_ids=n._x_ids)});Wh(yp("@",wp(Cr("on:"))));Pt("on",Bn((n,{value:e,modifiers:t,expression:i},{cleanup:s})=>{let r=i?qt(n,i):()=>{};n.tagName.toLowerCase()==="template"&&(n._x_forwardEvents||(n._x_forwardEvents=[]),n._x_forwardEvents.includes(e)||n._x_forwardEvents.push(e));let a=rr(n,e,t,o=>{r(()=>{},{scope:{$event:o},params:[o]})});s(()=>a())}));Jo("Collapse","collapse","collapse");Jo("Intersect","intersect","intersect");Jo("Focus","trap","focus");Jo("Mask","mask","mask");function Jo(n,e,t){Pt(e,i=>ji(`You can't use [x-${e}] without first installing the "${n}" plugin here: https://alpinejs.dev/plugins/${t}`,i))}Lr.setEvaluator(X_);Lr.setRawEvaluator(J_);Lr.setReactivityEngine({reactive:nu,effect:Zv,release:Jv,raw:ct});var $0=Lr,su=$0;class G0{breakPoint;attrNames;devicePixelRatio;browser;touchDevice;pcLayout;tablet;mobile;constructor(){this.breakPoint={pc:1600,sp:768},this.attrNames={devicePixelRatio:{key:"data-device-pixel-ratio"},touchDevice:{key:"data-touch-device"},browserName:{key:"data-browser",chrome:"chrome",safari:"safari",edge:"edge",opera:"opera",firefox:"firefox",uaClientHints:{chrome:"Google Chrome",edge:"Microsoft Edge",opera:"Opera"},others:"others"},layout:{key:"data-layout",value:{pc:"pc",sp:"sp"}}},this.touchDevice=!1,this.pcLayout=!1,this.tablet=!1,this.mobile=!1,this.devicePixelRatio=1,this.browser="",this.init()}init(){this.devicePixelRatio=this.getDevicePixelRatio(),this.browser=this.getBrowser(),this.touchDevice=this.getTouchDevice(),this.pcLayout=this.getPcLayout(),this.tablet=this.getTablet(),this.mobile=this.getMobile()}getDevicePixelRatio(){const e=window.devicePixelRatio;return document.documentElement&&document.documentElement.setAttribute(this.attrNames.devicePixelRatio.key,e.toString()),e}getBrowser(){let e=this.attrNames.browserName.others;const t=window.navigator.userAgentData;if(t){const i=t.brands;i&&i.length&&i.forEach(s=>{const r=s.brand;switch(!0){case r.indexOf(this.attrNames.browserName.uaClientHints.chrome)!==-1:e=this.attrNames.browserName.uaClientHints.chrome;break;case r.indexOf(this.attrNames.browserName.uaClientHints.edge)!==-1:e=this.attrNames.browserName.uaClientHints.edge;break;case r.indexOf(this.attrNames.browserName.uaClientHints.opera)!==-1:e=this.attrNames.browserName.uaClientHints.opera;break}document.documentElement.setAttribute(this.attrNames.browserName.key,e)})}else{let i=window.navigator.userAgent;if(i){switch(i=i.toLowerCase(),!0){case i.indexOf("chrome")!==-1:e=this.attrNames.browserName.chrome;break;case i.indexOf("safari")!==-1:e=this.attrNames.browserName.safari;break;case i.indexOf("opera")!==-1:e=this.attrNames.browserName.opera;break;case i.indexOf("firefox")!==-1:e=this.attrNames.browserName.firefox;break;case i.indexOf("edge")!==-1:e=this.attrNames.browserName.edge;break}document.documentElement.setAttribute(this.attrNames.browserName.key,e)}}return e}getTouchDevice(){const e=matchMedia?.("(pointer:coarse)");let t=!1;return"maxTouchPoints"in navigator&&(t=navigator.maxTouchPoints>0),e?.media==="(pointer:coarse)"&&(t=!!e.matches),"orientation"in window&&(t=!0),t?document.documentElement.setAttribute(this.attrNames.touchDevice.key,"true"):document.documentElement.setAttribute(this.attrNames.touchDevice.key,"false"),t}getPcLayout(){const e=window.innerWidth>=this.breakPoint.sp;return e?document.documentElement.setAttribute(this.attrNames.layout.key,this.attrNames.layout.value.pc):document.documentElement.setAttribute(this.attrNames.layout.key,this.attrNames.layout.value.sp),e}getTablet(){return this.pcLayout&&this.touchDevice}getMobile(){return!this.pcLayout&&this.touchDevice}}class W0{eventNames;constructor(){this.eventNames={wheel:"wheel",touchMove:"ontouchmove"in document?"touchmove":"click",keyDown:"keydown",keyUp:"keyup"}}enableEvent(){window.removeEventListener(this.eventNames.wheel,this.onWheel),window.removeEventListener(this.eventNames.touchMove,this.onWheel),window.removeEventListener(this.eventNames.keyDown,this.onKeyDown),window.removeEventListener(this.eventNames.keyUp,this.onKeyUp)}disableEvent(){window.addEventListener(this.eventNames.wheel,this.onWheel,{passive:!1}),window.addEventListener(this.eventNames.touchMove,this.onWheel,{passive:!1}),window.addEventListener(this.eventNames.keyDown,this.onKeyDown),window.addEventListener(this.eventNames.keyUp,this.onKeyUp)}onWheel=e=>{this.prevent(e)};onKeyDown=e=>{this.prevent(e)};onKeyUp=e=>{this.prevent(e)};prevent=e=>{e.preventDefault()}}class q0{options;dataNames;inViewList;outViewList;observer;observerCount;constructor(e={}){this.options=e,this.dataNames={observerId:"observerId"},this.inViewList=[],this.outViewList=[],this.observer=null,this.observerCount=0}init(){this.createObserver()}createObserver(){this.observer=new IntersectionObserver(e=>{this.callback(e)},this.options)}add(e,t=()=>{},i=()=>{}){e.dataset[this.dataNames.observerId]=this.observerCount.toString(),this.inViewList[this.observerCount]=t,this.outViewList[this.observerCount]=i,this.observer&&this.observer.observe(e),this.observerCount++}remove(e){const t=e.dataset[this.dataNames.observerId],i=Number(t);this.inViewList[i]=()=>{},this.outViewList[i]=()=>{},e.dataset[this.dataNames.observerId]="",this.observer&&this.observer.unobserve(e)}callback(e){e.forEach(t=>{t.isIntersecting?this.inView(t):this.outView(t)})}inView(e){const s=e.target.dataset[this.dataNames.observerId],r=Number(s);this.inViewList[r]()}outView(e){const s=e.target.dataset[this.dataNames.observerId],r=Number(s);this.outViewList[r]()}}function ru(n,e,t){return Math.min(Math.max(n,e),t)}function X0(n,e,t=.5){return t>1?e:t<0?n:n*(1-t)+e*t}function hf(n,e=1){return Math.round(n*e)/e}class j0{size;prevSize;firstViewSize;pcDevice;pixelRatio;breakPoint;constructor(){this.size={window:{x:0,y:0},body:{x:0,y:0}},this.prevSize={body:{x:0}},this.firstViewSize={window:{x:0,y:0}},this.pcDevice=!0,this.pixelRatio=window.devicePixelRatio,this.breakPoint=768}init(){this.pcDevice=!I.detection.mobile&&!I.detection.tablet,this.setSize(),this.setPrevSize(),this.setFirstViewSize(),this.setVariable(),this.addEventListeners()}setSize(){this.size.window.x=window.innerWidth,this.size.window.y=window.innerHeight,document.body.style.width="100%",this.size.body.x=document.body.clientWidth,this.size.body.y=document.body.clientHeight,document.body.style.width=""}setPrevSize(){this.prevSize.body.x=this.size.body.x}setFirstViewSize(){this.firstViewSize.window.y=this.size.window.y}setVariable(){const e=hf(document.documentElement.clientWidth*.01,1e4),t=hf(this.size.window.y*.01,1e4);document.documentElement.style.setProperty("--vw",`${e}px`),document.documentElement.style.setProperty("--vh",`${t}px`)}addEventListeners(){window.addEventListener("resize",this.onResize,!1)}onResize=()=>{window.requestAnimationFrame(()=>{this.isChangedDevicePixelRatio()&&window.location.reload(),this.setSize(),this.isChangedLayout()&&window.location.reload(),this.setVariable(),this.setPrevSize()})};isChangedLayout(){return I.detection.pcLayout?this.size.body.x<this.breakPoint:this.size.body.x>=this.breakPoint}isChangedDevicePixelRatio(){return this.pixelRatio!==I.detection.getDevicePixelRatio()}}var Y0="1.3.17";function dm(n,e,t){return Math.max(n,Math.min(e,t))}function K0(n,e,t){return(1-t)*n+t*e}function Z0(n,e,t,i){return K0(n,e,1-Math.exp(-t*i))}function J0(n,e){return(n%e+e)%e}var Q0=class{isRunning=!1;value=0;from=0;to=0;currentTime=0;lerp;duration;easing;onUpdate;advance(n){if(!this.isRunning)return;let e=!1;if(this.duration&&this.easing){this.currentTime+=n;const t=dm(0,this.currentTime/this.duration,1);e=t>=1;const i=e?1:this.easing(t);this.value=this.from+(this.to-this.from)*i}else this.lerp?(this.value=Z0(this.value,this.to,this.lerp*60,n),Math.round(this.value)===this.to&&(this.value=this.to,e=!0)):(this.value=this.to,e=!0);e&&this.stop(),this.onUpdate?.(this.value,e)}stop(){this.isRunning=!1}fromTo(n,e,{lerp:t,duration:i,easing:s,onStart:r,onUpdate:a}){this.from=this.value=n,this.to=e,this.lerp=t,this.duration=i,this.easing=s,this.currentTime=0,this.isRunning=!0,r?.(),this.onUpdate=a}};function ex(n,e){let t;return function(...i){let s=this;clearTimeout(t),t=setTimeout(()=>{t=void 0,n.apply(s,i)},e)}}var tx=class{constructor(n,e,{autoResize:t=!0,debounce:i=250}={}){this.wrapper=n,this.content=e,t&&(this.debouncedResize=ex(this.resize,i),this.wrapper instanceof Window?window.addEventListener("resize",this.debouncedResize,!1):(this.wrapperResizeObserver=new ResizeObserver(this.debouncedResize),this.wrapperResizeObserver.observe(this.wrapper)),this.contentResizeObserver=new ResizeObserver(this.debouncedResize),this.contentResizeObserver.observe(this.content)),this.resize()}width=0;height=0;scrollHeight=0;scrollWidth=0;debouncedResize;wrapperResizeObserver;contentResizeObserver;destroy(){this.wrapperResizeObserver?.disconnect(),this.contentResizeObserver?.disconnect(),this.wrapper===window&&this.debouncedResize&&window.removeEventListener("resize",this.debouncedResize,!1)}resize=()=>{this.onWrapperResize(),this.onContentResize()};onWrapperResize=()=>{this.wrapper instanceof Window?(this.width=window.innerWidth,this.height=window.innerHeight):(this.width=this.wrapper.clientWidth,this.height=this.wrapper.clientHeight)};onContentResize=()=>{this.wrapper instanceof Window?(this.scrollHeight=this.content.scrollHeight,this.scrollWidth=this.content.scrollWidth):(this.scrollHeight=this.wrapper.scrollHeight,this.scrollWidth=this.wrapper.scrollWidth)};get limit(){return{x:this.scrollWidth-this.width,y:this.scrollHeight-this.height}}},pm=class{events={};emit(n,...e){let t=this.events[n]||[];for(let i=0,s=t.length;i<s;i++)t[i]?.(...e)}on(n,e){return this.events[n]?.push(e)||(this.events[n]=[e]),()=>{this.events[n]=this.events[n]?.filter(t=>e!==t)}}off(n,e){this.events[n]=this.events[n]?.filter(t=>e!==t)}destroy(){this.events={}}},uf=100/6,vn={passive:!1},ix=class{constructor(n,e={wheelMultiplier:1,touchMultiplier:1}){this.element=n,this.options=e,window.addEventListener("resize",this.onWindowResize,!1),this.onWindowResize(),this.element.addEventListener("wheel",this.onWheel,vn),this.element.addEventListener("touchstart",this.onTouchStart,vn),this.element.addEventListener("touchmove",this.onTouchMove,vn),this.element.addEventListener("touchend",this.onTouchEnd,vn)}touchStart={x:0,y:0};lastDelta={x:0,y:0};window={width:0,height:0};emitter=new pm;on(n,e){return this.emitter.on(n,e)}destroy(){this.emitter.destroy(),window.removeEventListener("resize",this.onWindowResize,!1),this.element.removeEventListener("wheel",this.onWheel,vn),this.element.removeEventListener("touchstart",this.onTouchStart,vn),this.element.removeEventListener("touchmove",this.onTouchMove,vn),this.element.removeEventListener("touchend",this.onTouchEnd,vn)}onTouchStart=n=>{const{clientX:e,clientY:t}=n.targetTouches?n.targetTouches[0]:n;this.touchStart.x=e,this.touchStart.y=t,this.lastDelta={x:0,y:0},this.emitter.emit("scroll",{deltaX:0,deltaY:0,event:n})};onTouchMove=n=>{const{clientX:e,clientY:t}=n.targetTouches?n.targetTouches[0]:n,i=-(e-this.touchStart.x)*this.options.touchMultiplier,s=-(t-this.touchStart.y)*this.options.touchMultiplier;this.touchStart.x=e,this.touchStart.y=t,this.lastDelta={x:i,y:s},this.emitter.emit("scroll",{deltaX:i,deltaY:s,event:n})};onTouchEnd=n=>{this.emitter.emit("scroll",{deltaX:this.lastDelta.x,deltaY:this.lastDelta.y,event:n})};onWheel=n=>{let{deltaX:e,deltaY:t,deltaMode:i}=n;const s=i===1?uf:i===2?this.window.width:1,r=i===1?uf:i===2?this.window.height:1;e*=s,t*=r,e*=this.options.wheelMultiplier,t*=this.options.wheelMultiplier,this.emitter.emit("scroll",{deltaX:e,deltaY:t,event:n})};onWindowResize=()=>{this.window={width:window.innerWidth,height:window.innerHeight}}},ff=n=>Math.min(1,1.001-Math.pow(2,-10*n)),nx=class{_isScrolling=!1;_isStopped=!1;_isLocked=!1;_preventNextNativeScrollEvent=!1;_resetVelocityTimeout=null;_rafId=null;isTouching;time=0;userData={};lastVelocity=0;velocity=0;direction=0;options;targetScroll;animatedScroll;animate=new Q0;emitter=new pm;dimensions;virtualScroll;constructor({wrapper:n=window,content:e=document.documentElement,eventsTarget:t=n,smoothWheel:i=!1,syncTouch:s=!1,syncTouchLerp:r=.075,touchInertiaExponent:a=1.7,duration:o,easing:l,lerp:c=.1,infinite:h=!1,orientation:u="vertical",gestureOrientation:f=u==="horizontal"?"both":"vertical",touchMultiplier:d=1,wheelMultiplier:_=1,autoResize:m=!0,prevent:g,virtualScroll:p,overscroll:x=!0,autoRaf:M=!1,anchors:y=!1,autoToggle:w=!1,allowNestedScroll:E=!1,__experimental__naiveDimensions:P=!1,naiveDimensions:L=P,stopInertiaOnNavigate:v=!1}={}){window.lenisVersion=Y0,(!n||n===document.documentElement)&&(n=window),typeof o=="number"&&typeof l!="function"?l=ff:typeof l=="function"&&typeof o!="number"&&(o=1),this.options={wrapper:n,content:e,eventsTarget:t,smoothWheel:i,syncTouch:s,syncTouchLerp:r,touchInertiaExponent:a,duration:o,easing:l,lerp:c,infinite:h,gestureOrientation:f,orientation:u,touchMultiplier:d,wheelMultiplier:_,autoResize:m,prevent:g,virtualScroll:p,overscroll:x,autoRaf:M,anchors:y,autoToggle:w,allowNestedScroll:E,naiveDimensions:L,stopInertiaOnNavigate:v},this.dimensions=new tx(n,e,{autoResize:m}),this.updateClassName(),this.targetScroll=this.animatedScroll=this.actualScroll,this.options.wrapper.addEventListener("scroll",this.onNativeScroll,!1),this.options.wrapper.addEventListener("scrollend",this.onScrollEnd,{capture:!0}),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.addEventListener("click",this.onClick,!1),this.options.wrapper.addEventListener("pointerdown",this.onPointerDown,!1),this.virtualScroll=new ix(t,{touchMultiplier:d,wheelMultiplier:_}),this.virtualScroll.on("scroll",this.onVirtualScroll),this.options.autoToggle&&(this.checkOverflow(),this.rootElement.addEventListener("transitionend",this.onTransitionEnd,{passive:!0})),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))}destroy(){this.emitter.destroy(),this.options.wrapper.removeEventListener("scroll",this.onNativeScroll,!1),this.options.wrapper.removeEventListener("scrollend",this.onScrollEnd,{capture:!0}),this.options.wrapper.removeEventListener("pointerdown",this.onPointerDown,!1),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.removeEventListener("click",this.onClick,!1),this.virtualScroll.destroy(),this.dimensions.destroy(),this.cleanUpClassName(),this._rafId&&cancelAnimationFrame(this._rafId)}on(n,e){return this.emitter.on(n,e)}off(n,e){return this.emitter.off(n,e)}onScrollEnd=n=>{n instanceof CustomEvent||(this.isScrolling==="smooth"||this.isScrolling===!1)&&n.stopPropagation()};dispatchScrollendEvent=()=>{this.options.wrapper.dispatchEvent(new CustomEvent("scrollend",{bubbles:this.options.wrapper===window,detail:{lenisScrollEnd:!0}}))};get overflow(){const n=this.isHorizontal?"overflow-x":"overflow-y";return getComputedStyle(this.rootElement)[n]}checkOverflow(){["hidden","clip"].includes(this.overflow)?this.internalStop():this.internalStart()}onTransitionEnd=n=>{n.propertyName.includes("overflow")&&this.checkOverflow()};setScroll(n){this.isHorizontal?this.options.wrapper.scrollTo({left:n,behavior:"instant"}):this.options.wrapper.scrollTo({top:n,behavior:"instant"})}onClick=n=>{const t=n.composedPath().filter(i=>i instanceof HTMLAnchorElement&&i.getAttribute("href"));if(this.options.anchors){const i=t.find(s=>s.getAttribute("href")?.includes("#"));if(i){const s=i.getAttribute("href");if(s){const r=typeof this.options.anchors=="object"&&this.options.anchors?this.options.anchors:void 0,a=`#${s.split("#")[1]}`;this.scrollTo(a,r)}}}this.options.stopInertiaOnNavigate&&t.find(s=>s.host===window.location.host)&&this.reset()};onPointerDown=n=>{n.button===1&&this.reset()};onVirtualScroll=n=>{if(typeof this.options.virtualScroll=="function"&&this.options.virtualScroll(n)===!1)return;const{deltaX:e,deltaY:t,event:i}=n;if(this.emitter.emit("virtual-scroll",{deltaX:e,deltaY:t,event:i}),i.ctrlKey||i.lenisStopPropagation)return;const s=i.type.includes("touch"),r=i.type.includes("wheel");this.isTouching=i.type==="touchstart"||i.type==="touchmove";const a=e===0&&t===0;if(this.options.syncTouch&&s&&i.type==="touchstart"&&a&&!this.isStopped&&!this.isLocked){this.reset();return}const l=this.options.gestureOrientation==="vertical"&&t===0||this.options.gestureOrientation==="horizontal"&&e===0;if(a||l)return;let c=i.composedPath();c=c.slice(0,c.indexOf(this.rootElement));const h=this.options.prevent;if(c.find(g=>g instanceof HTMLElement&&(typeof h=="function"&&h?.(g)||g.hasAttribute?.("data-lenis-prevent")||s&&g.hasAttribute?.("data-lenis-prevent-touch")||r&&g.hasAttribute?.("data-lenis-prevent-wheel")||this.options.allowNestedScroll&&this.checkNestedScroll(g,{deltaX:e,deltaY:t}))))return;if(this.isStopped||this.isLocked){i.cancelable&&i.preventDefault();return}if(!(this.options.syncTouch&&s||this.options.smoothWheel&&r)){this.isScrolling="native",this.animate.stop(),i.lenisStopPropagation=!0;return}let f=t;this.options.gestureOrientation==="both"?f=Math.abs(t)>Math.abs(e)?t:e:this.options.gestureOrientation==="horizontal"&&(f=e),(!this.options.overscroll||this.options.infinite||this.options.wrapper!==window&&this.limit>0&&(this.animatedScroll>0&&this.animatedScroll<this.limit||this.animatedScroll===0&&t>0||this.animatedScroll===this.limit&&t<0))&&(i.lenisStopPropagation=!0),i.cancelable&&i.preventDefault();const d=s&&this.options.syncTouch,m=s&&i.type==="touchend";m&&(f=Math.sign(this.velocity)*Math.pow(Math.abs(this.velocity),this.options.touchInertiaExponent)),this.scrollTo(this.targetScroll+f,{programmatic:!1,...d?{lerp:m?this.options.syncTouchLerp:1}:{lerp:this.options.lerp,duration:this.options.duration,easing:this.options.easing}})};resize(){this.dimensions.resize(),this.animatedScroll=this.targetScroll=this.actualScroll,this.emit()}emit(){this.emitter.emit("scroll",this)}onNativeScroll=()=>{if(this._resetVelocityTimeout!==null&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this._preventNextNativeScrollEvent){this._preventNextNativeScrollEvent=!1;return}if(this.isScrolling===!1||this.isScrolling==="native"){const n=this.animatedScroll;this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity,this.velocity=this.animatedScroll-n,this.direction=Math.sign(this.animatedScroll-n),this.isStopped||(this.isScrolling="native"),this.emit(),this.velocity!==0&&(this._resetVelocityTimeout=setTimeout(()=>{this.lastVelocity=this.velocity,this.velocity=0,this.isScrolling=!1,this.emit()},400))}};reset(){this.isLocked=!1,this.isScrolling=!1,this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity=0,this.animate.stop()}start(){if(this.isStopped){if(this.options.autoToggle){this.rootElement.style.removeProperty("overflow");return}this.internalStart()}}internalStart(){this.isStopped&&(this.reset(),this.isStopped=!1,this.emit())}stop(){if(!this.isStopped){if(this.options.autoToggle){this.rootElement.style.setProperty("overflow","clip");return}this.internalStop()}}internalStop(){this.isStopped||(this.reset(),this.isStopped=!0,this.emit())}raf=n=>{const e=n-(this.time||n);this.time=n,this.animate.advance(e*.001),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))};scrollTo(n,{offset:e=0,immediate:t=!1,lock:i=!1,programmatic:s=!0,lerp:r=s?this.options.lerp:void 0,duration:a=s?this.options.duration:void 0,easing:o=s?this.options.easing:void 0,onStart:l,onComplete:c,force:h=!1,userData:u}={}){if(!((this.isStopped||this.isLocked)&&!h)){if(typeof n=="string"&&["top","left","start","#"].includes(n))n=0;else if(typeof n=="string"&&["bottom","right","end"].includes(n))n=this.limit;else{let f;if(typeof n=="string"?(f=document.querySelector(n),f||(n==="#top"?n=0:console.warn("Lenis: Target not found",n))):n instanceof HTMLElement&&n?.nodeType&&(f=n),f){if(this.options.wrapper!==window){const _=this.rootElement.getBoundingClientRect();e-=this.isHorizontal?_.left:_.top}const d=f.getBoundingClientRect();n=(this.isHorizontal?d.left:d.top)+this.animatedScroll}}if(typeof n=="number"){if(n+=e,n=Math.round(n),this.options.infinite){if(s){this.targetScroll=this.animatedScroll=this.scroll;const f=n-this.animatedScroll;f>this.limit/2?n=n-this.limit:f<-this.limit/2&&(n=n+this.limit)}}else n=dm(0,n,this.limit);if(n===this.targetScroll){l?.(this),c?.(this);return}if(this.userData=u??{},t){this.animatedScroll=this.targetScroll=n,this.setScroll(this.scroll),this.reset(),this.preventNextNativeScrollEvent(),this.emit(),c?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()});return}s||(this.targetScroll=n),typeof a=="number"&&typeof o!="function"?o=ff:typeof o=="function"&&typeof a!="number"&&(a=1),this.animate.fromTo(this.animatedScroll,n,{duration:a,easing:o,lerp:r,onStart:()=>{i&&(this.isLocked=!0),this.isScrolling="smooth",l?.(this)},onUpdate:(f,d)=>{this.isScrolling="smooth",this.lastVelocity=this.velocity,this.velocity=f-this.animatedScroll,this.direction=Math.sign(this.velocity),this.animatedScroll=f,this.setScroll(this.scroll),s&&(this.targetScroll=f),d||this.emit(),d&&(this.reset(),this.emit(),c?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()}),this.preventNextNativeScrollEvent())}})}}}preventNextNativeScrollEvent(){this._preventNextNativeScrollEvent=!0,requestAnimationFrame(()=>{this._preventNextNativeScrollEvent=!1})}checkNestedScroll(n,{deltaX:e,deltaY:t}){const i=Date.now(),s=n._lenis??={};let r,a,o,l,c,h,u,f;const d=this.options.gestureOrientation;if(i-(s.time??0)>2e3){s.time=Date.now();const w=window.getComputedStyle(n);s.computedStyle=w;const E=w.overflowX,P=w.overflowY;if(r=["auto","overlay","scroll"].includes(E),a=["auto","overlay","scroll"].includes(P),s.hasOverflowX=r,s.hasOverflowY=a,!r&&!a||d==="vertical"&&!a||d==="horizontal"&&!r)return!1;c=n.scrollWidth,h=n.scrollHeight,u=n.clientWidth,f=n.clientHeight,o=c>u,l=h>f,s.isScrollableX=o,s.isScrollableY=l,s.scrollWidth=c,s.scrollHeight=h,s.clientWidth=u,s.clientHeight=f}else o=s.isScrollableX,l=s.isScrollableY,r=s.hasOverflowX,a=s.hasOverflowY,c=s.scrollWidth,h=s.scrollHeight,u=s.clientWidth,f=s.clientHeight;if(!r&&!a||!o&&!l||d==="vertical"&&(!a||!l)||d==="horizontal"&&(!r||!o))return!1;let _;if(d==="horizontal")_="x";else if(d==="vertical")_="y";else{const w=e!==0,E=t!==0;w&&r&&o&&(_="x"),E&&a&&l&&(_="y")}if(!_)return!1;let m,g,p,x,M;if(_==="x")m=n.scrollLeft,g=c-u,p=e,x=r,M=o;else if(_==="y")m=n.scrollTop,g=h-f,p=t,x=a,M=l;else return!1;return(p>0?m<g:m>0)&&x&&M}get rootElement(){return this.options.wrapper===window?document.documentElement:this.options.wrapper}get limit(){return this.options.naiveDimensions?this.isHorizontal?this.rootElement.scrollWidth-this.rootElement.clientWidth:this.rootElement.scrollHeight-this.rootElement.clientHeight:this.dimensions.limit[this.isHorizontal?"x":"y"]}get isHorizontal(){return this.options.orientation==="horizontal"}get actualScroll(){const n=this.options.wrapper;return this.isHorizontal?n.scrollX??n.scrollLeft:n.scrollY??n.scrollTop}get scroll(){return this.options.infinite?J0(this.animatedScroll,this.limit):this.animatedScroll}get progress(){return this.limit===0?1:this.scroll/this.limit}get isScrolling(){return this._isScrolling}set isScrolling(n){this._isScrolling!==n&&(this._isScrolling=n,this.updateClassName())}get isStopped(){return this._isStopped}set isStopped(n){this._isStopped!==n&&(this._isStopped=n,this.updateClassName())}get isLocked(){return this._isLocked}set isLocked(n){this._isLocked!==n&&(this._isLocked=n,this.updateClassName())}get isSmooth(){return this.isScrolling==="smooth"}get className(){let n="lenis";return this.options.autoToggle&&(n+=" lenis-autoToggle"),this.isStopped&&(n+=" lenis-stopped"),this.isLocked&&(n+=" lenis-locked"),this.isScrolling&&(n+=" lenis-scrolling"),this.isScrolling==="smooth"&&(n+=" lenis-smooth"),n}updateClassName(){this.cleanUpClassName(),this.rootElement.className=`${this.rootElement.className} ${this.className}`.trim()}cleanUpClassName(){this.rootElement.className=this.rootElement.className.replace(/lenis(-\w+)?/g,"").trim()}};class sx{lenis;raf;constructor(){this.lenis=null,this.raf=null}init(){this.lenis=new nx,this.raf=e=>{this.lenis&&this.lenis.raf(e),this.raf&&window.requestAnimationFrame(this.raf)},this.raf&&window.requestAnimationFrame(this.raf)}start(){this.lenis&&this.lenis.start()}stop(){this.lenis&&this.lenis.stop()}}const au="182",rx=0,df=1,ax=2,wo=1,ox=2,Zr=3,On=0,Jt=1,Nt=2,Wi=0,ur=1,pf=2,mf=3,gf=4,lx=5,ns=100,cx=101,hx=102,ux=103,fx=104,dx=200,px=201,mx=202,gx=203,wc=204,Mc=205,_x=206,vx=207,xx=208,Sx=209,yx=210,wx=211,Mx=212,bx=213,Ex=214,bc=0,Ec=1,Tc=2,_r=3,Ac=4,Pc=5,Cc=6,Rc=7,mm=0,Tx=1,Ax=2,qi=0,gm=1,_m=2,vm=3,xm=4,Sm=5,ym=6,wm=7,Mm=300,Ss=301,vr=302,Lc=303,Ic=304,Qo=306,Dc=1e3,Ii=1001,Nc=1002,Rt=1003,Px=1004,Wa=1005,vt=1006,ml=1007,as=1008,Mi=1009,bm=1010,Em=1011,ga=1012,ou=1013,Yi=1014,Di=1015,hn=1016,lu=1017,cu=1018,_a=1020,Tm=35902,Am=35899,Pm=1021,Cm=1022,hi=1023,un=1026,os=1027,Rm=1028,hu=1029,xr=1030,uu=1031,fu=1033,Mo=33776,bo=33777,Eo=33778,To=33779,Oc=35840,Uc=35841,Fc=35842,kc=35843,Bc=36196,zc=37492,Vc=37496,Hc=37488,$c=37489,Gc=37490,Wc=37491,qc=37808,Xc=37809,jc=37810,Yc=37811,Kc=37812,Zc=37813,Jc=37814,Qc=37815,eh=37816,th=37817,ih=37818,nh=37819,sh=37820,rh=37821,ah=36492,oh=36494,lh=36495,ch=36283,hh=36284,uh=36285,fh=36286,Cx=3200,Rx=0,Lx=1,Tn="",yi="srgb",ys="srgb-linear",Oo="linear",it="srgb",As=7680,_f=519,Ix=512,Dx=513,Nx=514,du=515,Ox=516,Ux=517,pu=518,Fx=519,vf=35044,xf="300 es",$i=2e3,Uo=2001;function Lm(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function va(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function kx(){const n=va("canvas");return n.style.display="block",n}const Sf={};function yf(...n){const e="THREE."+n.shift();console.log(e,...n)}function Ue(...n){const e="THREE."+n.shift();console.warn(e,...n)}function Ke(...n){const e="THREE."+n.shift();console.error(e,...n)}function xa(...n){const e=n.join(" ");e in Sf||(Sf[e]=!0,Ue(...n))}function Bx(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}class Ir{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const kt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let wf=1234567;const sa=Math.PI/180,Sa=180/Math.PI;function Dr(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(kt[n&255]+kt[n>>8&255]+kt[n>>16&255]+kt[n>>24&255]+"-"+kt[e&255]+kt[e>>8&255]+"-"+kt[e>>16&15|64]+kt[e>>24&255]+"-"+kt[t&63|128]+kt[t>>8&255]+"-"+kt[t>>16&255]+kt[t>>24&255]+kt[i&255]+kt[i>>8&255]+kt[i>>16&255]+kt[i>>24&255]).toLowerCase()}function He(n,e,t){return Math.max(e,Math.min(t,n))}function mu(n,e){return(n%e+e)%e}function zx(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}function Vx(n,e,t){return n!==e?(t-n)/(e-n):0}function ra(n,e,t){return(1-t)*n+t*e}function Hx(n,e,t,i){return ra(n,e,1-Math.exp(-t*i))}function $x(n,e=1){return e-Math.abs(mu(n,e*2)-e)}function Gx(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function Wx(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function qx(n,e){return n+Math.floor(Math.random()*(e-n+1))}function Xx(n,e){return n+Math.random()*(e-n)}function jx(n){return n*(.5-Math.random())}function Yx(n){n!==void 0&&(wf=n);let e=wf+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Kx(n){return n*sa}function Zx(n){return n*Sa}function Jx(n){return(n&n-1)===0&&n!==0}function Qx(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function eS(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function tS(n,e,t,i,s){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+i)/2),h=a((e+i)/2),u=r((e-i)/2),f=a((e-i)/2),d=r((i-e)/2),_=a((i-e)/2);switch(s){case"XYX":n.set(o*h,l*u,l*f,o*c);break;case"YZY":n.set(l*f,o*h,l*u,o*c);break;case"ZXZ":n.set(l*u,l*f,o*h,o*c);break;case"XZX":n.set(o*h,l*_,l*d,o*c);break;case"YXY":n.set(l*d,o*h,l*_,o*c);break;case"ZYZ":n.set(l*_,l*d,o*h,o*c);break;default:Ue("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function ar(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function $t(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const iS={DEG2RAD:sa,RAD2DEG:Sa,generateUUID:Dr,clamp:He,euclideanModulo:mu,mapLinear:zx,inverseLerp:Vx,lerp:ra,damp:Hx,pingpong:$x,smoothstep:Gx,smootherstep:Wx,randInt:qx,randFloat:Xx,randFloatSpread:jx,seededRandom:Yx,degToRad:Kx,radToDeg:Zx,isPowerOfTwo:Jx,ceilPowerOfTwo:Qx,floorPowerOfTwo:eS,setQuaternionFromProperEuler:tS,normalize:$t,denormalize:ar};class Pe{constructor(e=0,t=0){Pe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=He(this.x,e.x,t.x),this.y=He(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=He(this.x,e,t),this.y=He(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(He(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(He(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Da{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,a,o){let l=i[s+0],c=i[s+1],h=i[s+2],u=i[s+3],f=r[a+0],d=r[a+1],_=r[a+2],m=r[a+3];if(o<=0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(o>=1){e[t+0]=f,e[t+1]=d,e[t+2]=_,e[t+3]=m;return}if(u!==m||l!==f||c!==d||h!==_){let g=l*f+c*d+h*_+u*m;g<0&&(f=-f,d=-d,_=-_,m=-m,g=-g);let p=1-o;if(g<.9995){const x=Math.acos(g),M=Math.sin(x);p=Math.sin(p*x)/M,o=Math.sin(o*x)/M,l=l*p+f*o,c=c*p+d*o,h=h*p+_*o,u=u*p+m*o}else{l=l*p+f*o,c=c*p+d*o,h=h*p+_*o,u=u*p+m*o;const x=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=x,c*=x,h*=x,u*=x}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,s,r,a){const o=i[s],l=i[s+1],c=i[s+2],h=i[s+3],u=r[a],f=r[a+1],d=r[a+2],_=r[a+3];return e[t]=o*_+h*u+l*d-c*f,e[t+1]=l*_+h*f+c*u-o*d,e[t+2]=c*_+h*d+o*f-l*u,e[t+3]=h*_-o*u-l*f-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(s/2),u=o(r/2),f=l(i/2),d=l(s/2),_=l(r/2);switch(a){case"XYZ":this._x=f*h*u+c*d*_,this._y=c*d*u-f*h*_,this._z=c*h*_+f*d*u,this._w=c*h*u-f*d*_;break;case"YXZ":this._x=f*h*u+c*d*_,this._y=c*d*u-f*h*_,this._z=c*h*_-f*d*u,this._w=c*h*u+f*d*_;break;case"ZXY":this._x=f*h*u-c*d*_,this._y=c*d*u+f*h*_,this._z=c*h*_+f*d*u,this._w=c*h*u-f*d*_;break;case"ZYX":this._x=f*h*u-c*d*_,this._y=c*d*u+f*h*_,this._z=c*h*_-f*d*u,this._w=c*h*u+f*d*_;break;case"YZX":this._x=f*h*u+c*d*_,this._y=c*d*u+f*h*_,this._z=c*h*_-f*d*u,this._w=c*h*u-f*d*_;break;case"XZY":this._x=f*h*u-c*d*_,this._y=c*d*u-f*h*_,this._z=c*h*_+f*d*u,this._w=c*h*u+f*d*_;break;default:Ue("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],f=i+o+u;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-l)*d,this._y=(r-c)*d,this._z=(a-s)*d}else if(i>o&&i>u){const d=2*Math.sqrt(1+i-o-u);this._w=(h-l)/d,this._x=.25*d,this._y=(s+a)/d,this._z=(r+c)/d}else if(o>u){const d=2*Math.sqrt(1+o-i-u);this._w=(r-c)/d,this._x=(s+a)/d,this._y=.25*d,this._z=(l+h)/d}else{const d=2*Math.sqrt(1+u-i-o);this._w=(a-s)/d,this._x=(r+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(He(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=i*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-i*c,this._z=r*h+a*c+i*l-s*o,this._w=a*h-i*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t<=0)return this;if(t>=1)return this.copy(e);let i=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class j{constructor(e=0,t=0,i=0){j.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Mf.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Mf.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*i),h=2*(o*t-r*s),u=2*(r*i-a*t);return this.x=t+l*c+a*u-o*h,this.y=i+l*h+o*c-r*u,this.z=s+l*u+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=He(this.x,e.x,t.x),this.y=He(this.y,e.y,t.y),this.z=He(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=He(this.x,e,t),this.y=He(this.y,e,t),this.z=He(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(He(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-i*l,this.z=i*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return gl.copy(this).projectOnVector(e),this.sub(gl)}reflect(e){return this.sub(gl.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(He(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const gl=new j,Mf=new Da;class Be{constructor(e,t,i,s,r,a,o,l,c){Be.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c)}set(e,t,i,s,r,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],h=i[4],u=i[7],f=i[2],d=i[5],_=i[8],m=s[0],g=s[3],p=s[6],x=s[1],M=s[4],y=s[7],w=s[2],E=s[5],P=s[8];return r[0]=a*m+o*x+l*w,r[3]=a*g+o*M+l*E,r[6]=a*p+o*y+l*P,r[1]=c*m+h*x+u*w,r[4]=c*g+h*M+u*E,r[7]=c*p+h*y+u*P,r[2]=f*m+d*x+_*w,r[5]=f*g+d*M+_*E,r[8]=f*p+d*y+_*P,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-i*r*h+i*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,f=o*l-h*r,d=c*r-a*l,_=t*u+i*f+s*d;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const m=1/_;return e[0]=u*m,e[1]=(s*c-h*i)*m,e[2]=(o*i-s*a)*m,e[3]=f*m,e[4]=(h*t-s*l)*m,e[5]=(s*r-o*t)*m,e[6]=d*m,e[7]=(i*l-c*t)*m,e[8]=(a*t-i*r)*m,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(_l.makeScale(e,t)),this}rotate(e){return this.premultiply(_l.makeRotation(-e)),this}translate(e,t){return this.premultiply(_l.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const _l=new Be,bf=new Be().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ef=new Be().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function nS(){const n={enabled:!0,workingColorSpace:ys,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===it&&(s.r=on(s.r),s.g=on(s.g),s.b=on(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===it&&(s.r=fr(s.r),s.g=fr(s.g),s.b=fr(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Tn?Oo:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return xa("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return xa("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[ys]:{primaries:e,whitePoint:i,transfer:Oo,toXYZ:bf,fromXYZ:Ef,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:yi},outputColorSpaceConfig:{drawingBufferColorSpace:yi}},[yi]:{primaries:e,whitePoint:i,transfer:it,toXYZ:bf,fromXYZ:Ef,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:yi}}}),n}const qe=nS();function on(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function fr(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Ps;class sS{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Ps===void 0&&(Ps=va("canvas")),Ps.width=e.width,Ps.height=e.height;const s=Ps.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=Ps}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=va("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=on(r[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(on(t[i]/255)*255):t[i]=on(t[i]);return{data:t,width:e.width,height:e.height}}else return Ue("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let rS=0;class gu{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:rS++}),this.uuid=Dr(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(vl(s[a].image)):r.push(vl(s[a]))}else r=vl(s);i.url=r}return t||(e.images[this.uuid]=i),i}}function vl(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?sS.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Ue("Texture: Unable to serialize Texture."),{})}let aS=0;const xl=new j;class Ut extends Ir{constructor(e=Ut.DEFAULT_IMAGE,t=Ut.DEFAULT_MAPPING,i=Ii,s=Ii,r=vt,a=as,o=hi,l=Mi,c=Ut.DEFAULT_ANISOTROPY,h=Tn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:aS++}),this.uuid=Dr(),this.name="",this.source=new gu(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Pe(0,0),this.repeat=new Pe(1,1),this.center=new Pe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Be,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(xl).x}get height(){return this.source.getSize(xl).y}get depth(){return this.source.getSize(xl).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){Ue(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Ue(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Mm)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Dc:e.x=e.x-Math.floor(e.x);break;case Ii:e.x=e.x<0?0:1;break;case Nc:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Dc:e.y=e.y-Math.floor(e.y);break;case Ii:e.y=e.y<0?0:1;break;case Nc:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Ut.DEFAULT_IMAGE=null;Ut.DEFAULT_MAPPING=Mm;Ut.DEFAULT_ANISOTROPY=1;class yt{constructor(e=0,t=0,i=0,s=1){yt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r;const l=e.elements,c=l[0],h=l[4],u=l[8],f=l[1],d=l[5],_=l[9],m=l[2],g=l[6],p=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-m)<.01&&Math.abs(_-g)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+m)<.1&&Math.abs(_+g)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const M=(c+1)/2,y=(d+1)/2,w=(p+1)/2,E=(h+f)/4,P=(u+m)/4,L=(_+g)/4;return M>y&&M>w?M<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(M),s=E/i,r=P/i):y>w?y<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),i=E/s,r=L/s):w<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(w),i=P/r,s=L/r),this.set(i,s,r,t),this}let x=Math.sqrt((g-_)*(g-_)+(u-m)*(u-m)+(f-h)*(f-h));return Math.abs(x)<.001&&(x=1),this.x=(g-_)/x,this.y=(u-m)/x,this.z=(f-h)/x,this.w=Math.acos((c+d+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=He(this.x,e.x,t.x),this.y=He(this.y,e.y,t.y),this.z=He(this.z,e.z,t.z),this.w=He(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=He(this.x,e,t),this.y=He(this.y,e,t),this.z=He(this.z,e,t),this.w=He(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(He(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class oS extends Ir{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:vt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new yt(0,0,e,t),this.scissorTest=!1,this.viewport=new yt(0,0,e,t);const s={width:e,height:t,depth:i.depth},r=new Ut(s);this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:vt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new gu(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ti extends oS{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Im extends Ut{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Rt,this.minFilter=Rt,this.wrapR=Ii,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class lS extends Ut{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Rt,this.minFilter=Rt,this.wrapR=Ii,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Na{constructor(e=new j(1/0,1/0,1/0),t=new j(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Pi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Pi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Pi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Pi):Pi.fromBufferAttribute(r,a),Pi.applyMatrix4(e.matrixWorld),this.expandByPoint(Pi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),qa.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),qa.copy(i.boundingBox)),qa.applyMatrix4(e.matrixWorld),this.union(qa)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Pi),Pi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(zr),Xa.subVectors(this.max,zr),Cs.subVectors(e.a,zr),Rs.subVectors(e.b,zr),Ls.subVectors(e.c,zr),xn.subVectors(Rs,Cs),Sn.subVectors(Ls,Rs),Gn.subVectors(Cs,Ls);let t=[0,-xn.z,xn.y,0,-Sn.z,Sn.y,0,-Gn.z,Gn.y,xn.z,0,-xn.x,Sn.z,0,-Sn.x,Gn.z,0,-Gn.x,-xn.y,xn.x,0,-Sn.y,Sn.x,0,-Gn.y,Gn.x,0];return!Sl(t,Cs,Rs,Ls,Xa)||(t=[1,0,0,0,1,0,0,0,1],!Sl(t,Cs,Rs,Ls,Xa))?!1:(ja.crossVectors(xn,Sn),t=[ja.x,ja.y,ja.z],Sl(t,Cs,Rs,Ls,Xa))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Pi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Pi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Ji[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Ji[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Ji[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Ji[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Ji[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Ji[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Ji[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Ji[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Ji),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Ji=[new j,new j,new j,new j,new j,new j,new j,new j],Pi=new j,qa=new Na,Cs=new j,Rs=new j,Ls=new j,xn=new j,Sn=new j,Gn=new j,zr=new j,Xa=new j,ja=new j,Wn=new j;function Sl(n,e,t,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){Wn.fromArray(n,r);const o=s.x*Math.abs(Wn.x)+s.y*Math.abs(Wn.y)+s.z*Math.abs(Wn.z),l=e.dot(Wn),c=t.dot(Wn),h=i.dot(Wn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const cS=new Na,Vr=new j,yl=new j;class _u{constructor(e=new j,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):cS.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Vr.subVectors(e,this.center);const t=Vr.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(Vr,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(yl.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Vr.copy(e.center).add(yl)),this.expandByPoint(Vr.copy(e.center).sub(yl))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const Qi=new j,wl=new j,Ya=new j,yn=new j,Ml=new j,Ka=new j,bl=new j;class hS{constructor(e=new j,t=new j(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Qi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Qi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Qi.copy(this.origin).addScaledVector(this.direction,t),Qi.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){wl.copy(e).add(t).multiplyScalar(.5),Ya.copy(t).sub(e).normalize(),yn.copy(this.origin).sub(wl);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Ya),o=yn.dot(this.direction),l=-yn.dot(Ya),c=yn.lengthSq(),h=Math.abs(1-a*a);let u,f,d,_;if(h>0)if(u=a*l-o,f=a*o-l,_=r*h,u>=0)if(f>=-_)if(f<=_){const m=1/h;u*=m,f*=m,d=u*(u+a*f+2*o)+f*(a*u+f+2*l)+c}else f=r,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*l)+c;else f=-r,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*l)+c;else f<=-_?(u=Math.max(0,-(-a*r+o)),f=u>0?-r:Math.min(Math.max(-r,-l),r),d=-u*u+f*(f+2*l)+c):f<=_?(u=0,f=Math.min(Math.max(-r,-l),r),d=f*(f+2*l)+c):(u=Math.max(0,-(a*r+o)),f=u>0?r:Math.min(Math.max(-r,-l),r),d=-u*u+f*(f+2*l)+c);else f=a>0?-r:r,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(wl).addScaledVector(Ya,f),d}intersectSphere(e,t){Qi.subVectors(e.center,this.origin);const i=Qi.dot(this.direction),s=Qi.dot(Qi)-i*i,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(i=(e.min.x-f.x)*c,s=(e.max.x-f.x)*c):(i=(e.max.x-f.x)*c,s=(e.min.x-f.x)*c),h>=0?(r=(e.min.y-f.y)*h,a=(e.max.y-f.y)*h):(r=(e.max.y-f.y)*h,a=(e.min.y-f.y)*h),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-f.z)*u,l=(e.max.z-f.z)*u):(o=(e.max.z-f.z)*u,l=(e.min.z-f.z)*u),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,Qi)!==null}intersectTriangle(e,t,i,s,r){Ml.subVectors(t,e),Ka.subVectors(i,e),bl.crossVectors(Ml,Ka);let a=this.direction.dot(bl),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;yn.subVectors(this.origin,e);const l=o*this.direction.dot(Ka.crossVectors(yn,Ka));if(l<0)return null;const c=o*this.direction.dot(Ml.cross(yn));if(c<0||l+c>a)return null;const h=-o*yn.dot(bl);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Tt{constructor(e,t,i,s,r,a,o,l,c,h,u,f,d,_,m,g){Tt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c,h,u,f,d,_,m,g)}set(e,t,i,s,r,a,o,l,c,h,u,f,d,_,m,g){const p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=f,p[3]=d,p[7]=_,p[11]=m,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Tt().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const t=this.elements,i=e.elements,s=1/Is.setFromMatrixColumn(e,0).length(),r=1/Is.setFromMatrixColumn(e,1).length(),a=1/Is.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const f=a*h,d=a*u,_=o*h,m=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=d+_*c,t[5]=f-m*c,t[9]=-o*l,t[2]=m-f*c,t[6]=_+d*c,t[10]=a*l}else if(e.order==="YXZ"){const f=l*h,d=l*u,_=c*h,m=c*u;t[0]=f+m*o,t[4]=_*o-d,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=d*o-_,t[6]=m+f*o,t[10]=a*l}else if(e.order==="ZXY"){const f=l*h,d=l*u,_=c*h,m=c*u;t[0]=f-m*o,t[4]=-a*u,t[8]=_+d*o,t[1]=d+_*o,t[5]=a*h,t[9]=m-f*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const f=a*h,d=a*u,_=o*h,m=o*u;t[0]=l*h,t[4]=_*c-d,t[8]=f*c+m,t[1]=l*u,t[5]=m*c+f,t[9]=d*c-_,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const f=a*l,d=a*c,_=o*l,m=o*c;t[0]=l*h,t[4]=m-f*u,t[8]=_*u+d,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=d*u+_,t[10]=f-m*u}else if(e.order==="XZY"){const f=a*l,d=a*c,_=o*l,m=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=f*u+m,t[5]=a*h,t[9]=d*u-_,t[2]=_*u-d,t[6]=o*h,t[10]=m*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(uS,e,fS)}lookAt(e,t,i){const s=this.elements;return ai.subVectors(e,t),ai.lengthSq()===0&&(ai.z=1),ai.normalize(),wn.crossVectors(i,ai),wn.lengthSq()===0&&(Math.abs(i.z)===1?ai.x+=1e-4:ai.z+=1e-4,ai.normalize(),wn.crossVectors(i,ai)),wn.normalize(),Za.crossVectors(ai,wn),s[0]=wn.x,s[4]=Za.x,s[8]=ai.x,s[1]=wn.y,s[5]=Za.y,s[9]=ai.y,s[2]=wn.z,s[6]=Za.z,s[10]=ai.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],h=i[1],u=i[5],f=i[9],d=i[13],_=i[2],m=i[6],g=i[10],p=i[14],x=i[3],M=i[7],y=i[11],w=i[15],E=s[0],P=s[4],L=s[8],v=s[12],b=s[1],N=s[5],k=s[9],F=s[13],Y=s[2],q=s[6],G=s[10],V=s[14],Q=s[3],he=s[7],ae=s[11],ue=s[15];return r[0]=a*E+o*b+l*Y+c*Q,r[4]=a*P+o*N+l*q+c*he,r[8]=a*L+o*k+l*G+c*ae,r[12]=a*v+o*F+l*V+c*ue,r[1]=h*E+u*b+f*Y+d*Q,r[5]=h*P+u*N+f*q+d*he,r[9]=h*L+u*k+f*G+d*ae,r[13]=h*v+u*F+f*V+d*ue,r[2]=_*E+m*b+g*Y+p*Q,r[6]=_*P+m*N+g*q+p*he,r[10]=_*L+m*k+g*G+p*ae,r[14]=_*v+m*F+g*V+p*ue,r[3]=x*E+M*b+y*Y+w*Q,r[7]=x*P+M*N+y*q+w*he,r[11]=x*L+M*k+y*G+w*ae,r[15]=x*v+M*F+y*V+w*ue,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],f=e[10],d=e[14],_=e[3],m=e[7],g=e[11],p=e[15],x=l*d-c*f,M=o*d-c*u,y=o*f-l*u,w=a*d-c*h,E=a*f-l*h,P=a*u-o*h;return t*(m*x-g*M+p*y)-i*(_*x-g*w+p*E)+s*(_*M-m*w+p*P)-r*(_*y-m*E+g*P)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],f=e[10],d=e[11],_=e[12],m=e[13],g=e[14],p=e[15],x=u*g*c-m*f*c+m*l*d-o*g*d-u*l*p+o*f*p,M=_*f*c-h*g*c-_*l*d+a*g*d+h*l*p-a*f*p,y=h*m*c-_*u*c+_*o*d-a*m*d-h*o*p+a*u*p,w=_*u*l-h*m*l-_*o*f+a*m*f+h*o*g-a*u*g,E=t*x+i*M+s*y+r*w;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const P=1/E;return e[0]=x*P,e[1]=(m*f*r-u*g*r-m*s*d+i*g*d+u*s*p-i*f*p)*P,e[2]=(o*g*r-m*l*r+m*s*c-i*g*c-o*s*p+i*l*p)*P,e[3]=(u*l*r-o*f*r-u*s*c+i*f*c+o*s*d-i*l*d)*P,e[4]=M*P,e[5]=(h*g*r-_*f*r+_*s*d-t*g*d-h*s*p+t*f*p)*P,e[6]=(_*l*r-a*g*r-_*s*c+t*g*c+a*s*p-t*l*p)*P,e[7]=(a*f*r-h*l*r+h*s*c-t*f*c-a*s*d+t*l*d)*P,e[8]=y*P,e[9]=(_*u*r-h*m*r-_*i*d+t*m*d+h*i*p-t*u*p)*P,e[10]=(a*m*r-_*o*r+_*i*c-t*m*c-a*i*p+t*o*p)*P,e[11]=(h*o*r-a*u*r-h*i*c+t*u*c+a*i*d-t*o*d)*P,e[12]=w*P,e[13]=(h*m*s-_*u*s+_*i*f-t*m*f-h*i*g+t*u*g)*P,e[14]=(_*o*s-a*m*s-_*i*l+t*m*l+a*i*g-t*o*g)*P,e[15]=(a*u*s-h*o*s+h*i*l-t*u*l-a*i*f+t*o*f)*P,this}scale(e){const t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),r=1-i,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+i,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+i,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,u=o+o,f=r*c,d=r*h,_=r*u,m=a*h,g=a*u,p=o*u,x=l*c,M=l*h,y=l*u,w=i.x,E=i.y,P=i.z;return s[0]=(1-(m+p))*w,s[1]=(d+y)*w,s[2]=(_-M)*w,s[3]=0,s[4]=(d-y)*E,s[5]=(1-(f+p))*E,s[6]=(g+x)*E,s[7]=0,s[8]=(_+M)*P,s[9]=(g-x)*P,s[10]=(1-(f+m))*P,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;if(e.x=s[12],e.y=s[13],e.z=s[14],this.determinant()===0)return i.set(1,1,1),t.identity(),this;let r=Is.set(s[0],s[1],s[2]).length();const a=Is.set(s[4],s[5],s[6]).length(),o=Is.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),Ci.copy(this);const c=1/r,h=1/a,u=1/o;return Ci.elements[0]*=c,Ci.elements[1]*=c,Ci.elements[2]*=c,Ci.elements[4]*=h,Ci.elements[5]*=h,Ci.elements[6]*=h,Ci.elements[8]*=u,Ci.elements[9]*=u,Ci.elements[10]*=u,t.setFromRotationMatrix(Ci),i.x=r,i.y=a,i.z=o,this}makePerspective(e,t,i,s,r,a,o=$i,l=!1){const c=this.elements,h=2*r/(t-e),u=2*r/(i-s),f=(t+e)/(t-e),d=(i+s)/(i-s);let _,m;if(l)_=r/(a-r),m=a*r/(a-r);else if(o===$i)_=-(a+r)/(a-r),m=-2*a*r/(a-r);else if(o===Uo)_=-a/(a-r),m=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=u,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=_,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,r,a,o=$i,l=!1){const c=this.elements,h=2/(t-e),u=2/(i-s),f=-(t+e)/(t-e),d=-(i+s)/(i-s);let _,m;if(l)_=1/(a-r),m=a/(a-r);else if(o===$i)_=-2/(a-r),m=-(a+r)/(a-r);else if(o===Uo)_=-1/(a-r),m=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=u,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=_,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const Is=new j,Ci=new Tt,uS=new j(0,0,0),fS=new j(1,1,1),wn=new j,Za=new j,ai=new j,Tf=new Tt,Af=new Da;class fn{constructor(e=0,t=0,i=0,s=fn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],u=s[2],f=s[6],d=s[10];switch(t){case"XYZ":this._y=Math.asin(He(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-He(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(He(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-He(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(He(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-He(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:Ue("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Tf.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Tf,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Af.setFromEuler(this),this.setFromQuaternion(Af,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}fn.DEFAULT_ORDER="XYZ";class Dm{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let dS=0;const Pf=new j,Ds=new Da,en=new Tt,Ja=new j,Hr=new j,pS=new j,mS=new Da,Cf=new j(1,0,0),Rf=new j(0,1,0),Lf=new j(0,0,1),If={type:"added"},gS={type:"removed"},Ns={type:"childadded",child:null},El={type:"childremoved",child:null};class di extends Ir{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:dS++}),this.uuid=Dr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=di.DEFAULT_UP.clone();const e=new j,t=new fn,i=new Da,s=new j(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Tt},normalMatrix:{value:new Be}}),this.matrix=new Tt,this.matrixWorld=new Tt,this.matrixAutoUpdate=di.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=di.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Dm,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ds.setFromAxisAngle(e,t),this.quaternion.multiply(Ds),this}rotateOnWorldAxis(e,t){return Ds.setFromAxisAngle(e,t),this.quaternion.premultiply(Ds),this}rotateX(e){return this.rotateOnAxis(Cf,e)}rotateY(e){return this.rotateOnAxis(Rf,e)}rotateZ(e){return this.rotateOnAxis(Lf,e)}translateOnAxis(e,t){return Pf.copy(e).applyQuaternion(this.quaternion),this.position.add(Pf.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Cf,e)}translateY(e){return this.translateOnAxis(Rf,e)}translateZ(e){return this.translateOnAxis(Lf,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(en.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Ja.copy(e):Ja.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),Hr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?en.lookAt(Hr,Ja,this.up):en.lookAt(Ja,Hr,this.up),this.quaternion.setFromRotationMatrix(en),s&&(en.extractRotation(s.matrixWorld),Ds.setFromRotationMatrix(en),this.quaternion.premultiply(Ds.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ke("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(If),Ns.child=e,this.dispatchEvent(Ns),Ns.child=null):Ke("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(gS),El.child=e,this.dispatchEvent(El),El.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),en.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),en.multiply(e.parent.matrixWorld)),e.applyMatrix4(en),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(If),Ns.child=e,this.dispatchEvent(Ns),Ns.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Hr,e,pS),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Hr,mS,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),f=a(e.skeletons),d=a(e.animations),_=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),f.length>0&&(i.skeletons=f),d.length>0&&(i.animations=d),_.length>0&&(i.nodes=_)}return i.object=s,i;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}di.DEFAULT_UP=new j(0,1,0);di.DEFAULT_MATRIX_AUTO_UPDATE=!0;di.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Ri=new j,tn=new j,Tl=new j,nn=new j,Os=new j,Us=new j,Df=new j,Al=new j,Pl=new j,Cl=new j,Rl=new yt,Ll=new yt,Il=new yt;class Li{constructor(e=new j,t=new j,i=new j){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),Ri.subVectors(e,t),s.cross(Ri);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){Ri.subVectors(s,t),tn.subVectors(i,t),Tl.subVectors(e,t);const a=Ri.dot(Ri),o=Ri.dot(tn),l=Ri.dot(Tl),c=tn.dot(tn),h=tn.dot(Tl),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;const f=1/u,d=(c*l-o*h)*f,_=(a*h-o*l)*f;return r.set(1-d-_,_,d)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,nn)===null?!1:nn.x>=0&&nn.y>=0&&nn.x+nn.y<=1}static getInterpolation(e,t,i,s,r,a,o,l){return this.getBarycoord(e,t,i,s,nn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,nn.x),l.addScaledVector(a,nn.y),l.addScaledVector(o,nn.z),l)}static getInterpolatedAttribute(e,t,i,s,r,a){return Rl.setScalar(0),Ll.setScalar(0),Il.setScalar(0),Rl.fromBufferAttribute(e,t),Ll.fromBufferAttribute(e,i),Il.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Rl,r.x),a.addScaledVector(Ll,r.y),a.addScaledVector(Il,r.z),a}static isFrontFacing(e,t,i,s){return Ri.subVectors(i,t),tn.subVectors(e,t),Ri.cross(tn).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Ri.subVectors(this.c,this.b),tn.subVectors(this.a,this.b),Ri.cross(tn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Li.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Li.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return Li.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return Li.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Li.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,r=this.c;let a,o;Os.subVectors(s,i),Us.subVectors(r,i),Al.subVectors(e,i);const l=Os.dot(Al),c=Us.dot(Al);if(l<=0&&c<=0)return t.copy(i);Pl.subVectors(e,s);const h=Os.dot(Pl),u=Us.dot(Pl);if(h>=0&&u<=h)return t.copy(s);const f=l*u-h*c;if(f<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(i).addScaledVector(Os,a);Cl.subVectors(e,r);const d=Os.dot(Cl),_=Us.dot(Cl);if(_>=0&&d<=_)return t.copy(r);const m=d*c-l*_;if(m<=0&&c>=0&&_<=0)return o=c/(c-_),t.copy(i).addScaledVector(Us,o);const g=h*_-d*u;if(g<=0&&u-h>=0&&d-_>=0)return Df.subVectors(r,s),o=(u-h)/(u-h+(d-_)),t.copy(s).addScaledVector(Df,o);const p=1/(g+m+f);return a=m*p,o=f*p,t.copy(i).addScaledVector(Os,a).addScaledVector(Us,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Nm={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Mn={h:0,s:0,l:0},Qa={h:0,s:0,l:0};function Dl(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class Ze{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=yi){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,qe.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=qe.workingColorSpace){return this.r=e,this.g=t,this.b=i,qe.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=qe.workingColorSpace){if(e=mu(e,1),t=He(t,0,1),i=He(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=Dl(a,r,e+1/3),this.g=Dl(a,r,e),this.b=Dl(a,r,e-1/3)}return qe.colorSpaceToWorking(this,s),this}setStyle(e,t=yi){function i(r){r!==void 0&&parseFloat(r)<1&&Ue("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ue("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Ue("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=yi){const i=Nm[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Ue("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=on(e.r),this.g=on(e.g),this.b=on(e.b),this}copyLinearToSRGB(e){return this.r=fr(e.r),this.g=fr(e.g),this.b=fr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=yi){return qe.workingToColorSpace(Bt.copy(this),e),Math.round(He(Bt.r*255,0,255))*65536+Math.round(He(Bt.g*255,0,255))*256+Math.round(He(Bt.b*255,0,255))}getHexString(e=yi){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=qe.workingColorSpace){qe.workingToColorSpace(Bt.copy(this),t);const i=Bt.r,s=Bt.g,r=Bt.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case i:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-i)/u+2;break;case r:l=(i-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=qe.workingColorSpace){return qe.workingToColorSpace(Bt.copy(this),t),e.r=Bt.r,e.g=Bt.g,e.b=Bt.b,e}getStyle(e=yi){qe.workingToColorSpace(Bt.copy(this),e);const t=Bt.r,i=Bt.g,s=Bt.b;return e!==yi?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(Mn),this.setHSL(Mn.h+e,Mn.s+t,Mn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Mn),e.getHSL(Qa);const i=ra(Mn.h,Qa.h,t),s=ra(Mn.s,Qa.s,t),r=ra(Mn.l,Qa.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Bt=new Ze;Ze.NAMES=Nm;let _S=0;class el extends Ir{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:_S++}),this.uuid=Dr(),this.name="",this.type="Material",this.blending=ur,this.side=On,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=wc,this.blendDst=Mc,this.blendEquation=ns,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ze(0,0,0),this.blendAlpha=0,this.depthFunc=_r,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=_f,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=As,this.stencilZFail=As,this.stencilZPass=As,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){Ue(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Ue(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==ur&&(i.blending=this.blending),this.side!==On&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==wc&&(i.blendSrc=this.blendSrc),this.blendDst!==Mc&&(i.blendDst=this.blendDst),this.blendEquation!==ns&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==_r&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==_f&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==As&&(i.stencilFail=this.stencilFail),this.stencilZFail!==As&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==As&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class vu extends el{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ze(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new fn,this.combine=mm,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const bt=new j,eo=new Pe;let vS=0;class Xi{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:vS++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=vf,this.updateRanges=[],this.gpuType=Di,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)eo.fromBufferAttribute(this,t),eo.applyMatrix3(e),this.setXY(t,eo.x,eo.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)bt.fromBufferAttribute(this,t),bt.applyMatrix3(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)bt.fromBufferAttribute(this,t),bt.applyMatrix4(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)bt.fromBufferAttribute(this,t),bt.applyNormalMatrix(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)bt.fromBufferAttribute(this,t),bt.transformDirection(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=ar(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=$t(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ar(t,this.array)),t}setX(e,t){return this.normalized&&(t=$t(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ar(t,this.array)),t}setY(e,t){return this.normalized&&(t=$t(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ar(t,this.array)),t}setZ(e,t){return this.normalized&&(t=$t(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ar(t,this.array)),t}setW(e,t){return this.normalized&&(t=$t(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=$t(t,this.array),i=$t(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=$t(t,this.array),i=$t(i,this.array),s=$t(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=$t(t,this.array),i=$t(i,this.array),s=$t(s,this.array),r=$t(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==vf&&(e.usage=this.usage),e}}class Om extends Xi{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Um extends Xi{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class ln extends Xi{constructor(e,t,i){super(new Float32Array(e),t,i)}}let xS=0;const xi=new Tt,Nl=new di,Fs=new j,oi=new Na,$r=new Na,Dt=new j;class mn extends Ir{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:xS++}),this.uuid=Dr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Lm(e)?Um:Om)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new Be().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return xi.makeRotationFromQuaternion(e),this.applyMatrix4(xi),this}rotateX(e){return xi.makeRotationX(e),this.applyMatrix4(xi),this}rotateY(e){return xi.makeRotationY(e),this.applyMatrix4(xi),this}rotateZ(e){return xi.makeRotationZ(e),this.applyMatrix4(xi),this}translate(e,t,i){return xi.makeTranslation(e,t,i),this.applyMatrix4(xi),this}scale(e,t,i){return xi.makeScale(e,t,i),this.applyMatrix4(xi),this}lookAt(e){return Nl.lookAt(e),Nl.updateMatrix(),this.applyMatrix4(Nl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Fs).negate(),this.translate(Fs.x,Fs.y,Fs.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ln(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Ue("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Na);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ke("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new j(-1/0,-1/0,-1/0),new j(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const r=t[i];oi.setFromBufferAttribute(r),this.morphTargetsRelative?(Dt.addVectors(this.boundingBox.min,oi.min),this.boundingBox.expandByPoint(Dt),Dt.addVectors(this.boundingBox.max,oi.max),this.boundingBox.expandByPoint(Dt)):(this.boundingBox.expandByPoint(oi.min),this.boundingBox.expandByPoint(oi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ke('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new _u);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ke("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new j,1/0);return}if(e){const i=this.boundingSphere.center;if(oi.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];$r.setFromBufferAttribute(o),this.morphTargetsRelative?(Dt.addVectors(oi.min,$r.min),oi.expandByPoint(Dt),Dt.addVectors(oi.max,$r.max),oi.expandByPoint(Dt)):(oi.expandByPoint($r.min),oi.expandByPoint($r.max))}oi.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)Dt.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(Dt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Dt.fromBufferAttribute(o,c),l&&(Fs.fromBufferAttribute(e,c),Dt.add(Fs)),s=Math.max(s,i.distanceToSquared(Dt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ke('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ke("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Xi(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let L=0;L<i.count;L++)o[L]=new j,l[L]=new j;const c=new j,h=new j,u=new j,f=new Pe,d=new Pe,_=new Pe,m=new j,g=new j;function p(L,v,b){c.fromBufferAttribute(i,L),h.fromBufferAttribute(i,v),u.fromBufferAttribute(i,b),f.fromBufferAttribute(r,L),d.fromBufferAttribute(r,v),_.fromBufferAttribute(r,b),h.sub(c),u.sub(c),d.sub(f),_.sub(f);const N=1/(d.x*_.y-_.x*d.y);isFinite(N)&&(m.copy(h).multiplyScalar(_.y).addScaledVector(u,-d.y).multiplyScalar(N),g.copy(u).multiplyScalar(d.x).addScaledVector(h,-_.x).multiplyScalar(N),o[L].add(m),o[v].add(m),o[b].add(m),l[L].add(g),l[v].add(g),l[b].add(g))}let x=this.groups;x.length===0&&(x=[{start:0,count:e.count}]);for(let L=0,v=x.length;L<v;++L){const b=x[L],N=b.start,k=b.count;for(let F=N,Y=N+k;F<Y;F+=3)p(e.getX(F+0),e.getX(F+1),e.getX(F+2))}const M=new j,y=new j,w=new j,E=new j;function P(L){w.fromBufferAttribute(s,L),E.copy(w);const v=o[L];M.copy(v),M.sub(w.multiplyScalar(w.dot(v))).normalize(),y.crossVectors(E,v);const N=y.dot(l[L])<0?-1:1;a.setXYZW(L,M.x,M.y,M.z,N)}for(let L=0,v=x.length;L<v;++L){const b=x[L],N=b.start,k=b.count;for(let F=N,Y=N+k;F<Y;F+=3)P(e.getX(F+0)),P(e.getX(F+1)),P(e.getX(F+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Xi(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let f=0,d=i.count;f<d;f++)i.setXYZ(f,0,0,0);const s=new j,r=new j,a=new j,o=new j,l=new j,c=new j,h=new j,u=new j;if(e)for(let f=0,d=e.count;f<d;f+=3){const _=e.getX(f+0),m=e.getX(f+1),g=e.getX(f+2);s.fromBufferAttribute(t,_),r.fromBufferAttribute(t,m),a.fromBufferAttribute(t,g),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(i,_),l.fromBufferAttribute(i,m),c.fromBufferAttribute(i,g),o.add(h),l.add(h),c.add(h),i.setXYZ(_,o.x,o.y,o.z),i.setXYZ(m,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let f=0,d=t.count;f<d;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),i.setXYZ(f+0,h.x,h.y,h.z),i.setXYZ(f+1,h.x,h.y,h.z),i.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Dt.fromBufferAttribute(e,t),Dt.normalize(),e.setXYZ(t,Dt.x,Dt.y,Dt.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,u=o.normalized,f=new c.constructor(l.length*h);let d=0,_=0;for(let m=0,g=l.length;m<g;m++){o.isInterleavedBufferAttribute?d=l[m]*o.data.stride+o.offset:d=l[m]*h;for(let p=0;p<h;p++)f[_++]=c[d++]}return new Xi(f,h,u)}if(this.index===null)return Ue("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new mn,i=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,i);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){const f=c[h],d=e(f,i);l.push(d)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){const d=c[u];h.push(d.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],u=r[c];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Nf=new Tt,qn=new hS,to=new _u,Of=new j,io=new j,no=new j,so=new j,Ol=new j,ro=new j,Uf=new j,ao=new j;class At extends di{constructor(e=new mn,t=new vu){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){ro.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],u=r[l];h!==0&&(Ol.fromBufferAttribute(u,e),a?ro.addScaledVector(Ol,h):ro.addScaledVector(Ol.sub(t),h))}t.add(ro)}return t}raycast(e,t){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),to.copy(i.boundingSphere),to.applyMatrix4(r),qn.copy(e.ray).recast(e.near),!(to.containsPoint(qn.origin)===!1&&(qn.intersectSphere(to,Of)===null||qn.origin.distanceToSquared(Of)>(e.far-e.near)**2))&&(Nf.copy(r).invert(),qn.copy(e.ray).applyMatrix4(Nf),!(i.boundingBox!==null&&qn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,qn)))}_computeIntersections(e,t,i){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let _=0,m=f.length;_<m;_++){const g=f[_],p=a[g.materialIndex],x=Math.max(g.start,d.start),M=Math.min(o.count,Math.min(g.start+g.count,d.start+d.count));for(let y=x,w=M;y<w;y+=3){const E=o.getX(y),P=o.getX(y+1),L=o.getX(y+2);s=oo(this,p,e,i,c,h,u,E,P,L),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const _=Math.max(0,d.start),m=Math.min(o.count,d.start+d.count);for(let g=_,p=m;g<p;g+=3){const x=o.getX(g),M=o.getX(g+1),y=o.getX(g+2);s=oo(this,a,e,i,c,h,u,x,M,y),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let _=0,m=f.length;_<m;_++){const g=f[_],p=a[g.materialIndex],x=Math.max(g.start,d.start),M=Math.min(l.count,Math.min(g.start+g.count,d.start+d.count));for(let y=x,w=M;y<w;y+=3){const E=y,P=y+1,L=y+2;s=oo(this,p,e,i,c,h,u,E,P,L),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const _=Math.max(0,d.start),m=Math.min(l.count,d.start+d.count);for(let g=_,p=m;g<p;g+=3){const x=g,M=g+1,y=g+2;s=oo(this,a,e,i,c,h,u,x,M,y),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}}function SS(n,e,t,i,s,r,a,o){let l;if(e.side===Jt?l=i.intersectTriangle(a,r,s,!0,o):l=i.intersectTriangle(s,r,a,e.side===On,o),l===null)return null;ao.copy(o),ao.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(ao);return c<t.near||c>t.far?null:{distance:c,point:ao.clone(),object:n}}function oo(n,e,t,i,s,r,a,o,l,c){n.getVertexPosition(o,io),n.getVertexPosition(l,no),n.getVertexPosition(c,so);const h=SS(n,e,t,i,io,no,so,Uf);if(h){const u=new j;Li.getBarycoord(Uf,io,no,so,u),s&&(h.uv=Li.getInterpolatedAttribute(s,o,l,c,u,new Pe)),r&&(h.uv1=Li.getInterpolatedAttribute(r,o,l,c,u,new Pe)),a&&(h.normal=Li.getInterpolatedAttribute(a,o,l,c,u,new j),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new j,materialIndex:0};Li.getNormal(io,no,so,f.normal),h.face=f,h.barycoord=u}return h}class Oa extends mn{constructor(e=1,t=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],u=[];let f=0,d=0;_("z","y","x",-1,-1,i,t,e,a,r,0),_("z","y","x",1,-1,i,t,-e,a,r,1),_("x","z","y",1,1,e,i,t,s,a,2),_("x","z","y",1,-1,e,i,-t,s,a,3),_("x","y","z",1,-1,e,t,i,s,r,4),_("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new ln(c,3)),this.setAttribute("normal",new ln(h,3)),this.setAttribute("uv",new ln(u,2));function _(m,g,p,x,M,y,w,E,P,L,v){const b=y/P,N=w/L,k=y/2,F=w/2,Y=E/2,q=P+1,G=L+1;let V=0,Q=0;const he=new j;for(let ae=0;ae<G;ae++){const ue=ae*N-F;for(let we=0;we<q;we++){const Ee=we*b-k;he[m]=Ee*x,he[g]=ue*M,he[p]=Y,c.push(he.x,he.y,he.z),he[m]=0,he[g]=0,he[p]=E>0?1:-1,h.push(he.x,he.y,he.z),u.push(we/P),u.push(1-ae/L),V+=1}}for(let ae=0;ae<L;ae++)for(let ue=0;ue<P;ue++){const we=f+ue+q*ae,Ee=f+ue+q*(ae+1),Ne=f+(ue+1)+q*(ae+1),Fe=f+(ue+1)+q*ae;l.push(we,Ee,Fe),l.push(Ee,Ne,Fe),Q+=6}o.addGroup(d,Q,v),d+=Q,f+=V}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Oa(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Sr(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(Ue("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function Gt(n){const e={};for(let t=0;t<n.length;t++){const i=Sr(n[t]);for(const s in i)e[s]=i[s]}return e}function yS(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Fm(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:qe.workingColorSpace}const wS={clone:Sr,merge:Gt};var MS=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,bS=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class mi extends el{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=MS,this.fragmentShader=bS,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Sr(e.uniforms),this.uniformsGroups=yS(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class km extends di{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Tt,this.projectionMatrix=new Tt,this.projectionMatrixInverse=new Tt,this.coordinateSystem=$i,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const bn=new j,Ff=new Pe,kf=new Pe;class wi extends km{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Sa*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(sa*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Sa*2*Math.atan(Math.tan(sa*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){bn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(bn.x,bn.y).multiplyScalar(-e/bn.z),bn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(bn.x,bn.y).multiplyScalar(-e/bn.z)}getViewSize(e,t){return this.getViewBounds(e,Ff,kf),t.subVectors(kf,Ff)}setViewOffset(e,t,i,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(sa*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*i/c,s*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const ks=-90,Bs=1;class ES extends di{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new wi(ks,Bs,e,t);s.layers=this.layers,this.add(s);const r=new wi(ks,Bs,e,t);r.layers=this.layers,this.add(r);const a=new wi(ks,Bs,e,t);a.layers=this.layers,this.add(a);const o=new wi(ks,Bs,e,t);o.layers=this.layers,this.add(o);const l=new wi(ks,Bs,e,t);l.layers=this.layers,this.add(l);const c=new wi(ks,Bs,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===$i)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Uo)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const m=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,r),e.setRenderTarget(i,1,s),e.render(t,a),e.setRenderTarget(i,2,s),e.render(t,o),e.setRenderTarget(i,3,s),e.render(t,l),e.setRenderTarget(i,4,s),e.render(t,c),i.texture.generateMipmaps=m,e.setRenderTarget(i,5,s),e.render(t,h),e.setRenderTarget(u,f,d),e.xr.enabled=_,i.texture.needsPMREMUpdate=!0}}class Bm extends Ut{constructor(e=[],t=Ss,i,s,r,a,o,l,c,h){super(e,t,i,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class zm extends Ti{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Bm(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Oa(5,5,5),r=new mi({name:"CubemapFromEquirect",uniforms:Sr(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Jt,blending:Wi});r.uniforms.tEquirect.value=t;const a=new At(s,r),o=t.minFilter;return t.minFilter===as&&(t.minFilter=vt),new ES(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(r)}}class lo extends di{constructor(){super(),this.isGroup=!0,this.type="Group"}}const TS={type:"move"};class Ul{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new lo,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new lo,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new j,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new j),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new lo,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new j,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new j),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const m of e.hand.values()){const g=t.getJointPose(m,i),p=this._getHandJoint(c,m);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,_=.005;c.inputState.pinching&&f>d+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=d-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(TS)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new lo;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class xu extends di{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new fn,this.environmentIntensity=1,this.environmentRotation=new fn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class AS extends Ut{constructor(e=null,t=1,i=1,s,r,a,o,l,c=Rt,h=Rt,u,f){super(null,a,o,l,c,h,s,r,u,f),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Fl=new j,PS=new j,CS=new Be;class Qn{constructor(e=new j(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=Fl.subVectors(i,t).cross(PS.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Fl),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||CS.getNormalMatrix(e),s=this.coplanarPoint(Fl).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Xn=new _u,RS=new Pe(.5,.5),co=new j;class Vm{constructor(e=new Qn,t=new Qn,i=new Qn,s=new Qn,r=new Qn,a=new Qn){this.planes=[e,t,i,s,r,a]}set(e,t,i,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=$i,i=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],u=r[5],f=r[6],d=r[7],_=r[8],m=r[9],g=r[10],p=r[11],x=r[12],M=r[13],y=r[14],w=r[15];if(s[0].setComponents(c-a,d-h,p-_,w-x).normalize(),s[1].setComponents(c+a,d+h,p+_,w+x).normalize(),s[2].setComponents(c+o,d+u,p+m,w+M).normalize(),s[3].setComponents(c-o,d-u,p-m,w-M).normalize(),i)s[4].setComponents(l,f,g,y).normalize(),s[5].setComponents(c-l,d-f,p-g,w-y).normalize();else if(s[4].setComponents(c-l,d-f,p-g,w-y).normalize(),t===$i)s[5].setComponents(c+l,d+f,p+g,w+y).normalize();else if(t===Uo)s[5].setComponents(l,f,g,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Xn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Xn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Xn)}intersectsSprite(e){Xn.center.set(0,0,0);const t=RS.distanceTo(e.center);return Xn.radius=.7071067811865476+t,Xn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Xn)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(co.x=s.normal.x>0?e.max.x:e.min.x,co.y=s.normal.y>0?e.max.y:e.min.y,co.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(co)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Hm extends Ut{constructor(e,t,i,s,r,a,o,l,c){super(e,t,i,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class ya extends Ut{constructor(e,t,i=Yi,s,r,a,o=Rt,l=Rt,c,h=un,u=1){if(h!==un&&h!==os)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:e,height:t,depth:u};super(f,s,r,a,o,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new gu(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class LS extends ya{constructor(e,t=Yi,i=Ss,s,r,a=Rt,o=Rt,l,c=un){const h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,i,s,r,a,o,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class $m extends Ut{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Xt extends mn{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(i),l=Math.floor(s),c=o+1,h=l+1,u=e/o,f=t/l,d=[],_=[],m=[],g=[];for(let p=0;p<h;p++){const x=p*f-a;for(let M=0;M<c;M++){const y=M*u-r;_.push(y,-x,0),m.push(0,0,1),g.push(M/o),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let x=0;x<o;x++){const M=x+c*p,y=x+c*(p+1),w=x+1+c*(p+1),E=x+1+c*p;d.push(M,y,E),d.push(y,w,E)}this.setIndex(d),this.setAttribute("position",new ln(_,3)),this.setAttribute("normal",new ln(m,3)),this.setAttribute("uv",new ln(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Xt(e.width,e.height,e.widthSegments,e.heightSegments)}}class gn extends mi{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class IS extends el{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Cx,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class DS extends el{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const kl={enabled:!1,files:{},add:function(n,e){this.enabled!==!1&&(this.files[n]=e)},get:function(n){if(this.enabled!==!1)return this.files[n]},remove:function(n){delete this.files[n]},clear:function(){this.files={}}};class NS{constructor(e,t,i){const s=this;let r=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this._abortController=null,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){const u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,f=c.length;u<f;u+=2){const d=c[u],_=c[u+1];if(d.global&&(d.lastIndex=0),d.test(h))return _}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const OS=new NS;class Su{constructor(e){this.manager=e!==void 0?e:OS,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const i=this;return new Promise(function(s,r){i.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}Su.DEFAULT_MATERIAL_NAME="__DEFAULT";const zs=new WeakMap;let US=class extends Su{constructor(e){super(e)}load(e,t,i,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=kl.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);else{let u=zs.get(a);u===void 0&&(u=[],zs.set(a,u)),u.push({onLoad:t,onError:s})}return a}const o=va("img");function l(){h(),t&&t(this);const u=zs.get(this)||[];for(let f=0;f<u.length;f++){const d=u[f];d.onLoad&&d.onLoad(this)}zs.delete(this),r.manager.itemEnd(e)}function c(u){h(),s&&s(u),kl.remove(`image:${e}`);const f=zs.get(this)||[];for(let d=0;d<f.length;d++){const _=f[d];_.onError&&_.onError(u)}zs.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),kl.add(`image:${e}`,o),r.manager.itemStart(e),o.src=e,o}};class ws extends Su{constructor(e){super(e)}load(e,t,i,s){const r=new Ut,a=new US(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},i,s),r}}class tl extends km{constructor(e=-1,t=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class FS extends wi{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}function Bf(n,e,t,i){const s=kS(i);switch(t){case Pm:return n*e;case Rm:return n*e/s.components*s.byteLength;case hu:return n*e/s.components*s.byteLength;case xr:return n*e*2/s.components*s.byteLength;case uu:return n*e*2/s.components*s.byteLength;case Cm:return n*e*3/s.components*s.byteLength;case hi:return n*e*4/s.components*s.byteLength;case fu:return n*e*4/s.components*s.byteLength;case Mo:case bo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Eo:case To:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Uc:case kc:return Math.max(n,16)*Math.max(e,8)/4;case Oc:case Fc:return Math.max(n,8)*Math.max(e,8)/2;case Bc:case zc:case Hc:case $c:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Vc:case Gc:case Wc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case qc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Xc:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case jc:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Yc:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Kc:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Zc:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Jc:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Qc:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case eh:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case th:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case ih:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case nh:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case sh:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case rh:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case ah:case oh:case lh:return Math.ceil(n/4)*Math.ceil(e/4)*16;case ch:case hh:return Math.ceil(n/4)*Math.ceil(e/4)*8;case uh:case fh:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function kS(n){switch(n){case Mi:case bm:return{byteLength:1,components:1};case ga:case Em:case hn:return{byteLength:2,components:1};case lu:case cu:return{byteLength:2,components:4};case Yi:case ou:case Di:return{byteLength:4,components:1};case Tm:case Am:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:au}}));typeof window<"u"&&(window.__THREE__?Ue("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=au);function Gm(){let n=null,e=!1,t=null,i=null;function s(r,a){t(r,a),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function BS(n){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,u=c.byteLength,f=n.createBuffer();n.bindBuffer(l,f),n.bufferData(l,c,h),o.onUploadCallback();let d;if(c instanceof Float32Array)d=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=n.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=n.HALF_FLOAT:d=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=n.SHORT;else if(c instanceof Uint32Array)d=n.UNSIGNED_INT;else if(c instanceof Int32Array)d=n.INT;else if(c instanceof Int8Array)d=n.BYTE;else if(c instanceof Uint8Array)d=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,l,c){const h=l.array,u=l.updateRanges;if(n.bindBuffer(c,o),u.length===0)n.bufferSubData(c,0,h);else{u.sort((d,_)=>d.start-_.start);let f=0;for(let d=1;d<u.length;d++){const _=u[f],m=u[d];m.start<=_.start+_.count+1?_.count=Math.max(_.count,m.start+m.count-_.start):(++f,u[f]=m)}u.length=f+1;for(let d=0,_=u.length;d<_;d++){const m=u[d];n.bufferSubData(c,m.start*h.BYTES_PER_ELEMENT,h,m.start,m.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var zS=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,VS=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,HS=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,$S=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,GS=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,WS=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,qS=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,XS=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,jS=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,YS=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,KS=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,ZS=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,JS=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,QS=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,ey=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,ty=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,iy=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,ny=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,sy=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ry=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,ay=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,oy=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,ly=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,cy=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,hy=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,uy=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,fy=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,dy=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,py=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,my=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,gy="gl_FragColor = linearToOutputTexel( gl_FragColor );",_y=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,vy=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,xy=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Sy=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,yy=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,wy=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,My=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,by=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Ey=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Ty=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Ay=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Py=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Cy=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Ry=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Ly=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Iy=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Dy=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ny=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Oy=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Uy=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Fy=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,ky=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return v;
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( vec3( 1.0 ) - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,By=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,zy=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Vy=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Hy=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,$y=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Gy=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Wy=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,qy=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Xy=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,jy=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Yy=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Ky=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Zy=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Jy=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Qy=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ew=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,tw=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,iw=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,nw=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,sw=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,rw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,aw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ow=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,lw=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,cw=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,hw=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,uw=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,fw=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,dw=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,pw=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,mw=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,gw=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,_w=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,vw=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,xw=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Sw=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,yw=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * 6.28318530718;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * 6.28318530718;
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 0, 5, phi ).x + bitangent * vogelDiskSample( 0, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 1, 5, phi ).x + bitangent * vogelDiskSample( 1, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 2, 5, phi ).x + bitangent * vogelDiskSample( 2, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 3, 5, phi ).x + bitangent * vogelDiskSample( 3, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 4, 5, phi ).x + bitangent * vogelDiskSample( 4, 5, phi ).y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadow = step( depth, dp );
			#else
				shadow = step( dp, depth );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,ww=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Mw=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,bw=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Ew=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Tw=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Aw=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Pw=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Cw=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Rw=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Lw=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Iw=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Dw=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Nw=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Ow=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Uw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Fw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,kw=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Bw=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,zw=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Vw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Hw=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$w=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Gw=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ww=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,qw=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Xw=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,jw=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Yw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Kw=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zw=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Jw=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Qw=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,eM=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,tM=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,iM=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,nM=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,sM=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,rM=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,aM=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,oM=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,lM=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,cM=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,hM=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,uM=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,fM=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,dM=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,pM=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,mM=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,gM=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,_M=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,vM=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ze={alphahash_fragment:zS,alphahash_pars_fragment:VS,alphamap_fragment:HS,alphamap_pars_fragment:$S,alphatest_fragment:GS,alphatest_pars_fragment:WS,aomap_fragment:qS,aomap_pars_fragment:XS,batching_pars_vertex:jS,batching_vertex:YS,begin_vertex:KS,beginnormal_vertex:ZS,bsdfs:JS,iridescence_fragment:QS,bumpmap_pars_fragment:ey,clipping_planes_fragment:ty,clipping_planes_pars_fragment:iy,clipping_planes_pars_vertex:ny,clipping_planes_vertex:sy,color_fragment:ry,color_pars_fragment:ay,color_pars_vertex:oy,color_vertex:ly,common:cy,cube_uv_reflection_fragment:hy,defaultnormal_vertex:uy,displacementmap_pars_vertex:fy,displacementmap_vertex:dy,emissivemap_fragment:py,emissivemap_pars_fragment:my,colorspace_fragment:gy,colorspace_pars_fragment:_y,envmap_fragment:vy,envmap_common_pars_fragment:xy,envmap_pars_fragment:Sy,envmap_pars_vertex:yy,envmap_physical_pars_fragment:Iy,envmap_vertex:wy,fog_vertex:My,fog_pars_vertex:by,fog_fragment:Ey,fog_pars_fragment:Ty,gradientmap_pars_fragment:Ay,lightmap_pars_fragment:Py,lights_lambert_fragment:Cy,lights_lambert_pars_fragment:Ry,lights_pars_begin:Ly,lights_toon_fragment:Dy,lights_toon_pars_fragment:Ny,lights_phong_fragment:Oy,lights_phong_pars_fragment:Uy,lights_physical_fragment:Fy,lights_physical_pars_fragment:ky,lights_fragment_begin:By,lights_fragment_maps:zy,lights_fragment_end:Vy,logdepthbuf_fragment:Hy,logdepthbuf_pars_fragment:$y,logdepthbuf_pars_vertex:Gy,logdepthbuf_vertex:Wy,map_fragment:qy,map_pars_fragment:Xy,map_particle_fragment:jy,map_particle_pars_fragment:Yy,metalnessmap_fragment:Ky,metalnessmap_pars_fragment:Zy,morphinstance_vertex:Jy,morphcolor_vertex:Qy,morphnormal_vertex:ew,morphtarget_pars_vertex:tw,morphtarget_vertex:iw,normal_fragment_begin:nw,normal_fragment_maps:sw,normal_pars_fragment:rw,normal_pars_vertex:aw,normal_vertex:ow,normalmap_pars_fragment:lw,clearcoat_normal_fragment_begin:cw,clearcoat_normal_fragment_maps:hw,clearcoat_pars_fragment:uw,iridescence_pars_fragment:fw,opaque_fragment:dw,packing:pw,premultiplied_alpha_fragment:mw,project_vertex:gw,dithering_fragment:_w,dithering_pars_fragment:vw,roughnessmap_fragment:xw,roughnessmap_pars_fragment:Sw,shadowmap_pars_fragment:yw,shadowmap_pars_vertex:ww,shadowmap_vertex:Mw,shadowmask_pars_fragment:bw,skinbase_vertex:Ew,skinning_pars_vertex:Tw,skinning_vertex:Aw,skinnormal_vertex:Pw,specularmap_fragment:Cw,specularmap_pars_fragment:Rw,tonemapping_fragment:Lw,tonemapping_pars_fragment:Iw,transmission_fragment:Dw,transmission_pars_fragment:Nw,uv_pars_fragment:Ow,uv_pars_vertex:Uw,uv_vertex:Fw,worldpos_vertex:kw,background_vert:Bw,background_frag:zw,backgroundCube_vert:Vw,backgroundCube_frag:Hw,cube_vert:$w,cube_frag:Gw,depth_vert:Ww,depth_frag:qw,distance_vert:Xw,distance_frag:jw,equirect_vert:Yw,equirect_frag:Kw,linedashed_vert:Zw,linedashed_frag:Jw,meshbasic_vert:Qw,meshbasic_frag:eM,meshlambert_vert:tM,meshlambert_frag:iM,meshmatcap_vert:nM,meshmatcap_frag:sM,meshnormal_vert:rM,meshnormal_frag:aM,meshphong_vert:oM,meshphong_frag:lM,meshphysical_vert:cM,meshphysical_frag:hM,meshtoon_vert:uM,meshtoon_frag:fM,points_vert:dM,points_frag:pM,shadow_vert:mM,shadow_frag:gM,sprite_vert:_M,sprite_frag:vM},ve={common:{diffuse:{value:new Ze(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Be},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Be}},envmap:{envMap:{value:null},envMapRotation:{value:new Be},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Be}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Be}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Be},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Be},normalScale:{value:new Pe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Be},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Be}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Be}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Be}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ze(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ze(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0},uvTransform:{value:new Be}},sprite:{diffuse:{value:new Ze(16777215)},opacity:{value:1},center:{value:new Pe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Be},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0}}},Vi={basic:{uniforms:Gt([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.fog]),vertexShader:ze.meshbasic_vert,fragmentShader:ze.meshbasic_frag},lambert:{uniforms:Gt([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new Ze(0)}}]),vertexShader:ze.meshlambert_vert,fragmentShader:ze.meshlambert_frag},phong:{uniforms:Gt([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new Ze(0)},specular:{value:new Ze(1118481)},shininess:{value:30}}]),vertexShader:ze.meshphong_vert,fragmentShader:ze.meshphong_frag},standard:{uniforms:Gt([ve.common,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.roughnessmap,ve.metalnessmap,ve.fog,ve.lights,{emissive:{value:new Ze(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ze.meshphysical_vert,fragmentShader:ze.meshphysical_frag},toon:{uniforms:Gt([ve.common,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.gradientmap,ve.fog,ve.lights,{emissive:{value:new Ze(0)}}]),vertexShader:ze.meshtoon_vert,fragmentShader:ze.meshtoon_frag},matcap:{uniforms:Gt([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,{matcap:{value:null}}]),vertexShader:ze.meshmatcap_vert,fragmentShader:ze.meshmatcap_frag},points:{uniforms:Gt([ve.points,ve.fog]),vertexShader:ze.points_vert,fragmentShader:ze.points_frag},dashed:{uniforms:Gt([ve.common,ve.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ze.linedashed_vert,fragmentShader:ze.linedashed_frag},depth:{uniforms:Gt([ve.common,ve.displacementmap]),vertexShader:ze.depth_vert,fragmentShader:ze.depth_frag},normal:{uniforms:Gt([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,{opacity:{value:1}}]),vertexShader:ze.meshnormal_vert,fragmentShader:ze.meshnormal_frag},sprite:{uniforms:Gt([ve.sprite,ve.fog]),vertexShader:ze.sprite_vert,fragmentShader:ze.sprite_frag},background:{uniforms:{uvTransform:{value:new Be},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ze.background_vert,fragmentShader:ze.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Be}},vertexShader:ze.backgroundCube_vert,fragmentShader:ze.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ze.cube_vert,fragmentShader:ze.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ze.equirect_vert,fragmentShader:ze.equirect_frag},distance:{uniforms:Gt([ve.common,ve.displacementmap,{referencePosition:{value:new j},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ze.distance_vert,fragmentShader:ze.distance_frag},shadow:{uniforms:Gt([ve.lights,ve.fog,{color:{value:new Ze(0)},opacity:{value:1}}]),vertexShader:ze.shadow_vert,fragmentShader:ze.shadow_frag}};Vi.physical={uniforms:Gt([Vi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Be},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Be},clearcoatNormalScale:{value:new Pe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Be},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Be},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Be},sheen:{value:0},sheenColor:{value:new Ze(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Be},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Be},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Be},transmissionSamplerSize:{value:new Pe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Be},attenuationDistance:{value:0},attenuationColor:{value:new Ze(0)},specularColor:{value:new Ze(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Be},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Be},anisotropyVector:{value:new Pe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Be}}]),vertexShader:ze.meshphysical_vert,fragmentShader:ze.meshphysical_frag};const ho={r:0,b:0,g:0},jn=new fn,xM=new Tt;function SM(n,e,t,i,s,r,a){const o=new Ze(0);let l=r===!0?0:1,c,h,u=null,f=0,d=null;function _(M){let y=M.isScene===!0?M.background:null;return y&&y.isTexture&&(y=(M.backgroundBlurriness>0?t:e).get(y)),y}function m(M){let y=!1;const w=_(M);w===null?p(o,l):w&&w.isColor&&(p(w,1),y=!0);const E=n.xr.getEnvironmentBlendMode();E==="additive"?i.buffers.color.setClear(0,0,0,1,a):E==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||y)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(M,y){const w=_(y);w&&(w.isCubeTexture||w.mapping===Qo)?(h===void 0&&(h=new At(new Oa(1,1,1),new mi({name:"BackgroundCubeMaterial",uniforms:Sr(Vi.backgroundCube.uniforms),vertexShader:Vi.backgroundCube.vertexShader,fragmentShader:Vi.backgroundCube.fragmentShader,side:Jt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(E,P,L){this.matrixWorld.copyPosition(L.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),jn.copy(y.backgroundRotation),jn.x*=-1,jn.y*=-1,jn.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(jn.y*=-1,jn.z*=-1),h.material.uniforms.envMap.value=w,h.material.uniforms.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(xM.makeRotationFromEuler(jn)),h.material.toneMapped=qe.getTransfer(w.colorSpace)!==it,(u!==w||f!==w.version||d!==n.toneMapping)&&(h.material.needsUpdate=!0,u=w,f=w.version,d=n.toneMapping),h.layers.enableAll(),M.unshift(h,h.geometry,h.material,0,0,null)):w&&w.isTexture&&(c===void 0&&(c=new At(new Xt(2,2),new mi({name:"BackgroundMaterial",uniforms:Sr(Vi.background.uniforms),vertexShader:Vi.background.vertexShader,fragmentShader:Vi.background.fragmentShader,side:On,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=w,c.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,c.material.toneMapped=qe.getTransfer(w.colorSpace)!==it,w.matrixAutoUpdate===!0&&w.updateMatrix(),c.material.uniforms.uvTransform.value.copy(w.matrix),(u!==w||f!==w.version||d!==n.toneMapping)&&(c.material.needsUpdate=!0,u=w,f=w.version,d=n.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null))}function p(M,y){M.getRGB(ho,Fm(n)),i.buffers.color.setClear(ho.r,ho.g,ho.b,y,a)}function x(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(M,y=1){o.set(M),l=y,p(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(M){l=M,p(o,l)},render:m,addToRenderList:g,dispose:x}}function yM(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=f(null);let r=s,a=!1;function o(b,N,k,F,Y){let q=!1;const G=u(F,k,N);r!==G&&(r=G,c(r.object)),q=d(b,F,k,Y),q&&_(b,F,k,Y),Y!==null&&e.update(Y,n.ELEMENT_ARRAY_BUFFER),(q||a)&&(a=!1,y(b,N,k,F),Y!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(Y).buffer))}function l(){return n.createVertexArray()}function c(b){return n.bindVertexArray(b)}function h(b){return n.deleteVertexArray(b)}function u(b,N,k){const F=k.wireframe===!0;let Y=i[b.id];Y===void 0&&(Y={},i[b.id]=Y);let q=Y[N.id];q===void 0&&(q={},Y[N.id]=q);let G=q[F];return G===void 0&&(G=f(l()),q[F]=G),G}function f(b){const N=[],k=[],F=[];for(let Y=0;Y<t;Y++)N[Y]=0,k[Y]=0,F[Y]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:k,attributeDivisors:F,object:b,attributes:{},index:null}}function d(b,N,k,F){const Y=r.attributes,q=N.attributes;let G=0;const V=k.getAttributes();for(const Q in V)if(V[Q].location>=0){const ae=Y[Q];let ue=q[Q];if(ue===void 0&&(Q==="instanceMatrix"&&b.instanceMatrix&&(ue=b.instanceMatrix),Q==="instanceColor"&&b.instanceColor&&(ue=b.instanceColor)),ae===void 0||ae.attribute!==ue||ue&&ae.data!==ue.data)return!0;G++}return r.attributesNum!==G||r.index!==F}function _(b,N,k,F){const Y={},q=N.attributes;let G=0;const V=k.getAttributes();for(const Q in V)if(V[Q].location>=0){let ae=q[Q];ae===void 0&&(Q==="instanceMatrix"&&b.instanceMatrix&&(ae=b.instanceMatrix),Q==="instanceColor"&&b.instanceColor&&(ae=b.instanceColor));const ue={};ue.attribute=ae,ae&&ae.data&&(ue.data=ae.data),Y[Q]=ue,G++}r.attributes=Y,r.attributesNum=G,r.index=F}function m(){const b=r.newAttributes;for(let N=0,k=b.length;N<k;N++)b[N]=0}function g(b){p(b,0)}function p(b,N){const k=r.newAttributes,F=r.enabledAttributes,Y=r.attributeDivisors;k[b]=1,F[b]===0&&(n.enableVertexAttribArray(b),F[b]=1),Y[b]!==N&&(n.vertexAttribDivisor(b,N),Y[b]=N)}function x(){const b=r.newAttributes,N=r.enabledAttributes;for(let k=0,F=N.length;k<F;k++)N[k]!==b[k]&&(n.disableVertexAttribArray(k),N[k]=0)}function M(b,N,k,F,Y,q,G){G===!0?n.vertexAttribIPointer(b,N,k,Y,q):n.vertexAttribPointer(b,N,k,F,Y,q)}function y(b,N,k,F){m();const Y=F.attributes,q=k.getAttributes(),G=N.defaultAttributeValues;for(const V in q){const Q=q[V];if(Q.location>=0){let he=Y[V];if(he===void 0&&(V==="instanceMatrix"&&b.instanceMatrix&&(he=b.instanceMatrix),V==="instanceColor"&&b.instanceColor&&(he=b.instanceColor)),he!==void 0){const ae=he.normalized,ue=he.itemSize,we=e.get(he);if(we===void 0)continue;const Ee=we.buffer,Ne=we.type,Fe=we.bytesPerElement,ne=Ne===n.INT||Ne===n.UNSIGNED_INT||he.gpuType===ou;if(he.isInterleavedBufferAttribute){const le=he.data,Se=le.stride,Ie=he.offset;if(le.isInstancedInterleavedBuffer){for(let ge=0;ge<Q.locationSize;ge++)p(Q.location+ge,le.meshPerAttribute);b.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=le.meshPerAttribute*le.count)}else for(let ge=0;ge<Q.locationSize;ge++)g(Q.location+ge);n.bindBuffer(n.ARRAY_BUFFER,Ee);for(let ge=0;ge<Q.locationSize;ge++)M(Q.location+ge,ue/Q.locationSize,Ne,ae,Se*Fe,(Ie+ue/Q.locationSize*ge)*Fe,ne)}else{if(he.isInstancedBufferAttribute){for(let le=0;le<Q.locationSize;le++)p(Q.location+le,he.meshPerAttribute);b.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=he.meshPerAttribute*he.count)}else for(let le=0;le<Q.locationSize;le++)g(Q.location+le);n.bindBuffer(n.ARRAY_BUFFER,Ee);for(let le=0;le<Q.locationSize;le++)M(Q.location+le,ue/Q.locationSize,Ne,ae,ue*Fe,ue/Q.locationSize*le*Fe,ne)}}else if(G!==void 0){const ae=G[V];if(ae!==void 0)switch(ae.length){case 2:n.vertexAttrib2fv(Q.location,ae);break;case 3:n.vertexAttrib3fv(Q.location,ae);break;case 4:n.vertexAttrib4fv(Q.location,ae);break;default:n.vertexAttrib1fv(Q.location,ae)}}}}x()}function w(){L();for(const b in i){const N=i[b];for(const k in N){const F=N[k];for(const Y in F)h(F[Y].object),delete F[Y];delete N[k]}delete i[b]}}function E(b){if(i[b.id]===void 0)return;const N=i[b.id];for(const k in N){const F=N[k];for(const Y in F)h(F[Y].object),delete F[Y];delete N[k]}delete i[b.id]}function P(b){for(const N in i){const k=i[N];if(k[b.id]===void 0)continue;const F=k[b.id];for(const Y in F)h(F[Y].object),delete F[Y];delete k[b.id]}}function L(){v(),a=!0,r!==s&&(r=s,c(r.object))}function v(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:L,resetDefaultState:v,dispose:w,releaseStatesOfGeometry:E,releaseStatesOfProgram:P,initAttributes:m,enableAttribute:g,disableUnusedAttributes:x}}function wM(n,e,t){let i;function s(c){i=c}function r(c,h){n.drawArrays(i,c,h),t.update(h,i,1)}function a(c,h,u){u!==0&&(n.drawArraysInstanced(i,c,h,u),t.update(h,i,u))}function o(c,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,u);let d=0;for(let _=0;_<u;_++)d+=h[_];t.update(d,i,1)}function l(c,h,u,f){if(u===0)return;const d=e.get("WEBGL_multi_draw");if(d===null)for(let _=0;_<c.length;_++)a(c[_],h[_],f[_]);else{d.multiDrawArraysInstancedWEBGL(i,c,0,h,0,f,0,u);let _=0;for(let m=0;m<u;m++)_+=h[m]*f[m];t.update(_,i,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function MM(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const P=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(P){return!(P!==hi&&i.convert(P)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(P){const L=P===hn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(P!==Mi&&i.convert(P)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==Di&&!L)}function l(P){if(P==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(Ue("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),d=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),x=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),M=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),w=n.getParameter(n.MAX_SAMPLES),E=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:d,maxVertexTextures:_,maxTextureSize:m,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:x,maxVaryings:M,maxFragmentUniforms:y,maxSamples:w,samples:E}}function bM(n){const e=this;let t=null,i=0,s=!1,r=!1;const a=new Qn,o=new Be,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const d=u.length!==0||f||i!==0||s;return s=f,i=u.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){t=h(u,f,0)},this.setState=function(u,f,d){const _=u.clippingPlanes,m=u.clipIntersection,g=u.clipShadows,p=n.get(u);if(!s||_===null||_.length===0||r&&!g)r?h(null):c();else{const x=r?0:i,M=x*4;let y=p.clippingState||null;l.value=y,y=h(_,f,M,d);for(let w=0;w!==M;++w)y[w]=t[w];p.clippingState=y,this.numIntersection=m?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(u,f,d,_){const m=u!==null?u.length:0;let g=null;if(m!==0){if(g=l.value,_!==!0||g===null){const p=d+m*4,x=f.matrixWorldInverse;o.getNormalMatrix(x),(g===null||g.length<p)&&(g=new Float32Array(p));for(let M=0,y=d;M!==m;++M,y+=4)a.copy(u[M]).applyMatrix4(x,o),a.normal.toArray(g,y),g[y+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=m,e.numIntersection=0,g}}function EM(n){let e=new WeakMap;function t(a,o){return o===Lc?a.mapping=Ss:o===Ic&&(a.mapping=vr),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===Lc||o===Ic)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new zm(l.height);return c.fromEquirectangularTexture(n,a),e.set(a,c),a.addEventListener("dispose",s),t(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:i,dispose:r}}const An=4,zf=[.125,.215,.35,.446,.526,.582],ss=20,TM=256,Gr=new tl,Vf=new Ze;let Bl=null,zl=0,Vl=0,Hl=!1;const AM=new j;class Hf{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,s=100,r={}){const{size:a=256,position:o=AM}=r;Bl=this._renderer.getRenderTarget(),zl=this._renderer.getActiveCubeFace(),Vl=this._renderer.getActiveMipmapLevel(),Hl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Wf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Gf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Bl,zl,Vl),this._renderer.xr.enabled=Hl,e.scissorTest=!1,Vs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ss||e.mapping===vr?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Bl=this._renderer.getRenderTarget(),zl=this._renderer.getActiveCubeFace(),Vl=this._renderer.getActiveMipmapLevel(),Hl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:vt,minFilter:vt,generateMipmaps:!1,type:hn,format:hi,colorSpace:ys,depthBuffer:!1},s=$f(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=$f(e,t,i);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=PM(r)),this._blurMaterial=RM(r,e,t),this._ggxMaterial=CM(r,e,t)}return s}_compileMaterial(e){const t=new At(new mn,e);this._renderer.compile(t,Gr)}_sceneToCubeUV(e,t,i,s,r){const l=new wi(90,1,t,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,d=u.toneMapping;u.getClearColor(Vf),u.toneMapping=qi,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new At(new Oa,new vu({name:"PMREM.Background",side:Jt,depthWrite:!1,depthTest:!1})));const m=this._backgroundBox,g=m.material;let p=!1;const x=e.background;x?x.isColor&&(g.color.copy(x),e.background=null,p=!0):(g.color.copy(Vf),p=!0);for(let M=0;M<6;M++){const y=M%3;y===0?(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[M],r.y,r.z)):y===1?(l.up.set(0,0,c[M]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[M],r.z)):(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[M]));const w=this._cubeSize;Vs(s,y*w,M>2?w:0,w,w),u.setRenderTarget(s),p&&u.render(m,l),u.render(e,l)}u.toneMapping=d,u.autoClear=f,e.background=x}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===Ss||e.mapping===vr;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Wf()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Gf());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;Vs(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(a,Gr)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=i}_applyGGXFilter(e,t,i){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;const l=a.uniforms,c=i/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-h*h),f=0+c*1.25,d=u*f,{_lodMax:_}=this,m=this._sizeLods[i],g=3*m*(i>_-An?i-_+An:0),p=4*(this._cubeSize-m);l.envMap.value=e.texture,l.roughness.value=d,l.mipInt.value=_-t,Vs(r,g,p,3*m,2*m),s.setRenderTarget(r),s.render(o,Gr),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=_-i,Vs(e,g,p,3*m,2*m),s.setRenderTarget(e),s.render(o,Gr)}_blur(e,t,i,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,s,"latitudinal",r),this._halfBlur(a,e,i,i,s,"longitudinal",r)}_halfBlur(e,t,i,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Ke("blur direction must be either latitudinal or longitudinal!");const h=3,u=this._lodMeshes[s];u.material=c;const f=c.uniforms,d=this._sizeLods[i]-1,_=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*ss-1),m=r/_,g=isFinite(r)?1+Math.floor(h*m):ss;g>ss&&Ue(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${ss}`);const p=[];let x=0;for(let P=0;P<ss;++P){const L=P/m,v=Math.exp(-L*L/2);p.push(v),P===0?x+=v:P<g&&(x+=2*v)}for(let P=0;P<p.length;P++)p[P]=p[P]/x;f.envMap.value=e.texture,f.samples.value=g,f.weights.value=p,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:M}=this;f.dTheta.value=_,f.mipInt.value=M-i;const y=this._sizeLods[s],w=3*y*(s>M-An?s-M+An:0),E=4*(this._cubeSize-y);Vs(t,w,E,3*y,2*y),l.setRenderTarget(t),l.render(u,Gr)}}function PM(n){const e=[],t=[],i=[];let s=n;const r=n-An+1+zf.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let l=1/o;a>n-An?l=zf[a-n+An-1]:a===0&&(l=0),t.push(l);const c=1/(o-2),h=-c,u=1+c,f=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,_=6,m=3,g=2,p=1,x=new Float32Array(m*_*d),M=new Float32Array(g*_*d),y=new Float32Array(p*_*d);for(let E=0;E<d;E++){const P=E%3*2/3-1,L=E>2?0:-1,v=[P,L,0,P+2/3,L,0,P+2/3,L+1,0,P,L,0,P+2/3,L+1,0,P,L+1,0];x.set(v,m*_*E),M.set(f,g*_*E);const b=[E,E,E,E,E,E];y.set(b,p*_*E)}const w=new mn;w.setAttribute("position",new Xi(x,m)),w.setAttribute("uv",new Xi(M,g)),w.setAttribute("faceIndex",new Xi(y,p)),i.push(new At(w,null)),s>An&&s--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function $f(n,e,t){const i=new Ti(n,e,t);return i.texture.mapping=Qo,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Vs(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function CM(n,e,t){return new mi({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:TM,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:il(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 3.2: Transform view direction to hemisphere configuration
				vec3 Vh = normalize(vec3(alpha * V.x, alpha * V.y, V.z));

				// Section 4.1: Orthonormal basis
				float lensq = Vh.x * Vh.x + Vh.y * Vh.y;
				vec3 T1 = lensq > 0.0 ? vec3(-Vh.y, Vh.x, 0.0) / sqrt(lensq) : vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(Vh, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + Vh.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * Vh;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Wi,depthTest:!1,depthWrite:!1})}function RM(n,e,t){const i=new Float32Array(ss),s=new j(0,1,0);return new mi({name:"SphericalGaussianBlur",defines:{n:ss,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:il(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Wi,depthTest:!1,depthWrite:!1})}function Gf(){return new mi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:il(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Wi,depthTest:!1,depthWrite:!1})}function Wf(){return new mi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:il(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Wi,depthTest:!1,depthWrite:!1})}function il(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function LM(n){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===Lc||l===Ic,h=l===Ss||l===vr;if(c||h){let u=e.get(o);const f=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return t===null&&(t=new Hf(n)),u=c?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{const d=o.image;return c&&d&&d.height>0||h&&d&&s(d)?(t===null&&(t=new Hf(n)),u=c?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:a}}function IM(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&xa("WebGLRenderer: "+i+" extension not supported."),s}}}function DM(n,e,t,i){const s={},r=new WeakMap;function a(u){const f=u.target;f.index!==null&&e.remove(f.index);for(const _ in f.attributes)e.remove(f.attributes[_]);f.removeEventListener("dispose",a),delete s[f.id];const d=r.get(f);d&&(e.remove(d),r.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(u,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,t.memory.geometries++),f}function l(u){const f=u.attributes;for(const d in f)e.update(f[d],n.ARRAY_BUFFER)}function c(u){const f=[],d=u.index,_=u.attributes.position;let m=0;if(d!==null){const x=d.array;m=d.version;for(let M=0,y=x.length;M<y;M+=3){const w=x[M+0],E=x[M+1],P=x[M+2];f.push(w,E,E,P,P,w)}}else if(_!==void 0){const x=_.array;m=_.version;for(let M=0,y=x.length/3-1;M<y;M+=3){const w=M+0,E=M+1,P=M+2;f.push(w,E,E,P,P,w)}}else return;const g=new(Lm(f)?Um:Om)(f,1);g.version=m;const p=r.get(u);p&&e.remove(p),r.set(u,g)}function h(u){const f=r.get(u);if(f){const d=u.index;d!==null&&f.version<d.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function NM(n,e,t){let i;function s(f){i=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,d){n.drawElements(i,d,r,f*a),t.update(d,i,1)}function c(f,d,_){_!==0&&(n.drawElementsInstanced(i,d,r,f*a,_),t.update(d,i,_))}function h(f,d,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,r,f,0,_);let g=0;for(let p=0;p<_;p++)g+=d[p];t.update(g,i,1)}function u(f,d,_,m){if(_===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<f.length;p++)c(f[p]/a,d[p],m[p]);else{g.multiDrawElementsInstancedWEBGL(i,d,0,r,f,0,m,0,_);let p=0;for(let x=0;x<_;x++)p+=d[x]*m[x];t.update(p,i,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function OM(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(r/3);break;case n.LINES:t.lines+=o*(r/2);break;case n.LINE_STRIP:t.lines+=o*(r-1);break;case n.LINE_LOOP:t.lines+=o*r;break;case n.POINTS:t.points+=o*r;break;default:Ke("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function UM(n,e,t){const i=new WeakMap,s=new yt;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let f=i.get(o);if(f===void 0||f.count!==u){let b=function(){L.dispose(),i.delete(o),o.removeEventListener("dispose",b)};var d=b;f!==void 0&&f.texture.dispose();const _=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],x=o.morphAttributes.normal||[],M=o.morphAttributes.color||[];let y=0;_===!0&&(y=1),m===!0&&(y=2),g===!0&&(y=3);let w=o.attributes.position.count*y,E=1;w>e.maxTextureSize&&(E=Math.ceil(w/e.maxTextureSize),w=e.maxTextureSize);const P=new Float32Array(w*E*4*u),L=new Im(P,w,E,u);L.type=Di,L.needsUpdate=!0;const v=y*4;for(let N=0;N<u;N++){const k=p[N],F=x[N],Y=M[N],q=w*E*4*N;for(let G=0;G<k.count;G++){const V=G*v;_===!0&&(s.fromBufferAttribute(k,G),P[q+V+0]=s.x,P[q+V+1]=s.y,P[q+V+2]=s.z,P[q+V+3]=0),m===!0&&(s.fromBufferAttribute(F,G),P[q+V+4]=s.x,P[q+V+5]=s.y,P[q+V+6]=s.z,P[q+V+7]=0),g===!0&&(s.fromBufferAttribute(Y,G),P[q+V+8]=s.x,P[q+V+9]=s.y,P[q+V+10]=s.z,P[q+V+11]=Y.itemSize===4?s.w:1)}}f={count:u,texture:L,size:new Pe(w,E)},i.set(o,f),o.addEventListener("dispose",b)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let _=0;for(let g=0;g<c.length;g++)_+=c[g];const m=o.morphTargetsRelative?1:1-_;l.getUniforms().setValue(n,"morphTargetBaseInfluence",m),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:r}}function FM(n,e,t,i){let s=new WeakMap;function r(l){const c=i.render.frame,h=l.geometry,u=e.get(l,h);if(s.get(u)!==c&&(e.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;s.get(f)!==c&&(f.update(),s.set(f,c))}return u}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}const kM={[gm]:"LINEAR_TONE_MAPPING",[_m]:"REINHARD_TONE_MAPPING",[vm]:"CINEON_TONE_MAPPING",[xm]:"ACES_FILMIC_TONE_MAPPING",[ym]:"AGX_TONE_MAPPING",[wm]:"NEUTRAL_TONE_MAPPING",[Sm]:"CUSTOM_TONE_MAPPING"};function BM(n,e,t,i,s){const r=new Ti(e,t,{type:n,depthBuffer:i,stencilBuffer:s}),a=new Ti(e,t,{type:hn,depthBuffer:!1,stencilBuffer:!1}),o=new mn;o.setAttribute("position",new ln([-1,3,0,-1,-1,0,3,-1,0],3)),o.setAttribute("uv",new ln([0,2,0,0,2,0],2));const l=new gn({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),c=new At(o,l),h=new tl(-1,1,1,-1,0,1);let u=null,f=null,d=!1,_,m=null,g=[],p=!1;this.setSize=function(x,M){r.setSize(x,M),a.setSize(x,M);for(let y=0;y<g.length;y++){const w=g[y];w.setSize&&w.setSize(x,M)}},this.setEffects=function(x){g=x,p=g.length>0&&g[0].isRenderPass===!0;const M=r.width,y=r.height;for(let w=0;w<g.length;w++){const E=g[w];E.setSize&&E.setSize(M,y)}},this.begin=function(x,M){if(d||x.toneMapping===qi&&g.length===0)return!1;if(m=M,M!==null){const y=M.width,w=M.height;(r.width!==y||r.height!==w)&&this.setSize(y,w)}return p===!1&&x.setRenderTarget(r),_=x.toneMapping,x.toneMapping=qi,!0},this.hasRenderPass=function(){return p},this.end=function(x,M){x.toneMapping=_,d=!0;let y=r,w=a;for(let E=0;E<g.length;E++){const P=g[E];if(P.enabled!==!1&&(P.render(x,w,y,M),P.needsSwap!==!1)){const L=y;y=w,w=L}}if(u!==x.outputColorSpace||f!==x.toneMapping){u=x.outputColorSpace,f=x.toneMapping,l.defines={},qe.getTransfer(u)===it&&(l.defines.SRGB_TRANSFER="");const E=kM[f];E&&(l.defines[E]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=y.texture,x.setRenderTarget(m),x.render(c,h),m=null,d=!1},this.isCompositing=function(){return d},this.dispose=function(){r.dispose(),a.dispose(),o.dispose(),l.dispose()}}const Wm=new Ut,dh=new ya(1,1),qm=new Im,Xm=new lS,jm=new Bm,qf=[],Xf=[],jf=new Float32Array(16),Yf=new Float32Array(9),Kf=new Float32Array(4);function Nr(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let r=qf[s];if(r===void 0&&(r=new Float32Array(s),qf[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(r,o)}return r}function Lt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function It(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function nl(n,e){let t=Xf[e];t===void 0&&(t=new Int32Array(e),Xf[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function zM(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function VM(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;n.uniform2fv(this.addr,e),It(t,e)}}function HM(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Lt(t,e))return;n.uniform3fv(this.addr,e),It(t,e)}}function $M(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;n.uniform4fv(this.addr,e),It(t,e)}}function GM(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Lt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),It(t,e)}else{if(Lt(t,i))return;Kf.set(i),n.uniformMatrix2fv(this.addr,!1,Kf),It(t,i)}}function WM(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Lt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),It(t,e)}else{if(Lt(t,i))return;Yf.set(i),n.uniformMatrix3fv(this.addr,!1,Yf),It(t,i)}}function qM(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Lt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),It(t,e)}else{if(Lt(t,i))return;jf.set(i),n.uniformMatrix4fv(this.addr,!1,jf),It(t,i)}}function XM(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function jM(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;n.uniform2iv(this.addr,e),It(t,e)}}function YM(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Lt(t,e))return;n.uniform3iv(this.addr,e),It(t,e)}}function KM(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;n.uniform4iv(this.addr,e),It(t,e)}}function ZM(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function JM(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;n.uniform2uiv(this.addr,e),It(t,e)}}function QM(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Lt(t,e))return;n.uniform3uiv(this.addr,e),It(t,e)}}function eb(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;n.uniform4uiv(this.addr,e),It(t,e)}}function tb(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(dh.compareFunction=t.isReversedDepthBuffer()?pu:du,r=dh):r=Wm,t.setTexture2D(e||r,s)}function ib(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||Xm,s)}function nb(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||jm,s)}function sb(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||qm,s)}function rb(n){switch(n){case 5126:return zM;case 35664:return VM;case 35665:return HM;case 35666:return $M;case 35674:return GM;case 35675:return WM;case 35676:return qM;case 5124:case 35670:return XM;case 35667:case 35671:return jM;case 35668:case 35672:return YM;case 35669:case 35673:return KM;case 5125:return ZM;case 36294:return JM;case 36295:return QM;case 36296:return eb;case 35678:case 36198:case 36298:case 36306:case 35682:return tb;case 35679:case 36299:case 36307:return ib;case 35680:case 36300:case 36308:case 36293:return nb;case 36289:case 36303:case 36311:case 36292:return sb}}function ab(n,e){n.uniform1fv(this.addr,e)}function ob(n,e){const t=Nr(e,this.size,2);n.uniform2fv(this.addr,t)}function lb(n,e){const t=Nr(e,this.size,3);n.uniform3fv(this.addr,t)}function cb(n,e){const t=Nr(e,this.size,4);n.uniform4fv(this.addr,t)}function hb(n,e){const t=Nr(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function ub(n,e){const t=Nr(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function fb(n,e){const t=Nr(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function db(n,e){n.uniform1iv(this.addr,e)}function pb(n,e){n.uniform2iv(this.addr,e)}function mb(n,e){n.uniform3iv(this.addr,e)}function gb(n,e){n.uniform4iv(this.addr,e)}function _b(n,e){n.uniform1uiv(this.addr,e)}function vb(n,e){n.uniform2uiv(this.addr,e)}function xb(n,e){n.uniform3uiv(this.addr,e)}function Sb(n,e){n.uniform4uiv(this.addr,e)}function yb(n,e,t){const i=this.cache,s=e.length,r=nl(t,s);Lt(i,r)||(n.uniform1iv(this.addr,r),It(i,r));let a;this.type===n.SAMPLER_2D_SHADOW?a=dh:a=Wm;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function wb(n,e,t){const i=this.cache,s=e.length,r=nl(t,s);Lt(i,r)||(n.uniform1iv(this.addr,r),It(i,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Xm,r[a])}function Mb(n,e,t){const i=this.cache,s=e.length,r=nl(t,s);Lt(i,r)||(n.uniform1iv(this.addr,r),It(i,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||jm,r[a])}function bb(n,e,t){const i=this.cache,s=e.length,r=nl(t,s);Lt(i,r)||(n.uniform1iv(this.addr,r),It(i,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||qm,r[a])}function Eb(n){switch(n){case 5126:return ab;case 35664:return ob;case 35665:return lb;case 35666:return cb;case 35674:return hb;case 35675:return ub;case 35676:return fb;case 5124:case 35670:return db;case 35667:case 35671:return pb;case 35668:case 35672:return mb;case 35669:case 35673:return gb;case 5125:return _b;case 36294:return vb;case 36295:return xb;case 36296:return Sb;case 35678:case 36198:case 36298:case 36306:case 35682:return yb;case 35679:case 36299:case 36307:return wb;case 35680:case 36300:case 36308:case 36293:return Mb;case 36289:case 36303:case 36311:case 36292:return bb}}class Tb{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=rb(t.type)}}class Ab{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Eb(t.type)}}class Pb{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],i)}}}const $l=/(\w+)(\])?(\[|\.)?/g;function Zf(n,e){n.seq.push(e),n.map[e.id]=e}function Cb(n,e,t){const i=n.name,s=i.length;for($l.lastIndex=0;;){const r=$l.exec(i),a=$l.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Zf(t,c===void 0?new Tb(o,n,e):new Ab(o,n,e));break}else{let u=t.map[o];u===void 0&&(u=new Pb(o),Zf(t,u)),t=u}}}class Ao{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);Cb(o,l,this)}const s=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,i,s){const r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&i.push(a)}return i}}function Jf(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const Rb=37297;let Lb=0;function Ib(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const Qf=new Be;function Db(n){qe._getMatrix(Qf,qe.workingColorSpace,n);const e=`mat3( ${Qf.elements.map(t=>t.toFixed(4))} )`;switch(qe.getTransfer(n)){case Oo:return[e,"LinearTransferOETF"];case it:return[e,"sRGBTransferOETF"];default:return Ue("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function ed(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+Ib(n.getShaderSource(e),o)}else return r}function Nb(n,e){const t=Db(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const Ob={[gm]:"Linear",[_m]:"Reinhard",[vm]:"Cineon",[xm]:"ACESFilmic",[ym]:"AgX",[wm]:"Neutral",[Sm]:"Custom"};function Ub(n,e){const t=Ob[e];return t===void 0?(Ue("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const uo=new j;function Fb(){qe.getLuminanceCoefficients(uo);const n=uo.x.toFixed(4),e=uo.y.toFixed(4),t=uo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function kb(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Jr).join(`
`)}function Bb(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function zb(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(e,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function Jr(n){return n!==""}function td(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function id(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Vb=/^[ \t]*#include +<([\w\d./]+)>/gm;function ph(n){return n.replace(Vb,$b)}const Hb=new Map;function $b(n,e){let t=ze[e];if(t===void 0){const i=Hb.get(e);if(i!==void 0)t=ze[i],Ue('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return ph(t)}const Gb=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function nd(n){return n.replace(Gb,Wb)}function Wb(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function sd(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const qb={[wo]:"SHADOWMAP_TYPE_PCF",[Zr]:"SHADOWMAP_TYPE_VSM"};function Xb(n){return qb[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const jb={[Ss]:"ENVMAP_TYPE_CUBE",[vr]:"ENVMAP_TYPE_CUBE",[Qo]:"ENVMAP_TYPE_CUBE_UV"};function Yb(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":jb[n.envMapMode]||"ENVMAP_TYPE_CUBE"}const Kb={[vr]:"ENVMAP_MODE_REFRACTION"};function Zb(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":Kb[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Jb={[mm]:"ENVMAP_BLENDING_MULTIPLY",[Tx]:"ENVMAP_BLENDING_MIX",[Ax]:"ENVMAP_BLENDING_ADD"};function Qb(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":Jb[n.combine]||"ENVMAP_BLENDING_NONE"}function eE(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function tE(n,e,t,i){const s=n.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Xb(t),c=Yb(t),h=Zb(t),u=Qb(t),f=eE(t),d=kb(t),_=Bb(r),m=s.createProgram();let g,p,x=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Jr).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Jr).join(`
`),p.length>0&&(p+=`
`)):(g=[sd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Jr).join(`
`),p=[sd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==qi?"#define TONE_MAPPING":"",t.toneMapping!==qi?ze.tonemapping_pars_fragment:"",t.toneMapping!==qi?Ub("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",ze.colorspace_pars_fragment,Nb("linearToOutputTexel",t.outputColorSpace),Fb(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Jr).join(`
`)),a=ph(a),a=td(a,t),a=id(a,t),o=ph(o),o=td(o,t),o=id(o,t),a=nd(a),o=nd(o),t.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,g=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",t.glslVersion===xf?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===xf?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const M=x+g+a,y=x+p+o,w=Jf(s,s.VERTEX_SHADER,M),E=Jf(s,s.FRAGMENT_SHADER,y);s.attachShader(m,w),s.attachShader(m,E),t.index0AttributeName!==void 0?s.bindAttribLocation(m,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(m,0,"position"),s.linkProgram(m);function P(N){if(n.debug.checkShaderErrors){const k=s.getProgramInfoLog(m)||"",F=s.getShaderInfoLog(w)||"",Y=s.getShaderInfoLog(E)||"",q=k.trim(),G=F.trim(),V=Y.trim();let Q=!0,he=!0;if(s.getProgramParameter(m,s.LINK_STATUS)===!1)if(Q=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,m,w,E);else{const ae=ed(s,w,"vertex"),ue=ed(s,E,"fragment");Ke("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(m,s.VALIDATE_STATUS)+`

Material Name: `+N.name+`
Material Type: `+N.type+`

Program Info Log: `+q+`
`+ae+`
`+ue)}else q!==""?Ue("WebGLProgram: Program Info Log:",q):(G===""||V==="")&&(he=!1);he&&(N.diagnostics={runnable:Q,programLog:q,vertexShader:{log:G,prefix:g},fragmentShader:{log:V,prefix:p}})}s.deleteShader(w),s.deleteShader(E),L=new Ao(s,m),v=zb(s,m)}let L;this.getUniforms=function(){return L===void 0&&P(this),L};let v;this.getAttributes=function(){return v===void 0&&P(this),v};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=s.getProgramParameter(m,Rb)),b},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(m),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Lb++,this.cacheKey=e,this.usedTimes=1,this.program=m,this.vertexShader=w,this.fragmentShader=E,this}let iE=0;class nE{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new sE(e),t.set(e,i)),i}}class sE{constructor(e){this.id=iE++,this.code=e,this.usedTimes=0}}function rE(n,e,t,i,s,r,a){const o=new Dm,l=new nE,c=new Set,h=[],u=new Map,f=s.logarithmicDepthBuffer;let d=s.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(v){return c.add(v),v===0?"uv":`uv${v}`}function g(v,b,N,k,F){const Y=k.fog,q=F.geometry,G=v.isMeshStandardMaterial?k.environment:null,V=(v.isMeshStandardMaterial?t:e).get(v.envMap||G),Q=V&&V.mapping===Qo?V.image.height:null,he=_[v.type];v.precision!==null&&(d=s.getMaxPrecision(v.precision),d!==v.precision&&Ue("WebGLProgram.getParameters:",v.precision,"not supported, using",d,"instead."));const ae=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,ue=ae!==void 0?ae.length:0;let we=0;q.morphAttributes.position!==void 0&&(we=1),q.morphAttributes.normal!==void 0&&(we=2),q.morphAttributes.color!==void 0&&(we=3);let Ee,Ne,Fe,ne;if(he){const et=Vi[he];Ee=et.vertexShader,Ne=et.fragmentShader}else Ee=v.vertexShader,Ne=v.fragmentShader,l.update(v),Fe=l.getVertexShaderID(v),ne=l.getFragmentShaderID(v);const le=n.getRenderTarget(),Se=n.state.buffers.depth.getReversed(),Ie=F.isInstancedMesh===!0,ge=F.isBatchedMesh===!0,$e=!!v.map,Mt=!!v.matcap,Ge=!!V,Xe=!!v.aoMap,Je=!!v.lightMap,ke=!!v.bumpMap,pt=!!v.normalMap,U=!!v.displacementMap,mt=!!v.emissiveMap,je=!!v.metalnessMap,Qe=!!v.roughnessMap,Te=v.anisotropy>0,R=v.clearcoat>0,S=v.dispersion>0,z=v.iridescence>0,te=v.sheen>0,oe=v.transmission>0,ee=Te&&!!v.anisotropyMap,Ae=R&&!!v.clearcoatMap,pe=R&&!!v.clearcoatNormalMap,Me=R&&!!v.clearcoatRoughnessMap,A=z&&!!v.iridescenceMap,C=z&&!!v.iridescenceThicknessMap,B=te&&!!v.sheenColorMap,H=te&&!!v.sheenRoughnessMap,Z=!!v.specularMap,J=!!v.specularColorMap,de=!!v.specularIntensityMap,O=oe&&!!v.transmissionMap,ce=oe&&!!v.thicknessMap,se=!!v.gradientMap,fe=!!v.alphaMap,re=v.alphaTest>0,ie=!!v.alphaHash,me=!!v.extensions;let Oe=qi;v.toneMapped&&(le===null||le.isXRRenderTarget===!0)&&(Oe=n.toneMapping);const ot={shaderID:he,shaderType:v.type,shaderName:v.name,vertexShader:Ee,fragmentShader:Ne,defines:v.defines,customVertexShaderID:Fe,customFragmentShaderID:ne,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:d,batching:ge,batchingColor:ge&&F._colorsTexture!==null,instancing:Ie,instancingColor:Ie&&F.instanceColor!==null,instancingMorph:Ie&&F.morphTexture!==null,outputColorSpace:le===null?n.outputColorSpace:le.isXRRenderTarget===!0?le.texture.colorSpace:ys,alphaToCoverage:!!v.alphaToCoverage,map:$e,matcap:Mt,envMap:Ge,envMapMode:Ge&&V.mapping,envMapCubeUVHeight:Q,aoMap:Xe,lightMap:Je,bumpMap:ke,normalMap:pt,displacementMap:U,emissiveMap:mt,normalMapObjectSpace:pt&&v.normalMapType===Lx,normalMapTangentSpace:pt&&v.normalMapType===Rx,metalnessMap:je,roughnessMap:Qe,anisotropy:Te,anisotropyMap:ee,clearcoat:R,clearcoatMap:Ae,clearcoatNormalMap:pe,clearcoatRoughnessMap:Me,dispersion:S,iridescence:z,iridescenceMap:A,iridescenceThicknessMap:C,sheen:te,sheenColorMap:B,sheenRoughnessMap:H,specularMap:Z,specularColorMap:J,specularIntensityMap:de,transmission:oe,transmissionMap:O,thicknessMap:ce,gradientMap:se,opaque:v.transparent===!1&&v.blending===ur&&v.alphaToCoverage===!1,alphaMap:fe,alphaTest:re,alphaHash:ie,combine:v.combine,mapUv:$e&&m(v.map.channel),aoMapUv:Xe&&m(v.aoMap.channel),lightMapUv:Je&&m(v.lightMap.channel),bumpMapUv:ke&&m(v.bumpMap.channel),normalMapUv:pt&&m(v.normalMap.channel),displacementMapUv:U&&m(v.displacementMap.channel),emissiveMapUv:mt&&m(v.emissiveMap.channel),metalnessMapUv:je&&m(v.metalnessMap.channel),roughnessMapUv:Qe&&m(v.roughnessMap.channel),anisotropyMapUv:ee&&m(v.anisotropyMap.channel),clearcoatMapUv:Ae&&m(v.clearcoatMap.channel),clearcoatNormalMapUv:pe&&m(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Me&&m(v.clearcoatRoughnessMap.channel),iridescenceMapUv:A&&m(v.iridescenceMap.channel),iridescenceThicknessMapUv:C&&m(v.iridescenceThicknessMap.channel),sheenColorMapUv:B&&m(v.sheenColorMap.channel),sheenRoughnessMapUv:H&&m(v.sheenRoughnessMap.channel),specularMapUv:Z&&m(v.specularMap.channel),specularColorMapUv:J&&m(v.specularColorMap.channel),specularIntensityMapUv:de&&m(v.specularIntensityMap.channel),transmissionMapUv:O&&m(v.transmissionMap.channel),thicknessMapUv:ce&&m(v.thicknessMap.channel),alphaMapUv:fe&&m(v.alphaMap.channel),vertexTangents:!!q.attributes.tangent&&(pt||Te),vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!q.attributes.uv&&($e||fe),fog:!!Y,useFog:v.fog===!0,fogExp2:!!Y&&Y.isFogExp2,flatShading:v.flatShading===!0&&v.wireframe===!1,sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:Se,skinning:F.isSkinnedMesh===!0,morphTargets:q.morphAttributes.position!==void 0,morphNormals:q.morphAttributes.normal!==void 0,morphColors:q.morphAttributes.color!==void 0,morphTargetsCount:ue,morphTextureStride:we,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:v.dithering,shadowMapEnabled:n.shadowMap.enabled&&N.length>0,shadowMapType:n.shadowMap.type,toneMapping:Oe,decodeVideoTexture:$e&&v.map.isVideoTexture===!0&&qe.getTransfer(v.map.colorSpace)===it,decodeVideoTextureEmissive:mt&&v.emissiveMap.isVideoTexture===!0&&qe.getTransfer(v.emissiveMap.colorSpace)===it,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===Nt,flipSided:v.side===Jt,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:me&&v.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(me&&v.extensions.multiDraw===!0||ge)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return ot.vertexUv1s=c.has(1),ot.vertexUv2s=c.has(2),ot.vertexUv3s=c.has(3),c.clear(),ot}function p(v){const b=[];if(v.shaderID?b.push(v.shaderID):(b.push(v.customVertexShaderID),b.push(v.customFragmentShaderID)),v.defines!==void 0)for(const N in v.defines)b.push(N),b.push(v.defines[N]);return v.isRawShaderMaterial===!1&&(x(b,v),M(b,v),b.push(n.outputColorSpace)),b.push(v.customProgramCacheKey),b.join()}function x(v,b){v.push(b.precision),v.push(b.outputColorSpace),v.push(b.envMapMode),v.push(b.envMapCubeUVHeight),v.push(b.mapUv),v.push(b.alphaMapUv),v.push(b.lightMapUv),v.push(b.aoMapUv),v.push(b.bumpMapUv),v.push(b.normalMapUv),v.push(b.displacementMapUv),v.push(b.emissiveMapUv),v.push(b.metalnessMapUv),v.push(b.roughnessMapUv),v.push(b.anisotropyMapUv),v.push(b.clearcoatMapUv),v.push(b.clearcoatNormalMapUv),v.push(b.clearcoatRoughnessMapUv),v.push(b.iridescenceMapUv),v.push(b.iridescenceThicknessMapUv),v.push(b.sheenColorMapUv),v.push(b.sheenRoughnessMapUv),v.push(b.specularMapUv),v.push(b.specularColorMapUv),v.push(b.specularIntensityMapUv),v.push(b.transmissionMapUv),v.push(b.thicknessMapUv),v.push(b.combine),v.push(b.fogExp2),v.push(b.sizeAttenuation),v.push(b.morphTargetsCount),v.push(b.morphAttributeCount),v.push(b.numDirLights),v.push(b.numPointLights),v.push(b.numSpotLights),v.push(b.numSpotLightMaps),v.push(b.numHemiLights),v.push(b.numRectAreaLights),v.push(b.numDirLightShadows),v.push(b.numPointLightShadows),v.push(b.numSpotLightShadows),v.push(b.numSpotLightShadowsWithMaps),v.push(b.numLightProbes),v.push(b.shadowMapType),v.push(b.toneMapping),v.push(b.numClippingPlanes),v.push(b.numClipIntersection),v.push(b.depthPacking)}function M(v,b){o.disableAll(),b.instancing&&o.enable(0),b.instancingColor&&o.enable(1),b.instancingMorph&&o.enable(2),b.matcap&&o.enable(3),b.envMap&&o.enable(4),b.normalMapObjectSpace&&o.enable(5),b.normalMapTangentSpace&&o.enable(6),b.clearcoat&&o.enable(7),b.iridescence&&o.enable(8),b.alphaTest&&o.enable(9),b.vertexColors&&o.enable(10),b.vertexAlphas&&o.enable(11),b.vertexUv1s&&o.enable(12),b.vertexUv2s&&o.enable(13),b.vertexUv3s&&o.enable(14),b.vertexTangents&&o.enable(15),b.anisotropy&&o.enable(16),b.alphaHash&&o.enable(17),b.batching&&o.enable(18),b.dispersion&&o.enable(19),b.batchingColor&&o.enable(20),b.gradientMap&&o.enable(21),v.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.reversedDepthBuffer&&o.enable(4),b.skinning&&o.enable(5),b.morphTargets&&o.enable(6),b.morphNormals&&o.enable(7),b.morphColors&&o.enable(8),b.premultipliedAlpha&&o.enable(9),b.shadowMapEnabled&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),b.decodeVideoTextureEmissive&&o.enable(20),b.alphaToCoverage&&o.enable(21),v.push(o.mask)}function y(v){const b=_[v.type];let N;if(b){const k=Vi[b];N=wS.clone(k.uniforms)}else N=v.uniforms;return N}function w(v,b){let N=u.get(b);return N!==void 0?++N.usedTimes:(N=new tE(n,b,v,r),h.push(N),u.set(b,N)),N}function E(v){if(--v.usedTimes===0){const b=h.indexOf(v);h[b]=h[h.length-1],h.pop(),u.delete(v.cacheKey),v.destroy()}}function P(v){l.remove(v)}function L(){l.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:y,acquireProgram:w,releaseProgram:E,releaseShaderCache:P,programs:h,dispose:L}}function aE(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,l){n.get(a)[o]=l}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function oE(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function rd(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function ad(){const n=[];let e=0;const t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function a(u,f,d,_,m,g){let p=n[e];return p===void 0?(p={id:u.id,object:u,geometry:f,material:d,groupOrder:_,renderOrder:u.renderOrder,z:m,group:g},n[e]=p):(p.id=u.id,p.object=u,p.geometry=f,p.material=d,p.groupOrder=_,p.renderOrder=u.renderOrder,p.z=m,p.group=g),e++,p}function o(u,f,d,_,m,g){const p=a(u,f,d,_,m,g);d.transmission>0?i.push(p):d.transparent===!0?s.push(p):t.push(p)}function l(u,f,d,_,m,g){const p=a(u,f,d,_,m,g);d.transmission>0?i.unshift(p):d.transparent===!0?s.unshift(p):t.unshift(p)}function c(u,f){t.length>1&&t.sort(u||oE),i.length>1&&i.sort(f||rd),s.length>1&&s.sort(f||rd)}function h(){for(let u=e,f=n.length;u<f;u++){const d=n[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:o,unshift:l,finish:h,sort:c}}function lE(){let n=new WeakMap;function e(i,s){const r=n.get(i);let a;return r===void 0?(a=new ad,n.set(i,[a])):s>=r.length?(a=new ad,r.push(a)):a=r[s],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function cE(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new j,color:new Ze};break;case"SpotLight":t={position:new j,direction:new j,color:new Ze,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new j,color:new Ze,distance:0,decay:0};break;case"HemisphereLight":t={direction:new j,skyColor:new Ze,groundColor:new Ze};break;case"RectAreaLight":t={color:new Ze,position:new j,halfWidth:new j,halfHeight:new j};break}return n[e.id]=t,t}}}function hE(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Pe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Pe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Pe,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let uE=0;function fE(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function dE(n){const e=new cE,t=hE(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new j);const s=new j,r=new Tt,a=new Tt;function o(c){let h=0,u=0,f=0;for(let v=0;v<9;v++)i.probe[v].set(0,0,0);let d=0,_=0,m=0,g=0,p=0,x=0,M=0,y=0,w=0,E=0,P=0;c.sort(fE);for(let v=0,b=c.length;v<b;v++){const N=c[v],k=N.color,F=N.intensity,Y=N.distance;let q=null;if(N.shadow&&N.shadow.map&&(N.shadow.map.texture.format===xr?q=N.shadow.map.texture:q=N.shadow.map.depthTexture||N.shadow.map.texture),N.isAmbientLight)h+=k.r*F,u+=k.g*F,f+=k.b*F;else if(N.isLightProbe){for(let G=0;G<9;G++)i.probe[G].addScaledVector(N.sh.coefficients[G],F);P++}else if(N.isDirectionalLight){const G=e.get(N);if(G.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){const V=N.shadow,Q=t.get(N);Q.shadowIntensity=V.intensity,Q.shadowBias=V.bias,Q.shadowNormalBias=V.normalBias,Q.shadowRadius=V.radius,Q.shadowMapSize=V.mapSize,i.directionalShadow[d]=Q,i.directionalShadowMap[d]=q,i.directionalShadowMatrix[d]=N.shadow.matrix,x++}i.directional[d]=G,d++}else if(N.isSpotLight){const G=e.get(N);G.position.setFromMatrixPosition(N.matrixWorld),G.color.copy(k).multiplyScalar(F),G.distance=Y,G.coneCos=Math.cos(N.angle),G.penumbraCos=Math.cos(N.angle*(1-N.penumbra)),G.decay=N.decay,i.spot[m]=G;const V=N.shadow;if(N.map&&(i.spotLightMap[w]=N.map,w++,V.updateMatrices(N),N.castShadow&&E++),i.spotLightMatrix[m]=V.matrix,N.castShadow){const Q=t.get(N);Q.shadowIntensity=V.intensity,Q.shadowBias=V.bias,Q.shadowNormalBias=V.normalBias,Q.shadowRadius=V.radius,Q.shadowMapSize=V.mapSize,i.spotShadow[m]=Q,i.spotShadowMap[m]=q,y++}m++}else if(N.isRectAreaLight){const G=e.get(N);G.color.copy(k).multiplyScalar(F),G.halfWidth.set(N.width*.5,0,0),G.halfHeight.set(0,N.height*.5,0),i.rectArea[g]=G,g++}else if(N.isPointLight){const G=e.get(N);if(G.color.copy(N.color).multiplyScalar(N.intensity),G.distance=N.distance,G.decay=N.decay,N.castShadow){const V=N.shadow,Q=t.get(N);Q.shadowIntensity=V.intensity,Q.shadowBias=V.bias,Q.shadowNormalBias=V.normalBias,Q.shadowRadius=V.radius,Q.shadowMapSize=V.mapSize,Q.shadowCameraNear=V.camera.near,Q.shadowCameraFar=V.camera.far,i.pointShadow[_]=Q,i.pointShadowMap[_]=q,i.pointShadowMatrix[_]=N.shadow.matrix,M++}i.point[_]=G,_++}else if(N.isHemisphereLight){const G=e.get(N);G.skyColor.copy(N.color).multiplyScalar(F),G.groundColor.copy(N.groundColor).multiplyScalar(F),i.hemi[p]=G,p++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ve.LTC_FLOAT_1,i.rectAreaLTC2=ve.LTC_FLOAT_2):(i.rectAreaLTC1=ve.LTC_HALF_1,i.rectAreaLTC2=ve.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=f;const L=i.hash;(L.directionalLength!==d||L.pointLength!==_||L.spotLength!==m||L.rectAreaLength!==g||L.hemiLength!==p||L.numDirectionalShadows!==x||L.numPointShadows!==M||L.numSpotShadows!==y||L.numSpotMaps!==w||L.numLightProbes!==P)&&(i.directional.length=d,i.spot.length=m,i.rectArea.length=g,i.point.length=_,i.hemi.length=p,i.directionalShadow.length=x,i.directionalShadowMap.length=x,i.pointShadow.length=M,i.pointShadowMap.length=M,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=x,i.pointShadowMatrix.length=M,i.spotLightMatrix.length=y+w-E,i.spotLightMap.length=w,i.numSpotLightShadowsWithMaps=E,i.numLightProbes=P,L.directionalLength=d,L.pointLength=_,L.spotLength=m,L.rectAreaLength=g,L.hemiLength=p,L.numDirectionalShadows=x,L.numPointShadows=M,L.numSpotShadows=y,L.numSpotMaps=w,L.numLightProbes=P,i.version=uE++)}function l(c,h){let u=0,f=0,d=0,_=0,m=0;const g=h.matrixWorldInverse;for(let p=0,x=c.length;p<x;p++){const M=c[p];if(M.isDirectionalLight){const y=i.directional[u];y.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(g),u++}else if(M.isSpotLight){const y=i.spot[d];y.position.setFromMatrixPosition(M.matrixWorld),y.position.applyMatrix4(g),y.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(g),d++}else if(M.isRectAreaLight){const y=i.rectArea[_];y.position.setFromMatrixPosition(M.matrixWorld),y.position.applyMatrix4(g),a.identity(),r.copy(M.matrixWorld),r.premultiply(g),a.extractRotation(r),y.halfWidth.set(M.width*.5,0,0),y.halfHeight.set(0,M.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),_++}else if(M.isPointLight){const y=i.point[f];y.position.setFromMatrixPosition(M.matrixWorld),y.position.applyMatrix4(g),f++}else if(M.isHemisphereLight){const y=i.hemi[m];y.direction.setFromMatrixPosition(M.matrixWorld),y.direction.transformDirection(g),m++}}}return{setup:o,setupView:l,state:i}}function od(n){const e=new dE(n),t=[],i=[];function s(h){c.camera=h,t.length=0,i.length=0}function r(h){t.push(h)}function a(h){i.push(h)}function o(){e.setup(t)}function l(h){e.setupView(t,h)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function pE(n){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new od(n),e.set(s,[o])):r>=a.length?(o=new od(n),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const mE=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,gE=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,_E=[new j(1,0,0),new j(-1,0,0),new j(0,1,0),new j(0,-1,0),new j(0,0,1),new j(0,0,-1)],vE=[new j(0,-1,0),new j(0,-1,0),new j(0,0,1),new j(0,0,-1),new j(0,-1,0),new j(0,-1,0)],ld=new Tt,Wr=new j,Gl=new j;function xE(n,e,t){let i=new Vm;const s=new Pe,r=new Pe,a=new yt,o=new IS,l=new DS,c={},h=t.maxTextureSize,u={[On]:Jt,[Jt]:On,[Nt]:Nt},f=new mi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Pe},radius:{value:4}},vertexShader:mE,fragmentShader:gE}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const _=new mn;_.setAttribute("position",new Xi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const m=new At(_,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=wo;let p=this.type;this.render=function(E,P,L){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||E.length===0)return;E.type===ox&&(Ue("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),E.type=wo);const v=n.getRenderTarget(),b=n.getActiveCubeFace(),N=n.getActiveMipmapLevel(),k=n.state;k.setBlending(Wi),k.buffers.depth.getReversed()===!0?k.buffers.color.setClear(0,0,0,0):k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);const F=p!==this.type;F&&P.traverse(function(Y){Y.material&&(Array.isArray(Y.material)?Y.material.forEach(q=>q.needsUpdate=!0):Y.material.needsUpdate=!0)});for(let Y=0,q=E.length;Y<q;Y++){const G=E[Y],V=G.shadow;if(V===void 0){Ue("WebGLShadowMap:",G,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);const Q=V.getFrameExtents();if(s.multiply(Q),r.copy(V.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/Q.x),s.x=r.x*Q.x,V.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/Q.y),s.y=r.y*Q.y,V.mapSize.y=r.y)),V.map===null||F===!0){if(V.map!==null&&(V.map.depthTexture!==null&&(V.map.depthTexture.dispose(),V.map.depthTexture=null),V.map.dispose()),this.type===Zr){if(G.isPointLight){Ue("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}V.map=new Ti(s.x,s.y,{format:xr,type:hn,minFilter:vt,magFilter:vt,generateMipmaps:!1}),V.map.texture.name=G.name+".shadowMap",V.map.depthTexture=new ya(s.x,s.y,Di),V.map.depthTexture.name=G.name+".shadowMapDepth",V.map.depthTexture.format=un,V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=Rt,V.map.depthTexture.magFilter=Rt}else{G.isPointLight?(V.map=new zm(s.x),V.map.depthTexture=new LS(s.x,Yi)):(V.map=new Ti(s.x,s.y),V.map.depthTexture=new ya(s.x,s.y,Yi)),V.map.depthTexture.name=G.name+".shadowMap",V.map.depthTexture.format=un;const ae=n.state.buffers.depth.getReversed();this.type===wo?(V.map.depthTexture.compareFunction=ae?pu:du,V.map.depthTexture.minFilter=vt,V.map.depthTexture.magFilter=vt):(V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=Rt,V.map.depthTexture.magFilter=Rt)}V.camera.updateProjectionMatrix()}const he=V.map.isWebGLCubeRenderTarget?6:1;for(let ae=0;ae<he;ae++){if(V.map.isWebGLCubeRenderTarget)n.setRenderTarget(V.map,ae),n.clear();else{ae===0&&(n.setRenderTarget(V.map),n.clear());const ue=V.getViewport(ae);a.set(r.x*ue.x,r.y*ue.y,r.x*ue.z,r.y*ue.w),k.viewport(a)}if(G.isPointLight){const ue=V.camera,we=V.matrix,Ee=G.distance||ue.far;Ee!==ue.far&&(ue.far=Ee,ue.updateProjectionMatrix()),Wr.setFromMatrixPosition(G.matrixWorld),ue.position.copy(Wr),Gl.copy(ue.position),Gl.add(_E[ae]),ue.up.copy(vE[ae]),ue.lookAt(Gl),ue.updateMatrixWorld(),we.makeTranslation(-Wr.x,-Wr.y,-Wr.z),ld.multiplyMatrices(ue.projectionMatrix,ue.matrixWorldInverse),V._frustum.setFromProjectionMatrix(ld,ue.coordinateSystem,ue.reversedDepth)}else V.updateMatrices(G);i=V.getFrustum(),y(P,L,V.camera,G,this.type)}V.isPointLightShadow!==!0&&this.type===Zr&&x(V,L),V.needsUpdate=!1}p=this.type,g.needsUpdate=!1,n.setRenderTarget(v,b,N)};function x(E,P){const L=e.update(m);f.defines.VSM_SAMPLES!==E.blurSamples&&(f.defines.VSM_SAMPLES=E.blurSamples,d.defines.VSM_SAMPLES=E.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new Ti(s.x,s.y,{format:xr,type:hn})),f.uniforms.shadow_pass.value=E.map.depthTexture,f.uniforms.resolution.value=E.mapSize,f.uniforms.radius.value=E.radius,n.setRenderTarget(E.mapPass),n.clear(),n.renderBufferDirect(P,null,L,f,m,null),d.uniforms.shadow_pass.value=E.mapPass.texture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,n.setRenderTarget(E.map),n.clear(),n.renderBufferDirect(P,null,L,d,m,null)}function M(E,P,L,v){let b=null;const N=L.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(N!==void 0)b=N;else if(b=L.isPointLight===!0?l:o,n.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){const k=b.uuid,F=P.uuid;let Y=c[k];Y===void 0&&(Y={},c[k]=Y);let q=Y[F];q===void 0&&(q=b.clone(),Y[F]=q,P.addEventListener("dispose",w)),b=q}if(b.visible=P.visible,b.wireframe=P.wireframe,v===Zr?b.side=P.shadowSide!==null?P.shadowSide:P.side:b.side=P.shadowSide!==null?P.shadowSide:u[P.side],b.alphaMap=P.alphaMap,b.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,b.map=P.map,b.clipShadows=P.clipShadows,b.clippingPlanes=P.clippingPlanes,b.clipIntersection=P.clipIntersection,b.displacementMap=P.displacementMap,b.displacementScale=P.displacementScale,b.displacementBias=P.displacementBias,b.wireframeLinewidth=P.wireframeLinewidth,b.linewidth=P.linewidth,L.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const k=n.properties.get(b);k.light=L}return b}function y(E,P,L,v,b){if(E.visible===!1)return;if(E.layers.test(P.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&b===Zr)&&(!E.frustumCulled||i.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,E.matrixWorld);const F=e.update(E),Y=E.material;if(Array.isArray(Y)){const q=F.groups;for(let G=0,V=q.length;G<V;G++){const Q=q[G],he=Y[Q.materialIndex];if(he&&he.visible){const ae=M(E,he,v,b);E.onBeforeShadow(n,E,P,L,F,ae,Q),n.renderBufferDirect(L,null,F,ae,E,Q),E.onAfterShadow(n,E,P,L,F,ae,Q)}}}else if(Y.visible){const q=M(E,Y,v,b);E.onBeforeShadow(n,E,P,L,F,q,null),n.renderBufferDirect(L,null,F,q,E,null),E.onAfterShadow(n,E,P,L,F,q,null)}}const k=E.children;for(let F=0,Y=k.length;F<Y;F++)y(k[F],P,L,v,b)}function w(E){E.target.removeEventListener("dispose",w);for(const L in c){const v=c[L],b=E.target.uuid;b in v&&(v[b].dispose(),delete v[b])}}}const SE={[bc]:Ec,[Tc]:Cc,[Ac]:Rc,[_r]:Pc,[Ec]:bc,[Cc]:Tc,[Rc]:Ac,[Pc]:_r};function yE(n,e){function t(){let O=!1;const ce=new yt;let se=null;const fe=new yt(0,0,0,0);return{setMask:function(re){se!==re&&!O&&(n.colorMask(re,re,re,re),se=re)},setLocked:function(re){O=re},setClear:function(re,ie,me,Oe,ot){ot===!0&&(re*=Oe,ie*=Oe,me*=Oe),ce.set(re,ie,me,Oe),fe.equals(ce)===!1&&(n.clearColor(re,ie,me,Oe),fe.copy(ce))},reset:function(){O=!1,se=null,fe.set(-1,0,0,0)}}}function i(){let O=!1,ce=!1,se=null,fe=null,re=null;return{setReversed:function(ie){if(ce!==ie){const me=e.get("EXT_clip_control");ie?me.clipControlEXT(me.LOWER_LEFT_EXT,me.ZERO_TO_ONE_EXT):me.clipControlEXT(me.LOWER_LEFT_EXT,me.NEGATIVE_ONE_TO_ONE_EXT),ce=ie;const Oe=re;re=null,this.setClear(Oe)}},getReversed:function(){return ce},setTest:function(ie){ie?le(n.DEPTH_TEST):Se(n.DEPTH_TEST)},setMask:function(ie){se!==ie&&!O&&(n.depthMask(ie),se=ie)},setFunc:function(ie){if(ce&&(ie=SE[ie]),fe!==ie){switch(ie){case bc:n.depthFunc(n.NEVER);break;case Ec:n.depthFunc(n.ALWAYS);break;case Tc:n.depthFunc(n.LESS);break;case _r:n.depthFunc(n.LEQUAL);break;case Ac:n.depthFunc(n.EQUAL);break;case Pc:n.depthFunc(n.GEQUAL);break;case Cc:n.depthFunc(n.GREATER);break;case Rc:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}fe=ie}},setLocked:function(ie){O=ie},setClear:function(ie){re!==ie&&(ce&&(ie=1-ie),n.clearDepth(ie),re=ie)},reset:function(){O=!1,se=null,fe=null,re=null,ce=!1}}}function s(){let O=!1,ce=null,se=null,fe=null,re=null,ie=null,me=null,Oe=null,ot=null;return{setTest:function(et){O||(et?le(n.STENCIL_TEST):Se(n.STENCIL_TEST))},setMask:function(et){ce!==et&&!O&&(n.stencilMask(et),ce=et)},setFunc:function(et,Fi,Zi){(se!==et||fe!==Fi||re!==Zi)&&(n.stencilFunc(et,Fi,Zi),se=et,fe=Fi,re=Zi)},setOp:function(et,Fi,Zi){(ie!==et||me!==Fi||Oe!==Zi)&&(n.stencilOp(et,Fi,Zi),ie=et,me=Fi,Oe=Zi)},setLocked:function(et){O=et},setClear:function(et){ot!==et&&(n.clearStencil(et),ot=et)},reset:function(){O=!1,ce=null,se=null,fe=null,re=null,ie=null,me=null,Oe=null,ot=null}}}const r=new t,a=new i,o=new s,l=new WeakMap,c=new WeakMap;let h={},u={},f=new WeakMap,d=[],_=null,m=!1,g=null,p=null,x=null,M=null,y=null,w=null,E=null,P=new Ze(0,0,0),L=0,v=!1,b=null,N=null,k=null,F=null,Y=null;const q=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let G=!1,V=0;const Q=n.getParameter(n.VERSION);Q.indexOf("WebGL")!==-1?(V=parseFloat(/^WebGL (\d)/.exec(Q)[1]),G=V>=1):Q.indexOf("OpenGL ES")!==-1&&(V=parseFloat(/^OpenGL ES (\d)/.exec(Q)[1]),G=V>=2);let he=null,ae={};const ue=n.getParameter(n.SCISSOR_BOX),we=n.getParameter(n.VIEWPORT),Ee=new yt().fromArray(ue),Ne=new yt().fromArray(we);function Fe(O,ce,se,fe){const re=new Uint8Array(4),ie=n.createTexture();n.bindTexture(O,ie),n.texParameteri(O,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(O,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let me=0;me<se;me++)O===n.TEXTURE_3D||O===n.TEXTURE_2D_ARRAY?n.texImage3D(ce,0,n.RGBA,1,1,fe,0,n.RGBA,n.UNSIGNED_BYTE,re):n.texImage2D(ce+me,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,re);return ie}const ne={};ne[n.TEXTURE_2D]=Fe(n.TEXTURE_2D,n.TEXTURE_2D,1),ne[n.TEXTURE_CUBE_MAP]=Fe(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),ne[n.TEXTURE_2D_ARRAY]=Fe(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),ne[n.TEXTURE_3D]=Fe(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),le(n.DEPTH_TEST),a.setFunc(_r),ke(!1),pt(df),le(n.CULL_FACE),Xe(Wi);function le(O){h[O]!==!0&&(n.enable(O),h[O]=!0)}function Se(O){h[O]!==!1&&(n.disable(O),h[O]=!1)}function Ie(O,ce){return u[O]!==ce?(n.bindFramebuffer(O,ce),u[O]=ce,O===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=ce),O===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=ce),!0):!1}function ge(O,ce){let se=d,fe=!1;if(O){se=f.get(ce),se===void 0&&(se=[],f.set(ce,se));const re=O.textures;if(se.length!==re.length||se[0]!==n.COLOR_ATTACHMENT0){for(let ie=0,me=re.length;ie<me;ie++)se[ie]=n.COLOR_ATTACHMENT0+ie;se.length=re.length,fe=!0}}else se[0]!==n.BACK&&(se[0]=n.BACK,fe=!0);fe&&n.drawBuffers(se)}function $e(O){return _!==O?(n.useProgram(O),_=O,!0):!1}const Mt={[ns]:n.FUNC_ADD,[cx]:n.FUNC_SUBTRACT,[hx]:n.FUNC_REVERSE_SUBTRACT};Mt[ux]=n.MIN,Mt[fx]=n.MAX;const Ge={[dx]:n.ZERO,[px]:n.ONE,[mx]:n.SRC_COLOR,[wc]:n.SRC_ALPHA,[yx]:n.SRC_ALPHA_SATURATE,[xx]:n.DST_COLOR,[_x]:n.DST_ALPHA,[gx]:n.ONE_MINUS_SRC_COLOR,[Mc]:n.ONE_MINUS_SRC_ALPHA,[Sx]:n.ONE_MINUS_DST_COLOR,[vx]:n.ONE_MINUS_DST_ALPHA,[wx]:n.CONSTANT_COLOR,[Mx]:n.ONE_MINUS_CONSTANT_COLOR,[bx]:n.CONSTANT_ALPHA,[Ex]:n.ONE_MINUS_CONSTANT_ALPHA};function Xe(O,ce,se,fe,re,ie,me,Oe,ot,et){if(O===Wi){m===!0&&(Se(n.BLEND),m=!1);return}if(m===!1&&(le(n.BLEND),m=!0),O!==lx){if(O!==g||et!==v){if((p!==ns||y!==ns)&&(n.blendEquation(n.FUNC_ADD),p=ns,y=ns),et)switch(O){case ur:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case pf:n.blendFunc(n.ONE,n.ONE);break;case mf:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case gf:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:Ke("WebGLState: Invalid blending: ",O);break}else switch(O){case ur:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case pf:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case mf:Ke("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case gf:Ke("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ke("WebGLState: Invalid blending: ",O);break}x=null,M=null,w=null,E=null,P.set(0,0,0),L=0,g=O,v=et}return}re=re||ce,ie=ie||se,me=me||fe,(ce!==p||re!==y)&&(n.blendEquationSeparate(Mt[ce],Mt[re]),p=ce,y=re),(se!==x||fe!==M||ie!==w||me!==E)&&(n.blendFuncSeparate(Ge[se],Ge[fe],Ge[ie],Ge[me]),x=se,M=fe,w=ie,E=me),(Oe.equals(P)===!1||ot!==L)&&(n.blendColor(Oe.r,Oe.g,Oe.b,ot),P.copy(Oe),L=ot),g=O,v=!1}function Je(O,ce){O.side===Nt?Se(n.CULL_FACE):le(n.CULL_FACE);let se=O.side===Jt;ce&&(se=!se),ke(se),O.blending===ur&&O.transparent===!1?Xe(Wi):Xe(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),a.setFunc(O.depthFunc),a.setTest(O.depthTest),a.setMask(O.depthWrite),r.setMask(O.colorWrite);const fe=O.stencilWrite;o.setTest(fe),fe&&(o.setMask(O.stencilWriteMask),o.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),o.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),mt(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?le(n.SAMPLE_ALPHA_TO_COVERAGE):Se(n.SAMPLE_ALPHA_TO_COVERAGE)}function ke(O){b!==O&&(O?n.frontFace(n.CW):n.frontFace(n.CCW),b=O)}function pt(O){O!==rx?(le(n.CULL_FACE),O!==N&&(O===df?n.cullFace(n.BACK):O===ax?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Se(n.CULL_FACE),N=O}function U(O){O!==k&&(G&&n.lineWidth(O),k=O)}function mt(O,ce,se){O?(le(n.POLYGON_OFFSET_FILL),(F!==ce||Y!==se)&&(n.polygonOffset(ce,se),F=ce,Y=se)):Se(n.POLYGON_OFFSET_FILL)}function je(O){O?le(n.SCISSOR_TEST):Se(n.SCISSOR_TEST)}function Qe(O){O===void 0&&(O=n.TEXTURE0+q-1),he!==O&&(n.activeTexture(O),he=O)}function Te(O,ce,se){se===void 0&&(he===null?se=n.TEXTURE0+q-1:se=he);let fe=ae[se];fe===void 0&&(fe={type:void 0,texture:void 0},ae[se]=fe),(fe.type!==O||fe.texture!==ce)&&(he!==se&&(n.activeTexture(se),he=se),n.bindTexture(O,ce||ne[O]),fe.type=O,fe.texture=ce)}function R(){const O=ae[he];O!==void 0&&O.type!==void 0&&(n.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function S(){try{n.compressedTexImage2D(...arguments)}catch(O){Ke("WebGLState:",O)}}function z(){try{n.compressedTexImage3D(...arguments)}catch(O){Ke("WebGLState:",O)}}function te(){try{n.texSubImage2D(...arguments)}catch(O){Ke("WebGLState:",O)}}function oe(){try{n.texSubImage3D(...arguments)}catch(O){Ke("WebGLState:",O)}}function ee(){try{n.compressedTexSubImage2D(...arguments)}catch(O){Ke("WebGLState:",O)}}function Ae(){try{n.compressedTexSubImage3D(...arguments)}catch(O){Ke("WebGLState:",O)}}function pe(){try{n.texStorage2D(...arguments)}catch(O){Ke("WebGLState:",O)}}function Me(){try{n.texStorage3D(...arguments)}catch(O){Ke("WebGLState:",O)}}function A(){try{n.texImage2D(...arguments)}catch(O){Ke("WebGLState:",O)}}function C(){try{n.texImage3D(...arguments)}catch(O){Ke("WebGLState:",O)}}function B(O){Ee.equals(O)===!1&&(n.scissor(O.x,O.y,O.z,O.w),Ee.copy(O))}function H(O){Ne.equals(O)===!1&&(n.viewport(O.x,O.y,O.z,O.w),Ne.copy(O))}function Z(O,ce){let se=c.get(ce);se===void 0&&(se=new WeakMap,c.set(ce,se));let fe=se.get(O);fe===void 0&&(fe=n.getUniformBlockIndex(ce,O.name),se.set(O,fe))}function J(O,ce){const fe=c.get(ce).get(O);l.get(ce)!==fe&&(n.uniformBlockBinding(ce,fe,O.__bindingPointIndex),l.set(ce,fe))}function de(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},he=null,ae={},u={},f=new WeakMap,d=[],_=null,m=!1,g=null,p=null,x=null,M=null,y=null,w=null,E=null,P=new Ze(0,0,0),L=0,v=!1,b=null,N=null,k=null,F=null,Y=null,Ee.set(0,0,n.canvas.width,n.canvas.height),Ne.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:le,disable:Se,bindFramebuffer:Ie,drawBuffers:ge,useProgram:$e,setBlending:Xe,setMaterial:Je,setFlipSided:ke,setCullFace:pt,setLineWidth:U,setPolygonOffset:mt,setScissorTest:je,activeTexture:Qe,bindTexture:Te,unbindTexture:R,compressedTexImage2D:S,compressedTexImage3D:z,texImage2D:A,texImage3D:C,updateUBOMapping:Z,uniformBlockBinding:J,texStorage2D:pe,texStorage3D:Me,texSubImage2D:te,texSubImage3D:oe,compressedTexSubImage2D:ee,compressedTexSubImage3D:Ae,scissor:B,viewport:H,reset:de}}function wE(n,e,t,i,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Pe,h=new WeakMap;let u;const f=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(R,S){return d?new OffscreenCanvas(R,S):va("canvas")}function m(R,S,z){let te=1;const oe=Te(R);if((oe.width>z||oe.height>z)&&(te=z/Math.max(oe.width,oe.height)),te<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const ee=Math.floor(te*oe.width),Ae=Math.floor(te*oe.height);u===void 0&&(u=_(ee,Ae));const pe=S?_(ee,Ae):u;return pe.width=ee,pe.height=Ae,pe.getContext("2d").drawImage(R,0,0,ee,Ae),Ue("WebGLRenderer: Texture has been resized from ("+oe.width+"x"+oe.height+") to ("+ee+"x"+Ae+")."),pe}else return"data"in R&&Ue("WebGLRenderer: Image in DataTexture is too big ("+oe.width+"x"+oe.height+")."),R;return R}function g(R){return R.generateMipmaps}function p(R){n.generateMipmap(R)}function x(R){return R.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?n.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function M(R,S,z,te,oe=!1){if(R!==null){if(n[R]!==void 0)return n[R];Ue("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let ee=S;if(S===n.RED&&(z===n.FLOAT&&(ee=n.R32F),z===n.HALF_FLOAT&&(ee=n.R16F),z===n.UNSIGNED_BYTE&&(ee=n.R8)),S===n.RED_INTEGER&&(z===n.UNSIGNED_BYTE&&(ee=n.R8UI),z===n.UNSIGNED_SHORT&&(ee=n.R16UI),z===n.UNSIGNED_INT&&(ee=n.R32UI),z===n.BYTE&&(ee=n.R8I),z===n.SHORT&&(ee=n.R16I),z===n.INT&&(ee=n.R32I)),S===n.RG&&(z===n.FLOAT&&(ee=n.RG32F),z===n.HALF_FLOAT&&(ee=n.RG16F),z===n.UNSIGNED_BYTE&&(ee=n.RG8)),S===n.RG_INTEGER&&(z===n.UNSIGNED_BYTE&&(ee=n.RG8UI),z===n.UNSIGNED_SHORT&&(ee=n.RG16UI),z===n.UNSIGNED_INT&&(ee=n.RG32UI),z===n.BYTE&&(ee=n.RG8I),z===n.SHORT&&(ee=n.RG16I),z===n.INT&&(ee=n.RG32I)),S===n.RGB_INTEGER&&(z===n.UNSIGNED_BYTE&&(ee=n.RGB8UI),z===n.UNSIGNED_SHORT&&(ee=n.RGB16UI),z===n.UNSIGNED_INT&&(ee=n.RGB32UI),z===n.BYTE&&(ee=n.RGB8I),z===n.SHORT&&(ee=n.RGB16I),z===n.INT&&(ee=n.RGB32I)),S===n.RGBA_INTEGER&&(z===n.UNSIGNED_BYTE&&(ee=n.RGBA8UI),z===n.UNSIGNED_SHORT&&(ee=n.RGBA16UI),z===n.UNSIGNED_INT&&(ee=n.RGBA32UI),z===n.BYTE&&(ee=n.RGBA8I),z===n.SHORT&&(ee=n.RGBA16I),z===n.INT&&(ee=n.RGBA32I)),S===n.RGB&&(z===n.UNSIGNED_INT_5_9_9_9_REV&&(ee=n.RGB9_E5),z===n.UNSIGNED_INT_10F_11F_11F_REV&&(ee=n.R11F_G11F_B10F)),S===n.RGBA){const Ae=oe?Oo:qe.getTransfer(te);z===n.FLOAT&&(ee=n.RGBA32F),z===n.HALF_FLOAT&&(ee=n.RGBA16F),z===n.UNSIGNED_BYTE&&(ee=Ae===it?n.SRGB8_ALPHA8:n.RGBA8),z===n.UNSIGNED_SHORT_4_4_4_4&&(ee=n.RGBA4),z===n.UNSIGNED_SHORT_5_5_5_1&&(ee=n.RGB5_A1)}return(ee===n.R16F||ee===n.R32F||ee===n.RG16F||ee===n.RG32F||ee===n.RGBA16F||ee===n.RGBA32F)&&e.get("EXT_color_buffer_float"),ee}function y(R,S){let z;return R?S===null||S===Yi||S===_a?z=n.DEPTH24_STENCIL8:S===Di?z=n.DEPTH32F_STENCIL8:S===ga&&(z=n.DEPTH24_STENCIL8,Ue("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===Yi||S===_a?z=n.DEPTH_COMPONENT24:S===Di?z=n.DEPTH_COMPONENT32F:S===ga&&(z=n.DEPTH_COMPONENT16),z}function w(R,S){return g(R)===!0||R.isFramebufferTexture&&R.minFilter!==Rt&&R.minFilter!==vt?Math.log2(Math.max(S.width,S.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?S.mipmaps.length:1}function E(R){const S=R.target;S.removeEventListener("dispose",E),L(S),S.isVideoTexture&&h.delete(S)}function P(R){const S=R.target;S.removeEventListener("dispose",P),b(S)}function L(R){const S=i.get(R);if(S.__webglInit===void 0)return;const z=R.source,te=f.get(z);if(te){const oe=te[S.__cacheKey];oe.usedTimes--,oe.usedTimes===0&&v(R),Object.keys(te).length===0&&f.delete(z)}i.remove(R)}function v(R){const S=i.get(R);n.deleteTexture(S.__webglTexture);const z=R.source,te=f.get(z);delete te[S.__cacheKey],a.memory.textures--}function b(R){const S=i.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),i.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let te=0;te<6;te++){if(Array.isArray(S.__webglFramebuffer[te]))for(let oe=0;oe<S.__webglFramebuffer[te].length;oe++)n.deleteFramebuffer(S.__webglFramebuffer[te][oe]);else n.deleteFramebuffer(S.__webglFramebuffer[te]);S.__webglDepthbuffer&&n.deleteRenderbuffer(S.__webglDepthbuffer[te])}else{if(Array.isArray(S.__webglFramebuffer))for(let te=0;te<S.__webglFramebuffer.length;te++)n.deleteFramebuffer(S.__webglFramebuffer[te]);else n.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&n.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&n.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let te=0;te<S.__webglColorRenderbuffer.length;te++)S.__webglColorRenderbuffer[te]&&n.deleteRenderbuffer(S.__webglColorRenderbuffer[te]);S.__webglDepthRenderbuffer&&n.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const z=R.textures;for(let te=0,oe=z.length;te<oe;te++){const ee=i.get(z[te]);ee.__webglTexture&&(n.deleteTexture(ee.__webglTexture),a.memory.textures--),i.remove(z[te])}i.remove(R)}let N=0;function k(){N=0}function F(){const R=N;return R>=s.maxTextures&&Ue("WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),N+=1,R}function Y(R){const S=[];return S.push(R.wrapS),S.push(R.wrapT),S.push(R.wrapR||0),S.push(R.magFilter),S.push(R.minFilter),S.push(R.anisotropy),S.push(R.internalFormat),S.push(R.format),S.push(R.type),S.push(R.generateMipmaps),S.push(R.premultiplyAlpha),S.push(R.flipY),S.push(R.unpackAlignment),S.push(R.colorSpace),S.join()}function q(R,S){const z=i.get(R);if(R.isVideoTexture&&je(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&z.__version!==R.version){const te=R.image;if(te===null)Ue("WebGLRenderer: Texture marked for update but no image data found.");else if(te.complete===!1)Ue("WebGLRenderer: Texture marked for update but image is incomplete");else{ne(z,R,S);return}}else R.isExternalTexture&&(z.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,z.__webglTexture,n.TEXTURE0+S)}function G(R,S){const z=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&z.__version!==R.version){ne(z,R,S);return}else R.isExternalTexture&&(z.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,z.__webglTexture,n.TEXTURE0+S)}function V(R,S){const z=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&z.__version!==R.version){ne(z,R,S);return}t.bindTexture(n.TEXTURE_3D,z.__webglTexture,n.TEXTURE0+S)}function Q(R,S){const z=i.get(R);if(R.isCubeDepthTexture!==!0&&R.version>0&&z.__version!==R.version){le(z,R,S);return}t.bindTexture(n.TEXTURE_CUBE_MAP,z.__webglTexture,n.TEXTURE0+S)}const he={[Dc]:n.REPEAT,[Ii]:n.CLAMP_TO_EDGE,[Nc]:n.MIRRORED_REPEAT},ae={[Rt]:n.NEAREST,[Px]:n.NEAREST_MIPMAP_NEAREST,[Wa]:n.NEAREST_MIPMAP_LINEAR,[vt]:n.LINEAR,[ml]:n.LINEAR_MIPMAP_NEAREST,[as]:n.LINEAR_MIPMAP_LINEAR},ue={[Ix]:n.NEVER,[Fx]:n.ALWAYS,[Dx]:n.LESS,[du]:n.LEQUAL,[Nx]:n.EQUAL,[pu]:n.GEQUAL,[Ox]:n.GREATER,[Ux]:n.NOTEQUAL};function we(R,S){if(S.type===Di&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===vt||S.magFilter===ml||S.magFilter===Wa||S.magFilter===as||S.minFilter===vt||S.minFilter===ml||S.minFilter===Wa||S.minFilter===as)&&Ue("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(R,n.TEXTURE_WRAP_S,he[S.wrapS]),n.texParameteri(R,n.TEXTURE_WRAP_T,he[S.wrapT]),(R===n.TEXTURE_3D||R===n.TEXTURE_2D_ARRAY)&&n.texParameteri(R,n.TEXTURE_WRAP_R,he[S.wrapR]),n.texParameteri(R,n.TEXTURE_MAG_FILTER,ae[S.magFilter]),n.texParameteri(R,n.TEXTURE_MIN_FILTER,ae[S.minFilter]),S.compareFunction&&(n.texParameteri(R,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(R,n.TEXTURE_COMPARE_FUNC,ue[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===Rt||S.minFilter!==Wa&&S.minFilter!==as||S.type===Di&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||i.get(S).__currentAnisotropy){const z=e.get("EXT_texture_filter_anisotropic");n.texParameterf(R,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),i.get(S).__currentAnisotropy=S.anisotropy}}}function Ee(R,S){let z=!1;R.__webglInit===void 0&&(R.__webglInit=!0,S.addEventListener("dispose",E));const te=S.source;let oe=f.get(te);oe===void 0&&(oe={},f.set(te,oe));const ee=Y(S);if(ee!==R.__cacheKey){oe[ee]===void 0&&(oe[ee]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,z=!0),oe[ee].usedTimes++;const Ae=oe[R.__cacheKey];Ae!==void 0&&(oe[R.__cacheKey].usedTimes--,Ae.usedTimes===0&&v(S)),R.__cacheKey=ee,R.__webglTexture=oe[ee].texture}return z}function Ne(R,S,z){return Math.floor(Math.floor(R/z)/S)}function Fe(R,S,z,te){const ee=R.updateRanges;if(ee.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,S.width,S.height,z,te,S.data);else{ee.sort((C,B)=>C.start-B.start);let Ae=0;for(let C=1;C<ee.length;C++){const B=ee[Ae],H=ee[C],Z=B.start+B.count,J=Ne(H.start,S.width,4),de=Ne(B.start,S.width,4);H.start<=Z+1&&J===de&&Ne(H.start+H.count-1,S.width,4)===J?B.count=Math.max(B.count,H.start+H.count-B.start):(++Ae,ee[Ae]=H)}ee.length=Ae+1;const pe=n.getParameter(n.UNPACK_ROW_LENGTH),Me=n.getParameter(n.UNPACK_SKIP_PIXELS),A=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,S.width);for(let C=0,B=ee.length;C<B;C++){const H=ee[C],Z=Math.floor(H.start/4),J=Math.ceil(H.count/4),de=Z%S.width,O=Math.floor(Z/S.width),ce=J,se=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,de),n.pixelStorei(n.UNPACK_SKIP_ROWS,O),t.texSubImage2D(n.TEXTURE_2D,0,de,O,ce,se,z,te,S.data)}R.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,pe),n.pixelStorei(n.UNPACK_SKIP_PIXELS,Me),n.pixelStorei(n.UNPACK_SKIP_ROWS,A)}}function ne(R,S,z){let te=n.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(te=n.TEXTURE_2D_ARRAY),S.isData3DTexture&&(te=n.TEXTURE_3D);const oe=Ee(R,S),ee=S.source;t.bindTexture(te,R.__webglTexture,n.TEXTURE0+z);const Ae=i.get(ee);if(ee.version!==Ae.__version||oe===!0){t.activeTexture(n.TEXTURE0+z);const pe=qe.getPrimaries(qe.workingColorSpace),Me=S.colorSpace===Tn?null:qe.getPrimaries(S.colorSpace),A=S.colorSpace===Tn||pe===Me?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,A);let C=m(S.image,!1,s.maxTextureSize);C=Qe(S,C);const B=r.convert(S.format,S.colorSpace),H=r.convert(S.type);let Z=M(S.internalFormat,B,H,S.colorSpace,S.isVideoTexture);we(te,S);let J;const de=S.mipmaps,O=S.isVideoTexture!==!0,ce=Ae.__version===void 0||oe===!0,se=ee.dataReady,fe=w(S,C);if(S.isDepthTexture)Z=y(S.format===os,S.type),ce&&(O?t.texStorage2D(n.TEXTURE_2D,1,Z,C.width,C.height):t.texImage2D(n.TEXTURE_2D,0,Z,C.width,C.height,0,B,H,null));else if(S.isDataTexture)if(de.length>0){O&&ce&&t.texStorage2D(n.TEXTURE_2D,fe,Z,de[0].width,de[0].height);for(let re=0,ie=de.length;re<ie;re++)J=de[re],O?se&&t.texSubImage2D(n.TEXTURE_2D,re,0,0,J.width,J.height,B,H,J.data):t.texImage2D(n.TEXTURE_2D,re,Z,J.width,J.height,0,B,H,J.data);S.generateMipmaps=!1}else O?(ce&&t.texStorage2D(n.TEXTURE_2D,fe,Z,C.width,C.height),se&&Fe(S,C,B,H)):t.texImage2D(n.TEXTURE_2D,0,Z,C.width,C.height,0,B,H,C.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){O&&ce&&t.texStorage3D(n.TEXTURE_2D_ARRAY,fe,Z,de[0].width,de[0].height,C.depth);for(let re=0,ie=de.length;re<ie;re++)if(J=de[re],S.format!==hi)if(B!==null)if(O){if(se)if(S.layerUpdates.size>0){const me=Bf(J.width,J.height,S.format,S.type);for(const Oe of S.layerUpdates){const ot=J.data.subarray(Oe*me/J.data.BYTES_PER_ELEMENT,(Oe+1)*me/J.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,re,0,0,Oe,J.width,J.height,1,B,ot)}S.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,re,0,0,0,J.width,J.height,C.depth,B,J.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,re,Z,J.width,J.height,C.depth,0,J.data,0,0);else Ue("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else O?se&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,re,0,0,0,J.width,J.height,C.depth,B,H,J.data):t.texImage3D(n.TEXTURE_2D_ARRAY,re,Z,J.width,J.height,C.depth,0,B,H,J.data)}else{O&&ce&&t.texStorage2D(n.TEXTURE_2D,fe,Z,de[0].width,de[0].height);for(let re=0,ie=de.length;re<ie;re++)J=de[re],S.format!==hi?B!==null?O?se&&t.compressedTexSubImage2D(n.TEXTURE_2D,re,0,0,J.width,J.height,B,J.data):t.compressedTexImage2D(n.TEXTURE_2D,re,Z,J.width,J.height,0,J.data):Ue("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):O?se&&t.texSubImage2D(n.TEXTURE_2D,re,0,0,J.width,J.height,B,H,J.data):t.texImage2D(n.TEXTURE_2D,re,Z,J.width,J.height,0,B,H,J.data)}else if(S.isDataArrayTexture)if(O){if(ce&&t.texStorage3D(n.TEXTURE_2D_ARRAY,fe,Z,C.width,C.height,C.depth),se)if(S.layerUpdates.size>0){const re=Bf(C.width,C.height,S.format,S.type);for(const ie of S.layerUpdates){const me=C.data.subarray(ie*re/C.data.BYTES_PER_ELEMENT,(ie+1)*re/C.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,ie,C.width,C.height,1,B,H,me)}S.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,C.width,C.height,C.depth,B,H,C.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Z,C.width,C.height,C.depth,0,B,H,C.data);else if(S.isData3DTexture)O?(ce&&t.texStorage3D(n.TEXTURE_3D,fe,Z,C.width,C.height,C.depth),se&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,C.width,C.height,C.depth,B,H,C.data)):t.texImage3D(n.TEXTURE_3D,0,Z,C.width,C.height,C.depth,0,B,H,C.data);else if(S.isFramebufferTexture){if(ce)if(O)t.texStorage2D(n.TEXTURE_2D,fe,Z,C.width,C.height);else{let re=C.width,ie=C.height;for(let me=0;me<fe;me++)t.texImage2D(n.TEXTURE_2D,me,Z,re,ie,0,B,H,null),re>>=1,ie>>=1}}else if(de.length>0){if(O&&ce){const re=Te(de[0]);t.texStorage2D(n.TEXTURE_2D,fe,Z,re.width,re.height)}for(let re=0,ie=de.length;re<ie;re++)J=de[re],O?se&&t.texSubImage2D(n.TEXTURE_2D,re,0,0,B,H,J):t.texImage2D(n.TEXTURE_2D,re,Z,B,H,J);S.generateMipmaps=!1}else if(O){if(ce){const re=Te(C);t.texStorage2D(n.TEXTURE_2D,fe,Z,re.width,re.height)}se&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,B,H,C)}else t.texImage2D(n.TEXTURE_2D,0,Z,B,H,C);g(S)&&p(te),Ae.__version=ee.version,S.onUpdate&&S.onUpdate(S)}R.__version=S.version}function le(R,S,z){if(S.image.length!==6)return;const te=Ee(R,S),oe=S.source;t.bindTexture(n.TEXTURE_CUBE_MAP,R.__webglTexture,n.TEXTURE0+z);const ee=i.get(oe);if(oe.version!==ee.__version||te===!0){t.activeTexture(n.TEXTURE0+z);const Ae=qe.getPrimaries(qe.workingColorSpace),pe=S.colorSpace===Tn?null:qe.getPrimaries(S.colorSpace),Me=S.colorSpace===Tn||Ae===pe?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Me);const A=S.isCompressedTexture||S.image[0].isCompressedTexture,C=S.image[0]&&S.image[0].isDataTexture,B=[];for(let ie=0;ie<6;ie++)!A&&!C?B[ie]=m(S.image[ie],!0,s.maxCubemapSize):B[ie]=C?S.image[ie].image:S.image[ie],B[ie]=Qe(S,B[ie]);const H=B[0],Z=r.convert(S.format,S.colorSpace),J=r.convert(S.type),de=M(S.internalFormat,Z,J,S.colorSpace),O=S.isVideoTexture!==!0,ce=ee.__version===void 0||te===!0,se=oe.dataReady;let fe=w(S,H);we(n.TEXTURE_CUBE_MAP,S);let re;if(A){O&&ce&&t.texStorage2D(n.TEXTURE_CUBE_MAP,fe,de,H.width,H.height);for(let ie=0;ie<6;ie++){re=B[ie].mipmaps;for(let me=0;me<re.length;me++){const Oe=re[me];S.format!==hi?Z!==null?O?se&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,me,0,0,Oe.width,Oe.height,Z,Oe.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,me,de,Oe.width,Oe.height,0,Oe.data):Ue("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):O?se&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,me,0,0,Oe.width,Oe.height,Z,J,Oe.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,me,de,Oe.width,Oe.height,0,Z,J,Oe.data)}}}else{if(re=S.mipmaps,O&&ce){re.length>0&&fe++;const ie=Te(B[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,fe,de,ie.width,ie.height)}for(let ie=0;ie<6;ie++)if(C){O?se&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,B[ie].width,B[ie].height,Z,J,B[ie].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,de,B[ie].width,B[ie].height,0,Z,J,B[ie].data);for(let me=0;me<re.length;me++){const ot=re[me].image[ie].image;O?se&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,me+1,0,0,ot.width,ot.height,Z,J,ot.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,me+1,de,ot.width,ot.height,0,Z,J,ot.data)}}else{O?se&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,Z,J,B[ie]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,de,Z,J,B[ie]);for(let me=0;me<re.length;me++){const Oe=re[me];O?se&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,me+1,0,0,Z,J,Oe.image[ie]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,me+1,de,Z,J,Oe.image[ie])}}}g(S)&&p(n.TEXTURE_CUBE_MAP),ee.__version=oe.version,S.onUpdate&&S.onUpdate(S)}R.__version=S.version}function Se(R,S,z,te,oe,ee){const Ae=r.convert(z.format,z.colorSpace),pe=r.convert(z.type),Me=M(z.internalFormat,Ae,pe,z.colorSpace),A=i.get(S),C=i.get(z);if(C.__renderTarget=S,!A.__hasExternalTextures){const B=Math.max(1,S.width>>ee),H=Math.max(1,S.height>>ee);oe===n.TEXTURE_3D||oe===n.TEXTURE_2D_ARRAY?t.texImage3D(oe,ee,Me,B,H,S.depth,0,Ae,pe,null):t.texImage2D(oe,ee,Me,B,H,0,Ae,pe,null)}t.bindFramebuffer(n.FRAMEBUFFER,R),mt(S)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,te,oe,C.__webglTexture,0,U(S)):(oe===n.TEXTURE_2D||oe>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&oe<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,te,oe,C.__webglTexture,ee),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Ie(R,S,z){if(n.bindRenderbuffer(n.RENDERBUFFER,R),S.depthBuffer){const te=S.depthTexture,oe=te&&te.isDepthTexture?te.type:null,ee=y(S.stencilBuffer,oe),Ae=S.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;mt(S)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,U(S),ee,S.width,S.height):z?n.renderbufferStorageMultisample(n.RENDERBUFFER,U(S),ee,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,ee,S.width,S.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Ae,n.RENDERBUFFER,R)}else{const te=S.textures;for(let oe=0;oe<te.length;oe++){const ee=te[oe],Ae=r.convert(ee.format,ee.colorSpace),pe=r.convert(ee.type),Me=M(ee.internalFormat,Ae,pe,ee.colorSpace);mt(S)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,U(S),Me,S.width,S.height):z?n.renderbufferStorageMultisample(n.RENDERBUFFER,U(S),Me,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,Me,S.width,S.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function ge(R,S,z){const te=S.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,R),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const oe=i.get(S.depthTexture);if(oe.__renderTarget=S,(!oe.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),te){if(oe.__webglInit===void 0&&(oe.__webglInit=!0,S.depthTexture.addEventListener("dispose",E)),oe.__webglTexture===void 0){oe.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,oe.__webglTexture),we(n.TEXTURE_CUBE_MAP,S.depthTexture);const A=r.convert(S.depthTexture.format),C=r.convert(S.depthTexture.type);let B;S.depthTexture.format===un?B=n.DEPTH_COMPONENT24:S.depthTexture.format===os&&(B=n.DEPTH24_STENCIL8);for(let H=0;H<6;H++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+H,0,B,S.width,S.height,0,A,C,null)}}else q(S.depthTexture,0);const ee=oe.__webglTexture,Ae=U(S),pe=te?n.TEXTURE_CUBE_MAP_POSITIVE_X+z:n.TEXTURE_2D,Me=S.depthTexture.format===os?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(S.depthTexture.format===un)mt(S)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Me,pe,ee,0,Ae):n.framebufferTexture2D(n.FRAMEBUFFER,Me,pe,ee,0);else if(S.depthTexture.format===os)mt(S)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Me,pe,ee,0,Ae):n.framebufferTexture2D(n.FRAMEBUFFER,Me,pe,ee,0);else throw new Error("Unknown depthTexture format")}function $e(R){const S=i.get(R),z=R.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==R.depthTexture){const te=R.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),te){const oe=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,te.removeEventListener("dispose",oe)};te.addEventListener("dispose",oe),S.__depthDisposeCallback=oe}S.__boundDepthTexture=te}if(R.depthTexture&&!S.__autoAllocateDepthBuffer)if(z)for(let te=0;te<6;te++)ge(S.__webglFramebuffer[te],R,te);else{const te=R.texture.mipmaps;te&&te.length>0?ge(S.__webglFramebuffer[0],R,0):ge(S.__webglFramebuffer,R,0)}else if(z){S.__webglDepthbuffer=[];for(let te=0;te<6;te++)if(t.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer[te]),S.__webglDepthbuffer[te]===void 0)S.__webglDepthbuffer[te]=n.createRenderbuffer(),Ie(S.__webglDepthbuffer[te],R,!1);else{const oe=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ee=S.__webglDepthbuffer[te];n.bindRenderbuffer(n.RENDERBUFFER,ee),n.framebufferRenderbuffer(n.FRAMEBUFFER,oe,n.RENDERBUFFER,ee)}}else{const te=R.texture.mipmaps;if(te&&te.length>0?t.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=n.createRenderbuffer(),Ie(S.__webglDepthbuffer,R,!1);else{const oe=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ee=S.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ee),n.framebufferRenderbuffer(n.FRAMEBUFFER,oe,n.RENDERBUFFER,ee)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Mt(R,S,z){const te=i.get(R);S!==void 0&&Se(te.__webglFramebuffer,R,R.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),z!==void 0&&$e(R)}function Ge(R){const S=R.texture,z=i.get(R),te=i.get(S);R.addEventListener("dispose",P);const oe=R.textures,ee=R.isWebGLCubeRenderTarget===!0,Ae=oe.length>1;if(Ae||(te.__webglTexture===void 0&&(te.__webglTexture=n.createTexture()),te.__version=S.version,a.memory.textures++),ee){z.__webglFramebuffer=[];for(let pe=0;pe<6;pe++)if(S.mipmaps&&S.mipmaps.length>0){z.__webglFramebuffer[pe]=[];for(let Me=0;Me<S.mipmaps.length;Me++)z.__webglFramebuffer[pe][Me]=n.createFramebuffer()}else z.__webglFramebuffer[pe]=n.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){z.__webglFramebuffer=[];for(let pe=0;pe<S.mipmaps.length;pe++)z.__webglFramebuffer[pe]=n.createFramebuffer()}else z.__webglFramebuffer=n.createFramebuffer();if(Ae)for(let pe=0,Me=oe.length;pe<Me;pe++){const A=i.get(oe[pe]);A.__webglTexture===void 0&&(A.__webglTexture=n.createTexture(),a.memory.textures++)}if(R.samples>0&&mt(R)===!1){z.__webglMultisampledFramebuffer=n.createFramebuffer(),z.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let pe=0;pe<oe.length;pe++){const Me=oe[pe];z.__webglColorRenderbuffer[pe]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,z.__webglColorRenderbuffer[pe]);const A=r.convert(Me.format,Me.colorSpace),C=r.convert(Me.type),B=M(Me.internalFormat,A,C,Me.colorSpace,R.isXRRenderTarget===!0),H=U(R);n.renderbufferStorageMultisample(n.RENDERBUFFER,H,B,R.width,R.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+pe,n.RENDERBUFFER,z.__webglColorRenderbuffer[pe])}n.bindRenderbuffer(n.RENDERBUFFER,null),R.depthBuffer&&(z.__webglDepthRenderbuffer=n.createRenderbuffer(),Ie(z.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ee){t.bindTexture(n.TEXTURE_CUBE_MAP,te.__webglTexture),we(n.TEXTURE_CUBE_MAP,S);for(let pe=0;pe<6;pe++)if(S.mipmaps&&S.mipmaps.length>0)for(let Me=0;Me<S.mipmaps.length;Me++)Se(z.__webglFramebuffer[pe][Me],R,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Me);else Se(z.__webglFramebuffer[pe],R,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0);g(S)&&p(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ae){for(let pe=0,Me=oe.length;pe<Me;pe++){const A=oe[pe],C=i.get(A);let B=n.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(B=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(B,C.__webglTexture),we(B,A),Se(z.__webglFramebuffer,R,A,n.COLOR_ATTACHMENT0+pe,B,0),g(A)&&p(B)}t.unbindTexture()}else{let pe=n.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(pe=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(pe,te.__webglTexture),we(pe,S),S.mipmaps&&S.mipmaps.length>0)for(let Me=0;Me<S.mipmaps.length;Me++)Se(z.__webglFramebuffer[Me],R,S,n.COLOR_ATTACHMENT0,pe,Me);else Se(z.__webglFramebuffer,R,S,n.COLOR_ATTACHMENT0,pe,0);g(S)&&p(pe),t.unbindTexture()}R.depthBuffer&&$e(R)}function Xe(R){const S=R.textures;for(let z=0,te=S.length;z<te;z++){const oe=S[z];if(g(oe)){const ee=x(R),Ae=i.get(oe).__webglTexture;t.bindTexture(ee,Ae),p(ee),t.unbindTexture()}}}const Je=[],ke=[];function pt(R){if(R.samples>0){if(mt(R)===!1){const S=R.textures,z=R.width,te=R.height;let oe=n.COLOR_BUFFER_BIT;const ee=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ae=i.get(R),pe=S.length>1;if(pe)for(let A=0;A<S.length;A++)t.bindFramebuffer(n.FRAMEBUFFER,Ae.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+A,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Ae.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+A,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Ae.__webglMultisampledFramebuffer);const Me=R.texture.mipmaps;Me&&Me.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ae.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ae.__webglFramebuffer);for(let A=0;A<S.length;A++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(oe|=n.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(oe|=n.STENCIL_BUFFER_BIT)),pe){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Ae.__webglColorRenderbuffer[A]);const C=i.get(S[A]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,C,0)}n.blitFramebuffer(0,0,z,te,0,0,z,te,oe,n.NEAREST),l===!0&&(Je.length=0,ke.length=0,Je.push(n.COLOR_ATTACHMENT0+A),R.depthBuffer&&R.resolveDepthBuffer===!1&&(Je.push(ee),ke.push(ee),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,ke)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Je))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),pe)for(let A=0;A<S.length;A++){t.bindFramebuffer(n.FRAMEBUFFER,Ae.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+A,n.RENDERBUFFER,Ae.__webglColorRenderbuffer[A]);const C=i.get(S[A]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Ae.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+A,n.TEXTURE_2D,C,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ae.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){const S=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[S])}}}function U(R){return Math.min(s.maxSamples,R.samples)}function mt(R){const S=i.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function je(R){const S=a.render.frame;h.get(R)!==S&&(h.set(R,S),R.update())}function Qe(R,S){const z=R.colorSpace,te=R.format,oe=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||z!==ys&&z!==Tn&&(qe.getTransfer(z)===it?(te!==hi||oe!==Mi)&&Ue("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ke("WebGLTextures: Unsupported texture color space:",z)),S}function Te(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=F,this.resetTextureUnits=k,this.setTexture2D=q,this.setTexture2DArray=G,this.setTexture3D=V,this.setTextureCube=Q,this.rebindTextures=Mt,this.setupRenderTarget=Ge,this.updateRenderTargetMipmap=Xe,this.updateMultisampleRenderTarget=pt,this.setupDepthRenderbuffer=$e,this.setupFrameBufferTexture=Se,this.useMultisampledRTT=mt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function ME(n,e){function t(i,s=Tn){let r;const a=qe.getTransfer(s);if(i===Mi)return n.UNSIGNED_BYTE;if(i===lu)return n.UNSIGNED_SHORT_4_4_4_4;if(i===cu)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Tm)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Am)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===bm)return n.BYTE;if(i===Em)return n.SHORT;if(i===ga)return n.UNSIGNED_SHORT;if(i===ou)return n.INT;if(i===Yi)return n.UNSIGNED_INT;if(i===Di)return n.FLOAT;if(i===hn)return n.HALF_FLOAT;if(i===Pm)return n.ALPHA;if(i===Cm)return n.RGB;if(i===hi)return n.RGBA;if(i===un)return n.DEPTH_COMPONENT;if(i===os)return n.DEPTH_STENCIL;if(i===Rm)return n.RED;if(i===hu)return n.RED_INTEGER;if(i===xr)return n.RG;if(i===uu)return n.RG_INTEGER;if(i===fu)return n.RGBA_INTEGER;if(i===Mo||i===bo||i===Eo||i===To)if(a===it)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Mo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===bo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Eo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===To)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Mo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===bo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Eo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===To)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Oc||i===Uc||i===Fc||i===kc)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Oc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Uc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Fc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===kc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Bc||i===zc||i===Vc||i===Hc||i===$c||i===Gc||i===Wc)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Bc||i===zc)return a===it?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Vc)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===Hc)return r.COMPRESSED_R11_EAC;if(i===$c)return r.COMPRESSED_SIGNED_R11_EAC;if(i===Gc)return r.COMPRESSED_RG11_EAC;if(i===Wc)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===qc||i===Xc||i===jc||i===Yc||i===Kc||i===Zc||i===Jc||i===Qc||i===eh||i===th||i===ih||i===nh||i===sh||i===rh)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===qc)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Xc)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===jc)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Yc)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Kc)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Zc)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Jc)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Qc)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===eh)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===th)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===ih)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===nh)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===sh)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===rh)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===ah||i===oh||i===lh)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===ah)return a===it?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===oh)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===lh)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===ch||i===hh||i===uh||i===fh)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===ch)return r.COMPRESSED_RED_RGTC1_EXT;if(i===hh)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===uh)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===fh)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===_a?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const bE=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,EE=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class TE{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new $m(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new mi({vertexShader:bE,fragmentShader:EE,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new At(new Xt(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class AE extends Ir{constructor(e,t){super();const i=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,f=null,d=null,_=null;const m=typeof XRWebGLBinding<"u",g=new TE,p={},x=t.getContextAttributes();let M=null,y=null;const w=[],E=[],P=new Pe;let L=null;const v=new wi;v.viewport=new yt;const b=new wi;b.viewport=new yt;const N=[v,b],k=new FS;let F=null,Y=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ne){let le=w[ne];return le===void 0&&(le=new Ul,w[ne]=le),le.getTargetRaySpace()},this.getControllerGrip=function(ne){let le=w[ne];return le===void 0&&(le=new Ul,w[ne]=le),le.getGripSpace()},this.getHand=function(ne){let le=w[ne];return le===void 0&&(le=new Ul,w[ne]=le),le.getHandSpace()};function q(ne){const le=E.indexOf(ne.inputSource);if(le===-1)return;const Se=w[le];Se!==void 0&&(Se.update(ne.inputSource,ne.frame,c||a),Se.dispatchEvent({type:ne.type,data:ne.inputSource}))}function G(){s.removeEventListener("select",q),s.removeEventListener("selectstart",q),s.removeEventListener("selectend",q),s.removeEventListener("squeeze",q),s.removeEventListener("squeezestart",q),s.removeEventListener("squeezeend",q),s.removeEventListener("end",G),s.removeEventListener("inputsourceschange",V);for(let ne=0;ne<w.length;ne++){const le=E[ne];le!==null&&(E[ne]=null,w[ne].disconnect(le))}F=null,Y=null,g.reset();for(const ne in p)delete p[ne];e.setRenderTarget(M),d=null,f=null,u=null,s=null,y=null,Fe.stop(),i.isPresenting=!1,e.setPixelRatio(L),e.setSize(P.width,P.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(ne){r=ne,i.isPresenting===!0&&Ue("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ne){o=ne,i.isPresenting===!0&&Ue("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(ne){c=ne},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u===null&&m&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return _},this.getSession=function(){return s},this.setSession=async function(ne){if(s=ne,s!==null){if(M=e.getRenderTarget(),s.addEventListener("select",q),s.addEventListener("selectstart",q),s.addEventListener("selectend",q),s.addEventListener("squeeze",q),s.addEventListener("squeezestart",q),s.addEventListener("squeezeend",q),s.addEventListener("end",G),s.addEventListener("inputsourceschange",V),x.xrCompatible!==!0&&await t.makeXRCompatible(),L=e.getPixelRatio(),e.getSize(P),m&&"createProjectionLayer"in XRWebGLBinding.prototype){let Se=null,Ie=null,ge=null;x.depth&&(ge=x.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Se=x.stencil?os:un,Ie=x.stencil?_a:Yi);const $e={colorFormat:t.RGBA8,depthFormat:ge,scaleFactor:r};u=this.getBinding(),f=u.createProjectionLayer($e),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),y=new Ti(f.textureWidth,f.textureHeight,{format:hi,type:Mi,depthTexture:new ya(f.textureWidth,f.textureHeight,Ie,void 0,void 0,void 0,void 0,void 0,void 0,Se),stencilBuffer:x.stencil,colorSpace:e.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const Se={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,t,Se),s.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),y=new Ti(d.framebufferWidth,d.framebufferHeight,{format:hi,type:Mi,colorSpace:e.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Fe.setContext(s),Fe.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function V(ne){for(let le=0;le<ne.removed.length;le++){const Se=ne.removed[le],Ie=E.indexOf(Se);Ie>=0&&(E[Ie]=null,w[Ie].disconnect(Se))}for(let le=0;le<ne.added.length;le++){const Se=ne.added[le];let Ie=E.indexOf(Se);if(Ie===-1){for(let $e=0;$e<w.length;$e++)if($e>=E.length){E.push(Se),Ie=$e;break}else if(E[$e]===null){E[$e]=Se,Ie=$e;break}if(Ie===-1)break}const ge=w[Ie];ge&&ge.connect(Se)}}const Q=new j,he=new j;function ae(ne,le,Se){Q.setFromMatrixPosition(le.matrixWorld),he.setFromMatrixPosition(Se.matrixWorld);const Ie=Q.distanceTo(he),ge=le.projectionMatrix.elements,$e=Se.projectionMatrix.elements,Mt=ge[14]/(ge[10]-1),Ge=ge[14]/(ge[10]+1),Xe=(ge[9]+1)/ge[5],Je=(ge[9]-1)/ge[5],ke=(ge[8]-1)/ge[0],pt=($e[8]+1)/$e[0],U=Mt*ke,mt=Mt*pt,je=Ie/(-ke+pt),Qe=je*-ke;if(le.matrixWorld.decompose(ne.position,ne.quaternion,ne.scale),ne.translateX(Qe),ne.translateZ(je),ne.matrixWorld.compose(ne.position,ne.quaternion,ne.scale),ne.matrixWorldInverse.copy(ne.matrixWorld).invert(),ge[10]===-1)ne.projectionMatrix.copy(le.projectionMatrix),ne.projectionMatrixInverse.copy(le.projectionMatrixInverse);else{const Te=Mt+je,R=Ge+je,S=U-Qe,z=mt+(Ie-Qe),te=Xe*Ge/R*Te,oe=Je*Ge/R*Te;ne.projectionMatrix.makePerspective(S,z,te,oe,Te,R),ne.projectionMatrixInverse.copy(ne.projectionMatrix).invert()}}function ue(ne,le){le===null?ne.matrixWorld.copy(ne.matrix):ne.matrixWorld.multiplyMatrices(le.matrixWorld,ne.matrix),ne.matrixWorldInverse.copy(ne.matrixWorld).invert()}this.updateCamera=function(ne){if(s===null)return;let le=ne.near,Se=ne.far;g.texture!==null&&(g.depthNear>0&&(le=g.depthNear),g.depthFar>0&&(Se=g.depthFar)),k.near=b.near=v.near=le,k.far=b.far=v.far=Se,(F!==k.near||Y!==k.far)&&(s.updateRenderState({depthNear:k.near,depthFar:k.far}),F=k.near,Y=k.far),k.layers.mask=ne.layers.mask|6,v.layers.mask=k.layers.mask&3,b.layers.mask=k.layers.mask&5;const Ie=ne.parent,ge=k.cameras;ue(k,Ie);for(let $e=0;$e<ge.length;$e++)ue(ge[$e],Ie);ge.length===2?ae(k,v,b):k.projectionMatrix.copy(v.projectionMatrix),we(ne,k,Ie)};function we(ne,le,Se){Se===null?ne.matrix.copy(le.matrixWorld):(ne.matrix.copy(Se.matrixWorld),ne.matrix.invert(),ne.matrix.multiply(le.matrixWorld)),ne.matrix.decompose(ne.position,ne.quaternion,ne.scale),ne.updateMatrixWorld(!0),ne.projectionMatrix.copy(le.projectionMatrix),ne.projectionMatrixInverse.copy(le.projectionMatrixInverse),ne.isPerspectiveCamera&&(ne.fov=Sa*2*Math.atan(1/ne.projectionMatrix.elements[5]),ne.zoom=1)}this.getCamera=function(){return k},this.getFoveation=function(){if(!(f===null&&d===null))return l},this.setFoveation=function(ne){l=ne,f!==null&&(f.fixedFoveation=ne),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=ne)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(k)},this.getCameraTexture=function(ne){return p[ne]};let Ee=null;function Ne(ne,le){if(h=le.getViewerPose(c||a),_=le,h!==null){const Se=h.views;d!==null&&(e.setRenderTargetFramebuffer(y,d.framebuffer),e.setRenderTarget(y));let Ie=!1;Se.length!==k.cameras.length&&(k.cameras.length=0,Ie=!0);for(let Ge=0;Ge<Se.length;Ge++){const Xe=Se[Ge];let Je=null;if(d!==null)Je=d.getViewport(Xe);else{const pt=u.getViewSubImage(f,Xe);Je=pt.viewport,Ge===0&&(e.setRenderTargetTextures(y,pt.colorTexture,pt.depthStencilTexture),e.setRenderTarget(y))}let ke=N[Ge];ke===void 0&&(ke=new wi,ke.layers.enable(Ge),ke.viewport=new yt,N[Ge]=ke),ke.matrix.fromArray(Xe.transform.matrix),ke.matrix.decompose(ke.position,ke.quaternion,ke.scale),ke.projectionMatrix.fromArray(Xe.projectionMatrix),ke.projectionMatrixInverse.copy(ke.projectionMatrix).invert(),ke.viewport.set(Je.x,Je.y,Je.width,Je.height),Ge===0&&(k.matrix.copy(ke.matrix),k.matrix.decompose(k.position,k.quaternion,k.scale)),Ie===!0&&k.cameras.push(ke)}const ge=s.enabledFeatures;if(ge&&ge.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&m){u=i.getBinding();const Ge=u.getDepthInformation(Se[0]);Ge&&Ge.isValid&&Ge.texture&&g.init(Ge,s.renderState)}if(ge&&ge.includes("camera-access")&&m){e.state.unbindTexture(),u=i.getBinding();for(let Ge=0;Ge<Se.length;Ge++){const Xe=Se[Ge].camera;if(Xe){let Je=p[Xe];Je||(Je=new $m,p[Xe]=Je);const ke=u.getCameraImage(Xe);Je.sourceTexture=ke}}}}for(let Se=0;Se<w.length;Se++){const Ie=E[Se],ge=w[Se];Ie!==null&&ge!==void 0&&ge.update(Ie,le,c||a)}Ee&&Ee(ne,le),le.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:le}),_=null}const Fe=new Gm;Fe.setAnimationLoop(Ne),this.setAnimationLoop=function(ne){Ee=ne},this.dispose=function(){}}}const Yn=new fn,PE=new Tt;function CE(n,e){function t(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function i(g,p){p.color.getRGB(g.fogColor.value,Fm(n)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,x,M,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(g,p):p.isMeshToonMaterial?(r(g,p),u(g,p)):p.isMeshPhongMaterial?(r(g,p),h(g,p)):p.isMeshStandardMaterial?(r(g,p),f(g,p),p.isMeshPhysicalMaterial&&d(g,p,y)):p.isMeshMatcapMaterial?(r(g,p),_(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),m(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(a(g,p),p.isLineDashedMaterial&&o(g,p)):p.isPointsMaterial?l(g,p,x,M):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,t(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===Jt&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,t(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===Jt&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,t(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,t(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const x=e.get(p),M=x.envMap,y=x.envMapRotation;M&&(g.envMap.value=M,Yn.copy(y),Yn.x*=-1,Yn.y*=-1,Yn.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(Yn.y*=-1,Yn.z*=-1),g.envMapRotation.value.setFromMatrix4(PE.makeRotationFromEuler(Yn)),g.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,g.aoMapTransform))}function a(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform))}function o(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,x,M){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*x,g.scale.value=M*.5,p.map&&(g.map.value=p.map,t(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function f(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function d(g,p,x){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Jt&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=x.texture,g.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,g.specularIntensityMapTransform))}function _(g,p){p.matcap&&(g.matcap.value=p.matcap)}function m(g,p){const x=e.get(p).light;g.referencePosition.value.setFromMatrixPosition(x.matrixWorld),g.nearDistance.value=x.shadow.camera.near,g.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function RE(n,e,t,i){let s={},r={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,M){const y=M.program;i.uniformBlockBinding(x,y)}function c(x,M){let y=s[x.id];y===void 0&&(_(x),y=h(x),s[x.id]=y,x.addEventListener("dispose",g));const w=M.program;i.updateUBOMapping(x,w);const E=e.render.frame;r[x.id]!==E&&(f(x),r[x.id]=E)}function h(x){const M=u();x.__bindingPointIndex=M;const y=n.createBuffer(),w=x.__size,E=x.usage;return n.bindBuffer(n.UNIFORM_BUFFER,y),n.bufferData(n.UNIFORM_BUFFER,w,E),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,M,y),y}function u(){for(let x=0;x<o;x++)if(a.indexOf(x)===-1)return a.push(x),x;return Ke("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(x){const M=s[x.id],y=x.uniforms,w=x.__cache;n.bindBuffer(n.UNIFORM_BUFFER,M);for(let E=0,P=y.length;E<P;E++){const L=Array.isArray(y[E])?y[E]:[y[E]];for(let v=0,b=L.length;v<b;v++){const N=L[v];if(d(N,E,v,w)===!0){const k=N.__offset,F=Array.isArray(N.value)?N.value:[N.value];let Y=0;for(let q=0;q<F.length;q++){const G=F[q],V=m(G);typeof G=="number"||typeof G=="boolean"?(N.__data[0]=G,n.bufferSubData(n.UNIFORM_BUFFER,k+Y,N.__data)):G.isMatrix3?(N.__data[0]=G.elements[0],N.__data[1]=G.elements[1],N.__data[2]=G.elements[2],N.__data[3]=0,N.__data[4]=G.elements[3],N.__data[5]=G.elements[4],N.__data[6]=G.elements[5],N.__data[7]=0,N.__data[8]=G.elements[6],N.__data[9]=G.elements[7],N.__data[10]=G.elements[8],N.__data[11]=0):(G.toArray(N.__data,Y),Y+=V.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,k,N.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function d(x,M,y,w){const E=x.value,P=M+"_"+y;if(w[P]===void 0)return typeof E=="number"||typeof E=="boolean"?w[P]=E:w[P]=E.clone(),!0;{const L=w[P];if(typeof E=="number"||typeof E=="boolean"){if(L!==E)return w[P]=E,!0}else if(L.equals(E)===!1)return L.copy(E),!0}return!1}function _(x){const M=x.uniforms;let y=0;const w=16;for(let P=0,L=M.length;P<L;P++){const v=Array.isArray(M[P])?M[P]:[M[P]];for(let b=0,N=v.length;b<N;b++){const k=v[b],F=Array.isArray(k.value)?k.value:[k.value];for(let Y=0,q=F.length;Y<q;Y++){const G=F[Y],V=m(G),Q=y%w,he=Q%V.boundary,ae=Q+he;y+=he,ae!==0&&w-ae<V.storage&&(y+=w-ae),k.__data=new Float32Array(V.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=y,y+=V.storage}}}const E=y%w;return E>0&&(y+=w-E),x.__size=y,x.__cache={},this}function m(x){const M={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(M.boundary=4,M.storage=4):x.isVector2?(M.boundary=8,M.storage=8):x.isVector3||x.isColor?(M.boundary=16,M.storage=12):x.isVector4?(M.boundary=16,M.storage=16):x.isMatrix3?(M.boundary=48,M.storage=48):x.isMatrix4?(M.boundary=64,M.storage=64):x.isTexture?Ue("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Ue("WebGLRenderer: Unsupported uniform value type.",x),M}function g(x){const M=x.target;M.removeEventListener("dispose",g);const y=a.indexOf(M.__bindingPointIndex);a.splice(y,1),n.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function p(){for(const x in s)n.deleteBuffer(s[x]);a=[],s={},r={}}return{bind:l,update:c,dispose:p}}const LE=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let ki=null;function IE(){return ki===null&&(ki=new AS(LE,16,16,xr,hn),ki.name="DFG_LUT",ki.minFilter=vt,ki.magFilter=vt,ki.wrapS=Ii,ki.wrapT=Ii,ki.generateMipmaps=!1,ki.needsUpdate=!0),ki}class DE{constructor(e={}){const{canvas:t=kx(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1,outputBufferType:d=Mi}=e;this.isWebGLRenderer=!0;let _;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");_=i.getContextAttributes().alpha}else _=a;const m=d,g=new Set([fu,uu,hu]),p=new Set([Mi,Yi,ga,_a,lu,cu]),x=new Uint32Array(4),M=new Int32Array(4);let y=null,w=null;const E=[],P=[];let L=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=qi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const v=this;let b=!1;this._outputColorSpace=yi;let N=0,k=0,F=null,Y=-1,q=null;const G=new yt,V=new yt;let Q=null;const he=new Ze(0);let ae=0,ue=t.width,we=t.height,Ee=1,Ne=null,Fe=null;const ne=new yt(0,0,ue,we),le=new yt(0,0,ue,we);let Se=!1;const Ie=new Vm;let ge=!1,$e=!1;const Mt=new Tt,Ge=new j,Xe=new yt,Je={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ke=!1;function pt(){return F===null?Ee:1}let U=i;function mt(T,$){return t.getContext(T,$)}try{const T={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${au}`),t.addEventListener("webglcontextlost",Oe,!1),t.addEventListener("webglcontextrestored",ot,!1),t.addEventListener("webglcontextcreationerror",et,!1),U===null){const $="webgl2";if(U=mt($,T),U===null)throw mt($)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw Ke("WebGLRenderer: "+T.message),T}let je,Qe,Te,R,S,z,te,oe,ee,Ae,pe,Me,A,C,B,H,Z,J,de,O,ce,se,fe,re;function ie(){je=new IM(U),je.init(),se=new ME(U,je),Qe=new MM(U,je,e,se),Te=new yE(U,je),Qe.reversedDepthBuffer&&f&&Te.buffers.depth.setReversed(!0),R=new OM(U),S=new aE,z=new wE(U,je,Te,S,Qe,se,R),te=new EM(v),oe=new LM(v),ee=new BS(U),fe=new yM(U,ee),Ae=new DM(U,ee,R,fe),pe=new FM(U,Ae,ee,R),de=new UM(U,Qe,z),H=new bM(S),Me=new rE(v,te,oe,je,Qe,fe,H),A=new CE(v,S),C=new lE,B=new pE(je),J=new SM(v,te,oe,Te,pe,_,l),Z=new xE(v,pe,Qe),re=new RE(U,R,Qe,Te),O=new wM(U,je,R),ce=new NM(U,je,R),R.programs=Me.programs,v.capabilities=Qe,v.extensions=je,v.properties=S,v.renderLists=C,v.shadowMap=Z,v.state=Te,v.info=R}ie(),m!==Mi&&(L=new BM(m,t.width,t.height,s,r));const me=new AE(v,U);this.xr=me,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const T=je.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=je.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return Ee},this.setPixelRatio=function(T){T!==void 0&&(Ee=T,this.setSize(ue,we,!1))},this.getSize=function(T){return T.set(ue,we)},this.setSize=function(T,$,K=!0){if(me.isPresenting){Ue("WebGLRenderer: Can't change size while VR device is presenting.");return}ue=T,we=$,t.width=Math.floor(T*Ee),t.height=Math.floor($*Ee),K===!0&&(t.style.width=T+"px",t.style.height=$+"px"),L!==null&&L.setSize(t.width,t.height),this.setViewport(0,0,T,$)},this.getDrawingBufferSize=function(T){return T.set(ue*Ee,we*Ee).floor()},this.setDrawingBufferSize=function(T,$,K){ue=T,we=$,Ee=K,t.width=Math.floor(T*K),t.height=Math.floor($*K),this.setViewport(0,0,T,$)},this.setEffects=function(T){if(m===Mi){console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(T){for(let $=0;$<T.length;$++)if(T[$].isOutputPass===!0){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}L.setEffects(T||[])},this.getCurrentViewport=function(T){return T.copy(G)},this.getViewport=function(T){return T.copy(ne)},this.setViewport=function(T,$,K,X){T.isVector4?ne.set(T.x,T.y,T.z,T.w):ne.set(T,$,K,X),Te.viewport(G.copy(ne).multiplyScalar(Ee).round())},this.getScissor=function(T){return T.copy(le)},this.setScissor=function(T,$,K,X){T.isVector4?le.set(T.x,T.y,T.z,T.w):le.set(T,$,K,X),Te.scissor(V.copy(le).multiplyScalar(Ee).round())},this.getScissorTest=function(){return Se},this.setScissorTest=function(T){Te.setScissorTest(Se=T)},this.setOpaqueSort=function(T){Ne=T},this.setTransparentSort=function(T){Fe=T},this.getClearColor=function(T){return T.copy(J.getClearColor())},this.setClearColor=function(){J.setClearColor(...arguments)},this.getClearAlpha=function(){return J.getClearAlpha()},this.setClearAlpha=function(){J.setClearAlpha(...arguments)},this.clear=function(T=!0,$=!0,K=!0){let X=0;if(T){let W=!1;if(F!==null){const _e=F.texture.format;W=g.has(_e)}if(W){const _e=F.texture.type,ye=p.has(_e),xe=J.getClearColor(),be=J.getClearAlpha(),Ce=xe.r,De=xe.g,Re=xe.b;ye?(x[0]=Ce,x[1]=De,x[2]=Re,x[3]=be,U.clearBufferuiv(U.COLOR,0,x)):(M[0]=Ce,M[1]=De,M[2]=Re,M[3]=be,U.clearBufferiv(U.COLOR,0,M))}else X|=U.COLOR_BUFFER_BIT}$&&(X|=U.DEPTH_BUFFER_BIT),K&&(X|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Oe,!1),t.removeEventListener("webglcontextrestored",ot,!1),t.removeEventListener("webglcontextcreationerror",et,!1),J.dispose(),C.dispose(),B.dispose(),S.dispose(),te.dispose(),oe.dispose(),pe.dispose(),fe.dispose(),re.dispose(),Me.dispose(),me.dispose(),me.removeEventListener("sessionstart",Gu),me.removeEventListener("sessionend",Wu),Hn.stop()};function Oe(T){T.preventDefault(),yf("WebGLRenderer: Context Lost."),b=!0}function ot(){yf("WebGLRenderer: Context Restored."),b=!1;const T=R.autoReset,$=Z.enabled,K=Z.autoUpdate,X=Z.needsUpdate,W=Z.type;ie(),R.autoReset=T,Z.enabled=$,Z.autoUpdate=K,Z.needsUpdate=X,Z.type=W}function et(T){Ke("WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function Fi(T){const $=T.target;$.removeEventListener("dispose",Fi),Zi($)}function Zi(T){m_(T),S.remove(T)}function m_(T){const $=S.get(T).programs;$!==void 0&&($.forEach(function(K){Me.releaseProgram(K)}),T.isShaderMaterial&&Me.releaseShaderCache(T))}this.renderBufferDirect=function(T,$,K,X,W,_e){$===null&&($=Je);const ye=W.isMesh&&W.matrixWorld.determinant()<0,xe=__(T,$,K,X,W);Te.setMaterial(X,ye);let be=K.index,Ce=1;if(X.wireframe===!0){if(be=Ae.getWireframeAttribute(K),be===void 0)return;Ce=2}const De=K.drawRange,Re=K.attributes.position;let Ve=De.start*Ce,nt=(De.start+De.count)*Ce;_e!==null&&(Ve=Math.max(Ve,_e.start*Ce),nt=Math.min(nt,(_e.start+_e.count)*Ce)),be!==null?(Ve=Math.max(Ve,0),nt=Math.min(nt,be.count)):Re!=null&&(Ve=Math.max(Ve,0),nt=Math.min(nt,Re.count));const gt=nt-Ve;if(gt<0||gt===1/0)return;fe.setup(W,X,xe,K,be);let _t,st=O;if(be!==null&&(_t=ee.get(be),st=ce,st.setIndex(_t)),W.isMesh)X.wireframe===!0?(Te.setLineWidth(X.wireframeLinewidth*pt()),st.setMode(U.LINES)):st.setMode(U.TRIANGLES);else if(W.isLine){let Le=X.linewidth;Le===void 0&&(Le=1),Te.setLineWidth(Le*pt()),W.isLineSegments?st.setMode(U.LINES):W.isLineLoop?st.setMode(U.LINE_LOOP):st.setMode(U.LINE_STRIP)}else W.isPoints?st.setMode(U.POINTS):W.isSprite&&st.setMode(U.TRIANGLES);if(W.isBatchedMesh)if(W._multiDrawInstances!==null)xa("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),st.renderMultiDrawInstances(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount,W._multiDrawInstances);else if(je.get("WEBGL_multi_draw"))st.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{const Le=W._multiDrawStarts,tt=W._multiDrawCounts,Ye=W._multiDrawCount,si=be?ee.get(be).bytesPerElement:1,Ts=S.get(X).currentProgram.getUniforms();for(let ri=0;ri<Ye;ri++)Ts.setValue(U,"_gl_DrawID",ri),st.render(Le[ri]/si,tt[ri])}else if(W.isInstancedMesh)st.renderInstances(Ve,gt,W.count);else if(K.isInstancedBufferGeometry){const Le=K._maxInstanceCount!==void 0?K._maxInstanceCount:1/0,tt=Math.min(K.instanceCount,Le);st.renderInstances(Ve,gt,tt)}else st.render(Ve,gt)};function $u(T,$,K){T.transparent===!0&&T.side===Nt&&T.forceSinglePass===!1?(T.side=Jt,T.needsUpdate=!0,ka(T,$,K),T.side=On,T.needsUpdate=!0,ka(T,$,K),T.side=Nt):ka(T,$,K)}this.compile=function(T,$,K=null){K===null&&(K=T),w=B.get(K),w.init($),P.push(w),K.traverseVisible(function(W){W.isLight&&W.layers.test($.layers)&&(w.pushLight(W),W.castShadow&&w.pushShadow(W))}),T!==K&&T.traverseVisible(function(W){W.isLight&&W.layers.test($.layers)&&(w.pushLight(W),W.castShadow&&w.pushShadow(W))}),w.setupLights();const X=new Set;return T.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;const _e=W.material;if(_e)if(Array.isArray(_e))for(let ye=0;ye<_e.length;ye++){const xe=_e[ye];$u(xe,K,W),X.add(xe)}else $u(_e,K,W),X.add(_e)}),w=P.pop(),X},this.compileAsync=function(T,$,K=null){const X=this.compile(T,$,K);return new Promise(W=>{function _e(){if(X.forEach(function(ye){S.get(ye).currentProgram.isReady()&&X.delete(ye)}),X.size===0){W(T);return}setTimeout(_e,10)}je.get("KHR_parallel_shader_compile")!==null?_e():setTimeout(_e,10)})};let ll=null;function g_(T){ll&&ll(T)}function Gu(){Hn.stop()}function Wu(){Hn.start()}const Hn=new Gm;Hn.setAnimationLoop(g_),typeof self<"u"&&Hn.setContext(self),this.setAnimationLoop=function(T){ll=T,me.setAnimationLoop(T),T===null?Hn.stop():Hn.start()},me.addEventListener("sessionstart",Gu),me.addEventListener("sessionend",Wu),this.render=function(T,$){if($!==void 0&&$.isCamera!==!0){Ke("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(b===!0)return;const K=me.enabled===!0&&me.isPresenting===!0,X=L!==null&&(F===null||K)&&L.begin(v,F);if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),$.parent===null&&$.matrixWorldAutoUpdate===!0&&$.updateMatrixWorld(),me.enabled===!0&&me.isPresenting===!0&&(L===null||L.isCompositing()===!1)&&(me.cameraAutoUpdate===!0&&me.updateCamera($),$=me.getCamera()),T.isScene===!0&&T.onBeforeRender(v,T,$,F),w=B.get(T,P.length),w.init($),P.push(w),Mt.multiplyMatrices($.projectionMatrix,$.matrixWorldInverse),Ie.setFromProjectionMatrix(Mt,$i,$.reversedDepth),$e=this.localClippingEnabled,ge=H.init(this.clippingPlanes,$e),y=C.get(T,E.length),y.init(),E.push(y),me.enabled===!0&&me.isPresenting===!0){const ye=v.xr.getDepthSensingMesh();ye!==null&&cl(ye,$,-1/0,v.sortObjects)}cl(T,$,0,v.sortObjects),y.finish(),v.sortObjects===!0&&y.sort(Ne,Fe),ke=me.enabled===!1||me.isPresenting===!1||me.hasDepthSensing()===!1,ke&&J.addToRenderList(y,T),this.info.render.frame++,ge===!0&&H.beginShadows();const W=w.state.shadowsArray;if(Z.render(W,T,$),ge===!0&&H.endShadows(),this.info.autoReset===!0&&this.info.reset(),(X&&L.hasRenderPass())===!1){const ye=y.opaque,xe=y.transmissive;if(w.setupLights(),$.isArrayCamera){const be=$.cameras;if(xe.length>0)for(let Ce=0,De=be.length;Ce<De;Ce++){const Re=be[Ce];Xu(ye,xe,T,Re)}ke&&J.render(T);for(let Ce=0,De=be.length;Ce<De;Ce++){const Re=be[Ce];qu(y,T,Re,Re.viewport)}}else xe.length>0&&Xu(ye,xe,T,$),ke&&J.render(T),qu(y,T,$)}F!==null&&k===0&&(z.updateMultisampleRenderTarget(F),z.updateRenderTargetMipmap(F)),X&&L.end(v),T.isScene===!0&&T.onAfterRender(v,T,$),fe.resetDefaultState(),Y=-1,q=null,P.pop(),P.length>0?(w=P[P.length-1],ge===!0&&H.setGlobalState(v.clippingPlanes,w.state.camera)):w=null,E.pop(),E.length>0?y=E[E.length-1]:y=null};function cl(T,$,K,X){if(T.visible===!1)return;if(T.layers.test($.layers)){if(T.isGroup)K=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update($);else if(T.isLight)w.pushLight(T),T.castShadow&&w.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||Ie.intersectsSprite(T)){X&&Xe.setFromMatrixPosition(T.matrixWorld).applyMatrix4(Mt);const ye=pe.update(T),xe=T.material;xe.visible&&y.push(T,ye,xe,K,Xe.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||Ie.intersectsObject(T))){const ye=pe.update(T),xe=T.material;if(X&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Xe.copy(T.boundingSphere.center)):(ye.boundingSphere===null&&ye.computeBoundingSphere(),Xe.copy(ye.boundingSphere.center)),Xe.applyMatrix4(T.matrixWorld).applyMatrix4(Mt)),Array.isArray(xe)){const be=ye.groups;for(let Ce=0,De=be.length;Ce<De;Ce++){const Re=be[Ce],Ve=xe[Re.materialIndex];Ve&&Ve.visible&&y.push(T,ye,Ve,K,Xe.z,Re)}}else xe.visible&&y.push(T,ye,xe,K,Xe.z,null)}}const _e=T.children;for(let ye=0,xe=_e.length;ye<xe;ye++)cl(_e[ye],$,K,X)}function qu(T,$,K,X){const{opaque:W,transmissive:_e,transparent:ye}=T;w.setupLightsView(K),ge===!0&&H.setGlobalState(v.clippingPlanes,K),X&&Te.viewport(G.copy(X)),W.length>0&&Fa(W,$,K),_e.length>0&&Fa(_e,$,K),ye.length>0&&Fa(ye,$,K),Te.buffers.depth.setTest(!0),Te.buffers.depth.setMask(!0),Te.buffers.color.setMask(!0),Te.setPolygonOffset(!1)}function Xu(T,$,K,X){if((K.isScene===!0?K.overrideMaterial:null)!==null)return;if(w.state.transmissionRenderTarget[X.id]===void 0){const Ve=je.has("EXT_color_buffer_half_float")||je.has("EXT_color_buffer_float");w.state.transmissionRenderTarget[X.id]=new Ti(1,1,{generateMipmaps:!0,type:Ve?hn:Mi,minFilter:as,samples:Qe.samples,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:qe.workingColorSpace})}const _e=w.state.transmissionRenderTarget[X.id],ye=X.viewport||G;_e.setSize(ye.z*v.transmissionResolutionScale,ye.w*v.transmissionResolutionScale);const xe=v.getRenderTarget(),be=v.getActiveCubeFace(),Ce=v.getActiveMipmapLevel();v.setRenderTarget(_e),v.getClearColor(he),ae=v.getClearAlpha(),ae<1&&v.setClearColor(16777215,.5),v.clear(),ke&&J.render(K);const De=v.toneMapping;v.toneMapping=qi;const Re=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),w.setupLightsView(X),ge===!0&&H.setGlobalState(v.clippingPlanes,X),Fa(T,K,X),z.updateMultisampleRenderTarget(_e),z.updateRenderTargetMipmap(_e),je.has("WEBGL_multisampled_render_to_texture")===!1){let Ve=!1;for(let nt=0,gt=$.length;nt<gt;nt++){const _t=$[nt],{object:st,geometry:Le,material:tt,group:Ye}=_t;if(tt.side===Nt&&st.layers.test(X.layers)){const si=tt.side;tt.side=Jt,tt.needsUpdate=!0,ju(st,K,X,Le,tt,Ye),tt.side=si,tt.needsUpdate=!0,Ve=!0}}Ve===!0&&(z.updateMultisampleRenderTarget(_e),z.updateRenderTargetMipmap(_e))}v.setRenderTarget(xe,be,Ce),v.setClearColor(he,ae),Re!==void 0&&(X.viewport=Re),v.toneMapping=De}function Fa(T,$,K){const X=$.isScene===!0?$.overrideMaterial:null;for(let W=0,_e=T.length;W<_e;W++){const ye=T[W],{object:xe,geometry:be,group:Ce}=ye;let De=ye.material;De.allowOverride===!0&&X!==null&&(De=X),xe.layers.test(K.layers)&&ju(xe,$,K,be,De,Ce)}}function ju(T,$,K,X,W,_e){T.onBeforeRender(v,$,K,X,W,_e),T.modelViewMatrix.multiplyMatrices(K.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),W.onBeforeRender(v,$,K,X,T,_e),W.transparent===!0&&W.side===Nt&&W.forceSinglePass===!1?(W.side=Jt,W.needsUpdate=!0,v.renderBufferDirect(K,$,X,W,T,_e),W.side=On,W.needsUpdate=!0,v.renderBufferDirect(K,$,X,W,T,_e),W.side=Nt):v.renderBufferDirect(K,$,X,W,T,_e),T.onAfterRender(v,$,K,X,W,_e)}function ka(T,$,K){$.isScene!==!0&&($=Je);const X=S.get(T),W=w.state.lights,_e=w.state.shadowsArray,ye=W.state.version,xe=Me.getParameters(T,W.state,_e,$,K),be=Me.getProgramCacheKey(xe);let Ce=X.programs;X.environment=T.isMeshStandardMaterial?$.environment:null,X.fog=$.fog,X.envMap=(T.isMeshStandardMaterial?oe:te).get(T.envMap||X.environment),X.envMapRotation=X.environment!==null&&T.envMap===null?$.environmentRotation:T.envMapRotation,Ce===void 0&&(T.addEventListener("dispose",Fi),Ce=new Map,X.programs=Ce);let De=Ce.get(be);if(De!==void 0){if(X.currentProgram===De&&X.lightsStateVersion===ye)return Ku(T,xe),De}else xe.uniforms=Me.getUniforms(T),T.onBeforeCompile(xe,v),De=Me.acquireProgram(xe,be),Ce.set(be,De),X.uniforms=xe.uniforms;const Re=X.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Re.clippingPlanes=H.uniform),Ku(T,xe),X.needsLights=x_(T),X.lightsStateVersion=ye,X.needsLights&&(Re.ambientLightColor.value=W.state.ambient,Re.lightProbe.value=W.state.probe,Re.directionalLights.value=W.state.directional,Re.directionalLightShadows.value=W.state.directionalShadow,Re.spotLights.value=W.state.spot,Re.spotLightShadows.value=W.state.spotShadow,Re.rectAreaLights.value=W.state.rectArea,Re.ltc_1.value=W.state.rectAreaLTC1,Re.ltc_2.value=W.state.rectAreaLTC2,Re.pointLights.value=W.state.point,Re.pointLightShadows.value=W.state.pointShadow,Re.hemisphereLights.value=W.state.hemi,Re.directionalShadowMap.value=W.state.directionalShadowMap,Re.directionalShadowMatrix.value=W.state.directionalShadowMatrix,Re.spotShadowMap.value=W.state.spotShadowMap,Re.spotLightMatrix.value=W.state.spotLightMatrix,Re.spotLightMap.value=W.state.spotLightMap,Re.pointShadowMap.value=W.state.pointShadowMap,Re.pointShadowMatrix.value=W.state.pointShadowMatrix),X.currentProgram=De,X.uniformsList=null,De}function Yu(T){if(T.uniformsList===null){const $=T.currentProgram.getUniforms();T.uniformsList=Ao.seqWithValue($.seq,T.uniforms)}return T.uniformsList}function Ku(T,$){const K=S.get(T);K.outputColorSpace=$.outputColorSpace,K.batching=$.batching,K.batchingColor=$.batchingColor,K.instancing=$.instancing,K.instancingColor=$.instancingColor,K.instancingMorph=$.instancingMorph,K.skinning=$.skinning,K.morphTargets=$.morphTargets,K.morphNormals=$.morphNormals,K.morphColors=$.morphColors,K.morphTargetsCount=$.morphTargetsCount,K.numClippingPlanes=$.numClippingPlanes,K.numIntersection=$.numClipIntersection,K.vertexAlphas=$.vertexAlphas,K.vertexTangents=$.vertexTangents,K.toneMapping=$.toneMapping}function __(T,$,K,X,W){$.isScene!==!0&&($=Je),z.resetTextureUnits();const _e=$.fog,ye=X.isMeshStandardMaterial?$.environment:null,xe=F===null?v.outputColorSpace:F.isXRRenderTarget===!0?F.texture.colorSpace:ys,be=(X.isMeshStandardMaterial?oe:te).get(X.envMap||ye),Ce=X.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,De=!!K.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Re=!!K.morphAttributes.position,Ve=!!K.morphAttributes.normal,nt=!!K.morphAttributes.color;let gt=qi;X.toneMapped&&(F===null||F.isXRRenderTarget===!0)&&(gt=v.toneMapping);const _t=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,st=_t!==void 0?_t.length:0,Le=S.get(X),tt=w.state.lights;if(ge===!0&&($e===!0||T!==q)){const Ht=T===q&&X.id===Y;H.setState(X,T,Ht)}let Ye=!1;X.version===Le.__version?(Le.needsLights&&Le.lightsStateVersion!==tt.state.version||Le.outputColorSpace!==xe||W.isBatchedMesh&&Le.batching===!1||!W.isBatchedMesh&&Le.batching===!0||W.isBatchedMesh&&Le.batchingColor===!0&&W.colorTexture===null||W.isBatchedMesh&&Le.batchingColor===!1&&W.colorTexture!==null||W.isInstancedMesh&&Le.instancing===!1||!W.isInstancedMesh&&Le.instancing===!0||W.isSkinnedMesh&&Le.skinning===!1||!W.isSkinnedMesh&&Le.skinning===!0||W.isInstancedMesh&&Le.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&Le.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&Le.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&Le.instancingMorph===!1&&W.morphTexture!==null||Le.envMap!==be||X.fog===!0&&Le.fog!==_e||Le.numClippingPlanes!==void 0&&(Le.numClippingPlanes!==H.numPlanes||Le.numIntersection!==H.numIntersection)||Le.vertexAlphas!==Ce||Le.vertexTangents!==De||Le.morphTargets!==Re||Le.morphNormals!==Ve||Le.morphColors!==nt||Le.toneMapping!==gt||Le.morphTargetsCount!==st)&&(Ye=!0):(Ye=!0,Le.__version=X.version);let si=Le.currentProgram;Ye===!0&&(si=ka(X,$,W));let Ts=!1,ri=!1,Ur=!1;const lt=si.getUniforms(),jt=Le.uniforms;if(Te.useProgram(si.program)&&(Ts=!0,ri=!0,Ur=!0),X.id!==Y&&(Y=X.id,ri=!0),Ts||q!==T){Te.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),lt.setValue(U,"projectionMatrix",T.projectionMatrix),lt.setValue(U,"viewMatrix",T.matrixWorldInverse);const Yt=lt.map.cameraPosition;Yt!==void 0&&Yt.setValue(U,Ge.setFromMatrixPosition(T.matrixWorld)),Qe.logarithmicDepthBuffer&&lt.setValue(U,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&lt.setValue(U,"isOrthographic",T.isOrthographicCamera===!0),q!==T&&(q=T,ri=!0,Ur=!0)}if(Le.needsLights&&(tt.state.directionalShadowMap.length>0&&lt.setValue(U,"directionalShadowMap",tt.state.directionalShadowMap,z),tt.state.spotShadowMap.length>0&&lt.setValue(U,"spotShadowMap",tt.state.spotShadowMap,z),tt.state.pointShadowMap.length>0&&lt.setValue(U,"pointShadowMap",tt.state.pointShadowMap,z)),W.isSkinnedMesh){lt.setOptional(U,W,"bindMatrix"),lt.setOptional(U,W,"bindMatrixInverse");const Ht=W.skeleton;Ht&&(Ht.boneTexture===null&&Ht.computeBoneTexture(),lt.setValue(U,"boneTexture",Ht.boneTexture,z))}W.isBatchedMesh&&(lt.setOptional(U,W,"batchingTexture"),lt.setValue(U,"batchingTexture",W._matricesTexture,z),lt.setOptional(U,W,"batchingIdTexture"),lt.setValue(U,"batchingIdTexture",W._indirectTexture,z),lt.setOptional(U,W,"batchingColorTexture"),W._colorsTexture!==null&&lt.setValue(U,"batchingColorTexture",W._colorsTexture,z));const vi=K.morphAttributes;if((vi.position!==void 0||vi.normal!==void 0||vi.color!==void 0)&&de.update(W,K,si),(ri||Le.receiveShadow!==W.receiveShadow)&&(Le.receiveShadow=W.receiveShadow,lt.setValue(U,"receiveShadow",W.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(jt.envMap.value=be,jt.flipEnvMap.value=be.isCubeTexture&&be.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&$.environment!==null&&(jt.envMapIntensity.value=$.environmentIntensity),jt.dfgLUT!==void 0&&(jt.dfgLUT.value=IE()),ri&&(lt.setValue(U,"toneMappingExposure",v.toneMappingExposure),Le.needsLights&&v_(jt,Ur),_e&&X.fog===!0&&A.refreshFogUniforms(jt,_e),A.refreshMaterialUniforms(jt,X,Ee,we,w.state.transmissionRenderTarget[T.id]),Ao.upload(U,Yu(Le),jt,z)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(Ao.upload(U,Yu(Le),jt,z),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&lt.setValue(U,"center",W.center),lt.setValue(U,"modelViewMatrix",W.modelViewMatrix),lt.setValue(U,"normalMatrix",W.normalMatrix),lt.setValue(U,"modelMatrix",W.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){const Ht=X.uniformsGroups;for(let Yt=0,hl=Ht.length;Yt<hl;Yt++){const $n=Ht[Yt];re.update($n,si),re.bind($n,si)}}return si}function v_(T,$){T.ambientLightColor.needsUpdate=$,T.lightProbe.needsUpdate=$,T.directionalLights.needsUpdate=$,T.directionalLightShadows.needsUpdate=$,T.pointLights.needsUpdate=$,T.pointLightShadows.needsUpdate=$,T.spotLights.needsUpdate=$,T.spotLightShadows.needsUpdate=$,T.rectAreaLights.needsUpdate=$,T.hemisphereLights.needsUpdate=$}function x_(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return N},this.getActiveMipmapLevel=function(){return k},this.getRenderTarget=function(){return F},this.setRenderTargetTextures=function(T,$,K){const X=S.get(T);X.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,X.__autoAllocateDepthBuffer===!1&&(X.__useRenderToTexture=!1),S.get(T.texture).__webglTexture=$,S.get(T.depthTexture).__webglTexture=X.__autoAllocateDepthBuffer?void 0:K,X.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,$){const K=S.get(T);K.__webglFramebuffer=$,K.__useDefaultFramebuffer=$===void 0};const S_=U.createFramebuffer();this.setRenderTarget=function(T,$=0,K=0){F=T,N=$,k=K;let X=null,W=!1,_e=!1;if(T){const xe=S.get(T);if(xe.__useDefaultFramebuffer!==void 0){Te.bindFramebuffer(U.FRAMEBUFFER,xe.__webglFramebuffer),G.copy(T.viewport),V.copy(T.scissor),Q=T.scissorTest,Te.viewport(G),Te.scissor(V),Te.setScissorTest(Q),Y=-1;return}else if(xe.__webglFramebuffer===void 0)z.setupRenderTarget(T);else if(xe.__hasExternalTextures)z.rebindTextures(T,S.get(T.texture).__webglTexture,S.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const De=T.depthTexture;if(xe.__boundDepthTexture!==De){if(De!==null&&S.has(De)&&(T.width!==De.image.width||T.height!==De.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");z.setupDepthRenderbuffer(T)}}const be=T.texture;(be.isData3DTexture||be.isDataArrayTexture||be.isCompressedArrayTexture)&&(_e=!0);const Ce=S.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Ce[$])?X=Ce[$][K]:X=Ce[$],W=!0):T.samples>0&&z.useMultisampledRTT(T)===!1?X=S.get(T).__webglMultisampledFramebuffer:Array.isArray(Ce)?X=Ce[K]:X=Ce,G.copy(T.viewport),V.copy(T.scissor),Q=T.scissorTest}else G.copy(ne).multiplyScalar(Ee).floor(),V.copy(le).multiplyScalar(Ee).floor(),Q=Se;if(K!==0&&(X=S_),Te.bindFramebuffer(U.FRAMEBUFFER,X)&&Te.drawBuffers(T,X),Te.viewport(G),Te.scissor(V),Te.setScissorTest(Q),W){const xe=S.get(T.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+$,xe.__webglTexture,K)}else if(_e){const xe=$;for(let be=0;be<T.textures.length;be++){const Ce=S.get(T.textures[be]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+be,Ce.__webglTexture,K,xe)}}else if(T!==null&&K!==0){const xe=S.get(T.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,xe.__webglTexture,K)}Y=-1},this.readRenderTargetPixels=function(T,$,K,X,W,_e,ye,xe=0){if(!(T&&T.isWebGLRenderTarget)){Ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let be=S.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&ye!==void 0&&(be=be[ye]),be){Te.bindFramebuffer(U.FRAMEBUFFER,be);try{const Ce=T.textures[xe],De=Ce.format,Re=Ce.type;if(!Qe.textureFormatReadable(De)){Ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Qe.textureTypeReadable(Re)){Ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}$>=0&&$<=T.width-X&&K>=0&&K<=T.height-W&&(T.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+xe),U.readPixels($,K,X,W,se.convert(De),se.convert(Re),_e))}finally{const Ce=F!==null?S.get(F).__webglFramebuffer:null;Te.bindFramebuffer(U.FRAMEBUFFER,Ce)}}},this.readRenderTargetPixelsAsync=async function(T,$,K,X,W,_e,ye,xe=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let be=S.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&ye!==void 0&&(be=be[ye]),be)if($>=0&&$<=T.width-X&&K>=0&&K<=T.height-W){Te.bindFramebuffer(U.FRAMEBUFFER,be);const Ce=T.textures[xe],De=Ce.format,Re=Ce.type;if(!Qe.textureFormatReadable(De))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Qe.textureTypeReadable(Re))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ve=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,Ve),U.bufferData(U.PIXEL_PACK_BUFFER,_e.byteLength,U.STREAM_READ),T.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+xe),U.readPixels($,K,X,W,se.convert(De),se.convert(Re),0);const nt=F!==null?S.get(F).__webglFramebuffer:null;Te.bindFramebuffer(U.FRAMEBUFFER,nt);const gt=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await Bx(U,gt,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,Ve),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,_e),U.deleteBuffer(Ve),U.deleteSync(gt),_e}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,$=null,K=0){const X=Math.pow(2,-K),W=Math.floor(T.image.width*X),_e=Math.floor(T.image.height*X),ye=$!==null?$.x:0,xe=$!==null?$.y:0;z.setTexture2D(T,0),U.copyTexSubImage2D(U.TEXTURE_2D,K,0,0,ye,xe,W,_e),Te.unbindTexture()};const y_=U.createFramebuffer(),w_=U.createFramebuffer();this.copyTextureToTexture=function(T,$,K=null,X=null,W=0,_e=null){_e===null&&(W!==0?(xa("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),_e=W,W=0):_e=0);let ye,xe,be,Ce,De,Re,Ve,nt,gt;const _t=T.isCompressedTexture?T.mipmaps[_e]:T.image;if(K!==null)ye=K.max.x-K.min.x,xe=K.max.y-K.min.y,be=K.isBox3?K.max.z-K.min.z:1,Ce=K.min.x,De=K.min.y,Re=K.isBox3?K.min.z:0;else{const vi=Math.pow(2,-W);ye=Math.floor(_t.width*vi),xe=Math.floor(_t.height*vi),T.isDataArrayTexture?be=_t.depth:T.isData3DTexture?be=Math.floor(_t.depth*vi):be=1,Ce=0,De=0,Re=0}X!==null?(Ve=X.x,nt=X.y,gt=X.z):(Ve=0,nt=0,gt=0);const st=se.convert($.format),Le=se.convert($.type);let tt;$.isData3DTexture?(z.setTexture3D($,0),tt=U.TEXTURE_3D):$.isDataArrayTexture||$.isCompressedArrayTexture?(z.setTexture2DArray($,0),tt=U.TEXTURE_2D_ARRAY):(z.setTexture2D($,0),tt=U.TEXTURE_2D),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,$.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,$.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,$.unpackAlignment);const Ye=U.getParameter(U.UNPACK_ROW_LENGTH),si=U.getParameter(U.UNPACK_IMAGE_HEIGHT),Ts=U.getParameter(U.UNPACK_SKIP_PIXELS),ri=U.getParameter(U.UNPACK_SKIP_ROWS),Ur=U.getParameter(U.UNPACK_SKIP_IMAGES);U.pixelStorei(U.UNPACK_ROW_LENGTH,_t.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,_t.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Ce),U.pixelStorei(U.UNPACK_SKIP_ROWS,De),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Re);const lt=T.isDataArrayTexture||T.isData3DTexture,jt=$.isDataArrayTexture||$.isData3DTexture;if(T.isDepthTexture){const vi=S.get(T),Ht=S.get($),Yt=S.get(vi.__renderTarget),hl=S.get(Ht.__renderTarget);Te.bindFramebuffer(U.READ_FRAMEBUFFER,Yt.__webglFramebuffer),Te.bindFramebuffer(U.DRAW_FRAMEBUFFER,hl.__webglFramebuffer);for(let $n=0;$n<be;$n++)lt&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,S.get(T).__webglTexture,W,Re+$n),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,S.get($).__webglTexture,_e,gt+$n)),U.blitFramebuffer(Ce,De,ye,xe,Ve,nt,ye,xe,U.DEPTH_BUFFER_BIT,U.NEAREST);Te.bindFramebuffer(U.READ_FRAMEBUFFER,null),Te.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(W!==0||T.isRenderTargetTexture||S.has(T)){const vi=S.get(T),Ht=S.get($);Te.bindFramebuffer(U.READ_FRAMEBUFFER,y_),Te.bindFramebuffer(U.DRAW_FRAMEBUFFER,w_);for(let Yt=0;Yt<be;Yt++)lt?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,vi.__webglTexture,W,Re+Yt):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,vi.__webglTexture,W),jt?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Ht.__webglTexture,_e,gt+Yt):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Ht.__webglTexture,_e),W!==0?U.blitFramebuffer(Ce,De,ye,xe,Ve,nt,ye,xe,U.COLOR_BUFFER_BIT,U.NEAREST):jt?U.copyTexSubImage3D(tt,_e,Ve,nt,gt+Yt,Ce,De,ye,xe):U.copyTexSubImage2D(tt,_e,Ve,nt,Ce,De,ye,xe);Te.bindFramebuffer(U.READ_FRAMEBUFFER,null),Te.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else jt?T.isDataTexture||T.isData3DTexture?U.texSubImage3D(tt,_e,Ve,nt,gt,ye,xe,be,st,Le,_t.data):$.isCompressedArrayTexture?U.compressedTexSubImage3D(tt,_e,Ve,nt,gt,ye,xe,be,st,_t.data):U.texSubImage3D(tt,_e,Ve,nt,gt,ye,xe,be,st,Le,_t):T.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,_e,Ve,nt,ye,xe,st,Le,_t.data):T.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,_e,Ve,nt,_t.width,_t.height,st,_t.data):U.texSubImage2D(U.TEXTURE_2D,_e,Ve,nt,ye,xe,st,Le,_t);U.pixelStorei(U.UNPACK_ROW_LENGTH,Ye),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,si),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Ts),U.pixelStorei(U.UNPACK_SKIP_ROWS,ri),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Ur),_e===0&&$.generateMipmaps&&U.generateMipmap(tt),Te.unbindTexture()},this.initRenderTarget=function(T){S.get(T).__webglFramebuffer===void 0&&z.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?z.setTextureCube(T,0):T.isData3DTexture?z.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?z.setTexture2DArray(T,0):z.setTexture2D(T,0),Te.unbindTexture()},this.resetState=function(){N=0,k=0,F=null,Te.reset(),fe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return $i}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=qe._getDrawingBufferColorSpace(e),t.unpackColorSpace=qe._getUnpackColorSpace()}}class Ym{cameraParams;rendererParams;rendererColorParams;stageSize;scene;camera;renderer;$canvas;isScrollSync;devicePixelRatio;padding;scrollOffset;constructor(e={}){this.cameraParams={near:.01,far:1e4,fov:45},this.rendererParams={canvas:void 0,alpha:!0,antialias:!1,color:16777215},this.rendererColorParams={color:16777215,alpha:0},this.stageSize={width:0,height:0,canvasHeight:0,aspect:0},this.scene=null,this.camera=null,this.renderer=null,this.$canvas=null,this.isScrollSync=!1,this.devicePixelRatio=window.devicePixelRatio,this.padding=.25,this.scrollOffset=new Pe(0,0),Object.assign(this,e)}init(){this.setCanvas(),this.setScene(),this.setCamera(),this.renderer=new DE(this.rendererParams),this.setRenderer(),this.setStageSize(),this.setCanvasSize()}destroy(){this.renderer&&this.renderer.dispose(),this.camera=null,this.renderer=null,this.scene=null}setCanvas(){this.rendererParams.canvas=this.$canvas===null?void 0:this.$canvas}setScene(){this.scene=new xu}setCamera(){const e=this.stageSize.canvasHeight*.5/Math.tan(iS.degToRad(this.cameraParams.fov*.5));this.camera?(this.camera.fov=this.cameraParams.fov,this.camera.aspect=this.stageSize.aspect,this.camera.near=this.cameraParams.near,this.camera.far=this.cameraParams.far):this.camera=new wi(this.cameraParams.fov,this.stageSize.aspect,this.cameraParams.near,this.cameraParams.far),this.camera.position.set(0,0,e),this.camera.updateProjectionMatrix()}setRenderer(){this.renderer&&(this.renderer.setPixelRatio(this.devicePixelRatio),this.renderer.setSize(this.stageSize.width,this.stageSize.canvasHeight),this.renderer.setClearColor(this.rendererColorParams.color,this.rendererColorParams.alpha),this.isScrollSync&&(this.renderer.outputColorSpace=ys,this.renderer.autoClear=!1))}setCanvasSize(){this.$canvas&&(this.$canvas.style.width=`${this.stageSize.width}px`,this.$canvas.style.height=`${this.stageSize.canvasHeight}px`)}setStageSize(){this.stageSize.width=window.innerWidth,this.stageSize.height=window.innerHeight,this.isScrollSync?this.stageSize.canvasHeight=this.stageSize.height*(1+this.padding*2):this.stageSize.canvasHeight=this.stageSize.height,this.stageSize.aspect=this.stageSize.width/this.stageSize.canvasHeight,this.isScrollSync?this.scrollOffset.set(window.scrollX,window.scrollY):this.scrollOffset.set(0,0)}onResize(){this.setStageSize(),this.setCanvasSize(),this.setCamera(),this.setRenderer()}render(){this.isScrollSync&&(this.updateScroll(),this.updateCanvasPosition())}updateScroll(){this.scrollOffset.set(window.scrollX,window.scrollY-this.stageSize.height*this.padding)}updateCanvasPosition(){this.$canvas&&(this.$canvas.style.transform=`translate3d(0, ${this.scrollOffset.y}px, 0)`)}}function sn(n){if(n===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return n}function Km(n,e){n.prototype=Object.create(e.prototype),n.prototype.constructor=n,n.__proto__=e}var pi={autoSleep:120,force3D:"auto",nullTargetWarn:1,units:{lineHeight:""}},yr={duration:.5,overwrite:!1,delay:0},yu,Ft,ht,bi=1e8,at=1/bi,mh=Math.PI*2,NE=mh/4,OE=0,Zm=Math.sqrt,UE=Math.cos,FE=Math.sin,Ot=function(e){return typeof e=="string"},xt=function(e){return typeof e=="function"},dn=function(e){return typeof e=="number"},wu=function(e){return typeof e>"u"},Ki=function(e){return typeof e=="object"},Qt=function(e){return e!==!1},Mu=function(){return typeof window<"u"},fo=function(e){return xt(e)||Ot(e)},Jm=typeof ArrayBuffer=="function"&&ArrayBuffer.isView||function(){},Vt=Array.isArray,kE=/random\([^)]+\)/g,BE=/,\s*/g,cd=/(?:-?\.?\d|\.)+/gi,Qm=/[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,lr=/[-+=.]*\d+[.e-]*\d*[a-z%]*/g,Wl=/[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,eg=/[+-]=-?[.\d]+/,zE=/[^,'"\[\]\s]+/gi,VE=/^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,ft,zi,gh,bu,gi={},Fo={},tg,ig=function(e){return(Fo=wr(e,gi))&&ni},Eu=function(e,t){return console.warn("Invalid property",e,"set to",t,"Missing plugin? gsap.registerPlugin()")},wa=function(e,t){return!t&&console.warn(e)},ng=function(e,t){return e&&(gi[e]=t)&&Fo&&(Fo[e]=t)||gi},Ma=function(){return 0},HE={suppressEvents:!0,isStart:!0,kill:!1},Po={suppressEvents:!0,kill:!1},$E={suppressEvents:!0},Tu={},Ln=[],_h={},sg,li={},ql={},hd=30,Co=[],Au="",Pu=function(e){var t=e[0],i,s;if(Ki(t)||xt(t)||(e=[e]),!(i=(t._gsap||{}).harness)){for(s=Co.length;s--&&!Co[s].targetTest(t););i=Co[s]}for(s=e.length;s--;)e[s]&&(e[s]._gsap||(e[s]._gsap=new Pg(e[s],i)))||e.splice(s,1);return e},ds=function(e){return e._gsap||Pu(Ei(e))[0]._gsap},rg=function(e,t,i){return(i=e[t])&&xt(i)?e[t]():wu(i)&&e.getAttribute&&e.getAttribute(t)||i},ei=function(e,t){return(e=e.split(",")).forEach(t)||e},St=function(e){return Math.round(e*1e5)/1e5||0},ut=function(e){return Math.round(e*1e7)/1e7||0},dr=function(e,t){var i=t.charAt(0),s=parseFloat(t.substr(2));return e=parseFloat(e),i==="+"?e+s:i==="-"?e-s:i==="*"?e*s:e/s},GE=function(e,t){for(var i=t.length,s=0;e.indexOf(t[s])<0&&++s<i;);return s<i},ko=function(){var e=Ln.length,t=Ln.slice(0),i,s;for(_h={},Ln.length=0,i=0;i<e;i++)s=t[i],s&&s._lazy&&(s.render(s._lazy[0],s._lazy[1],!0)._lazy=0)},Cu=function(e){return!!(e._initted||e._startAt||e.add)},ag=function(e,t,i,s){Ln.length&&!Ft&&ko(),e.render(t,i,!!(Ft&&t<0&&Cu(e))),Ln.length&&!Ft&&ko()},og=function(e){var t=parseFloat(e);return(t||t===0)&&(e+"").match(zE).length<2?t:Ot(e)?e.trim():e},lg=function(e){return e},_i=function(e,t){for(var i in t)i in e||(e[i]=t[i]);return e},WE=function(e){return function(t,i){for(var s in i)s in t||s==="duration"&&e||s==="ease"||(t[s]=i[s])}},wr=function(e,t){for(var i in t)e[i]=t[i];return e},ud=function n(e,t){for(var i in t)i!=="__proto__"&&i!=="constructor"&&i!=="prototype"&&(e[i]=Ki(t[i])?n(e[i]||(e[i]={}),t[i]):t[i]);return e},Bo=function(e,t){var i={},s;for(s in e)s in t||(i[s]=e[s]);return i},aa=function(e){var t=e.parent||ft,i=e.keyframes?WE(Vt(e.keyframes)):_i;if(Qt(e.inherit))for(;t;)i(e,t.vars.defaults),t=t.parent||t._dp;return e},qE=function(e,t){for(var i=e.length,s=i===t.length;s&&i--&&e[i]===t[i];);return i<0},cg=function(e,t,i,s,r){var a=e[s],o;if(r)for(o=t[r];a&&a[r]>o;)a=a._prev;return a?(t._next=a._next,a._next=t):(t._next=e[i],e[i]=t),t._next?t._next._prev=t:e[s]=t,t._prev=a,t.parent=t._dp=e,t},sl=function(e,t,i,s){i===void 0&&(i="_first"),s===void 0&&(s="_last");var r=t._prev,a=t._next;r?r._next=a:e[i]===t&&(e[i]=a),a?a._prev=r:e[s]===t&&(e[s]=r),t._next=t._prev=t.parent=null},Un=function(e,t){e.parent&&(!t||e.parent.autoRemoveChildren)&&e.parent.remove&&e.parent.remove(e),e._act=0},ps=function(e,t){if(e&&(!t||t._end>e._dur||t._start<0))for(var i=e;i;)i._dirty=1,i=i.parent;return e},XE=function(e){for(var t=e.parent;t&&t.parent;)t._dirty=1,t.totalDuration(),t=t.parent;return e},vh=function(e,t,i,s){return e._startAt&&(Ft?e._startAt.revert(Po):e.vars.immediateRender&&!e.vars.autoRevert||e._startAt.render(t,!0,s))},jE=function n(e){return!e||e._ts&&n(e.parent)},fd=function(e){return e._repeat?Mr(e._tTime,e=e.duration()+e._rDelay)*e:0},Mr=function(e,t){var i=Math.floor(e=ut(e/t));return e&&i===e?i-1:i},zo=function(e,t){return(e-t._start)*t._ts+(t._ts>=0?0:t._dirty?t.totalDuration():t._tDur)},rl=function(e){return e._end=ut(e._start+(e._tDur/Math.abs(e._ts||e._rts||at)||0))},al=function(e,t){var i=e._dp;return i&&i.smoothChildTiming&&e._ts&&(e._start=ut(i._time-(e._ts>0?t/e._ts:((e._dirty?e.totalDuration():e._tDur)-t)/-e._ts)),rl(e),i._dirty||ps(i,e)),e},hg=function(e,t){var i;if((t._time||!t._dur&&t._initted||t._start<e._time&&(t._dur||!t.add))&&(i=zo(e.rawTime(),t),(!t._dur||Ua(0,t.totalDuration(),i)-t._tTime>at)&&t.render(i,!0)),ps(e,t)._dp&&e._initted&&e._time>=e._dur&&e._ts){if(e._dur<e.duration())for(i=e;i._dp;)i.rawTime()>=0&&i.totalTime(i._tTime),i=i._dp;e._zTime=-at}},Hi=function(e,t,i,s){return t.parent&&Un(t),t._start=ut((dn(i)?i:i||e!==ft?Si(e,i,t):e._time)+t._delay),t._end=ut(t._start+(t.totalDuration()/Math.abs(t.timeScale())||0)),cg(e,t,"_first","_last",e._sort?"_start":0),xh(t)||(e._recent=t),s||hg(e,t),e._ts<0&&al(e,e._tTime),e},ug=function(e,t){return(gi.ScrollTrigger||Eu("scrollTrigger",t))&&gi.ScrollTrigger.create(t,e)},fg=function(e,t,i,s,r){if(Lu(e,t,r),!e._initted)return 1;if(!i&&e._pt&&!Ft&&(e._dur&&e.vars.lazy!==!1||!e._dur&&e.vars.lazy)&&sg!==ci.frame)return Ln.push(e),e._lazy=[r,s],1},YE=function n(e){var t=e.parent;return t&&t._ts&&t._initted&&!t._lock&&(t.rawTime()<0||n(t))},xh=function(e){var t=e.data;return t==="isFromStart"||t==="isStart"},KE=function(e,t,i,s){var r=e.ratio,a=t<0||!t&&(!e._start&&YE(e)&&!(!e._initted&&xh(e))||(e._ts<0||e._dp._ts<0)&&!xh(e))?0:1,o=e._rDelay,l=0,c,h,u;if(o&&e._repeat&&(l=Ua(0,e._tDur,t),h=Mr(l,o),e._yoyo&&h&1&&(a=1-a),h!==Mr(e._tTime,o)&&(r=1-a,e.vars.repeatRefresh&&e._initted&&e.invalidate())),a!==r||Ft||s||e._zTime===at||!t&&e._zTime){if(!e._initted&&fg(e,t,s,i,l))return;for(u=e._zTime,e._zTime=t||(i?at:0),i||(i=t&&!u),e.ratio=a,e._from&&(a=1-a),e._time=0,e._tTime=l,c=e._pt;c;)c.r(a,c.d),c=c._next;t<0&&vh(e,t,i,!0),e._onUpdate&&!i&&ui(e,"onUpdate"),l&&e._repeat&&!i&&e.parent&&ui(e,"onRepeat"),(t>=e._tDur||t<0)&&e.ratio===a&&(a&&Un(e,1),!i&&!Ft&&(ui(e,a?"onComplete":"onReverseComplete",!0),e._prom&&e._prom()))}else e._zTime||(e._zTime=t)},ZE=function(e,t,i){var s;if(i>t)for(s=e._first;s&&s._start<=i;){if(s.data==="isPause"&&s._start>t)return s;s=s._next}else for(s=e._last;s&&s._start>=i;){if(s.data==="isPause"&&s._start<t)return s;s=s._prev}},br=function(e,t,i,s){var r=e._repeat,a=ut(t)||0,o=e._tTime/e._tDur;return o&&!s&&(e._time*=a/e._dur),e._dur=a,e._tDur=r?r<0?1e10:ut(a*(r+1)+e._rDelay*r):a,o>0&&!s&&al(e,e._tTime=e._tDur*o),e.parent&&rl(e),i||ps(e.parent,e),e},dd=function(e){return e instanceof Wt?ps(e):br(e,e._dur)},JE={_start:0,endTime:Ma,totalDuration:Ma},Si=function n(e,t,i){var s=e.labels,r=e._recent||JE,a=e.duration()>=bi?r.endTime(!1):e._dur,o,l,c;return Ot(t)&&(isNaN(t)||t in s)?(l=t.charAt(0),c=t.substr(-1)==="%",o=t.indexOf("="),l==="<"||l===">"?(o>=0&&(t=t.replace(/=/,"")),(l==="<"?r._start:r.endTime(r._repeat>=0))+(parseFloat(t.substr(1))||0)*(c?(o<0?r:i).totalDuration()/100:1)):o<0?(t in s||(s[t]=a),s[t]):(l=parseFloat(t.charAt(o-1)+t.substr(o+1)),c&&i&&(l=l/100*(Vt(i)?i[0]:i).totalDuration()),o>1?n(e,t.substr(0,o-1),i)+l:a+l)):t==null?a:+t},oa=function(e,t,i){var s=dn(t[1]),r=(s?2:1)+(e<2?0:1),a=t[r],o,l;if(s&&(a.duration=t[1]),a.parent=i,e){for(o=a,l=i;l&&!("immediateRender"in o);)o=l.vars.defaults||{},l=Qt(l.vars.inherit)&&l.parent;a.immediateRender=Qt(o.immediateRender),e<2?a.runBackwards=1:a.startAt=t[r-1]}return new Et(t[0],a,t[r+1])},zn=function(e,t){return e||e===0?t(e):t},Ua=function(e,t,i){return i<e?e:i>t?t:i},zt=function(e,t){return!Ot(e)||!(t=VE.exec(e))?"":t[1]},QE=function(e,t,i){return zn(i,function(s){return Ua(e,t,s)})},Sh=[].slice,dg=function(e,t){return e&&Ki(e)&&"length"in e&&(!t&&!e.length||e.length-1 in e&&Ki(e[0]))&&!e.nodeType&&e!==zi},eT=function(e,t,i){return i===void 0&&(i=[]),e.forEach(function(s){var r;return Ot(s)&&!t||dg(s,1)?(r=i).push.apply(r,Ei(s)):i.push(s)})||i},Ei=function(e,t,i){return ht&&!t&&ht.selector?ht.selector(e):Ot(e)&&!i&&(gh||!Er())?Sh.call((t||bu).querySelectorAll(e),0):Vt(e)?eT(e,i):dg(e)?Sh.call(e,0):e?[e]:[]},yh=function(e){return e=Ei(e)[0]||wa("Invalid scope")||{},function(t){var i=e.current||e.nativeElement||e;return Ei(t,i.querySelectorAll?i:i===e?wa("Invalid scope")||bu.createElement("div"):e)}},pg=function(e){return e.sort(function(){return .5-Math.random()})},mg=function(e){if(xt(e))return e;var t=Ki(e)?e:{each:e},i=ms(t.ease),s=t.from||0,r=parseFloat(t.base)||0,a={},o=s>0&&s<1,l=isNaN(s)||o,c=t.axis,h=s,u=s;return Ot(s)?h=u={center:.5,edges:.5,end:1}[s]||0:!o&&l&&(h=s[0],u=s[1]),function(f,d,_){var m=(_||t).length,g=a[m],p,x,M,y,w,E,P,L,v;if(!g){if(v=t.grid==="auto"?0:(t.grid||[1,bi])[1],!v){for(P=-bi;P<(P=_[v++].getBoundingClientRect().left)&&v<m;);v<m&&v--}for(g=a[m]=[],p=l?Math.min(v,m)*h-.5:s%v,x=v===bi?0:l?m*u/v-.5:s/v|0,P=0,L=bi,E=0;E<m;E++)M=E%v-p,y=x-(E/v|0),g[E]=w=c?Math.abs(c==="y"?y:M):Zm(M*M+y*y),w>P&&(P=w),w<L&&(L=w);s==="random"&&pg(g),g.max=P-L,g.min=L,g.v=m=(parseFloat(t.amount)||parseFloat(t.each)*(v>m?m-1:c?c==="y"?m/v:v:Math.max(v,m/v))||0)*(s==="edges"?-1:1),g.b=m<0?r-m:r,g.u=zt(t.amount||t.each)||0,i=i&&m<0?Eg(i):i}return m=(g[f]-g.min)/g.max||0,ut(g.b+(i?i(m):m)*g.v)+g.u}},wh=function(e){var t=Math.pow(10,((e+"").split(".")[1]||"").length);return function(i){var s=ut(Math.round(parseFloat(i)/e)*e*t);return(s-s%1)/t+(dn(i)?0:zt(i))}},gg=function(e,t){var i=Vt(e),s,r;return!i&&Ki(e)&&(s=i=e.radius||bi,e.values?(e=Ei(e.values),(r=!dn(e[0]))&&(s*=s)):e=wh(e.increment)),zn(t,i?xt(e)?function(a){return r=e(a),Math.abs(r-a)<=s?r:a}:function(a){for(var o=parseFloat(r?a.x:a),l=parseFloat(r?a.y:0),c=bi,h=0,u=e.length,f,d;u--;)r?(f=e[u].x-o,d=e[u].y-l,f=f*f+d*d):f=Math.abs(e[u]-o),f<c&&(c=f,h=u);return h=!s||c<=s?e[h]:a,r||h===a||dn(a)?h:h+zt(a)}:wh(e))},_g=function(e,t,i,s){return zn(Vt(e)?!t:i===!0?!!(i=0):!s,function(){return Vt(e)?e[~~(Math.random()*e.length)]:(i=i||1e-5)&&(s=i<1?Math.pow(10,(i+"").length-2):1)&&Math.floor(Math.round((e-i/2+Math.random()*(t-e+i*.99))/i)*i*s)/s})},tT=function(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];return function(s){return t.reduce(function(r,a){return a(r)},s)}},iT=function(e,t){return function(i){return e(parseFloat(i))+(t||zt(i))}},nT=function(e,t,i){return xg(e,t,0,1,i)},vg=function(e,t,i){return zn(i,function(s){return e[~~t(s)]})},sT=function n(e,t,i){var s=t-e;return Vt(e)?vg(e,n(0,e.length),t):zn(i,function(r){return(s+(r-e)%s)%s+e})},rT=function n(e,t,i){var s=t-e,r=s*2;return Vt(e)?vg(e,n(0,e.length-1),t):zn(i,function(a){return a=(r+(a-e)%r)%r||0,e+(a>s?r-a:a)})},ba=function(e){return e.replace(kE,function(t){var i=t.indexOf("[")+1,s=t.substring(i||7,i?t.indexOf("]"):t.length-1).split(BE);return _g(i?s:+s[0],i?0:+s[1],+s[2]||1e-5)})},xg=function(e,t,i,s,r){var a=t-e,o=s-i;return zn(r,function(l){return i+((l-e)/a*o||0)})},aT=function n(e,t,i,s){var r=isNaN(e+t)?0:function(d){return(1-d)*e+d*t};if(!r){var a=Ot(e),o={},l,c,h,u,f;if(i===!0&&(s=1)&&(i=null),a)e={p:e},t={p:t};else if(Vt(e)&&!Vt(t)){for(h=[],u=e.length,f=u-2,c=1;c<u;c++)h.push(n(e[c-1],e[c]));u--,r=function(_){_*=u;var m=Math.min(f,~~_);return h[m](_-m)},i=t}else s||(e=wr(Vt(e)?[]:{},e));if(!h){for(l in t)Ru.call(o,e,l,"get",t[l]);r=function(_){return Nu(_,o)||(a?e.p:e)}}}return zn(i,r)},pd=function(e,t,i){var s=e.labels,r=bi,a,o,l;for(a in s)o=s[a]-t,o<0==!!i&&o&&r>(o=Math.abs(o))&&(l=a,r=o);return l},ui=function(e,t,i){var s=e.vars,r=s[t],a=ht,o=e._ctx,l,c,h;if(r)return l=s[t+"Params"],c=s.callbackScope||e,i&&Ln.length&&ko(),o&&(ht=o),h=l?r.apply(c,l):r.call(c),ht=a,h},Qr=function(e){return Un(e),e.scrollTrigger&&e.scrollTrigger.kill(!!Ft),e.progress()<1&&ui(e,"onInterrupt"),e},cr,Sg=[],yg=function(e){if(e)if(e=!e.name&&e.default||e,Mu()||e.headless){var t=e.name,i=xt(e),s=t&&!i&&e.init?function(){this._props=[]}:e,r={init:Ma,render:Nu,add:Ru,kill:wT,modifier:yT,rawVars:0},a={targetTest:0,get:0,getSetter:Du,aliases:{},register:0};if(Er(),e!==s){if(li[t])return;_i(s,_i(Bo(e,r),a)),wr(s.prototype,wr(r,Bo(e,a))),li[s.prop=t]=s,e.targetTest&&(Co.push(s),Tu[t]=1),t=(t==="css"?"CSS":t.charAt(0).toUpperCase()+t.substr(1))+"Plugin"}ng(t,s),e.register&&e.register(ni,s,ti)}else Sg.push(e)},rt=255,ea={aqua:[0,rt,rt],lime:[0,rt,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,rt],navy:[0,0,128],white:[rt,rt,rt],olive:[128,128,0],yellow:[rt,rt,0],orange:[rt,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[rt,0,0],pink:[rt,192,203],cyan:[0,rt,rt],transparent:[rt,rt,rt,0]},Xl=function(e,t,i){return e+=e<0?1:e>1?-1:0,(e*6<1?t+(i-t)*e*6:e<.5?i:e*3<2?t+(i-t)*(2/3-e)*6:t)*rt+.5|0},wg=function(e,t,i){var s=e?dn(e)?[e>>16,e>>8&rt,e&rt]:0:ea.black,r,a,o,l,c,h,u,f,d,_;if(!s){if(e.substr(-1)===","&&(e=e.substr(0,e.length-1)),ea[e])s=ea[e];else if(e.charAt(0)==="#"){if(e.length<6&&(r=e.charAt(1),a=e.charAt(2),o=e.charAt(3),e="#"+r+r+a+a+o+o+(e.length===5?e.charAt(4)+e.charAt(4):"")),e.length===9)return s=parseInt(e.substr(1,6),16),[s>>16,s>>8&rt,s&rt,parseInt(e.substr(7),16)/255];e=parseInt(e.substr(1),16),s=[e>>16,e>>8&rt,e&rt]}else if(e.substr(0,3)==="hsl"){if(s=_=e.match(cd),!t)l=+s[0]%360/360,c=+s[1]/100,h=+s[2]/100,a=h<=.5?h*(c+1):h+c-h*c,r=h*2-a,s.length>3&&(s[3]*=1),s[0]=Xl(l+1/3,r,a),s[1]=Xl(l,r,a),s[2]=Xl(l-1/3,r,a);else if(~e.indexOf("="))return s=e.match(Qm),i&&s.length<4&&(s[3]=1),s}else s=e.match(cd)||ea.transparent;s=s.map(Number)}return t&&!_&&(r=s[0]/rt,a=s[1]/rt,o=s[2]/rt,u=Math.max(r,a,o),f=Math.min(r,a,o),h=(u+f)/2,u===f?l=c=0:(d=u-f,c=h>.5?d/(2-u-f):d/(u+f),l=u===r?(a-o)/d+(a<o?6:0):u===a?(o-r)/d+2:(r-a)/d+4,l*=60),s[0]=~~(l+.5),s[1]=~~(c*100+.5),s[2]=~~(h*100+.5)),i&&s.length<4&&(s[3]=1),s},Mg=function(e){var t=[],i=[],s=-1;return e.split(In).forEach(function(r){var a=r.match(lr)||[];t.push.apply(t,a),i.push(s+=a.length+1)}),t.c=i,t},md=function(e,t,i){var s="",r=(e+s).match(In),a=t?"hsla(":"rgba(",o=0,l,c,h,u;if(!r)return e;if(r=r.map(function(f){return(f=wg(f,t,1))&&a+(t?f[0]+","+f[1]+"%,"+f[2]+"%,"+f[3]:f.join(","))+")"}),i&&(h=Mg(e),l=i.c,l.join(s)!==h.c.join(s)))for(c=e.replace(In,"1").split(lr),u=c.length-1;o<u;o++)s+=c[o]+(~l.indexOf(o)?r.shift()||a+"0,0,0,0)":(h.length?h:r.length?r:i).shift());if(!c)for(c=e.split(In),u=c.length-1;o<u;o++)s+=c[o]+r[o];return s+c[u]},In=(function(){var n="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b",e;for(e in ea)n+="|"+e+"\\b";return new RegExp(n+")","gi")})(),oT=/hsl[a]?\(/,bg=function(e){var t=e.join(" "),i;if(In.lastIndex=0,In.test(t))return i=oT.test(t),e[1]=md(e[1],i),e[0]=md(e[0],i,Mg(e[1])),!0},Ea,ci=(function(){var n=Date.now,e=500,t=33,i=n(),s=i,r=1e3/240,a=r,o=[],l,c,h,u,f,d,_=function m(g){var p=n()-s,x=g===!0,M,y,w,E;if((p>e||p<0)&&(i+=p-t),s+=p,w=s-i,M=w-a,(M>0||x)&&(E=++u.frame,f=w-u.time*1e3,u.time=w=w/1e3,a+=M+(M>=r?4:r-M),y=1),x||(l=c(m)),y)for(d=0;d<o.length;d++)o[d](w,f,E,g)};return u={time:0,frame:0,tick:function(){_(!0)},deltaRatio:function(g){return f/(1e3/(g||60))},wake:function(){tg&&(!gh&&Mu()&&(zi=gh=window,bu=zi.document||{},gi.gsap=ni,(zi.gsapVersions||(zi.gsapVersions=[])).push(ni.version),ig(Fo||zi.GreenSockGlobals||!zi.gsap&&zi||{}),Sg.forEach(yg)),h=typeof requestAnimationFrame<"u"&&requestAnimationFrame,l&&u.sleep(),c=h||function(g){return setTimeout(g,a-u.time*1e3+1|0)},Ea=1,_(2))},sleep:function(){(h?cancelAnimationFrame:clearTimeout)(l),Ea=0,c=Ma},lagSmoothing:function(g,p){e=g||1/0,t=Math.min(p||33,e)},fps:function(g){r=1e3/(g||240),a=u.time*1e3+r},add:function(g,p,x){var M=p?function(y,w,E,P){g(y,w,E,P),u.remove(M)}:g;return u.remove(g),o[x?"unshift":"push"](M),Er(),M},remove:function(g,p){~(p=o.indexOf(g))&&o.splice(p,1)&&d>=p&&d--},_listeners:o},u})(),Er=function(){return!Ea&&ci.wake()},We={},lT=/^[\d.\-M][\d.\-,\s]/,cT=/["']/g,hT=function(e){for(var t={},i=e.substr(1,e.length-3).split(":"),s=i[0],r=1,a=i.length,o,l,c;r<a;r++)l=i[r],o=r!==a-1?l.lastIndexOf(","):l.length,c=l.substr(0,o),t[s]=isNaN(c)?c.replace(cT,"").trim():+c,s=l.substr(o+1).trim();return t},uT=function(e){var t=e.indexOf("(")+1,i=e.indexOf(")"),s=e.indexOf("(",t);return e.substring(t,~s&&s<i?e.indexOf(")",i+1):i)},fT=function(e){var t=(e+"").split("("),i=We[t[0]];return i&&t.length>1&&i.config?i.config.apply(null,~e.indexOf("{")?[hT(t[1])]:uT(e).split(",").map(og)):We._CE&&lT.test(e)?We._CE("",e):i},Eg=function(e){return function(t){return 1-e(1-t)}},Tg=function n(e,t){for(var i=e._first,s;i;)i instanceof Wt?n(i,t):i.vars.yoyoEase&&(!i._yoyo||!i._repeat)&&i._yoyo!==t&&(i.timeline?n(i.timeline,t):(s=i._ease,i._ease=i._yEase,i._yEase=s,i._yoyo=t)),i=i._next},ms=function(e,t){return e&&(xt(e)?e:We[e]||fT(e))||t},bs=function(e,t,i,s){i===void 0&&(i=function(l){return 1-t(1-l)}),s===void 0&&(s=function(l){return l<.5?t(l*2)/2:1-t((1-l)*2)/2});var r={easeIn:t,easeOut:i,easeInOut:s},a;return ei(e,function(o){We[o]=gi[o]=r,We[a=o.toLowerCase()]=i;for(var l in r)We[a+(l==="easeIn"?".in":l==="easeOut"?".out":".inOut")]=We[o+"."+l]=r[l]}),r},Ag=function(e){return function(t){return t<.5?(1-e(1-t*2))/2:.5+e((t-.5)*2)/2}},jl=function n(e,t,i){var s=t>=1?t:1,r=(i||(e?.3:.45))/(t<1?t:1),a=r/mh*(Math.asin(1/s)||0),o=function(h){return h===1?1:s*Math.pow(2,-10*h)*FE((h-a)*r)+1},l=e==="out"?o:e==="in"?function(c){return 1-o(1-c)}:Ag(o);return r=mh/r,l.config=function(c,h){return n(e,c,h)},l},Yl=function n(e,t){t===void 0&&(t=1.70158);var i=function(a){return a?--a*a*((t+1)*a+t)+1:0},s=e==="out"?i:e==="in"?function(r){return 1-i(1-r)}:Ag(i);return s.config=function(r){return n(e,r)},s};ei("Linear,Quad,Cubic,Quart,Quint,Strong",function(n,e){var t=e<5?e+1:e;bs(n+",Power"+(t-1),e?function(i){return Math.pow(i,t)}:function(i){return i},function(i){return 1-Math.pow(1-i,t)},function(i){return i<.5?Math.pow(i*2,t)/2:1-Math.pow((1-i)*2,t)/2})});We.Linear.easeNone=We.none=We.Linear.easeIn;bs("Elastic",jl("in"),jl("out"),jl());(function(n,e){var t=1/e,i=2*t,s=2.5*t,r=function(o){return o<t?n*o*o:o<i?n*Math.pow(o-1.5/e,2)+.75:o<s?n*(o-=2.25/e)*o+.9375:n*Math.pow(o-2.625/e,2)+.984375};bs("Bounce",function(a){return 1-r(1-a)},r)})(7.5625,2.75);bs("Expo",function(n){return Math.pow(2,10*(n-1))*n+n*n*n*n*n*n*(1-n)});bs("Circ",function(n){return-(Zm(1-n*n)-1)});bs("Sine",function(n){return n===1?1:-UE(n*NE)+1});bs("Back",Yl("in"),Yl("out"),Yl());We.SteppedEase=We.steps=gi.SteppedEase={config:function(e,t){e===void 0&&(e=1);var i=1/e,s=e+(t?0:1),r=t?1:0,a=1-at;return function(o){return((s*Ua(0,a,o)|0)+r)*i}}};yr.ease=We["quad.out"];ei("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",function(n){return Au+=n+","+n+"Params,"});var Pg=function(e,t){this.id=OE++,e._gsap=this,this.target=e,this.harness=t,this.get=t?t.get:rg,this.set=t?t.getSetter:Du},Ta=(function(){function n(t){this.vars=t,this._delay=+t.delay||0,(this._repeat=t.repeat===1/0?-2:t.repeat||0)&&(this._rDelay=t.repeatDelay||0,this._yoyo=!!t.yoyo||!!t.yoyoEase),this._ts=1,br(this,+t.duration,1,1),this.data=t.data,ht&&(this._ctx=ht,ht.data.push(this)),Ea||ci.wake()}var e=n.prototype;return e.delay=function(i){return i||i===0?(this.parent&&this.parent.smoothChildTiming&&this.startTime(this._start+i-this._delay),this._delay=i,this):this._delay},e.duration=function(i){return arguments.length?this.totalDuration(this._repeat>0?i+(i+this._rDelay)*this._repeat:i):this.totalDuration()&&this._dur},e.totalDuration=function(i){return arguments.length?(this._dirty=0,br(this,this._repeat<0?i:(i-this._repeat*this._rDelay)/(this._repeat+1))):this._tDur},e.totalTime=function(i,s){if(Er(),!arguments.length)return this._tTime;var r=this._dp;if(r&&r.smoothChildTiming&&this._ts){for(al(this,i),!r._dp||r.parent||hg(r,this);r&&r.parent;)r.parent._time!==r._start+(r._ts>=0?r._tTime/r._ts:(r.totalDuration()-r._tTime)/-r._ts)&&r.totalTime(r._tTime,!0),r=r.parent;!this.parent&&this._dp.autoRemoveChildren&&(this._ts>0&&i<this._tDur||this._ts<0&&i>0||!this._tDur&&!i)&&Hi(this._dp,this,this._start-this._delay)}return(this._tTime!==i||!this._dur&&!s||this._initted&&Math.abs(this._zTime)===at||!this._initted&&this._dur&&i||!i&&!this._initted&&(this.add||this._ptLookup))&&(this._ts||(this._pTime=i),ag(this,i,s)),this},e.time=function(i,s){return arguments.length?this.totalTime(Math.min(this.totalDuration(),i+fd(this))%(this._dur+this._rDelay)||(i?this._dur:0),s):this._time},e.totalProgress=function(i,s){return arguments.length?this.totalTime(this.totalDuration()*i,s):this.totalDuration()?Math.min(1,this._tTime/this._tDur):this.rawTime()>=0&&this._initted?1:0},e.progress=function(i,s){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&!(this.iteration()&1)?1-i:i)+fd(this),s):this.duration()?Math.min(1,this._time/this._dur):this.rawTime()>0?1:0},e.iteration=function(i,s){var r=this.duration()+this._rDelay;return arguments.length?this.totalTime(this._time+(i-1)*r,s):this._repeat?Mr(this._tTime,r)+1:1},e.timeScale=function(i,s){if(!arguments.length)return this._rts===-at?0:this._rts;if(this._rts===i)return this;var r=this.parent&&this._ts?zo(this.parent._time,this):this._tTime;return this._rts=+i||0,this._ts=this._ps||i===-at?0:this._rts,this.totalTime(Ua(-Math.abs(this._delay),this.totalDuration(),r),s!==!1),rl(this),XE(this)},e.paused=function(i){return arguments.length?(this._ps!==i&&(this._ps=i,i?(this._pTime=this._tTime||Math.max(-this._delay,this.rawTime()),this._ts=this._act=0):(Er(),this._ts=this._rts,this.totalTime(this.parent&&!this.parent.smoothChildTiming?this.rawTime():this._tTime||this._pTime,this.progress()===1&&Math.abs(this._zTime)!==at&&(this._tTime-=at)))),this):this._ps},e.startTime=function(i){if(arguments.length){this._start=ut(i);var s=this.parent||this._dp;return s&&(s._sort||!this.parent)&&Hi(s,this,this._start-this._delay),this}return this._start},e.endTime=function(i){return this._start+(Qt(i)?this.totalDuration():this.duration())/Math.abs(this._ts||1)},e.rawTime=function(i){var s=this.parent||this._dp;return s?i&&(!this._ts||this._repeat&&this._time&&this.totalProgress()<1)?this._tTime%(this._dur+this._rDelay):this._ts?zo(s.rawTime(i),this):this._tTime:this._tTime},e.revert=function(i){i===void 0&&(i=$E);var s=Ft;return Ft=i,Cu(this)&&(this.timeline&&this.timeline.revert(i),this.totalTime(-.01,i.suppressEvents)),this.data!=="nested"&&i.kill!==!1&&this.kill(),Ft=s,this},e.globalTime=function(i){for(var s=this,r=arguments.length?i:s.rawTime();s;)r=s._start+r/(Math.abs(s._ts)||1),s=s._dp;return!this.parent&&this._sat?this._sat.globalTime(i):r},e.repeat=function(i){return arguments.length?(this._repeat=i===1/0?-2:i,dd(this)):this._repeat===-2?1/0:this._repeat},e.repeatDelay=function(i){if(arguments.length){var s=this._time;return this._rDelay=i,dd(this),s?this.time(s):this}return this._rDelay},e.yoyo=function(i){return arguments.length?(this._yoyo=i,this):this._yoyo},e.seek=function(i,s){return this.totalTime(Si(this,i),Qt(s))},e.restart=function(i,s){return this.play().totalTime(i?-this._delay:0,Qt(s)),this._dur||(this._zTime=-at),this},e.play=function(i,s){return i!=null&&this.seek(i,s),this.reversed(!1).paused(!1)},e.reverse=function(i,s){return i!=null&&this.seek(i||this.totalDuration(),s),this.reversed(!0).paused(!1)},e.pause=function(i,s){return i!=null&&this.seek(i,s),this.paused(!0)},e.resume=function(){return this.paused(!1)},e.reversed=function(i){return arguments.length?(!!i!==this.reversed()&&this.timeScale(-this._rts||(i?-at:0)),this):this._rts<0},e.invalidate=function(){return this._initted=this._act=0,this._zTime=-at,this},e.isActive=function(){var i=this.parent||this._dp,s=this._start,r;return!!(!i||this._ts&&this._initted&&i.isActive()&&(r=i.rawTime(!0))>=s&&r<this.endTime(!0)-at)},e.eventCallback=function(i,s,r){var a=this.vars;return arguments.length>1?(s?(a[i]=s,r&&(a[i+"Params"]=r),i==="onUpdate"&&(this._onUpdate=s)):delete a[i],this):a[i]},e.then=function(i){var s=this,r=s._prom;return new Promise(function(a){var o=xt(i)?i:lg,l=function(){var h=s.then;s.then=null,r&&r(),xt(o)&&(o=o(s))&&(o.then||o===s)&&(s.then=h),a(o),s.then=h};s._initted&&s.totalProgress()===1&&s._ts>=0||!s._tTime&&s._ts<0?l():s._prom=l})},e.kill=function(){Qr(this)},n})();_i(Ta.prototype,{_time:0,_start:0,_end:0,_tTime:0,_tDur:0,_dirty:0,_repeat:0,_yoyo:!1,parent:null,_initted:!1,_rDelay:0,_ts:1,_dp:0,ratio:0,_zTime:-at,_prom:0,_ps:!1,_rts:1});var Wt=(function(n){Km(e,n);function e(i,s){var r;return i===void 0&&(i={}),r=n.call(this,i)||this,r.labels={},r.smoothChildTiming=!!i.smoothChildTiming,r.autoRemoveChildren=!!i.autoRemoveChildren,r._sort=Qt(i.sortChildren),ft&&Hi(i.parent||ft,sn(r),s),i.reversed&&r.reverse(),i.paused&&r.paused(!0),i.scrollTrigger&&ug(sn(r),i.scrollTrigger),r}var t=e.prototype;return t.to=function(s,r,a){return oa(0,arguments,this),this},t.from=function(s,r,a){return oa(1,arguments,this),this},t.fromTo=function(s,r,a,o){return oa(2,arguments,this),this},t.set=function(s,r,a){return r.duration=0,r.parent=this,aa(r).repeatDelay||(r.repeat=0),r.immediateRender=!!r.immediateRender,new Et(s,r,Si(this,a),1),this},t.call=function(s,r,a){return Hi(this,Et.delayedCall(0,s,r),a)},t.staggerTo=function(s,r,a,o,l,c,h){return a.duration=r,a.stagger=a.stagger||o,a.onComplete=c,a.onCompleteParams=h,a.parent=this,new Et(s,a,Si(this,l)),this},t.staggerFrom=function(s,r,a,o,l,c,h){return a.runBackwards=1,aa(a).immediateRender=Qt(a.immediateRender),this.staggerTo(s,r,a,o,l,c,h)},t.staggerFromTo=function(s,r,a,o,l,c,h,u){return o.startAt=a,aa(o).immediateRender=Qt(o.immediateRender),this.staggerTo(s,r,o,l,c,h,u)},t.render=function(s,r,a){var o=this._time,l=this._dirty?this.totalDuration():this._tDur,c=this._dur,h=s<=0?0:ut(s),u=this._zTime<0!=s<0&&(this._initted||!c),f,d,_,m,g,p,x,M,y,w,E,P;if(this!==ft&&h>l&&s>=0&&(h=l),h!==this._tTime||a||u){if(o!==this._time&&c&&(h+=this._time-o,s+=this._time-o),f=h,y=this._start,M=this._ts,p=!M,u&&(c||(o=this._zTime),(s||!r)&&(this._zTime=s)),this._repeat){if(E=this._yoyo,g=c+this._rDelay,this._repeat<-1&&s<0)return this.totalTime(g*100+s,r,a);if(f=ut(h%g),h===l?(m=this._repeat,f=c):(w=ut(h/g),m=~~w,m&&m===w&&(f=c,m--),f>c&&(f=c)),w=Mr(this._tTime,g),!o&&this._tTime&&w!==m&&this._tTime-w*g-this._dur<=0&&(w=m),E&&m&1&&(f=c-f,P=1),m!==w&&!this._lock){var L=E&&w&1,v=L===(E&&m&1);if(m<w&&(L=!L),o=L?0:h%c?c:h,this._lock=1,this.render(o||(P?0:ut(m*g)),r,!c)._lock=0,this._tTime=h,!r&&this.parent&&ui(this,"onRepeat"),this.vars.repeatRefresh&&!P&&(this.invalidate()._lock=1,w=m),o&&o!==this._time||p!==!this._ts||this.vars.onRepeat&&!this.parent&&!this._act)return this;if(c=this._dur,l=this._tDur,v&&(this._lock=2,o=L?c:-1e-4,this.render(o,!0),this.vars.repeatRefresh&&!P&&this.invalidate()),this._lock=0,!this._ts&&!p)return this;Tg(this,P)}}if(this._hasPause&&!this._forcing&&this._lock<2&&(x=ZE(this,ut(o),ut(f)),x&&(h-=f-(f=x._start))),this._tTime=h,this._time=f,this._act=!M,this._initted||(this._onUpdate=this.vars.onUpdate,this._initted=1,this._zTime=s,o=0),!o&&h&&c&&!r&&!w&&(ui(this,"onStart"),this._tTime!==h))return this;if(f>=o&&s>=0)for(d=this._first;d;){if(_=d._next,(d._act||f>=d._start)&&d._ts&&x!==d){if(d.parent!==this)return this.render(s,r,a);if(d.render(d._ts>0?(f-d._start)*d._ts:(d._dirty?d.totalDuration():d._tDur)+(f-d._start)*d._ts,r,a),f!==this._time||!this._ts&&!p){x=0,_&&(h+=this._zTime=-at);break}}d=_}else{d=this._last;for(var b=s<0?s:f;d;){if(_=d._prev,(d._act||b<=d._end)&&d._ts&&x!==d){if(d.parent!==this)return this.render(s,r,a);if(d.render(d._ts>0?(b-d._start)*d._ts:(d._dirty?d.totalDuration():d._tDur)+(b-d._start)*d._ts,r,a||Ft&&Cu(d)),f!==this._time||!this._ts&&!p){x=0,_&&(h+=this._zTime=b?-at:at);break}}d=_}}if(x&&!r&&(this.pause(),x.render(f>=o?0:-at)._zTime=f>=o?1:-1,this._ts))return this._start=y,rl(this),this.render(s,r,a);this._onUpdate&&!r&&ui(this,"onUpdate",!0),(h===l&&this._tTime>=this.totalDuration()||!h&&o)&&(y===this._start||Math.abs(M)!==Math.abs(this._ts))&&(this._lock||((s||!c)&&(h===l&&this._ts>0||!h&&this._ts<0)&&Un(this,1),!r&&!(s<0&&!o)&&(h||o||!l)&&(ui(this,h===l&&s>=0?"onComplete":"onReverseComplete",!0),this._prom&&!(h<l&&this.timeScale()>0)&&this._prom())))}return this},t.add=function(s,r){var a=this;if(dn(r)||(r=Si(this,r,s)),!(s instanceof Ta)){if(Vt(s))return s.forEach(function(o){return a.add(o,r)}),this;if(Ot(s))return this.addLabel(s,r);if(xt(s))s=Et.delayedCall(0,s);else return this}return this!==s?Hi(this,s,r):this},t.getChildren=function(s,r,a,o){s===void 0&&(s=!0),r===void 0&&(r=!0),a===void 0&&(a=!0),o===void 0&&(o=-bi);for(var l=[],c=this._first;c;)c._start>=o&&(c instanceof Et?r&&l.push(c):(a&&l.push(c),s&&l.push.apply(l,c.getChildren(!0,r,a)))),c=c._next;return l},t.getById=function(s){for(var r=this.getChildren(1,1,1),a=r.length;a--;)if(r[a].vars.id===s)return r[a]},t.remove=function(s){return Ot(s)?this.removeLabel(s):xt(s)?this.killTweensOf(s):(s.parent===this&&sl(this,s),s===this._recent&&(this._recent=this._last),ps(this))},t.totalTime=function(s,r){return arguments.length?(this._forcing=1,!this._dp&&this._ts&&(this._start=ut(ci.time-(this._ts>0?s/this._ts:(this.totalDuration()-s)/-this._ts))),n.prototype.totalTime.call(this,s,r),this._forcing=0,this):this._tTime},t.addLabel=function(s,r){return this.labels[s]=Si(this,r),this},t.removeLabel=function(s){return delete this.labels[s],this},t.addPause=function(s,r,a){var o=Et.delayedCall(0,r||Ma,a);return o.data="isPause",this._hasPause=1,Hi(this,o,Si(this,s))},t.removePause=function(s){var r=this._first;for(s=Si(this,s);r;)r._start===s&&r.data==="isPause"&&Un(r),r=r._next},t.killTweensOf=function(s,r,a){for(var o=this.getTweensOf(s,a),l=o.length;l--;)Pn!==o[l]&&o[l].kill(s,r);return this},t.getTweensOf=function(s,r){for(var a=[],o=Ei(s),l=this._first,c=dn(r),h;l;)l instanceof Et?GE(l._targets,o)&&(c?(!Pn||l._initted&&l._ts)&&l.globalTime(0)<=r&&l.globalTime(l.totalDuration())>r:!r||l.isActive())&&a.push(l):(h=l.getTweensOf(o,r)).length&&a.push.apply(a,h),l=l._next;return a},t.tweenTo=function(s,r){r=r||{};var a=this,o=Si(a,s),l=r,c=l.startAt,h=l.onStart,u=l.onStartParams,f=l.immediateRender,d,_=Et.to(a,_i({ease:r.ease||"none",lazy:!1,immediateRender:!1,time:o,overwrite:"auto",duration:r.duration||Math.abs((o-(c&&"time"in c?c.time:a._time))/a.timeScale())||at,onStart:function(){if(a.pause(),!d){var g=r.duration||Math.abs((o-(c&&"time"in c?c.time:a._time))/a.timeScale());_._dur!==g&&br(_,g,0,1).render(_._time,!0,!0),d=1}h&&h.apply(_,u||[])}},r));return f?_.render(0):_},t.tweenFromTo=function(s,r,a){return this.tweenTo(r,_i({startAt:{time:Si(this,s)}},a))},t.recent=function(){return this._recent},t.nextLabel=function(s){return s===void 0&&(s=this._time),pd(this,Si(this,s))},t.previousLabel=function(s){return s===void 0&&(s=this._time),pd(this,Si(this,s),1)},t.currentLabel=function(s){return arguments.length?this.seek(s,!0):this.previousLabel(this._time+at)},t.shiftChildren=function(s,r,a){a===void 0&&(a=0);var o=this._first,l=this.labels,c;for(s=ut(s);o;)o._start>=a&&(o._start+=s,o._end+=s),o=o._next;if(r)for(c in l)l[c]>=a&&(l[c]+=s);return ps(this)},t.invalidate=function(s){var r=this._first;for(this._lock=0;r;)r.invalidate(s),r=r._next;return n.prototype.invalidate.call(this,s)},t.clear=function(s){s===void 0&&(s=!0);for(var r=this._first,a;r;)a=r._next,this.remove(r),r=a;return this._dp&&(this._time=this._tTime=this._pTime=0),s&&(this.labels={}),ps(this)},t.totalDuration=function(s){var r=0,a=this,o=a._last,l=bi,c,h,u;if(arguments.length)return a.timeScale((a._repeat<0?a.duration():a.totalDuration())/(a.reversed()?-s:s));if(a._dirty){for(u=a.parent;o;)c=o._prev,o._dirty&&o.totalDuration(),h=o._start,h>l&&a._sort&&o._ts&&!a._lock?(a._lock=1,Hi(a,o,h-o._delay,1)._lock=0):l=h,h<0&&o._ts&&(r-=h,(!u&&!a._dp||u&&u.smoothChildTiming)&&(a._start+=ut(h/a._ts),a._time-=h,a._tTime-=h),a.shiftChildren(-h,!1,-1/0),l=0),o._end>r&&o._ts&&(r=o._end),o=c;br(a,a===ft&&a._time>r?a._time:r,1,1),a._dirty=0}return a._tDur},e.updateRoot=function(s){if(ft._ts&&(ag(ft,zo(s,ft)),sg=ci.frame),ci.frame>=hd){hd+=pi.autoSleep||120;var r=ft._first;if((!r||!r._ts)&&pi.autoSleep&&ci._listeners.length<2){for(;r&&!r._ts;)r=r._next;r||ci.sleep()}}},e})(Ta);_i(Wt.prototype,{_lock:0,_hasPause:0,_forcing:0});var dT=function(e,t,i,s,r,a,o){var l=new ti(this._pt,e,t,0,1,Ng,null,r),c=0,h=0,u,f,d,_,m,g,p,x;for(l.b=i,l.e=s,i+="",s+="",(p=~s.indexOf("random("))&&(s=ba(s)),a&&(x=[i,s],a(x,e,t),i=x[0],s=x[1]),f=i.match(Wl)||[];u=Wl.exec(s);)_=u[0],m=s.substring(c,u.index),d?d=(d+1)%5:m.substr(-5)==="rgba("&&(d=1),_!==f[h++]&&(g=parseFloat(f[h-1])||0,l._pt={_next:l._pt,p:m||h===1?m:",",s:g,c:_.charAt(1)==="="?dr(g,_)-g:parseFloat(_)-g,m:d&&d<4?Math.round:0},c=Wl.lastIndex);return l.c=c<s.length?s.substring(c,s.length):"",l.fp=o,(eg.test(s)||p)&&(l.e=0),this._pt=l,l},Ru=function(e,t,i,s,r,a,o,l,c,h){xt(s)&&(s=s(r||0,e,a));var u=e[t],f=i!=="get"?i:xt(u)?c?e[t.indexOf("set")||!xt(e["get"+t.substr(3)])?t:"get"+t.substr(3)](c):e[t]():u,d=xt(u)?c?vT:Ig:Iu,_;if(Ot(s)&&(~s.indexOf("random(")&&(s=ba(s)),s.charAt(1)==="="&&(_=dr(f,s)+(zt(f)||0),(_||_===0)&&(s=_))),!h||f!==s||Mh)return!isNaN(f*s)&&s!==""?(_=new ti(this._pt,e,t,+f||0,s-(f||0),typeof u=="boolean"?ST:Dg,0,d),c&&(_.fp=c),o&&_.modifier(o,this,e),this._pt=_):(!u&&!(t in e)&&Eu(t,s),dT.call(this,e,t,f,s,d,l||pi.stringFilter,c))},pT=function(e,t,i,s,r){if(xt(e)&&(e=la(e,r,t,i,s)),!Ki(e)||e.style&&e.nodeType||Vt(e)||Jm(e))return Ot(e)?la(e,r,t,i,s):e;var a={},o;for(o in e)a[o]=la(e[o],r,t,i,s);return a},Cg=function(e,t,i,s,r,a){var o,l,c,h;if(li[e]&&(o=new li[e]).init(r,o.rawVars?t[e]:pT(t[e],s,r,a,i),i,s,a)!==!1&&(i._pt=l=new ti(i._pt,r,e,0,1,o.render,o,0,o.priority),i!==cr))for(c=i._ptLookup[i._targets.indexOf(r)],h=o._props.length;h--;)c[o._props[h]]=l;return o},Pn,Mh,Lu=function n(e,t,i){var s=e.vars,r=s.ease,a=s.startAt,o=s.immediateRender,l=s.lazy,c=s.onUpdate,h=s.runBackwards,u=s.yoyoEase,f=s.keyframes,d=s.autoRevert,_=e._dur,m=e._startAt,g=e._targets,p=e.parent,x=p&&p.data==="nested"?p.vars.targets:g,M=e._overwrite==="auto"&&!yu,y=e.timeline,w,E,P,L,v,b,N,k,F,Y,q,G,V;if(y&&(!f||!r)&&(r="none"),e._ease=ms(r,yr.ease),e._yEase=u?Eg(ms(u===!0?r:u,yr.ease)):0,u&&e._yoyo&&!e._repeat&&(u=e._yEase,e._yEase=e._ease,e._ease=u),e._from=!y&&!!s.runBackwards,!y||f&&!s.stagger){if(k=g[0]?ds(g[0]).harness:0,G=k&&s[k.prop],w=Bo(s,Tu),m&&(m._zTime<0&&m.progress(1),t<0&&h&&o&&!d?m.render(-1,!0):m.revert(h&&_?Po:HE),m._lazy=0),a){if(Un(e._startAt=Et.set(g,_i({data:"isStart",overwrite:!1,parent:p,immediateRender:!0,lazy:!m&&Qt(l),startAt:null,delay:0,onUpdate:c&&function(){return ui(e,"onUpdate")},stagger:0},a))),e._startAt._dp=0,e._startAt._sat=e,t<0&&(Ft||!o&&!d)&&e._startAt.revert(Po),o&&_&&t<=0&&i<=0){t&&(e._zTime=t);return}}else if(h&&_&&!m){if(t&&(o=!1),P=_i({overwrite:!1,data:"isFromStart",lazy:o&&!m&&Qt(l),immediateRender:o,stagger:0,parent:p},w),G&&(P[k.prop]=G),Un(e._startAt=Et.set(g,P)),e._startAt._dp=0,e._startAt._sat=e,t<0&&(Ft?e._startAt.revert(Po):e._startAt.render(-1,!0)),e._zTime=t,!o)n(e._startAt,at,at);else if(!t)return}for(e._pt=e._ptCache=0,l=_&&Qt(l)||l&&!_,E=0;E<g.length;E++){if(v=g[E],N=v._gsap||Pu(g)[E]._gsap,e._ptLookup[E]=Y={},_h[N.id]&&Ln.length&&ko(),q=x===g?E:x.indexOf(v),k&&(F=new k).init(v,G||w,e,q,x)!==!1&&(e._pt=L=new ti(e._pt,v,F.name,0,1,F.render,F,0,F.priority),F._props.forEach(function(Q){Y[Q]=L}),F.priority&&(b=1)),!k||G)for(P in w)li[P]&&(F=Cg(P,w,e,q,v,x))?F.priority&&(b=1):Y[P]=L=Ru.call(e,v,P,"get",w[P],q,x,0,s.stringFilter);e._op&&e._op[E]&&e.kill(v,e._op[E]),M&&e._pt&&(Pn=e,ft.killTweensOf(v,Y,e.globalTime(t)),V=!e.parent,Pn=0),e._pt&&l&&(_h[N.id]=1)}b&&Og(e),e._onInit&&e._onInit(e)}e._onUpdate=c,e._initted=(!e._op||e._pt)&&!V,f&&t<=0&&y.render(bi,!0,!0)},mT=function(e,t,i,s,r,a,o,l){var c=(e._pt&&e._ptCache||(e._ptCache={}))[t],h,u,f,d;if(!c)for(c=e._ptCache[t]=[],f=e._ptLookup,d=e._targets.length;d--;){if(h=f[d][t],h&&h.d&&h.d._pt)for(h=h.d._pt;h&&h.p!==t&&h.fp!==t;)h=h._next;if(!h)return Mh=1,e.vars[t]="+=0",Lu(e,o),Mh=0,l?wa(t+" not eligible for reset"):1;c.push(h)}for(d=c.length;d--;)u=c[d],h=u._pt||u,h.s=(s||s===0)&&!r?s:h.s+(s||0)+a*h.c,h.c=i-h.s,u.e&&(u.e=St(i)+zt(u.e)),u.b&&(u.b=h.s+zt(u.b))},gT=function(e,t){var i=e[0]?ds(e[0]).harness:0,s=i&&i.aliases,r,a,o,l;if(!s)return t;r=wr({},t);for(a in s)if(a in r)for(l=s[a].split(","),o=l.length;o--;)r[l[o]]=r[a];return r},_T=function(e,t,i,s){var r=t.ease||s||"power1.inOut",a,o;if(Vt(t))o=i[e]||(i[e]=[]),t.forEach(function(l,c){return o.push({t:c/(t.length-1)*100,v:l,e:r})});else for(a in t)o=i[a]||(i[a]=[]),a==="ease"||o.push({t:parseFloat(e),v:t[a],e:r})},la=function(e,t,i,s,r){return xt(e)?e.call(t,i,s,r):Ot(e)&&~e.indexOf("random(")?ba(e):e},Rg=Au+"repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert",Lg={};ei(Rg+",id,stagger,delay,duration,paused,scrollTrigger",function(n){return Lg[n]=1});var Et=(function(n){Km(e,n);function e(i,s,r,a){var o;typeof s=="number"&&(r.duration=s,s=r,r=null),o=n.call(this,a?s:aa(s))||this;var l=o.vars,c=l.duration,h=l.delay,u=l.immediateRender,f=l.stagger,d=l.overwrite,_=l.keyframes,m=l.defaults,g=l.scrollTrigger,p=l.yoyoEase,x=s.parent||ft,M=(Vt(i)||Jm(i)?dn(i[0]):"length"in s)?[i]:Ei(i),y,w,E,P,L,v,b,N;if(o._targets=M.length?Pu(M):wa("GSAP target "+i+" not found. https://gsap.com",!pi.nullTargetWarn)||[],o._ptLookup=[],o._overwrite=d,_||f||fo(c)||fo(h)){if(s=o.vars,y=o.timeline=new Wt({data:"nested",defaults:m||{},targets:x&&x.data==="nested"?x.vars.targets:M}),y.kill(),y.parent=y._dp=sn(o),y._start=0,f||fo(c)||fo(h)){if(P=M.length,b=f&&mg(f),Ki(f))for(L in f)~Rg.indexOf(L)&&(N||(N={}),N[L]=f[L]);for(w=0;w<P;w++)E=Bo(s,Lg),E.stagger=0,p&&(E.yoyoEase=p),N&&wr(E,N),v=M[w],E.duration=+la(c,sn(o),w,v,M),E.delay=(+la(h,sn(o),w,v,M)||0)-o._delay,!f&&P===1&&E.delay&&(o._delay=h=E.delay,o._start+=h,E.delay=0),y.to(v,E,b?b(w,v,M):0),y._ease=We.none;y.duration()?c=h=0:o.timeline=0}else if(_){aa(_i(y.vars.defaults,{ease:"none"})),y._ease=ms(_.ease||s.ease||"none");var k=0,F,Y,q;if(Vt(_))_.forEach(function(G){return y.to(M,G,">")}),y.duration();else{E={};for(L in _)L==="ease"||L==="easeEach"||_T(L,_[L],E,_.easeEach);for(L in E)for(F=E[L].sort(function(G,V){return G.t-V.t}),k=0,w=0;w<F.length;w++)Y=F[w],q={ease:Y.e,duration:(Y.t-(w?F[w-1].t:0))/100*c},q[L]=Y.v,y.to(M,q,k),k+=q.duration;y.duration()<c&&y.to({},{duration:c-y.duration()})}}c||o.duration(c=y.duration())}else o.timeline=0;return d===!0&&!yu&&(Pn=sn(o),ft.killTweensOf(M),Pn=0),Hi(x,sn(o),r),s.reversed&&o.reverse(),s.paused&&o.paused(!0),(u||!c&&!_&&o._start===ut(x._time)&&Qt(u)&&jE(sn(o))&&x.data!=="nested")&&(o._tTime=-at,o.render(Math.max(0,-h)||0)),g&&ug(sn(o),g),o}var t=e.prototype;return t.render=function(s,r,a){var o=this._time,l=this._tDur,c=this._dur,h=s<0,u=s>l-at&&!h?l:s<at?0:s,f,d,_,m,g,p,x,M,y;if(!c)KE(this,s,r,a);else if(u!==this._tTime||!s||a||!this._initted&&this._tTime||this._startAt&&this._zTime<0!==h||this._lazy){if(f=u,M=this.timeline,this._repeat){if(m=c+this._rDelay,this._repeat<-1&&h)return this.totalTime(m*100+s,r,a);if(f=ut(u%m),u===l?(_=this._repeat,f=c):(g=ut(u/m),_=~~g,_&&_===g?(f=c,_--):f>c&&(f=c)),p=this._yoyo&&_&1,p&&(y=this._yEase,f=c-f),g=Mr(this._tTime,m),f===o&&!a&&this._initted&&_===g)return this._tTime=u,this;_!==g&&(M&&this._yEase&&Tg(M,p),this.vars.repeatRefresh&&!p&&!this._lock&&f!==m&&this._initted&&(this._lock=a=1,this.render(ut(m*_),!0).invalidate()._lock=0))}if(!this._initted){if(fg(this,h?s:f,a,r,u))return this._tTime=0,this;if(o!==this._time&&!(a&&this.vars.repeatRefresh&&_!==g))return this;if(c!==this._dur)return this.render(s,r,a)}if(this._tTime=u,this._time=f,!this._act&&this._ts&&(this._act=1,this._lazy=0),this.ratio=x=(y||this._ease)(f/c),this._from&&(this.ratio=x=1-x),!o&&u&&!r&&!g&&(ui(this,"onStart"),this._tTime!==u))return this;for(d=this._pt;d;)d.r(x,d.d),d=d._next;M&&M.render(s<0?s:M._dur*M._ease(f/this._dur),r,a)||this._startAt&&(this._zTime=s),this._onUpdate&&!r&&(h&&vh(this,s,r,a),ui(this,"onUpdate")),this._repeat&&_!==g&&this.vars.onRepeat&&!r&&this.parent&&ui(this,"onRepeat"),(u===this._tDur||!u)&&this._tTime===u&&(h&&!this._onUpdate&&vh(this,s,!0,!0),(s||!c)&&(u===this._tDur&&this._ts>0||!u&&this._ts<0)&&Un(this,1),!r&&!(h&&!o)&&(u||o||p)&&(ui(this,u===l?"onComplete":"onReverseComplete",!0),this._prom&&!(u<l&&this.timeScale()>0)&&this._prom()))}return this},t.targets=function(){return this._targets},t.invalidate=function(s){return(!s||!this.vars.runBackwards)&&(this._startAt=0),this._pt=this._op=this._onUpdate=this._lazy=this.ratio=0,this._ptLookup=[],this.timeline&&this.timeline.invalidate(s),n.prototype.invalidate.call(this,s)},t.resetTo=function(s,r,a,o,l){Ea||ci.wake(),this._ts||this.play();var c=Math.min(this._dur,(this._dp._time-this._start)*this._ts),h;return this._initted||Lu(this,c),h=this._ease(c/this._dur),mT(this,s,r,a,o,h,c,l)?this.resetTo(s,r,a,o,1):(al(this,0),this.parent||cg(this._dp,this,"_first","_last",this._dp._sort?"_start":0),this.render(0))},t.kill=function(s,r){if(r===void 0&&(r="all"),!s&&(!r||r==="all"))return this._lazy=this._pt=0,this.parent?Qr(this):this.scrollTrigger&&this.scrollTrigger.kill(!!Ft),this;if(this.timeline){var a=this.timeline.totalDuration();return this.timeline.killTweensOf(s,r,Pn&&Pn.vars.overwrite!==!0)._first||Qr(this),this.parent&&a!==this.timeline.totalDuration()&&br(this,this._dur*this.timeline._tDur/a,0,1),this}var o=this._targets,l=s?Ei(s):o,c=this._ptLookup,h=this._pt,u,f,d,_,m,g,p;if((!r||r==="all")&&qE(o,l))return r==="all"&&(this._pt=0),Qr(this);for(u=this._op=this._op||[],r!=="all"&&(Ot(r)&&(m={},ei(r,function(x){return m[x]=1}),r=m),r=gT(o,r)),p=o.length;p--;)if(~l.indexOf(o[p])){f=c[p],r==="all"?(u[p]=r,_=f,d={}):(d=u[p]=u[p]||{},_=r);for(m in _)g=f&&f[m],g&&((!("kill"in g.d)||g.d.kill(m)===!0)&&sl(this,g,"_pt"),delete f[m]),d!=="all"&&(d[m]=1)}return this._initted&&!this._pt&&h&&Qr(this),this},e.to=function(s,r){return new e(s,r,arguments[2])},e.from=function(s,r){return oa(1,arguments)},e.delayedCall=function(s,r,a,o){return new e(r,0,{immediateRender:!1,lazy:!1,overwrite:!1,delay:s,onComplete:r,onReverseComplete:r,onCompleteParams:a,onReverseCompleteParams:a,callbackScope:o})},e.fromTo=function(s,r,a){return oa(2,arguments)},e.set=function(s,r){return r.duration=0,r.repeatDelay||(r.repeat=0),new e(s,r)},e.killTweensOf=function(s,r,a){return ft.killTweensOf(s,r,a)},e})(Ta);_i(Et.prototype,{_targets:[],_lazy:0,_startAt:0,_op:0,_onInit:0});ei("staggerTo,staggerFrom,staggerFromTo",function(n){Et[n]=function(){var e=new Wt,t=Sh.call(arguments,0);return t.splice(n==="staggerFromTo"?5:4,0,0),e[n].apply(e,t)}});var Iu=function(e,t,i){return e[t]=i},Ig=function(e,t,i){return e[t](i)},vT=function(e,t,i,s){return e[t](s.fp,i)},xT=function(e,t,i){return e.setAttribute(t,i)},Du=function(e,t){return xt(e[t])?Ig:wu(e[t])&&e.setAttribute?xT:Iu},Dg=function(e,t){return t.set(t.t,t.p,Math.round((t.s+t.c*e)*1e6)/1e6,t)},ST=function(e,t){return t.set(t.t,t.p,!!(t.s+t.c*e),t)},Ng=function(e,t){var i=t._pt,s="";if(!e&&t.b)s=t.b;else if(e===1&&t.e)s=t.e;else{for(;i;)s=i.p+(i.m?i.m(i.s+i.c*e):Math.round((i.s+i.c*e)*1e4)/1e4)+s,i=i._next;s+=t.c}t.set(t.t,t.p,s,t)},Nu=function(e,t){for(var i=t._pt;i;)i.r(e,i.d),i=i._next},yT=function(e,t,i,s){for(var r=this._pt,a;r;)a=r._next,r.p===s&&r.modifier(e,t,i),r=a},wT=function(e){for(var t=this._pt,i,s;t;)s=t._next,t.p===e&&!t.op||t.op===e?sl(this,t,"_pt"):t.dep||(i=1),t=s;return!i},MT=function(e,t,i,s){s.mSet(e,t,s.m.call(s.tween,i,s.mt),s)},Og=function(e){for(var t=e._pt,i,s,r,a;t;){for(i=t._next,s=r;s&&s.pr>t.pr;)s=s._next;(t._prev=s?s._prev:a)?t._prev._next=t:r=t,(t._next=s)?s._prev=t:a=t,t=i}e._pt=r},ti=(function(){function n(t,i,s,r,a,o,l,c,h){this.t=i,this.s=r,this.c=a,this.p=s,this.r=o||Dg,this.d=l||this,this.set=c||Iu,this.pr=h||0,this._next=t,t&&(t._prev=this)}var e=n.prototype;return e.modifier=function(i,s,r){this.mSet=this.mSet||this.set,this.set=MT,this.m=i,this.mt=r,this.tween=s},n})();ei(Au+"parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger",function(n){return Tu[n]=1});gi.TweenMax=gi.TweenLite=Et;gi.TimelineLite=gi.TimelineMax=Wt;ft=new Wt({sortChildren:!1,defaults:yr,autoRemoveChildren:!0,id:"root",smoothChildTiming:!0});pi.stringFilter=bg;var gs=[],Ro={},bT=[],gd=0,ET=0,Kl=function(e){return(Ro[e]||bT).map(function(t){return t()})},bh=function(){var e=Date.now(),t=[];e-gd>2&&(Kl("matchMediaInit"),gs.forEach(function(i){var s=i.queries,r=i.conditions,a,o,l,c;for(o in s)a=zi.matchMedia(s[o]).matches,a&&(l=1),a!==r[o]&&(r[o]=a,c=1);c&&(i.revert(),l&&t.push(i))}),Kl("matchMediaRevert"),t.forEach(function(i){return i.onMatch(i,function(s){return i.add(null,s)})}),gd=e,Kl("matchMedia"))},Ug=(function(){function n(t,i){this.selector=i&&yh(i),this.data=[],this._r=[],this.isReverted=!1,this.id=ET++,t&&this.add(t)}var e=n.prototype;return e.add=function(i,s,r){xt(i)&&(r=s,s=i,i=xt);var a=this,o=function(){var c=ht,h=a.selector,u;return c&&c!==a&&c.data.push(a),r&&(a.selector=yh(r)),ht=a,u=s.apply(a,arguments),xt(u)&&a._r.push(u),ht=c,a.selector=h,a.isReverted=!1,u};return a.last=o,i===xt?o(a,function(l){return a.add(null,l)}):i?a[i]=o:o},e.ignore=function(i){var s=ht;ht=null,i(this),ht=s},e.getTweens=function(){var i=[];return this.data.forEach(function(s){return s instanceof n?i.push.apply(i,s.getTweens()):s instanceof Et&&!(s.parent&&s.parent.data==="nested")&&i.push(s)}),i},e.clear=function(){this._r.length=this.data.length=0},e.kill=function(i,s){var r=this;if(i?(function(){for(var o=r.getTweens(),l=r.data.length,c;l--;)c=r.data[l],c.data==="isFlip"&&(c.revert(),c.getChildren(!0,!0,!1).forEach(function(h){return o.splice(o.indexOf(h),1)}));for(o.map(function(h){return{g:h._dur||h._delay||h._sat&&!h._sat.vars.immediateRender?h.globalTime(0):-1/0,t:h}}).sort(function(h,u){return u.g-h.g||-1/0}).forEach(function(h){return h.t.revert(i)}),l=r.data.length;l--;)c=r.data[l],c instanceof Wt?c.data!=="nested"&&(c.scrollTrigger&&c.scrollTrigger.revert(),c.kill()):!(c instanceof Et)&&c.revert&&c.revert(i);r._r.forEach(function(h){return h(i,r)}),r.isReverted=!0})():this.data.forEach(function(o){return o.kill&&o.kill()}),this.clear(),s)for(var a=gs.length;a--;)gs[a].id===this.id&&gs.splice(a,1)},e.revert=function(i){this.kill(i||{})},n})(),TT=(function(){function n(t){this.contexts=[],this.scope=t,ht&&ht.data.push(this)}var e=n.prototype;return e.add=function(i,s,r){Ki(i)||(i={matches:i});var a=new Ug(0,r||this.scope),o=a.conditions={},l,c,h;ht&&!a.selector&&(a.selector=ht.selector),this.contexts.push(a),s=a.add("onMatch",s),a.queries=i;for(c in i)c==="all"?h=1:(l=zi.matchMedia(i[c]),l&&(gs.indexOf(a)<0&&gs.push(a),(o[c]=l.matches)&&(h=1),l.addListener?l.addListener(bh):l.addEventListener("change",bh)));return h&&s(a,function(u){return a.add(null,u)}),this},e.revert=function(i){this.kill(i||{})},e.kill=function(i){this.contexts.forEach(function(s){return s.kill(i,!0)})},n})(),Vo={registerPlugin:function(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];t.forEach(function(s){return yg(s)})},timeline:function(e){return new Wt(e)},getTweensOf:function(e,t){return ft.getTweensOf(e,t)},getProperty:function(e,t,i,s){Ot(e)&&(e=Ei(e)[0]);var r=ds(e||{}).get,a=i?lg:og;return i==="native"&&(i=""),e&&(t?a((li[t]&&li[t].get||r)(e,t,i,s)):function(o,l,c){return a((li[o]&&li[o].get||r)(e,o,l,c))})},quickSetter:function(e,t,i){if(e=Ei(e),e.length>1){var s=e.map(function(h){return ni.quickSetter(h,t,i)}),r=s.length;return function(h){for(var u=r;u--;)s[u](h)}}e=e[0]||{};var a=li[t],o=ds(e),l=o.harness&&(o.harness.aliases||{})[t]||t,c=a?function(h){var u=new a;cr._pt=0,u.init(e,i?h+i:h,cr,0,[e]),u.render(1,u),cr._pt&&Nu(1,cr)}:o.set(e,l);return a?c:function(h){return c(e,l,i?h+i:h,o,1)}},quickTo:function(e,t,i){var s,r=ni.to(e,_i((s={},s[t]="+=0.1",s.paused=!0,s.stagger=0,s),i||{})),a=function(l,c,h){return r.resetTo(t,l,c,h)};return a.tween=r,a},isTweening:function(e){return ft.getTweensOf(e,!0).length>0},defaults:function(e){return e&&e.ease&&(e.ease=ms(e.ease,yr.ease)),ud(yr,e||{})},config:function(e){return ud(pi,e||{})},registerEffect:function(e){var t=e.name,i=e.effect,s=e.plugins,r=e.defaults,a=e.extendTimeline;(s||"").split(",").forEach(function(o){return o&&!li[o]&&!gi[o]&&wa(t+" effect requires "+o+" plugin.")}),ql[t]=function(o,l,c){return i(Ei(o),_i(l||{},r),c)},a&&(Wt.prototype[t]=function(o,l,c){return this.add(ql[t](o,Ki(l)?l:(c=l)&&{},this),c)})},registerEase:function(e,t){We[e]=ms(t)},parseEase:function(e,t){return arguments.length?ms(e,t):We},getById:function(e){return ft.getById(e)},exportRoot:function(e,t){e===void 0&&(e={});var i=new Wt(e),s,r;for(i.smoothChildTiming=Qt(e.smoothChildTiming),ft.remove(i),i._dp=0,i._time=i._tTime=ft._time,s=ft._first;s;)r=s._next,(t||!(!s._dur&&s instanceof Et&&s.vars.onComplete===s._targets[0]))&&Hi(i,s,s._start-s._delay),s=r;return Hi(ft,i,0),i},context:function(e,t){return e?new Ug(e,t):ht},matchMedia:function(e){return new TT(e)},matchMediaRefresh:function(){return gs.forEach(function(e){var t=e.conditions,i,s;for(s in t)t[s]&&(t[s]=!1,i=1);i&&e.revert()})||bh()},addEventListener:function(e,t){var i=Ro[e]||(Ro[e]=[]);~i.indexOf(t)||i.push(t)},removeEventListener:function(e,t){var i=Ro[e],s=i&&i.indexOf(t);s>=0&&i.splice(s,1)},utils:{wrap:sT,wrapYoyo:rT,distribute:mg,random:_g,snap:gg,normalize:nT,getUnit:zt,clamp:QE,splitColor:wg,toArray:Ei,selector:yh,mapRange:xg,pipe:tT,unitize:iT,interpolate:aT,shuffle:pg},install:ig,effects:ql,ticker:ci,updateRoot:Wt.updateRoot,plugins:li,globalTimeline:ft,core:{PropTween:ti,globals:ng,Tween:Et,Timeline:Wt,Animation:Ta,getCache:ds,_removeLinkedListItem:sl,reverting:function(){return Ft},context:function(e){return e&&ht&&(ht.data.push(e),e._ctx=ht),ht},suppressOverwrites:function(e){return yu=e}}};ei("to,from,fromTo,delayedCall,set,killTweensOf",function(n){return Vo[n]=Et[n]});ci.add(Wt.updateRoot);cr=Vo.to({},{duration:0});var AT=function(e,t){for(var i=e._pt;i&&i.p!==t&&i.op!==t&&i.fp!==t;)i=i._next;return i},PT=function(e,t){var i=e._targets,s,r,a;for(s in t)for(r=i.length;r--;)a=e._ptLookup[r][s],a&&(a=a.d)&&(a._pt&&(a=AT(a,s)),a&&a.modifier&&a.modifier(t[s],e,i[r],s))},Zl=function(e,t){return{name:e,headless:1,rawVars:1,init:function(s,r,a){a._onInit=function(o){var l,c;if(Ot(r)&&(l={},ei(r,function(h){return l[h]=1}),r=l),t){l={};for(c in r)l[c]=t(r[c]);r=l}PT(o,r)}}}},ni=Vo.registerPlugin({name:"attr",init:function(e,t,i,s,r){var a,o,l;this.tween=i;for(a in t)l=e.getAttribute(a)||"",o=this.add(e,"setAttribute",(l||0)+"",t[a],s,r,0,0,a),o.op=a,o.b=l,this._props.push(a)},render:function(e,t){for(var i=t._pt;i;)Ft?i.set(i.t,i.p,i.b,i):i.r(e,i.d),i=i._next}},{name:"endArray",headless:1,init:function(e,t){for(var i=t.length;i--;)this.add(e,i,e[i]||0,t[i],0,0,0,0,0,1)}},Zl("roundProps",wh),Zl("modifiers"),Zl("snap",gg))||Vo;Et.version=Wt.version=ni.version="3.14.2";tg=1;Mu()&&Er();We.Power0;We.Power1;We.Power2;We.Power3;We.Power4;We.Linear;We.Quad;We.Cubic;We.Quart;We.Quint;We.Strong;We.Elastic;We.Back;We.SteppedEase;We.Bounce;We.Sine;We.Expo;We.Circ;var _d,Cn,pr,Ou,ls,vd,Uu,CT=function(){return typeof window<"u"},pn={},es=180/Math.PI,mr=Math.PI/180,Hs=Math.atan2,xd=1e8,Fu=/([A-Z])/g,RT=/(left|right|width|margin|padding|x)/i,LT=/[\s,\(]\S/,Gi={autoAlpha:"opacity,visibility",scale:"scaleX,scaleY",alpha:"opacity"},Eh=function(e,t){return t.set(t.t,t.p,Math.round((t.s+t.c*e)*1e4)/1e4+t.u,t)},IT=function(e,t){return t.set(t.t,t.p,e===1?t.e:Math.round((t.s+t.c*e)*1e4)/1e4+t.u,t)},DT=function(e,t){return t.set(t.t,t.p,e?Math.round((t.s+t.c*e)*1e4)/1e4+t.u:t.b,t)},NT=function(e,t){return t.set(t.t,t.p,e===1?t.e:e?Math.round((t.s+t.c*e)*1e4)/1e4+t.u:t.b,t)},OT=function(e,t){var i=t.s+t.c*e;t.set(t.t,t.p,~~(i+(i<0?-.5:.5))+t.u,t)},Fg=function(e,t){return t.set(t.t,t.p,e?t.e:t.b,t)},kg=function(e,t){return t.set(t.t,t.p,e!==1?t.b:t.e,t)},UT=function(e,t,i){return e.style[t]=i},FT=function(e,t,i){return e.style.setProperty(t,i)},kT=function(e,t,i){return e._gsap[t]=i},BT=function(e,t,i){return e._gsap.scaleX=e._gsap.scaleY=i},zT=function(e,t,i,s,r){var a=e._gsap;a.scaleX=a.scaleY=i,a.renderTransform(r,a)},VT=function(e,t,i,s,r){var a=e._gsap;a[t]=i,a.renderTransform(r,a)},dt="transform",ii=dt+"Origin",HT=function n(e,t){var i=this,s=this.target,r=s.style,a=s._gsap;if(e in pn&&r){if(this.tfm=this.tfm||{},e!=="transform")e=Gi[e]||e,~e.indexOf(",")?e.split(",").forEach(function(o){return i.tfm[o]=rn(s,o)}):this.tfm[e]=a.x?a[e]:rn(s,e),e===ii&&(this.tfm.zOrigin=a.zOrigin);else return Gi.transform.split(",").forEach(function(o){return n.call(i,o,t)});if(this.props.indexOf(dt)>=0)return;a.svg&&(this.svgo=s.getAttribute("data-svg-origin"),this.props.push(ii,t,"")),e=dt}(r||t)&&this.props.push(e,t,r[e])},Bg=function(e){e.translate&&(e.removeProperty("translate"),e.removeProperty("scale"),e.removeProperty("rotate"))},$T=function(){var e=this.props,t=this.target,i=t.style,s=t._gsap,r,a;for(r=0;r<e.length;r+=3)e[r+1]?e[r+1]===2?t[e[r]](e[r+2]):t[e[r]]=e[r+2]:e[r+2]?i[e[r]]=e[r+2]:i.removeProperty(e[r].substr(0,2)==="--"?e[r]:e[r].replace(Fu,"-$1").toLowerCase());if(this.tfm){for(a in this.tfm)s[a]=this.tfm[a];s.svg&&(s.renderTransform(),t.setAttribute("data-svg-origin",this.svgo||"")),r=Uu(),(!r||!r.isStart)&&!i[dt]&&(Bg(i),s.zOrigin&&i[ii]&&(i[ii]+=" "+s.zOrigin+"px",s.zOrigin=0,s.renderTransform()),s.uncache=1)}},zg=function(e,t){var i={target:e,props:[],revert:$T,save:HT};return e._gsap||ni.core.getCache(e),t&&e.style&&e.nodeType&&t.split(",").forEach(function(s){return i.save(s)}),i},Vg,Th=function(e,t){var i=Cn.createElementNS?Cn.createElementNS((t||"http://www.w3.org/1999/xhtml").replace(/^https/,"http"),e):Cn.createElement(e);return i&&i.style?i:Cn.createElement(e)},fi=function n(e,t,i){var s=getComputedStyle(e);return s[t]||s.getPropertyValue(t.replace(Fu,"-$1").toLowerCase())||s.getPropertyValue(t)||!i&&n(e,Tr(t)||t,1)||""},Sd="O,Moz,ms,Ms,Webkit".split(","),Tr=function(e,t,i){var s=t||ls,r=s.style,a=5;if(e in r&&!i)return e;for(e=e.charAt(0).toUpperCase()+e.substr(1);a--&&!(Sd[a]+e in r););return a<0?null:(a===3?"ms":a>=0?Sd[a]:"")+e},Ah=function(){CT()&&window.document&&(_d=window,Cn=_d.document,pr=Cn.documentElement,ls=Th("div")||{style:{}},Th("div"),dt=Tr(dt),ii=dt+"Origin",ls.style.cssText="border-width:0;line-height:0;position:absolute;padding:0",Vg=!!Tr("perspective"),Uu=ni.core.reverting,Ou=1)},yd=function(e){var t=e.ownerSVGElement,i=Th("svg",t&&t.getAttribute("xmlns")||"http://www.w3.org/2000/svg"),s=e.cloneNode(!0),r;s.style.display="block",i.appendChild(s),pr.appendChild(i);try{r=s.getBBox()}catch{}return i.removeChild(s),pr.removeChild(i),r},wd=function(e,t){for(var i=t.length;i--;)if(e.hasAttribute(t[i]))return e.getAttribute(t[i])},Hg=function(e){var t,i;try{t=e.getBBox()}catch{t=yd(e),i=1}return t&&(t.width||t.height)||i||(t=yd(e)),t&&!t.width&&!t.x&&!t.y?{x:+wd(e,["x","cx","x1"])||0,y:+wd(e,["y","cy","y1"])||0,width:0,height:0}:t},$g=function(e){return!!(e.getCTM&&(!e.parentNode||e.ownerSVGElement)&&Hg(e))},Fn=function(e,t){if(t){var i=e.style,s;t in pn&&t!==ii&&(t=dt),i.removeProperty?(s=t.substr(0,2),(s==="ms"||t.substr(0,6)==="webkit")&&(t="-"+t),i.removeProperty(s==="--"?t:t.replace(Fu,"-$1").toLowerCase())):i.removeAttribute(t)}},Rn=function(e,t,i,s,r,a){var o=new ti(e._pt,t,i,0,1,a?kg:Fg);return e._pt=o,o.b=s,o.e=r,e._props.push(i),o},Md={deg:1,rad:1,turn:1},GT={grid:1,flex:1},kn=function n(e,t,i,s){var r=parseFloat(i)||0,a=(i+"").trim().substr((r+"").length)||"px",o=ls.style,l=RT.test(t),c=e.tagName.toLowerCase()==="svg",h=(c?"client":"offset")+(l?"Width":"Height"),u=100,f=s==="px",d=s==="%",_,m,g,p;if(s===a||!r||Md[s]||Md[a])return r;if(a!=="px"&&!f&&(r=n(e,t,i,"px")),p=e.getCTM&&$g(e),(d||a==="%")&&(pn[t]||~t.indexOf("adius")))return _=p?e.getBBox()[l?"width":"height"]:e[h],St(d?r/_*u:r/100*_);if(o[l?"width":"height"]=u+(f?a:s),m=s!=="rem"&&~t.indexOf("adius")||s==="em"&&e.appendChild&&!c?e:e.parentNode,p&&(m=(e.ownerSVGElement||{}).parentNode),(!m||m===Cn||!m.appendChild)&&(m=Cn.body),g=m._gsap,g&&d&&g.width&&l&&g.time===ci.time&&!g.uncache)return St(r/g.width*u);if(d&&(t==="height"||t==="width")){var x=e.style[t];e.style[t]=u+s,_=e[h],x?e.style[t]=x:Fn(e,t)}else(d||a==="%")&&!GT[fi(m,"display")]&&(o.position=fi(e,"position")),m===e&&(o.position="static"),m.appendChild(ls),_=ls[h],m.removeChild(ls),o.position="absolute";return l&&d&&(g=ds(m),g.time=ci.time,g.width=m[h]),St(f?_*r/u:_&&r?u/_*r:0)},rn=function(e,t,i,s){var r;return Ou||Ah(),t in Gi&&t!=="transform"&&(t=Gi[t],~t.indexOf(",")&&(t=t.split(",")[0])),pn[t]&&t!=="transform"?(r=Pa(e,s),r=t!=="transformOrigin"?r[t]:r.svg?r.origin:$o(fi(e,ii))+" "+r.zOrigin+"px"):(r=e.style[t],(!r||r==="auto"||s||~(r+"").indexOf("calc("))&&(r=Ho[t]&&Ho[t](e,t,i)||fi(e,t)||rg(e,t)||(t==="opacity"?1:0))),i&&!~(r+"").trim().indexOf(" ")?kn(e,t,r,i)+i:r},WT=function(e,t,i,s){if(!i||i==="none"){var r=Tr(t,e,1),a=r&&fi(e,r,1);a&&a!==i?(t=r,i=a):t==="borderColor"&&(i=fi(e,"borderTopColor"))}var o=new ti(this._pt,e.style,t,0,1,Ng),l=0,c=0,h,u,f,d,_,m,g,p,x,M,y,w;if(o.b=i,o.e=s,i+="",s+="",s.substring(0,6)==="var(--"&&(s=fi(e,s.substring(4,s.indexOf(")")))),s==="auto"&&(m=e.style[t],e.style[t]=s,s=fi(e,t)||s,m?e.style[t]=m:Fn(e,t)),h=[i,s],bg(h),i=h[0],s=h[1],f=i.match(lr)||[],w=s.match(lr)||[],w.length){for(;u=lr.exec(s);)g=u[0],x=s.substring(l,u.index),_?_=(_+1)%5:(x.substr(-5)==="rgba("||x.substr(-5)==="hsla(")&&(_=1),g!==(m=f[c++]||"")&&(d=parseFloat(m)||0,y=m.substr((d+"").length),g.charAt(1)==="="&&(g=dr(d,g)+y),p=parseFloat(g),M=g.substr((p+"").length),l=lr.lastIndex-M.length,M||(M=M||pi.units[t]||y,l===s.length&&(s+=M,o.e+=M)),y!==M&&(d=kn(e,t,m,M)||0),o._pt={_next:o._pt,p:x||c===1?x:",",s:d,c:p-d,m:_&&_<4||t==="zIndex"?Math.round:0});o.c=l<s.length?s.substring(l,s.length):""}else o.r=t==="display"&&s==="none"?kg:Fg;return eg.test(s)&&(o.e=0),this._pt=o,o},bd={top:"0%",bottom:"100%",left:"0%",right:"100%",center:"50%"},qT=function(e){var t=e.split(" "),i=t[0],s=t[1]||"50%";return(i==="top"||i==="bottom"||s==="left"||s==="right")&&(e=i,i=s,s=e),t[0]=bd[i]||i,t[1]=bd[s]||s,t.join(" ")},XT=function(e,t){if(t.tween&&t.tween._time===t.tween._dur){var i=t.t,s=i.style,r=t.u,a=i._gsap,o,l,c;if(r==="all"||r===!0)s.cssText="",l=1;else for(r=r.split(","),c=r.length;--c>-1;)o=r[c],pn[o]&&(l=1,o=o==="transformOrigin"?ii:dt),Fn(i,o);l&&(Fn(i,dt),a&&(a.svg&&i.removeAttribute("transform"),s.scale=s.rotate=s.translate="none",Pa(i,1),a.uncache=1,Bg(s)))}},Ho={clearProps:function(e,t,i,s,r){if(r.data!=="isFromStart"){var a=e._pt=new ti(e._pt,t,i,0,0,XT);return a.u=s,a.pr=-10,a.tween=r,e._props.push(i),1}}},Aa=[1,0,0,1,0,0],Gg={},Wg=function(e){return e==="matrix(1, 0, 0, 1, 0, 0)"||e==="none"||!e},Ed=function(e){var t=fi(e,dt);return Wg(t)?Aa:t.substr(7).match(Qm).map(St)},ku=function(e,t){var i=e._gsap||ds(e),s=e.style,r=Ed(e),a,o,l,c;return i.svg&&e.getAttribute("transform")?(l=e.transform.baseVal.consolidate().matrix,r=[l.a,l.b,l.c,l.d,l.e,l.f],r.join(",")==="1,0,0,1,0,0"?Aa:r):(r===Aa&&!e.offsetParent&&e!==pr&&!i.svg&&(l=s.display,s.display="block",a=e.parentNode,(!a||!e.offsetParent&&!e.getBoundingClientRect().width)&&(c=1,o=e.nextElementSibling,pr.appendChild(e)),r=Ed(e),l?s.display=l:Fn(e,"display"),c&&(o?a.insertBefore(e,o):a?a.appendChild(e):pr.removeChild(e))),t&&r.length>6?[r[0],r[1],r[4],r[5],r[12],r[13]]:r)},Ph=function(e,t,i,s,r,a){var o=e._gsap,l=r||ku(e,!0),c=o.xOrigin||0,h=o.yOrigin||0,u=o.xOffset||0,f=o.yOffset||0,d=l[0],_=l[1],m=l[2],g=l[3],p=l[4],x=l[5],M=t.split(" "),y=parseFloat(M[0])||0,w=parseFloat(M[1])||0,E,P,L,v;i?l!==Aa&&(P=d*g-_*m)&&(L=y*(g/P)+w*(-m/P)+(m*x-g*p)/P,v=y*(-_/P)+w*(d/P)-(d*x-_*p)/P,y=L,w=v):(E=Hg(e),y=E.x+(~M[0].indexOf("%")?y/100*E.width:y),w=E.y+(~(M[1]||M[0]).indexOf("%")?w/100*E.height:w)),s||s!==!1&&o.smooth?(p=y-c,x=w-h,o.xOffset=u+(p*d+x*m)-p,o.yOffset=f+(p*_+x*g)-x):o.xOffset=o.yOffset=0,o.xOrigin=y,o.yOrigin=w,o.smooth=!!s,o.origin=t,o.originIsAbsolute=!!i,e.style[ii]="0px 0px",a&&(Rn(a,o,"xOrigin",c,y),Rn(a,o,"yOrigin",h,w),Rn(a,o,"xOffset",u,o.xOffset),Rn(a,o,"yOffset",f,o.yOffset)),e.setAttribute("data-svg-origin",y+" "+w)},Pa=function(e,t){var i=e._gsap||new Pg(e);if("x"in i&&!t&&!i.uncache)return i;var s=e.style,r=i.scaleX<0,a="px",o="deg",l=getComputedStyle(e),c=fi(e,ii)||"0",h,u,f,d,_,m,g,p,x,M,y,w,E,P,L,v,b,N,k,F,Y,q,G,V,Q,he,ae,ue,we,Ee,Ne,Fe;return h=u=f=m=g=p=x=M=y=0,d=_=1,i.svg=!!(e.getCTM&&$g(e)),l.translate&&((l.translate!=="none"||l.scale!=="none"||l.rotate!=="none")&&(s[dt]=(l.translate!=="none"?"translate3d("+(l.translate+" 0 0").split(" ").slice(0,3).join(", ")+") ":"")+(l.rotate!=="none"?"rotate("+l.rotate+") ":"")+(l.scale!=="none"?"scale("+l.scale.split(" ").join(",")+") ":"")+(l[dt]!=="none"?l[dt]:"")),s.scale=s.rotate=s.translate="none"),P=ku(e,i.svg),i.svg&&(i.uncache?(Q=e.getBBox(),c=i.xOrigin-Q.x+"px "+(i.yOrigin-Q.y)+"px",V=""):V=!t&&e.getAttribute("data-svg-origin"),Ph(e,V||c,!!V||i.originIsAbsolute,i.smooth!==!1,P)),w=i.xOrigin||0,E=i.yOrigin||0,P!==Aa&&(N=P[0],k=P[1],F=P[2],Y=P[3],h=q=P[4],u=G=P[5],P.length===6?(d=Math.sqrt(N*N+k*k),_=Math.sqrt(Y*Y+F*F),m=N||k?Hs(k,N)*es:0,x=F||Y?Hs(F,Y)*es+m:0,x&&(_*=Math.abs(Math.cos(x*mr))),i.svg&&(h-=w-(w*N+E*F),u-=E-(w*k+E*Y))):(Fe=P[6],Ee=P[7],ae=P[8],ue=P[9],we=P[10],Ne=P[11],h=P[12],u=P[13],f=P[14],L=Hs(Fe,we),g=L*es,L&&(v=Math.cos(-L),b=Math.sin(-L),V=q*v+ae*b,Q=G*v+ue*b,he=Fe*v+we*b,ae=q*-b+ae*v,ue=G*-b+ue*v,we=Fe*-b+we*v,Ne=Ee*-b+Ne*v,q=V,G=Q,Fe=he),L=Hs(-F,we),p=L*es,L&&(v=Math.cos(-L),b=Math.sin(-L),V=N*v-ae*b,Q=k*v-ue*b,he=F*v-we*b,Ne=Y*b+Ne*v,N=V,k=Q,F=he),L=Hs(k,N),m=L*es,L&&(v=Math.cos(L),b=Math.sin(L),V=N*v+k*b,Q=q*v+G*b,k=k*v-N*b,G=G*v-q*b,N=V,q=Q),g&&Math.abs(g)+Math.abs(m)>359.9&&(g=m=0,p=180-p),d=St(Math.sqrt(N*N+k*k+F*F)),_=St(Math.sqrt(G*G+Fe*Fe)),L=Hs(q,G),x=Math.abs(L)>2e-4?L*es:0,y=Ne?1/(Ne<0?-Ne:Ne):0),i.svg&&(V=e.getAttribute("transform"),i.forceCSS=e.setAttribute("transform","")||!Wg(fi(e,dt)),V&&e.setAttribute("transform",V))),Math.abs(x)>90&&Math.abs(x)<270&&(r?(d*=-1,x+=m<=0?180:-180,m+=m<=0?180:-180):(_*=-1,x+=x<=0?180:-180)),t=t||i.uncache,i.x=h-((i.xPercent=h&&(!t&&i.xPercent||(Math.round(e.offsetWidth/2)===Math.round(-h)?-50:0)))?e.offsetWidth*i.xPercent/100:0)+a,i.y=u-((i.yPercent=u&&(!t&&i.yPercent||(Math.round(e.offsetHeight/2)===Math.round(-u)?-50:0)))?e.offsetHeight*i.yPercent/100:0)+a,i.z=f+a,i.scaleX=St(d),i.scaleY=St(_),i.rotation=St(m)+o,i.rotationX=St(g)+o,i.rotationY=St(p)+o,i.skewX=x+o,i.skewY=M+o,i.transformPerspective=y+a,(i.zOrigin=parseFloat(c.split(" ")[2])||!t&&i.zOrigin||0)&&(s[ii]=$o(c)),i.xOffset=i.yOffset=0,i.force3D=pi.force3D,i.renderTransform=i.svg?YT:Vg?qg:jT,i.uncache=0,i},$o=function(e){return(e=e.split(" "))[0]+" "+e[1]},Jl=function(e,t,i){var s=zt(t);return St(parseFloat(t)+parseFloat(kn(e,"x",i+"px",s)))+s},jT=function(e,t){t.z="0px",t.rotationY=t.rotationX="0deg",t.force3D=0,qg(e,t)},Kn="0deg",qr="0px",Zn=") ",qg=function(e,t){var i=t||this,s=i.xPercent,r=i.yPercent,a=i.x,o=i.y,l=i.z,c=i.rotation,h=i.rotationY,u=i.rotationX,f=i.skewX,d=i.skewY,_=i.scaleX,m=i.scaleY,g=i.transformPerspective,p=i.force3D,x=i.target,M=i.zOrigin,y="",w=p==="auto"&&e&&e!==1||p===!0;if(M&&(u!==Kn||h!==Kn)){var E=parseFloat(h)*mr,P=Math.sin(E),L=Math.cos(E),v;E=parseFloat(u)*mr,v=Math.cos(E),a=Jl(x,a,P*v*-M),o=Jl(x,o,-Math.sin(E)*-M),l=Jl(x,l,L*v*-M+M)}g!==qr&&(y+="perspective("+g+Zn),(s||r)&&(y+="translate("+s+"%, "+r+"%) "),(w||a!==qr||o!==qr||l!==qr)&&(y+=l!==qr||w?"translate3d("+a+", "+o+", "+l+") ":"translate("+a+", "+o+Zn),c!==Kn&&(y+="rotate("+c+Zn),h!==Kn&&(y+="rotateY("+h+Zn),u!==Kn&&(y+="rotateX("+u+Zn),(f!==Kn||d!==Kn)&&(y+="skew("+f+", "+d+Zn),(_!==1||m!==1)&&(y+="scale("+_+", "+m+Zn),x.style[dt]=y||"translate(0, 0)"},YT=function(e,t){var i=t||this,s=i.xPercent,r=i.yPercent,a=i.x,o=i.y,l=i.rotation,c=i.skewX,h=i.skewY,u=i.scaleX,f=i.scaleY,d=i.target,_=i.xOrigin,m=i.yOrigin,g=i.xOffset,p=i.yOffset,x=i.forceCSS,M=parseFloat(a),y=parseFloat(o),w,E,P,L,v;l=parseFloat(l),c=parseFloat(c),h=parseFloat(h),h&&(h=parseFloat(h),c+=h,l+=h),l||c?(l*=mr,c*=mr,w=Math.cos(l)*u,E=Math.sin(l)*u,P=Math.sin(l-c)*-f,L=Math.cos(l-c)*f,c&&(h*=mr,v=Math.tan(c-h),v=Math.sqrt(1+v*v),P*=v,L*=v,h&&(v=Math.tan(h),v=Math.sqrt(1+v*v),w*=v,E*=v)),w=St(w),E=St(E),P=St(P),L=St(L)):(w=u,L=f,E=P=0),(M&&!~(a+"").indexOf("px")||y&&!~(o+"").indexOf("px"))&&(M=kn(d,"x",a,"px"),y=kn(d,"y",o,"px")),(_||m||g||p)&&(M=St(M+_-(_*w+m*P)+g),y=St(y+m-(_*E+m*L)+p)),(s||r)&&(v=d.getBBox(),M=St(M+s/100*v.width),y=St(y+r/100*v.height)),v="matrix("+w+","+E+","+P+","+L+","+M+","+y+")",d.setAttribute("transform",v),x&&(d.style[dt]=v)},KT=function(e,t,i,s,r){var a=360,o=Ot(r),l=parseFloat(r)*(o&&~r.indexOf("rad")?es:1),c=l-s,h=s+c+"deg",u,f;return o&&(u=r.split("_")[1],u==="short"&&(c%=a,c!==c%(a/2)&&(c+=c<0?a:-a)),u==="cw"&&c<0?c=(c+a*xd)%a-~~(c/a)*a:u==="ccw"&&c>0&&(c=(c-a*xd)%a-~~(c/a)*a)),e._pt=f=new ti(e._pt,t,i,s,c,IT),f.e=h,f.u="deg",e._props.push(i),f},Td=function(e,t){for(var i in t)e[i]=t[i];return e},ZT=function(e,t,i){var s=Td({},i._gsap),r="perspective,force3D,transformOrigin,svgOrigin",a=i.style,o,l,c,h,u,f,d,_;s.svg?(c=i.getAttribute("transform"),i.setAttribute("transform",""),a[dt]=t,o=Pa(i,1),Fn(i,dt),i.setAttribute("transform",c)):(c=getComputedStyle(i)[dt],a[dt]=t,o=Pa(i,1),a[dt]=c);for(l in pn)c=s[l],h=o[l],c!==h&&r.indexOf(l)<0&&(d=zt(c),_=zt(h),u=d!==_?kn(i,l,c,_):parseFloat(c),f=parseFloat(h),e._pt=new ti(e._pt,o,l,u,f-u,Eh),e._pt.u=_||0,e._props.push(l));Td(o,s)};ei("padding,margin,Width,Radius",function(n,e){var t="Top",i="Right",s="Bottom",r="Left",a=(e<3?[t,i,s,r]:[t+r,t+i,s+i,s+r]).map(function(o){return e<2?n+o:"border"+o+n});Ho[e>1?"border"+n:n]=function(o,l,c,h,u){var f,d;if(arguments.length<4)return f=a.map(function(_){return rn(o,_,c)}),d=f.join(" "),d.split(f[0]).length===5?f[0]:d;f=(h+"").split(" "),d={},a.forEach(function(_,m){return d[_]=f[m]=f[m]||f[(m-1)/2|0]}),o.init(l,d,u)}});var Xg={name:"css",register:Ah,targetTest:function(e){return e.style&&e.nodeType},init:function(e,t,i,s,r){var a=this._props,o=e.style,l=i.vars.startAt,c,h,u,f,d,_,m,g,p,x,M,y,w,E,P,L,v;Ou||Ah(),this.styles=this.styles||zg(e),L=this.styles.props,this.tween=i;for(m in t)if(m!=="autoRound"&&(h=t[m],!(li[m]&&Cg(m,t,i,s,e,r)))){if(d=typeof h,_=Ho[m],d==="function"&&(h=h.call(i,s,e,r),d=typeof h),d==="string"&&~h.indexOf("random(")&&(h=ba(h)),_)_(this,e,m,h,i)&&(P=1);else if(m.substr(0,2)==="--")c=(getComputedStyle(e).getPropertyValue(m)+"").trim(),h+="",In.lastIndex=0,In.test(c)||(g=zt(c),p=zt(h),p?g!==p&&(c=kn(e,m,c,p)+p):g&&(h+=g)),this.add(o,"setProperty",c,h,s,r,0,0,m),a.push(m),L.push(m,0,o[m]);else if(d!=="undefined"){if(l&&m in l?(c=typeof l[m]=="function"?l[m].call(i,s,e,r):l[m],Ot(c)&&~c.indexOf("random(")&&(c=ba(c)),zt(c+"")||c==="auto"||(c+=pi.units[m]||zt(rn(e,m))||""),(c+"").charAt(1)==="="&&(c=rn(e,m))):c=rn(e,m),f=parseFloat(c),x=d==="string"&&h.charAt(1)==="="&&h.substr(0,2),x&&(h=h.substr(2)),u=parseFloat(h),m in Gi&&(m==="autoAlpha"&&(f===1&&rn(e,"visibility")==="hidden"&&u&&(f=0),L.push("visibility",0,o.visibility),Rn(this,o,"visibility",f?"inherit":"hidden",u?"inherit":"hidden",!u)),m!=="scale"&&m!=="transform"&&(m=Gi[m],~m.indexOf(",")&&(m=m.split(",")[0]))),M=m in pn,M){if(this.styles.save(m),v=h,d==="string"&&h.substring(0,6)==="var(--"){if(h=fi(e,h.substring(4,h.indexOf(")"))),h.substring(0,5)==="calc("){var b=e.style.perspective;e.style.perspective=h,h=fi(e,"perspective"),b?e.style.perspective=b:Fn(e,"perspective")}u=parseFloat(h)}if(y||(w=e._gsap,w.renderTransform&&!t.parseTransform||Pa(e,t.parseTransform),E=t.smoothOrigin!==!1&&w.smooth,y=this._pt=new ti(this._pt,o,dt,0,1,w.renderTransform,w,0,-1),y.dep=1),m==="scale")this._pt=new ti(this._pt,w,"scaleY",w.scaleY,(x?dr(w.scaleY,x+u):u)-w.scaleY||0,Eh),this._pt.u=0,a.push("scaleY",m),m+="X";else if(m==="transformOrigin"){L.push(ii,0,o[ii]),h=qT(h),w.svg?Ph(e,h,0,E,0,this):(p=parseFloat(h.split(" ")[2])||0,p!==w.zOrigin&&Rn(this,w,"zOrigin",w.zOrigin,p),Rn(this,o,m,$o(c),$o(h)));continue}else if(m==="svgOrigin"){Ph(e,h,1,E,0,this);continue}else if(m in Gg){KT(this,w,m,f,x?dr(f,x+h):h);continue}else if(m==="smoothOrigin"){Rn(this,w,"smooth",w.smooth,h);continue}else if(m==="force3D"){w[m]=h;continue}else if(m==="transform"){ZT(this,h,e);continue}}else m in o||(m=Tr(m)||m);if(M||(u||u===0)&&(f||f===0)&&!LT.test(h)&&m in o)g=(c+"").substr((f+"").length),u||(u=0),p=zt(h)||(m in pi.units?pi.units[m]:g),g!==p&&(f=kn(e,m,c,p)),this._pt=new ti(this._pt,M?w:o,m,f,(x?dr(f,x+u):u)-f,!M&&(p==="px"||m==="zIndex")&&t.autoRound!==!1?OT:Eh),this._pt.u=p||0,M&&v!==h?(this._pt.b=c,this._pt.e=v,this._pt.r=NT):g!==p&&p!=="%"&&(this._pt.b=c,this._pt.r=DT);else if(m in o)WT.call(this,e,m,c,x?x+h:h);else if(m in e)this.add(e,m,c||e[m],x?x+h:h,s,r);else if(m!=="parseTransform"){Eu(m,h);continue}M||(m in o?L.push(m,0,o[m]):typeof e[m]=="function"?L.push(m,2,e[m]()):L.push(m,1,c||e[m])),a.push(m)}}P&&Og(this)},render:function(e,t){if(t.tween._time||!Uu())for(var i=t._pt;i;)i.r(e,i.d),i=i._next;else t.styles.revert()},get:rn,aliases:Gi,getSetter:function(e,t,i){var s=Gi[t];return s&&s.indexOf(",")<0&&(t=s),t in pn&&t!==ii&&(e._gsap.x||rn(e,"x"))?i&&vd===i?t==="scale"?BT:kT:(vd=i||{})&&(t==="scale"?zT:VT):e.style&&!wu(e.style[t])?UT:~t.indexOf("-")?FT:Du(e,t)},core:{_removeProperty:Fn,_getMatrix:ku}};ni.utils.checkPrefix=Tr;ni.core.getStyleSaver=zg;(function(n,e,t,i){var s=ei(n+","+e+","+t,function(r){pn[r]=1});ei(e,function(r){pi.units[r]="deg",Gg[r]=1}),Gi[s[13]]=n+","+e,ei(i,function(r){var a=r.split(":");Gi[a[1]]=s[a[0]]})})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent","rotation,rotationX,rotationY,skewX,skewY","transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective","0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");ei("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective",function(n){pi.units[n]="px"});ni.registerPlugin(Xg);var D=ni.registerPlugin(Xg)||ni;D.core.Tween;const JT=`#define PI 3.1415926535897932384626433832795

precision highp float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float u_inViewProgress;

varying vec2 v_uv;

const float POS_IN_RATIO = 1.0;
const float TRANSLATE_Y_RATIO = -1.0;

mat2 scale2d_mat(vec2 _scale){
	return mat2(_scale.x, 0., 0., _scale.y);
}

void main() {
	vec3 newPosition = position;
	float posIn = (-newPosition.y + 1.) * 0.5;
	float startPoint = posIn * POS_IN_RATIO;
	float inProgress = smoothstep(startPoint, 1.0, u_inViewProgress);
	float _inProgress = 1.0 + (0.25 * (1.0 - inProgress));

	newPosition.x *= _inProgress;
	newPosition.y += TRANSLATE_Y_RATIO * (1.0 -  u_inViewProgress);

	vec4 _newPosition = modelViewMatrix * vec4(newPosition, 1.0);

	v_uv = uv;

	gl_Position = projectionMatrix * _newPosition;
}
`,QT=`precision highp float;

uniform sampler2D u_texture;
uniform vec2 u_meshSize;
uniform vec2 u_textureSize;
uniform float u_uvParallaxProgress;

varying vec2 v_uv;

void main() {
    vec2 uv = v_uv;
    vec2 resolutionRatio = vec2(
        min((u_meshSize.x / u_meshSize.y) / (u_textureSize.x / u_textureSize.y), 1.0),
        min((u_meshSize.y / u_meshSize.x) / (u_textureSize.y / u_textureSize.x), 1.0)
    );

    uv -= 0.5;
    uv *= resolutionRatio;
    uv += 0.5;

    // テクスチャの余白分を計算（上下200px = 合計400px / 1936px）
    float paddingRatio = 400.0 / u_textureSize.y;
    float halfPadding = paddingRatio * 0.5;
    // progress: 0 → 上の余白から開始
    // progress: 1 → 下の余白で終了
    float parallaxOffset = -halfPadding + (u_uvParallaxProgress * paddingRatio);

    uv.y -= parallaxOffset;

    vec4 color = texture2D(u_texture, uv);

    gl_FragColor = color;
}
`,Es=`precision highp float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec2 v_uv;

void main() {
	v_uv = uv;

	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,jg=`precision highp float;

uniform sampler2D u_texture;
uniform vec2 u_meshSize;
uniform vec2 u_textureSize;

varying vec2 v_uv;

void main() {
  vec2 uv = v_uv;
  vec2 resolutionRatio = vec2(
    min((u_meshSize.x / u_meshSize.y) / (u_textureSize.x / u_textureSize.y), 1.0),
    min((u_meshSize.y / u_meshSize.x) / (u_textureSize.y / u_textureSize.x), 1.0)
  );

  uv -= 0.5;
  uv *= resolutionRatio;
  uv += 0.5;

  vec4 color = texture2D(u_texture, uv);

  gl_FragColor = vec4(color);
}
`,eA=`precision highp float;

uniform sampler2D u_texture;
uniform vec2 u_meshSize;
uniform vec2 u_textureSize;
uniform float u_uvParallaxProgress;
uniform float u_mask;

varying vec2 v_uv;

void main() {
    vec3 maskColor = vec3(10.0, 8.0, 1.0) / 255.0;
    float visibleAreaRatio = 1.0 - (u_mask * 2.0);

    if (u_mask > 0.0 && (v_uv.y < u_mask || v_uv.y > 1.0 - u_mask)) {
        gl_FragColor = vec4(maskColor, 1.0);
        return;
    }

    vec2 uv = vec2(v_uv.x, (v_uv.y - u_mask) / visibleAreaRatio);
    vec2 meshSize = vec2(u_meshSize.x, u_meshSize.y * visibleAreaRatio);
    vec2 resolutionRatio = vec2(
        min((meshSize.x / meshSize.y) / (u_textureSize.x / u_textureSize.y), 1.0),
        min((meshSize.y / meshSize.x) / (u_textureSize.y / u_textureSize.x), 1.0)
    );

    uv -= 0.5;
    uv *= resolutionRatio;
    uv += 0.5;

    // テクスチャの余白分を計算（上下200px = 合計400px / 1936px）
    float paddingRatio = 400.0 / u_textureSize.y;
    float halfPadding = paddingRatio * 0.5;
    // progress: 0 → 上の余白から開始
    // progress: 1 → 下の余白で終了
    float parallaxOffset = -halfPadding + (u_uvParallaxProgress * paddingRatio);

    uv.y -= parallaxOffset;

    vec4 color = texture2D(u_texture, uv);

    gl_FragColor = color;
}
`;class tA{presetTypes;effectTypes;selectorNames;classNames;geometryParams;tweenParams;maskParams;uniforms;webgl;$target;texture;geometry;material;mesh;width;height;elementHeight;elementTop;padding;rangeMax;parallaxProgress;oldPercentage;translateValue;oldTranslateValue;maskValue;fullEffectVs;fullEffectFs;uvParallaxEffectFs;baseVs;baseFs;preset;effectType;constructor(e={}){this.presetTypes={full:"full",fullStatic:"full-static",uvParallax:"uv-parallax",none:"none"},this.effectTypes={pattern1:"pattern1",pattern2:"pattern2",pattern3:"pattern3",pattern4:"pattern4"},this.selectorNames={sticky:'[data-mesh-layout="sticky"]',stickySection:".stickySection"},this.classNames={craftSpace:".-craftSpace"},this.geometryParams={width:1,height:1,widthSegments:16,heightSegments:16},this.tweenParams={duration:1.4,ease:"circ.out"},this.maskParams={stickySection:100/750,stickySectionCraftSpace:100/1e3},this.uniforms={u_texture:{value:null},u_meshSize:{value:new Pe(1,1)},u_textureSize:{value:new Pe(1,1)},u_inViewProgress:{value:0},u_uvParallaxProgress:{value:0},u_mask:{value:0}},this.webgl=null,this.$target=null,this.texture=null,this.geometry=null,this.material=null,this.mesh=null,this.width=0,this.height=0,this.elementHeight=0,this.elementTop=0,this.padding=.25,this.rangeMax=0,this.parallaxProgress=0,this.oldPercentage=0,this.translateValue=0,this.oldTranslateValue=-1,this.maskValue=0,this.fullEffectVs=JT,this.fullEffectFs=QT,this.uvParallaxEffectFs=eA,this.baseVs=Es,this.baseFs=jg,this.preset=this.presetTypes.fullStatic,this.effectType="",Object.assign(this,e)}isEffectType(){switch(this.preset){case this.presetTypes.full:return this.effectTypes.pattern1;case this.presetTypes.fullStatic:return this.effectTypes.pattern2;case this.presetTypes.uvParallax:return this.effectTypes.pattern3;case this.presetTypes.none:return this.effectTypes.pattern4;default:return this.effectTypes.pattern4}}getVertexShader(){return this.effectType===this.effectTypes.pattern1||this.effectType===this.effectTypes.pattern2?this.fullEffectVs:this.baseVs}getFragmentShader(){switch(this.effectType){case this.effectTypes.pattern1:case this.effectTypes.pattern2:return this.fullEffectFs;case this.effectTypes.pattern3:return this.uvParallaxEffectFs;default:return this.baseFs}}init(e){if(!this.$target)return;this.effectType=this.isEffectType();const t=this.$target.getBoundingClientRect();this.setInfo(t),this.setTexture(),this.setUniforms(),this.setMesh(),this.setMeshScale(),this.setMeshPosition(t),this.effectType===this.effectTypes.pattern1||this.effectType===this.effectTypes.pattern2?(this.webgl.isPostEffect()&&(this.setParallaxElementValue(e,t),this.setParallaxTranslateValue(e)),this.setObserver()):this.effectType===this.effectTypes.pattern3&&(I.detection.pcLayout&&this.setMaskValue(),this.webgl.isPostEffect()&&this.setUvParallaxProgressValue(e,t)),window.requestAnimationFrame(()=>{this.onResize(e)})}destroy(){this.mesh&&D.killTweensOf(this.mesh.material.uniforms.u_inViewProgress),this.clearObserver(),this.webgl.stage.scene&&this.mesh&&this.webgl.stage.scene.remove(this.mesh),this.material&&this.material.dispose(),this.uniforms.u_texture.value&&this.uniforms.u_texture.value.dispose(),this.geometry&&this.geometry.dispose(),this.mesh=null}setInfo(e){this.width=e.width,this.height=e.height}setTexture(){if(!this.$target)return;const e=new ws,t=this.$target.getAttribute("data-pc-img-path"),i=this.$target.getAttribute("data-sp-img-path");let s="";t&&i?s=I.detection.pcLayout?t:i:i&&(s=i),this.texture=e.load(s,r=>{this.webgl.stage.renderer.initTexture(r),this.uniforms&&this.uniforms.u_textureSize&&this.uniforms.u_textureSize.value.set(r.image.width,r.image.height)})}setMaskValue(){if(!this.$target)return;const e=this.$target.closest(this.selectorNames.sticky),t=this.$target.closest(this.selectorNames.stickySection),i=t?.previousElementSibling,s=!!t&&(!i||!i.matches(this.selectorNames.stickySection));e?s?this.maskValue=0:e.closest(this.classNames.craftSpace)?this.maskValue=this.maskParams.stickySectionCraftSpace:this.maskValue=this.maskParams.stickySection:this.maskValue=0,this.uniforms&&this.uniforms.u_mask&&(this.uniforms.u_mask.value=this.maskValue)}setUniforms(){this.uniforms={u_texture:{value:this.texture},u_meshSize:{value:new Pe(this.width,this.height)},u_textureSize:{value:new Pe(1,1)},u_inViewProgress:{value:0},u_uvParallaxProgress:{value:0},u_mask:{value:this.maskValue}}}setMesh(){this.geometry=new Xt(this.geometryParams.width,this.geometryParams.height,this.geometryParams.widthSegments,this.geometryParams.heightSegments),this.material=new gn({vertexShader:this.getVertexShader(),fragmentShader:this.getFragmentShader(),transparent:!0,uniforms:this.uniforms,side:Nt,depthWrite:!1}),this.mesh=new At(this.geometry,this.material),this.mesh.renderOrder=1,this.webgl.stage.scene.add(this.mesh)}setMeshScale(){this.mesh&&(this.mesh.scale.x=this.width,this.mesh.scale.y=this.height,this.uniforms&&this.uniforms.u_meshSize&&this.uniforms.u_meshSize.value.set(this.width,this.height))}setMeshPosition(e){if(!this.mesh)return;const t=this.webgl.stage.stageSize.width,i=this.webgl.stage.stageSize.height,s=e.left,r=e.top;this.mesh.position.x=-t*.5+s+this.width*.5,this.mesh.position.y=i*.5-r-this.height*.5}setParallaxElementValue(e,t){this.effectType!==this.effectTypes.pattern1&&this.effectType!==this.effectTypes.pattern2||(this.elementHeight=t.height,this.elementTop=t.top+e.viewport.positions.top)}setUvParallaxProgressValue(e,t){if(this.effectType===this.effectTypes.pattern4)return;const i=t.height,s=t.top+e.viewport.positions.top,r=(e.viewport.positions.bottom-s)/((e.viewport.positions.height+i)/100);this.parallaxProgress=Math.min(100,Math.max(0,r))}setParallaxRangeMaxValue(){if(!this.$target||this.effectType!==this.effectTypes.pattern1&&this.effectType!==this.effectTypes.pattern2)return;const e=this.$target.clientHeight,t=this.$target.clientHeight*(1+this.padding*2);this.rangeMax=t-e}setParallaxTranslateValue(e){this.effectType!==this.effectTypes.pattern1&&this.effectType!==this.effectTypes.pattern2||(this.parallaxProgress=Number(((e.viewport.positions.bottom-this.elementTop)/((e.viewport.positions.height+this.elementHeight)/100)).toFixed(1)),this.parallaxProgress=Math.min(100,Math.max(0,this.parallaxProgress)),this.oldPercentage!==this.parallaxProgress&&(this.rangeMax||this.setParallaxRangeMaxValue(),this.translateValue=Number((this.parallaxProgress/100*this.rangeMax-this.rangeMax/2).toFixed(0)),this.oldTranslateValue!==this.translateValue&&(this.oldPercentage=this.parallaxProgress,this.oldTranslateValue=this.translateValue)))}setObserver(){this.$target&&(this.effectType!==this.effectTypes.pattern1&&this.effectType!==this.effectTypes.pattern2||I.intersectionObserverManager.add(this.$target,()=>{this.inViewAnimation()}))}clearObserver(){this.$target&&(this.effectType!==this.effectTypes.pattern1&&this.effectType!==this.effectTypes.pattern2||I.intersectionObserverManager.remove(this.$target))}onResize(e){window.requestAnimationFrame(()=>{if(!this.$target)return;const t=this.$target.getBoundingClientRect();this.setInfo(t),this.setMeshScale(),this.setMeshPosition(t),this.effectType===this.effectTypes.pattern3&&I.detection.pcLayout&&this.setMaskValue(),(this.effectType===this.effectTypes.pattern1||this.effectType===this.effectTypes.pattern2)&&this.webgl.isPostEffect()&&this.setParallaxElementValue(e,t)})}updateUniformsValue(){this.effectType!==this.effectTypes.pattern4&&(this.uniforms.u_uvParallaxProgress.value=this.parallaxProgress/100)}updateMeshTranslateValue(e){if(!this.mesh||this.effectType!==this.effectTypes.pattern1)return;const t=this.webgl.stage.stageSize.height,i=e.top;this.mesh.position.y=t*.5-i-this.height*.5+Number(this.translateValue)*-1}render(e){if(I.isPageTransitioning||!this.$target)return;const t=this.$target.getBoundingClientRect();this.setMeshPosition(t),this.webgl.isPostEffect()&&(this.effectType===this.effectTypes.pattern1||this.effectType===this.effectTypes.pattern2?this.setParallaxTranslateValue(e):this.effectType===this.effectTypes.pattern3&&this.setUvParallaxProgressValue(e,t),this.effectType===this.effectTypes.pattern1&&this.updateMeshTranslateValue(t)),this.webgl.isPostEffect()?this.updateUniformsValue():this.uniforms.u_uvParallaxProgress.value=.5}inViewAnimation(){if(!this.$target||this.effectType!==this.effectTypes.pattern1&&this.effectType!==this.effectTypes.pattern2)return;I.intersectionObserverManager.remove(this.$target);let e;this.$target&&this.$target.hasAttribute("data-fv-in-view")?e=I.isStartup?.6:.4:e=0,window.requestAnimationFrame(()=>{D.to(this.uniforms.u_inViewProgress,{value:1,duration:this.tweenParams.duration,delay:e,ease:this.tweenParams.ease})})}}const iA=`uniform float uTranslateProgress;

varying vec2 vUv;

void main() {
  vUv = uv;

  vec3 newPosition = position;
  newPosition.y -= uTranslateProgress;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`,nA=`precision highp float;

uniform sampler2D uTexture;
uniform vec3 uColor;
uniform float uAlpha;
uniform float uRipplePos;
uniform float uRippleStrength;

varying vec2 vUv;

float ripple(float uv, float time, float prog) {
  float distance = length(((uv) + (time * 2.0)));

  return tan(distance * (1.0)) * (prog * -1.85);
}

void main() {
  float rippleUv = ripple((vUv.y), uRipplePos, uRippleStrength) * (0.001 * uRippleStrength);
  vec2 newUv = vec2(vUv.x, vUv.y + rippleUv);
  vec2 clampedUv = clamp(newUv, vec2(0.0), vec2(1.0));
  vec4 texColor = texture2D(uTexture, clampedUv);

  float inBounds =
    step(0.0, newUv.x) *
    step(0.0, newUv.y) *
    step(newUv.x, 1.0) *
    step(newUv.y, 1.0);

  float alpha = texColor.a * uAlpha * inBounds;
  gl_FragColor = vec4(uColor, alpha);
}
`;class sA{uniforms;webgl;$target;texture;geometry;material;mesh;width;height;groupIndex;vs;fs;computedStyle;constructor(e={}){this.uniforms={uColor:{value:new Ze(16777215)},uTexture:{value:null},uRippleStrength:{value:0},uAlpha:{value:0},uRipplePos:{value:0},uTranslateProgress:{value:0}},this.webgl=null,this.$target=null,this.texture=null,this.geometry=null,this.material=null,this.mesh=null,this.width=1,this.height=1,this.groupIndex=0,this.vs=iA,this.fs=nA,this.computedStyle=null,Object.assign(this,e)}init(){if(!this.$target)return;const e=this.$target.getBoundingClientRect();this.setStyle(),this.setInfo(e),this.setTexture(),this.setUniforms(),this.setMesh(),this.setMeshScale(),this.setMeshPosition(e)}destroy(){D.killTweensOf(this.uniforms.uRippleStrength),D.killTweensOf(this.uniforms.uAlpha),D.killTweensOf(this.uniforms.uTranslateProgress),this.webgl.stage.scene&&this.mesh&&this.webgl.stage.scene.remove(this.mesh),this.texture&&this.texture.dispose(),this.geometry&&this.geometry.dispose(),this.material&&this.material.dispose(),this.mesh=null}setStyle(){this.$target&&(this.computedStyle=getComputedStyle(this.$target))}setInfo(e){this.width=e.width,this.height=e.height}setTexture(){const e=Math.min(this.webgl.stage.devicePixelRatio||1,2),t=document.createElement("canvas");t.width=this.width*e,t.height=this.height*e;const i=t.getContext("2d"),{fontFamily:s="",fontSize:r="",fontWeight:a="",textAlign:o="left",paddingBlock:l="0"}=this.computedStyle||{};if(!i)return;i.fillStyle="rgb(255 32 32 / 0)",i.fillRect(0,0,this.width,this.height),i.textBaseline="top",i.textAlign=o,i.fillStyle="rgba(255, 255, 255, 1)",i.font=`${a} ${r} ${s}`,i.scale(e,e);let c=0;const h=parseFloat(l);if(I.detection.browser==="safari"?c=h*.15:c=h*1.5,!this.$target)return;i.fillText(this.$target.textContent,o==="center"?this.width/2:0,c);const f=new Hm(t);f.needsUpdate=!1,f.minFilter=vt,f.magFilter=vt,f.generateMipmaps=!1,this.webgl.stage.renderer.initTexture(f),this.texture=f}setUniforms(){this.uniforms={uColor:{value:new Ze(16777215)},uTexture:{value:this.texture},uRippleStrength:{value:14},uAlpha:{value:0},uRipplePos:{value:1.8},uTranslateProgress:{value:1.2}}}setMesh(){this.geometry=new Xt(1,1,1,1),this.material=new mi({vertexShader:this.vs,fragmentShader:this.fs,transparent:!0,uniforms:this.uniforms,side:Nt,depthWrite:!1}),this.mesh=new At(this.geometry,this.material),this.mesh.renderOrder=2,this.webgl.stage.scene.add(this.mesh)}setMeshScale(){this.mesh&&(this.mesh.scale.x=this.width,this.mesh.scale.y=this.height)}setMeshPosition(e){if(!this.mesh)return;const t=this.webgl.stage.stageSize.width,i=this.webgl.stage.stageSize.height,s=e.left,r=e.top;this.mesh.position.x=-t*.5+s+this.width*.5,this.mesh.position.y=i*.5-r-this.height*.5}onResize(){if(!this.$target)return;const e=this.$target.getBoundingClientRect();this.setStyle(),this.setInfo(e);const t=this.uniforms.uTexture.value;this.setTexture(),this.uniforms.uTexture.value=this.texture,t.dispose(),this.setMeshScale(),this.setMeshPosition(e)}render(){if(I.isPageTransitioning||!this.$target)return;const e=this.$target.getBoundingClientRect();this.setMeshPosition(e)}inViewAnimation(){const e=.2*this.groupIndex,t=!!this.$target?.hasAttribute("data-fv-in-view"),i=!!document.querySelector(I.pageNames.contact)||!!document.querySelector(I.pageNames.thanks)||!!document.querySelector(I.pageNames.privacy);let s=0;t&&(s=i?I.isStartup?1.35:.675:I.isStartup?1.35:1.15);const r=s+e;window.requestAnimationFrame(()=>{D.killTweensOf(this.uniforms.uRippleStrength),D.killTweensOf(this.uniforms.uAlpha),D.killTweensOf(this.uniforms.uTranslateProgress),D.to(this.uniforms.uRippleStrength,{value:1,duration:2,delay:r,ease:"cubic.out"}),D.to(this.uniforms.uAlpha,{value:1,duration:1.4,delay:r,ease:"none"}),D.to(this.uniforms.uTranslateProgress,{value:0,duration:1,delay:r,ease:"cubic.out"})})}outViewAnimation(){window.requestAnimationFrame(()=>{D.killTweensOf(this.uniforms.uRippleStrength),D.killTweensOf(this.uniforms.uAlpha),D.killTweensOf(this.uniforms.uTranslateProgress),D.set(this.uniforms.uRippleStrength,{value:14}),D.set(this.uniforms.uAlpha,{value:0}),D.set(this.uniforms.uTranslateProgress,{value:1.2})})}}const rA=`precision highp float;

uniform sampler2D u_texture;
uniform vec2 u_meshSize;
uniform vec2 u_textureSize;
uniform float u_fadeProgress;
uniform float u_multiplier;
uniform float u_redOffset;
uniform float u_greenOffset;
uniform float u_blueOffset;
uniform float u_inViewProgress;

varying vec2 v_uv;

float ccLensScale(float distortion, float rsqLimit) {
  float distPulse = 1.0 + distortion * rsqLimit;
  float distMinus = 1.0 / (1.0 - distortion * rsqLimit);
  return mix(distPulse, distMinus, step(distortion, 0.));
}

void main() {
  vec2 uv = v_uv;
  vec2 uvCircle = v_uv * 2.0 - 1.0;

  float meshAspectXY = u_meshSize.x / u_meshSize.y;
  float meshAspectYX = u_meshSize.y / u_meshSize.x;
  float uvSizeAspectRatio = min(meshAspectXY, meshAspectYX);

  uvCircle = mix(vec2(uvCircle.x, uvCircle.y / meshAspectXY), vec2(uvCircle.x / meshAspectYX, uvCircle.y), step(u_meshSize.x, u_meshSize.y));

  float circleLength = length(uvCircle);
  float circleScaleScrennSizeFixMultipleRatio = sqrt(1.0 + pow(uvSizeAspectRatio, 2.0));

  circleLength /= circleScaleScrennSizeFixMultipleRatio;

  vec2 uvBase = uv - 0.5;

  float uvCCLensX2 = pow(uvBase.x * meshAspectXY, 2.0);
  float uvCCLensY2 = pow(uvBase.y, 2.0);
  float rsq = uvCCLensX2 + uvCCLensY2;
  float rsqLimit = 0.01;
  float lensProgress = 1.0 - u_inViewProgress;
  float multiplier = u_multiplier * lensProgress;
  float uvScale = ccLensScale(multiplier, rsqLimit);

  vec2 uvTexture = vec2(
    uvBase.x * (1.0 + multiplier * rsq) / uvScale,
    uvBase.y * (1.0 + multiplier * rsq) / uvScale
  ) + 0.5;
  vec2 resolutionRatio = vec2(
    min((u_meshSize.x / u_meshSize.y) / (u_textureSize.x / u_textureSize.y), 1.0),
    min((u_meshSize.y / u_meshSize.x) / (u_textureSize.y / u_textureSize.x), 1.0)
  );

  uvTexture -= 0.5;
  uvTexture *= resolutionRatio;
  uvTexture += 0.5;

  float offsetProgress = 1.0 - clamp(u_inViewProgress, 0.0, 1.0);

  vec2 redOffset = vec2(0.0, u_redOffset * offsetProgress);
  vec2 greenOffset = vec2(0.0, u_greenOffset * offsetProgress);
  vec2 blueOffset = vec2(0.0, u_blueOffset * offsetProgress);

  float r = texture2D(u_texture, uvTexture + redOffset).r;
  float g = texture2D(u_texture, uvTexture + greenOffset).g;
  float b = texture2D(u_texture, uvTexture + blueOffset).b;

  vec4 textureColor = vec4(r, g, b, 1.0);
  vec4 color = mix(vec4(0.0), textureColor, u_inViewProgress);

  color = mix(color, vec4(0.0, 0.0, 0.0, 0.0), clamp(u_fadeProgress, 0.0, 1.0));

  gl_FragColor = color;
}
`;class aA{geometryParams;tweenParams;webgl;$target;texture;uniforms;geometry;material;mesh;width;height;fadeProgress;vs;fs;constructor(e={}){this.geometryParams={width:1,height:1,widthSegments:1,heightSegments:1},this.tweenParams={inViewProgress:{duration:3,ease:"quart.out"}},this.uniforms={u_texture:{value:null},u_meshSize:{value:new Pe(1,1)},u_textureSize:{value:new Pe(1,1)},u_fadeProgress:{value:0},u_multiplier:{value:0},u_redOffset:{value:0},u_greenOffset:{value:0},u_blueOffset:{value:0},u_inViewProgress:{value:0}},this.webgl=null,this.$target=null,this.texture=null,this.geometry=null,this.material=null,this.mesh=null,this.width=0,this.height=0,this.fadeProgress=0,this.vs=Es,this.fs=rA,Object.assign(this,e)}init(e){if(!this.$target)return;const t=this.$target.getBoundingClientRect();this.setInfo(t),this.setTexture(),this.setUniforms(),this.setMesh(),this.setMeshScale(),this.setMeshPosition(t),this.setObserver(),this.setFadeProgressValue(e,t)}destroy(){this.mesh&&D.killTweensOf(this.mesh.material.uniforms.u_inViewProgress),this.clearObserver(),this.webgl.stage.scene&&this.mesh&&this.webgl.stage.scene.remove(this.mesh),this.material&&this.material.dispose(),this.uniforms&&this.uniforms.u_texture.value&&this.uniforms.u_texture.value.dispose(),this.geometry&&this.geometry.dispose(),this.mesh=null}setInfo(e){this.width=e.width,this.height=e.height}setTexture(){if(!this.$target)return;const e=new ws,t=this.$target.getAttribute("data-pc-img-path"),i=this.$target.getAttribute("data-sp-img-path");let s="";t&&i&&(s=I.detection.pcLayout?t:i),this.texture=e.load(s,r=>{this.webgl.stage.renderer.initTexture(r),this.uniforms&&this.uniforms.u_textureSize&&this.uniforms.u_textureSize.value.set(r.image.width,r.image.height)})}setUniforms(){this.uniforms={u_texture:{value:this.texture},u_meshSize:{value:new Pe(this.width,this.height)},u_textureSize:{value:new Pe(1,1)},u_fadeProgress:{value:0},u_multiplier:{value:-20},u_redOffset:{value:.05},u_greenOffset:{value:0},u_blueOffset:{value:-.05},u_inViewProgress:{value:.9}}}setMesh(){this.geometry=new Xt(this.geometryParams.width,this.geometryParams.height,this.geometryParams.widthSegments,this.geometryParams.heightSegments),this.material=new gn({vertexShader:this.vs,fragmentShader:this.fs,transparent:!0,uniforms:this.uniforms,side:Nt,depthWrite:!1}),this.mesh=new At(this.geometry,this.material),this.mesh.renderOrder=1,this.webgl.stage.scene.add(this.mesh)}setMeshScale(){this.mesh&&(this.mesh.scale.x=this.width,this.mesh.scale.y=this.height)}setMeshPosition(e){if(!this.mesh)return;const t=this.webgl.stage.stageSize.width,i=this.webgl.stage.stageSize.height,s=e.left,r=e.top;this.mesh.position.x=-t*.5+s+this.width*.5,this.mesh.position.y=i*.5-r-this.height*.5}setFadeProgressValue(e,t){const i=window.innerHeight||e.viewport.positions.height,s=1-t.bottom/i;this.fadeProgress=Math.min(1,Math.max(0,s))}setObserver(){this.$target&&I.intersectionObserverManager.add(this.$target,()=>{this.inViewAnimation()})}clearObserver(){this.$target&&I.intersectionObserverManager.remove(this.$target)}onResize(){if(!this.$target)return;const e=this.$target.getBoundingClientRect();this.setInfo(e),this.setMeshScale(),this.setMeshPosition(e)}updateUniformsValue(){this.mesh&&(this.mesh.material.uniforms.u_fadeProgress.value=this.fadeProgress)}updateMeshTranslateValue(e){if(!this.mesh)return;const t=this.webgl.stage.stageSize.height,i=e.top;this.mesh.position.y=t*.5-i-this.height*.5-(I.smoothScroll?.lenis?.animatedScroll??0)*.8}render(e){if(I.isPageTransitioning||!this.$target)return;const t=this.$target.getBoundingClientRect();this.setMeshPosition(t),this.setFadeProgressValue(e,t),this.updateUniformsValue(),this.webgl.isPostEffect()&&this.updateMeshTranslateValue(t)}inViewAnimation(){this.$target&&(I.intersectionObserverManager.remove(this.$target),window.requestAnimationFrame(()=>{if(!this.mesh)return;const e=this.mesh.material;D.killTweensOf(e.uniforms.u_inViewProgress),D.to(e.uniforms.u_inViewProgress,{value:1,duration:this.tweenParams.inViewProgress.duration,delay:I.isStartup?.6:.4,ease:this.tweenParams.inViewProgress.ease})}))}}const oA=`precision highp float;

uniform sampler2D u_texture;
uniform vec2 u_meshSize;
uniform vec2 u_textureSize;
uniform float u_fadeProgress;

varying vec2 v_uv;

void main() {
  vec2 uv = v_uv;
  vec2 resolutionRatio = vec2(
    min((u_meshSize.x / u_meshSize.y) / (u_textureSize.x / u_textureSize.y), 1.0),
    min((u_meshSize.y / u_meshSize.x) / (u_textureSize.y / u_textureSize.x), 1.0)
  );

  vec2 uvTexture = uv;
  uvTexture -= 0.5;
  uvTexture *= resolutionRatio;
  uvTexture += 0.5;

  vec4 textureColor = texture2D(u_texture, uvTexture);

  textureColor = mix(textureColor, vec4(0.0, 0.0, 0.0, 0.0), clamp(u_fadeProgress, 0.0, 1.0));

  gl_FragColor = textureColor;
}
`;class lA{geometryParams;selectorNames;scissorParams;webgl;$target;$clipTarget;texture;uniforms;geometry;material;mesh;width;height;fadeProgress;vs;fs;constructor(e={}){this.geometryParams={width:1,height:1,widthSegments:1,heightSegments:1},this.selectorNames={clipTarget:'[data-mesh-manager="home-background-mesh-clip-target"]'},this.scissorParams={x:0,y:0,width:0,height:0},this.uniforms={u_texture:{value:null},u_meshSize:{value:new Pe(1,1)},u_textureSize:{value:new Pe(1,1)},u_fadeProgress:{value:0}},this.webgl=null,this.$target=null,this.$clipTarget=null,this.texture=null,this.geometry=null,this.material=null,this.mesh=null,this.width=0,this.height=0,this.fadeProgress=0,this.vs=Es,this.fs=oA,Object.assign(this,e)}init(e){if(!this.$target)return;const t=this.$target.getBoundingClientRect();this.setSelector(),this.setInfo(t),this.setTexture(),this.setUniforms(),this.setMesh(),this.setMeshScale(),this.setMeshPosition(t),this.setFadeProgressValue(e,t)}destroy(){this.webgl.stage.scene&&this.mesh&&this.webgl.stage.scene.remove(this.mesh),this.material&&this.material.dispose(),this.uniforms.u_texture.value&&this.uniforms.u_texture.value.dispose(),this.geometry&&this.geometry.dispose(),this.mesh=null}setSelector(){this.$target&&(this.$clipTarget=this.$target.closest(this.selectorNames.clipTarget))}setScissorValue(e){if(!this.$clipTarget)return;const t=this.$clipTarget.getBoundingClientRect(),i=Math.max(t.left,e.canvasRect.left),s=Math.min(t.right,e.canvasRect.right),r=Math.max(t.top,e.canvasRect.top),a=Math.min(t.bottom,e.canvasRect.bottom),o=Math.max(0,s-i),l=Math.max(0,a-r);this.scissorParams.x=i-e.canvasRect.left,this.scissorParams.y=e.canvasRect.bottom-a,this.scissorParams.width=o,this.scissorParams.height=l}setInfo(e){this.width=e.width,this.height=e.height}setTexture(){if(!this.$target)return;const e=new ws,t=this.$target.getAttribute("data-pc-img-path"),i=this.$target.getAttribute("data-sp-img-path");let s="";t&&i&&(s=I.detection.pcLayout?t:i),this.texture=e.load(s,r=>{this.webgl.stage.renderer.initTexture(r),this.uniforms&&this.uniforms.u_textureSize&&this.uniforms.u_textureSize.value.set(r.image.width,r.image.height)})}setUniforms(){this.uniforms={u_texture:{value:this.texture},u_meshSize:{value:new Pe(this.width,this.height)},u_textureSize:{value:new Pe(1,1)},u_fadeProgress:{value:0}}}setMesh(){this.geometry=new Xt(this.geometryParams.width,this.geometryParams.height,this.geometryParams.widthSegments,this.geometryParams.heightSegments),this.material=new gn({vertexShader:this.vs,fragmentShader:this.fs,transparent:!0,uniforms:this.uniforms,side:Nt,depthWrite:!1}),this.mesh=new At(this.geometry,this.material),this.mesh.onBeforeRender=e=>{if(this.$target?.getAttribute&&this.$target.getAttribute("data-mesh-type")==="company"){const{x:t,y:i,width:s,height:r}=this.scissorParams;e.setScissorTest(!0),e.setScissor(t,i,s,r)}},this.mesh.onAfterRender=e=>{this.$target?.getAttribute&&this.$target.getAttribute("data-mesh-type")==="company"&&e.setScissorTest(!1)},this.webgl.stage.scene.add(this.mesh)}setMeshScale(){this.mesh&&(this.mesh.scale.x=this.width,this.mesh.scale.y=this.height)}setMeshPosition(e){if(!this.mesh)return;const t=this.webgl.stage.stageSize.width,i=this.webgl.stage.stageSize.height,s=e.left,r=e.top;this.mesh.position.x=-t*.5+s+this.width*.5,this.mesh.position.y=i*.5-r-this.height*.5}setFadeProgressValue(e,t){const i=window.innerHeight||e.viewport.positions.height,s=1-t.bottom/i;this.fadeProgress=Math.min(1,Math.max(0,s))}onResize(e){if(!this.$target)return;const t=this.$target.getBoundingClientRect();this.setScissorValue(e),this.setInfo(t),this.setMeshScale(),this.setMeshPosition(t)}updateUniformsValue(){this.uniforms.u_fadeProgress.value=this.fadeProgress}updateMeshTranslateValue(e){if(!this.mesh)return;const t=this.webgl.stage.stageSize.height,i=e.top+window.scrollY,s=(I.smoothScroll?.lenis?.animatedScroll??0)-i;this.mesh.position.y=t*.5-e.top-this.height*.5-s*.8}render(e){if(I.isPageTransitioning||!this.$target)return;const t=this.$target.getBoundingClientRect();this.setScissorValue(e),this.setMeshPosition(t),this.setFadeProgressValue(e,t),this.updateUniformsValue(),this.webgl.isPostEffect()&&this.updateMeshTranslateValue(t)}}const cA=`precision highp float;

uniform sampler2D u_texture1;
uniform sampler2D u_texture2;
uniform sampler2D u_texture3;
uniform vec2 u_meshSize;
uniform vec2 u_textureSize;
uniform float u_uvParallaxProgress;
uniform float u_inView1Progress;
uniform float u_inView2Progress;
uniform float u_inView3Progress;
uniform float u_multiplier;
uniform float u_edgeStrength;
uniform float u_direction;

varying vec2 v_uv;

float circle(in vec2 _st, in float _radius, in float blurriness) {
  vec2 dist = _st;
  return 1. - smoothstep(_radius-(_radius*blurriness), _radius+(_radius*blurriness), dot(dist,dist)*4.0);
}

float ccLensScale(float distortion, float rsqLimit) {
  float distPulse = 1. + distortion * rsqLimit;
  float distMinus = 1. / (1. - distortion * rsqLimit);
  return mix(distPulse, distMinus, step(distortion, 0.));
}


void main() {
    vec2 uv = v_uv;

    float meshAspectXY = u_meshSize.x / u_meshSize.y;
    float meshAspectYX = u_meshSize.y / u_meshSize.x;
    float uvSizeAspectRatio = min(meshAspectXY, meshAspectYX);

    vec2 uvCircle = v_uv * 2.0 - 1.0;
    uvCircle = mix(vec2(uvCircle.x, uvCircle.y / meshAspectXY), vec2(uvCircle.x / meshAspectYX, uvCircle.y), step(u_meshSize.x, u_meshSize.y));

    float circleLength = length(uvCircle);
    float circleScaleScrennSizeFixMultipleRatio = sqrt(1. + pow(uvSizeAspectRatio, 2.));
    circleLength /= circleScaleScrennSizeFixMultipleRatio;

    // 方向判定（正の値=順方向、負の値=逆方向）
    float isForward = step(0.0, u_direction);

    // texture1用のCC Lens計算
    vec2 uvCCLensBase1 = uv;
    vec2 uvTexture1Base = uv - 0.5;
    vec2 uvCCLens1 = uvCCLensBase1 - 0.5;

    float uvCCLensX2_1 = pow(uvCCLens1.x * meshAspectXY, 2.);
    float uvCCLensY2_1 = pow(uvCCLens1.y, 2.);
    float rsq1 = uvCCLensX2_1 + uvCCLensY2_1;

    float rsqLimit = 0.;
    // texture1: 順方向は自身のprogress、逆方向はu_inView2Progressを使用
    float lensProgress1 = mix(u_inView2Progress, 1. - u_inView1Progress, isForward);
    float multiplier1 = u_multiplier * lensProgress1;
    float uvScale1 = ccLensScale(multiplier1, rsqLimit);

    vec2 uvTexture1 = vec2(
      uvTexture1Base.x * (1. + multiplier1 * rsq1) / uvScale1,
      uvTexture1Base.y * (1. + multiplier1 * rsq1) / uvScale1
    ) + 0.5;

    // texture2用のCC Lens計算（u_inView2Progress）
    vec2 uvCCLensBase2 = uv;
    vec2 uvTexture2Base = uv - 0.5;
    vec2 uvCCLens2 = uvCCLensBase2 - 0.5;

    float uvCCLensX2_2 = pow(uvCCLens2.x * meshAspectXY, 2.);
    float uvCCLensY2_2 = pow(uvCCLens2.y, 2.);
    float rsq2 = uvCCLensX2_2 + uvCCLensY2_2;
    // texture2: 順方向は自身のprogress、逆方向はu_inView3Progressを使用
    float lensProgress2 = mix(u_inView3Progress, 1. - u_inView2Progress, isForward);
    float multiplier2 = u_multiplier * lensProgress2;
    float uvScale2 = ccLensScale(multiplier2, rsqLimit);

    vec2 uvTexture2 = vec2(
      uvTexture2Base.x * (1. + multiplier2 * rsq2) / uvScale2,
      uvTexture2Base.y * (1. + multiplier2 * rsq2) / uvScale2
    ) + 0.5;

    // texture3用のCC Lens計算（u_inView3Progress）
    vec2 uvCCLensBase3 = uv;
    vec2 uvTexture3Base = uv - 0.5;
    vec2 uvCCLens3 = uvCCLensBase3 - 0.5;

    float uvCCLensX2_3 = pow(uvCCLens3.x * meshAspectXY, 2.);
    float uvCCLensY2_3 = pow(uvCCLens3.y, 2.);
    float rsq3 = uvCCLensX2_3 + uvCCLensY2_3;
    // texture3: 順方向のみ歪む、逆方向では歪まない
    float lensProgress3 = mix(0., 1. - u_inView3Progress, isForward);
    float multiplier3 = u_multiplier * lensProgress3;
    float uvScale3 = ccLensScale(multiplier3, rsqLimit);

    vec2 uvTexture3 = vec2(
      uvTexture3Base.x * (1. + multiplier3 * rsq3) / uvScale3,
      uvTexture3Base.y * (1. + multiplier3 * rsq3) / uvScale3
    ) + 0.5;

    vec2 resolutionRatio = vec2(
        min((u_meshSize.x / u_meshSize.y) / (u_textureSize.x / u_textureSize.y), 1.0),
        min((u_meshSize.y / u_meshSize.x) / (u_textureSize.y / u_textureSize.x), 1.0)
    );

    uvTexture1 -= 0.5;
    uvTexture1 *= resolutionRatio;
    uvTexture1 += 0.5;
    uvTexture2 -= 0.5;
    uvTexture2 *= resolutionRatio;
    uvTexture2 += 0.5;
    uvTexture3 -= 0.5;
    uvTexture3 *= resolutionRatio;
    uvTexture3 += 0.5;

    // テクスチャの余白分を計算
    // 400（200（デザインサイズでのバッファ） * 2（2倍サイズの画像を使用しているため）） / 1800（画像の高さ * 2）
    float paddingRatio = 600.0 / u_textureSize.y;
    // paddingRatioを上下で使用するため半分にする。
    float halfPadding = paddingRatio * 0.5;
    // progress: 0 → デザインサイズでの画像の上端と、テクスチャの上端が一致
    // progress: 0.5 → デザインサイズで見た時と同じ位置
    // progress: 1 → デザインサイズでの画像の下端と、テクスチャの下端が一致
    float parallaxOffset = -halfPadding + (u_uvParallaxProgress * paddingRatio);

    uvTexture1.y -= parallaxOffset;
    uvTexture2.y -= parallaxOffset;
    uvTexture3.y -= parallaxOffset;

    // テクスチャの取得
    vec4 texture1 = texture2D(u_texture1, uvTexture1);
    vec4 texture2 = texture2D(u_texture2, uvTexture2);
    vec4 texture3 = texture2D(u_texture3, uvTexture3);

    // 円形マスク
    float adjustedProgress1 = u_inView1Progress * (1.0 + u_edgeStrength) - u_edgeStrength;
    float inner1 = smoothstep(adjustedProgress1 + u_edgeStrength, adjustedProgress1, circleLength);
    float outer1 = smoothstep(adjustedProgress1 + u_edgeStrength * 2.0, adjustedProgress1 + u_edgeStrength, circleLength);
    float edgeMask1 = inner1 * outer1;

    float adjustedProgress2 = u_inView2Progress * (1.0 + u_edgeStrength) - u_edgeStrength;
    float inner2 = smoothstep(adjustedProgress2 + u_edgeStrength, adjustedProgress2, circleLength);
    float outer2 = smoothstep(adjustedProgress2 + u_edgeStrength * 2.0, adjustedProgress2 + u_edgeStrength, circleLength);
    float edgeMask2 = inner2 * outer2;

    float adjustedProgress3 = u_inView3Progress * (1.0 + u_edgeStrength) - u_edgeStrength;
    float inner3 = smoothstep(adjustedProgress3 + u_edgeStrength, adjustedProgress3, circleLength);
    float outer3 = smoothstep(adjustedProgress3 + u_edgeStrength * 2.0, adjustedProgress3 + u_edgeStrength, circleLength);
    float edgeMask3 = inner3 * outer3;

    // 方向で合成順序とマスクを切り替え
    vec4 color;
    if (isForward > 0.5) {
      // 順方向: 透明背景 → texture1を円形マスクで展開 → texture2を重ねる → texture3を重ねる
      vec4 base = vec4(0.0);
      vec4 layer1 = mix(base, texture1, edgeMask1);
      vec4 layer12 = mix(layer1, texture2, edgeMask2);
      color = mix(layer12, texture3, edgeMask3);
    } else {
      // 逆方向: 次のテクスチャが中心から拡大して現在のテクスチャを覆う
      // texture2がtexture3を覆う際のマスク（u_inView3Progressが1→0の時、0→1で拡大）
      float expandProgress2 = (1.0 - u_inView3Progress) * (1.0 + u_edgeStrength) - u_edgeStrength;
      float expandInner2 = smoothstep(expandProgress2 + u_edgeStrength, expandProgress2, circleLength);
      float expandOuter2 = smoothstep(expandProgress2 + u_edgeStrength * 2.0, expandProgress2 + u_edgeStrength, circleLength);
      float expandMask2 = expandInner2 * expandOuter2;

      // texture1がtexture2を覆う際のマスク（u_inView2Progressが1→0の時、0→1で拡大）
      float expandProgress1 = (1.0 - u_inView2Progress) * (1.0 + u_edgeStrength) - u_edgeStrength;
      float expandInner1 = smoothstep(expandProgress1 + u_edgeStrength, expandProgress1, circleLength);
      float expandOuter1 = smoothstep(expandProgress1 + u_edgeStrength * 2.0, expandProgress1 + u_edgeStrength, circleLength);
      float expandMask1 = expandInner1 * expandOuter1;

      // texture3の上にtexture2が中心から拡大して覆う
      vec4 layer32 = mix(texture3, texture2, expandMask2);
      // その上にtexture1が中心から拡大して覆う
      vec4 layer321 = mix(layer32, texture1, expandMask1);
      // texture1をフェードアウト（マスクではなく透明度で制御）
      layer321.a *= u_inView1Progress;
      color = layer321;
    }

    gl_FragColor = color;
}
`;var hA=/[achlmqstvz]|(-?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/ig,uA=/[\+\-]?\d*\.?\d+e[\+\-]?\d+/ig,fA=Math.PI/180,po=Math.sin,mo=Math.cos,ca=Math.abs,Xr=Math.sqrt,dA=function(e){return typeof e=="number"},Ad=1e5,En=function(e){return Math.round(e*Ad)/Ad||0},Pd=function(e){return e.closed=Math.abs(e[0]-e[e.length-2])<.001&&Math.abs(e[1]-e[e.length-1])<.001};function pA(n,e,t,i,s,r,a){for(var o=n.length,l,c,h,u,f;--o>-1;)for(l=n[o],c=l.length,h=0;h<c;h+=2)u=l[h],f=l[h+1],l[h]=u*e+f*i+r,l[h+1]=u*t+f*s+a;return n._dirty=1,n}function mA(n,e,t,i,s,r,a,o,l){if(!(n===o&&e===l)){t=ca(t),i=ca(i);var c=s%360*fA,h=mo(c),u=po(c),f=Math.PI,d=f*2,_=(n-o)/2,m=(e-l)/2,g=h*_+u*m,p=-u*_+h*m,x=g*g,M=p*p,y=x/(t*t)+M/(i*i);y>1&&(t=Xr(y)*t,i=Xr(y)*i);var w=t*t,E=i*i,P=(w*E-w*M-E*x)/(w*M+E*x);P<0&&(P=0);var L=(r===a?-1:1)*Xr(P),v=L*(t*p/i),b=L*-(i*g/t),N=(n+o)/2,k=(e+l)/2,F=N+(h*v-u*b),Y=k+(u*v+h*b),q=(g-v)/t,G=(p-b)/i,V=(-g-v)/t,Q=(-p-b)/i,he=q*q+G*G,ae=(G<0?-1:1)*Math.acos(q/Xr(he)),ue=(q*Q-G*V<0?-1:1)*Math.acos((q*V+G*Q)/Xr(he*(V*V+Q*Q)));isNaN(ue)&&(ue=f),!a&&ue>0?ue-=d:a&&ue<0&&(ue+=d),ae%=d,ue%=d;var we=Math.ceil(ca(ue)/(d/4)),Ee=[],Ne=ue/we,Fe=4/3*po(Ne/2)/(1+mo(Ne/2)),ne=h*t,le=u*t,Se=u*-i,Ie=h*i,ge;for(ge=0;ge<we;ge++)s=ae+ge*Ne,g=mo(s),p=po(s),q=mo(s+=Ne),G=po(s),Ee.push(g-Fe*p,p+Fe*g,q+Fe*G,G-Fe*q,q,G);for(ge=0;ge<Ee.length;ge+=2)g=Ee[ge],p=Ee[ge+1],Ee[ge]=g*ne+p*Se+F,Ee[ge+1]=g*le+p*Ie+Y;return Ee[ge-2]=o,Ee[ge-1]=l,Ee}}function gA(n){var e=(n+"").replace(uA,function(v){var b=+v;return b<1e-4&&b>-1e-4?0:b}).match(hA)||[],t=[],i=0,s=0,r=2/3,a=e.length,o=0,l="ERROR: malformed path: "+n,c,h,u,f,d,_,m,g,p,x,M,y,w,E,P,L=function(b,N,k,F){x=(k-b)/3,M=(F-N)/3,m.push(b+x,N+M,k-x,F-M,k,F)};if(!n||!isNaN(e[0])||isNaN(e[1]))return console.log(l),t;for(c=0;c<a;c++)if(w=d,isNaN(e[c])?(d=e[c].toUpperCase(),_=d!==e[c]):c--,u=+e[c+1],f=+e[c+2],_&&(u+=i,f+=s),c||(g=u,p=f),d==="M")m&&(m.length<8?t.length-=1:o+=m.length,Pd(m)),i=g=u,s=p=f,m=[u,f],t.push(m),c+=2,d="L";else if(d==="C")m||(m=[0,0]),_||(i=s=0),m.push(u,f,i+e[c+3]*1,s+e[c+4]*1,i+=e[c+5]*1,s+=e[c+6]*1),c+=6;else if(d==="S")x=i,M=s,(w==="C"||w==="S")&&(x+=i-m[m.length-4],M+=s-m[m.length-3]),_||(i=s=0),m.push(x,M,u,f,i+=e[c+3]*1,s+=e[c+4]*1),c+=4;else if(d==="Q")x=i+(u-i)*r,M=s+(f-s)*r,_||(i=s=0),i+=e[c+3]*1,s+=e[c+4]*1,m.push(x,M,i+(u-i)*r,s+(f-s)*r,i,s),c+=4;else if(d==="T")x=i-m[m.length-4],M=s-m[m.length-3],m.push(i+x,s+M,u+(i+x*1.5-u)*r,f+(s+M*1.5-f)*r,i=u,s=f),c+=2;else if(d==="H")L(i,s,i=u,s),c+=1;else if(d==="V")L(i,s,i,s=u+(_?s-i:0)),c+=1;else if(d==="L"||d==="Z")d==="Z"&&(u=g,f=p,m.closed=!0),(d==="L"||ca(i-u)>.5||ca(s-f)>.5)&&(L(i,s,u,f),d==="L"&&(c+=2)),i=u,s=f;else if(d==="A"){if(E=e[c+4],P=e[c+5],x=e[c+6],M=e[c+7],h=7,E.length>1&&(E.length<3?(M=x,x=P,h--):(M=P,x=E.substr(2),h-=2),P=E.charAt(1),E=E.charAt(0)),y=mA(i,s,+e[c+1],+e[c+2],+e[c+3],+E,+P,(_?i:0)+x*1,(_?s:0)+M*1),c+=h,y)for(h=0;h<y.length;h++)m.push(y[h]);i=m[m.length-2],s=m[m.length-1]}else console.log(l);return c=m.length,c<6?(t.pop(),c=0):Pd(m),t.totalPoints=o+c,t}function _A(n){dA(n[0])&&(n=[n]);var e="",t=n.length,i,s,r,a;for(s=0;s<t;s++){for(a=n[s],e+="M"+En(a[0])+","+En(a[1])+" C",i=a.length,r=2;r<i;r++)e+=En(a[r++])+","+En(a[r++])+" "+En(a[r++])+","+En(a[r++])+" "+En(a[r++])+","+En(a[r])+" ";a.closed&&(e+="z")}return e}var Kt,Yg,Kg=function(){return Kt||typeof window<"u"&&(Kt=window.gsap)&&Kt.registerPlugin&&Kt},Cd=function(){Kt=Kg(),Kt?(Kt.registerEase("_CE",Or.create),Yg=1):console.warn("Please gsap.registerPlugin(CustomEase)")},vA=1e20,go=function(e){return~~(e*1e3+(e<0?-.5:.5))/1e3},xA=/[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/gi,SA=/[cLlsSaAhHvVtTqQ]/g,yA=function(e){var t=e.length,i=vA,s;for(s=1;s<t;s+=6)+e[s]<i&&(i=+e[s]);return i},wA=function(e,t,i){!i&&i!==0&&(i=Math.max(+e[e.length-1],+e[1]));var s=+e[0]*-1,r=-i,a=e.length,o=1/(+e[a-2]+s),l=-t||(Math.abs(+e[a-1]-+e[1])<.01*(+e[a-2]-+e[0])?yA(e)+r:+e[a-1]+r),c;for(l?l=1/l:l=-o,c=0;c<a;c+=2)e[c]=(+e[c]+s)*o,e[c+1]=(+e[c+1]+r)*l},MA=function n(e,t,i,s,r,a,o,l,c,h,u){var f=(e+i)/2,d=(t+s)/2,_=(i+r)/2,m=(s+a)/2,g=(r+o)/2,p=(a+l)/2,x=(f+_)/2,M=(d+m)/2,y=(_+g)/2,w=(m+p)/2,E=(x+y)/2,P=(M+w)/2,L=o-e,v=l-t,b=Math.abs((i-o)*v-(s-l)*L),N=Math.abs((r-o)*v-(a-l)*L),k;return h||(h=[{x:e,y:t},{x:o,y:l}],u=1),h.splice(u||h.length-1,0,{x:E,y:P}),(b+N)*(b+N)>c*(L*L+v*v)&&(k=h.length,n(e,t,f,d,x,M,E,P,c,h,u),n(E,P,y,w,g,p,o,l,c,h,u+1+(h.length-k))),h},Or=(function(){function n(t,i,s){Yg||Cd(),this.id=t,this.setData(i,s)}var e=n.prototype;return e.setData=function(i,s){s=s||{},i=i||"0,0,1,1";var r=i.match(xA),a=1,o=[],l=[],c=s.precision||1,h=c<=1,u,f,d,_,m,g,p,x,M;if(this.data=i,(SA.test(i)||~i.indexOf("M")&&i.indexOf("C")<0)&&(r=gA(i)[0]),u=r.length,u===4)r.unshift(0,0),r.push(1,1),u=8;else if((u-2)%6)throw"Invalid CustomEase";for((+r[0]!=0||+r[u-2]!=1)&&wA(r,s.height,s.originY),this.segment=r,_=2;_<u;_+=6)f={x:+r[_-2],y:+r[_-1]},d={x:+r[_+4],y:+r[_+5]},o.push(f,d),MA(f.x,f.y,+r[_],+r[_+1],+r[_+2],+r[_+3],d.x,d.y,1/(c*2e5),o,o.length-1);for(u=o.length,_=0;_<u;_++)p=o[_],x=o[_-1]||p,(p.x>x.x||x.y!==p.y&&x.x===p.x||p===x)&&p.x<=1?(x.cx=p.x-x.x,x.cy=p.y-x.y,x.n=p,x.nx=p.x,h&&_>1&&Math.abs(x.cy/x.cx-o[_-2].cy/o[_-2].cx)>2&&(h=0),x.cx<a&&(x.cx?a=x.cx:(x.cx=.001,_===u-1&&(x.x-=.001,a=Math.min(a,.001),h=0)))):(o.splice(_--,1),u--);if(u=1/a+1|0,m=1/u,g=0,p=o[0],h){for(_=0;_<u;_++)M=_*m,p.nx<M&&(p=o[++g]),f=p.y+(M-p.x)/p.cx*p.cy,l[_]={x:M,cx:m,y:f,cy:0,nx:9},_&&(l[_-1].cy=f-l[_-1].y);g=o[o.length-1],l[u-1].cy=g.y-f,l[u-1].cx=g.x-l[l.length-1].x}else{for(_=0;_<u;_++)p.nx<_*m&&(p=o[++g]),l[_]=p;g<o.length-1&&(l[_-1]=o[o.length-2])}return this.ease=function(y){var w=l[y*u|0]||l[u-1];return w.nx<y&&(w=w.n),w.y+(y-w.x)/w.cx*w.cy},this.ease.custom=this,this.id&&Kt&&Kt.registerEase(this.id,this.ease),this},e.getSVGData=function(i){return n.getSVGData(this,i)},n.create=function(i,s,r){return new n(i,s,r).ease},n.register=function(i){Kt=i,Cd()},n.get=function(i){return Kt.parseEase(i)},n.getSVGData=function(i,s){s=s||{};var r=s.width||100,a=s.height||100,o=s.x||0,l=(s.y||0)+a,c=Kt.utils.toArray(s.path)[0],h,u,f,d,_,m,g,p,x,M;if(s.invert&&(a=-a,l=0),typeof i=="string"&&(i=Kt.parseEase(i)),i.custom&&(i=i.custom),i instanceof n)h=_A(pA([i.segment.slice(0)],r,0,0,-a,o,l));else{for(h=[o,l],g=Math.max(5,(s.precision||1)*200),d=1/g,g+=2,p=5/g,x=go(o+d*r),M=go(l+i(d)*-a),u=(M-l)/(x-o),f=2;f<g;f++)_=go(o+f*d*r),m=go(l+i(f*d)*-a),(Math.abs((m-M)/(_-x)-u)>p||f===g-1)&&(h.push(x,M),u=(m-M)/(_-x)),x=_,M=m;h="M"+h.join(",")}return c&&c.setAttribute("d",h),h},n})();Or.version="3.14.2";Or.headless=!0;Kg()&&Kt.registerPlugin(Or);D.registerPlugin(Or);const Zg={wait:"-wait"};function Bu(n){const e=n.getBoundingClientRect(),t=window.scrollY||document.documentElement.scrollTop;return e.top+t}function bA(n){const e=n.getBoundingClientRect(),t=D.utils.clamp(0,e.width,window.innerWidth/2-e.left),i=D.utils.clamp(0,e.height,window.innerHeight/2-e.top);return D.set(n,{transformOrigin:`${t}px ${i}px`}),n}function EA(n,e,t,i){return Or.create("custom",`M0,0 C${Number(n)},${Number(e)} ${Number(t)},${Number(i)} 1,1`)}function $s(n,e){return n/e*100}function Jg(){document.documentElement.classList.add(Zg.wait)}function Rd(){document.documentElement.classList.remove(Zg.wait)}function TA(n){return n<.5?8*n*n*n*n:1-Math.pow(-2*n+2,4)/2}function AA(n){return 1-Math.pow(1-n,4)}function Ql(){return EA(.06,.95,.2,.95)}class PA{geometryParams;tweenParams;webgl;$target;texture1;texture2;texture3;uniforms;geometry;material;mesh;width;height;contentHeight;start;end;range;progress;vs;fs;isInView1Animated;isInView2Animated;isInView3Animated;constructor(e={}){this.geometryParams={width:1,height:1,widthSegments:1,heightSegments:1},this.tweenParams={inView1Progress:{duration:1.3,ease:Ql()},inView2Progress:{duration:1.3,ease:Ql()},inView3Progress:{duration:1.3,ease:Ql()}},this.uniforms={u_texture1:{value:null},u_texture2:{value:null},u_texture3:{value:null},u_meshSize:{value:new Pe(1,1)},u_textureSize:{value:new Pe(1,1)},u_uvParallaxProgress:{value:0},u_inView1Progress:{value:0},u_inView2Progress:{value:0},u_inView3Progress:{value:0},u_multiplier:{value:0},u_edgeStrength:{value:0},u_direction:{value:0}},this.webgl=null,this.$target=null,this.texture1=null,this.texture2=null,this.texture3=null,this.geometry=null,this.material=null,this.mesh=null,this.width=1,this.height=1,this.contentHeight=0,this.start=0,this.end=0,this.range=0,this.progress=0,this.vs=Es,this.fs=cA,this.isInView1Animated=!1,this.isInView2Animated=!1,this.isInView3Animated=!1,Object.assign(this,e)}init(){if(!this.$target)return;const e=this.$target.getBoundingClientRect();this.setInfo(e),this.setTexture(),this.setMixTexture(),this.setUniforms(),this.setMesh(),this.setMeshScale(),this.setMeshPosition(e),this.setStickyValue()}destroy(){D.killTweensOf(this.uniforms.u_inView1Progress),D.killTweensOf(this.uniforms.u_inView2Progress),D.killTweensOf(this.uniforms.u_inView3Progress),this.webgl.stage.scene&&this.mesh&&this.webgl.stage.scene.remove(this.mesh),this.material&&this.material.dispose(),this.uniforms.u_texture1.value&&this.uniforms.u_texture1.value.dispose(),this.uniforms.u_texture2.value&&this.uniforms.u_texture2.value.dispose(),this.uniforms.u_texture3.value&&this.uniforms.u_texture3.value.dispose(),this.geometry&&this.geometry.dispose(),this.mesh=null}setInfo(e){this.width=e.width,this.height=e.height}setTexture(){if(!this.$target)return;const e=new ws,t=this.$target.getAttribute("data-pc-img-path");t&&(this.texture1=e.load(t,i=>{this.webgl.stage.renderer.initTexture(i),this.uniforms&&this.uniforms.u_textureSize&&this.uniforms.u_textureSize.value.set(i.image.width,i.image.height)}))}setMixTexture(){if(!this.$target)return;const e=new ws,t=this.$target.getAttribute("data-pc-img-path-2"),i=this.$target.getAttribute("data-pc-img-path-3");!t||!i||(this.texture2=e.load(t,s=>{this.webgl.stage.renderer.initTexture(s)}),this.texture3=e.load(i,s=>{this.webgl.stage.renderer.initTexture(s)}))}setUniforms(){this.uniforms={u_texture1:{value:this.texture1},u_texture2:{value:this.texture2},u_texture3:{value:this.texture3},u_meshSize:{value:new Pe(this.width,this.height)},u_textureSize:{value:new Pe(1,1)},u_uvParallaxProgress:{value:0},u_inView1Progress:{value:0},u_inView2Progress:{value:0},u_inView3Progress:{value:0},u_multiplier:{value:-20},u_edgeStrength:{value:.05},u_direction:{value:1}}}setMesh(){this.geometry=new Xt(this.geometryParams.width,this.geometryParams.height,this.geometryParams.widthSegments,this.geometryParams.heightSegments),this.material=new gn({vertexShader:this.vs,fragmentShader:this.fs,transparent:!0,uniforms:this.uniforms,side:Nt,depthWrite:!1}),this.mesh=new At(this.geometry,this.material),this.webgl.stage.scene.add(this.mesh)}setMeshScale(){this.mesh&&(this.mesh.scale.x=this.width,this.mesh.scale.y=this.height)}setMeshPosition(e){if(!this.mesh)return;const t=this.webgl.stage.stageSize.width,i=this.webgl.stage.stageSize.height,s=e.left,r=e.top;this.mesh.position.x=-t*.5+s+this.width*.5,this.mesh.position.y=i*.5-r-this.height*.5}setStickyValue(){if(!this.$target)return;const e=this.$target.parentElement;e&&(this.contentHeight=e.getBoundingClientRect().height,this.start=Bu(e)-window.innerHeight,this.end=this.start+this.contentHeight*6,this.range=this.end-this.start)}onResize(){if(!this.$target)return;const e=this.$target.getBoundingClientRect();this.setInfo(e),this.setMeshScale(),this.setMeshPosition(e),this.setStickyValue()}updateStickyProgress(){const e=I.smoothScroll?.lenis?.animatedScroll??0;e<=this.start?this.progress=0:this.end<=e?this.progress=1:this.progress=ru((e-this.start)/this.range,0,1),this.updateStickyAnimation(this.progress),this.webgl.isPostEffect()?this.updateUniformsValue(this.progress):this.uniforms.u_uvParallaxProgress.value=.5}updateStickyAnimation(e){e>0&&(this.isInView1Animated||(this.inView1Animation(),this.isInView1Animated=!0)),e<=0&&this.isInView1Animated&&(this.outView1Animation(),this.isInView1Animated=!1),e>=.3333&&(this.isInView2Animated||(this.inView2Animation(),this.isInView2Animated=!0)),e<.3333&&this.isInView2Animated&&(this.outView2Animation(),this.isInView2Animated=!1),e>=.6666&&(this.isInView3Animated||(this.inView3Animation(),this.isInView3Animated=!0)),e<.6666&&this.isInView3Animated&&(this.outView3Animation(),this.isInView3Animated=!1)}updateUniformsValue(e){this.uniforms.u_uvParallaxProgress.value=e}render(){if(I.isPageTransitioning||!this.$target)return;const e=this.$target.getBoundingClientRect();this.setMeshPosition(e),this.updateStickyProgress()}inView1Animation(){window.requestAnimationFrame(()=>{this.uniforms.u_direction.value=I.smoothScroll?.lenis?.direction??1,D.killTweensOf(this.uniforms.u_inView1Progress),D.to(this.uniforms.u_inView1Progress,{value:1,duration:this.tweenParams.inView1Progress.duration,ease:this.tweenParams.inView1Progress.ease})})}outView1Animation(){window.requestAnimationFrame(()=>{this.uniforms.u_direction.value=I.smoothScroll?.lenis?.direction??1,D.killTweensOf(this.uniforms.u_inView1Progress),D.to(this.uniforms.u_inView1Progress,{value:0,duration:this.tweenParams.inView1Progress.duration,ease:this.tweenParams.inView1Progress.ease})})}inView2Animation(){window.requestAnimationFrame(()=>{this.uniforms.u_direction.value=I.smoothScroll?.lenis?.direction??1,D.killTweensOf(this.uniforms.u_inView2Progress),D.to(this.uniforms.u_inView2Progress,{value:1,duration:this.tweenParams.inView2Progress.duration,ease:this.tweenParams.inView2Progress.ease})})}outView2Animation(){window.requestAnimationFrame(()=>{this.uniforms.u_direction.value=I.smoothScroll?.lenis?.direction??1,D.killTweensOf(this.uniforms.u_inView2Progress),D.to(this.uniforms.u_inView2Progress,{value:0,duration:this.tweenParams.inView2Progress.duration,ease:this.tweenParams.inView2Progress.ease})})}inView3Animation(){window.requestAnimationFrame(()=>{this.uniforms.u_direction.value=I.smoothScroll?.lenis?.direction??1,D.killTweensOf(this.uniforms.u_inView3Progress),D.to(this.uniforms.u_inView3Progress,{value:1,duration:this.tweenParams.inView3Progress.duration,ease:this.tweenParams.inView3Progress.ease})})}outView3Animation(){window.requestAnimationFrame(()=>{this.uniforms.u_direction.value=I.smoothScroll?.lenis?.direction??1,D.killTweensOf(this.uniforms.u_inView3Progress),D.to(this.uniforms.u_inView3Progress,{value:0,duration:this.tweenParams.inView3Progress.duration,ease:this.tweenParams.inView3Progress.ease})})}}const CA=`precision highp float;

uniform sampler2D u_texture;
uniform vec2 u_meshSize;
uniform vec2 u_textureSize;
uniform float u_uvParallaxProgress;

varying vec2 v_uv;

void main() {
  vec2 uv = v_uv;
  vec2 resolutionRatio = vec2(
    min((u_meshSize.x / u_meshSize.y) / (u_textureSize.x / u_textureSize.y), 1.0),
    min((u_meshSize.y / u_meshSize.x) / (u_textureSize.y / u_textureSize.x), 1.0)
  );

  uv -= 0.5;
  uv *= resolutionRatio;
  uv += 0.5;

  float paddingRatio = 400.0 / u_textureSize.x;
  float halfPadding = paddingRatio * 0.5;
  float parallaxOffset = -halfPadding + (u_uvParallaxProgress * paddingRatio);

  uv.x -= parallaxOffset;

  vec4 color = texture2D(u_texture, uv);

  gl_FragColor = color;
}
`;class RA{geometryParams;selectorNames;scissorParams;uniforms;webgl;$target;$clipTarget;texture;geometry;material;mesh;width;height;elementHeight;elementTop;padding;rangeMax;parallaxProgress;oldPercentage;translateValue;oldTranslateValue;vs;fs;constructor(e={}){this.geometryParams={width:1,height:1,widthSegments:1,heightSegments:1},this.selectorNames={clipTarget:'[data-mesh-manager="projects-img-mesh-clip-target"]'},this.scissorParams={x:0,y:0,width:0,height:0},this.uniforms={u_texture:{value:null},u_meshSize:{value:new Pe(1,1)},u_textureSize:{value:new Pe(1,1)},u_fadeProgress:{value:0}},this.webgl=null,this.$target=null,this.$clipTarget=null,this.texture=null,this.geometry=null,this.material=null,this.mesh=null,this.width=0,this.height=0,this.elementHeight=0,this.elementTop=0,this.padding=.25,this.rangeMax=0,this.parallaxProgress=0,this.oldPercentage=0,this.translateValue=0,this.oldTranslateValue=-1,this.$clipTarget=null,this.vs=Es,this.fs=CA,Object.assign(this,e)}init(e){if(!this.$target)return;const t=this.$target.getBoundingClientRect();this.setSelector(),this.setInfo(t),this.setTexture(),this.setUniforms(),this.setMesh(),this.setMeshScale(),this.setMeshPosition(t),this.setParallaxElementValue(e,t),this.setUvParallaxProgressValue(e,t),this.setParallaxTranslateValue(e)}destroy(){this.webgl.stage.scene&&this.mesh&&this.webgl.stage.scene.remove(this.mesh),this.material&&this.material.dispose(),this.uniforms.u_texture.value&&this.uniforms.u_texture.value.dispose(),this.geometry&&this.geometry.dispose(),this.mesh=null}setSelector(){this.$target&&(this.$clipTarget=this.$target.closest(this.selectorNames.clipTarget))}setScissorValue(e){if(!this.$clipTarget)return;const t=this.$clipTarget.getBoundingClientRect(),i=Math.max(t.left,e.canvasRect.left),s=Math.min(t.right,e.canvasRect.right),r=Math.max(t.top,e.canvasRect.top),a=Math.min(t.bottom,e.canvasRect.bottom),o=Math.max(0,s-i),l=Math.max(0,a-r);this.scissorParams.x=i-e.canvasRect.left,this.scissorParams.y=e.canvasRect.bottom-a,this.scissorParams.width=o,this.scissorParams.height=l}setInfo(e){this.width=e.width,this.height=e.height}setTexture(){if(!this.$target)return;const e=new ws,t=this.$target.getAttribute("data-pc-img-path"),i=this.$target.getAttribute("data-sp-img-path");let s="";t&&i&&(s=I.detection.pcLayout?t:i),this.texture=e.load(s,r=>{this.webgl.stage.renderer.initTexture(r),this.uniforms&&this.uniforms.u_textureSize&&this.uniforms.u_textureSize.value.set(r.image.width,r.image.height)})}setUniforms(){this.uniforms={u_texture:{value:this.texture},u_meshSize:{value:new Pe(this.width,this.height)},u_textureSize:{value:new Pe(1,1)},u_uvParallaxProgress:{value:0}}}setMesh(){this.geometry=new Xt(this.geometryParams.width,this.geometryParams.height,this.geometryParams.widthSegments,this.geometryParams.heightSegments),this.material=new gn({vertexShader:this.vs,fragmentShader:this.fs,transparent:!0,uniforms:this.uniforms,side:Nt,depthWrite:!1}),this.mesh=new At(this.geometry,this.material),this.mesh.renderOrder=1,this.mesh.onBeforeRender=e=>{const{x:t,y:i,width:s,height:r}=this.scissorParams;e.setScissorTest(!0),e.setScissor(t,i,s,r)},this.mesh.onAfterRender=e=>{e.setScissorTest(!1)},this.webgl.stage.scene.add(this.mesh)}setMeshScale(){this.mesh&&(this.mesh.scale.x=this.width,this.mesh.scale.y=this.height)}setMeshPosition(e){if(!this.mesh)return;const t=this.webgl.stage.stageSize.width,i=this.webgl.stage.stageSize.height,s=e.left,r=e.top;this.mesh.position.x=-t*.5+s+this.width*.5,this.mesh.position.y=i*.5-r-this.height*.5}setParallaxElementValue(e,t){this.elementHeight=t.height,this.elementTop=t.top+e.viewport.positions.top}setUvParallaxProgressValue(e,t){const i=t.height,s=t.top+e.viewport.positions.top,r=(e.viewport.positions.bottom-s)/((e.viewport.positions.height+i)/100);this.parallaxProgress=Math.min(100,Math.max(0,r))}setParallaxRangeMaxValue(){if(!this.$target)return;const e=this.$target.clientHeight,t=this.$target.clientHeight*(1+this.padding*2);this.rangeMax=t-e}setParallaxTranslateValue(e){this.parallaxProgress=Number(((e.viewport.positions.bottom-this.elementTop)/((e.viewport.positions.height+this.elementHeight)/100)).toFixed(1)),this.parallaxProgress=Math.min(100,Math.max(0,this.parallaxProgress)),this.rangeMax||this.setParallaxRangeMaxValue(),this.translateValue=Number((this.parallaxProgress/100*this.rangeMax-this.rangeMax/2).toFixed(0)),this.oldTranslateValue!==this.translateValue&&(this.oldPercentage=this.parallaxProgress,this.oldTranslateValue=this.translateValue)}onResize(e){if(!this.$target)return;const t=this.$target.getBoundingClientRect();this.setScissorValue(e),this.setInfo(t),this.setMeshScale(),this.setMeshPosition(t),this.setParallaxElementValue(e,t)}updateUniformsValue(){this.uniforms.u_uvParallaxProgress.value=this.parallaxProgress/100}updateMeshTranslateValue(e){if(!this.mesh)return;const t=this.webgl.stage.stageSize.width,i=e.left;this.mesh.position.x=-t*.5+i+this.width*.5+Number(this.translateValue)*-1}render(e){if(I.isPageTransitioning||!this.$target)return;const t=this.$target.getBoundingClientRect();this.setScissorValue(e),this.setMeshPosition(t),this.setParallaxTranslateValue(e),this.setUvParallaxProgressValue(e,t),this.updateUniformsValue(),this.updateMeshTranslateValue(t)}}class LA{geometryParams;selectorNames;scissorParams;webgl;$target;$clipTarget;texture;uniforms;geometry;material;mesh;width;height;vs;fs;constructor(e={}){this.geometryParams={width:1,height:1,widthSegments:1,heightSegments:1},this.selectorNames={clipTarget:'[data-mesh-manager="retreat-background-mesh-clip-target"]'},this.scissorParams={x:0,y:0,width:0,height:0},this.uniforms={u_texture:{value:null},u_meshSize:{value:new Pe(1,1)},u_textureSize:{value:new Pe(1,1)}},this.webgl=null,this.$target=null,this.$clipTarget=null,this.texture=null,this.geometry=null,this.material=null,this.mesh=null,this.width=0,this.height=0,this.vs=Es,this.fs=jg,Object.assign(this,e)}init(){if(!this.$target)return;const e=this.$target.getBoundingClientRect();this.setSelector(),this.setInfo(e),this.setTexture(),this.setUniforms(),this.setMesh(),this.setMeshScale(),this.setMeshPosition(e)}destroy(){this.webgl.stage.scene&&this.mesh&&this.webgl.stage.scene.remove(this.mesh),this.material&&this.material.dispose(),this.uniforms.u_texture.value&&this.uniforms.u_texture.value.dispose(),this.geometry&&this.geometry.dispose(),this.mesh=null}setSelector(){this.$target&&(this.$clipTarget=this.$target.closest(this.selectorNames.clipTarget))}setScissorValue(e){if(!this.$clipTarget)return;const t=this.$clipTarget.getBoundingClientRect(),i=Math.max(t.left,e.canvasRect.left),s=Math.min(t.right,e.canvasRect.right),r=Math.max(t.top,e.canvasRect.top),a=Math.min(t.bottom,e.canvasRect.bottom),o=Math.max(0,s-i),l=Math.max(0,a-r);this.scissorParams.x=i-e.canvasRect.left,this.scissorParams.y=e.canvasRect.bottom-a,this.scissorParams.width=o,this.scissorParams.height=l}setInfo(e){this.width=e.width,this.height=e.height}setTexture(){if(!this.$target)return;const e=new ws,t=this.$target.getAttribute("data-pc-img-path"),i=this.$target.getAttribute("data-sp-img-path");let s="";t&&i&&(s=I.detection.pcLayout?t:i),this.texture=e.load(s,r=>{this.webgl.stage.renderer.initTexture(r),this.uniforms&&this.uniforms.u_textureSize&&this.uniforms.u_textureSize.value.set(r.image.width,r.image.height)})}setUniforms(){this.uniforms={u_texture:{value:this.texture},u_meshSize:{value:new Pe(this.width,this.height)},u_textureSize:{value:new Pe(1,1)}}}setMesh(){this.geometry=new Xt(this.geometryParams.width,this.geometryParams.height,this.geometryParams.widthSegments,this.geometryParams.heightSegments),this.material=new gn({vertexShader:this.vs,fragmentShader:this.fs,transparent:!0,uniforms:this.uniforms,side:Nt,depthWrite:!1}),this.mesh=new At(this.geometry,this.material),this.mesh.onBeforeRender=e=>{const{x:t,y:i,width:s,height:r}=this.scissorParams;e.setScissorTest(!0),e.setScissor(t,i,s,r)},this.mesh.onAfterRender=e=>{e.setScissorTest(!1)},this.webgl.stage.scene.add(this.mesh)}setMeshScale(){this.mesh&&(this.mesh.scale.x=this.width,this.mesh.scale.y=this.height)}setMeshPosition(e){if(!this.mesh)return;const t=this.webgl.stage.stageSize.width,i=this.webgl.stage.stageSize.height,s=e.left,r=e.top;this.mesh.position.x=-t*.5+s+this.width*.5,this.mesh.position.y=i*.5-r-this.height*.5}onResize(e){if(!this.$target)return;const t=this.$target.getBoundingClientRect();this.setScissorValue(e),this.setInfo(t),this.setMeshScale(),this.setMeshPosition(t),this.uniforms.u_meshSize.value.set(this.width,this.height)}updateMeshTranslateValue(e){if(!this.mesh)return;const t=this.webgl.stage.stageSize.height,i=e.top+window.scrollY,s=(I.smoothScroll?.lenis?.animatedScroll??0)-i;this.mesh.position.y=t*.5-e.top-this.height*.5-s*.8}render(e){if(I.isPageTransitioning||!this.$target)return;const t=this.$target.getBoundingClientRect();this.setScissorValue(e),this.setMeshPosition(t),this.webgl.isPostEffect()&&this.updateMeshTranslateValue(t)}}const IA=`precision highp float;

void main() {
  vec4 color = vec4(0.039, 0.031, 0.004, 1.0);

  gl_FragColor = color;
}
`;class DA{geometryParams;webgl;$target;geometry;material;mesh;width;height;vs;fs;constructor(e={}){this.geometryParams={width:1,height:1,widthSegments:1,heightSegments:1},this.webgl=null,this.$target=null,this.geometry=null,this.material=null,this.mesh=null,this.width=0,this.height=0,this.vs=Es,this.fs=IA,Object.assign(this,e)}init(){if(!this.$target)return;const e=this.$target.getBoundingClientRect();this.setInfo(e),this.setMesh(),this.setMeshScale(),this.setMeshPosition(e)}destroy(){this.webgl.stage.scene&&this.mesh&&this.webgl.stage.scene.remove(this.mesh),this.material&&this.material.dispose(),this.geometry&&this.geometry.dispose(),this.mesh=null}setInfo(e){const t=window.innerWidth*.009375;this.width=e.width,this.height=e.height+t}setMesh(){this.geometry=new Xt(this.geometryParams.width,this.geometryParams.height,this.geometryParams.widthSegments,this.geometryParams.heightSegments),this.material=new gn({vertexShader:this.vs,fragmentShader:this.fs,transparent:!0,side:Nt,depthWrite:!1}),this.mesh=new At(this.geometry,this.material),this.webgl.stage.scene.add(this.mesh)}setMeshScale(){this.mesh&&(this.mesh.scale.x=this.width,this.mesh.scale.y=this.height)}setMeshPosition(e){if(!this.mesh)return;const t=this.webgl.stage.stageSize.width,i=this.webgl.stage.stageSize.height,s=e.left,r=e.top;this.mesh.position.x=-t*.5+s+this.width*.5,this.mesh.position.y=i*.5-r-this.height*.5}onResize(){if(!this.$target)return;const e=this.$target.getBoundingClientRect();this.setInfo(e),this.setMeshScale(),this.setMeshPosition(e)}render(){if(I.isPageTransitioning||!this.$target)return;const e=this.$target.getBoundingClientRect();this.setMeshPosition(e)}}class NA{selectorNames;$commonImgMeshTargets;$commonTextMeshTargets;$textMeshGroupTargets;$commonBackgroundMeshTargets;$homeBackgroundMeshTargets;$philosophyImgMeshTargets;$projectsImgMeshTargets;$retreatBackgroundMeshTargets;$retreatCoverMeshTargets;meshesItems;root;webgl;constructor(e={}){this.selectorNames={commonImgMesh:{target:'[data-mesh-manager="common-img-mesh"]'},commonTextMesh:{target:'[data-mesh-manager="common-text-mesh"]'},commonBackgroundMesh:{target:'[data-mesh-manager="common-background-mesh"]'},homeBackgroundMesh:{target:'[data-mesh-manager="home-background-mesh"]'},philosophyImgMesh:{target:'[data-mesh-manager="philosophy-img-mesh"]'},projectsImgMesh:{target:'[data-mesh-manager="projects-img-mesh"]'},retreatBackgroundMesh:{target:'[data-mesh-manager="retreat-background-mesh"]'},retreatCoverMesh:{target:'[data-mesh-manager="retreat-cover-mesh"]'}},this.$commonImgMeshTargets=[],this.$commonTextMeshTargets=[],this.$textMeshGroupTargets=[],this.$commonBackgroundMeshTargets=[],this.$homeBackgroundMeshTargets=[],this.$philosophyImgMeshTargets=[],this.$projectsImgMeshTargets=[],this.$retreatBackgroundMeshTargets=[],this.$retreatCoverMeshTargets=[],this.meshesItems=[],this.root=document,this.webgl=null,Object.assign(this,e)}init({root:e=document}={}){e&&(this.root=e),this.setSelector(),this.setMeshes()}destroy(){this.clearMeshes()}setSelector(){this.$commonImgMeshTargets=Array.from(this.root.querySelectorAll(this.selectorNames.commonImgMesh.target)),this.$commonTextMeshTargets=Array.from(this.root.querySelectorAll(this.selectorNames.commonTextMesh.target)),this.$commonBackgroundMeshTargets=Array.from(this.root.querySelectorAll(this.selectorNames.commonBackgroundMesh.target)),this.$homeBackgroundMeshTargets=Array.from(this.root.querySelectorAll(this.selectorNames.homeBackgroundMesh.target)),this.$philosophyImgMeshTargets=Array.from(this.root.querySelectorAll(this.selectorNames.philosophyImgMesh.target)),this.$projectsImgMeshTargets=Array.from(this.root.querySelectorAll(this.selectorNames.projectsImgMesh.target)),this.$retreatBackgroundMeshTargets=Array.from(this.root.querySelectorAll(this.selectorNames.retreatBackgroundMesh.target)),this.$retreatCoverMeshTargets=this.webgl.isPostEffect()?Array.from(this.root.querySelectorAll(this.selectorNames.retreatCoverMesh.target)):[]}setMeshes(){const e=[],t=[],i=new Map,s=[],r=[],a=[],o=[],l=[],c=[];this.$commonImgMeshTargets.forEach((h,u)=>{e[u]=new tA({webgl:this.webgl,$target:h,preset:h.getAttribute("data-mesh-preset")})}),this.$commonTextMeshTargets.forEach((h,u)=>{const f=h.parentElement;if(!f)return;i.has(f)||i.set(f,[]);const d=i.get(f),_=d.length,m=new sA({webgl:this.webgl,$target:h,groupIndex:_});d.push(m),t[u]=m}),this.$commonBackgroundMeshTargets.forEach((h,u)=>{s[u]=new aA({webgl:this.webgl,$target:h,index:u})}),this.$homeBackgroundMeshTargets.forEach((h,u)=>{r[u]=new lA({webgl:this.webgl,$target:h})}),this.$philosophyImgMeshTargets.forEach((h,u)=>{a[u]=new PA({webgl:this.webgl,$target:h})}),this.$projectsImgMeshTargets.forEach((h,u)=>{o[u]=new RA({webgl:this.webgl,$target:h})}),this.$retreatBackgroundMeshTargets.forEach((h,u)=>{l[u]=new LA({webgl:this.webgl,$target:h})}),this.$retreatCoverMeshTargets.length&&this.$retreatCoverMeshTargets.forEach((h,u)=>{c[u]=new DA({webgl:this.webgl,$target:h})}),this.meshesItems.push(e),this.meshesItems.push(t),this.meshesItems.push(s),this.meshesItems.push(r),this.meshesItems.push(a),this.meshesItems.push(o),this.meshesItems.push(l),c.length&&this.meshesItems.push(c),this.meshesItems.forEach(h=>{h.forEach(u=>{u.init(this.webgl.frameState)})}),this.setTextMeshGroupObservers(i)}setTextMeshGroupObservers(e){e.forEach((t,i)=>{this.$textMeshGroupTargets.push(i),I.intersectionObserverManager.add(i,()=>{I.intersectionObserverManager.remove(i),t.forEach(s=>{s.inViewAnimation()})})})}clearMeshes(){this.$textMeshGroupTargets.forEach(e=>{I.intersectionObserverManager.remove(e)}),this.$textMeshGroupTargets=[],this.meshesItems.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.meshesItems=[]}onResize(e){this.meshesItems.forEach(t=>{t.forEach(i=>{i.onResize(e)})})}render(e){this.meshesItems.forEach(t=>{t.forEach(i=>{i.render(e)})})}}const OA=`precision highp float;

uniform vec2 u_texel;

varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;

void main () {
	vUv = uv;
	vL = vUv - vec2(u_texel.x, 0.0);
	vR = vUv + vec2(u_texel.x, 0.0);
	vT = vUv + vec2(0.0, u_texel.y);
	vB = vUv - vec2(0.0, u_texel.y);

	gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,UA=`precision highp float;
precision highp sampler2D;

uniform sampler2D u_input_texture;
uniform vec3 u_point_value;
uniform vec2 u_point;
uniform float u_ratio;
uniform float u_img_ratio;
uniform float u_point_size;

varying vec2 vUv;

void main () {
    vec2 p = vUv - u_point.xy;
    p.x *= u_ratio;
    vec3 splat = .6 * pow(2., -dot(p, p) / u_point_size) * u_point_value;

    vec3 base = texture2D(u_input_texture, vUv).xyz;
    gl_FragColor = vec4(base + splat, 1.);
}
`,FA=`precision highp float;
precision highp sampler2D;

uniform sampler2D u_velocity_texture;

varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;

void main () {
    float L = texture2D(u_velocity_texture, vL).x;
    float R = texture2D(u_velocity_texture, vR).x;
    float T = texture2D(u_velocity_texture, vT).y;
    float B = texture2D(u_velocity_texture, vB).y;

    float div = .25 * (R - L + T - B);
    gl_FragColor = vec4(div, 0., 0., 1.);
}
`,kA=`precision highp float;
precision highp sampler2D;

uniform sampler2D u_pressure_texture;
uniform sampler2D u_divergence_texture;

varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;

void main () {
    float L = texture2D(u_pressure_texture, vL).x;
    float R = texture2D(u_pressure_texture, vR).x;
    float T = texture2D(u_pressure_texture, vT).x;
    float B = texture2D(u_pressure_texture, vB).x;
    float C = texture2D(u_pressure_texture, vUv).x;
    float divergence = texture2D(u_divergence_texture, vUv).x;
    float pressure = (L + R + B + T - divergence) * .25;

    gl_FragColor = vec4(pressure, 0., 0., 1.);
}
`,BA=`precision highp float;
precision highp sampler2D;

uniform sampler2D u_pressure_texture;
uniform sampler2D u_velocity_texture;

varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;

void main () {
    float L = texture2D(u_pressure_texture, vL).x;
    float R = texture2D(u_pressure_texture, vR).x;
    float T = texture2D(u_pressure_texture, vT).x;
    float B = texture2D(u_pressure_texture, vB).x;
    vec2 velocity = texture2D(u_velocity_texture, vUv).xy;
    velocity.xy -= vec2(R - L, T - B);
    gl_FragColor = vec4(velocity, 0., 1.);
}
`,zA=`precision highp float;
precision highp sampler2D;

uniform sampler2D u_velocity_texture;
uniform sampler2D u_input_texture;
uniform vec2 u_texel;
uniform vec2 u_output_textel;
uniform float u_dt;
uniform float u_dissipation;

varying vec2 vUv;

vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
    vec2 st = uv / tsize - 0.5;

    vec2 iuv = floor(st);
    vec2 fuv = fract(st);

    vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
    vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
    vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
    vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);

    return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
}

void main () {
    vec2 coord = vUv - u_dt * bilerp(u_velocity_texture, vUv, u_texel).xy * u_texel;
    vec4 velocity = bilerp(u_input_texture, coord, u_output_textel);
    gl_FragColor = u_dissipation * velocity;
}
`;class VA{cameraParams;geometryParams;guiParams;pointer;resolution;scene;camera;mesh;splatMaterial;divergenceMaterial;pressureMaterial;gradientSubtractMaterial;advectionMaterial;outputColor;velocity;divergence;pressure;vs;webgl;constructor(e={}){this.cameraParams={left:-1,right:1,top:1,bottom:-1,near:0,far:1},this.geometryParams={width:2,height:2},this.guiParams={cursorSize:.5,cursorPower:25,distortionPower:.5},this.pointer={x:.65*window.innerWidth,y:.5*window.innerHeight,dx:0,dy:0,moved:!1},this.resolution={w:1,h:1},this.scene=null,this.camera=null,this.mesh=null,this.splatMaterial=null,this.divergenceMaterial=null,this.pressureMaterial=null,this.gradientSubtractMaterial=null,this.advectionMaterial=null,this.outputColor=null,this.velocity=null,this.divergence=null,this.pressure=null,this.vs=OA,Object.assign(this,e)}init(){this.setScene(),this.setCamera(),this.setMesh(),this.setResolution(),this.createMaterials(),this.initFBO(),this.updateTexelUniforms()}destroy(){this.disposeFBOs(),this.mesh&&(this.mesh.geometry.dispose(),Array.isArray(this.mesh.material)?this.mesh.material.forEach(e=>e.dispose()):this.mesh.material.dispose()),this.splatMaterial&&this.splatMaterial.dispose(),this.divergenceMaterial&&this.divergenceMaterial.dispose(),this.pressureMaterial&&this.pressureMaterial.dispose(),this.gradientSubtractMaterial&&this.gradientSubtractMaterial.dispose(),this.advectionMaterial&&this.advectionMaterial.dispose(),this.mesh=null,this.scene=null,this.camera=null}setScene(){this.scene=new xu}setCamera(){this.camera=new tl(this.cameraParams.left,this.cameraParams.right,this.cameraParams.top,this.cameraParams.bottom,this.cameraParams.near,this.cameraParams.far)}setMesh(){const e=new Xt(this.geometryParams.width,this.geometryParams.height),t=new vu;this.mesh=new At(e,t),this.scene&&this.scene.add(this.mesh)}setResolution(){this.resolution.w=Math.round(this.webgl.stage.stageSize.width),this.resolution.h=Math.round(this.webgl.stage.stageSize.canvasHeight)}createMaterial(e,t){return new mi({vertexShader:this.vs,fragmentShader:e,uniforms:t,depthTest:!1,depthWrite:!1,transparent:!1,blending:Wi})}createMaterials(){this.splatMaterial=this.createMaterial(UA,{u_input_texture:{value:null},u_ratio:{value:1},u_img_ratio:{value:1},u_point_value:{value:new j},u_point:{value:new Pe},u_point_size:{value:.001},u_texel:{value:new Pe(1,1)}}),this.divergenceMaterial=this.createMaterial(FA,{u_velocity_texture:{value:null},u_texel:{value:new Pe(1,1)}}),this.pressureMaterial=this.createMaterial(kA,{u_pressure_texture:{value:null},u_divergence_texture:{value:null},u_texel:{value:new Pe(1,1)}}),this.gradientSubtractMaterial=this.createMaterial(BA,{u_pressure_texture:{value:null},u_velocity_texture:{value:null},u_texel:{value:new Pe(1,1)}}),this.advectionMaterial=this.createMaterial(zA,{u_velocity_texture:{value:null},u_input_texture:{value:null},u_texel:{value:new Pe(1,1)},u_output_textel:{value:new Pe(1,1)},u_dt:{value:0},u_dissipation:{value:.98}})}onResize(){this.setResolution(),this.disposeFBOs(),this.initFBO(),this.updateTexelUniforms()}onPointerMove(e){this.updatePointerPosition(e.pageX,e.pageY)}updatePointerPosition(e,t){const i=e-this.webgl.stage.scrollOffset.x,s=t-this.webgl.stage.scrollOffset.y;this.pointer.moved=!0,this.pointer.dx=6*(i-this.pointer.x),this.pointer.dy=6*(s-this.pointer.y),this.pointer.x=i,this.pointer.y=s}disposeFBO(e){!e||!e.renderTarget||e.renderTarget.dispose()}disposeDoubleFBO(e){e&&(this.disposeFBO(e.read()),this.disposeFBO(e.write()))}disposeFBOs(){this.disposeDoubleFBO(this.outputColor),this.disposeDoubleFBO(this.velocity),this.disposeFBO(this.divergence),this.disposeDoubleFBO(this.pressure),this.outputColor=null,this.velocity=null,this.divergence=null,this.pressure=null}initFBO(){this.outputColor=this.createDoubleFBO(this.resolution.w,this.resolution.h),this.velocity=this.createDoubleFBO(this.resolution.w,this.resolution.h),this.divergence=this.createFBO(this.resolution.w,this.resolution.h),this.pressure=this.createDoubleFBO(this.resolution.w,this.resolution.h)}createFBO(e,t){const i=new Ti(e,t,{type:Di,format:hi,minFilter:Rt,magFilter:Rt,wrapS:Ii,wrapT:Ii,depthBuffer:!1,stencilBuffer:!1});return{renderTarget:i,width:e,height:t,texture:i.texture}}createDoubleFBO(e,t){let i=this.createFBO(e,t),s=this.createFBO(e,t);return{width:e,height:t,texelSizeX:1/e,texelSizeY:1/t,read:()=>i,write:()=>s,swap(){const r=i;i=s,s=r}}}updateTexelUniforms(){const e=new Pe(1/this.resolution.w,1/this.resolution.h);this.splatMaterial&&this.splatMaterial.uniforms.u_texel.value.copy(e),this.divergenceMaterial&&this.divergenceMaterial.uniforms.u_texel.value.copy(e),this.pressureMaterial&&this.pressureMaterial.uniforms.u_texel.value.copy(e),this.gradientSubtractMaterial&&this.gradientSubtractMaterial.uniforms.u_texel.value.copy(e),this.advectionMaterial&&this.advectionMaterial.uniforms.u_texel.value.copy(e)}render(){const e=.016666666666666666;this.pointer.moved&&this.splatMaterial&&this.velocity&&this.outputColor&&this.webgl&&this.webgl.stage&&this.webgl.stage.stageSize&&(this.pointer.moved=!1,this.splatMaterial.uniforms.u_input_texture.value=this.velocity.read().texture,this.splatMaterial.uniforms.u_ratio.value=this.webgl.stage.stageSize.aspect,this.splatMaterial.uniforms.u_point.value.set(this.pointer.x/this.webgl.stage.stageSize.width,1-this.pointer.y/this.webgl.stage.stageSize.canvasHeight),this.splatMaterial.uniforms.u_point_value.value.set(this.pointer.dx,-this.pointer.dy,0),this.splatMaterial.uniforms.u_point_size.value=this.guiParams.cursorSize*.001,this.renderPass(this.splatMaterial,this.velocity.write()),this.velocity.swap(),this.splatMaterial.uniforms.u_input_texture.value=this.outputColor.read().texture,this.splatMaterial.uniforms.u_point_value.value.set(this.guiParams.cursorPower*.001,0,0),this.renderPass(this.splatMaterial,this.outputColor.write()),this.outputColor.swap()),this.divergenceMaterial&&this.velocity&&this.divergence&&(this.divergenceMaterial.uniforms.u_velocity_texture.value=this.velocity.read().texture,this.renderPass(this.divergenceMaterial,this.divergence)),this.pressureMaterial&&this.divergence&&this.pressure&&(this.pressureMaterial.uniforms.u_divergence_texture.value=this.divergence.texture,this.pressureMaterial.uniforms.u_pressure_texture.value=this.pressure.read().texture,this.renderPass(this.pressureMaterial,this.pressure.write()),this.pressure.swap()),this.gradientSubtractMaterial&&this.pressure&&this.velocity&&(this.gradientSubtractMaterial.uniforms.u_pressure_texture.value=this.pressure.read().texture,this.gradientSubtractMaterial.uniforms.u_velocity_texture.value=this.velocity.read().texture,this.renderPass(this.gradientSubtractMaterial,this.velocity.write()),this.velocity.swap()),this.advectionMaterial&&this.velocity&&this.outputColor&&(this.advectionMaterial.uniforms.u_velocity_texture.value=this.velocity.read().texture,this.advectionMaterial.uniforms.u_input_texture.value=this.velocity.read().texture,this.advectionMaterial.uniforms.u_output_textel.value.set(this.velocity.texelSizeX,this.velocity.texelSizeY),this.advectionMaterial.uniforms.u_dt.value=e,this.advectionMaterial.uniforms.u_dissipation.value=.97,this.renderPass(this.advectionMaterial,this.velocity.write()),this.velocity.swap(),this.advectionMaterial.uniforms.u_input_texture.value=this.outputColor.read().texture,this.advectionMaterial.uniforms.u_output_textel.value.set(this.outputColor.texelSizeX,this.outputColor.texelSizeY),this.advectionMaterial.uniforms.u_dt.value=8*e,this.advectionMaterial.uniforms.u_dissipation.value=.98,this.renderPass(this.advectionMaterial,this.outputColor.write()),this.outputColor.swap());const t=this.webgl&&this.webgl.stage?this.webgl.stage.renderer:null;t&&t.setRenderTarget(null)}renderPass(e,t){const i=this.webgl&&this.webgl.stage?this.webgl.stage.renderer:null;!i||!this.mesh||!this.scene||!this.camera||(this.mesh.material=e,i.setRenderTarget(t?t.renderTarget:null),i.render(this.scene,this.camera))}}const HA=`precision highp float;

attribute vec3 position;
attribute vec2 uv;

varying vec2 vUv;

void main() {
	vUv = uv;

	gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,$A=`precision highp float;

uniform sampler2D u_scene;
uniform sampler2D u_velocity;
uniform sampler2D u_output;
uniform float u_disturb_power;

varying vec2 vUv;

void main() {
	float offset = texture2D(u_output, vUv).r;
	vec2 velocity = texture2D(u_velocity, vUv).xy;

	velocity += 0.001;

	vec2 dir = normalize(velocity);
	vec2 uv = vUv;

	uv -= u_disturb_power * dir * offset;
	uv -= u_disturb_power * dir * offset;

	gl_FragColor = texture2D(u_scene, uv);
}
`;class GA{positions;constructor(){this.positions={top:0,bottom:0,height:0}}setViewportAll(e=null){return this.positions.top=e?e.scrollTop:window.scrollY,this.positions.height=e?e.clientHeight:window.innerHeight,this.positions.bottom=this.positions.top+this.positions.height,this.positions}}const jr=new GA;class WA{frameState;selectorNames;cameraParams;geometryParams;$canvas;stage;stableFluids;sceneTarget;postScene;postCamera;postMesh;meshManager;isRendering;requestId;vs;fs;constructor(e={}){this.frameState={viewport:{positions:{top:0,bottom:0,height:0}},canvasRect:{top:0,right:0,bottom:0,left:0}},this.selectorNames={canvas:'[data-webgl="canvas"]'},this.cameraParams={left:-1,right:1,top:1,bottom:-1,near:0,far:1},this.geometryParams={width:2,height:2},this.$canvas=null,this.stage=null,this.stableFluids=null,this.sceneTarget=null,this.postScene=null,this.postCamera=null,this.postMesh=null,this.meshManager=null,this.isRendering=!1,this.requestId=0,this.vs=HA,this.fs=$A,Object.assign(this,e)}init(){jr.setViewportAll(),this.setSelector(),this.setStage(),this.isPostEffect()&&(this.setStableFluids(),this.setPostProcess()),this.addEventListeners(),this.onResize(),this.startRenderLoop()}destroy(){this.stopRenderLoop(),this.meshManager&&this.meshManager.destroy(),this.stage&&this.stage.destroy(),this.sceneTarget&&this.sceneTarget.dispose(),this.postMesh&&(this.postMesh.geometry.dispose(),Array.isArray(this.postMesh.material)?this.postMesh.material.forEach(e=>e.dispose()):this.postMesh.material.dispose())}isPostEffect(){return I.detection.pcLayout&&!I.detection.touchDevice}setSelector(){this.$canvas=document.querySelector(this.selectorNames.canvas)}setStage(){this.stage=new Ym({webgl:this,$canvas:this.$canvas,isScrollSync:!0}),this.stage&&this.stage.init()}setStableFluids(){this.stableFluids=new VA({webgl:this}),this.stableFluids.init()}setPostProcess(){if(!this.stage)return;const e=this.stage.stageSize.width,t=this.stage.stageSize.canvasHeight;this.sceneTarget=new Ti(e,t,{minFilter:vt,magFilter:vt,format:hi}),this.setPostScene(),this.setPostCamera(),this.setPostMesh()}setPostScene(){this.postScene=new xu}setPostCamera(){this.postCamera=new tl(this.cameraParams.left,this.cameraParams.right,this.cameraParams.top,this.cameraParams.bottom,this.cameraParams.near,this.cameraParams.far)}setPostMesh(){const e=this.stableFluids?this.stableFluids.guiParams.distortionPower:0,t=new Xt(this.geometryParams.width,this.geometryParams.height),i=new gn({vertexShader:this.vs,fragmentShader:this.fs,uniforms:{u_scene:{value:this.sceneTarget?this.sceneTarget.texture:null},u_velocity:{value:null},u_output:{value:null},u_disturb_power:{value:e}},depthTest:!1,depthWrite:!1});this.postMesh=new At(t,i),this.postScene&&this.postScene.add(this.postMesh)}setViewport(){jr.setViewportAll(),this.frameState.viewport.positions.top=jr.positions.top,this.frameState.viewport.positions.bottom=jr.positions.bottom,this.frameState.viewport.positions.height=jr.positions.height}setCanvasRect(){if(!this.stage||!this.stage.renderer)return;const e=this.stage.renderer.domElement.getBoundingClientRect();this.frameState.canvasRect.top=e.top,this.frameState.canvasRect.right=e.right,this.frameState.canvasRect.bottom=e.bottom,this.frameState.canvasRect.left=e.left}enter(){this.meshManager=new NA({webgl:this}),this.meshManager.init({root:document})}leave(){this.meshManager&&(this.meshManager.destroy(),this.meshManager=null)}addEventListeners(){window.addEventListener("resize",this.onResize),this.isPostEffect()&&window.addEventListener("mousemove",this.onPointerMove)}onResize=()=>{if(this.stage&&(this.stage.onResize(),this.setViewport(),this.setCanvasRect()),this.stableFluids&&this.stableFluids.onResize(),this.meshManager&&this.meshManager.onResize(this.frameState),this.sceneTarget&&this.stage){const e=this.stage.stageSize.width,t=this.stage.stageSize.canvasHeight,i=this.stage.devicePixelRatio;this.sceneTarget.setSize(e*i,t*i)}};onPointerMove=e=>{this.stableFluids&&this.stableFluids.onPointerMove(e)};startRenderLoop(){this.isRendering||(this.isRendering=!0,this.requestId=window.requestAnimationFrame(this.raf))}stopRenderLoop(){this.requestId&&(window.cancelAnimationFrame(this.requestId),this.requestId=0),this.isRendering=!1}raf=()=>{this.render(),this.isRendering&&(this.requestId=window.requestAnimationFrame(this.raf))};render(){if(this.setViewport(),this.stage&&(this.stage.render(),this.setCanvasRect()),this.stableFluids&&this.stableFluids.render(),this.meshManager&&this.meshManager.render(this.frameState),!this.stage)return;const e=this.stage.renderer;e&&this.stage.scene&&this.stage.camera&&(this.sceneTarget&&this.postMesh&&this.stableFluids&&this.stableFluids.velocity&&this.stableFluids.outputColor&&this.stableFluids.guiParams&&this.postScene&&this.postCamera?(this.postMesh.material.uniforms.u_velocity.value=this.stableFluids.velocity.read().texture,this.postMesh.material.uniforms.u_disturb_power.value=this.stableFluids.guiParams.distortionPower,this.postMesh.material.uniforms.u_output.value=this.stableFluids.outputColor.read().texture,e.setRenderTarget(this.sceneTarget),e.clear(),e.render(this.stage.scene,this.stage.camera),e.setRenderTarget(null),e.clear(),e.render(this.postScene,this.postCamera)):e.render(this.stage.scene,this.stage.camera))}}const qA=`uniform float uTranslateProgress;

varying vec2 vUv;

void main() {
  vUv = uv;

  vec3 newPosition = position;
  newPosition.x += uTranslateProgress * 0.1;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`,XA=`precision highp float;

uniform sampler2D uTexture;
uniform vec3 uColor;
uniform float uAlpha;
uniform float uHoverProgress;
uniform float uRipplePos;
uniform float uRippleStrength;

varying vec2 vUv;

float ripple(float uv, float time, float prog) {
  float distance = length(((uv) + (time * 2.0)));

  return tan(distance * (1.0)) * (prog * -1.85);
}

void main() {
  float rippleUv = ripple((vUv.x), uRipplePos, uRippleStrength) * (0.001 * uRippleStrength);
  float slideUvY = 0.5 + vUv.y * 0.5 - uHoverProgress * 0.5;
  vec2 newUv = vec2(vUv.x + rippleUv, slideUvY);
  vec2 clampedUv = clamp(newUv, vec2(0.0), vec2(1.0));
  vec4 texColor = texture2D(uTexture, clampedUv);
  float alpha = texColor.a * uAlpha;

  gl_FragColor = vec4(uColor, alpha);
}
`;class jA{uniforms;webgl;$parentElement;$target;texture;geometry;material;mesh;width;height;vs;fs;computedStyle;constructor(e={}){this.uniforms={uColor:{value:new Ze(16777215)},uTexture:{value:null},uHoverProgress:{value:0},uRippleStrength:{value:0},uAlpha:{value:0},uRipplePos:{value:0},uTranslateProgress:{value:0}},this.webgl=null,this.$parentElement=null,this.$target=null,this.texture=null,this.geometry=null,this.material=null,this.mesh=null,this.width=1,this.height=1,this.vs=qA,this.fs=XA,this.computedStyle=null,Object.assign(this,e)}init(){if(!this.$target)return;const e=this.$target.getBoundingClientRect();this.setSelector(),this.setStyle(),this.setInfo(e),this.setTexture(),this.setUniforms(),this.setMesh(),this.setMeshScale(),this.setMeshPosition(e),this.addEventListeners()}destroy(){D.killTweensOf(this.uniforms.uRippleStrength),D.killTweensOf(this.uniforms.uAlpha),D.killTweensOf(this.uniforms.uTranslateProgress),this.removeEventListeners(),this.webgl.stage.scene&&this.mesh&&this.webgl.stage.scene.remove(this.mesh),this.texture&&this.texture.dispose(),this.geometry&&this.geometry.dispose(),this.material&&this.material.dispose(),this.mesh=null}setSelector(){this.$target&&(this.$parentElement=this.$target.parentElement)}setStyle(){this.$target&&(this.computedStyle=getComputedStyle(this.$target))}setInfo(e){this.width=e.width,this.height=e.height}setTexture(){const e=Math.min(this.webgl.stage.devicePixelRatio||1,2),t=document.createElement("canvas");t.width=this.width*e,t.height=this.height*2*e;const i=t.getContext("2d"),{fontFamily:s="",fontSize:r="",fontWeight:a="",textAlign:o="left"}=this.computedStyle||{},l=parseFloat(this.computedStyle?.paddingInlineStart??"0");if(!i)return;i.fillStyle="rgb(255 32 32 / 0)",i.fillRect(0,0,this.width,this.height*2),i.textBaseline="top",i.textAlign=o,i.fillStyle="rgba(255, 255, 255, 1)",i.font=`${a} ${r} ${s}`,i.scale(e,e);let c=0,h=0;const u=I.detection.browser==="safari",f=this.$target?this.$target.closest(".nav_link"):null;if(f){const _=getComputedStyle(f);h=parseFloat(_.padding)}else h=0;if(u?c=h*-.45:c=h*.15,!this.$target)return;i.fillText(this.$target.textContent,o==="center"?this.width/2:l,c),i.fillText(this.$target.textContent,o==="center"?this.width/2:l,c+this.height);const d=new Hm(t);d.needsUpdate=!1,d.minFilter=vt,d.magFilter=vt,d.generateMipmaps=!1,this.webgl.stage.renderer.initTexture(d),this.texture=d}setUniforms(){this.uniforms={uColor:{value:new Ze(16777215)},uTexture:{value:this.texture},uHoverProgress:{value:0},uRippleStrength:{value:14},uAlpha:{value:0},uRipplePos:{value:1.8},uTranslateProgress:{value:1.2}}}setMesh(){this.geometry=new Xt(1,1,1,1),this.material=new mi({vertexShader:this.vs,fragmentShader:this.fs,transparent:!0,uniforms:this.uniforms,side:Nt,depthWrite:!1}),this.mesh=new At(this.geometry,this.material),this.mesh.renderOrder=2,this.webgl.stage.scene.add(this.mesh)}setMeshScale(){this.mesh&&(this.mesh.scale.x=this.width,this.mesh.scale.y=this.height)}setMeshPosition(e){if(!this.mesh)return;const t=this.webgl.stage.stageSize.width,i=this.webgl.stage.stageSize.height,s=e.left,r=e.top;this.mesh.position.x=-t*.5+s+this.width*.5,this.mesh.position.y=i*.5-r-this.height*.5}addEventListeners(){!I.detection.touchDevice&&this.$parentElement&&(this.$parentElement.addEventListener("mouseenter",this.onMouseEnter),this.$parentElement.addEventListener("mouseleave",this.onMouseLeave))}removeEventListeners(){!I.detection.touchDevice&&this.$parentElement&&(this.$parentElement.removeEventListener("mouseenter",this.onMouseEnter),this.$parentElement.removeEventListener("mouseleave",this.onMouseLeave))}onMouseEnter=()=>{I.isPageTransitioning||this.mouseEnterAnimation()};onMouseLeave=()=>{I.isPageTransitioning||this.mouseLeaveAnimation()};onResize(){if(!this.$target)return;const e=this.$target.getBoundingClientRect();this.setStyle(),this.setInfo(e);const t=this.uniforms.uTexture.value;this.setTexture(),this.uniforms.uTexture.value=this.texture,t.dispose(),this.setMeshScale(),this.setMeshPosition(e)}render(){if(I.isPageTransitioning||!this.$target)return;const e=this.$target.getBoundingClientRect();this.setMeshPosition(e)}inViewAnimation(){const e=I.detection.pcLayout?parseFloat(this.$target?.dataset?.pcAnimationDelay??"0"):parseFloat(this.$target?.dataset?.spAnimationDelay??"0");window.requestAnimationFrame(()=>{D.killTweensOf(this.uniforms.uRippleStrength),D.killTweensOf(this.uniforms.uAlpha),D.killTweensOf(this.uniforms.uTranslateProgress),D.to(this.uniforms.uRippleStrength,{value:1,duration:2,delay:e,ease:"cubic.out"}),D.to(this.uniforms.uAlpha,{value:1,duration:1.4,delay:e,ease:"none"}),D.to(this.uniforms.uTranslateProgress,{value:0,duration:1,delay:e,ease:"cubic.out"})})}outViewAnimation(){window.requestAnimationFrame(()=>{D.killTweensOf(this.uniforms.uRippleStrength),D.killTweensOf(this.uniforms.uAlpha),D.killTweensOf(this.uniforms.uTranslateProgress),D.killTweensOf(this.uniforms.uHoverProgress),D.set(this.uniforms.uRippleStrength,{value:14}),D.set(this.uniforms.uAlpha,{value:0}),D.set(this.uniforms.uTranslateProgress,{value:1.2}),D.set(this.uniforms.uHoverProgress,{value:0})})}mouseEnterAnimation(){window.requestAnimationFrame(()=>{D.killTweensOf(this.uniforms.uHoverProgress),D.to(this.uniforms.uHoverProgress,{value:1,duration:.7,ease:"quart.out"})})}mouseLeaveAnimation(){window.requestAnimationFrame(()=>{D.killTweensOf(this.uniforms.uHoverProgress),D.to(this.uniforms.uHoverProgress,{value:0,duration:.7,ease:"quart.out"})})}}class YA{selectorNames;$navTextMeshTargets;meshesItems;root;webgl;constructor(e={}){this.selectorNames={navTextMesh:{target:'[data-mesh-manager="nav-text-mesh"]'}},this.$navTextMeshTargets=[],this.meshesItems=[],this.root=document,this.webgl=null,Object.assign(this,e)}init({root:e=document}={}){e&&(this.root=e),this.setSelector(),this.setMeshes()}destroy(){this.clearMeshes()}setSelector(){this.$navTextMeshTargets=Array.from(this.root.querySelectorAll(this.selectorNames.navTextMesh.target))}setMeshes(){const e=[];this.$navTextMeshTargets.forEach((t,i)=>{e[i]=new jA({webgl:this.webgl,$target:t,index:i})}),this.meshesItems.push(e),this.meshesItems.forEach(t=>{t.forEach(i=>{i.init()})})}clearMeshes(){this.meshesItems.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.meshesItems=[]}onResize(){this.meshesItems.forEach(e=>{e.forEach(t=>{t.onResize()})})}render(){this.meshesItems.forEach(e=>{e.forEach(t=>{t.render()})})}}class KA{selectorNames;$canvas;stage;meshManager;isRendering;requestId;constructor(e={}){this.selectorNames={canvas:'[data-webgl="nav-canvas"]'},this.$canvas=null,this.stage=null,this.meshManager=null,this.isRendering=!1,this.requestId=0,Object.assign(this,e)}init(){this.setSelector(),this.setStage(),this.addEventListeners(),this.onResize()}destroy(){this.stopRenderLoop(),this.meshManager&&this.meshManager.destroy(),this.stage&&this.stage.destroy()}setSelector(){this.$canvas=document.querySelector(this.selectorNames.canvas)}setStage(){this.stage=new Ym({webgl:this,$canvas:this.$canvas,isScrollSync:!1}),this.stage&&this.stage.init()}enter(){this.meshManager=new YA({webgl:this}),this.meshManager.init({root:document})}leave(){this.meshManager&&(this.meshManager.destroy(),this.meshManager=null)}addEventListeners(){window.addEventListener("resize",this.onResize)}onResize=()=>{this.stage&&this.stage.onResize(),this.meshManager&&this.meshManager.onResize()};startRenderLoop(){this.isRendering||(this.isRendering=!0,this.requestId=window.requestAnimationFrame(this.raf))}stopRenderLoop(){this.requestId&&(window.cancelAnimationFrame(this.requestId),this.requestId=0),this.isRendering=!1}raf=()=>{this.render(),this.isRendering&&(this.requestId=window.requestAnimationFrame(this.raf))};render(){if(this.stage&&this.stage.render(),this.meshManager&&this.meshManager.render(),!this.stage)return;const e=this.stage.renderer;e&&this.stage.scene&&this.stage.camera&&e.render(this.stage.scene,this.stage.camera)}}class ZA{pageNames;isStartup;isPageTransitioning;is404;isContact;detection;windowEvent;intersectionObserverManager;resize;smoothScroll;webgl;navWebgl;constructor(){this.pageNames={home:'[data-page="home"]',philosophy:'[data-page="philosophy"]',projects:'[data-page="projects"]',school:'[data-page="school"]',craft:'[data-page="craft"]',craftSpace:'[data-page="craft-space"]',retreat:'[data-page="retreat"]',company:'[data-page="company"]',contact:'[data-page="contact"]',thanks:'[data-page="thanks"]',privacy:'[data-page="privacy"]',notFound:'[data-page="not-found"]'},this.isStartup=!0,this.isPageTransitioning=!1,this.is404=document.querySelector(this.pageNames.notFound)!==null,this.isContact=document.querySelector(this.pageNames.contact)!==null,this.detection=new G0,this.windowEvent=new W0,this.intersectionObserverManager=new q0,this.resize=new j0,this.smoothScroll=new sx,this.webgl=new WA,this.navWebgl=new KA}async init(){await new Promise(e=>{this.intersectionObserverManager.init(),this.resize.init(),this.smoothScroll.init(),this.webgl.init(),this.navWebgl.init(),e()})}}const I=new ZA;class JA{asynchronous;constructor(e){this.asynchronous=e}init(){Jg(),I&&I.init().then(()=>{this.startAsynchronous()})}startAsynchronous(){window.history.scrollRestoration="manual",this.asynchronous.init()}}const ec=new WeakMap;function tc(n,e,t,i){if(!n&&!ec.has(e))return!1;const s=ec.get(e)??new WeakMap;ec.set(e,s);const r=s.get(t)??new Set;s.set(t,r);const a=r.has(i);return n?r.add(i):r.delete(i),a&&n}function QA(n,e){let t=n.target;if(t instanceof Text&&(t=t.parentElement),t instanceof Element&&n.currentTarget instanceof Element){const i=t.closest(e);if(i&&n.currentTarget.contains(i))return i}}function e1(n,e,t,i={}){const{signal:s,base:r=document}=i;if(s?.aborted)return;const{once:a,...o}=i,l=r instanceof Document?r.documentElement:r,c=!!(typeof i=="object"?i.capture:i),h=d=>{const _=QA(d,String(n));if(_){const m=Object.assign(d,{delegateTarget:_});t.call(l,m),a&&(l.removeEventListener(e,h,o),tc(!1,l,t,u))}},u=JSON.stringify({selector:n,type:e,capture:c});tc(!0,l,t,u)||l.addEventListener(e,h,o),s?.addEventListener("abort",()=>{tc(!1,l,t,u)})}function t1(n){for(var e=[],t=0;t<n.length;){var i=n[t];if(i==="*"||i==="+"||i==="?"){e.push({type:"MODIFIER",index:t,value:n[t++]});continue}if(i==="\\"){e.push({type:"ESCAPED_CHAR",index:t++,value:n[t++]});continue}if(i==="{"){e.push({type:"OPEN",index:t,value:n[t++]});continue}if(i==="}"){e.push({type:"CLOSE",index:t,value:n[t++]});continue}if(i===":"){for(var s="",r=t+1;r<n.length;){var a=n.charCodeAt(r);if(a>=48&&a<=57||a>=65&&a<=90||a>=97&&a<=122||a===95){s+=n[r++];continue}break}if(!s)throw new TypeError("Missing parameter name at ".concat(t));e.push({type:"NAME",index:t,value:s}),t=r;continue}if(i==="("){var o=1,l="",r=t+1;if(n[r]==="?")throw new TypeError('Pattern cannot start with "?" at '.concat(r));for(;r<n.length;){if(n[r]==="\\"){l+=n[r++]+n[r++];continue}if(n[r]===")"){if(o--,o===0){r++;break}}else if(n[r]==="("&&(o++,n[r+1]!=="?"))throw new TypeError("Capturing groups are not allowed at ".concat(r));l+=n[r++]}if(o)throw new TypeError("Unbalanced pattern at ".concat(t));if(!l)throw new TypeError("Missing pattern at ".concat(t));e.push({type:"PATTERN",index:t,value:l}),t=r;continue}e.push({type:"CHAR",index:t,value:n[t++]})}return e.push({type:"END",index:t,value:""}),e}function i1(n,e){e===void 0&&(e={});for(var t=t1(n),i=e.prefixes,s=i===void 0?"./":i,r="[^".concat(or(e.delimiter||"/#?"),"]+?"),a=[],o=0,l=0,c="",h=function(E){if(l<t.length&&t[l].type===E)return t[l++].value},u=function(E){var P=h(E);if(P!==void 0)return P;var L=t[l],v=L.type,b=L.index;throw new TypeError("Unexpected ".concat(v," at ").concat(b,", expected ").concat(E))},f=function(){for(var E="",P;P=h("CHAR")||h("ESCAPED_CHAR");)E+=P;return E};l<t.length;){var d=h("CHAR"),_=h("NAME"),m=h("PATTERN");if(_||m){var g=d||"";s.indexOf(g)===-1&&(c+=g,g=""),c&&(a.push(c),c=""),a.push({name:_||o++,prefix:g,suffix:"",pattern:m||r,modifier:h("MODIFIER")||""});continue}var p=d||h("ESCAPED_CHAR");if(p){c+=p;continue}c&&(a.push(c),c="");var x=h("OPEN");if(x){var g=f(),M=h("NAME")||"",y=h("PATTERN")||"",w=f();u("CLOSE"),a.push({name:M||(y?o++:""),pattern:M&&!y?r:y,prefix:g,suffix:w,modifier:h("MODIFIER")||""});continue}u("END")}return a}function n1(n,e){var t=[],i=e_(n,t,e);return s1(i,t,e)}function s1(n,e,t){t===void 0&&(t={});var i=t.decode,s=i===void 0?function(r){return r}:i;return function(r){var a=n.exec(r);if(!a)return!1;for(var o=a[0],l=a.index,c=Object.create(null),h=function(f){if(a[f]===void 0)return"continue";var d=e[f-1];d.modifier==="*"||d.modifier==="+"?c[d.name]=a[f].split(d.prefix+d.suffix).map(function(_){return s(_,d)}):c[d.name]=s(a[f],d)},u=1;u<a.length;u++)h(u);return{path:o,index:l,params:c}}}function or(n){return n.replace(/([.+*?=^!:${}()[\]|/\\])/g,"\\$1")}function Qg(n){return n&&n.sensitive?"":"i"}function r1(n,e){if(!e)return n;for(var t=/\((?:\?<(.*?)>)?(?!\?)/g,i=0,s=t.exec(n.source);s;)e.push({name:s[1]||i++,prefix:"",suffix:"",modifier:"",pattern:""}),s=t.exec(n.source);return n}function a1(n,e,t){var i=n.map(function(s){return e_(s,e,t).source});return new RegExp("(?:".concat(i.join("|"),")"),Qg(t))}function o1(n,e,t){return l1(i1(n,t),e,t)}function l1(n,e,t){t===void 0&&(t={});for(var i=t.strict,s=i===void 0?!1:i,r=t.start,a=r===void 0?!0:r,o=t.end,l=o===void 0?!0:o,c=t.encode,h=c===void 0?function(b){return b}:c,u=t.delimiter,f=u===void 0?"/#?":u,d=t.endsWith,_=d===void 0?"":d,m="[".concat(or(_),"]|$"),g="[".concat(or(f),"]"),p=a?"^":"",x=0,M=n;x<M.length;x++){var y=M[x];if(typeof y=="string")p+=or(h(y));else{var w=or(h(y.prefix)),E=or(h(y.suffix));if(y.pattern)if(e&&e.push(y),w||E)if(y.modifier==="+"||y.modifier==="*"){var P=y.modifier==="*"?"?":"";p+="(?:".concat(w,"((?:").concat(y.pattern,")(?:").concat(E).concat(w,"(?:").concat(y.pattern,"))*)").concat(E,")").concat(P)}else p+="(?:".concat(w,"(").concat(y.pattern,")").concat(E,")").concat(y.modifier);else y.modifier==="+"||y.modifier==="*"?p+="((?:".concat(y.pattern,")").concat(y.modifier,")"):p+="(".concat(y.pattern,")").concat(y.modifier);else p+="(?:".concat(w).concat(E,")").concat(y.modifier)}}if(l)s||(p+="".concat(g,"?")),p+=t.endsWith?"(?=".concat(m,")"):"$";else{var L=n[n.length-1],v=typeof L=="string"?g.indexOf(L[L.length-1])>-1:L===void 0;s||(p+="(?:".concat(g,"(?=").concat(m,"))?")),v||(p+="(?=".concat(g,"|").concat(m,")"))}return new RegExp(p,Qg(t))}function e_(n,e,t){return n instanceof RegExp?r1(n,e):Array.isArray(n)?a1(n,e,t):o1(n,e,t)}function Ct(){return Ct=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var i in t)({}).hasOwnProperty.call(t,i)&&(n[i]=t[i])}return n},Ct.apply(null,arguments)}const t_=(n,e)=>String(n).toLowerCase().replace(/[\s/_.]+/g,"-").replace(/[^\w-]+/g,"").replace(/--+/g,"-").replace(/^-+|-+$/g,"")||e||"",Ca=({hash:n}={})=>window.location.pathname+window.location.search+(n?window.location.hash:""),c1=(n,e={})=>{const t=Ct({url:n=n||Ca({hash:!0}),random:Math.random(),source:"swup"},e);window.history.pushState(t,"",n)},ha=(n=null,e={})=>{n=n||Ca({hash:!0});const t=Ct({},window.history.state||{},{url:n,random:Math.random(),source:"swup"},e);window.history.replaceState(t,"",n)},h1=(n,e,t,i)=>{const s=new AbortController;return i=Ct({},i,{signal:s.signal}),e1(n,e,t,i),{destroy:()=>s.abort()}};class Zt extends URL{constructor(e,t=document.baseURI){super(e.toString(),t),Object.setPrototypeOf(this,Zt.prototype)}get url(){return this.pathname+this.search}static fromElement(e){const t=e.getAttribute("href")||e.getAttribute("xlink:href")||"";return new Zt(t)}static fromUrl(e){return new Zt(e)}}const Ld=(n,e)=>{Array.isArray(n)&&!n.length&&(n="");try{return n1(n,e)}catch(t){throw new Error(`[swup] Error parsing path "${String(n)}":
${String(t)}`)}};class _o extends Error{constructor(e,t){super(e),this.url=void 0,this.status=void 0,this.aborted=void 0,this.timedOut=void 0,this.name="FetchError",this.url=t.url,this.status=t.status,this.aborted=t.aborted||!1,this.timedOut=t.timedOut||!1}}async function u1(n,e={}){var t;n=Zt.fromUrl(n).url;const{visit:i=this.visit}=e,s=Ct({},this.options.requestHeaders,e.headers),r=(t=e.timeout)!=null?t:this.options.timeout,a=new AbortController,{signal:o}=a;e=Ct({},e,{headers:s,signal:o});let l,c=!1,h=null;r&&r>0&&(h=setTimeout(()=>{c=!0,a.abort("timeout")},r));try{l=await this.hooks.call("fetch:request",i,{url:n,options:e},(g,{url:p,options:x})=>fetch(p,x)),h&&clearTimeout(h)}catch(g){throw c?(this.hooks.call("fetch:timeout",i,{url:n}),new _o(`Request timed out: ${n}`,{url:n,timedOut:c})):g?.name==="AbortError"||o.aborted?new _o(`Request aborted: ${n}`,{url:n,aborted:!0}):g}const{status:u,url:f}=l,d=await l.text();if(u===500)throw this.hooks.call("fetch:error",i,{status:u,response:l,url:f}),new _o(`Server error: ${f}`,{status:u,url:f});if(!d)throw new _o(`Empty response: ${f}`,{status:u,url:f});const{url:_}=Zt.fromUrl(f),m={url:_,html:d};return!i.cache.write||e.method&&e.method!=="GET"||n!==_||this.cache.set(m.url,m),m}class f1{constructor(e){this.swup=void 0,this.pages=new Map,this.swup=e}get size(){return this.pages.size}get all(){const e=new Map;return this.pages.forEach((t,i)=>{e.set(i,Ct({},t))}),e}has(e){return this.pages.has(this.resolve(e))}get(e){const t=this.pages.get(this.resolve(e));return t&&Ct({},t)}set(e,t){t=Ct({},t,{url:e=this.resolve(e)}),this.pages.set(e,t),this.swup.hooks.callSync("cache:set",void 0,{page:t})}update(e,t){e=this.resolve(e);const i=Ct({},this.get(e),t,{url:e});this.pages.set(e,i)}delete(e){this.pages.delete(this.resolve(e))}clear(){this.pages.clear(),this.swup.hooks.callSync("cache:clear",void 0,void 0)}prune(e){this.pages.forEach((t,i)=>{e(i,t)&&this.delete(i)})}resolve(e){const{url:t}=Zt.fromUrl(e);return this.swup.resolveUrl(t)}}const Ch=(n,e=document)=>e.querySelector(n),zu=(n,e=document)=>Array.from(e.querySelectorAll(n)),i_=()=>new Promise(n=>{requestAnimationFrame(()=>{requestAnimationFrame(()=>{n()})})});function Vu(n){return!!n&&(typeof n=="object"||typeof n=="function")&&typeof n.then=="function"}function d1(n,e=[]){return new Promise((t,i)=>{const s=n(...e);Vu(s)?s.then(t,i):t(s)})}function Id(n,e){const t=n?.closest(`[${e}]`);return t!=null&&t.hasAttribute(e)?t?.getAttribute(e)||!0:void 0}class p1{constructor(e){this.swup=void 0,this.swupClasses=["to-","is-changing","is-rendering","is-popstate","is-animating","is-leaving"],this.swup=e}get selectors(){const{scope:e}=this.swup.visit.animation;return e==="containers"?this.swup.visit.containers:e==="html"?["html"]:Array.isArray(e)?e:[]}get selector(){return this.selectors.join(",")}get targets(){return this.selector.trim()?zu(this.selector):[]}add(...e){this.targets.forEach(t=>t.classList.add(...e))}remove(...e){this.targets.forEach(t=>t.classList.remove(...e))}clear(){this.targets.forEach(e=>{const t=e.className.split(" ").filter(i=>this.isSwupClass(i));e.classList.remove(...t)})}isSwupClass(e){return this.swupClasses.some(t=>e.startsWith(t))}}class n_{constructor(e,t){this.id=void 0,this.state=void 0,this.from=void 0,this.to=void 0,this.containers=void 0,this.animation=void 0,this.trigger=void 0,this.cache=void 0,this.history=void 0,this.scroll=void 0,this.meta=void 0;const{to:i,from:s,hash:r,el:a,event:o}=t;this.id=Math.random(),this.state=1,this.from={url:s??e.location.url,hash:e.location.hash},this.to={url:i,hash:r},this.containers=e.options.containers,this.animation={animate:!0,wait:!1,name:void 0,native:e.options.native,scope:e.options.animationScope,selector:e.options.animationSelector},this.trigger={el:a,event:o},this.cache={read:e.options.cache,write:e.options.cache},this.history={action:"push",popstate:!1,direction:void 0},this.scroll={reset:!0,target:void 0},this.meta={}}advance(e){this.state<e&&(this.state=e)}abort(){this.state=8}get done(){return this.state>=7}}function m1(n){return new n_(this,n)}class g1{constructor(e){this.swup=void 0,this.registry=new Map,this.hooks=["animation:out:start","animation:out:await","animation:out:end","animation:in:start","animation:in:await","animation:in:end","animation:skip","cache:clear","cache:set","content:replace","content:scroll","enable","disable","fetch:request","fetch:error","fetch:timeout","history:popstate","link:click","link:self","link:anchor","link:newtab","page:load","page:view","scroll:top","scroll:anchor","visit:start","visit:transition","visit:abort","visit:end"],this.swup=e,this.init()}init(){this.hooks.forEach(e=>this.create(e))}create(e){this.registry.has(e)||this.registry.set(e,new Map)}exists(e){return this.registry.has(e)}get(e){const t=this.registry.get(e);if(t)return t;console.error(`Unknown hook '${e}'`)}clear(){this.registry.forEach(e=>e.clear())}on(e,t,i={}){const s=this.get(e);if(!s)return console.warn(`Hook '${e}' not found.`),()=>{};const r=Ct({},i,{id:s.size+1,hook:e,handler:t});return s.set(t,r),()=>this.off(e,t)}before(e,t,i={}){return this.on(e,t,Ct({},i,{before:!0}))}replace(e,t,i={}){return this.on(e,t,Ct({},i,{replace:!0}))}once(e,t,i={}){return this.on(e,t,Ct({},i,{once:!0}))}off(e,t){const i=this.get(e);i&&t?i.delete(t)||console.warn(`Handler for hook '${e}' not found.`):i&&i.clear()}async call(e,t,i,s){const[r,a,o]=this.parseCallArgs(e,t,i,s),{before:l,handler:c,after:h}=this.getHandlers(e,o);await this.run(l,r,a);const[u]=await this.run(c,r,a,!0);return await this.run(h,r,a),this.dispatchDomEvent(e,r,a),u}callSync(e,t,i,s){const[r,a,o]=this.parseCallArgs(e,t,i,s),{before:l,handler:c,after:h}=this.getHandlers(e,o);this.runSync(l,r,a);const[u]=this.runSync(c,r,a,!0);return this.runSync(h,r,a),this.dispatchDomEvent(e,r,a),u}parseCallArgs(e,t,i,s){return t instanceof n_||typeof t!="object"&&typeof i!="function"?[t,i,s]:[void 0,t,i]}async run(e,t=this.swup.visit,i,s=!1){const r=[];for(const{hook:a,handler:o,defaultHandler:l,once:c}of e)if(t==null||!t.done){c&&this.off(a,o);try{const h=await d1(o,[t,i,l]);r.push(h)}catch(h){if(s)throw h;console.error(`Error in hook '${a}':`,h)}}return r}runSync(e,t=this.swup.visit,i,s=!1){const r=[];for(const{hook:a,handler:o,defaultHandler:l,once:c}of e)if(t==null||!t.done){c&&this.off(a,o);try{const h=o(t,i,l);r.push(h),Vu(h)&&console.warn(`Swup will not await Promises in handler for synchronous hook '${a}'.`)}catch(h){if(s)throw h;console.error(`Error in hook '${a}':`,h)}}return r}getHandlers(e,t){const i=this.get(e);if(!i)return{found:!1,before:[],handler:[],after:[],replaced:!1};const s=Array.from(i.values()),r=this.sortRegistrations,a=s.filter(({before:u,replace:f})=>u&&!f).sort(r),o=s.filter(({replace:u})=>u).filter(u=>!0).sort(r),l=s.filter(({before:u,replace:f})=>!u&&!f).sort(r),c=o.length>0;let h=[];if(t&&(h=[{id:0,hook:e,handler:t}],c)){const u=o.length-1,{handler:f,once:d}=o[u],_=m=>{const g=o[m-1];return g?(p,x)=>g.handler(p,x,_(m-1)):t};h=[{id:0,hook:e,once:d,handler:f,defaultHandler:_(u)}]}return{found:!0,before:a,handler:h,after:l,replaced:c}}sortRegistrations(e,t){var i,s;return((i=e.priority)!=null?i:0)-((s=t.priority)!=null?s:0)||e.id-t.id||0}dispatchDomEvent(e,t,i){if(t!=null&&t.done)return;const s={hook:e,args:i,visit:t||this.swup.visit};document.dispatchEvent(new CustomEvent("swup:any",{detail:s,bubbles:!0})),document.dispatchEvent(new CustomEvent(`swup:${e}`,{detail:s,bubbles:!0}))}parseName(e){const[t,...i]=e.split(".");return[t,i.reduce((s,r)=>Ct({},s,{[r]:!0}),{})]}}const _1=n=>{if(n&&n.charAt(0)==="#"&&(n=n.substring(1)),!n)return null;const e=decodeURIComponent(n);let t=document.getElementById(n)||document.getElementById(e)||Ch(`a[name='${CSS.escape(n)}']`)||Ch(`a[name='${CSS.escape(e)}']`);return t||n!=="top"||(t=document.body),t},vo="transition",ic="animation";async function v1({selector:n,elements:e}){if(n===!1&&!e)return;let t=[];if(e)t=Array.from(e);else if(n&&(t=zu(n,document.body),!t.length))return void console.warn(`[swup] No elements found matching animationSelector \`${n}\``);const i=t.map(s=>(function(r){const{type:a,timeout:o,propCount:l}=(function(c){const h=window.getComputedStyle(c),u=xo(h,`${vo}Delay`),f=xo(h,`${vo}Duration`),d=Dd(u,f),_=xo(h,`${ic}Delay`),m=xo(h,`${ic}Duration`),g=Dd(_,m),p=Math.max(d,g),x=p>0?d>g?vo:ic:null;return{type:x,timeout:p,propCount:x?x===vo?f.length:m.length:0}})(r);return!(!a||!o)&&new Promise(c=>{const h=`${a}end`,u=performance.now();let f=0;const d=()=>{r.removeEventListener(h,_),c()},_=m=>{m.target===r&&((performance.now()-u)/1e3<m.elapsedTime||++f>=l&&d())};setTimeout(()=>{f<l&&d()},o+1),r.addEventListener(h,_)})})(s));i.filter(Boolean).length>0?await Promise.all(i):n&&console.warn(`[swup] No CSS animation duration defined on elements matching \`${n}\``)}function xo(n,e){return(n[e]||"").split(", ")}function Dd(n,e){for(;n.length<e.length;)n=n.concat(n);return Math.max(...e.map((t,i)=>Nd(t)+Nd(n[i])))}function Nd(n){return 1e3*parseFloat(n)}function x1(n,e={},t={}){if(typeof n!="string")throw new Error("swup.navigate() requires a URL parameter");if(this.shouldIgnoreVisit(n,{el:t.el,event:t.event}))return void window.location.assign(n);const{url:i,hash:s}=Zt.fromUrl(n),r=this.createVisit(Ct({},t,{to:i,hash:s}));this.performNavigation(r,e)}async function S1(n,e={}){if(this.navigating){if(this.visit.state>=6)return n.state=2,void(this.onVisitEnd=()=>this.performNavigation(n,e));await this.hooks.call("visit:abort",this.visit,void 0),delete this.visit.to.document,this.visit.state=8}this.navigating=!0,this.visit=n;const{el:t}=n.trigger;e.referrer=e.referrer||this.location.url,e.animate===!1&&(n.animation.animate=!1),n.animation.animate||this.classes.clear();const i=e.history||Id(t,"data-swup-history");typeof i=="string"&&["push","replace"].includes(i)&&(n.history.action=i);const s=e.animation||Id(t,"data-swup-animation");var r,a;typeof s=="string"&&(n.animation.name=s),n.meta=e.meta||{},typeof e.cache=="object"?(n.cache.read=(r=e.cache.read)!=null?r:n.cache.read,n.cache.write=(a=e.cache.write)!=null?a:n.cache.write):e.cache!==void 0&&(n.cache={read:!!e.cache,write:!!e.cache}),delete e.cache;try{await this.hooks.call("visit:start",n,void 0),n.state=3;const o=this.hooks.call("page:load",n,{options:e},async(c,h)=>{let u;return c.cache.read&&(u=this.cache.get(c.to.url)),h.page=u||await this.fetchPage(c.to.url,h.options),h.cache=!!u,h.page});o.then(({html:c})=>{n.advance(5),n.to.html=c,n.to.document=new DOMParser().parseFromString(c,"text/html")});const l=n.to.url+n.to.hash;if(n.history.popstate||(n.history.action==="replace"||n.to.url===this.location.url?ha(l):(this.currentHistoryIndex++,c1(l,{index:this.currentHistoryIndex}))),this.location=Zt.fromUrl(l),n.history.popstate&&this.classes.add("is-popstate"),n.animation.name&&this.classes.add(`to-${t_(n.animation.name)}`),n.animation.wait&&await o,n.done||(await this.hooks.call("visit:transition",n,void 0,async()=>{if(!n.animation.animate)return await this.hooks.call("animation:skip",void 0),void await this.renderPage(n,await o);n.advance(4),await this.animatePageOut(n),n.animation.native&&document.startViewTransition?await document.startViewTransition(async()=>await this.renderPage(n,await o)).finished:await this.renderPage(n,await o),await this.animatePageIn(n)}),n.done))return;await this.hooks.call("visit:end",n,void 0,()=>this.classes.clear()),n.state=7,this.navigating=!1,this.onVisitEnd&&(this.onVisitEnd(),this.onVisitEnd=void 0)}catch(o){if(!o||o!=null&&o.aborted)return void(n.state=8);n.state=9,console.error(o),this.options.skipPopStateHandling=()=>(window.location.assign(n.to.url+n.to.hash),!0),window.history.back()}finally{delete n.to.document}}const y1=async function(n){await this.hooks.call("animation:out:start",n,void 0,()=>{this.classes.add("is-changing","is-animating","is-leaving")}),await this.hooks.call("animation:out:await",n,{skip:!1},(e,{skip:t})=>{if(!t)return this.awaitAnimations({selector:e.animation.selector})}),await this.hooks.call("animation:out:end",n,void 0)},w1=function(n){var e;const t=n.to.document;if(!t)return!1;const i=((e=t.querySelector("title"))==null?void 0:e.innerText)||"";document.title=i;const s=zu('[data-swup-persist]:not([data-swup-persist=""])'),r=n.containers.map(a=>{const o=document.querySelector(a),l=t.querySelector(a);return o&&l?(o.replaceWith(l.cloneNode(!0)),!0):(o||console.warn(`[swup] Container missing in current document: ${a}`),l||console.warn(`[swup] Container missing in incoming document: ${a}`),!1)}).filter(Boolean);return s.forEach(a=>{const o=a.getAttribute("data-swup-persist"),l=Ch(`[data-swup-persist="${o}"]`);l&&l!==a&&l.replaceWith(a)}),r.length===n.containers.length},M1=function(n){const e={behavior:"auto"},{target:t,reset:i}=n.scroll,s=t??n.to.hash;let r=!1;return s&&(r=this.hooks.callSync("scroll:anchor",n,{hash:s,options:e},(a,{hash:o,options:l})=>{const c=this.getAnchorElement(o);return c&&c.scrollIntoView(l),!!c})),i&&!r&&(r=this.hooks.callSync("scroll:top",n,{options:e},(a,{options:o})=>(window.scrollTo(Ct({top:0,left:0},o)),!0))),r},b1=async function(n){if(n.done)return;const e=this.hooks.call("animation:in:await",n,{skip:!1},(t,{skip:i})=>{if(!i)return this.awaitAnimations({selector:t.animation.selector})});await i_(),await this.hooks.call("animation:in:start",n,void 0,()=>{this.classes.remove("is-animating")}),await e,await this.hooks.call("animation:in:end",n,void 0)},E1=async function(n,e){if(n.done)return;n.advance(6);const{url:t}=e;this.isSameResolvedUrl(Ca(),t)||(ha(t),this.location=Zt.fromUrl(t),n.to.url=this.location.url,n.to.hash=this.location.hash),await this.hooks.call("content:replace",n,{page:e},(i,{})=>{if(this.classes.remove("is-leaving"),i.animation.animate&&this.classes.add("is-rendering"),!this.replaceContent(i))throw new Error("[swup] Container mismatch, aborting");i.animation.animate&&(this.classes.add("is-changing","is-animating","is-rendering"),i.animation.name&&this.classes.add(`to-${t_(i.animation.name)}`))}),await this.hooks.call("content:scroll",n,void 0,()=>this.scrollToContent(n)),await this.hooks.call("page:view",n,{url:this.location.url,title:document.title})},T1=function(n){var e;if(e=n,!!e?.isSwupPlugin){if(n.swup=this,!n._checkRequirements||n._checkRequirements())return n._beforeMount&&n._beforeMount(),n.mount(),this.plugins.push(n),this.plugins}else console.error("Not a swup plugin instance",n)};function A1(n){const e=this.findPlugin(n);if(e)return e.unmount(),e._afterUnmount&&e._afterUnmount(),this.plugins=this.plugins.filter(t=>t!==e),this.plugins;console.error("No such plugin",e)}function P1(n){return this.plugins.find(e=>e===n||e.name===n||e.name===`Swup${String(n)}`)}function C1(n){if(typeof this.options.resolveUrl!="function")return console.warn("[swup] options.resolveUrl expects a callback function."),n;const e=this.options.resolveUrl(n);return e&&typeof e=="string"?e.startsWith("//")||e.startsWith("http")?(console.warn("[swup] options.resolveUrl needs to return a relative url"),n):e:(console.warn("[swup] options.resolveUrl needs to return a url"),n)}function R1(n,e){return this.resolveUrl(n)===this.resolveUrl(e)}const L1={animateHistoryBrowsing:!1,animationSelector:'[class*="transition-"]',animationScope:"html",cache:!0,containers:["#swup"],hooks:{},ignoreVisit:(n,{el:e}={})=>!(e==null||!e.closest("[data-no-swup]")),linkSelector:"a[href]",linkToSelf:"scroll",native:!1,plugins:[],resolveUrl:n=>n,requestHeaders:{"X-Requested-With":"swup",Accept:"text/html, application/xhtml+xml"},skipPopStateHandling:n=>{var e;return((e=n.state)==null?void 0:e.source)!=="swup"},timeout:0};class I1{get currentPageUrl(){return this.location.url}constructor(e={}){var t,i;this.version="4.8.2",this.options=void 0,this.defaults=L1,this.plugins=[],this.visit=void 0,this.cache=void 0,this.hooks=void 0,this.classes=void 0,this.location=Zt.fromUrl(window.location.href),this.currentHistoryIndex=void 0,this.clickDelegate=void 0,this.navigating=!1,this.onVisitEnd=void 0,this.use=T1,this.unuse=A1,this.findPlugin=P1,this.log=()=>{},this.navigate=x1,this.performNavigation=S1,this.createVisit=m1,this.delegateEvent=h1,this.fetchPage=u1,this.awaitAnimations=v1,this.renderPage=E1,this.replaceContent=w1,this.animatePageIn=b1,this.animatePageOut=y1,this.scrollToContent=M1,this.getAnchorElement=_1,this.getCurrentUrl=Ca,this.resolveUrl=C1,this.isSameResolvedUrl=R1,this.options=Ct({},this.defaults,e),this.handleLinkClick=this.handleLinkClick.bind(this),this.handlePopState=this.handlePopState.bind(this),this.cache=new f1(this),this.classes=new p1(this),this.hooks=new g1(this),this.visit=this.createVisit({to:""}),this.currentHistoryIndex=(t=(i=window.history.state)==null?void 0:i.index)!=null?t:1,this.enable()}async enable(){var e;const{linkSelector:t}=this.options;this.clickDelegate=this.delegateEvent(t,"click",this.handleLinkClick),window.addEventListener("popstate",this.handlePopState),this.options.animateHistoryBrowsing&&(window.history.scrollRestoration="manual"),this.options.native=this.options.native&&!!document.startViewTransition,this.options.plugins.forEach(i=>this.use(i));for(const[i,s]of Object.entries(this.options.hooks)){const[r,a]=this.hooks.parseName(i);this.hooks.on(r,s,a)}((e=window.history.state)==null?void 0:e.source)!=="swup"&&ha(null,{index:this.currentHistoryIndex}),await i_(),await this.hooks.call("enable",void 0,void 0,()=>{const i=document.documentElement;i.classList.add("swup-enabled"),i.classList.toggle("swup-native",this.options.native)})}async destroy(){this.clickDelegate.destroy(),window.removeEventListener("popstate",this.handlePopState),this.cache.clear(),this.options.plugins.forEach(e=>this.unuse(e)),await this.hooks.call("disable",void 0,void 0,()=>{const e=document.documentElement;e.classList.remove("swup-enabled"),e.classList.remove("swup-native")}),this.hooks.clear()}shouldIgnoreVisit(e,{el:t,event:i}={}){const{origin:s,url:r,hash:a}=Zt.fromUrl(e);return s!==window.location.origin||!(!t||!this.triggerWillOpenNewWindow(t))||!!this.options.ignoreVisit(r+a,{el:t,event:i})}handleLinkClick(e){const t=e.delegateTarget,{href:i,url:s,hash:r}=Zt.fromElement(t);if(this.shouldIgnoreVisit(i,{el:t,event:e}))return;if(this.navigating&&s===this.visit.to.url)return void e.preventDefault();const a=this.createVisit({to:s,hash:r,el:t,event:e});e.metaKey||e.ctrlKey||e.shiftKey||e.altKey?this.hooks.callSync("link:newtab",a,{href:i}):e.button===0&&this.hooks.callSync("link:click",a,{el:t,event:e},()=>{var o;const l=(o=a.from.url)!=null?o:"";e.preventDefault(),s&&s!==l?this.isSameResolvedUrl(s,l)||this.performNavigation(a):r?this.hooks.callSync("link:anchor",a,{hash:r},()=>{ha(s+r),this.scrollToContent(a)}):this.hooks.callSync("link:self",a,void 0,()=>{this.options.linkToSelf==="navigate"?this.performNavigation(a):(ha(s),this.scrollToContent(a))})})}handlePopState(e){var t,i,s,r;const a=(t=(i=e.state)==null?void 0:i.url)!=null?t:window.location.href;if(this.options.skipPopStateHandling(e)||this.isSameResolvedUrl(Ca(),this.location.url))return;const{url:o,hash:l}=Zt.fromUrl(a),c=this.createVisit({to:o,hash:l,event:e});c.history.popstate=!0;const h=(s=(r=e.state)==null?void 0:r.index)!=null?s:0;h&&h!==this.currentHistoryIndex&&(c.history.direction=h-this.currentHistoryIndex>0?"forwards":"backwards",this.currentHistoryIndex=h),c.animation.animate=!1,c.scroll.reset=!1,c.scroll.target=!1,this.options.animateHistoryBrowsing&&(c.animation.animate=!0,c.scroll.reset=!0),this.hooks.callSync("history:popstate",c,{event:e},()=>{this.performNavigation(c)})}triggerWillOpenNewWindow(e){return!!e.matches('[download], [target="_blank"]')}}function ua(){return ua=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(n[i]=t[i])}return n},ua.apply(this,arguments)}const Od=n=>String(n).split(".").map(e=>String(parseInt(e||"0",10))).concat(["0","0"]).slice(0,3).join(".");let D1=class{constructor(){this.isSwupPlugin=!0,this.swup=void 0,this.version=void 0,this.requires={},this.handlersToUnregister=[]}mount(){}unmount(){this.handlersToUnregister.forEach(e=>e()),this.handlersToUnregister=[]}_beforeMount(){if(!this.name)throw new Error("You must define a name of plugin when creating a class.")}_afterUnmount(){}_checkRequirements(){return typeof this.requires!="object"||Object.entries(this.requires).forEach(([e,t])=>{if(!(function(i,s,r){const a=(function(o,l){var c;if(o==="swup")return(c=l.version)!=null?c:"";{var h;const u=l.findPlugin(o);return(h=u?.version)!=null?h:""}})(i,r);return!!a&&((o,l)=>l.every(c=>{const[,h,u]=c.match(/^([\D]+)?(.*)$/)||[];var f,d;return((_,m)=>{const g={"":p=>p===0,">":p=>p>0,">=":p=>p>=0,"<":p=>p<0,"<=":p=>p<=0};return(g[m]||g[""])(_)})((d=u,f=Od(f=o),d=Od(d),f.localeCompare(d,void 0,{numeric:!0})),h||">=")}))(a,s)})(e,t=Array.isArray(t)?t:[t],this.swup)){const i=`${e} ${t.join(", ")}`;throw new Error(`Plugin version mismatch: ${this.name} requires ${i}`)}}),!0}on(e,t,i={}){var s;t=!(s=t).name.startsWith("bound ")||s.hasOwnProperty("prototype")?t.bind(this):t;const r=this.swup.hooks.on(e,t,i);return this.handlersToUnregister.push(r),r}once(e,t,i={}){return this.on(e,t,ua({},i,{once:!0}))}before(e,t,i={}){return this.on(e,t,ua({},i,{before:!0}))}replace(e,t,i={}){return this.on(e,t,ua({},i,{replace:!0}))}off(e,t){return this.swup.hooks.off(e,t)}};function Rh(){return Rh=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(n[i]=t[i])}return n},Rh.apply(this,arguments)}let N1=class extends D1{constructor(e={}){super(),this.name="SwupGaPlugin",this.requires={swup:">=4"},this.defaults={gaMeasurementId:null},this.options=Rh({},this.defaults,e)}mount(){this.on("page:view",this.trackPageView)}trackPageView(){const e=document.title,t=window.location.pathname+window.location.search;typeof window.gtag=="function"?(this.trackPageViewInGtag({title:e,url:t}),this.swup.log(`GA page view: ${t} (gtag.js)`)):typeof window.ga=="function"?(this.trackPageViewInGa({title:e,url:t}),this.swup.log(`GA page view: ${t} (analytics.js)`)):console.warn("Neither window.gtag nor window.ga are present on the page")}trackPageViewInGtag({title:e,url:t}){const{gaMeasurementId:i}=this.options;i?window.gtag("config",i,{page_title:e,page_path:t}):console.error("The gaMeasurementId option is required for gtag.js")}trackPageViewInGa({title:e,url:t}){window.ga("set","title",e),window.ga("set","page",t),window.ga("send","pageview")}};function fa(){return fa=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(n[i]=t[i])}return n},fa.apply(this,arguments)}const Ud=n=>String(n).split(".").map(e=>String(parseInt(e||"0",10))).concat(["0","0"]).slice(0,3).join(".");class O1{constructor(){this.isSwupPlugin=!0,this.swup=void 0,this.version=void 0,this.requires={},this.handlersToUnregister=[]}mount(){}unmount(){this.handlersToUnregister.forEach(e=>e()),this.handlersToUnregister=[]}_beforeMount(){if(!this.name)throw new Error("You must define a name of plugin when creating a class.")}_afterUnmount(){}_checkRequirements(){return typeof this.requires!="object"||Object.entries(this.requires).forEach(([e,t])=>{if(!(function(i,s,r){const a=(function(o,l){var c;if(o==="swup")return(c=l.version)!=null?c:"";{var h;const u=l.findPlugin(o);return(h=u?.version)!=null?h:""}})(i,r);return!!a&&((o,l)=>l.every(c=>{const[,h,u]=c.match(/^([\D]+)?(.*)$/)||[];var f,d;return((_,m)=>{const g={"":p=>p===0,">":p=>p>0,">=":p=>p>=0,"<":p=>p<0,"<=":p=>p<=0};return(g[m]||g[""])(_)})((d=u,f=Ud(f=o),d=Ud(d),f.localeCompare(d,void 0,{numeric:!0})),h||">=")}))(a,s)})(e,t=Array.isArray(t)?t:[t],this.swup)){const i=`${e} ${t.join(", ")}`;throw new Error(`Plugin version mismatch: ${this.name} requires ${i}`)}}),!0}on(e,t,i={}){var s;t=!(s=t).name.startsWith("bound ")||s.hasOwnProperty("prototype")?t.bind(this):t;const r=this.swup.hooks.on(e,t,i);return this.handlersToUnregister.push(r),r}once(e,t,i={}){return this.on(e,t,fa({},i,{once:!0}))}before(e,t,i={}){return this.on(e,t,fa({},i,{before:!0}))}replace(e,t,i={}){return this.on(e,t,fa({},i,{replace:!0}))}off(e,t){return this.swup.hooks.off(e,t)}}function Go(){return Go=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(n[i]=t[i])}return n},Go.apply(this,arguments)}const U1={from:"(.*)",to:"(.*)",out:n=>n(),in:n=>n()};class F1 extends O1{constructor(e){var t,i;super(),t=this,this.name="SwupJsPlugin",this.requires={swup:">=4"},this.defaults={animations:[],matchOptions:{}},this.options=void 0,this.animations=[],this.awaitOutAnimation=async function(s,{skip:r}){r||await t.findAndRunAnimation(s,"out")},this.awaitInAnimation=async function(s,{skip:r}){r||await t.findAndRunAnimation(s,"in")},Array.isArray(e)&&(e={animations:e}),this.options=Go({},this.defaults,e),this.options.animations.push(U1),this.animations=(i=this.options.matchOptions,this.options.animations.map(s=>(function(r,a){return Go({},r,{matchesFrom:Ld(r.from,a),matchesTo:Ld(r.to,a)})})(s,i)))}mount(){this.replace("animation:out:await",this.awaitOutAnimation,{priority:-1}),this.replace("animation:in:await",this.awaitInAnimation,{priority:-1})}async findAndRunAnimation(e,t){const i=(function(s,r){return(function(a,o,l,c){let h=0;return a.reduceRight((f,d)=>{const _=(function(m,g,p,x){let M=0;const y=m.matchesFrom(g);return y&&(M+=1),m.matchesTo(p)&&(M+=1),y&&m.to===x&&(M+=2),M})(d,o,l,c);return _>=h?(h=_,d):f},null)})(s,r.from.url,r.to.url,r.animation.name)})(this.animations,e);if(i){const s=(function(r,a,o){const l=r.matchesFrom(a.from.url),c=r.matchesTo(a.to.url);return{visit:a,direction:o,from:{url:a.from.url,pattern:r.from,params:l?l.params:{}},to:{url:a.to.url,pattern:r.to,params:c?c.params:{}}}})(i,e,t);await(function(r,a){const{direction:o}=a,l=r[o];return l?new Promise(c=>{const h=l(()=>c(),a);Vu(h)&&h.then(c)}):(console.warn(`Missing animation function for '${o}' phase`),Promise.resolve())})(i,s)}}}let Yr,Gs,Fd=typeof Symbol=="function"?Symbol():"_split",Lh,k1=()=>Lh||Ai.register(window.gsap),kd=typeof Intl<"u"&&"Segmenter"in Intl?new Intl.Segmenter:0,Ra=n=>typeof n=="string"?Ra(document.querySelectorAll(n)):"length"in n?Array.from(n).reduce((e,t)=>(typeof t=="string"?e.push(...Ra(t)):e.push(t),e),[]):[n],Bd=n=>Ra(n).filter(e=>e instanceof HTMLElement),Ih=[],nc=function(){},B1={add:n=>n()},z1=/\s+/g,zd=new RegExp("\\p{RI}\\p{RI}|\\p{Emoji}(\\p{EMod}|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?(\\u{200D}\\p{Emoji}(\\p{EMod}|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?)*|.","gu"),Wo={left:0,top:0,width:0,height:0},V1=(n,e)=>{for(;++e<n.length&&n[e]===Wo;);return n[e]||Wo},Vd=({element:n,html:e,ariaL:t,ariaH:i})=>{n.innerHTML=e,t?n.setAttribute("aria-label",t):n.removeAttribute("aria-label"),i?n.setAttribute("aria-hidden",i):n.removeAttribute("aria-hidden")},Hd=(n,e)=>{if(e){let t=new Set(n.join("").match(e)||Ih),i=n.length,s,r,a,o;if(t.size)for(;--i>-1;){r=n[i];for(a of t)if(a.startsWith(r)&&a.length>r.length){for(s=0,o=r;a.startsWith(o+=n[i+ ++s])&&o.length<a.length;);if(s&&o.length===a.length){n[i]=a,n.splice(i+1,s);break}}}}return n},$d=n=>window.getComputedStyle(n).display==="inline"&&(n.style.display="inline-block"),Ws=(n,e,t)=>e.insertBefore(typeof n=="string"?document.createTextNode(n):n,t),Dh=(n,e,t)=>{let i=e[n+"sClass"]||"",{tag:s="div",aria:r="auto",propIndex:a=!1}=e,o=n==="line"?"block":"inline-block",l=i.indexOf("++")>-1,c=h=>{let u=document.createElement(s),f=t.length+1;return i&&(u.className=i+(l?" "+i+f:"")),a&&u.style.setProperty("--"+n,f+""),r!=="none"&&u.setAttribute("aria-hidden","true"),s!=="span"&&(u.style.position="relative",u.style.display=o),u.textContent=h,t.push(u),u};return l&&(i=i.replace("++","")),c.collection=t,c},H1=(n,e,t,i)=>{let s=Dh("line",t,i),r=window.getComputedStyle(n).textAlign||"left";return(a,o)=>{let l=s("");for(l.style.textAlign=r,n.insertBefore(l,e[a]);a<o;a++)l.appendChild(e[a]);l.normalize()}},s_=(n,e,t,i,s,r,a,o,l,c)=>{var h;let u=Array.from(n.childNodes),f=0,{wordDelimiter:d,reduceWhiteSpace:_=!0,prepareText:m}=e,g=n.getBoundingClientRect(),p=g,x=!_&&window.getComputedStyle(n).whiteSpace.substring(0,3)==="pre",M=0,y=t.collection,w,E,P,L,v,b,N,k,F,Y,q,G,V,Q,he,ae,ue,we;for(typeof d=="object"?(P=d.delimiter||d,E=d.replaceWith||""):E=d===""?"":d||" ",w=E!==" ";f<u.length;f++)if(L=u[f],L.nodeType===3){for(he=L.textContent||"",_?he=he.replace(z1," "):x&&(he=he.replace(/\n/g,E+`
`)),m&&(he=m(he,n)),L.textContent=he,v=E||P?he.split(P||E):he.match(o)||Ih,ue=v[v.length-1],k=w?ue.slice(-1)===" ":!ue,ue||v.pop(),p=g,N=w?v[0].charAt(0)===" ":!v[0],N&&Ws(" ",n,L),v[0]||v.shift(),Hd(v,l),r&&c||(L.textContent=""),F=1;F<=v.length;F++)if(ae=v[F-1],!_&&x&&ae.charAt(0)===`
`&&((h=L.previousSibling)==null||h.remove(),Ws(document.createElement("br"),n,L),ae=ae.slice(1)),!_&&ae==="")Ws(E,n,L);else if(ae===" ")n.insertBefore(document.createTextNode(" "),L);else{if(w&&ae.charAt(0)===" "&&Ws(" ",n,L),M&&F===1&&!N&&y.indexOf(M.parentNode)>-1?(b=y[y.length-1],b.appendChild(document.createTextNode(i?"":ae))):(b=t(i?"":ae),Ws(b,n,L),M&&F===1&&!N&&b.insertBefore(M,b.firstChild)),i)for(q=kd?Hd([...kd.segment(ae)].map(Ee=>Ee.segment),l):ae.match(o)||Ih,we=0;we<q.length;we++)b.appendChild(q[we]===" "?document.createTextNode(" "):i(q[we]));if(r&&c){if(he=L.textContent=he.substring(ae.length+1,he.length),Y=b.getBoundingClientRect(),Y.top>p.top&&Y.left<=p.left){for(G=n.cloneNode(),V=n.childNodes[0];V&&V!==b;)Q=V,V=V.nextSibling,G.appendChild(Q);n.parentNode.insertBefore(G,n),s&&$d(G)}p=Y}(F<v.length||k)&&Ws(F>=v.length?" ":w&&ae.slice(-1)===" "?" "+E:E,n,L)}n.removeChild(L),M=0}else L.nodeType===1&&(a&&a.indexOf(L)>-1?(y.indexOf(L.previousSibling)>-1&&y[y.length-1].appendChild(L),M=L):(s_(L,e,t,i,s,r,a,o,l,!0),M=0),s&&$d(L))};const r_=class a_{constructor(e,t){this.isSplit=!1,k1(),this.elements=Bd(e),this.chars=[],this.words=[],this.lines=[],this.masks=[],this.vars=t,this.elements.forEach(a=>{var o;t.overwrite!==!1&&((o=a[Fd])==null||o._data.orig.filter(({element:l})=>l===a).forEach(Vd)),a[Fd]=this}),this._split=()=>this.isSplit&&this.split(this.vars);let i=[],s,r=()=>{let a=i.length,o;for(;a--;){o=i[a];let l=o.element.offsetWidth;if(l!==o.width){o.width=l,this._split();return}}};this._data={orig:i,obs:typeof ResizeObserver<"u"&&new ResizeObserver(()=>{clearTimeout(s),s=setTimeout(r,200)})},nc(this),this.split(t)}split(e){return(this._ctx||B1).add(()=>{this.isSplit&&this.revert(),this.vars=e=e||this.vars||{};let{type:t="chars,words,lines",aria:i="auto",deepSlice:s=!0,smartWrap:r,onSplit:a,autoSplit:o=!1,specialChars:l,mask:c}=this.vars,h=t.indexOf("lines")>-1,u=t.indexOf("chars")>-1,f=t.indexOf("words")>-1,d=u&&!f&&!h,_=l&&("push"in l?new RegExp("(?:"+l.join("|")+")","gu"):l),m=_?new RegExp(_.source+"|"+zd.source,"gu"):zd,g=!!e.ignore&&Bd(e.ignore),{orig:p,animTime:x,obs:M}=this._data,y;(u||f||h)&&(this.elements.forEach((w,E)=>{p[E]={element:w,html:w.innerHTML,ariaL:w.getAttribute("aria-label"),ariaH:w.getAttribute("aria-hidden")},i==="auto"?w.setAttribute("aria-label",(w.textContent||"").trim()):i==="hidden"&&w.setAttribute("aria-hidden","true");let P=[],L=[],v=[],b=u?Dh("char",e,P):null,N=Dh("word",e,L),k,F,Y,q;if(s_(w,e,N,b,d,s&&(h||d),g,m,_,!1),h){let G=Ra(w.childNodes),V=H1(w,G,e,v),Q,he=[],ae=0,ue=G.map(Ne=>Ne.nodeType===1?Ne.getBoundingClientRect():Wo),we=Wo,Ee;for(k=0;k<G.length;k++)Q=G[k],Q.nodeType===1&&(Q.nodeName==="BR"?((!k||G[k-1].nodeName!=="BR")&&(he.push(Q),V(ae,k+1)),ae=k+1,we=V1(ue,k)):(Ee=ue[k],k&&Ee.top>we.top&&Ee.left<we.left+we.width-1&&(V(ae,k),ae=k),we=Ee));ae<k&&V(ae,k),he.forEach(Ne=>{var Fe;return(Fe=Ne.parentNode)==null?void 0:Fe.removeChild(Ne)})}if(!f){for(k=0;k<L.length;k++)if(F=L[k],u||!F.nextSibling||F.nextSibling.nodeType!==3)if(r&&!h){for(Y=document.createElement("span"),Y.style.whiteSpace="nowrap";F.firstChild;)Y.appendChild(F.firstChild);F.replaceWith(Y)}else F.replaceWith(...F.childNodes);else q=F.nextSibling,q&&q.nodeType===3&&(q.textContent=(F.textContent||"")+(q.textContent||""),F.remove());L.length=0,w.normalize()}this.lines.push(...v),this.words.push(...L),this.chars.push(...P)}),c&&this[c]&&this.masks.push(...this[c].map(w=>{let E=w.cloneNode();return w.replaceWith(E),E.appendChild(w),w.className&&(E.className=w.className.trim()+"-mask"),E.style.overflow="clip",E}))),this.isSplit=!0,Gs&&h&&(o?Gs.addEventListener("loadingdone",this._split):Gs.status==="loading"&&console.warn("SplitText called before fonts loaded")),(y=a&&a(this))&&y.totalTime&&(this._data.anim=x?y.totalTime(x):y),h&&o&&this.elements.forEach((w,E)=>{p[E].width=w.offsetWidth,M&&M.observe(w)})}),this}kill(){let{obs:e}=this._data;e&&e.disconnect(),Gs?.removeEventListener("loadingdone",this._split)}revert(){var e,t;if(this.isSplit){let{orig:i,anim:s}=this._data;this.kill(),i.forEach(Vd),this.chars.length=this.words.length=this.lines.length=i.length=this.masks.length=0,this.isSplit=!1,s&&(this._data.animTime=s.totalTime(),s.revert()),(t=(e=this.vars).onRevert)==null||t.call(e,this)}return this}static create(e,t){return new a_(e,t)}static register(e){Yr=Yr||e||window.gsap,Yr&&(Ra=Yr.utils.toArray,nc=Yr.core.context||nc),!Lh&&window.innerWidth>0&&(Gs=document.fonts,Lh=!0)}};r_.version="3.14.2";let Ai=r_;function $1(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}var sc={exports:{}},Gd;function G1(){return Gd||(Gd=1,(function(n){(function(){function e(A,C,B){return A.call.apply(A.bind,arguments)}function t(A,C,B){if(!A)throw Error();if(2<arguments.length){var H=Array.prototype.slice.call(arguments,2);return function(){var Z=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(Z,H),A.apply(C,Z)}}return function(){return A.apply(C,arguments)}}function i(A,C,B){return i=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?e:t,i.apply(null,arguments)}var s=Date.now||function(){return+new Date};function r(A,C){this.a=A,this.o=C||A,this.c=this.o.document}var a=!!window.FontFace;function o(A,C,B,H){if(C=A.c.createElement(C),B)for(var Z in B)B.hasOwnProperty(Z)&&(Z=="style"?C.style.cssText=B[Z]:C.setAttribute(Z,B[Z]));return H&&C.appendChild(A.c.createTextNode(H)),C}function l(A,C,B){A=A.c.getElementsByTagName(C)[0],A||(A=document.documentElement),A.insertBefore(B,A.lastChild)}function c(A){A.parentNode&&A.parentNode.removeChild(A)}function h(A,C,B){C=C||[],B=B||[];for(var H=A.className.split(/\s+/),Z=0;Z<C.length;Z+=1){for(var J=!1,de=0;de<H.length;de+=1)if(C[Z]===H[de]){J=!0;break}J||H.push(C[Z])}for(C=[],Z=0;Z<H.length;Z+=1){for(J=!1,de=0;de<B.length;de+=1)if(H[Z]===B[de]){J=!0;break}J||C.push(H[Z])}A.className=C.join(" ").replace(/\s+/g," ").replace(/^\s+|\s+$/,"")}function u(A,C){for(var B=A.className.split(/\s+/),H=0,Z=B.length;H<Z;H++)if(B[H]==C)return!0;return!1}function f(A){return A.o.location.hostname||A.a.location.hostname}function d(A,C,B){function H(){O&&Z&&J&&(O(de),O=null)}C=o(A,"link",{rel:"stylesheet",href:C,media:"all"});var Z=!1,J=!0,de=null,O=B||null;a?(C.onload=function(){Z=!0,H()},C.onerror=function(){Z=!0,de=Error("Stylesheet failed to load"),H()}):setTimeout(function(){Z=!0,H()},0),l(A,"head",C)}function _(A,C,B,H){var Z=A.c.getElementsByTagName("head")[0];if(Z){var J=o(A,"script",{src:C}),de=!1;return J.onload=J.onreadystatechange=function(){de||this.readyState&&this.readyState!="loaded"&&this.readyState!="complete"||(de=!0,B&&B(null),J.onload=J.onreadystatechange=null,J.parentNode.tagName=="HEAD"&&Z.removeChild(J))},Z.appendChild(J),setTimeout(function(){de||(de=!0,B&&B(Error("Script load timeout")))},H||5e3),J}return null}function m(){this.a=0,this.c=null}function g(A){return A.a++,function(){A.a--,x(A)}}function p(A,C){A.c=C,x(A)}function x(A){A.a==0&&A.c&&(A.c(),A.c=null)}function M(A){this.a=A||"-"}M.prototype.c=function(A){for(var C=[],B=0;B<arguments.length;B++)C.push(arguments[B].replace(/[\W_]+/g,"").toLowerCase());return C.join(this.a)};function y(A,C){this.c=A,this.f=4,this.a="n";var B=(C||"n4").match(/^([nio])([1-9])$/i);B&&(this.a=B[1],this.f=parseInt(B[2],10))}function w(A){return L(A)+" "+(A.f+"00")+" 300px "+E(A.c)}function E(A){var C=[];A=A.split(/,\s*/);for(var B=0;B<A.length;B++){var H=A[B].replace(/['"]/g,"");H.indexOf(" ")!=-1||/^\d/.test(H)?C.push("'"+H+"'"):C.push(H)}return C.join(",")}function P(A){return A.a+A.f}function L(A){var C="normal";return A.a==="o"?C="oblique":A.a==="i"&&(C="italic"),C}function v(A){var C=4,B="n",H=null;return A&&((H=A.match(/(normal|oblique|italic)/i))&&H[1]&&(B=H[1].substr(0,1).toLowerCase()),(H=A.match(/([1-9]00|normal|bold)/i))&&H[1]&&(/bold/i.test(H[1])?C=7:/[1-9]00/.test(H[1])&&(C=parseInt(H[1].substr(0,1),10)))),B+C}function b(A,C){this.c=A,this.f=A.o.document.documentElement,this.h=C,this.a=new M("-"),this.j=C.events!==!1,this.g=C.classes!==!1}function N(A){A.g&&h(A.f,[A.a.c("wf","loading")]),F(A,"loading")}function k(A){if(A.g){var C=u(A.f,A.a.c("wf","active")),B=[],H=[A.a.c("wf","loading")];C||B.push(A.a.c("wf","inactive")),h(A.f,B,H)}F(A,"inactive")}function F(A,C,B){A.j&&A.h[C]&&(B?A.h[C](B.c,P(B)):A.h[C]())}function Y(){this.c={}}function q(A,C,B){var H=[],Z;for(Z in C)if(C.hasOwnProperty(Z)){var J=A.c[Z];J&&H.push(J(C[Z],B))}return H}function G(A,C){this.c=A,this.f=C,this.a=o(this.c,"span",{"aria-hidden":"true"},this.f)}function V(A){l(A.c,"body",A.a)}function Q(A){return"display:block;position:absolute;top:-9999px;left:-9999px;font-size:300px;width:auto;height:auto;line-height:normal;margin:0;padding:0;font-variant:normal;white-space:nowrap;font-family:"+E(A.c)+";"+("font-style:"+L(A)+";font-weight:"+(A.f+"00")+";")}function he(A,C,B,H,Z,J){this.g=A,this.j=C,this.a=H,this.c=B,this.f=Z||3e3,this.h=J||void 0}he.prototype.start=function(){var A=this.c.o.document,C=this,B=s(),H=new Promise(function(de,O){function ce(){s()-B>=C.f?O():A.fonts.load(w(C.a),C.h).then(function(se){1<=se.length?de():setTimeout(ce,25)},function(){O()})}ce()}),Z=null,J=new Promise(function(de,O){Z=setTimeout(O,C.f)});Promise.race([J,H]).then(function(){Z&&(clearTimeout(Z),Z=null),C.g(C.a)},function(){C.j(C.a)})};function ae(A,C,B,H,Z,J,de){this.v=A,this.B=C,this.c=B,this.a=H,this.s=de||"BESbswy",this.f={},this.w=Z||3e3,this.u=J||null,this.m=this.j=this.h=this.g=null,this.g=new G(this.c,this.s),this.h=new G(this.c,this.s),this.j=new G(this.c,this.s),this.m=new G(this.c,this.s),A=new y(this.a.c+",serif",P(this.a)),A=Q(A),this.g.a.style.cssText=A,A=new y(this.a.c+",sans-serif",P(this.a)),A=Q(A),this.h.a.style.cssText=A,A=new y("serif",P(this.a)),A=Q(A),this.j.a.style.cssText=A,A=new y("sans-serif",P(this.a)),A=Q(A),this.m.a.style.cssText=A,V(this.g),V(this.h),V(this.j),V(this.m)}var ue={D:"serif",C:"sans-serif"},we=null;function Ee(){if(we===null){var A=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent);we=!!A&&(536>parseInt(A[1],10)||parseInt(A[1],10)===536&&11>=parseInt(A[2],10))}return we}ae.prototype.start=function(){this.f.serif=this.j.a.offsetWidth,this.f["sans-serif"]=this.m.a.offsetWidth,this.A=s(),Fe(this)};function Ne(A,C,B){for(var H in ue)if(ue.hasOwnProperty(H)&&C===A.f[ue[H]]&&B===A.f[ue[H]])return!0;return!1}function Fe(A){var C=A.g.a.offsetWidth,B=A.h.a.offsetWidth,H;(H=C===A.f.serif&&B===A.f["sans-serif"])||(H=Ee()&&Ne(A,C,B)),H?s()-A.A>=A.w?Ee()&&Ne(A,C,B)&&(A.u===null||A.u.hasOwnProperty(A.a.c))?le(A,A.v):le(A,A.B):ne(A):le(A,A.v)}function ne(A){setTimeout(i(function(){Fe(this)},A),50)}function le(A,C){setTimeout(i(function(){c(this.g.a),c(this.h.a),c(this.j.a),c(this.m.a),C(this.a)},A),0)}function Se(A,C,B){this.c=A,this.a=C,this.f=0,this.m=this.j=!1,this.s=B}var Ie=null;Se.prototype.g=function(A){var C=this.a;C.g&&h(C.f,[C.a.c("wf",A.c,P(A).toString(),"active")],[C.a.c("wf",A.c,P(A).toString(),"loading"),C.a.c("wf",A.c,P(A).toString(),"inactive")]),F(C,"fontactive",A),this.m=!0,ge(this)},Se.prototype.h=function(A){var C=this.a;if(C.g){var B=u(C.f,C.a.c("wf",A.c,P(A).toString(),"active")),H=[],Z=[C.a.c("wf",A.c,P(A).toString(),"loading")];B||H.push(C.a.c("wf",A.c,P(A).toString(),"inactive")),h(C.f,H,Z)}F(C,"fontinactive",A),ge(this)};function ge(A){--A.f==0&&A.j&&(A.m?(A=A.a,A.g&&h(A.f,[A.a.c("wf","active")],[A.a.c("wf","loading"),A.a.c("wf","inactive")]),F(A,"active")):k(A.a))}function $e(A){this.j=A,this.a=new Y,this.h=0,this.f=this.g=!0}$e.prototype.load=function(A){this.c=new r(this.j,A.context||this.j),this.g=A.events!==!1,this.f=A.classes!==!1,Ge(this,new b(this.c,A),A)};function Mt(A,C,B,H,Z){var J=--A.h==0;(A.f||A.g)&&setTimeout(function(){var de=Z||null,O=H||null||{};if(B.length===0&&J)k(C.a);else{C.f+=B.length,J&&(C.j=J);var ce,se=[];for(ce=0;ce<B.length;ce++){var fe=B[ce],re=O[fe.c],ie=C.a,me=fe;if(ie.g&&h(ie.f,[ie.a.c("wf",me.c,P(me).toString(),"loading")]),F(ie,"fontloading",me),ie=null,Ie===null)if(window.FontFace){var me=/Gecko.*Firefox\/(\d+)/.exec(window.navigator.userAgent),Oe=/OS X.*Version\/10\..*Safari/.exec(window.navigator.userAgent)&&/Apple/.exec(window.navigator.vendor);Ie=me?42<parseInt(me[1],10):!Oe}else Ie=!1;Ie?ie=new he(i(C.g,C),i(C.h,C),C.c,fe,C.s,re):ie=new ae(i(C.g,C),i(C.h,C),C.c,fe,C.s,de,re),se.push(ie)}for(ce=0;ce<se.length;ce++)se[ce].start()}},0)}function Ge(A,C,B){var Z=[],H=B.timeout;N(C);var Z=q(A.a,B,A.c),J=new Se(A.c,C,H);for(A.h=Z.length,C=0,B=Z.length;C<B;C++)Z[C].load(function(de,O,ce){Mt(A,J,de,O,ce)})}function Xe(A,C){this.c=A,this.a=C}Xe.prototype.load=function(A){function C(){if(J["__mti_fntLst"+H]){var de=J["__mti_fntLst"+H](),O=[],ce;if(de)for(var se=0;se<de.length;se++){var fe=de[se].fontfamily;de[se].fontStyle!=null&&de[se].fontWeight!=null?(ce=de[se].fontStyle+de[se].fontWeight,O.push(new y(fe,ce))):O.push(new y(fe))}A(O)}else setTimeout(function(){C()},50)}var B=this,H=B.a.projectId,Z=B.a.version;if(H){var J=B.c.o;_(this.c,(B.a.api||"https://fast.fonts.net/jsapi")+"/"+H+".js"+(Z?"?v="+Z:""),function(de){de?A([]):(J["__MonotypeConfiguration__"+H]=function(){return B.a},C())}).id="__MonotypeAPIScript__"+H}else A([])};function Je(A,C){this.c=A,this.a=C}Je.prototype.load=function(A){var C,B,H=this.a.urls||[],Z=this.a.families||[],J=this.a.testStrings||{},de=new m;for(C=0,B=H.length;C<B;C++)d(this.c,H[C],g(de));var O=[];for(C=0,B=Z.length;C<B;C++)if(H=Z[C].split(":"),H[1])for(var ce=H[1].split(","),se=0;se<ce.length;se+=1)O.push(new y(H[0],ce[se]));else O.push(new y(H[0]));p(de,function(){A(O,J)})};function ke(A,C){A?this.c=A:this.c=pt,this.a=[],this.f=[],this.g=C||""}var pt="https://fonts.googleapis.com/css";function U(A,C){for(var B=C.length,H=0;H<B;H++){var Z=C[H].split(":");Z.length==3&&A.f.push(Z.pop());var J="";Z.length==2&&Z[1]!=""&&(J=":"),A.a.push(Z.join(J))}}function mt(A){if(A.a.length==0)throw Error("No fonts to load!");if(A.c.indexOf("kit=")!=-1)return A.c;for(var C=A.a.length,B=[],H=0;H<C;H++)B.push(A.a[H].replace(/ /g,"+"));return C=A.c+"?family="+B.join("%7C"),0<A.f.length&&(C+="&subset="+A.f.join(",")),0<A.g.length&&(C+="&text="+encodeURIComponent(A.g)),C}function je(A){this.f=A,this.a=[],this.c={}}var Qe={latin:"BESbswy","latin-ext":"çöüğş",cyrillic:"йяЖ",greek:"αβΣ",khmer:"កខគ",Hanuman:"កខគ"},Te={thin:"1",extralight:"2","extra-light":"2",ultralight:"2","ultra-light":"2",light:"3",regular:"4",book:"4",medium:"5","semi-bold":"6",semibold:"6","demi-bold":"6",demibold:"6",bold:"7","extra-bold":"8",extrabold:"8","ultra-bold":"8",ultrabold:"8",black:"9",heavy:"9",l:"3",r:"4",b:"7"},R={i:"i",italic:"i",n:"n",normal:"n"},S=/^(thin|(?:(?:extra|ultra)-?)?light|regular|book|medium|(?:(?:semi|demi|extra|ultra)-?)?bold|black|heavy|l|r|b|[1-9]00)?(n|i|normal|italic)?$/;function z(A){for(var C=A.f.length,B=0;B<C;B++){var H=A.f[B].split(":"),Z=H[0].replace(/\+/g," "),J=["n4"];if(2<=H.length){var de,O=H[1];if(de=[],O)for(var O=O.split(","),ce=O.length,se=0;se<ce;se++){var fe;if(fe=O[se],fe.match(/^[\w-]+$/)){var re=S.exec(fe.toLowerCase());if(re==null)fe="";else{if(fe=re[2],fe=fe==null||fe==""?"n":R[fe],re=re[1],re==null||re=="")re="4";else var ie=Te[re],re=ie||(isNaN(re)?"4":re.substr(0,1));fe=[fe,re].join("")}}else fe="";fe&&de.push(fe)}0<de.length&&(J=de),H.length==3&&(H=H[2],de=[],H=H?H.split(","):de,0<H.length&&(H=Qe[H[0]])&&(A.c[Z]=H))}for(A.c[Z]||(H=Qe[Z])&&(A.c[Z]=H),H=0;H<J.length;H+=1)A.a.push(new y(Z,J[H]))}}function te(A,C){this.c=A,this.a=C}var oe={Arimo:!0,Cousine:!0,Tinos:!0};te.prototype.load=function(A){var C=new m,B=this.c,H=new ke(this.a.api,this.a.text),Z=this.a.families;U(H,Z);var J=new je(Z);z(J),d(B,mt(H),g(C)),p(C,function(){A(J.a,J.c,oe)})};function ee(A,C){this.c=A,this.a=C}ee.prototype.load=function(A){var C=this.a.id,B=this.c.o;C?_(this.c,(this.a.api||"https://use.typekit.net")+"/"+C+".js",function(H){if(H)A([]);else if(B.Typekit&&B.Typekit.config&&B.Typekit.config.fn){H=B.Typekit.config.fn;for(var Z=[],J=0;J<H.length;J+=2)for(var de=H[J],O=H[J+1],ce=0;ce<O.length;ce++)Z.push(new y(de,O[ce]));try{B.Typekit.load({events:!1,classes:!1,async:!0})}catch{}A(Z)}},2e3):A([])};function Ae(A,C){this.c=A,this.f=C,this.a=[]}Ae.prototype.load=function(A){var C=this.f.id,B=this.c.o,H=this;C?(B.__webfontfontdeckmodule__||(B.__webfontfontdeckmodule__={}),B.__webfontfontdeckmodule__[C]=function(Z,J){for(var de=0,O=J.fonts.length;de<O;++de){var ce=J.fonts[de];H.a.push(new y(ce.name,v("font-weight:"+ce.weight+";font-style:"+ce.style)))}A(H.a)},_(this.c,(this.f.api||"https://f.fontdeck.com/s/css/js/")+f(this.c)+"/"+C+".js",function(Z){Z&&A([])})):A([])};var pe=new $e(window);pe.a.c.custom=function(A,C){return new Je(C,A)},pe.a.c.fontdeck=function(A,C){return new Ae(C,A)},pe.a.c.monotype=function(A,C){return new Xe(C,A)},pe.a.c.typekit=function(A,C){return new ee(C,A)},pe.a.c.google=function(A,C){return new te(C,A)};var Me={load:i(pe.load,pe)};n.exports?n.exports=Me:(window.WebFont=Me,window.WebFontConfig&&pe.load(window.WebFontConfig))})()})(sc)),sc.exports}var W1=G1();const q1=$1(W1);D.registerPlugin(Ai);class Oi{selectorNames;tweenParams;$targets;infoList;root;constructor(e={}){this.selectorNames={target:'[data-button-animation="target"]',firstLine:'[data-button-animation="first-line"]',lastLine:'[data-button-animation="last-line"]',text:'[data-button-animation="text"]'},this.tweenParams={line:{duration:.7,delay:{firstLine:.35,lastLine:.45},ease:"quart.out"},chars:{duration:.7,delay:.45,stagger:.01,ease:"none"}},this.$targets=[],this.infoList=[],this.root=document,Object.assign(this,e)}init(){this.setSelector(),this.setInfoList(),this.setObserver()}destroy(){this.clearObserver(),this.infoList.forEach(e=>{this.killTweens(e),e.split.revert()})}setSelector(){this.$targets=Array.from(this.root.querySelectorAll(this.selectorNames.target))}setInfoList(){this.$targets.forEach((e,t)=>{const i=e.querySelector(this.selectorNames.firstLine),s=e.querySelector(this.selectorNames.lastLine),r=e.querySelector(this.selectorNames.text);if(!i||!s||!r)return;const a={$target:e,$firstLine:i,$lastLine:s,$text:r,split:this.setSplit(r),buttonAnimationDelay:e.dataset.buttonAnimationDelay?parseFloat(e.dataset.buttonAnimationDelay):0};this.infoList[t]=a,this.setStyle(a)})}setSplit(e){return Ai.create(e,{aria:"hidden",autoSplit:!0,charsClass:"char",tag:"span",type:"chars",reduceWhiteSpace:!1})}setStyle(e){D.set(e.$target,{pointerEvents:"none"}),D.set(e.$firstLine,{clipPath:"inset(0% 100% 0% 0%)"}),D.set(e.$lastLine,{clipPath:"inset(0% 100% 0% 0%)"}),D.set(e.split.chars,{opacity:0})}setObserver(){this.infoList.forEach(e=>{I.intersectionObserverManager.add(e.$target,()=>{this.inViewAnimation(e)})})}clearObserver(){this.infoList.forEach(e=>{I.intersectionObserverManager.remove(e.$target)})}getLastLineClipPath(e){if(!I.detection.touchDevice)return"inset(0% 100% 0% 0%)";const t=!!e.$target.closest("[data-footer]");return e.$target.closest('[data-voice-carousel="target"]')?I.detection.pcLayout?`inset(0% calc(100% - ${$s(280,1600)}vw) 0% 0%)`:`inset(0% calc(100% - ${$s(160,402)}vw) 0% 0%)`:t?I.detection.pcLayout?`inset(0% calc(100% - ${$s(360,1600)}vw) 0% 0%)`:`inset(0% calc(100% - ${$s(40,402)}vw) 0% 0%)`:I.detection.pcLayout?`inset(0% calc(100% - ${$s(80,1600)}vw) 0% 0%)`:`inset(0% calc(100% - ${$s(80,402)}vw) 0% 0%)`}inViewAnimation(e){I.intersectionObserverManager.remove(e.$target),window.requestAnimationFrame(()=>{this.killTweens(e),D.to(e.$firstLine,{clipPath:"inset(0% 0% 0% 0%)",duration:this.tweenParams.line.duration,delay:e.buttonAnimationDelay,ease:this.tweenParams.line.ease}),D.to(e.$firstLine,{clipPath:"inset(0% 0% 0% 100%)",duration:this.tweenParams.line.duration,delay:this.tweenParams.line.delay.firstLine+e.buttonAnimationDelay,ease:this.tweenParams.line.ease}),D.to(e.$lastLine,{clipPath:I.detection.touchDevice?this.getLastLineClipPath(e):"inset(0% 0% 0% 0%)",duration:this.tweenParams.line.duration,delay:this.tweenParams.line.delay.lastLine+e.buttonAnimationDelay,ease:this.tweenParams.line.ease,onComplete:()=>{D.set(e.$target,{clearProps:"pointerEvents"})}}),D.to(e.split.chars,{opacity:1,duration:1.2,delay:this.tweenParams.chars.delay+e.buttonAnimationDelay,stagger:this.tweenParams.chars.stagger,ease:this.tweenParams.chars.ease,force3D:!0})})}killTweens(e){D.killTweensOf(e.$firstLine),D.killTweensOf(e.$lastLine),D.killTweensOf(e.split.chars)}}D.registerPlugin(Ai);class Vn{selectorNames;tweenParams;$targets;infoList;root;constructor(e={}){this.selectorNames={target:'[data-text-animation="target"]',text:'[data-text-animation="text"]'},this.tweenParams={lines:{duration:1.4,stagger:.07,ease:{none:"none",expoOut:"expo.out"}}},this.$targets=[],this.infoList=[],this.root=document,Object.assign(this,e)}init(){this.setSelector(),this.setInfoList(),this.setObserver()}destroy(){this.clearObserver(),this.infoList.forEach(e=>{D.killTweensOf(e.split.lines),e.split.revert()})}setSelector(){this.$targets=Array.from(this.root.querySelectorAll(this.selectorNames.target))}setInfoList(){this.$targets.forEach((e,t)=>{const i=Array.from(e.querySelectorAll(this.selectorNames.text));if(!i.length)return;const s={$target:e,$texts:i,split:this.setSplit(i),textAnimationDelay:e.dataset.textAnimationDelay?parseFloat(e.dataset.textAnimationDelay):0};this.infoList[t]=s})}setSplit(e){return Ai.create(e,{autoSplit:!0,linesClass:"line",tag:"span",type:"lines",reduceWhiteSpace:!1,onSplit:t=>D.set(t.lines,{y:"100%",opacity:0,force3D:!0})})}setObserver(){this.infoList.forEach(e=>{I.intersectionObserverManager.add(e.$target,()=>{this.inViewAnimation(e)})})}clearObserver(){this.infoList.forEach(e=>{I.intersectionObserverManager.remove(e.$target)})}inViewAnimation(e){I.intersectionObserverManager.remove(e.$target),window.requestAnimationFrame(()=>{this.killTweens(e),D.to(e.split.lines,{opacity:1,duration:this.tweenParams.lines.duration,delay:e.textAnimationDelay,stagger:this.tweenParams.lines.stagger,ease:this.tweenParams.lines.ease.none}),D.to(e.split.lines,{y:"0%",duration:this.tweenParams.lines.duration,delay:e.textAnimationDelay,stagger:this.tweenParams.lines.stagger,ease:this.tweenParams.lines.ease.expoOut,force3D:!0,onComplete:()=>{e.split.revert()}})})}killTweens(e){D.killTweensOf(e.split.lines)}}class Hu{selectorNames;classNames;$targets;infoList;constructor(){this.selectorNames={target:'[data-clouds-animation="target"]',item:'[data-clouds-animation="item"]'},this.classNames={inView:"-inView"},this.$targets=[],this.infoList=[]}init(){this.setSelector(),this.setInfoList(),this.setObserver()}destroy(){this.clearObserver()}setSelector(){this.$targets=Array.from(document.querySelectorAll(this.selectorNames.target))}setInfoList(){this.$targets.forEach((e,t)=>{const i={$target:e};this.infoList[t]=i})}setObserver(){this.infoList.forEach(e=>{I.intersectionObserverManager.add(e.$target,this.inView.bind(this,e),this.outView.bind(this,e))})}clearObserver(){this.infoList.forEach(e=>{I.intersectionObserverManager.remove(e.$target)})}inView(e){e.$target.querySelectorAll(this.selectorNames.item).forEach(i=>{i.classList.add(this.classNames.inView)})}outView(e){e.$target.querySelectorAll(this.selectorNames.item).forEach(i=>{i.classList.remove(this.classNames.inView)})}}class o_{selectorNames;$targets;infoList;scroll;constructor(){this.selectorNames={target:'[data-clouds-scroll-animation="target"]'},this.$targets=[],this.infoList=[],this.scroll=0}init(){this.setSelector(),this.setInfoList(),this.setObserver()}destroy(){this.infoList.forEach(e=>{this.caf(e)}),this.clearObserver()}setSelector(){this.$targets=Array.from(document.querySelectorAll(this.selectorNames.target))}setInfoList(){this.$targets.forEach((e,t)=>{const i=e.dataset.ratio?Number(e.dataset.ratio):0,s=e.dataset.direction||"up",r={$target:e,contentHeight:0,start:0,end:0,range:0,ratio:i,direction:s,progress:0,requestId:0};this.infoList[t]=r,this.setScrollValue(r)})}setScrollValue(e){window.requestAnimationFrame(()=>{e.contentHeight=e.$target.getBoundingClientRect().height,e.start=Bu(e.$target)-window.innerHeight,e.end=e.start+e.contentHeight+window.innerHeight,e.range=e.end-e.start,e.ratio=Number(e.$target.dataset.ratio)})}setObserver(){this.infoList.forEach(e=>{I.intersectionObserverManager.add(e.$target,()=>{this.raf(e)},()=>{this.caf(e)})})}clearObserver(){this.infoList.forEach(e=>{I.intersectionObserverManager.remove(e.$target)})}raf(e){this.onRaf(e),e.requestId=window.requestAnimationFrame(()=>this.raf(e))}caf(e){cancelAnimationFrame(e.requestId)}onScroll=()=>{I.smoothScroll.lenis&&(this.scroll=I.smoothScroll.lenis.animatedScroll)};onResize=()=>{this.infoList.forEach(e=>{this.setScrollValue(e)})};onRaf(e){this.onScroll(),this.updateProgress(e)}updateProgress(e){this.scroll<=e.start?e.progress=0:e.end<=this.scroll?e.progress=1:e.progress=ru((this.scroll-e.start)/e.range,0,1),this.updateAnimation(e)}updateAnimation(e){e.$target&&(e.$target.style.transform=`translate3d(0, ${e.direction==="up"?"-":""}${e.progress*e.contentHeight*e.ratio}px, 0)`)}}class X1{selectorNames;tweenParams;$target;isTargetInView;requestId;constructor(){this.selectorNames={target:'[data-title-scroll-animation="target"]'},this.tweenParams={duration:.5,ease:" cubic.out"},this.$target=null,this.isTargetInView=!1,this.requestId=0}init(){this.setSelector(),this.raf()}destroy(){this.caf()}setSelector(){this.$target=document.querySelector(this.selectorNames.target)}raf=()=>{this.onRaf(),this.requestId=window.requestAnimationFrame(this.raf)};caf(){cancelAnimationFrame(this.requestId)}onRaf(){this.toggleTarget()}toggleTarget(){I.smoothScroll.lenis&&I.smoothScroll.lenis.animatedScroll>I.resize.size.window.y*.05?this.isTargetInView||this.outViewTarget():this.isTargetInView&&this.inViewTarget()}inViewTarget(){this.isTargetInView=!1,D.to(this.$target,{autoAlpha:1,duration:this.tweenParams.duration,ease:this.tweenParams.ease})}outViewTarget(){this.isTargetInView=!0,D.to(this.$target,{autoAlpha:0,duration:this.tweenParams.duration,ease:this.tweenParams.ease})}}class l_{selectorNames;$target;$sections;$section;targetHeight;contentHeight;start;end;range;requestId;scroll;progress;constructor(){this.selectorNames={target:'[data-section-sticky="target"]',sections:'[data-section-sticky="sections"]',section:'[data-section-sticky="section"]'},this.$section=[],this.$target=null,this.$sections=null,this.targetHeight=0,this.contentHeight=0,this.start=0,this.end=0,this.range=0,this.requestId=0,this.scroll=0,this.progress=0}init(){this.setSelector(),this.setStickyValue(),this.setObserver()}destroy(){this.caf(),this.clearObserver()}setSelector(){this.$target=document.querySelector(this.selectorNames.target),this.$target&&(this.$sections=this.$target.querySelector(this.selectorNames.sections),this.$sections&&(this.$section=Array.from(this.$sections.querySelectorAll(this.selectorNames.section))))}setStickyValue(){window.requestAnimationFrame(()=>{const e=this.$section[0].getBoundingClientRect().height;!this.$sections||!this.$target||(this.targetHeight=this.$sections.getBoundingClientRect().height,this.$target.style.height=`${this.targetHeight-e*.5}px`,this.contentHeight=this.$target.getBoundingClientRect().height,this.start=Bu(this.$target),this.end=this.start+this.contentHeight-window.innerHeight,this.range=this.end-this.start,this.setSectionTopValue())})}setSectionTopValue(){const e=this.$section.length,t=this.$section[0].getBoundingClientRect().height,i=t*.5;for(let s=0;s<e;s++){if(s===0){this.$section[s].style.top="0px";continue}if(s===e-1){this.$section[s].style.top="";continue}const r=t*s,a=i*r/(this.range+i);this.$section[s].style.top=`${a}px`}}setObserver(){this.$target&&I.intersectionObserverManager.add(this.$target,()=>{this.raf()},()=>{this.caf()})}clearObserver(){this.$target&&I.intersectionObserverManager.remove(this.$target)}raf=()=>{this.onRaf(),this.requestId=window.requestAnimationFrame(this.raf)};caf(){cancelAnimationFrame(this.requestId)}onScroll=()=>{I.smoothScroll.lenis&&(this.scroll=I.smoothScroll.lenis.animatedScroll)};onResize=()=>{this.setStickyValue()};onRaf(){this.onScroll(),this.updateProgress()}updateProgress(){this.scroll<=this.start?this.progress=0:this.end<=this.scroll?this.progress=1:this.progress=ru((this.scroll-this.start)/this.range,0,1),this.updateAnimation(this.progress)}updateAnimation(e){if(!this.$sections)return;const t=e*(this.$section[0].getBoundingClientRect().height*.5);this.$sections.style.transform=`translate3d(0px, -${t}px, 0px)`}}class j1{textInViewAnimation;buttonInViewAnimation;cloudsLoopAnimation;cloudScrollAnimation;titleScrollAnimation;sectionStickyAnimation;constructor(){this.buttonInViewAnimation=null,this.textInViewAnimation=new Vn,this.cloudsLoopAnimation=new Hu,this.cloudScrollAnimation=new o_,this.titleScrollAnimation=new X1,I.detection.pcLayout&&!I.detection.touchDevice&&(this.sectionStickyAnimation=new l_)}beforeEnter(){}enter(){this.buttonInViewAnimation=new Oi({root:document.querySelector(I.pageNames.home)}),this.textInViewAnimation.init(),this.buttonInViewAnimation.init(),this.cloudsLoopAnimation.init(),this.cloudScrollAnimation.init(),this.titleScrollAnimation.init(),this.sectionStickyAnimation&&this.sectionStickyAnimation.init(),this.addEventListeners()}afterEnter(){}beforeLeave(){}leave(){this.removeEventListeners(),this.textInViewAnimation.destroy(),this.cloudsLoopAnimation.destroy(),this.cloudScrollAnimation.destroy(),this.titleScrollAnimation.destroy(),this.sectionStickyAnimation&&this.sectionStickyAnimation.destroy()}afterLeave(){}addEventListeners(){window.addEventListener("resize",this.onResize)}removeEventListeners(){window.removeEventListener("resize",this.onResize)}onResize=()=>{this.sectionStickyAnimation&&this.sectionStickyAnimation.onResize()}}const qs=new j1;class Y1{selectorNames;tweenParams;split;$texts;constructor(){this.selectorNames={text:'[data-philosophy-animation="text"]'},this.tweenParams={lines:{duration:1.4,stagger:.07,ease:{none:"none",expoOut:"expo.out"}}},this.$texts=[],this.split=null}beforeEnter(){this.setSelector(),this.setSplit()}enter(){this.inViewAnimation()}afterEnter(){}beforeLeave(){}leave(){this.split&&(D.killTweensOf(this.split.lines),this.split.revert(),this.split=null)}afterLeave(){}setSelector(){this.$texts=Array.from(document.querySelectorAll(this.selectorNames.text))}setSplit(){D.delayedCall(.1,()=>{window.requestAnimationFrame(()=>{this.split=Ai.create(this.$texts,{autoSplit:!0,linesClass:"line",tag:"span",type:"lines",reduceWhiteSpace:!1,onSplit:e=>D.set(e.lines,{y:"100%",opacity:0,force3D:!0})})})})}inViewAnimation(){D.delayedCall(.1,()=>{window.requestAnimationFrame(()=>{this.split&&D.killTweensOf(this.split.lines),this.split&&(D.to(this.split.lines,{opacity:1,duration:this.tweenParams.lines.duration,delay:I.isStartup?2.35:2.15,stagger:this.tweenParams.lines.stagger,ease:this.tweenParams.lines.ease.none}),D.to(this.split.lines,{y:"0%",duration:this.tweenParams.lines.duration,delay:I.isStartup?2.35:2.15,stagger:this.tweenParams.lines.stagger,ease:this.tweenParams.lines.ease.expoOut,force3D:!0,onComplete:()=>{this.split&&this.split.revert()}}))})})}}const Xs=new Y1;class K1{selectorNames;tweenParams;split;$texts;textInViewAnimation;buttonInViewAnimation;constructor(){this.selectorNames={text:'[data-projects-animation="text"]'},this.tweenParams={lines:{duration:1.4,stagger:.07,ease:{none:"none",expoOut:"expo.out"}}},this.$texts=[],this.split=null,this.buttonInViewAnimation=null,this.textInViewAnimation=new Vn}beforeEnter(){this.setSelector(),this.setSplit()}enter(){this.buttonInViewAnimation=new Oi({root:document.querySelector(I.pageNames.projects)}),this.textInViewAnimation.init(),this.buttonInViewAnimation.init(),this.inViewAnimation()}afterEnter(){}beforeLeave(){}leave(){this.textInViewAnimation.destroy(),this.split&&(D.killTweensOf(this.split.lines),this.split.revert(),this.split=null)}afterLeave(){}setSelector(){this.$texts=Array.from(document.querySelectorAll(this.selectorNames.text))}setSplit(){D.delayedCall(.1,()=>{window.requestAnimationFrame(()=>{this.split=Ai.create(this.$texts,{autoSplit:!0,linesClass:"line",tag:"span",type:"lines",reduceWhiteSpace:!1,onSplit:e=>D.set(e.lines,{y:"100%",opacity:0,force3D:!0})})})})}inViewAnimation(){D.delayedCall(.1,()=>{window.requestAnimationFrame(()=>{this.split&&D.killTweensOf(this.split.lines),this.split&&(D.to(this.split.lines,{opacity:1,duration:this.tweenParams.lines.duration,delay:I.isStartup?2.35:2.15,stagger:this.tweenParams.lines.stagger,ease:this.tweenParams.lines.ease.none}),D.to(this.split.lines,{y:"0%",duration:this.tweenParams.lines.duration,delay:I.isStartup?2.35:2.15,stagger:this.tweenParams.lines.stagger,ease:this.tweenParams.lines.ease.expoOut,force3D:!0,onComplete:()=>{this.split&&this.split.revert()}}))})})}}const js=new K1;class Z1{selectorNames;tweenParams;$jaLead;textInViewAnimation;buttonInViewAnimation;constructor(){this.selectorNames={jaLead:'[data-school-animation="ja-lead"]'},this.tweenParams={jaLead:{duration:1.4,ease:{none:"none",expoOut:"expo.out"}}},this.$jaLead=null,this.buttonInViewAnimation=null,this.textInViewAnimation=new Vn}beforeEnter(){this.setSelector(),this.setStyle()}enter(){this.buttonInViewAnimation=new Oi({root:document.querySelector(I.pageNames.school)}),this.buttonInViewAnimation.init(),this.textInViewAnimation.init(),this.inViewAnimation()}afterEnter(){}beforeLeave(){}leave(){D.killTweensOf(this.$jaLead),this.textInViewAnimation.destroy()}afterLeave(){}setSelector(){this.$jaLead=document.querySelector(this.selectorNames.jaLead)}setStyle(){D.set(this.$jaLead,{y:"100%",opacity:0,force3D:!0})}inViewAnimation(){D.delayedCall(.1,()=>{window.requestAnimationFrame(()=>{D.killTweensOf(this.$jaLead),D.to(this.$jaLead,{opacity:1,duration:this.tweenParams.jaLead.duration,delay:I.isStartup?1.75:1.55,ease:this.tweenParams.jaLead.ease.none}),D.to(this.$jaLead,{y:"0%",duration:this.tweenParams.jaLead.duration,delay:I.isStartup?1.75:1.55,ease:this.tweenParams.jaLead.ease.expoOut,force3D:!0})})})}}const Ys=new Z1;class J1{selectorNames;tweenParams;$jaLead;textInViewAnimation;buttonInViewAnimation;constructor(){this.selectorNames={jaLead:'[data-craft-animation="ja-lead"]'},this.tweenParams={jaLead:{duration:1.4,ease:{none:"none",expoOut:"expo.out"}}},this.$jaLead=null,this.buttonInViewAnimation=null,this.textInViewAnimation=new Vn}beforeEnter(){this.setSelector(),this.setStyle()}enter(){this.buttonInViewAnimation=new Oi({root:document.querySelector(I.pageNames.craft)}),this.buttonInViewAnimation.init(),this.textInViewAnimation.init(),this.inViewAnimation()}afterEnter(){}beforeLeave(){}leave(){D.killTweensOf(this.$jaLead),this.textInViewAnimation.destroy()}afterLeave(){}setSelector(){this.$jaLead=document.querySelector(this.selectorNames.jaLead)}setStyle(){D.set(this.$jaLead,{y:"100%",opacity:0,force3D:!0})}inViewAnimation(){D.delayedCall(.1,()=>{window.requestAnimationFrame(()=>{D.killTweensOf(this.$jaLead),D.to(this.$jaLead,{opacity:1,duration:this.tweenParams.jaLead.duration,delay:I.isStartup?1.75:1.55,ease:this.tweenParams.jaLead.ease.none}),D.to(this.$jaLead,{y:"0%",duration:this.tweenParams.jaLead.duration,delay:I.isStartup?1.75:1.55,ease:this.tweenParams.jaLead.ease.expoOut,force3D:!0})})})}}const Ks=new J1;class Q1{selectorNames;tweenParams;split;$jaLead;$texts;textInViewAnimation;buttonInViewAnimation;sectionStickyAnimation;constructor(){this.selectorNames={jaLead:'[data-craft-space-animation="ja-lead"]',text:'[data-craft-space-animation="text"]'},this.tweenParams={jaLead:{duration:1.4,ease:{none:"none",expoOut:"expo.out"}},lines:{duration:1.4,stagger:.07,ease:{none:"none",expoOut:"expo.out"}}},this.$texts=[],this.$jaLead=null,this.split=null,this.buttonInViewAnimation=null,this.textInViewAnimation=new Vn,I.detection.pcLayout&&!I.detection.touchDevice&&(this.sectionStickyAnimation=new l_)}beforeEnter(){this.setSelector(),this.setStyle(),this.setSplit()}enter(){this.buttonInViewAnimation=new Oi({root:document.querySelector(I.pageNames.craftSpace)}),this.buttonInViewAnimation.init(),this.textInViewAnimation.init(),this.sectionStickyAnimation&&this.sectionStickyAnimation.init(),this.addEventListeners(),this.inViewAnimation()}afterEnter(){}beforeLeave(){}leave(){this.split&&(D.killTweensOf(this.split.lines),this.split.revert(),this.split=null),D.killTweensOf(this.$jaLead),this.removeEventListeners(),this.textInViewAnimation.destroy(),this.sectionStickyAnimation&&this.sectionStickyAnimation.destroy()}afterLeave(){}addEventListeners(){window.addEventListener("resize",this.onResize)}removeEventListeners(){window.removeEventListener("resize",this.onResize)}onResize=()=>{this.sectionStickyAnimation&&this.sectionStickyAnimation.onResize()};setSelector(){this.$jaLead=document.querySelector(this.selectorNames.jaLead),this.$texts=Array.from(document.querySelectorAll(this.selectorNames.text))}setStyle(){D.set(this.$jaLead,{y:"100%",opacity:0,force3D:!0})}setSplit(){D.delayedCall(.1,()=>{window.requestAnimationFrame(()=>{this.split=Ai.create(this.$texts,{autoSplit:!0,linesClass:"line",tag:"span",type:"lines",reduceWhiteSpace:!1,onSplit:e=>D.set(e.lines,{y:"100%",opacity:0,force3D:!0})})})})}inViewAnimation(){D.delayedCall(.1,()=>{window.requestAnimationFrame(()=>{D.killTweensOf(this.$jaLead),this.split&&D.killTweensOf(this.split.lines),D.to(this.$jaLead,{opacity:1,duration:this.tweenParams.lines.duration,delay:I.isStartup?1.55:1.35,ease:this.tweenParams.lines.ease.none}),D.to(this.$jaLead,{y:"0%",duration:this.tweenParams.lines.duration,delay:I.isStartup?1.55:1.35,ease:this.tweenParams.lines.ease.expoOut,force3D:!0}),this.split&&(D.to(this.split.lines,{opacity:1,duration:this.tweenParams.lines.duration,delay:I.isStartup?2.15:1.95,stagger:this.tweenParams.lines.stagger,ease:this.tweenParams.lines.ease.none}),D.to(this.split.lines,{y:"0%",duration:this.tweenParams.lines.duration,delay:I.isStartup?2.15:1.95,stagger:this.tweenParams.lines.stagger,ease:this.tweenParams.lines.ease.expoOut,force3D:!0,onComplete:()=>{this.split&&this.split.revert()}}))})})}}const Zs=new Q1;class eP{selectorNames;classNames;boundUpdated;el;num=0;numStart=0;numEnd=0;numStartTime=0;numDuration=0;numEasing="easeInOutQuart";numAnimating=!1;contentWrap;contents=[];contentSize=0;isDragging=!1;startX=0;startNum=0;diff=0;vel=0;index=0;constructor(){this.selectorNames={target:'[data-voice-carousel="target"]',contentWrap:'[data-voice-carousel="content-wrap"]',content:'[data-voice-carousel="content"]'},this.classNames={drag:"is-dragging"}}init(){this.setSelector(),this.addEventListeners(),this.boundUpdated=this.updated.bind(this),this.onResize(),this.switch(0),this.updated()}destroy(){this.removeEventListeners()}setSelector(){this.el=document.querySelector(this.selectorNames.target),this.contentWrap=this.el.querySelector(this.selectorNames.contentWrap),this.contents=Array.from(this.contentWrap.querySelectorAll(this.selectorNames.content))}addEventListeners(){this.contentWrap.addEventListener("pointerdown",this.onPointerDown),this.contentWrap.addEventListener("pointermove",this.onPointerMove),this.contentWrap.addEventListener("pointerup",this.onPointerUp),this.contentWrap.addEventListener("pointercancel",this.onPointerCancel)}removeEventListeners(){this.contentWrap.removeEventListener("pointerdown",this.onPointerDown),this.contentWrap.removeEventListener("pointermove",this.onPointerMove),this.contentWrap.removeEventListener("pointerup",this.onPointerUp),this.contentWrap.removeEventListener("pointercancel",this.onPointerCancel)}clampIndex(e){return Math.max(0,Math.min(e,this.contents.length-1))}onPointerDown=e=>{this.isDragging=!0,this.contentWrap.classList.add(this.classNames.drag),this.stopNumAnimation(),this.startX=e.clientX,this.startNum=this.num,this.diff=0,this.vel=0};onPointerMove=e=>{if(!this.isDragging)return;const t=e.clientX-this.startX;this.vel=t-this.diff,this.diff=t,this.num=this.clampIndex(this.startNum-t/this.contentSize)};onPointerUp=()=>{if(!this.isDragging)return;this.isDragging=!1,this.contentWrap.classList.remove(this.classNames.drag);const e=Math.sign(this.vel)===Math.sign(this.diff)?-Math.sign(this.diff):0,t=this.clampIndex(Math.round(this.startNum)+e);this.switch(t,{byDrag:!0})};onPointerCancel=()=>{this.isDragging=!1,this.contentWrap.classList.remove(this.classNames.drag),this.switch(Math.round(this.num),{byDrag:!0})};onResize=()=>{this.contentSize=this.contentWrap.clientWidth};switch(e,t={}){e=this.clampIndex(e),this.index=e,this.animateNumTo(e,900,t.byDrag?"easeOutQuart":"easeInOutQuart")}animateNumTo(e,t,i){this.numStart=this.num,this.numEnd=e,this.numDuration=t,this.numEasing=i,this.numStartTime=performance.now(),this.numAnimating=t>0,this.numAnimating||(this.num=e)}stopNumAnimation(){this.numAnimating=!1}updateNum(e){if(!this.numAnimating)return;const t=e-this.numStartTime,i=Math.min(t/this.numDuration,1);let s;this.numEasing==="easeInOutQuart"?s=TA(i):this.numEasing==="easeOutQuart"?s=AA(i):s=i,this.num=X0(this.numStart,this.numEnd,s),i>=1&&(this.num=this.numEnd,this.numAnimating=!1)}updated(){window.requestAnimationFrame(this.boundUpdated),this.updateNum(performance.now()),this.contents.forEach((e,t)=>{const i=t-this.num,s=I.detection.pcLayout?80:20;e.style.transform=`translateX(${i*(this.contentSize+s)}px)`})}}class tP{selectorNames;tweenParams;$targets;infoList;constructor(){this.selectorNames={target:'[data-close-trigger-hover="target"]',line:'[data-close-trigger-hover="line"]',lineInner:'[data-close-trigger-hover="line-inner"]'},this.tweenParams={duration:1.1,delay:.055,ease:"expo.out"},this.$targets=[],this.infoList=[]}init(){this.setSelector(),this.setInfoList(),this.addEventListeners()}destroy(){this.infoList.forEach(e=>{e.$lines.forEach(t=>{const i=t.querySelectorAll(this.selectorNames.lineInner);D.killTweensOf(i)})}),this.removeEventListeners()}setSelector(){this.$targets=Array.from(document.querySelectorAll(this.selectorNames.target))}setInfoList(){this.$targets.forEach((e,t)=>{const i=e.querySelectorAll(this.selectorNames.line);if(!i.length)return;const s={$target:e,$lines:i,isHover:!1,isAnimating:!1,onMouseEnter:()=>{this.onMouseEnter(t)},onMouseLeave:()=>{this.onMouseLeave(t)}};this.infoList[t]=s,this.setStyle(s)})}setStyle(e){e.$lines.forEach(t=>{const i=t.querySelectorAll(this.selectorNames.lineInner);D.set(i[0],{x:0,clipPath:"inset(0% 0% 0% 0%)"}),D.set(i[1],{x:"-120%",clipPath:"inset(0% 0% 0% 101%)"})})}addEventListeners(){this.infoList.forEach(e=>{e.$target.addEventListener("mouseenter",e.onMouseEnter),e.$target.addEventListener("mouseleave",e.onMouseLeave)})}removeEventListeners(){this.infoList.forEach(e=>{e.$target.removeEventListener("mouseenter",e.onMouseEnter),e.$target.removeEventListener("mouseleave",e.onMouseLeave)})}onMouseEnter=e=>{const t=this.infoList[e];t.isHover=!0,t.isAnimating||this.mouseEnterAnimation(e)};onMouseLeave=e=>{const t=this.infoList[e];t.isHover=!1,t.isAnimating||this.mouseLeaveAnimation(e)};mouseEnterAnimation(e){const t=this.infoList[e];t.isAnimating=!0,window.requestAnimationFrame(()=>{t.$lines.forEach((i,s)=>{const r=i.querySelectorAll(this.selectorNames.lineInner);D.killTweensOf(r),D.to(r[0],{x:"120%",clipPath:"inset(0% 100% 0% 0%)",duration:this.tweenParams.duration,delay:this.tweenParams.delay*(s+1),ease:this.tweenParams.ease,force3D:!0}),D.to(r[1],{x:"0%",clipPath:"inset(0% 0% 0% 0%)",duration:this.tweenParams.duration,delay:this.tweenParams.delay*2*(s+1),ease:this.tweenParams.ease,force3D:!0,onComplete:()=>{t.isAnimating=!1,t.isHover||this.mouseLeaveAnimation(s)}})})})}mouseLeaveAnimation=e=>{const t=this.infoList[e];t.isAnimating=!0,window.requestAnimationFrame(()=>{t.$lines.forEach((i,s)=>{const r=i.querySelectorAll(this.selectorNames.lineInner);D.killTweensOf(r),D.set(r[0],{x:"0%",clipPath:"inset(0% 0% 0% 0%)"}),D.set(r[1],{x:"-120%",clipPath:"inset(0% 0% 0% 100%)"}),window.requestAnimationFrame(()=>{t.isAnimating=!1,t.isHover&&this.mouseEnterAnimation(s)})})})}}class iP{selectorNames;dataNames;$targets;infoList;constructor(){this.selectorNames={target:'[data-retreat-modal="target"]',openTrigger:'[data-retreat-modal="open-trigger"]',closeTrigger:'[data-retreat-modal="close-trigger"]'},this.dataNames={openTrigger:"open-trigger",closeTrigger:"close-trigger"},this.$targets=[],this.infoList=[]}init(){this.setSelector(),this.setInfoList(),this.addEventListeners()}destroy(){this.removeEventListeners()}setSelector(){this.$targets=Array.from(document.querySelectorAll(this.selectorNames.target))}setInfoList(){this.$targets.forEach((e,t)=>{const i=document.querySelectorAll(this.selectorNames.openTrigger)[t],s=e.querySelector(this.selectorNames.closeTrigger);if(!i||!s)return;const r={$target:e,$openTrigger:i,$closetTrigger:s,onClick:a=>{this.onClick(a,t)}};this.infoList[t]=r})}addEventListeners(){this.infoList.forEach(e=>{e.$openTrigger.addEventListener("click",e.onClick),e.$closetTrigger.addEventListener("click",e.onClick)})}removeEventListeners(){this.infoList.forEach(e=>{e.$target.removeEventListener("click",e.onClick),e.$closetTrigger.removeEventListener("click",e.onClick)})}onClick=(e,t)=>{const s=e.currentTarget.dataset.retreatModal;s===this.dataNames.openTrigger?this.openAnimation(t):s===this.dataNames.closeTrigger&&this.closeAnimation(t)};openAnimation(e){const t=this.infoList[e];window.requestAnimationFrame(()=>{t.$target.showModal()})}closeAnimation(e){const t=this.infoList[e];window.requestAnimationFrame(()=>{t.$target.close()})}}class nP{selectorNames;tweenParams;$jaLead;textInViewAnimation;buttonInViewAnimation;closeTriggerHover;carousel;modal;constructor(){this.selectorNames={jaLead:'[data-retreat-animation="ja-lead"]'},this.tweenParams={jaLead:{duration:1.4,ease:{none:"none",expoOut:"expo.out"}}},this.$jaLead=null,this.buttonInViewAnimation=null,this.textInViewAnimation=new Vn,I.detection.touchDevice||(this.closeTriggerHover=new tP),this.carousel=new eP,this.modal=new iP}beforeEnter(){this.setSelector(),this.setStyle()}enter(){this.buttonInViewAnimation=new Oi({root:document.querySelector(I.pageNames.retreat)}),this.buttonInViewAnimation.init(),this.textInViewAnimation.init(),this.carousel.init(),this.closeTriggerHover&&this.closeTriggerHover.init(),this.modal.init(),this.addEventListeners(),this.inViewAnimation()}afterEnter(){}beforeLeave(){}leave(){D.killTweensOf(this.$jaLead),this.removeEventListeners(),this.textInViewAnimation.destroy(),this.closeTriggerHover&&this.closeTriggerHover.destroy(),this.carousel.destroy(),this.modal.destroy()}afterLeave(){}addEventListeners(){window.addEventListener("resize",this.onResize)}removeEventListeners(){window.removeEventListener("resize",this.onResize)}onResize=()=>{this.carousel&&this.carousel.onResize()};setSelector(){this.$jaLead=document.querySelector(this.selectorNames.jaLead)}setStyle(){D.set(this.$jaLead,{y:"100%",opacity:0,force3D:!0})}inViewAnimation(){D.delayedCall(.1,()=>{window.requestAnimationFrame(()=>{D.killTweensOf(this.$jaLead),D.to(this.$jaLead,{opacity:1,duration:this.tweenParams.jaLead.duration,delay:I.isStartup?1.75:1.55,ease:this.tweenParams.jaLead.ease.none}),D.to(this.$jaLead,{y:"0%",duration:this.tweenParams.jaLead.duration,delay:I.isStartup?1.75:1.55,ease:this.tweenParams.jaLead.ease.expoOut,force3D:!0})})})}}const Js=new nP;class sP{selectorNames;tweenParams;split;$jaLead;$texts;textInViewAnimation;cloudsAnimation;cloudScrollAnimation;constructor(){this.selectorNames={jaLead:'[data-company-animation="ja-lead"]',text:'[data-company-animation="text"]'},this.tweenParams={jaLead:{duration:1.4,ease:{none:"none",expoOut:"expo.out"}},lines:{duration:1.4,stagger:.07,ease:{none:"none",expoOut:"expo.out"}}},this.textInViewAnimation=new Vn,this.cloudsAnimation=new Hu,this.cloudScrollAnimation=new o_,this.$texts=[],this.split=null,this.$jaLead=null}beforeEnter(){this.setSelector(),this.setStyle(),this.setSplit()}enter(){this.textInViewAnimation.init(),this.cloudsAnimation.init(),this.cloudScrollAnimation.init(),this.inViewAnimation()}afterEnter(){}beforeLeave(){}leave(){this.split&&(D.killTweensOf(this.split.lines),this.split.revert(),this.split=null),D.killTweensOf(this.$jaLead),this.textInViewAnimation.destroy(),this.cloudsAnimation.destroy(),this.cloudScrollAnimation.destroy()}afterLeave(){}setSelector(){this.$jaLead=document.querySelector(this.selectorNames.jaLead),this.$texts=Array.from(document.querySelectorAll(this.selectorNames.text))}setStyle(){D.set(this.$jaLead,{y:"100%",opacity:0,force3D:!0})}setSplit(){D.delayedCall(.1,()=>{window.requestAnimationFrame(()=>{this.split=Ai.create(this.$texts,{autoSplit:!0,linesClass:"line",tag:"span",type:"lines",reduceWhiteSpace:!1,onSplit:e=>D.set(e.lines,{y:"100%",opacity:0,force3D:!0})})})})}inViewAnimation(){D.delayedCall(.1,()=>{window.requestAnimationFrame(()=>{D.killTweensOf(this.$jaLead),this.split&&D.killTweensOf(this.split.lines),D.to(this.$jaLead,{opacity:1,duration:this.tweenParams.lines.duration,delay:I.isStartup?1.95:1.75,ease:this.tweenParams.lines.ease.none}),D.to(this.$jaLead,{y:"0%",duration:this.tweenParams.lines.duration,delay:I.isStartup?1.95:1.75,ease:this.tweenParams.lines.ease.expoOut,force3D:!0}),this.split&&(D.to(this.split.lines,{opacity:1,duration:this.tweenParams.lines.duration,delay:I.isStartup?2.55:2.35,stagger:this.tweenParams.lines.stagger,ease:this.tweenParams.lines.ease.none}),D.to(this.split.lines,{y:"0%",duration:this.tweenParams.lines.duration,delay:I.isStartup?2.55:2.35,stagger:this.tweenParams.lines.stagger,ease:this.tweenParams.lines.ease.expoOut,force3D:!0,onComplete:()=>{this.split&&this.split.revert()}}))})})}}const Qs=new sP;class rP{buttonInViewAnimation;constructor(){this.buttonInViewAnimation=null}beforeEnter(){}enter(){this.buttonInViewAnimation=new Oi({root:document.querySelector(I.pageNames.contact)}),this.buttonInViewAnimation.init()}afterEnter(){}beforeLeave(){}leave(){}afterLeave(){}}const er=new rP;class aP{selectorNames;tweenParams;split;$texts;buttonInViewAnimation;constructor(){this.selectorNames={text:'[data-thanks-animation="text"]'},this.tweenParams={lines:{duration:1.4,stagger:.07,ease:{none:"none",expoOut:"expo.out"}}},this.$texts=[],this.split=null,this.buttonInViewAnimation=null}beforeEnter(){this.setSelector(),this.setSplit()}enter(){this.buttonInViewAnimation=new Oi({root:document.querySelector(I.pageNames.thanks)}),this.buttonInViewAnimation.init(),this.inViewAnimation()}afterEnter(){}beforeLeave(){}leave(){this.split&&(D.killTweensOf(this.split.lines),this.split.revert(),this.split=null)}afterLeave(){}setSelector(){this.$texts=Array.from(document.querySelectorAll(this.selectorNames.text))}setSplit(){D.delayedCall(.1,()=>{window.requestAnimationFrame(()=>{this.split=Ai.create(this.$texts,{autoSplit:!0,linesClass:"line",tag:"span",type:"lines",reduceWhiteSpace:!1,onSplit:e=>D.set(e.lines,{y:"100%",opacity:0,force3D:!0})})})})}inViewAnimation(){D.delayedCall(.1,()=>{window.requestAnimationFrame(()=>{this.split&&D.killTweensOf(this.split.lines),this.split&&(D.to(this.split.lines,{opacity:1,duration:this.tweenParams.lines.duration,delay:I.isStartup?2.15:1.475,stagger:this.tweenParams.lines.stagger,ease:this.tweenParams.lines.ease.none}),D.to(this.split.lines,{y:"0%",duration:this.tweenParams.lines.duration,delay:I.isStartup?2.15:1.475,stagger:this.tweenParams.lines.stagger,ease:this.tweenParams.lines.ease.expoOut,force3D:!0,onComplete:()=>{this.split&&this.split.revert()}}))})})}}const tr=new aP;class oP{constructor(){}beforeEnter(){}enter(){}afterEnter(){}beforeLeave(){}leave(){}afterLeave(){}}const ir=new oP;class lP{selectorNames;tweenParams;$description;textInViewAnimation;cloudsLoopAnimation;buttonInViewAnimation;constructor(){this.selectorNames={description:'[data-not-found-animation="description"]'},this.tweenParams={description:{duration:1.4,ease:{none:"none",expoOut:"expo.out"}}},this.$description=null,this.buttonInViewAnimation=null,this.textInViewAnimation=new Vn,this.cloudsLoopAnimation=new Hu}beforeEnter(){this.setSelector(),this.setStyle()}enter(){this.buttonInViewAnimation=new Oi({root:document.querySelector(I.pageNames.notFound)}),this.buttonInViewAnimation.init(),this.textInViewAnimation.init(),this.cloudsLoopAnimation.init(),this.inViewAnimation()}afterEnter(){}beforeLeave(){}leave(){D.killTweensOf(this.$description),this.textInViewAnimation.destroy(),this.cloudsLoopAnimation.destroy()}afterLeave(){}setSelector(){this.$description=document.querySelector(this.selectorNames.description)}setStyle(){D.set(this.$description,{opacity:0,y:"100%",force3D:!0})}inViewAnimation(){D.delayedCall(.1,()=>{window.requestAnimationFrame(()=>{D.killTweensOf(this.$description),D.to(this.$description,{opacity:1,duration:this.tweenParams.description.duration,delay:I.isStartup?1.55:1.35,ease:this.tweenParams.description.ease.none}),D.to(this.$description,{y:"0%",duration:this.tweenParams.description.duration,delay:I.isStartup?1.55:1.35,ease:this.tweenParams.description.ease.expoOut,force3D:!0})})})}}const nr=new lP;class cP{beforeEnter(){document.querySelector(I.pageNames.company)&&Qs.beforeEnter(),document.querySelector(I.pageNames.contact)&&er.beforeEnter(),document.querySelector(I.pageNames.craft)&&Ks.beforeEnter(),document.querySelector(I.pageNames.craftSpace)&&Zs.beforeEnter(),document.querySelector(I.pageNames.home)&&qs.beforeEnter(),document.querySelector(I.pageNames.notFound)&&nr.beforeEnter(),document.querySelector(I.pageNames.philosophy)&&Xs.beforeEnter(),document.querySelector(I.pageNames.projects)&&js.beforeEnter(),document.querySelector(I.pageNames.retreat)&&Js.beforeEnter(),document.querySelector(I.pageNames.school)&&Ys.beforeEnter(),document.querySelector(I.pageNames.privacy)&&ir.beforeEnter(),document.querySelector(I.pageNames.thanks)&&tr.beforeEnter()}enter(){document.querySelector(I.pageNames.company)&&Qs.enter(),document.querySelector(I.pageNames.contact)&&er.enter(),document.querySelector(I.pageNames.craft)&&Ks.enter(),document.querySelector(I.pageNames.craftSpace)&&Zs.enter(),document.querySelector(I.pageNames.home)&&qs.enter(),document.querySelector(I.pageNames.notFound)&&nr.enter(),document.querySelector(I.pageNames.philosophy)&&Xs.enter(),document.querySelector(I.pageNames.projects)&&js.enter(),document.querySelector(I.pageNames.retreat)&&Js.enter(),document.querySelector(I.pageNames.school)&&Ys.enter(),document.querySelector(I.pageNames.privacy)&&ir.enter(),document.querySelector(I.pageNames.thanks)&&tr.enter(),I.webgl.enter()}afterEnter(){document.querySelector(I.pageNames.company)&&Qs.afterEnter(),document.querySelector(I.pageNames.contact)&&er.afterEnter(),document.querySelector(I.pageNames.craft)&&Ks.afterEnter(),document.querySelector(I.pageNames.craftSpace)&&Zs.afterEnter(),document.querySelector(I.pageNames.home)&&qs.afterEnter(),document.querySelector(I.pageNames.notFound)&&nr.afterEnter(),document.querySelector(I.pageNames.philosophy)&&Xs.afterEnter(),document.querySelector(I.pageNames.projects)&&js.afterEnter(),document.querySelector(I.pageNames.retreat)&&Js.afterEnter(),document.querySelector(I.pageNames.school)&&Ys.afterEnter(),document.querySelector(I.pageNames.privacy)&&ir.afterEnter(),document.querySelector(I.pageNames.thanks)&&tr.afterEnter()}beforeLeave(){document.querySelector(I.pageNames.company)&&Qs.beforeLeave(),document.querySelector(I.pageNames.contact)&&er.beforeLeave(),document.querySelector(I.pageNames.craft)&&Ks.beforeLeave(),document.querySelector(I.pageNames.craftSpace)&&Zs.beforeLeave(),document.querySelector(I.pageNames.home)&&qs.beforeLeave(),document.querySelector(I.pageNames.notFound)&&nr.beforeLeave(),document.querySelector(I.pageNames.philosophy)&&Xs.beforeLeave(),document.querySelector(I.pageNames.projects)&&js.beforeLeave(),document.querySelector(I.pageNames.retreat)&&Js.beforeLeave(),document.querySelector(I.pageNames.school)&&Ys.beforeLeave(),document.querySelector(I.pageNames.privacy)&&ir.beforeLeave(),document.querySelector(I.pageNames.thanks)&&tr.beforeLeave()}leave(){document.querySelector(I.pageNames.company)&&Qs.leave(),document.querySelector(I.pageNames.contact)&&er.leave(),document.querySelector(I.pageNames.craft)&&Ks.leave(),document.querySelector(I.pageNames.craftSpace)&&Zs.leave(),document.querySelector(I.pageNames.home)&&qs.leave(),document.querySelector(I.pageNames.notFound)&&nr.leave(),document.querySelector(I.pageNames.philosophy)&&Xs.leave(),document.querySelector(I.pageNames.projects)&&js.leave(),document.querySelector(I.pageNames.retreat)&&Js.leave(),document.querySelector(I.pageNames.school)&&Ys.leave(),document.querySelector(I.pageNames.privacy)&&ir.leave(),document.querySelector(I.pageNames.thanks)&&tr.leave()}afterLeave(){document.querySelector(I.pageNames.company)&&Qs.afterLeave(),document.querySelector(I.pageNames.contact)&&er.afterLeave(),document.querySelector(I.pageNames.craft)&&Ks.afterLeave(),document.querySelector(I.pageNames.craftSpace)&&Zs.afterLeave(),document.querySelector(I.pageNames.home)&&qs.afterLeave(),document.querySelector(I.pageNames.notFound)&&nr.afterLeave(),document.querySelector(I.pageNames.philosophy)&&Xs.afterLeave(),document.querySelector(I.pageNames.projects)&&js.afterLeave(),document.querySelector(I.pageNames.retreat)&&Js.afterLeave(),document.querySelector(I.pageNames.school)&&Ys.afterLeave(),document.querySelector(I.pageNames.privacy)&&ir.afterLeave(),document.querySelector(I.pageNames.thanks)&&tr.afterLeave(),I.webgl.leave()}}const hP=new cP;class Wd{selectorNames;$images;imagesList;root;constructor(e={}){this.selectorNames={image:"img"},this.$images=[],this.imagesList=[],this.root=document,Object.assign(this,e)}init(){this.setSelector()}setSelector(){this.$images=Array.from(this.root.querySelectorAll(this.selectorNames.image)),this.imagesList=this.getImages()}getImages(){return this.$images.map(e=>({src:e.currentSrc}))}async load(e,t){await new Promise(i=>{const s=new Image;s.onload=()=>{i(),t(e)},s.onerror=()=>{i(),t(e)},s.src=e.src})}}class qd{tasks;onUpdateProgressAnimation;onCompleteProgressAnimation;taskLength;taskResolveCount;progress;constructor(){this.tasks=[],this.onUpdateProgressAnimation=null,this.onCompleteProgressAnimation=null,this.taskLength=0,this.taskResolveCount=0,this.progress=0}init(e={onUpdateProgressAnimation:(t,i)=>{t===1&&i&&i()},onCompleteProgressAnimation:null}){this.onUpdateProgressAnimation=e.onUpdateProgressAnimation??null,this.onCompleteProgressAnimation=e.onCompleteProgressAnimation??null}add(e,t){this.tasks.push({taskId:t,task:e})}set(){this.taskLength=this.tasks.length,this.taskResolveCount=0}run(){this.tasks.length?this.tasks.forEach(e=>{e.task().then(()=>{this.taskResolveCount++,this.update(this.taskResolveCount,this.taskLength)})}):this.update(1,1)}update(e,t){this.progress=e/t,this.onUpdateProgressAnimation&&this.onUpdateProgressAnimation(this.progress,this.onCompleteProgressAnimation)}}class uP{selectorNames;tweenParams;$target;$times;$scroll;isTargetInView;requestId;constructor(){this.selectorNames={target:"[data-aside]",times:'[data-aside="times"]',scroll:'[data-aside="scroll"]'},this.tweenParams={duration:.5,ease:"cubic.out"},this.$target=null,this.$times=null,this.$scroll=null,this.isTargetInView=!1,this.requestId=0}init(){this.setSelector(),this.toggleTimes(),this.toggleText(),this.raf()}destroy(){this.caf()}setSelector(){this.$target=document.querySelector(this.selectorNames.target),this.$times=document.querySelector(this.selectorNames.times),this.$scroll=document.querySelector(this.selectorNames.scroll)}raf=()=>{this.onRaf(),this.requestId=window.requestAnimationFrame(this.raf)};caf(){cancelAnimationFrame(this.requestId)}onRaf(){this.toggleTarget()}toggleTarget(){const t=I.resize.size.window.x>I.resize.size.window.y?I.resize.size.window.y*.5:I.resize.size.window.y*.125;I.smoothScroll.lenis&&I.smoothScroll.lenis.animatedScroll>t?this.isTargetInView||this.outViewTarget():this.isTargetInView&&this.inViewTarget()}inViewTarget(){this.isTargetInView=!1,D.to(this.$target,{autoAlpha:1,duration:this.tweenParams.duration,ease:this.tweenParams.ease})}outViewTarget(){this.isTargetInView=!0,D.to(this.$target,{autoAlpha:0,duration:this.tweenParams.duration,ease:this.tweenParams.ease})}toggleTimes(){document.querySelector(I.pageNames.home)||document.querySelector(I.pageNames.notFound)?this.inViewTimes():this.outViewTimes()}inViewTimes(){D.set(this.$times,{opacity:1})}outViewTimes(){D.set(this.$times,{opacity:0})}toggleText(){document.querySelector(I.pageNames.notFound)?this.setEOFText():this.setScrollText()}setEOFText(){this.$scroll&&(this.$scroll.textContent="EOF")}setScrollText(){this.$scroll&&(this.$scroll.textContent="scroll")}}class fP{selectorNames;$targets;infoList;isColonInView;clockIntervalId;colonIntervalId;constructor(){this.selectorNames={target:'[data-clock="target"]',jaClock:'[data-clock="ja-clock"]',jaHours:'[data-clock="ja-hours"]',jaMinutes:'[data-clock="ja-minutes"]',jaSeconds:'[data-clock="ja-seconds"]',enClock:'[data-clock="en-clock"]',enHours:'[data-clock="en-hours"]',enMinutes:'[data-clock="en-minutes"]',enSeconds:'[data-clock="en-seconds"]',colon:'[data-clock="colon"]'},this.$targets=[],this.infoList=[],this.isColonInView=!0,this.clockIntervalId=null,this.colonIntervalId=null}init(){this.setSelector(),this.setInfoList(),this.updateClock(),this.updateColon(),this.updateInterval()}destroy(){this.clockIntervalId!==null&&clearInterval(this.clockIntervalId),this.colonIntervalId!==null&&clearInterval(this.colonIntervalId)}setSelector(){this.$targets=Array.from(document.querySelectorAll(this.selectorNames.target))}setInfoList(){this.$targets.forEach((e,t)=>{const i=e.querySelector(this.selectorNames.jaClock),s=e.querySelector(this.selectorNames.jaHours),r=e.querySelector(this.selectorNames.jaMinutes),a=e.querySelector(this.selectorNames.jaSeconds),o=e.querySelector(this.selectorNames.enClock),l=e.querySelector(this.selectorNames.enHours),c=e.querySelector(this.selectorNames.enMinutes),h=e.querySelector(this.selectorNames.enSeconds),u=e.querySelectorAll(this.selectorNames.colon);if(!i||!s||!r||!a||!o||!l||!c||!h)return;const f={$target:e,$jaClock:i,$jaHours:s,$jaMinutes:r,$jaSeconds:a,$enClock:o,$enHours:l,$enMinutes:c,$enSeconds:h,$colons:u};this.infoList[t]=f})}setClockByTimeZone(e,t,i){const s=new Date().toLocaleTimeString("en-GB",{timeZone:i}),[r,a,o]=s.split(":"),l={ja:{$clock:e.$jaClock,$hours:e.$jaHours,$minutes:e.$jaMinutes,$seconds:e.$jaSeconds},en:{$clock:e.$enClock,$hours:e.$enHours,$minutes:e.$enMinutes,$seconds:e.$enSeconds}},{$clock:c,$hours:h,$minutes:u,$seconds:f}=l[t];c.setAttribute("datetime",s),h.textContent=r,u.textContent=a,f.textContent=o}updateClock(){this.infoList.forEach(e=>{this.setClockByTimeZone(e,"ja","Asia/Tokyo"),this.setClockByTimeZone(e,"en","Asia/Dubai")})}updateColon(){this.infoList.forEach(e=>{e.$colons.forEach(t=>{D.set(t,{opacity:this.isColonInView?"1":"0"})})}),this.isColonInView=!this.isColonInView}updateInterval(){this.clockIntervalId=setInterval(()=>{this.updateClock()},1e3),this.colonIntervalId=setInterval(()=>{this.updateColon()},500)}}class Xd{selectorNames;nextPageParams;$target;$nextLink;$nextScreenLeaderText;$nextLinkText;constructor(){this.selectorNames={target:'[data-footer="next"]',nextLink:'[data-footer="next-link"]',nextScreenLeaderText:'[data-footer="next-screen-leader-text"]',nextLinkText:'[data-footer="next-link-text"]'},this.nextPageParams={home:{url:"/",text:"Home",next:"philosophy"},philosophy:{url:"/philosophy/",text:"Philosophy",next:"projects"},projects:{url:"/projects/",text:"Projects",next:"school"},school:{url:"/projects/school/",text:"Projects / School",next:"craft"},craft:{url:"/projects/craft/",text:"Projects / Craft",next:"craftSpace"},craftSpace:{url:"/projects/craft-space/",text:"Projects / Space",next:"retreat"},retreat:{url:"/projects/retreat/",text:"Retreat",next:"company"},company:{url:"/company/",text:"Company",next:"contact"},contact:{url:"/contact/",text:"Contact",next:null},thanks:{url:"/thanks/",text:"Thanks",next:"home"},privacy:{url:"/privacy/",text:"Privacy",next:"home"}},this.$nextLinkText=[],this.$target=null,this.$nextLink=null,this.$nextScreenLeaderText=null}init(){this.setSelector(),this.setNextPageValue()}setSelector(){this.$target=document.querySelector(this.selectorNames.target),this.$target&&(this.$nextLink=this.$target.querySelector(this.selectorNames.nextLink),this.$nextScreenLeaderText=this.$target.querySelector(this.selectorNames.nextScreenLeaderText),this.$nextLinkText=Array.from(this.$target.querySelectorAll(this.selectorNames.nextLinkText)))}setNextPageValue(){const e=Object.keys(I.pageNames).find(r=>document.querySelector(I.pageNames[r]));if(!e)return;const t=this.nextPageParams[e].next;if(!t)return;const i=this.nextPageParams[t],s=location.pathname.startsWith("/ja/")?"/ja":"";!this.$nextLink||!this.$nextScreenLeaderText||this.$nextLinkText.length===0||(this.$nextLink.href=`${s}${i.url}`,this.$nextScreenLeaderText.textContent=i.text,this.$nextLinkText.forEach(r=>{r.innerHTML=i.text.replace(/ /g,"&nbsp;")}))}}class So{selectorNames;tweenParams;$targets;infoList;root;constructor(e={}){this.selectorNames={target:'[data-button-hover="target"]',text:'[data-button-hover="text"]',firstLine:'[data-button-hover="first-line"]'},this.tweenParams={text:{duration:.7,delay:.07,ease:"quart.out"},line:{duration:.7,ease:"quart.out"}},this.$targets=[],this.infoList=[],this.root=document,Object.assign(this,e)}init(){this.setSelector(),window.requestAnimationFrame(()=>{this.setInfoList(),this.addEventListeners()})}destroy(){this.infoList.forEach(e=>{this.killTweens(e)}),this.removeEventListeners()}setSelector(){this.$targets=Array.from(this.root.querySelectorAll(this.selectorNames.target))}setInfoList(){this.$targets.forEach((e,t)=>{const i=e.querySelector(this.selectorNames.firstLine),s=e.querySelectorAll(this.selectorNames.text),r=s[0],a=s[1]||s[0];if(!i||!r||!a)return;const o={$target:e,$firstLine:i,$textBefore:r,$textAfter:a,lineOffsetX:0,lineEnterOffsetX:0,isHover:!1,isAnimating:!1,onMouseEnter:()=>{this.onMouseEnter(t)},onMouseLeave:()=>{this.onMouseLeave(t)}};this.infoList[t]=o,this.setSize(o),this.setStyle(o)})}setSize(e){const l=I.detection.pcLayout?1600:402;let c=20;e.$target.closest("[data-footer]")?c=I.detection.pcLayout?40:20:e.$target.closest('[data-voice-carousel="target"]')?c=I.detection.pcLayout?40:32:c=20;const h=c*(window.innerWidth/l),f=(e.$firstLine.offsetParent||e.$target).getBoundingClientRect(),d=e.$textBefore.getBoundingClientRect(),_=e.$firstLine.offsetWidth,m=e.$firstLine.offsetLeft,g=d.left-f.left,p=Math.max(0,g-m),x=Math.max(0,_-p-d.width),M=-(d.width+x+h);e.lineOffsetX=M,e.$target.closest('[data-voice-carousel="target"]')?e.lineEnterOffsetX=I.detection.pcLayout?p-h+20*(window.innerWidth/l):p-h+32*(window.innerWidth/l):e.lineEnterOffsetX=p-h}setStyle(e){D.set(e.$firstLine,{x:e.lineOffsetX,transformOrigin:"left",force3D:!0}),D.set(e.$textBefore,{y:"0%",force3D:!0}),D.set(e.$textAfter,{y:"130%",force3D:!0})}addEventListeners(){this.infoList.forEach(e=>{e.$target.addEventListener("mouseenter",e.onMouseEnter),e.$target.addEventListener("mouseleave",e.onMouseLeave)}),window.addEventListener("resize",this.onResize)}removeEventListeners(){this.infoList.forEach(e=>{e.$target.removeEventListener("mouseenter",e.onMouseEnter),e.$target.removeEventListener("mouseleave",e.onMouseLeave)}),window.removeEventListener("resize",this.onResize)}onMouseEnter=e=>{I.isPageTransitioning||this.mouseEnterAnimation(e)};onMouseLeave=e=>{I.isPageTransitioning||this.mouseLeaveAnimation(e)};onResize=()=>{this.infoList.forEach(e=>{this.setSize(e),this.setStyle(e)})};mouseEnterAnimation(e){const t=this.infoList[e];window.requestAnimationFrame(()=>{this.killTweens(t),D.to(t.$firstLine,{x:t.lineEnterOffsetX,duration:this.tweenParams.line.duration,ease:this.tweenParams.line.ease,force3D:!0}),D.to(t.$textBefore,{y:"-130%",duration:this.tweenParams.text.duration,ease:this.tweenParams.text.ease,force3D:!0}),D.to(t.$textAfter,{y:"0%",duration:this.tweenParams.text.duration,ease:this.tweenParams.text.ease,force3D:!0})})}mouseLeaveAnimation(e){const t=this.infoList[e];window.requestAnimationFrame(()=>{this.killTweens(t),D.to(t.$firstLine,{x:t.lineOffsetX,duration:1.1,ease:this.tweenParams.line.ease,force3D:!0}),D.to(t.$textBefore,{y:"0%",duration:this.tweenParams.text.duration,ease:this.tweenParams.text.ease,force3D:!0}),D.to(t.$textAfter,{y:"130%",duration:this.tweenParams.text.duration,ease:this.tweenParams.text.ease,force3D:!0})})}killTweens(e){D.killTweensOf(e.$firstLine),D.killTweensOf(e.$textBefore),D.killTweensOf(e.$textAfter)}}class jd{selectorNames;tweenParams;$targets;infoList;root;constructor(e={}){this.selectorNames={target:'[data-link-hover="target"]',text:'[data-link-hover="text"]',line:'[data-link-hover="line"]'},this.tweenParams={text:{duration:.7,delay:.07,ease:"quart.out"},line:{duration:.7,ease:"quart.out"}},this.$targets=[],this.infoList=[],this.root=document,Object.assign(this,e)}init(){this.setSelector(),window.requestAnimationFrame(()=>{this.setInfoList(),this.addEventListeners()})}destroy(){this.infoList.forEach(e=>{this.killTweens(e)}),this.removeEventListeners()}setSelector(){this.$targets=Array.from(this.root.querySelectorAll(this.selectorNames.target))}setInfoList(){this.$targets.forEach((e,t)=>{const i=e.querySelectorAll(this.selectorNames.text),s=i[0],r=i[1],a=e.querySelector(this.selectorNames.line);if(!s||!r||!a)return;const o={$target:e,$textBefore:s,$textAfter:r,$line:a,isHover:!1,isAnimating:!1,onMouseEnter:()=>{this.onMouseEnter(t)},onMouseLeave:()=>{this.onMouseLeave(t)}};this.infoList[t]=o,this.setStyle(o)})}setStyle(e){D.set(e.$textBefore,{y:"0%",force3D:!0}),D.set(e.$textAfter,{y:"130%",force3D:!0}),D.set(e.$line,{scaleX:0,transformOrigin:"left"})}addEventListeners(){this.infoList.forEach(e=>{e.$target.addEventListener("mouseenter",e.onMouseEnter),e.$target.addEventListener("mouseleave",e.onMouseLeave)})}removeEventListeners(){this.infoList.forEach(e=>{e.$target.removeEventListener("mouseenter",e.onMouseEnter),e.$target.removeEventListener("mouseleave",e.onMouseLeave)})}onMouseEnter=e=>{I.isPageTransitioning||this.mouseEnterAnimation(e)};onMouseLeave=e=>{I.isPageTransitioning||this.mouseLeaveAnimation(e)};mouseEnterAnimation(e){const t=this.infoList[e];window.requestAnimationFrame(()=>{this.killTweens(t),D.to(t.$textBefore,{y:"-110%",duration:this.tweenParams.text.duration,ease:this.tweenParams.text.ease,force3D:!0}),D.to(t.$textAfter,{y:"0%",duration:this.tweenParams.text.duration,ease:this.tweenParams.text.ease,force3D:!0}),D.to(t.$line,{scaleX:1,duration:this.tweenParams.line.duration,ease:this.tweenParams.line.ease})})}mouseLeaveAnimation(e){const t=this.infoList[e];window.requestAnimationFrame(()=>{this.killTweens(t),D.to(t.$textBefore,{y:"0%",duration:this.tweenParams.text.duration,ease:this.tweenParams.text.ease,force3D:!0}),D.to(t.$textAfter,{y:"130%",duration:this.tweenParams.text.duration,ease:this.tweenParams.text.ease,force3D:!0}),D.to(t.$line,{scaleX:0,duration:this.tweenParams.line.duration,ease:this.tweenParams.line.ease})})}killTweens(e){D.killTweensOf(e.$textBefore),D.killTweensOf(e.$textAfter),D.killTweensOf(e.$line)}}class Yd{selectorNames;classNames;$targets;constructor(){this.selectorNames={target:'[data-lang-controller="target"]'},this.classNames={current:"-current",disabled:"-disabled"},this.$targets=[]}init(){this.setSelector(),this.setLanguage(),this.addEventListeners()}destroy(){this.removeEventListeners()}setSelector(){this.$targets=Array.from(document.querySelectorAll(this.selectorNames.target))}setLanguage(){this.$targets.forEach(e=>{const t=e.getAttribute("href")??"",i=t.startsWith("http")?new URL(t).pathname:t,s=location.pathname.startsWith("/ja/"),r=i.startsWith("/ja/");s===r&&(e.classList.add(this.classNames.current),e.classList.add(this.classNames.disabled))})}addEventListeners(){this.$targets.forEach(e=>{e.addEventListener("click",this.onClick)})}removeEventListeners(){this.$targets.forEach(e=>{e.removeEventListener("click",this.onClick)})}onClick=e=>{e.preventDefault();const i=e.currentTarget.getAttribute("href")??"/",s=i.endsWith("/")?i:i+"/";let r=location.pathname.replace(/^\/ja\//,"/");r===""&&(r="/");let a=s==="/ja/"?"/ja"+r:r;a=a.replace(/\/\/+/,"/"),window.location.href=a}}class Kd{selectorNames;currentOptions;classNames;pageNames;$targets;constructor(){this.selectorNames={target:'[data-current-link-controller="target"]'},this.currentOptions={childCurrent:!1,onlyChildCurrent:!1},this.classNames={current:"-current",disabled:"-disabled",childCurrent:"-childCurrent"},this.pageNames={projects:"projects"},this.$targets=[]}init(){this.setSelector()}destroy(){this.removeCurrent()}setSelector(){this.$targets=Array.from(document.querySelectorAll(this.selectorNames.target));for(let e=0;e<this.$targets.length;e++)this.checkCurrent(e)}setCurrent(e,t={}){if((t??this.currentOptions).onlyChildCurrent){this.$targets[e].classList.add(this.classNames.childCurrent);return}this.$targets[e].classList.add(this.classNames.current),this.$targets[e].setAttribute("aria-current","page"),t.childCurrent&&this.$targets[e].classList.add(this.classNames.childCurrent)}removeCurrent(){for(let e=0;e<this.$targets.length;e++)this.$targets[e].classList.remove(this.classNames.current),this.$targets[e].classList.remove(this.classNames.childCurrent),this.$targets[e].removeAttribute("aria-current")}checkCurrent(e){const t=this.$targets[e].getAttribute("href");if(!t)return;const i=t.startsWith("http")?new URL(t).pathname:t,s=location.pathname,r=s.startsWith("/ja/"),a=r?`/ja/${this.pageNames.projects}/`:`/${this.pageNames.projects}/`,o=r?`/ja/${this.pageNames.projects}`:`/${this.pageNames.projects}`;if(s===a&&(i===a||i===o)){this.setCurrent(e);return}if(s.startsWith(a)&&s!==a&&i===s){this.setCurrent(e);for(let l=0;l<this.$targets.length;l++){const c=this.$targets[l].getAttribute("href");if(!c)continue;const h=c.startsWith("http")?new URL(c).pathname:c;(h===a||h===o)&&this.setCurrent(l,{onlyChildCurrent:!0})}return}if(s===i){this.setCurrent(e);return}}}class dP{selectorNames;tweenParams;focusableElements;$navElements;$navLinkCircles;$headerMenu;$headerClose;$navTrigger;$nav;$navContents;$navSubLinkLine;$content;activeElement;isAnimating;isOpen;constructor(){this.selectorNames={navTrigger:'[data-nav="trigger"]',nav:"#nav[data-nav]",navContents:'[data-nav="contents"]',navElement:'[data-nav="element"]',navLinkCircle:'[data-nav="link-circle"]',navSubLinkLine:".nav_subLink.-line",headerMenu:'[data-header="menu"]',headerClose:'[data-header="close"]',content:"[data-content]"},this.tweenParams={transformOriginTarget:{duration:.8,ease:"cubic.inOut"},nav:{duration:.8,ease:"cubic.out"},headerMenu:{duration:.4,ease:"none"},headerClose:{duration:.4,ease:"none"},subLinkText:{duration:1.4,ease:{none:"none",out:"expo.out"}},linkCircle:{duration:1.4,ease:"expo.out"},subLinkLine:{duration:1.4,delay:1.2,ease:"expo.out"}},this.focusableElements=["a[href]","area[href]",'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',"select:not([disabled]):not([aria-hidden])","textarea:not([disabled]):not([aria-hidden])","button:not([disabled]):not([aria-hidden])","iframe","object","embed","[contenteditable]",'[tabindex]:not([tabindex^="-"])'],this.$navElements=[],this.$navLinkCircles=[],this.$headerMenu=[],this.$headerClose=[],this.$navTrigger=null,this.$nav=null,this.$navContents=null,this.$navSubLinkLine=null,this.$content=null,this.activeElement=null,this.isAnimating=!1,this.isOpen=!1}init(){this.setSelector(),this.setStyle(),this.addEventListeners()}destroy(){this.isOpen=!1,this.closeAnimation()}getFocusableNodes(){if(!this.$nav)return[];const e=this.focusableElements.join(",");return[...this.$nav?Array.from(this.$nav.querySelectorAll(e)):[]]}setSelector(){this.$navTrigger=document.querySelector(this.selectorNames.navTrigger),this.$nav=document.querySelector(this.selectorNames.nav),this.$nav&&(this.$navContents=this.$nav.querySelector(this.selectorNames.navContents),this.$navElements=Array.from(this.$nav.querySelectorAll(this.selectorNames.navElement)),this.$navLinkCircles=Array.from(this.$nav.querySelectorAll(this.selectorNames.navLinkCircle)),this.$navSubLinkLine=this.$nav.querySelector(this.selectorNames.navSubLinkLine),this.$headerMenu=Array.from(document.querySelectorAll(this.selectorNames.headerMenu)),this.$headerClose=Array.from(document.querySelectorAll(this.selectorNames.headerClose)),this.$content=document.querySelector(this.selectorNames.content))}setStyle(){D.set(this.$nav,{autoAlpha:0}),D.set(this.$navElements,{opacity:0,x:I.detection.pcLayout?"1.25vw":"5.223880597vw",force3D:!0}),this.$navLinkCircles.forEach(e=>{D.set(e,{scale:0})}),D.set(this.$headerClose,{opacity:0})}setFocusToFirstNode(){const e=this.getFocusableNodes();e.length!==0&&e.length>0&&e[0]instanceof HTMLElement&&e[0].focus()}addEventListeners(){this.$navTrigger&&this.$navTrigger.addEventListener("click",this.onClick)}onClick=()=>{this.isOpen?(document.removeEventListener("keydown",this.onKeydown),this.close()):(document.addEventListener("keydown",this.onKeydown),this.open())};onKeydown=e=>{e.key==="Escape"&&this.closeAnimation(),e.key==="Tab"&&this.bindFocus(e)};open(){this.isAnimating||(this.isAnimating=!0,this.isOpen=!0,this.openAnimation())}close(){this.isAnimating||(this.isAnimating=!0,this.isOpen=!1,this.closeAnimation())}openAnimation(){let e;this.$content&&(e=bA(this.$content)),document.activeElement instanceof HTMLElement?this.activeElement=document.activeElement:this.activeElement=null,this.$navTrigger&&this.$nav&&(this.$nav.setAttribute("aria-hidden","false"),this.$navTrigger.setAttribute("aria-expanded","true")),I.smoothScroll.lenis&&I.smoothScroll.stop(),I.navWebgl.meshManager&&I.navWebgl.startRenderLoop(),window.requestAnimationFrame(()=>{this.killTweens(),D.to(e,{opacity:0,scale:.9,duration:this.tweenParams.transformOriginTarget.duration,ease:this.tweenParams.transformOriginTarget.ease,onStart:()=>{I.isPageTransitioning=!0,D.to(this.$headerMenu,{opacity:0,duration:this.tweenParams.headerMenu.duration,ease:this.tweenParams.headerMenu.ease}),D.to(this.$headerClose,{opacity:1,duration:this.tweenParams.headerClose.duration,ease:this.tweenParams.headerClose.ease})}}),I.navWebgl.meshManager&&I.navWebgl.meshManager.meshesItems.forEach(t=>{t.forEach(i=>{i.inViewAnimation()})}),this.$navElements.forEach(t=>{D.to(t,{opacity:1,duration:this.tweenParams.subLinkText.duration,delay:I.detection.pcLayout?parseFloat(t.dataset.pcAnimationDelay??"0"):parseFloat(t.dataset.spAnimationDelay??"0"),ease:this.tweenParams.subLinkText.ease.none}),D.to(t,{x:"0%",duration:this.tweenParams.subLinkText.duration,delay:I.detection.pcLayout?parseFloat(t.dataset.pcAnimationDelay??"0"):parseFloat(t.dataset.spAnimationDelay??"0"),ease:this.tweenParams.subLinkText.ease.out,force3D:!0})}),this.$navLinkCircles.forEach(t=>{D.to(t,{scale:1,duration:this.tweenParams.linkCircle.duration,delay:I.detection.pcLayout?parseFloat(t.dataset.pcAnimationDelay??"0"):parseFloat(t.dataset.spAnimationDelay??"0"),ease:this.tweenParams.linkCircle.ease})}),D.to(this.$navSubLinkLine,{"--scale-value":1,duration:this.tweenParams.subLinkLine.duration,delay:this.tweenParams.subLinkLine.delay,ease:this.tweenParams.subLinkLine.ease}),D.to(this.$nav,{autoAlpha:1,duration:this.tweenParams.nav.duration,delay:this.tweenParams.transformOriginTarget.duration,ease:this.tweenParams.nav.ease,onComplete:()=>{this.isAnimating=!1,I.isPageTransitioning=!1,D.set("[data-content]",{clearProps:"all"}),I.detection.touchDevice||this.setFocusToFirstNode()}})})}closeAnimation(){I.smoothScroll.lenis&&I.smoothScroll.lenis.start(),this.activeElement&&typeof this.activeElement.focus=="function"&&this.activeElement.focus(),window.requestAnimationFrame(()=>{this.killTweens(),D.to(this.$nav,{autoAlpha:0,duration:this.tweenParams.nav.duration,ease:this.tweenParams.nav.ease,onStart:()=>{D.to(this.$headerMenu,{opacity:1,duration:this.tweenParams.headerMenu.duration,ease:this.tweenParams.headerMenu.ease}),D.to(this.$headerClose,{opacity:0,duration:this.tweenParams.headerClose.duration,ease:this.tweenParams.headerClose.ease})},onComplete:()=>{I.navWebgl.meshManager&&I.navWebgl.meshManager.meshesItems.forEach(e=>{e.forEach(t=>{t.outViewAnimation()})}),this.$navElements.forEach(e=>{D.set(e,{opacity:0,x:I.detection.pcLayout?"1.25vw":"5.223880597vw",force3D:!0})}),this.$navLinkCircles.forEach(e=>{D.set(e,{scale:0})}),D.set(this.$navSubLinkLine,{"--scale-value":0}),this.$navTrigger&&this.$nav&&this.$navContents&&(this.$navContents.scrollTop=0,this.$nav.setAttribute("aria-hidden","true"),this.$navTrigger.setAttribute("aria-expanded","false")),window.requestAnimationFrame(()=>{I.navWebgl.meshManager&&I.navWebgl.stopRenderLoop(),this.isAnimating=!1})}})})}killTweens(){this.$navElements.forEach(e=>{D.killTweensOf(e)}),this.$navLinkCircles.forEach(e=>{D.killTweensOf(e)}),D.killTweensOf(this.$navSubLinkLine),D.killTweensOf(this.$nav)}bindFocus(e){let t=this.getFocusableNodes();if(t.length!==0&&(t=t.filter(i=>i instanceof HTMLElement&&i.offsetParent!==null),!(!this.$nav||!(document.activeElement instanceof HTMLElement))))if(!this.$nav.contains(document.activeElement))t[0]instanceof HTMLElement&&t[0].focus();else{const i=t.indexOf(document.activeElement);if(e.shiftKey&&i===0){const s=t[t.length-1];s instanceof HTMLElement&&s.focus(),e.preventDefault()}!e.shiftKey&&t.length>0&&i===t.length-1&&(t[0]instanceof HTMLElement&&t[0].focus(),e.preventDefault())}}}class pP{selectorNames;tweenParams;$targets;infoList;root;constructor(e={}){this.selectorNames={target:'[data-nav-link-hover="target"]',line:'[data-nav-link-hover="line"]'},this.tweenParams={line:{duration:.7,ease:"quart.out"}},this.$targets=[],this.infoList=[],this.root=document,Object.assign(this,e)}init(){this.setSelector(),this.setInfoList(),this.addEventListeners()}destroy(){this.infoList.forEach((e,t)=>{this.mouseLeaveAnimation(t)})}setSelector(){this.$targets=Array.from(this.root.querySelectorAll(this.selectorNames.target))}setInfoList(){this.$targets.forEach((e,t)=>{const i=e.querySelector(this.selectorNames.line);if(!i)return;const s={$target:e,$line:i,isHover:!1,isAnimating:!1,onMouseEnter:()=>{this.onMouseEnter(t)},onMouseLeave:()=>{this.onMouseLeave(t)}};this.infoList[t]=s,this.setStyle(s)})}setStyle(e){D.set(e.$line,{scaleX:0,transformOrigin:"left"})}addEventListeners(){this.infoList.forEach(e=>{e.$target.addEventListener("mouseenter",e.onMouseEnter),e.$target.addEventListener("mouseleave",e.onMouseLeave)})}removeEventListeners(){this.infoList.forEach(e=>{e.$target.removeEventListener("mouseenter",e.onMouseEnter),e.$target.removeEventListener("mouseleave",e.onMouseLeave)})}onMouseEnter=e=>{I.isPageTransitioning||this.mouseEnterAnimation(e)};onMouseLeave=e=>{I.isPageTransitioning||this.mouseLeaveAnimation(e)};mouseEnterAnimation(e){const t=this.infoList[e];window.requestAnimationFrame(()=>{this.killTweens(t),D.to(t.$line,{scaleX:1,duration:this.tweenParams.line.duration,ease:this.tweenParams.line.ease})})}mouseLeaveAnimation(e){const t=this.infoList[e];window.requestAnimationFrame(()=>{this.killTweens(t),D.to(t.$line,{scaleX:0,duration:this.tweenParams.line.duration,ease:this.tweenParams.line.ease})})}killTweens(e){D.killTweensOf(e.$line)}}class mP{selectorNames;tweenParams;$targets;infoList;constructor(){this.selectorNames={target:'[data-open-trigger-hover="target"]',circle:'[data-open-trigger-hover="circle"]',text:'[data-open-trigger-hover="text"]',line:'[data-open-trigger-hover="line"]'},this.tweenParams={circle:{duration:{opacity:.35,y:.7},ease:{opacity:"none",y:"quart.out"}},text:{duration:.7,delay:.07,ease:"quart.out"},line:{duration:.7,ease:"quart.out"}},this.$targets=[],this.infoList=[]}init(){this.setSelector(),this.setInfoList(),this.addEventListeners()}destroy(){this.infoList.forEach(e=>{this.killTweens(e)}),this.removeEventListeners()}setSelector(){this.$targets=Array.from(document.querySelectorAll(this.selectorNames.target))}setInfoList(){this.$targets.forEach((e,t)=>{const i=e.querySelectorAll(this.selectorNames.circle),s=e.querySelectorAll(this.selectorNames.text),r=e.querySelector(this.selectorNames.line),a=i[0],o=i[1],l=s[0],c=s[1];if(!a||!o||!l||!c||!r)return;const h={$target:e,$circleBefore:a,$circleAfter:o,$textBefore:l,$textAfter:c,$line:r,isHover:!1,isAnimating:!1,onMouseEnter:()=>{this.onMouseEnter(t)},onMouseLeave:()=>{this.onMouseLeave(t)}};this.infoList[t]=h,this.setStyle(h)})}setStyle(e){D.set(e.$circleBefore,{opacity:1,y:"0%",force3D:!0}),D.set(e.$circleAfter,{opacity:0,y:"-300%",force3D:!0}),D.set(e.$textBefore,{y:"0%",force3D:!0}),D.set(e.$textAfter,{y:"130%",force3D:!0}),D.set(e.$line,{scaleX:0,transformOrigin:"left"})}addEventListeners(){this.infoList.forEach(e=>{e.$target.addEventListener("mouseenter",e.onMouseEnter),e.$target.addEventListener("mouseleave",e.onMouseLeave)})}removeEventListeners(){this.infoList.forEach(e=>{e.$target.removeEventListener("mouseenter",e.onMouseEnter),e.$target.removeEventListener("mouseleave",e.onMouseLeave)})}onMouseEnter=e=>{this.mouseEnterAnimation(e)};onMouseLeave=e=>{this.mouseLeaveAnimation(e)};mouseEnterAnimation(e){const t=this.infoList[e];window.requestAnimationFrame(()=>{this.killTweens(t),D.to(t.$circleBefore,{opacity:0,duration:this.tweenParams.circle.duration.opacity,ease:this.tweenParams.circle.ease.opacity}),D.to(t.$circleBefore,{y:"300%",duration:this.tweenParams.circle.duration.y,ease:this.tweenParams.circle.ease.y,force3D:!0}),D.to(t.$circleAfter,{opacity:1,duration:this.tweenParams.circle.duration.opacity,ease:this.tweenParams.circle.ease.opacity}),D.to(t.$circleAfter,{y:"0%",duration:this.tweenParams.circle.duration.y,ease:this.tweenParams.circle.ease.y,force3D:!0}),D.to(t.$textBefore,{y:"-110%",duration:this.tweenParams.text.duration,ease:this.tweenParams.text.ease,force3D:!0}),D.to(t.$textAfter,{y:"0%",duration:this.tweenParams.text.duration,ease:this.tweenParams.text.ease,force3D:!0}),D.to(t.$line,{scaleX:1,duration:this.tweenParams.line.duration,ease:this.tweenParams.line.ease})})}mouseLeaveAnimation(e){const t=this.infoList[e];window.requestAnimationFrame(()=>{this.killTweens(t),D.to(t.$circleBefore,{opacity:1,duration:this.tweenParams.circle.duration.opacity,ease:this.tweenParams.circle.ease.opacity}),D.to(t.$circleBefore,{y:"0%",duration:this.tweenParams.circle.duration.y,ease:this.tweenParams.circle.ease.y,force3D:!0}),D.to(t.$circleAfter,{opacity:0,duration:this.tweenParams.circle.duration.opacity,ease:this.tweenParams.circle.ease.opacity}),D.to(t.$circleAfter,{y:"-300%",duration:this.tweenParams.circle.duration.y,ease:this.tweenParams.circle.ease.y,force3D:!0}),D.to(t.$textBefore,{y:"0%",duration:this.tweenParams.text.duration,ease:this.tweenParams.text.ease,force3D:!0}),D.to(t.$textAfter,{y:"130%",duration:this.tweenParams.text.duration,ease:this.tweenParams.text.ease,force3D:!0}),D.to(t.$line,{scaleX:0,duration:this.tweenParams.line.duration,ease:this.tweenParams.line.ease})})}killTweens(e){D.killTweensOf(e.$circleBefore),D.killTweensOf(e.$circleAfter),D.killTweensOf(e.$textBefore),D.killTweensOf(e.$textAfter),D.killTweensOf(e.$line)}}class Zd{selectorNames;$targets;constructor(){this.selectorNames={target:'a[href*="#"]'},this.$targets=[]}init(){this.setSelector(),this.addEventListeners()}destroy(){this.removeEventListeners()}setSelector(){this.$targets=Array.from(document.querySelectorAll(this.selectorNames.target))}addEventListeners(){this.$targets.forEach(e=>{e.addEventListener("click",this.onClick)})}removeEventListeners(){this.$targets.forEach(e=>{e.removeEventListener("click",this.onClick)})}onClick=e=>{const t=e.currentTarget;e.preventDefault();const i=t.getAttribute("href");if(!i)return;const r=new URL(i,window.location.href).hash;this.scrollToAnchor(r)};scrollToAnchor(e){I.smoothScroll.lenis&&I.smoothScroll.lenis.scrollTo(e)}}class rc{selectorNames;$targets;root;$targetItem;clone;constructor(e={}){this.selectorNames={target:'[data-clone-element="target"]',item:'[data-clone-element="item"]',svg:"svg"},this.$targets=[],this.root=document,this.$targetItem=null,this.clone=null,Object.assign(this,e)}init(){this.setSelector(),this.appendClone()}destroy(){this.removeClone()}setSelector(){this.$targets=Array.from(this.root.querySelectorAll(this.selectorNames.target))}appendClone(){this.$targets.forEach(e=>{if(this.$targetItem=e.querySelector(this.selectorNames.item),this.$targetItem){this.clone=this.$targetItem.cloneNode(!0);const t=Array.from(this.clone.childNodes).some(s=>s.nodeType===Node.TEXT_NODE),i=this.clone.querySelector(this.selectorNames.svg);t&&!i&&this.clone.setAttribute("aria-hidden","true"),e.appendChild(this.clone)}})}removeClone(){this.$targets.forEach(e=>{this.$targetItem=e.lastElementChild,this.$targetItem&&e.removeChild(this.$targetItem)})}}class Jd{list;promiseList;constructor(){this.list=[],this.promiseList=[]}static wait(e=0){return new Promise(t=>{D.delayedCall(e,t)})}add(e=()=>{}){this.list.push(async()=>{const t=new Promise(i=>{e(i)});this.promiseList.push(t),await t})}done(e=()=>{}){this.list.reduce((t,i)=>t.then(i),Promise.resolve()).then(()=>{Promise.all(this.promiseList).then(e)})}}D.registerPlugin(Ai);class gP{pageLifecycleManager;constructor(){this.pageLifecycleManager=hP;const e=new Jd,t={loader:"[data-loader]",loaderText:'[data-loader="text"]',loaderNumber:'[data-loader="number"]',header:"[data-header]",aside:"[data-aside]"},i={progressEase:{duration:3,ease:"expo.inOut"},loader:{duration:3,ease:"cubic.inOut"},chars:{duration:1.1,stagger:.055,ease:"none"},header:{duration:2,delay:1,ease:{none:"none",cubicOut:"cubic.out"}},aside:{duration:2,delay:1,ease:{none:"none",cubicOut:"cubic.out"}}},s={value:0},r=document.querySelector(t.loader),a=r.querySelector(t.loaderText),o=r.querySelector(t.loaderNumber),l=document.querySelector(t.header),c=document.querySelector(t.aside),h=Ai.create(a,{aria:"hidden",autoSplit:!0,charsClass:"char",tag:"span",type:"chars",reduceWhiteSpace:!1,onSplit:()=>{D.set(a,{opacity:1})}});D.set(h.chars,{opacity:0}),D.set(l,{opacity:0,scale:1.05}),D.set(c,{opacity:0,scale:1.05}),D.to(h.chars,{opacity:1,duration:i.chars.duration,stagger:i.chars.stagger,ease:i.chars.ease}),this.loaderProgress=new qd;const u=async()=>{await new Promise(f=>{q1.load({custom:{families:["Satoshi"],urls:["/assets/font/font.css","https://fonts.googleapis.com/css2?family=Cinzel&family=Playfair+Display&family=Shippori+Mincho&display=swap"]},active:()=>{f()},inactive:f,timeout:3e3})})};this.loaderProgress.add(u),this.imageLoader=new Wd({root:document.documentElement}),e.add(f=>{I.smoothScroll.stop(),I.windowEvent.disableEvent(),this.pageBeforeEnter(),this.imageLoader.init(),this.imageLoader.imagesList.forEach(d=>{this.loaderProgress.add(this.imageLoader.load.bind(this.imageLoader,d,()=>{}))}),f()}),e.add(f=>{const d=()=>{o.innerHTML=Math.floor(s.value*100)};this.loaderProgress.init({onUpdateProgressAnimation:(_,m)=>{D.killTweensOf(s.value),_!==1?D.to(s,{value:_,duration:i.progressEase.duration,ease:i.progressEase.ease,onUpdate:d}):window.requestAnimationFrame(()=>{D.to(s,{value:1,duration:i.progressEase.duration,ease:i.progressEase.ease,onUpdate:d,onComplete:()=>{window.requestAnimationFrame(()=>{D.to(l,{opacity:1,duration:i.header.duration,delay:i.header.delay,ease:i.header.ease.none}),D.to(l,{scale:1,duration:i.header.duration,delay:i.header.delay,ease:i.header.ease.cubicOut}),D.to(c,{opacity:1,duration:i.aside.duration,delay:i.aside.delay,ease:i.aside.ease.none}),D.to(c,{scale:1,duration:i.aside.duration,delay:i.aside.delay,ease:i.aside.ease.cubicOut}),this.once(),this.pageEnter(),I.webgl.startRenderLoop(),D.killTweensOf(o),o.innerHTML="100",m()})}})})},onCompleteProgressAnimation:()=>{D.to(r,{opacity:0,duration:i.loader.duration,ease:i.loader.ease,onComplete:()=>{window.requestAnimationFrame(()=>{const _=r.parentNode;_&&_.removeChild(r),f()})}})}}),this.loaderProgress.set(),this.loaderProgress.run()}),e.done(()=>{window.requestAnimationFrame(()=>{this.pageAfterEnter(),Rd(),I.windowEvent.enableEvent(),I.smoothScroll.start(),I.isStartup=!1})}),this.selectorNames={globalElement:"[data-global-element]",main:"[data-main]",transition:"[data-transition]",swup:"#swup"},this.tweenParams={duration:.8,ease:"cubic.out"},this.$globalElements=document.querySelectorAll(this.selectorNames.globalElement),I.detection.touchDevice||(this.gCloneElementList=[],this.gButtonHoverList=[],this.gLinkHoverList=[],this.$globalElements.forEach((f,d)=>{this.gCloneElementList[d]=new rc({root:f}),this.gButtonHoverList[d]=new So({root:f}),this.gLinkHoverList[d]=new jd({root:f})}),this.$projectsCloneElement=new rc({root:document.querySelector(this.selectorNames.main)}),this.$projectsButtonHover=new So({root:document.querySelector(this.selectorNames.main)})),this.gButtonInViewAnimationList=[],this.$globalElements.forEach((f,d)=>{this.gButtonInViewAnimationList[d]=new Oi({root:f})}),this.aside=new uP,this.clock=new fP,this.nav=new dP,I.detection.touchDevice||(this.navLinkHover=new pP,this.openTriggerHover=new mP),!I.isContact&&!I.is404&&(this.nextPageLink=new Xd),I.is404||(this.languageSwitcher=new Yd,this.currentLink=new Kd,this.scrollToAnchor=new Zd),this.swup=null,this.$transition=document.querySelector(this.selectorNames.transition)}init(){this.initSwup()}initSwup(){this.swup=new I1({animateHistoryBrowsing:!0,plugins:[new N1({gaMeasurementId:"G-2SL94CX264"}),new F1({animations:[{from:"(.*)",to:"(.*)",out:e=>{I.isPageTransitioning=!0,D.to(this.$transition,{opacity:1,duration:this.tweenParams.duration,ease:this.tweenParams.ease,onStart:()=>{this.pageBeforeLeave(),Jg(),I.smoothScroll.stop(),I.webgl.stopRenderLoop(),I.windowEvent.disableEvent()},onComplete:()=>{this.pageLeave(),this.aside.destroy(),this.clock.destroy(),this.nav.destroy(),this.navLinkHover&&this.navLinkHover.destroy(),this.currentLink&&this.currentLink.destroy(),this.gButtonInViewAnimationList.forEach(t=>{t.destroy()}),I.detection.touchDevice||(this.gButtonHoverList.forEach(t=>{t.destroy()}),this.gLinkHoverList.forEach(t=>{t.destroy()}),this.$projectsButtonHover.destroy(),this.$projectsCloneElement.destroy()),this.pageAfterLeave(),I.isPageTransitioning=!1,e()}})},in:e=>{const t=new Jd;this.loaderProgress=new qd,this.imageLoader=new Wd({root:document.querySelector(this.selectorNames.swup)}),t.add(i=>{this.imageLoader.init(),this.imageLoader.imagesList.forEach(s=>{this.loaderProgress.add(this.imageLoader.load.bind(this.imageLoader,s,()=>{}))}),this.pageBeforeEnter(),i()}),t.add(i=>{this.loaderProgress.init({onUpdateProgressAnimation:(s,r)=>{s===1&&window.requestAnimationFrame(()=>{r()})},onCompleteProgressAnimation:()=>{window.requestAnimationFrame(()=>{I.isContact=!!document.querySelector(I.pageNames.contact),I.is404=!!document.querySelector(I.pageNames.notFound),!I.isContact&&!I.is404?this.nextPageLink=new Xd:this.nextPageLink=null,I.is404?(this.languageSwitcher=null,this.currentLink=null,this.scrollToAnchor=null):(this.languageSwitcher=new Yd,this.currentLink=new Kd,this.scrollToAnchor=new Zd),this.nextPageLink&&this.nextPageLink.init(),this.languageSwitcher&&this.languageSwitcher.init(),this.currentLink&&this.currentLink.init(),this.scrollToAnchor&&this.scrollToAnchor.init(),this.$globalElements=document.querySelectorAll(this.selectorNames.globalElement),I.detection.touchDevice||(this.$globalElements.forEach((s,r)=>{this.gButtonHoverList[r]=new So({root:s}),this.gLinkHoverList[r]=new jd({root:s})}),this.$projectsCloneElement=new rc({root:document.querySelector(this.selectorNames.main)}),this.$projectsButtonHover=new So({root:document.querySelector(this.selectorNames.main)}),this.gButtonHoverList.forEach(s=>{s.init()}),this.gLinkHoverList.forEach(s=>{s.init()}),this.$projectsCloneElement.init(),this.$projectsButtonHover.init()),this.$globalElements.forEach((s,r)=>{this.gButtonInViewAnimationList[r]=new Oi({root:s})}),this.gButtonInViewAnimationList.forEach(s=>{s.init()}),this.aside.init(),this.clock.init(),this.pageEnter(),I.webgl.startRenderLoop(),D.delayedCall(.5,()=>{i()})})}}),this.loaderProgress.set(),this.loaderProgress.run()}),t.done(()=>{D.to(this.$transition,{opacity:0,duration:this.tweenParams.duration,ease:this.tweenParams.ease,onComplete:()=>{I.smoothScroll.start(),I.windowEvent.enableEvent(),Rd(),e()}})})}}]})]}),this.swup.hooks.on("page:view",()=>{window.Alpine&&window.Alpine.initTree(document.body)})}once(){this.nextPageLink&&this.nextPageLink.init(),this.languageSwitcher&&this.languageSwitcher.init(),this.currentLink&&this.currentLink.init(),this.scrollToAnchor&&this.scrollToAnchor.init(),I.detection.touchDevice||(this.gCloneElementList.forEach(e=>{e.init()}),this.gButtonHoverList.forEach(e=>{e.init()}),this.gLinkHoverList.forEach(e=>{e.init()}),this.navLinkHover&&this.navLinkHover.init(),this.openTriggerHover&&this.openTriggerHover.init(),this.$projectsCloneElement.init(),this.$projectsButtonHover.init()),this.gButtonInViewAnimationList.forEach(e=>{e.init()}),this.aside.init(),this.clock.init(),this.nav.init(),I.navWebgl.enter()}pageBeforeEnter=()=>{this.pageLifecycleManager.beforeEnter()};pageEnter=()=>{this.pageLifecycleManager.enter()};pageAfterEnter=()=>{this.pageLifecycleManager.afterEnter()};pageBeforeLeave=()=>{this.pageLifecycleManager.beforeLeave()};pageLeave=()=>{this.pageLifecycleManager.leave()};pageAfterLeave=()=>{this.pageLifecycleManager.afterLeave()}}const _P=new gP,vP={lang:void 0,message:void 0,abortEarly:void 0,abortPipeEarly:void 0};function c_(n){return vP}let xP;function SP(n){return xP?.get(n)}let yP;function wP(n){return yP?.get(n)}let MP;function bP(n,e){return MP?.get(n)?.get(e)}function EP(n){const e=typeof n;return e==="string"?`"${n}"`:e==="number"||e==="bigint"||e==="boolean"?`${n}`:e==="object"||e==="function"?(n&&Object.getPrototypeOf(n)?.constructor?.name)??"null":e}function La(n,e,t,i,s){const r=s&&"input"in s?s.input:t.value,a=s?.expected??n.expects??null,o=s?.received??EP(r),l={kind:n.kind,type:n.type,input:r,expected:a,received:o,message:`Invalid ${e}: ${a?`Expected ${a} but r`:"R"}eceived ${o}`,requirement:n.requirement,path:s?.path,issues:s?.issues,lang:i.lang,abortEarly:i.abortEarly,abortPipeEarly:i.abortPipeEarly},c=n.kind==="schema",h=s?.message??n.message??bP(n.reference,l.lang)??(c?wP(l.lang):null)??i.message??SP(l.lang);h!==void 0&&(l.message=typeof h=="function"?h(l):h),c&&(t.typed=!1),t.issues?t.issues.push(l):t.issues=[l]}const Qd=new WeakMap;function ol(n){let e=Qd.get(n);return e||(e={version:1,vendor:"valibot",validate(t){return n["~run"]({value:t},c_())}},Qd.set(n,e)),e}const TP=/^[\w+-]+(?:\.[\w+-]+)*@[\da-z]+(?:[.-][\da-z]+)*\.[a-z]{2,}$/iu;function h_(n){return{kind:"validation",type:"email",reference:h_,expects:null,async:!1,requirement:TP,message:n,"~run"(e,t){return e.typed&&!this.requirement.test(e.value)&&La(this,"email",e,t),e}}}function ta(n){return{kind:"validation",type:"non_empty",reference:ta,async:!1,expects:"!0",message:n,"~run"(e,t){return e.typed&&e.value.length===0&&La(this,"length",e,t,{received:"0"}),e}}}function ts(){return{kind:"transformation",type:"trim",reference:ts,async:!1,"~run"(n){return n.value=n.value.trim(),n}}}function AP(n,e,t){return typeof n.fallback=="function"?n.fallback(e,t):n.fallback}function u_(n,e,t){return typeof n.default=="function"?n.default(e,t):n.default}function f_(n,e){return{kind:"schema",type:"object",reference:f_,expects:"Object",async:!1,entries:n,message:e,get"~standard"(){return ol(this)},"~run"(t,i){const s=t.value;if(s&&typeof s=="object"){t.typed=!0,t.value={};for(const r in this.entries){const a=this.entries[r];if(r in s||(a.type==="exact_optional"||a.type==="optional"||a.type==="nullish")&&a.default!==void 0){const o=r in s?s[r]:u_(a),l=a["~run"]({value:o},i);if(l.issues){const c={type:"object",origin:"value",input:s,key:r,value:o};for(const h of l.issues)h.path?h.path.unshift(c):h.path=[c],t.issues?.push(h);if(t.issues||(t.issues=l.issues),i.abortEarly){t.typed=!1;break}}l.typed||(t.typed=!1),t.value[r]=l.value}else if(a.fallback!==void 0)t.value[r]=AP(a);else if(a.type!=="exact_optional"&&a.type!=="optional"&&a.type!=="nullish"&&(La(this,"key",t,i,{input:void 0,expected:`"${r}"`,path:[{type:"object",origin:"key",input:s,key:r,value:s[r]}]}),i.abortEarly))break}}else La(this,"type",t,i);return t}}}function Nh(n,e){return{kind:"schema",type:"optional",reference:Nh,expects:`(${n.expects} | undefined)`,async:!1,wrapped:n,default:e,get"~standard"(){return ol(this)},"~run"(t,i){return t.value===void 0&&(this.default!==void 0&&(t.value=u_(this,t,i)),t.value===void 0)?(t.typed=!0,t):this.wrapped["~run"](t,i)}}}function is(n){return{kind:"schema",type:"string",reference:is,expects:"string",async:!1,message:n,get"~standard"(){return ol(this)},"~run"(e,t){return typeof e.value=="string"?e.typed=!0:La(this,"type",e,t),e}}}function sr(...n){return{...n[0],pipe:n,get"~standard"(){return ol(this)},"~run"(e,t){for(const i of n)if(i.kind!=="metadata"){if(e.issues&&(i.kind==="schema"||i.kind==="transformation")){e.typed=!1;break}(!e.issues||!t.abortEarly&&!t.abortPipeEarly)&&(e=i["~run"](e,t))}return e}}}function d_(n,e,t){const i=n["~run"]({value:e},c_());return{typed:i.typed,success:!i.issues,output:i.value,issues:i.issues}}const p_=f_({message:sr(is(),ts(),ta("required")),company:Nh(sr(is(),ts()),""),address:Nh(sr(is(),ts()),""),name:sr(is(),ts(),ta("required")),email:sr(is(),ts(),ta("required"),h_("invalid")),request:sr(is(),ts(),ta("required"))}),PP=p_.entries;function CP(n,e){const t=PP[n];if(!t)return null;const i=d_(t,e);return i.success?null:i.issues[0]?.message??"invalid"}function RP(n){const e=d_(p_,n);if(e.success)return{};const t={};for(const i of e.issues){const r=i.path?.[0]?.key;typeof r=="string"&&!t[r]&&(t[r]=i.message)}return t}const LP=["message","company","address","name","email","request"],IP="/api/contact.php",DP=()=>({mode:"idle",errors:{},submitError:"",init(){},onBlur(n,e){const t=e.target,i=CP(n,t?.value??"");i?this.errors[n]=i:delete this.errors[n]},onInput(n,e){this.errors[n]&&this.onBlur(n,e)},async onSubmit(n){const e=n.target,t=location.pathname.startsWith("/ja/")?"ja":"en",i={};for(const r of LP){const a=e.elements.namedItem(r);i[r]=a?.value??""}if(t==="en"&&!i.request&&(i.request=i.message),this.errors=RP(i),Object.keys(this.errors).length>0)return;this.mode="submitting",this.submitError="";const s=new URLSearchParams({...i,lang:t});try{const r=await fetch(IP,{method:"POST",body:s}),a=await r.json().catch(()=>({}));if(!r.ok||!a.success){this.mode="error";const c=Array.isArray(a.errors)?a.errors:["failed"];this.submitError=c.join(", ");return}const o=t==="ja"?"/ja/contact/thanks/":"/contact/thanks/",l=window.APP?.asynchronous?.swup;l?.navigate?l.navigate(o):location.href=o}catch{this.mode="error",this.submitError="network error"}}});window.Alpine=su;su.data("contactForm",DP);su.start();window.APP=new JA(_P);window.APP.init();
