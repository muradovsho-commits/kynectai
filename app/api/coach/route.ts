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

    // Rate limit: 30 requests per minute per user (burst protection)
    const ip = getClientIP(req);
    const limitKey = `coach:${userId || ip}`;
    const limited = checkRateLimit(limitKey, 30, 60_000, corsHeaders);
    if (limited) return limited;

    // Server-side plan + weekly usage check (Convex is source of truth)
    const planCheck = await checkPlanLimit(userId, "coach", corsHeaders);
    if (!planCheck.allowed) return planCheck.denied!;

    const body = await req.json();
    const { messages, system, track } = body as {
      messages?: { role: string; content: string }[];
      system?: string;
      track?: string;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Missing messages" }, { status: 400, headers: corsHeaders });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key not configured. Add GEMINI_API_KEY to Vercel env vars." }, { status: 500, headers: corsHeaders });
    }

    // Truncate conversation history to prevent exceeding token limits
    const trimmedMessages = messages.slice(-10).map((m) => ({
      ...m,
      content: m.content.length > 3000 ? m.content.slice(0, 3000) + "\n\n[Message trimmed for length - paste shorter sections for better feedback]" : m.content,
    }));

    const geminiContents = trimmedMessages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const systemInstruction = system || `You are Coach - an elite finance recruiting advisor. You have deep expertise across all major finance and professional services careers: investment banking, private equity, consulting (MBB and Tier 2), asset management, accounting and audit (Big 4), equity research, sales and trading, venture capital, real estate (REPE and REITs), and restructuring. You help students with cold emails, networking, coffee chats, interview prep, recruiting stories, and offer decisions.

Today's date is ${today}. Use this when evaluating resume dates - any dates before today are in the past, any dates after today are in the future. Do not flag past dates as upcoming or future dates as past.

CRITICAL: Be concise. Default to short, punchy answers. Most responses should be 2-5 sentences or a tight 3-5 bullet list. Only go longer when the user explicitly asks for a deep walkthrough. Never pad with throat-clearing, restatement of the question, or unnecessary caveats.

Be direct, specific, and warm - like a brilliant older friend who went through the process. Never give generic advice. When reviewing resumes, pay careful attention to the chronological order of experiences and dates. When reviewing emails or stories, rewrite them quickly with the key changes. End with a specific follow-up question only when it advances the conversation - don't force one if the answer is complete.

The user is currently on the "${track || "Investment Banking"}" recruiting track. Tailor your advice specifically for ${track || "Investment Banking"} recruiting when relevant.`;

    // Try models in order. First successful streaming response wins.
    const models = ["gemini-3-flash-preview", "gemini-2.5-flash", "gemini-2.5-flash-lite"];

    let upstream: Response | null = null;
    let lastError = "";

    for (const model of models) {
      // Use streamGenerateContent with SSE format for real-time chunks
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

      const geminiBody = {
        contents: geminiContents,
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: { temperature: 0.8, topP: 0.95, maxOutputTokens: 1024 },
      };

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(geminiBody),
        });

        if (res.ok && res.body) {
          upstream = res;
          break;
        }
        lastError = `Model ${model} returned ${res.status}`;
        // Read body to release it, then try next model
        try { await res.text(); } catch {}
      } catch (fetchErr: any) {
        lastError = `Model ${model} fetch error: ${fetchErr?.message || fetchErr}`;
        continue;
      }
    }

    if (!upstream || !upstream.body) {
      console.error("All Gemini models failed:", lastError);
      return NextResponse.json(
        { error: "Coach is temporarily unavailable. Please try again in a moment." },
        { status: 502, headers: corsHeaders }
      );
    }

    // Pipe Gemini's SSE stream to the client as plain text chunks. Each Gemini
    // SSE line is `data: {...json...}`; we extract the text part and forward
    // only that. Client receives a smooth stream of text tokens.
    const upstreamBody = upstream.body;
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = upstreamBody.getReader();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            // Split on newlines but keep partial last line in buffer
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              const payload = line.slice(6).trim();
              if (!payload || payload === "[DONE]") continue;
              try {
                const json = JSON.parse(payload);
                const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                  controller.enqueue(encoder.encode(text));
                }
              } catch {
                // Malformed line - skip
              }
            }
          }

          // Stream complete. Best-effort increment - don't fail the response
          // if Convex is briefly unreachable.
          try {
            await incrementUsageInConvex(userId, "coach");
          } catch (usageErr) {
            console.error("Usage increment failed:", usageErr);
          }
          controller.close();
        } catch (streamErr: any) {
          console.error("Stream error:", streamErr);
          controller.enqueue(encoder.encode("\n\n[Connection interrupted. Please try again.]"));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (error) {
    console.error("Coach API error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500, headers: corsHeaders }
    );
  }
}
