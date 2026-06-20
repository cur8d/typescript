import { render } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import Page from "../page";
import React from "react";

// Mock the components used in the Page to simplify the test
vi.mock("@/components/CodeSnippet", () => ({
  CodeSnippet: ({ code }: { code: string }) => <div data-testid="code-snippet">{code}</div>,
}));

vi.mock("@heroui/react", () => ({
  Card: Object.assign(({ children }: { children: React.ReactNode }) => <div>{children}</div>, {
    Header: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Content: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Title: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  }),
}));

test("Page renders JSON-LD correctly", () => {
  const { container } = render(<Page />);

  const script = container.querySelector("script[type='application/ld+json']");
  expect(script).not.toBeNull();

  const content = script?.textContent;
  expect(content).not.toBeNull();

  const jsonLd = JSON.parse(content!);
  expect(jsonLd["@context"]).toBe("https://schema.org");
  expect(jsonLd["name"]).toBe("cur8d.tsx");
});
