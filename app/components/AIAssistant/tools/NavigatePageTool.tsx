"use client";

import { useEffect } from "react";
import { makeAssistantToolUI } from "@assistant-ui/react";
import { useRouter } from "next/navigation";
import { Navigation, ArrowRight } from "lucide-react";
import Link from "next/link";

export interface NavigatePageArgs {
  route: string;
}

export interface NavigatePageResult {
  success: boolean;
  route: string;
  message: string;
}

export const NavigatePageTool = makeAssistantToolUI<NavigatePageArgs, NavigatePageResult>({
  toolName: "navigatePage",
  render: ({ args, result, status }) => {
    const router = useRouter();
    const targetRoute = result?.route || args?.route;

    useEffect(() => {
      if (status.type === "complete" && targetRoute) {
        router.push(targetRoute);
      }
    }, [status.type, targetRoute, router]);

    return (
      <div className="my-2 flex items-center justify-between rounded-lg border border-border bg-secondary/40 p-2.5 text-xs text-foreground shadow-xs">
        <div className="flex items-center gap-2">
          <Navigation className="size-3.5 text-primary" />
          <span>Navigating to <code className="font-mono text-primary">{targetRoute}</code></span>
        </div>
        {targetRoute && (
          <Link
            href={targetRoute}
            className="flex items-center gap-1 font-medium text-primary hover:underline"
          >
            Go now <ArrowRight className="size-3" />
          </Link>
        )}
      </div>
    );
  },
});
