export const RX_DISTRESS_SECTIONS = [
  {
    title: 'How Distress Originates',
    content: `<p>Distress almost always traces back to one root cause: a capital structure the business can no longer support. A company generates a certain amount of cash. It owes a certain amount of debt, with interest due on a schedule and principal due at maturity. When the cash the business throws off can no longer comfortably cover the obligations the capital structure imposes, the company is on the path to restructuring.</p>

<div class="key-concept"><strong>Two distinct failure modes, often confused:</strong><br/><strong>Insolvency</strong> (balance-sheet) means liabilities exceed the value of assets. The company is worth less than what it owes. A valuation problem.<br/><strong>Illiquidity</strong> means the company cannot meet obligations as they come due, regardless of long-run solvency. A fundamentally fine business that simply cannot make a near-term interest payment or refinance a maturity. A timing problem.</div>

<p>The two often travel together but not always, and the distinction drives the solution. A purely liquidity-driven problem at an otherwise healthy company might be solved with a quick financing or a maturity extension. A genuine over-leverage problem (too much debt against too little enterprise value) requires actually reducing the debt, which means somebody takes a loss. If you misdiagnose a solvency problem as a liquidity problem, you just lend a sinking company more money and make the eventual restructuring bigger.</p>

<h4>Common Triggers</h4>
<ul>
<li><strong>A maturity wall.</strong> A large tranche comes due and the company cannot refinance on acceptable terms, often because rates rose or performance deteriorated. The company can be current on interest and still hit a wall when principal comes due. This is why analysts obsess over the maturity schedule: the wall is a hard date.</li>
<li><strong>A liquidity shortfall.</strong> The company burns cash faster than expected and the revolver plus cash on hand cannot bridge the gap. Floating-rate debt makes this worse, because rising rates lift cash interest automatically.</li>
<li><strong>A covenant breach.</strong> Tripping a financial covenant gives lenders the right to accelerate or demand a renegotiation, forcing a restructuring even before a payment is missed.</li>
<li><strong>A secular decline.</strong> The business model is structurally impaired, so leverage that was once reasonable becomes unsupportable as EBITDA shrinks. Retail and print media are the textbook cases.</li>
<li><strong>A one-time shock or liability.</strong> Mass tort litigation, an environmental liability, a contract loss, or a sudden regulatory change. Some otherwise-healthy companies have even used the bankruptcy process strategically to manage large contingent liabilities, which is its own controversial subject.</li>
</ul>

<div class="framework-box"><div class="fw-label">SIGNS A COMPANY IS HEADING TO DISTRESS</div>Leverage climbing past where the sector can sustain it; EBITDA declining year over year; debt trading well below par; a near-term maturity with no obvious refinancing; thinning liquidity (revolver drawn, cash falling); and credit downgrades. Any one is a flag. Several together is a profile candidate.</div>

<p>The connective tissue across all of these: leverage amplifies. A company with little debt can absorb a bad year. A company built on layers of debt has no slack, and a modest deterioration cascades into a financing crisis.</p>`,
  },
  {
    title: 'How Companies Push Off the Day of Reckoning',
    content: `<p>Most companies that ultimately restructure spend a long time trying not to. The situation you get staffed on is often a company that has already exhausted several delay tactics, so reading which tactics are spent tells you how close it is to the edge.</p>

<p>They draw down the revolver to build a cash cushion. They cut capital expenditure and working capital, sometimes starving the business to conserve cash. They sell non-core assets to raise cash and pay down debt. They refinance into more expensive debt to push out maturities, buying time at the cost of a heavier interest burden. They negotiate covenant relief from lenders, usually paying for it with fees and a higher rate. Increasingly they use aggressive liability management transactions (covered in the LMEs module) to create runway or raise priming money without a formal restructuring.</p>

<div class="key-concept">The pattern matters because it tells you where in the lifecycle a company sits. A company that has already drawn its revolver, sold its crown-jewel assets, refinanced once at a punishing rate, and done a coercive exchange is far closer to filing than one that simply tripped a covenant for the first time. When you read a situation, look for how much dry powder the company has already spent. The fewer levers left, the less negotiating room the company has, and the more leverage shifts to creditors.</div>`,
  },
  {
    title: 'Reading a Capital Structure',
    content: `<p>You cannot do restructuring without reading a capital structure cold. The capital structure is the ordered list of who has lent the company money and who owns it, ranked by priority of claim. When the company is restructured or liquidated, value flows down this stack in order. The top gets paid first and most fully. The bottom often gets wiped out.</p>

<table class="comparison-table">
<tr><th>Tranche</th><th>Key features</th><th>Typical recovery posture</th></tr>
<tr><td>Revolver</td><td>Senior secured line of credit, usually banks, often a borrowing base on receivables/inventory</td><td>Near full; watch if drawn (liquidity stress signal)</td></tr>
<tr><td>First-lien term loan</td><td>Secured, senior, usually floating rate, often covenant-lite, held by CLOs and credit funds</td><td>High; first claim on collateral</td></tr>
<tr><td>Second-lien term loan</td><td>Junior claim on the same collateral</td><td>Recovers only after first lien is satisfied</td></tr>
<tr><td>Secured notes</td><td>Bonds backed by collateral, ranked by lien priority, usually fixed coupon</td><td>Driven by lien priority, not the secured label</td></tr>
<tr><td>Senior unsecured notes</td><td>General claim after secured debt</td><td>Often where value breaks; frequently the fulcrum</td></tr>
<tr><td>Subordinated notes</td><td>Contractually junior to senior unsecured; higher coupon</td><td>Frequently impaired or wiped out</td></tr>
<tr><td>Mezzanine</td><td>Debt/equity hybrid, warrants, PIK interest; small</td><td>Among the first impaired</td></tr>
<tr><td>Preferred / common equity</td><td>Residual claim, last in line</td><td>Usually wiped out entirely</td></tr>
</table>

<h4>Fixed vs Floating, and Why It Matters in Distress</h4>
<p>Term loans typically float (a benchmark rate plus a spread); bonds usually carry a fixed coupon. In a rising-rate environment a heavily floating-rate borrower sees its cash interest climb automatically even if nothing else changes, which is a common accelerant of distress. When you read a structure, note how much of the interest burden is floating, because that tells you how exposed the company is to rates moving against it.</p>

<div class="warning-box"><strong>Never assume secured means safe.</strong> Lien priority, not the secured label, determines recovery. A second-lien secured note can recover less than a senior unsecured claim in some structures. And a tranche issued out of the wrong legal entity can rank behind one that looks junior on paper (see Structural Subordination).</div>

<p>When you build the structure, list each tranche in priority order with its face amount, then add up cumulative claims as you descend. The point at which cumulative claims exceed enterprise value is where value breaks. Everything above expects a full recovery. The tranche straddling that line is the <strong>fulcrum security</strong>. Everything below it is impaired or worthless. That single observation drives the entire recovery analysis.</p>`,
  },
  {
    title: 'Covenants: Incurrence vs Maintenance',
    content: `<p>If the capital structure tells you who is owed what, the credit documents tell you what the company is allowed to do. Modern restructuring is, to an enormous degree, a fight over what the documents permit. Two covenant types anchor everything.</p>

<table class="comparison-table">
<tr><th></th><th>Maintenance covenant</th><th>Incurrence covenant</th></tr>
<tr><td>When tested</td><td>Every period, regardless of action</td><td>Only when the company takes a specific action</td></tr>
<tr><td>Example</td><td>Net leverage must stay below 5.0x each quarter</td><td>A leverage test that fires only on incurring new debt or making a payment</td></tr>
<tr><td>Effect</td><td>Trips automatically if performance deteriorates; early warning for lenders</td><td>Company can decline badly without ever breaching</td></tr>
<tr><td>Found in</td><td>Traditional bank loans, revolvers</td><td>Bonds and covenant-lite term loans</td></tr>
</table>

<div class="key-concept"><strong>Affirmative vs negative covenants:</strong> affirmative covenants require the company to do things (deliver financials, maintain insurance, pay taxes) and are mostly boilerplate. <strong>Negative covenants</strong> restrict what the company can do (incur debt, grant liens, sell or transfer assets, make investments, pay dividends) and are the most heavily negotiated terms in any agreement. The looser the negative covenants, the more freedom a distressed company, or an aggressive creditor group working with it, has to move assets, raise priming debt, and reorder priority in ways the original lenders never intended.</div>

<p>Over the past decade lender protections weakened broadly, and <strong>covenant-lite</strong> loans (incurrence covenants only, no maintenance) became the norm for institutional term loans. The practical consequence for restructuring: companies run much closer to the edge for much longer before lenders get a contractual say. By the time a cov-lite borrower trips anything, the situation is often already severe, which compresses the time available to negotiate and pushes more situations toward aggressive out-of-court maneuvers.</p>`,
  },
  {
    title: 'Baskets, Restricted Subs, and Guarantees',
    content: `<p>Three document concepts power almost every modern liability management transaction. Understand them here and the LMEs module will click.</p>

<h4>Baskets and Capacity</h4>
<p>Credit agreements grant permission to do otherwise-restricted things up to limits called baskets: debt baskets (how much new debt), lien baskets (how much can be secured), restricted-payment baskets (how much can flow to equity or junior creditors), and investment baskets (how much can be invested in or moved to subsidiaries). Some are fixed dollar amounts, some grow with EBITDA or as a ratio, and some build up over time based on retained earnings. Calculating remaining basket capacity is real analyst work and beyond interview scope, but the concept is essential: baskets are the levers a company pulls to create runway or execute an aggressive transaction, and reading them correctly lets you predict (or block) what the company is about to do.</p>

<h4>Restricted vs Unrestricted Subsidiaries</h4>
<div class="key-concept">A company is a parent atop a web of subsidiaries. The credit agreement defines which subsidiaries are <strong>restricted</strong> (bound by the covenants, their assets part of the credit support for existing lenders) and which are <strong>unrestricted</strong> (outside the covenant perimeter). If the documents allow the company to transfer valuable assets to an unrestricted subsidiary, it can then raise new debt secured by those assets, outside the existing lenders' collateral, subordinating the original lenders without their consent. This is the mechanical basis of the drop-down maneuver, and litigation over whether a given transfer was permitted has defined some of the most important recent cases.</div>

<h4>Where the Debt Sits and What Guarantees It</h4>
<p>A point that trips people up: debt is issued out of a specific legal entity, and a claim against one entity is not automatically a claim against another. If the operating assets sit in subsidiaries but the debt is issued at the holding company, the holdco lenders only reach the operating value through the subsidiaries' equity (which sits behind the subsidiaries' own creditors) or through guarantees. Whether each subsidiary guarantees the debt, and whether that guarantee is secured, determines whether a creditor actually reaches the value or is structurally subordinated to it (covered in full in the Structural Sub module).</p>

<div class="takeaway-box"><strong>The three axes of priority:</strong> lien priority (what collateral backs a claim), contractual subordination (what the claim agreed to rank behind), and structural position (where in the entity tree the debt sits). A real read of a capital structure accounts for all three at once. Most students only see the first.</div>`,
  },
];
