import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
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

  it("returns correct sitemap based on MDX files including root index and nested index", async () => {
    (fs.existsSync as Mock).mockReturnValue(true);
    (fs.promises.readdir as Mock).mockImplementation((dir: string) => {
      if (dir === CONTENT_DIR) {
        return Promise.resolve([
          { name: "index.mdx", isDirectory: () => false, isFile: () => true },
          { name: "about.md", isDirectory: () => false, isFile: () => true },
          { name: "nested", isDirectory: () => true, isFile: () => false },
          { name: "guides", isDirectory: () => true, isFile: () => false },
          { name: "other.txt", isDirectory: () => false, isFile: () => true }, // Non-MDX file ignored
        ]);
      }
      if (dir === path.join(CONTENT_DIR, "nested")) {
        return Promise.resolve([
          { name: "page.mdx", isDirectory: () => false, isFile: () => true },
        ]);
      }
      if (dir === path.join(CONTENT_DIR, "guides")) {
        return Promise.resolve([
          { name: "index.md", isDirectory: () => false, isFile: () => true }, // Nested index file
        ]);
      }
      return Promise.resolve([]);
    });

    const result = await sitemap();

    expect(result).toHaveLength(4);

    const urls = result.map((entry: MetadataRoute.Sitemap[number]) => entry.url);
    expect(urls).toContain("https://cur8d.dev/typescript/");
    expect(urls).toContain("https://cur8d.dev/typescript/about/");
    expect(urls).toContain("https://cur8d.dev/typescript/nested/page/");
    expect(urls).toContain("https://cur8d.dev/typescript/guides/");

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

  it("handles Windows path separators gracefully", async () => {
    (fs.existsSync as Mock).mockReturnValue(true);
    (fs.promises.readdir as Mock).mockImplementation((dir: string) => {
      if (dir === CONTENT_DIR) {
        return Promise.resolve([
          { name: "guide.mdx", isDirectory: () => false, isFile: () => true },
        ]);
      }
      return Promise.resolve([]);
    });

    const originalSep = path.sep;
    try {
      Object.defineProperty(path, "sep", { value: "\\", configurable: true });
      const result = await sitemap();
      expect(result).toHaveLength(1);
      expect(result[0].url).toBe("https://cur8d.dev/typescript/guide/");
    } finally {
      Object.defineProperty(path, "sep", { value: originalSep, configurable: true });
    }
  });

  it("returns empty array if content directory does not exist", async () => {
    (fs.existsSync as Mock).mockReturnValue(false);
    const result = await sitemap();
    expect(result).toEqual([]);
  });
});
