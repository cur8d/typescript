"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useMemo } from "react";
import { Button, Tooltip } from "@heroui/react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const targetTheme = useMemo(() =>
    resolvedTheme === "dark" ? "light" : "dark"
  , [resolvedTheme]);

  const label = useMemo(() =>
    mounted ? `Switch to ${targetTheme} theme` : "Toggle theme"
  , [mounted, targetTheme]);

  return (
    <Tooltip delay={300} closeDelay={0}>
      <Tooltip.Trigger>
        <Button
          isIconOnly
          variant="ghost"
          aria-label={label}
          className="size-10 md:size-9"
          onClick={() => mounted && setTheme(targetTheme)}
        >
          {!mounted ? null : resolvedTheme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>{label}</Tooltip.Content>
    </Tooltip>
  );
}
