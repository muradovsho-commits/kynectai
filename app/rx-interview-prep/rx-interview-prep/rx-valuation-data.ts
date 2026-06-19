export const RX_VALUATION_SECTIONS = [
  {
    title: 'Why Valuation Decides Everything',
    content: `<p>In M&amp;A, valuation tells a buyer what to pay. In restructuring, valuation decides who gets paid. The enterprise value of the reorganized business determines how far down the capital structure value reaches, which tranche is the fulcrum, who owns the company after emergence, and whether equity gets a tip or gets wiped. A small swing in EV can move ownership of the entire company from one creditor group to another, which is why valuation is the most fiercely contested issue in most cases.</p>

<div class="key-concept">Senior creditors argue for a low valuation (value breaks above the juniors, so seniors capture more of the new equity). Junior creditors argue for a high valuation (value reaches their tranche, so they get a recovery and a share of ownership). Equity argues for the highest valuation of all, because only a high value leaves anything for them. Each side hires its own valuation experts, and the court often lands somewhere in between.</div>

<p>So when you value a distressed company, you are not producing a single number for a transaction. You are producing the input that decides the distribution of value across every claimant, and you usually produce a <strong>range</strong> and test how recoveries move across that range.</p>`,
  },
  {
    title: 'Going-Concern vs Liquidation Value',
    content: `<p>You value a distressed company two ways, and the comparison matters.</p>

<table class="comparison-table">
<tr><th></th><th>Going-concern value</th><th>Liquidation value</th></tr>
<tr><td>What it is</td><td>The business as a continuing operation</td><td>Selling the assets piecemeal</td></tr>
<tr><td>How you get it</td><td>Comparable companies and a discounted cash flow on projected cash flows</td><td>Asset-by-asset recovery estimates, often with forced-sale discounts</td></tr>
<tr><td>Usually</td><td>Higher, because a functioning business has value beyond its hard assets</td><td>Lower, because you lose the operating whole and sell into a discount</td></tr>
<tr><td>Role</td><td>The basis for a reorganization</td><td>The legal floor (best-interests test) and the basis for liquidation</td></tr>
</table>

<div class="framework-box"><div class="fw-label">DECISION RULE</div>If going-concern value exceeds liquidation value, reorganize (or sell as a going concern). If liquidation value exceeds going-concern value, the business is worth more dead than alive, and liquidation is the value-maximizing path. Liquidation value also sets the floor through the best-interests test: no creditor can be forced to accept less than they would get in a hypothetical Chapter 7.</div>

<p>This comparison is a standard interview question. The instinct to build is: a going concern is normally worth more, so reorganization is usually the default, but you always check liquidation value because it is both the floor and the fallback.</p>`,
  },
  {
    title: 'EBITDA Quality and the Multiple',
    content: `<p>Because the going-concern valuation runs off EBITDA times a multiple (and a DCF off projected cash flow), the EBITDA number and the multiple are where the valuation fight actually happens.</p>

<p>Distressed companies frequently present adjusted or pro forma EBITDA loaded with add-backs: one-time charges, restructuring costs, and optimistic run-rate cost-savings or synergy assumptions that flatter the number. A core analytical skill is scrutinizing those adjustments and forming a view of <strong>normalized, sustainable EBITDA</strong>, the number the business can actually produce on a durable basis.</p>

<div class="key-concept">The incentives map directly onto the EBITDA fight. A debtor (and the junior creditors hoping value reaches them) wants an aggressive EBITDA and a high multiple, because EBITDA times multiple equals enterprise value, and a higher EV reaches further down the stack. Senior creditors want a conservative EBITDA and a low multiple, because a lower EV breaks higher and hands them more of the new equity. The same is true of the multiple: which comps you pick, and whether you use a trough or mid-cycle multiple, swings the answer materially.</div>

<div class="example-box">
<div class="example-label">How sensitive it is</div>
<p>Suppose normalized EBITDA is argued between 90 (seniors) and 110 (juniors), and the multiple between 5.5x and 6.5x. That is an EV range of about 495 (90 x 5.5) to 715 (110 x 6.5). On total debt of, say, 650, the low end leaves the senior unsecured notes deeply impaired and equity worthless, while the high end might fully cover the unsecured notes and leave a sliver for equity. Same company, completely different outcomes, driven entirely by two contested assumptions.</p>
</div>`,
  },
  {
    title: 'Fresh-Start Accounting and NOLs',
    content: `<p>Two points round out distressed valuation, mostly for awareness rather than mechanics.</p>

<p><strong>Fresh-start reporting.</strong> When a company emerges from Chapter 11, it generally applies fresh-start accounting: the reorganized entity restates its assets and liabilities at fair value as of emergence, essentially starting a new accounting basis. The reorganized company's financials are reset, so post-emergence statements are not directly comparable to pre-filing ones. You do not need the mechanics for an interview, just the awareness.</p>

<p><strong>Net operating losses (NOLs).</strong> Distressed companies often have large NOLs because they have been losing money. NOLs are a tax asset: they can shelter future taxable income, which is valuable. But their use after an ownership change (which a restructuring usually triggers, since the fulcrum creditors become the new owners) is limited by tax rules designed to stop trafficking in loss companies. Preserving NOLs can influence how a restructuring is structured. Again, awareness is enough: NOLs are a real asset, and a change of control can restrict them.</p>

<div class="takeaway-box"><strong>What to carry into the interview:</strong> distressed valuation is a contested range, not a point estimate; going concern vs liquidation sets the reorganize-or-liquidate decision and the legal floor; and the EBITDA number plus the multiple are where the fight over who owns the company is really fought.</div>`,
  },
];
