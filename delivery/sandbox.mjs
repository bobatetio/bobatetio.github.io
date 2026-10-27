/* Sandbox stand-ins for Google Drive, Dropbox, OneDrive and Box.

   Each answers at <base>/<real host>/<real path>, the way providers.mjs rewrites
   its URLs when UKD_PROVIDER_BASE is set, and holds the client to the same rules
   the real service does: a valid bearer token on every API call, one-time OAuth
   codes, rotating Box refresh tokens, resumable and chunked uploads with ranges,
   Box's SHA-1 digests, and name clashes. Delivered files are real files, under
   delivery/sandbox-drives/<provider>/, so you can open them in Finder.

   Test hooks (sandbox only):
     POST /__sandbox/expire?p=gdrive          every access token stops working
     POST /__sandbox/fail?p=gdrive&n=2&status=503   the next n API calls fail
     POST /__sandbox/reset                    forget everything, empty the drives */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = process.env.UKD_SANDBOX_DIR || path.join(HERE, 'sandbox-drives');
const NAMES = { gdrive: 'Google Drive', dropbox: 'Dropbox', onedrive: 'OneDrive', box: 'Box' };
const ASSETS = (process.env.UKD_ASSETS || 'http://localhost:4399').replace(/\/$/, '');
const rand = () => crypto.randomBytes(9).toString('hex');

let S;
function reset() {
  S = { codes: new Map(), access: new Map(), refresh: new Map(), fail: {}, folders: new Map(), sessions: new Map() };
  for (const k of Object.keys(NAMES)) {
    fs.mkdirSync(path.join(ROOT, NAMES[k]), { recursive: true });
    S.folders.set(k + ':root', { k, rel: '' });
  }
}
reset();

const dir = (k, rel) => path.join(ROOT, NAMES[k], rel);
function folderId(k, rel) {
  for (const [id, f] of S.folders) if (f.k === k && f.rel === rel) return id.includes(':root') ? (k === 'box' ? '0' : 'root') : id;
  const id = k[0] + rand(); S.folders.set(id, { k, rel }); return id;
}
function folderRel(k, id) {
  if (id === 'root' || id === '0') return '';
  const f = S.folders.get(id); return f && f.k === k ? f.rel : null;
}
function uniqueName(k, rel, name) {
  let n = name, i = 1;
  while (fs.existsSync(path.join(dir(k, rel), n))) { i++; n = name.replace(/(\.[^.]*)?$/, ` (${i})$1`); }
  return n;
}
function writeFile(k, rel, name, buf, rename) {
  fs.mkdirSync(dir(k, rel), { recursive: true });
  const n = rename ? uniqueName(k, rel, name) : name;
  fs.writeFileSync(path.join(dir(k, rel), n), buf);
  return { id: k[0] + 'f' + rand(), name: n, rel: rel ? rel + '/' + n : n };
}

/* ---------- tokens ---------- */
function issue(k) {
  const access = k + '-acc-' + rand(), refresh = k + '-ref-' + rand();
  S.access.set(access, k); S.refresh.set(refresh, k);
  return { access_token: access, refresh_token: refresh, expires_in: 3600, token_type: 'bearer' };
}
function authed(req, k) {
  const t = (req.headers.authorization || '').replace(/^Bearer /, '');
  return S.access.get(t) === k;
}

/* ---------- helpers ---------- */
const read = (req) => new Promise((ok) => { const c = []; req.on('data', (d) => c.push(d)); req.on('end', () => ok(Buffer.concat(c))); });
const send = (res, code, obj, head = {}) => { res.writeHead(code, Object.assign({ 'Content-Type': 'application/json' }, head)); res.end(obj === undefined ? '' : JSON.stringify(obj)); };
const form = (buf) => Object.fromEntries(new URLSearchParams(buf.toString()));
function multipart(buf, type) {
  const b = '--' + type.split('boundary=')[1], out = {};
  let i = buf.indexOf(b);
  while (i > -1) {
    const next = buf.indexOf(b, i + b.length);
    if (next < 0) break;
    const part = buf.subarray(i + b.length + 2, next - 2), sep = part.indexOf('\r\n\r\n');
    const head = part.subarray(0, sep).toString(), name = (head.match(/name="([^"]+)"/) || [])[1];
    const fname = (head.match(/filename="([^"]*)"/) || [])[1];
    out[name] = fname !== undefined ? { filename: fname, data: part.subarray(sep + 4) } : part.subarray(sep + 4).toString();
    i = next;
  }
  return out;
}

function consentPage(k, q) {
  const allow = `/__approve?p=${k}&redirect_uri=${encodeURIComponent(q.get('redirect_uri'))}&state=${encodeURIComponent(q.get('state') || '')}`;
  return `<!doctype html><html><head><meta charset="utf-8"><title>${NAMES[k]} sign-in (sandbox)</title><meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f5f3ef;font:15px/1.5 -apple-system,Segoe UI,Lato,sans-serif;color:#102e37}
.c{width:min(420px,calc(100% - 32px));background:#fff;border:1px solid rgba(16,46,55,.12);border-radius:20px;padding:28px;box-shadow:0 20px 50px -20px rgba(16,46,55,.25)}
.s{display:inline-block;padding:4px 9px;border-radius:99px;background:#fbeed2;color:#8a6414;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
.l{display:flex;align-items:center;gap:12px;margin:18px 0 14px}.l img{width:44px;height:44px;border-radius:22.5%}
h1{font-size:20px;margin:0}p{color:#5f6367;margin:6px 0 0}ul{padding-left:18px;color:#5f6367}
.a{display:flex;gap:10px;margin-top:22px}.a a{flex:1;text-align:center;padding:12px;border-radius:12px;text-decoration:none;font-weight:700}
.y{background:#102e37;color:#fff}.n{border:1px solid rgba(16,46,55,.2);color:#102e37}</style></head>
<body><div class="c"><span class="s">Sandbox</span>
<div class="l"><img src="${ASSETS}/assets/img/uk/drives/${k}.png" alt=""><h1>Allow Ukreate to use ${NAMES[k]}?</h1></div>
<p>This stands in for ${NAMES[k]}'s own sign-in while Ukreate has no ${NAMES[k]} keys. Files land in delivery/sandbox-drives/${NAMES[k]}.</p>
<ul><li>Ukreate can add files and folders it creates</li><li>Ukreate cannot see your other files</li></ul>
<div class="a"><a class="n" href="${allow}&deny=1">Cancel</a><a class="y" href="${allow}">Allow</a></div></div></body></html>`;
}

/* ---------- the router ---------- */
async function route(req, res) {
  const url = new URL(req.url, 'http://x'), p = url.pathname, q = url.searchParams, M = req.method;
  const hit = (m, re) => M === m && re.test(p);

  /* test hooks */
  if (hit('POST', /^\/__sandbox\/expire$/)) { for (const [t, k] of S.access) if (k === q.get('p')) S.access.delete(t); return send(res, 200, { ok: true }); }
  if (hit('POST', /^\/__sandbox\/fail$/)) { S.fail[q.get('p')] = { n: +q.get('n') || 1, status: +q.get('status') || 503 }; return send(res, 200, { ok: true }); }
  if (hit('POST', /^\/__sandbox\/reset$/)) { fs.rmSync(ROOT, { recursive: true, force: true }); reset(); return send(res, 200, { ok: true }); }

  /* consent screens */
  const AUTH = { gdrive: /^\/accounts\.google\.com\/o\/oauth2\/v2\/auth$/, dropbox: /^\/www\.dropbox\.com\/oauth2\/authorize$/,
    onedrive: /^\/login\.microsoftonline\.com\/common\/oauth2\/v2\.0\/authorize$/, box: /^\/account\.box\.com\/api\/oauth2\/authorize$/ };
  for (const k of Object.keys(AUTH)) if (hit('GET', AUTH[k])) { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); return res.end(consentPage(k, q)); }
  if (hit('GET', /^\/__approve$/)) {
    const back = new URL(q.get('redirect_uri'));
    back.searchParams.set('state', q.get('state'));
    if (q.get('deny')) back.searchParams.set('error', 'access_denied');
    else { const code = 'code-' + rand(); S.codes.set(code, q.get('p')); back.searchParams.set('code', code); }
    res.writeHead(302, { Location: back.toString() }); return res.end();
  }

  /* token endpoints */
  const TOKEN = { gdrive: /^\/oauth2\.googleapis\.com\/token$/, dropbox: /^\/api\.dropboxapi\.com\/oauth2\/token$/,
    onedrive: /^\/login\.microsoftonline\.com\/common\/oauth2\/v2\.0\/token$/, box: /^\/api\.box\.com\/oauth2\/token$/ };
  for (const k of Object.keys(TOKEN)) if (hit('POST', TOKEN[k])) {
    const f = form(await read(req));
    if (f.grant_type === 'authorization_code') {
      if (S.codes.get(f.code) !== k) return send(res, 400, { error: 'invalid_grant', error_description: 'unknown or used code' });
      S.codes.delete(f.code); return send(res, 200, issue(k));
    }
    if (f.grant_type === 'refresh_token') {
      if (S.refresh.get(f.refresh_token) !== k) return send(res, 400, { error: 'invalid_grant', error_description: 'bad refresh token' });
      const t = issue(k);
      if (k === 'box') S.refresh.delete(f.refresh_token);           /* Box rotates */
      else { S.refresh.delete(t.refresh_token); delete t.refresh_token; }   /* the others keep theirs */
      return send(res, 200, t);
    }
    return send(res, 400, { error: 'unsupported_grant_type' });
  }
  if (/\/revoke$/.test(p) || /token\/revoke$/.test(p)) return send(res, 200, {});

  /* which provider is this API call for */
  const k = /googleapis\.com/.test(p) ? 'gdrive' : /dropboxapi\.com/.test(p) ? 'dropbox' : /graph\.microsoft\.com|__graphup/.test(p) ? 'onedrive' : /box\.com/.test(p) ? 'box' : null;
  if (!k) return send(res, 404, { error: 'not found' });
  const preAuthed = /__graphup|upload_id=/.test(req.url);   /* pre-authorised session URLs */
  if (!preAuthed && !authed(req, k)) return send(res, 401, { error: { message: 'invalid or expired token' } });
  const f = S.fail[k];
  if (f && f.n > 0) { f.n--; return send(res, f.status, { error: { message: 'sandbox: forced ' + f.status } }); }

  /* ----- Google Drive ----- */
  if (hit('GET', /^\/www\.googleapis\.com\/drive\/v3\/about$/)) return send(res, 200, { user: { emailAddress: 'gm@miragrace-sandbox.test', displayName: 'MiraGrace' } });
  if (hit('GET', /^\/www\.googleapis\.com\/drive\/v3\/files$/)) {
    const qq = q.get('q') || '', name = (qq.match(/name='((?:[^'\\]|\\.)*)'/) || [])[1].replace(/\\(.)/g, '$1'), parent = (qq.match(/'([^']+)' in parents/) || [])[1];
    const rel = folderRel('gdrive', parent), childRel = rel ? rel + '/' + name : name;
    if (rel === null || !fs.existsSync(dir('gdrive', childRel))) return send(res, 200, { files: [] });
    const id = folderId('gdrive', childRel);
    return send(res, 200, { files: [{ id, webViewLink: 'sandbox://Google Drive/' + childRel }] });
  }
  if (hit('POST', /^\/www\.googleapis\.com\/drive\/v3\/files$/)) {
    const b = JSON.parse(await read(req)), rel = folderRel('gdrive', b.parents[0]), childRel = rel ? rel + '/' + b.name : b.name;
    fs.mkdirSync(dir('gdrive', childRel), { recursive: true });
    return send(res, 200, { id: folderId('gdrive', childRel), webViewLink: 'sandbox://Google Drive/' + childRel });
  }
  if (hit('POST', /^\/www\.googleapis\.com\/upload\/drive\/v3\/files$/) && q.get('uploadType') === 'resumable') {
    const b = JSON.parse(await read(req)), sid = rand();
    S.sessions.set(sid, { k: 'gdrive', name: b.name, rel: folderRel('gdrive', b.parents[0]), total: +req.headers['x-upload-content-length'], chunks: [] });
    return send(res, 200, undefined, { Location: `http://${req.headers.host}/www.googleapis.com/upload/drive/v3/files?upload_id=${sid}` });
  }
  if (hit('PUT', /^\/www\.googleapis\.com\/upload\/drive\/v3\/files$/)) {
    const s = S.sessions.get(q.get('upload_id')); if (!s) return send(res, 404, { error: { message: 'no session' } });
    const buf = await read(req), m = (req.headers['content-range'] || '').match(/bytes (\d+)-(\d+)\/(\d+)/);
    const got = s.chunks.reduce((a, c) => a + c.length, 0);
    if (m && +m[1] !== got) return send(res, 400, { error: { message: `range starts at ${m[1]}, expected ${got}` } });
    s.chunks.push(buf);
    const have = got + buf.length;
    if (have < s.total) return send(res, 308, undefined, { Range: `bytes=0-${have - 1}` });
    const w = writeFile('gdrive', s.rel, s.name, Buffer.concat(s.chunks), true); S.sessions.delete(q.get('upload_id'));
    return send(res, 200, { id: w.id, webViewLink: 'sandbox://Google Drive/' + w.rel });
  }

  /* ----- Dropbox ----- */
  const darg = () => JSON.parse(req.headers['dropbox-api-arg'] || '{}');
  if (hit('POST', /^\/api\.dropboxapi\.com\/2\/users\/get_current_account$/)) return send(res, 200, { email: 'gm@miragrace-sandbox.test', name: { display_name: 'MiraGrace' } });
  if (hit('POST', /^\/api\.dropboxapi\.com\/2\/files\/create_folder_v2$/)) {
    const b = JSON.parse(await read(req)), rel = b.path.replace(/^\//, '');
    if (fs.existsSync(dir('dropbox', rel))) return send(res, 409, { error_summary: 'path/conflict/folder/' });
    fs.mkdirSync(dir('dropbox', rel), { recursive: true }); return send(res, 200, { metadata: { path_display: b.path } });
  }
  const dbxWrite = (arg, buf) => {
    const rel = arg.path.replace(/^\//, ''), w = writeFile('dropbox', path.dirname(rel), path.basename(rel), buf, arg.autorename);
    return { id: 'id:' + w.id, path_display: '/' + w.rel };
  };
  if (hit('POST', /^\/content\.dropboxapi\.com\/2\/files\/upload$/)) return send(res, 200, dbxWrite(darg(), await read(req)));
  if (hit('POST', /^\/content\.dropboxapi\.com\/2\/files\/upload_session\/start$/)) { const sid = rand(); S.sessions.set(sid, { chunks: [await read(req)] }); return send(res, 200, { session_id: sid }); }
  if (hit('POST', /^\/content\.dropboxapi\.com\/2\/files\/upload_session\/append_v2$/)) {
    const a = darg(), s = S.sessions.get(a.cursor.session_id), have = s.chunks.reduce((x, c) => x + c.length, 0);
    if (a.cursor.offset !== have) return send(res, 409, { error_summary: 'incorrect_offset/' });
    s.chunks.push(await read(req)); return send(res, 200, null);
  }
  if (hit('POST', /^\/content\.dropboxapi\.com\/2\/files\/upload_session\/finish$/)) {
    const a = darg(), s = S.sessions.get(a.cursor.session_id), have = s.chunks.reduce((x, c) => x + c.length, 0);
    if (a.cursor.offset !== have) return send(res, 409, { error_summary: 'incorrect_offset/' });
    s.chunks.push(await read(req)); S.sessions.delete(a.cursor.session_id);
    return send(res, 200, dbxWrite(a.commit, Buffer.concat(s.chunks)));
  }

  /* ----- OneDrive ----- */
  if (hit('GET', /^\/graph\.microsoft\.com\/v1\.0\/me$/)) return send(res, 200, { mail: 'gm@miragrace-sandbox.test', displayName: 'MiraGrace' });
  let m;
  if (M === 'GET' && (m = p.match(/^\/graph\.microsoft\.com\/v1\.0\/me\/drive\/root:\/(.+)$/))) {
    const rel = decodeURIComponent(m[1]);
    if (!fs.existsSync(dir('onedrive', rel))) return send(res, 404, { error: { code: 'itemNotFound', message: 'not found' } });
    return send(res, 200, { id: folderId('onedrive', rel), webUrl: 'sandbox://OneDrive/' + rel });
  }
  if (M === 'POST' && (m = p.match(/^\/graph\.microsoft\.com\/v1\.0\/me\/drive\/(?:root|items\/([^/]+))\/children$/))) {
    const b = JSON.parse(await read(req)), parent = folderRel('onedrive', m[1] || 'root'), rel = parent ? parent + '/' + b.name : b.name;
    if (fs.existsSync(dir('onedrive', rel))) return send(res, 409, { error: { code: 'nameAlreadyExists', message: 'exists' } });
    fs.mkdirSync(dir('onedrive', rel), { recursive: true }); return send(res, 201, { id: folderId('onedrive', rel), webUrl: 'sandbox://OneDrive/' + rel });
  }
  if (M === 'PUT' && (m = p.match(/^\/graph\.microsoft\.com\/v1\.0\/me\/drive\/items\/([^/]+):\/(.+):\/content$/))) {
    const w = writeFile('onedrive', folderRel('onedrive', m[1]), decodeURIComponent(m[2]), await read(req), true);
    return send(res, 201, { id: w.id, webUrl: 'sandbox://OneDrive/' + w.rel });
  }
  if (M === 'POST' && (m = p.match(/^\/graph\.microsoft\.com\/v1\.0\/me\/drive\/items\/([^/]+):\/(.+):\/createUploadSession$/))) {
    const sid = rand(); S.sessions.set(sid, { rel: folderRel('onedrive', m[1]), name: decodeURIComponent(m[2]), chunks: [] });
    return send(res, 200, { uploadUrl: `http://${req.headers.host}/__graphup/${sid}` });
  }
  if (M === 'PUT' && (m = p.match(/^\/__graphup\/(.+)$/))) {
    const s = S.sessions.get(m[1]), r = (req.headers['content-range'] || '').match(/bytes (\d+)-(\d+)\/(\d+)/);
    const have = s.chunks.reduce((x, c) => x + c.length, 0);
    if (!r || +r[1] !== have) return send(res, 416, { error: { message: 'bad range' } });
    const buf = await read(req);
    if ((+r[2] - +r[1] + 1) !== buf.length) return send(res, 400, { error: { message: 'length does not match range' } });
    s.chunks.push(buf);
    if (+r[2] + 1 < +r[3]) return send(res, 202, { nextExpectedRanges: [`${+r[2] + 1}-`] });
    const w = writeFile('onedrive', s.rel, s.name, Buffer.concat(s.chunks), true); S.sessions.delete(m[1]);
    return send(res, 201, { id: w.id, webUrl: 'sandbox://OneDrive/' + w.rel });
  }

  /* ----- Box ----- */
  if (hit('GET', /^\/api\.box\.com\/2\.0\/users\/me$/)) return send(res, 200, { login: 'gm@miragrace-sandbox.test', name: 'MiraGrace' });
  if (hit('POST', /^\/api\.box\.com\/2\.0\/folders$/)) {
    const b = JSON.parse(await read(req)), parent = folderRel('box', b.parent.id), rel = parent ? parent + '/' + b.name : b.name;
    if (fs.existsSync(dir('box', rel))) return send(res, 409, { code: 'item_name_in_use', context_info: { conflicts: [{ id: folderId('box', rel), type: 'folder' }] } });
    fs.mkdirSync(dir('box', rel), { recursive: true }); return send(res, 201, { id: folderId('box', rel), type: 'folder' });
  }
  if (M === 'GET' && (m = p.match(/^\/api\.box\.com\/2\.0\/folders\/([^/]+)\/items$/))) {
    const rel = folderRel('box', m[1]);
    const entries = fs.readdirSync(dir('box', rel), { withFileTypes: true }).map((d) => ({ type: d.isDirectory() ? 'folder' : 'file', name: d.name, id: d.isDirectory() ? folderId('box', rel ? rel + '/' + d.name : d.name) : 'x' }));
    return send(res, 200, { entries });
  }
  if (hit('POST', /^\/upload\.box\.com\/api\/2\.0\/files\/content$/)) {
    const mp = multipart(await read(req), req.headers['content-type']), a = JSON.parse(mp.attributes), rel = folderRel('box', a.parent.id);
    if (fs.existsSync(path.join(dir('box', rel), a.name))) return send(res, 409, { code: 'item_name_in_use' });
    const w = writeFile('box', rel, a.name, mp.file.data, false); return send(res, 201, { entries: [{ id: w.id, type: 'file' }] });
  }
  if (hit('POST', /^\/upload\.box\.com\/api\/2\.0\/files\/upload_sessions$/)) {
    const b = JSON.parse(await read(req)), sid = rand(), base = `http://${req.headers.host}/upload.box.com/api/2.0/files/upload_sessions/${sid}`;
    const part = +(process.env.UKD_SANDBOX_BOX_PART || 8 * 1024 * 1024);
    S.sessions.set(sid, { rel: folderRel('box', b.folder_id), name: b.file_name, total: b.file_size, parts: [] });
    return send(res, 201, { id: sid, part_size: part, total_parts: Math.ceil(b.file_size / part), session_endpoints: { upload_part: base, commit: base + '/commit' } });
  }
  if (M === 'PUT' && (m = p.match(/^\/upload\.box\.com\/api\/2\.0\/files\/upload_sessions\/([^/]+)$/))) {
    const s = S.sessions.get(m[1]), buf = await read(req), d = crypto.createHash('sha1').update(buf).digest('base64');
    if (req.headers.digest !== 'sha=' + d) return send(res, 412, { code: 'digest_mismatch' });
    const r = req.headers['content-range'].match(/bytes (\d+)-(\d+)\/(\d+)/);
    const part = { part_id: rand().slice(0, 8), offset: +r[1], size: buf.length, sha1: d };
    s.parts.push({ part, buf }); return send(res, 200, { part });
  }
  if (M === 'POST' && (m = p.match(/^\/upload\.box\.com\/api\/2\.0\/files\/upload_sessions\/([^/]+)\/commit$/))) {
    const s = S.sessions.get(m[1]), body = JSON.parse(await read(req));
    const all = Buffer.concat(s.parts.sort((a, b) => a.part.offset - b.part.offset).map((x) => x.buf));
    if (body.parts.length !== s.parts.length || all.length !== s.total) return send(res, 400, { code: 'parts_mismatch' });
    if (req.headers.digest !== 'sha=' + crypto.createHash('sha1').update(all).digest('base64')) return send(res, 412, { code: 'digest_mismatch' });
    const w = writeFile('box', s.rel, s.name, all, true); S.sessions.delete(m[1]);
    return send(res, 201, { entries: [{ id: w.id, type: 'file' }] });
  }
  send(res, 404, { error: { message: 'sandbox has no ' + M + ' ' + p } });
}

export function startSandbox(port) {
  return new Promise((ok) => {
    const srv = http.createServer((req, res) => route(req, res).catch((e) => send(res, 500, { error: { message: e.message } })));
    srv.listen(port, '127.0.0.1', () => ok(srv));
  });
}
