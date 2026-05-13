import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId, unauthorizedResponse, checkRateLimit, getClientIP, getCorsHeaders } from "../_lib/auth";
import { checkPlanLimit, incrementUsageInConvex } from "../_lib/plan";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(req) });
}

export async function POST(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  try {
    // Auth check
    const userId = getAuthUserId(req);
    if (!userId) return unauthorizedResponse(corsHeaders);

    // Rate limit: 5 requests per minute per user (burst protection)
    const ip = getClientIP(req);
    const limitKey = `resume:${userId || ip}`;
    const limited = checkRateLimit(limitKey, 5, 60_000, corsHeaders);
    if (limited) return limited;

    // Server-side plan + weekly usage check (Convex is source of truth)
    const planCheck = await checkPlanLimit(userId, "resumeReview", corsHeaders);
    if (!planCheck.allowed) return planCheck.denied!;

    const body = await req.json();
    const { resumeText, targetTrack } = body as { resumeText: string; targetTrack: string };

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json({ error: "Resume text too short or missing" }, { status: 400, headers: corsHeaders });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500, headers: corsHeaders });
    }

    const systemPrompt = `You are a senior resume reviewer who has reviewed thousands of resumes for ${targetTrack || "finance"} recruiting. You have extensive experience at top firms and know exactly what recruiters and hiring managers look for.

TASK: Review the candidate's resume and provide detailed, actionable feedback.

RULES:
- Be direct and specific - no generic advice
- Reference specific bullets, experiences, or sections from the resume
- Judge the resume against ${targetTrack || "finance"} recruiting standards
- Consider both content AND formatting/presentation based on the text
- Point out what's strong and what needs work
- Give rewritten bullet examples where relevant

RESPOND IN THIS EXACT JSON FORMAT (no markdown, no backticks, just raw JSON):
{
  "overallScore": <number 1-10>,
  "headline": "<one sentence summary of the resume's readiness>",
  "sections": {
    "experience": {
      "score": <1-10>,
      "feedback": "<2-3 sentences on the quality of experience bullets>",
      "suggestions": ["<specific suggestion 1>", "<specific suggestion 2>"]
    },
    "skills": {
      "score": <1-10>,
      "feedback": "<2-3 sentences on skills section>",
      "suggestions": ["<specific suggestion>"]
    },
    "education": {
      "score": <1-10>,
      "feedback": "<1-2 sentences on education section>",
      "suggestions": ["<specific suggestion>"]
    },
    "formatting": {
      "score": <1-10>,
      "feedback": "<1-2 sentences on overall structure and presentation>",
      "suggestions": ["<specific suggestion>"]
    }
  },
  "topStrengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "criticalFixes": ["<most important fix 1>", "<most important fix 2>", "<most important fix 3>"],
  "rewrittenBullets": [
    { "original": "<original bullet from resume>", "improved": "<your rewritten version>" },
    { "original": "<another bullet>", "improved": "<your rewritten version>" }
  ],
  "interviewReadiness": "<1-2 sentences on how well this resume would perform in a ${targetTrack || "finance"} interview setting - would it generate good talking points?>"
}`;

    const messages = [
      {
        role: "user" as const,
        parts: [{ text: `Here is the candidate's resume text. Review it for ${targetTrack || "finance"} roles:\n\n${resumeText}` }],
      },
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
            generationConfig: { temperature: 0.6, topP: 0.9, maxOutputTokens: 2048 },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
          // Gemini call succeeded and cost real money - count it toward weekly cap
          await incrementUsageInConvex(userId, "resumeReview");

          // Try to parse JSON from response - multiple strategies
          let parsed = null;

          // Strategy 1: Strip markdown fences and parse directly
          try {
            const clean = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
            parsed = JSON.parse(clean);
          } catch {}

          // Strategy 2: Extract JSON object using brace matching
          if (!parsed) {
            try {
              const firstBrace = text.indexOf('{');
              const lastBrace = text.lastIndexOf('}');
              if (firstBrace !== -1 && lastBrace > firstBrace) {
                const jsonSlice = text.slice(firstBrace, lastBrace + 1);
                parsed = JSON.parse(jsonSlice);
              }
            } catch {}
          }

          // Strategy 3: Fix common JSON issues (trailing commas, single quotes)
          if (!parsed) {
            try {
              const firstBrace = text.indexOf('{');
              const lastBrace = text.lastIndexOf('}');
              if (firstBrace !== -1 && lastBrace > firstBrace) {
                let jsonSlice = text.slice(firstBrace, lastBrace + 1);
                // Remove trailing commas before } or ]
                jsonSlice = jsonSlice.replace(/,\s*([}\]])/g, '$1');
                // Remove any control characters
                jsonSlice = jsonSlice.replace(/[\x00-\x1f\x7f]/g, (c) => c === '\n' || c === '\r' || c === '\t' ? c : ' ');
                parsed = JSON.parse(jsonSlice);
              }
            } catch {}
          }

          // Validate that parsed has the expected structure
          if (parsed && typeof parsed.overallScore === 'number' && parsed.sections) {
            return NextResponse.json({ review: parsed, model }, { headers: corsHeaders });
          }

          // Strategy 4: If we still can't parse, try the client side
          // Return raw but also signal it's JSON-like so client can retry parsing
          if (parsed) {
            // Parsed but missing expected fields - still send as review, client will handle
            return NextResponse.json({ review: parsed, model }, { headers: corsHeaders });
          }

          // Last resort: return raw but let the client try to parse it too
          return NextResponse.json({ raw: text, model }, { headers: corsHeaders });
        } else {
          const errBody = await res.text().catch(() => "");
          console.error(`Model ${model} failed: ${res.status} ${errBody.slice(0, 200)}`);
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
