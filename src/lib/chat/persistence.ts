import "server-only";
import { createServiceClient } from "@/lib/supabase/service";
import type { ChatMessage } from "@/lib/types";

// Transcript storage is best-effort: failures are logged and reported as
// `false`, never thrown, so a database problem can't break the chat itself.

export async function touchConversation(id: string) {
  try {
    const { error } = await createServiceClient()
      .from("chat_conversations")
      .upsert({ id, last_message_at: new Date().toISOString() });
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Failed to save chat conversation:", error);
    return false;
  }
}

export async function saveChatMessage(conversationId: string, role: ChatMessage["role"], content: string) {
  try {
    const { error } = await createServiceClient()
      .from("chat_messages")
      .insert({ conversation_id: conversationId, role, content });
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Failed to save ${role} chat message:`, error);
    return false;
  }
}
