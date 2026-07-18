import { describe, it, expect } from "vitest";
import robots from "@docs/app/robots";

describe("Docs Robots", () => {
  it("returns correct robots.txt configuration", () => {
    const result = robots();
    expect(result).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
      },
      sitemap: "https://cur8d.dev/typescript/sitemap.xml",
    });
  });
});
