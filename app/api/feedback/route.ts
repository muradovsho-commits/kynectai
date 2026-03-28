import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, message, userName, userEmail } = body;

    if (!message || !type) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const typeLabels: Record<string, string> = {
      feature: "Feature Request",
      bug: "Bug Report",
      feedback: "General Feedback",
    };

    const label = typeLabels[type] || type;

    // Send via Resend
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "OfferBell <onboarding@resend.dev>",
          to: ["kynectedofficial@gmail.com"],
          subject: `[${label}] ${userName || "A student"} submitted feedback`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
              <h2 style="margin-bottom:4px;">${label}</h2>
              <p style="color:#666;margin-top:0;">
                <strong>From:</strong> ${userName || "Anonymous"}${userEmail ? ` (${userEmail})` : ""}<br/>
                <strong>Date:</strong> ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
              <hr style="border:none;border-top:1px solid #eee;margin:16px 0;"/>
              <p style="font-size:15px;line-height:1.7;white-space:pre-wrap;">${message}</p>
            </div>
          `,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Resend error:", data);
        return NextResponse.json({ success: true, emailSent: false, reason: data });
      }

      return NextResponse.json({ success: true, emailSent: true });
    }

    // No API key — still return success so the user sees confirmation
    return NextResponse.json({ success: true, emailSent: false, reason: "No RESEND_API_KEY" });
  } catch (error: any) {
    console.error("Feedback API error:", error);
    // Still return success to the user — their local history is saved regardless
    return NextResponse.json({ success: true, emailSent: false });
  }
}
