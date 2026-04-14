export const RX_WATERFALL_SECTIONS = [
  {
    title: 'How Waterfalls Work',
    content: `<p>A waterfall analysis takes the company's estimated enterprise value (EV) and distributes it down the capital structure in order of priority. Each class is satisfied before the next class receives anything (per the Absolute Priority Rule).</p>

<div class="example-box">
<div class="example-label">Basic Waterfall Example</div>
<p><strong>Given:</strong> EV = $400M. Secured Term Loan = $250M. Senior Unsecured Notes = $200M. Subordinated Notes = $100M. Equity: residual.</p>
<p><strong>Step 1:</strong> Secured TL gets $250M → Recovery: 100% (fully covered)</p>
<p><strong>Step 2:</strong> Remaining value: $400M − $250M = $150M → Senior Unsecured Notes get $150M of their $200M → Recovery: 75%</p>
<p><strong>Step 3:</strong> Remaining value: $0 → Subordinated Notes get nothing → Recovery: 0%</p>
<p><strong>Step 4:</strong> Equity gets nothing → Recovery: 0%</p>
<p><strong>Fulcrum Security:</strong> The Senior Unsecured Notes (value breaks here). This class would receive the reorganized equity.</p>
</div>`,
  },
  {
    title: 'Where Would Each Tranche Trade?',
    content: `<p>Distressed debt doesn't trade at par-it trades at a discount reflecting the expected recovery. In the example above, you'd expect the Secured TL to trade near par (perhaps 98-100, since it's fully covered), the Senior Unsecured Notes to trade around 75 (reflecting 75% recovery), and the Subordinated Notes to trade near zero.</p>

<p>However, there's nuance. Before a filing actually occurs, <strong>optionality</strong> affects trading prices. The Senior Unsecured Notes might trade slightly above 75 because there's some probability (however small) that the company turns things around, EBITDA improves, and recoveries end up being higher. The Sub Notes might trade at 5-10 cents even with a zero recovery scenario because of the outside chance of a positive surprise. Even equity retains some non-zero value pre-filing for the same reason.</p>

<p>Conversely, debt can sometimes trade <em>below</em> its theoretical recovery value due to forced selling (institutional investors dumping downgraded bonds), illiquidity (wide bid-ask spreads in distressed markets), and disagreement over the correct EV estimate.</p>`,
  },
  {
    title: 'Equity Value in Distress',
    content: `<p>When a company's EV is less than its total debt, equity is theoretically worthless. Yet in practice, equity almost always retains some positive trading value prior to a bankruptcy filing. This residual value reflects the <strong>option value</strong> of equity: like a call option, equity's downside is capped at zero, but its upside is theoretically unlimited. If the company experiences an unexpected turnaround, equity holders benefit disproportionately. The more volatile the company's prospects, the more this option is worth.</p>

<p>Once the company files Chapter 11, this optionality largely evaporates. Equity is almost always cancelled in the reorganization, and its value drops to near-zero (perhaps receiving a small "tip" in exchange for not contesting the plan).</p>`,
  },
];
