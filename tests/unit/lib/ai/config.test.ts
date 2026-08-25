import { describe, it, expect, vi, beforeEach } from "vitest";
import { getModel } from "@/lib/ai/config";
import { createMockModel } from "@/lib/ai/mock-provider";
import type {
  LanguageModelV3,
  LanguageModelV3CallOptions,
  LanguageModelV3StreamPart,
} from "@ai-sdk/provider";

describe("AI Config & Model Resolution", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it.each([
    { provider: "mock", expectedModelId: "cur8d-mock-model" },
    { provider: "google", expectedModelId: "cur8d-mock-model" },
    { provider: "openai", expectedModelId: "cur8d-mock-model" },
    { provider: "anthropic", expectedModelId: "cur8d-mock-model" },
  ])(
    "should return $expectedModelId when provider is $provider without API key",
    ({ provider, expectedModelId }) => {
      const model = getModel({
        provider: provider as "mock" | "google" | "openai" | "anthropic",
      }) as LanguageModelV3;
      expect(model.modelId).toBe(expectedModelId);
    }
  );

  it("should return google model when API key is provided", () => {
    const model = getModel({ provider: "google", apiKey: "test-google-key" }) as LanguageModelV3;
    expect(model.modelId).toBe("gemini-2.5-flash");
  });

  it("should return openai model when API key is provided", () => {
    const model = getModel({ provider: "openai", apiKey: "test-openai-key", model: "gpt-4o" }) as LanguageModelV3;
    expect(model.modelId).toBe("gpt-4o");
  });

  it("should return anthropic model when API key is provided", () => {
    const model = getModel({ provider: "anthropic", apiKey: "test-anthropic-key" }) as LanguageModelV3;
    expect(model.modelId).toBe("claude-3-7-sonnet-20250219");
  });

  it("should return custom OpenAI-compatible model for custom provider", () => {
    const model = getModel({ provider: "custom", baseURL: "http://localhost:11434/v1" }) as LanguageModelV3;
    expect(model.modelId).toBe("llama3.2");
  });
});

describe("Mock Provider", () => {
  it("should support doGenerate with prompt text", async () => {
    const model = createMockModel() as unknown as LanguageModelV3;
    const res = await model.doGenerate({
      prompt: [{ role: "user", content: [{ type: "text", text: "tell me about features" }] }],
    } as LanguageModelV3CallOptions);

    const firstContent = res.content[0];
    if (firstContent.type === "text") {
      expect(firstContent.text).toContain("Mock AI response");
    }
    expect(res.finishReason.unified).toBe("stop");
  });

  it.each([
    { prompt: "please switch to dark mode", expectedTool: "setTheme" },
    { prompt: "show system info", expectedTool: "getSystemInfo" },
    { prompt: "search documentation for testing", expectedTool: "searchDocumentation" },
  ])(
    "should simulate $expectedTool tool call when prompt is '$prompt'",
    async ({ prompt, expectedTool }) => {
      const model = createMockModel({ simulateTools: true }) as unknown as LanguageModelV3;
      const res = await model.doStream({
        prompt,
      } as unknown as LanguageModelV3CallOptions);

      const reader = res.stream.getReader();
      const chunk1 = await reader.read();
      expect(chunk1.value?.type).toBe("tool-call");
      expect((chunk1.value as Extract<LanguageModelV3StreamPart, { type: "tool-call" }>)?.toolName).toBe(expectedTool);
    }
  );

  it("should stream default welcome chunks for general prompts", async () => {
    const model = createMockModel({ simulateTools: false }) as unknown as LanguageModelV3;
    const res = await model.doStream({
      prompt: "hello world",
    } as unknown as LanguageModelV3CallOptions);

    const reader = res.stream.getReader();
    const chunk1 = await reader.read();
    expect(chunk1.value?.type).toBe("text-delta");
    expect((chunk1.value as Extract<LanguageModelV3StreamPart, { type: "text-delta" }>)?.delta).toContain("Welcome to cur8d AI Assistant");
  });
});
