export const PE_EXITS_SECTIONS = [
  {
    title: 'Exit Strategies',
    content: `<p>The exit is where PE firms convert years of operational improvement and Debt paydown into actual cash returns. The three primary exit channels:</p>

<h4>Strategic Sale</h4>

<p>Selling the portfolio company to another operating company (a "strategic buyer") in the same or a related industry. Strategic buyers typically pay the highest prices because they can realize synergies (cost savings, revenue enhancements) that a financial buyer cannot. These synergies justify paying a premium above what the company would be worth on a standalone basis.</p>

<p>Advantages: typically the highest valuations; clean exit (100% of the PE firm's position is sold); and strategic buyers can move quickly if the company fits their acquisition strategy. Disadvantages: limited universe of potential buyers (which can reduce competitive tension); the process may be disruptive to the management team and employees; and strategic buyers sometimes renegotiate or withdraw during diligence.</p>

<h4>Secondary Buyout (Sponsor-to-Sponsor Sale)</h4>

<p>Selling to another PE firm. This has become the most common exit route, accounting for roughly 40–50% of all PE exits. The new PE buyer brings fresh capital, a new value creation plan, and a different perspective on the company's potential.</p>

<p>Advantages: large pool of potential buyers (every PE firm is a potential acquirer); PE buyers can move quickly and are comfortable with leveraged structures; and the process is highly standardized. Disadvantages: PE buyers demand a return for themselves, so they typically pay less than strategic buyers; the market may perceive a secondary sale as a sign that the "easy" value has already been extracted; and leverage capacity may be limited if the company is already highly leveraged.</p>

<h4>Initial Public Offering (IPO)</h4>

<p>Taking the portfolio company public by listing its shares on a stock exchange. The PE firm sells a portion of its shares in the IPO and then sells the remainder over subsequent months or years (subject to lock-up periods, typically 90–180 days).</p>

<p>Advantages: IPOs can achieve the highest valuations if market conditions are favorable; the company gains access to public capital markets for future growth; and the PE firm can time its secondary sales to maximize proceeds. Disadvantages: IPO windows are unpredictable and can close suddenly (during market downturns, IPOs may be impossible); the PE firm's exit is not immediate (it may take 12–24 months to fully exit); the company takes on the cost and regulatory burden of being public (SOX compliance, quarterly reporting, SEC scrutiny); and IPOs require the company to have a strong growth story that appeals to public equity investors.</p>

<h4>Dividend Recapitalization</h4>

<p>Not technically an exit, but a partial liquidity event. The portfolio company takes on additional Debt and uses the proceeds to pay a dividend to the PE firm. This returns capital to the PE firm and LPs without selling the company. It's often used when the company has significantly deleveraged but market conditions aren't favorable for a full exit.</p>

<p>Advantages: returns capital to LPs (improving IRR), the PE firm retains ownership (continuing to benefit from future value creation), and it's entirely within the PE firm's control (no need for buyer negotiations or public market windows). Disadvantages: re-leverages the company (increasing financial risk), may be viewed negatively by lenders and credit rating agencies, and doesn't constitute a "realized" exit for fund performance purposes in some LP accounting frameworks.</p>`,
  },
  {
    title: 'Return Metrics',
    content: `<h4>MOIC (Multiple on Invested Capital)</h4>

<div class="formula-box">
MOIC = Total Value Received / Total Capital Invested<br>
Gross MOIC = before fees and carry<br>
Net MOIC = after management fees and carried interest
</div>

<p>MOIC measures the absolute magnitude of returns. A 3.0x MOIC means you tripled your money. MOIC is simple, intuitive, and impossible to manipulate. Its weakness: it ignores the time dimension. A 3.0x MOIC in 3 years is spectacular; a 3.0x MOIC in 10 years is mediocre.</p>

<h4>IRR (Internal Rate of Return)</h4>

<div class="formula-box">
IRR = the annualized rate of return that sets NPV of all cash flows to zero
</div>

<p>IRR incorporates the time value of money, making it the industry-standard return metric. A 25% net IRR is considered excellent; 15–20% is respectable; below 15% is disappointing for a buyout fund. IRR's weakness: it can be gamed through timing. A quick flip (buy and sell in 18 months at a 1.5x MOIC) produces a high IRR (~33%) but limited actual dollar profit. PE firms sometimes do quick deals early in a fund's life to boost the fund's IRR for fundraising purposes.</p>

<h4>DPI (Distributions to Paid-In Capital)</h4>

<div class="formula-box">
DPI = Total Distributions to LPs / Total Capital Called from LPs
</div>

<p>DPI measures how much actual cash has been returned to LPs relative to what they've contributed. A DPI of 1.0x means LPs have received back their entire investment; above 1.0x means they've received a profit. DPI is the most "real" metric because it counts only cash that LPs have actually received&mdash;unrealized gains (from portfolio companies still held) don't count. A fund with a high MOIC but low DPI hasn't yet returned much actual money.</p>

<h4>TVPI (Total Value to Paid-In Capital)</h4>

<div class="formula-box">
TVPI = (Total Distributions + Remaining Portfolio Value) / Total Capital Called
</div>

<p>TVPI includes both realized returns (distributions) and unrealized returns (the estimated value of investments still held). It's more comprehensive than DPI but less reliable because the "remaining portfolio value" is based on estimates (often using the most recent transaction multiple or comparable companies' multiples).</p>

<h4>The J-Curve</h4>

<p>In the early years of a fund, the return metrics appear deeply negative. Capital is being called for acquisitions and fees, but no exits have occurred yet, so DPI is near zero. Unrealized values may even be marked down initially because of transaction-related fees and write-downs. As the portfolio matures and exits begin, returns swing positive and grow rapidly. This pattern&mdash;negative early returns followed by strongly positive later returns&mdash;is called the "J-curve" because of the shape it produces when plotted over time.</p>`,
  },
  {
    title: 'Benchmarking and Quartile Performance',
    content: `<p>PE fund performance is typically benchmarked against peers of similar vintage year (the year the fund started investing), strategy (buyout vs. growth equity vs. venture), and geography. Funds are ranked into quartiles:</p>

<p><strong>Top Quartile (1st):</strong> The top 25% of funds. These consistently produce net IRRs above 20% and MOICs above 2.5x. Institutional LPs prioritize access to top-quartile managers.</p>

<p><strong>Second Quartile:</strong> Net IRRs of roughly 13–20% and MOICs of 1.8–2.5x. Solid performance that justifies the illiquidity premium over public markets.</p>

<p><strong>Third Quartile:</strong> Net IRRs of roughly 8–13% and MOICs of 1.3–1.8x. Mediocre performance that may not justify the fees, illiquidity, and complexity of PE investing.</p>

<p><strong>Bottom Quartile (4th):</strong> Net IRRs below 8% and MOICs below 1.3x. These funds have failed to deliver returns that justify the PE model. Some may produce losses (MOIC below 1.0x).</p>

<p>The persistent performance gap between top-quartile and bottom-quartile PE funds is wider than in most other asset classes. This "dispersion" is what makes manager selection (choosing which PE firms to invest in) the most critical decision for LPs.</p>`,
  },
];
