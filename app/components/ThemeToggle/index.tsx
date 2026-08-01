"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button, Tooltip } from "@heroui/react";
import { Sun, Moon } from "lucide-react";
import { useShortcuts } from "@/hooks/use-shortcuts";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const targetTheme = resolvedTheme === "dark" ? "light" : "dark";
  const os = typeof navigator !== "undefined" && /Mac/i.test(navigator.userAgent) ? "⌥T" : "Alt+T";
  const label = mounted ? `Switch to ${targetTheme} theme (${os})` : "Toggle theme";

  useShortcuts("TOGGLE_THEME", () => {
    if (mounted) setTheme(targetTheme);
  });

  return (
    <Tooltip delay={200} closeDelay={0}>
      <Tooltip.Trigger
        render={(props: React.HTMLAttributes<Element>) => (
          <Button
            {...props}
            isIconOnly
            variant="ghost"
            aria-label={label}
            className="size-10 md:size-9 focus-visible:ring-2 focus-visible:ring-primary"
            onClick={(e: React.MouseEvent<Element>) => {
              props.onClick?.(e);
              if (mounted) setTheme(targetTheme);
            }}
          >
            {!mounted ? null : resolvedTheme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        )}
      />
      <Tooltip.Content>{label}</Tooltip.Content>
    </Tooltip>
  );
}
