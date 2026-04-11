export const GE_MODELING_SECTIONS = [
  {
    title: 'How GE Models Differ from LBO Models',
    content: `<p>The core difference: <strong>GE models focus on revenue growth and operating leverage, not debt paydown and leverage ratios.</strong> There's typically no (or minimal) debt, so the model doesn't need a detailed debt schedule. Instead, the model focuses on projecting revenue from first principles (cohort-by-cohort, product-by-product, segment-by-segment), modeling the path to profitability as operating leverage kicks in, and calculating returns based on equity value growth rather than the debt-equity dynamics of an LBO.</p>

<h4>Key Model Components</h4>

<p><strong>1. Revenue Build:</strong> The heart of the model. For a SaaS company, this might be built cohort-by-cohort: beginning ARR + new logo ARR + expansion ARR &minus; churned ARR &minus; contracted ARR = ending ARR. Each component has its own drivers: new logo ARR = number of new customers × average ACV; expansion ARR = beginning ARR × net expansion rate; churned ARR = beginning ARR × gross churn rate.</p>

<p>For a consumer marketplace, the revenue build might be: active buyers × transactions per buyer × average order value × take rate. For an enterprise services business: number of clients × average engagement size × utilization rate.</p>

<p><strong>2. Operating Expense Build:</strong> Project COGS (hosting, support, professional services) and OpEx (S&M, R&D, G&A) separately. Key assumptions: S&M as a percentage of revenue (should decline over time as growth becomes more efficient), R&D as a percentage of revenue (should stabilize), G&A as a percentage of revenue (should decline significantly as the company scales). The combined effect of revenue growth outpacing OpEx growth is <strong>operating leverage</strong>&mdash;the path to profitability.</p>

<p><strong>3. Cash Flow and Cash Needs:</strong> Free Cash Flow = Operating Income + D&A &minus; CapEx &minus; ΔWC &minus; SBC cash taxes (though SBC is non-cash, it's worth tracking for dilution). How long until the company is cash flow positive? How much additional capital will it need before reaching self-sustainability? This determines whether the company will need to raise more capital (diluting your ownership).</p>

<p><strong>4. Dilution Schedule:</strong> Project future fundraising rounds and option pool expansions. Each round dilutes existing shareholders. A GE investor's 25% ownership at entry might be 18% by exit after two subsequent rounds and option pool refreshes. The model must track fully diluted ownership at exit to calculate true returns.</p>

<p><strong>5. Returns Analysis:</strong> Entry at a known valuation. Exit at an assumed valuation (typically a multiple of forward ARR or EBITDA at exit, benchmarked against comparable public companies or recent M&A transactions). Exit Equity Value × Ownership % at Exit = Proceeds to the Fund. MOIC = Proceeds / Invested Capital. IRR is calculated based on the cash flow timeline (investment in Year 0, exit proceeds in Year 5).</p>

<div class="example-box">
<div class="example-label">Simplified GE Returns Model</div>
<p><strong>Entry:</strong> Invest $60M at $300M post-money (20% ownership). Company has $40M ARR growing 50%.</p>
<p><strong>Projection:</strong> ARR grows from $40M to $160M over 4 years (compound growth slowing from 50% to 30%). Company reaches profitability in Year 3 with 15% FCF margins by Year 4.</p>
<p><strong>Dilution:</strong> One follow-on round in Year 2 ($40M at $600M post-money). You exercise pro-rata rights and invest $12M to maintain your ~20% stake. Total invested: $72M. If you don't participate, your ownership dilutes to ~17%.</p>
<p><strong>Exit:</strong> Company exits in Year 4 at 12x forward ARR ($160M × 12 = $1,920M). Your 20% stake (assuming pro-rata participation) = $384M. MOIC = $384M / $72M = <strong>5.3x</strong>. IRR ≈ (5.3)^(1/4) &minus; 1 ≈ <strong>52%</strong>.</p>
<p><strong>Bear case:</strong> ARR grows to only $100M, exits at 8x. Exit value = $800M. Your 20% = $160M. MOIC = $160M / $72M = 2.2x. IRR ≈ 22%. Still acceptable.</p>
<p><strong>Downside case:</strong> ARR grows to $70M, exits at 6x. Exit value = $420M. Your 20% = $84M. MOIC = $84M / $72M = 1.2x. IRR ≈ 4%. The liquidation preference protects you: you'd receive at least $72M back (1x preference), so the downside is floored at 1.0x in this scenario.</p>
</div>`,
  },
  {
    title: 'Key Sensitivity Analyses',
    content: `<p>Build two-way sensitivity tables on: (1) exit ARR multiple vs. exit year ARR level, (2) revenue growth rate vs. entry valuation, and (3) dilution (# of future rounds) vs. exit multiple. These tables show the IC how robust the returns are across a range of assumptions and identify the key variables that most affect the outcome.</p>`,
  },
];
