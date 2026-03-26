// Quant Finance Mastery Manual — Modules 7-12
export const QUANT_CODING_SECTIONS = [
  {
    title: '7.1–7.5 Time Series: Returns, Autocorrelation, Mean Reversion vs Momentum, Volatility Clustering',
    content: `<h3>7.1 Why Time Series Matters</h3>
<p>Quant finance often studies sequences over time: returns, volume, volatility, spreads, order flow, macro variables. The challenge is that financial time series are noisy, adaptive, and non-stationary.</p>

<h3>7.2 Return Construction</h3>
<p><strong>Arithmetic return:</strong> Simple percent change.</p>
<p><strong>Log return:</strong> Additive over time and convenient analytically.</p>
<p><strong>Why this matters:</strong> Choice of return definition affects aggregation and modeling.</p>

<h3>7.3 Autocorrelation and Serial Dependence</h3>
<p><strong>What it means:</strong> Past values help predict future values, at least partially.</p>
<p><strong>Why it matters:</strong> momentum, reversal, microstructure effects, volatility persistence.</p>

<h3>7.4 Mean Reversion vs Momentum</h3>
<p><strong>Mean reversion:</strong> Prices or spreads tend to move back toward a reference level.</p>
<p><strong>Momentum:</strong> Recent trends continue for some period.</p>
<p><strong>Key insight:</strong> Both can exist at different horizons and in different markets.</p>

<h3>7.5 Volatility Clustering</h3>
<p>Periods of high volatility tend to cluster, as do calm periods.</p>
<p><strong>Why it matters:</strong> Risk is state-dependent. Assuming constant variance is often wrong.</p>`,
  },
  {
    title: '7.6–7.10 ARMA/GARCH, Factor Signals, Alpha Research, Feature Engineering, Alpha Decay',
    content: `<h3>7.6 AR, MA, ARMA, ARIMA Concepts</h3>
<p>These are classical time-series tools for modeling dependence structures. Even when not used directly in production, they teach important ideas about persistence, differencing, and forecast structure.</p>

<h3>7.7 GARCH Intuition</h3>
<p>Models time-varying conditional volatility.</p>
<p><strong>Why it matters:</strong> Volatility is not constant. Recent shocks can affect future risk.</p>
<p><strong>Caveat:</strong> Useful as a framework, but not the final word in real markets.</p>

<h3>7.8 Factor Signals and Alpha Research</h3>
<p><strong>Common signal categories:</strong> value, momentum, carry, quality, seasonality, mean reversion, microstructure imbalance, event-driven signals.</p>
<p><strong>Research process:</strong> hypothesize economic or behavioral rationale, define signal precisely, clean data carefully, test in-sample and out-of-sample, evaluate turnover, capacity, costs, and stability, monitor decay and crowding.</p>

<h3>7.9 Feature Engineering and Regime Awareness</h3>
<p>Signals often behave differently across regimes.</p>
<p><strong>Regime examples:</strong> high-vol vs low-vol, crisis vs calm, tightening vs easing cycles, trend vs range-bound markets.</p>
<p><strong>Strong candidate behavior:</strong> Mention regime dependence whenever discussing predictive signals.</p>

<h3>7.10 Why Alpha Decays</h3>
<p>A signal may weaken because: it was noise, competitors found it, market structure changed, costs rose, crowding increased, the original economic mechanism disappeared.</p>

<h3>Module 7 Practice Drills</h3>
<p><strong>Technical drills:</strong> Explain momentum vs mean reversion. Explain volatility clustering. Explain why a signal can have a strong backtest and fail live. Explain regime dependence in plain English.</p>
<p><strong>Interview-style questions:</strong> How would you test a mean-reversion signal? What is look-ahead bias? How would you know if a signal is overfit?</p>`,
  },
  {
    title: '8.1–8.8 Portfolio Theory, Mean-Variance, Risk Decomposition, Factor Models, VaR, Kelly, Leverage',
    content: `<h3>8.1 Why Portfolio Theory Matters</h3>
<p>Even the best signal is not enough. You still need to size positions, diversify exposures, and control risk.</p>

<h3>8.2 Mean-Variance Optimization</h3>
<p><strong>Core idea:</strong> Choose portfolio weights to balance expected return and risk.</p>
<p><strong>Why it matters:</strong> It is foundational to modern portfolio theory.</p>
<p><strong>Why it can fail in practice:</strong> Expected returns are hard to estimate, covariance matrices are noisy, and unconstrained optimization can produce unstable weights.</p>

<h3>8.3 Risk Decomposition</h3>
<p>You should understand risk at multiple levels: position risk, factor risk, sector risk, liquidity risk, correlation risk, tail risk.</p>
<p><strong>Important idea:</strong> Risk is not just volatility. It includes concentration, leverage, drawdown, and fragility under stress.</p>

<h3>8.4 Factor Models</h3>
<p><strong>What they do:</strong> Decompose returns into common factor exposures plus idiosyncratic components.</p>
<p><strong>Uses:</strong> portfolio construction, hedging, performance attribution, risk budgeting.</p>

<h3>8.5 VaR and Expected Shortfall</h3>
<p><strong>VaR:</strong> Threshold loss level at a given confidence over a horizon.</p>
<p><strong>Expected Shortfall:</strong> Average loss beyond that threshold.</p>
<p><strong>Why quants care:</strong> Both are risk summaries, but expected shortfall better captures tail severity.</p>
<p><strong>Caveat:</strong> Any summary metric can hide important distribution shape.</p>

<h3>8.6 Stress Testing and Scenario Analysis</h3>
<p>Historical volatility may understate future extreme moves. Stress testing asks what happens under severe but plausible conditions.</p>

<h3>8.7 Kelly Criterion Intuition</h3>
<p>A framework for sizing bets based on edge and odds.</p>
<p><strong>Why interviewers like it:</strong> It connects probability, expected growth, and risk-taking.</p>
<p><strong>Caveat:</strong> Full Kelly can be too aggressive under estimation error.</p>

<h3>8.8 Leverage</h3>
<p>Leverage magnifies both returns and losses. A strategy with small edge can look attractive until leverage turns a tail event into ruin.</p>
<p><strong>Strong candidate instinct:</strong> Always think about leverage, liquidity, and forced liquidation risk together.</p>

<h3>Module 8 Practice Drills</h3>
<p><strong>Technical drills:</strong> Explain why optimization can produce extreme weights. Explain VaR vs Expected Shortfall. Explain factor risk in plain English. Explain why leverage changes everything.</p>
<p><strong>Interview-style questions:</strong> What is diversification really doing? Why is expected shortfall often preferred to VaR? Why can a high-Sharpe strategy still blow up?</p>`,
  },
  {
    title: '9.1–9.9 Market Microstructure: Order Books, Adverse Selection, Impact, Latency, Market Making',
    content: `<h3>9.1 Why Microstructure Matters</h3>
<p>A signal or price model means little if you do not understand how trades actually happen. Microstructure studies the mechanics of trading: order books, bid-ask spreads, market and limit orders, queue position, adverse selection, latency, inventory risk.</p>

<h3>9.2 Limit Order Book Basics</h3>
<p><strong>Best bid and best ask:</strong> Highest visible buy price and lowest visible sell price.</p>
<p><strong>Spread:</strong> Difference between them.</p>
<p><strong>Midprice:</strong> Average of bid and ask.</p>
<p><strong>Why these matter:</strong> Transaction costs, execution quality, and short-term pricing all depend on them.</p>

<h3>9.3 Market Orders vs Limit Orders</h3>
<p><strong>Market order:</strong> Trades immediately, pays spread, prioritizes certainty.</p>
<p><strong>Limit order:</strong> Posts liquidity, may earn spread, but faces fill uncertainty and adverse selection.</p>
<p><strong>Key trade-off:</strong> Immediacy vs price improvement.</p>

<h3>9.4 Adverse Selection</h3>
<p><strong>Core idea:</strong> When you provide liquidity, informed traders may trade against you when your quote is stale or favorable to them.</p>
<p><strong>Why it matters:</strong> A market maker is not just collecting spread. They are constantly managing adverse selection risk.</p>

<h3>9.5 Inventory Risk</h3>
<p>A market maker that accumulates too much inventory is exposed to price moves. Quotes are often adjusted not just for fair value changes but also for inventory control and information risk.</p>

<h3>9.6 Slippage, Impact, and Execution Cost</h3>
<p><strong>Slippage:</strong> Difference between expected and actual execution price.</p>
<p><strong>Market impact:</strong> Your own trade moves the market.</p>
<p><strong>Why it matters:</strong> Gross alpha can disappear net of impact and fees.</p>

<h3>9.7 Latency and Queueing</h3>
<p>In high-frequency settings, tiny delays matter. A theoretically profitable signal may be worthless if others react faster.</p>

<h3>9.8 Transaction Cost Analysis (TCA)</h3>
<p>Execution quality should be measured against benchmarks like: arrival price, VWAP, implementation shortfall.</p>

<h3>9.9 Practical Market-Making Intuition</h3>
<p>A simple market maker balances: spread capture, inventory control, adverse selection risk, fill probability, quote update speed.</p>
<p><strong>Strong candidate insight:</strong> Microstructure is about strategic interaction, not just passive observation of prices.</p>

<h3>Module 9 Practice Drills</h3>
<p><strong>Technical drills:</strong> Explain market vs limit order trade-offs. Explain adverse selection in plain English. Explain why spread is not "free money" for market makers. Explain slippage and market impact.</p>
<p><strong>Interview-style questions:</strong> Why would you ever post a limit order? What causes bid-ask spreads? How do latency and queue position matter?</p>`,
  },
  {
    title: '10.1–10.6 Numerical Methods: Monte Carlo, Variance Reduction, Finite Differences, Trees, Calibration',
    content: `<h3>10.1 Why Numerical Methods Matter</h3>
<p>In quant finance, many real problems do not have neat closed-form solutions. You often need approximation. Examples: exotic option pricing, PDE solutions, calibration, optimization, scenario generation, risk aggregation.</p>

<h3>10.2 Monte Carlo Simulation</h3>
<p><strong>What it is:</strong> Simulate many possible paths of random variables to estimate expectations or distributions.</p>
<p><strong>Why it matters:</strong> Flexible and widely applicable.</p>
<p><strong>Uses in finance:</strong> option pricing, VaR / risk estimation, portfolio scenarios, XVA-type calculations, path-dependent payoff valuation.</p>
<p><strong>Key intuition:</strong> Monte Carlo trades exactness for flexibility.</p>
<p><strong>Error behavior:</strong> Standard Monte Carlo error shrinks roughly like 1/√N, which means convergence can be slow.</p>

<h3>10.3 Variance Reduction</h3>
<p>Important techniques include: antithetic variates, control variates, stratified sampling, importance sampling. They improve simulation efficiency.</p>

<h3>10.4 Finite Difference Intuition</h3>
<p>Used to solve PDEs numerically. Important in pricing and risk for derivatives.</p>
<p><strong>Core idea:</strong> Approximate derivatives with discrete grid differences.</p>

<h3>10.5 Trees and Lattices</h3>
<p>Binomial and trinomial trees are useful for: option pricing intuition, early-exercise handling, discrete-time approximations.</p>

<h3>10.6 Calibration</h3>
<p><strong>What it is:</strong> Choose model parameters so model outputs match market prices or observed data.</p>
<p><strong>Why it matters:</strong> A model is useful only if it can align reasonably with reality or market observables.</p>
<p><strong>Caveat:</strong> A model can fit today's surface beautifully and still hedge poorly tomorrow.</p>

<h3>Module 10 Practice Drills</h3>
<p><strong>Technical drills:</strong> Explain Monte Carlo intuition. Explain why Monte Carlo can be slow. Explain control variates in plain English. Explain calibration and why overfitting can still occur.</p>
<p><strong>Interview-style questions:</strong> When would you use Monte Carlo instead of a closed form? What are the weaknesses of simulation? How would you price a path-dependent option?</p>`,
  },
  {
    title: '11.1–11.8 Programming: Languages, Data Structures, Algorithms, Performance, Production Code, Testing',
    content: `<h3>11.1 Why Programming Matters</h3>
<p>A quant who cannot implement ideas is incomplete. Programming is not separate from quantitative thinking. It is how quantitative thinking becomes testable and tradable.</p>

<h3>11.2 Core Languages</h3>
<p><strong>Python:</strong> Popular for research, prototyping, data analysis, and ML.</p>
<p><strong>C++:</strong> Important for performance-critical systems, pricing libraries, and low-latency trading.</p>
<p><strong>SQL:</strong> Important for data extraction and pipelines.</p>
<p><strong>Other languages:</strong> Java, Rust, Julia, kdb/q, depending on firm and role.</p>

<h3>11.3 Data Structures and Algorithms</h3>
<p><strong>Interviewers may test:</strong> arrays, lists, hash maps, heaps, queues, stacks, trees and graphs, sorting and searching, dynamic programming, recursion, time and space complexity.</p>
<p><strong>Why quants need this:</strong> Efficient data handling and low-latency logic matter in production environments.</p>

<h3>11.4 Vectorization and Performance Thinking</h3>
<p>Research code that works on tiny samples may break at scale.</p>
<p><strong>Key concerns:</strong> memory usage, copying overhead, cache efficiency, parallelization, numerical stability.</p>

<h3>11.5 Clean Research Code vs Production Code</h3>
<p><strong>Research code:</strong> Fast to iterate, exploratory, flexible.</p>
<p><strong>Production code:</strong> Reliable, tested, monitored, robust, maintainable.</p>
<p><strong>Strong candidate understanding:</strong> You should know the difference between "works once in a notebook" and "safe to deploy with capital."</p>

<h3>11.6 Testing and Validation</h3>
<p>Quant systems need: unit tests, integration tests, data validation, performance monitoring, reproducibility.</p>
<p><strong>Why it matters:</strong> A subtle bug can be financially catastrophic.</p>

<h3>11.7 Numerical Stability</h3>
<p>Even correct formulas can fail computationally due to: floating-point error, cancellation, overflow / underflow, ill-conditioned matrices.</p>

<h3>11.8 Common Coding Interview Topics for Quants</h3>
<p>probability simulations, parsing market data, rolling statistics, streaming algorithms, order book processing, dynamic programming puzzles, optimization routines.</p>

<h3>Module 11 Practice Drills</h3>
<p><strong>Technical drills:</strong> Explain why Python and C++ are used differently in quant finance. Explain why production reliability matters in trading. Explain numerical stability in plain English. Explain time vs space complexity trade-offs.</p>
<p><strong>Interview-style questions:</strong> How would you compute rolling volatility efficiently? Why is vectorization useful? When would you choose C++ over Python?</p>`,
  },
  {
    title: '12.1–12.7 Machine Learning for Quant Finance + Module 12 Practice',
    content: `<h3>12.1 Why ML Matters and Why It Is Dangerous</h3>
<p>Machine learning can uncover nonlinear patterns and interactions, but financial data are noisy, adaptive, and non-stationary.</p>
<p><strong>Why firms use it:</strong> signal extraction, feature selection, classification / ranking, regime detection, execution optimization, alternative data analysis.</p>
<p><strong>Why it is dangerous:</strong> overfitting, unstable relationships, weak signal-to-noise ratio, non-stationarity, hidden leakage, interpretability issues.</p>

<h3>12.2 Supervised Learning Basics</h3>
<p><strong>Regression:</strong> Predict a continuous target.</p>
<p><strong>Classification:</strong> Predict a category or probability.</p>
<p><strong>Ranking / scoring:</strong> Useful when selecting assets or trades from a universe.</p>

<h3>12.3 Unsupervised Learning</h3>
<p><strong>Clustering:</strong> May help with regime grouping, peer discovery, anomaly detection.</p>
<p><strong>Dimensionality reduction:</strong> PCA and related methods reduce feature dimension and noise.</p>

<h3>12.4 Feature Engineering</h3>
<p>In finance, features often matter more than fancy models. Examples: lagged returns, rolling vol, spreads, z-scores, order imbalance, cross-sectional rankings, macro surprises.</p>

<h3>12.5 Model Evaluation in Finance</h3>
<p><strong>Standard metrics are not enough:</strong> Accuracy may be irrelevant if class imbalance or payoff asymmetry matters.</p>
<p><strong>Better evaluation may include:</strong> expected PnL, Sharpe / IR, turnover-adjusted performance, drawdown, hit rate conditioned on costs, stability across regimes.</p>

<h3>12.6 Explainability and Governance</h3>
<p>A black-box model may be unusable in some firms if: the mechanism is unclear, risk cannot monitor it, behavior under stress is unknown.</p>

<h3>12.7 Online Learning and Adaptive Models</h3>
<p>Financial environments evolve. Adaptive updating can help, but it also increases risk of chasing noise.</p>

<h3>Module 12 Practice Drills</h3>
<p><strong>Technical drills:</strong> Explain why ML is harder in finance than in image classification. Explain feature leakage. Explain why cross-validation must respect time order. Explain why simpler models can outperform complex ones live.</p>
<p><strong>Interview-style questions:</strong> How would you use ML for signal generation? What are the biggest ML pitfalls in quant finance? How do you know whether a model is actually useful for trading?</p>`,
  },
];
