import "server-only";

// Parsing helpers for untrusted FormData in the admin Server Actions.

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const INT_PATTERN = /^-?\d+$/;
const MAX_INT = 2_147_483_647;

export function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function checked(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

export function isUuid(value: string) {
  return UUID_PATTERN.test(value);
}

// Integer in Postgres `integer` range; "" is treated as the fallback.
export function parseInteger(raw: string, fallback = 0): number | null {
  if (raw === "") return fallback;
  if (!INT_PATTERN.test(raw)) return null;
  const value = Number(raw);
  return Math.abs(value) <= MAX_INT ? value : null;
}

// "a, b ,, c" -> ["a", "b", "c"]
export function parseList(raw: string) {
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function isUniqueViolation(error: { code?: string } | null) {
  return error?.code === "23505";
}
