import type { MetadataRoute } from "next";

// Performance optimization: hoist the Date instantiation outside of the function
// to avoid redundant Date allocations on every sitemap invocation.
const LAST_MODIFIED = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://typescript.cur8d.dev",
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
