export const RE_DEVELOPMENT_SECTIONS = [
  {
    title: 'The Development Process',
    content: `<p>Development is building new property from raw or underused land through to a stabilized, income-producing asset. It is the highest-risk, highest-return strategy in real estate, because you are creating an asset rather than buying an existing income stream, taking on entitlement, construction, and lease-up risk that a stabilized buyer never touches. The process runs through distinct phases, each with its own risk.</p>

<div class="framework-box"><div class="fw-label">THE DEVELOPMENT PHASES</div><strong>Site control &amp; acquisition:</strong> secure the land, often via an option while feasibility is tested.<br/><strong>Entitlement:</strong> obtain zoning, permits, and approvals to build the intended project. The riskiest, least controllable phase; timelines are uncertain and outcomes are not guaranteed.<br/><strong>Design &amp; pre-construction:</strong> finalize plans, budget, and contractor; line up construction financing.<br/><strong>Construction:</strong> build the project, funded by a construction loan drawn down in stages, exposed to cost overruns and delays.<br/><strong>Lease-up:</strong> fill the empty building with tenants; the property earns little until occupancy ramps.<br/><strong>Stabilization &amp; exit:</strong> reach stabilized occupancy, then refinance into permanent debt or sell.</div>

<div class="key-concept"><strong>Development risk is front-loaded and sequential.</strong> Entitlement risk (will you get approval to build, and when) is the hardest to control and can kill or delay a project before a shovel hits the ground, which is why developers often tie up land with an option rather than buying it outright until entitlement looks likely. Construction risk (cost overruns, delays, labor and materials) follows. Lease-up risk (will tenants come, at what rent, how fast) comes last, and the project generates almost no income until lease-up succeeds, so the developer carries the cost of capital through a long period with no offsetting revenue. Each phase must clear before the next, and the equity is exposed the whole way.</div>`,
  },
  {
    title: 'The Development Pro Forma and Yield on Cost',
    content: `<p>The development pro forma differs from an acquisition model because there is no in-place income; instead you budget total project cost and project the stabilized NOI the finished asset will produce, then test whether the value created exceeds the cost and risk.</p>

<div class="formula-box">Total Project Cost = Land + Hard Costs + Soft Costs + Financing Carry<br/><br/>Yield on Cost = Stabilized NOI / Total Project Cost<br/><br/>Development Spread = Yield on Cost - Market Cap Rate</div>

<p><strong>Hard costs</strong> are the physical construction (materials, labor, sitework). <strong>Soft costs</strong> are the non-physical costs (architecture, engineering, permits, legal, marketing). <strong>Financing carry</strong> is the interest on the construction loan during the build, when there is no income to pay it. Summed, these give total project cost, the denominator of yield on cost.</p>

<div class="key-concept"><strong>The development spread is the entire economic justification for building.</strong> You compare the yield on cost (the unlevered yield you create by building) to the market cap rate (the yield at which the finished, stabilized asset would trade). If you build to a 7 percent yield on cost and the stabilized asset trades at a 5.5 percent cap rate, the spread is 150 basis points, and that spread, capitalized, is your development profit and your compensation for taking entitlement, construction, and lease-up risk. Developers target a minimum spread (often 150 to 200+ basis points, depending on the sector and risk) to justify building rather than buying. A thin spread means the risk is not worth it; you could buy a finished, de-risked asset for nearly the same effective price. This single comparison drives the go/no-go decision.</div>

<div class="example-box">
<div class="example-label">Worked Example</div>
<p>Land 10,000,000, hard costs 30,000,000, soft costs 6,000,000, financing carry 4,000,000: total project cost 50,000,000. Stabilized NOI projected at 3,500,000. Yield on cost = 3,500,000 / 50,000,000 = 7.0 percent. The finished asset would trade at a 5.5 percent market cap rate, so its value is 3,500,000 / 0.055 = about 63,600,000. Value created: about 13,600,000, a development margin of roughly 27 percent of cost, earned for taking the development risk. If construction costs overran to 56,000,000, yield on cost falls to 6.25 percent and the margin shrinks sharply, which is why cost control is existential in development.</div></div>`,
  },
  {
    title: 'Construction Financing and Key Risks',
    content: `<p>Development financing works differently from acquisition financing, and the differences create the characteristic risks of the strategy.</p>

<p>A <strong>construction loan</strong> is not funded all at once; it is drawn down in stages (draws) as the project is built and costs are incurred, with the lender inspecting progress before releasing each draw. Interest accrues only on the drawn balance, and because there is no income during construction, the interest is usually funded from an <strong>interest reserve</strong> built into the loan (this is the financing carry). Construction loans are often <strong>recourse</strong> to the developer (unlike most stabilized debt), because the lender is financing an unbuilt, income-less project and wants the developer's personal backing. At stabilization, the construction loan is replaced by a <strong>permanent loan</strong> (the take-out), or the asset is sold.</p>

<div class="key-concept"><strong>The financing structure mirrors the risk: short-term, recourse, drawn-as-built debt for the risky construction phase, then long-term permanent debt once the asset is de-risked and producing income.</strong> The dangerous moment is the gap between construction completion and stabilization, or a maturity that arrives before lease-up succeeds: if the project is not yet producing enough NOI to support a permanent loan, or if rates have risen so the take-out is smaller than the construction balance, the developer faces a funding gap and may have to inject equity or sell at a loss. Matching the construction loan's term to a realistic lease-up timeline, with cushion, is essential.</div>

<table class="comparison-table">
<tr><th>Risk</th><th>What can go wrong</th><th>Mitigant</th></tr>
<tr><td>Entitlement</td><td>Approval denied or delayed</td><td>Option the land; do not buy until entitled</td></tr>
<tr><td>Construction cost</td><td>Overruns erode the spread</td><td>Guaranteed-max-price contracts, contingency budget</td></tr>
<tr><td>Schedule</td><td>Delays extend carry, push lease-up into a worse market</td><td>Experienced contractor, schedule cushion</td></tr>
<tr><td>Lease-up</td><td>Slow absorption or lower rents than projected</td><td>Conservative absorption and rent assumptions, pre-leasing</td></tr>
<tr><td>Financing / take-out</td><td>Permanent loan smaller than construction balance at maturity</td><td>Rate cushion, term with lease-up runway, pre-arranged take-out</td></tr>
</table>

<div class="pro-tip">Merchant developers build to sell at stabilization, harvesting the development spread as profit and recycling capital into the next project. Build-to-core developers build and hold the finished asset for long-term income. The distinction comes up in interviews: merchant building maximizes velocity and the development margin; build-to-core trades the quick profit for a stabilized, lower-risk income asset at an attractive basis (your cost rather than a market price).</div>`,
  },
];
