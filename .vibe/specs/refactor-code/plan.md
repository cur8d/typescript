# Implementation Plan - Restructure Codebase and Move Tests to /tests/unit

This plan details the steps required to reorganize the codebase structure to align with the new top-level `app` layout.

## Proposed Changes

### Reorganize Directory Structure

Move source code directories to place `app` at the top level and place `components`, `lib`, and `hooks` under it:
- `src/app` -> `app/`
- `src/components` -> `app/components/`
- `src/lib` -> `app/lib/`
- `src/hooks` -> `app/hooks/`
- `src/test/setup.ts` -> `tests/unit/setup.ts`
- Remove the empty `src/` directory.

### Relocate Test Files

Move all test files currently residing in `__tests__` folders under `src/` into a new centralized `tests/unit/` folder, maintaining their original layout prefix (e.g., `tests/unit/components/...`, `tests/unit/app/...`, `tests/unit/lib/...`, and `tests/unit/hooks/...`).
- Delete all empty `__tests__` folders under the source directories.

### Update Path Alias Configuration

#### [tsconfig.json](file:///Users/amrabed/Library/CloudStorage/OneDrive-Personal/code/cur8d.tsx/tsconfig.json)
Update path mappings so that `@/*` resolves to `./app/*` instead of `./src/*`:
- `@/*` -> `["./app/*"]`
- `@/components/*` -> `["./app/components/*"]`
- `@/lib/*` -> `["./app/lib/*"]`
- `@/types/*` -> `["./app/types/*"]`
- `@/hooks/*` -> `["./app/hooks/*"]`
- `@/config/*` -> `["./app/config/*"]`

#### [vitest.config.ts](file:///Users/amrabed/Library/CloudStorage/OneDrive-Personal/code/cur8d.tsx/vitest.config.ts)
- Update `test.setupFiles` to reference `./tests/unit/setup.ts`.
- Update `resolve.alias` mapping for `@` to resolve to the absolute path of `./app`.

### Update Source Code & Test Imports to use `@/`

Ensure all relative imports in test files that reference source files are updated to use `@/` path aliases.

- [x] `tests/unit/app/not-found.test.tsx` -> Update `../not-found` to `@/not-found`
- [x] `tests/unit/app/page.test.tsx` -> Update `../page` to `@/page`
- [x] `tests/unit/components/CodeSnippet/index.test.tsx` -> Update `../index` to `@/components/CodeSnippet`
- [x] `tests/unit/components/Features/index.test.tsx` -> Update `../index` to `@/components/Features`
- [x] `tests/unit/components/Footer/index.test.tsx` -> Update `../index` to `@/components/Footer`
- [x] `tests/unit/components/Hero/index.test.tsx` -> Update `../index` to `@/components/Hero`
- [x] `tests/unit/components/Navbar/index.test.tsx` -> Update `../index` to `@/components/Navbar`
- [x] `tests/unit/components/ThemeToggle/index.test.tsx` -> Update `../index` to `@/components/ThemeToggle`
- [x] `tests/unit/hooks/use-search-state.test.tsx` -> Update `../use-search-state` to `@/hooks/use-search-state`
- [x] `tests/unit/lib/env.test.ts` -> Update `../env` to `@/lib/env`

### Update Miscellaneous Files and Documentation

#### [scripts/init.ts](file:///Users/amrabed/Library/CloudStorage/OneDrive-Personal/code/cur8d.tsx/scripts/init.ts)
Update target paths from `src/` to `app/`.

#### [AGENTS.md](file:///Users/amrabed/Library/CloudStorage/OneDrive-Personal/code/cur8d.tsx/AGENTS.md)
Update documentation paths to reflect the new structure.

#### [docs/](file:///Users/amrabed/Library/CloudStorage/OneDrive-Personal/code/cur8d.tsx/docs) content files
Update all occurrences of `src/` inside the `docs/content/` files.

## Verification Plan

### Automated Tests
- Run all verifications using `mise`:
  ```bash
  mise run verify
  ```
- Run production build:
  ```bash
  pnpm build
  ```
