import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://mail.google.com",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt } = body as { prompt?: string };

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400, headers: corsHeaders });
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    });

    const first = message.content[0];
    const text = first && first.type === "text" ? first.text : "";

    return NextResponse.json({ text }, { headers: corsHeaders });
  } catch (error) {
    console.error("generate-outreach error", error);
    return NextResponse.json({ error: "Failed to generate outreach" }, { status: 500, headers: corsHeaders });
  }
}

