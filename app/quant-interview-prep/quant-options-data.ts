export const QUANT_OPTIONS_SECTIONS = [
  {
    title: `1. Call and Put Option Fundamentals`,
    content: `<p>If you are applying to an Options Market Maker (like Citadel Securities, SIG, or Optiver), you need to know options math with absolute fluency. Derivatives trading is the most mathematically intense subset of finance.</p>
<br/>
<p><strong>A Call Option</strong> gives the holder the right (but not the obligation) to BUY the underlying asset at a specific 'Strike Price' ($K$) on or before an 'Expiration Date' ($T$).</p>
<p><em>Payoff at expiration:</em> $Max(0, S_T - K)$, where $S_T$ is the stock price at expiration.</p>
<br/>
<p><strong>A Put Option</strong> gives the holder the right to SELL the underlying asset at the Strike Price.</p>
<p><em>Payoff at expiration:</em> $Max(0, K - S_T)$</p>
<br/>
<p><strong>Intrinsic vs. Extrinsic Value:</strong></p>
<p>• <strong>Intrinsic Value:</strong> The value of the option if it expired exactly right now. (e.g., A $100 Strike Call on a stock trading at $105 has $5 of intrinsic value).</p>
<p>• <strong>Extrinsic (Time) Value:</strong> The premium paid above intrinsic value. It prices the <em>possibility</em> that the stock moves further into the money before expiration. At expiration, Time Value decays to zero.</p>`
  },
  {
    title: `2. Put-Call Parity (The Arbitrage Law)`,
    content: `<p>Put-Call parity is the fundamental law of European options pricing. It proves that a persistent arbitrage opportunity cannot exist between calls, puts, and the underlying stock without market makers destroying it instantly.</p>
<br/>
<p><strong>The Formula:</strong><br/>
$C - P = S - K \\cdot e^{-rT}$</p>
<p>Where:<br/>
$C$ = Call Price<br/>
$P$ = Put Price<br/>
$S$ = Spot Price of the Stock<br/>
$K$ = Strike Price<br/>
$r$ = Risk-free interest rate<br/>
$T$ = Time to expiration</p>
<br/>
<p><strong>Interview Application: Synthetic Positions & Arbitrage</strong><br/>
Ignoring interest rates for a moment, $C - P = S - K$. By moving the variables algebraically, you can create "synthetic" positions.<br/>
For example, $S = C - P + K$. This means buying 100 shares of stock is mathematically identical to buying a Call, selling a Put (at the same strike), and holding cash equal to the Strike price. <br/>
If the market misprices one of these legs (e.g., the Call is being heavily speculated on by retail traders and becomes overpriced), a quant algorithm will "sell the synthetic stock" by selling the Call and buying the Put, while simultaneously buying the actual underlying stock, locking in a risk-free arbitrage profit.</p>`
  },
  {
    title: `3. The First-Order Greeks (Delta & Vega)`,
    content: `<p>The Black-Scholes model outputs a single theoretical price, but traders focus almost entirely on "The Greeks"—the partial derivatives of the option price with respect to various market inputs.</p>
<br/>
<p><strong>Delta ($\\Delta = \\frac{\\partial V}{\\partial S}$): Directional Exposure</strong><br/>
Measures how much the option price changes for a $1 change in the underlying stock. <br/>
• A Deep "In-The-Money" Call acts like holding stock, with a Delta approaching +1.0.<br/>
• An "At-The-Money" Call is effectively a coin-flip, with a Delta of $\\approx$ +0.50.<br/>
• A Put option has a negative Delta (from 0 to -1.0) because its value increases as the stock falls.</p>
<br/>
<p><strong>Vega ($\\nu = \\frac{\\partial V}{\\partial \\sigma}$): Variance Exposure</strong><br/>
Measures how much the option price changes for a 1% increase in Implied Volatility ($\\sigma$). Options are essentially insurance policies against volatility. When markets crash and panic ensues, volatility spikes, and <em>all</em> option premiums (both calls and puts) skyrocket because Vega is strictly positive for all long option positions.</p>`
  },
  {
    title: `4. The Second-Order Greeks (Gamma & Theta)`,
    content: `<p>While Delta tells you your exposure right now, your exposure will change the second the stock ticks. Second-order greeks measure that acceleration.</p>
<br/>
<p><strong>Gamma ($\\Gamma = \\frac{\\partial \\Delta}{\\partial S} = \\frac{\\partial^2 V}{\\partial S^2}$): The Acceleration Greek</strong><br/>
Gamma is the second-order derivative—it measures the rate of change of <em>Delta</em>. It is highest for At-The-Money options with short expirations. If you are "Long Gamma" (you bought options), violent market swings help you because your Delta dynamically self-hedges in your favor. If you are "Short Gamma" (you sold options), violent moves will violently expand your losses.</p>
<br/>
<p><strong>Theta ($\\Theta = \\frac{\\partial V}{\\partial t}$): Time Decay</strong><br/>
Measures how much value the option loses per day due to the literal passage of time. Theta is inherently negative for option buyers because every day that passes brings the option closer to expiration, leaving less time for a favorable move. Market makers frequently short options to collect positive Theta (earning "Theta decay" as rent).</p>`
  },
  {
    title: `5. Delta Hedging Mechanics`,
    content: `<p>Options market makers (like Optiver) do not gamble on whether a stock goes up or down. They make their money strictly off the bid/ask spread and "Delta Hedge" their books to remain fundamentally neutral to the underlying stock price.</p>
<br/>
<p><strong>Example of Delta Hedging:</strong><br/>
Retail investors flood the market buying 1,000 Call Options on Tesla from you (the market maker). Assume the ATM Delta is 0.50. You are now short the calls, meaning your portfolio is "Short 500 Deltas" ($1000 \\times 0.50 \\times -1$). If Tesla stock goes up $1, you will lose a massive amount of money. <br/>
To neutralize this risk, you immediately enter the underlying equity market and BUY 50,000 shares of actual Tesla stock (Option contract multiplier = 100 shares. 500 Deltas $\\times$ 100). Now your net position is Delta = 0. You are immunized against small stock movements.</p>
<br/>
<p><strong>The Trap of Gamma:</strong><br/>
Because you sold the options, you are Short Gamma. As Tesla stock rises, the Delta of the calls you sold increases from 0.50 to 0.60. You are now short 600 Deltas, but only own 500 equivalent shares! You must constantly adjust your hedge by buying MORE stock at higher prices, and selling it at lower prices, to stay Delta-neutral. This constant hedging bleed costs money, which is why you charged the customer a massive Implied Volatility premium upfront.</p>`
  },
  {
    title: `6. Black-Scholes & Stochastic Calculus (Basics)`,
    content: `<p>For advanced Quantitative Research roles, you will be expected to understand the stochastic calculus that derives the Black-Scholes model.</p>
<br/>
<p><strong>Geometric Brownian Motion (GBM):</strong><br/>
Stock prices are modeled as following a continuous-time stochastic process:<br/>
$dS = \\mu S dt + \\sigma S dW$<br/>
Where $dS$ is the change in stock price, $\\mu$ is the drift (expected return), $dt$ is the deterministic time step, $\\sigma$ is the volatility, and $dW$ is a Wiener process (Standard Brownian Motion representing random noise).</p>
<br/>
<p><strong>Ito's Lemma:</strong><br/>
Ito's Lemma is the stochastic equivalent of the chain rule in standard calculus. Because the Wiener process $dW$ accumulates variance at a rate of $t$ (not $t^2$), we cannot ignore second-derivative terms in Taylor expansions. <br/>
$df(S, t) = \\frac{\\partial f}{\\partial t} dt + \\frac{\\partial f}{\\partial S} dS + \\frac{1}{2} \\frac{\\partial^2 f}{\\partial S^2} (dS)^2$<br/>
Plugging GBM into Ito's Lemma and constructing a risk-free portfolio (by Delta hedging perfectly) leads directly to the Black-Scholes Partial Differential Equation (PDE).</p>`
  }
];
