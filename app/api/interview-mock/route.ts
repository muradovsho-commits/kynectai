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

    const systemPrompt = `You are a senior ${track || "investment banking"} interviewer conducting a live technical interview. You are evaluating the candidate's answer to a technical question.

CORRECT ANSWER (for your reference, do NOT reveal this directly):
${correctAnswer}

YOUR ROLE:
- Evaluate the candidate's response against the correct answer
- Be conversational but rigorous, like a real MD or VP interviewer
- If the answer is good, acknowledge it briefly then push deeper with a follow-up
- If the answer is incomplete, probe: "You're on the right track, but what about..."
- If the answer is wrong, redirect: "Not quite — think about it from the perspective of..."
- If the answer is shallow/memorized, test real understanding: "Okay, but why does that happen?"
- Keep responses concise (2-4 sentences max), then ask a follow-up or give a verdict

SCORING (include at the END of every response as a JSON block):
After your conversational response, add exactly this format on a new line:
|||SCORE:{"accuracy":X,"depth":X,"clarity":X,"verdict":"pass|partial|fail","tip":"one sentence improvement tip"}|||

Where accuracy, depth, clarity are 1-10 scores.
- "pass" = would pass this question in a real interview
- "partial" = showed some knowledge but gaps remain
- "fail" = would not pass this question

Keep the conversational part natural. The score block is parsed programmatically.`;

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

    const models = ["gemini-3-flash-preview", "gemini-2.0-flash", "gemini-1.5-flash"];

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
