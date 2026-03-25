export const ACCT_AUDIT_SECTIONS = [
  {
    title: `1. The Purpose of an Audit (Assurance)`,
    content: `<p>Never tell a Big 4 partner that you want to do "consulting" if you are interviewing for Audit. Audit is not consulting; you are not advising the client on how to make money. You are protecting the public market.</p>
<br/>
<p><strong>The Core Objective:</strong><br/>
An auditor provides "Reasonable Assurance" (never absolute assurance) that a company's financial statements are free of "Material Misstatement." You are verifying that the company's 10-K filing to the SEC actually matches reality.</p>
<br/>
<p><strong>The Ultimate Output: The Audit Opinion</strong><br/>
1. <strong>Unqualified (Clean):</strong> The best outcome. The financials are presented fairly under US GAAP.<br/>
2. <strong>Qualified:</strong> Mostly clean, but with a specific exception/deviation.<br/>
3. <strong>Adverse:</strong> The worst outcome. The financials are heavily misstated or fraudulent.<br/>
4. <strong>Disclaimer of Opinion:</strong> The auditor could not get enough evidence to form an opinion.</p>`
  },
  {
    title: `2. SOX Compliance & Internal Controls`,
    content: `<p>In the wake of the Enron and WorldCom scandals in the early 2000s, the US government passed the Sarbanes-Oxley Act (SOX). This is the absolute lifeblood of modern Big 4 audit work.</p>
<br/>
<p><strong>Section 404 (Internal Controls):</strong><br/>
Before you even test the numbers (Substantive Testing), you must test the <em>process</em> (Controls Testing).<br/>
<em>Example:</em> You don't just verify that a company paid $5M in payroll accurately. You test the "Control" around payroll. Does the HR manager physically physically click "Approve" on the payroll batch file before the money is released? <strong>If the control fails, you cannot trust the underlying numbers without massive extra testing.</strong></p>
<br/>
<p>As a first-year Audit Associate, 80% of your life will be doing "Walkthroughs"—sitting with a client's mid-level accountants, having them share their screen, and asking them to verbally walk you through their exact day-to-day button clicks to prove their internal controls exist.</p>`
  },
  {
    title: `3. Testing Substantive Balances (Vouching vs Tracing)`,
    content: `<p>Once you trust the internal controls, you test the actual dollar amounts. This requires rigorous sampling and two specific directional tests.</p>
<br/>
<p><strong>Vouching (Testing for Existence/Occurrence):</strong><br/>
You go backward from the Financial Statements to the Source Document. <br/>
<em>Scenario:</em> The client's ledger says they have $50,000 of Inventory. You select a sample of 10 items from that list, physically walk into the client's warehouse, and "vouch" that those exact 10 boxes physically exist. This ensures the client isn't OVERSTATING their assets.</p>
<br/>
<p><strong>Tracing (Testing for Completeness):</strong><br/>
You go forward from the Source Document to the Financial Statements.<br/>
<em>Scenario:</em> You pick up 10 random physical shipping receipts from the warehouse floor. You then "trace" them into the accounting ledger to ensure the revenue was actually recorded. This ensures the client isn't UNDERSTATING their expenses or revenues.</p>`
  },
  {
    title: `4. Materiality (The Line in the Sand)`,
    content: `<p>Auditors do not check every single penny. If a multi-billion dollar company misplaces a $50 receipt, the SEC does not care.</p>
<br/>
<p><strong>Defining Materiality:</strong><br/>
A misstatement is considered "Material" if it is large enough to influence the economic decision of a reasonable investor reading the financial statements. <br/>
Firms calculate Overall Materiality taking a flat percentage (e.g., 5%) of Pre-Tax Income. If Pre-Tax Income is $100M, overall Materiality is $5M. Any accounting error found by an associate that is under a trivial threshold (e.g., $100k) is noted but largely ignored as a "Passed Adjusting Journal Entry (PAJE)".</p>`
  }
];
