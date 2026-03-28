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

    // Try sending via Resend if API key exists
    if (process.env.RESEND_API_KEY) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "OfferBell Feedback <onboarding@resend.dev>",
            to: ["kynectedofficial@gmail.com"],
            subject: `[${typeLabels[type] || type}] New feedback from ${userName || "Anonymous"}`,
            html: `
              <h2>${typeLabels[type] || type}</h2>
              <p><strong>From:</strong> ${userName || "Anonymous"} ${userEmail ? `(${userEmail})` : ""}</p>
              <p><strong>Date:</strong> ${new Date().toISOString().slice(0, 10)}</p>
              <hr />
              <p>${message.replace(/\n/g, "<br/>")}</p>
            `,
          }),
        });
      } catch (emailErr) {
        console.error("Resend email failed:", emailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Feedback API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
