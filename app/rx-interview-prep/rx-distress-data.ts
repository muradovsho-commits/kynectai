export const RX_DISTRESS_SECTIONS = [
  {
    title: 'Common Causes of Distress',
    content: `<p>At its core, financial distress boils down to one or both of two things: <strong>too much debt</strong> and/or <strong>insufficient liquidity</strong>. But the underlying causes are varied:</p>

<p><strong>Overleveraging:</strong> The company took on more debt than its cash flows can support. This is particularly common with PE-backed companies where aggressive leverage was used to fund the acquisition. When operating performance dips even modestly, interest and principal payments become unsustainable.</p>

<p><strong>Secular industry decline:</strong> The company's business model becomes obsolete. Brick-and-mortar retail facing e-commerce disruption, print media losing to digital, legacy energy companies facing the transition to renewables. No amount of financial engineering can fix a business that customers no longer want.</p>

<p><strong>Macroeconomic downturn:</strong> A recession compresses revenue across the economy, particularly for cyclical industries (airlines, hospitality, discretionary consumer goods). Companies with moderate leverage in good times suddenly find themselves critically overleveraged when EBITDA drops 30&ndash;40%.</p>

<p><strong>Failed acquisition or capital project:</strong> A company makes a large strategic bet&mdash;an acquisition or major capital investment&mdash;that fails to deliver the expected returns, leaving the company with massive debt and underperforming assets.</p>

<p><strong>Litigation and regulatory risk:</strong> A single massive legal judgment, product liability claim, or regulatory change can create liabilities that overwhelm the balance sheet. Environmental remediation costs, opioid litigation settlements, and class-action lawsuits are common examples.</p>

<p><strong>Fraud:</strong> Accounting fraud or management misconduct can destroy company value virtually overnight while liabilities remain unchanged.</p>`,
  },
  {
    title: 'Signs of Distress',
    content: `<div class="key-concept">
<strong>How RX bankers identify distressed companies:</strong> Limited liquidity (low cash, restricted revolver capacity). High leverage ratios (Debt/EBITDA above 6&ndash;7x, especially at the secured level). Declining EBITDA or negative free cash flow. Upcoming "maturity walls" (large debt maturities that likely can't be refinanced). Secondary trading prices well below par (bonds trading at 60&ndash;80 signals stress; below 50 signals severe distress). Credit downgrades into CCC territory or below. Covenant breaches or waivers. Distressed hedge funds accumulating positions in the capital structure.
</div>`,
  },
  {
    title: 'The Capital Structure Hierarchy',
    content: `<p>Understanding the priority of claims is the single most fundamental concept in restructuring. When a company can't pay all its obligations, the question becomes: who gets paid first, and how much does everyone else recover?</p>

<table class="comparison-table">
<tr><th>Priority</th><th>Instrument</th><th>Key Characteristics</th></tr>
<tr><td>1 (Highest)</td><td>DIP Financing (in Ch. 11 only)</td><td>Super-priority claim; funded during bankruptcy to keep the company operating</td></tr>
<tr><td>2</td><td>Secured Debt (Revolvers, Term Loans)</td><td>Backed by specific collateral; first claim on those assets; lowest interest rates</td></tr>
<tr><td>3</td><td>Unsecured Senior Debt (Senior Notes)</td><td>General claim against the company, not backed by specific assets; higher yields</td></tr>
<tr><td>4</td><td>Subordinated Debt (Sub Notes)</td><td>Contractually junior to senior unsecured; higher yields; often impaired first</td></tr>
<tr><td>5</td><td>Mezzanine / PIK Notes</td><td>Very junior; may have equity-like features (warrants, convertibility)</td></tr>
<tr><td>6 (Lowest)</td><td>Equity (Common Stock)</td><td>Residual claim; gets whatever's left; typically wiped out in severe distress</td></tr>
</table>

<p>The <strong>Absolute Priority Rule (APR)</strong> dictates that in bankruptcy, each class must be paid in full before the next class receives anything. In practice, junior classes sometimes receive a small recovery (a "tip") even when senior classes aren't fully covered&mdash;this happens through negotiation, often to secure junior classes' votes on a plan of reorganization.</p>

<h4>Secured vs. Unsecured</h4>

<p>Secured debt is backed by specific collateral (assets pledged to the lender). If the company defaults, secured creditors can seize and liquidate the collateral. Unsecured debt has only a general claim against the company&mdash;no specific assets backing it. If a secured creditor's claim exceeds the value of its collateral, the excess becomes an unsecured claim (called a "deficiency claim").</p>

<h4>Key Debt Instruments</h4>

<p><strong>Revolving Credit Facility (Revolver):</strong> Functions like a corporate credit card&mdash;the company can draw it down and repay it as needed, up to the commitment amount. Typically secured by liquid assets (accounts receivable, inventory). The borrowing base (the value of eligible collateral) determines how much can actually be drawn. Revolvers are the most senior instrument in the capital structure.</p>

<p><strong>Term Loans (TLA, TLB, TLC):</strong> Fixed-amount loans with defined repayment schedules. Term Loan A (TLA) typically amortizes (mandatory principal payments each quarter). Term Loan B (TLB) has minimal amortization (1% per year) with a bullet maturity. TLBs are the workhorse of leveraged finance. Term loans carry floating interest rates (typically SOFR + a spread).</p>

<p><strong>Senior Secured Notes:</strong> Bonds backed by collateral, typically ranking pari passu (equal) with term loans if they share the same collateral. Fixed-rate coupon. Governed by an indenture (a legal contract) rather than a credit agreement.</p>

<p><strong>Senior Unsecured Notes:</strong> Bonds without collateral backing. Higher coupon than secured debt to compensate for the additional risk. Often the first impaired class in a restructuring.</p>

<p><strong>Subordinated Notes:</strong> Contractually junior to senior unsecured notes. Highest coupons. Often deeply impaired or wiped out in restructuring.</p>`,
  },
];
