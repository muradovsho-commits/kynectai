import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// List all flashcard performance rows for a user. Returned as a record
// keyed by track, so the client can do `data[track]` directly.
export const listPerf = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
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
  args: { userId: v.string(), track: v.string() },
  handler: async (ctx, { userId, track }) => {
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
    userId: v.string(),
    track: v.string(),
    data: v.string(),
  },
  handler: async (ctx, { userId, track, data }) => {
    const existing = await ctx.db
      .query("flashPerf")
      .withIndex("by_user_track", q => q.eq("userId", userId).eq("track", track))
      .first();
    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, { data, updatedAt: now });
    } else {
      await ctx.db.insert("flashPerf", { userId, track, data, updatedAt: now });
    }
  },
});

// Bulk import existing localStorage flash_perf data on first migration.
// Used by the one-time hydration path for users who predate the split.
export const importPerf = mutation({
  args: {
    userId: v.string(),
    entries: v.array(v.object({
      track: v.string(),
      data: v.string(),
    })),
  },
  handler: async (ctx, { userId, entries }) => {
    const now = Date.now();
    for (const e of entries) {
      const existing = await ctx.db
        .query("flashPerf")
        .withIndex("by_user_track", q => q.eq("userId", userId).eq("track", e.track))
        .first();
      if (existing) {
        await ctx.db.patch(existing._id, { data: e.data, updatedAt: now });
      } else {
        await ctx.db.insert("flashPerf", { userId, track: e.track, data: e.data, updatedAt: now });
      }
    }
  },
});

// Clear a single track's perf row. Used by reset flows.
export const clearTrack = mutation({
  args: { userId: v.string(), track: v.string() },
  handler: async (ctx, { userId, track }) => {
    const existing = await ctx.db
      .query("flashPerf")
      .withIndex("by_user_track", q => q.eq("userId", userId).eq("track", track))
      .first();
    if (existing) await ctx.db.delete(existing._id);
  },
});
