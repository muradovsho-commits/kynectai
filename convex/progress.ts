import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Save all user progress as a single JSON blob
export const saveProgress = mutation({
  args: {
    userId: v.string(),
    data: v.string(), // JSON string of all localStorage keys
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userProgress")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      // Merge: parse both, spread new over old so we don't lose keys
      let oldData: Record<string, any> = {};
      let newData: Record<string, any> = {};
      try { oldData = JSON.parse(existing.data); } catch {}
      try { newData = JSON.parse(args.data); } catch {}
      const merged = { ...oldData, ...newData };
      await ctx.db.patch(existing._id, {
        data: JSON.stringify(merged),
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("userProgress", {
        userId: args.userId,
        data: args.data,
        updatedAt: Date.now(),
      });
    }
    return { success: true };
  },
});

// Load all user progress
export const loadProgress = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("userProgress")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!record) return null;
    return { data: record.data, updatedAt: record.updatedAt };
  },
});
