"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ExternalLink, Bot } from "lucide-react";
import { useAIAssistant } from "@/components/AIAssistant";
import { Button } from "@heroui/react";

export function Navbar() {
  const { toggle } = useAIAssistant();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="focus-ring flex items-center space-x-2 rounded"
          >
            <span className="font-bold">cur8d</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="https://cur8d.dev/typescript"
              className="focus-ring inline-flex items-center gap-1 rounded transition-colors hover:text-foreground/80 text-foreground/60"
              target="_blank"
              rel="noopener noreferrer"
            >
              Docs
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
              <span className="sr-only"> (opens in a new window)</span>
            </Link>
          </nav>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggle}
            className="focus-ring flex items-center gap-1.5 rounded-lg border border-border/80 px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-secondary"
            aria-label="Open AI Assistant"
          >
            <Bot className="size-3.5 text-primary" />
            <span>Ask AI</span>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
