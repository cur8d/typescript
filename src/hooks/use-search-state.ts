import { useState, useEffect, useCallback } from "react";

type Listener = (open: boolean) => void;
const listeners = new Set<Listener>();
let globalIsOpen = false;

const notify = (open: boolean) => {
  globalIsOpen = open;
  listeners.forEach((l) => l(open));
};

export function useSearchState() {
  const [isOpen, setIsOpen] = useState(globalIsOpen);

  useEffect(() => {
    const callback = (open: boolean) => setIsOpen(open);
    listeners.add(callback);
    return () => {
      listeners.delete(callback);
    };
  }, []);

  const onOpen = useCallback(() => notify(true), []);
  const onClose = useCallback(() => notify(false), []);
  const onOpenChange = useCallback((open: boolean) => notify(open), []);
  const toggle = useCallback(() => notify(!globalIsOpen), []);

  return {
    isOpen,
    onOpen,
    onClose,
    onOpenChange,
    toggle,
    // Compatibility with HeroUI useOverlayState if needed
    open: onOpen,
    close: onClose,
    setOpen: onOpenChange
  };
}
