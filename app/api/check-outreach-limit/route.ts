import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId, unauthorizedResponse, getCorsHeaders } from "../_lib/auth";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(req) });
}

export async function POST(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  try {
    const userId = getAuthUserId(req);
    if (!userId) return unauthorizedResponse(corsHeaders);

    const body = await req.json();
    const { messagesSent, plan } = body as { messagesSent?: number; plan?: string };

    const count = typeof messagesSent === "number" ? messagesSent : 0;
    const userPlan = plan || "free";
    const limit = 3;
    const allowed = userPlan === "pro" || count < limit;

    return NextResponse.json(
      {
        allowed,
        messagesSent: count,
        plan: userPlan,
        limit,
        remaining: userPlan === "pro" ? "unlimited" : Math.max(0, limit - count),
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400, headers: corsHeaders });
  }
}
