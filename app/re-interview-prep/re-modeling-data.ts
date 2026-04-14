export const RE_MODELING_SECTIONS = [
  {
    title: 'The Real Estate Pro Forma',
    content: `<p>The RE pro forma is the equivalent of a 3-statement model in corporate finance, but structured around the unique economics of a property. It projects the property's income, expenses, capital needs, financing, and returns over a defined hold period (typically 5-10 years).</p>

<h4>Revenue Build</h4>

<p>Start from the rent roll. For each tenant, project: base rent (with contractual escalations), reimbursement income (tenant's share of operating expenses in net leases), and any other income (parking, storage, signage, percentage rent). For vacant space and upcoming expirations, project re-leasing timing and terms based on market assumptions.</p>

<p><strong>Gross Potential Rent (GPR):</strong> The total rent if every unit were leased at market rates with 100% occupancy. <strong>Vacancy and credit loss:</strong> Deduct a realistic vacancy factor (typically 3-10% depending on property type and market). <strong>Effective Gross Income (EGI):</strong> GPR minus vacancy plus other income.</p>

<h4>Operating Expenses</h4>

<p>Project each major expense category: property taxes (typically the largest single expense, 1-3% of assessed value depending on jurisdiction), insurance, utilities (for gross leases), maintenance and repairs, property management fee (typically 3-5% of EGI), and general and administrative. Expenses should be grown annually at an inflation-based rate (2-3%) unless specific drivers suggest otherwise (e.g., a property tax reassessment after acquisition).</p>

<h4>NOI</h4>

<p>EGI minus operating expenses. This is the unlevered cash flow from operations. Project NOI annually for the entire hold period.</p>

<h4>Capital Expenditures</h4>

<p>Below NOI, deduct capital expenditures: TI and LC for new leases and renewals, and building capital (roof repairs, HVAC replacement, lobby renovations, etc.). Capex is critical in RE because it can be very lumpy-a building that needs $5M in deferred maintenance in Year 2 has very different cash flow dynamics than one that doesn't. The difference between NOI and CapEx is often called <strong>Net Cash Flow (NCF)</strong> or <strong>Cash Flow Before Financing</strong>.</p>

<h4>Debt Service</h4>

<p>Deduct interest payments and principal amortization to arrive at <strong>levered cash flow (Cash Flow After Financing)</strong>-the cash available to equity investors. RE debt typically has: fixed or floating interest rates, an amortization schedule (often 25-30 year amortization with a 5-10 year balloon maturity), and covenants (DSCR minimums, LTV maximums).</p>

<h4>Exit and Returns</h4>

<p>Project the exit sale price by applying a terminal cap rate to the projected NOI in the exit year. The terminal cap rate is typically 25-50 bps higher than the entry cap rate (a conservative assumption reflecting the property being older at exit). Deduct selling costs (1-2% of sale price) and remaining debt to arrive at equity proceeds. Calculate IRR and equity multiple on all equity cash flows (negative at acquisition, positive from annual levered cash flows and exit proceeds).</p>

<div class="example-box">
<div class="example-label">Simplified Returns Calculation</div>
<p><strong>Acquisition:</strong> $50M property at 6.0% cap rate ($3.0M NOI). Financed with 65% LTV loan ($32.5M debt) at 5.5% interest, 30-year amortization. Equity: $17.5M + $1M closing costs = $18.5M.</p>
<p><strong>Annual levered cash flow (Year 1):</strong> NOI $3.0M − Debt Service ~$2.22M (interest $1.79M + principal $0.43M) − CapEx Reserve $0.3M = ~$0.48M. Cash-on-cash: $0.48M / $18.5M = 2.6%.</p>
<p><strong>NOI growth:</strong> 3% annually. Year 5 NOI = $3.0M × 1.03⁴ ≈ $3.38M.</p>
<p><strong>Exit (Year 5):</strong> Sale at 6.25% cap rate. Value = $3.38M / 6.25% = $54.1M. Minus selling costs of $0.8M and remaining loan balance of ~$30.7M = equity proceeds of ~$22.6M.</p>
<p><strong>Total returns:</strong> ~$2.2M in cumulative cash flow + $22.6M exit proceeds = $24.8M total. MOIC: $24.8M / $18.5M = <strong>1.34x</strong>. IRR: approximately <strong>7-8%</strong>.</p>
<p><em>This is a conservative, core return profile. Value-add strategies (buying below market, renovating, and raising rents) and higher leverage can push returns to 12-20%+.</em></p>
</div>`,
  },
  {
    title: 'The Waterfall Distribution',
    content: `<p>In REPE deals, cash flows and exit proceeds are distributed according to a <strong>waterfall</strong>-a contractual priority of payments between the GP (deal sponsor) and LPs (investors). A typical RE waterfall has four tiers:</p>

<p><strong>Tier 1 - Preferred Return:</strong> LPs receive all distributions until they've earned their preferred return (typically 8-10% annually) on their invested capital.</p>

<p><strong>Tier 2 - Return of Capital:</strong> LPs receive back 100% of their invested capital.</p>

<p><strong>Tier 3 - Catch-Up:</strong> The GP receives distributions until the cumulative split reaches the target promote ratio (e.g., if the GP earns 20% promote, the GP catches up until it has received 20% of total profits).</p>

<p><strong>Tier 4 - Residual Split:</strong> Remaining profits are split (e.g., 80% LP / 20% GP), or the GP's share may increase at higher return thresholds (e.g., 80/20 up to 15% IRR, then 70/30 above 15%, then 60/40 above 20%).</p>`,
  },
];
