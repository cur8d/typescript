import { renderHook, act } from "@testing-library/react";
import { useSearchState } from "../use-search-state";
import { describe, it, expect, beforeEach } from "vitest";

describe("useSearchState", () => {
  beforeEach(() => {
    // Reset global state before each test
    const { result } = renderHook(() => useSearchState());
    act(() => {
      result.current.onClose();
    });
  });

  it("should initialize with isOpen as false", () => {
    const { result } = renderHook(() => useSearchState());
    expect(result.current.isOpen).toBe(false);
  });

  it("should update isOpen when onOpen is called", () => {
    const { result } = renderHook(() => useSearchState());
    act(() => {
      result.current.onOpen();
    });
    expect(result.current.isOpen).toBe(true);
  });

  it("should update isOpen when onClose is called", () => {
    const { result } = renderHook(() => useSearchState());
    act(() => {
      result.current.onOpen();
    });
    expect(result.current.isOpen).toBe(true);
    act(() => {
      result.current.onClose();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it("should update isOpen when onOpenChange is called", () => {
    const { result } = renderHook(() => useSearchState());
    act(() => {
      result.current.onOpenChange(true);
    });
    expect(result.current.isOpen).toBe(true);
    act(() => {
      result.current.onOpenChange(false);
    });
    expect(result.current.isOpen).toBe(false);
  });

  it("should toggle isOpen when toggle is called", () => {
    const { result } = renderHook(() => useSearchState());
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(true);
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it("should synchronize state across multiple instances", () => {
    const { result: hook1 } = renderHook(() => useSearchState());
    const { result: hook2 } = renderHook(() => useSearchState());

    act(() => {
      hook1.current.onOpen();
    });

    expect(hook1.current.isOpen).toBe(true);
    expect(hook2.current.isOpen).toBe(true);

    act(() => {
      hook2.current.toggle();
    });

    expect(hook1.current.isOpen).toBe(false);
    expect(hook2.current.isOpen).toBe(false);
  });

  it("should provide HeroUI compatibility aliases", () => {
    const { result } = renderHook(() => useSearchState());

    expect(result.current.open).toBe(result.current.onOpen);
    expect(result.current.close).toBe(result.current.onClose);
    expect(result.current.setOpen).toBe(result.current.onOpenChange);
  });
});
