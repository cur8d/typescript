import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  BLOB_READ_WRITE_TOKEN: z
    .string()
    .min(1)
    .startsWith("vercel_blob_rw_", "Token must start with 'vercel_blob_rw_'")
    .optional(),
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
});

export type Env = z.infer<typeof envSchema>;
