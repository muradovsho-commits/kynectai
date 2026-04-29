import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId, unauthorizedResponse, checkRateLimit, getClientIP, getCorsHeaders } from "../_lib/auth";

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
          body: JSON.stringify({
            contents: messages,
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: { temperature: 0.7, topP: 0.9, maxOutputTokens: 1024 },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

          // Parse score block
          const scoreMatch = text.match(/\|\|\|SCORE:(.*?)\|\|\|/);
          let score = null;
          let feedback = text;
          if (scoreMatch) {
            try {
              score = JSON.parse(scoreMatch[1]);
            } catch { /* ignore parse error */ }
            feedback = text.replace(/\|\|\|SCORE:.*?\|\|\|/, "").trim();
          }

          return NextResponse.json({ feedback, score }, { headers: corsHeaders });
        }

        // Try without systemInstruction
        const res2 = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
          const scoreMatch2 = text2.match(/\|\|\|SCORE:(.*?)\|\|\|/);
          let score2 = null;
          let feedback2 = text2;
          if (scoreMatch2) {
            try { score2 = JSON.parse(scoreMatch2[1]); } catch { /* */ }
            feedback2 = text2.replace(/\|\|\|SCORE:.*?\|\|\|/, "").trim();
          }
          return NextResponse.json({ feedback: feedback2, score: score2 }, { headers: corsHeaders });
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
