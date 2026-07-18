import { describe, it, expect } from "vitest";

import { useMDXComponents } from "@docs/mdx-components";

describe("useMDXComponents", () => {
  it("returns default components combined with custom components", () => {
    const customComponents = {
      h2: () => "h2-custom",
      p: () => "p-custom",
    } as any;

    const result = useMDXComponents(customComponents);

    expect(result.h2).toEqual(customComponents.h2);
    expect(result.p).toEqual(customComponents.p);
    expect(result.h1).toBeDefined();
  });

  it("returns only default components when no custom components are provided", () => {
    const result = useMDXComponents();

    expect(result.h1).toBeDefined();
    expect(result.h2).toBeDefined();
  });
});
