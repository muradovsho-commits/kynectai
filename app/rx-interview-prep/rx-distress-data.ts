export const RX_DISTRESS_SECTIONS = [
  {
    title: 'How Distress Originates',
    content: `<p>Distress almost always traces back to one root cause: a capital structure the business can no longer support. A company generates a certain amount of cash. It owes a certain amount of debt, with interest due on a schedule and principal due at maturity. When the cash the business throws off can no longer comfortably cover the obligations the capital structure imposes, the company is on the path to restructuring.</p>

<div class="key-concept"><strong>Two distinct failure modes, often confused:</strong><br/><strong>Insolvency</strong> (balance-sheet) means liabilities exceed the value of assets. The company is worth less than what it owes. A valuation problem.<br/><strong>Illiquidity</strong> means the company cannot meet obligations as they come due, regardless of long-run solvency. A fundamentally fine business that simply cannot make a near-term interest payment or refinance a maturity. A timing problem.</div>

<p>The two often travel together but not always, and the distinction drives the solution. A purely liquidity-driven problem at an otherwise healthy company might be solved with a quick financing or a maturity extension. A genuine over-leverage problem (too much debt against too little enterprise value) requires actually reducing the debt, which means somebody takes a loss.</p>

<h4>Common Triggers</h4>
<ul>
<li><strong>A maturity wall.</strong> A large tranche comes due and the company cannot refinance on acceptable terms, often because rates rose or performance deteriorated. The company can be current on interest and still hit a wall when principal comes due.</li>
<li><strong>A liquidity shortfall.</strong> The company burns cash faster than expected and the revolver plus cash on hand cannot bridge the gap.</li>
<li><strong>A covenant breach.</strong> Tripping a financial covenant gives lenders the right to accelerate or demand a renegotiation, forcing a restructuring even before a payment is missed.</li>
<li><strong>A secular decline.</strong> The business model is structurally impaired, so leverage that was once reasonable becomes unsupportable as EBITDA shrinks.</li>
<li><strong>A one-time shock or liability.</strong> Mass tort litigation, an environmental liability, a contract loss, or a sudden regulatory change.</li>
</ul>

<p>The connective tissue: leverage amplifies. A company with little debt can absorb a bad year. A company built on layers of debt has no slack, and a modest deterioration cascades into a financing crisis.</p>`,
  },
  {
    title: 'How Companies Push Off the Day of Reckoning',
    content: `<p>Most companies that ultimately restructure spend a long time trying not to. The situation you get staffed on is often a company that has already exhausted several delay tactics.</p>

<p>They draw down the revolver to build a cash cushion. They cut capital expenditure and working capital. They sell non-core assets to raise cash and pay down debt. They refinance into more expensive debt to push out maturities, buying time at the cost of a heavier interest burden. They negotiate covenant relief. Increasingly they use aggressive liability management transactions (covered in the LMEs module) to create runway without a formal restructuring.</p>

<div class="key-concept">The pattern matters because it tells you where in the lifecycle a company sits. A company that has already drawn its revolver, sold its crown-jewel assets, and done a coercive exchange is far closer to filing than one that simply tripped a covenant for the first time. When you read a situation, look for how much dry powder the company has already spent.</div>`,
  },
  {
    title: 'Reading a Capital Structure',
    content: `<p>You cannot do restructuring without reading a capital structure cold. The capital structure is the ordered list of who has lent the company money and who owns it, ranked by priority of claim. When the company is restructured or liquidated, value flows down this stack in order. The top gets paid first and most fully. The bottom often gets wiped out.</p>

<table class="comparison-table">
<tr><th>Tranche</th><th>Key features</th><th>Typical recovery posture</th></tr>
<tr><td>Revolver</td><td>Senior secured line of credit, usually banks, often a borrowing base</td><td>Near full; watch if drawn (liquidity stress signal)</td></tr>
<tr><td>First-lien term loan</td><td>Secured, senior, usually floating rate, often covenant-lite</td><td>High; first claim on collateral</td></tr>
<tr><td>Second-lien term loan</td><td>Junior claim on the same collateral</td><td>Recovers only after first lien is satisfied</td></tr>
<tr><td>Secured notes</td><td>Bonds backed by collateral, ranked by lien priority, usually fixed coupon</td><td>Driven by lien priority, not the secured label</td></tr>
<tr><td>Senior unsecured notes</td><td>General claim after secured debt</td><td>Often where value breaks; frequently the fulcrum</td></tr>
<tr><td>Subordinated notes</td><td>Contractually junior to senior unsecured; higher coupon</td><td>Frequently impaired or wiped out</td></tr>
<tr><td>Mezzanine</td><td>Debt/equity hybrid, warrants, PIK; small</td><td>Among the first impaired</td></tr>
<tr><td>Preferred / common equity</td><td>Residual claim, last in line</td><td>Usually wiped out entirely</td></tr>
</table>

<div class="warning-box"><strong>Never assume secured means safe.</strong> Lien priority, not the secured label, determines recovery. A second-lien secured note can recover less than a senior unsecured claim in some structures.</div>

<p>When you build the structure, list each tranche in priority order with its face amount, then add up cumulative claims as you descend. The point at which cumulative claims exceed enterprise value is where value breaks. Everything above expects a full recovery. The tranche straddling that line is the <strong>fulcrum security</strong>. Everything below it is impaired or worthless.</p>`,
  },
  {
    title: 'Covenants and Credit Documents',
    content: `<p>If the capital structure tells you who is owed what, the credit documents tell you what the company is allowed to do. Modern restructuring is, to an enormous degree, a fight over what the documents permit.</p>

<h4>Affirmative vs Negative Covenants</h4>
<p>Affirmative covenants require the company to do things (deliver financials, maintain insurance, pay taxes) and are mostly boilerplate. Negative covenants restrict what the company can do, and these are where the action is. They govern the ability to incur more debt, grant liens, sell or transfer assets, make investments, and pay dividends. The looser the negative covenants, the more freedom a distressed company (or an aggressive creditor group) has to move assets, raise priming debt, and reorder priority in ways the original lenders never intended.</p>

<h4>Incurrence vs Maintenance (frequently tested)</h4>
<table class="comparison-table">
<tr><th></th><th>Maintenance covenant</th><th>Incurrence covenant</th></tr>
<tr><td>When tested</td><td>Every period, regardless of action</td><td>Only when the company takes a specific action</td></tr>
<tr><td>Example</td><td>Max leverage ratio each quarter</td><td>A test that fires only on incurring debt or a payment</td></tr>
<tr><td>Effect</td><td>Trips automatically if performance deteriorates; early warning for lenders</td><td>Company can decline badly without ever breaching</td></tr>
</table>

<p>Over the past decade, lender protections weakened broadly and <strong>covenant-lite</strong> loans (incurrence covenants only, no maintenance) became the norm for institutional term loans. The practical consequence: companies run much closer to the edge for much longer before lenders get a contractual say. By the time a cov-lite borrower trips anything, the situation is often already severe.</p>

<h4>Baskets and Capacity</h4>
<p>Credit agreements grant permission to do otherwise-restricted things up to limits called baskets: debt baskets, lien baskets, restricted-payment baskets, investment baskets. Some are fixed dollar amounts, some grow with EBITDA, some build over time. Calculating remaining capacity is real analyst work and beyond interview scope. The concept matters: baskets are the levers a company pulls to create runway or execute an aggressive transaction, and reading them correctly lets you predict (or block) what the company is about to do.</p>

<h4>Restricted vs Unrestricted Subsidiaries</h4>
<div class="key-concept">A company is a parent atop a web of subsidiaries. The credit agreement defines which subsidiaries are <strong>restricted</strong> (bound by the covenants, their assets part of the credit support for existing lenders) and which are <strong>unrestricted</strong> (outside the covenant perimeter). If the documents allow the company to transfer valuable assets to an unrestricted subsidiary, it can then raise new debt secured by those assets, outside the existing lenders' collateral, subordinating the original lenders without their consent. This is the mechanical basis of the drop-down maneuver, and litigation over whether a given transfer was permitted has defined some of the most important recent cases.</div>

<p>A related point: debt is issued out of a specific legal entity, and a claim against one entity is not automatically a claim against another. Whether each subsidiary guarantees the debt, and whether that guarantee is secured, determines whether a creditor reaches the value or is structurally subordinated to it (covered in the Structural Sub module).</p>`,
  },
];
