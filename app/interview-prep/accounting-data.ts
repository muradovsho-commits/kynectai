export const ACCOUNTING_SECTIONS = [
  {
    title: 'Why Profit ≠ Cash',
    content: `<p>Everything in valuation depends on cash flow. But no public company directly reports the "cash flow" figure we need for valuation. Instead, companies report three interconnected financial statements, and analysts must work through them to extract a meaningful cash flow number.</p>

<p>The root cause of the complexity is <strong>accrual accounting</strong>. Under accrual rules (used by virtually all public companies under both U.S. GAAP and IFRS), revenue is recorded when a product or service is delivered&mdash;not when payment is received. Expenses are recorded when incurred&mdash;not when paid. This means the Income Statement tells you what the company "earned" in an accounting sense, but not how much cash actually moved through the door.</p>

<p>Consider a landscape design firm that completes a $50,000 project in March but won't be paid until June. Under accrual accounting, the firm records $50,000 in revenue in March. Its March income statement looks great. But its March bank account hasn't budged. The mismatch between accounting income and cash is tracked through the Balance Sheet and Cash Flow Statement.</p>`,
  },
  {
    title: 'The Income Statement',
    content: `<p>The Income Statement (also called the Profit &amp; Loss or P&amp;L) covers a specific period&mdash;a quarter or a year&mdash;and shows what the company earned and spent according to accounting rules. The key items from top to bottom:</p>

<p><strong>Revenue (Sales):</strong> Total value of goods sold or services delivered during the period. This is recognized upon delivery, not upon cash collection.</p>

<p><strong>Cost of Goods Sold (COGS):</strong> Direct costs tied to producing what was sold&mdash;raw materials, manufacturing labor, shipping for physical goods. Subtracting COGS from Revenue gives <strong>Gross Profit</strong>, and the Gross Margin (Gross Profit / Revenue) tells you how much incremental profit each additional sale generates before overhead.</p>

<p><strong>Operating Expenses (OpEx):</strong> Overhead costs not directly tied to individual units sold&mdash;salaries, rent, marketing, R&amp;D. Subtracting OpEx from Gross Profit gives <strong>Operating Income (EBIT)</strong>, which reflects the profitability of core business operations before interest and taxes.</p>

<p><strong>Interest Expense / Income:</strong> The cost of Debt and earnings on Cash balances. These are "below the line" because they reflect financing decisions, not operating performance.</p>

<p><strong>Taxes:</strong> Corporate income taxes on Pre-Tax Income.</p>

<p><strong>Net Income:</strong> The bottom line&mdash;what's left for common shareholders after all expenses and taxes.</p>

<p>For an item to appear on the Income Statement, it must satisfy two conditions: it must correspond to the reporting period, and it must affect the income available to shareholders. A factory purchase doesn't go on the Income Statement because it benefits multiple future periods. A loan principal repayment doesn't go there either because it doesn't affect shareholder income (it's just exchanging one asset for another).</p>`,
  },
  {
    title: 'Working Capital: The Bridge Between Profit and Cash',
    content: `<p>Working capital items are the most common source of profit-vs-cash discrepancies. These are short-term assets and liabilities that arise from timing gaps in business operations.</p>

<h4>Accounts Receivable (AR)</h4>

<p>When you deliver a product but the customer hasn't paid yet, you've earned Revenue (it hits the Income Statement), but you haven't received cash. You record an Account Receivable on the Balance Sheet&mdash;essentially an IOU. When the customer pays, AR decreases and Cash increases. During the gap, Net Income overstates cash generated.</p>

<p>Imagine a consulting firm bills $200,000 in December for work completed, but the client pays in February. In December, the Income Statement shows $200K in revenue, but the Cash Flow Statement must subtract that $200K because no cash arrived. In February, cash comes in but there's no new Income Statement impact.</p>

<h4>Accounts Payable (AP)</h4>

<p>The mirror image: you receive goods or services from a supplier but haven't paid yet. The expense hits the Income Statement, but cash stays in your account. AP increases on the Balance Sheet until you pay. During the gap, Net Income understates cash generated&mdash;you've had the benefit of holding onto cash longer than the income statement suggests.</p>

<h4>Inventory</h4>

<p>When you purchase raw materials or finished goods, you spend cash but cannot recognize the cost on the Income Statement until you sell and deliver those goods to customers. Cash goes out immediately; the expense (COGS) is delayed until the sale. Rising Inventory means cash is being tied up in unsold goods&mdash;a negative for cash flow even if the Income Statement looks unchanged.</p>

<h4>Deferred Revenue</h4>

<p>When customers pay in advance&mdash;annual software subscriptions, prepaid memberships, gift cards&mdash;you collect cash but can't recognize Revenue until the product or service is actually delivered. Deferred Revenue increases on the Balance Sheet (it's a Liability because you owe the customer something). Cash is higher than the Income Statement would suggest. This is why subscription businesses often appear to generate more cash than profit.</p>

<h4>Prepaid Expenses</h4>

<p>When you pay for something in advance (like 12 months of insurance up front), cash goes out immediately, but the expense is recognized gradually over the coverage period. In the payment month, cash outflow exceeds the recorded expense.</p>

<div class="key-concept">
<strong>Working Capital = Current Assets − Current Liabilities.</strong> An increase in Working Capital <em>uses</em> cash (e.g., more AR means you're owed more money you haven't collected; more Inventory means you've bought more stuff you haven't sold). A decrease in Working Capital <em>frees up</em> cash (e.g., higher AP means you're delaying cash payments; higher Deferred Revenue means you've collected cash in advance).
</div>`,
  },
  {
    title: 'Capital Expenditures and Depreciation',
    content: `<p>When a company buys a long-lived asset&mdash;a delivery truck, a server farm, a factory&mdash;the purchase is a <strong>Capital Expenditure (CapEx)</strong>. Because the asset will generate benefits over many years, you don't record the entire cost as an expense in the purchase year. Instead, you spread the cost over the asset's useful life through <strong>Depreciation</strong>.</p>

<p>For example, if a logistics company buys a fleet of trucks for $2 million with a 10-year useful life, Depreciation would be $200,000 per year (straight-line method). In Year 1, Cash decreases by $2M (the actual purchase), but the Income Statement shows only $200K of Depreciation expense. In Years 2–10, there's no cash outflow, but the Income Statement still shows $200K of Depreciation each year.</p>

<p>This is why Depreciation is called a <strong>"non-cash expense."</strong> The cash was spent when the asset was purchased. In subsequent years, Depreciation appears on the Income Statement to allocate the cost, but it doesn't represent any new cash spending. On the Cash Flow Statement, Depreciation is added back to Net Income to undo this non-cash reduction.</p>

<p>However, Depreciation has a real economic benefit: it reduces taxable income, which means the company pays less in taxes. A $200K Depreciation charge at a 25% tax rate saves $50K in actual cash taxes per year.</p>`,
  },
  {
    title: 'Debt, Equity, and Preferred Stock',
    content: `<h4>Debt Issuance and Servicing</h4>

<p>When a company borrows money, the loan proceeds appear as a cash inflow on the Cash Flow Statement (under Financing), and the Debt balance increases on the Balance Sheet. Nothing hits the Income Statement at issuance because borrowing isn't an operating activity.</p>

<p>Over time, the company pays <strong>Interest Expense</strong> (which appears on the Income Statement, reducing Net Income and taxes) and repays <strong>Debt principal</strong> (which appears only on the Cash Flow Statement as a financing outflow&mdash;it doesn't affect Net Income because repaying a loan isn't an expense, it's just returning borrowed money).</p>

<h4>Equity Issuance</h4>

<p>When a company sells new shares, it receives cash (CFS inflow under Financing) and Equity increases on the Balance Sheet. No Income Statement impact. Existing shareholders get diluted&mdash;they own a smaller percentage of a now-larger company. Companies can return cash to shareholders through <strong>Dividends</strong> (cash payments) or <strong>Share Repurchases</strong> (buying back shares, which reduces the share count). Both reduce Cash and Equity, and both appear on the CFS, not the Income Statement.</p>

<h4>Preferred Stock</h4>

<p>A hybrid: it pays fixed dividends (like Debt interest) but represents ownership (like Equity). Preferred Dividends appear on the Income Statement and reduce income available to common shareholders. Unlike Debt interest, Preferred Dividends are not tax-deductible. Preferred Stock is uncommon because it's costlier than Debt yet doesn't offer the flexibility of common Equity.</p>`,
  },
  {
    title: 'Leases on the Balance Sheet',
    content: `<p>Companies that lease assets (office space, retail locations, equipment) must record the lease on the Balance Sheet as both a <strong>Right-of-Use Asset</strong> and a <strong>Lease Liability</strong>, equal to the present value of future lease payments.</p>

<p>A <strong>Finance Lease</strong> (where the company effectively "buys" the asset through the lease) records Depreciation on the asset and Interest on the liability separately&mdash;similar to buying with a loan. An <strong>Operating Lease</strong> under IFRS works the same way; under U.S. GAAP, it records a single straight-line lease expense but still shows the asset and liability on the Balance Sheet. The total cash outflow over the lease's life is identical regardless of classification&mdash;only the year-to-year Income Statement profile differs.</p>`,
  },
  {
    title: 'Deferred Taxes and NOLs',
    content: `<p>Companies calculate taxes two ways: "book" taxes (per accounting rules) and "cash" taxes (per the tax code). The difference creates Deferred Tax Assets or Liabilities on the Balance Sheet.</p>

<p>The most common cause: <strong>accelerated Depreciation for tax purposes</strong>. If a company depreciates a $1M asset over 10 years for book purposes ($100K/year) but over 5 years for tax purposes ($200K/year), it pays less cash taxes in the early years (creating a Deferred Tax Liability) and more later. The total tax paid over the asset's life is the same; only the timing differs.</p>

<p><strong>Net Operating Losses (NOLs)</strong> occur when a company reports negative taxable income. These losses can be carried forward and used to reduce taxes in future profitable years. NOLs are recorded as a Deferred Tax Asset because they represent future tax savings. Under current U.S. rules, NOLs can be carried forward indefinitely but only offset up to 80% of taxable income in any year.</p>`,
  },
  {
    title: 'Other Non-Cash Items',
    content: `<h4>Stock-Based Compensation (SBC)</h4>

<p>When companies grant stock options or restricted stock units to employees, they record an expense on the Income Statement for the fair value of the grants. No cash changes hands (the company is issuing paper, not writing a check), so SBC is a non-cash expense added back on the Cash Flow Statement. However, SBC dilutes existing shareholders, so there's a real economic cost&mdash;it's just paid in equity rather than cash.</p>

<h4>Goodwill and Intangible Assets</h4>

<p>When Company A acquires Company B for $500M, but Company B's net assets are worth only $300M at fair value, the $200M excess is recorded as <strong>Goodwill</strong>. Goodwill is not amortized; instead, it's tested annually for impairment. If the acquired business deteriorates, Goodwill is written down via a non-cash charge on the Income Statement.</p>

<p>Other acquired <strong>Intangible Assets</strong> (patents, customer lists, trademarks) are amortized over their estimated useful lives. Like Depreciation, Amortization is a non-cash charge added back on the CFS.</p>`,
  },
  {
    title: 'The Three Statements in Summary',
    content: `<table class="comparison-table">
<tr>
  <th>Statement</th>
  <th>What It Shows</th>
  <th>Key Principle</th>
</tr>
<tr>
  <td><strong>Income Statement</strong></td>
  <td>Revenue, expenses, and profit over a period</td>
  <td>Items must correspond to the period and affect shareholder income</td>
</tr>
<tr>
  <td><strong>Balance Sheet</strong></td>
  <td>Assets, Liabilities, and Equity at a point in time</td>
  <td>Assets = Liabilities + Equity (must always balance)</td>
</tr>
<tr>
  <td><strong>Cash Flow Statement</strong></td>
  <td>Actual cash generated and spent</td>
  <td>Reconciles the gap between Net Income and the change in Cash</td>
</tr>
</table>

<p>The three statements are linked in a cycle: Net Income from the IS flows into the CFS. Adjustments on the CFS (non-cash charges, working capital changes, CapEx, financing) determine the change in Cash. That change flows into the BS, where Cash is updated and Equity is adjusted for retained earnings. The BS must balance at all times.</p>`,
  },
  {
    title: 'Free Cash Flow',
    content: `<p><strong>Unlevered Free Cash Flow (UFCF)</strong> is the measure most commonly used in valuation. It represents cash generated by core operations, available to all capital providers:</p>

<div class="formula-box">
UFCF = EBIT × (1 − Tax Rate) + D&amp;A ± Non-Cash Adjustments − ΔWorking Capital − CapEx
</div>

<p>UFCF excludes Interest Expense because it's available to both Debt and Equity holders. <strong>Levered Free Cash Flow (LFCF)</strong> starts from Net Income (which is after interest) and represents cash available only to Equity holders. Each version pairs with a different Discount Rate: UFCF is discounted at WACC; LFCF is discounted at Cost of Equity.</p>`,
  },
  {
    title: 'Key Ratios and Metrics',
    content: `<p><strong>EBITDA</strong> (Earnings Before Interest, Taxes, Depreciation, and Amortization) is a rough proxy for operating cash flow. It's widely used because it strips out capital structure (interest), tax jurisdiction (taxes), and accounting policy (D&A) differences, making cross-company comparisons cleaner. But it's not actual cash flow&mdash;it ignores CapEx, working capital changes, and taxes, all of which matter enormously.</p>

<p><strong>ROIC (Return on Invested Capital)</strong> = NOPAT / Invested Capital. This measures how efficiently a company converts invested capital into operating profit. When ROIC exceeds WACC, the company is creating value. When it's below WACC, it's destroying value.</p>

<p><strong>Leverage ratios</strong> like Debt/EBITDA and Interest Coverage (EBITDA/Interest) assess a company's ability to manage its debt burden. A Debt/EBITDA ratio of 3.0x means it would take three years of EBITDA to repay all Debt, assuming no other cash uses.</p>`,
  },
  {
    title: 'Accounting: Interview Questions',
    content: `<div class="interview-q">
<div class="q-label">Question 1</div>
<div class="question">Walk me through how the three financial statements connect.</div>
<div class="answer">Net Income from the Income Statement is the starting point of the Cash Flow Statement. The CFS adjusts Net Income for non-cash items (like D&A and SBC), working capital changes, CapEx, and financing activities to arrive at the actual change in Cash. That cash change flows onto the Balance Sheet, updating the Cash line item. The BS also updates Equity by Net Income minus Dividends. At all times, Assets must equal Liabilities plus Equity.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 2</div>
<div class="question">Depreciation increases by $15. Walk through the statements. Tax rate is 30%.</div>
<div class="answer"><strong>IS:</strong> Operating Income falls $15, taxes decrease by $4.50, Net Income decreases by $10.50. <strong>CFS:</strong> Net Income is down $10.50, but Depreciation (a non-cash charge) is added back at $15. Net cash effect: +$4.50. <strong>BS:</strong> Cash up $4.50, Net PP&E down $15 → Total Assets down $10.50. Equity (retained earnings) down $10.50. Balances.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 3</div>
<div class="question">A company prepays $60,000 for a year of insurance. Walk through the statements at the time of payment and 6 months later.</div>
<div class="answer"><strong>At payment:</strong> No Income Statement effect (the expense hasn't been "used" yet). CFS: Cash down $60K. BS: Cash down $60K, Prepaid Expenses (an asset) up $60K. <strong>After 6 months:</strong> IS: $30K expense recognized (6/12 of the annual cost). At 30% tax, Net Income decreases by $21K. CFS: Net Income down $21K. Prepaid Expenses decreasing is added back as a positive working capital adjustment of $30K. But wait&mdash;the tax benefit is already in Net Income. Net cash effect: $30K − $21K = +$9K (that's the $30K × 30% tax savings). BS: Cash up $9K, Prepaid Expenses down $30K → Assets down $21K. Equity down $21K. Balances.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 4</div>
<div class="question">Why isn't Depreciation a "real" expense?</div>
<div class="answer">Depreciation doesn't represent a cash outflow in the period it's recorded. The cash was spent when the asset was originally purchased (the CapEx). Depreciation simply allocates that historical cost across the asset's useful life for accounting purposes. However, it does have a real tax benefit: by reducing taxable income, it reduces the company's actual cash tax payments.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 5</div>
<div class="question">A company's EBITDA grew 25% last year but it filed for bankruptcy. How is that possible?</div>
<div class="answer">EBITDA is a crude cash flow proxy that ignores several major cash drains: heavy CapEx (the company might be spending massively on expansion), large debt principal repayments (which don't appear on the Income Statement at all), negative working capital changes (e.g., extending too much credit to customers, building excess inventory), one-time restructuring costs, or high cash tax payments. Any of these could exhaust cash despite strong EBITDA.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 6</div>
<div class="question">Is negative Working Capital a good or bad sign?</div>
<div class="answer">It depends on the composition. If negative Working Capital is driven by high Deferred Revenue (e.g., a subscription business collecting annual payments upfront), it's very positive&mdash;the company collects cash before delivering services. But if it's driven by excessive Accounts Payable (the company can't pay suppliers on time), it's a warning sign of financial distress. Always look at the individual components, not just the net number.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 7</div>
<div class="question">What's the difference between Free Cash Flow and Net Income?</div>
<div class="answer">Net Income is an accounting measure that includes non-cash items (D&A, SBC), excludes actual cash expenditures (CapEx, Debt repayment), and may not reflect the timing of cash receipts and payments (working capital effects). FCF starts with operating income, removes the distortions of accrual accounting, and shows the actual cash a business generates that's available to distribute to investors. A company can have positive Net Income but negative FCF (e.g., if CapEx greatly exceeds D&A) or negative Net Income but positive FCF (e.g., if large non-cash charges depress income but cash generation is healthy).</div>
</div>

<div class="interview-q">
<div class="q-label">Question 8</div>
<div class="question">A company issues $200 million of Debt at 5% interest and repays $25M of principal per year. Walk through Year 1 (issuance) and Year 2 (first full year of interest and repayment). Tax rate is 25%.</div>
<div class="answer"><strong>Year 1 (issuance, assume end of year):</strong> IS: No impact. CFS: +$200M under Financing. BS: Cash +$200M, Debt +$200M. <strong>Year 2:</strong> IS: Interest Expense = $200M × 5% = $10M. Pre-Tax Income falls $10M. Net Income falls $7.5M (after 25% tax savings). CFS: Net Income down $7.5M. Principal repayment of $25M under Financing (no IS impact). Total Cash change: −$32.5M. BS: Cash −$32.5M. Debt −$25M. Equity −$7.5M. Check: Assets change (−$32.5M) = Liabilities change (−$25M) + Equity change (−$7.5M). Balances.</div>
</div>`,
  },
];
