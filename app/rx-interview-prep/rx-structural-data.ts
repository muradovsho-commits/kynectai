export const RX_STRUCTURAL_SECTIONS = [
  {
    title: 'What Is Structural Subordination?',
    content: `<p>Structural subordination occurs when debt at a parent holding company (HoldCo) is effectively junior to debt at an operating subsidiary (OpCo)-even if both are called "unsecured notes"-because the OpCo debt has a direct claim on the operating assets while the HoldCo debt has only an indirect claim through its equity ownership of the OpCo.</p>

<div class="example-box">
<div class="example-label">Structural Subordination Example</div>
<p><strong>OpCo</strong> has $400M in assets and $300M in unsecured notes. <strong>HoldCo</strong> owns the equity of OpCo and has $150M in unsecured notes and no other assets.</p>
<p>If the company files: OpCo's unsecured notes are paid from OpCo's assets: $300M / $400M → Recovery: 100%. The remaining $100M flows up to HoldCo as the value of its equity in OpCo.</p>
<p>HoldCo's unsecured notes: $100M available from OpCo equity / $150M in claims → Recovery: 66.7%.</p>
<p>The HoldCo notes are <strong>structurally subordinate</strong> to the OpCo notes, even though both are "unsecured." The HoldCo notes are more remote from where the assets reside.</p>
</div>`,
  },
  {
    title: 'Upstream and Downstream Guarantees',
    content: `<p>To mitigate structural subordination, companies issue <strong>guarantees</strong>:</p>

<p>An <strong>upstream guarantee</strong> is when OpCo guarantees HoldCo's debt. This gives HoldCo's creditors a direct claim at the OpCo level (typically an unsecured claim), moving them from being structurally subordinate to being pari passu with OpCo's unsecured creditors. Upstream guarantees are critical for HoldCo debt issuance-without one, few lenders would accept the structural subordination risk.</p>

<p>A <strong>downstream guarantee</strong> is when HoldCo guarantees OpCo's debt. In a simple two-entity structure, this is less meaningful because HoldCo typically has no assets beyond OpCo's equity. But in more complex structures with multiple OpCos, cross-guarantees between entities can significantly affect recovery values.</p>

<p>When analyzing any restructuring, always diagram the organizational structure, note where debt and assets are located, and identify which guarantees are in place. The interplay between structural priority and contractual priority is where many of the most complex (and interesting) restructuring dynamics arise.</p>`,
  },
];
