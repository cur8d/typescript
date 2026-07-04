import { describe, it, expect } from "vitest";
import robots from "@/robots";

describe("robots function", () => {
  it("returns the correct robots configuration", () => {
    const result = robots();

    expect(result).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
      },
      sitemap: "https://typescript.cur8d.dev/sitemap.xml",
    });
  });
});
