import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { getAuthUserId, unauthorizedResponse, getCorsHeaders } from "../_lib/auth";
import { api } from "../../../convex/_generated/api";

// Check outreach quota. Server queries Convex for plan + usage and
// returns the truth. Frontend uses this to render badges and disable
// the send button - but generate-outreach also re-checks before doing
// the actual Anthropic call, so even a tampered client cannot bypass.

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(req) });
}

export async function POST(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  try {
    const userId = getAuthUserId(req);
    if (!userId) return unauthorizedResponse(corsHeaders);

    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      return NextResponse.json({ error: "Convex not configured" }, { status: 500, headers: corsHeaders });
    }
    const convex = new ConvexHttpClient(convexUrl);

    const u: any = await convex.query((api as any).users.getUser, { userId });
    const plan: "free" | "pro" | "elite" =
      u?.found && (u.plan === "elite" || u.plan === "pro") ? u.plan : "free";

    // free: lifetime cap of 5 (tracked via users.outreachCount/messagesUsed)
    // pro: 20/week; elite: 30/week (tracked via weeklyUsage table)
    const LIMITS = { free: 5, pro: 20, elite: 30 };
    const limit = LIMITS[plan];

    let used = 0;
    let isLifetime = false;
    if (plan === "free") {
      used = u?.messagesUsed ?? 0;
      isLifetime = true;
    } else {
      const usage: any = await convex.query((api as any).usage.getUsage, { userId });
      used = usage?.outreachWriter ?? 0;
    }

    const allowed = used < limit;
    const remaining = Math.max(0, limit - used);

    return NextResponse.json(
      {
        allowed,
        plan,
        used,
        limit,
        remaining,
        isLifetime,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("check-outreach-limit error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400, headers: corsHeaders });
  }
}
