export const ST_INTERVIEW_SECTIONS = [
  {
    title: 'The S&T Interview Format',
    content: `<p>S&T interviews differ from other finance interviews in a few characteristic ways, and knowing the shape lets you prepare the right things rather than over-indexing on modeling that will not appear.</p>

<div class="framework-box"><div class="fw-label">WHAT TO EXPECT ACROSS ROUNDS</div><strong>Mental math:</strong> rapid-fire or timed arithmetic, sometimes under deliberate pressure. Almost universal.<br/><strong>Brainteasers and probability/EV:</strong> logic puzzles, estimation, and expected-value games testing how you think.<br/><strong>Markets and "have a view":</strong> what's moving markets, a stock or trade you like, where you think something is headed and why.<br/><strong>Product and technical knowledge:</strong> how options work, the Greeks, why bond prices and yields move inversely, what a swap is, how market-making makes money.<br/><strong>Behavioral and fit:</strong> why S&T, sales or trading, a time you were wrong, how you handle pressure.<br/><strong>Composure under pressure:</strong> woven throughout, often tested deliberately.</div>

<div class="key-concept">The defining feature of S&T interviews is that they test <strong>live thinking and temperament far more than prepared knowledge</strong>. Other finance interviews reward memorized technicals and polished stories; S&T rewards those too, but it overwhelmingly cares how you reason in real time, handle pressure, do quick math, and engage with markets. This is why you cannot cram your way through: mental math takes weeks of drilling, market views take consistent following, and composure shows or does not. The flip side is encouraging, the most-tested skills (mental math, the EV/brainteaser approach, market engagement) are all genuinely learnable with focused, consistent practice, so a candidate who prepares the right way can dramatically improve.</div>

<div class="takeaway-box">Prepare for the actual format: drill mental math out loud and timed; practice brainteasers and EV problems by method; follow markets daily and develop a couple of defensible views; know the core products and the Greeks cold; and prepare behavioral stories that show composure and comfort with being wrong. Do not over-prepare modeling, it is not the S&T test.</div>`,
  },
  {
    title: 'Technical Questions With Model Answers',
    content: `<div class="interview-q">
<div class="q-label">Q1</div>
<div class="question">Why do bond prices and yields move in opposite directions?</div>
<div class="answer">A bond's coupon is fixed at issuance. If market rates rise, newer bonds pay more, so an existing lower-coupon bond becomes less attractive and its price must fall until its effective yield matches the higher market rate. If rates fall, the existing bond is relatively attractive and its price rises until its yield drops to market. The coupon cannot change, so the price moves inversely to yields to keep the bond competitive.</div>
</div>

<div class="interview-q">
<div class="q-label">Q2</div>
<div class="question">What is delta, and how would you hedge an option with it?</div>
<div class="answer">Delta is how much an option's price changes for a 1 unit move in the underlying, ranging 0 to 1 for calls. It also tells you the option's equivalent position in the underlying. To hedge, you take an offsetting position in the underlying equal to the delta: an option with 0.5 delta behaves like half a share, so you trade half a share the other way to neutralize the directional risk. That's delta hedging. The complication is gamma, delta changes as the underlying moves, so you must re-hedge continuously.</div>
</div>

<div class="interview-q">
<div class="q-label">Q3</div>
<div class="question">How does a market maker make money?</div>
<div class="answer">By quoting both a bid and an ask and earning the spread on two-way client flow, while staying roughly market-neutral. The maker buys at the bid, sells at the ask, and pockets the difference over many trades, without needing the price to move. The risks are inventory risk (holding a position before it can be offset) and adverse selection (trading with better-informed counterparties), which is why spreads widen in uncertain or fast markets. It's a volume-and-spread business, not a directional bet.</div>
</div>

<div class="interview-q">
<div class="q-label">Q4</div>
<div class="question">What's the difference between a forward/future and an option?</div>
<div class="answer">A forward or future is an obligation, both parties must transact at the agreed price on the future date. An option is a right without an obligation, the holder can choose not to exercise. So an option buyer has limited downside (the premium) and asymmetric upside, while a futures position has symmetric, two-way exposure. A future is also exchange-traded, standardized, and marked-to-market daily, whereas a forward is a customizable OTC contract.</div>
</div>

<div class="interview-q">
<div class="q-label">Q5</div>
<div class="question">What does duration measure?</div>
<div class="answer">Duration measures a bond's price sensitivity to interest rate changes, approximately the percentage price change for a 1 percent change in yield. A duration of 7 means the price falls about 7 percent if rates rise 1 percent. It rises with maturity and falls with higher coupons, and it's how rates traders measure and hedge interest rate risk. Convexity is the refinement that corrects for the curvature in the price-yield relationship, and it works in the bondholder's favor.</div>
</div>

<div class="interview-q">
<div class="q-label">Q6</div>
<div class="question">What is a credit default swap?</div>
<div class="answer">It's insurance against a borrower defaulting. The protection buyer pays a regular premium; if the underlying borrower defaults, the seller pays out to cover the loss. It lets you hedge the credit risk of a bond you own, or take a view on a borrower's creditworthiness without owning its bonds. The premium is a direct market read on default risk, it rises as the borrower looks shakier.</div>
</div>`,
  },
  {
    title: 'Math, Probability, and Brainteaser Questions',
    content: `<div class="interview-q">
<div class="q-label">Q7</div>
<div class="question">Quick: what's 17 x 24?</div>
<div class="answer">408. Method out loud: 17 x 24 = 17 x 25 minus 17 = 425 minus 17 = 408. Or (17 x 20) + (17 x 4) = 340 + 68 = 408. Always narrate the method, not just the number.</div>
</div>

<div class="interview-q">
<div class="q-label">Q8</div>
<div class="question">I flip a fair coin: heads you win 2, tails you lose 1. Do you play, and what would you pay?</div>
<div class="answer">EV = (2 x 0.5) + (-1 x 0.5) = 1 minus 0.5 = +0.5. Positive EV, so yes, I'd play, and repeatedly. I'd pay up to 0.50 to play, that's the breakeven; below it I have positive expected profit.</div>
</div>

<div class="interview-q">
<div class="q-label">Q9</div>
<div class="question">Roll two dice. What's the probability of at least one six?</div>
<div class="answer">Use the complement. Chance of no six on one die is 5/6; on both is 5/6 x 5/6 = 25/36. So at least one six is 1 minus 25/36 = 11/36, about 31 percent. For any "at least one" question, flipping to 1 minus the chance of none is the clean approach.</div>
</div>

<div class="interview-q">
<div class="q-label">Q10</div>
<div class="question">How many gas stations are in the US?</div>
<div class="answer">Build it from blocks, stating assumptions. Population about 330 million; roughly 1 car per 2 people, so ~165 million cars. Suppose one station serves on the order of 1,000-1,500 cars. That gives very roughly 110,000-165,000 stations. I'd state my assumptions clearly and aim for the right order of magnitude; the actual figure is around 150,000, but the structure and reasonable assumptions are what matter.</div>
</div>

<div class="interview-q">
<div class="q-label">Q11</div>
<div class="question">Eight balls, one heavier. Find it in two weighings on a balance scale.</div>
<div class="answer">Split into 3, 3, 2. Weigh the two 3s against each other. If they balance, the heavy one is in the leftover 2, weigh those two to find it. If one 3 is heavier, take those 3 and weigh 1 versus 1; if they balance it's the third ball, otherwise it's the heavier pan. Two weighings. The insight is that each weighing has three outcomes, so it sorts into thirds.</div>
</div>

<div class="interview-q">
<div class="q-label">Q12</div>
<div class="question">A die is rolled and you're paid the number shown. What would you pay to play?</div>
<div class="answer">EV is the average of 1 through 6, which is 3.5. So I'd pay up to 3.50. If you let me re-roll once if I don't like the first roll, the EV rises (I'd re-roll anything below 3.5), so the fair price goes up, I can recompute that if you'd like.</div>
</div>`,
  },
  {
    title: 'Common Mistakes',
    content: `<div class="warning-box"><strong>Going silent on a brainteaser or math question.</strong> The interviewer is grading your reasoning, which they cannot see if you think in silence. Always work out loud, even when unsure. Narrated reasoning is the deliverable.</div>

<div class="warning-box"><strong>Cracking under pressure or abandoning a correct answer when challenged.</strong> Interviewers push back deliberately, sometimes on right answers, to test composure. Calmly re-examine and defend sound reasoning; do not panic-reverse just because you were questioned.</div>

<div class="warning-box"><strong>Not actually following markets.</strong> "What's moving markets?" or "a stock you like" instantly exposes candidates who don't engage with markets. This cannot be crammed; start following daily well in advance and develop real, defensible views.</div>

<div class="warning-box"><strong>Pitching a trade idea with no risk or catalyst.</strong> "I like this stock, it'll go up" signals you don't think like a trader. Always include the thesis, the catalyst, how you'd express it, and especially the risk and what would prove you wrong.</div>

<div class="warning-box"><strong>Confusing market-making with proprietary betting.</strong> Modern bank desks overwhelmingly make markets and serve client flow; they are not prop desks betting the firm's capital (regulation curtailed that). Describe trading as making prices and managing risk and flow, not "betting on the market."</div>

<div class="warning-box"><strong>Quoting only the answer to math, not the method.</strong> Even when you get it right, narrate how you broke it down. Speed without visible method looks like luck; method shows a transferable skill.</div>

<div class="warning-box"><strong>Giving a generic "why S&T."</strong> "I like fast-paced environments" is what everyone says. Be specific: real-time decisions, genuine markets fascination with evidence, comfort with risk, and a justified sales-or-trading choice rooted in your temperament.</div>

<div class="warning-box"><strong>Bluffing about something you don't know.</strong> On the floor, intellectual honesty is everything. If you don't know a market or a concept, say so and reason from principles; pretending is far more damaging than admitting a gap.</div>`,
  },
  {
    title: 'Glossary',
    content: `<p><strong>Adverse selection:</strong> The risk that the counterparty trading with a market maker is better informed, accumulating bad inventory just before prices move.</p>
<p><strong>Ask (offer):</strong> The lowest price a seller will accept; the price you pay to buy immediately.</p>
<p><strong>Backwardation:</strong> A futures curve sloping down (later delivery cheaper), often signaling tight current supply.</p>
<p><strong>Bid:</strong> The highest price a buyer will pay; the price you receive selling immediately.</p>
<p><strong>Bid-ask spread:</strong> The gap between bid and ask; the price of liquidity and the market maker's edge.</p>
<p><strong>Carry trade:</strong> Borrowing a low-yield currency to invest in a high-yield one, earning the rate difference; prone to sharp reversals.</p>
<p><strong>CDS (credit default swap):</strong> Insurance against a borrower defaulting; premium reflects default risk.</p>
<p><strong>Contango:</strong> A futures curve sloping up (later delivery pricier), reflecting storage and financing costs.</p>
<p><strong>Convexity:</strong> The curvature in the bond price-yield relationship; refines duration and favors the holder.</p>
<p><strong>Delta:</strong> An option's price sensitivity to the underlying; also the hedge ratio and rough probability of finishing in-the-money.</p>
<p><strong>Duration:</strong> A bond's price sensitivity to rates; roughly the percent price change per 1 percent yield change.</p>
<p><strong>Expected value (EV):</strong> The probability-weighted average outcome; the core decision lens for traders.</p>
<p><strong>Gamma:</strong> How fast delta changes as the underlying moves; high gamma forces constant re-hedging.</p>
<p><strong>Implied volatility:</strong> The market's expected volatility backed out of an option's price; how options are really quoted.</p>
<p><strong>Liquidity:</strong> How easily you can trade size without moving the price; what S&T desks provide.</p>
<p><strong>Market maker:</strong> A desk that quotes both sides and earns the spread on flow while staying roughly neutral.</p>
<p><strong>Market order / limit order:</strong> Execute now at the best price (taker) / execute only at a set price or better (often a provider).</p>
<p><strong>OTC (over-the-counter):</strong> Trading directly between two parties, dealer to client, customizable; vs exchange-traded.</p>
<p><strong>Pairs trade:</strong> Long one security, short a related one, betting on their relative move; largely market-neutral.</p>
<p><strong>Premium:</strong> The price paid for an option; splits into intrinsic value and time value.</p>
<p><strong>Put-call parity:</strong> The no-arbitrage link between calls, puts, the underlying, and the strike.</p>
<p><strong>Repo:</strong> Short-term borrowing collateralized by securities; the financing market under the bond world.</p>
<p><strong>Roll yield:</strong> The gain or drag from rolling futures forward, set by the curve shape (contango vs backwardation).</p>
<p><strong>Short selling:</strong> Borrowing and selling a security to profit from a price fall; downside is theoretically unlimited.</p>
<p><strong>Swap:</strong> An exchange of cash flows (e.g. fixed for floating interest) on a notional; the largest derivatives market.</p>
<p><strong>Theta:</strong> An option's time decay; sellers earn it, buyers pay it.</p>
<p><strong>VaR (value at risk):</strong> The estimated maximum loss over a period at a confidence level; a risk summary that ignores the tail.</p>
<p><strong>Vega:</strong> An option's sensitivity to volatility; why options trading is largely volatility trading.</p>
<p><strong>Yield curve:</strong> Yield plotted against maturity; its shape (normal, flat, inverted) encodes market expectations.</p>`,
  },
];
