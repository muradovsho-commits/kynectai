import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserEmail } from "./_helpers";
import { requireUser } from "./auth";

// List all flashcard performance rows for a user. Returned as a record
// keyed by track, so the client can do `data[track]` directly.
export const listPerf = query({
  args: { userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()) },
  handler: async (ctx, { sessionToken, serverSecret, userId }) => {
    await requireUser({ userId, sessionToken, serverSecret });
    const rows = await ctx.db
      .query("flashPerf")
      .withIndex("by_user", q => q.eq("userId", userId))
      .collect();
    const result: Record<string, { data: string; updatedAt: number }> = {};
    for (const r of rows) {
      result[r.track] = { data: r.data, updatedAt: r.updatedAt };
    }
    return result;
  },
});

// Get a single track's perf row. Returns null if not yet created.
export const getPerf = query({
  args: { userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()), track: v.string() },
  handler: async (ctx, { sessionToken, serverSecret, userId, track }) => {
    await requireUser({ userId, sessionToken, serverSecret });
    const row = await ctx.db
      .query("flashPerf")
      .withIndex("by_user_track", q => q.eq("userId", userId).eq("track", track))
      .first();
    return row ? { data: row.data, updatedAt: row.updatedAt } : null;
  },
});

// Insert or update a track's perf row. Idempotent.
export const upsertPerf = mutation({
  args: {
    userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()),
    track: v.string(),
    data: v.string(),
  },
  handler: async (ctx, { sessionToken, serverSecret, userId, track, data }) => {
    await requireUser({ userId, sessionToken, serverSecret });
    const existing = await ctx.db
      .query("flashPerf")
      .withIndex("by_user_track", q => q.eq("userId", userId).eq("track", track))
      .first();
    const now = Date.now();
    const userEmail = await getUserEmail(ctx, userId);
    if (existing) {
      await ctx.db.patch(existing._id, { data, updatedAt: now, userEmail });
    } else {
      await ctx.db.insert("flashPerf", { userId, track, data, updatedAt: now, userEmail });
    }
  },
});

// Bulk import existing localStorage flash_perf data on first migration.
// Used by the one-time hydration path for users who predate the split.
export const importPerf = mutation({
  args: {
    userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()),
    entries: v.array(v.object({
      track: v.string(),
      data: v.string(),
    })),
  },
  handler: async (ctx, { sessionToken, serverSecret, userId, entries }) => {
    await requireUser({ userId, sessionToken, serverSecret });
    const now = Date.now();
    const userEmail = await getUserEmail(ctx, userId);
    for (const e of entries) {
      const existing = await ctx.db
        .query("flashPerf")
        .withIndex("by_user_track", q => q.eq("userId", userId).eq("track", e.track))
        .first();
      if (existing) {
        await ctx.db.patch(existing._id, { data: e.data, updatedAt: now, userEmail });
      } else {
        await ctx.db.insert("flashPerf", { userId, track: e.track, data: e.data, updatedAt: now, userEmail });
      }
    }
  },
});

// Clear a single track's perf row. Used by reset flows.
export const clearTrack = mutation({
  args: { userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()), track: v.string() },
  handler: async (ctx, { sessionToken, serverSecret, userId, track }) => {
    await requireUser({ userId, sessionToken, serverSecret });
    const existing = await ctx.db
      .query("flashPerf")
      .withIndex("by_user_track", q => q.eq("userId", userId).eq("track", track))
      .first();
    if (existing) await ctx.db.delete(existing._id);
  },
});
