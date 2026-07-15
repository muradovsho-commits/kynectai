import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import { getAuthUserId, unauthorizedResponse, checkRateLimit, getClientIP, getCorsHeaders } from "../_lib/auth";
import { CONTACT_PRIVATE } from "../_lib/contact-private";

// ═══════════════════════════════════════════════════════════════
// CONTACT DATABASE - UNLOCK
// ═══════════════════════════════════════════════════════════════
// The only path to a contact's email or LinkedIn. The rows live in
// _lib/contact-private.ts, which is imported here and nowhere else, so the
// browser never receives an address it has not paid for.
//
// Two actions:
//   status  -> meter state + the details of everything already unlocked
//   unlock  -> spend a credit on one contact, then release that contact
//
// Limits are enforced inside convex/contactUnlocks.ts, not here. This route
// never decides whether a user may proceed; it asks Convex and obeys.

export const runtime = "nodejs";

function getConvex() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) throw new Error("NEXT_PUBLIC_CONVEX_URL not configured");
  return new ConvexHttpClient(url);
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(req) });
}

export async function POST(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  try {
    const userId = getAuthUserId(req);
    if (!userId) return unauthorizedResponse(corsHeaders);

    // Burst protection. Generous enough for normal browsing, tight enough that
    // nobody walks the whole table from a script.
    const ip = getClientIP(req);
    const limited = checkRateLimit(`contact-unlock:${userId || ip}`, 40, 60_000, corsHeaders);
    if (limited) return limited;

    const body = await req.json().catch(() => ({}));
    const action = (body as any)?.action === "unlock" ? "unlock" : "status";
    const convex = getConvex();

    if (action === "status") {
      const st: any = await convex.query((api as any).contactUnlocks.getStatus, { userId });
      const details: Record<string, { linkedin: string; email: string }> = {};
      for (const id of st.unlockedIds || []) {
        const row = CONTACT_PRIVATE[id];
        if (row) details[id] = row;
      }
      return NextResponse.json(
        { plan: st.plan, used: st.used, limit: st.limit, lifetime: st.lifetime, details },
        { headers: corsHeaders }
      );
    }

    const contactId = String((body as any)?.contactId || "");
    if (!contactId || !CONTACT_PRIVATE[contactId]) {
      return NextResponse.json({ error: "unknown_contact" }, { status: 400, headers: corsHeaders });
    }

    const res: any = await convex.mutation((api as any).contactUnlocks.unlock, { userId, contactId });

    if (!res?.allowed) {
      const nextTier = res?.plan === "free" ? "Pro" : res?.plan === "pro" ? "Elite" : null;
      const message = res?.plan === "free"
        ? `You've used all ${res?.limit} of your free unlocks. Upgrade to Pro for 50 a week.`
        : nextTier
          ? `You've hit your ${res?.plan} limit of ${res?.limit} unlocks this week. Upgrade to ${nextTier} for 200 a week.`
          : `You've hit your Elite limit of ${res?.limit} unlocks this week. Resets Monday.`;
      return NextResponse.json(
        { error: "limit_reached", message, plan: res?.plan, used: res?.used, limit: res?.limit, lifetime: res?.lifetime },
        { status: 429, headers: corsHeaders }
      );
    }

    // Allowed: release this one contact, and this one only.
    return NextResponse.json(
      {
        contactId,
        detail: CONTACT_PRIVATE[contactId],
        already: !!res.already,
        plan: res.plan,
        used: res.used,
        limit: res.limit,
        lifetime: res.lifetime,
      },
      { headers: corsHeaders }
    );
  } catch (err) {
    console.error("contact-unlock failed:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500, headers: corsHeaders });
  }
}
