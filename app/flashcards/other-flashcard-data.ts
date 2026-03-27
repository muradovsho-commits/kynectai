import { Flashcard } from './ib-flashcard-data';

// ── SALES & TRADING ──
export const ST_FLASHCARDS: Flashcard[] = [
  { q: "What is the bid-ask spread?", a: "Difference between highest buy price (bid) and lowest sell price (ask). Compensates market makers for inventory risk and adverse selection.", category: "Markets" },
  { q: "Market order vs limit order?", a: "Market order: executes immediately, pays spread. Limit order: posts liquidity, may earn spread but faces fill uncertainty and adverse selection.", category: "Markets" },
  { q: "What is adverse selection?", a: "Risk that informed traders trade against you when your quote is stale. Market makers must manage this constantly.", category: "Markets" },
  { q: "What is VWAP?", a: "Volume-Weighted Average Price — benchmark for execution quality. Calculated as sum(price × volume) / total volume over a period.", category: "Markets" },
  { q: "What is a carry trade?", a: "Borrowing in low-yield currency/asset and investing in higher-yield one. Profitable if rates stay stable but exposed to reversals.", category: "Markets" },
  { q: "What is convexity in bonds?", a: "Second-order price sensitivity to rate changes. Positive convexity means price rises more for rate decreases than it falls for rate increases.", category: "Fixed Income" },
  { q: "What is duration?", a: "Measure of bond's price sensitivity to interest rate changes. Longer duration = more sensitivity.", category: "Fixed Income" },
  { q: "What is a yield curve?", a: "Plot of yields across maturities. Normal = upward sloping. Inverted = short rates > long rates, historically signals recession risk.", category: "Fixed Income" },
  { q: "What is credit spread?", a: "Yield difference between a corporate bond and a risk-free benchmark of same maturity. Compensates for default risk, liquidity, etc.", category: "Fixed Income" },
  { q: "What is repo?", a: "Repurchase agreement — short-term borrowing collateralized by securities. Fundamental to fixed income funding and leverage.", category: "Fixed Income" },
  { q: "If you had $1M to invest right now, what would you do?", a: "State a macro view, asset allocation rationale, specific ideas with risk/reward. Show you think about sizing, horizon, and what's priced in.", category: "Trade Ideas" },
  { q: "Pitch me a trade.", a: "Structure: thesis → instrument → entry/target/stop → risk management → catalyst/timeline. Be specific and acknowledge what could go wrong.", category: "Trade Ideas" },
  { q: "What is gamma hedging?", a: "Adjusting delta hedges to account for the curvature (gamma) of the option position. Needed because delta changes as underlying moves.", category: "Options" },
  { q: "What is a straddle?", a: "Long call + long put at same strike. Profits from large moves in either direction. You're buying volatility.", category: "Options" },
  { q: "What is theta decay?", a: "Options lose time value as expiry approaches. Theta decay accelerates for ATM options near expiry. Short options benefit from this.", category: "Options" },
  { q: "Why sales and trading?", a: "Fast-paced, markets-focused, immediate feedback on decisions, combine analytical skills with market intuition and risk management.", category: "Behavioral" },
  { q: "How do you handle a losing trade?", a: "Re-evaluate thesis vs price action. If thesis is broken, cut the loss. If thesis holds and risk is manageable, may hold. Never average into denial.", category: "Behavioral" },
  { q: "What macro theme are you following?", a: "Pick something current (rates, inflation, geopolitics). Show depth — not just the headline, but the transmission mechanism and positioning implications.", category: "Behavioral" },
];

// ── EQUITY RESEARCH ──
export const ER_FLASHCARDS: Flashcard[] = [
  { q: "What does a sell-side equity research analyst do?", a: "Covers a set of public companies: writes research reports, builds financial models, makes buy/sell/hold recommendations, and advises institutional clients.", category: "Role" },
  { q: "What is an earnings model?", a: "A detailed financial model projecting a company's income statement, often quarterly, to estimate EPS and compare to consensus.", category: "Modeling" },
  { q: "What is consensus estimate?", a: "The average of sell-side analyst estimates for a metric (usually EPS). Earnings surprises vs consensus drive stock reactions.", category: "Modeling" },
  { q: "What is a price target?", a: "An analyst's estimate of where a stock should trade, based on their model and valuation. Usually 12-month forward.", category: "Modeling" },
  { q: "How do you pick a stock to cover?", a: "Choose a company you genuinely follow. Know the business model, recent results, competitive dynamics, key drivers, and current consensus view.", category: "Stock Pitch" },
  { q: "What makes a good initiation report?", a: "Thesis, business overview, industry analysis, financial model, valuation, key risks, catalysts, and clear recommendation with price target.", category: "Stock Pitch" },
  { q: "Revenue build for a SaaS company?", a: "Subscribers × ARPU, adjusted for churn and expansion. Track net dollar retention, new logo growth, and pricing changes.", category: "Modeling" },
  { q: "Revenue build for a retailer?", a: "Stores × sales per store, or same-store-sales growth + new store openings. Decompose into traffic and ticket/basket size.", category: "Modeling" },
  { q: "What is EPS and why does it matter?", a: "Earnings Per Share = Net Income / Diluted Shares. The most closely tracked earnings metric. Beats/misses vs consensus drive short-term stock moves.", category: "Modeling" },
  { q: "What is a sum-of-the-parts (SOTP) valuation?", a: "Value each business segment separately using appropriate multiples/methods, then sum. Useful for conglomerates or diversified companies.", category: "Valuation" },
  { q: "What is the difference between buy-side and sell-side research?", a: "Sell-side publishes research for external clients (institutional investors). Buy-side does internal research to make actual investment decisions.", category: "Role" },
  { q: "Why equity research?", a: "Deep company/industry expertise, combining fundamental analysis with market judgment, writing and communication, and influencing institutional investors.", category: "Behavioral" },
  { q: "How do you stay on top of your coverage universe?", a: "Earnings calls, SEC filings, industry data, competitor commentary, management meetings, channel checks, and daily news flow.", category: "Behavioral" },
  { q: "Tell me about a stock you follow.", a: "Know: business model, revenue drivers, margins, competitive position, recent results vs consensus, your variant view, valuation, and risks.", category: "Behavioral" },
];

// ── REAL ESTATE ──
export const RE_FLASHCARDS: Flashcard[] = [
  { q: "What is NOI?", a: "Net Operating Income = Revenue - Operating Expenses (excluding debt service, CapEx, taxes). The core cash flow metric for real estate.", category: "Fundamentals" },
  { q: "What is a cap rate?", a: "Capitalization Rate = NOI / Property Value. Measures yield on a property. Lower cap rate = higher price relative to income.", category: "Fundamentals" },
  { q: "What is the relationship between cap rates and property value?", a: "Inversely related. If cap rates rise (due to higher rates/risk), property values fall. Value = NOI / Cap Rate.", category: "Fundamentals" },
  { q: "What is a pro forma?", a: "A projected financial model for a real estate investment showing revenue, expenses, NOI, debt service, returns, and exit assumptions.", category: "Modeling" },
  { q: "What is a waterfall structure?", a: "Distributes cash flows between GP and LPs in tiers: first preferred return to LPs, then catch-up to GP, then profit split (e.g., 80/20).", category: "Fund Economics" },
  { q: "What is a preferred return?", a: "Minimum return LPs receive before GP earns promote/carry. Typically 8%. Ensures GP is rewarded only for meaningful performance.", category: "Fund Economics" },
  { q: "What is IRR in real estate?", a: "Annualized return accounting for timing of all cash flows: acquisition cost, operating cash flows, capital events, and sale proceeds.", category: "Returns" },
  { q: "What is cash-on-cash return?", a: "Annual pre-tax cash flow / total cash invested. A simple yield metric that doesn't account for appreciation or debt paydown.", category: "Returns" },
  { q: "What is an equity multiple?", a: "Total distributions / total equity invested. A 2.0x equity multiple means you doubled your money over the hold period.", category: "Returns" },
  { q: "What is LTV?", a: "Loan-to-Value = Loan Amount / Property Value. Measures leverage. Higher LTV = more leverage = more risk and potential return.", category: "Debt" },
  { q: "What is DSCR?", a: "Debt Service Coverage Ratio = NOI / Debt Service. Measures ability to cover debt payments. Lenders typically require >1.2x.", category: "Debt" },
  { q: "Core vs Value-Add vs Opportunistic?", a: "Core: stabilized, low risk, low return (6-8%). Value-Add: improvement potential (12-18%). Opportunistic: development, distressed, ground-up (18%+).", category: "Strategy" },
  { q: "What is FFO?", a: "Funds From Operations = Net Income + D&A - Gains on Sales. The standard REIT earnings metric since RE depreciation overstates expense.", category: "REITs" },
  { q: "What is AFFO?", a: "Adjusted FFO = FFO - maintenance CapEx - straight-line rent adjustments. Better proxy for sustainable cash flow than FFO.", category: "REITs" },
  { q: "Why real estate?", a: "Tangible assets, inflation protection, income generation, leverage opportunities, and the intersection of finance, operations, and market dynamics.", category: "Behavioral" },
];

// ── VENTURE CAPITAL ──
export const VC_FLASHCARDS: Flashcard[] = [
  { q: "What is venture capital?", a: "Investing in early-stage, high-growth companies in exchange for equity. High risk of failure offset by potential for outsized returns on winners.", category: "Fundamentals" },
  { q: "What is a term sheet?", a: "Non-binding document outlining key investment terms: valuation, amount, liquidation preferences, board seats, anti-dilution, and protective provisions.", category: "Deal Terms" },
  { q: "What is pre-money vs post-money valuation?", a: "Pre-money = company value before investment. Post-money = pre-money + investment amount. Your ownership = investment / post-money.", category: "Deal Terms" },
  { q: "What is a liquidation preference?", a: "Investor gets their money back (1x) before common shareholders in a sale. 1x non-participating is standard; participating or >1x is more aggressive.", category: "Deal Terms" },
  { q: "What is anti-dilution protection?", a: "Protects investors if future rounds are at lower valuations (down rounds). Full ratchet (harsh) or weighted average (more common).", category: "Deal Terms" },
  { q: "What is TAM / SAM / SOM?", a: "Total Addressable Market / Serviceable Addressable Market / Serviceable Obtainable Market. Narrows from theoretical max to realistic capture.", category: "Market Sizing" },
  { q: "What is product-market fit?", a: "When a product satisfies strong market demand. Signs: organic growth, high retention, word-of-mouth, customers pulling the product from you.", category: "Evaluation" },
  { q: "What is net dollar retention (NDR)?", a: "Revenue from existing customers this year / revenue from same customers last year. >100% means expansion exceeds churn. >120% is excellent.", category: "SaaS Metrics" },
  { q: "What is CAC and LTV?", a: "Customer Acquisition Cost and Lifetime Value. LTV/CAC > 3x is generally healthy. Payback period matters too.", category: "SaaS Metrics" },
  { q: "What is MRR/ARR?", a: "Monthly/Annual Recurring Revenue. The core top-line metric for subscription businesses. Growth rate and quality (expansion vs new) matter.", category: "SaaS Metrics" },
  { q: "What is a cap table?", a: "Capitalization table showing ownership percentages, share classes, option pools, and how each round diluted earlier investors.", category: "Fundamentals" },
  { q: "What is a convertible note?", a: "Debt that converts to equity at the next priced round, usually at a discount and/or with a valuation cap. Common in seed rounds.", category: "Deal Terms" },
  { q: "What is a SAFE?", a: "Simple Agreement for Future Equity — like a convertible note but not debt (no interest, no maturity). Standard Y Combinator instrument.", category: "Deal Terms" },
  { q: "What makes a great VC investment?", a: "Massive market, exceptional founders, product-market fit, strong unit economics, defensibility (network effects, switching costs), and reasonable valuation.", category: "Evaluation" },
  { q: "What is the power law in VC?", a: "Most returns come from a tiny number of investments. One company may return the entire fund. This shapes portfolio construction and risk tolerance.", category: "Fund Economics" },
  { q: "Why venture capital?", a: "Passion for innovation, evaluating founders and markets, long time horizon, building conviction on emerging trends, and helping companies scale.", category: "Behavioral" },
];

// ── RESTRUCTURING ──
export const RX_FLASHCARDS: Flashcard[] = [
  { q: "What is restructuring?", a: "The process of reorganizing a company's financial structure, operations, or capital when it faces financial distress or needs strategic transformation.", category: "Fundamentals" },
  { q: "What is Chapter 11 bankruptcy?", a: "US bankruptcy process allowing a company to reorganize while continuing operations. The debtor usually remains in possession. Ends with a plan of reorganization.", category: "Bankruptcy" },
  { q: "What is Chapter 7 bankruptcy?", a: "Liquidation — the company ceases operations and assets are sold to repay creditors in order of priority.", category: "Bankruptcy" },
  { q: "What is the absolute priority rule?", a: "In bankruptcy, claims are paid in order: secured → administrative → unsecured → subordinated → preferred equity → common equity. Each class must be fully paid before the next.", category: "Bankruptcy" },
  { q: "What is a fulcrum security?", a: "The security in the capital structure where value breaks — i.e., the class that is partially impaired. Senior to it gets full recovery; junior gets nothing.", category: "Valuation" },
  { q: "How do you find the fulcrum security?", a: "Estimate enterprise value, then work down the capital structure: secured debt → unsecured → sub debt → equity. Where EV runs out is the fulcrum.", category: "Valuation" },
  { q: "What is a DIP loan?", a: "Debtor-in-Possession financing — new debt provided during Chapter 11 with super-priority status. Allows the company to operate while restructuring.", category: "Bankruptcy" },
  { q: "What is a cramdown?", a: "When a court confirms a reorganization plan over the objection of a dissenting class, provided the plan is fair and equitable.", category: "Bankruptcy" },
  { q: "What is a 363 sale?", a: "Sale of assets under Section 363 of the bankruptcy code, often through an auction. Buyer gets assets free of liens and encumbrances.", category: "Bankruptcy" },
  { q: "What is a pre-pack bankruptcy?", a: "A pre-negotiated reorganization plan agreed upon by key creditors before filing, allowing for faster emergence from Chapter 11.", category: "Bankruptcy" },
  { q: "What is a liquidity analysis?", a: "Projects cash inflows/outflows over 13 weeks (or longer) to determine if/when the company runs out of cash. Critical for distressed situations.", category: "Analysis" },
  { q: "What is a recovery analysis?", a: "Estimates what each class of creditors would receive under different scenarios (reorganization vs liquidation). Drives negotiation dynamics.", category: "Analysis" },
  { q: "What is enterprise value in a distressed context?", a: "Total value available to distribute to claimants. Often estimated using distressed comps, asset liquidation values, or a going-concern DCF.", category: "Valuation" },
  { q: "What are covenants and why do they trigger restructurings?", a: "Debt agreement restrictions (leverage ratios, coverage tests). Covenant violations can trigger defaults, accelerate debt, and force restructuring.", category: "Fundamentals" },
  { q: "What is an out-of-court restructuring?", a: "Negotiated agreement between company and creditors to modify debt terms without filing for bankruptcy. Faster and cheaper but requires creditor consensus.", category: "Fundamentals" },
  { q: "What is a rights offering?", a: "Post-emergence equity offering to creditors/new investors. Often used to raise capital as part of the reorganization plan.", category: "Bankruptcy" },
  { q: "Why restructuring?", a: "Intellectually demanding, complex capital structures, high stakes, combines legal/financial/operational analysis, and directly impacts company survival.", category: "Behavioral" },
  { q: "What makes someone good at restructuring?", a: "Comfort with ambiguity, attention to detail in complex capital structures, negotiation skills, ability to work under pressure, and cross-functional thinking.", category: "Behavioral" },
];
