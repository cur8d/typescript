import { describe, it, expect, vi, beforeEach } from "vitest";
import { getModel, defaultModel } from "@/lib/ai/config";
import { createMockModel, mockModel } from "@/lib/ai/mock-provider";
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
    { provider: "unknown-provider", expectedModelId: "cur8d-mock-model" },
  ])(
    "should return $expectedModelId when provider is $provider without API key",
    ({ provider, expectedModelId }) => {
      const model = getModel({
        provider: provider as "mock" | "google" | "openai" | "anthropic",
      }) as LanguageModelV3;
      expect(model.modelId).toBe(expectedModelId);
    }
  );

  it("should return google model when API key is provided and default model name if omitted", () => {
    const model = getModel({ provider: "google", apiKey: "test-google-key" }) as LanguageModelV3;
    expect(model.modelId).toBe("gemini-2.5-flash");
  });

  it("should return openai model with default and custom model names", () => {
    const defaultOpenAI = getModel({ provider: "openai", apiKey: "test-openai-key" }) as LanguageModelV3;
    expect(defaultOpenAI.modelId).toBe("gpt-4o-mini");

    const customOpenAI = getModel({ provider: "openai", apiKey: "test-openai-key", model: "gpt-4o", baseURL: "https://api.openai.com/v1" }) as LanguageModelV3;
    expect(customOpenAI.modelId).toBe("gpt-4o");
  });

  it("should return anthropic model with default and custom model names", () => {
    const defaultAnthropic = getModel({ provider: "anthropic", apiKey: "test-anthropic-key" }) as LanguageModelV3;
    expect(defaultAnthropic.modelId).toBe("claude-3-7-sonnet-20250219");

    const customAnthropic = getModel({ provider: "anthropic", apiKey: "test-anthropic-key", model: "claude-3-haiku", baseURL: "https://api.anthropic.com" }) as LanguageModelV3;
    expect(customAnthropic.modelId).toBe("claude-3-haiku");
  });

  it("should return custom OpenAI-compatible model with default fallback values", () => {
    const model = getModel({ provider: "custom" }) as LanguageModelV3;
    expect(model.modelId).toBe("llama3.2");

    const configuredModel = getModel({ provider: "custom", apiKey: "ollama-key", baseURL: "http://localhost:11434/v1", model: "mistral" }) as LanguageModelV3;
    expect(configuredModel.modelId).toBe("mistral");
  });

  it("should resolve defaultModel export properly", () => {
    expect(defaultModel).toBeDefined();
    expect((defaultModel as unknown as LanguageModelV3).modelId).toBe("cur8d-mock-model");
  });
});

describe("Mock Provider", () => {
  it("should support doGenerate with various prompt structures", async () => {
    const model = createMockModel() as unknown as LanguageModelV3;

    // Array of objects with parts
    const res1 = await model.doGenerate({
      prompt: [
        { role: "user", content: [{ type: "text", text: "tell me about features" }] },
        { role: "user", content: [{ nonText: true }, null] },
      ],
    } as unknown as LanguageModelV3CallOptions);

    const firstContent = res1.content[0];
    if (firstContent.type === "text") {
      expect(firstContent.text).toContain("Mock AI response");
      expect(firstContent.text).toContain("tell me about features");
    }
    expect(res1.finishReason.unified).toBe("stop");

    // Array of strings and primitive objects
    const res2 = await model.doGenerate({
      prompt: ["simple string message", { content: "direct string content" }, { unexpected: true }, 12345],
    } as unknown as LanguageModelV3CallOptions);
    const content2 = res2.content[0];
    if (content2.type === "text") {
      expect(content2.text).toContain("simple string message");
      expect(content2.text).toContain("direct string content");
    }

    // Single string prompt
    const res3 = await model.doGenerate({
      prompt: "single string",
    } as unknown as LanguageModelV3CallOptions);
    const content3 = res3.content[0];
    if (content3.type === "text") {
      expect(content3.text).toContain("single string");
    }

    // Unknown prompt type
    const res4 = await model.doGenerate({
      prompt: null,
    } as unknown as LanguageModelV3CallOptions);
    const content4 = res4.content[0];
    if (content4.type === "text") {
      expect(content4.text).toContain('Mock AI response for query: "".');
    }
  });

  it.each([
    { prompt: "please switch to dark mode", expectedTool: "setTheme", expectedInput: '{"theme":"dark"}' },
    { prompt: "please switch to light mode", expectedTool: "setTheme", expectedInput: '{"theme":"light"}' },
    { prompt: "show system info and stack details", expectedTool: "getSystemInfo", expectedInput: "{}" },
    { prompt: "search documentation for testing", expectedTool: "searchDocumentation", expectedInput: '{"query":"documentation for testing"}' },
    { prompt: "show documentation guide", expectedTool: "searchDocumentation", expectedInput: '{"query":"overview"}' },
  ])(
    "should simulate $expectedTool tool call when prompt is '$prompt'",
    async ({ prompt, expectedTool, expectedInput }) => {
      const model = createMockModel({ simulateTools: true }) as unknown as LanguageModelV3;
      const res = await model.doStream({
        prompt,
      } as unknown as LanguageModelV3CallOptions);

      const reader = res.stream.getReader();
      const chunk1 = await reader.read();
      expect(chunk1.value?.type).toBe("tool-call");
      const toolCall = chunk1.value as Extract<LanguageModelV3StreamPart, { type: "tool-call" }>;
      expect(toolCall.toolName).toBe(expectedTool);
      expect(toolCall.input).toBe(expectedInput);

      const chunk2 = await reader.read();
      expect(chunk2.value?.type).toBe("finish");
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

    // Read until finish
    let finished = false;
    while (!finished) {
      const { value, done } = await reader.read();
      if (done || value?.type === "finish") {
        finished = true;
      }
    }
    expect(finished).toBe(true);
  });

  it("should expose static singleton mockModel", () => {
    expect(mockModel).toBeDefined();
  });
});
