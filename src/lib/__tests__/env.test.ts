import { describe, it, expect, vi } from "vitest";

describe("env", () => {
  it("should validate environment variables", async () => {
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "your-blob-token");

    const { env } = await import("../env");

    expect(env.BLOB_READ_WRITE_TOKEN).toBe("your-blob-token");

    vi.unstubAllEnvs();
  });
});
