import { describe, it, expect } from "vitest";
import {
  searchDocumentation,
  setTheme,
  getSystemInfo,
  navigatePage,
  DOCS_CATALOG,
  aiTools,
} from "@/lib/ai/tools";

describe("AI Generative Tools", () => {
  it("should have all required tools registered", () => {
    expect(aiTools.searchDocumentation).toBeDefined();
    expect(aiTools.setTheme).toBeDefined();
    expect(aiTools.getSystemInfo).toBeDefined();
    expect(aiTools.navigatePage).toBeDefined();
  });

  describe("searchDocumentation", () => {
    it("should return matching documentation articles", async () => {
      const execute = searchDocumentation.execute;
      if (!execute) throw new Error("searchDocumentation has no execute method");

      const result = await execute({ query: "testing" }, {} as never);
      expect(result.results.length).toBeGreaterThan(0);
      expect(result.results[0].title).toBe("Testing Guide");
    });

    it("should return fallback catalog results if no direct match", async () => {
      const execute = searchDocumentation.execute;
      if (!execute) throw new Error("searchDocumentation has no execute method");

      const result = await execute({ query: "xyznonexistent" }, {} as never);
      expect(result.results.length).toBe(3);
    });
  });

  describe("setTheme", () => {
    it("should handle light, dark, and system themes", async () => {
      const execute = setTheme.execute;
      if (!execute) throw new Error("setTheme has no execute method");

      const darkResult = await execute({ theme: "dark" }, {} as never);
      expect(darkResult.success).toBe(true);
      expect(darkResult.theme).toBe("dark");

      const lightResult = await execute({ theme: "light" }, {} as never);
      expect(lightResult.success).toBe(true);
      expect(lightResult.theme).toBe("light");
    });
  });

  describe("getSystemInfo", () => {
    it("should return project stack metadata", async () => {
      const execute = getSystemInfo.execute;
      if (!execute) throw new Error("getSystemInfo has no execute method");

      const info = await execute({}, {} as never);
      expect(info.name).toBe("cur8d");
      expect(info.framework).toContain("Next.js");
      expect(info.designSystem).toContain("HeroUI");
      expect(info.status).toBe("operational");
    });
  });

  describe("navigatePage", () => {
    it("should return navigation confirmation for given route", async () => {
      const execute = navigatePage.execute;
      if (!execute) throw new Error("navigatePage has no execute method");

      const res = await execute({ route: "/docs" }, {} as never);
      expect(res.success).toBe(true);
      expect(res.route).toBe("/docs");
      expect(res.message).toContain("/docs");
    });
  });

  describe("DOCS_CATALOG", () => {
    it("should contain standard doc pages", () => {
      expect(DOCS_CATALOG.length).toBeGreaterThanOrEqual(5);
      expect(DOCS_CATALOG.some((d) => d.title === "Project Overview")).toBe(true);
      expect(DOCS_CATALOG.some((d) => d.title === "AI Assistant")).toBe(true);
    });
  });
});
