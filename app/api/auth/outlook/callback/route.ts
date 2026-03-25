import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const userId = req.nextUrl.searchParams.get("state");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;

  if (!code || !userId) {
    return NextResponse.redirect(new URL("/outreach-tracker?error=missing_params", req.url));
  }

  try {
    const tokenRes = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.OUTLOOK_CLIENT_ID!,
        client_secret: process.env.OUTLOOK_CLIENT_SECRET!,
        redirect_uri: `${appUrl}/api/auth/outlook/callback`,
        grant_type: "authorization_code",
        scope: "https://graph.microsoft.com/Mail.Read https://graph.microsoft.com/Calendars.Read https://graph.microsoft.com/User.Read offline_access",
      }),
    });

    if (!tokenRes.ok) {
      console.error("Outlook token exchange failed:", await tokenRes.text());
      return NextResponse.redirect(new URL("/outreach-tracker?error=token_exchange", req.url));
    }

    const tokens = await tokenRes.json();

    // Get user email
    const profileRes = await fetch("https://graph.microsoft.com/v1.0/me", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const profile = await profileRes.json();

    const connData = JSON.stringify({
      provider: "outlook",
      providerEmail: profile.mail || profile.userPrincipalName || "",
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || "",
      tokenExpiresAt: Date.now() + (tokens.expires_in || 3600) * 1000,
    });

    const response = NextResponse.redirect(new URL("/outreach-tracker?synced=outlook", req.url));
    response.cookies.set("offerbell_email_connect", connData, {
      path: "/",
      maxAge: 120,
      httpOnly: false,
    });

    return response;
  } catch (error) {
    console.error("Outlook OAuth error:", error);
    return NextResponse.redirect(new URL("/outreach-tracker?error=oauth_failed", req.url));
  }
}
