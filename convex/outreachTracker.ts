import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserEmail } from "./_helpers";
import { requireUser } from "./auth";

// One row per user holding the feature's JSON. Reads return the NEWEST row
// deterministically and writes collapse any duplicates back to a single row, so
// a stray duplicate from a past concurrent-insert race can never make the value
// flip between logins.

export const getTracker = query({
  args: { userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()) },
  handler: async (ctx, { sessionToken, serverSecret, userId }) => {
    await requireUser({ userId, sessionToken, serverSecret });
    const rows = await ctx.db
      .query("outreachTracker")
      .withIndex("by_user", q => q.eq("userId", userId))
      .collect();
    if (rows.length === 0) return null;
    let best = rows[0];
    for (const r of rows) if ((r.updatedAt || 0) > (best.updatedAt || 0)) best = r;
    return { data: best.data, updatedAt: best.updatedAt };
  },
});

export const upsertTracker = mutation({
  args: {
    userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()),
    data: v.string(),
    updatedAt: v.optional(v.number()),
  },
  handler: async (ctx, { sessionToken, serverSecret, userId, data, updatedAt }) => {
    await requireUser({ userId, sessionToken, serverSecret });
    const rows = await ctx.db
      .query("outreachTracker")
      .withIndex("by_user", q => q.eq("userId", userId))
      .collect();
    const now = updatedAt ?? Date.now();
    const userEmail = await getUserEmail(ctx, userId);
    if (rows.length === 0) {
      await ctx.db.insert("outreachTracker", { userId, data, updatedAt: now, userEmail });
    } else {
      let keep = rows[0];
      for (const r of rows) if ((r.updatedAt || 0) > (keep.updatedAt || 0)) keep = r;
      await ctx.db.patch(keep._id, { data, updatedAt: now, userEmail });
      for (const r of rows) if (r._id !== keep._id) await ctx.db.delete(r._id);
    }
  },
});

// Atomically append contacts to the user's tracker row, server side, so feeders
// (the Gmail extension add-contact page and the outreach writer's save-to-tracker
// button) never do a read-modify-write over the network that could drop edits
// made on another device between the read and the write. Dedupes by contact id
// and collapses any duplicate rows back to one.
export const appendContacts = mutation({
  args: {
    userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()),
    contacts: v.string(),
  },
  handler: async (ctx, { sessionToken, serverSecret, userId, contacts }) => {
    await requireUser({ userId, sessionToken, serverSecret });
    let toAdd: any[] = [];
    try { const p = JSON.parse(contacts); if (Array.isArray(p)) toAdd = p; } catch {}
    if (toAdd.length === 0) return;
    const rows = await ctx.db
      .query("outreachTracker")
      .withIndex("by_user", q => q.eq("userId", userId))
      .collect();
    const now = Date.now();
    const userEmail = await getUserEmail(ctx, userId);
    if (rows.length === 0) {
      await ctx.db.insert("outreachTracker", { userId, data: JSON.stringify(toAdd), updatedAt: now, userEmail });
      return;
    }
    let keep = rows[0];
    for (const r of rows) if ((r.updatedAt || 0) > (keep.updatedAt || 0)) keep = r;
    let existing: any[] = [];
    try { const p = JSON.parse(keep.data || "[]"); if (Array.isArray(p)) existing = p; } catch {}
    const haveIds = new Set(existing.map((c: any) => c && c.id));
    const fresh = toAdd.filter((c: any) => c && !haveIds.has(c.id));
    const merged = [...existing, ...fresh];
    await ctx.db.patch(keep._id, { data: JSON.stringify(merged), updatedAt: now, userEmail });
    for (const r of rows) if (r._id !== keep._id) await ctx.db.delete(r._id);
  },
});
