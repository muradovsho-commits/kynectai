export const RE_INTERVIEW_SECTIONS = [
  {
    title: 'The Format Across the Three Tracks',
    content: `<p>Real estate interviews test the shared foundation everywhere, then add track-specific depth. Knowing what each seat emphasizes lets you prepare the right material instead of over-indexing on the wrong thing.</p>

<table class="comparison-table">
<tr><th>Track</th><th>Heaviest emphasis</th><th>Signature question</th></tr>
<tr><td>REPE</td><td>Asset-level underwriting, the waterfall, levered returns, "walk me through a deal"</td><td>Build/critique a pro forma; run the promote; which strategy is this</td></tr>
<tr><td>REIB</td><td>Entity-level valuation, NAV, FFO accretion, capital markets</td><td>How does REIT M&amp;A work; why does a NAV discount matter</td></tr>
<tr><td>REIT research</td><td>FFO multiples, NAV premium/discount, the rates lens</td><td>Would you buy this REIT; what does a discount to NAV imply</td></tr>
<tr><td>RE debt</td><td>Credit metrics, downside, structure</td><td>Size this loan; what is the debt yield; recourse vs non-recourse</td></tr>
</table>

<div class="key-concept"><strong>The universal core, tested in every track:</strong> NOI (build it top-down), the cap rate (all three forms, and what drives it), the three approaches to value, the return metrics (IRR vs multiple vs cash-on-cash), leverage and the debt metrics (LTV, DSCR, debt yield), and "why real estate." If you own those cold, you can handle the foundation portion of any real estate interview. Then layer the track-specific material: the waterfall and deal underwriting for REPE, NAV and FFO for REIB and research, credit and structure for debt.</div>

<div class="pro-tip">Across all tracks, "why real estate" must be specific and yours. Avoid "it is tangible." Better: name the seat, what it does, and a skill you want, for example "REPE because I want to own the full underwriting, from the going-in cap rate to the business plan to structuring the promote, and see the thesis through to exit." Then have a sharp "why this firm" tied to their strategy or sector focus.</div>`,
  },
  {
    title: 'A Full Worked Acquisition Case',
    content: `<div class="case-walkthrough">
<div class="cw-label">The Prompt</div>
<p>A 200-unit apartment complex. In-place rents average 1,400 per unit per month; market rents are 1,600. Current occupancy is 90 percent. Operating expenses run 45 percent of effective gross income. The asking price implies a 5.5 percent going-in cap rate on in-place NOI. You can borrow 65 percent of cost at 6 percent interest-only. Your plan: renovate units and lease up to push rents to market and occupancy to 95 percent over three years, then sell. Walk me through whether this is a good deal.</p>
</div>

<div class="case-walkthrough">
<div class="cw-label">Step 1: In-place NOI and price</div>
<p>GPR at in-place rent: 200 x 1,400 x 12 = 3,360,000. At 90 percent occupancy, collected rent is about 3,024,000 (I will treat the 10 percent as vacancy/loss; ignore other income for simplicity). Operating expenses at 45 percent of EGI: about 1,361,000. In-place NOI is roughly 1,663,000. At a 5.5 percent going-in cap, price = 1,663,000 / 0.055 = about 30,240,000. Round the basis to about 30,000,000.</p>
</div>

<div class="case-walkthrough">
<div class="cw-label">Step 2: Stabilized NOI after the business plan</div>
<p>At market rent and 95 percent occupancy: GPR = 200 x 1,600 x 12 = 3,840,000; at 95 percent, EGI is about 3,648,000. Expenses at 45 percent: about 1,642,000. Stabilized NOI is roughly 2,006,000. So the plan grows NOI from about 1,663,000 to about 2,006,000, a gain of roughly 343,000, or about 21 percent, by marking rents to market and lifting occupancy.</p>
</div>

<div class="case-walkthrough">
<div class="cw-label">Step 3: Exit value and the leverage</div>
<p>Assume a conservative exit cap of 5.75 percent (25 bps above going-in, not assuming compression). Exit value = 2,006,000 / 0.0575 = about 34,890,000, call it 34,900,000 before selling costs. Financing: 65 percent of the 30,000,000 cost is 19,500,000 of debt, so equity in is about 10,500,000 (plus renovation capital, which I will fold in roughly). Debt service interest-only at 6 percent is 1,170,000 per year, comfortably covered by NOI (DSCR rises from about 1.4x to 1.7x as NOI grows; debt yield rises from about 8.5 percent to about 10.3 percent).</p>
</div>

<div class="case-walkthrough">
<div class="cw-label">Step 4: The equity return</div>
<p>At exit, sell for about 34,900,000, repay the 19,500,000 loan, leaving about 15,400,000 of equity proceeds, against roughly 10,500,000 invested: about a 1.45x equity multiple over three years from appreciation alone, plus three years of interim cash flow (NOI less debt service, growing from roughly 490,000 to 836,000 per year), which adds meaningfully to the multiple and supports a high-teens IRR. The return is driven by real NOI growth, not by assuming cap-rate compression, which is what makes it credible.</p>
</div>

<div class="case-walkthrough">
<div class="cw-label">Step 5: The verdict and the risks</div>
<p>This looks like an attractive value-add deal: a clear, executable plan (mark rents to market, lift occupancy) drives about 21 percent NOI growth, leverage is positive (6.5 to 8.5+ percent debt yield versus 6 percent debt) and amplifies the equity return, and the return holds up without betting on cap-rate compression. The key risks: the renovation may cost more or take longer than planned; market rents may not hold if new supply arrives or the market softens; and the interest-only floating exposure (if floating) creates refinancing or rate risk at exit. I would sensitize the exit cap (does it still work at 6.0 to 6.25 percent?), the achievable market rent, and the renovation cost and timeline before committing.</p>
</div>

<div class="pro-tip">Notice the structure of a good case answer: establish the basis and in-place NOI, project the stabilized NOI from the business plan, apply a conservative exit cap, layer in the financing, compute the return on both a multiple and IRR basis, then give a verdict grounded in the NOI growth and stress-test the assumptions. That arc works for almost any acquisition prompt.</div>`,
  },
  {
    title: 'Core Technical Questions',
    content: `<div class="interview-q">
<div class="q-label">Q1</div>
<div class="question">Walk me through how you get to NOI.</div>
<div class="answer">Start with gross potential rent, subtract vacancy and credit loss, add other income to reach effective gross income, then subtract operating expenses (taxes, insurance, utilities, management, repairs, payroll) to reach NOI. NOI is before debt service, before capital expenditures, TIs, and LCs, and before income tax, which is why it measures the property's operating income independent of financing.</div>
</div>

<div class="interview-q">
<div class="q-label">Q2</div>
<div class="question">What is a cap rate, and what does a low one mean?</div>
<div class="answer">The cap rate is NOI divided by property value, the unlevered yield. A low cap rate means a high price: investors accept a low yield, signaling low perceived risk, strong expected growth, or abundant cheap capital. It is an inverse multiple, so low cap equals expensive, high cap equals cheap. Intuitively, cap rate is roughly the required return minus expected NOI growth.</div>
</div>

<div class="interview-q">
<div class="q-label">Q3</div>
<div class="question">If NOI is 2,000,000 and the cap rate is 5 percent, what is the value? What if the cap goes to 6?</div>
<div class="answer">Value = NOI / cap rate = 2,000,000 / 0.05 = 40,000,000. At a 6 percent cap, 2,000,000 / 0.06 = about 33,300,000. Same income, but a 100 basis point rise in the cap rate cut value by about 6,700,000, roughly 17 percent. That sensitivity is why cap rate movements, often driven by interest rates, swing real estate values so much.</div>
</div>

<div class="interview-q">
<div class="q-label">Q4</div>
<div class="question">What are the three approaches to value?</div>
<div class="answer">The income approach (capitalize NOI at a market cap rate, or discount projected cash flows in a DCF), the sales comparison approach (value off recent comparable sales, per unit or per square foot), and the cost approach (land value plus the depreciated cost to rebuild). The income approach dominates institutional investing; the others serve as cross-checks, with replacement cost acting as a soft ceiling on value and a supply signal.</div>
</div>

<div class="interview-q">
<div class="q-label">Q5</div>
<div class="question">IRR versus equity multiple, why look at both?</div>
<div class="answer">IRR annualizes the return and accounts for timing, so it rewards speed but can flatter a quick, small deal and be gamed by timing. The equity multiple is total cash out over cash in, which rewards magnitude but ignores time, so a 2.0x looks the same over three years or ten. A deal can have a high IRR and low multiple or vice versa, so you read them together, plus cash-on-cash for the current yield, to see the full return shape.</div>
</div>

<div class="interview-q">
<div class="q-label">Q6</div>
<div class="question">Explain LTV, DSCR, and debt yield, and why lenders like debt yield.</div>
<div class="answer">LTV is loan over value (the equity cushion); DSCR is NOI over debt service (cash-flow coverage); debt yield is NOI over the loan amount. Lenders favor debt yield because it is independent of the cap rate and the interest rate, both of which can be aggressive in a frothy or low-rate market. Debt yield asks simply how much income backs each dollar of loan, giving a clean safety floor regardless of market conditions.</div>
</div>

<div class="interview-q">
<div class="q-label">Q7</div>
<div class="question">What is positive versus negative leverage?</div>
<div class="answer">Positive leverage is when the going-in cap rate exceeds the interest rate, so each borrowed dollar earns more than it costs and debt lifts the equity return above the unlevered yield. Negative leverage is when the interest rate exceeds the cap rate, so debt drags the equity return below the unlevered yield, and you are betting on NOI growth or cap compression to make the deal work. Negative leverage became common when rates rose above cap rates, which cooled transaction volume.</div>
</div>`,
  },
  {
    title: 'Track-Specific Questions',
    content: `<div class="interview-q">
<div class="q-label">Q8</div>
<div class="question">Walk me through a real estate equity waterfall.</div>
<div class="answer">Profits flow through tiers. First, return of capital: all investors get their equity back. Second, the preferred return: LPs receive a minimum return, say 8 percent, before the GP shares. Third, sometimes a GP catch-up. Fourth, the promoted split, for example 80/20 to LPs and GP, often with higher tiers that raise the GP share as IRR hurdles are cleared. The structure protects LP downside via the pref and rewards the GP for outperformance via the promote, which is the GP's disproportionate profit share relative to its small capital contribution.</div>
</div>

<div class="interview-q">
<div class="q-label">Q9</div>
<div class="question">What is the promote, and why does it exist?</div>
<div class="answer">The promote (carried interest) is the GP's share of profits in excess of its capital contribution, earned only after the LPs receive their preferred return. A GP that contributed 10 percent of equity might earn 20 percent or more of profits above the pref. It exists to align the sponsor with performance: the promote is worth a lot only if the deal substantially beats the hurdle, so the GP is motivated to maximize the return rather than just collect fees.</div>
</div>

<div class="interview-q">
<div class="q-label">Q10</div>
<div class="question">What are the four REPE strategies?</div>
<div class="answer">Core (stabilized prime assets, low leverage, modest return), core-plus (stable with light upside), value-add (underperforming assets fixed through leasing, renovation, and management to grow NOI, moderate-to-high leverage, mid-teens-plus IRR), and opportunistic (development, distress, major repositioning, highest leverage and return). The spectrum trades current income and safety for the chance to manufacture value by taking execution and market risk.</div>
</div>

<div class="interview-q">
<div class="q-label">Q11</div>
<div class="question">Why do REITs use FFO instead of net income?</div>
<div class="answer">GAAP net income includes large non-cash real estate depreciation that assumes buildings lose value on a fixed schedule, but well-located, well-maintained property tends to hold or grow in value, so net income understates a REIT's true earning power. FFO adds depreciation back and removes one-time property gains to show recurring cash earnings. AFFO goes further, subtracting recurring capex and leasing costs, to approximate the cash available for the dividend.</div>
</div>

<div class="interview-q">
<div class="q-label">Q12</div>
<div class="question">A REIT trades at a discount to NAV. What does that mean and what might happen?</div>
<div class="answer">The market values the company below the private worth of its assets, implying a high cost of equity, growth skepticism, or a cheaper public cap rate than the private market. The REIT cannot issue equity accretively, so growth stalls, and it may sell assets or buy back stock to close the gap. It can also attract activists or a take-private bid, since a buyer could acquire the real estate cheaply through the stock. It ties back to the capital-markets dependence created by the 90 percent payout rule.</div>
</div>

<div class="interview-q">
<div class="q-label">Q13</div>
<div class="question">How does REIT M&amp;A differ from corporate M&amp;A?</div>
<div class="answer">Valuation anchors on NAV (the private value of the underlying real estate) alongside FFO multiples, and the deal screen is FFO accretion/dilution rather than EPS. Because REITs grow with external capital, whether a deal works depends on the acquirer's cost of capital and its premium or discount to NAV: a premium-to-NAV acquirer with cheap equity can buy accretively, while a discounted REIT often cannot, and may itself become a target. Premiums are assessed against both the unaffected price and NAV.</div>
</div>

<div class="interview-q">
<div class="q-label">Q14</div>
<div class="question">What is yield on cost and the development spread?</div>
<div class="answer">Yield on cost is stabilized NOI divided by total project cost, the unlevered yield you create by building or repositioning. The development spread is yield on cost minus the market cap rate for the finished asset. That spread is the development profit and the compensation for taking entitlement, construction, and lease-up risk; developers target a minimum spread, often 150 to 200-plus basis points, to justify building rather than buying a finished, de-risked asset.</div>
</div>`,
  },
  {
    title: 'Common Mistakes',
    content: `<div class="mistake-box"><strong>Stopping at NOI.</strong> Treating NOI as the cash an owner keeps. NOI is before capex, TIs, LCs, and debt service. Real cash flow is meaningfully lower, especially in high-rollover sectors like office. Always go one level below NOI in your analysis.</div>

<div class="mistake-box"><strong>Getting the cap rate direction backwards.</strong> Saying a high cap rate means a high price. A high cap rate means a low price and higher risk or lower growth. Low cap equals expensive. Drill this until it is automatic, because flipping it instantly signals you do not understand valuation.</div>

<div class="mistake-box"><strong>Assuming exit cap compression.</strong> Building a model that only works because the exit cap is lower than the going-in cap. That is a bet on the market, not on the asset. Conservative underwriting holds the exit cap equal to or above the going-in cap and drives returns from NOI growth.</div>

<div class="mistake-box"><strong>Quoting one return metric.</strong> Citing IRR without the multiple, or vice versa. They reveal different things (speed versus magnitude), and sophisticated investors always read them together with cash-on-cash. Quoting only one is a rookie tell.</div>

<div class="mistake-box"><strong>Confusing preferred return with preferred equity, or pref with promote.</strong> The preferred return is the LP hurdle inside the equity waterfall. Preferred equity is a separate debt-like layer of the capital stack. The promote is the GP's profit share above the pref. Overlapping words, distinct concepts.</div>

<div class="mistake-box"><strong>Ignoring the lease structure.</strong> Comparing two properties on NOI alone without noting that a net-leased asset with stable, tenant-paid expenses is very different from a gross-leased asset where the landlord eats expense inflation and heavy rollover costs. Lease structure drives risk and value.</div>

<div class="mistake-box"><strong>A generic "why real estate."</strong> Saying real estate is tangible or you like buildings. Name the seat, what it does, and the skill you want to build, and tie "why this firm" to their actual strategy or sector. Specificity is the whole game.</div>`,
  },
  {
    title: 'Glossary',
    content: `<p><strong>AFFO:</strong> Adjusted funds from operations; FFO less recurring capex and leasing costs, the better gauge of dividend capacity.</p>
<p><strong>Cap rate:</strong> NOI divided by value; the unlevered yield. Low cap = high price; high cap = low price.</p>
<p><strong>Cash-on-cash:</strong> Annual pre-tax cash flow divided by equity invested; the current cash yield.</p>
<p><strong>CAM:</strong> Common area maintenance; operating costs recovered from tenants under net and modified leases.</p>
<p><strong>Catch-up:</strong> A waterfall tier giving the GP concentrated dollars above the pref until it reaches its target share of total profits.</p>
<p><strong>Core / core-plus / value-add / opportunistic:</strong> The REPE risk-return spectrum, from stabilized low-leverage income to development and distress.</p>
<p><strong>DSCR:</strong> Debt service coverage ratio; NOI divided by annual debt service. Cash-flow coverage of the loan.</p>
<p><strong>Debt yield:</strong> NOI divided by the loan amount; a rate-and-cap-independent measure of loan safety.</p>
<p><strong>Development spread:</strong> Yield on cost minus market cap rate; the profit margin of building.</p>
<p><strong>EGI:</strong> Effective gross income; GPR less vacancy plus other income.</p>
<p><strong>Equity multiple (MOIC):</strong> Total cash returned divided by cash invested; ignores time.</p>
<p><strong>Exit (terminal) cap rate:</strong> The cap rate assumed at sale; a critical, often-probed model input.</p>
<p><strong>FFO:</strong> Funds from operations; net income plus real estate depreciation less property gains. The REIT earnings metric.</p>
<p><strong>GP / LP:</strong> General partner (sponsor, runs the deal) and limited partners (investors, supply most equity).</p>
<p><strong>GPR:</strong> Gross potential rent; rent at full occupancy and in-place or market rents.</p>
<p><strong>Going-in cap rate:</strong> NOI over purchase price at acquisition.</p>
<p><strong>IRR:</strong> Internal rate of return; the time-weighted annualized return across all cash flows.</p>
<p><strong>LTV / LTC:</strong> Loan to value / loan to cost; loan size relative to value or total cost.</p>
<p><strong>Mark-to-market:</strong> Raising below-market in-place rents to market as leases roll; a value-add lever.</p>
<p><strong>NAV:</strong> Net asset value; the portfolio's NOI capitalized at market cap rates, plus other assets, less net debt, per share.</p>
<p><strong>NNN (triple net):</strong> Lease where the tenant pays taxes, insurance, and maintenance; bond-like landlord income.</p>
<p><strong>NOI:</strong> Net operating income; EGI less operating expenses. Before debt, capex, and tax. The foundational number.</p>
<p><strong>Non-recourse:</strong> Debt secured only by the property; the lender cannot pursue the sponsor's other assets (subject to carve-outs).</p>
<p><strong>Positive / negative leverage:</strong> Cap rate above (positive) or below (negative) the interest rate.</p>
<p><strong>Preferred return (pref):</strong> The LP hurdle return earned before the GP shares in profits.</p>
<p><strong>Premium / discount to NAV:</strong> Share price above or below NAV per share; signals growth expectations and cost of capital.</p>
<p><strong>Promote (carried interest):</strong> The GP's disproportionate profit share above the pref.</p>
<p><strong>Reversion:</strong> The sale proceeds at the end of the hold; usually the largest cash flow in the model.</p>
<p><strong>Rent roll:</strong> The schedule of all leases: tenant, space, rent, term, and expiration.</p>
<p><strong>TI / LC:</strong> Tenant improvements (landlord build-out dollars) and leasing commissions (broker fees); cash costs at signing/renewal.</p>
<p><strong>WALT / WAULT:</strong> Weighted average lease term remaining; a measure of income certainty.</p>
<p><strong>Yield on cost:</strong> Stabilized NOI divided by total project cost; the created yield in development and value-add.</p>`,
  },
];
