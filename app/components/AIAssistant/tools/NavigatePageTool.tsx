"use client";

import { useEffect } from "react";
import type { ToolCallMessagePartComponent } from "@assistant-ui/react";
import { useRouter } from "next/navigation";
import { Navigation, ArrowRight } from "lucide-react";
import Link from "next/link";

export type NavigatePageArgs = {
  route?: string;
};

export type NavigatePageResult = {
  success: boolean;
  route: string;
  message: string;
};

export const NavigatePageTool: ToolCallMessagePartComponent<NavigatePageArgs, NavigatePageResult> = ({
  args,
  result,
  status,
}) => {
  const router = useRouter();
  const targetRoute = result?.route || args?.route;

  useEffect(() => {
    if (status.type === "complete" && targetRoute) {
      router.push(targetRoute);
    }
  }, [status.type, targetRoute, router]);

  return (
    <div className="ai-tool-navigate">
      <div className="ai-tool-navigate__content">
        <Navigation className="size-3.5 text-primary" />
        <span>Navigating to <code className="ai-tool-navigate__code">{targetRoute}</code></span>
      </div>
      {targetRoute && (
        <Link
          href={targetRoute}
          className="ai-tool-navigate__link"
        >
          Go now <ArrowRight className="size-3" />
        </Link>
      )}
    </div>
  );
};
