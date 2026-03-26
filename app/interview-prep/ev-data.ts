// Investment Banking Technical Mastery Manual — Module 3 (EV/Equity, Comps, Precedents)
export const EV_SECTIONS = [
  {
    title: '3.1 What Valuation Is From First Principles',
    content: `<p>Valuation is the process of estimating what a business is worth.</p>
<p><strong>Why valuation exists:</strong> Markets, boards, management teams, acquirers, lenders, and investors constantly need answers to questions like: What is this company worth? What should we pay for it? Is the stock undervalued? Is this acquisition attractive? What is the value range for this asset?</p>
<p><strong>Three core valuation methodologies in banking interviews:</strong></p>
<ol><li>Discounted Cash Flow (DCF)</li><li>Comparable Companies Analysis (Trading Comps)</li><li>Precedent Transactions Analysis</li></ol>
<p><strong>How bankers think about them:</strong></p>
<ul><li>DCF = intrinsic value based on future cash flow</li><li>Comps = market value based on how similar public companies trade</li><li>Precedents = acquisition value based on what buyers paid in real deals</li></ul>
<p><strong>Why multiple methods are used:</strong> No method is perfect. DCF is theoretically strong but highly assumption-sensitive. Comps are market-based but may reflect market mispricing. Precedents reflect control value but may be stale or situation-specific. This is why valuation is usually presented as a range, not a single number.</p>`,
  },
  {
    title: '3.2 Enterprise Value vs Equity Value',
    content: `<p>This distinction is absolutely essential.</p>
<h3>Equity Value</h3>
<p>Value attributable to common shareholders. Often calculated as: Share Price × Diluted Shares Outstanding.</p>
<h3>Enterprise Value</h3>
<p>Value of the company's core operations available to all capital providers.</p>
<p><strong>Common formula:</strong> Enterprise Value = Equity Value + Debt + Preferred Stock + Minority Interest - Cash</p>
<p><strong>Why this matters:</strong> Enterprise Value reflects the value of operations regardless of financing structure. Equity Value is what remains for common shareholders after satisfying other claims and considering excess cash.</p>
<p><strong>Intuition:</strong> If you buy a house for $1 million and it has a $300,000 mortgage, the house value is like Enterprise Value and your personal ownership stake is like Equity Value.</p>
<p><strong>Why cash is subtracted:</strong> Because cash is a non-operating asset and effectively reduces the net cost to acquire the operating business.</p>
<p><strong>What interviewers test here:</strong> They want to know whether you can match valuation numerators and denominators correctly.</p>
<p><strong>Enterprise Value pairs with pre-interest metrics such as:</strong> Revenue, EBITDA, EBIT, UFCF</p>
<p><strong>Equity Value pairs with post-interest / after-debt metrics such as:</strong> Net Income, EPS, Levered FCF</p>
<p><strong>Common mistake:</strong> Using EV / Net Income or P / EBITDA is a mismatch.</p>`,
  },
  {
    title: '3.4 Comparable Companies Analysis (Trading Comps)',
    content: `<h3>3.4.1 What Trading Comps Are</h3>
<p>A valuation methodology that estimates a company's value by comparing it to similar publicly traded companies.</p>
<p><strong>Why it exists:</strong> Markets price businesses every day. If similar businesses trade at certain multiples, that can inform what the target may be worth.</p>
<p><strong>Why bankers use it:</strong> Market-based, Fast and intuitive, Useful for establishing valuation ranges, Anchors a company relative to peers.</p>

<h3>3.4.2 The Process for Building Trading Comps</h3>
<ol><li>Select a peer group</li><li>Gather financial and market data</li><li>Calculate equity value and enterprise value</li><li>Calculate valuation multiples</li><li>Benchmark the target against peers</li><li>Apply appropriate multiple range to the target's metric</li></ol>

<h3>3.4.3 Selecting Comparable Companies</h3>
<p>This is more judgment than science.</p>
<p><strong>What to match on:</strong> Industry / business model, Products / services, End markets, Geography, Size, Growth profile, Margin profile, Capital intensity, Customer type.</p>
<p><strong>Interview insight:</strong> No comp set is perfect. Good candidates explicitly acknowledge trade-offs.</p>
<p><strong>Strong answer:</strong> "I'd prioritize business model, end market, and margin / growth profile over superficial similarities, because those factors drive valuation more directly than just size alone."</p>

<h3>3.4.4 Common Multiples</h3>
<p><strong>Enterprise Value-based multiples:</strong> EV / Revenue, EV / EBITDA, EV / EBIT</p>
<p><strong>Equity Value-based multiples:</strong> P / E, P / BV in some sectors</p>
<p><strong>Matching rule:</strong> Use pre-debt metrics with EV and post-debt metrics with Equity Value.</p>
<p><strong>Why EV / EBITDA is common:</strong> Because EBITDA is a widely available operating metric and relatively capital structure neutral.</p>
<p><strong>Why P / E can be misleading:</strong> Net income is affected by capital structure, non-operating items, tax differences, and accounting quirks.</p>

<h3>3.4.5 Calendarization and LTM / NTM Metrics</h3>
<p>Bankers often use: LTM = Last Twelve Months, NTM = Next Twelve Months.</p>
<p><strong>Why forward multiples often matter more:</strong> Markets price expectations, not just historical results.</p>
<p><strong>Interview nuance:</strong> If a company is entering a major margin expansion period, forward multiples may be more informative than historical multiples.</p>

<h3>3.4.6 Adjustments to Enterprise Value and Metrics</h3>
<p><strong>Enterprise Value adjustments may include:</strong> Debt, Preferred stock, Minority interest, Unfunded pensions in some contexts, Capital leases in some contexts depending on treatment, Less: cash.</p>
<p><strong>EBITDA adjustments may include:</strong> One-time restructuring charges, Litigation settlements, Unusual gains / losses, Run-rate synergies in certain contexts.</p>
<p><strong>Interview nuance:</strong> Do not mechanically add back every "adjusted EBITDA" line from management. Strong candidates understand that aggressive adjustments can inflate value.</p>

<h3>3.4.7 Strengths and Weaknesses of Trading Comps</h3>
<p><strong>Strengths:</strong> Market-based, Easy to explain, Useful cross-check, Reflects current sentiment.</p>
<p><strong>Weaknesses:</strong> Market may be mispricing peers, No perfect comps, Ignores control premium, Multiples can be distorted by accounting differences or temporary factors.</p>`,
  },
  {
    title: '3.5 Precedent Transactions Analysis',
    content: `<h3>3.5.1 What It Is</h3>
<p>A valuation methodology based on actual prices paid in past M&amp;A transactions for similar companies.</p>
<p><strong>Why it exists:</strong> Acquisition prices reflect what strategic or financial buyers have historically been willing to pay for control of comparable assets.</p>
<p><strong>Why it is used:</strong> Reflects control value, Incorporates takeover premium, Useful in sell-side and fairness contexts.</p>

<h3>3.5.2 Why Precedents Often Show Higher Valuation Than Trading Comps</h3>
<p>Because buyers usually pay a premium to convince shareholders to sell control.</p>
<p><strong>Reasons for higher valuation:</strong> Control premium, Synergies, Scarcity value, Competitive auction dynamics.</p>
<p><strong>But not always:</strong> Some deals occur under distress or unusual circumstances, so precedents must be used carefully.</p>

<h3>3.5.3 Transaction Premium vs Control Premium</h3>
<p><strong>Transaction Premium:</strong> The percentage paid above the unaffected share price in a specific deal.</p>
<p><strong>Control Premium:</strong> The broader concept that acquiring control typically requires paying more than minority trading value.</p>
<p><strong>Interview nuance:</strong> Candidates often use them interchangeably, but transaction premium is measured in a specific deal while control premium is the conceptual explanation.</p>

<h3>3.5.4 Building a Precedent Transactions Analysis</h3>
<ol><li>Select relevant transactions</li><li>Determine purchase price and transaction EV</li><li>Calculate transaction multiples</li><li>Adjust for timing and market conditions</li><li>Apply appropriate multiple range to target metrics</li></ol>
<p><strong>What makes a precedent relevant:</strong> Same sector / business model, Similar size, Similar geography, Similar timing, Similar strategic logic.</p>
<p><strong>Why timing matters a lot:</strong> A deal done during a boom market may not be relevant in a downturn.</p>

<h3>3.5.5 Strengths and Weaknesses of Precedents</h3>
<p><strong>Strengths:</strong> Reflect real acquisition pricing, Reflect control value, Useful in M&amp;A contexts.</p>
<p><strong>Weaknesses:</strong> Can become stale quickly, Each deal is unique, Synergies and process dynamics vary, Data may be harder to clean and interpret.</p>`,
  },
  {
    title: '3.6 Putting Valuation Methodologies Together + Module 3 Practice Drills',
    content: `<p><strong>Typical ordering in a valuation range:</strong> DCF, Trading Comps, Precedent Transactions.</p>
<p><strong>Why a football field is used:</strong> Because it visually presents ranges from different methods and shows overlap.</p>
<p><strong>Banker mindset:</strong> No single method gives "the answer." The real work is understanding why the methods differ.</p>

<h3>Module 3 Practice Drills</h3>
<p><strong>Technical drills:</strong></p>
<ol>
<li>Explain Enterprise Value vs Equity Value</li>
<li>Walk through a DCF from start to finish</li>
<li>Explain UFCF and why it excludes interest expense</li>
<li>Explain WACC and each component</li>
<li>Explain the two terminal value methods</li>
<li>Explain why precedent transactions are often higher than trading comps</li>
<li>Explain when P / E is less useful than EV / EBITDA</li>
<li>Explain why market values are used in WACC</li>
</ol>
<p><strong>Interview-style questions:</strong> Walk me through a DCF. How do you calculate unlevered free cash flow? Why do you use WACC? Why do you subtract cash in enterprise value? What are the most common valuation methodologies? Why do trading comps and precedents differ?</p>
<p><strong>Explain-out-loud exercise:</strong> Take a company you know and explain which valuation method you would trust most and why.</p>
<p><strong>Self-testing framework — For any valuation question, ask:</strong></p>
<ol><li>Am I valuing the firm or the equity?</li><li>Is my numerator matched with the right denominator?</li><li>Is this intrinsic or market-based?</li><li>What assumptions matter most?</li><li>What are the weaknesses of the method?</li></ol>`,
  },
];
