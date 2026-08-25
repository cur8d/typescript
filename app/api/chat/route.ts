import { streamText, convertToModelMessages, createUIMessageStreamResponse, toUIMessageStream, type UIMessage } from "ai";
import { getModel } from "@/lib/ai/config";
import { SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { aiTools } from "@/lib/ai/tools";
import { reportError } from "@/lib/error-reporting";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, model: modelOverride, provider: providerOverride } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Missing or invalid 'messages' array" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const normalizedMessages: UIMessage[] = messages.map((m: unknown) => {
      if (typeof m === "object" && m !== null) {
        const msg = m as Record<string, unknown>;
        if (msg.parts && Array.isArray(msg.parts)) {
          return msg as unknown as UIMessage;
        }
        if (typeof msg.content === "string") {
          return {
            id: typeof msg.id === "string" ? msg.id : `msg_${Date.now()}`,
            role: (msg.role as "user" | "assistant" | "system") || "user",
            parts: [{ type: "text", text: msg.content }],
          } as unknown as UIMessage;
        }
      }
      return m as UIMessage;
    });

    const model = getModel({
      provider: providerOverride,
      model: modelOverride,
    });

    const modelMessages = await convertToModelMessages(normalizedMessages);

    const result = streamText({
      model,
      system: SYSTEM_PROMPT,
      messages: modelMessages,
      tools: aiTools,
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({ stream: result.stream }),
    });
  } catch (error) {
    reportError(error, { route: "/api/chat" });
    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
