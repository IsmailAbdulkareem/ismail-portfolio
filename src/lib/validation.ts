// Shared by the contact form (client), /api/contact and the chatbot's lead tool.

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

export type ContactField = keyof ContactPayload;
export type ContactErrors = Partial<Record<ContactField, string>>;

export const CONTACT_LIMITS = { name: 100, email: 200, message: 5000 } as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(values: ContactPayload): ContactErrors {
  const errors: ContactErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();

  if (!name) errors.name = "Please enter your name.";
  else if (name.length > CONTACT_LIMITS.name) errors.name = "Name is too long.";

  if (!EMAIL_PATTERN.test(email) || email.length > CONTACT_LIMITS.email) {
    errors.email = "Please enter a valid email address.";
  }

  if (!message) errors.message = "Please tell me a little about your project.";
  else if (message.length > CONTACT_LIMITS.message) errors.message = "Message is too long.";

  return errors;
}

// Parses untrusted JSON into a trimmed payload, or null if the shape is wrong.
export function parseContactPayload(input: unknown): ContactPayload | null {
  if (!input || typeof input !== "object") return null;
  const { name, email, message } = input as Record<string, unknown>;
  if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") return null;
  return { name: name.trim(), email: email.trim(), message: message.trim() };
}
