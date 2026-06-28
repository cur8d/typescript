"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

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

  return (
    <div className="code-block">
      <div className="flex items-center gap-3">
        <span className="text-primary select-none">$</span>
        <code className="text-foreground">{code}</code>
      </div>
      <button
        onClick={copyToClipboard}
        className="text-muted-foreground hover:text-foreground transition-colors p-1"
        aria-label="Copy to clipboard"
      >
        {copied ? (
          <Check className="h-4 w-4 text-success" data-testid="check-icon" />
        ) : (
          <Copy className="h-4 w-4" data-testid="copy-icon" />
        )}
      </button>
    </div>
  );
};
