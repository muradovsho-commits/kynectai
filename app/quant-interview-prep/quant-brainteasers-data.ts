export const QUANT_BRAIN_SECTIONS = [
  {
    title: `1. Mental Math & Rapid Arithmetic`,
    content: `<p>If you are applying to trading roles at Jane Street, Citadel, or Optiver, your first interview will almost certainly involve raw mental math. They are testing your ability to perform accurate calculations under intense time pressure and stress (e.g., 80 rapid-fire questions in 8 minutes on platforms like Optiver's 80-in-8).</p>
<br/>
<p><strong>Core Mental Math Tricks:</strong></p>
<p>• <strong>Multiplying by 5:</strong> Multiply by 10 and divide by 2. (e.g., 46 * 5 = 460 / 2 = 230)</p>
<p>• <strong>Squaring numbers ending in 5:</strong> If squaring $N5$, the answer ends in 25, and the leading digits are $N * (N+1)$. (e.g., $65^2 = 6 * 7 = 42$, append 25 &rarr; 4225).</p>
<p>• <strong>Multiplying two numbers near 100:</strong> Use algebraic expansion: $(100-a)(100-b) = 100(100-a-b) + ab$. Or simpler: $96 * 98 = (100-4)*(100-2)$. Base is $100 - (4+2) = 94$. Ending is $4 * 2 = 08$. Answer: 9408.</p>
<p>• <strong>Squaring numbers near 50:</strong> To find $x^2$ where $x$ is near 50, use $25 + (x-50)$ as the hundreds digits, and $(x-50)^2$ as the last two digits. E.g., $53^2 = 25 + 3 = 28$ hundreds, plus $3^2 = 09$. Result: 2809.</p>
<br/>
<p><strong>Practice Strategy:</strong> Download apps like 'Zetamac' or 'Tradermath' and practice until you can consistently score 60+ on the 120-second default setting. Stop using a calculator in your daily life immediately.</p>`
  },
  {
    title: `2. Expected Value (EV) & Edge`,
    content: `<p>Expected Value is the fundamental engine of all quantitative trading. It is the probability-weighted average of all possible outcomes. A trader's job is simply to find games with positive EV and play them as frequently as possible to let the Law of Large Numbers take over.</p>
<br/>
<p><strong>Formula:</strong> $E[X] = \\sum_{i} (P(x_i) \cdot x_i)$</p>
<br/>
<p><strong>Classic Example (The Coin Flip Game):</strong><br/>
"I flip a fair coin. If it's Heads, I pay you $10. If it's Tails, you pay me $5. How much would you pay to play this game?"</p>
<p><em>Solution:</em><br/>
$EV = (0.5 * $10) + (0.5 * -$5) = $5 - $2.50 = $2.50.</p>
<br/>
<p><strong>The Follow-up (Bet Sizing):</strong> "If your entire net worth is $100, how much of it would you bet on a single coin flip of this game?"<br/>
This introduces the <strong>Kelly Criterion</strong>: $f^* = p - q/b$, where $f^*$ is the fraction of the bankroll to bet, $p$ is the probability of winning, $q$ is the probability of losing, and $b$ is the payout odds. Here, you win $10 for every $5 risked, so $b = 10/5 = 2$. $p = 0.5$, $q = 0.5$.<br/>
$f^* = 0.5 - (0.5 / 2) = 0.5 - 0.25 = 0.25$. You should bet exactly 25% of your bankroll to maximize the long-term growth rate of your wealth while avoiding bankruptcy.</p>`
  },
  {
    title: `3. Logic & Deductive Reasoning (The "Aha!" Puzzles)`,
    content: `<p>Logic puzzles test your deductive reasoning. They aren't about advanced calculus; they are about breaking a complex problem down into simple, Boolean constraints or finding the hidden variable.</p>
<br/>
<p><strong>Classic Puzzle 1: The 3 Lightbulbs</strong><br/>
<em>Prompt:</em> You are in a room with 3 switches. In the next room, there are 3 lightbulbs. You can flip the switches however you want, but you can only enter the room with the lightbulbs ONCE. How do you map the switches to the bulbs?</p>
<p><em>Solution Framework:</em><br/>
If you just use "On/Off" (Boolean logic), you only have 2 states for 3 bulbs. You need a third state. What else does a lightbulb do besides emit light? It emits <em>heat</em>.<br/>
1. Turn Switch A ON and leave it on for 10 minutes.<br/>
2. Turn Switch A OFF, and immediately turn Switch B ON.<br/>
3. Walk into the next room.<br/>
The bulb that is ON connects to Switch B. Feel the two OFF bulbs—the one that is WARM connects to Switch A. The cold one connects to Switch C.</p>
<br/>
<p><strong>Classic Puzzle 2: The Two Ropes</strong><br/>
<em>Prompt:</em> You have two ropes. Each takes exactly 60 minutes to burn completely, but they burn unevenly (one half might burn in 1 minute, the other half in 59 minutes). How do you measure exactly 45 minutes using a lighter?</p>
<p><em>Solution Framework:</em><br/>
Ignite Rope 1 at BOTH ends simultaneously. Ignite Rope 2 at ONE end. Because Rope 1 is burning from both ends, it will take exactly 30 minutes to be consumed entirely (regardless of the uneven burn rate). The exact moment Rope 1 finishes burning, 30 minutes have passed. At that exact moment, light the OTHER end of Rope 2. Since Rope 2 has been burning for 30 minutes, it has exactly 30 minutes of total burn time remaining. By lighting its other end, the remaining section will burn twice as fast, taking exactly 15 minutes. 30 + 15 = 45 minutes.</p>`
  },
  {
    title: `4. Fermi Problems (Estimation & Sanity Checks)`,
    content: `<p>Fermi problems test your ability to make structured, reasonable guesses with extremely limited information. It is testing your sanity checks—a critical skill when your algorithm proposes trading $500M and you need to instinctually know if the order size makes sense.</p>
<br/>
<p><strong>Example:</strong> "How many ping pong balls can fit in a Boeing 747?"</p>
<br/>
<p><strong>The Wrong Way:</strong> Giving a random guess like "10 million."</p>
<p><strong>The Right Way (Structured Breakdown):</strong><br/>
1. <strong>Estimate the volume of a ping pong ball:</strong><br/>
   <em>Radius is ~2cm &rarr; Volume of a cube bounding it is $4^3 = 64 cm^3$. Let's round to $50 cm^3$ for easier mental math.</em><br/>
2. <strong>Estimate the internal volume of a 747:</strong><br/>
   <em>Length: ~70 meters. Radius of cabin: ~3 meters. Volume of a cylinder = $\pi \cdot r^2 \cdot h \approx 3 \cdot 9 \cdot 70 = 1,890 m^3$. Convert to $cm^3$ by multiplying by $100^3$ ($1,000,000$), yielding $\sim 1.89$ Billion $cm^3$.</em><br/>
3. <strong>Divide the total volume by the ball volume:</strong><br/>
   <em>$1.89B / 50 \approx 38$ million balls.</em><br/>
4. <strong>Account for "packing fraction" limits:</strong><br/>
   <em>Spheres cannot pack perfectly; the theoretical maximum for sphere packing is roughly 74%. Multiply 38 million by 0.74 $\approx$ 28 million.</em></p>
<p>In a real interview, explicitly state every assumption you make (e.g., "I will ignore the space taken up by seats, assuming an empty fuselage for simplification.")</p>`
  },
  {
    title: `5. Probability Games & Game Theory`,
    content: `<p>Quants frequently play "Market Making" games during interviews involving dice rolls or playing cards. You must think in terms of distributions, edge cases, and bluffing.</p>
<br/>
<p><strong>Classic Game: Russian Roulette Option</strong><br/>
<em>Prompt:</em> We are playing Russian Roulette with a 6-chamber revolver and two bullets loaded in consecutive chambers. I spin the cylinder and fire at the wall. Click—empty chamber. It is now your turn. Do you pull the trigger immediately, or spin the cylinder first?</p>
<br/>
<p><em>Solution Framework:</em><br/>
This relies on conditional probability. Let the chambers be numbered 1, 2, 3, 4, 5, 6. Let the bullets be in 1 and 2.<br/>
If you <strong>spin</strong>: The probability of hitting a bullet is 2/6 = $33.3\%$.<br/>
If you <strong>pull the trigger immediately</strong>: We know the previous chamber fired was empty. The empty chambers are 3, 4, 5, 6. If we are currently at chamber 3, the next chamber is 4 (Empty). If we are at 4, the next is 5 (Empty). If 5, next is 6 (Empty). Only if we were at chamber 6 is the next chamber 1 (Bullet!).<br/>
There are 4 empty chambers. Only ONE of them is followed by a bullet. So, the probability of firing a bullet if you pull immediately is 1/4 = $25.0\%$.<br/>
<strong>Since 25% < 33.3%, you should pull the trigger immediately.</strong></p>`
  },
  {
    title: `6. The "Market Making" Interview Simulation`,
    content: `<p>At firms like Optiver or SIG, your final round will literally be a live trading simulation with 5 interviewers yelling out prices. You will have to make a "Bid-Ask spread" on an obscure fact.</p>
<br/>
<p><strong>Example:</strong> "Make me a market on the population of Chicago. You must have a spread of no more than 1 million."</p>
<br/>
<p><em>The Strategy:</em><br/>
1. <strong>Establish a Baseline:</strong> You know NYC is ~8M, LA is ~4M. Chicago is the 3rd largest. Estimate 2.5M.<br/>
2. <strong>Quote the Spread:</strong> "2 million at 3 million." (Meaning you will buy a contract paying out the actual population at 2M, and sell it at 3M).<br/>
3. <strong>Adjust to Flow:</strong> The interviewer says "I'm buying 10 contracts at your Ask of 3 million." This means they think the answer is HIGHER than 3 million. <strong>Do not hold your ground.</strong> Immediately update your Bayesian prior: maybe the metro area is larger than you thought. Shift your market higher: "2.5 million at 3.5 million." If they buy again, immediately shift to "4 million at 5 million."<br/>
4. <strong>The Lesson:</strong> Market makers DO NOT bet on being right. They bet on information flow. If the entire market is buying from you, your prices are too low. Adjust rapidly.</p>`
  }
];
