import { NextRequest, NextResponse } from "next/server";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, message, userName, userEmail, userId } = body;

    if (!message || !type) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Store in Convex database
    if (CONVEX_URL) {
      const convexApiUrl = CONVEX_URL.replace(/\.cloud$/, ".convex.cloud")
        .replace(/\/$/, "");
      
      const mutationUrl = `${convexApiUrl}/api/mutation`;

      await fetch(mutationUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: "feedback:submit",
          args: {
            userId: userId || undefined,
            userName: userName || undefined,
            userEmail: userEmail || undefined,
            type,
            message,
          },
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Feedback API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
