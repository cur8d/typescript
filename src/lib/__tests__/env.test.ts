import { describe, it, expect, vi } from "vitest";

describe("env", () => {
  it("should validate environment variables", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "your-anon-key");
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "your-blob-token");

    const { env } = await import("../env");

    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBe("https://example.supabase.co");
    expect(env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe("your-anon-key");
    expect(env.BLOB_READ_WRITE_TOKEN).toBe("your-blob-token");

    vi.unstubAllEnvs();
  });
});
