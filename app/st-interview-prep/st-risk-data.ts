export const ST_RISK_SECTIONS = [
  {
    title: 'Risk Measures',
    content: `<p><strong>Value at Risk (VaR):</strong> The maximum expected loss at a given confidence level over a given period. "95% 1-day VaR of $5M" means: on 19 out of 20 days, the desk will lose no more than $5M. VaR is the industry standard but has well-known limitations: it doesn't tell you what happens in the tail (the 5%), it assumes normally distributed returns (which underestimates extreme events), and it can be gamed by shifting positions just before the snapshot.</p>

<p><strong>Stress testing:</strong> Applying extreme but plausible scenarios (rates up 200 bps, equities down 30%, credit spreads blow out 500 bps) to the portfolio. More informative than VaR for understanding tail risk.</p>

<p><strong>Greeks-based risk:</strong> For derivatives books, risk is often expressed in terms of delta (directional exposure), gamma (convexity exposure), vega (volatility exposure), and theta (time decay). A trader might report: "I'm long $10M delta, short $2M gamma, and long $500K vega."</p>

<p><strong>DV01 / PV01:</strong> For fixed income, DV01 measures the dollar change in value for a 1 basis point change in yield. A position with $100K DV01 gains or loses $100K for every 1 bp move in rates.</p>`,
  },
  {
    title: 'P&amp;L Attribution',
    content: `<p>Every trading desk must explain <em>why</em> it made or lost money each day. P&amp;L attribution decomposes the daily return into its sources:</p>

<p><strong>Carry:</strong> The income from holding positions (coupon income on bonds, dividends on stocks, theta on options). Predictable and steady.</p>

<p><strong>Market moves:</strong> Gains or losses from changes in market prices (rates, spreads, equity prices, FX). This is the largest and most volatile component.</p>

<p><strong>Roll-down:</strong> The gain from a bond "rolling down" the yield curve as it ages (if the curve is upward sloping, a 5-year bond becomes a 4-year bond with a lower yield, pushing its price up).</p>

<p><strong>Spread change:</strong> For credit instruments, the P&amp;L impact from changes in credit spreads (distinct from moves in the risk-free rate).</p>

<p><strong>Trading P&amp;L:</strong> Gains from actively trading (buying and selling at a profit, capturing bid-ask spreads).</p>

<p><strong>Unexplained / residual:</strong> The portion not captured by the above. A large residual signals a problem with the risk model.</p>`,
  },
];
