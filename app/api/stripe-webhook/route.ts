import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

// Webhook handler for Stripe subscription events. This is the source of truth
// for "what plan does the user actually have right now." Our app NEVER flips
// plan state on its own - every change to plan, subscriptionStatus, or
// subscriptionCurrentPeriodEnd flows through here from a verified Stripe event.

// Stripe sends webhook events as raw bodies that must be verified by signature.
// Next.js needs us to opt out of body parsing to read the raw bytes.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover" as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;

// Map a Stripe price unit_amount to our internal plan tier. Driven by the
// dollar amount because we use price_data (inline pricing) rather than fixed
// Stripe Price IDs in our checkout flow. If you migrate to fixed Price IDs
// later, replace this with a Price-ID lookup.
function tierFromAmount(unitAmount: number | null | undefined): 'pro' | 'elite' | null {
  if (unitAmount == null) return null;
  // Pro: $20/mo, $108/6mo, $192/yr (all in cents)
  if (unitAmount === 2000 || unitAmount === 10800 || unitAmount === 19200) return 'pro';
  // Elite: $40/mo, $216/6mo, $384/yr
  if (unitAmount === 4000 || unitAmount === 21600 || unitAmount === 38400) return 'elite';
  return null;
}

// Pull the plan tier from a Stripe subscription object by inspecting its
// first item's price. Fallback to the description if amount lookup fails.
function tierFromSubscription(sub: Stripe.Subscription): 'pro' | 'elite' | null {
  const item = sub.items?.data?.[0];
  if (!item) return null;
  const price = item.price;
  const fromAmount = tierFromAmount(price?.unit_amount);
  if (fromAmount) return fromAmount;
  // Fallback: scan the product name. Won't always be available depending on
  // expand settings, so we treat it as best-effort.
  const product = price?.product;
  if (typeof product === 'object' && product && 'name' in product) {
    const name = (product as Stripe.Product).name?.toLowerCase() || '';
    if (name.includes('elite')) return 'elite';
    if (name.includes('pro')) return 'pro';
  }
  return null;
}

export async function POST(request: NextRequest) {
  // 1) Verify signature. Without this anyone could forge an event and grant
  // themselves a paid plan. Reject anything that doesn't pass.
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }
  const body = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('[stripe-webhook] Signature verification failed:', err?.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  const convex = new ConvexHttpClient(convexUrl);

  try {
    switch (event.type) {
      // ──────────────────────────────────────────────────────────────────────
      // Initial subscription creation. Fires after the user completes Stripe
      // Checkout. We use this to attribute the new sub to a Convex user via
      // the `userId` we stuffed into checkout session metadata.
      // ──────────────────────────────────────────────────────────────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const subscriptionId = typeof session.subscription === 'string'
          ? session.subscription
          : session.subscription?.id;
        const customerId = typeof session.customer === 'string'
          ? session.customer
          : session.customer?.id;

        if (!userId || !subscriptionId || !customerId) {
          console.error('[stripe-webhook] checkout.session.completed missing required ids:', { userId, subscriptionId, customerId });
          break;
        }

        // Fetch the full subscription so we can read tier and period end.
        const sub = await stripe.subscriptions.retrieve(subscriptionId, {
          expand: ['items.data.price.product'],
        });
        const plan = tierFromSubscription(sub) || 'pro';
        const periodEndMs = (sub as any).current_period_end ? (sub as any).current_period_end * 1000 : undefined;

        await convex.mutation((api as any).auth.setStripeSubscription, {
          userId,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          subscriptionStatus: sub.status,
          subscriptionCurrentPeriodEnd: periodEndMs,
          plan,
        });
        console.log('[stripe-webhook] Linked subscription', subscriptionId, '→ user', userId, 'plan', plan);
        break;
      }

      // ──────────────────────────────────────────────────────────────────────
      // Any subsequent change: renewal, status flip (active ↔ past_due ↔
      // unpaid), or a tier change taking effect. We re-derive plan + status
      // + period end from the current state and patch.
      // ──────────────────────────────────────────────────────────────────────
      case 'customer.subscription.updated':
      case 'customer.subscription.created': {
        const sub = event.data.object as Stripe.Subscription;
        const plan = tierFromSubscription(sub) || undefined;
        const periodEndMs = (sub as any).current_period_end ? (sub as any).current_period_end * 1000 : undefined;

        // Do NOT clear pendingPlanChange here. Routine updates (cancel_at_
        // period_end flipping, payment status changes, etc.) must not wipe
        // the user's intent - the change has not yet taken effect.
        // The .deleted handler clears it explicitly when a cancel finalizes.
        await convex.mutation((api as any).auth.applyStripeSubscriptionUpdate, {
          stripeSubscriptionId: sub.id,
          subscriptionStatus: sub.status,
          subscriptionCurrentPeriodEnd: periodEndMs,
          plan,
          clearPendingChange: false,
        });
        console.log('[stripe-webhook]', event.type, sub.id, 'status:', sub.status, 'plan:', plan);
        break;
      }

      // ──────────────────────────────────────────────────────────────────────
      // Subscription ended for real. Either the user cancelled with cancel_
      // at_period_end and the period rolled over, or it was hard-cancelled
      // (admin, dispute, etc.). Drop the user to free.
      // ──────────────────────────────────────────────────────────────────────
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        await convex.mutation((api as any).auth.applyStripeSubscriptionCanceled, {
          stripeSubscriptionId: sub.id,
        });
        console.log('[stripe-webhook] Cancellation finalized', sub.id);
        break;
      }

      // ──────────────────────────────────────────────────────────────────────
      // Payment failed. Stripe will retry on its own (per your retry policy
      // in the dashboard). We mark the user past_due so the UI can warn them
      // but we don't yank their plan yet - Stripe decides when to give up
      // and fire subscription.deleted.
      // ──────────────────────────────────────────────────────────────────────
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = typeof (invoice as any).subscription === 'string'
          ? (invoice as any).subscription
          : (invoice as any).subscription?.id;
        if (subId) {
          await convex.mutation((api as any).auth.applyStripeSubscriptionUpdate, {
            stripeSubscriptionId: subId,
            subscriptionStatus: 'past_due',
          });
          console.log('[stripe-webhook] Payment failed for sub', subId);
        }
        break;
      }

      // ──────────────────────────────────────────────────────────────────────
      // Chargeback. Customer disputed the charge with their bank. The money
      // is being pulled back from our Stripe balance and we owe a $15 dispute
      // fee. Cancel the subscription immediately so they lose access -
      // there's no scenario where someone who chargebacks should keep paid
      // features. Stripe will fire customer.subscription.deleted afterwards,
      // which our handler above uses to drop the user to free.
      // ──────────────────────────────────────────────────────────────────────
      case 'charge.dispute.created': {
        const dispute = event.data.object as Stripe.Dispute;
        const chargeId = typeof dispute.charge === 'string' ? dispute.charge : dispute.charge?.id;
        if (!chargeId) break;
        try {
          const charge = await stripe.charges.retrieve(chargeId);
          const invoiceId = typeof charge.invoice === 'string' ? charge.invoice : charge.invoice?.id;
          if (!invoiceId) break;
          const invoice = await stripe.invoices.retrieve(invoiceId);
          const subId = typeof (invoice as any).subscription === 'string'
            ? (invoice as any).subscription
            : (invoice as any).subscription?.id;
          if (!subId) break;
          await stripe.subscriptions.cancel(subId);
          console.log('[stripe-webhook] Chargeback - cancelled sub', subId);
        } catch (e: any) {
          // If the sub is already cancelled (concurrent webhook, etc.),
          // Stripe throws. Swallow - we got the desired end state anyway.
          console.error('[stripe-webhook] Chargeback handler error:', e?.message || e);
        }
        break;
      }

      // ──────────────────────────────────────────────────────────────────────
      // Refund. Admin issued a refund in Stripe dashboard (or via API). Only
      // act on FULL refunds - partial refunds keep the sub active. On full
      // refund, cancel the subscription so the user loses access. They got
      // their money back, they shouldn't keep paid features.
      // ──────────────────────────────────────────────────────────────────────
      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        // charge.refunded is true only when fully refunded. Partial refunds
        // leave it false and keep amount_refunded < amount.
        if (!charge.refunded) break;
        const invoiceId = typeof charge.invoice === 'string' ? charge.invoice : charge.invoice?.id;
        if (!invoiceId) break;
        try {
          const invoice = await stripe.invoices.retrieve(invoiceId);
          const subId = typeof (invoice as any).subscription === 'string'
            ? (invoice as any).subscription
            : (invoice as any).subscription?.id;
          if (!subId) break;
          await stripe.subscriptions.cancel(subId);
          console.log('[stripe-webhook] Full refund - cancelled sub', subId);
        } catch (e: any) {
          console.error('[stripe-webhook] Refund handler error:', e?.message || e);
        }
        break;
      }

      default:
        // Ignore other events - we only care about subscription lifecycle.
        break;
    }
  } catch (e: any) {
    console.error('[stripe-webhook] Handler error for event', event.type, ':', e?.message || e);
    // Return 500 so Stripe retries. Idempotency is handled by our mutations
    // (each is a small idempotent patch keyed on stripeSubscriptionId).
    return NextResponse.json({ error: 'Internal handler error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
