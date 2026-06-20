export const ST_FUTURES_SWAPS_SECTIONS = [
  {
    title: 'Forwards and Futures',
    content: `<p>Forwards and futures are the simplest derivatives: agreements to buy or sell something at a set price on a future date. Where an option is a right, a forward or future is an <strong>obligation</strong>, both sides must transact at the agreed price when the contract comes due. That difference, obligation versus right, is the cleanest way to separate them from options.</p>

<table class="comparison-table">
<tr><th></th><th>Forward</th><th>Future</th></tr>
<tr><td>Where it trades</td><td>OTC, private between two parties</td><td>On an exchange, standardized</td></tr>
<tr><td>Customization</td><td>Fully customizable</td><td>Standardized size and dates</td></tr>
<tr><td>Counterparty risk</td><td>Borne by the parties</td><td>Reduced by the clearinghouse</td></tr>
<tr><td>Settlement</td><td>At maturity</td><td>Marked-to-market daily via margin</td></tr>
</table>

<div class="key-concept">A future is essentially a standardized, exchange-traded forward with one crucial mechanical difference: <strong>daily marking-to-market</strong>. Each day, gains and losses on a futures position are settled in cash through a margin account, so profits and losses accrue continuously rather than all at once at maturity. This daily settlement, backed by the clearinghouse, is what removes most of the counterparty risk and makes futures safe to trade anonymously on an exchange. Futures are used everywhere: to hedge (a farmer locking in a crop price, an airline locking in fuel cost) and to speculate or gain exposure efficiently, because they offer leverage (you post only margin, not the full value) and deep liquidity.</div>

<div class="example-box">
<div class="example-label">Hedging with a future</div>
<p>An airline worried about rising fuel costs buys oil futures locking in today's price. If oil rises, the airline pays more for physical fuel but its futures gain offsets the extra cost. If oil falls, it pays less for fuel but loses on the futures. Either way, the cost is locked in, which is the point of a hedge: not to profit, but to remove uncertainty.</p>
</div>`,
  },
  {
    title: 'Contango, Backwardation, and the Curve',
    content: `<p>Futures on the same commodity but with different delivery dates form a curve, and its shape has two names worth knowing, because they come up in commodities and macro discussions.</p>

<div class="framework-box"><div class="fw-label">TWO CURVE SHAPES</div><strong>Contango:</strong> futures prices are higher for later delivery dates (the curve slopes up). Often the normal state, reflecting the costs of storing and financing the commodity until later delivery.<br/><strong>Backwardation:</strong> futures prices are lower for later dates (the curve slopes down). Often signals tight current supply, where buyers pay a premium for immediate delivery.</div>

<div class="key-concept">The shape matters for anyone holding futures over time because of <strong>roll yield</strong>. A futures position must be "rolled" (the expiring contract sold and a later one bought) to maintain exposure. In contango, you repeatedly sell a cheaper expiring contract and buy a more expensive later one, a small recurring cost that drags on returns. In backwardation, the reverse, a tailwind. This is why simply "buying oil" through futures is not the same as the spot price rising: the curve shape can erode or enhance your return regardless of where spot goes. It is a subtle but real effect that trips up people who assume a commodity future tracks the commodity one-for-one.</div>

<div class="takeaway-box">Contango is up-sloping (later is pricier, a roll cost); backwardation is down-sloping (later is cheaper, a roll benefit). The practical lesson: holding commodity futures over time earns or loses roll yield depending on the curve, so the curve shape, not just the spot price, drives returns.</div>`,
  },
  {
    title: 'Interest Rate Swaps',
    content: `<p>Swaps are the largest derivatives market in the world, and the interest rate swap is the workhorse. The concept is simpler than the name suggests.</p>

<div class="key-concept"><strong>An interest rate swap is an agreement between two parties to exchange interest payments:</strong> one pays a fixed rate, the other pays a floating rate (one that resets periodically with the market), both calculated on the same notional amount. No principal changes hands; only the interest payments are exchanged. The party paying fixed and receiving floating benefits if rates rise (they locked in a fixed cost while receiving more as floating climbs); the party paying floating and receiving fixed benefits if rates fall. Swaps let companies and investors transform their interest rate exposure, for example, a company with a floating-rate loan can swap into a fixed obligation to remove the uncertainty of rising rates.</div>

<div class="example-box">
<div class="example-label">Why a company swaps</div>
<p>A company has a floating-rate loan and fears rates will rise. It enters a swap to pay fixed and receive floating. Now the floating it receives from the swap offsets the floating it owes on its loan, and it is left paying a predictable fixed rate. It has used a swap to convert floating-rate debt into fixed-rate debt without refinancing the loan. The bank's swaps desk is the counterparty, and it hedges and manages the resulting risk.</p>
</div>

<p>For a trader, a swap is fundamentally a duration instrument: paying fixed in a swap behaves much like being short a bond (you profit when rates rise), and receiving fixed behaves like being long a bond. So swaps slot directly into the rates framework from the fixed income module, they are another way to take and hedge interest rate risk, with the advantage of being customizable and capital-efficient.</p>

<div class="takeaway-box">The one-line version: an interest rate swap exchanges fixed for floating interest on a notional amount, letting parties transform rate exposure. Paying fixed profits if rates rise; receiving fixed profits if rates fall. Think of it as a flexible, customizable cousin of a bond position in duration terms.</div>`,
  },
  {
    title: 'Credit Default Swaps and Other Swaps',
    content: `<p>Beyond interest rate swaps, a few other swap types complete the picture, with credit default swaps being the most important to understand.</p>

<div class="key-concept"><strong>A credit default swap (CDS) is insurance against a borrower defaulting.</strong> The buyer of protection pays a regular premium to the seller; in return, if the underlying borrower (a company or government) defaults, the seller pays out to cover the loss. It functions exactly like an insurance policy on a bond. A CDS lets an investor hedge the credit risk of a bond they own (buying protection), or take a view on a borrower's creditworthiness without owning its bonds at all (buying protection to bet on deterioration, or selling protection to bet on health). The price of a CDS, the premium, is a direct market read on default risk: as a borrower looks shakier, its CDS premium rises. CDS became infamous in the 2008 crisis because they were written in enormous, opaque volumes on mortgage-related risk, but the instrument itself is simply traded credit insurance.</div>

<p>Other notable swaps include <strong>total return swaps</strong> (one party gets the total return of an asset, including price changes and income, in exchange for a financing fee, a way to gain exposure to an asset without owning it), and <strong>currency swaps</strong> (exchanging principal and interest in one currency for another). The common thread across all swaps: they let parties exchange one kind of cash flow or exposure for another, customized to need, which is why they are such a vast and flexible market and why a bank's swaps desks are central to it.</p>

<div class="takeaway-box">Know the CDS cold: it is insurance on a borrower's default, the premium reflects perceived default risk, and it lets you hedge or speculate on credit without owning the bond. More broadly, every swap is an exchange of cash flows or exposures, fixed for floating, one asset's return for financing, one currency for another, tailored to what a client needs to transform.</div>`,
  },
];
