import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ── Create a reminder (deduplicates by contactId + type per week) ──
export const createReminder = mutation({
  args: {
    userId: v.string(),
    type: v.string(),
    contactName: v.string(),
    contactFirm: v.optional(v.string()),
    contactId: v.optional(v.string()),
    message: v.string(),
    dueAt: v.number(),
    relatedEventId: v.optional(v.id("syncedEmails")),
  },
  handler: async (ctx, args) => {
    if (args.contactId) {
      const weekStart = args.dueAt - (args.dueAt % (7 * 86400000));
      const existing = await ctx.db
        .query("reminders")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .filter((q) =>
          q.and(
            q.eq(q.field("contactId"), args.contactId),
            q.eq(q.field("type"), args.type),
            q.gte(q.field("createdAt"), weekStart)
          )
        )
        .first();
      if (existing) return { id: existing._id, duplicate: true };
    }

    const id = await ctx.db.insert("reminders", {
      ...args,
      dismissed: false,
      createdAt: Date.now(),
    });
    return { id, duplicate: false };
  },
});

// ── Get active reminders ──
export const getActiveReminders = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("reminders")
      .withIndex("by_userId_dismissed", (q) =>
        q.eq("userId", userId).eq("dismissed", false)
      )
      .order("desc")
      .take(20);
  },
});

// ── Dismiss a single reminder ──
export const dismissReminder = mutation({
  args: { reminderId: v.id("reminders") },
  handler: async (ctx, { reminderId }) => {
    await ctx.db.patch(reminderId, { dismissed: true });
  },
});

// ── Dismiss all reminders for a user ──
export const dismissAllReminders = mutation({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const reminders = await ctx.db
      .query("reminders")
      .withIndex("by_userId_dismissed", (q) =>
        q.eq("userId", userId).eq("dismissed", false)
      )
      .collect();
    for (const r of reminders) {
      await ctx.db.patch(r._id, { dismissed: true });
    }
  },
});
