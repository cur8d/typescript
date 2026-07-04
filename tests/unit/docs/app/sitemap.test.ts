import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import sitemap from "@docs/app/sitemap";
import type { MetadataRoute } from "next";
import fs from "node:fs";
import path from "node:path";

vi.mock("node:fs", () => ({
  default: {
    existsSync: vi.fn(),
    promises: {
      readdir: vi.fn(),
    },
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

  it("returns correct sitemap based on MDX files", async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.promises.readdir).mockImplementation(async (dir: string | Buffer | URL) => {
      const dirStr = dir.toString();
      if (dirStr === CONTENT_DIR) {
        return [
          { name: "index.mdx", isDirectory: () => false, isFile: () => true },
          { name: "about.md", isDirectory: () => false, isFile: () => true },
          { name: "nested", isDirectory: () => true, isFile: () => false },
        ] as any;
      }
      if (dirStr === path.join(CONTENT_DIR, "nested")) {
        return [
          { name: "page.mdx", isDirectory: () => false, isFile: () => true },
        ] as any;
      }
      return [];
    });

    const result = await sitemap();

    expect(result).toHaveLength(3);

    const urls = result.map((entry: MetadataRoute.Sitemap[number]) => entry.url);
    expect(urls).toContain("https://cur8d.dev/typescript/");
    expect(urls).toContain("https://cur8d.dev/typescript/about/");
    expect(urls).toContain("https://cur8d.dev/typescript/nested/page/");

    const rootEntry = result.find(
      (entry: MetadataRoute.Sitemap[number]) => entry.url === "https://cur8d.dev/typescript/",
    );
    expect(rootEntry?.priority).toBe(1);

    const aboutEntry = result.find(
      (entry: MetadataRoute.Sitemap[number]) =>
        entry.url === "https://cur8d.dev/typescript/about/",
    );
    expect(aboutEntry?.priority).toBe(0.8);

    result.forEach((entry: MetadataRoute.Sitemap[number]) => {
      expect(entry.lastModified).toEqual(mockDate);
      expect(entry.changeFrequency).toBe("monthly");
    });
  });

  it("returns empty array if content directory does not exist", async () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);
    const result = await sitemap();
    expect(result).toEqual([]);
  });
});
