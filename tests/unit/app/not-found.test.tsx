import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import NotFound from "@/not-found";

describe("NotFound component", () => {
  it("renders the 404 heading", () => {
    render(<NotFound />);
    expect(
      screen.getByRole("heading", { name: /404 - Page Not Found/i })
    ).toBeInTheDocument();
  });

  it("renders the description text", () => {
    render(<NotFound />);
    expect(
      screen.getByText(/sorry, we couldn't find the page you're looking for/i)
    ).toBeInTheDocument();
  });

  it("renders the 'Return Home' link with correct href", () => {
    render(<NotFound />);
    const link = screen.getByRole("link", { name: /return home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });
});
