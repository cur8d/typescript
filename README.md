# cur8d — a production-ready Next.js starter

[![CI](https://github.com/cur8d/typescript/actions/workflows/check.yml/badge.svg)](https://github.com/cur8d/typescript/actions/workflows/check.yml)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=cur8d.tsx&metric=coverage)](https://sonarcloud.io/summary/new_code?id=cur8d.tsx)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=cur8d.tsx&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=cur8d.tsx)

cur8d is an opinionated, production-ready Next.js starter template optimized for data integration, accessibility, and high performance. It comes with built-in support for an AI assistant, toolchain management, automated testing, static documentation, and streamlined deployments.

## Capabilities

- **Interactive Initialization**: A custom template setup script that configures your project's metadata, repository links, hosting options, and cleans up after itself.
- **Built-in AI Assistant**: Production-ready AI copilot interface powered by `assistant-ui` and Vercel AI SDK, featuring zero-config mock mode, generative UI tools, and voice input (`⌘J` / `Ctrl+J`).
- **Strict Type-Safety**: Built with TypeScript in strict mode, including runtime verification of environment variables using Zod schemas.
- **Modern Styling & UI Foundation**: Implemented with Tailwind CSS (using CSS-first configuration and variables) and HeroUI compound components, pre-configured with a system-aware light/dark mode (`next-themes`).
- **Comprehensive Testing Rigor**: Robust test coverage enforcement (80%+ target) with Vitest for unit/component tests and Playwright for E2E, visual, and accessibility (Axe) audits.
- **Static Documentation Project**: An integrated documentation workspace powered by Nextra, generating a static site ready for GitHub Pages or Firebase hosting.
- **Zero-Friction Dev Environment**: Fully managed local development tasks and toolchains via `mise`, including custom alias shortcuts for common git and npm tasks.
- **Flexible Deployment Targets**: Configured for Serverless deployments on Vercel, Node.js web service on Render, and static site deployment on Firebase Hosting.

## Project Structure

This project is organized as a monorepo workspace managed by `pnpm`:

```text
├── app/                  # Main Next.js App Router application
│   ├── api/chat/         # Streaming AI Assistant route handler
│   ├── components/       # Reusable React components (with barrel exports)
│   │   └── AIAssistant/  # assistant-ui chat interface & generative tools
│   ├── hooks/            # Custom React hooks (e.g., search state, speech-to-text)
│   ├── lib/              # Logic layer, AI config/tools, Zod env schemas, error reporting
│   ├── layout.tsx        # Root layout with providers and AIAssistant mounted
│   └── globals.css       # Tailwind CSS v4 directives and variables
├── docs/                 # Nextra v4 documentation site (pnpm workspace package)
├── scripts/              # Template setup and utility scripts
├── tests/                # Verification suites
│   ├── unit/             # Component and utility tests (Vitest)
│   └── e2e/              # E2E and accessibility audits (Playwright)
├── .mise.toml            # Toolchain, task definitions, and run shortcuts
├── render.yaml           # Render Blueprint specification
└── pnpm-workspace.yaml   # Monorepo workspaces definition
```

## Tech Stack

The core framework and library stack includes:

- **Framework**: Next.js 16 (App Router, Server Components, Turbopack) & React 19
- **AI Interface**: assistant-ui (`@assistant-ui/react`), `@assistant-ui/react-ai-sdk` & Vercel AI SDK (`ai`)
- **Component Library**: HeroUI v3 (using the compound component dot-notation pattern)
- **Styling**: Tailwind CSS v4 & `@heroui/styles`
- **Validation**: Zod (environment configuration and tool schemas)
- **Icons**: Lucide React
- **Unit Testing**: Vitest with React Testing Library & jsdom
- **E2E & A11y Testing**: Playwright & `@axe-core/playwright`
- **Documentation**: Nextra v4 & Markdown (MDX)
- **Deployments**: Vercel CLI, Render Blueprint & Deploy Hook, and Firebase CLI

## Quick Start

### Prerequisites

Ensure you have [mise](https://mise.jdx.dev/) installed on your system.

### Installation & Setup

1. **Customize the template**:
   Run the interactive setup script to configure project names, repositories, and hosting configurations:
   ```bash
   pnpm run init
   ```

2. **Install the toolchain**:
   Let `mise` automatically download and configure Node.js and `pnpm`:
   ```bash
   mise install
   ```

3. **Install dependencies**:
   ```bash
   pnpm install
   ```

4. **Install Playwright browsers** (for E2E/A11y testing):
   ```bash
   pnpm exec playwright install --with-deps
   ```

5. **Start development**:
   ```bash
   pnpm dev
   ```

## Development Commands

All development tasks are defined in `.mise.toml` and can be run using the `mise` CLI or package manager scripts:

| Command | Alias / Task | Description |
| :--- | :--- | :--- |
| `pnpm dev` | `mise run dev` (or `d`) | Starts the local dev server with Turbopack |
| `pnpm build` | `mise run build` (or `b`) | Builds the main application for production |
| `pnpm lint` | `mise run lint` (or `l`) | Runs ESLint over the codebase |
| `pnpm test` | `mise run test` (or `t`) | Runs Vitest unit tests |
| `pnpm run test:coverage` | `mise run test:coverage` | Runs unit tests and reports coverage |
| `pnpm run test:e2e` | `mise run test:e2e` | Runs E2E and visual tests with Playwright |
| `pnpm run verify` | `mise run verify` (or `v`) | Runs linting, typechecking, and unit tests with coverage |
| `pnpm run docs:dev` | `mise run docs:dev` | Starts the local documentation server |

## CI & Code Quality

This template includes a pre-configured GitHub Actions workflow in `.github/workflows/check.yml` that runs linting, typechecking, unit tests (with LCOV coverage), and E2E tests.

It also integrates with **SonarCloud** for static code analysis, quality gate status, and test coverage reporting. To activate this integration in your repository:
1. Set up your repository on [SonarCloud](https://sonarcloud.io/).
2. Add your SonarCloud token as a repository secret named `SONAR_TOKEN` under your repository settings (`Settings > Secrets and variables > Actions`).

## Documentation

Full documentation is available at [https://cur8d.dev/typescript](https://cur8d.dev/typescript).

## License

MIT
