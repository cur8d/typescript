import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import sitemap from "@docs/app/sitemap";
import type { MetadataRoute } from "next";
import fs from "node:fs";
import path from "node:path";

vi.mock("node:fs", () => ({
  default: {
    existsSync: vi.fn(),
    readdirSync: vi.fn(),
    statSync: vi.fn(),
  },
}));

describe("Docs Sitemap", () => {
  const mockDate = new Date("2024-01-01T00:00:00Z");
  const CONTENT_DIR = path.join(process.cwd(), "content");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns correct sitemap based on MDX files", () => {
    (fs.existsSync as any).mockReturnValue(true);
    (fs.readdirSync as any).mockImplementation((dir: string) => {
      if (dir === CONTENT_DIR) {
        return ["index.mdx", "about.md", "nested"];
      }
      if (dir === path.join(CONTENT_DIR, "nested")) {
        return ["page.mdx"];
      }
      return [];
    });

    (fs.statSync as any).mockImplementation((filePath: string) => ({
      isDirectory: () => !filePath.endsWith(".mdx") && !filePath.endsWith(".md"),
    }));

    const result = sitemap();

    expect(result).toHaveLength(3);

    const urls = result.map((entry: MetadataRoute.Sitemap[number]) => entry.url);
    expect(urls).toContain("https://cur8d.dev/typescript/");
    expect(urls).toContain("https://cur8d.dev/typescript/about/");
    expect(urls).toContain("https://cur8d.dev/typescript/nested/page/");

    const rootEntry = result.find((entry: MetadataRoute.Sitemap[number]) => entry.url === "https://cur8d.dev/typescript/");
    expect(rootEntry?.priority).toBe(1);

    const aboutEntry = result.find((entry: MetadataRoute.Sitemap[number]) => entry.url === "https://cur8d.dev/typescript/about/");
    expect(aboutEntry?.priority).toBe(0.8);

    result.forEach((entry: MetadataRoute.Sitemap[number]) => {
      expect(entry.lastModified).toEqual(mockDate);
      expect(entry.changeFrequency).toBe("monthly");
    });
  });

  it("returns empty array if content directory does not exist", () => {
    (fs.existsSync as any).mockReturnValue(false);
    const result = sitemap();
    expect(result).toEqual([]);
  });
});
