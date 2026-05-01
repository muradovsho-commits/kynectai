import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover" as any,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === "string" ? body.email : undefined;
    const plan = body.plan === "elite" ? "elite" : "pro";
    const billing = body.billing === "annual" ? "annual" : "monthly";

    const prices: Record<string, Record<string, { amount: number; name: string; desc: string }>> = {
      pro: {
        monthly: { amount: 2000, name: "OfferBell Pro - Monthly", desc: "Full access to all prep tools, AI Coach, and Mock Interview - billed monthly" },
        annual: { amount: 19900, name: "OfferBell Pro - Annual", desc: "Full access to all prep tools, AI Coach, and Mock Interview - billed annually" },
      },
      elite: {
        monthly: { amount: 4000, name: "OfferBell Elite - Monthly", desc: "Higher AI limits, priority support, and early feature access - billed monthly" },
        annual: { amount: 39900, name: "OfferBell Elite - Annual", desc: "Higher AI limits, priority support, and early feature access - billed annually" },
      },
    };

    const p = prices[plan][billing];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: email || undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: p.name, description: p.desc },
            unit_amount: p.amount,
            recurring: { interval: billing === "annual" ? "year" : "month" },
          },
          quantity: 1,
        },
      ],
      success_url: `${request.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}&billing=${billing}`,
      cancel_url: `${request.nextUrl.origin}/checkout`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
