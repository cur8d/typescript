"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { Bot, Sparkles, X } from "lucide-react";
import { Thread } from "./Thread";

interface AIAssistantContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggle: () => void;
}

const AIAssistantContext = createContext<AIAssistantContextType | null>(null);

export function useAIAssistant() {
  const context = useContext(AIAssistantContext);
  if (!context) {
    throw new Error("useAIAssistant must be used within an AIAssistantProvider");
  }
  return context;
}

export function AIAssistantProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <AIAssistantContext.Provider value={{ isOpen, setIsOpen, toggle }}>
      {children}
    </AIAssistantContext.Provider>
  );
}

function AssistantModalHeader({ onClose }: { onClose: () => void }) {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(typeof navigator !== "undefined" && navigator.platform?.toUpperCase().indexOf("MAC") >= 0);
  }, []);

  return (
    <div className="flex h-14 items-center justify-between border-b border-border px-4 bg-background/95 backdrop-blur-xs">
      <div className="flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Bot className="size-4" />
        </div>
        <div>
          <div className="flex items-center gap-1.5 font-semibold text-sm text-foreground">
            <span>cur8d Copilot</span>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.2 text-[10px] font-medium text-primary">
              AI
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">Ask anything or run tools</p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <span className="hidden sm:inline-flex items-center rounded border border-border bg-secondary/50 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
          {isMac ? "⌘J" : "Ctrl+J"}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close AI Assistant"
          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}

export function AssistantTrigger() {
  const { isOpen, setIsOpen, toggle } = useAIAssistant();
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(typeof navigator !== "undefined" && navigator.platform?.toUpperCase().indexOf("MAC") >= 0);
  }, []);

  return (
    <>
      {/* Floating Action Button Trigger */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={toggle}
          aria-label="Open AI Assistant"
          aria-expanded={isOpen}
          className="group relative flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30 focus-ring"
        >
          <div className="relative">
            <Bot className="size-5 transition-transform group-hover:rotate-12" />
            <Sparkles className="absolute -top-1 -right-1 size-2.5 text-amber-300 animate-pulse" />
          </div>
          <span className="text-xs font-semibold tracking-wide">Ask AI</span>
          <span className="hidden sm:inline-flex items-center rounded bg-primary-foreground/15 px-1.5 py-0.5 text-[10px] font-mono">
            {isMac ? "⌘J" : "Ctrl+J"}
          </span>
        </button>
      </div>

      {/* Slide-over Modal / Drawer Shell */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div
            role="dialog"
            aria-label="AI Assistant Chat"
            aria-modal="true"
            className="relative z-10 flex h-full w-full flex-col border-l border-border bg-background shadow-2xl sm:max-w-md md:max-w-lg animate-in slide-in-from-right duration-200"
          >
            <AssistantModalHeader onClose={() => setIsOpen(false)} />
            <div className="flex-1 overflow-hidden">
              <Thread />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
