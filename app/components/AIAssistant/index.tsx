"use client";

import { useChatRuntime, AssistantChatTransport } from "@assistant-ui/react-ai-sdk";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { AssistantTrigger } from "./AssistantTrigger";

export interface AIAssistantProps {
  api?: string;
}

export function AIAssistant({ api = "/api/chat" }: AIAssistantProps) {
  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({ api }),
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <AssistantTrigger />
    </AssistantRuntimeProvider>
  );
}

export { useAIAssistant, AIAssistantProvider, AssistantTrigger } from "./AssistantTrigger";
export { Thread } from "./Thread";
export { Composer } from "./Composer";
