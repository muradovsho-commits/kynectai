export const PE_INTERVIEW_QUESTIONS_SECTIONS = [
  {
    title: 'Fit / Behavioral Questions',
    content: `<div class="interview-q">
<div class="q-label">Question 1</div>
<div class="question">Why private equity? Why not stay in investment banking / consulting?</div>
<div class="answer">Effective answers emphasize three themes: (1) Long-term ownership vs. advisory-in PE, you see the outcome of your work over years, not just the transaction. (2) Operational involvement-PE allows you to influence strategy, management, and performance, not just model the numbers. (3) Investment judgment-PE develops your ability to make investment decisions with real capital at stake, rather than advising others on their decisions. Avoid clichés like "I want to be on the buy side" without explaining what that means to you personally. The best answers are specific and authentic.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 2</div>
<div class="question">Walk me through a deal you've worked on.</div>
<div class="answer">Structure: (1) Brief overview of the company and industry. (2) Your role and the transaction context (sell-side, buy-side, financing). (3) Key financial metrics (revenue, EBITDA, margins, growth). (4) What made it interesting or challenging. (5) The outcome. Be prepared for deep follow-ups: "What was the purchase multiple?", "How was it financed?", "What were the key risks?", "What did you learn?" If you're coming from banking, know the deal backwards and forwards. If you haven't worked on a deal, use a class project or investment pitch.</div>
</div>`,
  },
  {
    title: 'Technical Questions: LBO &amp; Returns',
    content: `<div class="interview-q">
<div class="q-label">Question 3</div>
<div class="question">Walk me through a leveraged buyout.</div>
<div class="answer">A PE firm identifies a company with stable cash flows. It acquires the company using a mix of Equity (30-50%, from the PE fund) and Debt (50-70%, from banks and institutional lenders). The Debt is secured against the company's assets and cash flows. Over a 3-7 year holding period, the PE firm works to increase the company's EBITDA (through revenue growth, cost cuts, and operational improvements) while using the company's Free Cash Flow to repay Debt. At the end of the holding period, the PE firm exits by selling the company (to a strategic buyer, another PE firm, or via IPO). Returns are measured by MOIC and IRR, and they come from three sources: Debt paydown, EBITDA growth, and multiple expansion.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 4</div>
<div class="question">What are the three sources of returns in an LBO?</div>
<div class="answer">(1) <strong>Debt paydown:</strong> As the company's FCF repays Debt, value shifts from Debt holders to Equity holders. The most reliable source. (2) <strong>EBITDA growth:</strong> Revenue growth, margin expansion, and cost optimization increase the company's earnings, making it worth more at exit. Requires genuine operational skill. (3) <strong>Multiple expansion:</strong> Selling at a higher multiple than the purchase price, either because the company is improved (larger, faster-growing, more profitable) or because market conditions are more favorable. The least controllable factor. The best deals combine all three; the worst deals rely entirely on multiple expansion.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 5</div>
<div class="question">A company has $50M EBITDA. You buy it at 8.0x with 5.0x leverage. EBITDA grows to $65M in 5 years. You exit at 8.0x. No Debt is repaid. What's the approximate MOIC?</div>
<div class="answer">Purchase EV: $50M × 8.0x = $400M. Debt: $50M × 5.0x = $250M. Equity: $150M. Exit EV: $65M × 8.0x = $520M. Remaining Debt: $250M (no paydown). Exit Equity: $520M − $250M = $270M. MOIC: $270M / $150M = 1.80x. The return came entirely from EBITDA growth. Without Debt paydown, the return is moderate. If Debt had been paid down to $150M, Exit Equity would be $370M and MOIC would be 2.47x-showing how Debt paydown amplifies returns.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 6</div>
<div class="question">What makes a good LBO candidate?</div>
<div class="answer">Stable, predictable cash flows (for Debt service). Low cyclicality. Strong market position with competitive moats. Low existing leverage. Low maintenance CapEx requirements. Opportunities for operational improvement. A clear, actionable value creation plan. Multiple viable exit routes. A management team capable of executing the plan. And a purchase price that allows for attractive returns even under conservative assumptions.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 7</div>
<div class="question">How does more leverage affect the IRR of an LBO?</div>
<div class="answer">More leverage amplifies returns in both directions. In a successful deal, more leverage means less Equity invested, so the same dollar gain represents a higher percentage return (higher IRR). But more leverage also means higher Interest Expense (reducing FCF for Debt paydown), less margin for error (if EBITDA declines, the company may not be able to service its Debt), and potentially higher interest rates (lenders charge more at higher leverage). Past a certain point, the risk increase outweighs the return enhancement. Typical leverage capacity is 4-6x EBITDA for most buyouts.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 8</div>
<div class="question">Why does a dividend recapitalization improve IRR but not MOIC?</div>
<div class="answer">A dividend recap returns cash to the PE firm sooner by having the company borrow additional Debt and paying a dividend. This improves IRR because IRR is time-weighted-receiving cash earlier increases the annualized return. But MOIC can actually decrease because the additional Debt reduces Exit Equity (the company has more Debt to repay at exit). The total dollar profit may be similar or even lower, but because it was received earlier, the annualized return (IRR) is higher. This illustrates why PE firms track both IRR and MOIC-each captures a different dimension of performance.</div>
</div>`,
  },
  {
    title: 'Technical Questions: Accounting &amp; Valuation',
    content: `<div class="interview-q">
<div class="q-label">Question 9</div>
<div class="question">What is a Quality of Earnings report, and why does it matter in PE?</div>
<div class="answer">A QoE report, prepared by an accounting firm, adjusts the target company's reported EBITDA to reflect its true, recurring, cash earning power. Common adjustments include: removing one-time items (legal settlements, severance, COVID-related costs), normalizing owner compensation (private company owners often overpay themselves), adjusting for non-recurring revenue, identifying aggressive accounting treatments, and calculating run-rate effects of recent changes. The adjusted EBITDA is what the buyer uses to set the purchase price (via the multiple) and to underwrite the Debt (via leverage ratios). If the QoE reveals that "real" EBITDA is $40M instead of the $50M reported, the purchase price and entire deal structure change dramatically.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 10</div>
<div class="question">Walk me through the Sources &amp; Uses schedule for an LBO.</div>
<div class="answer"><strong>Uses</strong> (where the money goes): Equity Purchase Price (offer price × shares), Refinancing of Existing Debt (the target's current Debt is typically refinanced), Advisory Fees (investment bank fees for both buyer and seller), Financing Fees (commitment fees, arrangement fees on new Debt), Legal and Diligence Fees, and sometimes Cash to the Balance Sheet. <strong>Sources</strong> (where the money comes from): each Debt tranche (Revolver, Term Loan A, Term Loan B, Senior Notes, Mezzanine/Sub Debt), the Sponsor Equity contribution, and Management Rollover Equity. Total Sources must equal Total Uses.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 11</div>
<div class="question">What's the difference between Gross IRR and Net IRR?</div>
<div class="answer">Gross IRR is calculated on the fund's investment returns before deducting management fees and carried interest. It reflects the returns generated by the investment portfolio itself. Net IRR is the return LPs actually receive after fees and carry are subtracted. Net IRR is always lower than Gross IRR-typically by 400-700 basis points for a standard "2 and 20" fund. Net IRR is the more meaningful figure for LPs because it represents their actual economic return. GPs typically cite Gross IRR to showcase investment performance, while LPs focus on Net IRR to evaluate their actual return experience.</div>
</div>`,
  },
  {
    title: 'Technical Questions: Deal Process &amp; Operations',
    content: `<div class="interview-q">
<div class="q-label">Question 12</div>
<div class="question">How would you evaluate whether to pursue a buy-and-build strategy?</div>
<div class="answer">The buy-and-build thesis requires several conditions: (1) A fragmented industry with many small operators and no dominant player. (2) A quality platform company with professional management, scalable systems, and a track record of integrating acquisitions. (3) Availability of actionable add-on targets at reasonable multiples (ideally 4-6x EBITDA vs. 7-10x for the platform). (4) Genuine synergy potential-cost savings from consolidation, revenue benefits from broader geographic or product coverage. (5) Multiple expansion potential-larger, more diversified platforms should command higher multiples. And (6) Management bandwidth to execute multiple integrations simultaneously without disrupting the core business.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 13</div>
<div class="question">Name three risks you'd look for during due diligence on a software company.</div>
<div class="answer">(1) <strong>Customer concentration:</strong> If 30%+ of revenue comes from one client, losing that client would devastate the business and impair Debt service. (2) <strong>Churn / retention risk:</strong> If annual churn exceeds 15-20%, the company must acquire a significant number of new customers just to maintain revenue, which is expensive and uncertain. Investigate the reasons for churn and whether they're structural or fixable. (3) <strong>Technical debt:</strong> Legacy code, outdated infrastructure, or a monolithic architecture that requires a major re-platforming investment to remain competitive. This represents a hidden CapEx obligation that may not be reflected in the financial projections.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 14</div>
<div class="question">How would you create value in a business services company?</div>
<div class="answer">Key levers: (1) Pricing optimization-many services businesses undercharge; implementing disciplined pricing can improve margins by 200-500 bps. (2) Labor productivity-optimizing scheduling, reducing overtime, investing in technology to automate manual processes. (3) Cross-selling-expanding the service offering to existing customers. (4) Geographic expansion-opening new locations or expanding into adjacent markets, potentially through add-on acquisitions. (5) Customer retention programs-reducing churn through improved service quality, dedicated account management, and longer-term contracts. (6) Back-office professionalization-implementing ERP systems, financial controls, and management reporting that founder-led businesses often lack.</div>
</div>`,
  },
  {
    title: 'Case Study Format',
    content: `<p>PE interviews often include a case study, which may take one of several forms:</p>

<p><strong>Paper LBO (30-60 minutes):</strong> Given a set of financial assumptions, build a simplified LBO model on paper or in a blank Excel sheet. Calculate purchase price, capital structure, FCF projections, Debt paydown, exit value, and returns. Demonstrate fluency with the mechanics and the ability to do quick mental math.</p>

<p><strong>LBO Modeling Test (2-4 hours):</strong> Build a full LBO model in Excel from a provided CIM or set of financial data. This tests your Excel skills, modeling speed, accuracy, and ability to structure a complex model logically. Practice building LBO models under timed conditions.</p>

<p><strong>Investment Memo / Recommendation (take-home or on-site):</strong> Review a CIM or case packet and prepare a written or verbal recommendation: should the firm invest in this company? Cover the investment thesis, key risks and mitigants, valuation (including an LBO analysis), value creation plan, and exit strategy. The best answers demonstrate independent judgment, not just mechanical analysis.</p>

<p><strong>Deal Discussion:</strong> Present a company you've researched as a potential PE investment. Explain why it's attractive, how you'd structure the deal, what the value creation plan would be, and what returns you'd expect. This tests your ability to think like an investor, not just an analyst.</p>

<div class="takeaway-box">
<strong>The Interviewer's Perspective:</strong> PE interviews test three things above all else. First, can you do the work? (LBO modeling, financial analysis, due diligence.) Second, do you think like an investor? (Can you identify attractive deals, spot risks, and articulate a value creation thesis?) Third, will you fit the team? (PE firms are small, and you'll work closely with a handful of people for years.) The technical skills get you through the door; the investment judgment and interpersonal fit determine the offer.
</div>`,
  },
  {
    title: 'Common Mistakes in PE Interviews',
    content: `<p><strong>Memorizing formulas without understanding them.</strong> Interviewers will probe your understanding with follow-up questions. If you can explain <em>why</em> leverage amplifies returns (not just that it does), you'll stand out.</p>

<p><strong>Ignoring risks.</strong> Every investment has risks. Candidates who only present the bull case without acknowledging and mitigating risks appear naive. The best candidates say, "Here's why I like this deal, here are the three things that could go wrong, and here's how I'd address each one."</p>

<p><strong>Confusing IRR and MOIC.</strong> These measure different things. High IRR with low MOIC (a quick flip) isn't as impressive as high MOIC with reasonable IRR (a genuine value creation story). Understand what drives each metric and when each is more relevant.</p>

<p><strong>Not knowing your deal(s).</strong> If you've worked on an M&A deal in banking, you must know every detail: the purchase price, the multiple, the financing structure, the strategic rationale, the key risks, and the outcome. Saying "I don't remember the multiple" is disqualifying.</p>

<p><strong>Failing to demonstrate investment judgment.</strong> PE firms want investors, not just modelers. Anyone can build a model; the differentiator is knowing whether the model's inputs make sense, what drives the business, and whether the risk/return trade-off is attractive. Practice forming and defending investment opinions.</p>

</div>`,
  },
];
