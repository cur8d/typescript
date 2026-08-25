# Requirements: AI Assistant Support (add-ai-assistant)

## 1. Executive Summary & Vision

The goal of this feature is to introduce a **state-of-the-art, production-ready AI Assistant** into the `cur8d.tsx` starter template. 

The AI Assistant will serve as a first-class interactive capability for applications built on `cur8d.tsx`, providing:
1. **Intelligent Conversational Interface**: A floating, collapsible chat drawer and full-page assistant experience with smooth streaming responses, markdown rendering, syntax-highlighted code blocks, and conversation history.
2. **Generative UI & Tool Calling**: Live client-side and server-side tool execution (e.g., searching documentation, triggering navigation, changing theme preferences, querying app state) with interactive HeroUI v3 widgets rendered directly in the message stream.
3. **Provider-Agnostic AI Architecture**: Seamless support for Google Gemini, OpenAI, Anthropic Claude, Groq, and local LLMs (via Ollama / OpenAI-compatible endpoints) using the modern **Vercel AI SDK (Core & React)**.
4. **Zero-Config Fallback / Demo Mode**: Out-of-the-box functioning mock provider so that cloned templates and CI/CD pipelines work seamlessly without requiring private API keys.
5. **Strict Quality, Accessibility & Typing**: Full compliance with `cur8d`'s strict TypeScript rules (no `any`), HeroUI v3 compound component patterns, Tailwind CSS v4 styling, WCAG AAA/AA accessibility with keyboard navigation, Vitest unit test coverage (>= 80%), and Playwright E2E testing.

---

## 2. Tech Stack & Dependencies

The AI assistant feature will integrate the following state-of-the-art libraries:

| Package | Purpose | Version / Target |
| :--- | :--- | :--- |
| `ai` | Core Vercel AI SDK (unified LLM abstraction, `streamText`, tool calling) | `^4.x` / `^5.x` |
| `@ai-sdk/react` | React 19 hooks for chat streaming (`useChat`, `useCompletion`, message state) | Latest stable |
| `@ai-sdk/google` | Google Gemini API provider (Gemini 2.5 Flash / Pro) | Latest stable |
| `@ai-sdk/openai` | OpenAI API provider (GPT-4o, GPT-4o-mini, o3) | Latest stable |
| `@ai-sdk/anthropic` | Anthropic Claude provider (Claude 3.7 Sonnet, Claude 3.5 Haiku) | Latest stable |
| `@heroui/react` | HeroUI v3 compound components (`Drawer`, `Button`, `Card`, `Tooltip`, `Badge`, `Chip`, `ScrollShadow`, `Input`, `Kbd`) | `3.2.4` (existing) |
| `lucide-react` | Icons (`Bot`, `Sparkles`, `Send`, `StopCircle`, `RotateCcw`, `Copy`, `Check`, `Mic`, `MicOff`, `Maximize2`, `Minimize2`, `X`) | `1.33.0` (existing) |
| `zod` | Schema validation for tool calls, API payloads, and environment variables | `4.4.3` (existing) |

---

## 3. Detailed Functional Requirements

### 3.1. Floating Assistant Trigger & Shell
- **Floating Action Trigger**:
  - Located in the bottom-right corner of the viewport (fixed position with subtle floating animation and glowing backdrop blur).
  - Displays icon (`Sparkles` / `Bot`) with tooltip indicating keyboard shortcut (`⌘J` on macOS, `Ctrl+J` on Linux/Windows).
  - Unread/active response badge indicator.
- **Header & Navbar Integration**:
  - Option to open the Assistant directly from the main Navbar or Command Palette (`cmdk`).
- **Responsive Drawer / Sheet**:
  - **Desktop (>= 768px)**: Smooth slide-over side drawer (width: 440px-480px) docked to the right edge with backdrop overlay or persistent side-panel mode.
  - **Mobile (< 768px)**: Full-height bottom sheet / modal covering the viewport with safe-area insets.
  - Expand to full-screen toggle button (`Maximize2` / `Minimize2`).
  - Close button and click-outside dismissal (customizable).

### 3.2. Conversational UX & Streaming
- **Token Streaming**: Real-time token-by-token streaming via Server-Sent Events (SSE) / ReadableStream.
- **Message Structure**:
  - **User Messages**: User avatar / icon, right-aligned styled bubble, timestamp.
  - **Assistant Messages**: AI avatar with model badge, left-aligned bubble, streaming markdown content.
  - **System / Status Messages**: Centered subtle notices for events (e.g., cleared history, tool invoked).
- **Streaming Markdown & Code Syntax Highlighting**:
  - Full GitHub-flavored markdown parsing (headings, lists, bold/italics, tables, blockquotes, inline links).
  - Code blocks with language badge, line numbers, and a one-click **Copy Code** button with temporary `Check` confirmation.
- **Conversation Controls**:
  - **Stop Generation**: Immediate stream abort via `AbortController`.
  - **Regenerate Response**: Re-triggers the last assistant turn.
  - **Copy Response**: Copies markdown of the message to clipboard.
  - **Clear Chat**: Resets active conversation with a confirmation prompt or undo toast.
  - **Suggested Prompt Pills**: Welcome screen displaying curated quick-start prompts (e.g., *"How do I customize themes?"*, *"Search docs for deployment"*, *"What components are available?"*).

### 3.3. Generative UI & Tool Calling
The assistant supports dynamic tool execution where the model invokes client- or server-side tools, streaming interactive HeroUI components directly into the chat:

1. **`searchDocumentation` Tool**:
   - Searches Nextra docs and sitemap for relevant topics.
   - Generates interactive result cards with article title, summary snippet, and one-click navigation links.
2. **`setTheme` Tool**:
   - Dynamically changes application theme (`light`, `dark`, or `system`).
   - Renders confirmation pill showing the active theme switch.
3. **`getSystemInfo` Tool**:
   - Returns project stack details, active Next.js/React versions, and environment configuration status.
4. **`navigatePage` Tool**:
   - Generates an interactive confirmation card to navigate the user to routes (`/`, `/docs`, `/about`, etc.).

### 3.4. Input & Voice Capabilities
- **Chat Input Area**:
  - Auto-growing multi-line textarea (1 to 5 rows).
  - Submit on `Enter` (without Shift), newline on `Shift + Enter`.
  - Send button disabled when prompt is empty or while streaming.
- **Speech-to-Text (Voice Input)**:
  - Integration with Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`).
  - Toggle microphone button (`Mic` / `MicOff`) with visual recording pulse animation.
  - Graceful fallback when Web Speech API is unsupported or microphone permission is denied.
- **Local Storage Persistence**:
  - Automatically saves active chat messages in `localStorage` under a configurable key (`cur8d_ai_messages`).
  - Export chat history as JSON or Markdown.

### 3.5. Multi-Provider & Model Architecture
- **Provider Switching via Environment Variables**:
  - `AI_PROVIDER`: `"mock"` | `"google"` | `"openai"` | `"anthropic"` | `"custom"`. Default: `"mock"`.
  - `AI_MODEL`: Specific model identifier (e.g. `gemini-2.5-flash`, `gpt-4o-mini`, `claude-3-7-sonnet`).
  - `GOOGLE_GENERATIVE_AI_API_KEY`: API key for Google Gemini.
  - `OPENAI_API_KEY`: API key for OpenAI.
  - `ANTHROPIC_API_KEY`: API key for Anthropic Claude.
  - `AI_BASE_URL`: Optional custom base URL for OpenAI-compatible local models (Ollama, vLLM, LMStudio).
- **Built-in Mock / Demo Mode**:
  - Provides realistic simulated streaming responses with typing delay and mock tool calls when no API key is provided.
  - Zero crashes or runtime exceptions when running out-of-the-box.

---

## 4. Non-Functional & Architecture Requirements

### 4.1. TypeScript & Code Standards
- 100% strict TypeScript. Zero `any` types.
- Explicit interfaces for all component props, tool inputs, tool outputs, and API contracts.
- Colocated barrel exports (`index.tsx` per component).
- Follow HeroUI v3 compound component dot-notation (`Drawer.Content`, `Card.Body`, `Tooltip.Trigger`).

### 4.2. Security & Guardrails
- **Edge / Server Execution**: AI API keys strictly kept on server side; never exposed to browser bundles.
- **Input Validation**: Zod schema validation for incoming messages and tool payloads.
- **Error Reporting**: All server exceptions and stream interruptions logged via `app/lib/error-reporting.ts`.
- **System Prompt Guardrails**: Configurable system prompt instructing the model on tone, scope, and safety boundaries.

### 4.3. Accessibility (a11y)
- WCAG AAA/AA compliance verified via `@axe-core/playwright`.
- Full keyboard operability:
  - `⌘J` / `Ctrl+J` opens/closes assistant.
  - `Escape` closes drawer and returns focus to trigger button.
  - Focus trap inside the drawer while open.
- ARIA live regions (`aria-live="polite"`) for streaming content to assist screen reader users.
- Explicit `aria-label` attributes on all icon-only buttons (`Send`, `Mic`, `Close`, `Copy`, `Regenerate`, `Stop`).

### 4.4. Testing Requirements
- **Unit Tests (Vitest 4.1 + Testing Library)**:
  - Minimum 80% line and branch coverage across all new files.
  - Test suites for:
    - `app/api/chat/route.test.ts` (API route mock streaming, error handling, provider selection).
    - `app/components/AIAssistant/index.test.tsx` (Trigger button, drawer rendering, open/close state).
    - `app/components/AIAssistant/ChatInput.test.tsx` (Textarea input, submit on Enter, voice toggle).
    - `app/components/AIAssistant/MessageList.test.tsx` (Markdown rendering, code block copy, tool invocation cards).
    - `app/lib/ai/tools.test.ts` (Tool execution logic and Zod validation).
    - `app/lib/ai/env.test.ts` (AI environment validation schema).
- **E2E Tests (Playwright 1.62)**:
  - Open assistant drawer via trigger button and keyboard shortcut.
  - Type prompt, submit, and verify streaming response in mock mode.
  - Verify tool call execution rendering interactive card.
  - Run `@axe-core/playwright` accessibility audit on the open assistant drawer.

---

## 5. Documentation & Developer Experience
- **Documentation**: New Nextra documentation page at `docs/content/features/ai-assistant.mdx` detailing:
  - Provider setup and API key configuration.
  - How to define custom server-side and client-side tools.
  - Customizing system prompts and starter questions.
  - Switching between floating drawer mode and embedded page mode.
- **Initialization Script (`scripts/init.ts`)**:
  - Include AI configuration prompts during template initialization.
- **Sample Environment Config**:
  - Update `.env.example` with commented AI provider templates.
