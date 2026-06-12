Create a production-ready website 
template. The goal is a template that requires ONLY data integration, brand adjustments, and 
new page additions before going live — no structural rework needed.

---

### STRICT REQUIREMENTS

- **TypeScript everywhere, no exceptions** — no `.js` or `.jsx` files anywhere in the project 
  (configs included where possible). `tsconfig.json` must have `"strict": true`. All props, 
  functions, API responses, environment variables, and utility return types must be explicitly typed.
- Never use `any`. Use `unknown` + type guards, or proper generics instead.
- All component props must be defined as `interface` or `type` — never inlined anonymously.

---

### TECH STACK (pin these exact versions)

- **Next.js 16.2.6** — App Router, TypeScript strict mode, Turbopack dev server (default in 16.x)
- **React 19** — peer dependency of Next.js 16
- **Tailwind CSS v4** — CSS-first config via `@theme` in `globals.css`; no `tailwind.config.ts`
- **HeroUI v3.0.5** (`@heroui/react`) — wrap app in `<HeroUIProvider>` at root layout; 
  note: v3 is a breaking rewrite from v2 — use v3 APIs and component names only 
  (e.g. `Typography` not `Text`, `Toast.Provider` not `Toast.Container`)
- **Framer Motion** — animations; CSS animations preferred in HeroUI v3, use Framer Motion 
  for page transitions and complex interactions only
- **lucide-react** (latest stable) — icons only; always named imports 
  (`import { Search } from "lucide-react"`); never wildcard or default imports; 
  size via Tailwind `size-*` utilities; all icon-only buttons must have `aria-label`
- **cmdk** (latest stable) — command palette / search (keyboard-driven)
- **next-themes** (latest stable) — dark mode provider
- **zod** (latest stable) — environment variable validation
- **pnpm 11.x** — package manager; include `packageManager` field in `package.json`
- **mise** — toolchain version manager; pins Node.js and pnpm via `.mise.toml`
- **Vitest 4.1** + **React Testing Library** — unit and component testing
- **Playwright 1.59.1** — end-to-end and cross-browser testing
- **Nextra v4** — documentation site (in `docs/` subfolder, deployed to GitHub Pages)
- **@supabase/supabase-js** + **@supabase/ssr** (latest stable) — data layer stub
- **@vercel/blob** (latest stable) — file storage stub

---

### TOOLCHAIN VERSION PINNING (mise)

Commit `.mise.toml` at repo root:
```toml
[tools]
node = "24.0.0"   # Node.js 24 LTS — active LTS until April 2028
pnpm = "11.0.0"   # adjust to latest stable 11.x at time of execution
```
- `.mise.toml` is the single source of truth for toolchain versions — do not duplicate in 
  `.nvmrc`, `.node-version`, or `engines` in `package.json`
- All GitHub Actions workflows run `mise install` as step 1 before `pnpm install`
- `README.md` quick-start: `mise install` → `pnpm install` → `pnpm dev`
- `AGENTS.md` note: upgrading Node.js or pnpm means editing `.mise.toml` only

---

### TESTING SETUP

#### Unit & Component Tests — Vitest 4.1 + React Testing Library

- Config in `vitest.config.ts`; use `@vitejs/plugin-react` for JSX transform
- jsdom environment for component tests
- Path aliases in `vitest.config.ts` must match `tsconfig.json` aliases exactly
- Coverage via V8 provider (`@vitest/coverage-v8`); thresholds: 80% lines, functions, branches
- Test files colocated with source: `src/components/Navbar/Navbar.test.tsx`
- Scripts:
  ```json
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest run --coverage"
  ```
- Scaffold example tests for:
  - `<ThemeToggle>` — renders, toggles light/dark
  - `<KpiCard>` — renders metric, label, correct trend icon
  - `<ShortcutHint>` — renders `⌘` on Mac, `Ctrl` on other OS
  - `src/lib/env.ts` — throws on missing required variables
  - `src/config/shortcuts.ts` — all shortcuts have unique keys and non-empty labels

#### End-to-End Tests — Playwright 1.59.1

- Config in `playwright.config.ts` at repo root
- Test browsers: Chromium, Firefox, WebKit
- Tests in `e2e/` directory at repo root
- Base URL: `process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000'`
- Scripts:
  ```json
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "test:e2e:report": "playwright show-report"
  ```
- Scaffold E2E tests for:
  - **Navigation** — all nav links route correctly, no 404s
  - **Dark mode** — toggle switches theme, persists on reload
  - **Command palette** — `⌘K`/`Ctrl+K` opens palette; typing filters results; `Escape` closes
  - **Data table** — search filters rows; filter chips apply; URL reflects filters; pagination works
  - **Keyboard shortcuts** — `?` opens help modal; `Escape` closes it
  - **Accessibility** — no WCAG violations via `@axe-core/playwright` on each page
  - **404 page** — `/nonexistent` renders custom 404

#### Test Philosophy

- Unit tests: pure functions, hooks, isolated component rendering
- E2E tests: user flows, keyboard interactions, cross-page behavior, accessibility
- No duplication between unit and E2E layers
- All test files TypeScript — no `.test.js` files

---

### ARCHITECTURE & CODE QUALITY

- Path aliases in `tsconfig.json`: `@/components`, `@/lib`, `@/types`, `@/hooks`, `@/config`
- Barrel exports (`index.ts`) for every component folder
- Server Components by default; `"use client"` only at leaf nodes requiring interactivity, 
  hooks, or browser APIs — never at page level
- Environment variables validated via `zod` in `src/lib/env.ts`; fails fast on startup 
  if required variable is missing
- Conventional Commits via `commitlint` + `husky`
- ESLint + Prettier with Next.js 16 recommended rules; `lint-staged` for pre-commit
- Bundle analyzer: `"analyze": "ANALYZE=true next build"` via `@next/bundle-analyzer`
- All shared types in `src/types/` — never inline in component files

---

### DESIGN & UX

- Clean, minimal, modern aesthetic — neutral surfaces, single accent color, no gradient 
  buttons, no decorative blobs, no icon-in-colored-circle patterns
- **Light + dark mode** — `next-themes` provider; system preference default; sun/moon toggle 
  in navbar persists preference
- Fully responsive — mobile-first, verified at 375px and 1280px
- Accessible: semantic HTML, WCAG AA contrast, full keyboard navigation, visible focus rings, 
  skip-to-content link as first focusable element
- Smooth transitions with Framer Motion; always respect `prefers-reduced-motion`
- HeroUI v3 components used consistently (Table, Input, Select, Modal, Navbar, Breadcrumb, 
  Chip, Pagination, Typography, Alert, etc.)

---

### SEARCH, FILTERING & KEYBOARD SHORTCUTS

- `Cmd/Ctrl + K` opens `cmdk` command palette wired to sample data
- Shortcut hints visible in UI (`⌘K` badge near navbar search trigger)
- `?` opens keyboard shortcut help modal
- All shortcuts registered in `src/config/shortcuts.ts` — one file to edit for new shortcuts
- Data table: column sorting, multi-select filter chips, text search, URL-synced filter state 
  via `useSearchParams` (filters survive page refresh)

---

### PAGES & COMPONENTS

Scaffold with realistic, domain-agnostic placeholder data (not lorem ipsum):

**Pages:**
1. `/` — Landing: headline, subheadline, CTA, asymmetric 3-feature section, footer
2. `/dashboard` — KPI cards + searchable/filterable/sortable/paginated data table with `⌘K`
3. `/about` — Page stub ready for content
4. `not-found.tsx` — Custom 404 with home navigation
5. `error.tsx` — Custom error boundary with retry action

**Reusable components (`src/components/`):**
- `<Navbar>` — SVG logo placeholder + nav links + dark mode toggle + `⌘K` trigger with badge; 
  logo must read "cur8d" in the SVG mark
- `<Footer>` — links + copyright line reading "cur8d — open-source Next.js starter"
- `<SearchPalette>` — `cmdk` command palette, typed result items, keyboard navigable
- `<DataTable<T>>` — generic HeroUI v3 Table with sorting, filtering, pagination; 
  typed via `DataTableProps<T>`
- `<KpiCard>` — metric, label, trend indicator (up/down/neutral); typed `KpiCardProps`
- `<PageHeader>` — title + breadcrumb + optional `actions` slot
- `<ShortcutHint>` — renders `⌘K`/`Ctrl+K`, detects OS automatically
- `<ThemeToggle>` — sun/moon icon wired to `next-themes`

---

### DATA LAYER — Supabase Integration Stub

Install `@supabase/supabase-js` and `@supabase/ssr` but do not connect to a live project.
Scaffold the integration boundary only:

- `src/lib/supabase/server.ts` — server client factory using `@supabase/ssr`
- `src/lib/supabase/client.ts` — browser client factory using `@supabase/ssr`
- `src/lib/supabase/middleware.ts` — session refresh middleware helper
- `src/middleware.ts` — wires Supabase session refresh into Next.js middleware
- `src/lib/data/index.ts` — typed data access functions (return mock data now; 
  replace with real Supabase queries during integration)
- `src/lib/data/mock.ts` — realistic sample data matching the Supabase schema shape
- `src/types/database.ts` — placeholder for Supabase generated types 
  (generated via `supabase gen types` once a real project is connected)
- `src/lib/data/README.md` — exact steps to connect a real Supabase project

Install `@vercel/blob` for file storage stub. No blob calls in template — 
documented in `src/lib/data/README.md` as the file upload integration point.

Required env vars (add to `.env.example`):

- NEXT_PUBLIC_SUPABASE_URL= # Supabase project URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY= # Supabase anon/public key
- BLOB_READ_WRITE_TOKEN= # Vercel Blob token (optional — only for file uploads)


---

### PERFORMANCE & LIGHTHOUSE TARGET (~100)

- `next/image` — explicit `width`, `height`, `loading="lazy"`, `alt` required on all images
- `next/font` — zero runtime font requests
- Strict CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, 
  Permissions-Policy — all in `next.config.ts` via `headers()`
- `robots.ts` and `sitemap.ts` via Next.js built-in Metadata API
- JSON-LD structured data on landing page
- `content-visibility: auto` on off-screen list sections
- `compress: true` in `next.config.ts`

---

### SECURITY

- All secrets via `.env.local` only — never hardcoded or committed
- Strict CSP headers (nonces via middleware if needed)
- No `dangerouslySetInnerHTML` anywhere
- Dependabot for `npm` and `github-actions`
- All GitHub Actions steps pinned to full commit SHAs, not version tags

---

### DEPLOYMENT

**Primary — Vercel (full Next.js 16 feature support):**
Connect GitHub repo directly to Vercel — no workflow file needed. Vercel handles 
production deploys on push to `main` and automatic per-PR preview URLs natively.
Add `vercel.json` at repo root with project configuration.

**Secondary — GitHub Pages (static app export):**
`deploy-ghpages.yml` builds with `output: 'export'` in `next.config.ts` and deploys 
via `actions/deploy-pages`. Document clearly in the workflow file and `AGENTS.md`:
- Static export disables Server Components with data fetching
- Supabase SSR middleware does not run — use client-only Supabase pattern for this target
- `src/middleware.ts` is disabled in static export

Do not add Firebase Hosting — it does not support Next.js SSR or middleware.

---

### GITHUB WORKFLOWS (`.github/workflows/`)

All workflows must:
- Run `mise install` as step 1
- Cache pnpm store and Next.js build cache
- Pin all actions to full commit SHAs
- Include clearly commented secret requirements

1. **`ci.yml`** — Push and PR to `main`; runs: 
   `typecheck → lint → test (Vitest) → test:e2e (Playwright) → build`
   - Playwright: `pnpm playwright install --with-deps`
   - Upload Playwright HTML report as artifact on failure
   - Upload Vitest coverage report as artifact

2. **`deploy-ghpages.yml`** — Push to `main` when `src/**` or `public/**` changes; 
   static export build → GitHub Pages via `actions/deploy-pages`

3. **`docs-ghpages.yml`** — Push to `main` when `docs/**` changes; 
   Nextra static export → GitHub Pages (separate Pages environment for docs)

---

### DOCUMENTATION SITE (`docs/`)

Create `docs/` at repo root containing a **Nextra v4** documentation site 
(App Router, `output: 'export'` for GitHub Pages).

Structure:

```
docs/
content/
getting-started/
installation.mdx
project-structure.mdx
environment-variables.mdx
guides/
adding-a-page.mdx
adding-a-component.mdx
adding-a-shortcut.mdx
connecting-supabase.mdx
dark-mode.mdx
testing.mdx
deployment/
vercel.mdx
github-pages.mdx
reference/
components.mdx
shortcuts.mdx
workflows.mdx
adr/
```


---

### INLINE DOCUMENTATION (TSDoc)

Every exported component `interface`/`type`, public utility function, and custom hook 
must have a TSDoc block comment with:
- One-line description
- `@example` showing the most common usage
- `@param` / `@returns` on utility functions
- `@default` on optional props with meaningful defaults

Never add TSDoc to internal implementation details or private functions.
No Storybook — TSDoc + Playwright visual snapshots cover component documentation needs.

---

### ARCHITECTURE DECISION RECORDS (`docs/content/adr/`)

One ADR per major tech decision. Each follows this structure exactly:

```
ADR-00N: [Title]
Status: Accepted
Context
Decision
Rationale
Consequences
```

ADRs to create: Next.js 16, HeroUI v3, Vitest over Jest, Playwright over Cypress, 
mise for toolchain, Tailwind v4 CSS-first, Supabase over Firebase Firestore, 
Vercel over Firebase Hosting.

---

### GITHUB COMMUNITY FILES (`.github/`)

- `ISSUE_TEMPLATE/bug_report.yml` — YAML form: title, environment (OS, browser, 
  Node version), reproduction steps, expected vs actual, screenshots
- `ISSUE_TEMPLATE/feature_request.yml` — YAML form: problem, proposed solution, 
  alternatives, context
- `ISSUE_TEMPLATE/config.yml` — disable blank issues; link to Discussions
- `PULL_REQUEST_TEMPLATE.md` — checklist: description, change type, testing steps, 
  screenshots, related issues; checklist items: typecheck passes, lint passes, 
  Vitest passes, Playwright passes, coverage thresholds met, docs updated, 
  no `any` types introduced
- `CODEOWNERS`
- `CONTRIBUTING.md` — setup, branch naming (`feat/`, `fix/`, `chore/`), 
  Conventional Commits, how to add component/page/shortcut/test, 
  how to update docs, ADR requirement for architectural changes
- `CODE_OF_CONDUCT.md` — Contributor Covenant v2.1

---

### DEPENDABOT (`.github/dependabot.yml`)

- `npm` — weekly, grouped (production vs development), auto-assign to owner
- `github-actions` — weekly, auto-assign to owner
- Target branch: `main`

---

### AGENTS.md (repo root)

Sections:
1. Project overview — what cur8d is, what it's optimized for
2. Tech stack (each tool, exact version, why chosen)
3. Directory structure (annotated tree)
4. Toolchain management (mise — upgrade by editing `.mise.toml` only)
5. TypeScript rules (strict, no `any`, generics, where types live)
6. Coding conventions (naming, Server vs Client components, barrel exports)
7. How to add a new page
8. How to add a new component (types + barrel export + test file)
9. How to add a keyboard shortcut (shortcuts.ts → useShortcuts → UI hint → E2E test)
10. Testing guide (unit vs E2E, how to run, coverage requirements)
11. Environment variables (zod schema + .env.example flow)
12. Local development commands
13. Deployment (Vercel primary, GitHub Pages static app, GitHub Pages docs, limitations)
14. HeroUI v3 usage (HeroUIProvider location, Tailwind Variants overrides, 
    v3 breaking changes from v2, theme config)
15. Dark mode (next-themes wiring, adding theme-aware colors)
16. Icon usage (lucide-react named imports, size-* utilities, aria-label rules)
17. Data layer (mock → Supabase migration path, Vercel Blob for files)

---

### OTHER ROOT FILES

- `README.md` — CI badge, coverage badge, "cur8d — a production-ready Next.js starter"
  tagline, quick-start (`mise install` → `pnpm install` → `pnpm dev`), stack table, 
  test commands, deployment guide, link to docs site, screenshot placeholder
- `.mise.toml` — Node.js 24 + pnpm 11 pinned
- `vercel.json` — Vercel project configuration
- `vitest.config.ts` — Vitest configuration
- `playwright.config.ts` — Playwright configuration
- `LICENSE` — MIT
- `CHANGELOG.md` — Keep a Changelog template
- `.env.example` — all keys with inline comments, no real values
- `.gitignore` — Next.js defaults + `.env.local`, `.next/`, `out/`, 
  `playwright-report/`, `test-results/`, `coverage/`

---

### DEFINITION OF DONE

1. `mise install && pnpm install` completes without errors
2. `pnpm typecheck` — zero TypeScript errors
3. `pnpm lint` — zero ESLint errors or warnings
4. `pnpm test` — all Vitest tests pass; 80% coverage thresholds met
5. `pnpm test:e2e` — all Playwright tests pass on Chromium, Firefox, WebKit
6. `pnpm build` — successful production build
7. Lighthouse ≥ 95 across Performance, Accessibility, Best Practices, SEO
8. All GitHub Actions workflows executable without modification (given required secrets)
9. A new data-driven page can be added by copying an existing page pattern — 
   no structural changes required
10. Zero uses of `any` type anywhere in the codebase
11. `cd docs && pnpm build` — Nextra docs site builds successfully
