## 2025-05-22 - CSP Hardening for Vercel Insights
**Vulnerability:** Default CSP often lacks restrictive directives like `base-uri`, `form-action`, and `upgrade-insecure-requests`, leaving the app open to certain injection and MITM attacks.
**Learning:** Adding a strict CSP can break Vercel Speed Insights. Specifically, the Speed Insights script requires connection to `vitals.vercel-insights.com`.
**Prevention:** Always include `vitals.vercel-insights.com` in `connect-src` when using Vercel Speed Insights with a CSP. Ensure `upgrade-insecure-requests` is used to force HTTPS in modern browsers.

## 2025-05-22 - Strict Environment Variable Validation
**Vulnerability:** Weak validation of sensitive environment variables (like API tokens) can lead to using malformed or incorrect credentials, potentially causing runtime failures or security misconfigurations.
**Learning:** Vercel Blob tokens follow a predictable pattern (`vercel_blob_rw_...`). Enforcing this at the schema level (Zod) provides early detection of configuration errors.
**Prevention:** Use Zod's `.startsWith()` or `.regex()` to enforce known formats for external API keys and tokens in `env.ts`.

## 2025-05-23 - Centralized Error Reporting for Client Interactions
**Vulnerability:** Un-abstracted direct `console.error` calls in user-facing client components (like `CodeSnippet`) can leak raw interaction stacks/details to browser logs in production.
**Learning:** Consolidating client errors through `reportError` provides a single point of sanitization and redaction before logs are ingested or stored.
**Prevention:** Avoid raw console logging in components; route all catches through the `@/lib/error-reporting` utility.
