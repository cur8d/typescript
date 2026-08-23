import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: "https://typescript.cur8d.dev",
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
