export const CONS_FRAMEWORKS_SECTIONS = [
  {
    title: `1. The Rule of MECE`,
    content: `<p>If there is one absolute law in management consulting, it is <strong>MECE</strong>: Mutually Exclusive, Collectively Exhaustive.</p>
<br/>
<p>Whenever you are breaking down a problem (structuring your issue tree), your branches must completely cover the problem space (Collectively Exhaustive) without overlapping with each other (Mutually Exclusive). If your framework is not MECE, the interviewer will penalize you immediately.</p>
<br/>
<p><strong>Example - Segmenting a Customer Base:</strong><br/>
<em>Not MECE:</em> "We can segment buyers into 'Young Adults', 'High Income', and 'Urban'." (A young adult can be high-income and urban. Massive overlap).<br/>
<em>MECE:</em> "We can segment buyers by Age: Under 18, 18-35, 36-55, and 56+." (No overlap, and covers everyone).</p>`
  },
  {
    title: `2. The Profitability Framework`,
    content: `<p>This is the most common case type. "Our client is a widget manufacturer and profits are down 20%. Why?"</p>
<br/>
<p><strong>The Ultimate MECE Equation:</strong><br/>
Profit = (Revenue) - (Costs)<br/>
Profit = (Price $\\times$ Volume) - (Fixed Costs + [Variable Cost/Unit $\\times$ Volume])</p>
<br/>
<p><strong>How to structure the deep dive:</strong><br/>
1. <strong>Revenue (Price vs Volume):</strong> Is the decline driven by lowering our prices, or selling fewer units? If volume is down, is it a market-wide trend (the whole pie shrank) or a market-share issue (we lost our slice)?<br/>
2. <strong>Costs (Fixed vs Variable):</strong> Have our rent and overhead spiked (Fixed)? Or has the cost of raw materials and labor per widget increased (Variable)?<br/>
Always isolate the exact mathematical driver before brainstorming solutions.</p>`
  },
  {
    title: `3. Market Entry & Growth Strategy`,
    content: `<p>"Our client is a US-based streaming service looking to enter Japan. Should they?"</p>
<br/>
<p><strong>The Core Market Entry Framework:</strong></p>
<p><strong>1. The Market (The Opportunity):</strong><br/>
What is the Total Addressable Market (TAM)? What is the growth rate? Who are the current competitors and what is their share? Are there barriers to entry (regulations, cultural moats)?</p>
<br/>
<p><strong>2. The Client (The Capabilities):</strong><br/>
Why us? Can our current tech stack support Japanese localization? Do we have relationships with local content creators? Do we have the capital to stomach 3 years of losses?</p>
<br/>
<p><strong>3. The Financials (The Return):</strong><br/>
What is the expected ROI? How long until breakeven? What is the pricing strategy (penetration vs skimming)?</p>
<br/>
<p><strong>4. The Execution (How to enter):</strong><br/>
Build from scratch (Organic)? Buy a local competitor (M&A)? Or partner/Joint Venture with a Japanese telecom company?</p>`
  },
  {
    title: `4. Mergers & Acquisitions (M&A)`,
    content: `<p>"A private equity firm is considering acquiring a regional grocery chain. Is this a good idea?"</p>
<br/>
<p><strong>The M&A Framework:</strong></p>
<p><strong>1. The Target Company (Standalone Value):</strong><br/>
Is the target profitable? Is their market share growing? Is their management team strong? Is the asking price fair based on industry multiples?</p>
<br/>
<p><strong>2. The Market Context:</strong><br/>
Is the grocery industry consolidating? Are margins shrinking due to Amazon/Walmart? How threat-resilient is this regional chain?</p>
<br/>
<p><strong>3. Synergies (The 1+1=3 factor):</strong><br/>
<em>Revenue Synergies:</em> Can we cross-sell our existing products in their stores? Can we raise prices together?<br/>
<em>Cost Synergies (Much more reliable!):</em> Can we fire redundant HR and IT staff? Can we negotiate better bulk discounts with suppliers now that we are bigger? Can we consolidate distribution centers?</p>
<br/>
<p><strong>4. Execution Risks:</strong><br/>
Culture clash between the two companies? IT system integration failures? Anti-trust regulatory blocking?</p>`
  },
  {
    title: `5. The 3Cs / 4Ps / Porter's Five Forces`,
    content: `<p>Do <strong>NOT</strong> list these out by name to your interviewer ("I will now use Porter's Five Forces"). McKinsey and BCG will fail you for sounding like a textbook. Use them as invisible mental checklists to ensure your bespoke framework is MECE.</p>
<br/>
<p><strong>The 3 C's (Business Situation):</strong><br/>
1. Company (Capabilities, financials, product)<br/>
2. Customers (Segments, needs, price elasticity)<br/>
3. Competitors (Market share, strategies, barriers to entry)</p>
<br/>
<p><strong>The 4 P's (Marketing Strategy):</strong><br/>
1. Product (Features, packaging)<br/>
2. Price (Willingness to pay, bundling)<br/>
3. Place (Distribution channels like D2C vs Retail)<br/>
4. Promotion (Marketing campaigns, discount codes)</p>`
  },
  {
    title: `6. The BCG Growth-Share Matrix (Portfolio Strategy)`,
    content: `<p>When a massive conglomerate (like Disney or GE) asks you what they should do with their 50 different business divisions, you must map their products on a 2x2 matrix evaluating <em>Market Growth Rate</em> vs <em>Relative Market Share</em>.</p>
<br/>
<p><strong>1. Cash Cows (Low Growth, High Market Share)</strong><br/>
These products dominate a mature industry (e.g., Coca-Cola Classic). They require very little investment but generate massive free cash flow. <em>Strategy:</em> Milk them dry to fund your other ventures. Do not attempt aggressive growth marketing.</p>
<br/>
<p><strong>2. Stars (High Growth, High Market Share)</strong><br/>
The market leaders in exploding industries (e.g., iPhones in 2010). They generate high revenue, but require massive investment to fend off competitors and maintain their lead. <em>Strategy:</em> Pour all the money from your Cash Cows into your Stars to sustain their monopoly.</p>
<br/>
<p><strong>3. Question Marks (High Growth, Low Market Share)</strong><br/>
Players in booming industries that are currently losing to competitors. <em>Strategy:</em> Analyze rigorously. Will extreme capital injection turn them into a Star? If not, divest (sell) them immediately before they bleed you dry.</p>
<br/>
<p><strong>4. Dogs (Low Growth, Low Market Share)</strong><br/>
Products with tiny slivers of stagnant, dead industries. <em>Strategy:</em> Liquidate or divest immediately. They are trapping capital that could be deployed elsewhere.</p>`
  }
];
