import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId, unauthorizedResponse, checkRateLimit, getClientIP, getCorsHeaders } from "../_lib/auth";
import { checkPlanLimit, incrementUsageInConvex } from "../_lib/plan";

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

    // Rate limit: 10 per minute (burst protection)
    const limitKey = `outreach:${userId || getClientIP(req)}`;
    const limited = checkRateLimit(limitKey, 10, 60_000, corsHeaders);
    if (limited) return limited;

    const body = await req.json();
    const { prompt } = body as { prompt?: string };

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400, headers: corsHeaders });
    }

    // Server-side plan + usage check (Convex is source of truth).
    // For free: lifetime cap (5). For pro/elite: weekly cap (20/30).
    const planCheck = await checkPlanLimit(userId, "outreachWriter", corsHeaders);
    if (!planCheck.allowed) return planCheck.denied!;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    });

    const first = message.content[0];
    const text = first && first.type === "text" ? first.text : "";

    // Increment weekly counter for pro/elite. For free plan, the lifetime
    // outreachCount is incremented separately when the message is saved via
    // users.saveOutreachMessage, so we don't double-count here.
    if (planCheck.plan !== "free") {
      await incrementUsageInConvex(userId, "outreachWriter");
    }

    return NextResponse.json(
      {
        text,
        plan: planCheck.plan,
        used: planCheck.used + 1,
        limit: planCheck.limit,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("generate-outreach error", error);
    return NextResponse.json({ error: "Failed to generate outreach" }, { status: 500, headers: corsHeaders });
  }
}
