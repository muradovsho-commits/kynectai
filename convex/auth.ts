import { mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";

// ─────────────────────────────────────────────────────────────────────────────
// SESSION TOKENS
// Stateless, signed tokens so backend functions can verify *which* user is
// calling instead of trusting a userId the browser sends. The browser only
// stores/forwards the opaque token string; it never sees AUTH_SESSION_SECRET
// and cannot mint a token for another user.
//
// Token format:  b64url(userId).b64url(expMs).hexHmacSHA256("userId.expMs")
// signed with AUTH_SESSION_SECRET (set in the Convex deployment env).
//
// Rollout is controlled by that env var, which acts as a kill switch:
//   - secret NOT set -> requireUser() fail-opens (returns args.userId). The app
//     behaves exactly as before. Safe to deploy this code with no secret set.
//   - secret set      -> requireUser() requires a valid token matching userId.
//     Remove the secret to instantly revert to the old behavior (no redeploy).
// ─────────────────────────────────────────────────────────────────────────────
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

function b64url(s: string): string {
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function unb64url(s: string): string {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  return atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
}
async function hmacHex(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  const bytes = new Uint8Array(sig);
  let hex = "";
  for (let i = 0; i < bytes.length; i++) hex += bytes[i].toString(16).padStart(2, "0");
  return hex;
}

// Mint a token for a freshly authenticated user. Returns "" when no secret is
// configured (the client just stores an empty string and nothing enforces yet).
export async function makeSessionToken(userId: string): Promise<string> {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret) return "";
  const exp = (Date.now() + SESSION_TTL_MS).toString();
  const sig = await hmacHex(`${userId}.${exp}`, secret);
  return `${b64url(userId)}.${b64url(exp)}.${sig}`;
}

async function verifySessionToken(token: string | undefined): Promise<string | null> {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret || !token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  let userId: string, exp: string;
  try {
    userId = unb64url(parts[0]);
    exp = unb64url(parts[1]);
  } catch {
    return null;
  }
  const expMs = Number(exp);
  if (!Number.isFinite(expMs) || Date.now() > expMs) return null;
  const expected = await hmacHex(`${userId}.${exp}`, secret);
  if (expected.length !== parts[2].length) return null;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ parts[2].charCodeAt(i);
  }
  return diff === 0 ? userId : null;
}

// Enforcement helper for protected functions. Pass the incoming args (which
// include userId and an optional sessionToken). Returns the trusted userId, or
// throws if the secret is set and the token is missing/invalid/mismatched.
// Fail-open while AUTH_SESSION_SECRET is unset so a missing env var can never
// lock users out.
export async function requireUser(args: { userId: string; sessionToken?: string; serverSecret?: string }): Promise<string> {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret) return args.userId;
  // Trusted server-to-Convex calls (our own Next.js API routes) prove they are
  // the backend by passing the shared secret, which browsers never have.
  if (args.serverSecret && args.serverSecret === secret) return args.userId;
  const verified = await verifySessionToken(args.sessionToken);
  if (!verified || verified !== args.userId) {
    throw new ConvexError("Not authenticated. Please sign in again.");
  }
  return verified;
}

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

// ─── Password hashing: PBKDF2-SHA256 with a per-user random salt ──────────────
// The Convex runtime exposes the Web Crypto API (crypto.subtle / crypto.get-
// RandomValues), same as Cloudflare Workers. We use PBKDF2 because bcrypt and
// scrypt aren't available in WebCrypto. Stored format:
//   pbkdf2$<iterations>$<saltHex>$<hashHex>
// Legacy hashes (prefix "kh_") are still verified via simpleHash and upgraded
// to this scheme transparently on the user's next successful sign-in, so
// existing accounts are never locked out.
const PBKDF2_ITERATIONS = 100_000;

function toHex(bytes: Uint8Array): string {
  let out = "";
  for (let i = 0; i < bytes.length; i++) out += bytes[i].toString(16).padStart(2, "0");
  return out;
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  return bytes;
}

async function derivePbkdf2(password: string, salt: Uint8Array, iterations: number): Promise<string> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations },
    keyMaterial,
    256
  );
  return toHex(new Uint8Array(bits));
}

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hashHex = await derivePbkdf2(password, salt, PBKDF2_ITERATIONS);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${toHex(salt)}$${hashHex}`;
}

// Constant-time comparison so a match doesn't leak via response timing.
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// Returns { ok, needsUpgrade }. needsUpgrade is true when a legacy "kh_" hash
// matched — the caller should re-store a PBKDF2 hash to migrate the user.
async function verifyPassword(
  password: string,
  stored: string
): Promise<{ ok: boolean; needsUpgrade: boolean }> {
  if (stored.startsWith("pbkdf2$")) {
    const parts = stored.split("$");
    const iterations = parseInt(parts[1], 10);
    const saltHex = parts[2];
    const hashHex = parts[3];
    const computed = await derivePbkdf2(password, fromHex(saltHex), iterations);
    return { ok: timingSafeEqual(computed, hashHex), needsUpgrade: false };
  }
  // Legacy "kh_" scheme.
  return { ok: timingSafeEqual(simpleHash(password), stored), needsUpgrade: true };
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
    const passwordHash = await hashPassword(args.password);

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

    // Check password. Verifies against the stored scheme (PBKDF2 or legacy
    // "kh_"). If a legacy hash matched, transparently re-hash with PBKDF2 so
    // the user is migrated off the weak scheme without any action on their end.
    const { ok, needsUpgrade } = await verifyPassword(args.password, user.passwordHash);
    if (!ok) {
      throw new ConvexError("Incorrect password. Please try again.");
    }
    if (needsUpgrade) {
      await ctx.db.patch(user._id, { passwordHash: await hashPassword(args.password) });
    }

    // Check email verification
    if (user.emailVerified === false) {
      throw new ConvexError("Please verify your email address to sign in.");
    }

    return { userId: user._id.toString(), sessionToken: await makeSessionToken(user._id.toString()), name: user.name, email: user.email, outreachCount: user.outreachCount || 0, plan: user.plan || 'free', planActivatedAt: user.planActivatedAt || null, promoCode: user.promoCode || null, onboardingComplete: user.onboardingComplete || false };
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

    const passwordHash = await hashPassword(args.newPassword);

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

// ─────────────────────────────────────────────────────────────────────────────
// SECURITY NOTE: upgradePlan, downgradePlan, and repairPlan mutations used to
// live here. They were callable from any browser console, with no auth, and
// would directly patch users.plan. A malicious user could call
// upgradePlan({ userId: 'their-id', plan: 'elite' }) and grant themselves
// Elite without paying. They have been removed. Plan changes flow only
// through the Stripe webhook (setStripeSubscription /
// applyStripeSubscriptionUpdate / applyStripeSubscriptionCanceled below),
// which validates a Stripe signature before doing anything.
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Stripe webhook mutations. Called only from the Stripe webhook handler at
// /api/stripe-webhook after signature verification. Each is a small, focused
// patch — never a multi-field overwrite — so a webhook firing out-of-order
// can't blow away unrelated state.
// ─────────────────────────────────────────────────────────────────────────────

// Set Stripe IDs and subscription state when a checkout completes or the sub
// is first created/linked. Looks up the user by userId (passed via Stripe
// metadata) so we can attribute Stripe events back to a Convex user.
// Guard: these mutations change billing/plan state. They are public mutations
// (the Stripe webhook calls them via ConvexHttpClient, which can't call
// internal functions), so without this check any browser could call them and
// grant itself Elite. STRIPE_SYNC_SECRET is set in the Convex deployment env
// and the Vercel env; the webhook passes it, browsers don't know it.
function assertSyncSecret(secret: string) {
  const expected = process.env.STRIPE_SYNC_SECRET;
  if (!expected || secret !== expected) {
    throw new Error("Unauthorized");
  }
}

export const setStripeSubscription = mutation({
  args: {
    syncSecret: v.string(),
    userId: v.string(),
    stripeCustomerId: v.string(),
    stripeSubscriptionId: v.string(),
    subscriptionStatus: v.string(),
    subscriptionCurrentPeriodEnd: v.optional(v.number()),
    plan: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    assertSyncSecret(args.syncSecret);
    const users = await ctx.db.query("users").collect();
    const user = users.find((u) => u._id.toString() === args.userId);
    if (!user) {
      console.error('[setStripeSubscription] user not found for userId:', args.userId);
      return { success: false };
    }
    const patch: any = {
      stripeCustomerId: args.stripeCustomerId,
      stripeSubscriptionId: args.stripeSubscriptionId,
      subscriptionStatus: args.subscriptionStatus,
    };
    if (args.subscriptionCurrentPeriodEnd !== undefined) {
      patch.subscriptionCurrentPeriodEnd = args.subscriptionCurrentPeriodEnd;
    }
    if (args.plan) {
      patch.plan = args.plan;
      patch.planActivatedAt = Date.now();
    }
    await ctx.db.patch(user._id, patch);
    return { success: true };
  },
});

// Apply a subscription update from Stripe. Used for renewals, status changes
// (active → past_due → canceled), period end shifts, and tier changes that
// took effect (when Stripe finishes a scheduled tier swap). Looks up the
// user by stripeSubscriptionId since the webhook gives us that, not userId.
export const applyStripeSubscriptionUpdate = mutation({
  args: {
    syncSecret: v.string(),
    stripeSubscriptionId: v.string(),
    subscriptionStatus: v.string(),
    subscriptionCurrentPeriodEnd: v.optional(v.number()),
    plan: v.optional(v.string()),
    clearPendingChange: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    assertSyncSecret(args.syncSecret);
    const user = await ctx.db
      .query("users")
      .withIndex("by_stripeSubscriptionId", (q) =>
        q.eq("stripeSubscriptionId", args.stripeSubscriptionId)
      )
      .first();
    if (!user) {
      console.error('[applyStripeSubscriptionUpdate] no user for sub:', args.stripeSubscriptionId);
      return { success: false };
    }
    const patch: any = { subscriptionStatus: args.subscriptionStatus };
    if (args.subscriptionCurrentPeriodEnd !== undefined) {
      patch.subscriptionCurrentPeriodEnd = args.subscriptionCurrentPeriodEnd;
    }
    if (args.plan) {
      patch.plan = args.plan;
      patch.planActivatedAt = Date.now();
    }
    if (args.clearPendingChange) {
      patch.pendingPlanChange = undefined;
    } else if (user.pendingPlanChange) {
      // Auto-clear a stale pendingPlanChange when the scheduled change has
      // already taken effect. Two signals:
      //   1. The new plan now matches what they were waiting for, OR
      //   2. The scheduled effectiveAt has already passed.
      // Without this clear, the UI banner ("Plan switches to Pro on Dec 31")
      // would stay visible forever even after the change applied.
      const pending = user.pendingPlanChange as { targetPlan?: string; effectiveAt?: number };
      const newPlan = args.plan ?? user.plan;
      const matchedTarget = pending.targetPlan && newPlan === pending.targetPlan;
      const isPast = typeof pending.effectiveAt === 'number' && pending.effectiveAt <= Date.now();
      if (matchedTarget || isPast) {
        patch.pendingPlanChange = undefined;
      }
    }
    await ctx.db.patch(user._id, patch);
    return { success: true };
  },
});

// Apply a final cancellation. Stripe fires customer.subscription.deleted when
// a sub ends (period rollover after cancel_at_period_end, or hard cancel).
// We flip the user to free and clear the Stripe IDs so a future re-subscribe
// gets a clean slate.
export const applyStripeSubscriptionCanceled = mutation({
  args: {
    syncSecret: v.string(),
    stripeSubscriptionId: v.string(),
  },
  handler: async (ctx, args) => {
    assertSyncSecret(args.syncSecret);
    const user = await ctx.db
      .query("users")
      .withIndex("by_stripeSubscriptionId", (q) =>
        q.eq("stripeSubscriptionId", args.stripeSubscriptionId)
      )
      .first();
    if (!user) {
      console.error('[applyStripeSubscriptionCanceled] no user for sub:', args.stripeSubscriptionId);
      return { success: false };
    }
    await ctx.db.patch(user._id, {
      plan: 'free',
      subscriptionStatus: 'canceled',
      pendingPlanChange: undefined,
    });
    return { success: true };
  },
});

// Record an intent: user has scheduled a downgrade/cancel at period end.
// The actual plan change happens later via webhook. UI uses this to show
// "Scheduled to downgrade to X on [date]" until then.
export const setPendingPlanChange = mutation({
  args: {
    userId: v.string(),
    targetPlan: v.string(),
    effectiveAt: v.number(),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    const user = users.find((u) => u._id.toString() === args.userId);
    if (!user) return { success: false };
    await ctx.db.patch(user._id, {
      pendingPlanChange: {
        targetPlan: args.targetPlan,
        effectiveAt: args.effectiveAt,
      },
    });
    return { success: true };
  },
});

// Clear a pending plan change (user changed their mind, e.g. clicked "Keep
// my plan" before the scheduled change took effect).
export const clearPendingPlanChange = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    const user = users.find((u) => u._id.toString() === args.userId);
    if (!user) return { success: false };
    await ctx.db.patch(user._id, { pendingPlanChange: undefined });
    return { success: true };
  },
});
