# Implementation Plan - AI Assistant Support (add-ai-assistant)

This plan outlines the technical design and phased implementation for adding a state-of-the-art AI Assistant to `cur8d.tsx`.

---

## 1. Architectural Overview

The AI Assistant integration is built on the **Vercel AI SDK Core & React (`ai`, `@ai-sdk/react`)** combined with **HeroUI v3** compound components and **Next.js 16 App Router**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                              Client Layer                              │
│                                                                        │
│  ┌────────────────────────┐         ┌───────────────────────────────┐  │
│  │   AssistantTrigger     │ ──⌘J──> │       AssistantDrawer         │  │
│  │ (Floating / Navbar)    │         │ (HeroUI v3 Drawer Compound)   │  │
│  └────────────────────────┘         └───────────────┬───────────────┘  │
│                                                     │                  │
│                                     ┌───────────────┴───────────────┐  │
│                                     │  useChat Hook (@ai-sdk/react) │  │
│                                     │  - Token Streaming            │  │
│                                     │  - Generative UI Tool State   │  │
│                                     │  - LocalStorage Persistence   │  │
│                                     └───────────────┬───────────────┘  │
└─────────────────────────────────────────────────────┼──────────────────┘
                                                      │ POST /api/chat
                                                      │ (ReadableStream / SSE)
┌─────────────────────────────────────────────────────┼──────────────────┐
│                              Server Layer           ▼                  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Route Handler: app/api/chat/route.ts                             │  │
│  │ - Zod Request Validation                                         │  │
│  │ - Provider Resolver (Google Gemini / OpenAI / Anthropic / Mock)  │  │
│  │ - Tool Registry (searchDocumentation, setTheme, getSystemInfo)  │  │
│  │ - streamText() with error handling & telemetry                   │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
│                                     │                                  │
│                 ┌───────────────────┼───────────────────┐              │
│                 ▼                   ▼                   ▼              │
│        ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐     │
│        │  Google Gemini  │ │   OpenAI GPT    │ │ Anthropic Claude│     │
│        │ (@ai-sdk/google)│ │ (@ai-sdk/openai)│ │(@ai-sdk/anthrop)│     │
│        └─────────────────┘ └─────────────────┘ └─────────────────┘     │
│                                     ▲                                  │
│                                     │ (Zero-Config Default)            │
│                            ┌─────────────────┐                         │
│                            │ Mock Stream Dev │                         │
│                            │ (Local / CI/CD) │                         │
│                            └─────────────────┘                         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. File & Directory Structure

```
app/
├── api/
│   └── chat/
│       └── route.ts                 # AI streaming route handler (streamText)
├── components/
│   └── AIAssistant/
│       ├── index.tsx                # Container: Floating Trigger + Drawer modal
│       ├── AssistantTrigger.tsx     # Floating button with shortcut badge
│       ├── AssistantDrawer.tsx      # HeroUI v3 Drawer shell & header
│       ├── MessageList.tsx          # Scrollable message stream & typing indicator
│       ├── ChatMessage.tsx          # Individual user/assistant message & markdown
│       ├── MarkdownRenderer.tsx     # Syntax-highlighted code blocks with copy button
│       ├── ToolResultCard.tsx       # Generative UI cards for executed tools
│       ├── SuggestedPrompts.tsx     # Starter prompt pill chips
│       └── ChatInput.tsx            # Auto-growing textarea, submit button, voice toggle
├── hooks/
│   ├── use-ai-assistant.ts          # State wrapper for open/close, unread, persistent history
│   └── use-speech-to-text.ts        # Web Speech API speech-to-text hook
└── lib/
    └── ai/
        ├── config.ts                # Model & provider resolution based on env
        ├── env.ts                   # Zod schema for AI environment variables
        ├── system-prompt.ts         # Base system instructions & context grounding
        ├── tools.ts                 # Server & client tool definitions (searchDocs, etc.)
        └── mock-provider.ts         # Zero-config realistic mock streamer for dev/CI

docs/content/features/
└── ai-assistant.mdx                 # Full Nextra guide on setup, tools, and providers

tests/
├── unit/
│   ├── api/
│   │   └── chat.route.test.ts       # Vitest tests for POST /api/chat
│   ├── components/
│   │   └── AIAssistant/
│   │       ├── index.test.tsx       # Assistant open/close & trigger tests
│   │       ├── ChatInput.test.tsx   # Input handling, keyboard submit tests
│   │       └── ChatMessage.test.tsx # Markdown and tool card rendering tests
│   └── lib/
│       └── ai/
│           ├── config.test.ts       # Provider resolver tests
│           └── tools.test.ts        # Tool schemas and execution tests
└── e2e/
    └── ai-assistant.spec.ts         # Playwright E2E & @axe-core/playwright a11y tests
```

---

## 3. Proposed Changes Breakdown

### Phase 1: Toolchain, Dependencies & Environment

#### 1. [MODIFY] [package.json](file:///Users/amrabed/Library/CloudStorage/OneDrive-Personal/code/cur8d.tsx/package.json)
Add the Vercel AI SDK and provider packages:
- `ai`
- `@ai-sdk/react`
- `@ai-sdk/google`
- `@ai-sdk/openai`
- `@ai-sdk/anthropic`

#### 2. [MODIFY] [.env.example](file:///Users/amrabed/Library/CloudStorage/OneDrive-Personal/code/cur8d.tsx/.env.example)
Add AI configuration keys:
```env
# AI Assistant Configuration
AI_PROVIDER="mock" # "mock" | "google" | "openai" | "anthropic" | "custom"
AI_MODEL=""
GOOGLE_GENERATIVE_AI_API_KEY=""
OPENAI_API_KEY=""
ANTHROPIC_API_KEY=""
AI_BASE_URL=""
```

#### 3. [NEW] `app/lib/ai/env.ts` & [MODIFY] `app/lib/env.ts`
Validate AI environment variables using Zod schemas with fallback defaults.

---

### Phase 2: AI Core Logic & Server API Route

#### 1. [NEW] `app/lib/ai/config.ts`
- Factory function `getAIModel()` returning the configured provider instance.
- Graceful fallback to `mockAIProvider` if no API key is set.

#### 2. [NEW] `app/lib/ai/system-prompt.ts`
- Configurable base system prompt with application context, formatting rules, and safety bounds.

#### 3. [NEW] `app/lib/ai/tools.ts`
- Zod-schema validated tools:
  - `searchDocumentation`: searches site headings and documentation mdx.
  - `setTheme`: switches dark/light mode client state.
  - `getSystemInfo`: queries tech stack and active environment status.
  - `navigatePage`: requests page navigation.

#### 4. [NEW] `app/lib/ai/mock-provider.ts`
- High-fidelity simulated streaming generator for zero-config out-of-the-box local development and automated CI testing.

#### 5. [NEW] `app/api/chat/route.ts`
- Edge/Node.js Next.js App Router POST handler using `streamText({ model, system, messages, tools })`.
- Handles streaming errors and reports exceptions via `app/lib/error-reporting.ts`.

---

### Phase 3: Client Components & Generative UI (HeroUI v3)

#### 1. [NEW] `app/hooks/use-speech-to-text.ts`
- Web Speech API integration for speech-to-text microphone input with browser compatibility checks.

#### 2. [NEW] `app/hooks/use-ai-assistant.ts`
- Encapsulates drawer visibility, shortcut listener (`⌘J` / `Ctrl+J`), and message caching.

#### 3. [NEW] `app/components/AIAssistant/MarkdownRenderer.tsx`
- Renders streaming markdown, formatted tables, lists, and syntax-highlighted code blocks with a copy button.

#### 4. [NEW] `app/components/AIAssistant/ToolResultCard.tsx`
- Renders interactive HeroUI cards when tools (such as documentation search results) are executed.

#### 5. [NEW] `app/components/AIAssistant/ChatMessage.tsx` & `MessageList.tsx`
- Accessible message display with avatar badges, timestamps, retry/copy action buttons, and scroll anchoring.

#### 6. [NEW] `app/components/AIAssistant/ChatInput.tsx`
- Keyboard-accessible input form with auto-expanding textarea, voice toggle, send button, and stop stream button.

#### 7. [NEW] `app/components/AIAssistant/AssistantDrawer.tsx` & `index.tsx`
- HeroUI v3 Drawer compound component integration (`Drawer.Content`, `Drawer.Header`, `Drawer.Body`, `Drawer.Footer`).
- Floating Action Button trigger with tooltips and shortcut hints.

#### 8. [MODIFY] `app/layout.tsx` & `app/components/Navbar/index.tsx`
- Mount `<AIAssistant />` globally in the root layout so it is available across all routes.
- Add AI Assistant icon button to Navbar for desktop discoverability.

---

### Phase 4: Testing & Accessibility

#### 1. Unit Tests (`tests/unit/`)
- API Route tests (`tests/unit/api/chat.route.test.ts`) validating POST requests, streaming headers, and error handling.
- Component tests (`tests/unit/components/AIAssistant/`) testing open/close state, message rendering, code copy, and keyboard events.
- Tools & env tests (`tests/unit/lib/ai/`).

#### 2. End-to-End Tests (`tests/e2e/ai-assistant.spec.ts`)
- Verify floating trigger opens drawer.
- Verify `⌘J` / `Ctrl+J` shortcut toggles drawer.
- Verify typing and submitting a query streams a mock response.
- Verify axe-core accessibility audit has zero WCAG violations.

---

### Phase 5: Documentation & Scaffolding Integration

#### 1. [NEW] `docs/content/features/ai-assistant.mdx`
- Document AI Assistant features, provider configuration, tool creation, and UI customization.

#### 2. [MODIFY] `scripts/init.ts`
- Include AI Assistant project initialization prompt and documentation file updates.

#### 3. [MODIFY] `AGENTS.md` & `README.md`
- Document AI Assistant architectural conventions and commands.

---

## 4. Verification Plan

### Automated Verification
```bash
# 1. Typecheck
pnpm typecheck

# 2. Lint
pnpm lint

# 3. Unit Tests with Coverage (>= 80%)
pnpm test:coverage

# 4. End-to-End & a11y Tests
pnpm test:e2e

# 5. Production Build
pnpm build
```

### Manual Verification
- Test floating trigger and `⌘J` shortcut across Chromium, Firefox, WebKit.
- Test mock streaming responses and voice input toggle.
- Verify responsive layout on mobile viewport (375px) and desktop (1440px).
- Verify dark/light mode appearance across all assistant components.
