import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserEmail } from "./_helpers";
import { Id } from "./_generated/dataModel";

// ═══════════════════════════════════════════════════════════════
// CONTACT DATABASE - UNLOCK CREDITS
// ═══════════════════════════════════════════════════════════════
// Source of truth for how many contacts a user may reveal.
//
//   free   3 lifetime
//   pro    50 per week
//   elite  200 per week
//
// The limits live HERE rather than in app/lib/plan.ts because this file is
// the enforcement point. A Convex mutation is callable from a browser, so a
// limit passed in as an argument would be a limit the caller could rewrite.
// app/lib/plan.ts carries the same numbers for display only; if these change,
// change both.
//
// Counting reads the contactUnlocks table directly instead of a weeklyUsage
// counter, so the meter and the permanence record can never disagree.

const LIMITS = {
  free: 3,
  pro: 50,
  elite: 200,
} as const;

// Free is a lifetime allowance; paid plans reset weekly.
const IS_LIFETIME = { free: true, pro: false, elite: false } as const;

type Plan = keyof typeof LIMITS;

// Monday of the current week, UTC. Matches convex/usage.ts getWeekStart.
function getWeekStart(): string {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = day === 0 ? 6 : day - 1;
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() - diff);
  monday.setUTCHours(0, 0, 0, 0);
  return monday.toISOString().split("T")[0];
}

async function planOf(ctx: any, userId: string): Promise<Plan> {
  try {
    const user = await ctx.db.get(userId as Id<"users">);
    if (!user) return "free";
    if (user.plan === "elite" || user.plan === "pro") return user.plan;
    return "free";
  } catch {
    return "free";
  }
}

async function countUsed(ctx: any, userId: string, plan: Plan): Promise<number> {
  if (IS_LIFETIME[plan]) {
    const all = await ctx.db
      .query("contactUnlocks")
      .withIndex("by_user", (q: any) => q.eq("userId", userId))
      .collect();
    return all.length;
  }
  const week = await ctx.db
    .query("contactUnlocks")
    .withIndex("by_user_week", (q: any) => q.eq("userId", userId).eq("weekStart", getWeekStart()))
    .collect();
  return week.length;
}

// Read-only. Everything the panel needs to render the meter, plus the ids the
// user has already paid for so their details can be re-served for free.
export const getStatus = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    if (!args.userId) {
      return { plan: "free", used: 0, limit: LIMITS.free, lifetime: true, unlockedIds: [] as string[] };
    }
    const plan = await planOf(ctx, args.userId);
    const rows = await ctx.db
      .query("contactUnlocks")
      .withIndex("by_user", (q: any) => q.eq("userId", args.userId))
      .collect();
    const used = IS_LIFETIME[plan]
      ? rows.length
      : rows.filter((r: any) => r.weekStart === getWeekStart()).length;
    return {
      plan,
      used,
      limit: LIMITS[plan],
      lifetime: IS_LIFETIME[plan],
      unlockedIds: rows.map((r: any) => r.contactId),
    };
  },
});

// Spend one credit on a contact. Idempotent per (user, contact): a contact
// already unlocked returns allowed with already=true and spends nothing.
//
// Called only by app/api/contact-unlock. That route holds the private rows
// and will not release them unless this returns allowed.
export const unlock = mutation({
  args: { userId: v.string(), contactId: v.string() },
  handler: async (ctx, args) => {
    if (!args.userId || !args.contactId) {
      return { allowed: false, reason: "bad_request", plan: "free", used: 0, limit: 0, already: false };
    }

    const plan = await planOf(ctx, args.userId);
    const limit = LIMITS[plan];

    const existing = await ctx.db
      .query("contactUnlocks")
      .withIndex("by_user_contact", (q: any) =>
        q.eq("userId", args.userId).eq("contactId", args.contactId)
      )
      .unique();

    if (existing) {
      const used = await countUsed(ctx, args.userId, plan);
      return { allowed: true, already: true, plan, used, limit, lifetime: IS_LIFETIME[plan] };
    }

    const used = await countUsed(ctx, args.userId, plan);
    if (used >= limit) {
      return { allowed: false, reason: "limit_reached", already: false, plan, used, limit, lifetime: IS_LIFETIME[plan] };
    }

    await ctx.db.insert("contactUnlocks", {
      userId: args.userId,
      userEmail: await getUserEmail(ctx, args.userId),
      contactId: args.contactId,
      weekStart: getWeekStart(),
      unlockedAt: Date.now(),
    });

    return { allowed: true, already: false, plan, used: used + 1, limit, lifetime: IS_LIFETIME[plan] };
  },
});
