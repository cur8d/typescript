import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSpeechToText } from "@/hooks/use-speech-to-text";

describe("useSpeechToText hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    delete (window as unknown as Record<string, unknown>).SpeechRecognition;
    delete (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
  });

  it("should initialize with default unsupported state when SpeechRecognition is not available", () => {
    const { result } = renderHook(() => useSpeechToText());
    expect(result.current.isSupported).toBe(false);
    expect(result.current.isListening).toBe(false);
    expect(result.current.transcript).toBe("");
    expect(result.current.error).toBeNull();

    // Calling startListening/stopListening when unsupported does not crash
    act(() => {
      result.current.startListening();
      result.current.stopListening();
    });
  });

  it("should support webkitSpeechRecognition when standard SpeechRecognition is undefined", () => {
    const mockStart = vi.fn();
    const mockStop = vi.fn();
    const mockAbort = vi.fn();

    class MockWebkitSpeechRecognition {
      continuous = false;
      interimResults = false;
      lang = "en-US";
      start = mockStart;
      stop = mockStop;
      abort = mockAbort;
      onstart: (() => void) | null = null;
      onresult: ((event: unknown) => void) | null = null;
      onerror: ((event: unknown) => void) | null = null;
      onend: (() => void) | null = null;
    }

    (window as unknown as Record<string, unknown>).webkitSpeechRecognition = MockWebkitSpeechRecognition;

    const { result } = renderHook(() => useSpeechToText({ lang: "fr-FR", continuous: true, interimResults: false }));
    expect(result.current.isSupported).toBe(true);
  });

  it("should handle full lifecycle: start, events, toggle, reset, and unmount abort", () => {
    const mockStart = vi.fn();
    const mockStop = vi.fn();
    const mockAbort = vi.fn();
    let instance: {
      onstart: (() => void) | null;
      onresult: ((event: { resultIndex: number; results: Array<Array<{ transcript: string }>> }) => void) | null;
      onerror: ((event: { error: string }) => void) | null;
      onend: (() => void) | null;
    } | null = null;

    class MockSpeechRecognition {
      continuous = false;
      interimResults = false;
      lang = "en-US";
      start = mockStart;
      stop = mockStop;
      abort = mockAbort;
      onstart: (() => void) | null = null;
      onresult: ((event: { resultIndex: number; results: Array<Array<{ transcript: string }>> }) => void) | null = null;
      onerror: ((event: { error: string }) => void) | null = null;
      onend: (() => void) | null = null;

      constructor() {
        instance = this;
      }
    }

    (window as unknown as Record<string, unknown>).SpeechRecognition = MockSpeechRecognition;

    const onResult = vi.fn();
    const { result, unmount } = renderHook(() => useSpeechToText({ onResult }));

    expect(result.current.isSupported).toBe(true);

    // Start listening
    act(() => {
      result.current.startListening();
      instance?.onstart?.();
    });
    expect(mockStart).toHaveBeenCalled();
    expect(result.current.isListening).toBe(true);

    // Receive results across multiple segments
    act(() => {
      instance?.onresult?.({
        resultIndex: 0,
        results: [
          [{ transcript: "Hello " }],
          [{ transcript: "world" }],
        ],
      });
    });
    expect(result.current.transcript).toBe("Hello world");
    expect(onResult).toHaveBeenCalledWith("Hello world");

    // Toggle listening off
    act(() => {
      result.current.toggleListening();
    });
    expect(mockStop).toHaveBeenCalled();
    expect(result.current.isListening).toBe(false);

    // Toggle listening back on
    act(() => {
      result.current.toggleListening();
    });
    expect(result.current.isListening).toBe(true);

    // Error event
    act(() => {
      instance?.onerror?.({ error: "audio-capture" });
    });
    expect(result.current.error).toBe("audio-capture");
    expect(result.current.isListening).toBe(false);

    // End event
    act(() => {
      instance?.onend?.();
    });
    expect(result.current.isListening).toBe(false);

    // Reset transcript
    act(() => {
      result.current.resetTranscript();
    });
    expect(result.current.transcript).toBe("");
    expect(result.current.error).toBeNull();

    // Unmount triggers abort
    unmount();
    expect(mockAbort).toHaveBeenCalled();
  });

  it("should handle empty speech results without onResult callback", () => {
    let instance: {
      onresult: ((event: { resultIndex: number; results: Array<Array<{ transcript: string }>> }) => void) | null;
    } | null = null;

    class MockSpeechRecognition {
      continuous = false;
      interimResults = false;
      lang = "en-US";
      start = vi.fn();
      stop = vi.fn();
      abort = vi.fn();
      onstart = null;
      onresult = null;
      onerror = null;
      onend = null;

      constructor() {
        instance = this as unknown as { onresult: ((event: { resultIndex: number; results: Array<Array<{ transcript: string }>> }) => void) | null };
      }
    }

    (window as unknown as Record<string, unknown>).SpeechRecognition = MockSpeechRecognition;

    const { result } = renderHook(() => useSpeechToText());
    act(() => {
      instance?.onresult?.({
        resultIndex: 0,
        results: [[{ transcript: "" }]],
      });
    });
    expect(result.current.transcript).toBe("");
  });

  it("should catch and record errors when start() throws", () => {
    class ThrowingStartRecognition {
      continuous = false;
      interimResults = false;
      lang = "en-US";
      start = () => {
        throw new Error("Microphone permission denied");
      };
      stop = vi.fn();
      abort = vi.fn();
      onstart = null;
      onresult = null;
      onerror = null;
      onend = null;
    }

    (window as unknown as Record<string, unknown>).SpeechRecognition = ThrowingStartRecognition;

    const { result } = renderHook(() => useSpeechToText());

    act(() => {
      result.current.startListening();
    });

    expect(result.current.error).toBe("Microphone permission denied");
  });

  it("should handle non-Error exceptions in startListening", () => {
    class NonErrorThrowingRecognition {
      continuous = false;
      interimResults = false;
      lang = "en-US";
      start = () => {
        throw "String error";
      };
      stop = vi.fn();
      abort = vi.fn();
      onstart = null;
      onresult = null;
      onerror = null;
      onend = null;
    }

    (window as unknown as Record<string, unknown>).SpeechRecognition = NonErrorThrowingRecognition;

    const { result } = renderHook(() => useSpeechToText());

    act(() => {
      result.current.startListening();
    });

    expect(result.current.error).toBe("Failed to start speech recognition");
  });

  it("should safely ignore errors thrown by stop()", () => {
    class ThrowingStopRecognition {
      continuous = false;
      interimResults = false;
      lang = "en-US";
      start = vi.fn();
      stop = () => {
        throw new Error("Already stopped");
      };
      abort = vi.fn();
      onstart = null;
      onresult = null;
      onerror = null;
      onend = null;
    }

    (window as unknown as Record<string, unknown>).SpeechRecognition = ThrowingStopRecognition;

    const { result } = renderHook(() => useSpeechToText());

    expect(() => {
      act(() => {
        result.current.stopListening();
      });
    }).not.toThrow();
  });
});
