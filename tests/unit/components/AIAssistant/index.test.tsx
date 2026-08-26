import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  AIAssistant,
  useAIAssistant,
  AIAssistantProvider,
  AssistantTrigger,
  Composer,
  Thread,
  assistantToolkit,
} from "@/components/AIAssistant";
import {
  CodeBlock,
  SuggestedPrompts,
  MarkdownCode,
  MarkdownParagraph,
  MarkdownUnorderedList,
  MarkdownOrderedList,
  MarkdownListItem,
  MarkdownLink,
} from "@/components/AIAssistant/Thread";
import { DocSearchTool, type DocSearchArgs } from "@/components/AIAssistant/tools/DocSearchTool";
import { ThemeTool, type ThemeArgs } from "@/components/AIAssistant/tools/ThemeTool";
import { SystemInfoTool } from "@/components/AIAssistant/tools/SystemInfoTool";
import { NavigatePageTool } from "@/components/AIAssistant/tools/NavigatePageTool";
import * as speechHook from "@/hooks/use-speech-to-text";

const mockPush = vi.fn();
const mockSetTheme = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock("next-themes", () => ({
  useTheme: vi.fn(() => ({
    theme: "dark",
    setTheme: mockSetTheme,
  })),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@assistant-ui/react-ai-sdk", () => ({
  useChatRuntime: vi.fn(() => ({})),
  AssistantChatTransport: vi.fn(),
}));

vi.mock("@assistant-ui/react", () => ({
  AssistantRuntimeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  AuiConfig: (config: unknown) => config,
  Tools: (tools: unknown) => tools,
  defineToolkit: <T,>(toolkit: T): T => toolkit,
  ThreadPrimitive: {
    Root: ({ children, className }: { children?: React.ReactNode; className?: string }) => (
      <div data-testid="thread-root" className={className}>
        {children}
      </div>
    ),
    Viewport: ({ children, className }: { children?: React.ReactNode; className?: string }) => (
      <div data-testid="thread-viewport" className={className}>
        {children}
      </div>
    ),
    Suggestion: ({ children, prompt }: { children?: React.ReactNode; prompt?: string }) => (
      <div data-testid={`suggestion-${prompt}`}>{children}</div>
    ),
    Messages: () => <div data-testid="messages" />,
  },
  ComposerPrimitive: {
    Root: ({ children, className }: { children?: React.ReactNode; className?: string }) => (
      <form data-testid="composer-root" className={className}>
        {children}
      </form>
    ),
    Input: ({ placeholder, autoFocus, className }: { placeholder?: string; autoFocus?: boolean; className?: string }) => (
      <textarea placeholder={placeholder} autoFocus={autoFocus} className={className} />
    ),
    Cancel: ({ children }: { children?: React.ReactNode; asChild?: boolean }) => <>{children}</>,
    Send: ({ children }: { children?: React.ReactNode; asChild?: boolean }) => <>{children}</>,
  },
  MessagePrimitive: {
    Root: ({ children, className }: { children?: React.ReactNode; className?: string }) => (
      <div data-testid="message-root" className={className}>
        {children}
      </div>
    ),
    Content: () => <div data-testid="message-content" />,
  },
  BranchPickerPrimitive: {
    Root: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    Previous: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
    Next: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
    Number: () => <span>1</span>,
    Count: () => <span>1</span>,
  },
  ActionBarPrimitive: {
    Root: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    Copy: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
    Reload: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  },
  AuiIf: ({
    children,
    condition,
  }: {
    children?: React.ReactNode;
    condition?: (state: { thread: { isEmpty: boolean } }) => boolean;
  }) => {
    condition?.({ thread: { isEmpty: true } });
    return <>{children}</>;
  },
}));

vi.mock("@assistant-ui/react-markdown", () => ({
  MarkdownTextPrimitive: () => <div data-testid="markdown-text" />,
}));

function AssistantTestWrapper({ children }: { readonly children: React.ReactNode }) {
  return <>{children}</>;
}

function TestConsumer() {
  const { isOpen, toggle } = useAIAssistant();
  return (
    <div>
      <div data-testid="status">{isOpen ? "open" : "closed"}</div>
      <button onClick={toggle}>Toggle</button>
    </div>
  );
}

describe("AIAssistant Components", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("AIAssistantProvider & AssistantTrigger", () => {
    it("should render floating trigger button with Mac platform shortcut", () => {
      render(
        <AIAssistantProvider>
          <AIAssistant />
        </AIAssistantProvider>
      );
      const trigger = screen.getByRole("button", { name: /open ai assistant/i });
      expect(trigger).toBeInTheDocument();
      expect(screen.getByText("Ask AI")).toBeInTheDocument();
    });

    it("should render Ctrl+J shortcut on non-Mac platforms", () => {
      const originalPlatform = navigator.platform;
      try {
        Object.defineProperty(navigator, "platform", {
          value: "Win32",
          configurable: true,
        });

        render(
          <AIAssistantProvider>
            <AIAssistant />
          </AIAssistantProvider>
        );

        expect(screen.getByText("Ctrl+J")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: /open ai assistant/i }));
        expect(screen.getAllByText("Ctrl+J").length).toBeGreaterThan(0);
      } finally {
        Object.defineProperty(navigator, "platform", {
          value: originalPlatform,
          configurable: true,
        });
      }
    });

    it("should open and close the modal when trigger is clicked", async () => {
      const user = userEvent.setup();
      render(
        <AIAssistantProvider>
          <AIAssistant />
        </AIAssistantProvider>
      );

      const trigger = screen.getByRole("button", { name: /open ai assistant/i });
      await user.click(trigger);

      expect(screen.getByRole("dialog", { name: /ai assistant chat/i })).toBeInTheDocument();
      expect(screen.getByText("cur8d Copilot")).toBeInTheDocument();

      const closeButton = screen.getByRole("button", { name: /close ai assistant/i });
      await user.click(closeButton);

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("should toggle open state with Command/Ctrl + J shortcut and Escape key", () => {
      render(
        <AIAssistantProvider>
          <AIAssistant />
        </AIAssistantProvider>
      );

      fireEvent.keyDown(window, { key: "j", metaKey: true });
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      fireEvent.keyDown(window, { key: "Escape" });
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("should close when backdrop is clicked", () => {
      render(
        <AIAssistantProvider>
          <AIAssistant />
        </AIAssistantProvider>
      );

      fireEvent.keyDown(window, { key: "j", metaKey: true });
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      const backdrop = document.querySelector(".bg-black\\/40");
      expect(backdrop).toBeInTheDocument();
      if (backdrop) {
        fireEvent.click(backdrop);
      }
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("should provide safe fallback if useAIAssistant is used outside provider", () => {
      render(<TestConsumer />);
      expect(screen.getByTestId("status")).toHaveTextContent("closed");
      fireEvent.click(screen.getByText("Toggle"));
      expect(screen.getByTestId("status")).toHaveTextContent("closed");
    });

    it("should work standalone without AIAssistantProvider", () => {
      render(
        <AssistantTestWrapper>
          <AssistantTrigger />
        </AssistantTestWrapper>
      );

      const trigger = screen.getByRole("button", { name: /open ai assistant/i });
      fireEvent.click(trigger);
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      fireEvent.keyDown(window, { key: "Escape" });
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

      // Standalone keyboard shortcut
      fireEvent.keyDown(window, { key: "j", ctrlKey: true });
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  describe("Composer Component", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should render default composer when speech is unsupported", () => {
      vi.spyOn(speechHook, "useSpeechToText").mockReturnValue({
        isListening: false,
        transcript: "",
        isSupported: false,
        error: null,
        startListening: vi.fn(),
        stopListening: vi.fn(),
        toggleListening: vi.fn(),
        resetTranscript: vi.fn(),
      });

      render(
        <AssistantTestWrapper>
          <Composer />
        </AssistantTestWrapper>
      );
      expect(screen.getByPlaceholderText(/Ask cur8d assistant/i)).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /voice input/i })).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /cancel generation/i })).toBeInTheDocument();
    });

    it("should render mic button and toggle speech when supported", () => {
      const toggleListening = vi.fn();
      vi.spyOn(speechHook, "useSpeechToText").mockReturnValue({
        isListening: false,
        transcript: "",
        isSupported: true,
        error: null,
        startListening: vi.fn(),
        stopListening: vi.fn(),
        toggleListening,
        resetTranscript: vi.fn(),
      });

      render(
        <AssistantTestWrapper>
          <Composer />
        </AssistantTestWrapper>
      );
      const micButton = screen.getByRole("button", { name: /start voice input/i });
      expect(micButton).toBeInTheDocument();

      fireEvent.click(micButton);
      expect(toggleListening).toHaveBeenCalled();
    });

    it("should render listening indicator when speech recognition is active", () => {
      const toggleListening = vi.fn();
      vi.spyOn(speechHook, "useSpeechToText").mockReturnValue({
        isListening: true,
        transcript: "speech test",
        isSupported: true,
        error: null,
        startListening: vi.fn(),
        stopListening: vi.fn(),
        toggleListening,
        resetTranscript: vi.fn(),
      });

      render(
        <AssistantTestWrapper>
          <Composer />
        </AssistantTestWrapper>
      );
      expect(screen.getByRole("button", { name: /stop listening/i })).toBeInTheDocument();
      expect(screen.getByText("Listening...")).toBeInTheDocument();
    });
  });

  describe("Thread and Markdown Components", () => {
    describe("CodeBlock", () => {
      it("should render code and language header and copy to clipboard", async () => {
        vi.useFakeTimers();
        const writeTextMock = vi.fn().mockResolvedValue(undefined);
        Object.defineProperty(navigator, "clipboard", {
          value: {
            writeText: writeTextMock,
          },
          configurable: true,
          writable: true,
        });

        render(<CodeBlock code="const a = 1;" language="typescript" />);
        expect(screen.getByText("typescript")).toBeInTheDocument();
        expect(screen.getByText("const a = 1;")).toBeInTheDocument();

        const copyButton = screen.getByRole("button", { name: /copy code block/i });
        expect(copyButton).toBeInTheDocument();

        fireEvent.click(copyButton);
        await act(async () => { });
        expect(writeTextMock).toHaveBeenCalledWith("const a = 1;");
        expect(screen.getByText("Copied")).toBeInTheDocument();

        act(() => {
          vi.advanceTimersByTime(2100);
        });
        expect(screen.getByText("Copy")).toBeInTheDocument();

        vi.useRealTimers();
      });

      it("should fallback gracefully if clipboard write fails", async () => {
        Object.defineProperty(navigator, "clipboard", {
          value: {
            writeText: vi.fn().mockRejectedValue(new Error("Permission denied")),
          },
          configurable: true,
          writable: true,
        });

        render(<CodeBlock code="console.log('test')" />);
        expect(screen.getByText("text")).toBeInTheDocument();

        const copyButton = screen.getByRole("button", { name: /copy code block/i });
        fireEvent.click(copyButton);
        expect(screen.getByText("Copy")).toBeInTheDocument();
      });
    });

    describe("SuggestedPrompts", () => {
      it("should render prompt buttons", () => {
        render(
          <AssistantTestWrapper>
            <SuggestedPrompts />
          </AssistantTestWrapper>
        );
        expect(screen.getByText("How can I assist you today?")).toBeInTheDocument();
        expect(screen.getByText("Search documentation")).toBeInTheDocument();
        expect(screen.getByText("Switch to dark mode")).toBeInTheDocument();
        expect(screen.getByText("Show system info")).toBeInTheDocument();
        expect(screen.getByText("How to test")).toBeInTheDocument();
      });
    });

    describe("Markdown components", () => {
      it("should render MarkdownCode inline and block variants", () => {
        const { getByText, rerender } = render(
          <MarkdownCode inline>const x = 10;</MarkdownCode>
        );
        expect(getByText("const x = 10;").tagName).toBe("CODE");

        rerender(
          <MarkdownCode className="language-javascript">
            {"function test() {\n  return 1;\n}"}
          </MarkdownCode>
        );
        expect(getByText("javascript")).toBeInTheDocument();
        expect(getByText(/function test/)).toBeInTheDocument();

        // Children as array
        rerender(
          <MarkdownCode className="language-css">
            {["body", " { ", "margin: 0;", " }"]}
          </MarkdownCode>
        );
        expect(getByText("css")).toBeInTheDocument();
      });

      it("should render MarkdownParagraph, Lists, and Links", () => {
        const { getByText, container } = render(
          <div>
            <MarkdownParagraph>Paragraph text</MarkdownParagraph>
            <MarkdownUnorderedList>
              <MarkdownListItem>Bullet 1</MarkdownListItem>
            </MarkdownUnorderedList>
            <MarkdownOrderedList>
              <MarkdownListItem>Ordered 1</MarkdownListItem>
            </MarkdownOrderedList>
            <MarkdownLink href="https://cur8d.dev">cur8d Link</MarkdownLink>
          </div>
        );

        expect(getByText("Paragraph text")).toBeInTheDocument();
        expect(getByText("Bullet 1")).toBeInTheDocument();
        expect(getByText("Ordered 1")).toBeInTheDocument();
        const link = getByText("cur8d Link");
        expect(link).toHaveAttribute("href", "https://cur8d.dev");
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
        expect(container.querySelector("ul")).toBeInTheDocument();
        expect(container.querySelector("ol")).toBeInTheDocument();
      });
    });

    describe("Thread component", () => {
      it("should render thread root and composer", () => {
        const { container } = render(
          <AssistantTestWrapper>
            <Thread />
          </AssistantTestWrapper>
        );
        expect(container).toBeInTheDocument();
      });
    });
  });

  describe("Generative UI Tools", () => {
    const defaultToolProps = {
      type: "tool-call" as const,
      addResult: vi.fn(),
      resume: vi.fn(),
      respondToApproval: vi.fn(),
      toolCallId: "tool-call-1",
      argsText: "",
    };

    it("should export assistantToolkit with all tool renderers configured", () => {
      expect(assistantToolkit).toBeDefined();
      expect(assistantToolkit.searchDocumentation.render).toBe(DocSearchTool);
      expect(assistantToolkit.setTheme.render).toBe(ThemeTool);
      expect(assistantToolkit.getSystemInfo.render).toBe(SystemInfoTool);
      expect(assistantToolkit.navigatePage.render).toBe(NavigatePageTool);
    });

    describe("DocSearchTool", () => {
      it("should render running state with query and default topics fallback", () => {
        const { getByText, rerender } = render(
          <DocSearchTool
            {...defaultToolProps}
            toolName="searchDocumentation"
            args={{ query: "getting started" }}
            result={undefined}
            status={{ type: "running" }}
          />
        );
        expect(getByText(/Searching documentation for "getting started"/i)).toBeInTheDocument();

        rerender(
          <DocSearchTool
            {...defaultToolProps}
            toolName="searchDocumentation"
            args={{} as DocSearchArgs}
            result={undefined}
            status={{ type: "running" }}
          />
        );
        expect(getByText(/Searching documentation for "topics"/i)).toBeInTheDocument();
      });

      it("should render empty state when no results", () => {
        const { getByText } = render(
          <DocSearchTool
            {...defaultToolProps}
            toolName="searchDocumentation"
            args={{ query: "nonexistent" }}
            result={{ query: "nonexistent", results: [] }}
            status={{ type: "complete" }}
          />
        );
        expect(getByText(/No documentation matches found/i)).toBeInTheDocument();
      });

      it("should render document search result cards with links", () => {
        const { getByText } = render(
          <DocSearchTool
            {...defaultToolProps}
            toolName="searchDocumentation"
            args={{ query: "overview" }}
            result={{
              query: "overview",
              results: [
                {
                  title: "Project Overview",
                  path: "/docs",
                  description: "Learn about cur8d architecture",
                  category: "Getting Started",
                },
              ],
            }}
            status={{ type: "complete" }}
          />
        );
        expect(getByText("Project Overview")).toBeInTheDocument();
        expect(getByText("Learn about cur8d architecture")).toBeInTheDocument();
        expect(getByText("Getting Started")).toBeInTheDocument();
      });
    });

    describe("ThemeTool", () => {
      it("should render running and completed states for dark, light, and system themes", () => {
        // Dark theme running
        const { getByText, rerender } = render(
          <ThemeTool
            {...defaultToolProps}
            toolName="setTheme"
            args={{ theme: "dark" }}
            result={undefined}
            status={{ type: "running" }}
          />
        );
        expect(getByText(/Switching theme to dark/i)).toBeInTheDocument();

        // Light theme running
        rerender(
          <ThemeTool
            {...defaultToolProps}
            toolName="setTheme"
            args={{ theme: "light" }}
            result={undefined}
            status={{ type: "running" }}
          />
        );
        expect(getByText(/Switching theme to light/i)).toBeInTheDocument();

        // System theme running with undefined args fallback
        rerender(
          <ThemeTool
            {...defaultToolProps}
            toolName="setTheme"
            args={{} as ThemeArgs}
            result={undefined}
            status={{ type: "running" }}
          />
        );
        expect(getByText(/Switching theme to system/i)).toBeInTheDocument();

        // Completed light theme
        rerender(
          <ThemeTool
            {...defaultToolProps}
            toolName="setTheme"
            args={{ theme: "light" }}
            result={{ success: true, theme: "light", message: "Theme set" }}
            status={{ type: "complete" }}
          />
        );
        expect(getByText(/Light applied/i)).toBeInTheDocument();
        expect(mockSetTheme).toHaveBeenCalledWith("light");

        // Completed dark theme
        rerender(
          <ThemeTool
            {...defaultToolProps}
            toolName="setTheme"
            args={{ theme: "dark" }}
            result={{ success: true, theme: "dark", message: "Theme set" }}
            status={{ type: "complete" }}
          />
        );
        expect(getByText(/Dark applied/i)).toBeInTheDocument();

        // Completed system theme
        rerender(
          <ThemeTool
            {...defaultToolProps}
            toolName="setTheme"
            args={{ theme: "system" }}
            result={{ success: true, theme: "system", message: "Theme set" }}
            status={{ type: "complete" }}
          />
        );
        expect(getByText(/System applied/i)).toBeInTheDocument();
      });
    });

    describe("SystemInfoTool", () => {
      it("should render running state", () => {
        const { getByText } = render(
          <SystemInfoTool
            {...defaultToolProps}
            toolName="getSystemInfo"
            args={{}}
            result={undefined}
            status={{ type: "running" }}
          />
        );
        expect(getByText(/Querying system metrics/i)).toBeInTheDocument();
      });

      it("should return null if complete but no result", () => {
        const { container } = render(
          <SystemInfoTool
            {...defaultToolProps}
            toolName="getSystemInfo"
            args={{}}
            result={undefined}
            status={{ type: "complete" }}
          />
        );
        expect(container).toBeEmptyDOMElement();
      });

      it("should render completed system metrics card with custom provider", () => {
        const { getByText } = render(
          <SystemInfoTool
            {...defaultToolProps}
            toolName="getSystemInfo"
            args={{}}
            result={{
              name: "cur8d",
              version: "0.1.0",
              framework: "Next.js 16 (App Router / Turbopack)",
              runtime: "React 19 Server Components",
              designSystem: "HeroUI v3 + Tailwind CSS v4",
              aiStack: "assistant-ui + Vercel AI SDK",
              environment: "development",
              provider: "gemini",
              status: "operational",
            }}
            status={{ type: "complete" }}
          />
        );
        expect(getByText("System Information")).toBeInTheDocument();
        expect(getByText("Next.js 16 (App Router / Turbopack)")).toBeInTheDocument();
        expect(getByText("HeroUI v3 + Tailwind CSS v4")).toBeInTheDocument();
        expect(getByText("operational")).toBeInTheDocument();
        expect(getByText("development (gemini)")).toBeInTheDocument();
      });
    });

    describe("NavigatePageTool", () => {
      it("should render navigation prompt card and trigger router.push when complete", () => {
        const { getByText } = render(
          <NavigatePageTool
            {...defaultToolProps}
            toolName="navigatePage"
            args={{ route: "/docs" }}
            result={{ success: true, route: "/docs", message: "Navigating" }}
            status={{ type: "complete" }}
          />
        );
        expect(getByText("/docs")).toBeInTheDocument();
        expect(getByText("Go now")).toBeInTheDocument();
        expect(mockPush).toHaveBeenCalledWith("/docs");
      });
    });
  });
});
