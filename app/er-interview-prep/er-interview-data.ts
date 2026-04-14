export const ER_INTERVIEW_SECTIONS = [
  {
    title: 'ER Interview Format',
    content: `<p>ER interviews typically include: <strong>stock pitch(es)</strong> (almost always-prepare at least two, one long and one short), <strong>technical questions</strong> (accounting, valuation, financial statement analysis), <strong>market and sector knowledge</strong> (What's happening in your sector? Where is the S&P? What's your view on interest rates?), and <strong>behavioral/fit</strong> (Why ER? Why this sector? Walk me through your resume).</p>

<p>The stock pitch is weighted most heavily. A strong pitch can compensate for a mediocre technical answer; a weak pitch is hard to overcome no matter how well you know your accounting.</p>`,
  },
  {
    title: 'Technical Questions',
    content: `<div class="interview-q">
<div class="q-label">Q1</div>
<div class="question">Walk me through how you'd analyze a stock from scratch.</div>
<div class="answer">Start with understanding the business model: how does the company make money, who are its customers, what are the key drivers? Then study the industry: market size, growth, competitive dynamics, barriers to entry. Analyze historical financials: 5-year trends in revenue growth, margins, ROIC, FCF conversion, and balance sheet health. Build a model projecting revenue (from unit-level drivers), margins, and EPS for the next 2-3 years. Compare your estimates to consensus to identify where you differ (your variant perception). Value the company using appropriate methodologies (P/E, EV/EBITDA, DCF). Determine if the stock is attractively priced relative to your estimated intrinsic value. Identify a catalyst that will cause the market to recognize the mispricing. Assess the risks and form a recommendation.</div>
</div>

<div class="interview-q">
<div class="q-label">Q2</div>
<div class="question">A company reports revenue that beats consensus by 3% but the stock drops 5%. What happened?</div>
<div class="answer">Several possible explanations: (1) The beat was driven by low-quality revenue (one-time items, channel stuffing, pull-forward from future quarters) that won't recur. (2) Forward guidance was disappointing-management lowered next quarter or full-year expectations, signaling deceleration. (3) The revenue mix shifted unfavorably (more revenue from a lower-margin segment, implying weaker profitability ahead). (4) Key operating metrics deteriorated (churn increased, new bookings slowed, backlog declined) even though current-quarter revenue was strong. (5) A broader market selloff coincided with the earnings report. (6) The "whisper number" (what the buy side actually expected, which is often above published consensus) was higher than the reported figure. The most common reason is #2: the market looks forward, and a revenue beat on a reduced outlook is net negative.</div>
</div>

<div class="interview-q">
<div class="q-label">Q3</div>
<div class="question">How would you determine the appropriate P/E multiple for a company?</div>
<div class="answer">Look at four things: (1) The company's own historical P/E range over 5-10 years-where has it typically traded, and what drove the highs and lows? (2) The P/E multiples of comparable companies-who are the closest peers by business model, growth, and risk profile, and what do they trade at? (3) The company's growth rate relative to peers-faster growth justifies a premium multiple; slower growth justifies a discount. The PEG ratio (P/E divided by earnings growth rate) can help normalize this comparison. (4) Qualitative factors: management quality, earnings visibility (recurring vs. lumpy revenue), balance sheet strength, and competitive position. A company with 15% earnings growth, a strong balance sheet, and a dominant market position in a growing industry might warrant a 22x P/E even if peers average 18x, because the risk-adjusted growth outlook is superior.</div>
</div>

<div class="interview-q">
<div class="q-label">Q4</div>
<div class="question">What's the difference between GAAP EPS and adjusted EPS? Which matters more?</div>
<div class="answer">GAAP EPS is calculated according to accounting standards and includes all items: stock-based compensation, amortization of intangibles, restructuring charges, impairments, and other one-time items. Adjusted EPS (also called "non-GAAP" or "pro forma") excludes items that management deems non-recurring or non-cash. The truth is that both matter, and neither is "better" in all situations. GAAP EPS is more conservative and captures the full economic cost of running the business (including SBC, which is a real cost to shareholders through dilution). Adjusted EPS is more useful for understanding recurring earning power if the adjustments are genuinely one-time. The red flag: if a company takes "one-time" charges every year, they're not one-time. I always look at both and pay close attention to the gap. A company where GAAP EPS is $3 and adjusted EPS is $5 is telling you that $2 per share in costs are being swept under the rug, and you need to understand what those costs are and whether they'll truly go away.</div>
</div>

<div class="interview-q">
<div class="q-label">Q5</div>
<div class="question">You cover a company that just announced a large acquisition. How would you analyze it?</div>
<div class="answer">First, assess the strategic rationale: Does it make sense for this company to buy this target? Does the target fill a capability gap, enter a new market, or provide cross-selling opportunities? Or is it an empire-building deal with dubious synergies? Second, analyze the price: What multiple was paid relative to the target's financials and comparable transactions? Is the premium justified? Third, model the financial impact: EPS accretion/dilution (combining the financials, adjusting for financing costs, new D&A from purchase price allocation, and synergies), pro forma leverage (can the combined company handle the additional debt?), and pro forma returns on capital (does the acquisition improve or destroy ROIC?). Fourth, evaluate the execution risk: Are the promised synergies realistic? Does management have a track record of integrating acquisitions successfully? Fifth, assess the impact on your thesis: Does this acquisition strengthen or weaken the original investment case? Depending on the answers, I might upgrade, downgrade, or maintain my rating, and I'd revise my model and target price to reflect the transaction.</div>
</div>

<div class="interview-q">
<div class="q-label">Q6</div>
<div class="question">Why equity research? Why not investment banking or the buy side?</div>
<div class="answer">ER uniquely combines deep company and industry expertise with the ability to form and publish independent investment opinions. In banking, you advise on transactions but don't take a view on whether a stock is cheap or expensive. On the buy side, you analyze companies deeply but your work is internal and you don't develop the broad coverage and public reputation that comes with sell-side research. ER appeals to me because I want to become a recognized expert in a specific sector, build relationships with management teams and institutional investors, and produce analysis that directly influences investment decisions. I'm also drawn to the rhythm of ER: the combination of deep, ongoing company coverage with the adrenaline of earnings season creates a pace that keeps the work intellectually fresh. Long-term, the sector expertise I build in ER positions me well for a move to the buy side, a corporate strategy role, or a senior advisory position-but I want to develop that expertise first through the sell-side's broader coverage model.</div>
</div>

<div class="interview-q">
<div class="q-label">Q7</div>
<div class="question">Tell me about a stock you follow and what's your view.</div>
<div class="answer">This is the stock pitch question in disguise. Don't wing it. Present a prepared, well-researched pitch following the structure in Module 9. The interviewer will follow up with probing questions to test the depth of your knowledge. You should know: the company's last quarter results and how they compared to estimates, the current valuation (P/E, EV/EBITDA) and how it compares to the historical range and peers, the 2-3 key drivers of the investment thesis, the upcoming catalyst, and the primary risk. If you can't speak fluently about all of these, choose a different stock.</div>
</div>

<div class="interview-q">
<div class="q-label">Q8</div>
<div class="question">What sector are you interested in covering, and what's an important trend in that sector right now?</div>
<div class="answer">Have a genuine, specific answer. Don't say "technology" without being more specific (enterprise software? semiconductors? cybersecurity?). Pick a sector you've actually spent time studying and name a specific trend you can discuss intelligently for 3-5 minutes. Example: "I'm interested in healthcare services, specifically the shift toward value-based care. CMS is increasingly tying reimbursement to patient outcomes rather than volume of services, which is creating a massive opportunity for companies that can help healthcare providers manage risk-based contracts. Companies like [X] and [Y] are well-positioned because they combine clinical analytics with care management infrastructure. I think this is a secular shift that will reshape the healthcare services landscape over the next decade, and there are several underappreciated investment opportunities within it." This demonstrates genuine interest, specific knowledge, and the ability to connect macro trends to company-level investment theses.</div>
</div>`,
  },
  {
    title: 'Common ER Interview Mistakes',
    content: `<div class="mistake-box">
<strong>Not having a stock pitch ready.</strong> You will be asked. There is a 100% chance. Prepare two: one long and one short. Know them cold. If your pitch is weak, the interview is over regardless of your technical skills.
</div>

<div class="mistake-box">
<strong>Not following the markets.</strong> You're applying for a job that requires you to have opinions about stocks and markets. If you can't tell the interviewer where the S&P 500 is, what happened in markets this week, or what the Fed did at its last meeting, you signal a lack of genuine interest.
</div>

<div class="mistake-box">
<strong>Confusing ER with investment banking.</strong> ER is not about financial modeling for deal execution. It's about forming investment opinions based on fundamental analysis of public companies. If your answer to "Why ER?" sounds like "I want to build models and advise on transactions," you're describing a banking role.
</div>

<div class="mistake-box">
<strong>No sector of interest.</strong> ER analysts are sector specialists. "I'm interested in everything" signals that you haven't thought seriously about what you want to cover. Pick a sector, learn about it, and be ready to discuss it with passion and specificity.
</div>

<div class="mistake-box">
<strong>Memorizing definitions without understanding application.</strong> Knowing that P/E = Price / Earnings is worthless. Knowing that a company's P/E compressed from 22x to 16x because growth decelerated from 15% to 8% after the loss of a major customer contract, and that the market is now pricing in low-single-digit growth in perpetuity even though the pipeline suggests mid-teens growth will resume in two quarters-that's what gets you the offer.
</div>

<div class="takeaway-box">
<strong>The ER Mindset:</strong> The best equity research analysts share three traits. First, they're genuinely curious about businesses-they find it intrinsically interesting to understand why a company succeeds or fails, how an industry evolves, and what drives a stock price. Second, they have intellectual honesty-they change their view when the evidence changes, acknowledge uncertainty, and distinguish between what they know and what they're guessing. Third, they communicate with clarity and conviction-distilling complex analysis into simple, actionable conclusions that busy investors can use to make decisions. If these traits describe you, you'll thrive in equity research. If they don't, no amount of technical preparation will substitute.
</div>

</div>`,
  },
];
