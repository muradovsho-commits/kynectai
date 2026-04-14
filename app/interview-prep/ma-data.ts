export const MA_SECTIONS = [
  {
    title: 'Why Companies Acquire Other Companies',
    content: `<p>An acquisition is a shortcut. Building a new product line from scratch might take five years and $200 million in R&D spending. Acquiring a company that already has that product line might cost $500 million upfront, but the buyer gets it <em>now</em>-with existing customers, proven technology, and trained employees. If the acquired business generates $70 million in annual cash flow, the buyer might conclude that paying $500M today is cheaper than spending $200M over five years <em>and</em> foregoing the $70M in annual cash flow during the build period.</p>

<p>From a financial theory perspective, an acquisition makes sense when the buyer expects the IRR on the deal to exceed its WACC, or equivalently, when the target's asking price is below its intrinsic value to the buyer (including synergies).</p>

<p>Acquisitions are funded with three types of currency: <strong>Cash</strong> (from the buyer's balance sheet), <strong>Debt</strong> (new borrowings), and <strong>Stock</strong> (issuing new shares to the target's shareholders). Each has different implications for the deal's financial profile and risk.</p>`,
  },
  {
    title: 'EPS Accretion and Dilution',
    content: `<p>For deals involving public companies, the most traditional evaluation framework asks: <strong>Does the acquisition increase or decrease the buyer's Earnings Per Share (EPS)?</strong></p>

<p>An <strong>accretive</strong> deal increases EPS; a <strong>dilutive</strong> deal decreases it. All else equal, investors prefer accretive deals because higher EPS supports a higher stock price.</p>

<p>The calculation: combine the buyer's and target's Net Income, adjust for the costs of the deal (lost interest on cash, new interest on debt, new D&A from purchase price allocation, synergies), and divide by the new share count (buyer's existing shares plus any new shares issued).</p>

<h4>Quick Rules of Thumb</h4>

<p>For a <strong>100% Stock deal</strong>: if the buyer's P/E ratio exceeds the target's P/E, the deal is accretive. The buyer is "paying" with expensively valued shares to buy cheaper earnings. If the buyer's P/E is 18x and the target's is 12x, each dollar of buyer stock buys proportionally more earnings than it gives up.</p>

<p>For a <strong>100% Cash or Debt deal</strong>: compare the target's earnings yield (1/P/E) to the after-tax cost of the funding source. If the target's earnings yield exceeds the after-tax cost, the deal is accretive. For example, if the target's P/E is 15x (yield = 6.7%) and the after-tax cost of new Debt is 4%, the deal generates more in acquired earnings than it costs in new interest.</p>`,
  },
  {
    title: 'Merger Model Mechanics',
    content: `<p>A complete merger model follows a structured sequence:</p>

<p><strong>1. Standalone Projections:</strong> Build financial forecasts for both buyer and target. At minimum, you need projected Income Statements and key Cash Flow Statement items.</p>

<p><strong>2. Purchase Price Determination:</strong> Calculate the Equity Purchase Price (what target shareholders receive) and the Enterprise Purchase Price (total cost including assumed Debt minus Cash received).</p>

<p><strong>3. Sources &amp; Uses:</strong> Sources = Cash from buyer's balance sheet + New Debt + New Stock issued. Uses = Equity Purchase Price + Debt refinancing + Transaction fees. Sources must equal Uses.</p>

<p><strong>4. Purchase Price Allocation:</strong> Allocate the excess of the Purchase Price over the target's book value. Write up existing assets to fair value, create identifiable intangible assets (customer relationships, technology, brand), and record the residual as Goodwill. The new D&A from write-ups and intangibles will reduce future combined earnings.</p>

<p><strong>5. Balance Sheet Combination:</strong> Add the two companies' Balance Sheets, then adjust for deal effects: Cash used, new Debt, new shares, asset write-ups, new Goodwill, and elimination of the target's old equity. The combined BS must balance.</p>

<p><strong>6. Income Statement Combination:</strong> Combine revenues and expenses, then adjust for: synergies (cost savings, revenue enhancements), new D&A from purchase price allocation, foregone interest on cash used, and interest on new Debt. Calculate Combined EPS.</p>

<p><strong>7. Cash Flow and Debt Projections:</strong> Especially important for debt-heavy deals. As the combined company generates cash flow and repays debt, Interest Expense decreases, improving future EPS. Track how the leverage profile evolves.</p>

<p><strong>8. Sensitivity Analysis:</strong> Test how results change across different purchase prices, funding mixes, synergy levels, and interest rates.</p>`,
  },
  {
    title: 'Synergies',
    content: `<p><strong>Cost synergies</strong> arise from eliminating redundancies after combining two companies: consolidating overlapping corporate offices, reducing duplicate technology platforms, negotiating better supplier terms with greater purchasing power, or reducing headcount in overlapping functions. These are relatively predictable and quantifiable.</p>

<p><strong>Revenue synergies</strong> arise from cross-selling products to each other's customer bases, entering new geographic markets, or combining distribution channels. These are far more speculative and frequently fail to materialize at projected levels.</p>

<p>In modeling, synergies are phased in over 2-3 years (they don't materialize instantly) and offset by <strong>integration costs</strong> (severance, systems migration, facility consolidation). The net benefit is what matters for the accretion/dilution calculation.</p>`,
  },
  {
    title: 'Deal Structures',
    content: `<p>In a <strong>Stock Purchase</strong>, the buyer acquires all of the target's outstanding shares and receives everything: all assets, all liabilities, and all off-balance-sheet obligations. In an <strong>Asset Purchase</strong>, the buyer selects specific assets and assumes specific liabilities, leaving the rest behind. Buyers tend to prefer Asset Purchases (they choose what they get, and asset write-ups are tax-deductible). Sellers prefer Stock Purchases (lower tax burden, cleaner separation). A U.S.-specific compromise called a <strong>338(h)(10) election</strong> lets a Stock Purchase be treated as an Asset Purchase for tax purposes.</p>`,
  },
  {
    title: 'Other Ways to Evaluate Deals',
    content: `<p>Accretion/dilution is the most common framework, but it's not the only one-or even the best one in many situations.</p>

<p><strong>IRR Analysis:</strong> Estimate the buyer's IRR from buying the target, running it for several years, and potentially selling it. Compare to the buyer's WACC. This is more theoretically rigorous than accretion/dilution but requires more assumptions (especially about exit timing and price).</p>

<p><strong>Contribution Analysis:</strong> If the buyer contributes 70% of the combined company's revenue and EBITDA, it should own roughly 70% of the combined entity. This is most relevant for all-stock deals and mergers of equals, where ownership percentage directly reflects the purchase price.</p>

<p><strong>Strategic/Qualitative Analysis:</strong> For acquisitions of early-stage companies with no profits (tech startups, biotech), financial models are less relevant. The rationale is strategic: defensive positioning, technology acquisition, talent acquisition, or access to high-growth markets.</p>`,
  },
  {
    title: 'Why Deals Fail',
    content: `<p>The majority of M&A deals either fail to close or destroy value after closing. Common failure modes include: cultural incompatibility between the two organizations, loss of key talent post-acquisition, failure to achieve projected synergies, overpayment driven by competitive bidding or executive ego, undiscovered liabilities emerging after the deal closes, and external shocks (economic downturns, regulatory changes) that undermine the deal thesis.</p>

<p>The lesson: a spreadsheet can tell you whether a deal's <em>financial</em> structure makes sense, but it can't tell you whether the two organizations will work well together, whether customers will stay, or whether management will execute the integration successfully. The human element is usually what determines whether a deal creates or destroys value.</p>`,
  },
  {
    title: 'M&amp;A: Interview Questions',
    content: `<div class="interview-q">
<div class="q-label">Question 1</div>
<div class="question">Walk me through a basic merger model.</div>
<div class="answer">Project standalone financials for both companies. Calculate the Purchase Price and determine the funding mix (Cash, Debt, Stock). Build Sources &amp; Uses. Allocate the Purchase Price (write up assets, create Goodwill). Combine Balance Sheets, then combine Income Statements with adjustments for deal effects: foregone interest, new interest expense, new D&A, and synergies. Calculate Combined EPS and determine accretion/dilution. Run sensitivity analysis on key variables.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 2</div>
<div class="question">A buyer with a P/E of 22x acquires a target with a P/E of 16x using 100% Stock. Accretive or dilutive?</div>
<div class="answer">Accretive. The buyer's P/E is higher, meaning each share of buyer stock is "expensive" relative to the earnings it represents. When that expensive stock is exchanged for cheaper earnings (the target at 16x), the combined EPS increases. Intuitively, the buyer is trading away highly valued earnings and receiving more earnings per dollar of stock given up.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 3</div>
<div class="question">What is Goodwill, and when is it created?</div>
<div class="answer">Goodwill is the excess of the purchase price over the fair market value of the target's identifiable net assets. It arises in M&A when a buyer pays a premium for things that don't appear as discrete assets on the Balance Sheet-established brand reputation, assembled workforce, expected synergies, and competitive market position. Goodwill is not amortized; it sits on the Balance Sheet and is tested annually for impairment. If the acquired business loses value, Goodwill is written down through a non-cash charge on the Income Statement.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 4</div>
<div class="question">Can a deal be accretive but still be a bad idea?</div>
<div class="answer">Yes. Accretion can be manufactured-for example, by funding a deal with very cheap Debt, any target with a P/E below 1/(After-Tax Cost of Debt) will appear accretive. But that doesn't mean the acquisition creates long-term value. The buyer may have overpaid (resulting in future Goodwill impairments), the cultures may clash, key employees may leave, or the strategic rationale may be flawed. A deal that's dilutive in Year 1 but creates strong long-term value (e.g., acquiring a high-growth platform) might be a far better decision.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 5</div>
<div class="question">What's the difference between Equity Purchase Price and Enterprise Purchase Price?</div>
<div class="answer">Equity Purchase Price is what the target's shareholders receive-the offer price per share times shares outstanding. Enterprise Purchase Price is the total cost of acquiring the operating business: Equity Purchase Price plus the target's Debt (which the buyer assumes or must repay) minus the target's Cash (which the buyer receives). Enterprise Purchase Price represents the full economic cost of the transaction.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 6</div>
<div class="question">When would you use a Contribution Analysis instead of accretion/dilution?</div>
<div class="answer">Contribution Analysis is most useful for all-stock deals and mergers of equals, where the ownership split between buyer and seller is the key variable. If the buyer contributes 65% of combined EBITDA, it should arguably own ~65% of the combined entity. If the deal terms give the buyer more or less than that, the purchase price may be too low or too high. This is less relevant for all-cash or all-debt deals, where the buyer retains 100% ownership regardless.</div>
</div>

<div class="interview-q">
<div class="q-label">Question 7</div>
<div class="question">What are the differences between Stock Purchases and Asset Purchases?</div>
<div class="answer">In a Stock Purchase, the buyer acquires all the target's shares and gets everything-all assets, liabilities, and off-balance-sheet items. In an Asset Purchase, the buyer selects specific assets and liabilities. Buyers typically prefer Asset Purchases because they can cherry-pick what they want and the asset write-ups are tax-deductible (reducing future cash taxes). Sellers prefer Stock Purchases because they pay lower taxes (only on the purchase price, not on individual asset gains) and transfer all liabilities to the buyer. Asset Purchases are more common for smaller private company deals and divestitures.</div>
</div>`,
  },
];
