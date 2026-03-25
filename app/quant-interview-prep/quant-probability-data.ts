export const QUANT_PROB_SECTIONS = [
  {
    title: `1. Combinatorics & Permutations`,
    content: `<p>Before diving into continuous math, you must completely master discrete counting operations. These form the base of all discrete card and dice problems.</p>
<br/>
<p><strong>Permutations (Order Matters):</strong></p>
<p>How many ways can you arrange $n$ distinct objects? <strong>Answer: $n!$</strong></p>
<p>How many ways can you pick $k$ objects from $n$ and arrange them? <strong>Answer: $P(n, k) = \\frac{n!}{(n-k)!}$</strong></p>
<br/>
<p><strong>Combinations (Order Does NOT Matter):</strong></p>
<p>How many ways can you choose a committee of $k$ people from an $n$-person group? <strong>Answer: $C(n, k) = \\binom{n}{k} = \\frac{n!}{k!(n-k)!}$</strong></p>
<br/>
<p><strong>Classic Problem: Stars and Bars (Multichoose)</strong><br/>
"How many ways can you distribute 10 identical identical apples among 3 different children?"<br/>
Imagine 10 apples (stars) and 2 dividers (bars) to separate them into 3 distinct groups. You have $10 + 2 = 12$ total positions in a line, and you need to choose 2 of those positions to place the dividers.<br/>
<strong>Answer: $C(12, 2) = \\frac{12 \\times 11}{2} = 66$ ways.</strong></p>`
  },
  {
    title: `2. Conditional Probability & Bayes' Theorem`,
    content: `<p>Bayes' Theorem is the most tested mathematical concept in quantitative finance. It is the mathematical framework for updating your beliefs (The Posterior) when new information arrives (The Evidence).</p>
<br/>
<p><strong>Bayes' Theorem Formula:</strong><br/>
$P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)} = \\frac{P(B|A) \\cdot P(A)}{P(B|A)P(A) + P(B|\\sim A)P(\\sim A)}$</p>
<br/>
<p><strong>Classic "False Positive" Question (The Rare Disease):</strong><br/>
"A disease affects 1% of the population. A test for the disease is 99% accurate (it correctly identifies 99% of sick people, and correctly identifies 99% of healthy people). If you take the test and it returns positive, what is the probability you actually have the disease?"</p>
<p><em>Solution via Natural Frequencies:</em><br/>
Let's use a hypothetical population of 10,000 to make the math intuitive.<br/>
1. Actual Sick: 100 people (1% of 10k). Actual Healthy: 9,900 people.<br/>
2. True Positives (Sick people who correctly test positive): 99% of 100 = 99.<br/>
3. False Positives (Healthy people who incorrectly test positive): 1% error rate applied to 9,900 = 99.<br/>
4. Total Positive Tests observed: 99 + 99 = 198.<br/>
5. $P(\\text{Sick} | \\text{Positive}) = \\frac{\\text{True Positives}}{\\text{Total Positives}} = \\frac{99}{198} = \\mathbf{50\\%}$.<br/>
<em>(Most candidates instinctively guess 99%. Getting this right is absolutely mandatory.)</em></p>`
  },
  {
    title: `3. Common Probability Distributions (Discrete)`,
    content: `<p>You must know the Probability Mass Function (PMF), Expected Value ($E[X]$), and Variance ($Var(X)$) for the standard discrete distributions cold.</p>
<br/>
<p><strong>1. Bernoulli Distribution:</strong><br/>
A single trial with two outcomes (Success=1 with probability $p$, Failure=0 with probability $1-p$).<br/>
$E[X] = p$<br/>
$Var(X) = p(1-p)$</p>
<br/>
<p><strong>2. Binomial Distribution:</strong><br/>
The summation of $n$ independent Bernoulli trials. Number of successes in $n$ trials.<br/>
$PMF: P(X=k) = \\binom{n}{k} p^k (1-p)^{n-k}$<br/>
$E[X] = np$<br/>
$Var(X) = np(1-p)$</p>
<br/>
<p><strong>3. Poisson Distribution:</strong><br/>
Models the number of independent events occurring in a fixed interval of time (e.g., how many high-frequency trades occur in the next millisecond), given an average rate $\\lambda$.<br/>
$PMF: P(X=k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}$<br/>
$E[X] = \\lambda$<br/>
$Var(X) = \\lambda$<br/>
<em>Key interview trivia: The Poisson distribution is the only standard distribution where the expected value always equals the variance.</em></p>`
  },
  {
    title: `4. Common Probability Distributions (Continuous)`,
    content: `<p>For quantitative researchers and derivatives traders, continuous distributions govern the behavior of asset prices and Brownian motion.</p>
<br/>
<p><strong>1. Normal (Gaussian) Distribution:</strong><br/>
The classic bell curve. $X \\sim N(\\mu, \\sigma^2)$.<br/>
You MUST memorize the Empirical Rule: 68% of data falls within 1 standard deviation ($1\\sigma$), 95% within $2\\sigma$, and 99.7% within $3\\sigma$. You should also know that the sum of two independent normal variables $N(\\mu_1, \\sigma_1^2)$ and $N(\\mu_2, \\sigma_2^2)$ is $N(\\mu_1+\\mu_2, \\sigma_1^2+\\sigma_2^2)$. <em>(Notice that variances add, not standard deviations).</em></p>
<br/>
<p><strong>2. Lognormal Distribution:</strong><br/>
If $Y = e^X$ and $X$ is Normally distributed, then $Y$ is Lognormal. <br/>
Why is this important? Stock prices are generally modeled as Lognormal distributions rather than Normal distributions because stock prices cannot drop below $0, but can theoretically stretch to infinity on the upside (they have a right skew).</p>
<br/>
<p><strong>3. Uniform Distribution:</strong><br/>
A continuous flat distribution on interval $[a, b]$.<br/>
$E[X] = \\frac{a+b}{2}$<br/>
$Var(X) = \\frac{(b-a)^2}{12}$</p>`
  },
  {
    title: `5. Linearity of Expectation`,
    content: `<p>Linearity of Expectation is a "cheat code" for solving incredibly complex probability problems. It states that the expected value of a sum of random variables is equal to the sum of their individual expected values, <strong>regardless of whether the variables are independent or correlated.</strong></p>
<br/>
<p><strong>Formula:</strong> $E[X + Y] = E[X] + E[Y]$</p>
<br/>
<p><strong>Classic Problem: The Hat Check</strong><br/>
"100 people check their hats at a restaurant. The attendant loses the tickets and gives the 100 hats back completely at random. What is the expected number of people who receive their correct hat?"</p>
<p><em>Solution Framework:</em><br/>
Trying to calculate the exact probability distribution of achieving 0, 1, 2... or 100 correct hats involves derangements and gets mathematically terrifying immediately.<br/>
Instead, define an indicator variable $X_i$ for person $i$:<br/>
$X_i = 1$ if person $i$ gets their hat back, else $0$.<br/>
The expected value for one individual is: $E[X_i] = 1 \\times P(\\text{gets correct hat}) = 1 \\times \\frac{1}{100} = 0.01$.<br/>
The total expected number of correct hats is $E[X_1 + X_2 + ... + X_{100}]$.<br/>
By Linearity of Expectation: $E[\\sum X_i] = \\sum E[X_i] = 100 \\times 0.01 = \\mathbf{1}$.<br/>
Remarkably, the answer is exactly 1, regardless of how many people (whether 10 or 1,000,000) check their hats.</p>`
  },
  {
    title: `6. Markov Chains & Random Walks`,
    content: `<p>Many trading strategies involve modeling the market as a series of distinct states. A Markov Chain is a stochastic model describing a sequence of possible events in which the probability of each event depends <em>only</em> on the state attained in the previous event (the "Memoryless Property").</p>
<br/>
<p><strong>Classic "Gambler's Ruin" Problem:</strong><br/>
"You start with $N$ dollars. You flip a coin. Heads, you win $1. Tails, you lose $1. You play until you either reach $T$ (Target) dollars, or go broke ($0). What is the probability you reach $T$ before going broke?"</p>
<br/>
<p><em>Solution via Martingales:</em><br/>
For a fair coin ($p = 0.5$), this is a symmetric random walk. Your expected value over time does not change. Therefore, your expected value at the end of the game must equal your starting capital.<br/>
Let $P_w$ be the probability of reaching the target $T$. The probability of going broke is $(1 - P_w)$.<br/>
$E[\\text{Final Wealth}] = (P_w \\times T) + ((1 - P_w) \\times 0) = N$<br/>
$P_w \\cdot T = N$<br/>
$\\mathbf{P_w = \\frac{N}{T}}$<br/>
If you start with $20 and want to reach $100 before hitting $0, your probability of success is simply $20 / 100 = 20\\%$.</p>`
  },
  {
    title: `7. Modern Portfolio Theory (Mean-Variance)`,
    content: `<p>Quantitative researchers must understand portfolio optimization. Harry Markowitz's Mean-Variance optimization shows how diversifying correctly can increase your expected returns while simultaneously lowering your overall variance (risk).</p>
<br/>
<p><strong>Variance of a 2-Asset Portfolio:</strong><br/>
$\\sigma_p^2 = w_A^2 \\sigma_A^2 + w_B^2 \\sigma_B^2 + 2w_A w_B \\sigma_A \\sigma_B \\rho_{A,B}$</p>
<p>Where:<br/>
$w$ = weight of the asset in the portfolio<br/>
$\\sigma$ = standard deviation (volatility) of the asset<br/>
$\\rho$ = Correlation coefficient between the two assets (ranges from -1 to 1)</p>
<br/>
<p><strong>Interview Intuition:</strong><br/>
If $\\rho = 1$, the assets move identically; there is no diversification benefit. <br/>
If $\\rho = -1$, the assets move in perfect opposite directions. You can weight them to create a portfolio with <strong>zero variance</strong> (a perfect, risk-free hedge). Quant funds aggressively search for uncorrelated signals ($\\rho \\approx 0$) so they can lever up heavily without increasing overall portfolio volatility.</p>`
  }
];
