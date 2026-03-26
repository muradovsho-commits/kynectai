export const PE_ACCOUNTING_SECTIONS = [
  {
    title: `1.1 First Principles: Accrual vs. Cash`,
    content: `<p>Modern business operates on <strong>Accrual Accounting</strong> (US GAAP / IFRS). The core principle is the <strong>matching principle</strong>: revenues are recognized when earned, and expenses when incurred, regardless of when cash changes hands.</p>
<p><strong>How PE thinks about it:</strong> Private Equity investors view Net Income as an accounting fiction. We care about <strong>Free Cash Flow (FCF)</strong>. You cannot pay a lender with "recognized revenue." You can only pay them with cold, hard cash.</p>
<h4>Building Intuition: The Supply Chain Reality Check</h4>
<p>Imagine a manufacturer. You buy raw materials, pay logistics and labor. Your cash is gone — sitting on the warehouse floor as boxes. Under accrual accounting, you haven't recognized an expense yet. The expense is trapped on the Balance Sheet as <strong>Inventory</strong>.</p>
<p>Now you sell that inventory on "Net 90" terms. Under accrual accounting, you instantly recognize massive Revenue and Net Income. But as a PE investor looking at the bank account, you have <strong>zero cash</strong> to pay this month's interest expense because the cash is trapped in <strong>Accounts Receivable</strong>.</p>
<p>This dynamic — the delay between economic reality and cash reality — is why we must master the three financial statements.</p>`
  },
  {
    title: `1.2 The Three Statements & Their Linkages`,
    content: `<h4>1. The Income Statement (The Engine)</h4>
<p><strong>Purpose:</strong> Shows profitability over a specific period.</p>
<p><strong>Logic:</strong> Revenue - COGS = Gross Profit. Gross Profit - OpEx (SG&A, R&D) = EBITDA. Subtract D&A to get EBIT. Subtract Interest and Taxes to get Net Income.</p>
<p><strong>PE Edge:</strong> Net Income is the starting point, not the end goal.</p>
<h4>2. The Balance Sheet (The Snapshot)</h4>
<p><strong>Purpose:</strong> A snapshot of what the company owns (Assets) and owes (Liabilities) at a specific moment.</p>
<p><strong>Logic:</strong> Assets = Liabilities + Shareholders' Equity</p>
<p><strong>PE Edge:</strong> The Balance Sheet is where cash gets "trapped" (Working Capital) and where we structure our capital (Debt vs. Equity).</p>
<h4>3. The Cash Flow Statement (The Truth)</h4>
<p><strong>Purpose:</strong> Reconciles Net Income to the actual change in cash.</p>
<p><strong>Logic:</strong> Broken into three sections: Cash from Operations (CFO), Cash from Investing (CFI), and Cash from Financing (CFF).</p>
<p><strong>PE Edge:</strong> This is the most important statement. We use it to calculate FCF, which dictates how much debt we can pay down in our LBO model.</p>
<h4>Connecting the Concepts: The Linkages</h4>
<p>Interviewers will test your understanding of how these statements talk to each other. Memorize this sequence:</p>
<ol>
<li>Net Income from the IS flows to the top of the CFS (CFO).</li>
<li>Net Income also flows into Shareholders' Equity on the BS as Retained Earnings (minus dividends).</li>
<li>D&A (a non-cash expense) is added back in CFO.</li>
<li>Changes in Net Working Capital are reflected in CFO.</li>
<li>The sum of CFO, CFI, and CFF = Net Change in Cash.</li>
<li>This is added to the prior period's Cash to become the new Cash on the BS.</li>
</ol>`
  },
  {
    title: `1.3 Deep Dive: Working Capital Traps`,
    content: `<p><strong>Net Working Capital (NWC)</strong> = Current Assets (excluding Cash) - Current Liabilities (excluding Debt)</p>
<p>NWC represents the cash tied up in day-to-day operations.</p>
<ul>
<li><strong>Current Assets:</strong> Inventory, Accounts Receivable, Prepaid Expenses. These are uses of cash. If they go UP, cash goes DOWN.</li>
<li><strong>Current Liabilities:</strong> Accounts Payable, Accrued Expenses, Deferred Revenue. These are sources of cash. If they go UP, cash goes UP.</li>
</ul>
<h4>The PE Nuance: The "Working Capital Drag"</h4>
<p>Most candidates think: "A growing company is a great LBO candidate."</p>
<p>Top 1% candidates think: "A growing company might starve us of cash."</p>
<p>If a company is growing rapidly, it needs more inventory and extends more AR. NWC increases. An increase in NWC is a <strong>decrease in Cash Flow</strong>.</p>
<p>If you model an LBO for a high-growth business but fail to project the required increase in NWC, your cash flow waterfall will show plenty of cash for debt paydown. In reality, that cash is trapped in the supply chain, and the company defaults.</p>`
  },
  {
    title: `1.4 Advanced: Capitalization vs. Expensing`,
    content: `<p>Imagine a software company paying engineers $1,000,000 to develop a new app.</p>
<ul>
<li><strong>Scenario A (Expensing):</strong> Classified as R&D. Hits the IS immediately. EBITDA decreases by $1M.</li>
<li><strong>Scenario B (Capitalizing):</strong> Classified as a long-term asset on the BS as "Capitalized Software Costs." EBITDA is unaffected. Amortized over 5 years below the EBITDA line.</li>
</ul>
<p><strong>The PE Interview Test:</strong> Two identical companies with the same cash outflows. Company B reports much higher EBITDA. At a 10x multiple, Company B looks significantly more valuable.</p>
<p>As an elite candidate, you would say: <em>"I need to look at the Cash Flow Statement under Cash from Investing to see capitalized software costs. I will adjust Company B's EBITDA downward for an apples-to-apples comparison, because regardless of accounting treatment, the cash left the building."</em></p>`
  },
  {
    title: `1.5 The $10 Depreciation Question (Classic Drill)`,
    content: `<p><strong>Question:</strong> "Walk me through the three statements if Depreciation goes up by $10. Assume a 20% tax rate."</p>
<h4>The Elite Response:</h4>
<p><strong>Income Statement:</strong> "EBIT declines by $10. Assuming a 20% tax rate, the company saves $2 in taxes. Net Income decreases by $8."</p>
<p><strong>Cash Flow Statement:</strong> "Net Income is down by $8. However, Depreciation is a non-cash expense, so we add the $10 back. The Net Change in Cash is an increase of $2."</p>
<p><strong>Balance Sheet:</strong> "Cash is up by $2, but PP&E is down by $10. Total Assets are down by $8. On the other side, Retained Earnings are down by $8. The Balance Sheet balances."</p>
<p><strong>Follow-up:</strong> "How did the company make $2 in cash if Net Income dropped?"</p>
<p><strong>Your response:</strong> "Because depreciation is a non-cash expense. No actual cash left the business. The accounting expense lowered taxable income, saving $2 on the tax bill. The cash increase is purely the realization of that tax shield."</p>`
  },
  {
    title: `1.6 The "Perfect Answer" Framework`,
    content: `<p>When asked an accounting question (e.g., "Walk me through the three statements when X happens"), you must structure your answer rigidly. Do not jump around.</p>
<ol>
<li><strong>Income Statement:</strong> State the impact to Revenue, Expenses, Taxes, and Net Income.</li>
<li><strong>Cash Flow Statement:</strong> Start with Net Income, adjust for non-cash items, adjust for changes in working capital, and arrive at the Net Change in Cash.</li>
<li><strong>Balance Sheet:</strong> Start with Cash, adjust other Assets, adjust Liabilities, adjust Retained Earnings, and explicitly state: "And the Balance Sheet balances."</li>
</ol>`
  },
  {
    title: `1.7 Practice & Drills (Module 1)`,
    content: `<h4>Drill 1.1: The Inventory Write-Down</h4>
<p><strong>Prompt:</strong> A company discovers that $50 of its inventory is obsolete and must be written down. Walk me through the 3 statements. Assume a 20% tax rate.</p>
<p><strong>Answer:</strong> IS: Pre-tax income down $50. Taxes down $10. NI down $40. CFS: NI down $40. Add back non-cash write-down of $50. Net cash up $10. BS: Cash up $10. Inventory down $50. Total Assets down $40. RE down $40. Balances.</p>
<h4>Drill 1.2: Brain Teaser</h4>
<p><strong>Prompt:</strong> Could a company ever have negative Shareholders' Equity?</p>
<p><strong>Answer:</strong> Yes. Two common scenarios:</p>
<ol>
<li>The company has been losing money for years, generating massive negative Net Income which flows into Retained Earnings as a deficit, wiping out initial equity capital.</li>
<li><strong>The PE LBO Scenario:</strong> A Private Equity firm does a "Dividend Recapitalization." They issue new debt and use the proceeds to pay themselves a massive cash dividend. The dividend reduces Retained Earnings so severely that Shareholders' Equity turns negative. (Covered extensively in Module 7.)</li>
</ol>`
  },
];
