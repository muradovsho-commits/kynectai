export const AM_FINANCIAL_ANALYSIS_SECTIONS = [
  {
    title: 'Revenue Quality',
    content: `<p>Not all revenue is created equal. A dollar of recurring subscription revenue is worth more than a dollar of one-time project revenue because it's more predictable, requires less sales effort to maintain, and compounds over time. Assess revenue quality along several dimensions:</p>

<p><strong>Recurring vs. non-recurring:</strong> What percentage of revenue recurs automatically (subscriptions, long-term contracts, maintenance agreements) vs. requires active reselling each period?</p>

<p><strong>Organic vs. acquired:</strong> If a company reports 15% revenue growth but acquired a company that contributed 12% of the growth, the organic growth rate is only 3%. Strip out acquisitions to see the underlying trajectory.</p>

<p><strong>Customer concentration:</strong> If one customer represents 25% of revenue, the company is exposed to significant risk if that customer leaves, renegotiates, or faces its own financial difficulties.</p>

<p><strong>Channel stuffing and pull-forward:</strong> Aggressive companies may ship product to distributors at quarter-end (channel stuffing) or offer deep discounts to pull demand forward from future quarters. Both inflate current revenue at the expense of future periods. Red flags: spiking AR/Revenue ratios, unusually strong Q4 results followed by weak Q1s, and inventory builds at distributors.</p>`,
  },
  {
    title: 'Earnings Quality',
    content: `<p>The gap between reported earnings and economic reality can be enormous. Key areas to scrutinize:</p>

<p><strong>Non-cash charges and adjustments:</strong> Companies increasingly report "adjusted" earnings that exclude stock-based compensation, amortization of intangibles, restructuring charges, and other items. Some of these adjustments are legitimate (truly one-time charges), but others are recurring costs disguised as one-time items. If a company takes a "restructuring charge" every year for five consecutive years, it's not one-time&mdash;it's a cost of doing business.</p>

<p><strong>SBC (Stock-Based Compensation):</strong> Many tech companies exclude SBC from "adjusted" earnings, but SBC is a real economic cost&mdash;it dilutes existing shareholders. A company reporting $2 in "adjusted EPS" but $1.20 in GAAP EPS (because of $0.80 in SBC) is not as profitable as the adjusted number suggests.</p>

<p><strong>Depreciation vs. CapEx:</strong> If Depreciation consistently falls well below CapEx, the company may be under-depreciating its assets (inflating reported earnings). Conversely, if D&A exceeds CapEx for extended periods, either the company is underinvesting or its assets are declining in value.</p>

<p><strong>Working capital manipulation:</strong> Extending payment terms to suppliers (inflating AP) or factoring receivables (selling AR to a third party) can boost operating cash flow without genuine improvement in the business. Check the footnotes for changes in accounting estimates, factoring programs, and related-party transactions.</p>`,
  },
  {
    title: 'Cash Flow Analysis',
    content: `<p>Cash flow is harder to manipulate than earnings, which is why experienced investors pay more attention to the Cash Flow Statement than the Income Statement. Key items to analyze:</p>

<p><strong>FCF conversion:</strong> Free Cash Flow / Net Income. A company that consistently converts 90%+ of its earnings into free cash flow has high-quality earnings. A company converting only 50% may have aggressive accounting, heavy CapEx requirements, or working capital problems.</p>

<p><strong>Operating Cash Flow vs. EBITDA:</strong> EBITDA is a rough proxy for cash flow, but the real number is Operating Cash Flow (from the Cash Flow Statement). If OCF persistently trails EBITDA, investigate why: it could be working capital consumption, cash taxes exceeding book taxes, or items classified differently between the two measures.</p>

<p><strong>CapEx intensity:</strong> CapEx / Revenue tells you how capital-intensive the business is. A software company at 5% CapEx/Revenue is far less capital-intensive than a telecommunications company at 20%. Lower capital intensity means more of each revenue dollar flows to shareholders.</p>

<div class="key-concept">
<strong>The Accrual Anomaly:</strong> Academic research has consistently shown that companies with high accruals (large gaps between reported earnings and cash flow) tend to underperform, while companies with low accruals (earnings closely tracked by cash flow) tend to outperform. This is because high accruals often indicate aggressive accounting that eventually reverses. Many quantitative strategies include an "accrual quality" factor.
</div>`,
  },
  {
    title: 'Balance Sheet Red Flags',
    content: `<p><strong>Rising goodwill as a percentage of total assets:</strong> Indicates the company has made significant acquisitions at premium prices. If those acquisitions underperform, goodwill impairments will follow&mdash;destroying shareholder value retroactively.</p>

<p><strong>Off-balance-sheet obligations:</strong> Operating leases (though now capitalized under current accounting standards), unconsolidated joint ventures, special purpose entities, and contingent liabilities. Read the footnotes carefully; the balance sheet face doesn't tell the full story.</p>

<p><strong>Rising Debt without corresponding asset growth:</strong> If Debt is increasing but assets aren't growing (or are declining), the company may be borrowing to fund operating losses, dividends, or share buybacks&mdash;all unsustainable in the long run.</p>

<p><strong>Pension underfunding:</strong> A large unfunded pension obligation is a real liability that reduces the company's intrinsic value. Check the footnotes for assumptions about discount rate and expected return on plan assets&mdash;overly optimistic assumptions mask the true size of the obligation.</p>`,
  },
];
