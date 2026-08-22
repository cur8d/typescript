"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button, Tooltip } from "@heroui/react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Performance optimization: Avoid useMemo overhead for simple, non-expensive string evaluations.
  const targetTheme = resolvedTheme === "dark" ? "light" : "dark";
  const label = mounted ? `Switch to ${targetTheme} theme` : "Toggle theme";

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
