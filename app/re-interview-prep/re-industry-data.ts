export const RE_INDUSTRY_SECTIONS = [
  {
    title: 'Why Real Estate Is Its Own Asset Class',
    content: `<p>Real estate finance looks like the rest of finance from a distance and behaves differently up close. The reason is that the underlying asset is a physical, immovable, income-producing thing with a long life, financed mostly with debt, and valued primarily off the cash flow it throws off rather than off earnings multiples. Almost every quirk of the industry traces back to those facts.</p>

<p>A building generates rent. After you pay the costs of running it, what is left is income. That income, divided by a market rate of return called the cap rate, is roughly what the building is worth. Layer debt on top, and the slice of that income left for the owner after the lender is paid is the equity return. That is the entire engine, and everything else (leases, valuation, modeling, the capital stack, the waterfall) is detail hung on that frame.</p>

<div class="key-concept">The mental shift coming from corporate finance: stop thinking in revenue, EBITDA, and earnings multiples, and start thinking in <strong>NOI, cap rates, and cash-on-cash</strong>. A company is valued on a multiple of its earnings and its growth story. A building is valued on the income it produces and the yield an investor demands for that income stream. The income is contractual (leases), the yield is set by the market and by interest rates, and the whole thing is levered heavily, so small moves in either NOI or the cap rate move equity value a lot.</div>

<h4>What Makes It Different</h4>
<ul>
<li><strong>It is heavily levered.</strong> Most deals are financed 50 to 75 percent with debt, far more than typical corporate balance sheets, because the cash flows are stable and the asset is good collateral. Leverage is central, not incidental, so debt terms drive equity returns as much as the asset does.</li>
<li><strong>It is cash-flow valued.</strong> Value is income divided by a yield (the cap rate), not a multiple of accounting earnings. Depreciation is a tax and accounting concept, but it does not reduce the cash a building produces, which is why real estate uses NOI and cash flow rather than net income.</li>
<li><strong>It is local and physical.</strong> Two identical buildings in different submarkets can be worth very different amounts. Supply is constrained by land and entitlements, demand is driven by local employment and population, and you cannot move the asset to a better market.</li>
<li><strong>It is cyclical and rate-sensitive.</strong> Cap rates move with interest rates and capital flows, so values can swing even when a building's income is flat, purely because the yield investors demand changed.</li>
<li><strong>It is tax-advantaged.</strong> Depreciation shelters income, 1031 exchanges defer gains on reinvestment, and REITs avoid entity-level tax by distributing income. Tax structure is part of the return, not a footnote.</li>
</ul>

<div class="pro-tip">If you take one framing into every interview, take this: real estate is a spread business. You buy an income stream at one yield (the going-in cap rate), finance it at a lower cost of debt, improve the income, and ideally sell it at a similar or lower yield. The gap between the yield you buy at, the rate you borrow at, and the yield you sell at is where the equity return is manufactured.</div>`,
  },
  {
    title: 'The Career Paths and How They Differ',
    content: `<p>Real estate finance is not one job. The asset is shared, but the seats around it are genuinely different in what they do day to day, what they get tested on, and what skills they build. Knowing where each fits is the first thing an interviewer wants to hear, because it tells them you understand the industry you are trying to enter.</p>

<table class="comparison-table">
<tr><th>Path</th><th>What they do</th><th>Level of analysis</th></tr>
<tr><td>Real estate private equity (REPE)</td><td>Raise funds, buy/improve/sell properties, manage assets for equity returns</td><td>Asset-level: the building, the deal, the levered return and promote</td></tr>
<tr><td>Real estate investment banking (REIB)</td><td>Advise REITs and operators on M&amp;A, equity and debt raising, asset sales</td><td>Entity-level: the company/REIT, NAV, FFO, capital markets</td></tr>
<tr><td>REIT equity research / public investing</td><td>Analyze and value publicly traded property companies</td><td>Entity-level: FFO multiples, NAV premium/discount, the rates lens</td></tr>
<tr><td>Real estate debt / lending</td><td>Originate and structure mortgages, mezzanine, and construction loans</td><td>Credit: LTV, DSCR, debt yield, downside protection</td></tr>
<tr><td>Development</td><td>Build new property from land through lease-up and stabilization</td><td>Asset-level plus construction, entitlement, and lease-up risk</td></tr>
<tr><td>Brokerage / capital markets advisory</td><td>Broker sales and financings, advise on transactions</td><td>Transaction-level: pricing, marketing, market knowledge</td></tr>
</table>

<div class="key-concept"><strong>The cleanest way to hold the distinction:</strong> REPE and development think at the <strong>asset level</strong>, one building at a time, and live in the levered cash flows, the IRR, and the promote. REIB and REIT research think at the <strong>entity level</strong>, valuing whole companies that own many buildings, and live in NAV, FFO, and capital markets. Debt thinks about <strong>downside</strong>, what happens if the business plan fails and whether the loan still gets repaid. Same asset, three different questions: how much can equity make, what is the company worth, and will the loan get paid back.</div>

<p>This guide builds the shared foundation first (the property, the income, the valuation, the leases, the debt, the modeling, the waterfall), because every path stands on it, then goes deep on the track-specific material: REPE, development, REITs, and REIB each get their own treatment.</p>

<div class="pro-tip">In a "why real estate" or "which path" answer, do not just say you like real estate. Name the seat, say what it actually does, and tie it to a skill you want to build. "REPE because I want to own the full deal, from underwriting the going-in cap rate to structuring the promote and managing the business plan" lands far better than "real estate is tangible."</div>`,
  },
  {
    title: 'The Capital Stack: Who Funds a Deal',
    content: `<p>Every property acquisition or development is funded by a stack of capital, ordered by risk and priority of repayment, exactly like a corporate capital structure but with real-estate names. Understanding the stack is foundational, because returns and risk are defined by where you sit in it.</p>

<table class="comparison-table">
<tr><th>Layer</th><th>Position</th><th>Return profile</th><th>Typical share of cost</th></tr>
<tr><td>Senior debt (mortgage)</td><td>First lien on the property; paid first</td><td>Lowest return, lowest risk; fixed or floating interest</td><td>50 to 75%</td></tr>
<tr><td>Mezzanine debt</td><td>Junior to the mortgage; often secured by the equity interest</td><td>Higher rate than senior; fills the gap above the mortgage</td><td>0 to 15%</td></tr>
<tr><td>Preferred equity</td><td>Behind debt, ahead of common; fixed preferred return</td><td>Equity-like return with priority over common</td><td>0 to 15%</td></tr>
<tr><td>Common equity (LP)</td><td>Last to be paid; absorbs first losses</td><td>Highest potential return; takes the most risk</td><td>10 to 40%</td></tr>
</table>

<div class="key-concept">Value flows up the stack in reverse of risk. When a property produces cash or is sold, the senior lender is paid first, then mezzanine, then preferred equity, then whatever is left goes to common equity. If the deal underperforms, common equity absorbs the loss first and can be wiped out before the debt takes a dollar of impairment. This is the same priority logic as a corporate waterfall, and it is why the equity return is so sensitive to leverage: equity is the residual, geared up by everything senior to it.</div>

<p>The sponsor (the REPE firm or developer) typically contributes a small slice of the common equity and raises the rest from limited partners (LPs), then earns an outsized share of the profits through the promote if the deal performs. That sponsor/LP split is the subject of the waterfall module. For now, hold the stack: senior debt, mezzanine, preferred equity, common equity, from safest and first-paid to riskiest and last-paid.</p>

<div class="pro-tip">A common interview probe: "where would you rather invest in the stack?" There is no single right answer; the point is to reason about the risk-return tradeoff. Senior debt is safe but capped; common equity has the upside but takes first loss; mezz and pref sit in between with structured, higher-yield positions. Tie your answer to a view on the deal's risk.</p></div>`,
  },
];
