export const PE_VALUATION_SECTIONS = [
  {
    title: `3.1 Intrinsic vs. Relative Value`,
    content: `<p>There are two ways to value an asset:</p>
<ol>
<li><strong>Intrinsic Value (The DCF):</strong> What is the present value of the actual cash this asset will produce over its lifetime?</li>
<li><strong>Relative Value (Comps/Precedents):</strong> What is the market currently paying for assets that look exactly like this one?</li>
</ol>
<h4>How PE Investors Think</h4>
<p>Investment Bankers love the DCF because you can tweak assumptions to justify almost any valuation.</p>
<p>Private Equity investors are deeply skeptical of DCFs. We rely primarily on <strong>Relative Valuation</strong> to determine what we must pay to win the deal, and the <strong>LBO Model</strong> to determine what we can pay to hit our return hurdles. The DCF is merely a sanity check.</p>`
  },
  {
    title: `3.2 The Discounted Cash Flow (DCF)`,
    content: `<h4>The Time Value of Money</h4>
<p>A dollar today is worth more than a dollar tomorrow because you can invest today's dollar and earn a return. Therefore, future cash flows must be "discounted" back to today's value based on the risk of not getting paid.</p>
<h4>The Mechanics</h4>
<ol>
<li><strong>Project Unlevered Free Cash Flow (UFCF)</strong> for 5 to 10 years.</li>
<li><strong>Calculate the Discount Rate (WACC):</strong> The blended cost of debt and equity. Cost of Equity = Risk-Free Rate + Beta x Equity Risk Premium (CAPM).</li>
<li><strong>Calculate Terminal Value (TV):</strong> Captures value from Year 5 to infinity.
<ul>
<li><strong>Gordon Growth Method:</strong> TV = UFCF(Year 5) x (1 + g) / (WACC - g)</li>
<li><strong>Exit Multiple Method (PE Preferred):</strong> Year 5 EBITDA x assumed exit multiple.</li>
</ul></li>
<li><strong>Discount to Present Value:</strong> Discount both the projected UFCFs and Terminal Value back to Year 0 using WACC.</li>
</ol>`
  },
  {
    title: `3.3 Trading Comps & Precedent Transactions`,
    content: `<h4>Trading Comparables (Public Comps)</h4>
<p>Valuing a target based on trading multiples of similar public companies. We almost exclusively use <strong>EV / EBITDA</strong>.</p>
<p><strong>Why EV/EBITDA?</strong> P/E is skewed by capital structure and tax regimes. EV/EBITDA looks at core operational value independent of financing — critical for PE because we're going to change the capital structure anyway.</p>
<h4>Precedent Transactions (Acquisition Comps)</h4>
<p>What buyers have historically paid to acquire similar companies. Precedents almost always yield <strong>higher valuations</strong> than Trading Comps because the purchase price includes a <strong>Control Premium</strong> (usually 20-30%) and assumed synergies.</p>`
  },
  {
    title: `3.4 Interview Integration: Ranking Methodologies`,
    content: `<p><strong>Question:</strong> "Rank the three valuation methodologies from highest to lowest expected value."</p>
<p><strong>The Perfect Answer:</strong></p>
<p>"Generally, <strong>Precedent Transactions</strong> yield the highest valuation because of the Control Premium and assumed synergies.</p>
<p>The <strong>DCF</strong> is usually next highest, or the most variable, because it depends entirely on management's assumptions and the selected discount rate.</p>
<p><strong>Public Comps</strong> tend to yield the lowest valuation because public prices represent a minority, non-controlling stake."</p>
<p><strong>Follow-up:</strong> "Where does an LBO fit?"</p>
<p><strong>Elite Response:</strong> "The LBO typically sets the 'floor' valuation. Because PE firms target a high IRR (e.g., 20%), they cannot afford to overpay. The LBO dictates the maximum price a sponsor can pay while clearing their hurdle rate, which is often lower than what a strategic buyer would pay."</p>`
  },
];
