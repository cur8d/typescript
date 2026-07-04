import type { MetadataRoute } from "next";
import fs from "node:fs";
import path from "node:path";

const BASE_URL = "https://cur8d.dev/typescript";
// Next.js runs from the project root during build
const CONTENT_DIR = path.join(process.cwd(), "content");

async function getMdxFiles(dir: string, baseDir: string): Promise<string[]> {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });

  const pathsArray = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return getMdxFiles(fullPath, baseDir);
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
        return [relativePath];
      }
      return [];
    }),
  );

  return pathsArray.flat();
}

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = await getMdxFiles(CONTENT_DIR, CONTENT_DIR);

  return paths.map((p) => ({
    url: `${BASE_URL}/${p}${p ? "/" : ""}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: p === "" ? 1 : 0.8,
  }));
}
