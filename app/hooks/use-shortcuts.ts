"use client";

import { useEffect, useRef } from "react";
import { SHORTCUTS } from "@/config/shortcuts";

interface ShortcutConfig {
  key: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
}

export function useShortcuts(action: keyof typeof SHORTCUTS, callback: () => void) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const config = SHORTCUTS[action] as ShortcutConfig;

    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement;
      if (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.tagName === "SELECT" ||
          (activeElement as HTMLElement).isContentEditable)
      ) {
        return;
      }

      const keyMatch = event.key.toLowerCase() === config.key.toLowerCase();
      const altMatch = !config.altKey || event.altKey;
      const ctrlMatch = !config.ctrlKey || event.ctrlKey;
      const shiftMatch = !config.shiftKey || event.shiftKey;
      const metaMatch = !config.metaKey || event.metaKey;

      if (keyMatch && altMatch && ctrlMatch && shiftMatch && metaMatch) {
        event.preventDefault();
        callbackRef.current();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [action]);
}
