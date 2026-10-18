---
name: deploy
description: Verifies build and deploys the Next.js application to Firebase Hosting, Vercel, or Render. Use whenever the user asks to deploy, release, or publish the web application.
category: coding
tags: [typescript, nextjs, firebase, vercel, render, deploy, cur8d]
---

# Deploy cur8d/typescript Application

This skill guides you through pre-flight verification and deploying the `cur8d/typescript` Next.js application to Firebase Hosting, Vercel, or Render.

## Prerequisites

- Node.js 22+ and `pnpm` installed
- `mise` installed
- Hosting platform CLI authenticated (Firebase CLI, Vercel CLI, or Render account)

## Workflow

### 1. Pre-Flight Verification
Always ensure the codebase builds and tests pass cleanly:

```bash
# Full verification (lint, typecheck, unit tests)
mise run verify

# Verify production build
pnpm build
```

Do not proceed with deployment if the build or tests fail.

### 2. Deploy to Target Platform

#### Target A: Firebase Hosting
If deploying via Firebase:
```bash
# Run production build & export
pnpm build

# Deploy hosting assets
firebase deploy --only hosting
```
*(Or run `mise run deploy` if configured in `mise.toml`).*

#### Target B: Vercel
If deploying to Vercel:
```bash
npx vercel deploy --prod
```

#### Target C: Render
If using Render:
- Verify `render.yaml` configuration.
- Push changes to the deployment branch (`main`):
  ```bash
  git push origin main
  ```
- Render will automatically trigger the build pipeline using `pnpm install` and `pnpm build`.

### 3. Post-Deployment Verification
- Fetch the deployed URL status:
  ```bash
  curl -I https://<deployed-url>
  ```
- Verify status code 200 OK and inspect security headers (CSP, HSTS).

## Boundaries

✅ **Always do:**
- Always run `mise run verify` and `pnpm build` before initiating any deployment.
- Always report the live URL and deployment status back to the user.

🚫 **Never do:**
- Never deploy code with failing tests or uncommitted emergency hacks.
- Never push secret environment keys (`.env.local`) to public hosting platforms.
