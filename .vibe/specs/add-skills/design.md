# Design: Agent Skills for cur8d TypeScript

## Architecture Overview

```mermaid
flowchart TD
    User["Developer Prompt / Issue"] --> Agent["AI Agent (Claude Code, Cursor, Antigravity)"]
    Agent --> Registry[".agents/skills/ Index"]

    subgraph Skills [".agents/skills/"]
        Init["init-project"]
        Route["add-route"]
        Comp["add-component"]
        Deploy["deploy"]
        Verify["verify-and-fix"]
    end

    Registry --> Init & Route & Comp & Deploy & Verify

    Init -->|"Executes"| InitScript["scripts/init.ts<br/>package.json, .env.local"]
    Route -->|"Scaffolds"| RouteCode["app/api/<route>/route.ts<br/>tests/unit/api/<route>.test.ts"]
    Comp -->|"Scaffolds"| CompCode["app/components/<Comp>/<br/>tests/unit/components/<Comp>.test.tsx"]
    Deploy -->|"Deploys via"| Host["Firebase / Vercel / Render"]
    Verify -->|"Executes"| Tasks["mise run verify (eslint + tsc + vitest)"]
```

## Directory Structure

Skills will be placed in `.agents/skills/` to ensure immediate compatibility with `skills.sh`, Claude Code, Cursor, and other agent platforms:

```text
typescript/
├── .agents/
│   └── skills/
│       ├── init-project/
│       │   └── SKILL.md
│       ├── add-route/
│       │   └── SKILL.md
│       ├── add-component/
│       │   └── SKILL.md
│       ├── deploy/
│       │   └── SKILL.md
│       └── verify-and-fix/
│           └── SKILL.md
├── app/
├── tests/
├── scripts/
├── package.json
└── mise.toml
```

## Skill Definitions

### 1. `init-project`
- **Frontmatter**:
  ```yaml
  ---
  name: init-project
  description: Initializes and customizes a new Next.js project repository from the cur8d/typescript template. Use whenever asked to initialize, bootstrap, or fork this template into a new project.
  category: system
  tags: [scaffolding, template, init, nextjs, cur8d]
  ---
  ```
- **Rules**:
  - Leverages `pnpm tsx scripts/init.ts` or updates `package.json`, `app/layout.tsx`, `render.yaml`.
  - Copies `.env.example` to `.env.local`.
  - Runs `pnpm install` and verifies baseline build.

### 2. `add-route`
- **Frontmatter**:
  ```yaml
  ---
  name: add-route
  description: Scaffolds a new Next.js App Router API route or page with Zod validation, error handling, and Vitest tests. Use whenever asked to create, add, or implement an API endpoint or page.
  category: coding
  tags: [typescript, nextjs, react, api, cur8d]
  ---
  ```
- **Rules**:
  - Validates request payloads with Zod.
  - Returns structured `NextResponse.json(...)` with consistent status codes.
  - Adds unit/integration test in `tests/unit/api/`.

### 3. `add-component`
- **Frontmatter**:
  ```yaml
  ---
  name: add-component
  description: Scaffolds a new accessible React 19 UI component with Tailwind CSS styling and Vitest component tests. Use whenever asked to create, add, or build a UI component.
  category: coding
  tags: [typescript, react, tailwind, ui, a11y, cur8d]
  ---
  ```
- **Rules**:
  - Defaults to Server Components; marks `"use client"` only when client interactivity is required.
  - Adheres to WCAG 2.1 AA accessibility guidelines (semantic HTML, keyboard focus, ARIA labels).
  - Includes component test in `tests/unit/components/` using `@testing-library/react`.

### 4. `deploy`
- **Frontmatter**:
  ```yaml
  ---
  name: deploy
  description: Verifies build and deploys the Next.js application to Firebase Hosting, Vercel, or Render. Use whenever asked to deploy, release, or publish the web application.
  category: coding
  tags: [typescript, nextjs, firebase, vercel, deploy, cur8d]
  ---
  ```
- **Rules**:
  - Mandates running `mise run verify` and `pnpm build` first.
  - Guides deployment to configured target (`firebase deploy --only hosting`, `vercel deploy --prod`, etc.).

### 5. `verify-and-fix`
- **Frontmatter**:
  ```yaml
  ---
  name: verify-and-fix
  description: Runs repository verification checks (pnpm lint, typecheck, test, test:e2e) and iteratively fixes TypeScript compiler errors and test failures. Use whenever asked to verify, test, or fix code quality issues.
  category: coding
  tags: [typescript, vitest, playwright, eslint, cur8d]
  ---
  ```
- **Rules**:
  - Runs `mise run verify` (or `pnpm lint`, `pnpm typecheck`, `pnpm test`).
  - Diagnoses and fixes compiler or test errors iteratively.
  - Preserves existing comments and architectural patterns.
