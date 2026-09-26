import "server-only";
import { sendLeadEmail } from "@/lib/email";
import { createServiceClient } from "@/lib/supabase/service";
import type { LeadSource } from "@/lib/types";
import type { ContactPayload } from "@/lib/validation";

type NewLead = ContactPayload & { source: LeadSource; conversationId?: string };

// Saves a validated lead, then notifies by email. The lead counts as received
// once it is stored; an email failure is logged rather than surfaced.
export async function createLead({ conversationId, ...lead }: NewLead) {
  const { error } = await createServiceClient()
    .from("leads")
    .insert({ ...lead, conversation_id: conversationId ?? null });
  if (error) throw new Error(`Failed to save lead: ${error.message}`);

  try {
    await sendLeadEmail(lead);
  } catch (emailError) {
    console.error("Lead saved but notification email failed:", emailError);
  }
}
