import { z } from "zod";
import { aiEnvSchema } from "./ai/env";

const baseEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  BLOB_READ_WRITE_TOKEN: z
    .string()
    .min(1)
    .startsWith("vercel_blob_rw_", "Token must start with 'vercel_blob_rw_'")
    .optional(),
});

const envSchema = baseEnvSchema.merge(aiEnvSchema);

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
  AI_PROVIDER: process.env.AI_PROVIDER,
  AI_MODEL: process.env.AI_MODEL,
  GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  AI_BASE_URL: process.env.AI_BASE_URL,
});

export type Env = z.infer<typeof envSchema>;
