# Design and Plan: Cur8d Template

## Overview
Cur8d is a production-ready Next.js 16 starter template designed for high performance, accessibility, and developer productivity. It leverages the latest web technologies and strictly enforces TypeScript for type safety.

## Tech Stack
- **Next.js 16.2.6**: App Router, TypeScript strict mode, Turbopack.
- **React 19**: Peer dependency of Next.js 16.
- **Tailwind CSS v4**: CSS-first configuration via `@theme` in `globals.css`.
- **HeroUI v3.0.5**: Core UI component library.
- **Framer Motion**: For complex animations and page transitions.
- **Lucide React**: Icon library.
- **cmdk**: Keyboard-driven command palette.
- **next-themes**: Dark mode management.
- **Zod**: Environment variable validation.
- **Vitest 4.1**: Unit and component testing.
- **Playwright 1.59.1**: E2E and accessibility testing.
- **Supabase**: Data layer (stubbed integration).
- **Vercel Blob**: File storage (stubbed integration).

## Architectural Design
### 1. Component Strategy
- **Server Components by default**: Optimization for performance and SEO.
- **Client Components at leaf nodes**: Minimal use of `"use client"` for interactivity.
- **Barrel Exports**: Every component folder includes an `index.ts` for clean imports.
- **TSDoc**: Mandatory documentation for all public components and utilities.

### 2. Styling
- **Tailwind v4 CSS-first**: Theme configuration is handled directly in CSS, avoiding a separate JS/TS config file.
- **Responsive Design**: Mobile-first approach, tested at 375px and 1280px.
- **Dark Mode**: Seamless light/dark mode support with system preference detection.

### 3. Data & State Management
- **Type-safe Environment**: Environment variables validated at runtime using Zod.
- **Data Access Layer**: Abstracted data fetching through `src/lib/data/` returning typed interfaces.
- **URL-synced State**: Data table filters and search state synchronized with URL search params.

### 4. Testing & Quality
- **Co-located Unit Tests**: Tests sit next to their components.
- **Comprehensive E2E**: Covering navigation, keyboard interactions, and accessibility.
- **CI/CD Integration**: Automated workflows for type-checking, linting, and testing on every PR.

## Implementation Strategy
The project will be built in phases:
1. **Infrastructure**: Toolchain setup (mise, pnpm), core configurations (Next.js, TS, Tailwind).
2. **Core Components**: Navigation, layout providers, and theme toggling.
3. **Data Layer**: Mock data structures and Supabase/Blob stubs.
4. **Feature Pages**: Landing, Dashboard (complex data table), About, and Error pages.
5. **Testing & Docs**: Implementing the test suites and the Nextra documentation site.
