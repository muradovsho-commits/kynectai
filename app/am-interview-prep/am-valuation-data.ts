export const AM_VALUATION_SECTIONS = [
  {
    title: 'Intrinsic Valuation: DCF Analysis',
    content: `<p>A DCF estimates a company's value based on the present value of its projected future free cash flows. For a detailed treatment of DCF mechanics (projecting FCF, calculating WACC, estimating Terminal Value), refer to the IB Technical Guide. Here we focus on buy-side-specific considerations:</p>

<h4>Buy-Side DCF Nuances</h4>

<p><strong>Scenario analysis over point estimates:</strong> Sell-side analysts produce a single target price. Buy-side investors think in terms of distributions. What's the value in the base case, bull case, and bear case? What's the probability-weighted expected value? A stock might be worth $40 in the base case but $70 in the bull case and $15 in the bear case. If you assign 50/30/20 probabilities, the expected value is $40(.50) + $70(.30) + $15(.20) = $44. At a current price of $35, the risk/reward is attractive.</p>

<p><strong>Reverse DCF:</strong> Instead of projecting cash flows to derive a value, start with the current stock price and work backward to determine what assumptions the market is implicitly making. If the stock is at $50, what growth rate and margins does the market expect? If those expectations are too low (or too high) based on your research, that's the basis for an investment thesis.</p>

<p><strong>Sensitivity to terminal assumptions:</strong> The Terminal Value often represents 60-80% of total DCF value. This means small changes to the terminal growth rate or exit multiple can swing the output dramatically. A thoughtful buy-side analyst always stress-tests terminal assumptions and avoids anchoring to a single estimate.</p>`,
  },
  {
    title: 'Relative Valuation: Multiples',
    content: `<p>Multiples-based valuation compares a company's pricing ratios to those of comparable companies. The most common multiples and when each is most useful:</p>

<p><strong>P/E (Price / Earnings):</strong> The most widely quoted multiple. Simple and intuitive but distorted by capital structure (leverage), tax rates, and one-time items. Best used for mature, profitable companies with stable capital structures. Forward P/E (using next year's estimated earnings) is more useful than trailing P/E.</p>

<p><strong>EV/EBITDA:</strong> Neutralizes differences in capital structure, tax jurisdiction, and depreciation policy. The workhorse multiple for most sectors. Typical ranges: 6-8x for mature industrials, 10-15x for healthy consumer businesses, 15-25x for high-growth tech.</p>

<p><strong>EV/Revenue:</strong> Useful for unprofitable or early-stage companies where earnings-based multiples are meaningless. Also useful for comparing companies with very different margin profiles (but you should understand <em>why</em> the margins differ).</p>

<p><strong>P/B (Price / Book Value):</strong> Critical for banks, insurance companies, and other financial institutions where the balance sheet drives value. A bank trading below 1.0x book value is either undervalued or the market expects asset write-downs.</p>

<p><strong>PEG Ratio (P/E / Growth Rate):</strong> Adjusts the P/E for growth. A company with a 30x P/E growing at 30% has a PEG of 1.0, which is considered "fairly valued" by this metric. A PEG below 1.0 suggests the stock is cheap relative to its growth. Limitations: assumes a linear relationship between P/E and growth (which isn't true at extremes), and the growth rate used is often a subjective estimate.</p>

<p><strong>FCF Yield (FCF / Market Cap or FCF / EV):</strong> Measures the cash flow return on your investment. A 6% FCF yield means the company generates $6 in cash flow for every $100 of stock value. Higher is better, all else equal. Useful for comparing cash flow generation across companies and against bond yields.</p>

<h4>Relative Valuation Pitfalls</h4>

<p><strong>The "cheap on multiples" trap:</strong> A stock trading at 8x earnings when peers trade at 14x might not be cheap-it might deserve the discount because of slower growth, worse management, higher leverage, or a deteriorating competitive position. Always ask <em>why</em> the multiple is low before calling something undervalued.</p>

<p><strong>Sector vs. historical comparison:</strong> Comparing a tech company's EV/EBITDA to an industrial company's is meaningless. Compare within sectors, and also compare a company's current multiple to its own historical range. If it's historically traded at 12-16x EBITDA and is now at 10x, that could indicate a buying opportunity-or a structural deterioration.</p>`,
  },
  {
    title: 'Sum-of-the-Parts (SOTP) Valuation',
    content: `<p>For diversified companies (conglomerates, holding companies), a SOTP analysis values each business segment separately and adds them up, then subtracts corporate overhead and net debt. This is particularly useful when the market is assigning a "conglomerate discount"-valuing the whole company at less than the sum of its parts.</p>

<p>SOTP can reveal hidden value. A conglomerate with a fast-growing tech division and a slow-growing industrial division might be valued at an "average" multiple, but if you value each division at its appropriate sector multiple, the tech division alone could be worth more than the current stock price-meaning you're getting the industrial division for free.</p>`,
  },
  {
    title: 'Dividend Discount Model (DDM)',
    content: `<p>The DDM values a stock based on the present value of expected future dividends. It's most useful for mature, stable dividend-paying companies (utilities, REITs, large-cap banks, consumer staples):</p>

<div class="formula-box">
Value = D₁ / (r − g)<br>
<small>D₁ = next year's expected dividend, r = required return, g = dividend growth rate</small>
</div>

<p>This is just the Gordon Growth Model applied to dividends instead of free cash flow. Limitations: useless for companies that don't pay dividends, and the result is very sensitive to small changes in the growth rate and required return.</p>`,
  },
  {
    title: 'Asset-Based Valuation (NAV)',
    content: `<p>For companies whose value derives primarily from tangible assets (real estate, natural resources, investment portfolios), <strong>Net Asset Value</strong> is the appropriate methodology. Calculate the fair market value of all assets, subtract all liabilities, and divide by shares outstanding. REITs, closed-end funds, and natural resource companies are commonly valued this way.</p>

<p>A stock trading at a discount to NAV may be attractive (you're buying $1 of assets for $0.80). A stock trading at a premium to NAV may be justified if management creates value above the asset base (through superior operations, development pipeline, or allocation skill).</p>`,
  },
];
