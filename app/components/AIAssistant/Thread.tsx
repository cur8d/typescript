"use client";

import { useState } from "react";
import {
  ThreadPrimitive,
  MessagePrimitive,
  ActionBarPrimitive,
  BranchPickerPrimitive,
  AuiIf,
} from "@assistant-ui/react";
import { MarkdownTextPrimitive } from "@assistant-ui/react-markdown";
import { Bot, User, Copy, Check, RotateCcw, ChevronLeft, ChevronRight, Sparkles, BookOpen, Sun, Cpu } from "lucide-react";
import { Composer } from "@/components/AIAssistant/Composer";

export interface CodeBlockProps {
  readonly code: string;
  readonly language?: string;
}

export function CodeBlock({ code, language }: Readonly<CodeBlockProps>) {
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
    <div className="ai-code-block">
      <div className="ai-code-block__header">
        <span className="ai-code-block__lang">{language || "text"}</span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code block"
          className="ai-code-block__copy"
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
      <pre className="ai-code-block__pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function SuggestedPrompts() {
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
    <div className="ai-suggestions">
      <div className="ai-suggestions__icon">
        <Bot className="size-6" />
      </div>
      <h3 className="ai-suggestions__title">How can I assist you today?</h3>
      <p className="ai-suggestions__desc">
        Ask about the template, search docs, toggle themes, or run tools with AI.
      </p>

      <div className="ai-suggestions__grid">
        {prompts.map((p) => {
          const Icon = p.icon;
          return (
            <ThreadPrimitive.Suggestion
              key={p.label}
              prompt={p.prompt}
              send
              asChild
            >
              <button
                type="button"
                className="ai-suggestion-button"
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

export function UserMessage() {
  return (
    <MessagePrimitive.Root className="ai-message ai-message--user">
      <div className="ai-message__wrapper--user">
        <div className="ai-message__avatar--user">
          <User className="size-4" />
        </div>
        <div className="ai-message__bubble--user">
          <MessagePrimitive.Content />
        </div>
      </div>

      <BranchPickerPrimitive.Root className="ai-branch-picker">
        <BranchPickerPrimitive.Previous asChild>
          <button type="button" aria-label="Previous branch" className="ai-branch-picker__button">
            <ChevronLeft className="size-3" />
          </button>
        </BranchPickerPrimitive.Previous>
        <span>
          <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
        </span>
        <BranchPickerPrimitive.Next asChild>
          <button type="button" aria-label="Next branch" className="ai-branch-picker__button">
            <ChevronRight className="size-3" />
          </button>
        </BranchPickerPrimitive.Next>
      </BranchPickerPrimitive.Root>
    </MessagePrimitive.Root>
  );
}

export interface MarkdownCodeProps extends React.ComponentPropsWithoutRef<"code"> {
  readonly inline?: boolean;
}

export function MarkdownCode({ inline, className, children, ...props }: Readonly<MarkdownCodeProps>) {
  const match = /language-(\w+)/.exec(className || "");
  if (!inline && match) {
    let codeString = "";
    if (Array.isArray(children)) {
      codeString = children.join("");
    } else if (typeof children === "string") {
      codeString = children;
    }
    return <CodeBlock code={codeString.replace(/\n$/, "")} language={match[1]} />;
  }
  return (
    <code className="ai-markdown__code" {...props}>
      {children}
    </code>
  );
}

export function MarkdownParagraph({ children }: Readonly<{ readonly children?: React.ReactNode }>) {
  return <p className="ai-markdown__p">{children}</p>;
}

export function MarkdownUnorderedList({ children }: Readonly<{ readonly children?: React.ReactNode }>) {
  return <ul className="ai-markdown__ul">{children}</ul>;
}

export function MarkdownOrderedList({ children }: Readonly<{ readonly children?: React.ReactNode }>) {
  return <ol className="ai-markdown__ol">{children}</ol>;
}

export function MarkdownListItem({ children }: Readonly<{ readonly children?: React.ReactNode }>) {
  return <li className="ai-markdown__li">{children}</li>;
}

export function MarkdownLink({ href, children }: Readonly<{ readonly href?: string; readonly children?: React.ReactNode }>) {
  return (
    <a href={href} className="ai-markdown__a" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export const markdownComponents = {
  code: MarkdownCode,
  p: MarkdownParagraph,
  ul: MarkdownUnorderedList,
  ol: MarkdownOrderedList,
  li: MarkdownListItem,
  a: MarkdownLink,
};

export function AssistantMessageContent() {
  return <MarkdownTextPrimitive components={markdownComponents} />;
}

export const assistantMessageComponents = {
  Text: AssistantMessageContent,
};

export function AssistantMessage() {
  return (
    <MessagePrimitive.Root className="ai-message ai-message--assistant">
      <div className="ai-message__wrapper--assistant">
        <div className="ai-message__avatar--assistant">
          <Bot className="size-4" />
        </div>
        <div className="ai-message__bubble--assistant">
          <MessagePrimitive.Content components={assistantMessageComponents} />

          <ActionBarPrimitive.Root className="ai-action-bar">
            <ActionBarPrimitive.Copy asChild>
              <button
                type="button"
                aria-label="Copy assistant message"
                className="ai-action-bar__button"
              >
                <Copy className="size-3" />
                <span>Copy</span>
              </button>
            </ActionBarPrimitive.Copy>
            <ActionBarPrimitive.Reload asChild>
              <button
                type="button"
                aria-label="Regenerate response"
                className="ai-action-bar__button"
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
    <ThreadPrimitive.Root className="ai-thread">
      <ThreadPrimitive.Viewport className="ai-thread__viewport">
        <AuiIf condition={(s) => s.thread.isEmpty}>
          <SuggestedPrompts />
        </AuiIf>
        <ThreadPrimitive.Messages
          components={{
            UserMessage,
            AssistantMessage,
          }}
        />
      </ThreadPrimitive.Viewport>

      <div className="ai-thread__composer">
        <Composer />
      </div>
    </ThreadPrimitive.Root>
  );
}
