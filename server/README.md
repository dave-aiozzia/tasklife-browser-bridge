# Backend adapters

This directory is for backend integration notes and stubs.

## First backend: Hermes

Planned shape:

- Add a Hermes gateway platform named `chrome_extension`.
- Authenticate extension installs with pairing-code auth.
- Create/resume sessions with source `chrome`.
- Register browser bridge tools while the extension is connected.
- Relay tool calls to the extension over WebSocket.

Example config target:

```yaml
platforms:
  chrome_extension:
    enabled: true
    websocket_path: /chrome/ws
    pairing_required: true
```

## Future backend: OpenClaw

OpenClaw should use the same browser bridge protocol through either:

1. a native OpenClaw adapter, or
2. a generic MCP/browser-tool bridge consumed by OpenClaw.

## Future backend: MCP

Expose browser actions as MCP-style tools so any compatible agent can use the same Chrome extension without custom browser code.
