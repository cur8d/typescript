"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Tooltip } from "@heroui/react";

interface CodeSnippetProps {
  code: string;
}

export const CodeSnippet = ({ code }: CodeSnippetProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  const label = copied ? "Copied!" : "Copy to clipboard";

  return (
    <div className="code-block">
      <div className="flex items-center gap-3">
        <span className="text-primary select-none">$</span>
        <code className="text-foreground">{code}</code>
      </div>
      <Tooltip delay={300} closeDelay={0}>
        <Tooltip.Trigger
          render={(props: React.HTMLAttributes<Element>) => (
            <button
              {...props}
              onClick={(e: React.MouseEvent<Element>) => {
                props.onClick?.(e);
                copyToClipboard();
              }}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-md"
              aria-label={label}
            >
              {copied ? (
                <Check className="h-4 w-4 text-success" data-testid="check-icon" />
              ) : (
                <Copy className="h-4 w-4" data-testid="copy-icon" />
              )}
            </button>
          )}
        />
        <Tooltip.Content>{label}</Tooltip.Content>
      </Tooltip>
    </div>
  );
};
