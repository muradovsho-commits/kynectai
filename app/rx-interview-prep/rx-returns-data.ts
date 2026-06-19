export const RX_RETURNS_SECTIONS = [
  {
    title: 'From Recoveries to Returns',
    content: `<p>Running the waterfall tells you what each tranche <em>recovers</em>. It does not yet tell you what each tranche <em>returns</em>, because return depends on the price you pay to buy the claim today. A tranche that recovers 100% but trades near par is a mediocre investment. A tranche that recovers only 60% but trades at 30 can be a spectacular one. This is the leap from advisor thinking to investor thinking, and it is exactly what creditor-side and distressed-fund interviews probe.</p>

<div class="key-concept">The investing question is never which tranche recovers the most. It is which tranche offers the best return given its price, its coupon, the recovery, and the time to get there. The widest spread between what you pay and what you ultimately collect wins, and it is frequently not the safest tranche.</div>`,
  },
  {
    title: 'MOIC and the IRR Shortcut',
    content: `<p>You will never be expected to compute an exact internal rate of return by hand. The interviewer wants the setup and a directional answer.</p>

<p>Lay out the cash flows for a given tranche: the cash you pay today (face bought times current price) and the cash you receive at exit (recovery on the face plus any accrued interest you collect). Then compute the <strong>multiple of invested capital (MOIC)</strong>: total proceeds divided by price paid. To approximate an annualized return, take the MOIC, subtract one to get the total gain, and divide by the number of years.</p>

<div class="formula-box">MOIC = total proceeds / cost &nbsp;&nbsp;|&nbsp;&nbsp; Approx annual return = (MOIC - 1) / years</div>

<div class="example-box">
<div class="example-label">Worked Example</div>
<p>You buy a bond at a price of 50 (you pay 50 per 100 of face). Through the waterfall it recovers 80, and along the way you collect 10 of accrued interest, for total proceeds of 90, over a two-year hold. MOIC = 90 / 50 = 1.8x. Rough annualized return = (1.8 less 1) / 2 = 0.4, about 40% per year.</p>
</div>

<div class="warning-box">The (MOIC - 1) / years shortcut is simple interest and runs a little high versus the true compounded IRR (a 1.8x over two years is closer to a 34% compounded IRR than 40%). That is fine. Interviewers want the directional number and the clean setup, not the precise figure. If anything, say out loud that the true IRR is a touch lower because of compounding, and you signal that you know what the shortcut is doing.</div>`,
  },
  {
    title: 'Choosing the Tranche',
    content: `<p>The classic case prompt: here is the capital structure and the trading prices, which piece do you buy. Do not just pick the highest recovery. Compare returns.</p>

<div class="example-box">
<div class="example-label">Comparing three tranches (2-year hold, all prices per 100 face)</div>
<p><strong>First-lien term loan:</strong> trades at 95, recovers 100, collects ~6 interest. Proceeds 106, cost 95, MOIC ~1.12x, about 6% per year. Safe, low return.</p>
<p><strong>Senior unsecured notes:</strong> trade at 70, recover 100, collect ~20 interest over the period. Proceeds 120, cost 70, MOIC ~1.71x, about 36% per year. Full recovery bought cheap, with a fat coupon.</p>
<p><strong>Subordinated notes (the fulcrum):</strong> trade at 35, recover 60 plus convert part of the claim into reorg equity worth, say, an extra 15, collect little cash interest. Proceeds ~75, cost 35, MOIC ~2.14x, about 57% per year if the reorg equity performs.</p>
<p><strong>Verdict:</strong> the first lien is the safest and the worst return. The senior notes are the cleanest risk-adjusted trade: full recovery, cheap entry, high coupon. The subordinated notes offer the highest return but only if your higher valuation is right; if EV comes in lower, they could recover far less. The answer depends on conviction in the valuation.</p>
</div>

<div class="key-concept">The reasoning the interviewer wants: the best return usually comes from a cheaply priced tranche with a high coupon and a solid-but-not-guaranteed recovery, not from the bulletproof senior piece trading near par. Articulate the tradeoff between the safe full-recovery trade (senior notes) and the higher-upside fulcrum trade (subordinated notes), and tie your pick to how confident you are in the enterprise value.</div>`,
  },
  {
    title: 'The Fulcrum and Loan-to-Own',
    content: `<p>The fulcrum security deserves its own treatment because it is the single most important concept in distressed investing.</p>

<p>The fulcrum is the tranche where enterprise value runs out, the claim only partially covered. Everything senior to it recovers in full and behaves like fixed income: you get roughly par back, and your return is driven by the price you paid and the coupon. Everything junior to it is wiped out. The fulcrum itself is special because, in a reorganization, it typically converts into the new equity of the reorganized company.</p>

<div class="key-concept"><strong>Loan-to-own</strong> is the strategy built on this. A distressed fund identifies the fulcrum, buys it at a depressed price, and rides it through the restructuring to emerge owning the reorganized business. The fund captures the partial debt recovery and the equity upside, and if the business recovers, the equity is where the real money is. This is why the fulcrum is the most analytically interesting place in the structure and why the valuation fight is really a fight over who owns the company.</div>

<div class="example-box">
<div class="example-label">Why the fulcrum moves</div>
<p>Suppose total debt is 650 and the senior unsecured notes (face 250) sit just below 400 of senior secured debt. If EV is argued at 550, value breaks inside the senior unsecured notes, making them the fulcrum: they recover partially and convert to the new equity. If EV is argued at 700, the senior unsecured notes are fully covered and the fulcrum moves down to the subordinated notes instead. A 150 swing in EV changes which group ends up owning the company. That is why every party fights over valuation, and why pinpointing the fulcrum across a range of EVs is the heart of the analysis.</p>
</div>

<div class="takeaway-box"><strong>The full chain:</strong> build the cap table, estimate the EV range, run the waterfall to find the fulcrum across that range, then compare tranche returns at current trading prices. The best trade is usually the fulcrum if you have conviction in the upside, or the cheapest fully-covered tranche if you want the safer high-teens-to-thirties return without betting on the equity.</div>`,
  },
];
