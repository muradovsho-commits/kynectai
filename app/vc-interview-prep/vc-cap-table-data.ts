export const VC_CAP_TABLE_SECTIONS = [
  {
    title: 'Cap Table Basics',
    content: `<p>A capitalization table (cap table) tracks every shareholder's ownership: founders, employees (through the option pool), and investors from each round. It's the definitive record of who owns what percentage of the company.</p>

<div class="example-box">
<div class="example-label">Cap Table Evolution Through Three Rounds</div>
<p><strong>Founding:</strong> Two founders split 10M shares 50/50. They create a 15% option pool (1.76M shares). Total shares: 11.76M. Founders own 85% (42.5% each). Option pool: 15%.</p>
<p><strong>Seed ($3M at $12M post-money):</strong> New shares issued: 12M × 25% / 75% = 4M shares to the seed investor. (Alternatively: $3M / $12M = 25% ownership.) Pre-money: $9M. Post-money: $12M. Seed investor: 25%. Founders diluted from 85% to 63.75% (each 31.9%). Pool: 11.25%.</p>
<p><strong>Series A ($10M at $50M post-money):</strong> The option pool is "refreshed" to 20% pre-money (a new pool is created before the Series A investor's shares are issued, so the dilution falls on existing shareholders, not the new investor). Series A investor: $10M / $50M = 20%. After pool refresh and new shares, approximate ownership: Founders ~44%, Seed ~17%, Pool ~19%, Series A 20%.</p>
<p><strong>Series B ($25M at $175M post-money):</strong> Series B: ~14.3%. Everyone else dilutes proportionally. Founders might now own ~38%, Seed ~14.5%, Series A ~17.1%, Pool ~16%.</p>
<p><em>By Series B, the founders have diluted from 85% to ~38%-but their shares are now worth ~38% × $175M = $66.5M, up from a nominal value near zero at founding.</em></p>
</div>`,
  },
  {
    title: 'The Option Pool Shuffle',
    content: `<p>Before each priced round, investors typically require that the option pool be sized (or "refreshed") to a target percentage of post-money shares, but the dilution from creating the pool comes out of the <em>pre-money</em> valuation. This is the "option pool shuffle"-it effectively reduces the true pre-money valuation because existing shareholders (founders and prior investors) absorb the dilution, not the new investor.</p>

<p>For example, if a VC offers "$40M pre-money" but requires a 20% option pool to be created pre-money, the effective pre-money valuation for existing shareholders is lower: the $40M includes shares that haven't been issued yet. Understanding this mechanic is essential for founders negotiating term sheets and for VC analysts modeling cap tables.</p>`,
  },
  {
    title: 'Dilution Math',
    content: `<div class="formula-box">
New investor ownership = Investment / Post-Money Valuation<br>
Existing shareholders diluted to: (1 − New Investor %) × Previous Ownership %<br>
Post-Money = Pre-Money + Investment Amount<br>
Price per share = Pre-Money / Pre-Money Shares Outstanding
</div>

<p>Dilution is not inherently bad. If a founder goes from 50% ownership of a $10M company ($5M) to 35% ownership of a $100M company ($35M), they've been "diluted" but are 7x richer. Dilution is destructive only when the valuation doesn't increase enough to offset the ownership reduction-which happens in flat or down rounds.</p>`,
  },
];
