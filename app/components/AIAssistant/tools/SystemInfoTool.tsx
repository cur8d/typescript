"use client";

import type { ToolCallMessagePartComponent } from "@assistant-ui/react";
import { Cpu, CheckCircle, Layers, Palette, Bot } from "lucide-react";

export type SystemInfoArgs = Record<string, unknown>;

export type SystemInfoResult = {
  name: string;
  version: string;
  framework: string;
  runtime: string;
  designSystem: string;
  aiStack: string;
  environment: string;
  provider?: string;
  status: string;
};

export const SystemInfoTool: ToolCallMessagePartComponent<SystemInfoArgs, SystemInfoResult> = ({
  result,
  status,
}) => {
  if (status.type === "running") {
    return (
      <div className="ai-tool-system-info--loading">
        <Cpu className="size-4 animate-spin text-primary" />
        <span>Querying system metrics and runtime info...</span>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="ai-tool-system-info">
      <div className="ai-tool-system-info__header">
        <div className="ai-tool-system-info__title-wrap">
          <Cpu className="size-4 text-primary" />
          <span className="ai-tool-system-info__title">System Information</span>
        </div>
        <span className="ai-tool-system-info__status">
          <CheckCircle className="size-3" />
          {result.status}
        </span>
      </div>

      <div className="ai-tool-system-info__grid">
        <div className="ai-tool-system-info__item">
          <Layers className="size-3.5 text-primary shrink-0 mt-0.5" />
          <div>
            <div className="ai-tool-system-info__label">Framework</div>
            <div className="ai-tool-system-info__val">{result.framework}</div>
          </div>
        </div>

        <div className="ai-tool-system-info__item">
          <Palette className="size-3.5 text-primary shrink-0 mt-0.5" />
          <div>
            <div className="ai-tool-system-info__label">Design System</div>
            <div className="ai-tool-system-info__val">{result.designSystem}</div>
          </div>
        </div>

        <div className="ai-tool-system-info__item">
          <Bot className="size-3.5 text-primary shrink-0 mt-0.5" />
          <div>
            <div className="ai-tool-system-info__label">AI Stack</div>
            <div className="ai-tool-system-info__val">{result.aiStack}</div>
          </div>
        </div>

        <div className="ai-tool-system-info__item">
          <Cpu className="size-3.5 text-primary shrink-0 mt-0.5" />
          <div>
            <div className="ai-tool-system-info__label">Environment</div>
            <div className="ai-tool-system-info__val capitalize">{result.environment} ({result.provider || "mock"})</div>
          </div>
        </div>
      </div>
    </div>
  );
};
