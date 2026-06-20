export const ST_FIXED_INCOME_SECTIONS = [
  {
    title: 'Bonds and the Price-Yield Relationship',
    content: `<p>A bond is a loan. The issuer (a government or company) borrows money from investors and promises to pay periodic interest (the coupon) and return the principal (the face value) at maturity. Fixed income is the enormous market in these instruments, and it is where a huge share of S&T activity happens, much of it OTC with banks as dealers.</p>

<p>The single most important concept, the one that trips up nearly everyone at first, is that <strong>bond prices and yields move in opposite directions</strong>. The yield is the return an investor earns by holding the bond. Once a bond is issued with a fixed coupon, its price moves in the market so that its yield matches what investors currently demand.</p>

<div class="key-concept"><strong>Why price and yield move inversely.</strong> Picture a bond paying a fixed 5 coupon on 100 face value. If market interest rates rise so new bonds pay 6, no one will pay 100 for your 5 bond when they can get 6 elsewhere, so your bond's price must fall until its effective yield reaches 6. Conversely, if rates fall to 4, your 5 bond is now attractive, and its price rises until its yield drops to 4. The coupon is fixed, so the only thing that can adjust to changing market yields is the price, and it must move opposite to yields. This inverse relationship is the foundation of everything in rates trading: when you hear "rates went up," you should immediately think "bond prices went down."</div>

<div class="example-box">
<div class="example-label">The intuition in numbers</div>
<p>You own a bond paying 5 per year. Rates rise and new bonds pay 6. A buyer comparing your bond to a new one will only buy yours at a discount, because yours pays less; the price drops so that the buyer's total return (the 5 coupon plus the gain from buying below face value) equals the 6 they could get elsewhere. The longer until your bond matures, the more years of "underpaying" must be compensated, so the more its price falls, which leads directly to duration.</p>
</div>`,
  },
  {
    title: 'Duration: Interest Rate Sensitivity',
    content: `<p>If price and yield move inversely, the natural next question is: by how much? That is what duration measures, and it is one of the most tested concepts in any rates interview.</p>

<div class="key-concept"><strong>Duration measures how much a bond's price changes when interest rates change.</strong> Specifically, it approximates the percentage change in price for a 1 percent (100 basis point) change in yield. A bond with a duration of 7 will fall roughly 7 percent in price if rates rise by 1 percent, and rise roughly 7 percent if rates fall by 1 percent. So duration is the bond's <strong>interest rate risk</strong>, expressed as a single number. Higher duration means more sensitivity, bigger price swings for a given rate move.</div>

<p>What drives duration? Mainly time to maturity: the longer until a bond matures, the more its price moves for a given rate change, because more future cash flows are affected and the "mispricing" compounds over more years. Lower coupons also mean higher duration (more of the value sits far in the future). So a long-dated, low-coupon bond is highly rate-sensitive; a short-dated, high-coupon bond is much less so.</p>

<div class="formula-box">Approximate price change = -Duration x Change in yield<br/><br/>Example: Duration 7, yield rises 0.5% (50 bps)<br/>Price change = -7 x 0.5% = -3.5%</div>

<div class="key-concept">Duration is the master risk number on a rates desk because it lets you compare and combine the interest rate risk of very different bonds on one scale, and it lets you hedge. If you hold a portfolio of bonds and want to neutralize its rate risk, you measure its total duration and take an offsetting position with equal and opposite duration. Traders constantly think in duration terms: "I'm long duration" means you profit if rates fall (prices rise), "I'm short duration" means you profit if rates rise. Translating any rates position into its duration is core fluency.</div>

<div class="takeaway-box">If you remember one sentence: duration is the percentage price move for a 1 percent rate move, it rises with maturity, and it is how rates traders measure and hedge interest rate risk. "Long duration, profit when rates fall" should become automatic.</div>`,
  },
  {
    title: 'Convexity: The Refinement',
    content: `<p>Duration is an approximation, and convexity is the correction that makes it more accurate. It sounds intimidating and is actually simple once you see the picture.</p>

<div class="key-concept"><strong>Convexity captures the fact that the price-yield relationship is curved, not a straight line.</strong> Duration assumes a bond's price changes by the same amount whether rates rise or fall, as if the relationship were a straight line. In reality the line curves: as rates fall, prices rise at an accelerating rate, and as rates rise, prices fall at a decelerating rate. This curvature is convexity, and it works in the bondholder's favor. It means a bond gains a bit more when rates fall than duration predicts, and loses a bit less when rates rise than duration predicts. Positive convexity is therefore a good thing to own, and all else equal, more convex bonds are slightly more valuable.</div>

<div class="example-box">
<div class="example-label">Why it matters</div>
<p>A bond has duration 7. Duration alone says a 1 percent rate rise costs 7 percent and a 1 percent fall gains 7 percent, symmetric. Convexity refines this: the actual loss from the rise might be 6.7 percent and the actual gain from the fall 7.3 percent. The asymmetry favors the holder. Over small rate moves the difference is minor, which is why duration is a fine first approximation; over large moves convexity matters a lot, which is why traders managing big books or volatile markets account for it.</p>
</div>

<div class="takeaway-box">The simple version to say in an interview: duration is the straight-line estimate of rate sensitivity; convexity is the curvature correction, and positive convexity helps you (more upside than downside for a given rate move). You rarely need to compute it by hand; you need to explain what it is and why it benefits the bondholder.</div>`,
  },
  {
    title: 'The Yield Curve',
    content: `<p>The yield curve is the picture that organizes the entire rates market: a plot of yield against maturity, showing what interest rate the market demands for lending over different time horizons (say, 2 years versus 10 years versus 30 years).</p>

<div class="framework-box"><div class="fw-label">SHAPES OF THE CURVE</div><strong>Normal (upward-sloping):</strong> longer maturities yield more than shorter ones, compensating investors for the greater risk and uncertainty of lending for longer. This is the usual state.<br/><strong>Flat:</strong> short and long yields are similar, often a sign the market is uncertain or in transition.<br/><strong>Inverted (downward-sloping):</strong> short-term yields exceed long-term yields, an unusual and closely watched state, because it often signals the market expects rates (and growth) to fall, and has historically tended to precede recessions.</div>

<div class="key-concept">The curve matters because it encodes the market's collective expectations about future interest rates, growth, and inflation, and because rates traders position around its shape, not just its level. A <strong>steepener</strong> bets the curve will steepen (long yields rising relative to short); a <strong>flattener</strong> bets it will flatten. Traders care about the difference between two points on the curve (for example, the gap between the 2-year and 10-year yields) as much as the absolute level of rates, because relative-value trades along the curve are a core rates strategy. The short end of the curve is heavily influenced by central bank policy rates; the long end reflects expectations for growth and inflation over time. Reading the curve is reading the market's macro outlook.</div>

<div class="takeaway-box">An inverted yield curve is one of the most famous signals in finance, so be ready to explain it: it means short-term rates are higher than long-term rates, which implies the market expects rates to fall, typically because it expects the economy to weaken, which is why inversions have historically been recession warnings. Knowing the shapes and what they imply is essential rates fluency.</div>`,
  },
  {
    title: 'Credit, Government Bonds, and Repo',
    content: `<p>Three more pieces complete the fixed income map: the kinds of issuers, the role of credit risk, and the financing market that underpins it all.</p>

<p><strong>Government versus corporate bonds.</strong> Government bonds (like US Treasuries) are considered the safest, carrying minimal default risk, and their yields serve as the risk-free benchmark for everything else. Corporate bonds are issued by companies and carry credit (default) risk, so they yield more than government bonds; the extra yield is the <strong>credit spread</strong>, the compensation for the chance the company fails to pay. The riskier the issuer, the wider the spread.</p>

<div class="key-concept"><strong>Rates versus credit</strong> is the key split in fixed income trading. A <strong>rates</strong> desk trades government bonds and rate products, where the main risk is interest rate movements (duration). A <strong>credit</strong> desk trades corporate bonds and credit products, where the main risk is the issuer's creditworthiness (the spread widening or narrowing, or the issuer defaulting). A corporate bond's yield can be thought of as the government (risk-free) yield plus a credit spread, so a credit trader watches both the underlying rates and the spread. This decomposition, total yield equals the risk-free rate plus a credit spread, is one of the most useful frames in fixed income.</p>

<p><strong>Repo (repurchase agreements)</strong> is the short-term financing market that keeps the bond world turning. In a repo, one party sells a bond and agrees to buy it back shortly after at a slightly higher price, effectively a short-term loan collateralized by the bond. Dealers and investors use repo to finance their bond holdings and to fund positions cheaply. It is plumbing, but crucial plumbing: when the repo market seizes up, the whole financial system feels it, as happened in past crises.</p>

<div class="takeaway-box">Hold fixed income together like this: a bond is a loan with an inverse price-yield relationship; duration measures rate sensitivity and convexity refines it; the yield curve encodes expectations across maturities; the rates-versus-credit split divides the trading world (interest rate risk versus default risk); and repo is the financing market underneath. That structure covers the vast majority of what a fixed income interview will probe.</div>`,
  },
];
