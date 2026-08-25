"use client";

import { makeAssistantToolUI } from "@assistant-ui/react";
import { Cpu, CheckCircle, Layers, Palette, Bot } from "lucide-react";

export interface SystemInfoArgs {}

export interface SystemInfoResult {
  name: string;
  version: string;
  framework: string;
  runtime: string;
  designSystem: string;
  aiStack: string;
  environment: string;
  provider?: string;
  status: string;
}

export const SystemInfoTool = makeAssistantToolUI<SystemInfoArgs, SystemInfoResult>({
  toolName: "getSystemInfo",
  render: ({ result, status }) => {
    if (status.type === "running") {
      return (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/40 p-3 text-sm text-muted-foreground animate-pulse">
          <Cpu className="size-4 animate-spin text-primary" />
          <span>Querying system metrics and runtime info...</span>
        </div>
      );
    }

    if (!result) return null;

    return (
      <div className="my-2 rounded-xl border border-border bg-secondary/30 p-3.5 shadow-xs">
        <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-2.5">
          <div className="flex items-center gap-2">
            <Cpu className="size-4 text-primary" />
            <span className="font-semibold text-xs text-foreground tracking-wide uppercase">System Information</span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
            <CheckCircle className="size-3" />
            {result.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-start gap-1.5 rounded-md bg-background/60 p-2 border border-border/40">
            <Layers className="size-3.5 text-primary shrink-0 mt-0.5" />
            <div>
              <div className="text-[10px] font-medium text-muted-foreground">Framework</div>
              <div className="font-semibold text-foreground">{result.framework}</div>
            </div>
          </div>

          <div className="flex items-start gap-1.5 rounded-md bg-background/60 p-2 border border-border/40">
            <Palette className="size-3.5 text-primary shrink-0 mt-0.5" />
            <div>
              <div className="text-[10px] font-medium text-muted-foreground">Design System</div>
              <div className="font-semibold text-foreground">{result.designSystem}</div>
            </div>
          </div>

          <div className="flex items-start gap-1.5 rounded-md bg-background/60 p-2 border border-border/40">
            <Bot className="size-3.5 text-primary shrink-0 mt-0.5" />
            <div>
              <div className="text-[10px] font-medium text-muted-foreground">AI Stack</div>
              <div className="font-semibold text-foreground">{result.aiStack}</div>
            </div>
          </div>

          <div className="flex items-start gap-1.5 rounded-md bg-background/60 p-2 border border-border/40">
            <Cpu className="size-3.5 text-primary shrink-0 mt-0.5" />
            <div>
              <div className="text-[10px] font-medium text-muted-foreground">Environment</div>
              <div className="font-semibold text-foreground capitalize">{result.environment} ({result.provider || "mock"})</div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
