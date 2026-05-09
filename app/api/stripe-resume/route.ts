import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

// Undo a scheduled cancel or scheduled tier downgrade. Two cases:
//   • cancel_at_period_end is set → flip it back to false. The sub renews
//     normally at period end. No tier change.
//   • A subscription schedule exists (used for tier downgrades) → release
//     it. The sub stays on its current phase.
// Either way the user keeps everything they had.

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

    const sub = await stripe.subscriptions.retrieve(subscriptionId);

    // Case 1: scheduled cancel - undo by setting cancel_at_period_end false.
    if ((sub as any).cancel_at_period_end) {
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
      });
    }

    // Case 2: scheduled tier change - release any active subscription
    // schedule pointing at this sub. release() removes the schedule but
    // keeps the underlying sub intact at its current phase.
    const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer?.id;
    if (customerId) {
      const schedules = await stripe.subscriptionSchedules.list({ customer: customerId, limit: 10 });
      for (const sched of schedules.data) {
        if (sched.subscription === subscriptionId && (sched.status === 'active' || sched.status === 'not_started')) {
          try { await stripe.subscriptionSchedules.release(sched.id); } catch {}
        }
      }
    }

    // Clear the pending change from our DB. The next webhook will reflect
    // the now-clean state, but clearing immediately keeps the UI snappy.
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    await convex.mutation((api as any).auth.clearPendingPlanChange, { userId });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("[stripe-resume] error:", e?.message || e);
    return NextResponse.json({ error: e?.message || "Resume failed" }, { status: 500 });
  }
}
