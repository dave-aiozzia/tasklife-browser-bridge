# Tasklife Browser Bridge

Tasklife Browser Bridge is a Chrome side-panel extension + backend protocol for giving an agent safe, human-approved assistance inside the browser session you are already using.

The first target backend is **Hermes Agent** running on a remote VPS. The architecture is intentionally backend-neutral so OpenClaw and other agent systems can be supported later without rewriting the Chrome extension.

## Goals

- Chat with an agent from a Chrome side panel.
- Authenticate/pair the extension with a remote agent server.
- Let the agent read active-page context with user-approved permissions.
- Let the agent assist with web forms, admin panels, CMS screens, and QA workflows.
- Keep browser cookies/passwords local; never send raw session secrets to the server.
- Require human approval for high-risk actions such as submit/send/delete/purchase/upload.

## Project shape

```text
extension/       Chrome Manifest V3 extension
protocol/        Browser bridge protocol and message schemas
server/          Backend adapter notes/stubs for Hermes/OpenClaw/MCP
```

## MVP phases

1. Side-panel chat connected to Hermes VPS.
2. Pairing-code auth and device token storage.
3. Active-tab page snapshot: URL, title, selected text, visible text, forms.
4. Assisted form filling with field highlighting.
5. Approval gate before submit-like or irreversible actions.

## Local extension development

This initial repo is intentionally dependency-light. Load the extension directly from `extension/`:

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this repo's `extension/` folder.
5. Open the side panel from the extension icon.

## Security principles

- Active-tab access by default; broader host access should be optional/per-domain.
- No raw cookies, passwords, API keys, or payment details are sent to the backend.
- Browser actions are auditable.
- Risky actions require explicit user approval.
- The browser extension is the local executor; the remote agent only requests actions through a constrained protocol.

## Backend neutrality

The Chrome extension should expose a stable browser bridge protocol. Backend adapters can translate that protocol into agent-specific sessions/tools:

- Hermes gateway platform
- OpenClaw gateway platform
- Generic MCP-style browser tools
- Future agent backends
