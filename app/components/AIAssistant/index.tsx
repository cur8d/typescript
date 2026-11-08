"use client";

import { useChatRuntime, AssistantChatTransport } from "@assistant-ui/react-ai-sdk";
import { AssistantRuntimeProvider, AuiConfig, Tools } from "@assistant-ui/react";
import { AssistantTrigger } from "@/components/AIAssistant/AssistantTrigger";
import { assistantToolkit } from "@/components/AIAssistant/toolkit";

export interface AIAssistantProps {
  readonly api?: string;
}

export function AIAssistant({ api = "/api/chat" }: Readonly<AIAssistantProps>) {
  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({ api }),
  });

  const config = AuiConfig({
    tools: Tools({ toolkit: assistantToolkit }),
  });

  return (
    <AssistantRuntimeProvider runtime={runtime} config={config}>
      <AssistantTrigger />
    </AssistantRuntimeProvider>
  );
}

export { useAIAssistant, AIAssistantProvider, AssistantTrigger } from "@/components/AIAssistant/AssistantTrigger";
export { Thread } from "@/components/AIAssistant/Thread";
export { Composer } from "@/components/AIAssistant/Composer";
export { assistantToolkit } from "@/components/AIAssistant/toolkit";
