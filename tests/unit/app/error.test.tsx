import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ErrorComponent from "@/error";
import * as errorReporting from "@/lib/error-reporting";

// Mock the reportError function
vi.mock("@/lib/error-reporting", () => ({
  reportError: vi.fn(),
}));

describe("Error component", () => {
  const mockError = new Error("Test error");
  const mockReset = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the error message and title", () => {
    render(<ErrorComponent error={mockError} reset={mockReset} />);

    expect(screen.getByText(/Something went wrong!/i)).toBeInTheDocument();
    expect(
      screen.getByText(/An unexpected error occurred. We've been notified and are looking into it./i)
    ).toBeInTheDocument();
  });

  it("calls reportError when mounted", () => {
    render(<ErrorComponent error={mockError} reset={mockReset} />);

    expect(errorReporting.reportError).toHaveBeenCalledWith(mockError);
  });

  it("calls reset function when 'Try Again' button is clicked", () => {
    render(<ErrorComponent error={mockError} reset={mockReset} />);

    const tryAgainButton = screen.getByRole("button", { name: /try again/i });
    fireEvent.click(tryAgainButton);

    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it("reloads the page when 'Reload Page' button is clicked", () => {
    const reloadMock = vi.fn();

    // Mock window.location using vi.stubGlobal
    vi.stubGlobal("location", {
      ...window.location,
      reload: reloadMock,
    });

    render(<ErrorComponent error={mockError} reset={mockReset} />);

    const reloadButton = screen.getByRole("button", { name: /reload page/i });
    fireEvent.click(reloadButton);

    expect(reloadMock).toHaveBeenCalledTimes(1);

    // Cleanup
    vi.unstubAllGlobals();
  });
});
