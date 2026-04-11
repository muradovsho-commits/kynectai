import { NextRequest, NextResponse } from "next/server";

// ═══ AUTH ═══
// Verify the user has a valid offerbell_user_id cookie
export function getAuthUserId(req: NextRequest): string | null {
  // Check cookie first (set during signin)
  const cookie = req.cookies.get("offerbell_user_id")?.value;
  if (cookie && cookie.length > 5) return cookie;

  // Check Authorization header as fallback (for programmatic calls)
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    if (token.length > 5) return token;
  }

  return null;
}

export function unauthorizedResponse(corsHeaders: Record<string, string>) {
  return NextResponse.json(
    { error: "Authentication required. Please sign in." },
    { status: 401, headers: corsHeaders }
  );
}

// ═══ RATE LIMITING ═══
// In-memory rate limiter (resets on deploy/restart, which is fine for Vercel serverless)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

// Clean up expired entries periodically
function cleanupStore() {
  const now = Date.now();
  for (const [key, val] of rateLimitStore) {
    if (now > val.resetAt) rateLimitStore.delete(key);
  }
}

// Check rate limit - returns null if OK, or a Response if limited
export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
  corsHeaders: Record<string, string>
): NextResponse | null {
  // Cleanup every 100 checks
  if (rateLimitStore.size > 500) cleanupStore();

  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  if (entry.count >= maxRequests) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please wait before trying again." },
      {
        status: 429,
        headers: {
          ...corsHeaders,
          "Retry-After": String(Math.ceil((entry.resetAt - now) / 1000)),
        },
      }
    );
  }

  entry.count++;
  return null;
}

// Get client IP for rate limiting
export function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

// ═══ CORS ═══
const ALLOWED_ORIGINS = [
  "https://www.offerbell.org",
  "https://offerbell.org",
  "https://kynectai.vercel.app",
];

export function getCorsHeaders(req: NextRequest): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const isAllowed =
    ALLOWED_ORIGINS.some((o) => origin.startsWith(o)) ||
    origin.includes("localhost") ||
    origin.includes("vercel.app") ||
    origin.startsWith("chrome-extension://");

  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
}
