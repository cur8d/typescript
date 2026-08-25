import type { LanguageModel } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { env } from "@/lib/env";
import { mockModel } from "./mock-provider";

export interface ModelResolutionOptions {
  provider?: "mock" | "google" | "openai" | "anthropic" | "custom" | string;
  model?: string;
  apiKey?: string;
  baseURL?: string;
}

export function getModel(options: ModelResolutionOptions = {}): LanguageModel {
  const provider = options.provider || env.AI_PROVIDER || "mock";
  const modelName = options.model || env.AI_MODEL;
  const apiKey = options.apiKey;
  const baseURL = options.baseURL || env.AI_BASE_URL;

  switch (provider) {
    case "google": {
      const key = apiKey || env.GOOGLE_GENERATIVE_AI_API_KEY;
      if (!key) return mockModel;
      const google = createGoogleGenerativeAI({ apiKey: key });
      return google(modelName || "gemini-2.5-flash");
    }

    case "openai": {
      const key = apiKey || env.OPENAI_API_KEY;
      if (!key) return mockModel;
      const openai = createOpenAI({
        apiKey: key,
        baseURL: baseURL || undefined,
      });
      return openai(modelName || "gpt-4o-mini");
    }

    case "anthropic": {
      const key = apiKey || env.ANTHROPIC_API_KEY;
      if (!key) return mockModel;
      const anthropic = createAnthropic({
        apiKey: key,
        baseURL: baseURL || undefined,
      });
      return anthropic(modelName || "claude-3-7-sonnet-20250219");
    }

    case "custom": {
      const customOpenAI = createOpenAI({
        apiKey: apiKey || env.OPENAI_API_KEY || "custom",
        baseURL: baseURL || "http://localhost:11434/v1",
      });
      return customOpenAI(modelName || "llama3.2");
    }

    case "mock":
    default:
      return mockModel;
  }
}

export const defaultModel = getModel();
