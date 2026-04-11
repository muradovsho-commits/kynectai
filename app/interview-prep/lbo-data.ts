export const LBO_SECTIONS = [
  {
    title: 'What Is a Leveraged Buyout?',
    content: `<p>A leveraged buyout is an acquisition funded primarily with borrowed money. A private equity (PE) firm typically puts up 30–50% of the purchase price as Equity (from its investment fund) and borrows the remaining 50–70% as Debt. The PE firm then operates the acquired company for 3–7 years, uses the company's own cash flow to repay the Debt, and eventually sells the company&mdash;ideally at a higher price than it paid.</p>

<p>The strategy is analogous to buying a rental property with a mortgage. You put down a fraction of the purchase price, rent the property out to cover mortgage payments, and sell it later. If the property appreciates, your return on the down payment is far higher than if you'd paid all cash, because leverage amplifies equity returns.</p>

<h4>Three Sources of LBO Returns</h4>

<p><strong>1. Debt Paydown (Deleveraging):</strong> As the company generates free cash flow and uses it to repay Debt, the Equity value grows even if the company's total value stays flat. This is the most predictable and reliable return source.</p>

<p><strong>2. EBITDA Growth / Operational Improvement:</strong> If the PE firm can grow the company's earnings&mdash;through revenue growth, cost reduction, working capital optimization, or strategic repositioning&mdash;the company's value at exit will be higher. This requires active management and operational expertise.</p>

<p><strong>3. Multiple Expansion:</strong> If the PE firm buys at 7x EBITDA and sells at 9x EBITDA (because the company is now larger, more profitable, or in a more favorable market environment), the higher exit multiple significantly boosts returns. This is the least controllable factor because multiples depend on broader market conditions.</p>

<div class="example-box">
<div class="example-label">LBO Return Decomposition</div>
<p>A PE firm acquires a company for $800M (8x EBITDA of $100M) using $320M Equity and $480M Debt.</p>
<p>Over 5 years: EBITDA grows to $125M. The company repays $200M of Debt. It's sold at 8.5x EBITDA.</p>
<p>Exit Enterprise Value: $125M × 8.5x = $1,063M</p>
<p>Remaining Debt: $480M − $200M = $280M</p>
<p>Exit Equity: $1,063M − $280M = $783M</p>
<p>Return Multiple (MOIC): $783M / $320M = <strong>2.4x</strong></p>
<p>IRR: (2.4)^(1/5) − 1 ≈ <strong>19.4%</strong></p>
<p><em>Return sources: Debt paydown contributed $200M, EBITDA growth at same multiple added ~$200M (25M × 8x), and multiple expansion added ~$63M (125M × 0.5x).</em></p>
</div>`,
  },
  {
    title: 'What Makes a Good LBO Candidate?',
    content: `<p>Not every company works as an LBO target. The essential characteristics:</p>

<p><strong>Stable, predictable cash flow:</strong> The company needs reliable cash generation to service Debt payments. Cyclical, volatile, or startup-phase businesses are poor candidates because a downturn could make Debt payments impossible, triggering default.</p>

<p><strong>Limited existing leverage:</strong> There must be room in the capital structure to add significant Debt. A company already at 5x Debt/EBITDA has little borrowing capacity left.</p>

<p><strong>Low capital expenditure requirements:</strong> Cash flow that must be reinvested in CapEx isn't available for Debt repayment. Asset-light businesses with low maintenance CapEx are ideal.</p>

<p><strong>Improvement opportunities:</strong> The PE firm needs levers to pull: cost reduction, margin improvement, revenue growth, or strategic repositioning. A perfectly optimized company offers less upside.</p>

<p><strong>Clear exit path:</strong> The PE firm must be able to sell the company in 3–7 years, either to a strategic buyer, another PE firm, or via an IPO.</p>

<p><strong>Reasonable price:</strong> The purchase multiple must be low enough to allow attractive returns at realistic assumptions. Overpaying kills LBO returns regardless of operational improvements.</p>`,
  },
  {
    title: 'Building an LBO Model',
    content: `<h4>Step 1: Purchase Price</h4>

<p>Start with the company's EBITDA and apply a purchase multiple. If EBITDA = $120M and the purchase multiple is 8x, Enterprise Value Purchase Price = $960M. Add transaction fees (typically 2–4% of the purchase price) to determine total Uses.</p>

<h4>Step 2: Sources &amp; Uses</h4>

<p>Determine how the purchase is funded. Total Debt capacity depends on the company's leverage capacity (typically 4–6x EBITDA for the total Debt package) and the availability of different Debt tranches.</p>

<table class="comparison-table">
<tr>
  <th>Debt Layer</th>
  <th>Typical Size</th>
  <th>Interest Rate</th>
  <th>Key Features</th>
</tr>
<tr>
  <td>Senior Secured (Revolver + Term Loans)</td>
  <td>2.5–4.0x EBITDA</td>
  <td>Lowest (base rate + 2–4%)</td>
  <td>First claim on assets; mandatory quarterly/annual amortization</td>
</tr>
<tr>
  <td>Second Lien / Unsecured Senior</td>
  <td>0.5–1.5x EBITDA</td>
  <td>Higher (base rate + 5–8%)</td>
  <td>Subordinate to senior secured; usually bullet maturity (no amortization)</td>
</tr>
<tr>
  <td>Mezzanine / Subordinated Notes</td>
  <td>0.5–1.5x EBITDA</td>
  <td>Highest (12–18%, may include PIK)</td>
  <td>Lowest priority; may include equity warrants or PIK interest</td>
</tr>
</table>

<p>The Equity contribution from the PE firm fills the gap: Equity = Total Uses − Total Debt. Sources must equal Uses.</p>

<h4>Step 3: Project Cash Flows and Debt Repayment</h4>

<p>Project the company's EBITDA, EBIT, taxes, D&A, CapEx, and Working Capital changes for each year of the holding period (typically 5 years). Calculate Free Cash Flow available for Debt service.</p>

<p>Build a <strong>Debt schedule</strong> tracking each tranche: beginning balance, mandatory repayments, optional prepayments (from excess FCF), PIK accruals (if applicable), and ending balance. Interest Expense for each tranche = Interest Rate × Average Balance.</p>

<p>Debt is repaid in order of seniority: Revolver first, then Term Loans with mandatory amortization, then optional prepayments on the highest-cost tranches.</p>

<h4>Step 4: Calculate Exit Value and Returns</h4>

<p>Apply an exit multiple (often the same as the entry multiple as a base case) to the projected EBITDA in the exit year. Subtract remaining Debt to get Exit Equity. Calculate MOIC and IRR.</p>

<div class="formula-box">
MOIC = Exit Equity / Initial Equity<br>
IRR ≈ MOIC^(1/Holding Period) − 1<br>
<small>(simplified; actual IRR accounts for interim cash flows like dividends)</small>
</div>

<p>PE firms typically target a <strong>2.0–3.0x MOIC</strong> and a <strong>20–25% IRR</strong>. The quick math: the "Rule of 72" says to double your money (2.0x MOIC), you need an IRR of roughly 72 ÷ years. For 5 years, that's ~14.4%. To triple your money (3.0x), you need roughly 115 ÷ 5 ≈ 23%.</p>`,
  },
  {
    title: 'LBO Model Uses Beyond PE',
    content: `<p><strong>Floor Valuation:</strong> An LBO analysis tells you the maximum price a financial buyer would pay while hitting target returns. Since PE firms demand high returns (20%+), LBO valuations typically produce the lowest implied values among valuation methodologies. This makes LBO value a useful "floor"&mdash;if a company's stock price is below its LBO value, it may be undervalued.</p>

<p><strong>Capacity Analysis:</strong> LBO models help assess how much Debt a company can reasonably support. Stress-test different leverage levels against projected cash flows to determine the maximum Debt load before financial distress becomes likely.</p>

<p><strong>Negotiation Tool:</strong> In competitive M&A processes, understanding each party's LBO math helps bankers advise on pricing. If a PE buyer can achieve 20% IRR at $50/share but not at $55/share, you know $50–$55 is the ceiling for that buyer.</p>`,
  },
  {
    title: 'Advanced LBO Topics',
    content: `<p><strong>Dividend Recapitalization:</strong> After paying down some initial Debt, the PE firm may have the company borrow again and pay the proceeds to the PE firm as a dividend. This returns capital earlier, improving IRR (because money received sooner is more valuable). However, it re-leverages the company, increasing risk.</p>

<p><strong>Management Rollover:</strong> The existing management team invests their own money alongside the PE firm, reducing the PE firm's equity check and aligning incentives. Managers typically receive options or restricted shares that vest over the holding period, creating strong motivation to improve performance.</p>

<p><strong>Add-On Acquisitions (Buy-and-Build):</strong> The PE firm uses the initial company as a platform to acquire smaller competitors. This creates value through multiple arbitrage (smaller companies trade at lower multiples; the combined platform trades at a higher multiple), operational synergies, and revenue diversification.</p>

<p><strong>PIK (Payment-in-Kind) Interest:</strong> Instead of paying interest in cash, the company adds it to the Debt balance. This preserves cash flow in the near term but increases total Debt that must eventually be repaid. PIK is common in subordinated tranches where lenders accept higher total returns in exchange for deferred cash payments.</p>`,
  },
  {
    title: 'LBO: Interview Questions',
    content: `<div class="interview-q">
<div class="q-label">Question 1</div>
<div class="question">Walk me through a leveraged buyout.</div>
<div class="answer">A PE firm acquires a company using a combination of Equity (its own fund's capital) and Debt (bank loans, bonds, mezzanine). The Equity contribution is typically 30–50% of the purchase price. The PE firm runs the company for 3–7 years, implements operational improvements to grow EBITDA, and uses the company's free cash flow to repay Debt. At the end, the firm sells the company through a strategic sale, secondary buyout, or IPO. Returns come from Debt paydown, EBITDA growth, and potentially multiple expansion. Success is measured by MOIC (money-on-money multiple) and IRR (annualized return).</div>
</div>

<div class="interview-q">
<div class="q-label">Question 2</div>
<div class="question">Why does leverage amplify returns?</div>
<div class="answer">Because the PE firm invests only a fraction of the total price. If a $1B company appreciates by $200M, the full $200M accrues to Equity holders. If the PE firm put in $400M of Equity (with $600M Debt), that $200M gain represents a 50% return on their investment. Without leverage (investing the full $1B), the same $200M gain is only a 20% return. The flip side: leverage also amplifies losses. If the company's value declines by $200M, that's a 50% loss for the levered equity investor vs. a 20% loss without leverage.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 3</div>
<div class="question">What makes a good LBO candidate?</div>
<div class="answer">Stable, predictable cash flows (to service Debt), low existing leverage (room to borrow), low CapEx requirements (more FCF for Debt repayment), opportunities for operational improvement (cost cuts, revenue growth), defensible market position, strong management team, a clear exit path, and a reasonable purchase price relative to return targets.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 4</div>
<div class="question">A PE firm buys a company for $600M at 6x EBITDA ($100M). It uses $240M Equity and $360M Debt. Over 5 years, EBITDA grows to $120M, Debt is reduced to $160M, and the exit multiple is 7x. What's the approximate MOIC and IRR?</div>
<div class="answer">Exit EV = $120M × 7x = $840M. Remaining Debt = $160M. Exit Equity = $840M − $160M = $680M. MOIC = $680M / $240M = 2.83x. IRR ≈ (2.83)^(1/5) − 1 ≈ 23.1%. Returns came from: Debt paydown ($200M of Debt repaid), EBITDA growth ($20M × 6x original multiple = $120M at entry multiple), and multiple expansion ($120M × 1x = $120M from higher exit multiple).</div>
</div>

<div class="interview-q">
<div class="q-label">Question 5</div>
<div class="question">What is a dividend recapitalization and why would a PE firm do one?</div>
<div class="answer">A dividend recap is when the PE-owned company takes on new Debt and uses the proceeds to pay a cash dividend to the PE firm. The PE firm does it to extract cash from the investment sooner, which improves IRR since money received earlier is worth more. The risk is that the company becomes more leveraged again, which could create financial strain if performance deteriorates. It's essentially a bet that the company is strong enough to handle the additional Debt while still being sold profitably later.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 6</div>
<div class="question">How do you use an LBO model as a valuation tool?</div>
<div class="answer">The LBO model tells you the maximum price a PE firm would pay while achieving target returns (typically 20–25% IRR). This represents a "floor" valuation because PE firms require high returns and won't overpay. If a company's LBO-implied value per share exceeds its current stock price, it suggests the stock may be undervalued&mdash;a PE firm could buy it at a premium and still generate attractive returns. LBO values typically produce the lowest valuations among standard methodologies.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 7</div>
<div class="question">What happens to the IRR if you increase leverage (more Debt, less Equity)?</div>
<div class="answer">If the deal is successful, higher leverage increases IRR because the PE firm invests less Equity, so the same absolute dollar gain represents a higher percentage return. However, higher leverage also means higher Interest Expense (reducing FCF for Debt repayment), a smaller margin of safety (the company is more likely to default if performance slips), and potentially higher interest rates (lenders charge more as leverage increases). There's also a practical ceiling&mdash;lenders typically won't go above 5–7x total Debt/EBITDA.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 8</div>
<div class="question">What are the three main sources of returns in an LBO, and which is most reliable?</div>
<div class="answer">The three sources are: (1) Debt paydown&mdash;as FCF repays Debt, the value "transfers" from Debt holders to Equity holders. This is the most reliable because it depends primarily on the company maintaining its cash flow, not on market conditions. (2) EBITDA growth&mdash;operational improvements, cost cuts, or revenue growth that increase earnings. Moderately reliable, depending on the PE firm's execution capability. (3) Multiple expansion&mdash;selling at a higher multiple than the purchase multiple. This is the least reliable because multiples depend on market conditions, investor sentiment, and industry trends that the PE firm can't control.</div>
</div>`,
  },
];
