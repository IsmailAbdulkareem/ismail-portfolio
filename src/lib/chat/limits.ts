// Shared by /api/chat and the chat widget.

export const CHAT_LIMITS = {
  /** Most recent messages sent to the model per request. */
  history: 20,
  /** Max characters per text part (and per visitor message). */
  text: 2000,
} as const;

export const CHAT_BUSY_MESSAGE =
  "The assistant is busy right now — please try again or use the contact form.";

export const CHAT_RATE_LIMIT_MESSAGE =
  "You're sending messages quickly — please wait a few minutes and try again.";
