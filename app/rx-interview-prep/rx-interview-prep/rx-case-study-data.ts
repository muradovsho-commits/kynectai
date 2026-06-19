export const RX_CASE_STUDY_SECTIONS = [
  {
    title: 'Building a Cap Table',
    content: `<p>A capitalization table lays out the company's debt and equity in priority order with the key facts for each tranche: the instrument, the amount outstanding, the interest rate, the maturity, the lien or priority position, and often the current trading price of the debt and the implied leverage at each level. It is the single most fundamental piece of analyst output, because everything else (the waterfall, the recovery analysis, the pro forma structure) is built on top of it.</p>

<p>You build it by going through the financial statements, the debt footnotes, and the credit documents, and listing each piece of capital from most senior (top) to most junior (bottom): revolver, first and second lien term loans, secured notes, unsecured notes, subordinated debt, then preferred and common equity. Alongside the dollar amounts you show cumulative debt and a leverage multiple at each tranche.</p>

<div class="example-box">
<div class="example-label">A simple cap table (EBITDA = 100)</div>
<p>Revolver (drawn): 50, cumulative 50, leverage 0.5x<br/>First-lien term loan: 350, cumulative 400, leverage 4.0x<br/>Senior unsecured notes: 250, cumulative 650, leverage 6.5x<br/>Subordinated notes: 150, cumulative 800, leverage 8.0x<br/>Total debt: 800, 8.0x levered. Then preferred and common equity below.</p>
<p>At a glance: leverage through the first lien is 4.0x (likely well covered), total leverage is 8.0x (high). If the business is worth, say, 6x EBITDA, value breaks somewhere in the senior unsecured notes.</p>
</div>

<div class="key-concept">Showing cumulative leverage at each level is what lets a reader instantly see where value is likely to break. Many groups also include total liquidity (cash plus undrawn revolver availability) on the page, because it signals runway, which is why MDs want it there even though it is a balance-sheet item rather than a capital-structure one.</div>`,
  },
  {
    title: 'Liquidity Roll-Forwards (the 13-Week Model)',
    content: `<p>A liquidity roll-forward, or cash-flow forecast, projects the company's cash position forward in time, usually week by week (the famous <strong>thirteen-week cash flow forecast</strong>) or month by month, to estimate when the company runs out of money. You start with the current cash balance and available revolver capacity, then for each period add expected inflows (collections from customers) and subtract outflows (payroll, suppliers, rent, capital expenditure, and crucially cash interest on the debt). The running balance tells you how much runway remains and when it hits zero.</p>

<div class="example-box">
<div class="example-label">The shape of it</div>
<p>Starting liquidity: 60 (cash 40 + undrawn revolver 20). Average weekly burn: 5. Plus a 15 interest payment due in week 8. Without action, liquidity erodes to roughly 20 by week 8, then the interest payment pushes it to about 5, and the company is effectively out of room by week 10 or 11. That date is the negotiating deadline for the entire situation.</p>
</div>

<div class="key-concept">The roll-forward drives the strategic clock of the entire situation. It answers the most important practical question: how much time is there before the company cannot pay its bills. That timeline determines how much negotiating leverage each party has, whether a financing is urgently needed, and whether the company can afford a slow negotiated solution or must move fast. In a pitch, projecting the cash runway forward is the polite way of showing a company that something has to happen, and when.</div>`,
  },
  {
    title: 'Reading a Cap Table Like an RX Banker',
    content: `<p>When you are handed a capital structure in a case or on the job, there is a disciplined order of operations.</p>

<div class="framework-box"><div class="fw-label">WHAT TO DO FIRST</div>1. <strong>Total the leverage</strong> and compare it to what the sector and business quality can support.<br/>2. <strong>Find the maturity wall:</strong> what comes due, when, and can it be refinanced.<br/>3. <strong>Check liquidity:</strong> cash plus revolver availability against the burn rate. How many months of runway.<br/>4. <strong>Look at trading levels:</strong> where each tranche trades tells you the market's implied recovery and where it thinks value breaks.<br/>5. <strong>Estimate enterprise value</strong> (comps and DCF) and run a rough waterfall to locate the fulcrum.<br/>6. <strong>Read the docs</strong> for the levers: basket capacity, lien flexibility, unrestricted subsidiary capacity, consent thresholds.</div>

<p>From there you can frame a recommendation: is this an out-of-court fix (A&amp;E, exchange) or does it need court; where does value break; which creditors hold the leverage; and what is the most likely path. The mark of someone who gets it is reasoning from the documents and the liquidity clock, not just the headline leverage number.</p>

<div class="warning-box">Common rookie mistake: treating leverage as the whole story. A 7x-levered company with loose covenants, a far-off maturity, and ample liquidity may be fine for years, while a 4x-levered company with a maturity next quarter and no refinancing market is in immediate trouble. The timing and the documents matter as much as the multiple.</div>`,
  },
  {
    title: 'The Work Product: Screens, Profiles, and Pitches',
    content: `<p>Several interview questions circle the actual deliverables a junior banker produces. Speaking to them credibly makes you sound like someone who already knows the job.</p>

<p><strong>Screens and the radar.</strong> The group keeps a running watch list of companies that look like candidates to restructure. A screen is a spreadsheet profiling distressed names on the metrics that signal trouble: capital structure, leverage, liquidity, maturity schedule, and trading levels. A finished screen has a summary page listing every name with its key metrics, followed by a cap table for each. Screens source the next pitch and keep the MD's radar current.</p>

<p><strong>Profiles.</strong> A focused one or two page write-up that tells a senior banker most of what they need to engage: a short business description, several bullets on why the company is heading toward distress, a capital structure in priority order, a liquidity snapshot, and a trading history showing where the debt has moved (debt that traded near par then sold off sharply is the market turning on the credit).</p>

<p><strong>Pitches.</strong> The deck used to win or advance a mandate. It opens with a situation overview (showing the advisor understands where the company is and how it got there, which matters to a stressed management team), lays out the capital structure and a liquidity analysis, and presents a menu of potential solutions (A&amp;E, exchange, an out-of-court liability management transaction, or an in-court path), each with the pro forma cap table it would produce. You also frequently do creditor analysis: identifying who holds the relevant tranches and how concentrated they are, because any consent-based solution depends on getting the necessary holders on board. A tranche held by a few large funds is a very different negotiation than one scattered across hundreds of retail holders.</p>

<div class="takeaway-box"><strong>The thread through all of it:</strong> the cap table, the liquidity roll, and the recovery waterfall are the three artifacts that underpin every screen, profile, and pitch. Master those three and you can build everything else.</div>`,
  },
];
