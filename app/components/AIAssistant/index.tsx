"use client";

import { useChatRuntime, AssistantChatTransport } from "@assistant-ui/react-ai-sdk";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { AIAssistantProvider, AssistantTrigger, useAIAssistant } from "./AssistantTrigger";

export interface AIAssistantProps {
  api?: string;
}

export function AIAssistant({ api = "/api/chat" }: AIAssistantProps) {
  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({ api }),
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <AIAssistantProvider>
        <AssistantTrigger />
      </AIAssistantProvider>
    </AssistantRuntimeProvider>
  );
}

export { useAIAssistant };
export { AssistantTrigger } from "./AssistantTrigger";
export { Thread } from "./Thread";
export { Composer } from "./Composer";
