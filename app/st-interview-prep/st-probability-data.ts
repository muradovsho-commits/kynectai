export const ST_PROBABILITY_SECTIONS = [
  {
    title: 'Expected Value: The Master Concept',
    content: `<p>If there is one idea that sits at the center of how traders think, it is expected value. It is the lens for every decision under uncertainty, and interviewers test it constantly, sometimes directly, sometimes hidden inside a brainteaser or a market question. Get comfortable with it and a huge swath of the interview becomes approachable.</p>

<div class="key-concept"><strong>Expected value (EV) is the average outcome of a bet if you could repeat it many times.</strong> You calculate it by multiplying each possible outcome by its probability and adding them up. A bet is attractive when its expected value is positive (on average you come out ahead) and unattractive when negative, regardless of what happens on any single try. Traders live by this: they want to make positive-EV decisions repeatedly, knowing that over many trades the averages win out, even though any individual trade can lose. This shift, from caring about a single outcome to caring about the average over many repetitions, is the core of the trading mindset.</div>

<div class="formula-box">Expected Value = Sum of (each outcome x its probability)<br/><br/>Example: a bet wins 100 with probability 0.4, loses 50 with probability 0.6<br/>EV = (100 x 0.4) + (-50 x 0.6) = 40 - 30 = +10</div>

<div class="example-box">
<div class="example-label">A classic EV question</div>
<p>"I flip a fair coin. Heads you win 3 dollars, tails you lose 1 dollar. Do you play?" EV = (3 x 0.5) + (-1 x 0.5) = 1.5 minus 0.5 = +1. Positive EV, so yes, you play, and you would happily play repeatedly. "How much would you pay to play?" Up to 1 dollar, the EV, is the breakeven price; below that you have positive expected profit.</p>
</div>

<div class="takeaway-box">Whenever an interview question involves a bet, a game, or a decision with uncertain payoffs, reach for expected value: list the outcomes, assign probabilities, multiply and sum. Then frame your answer around whether the EV is positive and what price would make it a fair bet. Showing you instinctively think in EV terms is exactly the mindset they are screening for.</div>`,
  },
  {
    title: 'Probability Essentials',
    content: `<p>EV runs on probabilities, so you need a working command of the basics. You do not need advanced statistics; you need to handle the common setups quickly and correctly.</p>

<div class="framework-box"><div class="fw-label">THE RULES YOU ACTUALLY USE</div><strong>Probabilities range from 0 to 1</strong> (or 0 to 100 percent) and the probabilities of all possible outcomes sum to 1.<br/><strong>AND (independent events): multiply.</strong> The chance of two independent things both happening is the product. Two coin flips both heads: 0.5 x 0.5 = 0.25.<br/><strong>OR (mutually exclusive events): add.</strong> The chance of either of two non-overlapping outcomes is the sum. Rolling a 1 or a 2 on a die: 1/6 + 1/6 = 1/3.<br/><strong>Complement:</strong> the chance something happens is 1 minus the chance it does not. Often the easiest path: the chance of "at least one" is 1 minus the chance of "none."</div>

<div class="key-concept">The <strong>complement trick</strong>, computing "at least one" as 1 minus "none," is one of the most useful shortcuts in interview probability, because "at least one" questions are common and computing them directly is messy. For example: "roll two dice; what's the chance of at least one six?" Directly, you would have to add several cases. Via the complement: the chance of no six on one die is 5/6, on both is 5/6 x 5/6 = 25/36, so at least one six is 1 minus 25/36 = 11/36. Far cleaner. Whenever you see "at least one," your first instinct should be to flip to the complement.</div>

<div class="example-box">
<div class="example-label">Conditional probability, simply</div>
<p>Conditional probability is the chance of something <em>given</em> that something else is true, and it matters because information changes odds. "I have two children, at least one is a boy; what's the chance both are boys?" The possible equally-likely families with at least one boy are BB, BG, GB (not GG), and only one of those three is BB, so the answer is 1/3, not 1/2. The "given" information (at least one boy) reshapes the sample space. These conditional puzzles are interview favorites precisely because the intuitive answer is often wrong, and they reward careful enumeration of the possibilities.</p>
</div>

<div class="takeaway-box">Drill the four moves until automatic: multiply for AND, add for OR, use the complement for "at least one," and carefully reframe the sample space for conditional ("given") problems. Most interview probability is these four ideas applied calmly, not exotic theory.</div>`,
  },
  {
    title: 'Edge, Variance, and Sizing',
    content: `<p>Beyond computing a single EV, traders think about three connected ideas that turn probability into actual decisions: edge, variance, and how much to bet. These rarely require heavy math in interviews, but understanding them marks you as someone who thinks like a trader.</p>

<div class="key-concept"><strong>Edge</strong> is your advantage, the degree to which the odds are in your favor, the positive expected value per bet. A market maker's edge is the spread; a card counter's edge is the shift in odds from counting. <strong>Variance</strong> is how much outcomes swing around that average. You can have a real edge and still lose for a long stretch because of variance, which is why a positive-EV trader must survive the swings to let the edge play out. The relationship between edge and variance is the whole game: you want maximum edge with manageable variance, and you must size your bets so that variance never wipes you out before your edge pays off.</div>

<div class="key-concept"><strong>Bet sizing</strong> follows directly: even with a positive edge, betting too much risks ruin during an unlucky streak, while betting too little leaves money on the table. The principle (formalized by ideas like the Kelly criterion, which you should know by name) is that the size of your bet should scale with the size of your edge, bet more when the advantage is larger, less when it is thin, and never so much that a normal losing streak destroys you. This is exactly how trading desks set position limits: they size risk to the edge and cap it so variance cannot blow up the book. You do not need the Kelly formula in most interviews, but the intuition, size to your edge, respect variance, avoid ruin, is genuinely impressive to articulate.</div>

<div class="example-box">
<div class="example-label">Edge versus variance in a sentence</div>
<p>A casino has a tiny edge on each roulette spin but plays millions of spins, so variance averages out and the edge is a near-certain profit. A gambler with the opposite (negative) edge might win big on a given night (variance) but is doomed over many bets. Traders want to be the casino: a real edge, repeated enough times, sized so variance cannot ruin them before the law of averages delivers the edge.</p>
</div>

<div class="takeaway-box">The trader's mental stack: find positive EV (an edge), accept that variance means you will lose sometimes even when right, and size your bets to your edge so you survive the swings. If you can explain why a good trader can lose for a while and still be making correct decisions, you have shown the EV-and-variance mindset that S&T is really screening for.</div>`,
  },
];
