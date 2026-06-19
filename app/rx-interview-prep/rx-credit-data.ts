export const RX_CREDIT_SECTIONS = [
  {
    title: 'The Core Price-Yield Relationship',
    content: `<p>Bond math questions are the most common technical category in restructuring interviews, and they are usually kept deliberately surface level. The interviewer wants to see that you understand the relationship between price, coupon, and yield, and that you can reason about it intuitively. You will essentially never be asked to handle convexity or anything genuinely complex.</p>

<p>A bond pays periodic coupons and returns its face value (par, conventionally 100) at maturity. Its price moves inversely to its yield. When the required yield rises, the price falls, and vice versa. The intuition: a bond's coupons are fixed, so if the market demands a higher return, the only way to deliver it is to pay less for the same fixed cash flows.</p>

<table class="comparison-table">
<tr><th>Measure</th><th>Definition</th><th>Example (5% coupon bond at 80)</th></tr>
<tr><td>Coupon rate</td><td>Fixed annual interest as a % of face</td><td>Pays 5 per year on 100 face</td></tr>
<tr><td>Current yield</td><td>Annual coupon / current price</td><td>5 / 80 = 6.25%</td></tr>
<tr><td>Yield to maturity (YTM)</td><td>Single discount rate setting PV of all cash flows equal to price</td><td>Captures coupon plus pull to par</td></tr>
</table>

<p>Current yield ignores the gain or loss as the price moves toward par at maturity. YTM captures both the coupon income and the pull to par, so it is the complete measure of return if you hold to maturity and reinvest coupons at that rate.</p>`,
  },
  {
    title: 'The Pull to Par',
    content: `<p>Here is the intuition that ties it together and that interviewers love to probe. If a bond trades below par and its yield stays constant, its price must rise over time toward par as maturity approaches. Why? Because part of the bond's total return comes from the gain as it converges to par at maturity. As that maturity gets closer, less of that gain remains to be earned, so to keep delivering the same yield, the price has to climb.</p>

<div class="example-box">
<div class="example-label">Example</div>
<p>Take a bond with four years to maturity, a 5% coupon, and a required yield of 7%. Because the yield exceeds the coupon, the bond trades below par, at roughly 93. Over the next four years, holding the yield at 7%, its price drifts up from about 93 toward 100 as it nears maturity, while the coupon keeps paying 5 per year. The total return each year (coupon income plus price appreciation) works out to the 7% yield.</p>
</div>

<p>A below-par bond is said to <strong>accrete</strong> to par over its life. A bond trading above par <strong>amortizes</strong> down to par, and its yield is below its coupon because you paid more than par and will lose that premium by maturity.</p>`,
  },
  {
    title: 'Estimating YTM by Hand',
    content: `<p>The one calculation that genuinely comes up is approximating a bond's yield given its price, coupon, and years to maturity.</p>

<div class="formula-box">Approx YTM = ( annual coupon + (par - price) / years ) / ( (price + par) / 2 )</div>

<p>In words: take the annual coupon income, add the total gain to par spread evenly across the years remaining, then divide that annual dollar return by roughly the average of what you paid and what you get back.</p>

<div class="example-box">
<div class="example-label">Worked Example</div>
<p>An 8% coupon bond, trading at 80, with five years to maturity. Annual coupon is 8. Gain to par is 100 less 80 = 20, spread over five years = 4 per year. Annual dollar return is about 8 + 4 = 12. Average of price and par is (80 + 100) / 2 = 90. So approximate YTM is 12 / 90, about 13.3%. The exact figure from a calculator is close, and the approximation is exactly what an interview wants.</p>
</div>

<p>The intuition behind why a discounted bond yields more than its coupon: you earn the 8% coupon on a 100 face amount while only having paid 80, and on top of that you capture a 20-point gain as the bond pulls to par. Both effects push the yield above the coupon.</p>`,
  },
  {
    title: 'Distressed Pricing',
    content: `<p>Once a bond is distressed, the market stops pricing it on yield and starts pricing it on expected recovery. A bond trading at 40 is not really being valued for its coupon. The market is signaling it expects to recover roughly 40 cents on the dollar in a restructuring.</p>

<div class="key-concept">This is the bridge from bond math to recovery analysis: in distress, price is a recovery estimate, and your job as an analyst is to test whether the market's implied recovery is too high or too low by running the waterfall yourself. The yield framing gives way to the claims-and-recovery framing that defines everything else in restructuring.</div>`,
  },
];
