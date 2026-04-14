export const AM_INTERVIEW_SECTIONS = [
  {
    title: 'Interview Format',
    content: `<p>Buy-side interviews typically combine three components: <strong>technical questions</strong> (valuation, accounting, financial concepts), <strong>stock pitches</strong> (see Module 8), and <strong>behavioral / fit questions</strong> (motivation, investment philosophy, personality). The weighting varies by firm type: hedge funds weight stock pitches most heavily; long-only mutual funds weight fundamental analysis and sector expertise; quant funds weight programming and statistics.</p>`,
  },
  {
    title: 'Technical Questions',
    content: `<div class="interview-q">
<div class="q-label">Question 1</div>
<div class="question">Walk me through how you'd analyze a stock from scratch.</div>
<div class="answer">Start with understanding the business: what does the company do, how does it make money, what are its competitive advantages? Then analyze the industry: size, growth, competitive dynamics, barriers to entry. Next, examine the financials: 5-year history of revenue growth, margins, ROIC, FCF conversion, and balance sheet health. Build a model projecting 3-5 years of financials based on key drivers. Value the company using a DCF and comparable multiples. Compare your intrinsic value estimate to the current market price. Develop a thesis: why does an opportunity exist (variant perception)? Identify catalysts that will close the gap. Assess the risks and determine if the risk/reward is attractive. Finally, determine position sizing based on conviction, liquidity, and correlation with the existing portfolio.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 2</div>
<div class="question">A company trades at 8x earnings while its peers trade at 15x. Is it cheap?</div>
<div class="answer">Not necessarily. A low multiple can reflect: slower growth, lower-quality earnings (one-time items, aggressive accounting), higher leverage (more risky capital structure), a deteriorating competitive position, pending litigation, management concerns, or a cyclical peak in earnings (which will mean-revert downward). Before calling it cheap, you need to understand <em>why</em> it's discounted. If the discount is due to a temporary, fixable issue (like a one-time legal settlement depressing this year's earnings), it may genuinely be undervalued. If it's due to structural decline (market share loss, technology disruption), the low multiple is justified and the stock may even be expensive.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 3</div>
<div class="question">What's the difference between ROIC and ROE?</div>
<div class="answer">ROE (Return on Equity) = Net Income / Shareholders' Equity. It measures the return earned on <em>equity investors'</em> capital. ROE can be inflated by leverage: a company with a lot of Debt and very little Equity can have a high ROE even with mediocre operating performance. ROIC (Return on Invested Capital) = NOPAT / Invested Capital (Equity + Debt − Cash). It measures the return earned on <em>all</em> capital deployed in the business, regardless of how it's funded. ROIC is a better measure of operating quality because it strips out capital structure effects. A company with 15%+ ROIC is generally creating value; below WACC, it's destroying value.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 4</div>
<div class="question">How do rising interest rates affect stock valuations?</div>
<div class="answer">Several channels. First, higher rates increase the Discount Rate (WACC), reducing the present value of future cash flows in a DCF-this affects all stocks but disproportionately impacts long-duration assets (growth stocks whose value depends on cash flows far in the future). Second, higher rates increase the Risk-Free Rate, raising the bar for equity returns: if you can earn 5% risk-free on Treasuries, you demand a higher return from stocks to justify the additional risk. Third, higher rates increase Debt servicing costs for leveraged companies, reducing earnings and potentially triggering credit stress. Fourth, higher rates can slow economic growth, reducing corporate revenue and earnings broadly. Not all stocks are affected equally: banks and insurance companies can benefit from higher rates (wider net interest margins), while utilities and REITs (which compete with bonds for income-seeking investors) tend to underperform.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 5</div>
<div class="question">What's your investment philosophy?</div>
<div class="answer">This is personal and there's no single right answer, but you need one. Examples: "I'm a long-term, fundamentals-driven investor. I look for companies with durable competitive advantages, high returns on capital, and strong management teams, trading at reasonable valuations. I'm willing to hold through volatility if my thesis is intact." Or: "I focus on inflection points-companies undergoing a positive change (new management, product cycle, margin expansion) that the market hasn't fully priced in. I'm a 12-18 month investor focused on catalysts." The key: be authentic, be specific, and be prepared to defend your philosophy with examples from your own investing or research experience.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 6</div>
<div class="question">Tell me about a time you were wrong on an investment. What did you learn?</div>
<div class="answer">Choose a real example where you had a clear thesis that didn't work out. Explain your original reasoning, what went wrong (was it the thesis, the timing, or an unforeseeable event?), and what you learned. The best answers show intellectual humility and a process improvement: "I was long a specialty retailer because I believed its e-commerce transition was underappreciated. The thesis was right on the revenue side, but I underestimated the margin dilution from fulfillment costs. I learned to stress-test margin assumptions more aggressively and to model the full economics of business model transitions, not just the top line." Never say you've never been wrong-that signals either inexperience or dishonesty.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 7</div>
<div class="question">Explain the Sharpe Ratio and its limitations.</div>
<div class="answer">The Sharpe Ratio measures risk-adjusted return: (Portfolio Return − Risk-Free Rate) / Portfolio Volatility. It tells you how much excess return you're earning per unit of risk. Higher is better. Limitations: (1) It treats upside and downside volatility equally, but investors care far more about downside volatility (the Sortino Ratio addresses this by using only downside deviation). (2) It assumes returns are normally distributed, which they're not in practice-real returns have fat tails, and Sharpe doesn't capture tail risk. (3) It can be manipulated by smoothing returns (illiquid strategies like private equity often report lower volatility simply because they mark to market less frequently). (4) It's time-period dependent: a fund with a 2.0 Sharpe over a 3-year bull market may have a 0.5 Sharpe over a full cycle.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 8</div>
<div class="question">If you had $1 million to invest today, how would you allocate it?</div>
<div class="answer">This tests your awareness of current market conditions, asset classes, and portfolio construction principles. A strong answer considers: your investment horizon, risk tolerance, and current valuations. Example: "Given current valuations and the interest rate environment, I'd allocate roughly 55% to equities (split between US large-cap quality stocks and international developed markets, which are cheaper on a relative basis), 25% to fixed income (a mix of short-duration investment-grade bonds and some TIPS for inflation protection), 10% to alternative assets (a small allocation to real assets like REITs or infrastructure for diversification), and 10% in cash equivalents or short-term Treasuries as dry powder for opportunities. I'm slightly underweight equities relative to a typical 60/40 benchmark because I believe valuations in some segments are stretched." The key: demonstrate thoughtfulness about diversification, valuations, and risk management, not just stock-picking.</div>
</div>`,
  },
  {
    title: 'Preparing for the Stock Pitch',
    content: `<p>Prepare <strong>at least two pitches</strong>: one long and one short. For each, you should be able to discuss: the business model in detail (revenue drivers, cost structure, competitive dynamics), the last 3 years of financial performance (growth, margins, FCF), the balance sheet (leverage, liquidity, capital allocation), your valuation (DCF + multiples, with the key assumptions), your thesis and variant perception, the catalyst, the risks and why they're manageable, and your suggested position size.</p>

<p>Be prepared for adversarial questioning. The interviewer will challenge your thesis: "What if interest rates rise 200 bps and the multiple compresses?" "What happens if their largest customer churns?" "Your revenue growth assumption is above the industry average-why do you think this company can outgrow its market?" If you can't defend against reasonable pushback, your conviction isn't high enough.</p>

<div class="takeaway-box">
<strong>The Buy-Side Mindset:</strong> Asset management is fundamentally about making decisions under uncertainty. You will never have perfect information, your models will always be wrong (the question is <em>how</em> wrong), and the market will frequently disagree with you for extended periods. What separates great investors from average ones is not superior intelligence but superior process: disciplined research, clear thinking, rigorous risk management, and the emotional fortitude to maintain conviction when the market moves against you-while remaining humble enough to change your mind when the evidence warrants it.
</div>

</div>`,
  },
];
