export const GE_DEAL_STRUCTURE_SECTIONS = [
  {
    title: 'Types of Securities',
    content: `<p>Growth equity investments are typically made through <strong>preferred stock</strong>&mdash;a class of equity that sits above common stock in the capital structure and carries specific rights and preferences. The most important structural features:</p>

<h4>Liquidation Preference</h4>

<p>The liquidation preference determines what the investor receives before common shareholders in a sale or liquidation event. The most common structure is <strong>1x non-participating preferred</strong>: the investor receives back their invested capital (1x) before common shareholders receive anything, but the investor can also choose to convert to common stock and participate pro-rata if the conversion value exceeds the preference amount.</p>

<p><strong>Participating preferred</strong> (sometimes called "double-dip") gives the investor their liquidation preference <em>plus</em> their pro-rata share of the remaining proceeds as if they had converted to common. This is more favorable for the investor and more dilutive for the founder/common holders. Participating preferred is less common in GE than in VC because founders with strong businesses have more negotiating leverage.</p>

<div class="example-box">
<div class="example-label">Liquidation Preference Example</div>
<p>An investor puts in $50M for 25% of a company (implying a $200M post-money valuation) with 1x non-participating preferred.</p>
<p><strong>Scenario A &mdash; Company sells for $100M:</strong> Preference: $50M to the investor, $50M to common (the founder and employees). The investor's 25% conversion value would only be $25M (25% of $100M), so the preference ($50M) is better. The investor takes the preference. <strong>Investor gets: $50M (1.0x return).</strong></p>
<p><strong>Scenario B &mdash; Company sells for $400M:</strong> Preference: $50M to the investor, $350M to common. But the investor's conversion value is $100M (25% of $400M), which exceeds the $50M preference. The investor converts to common. <strong>Investor gets: $100M (2.0x return).</strong></p>
<p>Non-participating preferred acts as downside protection (you get your money back in a bad scenario) with full upside participation (you convert and share proportionally in a good scenario).</p>
</div>

<h4>Anti-Dilution Protection</h4>

<p>Protects the investor if the company raises a future round at a lower valuation (a "down round"). <strong>Full ratchet</strong> adjusts the investor's conversion price to exactly the new, lower price&mdash;very punitive to founders and other existing shareholders. <strong>Weighted average</strong> (more common) adjusts the conversion price based on a formula that accounts for how much capital is raised at the lower price relative to total shares outstanding. Weighted average is the standard in GE deals.</p>

<h4>Board Representation</h4>

<p>GE investors typically receive one or two board seats. Even with a minority stake, board representation provides governance influence: the ability to approve (or block) major decisions like additional fundraising, acquisitions, executive hiring/firing, annual budgets, and the decision to sell the company.</p>

<h4>Protective Provisions (Veto Rights)</h4>

<p>Even without board control, GE investors negotiate protective provisions requiring their consent for specific actions: selling the company, raising additional capital (which would dilute them), taking on debt above a threshold, changing the business materially, issuing stock options beyond the approved pool, or entering into related-party transactions. These provisions give the minority investor de facto control over the most consequential decisions.</p>

<h4>Information Rights and Reporting</h4>

<p>The right to receive regular financial reports (monthly or quarterly P&L, balance sheet, cash flow, KPI dashboard), annual audited statements, and the annual budget/operating plan. This seems mundane but is critical for monitoring the investment post-close.</p>

<h4>Pro-Rata Rights and Pay-to-Play</h4>

<p><strong>Pro-rata rights</strong> give the investor the right (but not obligation) to invest their proportional share in future fundraising rounds to avoid dilution. <strong>Pay-to-play</strong> provisions require the investor to participate in future rounds or lose certain rights (like anti-dilution protection or board seats). These provisions align investor and company interests by ensuring continued support.</p>`,
  },
  {
    title: 'Valuation Mechanics',
    content: `<p>Growth equity valuations are typically expressed as a <strong>pre-money valuation</strong> (the company's value before the investment) and <strong>post-money valuation</strong> (pre-money + the investment amount). If a GE firm invests $50M at a $200M post-money valuation, the pre-money is $150M, and the investor owns $50M / $200M = 25%.</p>

<p>Valuation multiples for GE companies are usually based on <strong>revenue</strong> (since most are pre-profit or barely profitable). Common ranges for high-quality software companies: 8&ndash;20x forward ARR for companies growing 30&ndash;60%, with exceptional companies (80%+ growth, 120%+ NRR) commanding 20&ndash;40x+ in strong markets. Non-software growth companies are typically valued at 3&ndash;10x forward revenue depending on growth, margins, and sector.</p>`,
  },
];
