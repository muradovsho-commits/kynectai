// Quant Finance Mastery Manual — Module 3 (Statistics) + Module 4 (Math Tools)
export const QUANT_BRAIN_SECTIONS = [
  {
    title: '3.1–3.3 Why Statistics Matters, Population vs Sample, Estimators',
    content: `<h3>3.1 Why Statistics Matters in Quant Finance</h3>
<p>Probability tells you how uncertainty behaves in theory. Statistics tells you how to learn from data in practice.</p>
<p><strong>Quant finance relies on statistics for:</strong> signal discovery, backtesting, estimation of risk and parameters, model validation, hypothesis testing, regime identification.</p>

<h3>3.2 Population vs Sample</h3>
<p><strong>Population:</strong> The full underlying distribution or process.</p>
<p><strong>Sample:</strong> Observed data drawn from that population.</p>
<p><strong>Why this matters:</strong> In markets, you never see the true data-generating process directly. You only see finite, noisy samples. This means estimation error is unavoidable.</p>

<h3>3.3 Estimators</h3>
<p><strong>What an estimator is:</strong> A rule for using data to estimate an unknown parameter. Examples: sample mean estimates expected return, sample variance estimates volatility, OLS estimates regression coefficients.</p>
<p><strong>Good estimator properties:</strong> unbiasedness, consistency, efficiency, robustness.</p>
<p><strong>Interview nuance:</strong> No estimator is universally best. Robustness often matters more than theoretical elegance in messy financial data.</p>`,
  },
  {
    title: '3.4–3.6 Bias-Variance Trade-Off, Hypothesis Testing, Confidence Intervals',
    content: `<h3>3.4 Bias-Variance Trade-Off</h3>
<p>This is one of the most important ideas in quant modeling.</p>
<p><strong>Bias:</strong> Systematic error from oversimplified assumptions.</p>
<p><strong>Variance:</strong> Sensitivity to sample noise.</p>
<p><strong>Trade-off:</strong> A very flexible model may fit noise and have low bias but high variance. A simpler model may have more bias but generalize better.</p>
<p><strong>Why it matters in finance:</strong> Overfitting is one of the most common ways quant strategies fail.</p>

<h3>3.5 Hypothesis Testing</h3>
<p><strong>Core idea:</strong> You formulate a null hypothesis and ask whether the data are sufficiently inconsistent with it.</p>
<p><strong>Terms to know:</strong> null hypothesis, alternative hypothesis, p-value, type I error, type II error, power, significance level.</p>
<p><strong>Finance caution:</strong> Statistical significance is not the same as economic significance. A tiny but statistically significant alpha may be untradable after costs.</p>

<h3>3.6 Confidence Intervals</h3>
<p>A confidence interval gives a range for plausible parameter values under repeated sampling logic.</p>
<p><strong>Why it matters:</strong> Point estimates in finance are often much less precise than they appear. Confidence intervals force humility.</p>`,
  },
  {
    title: '3.7–3.8 Regression, Time Series Basics',
    content: `<h3>3.7 Regression</h3>
<p>Regression is one of the most tested and used tools in quant finance.</p>
<p><strong>Simple linear regression:</strong> Y = α + β X + ε</p>
<p><strong>Interpretation:</strong> α: intercept. β: sensitivity of Y to X. ε: residual noise.</p>
<p><strong>Uses in finance:</strong> factor exposures, hedge ratios, signal testing, explanatory models, pairs relationships.</p>
<p><strong>OLS intuition:</strong> OLS finds the line minimizing sum of squared residuals.</p>
<p><strong>Important assumptions and caveats:</strong> omitted variable bias, heteroskedasticity, autocorrelation, non-stationarity, multicollinearity, unstable relationships over time.</p>

<h3>3.8 Time Series Basics</h3>
<p>Financial data are often indexed by time and exhibit dependencies not present in IID samples.</p>
<p><strong>Common concepts:</strong> stationarity, autocorrelation, seasonality, mean reversion, trend, regime shifts, volatility clustering.</p>
<p><strong>Why it matters:</strong> Many models fail because they assume stable relationships in unstable time series.</p>`,
  },
  {
    title: '3.9–3.11 Overfitting/Backtest Bias, Resampling, Sharpe Ratio + Module 3 Practice',
    content: `<h3>3.9 Overfitting and Backtest Bias</h3>
<p><strong>Overfitting:</strong> A model performs well in-sample because it captured noise rather than signal.</p>
<p><strong>Common backtesting traps:</strong> look-ahead bias, survivorship bias, data snooping, regime overfitting, multiple testing without correction, unrealistic transaction cost assumptions.</p>
<p><strong>Strong candidate behavior:</strong> Whenever discussing a strategy, mention out-of-sample validation and implementation realism.</p>

<h3>3.10 Resampling and Cross-Validation</h3>
<p>These are tools for estimating generalization performance.</p>
<p><strong>Why they matter:</strong> Good in machine learning and research pipelines, though time-series-aware validation is crucial.</p>
<p><strong>Caveat in finance:</strong> Random shuffling may destroy time structure. Rolling or walk-forward validation is often more appropriate.</p>

<h3>3.11 Sharpe Ratio and Performance Statistics</h3>
<p><strong>Sharpe Ratio:</strong> Sharpe = (expected return - risk-free rate) / volatility</p>
<p><strong>Why it matters:</strong> It measures return per unit of volatility.</p>
<p><strong>Caveats:</strong> assumes volatility is a reasonable risk metric, can be inflated by smoothing or short-vol strategies, does not capture tail risk well.</p>
<p><strong>Other useful metrics:</strong> Sortino ratio, max drawdown, hit rate, profit factor, turnover, information ratio, alpha t-stat.</p>

<h3>Module 3 Practice Drills</h3>
<p><strong>Technical drills:</strong> Explain bias-variance trade-off. Explain why statistical significance is not enough. Explain what stationarity means. Explain why random CV can fail in time series. Explain overfitting in a trading context.</p>
<p><strong>Interview-style questions:</strong> How would you validate a trading signal? What are common backtest biases? What does beta mean in a regression? Why can a high Sharpe strategy still be dangerous?</p>
<p><strong>Self-testing checklist:</strong> Did I separate in-sample from out-of-sample? Did I think about implementation costs? Did I confuse explanatory power with predictive power? Did I state whether assumptions are likely stable over time?</p>`,
  },
  {
    title: '4.1–4.4 Why Math Tools Matter, Vectors/Matrices, Eigenvalues/PCA, Differentiation',
    content: `<h3>4.1 Why These Tools Matter</h3>
<p>Quant finance is built on mathematical structure. Linear algebra is essential for factor models, covariance matrices, regression, PCA, and optimization. Calculus is essential for sensitivities, continuous-time models, and PDE reasoning. Optimization is essential for portfolios, execution, calibration, and learning algorithms.</p>

<h3>4.2 Vectors and Matrices</h3>
<p><strong>Why they matter:</strong> Financial systems are rarely one-dimensional. You often deal with: portfolios of many assets, covariance matrices, factor loadings, return vectors.</p>
<p><strong>Key concepts:</strong> vector norms, dot product, matrix multiplication, transpose, inverse, rank, eigenvalues and eigenvectors.</p>
<p><strong>Finance intuition:</strong> Portfolio variance can be written compactly as: w' Σ w, where w is the weight vector and Σ is the covariance matrix.</p>

<h3>4.3 Eigenvalues, Eigenvectors, and PCA</h3>
<p><strong>Why they matter:</strong> PCA finds dominant directions of variation.</p>
<p><strong>Uses in finance:</strong> yield curve factor decomposition, risk factor identification, dimensionality reduction, statistical arbitrage research.</p>
<p><strong>Intuition:</strong> Eigenvectors identify directions; eigenvalues measure the amount of variance along those directions.</p>

<h3>4.4 Differentiation</h3>
<p><strong>Why it matters:</strong> Many quant problems involve sensitivities. Examples: option Greeks, gradient-based optimization, maximizing likelihood, minimizing loss functions.</p>
<p><strong>Interview expectation:</strong> You should be comfortable with chain rule, partial derivatives, and basic multivariable calculus.</p>`,
  },
  {
    title: '4.5–4.8 Integration, Constrained Optimization, Convexity, Numerical Optimization + Module 4 Practice',
    content: `<h3>4.5 Integration</h3>
<p><strong>Why it matters:</strong> Integration appears in: expectation calculations, continuous distributions, pricing formulas, density and cumulative functions.</p>

<h3>4.6 Constrained Optimization</h3>
<p><strong>Why it matters:</strong> Many finance problems involve maximizing or minimizing an objective subject to constraints. Examples: maximize return for a risk level, minimize variance subject to full investment, optimize execution schedule under impact constraints.</p>
<p><strong>Lagrange multipliers:</strong> A core tool for constrained optimization. They let you solve "best possible solution under a resource or rule constraint."</p>

<h3>4.7 Convexity</h3>
<p><strong>Why quants care:</strong> Convex optimization is easier and more stable. Many good portfolio problems are designed to be convex.</p>
<p><strong>Finance meanings of convexity — Be careful:</strong> "convexity" can mean: mathematical curvature in optimization, bond convexity in fixed income. Context matters.</p>

<h3>4.8 Numerical Optimization</h3>
<p>In real systems, closed forms often do not exist. Quants use numerical methods such as: gradient descent, Newton methods, coordinate descent, quadratic programming, stochastic gradient methods.</p>
<p><strong>Important caveat:</strong> Optimization can be unstable if the objective is poorly conditioned or the inputs are noisy.</p>

<h3>Module 4 Practice Drills</h3>
<p><strong>Technical drills:</strong> Explain why covariance matrices matter in portfolio construction. Explain PCA intuition without jargon. Explain Lagrange multipliers in plain English. Explain why optimization can be dangerous with noisy inputs.</p>
<p><strong>Interview-style questions:</strong> How do eigenvalues relate to risk decomposition? What does gradient mean in optimization? Why might mean-variance optimization produce fragile portfolios?</p>`,
  },
];
