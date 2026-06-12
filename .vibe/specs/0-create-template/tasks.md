# Tasks: Cur8d Template Implementation

## Phase 1: Environment & Initialization
- [x] Initialize `.mise.toml` with Node 24 and pnpm 11.
- [x] Create `package.json` with exact versions for Next.js 16, HeroUI v3, etc.
- [x] Configure `tsconfig.json` with strict mode and required path aliases.
- [x] Install dependencies.
- [x] Set up `.env.example` and `src/lib/env.ts` (Zod validation).

## Phase 2: Core Infrastructure
- [x] Configure `next.config.ts` with security headers and CSP.
- [x] Implement `src/app/globals.css` with Tailwind v4 `@theme`.
- [x] Create `src/components/Providers/index.tsx` (HeroUI, ThemeProvider).
- [x] Set up root `layout.tsx` with providers and skip-to-content link.

## Phase 3: Shared Components
- [x] Implement `<Navbar>` with SVG logo, nav links, and theme toggle.
- [x] Implement `<Footer>` with copyright and secondary links.
- [x] Implement `<ThemeToggle>` (sun/moon icon).
- [ ] Implement `<ShortcutHint>` (OS-detection for ⌘/Ctrl).
- [ ] Implement `<SearchPalette>` using `cmdk`.
- [ ] Implement `<PageHeader>` with breadcrumb support.
- [ ] Implement `<KpiCard>` with metric trend indicators.
- [ ] Implement generic `<DataTable>` with sorting, filtering, and pagination.

## Phase 4: Data Layer
- [ ] Create realistic mock data in `src/lib/data/mock.ts`.
- [ ] Implement typed data access functions in `src/lib/data/index.ts`.
- [ ] Scaffold Supabase server and client factories in `src/lib/supabase/`.
- [ ] Implement Supabase session refresh middleware.
- [ ] Create `src/lib/data/README.md` with integration instructions.

## Phase 5: Pages
- [x] Implement Landing page (`/`) with features and JSON-LD.
- [ ] Implement Dashboard page (`/dashboard`) integrating KPI cards and the Data Table.
- [ ] Implement About page (`/about`) stub.
- [x] Implement custom `not-found.tsx` and `error.tsx`.

## Phase 6: Testing
- [x] Configure Vitest and React Testing Library.
- [x] Write unit tests for core utilities and components (`ThemeToggle`, `env.ts`, etc.).
- [x] Configure Playwright.
- [ ] Write E2E tests for navigation, dark mode, keyboard palette, and data table.
- [x] Integrate `@axe-core/playwright` for accessibility testing.

## Phase 7: Documentation & Metadata
- [x] Initialize Nextra v4 site in `docs/` subfolder.
- [ ] Write guides (installation, adding pages, shortcuts).
- [x] Create required ADRs (Next.js, HeroUI, etc.).
- [x] Create `README.md`, `AGENTS.md`, and `CONTRIBUTING.md`.
- [x] Set up GitHub Workflows (CI, GH Pages deploy).

## Phase 8: Final Review
- [x] Run full typecheck and linting.
- [x] Execute all Vitest and Playwright tests.
- [x] Verify Lighthouse scores (target ≥ 95).
- [x] Ensure zero `any` types in the codebase.
