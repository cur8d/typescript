import { render, screen } from "@testing-library/react";
import { Features } from "../index";
import { describe, it, expect } from "vitest";

describe("Features Component", () => {
  it("renders the features section heading", () => {
    render(<Features />);
    const featuresHeading = screen.getByRole("heading", { level: 2, name: /everything you need/i });
    expect(featuresHeading).toBeInTheDocument();
  });

  it("renders all feature cards", () => {
    render(<Features />);
    expect(screen.getByText("Lightning Fast")).toBeInTheDocument();
    expect(screen.getByText("Type Safe")).toBeInTheDocument();
    expect(screen.getByText("Accessible")).toBeInTheDocument();
  });
});
