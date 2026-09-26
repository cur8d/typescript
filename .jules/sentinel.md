## 2024-05-18 - [Security Best Practice: JSON-LD rendering]
**Vulnerability:** React script tag execution / escaping issues with hydration when providing children.
**Learning:** React 19+ explicitly advises against interpolating children directly inside `<script>` tags, especially those containing JSON-LD strings. Instead it expects `dangerouslySetInnerHTML` for the injection. Although `safeJsonLdStringify` handles XSS mitigation, following React's required patterns ensures structural robustness.
**Prevention:** Always use `dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(data) }}` when adding structured data blocks in React to avoid improper escaping and execution issues.
