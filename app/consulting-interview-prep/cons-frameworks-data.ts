export const CONS_FRAMEWORKS_SECTIONS = [
  {
    title: 'The Hypothesis-Driven Approach',
    content: `<p>Consultants don't solve problems by gathering all possible data and then figuring out the answer. That approach is too slow and too expensive. Instead, they use a <strong>hypothesis-driven approach</strong>: form an initial hypothesis about the answer, identify the key analyses needed to prove or disprove it, conduct those analyses, and revise the hypothesis as evidence accumulates.</p>

<p>For example, if a retailer's profits have declined 15% over two years, a consultant might hypothesize: "The profit decline is driven primarily by margin compression from increased promotional activity, not by a decline in overall foot traffic." The team then conducts targeted analyses: comparing promotional intensity over time, analyzing margin by product category, and benchmarking promotional spending against competitors. If the data supports the hypothesis, the team develops recommendations around pricing discipline. If it doesn't, the hypothesis is revised and new analyses are run.</p>

<p>The hypothesis-driven approach is powerful because it focuses effort on the analyses that will actually change the recommendation. Instead of building a comprehensive database of everything about the client's business (which could take months), you identify the 3-5 key questions that determine the answer and concentrate resources there.</p>`,
  },
  {
    title: 'MECE: The Foundation of Structure',
    content: `<p><strong>MECE</strong> stands for <strong>Mutually Exclusive, Collectively Exhaustive</strong>. It's the organizing principle behind all structured thinking in consulting. When you break a problem into components, those components should be:</p>

<p><strong>Mutually Exclusive:</strong> No overlap between categories. Each piece of data or each part of the problem should fit into exactly one bucket, never two. If your revenue breakdown includes "online sales" and "direct-to-consumer sales," those categories overlap (online sales can be direct-to-consumer), which creates confusion and double-counting.</p>

<p><strong>Collectively Exhaustive:</strong> No gaps. Your categories should cover 100% of the problem. If you're analyzing a company's costs and your categories are "labor" and "materials," you've missed rent, technology, marketing, and many other cost categories. Your structure has gaps.</p>

<div class="example-box">
<div class="example-label">MECE Example</div>
<p><strong>Non-MECE (bad):</strong> Breaking down a restaurant's revenue into "dine-in, takeout, catering, weekend customers." This fails both tests: "weekend customers" overlaps with dine-in and takeout (a weekend customer could be either), and it's not exhaustive (it misses delivery, for instance).</p>
<p><strong>MECE (good):</strong> Breaking down revenue by channel (dine-in, takeout, delivery, catering) or by time period (weekday lunch, weekday dinner, weekend lunch, weekend dinner). Each item is distinct, and together they cover all revenue.</p>
</div>`,
  },
  {
    title: 'Issue Trees',
    content: `<p>An <strong>issue tree</strong> is a visual representation of a problem broken into its MECE components. It starts with the core question at the top and branches downward into sub-questions, each of which can be further decomposed. Issue trees serve as the roadmap for the entire project: they tell you what questions to answer, in what order, and how the pieces fit together.</p>

<div class="framework-box">
<div class="fw-label">Issue Tree Example: Why Have Profits Declined?</div>
<p><strong>Level 1:</strong> Is it a Revenue problem, a Cost problem, or both?</p>
<p><strong>Level 2 (Revenue):</strong> Is volume declining? Is price declining? Is mix shifting toward lower-margin products?</p>
<p><strong>Level 2 (Cost):</strong> Are variable costs rising (COGS, materials, labor)? Are fixed costs rising (rent, overhead, SG&A)?</p>
<p><strong>Level 3 (Volume declining):</strong> Is the overall market shrinking, or is the company losing share? If losing share, to which competitors? In which segments? Through which channels?</p>
<p>Each branch continues until you reach a question that can be answered with a specific analysis or data point.</p>
</div>`,
  },
  {
    title: 'The Pyramid Principle',
    content: `<p>Developed by Barbara Minto at McKinsey, the <strong>Pyramid Principle</strong> is the standard for structuring communication in consulting. The core idea: <strong>start with the answer</strong>, then provide the supporting arguments, then provide the supporting data for each argument. This is the opposite of how most people naturally communicate (building up to a conclusion). In consulting, the audience is busy executives who want the bottom line first and the details only if they need them.</p>

<p>A presentation built on the Pyramid Principle has three levels. The <strong>governing thought</strong> is the single, overarching recommendation at the top (e.g., "The company should exit the European market and reinvest in North America"). The <strong>key line items</strong> are the 3-4 main arguments supporting the recommendation (e.g., "European margins are structurally below cost of capital," "North American growth opportunities are significantly larger," "Management attention is being diluted"). The <strong>supporting evidence</strong> is the data, analysis, and logic that prove each key line item.</p>`,
  },
  {
    title: '80/20 Thinking',
    content: `<p>The Pareto Principle (80/20 rule) is deeply embedded in consulting culture. The insight: roughly 80% of the impact comes from 20% of the causes. In practice, this means:</p>

<p><strong>Focus on what matters most.</strong> If a company has 15 product lines, it's likely that 3-4 of them drive the majority of profits (or losses). Analyze those first; the others can wait.</p>

<p><strong>Don't pursue perfect data.</strong> Getting from 80% accuracy to 95% accuracy often takes 5x the effort. In consulting, the 80% answer delivered this week is far more valuable than the 95% answer delivered next month.</p>

<p><strong>Prioritize ruthlessly.</strong> At any given time, there are dozens of analyses you could run. The skill is identifying the 2-3 that will actually change the recommendation and ignoring the rest.</p>`,
  },
];
