export const ACCT_AUDIT_SECTIONS = [
  {
    title: 'Audit Standards &amp; the Standard-Setters',
    content: `<p>For public companies (issuers) in the U.S., audits are conducted in accordance with <strong>PCAOB</strong> (Public Company Accounting Oversight Board) standards. The PCAOB was created by the Sarbanes-Oxley Act of 2002 following the Enron and WorldCom scandals. For private companies and nonprofits, audits generally follow <strong>AICPA</strong> (American Institute of CPAs) standards (Generally Accepted Auditing Standards, or GAAS). Internationally, the <strong>IAASB</strong> issues International Standards on Auditing (ISAs), adopted by most non-U.S. jurisdictions.</p>`,
  },
  {
    title: 'Phases of the Audit',
    content: `<h4>1. Client Acceptance &amp; Continuance</h4>

<p>Before accepting a new engagement, the firm assesses client risk: management integrity, industry risk, ability to pay fees, and whether the firm has the competence and independence to serve the client. For continuing clients, the firm considers any developments that increase risk-management changes, regulatory investigations, financial deterioration. This gate-keeping function protects audit quality and firm reputation.</p>

<h4>2. Planning &amp; Risk Assessment</h4>

<p>Planning is the foundation of an effective audit. The auditor develops an understanding of the entity and its environment (the business, its industry, key accounting policies, related parties, and regulatory environment), identifies and assesses <strong>risks of material misstatement</strong> (RMM) at both the financial statement level and the assertion level, and designs audit procedures to respond to those risks.</p>

<div class="key-concept">
<strong>Materiality:</strong> Auditors focus on matters that could influence the economic decisions of users. Materiality is both a quantitative threshold (typically 0.5-2% of pre-tax income, 0.5-1% of total assets, or 1-2% of revenue, depending on the entity and user base) and a qualitative consideration (some misstatements are material regardless of size-a fraud of any amount, or a misclassification that affects a debt covenant ratio, for example). Performance materiality (typically 50-75% of overall materiality) is used to design procedures with a buffer for undetected misstatements.
</div>

<h4>3. Controls Testing</h4>

<p>If the auditor plans to rely on internal controls to reduce substantive testing, they must test the design and operating effectiveness of those controls. <strong>Walkthroughs</strong> trace a transaction from initiation through recording to confirm the design is as understood. <strong>Tests of operating effectiveness</strong> test whether controls operated as designed throughout the period (typically by examining samples of control evidence). If controls are found ineffective, the auditor increases the scope of substantive procedures.</p>

<h4>4. Substantive Procedures</h4>

<p>Substantive procedures directly test the dollar amounts in the financial statements. They include <strong>substantive analytical procedures</strong> (comparing financial data to expectations and investigating significant deviations) and <strong>tests of details</strong> (examining individual transactions, account balances, and disclosures). The mix between analytics and tests of details depends on the nature and risk of the area being tested.</p>

<h4>5. Completing the Audit &amp; Reporting</h4>

<p>Near completion, auditors evaluate uncorrected misstatements (those management declined to adjust), assess going concern indicators, perform subsequent events procedures (reviewing events after year-end for those requiring recognition or disclosure), obtain a management representation letter, and form an overall conclusion on whether the financial statements are fairly presented. The audit committee and management receive findings before the opinion is issued.</p>`,
  },
  {
    title: 'Types of Audit Opinions',
    content: `<table class="comparison-table">
<tr><th>Opinion Type</th><th>Meaning</th><th>Implication</th></tr>
<tr><td>Unmodified (Clean)</td><td>Statements are fairly presented in all material respects</td><td>Standard outcome; required for most regulatory purposes</td></tr>
<tr><td>Qualified</td><td>Statements are fairly presented <em>except for</em> a specific matter</td><td>A material departure from GAAP or scope limitation that is not pervasive</td></tr>
<tr><td>Adverse</td><td>Statements are <em>not</em> fairly presented</td><td>Pervasive GAAP departures; extremely rare; severe consequences for the company</td></tr>
<tr><td>Disclaimer</td><td>Auditor is unable to express an opinion</td><td>Pervasive scope limitation; auditor could not obtain sufficient evidence</td></tr>
<tr><td>Emphasis of Matter</td><td>Draws attention to a properly disclosed matter</td><td>Going concern uncertainty; consistency matters; significant uncertainty</td></tr>
</table>`,
  },
];
