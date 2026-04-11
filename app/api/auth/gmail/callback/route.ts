import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const userId = req.nextUrl.searchParams.get("state");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;

  if (!code || !userId) {
    return NextResponse.redirect(new URL("/outreach-tracker?error=missing_params", req.url));
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${appUrl}/api/auth/gmail/callback`,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      console.error("Token exchange failed:", await tokenRes.text());
      return NextResponse.redirect(new URL("/outreach-tracker?error=token_exchange", req.url));
    }

    const tokens = await tokenRes.json();

    // Get user email from Google
    const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const profile = await profileRes.json();

    // Store in Convex via HTTP API
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (convexUrl) {
      // Use the Convex HTTP action endpoint
      const mutationUrl = convexUrl.replace(".cloud", ".site") + "/api/mutation";
      // Since we can't easily call Convex mutations from server-side without the client,
      // we store tokens in a cookie and handle storage client-side
    }

    // Set a temporary cookie with the connection data for client-side processing
    const connData = JSON.stringify({
      provider: "gmail",
      providerEmail: profile.email,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || "",
      tokenExpiresAt: Date.now() + (tokens.expires_in || 3600) * 1000,
    });

    const response = NextResponse.redirect(new URL("/outreach-tracker?synced=gmail", req.url));
    response.cookies.set("offerbell_email_connect", connData, {
      path: "/",
      maxAge: 120, // 2 minutes, just enough for client to read and clear
      httpOnly: false,
    });

    return response;
  } catch (error) {
    console.error("Gmail OAuth error:", error);
    return NextResponse.redirect(new URL("/outreach-tracker?error=oauth_failed", req.url));
  }
}
