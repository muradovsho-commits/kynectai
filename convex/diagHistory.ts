import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserEmail } from "./_helpers";
import { requireUser } from "./auth";

// List all diagnostic history entries for a user, newest first.
// Cap at 50 to match the client-side cap.
export const listHistory = query({
  args: { userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()) },
  handler: async (ctx, { sessionToken, serverSecret, userId }) => {
    await requireUser({ userId, sessionToken, serverSecret });
    const rows = await ctx.db
      .query("diagHistory")
      .withIndex("by_user", q => q.eq("userId", userId))
      .collect();
    return rows
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 50)
      .map(r => ({
        id: r.entryId,
        track: r.track,
        date: r.date,
        score: r.score,
        totalCorrect: r.totalCorrect,
        totalAnswered: r.totalAnswered,
        // catScores stored as JSON string to keep schema flexible.
        catScores: r.catScores,
        timestamp: r.timestamp,
      }));
  },
});

// Append a new diagnostic result. Idempotent by entryId.
export const appendResult = mutation({
  args: {
    userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()),
    entryId: v.string(),
    track: v.string(),
    date: v.string(),
    score: v.number(),
    totalCorrect: v.number(),
    totalAnswered: v.number(),
    catScores: v.string(),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    await requireUser(args);
    const { sessionToken: _st, serverSecret: _ss, ...clean } = args;
    const existing = await ctx.db
      .query("diagHistory")
      .withIndex("by_user_entry", q => q.eq("userId", args.userId).eq("entryId", args.entryId))
      .first();
    const userEmail = await getUserEmail(ctx, args.userId);
    if (existing) {
      await ctx.db.patch(existing._id, {
        track: args.track,
        date: args.date,
        score: args.score,
        totalCorrect: args.totalCorrect,
        totalAnswered: args.totalAnswered,
        catScores: args.catScores,
        timestamp: args.timestamp,
        userEmail,
      });
    } else {
      await ctx.db.insert("diagHistory", { ...clean, userEmail });
    }
  },
});

// One-time migration import for users whose history still lives only in
// localStorage. Skips entries already present (matched by entryId).
export const importHistory = mutation({
  args: {
    userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()),
    entries: v.array(v.object({
      entryId: v.string(),
      track: v.string(),
      date: v.string(),
      score: v.number(),
      totalCorrect: v.number(),
      totalAnswered: v.number(),
      catScores: v.string(),
      timestamp: v.number(),
    })),
  },
  handler: async (ctx, { sessionToken, serverSecret, userId, entries }) => {
    await requireUser({ userId, sessionToken, serverSecret });
    const userEmail = await getUserEmail(ctx, userId);
    for (const e of entries) {
      const existing = await ctx.db
        .query("diagHistory")
        .withIndex("by_user_entry", q => q.eq("userId", userId).eq("entryId", e.entryId))
        .first();
      if (existing) continue;
      await ctx.db.insert("diagHistory", { userId, ...e, userEmail });
    }
  },
});

// Clear all diagnostic history for a user. Used by the "reset all" flow.
export const clearAll = mutation({
  args: { userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()) },
  handler: async (ctx, { sessionToken, serverSecret, userId }) => {
    await requireUser({ userId, sessionToken, serverSecret });
    const rows = await ctx.db
      .query("diagHistory")
      .withIndex("by_user", q => q.eq("userId", userId))
      .collect();
    for (const r of rows) await ctx.db.delete(r._id);
  },
});

// Clear all diagnostic history entries for a specific track.
export const clearTrack = mutation({
  args: { userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()), track: v.string() },
  handler: async (ctx, { sessionToken, serverSecret, userId, track }) => {
    await requireUser({ userId, sessionToken, serverSecret });
    const rows = await ctx.db
      .query("diagHistory")
      .withIndex("by_user_track", q => q.eq("userId", userId).eq("track", track))
      .collect();
    for (const r of rows) await ctx.db.delete(r._id);
  },
});
