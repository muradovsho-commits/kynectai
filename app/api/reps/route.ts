import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId, unauthorizedResponse, checkRateLimit, getClientIP, getCorsHeaders } from "../_lib/auth";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(req) });
}

export async function POST(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  try {
    const userId = getAuthUserId(req);
    if (!userId) return unauthorizedResponse(corsHeaders);

    const ip = getClientIP(req);
    const limitKey = `reps:${userId || ip}`;
    const limited = checkRateLimit(limitKey, 20, 60_000, corsHeaders);
    if (limited) return limited;

    const body = await req.json();
    const { messages, persona, context, stepType } = body as {
      messages?: { role: string; content: string }[];
      persona?: { name: string; title: string; firm: string; style: string };
      context?: string;
      stepType?: string;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Missing messages" }, { status: 400, headers: corsHeaders });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500, headers: corsHeaders });
    }

    const trimmedMessages = messages.slice(-12).map((m) => ({
      ...m,
      content: m.content.length > 4000 ? m.content.slice(0, 4000) + "\n\n[Trimmed for length]" : m.content,
    }));

    const geminiContents = trimmedMessages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const personaName = persona?.name || "Colleague";
    const personaTitle = persona?.title || "Senior Professional";
    const personaFirm = persona?.firm || "the firm";
    const personaStyle = persona?.style || "Professional and direct.";

    let typeInstruction = "";
    if (stepType === "review") {
      typeInstruction = "You are now reviewing the student's work product. Provide specific, craft-level feedback the way a real senior professional would mark up junior work. Point out specific strengths and specific weaknesses. Be honest but constructive. Reference exact details from what they submitted. End with one key takeaway.";
    } else if (stepType === "call") {
      typeInstruction = "You are on a live call/meeting with the student. Stay in character throughout. React naturally to what they say. Push back if their thinking is sloppy. Ask follow-up questions. Make them think on their feet. Keep responses conversational - 2 to 4 paragraphs max.";
    } else if (stepType === "interrupt") {
      typeInstruction = "This is an urgent interruption. You are disrupting the student's current work with a new, time-sensitive ask. Be direct and pressured. Create a sense of urgency. The student needs to triage and respond quickly.";
    } else if (stepType === "decision") {
      typeInstruction = "You have asked the student to make a decision or take a position. React to their answer. If their reasoning is sound, acknowledge it and move forward. If it is weak, push back and ask them to think harder. Test their conviction.";
    } else if (stepType === "deliverable") {
      typeInstruction = "The student has submitted a work product (memo, analysis, model output, note). Review it as a real senior professional would. Be specific in your feedback - reference exact parts of what they wrote. Grade the thinking, not just the format. Point out what is good and what needs improvement.";
    } else {
      typeInstruction = "Respond naturally in character. Keep it concise - 1 to 3 paragraphs. Stay in the workplace simulation. Do not break character. React to what the student said and move the scenario forward.";
    }

    const systemInstruction = `You are ${personaName}, ${personaTitle} at ${personaFirm}. You are a character in a realistic day-in-the-life career simulation for finance/professional services students.

PERSONA STYLE: ${personaStyle}

SCENARIO CONTEXT: ${context || "A typical workday in finance."}

CRITICAL RULES:
- Stay completely in character as ${personaName}. Never break the fourth wall.
- Never mention that this is a simulation, AI, roleplay, or educational exercise.
- Respond exactly as a real ${personaTitle} at ${personaFirm} would in this situation.
- Use natural workplace language - Slack-style for messages, professional for memos, direct for calls.
- Be specific. Reference real concepts, real deal dynamics, real industry terminology.
- Push the student to think. Do not hand them answers. Challenge sloppy reasoning.
- Keep responses focused and realistic in length - not too short, not too long.
- If reviewing work, give specific, actionable feedback that references their exact output.
- Do not use em dashes. Use regular hyphens instead.

${typeInstruction}`;

    const models = ["gemini-3-flash-preview", "gemini-2.5-flash", "gemini-2.5-flash-lite"];

    for (const model of models) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const geminiBody = {
        contents: geminiContents,
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: { temperature: 0.85, topP: 0.95, maxOutputTokens: 2048 },
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

        // Fallback: inline system instruction
        const fallbackBody = {
          contents: [
            { role: "user", parts: [{ text: systemInstruction + "\n\n---\n\n" + messages[0].content }] },
            ...geminiContents.slice(1),
          ],
          generationConfig: { temperature: 0.85, topP: 0.95, maxOutputTokens: 2048 },
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

        continue;
      } catch {
        continue;
      }
    }

    return NextResponse.json(
      { error: "Simulation engine temporarily unavailable. Please try again." },
      { status: 502, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Reps API error:", error);
    return NextResponse.json({ error: "Failed to process" }, { status: 500, headers: corsHeaders });
  }
}
