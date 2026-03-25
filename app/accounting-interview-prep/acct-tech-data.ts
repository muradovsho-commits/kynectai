export const ACCT_TECH_SECTIONS = [
  {
    title: `1. The Big 3 Financial Statements`,
    content: `<p>Unlike Investment Banking where you project these into the future (DCF), in Accounting, you must be able to audit how these statements link together historically with flawless precision.</p>
<br/>
<p><strong>The Core Engine:</strong><br/>
1. <strong>Income Statement (IS):</strong> Shows Revenues minus Expenses over a specific period. Ends in Net Income.<br/>
2. <strong>Cash Flow Statement (CFS):</strong> Starts with Net Income, adds back non-cash expenses (like Depreciation), and adjusts for changes in Working Capital to find actual cash entering/leaving the bank.<br/>
3. <strong>Balance Sheet (BS):</strong> A snapshot in time. Assets = Liabilities + Equity. Net Income flows from the IS into Retained Earnings. Cash from the CFS becomes the top-line Cash asset.</p>
<br/>
<p><strong>The Golden Interview Question: "If you could only choose ONE statement to evaluate a company, which would you pick?"</strong><br/>
<em>Answer:</em> The Cash Flow Statement. The Income Statement is highly susceptible to non-cash accounting manipulation (like aggressively altering depreciation schedules), but Cash is king. The CFS tells you exactly how much actual cash the business is generating to keep the lights on.</p>`
  },
  {
    title: `2. ASC 606 (Revenue Recognition)`,
    content: `<p>Revenue Recognition is the most heavily scrutinized area by the SEC and PCAOB. Companies constantly try to "recognize" revenue early to make their current quarter look better to Wall Street.</p>
<br/>
<p><strong>The 5-Step Model of ASC 606:</strong><br/>
1. Identify the contract with a customer.<br/>
2. Identify the performance obligations in the contract.<br/>
3. Determine the transaction price.<br/>
4. Allocate the transaction price to the performance obligations.<br/>
5. <strong>Recognize revenue WHEN (or AS) the entity satisfies a performance obligation.</strong></p>
<br/>
<p><em>Example:</em> A software company sells a 1-year subscription on January 1st for $1,200, paid entirely upfront. The company cannot recognize a massive $1,200 spike in revenue in January. They must record $1,200 of <strong>Deferred Revenue (a Liability)</strong> on January 1st, because they <em>owe</em> the customer 12 months of service. They recognize exactly $100 of revenue on the Income Statement each month.</p>`
  },
  {
    title: `3. ASC 842 (Lease Accounting)`,
    content: `<p>Historically, a massive airline could lease 100 airplanes and keep the debt "Off-Balance Sheet" by treating them as Operating Leases. This made the airline look much less indebted/risky than they actually were. The new ASC 842 rules stopped this.</p>
<br/>
<p><strong>The Change:</strong><br/>
Now, practically all leases longer than 12 months (even simple office space rentals) must be capitalized and put directly onto the Balance Sheet.</p>
<br/>
<p><strong>The Mechanics:</strong><br/>
When a company signs a 5-year lease for a warehouse, they must immediately record a <strong>Right-of-Use (ROU) Asset</strong> on the asset side, and a corresponding <strong>Lease Liability</strong> on the liability side, equal to the Present Value of the future lease payments. Ask this in an interview, and the Partner will instantly realize you know current accounting standards.</p>`
  },
  {
    title: `4. Working Capital Mechanics`,
    content: `<p>Working Capital = Current Assets (excluding cash) - Current Liabilities (excluding debt). It represents the cash tied up in day-to-day operations.</p>
<br/>
<p><strong>Accounts Receivable (AR):</strong> Money owed to the company by customers. If AR is skyrocketing while Revenue is flat, the company is failing to collect cash, which is a massive red flag for an auditor.<br/>
<strong>Accounts Payable (AP):</strong> Money the company owes to vendors. Delaying AP payments "creates" short-term cash flow, but ruins vendor relationships.<br/>
<strong>Inventory:</strong> Goods waiting to be sold. High inventory ties up cash and runs the risk of obsolescence (requiring an inventory write-down, violently hitting the Income Statement).</p>`
  }
];
