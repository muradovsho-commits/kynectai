import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserEmail } from "./_helpers";
import { requireUser } from "./auth";

// ═══════════════════════════════════════════════════════════════
// CONTACT DATABASE - SAVED CONTACTS
// ═══════════════════════════════════════════════════════════════
// Bookmarks used to be localStorage, which meant a saved list lived on one
// browser and was shared by anyone using that browser. These rows are keyed by
// userId, so the list follows the account.
//
// Not gated by plan: saving is free. Only revealing an address costs a credit.

export const listSaves = query({
  args: { userId: v.string(), sessionToken: v.optional(v.string()) },
  handler: async (ctx, { userId, sessionToken }) => {
    await requireUser({ userId, sessionToken });
    const rows = await ctx.db
      .query("contactSaves")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return rows.map((r) => r.contactId);
  },
});

// Idempotent both ways: saving twice inserts once, unsaving something that was
// never saved is a no-op. Returns the resulting state so the client can render
// from the answer rather than guessing.
export const toggleSave = mutation({
  args: { userId: v.string(), sessionToken: v.optional(v.string()), contactId: v.string() },
  handler: async (ctx, { userId, sessionToken, contactId }) => {
    await requireUser({ userId, sessionToken });
    const existing = await ctx.db
      .query("contactSaves")
      .withIndex("by_user_contact", (q) => q.eq("userId", userId).eq("contactId", contactId))
      .unique();
    if (existing) {
      await ctx.db.delete(existing._id);
      return { saved: false };
    }
    await ctx.db.insert("contactSaves", {
      userId,
      userEmail: await getUserEmail(ctx, userId),
      contactId,
      savedAt: Date.now(),
    });
    return { saved: true };
  },
});
