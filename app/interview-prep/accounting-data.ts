// Investment Banking Technical Mastery Manual — Module 1 & 2
export const ACCOUNTING_SECTIONS = [
  {
    title: '1.1 Why Accounting Is the Foundation of Investment Banking',
    content: `<p>Every major technical topic in investment banking sits on top of accounting.</p>
<ul>
<li>Valuation depends on financial statement analysis.</li>
<li>M&amp;A analysis depends on earnings, cash flow, debt, and purchase accounting.</li>
<li>LBOs depend on cash generation, debt paydown, and returns.</li>
<li>Financial modeling depends on linking operating assumptions through the three statements.</li>
</ul>
<p>This is why technical interviews often begin with simple accounting questions. Interviewers are not testing whether you passed introductory accounting. They are testing whether your mental foundation is stable enough to support more advanced topics.</p>
<p>A candidate who cannot explain how depreciation flows through the statements will usually struggle to explain unlevered free cash flow, accretion / dilution, or LBO debt paydown.</p>`,
  },
  {
    title: '1.2 The Three Financial Statements From First Principles',
    content: `<h3>The Income Statement</h3>
<p><strong>What it is:</strong> The income statement measures a company's accounting profitability over a period of time.</p>
<p><strong>Why it exists:</strong> Investors, lenders, management teams, and regulators need a standardized way to measure business performance over a period such as a quarter or year.</p>
<p><strong>When it is used:</strong> It is used to assess profitability, operating performance, margins, trends, and earnings power.</p>
<p><strong>Core structure:</strong></p>
<ul>
<li>Revenue</li>
<li>Less: Cost of Goods Sold (COGS)</li>
<li>Equals: Gross Profit</li>
<li>Less: Operating Expenses (SG&amp;A, R&amp;D, etc.)</li>
<li>Equals: EBITDA (if D&amp;A excluded above)</li>
<li>Less: Depreciation &amp; Amortization</li>
<li>Equals: EBIT / Operating Income</li>
<li>Less: Interest Expense</li>
<li>Plus / Minus: Other non-operating items</li>
<li>Equals: Pre-Tax Income</li>
<li>Less: Taxes</li>
<li>Equals: Net Income</li>
</ul>
<p><strong>Intuition:</strong> The income statement is the company's scorecard for a period. But it is not the same as cash. It includes non-cash expenses, accruals, and accounting conventions. That distinction is central to banking interviews.</p>
<p><strong>Key insight bankers care about:</strong> A business can report strong net income and still have weak cash flow. It can also report weak net income and still generate strong cash flow. The reason is that accounting profit and actual cash movement are not the same thing.</p>

<h3>The Cash Flow Statement</h3>
<p><strong>What it is:</strong> The cash flow statement shows how cash changed over a period.</p>
<p><strong>Why it exists:</strong> Because accounting profit alone is not enough. Stakeholders need to know where cash came from and where it went.</p>
<p><strong>When it is used:</strong> It is used to assess liquidity, cash generation, reinvestment, financing activity, and the ability to service debt or return capital.</p>
<p><strong>Three sections:</strong></p>
<ul>
<li>Cash Flow from Operations (CFO)</li>
<li>Cash Flow from Investing (CFI)</li>
<li>Cash Flow from Financing (CFF)</li>
</ul>
<p><strong>Intuition:</strong> If the income statement is the scorecard, the cash flow statement is the bank account explanation.</p>
<ul>
<li>CFO tells you how much cash the actual business operations generated.</li>
<li>CFI tells you how much cash the company spent on or received from investments.</li>
<li>CFF tells you how the company raised or returned capital.</li>
</ul>
<p><strong>Common misconception:</strong> Candidates often say "cash flow statement equals cash flow." But different definitions of cash flow matter in finance:</p>
<ul>
<li>GAAP Cash Flow from Operations</li>
<li>Unlevered Free Cash Flow</li>
<li>Levered Free Cash Flow</li>
<li>Free Cash Flow to Equity</li>
</ul>
<p>The cash flow statement is a financial reporting statement. Free cash flow is an analytical concept.</p>

<h3>The Balance Sheet</h3>
<p><strong>What it is:</strong> The balance sheet is a snapshot of the company's financial position at a specific point in time.</p>
<p><strong>Why it exists:</strong> It shows what the company owns, what it owes, and what belongs to equity holders.</p>
<p><strong>When it is used:</strong> It is used to assess liquidity, leverage, capital structure, working capital, asset intensity, and book value.</p>
<p><strong>Core equation:</strong> Assets = Liabilities + Equity</p>
<p><strong>Assets:</strong> Cash &amp; cash equivalents, Accounts receivable, Inventory, PP&amp;E, Intangible assets, Goodwill, Other assets</p>
<p><strong>Liabilities:</strong> Accounts payable, Accrued expenses, Deferred revenue, Short-term debt, Long-term debt, Other liabilities</p>
<p><strong>Equity:</strong> Common stock / APIC, Retained earnings, Treasury stock, Other equity accounts</p>
<p><strong>Intuition:</strong> The balance sheet is the company's resource and funding map. Assets = what the company uses. Liabilities = outside claims. Equity = residual ownership claim.</p>
<p><strong>What interviewers often care about:</strong> They care less about the memorized list and more about whether you understand the role of each line item. For example: Accounts receivable represents revenue recognized but cash not yet collected. Inventory represents cash tied up in unsold goods. Deferred revenue represents cash collected before revenue recognition.</p>`,
  },
  {
    title: '1.3 The Logic of Accrual Accounting',
    content: `<p>One of the most important first principles in finance is the difference between accrual accounting and cash accounting.</p>
<p><strong>Cash accounting:</strong> Revenue and expenses are recorded when cash changes hands.</p>
<p><strong>Accrual accounting:</strong> Revenue is recorded when earned, and expenses are recorded when incurred, even if cash has not moved yet.</p>
<p><strong>Why accrual accounting exists:</strong> Because cash timing can distort performance.</p>
<p><strong>Example:</strong> A software company sells a 12-month contract and collects all cash upfront. Under pure cash accounting, revenue would spike immediately. Under accrual accounting, the company recognizes revenue over time as it delivers the service. This makes performance measurement more meaningful.</p>
<p><strong>Why bankers care:</strong> Because valuation depends on economic performance, not just raw cash timing. But debt repayment depends on actual cash. So you must understand both worlds.</p>`,
  },
  {
    title: '1.4 How the Three Statements Link Together',
    content: `<p>This is the core backbone of technical interviews.</p>
<p><strong>Master linkage framework:</strong></p>
<ol>
<li>Net Income from the Income Statement flows into the top of the Cash Flow Statement.</li>
<li>The Cash Flow Statement adjusts Net Income for non-cash items and working capital changes, then adds investing and financing activity to arrive at the net change in cash.</li>
<li>The ending cash balance from the Cash Flow Statement flows onto the Balance Sheet.</li>
<li>Net Income, net of dividends, flows into Retained Earnings within Shareholders' Equity on the Balance Sheet.</li>
<li>Many Balance Sheet items create Income Statement or Cash Flow Statement effects over time.</li>
</ol>
<p><strong>Simple conceptual map:</strong></p>
<p>Income Statement → Net Income → Cash Flow Statement → Ending Cash → Balance Sheet<br/>Net Income → Retained Earnings → Balance Sheet</p>
<p>If you can keep this map mentally active, many technical questions become easier.</p>`,
  },
  {
    title: '1.5 Step-by-Step 3-Statement Walkthroughs',
    content: `<p>Below are the types of questions that appear constantly in technical interviews.</p>

<h3>Scenario 1: Depreciation Increases by $10</h3>
<p>Assume a 25% tax rate.</p>
<p><strong>Step 1: Income Statement</strong> — Depreciation is an expense, so EBIT decreases by $10. Pre-Tax Income decreases by $10. Taxes decrease by $2.5. Net Income decreases by $7.5.</p>
<p><strong>Step 2: Cash Flow Statement</strong> — Net Income starts down $7.5. Depreciation is a non-cash expense, so you add back the full $10. Net change in cash is +$2.5.</p>
<p><strong>Step 3: Balance Sheet</strong> — Cash increases by $2.5. PP&amp;E decreases by $10 because accumulated depreciation increases. Retained Earnings decrease by $7.5 due to lower Net Income.</p>
<p><strong>Balance Check:</strong> Assets: Cash +2.5 and PP&amp;E -10 = net Assets down 7.5. Liabilities: no change. Equity: Retained Earnings down 7.5. Balance Sheet balances.</p>
<p><strong>Why this matters:</strong> This is the classic example of how a non-cash expense can reduce accounting profit but increase cash flow.</p>
<p><strong>Interview insight:</strong> Strong candidates do not stop at "cash goes up because depreciation is non-cash." They explicitly say the tax shield is what causes cash to increase.</p>

<h3>Scenario 2: CapEx Increases by $10</h3>
<p>Assume a 25% tax rate and that depreciation is unchanged for now.</p>
<p><strong>Step 1: Income Statement</strong> — No immediate effect, because CapEx is capitalized, not expensed directly. Net Income does not change initially.</p>
<p><strong>Step 2: Cash Flow Statement</strong> — No change to Net Income in CFO. Under CFI, CapEx increases by $10, so cash decreases by $10.</p>
<p><strong>Step 3: Balance Sheet</strong> — Cash decreases by $10. PP&amp;E increases by $10 because the company bought an asset.</p>
<p><strong>Balance Check:</strong> Assets: Cash -10, PP&amp;E +10 = no net change. Liabilities and Equity unchanged. Balance Sheet balances.</p>
<p><strong>Interview insight:</strong> Candidates often confuse CapEx and depreciation. CapEx is a real cash outflow. Depreciation is the later accounting recognition of that past investment.</p>

<h3>Scenario 3: Inventory Increases by $10</h3>
<p>Assume no taxes because there is no Income Statement effect initially.</p>
<p><strong>Step 1: Income Statement</strong> — No immediate effect if inventory is simply purchased and not sold.</p>
<p><strong>Step 2: Cash Flow Statement</strong> — Inventory is a current asset and part of working capital. An increase in inventory is a use of cash. Cash from Operations decreases by $10.</p>
<p><strong>Step 3: Balance Sheet</strong> — Cash decreases by $10. Inventory increases by $10.</p>
<p><strong>Balance Check:</strong> Assets unchanged overall. Liabilities and Equity unchanged. Balance Sheet balances.</p>
<p><strong>Intuition:</strong> The company used cash to buy goods it has not sold yet.</p>

<h3>Scenario 4: Accounts Receivable Increases by $10</h3>
<p><strong>Step 1: Income Statement</strong> — Revenue has been recognized, so Net Income rises depending on margin assumptions. For simplicity, assume $10 increase in revenue with no associated costs and a 25% tax rate. Pre-Tax Income increases by $10. Taxes increase by $2.5. Net Income increases by $7.5.</p>
<p><strong>Step 2: Cash Flow Statement</strong> — Net Income starts up $7.5. Increase in Accounts Receivable is a use of cash, so subtract $10 in CFO. Net cash decreases by $2.5.</p>
<p><strong>Step 3: Balance Sheet</strong> — Cash decreases by $2.5. Accounts Receivable increases by $10. Retained Earnings increase by $7.5.</p>
<p><strong>Balance Check:</strong> Assets: Cash -2.5, AR +10 = +7.5. Equity: Retained Earnings +7.5. Balances.</p>
<p><strong>Intuition:</strong> The company booked revenue, but it has not collected the cash yet.</p>

<h3>Scenario 5: Accounts Payable Increases by $10</h3>
<p>Assume the company incurred an expense but has not paid cash yet. For simplicity, assume pre-tax expense rises by $10 and tax rate is 25%.</p>
<p><strong>Step 1: Income Statement</strong> — Expense increases by $10. Pre-Tax Income decreases by $10. Taxes decrease by $2.5. Net Income decreases by $7.5.</p>
<p><strong>Step 2: Cash Flow Statement</strong> — Net Income starts down $7.5. Increase in Accounts Payable is a source of cash, so add $10 in CFO. Net cash increases by $2.5.</p>
<p><strong>Step 3: Balance Sheet</strong> — Cash increases by $2.5. Accounts Payable increases by $10. Retained Earnings decrease by $7.5.</p>
<p><strong>Balance Check:</strong> Assets: Cash +2.5. Liabilities: AP +10. Equity: RE -7.5. Liabilities + Equity = +2.5. Balances.</p>
<p><strong>Intuition:</strong> The company recorded the expense, but it delayed paying cash.</p>

<h3>Scenario 6: Debt Increases by $100</h3>
<p><strong>Step 1: Income Statement</strong> — No immediate effect at issuance.</p>
<p><strong>Step 2: Cash Flow Statement</strong> — Financing cash inflow of +$100.</p>
<p><strong>Step 3: Balance Sheet</strong> — Cash increases by $100. Debt increases by $100.</p>
<p><strong>Intuition:</strong> The company raised financing. No profit impact yet, but future interest expense will affect earnings.</p>

<h3>Scenario 7: Dividend Paid of $20</h3>
<p><strong>Step 1: Income Statement</strong> — No impact because dividends are not expenses.</p>
<p><strong>Step 2: Cash Flow Statement</strong> — Financing outflow of $20.</p>
<p><strong>Step 3: Balance Sheet</strong> — Cash decreases by $20. Retained Earnings decrease by $20.</p>
<p><strong>Intuition:</strong> Dividends are distributions of earnings, not operating expenses.</p>`,
  },
  {
    title: '1.6 Working Capital: One of the Most Misunderstood Topics',
    content: `<p><strong>Definition:</strong> Working Capital usually refers to current operating assets minus current operating liabilities.</p>
<p>In interview settings, candidates often use Net Working Capital (NWC) to mean: NWC = Current Operating Assets - Current Operating Liabilities</p>
<p>Usually excluding: Cash, Debt, Sometimes taxes and certain one-time items depending on context.</p>
<p><strong>Common operating components:</strong></p>
<p><strong>Current Operating Assets:</strong> Accounts Receivable, Inventory, Prepaid Expenses</p>
<p><strong>Current Operating Liabilities:</strong> Accounts Payable, Accrued Expenses, Deferred Revenue</p>
<p><strong>Why it matters:</strong> Working capital measures how much cash is tied up in the day-to-day operations of the business. If working capital increases, the business is consuming cash. If working capital decreases, the business is releasing cash.</p>
<p><strong>Intuition by line item:</strong></p>
<ul>
<li>AR up → you sold product but have not collected cash → use of cash</li>
<li>Inventory up → you bought goods not yet sold → use of cash</li>
<li>AP up → you delayed paying suppliers → source of cash</li>
<li>Deferred Revenue up → collected cash before recognizing revenue → source of cash</li>
</ul>
<p><strong>Why interviewers love this topic:</strong> Because it tests whether you truly understand timing between accounting recognition and cash movement.</p>`,
  },
  {
    title: '1.7 Deferred Revenue and Accrued Expenses',
    content: `<h3>Deferred Revenue</h3>
<p><strong>What it is:</strong> Cash collected before revenue is recognized.</p>
<p><strong>Example:</strong> A customer prepays a 12-month subscription.</p>
<p><strong>Impact:</strong> Cash goes up immediately. Revenue is recognized over time. Deferred Revenue liability goes up initially.</p>
<p><strong>Interview insight:</strong> Increase in deferred revenue is a source of cash because cash comes in before the earnings are recognized.</p>

<h3>Accrued Expenses</h3>
<p><strong>What it is:</strong> Expenses recognized before cash is paid.</p>
<p><strong>Example:</strong> Employee wages incurred at the end of the quarter but paid next quarter.</p>
<p><strong>Impact:</strong> Expense hits the Income Statement now. Cash leaves later. Accrued liability increases.</p>
<p><strong>Interview insight:</strong> Increase in accrued expenses is a source of cash.</p>`,
  },
  {
    title: '1.8 PP&E, Depreciation, Amortization, and Capitalized Assets',
    content: `<p><strong>PP&amp;E:</strong> Property, Plant &amp; Equipment represents long-lived tangible assets.</p>
<p><strong>Depreciation:</strong> Depreciation is the accounting allocation of a tangible asset's cost over its useful life.</p>
<p><strong>Amortization:</strong> Amortization is the analogous concept for intangible assets with finite useful lives.</p>
<p><strong>Key distinction:</strong> CapEx = actual cash spent to acquire or improve long-lived assets. Depreciation / amortization = non-cash accounting expense recognized over time.</p>
<p><strong>Bankers think about this in two layers:</strong></p>
<ol>
<li>Accounting earnings impact</li>
<li>Cash flow and reinvestment implications</li>
</ol>
<p>A company with low depreciation today may still need high CapEx tomorrow. This is why EBITDA is useful but incomplete.</p>`,
  },
  {
    title: '1.9 Common Accounting Mistakes Candidates Make',
    content: `<ol>
<li>Forgetting taxes when a pre-tax item changes the Income Statement</li>
<li>Treating CapEx as an expense on the Income Statement immediately</li>
<li>Confusing depreciation with CapEx</li>
<li>Saying "working capital increased, so cash increased" without checking the direction</li>
<li>Failing to distinguish current asset increases from current liability increases</li>
<li>Forgetting dividends do not hit the Income Statement</li>
<li>Forgetting interest expense matters for levered earnings but not enterprise value-based FCF</li>
<li>Not checking that the Balance Sheet balances at the end</li>
</ol>`,
  },
  {
    title: '1.10 How Interviewers Actually Evaluate Accounting Answers',
    content: `<p>Interviewers look for: Logical sequencing, Correct signs and directions, Clear distinction between cash and non-cash, Comfort rather than panic, Ability to explain why, not just what.</p>
<p><strong>A strong answer sounds like:</strong></p>
<p>"Depreciation would reduce EBIT by $10, taxes would fall by $2.5, and Net Income would decline by $7.5. On the Cash Flow Statement, we add back the non-cash $10 depreciation, so cash rises by $2.5 from the tax shield. On the Balance Sheet, cash is up $2.5, PP&amp;E is down $10, and Retained Earnings are down $7.5, so the Balance Sheet balances."</p>
<p>That sounds materially stronger than: "Net income goes down, then you add back depreciation, and cash goes up."</p>

<h3>Module 1 Practice Drills</h3>
<p><strong>Technical drills — Walk through all three statements for each:</strong></p>
<ol>
<li>Depreciation increases by $15</li>
<li>CapEx increases by $20</li>
<li>Accounts Receivable increases by $12</li>
<li>Inventory decreases by $8</li>
<li>Accounts Payable decreases by $10</li>
<li>Debt issuance of $50</li>
<li>Dividend payment of $25</li>
<li>Deferred revenue increases by $30</li>
<li>Stock-based compensation increases by $5</li>
<li>Goodwill impairment of $40</li>
</ol>
<p><strong>Explain-out-loud drills:</strong></p>
<ul>
<li>Explain the difference between accrual accounting and cash accounting</li>
<li>Explain why depreciation can increase cash flow</li>
<li>Explain why an increase in inventory is a use of cash</li>
<li>Explain the difference between CapEx and depreciation</li>
</ul>
<p><strong>Self-test framework — For any accounting change, ask:</strong></p>
<ol>
<li>Does it hit the Income Statement immediately?</li>
<li>Is there a tax effect?</li>
<li>Is it cash or non-cash?</li>
<li>Is it operating, investing, or financing cash flow?</li>
<li>Which Balance Sheet accounts change?</li>
<li>Does the Balance Sheet still balance?</li>
</ol>`,
  },
  {
    title: '2.1 The Income Statement in Detail',
    content: `<h3>Revenue</h3>
<p><strong>What it is:</strong> Revenue is the value of goods or services delivered during a period.</p>
<p><strong>Why it matters:</strong> Revenue is the top line. It is the starting point for profitability analysis, valuation forecasting, and operating leverage.</p>
<p><strong>Ways bankers think about revenue:</strong> Revenue can usually be decomposed into economic drivers such as: Price × volume, Customers × average spend, Units sold × average selling price, Subscribers × ARPU, Rooms × occupancy × ADR.</p>
<p><strong>Why this matters in interviews:</strong> If you are asked why revenue grew, you should think in drivers, not just state the number. Strong candidates naturally ask: Was growth price-driven or volume-driven? Was it organic or acquisition-driven? Was it broad-based or mix-driven? Was it sustainable?</p>
<p><strong>Revenue recognition nuance:</strong> Revenue does not always equal cash receipts. Examples: SaaS subscriptions, Construction contracts, Long-term service agreements, Product sold on credit.</p>

<h3>Cost of Goods Sold (COGS)</h3>
<p>COGS represents the direct costs associated with producing or delivering the company's products or services. Examples: Raw materials, Direct labor in manufacturing, Hosting costs for certain software businesses, Freight or fulfillment costs depending on accounting presentation.</p>

<h3>Gross Profit and Gross Margin</h3>
<p>Gross Profit = Revenue - COGS. Gross Margin = Gross Profit / Revenue.</p>
<p><strong>Why bankers care:</strong> Gross margin says a lot about: Pricing power, Input cost pressure, Product mix, Business model quality.</p>

<h3>Operating Expenses</h3>
<p>Operating expenses typically include: SG&amp;A, R&amp;D, Marketing, Corporate overhead.</p>
<p><strong>Operating leverage:</strong> A business with a high fixed-cost base can see profits rise disproportionately when revenue grows, but profits can also collapse when revenue falls. Interviewers like this concept because it links accounting to business model quality.</p>

<h3>EBITDA</h3>
<p><strong>Definition:</strong> Earnings Before Interest, Taxes, Depreciation, and Amortization.</p>
<p><strong>Why it exists:</strong> EBITDA is used as a rough proxy for operating profitability before capital structure and certain non-cash charges.</p>
<p><strong>Why bankers use it:</strong> Capital structure neutral relative to net income. Common valuation metric for enterprise value comparisons. Useful for comparing companies with different debt levels and tax rates.</p>
<p><strong>Why EBITDA is not cash flow:</strong> Candidates get trapped here. EBITDA ignores: CapEx, Changes in working capital, Cash taxes, Interest, Required reinvestment. A company can have strong EBITDA but poor cash generation.</p>
<p><strong>Strong answer:</strong> "EBITDA is useful as a rough operating metric and as a denominator in EV-based multiples, but it is not a true measure of cash flow because it excludes working capital needs, taxes, and capital expenditures."</p>

<h3>EBIT / Operating Income</h3>
<p>EBIT reflects operating performance after depreciation and amortization.</p>
<p><strong>Why it matters:</strong> Better than EBITDA for capital-intensive businesses in some contexts. Common in DCF forecasting because EBIT is the basis for tax-affected operating profit.</p>
<p><strong>Interview nuance:</strong> For capital-intensive companies, EBIT may be more economically meaningful than EBITDA because D&amp;A reflects part of the cost of maintaining assets, even though it is not identical to CapEx.</p>

<h3>Interest Expense and Pre-Tax Income</h3>
<p>Interest expense reflects the cost of debt financing.</p>
<p><strong>Why this matters:</strong> Interest affects Net Income and EPS. It does not affect enterprise value-based free cash flow directly. It matters a lot in accretion / dilution and LBOs.</p>
<p><strong>Interview trap:</strong> Candidates often mix operating performance with financing effects. Bankers constantly separate business value from financing structure.</p>

<h3>Taxes</h3>
<p>Taxes are critical because almost every technical answer eventually touches them.</p>
<p><strong>Common tax concepts:</strong> Statutory tax rate, Effective tax rate, Cash tax rate, NOLs, Deferred taxes.</p>
<p><strong>Interview standard:</strong> Use the tax rate consistently and know when to apply it. If a question changes EBIT by $10 and there are no special circumstances, the after-tax impact is often $10 × (1 - tax rate).</p>`,
  },
  {
    title: '2.2 The Cash Flow Statement in Detail',
    content: `<h3>Cash Flow from Operations (CFO)</h3>
<p>CFO starts with Net Income and adjusts for: Non-cash expenses, Working capital changes.</p>
<p><strong>Common non-cash add-backs:</strong> Depreciation, Amortization, Stock-based compensation, Impairment charges, Deferred taxes in some cases.</p>
<p><strong>Common working capital adjustments:</strong> Increase in AR → subtract. Increase in inventory → subtract. Increase in AP → add. Increase in deferred revenue → add.</p>
<p><strong>Intuition:</strong> CFO translates accrual earnings into operational cash.</p>

<h3>Cash Flow from Investing (CFI)</h3>
<p>Usually includes: Capital expenditures, Acquisitions, Purchases / sales of investments, Asset sales.</p>
<p><strong>Interview nuance:</strong> CapEx almost always appears here as a negative number. Asset sales appear here too, but gains or losses on the asset sale affect the Income Statement and are adjusted in CFO because the sale proceeds themselves are investing cash flow.</p>

<h3>Cash Flow from Financing (CFF)</h3>
<p>Includes: Debt issuance / repayment, Equity issuance / repurchase, Dividends.</p>
<p><strong>Why it matters in banking:</strong> This section is critical for understanding how companies fund themselves and return capital.</p>`,
  },
  {
    title: '2.3 The Balance Sheet in Detail',
    content: `<p><strong>Cash:</strong> Most liquid asset. Critical for valuation because excess cash is added in equity value bridge calculations.</p>
<p><strong>Accounts Receivable:</strong> Represents recognized revenue not yet collected. Important for working capital analysis and quality of earnings.</p>
<p><strong>Inventory:</strong> Represents unsold goods. Important for cash conversion and operational efficiency.</p>
<p><strong>PP&amp;E:</strong> Long-lived tangible assets. Important for capital intensity and D&amp;A.</p>
<p><strong>Goodwill:</strong> Created in acquisitions when purchase price exceeds the fair value of identifiable net assets.</p>
<p><strong>Intangible Assets:</strong> Can include customer relationships, developed technology, trademarks, etc. May be finite-lived and amortized or indefinite-lived.</p>
<p><strong>Accounts Payable and Accrued Expenses:</strong> Short-term operating liabilities. Core to working capital analysis.</p>
<p><strong>Deferred Revenue:</strong> Cash received before revenue recognition. A common source of favorable working capital in subscription-like businesses.</p>
<p><strong>Debt:</strong> A financing liability. Important for leverage, interest burden, and capital structure.</p>
<p><strong>Retained Earnings:</strong> Accumulated net income minus dividends. A classic linkage line item in technical interviews.</p>`,
  },
  {
    title: '2.4 Quality of Earnings and Why Interviewers Care',
    content: `<p>Not all earnings are equal.</p>
<p>A company may show strong earnings due to: Aggressive revenue recognition, One-time gains, Low maintenance CapEx temporarily, Working capital benefits that reverse later.</p>
<p><strong>Bankers care about sustainable earnings and cash flow.</strong></p>
<p><strong>Signs earnings may be lower quality:</strong></p>
<ul>
<li>Revenue grows much faster than cash collections</li>
<li>EBITDA grows while working capital deteriorates sharply</li>
<li>Frequent one-time add-backs</li>
<li>Large divergence between net income and cash flow over time</li>
</ul>
<p>This level of thinking separates advanced candidates from surface-level ones.</p>`,
  },
  {
    title: '2.5 Important Non-Cash and Non-Recurring Items',
    content: `<p><strong>Stock-Based Compensation:</strong> A non-cash expense that reduces net income but is added back in CFO. However, it is economically real because it dilutes shareholders.</p>
<p><strong>Asset Write-Downs / Impairments:</strong> Non-cash charges that reduce earnings and the asset value on the Balance Sheet. Added back on the cash flow statement if non-cash.</p>
<p><strong>Restructuring Charges:</strong> May be part non-cash, part cash. Interviewers like this because candidates often oversimplify.</p>
<p><strong>Deferred Taxes:</strong> One of the trickier areas. They arise due to timing differences between book and tax treatment.</p>`,
  },
  {
    title: '2.6 Statement Analysis Ratios Every Candidate Should Know',
    content: `<p><strong>Profitability ratios:</strong> Gross Margin, EBITDA Margin, EBIT Margin, Net Margin, ROA, ROE</p>
<p><strong>Liquidity ratios:</strong> Current Ratio, Quick Ratio</p>
<p><strong>Leverage ratios:</strong> Debt / EBITDA, Debt / Capital, Interest Coverage</p>
<p><strong>Efficiency ratios:</strong> DSO, DIO, DPO, Cash Conversion Cycle</p>
<p><strong>Why these matter:</strong> Even if not directly asked, these metrics help you reason through businesses quickly.</p>`,
  },
  {
    title: '2.7 Common Financial Statement Interview Questions + Module 2 Practice Drills',
    content: `<p><strong>Q: Why does an increase in working capital reduce cash flow?</strong></p>
<p>Because it means the company has tied up more cash in operations, such as receivables or inventory, relative to operating liabilities.</p>
<p><strong>Q: Is EBITDA always higher than cash flow?</strong></p>
<p>Not necessarily. EBITDA ignores working capital, taxes, interest, and CapEx, but cash flow can exceed EBITDA in some periods due to favorable working capital movements or other timing items.</p>
<p><strong>Q: Why might net income be negative while cash flow is positive?</strong></p>
<p>Because of non-cash charges like D&amp;A, favorable working capital movements, or deferred revenue inflows.</p>

<h3>Module 2 Practice Drills</h3>
<p><strong>Technical drills:</strong></p>
<ol>
<li>Explain why EBITDA is not cash flow</li>
<li>Explain why Deferred Revenue is a liability</li>
<li>Explain how goodwill is created</li>
<li>Explain the difference between EBIT and EBITDA</li>
<li>Explain why stock-based compensation is added back in CFO but still economically matters</li>
<li>Explain why a company with strong revenue growth can still have poor cash flow</li>
</ol>
<p><strong>Interview-style questions:</strong> Walk me through the three statements. Why does depreciation affect all three statements? What is working capital and why does it matter? What is deferred revenue? Why can cash flow be higher than net income?</p>
<p><strong>Explain-out-loud exercise:</strong> Take any public company and explain its business model in terms of: Revenue drivers, Cost structure, Working capital characteristics, Capital intensity, Financing profile.</p>
<p><strong>Self-testing framework — When looking at a company, ask:</strong></p>
<ol>
<li>How does it make money?</li>
<li>What are the main revenue drivers?</li>
<li>What are the main fixed and variable costs?</li>
<li>How much cash gets tied up in working capital?</li>
<li>How capital-intensive is it?</li>
<li>Is accounting profit similar to real cash generation?</li>
</ol>`,
  },
];
