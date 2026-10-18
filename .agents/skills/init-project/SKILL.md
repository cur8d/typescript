---
name: init-project
description: Initializes and customizes a new Next.js project repository from the cur8d/typescript template. Use whenever the user asks to initialize, bootstrap, or configure a newly cloned or forked TypeScript/Next.js project.
category: system
tags: [scaffolding, template, init, typescript, nextjs, cur8d]
---

# Initialize Project from cur8d/typescript Template

This skill guides you through transforming a newly cloned or forked `cur8d/typescript` repository into a fully personalized, standalone Next.js project.

## Prerequisites

- Node.js 22+ and `pnpm` installed
- `mise` installed
- Clean git working tree

## Workflow

### 1. Gather Project Parameters
Identify or ask the user for:
- **Project Name** (e.g., `my-next-app`)
- **Description** (e.g., `Modern web application built with Next.js 15 and Tailwind`)
- **Author Name** and **Email** (fallback to git config defaults)
- **GitHub Username / Org** (e.g., `cur8d` or your personal handle)

### 2. Execute Template Initialization
Run the initialization script using `tsx`:

```bash
pnpm tsx scripts/init.ts
```

*(Or run `mise run init`).*

The script will:
- Update `package.json` (`name`, `description`, `author`, `repository`).
- Update metadata in `app/layout.tsx`.
- Update project keys in `sonar-project.properties`, `render.yaml`, `firebase.json`.
- Prompt to copy `.env.example` to `.env.local`.
- Remove `scripts/init.ts` upon completion.

### 3. Install Dependencies
Run `pnpm install` to ensure the lockfile and node modules match the customized configuration:

```bash
pnpm install
```

### 4. Verify Baseline
Run repository verification:

```bash
mise run verify
```

## Boundaries

✅ **Always do:**
- Always ensure `.env.local` is created from `.env.example`.
- Always run `mise run verify` after initialization to ensure build and tests pass.
- Always verify git config values before prompting the user.

🚫 **Never do:**
- Never push initial customization commits directly to upstream `cur8d/typescript`.
- Never commit secret keys or environment variables into `.env.example`.
