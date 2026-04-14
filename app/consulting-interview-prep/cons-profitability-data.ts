export const CONS_PROFITABILITY_SECTIONS = [
  {
    title: 'The Profitability Framework',
    content: `<p>Profit = Revenue − Costs. This is the starting point, but the value is in the decomposition:</p>

<div class="formula-box">
Revenue = Price × Volume<br>
Volume = # of Customers × Units per Customer (or Transactions × Avg. Transaction Size)<br>
Costs = Fixed Costs + Variable Costs<br>
Variable Costs = Volume × Cost per Unit<br>
Profit Margin = (Revenue − Costs) / Revenue
</div>

<p>The first question in any profitability case is: <strong>Is this a revenue problem, a cost problem, or both?</strong> Establish this early by getting the revenue and cost trends over the period in question. If revenue grew 5% but costs grew 15%, it's clearly a cost problem. If revenue fell 20% while costs stayed flat, it's a revenue problem (and likely a volume problem, since companies rarely cut prices by 20%).</p>

<h4>Revenue-Side Analysis</h4>

<p>If revenue is the issue, decompose it further:</p>

<p><strong>Price vs. Volume:</strong> Is the company selling fewer units, or selling at lower prices? These have very different causes and solutions. A volume decline might indicate market share loss, market contraction, or distribution problems. A price decline might indicate competitive pressure, commoditization, or excessive discounting.</p>

<p><strong>Segment-level analysis:</strong> Revenue declines are rarely uniform. Break revenue by product line, customer segment, geography, or channel. Often you'll find that one segment is dragging down the whole business while others are performing well. This focus accelerates diagnosis enormously.</p>

<p><strong>Market vs. company-specific:</strong> Is the entire market declining (macroeconomic recession, structural shift like streaming replacing DVDs), or is the company losing share while competitors grow? If the market is growing but the company is shrinking, the problem is company-specific, and you need to understand the competitive dynamics.</p>

<h4>Cost-Side Analysis</h4>

<p>If costs are the issue, decompose them:</p>

<p><strong>Fixed vs. Variable:</strong> Fixed costs (rent, salaries, insurance) don't change with volume. Variable costs (raw materials, shipping, sales commissions) scale with volume. If the company's revenue has declined but its cost base hasn't shrunk proportionally, the problem is likely fixed cost leverage-the company is spreading fixed costs over fewer units, causing per-unit costs to rise.</p>

<p><strong>Cost categories:</strong> Break costs into major buckets: COGS (materials, direct labor, manufacturing overhead), SG&A (sales, marketing, general administration), and R&D. Identify which categories are growing fastest and benchmark them against competitors or industry norms.</p>

<p><strong>One-time vs. recurring:</strong> A one-time cost spike (a legal settlement, a factory relocation) is fundamentally different from a structural cost increase (rising raw material prices, a new union contract). The former resolves itself; the latter requires a strategic response.</p>

<div class="case-walkthrough">
<div class="cw-label">Profitability Case Walkthrough</div>
<p><strong>Prompt:</strong> "Our client is a mid-size chain of fitness studios. Profits have declined 25% over the past two years despite revenue being roughly flat. The CEO wants to understand why and what to do about it."</p>
<p><strong>Step 1 - Clarify:</strong> How many locations? (~40 studios). What geography? (US, mostly suburban). What's the membership model? (Monthly memberships, $50-$100/month depending on tier). Has revenue truly been flat, or has it fluctuated? (Flat within 2%.)</p>
<p><strong>Step 2 - Structure:</strong> Since revenue is flat but profits are down 25%, this is a cost problem. I'd want to explore: (1) Which cost categories have grown? (2) Is the increase driven by a few locations or across the board? (3) Are there external factors (regulatory, labor market) driving the increase? (4) What cost-reduction levers are available?</p>
<p><strong>Step 3 - Analyze:</strong> Data reveals: labor costs (instructors and front desk) have grown 30% in two years, driven by a tight labor market forcing higher wages. Rent has grown 12% due to lease renewals at higher rates. Other costs are roughly flat. The labor cost increase alone explains ~80% of the profit decline (80/20 in action).</p>
<p><strong>Step 4 - Recommend:</strong> "The profit decline is driven almost entirely by labor cost inflation, primarily instructor wages. I'd recommend three actions: (1) Introduce a tiered class model where some classes are led by senior instructors (premium pricing) and others by more junior instructors (lower cost), which improves the labor cost/revenue ratio. (2) Explore class-size optimization-if classes average 15 participants but rooms hold 25, filling those seats with targeted promotions is nearly pure margin. (3) Renegotiate underperforming leases or consider relocating studios where the rent-to-revenue ratio exceeds a threshold. Longer-term, explore tech-enabled classes (on-demand video content) that don't require a live instructor for every session."</p>
</div>`,
  },
  {
    title: 'Turnaround-Specific Considerations',
    content: `<p>Turnaround cases involve companies in more severe financial distress. Beyond the standard profitability analysis, you should consider:</p>

<p><strong>Cash vs. Profitability:</strong> A company can be "profitable" on paper but running out of cash (if AR is growing, Inventory is piling up, or CapEx commitments are high). In a turnaround, cash is king. Analyze the cash flow statement, not just the income statement.</p>

<p><strong>Quick wins vs. structural changes:</strong> Turnarounds require immediate cash preservation (freeze hiring, cut discretionary spending, renegotiate payment terms) alongside longer-term structural fixes (exiting unprofitable product lines, closing underperforming locations, renegotiating supplier contracts).</p>

<p><strong>Stakeholder management:</strong> Turnarounds involve difficult decisions (layoffs, store closures, product discontinuation) that affect employees, customers, and suppliers. The consultant must consider implementation feasibility, not just analytical elegance.</p>`,
  },
];
