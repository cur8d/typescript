import { MockLanguageModelV3 } from "ai/test";
import type { LanguageModel } from "ai";

export interface MockModelOptions {
  customResponses?: Record<string, string>;
  simulateTools?: boolean;
}

function extractPromptText(prompt: unknown): string {
  if (typeof prompt === "string") return prompt.toLowerCase();
  if (Array.isArray(prompt)) {
    return prompt
      .map((msg) => {
        if (typeof msg === "string") return msg;
        if (typeof msg === "object" && msg !== null) {
          if ("content" in msg) {
            const content = (msg as { content: unknown }).content;
            if (typeof content === "string") return content;
            if (Array.isArray(content)) {
              return content
                .map((part) => (typeof part === "object" && part && "text" in part ? String((part as { text: unknown }).text) : ""))
                .join(" ");
            }
          }
        }
        return "";
      })
      .join(" ")
      .toLowerCase();
  }
  return "";
}

export function createMockModel(options: MockModelOptions = {}): LanguageModel {
  const { simulateTools = true } = options;

  return new MockLanguageModelV3({
    modelId: "cur8d-mock-model",
    doGenerate: async ({ prompt }) => {
      const text = extractPromptText(prompt);
      const content = `Mock AI response for query: "${text}". cur8d is configured with Next.js 16, HeroUI v3, Tailwind CSS v4, and assistant-ui.`;
      return {
        content: [{ type: "text", text: content }],
        finishReason: { unified: "stop", raw: "stop" },
        usage: {
          inputTokens: { total: 10, noCache: 10, cacheRead: 0, cacheWrite: 0 },
          outputTokens: { total: 25, text: 25, reasoning: 0 },
        },
        warnings: [],
        rawCall: { rawPrompt: prompt, rawSettings: {} },
      };
    },
    doStream: async ({ prompt }) => {
      const text = extractPromptText(prompt);

      // Check for tool triggers if simulateTools is true
      if (simulateTools && (text.includes("theme") || text.includes("dark") || text.includes("light"))) {
        const theme = text.includes("light") ? "light" : "dark";
        return {
          stream: new ReadableStream({
            start(controller) {
              controller.enqueue({
                type: "tool-call",
                toolCallId: "call_theme_1",
                toolName: "setTheme",
                input: JSON.stringify({ theme }),
              });
              controller.enqueue({
                type: "finish",
                finishReason: { unified: "tool-calls", raw: "tool-calls" },
                usage: {
                  inputTokens: { total: 12, noCache: 12, cacheRead: 0, cacheWrite: 0 },
                  outputTokens: { total: 18, text: 18, reasoning: 0 },
                },
              });
              controller.close();
            },
          }),
          rawCall: { rawPrompt: prompt, rawSettings: {} },
        };
      }

      if (simulateTools && (text.includes("system") || text.includes("info") || text.includes("stack"))) {
        return {
          stream: new ReadableStream({
            start(controller) {
              controller.enqueue({
                type: "tool-call",
                toolCallId: "call_sysinfo_1",
                toolName: "getSystemInfo",
                input: JSON.stringify({}),
              });
              controller.enqueue({
                type: "finish",
                finishReason: { unified: "tool-calls", raw: "tool-calls" },
                usage: {
                  inputTokens: { total: 10, noCache: 10, cacheRead: 0, cacheWrite: 0 },
                  outputTokens: { total: 15, text: 15, reasoning: 0 },
                },
              });
              controller.close();
            },
          }),
          rawCall: { rawPrompt: prompt, rawSettings: {} },
        };
      }

      if (simulateTools && (text.includes("search") || text.includes("doc") || text.includes("guide"))) {
        return {
          stream: new ReadableStream({
            start(controller) {
              controller.enqueue({
                type: "tool-call",
                toolCallId: "call_docs_1",
                toolName: "searchDocumentation",
                input: JSON.stringify({ query: text.includes("search") ? text.replace("search", "").trim() : "overview" }),
              });
              controller.enqueue({
                type: "finish",
                finishReason: { unified: "tool-calls", raw: "tool-calls" },
                usage: {
                  inputTokens: { total: 15, noCache: 15, cacheRead: 0, cacheWrite: 0 },
                  outputTokens: { total: 20, text: 20, reasoning: 0 },
                },
              });
              controller.close();
            },
          }),
          rawCall: { rawPrompt: prompt, rawSettings: {} },
        };
      }

      // Default mock streaming response
      const chunks = [
        "👋 **Welcome to cur8d AI Assistant!**\n\n",
        "I am your built-in developer copilot running in **Zero-Config Mock Mode**. Here is what makes `cur8d` special:\n\n",
        "- ⚡ **Next.js 16 & React 19**: App Router, Server Components & Turbopack\n",
        "- 🎨 **HeroUI v3 & Tailwind CSS v4**: Accessible compound components and theme variables\n",
        "- 🤖 **assistant-ui & Vercel AI SDK**: Production-ready streaming chat and generative UI\n",
        "- 🧪 **Vitest & Playwright**: Unit tests, $\\ge 80\\%$ coverage, and accessibility audits\n\n",
        "```bash\n# Verify your project anytime\nmise run verify\n```\n\n",
        "Ask me anything about components, routing, or tools!",
      ];

      return {
        stream: new ReadableStream({
          start(controller) {
            for (let i = 0; i < chunks.length; i++) {
              controller.enqueue({
                type: "text-delta",
                id: `chunk_${i}`,
                delta: chunks[i],
              });
            }
            controller.enqueue({
              type: "finish",
              finishReason: { unified: "stop", raw: "stop" },
              usage: {
                inputTokens: { total: 20, noCache: 20, cacheRead: 0, cacheWrite: 0 },
                outputTokens: { total: chunks.join("").length, text: chunks.join("").length, reasoning: 0 },
              },
            });
            controller.close();
          },
        }),
        rawCall: { rawPrompt: prompt, rawSettings: {} },
      };
    },
  });
}

export const mockModel = createMockModel();
