import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    passwordHash: v.string(),
    createdAt: v.number(),
    emailVerified: v.optional(v.boolean()),
    verificationToken: v.optional(v.string()),
    resetToken: v.optional(v.string()),
    resetTokenExpiry: v.optional(v.number()),
    outreachCount: v.optional(v.number()),
    plan: v.optional(v.string()),
    planActivatedAt: v.optional(v.number()),
    promoCode: v.optional(v.string()),
    onboardingStep: v.optional(v.number()),
    onboardingComplete: v.optional(v.boolean()),
  }).index("by_email", ["email"])
    .index("by_verificationToken", ["verificationToken"])
    .index("by_resetToken", ["resetToken"]),

  outreachMessages: defineTable({
    userId: v.id("users"),
    contactName: v.string(),
    contactFirm: v.string(),
    contactRole: v.string(),
    angle: v.string(),
    subject: v.string(),
    body: v.string(),
    replied: v.boolean(),
    sentAt: v.number(),
  }).index("by_user", ["userId"]),

  waitlist: defineTable({
    email: v.string(),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  emailAccounts: defineTable({
    userId: v.string(),
    provider: v.string(),
    providerEmail: v.string(),
    accessToken: v.string(),
    refreshToken: v.string(),
    tokenExpiresAt: v.number(),
    status: v.string(),
    lastSyncedAt: v.optional(v.number()),
    connectedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_provider", ["userId", "provider"]),

  emailSyncSettings: defineTable({
    userId: v.string(),
    autoLogSent: v.boolean(),
    autoUpdateStatus: v.boolean(),
    followUpReminderDays: v.number(),
    upcomingCallReminder: v.boolean(),
  }).index("by_userId", ["userId"]),

  syncedEmails: defineTable({
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
    syncedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_providerMessageId", ["providerMessageId"])
    .index("by_matchedContact", ["matchedContactId"]),

  reminders: defineTable({
    userId: v.string(),
    type: v.string(),
    contactName: v.string(),
    contactFirm: v.optional(v.string()),
    contactId: v.optional(v.string()),
    message: v.string(),
    dueAt: v.number(),
    dismissed: v.boolean(),
    createdAt: v.number(),
    relatedEventId: v.optional(v.id("syncedEmails")),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_dismissed", ["userId", "dismissed"]),

  jobBoardSubscribers: defineTable({
    email: v.string(),
    createdAt: v.number(),
    active: v.optional(v.boolean()),
  }).index("by_email", ["email"]),

  marketPosts: defineTable({
    userId: v.id("users"),
    content: v.string(),
    sentiment: v.string(),
    upvotes: v.number(),
    downvotes: v.number(),
    replies: v.number(),
    createdAt: v.number(),
    replyTo: v.optional(v.id("marketPosts")),
    upvotedBy: v.optional(v.array(v.string())),
    downvotedBy: v.optional(v.array(v.string())),
  })
    .index("by_createdAt", ["createdAt"])
    .index("by_userId", ["userId"]),

  feedback: defineTable({
    userId: v.optional(v.string()),
    userName: v.optional(v.string()),
    userEmail: v.optional(v.string()),
    type: v.string(),
    message: v.string(),
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),

  userProgress: defineTable({
    userId: v.string(),
    data: v.string(), // JSON blob of all progress data
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),
});
