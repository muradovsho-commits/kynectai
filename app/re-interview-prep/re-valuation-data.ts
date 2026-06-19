export const RE_VALUATION_SECTIONS = [
  {
    title: 'The Cap Rate, Properly Understood',
    content: `<p>The capitalization rate is the most important and most frequently tested concept in real estate. It is the property's unlevered yield: the first-year NOI as a percentage of the property's value or price.</p>

<div class="formula-box">Cap Rate = NOI / Property Value<br/><br/>Property Value = NOI / Cap Rate<br/><br/>NOI = Property Value x Cap Rate</div>

<p>Those three forms are the same equation rearranged, and you must be able to move between them instantly. Given any two, solve for the third. A property with 1,000,000 of NOI valued at a 5 percent cap rate is worth 1,000,000 / 0.05 = 20,000,000. The same NOI at an 8 percent cap is worth only 12,500,000. Same income, very different value, purely because of the yield investors demand.</p>

<div class="key-concept"><strong>The cap rate is an inverse multiple, and its direction confuses people constantly.</strong> A <strong>low</strong> cap rate means a <strong>high</strong> price (investors accept a low yield, so they are paying a lot per dollar of NOI), and a <strong>high</strong> cap rate means a <strong>low</strong> price. Low cap rates signal low perceived risk, strong growth expectations, or abundant cheap capital: prime assets in gateway markets trade at low caps. High cap rates signal higher risk, weaker growth, or scarce capital: secondary assets in weaker markets trade at high caps. So the cap rate is simultaneously a yield, an inverse price multiple, and a risk-and-growth signal.</div>

<div class="mistake-box"><strong>The classic trap:</strong> "do you want to buy at a high or low cap rate?" As a buyer seeking yield, a higher going-in cap rate means you pay less per dollar of income, which sounds better, but it usually comes with more risk or less growth. As a seller, you want to sell at a low cap rate (a high price). And you generally want the cap rate to <strong>compress</strong> (fall) during your hold, because that raises the value of your NOI. The right answer is never just "high" or "low"; it is to explain what the cap rate is compensating you for.</div>`,
  },
  {
    title: 'What Drives Cap Rates',
    content: `<p>Cap rates are set by the market, and understanding what moves them is what separates a real answer from a memorized definition. Three forces dominate.</p>

<div class="framework-box"><div class="fw-label">WHAT MOVES CAP RATES</div><strong>Interest rates:</strong> real estate competes with bonds for capital. When rates rise, investors demand higher yields on property too, so cap rates tend to rise (values fall) even if NOI is unchanged. This rate sensitivity is why real estate values can drop in a rising-rate environment with no change in the buildings themselves.<br/><strong>Growth expectations:</strong> a property or market with strong expected NOI growth commands a lower cap rate, because buyers will accept a lower going-in yield for the future income. Low caps embed optimism about growth.<br/><strong>Risk:</strong> riskier assets (weaker markets, shorter leases, worse tenants, older buildings) trade at higher cap rates to compensate for the risk.</div>

<div class="key-concept">A useful intuition borrowed from finance: cap rate is roughly the investor's required return minus expected NOI growth. So a low cap rate can reflect either a low required return (cheap capital, low rates) or high expected growth, and a high cap rate reflects the opposite. This is why two buildings with identical current NOI trade at different caps: the market is pricing in different growth and risk. When you explain a cap rate, name which of the three forces is doing the work.</div>

<p><strong>Cap rate compression</strong> (caps falling) raises values and is a tailwind; <strong>expansion</strong> (caps rising) lowers values and is a headwind. A disciplined underwriter does not assume compression; in fact, conservative underwriting usually assumes the exit cap rate is equal to or slightly <strong>higher</strong> than the going-in cap, so the return is driven by NOI growth rather than a bet on the market repricing in your favor.</p>

<div class="pro-tip">A frequent question: "what happens to values if rates rise 100 basis points?" The instinct to show is that cap rates would likely rise too, compressing values, and that levered equity gets hit hardest because it is the residual. Then note the nuance: the relationship is not one-for-one, because growth expectations and risk premia also move, and in strong-growth periods caps can stay low even as rates rise.</div>`,
  },
  {
    title: 'Going-In vs Exit Cap, and the Spread to Debt',
    content: `<p>Two cap-rate refinements come up constantly in underwriting and interviews.</p>

<p><strong>Going-in (entry) cap rate</strong> is NOI over your purchase price at acquisition. <strong>Exit (terminal) cap rate</strong> is the cap rate you assume a future buyer will pay when you sell, applied to your forward NOI at exit. The relationship between them is one of the most important assumptions in any model.</p>

<div class="key-concept">If you assume the exit cap is <strong>lower</strong> than the going-in cap (compression), you are baking in a market tailwind that inflates returns and may not materialize. Conservative underwriting assumes the exit cap is <strong>equal to or higher than</strong> the going-in cap, often adding 25 to 50 basis points to reflect the asset being older at exit and to avoid relying on market timing. A surprising amount of a model's IRR can hinge on this single assumption, so interviewers probe it to see whether you understand that exit cap assumptions can manufacture returns out of thin air.</div>

<p><strong>The spread to debt</strong> (positive vs negative leverage) is the other key relationship. Compare the going-in cap rate to the interest rate on the debt:</p>

<table class="comparison-table">
<tr><th>Condition</th><th>Name</th><th>Effect on equity</th></tr>
<tr><td>Cap rate > interest rate</td><td>Positive leverage</td><td>Debt boosts the cash-on-cash return above the unlevered yield</td></tr>
<tr><td>Cap rate < interest rate</td><td>Negative leverage</td><td>Debt drags the cash return below the unlevered yield; you bet on growth</td></tr>
</table>

<div class="example-box">
<div class="example-label">Positive vs negative leverage</div>
<p>Buy at a 6 percent cap with debt at 4 percent: each borrowed dollar earns 6 and costs 4, so leverage lifts the equity yield (positive leverage). Buy at a 5 percent cap with debt at 6 percent: each borrowed dollar earns 5 and costs 6, so leverage drags the equity yield below the unlevered 5 (negative leverage). Negative leverage was rare when rates were low and became common as rates rose above cap rates, which is exactly why deal volume fell: buyers either needed cap rates to rise or had to underwrite aggressive NOI growth to justify deals.</p>
</div>`,
  },
  {
    title: 'The Three Approaches to Value',
    content: `<p>Real estate appraisal recognizes three approaches to value. The income approach dominates institutional investing, but you should know all three and when each applies.</p>

<table class="comparison-table">
<tr><th>Approach</th><th>How it works</th><th>Best for</th></tr>
<tr><td>Income approach</td><td>Capitalize NOI at a market cap rate, or discount projected cash flows (DCF)</td><td>Income-producing property; the institutional default</td></tr>
<tr><td>Sales comparison</td><td>Value off recent sales of comparable assets, on a per-unit or per-square-foot basis</td><td>Homes, and as a cross-check on cap rates everywhere</td></tr>
<tr><td>Cost (replacement) approach</td><td>Land value plus the depreciated cost to rebuild the improvements</td><td>New, special-purpose, or unique assets; a supply ceiling check</td></tr>
</table>

<p><strong>The income approach</strong> has two flavors. <strong>Direct capitalization</strong> divides a single year's NOI by a cap rate, fast and common for stabilized assets. <strong>Discounted cash flow</strong> projects NOI and a sale (reversion) over a hold period and discounts the cash flows to present value at a required return, better for assets with changing cash flows like value-add or development. <strong>Sales comparison</strong> grounds value in what similar assets actually traded for and is the basis for metrics like price per unit and price per square foot. <strong>The cost approach</strong> reflects that no rational buyer pays much more than the cost to build new, so replacement cost is a soft ceiling on value and a key constraint on new development: when prices sit below replacement cost, building new does not pencil and supply stays constrained.</p>

<div class="key-concept">These are cross-checks, not competitors. A disciplined valuation triangulates: capitalize the NOI, sanity-check against recent comparable sales on a per-unit basis, and compare to replacement cost to gauge whether new supply is a threat. When they disagree sharply, the disagreement is itself information, often a signal about growth expectations or supply risk that one method is missing.</div>

<div class="pro-tip">Quick valuation metrics worth memorizing as gut checks: <strong>price per unit</strong> (multifamily), <strong>price per square foot</strong> (most commercial), <strong>gross rent multiplier</strong> (price over gross rent, a rough screen), and of course the <strong>cap rate</strong>. Interviewers love rapid back-of-envelope questions, and fluency with these lets you sanity-check a number in seconds.</div>`,
  },
];
