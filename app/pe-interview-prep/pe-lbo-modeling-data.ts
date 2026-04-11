export const PE_LBO_MODELING_SECTIONS = [
  {
    title: 'The Paper LBO',
    content: `<p>The paper LBO (or "back of the envelope" LBO) is a simplified version done mentally or on a single sheet of paper, often in interviews or early-stage deal screening. The purpose is to quickly determine if a deal can generate target returns under reasonable assumptions. You should be able to do one in 5–10 minutes.</p>

<h4>Paper LBO Framework</h4>

<p><strong>Step 1: Calculate the Purchase Price.</strong> Start with EBITDA and multiply by the entry multiple.</p>

<p><strong>Step 2: Determine the Capital Structure.</strong> Apply a leverage multiple (e.g., 5.0x Debt/EBITDA) to calculate total Debt. Equity = Purchase Price − Debt. Add transaction fees to the Equity check (simplify by assuming fees are ~3–5% of the purchase price, funded with additional Equity).</p>

<p><strong>Step 3: Project EBITDA Growth.</strong> Apply a growth rate for each year of the holding period. Keep it simple&mdash;a constant rate or a step-down from higher initial growth to lower terminal growth.</p>

<p><strong>Step 4: Estimate Annual Free Cash Flow.</strong> EBITDA − Interest − Taxes − CapEx ± ΔWC. Use simplifying assumptions: Interest ≈ average Debt balance × blended interest rate. Taxes ≈ (EBITDA − D&A − Interest) × Tax Rate. CapEx ≈ a fixed percentage of revenue or EBITDA. Assume D&A ≈ CapEx for simplicity (which means the Balance Sheet is roughly in steady state).</p>

<p><strong>Step 5: Calculate Debt Paydown.</strong> Cumulative Free Cash Flow over the holding period goes to repay Debt. End-of-period Debt = Initial Debt − Cumulative FCF used for Debt repayment.</p>

<p><strong>Step 6: Calculate Exit Value.</strong> Exit EBITDA × Exit Multiple. The exit multiple usually equals the entry multiple as a base case (no multiple expansion).</p>

<p><strong>Step 7: Calculate Returns.</strong> Exit Equity = Exit Enterprise Value − Remaining Debt. MOIC = Exit Equity / Initial Equity. IRR ≈ MOIC^(1/years) − 1.</p>

<div class="example-box">
<div class="example-label">Paper LBO Walkthrough</div>
<p><strong>Given:</strong> A company has $80M EBITDA, growing at 5% annually. Purchase multiple: 9.0x. Leverage: 5.5x EBITDA. Blended interest rate: 6%. Tax rate: 25%. CapEx = D&A = $15M/year. No working capital changes. 5-year hold. Exit at 9.0x.</p>
<p><strong>Purchase Price:</strong> $80M × 9.0x = $720M</p>
<p><strong>Debt:</strong> $80M × 5.5x = $440M</p>
<p><strong>Equity (incl. ~$25M fees):</strong> $720M − $440M + $25M = $305M</p>
<p><strong>Year-by-year EBITDA:</strong> $80 → $84 → $88.2 → $92.6 → $97.2 → (Exit: $102.1M)</p>
<p><strong>Approximate annual FCF:</strong> Year 1: $84M EBITDA − $26.4M interest (6% × $440M) − $10.7M taxes ((84−15−26.4)×25%) − $15M CapEx ≈ $31.9M. (Subsequent years: similar math, increasing as EBITDA grows and Debt decreases.)</p>
<p><strong>Cumulative FCF over 5 years:</strong> Approximately $175M (grows each year as EBITDA rises and interest falls).</p>
<p><strong>End Debt:</strong> $440M − $175M = $265M</p>
<p><strong>Exit EV:</strong> $102.1M × 9.0x = $919M</p>
<p><strong>Exit Equity:</strong> $919M − $265M = $654M</p>
<p><strong>MOIC:</strong> $654M / $305M = <strong>2.14x</strong></p>
<p><strong>IRR:</strong> (2.14)^(1/5) − 1 ≈ <strong>16.4%</strong></p>
<p><em>Below the typical 20% target. To improve: negotiate a lower price, use more leverage, grow EBITDA faster, or achieve multiple expansion at exit.</em></p>
</div>`,
  },
  {
    title: 'The Full LBO Model',
    content: `<p>A full LBO model in Excel is a significantly more detailed version of the paper LBO. It typically contains the following components:</p>

<h4>1. Transaction Assumptions</h4>

<p>This tab captures all the key inputs: purchase price (often toggled between a fixed price and a multiple-based price), Debt tranches and terms, Equity contribution, transaction fees (advisory, financing, legal), and management rollover assumptions.</p>

<h4>2. Sources &amp; Uses</h4>

<p>A two-column schedule that shows where the money comes from (Sources: each Debt tranche, Equity from the PE sponsor, management rollover, any existing Cash used) and where it goes (Uses: Equity purchase price, Debt refinanced, transaction fees, financing fees, Cash to the balance sheet). Sources must equal Uses.</p>

<h4>3. Purchase Price Allocation (PPA)</h4>

<p>Allocate the purchase premium above book value. Write existing assets up to fair value. Create new intangible assets (customer relationships, technology, trade names&mdash;each with a specified useful life and amortization schedule). The remaining excess is Goodwill. Calculate the Deferred Tax Liability created by the asset write-ups (book basis increases but tax basis may not, depending on deal structure).</p>

<h4>4. Opening Balance Sheet</h4>

<p>The company's Balance Sheet immediately after the transaction closes. Take the pre-deal Balance Sheet, remove the old Equity, add the new Debt, add new Equity, reflect the PPA adjustments (Goodwill, intangibles, DTL), and adjust Cash for any used or added in the deal. This Balance Sheet must balance.</p>

<h4>5. Income Statement Projections</h4>

<p>Project Revenue, COGS, Gross Profit, Operating Expenses, EBITDA, D&A (including new amortization of deal intangibles), EBIT, Interest Expense (linked to the Debt schedule), Pre-Tax Income, Taxes, and Net Income for each year of the holding period.</p>

<p>Key drivers: Revenue growth rates (by segment if possible), margin assumptions (COGS as % of Revenue, OpEx as % of Revenue), and any synergies or cost savings from the value creation plan.</p>

<h4>6. Cash Flow Statement</h4>

<p>Start from Net Income, add back D&A and other non-cash charges, subtract CapEx, adjust for working capital changes, and arrive at Free Cash Flow available for Debt service. Then subtract mandatory Debt amortization to get cash available for optional Debt prepayment.</p>

<h4>7. Debt Schedule</h4>

<p>The heart of the LBO model. For each Debt tranche, track: beginning balance, mandatory amortization, optional prepayments (from excess FCF, applied to the most expensive tranche first), PIK accruals, and ending balance. Calculate Interest Expense for each tranche as Interest Rate × Average Balance (or Beginning Balance, depending on convention).</p>

<p>The Debt schedule also tracks compliance with financial covenants, most commonly: Total Debt / EBITDA (maximum leverage ratio), Senior Debt / EBITDA, Interest Coverage Ratio (EBITDA / Interest Expense), and Fixed Charge Coverage Ratio ((EBITDA − CapEx) / (Interest + Mandatory Amortization)).</p>

<h4>8. Balance Sheet Projections</h4>

<p>Project the full Balance Sheet for each year. The key items: Cash (ending Cash from the CFS), AR, Inventory, PP&E (beginning + CapEx − Depreciation), Goodwill (constant unless impaired), Intangibles (beginning − Amortization), Debt (from the Debt schedule), DTL (beginning + new deferred tax − reversal), and Equity (beginning + Net Income − Dividends).</p>

<h4>9. Exit Analysis and Returns</h4>

<p>Calculate Exit Enterprise Value (Exit Year EBITDA × Exit Multiple), subtract remaining Net Debt, and arrive at Exit Equity Value. Calculate MOIC and IRR. Build sensitivity tables showing returns across ranges of exit multiples, exit years, and EBITDA growth rates.</p>

<div class="formula-box">
MOIC = Exit Equity Value / Total Equity Invested<br>
IRR = the rate r such that: Σ [Cash Flow_t / (1+r)^t] = 0<br>
<small>(In Excel: =IRR(array of cash flows) or =XIRR(cash flows, dates))</small>
</div>`,
  },
  {
    title: 'Key Modeling Considerations',
    content: `<h4>Circular References: Cash Sweep and Interest</h4>

<p>A common challenge in LBO models is that Interest Expense depends on the Debt balance, but the Debt balance depends on Free Cash Flow (which is after Interest Expense). This creates a <strong>circular reference</strong>. Solutions include: using beginning-of-period balances for interest calculations (avoids the circularity at the cost of slight inaccuracy), using an iterative calculation (enable iterative calculations in Excel), or using a manual "plug" formula.</p>

<h4>PIK Interest</h4>

<p>Payment-in-Kind interest accrues but isn't paid in cash&mdash;it's added to the Debt principal. PIK interest increases the Debt balance over time, which means more total Debt to repay at exit. However, it preserves cash flow in the near term. Model PIK by increasing the Debt tranche's balance each period by the PIK interest amount.</p>

<h4>Management Option Pool (MOP)</h4>

<p>PE firms typically set aside 10–20% of the post-deal Equity for management incentive plans (options, profits interests, or co-invest). This dilutes the PE firm's ownership but aligns management incentives. In the returns calculation, you must account for the MOP's dilutive effect on the sponsor's equity proceeds at exit.</p>

<p>The MOP usually vests over the holding period (time vesting) and may also have performance-based vesting tied to MOIC or IRR thresholds. A common structure: 50% time-vesting (ratably over 4–5 years), 50% performance-vesting (triggered at 2.0x MOIC or 20% IRR).</p>

<h4>Transaction and Financing Fees</h4>

<p>Transaction fees include advisory fees (paid to the investment bank advising the buyer), legal fees, accounting/diligence fees, and sometimes a monitoring fee. Financing fees include commitment fees, arrangement fees, and OID (Original Issue Discount) on the Debt. These are typically capitalized and amortized over the life of the Debt or expensed at closing.</p>

<h4>Section 338(h)(10) and Tax Considerations</h4>

<p>The deal structure (Asset Purchase vs. Stock Purchase vs. 338(h)(10) election) affects the tax treatment of the purchase price allocation. In an Asset Purchase or 338(h)(10) deal, the buyer can amortize Goodwill and other intangibles for tax purposes (typically over 15 years in the U.S.), creating cash tax savings that increase Free Cash Flow. In a Stock Purchase, these items are not tax-deductible, resulting in lower FCF. The tax benefit of a 338(h)(10) election can be worth 5–15% of the purchase price.</p>`,
  },
  {
    title: 'Sensitivity Analysis',
    content: `<p>No LBO model is complete without extensive sensitivity analysis. Key sensitivities to run:</p>

<table class="comparison-table">
<tr><th>Variable</th><th>Why It Matters</th><th>Typical Range to Test</th></tr>
<tr><td>Entry Multiple</td><td>Directly affects purchase price and Equity check</td><td>±1.0–2.0x around base case</td></tr>
<tr><td>Exit Multiple</td><td>Biggest single driver of exit proceeds</td><td>±1.0–2.0x around entry multiple</td></tr>
<tr><td>EBITDA Growth Rate</td><td>Determines exit EBITDA and FCF for Debt paydown</td><td>±2–5% around base case</td></tr>
<tr><td>Leverage Level</td><td>Affects Equity check and IRR amplification</td><td>4.0x–6.5x EBITDA</td></tr>
<tr><td>Interest Rate</td><td>Higher rates reduce FCF for Debt repayment</td><td>±100–200 bps</td></tr>
<tr><td>Holding Period</td><td>Longer hold = lower IRR (even if higher MOIC)</td><td>3–7 years</td></tr>
<tr><td>CapEx as % of Revenue</td><td>Affects FCF available for Debt paydown</td><td>±1–3% around base case</td></tr>
</table>

<p>Present sensitivities as two-way data tables (e.g., IRR as a function of Exit Multiple and EBITDA Growth) to show how assumptions interact.</p>`,
  },
];
