// Quant Finance Mastery Manual — Module 1 (Foundations) + Module 2 (Probability)
export const QUANT_PROB_SECTIONS = [
  {
    title: '1.1 What Quant Finance Actually Is',
    content: `<p>Quant finance is the use of mathematical, statistical, computational, and economic methods to model markets, price securities, manage risk, identify trading opportunities, and build decision systems under uncertainty.</p>
<p><strong>Why it exists:</strong> Financial markets are noisy, uncertain, and fast-moving. Human intuition alone is not enough for: pricing derivatives, estimating risk, forecasting signals, allocating capital, executing trades efficiently, managing large portfolios under constraints.</p>
<p><strong>When it is used:</strong> Derivatives pricing, systematic trading, portfolio construction, market making, execution optimization, risk management, statistical arbitrage, volatility modeling, credit modeling, macro and cross-asset research.</p>`,
  },
  {
    title: '1.2 The Core Categories of Quant Roles',
    content: `<p><strong>Quant trader:</strong> Uses statistics, probability, market intuition, and automation to identify and exploit short-horizon opportunities. Often works with: market microstructure, pricing dislocations, inventory management, execution decisions, mental math and fast decision-making.</p>
<p><strong>Quant researcher:</strong> Builds predictive models, tests hypotheses, analyzes data, develops signals, and studies market behavior. Often works with: statistics, time series, machine learning, factor models, alpha research.</p>
<p><strong>Quant developer:</strong> Implements pricing engines, research infrastructure, execution systems, and production pipelines. Often works with: C++ / Python / Java, algorithms and data structures, concurrency, optimization, numerical libraries, distributed systems.</p>
<p><strong>Quant analyst / strat / pricing quant:</strong> Builds and maintains valuation models, risk models, and analytics for trading desks or portfolio teams. Often works with: stochastic calculus, PDEs, Monte Carlo, calibration, curve construction, sensitivities / Greeks.</p>`,
  },
  {
    title: '1.3–1.4 What Quant Interviews Test & The Quant Mindset',
    content: `<h3>1.3 What Quant Interviews Are Really Testing</h3>
<p>Most candidates misunderstand quant interviews. They think the interview is just a harder math exam. It is not.</p>
<p><strong>Interviewers are usually testing some mix of:</strong> mathematical rigor, speed and accuracy under pressure, probabilistic intuition, ability to reason from first principles, coding fluency, modeling judgment, clarity of explanation, humility and honesty when uncertain, ability to simplify complex problems.</p>
<p>A great candidate is not just "smart." A great candidate is structured, precise, and calm.</p>

<h3>1.4 The Quant Mindset</h3>
<p><strong>Think in assumptions:</strong> Every model rests on assumptions. Top candidates constantly ask: What is being assumed here? Is that realistic? What happens if it is wrong?</p>
<p><strong>Think in distributions, not certainties:</strong> Quant finance is about uncertainty. You are rarely asked "What will happen?" You are usually asking: What is the distribution of possible outcomes? What is the expected value? What is the variance? What are the tail risks?</p>
<p><strong>Think in trade-offs:</strong> A model can be: elegant but unrealistic, realistic but computationally intractable, predictive in-sample but unstable out-of-sample, profitable gross but not net of costs. Strong quants think in trade-offs, not absolutes.</p>
<p><strong>Think in implementation, not just theory:</strong> A strategy with a strong theoretical edge may fail in reality because of: latency, transaction costs, liquidity constraints, market impact, stale data, bad assumptions.</p>`,
  },
  {
    title: '1.5–1.7 The Quant Finance Stack, Elite vs Average, Mental Framework',
    content: `<h3>1.5 The Quant Finance Stack</h3>
<p>You can think of quant finance as a layered system:</p>
<ul><li><strong>Mathematics:</strong> linear algebra, calculus, probability, optimization</li><li><strong>Statistics and inference:</strong> estimation, hypothesis testing, regression, time series</li><li><strong>Market and instrument knowledge:</strong> equities, futures, options, rates, credit, FX</li><li><strong>Modeling:</strong> stochastic processes, pricing models, risk models, alpha models</li><li><strong>Computation:</strong> programming, simulation, optimization routines, production systems</li><li><strong>Execution and reality:</strong> slippage, liquidity, microstructure, operational constraints</li></ul>

<h3>1.6 How Elite Candidates Sound Different</h3>
<p><strong>Average candidate:</strong> Recites formulas without explaining them. Solves toy puzzles but misses real-world caveats. Gives vague coding answers. Uses jargon without precision. Does not check assumptions.</p>
<p><strong>Elite candidate:</strong> Starts from definitions. States assumptions explicitly. Solves cleanly and checks edge cases. Connects math to market behavior. Explains limitations of models. Communicates with calm precision.</p>

<h3>1.7 Mental Framework for Any Quant Problem</h3>
<p>When given a quant question, use this sequence:</p>
<ol><li>Define the objective</li><li>Clarify assumptions</li><li>Choose a model or framework</li><li>Solve analytically if possible</li><li>Approximate or simulate if necessary</li><li>Interpret the result</li><li>Stress-test the assumptions</li></ol>
<p>This framework applies to probability puzzles, coding questions, derivatives pricing, and research design.</p>

<h3>Module 1 Practice Drills</h3>
<p><strong>Explain-out-loud drills:</strong> What is quant finance? What is the difference between quant trading and quant research? Why do models fail? Why is expected value not enough by itself?</p>
<p><strong>Self-test checklist:</strong> Did I define the problem clearly? Did I state assumptions? Did I distinguish theory from implementation? Did I interpret the answer, not just compute it?</p>`,
  },
  {
    title: '2.1–2.3 Why Probability Matters, Random Variables, Expectation',
    content: `<h3>2.1 Why Probability Is the Language of Quant Finance</h3>
<p>Markets are uncertain. Prices move randomly in the short run, order flow is noisy, and outcomes are distributions rather than fixed numbers. Probability is the mathematical framework for reasoning about uncertainty.</p>
<p><strong>Why interviewers care so much:</strong> Probability is the backbone of: expected value calculations, options pricing, risk estimation, signal evaluation, market making logic, Bayesian updating. A quant candidate who is weak in probability is missing the core language of the field.</p>

<h3>2.2 Random Variables</h3>
<p><strong>What they are:</strong> A random variable maps outcomes of a random experiment to numerical values.</p>
<p><strong>Types:</strong> Discrete random variables: finite or countable outcomes. Continuous random variables: values over intervals.</p>
<p><strong>Finance intuition:</strong> Examples include: daily return, number of trades in a minute, terminal stock price, default indicator, realized volatility over a period.</p>

<h3>2.3 Expectation</h3>
<p><strong>Definition:</strong> The expectation of a random variable is its average value in the probabilistic sense. For a discrete variable: E[X] = sum of x * P(X=x). For a continuous variable: E[X] = integral of x f(x) dx.</p>
<p><strong>Intuition:</strong> Expectation is the center of gravity of the distribution.</p>
<p><strong>Why it matters:</strong> Many quant problems reduce to expected value. Examples: fair game price, expected PnL, expected payoff of an option under a measure, expected reward in reinforcement or bandit settings.</p>
<p><strong>Important caveat:</strong> Expected value alone is not enough. A trade with positive expected value but extreme downside risk may still be unattractive.</p>`,
  },
  {
    title: '2.4–2.5 Variance/Std Dev, Covariance/Correlation',
    content: `<h3>2.4 Variance and Standard Deviation</h3>
<p><strong>Definition:</strong> Variance measures dispersion around the mean. Var(X) = E[(X - E[X])²] = E[X²] - (E[X])². Standard deviation is the square root of variance.</p>
<p><strong>Why it matters:</strong> Variance is central to: volatility, portfolio theory, signal-to-noise ratio, confidence intervals, risk-adjusted returns.</p>
<p><strong>Interview nuance:</strong> Candidates often give the formula but fail to explain meaning. Variance quantifies uncertainty, instability, or dispersion of outcomes.</p>

<h3>2.5 Covariance and Correlation</h3>
<p><strong>Covariance:</strong> Measures how two variables move together. Cov(X,Y) = E[(X - E[X])(Y - E[Y])]</p>
<p><strong>Correlation:</strong> Standardized covariance: Corr(X,Y) = Cov(X,Y)/(σ_X σ_Y)</p>
<p><strong>Why it matters in finance:</strong> portfolio diversification, factor modeling, pairs trading, hedging, risk decomposition.</p>
<p><strong>Important caveat:</strong> Correlation is not stable. It changes across regimes, especially in crises.</p>`,
  },
  {
    title: '2.6–2.7 Conditional Probability, Bayes\' Rule, Independence',
    content: `<h3>2.6 Conditional Probability and Bayes' Rule</h3>
<p><strong>Conditional probability:</strong> P(A|B) = P(A and B) / P(B)</p>
<p><strong>Bayes' Rule:</strong> P(A|B) = P(B|A)P(A)/P(B)</p>
<p><strong>Why this matters:</strong> Bayesian thinking appears everywhere: signal updating, market maker inference from order flow, event-driven trading, model updating under new evidence.</p>
<p><strong>Interview intuition:</strong> Bayes' Rule is about revising beliefs when new information arrives.</p>

<h3>2.7 Independence</h3>
<p>Two random variables are independent if: P(A and B) = P(A)P(B)</p>
<p><strong>Why this matters:</strong> Candidates frequently assume independence when it is not justified. Many interview puzzles are designed to catch this mistake.</p>
<p><strong>Finance caveat:</strong> Asset returns are often not independent, especially during market stress.</p>`,
  },
  {
    title: '2.8 Common Distributions',
    content: `<p><strong>Bernoulli:</strong> Single trial success/failure. Useful for directional events, fills, defaults.</p>
<p><strong>Binomial:</strong> Number of successes in n independent Bernoulli trials. Useful in toy pricing setups and counting-type questions.</p>
<p><strong>Poisson:</strong> Counts events over a time interval. Useful for trade arrivals, defaults in simplified settings, jump timing.</p>
<p><strong>Exponential:</strong> Time between Poisson events. Useful for waiting-time intuition.</p>
<p><strong>Uniform:</strong> All values in an interval equally likely. Common in puzzles and simulation.</p>
<p><strong>Normal (Gaussian):</strong> The most famous continuous distribution. Used widely because of tractability and central limit arguments.</p>
<p><strong>Lognormal:</strong> If log-price is normal, price is lognormal. Central in Black-Scholes-style modeling.</p>
<p><strong>Heavy-tailed distributions:</strong> Important because real returns often exhibit fatter tails than Gaussian assumptions suggest.</p>`,
  },
  {
    title: '2.9–2.12 LLN, CLT, Order Statistics, Martingales, Interview Questions + Module 2 Practice',
    content: `<h3>2.9 Law of Large Numbers and Central Limit Theorem</h3>
<p><strong>Law of Large Numbers:</strong> Sample averages converge to the true expectation under suitable conditions.</p>
<p><strong>Central Limit Theorem:</strong> Sums or averages of many independent variables tend toward a normal distribution under broad conditions.</p>
<p><strong>Why interviewers care:</strong> These justify: Monte Carlo convergence intuition, confidence intervals, sampling-based reasoning, approximate normality in certain settings.</p>
<p><strong>Important caveat:</strong> Convergence speed matters, independence matters, and tails matter.</p>

<h3>2.10 Order Statistics and Extremes</h3>
<p>Quants are often asked about: maximum of random draws, expected minimum / maximum, stopping times, records and extremes. These matter in: risk management, barrier options, best bid / ask dynamics, selection bias problems.</p>

<h3>2.11 Martingales</h3>
<p><strong>First-principles idea:</strong> A martingale is a process whose expected next value, conditional on current information, equals its current value.</p>
<p><strong>Why it matters:</strong> Martingales are central to: no-arbitrage pricing, risk-neutral valuation, stopping time arguments, fair game logic.</p>
<p><strong>Intuition:</strong> A martingale is a fair game under the information you currently have.</p>

<h3>2.12 Common Probability Interview Questions</h3>
<p><strong>Example 1: Expected flips until first heads.</strong> Let X be number of flips until first heads with p=1/2. Method 1: geometric expectation 1/p = 2. Method 2: recursive: X = 1 with probability 1/2, else 1 + X with probability 1/2. So E[X] = (1/2)·1 + (1/2)(1 + E[X]) → E[X]=2.</p>
<p><strong>Example 2: Probability of at least one success.</strong> Use complement: P(at least one) = 1 - P(none).</p>
<p><strong>Example 3: Two-envelope / information-trap style questions.</strong> The key is always to define the sample space precisely and avoid conditioning sloppily.</p>

<h3>Module 2 Practice Drills</h3>
<p><strong>Technical drills:</strong> Derive expectation and variance of a Bernoulli variable. Explain Poisson vs exponential relationship. Explain Bayes' Rule in plain English. Explain why covariance matters in portfolio risk. Explain CLT and why it is useful but dangerous to overuse.</p>
<p><strong>Interview-style questions:</strong> What is a martingale? What is the expected value of a geometric random variable? Why is correlation insufficient in crises? When is normality a bad assumption?</p>
<p><strong>Self-testing framework — For any probability question, ask:</strong> What is the sample space? Are events independent? Can I use symmetry? Can I use complement? Can I solve recursively? What assumptions am I making?</p>`,
  },
];
