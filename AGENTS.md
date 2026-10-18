# Agents.md

## 1. Project Overview
cur8d is a production-ready Next.js starter optimized for performance, accessibility, and type safety.

## 2. Tech Stack
- Next.js 16 (App Router, Turbopack, Server Components, React 19).
- HeroUI v3: Accessible compound components with dot notation.
- Tailwind CSS v4: CSS-first configuration and theme variables.
- Vitest & Playwright: Unit, E2E, and accessibility (`@axe-core/playwright`) testing.
- Vercel Blob & Observability: Storage stub and centralized error reporting.

## 3. Directory Structure
- `app`: Routes, layouts, components, hooks, and logic layer (`app/lib`).
- `docs`: Nextra v4 documentation site.
- `scripts`: Template initialization and utility scripts (`scripts/init.ts`).
- `tests`: Test suites (`tests/unit/` for Vitest, `tests/e2e/` for Playwright).

## 4. Toolchain Management
Managed via `mise`. Update `.mise.toml` to change Node.js or pnpm versions.

## 5. TypeScript Rules
- Strict mode enabled.
- No `any` types allowed.
- Explicit interfaces for all component props.

## 6. Coding Conventions
- Named imports for icons (`lucide-react`, `@icons-pack/react-simple-icons`).
- Component folders in `app/components/ComponentName/index.tsx`.
- Server Components by default; `"use client"` for interactive leaf components.

## 7. How to add a new page
Add directory to `app/` with `page.tsx`.

## 8. How to add a new component
Create folder in `app/components/ComponentName/` with `index.tsx`, explicit prop interface, and unit test in `tests/unit/components/ComponentName/index.test.tsx`.

## 9. State Management & Hooks
Custom hooks in `app/hooks/` (e.g., `useSearchState` via `SearchProvider` context).

## 10. Testing Guide
- Complete Verification: `mise run verify` (alias: `v`)
- Unit: `mise run test` (alias: `t` or `pnpm test`)
- Coverage: `mise run test:coverage` (80% coverage required)
- E2E: `mise run test:e2e`
- Install Playwright Browsers: `mise run playwright:install`

## 11. Environment Variables
Validated via Zod in `app/lib/env.ts`.

## 12. Local Development Commands
- `mise run dev` (alias: `d` or `pnpm dev`): Start Turbopack dev server.
- `mise run build` (alias: `b` or `pnpm build`): Production build.
- `mise run lint` (alias: `l` or `pnpm lint`): Run linting.
- `mise run docs:dev`: Start documentation server.
- `mise run docs:build`: Build static documentation.

## 13. Deployment
- Vercel: Primary target for SSR site (`mise run deploy:vercel` / `deploy.yml`).
- Render: Web service target for SSR site (`mise run deploy:render` / `render.yaml` / `deploy.yml`).
- Firebase Hosting: Alternative target for site and docs (`mise run deploy:firebase`).
- GitHub Pages: Static documentation hosting (`docs.yml`).

## 14. HeroUI v3 usage
Use compound component pattern (e.g., `<Card.Header>`, `<Tooltip.Trigger>`).

## 15. Dark mode
Wiring via `next-themes` (`Providers` component) and Tailwind v4 CSS variables.

## 16. Icon usage
Named imports with Tailwind `size-*` or `h-* w-*` utilities.

## 17. Logic & Data layer
Logic, Zod schemas, structured metadata (`json-ld.ts`), and centralized error reporting (`error-reporting.ts`) in `app/lib/`.

## 18. Agent Skills
This repository provides built-in modular skills following the open Agent Skills standard under `.agents/skills/`:

| Skill | Purpose | Trigger / Usage |
| :--- | :--- | :--- |
| [`init-project`](.agents/skills/init-project/SKILL.md) | Initialize template into a standalone Next.js project | Initializing, bootstrapping, or configuring a new project from this repo |
| [`add-route`](.agents/skills/add-route/SKILL.md) | Scaffold App Router API route or page with Zod and Vitest | Adding or implementing an API route or page |
| [`add-component`](.agents/skills/add-component/SKILL.md) | Scaffold accessible UI component with Tailwind and tests | Creating or building a React UI component |
| [`deploy`](.agents/skills/deploy/SKILL.md) | Verify build and deploy to Firebase, Vercel, or Render | Deploying, releasing, or publishing the web application |
| [`verify-and-fix`](.agents/skills/verify-and-fix/SKILL.md) | Automated verification (lint, typecheck, test) and error fixing | Verifying, testing, linting, or fixing code quality issues |

To discover or use skills with the `skills` CLI:
```bash
# List available skills
npx skills add cur8d/typescript --list

# Install skills to current project
npx skills add cur8d/typescript
```

