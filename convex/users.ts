import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

const DEMO_USER_ID = "demo-user";

export const updateProfile = mutation({
  args: {
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
  handler: async () => {
    return { userId: DEMO_USER_ID };
  },
});

export const getUser = query({
  args: {
    userId: v.string(),
  },
  handler: async () => {
    return {
      id: DEMO_USER_ID,
      firstName: "Alex",
      lastName: "Chen",
      name: "Alex Chen",
      plan: "Free plan",
      searchesUsed: 0,
      messagesUsed: 0,
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
    await ctx.db.patch(userId, { onboardingComplete: true, onboardingStep: 4 });
  },
});
