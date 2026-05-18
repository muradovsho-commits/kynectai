import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Truncates an array stored as a JSON string to max N elements.
// Returns the (possibly truncated) JSON string. Safe on bad JSON.
function capArrayJSON(raw: unknown, max: number): unknown {
  if (typeof raw !== "string") return raw;
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr) || arr.length <= max) return raw;
    return JSON.stringify(arr.slice(0, max));
  } catch {
    return raw;
  }
}

// Save all user progress as a single JSON blob.
//
// SECURITY: enforces free-tier caps server-side for keys whose limits live in
// PLAN_LIMITS. The client UI also enforces these, but a tampered client could
// send a payload that exceeds caps. We truncate here so the cloud copy can
// never exceed the free-tier limit for a free user, regardless of what the
// client sends. Plan is read from the users table where the Stripe webhook
// is the source of truth.
export const saveProgress = mutation({
  args: {
    userId: v.string(),
    data: v.string(), // JSON string of all localStorage keys
  },
  handler: async (ctx, args) => {
    // Look up plan from the users table. We try both shapes of userId since
    // some callers pass a Convex _id and others pass a custom string id.
    // Default to 'free' if not found - safer default (caps stay enforced).
    let plan: string = "free";
    try {
      const u: any = await ctx.db.get(args.userId as any);
      if (u && u.plan) plan = u.plan;
    } catch {}

    const isPaid = plan === "pro" || plan === "elite";

    // Parse the incoming payload so we can apply caps before merging.
    let newData: Record<string, any> = {};
    try { newData = JSON.parse(args.data); } catch {}

    // Free-tier contact caps (must match PLAN_LIMITS in app/lib/plan.ts).
    // Outreach Tracker: 5 contacts. Referral Map: 5 contacts.
    if (!isPaid) {
      if ("offerbell_tracker_v3" in newData) {
        newData["offerbell_tracker_v3"] = capArrayJSON(newData["offerbell_tracker_v3"], 5);
      }
      if ("offerbell_referral_nodes_v3" in newData) {
        newData["offerbell_referral_nodes_v3"] = capArrayJSON(newData["offerbell_referral_nodes_v3"], 5);
      }
    }

    const existing = await ctx.db
      .query("userProgress")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      // Merge: parse old, spread new (capped) over old so we don't lose keys.
      let oldData: Record<string, any> = {};
      try { oldData = JSON.parse(existing.data); } catch {}
      const merged = { ...oldData, ...newData };

      // Defensive: if a free user's cloud blob already exceeds the cap (from
      // before this gate was added, or via a race), truncate the merged
      // result too. Idempotent and cheap.
      if (!isPaid) {
        if ("offerbell_tracker_v3" in merged) {
          merged["offerbell_tracker_v3"] = capArrayJSON(merged["offerbell_tracker_v3"], 5);
        }
        if ("offerbell_referral_nodes_v3" in merged) {
          merged["offerbell_referral_nodes_v3"] = capArrayJSON(merged["offerbell_referral_nodes_v3"], 5);
        }
      }

      await ctx.db.patch(existing._id, {
        data: JSON.stringify(merged),
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("userProgress", {
        userId: args.userId,
        data: JSON.stringify(newData),
        updatedAt: Date.now(),
      });
    }
    return { success: true };
  },
});

// Load all user progress
export const loadProgress = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("userProgress")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!record) return null;
    return { data: record.data, updatedAt: record.updatedAt };
  },
});
