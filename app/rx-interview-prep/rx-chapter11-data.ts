export const RX_CHAPTER11_SECTIONS = [
  {
    title: 'Why File at All',
    content: `<p>When consent cannot be reached out of court, or when the company needs tools only a court can provide, the company files for bankruptcy. In the United States, operating companies that intend to keep running file for <strong>Chapter 11</strong> (reorganization), as opposed to <strong>Chapter 7</strong> (liquidation). Chapter 11 provides powerful tools unavailable out of court.</p>

<ul>
<li><strong>The automatic stay</strong> halts all collection efforts, lawsuits, and foreclosures the moment the company files. This stops the chaos of creditors racing to grab assets and gives the company breathing room.</li>
<li><strong>Debtor-in-possession (DIP) financing</strong> lets the company borrow new money during the case, with the new lender often granted priority over existing creditors (a super-priority position approved by the court). This solves the liquidity problem a distressed company otherwise cannot solve, because few would lend to a bankrupt company without that priority.</li>
<li><strong>The ability to bind holdouts.</strong> This is the single most important advantage over out-of-court. Through confirmation, the court can approve a plan over the objection of dissenting creditors. A dissenting class can be crammed down if statutory conditions are met.</li>
<li><strong>The ability to reject burdensome contracts and leases</strong>, shed certain liabilities, and sell assets free and clear of liens.</li>
</ul>

<div class="warning-box"><strong>The cost.</strong> Chapter 11 is expensive (professional fees for the company and every major creditor group), slow, and reputationally costly with customers and counterparties. The art of restructuring is matching the tool to the situation: stay out of court if you can get consent, go in if you need to bind holdouts or access the in-court toolkit.</div>`,
  },
  {
    title: 'Pre-Pack, Pre-Arranged, and Freefall',
    content: `<p>There is a spectrum of how much is agreed before filing, and the terminology is frequently tested.</p>

<table class="comparison-table">
<tr><th>Type</th><th>What is done pre-filing</th><th>Speed and character</th></tr>
<tr><td>Pre-packaged (pre-pack)</td><td>Plan negotiated, votes solicited and obtained</td><td>Emerges in weeks; essentially an out-of-court deal that uses the court only to bind holdouts</td></tr>
<tr><td>Pre-arranged (pre-negotiated)</td><td>Agreement in principle on key terms, often via an RSA; votes not yet locked</td><td>Longer than a pre-pack but orderly; completes solicitation in court</td></tr>
<tr><td>Freefall</td><td>Nothing; files first</td><td>Longest, most expensive, most uncertain; the most work for junior bankers</td></tr>
</table>

<div class="key-concept">Ordering to remember, most pre-agreed to least: <strong>pre-pack, then pre-arranged, then freefall</strong>. The more you front-load the negotiation, the faster and cheaper the in-court phase, which is why advisors push to file with as much consensus as possible. A pre-pack works best when creditors are concentrated and cooperative. A freefall happens when the company runs out of runway before reaching a deal, or when creditors are too fragmented or hostile to agree pre-filing.</div>`,
  },
  {
    title: 'Key In-Court Mechanics',
    content: `<p><strong>Restructuring support agreement (RSA).</strong> A contract among the company and consenting creditors committing them to support a particular restructuring, frequently the backbone of a pre-arranged case. It locks in support and reduces execution risk.</p>

<p><strong>The absolute priority rule (APR).</strong> The foundational principle of distribution: senior claims must be paid in full before junior claims or equity receive anything. Value flows strictly down the priority stack. APR is why equity is usually wiped out and why the fight is over enterprise value, which determines how far down the stack value reaches. In practice, parties negotiate around strict APR all the time (junior creditors and equity extract gifts or settlements to avoid a costly fight, and senior creditors agree to share value to buy peace and speed), but the rule is the default the court enforces.</p>

<p><strong>Cramdown.</strong> If a class votes against the plan, the court can still confirm it (cram it down) provided the plan meets statutory fairness tests, including that it does not unfairly discriminate and is fair and equitable, which for a dissenting class generally means it respects absolute priority. Cramdown is the ultimate answer to the holdout problem.</p>

<div class="key-concept"><strong>Voting thresholds.</strong> To approve a plan, each impaired class generally must accept by at least one-half in number of claims voting and two-thirds in dollar amount of claims voting. Contrast with out-of-court, where you often need near-unanimous consent because you cannot bind holdouts. In court a class is bound if it clears the one-half-in-number and two-thirds-in-amount threshold, and even a rejecting class can be crammed down. That gap in required consent is a central reason to go in-court when a comprehensive deal cannot get near-unanimous voluntary support.</div>`,
  },
  {
    title: 'Valuation on Emergence and the Fulcrum',
    content: `<p>A reorganization plan has to decide what the reorganized company is worth, because that valuation determines how far down the capital structure value reaches and therefore who gets what (cash, new debt, and crucially, the new equity of the reorganized company).</p>

<p>The contest over enterprise value is the central battleground of many cases. Senior creditors argue for a <strong>lower</strong> valuation (so value breaks higher and they capture more of the new equity), while junior creditors argue for a <strong>higher</strong> valuation (so value reaches them and they get a recovery). The class whose claim sits right where value breaks is the fulcrum security, and it typically converts into the bulk of the new equity. Identifying the fulcrum is the core analytical act of distressed investing (covered with worked numbers in the Waterfalls module).</p>`,
  },
  {
    title: 'Liquidation as the Floor: Chapter 7 and the Best-Interests Test',
    content: `<p>If a company cannot be reorganized as a going concern, it liquidates. A <strong>Chapter 7</strong> is a straight liquidation: a trustee is appointed, sells the assets, and distributes proceeds down the priority stack. Operating companies usually prefer Chapter 11 because a going concern is almost always worth more than the sum of its liquidated parts, but if the going-concern enterprise value is lower than liquidation value, liquidation is the value-maximizing path.</p>

<div class="key-concept"><strong>The best-interests test</strong> requires that each creditor receive at least as much under the plan as they would in a hypothetical Chapter 7 liquidation. So liquidation value is the worst case a creditor can be forced to accept, and going-concern reorganization value is the upside above it. Comparing the two is a standard piece of restructuring analysis and a natural interview question.</div>

<h4>363 Sales</h4>
<p>A company can sell some or all of its assets during a Chapter 11 through a court-approved sale process (named for the relevant section of the Bankruptcy Code), delivering the buyer assets free and clear of most liens and claims, which attach instead to the sale proceeds. A 363 sale is faster than a full plan of reorganization and is common when the best outcome is to sell the business rather than reorganize it in place. The process typically involves a stalking-horse bidder (an initial bidder whose offer sets a floor and terms) followed by an auction.</p>`,
  },
];
