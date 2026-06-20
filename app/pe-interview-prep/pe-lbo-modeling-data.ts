export const PE_LBO_MODELING_SECTIONS = [
  {
    title: 'Sources and Uses: Funding the Deal',
    content: `<p>A full LBO model starts with how the deal is paid for. The "sources and uses" table is the foundation: where the money comes from (sources) and what it pays for (uses). The two must balance exactly.</p>

<div class="key-concept">The <strong>uses</strong> side is what you need to fund: primarily the purchase price of the company (enterprise value), plus refinancing any existing debt, plus transaction fees. The <strong>sources</strong> side is how you fund it: the new debt you raise (across the tranches of the capital structure) plus the equity the PE firm contributes. Equity is the plug, you decide how much debt the deal can support, and the PE firm's equity check fills the remaining gap. So in practice: sources of debt are set by what lenders will provide and what the cash flows can carry, and the equity contribution is whatever is left to make sources equal uses. This is the moment the deal's leverage is set, and it directly determines the eventual equity return.</div>

<div class="formula-box">USES = Purchase Price + Refinanced Debt + Fees<br/>SOURCES = New Debt + Sponsor Equity<br/><br/>Sources must equal Uses. Equity = Uses - New Debt (the plug).</div>

<div class="example-box">
<div class="example-label">A simple sources and uses</div>
<p>You buy a company for an enterprise value of 1,000 (uses, ignoring fees for simplicity). Lenders will provide 600 of debt (sources). The PE firm must contribute the rest: 1,000 minus 600 = 400 of equity. That 400 equity check is what the entire return will be measured against at exit.</p>
</div>

<div class="pro-tip">In a modeling test, build sources and uses first and make sure it balances before anything else. It anchors the whole model: the debt drives the interest expense and the debt schedule, and the equity contribution is the denominator of your return. Getting it wrong cascades through everything downstream.</div>`,
  },
  {
    title: 'The Operating Model and the Debt Schedule',
    content: `<p>With the deal funded, the model projects the company forward over the hold period. Two engines drive it: the operating model (how the business performs) and the debt schedule (how the borrowing is paid down).</p>

<div class="key-concept">The <strong>operating model</strong> projects the company's performance year by year: revenue growth, margins, and therefore EBITDA, then down to the cash flow the business generates after interest, taxes, capital expenditures, and working capital needs. This projected free cash flow is the lifeblood of the LBO, because it is what pays down the debt. The key insight: in an LBO you care intensely about <strong>cash generation</strong>, not just accounting profit, because cash is what services and retires the debt. A company that looks profitable but consumes cash (heavy capex, growing working capital) is a worse LBO than one that converts earnings efficiently into cash.</div>

<div class="key-concept">The <strong>debt schedule</strong> tracks the borrowing over the hold: starting balance, interest paid each year, and principal repaid. The crucial mechanic is the <strong>cash flow sweep</strong>: the company's excess free cash flow (after interest and required payments) is used to pay down debt, often mandatorily. So each year, the business generates cash, pays its interest, and sweeps the remainder against the debt balance, which shrinks over time. As the debt falls, interest expense falls too, freeing up even more cash to pay down debt, a virtuous cycle that steadily transfers value from lenders to the equity holders. This deleveraging is one of the three return drivers made concrete in the model. The debt schedule and the operating model are linked: cash flow from operations feeds the sweep, and the falling debt feeds back into lower interest in the operating model.</div>

<div class="takeaway-box">The two engines of an LBO model are the operating model (projecting EBITDA and, crucially, the free cash flow the business throws off) and the debt schedule (tracking interest and using excess cash to sweep down the debt). They are linked, cash flow pays down debt, and falling debt lowers interest, freeing more cash, which is exactly how deleveraging builds equity value over the hold.</div>`,
  },
  {
    title: 'Calculating the Return and the Exit',
    content: `<p>The model culminates in the exit and the return calculation, the answer to "was this a good investment?" It ties the entry, the projections, and the debt paydown into the equity return.</p>

<div class="framework-box"><div class="fw-label">THE EXIT AND RETURN STEPS</div><strong>1. Exit enterprise value:</strong> exit-year EBITDA multiplied by the assumed exit multiple.<br/><strong>2. Exit equity value:</strong> exit enterprise value minus the remaining debt at exit (plus any cash).<br/><strong>3. MOIC:</strong> exit equity value divided by the initial equity contribution.<br/><strong>4. IRR:</strong> the annualized return that the MOIC represents over the hold period.</div>

<div class="key-concept">The return falls out of the same logic as the paper LBO, just with a fully built model behind the numbers. At exit, the enterprise is worth its final EBITDA times the exit multiple; subtract whatever debt remains (which is much lower than at entry, thanks to the sweep) to get the equity value; divide by what the firm originally put in to get the <strong>MOIC</strong> (multiple of invested capital); and annualize that into an <strong>IRR</strong>. Because the debt has been paid down and (ideally) EBITDA has grown, the equity value at exit is far larger than the equity invested, that gap is the firm's profit. A full model lets you flex the assumptions (leverage, growth, exit multiple, hold period) and instantly see the effect on returns, which is how PE firms decide what price they can pay and still hit their target return (often a mid-20s percent IRR or a ~2.5-3x MOIC).</div>

<div class="key-concept">In a <strong>modeling test</strong>, you will often be asked to build this end to end under time pressure, or to solve backward: "what entry multiple lets us hit a 25 percent IRR?" That backward solve is the essence of PE, the return is the constraint, and the price is the output. Practice building the chain cleanly (sources and uses, operating model, debt schedule, returns) and practice flexing it, because interviewers love to ask how the return changes if you add a turn of leverage, grow EBITDA faster, or exit at a lower multiple. Being able to reason through those sensitivities, more leverage raises returns but also risk, multiple expansion helps but should not be relied on, faster deleveraging boosts equity, demonstrates that you understand the model rather than just operate it.</div>

<div class="takeaway-box">The return is the payoff of the whole model: exit EBITDA times the exit multiple gives exit enterprise value, minus remaining debt gives exit equity, divided by the equity invested gives MOIC, annualized into IRR. PE firms target roughly a mid-20s IRR or ~2.5-3x MOIC, and the real skill is working backward, given a required return, what price can we pay, and flexing the drivers to understand the risk.</div>`,
  },
];
