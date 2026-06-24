import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserEmail } from "./_helpers";
import { requireUser } from "./auth";

// Outreach tracker (contacts). One row per user holding the tracker_v3 JSON.
// Pulled out of the userProgress blob so tracker edits no longer round-trip the
// whole blob (bandwidth) and are no longer clobbered by other features. Same
// auth and upsert shape as flashPerf.

// Get the user's tracker row. Returns null if not yet created.
export const getTracker = query({
  args: { userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()) },
  handler: async (ctx, { sessionToken, serverSecret, userId }) => {
    await requireUser({ userId, sessionToken, serverSecret });
    const row = await ctx.db
      .query("outreachTracker")
      .withIndex("by_user", q => q.eq("userId", userId))
      .first();
    return row ? { data: row.data, updatedAt: row.updatedAt } : null;
  },
});

// Insert or update the user's tracker row. Idempotent.
export const upsertTracker = mutation({
  args: {
    userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()),
    data: v.string(),
    updatedAt: v.optional(v.number()), // client edit time, so two devices compare on one clock
  },
  handler: async (ctx, { sessionToken, serverSecret, userId, data, updatedAt }) => {
    await requireUser({ userId, sessionToken, serverSecret });
    const existing = await ctx.db
      .query("outreachTracker")
      .withIndex("by_user", q => q.eq("userId", userId))
      .first();
    const now = updatedAt ?? Date.now();
    const userEmail = await getUserEmail(ctx, userId);
    if (existing) {
      await ctx.db.patch(existing._id, { data, updatedAt: now, userEmail });
    } else {
      await ctx.db.insert("outreachTracker", { userId, data, updatedAt: now, userEmail });
    }
  },
});
