import { describe, it, expect, vi, beforeEach } from "vitest";
import { getModel } from "@/lib/ai/config";
import { createMockModel, mockModel } from "@/lib/ai/mock-provider";

describe("AI Config & Model Resolution", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("should return mockModel by default when AI_PROVIDER is mock", () => {
    const model = getModel({ provider: "mock" });
    expect(model.modelId).toBe("cur8d-mock-model");
  });

  it("should return mockModel when google provider has no API key", () => {
    const model = getModel({ provider: "google" });
    expect(model.modelId).toBe("cur8d-mock-model");
  });

  it("should return google model when API key is provided", () => {
    const model = getModel({ provider: "google", apiKey: "test-google-key" });
    expect(model.modelId).toBe("gemini-2.5-flash");
  });

  it("should return mockModel when openai provider has no API key", () => {
    const model = getModel({ provider: "openai" });
    expect(model.modelId).toBe("cur8d-mock-model");
  });

  it("should return openai model when API key is provided", () => {
    const model = getModel({ provider: "openai", apiKey: "test-openai-key", model: "gpt-4o" });
    expect(model.modelId).toBe("gpt-4o");
  });

  it("should return mockModel when anthropic provider has no API key", () => {
    const model = getModel({ provider: "anthropic" });
    expect(model.modelId).toBe("cur8d-mock-model");
  });

  it("should return anthropic model when API key is provided", () => {
    const model = getModel({ provider: "anthropic", apiKey: "test-anthropic-key" });
    expect(model.modelId).toBe("claude-3-7-sonnet-20250219");
  });

  it("should return custom OpenAI-compatible model for custom provider", () => {
    const model = getModel({ provider: "custom", baseURL: "http://localhost:11434/v1" });
    expect(model.modelId).toBe("llama3.2");
  });
});

describe("Mock Provider", () => {
  it("should support doGenerate with prompt text", async () => {
    const model = createMockModel();
    const res = await model.doGenerate({
      prompt: [{ role: "user", content: [{ type: "text", text: "tell me about features" }] }],
    } as any);

    expect(res.content[0].text).toContain("Mock AI response");
    expect(res.finishReason.unified).toBe("stop");
  });

  it("should simulate theme tool call when prompt mentions theme", async () => {
    const model = createMockModel({ simulateTools: true });
    const res = await model.doStream({
      prompt: "please switch to dark mode",
    } as any);

    const reader = res.stream.getReader();
    const chunk1 = await reader.read();
    expect(chunk1.value?.type).toBe("tool-call");
    expect((chunk1.value as any)?.toolName).toBe("setTheme");
  });

  it("should simulate system info tool call when prompt mentions system info", async () => {
    const model = createMockModel({ simulateTools: true });
    const res = await model.doStream({
      prompt: "show system info",
    } as any);

    const reader = res.stream.getReader();
    const chunk1 = await reader.read();
    expect(chunk1.value?.type).toBe("tool-call");
    expect((chunk1.value as any)?.toolName).toBe("getSystemInfo");
  });

  it("should simulate search documentation tool call when prompt mentions doc search", async () => {
    const model = createMockModel({ simulateTools: true });
    const res = await model.doStream({
      prompt: "search documentation for testing",
    } as any);

    const reader = res.stream.getReader();
    const chunk1 = await reader.read();
    expect(chunk1.value?.type).toBe("tool-call");
    expect((chunk1.value as any)?.toolName).toBe("searchDocumentation");
  });

  it("should stream default welcome chunks for general prompts", async () => {
    const model = createMockModel({ simulateTools: false });
    const res = await model.doStream({
      prompt: "hello world",
    } as any);

    const reader = res.stream.getReader();
    const chunk1 = await reader.read();
    expect(chunk1.value?.type).toBe("text-delta");
    expect((chunk1.value as any)?.delta).toContain("Welcome to cur8d AI Assistant");
  });
});
