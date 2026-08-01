import type { MetadataRoute } from "next";
import fs from "node:fs";
import path from "node:path";

const BASE_URL = "https://cur8d.dev/typescript";
// Next.js runs from the project root during build
const CONTENT_DIR = path.join(process.cwd(), "content");

/**
 * Recursively retrieves MDX and MD file paths relative to baseDir.
 * Optimized using parallel directory traversal with a shared results accumulator
 * to avoid nested Promise.all().flat() arrays and minimize memory allocations.
 */
async function getMdxFiles(
  dir: string,
  baseDir: string,
  results: string[] = [],
): Promise<string[]> {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    promises.push(
      (async () => {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          await getMdxFiles(fullPath, baseDir, results);
        } else if (
          entry.isFile() &&
          (entry.name.endsWith(".mdx") || entry.name.endsWith(".md"))
        ) {
          let relativePath = path.relative(baseDir, fullPath);
          // Normalize path separators for URLs (handle Windows) - skip POSIX split/join allocation
          if (path.sep !== "/") {
            relativePath = relativePath.split(path.sep).join("/");
          }
          // Remove extension using direct slice to avoid regex overhead/allocation
          const extLength = entry.name.endsWith(".mdx") ? 4 : 3;
          relativePath = relativePath.slice(0, -extLength);
          // Handle index files
          if (relativePath.endsWith("/index")) {
            relativePath = relativePath.slice(0, -6);
          } else if (relativePath === "index") {
            relativePath = "";
          }
          results.push(relativePath);
        }
      })()
    );
  }

  await Promise.all(promises);

  return results;
}

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    await fs.promises.access(CONTENT_DIR);
  } catch {
    return [];
  }

  const paths = await getMdxFiles(CONTENT_DIR, CONTENT_DIR);


  // Performance optimization: hoist the Date instantiation outside of the loop
  // to avoid redundant Date allocations on every mapped entry.
  const lastModified = new Date();

  return paths.map((p) => ({
    url: `${BASE_URL}/${p}${p ? "/" : ""}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
}
