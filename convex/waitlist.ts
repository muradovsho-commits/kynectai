import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addEmail = mutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const trimmed = email.trim().toLowerCase();
    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", trimmed))
      .first();
    if (existing) return { success: true, duplicate: true };
    await ctx.db.insert("waitlist", { email: trimmed, createdAt: Date.now() });
    return { success: true, duplicate: false };
  },
});

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("waitlist").order("desc").collect();
  },
});

export const getCount = query({
  handler: async (ctx) => {
    const all = await ctx.db.query("waitlist").collect();
    return all.length;
  },
});
