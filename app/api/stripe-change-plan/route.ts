import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

// Switch tier (pro ↔ elite). Two paths:
//   • Upgrade (pro → elite): instant. Stripe prorates and bills the diff.
//   • Downgrade (elite → pro): scheduled. The new tier kicks in at the next
//     billing cycle, the user keeps elite features until then. Implemented
//     via a Stripe Subscription Schedule.

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover" as any,
});

// Same price tables as /api/checkout — kept in this file to keep the route
// self-contained. If you ever migrate to fixed Stripe Price IDs, this is
// the second place to update (the first is /api/checkout/route.ts).
const PRICES: Record<string, Record<string, { amount: number; name: string; desc: string; interval: 'month' | 'year'; intervalCount: number }>> = {
  pro: {
    monthly: { amount: 2000, name: "OfferBell Pro - Monthly", desc: "Pro plan, monthly billing", interval: "month", intervalCount: 1 },
    "6month": { amount: 10800, name: "OfferBell Pro - 6 Month", desc: "Pro plan, 6-month billing", interval: "month", intervalCount: 6 },
    annual: { amount: 19200, name: "OfferBell Pro - Annual", desc: "Pro plan, annual billing", interval: "year", intervalCount: 1 },
  },
  elite: {
    monthly: { amount: 4000, name: "OfferBell Elite - Monthly", desc: "Elite plan, monthly billing", interval: "month", intervalCount: 1 },
    "6month": { amount: 21600, name: "OfferBell Elite - 6 Month", desc: "Elite plan, 6-month billing", interval: "month", intervalCount: 6 },
    annual: { amount: 38400, name: "OfferBell Elite - Annual", desc: "Elite plan, annual billing", interval: "year", intervalCount: 1 },
  },
};

function billingFromInterval(interval: string | undefined, count: number | undefined): 'monthly' | '6month' | 'annual' {
  if (interval === 'year') return 'annual';
  if (interval === 'month' && count === 6) return '6month';
  return 'monthly';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const userId = typeof body.userId === "string" ? body.userId : undefined;
    const subscriptionId = typeof body.subscriptionId === "string" ? body.subscriptionId : undefined;
    const targetPlan = body.targetPlan === 'elite' ? 'elite' : body.targetPlan === 'pro' ? 'pro' : null;
    if (!userId || !subscriptionId || !targetPlan) {
      return NextResponse.json({ error: "Missing userId, subscriptionId, or targetPlan" }, { status: 400 });
    }

    // Look up the current sub to find its billing cadence and current item
    // — we need both to construct the right new price object.
    const sub = await stripe.subscriptions.retrieve(subscriptionId);
    const currentItem = sub.items?.data?.[0];
    if (!currentItem) {
      return NextResponse.json({ error: "Subscription has no items" }, { status: 400 });
    }
    const currentInterval = currentItem.price?.recurring?.interval;
    const currentIntervalCount = currentItem.price?.recurring?.interval_count;
    const billing = billingFromInterval(currentInterval, currentIntervalCount);
    const newPriceCfg = PRICES[targetPlan][billing];

    // Determine direction.
    const currentAmount = currentItem.price?.unit_amount || 0;
    const isUpgrade = newPriceCfg.amount > currentAmount;

    if (isUpgrade) {
      // Instant upgrade. Stripe prorates and charges the difference now.
      await stripe.subscriptions.update(subscriptionId, {
        items: [{
          id: currentItem.id,
          price_data: {
            currency: 'usd',
            product_data: { name: newPriceCfg.name, description: newPriceCfg.desc },
            unit_amount: newPriceCfg.amount,
            recurring: { interval: newPriceCfg.interval, interval_count: newPriceCfg.intervalCount },
          },
        }],
        proration_behavior: 'always_invoice',
        metadata: { userId, plan: targetPlan, billing },
      });
      // Don't touch DB — webhook will reflect the new plan via the
      // resulting customer.subscription.updated event.
      return NextResponse.json({ success: true, immediate: true });
    }

    // Downgrade — schedule the change at period end. We do this via a
    // Subscription Schedule: phase 1 is the current sub, phase 2 starts at
    // current_period_end with the new price.
    // In newer Stripe API versions, current_period_end lives on the
    // subscription item, not the subscription object. Try item first.
    const periodEnd = (currentItem as any).current_period_end
      ?? (sub as any).current_period_end
      ?? null;
    if (!periodEnd) {
      return NextResponse.json({ error: "Subscription has no current_period_end" }, { status: 400 });
    }

    // Pull any active discounts on the current subscription so we can carry
    // them onto the new phases. Without this, schedule phases drop the
    // existing coupon/promo and the user gets billed full price at the next
    // invoice — bad for promo'd founder accounts and any future discounted
    // customers.
    const subDiscounts: { coupon?: string; promotion_code?: string }[] = [];
    const rawDiscounts = (sub as any).discounts;
    if (Array.isArray(rawDiscounts)) {
      for (const d of rawDiscounts) {
        const discountObj = typeof d === 'string' ? null : d;
        const couponId = discountObj?.coupon?.id || (typeof d === 'object' && d?.coupon ? (typeof d.coupon === 'string' ? d.coupon : d.coupon.id) : undefined);
        const promoId = discountObj?.promotion_code?.id || (typeof d === 'object' && d?.promotion_code ? (typeof d.promotion_code === 'string' ? d.promotion_code : d.promotion_code.id) : undefined);
        if (couponId) subDiscounts.push({ coupon: couponId });
        else if (promoId) subDiscounts.push({ promotion_code: promoId });
      }
    }
    // Older Stripe shape: top-level `discount` (singular). Keep as a fallback.
    const legacyDiscount = (sub as any).discount;
    if (subDiscounts.length === 0 && legacyDiscount?.coupon?.id) {
      subDiscounts.push({ coupon: legacyDiscount.coupon.id });
    }

    // If a schedule already exists for this sub, release it first to start clean.
    const existingSchedules = await stripe.subscriptionSchedules.list({ customer: typeof sub.customer === 'string' ? sub.customer : sub.customer.id, limit: 10 });
    for (const sched of existingSchedules.data) {
      if (sched.subscription === subscriptionId && (sched.status === 'active' || sched.status === 'not_started')) {
        try { await stripe.subscriptionSchedules.release(sched.id); } catch {}
      }
    }

    // Create a schedule from the existing subscription, then update its phases.
    const schedule = await stripe.subscriptionSchedules.create({
      from_subscription: subscriptionId,
    });

    await stripe.subscriptionSchedules.update(schedule.id, {
      end_behavior: 'release',
      phases: [
        // Phase 1: current state, ends at period end. Re-uses the existing
        // Product and matches the current price exactly. Carries existing
        // discounts so the user isn't double-charged before the swap.
        {
          items: [{
            price_data: {
              currency: 'usd',
              product: typeof currentItem.price?.product === 'string'
                ? currentItem.price.product
                : (currentItem.price?.product as any)?.id,
              unit_amount: currentAmount,
              recurring: {
                interval: currentInterval as 'month' | 'year',
                interval_count: currentIntervalCount as number,
              },
            } as any,
            quantity: 1,
          }],
          start_date: (schedule.phases[0]?.start_date) as any,
          end_date: periodEnd,
          proration_behavior: 'none',
          discounts: subDiscounts.length > 0 ? subDiscounts : undefined,
        } as any,
        // Phase 2: new tier kicks in at period end. Stripe Subscription
        // Schedules don't accept `product_data` for inline product creation
        // — they need an existing Product ID. We reuse the current sub's
        // Product and just change the unit_amount. The webhook's
        // tierFromAmount() resolves the actual tier on the resulting
        // subscription.updated event by reading unit_amount.
        // Discounts carry over so promos persist past tier changes.
        {
          items: [{
            price_data: {
              currency: 'usd',
              product: typeof currentItem.price?.product === 'string'
                ? currentItem.price.product
                : (currentItem.price?.product as any)?.id,
              unit_amount: newPriceCfg.amount,
              recurring: { interval: newPriceCfg.interval, interval_count: newPriceCfg.intervalCount },
            } as any,
            quantity: 1,
          }],
          proration_behavior: 'none',
          discounts: subDiscounts.length > 0 ? subDiscounts : undefined,
          metadata: { userId, plan: targetPlan, billing },
        } as any,
      ],
      metadata: { userId, targetPlan, billing },
    });

    // Record the pending change in our DB so the UI shows "Scheduled to
    // switch to Pro on [date]" until the webhook fires.
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    await convex.mutation((api as any).auth.setPendingPlanChange, {
      userId,
      targetPlan,
      effectiveAt: periodEnd * 1000,
    });

    return NextResponse.json({ success: true, immediate: false, effectiveAt: periodEnd * 1000 });
  } catch (e: any) {
    console.error("[stripe-change-plan] error:", e?.message || e);
    return NextResponse.json({ error: e?.message || "Plan change failed" }, { status: 500 });
  }
}
