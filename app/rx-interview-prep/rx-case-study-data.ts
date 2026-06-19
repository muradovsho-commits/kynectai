export const RX_CASE_STUDY_SECTIONS = [
  {
    title: 'Building a Cap Table',
    content: `<p>A capitalization table lays out the company's debt and equity in priority order with the key facts for each tranche: the instrument, the amount outstanding, the interest rate, the maturity, the lien or priority position, and often the current trading price of the debt and the implied leverage at each level.</p>

<p>You build it by going through the financial statements and debt disclosures and listing each piece of capital from most senior (top) to most junior (bottom): revolver, secured term loans and notes, unsecured notes, subordinated debt, then equity. Alongside the dollar amounts you typically show cumulative debt and a leverage multiple at each tranche (cumulative debt through that level divided by EBITDA), so a reader can see how leverage builds as you go down the stack. Many groups also include total liquidity (cash plus undrawn revolver availability) because it signals runway, which is why MDs want it on the page.</p>

<div class="key-concept">The cap table is the foundation for the waterfall: you cannot distribute value down a structure you have not laid out. In an interview, being asked to build the cap table usually means: state the tranches in priority order with their amounts, and identify where leverage sits.</div>`,
  },
  {
    title: 'Liquidity Roll-Forwards',
    content: `<p>A liquidity roll-forward (or cash-flow forecast) projects the company's cash position forward in time, usually week by week (the famous thirteen-week cash flow forecast) or month by month, to estimate when the company runs out of money. You start with the current cash balance and available revolver capacity, then for each period add expected inflows (collections) and subtract outflows (payroll, suppliers, rent, capital expenditure, and crucially cash interest on the debt). The running balance tells you how much runway remains.</p>

<div class="key-concept">The roll-forward drives the strategic clock of the entire situation. It answers the most important practical question: how much time is there before the company cannot pay its bills. That timeline determines how much negotiating leverage each party has, whether a financing is urgently needed, and whether the company can afford a slow negotiated solution or must move fast. In a pitch, projecting the cash runway forward is the polite way of showing a company that something has to happen, and when.</div>`,
  },
  {
    title: 'Going-Concern vs Liquidation, EBITDA, and Tax Attributes',
    content: `<p><strong>Going-concern vs liquidation value.</strong> You value a distressed company two ways. Going-concern value is what the business is worth as a continuing operation (comps and a discounted cash flow). Liquidation value is what you would get selling assets piecemeal, usually much lower because you lose the value of the operating whole and often sell into a forced-sale discount. If going-concern exceeds liquidation, reorganize. If liquidation exceeds going-concern, the business is worth more dead than alive. Liquidation value also sets the legal floor through the best-interests test.</p>

<p><strong>EBITDA adjustments.</strong> Distressed companies frequently present adjusted or pro forma EBITDA loaded with add-backs (one-time charges, restructuring costs, optimistic cost-savings assumptions). Because the valuation and leverage analysis key off EBITDA, scrutinizing those adjustments and forming a view of normalized, sustainable EBITDA is a core skill. Creditors fight over EBITDA definitions because the multiple applied to EBITDA drives enterprise value, which drives where value breaks. An aggressive EBITDA helps a debtor argue for a higher valuation that reaches junior claims. A conservative one helps senior creditors argue value breaks above the juniors.</p>

<p><strong>Fresh-start accounting and NOLs.</strong> On emergence, a company generally applies fresh-start reporting, restating assets and liabilities at fair value and starting a new accounting basis. Net operating losses (NOLs) are a tax asset distressed companies often have in abundance, valuable because they can shelter future taxable income, but their use after an ownership change (which a restructuring usually triggers) is limited by tax rules. Awareness is enough for an interview.</p>`,
  },
  {
    title: 'Returns Analysis: MOIC, the IRR Shortcut, and Choosing the Tranche',
    content: `<p>This is where the advisor's mindset meets the investor's. After you have the cap table and the waterfall, you can answer the question a distressed investor actually cares about: which piece of the capital structure should I buy, and what return will it generate.</p>

<p>You will never be expected to compute an exact internal rate of return by hand. Lay out the cash flows for a given tranche: the cash you pay today (face bought times current price) and the cash you receive at exit (recovery plus accrued interest). Then compute the multiple of invested capital (MOIC): total proceeds divided by price paid. To approximate an annualized return, take the MOIC, subtract one, and divide by the number of years.</p>

<div class="example-box">
<div class="example-label">Worked Example</div>
<p>You buy a bond at a price of 50. Through the waterfall it recovers 80, and you collect 10 of accrued interest, for total proceeds of 90, over a two-year hold. MOIC = 90 / 50 = 1.8x. Rough annualized return = (1.8 less 1) / 2 = 0.4, about 40% per year. (This simple-interest shortcut runs a touch high versus the true compounded IRR, but it is exactly the level of precision expected.)</p>
</div>

<div class="key-concept"><strong>Do not just pick the highest recovery.</strong> Compare returns, which means weighing recovery against entry price and coupon. A senior tranche that recovers 100% but trades near par offers a modest return. A junior tranche that recovers only partially but trades very cheap and carries a high coupon can offer a far higher return, because the low entry price and high coupon more than compensate for the incomplete recovery. Lay out each tranche's cash in and cash out, compute MOIC, and the widest spread between proceeds and cost wins. It is often not the safest tranche, and explaining why is exactly the reasoning the interviewer wants.</div>`,
  },
  {
    title: 'The Work Product: Screens, Profiles, Pitches, Modeling',
    content: `<p>Several interview questions circle the actual deliverables a junior banker produces. Speaking to them credibly makes you sound like someone who already knows the job.</p>

<p><strong>Screens and the radar.</strong> The group keeps a running watch list of companies that look like candidates to restructure. A screen is a spreadsheet profiling distressed names on the metrics that signal trouble: capital structure, leverage, liquidity, maturity schedule, and trading levels. A finished screen has a summary page listing every name with its key metrics, followed by a cap table for each. Screens source the next pitch.</p>

<p><strong>Profiles.</strong> A focused one or two page write-up that tells a senior banker most of what they need to engage: a short business description, several bullets on why the company is heading toward distress, a capital structure in priority order, and a trading history showing where the debt has moved.</p>

<p><strong>Pitches.</strong> The deck used to win or advance a mandate. It opens with a situation overview (showing the advisor understands where the company is and how it got there), lays out the capital structure and a liquidity analysis, and presents a menu of potential solutions (A&amp;E, exchange, an out-of-court liability management transaction, or an in-court path) with the pro forma cap table each would produce. You also frequently do creditor analysis: who holds the relevant tranches and how concentrated they are, because any consent-based solution depends on getting the necessary holders on board.</p>

<p><strong>Modeling.</strong> You build the standard three-statement model and value the business with comps and a DCF, because you need an EV to run any recovery analysis. The RX-specific work sits on top: the waterfall, recovery analysis sensitized across a range of EVs, the liquidity roll-forward, and pro forma capital structures for each proposed transaction. The mindset difference is the point: an M&amp;A model asks what the company is worth and what it can pay; an RX model asks, given a contested and uncertain value, how that value gets carved up among competing claims.</p>`,
  },
];
