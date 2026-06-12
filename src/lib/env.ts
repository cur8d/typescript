import { z } from "zod";

const envSchema = z.object({
  BLOB_READ_WRITE_TOKEN: z.string().min(1).optional(),
});

export const env = envSchema.parse({
  BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
});

export type Env = z.infer<typeof envSchema>;
