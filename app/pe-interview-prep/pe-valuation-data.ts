export const PE_VALUATION_SECTIONS = [
  {
    title: 'The Three Statements and How They Link',
    content: `<p>Private equity interviews test accounting, because you cannot model an LBO or judge a business without it. You do not need an accountant's depth, but you must be fluent in the three financial statements and, above all, how they connect, since the classic "walk me through the statements" question is really a test of whether you understand the links.</p>

<div class="framework-box"><div class="fw-label">THE THREE STATEMENTS</div><strong>Income statement:</strong> profitability over a period, revenue down to net income (includes non-cash items like depreciation).<br/><strong>Balance sheet:</strong> a snapshot of what the company owns (assets) and owes (liabilities), plus equity, at a point in time. Assets = Liabilities + Equity, always.<br/><strong>Cash flow statement:</strong> the actual cash moving in and out over a period, reconciling net income to the real change in cash, split into operating, investing, and financing activities.</div>

<div class="key-concept">The reason the linkage matters so much in PE is that <strong>cash, not accounting profit, services debt and drives returns.</strong> The statements connect like this: <strong>net income</strong> from the income statement flows to the top of the cash flow statement; you add back non-cash charges (like depreciation) and adjust for working capital to get cash flow; the ending cash balance flows onto the balance sheet; and net income (minus dividends) flows into retained earnings in equity, keeping the balance sheet in balance. So a change in one statement ripples through all three. The classic question, "if depreciation goes up by 10, walk me through the three statements," tests exactly this: income statement profit falls (by 10 pre-tax, less after the tax shield), cash flow actually rises (depreciation is non-cash and the lower tax bill saves cash), and the balance sheet adjusts (lower net assets, lower retained earnings, offset by the cash change). Mastering these links is non-negotiable for PE.</div>

<div class="pro-tip">For "walk me through the three statements," lead with the one-line purpose of each (profitability, position, cash), then emphasize the connections: net income links the income statement to both cash flow and equity; ending cash links cash flow to the balance sheet. Interviewers care far more about the linkages than the definitions, because the links are what you actually use when modeling.</div>`,
  },
  {
    title: 'Enterprise Value, Equity Value, and Multiples',
    content: `<p>Before valuation methods, you need the two ways to measure a company's size and the multiples built on them. PE interviewers test this constantly because the LBO lives in enterprise-value terms.</p>

<div class="key-concept"><strong>Enterprise value (EV) is the value of the whole business; equity value is the value of just the shareholders' stake.</strong> Enterprise value represents the entire operating business regardless of how it is financed, it is what it would cost to buy the company's operations outright. Equity value is what is left for shareholders after the debt is accounted for. The bridge between them: <strong>Enterprise Value = Equity Value + Net Debt</strong> (debt minus cash). The intuition: if you buy a company, you pay the equity holders <em>and</em> take on its debt (but you get its cash), so the true cost of the whole business is equity plus net debt. This matters enormously in PE because an LBO is fundamentally about buying the enterprise and changing how it is financed, so you must think in enterprise-value terms.</div>

<div class="formula-box">Enterprise Value = Equity Value + Total Debt - Cash<br/><br/>Most common PE multiple:<br/>EV / EBITDA = Enterprise Value / Earnings Before Interest, Taxes, D&amp;A</div>

<div class="key-concept">PE lives on the <strong>EV/EBITDA multiple</strong>, and you should understand why. EBITDA (earnings before interest, taxes, depreciation, and amortization) is a rough proxy for a company's operating cash generation before financing and accounting choices. Because it strips out interest (a financing choice) and taxes and non-cash charges, EBITDA lets you compare the underlying earnings power of companies regardless of their capital structure, which is exactly what a buyer who is about to <em>change</em> the capital structure cares about. So EV/EBITDA pairs the whole-business value (EV) with whole-business earnings (EBITDA), making it the natural language of buyouts. Deals are quoted in "turns" of EBITDA (for example, "we bought it at 8x EBITDA"), and the entire LBO return often hinges on the EBITDA multiple paid versus the multiple achieved at exit.</div>`,
  },
  {
    title: 'The Three Valuation Approaches',
    content: `<p>To judge whether a price is reasonable, PE (like all of finance) uses three core valuation methods. You should know what each is, what it tells you, and its limitations.</p>

<table class="comparison-table">
<tr><th>Method</th><th>What it does</th><th>Tends to give</th></tr>
<tr><td>Comparable companies ("comps")</td><td>Values a company using the trading multiples of similar public companies</td><td>A market-based, current snapshot</td></tr>
<tr><td>Precedent transactions</td><td>Values it using multiples paid in past acquisitions of similar companies</td><td>Higher values (includes control premiums)</td></tr>
<tr><td>Discounted cash flow (DCF)</td><td>Values it as the present value of its projected future cash flows</td><td>An intrinsic, assumption-driven value</td></tr>
</table>

<div class="key-concept">The three methods answer the same question from different angles. <strong>Comparable companies</strong> asks "what are similar businesses worth in the market right now?", quick and market-grounded, but dependent on finding true comparables and on current market sentiment. <strong>Precedent transactions</strong> asks "what have buyers actually paid for similar companies?", useful because it reflects real acquisition prices, but it usually runs higher because acquirers pay a control premium, and past deals may not reflect today's conditions. <strong>DCF</strong> asks "what are the company's own future cash flows worth today?", the most fundamental and independent of market mood, but highly sensitive to assumptions (growth, margins, the discount rate), so small input changes swing the answer a lot. Good analysts triangulate across all three rather than trusting any one.</div>

<div class="key-concept">In PE specifically, valuation feeds directly into the LBO. The firm asks: at what multiple can we buy this, what can we do to grow its EBITDA, what multiple might we sell at, and given the debt we will use, what return does that produce? So while comps, precedents, and DCF establish a reasonable value range, the PE-specific question is the <strong>LBO analysis</strong>, which works backward from a required return to determine what price the firm can pay. In other words, PE uses the standard valuation methods to sanity-check value, but the deciding tool is the LBO model, which is the subject of the next modules.</div>

<div class="takeaway-box">Know the three methods cold: comps (market multiples of similar public companies, current but sentiment-driven), precedent transactions (multiples paid in past deals, includes a control premium so it runs high), and DCF (present value of future cash flows, fundamental but assumption-sensitive). Then remember the PE twist: these set a value range, but the LBO model is what actually decides the price, because it ties price to the firm's required return.</div>`,
  },
];
