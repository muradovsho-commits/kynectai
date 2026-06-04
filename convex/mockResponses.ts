import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserEmail } from "./_helpers";
import { requireUser } from "./auth";

// List all mock interview responses for a user. Returned in insertion order
// (newest first); pages can re-sort as needed.
export const listResponses = query({
  args: { userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()) },
  handler: async (ctx, { sessionToken, serverSecret, userId }) => {
    await requireUser({ userId, sessionToken, serverSecret });
    const rows = await ctx.db
      .query("mockResponses")
      .withIndex("by_user", q => q.eq("userId", userId))
      .collect();
    // Return in newest-first order (timestamp descending)
    return rows.sort((a, b) => b.timestamp - a.timestamp).map(r => ({
      id: r.entryId,
      questionId: r.questionId,
      trackId: r.trackId,
      transcript: r.transcript,
      grade: r.grade,
      overallFeedback: r.overallFeedback,
      strengths: r.strengths,
      weaknesses: r.weaknesses,
      wordsPerMin: r.wordsPerMin,
      durationSec: r.durationSec,
      timestamp: r.timestamp,
      hidden: r.hidden,
      category: r.category,
    }));
  },
});

// Insert or update a single response by entryId. Idempotent: calling with
// the same entryId replaces the existing row.
export const upsertResponse = mutation({
  args: {
    userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()),
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
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireUser(args);
    const { sessionToken: _st, serverSecret: _ss, ...clean } = args;
    const existing = await ctx.db
      .query("mockResponses")
      .withIndex("by_user_entry", q => q.eq("userId", args.userId).eq("entryId", args.entryId))
      .first();
    const userEmail = await getUserEmail(ctx, args.userId);
    if (existing) {
      await ctx.db.patch(existing._id, {
        questionId: args.questionId,
        trackId: args.trackId,
        transcript: args.transcript,
        grade: args.grade,
        overallFeedback: args.overallFeedback,
        strengths: args.strengths,
        weaknesses: args.weaknesses,
        wordsPerMin: args.wordsPerMin,
        durationSec: args.durationSec,
        timestamp: args.timestamp,
        hidden: args.hidden,
        category: args.category,
        userEmail,
      });
    } else {
      await ctx.db.insert("mockResponses", { ...clean, userEmail });
    }
  },
});

// Toggle the hidden flag on a single response.
export const setResponseHidden = mutation({
  args: { userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()), entryId: v.string(), hidden: v.boolean() },
  handler: async (ctx, { sessionToken, serverSecret, userId, entryId, hidden }) => {
    await requireUser({ userId, sessionToken, serverSecret });
    const existing = await ctx.db
      .query("mockResponses")
      .withIndex("by_user_entry", q => q.eq("userId", userId).eq("entryId", entryId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { hidden });
    }
  },
});

// Delete a single response (used by future admin cleanup; the user-facing
// UI now hides instead of deletes, but we keep the mutation available).
export const deleteResponse = mutation({
  args: { userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()), entryId: v.string() },
  handler: async (ctx, { sessionToken, serverSecret, userId, entryId }) => {
    await requireUser({ userId, sessionToken, serverSecret });
    const existing = await ctx.db
      .query("mockResponses")
      .withIndex("by_user_entry", q => q.eq("userId", userId).eq("entryId", entryId))
      .first();
    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

// Bulk import - used on first load to migrate existing localStorage data
// for users whose responses currently live in the userProgress blob.
// Skips any entryId that already exists, so this is safe to call repeatedly.
export const importResponses = mutation({
  args: {
    userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()),
    entries: v.array(v.object({
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
      category: v.optional(v.string()),
    })),
  },
  handler: async (ctx, { sessionToken, serverSecret, userId, entries }) => {
    await requireUser({ userId, sessionToken, serverSecret });
    const userEmail = await getUserEmail(ctx, userId);
    for (const e of entries) {
      const existing = await ctx.db
        .query("mockResponses")
        .withIndex("by_user_entry", q => q.eq("userId", userId).eq("entryId", e.entryId))
        .first();
      if (!existing) {
        await ctx.db.insert("mockResponses", { userId, ...e, userEmail });
      }
    }
  },
});

// Dashboard-only lightweight query. Returns only count + avgGrade.
// No transcripts, no recent items, no per-day timestamps.
// Per-page bandwidth: ~0.1KB.
//
// `grade` is stored as a categorical string ('Great' | 'Good' | 'Bad') per
// the schema and mock-interview page. We map to numeric scores so the
// dashboard can display "Avg score X%". Same conventions as the existing
// scoring elsewhere: Great=100, Good=70, Bad=30.
export const getMockStats = query({
  args: { userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()) },
  handler: async (ctx, { sessionToken, serverSecret, userId }) => {
    await requireUser({ userId, sessionToken, serverSecret });
    const rows = await ctx.db
      .query("mockResponses")
      .withIndex("by_user", q => q.eq("userId", userId))
      .collect();
    // 'hidden' now only collapses the review in the UI; the attempt still
    // counts toward stats, so we aggregate over ALL rows.
    const count = rows.length;
    const gradeToScore = (g: string): number => {
      if (g === 'Great') return 100;
      if (g === 'Good') return 70;
      if (g === 'Bad') return 30;
      return 0;
    };
    const totalScore = rows.reduce((s, r) => s + gradeToScore(r.grade), 0);
    const avgGrade = count > 0 ? Math.round(totalScore / count) : 0;
    return { count, avgGrade };
  },
});

// Per-topic aggregate for the Skill Heatmap. Buckets a user's mock responses
// for one track by the question's category, mapping grade -> score
// (Great=100, Good=70, Bad=30). Lightweight: returns only per-category counts
// and score sums, no transcripts. Counts all attempts (hidden = collapsed UI).
export const getMockTopicStats = query({
  args: { userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()), trackId: v.string() },
  handler: async (ctx, { sessionToken, serverSecret, userId, trackId }) => {
    await requireUser({ userId, sessionToken, serverSecret });
    const rows = await ctx.db
      .query("mockResponses")
      .withIndex("by_user", q => q.eq("userId", userId))
      .collect();
    const gradeToScore = (g: string): number => {
      if (g === 'Great') return 100;
      if (g === 'Good') return 70;
      if (g === 'Bad') return 30;
      return 0;
    };
    const byCat: Record<string, { count: number; scoreSum: number }> = {};
    for (const r of rows) {
      if (r.trackId !== trackId) continue;
      if (!r.category) continue;
      const c = byCat[r.category] || { count: 0, scoreSum: 0 };
      c.count += 1;
      c.scoreSum += gradeToScore(r.grade);
      byCat[r.category] = c;
    }
    return Object.entries(byCat).map(([category, d]) => ({
      category, count: d.count, scoreSum: d.scoreSum,
    }));
  },
});

// One-time backfill: set category on rows that don't have one yet. The client
// derives the category from its flashcard data and sends entryId->category
// pairs. Only patches rows where category is currently empty, so it is safe to
// call repeatedly and never overwrites real data.
export const backfillCategories = mutation({
  args: {
    userId: v.string(), sessionToken: v.optional(v.string()), serverSecret: v.optional(v.string()),
    items: v.array(v.object({ entryId: v.string(), category: v.string() })),
  },
  handler: async (ctx, { sessionToken, serverSecret, userId, items }) => {
    await requireUser({ userId, sessionToken, serverSecret });
    for (const it of items) {
      const existing = await ctx.db
        .query("mockResponses")
        .withIndex("by_user_entry", q => q.eq("userId", userId).eq("entryId", it.entryId))
        .first();
      if (existing && !existing.category) {
        await ctx.db.patch(existing._id, { category: it.category });
      }
    }
  },
});
