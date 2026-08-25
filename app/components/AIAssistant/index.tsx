"use client";

import { useChatRuntime, AssistantChatTransport } from "@assistant-ui/react-ai-sdk";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { AssistantTrigger } from "@/components/AIAssistant/AssistantTrigger";

export interface AIAssistantProps {
  readonly api?: string;
}

export function AIAssistant({ api = "/api/chat" }: Readonly<AIAssistantProps>) {
  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({ api }),
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <AssistantTrigger />
    </AssistantRuntimeProvider>
  );
}

export { useAIAssistant, AIAssistantProvider, AssistantTrigger } from "@/components/AIAssistant/AssistantTrigger";
export { Thread } from "@/components/AIAssistant/Thread";
export { Composer } from "@/components/AIAssistant/Composer";
