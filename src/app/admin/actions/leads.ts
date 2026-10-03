"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/types";
import { isUuid, text } from "./form-utils";
import type { FormState } from "./state";

export async function updateLeadStatus(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();

  const id = text(formData, "id");
  const status = text(formData, "status") as LeadStatus;
  if (!isUuid(id)) return { status: "error", message: "Unknown lead." };
  if (!LEAD_STATUSES.includes(status)) return { status: "error", message: "Unknown status." };

  const { data, error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (error) return { status: "error", message: `Could not update: ${error.message}` };
  if (!data) return { status: "error", message: "This lead no longer exists." };

  // Leads are admin-only, so only the dashboard (inbox, overview, chats) is affected.
  revalidatePath("/admin", "layout");
  return { status: "success", message: "Updated." };
}

export async function deleteLead(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();

  const id = text(formData, "id");
  if (!isUuid(id)) return { status: "error", message: "Unknown lead." };

  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) return { status: "error", message: `Could not delete: ${error.message}` };

  revalidatePath("/admin", "layout");
  return { status: "success", message: "Lead deleted." };
}
