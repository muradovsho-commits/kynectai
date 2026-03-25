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
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500, headers: corsHeaders });
    }

    // Build Gemini request
    // Convert chat messages to Gemini format
    const geminiContents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const systemInstruction = system || `You are Coach — an elite finance recruiting advisor. You have deep expertise in investment banking, private equity, hedge funds, consulting, and all aspects of finance recruiting. You help students with cold emails, networking, coffee chats, interview prep, recruiting stories, and offer decisions.

Be direct, specific, and warm — like a brilliant older friend who went through the process. Never give generic advice. When reviewing emails or stories, rewrite them. Remember everything in the conversation and build on it. Keep responses well-formatted with clear paragraphs. Use bullet points when listing multiple things. Always end with a specific follow-up question or next action.

The user is currently on the "${track || "Investment Banking"}" recruiting track. Tailor your advice specifically for ${track || "Investment Banking"} recruiting when relevant.`;

    const geminiBody = {
      contents: geminiContents,
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      generationConfig: {
        temperature: 0.8,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    };

    const model = "gemini-2.0-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiBody),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Gemini API error:", res.status, errorText);
      
      // Try fallback without systemInstruction (older format)
      const fallbackBody = {
        contents: [
          { role: "user", parts: [{ text: systemInstruction + "\n\n---\n\n" + messages[0].content }] },
          ...geminiContents.slice(1),
        ],
        generationConfig: {
          temperature: 0.8,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      };

      const res2 = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fallbackBody),
      });

      if (!res2.ok) {
        const err2 = await res2.text();
        console.error("Gemini fallback error:", res2.status, err2);
        return NextResponse.json(
          { error: "Coach is temporarily unavailable. " + res2.status, debug: err2.slice(0, 200) },
          { status: 502, headers: corsHeaders }
        );
      }

      const data2 = await res2.json();
      const text2 = data2.candidates?.[0]?.content?.parts?.[0]?.text || "Something went wrong — please try again.";
      return NextResponse.json({ text: text2 }, { headers: corsHeaders });
    }

    const data = await res.json();
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Something went wrong — please try again.";

    return NextResponse.json({ text }, { headers: corsHeaders });
  } catch (error) {
    console.error("Coach API error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500, headers: corsHeaders }
    );
  }
}
