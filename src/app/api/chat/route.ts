import { groq } from "@ai-sdk/groq";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
  tool,
  type UIMessage,
} from "ai";
import { after } from "next/server";
import { z } from "zod";
import { CHAT_BUSY_MESSAGE, CHAT_LIMITS, CHAT_RATE_LIMIT_MESSAGE } from "@/lib/chat/limits";
import { saveChatMessage, touchConversation } from "@/lib/chat/persistence";
import { getSystemPrompt } from "@/lib/chat/system-prompt";
import { createLead } from "@/lib/leads";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { validateContact } from "@/lib/validation";

// Groq retires models over time; override with GROQ_MODEL without a code change.
const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 5 * 60 * 1000;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const badRequest = (error: string) => Response.json({ error }, { status: 400 });

// Rebuilds the untrusted client history as plain user/assistant text: drops
// system messages and tool parts (which a client could forge), keeps the last
// few messages and truncates long text.
function sanitizeMessages(input: unknown): UIMessage[] {
  if (!Array.isArray(input)) return [];
  return input.slice(-CHAT_LIMITS.history).flatMap((raw): UIMessage[] => {
    if (!raw || typeof raw !== "object") return [];
    const { id, role, parts } = raw as Record<string, unknown>;
    if ((role !== "user" && role !== "assistant") || !Array.isArray(parts)) return [];
    const textParts = parts.flatMap((part) => {
      const { type, text } = (part ?? {}) as Record<string, unknown>;
      if (type !== "text" || typeof text !== "string" || !text.trim()) return [];
      return [{ type: "text" as const, text: text.slice(0, CHAT_LIMITS.text) }];
    });
    if (textParts.length === 0) return [];
    return [{ id: typeof id === "string" ? id : "", role, parts: textParts }];
  });
}

const textOf = (message: UIMessage) =>
  message.parts
    .flatMap((part) => (part.type === "text" ? [part.text] : []))
    .join("\n\n")
    .trim();

export async function POST(request: Request) {
  if (!rateLimit(`chat:${clientIp(request)}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return Response.json({ error: CHAT_RATE_LIMIT_MESSAGE }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid request body.");
  }

  const { conversationId, trigger, messages: rawMessages } = (body ?? {}) as Record<string, unknown>;
  if (typeof conversationId !== "string" || !UUID_PATTERN.test(conversationId)) {
    return badRequest("Invalid conversation id.");
  }
  const messages = sanitizeMessages(rawMessages);
  const latest = messages.at(-1);
  if (!latest || latest.role !== "user") return badRequest("No message to answer.");

  // Persistence runs alongside the model call. The conversation row must exist
  // before any message or lead references it, so everything chains off it.
  const conversationReady = touchConversation(conversationId);
  const userSaved =
    trigger === "regenerate-message"
      ? conversationReady // the user message was stored on the first attempt
      : conversationReady.then((ok) => ok && saveChatMessage(conversationId, "user", textOf(latest)));
  after(userSaved);

  const saveLead = tool({
    description:
      "Save a visitor's contact details and project description so Ismail can reply by email. " +
      "Only call this after the visitor has explicitly provided their name, email and project details.",
    inputSchema: z.object({
      name: z.string().describe("The visitor's name, exactly as they gave it."),
      email: z.string().describe("The visitor's email address, exactly as they gave it."),
      details: z.string().describe("A short description of the project, in the visitor's words."),
    }),
    execute: async ({ name, email, details }) => {
      const lead = { name: name.trim(), email: email.trim(), message: details.trim() };
      const errors = validateContact(lead);
      if (Object.keys(errors).length > 0) return { ok: false, errors };
      try {
        const linked = await conversationReady;
        await createLead({ ...lead, source: "chatbot", conversationId: linked ? conversationId : undefined });
        return { ok: true };
      } catch (error) {
        console.error("Chatbot lead save failed:", error);
        return { ok: false, error: "Saving failed. Ask the visitor to use the form at /contact instead." };
      }
    },
  });

  const [instructions, modelMessages] = await Promise.all([
    getSystemPrompt(),
    convertToModelMessages(messages),
  ]);

  const result = streamText({
    model: groq(MODEL),
    instructions,
    messages: modelMessages,
    tools: { save_lead: saveLead },
    // One tool call plus a follow-up reply, with a step to spare.
    stopWhen: isStepCount(3),
    abortSignal: request.signal,
    onError: ({ error }) => console.error("Chat model error:", error),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      // Sent to the widget as the error text; never leak provider details.
      onError: () => CHAT_BUSY_MESSAGE,
      onEnd: async ({ responseMessage }) => {
        const text = textOf(responseMessage);
        const [linked] = await Promise.all([conversationReady, userSaved]);
        if (text && linked) await saveChatMessage(conversationId, "assistant", text);
      },
    }),
  });
}
