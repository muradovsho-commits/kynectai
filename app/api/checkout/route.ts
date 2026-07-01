import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getAuthUserId, unauthorizedResponse, getCorsHeaders } from "../_lib/auth";
import { STRIPE_PRICE_IDS } from "../_lib/prices";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover" as any,
});

export async function POST(request: NextRequest) {
  try {
    const corsHeaders = getCorsHeaders(request);
    const authUserId = getAuthUserId(request);
    if (!authUserId) return unauthorizedResponse(corsHeaders);

    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === "string" ? body.email : undefined;
    // Critical: userId is what the webhook uses to attribute the resulting
    // subscription back to a Convex user. If this is missing, the user pays
    // but their plan never updates in our DB. Hard-fail rather than silently
    // create an orphan subscription.
    const userId = typeof body.userId === "string" ? body.userId : undefined;
    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId. Please refresh and sign in again." },
        { status: 400 }
      );
    }
    // Auth check: prevent creating a checkout session against someone else's
    // userId (which would route their successful-payment webhook to attach
    // the subscription to the attacker's account).
    if (authUserId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403, headers: corsHeaders });
    }
    const plan = body.plan === "elite" ? "elite" : "pro";
    const billing = body.billing === "annual" ? "annual" : body.billing === "6month" ? "6month" : "monthly";

    const priceId = STRIPE_PRICE_IDS[plan][billing];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: email || undefined,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // Metadata flows into the webhook's checkout.session.completed event,
      // so the webhook can look up the right Convex user and attach the
      // newly-created subscription. Also stamped on the subscription itself
      // so future subscription.updated/deleted events still know the user.
      metadata: { userId, plan, billing },
      subscription_data: {
        metadata: { userId, plan, billing },
      },
      success_url: `${request.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}&billing=${billing}`,
      cancel_url: `${request.nextUrl.origin}/checkout`,
      allow_promotion_codes: true,
      // Adds a small note below Stripe's "Subscribe" button with markdown
      // links to our policies. This works without any extra Stripe dashboard
      // setup. (consent_collection.terms_of_service requires you to first
      // configure a "Public business name" and "Terms link" in Stripe
      // Settings - we don't enforce that path to avoid breaking checkout if
      // the dashboard config is missing.)
      custom_text: {
        submit: {
          message: "By subscribing, you agree to our [Terms of Service](https://offerbell.org/terms), [Privacy Policy](https://offerbell.org/privacy), and [Refund Policy](https://offerbell.org/refund).",
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
