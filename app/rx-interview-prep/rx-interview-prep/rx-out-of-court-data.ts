export const RX_OUT_OF_COURT_SECTIONS = [
  {
    title: 'Why Out-of-Court Is Preferred',
    content: `<p>Out-of-court restructuring means the company and its creditors negotiate a fix without filing for bankruptcy. The appeal is obvious. Bankruptcy is enormously expensive (professional fees alone can run into the tens or hundreds of millions on a large case), slow, public, and damaging to relationships with customers, suppliers, and employees. Vendors demand cash on delivery, customers worry about warranties and continuity, and key employees update their resumes. If the problem can be solved with consent, everyone usually prefers to avoid court.</p>

<div class="key-concept"><strong>The catch is the holdout problem.</strong> Out of court, you generally cannot force a creditor to accept worse terms. You need voluntary agreement, and any single creditor can refuse and demand to be paid in full while everyone else takes a haircut. The more creditors there are and the more dispersed they are, the harder consensus becomes. This tension runs through every out-of-court tool: how do you get enough creditors to agree, and what do you do about the ones who will not.</div>

<div class="framework-box"><div class="fw-label">THE ORGANIZING QUESTION</div>For any situation, ask two things: how much do I need to change the capital structure, and how much consent can I realistically get. A small change with cooperative creditors stays out of court. A comprehensive change that some creditors will fight pushes toward court, where dissenters can be bound.</div>

<p>Out-of-court solutions are cheaper, faster, and quieter, but they require voluntary agreement and cannot bind holdouts. That single limitation explains why so much ingenuity goes into structuring out-of-court deals that pressure creditors to participate.</p>`,
  },
  {
    title: 'Amend-and-Extend (A&E)',
    content: `<p>The simplest tool. The company negotiates with its lenders to amend the credit agreement, most commonly to extend maturities (so the company is not forced to refinance into a hostile market) and to loosen or reset covenants. Usually the lenders get something in return: a higher interest rate, an upfront fee, additional collateral, tighter terms elsewhere, or some amortization.</p>

<div class="example-box">
<div class="example-label">Illustration</div>
<p>A company has a 500 term loan maturing in 12 months and no realistic refinancing market. Rather than face the wall, it offers lenders a two-year extension in exchange for a 150 bps higher spread, a 50 bps consent fee, and a tightened leverage covenant. Lenders who would rather not crystallize a loss at a bad time agree. The company has bought two years of runway. Nothing about the debt load changed.</p>
</div>

<div class="warning-box">An A&amp;E does not reduce the debt. It buys time. It is the right tool when the problem is a near-term maturity or covenant issue at a fundamentally viable company that just needs runway. It is not a fix for genuine over-leverage, because the debt load is unchanged. If the business is structurally impaired, an A&amp;E just delays a bigger restructuring.</div>`,
  },
  {
    title: 'Debt Exchanges and Coercive Exchanges',
    content: `<p>In an <strong>exchange</strong>, the company offers creditors new securities in place of their existing ones. The new securities might have a lower face value (reducing the debt owed, called a discount exchange or debt-for-debt at a haircut), a later maturity, a different coupon, or a different priority. The point is to alter the obligations in a way that improves sustainability. Exchanges are voluntary, so they live or die on participation, and the company often sets a minimum participation threshold below which the deal does not close.</p>

<h4>Coercive Exchanges and Exit Consents</h4>
<p>This is where out-of-court gets sharp-elbowed. Because participation is voluntary, companies design exchanges to pressure creditors into participating and punish holdouts. The classic mechanism is the <strong>exit consent</strong>: as a condition of participating, tendering creditors vote to strip the covenants and protections out of the old debt on their way out. Creditors who refuse to participate are left holding the old debt with its protections gutted, often structurally junior to the new debt the participants received, in a clearly worse position than before. The threat is: join us and get the new, better-protected debt, or stay behind and hold a stripped, structurally inferior instrument.</p>

<div class="key-concept"><strong>Sacred rights vs amendable terms.</strong> Most non-money terms (covenants, definitions, lien provisions) can be amended with a simple or supermajority of holders, while sacred rights (the money terms: principal, interest, maturity) require the consent of each affected holder. Coercive exchanges exploit exactly this gap: they change what a majority can change to disadvantage the minority, without ever touching the minority's untouchable money terms. The minority keeps its principal and coupon but loses every protection around it.</div>

<p>The discipline for a junior banker: when you see an exchange offer, read what the participating holders are being asked to consent to. The covenant stripping is usually where the real coercion lives, not in the headline economics.</p>`,
  },
  {
    title: 'The Out-of-Court Toolkit at a Glance',
    content: `<p>The consensual tools form a rough ladder from least to most transformative. A real situation often combines several: an A&amp;E on the revolver and term loan, plus an exchange to handle the bonds.</p>

<table class="comparison-table">
<tr><th>Tool</th><th>What it does</th><th>Reduces debt?</th><th>Best when</th></tr>
<tr><td>Amend-and-extend</td><td>Pushes maturities, resets covenants</td><td>No</td><td>Near-term wall, viable business, needs time</td></tr>
<tr><td>Covenant waiver / relief</td><td>Cures or suspends a breach</td><td>No</td><td>Temporary performance dip</td></tr>
<tr><td>Par exchange (debt for debt)</td><td>Swaps old debt for new with better terms for the company</td><td>Sometimes (maturity/coupon)</td><td>Maturity or coupon relief without a haircut</td></tr>
<tr><td>Discount exchange</td><td>Swaps old debt for less face value</td><td>Yes</td><td>Genuine over-leverage, creditors accept a haircut</td></tr>
<tr><td>Coercive exchange</td><td>Discount/priority exchange with exit consents stripping holdouts</td><td>Yes</td><td>Need high participation, some holders resist</td></tr>
<tr><td>Liability management (uptier, drop-down)</td><td>Raises priming money or moves assets to advantage a creditor group</td><td>Sometimes</td><td>Loose docs, a majority willing to work with the company</td></tr>
</table>

<p>The further down this ladder you go, the more value shifts and the more contentious the deal, but the more transformation you can achieve without filing.</p>`,
  },
  {
    title: 'Why Creditors Agree to Any of This',
    content: `<p>A reasonable interviewer will ask: why would a creditor ever agree to take a haircut out of court when they could refuse? Several reasons.</p>

<ul>
<li>They may believe the alternative, a freefall bankruptcy, leaves them worse off after fees and value destruction. A modeled in-court recovery of 55 cents net of a year of fees can be worse than a clean 65-cent exchange today.</li>
<li>They may be offered enough of a sweetener (higher rate, better priority, fees, additional collateral) to make participation attractive relative to the risk of holding out.</li>
<li>They may fear being the holdout left behind in a coercive exchange, stripped of covenants and subordinated to the participants.</li>
<li>In a liability management deal, the participating majority is not taking a haircut at all. It is improving its own position at the expense of the excluded minority, so it has every incentive to agree quickly and quietly.</li>
</ul>

<div class="takeaway-box"><strong>The asymmetry of who wins and who loses</strong> is precisely what makes modern liability management transactions so contentious, and why the creditor groups that read the documents fastest and organize first tend to end up on the winning side. The losers are usually the unorganized minority who did not see it coming.</div>

<p>Those transactions (uptiers, drop-downs, double-dips) are the most consequential development in restructuring over the last several years, and they get their own module.</p>`,
  },
];
