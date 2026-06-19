export const RE_LEASES_SECTIONS = [
  {
    title: 'Gross vs Net Leases',
    content: `<p>The lease is the contract that turns a building into an income stream, so lease structure determines who bears which costs, how stable the cash flow is, and how much the landlord must spend. The first axis is how operating expenses are split between landlord and tenant, which runs along a spectrum from gross to net.</p>

<table class="comparison-table">
<tr><th>Lease type</th><th>Who pays operating expenses</th><th>Landlord exposure</th><th>Common in</th></tr>
<tr><td>Gross (full service)</td><td>Landlord pays all opex out of the rent</td><td>High: landlord bears expense inflation</td><td>Office, multifamily</td></tr>
<tr><td>Modified gross</td><td>Split; tenant pays some (often utilities), landlord pays the rest</td><td>Moderate</td><td>Office</td></tr>
<tr><td>Single net (N)</td><td>Tenant pays property taxes</td><td>Reduced</td><td>Commercial</td></tr>
<tr><td>Double net (NN)</td><td>Tenant pays taxes and insurance</td><td>Low</td><td>Retail, industrial</td></tr>
<tr><td>Triple net (NNN)</td><td>Tenant pays taxes, insurance, and maintenance</td><td>Minimal: landlord just collects rent</td><td>Retail, industrial, single-tenant</td></tr>
</table>

<div class="key-concept"><strong>Why this matters for value:</strong> under a triple-net lease the tenant bears the operating costs and their inflation, so the landlord's NOI is stable and predictable and requires little active management; these income streams are bond-like and trade at lower cap rates (higher prices). Under a gross lease the landlord absorbs operating costs and their inflation, so rising expenses eat into NOI unless rent escalations keep pace, making the income less predictable. When you compare two properties, the lease structure tells you who is exposed to expense growth, and therefore how risky and how valuable the income stream is. A NNN lease to a strong credit tenant is close to a corporate bond; a gross lease in an inflationary period is a margin squeeze waiting to happen.</div>

<div class="pro-tip">"Walk me through the difference between a gross and a triple-net lease" is a staple. The crisp answer: in a gross lease the landlord pays operating expenses out of the rent and bears expense inflation; in a triple-net lease the tenant pays taxes, insurance, and maintenance on top of rent, so the landlord's income is stable and bond-like, which is why net-leased assets trade at lower cap rates.</div>`,
  },
  {
    title: 'Critical Lease Terms',
    content: `<p>Beyond the gross-to-net split, a handful of lease terms drive the economics and the risk, and reading a lease (or a rent roll summarizing many leases) means hunting for these.</p>

<ul>
<li><strong>Base rent and escalations.</strong> The starting rent and how it grows: fixed annual bumps (say 3 percent), CPI-linked increases, or step-ups. Escalations are the landlord's protection against inflation and a key driver of NOI growth, especially under long leases.</li>
<li><strong>Term and options.</strong> The lease length plus any renewal options (which favor the tenant, who can stay at a pre-set rent) or termination options (which create risk for the landlord). Options shift bargaining power and cash-flow certainty.</li>
<li><strong>Free rent (concessions).</strong> Months of waived rent used to entice tenants, common in soft markets. Free rent makes face rent overstate the true economics, which is why effective rent matters (below).</li>
<li><strong>Tenant improvement allowance (TI).</strong> Landlord dollars to build out the space, often large in office and retail, a major cash cost concentrated at signing.</li>
<li><strong>Leasing commissions (LCs).</strong> Broker fees to sign or renew, another upfront cash cost.</li>
<li><strong>Percentage rent.</strong> In retail, additional rent equal to a percentage of the tenant's sales above a breakpoint, giving the landlord upside tied to tenant performance.</li>
<li><strong>Expense recoveries (CAM).</strong> In net and modified leases, the tenant's reimbursement of common area maintenance and other operating costs.</li>
</ul>

<div class="key-concept"><strong>Face rent vs effective rent.</strong> The headline (face) rent overstates what the landlord actually nets once you account for free rent, TIs, and LCs. <strong>Net effective rent</strong> spreads those concessions and costs over the lease term to show the true economic rent. A lease at a high face rent with six months free and a large TI package can have a much lower effective rent than a lower-face-rent lease with no concessions. Sophisticated analysis always looks at effective rent, because that is what actually reaches NOI and cash flow.</div>`,
  },
  {
    title: 'Rent Roll and Rollover Analysis',
    content: `<p>For a multi-tenant property, the <strong>rent roll</strong> is the master schedule of every lease: tenant, space, rent, escalations, term, and expiration. Analyzing it is core analyst work, and the most important thing it reveals is the rollover (expiration) profile.</p>

<div class="key-concept"><strong>Lease rollover is risk, and a lease expiration schedule is the first thing to study.</strong> When leases expire, the landlord faces the chance of vacancy, the cost of re-leasing (TIs and LCs), and the risk of re-leasing at lower rates in a weak market, or the opportunity to mark up below-market rents in a strong one. A property where many leases roll in the same year carries concentrated risk: a single bad leasing market at the wrong moment can hit NOI hard. A staggered, laddered expiration profile is far safer, spreading rollover risk across years. This is why office, with long leases but lumpy, expensive rollover, is more capital-intensive and riskier than its lease length alone suggests.</div>

<p>Two summary metrics capture the rollover picture:</p>

<table class="comparison-table">
<tr><th>Metric</th><th>What it measures</th><th>Why it matters</th></tr>
<tr><td>WALT / WAULT</td><td>Weighted average lease term remaining</td><td>Longer = more income certainty; a key value driver for net-lease and office</td></tr>
<tr><td>Rollover schedule</td><td>% of leases/income expiring each year</td><td>Concentrated rollover = concentrated risk; laddered = safer</td></tr>
</table>

<p><strong>Mark-to-market</strong> is the related opportunity: if in-place rents sit below current market rents, the landlord can raise them to market as leases roll, a built-in source of NOI growth that underpins many value-add theses. The reverse (in-place rents above a softening market) is downside risk, because rolling leases will reset lower.</p>

<div class="pro-tip">When handed a rent roll in a case, the moves that signal competence: check the expiration ladder for concentration, compare in-place rents to market to spot mark-to-market upside or downside, assess tenant credit quality and concentration, and note the WALT. Those four reads tell you most of what you need about the income's durability and upside.</div>`,
  },
  {
    title: 'Tenant Credit and Concentration',
    content: `<p>An income stream is only as good as the tenants paying it, so tenant credit quality and concentration are central to how risky, and how valuable, a property's cash flow is.</p>

<p><strong>Credit quality</strong> refers to the financial strength of the tenants. A single-tenant building leased long-term to an investment-grade corporation produces income nearly as safe as that company's bonds, which is why <strong>credit tenant</strong> net-lease assets trade at low cap rates. A property full of small, unrated local tenants carries more default risk and trades at a higher cap rate. The lease is a promise to pay, and the promise is worth what the promisor's credit is worth.</p>

<div class="key-concept"><strong>Tenant concentration</strong> is the flip side: how much of the income depends on a single tenant or a few. A property where one tenant is 60 percent of the rent carries concentration risk, because that one tenant leaving or defaulting devastates NOI. Diversified income across many tenants is more resilient, though it usually comes with higher management intensity and re-leasing activity. When analyzing a deal, you weigh the stability of concentrated credit-tenant income against the resilience of diversified income, and the cap rate should reflect that tradeoff.</div>

<div class="mistake-box"><strong>Watch for:</strong> a headline NOI that looks strong but rests on a single tenant whose lease expires soon, or whose credit is weak. The income exists today but may not survive the next rollover. Always pair the NOI with who is paying it, how long they are committed, and how strong they are. A high cap rate on a single-tenant asset is often the market pricing exactly this risk.</div>`,
  },
];
