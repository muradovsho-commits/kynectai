import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserEmail } from "./_helpers";
import { requireUser } from "./auth";

// List all resume chat threads for a user. Returns one entry per review.
// The client hydrates these into its per-review localStorage cache on load.
export const listChats = query({
  args: { userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()) },
  handler: async (ctx, { sessionToken, serverSecret, userId }) => {
    await requireUser({ userId, sessionToken, serverSecret });
    const rows = await ctx.db
      .query("resumeChats")
      .withIndex("by_user", q => q.eq("userId", userId))
      .collect();
    return rows.map(r => ({ reviewId: r.reviewId, messages: r.messages, updatedAt: r.updatedAt }));
  },
});

// Insert or update a single review's thread by reviewId. Idempotent.
export const upsertChat = mutation({
  args: {
    userId: v.string(),
    sessionToken: v.optional(v.string()),
    serverSecret: v.optional(v.string()),
    reviewId: v.string(),
    messages: v.string(),
  },
  handler: async (ctx, args) => {
    await requireUser(args);
    const existing = await ctx.db
      .query("resumeChats")
      .withIndex("by_user_review", q => q.eq("userId", args.userId).eq("reviewId", args.reviewId))
      .first();
    const userEmail = await getUserEmail(ctx, args.userId);
    if (existing) {
      await ctx.db.patch(existing._id, { messages: args.messages, updatedAt: Date.now(), userEmail });
    } else {
      await ctx.db.insert("resumeChats", {
        userId: args.userId,
        reviewId: args.reviewId,
        messages: args.messages,
        updatedAt: Date.now(),
        userEmail,
      });
    }
  },
});

// Delete a single review's thread (called when the review is deleted).
export const deleteChat = mutation({
  args: { userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()), reviewId: v.string() },
  handler: async (ctx, { sessionToken, serverSecret, userId, reviewId }) => {
    await requireUser({ userId, sessionToken, serverSecret });
    const existing = await ctx.db
      .query("resumeChats")
      .withIndex("by_user_review", q => q.eq("userId", userId).eq("reviewId", reviewId))
      .first();
    if (existing) await ctx.db.delete(existing._id);
  },
});
