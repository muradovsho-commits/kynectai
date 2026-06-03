import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireUser } from "./auth";

const DEMO_USER_ID = "demo-user";

// Helper: resolve a user record from a string userId. Callers throughout the
// app pass plain strings (from localStorage), so we accept that and try a
// direct .get() first, then fall back to scanning if the id format isn't a
// valid Convex Id. Returns null for missing / legacy demo placeholder.
async function findUserByStringId(ctx: any, userId: string | undefined) {
  if (!userId || userId === DEMO_USER_ID) return null;
  try {
    const direct = await ctx.db.get(userId as any);
    if (direct && (direct as any).email !== undefined) return direct;
  } catch {
    // fall through to scan
  }
  const all = await ctx.db.query("users").collect();
  return all.find((u: any) => u._id.toString() === userId) ?? null;
}

// Onboarding-finish payload. userId is OPTIONAL so older clients (or the
// /profile page, which doesn't pass it) continue to work without throwing.
// When userId is absent or is the legacy demo placeholder, this mutation
// behaves like the old stub: it returns demo-user and writes nothing.
export const updateProfile = mutation({
  args: {
    userId: v.optional(v.string()),
    firstName: v.string(),
    lastName: v.string(),
    university: v.string(),
    major: v.string(),
    graduationYear: v.string(),
    targetRoles: v.array(v.string()),
    recruitYear: v.union(
      v.literal("Summer 2025"),
      v.literal("Summer 2026"),
      v.literal("Full-time 2025"),
      v.literal("Full-time 2026"),
      v.literal(""),
    ),
    targetFirms: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.userId || args.userId === DEMO_USER_ID) {
      return { userId: DEMO_USER_ID };
    }
    const user = await findUserByStringId(ctx, args.userId);
    if (!user) return { userId: DEMO_USER_ID };

    await ctx.db.patch(user._id, {
      firstName: args.firstName,
      lastName: args.lastName,
      university: args.university,
      major: args.major,
      graduationYear: args.graduationYear,
      targetRoles: args.targetRoles,
      recruitYear: args.recruitYear,
      targetFirms: args.targetFirms,
    });
    return { userId: user._id.toString() };
  },
});

// Settings-page partial update. All profile fields optional so any subset
// can be patched without overwriting unrelated fields.
export const updateUserProfile = mutation({
  args: {
    userId: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    university: v.optional(v.string()),
    major: v.optional(v.string()),
    graduationYear: v.optional(v.string()),
    targetRoles: v.optional(v.array(v.string())),
    recruitYear: v.optional(v.string()),
    targetFirms: v.optional(v.array(v.string())),
    profilePic: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.userId || args.userId === DEMO_USER_ID) return { success: false };
    const user = await findUserByStringId(ctx, args.userId);
    if (!user) return { success: false };

    const patch: any = {};
    if (args.firstName !== undefined) patch.firstName = args.firstName;
    if (args.lastName !== undefined) patch.lastName = args.lastName;
    if (args.university !== undefined) patch.university = args.university;
    if (args.major !== undefined) patch.major = args.major;
    if (args.graduationYear !== undefined) patch.graduationYear = args.graduationYear;
    if (args.targetRoles !== undefined) patch.targetRoles = args.targetRoles;
    if (args.recruitYear !== undefined) patch.recruitYear = args.recruitYear;
    if (args.targetFirms !== undefined) patch.targetFirms = args.targetFirms;
    if (args.profilePic !== undefined) patch.profilePic = args.profilePic;
    if (Object.keys(patch).length > 0) {
      await ctx.db.patch(user._id, patch);
    }
    return { success: true };
  },
});

// Dedicated profile-pic save (kept separate so it can be called without
// touching other profile fields).
export const updateProfilePic = mutation({
  args: { userId: v.string(), profilePic: v.string() },
  handler: async (ctx, args) => {
    const user = await findUserByStringId(ctx, args.userId);
    if (!user) return { success: false };
    await ctx.db.patch(user._id, { profilePic: args.profilePic });
    return { success: true };
  },
});

// Read user profile. Returns `found: true` with real fields when resolved,
// `found: false` with empty defaults otherwise. Now also returns the Stripe
// subscription fields so the cancel/switch UI can work without a separate
// query.
export const getUser = query({
  args: { userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requireUser(args);
    const user = await findUserByStringId(ctx, args.userId);
    if (!user) {
      return {
        found: false,
        id: DEMO_USER_ID,
        firstName: "",
        lastName: "",
        name: "",
        email: "",
        plan: "free",
        searchesUsed: 0,
        messagesUsed: 0,
        university: "",
        major: "",
        graduationYear: "",
        targetRoles: [] as string[],
        recruitYear: "",
        targetFirms: [] as string[],
        profilePic: "",
        stripeCustomerId: "",
        stripeSubscriptionId: "",
        subscriptionStatus: "",
        subscriptionCurrentPeriodEnd: null as number | null,
        pendingPlanChange: null as { targetPlan: string; effectiveAt: number } | null,
      };
    }
    return {
      found: true,
      id: user._id.toString(),
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      name: user.name ?? "",
      email: user.email ?? "",
      plan: user.plan ?? "free",
      searchesUsed: 0,
      messagesUsed: user.outreachCount ?? 0,
      university: user.university ?? "",
      major: user.major ?? "",
      graduationYear: user.graduationYear ?? "",
      targetRoles: user.targetRoles ?? [],
      recruitYear: user.recruitYear ?? "",
      targetFirms: user.targetFirms ?? [],
      profilePic: user.profilePic ?? "",
      stripeCustomerId: user.stripeCustomerId ?? "",
      stripeSubscriptionId: user.stripeSubscriptionId ?? "",
      subscriptionStatus: user.subscriptionStatus ?? "",
      subscriptionCurrentPeriodEnd: user.subscriptionCurrentPeriodEnd ?? null,
      pendingPlanChange: user.pendingPlanChange ?? null,
    };
  },
});

export const saveOutreachMessage = mutation({
  args: {
    userId: v.id("users"),
    contactName: v.string(),
    contactFirm: v.string(),
    contactRole: v.string(),
    angle: v.string(),
    subject: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("outreachMessages", {
      ...args,
      replied: false,
      sentAt: Date.now(),
    });
  },
});

export const markMessageReplied = mutation({
  args: { messageId: v.id("outreachMessages"), replied: v.boolean() },
  handler: async (ctx, { messageId, replied }) => {
    await ctx.db.patch(messageId, { replied });
  },
});

export const getUserMessages = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("outreachMessages")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const incrementOutreachCount = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) return 0;
    const newCount = (user.outreachCount || 0) + 1;
    await ctx.db.patch(userId, { outreachCount: newCount });
    return newCount;
  }
});

export const getTutorialState = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) return { onboardingStep: 0, onboardingComplete: false };
    return {
      onboardingStep: user.onboardingStep ?? 0,
      onboardingComplete: user.onboardingComplete ?? false,
    };
  },
});

export const setTutorialStep = mutation({
  args: { userId: v.id("users"), step: v.number() },
  handler: async (ctx, { userId, step }) => {
    await ctx.db.patch(userId, { onboardingStep: step });
  },
});

export const completeTutorial = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    await ctx.db.patch(userId, { onboardingComplete: true, onboardingStep: 5 });
  },
});

export const getAllUsers = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").order("desc").collect();
    return users.map(u => ({
      id: u._id,
      name: u.name,
      email: u.email,
      emailVerified: u.emailVerified ?? false,
      plan: u.plan || "free",
      outreachCount: u.outreachCount || 0,
      onboardingComplete: u.onboardingComplete ?? false,
      createdAt: u.createdAt,
    }));
  },
});
