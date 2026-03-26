// Investment Banking Technical Mastery Manual — Module 8: Technical Interview Question Bank
export const MARKETS_SECTIONS = [
  {
    title: '8.1 Accounting Questions (Q1–Q5)',
    content: `<p>This section is designed to train you to answer questions the way top candidates do: clearly, step-by-step, and with real understanding. For each question: exact wording, step-by-step answer, what interviewers are testing, weak vs strong answer, common follow-ups.</p>

<h3>Question 1: Walk me through the three financial statements.</h3>
<p><strong>Strong answer:</strong> "The income statement shows a company's revenue, expenses, and net income over a period of time. The cash flow statement starts with net income, adjusts for non-cash items and changes in working capital, and then includes investing and financing activities to show the net change in cash over the period. The balance sheet is a snapshot at a point in time showing assets, liabilities, and equity, where assets equal liabilities plus equity. The three statements link because net income flows into the cash flow statement and into retained earnings on the balance sheet, while the cash flow statement explains the change in the cash balance on the balance sheet."</p>
<p><strong>What interviewers are testing:</strong> Foundational accounting fluency and clarity.</p>
<p><strong>Weak answer:</strong> "The income statement has revenue and expenses, the cash flow statement has cash, and the balance sheet balances."</p>
<p><strong>Follow-ups:</strong> How are the statements linked? Which statement would you look at to assess liquidity? Why can net income differ from cash flow?</p>

<h3>Question 2: If depreciation goes up by $10, how do the statements change?</h3>
<p><strong>Strong answer:</strong> "Assuming a 25% tax rate, on the income statement EBIT falls by $10, taxes fall by $2.5, and net income falls by $7.5. On the cash flow statement, net income is down $7.5 but depreciation is added back because it is non-cash, so cash rises by $2.5. On the balance sheet, cash is up $2.5, PP&amp;E is down $10, and retained earnings are down $7.5, so the balance sheet balances."</p>
<p><strong>What interviewers are testing:</strong> Three-statement linkage and tax shield understanding.</p>
<p><strong>Weak answer:</strong> "Net income goes down and cash goes up."</p>
<p><strong>Follow-ups:</strong> Why does cash increase? Is the business actually healthier?</p>

<h3>Question 3: Why can increasing depreciation increase cash flow?</h3>
<p><strong>Strong answer:</strong> "Because depreciation is a non-cash expense. It reduces pre-tax income, which lowers taxes paid, and then it is added back on the cash flow statement. So the company benefits from a tax shield even though no cash left the business due to the depreciation expense itself."</p>
<p><strong>What interviewers are testing:</strong> Ability to distinguish accounting expense from cash effect.</p>
<p><strong>Follow-ups:</strong> Does it always improve value? How is this different from CapEx?</p>

<h3>Question 4: What is working capital?</h3>
<p><strong>Strong answer:</strong> "Working capital usually refers to current operating assets minus current operating liabilities, such as accounts receivable plus inventory minus accounts payable and accrued expenses. It measures how much cash is tied up in the day-to-day operations of the business. If working capital increases, the company generally uses cash, and if it decreases, the company generally releases cash."</p>
<p><strong>What interviewers are testing:</strong> Cash conversion understanding.</p>
<p><strong>Weak answer:</strong> "It is current assets minus current liabilities."</p>
<p><strong>Why weak:</strong> Too textbook, no operating context, and no cash flow interpretation.</p>

<h3>Question 5: Why does an increase in accounts receivable reduce cash flow?</h3>
<p><strong>Strong answer:</strong> "Because it means the company recognized revenue but has not collected the cash yet, so cash lags accounting earnings. That increase is a use of cash in the cash flow statement."</p>`,
  },
  {
    title: '8.2 Valuation Questions (Q6–Q11)',
    content: `<h3>Question 6: What are the main valuation methodologies?</h3>
<p><strong>Strong answer:</strong> "The three primary valuation methodologies are comparable companies analysis, precedent transactions analysis, and discounted cash flow analysis. Trading comps value a company based on how similar public companies are valued by the market. Precedent transactions look at valuation multiples paid in past acquisitions of similar companies, often including a control premium. A DCF values the company based on the present value of its projected future unlevered free cash flows and terminal value."</p>
<p><strong>What interviewers are testing:</strong> Breadth and clean structure.</p>
<p><strong>Follow-ups:</strong> Which usually gives the highest valuation? Which is most theoretically sound? When might a DCF not be appropriate?</p>

<h3>Question 7: Walk me through a DCF.</h3>
<p><strong>Strong answer:</strong> "First, project the company's operating performance over a forecast period, typically 5 to 10 years. Second, calculate unlevered free cash flow each year as EBIT times one minus the tax rate, plus D&amp;A, minus CapEx, minus changes in net working capital. Third, determine the discount rate, typically WACC, which reflects the blended required return of debt and equity holders. Fourth, calculate terminal value using either the Gordon Growth method or an exit multiple method. Fifth, discount the forecast free cash flows and terminal value back to present value and sum them to get enterprise value. Finally, bridge from enterprise value to equity value by adjusting for cash, debt, and other non-operating claims, then divide by diluted shares outstanding if you want an implied share price."</p>
<p><strong>What interviewers are testing:</strong> Whether you can explain the whole framework logically.</p>
<p><strong>Weak answer:</strong> "You project cash flows, discount them, and get valuation."</p>
<p><strong>Follow-ups:</strong> Why use unlevered free cash flow? Why use WACC? How do you calculate terminal value?</p>

<h3>Question 8: Why do you use WACC in a DCF?</h3>
<p><strong>Strong answer:</strong> "Because in a standard DCF we are discounting unlevered free cash flow, which is available to all capital providers. WACC reflects the blended required return of those capital providers, weighted by their market value share of the capital structure, so it is the appropriate discount rate."</p>

<h3>Question 9: Why do you subtract cash when calculating enterprise value?</h3>
<p><strong>Strong answer:</strong> "Because enterprise value is intended to represent the value of the core operations of the business. Cash is generally a non-operating asset, and if an acquirer bought the whole company, the cash on the balance sheet would reduce the effective net purchase price of the operations."</p>

<h3>Question 10: Why might precedent transactions show higher values than trading comps?</h3>
<p><strong>Strong answer:</strong> "Because precedent transactions usually reflect acquisition prices for control, which often include a premium over the company's unaffected public market trading value. They may also reflect expected synergies, scarcity value, or competitive auction dynamics."</p>

<h3>Question 11: Why would you use EV / EBITDA rather than P / E?</h3>
<p><strong>Strong answer:</strong> "EV / EBITDA is capital structure neutral because enterprise value includes debt and equity while EBITDA is pre-interest. That makes it useful for comparing companies with different leverage levels. P / E can be distorted by differences in capital structure, tax rates, and non-operating items."</p>`,
  },
  {
    title: '8.3 M&A Questions (Q12–Q14)',
    content: `<h3>Question 12: What makes a deal accretive or dilutive?</h3>
<p><strong>Strong answer:</strong> "A deal is accretive if the acquirer's pro forma EPS increases after including the target's earnings, synergies, financing costs, foregone interest, incremental D&amp;A or amortization, and any new shares issued. It is dilutive if pro forma EPS decreases. Conceptually, the deal is accretive when the earnings contribution from the target and synergies outweighs the financing and accounting drag on a per-share basis."</p>
<p><strong>What interviewers are testing:</strong> Whether you understand the real drivers, not just the definition.</p>
<p><strong>Follow-ups:</strong> Why does relative P / E matter in stock deals? Does accretive mean value-creating?</p>

<h3>Question 13: Why can a higher-P / E buyer buy a lower-P / E target accretively in a stock deal?</h3>
<p><strong>Strong answer:</strong> "Because the buyer is effectively using higher-valued shares as acquisition currency to purchase a stream of earnings at a cheaper implied multiple. All else equal, that tends to be EPS-accretive. But it is only a shortcut intuition, because premium, synergies, and purchase accounting also matter."</p>

<h3>Question 14: What is goodwill?</h3>
<p><strong>Strong answer:</strong> "Goodwill is the residual amount created in an acquisition when the purchase price exceeds the fair value of the target's identifiable net assets. It often reflects factors like synergies, brand value, customer relationships not separately recognized, and the control premium paid."</p>`,
  },
  {
    title: '8.4 LBO Questions (Q15–Q16)',
    content: `<h3>Question 15: What is an LBO?</h3>
<p><strong>Strong answer:</strong> "An LBO is an acquisition where a private equity sponsor buys a company using a meaningful amount of debt financing. The sponsor contributes a smaller equity check, uses the target company's cash flows to service and repay the debt over time, and then aims to sell the company later at a higher equity value, generating an attractive return on invested equity."</p>

<h3>Question 16: What makes a good LBO candidate?</h3>
<p><strong>Strong answer:</strong> "A good LBO candidate usually has stable, predictable cash flow, solid margins, manageable CapEx and working capital needs, and enough debt capacity to support leverage. Sponsors also like businesses with opportunities for operational improvement and a credible exit path."</p>`,
  },
  {
    title: '8.5 Trick / Edge-Case Questions (Q17–Q20) + How to Use the Question Bank',
    content: `<h3>Question 17: Why might a company with negative net income still have strong valuation?</h3>
<p><strong>Strong answer:</strong> "Because valuation is based on future cash flow potential, not just current net income. A high-growth company may be intentionally investing heavily today, depressing current earnings, while still having attractive long-term free cash flow economics. In those cases, revenue growth, margin trajectory, and unit economics may matter more than current GAAP earnings."</p>

<h3>Question 18: Why is EBITDA flawed?</h3>
<p><strong>Strong answer:</strong> "EBITDA is useful as a rough operating metric, but it ignores working capital, taxes, and capital expenditures. That means it can materially overstate the true cash-generating ability of a business, especially if the company is capital intensive or needs significant reinvestment to sustain performance."</p>

<h3>Question 19: Why can two companies with the same EBITDA trade at different valuations?</h3>
<p><strong>Strong answer:</strong> "Because valuation depends on more than current EBITDA. Differences in growth, margin trajectory, cash conversion, capital intensity, return on invested capital, risk, and business quality can all justify different multiples."</p>

<h3>Question 20: If interest rates rise, what happens to valuation?</h3>
<p><strong>Strong answer:</strong> "In most cases valuation declines because higher rates tend to increase discount rates and compress market multiples. The exact impact depends on the company's cash flow duration, leverage, and sector characteristics."</p>

<h3>8.6 How to Use the Question Bank</h3>
<p>Do not memorize each answer word-for-word. Instead: Learn the structure of the answer, Learn the intuition behind it, Re-say it in your own language, Practice follow-up questions.</p>

<h3>Module 8 Practice Drills</h3>
<p><strong>Technical drills:</strong> Take the 20 questions above and answer each: 1) In one sentence, 2) In a 30-second strong version, 3) In a longer interview-ready version.</p>
<p><strong>Interview-style drill:</strong> Have someone randomly ask you 15 questions from this module and force yourself to answer without notes.</p>
<p><strong>Explain-out-loud exercise:</strong> For each weak answer, say why it is weak and improve it live.</p>
<p><strong>Self-testing framework — For any technical question, structure your answer as:</strong></p>
<ol><li>Definition</li><li>Why it matters</li><li>Mechanics</li><li>Nuance / caveat</li></ol>`,
  },
];
