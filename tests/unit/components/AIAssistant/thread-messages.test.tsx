import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { UserMessage, AssistantMessage, AssistantMessageContent } from "@/components/AIAssistant/Thread";

vi.mock("@assistant-ui/react", () => ({
  MessagePrimitive: {
    Root: ({ children, className }: { children?: React.ReactNode; className?: string }) => (
      <div data-testid="message-root" className={className}>
        {children}
      </div>
    ),
    Content: ({ components }: { components?: Record<string, unknown> }) => (
      <div data-testid="message-content">
        {components && "components-configured"}
      </div>
    ),
  },
  BranchPickerPrimitive: {
    Root: ({ children }: { children?: React.ReactNode }) => <div data-testid="branch-root">{children}</div>,
    Previous: ({ children, asChild: _asChild }: { children?: React.ReactNode; asChild?: boolean }) => <div data-testid="branch-prev">{children}</div>,
    Next: ({ children, asChild: _asChild }: { children?: React.ReactNode; asChild?: boolean }) => <div data-testid="branch-next">{children}</div>,
    Number: () => <span data-testid="branch-num">1</span>,
    Count: () => <span data-testid="branch-count">2</span>,
  },
  ActionBarPrimitive: {
    Root: ({ children }: { children?: React.ReactNode }) => <div data-testid="action-root">{children}</div>,
    Copy: ({ children, asChild: _asChild }: { children?: React.ReactNode; asChild?: boolean }) => <div data-testid="action-copy">{children}</div>,
    Reload: ({ children, asChild: _asChild }: { children?: React.ReactNode; asChild?: boolean }) => <div data-testid="action-reload">{children}</div>,
  },
  ThreadPrimitive: {
    Root: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    Viewport: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    Suggestion: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    Messages: () => <div data-testid="messages" />,
  },
  AuiIf: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  makeAssistantToolUI: () => () => <div data-testid="mock-tool-ui" />,
}));

vi.mock("@assistant-ui/react-markdown", () => ({
  MarkdownTextPrimitive: ({ components }: { components?: Record<string, unknown> }) => (
    <div data-testid="markdown-primitive">{components ? "markdown-rendered" : "plain"}</div>
  ),
}));

describe("Thread Message Primitives Component Rendering", () => {
  it("should render UserMessage layout and branch picker controls", () => {
    render(<UserMessage />);
    expect(screen.getByTestId("message-root")).toBeInTheDocument();
    expect(screen.getByTestId("branch-root")).toBeInTheDocument();
    expect(screen.getByTestId("branch-num")).toHaveTextContent("1");
    expect(screen.getByTestId("branch-count")).toHaveTextContent("2");
    expect(screen.getByRole("button", { name: /previous branch/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next branch/i })).toBeInTheDocument();
  });

  it("should render AssistantMessage layout with action bar controls and tools", () => {
    render(<AssistantMessage />);
    expect(screen.getByTestId("message-root")).toBeInTheDocument();
    expect(screen.getByTestId("action-root")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /copy assistant message/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /regenerate response/i })).toBeInTheDocument();
  });

  it("should render AssistantMessageContent with markdown components mapping", () => {
    render(<AssistantMessageContent />);
    expect(screen.getByTestId("markdown-primitive")).toHaveTextContent("markdown-rendered");
  });
});
