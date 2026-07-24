// ============================================================================
// PLATFORM ANNOUNCEMENTS
// ----------------------------------------------------------------------------
// User side:  listForUser / markRead / markAllRead  -> topbar bell.
// Admin side: admin* functions, gated on users.isAdmin === true.
//
// Setup (one time, no env vars, no passwords):
//   Convex dashboard -> Data -> users -> your row -> add field isAdmin = true
// That is the whole grant. Flip it back to false to revoke.
//
// Every admin function runs requireUser() first, so the caller must present a
// valid session token for the userId it claims. NOTE: requireUser fails OPEN
// when AUTH_SESSION_SECRET is unset in the Convex env, in which case the only
// thing standing between a stranger and these functions is knowing an admin's
// user _id. Set AUTH_SESSION_SECRET if it is not already set.
// ============================================================================

import { query, mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { requireUser } from "./auth";

const MAX_FEED = 25;
const MAX_ADMIN_LIST = 60;

// Verify the caller is who they say they are, then that they are flagged admin.
async function requireAdminUser(
  ctx: any,
  args: { userId: string; sessionToken?: string },
): Promise<any> {
  await requireUser({ userId: args.userId, sessionToken: args.sessionToken });
  let u: any = null;
  try {
    u = await ctx.db.get(args.userId as any);
  } catch {
    u = null;
  }
  if (!u || u.isAdmin !== true) {
    throw new ConvexError("Not authorized.");
  }
  return u;
}

// Resolve a plan from a plain string userId. Callers pass whatever is in
// localStorage, so tolerate an id that is not a valid Convex Id.
async function planOf(ctx: any, userId: string | undefined): Promise<string> {
  if (!userId) return "free";
  try {
    const u: any = await ctx.db.get(userId as any);
    if (u && typeof u.plan === "string" && u.plan) return u.plan;
  } catch {
    // not a valid Id shape, fall through
  }
  return "free";
}

async function emailOf(ctx: any, userId: string | undefined): Promise<string | undefined> {
  if (!userId) return undefined;
  try {
    const u: any = await ctx.db.get(userId as any);
    if (u && typeof u.email === "string") return u.email;
  } catch {}
  return undefined;
}

function visibleTo(audience: string, plan: string): boolean {
  return audience === "all" || audience === plan;
}

// ----------------------------------------------------------------------------
// USER SIDE
// ----------------------------------------------------------------------------

// Feed for the topbar bell. Signed-out callers (no userId) get the 'all'
// announcements with everything marked read, so the bell never nags a guest.
export const listForUser = query({
  args: { userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("announcements")
      .withIndex("by_createdAt")
      .order("desc")
      .take(MAX_FEED);

    const plan = await planOf(ctx, args.userId);

    const visible = rows.filter(
      (r: any) => r.active !== false && visibleTo(r.audience, plan),
    );

    let readIds = new Set<string>();
    if (args.userId) {
      const reads = await ctx.db
        .query("announcementReads")
        .withIndex("by_user", (q: any) => q.eq("userId", args.userId))
        .collect();
      readIds = new Set(reads.map((r: any) => r.announcementId));
    }

    return visible.map((r: any) => ({
      id: r._id.toString(),
      title: r.title,
      body: r.body,
      link: r.link ?? "",
      linkLabel: r.linkLabel ?? "",
      createdAt: r.createdAt,
      read: args.userId ? readIds.has(r._id.toString()) : true,
    }));
  },
});

export const markRead = mutation({
  args: { userId: v.string(), announcementId: v.string() },
  handler: async (ctx, args) => {
    if (!args.userId) return { ok: false };
    const existing = await ctx.db
      .query("announcementReads")
      .withIndex("by_user_ann", (q: any) =>
        q.eq("userId", args.userId).eq("announcementId", args.announcementId),
      )
      .first();
    if (existing) return { ok: true };
    await ctx.db.insert("announcementReads", {
      userId: args.userId,
      userEmail: await emailOf(ctx, args.userId),
      announcementId: args.announcementId,
      readAt: Date.now(),
    });
    return { ok: true };
  },
});

// Bulk version so opening the bell costs one mutation instead of N.
export const markAllRead = mutation({
  args: { userId: v.string(), announcementIds: v.array(v.string()) },
  handler: async (ctx, args) => {
    if (!args.userId || args.announcementIds.length === 0) return { inserted: 0 };
    const reads = await ctx.db
      .query("announcementReads")
      .withIndex("by_user", (q: any) => q.eq("userId", args.userId))
      .collect();
    const have = new Set(reads.map((r: any) => r.announcementId));
    const email = await emailOf(ctx, args.userId);
    let inserted = 0;
    for (const id of args.announcementIds) {
      if (have.has(id)) continue;
      await ctx.db.insert("announcementReads", {
        userId: args.userId,
        userEmail: email,
        announcementId: id,
        readAt: Date.now(),
      });
      have.add(id);
      inserted++;
    }
    return { inserted };
  },
});

// ----------------------------------------------------------------------------
// ADMIN SIDE
// ----------------------------------------------------------------------------

// Cheap yes/no for the admin page to decide what to render. Returns false
// instead of throwing so a normal signed-in user just sees the not-found state.
export const amIAdmin = query({
  args: { userId: v.optional(v.string()), sessionToken: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.userId) return false;
    try {
      await requireAdminUser(ctx, { userId: args.userId, sessionToken: args.sessionToken });
      return true;
    } catch {
      return false;
    }
  },
});

export const adminList = query({
  args: { userId: v.string(), sessionToken: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requireAdminUser(ctx, args);
    const rows = await ctx.db
      .query("announcements")
      .withIndex("by_createdAt")
      .order("desc")
      .take(MAX_ADMIN_LIST);
    return rows.map((r: any) => ({
      id: r._id.toString(),
      title: r.title,
      body: r.body,
      audience: r.audience,
      link: r.link ?? "",
      linkLabel: r.linkLabel ?? "",
      active: r.active !== false,
      emailSent: r.emailSent === true,
      emailCount: r.emailCount ?? 0,
      createdAt: r.createdAt,
    }));
  },
});

export const adminCreate = mutation({
  args: {
    userId: v.string(),
    sessionToken: v.optional(v.string()),
    title: v.string(),
    body: v.string(),
    audience: v.string(),
    link: v.optional(v.string()),
    linkLabel: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdminUser(ctx, args);
    const title = args.title.trim();
    const body = args.body.trim();
    if (!title || !body) throw new ConvexError("Title and body are required.");
    const audience = ["all", "free", "pro", "elite"].includes(args.audience)
      ? args.audience
      : "all";
    const id = await ctx.db.insert("announcements", {
      title,
      body,
      audience,
      link: args.link?.trim() || undefined,
      linkLabel: args.linkLabel?.trim() || undefined,
      active: true,
      emailSent: false,
      emailCount: 0,
      createdAt: Date.now(),
    });
    return { id: id.toString() };
  },
});

// Show / hide an announcement without deleting it (read receipts stay valid).
export const adminSetActive = mutation({
  args: {
    userId: v.string(),
    sessionToken: v.optional(v.string()),
    id: v.string(),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireAdminUser(ctx, args);
    const id = ctx.db.normalizeId("announcements", args.id);
    if (!id) throw new ConvexError("Announcement not found.");
    await ctx.db.patch(id, { active: args.active });
    return { ok: true };
  },
});

// Recorded after the email blast so the admin list shows what actually went out.
export const adminRecordEmail = mutation({
  args: {
    userId: v.string(),
    sessionToken: v.optional(v.string()),
    id: v.string(),
    count: v.number(),
  },
  handler: async (ctx, args) => {
    await requireAdminUser(ctx, args);
    const id = ctx.db.normalizeId("announcements", args.id);
    if (!id) throw new ConvexError("Announcement not found.");
    await ctx.db.patch(id, { emailSent: args.count > 0, emailCount: args.count });
    return { ok: true };
  },
});

// Recipient list for the optional email blast. Skips rows with no email and
// rows explicitly marked unverified (those addresses tend to bounce).
export const adminRecipients = query({
  args: { userId: v.string(), sessionToken: v.optional(v.string()), audience: v.string() },
  handler: async (ctx, args) => {
    await requireAdminUser(ctx, args);
    const users = await ctx.db.query("users").collect();
    const out: { email: string; name: string }[] = [];
    for (const u of users as any[]) {
      if (!u.email || typeof u.email !== "string") continue;
      if (u.emailVerified === false) continue;
      const plan = typeof u.plan === "string" && u.plan ? u.plan : "free";
      if (!visibleTo(args.audience, plan)) continue;
      out.push({
        email: u.email,
        name: (u.firstName || u.name || "").toString().split(" ")[0] || "there",
      });
    }
    return out;
  },
});

// Audience sizes for the composer, so you can see the blast radius first.
export const adminAudienceCounts = query({
  args: { userId: v.string(), sessionToken: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requireAdminUser(ctx, args);
    const users = await ctx.db.query("users").collect();
    const counts = { all: 0, free: 0, pro: 0, elite: 0 };
    for (const u of users as any[]) {
      if (!u.email || u.emailVerified === false) continue;
      counts.all++;
      const plan = typeof u.plan === "string" && u.plan ? u.plan : "free";
      if (plan === "elite") counts.elite++;
      else if (plan === "pro") counts.pro++;
      else counts.free++;
    }
    return counts;
  },
});
