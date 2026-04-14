export const PE_FUND_SECTIONS = [
  {
    title: 'The Limited Partnership Structure',
    content: `<p>Almost all PE funds are structured as <strong>limited partnerships</strong>. There are two types of partners:</p>

<p><strong>General Partners (GPs)</strong> are the PE firm itself-the professionals who source deals, manage portfolio companies, and make investment decisions. GPs have unlimited liability for the fund's obligations and control all investment decisions.</p>

<p><strong>Limited Partners (LPs)</strong> are the outside investors who provide the vast majority of the fund's capital (typically 97-99%). LPs include pension funds (public and corporate), sovereign wealth funds, university endowments, insurance companies, foundations, family offices, and high-net-worth individuals. LPs have limited liability (they can lose only their committed capital) and no day-to-day involvement in investment decisions.</p>

<p>A typical fund has a <strong>10-year life</strong>, divided into two phases. The <strong>investment period</strong> (Years 1-5) is when the GP deploys capital by making new acquisitions. The <strong>harvest period</strong> (Years 6-10) is when the GP focuses on improving and exiting portfolio companies, returning capital to LPs. Extensions of 1-2 years are common if the GP needs more time to exit remaining investments.</p>

<h4>Capital Calls and Distributions</h4>

<p>LPs don't hand over their entire capital commitment on Day 1. Instead, the GP issues <strong>capital calls</strong> (also called "drawdowns") when it needs money to fund an acquisition or pay fees. If an LP has committed $50M to a $1B fund, they might receive capital calls of $5-15M at a time as deals are executed over the investment period.</p>

<p><strong>Distributions</strong> flow in the opposite direction: as portfolio companies are sold, the GP distributes proceeds to LPs. The timing of distributions is unpredictable-it depends on when exits occur-which creates the "J-curve" effect: in early years, cumulative cash flows are negative (capital is being called faster than it's returned), and returns only turn positive as the portfolio matures and exits begin.</p>`,
  },
  {
    title: 'GP Economics: Management Fees and Carried Interest',
    content: `<p>PE firms earn money through two primary mechanisms, often described as the <strong>"2 and 20"</strong> model (though the exact terms vary):</p>

<h4>Management Fee</h4>

<p>The GP charges an annual fee, typically <strong>1.5-2.0% of committed capital</strong> during the investment period and 1.5-2.0% of <strong>invested capital</strong> (i.e., capital actually deployed in deals) during the harvest period. This fee covers the firm's operating expenses: salaries, office rent, travel, data subscriptions, and other overhead.</p>

<p>For a $2 billion fund at a 2% fee, the GP collects $40 million per year during the investment period-regardless of performance. Over a 10-year fund life, total management fees might be $300-400 million, which is a significant cost borne by LPs.</p>

<h4>Carried Interest ("Carry")</h4>

<p>Carry is the GP's share of the fund's profits, typically <strong>20% of gains above a preferred return (hurdle rate)</strong>. The preferred return is usually 8% annually, meaning the GP earns carry only after LPs have received their capital back plus an 8% annualized return.</p>

<div class="example-box">
<div class="example-label">Carry Calculation Example</div>
<p>A $1B fund returns $2.5B to LPs (a $1.5B profit, or 2.5x MOIC).</p>
<p>The hurdle rate is 8% annualized over a 5-year average holding period, which means LPs need to receive approximately $1.47B (their $1B back plus ~$470M in preferred returns) before the GP earns any carry.</p>
<p>Remaining profit: $2.5B − $1.47B = $1.03B</p>
<p>GP carry: 20% × $1.03B = <strong>$206M</strong> (with catch-up provisions, the actual calculation is more nuanced-see below)</p>
<p>LP share: 80% × $1.03B = $824M, plus their initial $1B and preferred return</p>
</div>

<h4>The Distribution Waterfall</h4>

<p>The precise order in which fund profits are distributed is called the <strong>waterfall</strong>. A typical waterfall has four tiers:</p>

<p><strong>Tier 1 - Return of Capital:</strong> LPs receive back 100% of their contributed capital before any profits are distributed.</p>

<p><strong>Tier 2 - Preferred Return:</strong> LPs receive their preferred return (typically 8% annually) on their contributed capital. This ensures LPs earn a minimum return before the GP profits.</p>

<p><strong>Tier 3 - GP Catch-Up:</strong> The GP receives 100% of distributions (or sometimes 80/20) until the GP has received 20% of total profits to date. This "catches up" the GP's share so that by the end of the catch-up, the split is 80/20 on total cumulative profits.</p>

<p><strong>Tier 4 - Carried Interest Split:</strong> Remaining profits are split 80% to LPs and 20% to the GP.</p>

<p>The waterfall can be calculated on a <strong>deal-by-deal</strong> basis (the GP earns carry on each profitable deal independently, sometimes with a loss offset mechanism called a <strong>clawback</strong>) or on a <strong>whole-fund</strong> basis (carry is calculated only on the fund's aggregate returns, after all investments have been realized). European-style waterfalls tend to be whole-fund; American-style tends to be deal-by-deal.</p>

<h4>GP Commitment</h4>

<p>GPs are typically required to invest <strong>1-5% of the fund's capital</strong> alongside LPs, funded from partners' personal capital. This "skin in the game" aligns GP interests with LP interests-the GP team personally benefits from strong returns and suffers from poor ones.</p>`,
  },
  {
    title: 'Fundraising',
    content: `<p>PE firms raise new funds every 3-5 years. The fundraising process involves preparing a <strong>Private Placement Memorandum (PPM)</strong>, conducting a roadshow to meet prospective LPs, and negotiating the <strong>Limited Partnership Agreement (LPA)</strong>-the legal document governing the fund's terms.</p>

<p>Key negotiating points include: management fee rates and basis, carry percentage and hurdle rate, waterfall structure, key person provisions (what happens if senior partners leave), investment restrictions (concentration limits, sector limits, geography limits), and co-investment rights (the ability for LPs to invest directly in deals alongside the fund, usually with no fees or carry).</p>

<p>First-time funds ("Fund I") are the hardest to raise because the GP has no track record. Most institutional LPs require at least a Fund II or Fund III before committing capital. Fund size typically grows 50-100% with each successive fund if performance has been strong.</p>`,
  },
];
