export const ACCT_INTERNAL_CONTROLS_SECTIONS = [
  {
    title: 'The COSO Framework',
    content: `<p>The <strong>Committee of Sponsoring Organizations of the Treadway Commission (COSO)</strong> provides the most widely used framework for designing and evaluating internal control. The 2013 COSO Internal Control-Integrated Framework identifies five components and 17 principles that together constitute effective internal control over financial reporting.</p>

<div class="framework-box">
<div class="fw-label">The Five COSO Components</div>
<p><strong>1. Control Environment:</strong> The foundation-the tone at the top, ethical values, board oversight, and the organizational structure that sets the context for all other components. A weak control environment undermines every other component, regardless of how well-designed individual controls may be.</p>
<p><strong>2. Risk Assessment:</strong> The entity's process for identifying and analyzing risks to achieving its objectives, including the risk of fraud. Management must consider both internal and external sources of risk and assess how those risks could result in material misstatements.</p>
<p><strong>3. Control Activities:</strong> The specific policies and procedures that address identified risks. Examples include authorization controls (approvals required for transactions above a threshold), reconciliation controls (monthly bank reconciliations), segregation of duties (the person who records a transaction shouldn't be the same person who approves or handles cash), and IT application controls (automated validation of transaction data).</p>
<p><strong>4. Information &amp; Communication:</strong> The systems and processes that capture and communicate financial information to support the preparation of financial statements and enable personnel to carry out their control responsibilities.</p>
<p><strong>5. Monitoring:</strong> Ongoing assessments of whether controls are present and functioning. This includes continuous monitoring activities embedded in normal operations and separate evaluations like internal audits and management reviews.</p>
</div>`,
  },
  {
    title: 'Internal Control over Financial Reporting (ICFR)',
    content: `<p>For accelerated filers under the SEC's rules, Section 404 of Sarbanes-Oxley requires both <strong>management's assessment</strong> of ICFR effectiveness and an <strong>auditor's attestation</strong> on that assessment. This makes ICFR testing a major component of the public company audit-sometimes consuming as much work as the substantive financial statement audit itself.</p>

<h4>Segregation of Duties (SOD)</h4>

<p>SOD is a fundamental control principle: incompatible duties should not be performed by the same individual. The classic triad of incompatible duties is <strong>authorization</strong> (approving transactions), <strong>custody</strong> (physical handling of assets), and <strong>recording</strong> (entering transactions in the books). A single employee who can authorize payments, access the bank accounts, and record the disbursement has unchecked ability to commit and conceal fraud. Small companies often cannot achieve full SOD-compensating controls (heightened management review, dual signatures) partially mitigate but cannot fully substitute.</p>

<h4>IT General Controls (ITGCs)</h4>

<p>Modern accounting relies on IT systems, making IT General Controls foundational to the reliability of all application controls. ITGCs cover: <strong>access controls</strong> (who can enter, change, or view financial data), <strong>change management</strong> (ensuring that changes to financial systems are authorized, tested, and properly implemented), <strong>computer operations</strong> (job scheduling, backup, and recovery procedures), and <strong>program development</strong> (controls over the development and implementation of new systems). Deficiencies in ITGCs can undermine the reliability of any automated control that runs on the affected systems.</p>`,
  },
];
