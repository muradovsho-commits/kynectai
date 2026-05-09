import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId, unauthorizedResponse, checkRateLimit, getClientIP, getCorsHeaders } from "../_lib/auth";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(req) });
}

export async function POST(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  try {
    // Auth check
    const userId = getAuthUserId(req);
    if (!userId) return unauthorizedResponse(corsHeaders);

    // Rate limit: 10 per minute
    const limitKey = `outreach:${userId || getClientIP(req)}`;
    const limited = checkRateLimit(limitKey, 10, 60_000, corsHeaders);
    if (limited) return limited;

    const body = await req.json();
    const { prompt, messagesSent, plan } = body as { prompt?: string; messagesSent?: number; plan?: string };

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400, headers: corsHeaders });
    }

    // Enforce limits - free: 5 lifetime, pro: 20/week, elite: 30/week
    const count = typeof messagesSent === "number" ? messagesSent : 0;
    const userPlan = plan || "free";
    if (userPlan !== "pro" && userPlan !== "elite" && count >= 5) {
      return NextResponse.json(
        { error: "limit_reached", message: "You've used all 5 free messages. Upgrade to Pro for 20/week." },
        { status: 403, headers: corsHeaders }
      );
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    });

    const first = message.content[0];
    const text = first && first.type === "text" ? first.text : "";

    return NextResponse.json({ text, newCount: count + 1 }, { headers: corsHeaders });
  } catch (error) {
    console.error("generate-outreach error", error);
    return NextResponse.json({ error: "Failed to generate outreach" }, { status: 500, headers: corsHeaders });
  }
}

