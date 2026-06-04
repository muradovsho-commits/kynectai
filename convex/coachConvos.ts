import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserEmail } from "./_helpers";
import { requireUser } from "./auth";

// List all coach conversations for a user. Capped at 50 newest by the
// client, but query returns everything; client sorts/caps.
export const listConvos = query({
  args: { userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()) },
  handler: async (ctx, { sessionToken, serverSecret, userId }) => {
    await requireUser({ userId, sessionToken, serverSecret });
    const rows = await ctx.db
      .query("coachConvos")
      .withIndex("by_user", q => q.eq("userId", userId))
      .collect();
    return rows.sort((a, b) => b.updatedAt - a.updatedAt).map(r => ({
      id: r.convoId,
      track: r.track,
      feature: r.feature ?? null,
      preview: r.preview,
      messages: r.messages,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  },
});

// Insert or update a single conversation by convoId. Idempotent.
export const upsertConvo = mutation({
  args: {
    userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()),
    convoId: v.string(),
    track: v.string(),
    feature: v.optional(v.string()),
    preview: v.string(),
    messages: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    await requireUser(args);
    const { sessionToken: _st, serverSecret: _ss, ...clean } = args;
    const existing = await ctx.db
      .query("coachConvos")
      .withIndex("by_user_convo", q => q.eq("userId", args.userId).eq("convoId", args.convoId))
      .first();
    const userEmail = await getUserEmail(ctx, args.userId);
    if (existing) {
      await ctx.db.patch(existing._id, {
        track: args.track,
        feature: args.feature,
        preview: args.preview,
        messages: args.messages,
        updatedAt: args.updatedAt,
        userEmail,
      });
    } else {
      await ctx.db.insert("coachConvos", { ...clean, userEmail });
    }
  },
});

// Delete a single conversation.
export const deleteConvo = mutation({
  args: { userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()), convoId: v.string() },
  handler: async (ctx, { sessionToken, serverSecret, userId, convoId }) => {
    await requireUser({ userId, sessionToken, serverSecret });
    const existing = await ctx.db
      .query("coachConvos")
      .withIndex("by_user_convo", q => q.eq("userId", userId).eq("convoId", convoId))
      .first();
    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

// Bulk import for one-time migration of existing localStorage data.
// Skips any convoId that already exists; safe to call repeatedly.
export const importConvos = mutation({
  args: {
    userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()),
    convos: v.array(v.object({
      convoId: v.string(),
      track: v.string(),
      feature: v.optional(v.string()),
      preview: v.string(),
      messages: v.string(),
      createdAt: v.number(),
      updatedAt: v.number(),
    })),
  },
  handler: async (ctx, { sessionToken, serverSecret, userId, convos }) => {
    await requireUser({ userId, sessionToken, serverSecret });
    const userEmail = await getUserEmail(ctx, userId);
    for (const c of convos) {
      const existing = await ctx.db
        .query("coachConvos")
        .withIndex("by_user_convo", q => q.eq("userId", userId).eq("convoId", c.convoId))
        .first();
      if (!existing) {
        await ctx.db.insert("coachConvos", { userId, ...c, userEmail });
      }
    }
  },
});

// Dashboard-only lightweight query. Returns just count + thisWeek count.
// No messages JSON, no duration data (we don't track coach session length).
// Per-page bandwidth: ~0.2KB.
export const getCoachStats = query({
  args: { userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()) },
  handler: async (ctx, { sessionToken, serverSecret, userId }) => {
    await requireUser({ userId, sessionToken, serverSecret });
    const rows = await ctx.db
      .query("coachConvos")
      .withIndex("by_user", q => q.eq("userId", userId))
      .collect();
    const count = rows.length;
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const thisWeek = rows.filter(r => r.updatedAt >= sevenDaysAgo).length;
    return { count, thisWeek };
  },
});
