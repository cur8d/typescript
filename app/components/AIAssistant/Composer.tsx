"use client";

import { ComposerPrimitive } from "@assistant-ui/react";
import { Send, Square, Mic, MicOff } from "lucide-react";
import { useSpeechToText } from "@/hooks/use-speech-to-text";

export function Composer() {
  const { isListening, toggleListening, isSupported } = useSpeechToText();

  return (
    <ComposerPrimitive.Root className="relative flex w-full flex-col rounded-2xl border border-border bg-secondary/30 p-2.5 shadow-xs transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
      <div className="flex w-full items-end gap-2">
        <ComposerPrimitive.Input
          placeholder="Ask cur8d assistant (e.g. 'search docs', 'switch to dark mode')..."
          rows={1}
          autoFocus
          className="max-h-32 min-h-[40px] flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />

        <div className="flex items-center gap-1 shrink-0 pb-0.5">
          {isSupported && (
            <button
              type="button"
              onClick={toggleListening}
              aria-label={isListening ? "Stop listening" : "Start voice input"}
              className={`rounded-lg p-2 transition-colors ${
                isListening
                  ? "bg-danger text-danger-foreground animate-pulse"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {isListening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
            </button>
          )}

          <ComposerPrimitive.Cancel asChild>
            <button
              type="button"
              aria-label="Cancel generation"
              className="rounded-lg bg-secondary p-2 text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-foreground"
            >
              <Square className="size-4 fill-current" />
            </button>
          </ComposerPrimitive.Cancel>

          <ComposerPrimitive.Send asChild>
            <button
              type="submit"
              aria-label="Send message"
              className="rounded-lg bg-primary p-2 text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="size-4" />
            </button>
          </ComposerPrimitive.Send>
        </div>
      </div>

      <div className="mt-1.5 flex items-center justify-between px-2 text-[11px] text-muted-foreground">
        <span>
          <kbd className="rounded border border-border bg-secondary/60 px-1 py-0.5 font-mono text-[10px]">Enter</kbd> to send,{" "}
          <kbd className="rounded border border-border bg-secondary/60 px-1 py-0.5 font-mono text-[10px]">Shift+Enter</kbd> for newline
        </span>
        {isListening && (
          <span className="flex items-center gap-1 font-medium text-danger">
            <span className="size-1.5 rounded-full bg-danger animate-ping" />
            Listening...
          </span>
        )}
      </div>
    </ComposerPrimitive.Root>
  );
}
