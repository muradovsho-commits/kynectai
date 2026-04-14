import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover" as any,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === "string" ? body.email : undefined;
    const plan = body.plan === "annual" ? "annual" : "monthly";

    const isAnnual = plan === "annual";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: email || undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: isAnnual ? "OfferBell Pro - Annual" : "OfferBell Pro - Monthly",
              description: isAnnual
                ? "Unlimited outreach, AI Coach, and more - billed annually"
                : "Unlimited outreach, AI Coach, and more - billed monthly",
            },
            unit_amount: isAnnual ? 19900 : 2000,
            recurring: { interval: isAnnual ? "year" : "month" },
          },
          quantity: 1,
        },
      ],
      success_url: `${request.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancel_url: `${request.nextUrl.origin}/checkout`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
