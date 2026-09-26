import { createLead } from "@/lib/leads";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { parseContactPayload, validateContact } from "@/lib/validation";

const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill the "company" field. Pretend
  // success so bots get no signal, but store nothing.
  const honeypot = (body as Record<string, unknown> | null)?.company;
  if (typeof honeypot === "string" && honeypot.trim()) {
    return Response.json({ ok: true });
  }

  const payload = parseContactPayload(body);
  if (!payload) return Response.json({ error: "Invalid request body." }, { status: 400 });

  const errors = validateContact(payload);
  if (Object.keys(errors).length > 0) return Response.json({ errors }, { status: 400 });

  if (!rateLimit(`contact:${clientIp(request)}`, LIMIT, WINDOW_MS)) {
    return Response.json(
      { error: "Too many messages. Please wait a few minutes and try again." },
      { status: 429 },
    );
  }

  try {
    await createLead({ ...payload, source: "contact" });
  } catch (error) {
    console.error("Contact form submission failed:", error);
    return Response.json({ error: "Your message couldn't be saved." }, { status: 500 });
  }

  return Response.json({ ok: true });
}
