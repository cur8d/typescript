# Walkthrough - Dynamic SonarCloud Coverage Badge

This walkthrough documents the configuration and integration of SonarCloud to display a dynamic test coverage badge.

## Changes Made

### 1. Vitest Configuration
- Modified [vitest.config.ts](file:///Users/amrabed/Library/CloudStorage/OneDrive-Personal/code/cur8d.tsx/vitest.config.ts) to:
  - Configure coverage reporters to output only `text`, `lcov` (required by Sonar), and `html` formats.
  - Exclude `**/.xdg/**` from test execution search.

### 2. SonarCloud Configuration
- Created [sonar-project.properties](file:///Users/amrabed/Library/CloudStorage/OneDrive-Personal/code/cur8d.tsx/sonar-project.properties) in the repository root to configure project keys, source directories, test inclusions, and paths for test coverage analysis.

### 3. CI Workflow
- Modified the [check.yml](file:///Users/amrabed/Library/CloudStorage/OneDrive-Personal/code/cur8d.tsx/.github/workflows/check.yml) workflow to add a SonarCloud scan analysis step after test execution.

### 4. Template Setup Script
- Modified [init.ts](file:///Users/amrabed/Library/CloudStorage/OneDrive-Personal/code/cur8d.tsx/scripts/init.ts) to include `sonar-project.properties` in the list of files updated during project naming initialization.

### 5. Documentation & Badge
- Reverted static badge generation scripts and files.
- Modified [README.md](file:///Users/amrabed/Library/CloudStorage/OneDrive-Personal/code/cur8d.tsx/README.md) to use SonarCloud's dynamic coverage and Quality Gate badge URLs.
- Added documentation in [README.md](file:///Users/amrabed/Library/CloudStorage/OneDrive-Personal/code/cur8d.tsx/README.md) explaining how to add the `SONAR_TOKEN` secret to GitHub repository settings.

---

## Verification Results

### Automated Verification
- Ran coverage test command successfully.
- Verified that `coverage/lcov.info` is successfully generated and ready for the Sonar scanner.
