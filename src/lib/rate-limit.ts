import "server-only";

// Best-effort, per-instance fixed-window limiter. On serverless each instance
// keeps its own counts; swap for a shared store (e.g. Upstash) if abuse appears.
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}

export function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
