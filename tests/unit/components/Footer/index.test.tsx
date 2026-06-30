import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("Footer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.resetModules();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the current year and copyright text", async () => {
    const date = new Date(2025, 0, 1);
    vi.setSystemTime(date);

    // Re-import the component after setting the system time so the module-level CURRENT_YEAR is re-evaluated.
    const { Footer } = await import("@/components/Footer");
    render(<Footer />);

    const footerText = screen.getByText(/© 2025 Cur8d\. All rights reserved\./);
    expect(footerText).toBeInTheDocument();
  });

  it("renders with the correct year if it is 2030", async () => {
    const date = new Date(2030, 0, 1);
    vi.setSystemTime(date);

    // Re-import the component after setting the system time so the module-level CURRENT_YEAR is re-evaluated.
    const { Footer } = await import("@/components/Footer");
    render(<Footer />);

    const footerText = screen.getByText(/© 2030 Cur8d\. All rights reserved\./);
    expect(footerText).toBeInTheDocument();
  });
});
