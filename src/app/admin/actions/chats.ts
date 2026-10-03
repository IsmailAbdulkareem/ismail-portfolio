"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { isUuid, text } from "./form-utils";
import type { FormState } from "./state";

export async function deleteConversation(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();

  const id = text(formData, "id");
  if (!isUuid(id)) return { status: "error", message: "Unknown conversation." };

  // chat_messages are removed by ON DELETE CASCADE on the foreign key.
  const { error } = await supabase.from("chat_conversations").delete().eq("id", id);
  if (error) return { status: "error", message: `Could not delete: ${error.message}` };

  revalidatePath("/admin", "layout");
  return { status: "success", message: "Conversation deleted." };
}
