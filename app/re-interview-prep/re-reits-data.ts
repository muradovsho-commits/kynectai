export const RE_REITS_SECTIONS = [
  {
    title: 'What a REIT Is and the Rules',
    content: `<p>A real estate investment trust is a company that owns (and sometimes operates or finances) income-producing real estate, structured to avoid corporate income tax by passing income through to shareholders. REITs are how public markets access real estate, and they make property investable as a liquid, traded security. The structure exists because of a specific tax bargain, and the rules of that bargain shape everything about how REITs behave.</p>

<div class="framework-box"><div class="fw-label">THE REIT BARGAIN (KEY RULES)</div><strong>Distribute at least 90 percent of taxable income</strong> to shareholders as dividends. In exchange, the REIT pays little or no corporate tax, avoiding the double taxation that hits normal corporations.<br/><strong>Hold mostly real estate:</strong> at least 75 percent of assets in real estate, cash, and government securities.<br/><strong>Earn mostly real estate income:</strong> at least 75 percent of gross income from rents, mortgage interest, or property sales.<br/><strong>Be widely held:</strong> ownership spread among many shareholders (no excessive concentration).</div>

<div class="key-concept"><strong>The 90 percent distribution requirement is the defining feature, and it drives REIT behavior.</strong> Because REITs must pay out almost all taxable income, they retain little cash to fund growth, so they rely on external capital, issuing equity and debt, to acquire and develop. This makes REITs highly sensitive to capital markets: when their cost of capital is low (high stock price, cheap debt), they can grow accretively; when it is high, growth stalls. It also makes REITs income vehicles, valued heavily on their dividend and its growth, and it is why REIT investors care so much about the durability of the payout. The tax advantage comes with a structural dependence on the capital markets.</div>

<p>REITs come in types: <strong>equity REITs</strong> own properties and earn rent (the large majority), <strong>mortgage REITs</strong> own real estate debt and earn interest, and a few hybrids do both. Within equity REITs, most specialize by sector (apartments, industrial, retail, office, data centers, towers, healthcare, self-storage), so a REIT is effectively a pure-play, professionally managed portfolio of one property type.</p>`,
  },
  {
    title: 'FFO and AFFO: The Right Earnings Metric',
    content: `<p>Net income is misleading for a REIT, because GAAP requires large non-cash depreciation charges on real estate, which depress reported earnings even though well-maintained property does not actually lose value the way the depreciation schedule implies. So the industry uses funds from operations instead, and you must know it cold.</p>

<div class="formula-box">FFO = Net Income + Real Estate Depreciation &amp; Amortization - Gains on Property Sales<br/><br/>AFFO = FFO - Recurring Capex - Straight-Line Rent Adjustments (and similar)</div>

<p><strong>FFO (funds from operations)</strong> adds back real estate depreciation and amortization to net income (because it is a non-cash charge that understates a property company's true earning power) and removes one-time gains on property sales (to isolate recurring operating performance). The NAREIT definition of FFO is the industry standard. <strong>AFFO (adjusted funds from operations)</strong> goes further, subtracting the recurring capital expenditures and leasing costs needed to maintain the portfolio, plus normalizing items like straight-line rent, to approximate the true cash available to pay dividends.</p>

<div class="key-concept"><strong>FFO is the headline earnings metric; AFFO is the better measure of dividend-paying capacity.</strong> FFO corrects the depreciation distortion and is what REITs report and guide to, the equivalent of EPS for a property company. AFFO is more conservative and more useful for judging the dividend, because it accounts for the real, recurring capital a portfolio consumes to keep earning. The <strong>AFFO payout ratio</strong> (dividend divided by AFFO) tells you how covered the dividend is: a ratio comfortably below 100 percent means the payout is sustainable with room to grow; a ratio near or above 100 percent flags a dividend at risk. When you analyze a REIT, FFO is the earnings number, AFFO is the cash-flow-and-dividend number.</div>

<div class="pro-tip">"Why do you add back depreciation for a REIT?" is a near-guaranteed question. The answer: real estate depreciation is a large non-cash GAAP charge that assumes buildings lose value on a fixed schedule, but well-located, well-maintained property tends to hold or grow in value, so net income badly understates a REIT's true earning power. FFO adds depreciation back to show the recurring cash earnings the properties actually produce.</div>`,
  },
  {
    title: 'Valuing a REIT: NAV and FFO Multiples',
    content: `<p>REITs are valued two complementary ways: by what the underlying properties are worth (net asset value) and by a multiple of their earnings (FFO multiple). Holding both in mind, and understanding when they diverge, is the core of REIT analysis.</p>

<table class="comparison-table">
<tr><th>Method</th><th>How it works</th><th>What it tells you</th></tr>
<tr><td>Net asset value (NAV)</td><td>Value the portfolio's NOI at market cap rates, add other assets, subtract net debt; divide by shares</td><td>The private-market value of the assets per share</td></tr>
<tr><td>Premium / discount to NAV</td><td>Compare share price to NAV per share</td><td>Whether the market values the company above or below its assets</td></tr>
<tr><td>FFO / AFFO multiple</td><td>Share price divided by per-share FFO or AFFO (like a P/E)</td><td>How the market prices the earnings stream and its growth</td></tr>
<tr><td>Dividend yield</td><td>Dividend per share divided by price</td><td>The income return; central given the payout requirement</td></tr>
<tr><td>Implied cap rate</td><td>The cap rate the market price implies on the portfolio's NOI</td><td>How public pricing compares to private-market cap rates</td></tr>
</table>

<div class="key-concept"><strong>NAV vs the FFO multiple, and the premium/discount, is where REIT analysis gets interesting.</strong> NAV asks what the buildings are worth if sold privately; the FFO multiple asks what the market will pay for the earnings and growth. The two can diverge, and the gap is information. A REIT trading at a <strong>premium to NAV</strong> (price above asset value) signals the market expects growth, values the management, or prices the assets at tighter cap rates than the private market, and it can issue equity accretively to grow. A REIT at a <strong>discount to NAV</strong> signals skepticism, a high cost of equity, and difficulty growing, and it may become an acquisition or activist target, since a buyer could in theory acquire the assets cheaply through the stock. The <strong>implied cap rate</strong> formalizes this: if the public market implies a 7 percent cap on a portfolio that trades privately at 5.5 percent, the stock is cheap relative to the underlying real estate, and vice versa. Reconciling public pricing (FFO multiple, implied cap) with private value (NAV, market cap rates) is the analytical heart of investing in REITs.</div>

<div class="pro-tip">A favorite question: "a REIT trades at a discount to NAV, what does that mean and what might happen?" Strong answer: the market values the company below the private worth of its assets, implying a high cost of equity, growth skepticism, or a cheaper public cap rate than the private market. Consequences: the REIT cannot issue equity accretively, may sell assets or buy back stock to close the gap, and could attract activists or an acquirer who sees the assets as cheap. Tie it back to the capital-markets dependence the 90 percent payout creates.</div>`,
  },
  {
    title: 'How REITs Grow and the Rates Lens',
    content: `<p>Because the payout rule leaves little retained cash, REIT growth comes from specific, capital-markets-dependent levers, and the macro rate environment sits on top of all of it.</p>

<ul>
<li><strong>Same-store NOI growth:</strong> raising rents and occupancy and controlling costs across the existing portfolio, the organic engine.</li>
<li><strong>Accretive acquisitions:</strong> buying assets that yield more than the REIT's cost of capital, which works only when the cost of capital is low enough.</li>
<li><strong>Development:</strong> building to a yield on cost above market cap rates, capturing the development spread.</li>
<li><strong>External capital:</strong> issuing equity (accretive only when the stock is strong) and debt to fund the above.</li>
</ul>

<div class="key-concept"><strong>Interest rates dominate REIT performance through two channels.</strong> First, valuation: REITs are income vehicles, so when rates rise, their dividend yields must compete with higher bond yields, pressuring prices, and the cap rates on their properties tend to rise, lowering asset values; both push REIT prices down. Second, growth: higher rates raise the cost of the external capital REITs depend on, making accretive acquisitions and development harder and slowing growth. This dual sensitivity is why REITs often trade like long-duration, rate-sensitive securities, sometimes moving more on the rates outlook than on property fundamentals. A REIT analyst therefore always carries a macro view, because the rates lens can swamp the bottoms-up story in the short run.</div>

<div class="pro-tip">REIT research and REIB interviews probe both the bottoms-up (FFO growth, NAV, the sector's supply-demand) and the top-down (rates, cost of capital, the premium/discount). A complete answer on "would you buy this REIT" reconciles the two: the fundamental and NAV case, then the rates and capital-markets overlay that determines whether the market will reward it.</div>`,
  },
];
