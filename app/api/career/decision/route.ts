// app/api/career/decision/route.ts
//
// Evaluates a player's free-form response to a MyCareer decision moment.
// Uses Gemini 2.5 Flash. The AI:
//   1. Picks the best-matching outcome key from a predefined list
//   2. Generates an in-character reply from the speaker (1-3 sentences)
// The client then applies the effects associated with the chosen outcome.
//
// Same env var (GEMINI_API_KEY) as /api/reps/chat.

import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

type OutcomeStub = { key: string; description: string };

export async function POST(req: NextRequest) {
  // MyCareer is shelved. This endpoint is disabled until the feature is
  // re-enabled. Return immediately so no Gemini call can fire even via direct
  // POST. To re-enable, delete this block.
  return Response.json({ error: 'Feature not available.' }, { status: 404 });

  // eslint-disable-next-line no-unreachable
  try {
    const body = await req.json();
    const {
      setup,
      speakerName,
      speakerTitle,
      prompt,
      userResponse,
      recommendedApproach,
      outcomes,
      careerContext,
    }: {
      setup: string;
      speakerName: string;
      speakerTitle?: string;
      prompt: string;
      userResponse: string;
      recommendedApproach: string;
      outcomes: OutcomeStub[];
      careerContext: string;
    } = body;

    if (!process.env.GEMINI_API_KEY) {
      return Response.json({ error: 'AI not configured (GEMINI_API_KEY missing).' }, { status: 500 });
    }

    if (!userResponse || typeof userResponse !== 'string' || !userResponse.trim()) {
      return Response.json({ error: 'Empty response.' }, { status: 400 });
    }

    if (!Array.isArray(outcomes) || outcomes.length === 0) {
      return Response.json({ error: 'No outcomes provided.' }, { status: 400 });
    }

    const outcomesList = outcomes
      .map((o, i) => `${i + 1}. KEY="${o.key}" - ${o.description}`)
      .join('\n');

    const aiPrompt = `You are role-playing as ${speakerName}${speakerTitle ? `, ${speakerTitle}` : ''}, talking to a ${careerContext}. You are evaluating their response to your prompt.

SETUP:
${setup}

YOU JUST SAID TO THE ANALYST:
"${prompt}"

THE ANALYST RESPONDED:
"${userResponse}"

WHAT A GOOD RESPONSE LOOKS LIKE:
${recommendedApproach}

POSSIBLE OUTCOMES (pick exactly ONE outcomeKey that best matches the analyst's actual response, not what you wish they had said):
${outcomesList}

Your task:
1. Pick the SINGLE outcomeKey that best fits what the analyst actually wrote. Be honest. If they hedged, mark them as hedging. If they were sharp, mark them as sharp. Reward craft, penalize fluff.
2. Generate a brief in-character reply (1 to 3 sentences) reacting to what they said. Stay in voice. Be direct, no soft-pedaling. This is what you would actually say back in the moment.

Return ONLY valid JSON, no markdown fences, no extra text. Exact shape:
{
  "outcomeKey": "<one of the keys above, exact match>",
  "personaReply": "<your in-character reply>"
}`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: aiPrompt }] }],
          generationConfig: {
            temperature: 0.6,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text().catch(() => '');
      return Response.json({ error: `AI error: ${errText.slice(0, 240)}` }, { status: 500 });
    }

    const data = await geminiRes.json();
    const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return Response.json({ error: 'AI returned empty response.' }, { status: 500 });
    }

    let result: { outcomeKey?: string; personaReply?: string };
    try {
      result = JSON.parse(text);
    } catch {
      return Response.json({ error: 'AI returned invalid JSON.' }, { status: 500 });
    }

    if (!result.outcomeKey || typeof result.personaReply !== 'string') {
      return Response.json({ error: 'AI response missing required fields.' }, { status: 500 });
    }

    // Validate the chosen key. If invalid, fall back to the last outcome
    // (usually the worst / wavering / refused outcome - the safer-conservative
    // bet for a model that returned something garbled).
    const validKeys = outcomes.map(o => o.key);
    if (!validKeys.includes(result.outcomeKey)) {
      result.outcomeKey = outcomes[outcomes.length - 1].key;
    }

    return Response.json({
      outcomeKey: result.outcomeKey,
      personaReply: result.personaReply,
    });
  } catch (e: any) {
    return Response.json({ error: e?.message || 'Internal error' }, { status: 500 });
  }
}
