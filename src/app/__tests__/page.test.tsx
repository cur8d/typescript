import { render, screen } from "@testing-library/react";
import Page from "../page";
import { describe, it, expect, vi } from "vitest";

// Mock CodeSnippet because it might use navigator.clipboard which is not available in jsdom or needs mocking
vi.mock("@/components/CodeSnippet", () => ({
  CodeSnippet: ({ code }: { code: string }) => <div data-testid="code-snippet">{code}</div>,
}));

describe("Landing Page", () => {
  it("renders the hero section with the main heading", () => {
    render(<Page />);
    const heading = screen.getByRole("heading", { level: 1, name: /build faster with cur8d/i });
    expect(heading).toBeInTheDocument();
  });

  it("renders the features section heading", () => {
    render(<Page />);
    const featuresHeading = screen.getByRole("heading", { level: 2, name: /everything you need/i });
    expect(featuresHeading).toBeInTheDocument();
  });

  it("renders all feature cards", () => {
    render(<Page />);
    expect(screen.getByText("Lightning Fast")).toBeInTheDocument();
    expect(screen.getByText("Type Safe")).toBeInTheDocument();
    expect(screen.getByText("Accessible")).toBeInTheDocument();
  });

  it("renders the GitHub link with correct href", () => {
    render(<Page />);
    const githubLink = screen.getByRole("link", { name: /github/i });
    expect(githubLink).toHaveAttribute("href", "https://github.com/cur8d/typescript");
  });

  it("contains the JSON-LD script with correct content", () => {
    const { container } = render(<Page />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
    if (script) {
      const json = JSON.parse(script.textContent || script.innerHTML);
      expect(json["@context"]).toBe("https://schema.org");
      expect(json.name).toBe("cur8d.tsx");
      expect(json.url).toBe("https://github.com/cur8d/typescript");
    }
  });
});
