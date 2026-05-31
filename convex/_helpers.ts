// Small helper used by per-feature mutations to look up a user's email
// and stamp it into denormalized table rows. The goal is purely cosmetic:
// the Convex dashboard shows `userEmail` next to every row so you can tell
// at a glance which user a piece of data belongs to without clicking
// through the userId reference.
//
// Defensive: if the user record is missing or has no email field, returns
// undefined - the caller writes undefined into the optional `userEmail`
// field and the row still inserts cleanly.

import { Id } from "./_generated/dataModel";

export async function getUserEmail(ctx: any, userId: string): Promise<string | undefined> {
  if (!userId) return undefined;
  try {
    // userId in our app is stored as a string but is actually a Convex Id.
    // Cast it; if invalid, ctx.db.get throws and we just return undefined.
    const user = await ctx.db.get(userId as Id<"users">);
    if (!user) return undefined;
    return typeof user.email === "string" ? user.email : undefined;
  } catch {
    return undefined;
  }
}
