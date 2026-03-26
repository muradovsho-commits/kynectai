// Quant Finance Mastery Manual — Modules 13 (Question Bank) + 14 (Behavioral) + 15 (Mastery) + Appendices
export const QUANT_BEHAVIORAL_SECTIONS = [
  {
    title: '13.1–13.2 Probability & Statistics Interview Questions',
    content: `<p>This module is built to train interview performance, not just knowledge. For each question, focus on definitions, structure, assumptions, and caveats.</p>

<h3>Question 1: What is the expected number of fair coin flips until you get heads?</h3>
<p><strong>Strong answer:</strong> The expected number is 2. You can see this from the geometric distribution with success probability 1/2, where the expected waiting time is 1/p. Or recursively, let E be the expected number. With probability 1/2 you finish in one flip, and with probability 1/2 you spend one flip and are back where you started, so E = 1/2 · 1 + 1/2 · (1 + E), which gives E = 2.</p>
<p><strong>What interviewers are testing:</strong> Geometric expectation, recursive reasoning, composure.</p>
<p><strong>Weak answer:</strong> Maybe 1.5 because sometimes you get it right away.</p>
<p><strong>Follow-ups:</strong> What if the coin lands heads with probability p? What is the variance?</p>

<h3>Question 2: Explain Bayes' Rule in plain English.</h3>
<p><strong>Strong answer:</strong> Bayes' Rule tells you how to update the probability of a hypothesis when you receive new evidence. It starts with your prior belief, then reweights it by how likely the observed evidence would be if the hypothesis were true, and normalizes by the overall probability of the evidence.</p>
<p><strong>What interviewers are testing:</strong> Conceptual understanding over memorization.</p>

<h3>Question 3: What is a martingale?</h3>
<p><strong>Strong answer:</strong> A martingale is a stochastic process whose expected future value, conditional on all information available now, equals its current value. Intuitively it is a fair game under the current information set.</p>
<p><strong>Follow-ups:</strong> Why do martingales matter in no-arbitrage pricing? Is a stock price a martingale in the real world or only under certain measures?</p>

<h3>Question 4: What is overfitting?</h3>
<p><strong>Strong answer:</strong> Overfitting is when a model captures noise or idiosyncrasies in the training sample rather than stable structure, so it performs well in-sample but poorly out-of-sample. In finance this often happens because the signal-to-noise ratio is low and the environment is non-stationary.</p>

<h3>Question 5: What are common backtest biases?</h3>
<p><strong>Strong answer:</strong> Look-ahead bias, survivorship bias, data snooping, selection bias, stale or incorrect timestamps, ignoring transaction costs, and using a validation scheme that leaks future information.</p>`,
  },
  {
    title: '13.3–13.5 Derivatives, Market, and Coding Interview Questions',
    content: `<h3>Question 6: What is implied volatility?</h3>
<p><strong>Strong answer:</strong> Implied volatility is the volatility input that makes a pricing model, often Black-Scholes, match the observed market price of an option. It is not directly observed realized volatility; it is the market's pricing-implied volatility under the model convention.</p>

<h3>Question 7: Why does higher volatility increase option value?</h3>
<p><strong>Strong answer:</strong> Because options have asymmetric payoffs. Greater volatility increases the probability of large favorable outcomes for the holder while losses remain limited for vanilla long options. That convexity makes higher volatility valuable.</p>

<h3>Question 8: Why is a high-Sharpe strategy not necessarily safe?</h3>
<p><strong>Strong answer:</strong> Because Sharpe only uses volatility as the risk metric. A strategy can have smooth small gains and rare catastrophic losses, which may produce a high historical Sharpe until the tail event occurs. It can also ignore liquidity, leverage, skew, and regime fragility.</p>

<h3>Question 9: What causes bid-ask spreads?</h3>
<p><strong>Strong answer:</strong> Spreads compensate liquidity providers for order-processing costs, inventory risk, and adverse selection risk. Informed flow and low liquidity tend to widen spreads.</p>

<h3>Question 10: Why might a quant use Python for research and C++ for production?</h3>
<p><strong>Strong answer:</strong> Python is excellent for fast iteration, data analysis, and experimentation, while C++ is often used where latency, memory control, and computational performance matter more. The trade-off is developer speed versus runtime efficiency and systems control.</p>`,
  },
  {
    title: '13.6–13.7 Research and "Think Out Loud" Questions + Module 13 Practice',
    content: `<h3>Question 11: How would you validate a trading signal?</h3>
<p><strong>Strong answer:</strong> I would start with economic or behavioral rationale, then define the signal precisely and test it on properly aligned historical data. I would evaluate in-sample and out-of-sample performance, use time-aware validation, estimate transaction costs and turnover, test robustness across subperiods and regimes, and examine whether performance survives realistic implementation assumptions.</p>

<h3>Question 12: Why do signals decay?</h3>
<p><strong>Strong answer:</strong> Signals decay because competitors discover them, market structure evolves, crowding reduces edge, transaction costs rise, or the original economic mechanism stops working. Sometimes the signal was never real and the apparent alpha was just noise.</p>

<h3>Question 13: How would you estimate whether a coin is biased from observed flips?</h3>
<p><strong>Strong answer structure:</strong> Define the parameter p. Use the sample proportion as a natural estimator. Quantify uncertainty with a confidence interval or Bayesian posterior. Test whether p differs materially from 1/2. Note that small samples can be misleading.</p>

<h3>Question 14: How would you build a simple market-making strategy?</h3>
<p><strong>Strong answer structure:</strong> Define fair value estimate. Quote bid and ask around fair value. Adjust spread based on volatility, inventory, and information risk. Monitor fills, adverse selection, and queue position. Add hard risk limits and latency-aware logic.</p>

<h3>Module 13 Practice Drills</h3>
<p><strong>Technical drills:</strong> Take each question and answer it in: one sentence, 30 seconds, 90 seconds with nuance.</p>
<p><strong>Self-test checklist:</strong> Did I start with the definition? Did I explain why it matters? Did I mention assumptions? Did I add a caveat or limitation?</p>`,
  },
  {
    title: '14.1–14.7 Behavioral, Communication, and Fit for Quant Roles',
    content: `<h3>14.1 Why Behavioral Matters in Quant Interviews</h3>
<p>Quant interviews are not purely technical. Teams are assessing: curiosity, humility, resilience, collaboration, communication clarity, genuine interest in markets or modeling, capacity to learn fast.</p>

<h3>14.2 "Tell Me About Yourself" for Quant Roles</h3>
<p>A strong answer should connect: your academic foundation, your interest in mathematical or computational problem-solving, your exposure to markets, data, or systems, why this role is the natural next step.</p>
<p><strong>Example structure:</strong> "I'm currently studying mathematics and computer science, and over time I became especially interested in applying those tools to noisy real-world decision problems. That led me into probability, statistics, and programming-heavy projects, and eventually into finance because markets provide a fast, feedback-rich environment where modeling, uncertainty, and implementation all matter. I'm particularly drawn to quant roles because they combine rigorous analysis with direct real-world consequences, whether in pricing, trading, or research."</p>

<h3>14.3 Why Quant Finance?</h3>
<p>Weak answers are vague, like "I like math and money."</p>
<p><strong>Strong answers combine:</strong> love of quantitative problem-solving, attraction to uncertainty and feedback loops, interest in markets or strategic decision systems, enjoyment of combining theory with implementation.</p>

<h3>14.4 Research Storytelling</h3>
<p>If you have projects, internships, or competitions, explain them in a structured way: objective, data and assumptions, method, result, limitations, what you learned.</p>
<p><strong>Interviewer red flag:</strong> Candidates who talk only about winning accuracy metrics and ignore robustness, leakage, or assumptions.</p>

<h3>14.5 Handling "I Don't Know"</h3>
<p>Good candidates do not bluff recklessly. They say: what they know, what assumption they would make, how they would approach the missing part. This shows judgment.</p>

<h3>14.6 Communication Under Pressure</h3>
<p>You should sound: calm, precise, structured, intellectually honest, collaborative. Even brilliant candidates can fail if they are scattered or arrogant.</p>

<h3>14.7 Common Behavioral Questions</h3>
<ul><li>Why quant finance?</li><li>Why this firm?</li><li>Tell me about a difficult technical problem you solved.</li><li>Tell me about a time a model or project failed.</li><li>Tell me about a time you had to work with incomplete information.</li><li>Tell me about a time you disagreed with a teammate.</li><li>Describe a research project and what you would improve.</li></ul>

<h3>Module 14 Practice Drills</h3>
<p><strong>Prepare answers for:</strong> Tell me about yourself. Why quant finance? Why trading / research / dev? Tell me about a failed project. Tell me about a time you debugged something difficult.</p>
<p><strong>Self-test checklist:</strong> Is my answer specific? Did I explain my role clearly? Did I show learning and humility? Does my story sound like a quant, not a generic applicant?</p>`,
  },
  {
    title: '15.1–15.6 Interview Mastery: Top 1%, 6-Week Plan, Final Checklist',
    content: `<h3>15.1 What Top 1% Quant Candidates Do Differently</h3>
<p>They do not just solve problems. They demonstrate habits of mind that teams trust. They: define problems precisely, state assumptions clearly, reason from first principles, simplify before complicating, connect theory to implementation, check edge cases, communicate calmly, acknowledge limitations of models.</p>

<h3>15.2 How to Answer Quant Questions in Real Time</h3>
<p>Use this structure: Clarify the question, State assumptions, Choose the framework, Solve step by step, Sanity-check the result, Interpret it, Mention limitations.</p>

<h3>15.3 How to Handle Brain Teasers and Puzzles</h3>
<p><strong>Best approach:</strong> slow down slightly, define the sample space carefully, use symmetry, recursion, or complement where useful, talk through your logic clearly, do not guess impulsively.</p>

<h3>15.4 How to Prepare by Role Type</h3>
<p><strong>Quant trading emphasis:</strong> probability, mental math, expected value, game theory, market microstructure, fast reasoning.</p>
<p><strong>Quant research emphasis:</strong> statistics, time series, ML, signal validation, stochastic modeling, coding analysis.</p>
<p><strong>Quant developer emphasis:</strong> algorithms, data structures, systems, performance, debugging, software quality.</p>
<p><strong>Pricing / strats emphasis:</strong> stochastic calculus, derivatives, PDEs, numerical methods, calibration, sensitivities.</p>

<h3>15.5 A 6-Week Training Plan</h3>
<p><strong>Week 1:</strong> probability foundations, expectation / variance drills, basic coding refresh, tell-me-about-yourself draft.</p>
<p><strong>Week 2:</strong> statistics and regression, backtest bias drills, time series basics, 20 probability interview questions.</p>
<p><strong>Week 3:</strong> stochastic processes, derivatives basics, Greeks and no-arbitrage, Monte Carlo practice.</p>
<p><strong>Week 4:</strong> portfolio / risk / optimization, microstructure basics, implementation and algorithms, signal validation cases.</p>
<p><strong>Week 5:</strong> full mixed mock interviews, role-specific focus, behavioral refinement, explain-out-loud practice daily.</p>
<p><strong>Week 6:</strong> timed probability and coding sessions, derivatives and market questions, pressure simulation, final weakness cleanup.</p>

<h3>15.6 Final Mastery Checklist</h3>
<p>You are interview-ready when you can do all of the following without notes:</p>
<ul><li>explain expectation, variance, covariance, and Bayes' Rule cleanly</li><li>distinguish probability from statistics</li><li>explain overfitting and backtest bias convincingly</li><li>explain Brownian motion, risk-neutral pricing, and Greeks conceptually</li><li>explain implied vs realized volatility</li><li>explain market-making risks and bid-ask spreads</li><li>explain portfolio risk and why optimization can be unstable</li><li>explain when Monte Carlo is useful and when it is inefficient</li><li>discuss coding trade-offs and implementation risks</li><li>answer behavioral questions with clarity and humility</li></ul>`,
  },
  {
    title: '15.7 Final Advice + Appendix A: Rapid-Fire Review Sheet',
    content: `<h3>15.7 Final Advice</h3>
<p>Quant finance rewards precision, rigor, and judgment.</p>
<p>Most candidates underperform because they memorize formulas but cannot think. They know what delta is, but cannot explain why gamma matters to a hedger. They know what overfitting is, but do not mention transaction costs or regime dependence. They know Bayes' Rule, but do not recognize when new evidence should change their belief. They know Monte Carlo exists, but cannot explain when it is preferable to a closed form.</p>
<p>Your goal is not to be a formula container. Your goal is to become someone who can take a noisy problem, formalize it, solve it, stress-test it, and explain it. That is what strong quant teams trust.</p>

<h3>Appendix A: Rapid-Fire Review Sheet</h3>
<p><strong>Probability:</strong> Expectation is the probabilistic average. Variance measures dispersion. Correlation is standardized covariance. Bayes updates beliefs with evidence. Independence is a strong assumption; do not assume it lightly. Martingale = fair game under current information.</p>
<p><strong>Statistics:</strong> Estimation error matters. Statistical significance is not economic significance. Overfitting destroys live performance. Time-aware validation matters in finance.</p>
<p><strong>Stochastic Modeling:</strong> Brownian motion is a core idealized random process. GBM underlies Black-Scholes-style modeling. Risk-neutral measure is for pricing, not "true" beliefs. Ito's Lemma is stochastic chain rule.</p>
<p><strong>Derivatives:</strong> No-arbitrage is foundational. Put-call parity is a key identity. Delta, gamma, vega, theta are core sensitivities. Implied vol is the market's pricing input, not realized future truth.</p>
<p><strong>Portfolio / Risk:</strong> Diversification depends on covariance, not just many names. Leverage magnifies fragility. VaR is a threshold, expected shortfall captures tail severity better.</p>
<p><strong>Microstructure:</strong> Spread compensates for costs, inventory risk, and adverse selection. Limit orders trade price for fill risk. Market impact can destroy alpha.</p>
<p><strong>Implementation:</strong> Research code is not production code. Numerical stability matters. Efficient data structures matter.</p>`,
  },
  {
    title: 'Appendix B: 40 Additional Questions + Appendix C: Daily Drill + Closing Note',
    content: `<h3>Appendix B: 40 Additional High-Value Quant Interview Questions</h3>
<ol><li>What is the difference between expectation and median?</li><li>Why does variance use squared deviations?</li><li>When can correlation be misleading?</li><li>What is the difference between PDF and CDF?</li><li>Why is the normal distribution so common?</li><li>When does the CLT fail to be a good approximation?</li><li>What is the difference between stationarity and mean reversion?</li><li>Why are financial returns often heavy-tailed?</li><li>What is heteroskedasticity?</li><li>Why is volatility clustering important?</li><li>What is the difference between in-sample and out-of-sample performance?</li><li>What is survivorship bias?</li><li>What is look-ahead bias?</li><li>Why can a t-stat be misleading in finance?</li><li>What does beta measure in a regression?</li><li>Why can regression coefficients be unstable over time?</li><li>What is a covariance matrix and why can it be hard to estimate?</li><li>Why can optimization overfit?</li><li>What is a martingale measure?</li><li>Why are discounted prices martingales under risk-neutral pricing?</li><li>What is the intuition behind Black-Scholes?</li><li>Why does gamma matter for hedging?</li><li>Why can implied volatility differ across strikes?</li><li>What is skew?</li><li>Why might realized vol differ from implied vol?</li><li>What is path dependence?</li><li>Why use Monte Carlo?</li><li>Why can Monte Carlo be inefficient for rare events?</li><li>What is a control variate?</li><li>Why are market orders expensive?</li><li>Why would a market maker widen spreads?</li><li>What is adverse selection?</li><li>What makes a good trading signal?</li><li>Why do signals decay?</li><li>Why is capacity important?</li><li>Why does turnover matter?</li><li>What is information ratio?</li><li>Why might a high-Sharpe backtest be fake?</li><li>How do you choose features for an ML model?</li><li>Why can simpler models outperform more complex ones in live trading?</li></ol>

<h3>Appendix C: Daily 45-Minute Drill Menu</h3>
<p><strong>15 minutes:</strong> Probability / estimation / puzzle drill</p>
<p><strong>15 minutes:</strong> Statistics / time series / research design drill</p>
<p><strong>15 minutes:</strong> Markets / derivatives / coding / behavioral rotation</p>
<p>Do this consistently. Skill compounds through repeated explanation and problem solving.</p>

<h3>Closing Note</h3>
<p>The best quant candidates do not merely know advanced mathematics. They can translate mathematics into financial reasoning, and financial reasoning into implementable systems.</p>
<p>They understand how distributions become risk, how risk becomes pricing, how pricing becomes trading decisions, how trading decisions interact with liquidity, and how implementation determines whether theoretical edge survives reality.</p>
<p>That is the level this manual is designed to build.</p>
<p>If you master these modules deeply enough to explain them clearly under pressure, you will not just answer quant interview questions. You will think like a quant.</p>`,
  },
];
