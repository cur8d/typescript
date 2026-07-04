import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import sitemap from "@/sitemap";

describe("Sitemap", () => {
  const mockDate = new Date("2024-01-01T00:00:00Z");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the correct sitemap structure", () => {
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
