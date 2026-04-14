// Accounting & Audit Mastery Manual - Modules 1-3
export const ACCT_TECH_SECTIONS = [
  {
    title: '1.1-1.3 What Accounting Is, Language of Business, Objective of Reporting',
    content: `<h3>1.1 What Accounting Actually Is</h3>
<p>Accounting is the structured process of identifying, measuring, recording, classifying, summarizing, and communicating economic activity.</p>
<p><strong>Why it exists:</strong> Businesses constantly create transactions: selling products, paying employees, borrowing money, buying equipment, collecting cash, promising performance in the future. Stakeholders need a reliable framework for converting that messy activity into useful information. Those stakeholders include: management, investors, lenders, regulators, auditors, tax authorities, employees.</p>
<p><strong>What accounting is trying to do:</strong> At its core, accounting tries to represent economic reality in a disciplined and comparable way.</p>
<p><strong>Why this matters in interviews:</strong> Interviewers want to know whether you understand accounting as a logic system, not just a list of rules. A strong candidate understands that accounting is always balancing: relevance vs reliability, precision vs practicality, comparability vs business-specific nuance, timing of recognition vs uncertainty of measurement.</p>

<h3>1.2 The Language of Business</h3>
<p>Accounting is often called the language of business because it translates operations into financial information. A retailer can say: sales are strong, inventory is moving, margins are under pressure. But accounting turns those statements into numbers that can be compared, audited, forecasted, and evaluated.</p>
<p><strong>Intuition:</strong> Operations create economics. Accounting records and organizes those economics. Financial statements communicate the results.</p>

<h3>1.3 The Objective of Financial Reporting</h3>
<p>Financial reporting aims to provide useful information about an entity's financial position, performance, and cash flows.</p>
<p><strong>Why useful information matters:</strong> Useful reporting helps users make decisions such as: whether to invest, whether to lend, whether to extend credit, whether management is performing well, whether the company can meet obligations.</p>
<p><strong>Core qualities of useful financial information:</strong> relevance, faithful representation, comparability, consistency, timeliness, understandability.</p>
<p><strong>Interview insight:</strong> Strong candidates know accounting is not about memorizing arbitrary treatment. It is about supporting decision-useful information under a standard framework.</p>`,
  },
  {
    title: '1.4-1.6 Accrual vs Cash Accounting, The Accounting Equation, Debits & Credits',
    content: `<h3>1.4 Accrual Accounting vs Cash Accounting</h3>
<p><strong>Cash accounting:</strong> Records transactions when cash is received or paid.</p>
<p><strong>Accrual accounting:</strong> Records revenue when earned and expenses when incurred, regardless of cash timing.</p>
<p><strong>Why accrual accounting exists:</strong> Cash timing can distort performance. Example: A customer prepays a one-year service contract. Under cash accounting, revenue would spike immediately. Under accrual accounting, revenue is recognized as service is delivered.</p>
<p><strong>Interview insight:</strong> A very common weak answer is: "Accrual accounting is just more accurate." A stronger answer is: "Accrual accounting matches economic activity to the period in which it occurs, which generally produces a more meaningful representation of ongoing performance than cash timing alone."</p>

<h3>1.5 The Accounting Equation</h3>
<p><strong>Assets = Liabilities + Equity</strong></p>
<p>This is the backbone of financial accounting. Assets are resources controlled by the entity. Liabilities are obligations owed to others. Equity is the residual claim after liabilities.</p>
<p><strong>Why it matters:</strong> Every transaction must preserve this equation.</p>
<p><strong>Interview insight:</strong> The accounting equation is not just a balance-sheet formula. It is the structural logic underlying debits, credits, statement linkage, and transaction analysis.</p>

<h3>1.6 Debits and Credits From First Principles</h3>
<p>Candidates often memorize "debit left, credit right" without understanding the system.</p>
<p><strong>What debits and credits really are:</strong> A double-entry bookkeeping mechanism that ensures every transaction has equal and opposite effects.</p>
<p><strong>Normal balance intuition:</strong> Assets increase with debits. Liabilities increase with credits. Equity increases with credits. Revenue increases with credits. Expenses increase with debits.</p>
<p><strong>Why this works:</strong> Revenue ultimately increases equity, while expenses decrease equity.</p>
<p><strong>Common mistake:</strong> Students often memorize the rules but cannot explain why expenses are debit-balance. The deeper reason is that expenses reduce retained earnings / equity.</p>`,
  },
  {
    title: '1.7-1.10 Journal Entries, Adjusting Entries, Closing Process, Accountant\'s Mindset + Module 1 Practice',
    content: `<h3>1.7 Journal Entries and the Flow of Information</h3>
<p><strong>Journal entry:</strong> The first formal record of a transaction.</p>
<p><strong>General ledger:</strong> The collection of all accounts and balances.</p>
<p><strong>Trial balance:</strong> A listing of accounts used to verify debits equal credits.</p>
<p><strong>Financial statements:</strong> Built from the adjusted trial balance.</p>
<p><strong>Flow:</strong> Transaction → Journal entry → Ledger → Trial balance → Adjusting entries → Financial statements</p>
<p><strong>Why this matters in audit:</strong> Auditors trace and vouch transactions across this flow. Understanding the accounting pipeline is essential for understanding audit evidence.</p>

<h3>1.8 Adjusting Entries</h3>
<p>At period end, accounting needs to reflect the correct timing of revenue and expenses.</p>
<p><strong>Common adjusting entries:</strong> accrued revenue, accrued expenses, prepaid expense amortization, deferred revenue recognition, depreciation, bad debt allowance adjustments, inventory / cost adjustments.</p>
<p><strong>Why they matter:</strong> Without adjusting entries, the statements may be materially misstated even if every cash transaction was recorded.</p>

<h3>1.9 Trial Balance, Adjusted Trial Balance, and Closing Process</h3>
<p><strong>Unadjusted trial balance:</strong> Shows balances before period-end corrections.</p>
<p><strong>Adjusted trial balance:</strong> Reflects period-end accruals, deferrals, estimates, and corrections.</p>
<p><strong>Closing entries:</strong> Move temporary accounts such as revenue and expenses into retained earnings.</p>

<h3>1.10 The Accountant's Mindset</h3>
<p>A strong accounting candidate thinks in terms of: economic substance, timing, classification, measurement, consistency, documentation, materiality, internal control.</p>
<p><strong>When confronted with a transaction, a strong candidate asks:</strong></p>
<ol><li>What happened economically?</li><li>What accounts are affected?</li><li>When should it be recognized?</li><li>How should it be measured?</li><li>What disclosures may be required?</li><li>What risks or judgment areas exist?</li></ol>

<h3>Module 1 Practice Drills</h3>
<p><strong>Explain-out-loud drills:</strong> What is the purpose of accounting? Why is accrual accounting preferred for financial reporting? What do debits and credits actually accomplish? Why are adjusting entries necessary?</p>
<p><strong>Transaction drills - For each, identify accounts and whether debited or credited:</strong></p>
<ol><li>Borrow cash from a bank</li><li>Purchase equipment with cash</li><li>Earn revenue on account</li><li>Pay rent in advance</li><li>Accrue unpaid wages</li></ol>
<p><strong>Self-test checklist:</strong> Did I explain the economics, not just the rule? Did I think about timing and measurement separately? Can I connect the transaction to the accounting equation?</p>`,
  },
  {
    title: '2.1-2.4 Income Statement, Balance Sheet, Cash Flows, Equity Statement',
    content: `<h3>2.1 Why the Financial Statements Matter</h3>
<p>The financial statements are the final output of the accounting system. They translate thousands or millions of transactions into a structured picture of: performance, position, liquidity, obligations, capital.</p>
<p>For accounting interviews, you must understand what each statement does. For audit interviews, you must understand where each statement is vulnerable to error or manipulation.</p>

<h3>2.2 The Income Statement</h3>
<p><strong>What it is:</strong> Reports financial performance over a period.</p>
<p><strong>Core structure:</strong> Revenue → Less: COGS → Gross profit → Operating expenses → Operating income → Non-operating items → Pre-tax income → Tax expense → Net income.</p>
<p><strong>Key concepts:</strong> revenue recognition, matching principle, recurring vs non-recurring items, gross margin, operating margin, earnings quality.</p>
<p><strong>Risk areas:</strong> premature revenue recognition, cut-off issues, capitalization of expenses, reserves and estimates, classification manipulation.</p>

<h3>2.3 The Balance Sheet</h3>
<p><strong>What it is:</strong> A snapshot of financial position at a point in time.</p>
<p><strong>Assets:</strong> cash, receivables, inventory, prepaid expenses, PP&amp;E, intangibles, goodwill, other assets.</p>
<p><strong>Liabilities:</strong> payables, accrued liabilities, deferred revenue, debt, lease liabilities, tax liabilities, other obligations.</p>
<p><strong>Equity:</strong> common stock / contributed capital, retained earnings, accumulated other comprehensive income, treasury stock.</p>
<p><strong>Risk areas:</strong> existence of assets, valuation of receivables and inventory, completeness of liabilities, classification errors, impairment issues.</p>

<h3>2.4 The Statement of Cash Flows</h3>
<p><strong>Sections:</strong> operating activities, investing activities, financing activities.</p>
<p><strong>Indirect method intuition:</strong> Start with net income, then adjust for: non-cash items, changes in working capital.</p>
<p><strong>Risk areas:</strong> classification between operating / investing / financing, non-cash transactions omitted from disclosure, manipulation through working capital timing.</p>`,
  },
  {
    title: '2.5-2.9 Equity Statement, Notes, Linkages, Ratios, Earnings Quality + Module 2 Practice',
    content: `<h3>2.5 Statement of Changes in Equity</h3>
<p>Explains the movement in equity accounts over the period. It ties together: net income, dividends, share issuances / repurchases, OCI items.</p>

<h3>2.6 Notes to the Financial Statements</h3>
<p>The notes are not optional decoration. They are critical. They explain: accounting policies, estimates, contingencies, segment data, commitments, debt terms, revenue recognition methods, fair value measurements, subsequent events.</p>
<p><strong>Audit insight:</strong> A statement line item is often impossible to understand correctly without the note disclosure.</p>

<h3>2.7 Statement Linkage</h3>
<p><strong>Core linkages:</strong> Net income from the income statement flows to retained earnings. Net income is also the starting point for operating cash flow under the indirect method. Ending cash from the cash flow statement links to the balance sheet. Many balance sheet accounts drive income statement and cash flow statement effects over time.</p>

<h3>2.8 Common Financial Statement Ratios</h3>
<p><strong>Profitability:</strong> gross margin, operating margin, net margin, ROA, ROE.</p>
<p><strong>Liquidity:</strong> current ratio, quick ratio.</p>
<p><strong>Efficiency:</strong> receivable turnover, inventory turnover, DSO, DIO, DPO.</p>
<p><strong>Leverage:</strong> debt-to-equity, debt-to-assets, interest coverage.</p>
<p><strong>Why they matter:</strong> Ratios help accountants and auditors identify anomalies, risk, trends, and analytical review items.</p>

<h3>2.9 Earnings Quality and Red Flags</h3>
<p><strong>High-risk signs:</strong> strong revenue growth with weak cash collections, recurring "one-time" adjustments, margin expansion unsupported by operations, reserve releases boosting earnings, capitalizing costs aggressively, frequent changes in accounting estimates or policies.</p>
<p><strong>Interview insight:</strong> Strong candidates understand that not all earnings are equally reliable.</p>

<h3>Module 2 Practice Drills</h3>
<p><strong>Explain-out-loud drills:</strong> Walk me through the four primary financial statements. Why are the notes important? What is earnings quality? Why can cash flow and net income differ significantly?</p>
<p><strong>Self-test checklist:</strong> Can I explain not just what each statement is, but what users learn from it? Can I identify likely high-risk balances and estimates?</p>`,
  },
  {
    title: '3.1-3.8 Accounting Mechanics: Revenue, Collections, Inventory, Prepaids, Accruals, Deferred Revenue, Depreciation, Bad Debt',
    content: `<h3>3.1 Why Mechanics Matter</h3>
<p>Many candidates can discuss accounting conceptually but struggle once a real transaction appears. Interviewers use mechanics questions to test whether you can translate economics into accounting entries and statement impacts.</p>

<h3>3.2 Revenue on Account</h3>
<p><strong>Entry:</strong> Dr Accounts Receivable 1,000 / Cr Revenue 1,000</p>
<p><strong>Impact:</strong> Income statement: revenue up. Balance sheet: AR up, equity up through retained earnings. Cash flow: no immediate cash collection; AR increase reduces operating cash flow relative to net income.</p>
<p><strong>Audit risk:</strong> Occurrence, cut-off, collectibility, and proper period recognition.</p>

<h3>3.3 Cash Collection of Receivables</h3>
<p><strong>Entry:</strong> Dr Cash 1,000 / Cr Accounts Receivable 1,000</p>
<p>No income statement impact. Balance sheet: cash up, AR down.</p>

<h3>3.4 Inventory Purchase on Credit</h3>
<p><strong>Entry:</strong> Dr Inventory 500 / Cr Accounts Payable 500</p>
<p>No immediate expense if inventory is unsold. Balance sheet: inventory up, AP up.</p>
<p><strong>Audit risk:</strong> Existence, valuation, completeness of liabilities, cut-off.</p>

<h3>3.5 Sale of Inventory and Cost Recognition</h3>
<p>Inventory costing $400 sold for $1,000 cash:</p>
<p><strong>Entries:</strong> Dr Cash 1,000 / Cr Revenue 1,000 AND Dr COGS 400 / Cr Inventory 400</p>
<p><strong>Impact:</strong> Revenue up 1,000, COGS up 400, gross profit up 600. Cash up 1,000, inventory down 400.</p>

<h3>3.6 Prepaid Expense</h3>
<p>Pay annual insurance of $1,200 upfront:</p>
<p><strong>Initial:</strong> Dr Prepaid Insurance 1,200 / Cr Cash 1,200</p>
<p><strong>Monthly adjusting:</strong> Dr Insurance Expense 100 / Cr Prepaid Insurance 100</p>
<p>Cash leaves first, but expense is recognized over time.</p>

<h3>3.7 Accrued Expense</h3>
<p>Wages of $800 incurred but unpaid at month-end:</p>
<p><strong>Entry:</strong> Dr Wage Expense 800 / Cr Accrued Wages Payable 800</p>
<p>The company must recognize the expense in the correct period even before cash payment.</p>
<p><strong>Audit risk:</strong> Completeness of liabilities is a major issue here.</p>

<h3>3.8 Deferred Revenue</h3>
<p>Collect $2,400 cash for a 12-month service contract:</p>
<p><strong>Initial:</strong> Dr Cash 2,400 / Cr Deferred Revenue 2,400</p>
<p><strong>Monthly recognition:</strong> Dr Deferred Revenue 200 / Cr Service Revenue 200</p>
<p>Cash receipt is not always revenue recognition.</p>`,
  },
  {
    title: '3.9-3.13 Depreciation, Bad Debt, Debt, Common 3-Statement Scenarios, Mistakes + Module 3 Practice',
    content: `<h3>3.9 Depreciation</h3>
<p>Equipment costing $12,000 with 5-year life, straight-line, no salvage. Annual depreciation: 12,000 / 5 = 2,400.</p>
<p><strong>Entry:</strong> Dr Depreciation Expense 2,400 / Cr Accumulated Depreciation 2,400</p>
<p>Depreciation allocates asset cost over useful life. It is non-cash but affects earnings and asset carrying value.</p>

<h3>3.10 Bad Debt Expense and Allowance</h3>
<p>Not all receivables will be collected. Under accrual accounting, expected credit losses must be recognized appropriately.</p>
<p><strong>Record allowance:</strong> Dr Bad Debt Expense 300 / Cr Allowance for Doubtful Accounts 300</p>
<p><strong>Write-off:</strong> Dr Allowance for Doubtful Accounts 100 / Cr Accounts Receivable 100</p>
<p>The allowance method separates estimation of credit loss from later specific write-off activity.</p>

<h3>3.11 Debt Issuance and Interest Accrual</h3>
<p><strong>Issuing debt:</strong> Dr Cash 50,000 / Cr Notes Payable 50,000</p>
<p><strong>Accruing interest:</strong> Dr Interest Expense X / Cr Interest Payable X</p>

<h3>3.12 Common 3-Statement Scenarios</h3>
<p><strong>Increase in depreciation:</strong> income statement: expense up, net income down. Cash flow: add back non-cash depreciation, tax shield improves CFO. Balance sheet: PP&amp;E net down, retained earnings down.</p>
<p><strong>Increase in inventory:</strong> no immediate income statement effect if unsold. Cash tied up in working capital. Inventory up on balance sheet.</p>
<p><strong>Increase in accounts payable:</strong> often source of cash if expense recognized before payment. Liability completeness becomes important.</p>
<p><strong>Capital expenditure:</strong> investing cash outflow. Balance sheet asset up initially. No immediate income statement expense other than later depreciation.</p>

<h3>3.13 Common Mechanical Mistakes</h3>
<ol><li>Expensing items that should be capitalized</li><li>Recognizing revenue when cash is received rather than when earned</li><li>Forgetting adjusting entries</li><li>Ignoring tax effects in multi-statement walkthroughs</li><li>Confusing allowance recording with write-offs</li><li>Forgetting liabilities can be understated, not just overstated</li></ol>

<h3>Module 3 Practice Drills</h3>
<p><strong>Journal entry drills:</strong> 1) purchase equipment with a note payable, 2) collect cash in advance from customer, 3) recognize monthly rent expense from prepaid rent, 4) accrue utilities at month-end, 5) write off an uncollectible receivable, 6) record inventory shrinkage.</p>
<p><strong>Statement flow drills - Explain 3-statement impact of:</strong> 1) depreciation increase, 2) inventory purchase for cash, 3) wage accrual, 4) debt issuance, 5) dividend declaration and payment.</p>`,
  },
];
