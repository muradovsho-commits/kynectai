export const ST_MENTAL_MATH_SECTIONS = [
  {
    title: 'Mental Math Essentials',
    content: `<p>S&amp;T interviews frequently include rapid-fire mental math and probability brainteasers. The goal isn't perfection; it's demonstrating comfort with numbers under pressure. Practice these daily in the weeks before your interviews.</p>

<h4>Multiplication Shortcuts</h4>

<p><strong>Multiplying by 5:</strong> Divide by 2, multiply by 10. Example: 86 × 5 = 43 × 10 = 430.</p>

<p><strong>Multiplying by 25:</strong> Divide by 4, multiply by 100. Example: 48 × 25 = 12 × 100 = 1,200.</p>

<p><strong>Multiplying by 11:</strong> For two-digit numbers, sum the digits and place between them. Example: 63 × 11: 6_(6+3)_3 = 693. (If the sum exceeds 9, carry the 1.)</p>

<p><strong>Squaring numbers near 50:</strong> (50+n)² = 2500 + 100n + n². Example: 53² = 2500 + 300 + 9 = 2,809.</p>

<h4>Percentage and Fraction Conversions</h4>

<p>Know these instantly: 1/8 = 12.5%, 1/6 ≈ 16.7%, 1/5 = 20%, 1/4 = 25%, 1/3 ≈ 33.3%, 3/8 = 37.5%, 2/5 = 40%, 1/2 = 50%, 5/8 = 62.5%, 2/3 ≈ 66.7%, 3/4 = 75%, 7/8 = 87.5%.</p>`,
  },
  {
    title: 'Practice Drills',
    content: `<div class="math-drill">
<div class="math-label">Drill 1</div>
<div class="math-q">What is 17 × 23?</div>
<div class="math-a">Break it: 17 × 20 + 17 × 3 = 340 + 51 = <strong>391</strong></div>
</div>

<div class="math-drill">
<div class="math-label">Drill 2</div>
<div class="math-q">What is 15% of $840?</div>
<div class="math-a">10% = $84. 5% = $42. Total: $84 + $42 = <strong>$126</strong></div>
</div>

<div class="math-drill">
<div class="math-label">Drill 3</div>
<div class="math-q">A bond has a face value of $100, a 6% coupon, and trades at 92. What is the current yield?</div>
<div class="math-a">Current yield = Annual coupon / Price = $6 / $92 = <strong>6.52%</strong></div>
</div>

<div class="math-drill">
<div class="math-label">Drill 4</div>
<div class="math-q">You flip a fair coin 3 times. What's the probability of getting exactly 2 heads?</div>
<div class="math-a">Total outcomes: 2³ = 8. Ways to get exactly 2 heads: C(3,2) = 3. Probability: 3/8 = <strong>37.5%</strong></div>
</div>

<div class="math-drill">
<div class="math-label">Drill 5</div>
<div class="math-q">A stock is at $50. You buy a call with a $55 strike for $3 premium. At what stock price do you break even?</div>
<div class="math-a">Breakeven = Strike + Premium = $55 + $3 = <strong>$58</strong>. Below $58, the option position loses money (though the max loss is capped at $3 if the stock is below $55 at expiration).</div>
</div>

<div class="math-drill">
<div class="math-label">Drill 6</div>
<div class="math-q">A bond with 5 years to maturity has a duration of 4.2. If rates rise by 50 bps, approximately how much does the bond's price change?</div>
<div class="math-a">ΔPrice ≈ −Duration × ΔYield = −4.2 × 0.50% = <strong>−2.1%</strong>. The bond falls approximately 2.1% in price.</div>
</div>`,
  },
  {
    title: 'Probability &amp; Expected Value',
    content: `<p>Many S&amp;T brainteasers are disguised expected value calculations. The framework: identify all possible outcomes, assign a probability to each, calculate the value of each outcome, and take the probability-weighted average.</p>

<div class="math-drill">
<div class="math-label">Expected Value Problem</div>
<div class="math-q">I offer you a game: roll a fair die. If you roll a 6, I pay you $30. If you roll anything else, you pay me $6. Would you play?</div>
<div class="math-a">Expected value = (1/6 × $30) + (5/6 × −$6) = $5.00 − $5.00 = <strong>$0.00</strong>. The game is fair&mdash;zero expected value. You could argue either way: risk-neutral players are indifferent, but risk-averse players might decline because the variance is high ($30 upside vs. $6 downside, repeated). If the payout were $36 instead of $30, EV = $6 − $5 = +$1, and you should play.</div>
</div>`,
  },
];
