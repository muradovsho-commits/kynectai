import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE = "kynect_user_id";

const protectedPrefixes = ["/dashboard", "/onboarding"];
const authPaths = ["/signin", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPrefixes.some(
    (prefix) =>
      pathname === prefix || pathname.startsWith(`${prefix}/`),
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
  matcher: ["/dashboard/:path*", "/onboarding/:path*", "/signin", "/signup"],
};

