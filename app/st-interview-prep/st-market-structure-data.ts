export const ST_MARKET_STRUCTURE_SECTIONS = [
  {
    title: 'Primary vs Secondary, Exchange vs OTC',
    content: `<p>Before the products, you need the map of where trading actually happens. Two distinctions organize the whole landscape, and they come up constantly.</p>

<p><strong>Primary versus secondary market.</strong> The primary market is where securities are first created and sold: a company issuing new shares in an IPO, or a government auctioning new bonds. The secondary market is where those existing securities then trade between investors. S&T lives overwhelmingly in the secondary market, providing the ongoing liquidity that lets investors buy and sell after issuance. (Investment banking, by contrast, runs the primary issuance.)</p>

<table class="comparison-table">
<tr><th></th><th>Exchange-traded</th><th>Over-the-counter (OTC)</th></tr>
<tr><td>Where</td><td>A centralized exchange (e.g. a stock exchange)</td><td>Directly between two parties, dealer to client</td></tr>
<tr><td>Standardization</td><td>Standardized contracts</td><td>Customizable terms</td></tr>
<tr><td>Transparency</td><td>High; public prices and volumes</td><td>Lower; prices negotiated privately</td></tr>
<tr><td>Typical products</td><td>Stocks, listed options, futures</td><td>Bonds, swaps, FX, bespoke derivatives</td></tr>
<tr><td>Counterparty risk</td><td>Reduced by a central clearinghouse</td><td>Borne by the parties (mitigated by clearing where required)</td></tr>
</table>

<div class="key-concept">The core tradeoff between the two is <strong>standardization and transparency versus customization and flexibility</strong>. Exchanges offer standardized, transparent, anonymous trading with a clearinghouse guaranteeing the trade, which is efficient for liquid, uniform products like stocks and futures. OTC markets let two parties negotiate bespoke terms directly, which is necessary for things like a custom-sized interest rate swap or a specific corporate bond, at the cost of less transparency and more reliance on the dealer. A great deal of S&T, especially fixed income, FX, and derivatives, happens OTC with the bank acting as the dealer, which is exactly why banks are central to those markets.</div>

<div class="takeaway-box">A simple mental model: stocks and listed options and futures trade on exchanges; bonds, swaps, FX, and customized derivatives largely trade OTC. When a product is uniform and heavily traded, it suits an exchange; when it needs to be tailored, it lives OTC and a dealer makes the market.</div>`,
  },
  {
    title: 'The Order Book and the Bid-Ask Spread',
    content: `<p>At the heart of trading is the order book: the live list of all the buy and sell orders for a security, organized by price. Understanding it makes the bid-ask spread, liquidity, and market-making click into place.</p>

<div class="framework-box"><div class="fw-label">READING THE BOOK</div>The <strong>bid</strong> is the highest price buyers are currently willing to pay. The <strong>ask</strong> (or offer) is the lowest price sellers are willing to accept. The gap between them is the <strong>bid-ask spread</strong>. Below the best bid sit more buyers at lower prices; above the best ask sit more sellers at higher prices. The book is the real-time supply and demand for the security at every price level.</div>

<div class="key-concept">The <strong>bid-ask spread is the price of liquidity and the market-maker's edge</strong>. A market maker quotes both a bid and an ask, standing ready to buy at the bid and sell at the ask. If trades come in on both sides, the maker earns the spread without needing the price to move. The size of the spread reflects how liquid and risky the security is: highly liquid names (a major stock, a benchmark bond) have razor-thin spreads because competition is fierce and risk is low; illiquid or volatile securities have wide spreads to compensate the maker for the risk of getting stuck with a position. So the spread is simultaneously the cost a trader pays to transact immediately and the compensation a market maker earns for providing that immediacy.</div>

<div class="example-box">
<div class="example-label">Crossing the spread</div>
<p>A stock shows 20.00 bid / 20.05 ask. If you must buy right now, you pay 20.05 (you "cross the spread" and "lift the offer"). If you must sell right now, you receive 20.00 (you "hit the bid"). The 0.05 difference is what immediacy costs you and what the liquidity provider earns. If instead you are patient, you can post a bid at 20.01 and wait for a seller to come to you, improving your price but risking that the trade never happens.</p>
</div>`,
  },
  {
    title: 'Order Types and Liquidity',
    content: `<p>How you place an order determines the tradeoff between certainty of execution and certainty of price. The two foundational order types map directly onto the order book.</p>

<table class="comparison-table">
<tr><th>Order type</th><th>What it does</th><th>Tradeoff</th></tr>
<tr><td>Market order</td><td>Execute immediately at the best available price</td><td>Guarantees execution, not price; crosses the spread and can suffer slippage</td></tr>
<tr><td>Limit order</td><td>Execute only at a specified price or better</td><td>Guarantees price, not execution; may never fill</td></tr>
</table>

<p>A market order takes liquidity (it removes orders from the book by matching against them); a limit order can provide liquidity (it adds an order to the book for others to trade against). This is the difference between being a liquidity taker and a liquidity provider, and it is the same distinction as paying the spread versus earning it. Other order types (stop orders, which trigger at a level; fill-or-kill; and so on) are refinements, but market and limit are the foundation.</p>

<div class="key-concept"><strong>Liquidity</strong> is the single most important property of a market: how easily and cheaply you can trade size without moving the price. A liquid market has tight spreads, deep order books (lots of size available at each price), and high volume, so you can buy or sell large amounts with minimal impact. An illiquid market has wide spreads, thin books, and low volume, so even a modest order moves the price against you, an effect called <strong>market impact</strong> or <strong>slippage</strong>. Liquidity is exactly what S&T desks provide, and it is why their service is valuable: they let big investors transact size without crushing the price.</div>

<div class="warning-box">A common confusion: more volume does not always mean more liquidity at the moment you need it. A market can be deep on calm days and evaporate in a crisis, when everyone wants to sell at once and the book thins out. This "liquidity disappearing exactly when you need it" is a recurring theme in markets and a reason risk managers stress-test for it.</div>`,
  },
  {
    title: 'Clearing, Settlement, and the Players',
    content: `<p>Two pieces of plumbing complete the picture: what happens after a trade is agreed, and who is on each side of the market.</p>

<p><strong>Clearing and settlement</strong> are the back-end steps that turn an agreed trade into a completed one. <strong>Clearing</strong> is the process of confirming the trade and managing the obligations between buyer and seller, often through a central <strong>clearinghouse</strong> that steps in between the two parties and guarantees the trade, dramatically reducing the risk that one side defaults (counterparty risk). <strong>Settlement</strong> is the actual exchange: the buyer's cash for the seller's security, which happens a set number of days after the trade. The clearinghouse is a quietly crucial piece of market safety, because it means you do not have to worry about whether the anonymous party on the other side of your exchange trade will actually pay.</p>

<div class="key-concept"><strong>Buy-side versus sell-side</strong> is the organizing distinction of who is who. The <strong>sell-side</strong> is the banks and dealers, including S&T desks, that make markets, provide liquidity, and sell products and services to investors. The <strong>buy-side</strong> is the investors, the hedge funds, asset managers, pension funds, and insurers, that buy those services and put capital to work. An S&T desk is sell-side: its clients are the buy-side. When a hedge fund (buy-side) wants to put on a position, it calls a bank's desk (sell-side) for a price. Knowing which side you are interviewing for, and that S&T is sell-side serving buy-side clients, is basic fluency.</div>

<div class="takeaway-box">Tie the plumbing back to the business: clearinghouses reduce counterparty risk, which is why exchange-traded products feel safe to trade anonymously; OTC products carry more counterparty risk, which is part of why dealers (and regulators, post-crisis) care so much about it. And remember the frame: you are the sell-side, providing liquidity and ideas to buy-side clients.</div>`,
  },
];
