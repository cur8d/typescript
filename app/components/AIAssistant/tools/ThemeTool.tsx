"use client";

import { useEffect } from "react";
import { makeAssistantToolUI } from "@assistant-ui/react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop, CheckCircle2 } from "lucide-react";

export interface ThemeArgs {
  theme: "light" | "dark" | "system";
}

export interface ThemeResult {
  success: boolean;
  theme: "light" | "dark" | "system";
  message: string;
}

export const ThemeTool = makeAssistantToolUI<ThemeArgs, ThemeResult>({
  toolName: "setTheme",
  render: ({ args, result, status }) => {
    const { setTheme } = useTheme();
    const targetTheme = result?.theme || args?.theme;

    useEffect(() => {
      if (targetTheme) {
        setTheme(targetTheme);
      }
    }, [targetTheme, setTheme]);

    const getIcon = (theme?: string) => {
      switch (theme) {
        case "light":
          return <Sun className="size-4 text-amber-500" />;
        case "dark":
          return <Moon className="size-4 text-indigo-400" />;
        default:
          return <Laptop className="size-4 text-muted-foreground" />;
      }
    };

    if (status.type === "running") {
      return (
        <div className="my-2 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs text-muted-foreground animate-pulse">
          {getIcon(targetTheme)}
          <span>Switching theme to {targetTheme || "system"}...</span>
        </div>
      );
    }

    return (
      <div className="my-2 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs text-foreground font-medium shadow-xs">
        {getIcon(targetTheme)}
        <span className="capitalize">{targetTheme || "Theme"} applied</span>
        <CheckCircle2 className="size-3.5 text-emerald-500 ml-1" />
      </div>
    );
  },
});
