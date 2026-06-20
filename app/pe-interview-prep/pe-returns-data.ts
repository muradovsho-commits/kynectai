export const PE_RETURNS_SECTIONS = [
  {
    title: 'IRR vs MOIC: The Two Return Metrics',
    content: `<p>PE measures returns two ways, and you must understand both, their difference, and when each matters, because interviewers probe the distinction constantly.</p>

<div class="key-concept"><strong>MOIC (multiple of invested capital) tells you how much you multiplied your money; IRR tells you the annualized rate of return.</strong> MOIC is simply exit equity divided by invested equity, a 3.0x MOIC means you tripled your money, full stop, with no reference to time. IRR is the time-sensitive annualized return: tripling your money in 3 years is a far higher IRR than tripling it in 7 years, even though both are 3.0x MOIC. So MOIC captures the <em>magnitude</em> of the gain while IRR captures the <em>speed</em>. They can disagree: a quick 1.5x can have a higher IRR than a slow 2.5x. Both matter to LPs, MOIC because absolute dollars of profit matter, IRR because the speed of compounding matters, which is why PE firms report and are judged on both.</div>

<div class="example-box">
<div class="example-label">When the two metrics diverge</div>
<p>Deal A: invest 100, get back 200 in 2 years. MOIC = 2.0x; IRR is about 41 percent (very fast). Deal B: invest 100, get back 300 in 8 years. MOIC = 3.0x; IRR is about 15 percent (slower). Deal B multiplied the money more (higher MOIC), but Deal A compounded faster (higher IRR). Which is "better" depends on whether you care about total profit or speed, and on what you can do with the money afterward. This tension is why both metrics are always quoted together.</p>
</div>

<div class="key-concept">A subtle but important point interviewers love: <strong>IRR can be gamed by timing, while MOIC cannot.</strong> Because IRR rewards speed, a firm can flatter its IRR by returning capital quickly (for example, through early dividend recaps or using a credit line to delay calling LP capital), even if the total profit (MOIC) is unchanged or modest. This is why sophisticated LPs look at MOIC alongside IRR, MOIC is harder to manipulate and reflects the real multiple of money returned. Understanding that IRR is time-sensitive and therefore timing-sensitive, while MOIC is a pure multiple, shows a level of nuance that stands out.</div>`,
  },
  {
    title: 'The Value Creation Bridge',
    content: `<p>The value creation bridge is the analytical centerpiece of how PE thinks about returns: it decomposes the total equity gain into the three drivers, showing exactly where the money came from. Being able to explain it is a strong signal of real PE understanding.</p>

<div class="key-concept">The <strong>value creation bridge</strong> breaks the increase in equity value from entry to exit into three contributions: <strong>EBITDA growth</strong> (how much of the gain came from the business earning more), <strong>multiple expansion or contraction</strong> (how much came from selling at a different multiple than you paid), and <strong>debt paydown / deleveraging</strong> (how much came from reducing the debt over the hold). Together these three account for the entire change in equity value. The bridge is powerful because it tells you <em>why</em> a deal made (or lost) money, and it lets a firm judge the quality of a return: a deal that earned its return through EBITDA growth is a better, more repeatable result than one that relied on a lucky multiple expansion. PE firms use the bridge both to underwrite deals (projecting where return will come from) and to review them afterward (attributing where it actually came from).</div>

<div class="example-box">
<div class="example-label">A worked value creation bridge</div>
<p>Entry: buy at 100 EBITDA x 10 = 1,000 EV, with 600 debt and 400 equity. Exit (5 years): EBITDA grew to 150, exit multiple still 10, so EV = 1,500; debt paid down to 350, so equity = 1,150. Total equity gain = 1,150 minus 400 = 750. Now attribute it: <strong>EBITDA growth</strong> contributed 50 of EBITDA x 10 multiple = 500 of EV gain; <strong>multiple change</strong> contributed 0 (multiple was flat); <strong>debt paydown</strong> contributed 250 (debt fell from 600 to 350). 500 + 0 + 250 = 750, the full gain. This deal was driven by operational growth and deleveraging, with no reliance on multiple expansion, the hallmark of a high-quality return.</p>
</div>

<div class="pro-tip">If asked "where did the returns come from?" on any deal, structure the answer as a value creation bridge: how much from EBITDA growth, how much from multiple change, how much from debt paydown. And add the quality judgment, returns driven by EBITDA growth are more sustainable and repeatable than those driven by multiple expansion, which signals you evaluate returns the way a PE professional does.</p></div>`,
  },
  {
    title: 'What Good Returns Look Like',
    content: `<p>Finally, you should know roughly what returns PE targets and achieves, so you can speak credibly about whether a deal or fund is good.</p>

<div class="key-concept">At the <strong>deal level</strong>, PE firms typically underwrite to a target of roughly a <strong>20-25 percent IRR</strong> and a <strong>2.5-3.0x MOIC</strong> over a hold of about five years. Those are the rough hurdles a single buyout is expected to clear to be worth doing. At the <strong>fund level</strong>, returns are diluted by fees, by deals that underperform, and by the J-curve, so net returns to LPs are lower than the headline deal targets, a strong fund might deliver a net IRR in the mid-teens to low-20s and a net MOIC around 2x. The gap between gross (deal-level) and net (LP-level) returns is an important nuance: fees and the mix of winners and losers mean the fund's net return to investors is meaningfully below the best individual deals. Knowing these benchmarks lets you sanity-check any return figure and discuss performance like an insider.</div>

<div class="warning-box">Do not confuse gross and net returns, it is a common slip. Gross (deal-level) returns are before fees and carry; net (LP-level) returns are what investors actually keep after the management fee and the GP's carry are taken out. When someone quotes a fund's returns, always be clear which one they mean, because the difference, several percentage points of IRR, is exactly what the fee structure costs the LPs.</div>

<div class="takeaway-box">Benchmarks to carry: individual deals are underwritten to roughly a 20-25 percent IRR and 2.5-3x MOIC over about five years; fund-level net returns to LPs are lower (mid-teens to low-20s IRR, ~2x net MOIC) because of fees, carry, and the mix of outcomes. Always distinguish gross deal returns from net LP returns. With the value creation bridge plus these benchmarks, you can both explain where returns come from and judge whether they are any good.</div>`,
  },
];
