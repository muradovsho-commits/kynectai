import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId, unauthorizedResponse, checkRateLimit, getClientIP, getCorsHeaders } from "../_lib/auth";

// Infinite Drills: generates ONE adaptive multiple-choice drill per call.
// Mirrors the reps/coach route patterns (GEMINI_API_KEY, model fallback,
// cookie auth, rate limit). Does NOT touch Stripe or Convex. The client
// grades locally against `correct`, so there is no second "grading" call.
//
// NOTE: this is gated to logged-in users + rate-limited to control cost, but
// it is intentionally NOT plan-gated, so it works for all drill users. To make
// it Pro/Elite-only later, import getPlanFromConvex and add a plan check here
// exactly like app/api/reps/route.ts does.

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(req) });
}

type RecentResult = { topic?: string; difficulty?: string; correct?: boolean };

export async function POST(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  try {
    const userId = getAuthUserId(req);
    if (!userId) return unauthorizedResponse(corsHeaders);

    const ip = getClientIP(req);
    const limited = checkRateLimit(`drill-inf:${userId || ip}`, 40, 60_000, corsHeaders);
    if (limited) return limited;

    const body = await req.json().catch(() => ({}));
    const {
      trackTitle = "Investment Banking",
      topics = [],
      recent = [],
      avoid = [],
    } = body as {
      track?: string;
      trackTitle?: string;
      topics?: string[];
      recent?: RecentResult[];
      avoid?: string[];
    };

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500, headers: corsHeaders });
    }

    const topicList = Array.isArray(topics) && topics.length
      ? topics.slice(0, 40).join(", ")
      : "core technical topics for this track";

    // Adaptivity signal from the last few answers.
    const recentArr = Array.isArray(recent) ? recent.slice(-6) : [];
    const correctCount = recentArr.filter(r => r?.correct === true).length;
    const total = recentArr.length;
    let level = "Mix easy and medium difficulty.";
    if (total >= 3) {
      const rate = correctCount / total;
      if (rate >= 0.8) level = "They are doing well. Make this one harder and less common, push into nuance or a tricky edge case.";
      else if (rate <= 0.4) level = "They are struggling. Keep this one foundational and reinforce a core concept clearly.";
      else level = "They are mixed. Use medium difficulty.";
    }
    const recentTopics = recentArr.map(r => r?.topic).filter(Boolean).slice(-3);
    const rotate = recentTopics.length
      ? `Recent questions covered: ${recentTopics.join(", ")}. Pick a DIFFERENT subtopic so they are not stuck on one area.`
      : "Vary the subtopic.";

    const avoidList = Array.isArray(avoid) ? avoid.slice(-25) : [];
    const avoidBlock = avoidList.length
      ? `Do NOT repeat or trivially reword any of these already-asked questions:\n- ${avoidList.join("\n- ")}`
      : "";

    const systemInstruction = `You are an elite finance interviewer writing ONE multiple-choice drill question for a student preparing for ${trackTitle} interviews.

Return ONLY a JSON object with this exact shape (no markdown, no prose):
{"q": string, "scenario": string (optional, only for calculation questions), "options": [string, string, string, string], "correct": number (0-3), "explanation": string, "difficulty": "easy" | "medium" | "hard", "topic": string}

Subtopics available for this track: ${topicList}

NON-NEGOTIABLE QUALITY RULES:
1. Accuracy: the question must have exactly ONE unambiguously correct option. Verify the correct answer yourself before returning. Never ship a question you are not certain about.
2. Distractors: all 4 options must be genuinely plausible to a student who half-knows the material. Wrong options are realistic mistakes, common misconceptions, swapped formulas, off-by-one errors, or confused definitions. NEVER write an obviously absurd or joke option.
3. No giveaways: all 4 options must be similar in length, specificity, and grammatical form. Do NOT make the correct option the longest or most detailed. Do NOT use "All of the above" or "None of the above". Do not telegraph the answer in the wording of the question.
4. Explanation: 1 to 2 sentences. State why the correct answer is right, and briefly why the most tempting wrong option is wrong.
5. "topic" must be one real subtopic from the list above. "difficulty" must honestly reflect the question.

ADAPT TO THE STUDENT:
${level}
${rotate}

${avoidBlock}`.trim();

    const userPrompt = "Generate the next drill question now as strict JSON.";

    const models = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-3-flash-preview"];

    for (const model of models) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const geminiBody = {
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: {
          temperature: 0.9,
          topP: 0.95,
          maxOutputTokens: 700,
          responseMimeType: "application/json",
        },
      };

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(geminiBody),
        });
        if (!res.ok) continue;
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        if (!text) continue;

        let q: unknown;
        try {
          q = JSON.parse(text);
        } catch {
          // strip any stray code fences and retry parse
          const cleaned = text.replace(/```json|```/g, "").trim();
          try { q = JSON.parse(cleaned); } catch { continue; }
        }

        const valid = validate(q);
        if (!valid) continue;
        return NextResponse.json({ question: valid }, { headers: corsHeaders });
      } catch {
        continue;
      }
    }

    return NextResponse.json(
      { error: "Could not generate a question right now. Please try again." },
      { status: 502, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Drill-infinite error:", error);
    return NextResponse.json({ error: "Failed to process" }, { status: 500, headers: corsHeaders });
  }
}

// Validate + normalize the model output into the exact DrillQ shape the client
// already renders. Returns null if anything is off (so we fall through models).
function validate(raw: unknown): {
  q: string; scenario?: string; options: string[]; correct: number;
  explanation: string; difficulty: "easy" | "medium" | "hard"; topic: string;
} | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const q = typeof o.q === "string" ? o.q.trim() : "";
  const explanation = typeof o.explanation === "string" ? o.explanation.trim() : "";
  const topic = typeof o.topic === "string" && o.topic.trim() ? o.topic.trim() : "General";
  const options = Array.isArray(o.options) ? o.options.filter(x => typeof x === "string").map(x => (x as string).trim()) : [];
  let correct = typeof o.correct === "number" ? o.correct : Number(o.correct);
  const diffRaw = typeof o.difficulty === "string" ? o.difficulty.toLowerCase() : "medium";
  const difficulty = (["easy", "medium", "hard"].includes(diffRaw) ? diffRaw : "medium") as "easy" | "medium" | "hard";

  if (!q || !explanation) return null;
  if (options.length !== 4) return null;
  if (new Set(options).size !== 4) return null; // no duplicate options
  if (!Number.isInteger(correct) || correct < 0 || correct > 3) return null;

  const out: { q: string; scenario?: string; options: string[]; correct: number; explanation: string; difficulty: "easy" | "medium" | "hard"; topic: string } = {
    q, options, correct, explanation, difficulty, topic,
  };
  if (typeof o.scenario === "string" && o.scenario.trim()) out.scenario = o.scenario.trim();
  return out;
}
