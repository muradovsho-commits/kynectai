export const ST_DERIVATIVES_SECTIONS = [
  {
    title: 'Options Fundamentals',
    content: `<p>An <strong>option</strong> is a contract that gives the holder the <em>right</em> (but not the obligation) to buy or sell an underlying asset at a specified price (the <strong>strike price</strong>) on or before a specified date (the <strong>expiration</strong>).</p>

<p>A <strong>call option</strong> gives the right to buy. You buy a call when you're bullish. A <strong>put option</strong> gives the right to sell. You buy a put when you're bearish (or want to hedge a long position).</p>

<p>The buyer pays a <strong>premium</strong> for this right. The seller (writer) collects the premium and takes on the obligation. The buyer's maximum loss is the premium paid. The seller's maximum loss can be unlimited (for a naked call) or substantial (for a put).</p>

<h4>Option Pricing: The Five Inputs</h4>

<p>Option prices are determined by five variables. You must know these cold:</p>

<table class="comparison-table">
<tr><th>Input</th><th>Effect on Call Price</th><th>Effect on Put Price</th><th>Intuition</th></tr>
<tr><td><strong>Underlying Price ↑</strong></td><td>Increases</td><td>Decreases</td><td>Higher stock = call is more valuable, put less</td></tr>
<tr><td><strong>Strike Price ↑</strong></td><td>Decreases</td><td>Increases</td><td>Higher strike = harder to profit from call, easier for put</td></tr>
<tr><td><strong>Time to Expiration ↑</strong></td><td>Increases</td><td>Increases</td><td>More time = more chance of favorable move</td></tr>
<tr><td><strong>Volatility ↑</strong></td><td>Increases</td><td>Increases</td><td>More uncertainty = option worth more (bigger potential payoffs)</td></tr>
<tr><td><strong>Interest Rate ↑</strong></td><td>Increases (slightly)</td><td>Decreases (slightly)</td><td>Higher rates reduce PV of strike (helps calls, hurts puts)</td></tr>
</table>

<h4>The Greeks</h4>

<p>The Greeks measure an option's sensitivity to each pricing input:</p>

<p><strong>Delta (Δ):</strong> How much the option price changes for a $1 move in the underlying. A call with delta 0.60 gains $0.60 when the stock rises $1. Delta also approximates the probability that the option expires in-the-money. At-the-money options have deltas near 0.50.</p>

<p><strong>Gamma (Γ):</strong> How much delta changes for a $1 move in the underlying. Gamma is highest for at-the-money options near expiration. High gamma means delta is changing rapidly, which makes hedging more difficult.</p>

<p><strong>Theta (Θ):</strong> How much the option loses in value per day from time decay, all else equal. Options are wasting assets-they lose value as expiration approaches. Theta is highest for at-the-money options near expiration.</p>

<p><strong>Vega (ν):</strong> How much the option price changes for a 1% change in implied volatility. Vega is highest for at-the-money options with longer time to expiration.</p>

<p><strong>Rho (ρ):</strong> Sensitivity to interest rate changes. Generally small and less tested in interviews.</p>

<h4>Put-Call Parity</h4>

<p>The fundamental relationship linking calls, puts, the underlying, and the risk-free rate:</p>

<div class="formula-box">
Call − Put = Stock − PV(Strike)<br>
<small>or equivalently: C + PV(K) = P + S</small>
</div>

<p>This equation says: a call plus the present value of the strike price (cash to buy the stock at expiration) equals a put plus the stock. If this relationship is violated, there's an arbitrage opportunity. Understanding put-call parity helps you quickly reason about option pricing relationships.</p>`,
  },
  {
    title: 'Futures',
    content: `<p>A <strong>futures contract</strong> obligates both the buyer and seller to transact at a specified price on a future date. Unlike options (where the buyer has a choice), futures are binding commitments. Futures are exchange-traded, standardized, and marked to market daily (meaning gains and losses are settled every day through margin accounts).</p>

<p>Key futures markets: equity index futures (S&P 500 E-mini, Nasdaq 100), Treasury futures (2Y, 5Y, 10Y, 30Y), commodity futures (crude oil, natural gas, gold, copper, corn, soybeans), and currency futures.</p>

<p>The <strong>basis</strong> is the difference between the futures price and the spot price. Normally, futures trade at a premium to spot (called <strong>contango</strong>) reflecting the cost of carry (interest, storage). When futures trade below spot (<strong>backwardation</strong>), it often signals tight near-term supply or high near-term demand.</p>`,
  },
  {
    title: 'Interest Rate Swaps',
    content: `<p>An <strong>interest rate swap</strong> exchanges fixed-rate payments for floating-rate payments (or vice versa) between two counterparties. In a plain vanilla swap, Party A pays a fixed rate (the "swap rate") and receives a floating rate (typically SOFR) from Party B, on a specified notional amount.</p>

<p>Swaps are used to: hedge interest rate exposure (a company with floating-rate debt can swap to fixed to lock in costs), express views on rates (if you expect rates to fall, receive fixed in a swap), and manage asset-liability duration mismatches (a bank can use swaps to match the duration of its assets and liabilities).</p>

<p>The <strong>swap rate</strong> is a critical benchmark-it reflects the market's expectation of future short-term rates plus a credit/liquidity premium. The swap curve is closely watched alongside the Treasury curve.</p>`,
  },
  {
    title: 'Credit Default Swaps (CDS)',
    content: `<p>A CDS is insurance against a company defaulting on its debt. The buyer pays a periodic premium (the "CDS spread") to the seller. If the reference entity defaults, the seller pays the buyer the difference between par and the recovery value of the bonds. CDS spreads are a real-time measure of credit risk: wider spreads = higher perceived default probability.</p>

<p>Single-name CDS trade on individual companies. Index CDS (like CDX IG, CDX HY, iTraxx) trade on baskets of names and are highly liquid, serving as the primary hedging instrument for credit portfolios.</p>`,
  },
];
