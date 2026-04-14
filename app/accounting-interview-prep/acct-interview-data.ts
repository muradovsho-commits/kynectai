export const ACCT_INTERVIEW_SECTIONS = [
  {
    title: 'Contextual Questions',
    content: `<div class="interview-q">
<div class="q-label">Q1</div>
<div class="question">Walk me through the three financial statements and how they connect.</div>
<div class="answer">The income statement shows revenues, expenses, and net income over a period. Net income flows into the equity section of the balance sheet through retained earnings, increasing shareholders' equity. The cash flow statement starts with net income (indirect method) and adjusts for non-cash items like depreciation and changes in working capital accounts. The ending cash balance on the cash flow statement ties directly to the cash line on the balance sheet. So: income statement feeds retained earnings on the balance sheet; cash flow statement explains the change in cash on the balance sheet. The key distinction is accrual vs. cash: the income statement is accrual-based; the cash flow statement converts accrual income to actual cash movement.</div>
</div>

<div class="interview-q">
<div class="q-label">Q2</div>
<div class="question">Why do you want to work in audit rather than advisory or tax?</div>
<div class="answer">Audit provides the broadest foundation for understanding how businesses operate because you're looking across the entire financial picture-not just one area. The exposure to different industries, business models, and management teams in a short time is unmatched. Audit also develops skills-professional skepticism, structured problem-solving, understanding of accounting standards-that transfer extremely well to virtually any finance or business role. Advisory and tax are appealing in their own right, but I want to build the fundamental business literacy that audit uniquely provides before specializing.</div>
</div>

<div class="interview-q">
<div class="q-label">Q3</div>
<div class="question">What does an unqualified (clean) audit opinion actually mean?</div>
<div class="answer">It means the auditor obtained sufficient appropriate evidence to conclude that the financial statements are presented fairly, in all material respects, in accordance with the applicable accounting framework (usually GAAP or IFRS). It does not mean the financial statements are perfect or free from all errors-only that any misstatements are below the materiality threshold. It does not guarantee the company won't fail. It does not mean the auditor found no fraud-only that any fraud, if present, is not material to the financial statements. The clean opinion is a reasonable assurance conclusion, not a guarantee.</div>
</div>`,
  },
  {
    title: 'Technical Questions',
    content: `<div class="interview-q">
<div class="q-label">Q4</div>
<div class="question">A company buys $100 of inventory and pays cash. What's the effect on the three financial statements?</div>
<div class="answer">Balance sheet: cash decreases by $100, inventory increases by $100. Net effect on total assets is zero; liabilities and equity are unchanged. Income statement: no effect. The purchase of inventory is not an expense-it becomes cost of goods sold only when sold. Cash flow statement: cash used in operating activities decreases by $100 (the inventory purchase is an operating outflow if using the direct method, or shown as an increase in inventory reducing operating cash flow in the indirect method). The accounting equation is preserved: assets shift form (cash to inventory) with no change in total.</div>
</div>

<div class="interview-q">
<div class="q-label">Q5</div>
<div class="question">What's the difference between depreciation and amortization? Where does each appear on the financial statements?</div>
<div class="answer">Depreciation applies to <em>tangible</em> long-lived assets (buildings, machinery, equipment). Amortization applies to <em>intangible</em> assets with finite useful lives (patents, customer lists, licenses). The mechanics are identical: the cost of the asset is allocated over its useful life to match costs with the revenues generated. On the income statement, depreciation and amortization typically appear within cost of goods sold (for assets used in production) or operating expenses (for selling/admin assets). On the balance sheet, the accumulated D&amp;A reduces the gross asset value to arrive at net book value. On the cash flow statement, D&amp;A is added back to net income in the operating section because it's a non-cash expense that reduced net income but didn't consume cash.</div>
</div>

<div class="interview-q">
<div class="q-label">Q6</div>
<div class="question">A company uses LIFO inventory accounting and inflation is rising. How does this affect the financial statements compared to FIFO?</div>
<div class="answer">Under LIFO, the most recently purchased (higher-cost) inventory is assumed sold first. In inflation, this means COGS is higher (reflecting recent high prices) and ending inventory is lower (reflecting older, cheaper costs). Compared to FIFO: the income statement shows lower gross profit and lower net income; the balance sheet shows a lower inventory value (the LIFO reserve represents the difference); taxes are lower because taxable income is lower. FIFO produces higher ending inventory (a better approximation of current replacement cost), higher net income, and higher taxes. Companies often disclose the LIFO reserve in the notes, allowing analysts to convert LIFO inventory to FIFO for comparability. Note: LIFO is prohibited under IFRS.</div>
</div>

<div class="interview-q">
<div class="q-label">Q7</div>
<div class="question">What is the difference between a material weakness, a significant deficiency, and a control deficiency?</div>
<div class="answer">A <em>control deficiency</em> exists when the design or operation of a control doesn't allow management or employees to prevent or detect misstatements in a timely basis. A <em>significant deficiency</em> is a deficiency (or combination of deficiencies) in internal control that is less severe than a material weakness but important enough to merit attention by those responsible for oversight-significant deficiencies are communicated to the audit committee. A <em>material weakness</em> is a deficiency, or a combination of deficiencies, such that there is a reasonable possibility that a material misstatement of the financial statements will not be prevented or detected on a timely basis-the most severe classification. Public companies with a material weakness must disclose it publicly; it triggers restatement risk and SEC scrutiny and can significantly damage market confidence in the financial statements.</div>
</div>

<div class="interview-q">
<div class="q-label">Q8</div>
<div class="question">Why might a company's net income be positive but its cash flow from operations be negative?</div>
<div class="answer">Accrual accounting recognizes revenue when earned and expenses when incurred, regardless of when cash changes hands. Net income can be positive while operating cash flow is negative when: accounts receivable is growing faster than revenue (the company is recognizing revenue it hasn't collected), inventory is building up (cash is being spent on goods not yet sold), or deferred revenue is declining (previously collected cash was being recognized as revenue without new cash inflows). Rapidly growing companies often show this pattern: revenue recognition outpaces collections, and inventory investment consumes cash. This is why cash flow analysis is essential alongside the income statement-a profitable-looking company can face a liquidity crisis if its cash conversion cycle is weak.</div>
</div>

<div class="interview-q">
<div class="q-label">Q9</div>
<div class="question">Describe a scenario where you'd need to issue a going concern opinion.</div>
<div class="answer">A going concern opinion (technically an emphasis-of-matter paragraph under PCAOB standards) is issued when substantial doubt exists about an entity's ability to continue as a going concern for 12 months from the financial statement date. Conditions that raise substantial doubt include recurring operating losses, working capital deficiencies, negative operating cash flows, events of default on debt agreements, and loss of a major customer. The auditor considers both conditions and management's mitigating plans (asset sales, new financing, cost reductions). If management's plans are not sufficient to alleviate the doubt, the auditor modifies the report. Issuing a going concern opinion is significant: it can become self-fulfilling by triggering debt covenants, causing suppliers to tighten terms, and accelerating customer losses.</div>
</div>

<div class="interview-q">
<div class="q-label">Q10</div>
<div class="question">How do you audit accounts receivable?</div>
<div class="answer">The primary risk for AR is overstatement-management has incentive to inflate receivables (and thus revenue). The key procedures: (1) <em>Confirmation</em>-send positive confirmations directly to customers asking them to verify the balance owed; this addresses existence and accuracy. (2) <em>Subsequent collections</em>-verify that receivables recorded at year-end have actually been collected in the subsequent period; this is strong evidence of existence and valuation. (3) <em>Analytical procedures</em>-calculate days sales outstanding (AR / (Revenue / 365)) and compare to prior years and industry benchmarks; an unexplained increase suggests revenue recognition issues or collectibility concerns. (4) <em>Review of the aging schedule</em>-assess the reasonableness of the allowance for doubtful accounts; old receivables that haven't been written off inflate the balance. (5) <em>Cutoff testing</em>-review sales transactions around year-end to ensure revenue is recognized in the correct period.</div>
</div>

<div class="interview-q">
<div class="q-label">Q11</div>
<div class="question">What is goodwill impairment and how is it tested?</div>
<div class="answer">Goodwill impairment occurs when the carrying amount of a reporting unit (including its allocated goodwill) exceeds its fair value. Under ASC 350 (post-2017 simplification), the impairment charge equals the excess of carrying amount over fair value, capped at the carrying amount of goodwill. Testing proceeds in two steps: first, a qualitative assessment ("Step 0") to determine if it's more likely than not that fair value exceeds carrying amount-if so, no further testing is needed. If not, a quantitative test is performed: estimate the fair value of the reporting unit (typically using discounted cash flow analysis and market multiples), compare to its carrying amount, and record the shortfall as impairment. The DCF requires estimating future cash flows, the terminal growth rate, and the discount rate-all highly judgmental inputs that auditors must challenge using specialists and sensitivity analysis.</div>
</div>`,
  },
  {
    title: 'The Case Study Format',
    content: `<p>Some firms (particularly in technical or manager-level interviews) present a mini case study: you're given an excerpt from financial statements or a scenario description and asked to identify the accounting treatment, the audit risks, and the procedures you'd perform.</p>

<p>The approach: (1) Identify the accounting standard that applies (revenue recognition? leases? business combinations?). (2) Identify the key assertions at risk-for revenue, it's occurrence and cutoff; for liabilities, it's completeness. (3) Identify the audit procedures that address those assertions most directly-confirmation, observation, analytical procedures, tests of details. (4) Consider what could go wrong: what is management's incentive, and how might they manipulate this area? (5) Propose mitigating procedures.</p>

<p>The case is collaborative. Interviewers are assessing your thought process and analytical structure, not whether you recite the exact procedures from a textbook. Showing that you can systematically decompose an unfamiliar accounting scenario, identify risks, and design logical procedures demonstrates the same kind of thinking you'd use on an actual engagement.</p>

<div class="takeaway-box">
<strong>The Auditor's Mindset:</strong> Accounting is the language of business, and audit is how we verify that the language is being used honestly. The best auditors combine technical knowledge of accounting standards with genuine business curiosity-they want to understand how companies actually operate, not just tick boxes on a checklist. Professional skepticism isn't cynicism; it's a disciplined habit of asking for evidence rather than accepting assertions. Every number on a financial statement represents a decision, an estimate, or a judgment made by someone who often has an incentive to make it look a certain way. Your job is to understand those decisions, challenge those estimates, and form an independent conclusion. Develop that habit of mind and you'll be prepared not just for interviews, but for a career that opens into nearly every corner of the business world.
</div>

</div>`,
  },
];
