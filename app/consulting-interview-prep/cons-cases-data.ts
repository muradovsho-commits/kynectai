export const CONS_CASES_SECTIONS = [
  {
    title: 'What Cases Test',
    content: `<p>Case interviews are simulated consulting problems. They test four things simultaneously:</p>

<p><strong>1. Structured thinking:</strong> Can you break an ambiguous problem into clear, logical components? Do your frameworks make sense, or are they just memorized templates jammed onto the wrong problem?</p>

<p><strong>2. Analytical ability:</strong> Can you work with data? Can you do mental math accurately and quickly? Can you interpret charts and draw the right conclusions?</p>

<p><strong>3. Business judgment:</strong> Do your conclusions make sense? Can you connect your analysis to practical recommendations? Do you understand how businesses actually work?</p>

<p><strong>4. Communication:</strong> Can you explain your thinking clearly and concisely? Can you "manage up" by telling the interviewer where you're going before you go there? Can you synthesize findings into a compelling recommendation?</p>`,
  },
  {
    title: 'The Case Interview Flow',
    content: `<p>Every case follows a similar arc, regardless of the topic:</p>

<h4>1. Listen and Clarify (1–2 minutes)</h4>

<p>The interviewer presents the problem. Take notes carefully. Before diving in, ask 2–3 clarifying questions to ensure you understand the context: What industry is the client in? What's the time horizon? Are there specific constraints? What does "success" look like? Don't ask questions you could answer yourself; ask questions that genuinely change how you'd approach the problem.</p>

<h4>2. Structure the Problem (2–3 minutes)</h4>

<p>Ask for a moment to collect your thoughts. Develop a framework&mdash;a structured breakdown of the problem into 3–4 key areas you need to investigate. Present the framework to the interviewer, explaining your logic. The framework should be MECE, tailored to the specific problem (not a generic template), and prioritized (which area do you want to explore first, and why?).</p>

<div class="warning-box">
<strong>Critical:</strong> The biggest mistake candidates make is applying a memorized framework that doesn't fit the problem. If a client asks "Should we launch a new product?", don't force-fit a profitability framework (Revenue − Costs). Instead, build a custom structure: market attractiveness, competitive positioning, capability fit, financial viability. The interviewer can instantly tell whether you're thinking or reciting.
</div>

<h4>3. Analyze (15–25 minutes)</h4>

<p>Work through your framework systematically. For each branch, hypothesize what you expect to find, ask the interviewer for data, analyze the data, and draw a conclusion before moving to the next branch. Key behaviors: always state your hypothesis before asking for data ("I suspect the profit decline is cost-driven; can I see the cost breakdown?"); do math carefully and talk through your calculations; synthesize after each branch ("So we've established that revenue is flat, which means the issue is on the cost side. Let me explore that now."); and be willing to revise your framework if the data takes you in an unexpected direction.</p>

<h4>4. Recommend (1–2 minutes)</h4>

<p>When the interviewer asks for your recommendation (or when you've exhausted the key branches), deliver a concise synthesis. Use the Pyramid Principle: lead with the recommendation, support it with 2–3 key reasons, note any risks or next steps. Example: "I recommend the client exit the UK market. The market is structurally unattractive due to regulatory headwinds and pricing pressure. The client's market share has declined three consecutive years with no credible path to recovery. And the capital freed up could be redeployed to the faster-growing US business, where the client has a stronger competitive position."</p>`,
  },
  {
    title: 'Common Case Types',
    content: `<table class="comparison-table">
<tr><th>Case Type</th><th>Typical Prompt</th><th>Primary Framework Areas</th></tr>
<tr><td>Profitability</td><td>"Client's profits have declined 20%. Why, and what should they do?"</td><td>Revenue analysis (price × volume), Cost analysis (fixed vs. variable), Benchmarking vs. competitors</td></tr>
<tr><td>Market Entry</td><td>"Should the client enter the Brazilian market?"</td><td>Market attractiveness, Competitive landscape, Client capabilities, Entry mode, Financial viability</td></tr>
<tr><td>Growth Strategy</td><td>"How can the client grow revenue by 30% in three years?"</td><td>Organic growth (existing products, new products, new channels), Inorganic growth (M&A, partnerships), Capability gaps</td></tr>
<tr><td>Pricing</td><td>"How should the client price its new product?"</td><td>Value to customer, Cost-plus analysis, Competitive benchmarking, Price elasticity, Channel considerations</td></tr>
<tr><td>Market Sizing</td><td>"How many electric vehicles will be sold in the US in 2030?"</td><td>Top-down (total market × penetration) or Bottom-up (# of buyers × purchase probability × average units)</td></tr>
<tr><td>M&amp;A</td><td>"Should the client acquire Company X?"</td><td>Strategic rationale, Standalone valuation, Synergies, Integration risks, Financial impact</td></tr>
<tr><td>Operations</td><td>"How can the client reduce manufacturing costs by 15%?"</td><td>Process mapping, Benchmarking, Lean/Six Sigma principles, Automation, Sourcing</td></tr>
</table>`,
  },
  {
    title: 'Building Custom Frameworks',
    content: `<p>The key to strong frameworks is starting from first principles rather than memorized templates. For any problem, ask yourself: <strong>What are the 3–4 key questions I need to answer to solve this problem?</strong> Those questions become your framework branches.</p>

<p>A few techniques for generating custom frameworks:</p>

<p><strong>Start with the objective and work backward.</strong> If the goal is "increase revenue," the logical decomposition is: Revenue = Volume × Price. Volume can increase through more customers, more purchases per customer, or reduced churn. Price can increase through list price increases, reduced discounting, or mix shift toward premium products.</p>

<p><strong>Think about the decision from the decision-maker's perspective.</strong> If a CEO is deciding whether to enter a new market, they need to know: (1) Is the market attractive? (2) Can we win? (3) What would it cost, and what would we earn? (4) What are the risks? Those four questions form a natural framework.</p>

<p><strong>Use "internal vs. external" as a starting point.</strong> Many problems can be decomposed into factors internal to the company (costs, capabilities, culture) and factors external to it (market trends, competition, regulation). This ensures you're not over-indexing on one dimension.</p>

<div class="mistake-box">
<strong>Common Mistake:</strong> Using framework acronyms (SWOT, Porter's Five Forces, 4Ps) as your primary structure. These are useful mental models for generating ideas, but they're terrible case frameworks. They overlap (SWOT's "Opportunities" and "Threats" aren't clearly defined), they're generic (they don't adapt to the specific problem), and interviewers will immediately see that you're recycling a textbook framework rather than thinking independently.
</div>`,
  },
];
