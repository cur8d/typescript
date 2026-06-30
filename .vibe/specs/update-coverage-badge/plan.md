# Implementation Plan - Up-to-date Coverage Badge (SonarCloud Integration)

This plan details how to integrate SonarCloud to display an up-to-date, automated coverage badge in the project `README.md` based on Vitest's coverage report.

## Proposed Changes

### 1. Vitest Configuration

#### [MODIFY] [vitest.config.ts](file:///Users/amrabed/Library/CloudStorage/OneDrive-Personal/code/cur8d.tsx/vitest.config.ts)
- Configure the coverage provider to output `lcov` format (required by SonarCloud for tracking test coverage).
- Explicitly exclude the `.xdg` folder to prevent local sandboxing conflicts.

### 2. SonarCloud Configuration

#### [NEW] [sonar-project.properties](file:///Users/amrabed/Library/CloudStorage/OneDrive-Personal/code/cur8d.tsx/sonar-project.properties)
- Define standard SonarCloud properties (organization, project keys, paths for source files and tests, and lcov coverage report path: `coverage/lcov.info`).

### 3. CI Workflow

#### [MODIFY] [check.yml](file:///Users/amrabed/Library/CloudStorage/OneDrive-Personal/code/cur8d.tsx/.github/workflows/check.yml)
- Add a SonarCloud Scan step after the tests are run.
- Set `continue-on-error: true` so CI doesn't break for local fork PRs or before developers configure their Sonar credentials.

### 4. Template Setup Script

#### [MODIFY] [init.ts](file:///Users/amrabed/Library/CloudStorage/OneDrive-Personal/code/cur8d.tsx/scripts/init.ts)
- Add `sonar-project.properties` to the template initialization files list to automate project renaming.

### 5. Documentation & Badge

#### [MODIFY] [README.md](file:///Users/amrabed/Library/CloudStorage/OneDrive-Personal/code/cur8d.tsx/README.md)
- Replace static shields.io badge with SonarCloud's dynamic coverage badge URL.

---

## Verification Plan

### Automated Tests
- Run `node ./node_modules/vitest/vitest.mjs run --coverage` and verify that `coverage/lcov.info` is successfully generated.
