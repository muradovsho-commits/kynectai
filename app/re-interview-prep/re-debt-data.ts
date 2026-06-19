export const RE_DEBT_SECTIONS = [
  {
    title: 'Why Leverage Is Central',
    content: `<p>Real estate is one of the most heavily debt-financed asset classes, and debt is not a sideshow; it is a primary driver of equity returns. Understanding real estate debt is essential for every path, because the loan terms shape the equity return as much as the asset does.</p>

<p>Leverage amplifies returns in both directions. Because equity is the residual after the lender is paid, a given change in property value produces a much larger percentage change in equity value. That is the appeal and the danger.</p>

<div class="example-box">
<div class="example-label">How leverage amplifies</div>
<p>Buy a 10,000,000 property all cash. It rises 10 percent to 11,000,000; your equity return is 10 percent. Now buy the same property with 7,000,000 of debt and 3,000,000 of equity. It rises 10 percent to 11,000,000; after repaying the 7,000,000 loan, your equity is worth 4,000,000, a 33 percent return on the 3,000,000 invested. Leverage turned a 10 percent asset move into a 33 percent equity gain. But the same works in reverse: a 10 percent decline to 9,000,000 leaves equity at 2,000,000, a 33 percent loss, and a roughly 30 percent decline wipes the equity out entirely. More leverage, more amplification, more risk.</p>
</div>

<div class="key-concept">This is why the going-in cap rate versus the interest rate (positive vs negative leverage) matters so much, and why lenders impose limits through LTV, DSCR, and debt yield. Leverage is the engine of real estate equity returns, but it is also what turns a manageable downturn into a wipeout. The art is using enough leverage to drive returns without taking on so much that a normal market dip destroys the equity.</div>`,
  },
  {
    title: 'The Key Debt Metrics',
    content: `<p>Lenders size and underwrite loans using three core metrics. You must know all three cold, including how to compute them and what they protect against.</p>

<div class="formula-box">Loan-to-Value (LTV) = Loan Amount / Property Value<br/><br/>Debt Service Coverage Ratio (DSCR) = NOI / Annual Debt Service<br/><br/>Debt Yield = NOI / Loan Amount</div>

<table class="comparison-table">
<tr><th>Metric</th><th>What it limits</th><th>Typical level</th><th>Protects against</th></tr>
<tr><td>LTV</td><td>Loan size relative to value</td><td>55 to 75%</td><td>Value declines; the equity cushion below the loan</td></tr>
<tr><td>DSCR</td><td>Loan size relative to cash flow</td><td>1.20x to 1.40x+</td><td>Cash-flow shortfalls; income covering debt service</td></tr>
<tr><td>Debt yield</td><td>Loan size relative to NOI directly</td><td>8 to 12%+</td><td>Both, independent of cap rate and interest rate</td></tr>
</table>

<p><strong>LTV</strong> caps the loan as a fraction of value; a 65 percent LTV means 35 percent equity sits below the loan as a cushion. <strong>DSCR</strong> ensures the property's NOI comfortably covers debt service; a 1.25x DSCR means NOI is 1.25 times the debt payment, leaving a 25 percent buffer. <strong>Debt yield</strong> is NOI divided by the loan amount, a measure lenders favor precisely because it is independent of cap rates and interest rates (both of which can be manipulated by market conditions), giving a clean read on how much income backs each dollar of loan.</p>

<div class="key-concept"><strong>Why lenders use debt yield:</strong> LTV depends on value, which depends on the cap rate, which can be aggressive in a frothy market; DSCR depends on the interest rate, which can be temporarily low. Debt yield strips both out and asks simply: how much NOI supports this loan? An 8 percent debt yield means the lender would earn 8 percent on its loan amount if it took the property's income, a floor on safety regardless of where rates or cap rates sit. After the experience of loans that looked fine on LTV and DSCR but were dangerously large relative to actual income, debt yield became a standard guardrail.</div>

<div class="pro-tip">Expect to compute these live. Given NOI, value, loan amount, and rate, you should rattle off LTV, DSCR, and debt yield in seconds. Example: NOI 1,000,000, value 16,000,000, loan 10,000,000 at 6 percent interest-only. LTV = 10/16 = 62.5%. Debt service = 600,000, so DSCR = 1,000,000 / 600,000 = 1.67x. Debt yield = 1,000,000 / 10,000,000 = 10%. Practice until this is reflexive.</div>`,
  },
  {
    title: 'Types of Real Estate Debt',
    content: `<p>Different lenders serve different parts of the market and risk spectrum. Knowing the menu shows you understand how deals actually get financed.</p>

<table class="comparison-table">
<tr><th>Lender / type</th><th>What it finances</th><th>Character</th></tr>
<tr><td>Agency (Fannie/Freddie)</td><td>Multifamily</td><td>Low-cost, long-term, non-recourse; deep and reliable</td></tr>
<tr><td>CMBS (conduit)</td><td>Stabilized commercial</td><td>Loans pooled and securitized; non-recourse, rigid servicing</td></tr>
<tr><td>Banks / life companies</td><td>Stabilized and some transitional</td><td>Relationship lending; life cos favor low-leverage, long-term, high-quality</td></tr>
<tr><td>Debt funds / bridge</td><td>Transitional, value-add</td><td>Higher rate, floating, flexible; finances business plans in progress</td></tr>
<tr><td>Construction lenders</td><td>Ground-up development</td><td>Funded in draws as built; recourse common; highest risk</td></tr>
<tr><td>Mezzanine / preferred equity</td><td>Gap above the senior loan</td><td>Junior, higher cost, fills the stack between senior debt and common equity</td></tr>
</table>

<div class="key-concept"><strong>The match between debt and business plan is the key idea.</strong> A stabilized, fully leased asset takes cheap, long-term, fixed-rate permanent debt (agency, CMBS, life company). An asset mid-transformation (being leased up or renovated) takes flexible, floating-rate bridge or debt-fund financing that tolerates the in-progress cash flow, then refinances into permanent debt once stabilized. A development takes a construction loan funded in draws as the project is built, then a permanent loan at stabilization. Matching the financing to the stage of the business plan is a core competence, and a mismatch (permanent debt on an unstable asset, or short-term floating debt on a long-term hold) is a classic source of trouble.</div>`,
  },
  {
    title: 'Structural Terms That Matter',
    content: `<p>Beyond pricing and sizing, several structural terms shape the risk and the equity return, and interviewers test whether you know them.</p>

<ul>
<li><strong>Fixed vs floating rate.</strong> Fixed-rate debt locks the cost for the term, insulating the borrower from rate moves. Floating-rate debt (a benchmark like SOFR plus a spread) moves with rates, so a borrower's debt service rises when rates rise, a major source of distress when rates climbed. Floating-rate borrowers often buy a <strong>rate cap</strong>, a derivative that caps the benchmark, to limit the damage; the cost of those caps spiked as rates rose.</li>
<li><strong>Recourse vs non-recourse.</strong> Non-recourse debt is secured only by the property; if it fails, the lender takes the asset but cannot pursue the sponsor's other assets (subject to standard carve-outs for fraud, known as bad-boy carve-outs). Recourse debt lets the lender pursue the borrower personally, common in construction and smaller bank loans. Sponsors strongly prefer non-recourse, which caps their downside at the equity in the deal.</li>
<li><strong>Amortization vs interest-only.</strong> Amortizing loans pay down principal over time, building equity but lowering cash flow; interest-only loans pay only interest, maximizing current cash flow and the cash-on-cash return but leaving the full principal due at maturity. IO is common in the early years of value-add deals to preserve cash flow.</li>
<li><strong>Maturity and refinancing risk.</strong> The loan term creates a refinancing event; if rates have risen or value has fallen at maturity, the borrower may be unable to refinance the full balance and must inject equity or sell. This <strong>maturity wall</strong> is a central source of stress, especially for floating-rate bridge loans on business plans that did not pan out.</li>
</ul>

<div class="key-concept">These terms are not fine print; they determine the downside. Non-recourse and a rate cap limit how badly a deal can hurt the sponsor. Interest-only juices the cash-on-cash return but builds no equity cushion. A near-term floating-rate maturity in a higher-rate world is exactly the setup that turned many otherwise-fine assets into problems. When you evaluate a financing, you are really evaluating how much the structure protects the equity if the business plan slips.</div>

<div class="pro-tip">If asked "what financing would you put on this deal," reason from the business plan: stabilized and long-hold points to fixed-rate permanent debt; value-add over a few years points to floating-rate bridge with a rate cap and interest-only, sized to a debt yield the asset can support; ground-up points to a construction loan. Matching structure to plan, and naming the downside protections, is the answer.</div>`,
  },
];
