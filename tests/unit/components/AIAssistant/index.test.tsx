import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AIAssistant, useAIAssistant, AIAssistantProvider } from "@/components/AIAssistant";
import { DocSearchTool, type DocSearchArgs, type DocSearchResult } from "@/components/AIAssistant/tools/DocSearchTool";
import { ThemeTool, type ThemeArgs, type ThemeResult } from "@/components/AIAssistant/tools/ThemeTool";
import { SystemInfoTool, type SystemInfoArgs, type SystemInfoResult } from "@/components/AIAssistant/tools/SystemInfoTool";
import { NavigatePageTool, type NavigatePageArgs, type NavigatePageResult } from "@/components/AIAssistant/tools/NavigatePageTool";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { renderHook } from "@testing-library/react";

interface ToolRenderProps<TArgs, TResult> {
  args: TArgs;
  result: TResult | undefined;
  status: { type: "running" | "complete" | "incomplete" | "error" };
}

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "dark",
    setTheme: vi.fn(),
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

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
    it("should render floating trigger button", () => {
      render(
        <AIAssistantProvider>
          <AIAssistant />
        </AIAssistantProvider>
      );
      const trigger = screen.getByRole("button", { name: /open ai assistant/i });
      expect(trigger).toBeInTheDocument();
      expect(screen.getByText("Ask AI")).toBeInTheDocument();
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

    it("should toggle open state with Command/Ctrl + J shortcut", () => {
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

    it("should provide safe fallback if useAIAssistant is used outside provider", () => {
      render(<TestConsumer />);
      expect(screen.getByTestId("status")).toHaveTextContent("closed");
    });
  });

  describe("Generative UI Tools", () => {
    describe("DocSearchTool", () => {
      const renderTool = (DocSearchTool as unknown as { unstable_tool: { render: (props: ToolRenderProps<DocSearchArgs, DocSearchResult>) => React.ReactNode } }).unstable_tool.render;
      const ToolComponent = (props: ToolRenderProps<DocSearchArgs, DocSearchResult>) => <>{renderTool(props)}</>;

      it("should render running state", () => {
        const { getByText } = render(
          <ToolComponent
            args={{ query: "getting started" }}
            result={undefined}
            status={{ type: "running" }}
          />
        );
        expect(getByText(/Searching documentation for "getting started"/i)).toBeInTheDocument();
      });

      it("should render empty state when no results", () => {
        const { getByText } = render(
          <ToolComponent
            args={{ query: "nonexistent" }}
            result={{ query: "nonexistent", results: [] }}
            status={{ type: "complete" }}
          />
        );
        expect(getByText(/No documentation matches found/i)).toBeInTheDocument();
      });

      it("should render document search result cards with links", () => {
        const { getByText } = render(
          <ToolComponent
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
      const renderTool = (ThemeTool as unknown as { unstable_tool: { render: (props: ToolRenderProps<ThemeArgs, ThemeResult>) => React.ReactNode } }).unstable_tool.render;
      const ToolComponent = (props: ToolRenderProps<ThemeArgs, ThemeResult>) => <>{renderTool(props)}</>;

      it("should render running state", () => {
        const { getByText } = render(
          <ToolComponent
            args={{ theme: "dark" }}
            result={undefined}
            status={{ type: "running" }}
          />
        );
        expect(getByText(/Switching theme to dark/i)).toBeInTheDocument();
      });

      it("should render completed theme pill", () => {
        const { getByText } = render(
          <ToolComponent
            args={{ theme: "dark" }}
            result={{ success: true, theme: "dark", message: "Theme set" }}
            status={{ type: "complete" }}
          />
        );
        expect(getByText(/Dark applied/i)).toBeInTheDocument();
      });
    });

    describe("SystemInfoTool", () => {
      const renderTool = (SystemInfoTool as unknown as { unstable_tool: { render: (props: ToolRenderProps<SystemInfoArgs, SystemInfoResult>) => React.ReactNode } }).unstable_tool.render;
      const ToolComponent = (props: ToolRenderProps<SystemInfoArgs, SystemInfoResult>) => <>{renderTool(props)}</>;

      it("should render running state", () => {
        const { getByText } = render(
          <ToolComponent
            args={{}}
            result={undefined}
            status={{ type: "running" }}
          />
        );
        expect(getByText(/Querying system metrics/i)).toBeInTheDocument();
      });

      it("should render completed system metrics card", () => {
        const { getByText } = render(
          <ToolComponent
            args={{}}
            result={{
              name: "cur8d",
              version: "0.1.0",
              framework: "Next.js 16 (App Router / Turbopack)",
              runtime: "React 19 Server Components",
              designSystem: "HeroUI v3 + Tailwind CSS v4",
              aiStack: "assistant-ui + Vercel AI SDK",
              environment: "development",
              status: "operational",
            }}
            status={{ type: "complete" }}
          />
        );
        expect(getByText("System Information")).toBeInTheDocument();
        expect(getByText("Next.js 16 (App Router / Turbopack)")).toBeInTheDocument();
        expect(getByText("HeroUI v3 + Tailwind CSS v4")).toBeInTheDocument();
        expect(getByText("operational")).toBeInTheDocument();
      });
    });

    describe("NavigatePageTool", () => {
      const renderTool = (NavigatePageTool as unknown as { unstable_tool: { render: (props: ToolRenderProps<NavigatePageArgs, NavigatePageResult>) => React.ReactNode } }).unstable_tool.render;
      const ToolComponent = (props: ToolRenderProps<NavigatePageArgs, NavigatePageResult>) => <>{renderTool(props)}</>;

      it("should render navigation prompt card", () => {
        const { getByText } = render(
          <ToolComponent
            args={{ route: "/docs" }}
            result={{ success: true, route: "/docs", message: "Navigating" }}
            status={{ type: "complete" }}
          />
        );
        expect(getByText("/docs")).toBeInTheDocument();
        expect(getByText("Go now")).toBeInTheDocument();
      });
    });
  });

  describe("useSpeechToText hook", () => {
    it("should initialize with default state", () => {
      const { result } = renderHook(() => useSpeechToText());
      expect(result.current.isListening).toBe(false);
      expect(result.current.transcript).toBe("");
    });

    it("should handle speech recognition lifecycle, events, and toggle", () => {
      const mockStart = vi.fn();
      const mockStop = vi.fn();
      const mockAbort = vi.fn();
      let onStartHandler: (() => void) | null = null;
      let onResultHandler: ((event: { resultIndex: number; results: Array<Array<{ transcript: string }>> }) => void) | null = null;
      let onErrorHandler: ((event: { error: string }) => void) | null = null;
      let onEndHandler: (() => void) | null = null;

      class MockSpeechRecognition {
        continuous = false;
        interimResults = false;
        lang = "en-US";
        start = mockStart;
        stop = mockStop;
        abort = mockAbort;
        set onstart(fn: (() => void) | null) { onStartHandler = fn; }
        set onresult(fn: ((event: { resultIndex: number; results: Array<Array<{ transcript: string }>> }) => void) | null) { onResultHandler = fn; }
        set onerror(fn: ((event: { error: string }) => void) | null) { onErrorHandler = fn; }
        set onend(fn: (() => void) | null) { onEndHandler = fn; }
      }

      window.SpeechRecognition = MockSpeechRecognition as unknown as typeof window.SpeechRecognition;

      const onResult = vi.fn();
      const { result } = renderHook(() => useSpeechToText({ onResult }));
      expect(result.current.isSupported).toBe(true);

      act(() => {
        result.current.startListening();
        if (onStartHandler) onStartHandler();
      });
      expect(mockStart).toHaveBeenCalled();
      expect(result.current.isListening).toBe(true);

      act(() => {
        if (onResultHandler) {
          onResultHandler({
            resultIndex: 0,
            results: [[{ transcript: "hello voice" }]],
          });
        }
      });
      expect(result.current.transcript).toBe("hello voice");
      expect(onResult).toHaveBeenCalledWith("hello voice");

      act(() => {
        if (onErrorHandler) onErrorHandler({ error: "network" });
      });
      expect(result.current.error).toBe("network");
      expect(result.current.isListening).toBe(false);

      act(() => {
        if (onEndHandler) onEndHandler();
      });

      act(() => {
        result.current.resetTranscript();
      });
      expect(result.current.transcript).toBe("");
      expect(result.current.error).toBeNull();

      act(() => {
        result.current.toggleListening();
      });
      expect(result.current.isListening).toBe(true);

      act(() => {
        result.current.toggleListening();
      });
      expect(result.current.isListening).toBe(false);

      delete window.SpeechRecognition;
    });
  });
});
