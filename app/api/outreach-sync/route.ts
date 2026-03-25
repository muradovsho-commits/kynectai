import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// Simple sync endpoint: extension sends its count + userId,
// server returns the canonical count (highest of extension vs server).
// In production this would hit Convex/DB. For now it works with the
// client-side count passed in, keeping extension and web app in sync
// by always using the higher number.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, userId, messagesSent, plan } = body as {
      action?: string;
      userId?: string;
      messagesSent?: number;
      plan?: string;
    };

    if (action === "get") {
      // Extension is asking for current count
      // In a full implementation, query Convex here
      return NextResponse.json(
        { messagesSent: messagesSent || 0, plan: plan || "free" },
        { headers: corsHeaders }
      );
    }

    if (action === "increment") {
      const current = typeof messagesSent === "number" ? messagesSent : 0;
      const newCount = current + 1;
      return NextResponse.json(
        { messagesSent: newCount, plan: plan || "free" },
        { headers: corsHeaders }
      );
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400, headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400, headers: corsHeaders });
  }
}
