import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserEmail } from "./_helpers";
import { requireUser } from "./auth";

// Saved outreach drafts. One row per user holding saved_messages JSON.
// Same shape and auth as outreachTracker / referralNodes / drillHistory.

export const getSavedMessages = query({
  args: { userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()) },
  handler: async (ctx, { sessionToken, serverSecret, userId }) => {
    await requireUser({ userId, sessionToken, serverSecret });
    const row = await ctx.db
      .query("savedMessages")
      .withIndex("by_user", q => q.eq("userId", userId))
      .first();
    return row ? { data: row.data, updatedAt: row.updatedAt } : null;
  },
});

export const upsertSavedMessages = mutation({
  args: {
    userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()),
    data: v.string(),
    updatedAt: v.optional(v.number()), // client edit time, so two devices compare on one clock
  },
  handler: async (ctx, { sessionToken, serverSecret, userId, data, updatedAt }) => {
    await requireUser({ userId, sessionToken, serverSecret });
    const existing = await ctx.db
      .query("savedMessages")
      .withIndex("by_user", q => q.eq("userId", userId))
      .first();
    const now = updatedAt ?? Date.now();
    const userEmail = await getUserEmail(ctx, userId);
    if (existing) {
      // Monotonic guard: reject any write older than what is already stored, so a
      // stale device (e.g. one logging back in with an old local copy) can never
      // overwrite a newer cloud copy. The cloud only moves forward in time. This
      // is the server-side backstop that makes multi-device safe regardless of
      // client timing.
      if (typeof existing.updatedAt === "number" && now < existing.updatedAt) return;
      await ctx.db.patch(existing._id, { data, updatedAt: now, userEmail });
    } else {
      await ctx.db.insert("savedMessages", { userId, data, updatedAt: now, userEmail });
    }
  },
});
