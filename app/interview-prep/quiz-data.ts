// Investment Banking Technical Practice Flashcards

export type QuizQuestion = {
  id: number;
  category: string;
  question: string;
  answer: string;
};

const parseQuestions = (block: string): string[] =>
  block
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => line.endsWith('?'))
    .map((line) => line.replace(/^\d+\.\s*/, ''));

const accountingQuestions = parseQuestions(`
Walk through the three core financial statements and explain the main purpose of each.
How do the three financial statements connect to each other in a fully integrated model?
If you could review only one financial statement to assess a business, which would you choose and why?
If allowed two financial statements, which combination would you select and how would you recreate the third?
A company records an additional 20 in depreciation. Walk through the impact on all three statements.
If depreciation increases by 15 and the tax rate is 25, how does this affect net income and cash flow?
Why does a non-cash expense like depreciation increase cash flow from operations?
Where can depreciation appear on the income statement, and why might presentation differ by company?
A 25 increase in accrued expenses is being recognized as an expense. Walk through the impact on the three statements.
Inventory rises by 30, paid in cash, and no inventory has yet been sold. What happens to each statement?
Why does a change in inventory not immediately affect the income statement?
A company issues 200 of new term debt to fund 200 of new PP&E. Show the impact at close on the three statements.
One year later, that 200 of PP&E is depreciated straight-line over 10 years; the debt pays 8% cash interest, with no principal amortization. Show the Year 1 impact.
In Year 3 the undepreciated PP&E is written down to zero and the remaining debt is repaid in full. How do the three statements change in that year?
A company purchases 40 of raw materials inventory that will be manufactured and sold later. Describe the timing of when costs appear on the income statement.
The company sells finished goods for 100 in revenue and 60 of cost that was previously inventory. Walk through the three statements.
Under what scenarios can shareholders' equity become negative? What does that signal?
Define working capital in a simple way and explain why it matters in valuation.
What does a consistently negative working capital position indicate about a business model?
What is operating working capital and why do bankers prefer it to total working capital in models?
A company records a 120 impairment on an intangible asset. How does this flow through the three statements?
Explain the difference between an impairment charge and regular depreciation or amortization.
How does a 150 equity injection from a new investor affect the three statements at closing?
A government injects 300 of equity into a distressed bank. Walk through the accounting.
A lender forgives 80 of outstanding debt principal. Describe the impact on the financial statements.
What is deferred tax, and how can it arise in a transaction or modeling context?
How do deferred tax liabilities typically get created on an acquisition balance sheet?
Why might a deferred tax asset be impaired following an acquisition?
A company changes its revenue recognition policy to earlier recognition. What are some likely effects on the statements over time?
Explain the difference between cash and accrual accounting, and why accrual is standard for corporate analysis.
Under what conditions would capitalizing an expenditure be more appropriate than expensing it?
Give examples of line items that are typically capitalized and amortized rather than expensed immediately.
What does an increase in other current assets often represent, and how would you treat it in a model?
How would you interpret a materially large goodwill balance on a company's balance sheet?
When might you see goodwill decrease over time without any obvious acquisition or divestiture activity?
Explain what retained earnings represent and list the main drivers of changes in this line item.
Why might a profitable company still show negative operating cash flow in a given period?
Why might a company with net losses still generate positive operating cash flow?
What is the difference between accounts payable and accrued expenses?
How does the choice of depreciation method (straight-line vs. accelerated) affect financial statements over the life of an asset?
Explain how stock-based compensation flows through the three financial statements.
A company issues 50 of new common shares at par to employees as compensation. How does this affect each statement?
How do you treat operating leases versus finance leases on the statements, and why does it matter in valuation?
What is the impact of increasing days sales outstanding (DSO) on cash flow and working capital?
If a company starts offering more generous payment terms to customers, what working capital changes would you expect?
How do you estimate maintenance capex versus growth capex from disclosures or limited data?
What might you infer if a company's capital expenditures are consistently below its depreciation expense?
How would you treat restructuring charges in your analysis of a company's normalized earnings power?
When might it be appropriate to adjust EBITDA for stock-based compensation in valuation work?
What are the implications if a company repeatedly records large one-time charges?
Explain the concept of minority interest and where it appears on the statements.
How do you adjust enterprise value for non-controlling interests, and why?
What is the difference between non-controlling interest and equity-method investments in another company?
Why is interest income often classified below operating income in an income statement?
How would capitalizing interest during construction of an asset affect the statements?
A company sells an asset for 70 that has a book value of 50. Walk through the three statements.
How would you detect aggressive revenue recognition practices using the three statements over multiple periods?
Why might you reclassify certain other income or other expense items when normalizing earnings?
Explain the difference between cash taxes paid and income tax expense on the income statement.
A company's effective tax rate diverges meaningfully from the statutory rate. What might cause that?
How does a share repurchase affect earnings per share and book value per share?
What are the accounting implications of a stock split versus a stock dividend?
A company issues convertible debt. How is it reflected on the balance sheet at issuance?
When would you apply the if-converted method versus the treasury stock method for EPS?
How do you estimate fully diluted shares outstanding from a capitalization table?
How would you reconcile net income to operating cash flow starting from the income statement?
Why might you adjust reported EBITDA for unusual or non-recurring items in a sell-side process?
Describe how changes in provisions or reserves (for example, litigation or warranty) affect the three statements.
What does a growing deferred revenue balance tell you about a company's business model?
How would you treat deferred revenue when estimating free cash flow?
A company reclassifies a portion of long-term debt as current. How does that impact your analysis?
How do you account for pension obligations and why are they important in valuation?
What are the key differences between IFRS and US GAAP that matter most for banking analysis?
A company capitalizes R&D while peers expense it. How would you adjust to make metrics comparable?
How would you adjust a company's financials to evaluate its performance excluding foreign exchange volatility?
Why does goodwill not amortize under US GAAP, and how is impairment tested conceptually?
What are the practical modeling implications of a company with large off-balance sheet guarantees?
How can you use the cash flow statement to evaluate the quality of a company's earnings?
Describe a situation where the cash flow statement looks strong but the business is actually deteriorating.
Describe a situation where the income statement looks weak but the underlying cash generation is attractive.
`);

const valuationQuestions = parseQuestions(`
List the main valuation methodologies used in investment banking and briefly define each.
In what situations would you favor a DCF over a multiples-based valuation and vice versa?
Why is an intrinsic valuation often more sensitive to assumptions than a trading comparables analysis?
When screening for trading comparables, what are the typical quantitative and qualitative filters you apply?
How do you decide which multiples are most relevant for a particular industry? Give examples.
Why might EV/EBITDA be preferred to EV/EBIT for some sectors and the opposite for others?
Explain why equity value-based multiples (like P/E) and enterprise value-based multiples capture different things.
What adjustments do you make to enterprise value to arrive at an adjusted firm value suitable for multiples?
How do you value a company with negative EBITDA using market-based methods?
What are some pitfalls of relying on headline P/E ratios when comparing companies?
How would you normalize earnings for a cyclical business before applying trading multiples?
Why might you exclude certain outlier companies when constructing a trading comps set?
How do you calendarize financials to ensure consistency across companies with different fiscal year-ends?
Explain the logic behind using forward, rather than trailing, multiples in some sectors.
What are the advantages and disadvantages of precedent transaction analysis versus trading comparables?
How do you select relevant precedent transactions for valuing a target in a sale process?
Why do precedent transactions often imply higher valuation multiples than trading comparables?
How would you adjust a precedent transaction multiple from a different interest rate environment to today's environment?
What is a control premium, and how would you estimate an appropriate range for it?
Walk through a simple DCF from revenue to valuation output.
What are the key drivers of free cash flow in a standard corporate DCF?
Why is the free cash flow to firm (unlevered) approach common in banking DCF work?
How would your approach differ if you chose to run a free cash flow to equity DCF?
Define the formula for unlevered free cash flow starting from EBIT.
How do you project working capital in a DCF when you have limited detail?
What is WACC conceptually, and why is it used as the discount rate in an unlevered DCF?
Walk through the calculation of WACC and the main inputs required.
Explain how to estimate the cost of equity using CAPM and the intuition behind each term.
How do you estimate beta for a private company using public comparables?
Explain why you unlever and then relever beta when estimating cost of equity.
How would an increase in the marginal tax rate affect WACC and valuation, all else equal?
How does a higher leverage ratio affect cost of equity and WACC?
Why might you add a size premium or industry premium to the cost of equity?
When constructing a DCF, how many years of explicit projections are typically used and why?
Under what conditions might an extended forecast period (beyond 10 years) be justified?
Describe the two main approaches to estimating terminal value.
When would you favor a perpetuity growth terminal value versus an exit multiple approach?
How do you choose an appropriate long-term growth rate in a Gordon Growth terminal value?
Why should a terminal growth rate not exceed the long-term nominal GDP growth of the economy?
How do you choose an appropriate exit multiple range for a terminal value based on trading comps?
What are some indicators that your DCF output is overly dependent on the terminal value?
If more than 80% of your valuation comes from terminal value, how might you adjust your approach?
How would a 1 percentage point change in WACC typically affect valuation relative to a 1 point change in long-term growth?
How would you build a sensitivity table to show the impact of WACC and exit multiples on equity value per share?
Why do analysts often sanity-check DCF results with multiple alternative approaches?
Describe how you would value a bank differently from a traditional industrial company.
Why is a dividend discount model or residual income model more suitable for valuing financial institutions?
Which valuation multiples are most informative for banks and why?
How do you value an insurance company, and which metrics do you focus on?
How would you value an early-stage, high-growth technology company with minimal earnings?
How would you value a company that has volatile historical cash flows and is highly cyclical?
How do you incorporate net operating losses into a valuation?
Explain how Section 382 limitations affect the use of NOLs after an acquisition.
How do you value a portfolio of discrete assets (e.g., oil reserves, real estate properties) using a NAV framework?
Describe a sum-of-the-parts valuation and when it is most applicable.
How would you value a diversified conglomerate with unrelated business units?
How do you approximate a floor value for a company from an LBO perspective?
How might an LBO analysis help a strategic buyer decide its maximum bid in an auction?
Walk through a basic IPO valuation framework for a company about to list shares publicly.
What are the key steps to estimate an IPO price range using trading comps?
How do you assess whether a company left money on the table in its IPO pricing?
Why might a company prefer a direct listing to a traditional IPO, and how does that affect valuation discussions?
How does a SPAC transaction change the way investors think about valuation versus a traditional IPO?
Why might valuation multiples for SPAC deals differ from traditional IPO or M&A transactions?
When running trading comps, how do you handle companies with negative net income but positive EBITDA?
How do you adjust valuation metrics for capital structure differences across comparable companies?
Under what circumstances would you consider EV/Revenue to be a primary valuation multiple?
Why might EV/FCF be a stronger valuation anchor than EV/EBITDA for some businesses?
How would you value a company that is expected to experience a structural margin shift in the forecast period?
How do you reconcile large discrepancies between DCF valuation and market-implied valuation?
Why might two bankers arrive at meaningfully different valuations for the same company using similar methods?
How do changes in the risk-free rate affect both DCF valuation and multiples?
How would you value a company operating in a hyperinflationary economy?
Explain the rationale for using enterprise value rather than equity value in most trading multiples.
When is it appropriate to use equity value multiples in comparative valuation?
How do capital structure changes (e.g., recapitalization) affect your choice of valuation metrics over time?
How do you treat capitalized operating leases when computing enterprise value and EBITDA multiples?
Why might you exclude discontinued operations from valuation metrics?
How do you approach valuation for a business currently in restructuring or Chapter 11?
How do you estimate a justified P/E multiple from fundamentals such as growth and ROE?
How would you value a company whose primary asset is a long-term contract with fixed cash flows?
How do you incorporate scenario analysis (upside/base/downside) into a DCF framework?
What is the logic behind using mid-year discounting in a DCF, and when do you apply it?
How do you estimate terminal value for a commodity producer whose earnings depend on volatile prices?
What are the most common errors junior analysts make when building DCFs?
Why is it important to cross-check implied trading multiples from a DCF with market comps?
How would you adjust valuation for a company with significant environmental or regulatory liabilities not fully reflected on the balance sheet?
How would you value a minority stake in a private company as opposed to a control stake?
How do you estimate an appropriate discount for lack of marketability in valuing a private business?
How would you use a future share price analysis as a cross-check for your valuation work?
`);

const maQuestions = parseQuestions(`
Explain the main strategic reasons a corporate buyer might pursue an acquisition.
How does a financial buyer's acquisition rationale differ from a strategic buyer's?
Define accretion and dilution in the context of an acquisition.
What are the key drivers that determine whether a deal is accretive or dilutive to EPS?
Why might a buyer proceed with a slightly dilutive deal anyway?
Walk through the high-level steps of building a basic merger model.
How do you estimate synergies in an M&A transaction, and what types exist?
Why are synergy estimates often scrutinized or discounted by investors?
How would you incorporate cost synergies into an income statement in a merger model?
How do revenue synergies typically flow through to EBITDA and EPS in a model?
What is the difference between a stock-for-stock deal and a cash deal, and how do each affect the buyer's balance sheet?
How does the mix of cash versus stock consideration affect accretion/dilution?
Why might a buyer be reluctant to use stock as consideration even when it appears cheap?
Explain the difference between a stock purchase, asset purchase, and 338(h)(10)-type election conceptually.
How do tax step-ups (or lack thereof) influence the buyer's preference for a stock vs asset structure?
Why might a seller prefer a stock sale while a buyer prefers an asset sale?
How do you compute the purchase price in an acquisition, including equity value, net debt, and assumed items?
What is a tender offer and how does it differ from a negotiated merger agreement?
How do you incorporate target options and other equity awards into a merger model?
Why do we often use the treasury stock method when accounting for options in an M&A context?
How do you compute pro forma ownership in a stock-based acquisition?
Walk through how you allocate purchase price to tangible and intangible assets in a purchase price allocation.
How is goodwill created in an acquisition, and why is it considered a residual?
Under what circumstances might goodwill decrease after a deal closes?
What is the role of identifiable intangibles (e.g., customer lists, brand) in purchase price allocation?
How do you estimate amortization for acquired intangibles, and how does it impact EPS?
How do you treat transaction expenses versus financing fees in a merger model?
Why are one-time transaction costs typically expensed immediately, while financing fees are capitalized?
How do you model the new debt and associated interest expense in an acquisition financed partially with leverage?
How do you model cash interest versus PIK interest for acquisition financing?
What are the key credit metrics you would examine for a buyer post-transaction?
How would you assess whether a combined company's leverage is sustainable following a deal?
How do you reflect anticipated cost savings that require upfront restructuring charges?
How would you build a merger model if the target is significantly larger than the acquirer?
How does minority interest impact a merger model when the buyer already owns a partial stake in the target?
Explain how you would treat an earn-out in an acquisition model.
What factors influence the premium a buyer is willing to pay in an all-cash acquisition?
How does the cost of cash compare to the cost of stock and cost of debt from the buyer's perspective?
What are common closing conditions that can derail an announced transaction?
How does regulatory risk (antitrust, sector regulators) influence how you position valuation and structure?
Why might hostile deals often carry higher headline premiums than friendly deals?
How do you estimate a reasonable break fee and reverse break fee in a merger agreement?
What is the role of a fairness opinion in an M&A transaction?
Why might a board rely on multiple valuation methodologies before approving a deal?
How do you build an MA premiums analysis, and what does it show?
How can a premiums analysis be used to guide negotiation range in a sale process?
What is a stub-period in merger modeling, and how do you handle it?
How do you handle different accounting policies between buyer and target in the combined model?
How do you incorporate differences in tax rates between buyer and target in EPS accretion analysis?
Under what conditions might an acquisition be value-destructive even if it is EPS accretive?
Why do markets sometimes react negatively to accretive deals and positively to dilutive deals?
How do you evaluate the impact of an acquisition on a buyer's ROIC or ROE?
How would you test whether the price paid for synergies is justified in an acquisition?
What is merger-of-equals (MOE) and how does it differ from a traditional acquisition in modeling and negotiations?
How might you structure governance in an MOE to address concerns around control?
What are some typical defensive strategies a target can use to resist a hostile bid?
How would you analyze whether a target is vulnerable to activism or unsolicited offers?
Explain the concept of a carve-out or spin-off and why a company might pursue it.
How would you model the separation of a business segment into a stand-alone entity?
What are the typical valuation and structural considerations in a joint venture deal?
How does a partial stake sale (e.g., 30% of a division) affect the parent's financials and valuation?
How do you incorporate cross-border tax and FX considerations in cross-border M&A modeling?
How would higher interest rates affect M&A volumes and valuation levels across the market?
Why might a company prefer to use its equity as acquisition currency in a high-valuation environment?
How does the availability of cheap debt financing influence competitive dynamics in auctions?
How do you assess whether a proposed acquisition will improve or dilute a company's credit rating?
How would you evaluate a potential bolt-on acquisition for a private equity portfolio company?
How do you analyze the impact of divesting a non-core business on a company's growth and margin profile?
Explain the difference between horizontal, vertical, and conglomerate M&A strategies.
How do anti-trust regulators typically evaluate horizontal mergers?
What is the Herfindahl-Hirschman Index (HHI) conceptually and how does it relate to merger review?
How do you reflect integration risk in your analysis of a large transformational acquisition?
Describe a practical way to test downside scenarios for a leveraged acquisition.
How would you stress test synergy assumptions in a merger model?
Why is cultural fit often critical in determining whether merger synergies are realized?
What are the key qualitative factors you would discuss in an investment committee memo for a proposed deal?
How does a dual-track process combining IPO and sale options affect negotiations with bidders?
How might a sell-side banker use competitive tension strategically to increase the final sale price?
What is a go-shop provision and when might it be used?
Explain the role of stapled financing in an auction and who benefits from it.
How does management's alignment (or misalignment) with the seller's shareholders affect the process?
How do you think about management rollover equity in a sponsor-led buyout of a public company?
Explain how you would structure a contingent value right (CVR) in a life-sciences acquisition.
How would you analyze a stock-for-stock merger between two companies with volatile share prices?
What is collar protection in a stock deal and how does it work conceptually?
How do you account for potential antitrust-mandated divestitures in a merger model?
How might activist investors influence M&A outcomes for both buyers and sellers?
How do you weigh short-term EPS accretion against long-term strategic value in an M&A recommendation?
What are the main steps in preparing a sell-side management presentation for a potential transaction?
How would you organize a buyer universe and outreach strategy for a sponsor-backed portfolio company sale?
`);

const lboQuestions = parseQuestions(`
Walk through the key steps of building a basic LBO model.
Why does using leverage amplify equity returns in a buyout?
What are the core assumptions you must specify to begin an LBO model?
How do you construct the sources and uses table in an LBO?
What are typical sources of capital in a leveraged buyout?
What are typical uses of funds in an LBO transaction?
How does the private equity firm's equity check influence potential IRR outcomes?
What are the main types of debt instruments used in leveraged buyouts and how do they differ?
Explain the difference between revolver, term loan A, and term loan B in terms of structure.
How do senior secured term loans differ from high-yield bonds in an LBO capital structure?
What is the difference between maintenance covenants and incurrence covenants?
How might covenant packages influence the sponsor's flexibility post-closing?
Why might a PE sponsor opt for more expensive high-yield debt rather than cheaper bank debt?
What is PIK interest and why would a sponsor agree to use PIK instruments?
How do you model PIK interest in the income statement and cash flow statement?
Why is cash flow generation more important than accounting earnings in LBO analysis?
What is the typical investment horizon for a financial sponsor, and how does it affect modeling assumptions?
How do you estimate a reasonable exit multiple range in an LBO?
Why might an exit multiple differ from the entry multiple in your LBO scenarios?
How would you compute the sponsor's IRR and money-on-money multiple in an LBO model?
How do you estimate debt capacity (maximum leverage) a target can support in an LBO?
Which credit metrics do lenders focus on most in evaluating an LBO financing package?
What is a dividend recap and why might a sponsor pursue one?
How does a dividend recap affect the company's balance sheet and sponsor returns?
What are the risks associated with dividend recapitalizations for lenders and sponsors?
How would you model optional vs mandatory debt amortization in an LBO?
When does the revolver get drawn in an LBO model, and how is it repaid?
How do you set up a cash sweep (excess cash used to repay debt) in an LBO model?
How does the tax shield from interest expense affect LBO returns?
Why might a sponsor be comfortable with higher leverage in a very stable, regulated sector?
How does an LBO set a floor under a company's valuation in a sale process?
Why do financial sponsors typically value a target differently from strategic buyers?
How would you analyze the attractiveness of a potential bolt-on acquisition for an existing portfolio company?
What characteristics make a business an ideal LBO candidate?
What attributes would make a business challenging for a leveraged buyout?
Explain the difference between primary buyout, secondary buyout, and tertiary buyout.
What is a club deal in private equity and why might sponsors form one?
How can a sponsor create value in a portfolio company beyond financial engineering?
How do you think about operational value creation levers in an LBO (pricing, costs, mix, etc.)?
Why might a sponsor accept a lower IRR for a very large equity check in a marquee transaction?
How do you incorporate management rollover equity in an LBO model?
How do you structure an equity incentive pool for management in a buyout?
How does an option pool or management sweet equity affect sponsor returns?
When would a sponsor consider taking a portfolio company public rather than selling it outright?
How does an IPO exit differ economically and practically from a strategic sale exit for a sponsor?
How would you model a partial exit (e.g., sponsor sells half its stake in an IPO) in an LBO?
How would you approach an LBO of a cyclical business differently from a defensive one?
How do changes in interest rates affect LBO feasibility and returns?
How would a significant economic downturn shortly after closing affect the LBO case?
Describe stress-testing techniques you would apply to an LBO model.
Why is entry valuation often the single most important driver of LBO returns?
How do you compare two LBO opportunities with different IRRs and different money-on-money multiples?
How might a long-hold, lower-IRR deal still be attractive to certain limited partners?
How does fund-level leverage differ from deal-level leverage in private equity?
What is a continuation fund and why have they become more common in private equity?
How do you evaluate concentration risk in a private equity fund's portfolio?
How might ESG or sustainability considerations enter into an LBO investment committee discussion?
How can cov-lite structures impact lender and sponsor behavior during a downturn?
How do you incorporate potential covenant breaches into your downside LBO case analysis?
What key components would you include in a one-page investment memo for an LBO opportunity?
How would you compare an LBO of a fast-growing tech company versus a stable cash-generation utility?
What are the main legal and documentation steps in closing an LBO financing package?
How do bridge loans function in the context of buyout financing?
In practice, how do relationship banks and term loan B / CLO investors play different roles in an LBO?
How would a sponsor decide on the optimal amount of PIK instruments versus cash-pay debt?
When does it make sense for a sponsor to prepay debt even if rates are low?
How would you think about refinancing risk in an LBO with significant bullet maturities?
How do changes in leverage over the hold period affect the sponsor's exit options?
Why might lenders require amortization on certain tranches but not others in the capital structure?
Explain how mezzanine debt differs from high-yield bonds in an LBO structure.
How would you calculate the IRR for mezzanine investors, including PIK and warrants, in a deal?
How might a sponsor use preferred equity in the capital structure of an LBO?
Why might a seller agree to provide vendor financing in a sponsor-led buyout?
How do seller notes affect the sponsor's returns and risk profile?
How can a sponsor use portfolio company add-on acquisitions to improve exit multiple and value?
How would you incorporate synergy-like cost savings from add-on acquisitions into the LBO model?
What are the typical exit options for a sponsor and how do they differ in terms of valuation and timing?
How do you handle transaction-related NWC unwinds in the first year of an LBO model?
What are the main reasons an LBO might fail to meet its targeted returns?
If debt investors achieve a higher IRR than equity investors in an LBO, what does that tell you about deal performance?
`);

const capitalMarketsQuestions = parseQuestions(`
What are the main functions of an equity capital markets (ECM) team within an investment bank?
What are the main functions of a debt capital markets (DCM) team?
How would you explain the difference between the primary and secondary markets to a client?
What is a best-efforts underwriting and how does it differ from a firm-commitment underwriting?
Explain how a traditional bookbuilt IPO process works from mandate to pricing.
What is a Dutch auction IPO and how is pricing determined in that format?
How does a direct listing differ from a traditional IPO in terms of process and economics?
What is a SPAC and why did they become more prominent in recent years?
Explain the economics for SPAC sponsors and how they earn their return.
What are the main pros and cons of going public via SPAC merger versus traditional IPO?
What is a private placement and when might a company prefer it to a public equity raise?
Explain the concept of PIPE financing in the context of a public company raising capital.
What is a shelf registration and how does it benefit frequent issuers?
Explain what a rights offering is and why a company might choose this structure.
What is a follow-on offering and how does it differ from an IPO?
How does a convertible bond combine features of debt and equity, and why might an issuer choose it?
What is a greenshoe (over-allotment) option in an equity offering, and how is it used?
How would a syndicate decide whether to exercise the greenshoe option in an IPO?
What are the main factors that impact IPO valuation and initial pricing range?
Why are some IPOs criticized for leaving substantial money on the table?
What is the VIX index and what does it represent for market participants?
Why is VIX sometimes called the fear gauge of the equity market?
What is the difference between the NYSE and NASDAQ in terms of listing and market structure?
Explain the concept of a yield curve and what information it conveys.
What does an inverted yield curve typically signal about economic expectations?
Describe what is meant by a steepening versus flattening yield curve.
How can changes in the yield curve shape affect bank profitability?
What tools does the Federal Reserve have to influence short-term interest rates?
Explain open market operations and how they influence liquidity.
What is quantitative easing and why might a central bank implement it?
What is the federal funds rate and why is it so closely watched by markets?
How does the discount rate differ from the federal funds rate?
What are reserve requirements and how do changes in them affect lending?
What is a repurchase agreement (repo), and why is it important in money markets?
Explain the difference between a repo and a reverse repo.
How might negative interest rates affect investor behavior and asset prices?
What does CPI measure and why is it relevant for monetary policy?
Why can deflation be more concerning than moderate inflation for policymakers?
How did ultra-low interest rates influence equity market valuations in the period after 2020?
Why did large technology companies disproportionately drive equity index performance in recent years?
How did the dot-com bubble environment differ from the post-2020 low-rate environment for equities?
What is the difference between monetary and fiscal policy, and how do both affect markets?
How did quantitative easing programs impact credit spreads and risk appetite?
Why might equity markets rise even during periods of weak economic data?
How do changes in the 10-year Treasury yield impact equity valuations and sector rotations?
Why are investors concerned about the timing and pace of central bank balance sheet normalization?
What is a liquidity trap and how does it limit the effectiveness of monetary policy?
Describe how inflation expectations influence real yields and valuation frameworks.
How do higher discount rates affect long-duration growth equities versus value stocks?
What are the typical asset allocation responses when risk sentiment deteriorates sharply?
What is the role of hedge funds versus mutual funds in capital markets?
How do long-only funds differ from long/short equity funds in mandate and risk profile?
Explain event-driven investing and give examples of situations that might attract such funds.
What is activist investing and how can it influence corporate strategy?
What is merger arbitrage and how do investors seek to profit from it?
Explain convertible arbitrage at a high level.
Describe the difference between momentum investing and mean-reversion strategies.
How do quantitative (systematic) strategies differ from discretionary human-driven strategies?
What is gross exposure and net exposure in a hedge fund, and why do they matter?
What is maximum drawdown and how is it interpreted by investors?
Define beta and alpha in the context of portfolio returns.
What is meant by enhanced beta versus pure alpha strategies?
How do global macro hedge funds typically express their macroeconomic views in markets?
What is the role of derivatives (options, futures, swaps) in capital markets and risk management?
How can rising credit spreads signal stress in financial markets even if equity indices are near highs?
What factors would you monitor daily to stay informed on market conditions before an interview?
How would you articulate a near-term and long-term view on equity markets to a senior banker?
What are some current macro risks that could materially change the rate and equity outlook?
How do geopolitics and regulatory shifts create sector-specific opportunities and risks?
How would you explain to a client why market indices can diverge from real-economy data in the short run?
`);

const behavioralQuestions = parseQuestions(`
Walk me through your story and how it led you to pursue investment banking.
Why are you specifically interested in investment banking rather than sales & trading or asset management?
Why are you interested in this particular bank compared with others you are interviewing with?
What do you think analysts at this firm do on a typical day and night?
Tell me about a time you worked under significant time pressure and how you handled it.
Describe a situation where you took initiative on a project without being asked.
Tell me about a time you received critical feedback and how you responded.
Describe the most challenging team project you've worked on and your role in it.
Tell me about a time you dealt with a difficult team member and what you did.
Give an example of when you had to sacrifice your personal plans for a work or academic obligation.
Tell me about a time you failed at something significant and what you learned.
What is the biggest mistake you have made in a professional or academic setting?
Describe a time you successfully resolved a conflict within a group.
Tell me about a situation where you had an unmanageable workload. How did you prioritize?
Give an example of when you had to quickly learn a complex topic to deliver on a project.
Tell me about an instance when you had to deliver high-quality work despite limited guidance.
Describe a time when a project did not go as planned and how you adapted.
Tell me about a time you led a team without an official leadership title.
Describe a time when you motivated a group to accomplish a difficult goal.
Tell me about an example where attention to detail made a material difference in your work.
Give an example of when you identified a risk or error before it became a problem.
Describe a time when you had to explain a complex concept to someone with less technical background.
Tell me about a time you had to make a decision with incomplete information.
Why do you think you can handle the lifestyle and hours associated with investment banking?
How have your past experiences prepared you specifically for the analyst role?
What has been your most meaningful leadership experience and why?
Tell me about a time you worked with people from very different backgrounds or perspectives.
Describe a project where you had to use quantitative analysis to support a recommendation.
Tell me about a time you went above and beyond what was expected.
What has been the toughest piece of feedback you've received and how did you change afterward?
Tell me about a time you had to persuade someone senior to see things your way.
Describe a time when you had to deliver bad news to a teammate or stakeholder.
Tell me about a time you disagreed with a teammate's approach and how you handled it.
Describe a time you had to manage multiple stakeholders with competing priorities.
Tell me about a time when integrity was tested in a professional or academic context.
How would your previous manager or professor describe your strengths and weaknesses?
What motivates you personally, especially during periods of intense workload?
How have you demonstrated resilience in your academic or professional life?
Tell me about an instance where you had to deliver a project with ambiguous instructions.
Describe a time where you handled a high-pressure situation with a tight deadline.
How do you respond when someone more senior than you is clearly wrong about something important?
What is the most recent significant book or article you've read and what did you take away from it?
Outside of finance, what do you like to do for fun?
How do you typically spend your weekends during a busy semester or work period?
Tell me something about you that is not on your resume.
How did you first become interested in finance and deal-making?
Why did you choose your major and how does it relate to investment banking?
Why should we hire you over other highly qualified candidates from target schools?
What do you know about the recent deal activity in our group's coverage universe?
Pick a recent M&A transaction and walk me through the strategic rationale.
Choose a company you follow; how would you value it and what is your investment thesis?
Pitch me a stock in 2-3 minutes, focusing on key drivers and valuation.
Tell me about a time you changed your mind after seeing new information.
Describe a situation where you worked with someone who did not pull their weight.
How would you respond if you made a mistake in a client deliverable that was just sent out?
How would you handle noticing a minor mistake during a live client meeting?
What would you do if you discovered a close colleague was sharing confidential information?
Tell me about a time you managed to balance multiple major commitments at once.
How do you organize and prioritize tasks when everything seems urgent?
What do you find most appealing about working in a deal team environment?
What do you think will be the hardest adjustment for you coming into banking?
How do you handle situations where instructions change late in the process?
Describe a time you had to quickly pick up a new technical skill (Excel, coding, modeling, etc.).
Tell me about a time you helped someone else succeed on a project.
How would you respond if a senior banker harshly criticized your work in front of the team?
What do you hope to gain from your first two years in investment banking?
Where do you see your career in five to ten years, and how does banking fit into that path?
How would you explain what an investment banker does to someone with no finance background?
What recent macro or market event have you found most interesting, and why?
If the market opens sharply down tomorrow, how would that affect the conversations you'd expect on the desk?
What do you think differentiates a top analyst from an average one?
Tell me about a time you had to work with incomplete or messy data.
How do you ensure accuracy in your work when you're exhausted?
Describe a time you made a quick judgment call and later had to revise it.
How would you handle being staffed on three live deals at once with conflicting deliverables?
What personal systems or habits do you use to manage stress?
Tell me about a situation where you had to adapt your communication style for a particular audience.
Describe a time you analyzed a business or industry outside of coursework.
How do you stay current on markets and finance news on a daily basis?
What do you think is the biggest macro risk for banks over the next few years?
If you were CEO of a Fortune 500 company today, what capital allocation decision would you prioritize?
How would you react if you were not staffed on the marquee deal everyone wants to be on?
Tell me about a time you dealt with an ambiguous goal from a supervisor.
How would you respond if you differ from your team on the right recommendation to a client?
Describe your ideal mentor in banking and what you would seek to learn from them.
What concerns do you have about investment banking, and how have you thought about them?
What questions do you have for me about the role, team, or firm?
If you do not receive an offer from us, what will you do next?
How do you think your background will add diversity of thought to our analyst class?
At the end of a long week, what would make you feel it was a successful week on the desk?
`);

const answerForQuestion = (question: string, section: string): string => {
  const q = question.toLowerCase();

  if (section === 'Behavioral & Fit (Q411-Q500)') {
    return 'Use a concise STAR structure: situation and task in one sentence each, 2-3 specific actions you took, measurable result, and one lesson tied directly to analyst success (ownership, precision, teamwork, and stamina).';
  }

  if (q.includes('three financial statements')) {
    return 'Income statement shows period profitability, cash flow statement reconciles profit to cash movement, and balance sheet is a point-in-time position. In models, net income and cash linkage tie all three through retained earnings and ending cash.';
  }
  if (q.includes('depreciation')) {
    return 'Depreciation lowers EBIT and taxes, reducing net income by the after-tax amount, then is added back on CFO because it is non-cash; the net cash benefit is the tax shield.';
  }
  if (q.includes('working capital')) {
    return 'Working capital is operating current assets minus operating current liabilities and tracks cash tied up in operations; increases are usually a cash use, decreases are a cash source.';
  }
  if (q.includes('goodwill')) {
    return 'Goodwill is the residual purchase premium over fair value of identifiable net assets in an acquisition and is tested for impairment rather than amortized under US GAAP.';
  }
  if (q.includes('deferred tax')) {
    return 'Deferred taxes arise from temporary book-tax timing differences; DTLs come from future taxable amounts and DTAs from future deductible amounts, subject to valuation allowance if realization is uncertain.';
  }
  if (q.includes('enterprise value') || q.includes('ev/')) {
    return 'Use enterprise value for capital-structure-neutral comparisons because EV captures value to all capital providers; normalize for cash, debt-like items, non-controlling interests, and lease effects where relevant.';
  }
  if (q.includes('dcf') || q.includes('wacc') || q.includes('terminal value')) {
    return 'Project unlevered free cash flow, discount at WACC, estimate terminal value with perpetuity growth and/or exit multiple, discount to present, and bridge EV to equity value with net debt and other claims.';
  }
  if (q.includes('accret') || q.includes('dilut')) {
    return 'Accretion/dilution depends on target earnings contribution plus synergies versus financing costs, share issuance, and purchase accounting effects; accretive EPS is not automatically value-creating.';
  }
  if (q.includes('synerg')) {
    return 'Separate cost and revenue synergies, probability-weight realization timing, include one-time implementation costs, and stress-test execution risk and dis-synergies.';
  }
  if (q.includes('lbo') || q.includes('irr') || q.includes('moic') || q.includes('leverage')) {
    return 'In LBOs, returns are driven by entry price, leverage, cash generation and deleveraging, EBITDA growth, and exit multiple. Build downside cases for revenue, margin, rates, and refinancing risk.';
  }
  if (q.includes('ipo') || q.includes('spac') || q.includes('ecm') || q.includes('dcm')) {
    return 'Frame capital markets answers around issuer objectives, investor demand, execution certainty, dilution/cost of capital, and aftermarket performance under current volatility and rate conditions.';
  }
  if (q.includes('yield curve') || q.includes('fed') || q.includes('inflation') || q.includes('vix') || q.includes('macro')) {
    return 'Explain first-order macro transmission (rates, discounting, spreads, liquidity), then second-order effects by sector and positioning. Tie view to near-term catalyst and risk case.';
  }

  return 'Give a structured answer: define the concept, explain mechanics step-by-step, link to valuation or risk impact, then add one practical caveat an interviewer would care about.';
};

const toCards = (questions: string[], section: string): QuizQuestion[] =>
  questions.map((question) => ({ question, answer: answerForQuestion(question, section) }));

const withIds = (
  cards: QuizQuestion[],
  startId: number,
  category: string
): QuizQuestion[] => cards.map((card, idx) => ({ id: startId + idx, category, ...card }));

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  ...withIds(toCards(accountingQuestions, 'Accounting & Financial Statements (Q1-Q80)'), 1, 'Accounting & Financial Statements'),
  ...withIds(toCards(valuationQuestions, 'Valuation & DCF (Q81-Q170)'), 81, 'Valuation & DCF'),
  ...withIds(toCards(maQuestions, 'M&A Concepts & Merger Models (Q171-Q260)'), 171, 'M&A Concepts & Merger Models'),
  ...withIds(toCards(lboQuestions, 'LBO & Financial Sponsors (Q261-Q340)'), 261, 'LBO & Financial Sponsors'),
  ...withIds(toCards(capitalMarketsQuestions, 'Capital Markets & Macro (Q341-Q410)'), 341, 'Capital Markets & Macro'),
  ...withIds(toCards(behavioralQuestions, 'Behavioral & Fit (Q411-Q500)'), 411, 'Behavioral & Fit - IB Focused'),
];
