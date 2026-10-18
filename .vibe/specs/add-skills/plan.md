# Implementation Plan: Agent Skills for cur8d TypeScript

Establish structured Agent Skills in `cur8d/typescript` so AI coding agents can reliably build, extend, test, and maintain Next.js 15+ / React 19 / TypeScript applications.

## Proposed Changes

### Skills Scaffolding

#### [NEW] `.agents/skills/add-route/SKILL.md`
- Provide actionable instructions for creating new Next.js App Router API routes and pages with Zod validation, error handling, and unit tests.

#### [NEW] `.agents/skills/add-component/SKILL.md`
- Provide instructions for scaffolding accessible, responsive React components with Tailwind CSS and `@testing-library/react` tests.

#### [NEW] `.agents/skills/verify-and-fix/SKILL.md`
- Provide automated diagnostic and remediation steps for linting (ESLint), type checking (TypeScript), and testing (Vitest, Playwright).

---

### Documentation & Agents Guidance

#### [MODIFY] `AGENTS.md`
- Document the newly introduced skills under `.agents/skills/`.
- Provide guidance on using `npx skills add cur8d/typescript` or invoking skills directly.

#### [MODIFY] `docs/README.md`
- Add an "Agent Skills" section explaining how developers and agents can consume the repository's built-in skills.

---

### Verification Plan

#### Automated Verification
- Run `mise run verify` (ESLint, TypeScript compilation, and Vitest suite).
- Run `npx skills ls` to confirm skills are detected by the skills CLI.
