// Investment Banking Technical Mastery Manual — Module 6: LBO
export const LBO_SECTIONS = [
  {
    title: '6.1–6.2 What an LBO Is & Core Drivers of Returns',
    content: `<h3>6.1 What an LBO Is</h3>
<p>An LBO is an acquisition in which a financial sponsor buys a company using a significant amount of debt.</p>
<p><strong>Why it exists:</strong> Private equity firms use leverage to amplify equity returns.</p>
<p><strong>Core intuition:</strong> If a buyer uses less of its own equity upfront and can pay down debt using the company's cash flow, then upon exit the equity value can grow much faster than in an all-equity deal.</p>
<p><strong>Why bankers care:</strong> Investment bankers advise on sponsor transactions, financing packages, sale processes, and LBO valuation support.</p>

<h3>6.2 The Core Drivers of LBO Returns</h3>
<p>An LBO return is generally driven by:</p>
<ol><li>Entry valuation multiple</li><li>Amount of debt used</li><li>EBITDA growth</li><li>Cash flow available for debt paydown</li><li>Exit valuation multiple</li><li>Holding period</li></ol>
<p><strong>Strong answer:</strong> "The main drivers of LBO returns are how cheaply the sponsor buys the company, how much leverage can be used, how much EBITDA and cash flow grow during the hold period, how much debt gets paid down, and the exit multiple at sale."</p>`,
  },
  {
    title: '6.3–6.5 Why PE Firms Use Leverage, Basic LBO Structure, IRR Intuition',
    content: `<h3>6.3 Why PE Firms Use Leverage</h3>
<p><strong>First-principles explanation:</strong> Debt is generally cheaper than equity and reduces the amount of equity the sponsor must invest. If the company can reliably service and repay that debt, equity returns are magnified.</p>
<p><strong>The trade-off:</strong> Leverage increases risk. Interest burden rises, flexibility declines, downside becomes harsher.</p>
<p><strong>Interview nuance:</strong> A strong candidate always acknowledges both the upside and the risk of leverage.</p>

<h3>6.4 Basic LBO Structure</h3>
<p><strong>Sources</strong> — Where the money comes from: Sponsor equity, Revolver, Term loans, Senior notes, Subordinated debt, Seller rollover in some cases.</p>
<p><strong>Uses</strong> — Where the money goes: Equity purchase, Debt refinancing, Fees and expenses.</p>
<p><strong>Why this matters:</strong> Even if an interview does not require full modeling, sources and uses logic is fundamental.</p>

<h3>6.5 Basic IRR Intuition</h3>
<p><strong>What IRR is:</strong> IRR is the annualized return rate that equates the sponsor's initial equity investment with its future equity proceeds.</p>
<p><strong>Intuition:</strong> If the sponsor invests 100 and gets 200 back in five years, the IRR is the annualized return on that equity.</p>
<p><strong>What increases IRR?</strong> Lower entry multiple, Higher exit multiple, Stronger EBITDA growth, More debt paydown, Lower initial equity check, Shorter holding period, all else equal.</p>`,
  },
  {
    title: '6.6–6.7 How Bankers Evaluate LBOs & What Makes a Good LBO Candidate',
    content: `<h3>6.6 How Bankers Evaluate LBOs Conceptually</h3>
<p>Bankers often think about LBOs as: what price financial sponsors could plausibly pay, how much debt the business can support, what equity return the sponsor could earn, whether the asset fits the sponsor profile.</p>
<p><strong>Why this matters in sell-side processes:</strong> Strategic buyers and sponsors may value the same target differently. A sponsor's maximum price is constrained by debt capacity and required return thresholds.</p>

<h3>6.7 What Makes a Good LBO Candidate</h3>
<p><strong>Common characteristics:</strong> Stable and predictable cash flow, Defensible market position, Moderate CapEx needs, Manageable working capital, Opportunities for operational improvement, Tangible assets or strong earnings profile supporting debt financing.</p>
<p><strong>Bad LBO candidate characteristics:</strong> Highly volatile earnings, Heavy cyclicality without cushion, Massive future CapEx requirements, Negative cash flow, Severe customer concentration or regulatory risk.</p>`,
  },
  {
    title: '6.8 Simplified LBO Walkthrough',
    content: `<p>Suppose: Entry EBITDA = 100, Entry multiple = 8.0x → Enterprise Value = 800, Debt = 500, Equity = 300, EBITDA grows to 130 by exit, Exit multiple = 8.0x → Exit EV = 1,040, Debt paid down to 250.</p>
<p><strong>Exit Equity Value:</strong> 1,040 - 250 = 790</p>
<p>Sponsor equity grew from 300 to 790. That is a strong return.</p>
<p><strong>Sources of value creation:</strong> EBITDA growth increased EV, Debt paydown increased equity share of EV, Multiple stayed flat.</p>
<p><strong>Interview insight:</strong> Strong candidates naturally decompose returns into operational improvement, deleveraging, and multiple change.</p>`,
  },
  {
    title: '6.9–6.10 LBO vs DCF vs Strategic Value + Common LBO Questions + Module 6 Practice',
    content: `<h3>6.9 LBO vs DCF vs Strategic M&amp;A Value</h3>
<p><strong>DCF:</strong> Intrinsic value based on cash flow.</p>
<p><strong>Strategic M&amp;A:</strong> Value may include synergies and control premium.</p>
<p><strong>LBO:</strong> Value constrained by sponsor return requirements and debt capacity.</p>
<p><strong>Interview insight:</strong> LBO value is often thought of as a valuation floor or sponsor valuation benchmark in auction contexts.</p>

<h3>6.10 Common LBO Interview Questions</h3>
<ul><li>What is an LBO?</li><li>Why do PE firms use leverage?</li><li>What makes a good LBO candidate?</li><li>What drives IRR?</li><li>Why might a strategic buyer outbid a sponsor?</li><li>What happens to returns if the exit multiple declines?</li></ul>

<h3>Module 6 Practice Drills</h3>
<p><strong>Technical drills:</strong></p>
<ol><li>Explain what an LBO is in 30 seconds</li><li>Explain why leverage increases returns</li><li>Explain the major drivers of IRR</li><li>Explain why stable cash flow matters in an LBO</li><li>Explain why sponsors may pay less than strategics</li></ol>
<p><strong>Interview-style questions:</strong> Walk me through a basic LBO. Why do sponsors care so much about cash flow? What is a good LBO candidate? How do exit multiple changes affect IRR?</p>
<p><strong>Explain-out-loud exercise:</strong> Take a mature company and assess whether it would be a good LBO candidate.</p>
<p><strong>Self-testing framework — For any LBO question, ask:</strong></p>
<ol><li>How much debt can the company support?</li><li>How stable is cash flow?</li><li>How much can debt be paid down?</li><li>What EBITDA growth is plausible?</li><li>What exit multiple is reasonable?</li><li>What return would the sponsor earn?</li></ol>`,
  },
];
