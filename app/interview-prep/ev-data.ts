export const EV_SECTIONS = [
  {
    title: 'Two Ways to Measure Value',
    content: `<p>A company doesn't have a single "value"-the number depends on whose perspective you're taking. A homeowner and a bank looking at the same house see different numbers. The homeowner cares about <em>equity</em>-the home's market value minus the mortgage balance. The bank cares about the <em>total property value</em>-because the whole property secures the loan, not just the owner's equity in it.</p>

<p>It's the same with companies:</p>

<div class="key-concept">
<strong>Equity Value</strong> is the value of the company to its common shareholders-what they'd receive if the company were liquidated after all other claims were settled. It's the "homeowner's equity" of corporate finance.<br><br>
<strong>Enterprise Value (EV)</strong> is the value of the company's entire operating business to all investors-equity holders, debt holders, and any other capital providers. It's the "total property value" that underlies all those claims.
</div>

<p>The simplest version of Equity Value: <strong>Share Price × Total Diluted Shares Outstanding</strong>. This is also called Market Capitalization when referring to the current market price.</p>

<p>Enterprise Value is derived from Equity Value via a "bridge":</p>

<div class="formula-box">
Enterprise Value = Equity Value + Total Debt + Preferred Stock + Noncontrolling Interests − Cash &amp; Equivalents
</div>

<p>Why add Debt? Because EV represents the total cost of acquiring the company's operations, and an acquirer would either assume the existing Debt or have to repay it. Why subtract Cash? Because Cash isn't an operating asset-it can be used to offset the purchase cost. Noncontrolling Interests are added because the company consolidates 100% of a subsidiary's operations but doesn't own 100%-the outside owners' claim must be reflected.</p>

<h4>Market Value vs. Intrinsic Value</h4>

<p>Both Equity Value and Enterprise Value can be expressed as either <strong>current market values</strong> (based on today's stock price) or <strong>implied/intrinsic values</strong> (based on your analysis-e.g., a DCF output). Discrepancies between the two are what create investment opportunities: you buy when intrinsic value exceeds market value, and sell (or short) when the opposite is true.</p>`,
  },
  {
    title: 'How Events Change Equity Value and Enterprise Value',
    content: `<p>Understanding how corporate actions affect these two measures is one of the most commonly tested interview topics. The overarching principle: <strong>shuffling money between funding sources doesn't change Enterprise Value</strong>, because those actions don't alter the operating business. Only actions that affect the actual value of the operating business change EV.</p>

<table class="comparison-table">
<tr>
  <th>Event</th>
  <th>Equity Value</th>
  <th>Enterprise Value</th>
</tr>
<tr>
  <td>Company borrows $100M (issues Debt)</td>
  <td>Unchanged (Cash +$100M offsets Debt +$100M)</td>
  <td>Unchanged (Debt up, Cash up-cancel out in bridge)</td>
</tr>
<tr>
  <td>Company sells $100M in new shares</td>
  <td>Increases by $100M (more shares, more Cash)</td>
  <td>Unchanged (Equity up, Cash up-cancel out)</td>
</tr>
<tr>
  <td>Company repays $100M of Debt with Cash</td>
  <td>Unchanged (Cash −$100M, Debt −$100M)</td>
  <td>Unchanged (both cancel)</td>
</tr>
<tr>
  <td>Company pays $50M in Dividends</td>
  <td>Decreases by $50M (Cash leaves the company)</td>
  <td>Unchanged (Cash ↓, Equity ↓ by equal amounts)</td>
</tr>
<tr>
  <td>Operations generate $50M in FCF</td>
  <td>Increases (company is worth more due to cash generation)</td>
  <td>Increases (core operations produced value)</td>
</tr>
<tr>
  <td>Company buys back $30M of stock</td>
  <td>Decreases by $30M (Cash exits)</td>
  <td>Unchanged (Cash ↓, Equity ↓ by same amount)</td>
</tr>
</table>`,
  },
  {
    title: 'Diluted Shares and the Treasury Stock Method',
    content: `<p>When calculating Equity Value, you need the <strong>diluted share count</strong>, which accounts for shares that could be created from exercising stock options, vesting RSUs, and converting convertible securities.</p>

<p>For stock options, the <strong>Treasury Stock Method (TSM)</strong> works like this: assume all in-the-money options (where the exercise price is below the current stock price) are exercised. The company receives the exercise proceeds and uses them to buy back shares at the current market price. The difference between shares created by exercise and shares bought back is the net dilutive impact.</p>

<p>For example, if there are 5 million options with a $20 exercise price and the stock is at $50: employees exercise and create 5M new shares, paying the company $100M (5M × $20). The company uses that $100M to buy back 2M shares ($100M / $50). Net dilution: 3M shares.</p>`,
  },
  {
    title: 'Valuation Multiples',
    content: `<p>A <strong>valuation multiple</strong> expresses a company's value as a ratio of its value to a financial metric. Multiples are powerful because they compress a complex valuation into a single comparable number, enabling quick comparisons across companies of different sizes.</p>

<h4>The Cardinal Rule: Consistency</h4>

<p>The numerator and denominator of a multiple must be consistent. If the numerator represents value to <em>all</em> investors (Enterprise Value), the denominator must be a metric available to <em>all</em> investors-something pre-interest, like Revenue, EBITDA, or EBIT. If the numerator represents value to <em>equity holders only</em> (Equity Value), the denominator must be a metric after interest, like Net Income or Book Value of Equity.</p>

<table class="comparison-table">
<tr>
  <th>Multiple</th>
  <th>Numerator</th>
  <th>Denominator</th>
  <th>Best Used When</th>
</tr>
<tr>
  <td>EV / Revenue</td>
  <td>Enterprise Value</td>
  <td>Revenue</td>
  <td>Company is unprofitable or pre-profit (early-stage tech, biotech)</td>
</tr>
<tr>
  <td>EV / EBITDA</td>
  <td>Enterprise Value</td>
  <td>EBITDA</td>
  <td>Most common; neutralizes capital structure and accounting differences</td>
</tr>
<tr>
  <td>EV / EBIT</td>
  <td>Enterprise Value</td>
  <td>EBIT</td>
  <td>Capital-intensive industries where D&amp;A is a meaningful real cost</td>
</tr>
<tr>
  <td>P / E (Price/Earnings)</td>
  <td>Equity Value</td>
  <td>Net Income (per share: EPS)</td>
  <td>Simple equity-focused comparison; widely quoted in media</td>
</tr>
<tr>
  <td>Price / Book Value</td>
  <td>Equity Value</td>
  <td>Book Value of Equity</td>
  <td>Banks and insurance companies (asset-heavy, regulated)</td>
</tr>
</table>

<div class="warning-box">
<strong>Never do this:</strong> EV / Net Income (inconsistent-EV is all-investor, Net Income is equity-only) or Price / EBITDA (inconsistent-Price is equity-only, EBITDA is all-investor). These produce meaningless numbers that change with capital structure.
</div>

<h4>Using Multiples in Practice</h4>

<p>The process: select a group of comparable companies (similar industry, size, growth, margins, geography), calculate their multiples, identify the range (25th percentile to 75th percentile), and apply that range to your company's metrics. Higher-growth, higher-margin, lower-risk companies trade at premium multiples. The art is in selecting good comps and adjusting for differences.</p>`,
  },
  {
    title: 'EV &amp; Multiples: Interview Questions',
    content: `<div class="interview-q">
<div class="q-label">Question 1</div>
<div class="question">Explain the difference between Equity Value and Enterprise Value.</div>
<div class="answer">Equity Value is the value of the company to common shareholders only-think of it as the "residual" after all other claims are paid. Enterprise Value is the value of the company's core business to all investors, including debt holders, preferred stockholders, and noncontrolling interests. You bridge from Equity Value to Enterprise Value by adding Debt, Preferred Stock, and Noncontrolling Interests, then subtracting Cash.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 2</div>
<div class="question">A company has a Market Cap of $800M, $300M in Debt, $75M in Cash, and no Preferred Stock or NCI. What is its Enterprise Value?</div>
<div class="answer">EV = $800M + $300M − $75M = $1,025M. The $1,025M represents the total cost of acquiring the company's operations: you'd pay $800M for the equity, assume $300M in Debt, and use the $75M in Cash to offset the cost.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 3</div>
<div class="question">A company issues $150M in new Debt. What happens to Equity Value and Enterprise Value?</div>
<div class="answer">Both are unchanged. Cash increases by $150M and Debt increases by $150M. For Equity Value, the extra Cash offsets the extra Debt-the net effect on shareholders is zero. For Enterprise Value, you add $150M of Debt but subtract $150M of Cash in the bridge, so EV is the same. No operating value has been created or destroyed.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 4</div>
<div class="question">Why is EV / EBITDA generally preferred over P/E for comparing companies?</div>
<div class="answer">EV / EBITDA neutralizes differences in capital structure (because EV includes all investors and EBITDA is pre-interest), tax jurisdictions (EBITDA is pre-tax), and depreciation policies (EBITDA excludes D&A). P/E is distorted by all three factors. Two identical companies with different amounts of Debt would have different P/E ratios but similar EV / EBITDA ratios, making EV / EBITDA a cleaner comparison.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 5</div>
<div class="question">Why do we add Noncontrolling Interests (NCI) when calculating Enterprise Value?</div>
<div class="answer">When a parent company consolidates a subsidiary it doesn't fully own (say, it owns 70%), it includes 100% of that subsidiary's Revenue, EBITDA, and other financials in its Income Statement. To make the value (numerator) consistent with the financial metrics (denominator), you must include the value attributable to the 30% outside ownership. If you didn't add NCI, you'd be dividing a value that excludes some owners by financial metrics that include 100% of operations.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 6</div>
<div class="question">Company A and Company B are identical in every way except Company A has $500M of Debt and Company B has zero Debt. Which has a higher P/E multiple?</div>
<div class="answer">Company B (the debt-free company) likely has a higher P/E. Company A pays Interest Expense, which reduces its Net Income (the "E" in P/E). If both companies have the same Enterprise Value, Company A's Equity Value is lower (because of the Debt), and its earnings are also lower (because of interest). The net effect usually inflates the denominator more than it deflates the numerator, resulting in a lower P/E for the levered company. This capital structure sensitivity is exactly why EV / EBITDA is more reliable for comparison.</div>
</div>`,
  },
];
