import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId, unauthorizedResponse, checkRateLimit, getClientIP, getCorsHeaders } from "../_lib/auth";
import { checkPlanLimit, incrementUsageInConvex } from "../_lib/plan";

// Robustly extract the |||SCORE:{...}||| block from a model response and strip
// it from the user-facing feedback. Tolerant of: JSON spanning multiple lines
// (uses the dotAll flag), trailing junk around the object, and a missing/
// truncated closing delimiter. Returns score=null only when no valid JSON can
// be recovered, so a well-formed score is no longer lost to a brittle regex.
function parseScoreBlock(text: string): { score: any; feedback: string } {
  let score: any = null;
  // Prefer a fully-delimited block; fall back to an unterminated trailing block.
  let m = text.match(/\|\|\|SCORE:([\s\S]*?)\|\|\|/);
  if (!m) m = text.match(/\|\|\|SCORE:([\s\S]*)$/);
  if (m) {
    let raw = m[1].trim();
    const first = raw.indexOf("{");
    const last = raw.lastIndexOf("}");
    if (first !== -1 && last > first) raw = raw.slice(first, last + 1);
    try { score = JSON.parse(raw); } catch { score = null; }
  }
  const feedback = text
    .replace(/\|\|\|SCORE:[\s\S]*?\|\|\|/, "")
    .replace(/\|\|\|SCORE:[\s\S]*$/, "")
    .trim();
  return { score, feedback };
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(req) });
}

export async function POST(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  try {
    // Auth check
    const userId = getAuthUserId(req);
    if (!userId) return unauthorizedResponse(corsHeaders);

    // Rate limit: 20 requests per minute per user
    const ip = getClientIP(req);
    const limitKey = `mock:${userId || ip}`;
    const limited = checkRateLimit(limitKey, 20, 60_000, corsHeaders);
    if (limited) return limited;

    const body = await req.json();
    const { question, correctAnswer, userAnswer, history, track } = body as {
      question: string;
      correctAnswer: string;
      userAnswer: string;
      history?: { role: string; content: string }[];
      track?: string;
    };

    // A "mock interview" = one full session = N question/answer turns. We
    // count sessions, not turns, by treating an empty/missing history as
    // the start of a session. Free plan: 3 sessions/week. Pro/Elite: 999.
    const isSessionStart = !history || history.length === 0;
    if (isSessionStart) {
      const planCheck = await checkPlanLimit(userId, "mockInterview", corsHeaders);
      if (!planCheck.allowed) return planCheck.denied!;
    }

    if (!question || !userAnswer) {
      return NextResponse.json({ error: "Missing question or answer" }, { status: 400, headers: corsHeaders });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500, headers: corsHeaders });
    }

    const systemPrompt = `You are a senior ${track || "investment banking"} interviewer grading a candidate's recorded response to a technical question.

CORRECT ANSWER (for your reference, do NOT reveal this directly):
${correctAnswer}

YOUR ROLE:
- Give a complete, final assessment of the candidate's answer in one response
- Do NOT ask follow-up questions - this is a one-shot recorded response, not a conversation
- Compare their answer against the correct answer
- Be direct and specific about what they got right and what they missed
- If the answer is strong, say so clearly and note what made it effective
- If the answer has gaps, identify exactly what was missing or incorrect
- If the answer is wrong, explain what the correct approach would be without giving the full answer verbatim
- Keep your feedback concise but thorough (3-6 sentences)

SCORING (include at the END of your response as a JSON block):
After your feedback, add exactly this format on a new line:
|||SCORE:{"accuracy":X,"depth":X,"clarity":X,"verdict":"pass|partial|fail","tip":"one sentence improvement tip","strengths":["strength 1","strength 2"],"weaknesses":["weakness 1","weakness 2"]}|||

Where accuracy, depth, clarity are 1-10 scores.
- "pass" = would pass this question in a real interview
- "partial" = showed some knowledge but gaps remain
- "fail" = would not pass this question
- "strengths" = 1-3 specific things the candidate did well
- "weaknesses" = 1-3 specific areas to improve

The score block is parsed programmatically. Do not include it inside your written feedback.`;

    const messages = history && history.length > 0
      ? [
          ...history.map(m => ({
            role: m.role === "assistant" ? "model" as const : "user" as const,
            parts: [{ text: m.content }],
          })),
          { role: "user" as const, parts: [{ text: userAnswer }] },
        ]
      : [
          { role: "user" as const, parts: [{ text: `Interview question: "${question}"\n\nCandidate's answer: "${userAnswer}"` }] },
        ];

    const models = ["gemini-3-flash-preview", "gemini-2.5-flash", "gemini-2.5-flash-lite"];

    for (const model of models) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(15000),
          body: JSON.stringify({
            contents: messages,
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: { temperature: 0.7, topP: 0.9, maxOutputTokens: 1024 },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

          // Only accept a non-empty response. An empty 200 (e.g. a model that
          // spent its whole token budget on internal reasoning and returned no
          // text) must fall through to the next attempt/model instead of
          // returning a blank grade to the user.
          if (text.trim()) {
            const { score, feedback } = parseScoreBlock(text);

            if (isSessionStart) await incrementUsageInConvex(userId, "mockInterview");
            return NextResponse.json({ feedback, score }, { headers: corsHeaders });
          }
        }

        // Try without systemInstruction
        const res2 = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(15000),
          body: JSON.stringify({
            contents: [
              { role: "user", parts: [{ text: systemPrompt + "\n\n---\n\n" + `Interview question: "${question}"\n\nCandidate's answer: "${userAnswer}"` }] },
              ...(history || []).slice(1).map(m => ({
                role: m.role === "assistant" ? "model" : "user",
                parts: [{ text: m.content }],
              })),
            ],
            generationConfig: { temperature: 0.7, topP: 0.9, maxOutputTokens: 1024 },
          }),
        });

        if (res2.ok) {
          const data2 = await res2.json();
          const text2 = data2.candidates?.[0]?.content?.parts?.[0]?.text || "";
          if (text2.trim()) {
            const { score: score2, feedback: feedback2 } = parseScoreBlock(text2);
            if (isSessionStart) await incrementUsageInConvex(userId, "mockInterview");
            return NextResponse.json({ feedback: feedback2, score: score2 }, { headers: corsHeaders });
          }
        }

        continue;
      } catch {
        continue;
      }
    }

    return NextResponse.json({ error: "Interview AI temporarily unavailable" }, { status: 502, headers: corsHeaders });
  } catch (error) {
    console.error("Interview mock error:", error);
    return NextResponse.json({ error: "Failed to process" }, { status: 500, headers: corsHeaders });
  }
}
