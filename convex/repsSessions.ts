import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserEmail } from "./_helpers";
import { requireUser } from "./auth";

// The Desk (Reps) session sync. One row per (userId, scenarioId). Mirrors the
// flashPerf pattern exactly so it shares the same proven auth and upsert shape.

// List all of a user's saved Desk sessions, keyed by scenarioId so the client
// can do `data[scenarioId]` directly.
export const listSessions = query({
  args: { userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()) },
  handler: async (ctx, { sessionToken, serverSecret, userId }) => {
    await requireUser({ userId, sessionToken, serverSecret });
    const rows = await ctx.db
      .query("repsSessions")
      .withIndex("by_user", q => q.eq("userId", userId))
      .collect();
    const result: Record<string, { data: string; updatedAt: number }> = {};
    for (const r of rows) {
      result[r.scenarioId] = { data: r.data, updatedAt: r.updatedAt };
    }
    return result;
  },
});

// Get a single scenario's session. Returns null if not yet created.
export const getSession = query({
  args: { userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()), scenarioId: v.string() },
  handler: async (ctx, { sessionToken, serverSecret, userId, scenarioId }) => {
    await requireUser({ userId, sessionToken, serverSecret });
    const row = await ctx.db
      .query("repsSessions")
      .withIndex("by_user_scenario", q => q.eq("userId", userId).eq("scenarioId", scenarioId))
      .first();
    return row ? { data: row.data, updatedAt: row.updatedAt } : null;
  },
});

// Insert or update a scenario's session. Idempotent.
export const upsertSession = mutation({
  args: {
    userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()),
    scenarioId: v.string(),
    data: v.string(),
  },
  handler: async (ctx, { sessionToken, serverSecret, userId, scenarioId, data }) => {
    await requireUser({ userId, sessionToken, serverSecret });
    const existing = await ctx.db
      .query("repsSessions")
      .withIndex("by_user_scenario", q => q.eq("userId", userId).eq("scenarioId", scenarioId))
      .first();
    const now = Date.now();
    const userEmail = await getUserEmail(ctx, userId);
    if (existing) {
      await ctx.db.patch(existing._id, { data, updatedAt: now, userEmail });
    } else {
      await ctx.db.insert("repsSessions", { userId, scenarioId, data, updatedAt: now, userEmail });
    }
  },
});

// Bulk import existing localStorage sessions on first migration, for users who
// predate the cloud sync. Only inserts scenarios not already present.
export const importSessions = mutation({
  args: {
    userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()),
    entries: v.array(v.object({
      scenarioId: v.string(),
      data: v.string(),
    })),
  },
  handler: async (ctx, { sessionToken, serverSecret, userId, entries }) => {
    await requireUser({ userId, sessionToken, serverSecret });
    const now = Date.now();
    const userEmail = await getUserEmail(ctx, userId);
    for (const e of entries) {
      const existing = await ctx.db
        .query("repsSessions")
        .withIndex("by_user_scenario", q => q.eq("userId", userId).eq("scenarioId", e.scenarioId))
        .first();
      if (existing) {
        await ctx.db.patch(existing._id, { data: e.data, updatedAt: now, userEmail });
      } else {
        await ctx.db.insert("repsSessions", { userId, scenarioId: e.scenarioId, data: e.data, updatedAt: now, userEmail });
      }
    }
  },
});

// Delete a scenario's session. Used by the reset flow.
export const deleteSession = mutation({
  args: { userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()), scenarioId: v.string() },
  handler: async (ctx, { sessionToken, serverSecret, userId, scenarioId }) => {
    await requireUser({ userId, sessionToken, serverSecret });
    const existing = await ctx.db
      .query("repsSessions")
      .withIndex("by_user_scenario", q => q.eq("userId", userId).eq("scenarioId", scenarioId))
      .first();
    if (existing) await ctx.db.delete(existing._id);
  },
});
