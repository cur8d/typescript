# Sentinel Journal

## 2025-05-14 - Content Security Policy Meta Tag Limitations
**Vulnerability:** Attempted to add `frame-ancestors 'none'` to a CSP `<meta>` tag in the documentation site.
**Learning:** The `frame-ancestors` directive is ignored by browsers when delivered via a CSP `<meta>` tag. It must be delivered as an HTTP header to prevent clickjacking effectively. Additionally, removing `'unsafe-eval'` from a Next.js/Nextra project without exhaustive component verification can lead to functional regressions.
**Prevention:** Always deliver clickjacking protection (`frame-ancestors`, `X-Frame-Options`) via HTTP headers. Centralize CSP configuration where possible, but be mindful of delivery mechanism limitations (Headers vs. Meta tags) in static exports.
