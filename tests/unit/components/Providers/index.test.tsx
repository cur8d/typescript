import { render, screen } from "@testing-library/react";
import { Providers } from "@/components/Providers";
import { useTheme } from "next-themes";
import { useSearchState } from "@/hooks/use-search-state";
import { useRouter } from "next/navigation";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import React from "react";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

// We mock RouterProvider to verify it receives the navigate prop
vi.mock("@heroui/react", async () => {
  const actual = (await vi.importActual("@heroui/react")) as Record<string, unknown>;
  return {
    ...actual,
    RouterProvider: vi.fn(({ children }) => <div data-testid="hero-ui-router-provider">{children}</div>),
  };
});

const TestConsumer = () => {
  const { theme } = useTheme();
  const { isOpen } = useSearchState();
  return (
    <div>
      <div data-testid="theme-value">{theme || "undefined"}</div>
      <div data-testid="search-state-value">{isOpen ? "open" : "closed"}</div>
      <div data-testid="child-content">Child Content</div>
    </div>
  );
};

describe("Providers", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it("renders children and provides all contexts", () => {
    render(
      <Providers>
        <TestConsumer />
      </Providers>
    );

    // Verify children are rendered
    expect(screen.getByTestId("child-content")).toBeInTheDocument();
    expect(screen.getByText("Child Content")).toBeInTheDocument();

    // Verify SearchProvider is working
    expect(screen.getByTestId("search-state-value")).toHaveTextContent("closed");

    // Verify NextThemesProvider is working
    expect(screen.getByTestId("theme-value")).toBeInTheDocument();
  });

  it("initializes RouterProvider with router.push", async () => {
    const { RouterProvider } = await import("@heroui/react");

    render(
      <Providers>
        <div />
      </Providers>
    );

    expect(RouterProvider).toHaveBeenCalled();
    const props = (RouterProvider as Mock).mock.calls[0][0];
    expect(props.navigate).toBe(mockPush);
  });
});
