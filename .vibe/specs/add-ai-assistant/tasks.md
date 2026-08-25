# Tasks: AI Assistant Support (add-ai-assistant)

## Phase 1: Toolchain, Dependencies & Environment
- [ ] Add Vercel AI SDK dependencies (`ai`, `@ai-sdk/react`, `@ai-sdk/google`, `@ai-sdk/openai`, `@ai-sdk/anthropic`) to `package.json`
- [ ] Add AI provider environment variables to `.env.example`
- [ ] Implement AI environment variable validation schema in `app/lib/ai/env.ts` and integrate with `app/lib/env.ts`

## Phase 2: AI Core Logic & Server API Route
- [ ] Implement `app/lib/ai/mock-provider.ts` for zero-config demo streaming in development and CI/CD
- [ ] Implement `app/lib/ai/config.ts` for dynamic model & provider resolution
- [ ] Implement `app/lib/ai/system-prompt.ts` for system instructions and context grounding
- [ ] Implement `app/lib/ai/tools.ts` for generative UI tool schemas (`searchDocumentation`, `setTheme`, `getSystemInfo`, `navigatePage`)
- [ ] Implement Next.js App Router streaming endpoint `app/api/chat/route.ts` with error reporting

## Phase 3: Client Components & Generative UI (HeroUI v3)
- [ ] Implement `app/hooks/use-speech-to-text.ts` for Web Speech API voice input
- [ ] Implement `app/hooks/use-ai-assistant.ts` for state, history persistence, and keyboard shortcut (`⌘J` / `Ctrl+J`)
- [ ] Implement `app/components/AIAssistant/MarkdownRenderer.tsx` with code syntax highlighting and copy button
- [ ] Implement `app/components/AIAssistant/ToolResultCard.tsx` for rendering interactive tool execution cards
- [ ] Implement `app/components/AIAssistant/ChatMessage.tsx` and `app/components/AIAssistant/MessageList.tsx`
- [ ] Implement `app/components/AIAssistant/SuggestedPrompts.tsx` for quick-start prompt pills
- [ ] Implement `app/components/AIAssistant/ChatInput.tsx` with auto-resizing textarea and voice toggle
- [ ] Implement `app/components/AIAssistant/AssistantDrawer.tsx` and `app/components/AIAssistant/AssistantTrigger.tsx` using HeroUI v3 compound components
- [ ] Mount `<AIAssistant />` in `app/layout.tsx` and add assistant toggle button in `app/components/Navbar/index.tsx`

## Phase 4: Testing & Accessibility
- [ ] Add unit tests for API route in `tests/unit/api/chat.route.test.ts`
- [ ] Add unit tests for AI lib and tools in `tests/unit/lib/ai/config.test.ts` and `tools.test.ts`
- [ ] Add unit tests for AI components in `tests/unit/components/AIAssistant/index.test.tsx` and subcomponents
- [ ] Add E2E tests and axe-core accessibility tests in `tests/e2e/ai-assistant.spec.ts`
- [ ] Verify >= 80% coverage threshold is met with `mise run test:coverage`

## Phase 5: Documentation & Template Scaffolding
- [ ] Add documentation page in `docs/content/features/ai-assistant.mdx`
- [ ] Update `docs/content/features/_meta.js` (or meta files) to include AI Assistant page
- [ ] Update `scripts/init.ts` to include AI Assistant in project customization
- [ ] Update `AGENTS.md` and `README.md` with AI Assistant conventions
