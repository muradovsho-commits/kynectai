export const PE_LBO_SECTIONS = [
  {
    title: `5.1 Sources & Uses (The Opening Bell)`,
    content: `<p>Every LBO starts with a transaction. The "Sources & Uses" table answers: How much cash do we need, and whose bank account is it coming from?</p>
<h4>The Uses (Where the money goes)</h4>
<ol>
<li><strong>Purchase Equity:</strong> The cost to buy out existing shareholders (Equity Value + Control Premium).</li>
<li><strong>Refinance Existing Debt:</strong> Deals are "Cash-Free, Debt-Free" — you pay off old debt.</li>
<li><strong>Transaction Fees:</strong> IB, legal, and accounting fees (usually 1-2% of deal size).</li>
<li><strong>Financing Fees:</strong> Fees paid to banks to secure the new debt.</li>
</ol>
<h4>The Sources (Where the money comes from)</h4>
<ol>
<li><strong>Senior Secured Debt (Term Loans):</strong> Cheapest debt, secured by assets (usually 2.5x-4.0x EBITDA).</li>
<li><strong>Subordinated/Mezzanine Debt:</strong> More expensive, unsecured, often includes PIK toggle.</li>
<li><strong>Management Rollover:</strong> Existing CEO rolls equity into the new deal.</li>
<li><strong>Sponsor Equity:</strong> The PE firm's cash check. This is the "plug" (Total Uses - All Other Sources).</li>
</ol>
<p><strong>The Golden Rule:</strong> Total Sources MUST exactly equal Total Uses.</p>`
  },
  {
    title: `5.2 The Debt Tranches & Capital Structure`,
    content: `<p>You must understand the hierarchy of debt (The Capital Stack):</p>
<ol>
<li><strong>Revolving Credit Facility (Revolver):</strong> A corporate credit card. Most senior. Drawn only when FCF is negative. Paid off first when cash is available.</li>
<li><strong>Term Loan A (TLA):</strong> From corporate banks. Amortizes evenly over 5-7 years. Banks want their money back quickly.</li>
<li><strong>Term Loan B (TLB):</strong> From institutional investors (CLOs, hedge funds). Minimal amortization (1%/year) with a massive "bullet" payment at maturity.</li>
<li><strong>Mezzanine / High Yield Bonds:</strong> Deeply subordinated. Highest rates (10-15%).</li>
</ol>
<h4>PIK Interest (Payment-in-Kind)</h4>
<p><strong>Interview Goldmine:</strong> Instead of paying $10 in cash interest, the $10 is added to the principal balance.</p>
<p><strong>Why?</strong> Preserves cash flow in the early, highly-levered years.</p>
<p><strong>The Cost:</strong> It compounds aggressively. The PE firm owes a massive lump sum at exit.</p>`
  },
  {
    title: `5.3 The Cash Flow Waterfall`,
    content: `<p>This is the engine of the LBO model. You project the IS down to FCF, then cascade cash through the capital structure.</p>
<h4>The Logic Flow:</h4>
<ol>
<li>Start with Unlevered FCF (EBITDA - CapEx - Change in NWC).</li>
<li>Subtract Mandatory Interest on all debt tranches.</li>
<li>Subtract Mandatory Principal Amortization (e.g., 10% of TLA).</li>
<li>= <strong>Cash Flow Available for Debt Repayment (CFADS)</strong>.</li>
<li>If CFADS is positive, initiate the <strong>"Cash Sweep"</strong> — aggressively pay down the most senior debt first (Revolver → TLA → TLB). Cannot prepay Mezzanine early without severe penalties.</li>
</ol>`
  },
  {
    title: `5.4 Exit & Returns (IRR & MOIC)`,
    content: `<p>Fast forward to Year 5.</p>
<ol>
<li><strong>Exit Enterprise Value:</strong> Year 5 EBITDA x assumed Exit Multiple (usually assume Exit = Entry to be conservative).</li>
<li><strong>Exit Equity Value:</strong> Exit EV - Remaining Net Debt at Year 5.</li>
<li><strong>MOIC:</strong> Exit Equity Value / Initial Sponsor Equity Check.</li>
<li><strong>IRR Rules of Thumb (5-year hold):</strong>
<ul>
<li>2.0x MOIC ≈ 15% IRR</li>
<li>2.5x MOIC ≈ 20% IRR</li>
<li>3.0x MOIC ≈ 25% IRR</li>
</ul></li>
</ol>`
  },
  {
    title: `5.5 "Walk Me Through a Standard LBO Model"`,
    content: `<p><strong>The Perfect Answer:</strong></p>
<ol>
<li>"First, I make assumptions for Purchase Price, Debt-to-Equity ratio, and interest rates on debt tranches.</li>
<li>Second, I construct a Sources & Uses table with Sponsor Equity as the plug, ensuring Sources = Uses.</li>
<li>Third, I adjust the balance sheet to reflect the new capital structure and write off old equity and debt.</li>
<li>Fourth, I build the operating model, projecting Revenue down to Unlevered Free Cash Flow.</li>
<li>Fifth, I build a Debt Schedule to calculate interest and amortization, and sweep optional debt paydown by seniority.</li>
<li>Finally, I calculate Exit Enterprise Value based on a Year 5 EBITDA multiple, subtract remaining net debt for Exit Equity Value, and calculate IRR and MOIC."</li>
</ol>`
  },
];
