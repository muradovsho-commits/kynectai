export const VC_METRICS_SECTIONS = [
  {
    title: 'Stage-Appropriate Metrics',
    content: `<p>The metrics that matter depend on the company's stage. Asking a pre-seed company for NRR is absurd; asking a Series B company about their CAC payback is essential.</p>

<table class="comparison-table">
<tr><th>Stage</th><th>Key Metrics</th><th>What You're Looking For</th></tr>
<tr><td><strong>Pre-Seed / Seed</strong></td><td>User growth, engagement (DAU/MAU), retention curves, qualitative feedback</td><td>Product-market fit signals: are users coming back? Are they telling friends? Is engagement increasing?</td></tr>
<tr><td><strong>Series A</strong></td><td>MRR/ARR, MoM growth, gross margin, churn, early CAC data</td><td>Repeatable customer acquisition: can the company acquire customers through a scalable channel, not just founder-led sales?</td></tr>
<tr><td><strong>Series B</strong></td><td>ARR, NRR, CAC, LTV/CAC, payback period, burn multiple, Rule of 40</td><td>Efficient scaling: is the company growing efficiently, or is it buying growth with unsustainable spending?</td></tr>
<tr><td><strong>Series C+</strong></td><td>All of the above plus: FCF margin (or path to it), competitive market share, international metrics</td><td>Path to dominance and profitability: is this becoming a category leader with a sustainable business model?</td></tr>
</table>`,
  },
  {
    title: 'Critical Early-Stage Metrics',
    content: `<h4>Burn Rate and Runway</h4>

<div class="formula-box">
Monthly Burn = Monthly Operating Expenses − Monthly Revenue<br>
Runway (months) = Cash Balance / Monthly Burn
</div>

<p>Runway tells you how long the company can survive before it needs to raise more money or become profitable. Startups should maintain 12&ndash;18 months of runway at all times. Below 6 months is a crisis. Burn rate is the most closely monitored metric at the earliest stages because <strong>running out of cash is the most common cause of startup death.</strong></p>

<h4>The Burn Multiple</h4>

<div class="formula-box">
Burn Multiple = Net Burn / Net New ARR
</div>

<p>Created by David Sacks, the burn multiple measures how efficiently a company converts cash burn into revenue growth. A burn multiple below 1.5x is excellent (you're spending less than $1.50 to generate $1 of new ARR). Between 1.5&ndash;2.5x is acceptable for early-stage companies. Above 3x raises serious questions about capital efficiency.</p>

<h4>Cohort Analysis and Retention</h4>

<p>The single most revealing analysis for any startup. Track each monthly or quarterly cohort of customers: how many remain after 1 month, 3 months, 6 months, 12 months? A retention curve that flattens (stops declining) indicates product-market fit&mdash;the customers who stay are genuinely engaged. A retention curve that continues declining suggests the product isn't sticky enough.</p>

<p>For SaaS: logo retention (% of customers retained) and dollar retention (% of revenue retained, including expansion). Dollar retention above 100% means existing customers are spending more over time&mdash;the holy grail of SaaS economics.</p>`,
  },
];
