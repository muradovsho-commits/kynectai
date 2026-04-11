import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE = "offerbell_user_id";

// Pages that require authentication
const protectedPrefixes = [
  "/dashboard",
  "/onboarding",
  "/profile",
  "/coach",
  "/flashcards",
  "/concept-drills",
  "/diagnostic-review",
  "/resume-review",
  "/hit-rate-intel",
  "/outreach-writer",
  "/outreach-tracker",
  "/contact-finder",
  "/add-contact",
  "/my-account",
  "/feedback",
  "/game-mode",
];

const authPaths = ["/signin", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const isAuthPath = authPaths.includes(pathname);

  const hasAuthCookie = Boolean(request.cookies.get(AUTH_COOKIE)?.value);

  if (isProtected && !hasAuthCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  if (isAuthPath && hasAuthCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/profile/:path*",
    "/coach/:path*",
    "/flashcards/:path*",
    "/concept-drills/:path*",
    "/diagnostic-review/:path*",
    "/resume-review/:path*",
    "/hit-rate-intel/:path*",
    "/outreach-writer/:path*",
    "/outreach-tracker/:path*",
    "/contact-finder/:path*",
    "/add-contact/:path*",
    "/my-account/:path*",
    "/feedback/:path*",
    "/game-mode/:path*",
    "/signin",
    "/signup",
  ],
};
