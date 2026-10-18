---
name: verify-and-fix
description: Runs repository verification checks (pnpm lint, typecheck, test, test:e2e) and iteratively fixes TypeScript compiler errors, formatting, and test failures. Use whenever the user asks to verify, test, lint, or fix code quality issues.
category: coding
tags: [typescript, nextjs, eslint, vitest, playwright, quality, cur8d]
---

# Verify and Fix Code in cur8d/typescript

This skill guides you through executing comprehensive repository verification checks, diagnosing failures, and automatically fixing linting, typing, and test errors.

## Prerequisites

- Node.js 22+ and `pnpm` installed
- `mise` installed

## Workflow

### 1. Execute Verification Suite
Run the centralized verification task:

```bash
mise run verify
```

*(This runs `pnpm lint`, `pnpm typecheck`, and `pnpm test`).*

### 2. Auto-Fix Linting and Formatting Issues
If ESLint reports fixable errors or styling problems:

```bash
pnpm lint --fix
```

### 3. Diagnose and Fix TypeScript Compilation Errors
If type errors are reported by `pnpm typecheck` (`tsc --noEmit`):
- Read the reported file paths and line numbers.
- Ensure props, parameters, and async return types are explicitly typed.
- Ensure Zod inference types (`z.infer<typeof Schema>`) match function expectations.
- Re-run type check:
  ```bash
  pnpm typecheck
  ```

### 4. Diagnose and Fix Test Failures
If Vitest unit tests fail:
- Run the failing test directly with detailed output:
  ```bash
  pnpm vitest run tests/unit/<failing-test>.test.ts
  ```
- Inspect assertions and update code or mock data accordingly.

### 5. Final Pass
Confirm all quality gates pass:

```bash
mise run verify
```

## Boundaries

✅ **Always do:**
- Always run `pnpm lint --fix` before manual edits for style problems.
- Always ensure type definitions are safe (avoid `any` casts).
- Always verify all checks pass prior to opening a PR.

🚫 **Never do:**
- Never use `@ts-ignore` without a descriptive explanation.
- Never delete or disable failing tests to pass CI.
