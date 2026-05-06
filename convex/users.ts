import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

const DEMO_USER_ID = "demo-user";

// Helper: resolve a user record from a string userId (the Convex _id).
// Returns null if not found or if the id is the legacy demo placeholder.
async function findUserByStringId(ctx: any, userId: string | undefined) {
  if (!userId || userId === DEMO_USER_ID) return null;
  // Convex .get() requires a typed Id; iterate as a fallback for robustness
  // since callers pass plain strings throughout the app.
  try {
    const direct = await ctx.db.get(userId as any);
    if (direct && (direct as any).email !== undefined) return direct;
  } catch {
    // fall through to scan
  }
  const all = await ctx.db.query("users").collect();
  return all.find((u: any) => u._id.toString() === userId) ?? null;
}

export const updateProfile = mutation({
  args: {
    // userId is OPTIONAL so older clients (without this field) don't crash.
    // When absent, this mutation behaves like the old stub: it returns the
    // legacy demo id and writes nothing. Newer clients pass the real userId.
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
    // Backwards-compat: no userId supplied -> behave like legacy stub.
    if (!args.userId || args.userId === DEMO_USER_ID) {
      return { userId: DEMO_USER_ID };
    }

    const user = await findUserByStringId(ctx, args.userId);
    if (!user) {
      // Don't throw — keep frontend resilient. Just behave like legacy.
      return { userId: DEMO_USER_ID };
    }

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

// New mutation: dedicated profile-pic save (separate from main onboarding payload)
export const updateProfilePic = mutation({
  args: {
    userId: v.string(),
    profilePic: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await findUserByStringId(ctx, args.userId);
    if (!user) return { success: false };
    await ctx.db.patch(user._id, { profilePic: args.profilePic });
    return { success: true };
  },
});

export const getUser = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await findUserByStringId(ctx, args.userId);

    // Backwards-compat fallback: if no real user resolved, return the legacy
    // hardcoded shape so any existing UI rendering against it doesn't crash.
    if (!user) {
      return {
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
      };
    }

    return {
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
