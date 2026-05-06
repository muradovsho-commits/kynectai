import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

// Schedules a subscription to cancel at period end. Stripe will keep billing
// access (paid features) intact until the period rolls over, then fire
// customer.subscription.deleted, which our webhook handles to flip the user
// to free in the DB. We do NOT change the DB plan here — only Stripe does
// (via webhook). This is the entire point of routing through Stripe.

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover" as any,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const userId = typeof body.userId === "string" ? body.userId : undefined;
    const subscriptionId = typeof body.subscriptionId === "string" ? body.subscriptionId : undefined;
    if (!userId || !subscriptionId) {
      return NextResponse.json({ error: "Missing userId or subscriptionId" }, { status: 400 });
    }

    // Tell Stripe to cancel at period end. This preserves access until the
    // already-paid-for period ends.
    const updated = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    // Record the user's intent in our DB so the UI can show "Scheduled to
    // cancel on [date]". The webhook will clear this when the actual change
    // takes effect.
    const periodEndMs = (updated as any).current_period_end
      ? (updated as any).current_period_end * 1000
      : Date.now();

    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    await convex.mutation((api as any).auth.setPendingPlanChange, {
      userId,
      targetPlan: 'free',
      effectiveAt: periodEndMs,
    });

    return NextResponse.json({
      success: true,
      effectiveAt: periodEndMs,
    });
  } catch (e: any) {
    console.error("[stripe-cancel] error:", e?.message || e);
    return NextResponse.json({ error: e?.message || "Cancel failed" }, { status: 500 });
  }
}
