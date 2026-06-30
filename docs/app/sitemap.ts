import type { MetadataRoute } from "next";
import fs from "node:fs";
import path from "node:path";

const BASE_URL = "https://cur8d.dev/typescript";
// Next.js runs from the project root during build
const CONTENT_DIR = path.join(process.cwd(), "content");

function getMdxFiles(dir: string, baseDir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const files = fs.readdirSync(dir);
  let paths: string[] = [];

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      paths = paths.concat(getMdxFiles(fullPath, baseDir));
    } else if (file.endsWith(".mdx") || file.endsWith(".md")) {
      let relativePath = path.relative(baseDir, fullPath);
      // Remove extension
      relativePath = relativePath.replace(/\.mdx?$/, "");
      // Handle index files
      if (relativePath.endsWith("/index")) {
        relativePath = relativePath.slice(0, -6);
      } else if (relativePath === "index") {
        relativePath = "";
      }
      paths.push(relativePath);
    }
  }

  return paths;
}

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = getMdxFiles(CONTENT_DIR, CONTENT_DIR);

  return paths.map((p) => ({
    url: `${BASE_URL}/${p}${p ? "/" : ""}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: p === "" ? 1 : 0.8,
  }));
}
