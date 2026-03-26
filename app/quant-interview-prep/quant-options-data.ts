// Quant Finance Mastery Manual — Module 5 (Stochastic Processes) + Module 6 (Derivatives/Greeks)
export const QUANT_OPTIONS_SECTIONS = [
  {
    title: '5.1–5.3 Why Stochastic Processes Matter, Brownian Motion, GBM',
    content: `<h3>5.1 Why Stochastic Processes Matter</h3>
<p>Asset prices evolve over time under uncertainty. Stochastic processes are the mathematical language for describing that evolution.</p>
<p><strong>They are central to:</strong> options pricing, interest rate modeling, volatility models, filtering and hidden states, continuous-time portfolio theory.</p>

<h3>5.2 Brownian Motion</h3>
<p><strong>What it is:</strong> Standard Brownian motion is a continuous-time stochastic process with: B(0)=0, independent increments, normally distributed increments, continuous paths.</p>
<p><strong>Why it matters:</strong> It is the fundamental building block in many continuous-time models.</p>
<p><strong>Intuition:</strong> It is an idealized continuous random walk.</p>

<h3>5.3 Geometric Brownian Motion (GBM)</h3>
<p><strong>Standard stock-price model form:</strong> dS_t = μ S_t dt + σ S_t dW_t</p>
<p><strong>Why it matters:</strong> GBM implies lognormal prices and is the foundation of Black-Scholes.</p>
<p><strong>Intuition:</strong> Price changes have a drift component and a random shock proportional to current price.</p>
<p><strong>Limitation:</strong> Real prices exhibit jumps, stochastic volatility, clustering, and heavy tails beyond GBM assumptions.</p>`,
  },
  {
    title: '5.4–5.6 Ito\'s Lemma, Risk-Neutral Measure, Markov Processes',
    content: `<h3>5.4 Ito's Lemma</h3>
<p><strong>Why it matters:</strong> Ito's Lemma is the stochastic calculus analog of the chain rule. It is essential for deriving option dynamics and pricing PDEs.</p>
<p><strong>Intuition:</strong> In stochastic systems, second-order terms matter because the random component has quadratic variation.</p>
<p><strong>Interview expectation:</strong> You may not need full derivations at every role, but you should understand what Ito's Lemma does and why it matters.</p>

<h3>5.5 Risk-Neutral Measure</h3>
<p><strong>Core idea:</strong> Under no-arbitrage and suitable assumptions, derivative pricing can be done using expected discounted payoffs under a risk-neutral probability measure.</p>
<p><strong>Intuition:</strong> The risk-neutral world is not the real world. It is a pricing device. In that world, expected asset growth is adjusted so discounted prices behave like martingales.</p>
<p><strong>Interview trap:</strong> Do not say risk-neutral probabilities are "true probabilities." They are pricing probabilities.</p>

<h3>5.6 Markov Processes</h3>
<p>A process is Markov if the future depends on the present state, not the full past history, given the current state.</p>
<p><strong>Why it matters:</strong> Markov structure simplifies pricing and dynamic programming.</p>`,
  },
  {
    title: '5.7–5.8 Mean-Reverting Processes, Jump Processes + Module 5 Practice',
    content: `<h3>5.7 Mean-Reverting Processes</h3>
<p><strong>Example: Ornstein-Uhlenbeck.</strong> Used conceptually in rates, spreads, and statistical arbitrage contexts.</p>
<p><strong>Why it matters:</strong> Some financial quantities revert toward a long-run level rather than drifting freely.</p>
<p><strong>Caveat:</strong> Mean reversion can weaken or disappear across regimes.</p>

<h3>5.8 Jump Processes</h3>
<p>Real markets do not move continuously all the time. Jumps matter around: earnings, macro releases, defaults, liquidity shocks.</p>
<p><strong>Why it matters:</strong> Pure diffusion models may understate tail risk and event risk.</p>

<h3>Module 5 Practice Drills</h3>
<p><strong>Technical drills:</strong> Explain Brownian motion in plain English. Explain why GBM leads to lognormal prices. Explain what Ito's Lemma does conceptually. Explain risk-neutral pricing without jargon. Explain why jumps matter in markets.</p>
<p><strong>Interview-style questions:</strong> What is the difference between real-world drift and risk-neutral drift? Why is Brownian motion useful but unrealistic? What does mean reversion imply for trading strategies?</p>`,
  },
  {
    title: '6.1–6.5 Why Derivatives Matter, Basic Types, No-Arbitrage, Put-Call Parity, Black-Scholes',
    content: `<h3>6.1 Why Derivatives Matter in Quant Finance</h3>
<p>Derivatives are central to many quant roles because they: embed nonlinear payoffs, require dynamic pricing and hedging, reveal market-implied expectations, connect directly to volatility and risk management.</p>

<h3>6.2 Basic Derivative Types</h3>
<p><strong>Forwards and futures:</strong> Contracts to buy or sell later at a pre-agreed price.</p>
<p><strong>Options:</strong> Rights, not obligations, to buy or sell at a strike. Calls, puts, European vs American, vanilla vs exotic.</p>
<p><strong>Swaps:</strong> Exchange of cash flow streams. Common in rates, credit, FX.</p>

<h3>6.3 No-Arbitrage Pricing Intuition</h3>
<p><strong>First-principles idea:</strong> If two portfolios have the same future payoff in all states, they must have the same price today, otherwise arbitrage would exist.</p>
<p><strong>Why it matters:</strong> This is the foundation of derivative pricing.</p>

<h3>6.4 Put-Call Parity</h3>
<p>For European options under standard assumptions: C - P = S - K e^{-rT}</p>
<p><strong>Why it matters:</strong> This is a core arbitrage identity and interview favorite.</p>
<p><strong>Intuition:</strong> A long call plus cash replicates a long put plus stock position.</p>

<h3>6.5 Black-Scholes Intuition</h3>
<p><strong>What the model does:</strong> Provides a closed-form price for European options under assumptions including: lognormal underlying price, constant volatility, constant rates, frictionless markets, no arbitrage, continuous hedging.</p>
<p><strong>Why it matters:</strong> It is a foundational model in quant finance. Even when unrealistic, it is the baseline language for implied vol and Greeks.</p>
<p><strong>What really drives option value:</strong> underlying price, strike, time to maturity, volatility, rates, dividends.</p>`,
  },
  {
    title: '6.6–6.7 Option Greeks, Volatility',
    content: `<h3>6.6 Option Greeks</h3>
<p><strong>Delta:</strong> Sensitivity to underlying price.</p>
<p><strong>Gamma:</strong> Sensitivity of delta to underlying price. Measures curvature.</p>
<p><strong>Vega:</strong> Sensitivity to volatility.</p>
<p><strong>Theta:</strong> Sensitivity to time decay.</p>
<p><strong>Rho:</strong> Sensitivity to interest rates.</p>
<p><strong>Why they matter:</strong> Greeks are central to: hedging, inventory management, scenario analysis, risk aggregation.</p>
<p><strong>Strong intuition:</strong> Delta is first-order exposure, gamma is convexity, vega is volatility exposure, theta is time decay.</p>

<h3>6.7 Volatility</h3>
<p><strong>Historical / realized volatility:</strong> Computed from past price moves.</p>
<p><strong>Implied volatility:</strong> Volatility input that makes a model price match market price.</p>
<p><strong>Why implied vol matters:</strong> It is often treated as the market's pricing language for options.</p>
<p><strong>Volatility smile / surface:</strong> Implied volatility varies by strike and maturity.</p>
<p><strong>Why this matters:</strong> The smile tells you Black-Scholes assumptions are not literally true in markets.</p>`,
  },
  {
    title: '6.8–6.10 Hedging, American vs European, Fixed Income Derivatives + Module 6 Practice',
    content: `<h3>6.8 Hedging Intuition</h3>
<p><strong>Delta hedging:</strong> Neutralizes first-order exposure to small price moves.</p>
<p><strong>Why hedging is imperfect:</strong> discrete, not continuous, rebalancing; transaction costs; jumps; model error; changing volatility.</p>
<p><strong>Interview nuance:</strong> Perfect hedging is a model idealization, not a practical reality.</p>

<h3>6.9 American vs European Options</h3>
<p>American options can be exercised early; European only at maturity.</p>
<p><strong>Why this matters:</strong> Early exercise affects pricing and requires different methods.</p>
<p><strong>Common intuition:</strong> An American call on a non-dividend-paying stock is usually not exercised early because you preserve optionality.</p>

<h3>6.10 Fixed Income Derivative Intuition</h3>
<p>Rates products require thinking in terms of: discount factors, forward rates, yield curves, duration and convexity, short-rate or forward-rate models.</p>
<p>Even if you are not a rates candidate, basic curve and duration intuition is valuable.</p>

<h3>Module 6 Practice Drills</h3>
<p><strong>Technical drills:</strong> Explain put-call parity. Explain why higher volatility increases option value. Explain delta and gamma in plain English. Explain implied vs realized volatility. Explain why perfect continuous hedging is unrealistic.</p>
<p><strong>Interview-style questions:</strong> What affects option prices? Why does time usually increase option value? What is the difference between intrinsic value and time value? What is a volatility smile and what does it imply?</p>`,
  },
];
