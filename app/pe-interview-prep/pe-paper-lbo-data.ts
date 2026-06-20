export const PE_PAPER_LBO_SECTIONS = [
  {
    title: 'What a Paper LBO Is and Why It Matters',
    content: `<p>The paper LBO is the single most common technical exercise in PE interviews. You are asked to work through a simplified leveraged buyout by hand, no Excel, often no calculator, talking through each step while arriving at an approximate return. It terrifies candidates and rewards the prepared, because it is entirely learnable through method and practice.</p>

<div class="key-concept">A paper LBO tests whether you truly understand how an LBO creates returns, not whether you can build a spreadsheet. The interviewer gives you a few assumptions (an entry multiple, some leverage, a growth rate, an exit multiple, a hold period) and asks you to compute the approximate equity return (usually the MOIC, the multiple of money, and sometimes a rough IRR). What they are really checking: can you assemble the pieces (entry equity, growth in EBITDA, debt paydown, exit equity) in the right order and do the arithmetic calmly out loud? It is the LBO concept made concrete, and doing one cleanly signals that you genuinely grasp the mechanics rather than having memorized definitions.</div>

<div class="framework-box"><div class="fw-label">THE PAPER LBO STEPS</div><strong>1. Entry:</strong> compute the purchase price (entry EBITDA x entry multiple), split it into debt and equity. Your equity invested is the price minus the debt.<br/><strong>2. Project EBITDA:</strong> grow EBITDA over the hold period using the given growth rate.<br/><strong>3. Project debt paydown:</strong> estimate the cash flow generated over the hold and how much debt gets repaid.<br/><strong>4. Exit:</strong> compute the exit enterprise value (exit EBITDA x exit multiple), subtract the remaining debt to get exit equity value.<br/><strong>5. Return:</strong> divide exit equity by entry equity for MOIC; translate to an approximate IRR.</div>

<div class="pro-tip">Always narrate every step out loud and write down the key numbers as you go (entry equity, exit EBITDA, remaining debt, exit equity). The interviewer is grading your structure and composure as much as the final number. A calm, organized walk-through that lands near the right answer beats a silent scramble to an exact one.</div>`,
  },
  {
    title: 'A Full Worked Paper LBO',
    content: `<p>Here is a complete paper LBO with clean, interview-style numbers. Follow how each step builds on the last, this is the template you will reuse.</p>

<div class="example-box">
<div class="example-label">The assumptions</div>
<p>A company has <strong>100 of EBITDA</strong>. You buy it at a <strong>10x</strong> entry multiple, funded with <strong>60 percent debt</strong>. EBITDA grows <strong>10 percent per year</strong> for a <strong>5-year</strong> hold. You exit at <strong>10x</strong> (same multiple). Assume the company's cash flow pays down a total of <strong>200 of debt</strong> over the five years. What is the return?</p>
</div>

<div class="example-box">
<div class="example-label">Step 1 - Entry</div>
<p>Purchase price (enterprise value) = 100 EBITDA x 10 = <strong>1,000</strong>. Debt = 60 percent x 1,000 = <strong>600</strong>. Equity invested = 1,000 minus 600 = <strong>400</strong>.</p>
</div>

<div class="example-box">
<div class="example-label">Step 2 - Grow EBITDA</div>
<p>EBITDA grows 10 percent per year for 5 years. Roughly, 100 x (1.1 to the 5th). 1.1 to the 5th is about 1.61, so exit EBITDA is about <strong>161</strong>. (In an interview you can approximate: 10 percent for 5 years is a bit over 60 percent total growth, so ~160.)</p>
</div>

<div class="example-box">
<div class="example-label">Step 3 - Pay down debt</div>
<p>Starting debt was 600. Over the hold, 200 of debt is repaid from cash flow. Remaining debt at exit = 600 minus 200 = <strong>400</strong>.</p>
</div>

<div class="example-box">
<div class="example-label">Step 4 - Exit</div>
<p>Exit enterprise value = exit EBITDA 161 x 10 = <strong>1,610</strong>. Subtract remaining debt of 400. Exit equity value = 1,610 minus 400 = <strong>1,210</strong>.</p>
</div>

<div class="example-box">
<div class="example-label">Step 5 - The return</div>
<p>MOIC = exit equity / entry equity = 1,210 / 400 = about <strong>3.0x</strong>. So you roughly tripled your money over 5 years. Notice all three drivers contributed: EBITDA grew from 100 to 161, debt fell from 600 to 400 (paydown), and the multiple was flat (no multiple expansion here).</p>
</div>`,
  },
  {
    title: 'From MOIC to IRR, and Doing It Fast',
    content: `<p>The last skill is converting that multiple of money into an approximate annual return (IRR), and doing the whole thing quickly under pressure. Both are pattern-recognition tasks you can drill.</p>

<div class="key-concept"><strong>MOIC tells you how many times you multiplied your money; IRR tells you the annualized rate that produced it.</strong> You do not compute IRR precisely by hand, you use rules of thumb that map a MOIC over a hold period to an approximate IRR. The most useful anchors to memorize: over a <strong>5-year</strong> hold, roughly a 2x MOIC is about a 15 percent IRR, 2.5x is about 20 percent, and 3x is about 25 percent. Over a <strong>3-year</strong> hold the same multiples imply higher IRRs (you got there faster), and over longer holds, lower IRRs. So in the worked example, ~3x over 5 years is roughly a <strong>25 percent IRR</strong>, a strong PE return. Knowing these MOIC-to-IRR anchors lets you finish a paper LBO with a credible annualized figure instead of stalling.</div>

<div class="formula-box">Rule-of-thumb IRR anchors (5-year hold):<br/>2.0x MOIC = ~15% IRR<br/>2.5x MOIC = ~20% IRR<br/>3.0x MOIC = ~25% IRR<br/>4.0x MOIC = ~32% IRR<br/><br/>(The "Rule of 72" also helps: doubling in 5 years = ~14-15% IRR, since 72/5 is ~14.)</div>

<div class="key-concept">To do paper LBOs <strong>fast</strong>, lean on the mental-math habits that matter most here: use clean round numbers, approximate growth (10 percent for 5 years is roughly 60 percent total, so multiply by ~1.6), and keep a running written tally of the four numbers that matter (entry equity, exit EBITDA, remaining debt, exit equity). The arithmetic is deliberately kept simple in interviews; the challenge is sequencing and composure, not hard computation. The more paper LBOs you work, the more the structure becomes automatic, until you can set up entry, growth, paydown, exit, and return almost reflexively, which is exactly the fluency interviewers are looking for.</div>

<div class="takeaway-box">Finish every paper LBO by converting MOIC to an approximate IRR using the memorized anchors (3x over 5 years is about 25 percent). Drill the full sequence, entry equity, grow EBITDA, pay down debt, exit equity, MOIC, IRR, until it is reflexive. The math is intentionally clean; what is being tested is whether you can structure it calmly and out loud, so practice enough that the structure never leaves you.</div>`,
  },
];
