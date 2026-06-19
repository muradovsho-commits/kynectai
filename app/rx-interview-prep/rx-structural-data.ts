export const RX_STRUCTURAL_SECTIONS = [
  {
    title: 'Contractual vs Structural Subordination',
    content: `<p>Structural subordination is one of the most important and most misunderstood priority concepts, and it is distinct from contractual subordination. Get the difference crisp.</p>

<table class="comparison-table">
<tr><th></th><th>Contractual subordination</th><th>Structural subordination</th></tr>
<tr><td>Source</td><td>An agreement (intercreditor or indenture) to rank behind another creditor of the same entity</td><td>Where the debt sits in the corporate tree, independent of any agreement</td></tr>
<tr><td>Example</td><td>Subordinated notes ranking behind senior unsecured notes of the same issuer</td><td>A holdco creditor ranking behind the operating subsidiary's creditors</td></tr>
<tr><td>Cure</td><td>Renegotiate the contract</td><td>A guarantee from the entity where the assets sit</td></tr>
</table>

<p>Contractual subordination is an explicit agreement to rank lower. Structural subordination has nothing to do with any such agreement. It arises purely from where in the corporate structure the debt sits relative to where the assets and operations sit.</p>`,
  },
  {
    title: 'The HoldCo/OpCo Mechanism',
    content: `<p>Picture a parent (HoldCo) that owns an operating subsidiary (OpCo). The real assets and the cash-generating business live at OpCo. Suppose there are two creditors owed the same amount: a lender to OpCo and a lender to HoldCo.</p>

<p>On a wind-down, OpCo's assets are used first to satisfy OpCo's own creditors. Only after OpCo's creditors are fully paid does any residual value at OpCo flow up to its equity holder, which is HoldCo. The HoldCo lender can only be paid out of whatever value reaches HoldCo, which is the leftover equity value of OpCo plus any assets HoldCo holds directly.</p>

<div class="key-concept">So even if the HoldCo lender's debt is labeled senior and is not contractually subordinated to anything, it sits structurally behind every creditor of OpCo, because it is one full layer removed from where the value actually is. The location of debt issuance, not the seniority label, determines the real position.</div>`,
  },
  {
    title: 'Guarantees: Upstream and Downstream',
    content: `<p>This is why guarantees matter enormously. A guarantee gives a creditor a direct claim against an entity it would otherwise reach only indirectly.</p>

<p>If HoldCo's debt is guaranteed by OpCo (especially on a secured basis), the HoldCo creditor gets a direct claim against OpCo and is no longer structurally subordinated to OpCo's creditors. An <strong>upstream guarantee</strong> (a subsidiary guaranteeing the parent's debt) is what cures the structural subordination of a holdco lender, because it pulls the holdco creditor down to where the assets are. A <strong>downstream guarantee</strong> (a parent guaranteeing a subsidiary's debt) supports debt issued lower in the structure.</p>

<div class="warning-box">Without the guarantee, the holdco creditor is structurally junior no matter what the debt is called. When you read a capital structure, you cannot just rank tranches by their seniority labels. You have to ask where each piece of debt is issued and what it is guaranteed by.</div>`,
  },
  {
    title: 'Why It Matters for Analysis',
    content: `<p>A nominally senior holdco note can recover less than a junior-looking opco claim, purely because of structural subordination. This is also why drop-down transactions are so damaging: moving assets from a guarantor entity to a non-guarantor or unrestricted entity can structurally subordinate the original lenders to new debt raised at that entity, even without touching anyone's contractual priority.</p>

<div class="key-concept">Structural subordination, contractual subordination, and lien priority are three different axes. A sophisticated read of a capital structure accounts for all three at once: where the debt sits (structural), what it agreed to (contractual), and what collateral backs it (lien priority).</div>`,
  },
];
