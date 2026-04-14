export const RE_DEBT_SECTIONS = [
  {
    title: 'Types of RE Debt',
    content: `<p><strong>Senior Mortgage:</strong> First-lien loan secured by the property itself. The most common RE financing. Typical LTV: 50-70%. Sources: banks, insurance companies, CMBS, agency lenders (Fannie Mae, Freddie Mac for multifamily).</p>

<p><strong>Mezzanine Debt:</strong> Junior loan secured by the borrower's equity interest in the property-owning entity (not the property directly). Fills the gap between senior debt and equity. Higher interest rates (8-14%) reflecting higher risk. Typical position: 65-80% of the capital stack.</p>

<p><strong>Preferred Equity:</strong> Structured as equity but functions like debt. Returns are fixed (8-15%) and have priority over common equity. Used when mezzanine debt isn't available or when the borrower needs to maintain a lower debt-to-equity ratio for covenant purposes.</p>

<p><strong>Construction Loans:</strong> Short-term, floating-rate loans that fund new development. Disbursed in stages ("draws") as construction milestones are met. Higher rates and lower LTC (loan-to-cost, typically 55-65%) reflecting development risk. Typically converted to permanent financing upon project stabilization.</p>`,
  },
  {
    title: 'Key Debt Metrics',
    content: `<div class="formula-box">
LTV = Loan Amount / Property Value<br>
DSCR = NOI / Annual Debt Service<br>
Debt Yield = NOI / Loan Amount<br>
LTC = Loan Amount / Total Project Cost (for development)
</div>

<p><strong>LTV (Loan-to-Value):</strong> The loan amount as a percentage of the property's value. Lower LTV = more equity cushion = lower risk for the lender. Typical maximums: 65% for stabilized commercial, 75% for multifamily (agency), 55-65% for construction.</p>

<p><strong>DSCR (Debt Service Coverage Ratio):</strong> NOI divided by annual debt service (interest + principal). A DSCR of 1.25x means the property generates 25% more income than needed to cover debt payments. Lenders typically require minimums of 1.20-1.35x. Below 1.0x means the property can't cover its debt from operations-a red flag.</p>

<p><strong>Debt Yield:</strong> NOI divided by the loan amount. A "lender's cap rate" that measures the lender's return if they foreclosed and took ownership. Minimum thresholds: typically 8-10%. Debt yield has become increasingly important because it doesn't rely on interest rates or amortization assumptions (unlike DSCR and LTV).</p>`,
  },
];
