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

    // Rate limit: 30 requests per minute per user
    const ip = getClientIP(req);
    const limitKey = `coach:${userId || ip}`;
    const limited = checkRateLimit(limitKey, 30, 60_000, corsHeaders);
    if (limited) return limited;

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
    // Keep system + last 10 messages, trim any single message over 3000 chars
    const trimmedMessages = messages.slice(-10).map((m) => ({
      ...m,
      content: m.content.length > 3000 ? m.content.slice(0, 3000) + "\n\n[Message trimmed for length - paste shorter sections for better feedback]" : m.content,
    }));

    // Build Gemini request
    // Convert chat messages to Gemini format
    const geminiContents = trimmedMessages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const systemInstruction = system || `You are Coach - an elite finance recruiting advisor. You have deep expertise across all major finance and professional services careers: investment banking, private equity, consulting (MBB and Tier 2), asset management, accounting and audit (Big 4), equity research, sales and trading, venture capital, real estate (REPE and REITs), and restructuring. You help students with cold emails, networking, coffee chats, interview prep, recruiting stories, and offer decisions.

Today's date is ${today}. Use this when evaluating resume dates - any dates before today are in the past, any dates after today are in the future. Do not flag past dates as upcoming or future dates as past.

Be direct, specific, and warm - like a brilliant older friend who went through the process. Never give generic advice. When reviewing resumes, pay careful attention to the chronological order of experiences and dates. When reviewing emails or stories, rewrite them. Remember everything in the conversation and build on it. Keep responses well-formatted with clear paragraphs. Use bullet points when listing multiple things. Always end with a specific follow-up question or next action.

The user is currently on the "${track || "Investment Banking"}" recruiting track. Tailor your advice specifically for ${track || "Investment Banking"} recruiting when relevant.`;

    // Try models in order of preference
    const models = ["gemini-3-flash-preview", "gemini-2.5-flash", "gemini-2.5-flash-lite"];
    
    for (const model of models) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      // Try with systemInstruction first
      const geminiBody = {
        contents: geminiContents,
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: { temperature: 0.8, topP: 0.95, maxOutputTokens: 2048 },
      };

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(geminiBody),
        });

        if (res.ok) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Something went wrong - please try again.";
          return NextResponse.json({ text }, { headers: corsHeaders });
        }

        // If systemInstruction isn't supported, try inlining it
        const fallbackBody = {
          contents: [
            { role: "user", parts: [{ text: systemInstruction + "\n\n---\n\nUser message: " + messages[0].content }] },
            ...geminiContents.slice(1),
          ],
          generationConfig: { temperature: 0.8, topP: 0.95, maxOutputTokens: 2048 },
        };

        const res2 = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fallbackBody),
        });

        if (res2.ok) {
          const data2 = await res2.json();
          const text2 = data2.candidates?.[0]?.content?.parts?.[0]?.text || "Something went wrong - please try again.";
          return NextResponse.json({ text: text2 }, { headers: corsHeaders });
        }

        // This model didn't work, try next
        const errText = await res2.text();
        console.error(`Model ${model} failed:`, res2.status, errText.slice(0, 200));
        continue;
      } catch (fetchErr) {
        console.error(`Model ${model} fetch error:`, fetchErr);
        continue;
      }
    }

    // All models failed
    return NextResponse.json(
      { error: "Coach is temporarily unavailable. Please try again in a moment, or try sending a shorter message." },
      { status: 502, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Coach API error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500, headers: corsHeaders }
    );
  }
}
