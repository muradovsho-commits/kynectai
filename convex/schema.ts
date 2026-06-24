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
    // Profile fields
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    university: v.optional(v.string()),
    major: v.optional(v.string()),
    graduationYear: v.optional(v.string()),
    targetRoles: v.optional(v.array(v.string())),
    recruitYear: v.optional(v.string()),
    targetFirms: v.optional(v.array(v.string())),
    profilePic: v.optional(v.string()),
    // Stripe / subscription fields. All optional - populated by webhook on
    // first successful checkout, or remain unset for users who never paid.
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    // Stripe subscription status: 'active' | 'past_due' | 'canceled' |
    // 'incomplete' | 'incomplete_expired' | 'trialing' | 'unpaid'. We mirror
    // Stripe's value verbatim so it's unambiguous what state the sub is in.
    subscriptionStatus: v.optional(v.string()),
    // Unix ms timestamp of when the current paid period ends. After this,
    // either the sub renews (status stays 'active') or transitions to
    // 'canceled' if cancel_at_period_end was set.
    subscriptionCurrentPeriodEnd: v.optional(v.number()),
    // If the user has scheduled a downgrade or cancellation to take effect
    // at period end, this captures the intent. Cleared by webhook when the
    // change actually takes effect. Shape:
    //   { targetPlan: 'pro' | 'free', effectiveAt: number }
    pendingPlanChange: v.optional(v.object({
      targetPlan: v.string(),
      effectiveAt: v.number(),
    })),
  }).index("by_email", ["email"])
    .index("by_verificationToken", ["verificationToken"])
    .index("by_resetToken", ["resetToken"])
    .index("by_stripeCustomerId", ["stripeCustomerId"])
    .index("by_stripeSubscriptionId", ["stripeSubscriptionId"]),

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
    userEmail: v.optional(v.string()), // Denormalized from users.email so the Convex dashboard shows who each row belongs to without clicking through references.
    data: v.string(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  // Per-entry storage for mock interview responses. Replaces having the
  // entire responses array round-trip through userProgress.data on every
  // save (was ~500KB per write; now ~1KB per response).
  mockResponses: defineTable({
    userId: v.string(),
    userEmail: v.optional(v.string()), // Denormalized for dashboard readability.
    entryId: v.string(),
    questionId: v.string(),
    trackId: v.string(),
    transcript: v.string(),
    grade: v.string(),
    overallFeedback: v.string(),
    strengths: v.array(v.string()),
    weaknesses: v.array(v.string()),
    wordsPerMin: v.number(),
    durationSec: v.number(),
    timestamp: v.number(),
    hidden: v.optional(v.boolean()),
    category: v.optional(v.string()), // Topic/category of the question, for per-topic heatmap.
  })
    .index("by_user", ["userId"])
    .index("by_user_entry", ["userId", "entryId"]),

  // Per-conversation storage for Coach chat history. The messages array
  // stays nested inside the row (a conversation is always loaded as a
  // single unit), but each conversation is its own document so saving a
  // new message patches one ~5KB row instead of re-writing the whole blob.
  coachConvos: defineTable({
    userId: v.string(),
    userEmail: v.optional(v.string()), // Denormalized for dashboard readability.
    convoId: v.string(),
    track: v.string(),
    feature: v.optional(v.string()),
    preview: v.string(),
    messages: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_convo", ["userId", "convoId"]),

  // Resume follow-up chat threads. One row per (userId, reviewId). Written only
  // when a message is sent (discrete action), never through the userProgress
  // blob, so it stays off the bandwidth-sensitive sync path.
  resumeChats: defineTable({
    userId: v.string(),
    userEmail: v.optional(v.string()),
    reviewId: v.string(),
    messages: v.string(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_review", ["userId", "reviewId"]),

  // Per-track flashcard performance. One row per (userId, track) instead of
  // sending all 10 tracks of stats through the userProgress blob on every
  // flashcard rating. Stats stay nested as JSON because they're always loaded
  // as a unit for a given track view.
  flashPerf: defineTable({
    userId: v.string(),
    userEmail: v.optional(v.string()), // Denormalized for dashboard readability.
    track: v.string(),
    data: v.string(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_track", ["userId", "track"]),

  // Diagnostic assessment history. One row per completed diagnostic. Replaces
  // having the entire history array round-trip through userProgress.data on
  // every diagnostic completion.
  diagHistory: defineTable({
    userId: v.string(),
    userEmail: v.optional(v.string()), // Denormalized for dashboard readability.
    entryId: v.string(),
    track: v.string(),
    date: v.string(),
    score: v.number(),
    totalCorrect: v.number(),
    totalAnswered: v.number(),
    catScores: v.string(),
    timestamp: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_entry", ["userId", "entryId"])
    .index("by_user_track", ["userId", "track"]),

  // The Desk (Reps career simulator) session state. One row per
  // (userId, scenarioId). Previously stored only in localStorage, so a
  // scenario in progress never followed the user to another device. Kept in
  // its own table (not the userProgress blob) because a session holds the
  // full chat transcript and would bloat the blob / its bandwidth.
  repsSessions: defineTable({
    userId: v.string(),
    userEmail: v.optional(v.string()), // Denormalized for dashboard readability.
    scenarioId: v.string(),
    data: v.string(), // JSON: { messages, completedArtifacts, activeArtifactId, updatedAt }
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_scenario", ["userId", "scenarioId"]),

  // Outreach tracker (contacts). One row per user; holds the tracker_v3 JSON.
  // Split out of the userProgress blob so tracker edits do not round-trip the
  // whole blob (bandwidth) and are not clobbered by other features' writes.
  outreachTracker: defineTable({
    userId: v.string(),
    userEmail: v.optional(v.string()),
    data: v.string(), // JSON of offerbell_tracker_v3
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // Referral map nodes. One row per user; holds the referral_nodes_v3 JSON.
  // Split out of the userProgress blob for the same reasons as the tracker:
  // keeps it off the blob (bandwidth) and lets it sync per-device cleanly.
  referralNodes: defineTable({
    userId: v.string(),
    userEmail: v.optional(v.string()),
    data: v.string(), // JSON of offerbell_referral_nodes_v3
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // Concept-drill question history. One row per user; holds drill_history JSON
  // (capped list of answered drill questions). Split out of the blob so it
  // syncs per-device without being clobbered by other blob writers.
  drillHistory: defineTable({
    userId: v.string(),
    userEmail: v.optional(v.string()),
    data: v.string(), // JSON of offerbell_drill_history
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // Saved outreach drafts. One row per user; holds saved_messages JSON.
  // Split out of the blob for the same reasons as the tracker.
  savedMessages: defineTable({
    userId: v.string(),
    userEmail: v.optional(v.string()),
    data: v.string(), // JSON of offerbell_saved_messages
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // Server-side enforcement of weekly plan limits.
  // One row per user per ISO-week (Monday UTC). Reset is implicit: a new
  // week creates a new row, old rows are ignored. Counters track count of
  // successful API calls per feature in the current week.
  weeklyUsage: defineTable({
    userId: v.string(),
    userEmail: v.optional(v.string()), // Denormalized for dashboard readability.
    weekStart: v.string(),
    coach: v.optional(v.number()),
    resumeReview: v.optional(v.number()),
    resumeChat: v.optional(v.number()),
    outreachWriter: v.optional(v.number()),
    mockInterview: v.optional(v.number()),
    updatedAt: v.number(),
  }).index("by_user_week", ["userId", "weekStart"]),
});
