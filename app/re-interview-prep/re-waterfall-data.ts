export const RE_WATERFALL_SECTIONS = [
  {
    title: 'Why the Waterfall Exists',
    content: `<p>Almost every institutional real estate deal is a partnership between a <strong>sponsor</strong> (the general partner, or GP, who finds, finances, and runs the deal) and <strong>investors</strong> (the limited partners, or LPs, who supply most of the equity). The GP typically puts in a small slice of the equity, often 5 to 10 percent, and the LPs put in the rest. The waterfall is the agreed set of rules for how profits are split between them, and it is engineered so the GP only earns an outsized share after the LPs have first earned a satisfactory return.</p>

<div class="key-concept"><strong>The waterfall is the single most-tested REPE concept, because it is where the sponsor actually makes money and where LP and GP incentives are aligned.</strong> The core idea: the LPs get paid first, up to a minimum return called the preferred return, and only after that threshold is cleared does the GP begin to earn a disproportionate share of the upside, called the promote or carried interest. This structure rewards the sponsor for outperformance while protecting the LPs' downside, so the GP is motivated to maximize the deal's return rather than just collect fees. If you understand nothing else about REPE economics, understand the waterfall.</div>

<p>Profits flow down a series of tiers (hence "waterfall"), each tier filling before value spills to the next. The tiers stack from safest (return of the LPs' capital) to most rewarding for the GP (the highest promote split at the top).</p>`,
  },
  {
    title: 'The Tiers, In Order',
    content: `<p>A standard waterfall has four tiers. Cash flows fill each tier in sequence before moving to the next.</p>

<div class="framework-box"><div class="fw-label">THE FOUR TIERS</div><strong>Tier 1 - Return of capital:</strong> all investors get their invested capital back, pro rata. No one earns a profit split until the equity is returned.<br/><strong>Tier 2 - Preferred return (the "pref"):</strong> the LPs receive a minimum annualized return on their capital, commonly 7 to 9 percent, before the GP shares in profits. The pref is the LPs' hurdle for "satisfactory."<br/><strong>Tier 3 - GP catch-up (when present):</strong> the GP receives a concentrated share (sometimes 100 percent) of the next dollars until the GP has "caught up" to its target promote percentage of total profits above the return of capital.<br/><strong>Tier 4 - Carried interest split (the promote):</strong> remaining profits split on a promoted basis, for example 80 percent to LPs and 20 percent to the GP, often with additional tiers that raise the GP's share as higher IRR hurdles are cleared.</div>

<div class="key-concept"><strong>The promote (carried interest) is the GP's disproportionate share of profits relative to the small capital it contributed.</strong> A GP that put in 10 percent of the equity might earn 20 percent or more of the profits above the pref. That gap, between the GP's capital share and its profit share, is the promote, and it is the primary way sponsors get rich in real estate. It is "carried" because the GP carries an interest in the profits beyond its invested capital. The promote is what aligns the GP with performance: it is worth a lot only if the deal substantially outperforms the pref.</div>

<table class="comparison-table">
<tr><th>Tier</th><th>Who gets paid</th><th>Until</th></tr>
<tr><td>1. Return of capital</td><td>All investors, pro rata</td><td>Invested equity is fully returned</td></tr>
<tr><td>2. Preferred return</td><td>LPs</td><td>LPs hit the pref (e.g. 8% IRR)</td></tr>
<tr><td>3. Catch-up</td><td>GP (concentrated)</td><td>GP reaches its target % of profits</td></tr>
<tr><td>4. Promote split</td><td>Split, e.g. 80/20, with higher tiers</td><td>Distributed; GP share rises at higher hurdles</td></tr>
</table>`,
  },
  {
    title: 'A Worked Waterfall',
    content: `<p>Walking through the numbers is the best way to lock this in, and being able to do it live is a genuine differentiator in a REPE interview.</p>

<div class="example-box">
<div class="example-label">Setup</div>
<p>Total equity invested: 10,000,000. LPs contribute 90 percent (9,000,000); the GP contributes 10 percent (1,000,000). Preferred return: 8 percent. Promote above the pref: 80 percent to LPs, 20 percent to the GP (a single promote tier, no catch-up for simplicity). The deal is held a few years and returns 16,000,000 of total profit distributions on top of the original capital. Walk the waterfall.</p>
</div>

<div class="example-box">
<div class="example-label">Tier by tier</div>
<p><strong>Tier 1 - return of capital.</strong> Return the 10,000,000 invested, pro rata: 9,000,000 to LPs, 1,000,000 to the GP. Remaining profit to distribute: 16,000,000.</p>
<p><strong>Tier 2 - preferred return.</strong> The LPs are owed an 8 percent return on their 9,000,000 before the GP shares. Suppose the accrued pref over the hold totals 2,160,000. Pay that to the LPs. (The GP also typically earns the pref on its 1,000,000; keep it simple and assume a small 240,000 to the GP, so 2,400,000 of pref total.) Remaining: 16,000,000 less 2,400,000 = 13,600,000.</p>
<p><strong>Tier 3 - promote split.</strong> The remaining 13,600,000 splits 80/20. LPs get 80 percent = 10,880,000. The GP gets 20 percent = 2,720,000. This 2,720,000 is the promote: the GP's reward for clearing the pref.</p>
<p><strong>Tally.</strong> LPs total profit: 2,160,000 pref plus 10,880,000 = about 13,040,000 on 9,000,000 invested. GP total profit: 240,000 pref plus 2,720,000 = about 2,960,000 on only 1,000,000 invested. The GP put in 10 percent of the capital but earned roughly 18 to 19 percent of the profits, the promote at work.</p>
</div>

<div class="pro-tip">If asked to walk through a waterfall, narrate the tiers in order and state the principle as you go: capital back first, then the LP pref, then the promoted split where the GP earns its disproportionate share. Even if the arithmetic is approximate, showing you understand the <em>sequence</em> and <em>why it is structured that way</em> (LP downside protection, GP upside incentive) is what the interviewer is testing.</div>`,
  },
  {
    title: 'Hurdles, Catch-Ups, and Why Structure Matters',
    content: `<p>Real waterfalls add refinements that tune the GP and LP split, and interviewers probe whether you understand their purpose.</p>

<p><strong>Multiple hurdle tiers.</strong> Rather than a single promote, waterfalls often have several IRR hurdles, with the GP's share rising as each is cleared. For example: 8 percent pref, then 80/20 up to a 12 percent IRR, then 70/30 up to 15 percent, then 60/40 above that. This escalating structure sharply rewards the GP for exceptional performance while keeping its share modest on merely good deals.</p>

<p><strong>The catch-up.</strong> When present, the catch-up gives the GP a concentrated share (often 100 percent) of the dollars just above the pref, until the GP has earned its target percentage of <em>all</em> profits above the return of capital, not just the profits above the pref. A catch-up makes the promote percentage apply to the whole profit pool rather than only the slice above the hurdle, meaningfully increasing the GP's take. Whether a deal has a catch-up, and how full it is, is a real negotiation point between GP and LP.</p>

<div class="key-concept"><strong>IRR hurdles vs equity-multiple hurdles.</strong> Hurdles can be set on IRR (time-sensitive) or on equity multiple (time-insensitive), and the choice changes incentives. IRR hurdles reward the GP for returning capital quickly, which can push toward early sales. Multiple-based hurdles reward total profit regardless of speed. Sophisticated LPs sometimes prefer multiple hurdles or a blend, to avoid incentivizing a GP to flip assets purely to juice IRR. Understanding that the hurdle metric shapes GP behavior is a high-signal point in an interview.</div>

<div class="mistake-box"><strong>Common confusion:</strong> the preferred return is not the same as the promote, and "preferred equity" in the capital stack is not the same as the "preferred return" in a waterfall. The preferred return (pref) is the LP hurdle inside the equity split. Preferred equity is a separate, debt-like layer of the capital stack that sits between debt and common equity. The words overlap; the concepts are distinct. Keep them straight.</div>`,
  },
];
