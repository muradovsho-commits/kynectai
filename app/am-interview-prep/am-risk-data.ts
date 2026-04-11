export const AM_RISK_SECTIONS = [
  {
    title: 'Types of Risk',
    content: `<p><strong>Market risk (systematic):</strong> The risk that the overall market declines. Cannot be diversified away. Measured by Beta. Compensated by the Equity Risk Premium.</p>

<p><strong>Idiosyncratic risk (specific):</strong> Risk specific to an individual company&mdash;a product recall, a management scandal, a competitive disruption. Can be diversified away by holding multiple positions. Not compensated because it can be eliminated.</p>

<p><strong>Liquidity risk:</strong> The risk that you can't sell a position without significantly moving the price. Small-cap stocks, distressed bonds, and private investments all carry liquidity risk. During market crises, liquidity can evaporate even in normally liquid markets.</p>

<p><strong>Concentration risk:</strong> Overexposure to a single stock, sector, geography, or factor. A portfolio with 30% in one stock has extreme concentration risk regardless of how great the stock is.</p>

<p><strong>Tail risk:</strong> The risk of extreme, unexpected events (market crashes, pandemics, sovereign debt crises). Standard risk models assume normally distributed returns, but real-world returns have "fat tails"&mdash;extreme events occur far more frequently than a normal distribution would predict.</p>`,
  },
  {
    title: 'Risk Measurement Tools',
    content: `<p><strong>Value at Risk (VaR):</strong> The maximum expected loss at a given confidence level over a given time period. "95% daily VaR of $2M" means: on 19 out of 20 days, the portfolio will lose no more than $2M. The problem: VaR tells you nothing about what happens on that 20th day&mdash;the loss could be $3M or $30M.</p>

<p><strong>Expected Shortfall (CVaR):</strong> The average loss in the worst X% of scenarios. Addresses VaR's blind spot by quantifying the severity of tail losses.</p>

<p><strong>Stress Testing:</strong> Applying historical crisis scenarios (2008 financial crisis, COVID crash, 1987 Black Monday) or hypothetical scenarios (rates rise 300 bps, oil spikes to $150) to the portfolio to estimate potential losses. More informative than VaR for extreme events.</p>

<p><strong>Drawdown Analysis:</strong> Maximum peak-to-trough decline in portfolio value. Measures the worst historical loss. A fund with a 40% maximum drawdown means that at its worst point, it had lost 40% from its previous high. Recovery time (how long it takes to recover from the drawdown) is equally important.</p>`,
  },
  {
    title: 'Behavioral Finance',
    content: `<p>Behavioral biases are systematic errors in judgment that cause investors to make irrational decisions. Understanding these biases is both a defense (avoid making them yourself) and an offensive weapon (exploit them when other investors fall prey).</p>

<p><strong>Anchoring:</strong> Over-weighting the first piece of information you receive. If you bought a stock at $50, you anchor to that price and struggle to sell at $35 even when the fundamentals justify a lower value.</p>

<p><strong>Confirmation bias:</strong> Seeking information that confirms your existing view and ignoring information that contradicts it. After pitching a stock to your team, you may unconsciously filter for positive news and dismiss negative signals.</p>

<p><strong>Loss aversion:</strong> The pain of a $1,000 loss is psychologically about twice as intense as the pleasure of a $1,000 gain. This causes investors to hold losing positions too long (hoping to "get back to even") and sell winning positions too early (locking in gains before they can be taken away).</p>

<p><strong>Herding:</strong> Following the crowd rather than conducting independent analysis. If every hedge fund owns the same 50 stocks, crowding creates a fragility risk: when one fund is forced to sell (due to redemptions or margin calls), all those stocks decline simultaneously.</p>

<p><strong>Overconfidence:</strong> Overestimating the precision of your forecasts. The antidote: maintain a "mistake journal" documenting past errors, regularly review the assumptions behind your positions, and always ask "What could I be wrong about?"</p>

<p><strong>Recency bias:</strong> Overweighting recent events relative to historical base rates. After a strong bull market, investors extrapolate recent returns into the future and underestimate the probability of a downturn. After a crash, they become excessively pessimistic.</p>`,
  },
];
