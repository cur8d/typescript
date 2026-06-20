import { render, screen } from "@testing-library/react";
import { Footer } from "../index";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("Footer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the current year and copyright text", () => {
    const date = new Date(2025, 0, 1);
    vi.setSystemTime(date);

    render(<Footer />);

    const footerText = screen.getByText(/© 2025 Cur8d\. All rights reserved\./);
    expect(footerText).toBeInTheDocument();
  });

  it("renders with the correct year if it is 2030", () => {
    const date = new Date(2030, 0, 1);
    vi.setSystemTime(date);

    render(<Footer />);

    const footerText = screen.getByText(/© 2030 Cur8d\. All rights reserved\./);
    expect(footerText).toBeInTheDocument();
  });
});
