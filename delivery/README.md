# Ukreate content delivery

Saves every piece of creator content to the hotel's own drive as it arrives, into `Ukreate / <Creator>, <dates>`. Google Drive, Dropbox, OneDrive and Box. No dependencies, Node 18+.

iCloud Drive is not supported: Apple offers no way for another service to write into someone's iCloud Drive.

## Try it now, without keys

```
UKD_SANDBOX=1 node delivery/server.mjs
```

Sandbox mode runs stand-ins for all four providers on this computer. Connecting shows a sign-in screen marked Sandbox, and delivered files are written to `delivery/sandbox-drives/<Drive>/Ukreate/…` so you can open them in Finder. The app labels the panel Sandbox while this is on.

In the app: Auto mode, Results, Content delivery, Connect. Then, in the browser console, `ukDemo.content("as11")` makes a stay's content arrive and shows it being saved.

## Going live

Register Ukreate once with each provider and put the keys in `delivery/.env`:

```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
DROPBOX_CLIENT_ID=...        # Dropbox calls this the App key
DROPBOX_CLIENT_SECRET=...    # and this the App secret
ONEDRIVE_CLIENT_ID=...
ONEDRIVE_CLIENT_SECRET=...
BOX_CLIENT_ID=...
BOX_CLIENT_SECRET=...
UKD_PUBLIC=https://delivery.ukreate.com   # where this service is reachable
UKD_APP=https://app.ukreate.com/app/      # where to send the hotel back to
UKD_ASSETS=https://app.ukreate.com        # where content files are read from
```

The redirect URI to register with each provider is `<UKD_PUBLIC>/callback/<provider>`, where provider is `gdrive`, `dropbox`, `onedrive` or `box`.

| Provider | Where | Permission asked for |
|---|---|---|
| Google Drive | Google Cloud console, OAuth client (Web) | `drive.file`: only files Ukreate creates. Not a restricted scope, so no security assessment |
| Dropbox | Dropbox App Console, scoped app, Full Dropbox or App folder | `files.content.write`, `files.metadata.write`, `account_info.read` |
| OneDrive | Microsoft Entra app registration, personal and work accounts | `Files.ReadWrite`, `User.Read`, `offline_access` |
| Box | Box Developer Console, Custom App, user authentication | Write all files and folders |

Tokens are stored by this service (`store.json`, git-ignored) and never sent to the browser. In production, move the store to the platform's database and encrypt the refresh tokens.

## How content gets here

`POST /deliver` with `{ stay:{ id, title }, files:[{ name, url }] }`. The app calls it when content arrives for an auto mode stay and when a hotel approves a hosted stay's content. In production the platform should call it itself the moment content lands, so delivery never depends on someone having the app open.

Every delivery goes to every connected drive. Files already delivered for a stay are skipped. Large files are uploaded in chunks the way each provider requires. Expired tokens are refreshed, and rate limits and server errors are retried with growing waits. What still fails is recorded and can be retried from the app.

## Tests

```
node delivery/test.mjs
```

Runs the whole flow against the sandbox for all four providers on spare ports with a scratch store: sign-in and refusal, small and chunked uploads with byte-exact checks, no duplicates, expired-token refresh, retries, failures and manual retry, disconnecting, and fan-out to every drive.
