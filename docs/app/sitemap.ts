import type { MetadataRoute } from "next";
import fs from "node:fs";
import path from "node:path";

const BASE_URL = "https://cur8d.dev/typescript";
// Next.js runs from the project root during build
const CONTENT_DIR = path.join(process.cwd(), "content");

/**
 * Recursively retrieves MDX/MD file paths with a shared accumulator to minimize memory allocations.
 */
async function getMdxFiles(
  dir: string,
  baseDir: string,
  results: string[] = [],
): Promise<string[]> {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await getMdxFiles(fullPath, baseDir, results);
      } else if (
        entry.isFile() &&
        (entry.name.endsWith(".mdx") || entry.name.endsWith(".md"))
      ) {
        let relativePath = path.relative(baseDir, fullPath);
        // Normalize path separators for URLs (handle Windows)
        relativePath = relativePath.split(path.sep).join("/");
        // Remove extension
        relativePath = relativePath.replace(/\.mdx?$/, "");
        // Handle index files
        if (relativePath.endsWith("/index")) {
          relativePath = relativePath.slice(0, -6);
        } else if (relativePath === "index") {
          relativePath = "";
        }
        results.push(relativePath);
      }
    }),
  );

  return results;
}

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  const paths = await getMdxFiles(CONTENT_DIR, CONTENT_DIR);
  const now = new Date();

  return paths.map((p) => ({
    url: `${BASE_URL}/${p}${p ? "/" : ""}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
}
