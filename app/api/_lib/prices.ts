// Real Stripe Price IDs (live mode). Single source of truth for checkout and
// plan changes, so every subscription runs on a real, stable product + price
// instead of an auto-generated throwaway product. This is what makes buy /
// upgrade / downgrade / cancel behave like normal Stripe.
//
// If you ever rotate a price in Stripe, update it here and redeploy.

export type Billing = 'monthly' | '6month' | 'annual';
export type Tier = 'pro' | 'elite';

export const STRIPE_PRICE_IDS: Record<Tier, Record<Billing, string>> = {
  pro: {
    monthly: 'price_1ToSzCKvidJ7ZiydUkB8mmft',
    '6month': 'price_1ToSzCKvidJ7ZiydceWKUN6o',
    annual: 'price_1ToSzCKvidJ7Ziydb13jg5sq',
  },
  elite: {
    monthly: 'price_1ToSzTKvidJ7ZiydJJ0IY0Ms',
    '6month': 'price_1ToSzvKvidJ7ZiydXSvhWOx5',
    annual: 'price_1ToT08KvidJ7ZiydYyPPAhKd',
  },
};

// Amounts in cents. Used where the code reasons about price (tier / no-op /
// upgrade-vs-downgrade) without a Stripe round-trip. Must match the prices above.
export const PRICE_AMOUNTS: Record<Tier, Record<Billing, number>> = {
  pro: { monthly: 2000, '6month': 10800, annual: 19200 },
  elite: { monthly: 4000, '6month': 21600, annual: 38400 },
};
