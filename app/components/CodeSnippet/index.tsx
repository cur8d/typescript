"use client";

import { Check, Copy, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Button, Tooltip } from "@heroui/react";
import { reportError } from "@/lib/error-reporting";

interface CodeSnippetProps {
  code: string;
}

export const CodeSnippet = ({ code }: CodeSnippetProps) => {
  const [copied, setCopied] = useState(false);
  const [hasError, setHasError] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setHasError(false);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      reportError(error, { component: "CodeSnippet", action: "copy" });
      setCopied(false);
      setHasError(true);
      setTimeout(() => setHasError(false), 2000);
    }
  };

  const getLabel = () => {
    if (hasError) return "Failed to copy";
    if (copied) return "Copied!";
    return "Copy to clipboard";
  };

  const label = getLabel();

  const getIcon = () => {
    if (hasError) {
      return (
        <AlertCircle className="h-4 w-4 text-danger" data-testid="error-icon" />
      );
    }
    if (copied) {
      return <Check className="h-4 w-4 text-success" data-testid="check-icon" />;
    }
    return <Copy className="h-4 w-4" data-testid="copy-icon" />;
  };

  return (
    <div className="code-block">
      <div className="flex items-center gap-3">
        <span className="text-primary select-none">$</span>
        <code className="text-foreground">{code}</code>
      </div>
      <Tooltip delay={200} closeDelay={0}>
        <Tooltip.Trigger
          render={(props: React.HTMLAttributes<Element>) => (
            <Button
              {...props}
              isIconOnly
              variant="ghost"
              size="sm"
              onPress={copyToClipboard}
              onClick={(e: React.MouseEvent<Element>) => {
                props.onClick?.(e);
              }}
              className="code-block__button focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={label}
            >
              {getIcon()}
            </Button>
          )}
        />
        <Tooltip.Content>{label}</Tooltip.Content>
      </Tooltip>
    </div>
  );
};
