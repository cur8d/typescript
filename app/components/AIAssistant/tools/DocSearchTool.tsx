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
      <div className="ai-tool-docsearch--loading">
        <BookOpen className="size-4 animate-spin text-primary" />
        <span>Searching documentation for &quot;{args?.query || "topics"}&quot;...</span>
      </div>
    );
  }

  if (!result?.results?.length) {
    return (
      <div className="ai-tool-docsearch--empty">
        No documentation matches found for &quot;{args?.query}&quot;.
      </div>
    );
  }

  return (
    <div className="ai-tool-docsearch">
      <div className="ai-tool-docsearch__header">
        <span className="flex items-center gap-1.5">
          <BookOpen className="size-3.5 text-primary" />
          Documentation Results ({result.results.length})
        </span>
        <span className="ai-tool-docsearch__query">Query: {result.query}</span>
      </div>

      <div className="ai-tool-docsearch__grid">
        {result.results.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className="ai-tool-docsearch__card"
          >
            <div className="ai-tool-docsearch__card-header">
              <div className="ai-tool-docsearch__card-title">
                {item.title}
              </div>
              <span className="ai-tool-docsearch__card-badge">
                {item.category}
              </span>
            </div>
            <p className="ai-tool-docsearch__card-desc">{item.description}</p>
            <div className="ai-tool-docsearch__card-action">
              Read guide
              <ArrowRight className="ai-tool-docsearch__card-arrow" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
