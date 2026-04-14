export const VC_TERM_SHEETS_SECTIONS = [
  {
    title: 'Economic Terms',
    content: `<h4>Valuation</h4>

<p><strong>Pre-money valuation:</strong> What the company is worth before the new investment. <strong>Post-money valuation:</strong> Pre-money + investment amount. The investor's ownership = Investment / Post-Money. If a VC invests $10M at a $40M pre-money valuation, the post-money is $50M and the investor owns 20%.</p>

<p>Valuations at the early stages are not based on DCFs or multiples (the company may have no revenue). They're driven by: comparable recent financings (what did similar companies raise at?), the stage and traction of the company, the competitive dynamics of the round (how many VCs want in?), and the reputation and leverage of the founders.</p>

<h4>Liquidation Preference</h4>

<p>Determines what investors receive before common stockholders in a sale or liquidation. <strong>1x non-participating:</strong> The investor gets back their investment first, then can choose to convert to common and share pro-rata, or just take the 1x. This is the standard and most founder-friendly structure. <strong>1x participating ("double-dip"):</strong> The investor gets their money back first AND participates pro-rata in the remaining proceeds as if they had converted. This is more investor-friendly and more dilutive to founders. <strong>Multiple preferences (2x, 3x):</strong> The investor gets 2x or 3x their investment before common participates. Rare in healthy markets; more common in distressed or down-round situations.</p>

<div class="example-box">
<div class="example-label">Liquidation Preference in Action</div>
<p>VC invests $10M for 20% ownership (1x non-participating preferred).</p>
<p><strong>Scenario A - Company sells for $30M:</strong> Preference: $10M. Conversion value: 20% × $30M = $6M. Investor takes the preference ($10M), not conversion. Founders get $20M. <strong>Investor return: 1.0x.</strong></p>
<p><strong>Scenario B - Company sells for $80M:</strong> Preference: $10M. Conversion value: 20% × $80M = $16M. Investor converts (takes $16M). Founders get $64M. <strong>Investor return: 1.6x.</strong></p>
<p><strong>Scenario C - Company sells for $200M:</strong> Conversion value: 20% × $200M = $40M. Investor converts. <strong>Investor return: 4.0x.</strong></p>
<p>The liquidation preference protects the downside (Scenario A) while conversion preserves full upside participation (Scenarios B and C).</p>
</div>

<h4>Anti-Dilution Protection</h4>

<p>Protects investors if the company raises a subsequent round at a lower valuation (a "down round"). <strong>Weighted average</strong> (standard): adjusts the investor's conversion price downward based on a formula that considers the size of the down round relative to total shares. <strong>Full ratchet</strong> (aggressive): adjusts the conversion price to exactly match the lower price, regardless of how much capital is raised at the lower price. Full ratchet severely punishes founders in a down round and is uncommon in founder-friendly markets.</p>`,
  },
  {
    title: 'Governance Terms',
    content: `<h4>Board Composition</h4>

<p>Term sheets specify the board structure. A common early-stage configuration: 2 founder seats, 1 investor seat, and 0-1 independent seats. As the company raises more rounds, investor board seats may increase. Board control matters enormously in contentious situations (firing the CEO, approving a sale, authorizing a new financing).</p>

<h4>Protective Provisions</h4>

<p>Specific actions requiring investor consent: issuing new shares, selling the company, taking on debt, changing the charter, or paying dividends. These give investors veto power over decisions that could harm their interests, even if they don't have board majority.</p>

<h4>Information Rights</h4>

<p>The right to receive regular financial statements, annual budgets, and cap tables. Typically granted to investors holding above a threshold amount (a "major investor").</p>

<h4>Pro-Rata Rights</h4>

<p>The right to invest in future rounds to maintain ownership percentage. Critically important in VC because the power law means you want to maximize your stake in winners. If you own 15% after Series A and the company raises a Series B, pro-rata rights let you invest enough to maintain 15%-preventing dilution in your best investment.</p>

<h4>Drag-Along Rights</h4>

<p>Allow the majority shareholders (or the board) to force all shareholders to participate in a sale. This prevents minority holdouts from blocking a deal that the majority has approved.</p>

<h4>Founder Vesting</h4>

<p>Founders' shares vest over time (typically 4 years with a 1-year cliff). If a founder leaves after 6 months, they forfeit most of their equity. Vesting protects the company and investors from a founder leaving early with a full equity stake.</p>`,
  },
];
