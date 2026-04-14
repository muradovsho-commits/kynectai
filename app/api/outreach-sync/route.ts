import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId, getCorsHeaders } from "../_lib/auth";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(req) });
}

export async function POST(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  try {
    // Accept auth from cookie or Bearer token (extension uses Bearer)
    const userId = getAuthUserId(req);

    const body = await req.json();
    const { action, messagesSent, plan } = body as {
      action?: string;
      messagesSent?: number;
      plan?: string;
    };

    if (action === "get") {
      // Return whatever the client reports - both website and extension
      // use this to confirm the count. The real source of truth is Convex
      // (outreachCount on the user doc), which gets set by incrementOutreachCount.
      return NextResponse.json(
        { messagesSent: messagesSent || 0, plan: plan || "free", userId: userId || null },
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
