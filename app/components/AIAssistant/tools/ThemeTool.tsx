"use client";

import { useEffect } from "react";
import type { ToolCallMessagePartComponent } from "@assistant-ui/react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop, CheckCircle2 } from "lucide-react";

export type ThemeArgs = {
  theme?: "light" | "dark" | "system";
};

export type ThemeResult = {
  success: boolean;
  theme: "light" | "dark" | "system";
  message: string;
};

export const ThemeTool: ToolCallMessagePartComponent<ThemeArgs, ThemeResult> = ({
  args,
  result,
  status,
}) => {
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
      <div className="ai-tool-theme--running">
        {getIcon(targetTheme)}
        <span>Switching theme to {targetTheme || "system"}...</span>
      </div>
    );
  }

  return (
    <div className="ai-tool-theme--complete">
      {getIcon(targetTheme)}
      <span className="capitalize">{targetTheme || "Theme"} applied</span>
      <CheckCircle2 className="size-3.5 text-emerald-500 ml-1" />
    </div>
  );
};
