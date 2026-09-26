import type { ContactErrors, ContactPayload } from "@/lib/validation";

// Thrown when /api/contact rejects a submission. `fieldErrors` holds the
// server's per-field validation messages; `rateLimited` marks a 429.
export class ContactSubmitError extends Error {
  constructor(
    message: string,
    readonly fieldErrors: ContactErrors = {},
    readonly rateLimited = false,
  ) {
    super(message);
    this.name = "ContactSubmitError";
  }
}

// `company` is the honeypot field; real visitors always send it empty.
export async function submitContact(payload: ContactPayload & { company?: string }) {
  let response: Response;
  try {
    response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new ContactSubmitError("Network error — your message wasn't sent.");
  }

  const data = (await response.json().catch(() => null)) as {
    ok?: boolean;
    error?: string;
    errors?: ContactErrors;
  } | null;

  if (response.ok && data?.ok) return;
  throw new ContactSubmitError(
    data?.error ?? `Contact request failed: ${response.status}`,
    data?.errors,
    response.status === 429,
  );
}
