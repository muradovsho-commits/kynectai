export const PE_CASE_STUDY_SECTIONS = [
  {
    title: `1. The PE Modeling Test (The LBO Test)`,
    content: `<p>Unlike Investment Banking interviews which are mostly verbal, Private Equity interviews almost always culminate in a 1 to 3-hour rigorous Excel modeling test.</p>
<br/>
<p><strong>What to expect:</strong><br/>
You will be put in a room with a laptop, a blank Excel sheet (or a poorly formatted template), and a 10-page prompt (a fake CIM). You must build a full LBO model from scratch, project the 3 statements, build a debt schedule, output the IRR/MOIC, and write a 1-page investment recommendation.</p>
<br/>
<p><strong>The Golden Rules of Modeling Tests:</strong></p>
<p>• <strong>NEVER hardcode inside a formula.</strong> All assumptions must live strictly in an "Assumptions" block at the top. Everything else must refer to those cells.</p>
<p>• <strong>Speed is everything.</strong> You cannot use the mouse. You must know every Excel keyboard shortcut (Alt -> H -> V -> S -> F, Ctrl + PageUp, etc).</p>
<p>• <strong>Formatting matters.</strong> Blue color for hardcoded inputs, Black for formulas, Green for links from other sheets. Use borders and shading to make it readable.</p>
<p>• <strong>Failing to balance the balance sheet is an automatic ding.</strong> Build in a "Balance Check" row at the bottom of your balance sheet: ` + "`= Total Assets - (Total Liabilities + Shareholders Equity)`" + `. It must be zero.</p>`
  },
  {
    title: `2. The "3-Statement" LBO Structure`,
    content: `<p>Your model must contain the following interconnected blocks:</p>
<br/>
<p><strong>1. Transaction Assumptions (Sources & Uses):</strong><br/>
Enter the purchase price, the debt tranches, and the required Sponsor Equity. This must perfectly balance.</p>
<br/>
<p><strong>2. Income Statement Projections:</strong><br/>
Project Revenue (driven by <code>growth %</code>), COGS (as a <code>% of revenue</code>), SG&A (as a <code>% of revenue</code>) to get EBITDA. Subtract D&A to get EBIT. Subtract Interest (linked <em>up</em> from the Debt Schedule below) to get EBT. Subtract Taxes to get Net Income.</p>
<br/>
<p><strong>3. Balance Sheet Projections:</strong><br/>
Project Working Capital (AR, AP, Inventory based on Days Sales Outstanding, etc). Project PP&E (Beginning + CapEx - D&A). Link Retained Earnings to Net Income.</p>
<br/>
<p><strong>4. Cash Flow Statement Projections:</strong><br/>
Start with Net Income. Add back D&A. Subtract changes in Net Working Capital. Subtract CapEx. The final output is <strong>Cash Flow Available for Debt Service (CFADS)</strong>.</p>
<br/>
<p><strong>5. The Debt Schedule:</strong><br/>
Take CFADS. Pay the mandatory Term Loan amortization. Use any leftover cash to "sweep" (optionally prepay) the Term Loan. Calculate Interest Expense based on the average debt balance.</p>
<br/>
<p><strong>6. Returns Schedule:</strong><br/>
Calculate Exit EV based on Year 5 EBITDA * Exit Multiple. Subtract the Year 5 Ending Debt. Output the Final Sponsor Equity. Use <code>=IRR()</code> and <code>=MOIC()</code>.</p>`
  },
  {
    title: `3. The Circularity Issue (Interest Expense)`,
    content: `<p>A classic technical hurdle in PE modeling tests is handling <strong>circular references</strong>.</p>
<br/>
<p><strong>The Problem:</strong><br/>
Net Income requires Interest Expense to calculate. Interest Expense is calculated on the Average Debt Balance. The Average Debt Balance depends on how much debt you pay down. How much debt you pay down depends on Cash Flow. Cash Flow depends on Net Income. <br/><br/><i>Net Income -> Interest -> Debt -> Cash Flow -> Net Income.</i></p>
<br/>
<p><strong>The Solution: "The Standard Toggle"</strong><br/>
You must build a "Circularity Breaker" or "Toggle" cell. <br/>
1. Create a cell at the top named "Circularity Switch" with a 1 or 0.<br/>
2. In your Interest Expense formula, write: <code>=IF(Switch=1, (BegDebt+EndDebt)/2*Rate, BegDebt*Rate)</code>.<br/>
3. Whenever Excel crashes with a circular reference error, flip the switch to 0 to break the loop based on Beginning Debt. Once it recalculates, flip it back to 1.</p>`
  },
  {
    title: `4. Constructing the Investment Memo`,
    content: `<p>You finished the 2-hour model test. Now you have 30 minutes to write a 1-page Investment Memo.</p>
<br/>
<p>You must answer the core question: <strong>"Would you invest the firm's money in this deal, and why?"</strong></p>
<br/>
<p>Structure your memo in 4 paragraphs:</p>
<p><strong>1. Executive Summary:</strong> A clear, definitive YES or NO to the deal. Provide the target IRR and MOIC based on your base-case model.</p>
<p><strong>2. Investment Theses (The Pros):</strong> Detail the 2-3 reasons why this is a fundamentally strong business (e.g., sticky recurring revenue, recession-proof end markets, room for massive margin expansion via synergies).</p>
<p><strong>3. Key Risks & Mitigants (The Cons):</strong> What could ruin this deal? Customer concentration? Raw material inflation? For every risk, provide a mitigating factor (e.g., "Risk: Supplier highly concentrated. Mitigant: Have identified 3 alternative Asian suppliers to transition to post-close.")</p>
<p><strong>4. Conclusion:</strong> Reiterate the decision and specify the price you are willing to pay.</p>`
  }
];
