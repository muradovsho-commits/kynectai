export const ST_DERIVATIVES_SECTIONS = [
  {
    title: 'Options Fundamentals',
    content: `<p>An option is a contract giving the holder the right, but not the obligation, to buy or sell an underlying asset at a set price (the strike) by a set date (expiration). That asymmetry, a right without an obligation, is what makes options powerful and is the source of everything interesting about them.</p>

<div class="framework-box"><div class="fw-label">THE TWO BUILDING BLOCKS</div><strong>Call option:</strong> the right to <em>buy</em> the underlying at the strike. You buy a call when you expect the price to rise. Your loss is capped at the premium you paid; your upside grows as the price climbs above the strike.<br/><strong>Put option:</strong> the right to <em>sell</em> the underlying at the strike. You buy a put when you expect the price to fall, or to protect (hedge) something you own. Again your loss is capped at the premium; your gain grows as the price falls below the strike.</div>

<p>The price you pay for an option is the <strong>premium</strong>. The buyer of an option has limited risk (the premium) and potentially large reward. The <strong>seller (writer)</strong> of an option is on the other side: they collect the premium upfront, but take on the obligation if the buyer exercises, which means limited reward (the premium) and potentially large risk. This asymmetry between buyer and seller is central to how options desks think about risk.</p>

<div class="key-concept"><strong>Moneyness</strong> describes where the option stands relative to the current price. A call is <strong>in-the-money</strong> if the price is above the strike (exercising would profit), <strong>at-the-money</strong> if price equals strike, and <strong>out-of-the-money</strong> if price is below strike. An option's premium splits into two parts: <strong>intrinsic value</strong> (how far in-the-money it is right now) and <strong>time value</strong> (the extra worth from the chance it moves further in-the-money before expiration). Time value erodes as expiration approaches, an effect that becomes the Greek called theta. Holding these two components apart, intrinsic plus time value, is the key to understanding why options are priced as they are.</div>

<div class="example-box">
<div class="example-label">A call, concretely</div>
<p>A stock trades at 100. You buy a call with a 100 strike for a 5 premium. If the stock rises to 120, your call is worth at least 20 (intrinsic value), so you profit 15 (20 minus the 5 premium). If the stock stays at or below 100, the call expires worthless and you lose only the 5 premium. Limited downside (5), large upside (grows with the stock): that is the asymmetry you paid for.</p>
</div>`,
  },
  {
    title: 'The Greeks: Measuring Option Risk',
    content: `<p>The Greeks are the heart of options trading. They measure how an option's price responds to the things that move it, and an options trader manages a book by managing its Greeks. They sound technical but each has a clean, intuitive meaning. Take them one at a time.</p>

<table class="comparison-table">
<tr><th>Greek</th><th>Measures sensitivity to</th><th>Plain meaning</th></tr>
<tr><td>Delta</td><td>The underlying price</td><td>How much the option moves per 1 move in the underlying</td></tr>
<tr><td>Gamma</td><td>The change in delta</td><td>How fast delta itself changes as the underlying moves</td></tr>
<tr><td>Theta</td><td>The passage of time</td><td>How much value the option loses each day (time decay)</td></tr>
<tr><td>Vega</td><td>Volatility</td><td>How much the option moves when expected volatility changes</td></tr>
<tr><td>Rho</td><td>Interest rates</td><td>How much the option moves when rates change (usually minor)</td></tr>
</table>

<div class="key-concept"><strong>Delta</strong> is the most important. It tells you how much the option's price changes for a 1 unit change in the underlying, and it ranges from 0 to 1 for calls (0 to -1 for puts). A delta of 0.5 means the option gains 0.50 if the underlying rises 1. Delta also doubles as a rough probability of finishing in-the-money and tells you the option's equivalent position in the underlying, which is how traders <strong>hedge</strong>: an option with 0.5 delta behaves like half a share, so to neutralize it you trade half a share the other way. This is <strong>delta hedging</strong>, and it is the foundational risk-management move on an options desk.</div>

<div class="key-concept"><strong>Gamma</strong> is the catch that makes delta hedging hard, and it is a favorite interview probe. Delta is not constant; it changes as the underlying moves, and gamma measures how fast. High gamma means delta shifts quickly, so a hedge that was correct a moment ago becomes wrong as the price moves, forcing the trader to constantly re-hedge. Gamma is highest for at-the-money options near expiration. The intuition: gamma is the "acceleration" to delta's "speed." A trader who is long gamma benefits from big moves in either direction (their position gets more right as it moves); a trader short gamma is hurt by big moves and must chase the market to re-hedge, which is exactly when losses pile up.</div>

<div class="key-concept"><strong>Theta and vega</strong> round out the core. <strong>Theta</strong> is time decay: options lose value as expiration nears, all else equal, because there is less time for a favorable move. An option buyer fights theta (it works against them daily); an option seller earns it. <strong>Vega</strong> is sensitivity to volatility: options are worth more when expected volatility is higher, because a wilder underlying is more likely to swing the option deep in-the-money. Vega is why options trading is often really <strong>volatility trading</strong>, you are taking a view on how much the underlying will move, not only which direction.</div>

<div class="takeaway-box">A clean way to recite the Greeks: delta is direction (and your hedge ratio), gamma is how fast delta changes (the re-hedging problem), theta is time decay (sellers earn it, buyers pay it), vega is volatility sensitivity (options are really vol bets). If you can explain delta hedging and why gamma makes it hard, you are ahead of most candidates.</div>`,
  },
  {
    title: 'Volatility and Put-Call Parity',
    content: `<p>Two deeper ideas separate strong options candidates from the rest: that options are fundamentally about volatility, and the elegant relationship that links puts and calls.</p>

<div class="key-concept"><strong>Implied volatility</strong> is the market's expectation of how much the underlying will move, backed out from the option's price. Because volatility is the one input to an option's value that is not directly observable (unlike price, strike, time, and rates), the market's view of it is embedded in the premium, and traders quote and think about options in terms of implied vol rather than dollar price. When traders say an option is "expensive," they usually mean its implied volatility is high. A huge part of options trading is taking views on volatility: buying options when you think actual movement will exceed what is implied, selling them when you think the reverse. This is why the options business is often called the volatility business.</div>

<div class="key-concept"><strong>Put-call parity</strong> is a fundamental no-arbitrage relationship linking the price of a call and a put with the same strike and expiration. Intuitively, owning a call and selling a put at the same strike replicates owning the underlying (you gain when it rises via the call, and you are on the hook when it falls via the short put, just like holding the asset). This forces a fixed relationship between call prices, put prices, the underlying, and the strike; if it is violated, arbitrageurs can lock in a riskless profit, which keeps the relationship intact. You do not need the exact formula at your fingertips for most interviews, but you should understand the idea: calls, puts, and the underlying are linked, so you can synthesize one from the others, and that linkage prevents free money.</div>

<div class="formula-box">Put-Call Parity (intuition):<br/>Call - Put = Underlying - Strike (in present-value terms)<br/><br/>Rearranged: owning a call and selling a put<br/>= a synthetic long position in the underlying</div>

<div class="takeaway-box">If asked why options prices behave as they do, reach for volatility: an option is a bet on movement, so more expected movement (higher implied vol) means a higher premium. And if asked about put-call parity, give the intuition, calls and puts and the underlying are linked by no-arbitrage, so you can build a synthetic stock from options, rather than reciting a formula.</div>`,
  },
  {
    title: 'Common Option Strategies',
    content: `<p>Traders rarely hold a single naked option; they combine them into strategies with specific risk-reward shapes. Knowing a handful by name and purpose shows real fluency.</p>

<table class="comparison-table">
<tr><th>Strategy</th><th>Construction</th><th>Purpose / view</th></tr>
<tr><td>Covered call</td><td>Own the stock, sell a call against it</td><td>Earn income; mildly bullish to neutral; caps upside</td></tr>
<tr><td>Protective put</td><td>Own the stock, buy a put</td><td>Insurance against a fall; like buying downside protection</td></tr>
<tr><td>Straddle</td><td>Buy a call and a put at the same strike</td><td>Bet on a big move either direction (long volatility)</td></tr>
<tr><td>Strangle</td><td>Buy an out-of-the-money call and put</td><td>Cheaper bet on a big move; needs a larger move to pay off</td></tr>
<tr><td>Spread (vertical)</td><td>Buy one option, sell another at a different strike</td><td>Define risk and reward; cheaper directional bet</td></tr>
</table>

<div class="key-concept">The strategies divide by what view they express. <strong>Covered calls and protective puts</strong> are about managing a stock position you already hold, generating income or buying insurance. <strong>Straddles and strangles</strong> are pure volatility plays: you do not care which way the price goes, only that it moves a lot (long straddle) or stays put (if you sell one). <strong>Spreads</strong> are about defining and cheapening a directional bet by giving up some upside to reduce the cost. The unifying insight: options let you construct almost any risk-reward shape you want, betting on direction, on volatility, on time, or on staying in a range, which is exactly why they are such a flexible and heavily traded tool.</div>

<div class="takeaway-box">A favorite interview question is "how would you bet on a big move without knowing the direction?" The answer is a straddle (or strangle): buy both a call and a put, so you profit from a large swing either way, with your loss capped at the premiums if the price sits still. Being able to map a market view to an option structure is the skill being tested.</div>`,
  },
];
