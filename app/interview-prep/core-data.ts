// Investment Banking Technical Mastery Manual — Module 7 (Modeling) + Module 10 (Mastery) + Appendices
export const CORE_SECTIONS = [
  {
    title: '7.1–7.2 What a Financial Model Really Is & Core Principles',
    content: `<h3>7.1 What a Financial Model Really Is</h3>
<p>A financial model is a structured quantitative representation of a business used to analyze performance, forecast outcomes, and evaluate strategic or financing decisions.</p>
<p><strong>Why it exists:</strong> Because decision-makers need a consistent framework to test assumptions and understand consequences.</p>
<p><strong>What interviewers are testing:</strong> Even if you are not asked to build a model live, they want to know whether you think like a modeler: inputs drive outputs, logic must be consistent, assumptions must be explicit, circularity and linkage matter.</p>

<h3>7.2 Core Modeling Principles</h3>
<ol><li>Build from drivers, not arbitrary numbers</li><li>Keep assumptions separate from calculations</li><li>Link statements logically</li><li>Make formulas transparent</li><li>Sanity-check outputs constantly</li><li>Understand what really drives value</li></ol>`,
  },
  {
    title: '7.3–7.6 Model Flow, Revenue Build, Cost Build, Debt Schedule',
    content: `<h3>7.3 Typical Model Flow</h3>
<p>A standard operating model may go:</p>
<ol><li>Revenue build</li><li>Cost build</li><li>EBITDA, EBIT, taxes</li><li>Working capital and CapEx</li><li>Cash flow</li><li>Debt schedule if relevant</li><li>Valuation or return output</li></ol>

<h3>7.4 Revenue Build Thinking</h3>
<p>Never forecast revenue blindly. Use business drivers. Examples: Units × price, Customers × ARPU, Stores × sales per store, Subscribers × churn and new adds.</p>

<h3>7.5 Cost Build Thinking</h3>
<p>Separate: variable costs that scale with revenue or volume, fixed costs that may scale more slowly. This helps you understand operating leverage.</p>

<h3>7.6 Debt Schedule Thinking</h3>
<p>A debt schedule tracks: beginning debt, mandatory amortization, optional paydown, new issuance, ending debt, interest expense.</p>
<p><strong>Why it matters:</strong> Debt affects interest expense, which affects net income and cash flow, which can affect debt paydown. This is where circularity often emerges.</p>`,
  },
  {
    title: '7.7–7.9 Sensitivity & Scenario Analysis, Error-Checking, Modeler Mindset + Module 7 Practice',
    content: `<h3>7.7 Sensitivity and Scenario Analysis</h3>
<p><strong>Sensitivity analysis:</strong> Tests one or two assumptions across a range. Examples: WACC vs terminal growth, entry multiple vs exit multiple, revenue growth vs margin.</p>
<p><strong>Scenario analysis:</strong> Tests a whole coherent case, such as: downside, base case, upside.</p>
<p><strong>Why interviewers care:</strong> Because real finance is about uncertainty, not single-point forecasts.</p>

<h3>7.8 Error-Checking Mindset</h3>
<p>Top analysts constantly ask: Do signs make sense? Are margins plausible? Does the cash flow reconcile? Is debt increasing or decreasing logically? Does the output align with business reality?</p>

<h3>7.9 How Strong Candidates Think Like Modelers</h3>
<p>They ask: What is the main driver here? What assumption is doing the most work? Is this operational or financing-driven? Is this one-time or recurring? What is the key sensitivity?</p>

<h3>Module 7 Practice Drills</h3>
<p><strong>Technical drills:</strong></p>
<ol><li>Explain how you would forecast revenue for a retailer</li><li>Explain how you would forecast revenue for a SaaS company</li><li>Explain the purpose of a debt schedule</li><li>Explain sensitivity vs scenario analysis</li><li>Explain why assumptions should be separated from formulas</li></ol>
<p><strong>Interview-style questions:</strong> What makes a good financial model? How would you build a model for a company from scratch? Why do circular references happen? What are the biggest modeling errors analysts make?</p>
<p><strong>Explain-out-loud exercise:</strong> Describe how you would conceptually build: a three-statement model, a DCF, an accretion / dilution model, an LBO model.</p>
<p><strong>Self-testing framework — For any model, ask:</strong></p>
<ol><li>What are the key drivers?</li><li>What assumptions matter most?</li><li>How do changes flow through the model?</li><li>Where could circularity arise?</li><li>What outputs matter most to the decision?</li></ol>`,
  },
  {
    title: '10.1–10.4 What Top 1% Candidates Do Differently & Answering in Real Time',
    content: `<h3>10.1 What Top 1% Candidates Do Differently</h3>
<p>They do five things better than almost everyone else:</p>
<ol><li>They understand finance from first principles rather than memorizing surface answers.</li><li>They answer questions in a structured, calm way.</li><li>They connect accounting, valuation, M&amp;A, and LBOs naturally.</li><li>They show judgment and nuance, not just formulas.</li><li>They sound like someone who could survive and contribute on a deal team.</li></ol>

<h3>10.2 How to Answer Technical Questions in Real Time</h3>
<p>Use this simple structure:</p>
<ol><li>Define the concept</li><li>Explain why it matters</li><li>Walk through mechanics</li><li>Add nuance or caveat</li></ol>
<p><strong>Example — Question: Why do you use EV / EBITDA?</strong></p>
<ul><li>Definition: EV / EBITDA compares enterprise value to operating earnings before D&amp;A.</li><li>Why it matters: it is capital structure neutral and widely used.</li><li>Mechanics: EV includes both debt and equity, EBITDA is pre-interest.</li><li>Nuance: but it is imperfect because EBITDA is not true cash flow.</li></ul>

<h3>10.3 Handling Questions You Partially Know</h3>
<p>Do not panic and do not bluff aggressively.</p>
<p><strong>Good approach:</strong> state what you know confidently, explain your reasoning, acknowledge the area of uncertainty if needed.</p>
<p><strong>Example:</strong> "I'd think about that as a cash flow timing issue first. My understanding is that the main effect would come through deferred taxes and the tax shield, though I'd want to be careful about the exact accounting treatment." That is much better than total collapse or fake certainty.</p>

<h3>10.4 The Difference Between Memorized and Elite Answers</h3>
<p><strong>Memorized answer:</strong> Short, rigid, sounds copied, breaks on follow-up.</p>
<p><strong>Elite answer:</strong> Structured, principle-based, adaptable, and able to withstand follow-ups.</p>`,
  },
  {
    title: '10.5–10.7 Common Mistakes, 6-Week Mastery Plan, Final Checklist',
    content: `<h3>10.5 Common Technical Interview Mistakes</h3>
<ol><li>Not matching EV and Equity Value properly</li><li>Saying EBITDA equals cash flow</li><li>Forgetting taxes in accounting walk-throughs</li><li>Giving textbook definitions with no intuition</li><li>Ignoring working capital</li><li>Confusing accretive with value-creating</li><li>Failing to mention risk or nuance</li><li>Sounding uncertain even when correct</li></ol>

<h3>10.6 How to Build Mastery Over 6 Weeks</h3>
<p><strong>Week 1: Accounting foundation</strong> — Master three statements, Drill 10 common accounting scenarios, Explain all aloud daily.</p>
<p><strong>Week 2: Financial statements + core valuation</strong> — Deep dive on EV vs Equity Value, Walk through DCF daily, Learn key multiples and comp logic.</p>
<p><strong>Week 3: Advanced valuation</strong> — WACC, terminal value, sensitivity analysis, interest rate and macro effects.</p>
<p><strong>Week 4: M&amp;A</strong> — accretion / dilution, synergies, purchase accounting, strategic vs sponsor logic.</p>
<p><strong>Week 5: LBO + modeling concepts</strong> — LBO drivers, returns decomposition, sources &amp; uses, debt schedule logic.</p>
<p><strong>Week 6: Interview simulation</strong> — 100 technical questions, behavioral drills, mixed mock interviews, tighten weak spots.</p>

<h3>10.7 Final Mastery Checklist</h3>
<p>You are ready when you can do all of the following without notes:</p>
<ul><li>Walk through the three statements clearly</li><li>Explain 10 accounting changes across all three statements</li><li>Walk through a DCF end to end</li><li>Explain EV vs Equity Value cleanly</li><li>Explain why precedent transactions are often higher than trading comps</li><li>Explain accretion / dilution and what drives it</li><li>Explain what makes a good LBO candidate</li><li>Answer "Why banking?" credibly and naturally</li><li>Handle follow-up questions without falling apart</li></ul>`,
  },
  {
    title: 'Appendix A: Rapid-Fire Technical Review Sheet',
    content: `<h3>Accounting</h3>
<ul><li>Revenue - Expenses = Net Income</li><li>Net Income → CFO → Ending Cash</li><li>Net Income → Retained Earnings</li><li>Increase in current operating asset = use of cash</li><li>Increase in current operating liability = source of cash</li><li>CapEx is investing cash outflow</li><li>Depreciation is non-cash expense</li></ul>

<h3>Valuation</h3>
<ul><li>EV = Equity Value + Debt + Preferred + Minority Interest - Cash</li><li>UFCF = EBIT(1-T) + D&amp;A - CapEx - Delta NWC</li><li>WACC discounts UFCF</li><li>Terminal value via Gordon Growth or Exit Multiple</li><li>Trading comps = market value</li><li>Precedents = acquisition value</li></ul>

<h3>M&amp;A</h3>
<ul><li>Accretive = pro forma EPS up</li><li>Dilutive = pro forma EPS down</li><li>Strategic buyers may pay more due to synergies</li><li>Goodwill = purchase price - fair value of identifiable net assets</li></ul>

<h3>LBO</h3>
<ul><li>Returns driven by entry, growth, deleveraging, exit multiple</li><li>Good LBO candidate = stable cash flow + debt capacity</li></ul>`,
  },
  {
    title: 'Appendix B: 25 Additional High-Value Interview Questions + Appendix C: Daily Training Plan',
    content: `<h3>Appendix B: 25 Additional High-Value Interview Questions to Drill</h3>
<ol><li>What is deferred tax and why does it exist?</li><li>Why might a company with high EBITDA still go bankrupt?</li><li>Why is free cash flow often more important than net income?</li><li>How do share repurchases affect EPS?</li><li>Why are stock-based compensation and dilution connected?</li><li>Why would a company choose debt over equity financing?</li><li>What happens if cash increases by $10 on the balance sheet?</li><li>How does an inventory write-down affect the statements?</li><li>How does issuing stock affect enterprise value and equity value?</li><li>Why might EBITDA margin expansion not translate into higher free cash flow?</li><li>What is the difference between enterprise value and market capitalization?</li><li>Why is minority interest added to enterprise value?</li><li>Why are financial institutions valued differently?</li><li>Why might two precedent deals in the same sector have very different premiums?</li><li>How do synergies affect what a buyer can pay?</li><li>Why would a strategic acquirer use stock instead of cash?</li><li>What is dilution from options and how is it treated?</li><li>How does the treasury stock method work conceptually?</li><li>Why could a DCF imply a lower value than trading comps?</li><li>Why do growth and ROIC both matter for valuation?</li><li>Why does a shorter holding period increase IRR, all else equal?</li><li>Why are revenue synergies harder to underwrite?</li><li>What is the difference between accounting earnings and economic earnings?</li><li>When would P / E be more useful than EV / EBITDA?</li><li>How would a recession affect valuation methodologies differently?</li></ol>

<h3>Appendix C: Daily 30-Minute Training Plan</h3>
<p><strong>10 minutes:</strong> Accounting / three-statement drill</p>
<p><strong>10 minutes:</strong> Valuation or M&amp;A concept drill</p>
<p><strong>10 minutes:</strong> Behavioral answer and rapid-fire technical questions</p>
<p>Repeat daily. Mastery comes from repeated explanation, not passive rereading.</p>

<h3>Closing Note</h3>
<p>The best investment banking candidates do not just know the terms. They understand the machine.</p>
<p>They know how revenue becomes EBITDA, how EBITDA becomes cash flow, how cash flow becomes value, how value drives deal decisions, and how financing changes outcomes. They can move from accounting to valuation to M&amp;A to LBO without sounding like they changed subjects, because in real finance these are not separate subjects. They are one connected system.</p>
<p>That is the level of mastery this manual is designed to build.</p>`,
  },
];
