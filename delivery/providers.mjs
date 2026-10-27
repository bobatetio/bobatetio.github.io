/* Ukreate content delivery: the four drives, each against its official API.

   Every provider exposes the same six things:
     authUrl(cfg, redirect, state)   where the hotel approves Ukreate
     exchange(cfg, code, redirect)   the one-off code for tokens
     refresh(cfg, conn)              a fresh access token from the refresh token
     account(conn)                   who connected (shown to the hotel)
     ensureFolder(conn, names)       Ukreate / <stay>, created once, found after
     upload(conn, folder, file)      the bytes, chunked above the provider's limit
     revoke(cfg, conn)               let go of the permission on disconnect

   Scopes are the narrowest each provider offers for writing files: Google's
   drive.file only lets Ukreate see files Ukreate created; Dropbox, OneDrive and
   Box get write access to files. Nothing here reads the hotel's existing files.

   TEST AND SANDBOX: every https URL goes through u(). With UKD_PROVIDER_BASE set,
   https://host/path becomes <base>/host/path, which is how sandbox.mjs stands in
   for all four without any change to the code that talks to the real ones. */
import crypto from 'node:crypto';

const BASE = process.env.UKD_PROVIDER_BASE || '';
export const u = (url) => (BASE ? url.replace(/^https:\/\//, BASE.replace(/\/$/, '') + '/') : url);
const MB = 1024 * 1024;
/* thresholds can be lowered in tests to exercise the chunked paths on small files */
const T = (name, dflt) => +(process.env['UKD_' + name] || dflt);

export class ProviderError extends Error {
  constructor(provider, status, message, retryable) {
    super(message); this.provider = provider; this.status = status; this.retryable = !!retryable;
  }
}

async function call(provider, method, url, { token, headers = {}, json, form, body, raw } = {}) {
  const h = Object.assign({}, headers);
  if (token) h.Authorization = 'Bearer ' + token;
  let payload = body;
  if (json !== undefined) { h['Content-Type'] = 'application/json'; payload = JSON.stringify(json); }
  if (form) { h['Content-Type'] = 'application/x-www-form-urlencoded'; payload = new URLSearchParams(form).toString(); }
  let res;
  try { res = await fetch(u(url), { method, headers: h, body: payload, redirect: 'manual' }); }
  catch (e) { throw new ProviderError(provider, 0, 'Could not reach ' + provider + ': ' + e.message, true); }
  if (raw) return res;
  const text = await res.text();
  let data = text; try { data = text ? JSON.parse(text) : null; } catch {}
  if (!res.ok && res.status !== 308) {
    const msg = (data && (data.error_description || data.error_summary || (data.error && (data.error.message || data.error)) || data.message)) || text || res.statusText;
    throw new ProviderError(provider, res.status, provider + ' said ' + res.status + ': ' + (typeof msg === 'string' ? msg : JSON.stringify(msg)).slice(0, 300),
      res.status === 429 || res.status >= 500);
  }
  return { status: res.status, headers: res.headers, data };
}
const tokens = (t, old) => ({
  access: t.access_token,
  refresh: t.refresh_token || (old && old.refresh),
  expiresAt: Date.now() + ((t.expires_in || 3600) - 60) * 1000
});
const q = (o) => new URLSearchParams(o).toString();
/* Dropbox-API-Arg must be ASCII: anything else goes in as \uXXXX */
const asciiJson = (o) => JSON.stringify(o).replace(/[\u007f-￿]/g, (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));

/* ======================= Google Drive ======================= */
const google = {
  k: 'gdrive', name: 'Google Drive', env: 'GOOGLE',
  authUrl: (cfg, redirect, state) => 'https://accounts.google.com/o/oauth2/v2/auth?' + q({
    client_id: cfg.id, redirect_uri: redirect, response_type: 'code', state,
    scope: 'https://www.googleapis.com/auth/drive.file openid email', access_type: 'offline', prompt: 'consent', include_granted_scopes: 'true' }),
  async exchange(cfg, code, redirect) {
    const r = await call('Google Drive', 'POST', 'https://oauth2.googleapis.com/token',
      { form: { code, client_id: cfg.id, client_secret: cfg.secret, redirect_uri: redirect, grant_type: 'authorization_code' } });
    return tokens(r.data);
  },
  async refresh(cfg, conn) {
    const r = await call('Google Drive', 'POST', 'https://oauth2.googleapis.com/token',
      { form: { client_id: cfg.id, client_secret: cfg.secret, refresh_token: conn.tokens.refresh, grant_type: 'refresh_token' } });
    return tokens(r.data, conn.tokens);
  },
  async account(conn) {
    const r = await call('Google Drive', 'GET', 'https://www.googleapis.com/drive/v3/about?fields=user(displayName,emailAddress)', { token: conn.tokens.access });
    return (r.data.user && (r.data.user.emailAddress || r.data.user.displayName)) || 'Google account';
  },
  async ensureFolder(conn, names) {
    let parent = 'root', link = null;
    for (const name of names) {
      const query = `name='${name.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}' and mimeType='application/vnd.google-apps.folder' and '${parent}' in parents and trashed=false`;
      const found = await call('Google Drive', 'GET', 'https://www.googleapis.com/drive/v3/files?' + q({ q: query, fields: 'files(id,webViewLink)', spaces: 'drive' }), { token: conn.tokens.access });
      let f = found.data.files && found.data.files[0];
      if (!f) f = (await call('Google Drive', 'POST', 'https://www.googleapis.com/drive/v3/files?fields=id,webViewLink',
        { token: conn.tokens.access, json: { name, mimeType: 'application/vnd.google-apps.folder', parents: [parent] } })).data;
      parent = f.id; link = f.webViewLink || ('https://drive.google.com/drive/folders/' + f.id);
    }
    return { id: parent, link };
  },
  /* resumable upload; anything above the chunk size goes up in 256 KiB-aligned parts */
  async upload(conn, folder, file) {
    const start = await call('Google Drive', 'POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&fields=id,webViewLink',
      { token: conn.tokens.access, json: { name: file.name, parents: [folder.id] },
        headers: { 'X-Upload-Content-Type': file.type, 'X-Upload-Content-Length': String(file.bytes.length) } });
    const session = start.headers.get('location');
    if (!session) throw new ProviderError('Google Drive', 0, 'Google Drive did not open an upload session', true);
    const CHUNK = Math.max(256 * 1024, Math.floor(T('GOOGLE_CHUNK', 8 * MB) / (256 * 1024)) * 256 * 1024);
    const total = file.bytes.length;
    for (let off = 0; ; ) {
      const end = Math.min(off + CHUNK, total);
      const r = await call('Google Drive', 'PUT', session, { body: file.bytes.subarray(off, end),
        headers: { 'Content-Type': file.type, 'Content-Range': total ? `bytes ${off}-${end - 1}/${total}` : 'bytes */0' } });
      if (r.status === 308) {
        const range = r.headers.get('range');
        off = range ? +range.split('-')[1] + 1 : end;
        continue;
      }
      return { id: r.data.id, link: r.data.webViewLink || ('https://drive.google.com/file/d/' + r.data.id) };
    }
  },
  async revoke(cfg, conn) {
    await call('Google Drive', 'POST', 'https://oauth2.googleapis.com/revoke?' + q({ token: conn.tokens.refresh || conn.tokens.access })).catch(() => {});
  }
};

/* ======================= Dropbox ======================= */
const dropbox = {
  k: 'dropbox', name: 'Dropbox', env: 'DROPBOX',
  authUrl: (cfg, redirect, state) => 'https://www.dropbox.com/oauth2/authorize?' + q({
    client_id: cfg.id, response_type: 'code', redirect_uri: redirect, token_access_type: 'offline', state,
    scope: 'account_info.read files.content.write files.metadata.write' }),
  async exchange(cfg, code, redirect) {
    const r = await call('Dropbox', 'POST', 'https://api.dropboxapi.com/oauth2/token',
      { form: { code, grant_type: 'authorization_code', client_id: cfg.id, client_secret: cfg.secret, redirect_uri: redirect } });
    return tokens(r.data);
  },
  async refresh(cfg, conn) {
    const r = await call('Dropbox', 'POST', 'https://api.dropboxapi.com/oauth2/token',
      { form: { grant_type: 'refresh_token', refresh_token: conn.tokens.refresh, client_id: cfg.id, client_secret: cfg.secret } });
    return tokens(r.data, conn.tokens);
  },
  async account(conn) {
    const r = await call('Dropbox', 'POST', 'https://api.dropboxapi.com/2/users/get_current_account', { token: conn.tokens.access });
    return r.data.email || (r.data.name && r.data.name.display_name) || 'Dropbox account';
  },
  async ensureFolder(conn, names) {
    const path = '/' + names.join('/');
    try { await call('Dropbox', 'POST', 'https://api.dropboxapi.com/2/files/create_folder_v2', { token: conn.tokens.access, json: { path, autorename: false } }); }
    catch (e) { if (e.status !== 409) throw e; }   /* already there */
    return { id: path, link: 'https://www.dropbox.com/home' + path.split('/').map(encodeURIComponent).join('/') };
  },
  async upload(conn, folder, file) {
    const path = folder.id + '/' + file.name, total = file.bytes.length;
    const commit = { path, mode: 'add', autorename: true, mute: true };
    const LIMIT = T('DROPBOX_SINGLE', 140 * MB), CHUNK = T('DROPBOX_CHUNK', 8 * MB);
    const octet = (arg) => ({ 'Content-Type': 'application/octet-stream', 'Dropbox-API-Arg': asciiJson(arg) });
    let r;
    if (total <= LIMIT) {
      r = await call('Dropbox', 'POST', 'https://content.dropboxapi.com/2/files/upload', { token: conn.tokens.access, headers: octet(commit), body: file.bytes });
    } else {
      const s = await call('Dropbox', 'POST', 'https://content.dropboxapi.com/2/files/upload_session/start',
        { token: conn.tokens.access, headers: octet({ close: false }), body: file.bytes.subarray(0, CHUNK) });
      let off = CHUNK;
      while (total - off > CHUNK) {
        await call('Dropbox', 'POST', 'https://content.dropboxapi.com/2/files/upload_session/append_v2',
          { token: conn.tokens.access, headers: octet({ cursor: { session_id: s.data.session_id, offset: off }, close: false }), body: file.bytes.subarray(off, off + CHUNK) });
        off += CHUNK;
      }
      r = await call('Dropbox', 'POST', 'https://content.dropboxapi.com/2/files/upload_session/finish',
        { token: conn.tokens.access, headers: octet({ cursor: { session_id: s.data.session_id, offset: off }, commit }), body: file.bytes.subarray(off) });
    }
    return { id: r.data.id, link: 'https://www.dropbox.com/home' + (r.data.path_display || path).split('/').slice(0, -1).map(encodeURIComponent).join('/') };
  },
  async revoke(cfg, conn) {
    await call('Dropbox', 'POST', 'https://api.dropboxapi.com/2/auth/token/revoke', { token: conn.tokens.access }).catch(() => {});
  }
};

/* ======================= OneDrive (Microsoft Graph) ======================= */
const MS_SCOPE = 'offline_access Files.ReadWrite User.Read';
const onedrive = {
  k: 'onedrive', name: 'OneDrive', env: 'ONEDRIVE',
  authUrl: (cfg, redirect, state) => 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?' + q({
    client_id: cfg.id, response_type: 'code', redirect_uri: redirect, response_mode: 'query', scope: MS_SCOPE, state }),
  async exchange(cfg, code, redirect) {
    const r = await call('OneDrive', 'POST', 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      { form: { client_id: cfg.id, client_secret: cfg.secret, code, redirect_uri: redirect, grant_type: 'authorization_code', scope: MS_SCOPE } });
    return tokens(r.data);
  },
  async refresh(cfg, conn) {
    const r = await call('OneDrive', 'POST', 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      { form: { client_id: cfg.id, client_secret: cfg.secret, refresh_token: conn.tokens.refresh, grant_type: 'refresh_token', scope: MS_SCOPE } });
    return tokens(r.data, conn.tokens);
  },
  async account(conn) {
    const r = await call('OneDrive', 'GET', 'https://graph.microsoft.com/v1.0/me', { token: conn.tokens.access });
    return r.data.mail || r.data.userPrincipalName || r.data.displayName || 'Microsoft account';
  },
  async ensureFolder(conn, names) {
    let parent = null, link = null;
    const G = 'https://graph.microsoft.com/v1.0/me/drive';
    for (let i = 0; i < names.length; i++) {
      const path = names.slice(0, i + 1).map(encodeURIComponent).join('/');
      let item;
      try { item = (await call('OneDrive', 'GET', `${G}/root:/${path}`, { token: conn.tokens.access })).data; }
      catch (e) {
        if (e.status !== 404) throw e;
        item = (await call('OneDrive', 'POST', parent ? `${G}/items/${parent}/children` : `${G}/root/children`,
          { token: conn.tokens.access, json: { name: names[i], folder: {}, '@microsoft.graph.conflictBehavior': 'fail' } })).data;
      }
      parent = item.id; link = item.webUrl;
    }
    return { id: parent, link };
  },
  async upload(conn, folder, file) {
    const G = 'https://graph.microsoft.com/v1.0/me/drive', name = encodeURIComponent(file.name), total = file.bytes.length;
    let r;
    if (total <= T('ONEDRIVE_SINGLE', 4 * MB)) {
      r = await call('OneDrive', 'PUT', `${G}/items/${folder.id}:/${name}:/content?@microsoft.graph.conflictBehavior=rename`,
        { token: conn.tokens.access, headers: { 'Content-Type': file.type }, body: file.bytes });
    } else {
      const s = await call('OneDrive', 'POST', `${G}/items/${folder.id}:/${name}:/createUploadSession`,
        { token: conn.tokens.access, json: { item: { '@microsoft.graph.conflictBehavior': 'rename' } } });
      const CHUNK = Math.max(320 * 1024, Math.floor(T('ONEDRIVE_CHUNK', 10 * MB) / (320 * 1024)) * 320 * 1024);
      for (let off = 0; off < total; off += CHUNK) {
        const end = Math.min(off + CHUNK, total);
        /* the upload URL is pre-authorised: no bearer token on these requests */
        r = await call('OneDrive', 'PUT', s.data.uploadUrl, { body: file.bytes.subarray(off, end),
          headers: { 'Content-Range': `bytes ${off}-${end - 1}/${total}` } });
      }
    }
    return { id: r.data.id, link: r.data.webUrl };
  },
  async revoke() { /* Graph has no per-app revoke short of signing the user out everywhere; we forget the tokens */ }
};

/* ======================= Box ======================= */
function multipart(fields, file) {
  const b = '----ukreate' + crypto.randomBytes(8).toString('hex'), parts = [];
  for (const [k, v] of Object.entries(fields)) parts.push(Buffer.from(`--${b}\r\nContent-Disposition: form-data; name="${k}"\r\n\r\n${v}\r\n`));
  parts.push(Buffer.from(`--${b}\r\nContent-Disposition: form-data; name="file"; filename="${file.name.replace(/"/g, '')}"\r\nContent-Type: ${file.type}\r\n\r\n`));
  parts.push(file.bytes, Buffer.from(`\r\n--${b}--\r\n`));
  return { type: 'multipart/form-data; boundary=' + b, body: Buffer.concat(parts) };
}
const sha1 = (buf) => crypto.createHash('sha1').update(buf).digest('base64');
const box = {
  k: 'box', name: 'Box', env: 'BOX',
  authUrl: (cfg, redirect, state) => 'https://account.box.com/api/oauth2/authorize?' + q({ client_id: cfg.id, response_type: 'code', redirect_uri: redirect, state }),
  async exchange(cfg, code) {
    const r = await call('Box', 'POST', 'https://api.box.com/oauth2/token', { form: { grant_type: 'authorization_code', code, client_id: cfg.id, client_secret: cfg.secret } });
    return tokens(r.data);
  },
  /* Box rotates the refresh token on every use: the new one replaces the old */
  async refresh(cfg, conn) {
    const r = await call('Box', 'POST', 'https://api.box.com/oauth2/token',
      { form: { grant_type: 'refresh_token', refresh_token: conn.tokens.refresh, client_id: cfg.id, client_secret: cfg.secret } });
    return tokens(r.data, conn.tokens);
  },
  async account(conn) {
    const r = await call('Box', 'GET', 'https://api.box.com/2.0/users/me', { token: conn.tokens.access });
    return r.data.login || r.data.name || 'Box account';
  },
  async ensureFolder(conn, names) {
    let parent = '0';
    for (const name of names) {
      try {
        parent = (await call('Box', 'POST', 'https://api.box.com/2.0/folders', { token: conn.tokens.access, json: { name, parent: { id: parent } } })).data.id;
      } catch (e) {
        if (e.status !== 409) throw e;
        /* item_name_in_use: Box names the existing folder in the conflict */
        const r = await call('Box', 'GET', `https://api.box.com/2.0/folders/${parent}/items?fields=id,name,type&limit=1000`, { token: conn.tokens.access });
        const f = (r.data.entries || []).find((x) => x.type === 'folder' && x.name === name);
        if (!f) throw e;
        parent = f.id;
      }
    }
    return { id: parent, link: 'https://app.box.com/folder/' + parent };
  },
  async upload(conn, folder, file) {
    const total = file.bytes.length;
    let name = file.name;
    if (total <= T('BOX_SINGLE', 50 * MB)) {
      for (let attempt = 0; attempt < 5; attempt++) {
        const mp = multipart({ attributes: JSON.stringify({ name, parent: { id: folder.id } }) }, Object.assign({}, file, { name }));
        try {
          const r = await call('Box', 'POST', 'https://upload.box.com/api/2.0/files/content', { token: conn.tokens.access, headers: { 'Content-Type': mp.type }, body: mp.body });
          const f = r.data.entries[0];
          return { id: f.id, link: 'https://app.box.com/file/' + f.id };
        } catch (e) {
          if (e.status !== 409) throw e;
          name = file.name.replace(/(\.[^.]*)?$/, ` (${attempt + 2})$1`);   /* same name exists: keep both */
        }
      }
      throw new ProviderError('Box', 409, 'Box kept reporting a name clash for ' + file.name);
    }
    /* chunked: Box sets the part size; every part and the whole carry a SHA-1 digest */
    const s = (await call('Box', 'POST', 'https://upload.box.com/api/2.0/files/upload_sessions',
      { token: conn.tokens.access, json: { folder_id: folder.id, file_size: total, file_name: name } })).data;
    const parts = [];
    for (let off = 0; off < total; off += s.part_size) {
      const end = Math.min(off + s.part_size, total), chunk = file.bytes.subarray(off, end);
      const r = await call('Box', 'PUT', s.session_endpoints.upload_part, { token: conn.tokens.access, body: chunk,
        headers: { 'Content-Type': 'application/octet-stream', Digest: 'sha=' + sha1(chunk), 'Content-Range': `bytes ${off}-${end - 1}/${total}` } });
      parts.push(r.data.part);
    }
    const c = await call('Box', 'POST', s.session_endpoints.commit, { token: conn.tokens.access, json: { parts },
      headers: { Digest: 'sha=' + sha1(file.bytes) } });
    const f = c.data.entries[0];
    return { id: f.id, link: 'https://app.box.com/file/' + f.id };
  },
  async revoke(cfg, conn) {
    await call('Box', 'POST', 'https://api.box.com/oauth2/revoke', { form: { client_id: cfg.id, client_secret: cfg.secret, token: conn.tokens.refresh || conn.tokens.access } }).catch(() => {});
  }
};

export const PROVIDERS = { gdrive: google, dropbox, onedrive, box };
