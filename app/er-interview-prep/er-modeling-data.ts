export const ER_MODELING_SECTIONS = [
  {
    title: 'ER Models vs. Banking Models',
    content: `<p>Investment banking models are built to evaluate a specific transaction (an LBO, a merger, a DCF for advisory). Equity research models are built to <strong>forecast ongoing operating performance</strong> and determine whether a stock is attractively priced. Key differences:</p>

<p><strong>Granularity of revenue:</strong> ER models break revenue into its fundamental components (segments, geographies, products, unit economics) with much more detail than a banking model. A banking analyst might project total revenue growth at 8%. An ER analyst projects segment-by-segment: North America enterprise grows 12% on 6% volume and 6% pricing, while EMEA SMB grows 3% on flat volume and 3% pricing, and so on.</p>

<p><strong>Quarterly projections:</strong> ER models project quarterly (not just annual) because the analyst must publish estimates for each quarterly earnings report. The quarterly model must capture seasonality (Q4 is the strongest quarter for most enterprise software companies; Q1 is weakest for consumer discretionary) and one-time items.</p>

<p><strong>Longer history, shorter projection period:</strong> ER models typically include 5-10 years of historical data (to identify trends and cyclical patterns) and 2-3 years of detailed projections. Banking models may have less history but longer projection periods (5-10 years for a DCF).</p>

<p><strong>EPS and per-share focus:</strong> The ultimate output of an ER model is EPS (earnings per share), which is the metric that drives stock prices in the near term. The model must track the share count carefully (dilution from options, RSUs, convertibles; reduction from buybacks) because EPS = Net Income / Diluted Shares.</p>`,
  },
  {
    title: 'Building the Model: Step by Step',
    content: `<h4>Step 1: Revenue Build</h4>

<p>Construct revenue from the bottom up using the company's disclosed segments and key drivers. For each segment, project the driver-based components. Example for a medical device company:</p>

<div class="example-box">
<div class="example-label">Revenue Build Example</div>
<p><strong>Segment: US Cardiac Devices</strong></p>
<p>Procedures (units): 185,000 in Year 1. Growing at 3% (aging population, improved diagnosis rates) → 190,550 in Year 2.</p>
<p>Average Selling Price (ASP): $4,200 in Year 1. Pricing up 2% due to new premium product launch → $4,284 in Year 2.</p>
<p>Revenue: 190,550 × $4,284 = <strong>$816.3M</strong> in Year 2 (up from $777.0M in Year 1 = 5.1% growth).</p>
<p>Repeat this for each segment (US Cardiac, International Cardiac, Neuro, etc.) and sum to get total company revenue.</p>
</div>

<p>The key advantage of a driver-based revenue build: you can stress-test specific assumptions. What if procedure volume grows 1% instead of 3%? What if pricing is flat? What if the new product launch is delayed a quarter? Each scenario produces a different revenue outcome, and you can assign probabilities to create a range of estimates.</p>

<h4>Step 2: Cost Structure and Margins</h4>

<p>Project each major expense line as a percentage of revenue or in absolute terms, depending on the nature of the cost:</p>

<p><strong>COGS / Gross Margin:</strong> Usually projected as a percentage of revenue, adjusted for mix shifts (higher-margin products growing faster = margin expansion) and input cost trends. Track gross margin by segment if disclosed.</p>

<p><strong>R&D:</strong> Often semi-fixed; may be projected as a percentage of revenue that declines gradually as the company scales.</p>

<p><strong>SG&A:</strong> Typically has a fixed component (corporate overhead, rent) and a variable component (sales commissions, marketing). Project each separately for more accuracy.</p>

<p><strong>Stock-Based Compensation:</strong> Track separately because some investors focus on "adjusted" earnings that exclude SBC, while GAAP earnings include it. Both matter.</p>

<h4>Step 3: Below-the-Line Items</h4>

<p>Interest expense (based on the debt schedule), interest income (on the cash balance), other income/expense (one-time items, FX gains/losses), and taxes (effective tax rate, adjusted for discrete items). Tax rate modeling is more important than it sounds: a 2-percentage-point change in the effective tax rate can swing EPS by 3-5%.</p>

<h4>Step 4: EPS Calculation</h4>

<p>Calculate diluted shares outstanding using the Treasury Stock Method for options and RSUs, and include the dilutive effect of convertible securities. Project share count changes from buyback programs (how many shares will the company repurchase at the average projected stock price?) and from new equity issuance.</p>

<div class="formula-box">
Diluted EPS = (Net Income − Preferred Dividends) / Diluted Shares Outstanding
</div>

<h4>Step 5: Balance Sheet and Cash Flow Statement</h4>

<p>Project the full balance sheet and cash flow statement. Key items: working capital (DSO, DIO, DPO trends), CapEx (maintenance vs. growth, management guidance), debt maturities and refinancing, and cash flow generation. The free cash flow projection informs the DCF valuation and also tells you whether the company can fund its growth, maintain its dividend, and execute its buyback program without raising external capital.</p>`,
  },
  {
    title: 'Consensus Estimates and Variant Perception',
    content: `<p>After building your model, compare your estimates to the <strong>consensus</strong>-the average of all sell-side analysts' estimates, compiled by data providers like FactSet, Bloomberg, or Visible Alpha. Where do you differ from consensus, and why?</p>

<p>If your revenue estimate is 3% above consensus, you need to articulate exactly what you see that others don't. This is your <strong>variant perception</strong>-the specific insight that differentiates your research. It could be driven by: a channel check revealing stronger demand than management guided, a pricing trend that consensus models are underestimating, a new product launch whose contribution is being underappreciated, or a cost trend (e.g., raw material deflation) that will boost margins more than expected.</p>

<p>Without a variant perception, your research adds no value. If your estimates and thesis are identical to consensus, there's no reason for a buy-side analyst to read your report or call you.</p>`,
  },
];
