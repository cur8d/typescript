import { describe, it, expect, vi } from "vitest";



import { useMDXComponents } from "@docs/mdx-components";

vi.mock("nextra-theme-docs", () => ({
  useMDXComponents: () => ({
    h1: "h1-mock",
    h2: "h2-mock",
  }),
}));

describe("useMDXComponents", () => {
  it("returns default components combined with custom components", () => {
    const customComponents = {
      h2: "h2-custom",
      p: "p-custom",
    } as any;

    const result = useMDXComponents(customComponents);

    expect(result).toEqual({
      h1: "h1-mock",
      h2: "h2-custom",
      p: "p-custom",
    });
  });

  it("returns only default components when no custom components are provided", () => {
    const result = useMDXComponents();

    expect(result).toEqual({
      h1: "h1-mock",
      h2: "h2-mock",
    });
  });
});
