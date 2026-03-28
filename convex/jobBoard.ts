import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const subscribe = mutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const trimmed = email.trim().toLowerCase();
    const existing = await ctx.db
      .query("jobBoardSubscribers")
      .withIndex("by_email", (q) => q.eq("email", trimmed))
      .first();
    if (existing) {
      // Reactivate if previously unsubscribed
      if (existing.active === false) {
        await ctx.db.patch(existing._id, { active: true });
        return { success: true, reactivated: true };
      }
      return { success: true, duplicate: true };
    }
    await ctx.db.insert("jobBoardSubscribers", {
      email: trimmed,
      createdAt: Date.now(),
      active: true,
    });
    return { success: true, duplicate: false };
  },
});

export const unsubscribe = mutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const trimmed = email.trim().toLowerCase();
    const existing = await ctx.db
      .query("jobBoardSubscribers")
      .withIndex("by_email", (q) => q.eq("email", trimmed))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { active: false });
      return { success: true };
    }
    return { success: false, error: "Not found" };
  },
});

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("jobBoardSubscribers").order("desc").collect();
  },
});

export const getActiveCount = query({
  handler: async (ctx) => {
    const all = await ctx.db.query("jobBoardSubscribers").collect();
    return all.filter((s) => s.active !== false).length;
  },
});
