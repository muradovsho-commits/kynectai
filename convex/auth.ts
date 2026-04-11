import { mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";

// Simple hash function for passwords (not bcrypt, but sufficient for MVP)
// In production, use a proper auth provider like Clerk or Auth0
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Add salt-like prefix and convert to hex-like string
  const base = Math.abs(hash).toString(36);
  // Double hash for extra security
  let hash2 = 0;
  const salted = "offerbell_" + str + "_salt";
  for (let i = 0; i < salted.length; i++) {
    const char = salted.charCodeAt(i);
    hash2 = ((hash2 << 5) - hash2) + char;
    hash2 = hash2 & hash2;
  }
  return "kh_" + base + Math.abs(hash2).toString(36);
}

export const signUp = mutation({
  args: {
    fullName: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Normalize email
    const email = args.email.toLowerCase().trim();

    // Check if email already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existing) {
      throw new ConvexError("An account with this email already exists. Please sign in instead.");
    }

    // Validate inputs
    if (!args.fullName.trim()) {
      throw new ConvexError("Name is required.");
    }
    if (!email.includes("@")) {
      throw new ConvexError("Please enter a valid email address.");
    }
    if (args.password.length < 6) {
      throw new ConvexError("Password must be at least 6 characters.");
    }

    // Hash password
    const passwordHash = simpleHash(args.password);

    // Generate Verification Token
    const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // Create user
    const userId = await ctx.db.insert("users", {
      name: args.fullName.trim(),
      email,
      passwordHash,
      createdAt: Date.now(),
      emailVerified: false,
      verificationToken,
      outreachCount: 0,
    });

    return { userId: userId.toString(), verificationToken };
  },
});

export const signIn = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();

    // Find user by email
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!user) {
      throw new ConvexError("No account found with this email. Please sign up first.");
    }

    // Check password
    const passwordHash = simpleHash(args.password);
    if (user.passwordHash !== passwordHash) {
      throw new ConvexError("Incorrect password. Please try again.");
    }

    // Check email verification
    if (user.emailVerified === false) {
      throw new ConvexError("Please verify your email address to sign in.");
    }

    return { userId: user._id.toString(), name: user.name, email: user.email, outreachCount: user.outreachCount || 0, plan: user.plan || 'free', planActivatedAt: user.planActivatedAt || null, promoCode: user.promoCode || null };
  },
});

export const verifyEmail = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_verificationToken", (q) => q.eq("verificationToken", args.token))
      .first();

    if (!user) {
      throw new ConvexError("Invalid or expired verification token.");
    }

    await ctx.db.patch(user._id, {
      emailVerified: true,
      verificationToken: undefined, // remove token after use
    });

    return { success: true };
  },
});

export const generateVerificationToken = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!user) {
      throw new ConvexError("No account found with this email.");
    }
    if (user.emailVerified) {
      throw new ConvexError("Email is already verified.");
    }

    const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    await ctx.db.patch(user._id, { verificationToken });

    return { success: true, verificationToken, name: user.name };
  }
});

export const requestPasswordReset = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!user) {
      throw new ConvexError("No account found with this email.");
    }

    // Generate token and expiry (1 hour)
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetTokenExpiry = Date.now() + 60 * 60 * 1000;

    await ctx.db.patch(user._id, {
      resetToken,
      resetTokenExpiry,
    });

    return { success: true, resetToken, name: user.name };
  },
});

export const resetPassword = mutation({
  args: { token: v.string(), newPassword: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_resetToken", (q) => q.eq("resetToken", args.token))
      .first();

    if (!user || user.resetTokenExpiry === undefined || user.resetTokenExpiry < Date.now()) {
      throw new ConvexError("Invalid or expired reset token.");
    }

    if (args.newPassword.length < 6) {
      throw new ConvexError("Password must be at least 6 characters.");
    }

    const passwordHash = simpleHash(args.newPassword);

    await ctx.db.patch(user._id, {
      passwordHash,
      resetToken: undefined,
      resetTokenExpiry: undefined,
    });

    return { success: true };
  },
});

export const deleteAccount = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // Find the user
    const users = await ctx.db.query("users").collect();
    const user = users.find((u) => u._id.toString() === args.userId);
    if (!user) throw new ConvexError("User not found");

    // Delete all outreach messages for this user
    const messages = await ctx.db
      .query("outreachMessages")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    for (const msg of messages) {
      await ctx.db.delete(msg._id);
    }

    // Delete the user
    await ctx.db.delete(user._id);
    return { success: true };
  },
});

export const upgradePlan = mutation({
  args: { userId: v.string(), promoCode: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    const user = users.find((u) => u._id.toString() === args.userId);
    if (!user) throw new ConvexError("User not found");
    const patch: any = { plan: "pro", planActivatedAt: Date.now() };
    if (args.promoCode) patch.promoCode = args.promoCode;
    await ctx.db.patch(user._id, patch);
    return { success: true, planActivatedAt: Date.now() };
  },
});

export const downgradePlan = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    const user = users.find((u) => u._id.toString() === args.userId);
    if (!user) throw new ConvexError("User not found");
    await ctx.db.patch(user._id, { plan: "free", planActivatedAt: undefined });
    return { success: true };
  },
});
