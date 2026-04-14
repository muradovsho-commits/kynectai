export const DCF_SECTIONS = [
  {
    title: 'Two Schools of Valuation',
    content: `<p><strong>Intrinsic valuation (DCF analysis)</strong> estimates value from the inside out: project a company's cash flows, discount them at the appropriate rate, and add them up. The result reflects what you believe the company is fundamentally worth, independent of market sentiment.</p>

<p><strong>Relative valuation (multiples-based)</strong> estimates value from the outside in: observe how similar companies are priced by the market, and apply those pricing ratios to your company. It's faster and anchored to observable data, but it assumes the market is pricing comparable companies correctly.</p>

<p>In practice, professionals use both methods and look for convergence. If a DCF suggests $50/share and comps suggest $45-$55/share, you have reasonable confidence. If the DCF says $50 and comps say $20, something is off and needs investigation.</p>`,
  },
  {
    title: 'Building a DCF: Step by Step',
    content: `<h4>Step 1: Project Unlevered Free Cash Flow</h4>

<p>The core of a DCF is a set of projected Unlevered Free Cash Flows (UFCFs) for each year of an explicit forecast period, typically 5-10 years. The process:</p>

<p><strong>Revenue projection:</strong> Start with the company's historical growth and segment-level drivers. For a restaurant chain: number of locations × average revenue per location. For a SaaS company: paying customers × average annual contract value. Research industry forecasts, management guidance, and competitive dynamics to inform growth assumptions.</p>

<p><strong>Operating expenses:</strong> Project COGS and OpEx as percentages of revenue (margins), adjusted for expected trends. Are margins expanding because of economies of scale? Contracting because of rising input costs? Staying stable?</p>

<p><strong>Taxes:</strong> Apply the tax rate to Operating Income (EBIT) to get NOPAT (Net Operating Profit After Tax). This is a "theoretical" tax because UFCF ignores interest expense-you're calculating the tax burden as if the company had no Debt.</p>

<p><strong>Add back D&amp;A:</strong> Since Depreciation and Amortization are non-cash charges already subtracted in EBIT, add them back.</p>

<p><strong>Subtract CapEx:</strong> Cash spent on long-term assets.</p>

<p><strong>Subtract increases in Working Capital (or add decreases):</strong> Rising AR and Inventory tie up cash; rising AP and Deferred Revenue free up cash.</p>

<div class="formula-box">
UFCF = NOPAT + D&amp;A ± Non-Cash Adjustments − ΔWorking Capital − CapEx<br>
<small>NOPAT = EBIT × (1 − Tax Rate)</small>
</div>

<h4>Step 2: Calculate WACC</h4>

<p>WACC is the Discount Rate used for Unlevered FCF. The components:</p>

<p><strong>Cost of Equity</strong> is typically estimated using the Capital Asset Pricing Model (CAPM): Cost of Equity = Risk-Free Rate + Beta × Equity Risk Premium. The Risk-Free Rate comes from long-term government bond yields. Beta measures the company's stock price sensitivity to overall market movements; it's typically estimated by unlevering comparable company betas and re-levering at the target company's capital structure. The Equity Risk Premium is the expected stock market return above the Risk-Free Rate, typically estimated at 5-7% for developed markets.</p>

<p><strong>Cost of Debt</strong> is the interest rate the company pays, adjusted for tax deductibility: After-Tax Cost of Debt = Interest Rate × (1 − Tax Rate). You can estimate the pre-tax rate from the company's actual interest rates, credit rating-based benchmarks, or comparable companies' borrowing costs.</p>

<p>Use the company's <strong>target capital structure</strong> (what it aims to maintain over the long term) for the Equity and Debt weights, not necessarily the current structure if it's temporarily skewed.</p>

<h4>Step 3: Calculate Terminal Value</h4>

<p>Since you can't project cash flows forever, the <strong>Terminal Value</strong> captures the company's value beyond the explicit forecast period. It typically accounts for 50-80% of total DCF value, making it the single most influential assumption.</p>

<p>Two methods:</p>

<p><strong>Perpetuity Growth Method (Gordon Growth):</strong> Terminal Value = Final Year FCF × (1 + g) / (WACC − g), where g is the long-term growth rate. This rate should not exceed long-term GDP growth (roughly 2-3% for developed economies) because no company can outgrow the entire economy indefinitely.</p>

<p><strong>Exit Multiple Method:</strong> Terminal Value = Final Year EBITDA × Exit Multiple. The exit multiple is benchmarked against comparable companies' current trading multiples. This method is more common in practice because it's easier to defend with observable market data, but it's somewhat circular (you're using market-based inputs in an intrinsic analysis).</p>

<p>Best practice: calculate Terminal Value both ways and ensure they produce reasonably consistent results. If they diverge wildly, revisit your assumptions.</p>

<h4>Step 4: Discount and Sum</h4>

<p>Discount each year's UFCF and the Terminal Value back to today using WACC. The formula for each period: PV = Cash Flow / (1 + WACC)^n. Sum the PVs of all projected FCFs and the PV of the Terminal Value to get <strong>Implied Enterprise Value</strong>.</p>

<h4>Step 5: Bridge to Equity Value</h4>

<p>To get Implied Equity Value: subtract Debt, subtract Preferred Stock, subtract Noncontrolling Interests, add Cash, and add any other non-operating assets (like equity investments in other companies). Divide by diluted shares outstanding to get <strong>Implied Share Price</strong>.</p>`,
  },
  {
    title: 'What Drives the DCF Output?',
    content: `<p>The Discount Rate and Terminal Value are the biggest levers. A 1% change in WACC can swing the output by 15-25% because it affects every period including the enormous Terminal Value. Revenue growth and margins also matter, but a 1% change in revenue growth has a smaller impact than a 1% change in WACC.</p>

<table class="comparison-table">
<tr><th>Factor</th><th>Higher →</th><th>Lower →</th></tr>
<tr><td>Risk-Free Rate</td><td>Higher WACC → Lower Value</td><td>Lower WACC → Higher Value</td></tr>
<tr><td>Beta</td><td>Higher Cost of Equity → Lower Value</td><td>Lower Cost of Equity → Higher Value</td></tr>
<tr><td>Revenue Growth</td><td>Higher FCF → Higher Value</td><td>Lower FCF → Lower Value</td></tr>
<tr><td>Operating Margins</td><td>Higher FCF → Higher Value</td><td>Lower FCF → Lower Value</td></tr>
<tr><td>CapEx</td><td>Lower FCF → Lower Value</td><td>Higher FCF → Higher Value</td></tr>
<tr><td>Terminal Growth Rate</td><td>Higher Terminal Value → Higher Value</td><td>Lower Terminal Value → Lower Value</td></tr>
<tr><td>Company Leverage</td><td>WACC initially decreases (good), then increases past optimal</td><td>Depends on starting point</td></tr>
</table>`,
  },
  {
    title: 'Comparable Companies Analysis (Public Comps)',
    content: `<p>Select 5-15 public companies with similar characteristics (industry, size, growth, profitability, geography). For each, calculate key multiples using both trailing (historical) and forward (projected) financials. Identify the range (typically 25th-75th percentile) and apply it to your company's metrics.</p>

<p>Critical judgment: no two companies are identical. A comp trading at 12x EBITDA might deserve that premium because of higher growth. Another at 7x might be cheap because of a legal overhang. Good analysis adjusts for these differences rather than blindly averaging.</p>`,
  },
  {
    title: 'Precedent Transactions',
    content: `<p>Instead of looking at how comparable companies currently trade, you examine what prices were paid in past M&amp;A transactions involving similar companies. These multiples are typically higher than Public Comps multiples because buyers pay a <strong>control premium</strong> (typically 20-40% above the pre-announcement stock price) to gain operational control and access to synergies.</p>

<p>Focus on transactions from the last 3-5 years to ensure market conditions are relevant. Adjust for outliers (distressed sales, bidding wars) that may distort the range.</p>`,
  },
  {
    title: 'Putting It All Together: The "Football Field"',
    content: `<p>A full valuation presents results from multiple methodologies on a single chart (often called a "football field" because of the horizontal bar shape). Typical components: 52-Week Trading Range, Public Comps (multiple ranges), Precedent Transactions (multiple ranges), DCF Analysis (sensitivity ranges), and sometimes an LBO Analysis (floor valuation). You're looking for <strong>convergence</strong>-a zone where most methods overlap-which gives you the strongest signal about fair value.</p>`,
  },
  {
    title: 'DCF &amp; Valuation: Interview Questions',
    content: `<div class="interview-q">
<div class="q-label">Question 1</div>
<div class="question">Walk me through a DCF.</div>
<div class="answer">You project the company's Unlevered Free Cash Flow for 5-10 years based on revenue, margin, working capital, and CapEx assumptions. Then you estimate Terminal Value for the period beyond the projection, using either a perpetuity growth formula or an exit multiple. You discount all FCFs and the Terminal Value back to today using WACC. The sum is Implied Enterprise Value. Finally, subtract Debt, add Cash, and adjust for other items to get Implied Equity Value, and divide by diluted shares for an Implied Share Price.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 2</div>
<div class="question">What Terminal Growth Rate would you use, and why?</div>
<div class="answer">Typically 1.5%-3.0% for a developed-market company. The terminal growth rate should not exceed long-term nominal GDP growth because a company can't grow faster than the overall economy in perpetuity-eventually it would become larger than the entire GDP, which is impossible. A rate around 2%-2.5% (roughly matching long-term inflation plus modest real growth) is a defensible baseline for a mature business.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 3</div>
<div class="question">Which has a bigger impact on the DCF: a 1% increase in revenue growth or a 1% increase in WACC?</div>
<div class="answer">A 1% increase in WACC almost always has a larger impact. WACC affects the discount factor applied to every single period, including the Terminal Value (which is typically 50-80% of total value). A 1% change in revenue growth affects each year's FCF, but that effect is diluted through discounting and has a much smaller proportional impact on the Terminal Value. In sensitivity tables, you'll see that the value swings from WACC changes are typically 2-3 times larger than those from comparable changes in growth.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 4</div>
<div class="question">How do you calculate WACC?</div>
<div class="answer">WACC = (% Equity × Cost of Equity) + (% Debt × After-Tax Cost of Debt). Cost of Equity is typically estimated using CAPM: Risk-Free Rate + Beta × Equity Risk Premium. Beta is derived by unlevering comparable company betas and re-levering at the target capital structure. After-Tax Cost of Debt = Pre-Tax Interest Rate × (1 − Tax Rate). You use the company's target long-term capital structure for the weights.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 5</div>
<div class="question">Why might you use both a DCF and comps? What does each tell you?</div>
<div class="answer">A DCF provides an intrinsic estimate based on the company's own projected cash flows-it's independent of market sentiment but highly sensitive to assumptions. Comps provide a market-based estimate anchored to how investors currently price similar companies-it's grounded in observable data but assumes the market is pricing those companies correctly. Using both lets you cross-check: if they broadly agree, you have higher confidence. If they disagree significantly, it highlights either a modeling assumption worth questioning or a market mispricing worth investigating.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 6</div>
<div class="question">Why are Precedent Transaction multiples typically higher than Public Comps multiples?</div>
<div class="answer">Because of the control premium. In M&A transactions, buyers pay above the target's current market price to gain operational control, access to synergies, and to convince shareholders to sell. This premium typically ranges from 20-40% and reflects the value the buyer expects to unlock that isn't reflected in the target's standalone trading price. Additionally, competitive auction dynamics can push prices even higher when multiple bidders are involved.</div>
</div>`,
  },
];
