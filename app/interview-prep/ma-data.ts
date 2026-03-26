// Investment Banking Technical Mastery Manual — Module 5: M&A
export const MA_SECTIONS = [
  {
    title: '5.1–5.2 What M&A Is & Core Questions Bankers Ask',
    content: `<h3>5.1 What M&amp;A Is From First Principles</h3>
<p>A merger or acquisition is a transaction in which one company combines with or purchases another.</p>
<p><strong>Why M&amp;A exists:</strong> Companies pursue M&amp;A to: Grow faster, Enter new markets, Acquire technology or capabilities, Achieve cost synergies, Increase market share, Eliminate competitors, Reallocate capital more efficiently.</p>
<p><strong>Why bankers care:</strong> Investment bankers advise on these transactions, analyze financial impact, structure deals, and help clients negotiate and execute.</p>

<h3>5.2 Core M&amp;A Questions Bankers Ask</h3>
<ol><li>Should the buyer do the deal strategically?</li><li>Can the buyer afford it?</li><li>What should the buyer pay?</li><li>What is the deal worth to the seller?</li><li>Will the deal be accretive or dilutive?</li><li>What synergies exist?</li><li>What are the financing and accounting consequences?</li><li>What are the execution and integration risks?</li></ol>`,
  },
  {
    title: '5.3 Accretion / Dilution Analysis',
    content: `<h3>5.3.1 What It Is</h3>
<p>Accretion / dilution measures whether a deal increases or decreases the buyer's EPS.</p>
<p><strong>Why it exists:</strong> Public market investors often focus on EPS impact, especially in the near term.</p>
<p><strong>Key point:</strong> Accretion / dilution is not the same thing as whether a deal creates value. A deal can be accretive but strategically terrible. It can also be dilutive short term but highly valuable long term.</p>
<p><strong>Strong answer:</strong> "Accretion / dilution tells you whether a transaction increases or decreases the acquirer's EPS, but it does not by itself determine whether the deal is good. True value creation depends on whether the buyer pays less than the target is worth including synergies, adjusted for execution risk."</p>

<h3>5.3.2 Basic Accretion / Dilution Drivers</h3>
<p><strong>A deal is more likely to be accretive if:</strong> The target has a lower P / E than the buyer, especially in stock deals. Financing is cheap, especially low-cost debt. Synergies are high. Purchase accounting charges are limited. The buyer pays a reasonable premium.</p>
<p><strong>A deal is more likely to be dilutive if:</strong> The buyer pays a high premium. New shares issued are expensive in terms of EPS impact. The target has low earnings relative to purchase price. Financing costs are high. D&amp;A from write-ups and intangibles amortization are significant.</p>

<h3>5.3.3 Simplified Accretion / Dilution Framework</h3>
<p>Start with:</p>
<ol><li>Target standalone net income contribution</li><li>Add synergies after tax</li><li>Subtract financing costs after tax</li><li>Subtract foregone interest on cash used after tax</li><li>Subtract incremental D&amp;A / intangible amortization after tax</li><li>Divide combined earnings by new diluted share count</li><li>Compare buyer standalone EPS vs pro forma EPS</li></ol>

<h3>5.3.4 Cash vs Stock vs Mixed Consideration</h3>
<p><strong>Cash deal:</strong> Buyer uses cash or debt-financed cash. Effects: No new shares issued, Potential interest expense if debt financed, Potential lost interest income if cash used, Usually less dilution to ownership.</p>
<p><strong>Stock deal:</strong> Buyer issues shares to seller. Effects: No cash interest burden, Share count increases, EPS impact depends on relative P / E and target earnings.</p>
<p><strong>Mixed deal:</strong> Combination of both.</p>
<p><strong>Classic stock-for-stock intuition:</strong> If the buyer has a higher P / E than the target, the deal is more likely to be accretive in a stock deal because the buyer is effectively using "expensive currency" to buy "cheaper earnings."</p>
<p><strong>Important nuance:</strong> This is directionally helpful but not a complete analysis. Synergies, premium, and accounting impacts still matter.</p>

<h3>5.3.5 Example Accretion / Dilution Walkthrough</h3>
<p>Suppose: Buyer net income = 200, Buyer shares = 100 → EPS = 2.00, Target net income = 40, Deal financed with 50% cash debt-financed at 6% and 50% stock, Purchase price = 500, Synergies = 20 pre-tax, Tax rate = 25%, New shares issued = 10.</p>
<p><strong>Step 1:</strong> Buyer standalone earnings: 200</p>
<p><strong>Step 2:</strong> Add target earnings: +40</p>
<p><strong>Step 3:</strong> Add after-tax synergies: 20 × (1 - 25%) = +15</p>
<p><strong>Step 4:</strong> Subtract after-tax financing cost: Cash portion = 250. Interest = 250 × 6% = 15. After-tax interest cost = 15 × (1 - 25%) = 11.25</p>
<p><strong>Step 5:</strong> Pro forma earnings: 200 + 40 + 15 - 11.25 = 243.75</p>
<p><strong>Step 6:</strong> Pro forma shares: 100 + 10 = 110</p>
<p><strong>Step 7:</strong> Pro forma EPS: 243.75 / 110 = 2.216</p>
<p><strong>Step 8:</strong> Compare to buyer standalone EPS: 2.216 vs 2.00 → <strong>accretive</strong></p>
<p><strong>Interview insight:</strong> A strong candidate explains the logic, not just the number.</p>`,
  },
  {
    title: '5.4 Synergies',
    content: `<h3>5.4.1 What They Are</h3>
<p>Synergies are benefits that arise because the companies are combined.</p>
<p><strong>Main categories:</strong></p>
<p><strong>Cost synergies:</strong> Headcount rationalization, Procurement savings, Facility consolidation, Elimination of duplicate overhead.</p>
<p><strong>Revenue synergies:</strong> Cross-selling, Bundling, Geographic expansion, Customer access.</p>
<p><strong>Why cost synergies are easier:</strong> They are typically more tangible, faster to model, and more controllable.</p>
<p><strong>Why revenue synergies are riskier:</strong> They depend on customer behavior, sales execution, and integration success.</p>
<p><strong>Interview nuance:</strong> When discussing synergies, strong candidates mention: timing, one-time implementation costs, execution risk, tax impact.</p>`,
  },
  {
    title: '5.5 Purchase Price Allocation (PPA) Basics',
    content: `<p>This is an advanced but common IB topic.</p>
<p><strong>What it is:</strong> In an acquisition, the buyer allocates the purchase price to: acquired assets at fair value, assumed liabilities at fair value, newly identified intangible assets, residual goodwill.</p>
<p><strong>Why it exists:</strong> Accounting rules require the acquirer to step up the target's balance sheet to fair value.</p>
<p><strong>Common consequences:</strong> PP&amp;E may be written up, Intangibles may be created, Goodwill often arises, Future D&amp;A or amortization may increase.</p>
<p><strong>Why bankers care:</strong> PPA affects post-deal earnings, especially through incremental D&amp;A and amortization, which can affect accretion / dilution.</p>
<p><strong>Goodwill formula conceptually:</strong> Goodwill = Purchase Price - Fair Value of Identifiable Net Assets Acquired</p>`,
  },
  {
    title: '5.6–5.9 Accretive vs Dilutive Logic, Strategic vs Financial Buyers, Deal Types + Module 5 Practice',
    content: `<h3>5.6 Why Deals Are Accretive or Dilutive</h3>
<p><strong>Better-than-average answer:</strong> "A deal becomes accretive when the incremental earnings contribution from the target plus after-tax synergies exceeds the earnings drag from financing costs, foregone interest, additional share issuance, and purchase accounting effects on a per-share basis. It becomes dilutive when those costs outweigh the earnings contribution."</p>

<h3>5.7 Strategic Buyers vs Financial Buyers</h3>
<p><strong>Strategic buyer:</strong> Usually an operating company. Can often justify paying more due to synergies.</p>
<p><strong>Financial buyer:</strong> Usually a PE firm. Focuses on returns based on leverage, cash flow, and exit value. Less likely to underwrite large speculative revenue synergies.</p>
<p><strong>Interview nuance:</strong> This distinction helps explain why a strategic buyer may win an auction.</p>

<h3>5.8 Friendly vs Hostile Deals, Tender Offers, and Mergers</h3>
<p>For most IB technical interviews, keep the answer high level unless pushed.</p>
<p><strong>Friendly deal:</strong> Management and board support the transaction.</p>
<p><strong>Hostile deal:</strong> Buyer bypasses management resistance, often appealing directly to shareholders.</p>
<p><strong>Tender offer:</strong> Buyer offers to purchase shares directly from shareholders, often at a premium.</p>

<h3>5.9 Common M&amp;A Interview Questions</h3>
<ul><li>What makes a deal accretive or dilutive?</li><li>Why might a company do an acquisition?</li><li>Why can a strategic buyer pay more than a financial sponsor?</li><li>Why does a stock deal depend on relative P / E?</li><li>What are synergies?</li><li>What is goodwill?</li><li>How does purchase accounting affect earnings?</li></ul>

<h3>Module 5 Practice Drills</h3>
<p><strong>Technical drills:</strong></p>
<ol><li>Explain accretion / dilution in plain English</li><li>Explain why a higher-P / E buyer is advantaged in a stock deal</li><li>Explain cost vs revenue synergies</li><li>Explain goodwill creation</li><li>Explain how debt financing affects accretion / dilution</li><li>Explain why accretive does not always mean value-creating</li></ol>
<p><strong>Interview-style questions:</strong> Walk me through an accretion / dilution analysis. Why might a company pay a premium in an acquisition? What is purchase price allocation? Why are cost synergies usually viewed as more credible than revenue synergies?</p>
<p><strong>Explain-out-loud exercise:</strong> Take a recent large acquisition you know and explain: why the buyer did it, what synergies likely existed, what risks the buyer faced, whether the market may have viewed it as accretive or dilutive.</p>
<p><strong>Self-testing framework — For any M&amp;A question, ask:</strong></p>
<ol><li>What is the buyer trying to achieve?</li><li>What is the target worth standalone?</li><li>What synergies exist and how credible are they?</li><li>How is the deal financed?</li><li>What happens to EPS?</li><li>What are the accounting and integration consequences?</li></ol>`,
  },
];
