"use client";

import { useEffect, useState } from "react";
import { Kbd } from "@heroui/react";

interface ShortcutHintProps {
  shortcut: string;
}

export function ShortcutHint({ shortcut }: ShortcutHintProps) {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.userAgent.toLowerCase().includes("mac"));
  }, []);

  return (
    <Kbd>
      {isMac ? "⌘" : "Ctrl"}+{shortcut}
    </Kbd>
  );
}
