export const RX_CREDIT_SECTIONS = [
  {
    title: 'The Core Price-Yield Relationship',
    content: `<p>Bond math questions are the most common technical category in restructuring interviews, and they are usually kept deliberately surface level. The interviewer wants to see that you understand the relationship between price, coupon, and yield, and that you can reason about it intuitively. You will essentially never be asked to handle convexity or anything genuinely complex; a directional, hand-wavy understanding is what is being tested.</p>

<p>A bond pays periodic coupons and returns its face value (par, conventionally 100) at maturity. Its price moves inversely to its yield. When the required yield rises, the price falls, and vice versa. The intuition: a bond's coupons are fixed, so if the market demands a higher return, the only way to deliver it on a fixed stream of cash flows is to pay less for them.</p>

<table class="comparison-table">
<tr><th>Measure</th><th>Definition</th><th>Example: 5% coupon bond trading at 80</th></tr>
<tr><td>Coupon rate</td><td>Fixed annual interest as a % of face</td><td>Pays 5 per year on 100 face</td></tr>
<tr><td>Current yield</td><td>Annual coupon / current price</td><td>5 / 80 = 6.25%</td></tr>
<tr><td>Yield to maturity (YTM)</td><td>Single discount rate setting PV of all cash flows equal to price</td><td>Captures coupon plus pull to par; highest of the three here</td></tr>
<tr><td>Yield to worst (YTW)</td><td>The lowest yield across all possible call/redemption dates</td><td>For a callable bond, assumes the issuer redeems at the worst time for you</td></tr>
</table>

<p>Current yield ignores the gain or loss as the price moves toward par at maturity. YTM captures both the coupon income and the pull to par, so it is the complete measure of return if you hold to maturity and reinvest coupons at that rate. YTW matters when a bond can be called early: it is the yield assuming the issuer exercises whichever option is worst for the holder.</p>`,
  },
  {
    title: 'The Pull to Par',
    content: `<p>Here is the intuition that ties it together and that interviewers love to probe. If a bond trades below par and its yield stays constant, its price must rise over time toward par as maturity approaches. Why? Because part of the bond's total return comes from the gain as it converges to par at maturity. As that maturity gets closer, less of that gain remains to be earned, so to keep delivering the same yield, the price has to climb.</p>

<div class="example-box">
<div class="example-label">Example</div>
<p>Take a bond with four years to maturity, a 5% coupon, and a required yield of 7%. Because the yield exceeds the coupon, the bond trades below par, at roughly 93. Over the next four years, holding the yield at 7%, its price drifts up from about 93 toward 100 as it nears maturity, while the coupon keeps paying 5 per year. The total return each year (coupon income plus price appreciation) works out to the 7% yield. If the price did not rise, the yield would have to climb instead.</p>
</div>

<p>A below-par bond <strong>accretes</strong> to par over its life. A bond trading above par <strong>amortizes</strong> down to par, and its yield is below its coupon because you paid more than par and will lose that premium by maturity. So the ordering is intuitive: discount bond, YTM above coupon; par bond, YTM equals coupon; premium bond, YTM below coupon.</p>`,
  },
  {
    title: 'Estimating YTM by Hand',
    content: `<p>The one calculation that genuinely comes up is approximating a bond's yield given its price, coupon, and years to maturity. Nobody will hand you a financial calculator, so use the approximation.</p>

<div class="formula-box">Approx YTM = ( annual coupon + (par - price) / years ) / ( (price + par) / 2 )</div>

<p>In words: take the annual coupon income, add the total gain to par spread evenly across the years remaining, then divide that annual dollar return by roughly the average of what you paid and what you get back.</p>

<div class="example-box">
<div class="example-label">Worked Example 1</div>
<p>An 8% coupon bond, trading at 80, five years to maturity. Annual coupon is 8. Gain to par is 100 less 80 = 20, spread over five years = 4 per year. Annual dollar return is about 8 + 4 = 12. Average of price and par is (80 + 100) / 2 = 90. Approximate YTM is 12 / 90, about 13.3%. (Exact is close.)</p>
</div>

<div class="example-box">
<div class="example-label">Worked Example 2</div>
<p>A 6% coupon bond, trading at 90, three years to maturity. Annual coupon is 6. Gain to par is 10 over 3 years = 3.33 per year. Annual return about 9.33. Average of price and par is 95. Approximate YTM is 9.33 / 95, about 9.8%. Sanity check: above the 6% coupon, as it must be for a discount bond.</p>
</div>

<p>The intuition behind why a discounted bond yields more than its coupon: you earn the coupon on a 100 face amount while having paid less than 100, and on top of that you capture the gain as the bond pulls to par. Both effects push the yield above the coupon.</p>`,
  },
  {
    title: 'Accrued Interest and Clean vs Dirty Price',
    content: `<p>A practical point that comes up in waterfalls and in trading. Bonds accrue interest continuously between coupon dates, but the quoted price is usually the <strong>clean price</strong> (excluding accrued interest). The amount a buyer actually pays is the <strong>dirty price</strong> (clean price plus accrued interest since the last coupon).</p>

<div class="example-box">
<div class="example-label">Example</div>
<p>A bond with a 10% annual coupon last paid three months ago has accrued one quarter of its annual coupon, or 2.5 per 100 face. If it is quoted at a clean price of 85, the buyer pays a dirty price of 87.5. In a restructuring waterfall, the accrued-but-unpaid interest from the last coupon date to the filing date is exactly this accrued amount, and it gets added to the face to build the pre-petition claim.</p>
</div>

<div class="key-concept">This is why the waterfall asks for the last coupon paid date and the filing date: the gap between them, times the rate, is the accrued pre-petition interest you add to the claim. Accrued interest is not a separate concept from the dirty price; it is the same idea showing up in the recovery analysis.</div>`,
  },
  {
    title: 'Distressed Pricing and Spreads',
    content: `<p>Once a bond is distressed, the market stops pricing it on yield and starts pricing it on expected recovery. A bond trading at 40 is not really being valued for its coupon. The market is signaling it expects to recover roughly 40 cents on the dollar in a restructuring. The yield number becomes almost meaningless, because the question is no longer how much income the bond pays but how much principal you get back and when.</p>

<p>Before a credit gets to that point, the warning shows up in the <strong>spread</strong>: the extra yield over a risk-free benchmark that compensates for credit risk. As a company deteriorates, its spread widens (yield rises, price falls) long before any default. Watching spreads widen is one of the earliest market signals that a name belongs on the distressed screen.</p>

<div class="key-concept">This is the bridge from bond math to recovery analysis: in distress, price is a recovery estimate, and your job as an analyst is to test whether the market's implied recovery is too high or too low by running the waterfall yourself. The yield framing gives way to the claims-and-recovery framing that defines everything else in restructuring.</div>

<div class="takeaway-box"><strong>The progression:</strong> healthy bond priced on yield, then a widening spread as risk rises, then a distressed price that is really a recovery estimate. Knowing where a name sits on that progression tells you what kind of question you are actually answering.</div>`,
  },
];
