export const AM_PORTFOLIO_SECTIONS = [
  {
    title: 'Modern Portfolio Theory (MPT)',
    content: `<p>Harry Markowitz's insight (1952): the risk of a portfolio is not simply the weighted average of its individual assets' risks, because assets' returns are imperfectly correlated. By combining assets with low or negative correlations, you can reduce portfolio risk without proportionally reducing expected return. This is the mathematical foundation of diversification.</p>

<p>The <strong>efficient frontier</strong> is the set of portfolios that offer the highest expected return for each level of risk. Any portfolio below the frontier is suboptimal (you could earn higher returns for the same risk, or achieve the same returns with less risk). Rational investors choose portfolios on the efficient frontier, with the specific choice depending on their risk tolerance.</p>

<h4>Key Concepts</h4>

<p><strong>Expected Return:</strong> The probability-weighted average of possible returns. For a portfolio: E(Rp) = Σ wᵢ × E(Rᵢ), where wᵢ is each asset's weight.</p>

<p><strong>Standard Deviation (Volatility):</strong> The most common measure of risk. Measures the dispersion of returns around the mean. A stock with 20% annual volatility will fluctuate in a range of ±20% around its expected return roughly two-thirds of the time.</p>

<p><strong>Correlation:</strong> Ranges from −1 to +1. Measures how two assets' returns move together. A correlation of +1 means they move in perfect lockstep (no diversification benefit). A correlation of 0 means they're independent. A correlation of −1 means they move in opposite directions (maximum diversification benefit).</p>

<p><strong>Sharpe Ratio:</strong> (Portfolio Return − Risk-Free Rate) / Portfolio Volatility. Measures risk-adjusted return. A Sharpe of 1.0 means you're earning 1 unit of excess return per unit of risk. Above 1.0 is generally considered good; above 2.0 is excellent.</p>

<div class="formula-box">
Sharpe Ratio = (Rp − Rf) / σp<br>
<small>Rp = portfolio return, Rf = risk-free rate, σp = portfolio volatility</small>
</div>`,
  },
  {
    title: 'Factor Investing',
    content: `<p>Research has identified several systematic drivers of stock returns beyond just market exposure. These "factors" have been shown to generate excess returns over long periods:</p>

<table class="comparison-table">
<tr><th>Factor</th><th>Definition</th><th>Rationale</th></tr>
<tr><td><strong>Value</strong></td><td>Stocks with low prices relative to fundamentals (P/E, P/B, EV/EBITDA)</td><td>Compensation for distress risk; behavioral overreaction to bad news</td></tr>
<tr><td><strong>Momentum</strong></td><td>Stocks that have performed well recently continue to outperform in the near term</td><td>Behavioral: investors underreact to information, causing trends to persist</td></tr>
<tr><td><strong>Quality</strong></td><td>Stocks with high profitability, low leverage, stable earnings</td><td>Market underprices consistency; quality compounds over time</td></tr>
<tr><td><strong>Size</strong></td><td>Smaller companies outperform larger ones over the long term</td><td>Compensation for illiquidity and information risk</td></tr>
<tr><td><strong>Low Volatility</strong></td><td>Less volatile stocks produce higher risk-adjusted returns</td><td>Behavioral: investors overpay for "lottery ticket" volatile stocks</td></tr>
</table>`,
  },
  {
    title: 'Portfolio Construction in Practice',
    content: `<p><strong>Position sizing:</strong> How much capital to allocate to each position. Considerations include conviction level (higher conviction = larger position), liquidity (less liquid stocks require smaller positions), correlation with existing holdings (adding a highly correlated stock doesn't add diversification), and downside risk (maximum acceptable loss).</p>

<p><strong>Diversification:</strong> A concentrated portfolio of 15-25 stocks can capture most of the diversification benefit while maintaining sufficient conviction in each position. Beyond 30-40 stocks, incremental diversification is minimal and each position becomes too small to meaningfully impact returns.</p>

<p><strong>Benchmark awareness:</strong> Most institutional equity portfolios are measured against a benchmark (S&P 500, MSCI World, Russell 2000). Active decisions are expressed as <strong>overweights</strong> (owning more of a stock or sector than the benchmark) and <strong>underweights</strong> (owning less). The sum of active bets determines <strong>tracking error</strong>-the volatility of the portfolio's return relative to the benchmark.</p>

<p><strong>Rebalancing:</strong> As stock prices change, portfolio weights drift from their targets. Rebalancing involves selling winners (which have become overweight) and buying losers (which have become underweight) to restore target allocations. This is psychologically difficult but mechanistically valuable: it enforces a contrarian discipline of selling high and buying low.</p>`,
  },
];
