import "server-only";
import { Resend } from "resend";
import type { LeadSource } from "@/lib/types";
import type { ContactPayload } from "@/lib/validation";

// Without a verified Resend domain, mail can only come from onboarding@resend.dev
// and go to the Resend account's own address (CONTACT_TO_EMAIL).
const FROM = "Portfolio <onboarding@resend.dev>";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendLeadEmail(lead: ContactPayload & { source: LeadSource }) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) throw new Error("RESEND_API_KEY or CONTACT_TO_EMAIL is not set");

  const origin = lead.source === "chatbot" ? "the website chatbot" : "the contact form";
  const { error } = await new Resend(apiKey).emails.send({
    from: FROM,
    to,
    replyTo: lead.email,
    subject: `New lead from ${lead.name} (${lead.source})`,
    text: `${lead.name} <${lead.email}> via ${origin}:\n\n${lead.message}`,
    html: `<p><strong>${escapeHtml(lead.name)}</strong> &lt;${escapeHtml(lead.email)}&gt; via ${origin}:</p>
<p style="white-space:pre-wrap">${escapeHtml(lead.message)}</p>`,
  });
  if (error) throw new Error(`Resend failed: ${error.message}`);
}
