import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const submit = mutation({
  args: {
    userId: v.optional(v.string()),
    userName: v.optional(v.string()),
    userEmail: v.optional(v.string()),
    type: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("feedback", {
      userId: args.userId,
      userName: args.userName,
      userEmail: args.userEmail,
      type: args.type,
      message: args.message,
      createdAt: Date.now(),
    });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("feedback")
      .withIndex("by_createdAt")
      .order("desc")
      .take(100);
  },
});
