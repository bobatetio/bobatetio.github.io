# Ukreate auto mode for Claude and ChatGPT

An MCP server that runs auto mode from a chat. No dependencies, Node 18+.

It loads the app's own `assets/js/ukauto.js`, so every answer and action runs the same code as the hotel's screen. State lives in `mcp/state.json` (git-ignored) and is served on `http://localhost:4398/state`; the hotel app syncs with it while the server runs, so actions appear on screen marked "via Claude".

## Connect

Claude Desktop, in Settings > Developer > Edit config:

```json
{ "mcpServers": { "ukreate": { "command": "node", "args": ["/absolute/path/to/ukreate-2.0/mcp/server.mjs"] } } }
```

Claude Code:

```
claude mcp add ukreate -- node /absolute/path/to/ukreate-2.0/mcp/server.mjs
```

Then in the app: Auto mode > Settings > Claude and ChatGPT. Switch it on and pick Look only or Look and act. The server refuses everything until that is on, and refuses changes under Look only.

## Tools

Read: `get_status`, `list_arrivals`, `list_offers`, `list_decisions`, `get_activity`, `get_results`, `get_limits`, `preview_limits`.
Act: `decide`, `set_auto_mode`, `set_limits`, `take_back_offer`, `cancel_stay` (needs `confirm: true`).

## Not done yet

ChatGPT and Claude on the web need a hosted server over Streamable HTTP with OAuth sign-in, reading the property's real record instead of `state.json`. The tool list does not change.
