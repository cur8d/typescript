"use client";

import { useState } from "react";
import {
  ThreadPrimitive,
  MessagePrimitive,
  ActionBarPrimitive,
  BranchPickerPrimitive,
} from "@assistant-ui/react";
import { MarkdownTextPrimitive } from "@assistant-ui/react-markdown";
import { Bot, User, Copy, Check, RotateCcw, ChevronLeft, ChevronRight, Sparkles, BookOpen, Sun, Cpu } from "lucide-react";
import { Composer } from "./Composer";
import { DocSearchTool } from "./tools/DocSearchTool";
import { ThemeTool } from "./tools/ThemeTool";
import { SystemInfoTool } from "./tools/SystemInfoTool";
import { NavigatePageTool } from "./tools/NavigatePageTool";

function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback ignore
    }
  };

  return (
    <div className="relative my-3 overflow-hidden rounded-xl border border-border bg-secondary/50 font-mono text-xs shadow-xs">
      <div className="flex items-center justify-between border-b border-border/60 bg-secondary/70 px-3.5 py-1.5 text-muted-foreground">
        <span className="text-[11px] font-medium lowercase">{language || "text"}</span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code block"
          className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] hover:bg-secondary hover:text-foreground transition-colors"
        >
          {copied ? (
            <>
              <Check className="size-3 text-emerald-500" />
              <span className="text-emerald-500">Copied</span>
            </>
          ) : (
            <>
              <Copy className="size-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 text-foreground font-mono leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function SuggestedPrompts() {
  const prompts = [
    {
      label: "Search documentation",
      prompt: "Search documentation for getting started",
      icon: BookOpen,
    },
    {
      label: "Switch to dark mode",
      prompt: "Switch theme to dark mode",
      icon: Sun,
    },
    {
      label: "Show system info",
      prompt: "What is the cur8d stack and system info?",
      icon: Cpu,
    },
    {
      label: "How to test",
      prompt: "How do I run tests and check 80% coverage?",
      icon: Sparkles,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xs mb-3">
        <Bot className="size-6" />
      </div>
      <h3 className="text-base font-semibold text-foreground">How can I assist you today?</h3>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">
        Ask about the template, search docs, toggle themes, or run tools with AI.
      </p>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
        {prompts.map((p) => {
          const Icon = p.icon;
          return (
            <ThreadPrimitive.Suggestion
              key={p.label}
              prompt={p.prompt}
              method="replace"
              autoSend
              asChild
            >
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl border border-border bg-secondary/30 p-2.5 text-left text-xs font-medium text-foreground transition-all hover:border-primary/40 hover:bg-secondary/60 focus-ring"
              >
                <Icon className="size-4 text-primary shrink-0" />
                <span className="truncate">{p.label}</span>
              </button>
            </ThreadPrimitive.Suggestion>
          );
        })}
      </div>
    </div>
  );
}

function UserMessage() {
  return (
    <MessagePrimitive.Root className="flex flex-col items-end gap-1.5 py-2">
      <div className="flex items-start gap-2 max-w-[85%] flex-row-reverse">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs">
          <User className="size-4" />
        </div>
        <div className="rounded-2xl rounded-tr-sm bg-primary px-3.5 py-2 text-sm text-primary-foreground shadow-xs">
          <MessagePrimitive.Content />
        </div>
      </div>

      <BranchPickerPrimitive.Root className="flex items-center gap-1 text-[11px] text-muted-foreground mr-9">
        <BranchPickerPrimitive.Previous asChild>
          <button type="button" aria-label="Previous branch" className="rounded p-0.5 hover:bg-secondary">
            <ChevronLeft className="size-3" />
          </button>
        </BranchPickerPrimitive.Previous>
        <span>
          <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
        </span>
        <BranchPickerPrimitive.Next asChild>
          <button type="button" aria-label="Next branch" className="rounded p-0.5 hover:bg-secondary">
            <ChevronRight className="size-3" />
          </button>
        </BranchPickerPrimitive.Next>
      </BranchPickerPrimitive.Root>
    </MessagePrimitive.Root>
  );
}

function AssistantMessage() {
  return (
    <MessagePrimitive.Root className="flex flex-col items-start gap-1.5 py-2">
      <div className="flex items-start gap-2 max-w-[90%]">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary border border-border text-primary shadow-xs">
          <Bot className="size-4" />
        </div>
        <div className="flex flex-col gap-2 rounded-2xl rounded-tl-sm border border-border/80 bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-xs">
          <DocSearchTool />
          <ThemeTool />
          <SystemInfoTool />
          <NavigatePageTool />

          <MessagePrimitive.Content
            components={{
              Text: () => (
                <MarkdownTextPrimitive
                  components={{
                    code: ({ inline, className, children, ...props }: any) => {
                      const match = /language-(\w+)/.exec(className || "");
                      if (!inline && match) {
                        return <CodeBlock code={String(children).replace(/\n$/, "")} language={match[1]} />;
                      }
                      return (
                        <code className="rounded bg-secondary/80 px-1 py-0.5 font-mono text-[12px] text-primary" {...props}>
                          {children}
                        </code>
                      );
                    },
                    p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="mb-2 list-disc pl-5 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="mb-2 list-decimal pl-5 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                    a: ({ href, children }) => (
                      <a href={href} className="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    ),
                  }}
                />
              ),
            }}
          />

          <ActionBarPrimitive.Root className="flex items-center gap-1 text-muted-foreground pt-1">
            <ActionBarPrimitive.Copy asChild>
              <button
                type="button"
                aria-label="Copy assistant message"
                className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] hover:bg-secondary hover:text-foreground transition-colors"
              >
                <Copy className="size-3" />
                <span>Copy</span>
              </button>
            </ActionBarPrimitive.Copy>
            <ActionBarPrimitive.Reload asChild>
              <button
                type="button"
                aria-label="Regenerate response"
                className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] hover:bg-secondary hover:text-foreground transition-colors"
              >
                <RotateCcw className="size-3" />
                <span>Regenerate</span>
              </button>
            </ActionBarPrimitive.Reload>
          </ActionBarPrimitive.Root>
        </div>
      </div>
    </MessagePrimitive.Root>
  );
}

export function Thread() {
  return (
    <ThreadPrimitive.Root className="flex h-full w-full flex-col overflow-hidden bg-background">
      <ThreadPrimitive.Viewport className="flex-1 overflow-y-auto px-4 py-3">
        <ThreadPrimitive.Empty>
          <SuggestedPrompts />
        </ThreadPrimitive.Empty>
        <ThreadPrimitive.Messages
          components={{
            UserMessage,
            AssistantMessage,
          }}
        />
      </ThreadPrimitive.Viewport>

      <div className="p-4 border-t border-border bg-background/95 backdrop-blur-xs">
        <Composer />
      </div>
    </ThreadPrimitive.Root>
  );
}
