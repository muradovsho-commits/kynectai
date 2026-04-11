export const RE_INTERVIEW_SECTIONS = [
  {
    title: 'RE Interview Format',
    content: `<p>Real estate interviews combine: technical questions (valuation, NOI, cap rates, lease analysis, debt metrics), market knowledge (what's happening in RE markets, interest rates, cap rate trends by property type), modeling tests (build or analyze a property-level pro forma), and behavioral/fit questions. Many REPE firms also give take-home case studies requiring you to underwrite a deal and make an investment recommendation.</p>`,
  },
  {
    title: 'Technical Questions',
    content: `<div class="interview-q">
<div class="q-label">Q1</div>
<div class="question">Walk me through a real estate pro forma.</div>
<div class="answer">Start with Gross Potential Rent (every unit leased at market rent). Add other income (parking, laundry, fees). Subtract vacancy and credit loss to get Effective Gross Income. Subtract operating expenses (property taxes, insurance, maintenance, management, utilities) to get NOI. Below NOI, subtract capital expenditures (TI, LC, building CapEx) to get Net Cash Flow. Then subtract debt service (interest + amortization) to get levered cash flow available to equity investors. Project this annually over the hold period, then model the exit sale using a terminal cap rate applied to the exit-year NOI. Calculate equity IRR and multiple from the initial equity investment, annual levered cash flows, and exit equity proceeds.</div>
</div>

<div class="interview-q">
<div class="q-label">Q2</div>
<div class="question">What is a cap rate and what drives it?</div>
<div class="answer">A cap rate is the unlevered yield on a real estate investment: NOI / Property Value. It represents the return an all-cash buyer would earn. Cap rates are driven by: the risk-free rate (Treasury yields set the floor&mdash;if you can earn 4.5% risk-free, you demand more from a risky property), the property's risk profile (location, tenant quality, lease term, building condition), supply/demand dynamics (excess supply depresses rents and widens cap rates), and capital market conditions (investor appetite for real estate compresses cap rates when abundant). Lower cap rates mean higher prices and lower risk; higher cap rates mean lower prices and higher risk. A Class A apartment in Manhattan might trade at a 4.0% cap rate; a Class C office in a tertiary market might trade at 9.0%+.</div>
</div>

<div class="interview-q">
<div class="q-label">Q3</div>
<div class="question">Interest rates rise by 200 bps. What happens to real estate values?</div>
<div class="answer">All else equal, real estate values decline because cap rates tend to expand when interest rates rise (the risk-free alternative becomes more attractive, so investors demand higher yields from property). If a property's NOI is $5M and cap rates move from 5.5% to 6.5%, value drops from $90.9M to $76.9M&mdash;a 15% decline from a 100 bps cap rate move. However, there are offsets: if rates are rising because the economy is strong, NOI may also be rising (higher occupancy, rent growth), which partially cushions the valuation impact. Also, cap rates don't move 1:1 with interest rates&mdash;the relationship is directional, not linear. Historically, a 100 bps increase in Treasuries has corresponded to roughly 25&ndash;75 bps of cap rate expansion depending on the cycle.</div>
</div>

<div class="interview-q">
<div class="q-label">Q4</div>
<div class="question">What is the difference between FFO and AFFO?</div>
<div class="answer">FFO (Funds From Operations) starts with Net Income, adds back real estate depreciation and amortization, and removes gains/losses on property sales. It's the standard REIT earnings metric because D&A on real estate overstates the actual decline in property value (buildings generally appreciate, not depreciate). AFFO goes further: it subtracts maintenance CapEx (the actual recurring capital needed to maintain the properties) and adjusts for straight-line rent (which recognizes lease revenue evenly even if the actual cash payments escalate). AFFO is a better approximation of recurring cash flow, but it's less standardized&mdash;different REITs define it differently, so you must read the footnotes. P/AFFO is the cleanest valuation multiple for REITs.</div>
</div>

<div class="interview-q">
<div class="q-label">Q5</div>
<div class="question">You're evaluating a multifamily value-add deal. What do you look for?</div>
<div class="answer">Five things: (1) Below-market rents with a clear mark-to-market opportunity (in-place rents 10&ndash;20% below comparable renovated units in the submarket). (2) Physical condition that supports renovation (good bones, solid structure, but dated interiors&mdash;meaning the renovation is cosmetic, not structural). (3) Renovation cost per unit that generates an attractive return (if a $12K renovation per unit enables a $200/month rent increase, that's a 20%+ unlevered return on the CapEx). (4) Location fundamentals that support rent growth (employment growth, population growth, supply constraints, proximity to transit/amenities). (5) Conservative underwriting: can the deal still produce acceptable returns if rent premiums are 25% lower than projected or if the renovation timeline extends by 6 months?</div>
</div>

<div class="interview-q">
<div class="q-label">Q6</div>
<div class="question">A building has $4M NOI, a 6% cap rate, and is financed with a 65% LTV loan at 5.5% interest with 30-year amortization. What is the DSCR?</div>
<div class="answer">Value = $4M / 6% = $66.7M. Loan = 65% × $66.7M = $43.3M. Annual debt service on a $43.3M loan at 5.5% with 30-year amortization: the monthly payment is calculated using the mortgage formula, but we can approximate. Annual interest: $43.3M × 5.5% = $2.38M. Annual principal amortization (Year 1): roughly $0.45M (increases over time). Total debt service ≈ $2.83M. DSCR = $4.0M / $2.83M ≈ <strong>1.41x</strong>. This comfortably exceeds the typical 1.25x minimum. The property generates 41% more income than needed to service the debt.</div>
</div>

<div class="interview-q">
<div class="q-label">Q7</div>
<div class="question">Why real estate? Why not traditional PE or investment banking?</div>
<div class="answer">Real estate is uniquely tangible&mdash;you can visit the asset, walk the property, and directly observe the factors that drive value (location, physical condition, tenant activity). This creates a feedback loop between analysis and reality that doesn't exist when analyzing abstract financial instruments. I'm also drawn to the multi-disciplinary nature of RE: it combines financial analysis (pro forma modeling, debt structuring) with market knowledge (supply/demand dynamics, demographic trends), legal understanding (lease analysis, zoning, entitlements), and operational management (construction oversight, property management). Every deal is different because every property is unique, which keeps the work intellectually engaging. And the returns profile appeals to me: real estate generates both current income (from rent) and capital appreciation, creating a tangible connection between the work you do (improving a property) and the returns you generate.</div>
</div>

<div class="interview-q">
<div class="q-label">Q8</div>
<div class="question">What is happening in real estate markets right now?</div>
<div class="answer">You must have a current, specific answer to this question. Touch on: where interest rates are and where they're headed (this is the most important macro driver for RE), transaction volume trends (has it recovered from the rate shock, or is the bid-ask gap persisting?), which property types are performing well and which are struggling (industrial and multifamily are generally resilient; office faces structural challenges from remote work), cap rate trends by sector (are they stabilizing, expanding, or compressing?), and any specific stories dominating RE headlines (major defaults, notable transactions, regulatory changes). The best answers demonstrate that you're reading RE-specific sources (Green Street, CBRE research, Real Capital Analytics, CoStar, Bisnow) and forming your own views.</div>
</div>`,
  },
  {
    title: 'Common RE Interview Mistakes',
    content: `<div class="mistake-box">
<strong>Not knowing current cap rates.</strong> You should know approximate cap rate ranges for each major property type in major markets. If the interviewer asks "What's the cap rate for a Class A multifamily in the Sun Belt?" and you can't give a range (roughly 4.5&ndash;5.5% as of recent market conditions), you signal a lack of market engagement.
</div>

<div class="mistake-box">
<strong>Confusing NOI with cash flow.</strong> NOI is before debt service and CapEx. Cash flow after debt service is what equity investors receive. Mixing these up in an interview is a fundamental error that's hard to recover from.
</div>

<div class="mistake-box">
<strong>Forgetting that cap rate = NOI / Value, not the reverse.</strong> This sounds basic but under pressure, candidates transpose the formula. Practice until it's reflexive: if you're given NOI and cap rate, Value = NOI / Cap Rate. If you're given NOI and value, Cap Rate = NOI / Value.
</div>

<div class="mistake-box">
<strong>No property type or market preference.</strong> "I'm interested in all real estate" is not an answer. Pick a property type and a market you find interesting and be able to discuss the specific dynamics intelligently. "I'm interested in industrial assets in the Sun Belt because of the intersection of nearshoring trends, population migration, and constrained land availability near logistics corridors" is an answer.
</div>

<div class="takeaway-box">
<strong>The Real Estate Mindset:</strong> Real estate investing is ultimately about understanding three things: the physical asset (its quality, condition, and location), the cash flows (lease structure, tenant quality, and expense dynamics), and the capital markets environment (interest rates, cap rates, and investor appetite). The best RE professionals integrate all three into a coherent investment thesis. They can walk a property, read a rent roll, build a pro forma, structure the financing, and explain why the investment will generate a 15% IRR&mdash;all in the same conversation. Start developing this integrated perspective now, and you'll be well prepared for any RE interview or role.
</div>

</div>`,
  },
];
