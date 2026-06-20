export const ST_EQUITIES_SECTIONS = [
  {
    title: 'Cash Equities: The Basics',
    content: `<p>Equities are ownership stakes in companies, and the cash equities business is buying and selling those shares for clients. It is the most familiar and intuitive market, which makes it a good place to build fluency before the more abstract products.</p>

<p>A share of stock is a claim on a company's profits and assets, residual after everyone else (lenders, bondholders) is paid. Shareholders can receive <strong>dividends</strong> (a share of profits paid out) and benefit from price appreciation if the company grows in value. Stocks trade on exchanges in a transparent, liquid, mostly electronic market, which is why so much of equities trading is high-volume and technology-driven.</p>

<div class="key-concept">The equities desk operates in two main modes: <strong>agency</strong> and <strong>principal</strong>. In <strong>agency</strong> trading, the desk executes a client's order in the market on their behalf and charges a commission, without taking the stock onto its own books; the desk is a broker. In <strong>principal</strong> (or risk) trading, the desk uses its own capital to take the other side of the client's trade, providing immediate liquidity and earning the spread while taking on the position's risk. Much of cash equities is agency and commission-driven (especially given how electronic and liquid stocks are), which distinguishes it from the more principal, spread-driven fixed income and derivatives desks.</div>

<div class="example-box">
<div class="example-label">Agency vs principal</div>
<p>A fund wants to buy 500,000 shares. In <strong>agency</strong> mode, the desk works the order into the market over time, sourcing shares at the best prices it can, and charges a per-share commission. In <strong>principal</strong> mode, the desk says "I'll sell you all 500,000 right now at this price," filling the order instantly from its own book and taking the risk of buying back those shares later, earning the spread instead of a commission. The client trades certainty and speed (principal) against potentially better pricing over time (agency).</p>
</div>`,
  },
  {
    title: 'ETFs, ADRs, and Corporate Actions',
    content: `<p>Beyond single stocks, a few instruments and events round out the equities world and come up in interviews as fluency checks.</p>

<ul>
<li><strong>ETFs (exchange-traded funds)</strong> are baskets of securities that trade like a single stock. An ETF tracking an index lets an investor buy the whole index in one trade. They are enormously important to modern equity markets and trading, because they let investors get diversified or thematic exposure cheaply and liquidly, and they create their own trading and arbitrage dynamics (the ETF price is kept in line with the value of its underlying basket by authorized participants who can create and redeem shares).</li>
<li><strong>ADRs (American depositary receipts)</strong> let a foreign company's shares trade on a US exchange in dollars, giving US investors easy access to international names.</li>
<li><strong>Corporate actions</strong> are events that change a stock: dividends, stock splits (dividing each share into more shares at a proportionally lower price), buybacks (the company repurchasing its own shares), and mergers. Traders must handle these because they mechanically affect price and share count.</li>
</ul>

<div class="key-concept">ETFs deserve special attention because they have reshaped equity trading. They are baskets that trade like stocks, which means they sit at the intersection of the cash equity market and the index/portfolio world, and keeping an ETF's price aligned with the value of the securities it holds is a continuous arbitrage that trading desks participate in. The growth of passive, index-tracking ETF investing is one of the biggest structural shifts in markets over the past two decades, and it affects liquidity, flows, and even how individual stocks move (they increasingly move together as money flows into and out of index products).</div>`,
  },
  {
    title: 'Short Selling and Securities Lending',
    content: `<p>Short selling is one of the most important and most misunderstood mechanics in equities, and interviewers love to test whether you really understand it.</p>

<div class="key-concept"><strong>Short selling is how you profit from a price falling.</strong> You borrow shares you do not own (from someone who does, via securities lending), sell them at today's price, and aim to buy them back later at a lower price to return to the lender, keeping the difference. If a stock is at 100 and you short it, then buy it back at 70, you made 30 (before borrowing costs). The catch is the risk profile: your downside is theoretically unlimited, because if the stock rises instead, you must eventually buy it back at a higher price, and there is no ceiling on how high it can go. A long position can only fall to zero (you lose what you put in); a short position can lose far more than the initial proceeds if the stock keeps climbing.</div>

<p><strong>Securities lending</strong> is the plumbing that makes shorting possible: long-term holders lend their shares to short sellers for a fee, earning extra income on positions they were holding anyway. The short seller pays that borrow fee, which can be high for stocks that are hard to borrow (heavily shorted names). Prime brokerage, below, is the business that facilitates this for hedge funds.</p>

<div class="warning-box">A <strong>short squeeze</strong> is the danger that makes shorting treacherous. If a heavily shorted stock starts rising, short sellers rushing to buy back shares to cap their losses create a wave of buying that pushes the price even higher, forcing more shorts to cover, and so on. The feedback loop can send a price violently upward, detached from fundamentals, and inflict huge losses on shorts. Understanding the asymmetry (limited upside, unlimited downside) and the squeeze dynamic is essential, and it is a favorite interview topic.</div>`,
  },
  {
    title: 'Equity Derivatives and Prime Brokerage',
    content: `<p>Two adjacent businesses complete the equities picture, and both are common interview territory.</p>

<p><strong>Equity derivatives</strong> are contracts whose value derives from an underlying stock or index, principally options and futures (covered in depth in the derivatives modules). On the equities floor, the equity derivatives desk uses these instruments to let clients hedge, speculate, or gain tailored exposure: buying protection against a portfolio falling, earning income by selling options, or getting leveraged exposure to a stock or index. They are a higher-margin, more quantitative business than plain cash equities, because pricing and risk-managing options requires the Greeks and volatility modeling.</p>

<div class="key-concept"><strong>Prime brokerage</strong> is the suite of services banks provide to hedge funds: lending them securities to short, lending them cash to lever up (margin financing), clearing and settling their trades, and holding their assets. It is a cornerstone relationship business, because a hedge fund's prime broker is central to its ability to operate, and the fees and financing spreads are substantial and relatively stable. Prime brokerage is also where securities lending lives: the prime broker sources the shares hedge funds borrow to short. It is worth knowing because it connects the equities business to the hedge fund client base and to the financing and lending mechanics that underpin shorting and leverage.</div>

<div class="takeaway-box">A clean way to hold the equities world together: cash equities (buying and selling shares, agency or principal), the instruments around them (ETFs, ADRs), the mechanics that enable strategies (short selling and securities lending), the derivatives layer (options and futures for hedging and exposure), and the hedge fund service business (prime brokerage) that ties financing, lending, and shorting together. That structure lets you speak fluently about how an equities floor actually operates.</div>`,
  },
];
