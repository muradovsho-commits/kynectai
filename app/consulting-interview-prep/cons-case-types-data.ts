export const CONS_CASE_TYPES_SECTIONS = [
  {
    title: `4.1 Profitability Cases`,
    content: `<p><strong>Objective:</strong> Determine why profits changed and identify how to improve them.</p>
<p><strong>First principles:</strong> Profit = Revenue - Cost. Revenue = Price x Volume. Volume = customers x frequency x average units. Cost = Fixed + Variable.</p>
<h4>When to use:</h4>
<p>Declining profits, margin compression, performance below plan, need to improve bottom line.</p>
<h4>Core structure:</h4>
<ol>
<li><strong>Revenue:</strong> Price, volume, mix</li>
<li><strong>Cost:</strong> Variable cost, fixed cost</li>
<li><strong>External factors:</strong> Competition, input costs, regulation</li>
<li><strong>Internal factors:</strong> Product mix, sales execution, operational efficiency</li>
</ol>
<p>How to customize: Ask whether the business is product or service based, subscription or transactional, premium or low-cost, B2B or B2C. The key drivers will differ.</p>
<h4>Example Mini-Case:</h4>
<p><strong>Prompt:</strong> "Our client is a national restaurant chain whose profits have declined 25% over the last year."</p>
<p><strong>Candidate:</strong> <em>"To understand the decline, I'd examine revenue and cost. On revenue, I'd break it into average ticket and customer traffic, influenced by pricing, menu mix, and frequency. On cost: food input costs, labor, rent, corporate overhead. I'd also consider external changes like new competitors or inflation. Given restaurant economics, I'd start by understanding whether traffic or margins changed more materially."</em></p>
<p><strong>Interviewer:</strong> "Customer traffic is flat, but average ticket is down 10%."</p>
<p><strong>Candidate:</strong> <em>"That suggests the profit decline is being driven on the revenue side through lower revenue per visit. I'd want to know whether the lower average ticket comes from price cuts, promotions, or a shift toward lower-priced menu items."</em></p>
<p><strong>Interviewer:</strong> "The chain introduced aggressive discounts to match competitors."</p>
<p><strong>Candidate:</strong> <em>"That points to pricing pressure as a primary driver. I'd assess whether discounts increased volume enough to offset lower prices, and whether there are more targeted ways to defend traffic without broad margin erosion."</em></p>
<h4>Common profitability levers:</h4>
<p>Raise prices selectively, shift toward higher-margin products, reduce promotions, improve utilization, reduce waste, renegotiate suppliers, close underperforming locations.</p>`
  },
  {
    title: `4.2 Market Entry Cases`,
    content: `<p><strong>Key question:</strong> Will entry create attractive value, and can the client win?</p>
<h4>Core structure:</h4>
<ol>
<li><strong>Market attractiveness:</strong> Size, growth, profitability, trends</li>
<li><strong>Competitive landscape:</strong> Incumbents, concentration, barriers to entry</li>
<li><strong>Client capabilities and fit:</strong> Brand, product fit, distribution, operations</li>
<li><strong>Entry economics:</strong> Revenue potential, cost to enter, investment required, payback/ROI</li>
<li><strong>Risks and execution:</strong> Regulation, competitive response, capability gaps</li>
</ol>
<h4>Example dialogue:</h4>
<p><strong>Prompt:</strong> "A European cosmetics company is considering entering the U.S. skincare market."</p>
<p><strong>Candidate:</strong> <em>"To assess whether entry makes sense, I'd look at five areas. First, market attractiveness: how large and fast-growing the U.S. skincare market is and which segments are most attractive. Second, competition: whether the market is fragmented or dominated by strong incumbents and where whitespace may exist. Third, our client's ability to win: whether its brand positioning, product portfolio, and channels fit the U.S. customer. Fourth, economics: expected revenues, margins, and the investment required. Fifth, risks, including regulatory requirements and incumbent retaliation. I'd start with market attractiveness and client fit, since even a large market is not attractive if we have no right to win."</em></p>
<p><strong>Key insight:</strong> Entry is not just "large market = yes." A large market can be terrible if customer acquisition costs are high, incumbents dominate channels, or the client lacks differentiation.</p>`
  },
  {
    title: `4.3 M&A Cases`,
    content: `<p>A good acquisition requires: attractive standalone business, strategic fit, synergies, reasonable price, executable integration.</p>
<h4>Structure:</h4>
<ol>
<li><strong>Strategic rationale</strong></li>
<li><strong>Target attractiveness:</strong> Growth, margins, competitive position</li>
<li><strong>Synergies:</strong> Revenue (cross-selling, pricing, customer access) and cost (procurement, SG&A elimination, shared operations)</li>
<li><strong>Valuation / deal economics</strong></li>
<li><strong>Risks and integration:</strong> One-time integration costs, culture, execution risk</li>
</ol>
<p><em>"To determine whether the acquisition makes sense, I'd assess first the target's standalone attractiveness; second the strategic fit with our client; third the magnitude and feasibility of synergies; fourth whether the deal price allows us to capture sufficient value; and fifth key integration risks. I'd start by validating standalone quality and synergy thesis, since a weak target or unrealistic synergies can break the case quickly."</em></p>`
  },
  {
    title: `4.4 Growth Strategy Cases`,
    content: `<p>Growth can come from: more customers, higher frequency, higher basket size/spend per customer, new products, new geographies, new channels, higher prices, acquisitions/partnerships.</p>
<h4>Framework:</h4>
<ol>
<li>Diagnose current growth constraints</li>
<li>Identify organic levers</li>
<li>Identify inorganic / adjacent levers</li>
<li>Evaluate economics and feasibility</li>
<li>Prioritize and sequence initiatives</li>
</ol>
<p><strong>Key insight:</strong> Not all growth is good growth. Candidates must assess profit impact, strategic coherence, and execution complexity.</p>`
  },
  {
    title: `4.5 Pricing Cases`,
    content: `<p>A price change affects: revenue per unit, volume sold, margin per unit, customer perception, competitive response.</p>
<h4>Framework:</h4>
<ol>
<li>Current economics</li>
<li>Customer willingness to pay / elasticity</li>
<li>Competitive context</li>
<li>Pricing architecture and segmentation</li>
<li>Risks and implementation</li>
</ol>
<p><strong>Key ideas:</strong> A price increase works only if margin gain offsets volume loss. Different customer segments may have different willingness to pay. Packaging, bundling, and discount structure often matter as much as list price.</p>
<p><strong>Common pricing moves:</strong> Raise list price, reduce discounting, premium tiers, versioning/good-better-best, dynamic pricing, bundling.</p>`
  },
  {
    title: `4.6 Operations / Cost Reduction Cases`,
    content: `<p><strong>Objective:</strong> Improve efficiency, reduce cost, or increase throughput while maintaining service or quality.</p>
<h4>Typical drivers:</h4>
<p>Labor utilization, capacity utilization, procurement, logistics, process waste, yield/scrap, inventory, automation.</p>
<h4>Framework:</h4>
<ol>
<li>Cost base or operational process map</li>
<li>Identify major cost pools / bottlenecks</li>
<li>Benchmark performance</li>
<li>Diagnose root causes</li>
<li>Evaluate improvements and trade-offs</li>
</ol>
<p>Strong candidates don't just say "reduce costs." They identify <strong>where</strong> costs are concentrated and <strong>what operational lever</strong> would actually change them.</p>
<h4>Practice Drills:</h4>
<p>For each case type: build a structure from scratch, state your likely starting branch, give 3 tailored analyses you would want, deliver a 30-second recommendation after reviewing hypothetical data.</p>
<p><strong>Speak-out-loud exercise:</strong> <em>"Our client is a consumer electronics company considering raising prices by 8% on one of its flagship products. What factors would you consider?"</em></p>`
  },
];
