"use client";

import type { ToolCallMessagePartComponent } from "@assistant-ui/react";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import type { DocItem } from "@/lib/ai/tools";

export type DocSearchArgs = {
  query?: string;
};

export type DocSearchResult = {
  query: string;
  results: DocItem[];
};

export const DocSearchTool: ToolCallMessagePartComponent<DocSearchArgs, DocSearchResult> = ({
  args,
  result,
  status,
}) => {
  if (status.type === "running") {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/40 p-3 text-sm text-muted-foreground animate-pulse">
        <BookOpen className="size-4 animate-spin text-primary" />
        <span>Searching documentation for &quot;{args?.query || "topics"}&quot;...</span>
      </div>
    );
  }

  if (!result?.results?.length) {
    return (
      <div className="rounded-lg border border-border bg-secondary/20 p-3 text-sm text-muted-foreground">
        No documentation matches found for &quot;{args?.query}&quot;.
      </div>
    );
  }

  return (
    <div className="my-2 space-y-2 rounded-xl border border-border bg-secondary/30 p-3 shadow-xs">
      <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        <span className="flex items-center gap-1.5">
          <BookOpen className="size-3.5 text-primary" />
          Documentation Results ({result.results.length})
        </span>
        <span className="text-[11px] font-normal text-muted-foreground">Query: {result.query}</span>
      </div>

      <div className="grid gap-2">
        {result.results.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className="group flex flex-col justify-between rounded-lg border border-border/60 bg-background/80 p-2.5 transition-colors hover:border-primary/50 hover:bg-secondary/60 focus-ring"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                {item.title}
              </div>
              <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                {item.category}
              </span>
            </div>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
            <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-primary">
              Read guide
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
