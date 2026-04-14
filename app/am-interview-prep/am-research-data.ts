export const AM_RESEARCH_SECTIONS = [
  {
    title: 'The Research Process',
    content: `<p>Fundamental equity research is the process of developing an informed, evidence-based view on whether a company's stock is undervalued, overvalued, or fairly priced. The output is an investment thesis-a clear, falsifiable argument for why the stock will outperform or underperform the market over a defined time horizon.</p>

<h4>Step 1: Industry and Business Understanding</h4>

<p>Before touching a financial model, understand the business at a deep level. What does the company actually do? How does it make money? What are the key value drivers? Who are its customers, and why do they choose this company over alternatives? What are the barriers to entry (network effects, switching costs, regulatory moats, scale advantages, brand loyalty)?</p>

<p>Industry structure matters enormously. A company in a consolidated, rational oligopoly (three players with 80% share, stable pricing) is fundamentally different from a company in a fragmented, commoditized market (hundreds of players, price competition, low margins). Porter's Five Forces provides a useful mental model here: assess the threat of new entrants, bargaining power of suppliers and buyers, threat of substitutes, and intensity of rivalry.</p>

<h4>Step 2: Financial Analysis</h4>

<p>Analyze the company's historical financial performance across multiple dimensions: revenue growth (by segment, geography, organic vs. acquired), margin trends (gross, operating, net), return on capital (ROIC, ROE, ROA), cash flow generation (FCF conversion, capital intensity), and balance sheet strength (leverage, liquidity, debt maturity profile).</p>

<p>The goal is to identify patterns, inflection points, and anomalies. Is revenue growth accelerating or decelerating? Are margins expanding because of operating leverage, or contracting because of competitive pressure? Is the company generating enough cash to fund growth, or is it relying on external financing? Is the balance sheet strong enough to withstand a downturn?</p>

<h4>Step 3: Financial Modeling and Projections</h4>

<p>Build a detailed financial model projecting the company's Income Statement, Balance Sheet, and Cash Flow Statement for the next 3-5 years. The model should be driver-based: revenue projections should be built from unit economics (volume × price, or subscribers × ARPU, or stores × revenue per store), not just growth rate assumptions.</p>

<p>Key modeling decisions: How fast can revenue grow? Will margins expand or contract? How much capital expenditure is needed? What's the working capital intensity? How will the company deploy excess cash (reinvestment, M&A, buybacks, dividends)?</p>

<h4>Step 4: Valuation</h4>

<p>Using the projections from your model, estimate the company's intrinsic value. Is the current stock price above or below this intrinsic value? By how much? What's the margin of safety? (See Module 3 for detailed valuation methods.)</p>

<h4>Step 5: Develop the Investment Thesis</h4>

<p>Synthesize your analysis into a clear, concise thesis. A strong thesis has: a clear view on the stock (buy, sell, or hold), a specific catalyst or set of catalysts that will cause the market to re-rate the stock, an explicit time horizon, identified risks and why you believe the risk/reward is asymmetric, and a target price with clear methodology.</p>`,
  },
  {
    title: 'Primary Research',
    content: `<p>The best fundamental investors go beyond public filings and sell-side research. <strong>Primary research</strong> involves gathering information directly from industry participants:</p>

<p><strong>Expert network calls:</strong> Conversations with former employees, industry executives, customers, suppliers, and competitors. These provide insights unavailable in public documents-competitive dynamics, management quality, product perception, pricing trends.</p>

<p><strong>Channel checks:</strong> Monitoring real-time business trends. For a retailer, this might mean visiting stores, tracking foot traffic, and monitoring promotional activity. For a software company, it might mean surveying IT buyers about their purchasing intentions.</p>

<p><strong>Management meetings:</strong> Attending investor days, conference calls, and one-on-one meetings with company management. Experienced analysts develop a sense for management credibility and body language that's impossible to get from a transcript.</p>

<p><strong>Industry conferences and trade shows:</strong> Observing product demonstrations, competitor positioning, and market sentiment firsthand.</p>

<div class="warning-box">
<strong>A note on insider trading:</strong> Primary research is legal and essential, but it must never cross the line into trading on material non-public information (MNPI). If a former executive tells you the company is about to miss earnings by 30% because of a product recall that hasn't been announced, that's MNPI, and trading on it is a federal crime. Compliance training is rigorous at every buy-side firm. When in doubt, don't trade.
</div>`,
  },
  {
    title: 'Sector-Specific Analysis Frameworks',
    content: `<p>Different sectors require different analytical approaches because their value drivers differ fundamentally:</p>

<table class="comparison-table">
<tr><th>Sector</th><th>Key Metrics</th><th>What Drives Value</th></tr>
<tr><td>Technology / SaaS</td><td>ARR, NRR, CAC, LTV/CAC, Rule of 40 (growth + margin)</td><td>Recurring revenue quality, retention, unit economics, TAM expansion</td></tr>
<tr><td>Consumer / Retail</td><td>Same-store sales, traffic, ticket size, inventory turns, gross margin</td><td>Brand strength, pricing power, store economics, e-commerce penetration</td></tr>
<tr><td>Banks / Financials</td><td>NIM, ROE, efficiency ratio, NPL ratio, CET1 ratio, book value</td><td>Interest rate environment, credit quality, capital return</td></tr>
<tr><td>Healthcare / Pharma</td><td>Pipeline value, patent cliffs, approval probabilities, peak sales estimates</td><td>Drug pipeline, regulatory outcomes, pricing/reimbursement</td></tr>
<tr><td>Industrials</td><td>Backlog, book-to-bill ratio, capacity utilization, margins through cycle</td><td>Cycle positioning, aftermarket revenue, pricing discipline, end-market exposure</td></tr>
<tr><td>Real Estate / REITs</td><td>FFO, AFFO, NAV, cap rates, occupancy, same-property NOI growth</td><td>Occupancy trends, rent growth, development pipeline, interest rate sensitivity</td></tr>
<tr><td>Energy</td><td>Reserve life, finding costs, cash breakeven, production growth</td><td>Commodity prices, reserve quality, capital discipline, ESG considerations</td></tr>
</table>`,
  },
];
