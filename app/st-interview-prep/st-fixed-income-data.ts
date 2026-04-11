export const ST_FIXED_INCOME_SECTIONS = [
  {
    title: 'Government Bonds (Rates)',
    content: `<p>Government bonds (US Treasuries, German Bunds, UK Gilts, Japanese JGBs) are the foundation of fixed income markets. They're the risk-free benchmark against which all other fixed income instruments are priced.</p>

<p><strong>The yield curve</strong> plots government bond yields across maturities. In a normal environment, the curve slopes upward (longer maturities = higher yields, compensating for time and uncertainty). An inverted curve (short rates above long rates) historically predicts recessions with high reliability. The shape of the curve is driven by central bank policy (short end), inflation expectations (medium term), and term premium (long end).</p>

<p>Rates traders express views on the <strong>level</strong> of rates (will rates rise or fall?), the <strong>slope</strong> of the curve (will it steepen or flatten?), and the <strong>curvature</strong> (will the belly outperform or underperform the wings?). These trades are executed using cash bonds, futures (Treasury futures are among the most liquid instruments in the world), and interest rate swaps.</p>

<h4>Duration and Convexity</h4>

<p><strong>Duration</strong> measures a bond's price sensitivity to changes in interest rates. A bond with 7-year duration falls approximately 7% if rates rise by 1%. Duration is the most fundamental risk measure in fixed income. Modified duration gives the percentage change; dollar duration gives the dollar change for a given notional amount.</p>

<p><strong>Convexity</strong> captures the curvature of the price-yield relationship. For large rate moves, duration alone underestimates the price change (bonds are convex: they gain more when rates fall than they lose when rates rise by the same amount). Positive convexity is valuable; negative convexity (common in mortgage-backed securities) is a risk.</p>

<div class="formula-box">
ΔPrice ≈ −Duration × ΔYield + ½ × Convexity × (ΔYield)²
</div>`,
  },
  {
    title: 'Corporate Credit',
    content: `<p>Corporate bond trading involves investment-grade (IG) and high-yield (HY) bonds issued by companies. Unlike Treasuries, corporate bonds carry credit risk&mdash;the risk that the issuer defaults. The <strong>credit spread</strong> (the yield premium over comparable Treasuries) compensates investors for this risk.</p>

<p>IG spreads typically range from 50&ndash;200 basis points. HY spreads range from 300&ndash;800+ bps, widening dramatically during stress (1,000+ bps in severe crises). Credit traders analyze companies' fundamental credit quality (leverage, coverage, FCF) and make relative value judgments: Is Company A's 5-year bond cheap or rich relative to Company B's, given their relative credit profiles?</p>`,
  },
  {
    title: 'Structured Products',
    content: `<p><strong>Mortgage-Backed Securities (MBS):</strong> Bonds backed by pools of residential or commercial mortgages. MBS carry prepayment risk: when rates fall, homeowners refinance, and the MBS investor gets their principal back early (at the worst possible time, since they now have to reinvest at lower rates). This creates negative convexity. Agency MBS (guaranteed by Fannie Mae, Freddie Mac, Ginnie Mae) have no credit risk; non-agency MBS carry credit risk.</p>

<p><strong>Asset-Backed Securities (ABS):</strong> Bonds backed by pools of auto loans, credit card receivables, student loans, or other consumer/commercial assets. Structures typically involve multiple tranches with different risk/return profiles.</p>

<p><strong>Collateralized Loan Obligations (CLOs):</strong> Pools of leveraged loans (typically TLBs) tranched into senior, mezzanine, and equity pieces. CLOs are a major source of demand for leveraged loans and a significant trading market in their own right.</p>`,
  },
];
