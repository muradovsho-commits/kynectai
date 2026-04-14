export const AM_INDUSTRY_LANDSCAPE_SECTIONS = [
  {
    title: 'Passive vs. Active Management',
    content: `<p><strong>Passive management</strong> (index investing) aims to replicate the return of a market index (S&P 500, total bond market) at minimal cost. No stock selection, no market timing-just buy and hold the index. Fees are extremely low (0.03-0.10% for major index funds). The intellectual foundation: markets are generally efficient, so most active managers can't consistently beat the index after fees. This argument, supported by decades of data showing that the majority of active managers underperform their benchmarks, has driven massive flows from active to passive strategies.</p>

<p><strong>Active management</strong> aims to outperform a benchmark through stock selection, sector rotation, market timing, or factor tilts. Fees are higher (0.5-1.5% for mutual funds, 1.5-2.0% plus 15-20% performance fee for hedge funds). The value proposition: a skilled active manager can identify mispricings and generate returns above the benchmark minus fees ("alpha"). The challenge: alpha is a zero-sum game (every dollar of outperformance by one manager comes from underperformance by another), and identifying skilled managers in advance is extremely difficult.</p>`,
  },
  {
    title: 'Fund Vehicle Types',
    content: `<table class="comparison-table">
<tr><th>Vehicle</th><th>Investors</th><th>Liquidity</th><th>Regulation</th><th>Typical Fees</th></tr>
<tr><td><strong>Mutual Fund</strong></td><td>Retail + institutional</td><td>Daily (NAV)</td><td>Heavy (SEC '40 Act)</td><td>0.5-1.5% mgmt</td></tr>
<tr><td><strong>ETF</strong></td><td>Retail + institutional</td><td>Intraday (exchange-traded)</td><td>Heavy (SEC '40 Act)</td><td>0.03-0.75% mgmt</td></tr>
<tr><td><strong>Hedge Fund</strong></td><td>Accredited / institutional</td><td>Monthly/quarterly (lock-ups common)</td><td>Light (SEC '40 Act exempt)</td><td>1.5-2% mgmt + 15-20% perf</td></tr>
<tr><td><strong>Separately Managed Account (SMA)</strong></td><td>Institutional / UHNW</td><td>Daily (direct ownership)</td><td>Varies</td><td>0.3-1.0% mgmt</td></tr>
<tr><td><strong>Closed-End Fund</strong></td><td>Retail + institutional</td><td>Intraday (exchange-traded)</td><td>Moderate</td><td>0.5-2.0% mgmt</td></tr>
</table>`,
  },
  {
    title: 'Hedge Fund Strategies',
    content: `<p><strong>Long/Short Equity:</strong> The most common hedge fund strategy. The fund buys undervalued stocks (long) and short-sells overvalued stocks (short). Net exposure (long minus short) can range from market-neutral (~0%) to net long (50-80%). Returns are generated from stock selection on both sides plus the net market exposure.</p>

<p><strong>Global Macro:</strong> Takes positions in currencies, interest rates, commodities, and equity indices based on macroeconomic views. Top-down rather than bottom-up. Managers like Bridgewater and Soros are associated with this strategy.</p>

<p><strong>Event-Driven:</strong> Profits from specific corporate events: mergers (merger arbitrage), spin-offs, restructurings, bankruptcies, and activist campaigns. Requires deep understanding of legal processes, regulatory approvals, and deal mechanics.</p>

<p><strong>Quantitative / Systematic:</strong> Uses mathematical models and algorithms to identify trading opportunities. Can operate at high frequency (milliseconds) or medium frequency (days to weeks). Firms like Renaissance Technologies, Two Sigma, and DE Shaw. Requires expertise in statistics, machine learning, and software engineering.</p>

<p><strong>Credit / Distressed:</strong> Invests in corporate bonds, bank loans, and other credit instruments. Distressed strategies involve buying the debt of troubled companies at steep discounts and profiting through recovery or restructuring. Requires expertise in bankruptcy law and credit analysis.</p>

<p><strong>Activist:</strong> Acquires significant minority stakes (5-15%) in public companies and pushes for changes to unlock value: board seats, strategic reviews, cost cuts, capital returns, or outright sales. Firms include Elliott Management, ValueAct, and Pershing Square.</p>`,
  },
];
