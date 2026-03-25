export const PE_LBO_SECTIONS = [
  {
    title: `1. The LBO Engine (Why it Works)`,
    content: `<p>A Leveraged Buyout (LBO) is simply buying a house to flip it, but using an extreme amount of mortgage debt so your personal down-payment is tiny. Because your initial cash check is small, any increase in the house's value when you sell it results in a massive Percentage Return (IRR) on your initial cash.</p>
<br/>
<p><strong>The 3 Drivers of LBO Returns (Memorize this order):</strong><br/>
1. <strong>Leverage (Debt Paydown):</strong> Using the acquired company's cash flows to pay down the debt principal over 5 years. This transfers enterprise value from Debt holders to Equity holders. <br/>
2. <strong>EBITDA Growth:</strong> Growing the actual profit engine of the business (either by cutting costs or raising prices).<br/>
3. <strong>Multiple Arbitrage:</strong> Selling the company at a higher valuation multiple (e.g., 12x EBITDA) than you bought it for (e.g., 10x EBITDA). PE firms <em>never</em> model multiple expansion in their base cases because it relies on macroeconomic luck, but it is the holy grail of returns.</p>`
  },
  {
    title: `2. Paper LBOs (Mental Math Rules of Thumb)`,
    content: `<p>In Megafund PE interviews (Apollo, KKR, Blackstone), you will be asked to do an LBO entirely on paper without a calculator in 10 minutes. You must memorize these IRR rules of thumb.</p>
<br/>
<p><strong>The Internal Rate of Return (IRR) Shortcuts (assuming a 5-year hold):</strong><br/>
• <strong>2.0x MoIC (Cash-on-Cash Return):</strong> $\\approx 15\\%$ IRR. (This is the industry baseline. If a deal doesn't hit 2.0x / 15%, the Investment Committee will reject it).<br/>
• <strong>2.5x MoIC:</strong> $\\approx 20\\%$ IRR.<br/>
• <strong>3.0x MoIC:</strong> $\\approx 25\\%$ IRR.<br/>
• <strong>4.0x MoIC:</strong> $\\approx 32\\%$ IRR.</p>
<br/>
<p><em>Example Paper Prompt:</em> "Company has $100M EBITDA. Entry multiple is 10x. We use 4x leverage. In 5 years, EBITDA grows to $150M. We pay down $100M of debt. Exit multiple is 10x. What is our MoIC and IRR?"</p>
<p><em>Solution:</em><br/>
1. Purchase Enterprise Value (EV) = 10 * 100M = $1,000M.<br/>
2. Entry Debt = 4x * 100M = $400M.<br/>
3. Entry Equity (Our Cash) = $1000M - $400M = <strong>$600M</strong>.<br/>
<br/>
4. Exit EV = 10 * 150M = $1,500M.<br/>
5. Exit Debt = $400M (Entry) - $100M (Paydown) = $300M.<br/>
6. Exit Equity = $1500M - $300M = <strong>$1,200M</strong>.<br/>
<br/>
7. MoIC = $1200M / $600M = <strong>2.0x</strong>. Therefore, IRR = <strong>~15%</strong> over 5 years.</p>`
  },
  {
    title: `3. The Cost of Debt (Senior vs Mezzanine)`,
    content: `<p>Debt is cheap, but it dramatically increases the risk of bankruptcy. You must understand the capital structure hierarchy.</p>
<br/>
<p><strong>1. Senior Term Loans:</strong> Cheapest debt (e.g., SOFR + 400 bps). Secured by the company's hard assets (factories, IP). They get paid out <em>first</em> in a bankruptcy. Typically amortize at 1% per year.</p>
<br/>
<p><strong>2. Subordinated / Mezzanine Debt:</strong> Highly expensive debt (10-14% interest). Unsecured. These guys get wiped out in a bankruptcy before Senior lenders take a haircut. Often includes "Warrants" (equity upside kickers).</p>
<br/>
<p><strong>3. PIK (Payment-In-Kind) Interest:</strong> A critical nitty-gritty concept. Instead of paying cash interest every year, the company "pays" by adding the interest to the principal loan balance. <br/>
<em>Why use PIK?</em> It saves cash flow in the short term, allowing the company to survive temporarily, but the debt balance compounds ferociously. It is highly toxic but extremely lucrative for the lender if the company survives.</p>`
  },
  {
    title: `4. Management Rollover & Option Pools`,
    content: `<p>PE firms never want to buy a company and run it themselves. They buy it and incentivize the existing CEO/Management team to work 100-hour weeks. This is done via Rollovers and Option Pools.</p>
<br/>
<p><strong>Management Rollover:</strong><br/>
When PE buys out a founder, they rarely let the founder cash out 100%. They force the founder to take, say, 20% of their payout and reinvest it ("roll it over") into the new equity structure. This aligns incentives because if the company goes bankrupt under PE ownership, the founder loses their 20% along with the PE firm.</p>
<br/>
<p><strong>The Management Option Pool (Promote):</strong><br/>
An equity carve-out (typically 10-15% of total exit equity) given to management <em>if and only if</em> the PE firm hits their 2.0x/15% IRR baseline. This heavily dilutes the PE firm's total return, so you MUST subtract the Option Pool from the Exit Equity before calculating your final MoIC in advanced modeling tests.</p>`
  },
  {
    title: `5. Net Working Capital (NWC) Pegs`,
    content: `<p>This is where Megafund modeling tests fail candidates. When you buy a company, you are buying a moving machine.</p>
<br/>
<p><strong>The Concept:</strong> Net Working Capital = Current Assets (excluding cash) - Current Liabilities (excluding debt). It represents the cash tied up in day-to-day operations (inventory sitting in a warehouse, unpaid invoices from customers).</p>
<br/>
<p><strong>The NWC Target Peg:</strong> If a company requires $10M of NWC on average to survive, but on the exact day you buy it they only have $8M (maybe they paid a massive vendor bill early), there is a $2M shortfall. The PE firm will force the Seller to leave $2M of their own cash on the balance sheet to "peg" the NWC back to normal. If you do not account for NWC fluctuations in your free cash flow (FCF) build, your debt schedule will collapse.</p>`
  }
];
