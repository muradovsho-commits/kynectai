import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// List all mock interview responses for a user. Returned in insertion order
// (newest first); pages can re-sort as needed.
export const listResponses = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
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
    }));
  },
});

// Insert or update a single response by entryId. Idempotent: calling with
// the same entryId replaces the existing row.
export const upsertResponse = mutation({
  args: {
    userId: v.string(),
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
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("mockResponses")
      .withIndex("by_user_entry", q => q.eq("userId", args.userId).eq("entryId", args.entryId))
      .first();
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
      });
    } else {
      await ctx.db.insert("mockResponses", args);
    }
  },
});

// Toggle the hidden flag on a single response.
export const setResponseHidden = mutation({
  args: { userId: v.string(), entryId: v.string(), hidden: v.boolean() },
  handler: async (ctx, { userId, entryId, hidden }) => {
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
  args: { userId: v.string(), entryId: v.string() },
  handler: async (ctx, { userId, entryId }) => {
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
    userId: v.string(),
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
    })),
  },
  handler: async (ctx, { userId, entries }) => {
    for (const e of entries) {
      const existing = await ctx.db
        .query("mockResponses")
        .withIndex("by_user_entry", q => q.eq("userId", userId).eq("entryId", e.entryId))
        .first();
      if (!existing) {
        await ctx.db.insert("mockResponses", { userId, ...e });
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
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const rows = await ctx.db
      .query("mockResponses")
      .withIndex("by_user", q => q.eq("userId", userId))
      .collect();
    const visible = rows.filter(r => !r.hidden);
    const count = visible.length;
    const gradeToScore = (g: string): number => {
      if (g === 'Great') return 100;
      if (g === 'Good') return 70;
      if (g === 'Bad') return 30;
      return 0;
    };
    const totalScore = visible.reduce((s, r) => s + gradeToScore(r.grade), 0);
    const avgGrade = count > 0 ? Math.round(totalScore / count) : 0;
    return { count, avgGrade };
  },
});
