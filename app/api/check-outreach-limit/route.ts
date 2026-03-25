import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messagesSent, plan } = body as { messagesSent?: number; plan?: string };

    const count = typeof messagesSent === "number" ? messagesSent : 0;
    const userPlan = plan || "free";
    const limit = 5;
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
