import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "../index";
import { useTheme } from "next-themes";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";

vi.mock("next-themes", () => ({
  useTheme: vi.fn(),
}));

describe("ThemeToggle", () => {
  const setTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly with target theme label", () => {
    (useTheme as Mock).mockReturnValue({
      resolvedTheme: "light",
      setTheme,
    });

    render(<ThemeToggle />);

    // When light, it should suggest switching to dark
    const button = screen.getByLabelText("Switch to dark theme");
    expect(button).toBeInTheDocument();
  });

  it("switches theme when clicked", () => {
    (useTheme as Mock).mockReturnValue({
      resolvedTheme: "light",
      setTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByLabelText("Switch to dark theme");
    fireEvent.click(button);

    expect(setTheme).toHaveBeenCalledWith("dark");
  });

  it("shows correct label when theme is dark", () => {
    (useTheme as Mock).mockReturnValue({
      resolvedTheme: "dark",
      setTheme,
    });

    render(<ThemeToggle />);

    // When dark, it should suggest switching to light
    const button = screen.getByLabelText("Switch to light theme");
    expect(button).toBeInTheDocument();
  });
});
