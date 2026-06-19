export const RE_NOI_SECTIONS = [
  {
    title: 'Building NOI From the Top Down',
    content: `<p>Net operating income is the single most important number in real estate, and the most common technical question in any real estate interview is some version of "walk me through how you get to NOI." You should be able to build it from the top line down without hesitation, and explain why each line is where it is.</p>

<div class="formula-box">Gross Potential Rent (GPR)<br/>less Vacancy &amp; Credit Loss<br/>plus Other Income (parking, laundry, fees, storage)<br/>equals Effective Gross Income (EGI)<br/>less Operating Expenses (taxes, insurance, utilities, management, R&amp;M, payroll)<br/>equals Net Operating Income (NOI)</div>

<p><strong>Gross potential rent</strong> is the rent the property would collect if fully leased at market or in-place rents, the theoretical top line. <strong>Vacancy and credit loss</strong> subtracts the portion you do not actually collect because units or space sit empty or tenants fail to pay. <strong>Other income</strong> adds the non-rent revenue the property generates. The result is <strong>effective gross income</strong>, the revenue you realistically collect. Subtract the <strong>operating expenses</strong> of running the property and you reach <strong>NOI</strong>.</p>

<div class="key-concept"><strong>The two definitional rules that trip people up:</strong> NOI is <strong>before</strong> debt service (it describes the property's earning power independent of how it is financed, so two buyers with different loans value the same building off the same NOI) and <strong>before</strong> capital expenditures, tenant improvements, leasing commissions, and income tax. NOI is an unlevered, pre-capital-cost measure of the property's operating income. That is exactly why it is the basis for valuation: it isolates what the asset itself produces from how a particular owner financed or capitalized it.</div>

<div class="example-box">
<div class="example-label">Worked Example</div>
<p>A 100-unit apartment building. Market rent is 1,500 per unit per month, so GPR is 100 x 1,500 x 12 = 1,800,000. Vacancy and credit loss runs 5 percent, or 90,000. Other income (parking, laundry, pet fees) is 60,000. EGI = 1,800,000 less 90,000 plus 60,000 = 1,770,000. Operating expenses (taxes, insurance, utilities, management, repairs, payroll) total 700,000. NOI = 1,770,000 less 700,000 = 1,070,000.</p>
</div>`,
  },
  {
    title: 'Operating Expenses and the Margin',
    content: `<p>Operating expenses are the recurring costs of running the property. They matter not just for the NOI level but because the split between fixed and variable costs determines how NOI behaves as occupancy moves.</p>

<table class="comparison-table">
<tr><th>Expense</th><th>Character</th><th>Notes</th></tr>
<tr><td>Property taxes</td><td>Largest fixed cost in many markets</td><td>Can reassess on sale, a key underwriting risk</td></tr>
<tr><td>Insurance</td><td>Fixed</td><td>Rising fast in catastrophe-exposed markets</td></tr>
<tr><td>Utilities</td><td>Partly variable</td><td>Depends on who pays, owner or tenant</td></tr>
<tr><td>Property management</td><td>Variable, often a % of EGI</td><td>Typically 2 to 4% of revenue</td></tr>
<tr><td>Repairs &amp; maintenance</td><td>Semi-variable</td><td>Recurring upkeep, distinct from capital expenditures</td></tr>
<tr><td>Payroll</td><td>Mostly fixed</td><td>On-site staff for larger assets</td></tr>
</table>

<div class="key-concept"><strong>Operating expense ratio</strong> (opex divided by EGI) is a quick quality and efficiency check. Multifamily often runs 35 to 50 percent; net-leased industrial or retail can run far lower because the tenant pays most operating costs directly. A high ratio is not automatically bad, but it means NOI is more sensitive to expense growth, and it flags where an operator might create value by cutting costs. Because a chunk of expenses is fixed, NOI exhibits operating leverage: when occupancy and revenue rise, more of each incremental dollar drops to NOI; when revenue falls, NOI falls faster than revenue.</div>

<div class="mistake-box"><strong>Common mistake:</strong> confusing repairs and maintenance (an operating expense, above NOI) with capital expenditures (below NOI). R&amp;M is routine upkeep that keeps the property running, like fixing a leak or servicing an HVAC unit. Capital expenditures are larger, longer-lived investments, like a new roof, new HVAC system, or unit renovations. The line matters because NOI is struck before capex, so misclassifying capex as opex understates NOI and overstates value, and vice versa.</div>`,
  },
  {
    title: 'From NOI to Cash Flow: The Capital Items',
    content: `<p>NOI is not the cash an owner pockets. Below NOI sit the real capital costs of ownership, and these are exactly where inexperienced analysts overstate returns. The bridge from NOI to levered cash flow runs through capital items and debt service.</p>

<div class="formula-box">NOI<br/>less Capital Expenditures (capex)<br/>less Tenant Improvements (TIs)<br/>less Leasing Commissions (LCs)<br/>equals Unlevered Cash Flow<br/>less Debt Service (interest + any principal)<br/>equals Levered Cash Flow (cash flow to equity, pre-tax)</div>

<p><strong>Capital expenditures</strong> are major property investments that extend its life or value: roof, HVAC, structural work, common-area renovations. <strong>Tenant improvements</strong> are the build-out dollars a landlord spends to customize space for a tenant, common in office and retail and often large. <strong>Leasing commissions</strong> are the fees paid to brokers to sign or renew a lease. TIs and LCs are concentrated at lease signing and renewal, which is why lease rollover is so cash-flow intensive in office and retail and so light in net-leased and multifamily product.</p>

<div class="key-concept"><strong>This is the single most important reason a property's reported cash flow is lower than its NOI, and why long-lease, high-rollover-cost sectors like office trade at higher cap rates (lower prices) than their NOI alone would suggest.</strong> Two buildings with identical NOI are not worth the same if one is a net-leased warehouse with almost no capex, TIs, or LCs and the other is a multi-tenant office tower that must spend heavily every time a lease rolls. NOI tells you the operating income; cash flow after capital items tells you what the owner actually keeps. Serious underwriting always looks below NOI.</div>

<div class="example-box">
<div class="example-label">Worked Example</div>
<p>Take the 1,070,000 NOI apartment building from earlier. Annual reserve for capex (replacements, renovations) is 250 per unit x 100 = 25,000. Multifamily TIs and LCs are minimal, call it 0. Unlevered cash flow = 1,070,000 less 25,000 = 1,045,000. Now finance it with a loan carrying 700,000 of annual debt service (interest plus a little principal). Levered cash flow to equity = 1,045,000 less 700,000 = 345,000. That 345,000, divided by the equity invested, is the cash-on-cash return.</p>
</div>

<div class="pro-tip">When an interviewer asks you to "walk through a property's cash flows," do not stop at NOI. Going one level further, to capex, TIs, LCs, and debt service, signals you understand that NOI is a valuation input, not the owner's spendable cash. That distinction is the difference between sounding like a student and sounding like an analyst.</div>`,
  },
  {
    title: 'NOI Growth and the Value It Creates',
    content: `<p>Because value is roughly NOI divided by the cap rate, growing NOI is the most direct lever on value, and most of the real-estate value-creation playbook is ultimately about lifting NOI. It pays to be precise about where NOI growth comes from.</p>

<ul>
<li><strong>Raising rents</strong> to market on rollover, or pushing market rents through demand or renovation.</li>
<li><strong>Cutting vacancy</strong> by leasing up empty space, which raises EGI with little added cost.</li>
<li><strong>Adding other income</strong> (parking, storage, fees, amenities) that flows almost entirely to NOI.</li>
<li><strong>Reducing operating expenses</strong> through better management, energy efficiency, or tax appeals, which drops straight to NOI.</li>
</ul>

<div class="key-concept">The leverage in this is dramatic because of the cap rate. At a 5 percent cap rate, every additional dollar of NOI adds roughly twenty dollars of value (1 divided by 0.05). So a 100,000 increase in NOI, whether from higher rents, lower vacancy, new income, or expense savings, adds about 2,000,000 of value at a 5 cap. This is why operators obsess over NOI: a modest operating improvement, capitalized at a market cap rate, produces an outsized gain in value. It is also why the value-add strategy (buy underperforming, lift NOI, sell at a similar cap) works, and the waterfall and REPE modules build directly on this idea.</div>

<div class="example-box">
<div class="example-label">The capitalization effect</div>
<p>You buy a building at a 6 percent cap rate on 1,000,000 NOI, paying about 16,700,000. Through better management you grow NOI to 1,150,000 and the market still applies a 6 cap. New value is 1,150,000 / 0.06 = about 19,170,000. A 150,000 NOI gain (15 percent) created roughly 2,470,000 of value. If cap rates also compressed to 5.5 percent over your hold, the value would be 1,150,000 / 0.055 = about 20,900,000, layering a valuation tailwind on top of the operating gain.</p>
</div>`,
  },
];
