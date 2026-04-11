export const PE_DEBT_SECTIONS = [
  {
    title: `6.1 The Cost and Constraints of Borrowing`,
    content: `<p>Debt is not a monolith. It is a highly negotiated spectrum of risk and reward.</p>
<p><strong>Why it exists:</strong> Lenders provide capital at a lower cost than equity because they have priority claim on assets if things go wrong.</p>
<p><strong>The PE Lens:</strong> We want the maximum amount of the cheapest debt possible, with the loosest rules (covenants). Lenders want the exact opposite. This tension defines capital markets.</p>`
  },
  {
    title: `6.2 Deep Dive: The Full Capital Stack`,
    content: `<h4>1. The Revolving Credit Facility (Revolver)</h4>
<p>A corporate credit card used strictly for working capital shortfalls. Consider a business managing complex supply chains — their working capital needs fluctuate wildly depending on the performance cycle and seasonal inventory returns. We put a massive Revolver in place to ensure they never miss a payroll or a debt payment during a cash-poor month.</p>
<p>Cost: SOFR + ~200-300 bps.</p>
<h4>2. Senior Secured Debt (TLA & TLB)</h4>
<p><strong>Term Loan A:</strong> From traditional banks. Heavy amortization (5-10% principal/year). Banks want money back quickly.</p>
<p><strong>Term Loan B:</strong> From institutional investors (CLOs, hedge funds). Minimal amortization (1%/year) with a massive "bullet" payment at maturity (5-7 years).</p>
<p><strong>Why PE loves TLBs:</strong> No heavy annual principal payments, leaving more FCF for growth or dividends to the sponsor.</p>
<h4>3. High Yield Bonds / Mezzanine Debt</h4>
<p>Unsecured debt. If the company goes bankrupt, these get paid after senior lenders take hard assets. Cost: 8-12% fixed interest.</p>
<p><strong>The PIK Toggle:</strong> This debt often allows for Payment-in-Kind (PIK), where interest compounds onto the principal balance instead of requiring physical cash payment.</p>`
  },
  {
    title: `6.3 Covenants (Maintenance vs. Incurrence)`,
    content: `<p>Covenants are legal tripwires lenders put in the credit agreement.</p>
<h4>1. Maintenance Covenants (Revolvers & TLAs)</h4>
<p>The company must maintain a certain financial profile <strong>every single quarter</strong>. Example: Total Debt / EBITDA cannot exceed 5.0x. If EBITDA drops and the ratio hits 5.1x, the company is in technical default.</p>
<h4>2. Incurrence Covenants (High Yield & TLBs)</h4>
<p>The company only has to pass the test when taking a specific action (issuing a dividend, making an acquisition). If they just perform poorly, no covenant is breached.</p>
<p><strong>The PE Edge:</strong> "Cov-Lite" loans have become the standard for top sponsors. We aggressively negotiate to strip away maintenance covenants for breathing room in downturns.</p>`
  },
  {
    title: `6.4 Interview Integration: Senior vs. Mezzanine`,
    content: `<p><strong>Question:</strong> "If I have $100M of Senior Debt at 5% or $100M of Mezzanine at 10%, which maximizes IRR?"</p>
<p><strong>The Elite Answer:</strong> "It is a trick question. While Senior Debt has a lower interest rate, it comes with heavy mandatory amortization and strict maintenance covenants. Mezzanine, despite the 10% rate, often has zero amortization and might be PIK. If maximizing IRR is the sole goal, and the company needs to preserve cash flow for aggressive growth, Mezzanine might result in a higher IRR because it delays cash outflow to the exit year. However, it significantly increases the deal's risk profile."</p>`
  },
];
