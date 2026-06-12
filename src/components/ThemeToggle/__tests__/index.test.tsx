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

  it("renders correctly", () => {
    (useTheme as Mock).mockReturnValue({
      theme: "light",
      setTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByLabelText("Toggle theme");
    expect(button).toBeInTheDocument();
  });

  it("switches theme when clicked", () => {
    (useTheme as Mock).mockReturnValue({
      theme: "light",
      setTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByLabelText("Toggle theme");
    fireEvent.click(button);

    expect(setTheme).toHaveBeenCalled();
  });
});
