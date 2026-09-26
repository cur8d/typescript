"use client";

import { ComposerPrimitive } from "@assistant-ui/react";
import { Send, Square, Mic, MicOff } from "lucide-react";
import { useSpeechToText } from "@/hooks/use-speech-to-text";

export function Composer() {
  const { isListening, toggleListening, isSupported } = useSpeechToText();

  return (
    <ComposerPrimitive.Root className="ai-composer">
      <div className="ai-composer__row">
        <ComposerPrimitive.Input
          placeholder="Ask cur8d assistant (e.g. 'search docs', 'switch to dark mode')..."
          rows={1}
          autoFocus
          className="ai-composer__input"
        />

        <div className="ai-composer__actions">
          {isSupported && (
            <button
              type="button"
              onClick={toggleListening}
              aria-label={isListening ? "Stop listening" : "Start voice input"}
              className={`ai-composer__mic ${isListening ? "ai-composer__mic--active" : ""}`}
            >
              {isListening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
            </button>
          )}

          <ComposerPrimitive.Cancel asChild>
            <button
              type="button"
              aria-label="Cancel generation"
              className="ai-composer__cancel"
            >
              <Square className="size-4 fill-current" />
            </button>
          </ComposerPrimitive.Cancel>

          <ComposerPrimitive.Send asChild>
            <button
              type="submit"
              aria-label="Send message"
              className="ai-composer__send"
            >
              <Send className="size-4" />
            </button>
          </ComposerPrimitive.Send>
        </div>
      </div>

      <div className="ai-composer__footer">
        <span>
          <kbd className="ai-composer__kbd">Enter</kbd> to send,{" "}
          <kbd className="ai-composer__kbd">Shift+Enter</kbd> for newline
        </span>
        {isListening && (
          <span className="ai-composer__listening">
            <span className="ai-composer__listening-dot" />
            <span>Listening...</span>
          </span>
        )}
      </div>
    </ComposerPrimitive.Root>
  );
}
