import { render, screen } from "@testing-library/react";
import { Navbar } from "../index";
import { useTheme } from "next-themes";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";

vi.mock("next-themes", () => ({
  useTheme: vi.fn(),
}));

describe("Navbar", () => {
  const setTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the brand logo link", () => {
    (useTheme as Mock).mockReturnValue({
      theme: "light",
      setTheme,
    });

    render(<Navbar />);

    const brandLink = screen.getByRole("link", { name: /cur8d/i });
    expect(brandLink).toBeInTheDocument();
    expect(brandLink).toHaveAttribute("href", "/");
  });

  it("renders the documentation link", () => {
    (useTheme as Mock).mockReturnValue({
      theme: "light",
      setTheme,
    });

    render(<Navbar />);

    const docsLink = screen.getByRole("link", { name: /docs/i });
    expect(docsLink).toBeInTheDocument();
    expect(docsLink).toHaveAttribute("href", "https://cur8d.dev/typescript");
  });

  it("renders the theme toggle", () => {
    (useTheme as Mock).mockReturnValue({
      resolvedTheme: "light",
      setTheme,
    });

    render(<Navbar />);

    // Updated to match the dynamic label
    const themeToggle = screen.getByLabelText(/Switch to (dark|light) theme/);
    expect(themeToggle).toBeInTheDocument();
  });
});
