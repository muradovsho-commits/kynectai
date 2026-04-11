export const ACCT_EVIDENCE_SECTIONS = [
  {
    title: 'Financial Statement Assertions',
    content: `<p>Audit procedures are designed to address specific <strong>assertions</strong>&mdash;the explicit and implicit claims management makes when presenting financial statements. Testing assertions ensures that audit work is targeted at the right risks rather than testing everything indiscriminately.</p>

<div class="key-concept">
<strong>Key Assertions by Category:</strong><br><br>
<strong>For Account Balances (Balance Sheet):</strong> Existence (assets and liabilities actually exist), Completeness (all assets, liabilities, and equity that should be recorded are recorded), Rights &amp; Obligations (the entity has the right to assets and is obligated for liabilities), and Valuation (assets, liabilities, and equity are recorded at appropriate amounts).<br><br>
<strong>For Transactions (Income Statement):</strong> Occurrence (recorded transactions actually happened), Completeness (all transactions that occurred are recorded), Accuracy (transactions are recorded at correct amounts), Cutoff (transactions are recorded in the correct period), and Classification (transactions are in the appropriate accounts).
</div>`,
  },
  {
    title: 'Hierarchy of Evidence Reliability',
    content: `<p>Not all audit evidence is equally persuasive. The auditing standards establish a hierarchy based on the source and nature of evidence: evidence obtained directly by the auditor (e.g., the auditor's own recalculation, physical observation) is more reliable than evidence obtained from the client. Evidence from external, independent third parties (e.g., bank confirmations, legal letters) is more reliable than evidence from the client. Documentary evidence is more reliable than oral representations.</p>

<table class="comparison-table">
<tr><th>Evidence Type</th><th>Reliability</th><th>Examples</th></tr>
<tr><td>Auditor's direct procedures</td><td>Highest</td><td>Physical inventory observation, recalculation, reperformance</td></tr>
<tr><td>External confirmations</td><td>High</td><td>Bank confirmations, AR confirmations, attorney letters</td></tr>
<tr><td>Third-party documents</td><td>High</td><td>Invoices from suppliers, bank statements, signed contracts</td></tr>
<tr><td>Client-created documents reviewed externally</td><td>Moderate</td><td>Remittance advices, shipping documents countersigned by customers</td></tr>
<tr><td>Client-created documents (internal)</td><td>Lower</td><td>Internal memoranda, management-prepared analyses</td></tr>
<tr><td>Oral representations</td><td>Lowest</td><td>Management explanations, verbal assurances</td></tr>
</table>`,
  },
  {
    title: 'Key Audit Procedures',
    content: `<h4>Confirmation</h4>
<p>The auditor obtains a direct response from a third party verifying the accuracy of information. Positive confirmations request a reply regardless of whether the recipient agrees or disagrees; negative confirmations (used for lower-risk populations) request a reply only if the recipient disagrees. AR confirmations test the existence and accuracy assertions for receivable balances. Bank confirmations test cash and debt balances directly.</p>

<h4>Analytical Procedures</h4>
<p>Analytical procedures compare financial data to expectations derived from prior periods, industry benchmarks, budgets, or relationships between financial and nonfinancial data. A gross margin that dropped from 42% to 28% in a year requires explanation. Analytical procedures are efficient but depend on the quality of the expectations developed&mdash;a sophisticated fraud can be designed to manipulate both the financial statements and the underlying operational data that auditors use to build expectations.</p>

<h4>Sampling</h4>
<p>Auditors rarely test 100% of a population. Statistical sampling provides a basis for drawing conclusions about the entire population from a subset. <strong>Attribute sampling</strong> tests the rate of deviation in a control (relevant for tests of controls). <strong>Variable sampling</strong> estimates the dollar amount of misstatement in a population (relevant for substantive tests). The sample size is determined by the acceptable risk of incorrect conclusions, the expected error rate or amount, and the population size.</p>`,
  },
];
