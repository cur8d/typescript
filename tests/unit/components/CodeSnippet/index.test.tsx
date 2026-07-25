import { render, screen, fireEvent, act } from "@testing-library/react";
import { CodeSnippet } from "@/components/CodeSnippet";
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as errorReporting from "@/lib/error-reporting";

describe("CodeSnippet", () => {
  const mockCode = "pnpm install";

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    // Mock navigator.clipboard
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      configurable: true,
    });
  });

  it("renders the code correctly", () => {
    render(<CodeSnippet code={mockCode} />);
    expect(screen.getByText(mockCode)).toBeInTheDocument();
    expect(screen.getByText("$")).toBeInTheDocument();
  });

  it("renders the copy button with correct aria-label", () => {
    render(<CodeSnippet code={mockCode} />);
    expect(screen.getByLabelText("Copy to clipboard")).toBeInTheDocument();
  });

  it("copies code to clipboard when button is clicked", async () => {
    render(<CodeSnippet code={mockCode} />);
    const button = screen.getByLabelText("Copy to clipboard");

    await act(async () => {
      fireEvent.click(button);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockCode);
  });

  it("changes icon and reverts after 2 seconds", async () => {
    vi.useFakeTimers();
    render(<CodeSnippet code={mockCode} />);
    const button = screen.getByLabelText("Copy to clipboard");

    await act(async () => {
      fireEvent.click(button);
    });

    // Should show Check icon
    expect(screen.getByTestId("check-icon")).toBeInTheDocument();
    expect(screen.getByLabelText("Copied!")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Should show Copy icon again
    expect(screen.queryByTestId("check-icon")).not.toBeInTheDocument();
    expect(screen.getByTestId("copy-icon")).toBeInTheDocument();
    expect(screen.getByLabelText("Copy to clipboard")).toBeInTheDocument();

    vi.useRealTimers();
  });

  it("shows error state when clipboard write fails", async () => {
    vi.useFakeTimers();
    const reportErrorSpy = vi.spyOn(errorReporting, "reportError").mockImplementation(() => {});
    const error = new Error("Clipboard fail");
    vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(error);

    render(<CodeSnippet code={mockCode} />);
    const button = screen.getByLabelText("Copy to clipboard");

    await act(async () => {
      fireEvent.click(button);
    });

    // Should show error icon
    expect(screen.getByTestId("error-icon")).toBeInTheDocument();
    expect(screen.getByLabelText("Failed to copy")).toBeInTheDocument();
    expect(reportErrorSpy).toHaveBeenCalledWith(error, { component: "CodeSnippet", action: "copy" });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Should revert back to initial state
    expect(screen.queryByTestId("error-icon")).not.toBeInTheDocument();
    expect(screen.getByTestId("copy-icon")).toBeInTheDocument();
    expect(screen.getByLabelText("Copy to clipboard")).toBeInTheDocument();

    reportErrorSpy.mockRestore();
    vi.useRealTimers();
  });
});
