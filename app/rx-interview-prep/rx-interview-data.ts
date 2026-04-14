export const RX_INTERVIEW_SECTIONS = [
  {
    title: 'Contextual Questions',
    content: `<div class="interview-q">
<div class="q-label">Q1</div>
<div class="question">What does a restructuring banker actually do?</div>
<div class="answer">A restructuring banker helps companies right-size their capital structures to ensure long-term viability. If advising the debtor, you analyze the capital structure, assess liquidity, identify the sources of distress, and propose restructuring alternatives-ranging from simple maturity extensions to full Chapter 11 reorganizations. If advising creditors, you advocate for solutions that maximize their recovery. The work involves building cap tables, analyzing credit documents for key provisions (springers, baskets, covenant thresholds), modeling restructuring scenarios, and supporting negotiations among multiple parties with competing interests.</div>
</div>

<div class="interview-q">
<div class="q-label">Q2</div>
<div class="question">Why RX instead of M&amp;A?</div>
<div class="answer">RX combines finance, law, and multi-party negotiation in a way that M&A doesn't. Every deal is genuinely unique because every capital structure is different, creating different dynamics among creditor classes. RX also offers exposure to the entire capital structure (from revolvers to equity), which develops a deeper understanding of how value flows through a business. The work is industry-agnostic and counter-cyclical (there's always demand in downturns, and even in strong economies, individual sectors face distress). And RX develops skills that transfer well to distressed investing, private credit, and special situations.</div>
</div>

<div class="interview-q">
<div class="q-label">Q3</div>
<div class="question">Why don't bulge bracket banks have RX advisory practices?</div>
<div class="answer">Because of conflicts of interest. A bank that arranged or underwrote a company's debt (through its leveraged finance or debt capital markets groups) would face an obvious conflict in then advising that company on restructuring the same debt. The bank played a role in creating the capital structure that's now causing distress. This is why RX advisory is concentrated at independent boutiques that don't have lending or underwriting operations.</div>
</div>`,
  },
  {
    title: 'Technical Questions',
    content: `<div class="interview-q">
<div class="q-label">Q4</div>
<div class="question">In a distressed situation, which financial statement matters most?</div>
<div class="answer">The Cash Flow Statement. Ultimately, distress is about liquidity-whether the company has enough cash to meet its obligations. The Income Statement tells you about accounting profitability, but a company can be "profitable" and still run out of cash (if AR is ballooning, CapEx is consuming all cash flow, or working capital is deteriorating). In Chapter 11, companies must file monthly operating reports showing actual cash inflows and outflows. Accrual accounting is informative, but cash is what determines survival.</div>
</div>

<div class="interview-q">
<div class="q-label">Q5</div>
<div class="question">You have a leverage ratio of 5x and a coverage ratio of 5x. What's the interest rate?</div>
<div class="answer">Leverage = Debt / EBITDA = 5, so Debt = 5 × EBITDA. Coverage = EBITDA / Interest Expense = 5, so Interest Expense = EBITDA / 5. Interest Rate = Interest Expense / Debt = (EBITDA / 5) / (5 × EBITDA) = 1/25 = <strong>4%</strong>. The EBITDA cancels out, leaving a clean algebraic result.</div>
</div>

<div class="interview-q">
<div class="q-label">Q6</div>
<div class="question">A company has $50M EBITDA valued at 6x. It has $400M in total debt and zero cash. What's the enterprise value, equity value, and where does the debt trade?</div>
<div class="answer">EV = $50M × 6x = $300M. Since total debt ($400M) exceeds EV ($300M), equity value is effectively zero (or a very small positive value reflecting optionality pre-filing). Debt can't trade at par because the assets don't fully cover it. Instead, debt trades at the ratio of EV to total debt: $300M / $400M = 0.75, or 75 cents on the dollar. If the company finds $100M in cash, debt would trade back up to par (now $400M in value covering $400M in debt), and equity would remain near zero-the cash benefit accrues to debt holders, not equity holders.</div>
</div>

<div class="interview-q">
<div class="q-label">Q7</div>
<div class="question">A bond has a current price of 80, a 10% coupon, and matures next year. What's the YTM? What if it matures in two years instead?</div>
<div class="answer">For a one-year maturity, YTM is exact: (Coupon + Price Appreciation) / Current Price = ($10 + $20) / $80 = 37.5%. For a two-year maturity, use the estimated YTM formula: (10 + (20/2)) / ((100 + 80) / 2) = 20 / 90 = 22.2%. The two-year YTM is lower because the $20 price appreciation is spread over two years instead of one. This should be intuitive: you're waiting longer to receive the same gain.</div>
</div>

<div class="interview-q">
<div class="q-label">Q8</div>
<div class="question">A company has $50M in unsecured notes coming due in a year and $70M in liquidity. Nothing else matures before these notes. Yet the notes trade at 60 cents. What's going on?</div>
<div class="answer">This is a classic RX question testing your knowledge of springing maturities. The most likely explanation: a more senior tranche (a term loan or revolver) has a springing maturity provision that triggers if the unsecured notes aren't refinanced by a certain date. When the springer triggers, the senior tranche matures <em>before</em> the unsecured notes-and the senior tranche is likely much larger than $70M of liquidity. Additionally, the $70M in "liquidity" may be mostly revolver capacity with drawdown restrictions (borrowing base limitations, covenant triggers), not true cash. The company may be unable to refinance the notes because of poor operating performance. So the notes trade at 60 reflecting the expected recovery in a restructuring that the market sees as increasingly inevitable.</div>
</div>

<div class="interview-q">
<div class="q-label">Q9</div>
<div class="question">Walk me through a Chapter 11 process.</div>
<div class="answer">The company files a petition with the bankruptcy court, triggering an automatic stay that halts all creditor collection actions. The company secures DIP financing to fund operations during the case. It then develops (or finalizes, if pre-negotiated) a Plan of Reorganization specifying how each creditor class will be treated. Impaired classes vote on the plan-acceptance requires two-thirds in dollar amount and a majority in number of each class. The court confirms the plan if it's fair, equitable, and feasible. If a class rejects, the court may cramdown the plan if it satisfies statutory requirements. Upon confirmation, the company emerges with a new capital structure, old equity is typically cancelled, and the fulcrum creditor class receives the reorganized equity.</div>
</div>

<div class="interview-q">
<div class="q-label">Q10</div>
<div class="question">What's a fulcrum security and why does it matter?</div>
<div class="answer">The fulcrum security is the class of debt where enterprise value is exhausted-everything above it recovers in full, everything below it recovers nothing (or very little). It matters because the fulcrum class typically receives the reorganized equity in a Chapter 11, making it the class that "owns" the company post-bankruptcy. Distressed investors actively seek to acquire the fulcrum security at a discount, betting that the reorganized equity will be worth more than their purchase price. Identifying the fulcrum security requires a valuation of the enterprise and a waterfall analysis of the capital structure.</div>
</div>

<div class="interview-q">
<div class="q-label">Q11</div>
<div class="question">What restructuring alternatives would you propose for a company with high secured leverage, upcoming maturities, and declining EBITDA?</div>
<div class="answer">Start with the goals: push out maturities, reduce cash interest, improve liquidity. Potential alternatives: (1) Amend and extend the secured debt, offering a modest paydown and consent fee in exchange for pushing maturities out 2-3 years. (2) Exchange unsecured notes for new secured notes at a lower face value (creditors trade down in principal but up in priority). (3) Convert a portion of subordinated debt to equity, dramatically reducing leverage and interest expense. (4) Raise new capital through a rights offering or equity infusion from the sponsor. (5) If out-of-court solutions fail, file a pre-packaged Chapter 11 with a pre-negotiated POR that equitizes the impaired classes. Present each alternative with a pro forma cap table showing the improved leverage and coverage ratios.</div>
</div>`,
  },
  {
    title: 'The Case Study Format',
    content: `<p>Some firms (notably Houlihan Lokey and Evercore) use case studies during superday interviews. The format: you're given a vague prompt ("We're looking at a company with a Term Loan, Senior Notes, and Sub Notes. Which should we invest in?") and must ask clarifying questions to arrive at an answer.</p>

<p>The sequence typically follows: (1) Ask for the face value, trading price, coupon, and maturity of each tranche to build a cap table. (2) Calculate approximate YTMs to rank the risk/return profile of each tranche. (3) Ask for EBITDA, the valuation multiple, and CapEx to estimate enterprise value and free cash flow. (4) Run a waterfall to determine recovery values for each class. (5) Compare the risk-adjusted returns: the tranche with the best ratio of expected recovery (or par, if you expect no restructuring) to current price is the best investment. (6) Present your recommendation with clear reasoning.</p>

<p>The case is collaborative-you'll need to ask your interviewer for data at each step. The expectation is not that you solve it instantly, but that you demonstrate a systematic approach, ask intelligent questions, and show comfort with the core RX concepts. Making small calculation errors is fine; heading off in completely the wrong direction is not.</p>

<div class="takeaway-box">
<strong>The RX Mindset:</strong> Restructuring is fundamentally about understanding that a company's value and its obligations are two separate realities, and that the gap between them creates both crisis and opportunity. The capital structure is not just a list of debts-it's a map of competing claims, legal rights, and negotiating leverage. Mastering this map-knowing where the pressure points are, where value breaks, and how different parties will behave-is what separates a strong restructuring analyst from someone who merely knows the definitions. Develop your intuition for capital structures and you'll be prepared for any interview question or live deal that comes your way.
</div>

</div>`,
  },
];
