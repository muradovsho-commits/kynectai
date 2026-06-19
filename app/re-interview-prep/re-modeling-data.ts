export const RE_MODELING_SECTIONS = [
  {
    title: 'The Real Estate Pro Forma',
    content: `<p>The pro forma is the financial model of a property: a multi-year projection of its cash flows used to value it and to estimate returns. Real estate modeling is more standardized than corporate modeling because the structure follows the cash flows of a building, and the same skeleton recurs across nearly every deal.</p>

<div class="framework-box"><div class="fw-label">THE PRO FORMA SKELETON</div>1. <strong>Revenue:</strong> gross potential rent, less vacancy, plus other income, equals effective gross income.<br/>2. <strong>Operating expenses:</strong> taxes, insurance, utilities, management, R&amp;M, payroll.<br/>3. <strong>NOI:</strong> EGI less operating expenses.<br/>4. <strong>Capital items:</strong> capex, tenant improvements, leasing commissions.<br/>5. <strong>Unlevered cash flow:</strong> NOI less capital items.<br/>6. <strong>Debt service:</strong> interest and any amortization.<br/>7. <strong>Levered cash flow:</strong> unlevered cash flow less debt service, the cash to equity.<br/>8. <strong>Reversion:</strong> the sale at the end, exit NOI divided by exit cap rate, less selling costs and loan payoff.</div>

<p>You project this over a hold period (often 5 to 10 years), growing rents and expenses by assumed rates, modeling the financing, and capturing the sale at the end. The two cash-flow streams the model produces, periodic operating cash flow and the lump-sum sale proceeds, together drive every return metric.</p>

<div class="key-concept"><strong>The reversion (exit) usually dominates the return.</strong> In most hold periods, the sale proceeds at exit are the single largest cash flow, which is why the exit assumptions, exit NOI and exit cap rate, are the most scrutinized inputs in the model. A model can show a great IRR purely because it assumes the exit cap compresses below the going-in cap, which is a bet on the market, not on the asset. Always interrogate the exit: is the exit cap conservative (equal to or higher than going-in), and is the exit NOI realistically grown? Most of the return, and most of the ways to fool yourself, live in the reversion.</div>`,
  },
  {
    title: 'The Return Metrics',
    content: `<p>Real estate equity returns are measured with a specific set of metrics, and you must know what each captures, what it misses, and how they relate.</p>

<table class="comparison-table">
<tr><th>Metric</th><th>What it measures</th><th>Blind spot</th></tr>
<tr><td>IRR</td><td>Annualized return accounting for the timing of all cash flows</td><td>Ignores deal size and duration; rewards early cash, can be gamed by timing</td></tr>
<tr><td>Equity multiple (MOIC)</td><td>Total cash returned divided by cash invested</td><td>Ignores time; 2.0x in 3 years and in 10 years look identical</td></tr>
<tr><td>Cash-on-cash</td><td>Annual pre-tax cash flow divided by equity invested</td><td>A single-year snapshot; ignores appreciation and the sale</td></tr>
<tr><td>Yield on cost</td><td>Stabilized NOI divided by total project cost</td><td>Most used in development; compares to market cap rate</td></tr>
</table>

<div class="key-concept"><strong>IRR and equity multiple must be read together, because each hides what the other reveals.</strong> IRR rewards speed: a fast flip can post a high IRR on a thin total profit, because the annualization magnifies a quick double. Equity multiple rewards magnitude but ignores time: a 2.0x is far better over three years than over ten, yet the multiple looks identical. A deal can have a high IRR and a low multiple (a quick, small win) or a low IRR and a high multiple (a slow, large win). Sophisticated investors look at both, plus the cash-on-cash for the current yield, to understand the full return shape. Quoting one without the other is a rookie tell.</div>

<div class="example-box">
<div class="example-label">IRR vs multiple in action</div>
<p>Deal A returns 2.0x in 3 years, an IRR around 26 percent. Deal B returns 2.5x in 7 years, an IRR around 14 percent. Deal A has the higher IRR (faster), Deal B the higher multiple (more total profit). Which is better depends on what you can do with the capital when it comes back: if you can redeploy Deal A's proceeds at a strong return, its speed is valuable; if not, Deal B's larger absolute profit may win. There is no universal answer, which is exactly why both metrics exist.</div></div>`,
  },
  {
    title: 'Yield on Cost and the Development Spread',
    content: `<p>One return metric deserves special attention because it anchors value-add and development underwriting: <strong>yield on cost</strong>, also called the development yield or return on cost.</p>

<div class="formula-box">Yield on Cost = Stabilized NOI / Total Project Cost<br/><br/>Development Spread = Yield on Cost - Market (Exit) Cap Rate</div>

<p>Yield on cost is the unlevered yield you create by building or repositioning: the stabilized NOI you achieve divided by all-in cost (purchase or land, plus construction or renovation, plus soft costs and carry). You then compare it to the market cap rate at which the finished, stabilized asset would sell or be valued.</p>

<div class="key-concept"><strong>The spread between yield on cost and the market cap rate is the profit margin of development and value-add.</strong> If you build to a 7 percent yield on cost and the finished asset trades at a 5.5 percent cap rate, you have created value: the same NOI worth 7 percent on your cost is worth more to the market at 5.5 percent. That roughly 150 basis point spread is the <strong>development margin</strong>, the compensation for taking construction, lease-up, and execution risk. A thin or negative spread means the risk is not worth taking; you could buy a finished asset for nearly the same price without the execution risk. This single comparison, yield on cost versus market cap rate, is the heart of whether a development or heavy value-add deal makes sense.</div>

<div class="example-box">
<div class="example-label">Worked Example</div>
<p>Total project cost is 50,000,000. At stabilization the asset produces 3,500,000 of NOI. Yield on cost = 3,500,000 / 50,000,000 = 7.0 percent. Comparable stabilized assets trade at a 5.5 percent cap rate, so the finished value is 3,500,000 / 0.055 = about 63,600,000. You created roughly 13,600,000 of value (63,600,000 less 50,000,000 cost) on a 50,000,000 project, a development margin of about 27 percent, in exchange for taking the construction and lease-up risk. If market cap rates were instead 7 percent (no spread), the finished value would equal your cost and there would be no margin for the risk.</p>
</div>`,
  },
  {
    title: 'Sensitivity and the Levers That Move Returns',
    content: `<p>A single base-case number means little without understanding how it moves. Sensitivity analysis, flexing key assumptions to see how the IRR and multiple respond, is core to real estate modeling, and knowing which levers matter most is a sign of real fluency.</p>

<div class="key-concept">The inputs that move returns most, roughly in order: the <strong>exit cap rate</strong> (because the sale usually dominates the return and small cap moves swing the sale price a lot), <strong>rent growth and stabilized NOI</strong> (the income engine), <strong>leverage and the cost of debt</strong> (which amplify or drag the equity return), <strong>going-in price</strong> (basis is destiny), and the <strong>hold period and timing</strong> (which drive IRR). When you build a sensitivity table, you almost always flex the exit cap rate against rent growth or against the purchase price, because those pairings capture the biggest sources of variation. A return that holds up across a range of exit caps is robust; one that only works if the exit cap compresses is a market bet dressed up as a real estate deal.</div>

<div class="mistake-box"><strong>The aggressive-assumptions trap:</strong> models are easy to make look great by quietly assuming exit cap compression, above-market rent growth, a quick lease-up, and cheap perpetual financing. Each assumption is defensible alone; stacked together they manufacture a fictional IRR. Disciplined underwriting stress-tests each input and asks whether the return survives conservative exit caps and realistic rent growth. In an interview, flagging that you would sensitize the exit cap and rent growth, rather than trusting a single base case, signals maturity.</div>

<div class="pro-tip">If asked "what would you sensitize in this model," the strong answer names the exit cap rate first (the dominant lever), then rent growth and the cost and amount of debt, and explains why: because the sale drives the return, the income drives the sale, and leverage gears both. Showing you know where the return actually comes from beats reciting a list of inputs.</div>`,
  },
];
