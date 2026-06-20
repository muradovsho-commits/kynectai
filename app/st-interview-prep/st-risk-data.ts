export const ST_RISK_SECTIONS = [
  {
    title: 'The Kinds of Risk a Desk Faces',
    content: `<p>Risk management is not a back-office afterthought in S&T; it is central to the job. A trader is really a professional risk manager, deciding which risks to take, how much, and how to hedge the rest. Knowing the main categories of risk shows you understand what the job actually involves.</p>

<table class="comparison-table">
<tr><th>Risk type</th><th>What it is</th></tr>
<tr><td>Market risk</td><td>Losses from prices moving against you (the price of stocks, rates, FX, etc.)</td></tr>
<tr><td>Credit risk</td><td>Losses from a counterparty or issuer failing to pay</td></tr>
<tr><td>Liquidity risk</td><td>Being unable to trade out of a position without moving the price badly</td></tr>
<tr><td>Operational risk</td><td>Losses from failed processes, systems, or human error</td></tr>
</table>

<div class="key-concept">For a trading desk, <strong>market risk</strong> is the daily preoccupation: the risk that the prices of the things you hold move against you. But the others matter constantly too. <strong>Liquidity risk</strong> is especially insidious because it shows up exactly when you most need to trade, in a crisis, when everyone heads for the exit and the book thins out, so a position that looked easy to exit becomes impossible to exit without a brutal price. <strong>Credit risk</strong> (will the counterparty pay?) is why clearinghouses and collateral exist. The trader's job is to understand which risks a position carries, take the ones they are paid to take, and hedge or limit the rest. Good traders are defined as much by the risks they avoid as the ones they take.</div>

<div class="takeaway-box">Frame the trader as a risk manager, not a gambler. The job is choosing which risks to hold, sizing them, and hedging the unwanted ones. Market risk is the daily focus, but liquidity risk (the inability to exit, worst in a crisis) is the one that turns manageable losses into disasters, so it is worth naming specifically.</div>`,
  },
  {
    title: 'Measuring Risk: VaR and the Greeks',
    content: `<p>Desks need numbers to quantify risk, set limits, and report it. Two frameworks dominate, and both come up in interviews.</p>

<div class="key-concept"><strong>Value at Risk (VaR)</strong> is the headline portfolio risk number. It answers: "over a given period, with a given confidence, what is the most I am likely to lose?" A one-day 95 percent VaR of 1 million means that on 95 percent of days losses should not exceed 1 million (and on the worst 5 percent of days they could be more). VaR is useful because it compresses a complex portfolio's risk into a single, comparable figure that managers and regulators can track and limit. Its famous weakness is precisely the tail it ignores: VaR tells you the threshold but not how bad the rare worse days get, and those tail events (the 2008-style moves) are where real damage happens. So VaR is a useful summary, not a complete picture, and good risk managers pair it with stress tests and scenario analysis that deliberately probe the extreme cases VaR glosses over.</div>

<div class="key-concept"><strong>The Greeks</strong> (from the options module) are how an options or derivatives desk measures risk position by position. Delta is the exposure to the underlying's direction; gamma is how fast that exposure changes; vega is the exposure to volatility; theta is the exposure to time. A derivatives trader manages the book by watching its aggregate Greeks and hedging them, neutralizing delta to remove directional risk, managing gamma so the hedge does not drift too fast, controlling vega to size the volatility bet. Where VaR is the top-down portfolio summary, the Greeks are the bottom-up, position-level risk measures for anything with optionality. Knowing that VaR is the aggregate dollar-risk number and the Greeks are the granular sensitivities shows you understand both lenses.</div>

<div class="warning-box">Be ready to critique VaR, because thoughtful interviewers ask. Its limitations: it says nothing about how large losses beyond the threshold can be (the tail), it relies on historical data that may not predict future crises, and it can give false comfort precisely before extreme events when correlations break and liquidity vanishes. The mature view is that VaR is a helpful summary that must be supplemented with stress testing and judgment, never trusted blindly.</div>`,
  },
  {
    title: 'Managing the Book and P&L Attribution',
    content: `<p>Day to day, a trader manages a "book" (their portfolio of positions) and is accountable for its profit and loss. Two practices define this: hedging and limits, and understanding where the P&L came from.</p>

<div class="key-concept"><strong>Hedging and risk limits</strong> are the tools of book management. Hedging means taking an offsetting position to neutralize an unwanted risk, a trader who must hold a position to serve a client but does not want its directional risk hedges that risk away, keeping only the exposure they are paid for (often the spread). <strong>Risk limits</strong> are the guardrails desks impose: caps on position size, on VaR, on the Greeks, so no single trader or trade can endanger the firm. These limits are not bureaucratic nuisances; they are how an institution survives the inevitable losing streaks and the occasional rogue position. A trader operates within limits and uses hedging to shape the book down to the risks they actually want.</div>

<div class="key-concept"><strong>P&L attribution</strong> is the discipline of explaining where a day's profit or loss came from, breaking it into its sources. For an options book, for instance, you decompose the P&L into how much came from the underlying moving (delta), from volatility changing (vega), from time passing (theta), and so on. This matters enormously because it tells the trader whether they made money for the reason they intended or by accident, and whether hidden risks are driving results. A trader who "made money" but cannot explain why may be running risks they do not understand. Being able to attribute P&L to its drivers is a sign of a trader who truly understands their book, and the concept (decomposing P&L into its risk sources, often the Greeks) is exactly the kind of thing that impresses in an interview.</div>

<div class="takeaway-box">Tie it together: a trader manages a book by hedging unwanted risks down to the exposures they want, operating within risk limits that protect the firm, and uses P&L attribution to confirm they are making money for the reasons they intended. Explaining P&L by its drivers (delta, vega, theta for an options book) is the mark of someone who genuinely understands risk, not just direction.</div>`,
  },
];
