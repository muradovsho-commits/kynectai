import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId, unauthorizedResponse, checkRateLimit, getClientIP, getCorsHeaders } from "../../_lib/auth";

// ─────────────────────────────────────────────────────────────────────────────
// Reps chat endpoint.
//
// Takes the scenario context, the personas in the scene, the conversation
// history, and the student's latest message. Returns one or more replies
// from the personas — the AI decides which persona(s) speak based on what
// the student just said and what's natural for the moment.
//
// Returns an array of { personaId, text } so the UI can render multiple
// pings from different people back-to-back (e.g. MD pings about the new
// angle, then VP follows up about formatting).
// ─────────────────────────────────────────────────────────────────────────────

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(req) });
}

type Persona = { id: string; name: string; title: string; firm: string; style: string; voice: string; initials: string };

export async function POST(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  try {
    const userId = getAuthUserId(req);
    if (!userId) return unauthorizedResponse(corsHeaders);

    // Per-minute rate limit. Reps is interactive so a generous cap, but
    // still caps a misbehaving client.
    const ip = getClientIP(req);
    const limited = checkRateLimit(`reps-chat:${userId || ip}`, 30, 60_000, corsHeaders);
    if (limited) return limited;

    const body = await req.json();
    const { scenarioContext, personas, history, userMessage } = body as {
      scenarioContext?: string;
      personas?: Persona[];
      history?: { from: string; personaId?: string; text: string }[];
      userMessage?: string;
    };

    if (!scenarioContext || !personas || !Array.isArray(personas) || personas.length === 0 || !userMessage) {
      return NextResponse.json({ error: "Missing scenarioContext, personas, or userMessage" }, { status: 400, headers: corsHeaders });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500, headers: corsHeaders });
    }

    // Build the persona block — every persona's identity is described to the
    // model so it can pick which voice to use AND can have multiple personas
    // chime in within one turn.
    const personaBlock = personas.map(p =>
      `[${p.id}] ${p.name} — ${p.title} at ${p.firm}\n  Style: ${p.style}`
    ).join('\n\n');

    // Convert history to a transcript the model can read at a glance.
    const transcript = (history || []).slice(-20).map(h => {
      if (h.from === 'student') return `[student] ${h.text}`;
      if (h.from === 'persona') {
        const p = personas.find(x => x.id === h.personaId);
        return `[${h.personaId}] ${p?.name || 'Persona'}: ${h.text}`;
      }
      return `[system] ${h.text}`;
    }).join('\n');

    const systemPrompt = `You are running a workday simulation for a finance/consulting student. You inhabit one or more colleague personas reacting to the student in real time.

SCENARIO CONTEXT
${scenarioContext}

PERSONAS IN THIS SCENE (you may speak as ANY of them — pick whichever is most natural for the moment):

${personaBlock}

CONVERSATION SO FAR
${transcript}

THE STUDENT JUST SAID:
${userMessage}

YOUR JOB
Reply as one or more personas would naturally reply. Most of the time one persona responds. Sometimes two should respond — e.g., the student asks about scope and the MD answers but the VP follows up with a clarifying ask about formatting. Pick what's natural; don't force multiple replies.

Rules:
- Stay in character. Match each persona's style.
- Be brief. Real Slack/chat messages — usually 1-3 sentences, occasionally a short paragraph if substantive.
- Don't narrate. Don't say "*MD looks up from his laptop*". Just speak.
- Don't reveal you're an AI or a simulation. Stay in the world.
- Don't ask the student to "describe what you would do." If the student is procrastinating, push them. If they ask a real question, answer it directly.
- If the student asks for the deliverable to be done for them, decline in character. Real seniors don't do their analyst's work.
- If the student uploads or references a deliverable, react like a real reviewer.

OUTPUT FORMAT — STRICT JSON, no markdown fences:
{
  "replies": [
    { "personaId": "<persona id from list above>", "text": "<their message>" }
  ]
}

If multiple personas should respond, return multiple entries in the array in the order they'd land in chat.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const geminiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: "Continue the simulation." }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          temperature: 0.85,
          topP: 0.9,
          maxOutputTokens: 1024,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("[reps-chat] gemini error:", geminiRes.status, errText.slice(0, 300));
      return NextResponse.json({ error: "AI service error" }, { status: 502, headers: corsHeaders });
    }

    const data = await geminiRes.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let parsed: { replies?: { personaId: string; text: string }[] } = {};
    try {
      parsed = JSON.parse(text);
    } catch {
      // Salvage attempt — strip code fences if the model emitted them.
      const cleaned = text.replace(/```json|```/g, "").trim();
      try { parsed = JSON.parse(cleaned); } catch {}
    }

    if (!parsed.replies || !Array.isArray(parsed.replies) || parsed.replies.length === 0) {
      // Fall back to a single reply from the first persona so the UI doesn't
      // hang. This should be rare with responseMimeType set.
      parsed = { replies: [{ personaId: personas[0].id, text: text.slice(0, 600) || "..." }] };
    }

    // Validate persona IDs — if the model invents one, snap it to the first.
    const validIds = new Set(personas.map(p => p.id));
    const cleanedReplies = parsed.replies.map(r => ({
      personaId: validIds.has(r.personaId) ? r.personaId : personas[0].id,
      text: r.text || "",
    })).filter(r => r.text.length > 0);

    return NextResponse.json({ replies: cleanedReplies }, { headers: corsHeaders });
  } catch (e: any) {
    console.error("[reps-chat] error:", e?.message || e);
    return NextResponse.json({ error: "Chat handler error: " + (e?.message || "unknown") }, { status: 500, headers: getCorsHeaders(req) });
  }
}
