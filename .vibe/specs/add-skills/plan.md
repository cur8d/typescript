# Implementation Plan: Agent Skills for cur8d TypeScript

Establish structured Agent Skills in `cur8d/typescript` so AI coding agents can reliably initialize projects from the template, build App Router routes and components, deploy to hosting providers, and verify code quality.

## Proposed Changes

### Skills Scaffolding

#### [NEW] `.agents/skills/init-project/SKILL.md`
- Instructions for customizing the template into a standalone Next.js project using `scripts/init.ts`.

#### [NEW] `.agents/skills/add-route/SKILL.md`
- Instructions for creating new Next.js App Router API routes and pages with Zod validation, error handling, and unit tests.

#### [NEW] `.agents/skills/add-component/SKILL.md`
- Instructions for scaffolding accessible, responsive React components with Tailwind CSS and `@testing-library/react` tests.

#### [NEW] `.agents/skills/deploy/SKILL.md`
- Instructions for pre-deploy verification and deployment to Firebase Hosting, Vercel, or Render.

#### [NEW] `.agents/skills/verify-and-fix/SKILL.md`
- Automated diagnostic and remediation steps for linting (ESLint), type checking (TypeScript), and testing (Vitest, Playwright).

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
