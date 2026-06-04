import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId, unauthorizedResponse, checkRateLimit, getClientIP, getCorsHeaders } from "../_lib/auth";
import { checkPlanLimit, incrementUsageInConvex } from "../_lib/plan";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(req) });
}

type ChatTurn = { role: "user" | "model"; content: string };

export async function POST(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  try {
    const userId = getAuthUserId(req);
    if (!userId) return unauthorizedResponse(corsHeaders);

    // Burst protection: 10 chat messages per minute per user.
    const ip = getClientIP(req);
    const limited = checkRateLimit(`resumechat:${userId || ip}`, 10, 60_000, corsHeaders);
    if (limited) return limited;

    // Weekly plan gate (free 5, pro 30, elite 100). Source of truth is Convex.
    const planCheck = await checkPlanLimit(userId, "resumeChat", corsHeaders);
    if (!planCheck.allowed) return planCheck.denied!;

    const body = await req.json();
    const { resumeText, targetTrack, reviewSummary, history, question } = body as {
      resumeText: string;
      targetTrack: string;
      reviewSummary: string;
      history: ChatTurn[];
      question: string;
    };

    if (!question || question.trim().length < 1) {
      return NextResponse.json({ error: "Empty question" }, { status: 400, headers: corsHeaders });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500, headers: corsHeaders });
    }

    const track = targetTrack || "finance";
    const systemPrompt = `You are a senior resume reviewer and recruiting coach for ${track} recruiting, continuing a conversation with a candidate about THEIR resume. You already gave them written feedback; now they are asking follow-up questions.

CONTEXT - THE CANDIDATE'S RESUME:
${(resumeText || "").slice(0, 12000)}

CONTEXT - THE FEEDBACK YOU ALREADY GAVE:
${(reviewSummary || "(no prior summary provided)").slice(0, 6000)}

RULES:
- Answer their questions directly and specifically, grounded in their actual resume and the feedback above.
- Reference specific bullets, sections, or experiences when relevant.
- When they ask you to rewrite or improve something, give them concrete rewritten text, not vague advice.
- Judge everything against ${track} recruiting standards.
- Be concise and conversational. Plain text only, no markdown headers, no JSON, no code fences.
- If they ask something unrelated to their resume or ${track} recruiting, gently steer back.`;

    const contents: { role: "user" | "model"; parts: { text: string }[] }[] = [];
    const safeHistory = Array.isArray(history) ? history.slice(-12) : [];
    for (const turn of safeHistory) {
      if (!turn || (turn.role !== "user" && turn.role !== "model")) continue;
      contents.push({ role: turn.role, parts: [{ text: String(turn.content || "").slice(0, 4000) }] });
    }
    contents.push({ role: "user", parts: [{ text: question.slice(0, 4000) }] });

    const dateNote = `\n\nIMPORTANT - CURRENT DATE: Today is ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} (current year ${new Date().getFullYear()}). Treat this as the real-world present and never assume an earlier year from training data.`;

    const models = ["gemini-3-flash-preview", "gemini-2.5-flash", "gemini-2.5-flash-lite"];

    for (const model of models) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      try {
        const generationConfig: any = { temperature: 0.6, topP: 0.9, maxOutputTokens: 2048 };
        if (model.startsWith("gemini-2.5")) {
          generationConfig.thinkingConfig = { thinkingBudget: 0 };
        }
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents,
            systemInstruction: { parts: [{ text: systemPrompt + dateNote }] },
            generationConfig,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const text = (data.candidates?.[0]?.content?.parts?.[0]?.text || "").trim();
          if (text) {
            await incrementUsageInConvex(userId, "resumeChat");
            return NextResponse.json({ answer: text, model }, { headers: corsHeaders });
          }
          continue;
        } else {
          const errBody = await res.text().catch(() => "");
          console.error(`resume-chat model ${model} failed: ${res.status} ${errBody.slice(0, 200)}`);
        }
      } catch {
        continue;
      }
    }

    return NextResponse.json({ error: "All models failed" }, { status: 502, headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500, headers: corsHeaders });
  }
}
