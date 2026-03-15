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

