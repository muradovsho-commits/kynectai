export const RX_CREDIT_SECTIONS = [
  {
    title: 'Yield to Maturity (YTM)',
    content: `<p>YTM is the total annualized return an investor earns if they buy a bond at the current price, hold it to maturity, receive all coupon payments, and are repaid par at maturity. For bonds trading below par, YTM exceeds the coupon rate because the investor earns both the coupon income and the price appreciation from the discount to par.</p>

<div class="formula-box">
Estimated YTM = (C + (FV − P) / n) / ((FV + P) / 2)<br>
<small>C = annual coupon, FV = face value (100), P = current price, n = years to maturity</small>
</div>

<div class="example-box">
<div class="example-label">YTM Calculation</div>
<p><strong>Given:</strong> A bond with a 10% coupon, trading at 80, maturing in 5 years.</p>
<p>Estimated YTM = (10 + (100 − 80) / 5) / ((100 + 80) / 2) = (10 + 4) / 90 = 14 / 90 ≈ <strong>15.6%</strong></p>
<p>The investor earns 10% from the coupon plus ~4% from the price appreciation (buying at 80 and receiving 100 at maturity). The estimated YTM formula gives an approximation; the exact YTM requires solving iteratively.</p>
</div>

<h4>Intuitive Understanding</h4>

<p>Think of a bond's YTM as comprising two return components: (1) the <strong>coupon component</strong> (the periodic interest income) and (2) the <strong>price appreciation component</strong> (the gain from buying below par and being repaid at par). For a bond trading at par, YTM equals the coupon rate because there's no price appreciation. For a bond trading below par, YTM exceeds the coupon rate. For a bond trading above par (a premium bond), YTM is below the coupon rate because the price will decline toward par by maturity.</p>

<p>As a bond approaches maturity, its price converges toward par (assuming no default). A bond trading at 80 with four years to maturity must gradually increase in price each year, with the annual price appreciation representing the excess return above the coupon. If the yield remains constant, the bond's price appreciation each year equals approximately: (Yield × Current Price) minus the Coupon. The residual is the annual price gain.</p>

<h4>Current Yield vs. YTM</h4>

<p><strong>Current Yield</strong> = Annual Coupon / Current Price. It measures only the income return, ignoring price appreciation. For a 10% coupon bond trading at 80: Current Yield = 10/80 = 12.5%. Current Yield is simpler than YTM but incomplete because it doesn't account for the capital gain or loss at maturity.</p>

<h4>Key Relationships</h4>

<p>When a bond's price falls, its YTM rises (and vice versa)-this is the fundamental inverse relationship between bond prices and yields. For a given price, shorter maturities produce higher YTMs (the price appreciation is compressed into fewer years). For a given maturity, lower prices produce higher YTMs. Increasing the coupon frequency (from annual to semi-annual to quarterly) slightly decreases YTM because the investor receives cash sooner.</p>`,
  },
];
