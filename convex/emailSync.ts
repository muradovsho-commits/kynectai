import { mutation, query } from "./_generated/server";
import { v, ConvexError } from "convex/values";

// ── Connect an email account ──
export const connectEmailAccount = mutation({
  args: {
    userId: v.string(),
    provider: v.string(),
    providerEmail: v.string(),
    accessToken: v.string(),
    refreshToken: v.string(),
    tokenExpiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("emailAccounts")
      .withIndex("by_userId_provider", (q) =>
        q.eq("userId", args.userId).eq("provider", args.provider)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        accessToken: args.accessToken,
        refreshToken: args.refreshToken,
        tokenExpiresAt: args.tokenExpiresAt,
        providerEmail: args.providerEmail,
        status: "connected",
      });
      return { id: existing._id, updated: true };
    }

    const id = await ctx.db.insert("emailAccounts", {
      ...args,
      status: "connected",
      connectedAt: Date.now(),
    });

    // Create default sync settings if not exists
    const settings = await ctx.db
      .query("emailSyncSettings")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!settings) {
      await ctx.db.insert("emailSyncSettings", {
        userId: args.userId,
        autoLogSent: true,
        autoUpdateStatus: true,
        followUpReminderDays: 7,
        upcomingCallReminder: true,
      });
    }

    return { id, updated: false };
  },
});

// ── Disconnect an email account ──
export const disconnectEmailAccount = mutation({
  args: {
    accountId: v.id("emailAccounts"),
    purgeEmails: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const account = await ctx.db.get(args.accountId);
    if (!account) throw new ConvexError("Account not found");

    await ctx.db.delete(args.accountId);

    if (args.purgeEmails) {
      const emails = await ctx.db
        .query("syncedEmails")
        .filter((q) => q.eq(q.field("emailAccountId"), args.accountId))
        .collect();
      for (const email of emails) {
        await ctx.db.delete(email._id);
      }
    }

    return { success: true };
  },
});

// ── Get connected email accounts ──
export const getEmailAccounts = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("emailAccounts")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
  },
});

// ── Get sync settings ──
export const getSyncSettings = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("emailSyncSettings")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
  },
});

// ── Update sync settings ──
export const updateSyncSettings = mutation({
  args: {
    userId: v.string(),
    autoLogSent: v.optional(v.boolean()),
    autoUpdateStatus: v.optional(v.boolean()),
    followUpReminderDays: v.optional(v.number()),
    upcomingCallReminder: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("emailSyncSettings")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    const patch: Record<string, unknown> = {};
    if (args.autoLogSent !== undefined) patch.autoLogSent = args.autoLogSent;
    if (args.autoUpdateStatus !== undefined) patch.autoUpdateStatus = args.autoUpdateStatus;
    if (args.followUpReminderDays !== undefined) patch.followUpReminderDays = args.followUpReminderDays;
    if (args.upcomingCallReminder !== undefined) patch.upcomingCallReminder = args.upcomingCallReminder;

    if (existing) {
      await ctx.db.patch(existing._id, patch);
    } else {
      await ctx.db.insert("emailSyncSettings", {
        userId: args.userId,
        autoLogSent: args.autoLogSent ?? true,
        autoUpdateStatus: args.autoUpdateStatus ?? true,
        followUpReminderDays: args.followUpReminderDays ?? 7,
        upcomingCallReminder: args.upcomingCallReminder ?? true,
      });
    }
  },
});

// ── Log a synced email (idempotent) ──
export const logSyncedEmail = mutation({
  args: {
    userId: v.string(),
    emailAccountId: v.id("emailAccounts"),
    providerMessageId: v.string(),
    threadId: v.optional(v.string()),
    from: v.string(),
    to: v.string(),
    subject: v.string(),
    snippet: v.string(),
    sentAt: v.number(),
    direction: v.string(),
    type: v.string(),
    matchedContactId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("syncedEmails")
      .withIndex("by_providerMessageId", (q) =>
        q.eq("providerMessageId", args.providerMessageId)
      )
      .first();

    if (existing) return { id: existing._id, duplicate: true };

    const id = await ctx.db.insert("syncedEmails", {
      ...args,
      syncedAt: Date.now(),
    });

    return { id, duplicate: false };
  },
});

// ── Update account sync status ──
export const updateAccountSyncStatus = mutation({
  args: {
    accountId: v.id("emailAccounts"),
    status: v.string(),
    lastSyncedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const patch: Record<string, unknown> = { status: args.status };
    if (args.lastSyncedAt) patch.lastSyncedAt = args.lastSyncedAt;
    await ctx.db.patch(args.accountId, patch);
  },
});

// ── Update access token after refresh ──
export const updateAccessToken = mutation({
  args: {
    accountId: v.id("emailAccounts"),
    accessToken: v.string(),
    tokenExpiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.accountId, {
      accessToken: args.accessToken,
      tokenExpiresAt: args.tokenExpiresAt,
      status: "connected",
    });
  },
});

// ── Get synced emails for a contact ──
export const getSyncedEmailsForContact = query({
  args: { contactId: v.string() },
  handler: async (ctx, { contactId }) => {
    return await ctx.db
      .query("syncedEmails")
      .withIndex("by_matchedContact", (q) =>
        q.eq("matchedContactId", contactId)
      )
      .order("desc")
      .take(20);
  },
});

// ── Get recent synced emails for a user ──
export const getRecentSyncedEmails = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("syncedEmails")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .take(50);
  },
});
