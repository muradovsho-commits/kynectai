export const AM_FIXED_INCOME_SECTIONS = [
  {
    title: 'Bond Fundamentals',
    content: `<p>A bond is a loan from the investor to the issuer. The issuer (a corporation, government, or municipality) promises to pay periodic interest (the <strong>coupon</strong>) and return the principal (the <strong>par value</strong> or <strong>face value</strong>) at maturity. Bonds are the primary instrument in fixed income markets.</p>

<p>Key terminology: <strong>Coupon Rate</strong> is the annual interest payment as a percentage of par value (a 5% coupon on a $1,000 bond pays $50/year). <strong>Yield to Maturity (YTM)</strong> is the total annualized return if you hold the bond to maturity, accounting for the purchase price, coupon payments, and the difference between purchase price and par at maturity. <strong>Duration</strong> measures the bond's sensitivity to interest rate changes (a bond with 5-year duration falls ~5% in price for every 1% rise in rates). <strong>Spread</strong> is the yield premium over a comparable risk-free government bond, reflecting credit risk.</p>

<h4>The Inverse Relationship Between Price and Yield</h4>

<p>Bond prices and yields move in opposite directions. When interest rates rise, existing bonds (with lower coupon rates) become less attractive, so their prices fall. When rates fall, existing bonds become more valuable, and prices rise. This relationship is mathematical, not behavioral: a bond paying 4% is worth less when newly issued bonds pay 5%, because investors can buy the new bond for the same price and earn more.</p>`,
  },
  {
    title: 'Credit Analysis',
    content: `<p>Credit analysis evaluates the probability that a bond issuer will fail to make its promised payments (default). The core question: can the company generate enough cash flow to service its Debt obligations?</p>

<h4>Key Credit Metrics</h4>

<div class="formula-box">
Leverage Ratio = Total Debt / EBITDA<br>
Interest Coverage = EBITDA / Interest Expense<br>
Fixed Charge Coverage = (EBITDA − CapEx) / (Interest + Mand. Amort.)<br>
Debt / Total Capital = Debt / (Debt + Equity)<br>
FCF / Debt = measure of deleveraging capacity
</div>

<p><strong>Investment Grade (IG)</strong> bonds are rated BBB−/Baa3 or higher by the rating agencies (S&P, Moody's, Fitch). These companies have strong balance sheets, stable cash flows, and low default risk. IG bonds offer lower yields but greater safety. Typical leverage: 1.0-3.5x Debt/EBITDA.</p>

<p><strong>High Yield (HY)</strong> bonds are rated BB+/Ba1 or lower. These are riskier companies with higher leverage, less stable cash flows, or weaker competitive positions. HY bonds offer higher yields to compensate for higher default risk. Typical leverage: 3.5-7.0x+ Debt/EBITDA. Historical default rates for HY bonds average ~3-5% annually, spiking to 10-15% during recessions.</p>

<h4>The Credit Analysis Framework</h4>

<p><strong>Business risk:</strong> Industry stability, competitive position, customer diversification, barriers to entry. A utility company has lower business risk than a retailer, which translates to higher credit quality at the same leverage level.</p>

<p><strong>Financial risk:</strong> Leverage, coverage ratios, liquidity (cash + revolver availability), Debt maturity profile (wall of maturities creates refinancing risk), and covenant compliance.</p>

<p><strong>Cash flow sustainability:</strong> Can the company sustain its current cash flow generation? Is EBITDA growing or declining? How sensitive is it to economic cycles? What's the maintenance CapEx requirement?</p>

<p><strong>Recovery analysis:</strong> If the company defaults, how much will bondholders recover? Senior secured bonds typically recover 60-80 cents on the dollar; unsecured bonds recover 30-50 cents; subordinated bonds may recover 10-20 cents. Recovery depends on the company's asset base, the capital structure's seniority, and the specific nature of the distress.</p>`,
  },
  {
    title: 'The Yield Curve and Term Structure',
    content: `<p>The <strong>yield curve</strong> plots the yields of government bonds across different maturities (1-month, 2-year, 5-year, 10-year, 30-year). Normally, the curve slopes upward (longer maturities offer higher yields because investors demand compensation for locking up capital and bearing more interest rate risk). An <strong>inverted yield curve</strong> (short-term rates above long-term rates) is historically one of the most reliable recession indicators.</p>

<p>The yield curve reflects market expectations for future interest rates, inflation, and economic growth. Fixed income portfolio managers spend considerable time analyzing the yield curve's shape and positioning portfolios to benefit from expected curve movements (steepening, flattening, or shifting).</p>`,
  },
];
