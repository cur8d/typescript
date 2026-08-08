import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "@/components/ThemeToggle";
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
    const button = screen.getByLabelText(/Switch to dark theme/i);
    expect(button).toBeInTheDocument();
  });

  it("switches theme when clicked", () => {
    (useTheme as Mock).mockReturnValue({
      resolvedTheme: "light",
      setTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByLabelText(/Switch to dark theme/i);
    fireEvent.click(button);

    expect(setTheme).toHaveBeenCalledWith("dark");
  });

  it("shows correct label when theme is dark", () => {
    (useTheme as Mock).mockReturnValue({
      resolvedTheme: "dark",
      setTheme,
    });

    render(<ThemeToggle />);

    // When dark, it should suggest switching to light (with macOS ⌥T fallback or Alt+T hint)
    const button = screen.getByRole("button");
    expect(button.getAttribute("aria-label")).toContain("Switch to light theme");
  });

  it("toggles theme when Alt+T keyboard shortcut is pressed", () => {
    (useTheme as Mock).mockReturnValue({
      resolvedTheme: "light",
      setTheme,
    });

    render(<ThemeToggle />);

    const event = new KeyboardEvent("keydown", {
      key: "t",
      altKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event);

    expect(setTheme).toHaveBeenCalledWith("dark");
  });
});
