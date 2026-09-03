import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/Hero";
import { describe, it, expect, vi } from "vitest";

// Mock CodeSnippet because it might use navigator.clipboard which is not available in jsdom or needs mocking
vi.mock("@/components/CodeSnippet", () => ({
  CodeSnippet: ({ code }: { code: string }) => (
    <div data-testid="code-snippet">{code}</div>
  ),
}));

describe("Hero Component", () => {
  it("renders the hero section with the main heading", () => {
    render(<Hero />);
    const heading = screen.getByRole("heading", {
      level: 1,
      name: /build faster with cur8d/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("renders the GitHub link with correct href, target, rel attributes, and external link icon", () => {
    render(<Hero />);
    const githubLink = screen.getByRole("link", { name: /github/i });
    expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/cur8d/typescript",
    );
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");

    const externalLinkIcon = githubLink.querySelector(
      "svg.lucide-external-link",
    );
    expect(externalLinkIcon).toBeInTheDocument();
    expect(externalLinkIcon).toHaveAttribute("aria-hidden", "true");
  });

  it("renders the Documentation link with open book icon and correct attributes", () => {
    render(<Hero />);
    const docLink = screen.getByRole("link", { name: /documentation/i });
    expect(docLink).toHaveAttribute("href", "https://cur8d.dev/typescript");
    expect(docLink).toHaveAttribute("target", "_blank");
    expect(docLink).toHaveAttribute("rel", "noopener noreferrer");

    const bookIcon = docLink.querySelector("svg.lucide-book-open");
    expect(bookIcon).toBeInTheDocument();
    expect(bookIcon).toHaveAttribute("aria-hidden", "true");

    const externalIcon = docLink.querySelector("svg.lucide-external-link");
    expect(externalIcon).toBeInTheDocument();
    expect(externalIcon).toHaveAttribute("aria-hidden", "true");
  });

  it("renders the code snippet", () => {
    render(<Hero />);
    expect(screen.getByTestId("code-snippet")).toBeInTheDocument();
  });
});
