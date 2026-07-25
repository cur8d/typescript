import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("Sitemap", () => {
  const mockDate = new Date("2024-01-01T00:00:00Z");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the correct sitemap structure", async () => {
    // Import sitemap dynamically within the test run after the fake system time has been set,
    // or test against LAST_MODIFIED by mocking/reimporting. Since app/sitemap.ts instantiates
    // LAST_MODIFIED during module load time, the module-level constant is created when the module
    // is imported. We dynamically import it here under the fake timer context.
    const { default: sitemap } = await import("@/sitemap");
    const result = sitemap();

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);

    const entry = result[0];
    expect(entry).toEqual({
      url: "https://typescript.cur8d.dev",
      lastModified: mockDate,
      changeFrequency: "monthly",
      priority: 1,
    });
  });
});
