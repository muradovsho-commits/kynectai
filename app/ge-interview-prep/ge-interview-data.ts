export const GE_INTERVIEW_SECTIONS = [
  {
    title: 'GE Interview Format',
    content: `<p>Growth equity interviews typically include three types of assessments:</p>

<p><strong>Technical questions (40-50%):</strong> Unit economics, SaaS metrics, valuation, accounting, GE-specific structuring (liquidation preferences, dilution, preferred stock mechanics). You need to know these cold.</p>

<p><strong>Investment pitch / stock pitch (30-40%):</strong> Present a company you'd invest in. For GE, this should be a growth-stage private company or a recently public company with GE-like characteristics. Structure it like an IC memo: thesis, market, metrics, risks, valuation, returns.</p>

<p><strong>Behavioral / fit (20-30%):</strong> Why GE (not VC, not buyout)? Walk me through your resume. Tell me about a time you evaluated a business. What sectors interest you?</p>`,
  },
  {
    title: 'Technical Questions',
    content: `<div class="interview-q">
<div class="q-label">Q1</div>
<div class="question">What is growth equity and how does it differ from VC and buyout?</div>
<div class="answer">Growth equity invests in companies that have already proven their business model and achieved meaningful scale (typically $10M-$200M+ revenue growing 20%+) but need capital to accelerate growth. Unlike VC, the product-market fit is proven and unit economics are established-the risk is execution and scaling, not product viability. Unlike buyout, GE takes minority positions (20-40%), uses no leverage, and partners with management rather than replacing them. Returns are driven by revenue growth and margin expansion, not financial engineering. GE sits in the sweet spot of lower loss rates than VC but higher growth potential than buyout.</div>
</div>

<div class="interview-q">
<div class="q-label">Q2</div>
<div class="question">A SaaS company has $30M ARR, 45% growth, 78% gross margins, NRR of 118%, and is burning $8M per year. Would you invest? What else do you need to know?</div>
<div class="answer">The headline metrics are strong: 45% growth is well above the threshold for GE, gross margins are healthy for SaaS, and 118% NRR indicates strong expansion and low churn. The $8M annual burn on $30M ARR is manageable-it implies the company is investing in growth, not structurally unprofitable. I'd want to know: (1) What's driving the burn? Is it primarily S&M spend that could be dialed back, or is it structural R&D costs? (2) What's the CAC payback period and LTV/CAC ratio? Even with strong NRR, if CAC payback is 30+ months, the growth is very capital-intensive. (3) How concentrated is the customer base? If 30% of ARR comes from 3 customers, there's significant concentration risk. (4) What's the competitive landscape? If there are 5 well-funded competitors in the space, the 45% growth might not be sustainable. (5) What's the use of proceeds? Is the capital going to productive growth (sales hiring, new products) or just covering inefficiency? (6) What valuation is the company asking? At 15x ARR ($450M), the entry might be reasonable; at 30x ARR ($900M), the return math gets very challenging.</div>
</div>

<div class="interview-q">
<div class="q-label">Q3</div>
<div class="question">Explain LTV/CAC and why it matters. What's a good ratio and what drives it?</div>
<div class="answer">LTV/CAC is the ratio of the total gross profit a customer generates over their lifetime (LTV) to the cost of acquiring that customer (CAC). It tells you whether growth is creating or destroying value. A ratio above 3.0x is generally considered healthy: you earn $3 for every $1 spent on acquisition. Above 5x suggests the company could invest more aggressively. Below 1.0x means you're losing money on each customer. LTV is driven by: ARPU (higher revenue per customer), gross margin (higher margins mean more profit per revenue dollar), and retention (lower churn extends the customer lifetime). CAC is driven by: sales efficiency (shorter sales cycles, higher close rates), marketing efficiency (lower cost per lead, higher conversion), and expansion revenue (if existing customers expand, the blended CAC drops because expansion has near-zero incremental acquisition cost). NRR above 100% dramatically improves effective LTV/CAC because existing customers are getting more valuable without additional acquisition spend.</div>
</div>

<div class="interview-q">
<div class="q-label">Q4</div>
<div class="question">What is Net Revenue Retention and why is it the most important SaaS metric?</div>
<div class="answer">NRR measures how much revenue from existing customers grows or shrinks over time, excluding new customer acquisition. It's calculated as: (Beginning ARR + Expansion − Churn − Contraction) / Beginning ARR. NRR above 100% means your existing customers are generating more revenue than they were a year ago. It's the most important metric because: (1) It's a direct measure of product-market fit-if customers are expanding their usage and renewing, the product is delivering value. (2) It's the most capital-efficient growth lever-expanding existing customers costs a fraction of acquiring new ones. (3) It demonstrates a compounding advantage: a company with 120% NRR doubles its revenue from existing customers every ~3.5 years with zero new sales. (4) It's the hardest metric to fake-unlike new logo acquisition (which can be temporarily inflated with discounts), NRR reflects genuine customer satisfaction and product value.</div>
</div>

<div class="interview-q">
<div class="q-label">Q5</div>
<div class="question">Walk me through how you'd build a GE returns model.</div>
<div class="answer">Start with the entry: investment amount, pre-money valuation, post-money valuation, and ownership percentage. Then project revenue for 4-6 years using a bottom-up build (cohorts for SaaS, or segment-by-segment for other models). Model the path to profitability: project COGS and each OpEx category as a percentage of revenue, showing how margins expand with scale. Then model future dilution: assume 1-2 additional funding rounds and option pool refreshes, and track how your ownership percentage changes (and whether you participate pro-rata). For the exit, apply an exit multiple (based on comparable public companies or recent M&A) to the relevant forward metric (ARR, revenue, EBITDA) in the exit year. Multiply exit enterprise value by your ownership percentage at exit to get your share of proceeds. Compare to invested capital to calculate MOIC and IRR. Build a sensitivity table on exit multiple vs. revenue growth to show how returns vary across scenarios.</div>
</div>

<div class="interview-q">
<div class="q-label">Q6</div>
<div class="question">What is a liquidation preference and why does it matter?</div>
<div class="answer">A liquidation preference is the right of preferred stockholders (the GE investor) to receive a specified amount before common shareholders in any liquidity event (sale, IPO, liquidation). A 1x non-participating preference means the investor receives their invested capital back first, then can choose to either take that amount or convert to common stock and share proportionally in the total proceeds (whichever is higher). It matters because it provides downside protection: if the company is sold for less than the post-money valuation, the investor recovers their capital before founders and employees receive anything. In a strong exit, the investor converts to common and the preference becomes irrelevant. The preference protects you in scenarios where the company exits at a flat or down valuation.</div>
</div>

<div class="interview-q">
<div class="q-label">Q7</div>
<div class="question">Why growth equity instead of VC or buyout?</div>
<div class="answer">GE appeals to me because it combines the analytical rigor of PE (financial modeling, disciplined evaluation, structured deal processes) with the entrepreneurial energy of VC (working with founders building category-defining companies). In VC, much of the investment thesis is based on vision and potential-you're betting on a team and a market before the product is proven. In buyout, the companies are established but the work is more about optimization than growth. GE offers the best of both: the companies have proven their product and unit economics, so the analysis is grounded in real data, but the growth potential is enormous, so the upside is much larger than a typical buyout. I'm also drawn to the collaborative dynamic: GE investors are partners to management, not controllers, which requires building genuine relationships and trust. And the focus on revenue growth and operating leverage aligns with how I naturally think about businesses.</div>
</div>

<div class="interview-q">
<div class="q-label">Q8</div>
<div class="question">What is the Rule of 40 and how do you use it?</div>
<div class="answer">The Rule of 40 says a healthy software company should have a combined revenue growth rate plus profit margin (typically FCF or EBITDA margin) of at least 40%. A company growing 50% with -10% margins scores 40%-passing. A company growing 15% with 30% margins scores 45%-also passing. It captures the trade-off between growth and profitability: it's fine to sacrifice margins for growth (or vice versa) as long as the total exceeds the threshold. In GE, I use it as a quick screening tool: companies consistently above 40% are operating at best-in-class efficiency. Below 20% raises concerns about whether the company can achieve attractive returns. But it's a heuristic, not a rule-I'd never reject a company solely because it's at 35%, nor invest solely because it's at 50%. The underlying drivers matter more than the composite number.</div>
</div>`,
  },
  {
    title: 'The Investment Pitch',
    content: `<p>For GE interviews, you should prepare at least one investment pitch. Unlike buy-side equity pitches (which focus on publicly traded stocks), GE pitches should ideally focus on a <strong>growth-stage company</strong> that fits the GE mandate. If you can't access private company data, choose a recently public company with GE-like characteristics (rapid growth, SaaS/recurring model, expanding margins) and pitch it as if you were evaluating it for a GE investment at the time of its last private round.</p>

<div class="pitch-box">
<div class="pitch-label">Investment Pitch Structure</div>
<p><strong>1. One-sentence thesis:</strong> "I'd invest in [Company X] because it has a dominant position in a large, underpenetrated market with best-in-class unit economics and multiple expansion levers."</p>
<p><strong>2. Company overview (60 seconds max):</strong> What does it do, who are its customers, and how does it make money?</p>
<p><strong>3. Market opportunity:</strong> TAM, growth rate, secular tailwinds. Why is this market interesting <em>now</em>?</p>
<p><strong>4. Why this company wins:</strong> Competitive moat, key metrics (NRR, growth, margins, LTV/CAC), and what the company does better than alternatives.</p>
<p><strong>5. Growth levers:</strong> What specific initiatives will drive the next phase of growth? New products, new segments, international expansion, price increases?</p>
<p><strong>6. Financial overview &amp; returns:</strong> Current revenue, growth trajectory, path to profitability, proposed valuation, expected MOIC and IRR.</p>
<p><strong>7. Risks and mitigants:</strong> 2-3 key risks, each with a specific reason why it's manageable.</p>
</div>`,
  },
  {
    title: 'Common GE Interview Mistakes',
    content: `<div class="mistake-box">
<strong>Mistake 1: Treating GE like buyout.</strong> Talking about leverage, LBO mechanics, and cost-cutting signals that you don't understand the growth-oriented nature of GE investing. Focus on revenue growth, unit economics, and scaling dynamics instead.
</div>

<div class="mistake-box">
<strong>Mistake 2: Not knowing your metrics.</strong> If you can't define NRR, LTV/CAC, CAC payback, and the Rule of 40 off the top of your head with numerical examples, you're not ready for a GE interview. These aren't nice-to-know-they're the analytical vocabulary of the job.
</div>

<div class="mistake-box">
<strong>Mistake 3: Pitching a company with no moat.</strong> "It's growing fast" is not a thesis. You must articulate <em>why</em> the company will continue to win: network effects, switching costs, proprietary data, regulatory barriers. Without a moat, fast growth is unsustainable.
</div>

<div class="mistake-box">
<strong>Mistake 4: Ignoring dilution in your returns analysis.</strong> A GE firm that enters at 25% ownership won't own 25% at exit if the company raises additional rounds. Modeling returns without accounting for dilution shows a lack of understanding of GE mechanics and overstates expected returns.
</div>

<div class="mistake-box">
<strong>Mistake 5: Not having a view on valuation.</strong> "It's a great company" isn't enough. You need a view on what the company is worth, what you'd pay, and what returns that entry price generates across different scenarios. Growth equity is not venture capital-price discipline matters.
</div>

<div class="takeaway-box">
<strong>The Growth Equity Mindset:</strong> Growth equity investing is fundamentally about finding the rare companies that have cracked the code on their core business and now need fuel to scale. Your job is to separate the companies where growth will compound and create enormous value from the companies where growth is masking unsustainable economics or an eroding competitive position. The metrics in this guide are your tools, but the judgment to weigh them correctly-to know when 30% growth is more impressive than 60% growth because of how it's achieved, or when a high NRR masks underlying customer dissatisfaction-is what makes a great GE investor. That judgment comes from reps: analyzing companies, building models, conducting customer calls, and developing pattern recognition across dozens of investments. Start building that pattern recognition now.
</div>

</div>`,
  },
];
