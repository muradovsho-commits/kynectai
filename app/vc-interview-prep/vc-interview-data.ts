export const VC_INTERVIEW_SECTIONS = [
  {
    title: 'VC Interview Format',
    content: `<p>VC interviews are less standardized than banking or PE interviews. Expect: market and sector knowledge ("What's an interesting trend you're following?"), startup evaluation ("Here's a company-would you invest?"), investment thesis / company pitch ("Tell me about a company you'd invest in"), deal mechanics (term sheets, cap tables, dilution math), and fit/behavioral (Why VC? What have you built? How do you develop conviction?). Some firms also include case studies: you're given a deck from a real startup and asked to present your investment recommendation.</p>`,
  },
  {
    title: 'Questions',
    content: `<div class="interview-q">
<div class="q-label">Q1</div>
<div class="question">What is the power law and why does it matter for VC portfolio construction?</div>
<div class="answer">VC returns follow a power law: a tiny number of investments generate the vast majority of returns. In a typical fund, 1-3 investments out of 25-30 will return more than all the others combined. This has profound implications: (1) VCs should optimize for finding outliers, not for avoiding losses. Passing on a future $10B company is far more costly than investing in a startup that goes to zero. (2) Portfolio construction must give you enough "at bats" to catch an outlier-too few investments and you may miss entirely. (3) Follow-on strategy matters enormously: once you've identified a winner, you must invest aggressively to maintain ownership, because that's where the returns come from. (4) Diversification within a VC fund doesn't work the same as in public markets. You're not trying to smooth returns; you're trying to maximize the probability of catching a single massive winner.</div>
</div>

<div class="interview-q">
<div class="q-label">Q2</div>
<div class="question">A startup has $2M ARR growing 15% month-over-month, 90% gross margins, and is raising a $15M Series A at a $60M post-money valuation. Would you invest?</div>
<div class="answer">The metrics are very strong: 15% MoM growth implies ~5x annual growth (the company would hit ~$10M ARR within a year). 90% gross margins are excellent-this is clearly a software business. The valuation of $60M post on $2M ARR is 30x current ARR, which seems high but is reasonable given the growth rate (at 5x growth, they'd be at $10M ARR in a year, making the effective forward multiple ~6x). I'd want to explore: (1) What's driving the growth? Is it organic/product-led, or heavily dependent on paid acquisition? If CAC payback is over 18 months, the growth may not be sustainable. (2) What's the retention like? High MoM growth can mask churn if the company is just adding customers faster than it's losing them. I'd want to see cohort retention curves. (3) How big is the market? $2M ARR in a $500M TAM has lots of headroom; $2M in a $50M TAM hits a ceiling fast. (4) What's the competitive moat? At 5x growth, competitors will notice. Does the company have network effects, proprietary data, or switching costs? (5) How will the $15M be deployed? If it's going to scale an already-efficient growth engine, great. If it's needed to rebuild the product, that's a red flag. Assuming retention is strong, the market is large, and the growth is capital-efficient, I'd be inclined to invest.</div>
</div>

<div class="interview-q">
<div class="q-label">Q3</div>
<div class="question">What is a liquidation preference and why does it matter?</div>
<div class="answer">A liquidation preference gives investors the right to receive their investment back before common shareholders (founders and employees) in any liquidity event (sale, IPO, or liquidation). The standard is 1x non-participating preferred: the investor gets their money back first, then can choose to either take the 1x or convert to common and share pro-rata in the remaining proceeds (whichever is higher). It matters because it protects the investor's downside: if the company sells for less than the post-money valuation, the investor still recovers their capital before founders receive anything. In a strong exit, the preference becomes irrelevant because the conversion value exceeds the preference. It's essentially downside insurance with full upside participation. More aggressive structures (participating preferred, 2x+ preferences) can significantly reduce founder returns in modest outcomes and are important to understand when evaluating term sheets.</div>
</div>

<div class="interview-q">
<div class="q-label">Q4</div>
<div class="question">Tell me about a startup or technology trend you're excited about.</div>
<div class="answer">This is the VC equivalent of the stock pitch and it's asked in nearly every interview. You must have a genuine, well-researched answer. Structure it: (1) The trend/thesis: what's changing in the world that creates opportunity? (2) Why now: what enabling technology, regulation, or behavior change makes this the right moment? (3) A specific company (or category of company) that's well-positioned. (4) What makes it defensible: why can't an incumbent or a well-funded competitor replicate it? The best answers are specific, show original thinking, and connect macro trends to specific investment opportunities. Bad answers are generic ("AI is exciting") or uninformed (describing a company's pitch deck without understanding the market dynamics).</div>
</div>

<div class="interview-q">
<div class="q-label">Q5</div>
<div class="question">A VC fund invests $5M in a seed round for 20% of a company. The company later raises a Series A where the VC invests $3M to maintain their 20% (pro-rata). The company is then acquired for $200M. Walk through the VC's return.</div>
<div class="answer">Total invested: $5M (seed) + $3M (Series A pro-rata) = $8M. At exit, the VC owns 20% of $200M = $40M. MOIC: $40M / $8M = 5.0x. For the IRR, we'd need to know the timing: if seed was invested in Year 0, Series A in Year 1, and the exit in Year 4, the cash flows are: Year 0: −$5M, Year 1: −$3M, Year 4: +$40M. Using Excel's XIRR or approximation, the IRR would be roughly 55-60%. A few nuances: (1) The $40M assumes no additional dilution beyond the Series A. If there was a Series B where the VC didn't participate, their 20% would have diluted further. (2) The liquidation preference doesn't matter here because 20% × $200M = $40M far exceeds the $8M preference, so the VC would convert to common. (3) If the Management Option Pool represents, say, 15% of fully diluted shares and hasn't been accounted for, the VC's effective ownership would be lower (~17%), reducing proceeds to $34M and MOIC to 4.25x.</div>
</div>

<div class="interview-q">
<div class="q-label">Q6</div>
<div class="question">Why venture capital? Why not PE, banking, or starting a company yourself?</div>
<div class="answer">The honest version (adapt to your own story): VC uniquely combines three things I'm drawn to. First, the intellectual breadth-in a single week you might evaluate a cybersecurity company, a climate tech startup, and a consumer marketplace, each requiring you to rapidly develop conviction on a different technology, market, and team. Second, the relationship with founders-VC is a partnership, not a transaction. You're backing people at the most uncertain, ambitious moment of their careers, and the best VC relationships last decades. Third, the long feedback loops tied to genuine impact-unlike trading (where you know your P&L today) or banking (where you advise and move on), VC outcomes play out over 5-10 years, and the work directly shapes whether transformative companies succeed. I'm not starting a company because I believe my comparative advantage right now is in pattern recognition across many companies, not in operating one. And I chose VC over PE because I'm more energized by the ambiguity and vision of early-stage companies than by optimizing mature businesses.</div>
</div>

<div class="interview-q">
<div class="q-label">Q7</div>
<div class="question">What's the most common mistake VCs make?</div>
<div class="answer">Several good answers: (1) <strong>Pattern matching too rigidly.</strong> Rejecting founders who don't fit the "standard" profile (Ivy League, FAANG, repeat founder) causes VCs to miss outsiders who build the most disruptive companies. The founders of the most transformative companies often don't look like what VCs expect. (2) <strong>Investing in the narrative instead of the evidence.</strong> Charismatic founders can sell a compelling story, but the data (retention curves, unit economics, customer references) tells the truth. The best VCs are skeptical storytellers who verify every claim. (3) <strong>Not investing enough in winners.</strong> The power law means your best investments deserve the most capital. Spreading follow-on capital evenly across the portfolio (instead of concentrating in breakout performers) destroys returns. (4) <strong>Timing error-being too early.</strong> Many of the best ideas in tech were attempted 5-10 years before they succeeded (WebVan before Instacart, Pets.com before Chewy). Being early and being wrong look identical in real-time.</div>
</div>`,
  },
  {
    title: 'Common VC Interview Mistakes',
    content: `<div class="mistake-box">
<strong>Not having a company to pitch.</strong> You will be asked about a startup you're excited about. Research 2-3 early-stage companies in sectors you genuinely find interesting. Know their product, traction, market, team, and why the opportunity is compelling. Bonus points for companies that aren't yet well-known.
</div>

<div class="mistake-box">
<strong>Talking like a banker.</strong> VC interviews reward curiosity, contrarianism, and intellectual range-not polished corporate-speak. Show genuine passion for technology and startups. Discuss products you use, founders you admire, and trends you follow. If your interview sounds like a banking interview, you haven't adapted.
</div>

<div class="mistake-box">
<strong>Not understanding the power law.</strong> If you evaluate startups by asking "Is this likely to succeed?" you're thinking like a PE investor. VCs ask "If this succeeds, could it be a $10B+ company?" The mental model is fundamentally different, and candidates who don't understand this signal a misfit for VC.
</div>

<div class="mistake-box">
<strong>No point of view on markets.</strong> VC is a thesis-driven business. "I'm interested in everything" signals that you haven't developed conviction about where the best opportunities lie. Pick 2-3 sectors, develop informed views, and be ready to debate them intelligently.
</div>

<div class="takeaway-box">
<strong>The VC Mindset:</strong> Venture capital is not about avoiding mistakes-it's about finding outliers. The biggest risk in VC isn't investing in a company that fails; it's <em>not</em> investing in a company that succeeds spectacularly. Every great VC has a portfolio of failures and one or two investments that made everything worthwhile. The skill isn't prediction (no one can predict which startup will be worth $10B); it's pattern recognition-developing an intuition, through studying hundreds of companies, for which teams, markets, and products have the raw ingredients to become enormous. Start building that pattern recognition now: talk to founders, study startup trajectories, read about how great companies were built in their earliest days, and develop your own theses about where the world is heading. That's the work that separates great VCs from everyone else.
</div>

</div>`,
  },
];
