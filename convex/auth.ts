import { mutation } from "./_generated/server";
import { v } from "convex/values";

const DEMO_USER_ID = "demo-user";

export const signUp = mutation({
  args: {
    fullName: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async () => {
    return { userId: DEMO_USER_ID };
  },
});

export const signIn = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async () => {
    return { userId: DEMO_USER_ID };
  },
});

