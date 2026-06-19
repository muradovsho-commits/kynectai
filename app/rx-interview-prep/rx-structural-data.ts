export const RX_STRUCTURAL_SECTIONS = [
  {
    title: 'Contractual vs Structural Subordination',
    content: `<p>Structural subordination is one of the most important and most misunderstood priority concepts, and it is distinct from contractual subordination. Get the difference crisp, because interviewers use it to separate people who memorized the stack from people who understand it.</p>

<table class="comparison-table">
<tr><th></th><th>Contractual subordination</th><th>Structural subordination</th></tr>
<tr><td>Source</td><td>An agreement (intercreditor or indenture) to rank behind another creditor of the same entity</td><td>Where the debt sits in the corporate tree, independent of any agreement</td></tr>
<tr><td>Example</td><td>Subordinated notes ranking behind senior unsecured notes of the same issuer</td><td>A holdco creditor ranking behind the operating subsidiary's creditors</td></tr>
<tr><td>Driven by</td><td>What the claim agreed to</td><td>Which legal entity issued the claim and where the assets are</td></tr>
<tr><td>Cure</td><td>Renegotiate the contract</td><td>A guarantee from the entity where the assets sit</td></tr>
</table>

<p>Contractual subordination is an explicit agreement to rank lower in right of payment. Structural subordination has nothing to do with any such agreement. It arises purely from where in the corporate structure the debt sits relative to where the assets and operations sit. A claim can be senior and unsubordinated by contract and still be structurally junior to claims that look lower on paper.</p>`,
  },
  {
    title: 'The HoldCo/OpCo Mechanism',
    content: `<p>Picture a parent (HoldCo) that owns an operating subsidiary (OpCo). The real assets and the cash-generating business live at OpCo. Suppose there are two creditors owed the same amount: a lender to OpCo and a lender to HoldCo.</p>

<div class="example-box">
<div class="example-label">Walk the wind-down</div>
<p>OpCo's assets are used first to satisfy OpCo's own creditors. Only after OpCo's creditors are fully paid does any residual value at OpCo flow up to its equity holder, which is HoldCo. The HoldCo lender can only be paid out of whatever value reaches HoldCo, which is the leftover equity value of OpCo plus any assets HoldCo holds directly. If OpCo's assets are worth 100 and OpCo's own creditors are owed 100, nothing flows up to HoldCo, and the HoldCo lender recovers zero, even though its debt was never contractually subordinated to anything.</p>
</div>

<div class="key-concept">Even if the HoldCo lender's debt is labeled senior and is not contractually subordinated, it sits structurally behind every creditor of OpCo, because it is one full layer removed from where the value actually is. The location of debt issuance, not the seniority label, determines the real position. This is why you must always ask: which entity issued this debt, and where do the assets live relative to it.</div>`,
  },
  {
    title: 'Guarantees: Upstream and Downstream',
    content: `<p>This is why guarantees matter enormously. A guarantee gives a creditor a direct claim against an entity it would otherwise reach only indirectly, and it is the cure for structural subordination.</p>

<p>If HoldCo's debt is guaranteed by OpCo, especially on a secured basis, the HoldCo creditor gets a direct claim against OpCo and is no longer structurally subordinated to OpCo's creditors. The guarantee pulls the holdco creditor down to where the assets are.</p>

<table class="comparison-table">
<tr><th>Type</th><th>Who guarantees whom</th><th>What it does</th></tr>
<tr><td>Upstream guarantee</td><td>A subsidiary guarantees the parent's debt</td><td>Cures structural subordination of holdco lenders by giving them a direct claim where the assets sit</td></tr>
<tr><td>Downstream guarantee</td><td>A parent guarantees a subsidiary's debt</td><td>Supports debt issued lower in the structure with the parent's credit</td></tr>
</table>

<div class="warning-box">Without the guarantee, the holdco creditor is structurally junior no matter what the debt is called. When you read a capital structure, you cannot just rank tranches by their seniority labels. You have to ask where each piece of debt is issued and what it is guaranteed by. The guarantee package is part of the capital structure, not a footnote.</div>`,
  },
  {
    title: 'Why It Matters for Analysis',
    content: `<p>A nominally senior holdco note can recover less than a junior-looking opco claim, purely because of structural subordination. Two notes that look identical on a summary cap table can have completely different recoveries depending on which entity issued them and what guarantees back them.</p>

<p>This is also why drop-down transactions (in the LMEs module) are so damaging: moving assets from a guarantor entity to a non-guarantor or unrestricted entity can structurally subordinate the original lenders to new debt raised at that entity, even without touching anyone's contractual priority. The assets simply move beyond the reach of the existing liens and guarantees, and the original lenders are left one layer further from the value.</p>

<div class="takeaway-box"><strong>The three axes of priority, restated:</strong> structural position (where the debt sits in the entity tree), contractual subordination (what the debt agreed to rank behind), and lien priority (what collateral backs it). A sophisticated read accounts for all three at once. Most candidates only see lien priority. Showing you see all three is how you stand out.</div>`,
  },
];
