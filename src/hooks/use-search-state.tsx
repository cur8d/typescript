"use client";

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";

interface SearchContextValue {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
  toggle: () => void;
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => setIsOpen(false), []);
  const onOpenChange = useCallback((open: boolean) => setIsOpen(open), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const value = useMemo(
    () => ({
      isOpen,
      onOpen,
      onClose,
      onOpenChange,
      toggle,
    }),
    [isOpen, onOpen, onClose, onOpenChange, toggle]
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearchState() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchState must be used within a SearchProvider");
  }

  return {
    ...context,
    // Compatibility with HeroUI useOverlayState if needed
    open: context.onOpen,
    close: context.onClose,
    setOpen: context.onOpenChange
  };
}
