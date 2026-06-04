import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId, unauthorizedResponse, checkRateLimit, getClientIP, getCorsHeaders } from "../_lib/auth";
import { checkPlanLimit, incrementUsageInConvex } from "../_lib/plan";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Networking email standards distilled from IB recruiting program guidance
// (initial outreach structure, do's and don'ts, good vs bad examples) plus a
// real student template. Applied to every generation so output quality does
// not depend on how the client assembles its prompt.
const OUTREACH_SYSTEM = `You are an expert at writing networking and outreach emails for college students recruiting into investment banking and other competitive finance roles. You know exactly what analysts and associates actually respond to, because you have been trained on what real banking professionals expect. The student fills in details; you turn them into a polished, ready-to-send email.

OUTPUT CONTRACT (follow exactly):
- The very first line must be "Subject: <subject line>".
- Then one blank line, then the email body.
- No commentary, labels, or notes before or after. Output only the email.

STRUCTURE (this matters most): never write the body as one large block of text. Split it into short, distinct paragraphs separated by a blank line, in this order:
1. Greeting on its own line: "Hi <FirstName>," (use "Hi", never "Hey").
2. Intro paragraph: who the student is (name, year, school or program, and the role they are targeting), then ONE genuine, professional connection point, for example a shared program, school, or club, or something specific noticed about the recipient's own role or path on LinkedIn. Keep the connection professional. Never use personal trivia like movies, sports, or hobbies as the hook.
3. Ask paragraph: show specific interest in the recipient's group, firm, or career path. Ask to hear about their experience, what drew them to their group, what their day to day looks like, or advice on recruiting. Then make one clear, specific request for a brief call, and signal flexibility (for example, happy to work around their schedule).
4. Warm closing line (for example: "Hope to connect soon. Have a great day.").
5. Sign-off: "Best," on one line, then the student's first name on the next line.

SUBJECT LINE: specific and informative, in Title Case. Good patterns: "<School or Program> Student Interested in <Group or Bank> Reaching Out", or "<School> Student Networking Call Request". Never generic like "Student Reach-Out" or "Quick Question".

TONE: professional and polished, even if a warmer tone is requested. Confident but never desperate or over-eager. Concise: the body should be roughly 4 to 8 sentences total. Personalized to this exact person, never something that reads like a copy-paste blast.

DO:
- Personalize to the recipient's specific role, group, and firm.
- Keep it brief and to the point.
- Use flawless grammar and spelling. If any day or date is mentioned, keep it internally consistent.
- If a resume is referenced, treat it as attached to the email (below the message), never "above".

DO NOT:
- Do not use a casual greeting ("Hey") or a casual sign-off (no period after the name, no "Cheers" for a first cold email).
- Do not name-drop a mutual contact unless the provided context explicitly says a referral or mutual connection was given.
- Do not invent shared personal interests or hobbies as the connection point.
- Do not use hollow filler or clichés, and never use the words "delve", "robust", "thrilled", or "tapestry".
- Do not be wordy, and do not oversell or sound desperate.

EMAIL TYPE: infer from the context. Default is an initial outreach requesting a brief call. If the context indicates a thank-you or follow-up after a call already happened, instead: thank them, reference something specific that was discussed, optionally ask if there is anyone else worth speaking to, and mention a concrete next step (such as applying when applications open). Keep follow-ups short.

Example of the structure and tone to match (do not copy the details, only the shape):
Subject: Ohio State Student Interested in Real Estate IB Reaching Out

Hi Yash,

I hope you are doing well. My name is Erin Brandwein, and I am a sophomore Fisher Futures student at Ohio State pursuing a career in investment banking. I noticed on your LinkedIn that you went through the program as well and are now an Analyst at KeyBanc.

Given my real estate minor, I am exploring opportunities in real estate groups for Summer 2026, and I would love to hear about how you have enjoyed your role at KeyBanc so far. If you are open to it, I would appreciate setting up a brief call to learn about your experience and ask for any advice on the recruiting process. I know you are busy, so I am happy to work around your schedule.

Hope to connect soon. Have a great day.

Best,
Erin`;

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(req) });
}

export async function POST(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  try {
    // Auth check
    const userId = getAuthUserId(req);
    if (!userId) return unauthorizedResponse(corsHeaders);

    // Rate limit: 10 per minute (burst protection)
    const limitKey = `outreach:${userId || getClientIP(req)}`;
    const limited = checkRateLimit(limitKey, 10, 60_000, corsHeaders);
    if (limited) return limited;

    const body = await req.json();
    const { prompt } = body as { prompt?: string };

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400, headers: corsHeaders });
    }

    // Server-side plan + usage check (Convex is source of truth).
    // For free: lifetime cap (5). For pro/elite: weekly cap (20/30).
    const planCheck = await checkPlanLimit(userId, "outreachWriter", corsHeaders);
    if (!planCheck.allowed) return planCheck.denied!;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: OUTREACH_SYSTEM,
      messages: [{ role: "user", content: prompt }],
    });

    const first = message.content[0];
    const text = first && first.type === "text" ? first.text : "";

    // Increment weekly counter for pro/elite. For free plan, the lifetime
    // outreachCount is incremented separately when the message is saved via
    // users.saveOutreachMessage, so we don't double-count here.
    if (planCheck.plan !== "free") {
      await incrementUsageInConvex(userId, "outreachWriter");
    }

    return NextResponse.json(
      {
        text,
        plan: planCheck.plan,
        used: planCheck.used + 1,
        limit: planCheck.limit,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("generate-outreach error", error);
    return NextResponse.json({ error: "Failed to generate outreach" }, { status: 500, headers: corsHeaders });
  }
}
