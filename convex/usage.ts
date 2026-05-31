import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserEmail } from "./_helpers";

// ═══════════════════════════════════════════════════════════════
// SERVER-SIDE PLAN ENFORCEMENT
// ═══════════════════════════════════════════════════════════════
// Source of truth for weekly usage of paid features. Replaces the old
// client-only localStorage counters which any user could clear to bypass.
//
// Features tracked: coach, resumeReview, outreachWriter, mockInterview.
// outreachWriter on the free plan is enforced via users.outreachCount
// (lifetime) instead - see the API route logic.

const VALID_FEATURES = ["coach", "resumeReview", "outreachWriter", "mockInterview"] as const;
type Feature = (typeof VALID_FEATURES)[number];

// ISO date string for Monday of the current week, UTC.
// Matches the format used by app/lib/plan.ts getWeekStart, but in UTC
// to avoid timezone drift between client and server.
function getWeekStart(): string {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = day === 0 ? 6 : day - 1;
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() - diff);
  monday.setUTCHours(0, 0, 0, 0);
  return monday.toISOString().split("T")[0];
}

// Read-only: returns this week's counters for the user. Zeros if no row.
export const getUsage = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const weekStart = getWeekStart();
    const row = await ctx.db
      .query("weeklyUsage")
      .withIndex("by_user_week", (q) => q.eq("userId", args.userId).eq("weekStart", weekStart))
      .unique();
    return {
      weekStart,
      coach: row?.coach ?? 0,
      resumeReview: row?.resumeReview ?? 0,
      outreachWriter: row?.outreachWriter ?? 0,
      mockInterview: row?.mockInterview ?? 0,
    };
  },
});

// Mutation: atomically increment a single counter by 1. Returns new count.
// Called by an API route AFTER a successful Gemini call (or other paid op),
// not before - so a failed/timed-out backend call doesn't burn the user's
// weekly quota.
export const incrementUsage = mutation({
  args: {
    userId: v.string(),
    feature: v.string(),
  },
  handler: async (ctx, args) => {
    if (!(VALID_FEATURES as readonly string[]).includes(args.feature)) {
      throw new Error(`Invalid feature: ${args.feature}`);
    }
    const feature = args.feature as Feature;
    const weekStart = getWeekStart();

    const existing = await ctx.db
      .query("weeklyUsage")
      .withIndex("by_user_week", (q) => q.eq("userId", args.userId).eq("weekStart", weekStart))
      .unique();

    const userEmail = await getUserEmail(ctx, args.userId);
    if (existing) {
      const current = (existing as any)[feature] || 0;
      await ctx.db.patch(existing._id, {
        [feature]: current + 1,
        updatedAt: Date.now(),
        userEmail,
      } as any);
      return current + 1;
    } else {
      const insert: any = {
        userId: args.userId,
        userEmail,
        weekStart,
        updatedAt: Date.now(),
      };
      insert[feature] = 1;
      await ctx.db.insert("weeklyUsage", insert);
      return 1;
    }
  },
});
