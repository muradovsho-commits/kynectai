export const RE_VALUATION_SECTIONS = [
  {
    title: 'Net Operating Income (NOI)',
    content: `<p>NOI is the single most important number in real estate finance. It represents the property's income after all operating expenses but before debt service, capital expenditures, and income taxes.</p>

<div class="formula-box">
NOI = Gross Potential Rent<br>
+ Other Income (parking, laundry, fees)<br>
− Vacancy &amp; Credit Loss<br>
= Effective Gross Income (EGI)<br>
− Operating Expenses (property taxes, insurance, maintenance, management, utilities)<br>
= Net Operating Income (NOI)
</div>

<p>NOI explicitly excludes: debt service (interest and principal payments), capital expenditures, depreciation, amortization, and income taxes. This is intentional: NOI captures the property's operating performance independent of how it's financed or who owns it, making it the appropriate basis for valuation.</p>`,
  },
  {
    title: 'The Three Approaches to Value',
    content: `<h4>1. Income Approach (Cap Rate)</h4>

<p>The most widely used method. The property's value equals its NOI divided by the capitalization rate (cap rate):</p>

<div class="formula-box">
Value = NOI / Cap Rate
</div>

<p>The <strong>cap rate</strong> is the expected unlevered return on the property&mdash;the yield an all-cash buyer would earn. It reflects the risk of the property's cash flows: lower cap rates indicate lower risk (and higher prices), while higher cap rates indicate higher risk (and lower prices).</p>

<div class="example-box">
<div class="example-label">Cap Rate Valuation</div>
<p>A fully occupied apartment building generates $2.4M in NOI. Comparable apartment buildings in the market have traded at 5.0% cap rates.</p>
<p>Value = $2.4M / 5.0% = <strong>$48.0M</strong></p>
<p>If cap rates compress to 4.5% (because interest rates fall or investor demand increases): Value = $2.4M / 4.5% = $53.3M. That 50 bps cap rate move increased value by 11%.</p>
<p>If cap rates expand to 5.5%: Value = $2.4M / 5.5% = $43.6M. Value dropped 9%.</p>
</div>

<p>What determines cap rates? The risk-free rate (Treasury yields) + a risk premium for the property type, location, tenant quality, lease duration, and market conditions. Cap rates are driven by both property-level fundamentals and the broader capital markets environment. When interest rates rise, cap rates tend to rise (since investors can earn more in risk-free alternatives), putting downward pressure on property values.</p>

<h4>2. Sales Comparison Approach (Comps)</h4>

<p>Estimate value based on recent sale prices of comparable properties in the same market. You calculate price per square foot, price per unit (for multifamily), or price per key (for hotels) from recent transactions and apply them to the subject property. Adjustments are made for differences in location, condition, age, occupancy, and lease terms.</p>

<p>This approach is most reliable when there are ample recent comparable transactions and least reliable when the subject property is unique or when market conditions have shifted since the comps traded.</p>

<h4>3. Replacement Cost Approach</h4>

<p>Estimate value based on what it would cost to build an equivalent property from scratch today: land value + hard costs (construction) + soft costs (architecture, engineering, permits, legal) + developer profit. This sets a theoretical ceiling on value&mdash;if existing properties trade significantly above replacement cost, developers will build new supply, eventually pushing prices down. If they trade below replacement cost, new construction stops, eventually reducing supply and pushing prices up.</p>`,
  },
  {
    title: 'Key Valuation Metrics',
    content: `<table class="comparison-table">
<tr><th>Metric</th><th>Formula</th><th>What It Tells You</th></tr>
<tr><td>Cap Rate</td><td>NOI / Value</td><td>Unlevered yield; risk-adjusted return</td></tr>
<tr><td>Cash-on-Cash Return</td><td>Annual Pre-Tax Cash Flow / Equity Invested</td><td>Levered annual yield to the equity investor</td></tr>
<tr><td>Equity Multiple</td><td>Total Equity Distributions / Total Equity Invested</td><td>Absolute return multiple (like MOIC in PE)</td></tr>
<tr><td>IRR</td><td>Annualized return solving for NPV = 0</td><td>Time-weighted return incorporating all cash flows</td></tr>
<tr><td>Price / SF (or /unit, /key)</td><td>Purchase Price / Square Feet (or units or keys)</td><td>Quick comp metric for benchmarking</td></tr>
<tr><td>Yield on Cost</td><td>Stabilized NOI / Total Project Cost</td><td>Development return metric; "building to" what cap rate</td></tr>
</table>`,
  },
];
