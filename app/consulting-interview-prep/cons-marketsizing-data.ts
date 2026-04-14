export const CONS_MARKETSIZING_SECTIONS = [
  {
    title: 'Why Market Sizing Matters',
    content: `<p>Market sizing tests your ability to structure an ambiguous problem, make reasonable assumptions, and perform quick arithmetic-all under pressure. These are core consulting skills. In practice, market sizing is a fundamental input to virtually every strategic question: Is this market big enough to enter? How much revenue could we capture? What's the total addressable market for our new product?</p>`,
  },
  {
    title: 'Two Approaches',
    content: `<h4>Top-Down</h4>

<p>Start with a broad, known number and narrow it down through successive filters. Example: "How large is the US market for premium dog food?"</p>

<p>Start with the US population (~330 million). Estimate the percentage of households with dogs (there are ~130 million households; ~50 million have dogs, or ~38%). Estimate the percentage that buy premium food (~25%). Estimate annual spending on premium dog food per dog-owning household (~$600/year). Multiply: 50M × 25% × $600 = ~$7.5 billion.</p>

<p>Advantages: fast, anchored in widely known figures, easy to sanity-check against published market data. Disadvantages: relies heavily on assumptions for each filter; small errors compound across multiple steps.</p>

<h4>Bottom-Up</h4>

<p>Start with a single unit and scale up. Example (same question): How many stores sell premium dog food? What are average sales per store?</p>

<p>Major channels: pet specialty stores (~20,000 locations like Petco/PetSmart), grocery stores (~40,000 that carry premium pet food), online retailers. Estimate premium dog food revenue per store: pet specialty stores might average $150K/year, grocery stores ~$30K/year. Online might be ~30% of total market. Pet specialty: 20,000 × $150K = $3.0B. Grocery: 40,000 × $30K = $1.2B. Combined: $4.2B for physical retail. Add 30% for online: $4.2B / 70% × 30% ≈ $1.8B. Total: ~$6.0B.</p>

<p>Advantages: more granular, easier to identify specific assumptions that could be wrong. Disadvantages: slower, requires more specific knowledge (or reasonable guesses) about the supply side.</p>`,
  },
  {
    title: 'The Market Sizing Methodology',
    content: `<p><strong>Step 1: Clarify the scope.</strong> Define exactly what you're sizing. "The market for electric vehicles" could mean global or US only, cars only or all EVs (including e-bikes and e-scooters), new sales only or including used, just the vehicles or including charging infrastructure.</p>

<p><strong>Step 2: Choose your approach.</strong> Top-down works well when you know the total market and need to estimate a segment. Bottom-up works well when you can build from unit economics. Often, using both and triangulating gives the most confidence.</p>

<p><strong>Step 3: Identify the key drivers.</strong> What are the 3-5 variables that determine the answer? Write them out before you start calculating. This helps you stay organized and makes it easier for the interviewer to follow your logic.</p>

<p><strong>Step 4: Make explicit assumptions.</strong> State each assumption clearly and explain your reasoning. "I'll assume 38% of households have dogs. I recall seeing a statistic that roughly 65 million US households have at least one pet, and about 50 million of those are dogs." If you're uncertain, give a range and use the midpoint.</p>

<p><strong>Step 5: Calculate.</strong> Do the math step by step, talking through each calculation. Round aggressively to make mental math manageable: 48 million × $620 is much harder than 50 million × $600. The precision of your assumptions doesn't warrant three significant digits.</p>

<p><strong>Step 6: Sanity-check.</strong> Does the answer feel right? Compare it to benchmarks you know. If your estimate of the US premium dog food market is $750 billion, something went wrong (that would be larger than the entire US defense budget). If it's $750 million, it might be too low (the overall US pet food market is $40B+). Adjust if needed.</p>

<div class="example-box">
<div class="example-label">Market Sizing: Dry Cleaning in Chicago</div>
<p><strong>Prompt:</strong> "How many dry cleaning stores are there in Chicago?"</p>
<p><strong>Approach:</strong> Bottom-up from demand. Chicago metro population: ~9.5 million. Not everyone uses dry cleaning; it's primarily used by working professionals. Estimate ~30% of the population dry cleans regularly (~2.85M people). Average visits per person per year: maybe 10 visits. Average spend per visit: ~$25. Total market: 2.85M × 10 × $25 = ~$712M. Average dry cleaner revenue: a typical small dry cleaner might generate $300-500K/year. Using $400K: $712M / $400K ≈ <strong>~1,780 dry cleaning stores.</strong></p>
<p><strong>Sanity check:</strong> Chicago has roughly 2,700 square miles in the metro area. At 1,780 stores, that's about 1 store per 1.5 square miles, or roughly one per dense neighborhood. That feels reasonable for a major urban area.</p>
</div>`,
  },
  {
    title: 'Common Market Sizing Traps',
    content: `<p><strong>Forgetting to define your unit.</strong> Are you sizing the market in dollars or units? Annual or cumulative installed base? These yield wildly different numbers.</p>

<p><strong>Using unreasonable penetration rates.</strong> Assuming 80% of adults buy premium organic matcha is absurd. Ground your penetration estimates in what you know about consumer behavior.</p>

<p><strong>Not segmenting.</strong> "The average American" doesn't exist. Urban vs. rural, age cohorts, income levels-segmenting improves accuracy and demonstrates sophistication.</p>

<p><strong>Mental math errors.</strong> The fastest way to lose credibility. Practice multiplication and division with large numbers. Round to make it manageable, but don't round so much that you change orders of magnitude.</p>`,
  },
];
