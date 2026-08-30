## 2025-01-01 - Avoid `dangerouslySetInnerHTML`
**Vulnerability:** XSS risk from `dangerouslySetInnerHTML` via untrusted JSON-LD.
**Learning:** React 19 provides built-in mechanisms to safely render JSON objects inside script tags directly like `<script>{JSON_LD_STRING}</script>` instead of relying on `dangerouslySetInnerHTML`.
**Prevention:** Avoid `dangerouslySetInnerHTML` unless explicitly needed and audited, always sanitize user inputs, and leverage built-in React 19 safety features where applicable.
