"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useMemo } from "react";
import { Button, Tooltip } from "@heroui/react";
import { Sun, Moon } from "lucide-react";
import { useShortcuts } from "@/hooks/use-shortcuts";

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

  const handleToggle = () => {
    if (mounted) {
      setTheme(targetTheme);
    }
  };

  useShortcuts("TOGGLE_THEME", handleToggle);

  return (
    <Tooltip delay={200} closeDelay={0}>
      <Tooltip.Trigger>
        <Button
          isIconOnly
          variant="ghost"
          aria-label={label}
          className="size-10 md:size-9 focus-visible:ring-2 focus-visible:ring-primary"
          onPress={handleToggle}
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
