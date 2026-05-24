# Browser Bridge Protocol Draft

This protocol lets a remote agent backend request local browser context/actions through the Chrome extension.

## Transport

Preferred: authenticated WebSocket from extension to backend.

```text
extension -> backend: hello/device/pairing
backend -> extension: agent messages and tool requests
extension -> backend: tool results, approvals, user messages
```

## Core message envelope

```json
{
  "id": "msg_123",
  "type": "tool_request",
  "session_id": "chrome_session_abc",
  "timestamp": "2026-05-24T00:00:00Z",
  "payload": {}
}
```

## Tool request example

```json
{
  "id": "tool_123",
  "type": "tool_request",
  "tool": "chrome_get_page_snapshot",
  "arguments": {
    "include_forms": true,
    "max_chars": 20000
  }
}
```

## Tool result example

```json
{
  "id": "tool_123",
  "type": "tool_result",
  "ok": true,
  "result": {
    "url": "https://example.com/admin",
    "title": "Admin",
    "visibleText": "..."
  }
}
```

## Approval request example

```json
{
  "id": "approval_123",
  "type": "approval_request",
  "risk": "high",
  "action": "click",
  "human_label": "Click Submit Payment on stripe.com",
  "details": {
    "selector": "button[type=submit]",
    "url": "https://dashboard.stripe.com/..."
  }
}
```

## Initial tools

- `chrome_get_active_tab`
- `chrome_get_page_snapshot`
- `chrome_get_selected_text`
- `chrome_list_forms`
- `chrome_highlight_element`
- `chrome_fill_field`
- `chrome_click`
- `chrome_scroll`
- `chrome_extract_table`

## Safety classification

- `low`: read-only context, highlighting
- `medium`: filling fields, navigation
- `high`: submit/send/delete/purchase/upload/password/payment-related actions

High-risk actions must be approved locally in the extension UI before execution.
