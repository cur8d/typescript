import { z } from "zod";

export const aiEnvSchema = z.object({
  AI_PROVIDER: z
    .enum(["mock", "google", "openai", "anthropic", "custom"])
    .default("mock"),
  AI_MODEL: z.string().optional(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  AI_BASE_URL: z.string().url().optional().or(z.literal("")),
});

export const aiEnv = aiEnvSchema.parse({
  AI_PROVIDER: process.env.AI_PROVIDER,
  AI_MODEL: process.env.AI_MODEL,
  GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  AI_BASE_URL: process.env.AI_BASE_URL,
});

export type AIEnv = z.infer<typeof aiEnvSchema>;
