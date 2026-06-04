import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import { getAuthUserId, unauthorizedResponse, getCorsHeaders } from "../_lib/auth";
import { checkPlanLimit } from "../_lib/plan";

export const dynamic = "force-dynamic";

// Returns the signed-in user's profile + outreach usage so the browser
// extension can prefill "About You" and show remaining credits, matching the
// site. Auth is the same as every other route (cookie or Bearer userId).
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(req) });
}

export async function GET(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  const userId = getAuthUserId(req);
  if (!userId) return unauthorizedResponse(corsHeaders);

  let plan: "free" | "pro" | "elite" = "free";
  let profile = { name: "", school: "", year: "", targetRole: "" };

  try {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (url) {
      const convex = new ConvexHttpClient(url);
      const u: any = await convex.query((api as any).users.getUser, {
        userId,
        serverSecret: process.env.AUTH_SESSION_SECRET,
      });
      if (u && u.found) {
        const fullName = ((u.firstName || "") + " " + (u.lastName || "")).trim();
        profile = {
          name: fullName || u.name || "",
          school: u.university || "",
          year: u.graduationYear || u.recruitYear || "",
          targetRole: (Array.isArray(u.targetRoles) && u.targetRoles[0]) || "",
        };
        if (u.plan === "pro" || u.plan === "elite") plan = u.plan;
      }
    }
  } catch (e) {
    // Profile is best-effort; fall through with blanks.
  }

  let outreach = { used: 0, limit: 5 };
  try {
    const check = await checkPlanLimit(userId, "outreachWriter", corsHeaders);
    outreach = { used: check.used, limit: check.limit };
    plan = check.plan;
  } catch (e) {
    // Keep the default if the check fails.
  }

  return NextResponse.json({ plan, profile, outreach }, { headers: corsHeaders });
}
