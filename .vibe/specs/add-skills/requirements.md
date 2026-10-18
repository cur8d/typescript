# Requirements: Agent Skills for cur8d TypeScript

## Overview

Equip the `cur8d/typescript` repository with modular Agent Skills following the open standard (compatible with `skills.sh`, Claude Code, Cursor, GitHub Copilot, and Google Antigravity). These skills enable AI agents to autonomously scaffold, extend, test, and maintain modern Next.js/TypeScript applications adhering to cur8d's standards (Next.js App Router, React 19, Tailwind CSS, Vitest, Playwright, and `mise`).

## User Goals

1. Enable developers and AI agents to quickly scaffold new App Router routes (API route handlers or pages) with typed Zod schemas, error handling, and unit/integration tests.
2. Enable agents to create reusable, accessible UI components with Tailwind CSS, ARIA semantics, and Vitest component tests.
3. Provide an iterative code verification and auto-remediation skill executing `mise run verify` (`pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e`).
4. Support distribution via `npx skills add cur8d/typescript` and project-level discovery under `.agents/skills/`.

## Functional Requirements

1. **`add-route` Skill**:
   - Location: `.agents/skills/add-route/SKILL.md`
   - Instructions for the agent to scaffold a new API route under `app/api/<route>/route.ts` or a new page route under `app/<page>/page.tsx`.
   - Requires runtime request validation via Zod schemas and structured JSON error responses.
   - Requires matching unit tests under `tests/unit/api/<route>.test.ts` testing successful responses, bad requests, and error states.

2. **`add-component` Skill**:
   - Location: `.agents/skills/add-component/SKILL.md`
   - Instructions to create a reusable component in `app/components/<ComponentName>/index.tsx`.
   - Follows React 19 / Next.js best practices (Server Components by default, `"use client"` only when interactive state/hooks are required).
   - Enforces responsive Tailwind CSS design and accessibility standards (WCAG 2.1 AA, proper ARIA attributes, keyboard navigation).
   - Scaffolds a component unit test in `tests/unit/components/<ComponentName>.test.tsx` using `@testing-library/react`.

3. **`verify-and-fix` Skill**:
   - Location: `.agents/skills/verify-and-fix/SKILL.md`
   - Diagnostic and repair workflow for the TypeScript/Next.js stack:
     1. Run `mise run verify` (or `pnpm lint`, `pnpm typecheck`, `pnpm test`).
     2. Fix ESLint / Prettier formatting issues.
     3. Fix TypeScript compiler errors (`tsc --noEmit`).
     4. Resolve Vitest or Playwright failures.

4. **Integration & Discoverability**:
   - Update `AGENTS.md` and `docs/README.md` to document the newly added skills and how to consume them via `npx skills`.

## Non-Functional Requirements

- All skills must include valid YAML frontmatter (`name`, `description`, `category`, `tags`).
- Descriptions must be trigger-rich and action-oriented for progressive disclosure.
- Must keep each `SKILL.md` file concise (under 500 lines).
- Must adhere strictly to existing repository validation (`mise run verify` must pass).
