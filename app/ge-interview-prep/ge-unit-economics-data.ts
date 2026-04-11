export const GE_UNIT_ECONOMICS_SECTIONS = [
  {
    title: 'Why Unit Economics Matter',
    content: `<p>Unit economics answer a simple question: <strong>does the company make money on each customer?</strong> Revenue growth is meaningless if every new customer costs more to acquire than they'll ever generate in profit. A company burning $10M per year to grow from $20M to $35M in ARR has very different investment merit depending on whether its unit economics show that each customer becomes profitable in 12 months (sustainable) or 48 months (precarious).</p>`,
  },
  {
    title: 'The Core SaaS / Subscription Metrics',
    content: `<h4>Annual Recurring Revenue (ARR) and Monthly Recurring Revenue (MRR)</h4>

<p>ARR is the annualized value of all active subscription contracts. MRR = ARR / 12. These are the single most important metrics for any subscription business because they represent the predictable, repeating revenue base. Non-recurring revenue (professional services, one-time implementation fees) is tracked separately because it's less predictable and typically lower-margin.</p>

<p><strong>ARR growth rate</strong> is the headline metric for any GE software investment. Growth rates above 40% are considered strong; above 80% is exceptional. But the growth rate alone is insufficient&mdash;you need to understand the <em>composition</em> of growth.</p>

<div class="formula-box">
ARR Growth = New ARR (new logos) + Expansion ARR (upsells to existing customers)<br>
− Churned ARR (lost customers) − Contraction ARR (downgrades)<br><br>
Net New ARR = New + Expansion − Churn − Contraction
</div>

<h4>Net Revenue Retention (NRR) / Net Dollar Retention (NDR)</h4>

<p>NRR measures how much revenue grows or shrinks from the existing customer base, excluding new customer acquisition. It's calculated by taking the ARR from a cohort of customers at the beginning of a period, then measuring their ARR at the end of the period (including upsells and cross-sells, but also accounting for churn and downgrades).</p>

<div class="formula-box">
NRR = (Beginning ARR + Expansion − Churn − Contraction) / Beginning ARR
</div>

<p>An NRR above 100% means the existing customer base is growing even without acquiring a single new customer. This is the hallmark of a best-in-class SaaS business. Benchmarks: NRR above 120% is elite (Datadog, Snowflake at their best), 110&ndash;120% is strong, 100&ndash;110% is healthy, and below 100% indicates the company is leaking revenue from its installed base.</p>

<p>NRR is arguably the most important metric in GE investing because it captures the combined effect of product stickiness, expansion potential, and customer satisfaction in a single number. A company with 130% NRR can cut its S&M spending to zero and still grow revenue at 30% from existing customers alone.</p>

<h4>Customer Acquisition Cost (CAC)</h4>

<p>CAC is the fully loaded cost of acquiring one new customer. The "fully loaded" part is critical: include all sales and marketing expenses (salaries, commissions, marketing spend, tools, events) divided by the number of new customers acquired in the period.</p>

<div class="formula-box">
CAC = Total S&M Expense / # New Customers Acquired
</div>

<p>Be precise about what counts: some companies calculate a "blended" CAC that includes existing customer expansion costs, which dilutes the metric. For GE analysis, separate out <strong>new logo CAC</strong> (cost to acquire a new customer) from <strong>expansion CAC</strong> (cost to upsell an existing customer, which is typically much lower).</p>

<h4>Lifetime Value (LTV)</h4>

<p>LTV estimates the total gross profit a company will earn from a customer over the entire relationship. The simplest formula:</p>

<div class="formula-box">
LTV = Average Revenue per Customer × Gross Margin / Annual Churn Rate
</div>

<p>For example, if the average customer pays $50,000/year, gross margin is 75%, and annual churn is 10%: LTV = $50,000 × 0.75 / 0.10 = $375,000. This means each customer is expected to generate $375,000 in gross profit over the lifetime of the relationship.</p>

<h4>LTV / CAC Ratio</h4>

<p>The golden ratio of SaaS investing. It tells you how much gross profit each customer generates relative to the cost of acquiring them.</p>

<p>Benchmarks: LTV/CAC above 3.0x is considered healthy (you earn $3 for every $1 spent acquiring a customer). Above 5.0x is excellent and suggests the company could afford to invest more aggressively in customer acquisition. Below 1.0x means the company is literally losing money on each customer&mdash;a non-starter for growth equity.</p>

<h4>CAC Payback Period</h4>

<p>How many months does it take for a new customer's gross profit to recoup the cost of acquiring them?</p>

<div class="formula-box">
CAC Payback (months) = CAC / (Monthly Revenue per Customer × Gross Margin)
</div>

<p>A payback period under 18 months is considered healthy for enterprise SaaS. Under 12 months is strong. Above 24 months raises concerns about capital efficiency&mdash;you're waiting two years to break even on each customer, which means you need a lot of capital to fund the growth.</p>

<h4>Gross Margin</h4>

<p>Subscription gross margins for software companies should be 70%+. Below 60% raises questions about whether the product is truly software (as opposed to a services-heavy model disguised as software). Gross margins below 50% suggest a fundamentally different business model that requires different benchmarks.</p>

<p>Watch for companies that exclude hosting costs, customer success costs, or implementation costs from their gross margin calculation. The reported number should include all costs directly associated with delivering the product to customers.</p>

<h4>The Rule of 40</h4>

<p>A widely used heuristic: a healthy software company's revenue growth rate plus its profit margin (typically free cash flow margin or EBITDA margin) should exceed 40%.</p>

<div class="formula-box">
Rule of 40 Score = Revenue Growth % + FCF Margin %
</div>

<p>A company growing 60% with a negative 15% FCF margin scores 45%&mdash;passing the test. A company growing 20% with a 25% FCF margin scores 45%&mdash;also passing. The Rule of 40 captures the trade-off between growth and profitability: a company can sacrifice one as long as the other compensates. Companies consistently above 40% are considered best-in-class; below 20% is concerning.</p>`,
  },
  {
    title: 'Non-SaaS Unit Economics',
    content: `<p>Not all growth equity investments are SaaS. For other business models, the relevant metrics differ:</p>

<p><strong>Marketplaces:</strong> Gross Merchandise Value (GMV), take rate (revenue / GMV), buyer-to-seller ratio, repeat purchase rate, average order value (AOV), contribution margin per order.</p>

<p><strong>Fintech:</strong> Revenue per user, credit losses (if lending), net interest margin, regulatory capital requirements, customer acquisition efficiency, cross-sell rate.</p>

<p><strong>Healthcare tech:</strong> Revenue per provider or per patient, patient engagement rates, reimbursement risk, regulatory approval status, clinical outcome data.</p>

<p><strong>Consumer subscription:</strong> ARPU (average revenue per user), subscriber growth, monthly churn rate, engagement metrics (daily/monthly active users, time spent), conversion rate (free to paid).</p>`,
  },
];
