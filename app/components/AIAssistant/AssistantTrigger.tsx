"use client";

import { useEffect, useState, createContext, useContext, useCallback, useMemo } from "react";
import { Bot, Sparkles, X } from "lucide-react";
import { Thread } from "@/components/AIAssistant/Thread";

export interface AIAssistantContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggle: () => void;
}

const AIAssistantContext = createContext<AIAssistantContextType | null>(null);

const defaultContextValue: AIAssistantContextType = {
  isOpen: false,
  setIsOpen: () => { },
  toggle: () => { },
};

export function useAIAssistant() {
  const context = useContext(AIAssistantContext);
  return context || defaultContextValue;
}

export interface AIAssistantProviderProps {
  readonly children: React.ReactNode;
}

export function AIAssistantProvider({ children }: Readonly<AIAssistantProviderProps>) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

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

  const contextValue = useMemo(() => ({ isOpen, setIsOpen, toggle }), [isOpen, toggle]);

  return (
    <AIAssistantContext.Provider value={contextValue}>
      {children}
    </AIAssistantContext.Provider>
  );
}

interface AssistantModalHeaderProps {
  readonly onClose: () => void;
}

function AssistantModalHeader({ onClose }: Readonly<AssistantModalHeaderProps>) {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(typeof navigator !== "undefined" && navigator.platform?.toUpperCase().indexOf("MAC") >= 0);
  }, []);

  return (
    <div className="ai-header">
      <div className="ai-header__left">
        <div className="ai-header__icon">
          <Bot className="size-4" />
        </div>
        <div>
          <div className="ai-header__title">
            <span>cur8d Copilot</span>
            <span className="ai-header__badge">
              AI
            </span>
          </div>
          <p className="ai-header__subtitle">Ask anything or run tools</p>
        </div>
      </div>

      <div className="ai-header__right">
        <span className="ai-header__shortcut">
          {isMac ? "⌘J" : "Ctrl+J"}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close AI Assistant"
          className="ai-header__close"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}

export function AssistantTrigger() {
  const context = useContext(AIAssistantContext);
  const [internalOpen, setInternalOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);

  const isOpen = context ? context.isOpen : internalOpen;
  const setIsOpen = context ? context.setIsOpen : setInternalOpen;
  const toggle = context ? context.toggle : () => setInternalOpen((prev) => !prev);

  useEffect(() => {
    setIsMac(typeof navigator !== "undefined" && navigator.platform?.toUpperCase().indexOf("MAC") >= 0);
  }, []);

  useEffect(() => {
    if (context) return; // Managed by provider
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        setInternalOpen((prev) => !prev);
      } else if (e.key === "Escape" && internalOpen) {
        setInternalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [context, internalOpen]);

  return (
    <>
      {/* Floating Action Button Trigger */}
      <div className="ai-trigger">
        <button
          type="button"
          onClick={toggle}
          aria-label="Open AI Assistant"
          aria-expanded={isOpen}
          className="ai-trigger__button"
        >
          <div className="relative">
            <Bot className="ai-trigger__icon" />
            <Sparkles className="ai-trigger__sparkles" />
          </div>
          <span className="ai-trigger__label">Ask AI</span>
          <span className="ai-trigger__shortcut">
            {isMac ? "⌘J" : "Ctrl+J"}
          </span>
        </button>
      </div>

      {/* Slide-over Modal / Drawer Shell */}
      {isOpen && (
        <div className="ai-modal">
          {/* Backdrop */}
          <div
            className="ai-modal__backdrop"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <dialog
            open
            aria-label="AI Assistant Chat"
            aria-modal="true"
            className="ai-modal__dialog"
          >
            <AssistantModalHeader onClose={() => setIsOpen(false)} />
            <div className="ai-modal__body">
              <Thread />
            </div>
          </dialog>
        </div>
      )}
    </>
  );
}
