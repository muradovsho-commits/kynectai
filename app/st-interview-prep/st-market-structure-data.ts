export const ST_MARKET_STRUCTURE_SECTIONS = [
  {
    title: 'Exchange-Traded vs. Over-the-Counter (OTC)',
    content: `<p><strong>Exchange-traded</strong> instruments (stocks, listed options, futures) trade on centralized exchanges (NYSE, Nasdaq, CME, ICE) with standardized contracts, transparent pricing, and a central clearinghouse that eliminates counterparty risk. Execution is electronic and highly automated.</p>

<p><strong>OTC</strong> instruments (corporate bonds, interest rate swaps, FX forwards, CDS, most structured products) trade bilaterally between counterparties, typically via phone or electronic messaging platforms. There's no central exchange; the bank <em>is</em> the market. OTC markets are less transparent (prices aren't publicly quoted in real-time), less liquid (you may need to call 5 dealers to find a buyer), and carry counterparty risk (if your trading partner defaults, you may not get paid). Post-2008 regulations (Dodd-Frank) have pushed many OTC derivatives toward central clearing and electronic execution, but significant portions remain bilateral.</p>`,
  },
  {
    title: 'Order Types',
    content: `<p><strong>Market order:</strong> Execute immediately at the best available price. Guarantees execution but not price. Used when speed is more important than price precision.</p>

<p><strong>Limit order:</strong> Execute only at a specified price or better. Guarantees price but not execution (you might not get filled). Used when price discipline matters.</p>

<p><strong>Stop order (stop-loss):</strong> Becomes a market order when the price hits a specified level. Used to limit losses on existing positions. A trader long a stock at $50 might place a stop at $47 to cap the downside at $3 per share.</p>

<p><strong>VWAP (Volume-Weighted Average Price):</strong> An algorithmic execution strategy that spreads a large order throughout the day, aiming to achieve the average price weighted by volume. Institutional clients use VWAP to minimize market impact on large orders.</p>

<p><strong>TWAP (Time-Weighted Average Price):</strong> Similar to VWAP but spreads the order evenly over time regardless of volume patterns.</p>`,
  },
  {
    title: 'Liquidity',
    content: `<p>Liquidity is the ability to buy or sell an asset quickly without significantly moving the price. It's the lifeblood of trading. Liquid markets have tight bid-ask spreads, deep order books (large quantities available at each price level), and high trading volume. Illiquid markets have wide spreads, thin order books, and low volume.</p>

<p>Liquidity is not constant&mdash;it varies by time of day (thinnest at market open and close), market conditions (evaporates during crises), and instrument type (a US Treasury is infinitely more liquid than a small-cap corporate bond). Traders must constantly assess liquidity because it determines how quickly they can exit a position and at what cost.</p>`,
  },
  {
    title: 'Clearing and Settlement',
    content: `<p>After a trade is executed, it must be <strong>cleared</strong> (confirmed by both parties, matched, and risk-managed by a clearinghouse) and <strong>settled</strong> (the actual exchange of securities and cash). US equities settle T+1 (one business day after the trade). US Treasuries settle T+1. Most OTC derivatives settle T+2. Understanding the settlement cycle matters because between trade and settlement, there's counterparty risk.</p>`,
  },
];
