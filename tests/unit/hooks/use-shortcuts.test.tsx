import { renderHook } from "@testing-library/react";
import { useShortcuts } from "@/hooks/use-shortcuts";
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("useShortcuts", () => {
  const callback = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should trigger callback when matching shortcut (Alt+T) is pressed", () => {
    renderHook(() => useShortcuts("TOGGLE_THEME", callback));

    const event = new KeyboardEvent("keydown", {
      key: "t",
      altKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should ignore case of the key", () => {
    renderHook(() => useShortcuts("TOGGLE_THEME", callback));

    const event = new KeyboardEvent("keydown", {
      key: "T",
      altKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should not trigger callback when non-matching key is pressed", () => {
    renderHook(() => useShortcuts("TOGGLE_THEME", callback));

    const event = new KeyboardEvent("keydown", {
      key: "a",
      altKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event);

    expect(callback).not.toHaveBeenCalled();
  });

  it("should not trigger callback when modifier key is missing", () => {
    renderHook(() => useShortcuts("TOGGLE_THEME", callback));

    const event = new KeyboardEvent("keydown", {
      key: "t",
      altKey: false,
      bubbles: true,
    });
    window.dispatchEvent(event);

    expect(callback).not.toHaveBeenCalled();
  });

  it("should not trigger callback when focus is on an input or textarea element", () => {
    renderHook(() => useShortcuts("TOGGLE_THEME", callback));

    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();

    const event = new KeyboardEvent("keydown", {
      key: "t",
      altKey: true,
      bubbles: true,
    });
    input.dispatchEvent(event);

    expect(callback).not.toHaveBeenCalled();

    document.body.removeChild(input);
  });

  it("should remove event listener on unmount", () => {
    const { unmount } = renderHook(() => useShortcuts("TOGGLE_THEME", callback));

    unmount();

    const event = new KeyboardEvent("keydown", {
      key: "t",
      altKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event);

    expect(callback).not.toHaveBeenCalled();
  });
});
