import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId, unauthorizedResponse } from "../../_lib/auth";

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const userId = getAuthUserId(req);
    if (!userId) return unauthorizedResponse({});

    const { accessToken } = await req.json();
    if (!accessToken) {
      return NextResponse.json({ error: "No access token" }, { status: 400 });
    }

    // Fetch recent sent + received emails (last 30 days)
    const sinceEpoch = Math.floor((Date.now() - 30 * 86400000) / 1000);
    const query = `after:${sinceEpoch}`;
    const listRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=30`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (listRes.status === 401) {
      return NextResponse.json({ error: "token_expired" }, { status: 401 });
    }
    if (!listRes.ok) {
      return NextResponse.json({ error: "Gmail API error: " + listRes.status }, { status: 500 });
    }

    const listData = await listRes.json();
    if (!listData.messages || listData.messages.length === 0) {
      return NextResponse.json({ emails: [] });
    }

    // Get user's own email for direction detection
    const profileRes = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/profile",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const profile = profileRes.ok ? await profileRes.json() : { emailAddress: "" };
    const myEmail = (profile.emailAddress || "").toLowerCase();

    // Fetch details for each message
    const emails = [];
    for (const msg of listData.messages.slice(0, 30)) {
      try {
        const detail = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Subject`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (!detail.ok) continue;
        const d = await detail.json();

        const headers = d.payload?.headers || [];
        const from = headers.find((h: any) => h.name.toLowerCase() === "from")?.value || "";
        const to = headers.find((h: any) => h.name.toLowerCase() === "to")?.value || "";
        const subject = headers.find((h: any) => h.name.toLowerCase() === "subject")?.value || "";

        const fromLower = from.toLowerCase();
        const direction = fromLower.includes(myEmail) ? "sent" : "received";

        emails.push({
          id: d.id,
          threadId: d.threadId,
          from,
          to,
          subject,
          snippet: d.snippet || "",
          sentAt: parseInt(d.internalDate, 10),
          direction,
        });
      } catch {
        continue;
      }
    }

    return NextResponse.json({ emails, myEmail });
  } catch (error: any) {
    console.error("Sync error:", error);
    return NextResponse.json({ error: error.message || "Sync failed" }, { status: 500 });
  }
}
