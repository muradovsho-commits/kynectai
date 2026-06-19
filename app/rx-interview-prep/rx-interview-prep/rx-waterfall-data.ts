export const RX_WATERFALL_SECTIONS = [
  {
    title: 'How Waterfalls Work',
    content: `<p>The recovery waterfall is the single most important quantitative exercise in restructuring, and the most reliable technical question you will face. You are given an enterprise value and a capital structure, and you distribute the value down the priority stack to determine each tranche's recovery. The mechanics are mechanical once you know the steps, so learn the steps cold and you can run any waterfall they throw at you.</p>

<div class="warning-box">Interviewers do not expect precise arithmetic. They expect you to set up the problem correctly, reason directionally, and produce a sensible approximate answer. Get the structure right and approximate cleanly. State your steps out loud before plugging numbers.</div>

<h4>Step 1: From Enterprise Value to Distributable Value</h4>
<p>Start with enterprise value, the going-concern value of the business (typically from comps and a discounted cash flow). In the simplest interview version, distributable value equals enterprise value and you begin distributing immediately. In a richer version you adjust EV for cash: add excess cash the company holds, add or subtract cash built or burned during the case, and subtract the estate's professional fees and administrative costs. If an interviewer simply tells you there is some amount of excess cash, add it to EV to get distributable value. Usually they want you to ignore these adjustments and treat EV as distributable value.</p>

<h4>Step 2: Build Each Claim, Then Distribute</h4>
<p>Pay each tranche in priority order, top to bottom, until value runs out. Each tranche recovers the lesser of its full claim or whatever value remains when you reach it. The claim is not just face value:</p>
<ul>
<li><strong>Accrued pre-petition interest:</strong> interest from the last coupon paid date to the filing date that was never paid. Apply the tranche rate to the face amount for the elapsed time.</li>
<li><strong>Post-petition interest</strong> (filing date to exit date): payable only to <strong>over-collateralized</strong> secured claims. Test over- vs under-collateralization first.</li>
<li><strong>Deficiency claim:</strong> if a secured claim is under-collateralized, the uncovered portion drops down and is treated as a general unsecured claim, and it gets no post-petition interest.</li>
<li><strong>Unsecured claims</strong> generally accrue pre-petition but not post-petition interest. (Narrow exception: the solvent-debtor exception, heavily litigated, where unsecured creditors of a solvent company can claim post-petition interest. Mention only if relevant.)</li>
</ul>`,
  },
  {
    title: 'Worked Example A: Value Breaks Mid-Stack',
    content: `<div class="example-box">
<div class="example-label">Setup</div>
<p><strong>Distributable value:</strong> 470. <strong>Structure (priority order):</strong> First-lien term loan, face 150, rate 6%, over-collateralized. Senior unsecured notes, face 200, 10% coupon. Subordinated notes, face 150, 7% coupon, subordinated to the senior notes. Assume half a year of accrued pre-petition interest, and half a year of post-petition interest for the over-secured term loan.</p>
</div>

<div class="example-box">
<div class="example-label">Walk the waterfall</div>
<p><strong>Term loan.</strong> Face 150. Pre-petition interest is 6% on 150 for half a year = 4.5. Over-collateralized, so post-petition interest is another 4.5. Total claim 159. Value of 470 easily covers it, so recovery is 100%. Remaining: 470 less 159 = 311.</p>
<p><strong>Senior notes.</strong> Pre-petition interest is 10% on 200 for half a year = 10. No post-petition interest (unsecured). Total claim 210. We have 311 left, so recovery is 100%. Remaining: 311 less 210 = 101.</p>
<p><strong>Subordinated notes.</strong> Pre-petition interest brings the total claim to roughly 160.5. Only 101 of value remains, so recovery is 101 / 160.5, about 63%.</p>
<p><strong>Fulcrum:</strong> the subordinated notes. Everything above recovered in full; the subordinated tranche is only partially covered and would receive the new equity in a reorganization.</p>
</div>

<h4>How Subordination Shifts Value</h4>
<p>Subordination is just a redirection of value. Pretend the senior and subordinated notes were not subordinated and ranked equally as one unsecured pool: total claims 370.5 against 311 of residual value, so both recover about 83.9% (senior gets ~176, sub gets ~135). Now apply the subordination: take value from the subordinated notes and give it to the senior notes until the senior is paid in full. Move about 34 from sub to senior. Senior goes from 176 to 210 (full), sub drops from 135 to 101 (about 63%). Same answer, arrived at by showing the mechanism. This is also why subordinated debt carries a higher coupon: it agreed to absorb losses first.</p>`,
  },
  {
    title: 'Worked Example B: Under-Collateralized and Deficiency Claims',
    content: `<p>The wrinkle interviewers add to separate the prepared from the unprepared is an under-collateralized secured claim. Handle it cleanly and you stand out.</p>

<div class="example-box">
<div class="example-label">Setup</div>
<p><strong>Distributable value:</strong> 200 total, of which a first-lien term loan is secured specifically by collateral worth only 120. <strong>Structure:</strong> First-lien term loan, face 150 (secured by 120 of collateral). Senior unsecured notes, face 100. Assume no accrued interest for simplicity.</p>
</div>

<div class="example-box">
<div class="example-label">Walk the waterfall</div>
<p><strong>Test collateralization.</strong> The 150 first lien is backed by only 120 of collateral, so it is under-collateralized. It splits into a <strong>secured claim of 120</strong> and a <strong>deficiency claim of 30</strong> (the uncovered shortfall), which becomes a general unsecured claim. No post-petition interest, because it is not over-collateralized.</p>
<p><strong>Pay the secured piece.</strong> The 120 secured claim is paid from its 120 of collateral. Recovery on the secured piece: 100%. Remaining distributable value: 200 less 120 = 80, to be shared among all unsecured claims.</p>
<p><strong>Pool the unsecured claims.</strong> The unsecured pool is the senior notes' 100 plus the term loan's 30 deficiency = 130 of claims, against 80 of value. Pro rata recovery: 80 / 130 = about 61.5%.</p>
<p><strong>Total term loan recovery:</strong> 120 (secured, full) plus 61.5% of its 30 deficiency (about 18.5) = 138.5 on a 150 claim, about 92%. <strong>Senior notes recovery:</strong> 61.5% on 100 = 61.5.</p>
</div>

<div class="key-concept">The lesson: a secured claim is not automatically a full recovery. Once collateral runs short, the secured lender becomes a partial unsecured creditor for the shortfall and shares the leftover value pro rata with the bondholders. Always test collateralization before you start distributing.</div>`,
  },
  {
    title: 'Where Would Each Tranche Trade?',
    content: `<p>Distressed debt does not trade at par. It trades at a discount reflecting expected recovery. In Worked Example A you would expect the term loan to trade near par (fully covered), the senior notes near par (full recovery), and the subordinated notes around 63 (reflecting their partial recovery).</p>

<p>There is nuance. Before a filing actually occurs, <strong>optionality</strong> affects trading prices. A tranche might trade slightly above its theoretical recovery because there is some probability the company turns things around, EBITDA improves, and recoveries end up higher. The fulcrum and the tranches just below it carry the most optionality, because they are the ones whose fate swings most on the valuation.</p>

<p>Conversely, debt can trade <em>below</em> its theoretical recovery due to forced selling (institutions and CLOs dumping downgraded paper they are not allowed to hold), illiquidity (wide bid-ask spreads in distressed names), and genuine disagreement over the correct EV estimate. These dislocations are exactly the inefficiencies distressed funds hunt for.</p>

<div class="key-concept">In distress, price stops being a yield calculation and becomes a recovery estimate. A bond trading at 40 is the market signaling it expects roughly 40 cents on the dollar. Your job as an analyst is to test whether that implied recovery is too high or too low by running the waterfall yourself, then act on the gap between your estimate and the market price.</div>`,
  },
  {
    title: 'Equity Value and the Fulcrum',
    content: `<p>When a company's EV is less than its total debt, equity is theoretically worthless. Yet in practice equity almost always retains some positive trading value before a filing. This reflects the <strong>option value</strong> of equity: like a call option, equity's downside is capped at zero but its upside is theoretically unlimited. The more volatile the company's prospects, the more this option is worth. Once the company files, this optionality largely evaporates and equity is almost always cancelled, perhaps receiving a small tip in exchange for not contesting the plan and to grease a faster confirmation.</p>

<div class="key-concept"><strong>The fulcrum security</strong> is the tranche where enterprise value runs out, the claim only partially covered. Everything senior recovers in full and behaves like fixed income. Everything junior is wiped out. The fulcrum itself typically converts into the new equity of the reorganized company, so the fulcrum holders effectively become the new owners. This is why valuation is so contested: a small change in EV can move which tranche is the fulcrum, transferring ownership of the reorganized company from one creditor group to another. A savvy distressed investor buys into the fulcrum at a distressed price to capture both the partial debt recovery and the equity upside.</div>

<div class="takeaway-box"><strong>The whole game in one line:</strong> find where value breaks, buy the claim that breaks it, end up owning the company. That is the bridge from running waterfalls as an advisor to making money as a distressed investor.</div>`,
  },
];
