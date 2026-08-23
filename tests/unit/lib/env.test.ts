import { describe, it, expect, vi } from "vitest";

describe("env", () => {
  it("should validate environment variables", async () => {
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "vercel_blob_rw_your-blob-token");

    const { env } = await import("@/lib/env");

    expect(env.BLOB_READ_WRITE_TOKEN).toBe("vercel_blob_rw_your-blob-token");
    expect(["development", "production", "test"]).toContain(env.NODE_ENV);

    vi.unstubAllEnvs();
  });
});
