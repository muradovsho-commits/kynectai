export const RX_CASE_STUDY_SECTIONS = [
  {
    title: 'What to Do First',
    content: `<p>When presented with a cap table (in an interview or on the job), immediately do three things:</p>

<p><strong>1. Build a liquidity table:</strong> Revolver capacity minus amount drawn, plus unrestricted cash, minus letters of credit outstanding. This tells you how much runway the company has before it runs out of cash. Be cautious: liquidity is not the same as cash. Revolver availability can be constrained by borrowing base requirements, covenant triggers, or grid pricing that makes additional draws prohibitively expensive.</p>

<p><strong>2. Map the maturity wall:</strong> When does each tranche of debt mature? Are there clusters of maturities coming due soon? Large maturities approaching in 12&ndash;24 months that the company likely can't refinance (because its credit is too weak) are the most immediate driver of distress.</p>

<p><strong>3. Calculate leverage and coverage ratios:</strong> Total Debt / EBITDA (leverage), Secured Debt / EBITDA (secured leverage), EBITDA / Cash Interest (interest coverage), and (EBITDA − CapEx) / (Interest + Mandatory Amortization) (fixed charge coverage). Compare these to typical thresholds: secured leverage above 4&ndash;5x is concerning; total leverage above 6&ndash;7x is distressed territory; interest coverage below 1.5x means the company is barely generating enough cash to pay interest; below 1.0x means it's not covering interest at all.</p>`,
  },
  {
    title: 'What to Look For',
    content: `<p><strong>Trading prices:</strong> Any tranche trading significantly below par is a signal of market concern. A term loan trading below 80 is deeply distressed. Senior unsecured notes trading at 40&ndash;60 suggest the market expects significant impairment.</p>

<p><strong>Springing maturities:</strong> Ask whether any senior tranche has a "springer"&mdash;a provision that accelerates its maturity if junior debt isn't refinanced by a specified date. Springers can collapse what looks like a comfortable maturity profile into an imminent crisis.</p>

<p><strong>Restricted cash:</strong> Not all cash on the balance sheet is available. Covenants may require the company to maintain a minimum cash balance ("restricted cash"). Only unrestricted cash contributes to true liquidity.</p>

<p><strong>Secured basket capacity:</strong> How much additional secured debt can the company issue under its existing credit documents? If the secured basket is nearly full, the company has limited ability to raise new capital at the most senior level&mdash;a significant constraint on restructuring options.</p>

<p><strong>Cash interest burden vs. liquidity:</strong> If annual cash interest expense exceeds available liquidity, the company is on a countdown clock. Even if no maturities are due soon, the inability to pay interest will eventually trigger a default.</p>`,
  },
  {
    title: 'Framing a Restructuring Recommendation',
    content: `<p>After assessing the cap table, articulate what you'd want to accomplish. The goals are almost always the same: <strong>push out maturities</strong> (buy time), <strong>reduce cash interest expense</strong> (improve cash flow), <strong>increase liquidity</strong> (create a buffer), and <strong>reduce total debt</strong> (create a sustainable capital structure). The challenge is achieving these goals given the competing interests of different creditor classes and the constraints of the credit documents.</p>`,
  },
];
