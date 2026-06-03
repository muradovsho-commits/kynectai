import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

// ═══════════════════════════════════════════════════════════════
// SERVER-SIDE PLAN GATE
// ═══════════════════════════════════════════════════════════════
// Single source of truth: Convex. The client cannot send its plan or
// usage in the request body and have the server trust it. Every paid
// route calls checkPlanLimit at the top, then incrementUsage after a
// successful response.

export type PlanFeature = "coach" | "resumeReview" | "outreachWriter" | "mockInterview";

// Mirror of app/lib/plan.ts PLAN_LIMITS, server-side. Kept literal so a
// client tampering with the bundled JS can't change limits.
const LIMITS: Record<PlanFeature, { free: number; pro: number; elite: number }> = {
  coach:          { free: 1,  pro: 40,  elite: 80  },
  resumeReview:   { free: 1,  pro: 10,  elite: 30  },
  outreachWriter: { free: 5,  pro: 20,  elite: 30  }, // free = lifetime, paid = weekly
  mockInterview:  { free: 3,  pro: 999, elite: 999 },
};

export interface PlanCheckResult {
  allowed: boolean;
  plan: "free" | "pro" | "elite";
  used: number;
  limit: number;
  // If !allowed, a ready-to-return 429 response. Routes just return this.
  denied?: NextResponse;
}

function getConvex() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) throw new Error("NEXT_PUBLIC_CONVEX_URL not configured");
  return new ConvexHttpClient(url);
}

// Fetches plan from Convex (NOT from the request body - that's untrusted).
// Returns the plan tier, defaulting to 'free' if user not found or no plan set.
export async function getPlanFromConvex(userId: string): Promise<"free" | "pro" | "elite"> {
  const convex = getConvex();
  const u: any = await convex.query((api as any).users.getUser, { userId, serverSecret: process.env.AUTH_SESSION_SECRET });
  if (!u || !u.found) return "free";
  const plan = u.plan;
  if (plan === "elite" || plan === "pro") return plan;
  return "free";
}

// Pre-call gate. Returns an object with `denied` set to a ready 429 if the
// user is over their cap; otherwise `allowed: true` and the route should
// proceed and call incrementUsageInConvex after success.
export async function checkPlanLimit(
  userId: string,
  feature: PlanFeature,
  corsHeaders: Record<string, string>
): Promise<PlanCheckResult> {
  const convex = getConvex();
  const userRow: any = await convex.query((api as any).users.getUser, { userId, serverSecret: process.env.AUTH_SESSION_SECRET });
  const plan: "free" | "pro" | "elite" =
    userRow?.found && (userRow.plan === "elite" || userRow.plan === "pro") ? userRow.plan : "free";

  const limit = LIMITS[feature][plan];

  // outreachWriter on free plan = LIFETIME cap, tracked via users.outreachCount
  // (already exists in the schema, incremented by saveOutreachMessage).
  if (feature === "outreachWriter" && plan === "free") {
    const used = userRow?.messagesUsed ?? 0;
    if (used >= limit) {
      return {
        allowed: false,
        plan,
        used,
        limit,
        denied: NextResponse.json(
          {
            error: "limit_reached",
            message: `You've used all ${limit} free messages. Upgrade to Pro for ${LIMITS.outreachWriter.pro}/week.`,
            plan,
            used,
            limit,
          },
          { status: 429, headers: corsHeaders }
        ),
      };
    }
    return { allowed: true, plan, used, limit };
  }

  // All other gated features = WEEKLY cap, tracked in weeklyUsage table
  const usage: any = await convex.query((api as any).usage.getUsage, { userId });
  const used = usage[feature] ?? 0;

  if (used >= limit) {
    const featureLabel = featureDisplayName(feature);
    const nextTier = plan === "free" ? "Pro" : plan === "pro" ? "Elite" : null;
    const message = nextTier
      ? `You've hit your ${plan} plan limit of ${limit} ${featureLabel} ${plan === "free" ? "uses" : "uses per week"}. Upgrade to ${nextTier} for more.`
      : `You've hit your weekly Elite limit of ${limit} ${featureLabel} uses. Resets Monday.`;
    return {
      allowed: false,
      plan,
      used,
      limit,
      denied: NextResponse.json(
        { error: "limit_reached", message, plan, used, limit },
        { status: 429, headers: corsHeaders }
      ),
    };
  }
  return { allowed: true, plan, used, limit };
}

// Called AFTER a successful API response. Failure to increment is logged
// but not surfaced to the user (better to under-count than to fail their
// request after the AI work is done).
export async function incrementUsageInConvex(userId: string, feature: PlanFeature): Promise<void> {
  try {
    const convex = getConvex();
    await convex.mutation((api as any).usage.incrementUsage, { userId, feature });
  } catch (err) {
    console.error(`incrementUsage failed for ${userId} / ${feature}:`, err);
  }
}

function featureDisplayName(feature: PlanFeature): string {
  switch (feature) {
    case "coach": return "Coach";
    case "resumeReview": return "Resume Review";
    case "outreachWriter": return "Outreach";
    case "mockInterview": return "Mock Interview";
  }
}
