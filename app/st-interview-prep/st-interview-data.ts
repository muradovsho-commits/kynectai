export const ST_INTERVIEW_SECTIONS = [
  {
    title: 'The S&amp;T Interview Format',
    content: `<p>S&amp;T interviews are fundamentally different from banking interviews. There's less emphasis on polished answers and more emphasis on <strong>how you think on your feet</strong>. Expect a mix of: market questions (What's the S&P at? Where is the 10-year? What happened in markets today?), product knowledge (Explain how an interest rate swap works. What's put-call parity?), brainteasers and mental math, trading scenarios (I give you a trade idea&mdash;would you put it on? What's the risk?), and behavioral/fit (Why S&amp;T? Why this desk? What do you read?). Interviews are typically 20&ndash;30 minutes each, and you may have 4&ndash;8 in a single day.</p>`,
  },
  {
    title: 'Market Knowledge: What You Must Know',
    content: `<p>Before every interview, you must know the current levels of: S&P 500, Dow, Nasdaq, 2-year and 10-year Treasury yields (and the spread between them), Fed Funds rate, EUR/USD, USD/JPY, crude oil (WTI and Brent), gold, VIX, and any major market-moving news from the past week. You should also have a view on where markets are heading and be able to defend it.</p>

<div class="interview-q">
<div class="q-label">Q1</div>
<div class="question">Where is the 10-year Treasury right now, and where do you think it's going?</div>
<div class="answer">You must know the current yield to the nearest 10 basis points. Then give a directional view with reasoning: "The 10-year is at approximately X%. I think it moves [higher/lower] over the next 3&ndash;6 months because [specific macro reasoning: e.g., 'inflation is proving stickier than expected and I think the Fed holds rates higher for longer' or 'growth is decelerating and the market will start pricing in rate cuts']. The key risk to my view is [specific counterargument: e.g., 'if a geopolitical event causes a flight to safety, rates could fall sharply regardless of inflation']." The specific view matters less than having one and defending it logically.</div>
</div>

<div class="interview-q">
<div class="q-label">Q2</div>
<div class="question">Pitch me a trade.</div>
<div class="answer">This is the S&T equivalent of the stock pitch. Structure: (1) The macro or micro thesis (e.g., "I believe the yield curve will steepen because the Fed will start cutting short rates while long rates stay elevated due to fiscal deficits and term premium"). (2) The instrument (e.g., "I'd express this by going long 2-year Treasury futures and short 10-year Treasury futures, duration-weighted"). (3) The risk/reward (e.g., "The 2s10s spread is at -30 bps, well below historical norms. I think it moves to +50 bps over 6 months. The risk is that a recession causes the entire curve to rally, but in that scenario the steepener still benefits because the front end rallies more than the long end"). (4) The key risk and how you'd manage it (e.g., "I'd set a stop-loss at -50 bps, risking 20 bps to make 80 bps, a 4:1 reward-to-risk ratio").</div>
</div>

<div class="interview-q">
<div class="q-label">Q3</div>
<div class="question">Explain what happens to a bond's price when interest rates rise. Why?</div>
<div class="answer">Bond prices fall when rates rise. The reasoning is mathematical: a bond's price is the present value of its future cash flows (coupons + principal), discounted at the prevailing yield. When the discount rate increases, the present value of those fixed future cash flows decreases. Intuitively: if new bonds are being issued with higher coupons, existing bonds with lower coupons become less attractive, so their price must fall to offer a competitive yield. The magnitude of the price decline depends on the bond's duration&mdash;longer-duration bonds are more sensitive because their cash flows are further in the future and thus more affected by the higher discount rate.</div>
</div>

<div class="interview-q">
<div class="q-label">Q4</div>
<div class="question">A stock is trading at $100. A call option with a $105 strike and 3 months to expiry is trading at $4. A put with the same strike and expiry is trading at $2. Is there an arbitrage? Assume the risk-free rate is negligible.</div>
<div class="answer">Apply put-call parity: C − P = S − PV(K). With negligible rates, PV(K) ≈ K = $105. So: C − P should equal S − K = $100 − $105 = −$5. Actual: C − P = $4 − $2 = $2. Since $2 ≠ −$5, there's an apparent mispricing. The call is too expensive relative to the put (or the put is too cheap). To arbitrage: sell the call, buy the put, buy the stock. At expiration, the combined payoff is equivalent to holding $105 in cash. The cost of the position is: +$2 (net options premium received) − $100 (buying stock) = −$98. You receive $105 at expiration. Profit: $105 − $98 = $7 risk-free. (In practice, transaction costs and the non-negligible interest rate would reduce this.)</div>
</div>

<div class="interview-q">
<div class="q-label">Q5</div>
<div class="question">What's the difference between sales and trading? Which interests you more and why?</div>
<div class="answer">Sales is relationship-focused: understanding client needs, generating trade ideas, and driving flow to the desk. It requires strong communication skills, market knowledge, and the ability to build trust. Trading is risk-focused: making markets, managing inventory, and expressing views through positions. It requires quick quantitative thinking, emotional discipline, and comfort with real-time decision-making under uncertainty. Then give your preference with honest reasoning&mdash;neither is "better," they're different skill sets. If you're drawn to human interaction and creative problem-solving for clients, lean sales. If you're drawn to markets, risk, and the intensity of real-time P&L, lean trading. Be specific about why.</div>
</div>

<div class="interview-q">
<div class="q-label">Q6</div>
<div class="question">How does a CDS work? If a company's CDS spread widens from 200 to 400 bps, what does that tell you?</div>
<div class="answer">A CDS is essentially insurance against a company defaulting on its debt. The buyer pays a periodic premium (the CDS spread, quoted in basis points annually on the notional) to the seller. If the reference entity defaults, the seller compensates the buyer for the loss (par minus recovery value). If the CDS spread widens from 200 to 400 bps, it means the market's perception of default risk has roughly doubled. The annual cost of insuring $10M of the company's debt has gone from $200K to $400K. This could be driven by deteriorating fundamentals (lower earnings, higher leverage), sector-wide stress (energy companies during an oil price crash), or broader market risk aversion. The protection buyer (who bought at 200 bps) is now sitting on a significant profit because they locked in cheap protection that's now worth much more.</div>
</div>

<div class="interview-q">
<div class="q-label">Q7</div>
<div class="question">If the Fed raises rates by 25 bps tomorrow, what happens to: (a) the 2-year Treasury yield, (b) the 10-year Treasury yield, (c) the S&P 500, (d) the US dollar?</div>
<div class="answer">(a) The 2-year yield rises&mdash;it's the most sensitive to Fed policy. The move might be less than 25 bps if the hike was fully priced in; it could overshoot if the accompanying statement is more hawkish than expected. (b) The 10-year yield likely rises but by less than the 2-year, causing the curve to flatten (or invert further). Long rates are driven more by growth and inflation expectations than by today's Fed decision. (c) The S&P likely falls modestly on a rate hike (higher rates increase discount rates, reduce present value of future earnings, and increase corporate borrowing costs). But if the hike was fully expected, the market reaction depends more on the forward guidance than the hike itself. (d) The US dollar likely strengthens&mdash;higher rates attract foreign capital seeking the higher yield, increasing demand for dollars. However, if the hike was expected, the move may already be priced in ("buy the rumor, sell the fact").</div>
</div>

<div class="interview-q">
<div class="q-label">Q8</div>
<div class="question">You're a market maker in a corporate bond. A client wants to sell you $20M face value. The bond was last traded at 95. How do you decide what price to bid?</div>
<div class="answer">Consider several factors: (1) Where is the bond's fair value right now? Has the broader credit market moved since the last trade? Have comparable bonds tightened or widened? Has any new information emerged about the issuer? (2) How liquid is this bond? If it trades frequently with tight spreads, I can bid aggressively (closer to 95) because I'm confident I can turn around and sell it quickly. If it's illiquid and I might be stuck with it for days or weeks, I need a wider spread to compensate for the risk. (3) Why is the client selling? If it's a forced seller (e.g., fund liquidation), there may be more selling pressure coming, so I want to bid lower to protect myself. If it's a routine portfolio adjustment, less concern. (4) How much risk does my book currently have? If I'm already long $50M of similar credits, adding another $20M concentrates my risk, so I bid lower. I might bid 94.5, keeping a 0.5 point cushion, and try to sell at 95 or better within the next day or two. If the bond is very illiquid, I might bid 93.5&ndash;94.0.</div>
</div>`,
  },
  {
    title: 'Common S&amp;T Interview Mistakes',
    content: `<div class="mistake-box">
<strong>Not knowing what's happening in markets.</strong> If you walk into an S&T interview and can't tell the interviewer where the S&P closed yesterday, where the 10-year is, or what the big macro story of the week is, the interview is effectively over. Check markets every morning for at least 2 weeks before your interview. Read the FT, Bloomberg, or WSJ markets section daily.
</div>

<div class="mistake-box">
<strong>Hedging every answer.</strong> S&T interviewers want you to take a position. "It depends" is not a good answer to "Where do you think the dollar is going?" Have a view, state it clearly, and defend it. If the interviewer pushes back, engage&mdash;don't cave. They're testing your conviction and ability to think under pressure, not whether you're right.
</div>

<div class="mistake-box">
<strong>Not understanding products.</strong> You don't need to be an expert in every product, but you should understand the basics of bonds (price/yield relationship, duration), options (calls, puts, the Greeks, put-call parity), and the major macro relationships (rates up → bonds down → dollar up). If you're interviewing for a specific desk, know that product cold.
</div>

<div class="mistake-box">
<strong>Freezing on mental math.</strong> Practice is the only cure. Spend 15 minutes daily doing rapid multiplication, division, percentage calculations, and probability problems. Use apps like "Mental Math Tricks" or create flashcards. In the interview, talk through your process out loud even if you're slow&mdash;silence is worse than a slightly wrong answer arrived at transparently.
</div>

<div class="mistake-box">
<strong>Not having a trade idea.</strong> You will almost certainly be asked "Pitch me a trade" or "What would you buy or sell today?" Prepare 2&ndash;3 trade ideas across different asset classes. Each should have a clear thesis, a specific instrument, a defined risk, and a sense of the reward-to-risk ratio. Vague ideas ("I'd buy stocks because I think the economy is strong") are worthless. Specific ideas ("I'd buy 3-month call options on the XLE ETF at the $90 strike because I think Middle East tensions will push crude above $85 and energy stocks are lagging the move in the underlying commodity") show real market engagement.
</div>

<div class="takeaway-box">
<strong>The S&amp;T Mindset:</strong> Sales &amp; Trading rewards a specific kind of intelligence: the ability to synthesize incomplete information quickly, make a decision with conviction, and adjust when you're wrong&mdash;all under real-time pressure. The best traders aren't the ones who are right most often; they're the ones who lose small when they're wrong and make big when they're right. The best salespeople aren't the ones with the most clients; they're the ones whose clients trust them enough to trade the most. Both sides require intellectual curiosity about markets, comfort with quantitative reasoning, and the emotional discipline to remain calm when money is on the line. Start building these habits now: read markets daily, form views and test them, practice your mental math, and always be ready to answer the question that defines this business: <em>"So, what would you do?"</em>
</div>

</div>`,
  },
];
