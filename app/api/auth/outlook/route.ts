import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.cookies.get("offerbell_user_id")?.value;
  if (!userId) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  const clientId = process.env.OUTLOOK_CLIENT_ID;
  if (!clientId) {
    return NextResponse.redirect(new URL("/outreach-tracker?error=outlook_not_configured", req.url));
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${appUrl}/api/auth/outlook/callback`,
    response_type: "code",
    scope: "https://graph.microsoft.com/Mail.Read https://graph.microsoft.com/Calendars.Read https://graph.microsoft.com/User.Read offline_access",
    response_mode: "query",
    state: userId,
  });

  return NextResponse.redirect(
    `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params.toString()}`
  );
}
