"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * Performance & UX Optimization:
   * 1. Explicit dimensions (size-10 md:size-9) prevent Cumulative Layout Shift (CLS) during hydration.
   * 2. useTheme's resolvedTheme correctly handles "system" theme resolution.
   */
  if (!mounted) {
    return (
      <Button
        isIconOnly
        variant="ghost"
        aria-label="Toggle theme"
        className="size-10 md:size-9"
      />
    );
  }

  return (
    <Button
      isIconOnly
      variant="ghost"
      aria-label="Toggle theme"
      className="size-10 md:size-9"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}
