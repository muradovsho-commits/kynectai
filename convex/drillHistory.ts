import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserEmail } from "./_helpers";
import { requireUser } from "./auth";

// One row per user holding the feature's JSON. Reads return the NEWEST row
// deterministically and writes collapse any duplicates back to a single row, so
// a stray duplicate from a past concurrent-insert race can never make the value
// flip between logins.

export const getDrillHistory = query({
  args: { userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()) },
  handler: async (ctx, { sessionToken, serverSecret, userId }) => {
    await requireUser({ userId, sessionToken, serverSecret });
    const rows = await ctx.db
      .query("drillHistory")
      .withIndex("by_user", q => q.eq("userId", userId))
      .collect();
    if (rows.length === 0) return null;
    let best = rows[0];
    for (const r of rows) if ((r.updatedAt || 0) > (best.updatedAt || 0)) best = r;
    return { data: best.data, updatedAt: best.updatedAt };
  },
});

export const upsertDrillHistory = mutation({
  args: {
    userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()),
    data: v.string(),
    updatedAt: v.optional(v.number()),
  },
  handler: async (ctx, { sessionToken, serverSecret, userId, data, updatedAt }) => {
    await requireUser({ userId, sessionToken, serverSecret });
    const rows = await ctx.db
      .query("drillHistory")
      .withIndex("by_user", q => q.eq("userId", userId))
      .collect();
    const now = updatedAt ?? Date.now();
    const userEmail = await getUserEmail(ctx, userId);
    if (rows.length === 0) {
      await ctx.db.insert("drillHistory", { userId, data, updatedAt: now, userEmail });
    } else {
      let keep = rows[0];
      for (const r of rows) if ((r.updatedAt || 0) > (keep.updatedAt || 0)) keep = r;
      await ctx.db.patch(keep._id, { data, updatedAt: now, userEmail });
      for (const r of rows) if (r._id !== keep._id) await ctx.db.delete(r._id);
    }
  },
});
