# Tasks: AI Assistant Support (add-ai-assistant)

## Phase 1: Toolchain, Dependencies & Environment
- [x] Add `assistant-ui` and Vercel AI SDK dependencies (`@assistant-ui/react`, `@assistant-ui/react-ai-sdk`, `@assistant-ui/react-markdown`, `@assistant-ui/react-syntax-highlighter`, `ai`, `@ai-sdk/google`, `@ai-sdk/openai`, `@ai-sdk/anthropic`) to `package.json`
- [x] Add AI provider environment variables to `.env.example`
- [x] Implement AI environment variable validation schema in `app/lib/ai/env.ts` and integrate with `app/lib/env.ts`

## Phase 2: AI Core Logic & Server API Route
- [x] Implement `app/lib/ai/mock-provider.ts` for zero-config demo streaming in development and CI/CD
- [x] Implement `app/lib/ai/config.ts` for dynamic model & provider resolution
- [x] Implement `app/lib/ai/system-prompt.ts` for system instructions and context grounding
- [x] Implement `app/lib/ai/tools.ts` for generative UI tool schemas (`searchDocumentation`, `setTheme`, `getSystemInfo`, `navigatePage`)
- [x] Implement Next.js App Router streaming endpoint `app/api/chat/route.ts` with error reporting

## Phase 3: Client Components (`assistant-ui`) & Generative UI
- [x] Implement `app/hooks/use-speech-to-text.ts` for Web Speech API voice input
- [x] Configure `useChatRuntime` in `app/components/AIAssistant/index.tsx`
- [x] Implement customized `app/components/AIAssistant/Thread.tsx` with `@assistant-ui/react-markdown` and syntax highlighting
- [x] Implement customized `app/components/AIAssistant/Composer.tsx` with voice input toggle and shortcut hint
- [x] Implement generative UI tool renderers under `app/components/AIAssistant/tools/` (`DocSearchTool.tsx`, `ThemeTool.tsx`, `SystemInfoTool.tsx`)
- [x] Implement floating trigger button and modal shell `app/components/AIAssistant/AssistantTrigger.tsx`
- [x] Mount `<AIAssistant />` in `app/layout.tsx` and add assistant toggle button in `app/components/Navbar/index.tsx`

## Phase 4: Testing & Accessibility
- [x] Add unit tests for API route in `tests/unit/api/chat.route.test.ts`
- [x] Add unit tests for AI lib and tools in `tests/unit/lib/ai/config.test.ts` and `tools.test.ts`
- [x] Add unit tests for AI assistant components in `tests/unit/components/AIAssistant/index.test.tsx`
- [ ] Add E2E tests and axe-core accessibility tests in `tests/e2e/ai-assistant.spec.ts`
- [ ] Verify >= 80% coverage threshold is met with `mise run test:coverage`

## Phase 5: Documentation & Template Scaffolding
- [ ] Add documentation page in `docs/content/features/ai-assistant.mdx`
- [ ] Update `docs/content/features/_meta.js` to include AI Assistant page
- [ ] Update `scripts/init.ts` to include AI Assistant in project customization
- [ ] Update `AGENTS.md` and `README.md` with AI Assistant conventions
