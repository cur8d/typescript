import { renderHook, act } from "@testing-library/react";
import { useSearchState, SearchProvider } from "@/hooks/use-search-state";
import { describe, it, expect, vi } from "vitest";
import { ReactNode } from "react";

const wrapper = ({ children }: { children: ReactNode }) => (
  <SearchProvider>{children}</SearchProvider>
);

describe("useSearchState", () => {
  it("should initialize with isOpen as false", () => {
    const { result } = renderHook(() => useSearchState(), { wrapper });
    expect(result.current.isOpen).toBe(false);
  });

  it("should update isOpen when onOpen is called", () => {
    const { result } = renderHook(() => useSearchState(), { wrapper });
    act(() => {
      result.current.onOpen();
    });
    expect(result.current.isOpen).toBe(true);
  });

  it("should update isOpen when onClose is called", () => {
    const { result } = renderHook(() => useSearchState(), { wrapper });
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
    const { result } = renderHook(() => useSearchState(), { wrapper });
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
    const { result } = renderHook(() => useSearchState(), { wrapper });
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(true);
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it("should synchronize state across multiple instances sharing the same provider", () => {
    const { result } = renderHook(() => {
      const hook1 = useSearchState();
      const hook2 = useSearchState();
      return { hook1, hook2 };
    }, { wrapper });

    act(() => {
      result.current.hook1.onOpen();
    });

    expect(result.current.hook1.isOpen).toBe(true);
    expect(result.current.hook2.isOpen).toBe(true);

    act(() => {
      result.current.hook2.toggle();
    });

    expect(result.current.hook1.isOpen).toBe(false);
    expect(result.current.hook2.isOpen).toBe(false);
  });

  it("should provide HeroUI compatibility aliases", () => {
    const { result } = renderHook(() => useSearchState(), { wrapper });

    expect(result.current.open).toBe(result.current.onOpen);
    expect(result.current.close).toBe(result.current.onClose);
    expect(result.current.setOpen).toBe(result.current.onOpenChange);
  });

  it("should throw error if used outside SearchProvider", () => {
    // Suppress console.error for this test as we expect an error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useSearchState())).toThrow("useSearchState must be used within a SearchProvider");

    consoleSpy.mockRestore();
  });
});
