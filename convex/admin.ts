// ─────────────────────────────────────────────────────────────────────────────
// ADMIN BACKFILL
// ─────────────────────────────────────────────────────────────────────────────
// One-time mutation to populate the new `userEmail` field on existing rows
// in tables that were created before the schema change. Run this once from
// the Convex dashboard after deploying the schema update.
//
// How to run:
//   1. Open Convex dashboard → Functions → admin:backfillUserEmails
//   2. Click "Run function" with empty args ({})
//   3. Returns { updated: <number>, perTable: { ... } }
//
// Safe to re-run: skips rows that already have userEmail set.
// ─────────────────────────────────────────────────────────────────────────────

import { mutation } from "./_generated/server";

const TABLES = [
  "userProgress",
  "mockResponses",
  "coachConvos",
  "flashPerf",
  "diagHistory",
  "weeklyUsage",
] as const;

export const backfillUserEmails = mutation({
  args: {},
  handler: async (ctx) => {
    // Build a userId -> email lookup once. Cheap at our scale (single-digit
    // to low-hundreds of users); avoid N+1 lookups across the tables below.
    const users = await ctx.db.query("users").collect();
    const emailByUserId: Record<string, string> = {};
    for (const u of users) {
      if (typeof u.email === "string") {
        emailByUserId[u._id] = u.email;
      }
    }

    const perTable: Record<string, number> = {};
    let totalUpdated = 0;

    for (const tableName of TABLES) {
      const rows = await ctx.db.query(tableName as any).collect();
      let count = 0;
      for (const r of rows as any[]) {
        if (r.userEmail) continue; // already populated
        const email = r.userId && emailByUserId[r.userId];
        if (!email) continue;
        await ctx.db.patch(r._id, { userEmail: email });
        count++;
      }
      perTable[tableName] = count;
      totalUpdated += count;
    }

    return { updated: totalUpdated, perTable };
  },
});
