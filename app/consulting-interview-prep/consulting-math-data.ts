export const CONS_MATH_SECTIONS = [
  {
    title: `1. The "Zero Tolerance" Policy on Math`,
    content: `<p>In a case interview, you are not allowed to use a calculator. If you misplace a decimal during a multimillion-dollar calculation or bungle a long division step, it raises an immense red flag. Consultants present to Fortune 500 CEOs; if your math is wrong on the slide, the entire firm loses credibility.</p>
<br/>
<p><strong>The Core Rules of Case Math:</strong><br/>
1. <strong>Always speak aloud:</strong> "Okay, so I am multiplying 5 million units by $200 per unit..." This allows the interviewer to course-correct you before you ruin the whole case.<br/>
2. <strong>Round aggressively (unless told not to):</strong> If a market is 317 million people, ask "Can we round the US population to 320 million for simplicity?" Interviewers almost always say yes.<br/>
3. <strong>Sanity Check immediately:</strong> "That calculation gives us 5 trillion dollars in profit. Since global GDP is 100 trillion, that implies this one product is 5% of the world economy. That seems impossible, let me re-check my decimals."</p>`
  },
  {
    title: `2. Scientific Notation (Taming the Zeroes)`,
    content: `<p>The #1 reason candidates fail math questions is because they lose track of zeroes when multiplying "Millions" by "Billions". You must use scientific notation.</p>
<br/>
<p><strong>The Cheat Sheet:</strong><br/>
• 1 Thousand (1K) = $10^3$<br/>
• 1 Million (1M) = $10^6$<br/>
• 1 Billion (1B) = $10^9$<br/>
• 1 Trillion (1T) = $10^{12}$</p>
<br/>
<p><strong>Example: Market Sizing Calculation</strong><br/>
"We sell 400 million widgets a year at $50 each. What is the total revenue?"<br/>
<em>Bad way:</em> Writing out 400,000,000 x 50 on paper and counting zeroes.<br/>
<em>Pro way:</em> $4 \\times 10^8 \\times 5 \\times 10^1$<br/>
Multiply the coefficients: $4 \\times 5 = 20$<br/>
Add the exponents: $8 + 1 = 9$<br/>
Result: $20 \\times 10^9$. Since $10^9$ is a Billion, the answer is <strong>$20 Billion</strong>.</p>`
  },
  {
    title: `3. Market Sizing (Guesstimates)`,
    content: `<p>"How many cups of coffee are sold in New York City every Friday?"<br/>
They do not care about the actual answer. They care 100% about the *structure* of your assumptions.</p>
<br/>
<p><strong>Top-Down Approach (Starting from Population):</strong><br/>
1. <strong>Base:</strong> NYC Population is roughly 8 million.<br/>
2. <strong>Segment by Age:</strong> Assume 20% are kids under 15 (who don't drink coffee). That leaves 6.4 million potential drinkers.<br/>
3. <strong>Segment by Habit:</strong> Assume 50% of adults drink coffee daily (3.2M), 25% occasionally (1.6M), 25% never. <br/>
4. <strong>Frequency:</strong> On a Friday (workday), the daily drinkers buy 2 cups on average (Morning + Afternoon). The occasional drinkers buy 0.5 cups on average. <br/>
5. <strong>Calculation:</strong> $(3.2M \\times 2) + (1.6M \\times 0.5) = 6.4M + 0.8M = 7.2\\text{ Million cups}$.</p>
<br/>
<p><strong>Bottom-Up Approach (Starting from a Single Store):</strong><br/>
1. <strong>Base unit:</strong> One average coffee shop (Starbucks/Dunkin/Bodega).<br/>
2. <strong>Throughput:</strong> Open 10 hours a day. Morning rush (3 hours) = 150 cups/hour. Rest of day (7 hours) = 50 cups/hour. Total per shop = $450 + 350 = 800$ cups.<br/>
3. <strong>Extrapolation:</strong> How many shops in NYC? Assume 1 shop per 10 blocks. NYC has X blocks... (This is harder than Top-Down, but useful if Top-Down is impossible).</p>`
  },
  {
    title: `4. Breakeven Math & Payback Period`,
    content: `<p>Whenever a client wants to invest in a new factory, launch a new product, or buy a company, you must calculate the Breakeven Point.</p>
<br/>
<p><strong>Volume Breakeven (How many units do we need to sell?):</strong><br/>
$\\text{Breakeven Volume} = \\frac{\\text{Fixed Costs}}{\\text{Price} - \\text{Variable Cost per Unit}}$<br/>
The denominator (Price - VC) is called the <strong>Contribution Margin</strong>. It is how much profit *each unit* contributes to paying off the fixed costs.</p>
<br/>
<p><strong>Payback Period (How many years until we make our money back?):</strong><br/>
$\\text{Payback Period} = \\frac{\\text{Initial Investment}}{\\text{Annual Profit}}$<br/>
If a new factory costs $100M, and generates $25M in profit per year, the payback period is 4 years. If the client requires a payback period of under 3 years, you recommend AGAINST the factory.</p>`
  },
  {
    title: `5. Return on Investment (ROI) & Margins`,
    content: `<p>You must know these definitions flawlessly.</p>
<br/>
<p><strong>Return on Investment (ROI):</strong><br/>
$\\text{ROI} = \\frac{\\text{Profit from Investment}}{\\text{Cost of Investment}}$<br/>
If we spend $2M on a marketing campaign and it generates $3M in NEW Profit, our profit <em>from the investment</em> is $3M. Therefore ROI is $3M / $2M = 150%.</p>
<br/>
<p><strong>Profit Margin:</strong><br/>
$\\text{Profit Margin} = \\frac{\\text{Profit}}{\\text{Revenue}}$<br/>
If we sell a shirt for $100, and it costs $80 to make and distribute, Profit = $20. The Profit Margin is 20 / 100 = 20%.</p>
<br/>
<p><strong>Markup (Don't confuse with margin!):</strong><br/>
$\\text{Markup} = \\frac{\\text{Profit}}{\\text{Cost}}$<br/>
For the same $100 shirt costing $80, the Markup is 20 / 80 = 25%.</p>`
  },
  {
    title: `6. Unit Economics (LTV vs CAC)`,
    content: `<p>This is the definitive test for any case involving a Subscription/SaaS business, Tech Startup, or telecom company (e.g., Netflix, AT&T).</p>
<br/>
<p><strong>Customer Acquisition Cost (CAC):</strong><br/>
$\\text{CAC} = \\frac{\\text{Total Marketing & Sales Spend}}{\\text{Total New Customers Acquired}}$<br/>
If we spend $100,000 on Facebook ads and acquire 2,000 new subscribers, our CAC is $50 per customer.</p>
<br/>
<p><strong>Customer Lifetime Value (LTV):</strong><br/>
$\\text{LTV} = \\frac{\\text{Annual Profit Per Customer}}{\\text{Annual Churn Rate}}$<br/>
If a customer pays $120 a year for software, but it costs us $20 to host it, our Annual Profit is $100. If 20% of our customers cancel their subscription every year (Churn Rate), the average customer stays for 5 years ($1 / 0.20$). Our LTV is $100 \\times 5 = $500.</p>
<br/>
<p><strong>The LTV:CAC Ratio (The Golden Rule):</strong><br/>
If LTV is $500 and CAC is $50, the ratio is 10:1. The industry standard baseline for a healthy tech company is roughly <strong>3:1</strong>. If the ratio is 1:1, the company is destroying capital. If the ratio is 10:1, the interviewer expects you to recommend that the client <em>drastically increase</em> their marketing budget immediately, as they are leaving massive growth on the table.</p>`
  }
];
