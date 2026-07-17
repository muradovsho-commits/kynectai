// ─────────────────────────────────────────────────────────────────────────────
// Reps content data. 10 careers, 3 to 6 scenarios each.
// Each scenario has 1-3 graded deliverables with full rubrics.
//
// Rubrics are written verbosely on purpose, the AI grader needs specific
// criteria to grade against, not vibes. Each rubric ends with a verdict
// instruction in the persona's voice ("Send it.", "One more pass.", "Full redo.")
// ─────────────────────────────────────────────────────────────────────────────

export type Persona = {
  id: string;
  name: string;
  title: string;
  firm: string;
  style: string;
  voice: string;
  initials: string;
};

export type ArtifactSpec = {
  id: string;
  label: string;
  format: 'xlsx' | 'docx' | 'pdf' | 'pptx';
  prompt: string;
  rubric: string;
  requestedBy: string;
};

export type Scenario = {
  id: string;
  trackId: RepsTrackId;
  title: string;
  summary: string;
  timeframe: string;
  duration: string;
  difficulty: 'Intro' | 'Intermediate' | 'Advanced';
  context: string;
  personas: Persona[];
  opening: { personaId: string; text: string }[];
  artifacts: ArtifactSpec[];
};

export type RepsTrackId =
  | 'ib' | 'pe' | 'consulting' | 'rx' | 'st'
  | 'am' | 'vc' | 're' | 'er' | 'audit';

export type RepsTrack = {
  id: RepsTrackId;
  title: string;
  abbr: string;
  tagline: string;
  description: string;
  accent: string;
};

export const REPS_TRACKS: RepsTrack[] = [
  { id: 'ib', title: 'Investment Banking', abbr: 'IB', tagline: 'Live deal flow. Live MD pings. Live decks.', description: 'Sit in an analyst seat on a live deal. The staffing associate pings, the MD calls with a quick ask, the VP marks up your work. Build comps, draft one-pagers, defend your numbers.', accent: '#1f2937' },
  { id: 'pe', title: 'Private Equity', abbr: 'PE', tagline: 'Deal lands. Run the LBO. Defend it at IC.', description: 'You\'re an associate at a fund. A deal brief hits your inbox. Read it, run a paper LBO, sit through management presentations, write the IC memo, defend the deal in front of partners.', accent: '#1d4ed8' },
  { id: 'consulting', title: 'Consulting', abbr: 'C', tagline: 'Partner drops a question. You structure it.', description: 'You\'re on a client engagement. The partner hands you a slice of the case. Structure the problem, interview a client stakeholder, build slides, defend your recommendation under pushback.', accent: '#0891b2' },
  { id: 'rx', title: 'Restructuring', abbr: 'Rx', tagline: 'Covenant breach overnight. Sponsor on the line.', description: 'Crisis mode at Lazard, PJT, Houlihan. Sponsor calls because their portfolio company tripped a covenant. Build a situation overview, walk through cap stack options, prep for an angry lender meeting.', accent: '#7c2d12' },
  { id: 'st', title: 'Sales & Trading', abbr: 'ST', tagline: 'Market opens. RFQs flow. P&L moves.', description: 'A morning at a bank\'s trading desk. Sit in on the morning meeting, manage your axe sheet as the market opens, price client RFQs in real time, defend your book at the end-of-day P&L review.', accent: '#dc2626' },
  { id: 'am', title: 'Asset Management', abbr: 'AM', tagline: 'Earnings print. Update the model. Brief the PM.', description: 'A quieter day at a long-only fund. A portfolio name just reported, update the model, take a call with the IR head, write a note for your PM, defend your conviction at the position review.', accent: '#166534' },
  { id: 'vc', title: 'Venture Capital', abbr: 'VC', tagline: 'Series A deck lands. Founder call at 3.', description: 'A partner forwards you a pitch deck. Skim it, run a quick market scan, take a founder call, write the memo, and defend the deal (or kill it) in front of the partners.', accent: '#7c3aed' },
  { id: 're', title: 'Real Estate', abbr: 'RE', tagline: 'Rent roll, OM, and an IC deadline.', description: 'Underwrite a new acquisition. Build the cash flow model from the rent roll, analyze the local market and comps, write the IC memo, defend your assumptions to the investment committee.', accent: '#92400e' },
  { id: 'er', title: 'Equity Research', abbr: 'ER', tagline: 'Company you cover just reported. Note before open.', description: 'Earnings day for a name you cover. Update your model with the print, join the earnings call, write a quick client note, take a tough call from a buy-side analyst, decide if your rating changes.', accent: '#0f766e' },
  { id: 'audit', title: 'Accounting & Audit', abbr: 'A', tagline: 'Q3 audit. Senior assigns. Client resists.', description: 'Deep in a Q3 audit. Your senior assigns a control to test, pull samples and document workpapers, push back when the client resists, redo a section after manager review.', accent: '#4f46e5' },
];

// ═════════════════════════════════════════════════════════════════════════════
// INVESTMENT BANKING
// ═════════════════════════════════════════════════════════════════════════════

const IB_1: Scenario = {
  id: 'ib-1',
  trackId: 'ib',
  title: 'Live M&A pitch, Tuesday afternoon',
  summary: 'Your MD wants a refreshed comp set and a one-pager for tomorrow\'s pitch. The VP will mark it up at 6.',
  timeframe: 'Tuesday PM',
  duration: '40 min',
  difficulty: 'Intermediate',
  context: `Bulge-bracket Healthcare IB team pitching a sell-side mandate to Project Lighthouse: a $2.0B EV vertical-SaaS healthcare RCM platform with $280M LTM revenue, ~25% YoY growth, ~18% adj. EBITDA margins, ~120% net dollar retention. Think a smaller version of R1 RCM (which was publicly traded under $RCM before its 2024 take-private by TowerBrook and CD&R) or a more mature Phreesia ($PHR). Comparable trading universe: Veeva (VEEV), Doximity (DOCS), HealthEquity (HQY), Phreesia (PHR), Evolent (EVH), Definitive Healthcare (DH). The pitch is Wednesday 9am to Lighthouse's CEO and CFO. The student is the first-year analyst. The associate is on another deal so the analyst has limited cover.`,
  personas: [
    { id: 'md', name: 'David Chen', title: 'Managing Director', firm: 'GS / Healthcare', style: 'Big-picture, time-poor, talks in headlines. Cares about the client narrative and whether the analyst can defend a number under pushback. Doesn\'t want the math, wants the answer. Often changes direction mid-conversation.', voice: 'big-picture', initials: 'DC' },
    { id: 'vp', name: 'Priya Raman', title: 'Vice President', firm: 'GS / Healthcare', style: 'Sharp, exacting, kind but unrelenting on quality. Marks up everything. Will flag formatting (alignment, decimals, sourcing) AND substance (peer selection, EV vs market cap) in the same breath. Wants the analyst to think two steps ahead.', voice: 'precise', initials: 'PR' },
  ],
  opening: [
    { personaId: 'md', text: `Need a refreshed comp sheet for the Lighthouse pitch tomorrow. Lighthouse is healthcare RCM SaaS, $2B EV. Think a smaller-scale R1 RCM (the one TowerBrook and CD&R just took private) or a more mature Phreesia.` },
    { personaId: 'md', text: `Peer set the team agreed on: Veeva ($VEEV), Doximity ($DOCS), HealthEquity ($HQY), Phreesia ($PHR), Evolent Health ($EVH), Definitive Healthcare ($DH). EV/Rev and EV/EBITDA, NTM, calendarized.` },
    { personaId: 'md', text: `Send when ready. I want eyes on it before Priya marks it up.` },
    { personaId: 'vp', text: `Start with the comp sheet, that's the priority. Reminders: EV is market cap plus net debt, no shortcuts. Source row at the bottom. Clean alignment.` },
    { personaId: 'vp', text: `Data source: this is all public. Pull market caps and balance sheet items from each company's most recent 10-Q (SEC filings on sec.gov or each company's IR page), revenue and EBITDA from earnings releases. For NTM consensus, use Yahoo Finance or whatever you have access to; if you can't get clean consensus, calendarize off LTM plus mid-point of company guidance and document it in the source row.` },
    { personaId: 'vp', text: `Once the comps clear, the one-pager teaser is next: company overview, growth metrics, why now, three investment highlights. We'll talk after I see your comps.` },
  ],
  artifacts: [
    {
      id: 'comp-sheet',
      label: 'Trading Comp Sheet',
      format: 'xlsx',
      prompt: `Build a trading comp sheet for Project Lighthouse. Required:
• Peer set: VEEV, DOCS, HQY, PHR, EVH, DH (don't drop any without flagging why)
• For each peer: Market Cap, Net Debt, Enterprise Value, NTM Revenue, NTM EBITDA, EV/NTM Revenue, EV/NTM EBITDA, Revenue Growth %, EBITDA Margin %
• Show Mean, Median, Min, Max at the bottom
• Lighthouse implied valuation range using median peer multiples
• Source row at the bottom

Upload as .xlsx when ready.`,
      rubric: `Grade as a Healthcare IB VP at a bulge bracket reviewing a first-year analyst's comp sheet. Be specific, cite cells/columns when you see issues. Score each dimension 1-10:

PEER SELECTION (1-10)
- All 6 named peers present? Any dropped without explanation?
- Any non-defensible peers added (e.g., enterprise SaaS not healthcare-vertical)?

ENTERPRISE VALUE CONSTRUCTION (1-10)
- EV = Market Cap + Net Debt (Debt - Cash)? Common error: using Market Cap as a proxy.
- Net debt values current and sourced?

MULTIPLE CALCULATIONS (1-10)
- EV/NTM Revenue and EV/NTM EBITDA: divide EV by NTM figure (not LTM, not current year).
- Common errors: LTM instead of NTM, mixing periods, dividing by margins instead of dollars.
- Sanity range: healthcare-SaaS NTM Revenue multiples ~5x-15x; EBITDA ~25x-60x for high-growth.

OPERATING METRICS (1-10)
- Revenue growth % and EBITDA margin % both NTM, consistent definition.
- Negative-EBITDA peers should show "nm" or "neg", not a calculated multiple.

SUMMARY STATISTICS (1-10)
- Mean, median, min, max for both multiples and operating metrics.
- Lighthouse implied EV range using median peer multiples applied to Lighthouse's $280M revenue and projected EBITDA.

FORMATTING & POLISH (1-10)
- Header row clear. Decimals consistent. Numbers right-aligned.
- Source row present (Capital IQ / FactSet / Bloomberg).
- File usable as a pitch attachment without further work.

End with an overall verdict in Priya's voice (under 80 words): would this go to the MD as-is, would it go back for one revision, or is it a full redo. Reference 2-3 specific cells or columns by name. Speak as Priya. Don't soften the feedback.`,
      requestedBy: 'md',
    },
    {
      id: 'one-pager',
      label: 'One-Pager Teaser',
      format: 'docx',
      prompt: `Draft a one-page company overview / teaser for Project Lighthouse. Required sections:
• Company overview (what they do, market they serve), 2-3 lines
• Key metrics (revenue, growth, margins, NDR, customer count)
• Why Now, 3 bullets on why this is the right moment to sell
• Investment highlights, 3-4 bullets on what makes them attractive
• Keep it to one page when printed. Every word matters.

Upload as .docx when ready.`,
      rubric: `Grade as a Healthcare IB VP reviewing a first-year analyst's one-pager teaser. Score each 1-10:

NARRATIVE CLARITY (1-10)
- Could a CFO/buyer figure out what this company DOES in 10 seconds?
- Common error: lead with metrics or jargon before what the company actually is.

METRIC PRESENTATION (1-10)
- Revenue, growth, margins, NDR, customers, all included, accurate, and consistent with the comp universe?
- Used the right vintage (LTM/NTM stated clearly)?
- Round numbers ($280M not $279.4M) for teaser-stage.

"WHY NOW" SUBSTANCE (1-10)
- Three bullets that actually argue urgency: market timing, consolidation, multiples, strategic windows.
- Common error: vague platitudes ("market is growing", "great team"). Reject those.

INVESTMENT HIGHLIGHTS (1-10)
- 3-4 bullets that buyers would care about: moat, customer concentration (or lack of), expansion within accounts, regulatory tailwinds, etc.
- Each bullet should be defensible with a stat or anchor.

WRITING (1-10)
- Concise, banker-style. No filler. No "innovative", "best-in-class", "robust".
- Active voice. Verbs over adjectives.

FORMAT DISCIPLINE (1-10)
- Fits one page (or close)?
- Headings, hierarchy, white space, readable as a teaser, not a wall of text.

End with verdict in Priya's voice (under 80 words): "Send it.", "One more pass.", or "Full redo." Cite 2 specific lines/sections. Be honest.`,
      requestedBy: 'vp',
    },
  ],
};

const IB_2: Scenario = {
  id: 'ib-2',
  trackId: 'ib',
  title: 'Fairness opinion all-nighter',
  summary: 'The MD just changed the deal thesis at 9pm. Rebuild the DCF assumptions and the football field before the 8am call.',
  timeframe: 'All-nighter',
  duration: '45 min',
  difficulty: 'Advanced',
  context: `Elite boutique (Centerview-style) M&A team rendering a fairness opinion on a $4.8B take-private of MedTech Holdings, a diversified medical devices company. Think a mid-cap player in the space of Hologic ($HOLX), Globus Medical ($GMED), or Integra LifeSciences ($IART), with a cardiovascular segment exposed to FDA review. Board meets Friday 9am to vote. Base case assumptions for this deal: ~6% revenue growth declining to 3%, 22% EBITDA margins, 9.0% WACC, 2.5% terminal growth. The MD just called from the airport: he now thinks the bear case should reflect a regulatory overhang on the cardiovascular segment (~35% of revenue) and wants the football field re-anchored to show downside more visibly. Student is the first-year analyst running the DCF in Excel and the football field in PowerPoint. All the assumptions and figures you need are in this scenario; no proprietary model or terminal data needed.`,
  personas: [
    { id: 'md', name: 'Marcus Whitfield', title: 'Managing Director', firm: 'Centerview', style: 'Old-school, demanding. Speaks in fully-formed paragraphs even at 9pm. Cares deeply about defensibility, every assumption must have a source. Won\'t accept "industry consensus" as a defense.', voice: 'demanding-defensible', initials: 'MW' },
    { id: 'vp', name: 'Anna Liu', title: 'VP', firm: 'Centerview', style: 'Calm, methodical, mid-pace. The one who actually catches errors. Will ask "what\'s your downside?" and expect a number with a reason behind it.', voice: 'methodical', initials: 'AL' },
  ],
  opening: [
    { personaId: 'md', text: `I'm at the airport, twenty minutes before my flight. Listen carefully. We're rendering a fairness opinion on the $4.8B take-private of MedTech Holdings.` },
    { personaId: 'md', text: `MedTech is a diversified medical devices company. Think a smaller-scale Hologic ($HOLX) or Globus Medical ($GMED), with a cardiovascular segment exposed to FDA review.` },
    { personaId: 'md', text: `New bear case: cardiovascular regulatory risk bigger than we've been modeling. 15-20% revenue haircut on that segment for years 1-3, then recovery. Other segments stay on plan.` },
    { personaId: 'md', text: `Two deliverables by 8am tomorrow: (1) DCF in Excel showing bear / base / bull, (2) football field slide in PowerPoint showing the implied per-share price ranges from each valuation method. Both built from scratch, no starter files.` },
    { personaId: 'vp', text: `I'll set up the framework so you know what to build. DCF first, slide second. The slide reads off your DCF outputs, so we need the model done first.` },
    { personaId: 'vp', text: `For the DCF: segment revenue (cardiovascular ~35%, other ~65%) shown separately on one tab, then bear/base/bull side by side. WACC 9.0%, terminal growth 2.5%, shares out ~140M, net debt ~$200M. Show UFCF and implied per-share equity value for each case.` },
    { personaId: 'vp', text: `For the football field: it's a horizontal bar chart, one bar per valuation method, x-axis is implied price per share. Methods: 52-week trading range, trading comps (EV/EBITDA), precedent transactions (EV/EBITDA), DCF bear / DCF base / DCF bull. Mark the $94 offer price with a vertical line across all bars.` },
    { personaId: 'vp', text: `Send me the Excel first, I'll review while you work on the slide.` },
  ],
  artifacts: [
    {
      id: 'dcf-rebuild',
      label: 'DCF, Bear Case Update',
      format: 'xlsx',
      prompt: `Build the DCF for MedTech Holdings from scratch in Excel, with a cardiovascular regulatory bear case. Required:
• Segment revenue (cardiovascular ~35% of company revenue, other ~65%), modeled separately on one tab
• Three cases side by side: Bear, Base, Bull
• Bear case: cardiovascular revenue declines 15-20% for years 1-3, then recovers; other segments stay on the base plan
• Base case: ~6% revenue growth declining to 3% by year 5
• Bull case: ~8% revenue growth holding longer
• EBITDA: ~22% margin (cardiovascular margins similar to consolidated)
• Discount UFCF: EBIT × (1 - tax) + D&A - CapEx - ΔWC
• WACC 9.0%, terminal growth 2.5%, 5-year explicit forecast then terminal
• Shares out ~140M, net debt ~$200M
• Show UFCF, PV of UFCF, terminal value, enterprise value, equity value, implied $/share for each case

You're building this from zero. No starter file. Upload as .xlsx.`,
      rubric: `Grade as the VP on a take-private fairness opinion. Score each 1-10:

SEGMENT MODELING (1-10)
- Cardiovascular and other segments shown separately with own growth/margins?
- Or did they just haircut consolidated revenue uniformly (wrong)?
- Bear case haircut in the 15-20% range for years 1-3 with recovery after?

DCF MECHANICS (1-10)
- UFCF computed correctly: EBIT × (1-tax) + D&A - CapEx - ΔWC?
- Discount period correct (mid-year convention or stub period stated)?
- Terminal value: Gordon growth or exit multiple, stated clearly, consistent with the case?

WACC + TERMINAL (1-10)
- WACC 9.0% used consistently?
- Terminal growth 2.5% sane (not above long-run GDP)?
- Implied terminal multiple sense-checked vs comps?

BEAR vs BASE PRESENTATION (1-10)
- Both cases visible side-by-side, clearly labeled?
- Implied equity value per share computed for each (subtract net debt, divide by shares)?

SENSITIVITY (bonus, 1-10)
- WACC × terminal growth sensitivity table present?
- Bear-case revenue haircut sensitivity present?

FORMATTING (1-10)
- Year headers, units stated, formulas live (not pasted values).
- Bear vs base clearly distinguishable.

End with verdict in Anna's voice (under 80 words): "Send to Marcus.", "One more iteration with me first.", or "Step back, this isn't right." Cite 2 specific issues by cell or worksheet name.`,
      requestedBy: 'vp',
    },
    {
      id: 'football-field',
      label: 'Football Field Slide',
      format: 'pptx',
      prompt: `Build the valuation football field slide from scratch in PowerPoint. A football field is a horizontal bar chart, one bar per valuation method, x-axis is implied price per share, with a vertical line marking the current offer.

Required bars (per share, low to high):
• 52-week trading: ~$58 - $84
• Trading comps (EV/EBITDA): ~$72 - $95
• Precedent transaction comps (EV/EBITDA): ~$80 - $108
• DCF, Bear: derive from your model (should extend lower than base)
• DCF, Base: ~$85 - $102
• DCF, Bull: ~$95 - $118

Mark the current offer of $94/share with a vertical line that crosses all bars.

Single slide. No starter file. Make sure the bear DCF case visibly extends downside so the board can see what we're warning them about. Upload as .pptx.`,
      rubric: `Grade as Marcus, the MD, reviewing the football field. Score each 1-10:

RANGES PRESENT (1-10)
- All required ranges shown: 52WK, trading comps, transaction comps, DCF bear/base/bull?
- Each labeled clearly with method?

OFFER LINE (1-10)
- $94 offer price marked with a clear vertical line across all bars?
- Easy to see where the offer sits vs each range at a glance?

BEAR CASE PROMINENCE (1-10)
- Bear DCF range visibly extends downside (lower bound below $80)?
- Visually obvious, not hidden in a thin bar?

LABELING & SOURCING (1-10)
- Each range labeled with multiple/method (e.g., "EV/EBITDA: 10x-13x")?
- Source line at the bottom?

CHART CONSTRUCTION (1-10)
- Bars consistent thickness, aligned to a single x-axis?
- Common error: bars of different visual weights, x-axis not consistent.

BOARD-READY POLISH (1-10)
- Title clear ("MedTech Holdings, Valuation Summary" or similar)?
- Footnotes legible?
- Would this go in a fairness opinion deck to the board without rework?

End with verdict in Marcus's voice (under 80 words): "Send it to the printer.", "One revision.", or "Redo." Cite 2 specific issues.`,
      requestedBy: 'md',
    },
  ],
};

const IB_3: Scenario = {
  id: 'ib-3',
  trackId: 'ib',
  title: 'First-week ramp, comp set + LBO mini-build',
  summary: 'Your first real ask. Build a comp set on a TMT name AND a quick paper LBO. The associate is testing you.',
  timeframe: 'First week',
  duration: '35 min',
  difficulty: 'Intro',
  context: `Middle-market IB at a Houlihan / Jefferies-style firm. First week on the desk. Associate hands you Project Atlas, a $400M EV vertical-SaaS construction software company. Think a smaller version of Procore ($PCOR) or Bentley Systems ($BSY) at an earlier stage. $80M LTM revenue, 30% growth, 15% EBITDA margins (so roughly $12M LTM EBITDA). Associate wants two things by EOD: (1) a clean trading comp set using PCOR, BSY, AZPN, TRMB, ADSK, PTC, (2) a quick paper LBO assuming a sponsor pays 9.0x LTM EBITDA, 50% leverage at SOFR+500, 5-year hold, 10% revenue CAGR with 200bps of margin expansion. The associate is testing whether they can trust you with real work next week.`,
  personas: [
    { id: 'assoc', name: 'Jordan Park', title: 'Associate', firm: 'Houlihan / TMT', style: 'Direct, fair, will tell you exactly what\'s wrong. Cares about whether you check your own work before sending. Will respect you if you push back with a reason.', voice: 'direct-fair', initials: 'JP' },
  ],
  opening: [
    { personaId: 'assoc', text: `Welcome to the desk. Two things by EOD on Project Atlas.` },
    { personaId: 'assoc', text: `Project Atlas is a $400M EV vertical-SaaS construction software company. Think a smaller-scale Procore ($PCOR). $80M LTM revenue, 30% growth, 15% EBITDA margins (roughly $12M LTM EBITDA).` },
    { personaId: 'assoc', text: `Start with the comp set. Peers: Procore ($PCOR), Bentley Systems ($BSY), Aspen Technology ($AZPN), Trimble ($TRMB), Autodesk ($ADSK), PTC ($PTC). EV/Rev and EV/EBITDA, NTM. We need this for the cover, so do it first.` },
    { personaId: 'assoc', text: `Then the paper LBO. Sponsor pays 9.0x LTM EBITDA on $12M (so $108M purchase price). 50% debt at SOFR+500 (assume SOFR = 5.0%). 5-year hold, exit at the same 9.0x. 10% revenue CAGR, 200bps margin expansion linearly. Show MOIC and IRR. For comp data and projections, just use reasonable estimates if you can't pull a terminal.` },
    { personaId: 'assoc', text: `Both as separate Excel files, one tab each. Don't overthink it. Get the math right.` },
  ],
  artifacts: [
    {
      id: 'comp-set',
      label: 'Comp Set',
      format: 'xlsx',
      prompt: `Build a trading comp set for Project Atlas using PCOR, BSY, AZPN, TRMB, ADSK, PTC. Show:
• Market Cap, Net Debt, EV
• NTM Revenue, NTM EBITDA
• EV/NTM Revenue, EV/NTM EBITDA
• Revenue Growth %, EBITDA Margin %
• Mean, Median at the bottom
• Atlas implied EV using the median multiples ($80M LTM revenue, 30% growth)

Upload as .xlsx.`,
      rubric: `Grade as a TMT IB associate reviewing a first-year analyst's first deliverable. Score 1-10:

ACCURACY (1-10)
- EV computed correctly (Market Cap + Net Debt)?
- NTM (not LTM) used for the multiple denominators?
- Atlas implied EV computed correctly (median NTM Rev multiple × $80M × (1 + 30%) for NTM)?

PEER COVERAGE (1-10)
- All 6 peers present?
- Any nm/neg flagged correctly for negative-EBITDA peers?

MULTIPLE SANITY (1-10)
- Vertical SaaS NTM Revenue multiples typically 4x-12x. Outliers explained?
- Don't auto-mark wrong if a peer trades at 15x, just check the math.

FORMATTING (1-10)
- Header clear. Decimals consistent. Numbers right-aligned. Source row present.

End with verdict in Jordan's voice (under 60 words). One of: "This is fine, ship it.", "Close, fix [X] and resend.", "Step back and review your own work first." Cite 1-2 specific cells.`,
      requestedBy: 'assoc',
    },
    {
      id: 'paper-lbo',
      label: 'Paper LBO',
      format: 'xlsx',
      prompt: `Build a paper LBO on Project Atlas. Assumptions:
• Entry: 9.0x LTM EBITDA on $12M LTM EBITDA = $108M EV
• 50% debt at SOFR+500 (SOFR = 5.0%, so 10.0% interest)
• Cash and equity sources to fund the equity check
• 5-year hold
• Revenue grows 10% CAGR; EBITDA margin expands from 15% to 17% linearly over 5 years
• Maintain 5% capex / 5% D&A as % of revenue
• Working capital roughly neutral
• 25% effective tax rate
• Exit at 9.0x EBITDA in year 5
• Mandatory debt paydown with FCF (sweep 100% of FCF to debt)
• Calculate MOIC and IRR on sponsor equity

Upload as .xlsx.`,
      rubric: `Grade as a TMT IB associate reviewing a first-year's first paper LBO. Score 1-10:

SOURCES & USES (1-10)
- $108M total uses (purchase price). Sources: $54M debt + $54M equity (plus minor fees if modeled). Off by more than 2% is a problem.
- Common error: not deducting net debt, double-counting fees.

REVENUE / EBITDA BUILD (1-10)
- Revenue Y0 $80M → Y5 ~$128.8M (10% CAGR)?
- EBITDA margin steps from 15% to 17% over 5 years (linear or stated)?
- Y5 EBITDA roughly $21.9M?

INTEREST + DEBT PAYDOWN (1-10)
- Interest expense = 10% × beginning-period debt?
- FCF sweep = (Net income + D&A - CapEx - ΔWC) applied to debt?
- Common error: using ending debt for interest (causes circularity), or not actually paying down debt at all.

EXIT VALUE (1-10)
- Exit EV = 9.0x × Y5 EBITDA?
- Equity proceeds = Exit EV - remaining debt + cash?

MOIC + IRR (1-10)
- MOIC = equity proceeds / $54M initial equity?
- IRR computed correctly (use the 5-year cash flow stream or just MOIC^(1/5)-1)?
- Sanity: should be roughly 2.5x-3.5x MOIC, 20-30% IRR with these assumptions.

FORMATTING (1-10)
- Inputs separately labeled at top, formula-driven cells below.
- No hardcoded values where formulas should be.

End with verdict in Jordan's voice (under 60 words). Cite the IRR/MOIC they got and whether it's in the right ballpark. One of: "Solid, ship it.", "Close, your [X] is off.", "Math is wrong, start over." Be specific.`,
      requestedBy: 'assoc',
    },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
// PRIVATE EQUITY
// ═════════════════════════════════════════════════════════════════════════════

const IB_4: Scenario = {
  id: 'ib-4',
  trackId: 'ib',
  title: 'Precedent transactions screen, medtech',
  summary: 'Six deals, one of them junk. Build the precedent set and tell the VP what Meridian is worth.',
  timeframe: 'Thursday AM',
  duration: '30 min',
  difficulty: 'Intro',
  context: `Middle-market healthcare group. You are two weeks in. The team is pitching Project Meridian, a single-use surgical instruments business doing $52M LTM EBITDA on $210M of revenue. The VP wants a precedent transactions screen before the Friday internal. She has already pulled the deal list off the desk marks and dropped it in your inbox, so this is not a research exercise, it is a math and judgment exercise. One of the six deals has a negative LTM EBITDA target and needs to be flagged nm rather than dropped silently. One trades way above the pack because the target was growing 40%. The VP wants to know what you do with both.`,
  personas: [
    { id: 'vp', name: 'Nadia Ellington', title: 'Vice President', firm: 'Healthcare / Middle Market', style: 'Warm but exacting. Explains the why once, expects you to remember it. Hates a number presented without a range. Will ask "and what would make you wrong" about every conclusion.', voice: 'warm-exacting', initials: 'NE' },
  ],
  opening: [
    { personaId: 'vp', text: `Morning. Need a precedent screen on Project Meridian before the Friday internal.` },
    { personaId: 'vp', text: `Meridian is single-use surgical instruments. $210M revenue, $52M LTM EBITDA, so about a 25% margin. Growing high single digits. Not a rocket ship, a good steady business.` },
    { personaId: 'vp', text: `Deal list is off our desk marks, use these, do not go hunting: Baxter / Hillrom, EV $10,500M on $700M LTM EBITDA. BD / Bard, EV $24,000M on $1,150M. Boston Scientific / BTG, EV $4,200M on $260M. Teleflex / Z-Medica, EV $500M on $27M. Stryker / Wright Medical, EV $5,400M on $180M. Medtronic / Mazor Robotics, EV $1,600M on negative LTM EBITDA.` },
    { personaId: 'vp', text: `Compute EV/LTM EBITDA for each, then give me the median and apply it to Meridian's $52M. I want the mean on the page too, but I want you to tell me which one you would actually use and why.` },
    { personaId: 'vp', text: `Two of those deals will try to trick you. Deal with them explicitly, do not just delete the row. One tab, .xlsx, before lunch.` },
  ],
  artifacts: [
    {
      id: 'precedents',
      label: 'Precedent Transactions',
      format: 'xlsx',
      prompt: `Build a precedent transactions screen for Project Meridian using the six deals Nadia gave you. Show:
• Acquirer / Target, and the EV and LTM EBITDA as provided
• EV/LTM EBITDA for each deal
• Mazor flagged nm (negative LTM EBITDA), not deleted
• Median and Mean of the valid multiples, stated separately
• Meridian implied EV at the median, applied to $52M LTM EBITDA
• Meridian implied EV at the mean, so the difference is visible
• A short note saying which you would use and why

Upload as .xlsx.`,
      rubric: `Grade as a healthcare IB VP reviewing a two-week analyst's precedent screen. Score 1-10:

ACCURACY (1-10)
- Multiples: Hillrom 15.0x, Bard 20.9x, BTG 16.2x, Z-Medica 18.5x, Wright 30.0x. Mazor nm.
- Median of the five valid = 18.5x. Mean = 20.1x. Both must appear.
- Meridian at median: 18.5 x $52M = $962M. At mean: 20.1 x $52M = about $1,046M.
- The $84M gap between the two is the whole point of the exercise. If they only show one, mark it down.

HANDLING THE TWO TRAPS (1-10)
- Mazor: negative LTM EBITDA. Correct treatment is a visible nm flag and exclusion from the median, NOT a deleted row. Deleting it silently is the single worst outcome here.
- Wright Medical at 30.0x: it is not an error, the target was growing far faster. It should stay in the set and the analyst should note WHY it is high. Excluding it to make the median prettier is a judgment failure.

JUDGMENT (1-10)
- Did they pick the median and say why? Correct reasoning: five data points, one outlier at 30x drags the mean up, the median is what a typical deal in this set cleared at.
- Anyone who says "use the mean because it uses all the data" has missed it.
- Bonus if they note precedents include a control premium, so this range sits above where Meridian would trade publicly.

FORMATTING (1-10)
- One tab. Multiples to one decimal. nm visibly flagged. Median and mean labelled, not just a number at the bottom of a column.

End with verdict in Nadia's voice (under 60 words). One of: "Good, this goes in the book.", "Close. Fix [X] and resend before the internal.", "Come find me, we need to talk through what a median is for." Cite 1-2 specific cells.`,
      requestedBy: 'vp',
    },
  ],
};

const IB_5: Scenario = {
  id: 'ib-5',
  trackId: 'ib',
  title: 'Accretion / dilution, cash versus stock',
  summary: 'The MD wants to know what we can pay before it goes dilutive, and whether to pay in cash or paper.',
  timeframe: 'Board pre-read',
  duration: '40 min',
  difficulty: 'Intermediate',
  context: `You cover industrials. Our client Calder Industries ($CLD, public) is looking at buying Renwick Controls ($RNW, public). The board meets Monday and the MD needs the accretion / dilution math and a single slide. Calder: 100M shares at $40.00, so a $4.0B market cap, $200M net income, $2.00 EPS, 20.0x P/E. Renwick: 40M shares, currently trading $24.00, $60M net income, $1.50 EPS. Calder can raise acquisition debt at 6.0%. Effective tax rate 25%. The MD wants the deal run at three offer prices, $30.00, $33.00 and $36.00, each in two structures, all cash funded with debt, and all stock issued at Calder's $40.00. He wants the breakeven price for each structure and he wants a view, not just a grid.`,
  personas: [
    { id: 'md', name: 'Tobias Renner', title: 'Managing Director', firm: 'Industrials', style: 'Blunt, quick, allergic to hedging. Wants the answer in the first sentence and the reasoning after. Will interrupt. If you give him a grid with no recommendation he will ask what he is paying you for.', voice: 'blunt-fast', initials: 'TR' },
    { id: 'vp', name: 'Grace Okafor', title: 'Vice President', firm: 'Industrials', style: 'Calm, catches errors before the MD does. Will quietly tell you what Tobias actually wants when he has been unclear.', voice: 'calm-precise', initials: 'GO' },
  ],
  opening: [
    { personaId: 'md', text: `Calder / Renwick. Board sees this Monday. I need to know what we can pay.` },
    { personaId: 'md', text: `Calder: 100M shares, $40 a share, $200M of net income. Renwick: 40M shares, trades at $24, $60M of net income. We can borrow at 6%. Tax 25%.` },
    { personaId: 'md', text: `Run it at $30, $33 and $36. Cash funded entirely with debt, and all stock at our $40. Six cells. Then tell me the breakeven price for each structure.` },
    { personaId: 'vp', text: `To translate: he wants the grid, but what he actually wants is the one line at the top telling him which structure buys him more room. Lead with that.` },
    { personaId: 'md', text: `Model in Excel, one slide for the board. Do not send me a slide with six numbers and no recommendation.` },
  ],
  artifacts: [
    {
      id: 'accretion-model',
      label: 'Accretion / Dilution Model',
      format: 'xlsx',
      prompt: `Build the accretion / dilution analysis for Calder / Renwick. Assumptions:
• Calder: 100M shares, $40.00, $200M net income (EPS $2.00, 20.0x P/E)
• Renwick: 40M shares, $24.00 unaffected, $60M net income (EPS $1.50)
• Cash structure: 100% funded with new debt at 6.0%, 25% tax rate
• Stock structure: new Calder shares issued at $40.00
• No synergies. Do not model transaction fees.
• Offer prices: $30.00, $33.00, $36.00

Show for each price and structure: purchase equity value, new shares issued (stock) or interest expense after tax (cash), pro forma net income, pro forma share count, pro forma EPS, and accretion / dilution versus $2.00.

Also solve for the breakeven offer price under each structure.

Upload as .xlsx.`,
      rubric: `Grade as an industrials MD reviewing an analyst's accretion / dilution model. Score 1-10:

CORE MATH (1-10)
Check these exact figures.
- At $30: equity $1,200M. CASH: interest $72.0M, after tax $54.0M, PF NI $206.0M, EPS $2.06, +3.0% accretive. STOCK: 30.0M new shares, 130.0M total, PF NI $260M, EPS $2.00, neutral (0.0%).
- At $33: equity $1,320M. CASH: EPS $2.006, +0.3%. STOCK: 33.0M new shares, EPS $1.955, -2.3% dilutive.
- At $36: equity $1,440M. CASH: interest $86.4M, after tax $64.8M, EPS $1.952, -2.4%. STOCK: 36.0M new shares, 136.0M total, EPS $1.912, -4.4% dilutive.
Anything off by more than a cent on EPS is a problem. The most common error is forgetting to tax-effect the interest.

BREAKEVEN (1-10)
- STOCK breakeven is exactly $30.00. CASH breakeven is $33.33.
- If they got $30.00 for stock but cannot explain WHY it is exactly $30, they got lucky. The reason: at $30 Renwick's P/E is 20.0x, identical to Calder's. Stock deals are neutral when the multiples match.

THE INSIGHT (1-10)
This is what separates a good analyst here.
- Calder's 20.0x P/E is a 5.0% earnings yield. Debt at 6.0% pre-tax is 4.5% after tax.
- Cash is accretive whenever 4.5% is cheaper than what you buy. Stock is accretive only when the target P/E is below 20.0x.
- That is why cash buys roughly $3.33 more room per share than stock here.
- Full marks only if the model or the note says something equivalent. A grid with no reasoning is a 5.

JUDGMENT (1-10)
- Did they note that accretion is not the same as value creation? Cash looks better here purely because debt is cheap and it adds leverage and risk that EPS does not show.
- Did they flag that no synergies are modeled, so this is a floor?

End with verdict in Tobias's voice (under 60 words). One of: "Good. This goes to the board.", "Math is right, the recommendation is missing. Add it.", "Redo it, you did not tax-effect the interest." Cite 1-2 specific cells.`,
      requestedBy: 'md',
    },
    {
      id: 'board-slide',
      label: 'Board Slide',
      format: 'pptx',
      prompt: `Build a single board slide for the Calder / Renwick accretion analysis.

Requirements:
• One slide. Not two.
• The headline must be the recommendation, not a label. "Cash structure supports up to $33 before dilution" beats "Accretion / Dilution Analysis".
• Show the 3 x 2 grid (three prices, two structures), accretion / dilution percentage in each cell
• Mark both breakevens visibly
• One line of takeaway. Not a paragraph.
• Footnote the assumptions: no synergies, 6.0% debt, 25% tax, stock issued at $40.00

Upload as .pptx.`,
      rubric: `Grade as an industrials MD who will put this in front of a board on Monday. Score 1-10:

HEADLINE (1-10)
- Does the title say something, or is it a label? "Accretion / Dilution Analysis" is a label and scores 3. The headline should state the conclusion.
- A board member reading only the headline should learn the answer.

THE GRID (1-10)
- Six cells, correct: cash +3.0% / +0.3% / -2.4%, stock 0.0% / -2.3% / -4.4%.
- Accretive and dilutive visually distinguishable at a glance.

BREAKEVENS (1-10)
- $30.00 stock and $33.33 cash both present and marked.

DISCIPLINE (1-10)
- One slide. Assumptions footnoted, not in the body. No decoration. No clip art. Numbers aligned.
- Does the takeaway line say what to do rather than restate the grid?

End with verdict in Tobias's voice (under 60 words). One of: "That works, send it.", "Headline is a label. Rewrite it and resend.", "This is two slides pretending to be one." Cite the headline verbatim.`,
      requestedBy: 'md',
    },
  ],
};

const IB_6: Scenario = {
  id: 'ib-6',
  trackId: 'ib',
  title: 'QofE lands at 9pm and the deal just got worse',
  summary: 'Diligence cut $12M of EBITDA out of the target. Reprice it and tell the MD what it does to the deal.',
  timeframe: '9pm Friday',
  duration: '50 min',
  difficulty: 'Advanced',
  context: `Sell-side, and it is going badly. We are advising Northvale Packaging on its sale to a sponsor. Signed LOI at 11.0x on $85M of adjusted EBITDA, so a $935M enterprise value. The buyer's quality of earnings report landed at 8:40pm tonight and it strips $12M out of adjusted EBITDA: $5M of owner compensation below market that will not persist, $4M of "one-time" restructuring charges that have now appeared in three consecutive years, and $3M of a customer rebate accrual that was released into earnings. Real adjusted EBITDA is $73M. The buyer has not said what they will do yet, but they will call at 8am Monday and they will not be paying $935M. The MD wants to walk into that call knowing every number.`,
  personas: [
    { id: 'md', name: 'Eleni Sarkis', title: 'Managing Director', firm: 'Industrials / Sell-side', style: 'Composed under pressure, which makes her harder to read than a shouter. Wants to know what she does not know. Will ask you what the buyer is going to argue and expects you to have thought about it first.', voice: 'composed-probing', initials: 'ES' },
  ],
  opening: [
    { personaId: 'md', text: `QofE just hit. It is not good. Read it tonight, I need the repricing before Monday.` },
    { personaId: 'md', text: `We signed at 11.0x on $85M, so $935M. They are cutting $12M out. $5M of below-market owner comp, $4M of restructuring that has now shown up three years running, $3M of a rebate accrual release.` },
    { personaId: 'md', text: `So real adjusted EBITDA is $73M. I need three things. What is the deal worth at 11.0x on the new number. What multiple are they paying if they hold the $935M. And which of those three add-backs can we actually fight.` },
    { personaId: 'md', text: `Be honest with me on the third one. If we go into Monday defending an add-back we cannot defend, we lose credibility on the two that matter.` },
    { personaId: 'md', text: `Model in Excel, memo in Word, both by 7am Sunday. I want the memo short enough that I can read it in the car.` },
  ],
  artifacts: [
    {
      id: 'reprice',
      label: 'Repricing Bridge',
      format: 'xlsx',
      prompt: `Build the repricing analysis for Northvale.

Show:
• The EBITDA bridge: $85M reported adjusted, less the three QofE adjustments, to $73M
• Value at 11.0x on $73M
• The price drop versus the $935M LOI
• The implied multiple if the buyer holds $935M against real EBITDA of $73M
• A sensitivity: enterprise value across multiples 10.0x to 12.0x and EBITDA of $73M, $77M and $85M, so the MD can see what winning back each add-back is worth
• Per add-back, the value at stake at 11.0x

Upload as .xlsx.`,
      rubric: `Grade as a sell-side MD reading this at 6am before a call she cannot lose. Score 1-10:

THE BRIDGE (1-10)
- $85M less $5M owner comp, less $4M restructuring, less $3M rebate release = $73M. Each adjustment on its own line, labelled.
- Value at 11.0x x $73M = $803M.
- Drop versus $935M = $132M. This is the number the MD says out loud on Monday. It must be correct and it must be findable in under three seconds.
- Implied multiple holding $935M: $935M / $73M = 12.8x. If they wrote 11.0x they do not understand the question.

VALUE PER ADD-BACK (1-10)
- At 11.0x, each $1M of EBITDA is worth $11M of EV. So owner comp is worth $55M, restructuring $44M, rebate $33M.
- This is what tells the MD which fight is worth having.

SENSITIVITY (1-10)
- A 3 x 3 grid at minimum. At 11.0x: $73M gives $803M, $77M gives $847M, $85M gives $935M.
- Correct grid, correctly labelled axes.

JUDGMENT (1-10)
- Did they rank the add-backs by defensibility rather than by size?
- The honest read: owner comp is the STRONGEST fight, since a new owner genuinely will not pay the founder above market, and that is a real normalization every buyer accepts. The rebate release is arguable but weak, it flattered earnings and the buyer is right to question it. The restructuring is INDEFENSIBLE, three consecutive years of "one-time" charges is a run rate, not a one-off, and arguing it costs credibility on the other two.
- An analyst who fights all three, or who ranks them by dollar value, has missed what the MD asked.

End with verdict in Eleni's voice (under 60 words). One of: "This is what I needed. See you Monday.", "The math is right, the ranking is wrong. Call me.", "You are fighting the restructuring. Read the three-year history again." Cite 1-2 specific cells.`,
      requestedBy: 'md',
    },
    {
      id: 'md-memo',
      label: 'Monday Call Memo',
      format: 'docx',
      prompt: `Write the memo Eleni reads in the car before the 8am call.

Requirements:
• One page. Hard limit.
• Open with the number: what the deal is worth now and what the drop is.
• The three add-backs, ranked by whether we can defend them, with the value at stake on each
• What you expect the buyer to open with, and what our counter is
• The walk-away line: at what price does the client stop
• No throat-clearing. She has read the QofE. Do not summarize it back to her.

Upload as .docx.`,
      rubric: `Grade as a sell-side MD who has 6 minutes in a car. Score 1-10:

LEADS WITH THE ANSWER (1-10)
- First sentence must contain $803M or the $132M drop. If the memo opens with background, score 3.
- No summary of the QofE. She read it.

THE RANKING (1-10)
- Add-backs ranked by defensibility, not size: owner comp (defensible, $55M at stake), rebate release (weak, $33M), restructuring (indefensible, $44M).
- The reasoning must be present, not just the ranking. Three years of one-time charges is the whole argument on the restructuring.

ANTICIPATES THE BUYER (1-10)
- Does it say what the buyer opens with? The likely open is all three cuts stand, price is $803M.
- Is there a counter, and is it credible? Conceding the restructuring immediately to buy credibility on owner comp is the strong play.

THE WALK-AWAY (1-10)
- Is there a number? A memo that will not name the floor is not useful in a negotiation.

DISCIPLINE (1-10)
- One page. Short sentences. No hedging language. No "it should be noted that".

End with verdict in Eleni's voice (under 60 words). One of: "Good. This is exactly the call I am making.", "You buried the number. Rewrite the first line.", "You are still fighting all three. Pick." Quote the first sentence back.`,
      requestedBy: 'md',
    },
  ],
};

const PE_1: Scenario = {
  id: 'pe-1',
  trackId: 'pe',
  title: 'Paper LBO, new deal brief',
  summary: 'A consumer deal brief hit the inbox at 10am. Senior associate wants a paper LBO and a one-page take by EOD.',
  timeframe: 'EOD ask',
  duration: '40 min',
  difficulty: 'Intermediate',
  context: `Middle-market PE fund ($2B AUM). The deal under consideration is Project Summit: a DTC outdoor-apparel brand. Think a private brand at the scale of an early Allbirds, Cotopaxi, or Outdoor Voices: $180M LTM revenue, 12% YoY growth, $35M LTM EBITDA (19% margin), founder-led, 70% repeat customers. Banker is running a process; first-round bids due in 3 weeks. Sponsor target entry: 10.5x LTM EBITDA. Standard mid-market structure: ~55% debt at SOFR+475 (assume SOFR 5.0%), 5-year hold, exit at same multiple. The deal lead (Principal) wants a quick paper LBO and a one-page take memo by EOD, should we keep going or pass. All the data points you need are in this scenario, no proprietary CIM access required.`,
  personas: [
    { id: 'principal', name: 'Sam Garcia', title: 'Principal', firm: 'Crescent Equity Partners', style: 'Commercial, pattern-matches fast. Cares more about thesis than mechanics, but if the LBO math doesn\'t work, that\'s a no. Will ask "is this a 2.5x or a 3.5x deal?" and expect a number with a reason.', voice: 'commercial', initials: 'SG' },
    { id: 'sr-assoc', name: 'Rachel Kim', title: 'Senior Associate', firm: 'Crescent Equity Partners', style: 'Sharp on the model, will catch math errors instantly. Patient with new associates but expects them to do their own diligence before asking.', voice: 'sharp-modeler', initials: 'RK' },
  ],
  opening: [
    { personaId: 'sr-assoc', text: `Project Summit is a private DTC outdoor apparel brand. $180M revenue, $35M EBITDA, founder-led. Think Allbirds or Cotopaxi at the $180M scale, before any IPO chatter. Everything you need is in the scenario brief, no actual CIM to pull.` },
    { personaId: 'sr-assoc', text: `Sam wants two things by EOD. First, paper LBO with 3 cases. Then a one-pager take memo. Do the LBO first, the memo references the numbers.` },
    { personaId: 'sr-assoc', text: `LBO assumptions: 10.5x entry, 55% debt at SOFR+475 (SOFR = 5.0%), 5-year hold, exit at entry multiple. Base case: 8% revenue CAGR, hold EBITDA margin at 19%. Downside: 5% revenue, margin to 17%. Upside: 12% revenue, margin to 21%. MOIC and IRR on each.` },
    { personaId: 'sr-assoc', text: `One-pager is your call on what to flag. Sam reads them fast, lead with the answer. Both as separate files.` },
    { personaId: 'principal', text: `Don't overcomplicate this. I just want to know: at 10.5x, does this clear our hurdle in any reasonable case, and what's the one thing that could break it. Send when ready.` },
  ],
  artifacts: [
    {
      id: 'paper-lbo',
      label: 'Paper LBO, 3 Cases',
      format: 'xlsx',
      prompt: `Build a paper LBO on Project Summit. Three cases: base, downside, upside.
Base:
• 10.5x LTM entry, 55% debt at 9.75% interest
• 8% revenue CAGR, 19% EBITDA margin held flat
• 5% capex / 5% D&A as % of revenue
• 25% tax rate, 100% FCF sweep to debt
• 5-year hold, exit at 10.5x

Downside: 5% revenue CAGR, margin compresses to 17% linearly.
Upside: 12% revenue CAGR, margin expands to 21% linearly.

Show MOIC and IRR for each case. Upload as .xlsx.`,
      rubric: `Grade as a PE Senior Associate at a middle-market fund. Score 1-10:

SOURCES & USES (1-10)
- Entry EV = 10.5 × $35M = $367.5M. Debt = $202M. Equity = $165M. (Allow small fees variation.)

THREE CASES (1-10)
- Base, downside, upside all built? Each labeled clearly?
- Common error: only varying one input, not actually building distinct scenarios.

REVENUE/EBITDA BUILD (1-10)
- Base case: $180M → $264M revenue (8% CAGR), $50M Y5 EBITDA (19% × $264M)?
- Downside / upside math consistent with stated assumptions?

DEBT + INTEREST (1-10)
- Interest = 9.75% × beginning-period debt?
- FCF sweep modeled correctly?
- Common error: missing debt paydown entirely (debt stays flat).

EXIT + RETURNS (1-10)
- Exit EV = 10.5 × Y5 EBITDA per case?
- Equity proceeds = Exit EV - remaining debt + cash?
- Base MOIC roughly 2.2-2.7x, IRR ~18-22%? Downside <2x? Upside ~3x+?

CASE COMPARISON (1-10)
- Table or summary at top showing MOIC and IRR side-by-side?
- Sam reads the answer first, is the answer visible without scrolling?

End with verdict in Rachel's voice (under 60 words). Cite the actual IRRs the student got. One of: "Send to Sam.", "Fix [X] before sending.", "Numbers don't tie, redo." Be specific.`,
      requestedBy: 'sr-assoc',
    },
    {
      id: 'one-pager',
      label: 'One-Page Take',
      format: 'docx',
      prompt: `Write a one-page take memo on Project Summit. Required:
• Recommendation: KEEP GOING or PASS, lead with it
• Thesis (3-5 sentences): why this works (or why it doesn't)
• Returns summary: base MOIC/IRR, range across cases
• Key risks (3 bullets): what could break the deal
• Diligence asks (3 bullets): what you'd want to confirm before bidding

Keep it to one page. Sam reads fast. Upload as .docx.`,
      rubric: `Grade as a PE Principal reviewing a one-page take. Score 1-10:

LEDE (1-10)
- Recommendation in the first sentence? (Keep going / Pass / Pursue with conditions)
- Common error: burying the recommendation after 3 paragraphs of context.

THESIS QUALITY (1-10)
- 3-5 sentences that actually argue the deal: moat, growth path, exit story?
- Vague platitudes ("great brand", "loyal customers") get marked down. Reject "innovative."

RETURNS FRAMING (1-10)
- Base case MOIC/IRR cited specifically? Range across cases shown?
- Tied back to "does this clear the fund's hurdle"?

RISK ARTICULATION (1-10)
- Three risks that actually matter for DTC apparel: CAC inflation, ad-platform dependency, founder transition, inventory cycle, channel concentration, etc.
- Reject generic risks like "market risk" or "competition" without specificity.

DILIGENCE ASKS (1-10)
- Three specific things to confirm, repeat customer cohort behavior, customer acquisition payback, gross margin trajectory, founder commitment, etc.
- Should feel like a banker call list, not academic.

WRITING (1-10)
- Concise. Active voice. PE-style: punchy, numbers anchored.
- One page.

End with verdict in Sam's voice (under 70 words). One of: "Set up a follow-up call.", "Push to next round.", or "Pass, here's why." Cite 1-2 specific lines from the memo. Tell the student what they got right or wrong about the thesis.`,
      requestedBy: 'principal',
    },
  ],
};

const PE_2: Scenario = {
  id: 'pe-2',
  trackId: 'pe',
  title: 'IC memo defense',
  summary: 'Your full LBO is done. Write the IC risks section and walk the partners through it.',
  timeframe: 'Pre-IC',
  duration: '45 min',
  difficulty: 'Advanced',
  context: `Same fund (Crescent Equity Partners), but now Project Summit has cleared first round and the team is heading into final IC next Tuesday. Use these LBO case outputs as given (you don't need to rebuild the model): base 2.5x MOIC / 21% IRR, downside 1.7x / 11% IRR, upside 3.2x / 27% IRR. The deal team's recommendation is to go to LOI at 10.5x. The Principal wants the analyst to draft the "Key Risks & Mitigants" section of the IC memo AND prep for two specific partner questions: (1) what's our edge here vs. a strategic, (2) what's the bear case for ad-platform dependency given they're 65% Meta/Google. All context for your work is in this scenario.`,
  personas: [
    { id: 'partner', name: 'Diane Mosse', title: 'Partner', firm: 'Crescent Equity Partners', style: 'Quiet, surgical. Asks one question, listens to the answer fully, then asks the question that exposes the weakness. Famous for spotting the unmitigated risk.', voice: 'surgical', initials: 'DM' },
    { id: 'principal', name: 'Sam Garcia', title: 'Principal', firm: 'Crescent Equity Partners', style: 'Same as PE-1, commercial, fast.', voice: 'commercial', initials: 'SG' },
  ],
  opening: [
    { personaId: 'principal', text: `IC is Tuesday. Diane is going to grill us on risks.` },
    { personaId: 'principal', text: `Draft the Key Risks and Mitigants section of the IC memo. Four to six risks, each with a real mitigant (not 'we'll watch this').` },
    { personaId: 'principal', text: `I also need you ready for two specific questions: what's our edge vs. a strategic acquirer, and bear case on Meta and Google dependency since 65% of customer acquisition is paid social and search.` },
    { personaId: 'partner', text: `When you send the risks section, I'll read it tonight. Be honest. The risks I worry about most are the ones the deal team underweights. If your mitigant is 'we will monitor closely,' that's not a mitigant.` },
  ],
  artifacts: [
    {
      id: 'risks-memo',
      label: 'IC Memo, Risks & Mitigants Section',
      format: 'docx',
      prompt: `Draft the "Key Risks & Mitigants" section of the IC memo for Project Summit. Required:
• 4-6 risks, ranked by severity (worst first)
• For each risk: 2-3 sentence description of WHY it's a risk for THIS deal (not generic), the specific mitigant the deal team will execute, and a residual-risk acknowledgement
• Cover at minimum: ad-platform dependency, founder transition / key-person, inventory/working-capital cycle, customer concentration or cohort decay
• One bonus risk of your choice

Upload as .docx.`,
      rubric: `Grade as a PE Partner reviewing the risks section of an IC memo. Score 1-10:

RISK SPECIFICITY (1-10)
- Risks tailored to THIS deal (DTC outdoor apparel, $180M, founder-led, 65% paid social)?
- Reject generic ("market downturn," "competition") without specificity.

RANKING (1-10)
- Risks ordered by severity? The deal-killer at the top, not buried?

MITIGANT QUALITY (1-10)
- Each mitigant a concrete, executable action, not "we will monitor"?
- Examples of good mitigants: diversify paid channels with explicit budget allocation; insurance on the founder; covenant on inventory days outstanding.
- Examples of bad mitigants: "we will watch closely", "management has a plan", "industry standard practice".

RESIDUAL HONESTY (1-10)
- Does the writer acknowledge what risk REMAINS after the mitigant?
- This is what separates a real risks section from PR, Partners care about this.

REQUIRED RISKS COVERED (1-10)
- Ad-platform dependency, founder transition, inventory cycle, customer concentration / cohort, all addressed?
- The Meta/Google one is the headline risk for this deal; it should be there and be specific.

WRITING (1-10)
- Concise, IC-memo style. Bullets or numbered list, clean structure.
- No marketing-speak.

End with verdict in Diane's voice (under 80 words): "I'm comfortable taking this to IC.", "I have questions, let's talk tomorrow.", or "This isn't ready, redo." Cite the strongest and weakest specific risk in the memo. Be honest. Don't soften.`,
      requestedBy: 'partner',
    },
  ],
};

const PE_3: Scenario = {
  id: 'pe-3',
  trackId: 'pe',
  title: 'Management presentation prep',
  summary: 'Mgmt presentation tomorrow with the target CEO. Write your question list. Then write up the takeaways.',
  timeframe: 'Diligence day',
  duration: '35 min',
  difficulty: 'Intermediate',
  context: `Crescent Equity Partners, Project Summit deal team. Tomorrow's the management presentation: 90 minutes with Summit's CEO and CFO at their HQ. Given the brief on the deal (DTC outdoor apparel, $180M revenue, $35M EBITDA, founder-led, 70% repeat customers; Allbirds- or Cotopaxi-style at $180M scale), the analyst's job tonight: write a structured question list (15-20 questions across financial, commercial, organizational, and strategic) AND prep the takeaway template the team will fill in live during the meeting. All context you need is in this scenario.`,
  personas: [
    { id: 'sr-assoc', name: 'Rachel Kim', title: 'Senior Associate', firm: 'Crescent Equity Partners', style: 'Same as PE-1, sharp, patient, expects pre-work done.', voice: 'sharp-modeler', initials: 'RK' },
  ],
  opening: [
    { personaId: 'sr-assoc', text: `Mgmt presentation is tomorrow with Summit's CEO and CFO. 90 minutes. I need two things from you tonight.` },
    { personaId: 'sr-assoc', text: `First, a structured question list. 15 to 20 Qs across financial, commercial, organizational, strategic. Group by category in a Word doc.` },
    { personaId: 'sr-assoc', text: `Make the questions specific. 'Tell us about growth' is a wasted question. Send when ready.` },
  ],
  artifacts: [
    {
      id: 'question-list',
      label: 'Mgmt Presentation Question List',
      format: 'docx',
      prompt: `Build a structured question list for the Project Summit mgmt presentation.
Categories:
• FINANCIAL (revenue trajectory, margin drivers, working capital, capex, FCF), 4-5 Qs
• COMMERCIAL (customer cohorts, CAC/LTV, channel mix, brand, pricing power), 5-6 Qs
• ORGANIZATIONAL (key people, founder transition plan, ops capability, culture), 3-4 Qs
• STRATEGIC (growth plan, M&A, international, channels, white space), 3-4 Qs

Questions should be specific to a DTC outdoor apparel company at $180M revenue with 65% paid-channel acquisition. Generic questions will be marked down. Upload as .docx.`,
      rubric: `Grade as a PE Senior Associate reviewing a management-presentation question list. Score 1-10:

SPECIFICITY (1-10)
- Are the questions ABOUT Summit specifically (DTC outdoor, ~$180M, founder-led, paid-social-heavy)?
- Reject generic: "What's your strategy?", "Tell us about your competitors."
- Reward specific: "Your repeat rate is 70%, how does that decompose by acquisition cohort year?"

CATEGORY BALANCE (1-10)
- All four categories present with the right rough counts?
- Not all 20 questions on financials, commercial diligence is just as important.

QUESTION CRAFT (1-10)
- Open-ended where it matters (strategy, culture); specific where it matters (numbers, cohorts, retention).
- No yes/no questions where an open-ended would yield more.

PRIORITIZATION (1-10)
- Most important questions early in each category?
- Time is finite in a 90-min meeting, does the order help the team get to the highest-value info first?

CHANNEL DEPENDENCY FOCUS (1-10)
- Multiple questions probing the 65% Meta/Google exposure: cohort behavior on free vs paid customers, channel diversification plans, CAC trajectory, etc.
- This is THE deal-defining variable; if there are <2 questions about it, mark down.

FORMAT (1-10)
- Grouped by category with headers. Numbered.
- Easy for the team to bring into a meeting.

End with verdict in Rachel's voice (under 60 words): "Bring this tomorrow.", "Tighten [X] and we're good.", "Step back, these aren't the right questions." Cite 1 strong question and 1 weak one.`,
      requestedBy: 'sr-assoc',
    },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
// CONSULTING
// ═════════════════════════════════════════════════════════════════════════════

const CON_1: Scenario = {
  id: 'consulting-1',
  trackId: 'consulting',
  title: 'Margin problem, Day 3 on the case',
  summary: 'Partner hands you a slice: why are margins down 400bps YoY? Structure it, build a slide, defend.',
  timeframe: 'Wednesday',
  duration: '40 min',
  difficulty: 'Intermediate',
  context: `Bain-style consulting engagement. Client is NorthPeak Brewing Co., a $400M revenue regional craft brewer. Think a smaller regional version of Boston Beer Company ($SAM, the public craft brewer that owns Sam Adams and Truly), at the scale where multi-state distribution is the growth question. Operating margin compressed from 14% to 10% over the past 12 months and the CEO wants to know why before the board meeting in 3 weeks. Day 3 of the case. The data points the consulting team has gathered (for context only, you don't need the underlying files): 24 months of P&L by SKU and channel, COGS detail (ingredients, packaging, freight, labor), volume data by region, pricing data by channel, competitive pricing benchmarks. The partner has assigned the student to own the diagnostic, build the issue tree, then put together a slide that lays out the top drivers with sizing. The issue tree is a conceptual exercise, structure all possible drivers; you're not analyzing the actual P&L file.`,
  personas: [
    { id: 'partner', name: 'Marcus Bell', title: 'Partner', firm: 'Bain & Company', style: 'Pattern-recognizing, fast. Cares about "what\'s the answer in one sentence" and whether the structure holds up. Will probe MECE explicitly. Patient teaching mode unless the work is sloppy.', voice: 'pattern-fast', initials: 'MB' },
    { id: 'em', name: 'Sara Patel', title: 'Engagement Manager', firm: 'Bain & Company', style: 'Operational, exacting, structures everything. Will rebuild your issue tree on a whiteboard if it\'s not MECE.', voice: 'structured', initials: 'SP' },
  ],
  opening: [
    { personaId: 'em', text: `You're owning the margin diagnostic for NorthPeak. Two deliverables by EOD.` },
    { personaId: 'em', text: `First, an issue tree. What are all the possible drivers of the 400bps compression, structured MECE.` },
    { personaId: 'em', text: `Second, a single slide that lays out the top 3 drivers with rough sizing of each. You're not opening a data file, this is a conceptual exercise: hypothesize the drivers, size each from what's typical in craft brewing, and frame the slide for an exec audience. Marcus will look at both tomorrow morning.` },
    { personaId: 'partner', text: `Don't overthink the tree. Just make sure it's mutually exclusive and collectively exhaustive at each level. The slide is what matters. I want to see 'here are the top 3 drivers, here's how much each one explains, here's what we'd do about it.'` },
  ],
  artifacts: [
    {
      id: 'issue-tree',
      label: 'Margin Issue Tree',
      format: 'docx',
      prompt: `Build an issue tree for "Why are NorthPeak's operating margins down 400bps YoY?"
Structure:
• Top: the question
• Level 1: 2-3 primary branches (e.g., "Revenue/price drivers" vs "Cost drivers", or "Gross margin" vs "Operating expenses")
• Level 2: 3-5 sub-branches under each
• Level 3 (where useful): specific testable hypotheses

MECE at every level. Each branch should be testable with the data we have. Upload as .docx (you can use indentation or numbered hierarchy, doesn't need to be a graphic).`,
      rubric: `Grade as a Bain EM reviewing a 2nd-year consultant's issue tree. Score 1-10:

MECE, TOP LEVEL (1-10)
- Are the 2-3 top branches mutually exclusive and collectively exhaustive?
- Common good cuts: GM% vs OpEx%; or Volume vs Price vs Cost; or by P&L line.
- Common bad cuts: "internal vs external" (too vague), random categories that overlap.

MECE, LEVEL 2 (1-10)
- Do the sub-branches actually decompose their parent without overlap?
- Common error: listing things at the wrong altitude (a sub-branch that's bigger than its parent).

TESTABILITY (1-10)
- Can each leaf be tested in principle with typical data sources for a brewer (P&L by SKU/channel, COGS, volume)?
- Bad leaf: "competitive pressure" with no specified test.
- Good leaf: "Pack mix shift to lower-margin SKUs, testable via SKU-level GM trend."

COVERAGE (1-10)
- Are the obvious drivers in there: input cost inflation (ingredients, freight), pack/channel mix, pricing actions, volume deleveraging on fixed costs, SG&A growth outpacing revenue?
- Missing 2+ obvious drivers = mark down.

DEPTH (1-10)
- Does the tree go deep enough that the leaves are actually actionable, or does it stop at headlines?

PRESENTATION (1-10)
- Clearly readable hierarchy. Numbering or indentation consistent.

End with verdict in Sara's voice (under 70 words): "MECE check passes, go build the slide.", "Restructure [X] and resend.", or "Step back, this isn't the right cut." Be specific about which branch is the problem.`,
      requestedBy: 'em',
    },
    {
      id: 'driver-slide',
      label: 'Top Drivers Slide',
      format: 'pptx',
      prompt: `Build a single slide titled something like "Three drivers explain ~85% of the 400bps margin compression."
Required content:
• Headline that states the answer
• 3 driver bars or boxes showing % of margin decline each driver explains (must roughly sum to the total)
• For each driver: 1-2 line description of WHAT it is and WHY it happened
• Below each driver: a "so what", what we'd do about it (1 line)
• Source line and a "Note" with assumptions

Aim: a NorthPeak exec could read this slide alone and walk away knowing the answer. Upload as .pptx.`,
      rubric: `Grade as a Bain Partner reviewing a single answer slide. Score 1-10:

HEADLINE (1-10)
- Does the title state the ANSWER, not the topic?
- Good: "Three drivers explain 85% of margin compression: input costs (40%), pack mix (30%), promo intensity (15%)."
- Bad: "Margin Analysis" or "Drivers of margin compression."

SIZING (1-10)
- Do the three drivers actually quantify and roughly sum to the total decline?
- If they sum to 50% you need a 4th driver or an "other"; if they sum to 110% something is wrong.

DRIVER QUALITY (1-10)
- Are the drivers real (input inflation, mix, promo) and not generic ("market dynamics," "competition")?
- Each driver has a "what" + a "why" that's specific?

"SO WHAT" PER DRIVER (1-10)
- Each driver has an action implication?
- Reject generic "should be addressed", needs to be a real lever.

VISUAL HIERARCHY (1-10)
- Eye flows from headline → sizing → driver details → so-what?
- Or is the slide a wall of text?

SOURCING (1-10)
- Note line states data source and any major assumptions?

End with verdict in Marcus's voice (under 70 words): "I can use this with the CEO.", "One iteration.", or "Redo, the answer isn't in the headline." Cite the headline and one driver specifically.`,
      requestedBy: 'partner',
    },
  ],
};

const CON_2: Scenario = {
  id: 'consulting-2',
  trackId: 'consulting',
  title: 'Stakeholder interview, VP of Ops',
  summary: 'You\'re interviewing the client\'s VP of Ops. They\'re skeptical. Write the interview guide first.',
  timeframe: 'Client site',
  duration: '30 min',
  difficulty: 'Intermediate',
  context: `Same NorthPeak engagement. The team's hypothesis is that pack-mix shift (a move from 6-pack cans to single-serve aluminum bottles, which carry lower margins) explains a chunk of the margin decline. The VP of Operations would know if there's been a deliberate channel/pack push, what's driving it, and what operational levers exist. The VP is known to be skeptical of consultants, last firm "didn't tell us anything we didn't know." Student needs to prepare an interview guide (questions + structure) before the 60-minute meeting tomorrow.`,
  personas: [
    { id: 'em', name: 'Sara Patel', title: 'Engagement Manager', firm: 'Bain & Company', style: 'Same as CON_1, operational, exacting.', voice: 'structured', initials: 'SP' },
  ],
  opening: [
    { personaId: 'em', text: `Tomorrow you're interviewing Tom Reilly, VP of Ops at NorthPeak. He's not a fan of consultants. We have 60 minutes.` },
    { personaId: 'em', text: `Write an interview guide. Opening framing (two minutes: why we're here, what we hope to learn, what we'll share back). Then 8 to 12 structured questions across pack mix, channel push, supply chain, ops capability.` },
    { personaId: 'em', text: `Make the questions specific. Generic ones will tank the meeting. Group by topic with rough time allocations. Word doc.` },
  ],
  artifacts: [
    {
      id: 'interview-guide',
      label: 'Stakeholder Interview Guide',
      format: 'docx',
      prompt: `Draft an interview guide for Tom Reilly (VP of Ops, NorthPeak).
Required structure:
• Opening framing, 2-3 sentences you'd actually say to him: why we're here, what we hope to learn, what we'll share back. Be respectful of his time and his skepticism.
• Section 1: Pack mix & SKU strategy, 3-4 questions (deliberate push? margin per pack? what does ops see?)
• Section 2: Channel dynamics, 2-3 questions (on/off-premise mix, retailer pressure)
• Section 3: Supply chain & input costs, 2-3 questions (ingredient sourcing, freight, aluminum)
• Section 4: Operational levers, 2-3 questions (what HE thinks we should be looking at)
• Closing, 1-2 sentences to reset rapport and ask for follow-ups

Upload as .docx.`,
      rubric: `Grade as a Bain EM reviewing a stakeholder interview guide. Score 1-10:

OPENING FRAMING (1-10)
- Does it acknowledge his time and signal genuine interest in his perspective (not "we already have the answer, we want to validate")?
- A skeptical VP will shut down if framing is consultant-speak.

QUESTION SPECIFICITY (1-10)
- Are questions about NorthPeak's actual situation (single-serve cans, regional craft, recent pack-mix shift)?
- Reject: "Tell us about ops at NorthPeak."
- Reward: "We've seen a ~7-point shift toward single-serve bottles in the last 18 months, was that a deliberate push, a customer pull, or both?"

OPEN vs CLOSED MIX (1-10)
- Mostly open questions, with targeted closed where verification is needed?
- Common error: too many leading questions ("Do you think the pack mix is the problem?").

SECTION COVERAGE (1-10)
- All four sections present with the right rough counts?
- Each section's questions hang together topically?

HUMILITY (1-10)
- Is there a question that explicitly asks HIM what HE thinks we're missing?
- A skeptical stakeholder will warm up if you ask their opinion. Without this question, the interview is one-way and will go badly.

CLOSING (1-10)
- Re-establishes rapport. Asks for follow-up access (data, his team).

End with verdict in Sara's voice (under 70 words): "Walk into the meeting with this.", "Tighten [X] first.", or "Restructure, this guide won't work with a skeptic." Cite one specific strong question and one weak one.`,
      requestedBy: 'em',
    },
  ],
};

const CON_3: Scenario = {
  id: 'consulting-3',
  trackId: 'consulting',
  title: 'Final readout, recommendation slide review',
  summary: 'Final readout tomorrow. Partner is going to challenge every slide. Build the recommendation slide.',
  timeframe: 'Pre-readout',
  duration: '45 min',
  difficulty: 'Advanced',
  context: `End of NorthPeak engagement. The team's diagnostic concluded: 50% of margin compression from input cost inflation (mostly aluminum and freight), 25% from pack-mix shift toward single-serve, 15% from incremental promo spend. Recommended actions: (a) renegotiate aluminum supply contract with hedging; (b) raise prices on single-serve packs by 4-6% in priority channels; (c) shift promo intensity from price-off to volume-pack bundles. Expected impact: recapture ~280bps of the 400bps over 18 months. The CEO readout is tomorrow at 10am. Student is owning the recommendation slide.`,
  personas: [
    { id: 'partner', name: 'Marcus Bell', title: 'Partner', firm: 'Bain & Company', style: 'Same as CON_1, pattern-fast, will probe.', voice: 'pattern-fast', initials: 'MB' },
  ],
  opening: [
    { personaId: 'partner', text: `Readout is tomorrow. I want the recommendation slide tonight. One slide.` },
    { personaId: 'partner', text: `Headline is 'recapture ~280bps over 18 months with three actions.' Below: the three actions, each with rough sizing of bps impact, the lever (what changes), the owner (who at NorthPeak drives it), and timing.` },
    { personaId: 'partner', text: `Below that: a small risks and dependencies box. Don't make me read it twice. The CEO needs to nod once and move on.` },
  ],
  artifacts: [
    {
      id: 'recommendation-slide',
      label: 'Recommendation Slide',
      format: 'pptx',
      prompt: `Build a single recommendation slide for the NorthPeak CEO readout.
Required:
• Headline: "Recapture ~280bps over 18 months via three actions"
• Three action boxes/rows, each with: ACTION (1 line), bps impact (e.g., "~120bps"), lever (what specifically changes), owner (function), timing (months)
• Risks & dependencies box (3-4 short bullets)
• Source/methodology footnote

Upload as .pptx.`,
      rubric: `Grade as a Bain Partner reviewing the final recommendation slide. Score 1-10:

HEADLINE (1-10)
- States the answer, the magnitude, and the timeline?
- "Three actions to recapture ~280bps over 18 months" passes. "Recommended Actions" fails.

ACTIONS, SPECIFICITY (1-10)
- Each action is a concrete lever (not "improve pricing")?
- Aluminum: contract renegotiation with hedging.
- Pack mix: price increases on specific packs in specific channels.
- Promo: shift from price-off to bundle.

SIZING (1-10)
- Each action sized in bps?
- Roughly sums to ~280bps (allowing for "less than additive" caveat)?

OWNERSHIP + TIMING (1-10)
- Each action has a function owner and a rough timing window?
- Without ownership the slide is a wish list.

RISKS BOX (1-10)
- 3-4 honest risks/dependencies (supplier negotiation could fail, channel pushback on price, etc.)?
- Or is it window-dressing ("execution risk")?

VISUAL HIERARCHY (1-10)
- Eye lands on headline first, then sizing, then actions?
- One slide that the CEO can read in 30 seconds and grasp?

PROFESSIONAL POLISH (1-10)
- CEO-readout quality: alignment, font, white space, footnote sourcing?

End with verdict in Marcus's voice (under 80 words): "I'll present this tomorrow.", "One iteration, the [X] needs work.", or "Step back, this doesn't land." Cite the headline and one action specifically. Be honest.`,
      requestedBy: 'partner',
    },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
// RESTRUCTURING
// ═════════════════════════════════════════════════════════════════════════════

const RX_1: Scenario = {
  id: 'rx-1',
  trackId: 'rx',
  title: 'Covenant breach at 6am',
  summary: 'Sponsor calls, portfolio co breached its leverage covenant overnight. Situation overview before the 9am lender call.',
  timeframe: 'Early AM',
  duration: '45 min',
  difficulty: 'Advanced',
  context: `Lazard Restructuring. The client is Apex Sponsor Group, a mid-market PE fund. Their portfolio company, Cascade Industrial (industrial parts distribution, ~$400M revenue, ~$60M LTM EBITDA), tripped its 5.5x net leverage covenant at Q3, actual leverage came in at 6.2x. Think of the business as a smaller, leveraged version of MSC Industrial ($MSM) or Fastenal ($FAST), only in the auto aftermarket vertical and under sponsor ownership. Capital structure: $250M Term Loan B at SOFR+450 (held by ~12 lenders, agent is BlackRock), $80M revolver (undrawn $30M of $80M capacity, agent JPM), $40M of sponsor equity-like preferred. EBITDA decline driven by ~15% volume drop in a key end-market (auto aftermarket) plus aluminum input cost spikes. Sponsor wants options on the table by 9am for a call with the TLB agent. The student is the analyst on the deal team.`,
  personas: [
    { id: 'md', name: 'Eleanor Voss', title: 'Managing Director', firm: 'Lazard / Restructuring', style: 'Crisis-mode calm. Old-school. Will ask you to defend every number with a source within 30 seconds. Believes the best Rx bankers are the ones who can hold both sides of the table in their head simultaneously.', voice: 'crisis-calm', initials: 'EV' },
    { id: 'vp', name: 'Daniel Reyes', title: 'VP', firm: 'Lazard / Restructuring', style: 'Fast, exacting on numbers. Cap stack mistakes are unforgivable. Will say "show me the math" without warning.', voice: 'numbers-fast', initials: 'DR' },
  ],
  opening: [
    { personaId: 'md', text: `Cascade tripped its leverage covenant overnight. 6.2x against a 5.5x test.` },
    { personaId: 'md', text: `Apex needs options on the table for the 9am call with the TLB agent. One-page situation overview from you in the next 40 minutes. Capital structure, what tripped the covenant, immediate liquidity position, the universe of solutions we'd put on the table.` },
    { personaId: 'md', text: `Lead with the answer. Don't give me a history lesson.` },
    { personaId: 'vp', text: `After the situation overview, build out the cap stack analysis in Excel. Current structure with rates, tenors, holders, key covenants. Plus a sensitivity showing leverage at +/- 10% EBITDA. I'll need it before the call ends. Get the situation overview to Eleanor first.` },
  ],
  artifacts: [
    {
      id: 'situation-overview',
      label: 'Situation Overview Memo',
      format: 'docx',
      prompt: `Draft a one-page situation overview for the 9am lender call. Required structure:
• HEADLINE (1 line): the answer, what happened, what we're proposing
• SITUATION (3-4 sentences): the covenant breach, leverage at 6.2x vs 5.5x test, what drove EBITDA down
• CAPITAL STRUCTURE (table or bullets): TLB $250M, revolver $80M (drawn/undrawn), prefs $40M, leverage by tranche
• LIQUIDITY (2-3 bullets): cash position, revolver availability, runway under base case
• PATH FORWARD (3-4 bullets): the universe of options, amendment + fee, equity cure, refinance, A&E, more invasive options
• ASKS (2-3 bullets): what we need from lenders on this call

One page. Lead with the answer. Upload as .docx.`,
      rubric: `Grade as an Rx MD reviewing a first-year's situation overview at 7:30am before a lender call. Score 1-10:

LEDE (1-10)
- Headline states what happened AND the proposed direction in one line?
- Common error: burying the proposal under 2 paragraphs of background. The agent reads the first line, decides whether to keep reading.

CAP STACK ACCURACY (1-10)
- TLB ($250M, SOFR+450), revolver ($80M capacity, drawn vs undrawn), preferred ($40M), all stated correctly?
- Common error: confusing drawn vs committed; missing the agent / lender groups; omitting rates.

LEVERAGE MATH (1-10)
- Current leverage stated as net debt / LTM EBITDA = 6.2x?
- Test threshold (5.5x) cited?
- Cushion (or lack of it) framed as bps or turns?

LIQUIDITY HONESTY (1-10)
- Real liquidity picture: cash + revolver availability, monthly burn, runway in months?
- Reject vague "adequate liquidity", needs a number.

OPTIONS RANGE (1-10)
- Real menu: amendment-with-fee, equity cure (if doc allows), refinancing, A&E (amend & extend), more invasive (DDTL, sponsor injection, partial paydown)?
- Each option a one-liner with the trade-off?
- Generic "various options" gets marked down.

ASKS (1-10)
- Specific things from the lenders on this call (waiver duration, fee level, info access, standstill)?
- Without asks the call has no purpose.

WRITING (1-10)
- One page. No filler. Banker prose, short sentences, numbers anchored.

End with verdict in Eleanor's voice (under 80 words): "Send to Apex, walk into the call.", "Tighten [X] in five minutes.", or "Step back, this isn't ready." Cite 1-2 specific lines.`,
      requestedBy: 'md',
    },
    {
      id: 'cap-stack-analysis',
      label: 'Capital Structure Analysis',
      format: 'xlsx',
      prompt: `Build a cap stack analysis for Cascade in Excel. Required:
• Tranche-by-tranche table: instrument, balance, rate, maturity, holder/agent, key covenants, secured/unsecured
• Total debt, net debt (assume $15M cash), LTM EBITDA $60M
• Leverage by tranche: TLB-only, total funded, total committed
• Sensitivity table: leverage at -10%, base, +10% EBITDA
• Maturity profile (year by year) showing principal due
• Top 5 TLB holders (assume the data is given): BlackRock 28%, Oaktree 18%, Apollo 12%, Ares 10%, Antares 8%, other 24%

Upload as .xlsx.`,
      rubric: `Grade as an Rx VP reviewing the cap stack analysis. Score 1-10:

TRANCHE COMPLETENESS (1-10)
- All three layers shown: TLB $250M, revolver $80M (with drawn detail), prefs $40M?
- Each row: balance, rate, maturity, holder, key covenant, secured status?

LEVERAGE MATH (1-10)
- TLB-only leverage = $250M / $60M = ~4.2x?
- Total funded leverage (debt + drawn revolver) computed correctly?
- Net leverage subtracts the $15M cash?
- Common error: counting prefs as debt OR counting them in equity, call out which the analyst chose and whether it's defensible.

SENSITIVITY TABLE (1-10)
- Leverage at -10%, base, +10% EBITDA shown clearly?
- At -10% EBITDA = $54M → leverage ~6.9x, properly flagged as further out of compliance?

MATURITY WALL (1-10)
- Year-by-year principal maturity?
- Highlights the year of the TLB maturity?

HOLDER CONCENTRATION (1-10)
- Top 5 TLB holders shown with percentages?
- Total of top 5 noted (cumulative concentration)?
- This is critical for restructuring, who controls the agent vote.

FORMATTING (1-10)
- Inputs separated from outputs?
- Numbers right-aligned, decimals consistent?
- Source row?

End with verdict in Daniel's voice (under 70 words): "Bring it to the call.", "Fix [X], then ship.", or "Numbers don't tie." Cite specific cells.`,
      requestedBy: 'vp',
    },
  ],
};

const RX_2: Scenario = {
  id: 'rx-2',
  trackId: 'rx',
  title: 'Recovery waterfall, first pass',
  summary: 'Distressed specialty retailer. Build a recovery waterfall under three scenarios for the IC pre-read.',
  timeframe: 'First week',
  duration: '40 min',
  difficulty: 'Intermediate',
  context: `PJT Partners Restructuring. Mandate is debtor-side advisor for Marquee Apparel, a 240-store specialty retailer in voluntary Chapter 11. Think Express ($EXPR before its April 2024 Ch. 11) or Forever 21: mall-anchored, mid-tier price point, hit by traffic decline and DTC pressure. Pre-petition capital structure: $180M ABL (secured by inventory + receivables, ~$120M drawn at filing), $250M senior secured notes (4-year remaining tenor, 8.5% coupon, second lien on remaining collateral), $100M unsecured notes, $40M trade payables, $80M lease obligations capitalized. Enterprise value estimates: liquidation $185M, going-concern low $275M, going-concern high $380M. Analyst is building the recovery waterfall the team will use in the IC pre-read.`,
  personas: [
    { id: 'principal', name: 'Mira Okonkwo', title: 'Principal', firm: 'PJT Partners', style: 'Sharp. Will read a waterfall and immediately ask "what happens to recoveries if the GC range moves down 15%?" Cares about the second-order sensitivity, not just the point estimate.', voice: 'sensitivity-driven', initials: 'MO' },
  ],
  opening: [
    { personaId: 'principal', text: `Need a clean recovery waterfall for Marquee. Three scenarios: liquidation ($185M), going-concern low ($275M), going-concern high ($380M).` },
    { personaId: 'principal', text: `Walk the priority. Admin claims first (assume $15M), then ABL ($120M drawn), then senior secured notes ($250M), then unsecured notes ($100M), then trade ($40M, treated as unsecured), then leases ($80M). Treat lease cure and assumption costs as priority (assume cure of $25M), rejection damages on the rest as unsecured.` },
    { personaId: 'principal', text: `Show recovery % by class. For the GC scenarios, also show implied recovery in cash vs. new equity at a stated exit multiple. I'll review in 35 minutes.` },
  ],
  artifacts: [
    {
      id: 'recovery-waterfall',
      label: 'Recovery Waterfall',
      format: 'xlsx',
      prompt: `Build a recovery waterfall for Marquee Apparel in Excel.

Three scenarios across the top: Liquidation ($185M), GC Low ($275M), GC High ($380M).

Priority order (rows):
1. Admin claims & superpriority, $15M (paid in full where possible)
2. ABL, $120M drawn (first lien on inventory/receivables)
3. Senior secured notes, $250M (second lien on remaining collateral, then unsecured to extent of deficiency)
4. Lease cure & assumption, $25M (priority for assumed leases)
5. Unsecured notes, $100M
6. Trade payables, $40M (unsecured)
7. Lease rejection damages, ~$55M (unsecured)
8. Equity, wiped in all cases

For each class and each scenario: claim amount, distribution amount, recovery %.

For GC scenarios show the form of consideration (cash vs new equity vs new debt), assume secured gets a mix of cash + new debt, unsecured gets new equity at the exit value.

Upload as .xlsx.`,
      rubric: `Grade as an Rx Principal reviewing a recovery waterfall. Score 1-10:

PRIORITY ORDER (1-10)
- Admin → ABL → senior secured → lease cures → unsecured (notes, trade, lease rejection) → equity?
- Common error: putting trade ahead of unsecured notes (they're pari passu), or treating leases all as one class.

CLAIM AMOUNTS (1-10)
- All claim figures match brief? ABL drawn $120M (not committed $180M)?
- Lease split into cure ($25M priority) and rejection (~$55M unsecured)?

DISTRIBUTION MATH, LIQUIDATION (1-10)
- $185M proceeds. After $15M admin, $170M to ABL, ABL recovers 100% ($120M). Remaining $50M.
- $50M to senior secured (claim $250M, secured to value of remaining collateral; assume the remainder is unsecured-deficiency). Recovery on secured notes: $50M / $250M = 20%? Plus deficiency claim joins unsecured pool with zero recovery in liquidation case.
- Unsecured (notes, trade, rejection damages) get zero.

DISTRIBUTION MATH, GC SCENARIOS (1-10)
- GC Low ($275M): admin $15M, ABL $120M, leases $25M cure = $160M priority. Remaining $115M to senior secured ($250M claim = 46% recovery). Unsecured gets zero (post-secured deficiency).
- GC High ($380M): admin $15M, ABL $120M, leases $25M, then $220M to senior secured ($250M = 88%). Remaining $0, unsecured still zero or tiny.
- If the analyst includes a higher GC assumption where unsecured starts to recover, ok.

FORM OF CONSIDERATION (1-10)
- GC scenarios: senior secured gets a mix of cash + new debt + new equity?
- Unsecured (where recovering) gets new equity at exit multiple?

RECOVERY %s (1-10)
- Recovery % column for each class × scenario?
- Sense-check: secured > unsecured in every scenario?

SENSITIVITY (1-10)
- Bonus: a sensitivity table showing recoveries at $250M, $300M, $350M EV?

End with verdict in Mira's voice (under 70 words): "Take this into IC.", "Tighten [X] before sharing.", or "Step back, the priority is wrong." Cite specific cells/scenarios.`,
      requestedBy: 'principal',
    },
  ],
};

const RX_3: Scenario = {
  id: 'rx-3',
  trackId: 'rx',
  title: '13-week cash flow under pressure',
  summary: 'Distressed industrial. Build the 13-week CF for the DIP sizing conversation.',
  timeframe: 'Pre-filing prep',
  duration: '40 min',
  difficulty: 'Intermediate',
  context: `Houlihan Lokey. Mandate is debtor-side for Drayton Manufacturing, an industrial fabrication company heading toward a likely Chapter 11 filing in ~30 days. Think a smaller, leveraged version of Olympic Steel ($ZEUS) or Insteel Industries ($IIIN) in metal fabrication, hit by demand cyclicality and a stretched balance sheet. The team is sizing DIP financing for a 13-week post-petition runway. Recent monthly data: revenue ~$24M/month declining, gross margin ~22%, operating cash burn (pre-restructuring costs) ~$3M/month, $8M cash on hand. Restructuring costs (professional fees, retention) expected at ~$2M/month. Critical vendor payments will be needed week 1 (~$5M) to avoid supply disruption. Customer concentration: top 5 = 60% of revenue, billing cycles 30-60 days. The senior associate wants a 13-week cash flow forecast that shows: weekly inflows, weekly outflows by category, ending cash, minimum DIP size to maintain $5M minimum operating cash. Analyst owns the build.`,
  personas: [
    { id: 'sr-assoc', name: 'Aaron Park', title: 'Senior Associate', firm: 'Houlihan Lokey', style: 'Methodical, will catch arithmetic errors in real time, will ask "why this week?" if line items look smooth.', voice: 'methodical', initials: 'AP' },
  ],
  opening: [
    { personaId: 'sr-assoc', text: `13-week CF for Drayton. DIP sizing conversation tomorrow with the lender. Weekly cadence, W1 through W13.` },
    { personaId: 'sr-assoc', text: `Inflows: customer collections (assume 60% of monthly revenue collects W2-3 after billing, 30% in W4-5, 10% in W6+).` },
    { personaId: 'sr-assoc', text: `Outflows: payroll (every 2 weeks, ~$2.4M each), critical vendor payments (~$5M in W1 then ~$1.5M weekly), other vendors ($800K weekly), restructuring professional fees (~$500K weekly), insurance and utility (~$200K weekly).` },
    { personaId: 'sr-assoc', text: `Starting cash $8M. Minimum operating cash $5M. Tell me the minimum DIP needed to clear all 13 weeks. Build it so a lender can audit it.` },
  ],
  artifacts: [
    {
      id: 'thirteen-week',
      label: '13-Week Cash Flow',
      format: 'xlsx',
      prompt: `Build a 13-week cash flow forecast for Drayton Manufacturing.

Layout: weeks across columns (W1 to W13), categories down rows.

Required rows:
• Beginning cash
• INFLOWS: Customer collections (split by aging, current month, M-1, M-2)
• OUTFLOWS:
  - Payroll (every other week, ~$2.4M)
  - Critical vendor (Week 1: ~$5M, then ~$1.5M weekly)
  - Other vendors (~$800K weekly)
  - Restructuring professional fees (~$500K weekly)
  - Insurance/utility (~$200K weekly)
• Net cash flow
• Ending cash (before DIP)
• DIP draw needed to maintain $5M min cash
• Cumulative DIP balance

Assume monthly revenue of $24M, declining at ~3% month-over-month. Bill in week 1 of each month. Apply 60/30/10 collection curve.

Upload as .xlsx.`,
      rubric: `Grade as an Rx Senior Associate reviewing a 13-week CF that will go to a DIP lender. Score 1-10:

WEEKLY GRID (1-10)
- 13 distinct weekly columns with weekly numbers (not just monthly figures divided by 4.3)?
- Common error: smoothing payroll across all weeks (it's bi-weekly, lumpy).

INFLOW TIMING (1-10)
- Collections curve actually built (60/30/10 by aging), not just "monthly revenue / 4"?
- Inflows lag the billing, early weeks should be light, picking up by W3+?

OUTFLOW REALISM (1-10)
- Critical vendor $5M in W1, then ~$1.5M weekly, modeled correctly, not smoothed?
- Payroll appears every OTHER week (W1, W3, W5...), not weekly?
- Other vendors weekly $800K, professional fees $500K weekly, utility $200K weekly?

NET CASH + ENDING CASH (1-10)
- Ending cash carries forward correctly week to week (W1 ending = W2 beginning)?
- Pre-DIP ending cash will likely turn negative in the first 4-6 weeks, flagged clearly?

DIP SIZING LOGIC (1-10)
- DIP draws sized to keep ending cash ≥ $5M minimum?
- Cumulative DIP balance shown?
- Peak DIP balance highlighted (this is the answer the lender wants)?

AUDIT-ABILITY (1-10)
- Each row sourced (collection curve, payroll dates, vendor schedule)?
- Inputs separated from calculations?
- A lender's analyst could re-perform every line?

End with verdict in Aaron's voice (under 70 words): "Take it to the lender call.", "Fix [X] first.", or "Re-build, the timing is wrong." Cite specific weeks where the model has issues. State the peak DIP balance the analyst arrived at and whether it looks right.`,
      requestedBy: 'sr-assoc',
    },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
// SALES & TRADING
// ═════════════════════════════════════════════════════════════════════════════

const ST_1: Scenario = {
  id: 'st-1',
  trackId: 'st',
  title: 'Morning meeting + opening hour',
  summary: 'Sit in on the morning meeting. Write a one-paragraph desk commentary and a starting axe sheet.',
  timeframe: 'AM session',
  duration: '35 min',
  difficulty: 'Intermediate',
  context: `Investment-grade credit trading desk at a bulge-bracket bank. It's Tuesday, 7:15am. Overnight: 10Y Treasury rallied 6bps to 4.32% on softer-than-expected PCE in the Eurozone. Asia equity weak. WTI -1.4%. Specific desk inventory: long $40M of XYZ 5.5% '32 senior unsecured (large bid we did from a real-money client yesterday at G+135), long $25M of ABC 4.875% '29, short $15M of HealthCo 6.0% '30 (we sold a block to a HF and need to recover the bonds). Today's calendar: 8:30am ISM Services, 10am Fed speaker (hawkish lean expected), $4B 30Y reopening at 1pm. Desk run from senior trader to analyst: "give me a one-paragraph morning note for the sales force, and an axe sheet, what we want to do, in what size, at what level."`,
  personas: [
    { id: 'sr-trader', name: 'Mike Donato', title: 'Senior Trader', firm: 'Bulge Bracket / IG Credit', style: 'Direct, no fluff, will cut you off if your morning note is academic. Wants a one-line read of the day, the desk\'s positioning, and the trade ideas. Will ask "where are you showing the XYZ?" without warning.', voice: 'direct-trader', initials: 'MD' },
  ],
  opening: [
    { personaId: 'sr-trader', text: `Morning. We're long $40M of XYZ 5.5% '32 from the print yesterday, long $25M of ABC 4.875% '29, short $15M of HealthCo 6.0% '30 we need to cover. Curve rallied 6bps overnight on EU PCE.` },
    { personaId: 'sr-trader', text: `Calendar: ISM at 8:30, Fed speaker at 10, $4B 30Y reopening at 1pm.` },
    { personaId: 'sr-trader', text: `Write me a one-paragraph desk commentary for the sales force. Then a starting axe sheet for the day: what we're better buyers and sellers of, in what size, at what indicative levels. Send both before 7:45.` },
  ],
  artifacts: [
    {
      id: 'morning-commentary',
      label: 'Morning Desk Commentary',
      format: 'docx',
      prompt: `Write a one-paragraph (4-6 sentences) morning desk commentary that the salesforce will use with clients. Required content:
• One-line read of the macro setup (rates direction, key data/events today)
• The desk's positioning bias (where we want to be, adding duration, fading rallies, etc.)
• 1-2 specific trade ideas relevant to today's tape
• What's on the calendar that could move things

Tone: trader-direct. No filler. No academic phrasing. Upload as .docx.`,
      rubric: `Grade as a senior IG credit trader reviewing a morning commentary that's about to go to ~60 salespeople. Score 1-10:

LEAD (1-10)
- One-line read of the macro setup that frames the day?
- Common error: starting with overnight news headlines verbatim. The salesforce already read those.

DESK POSITIONING (1-10)
- Does it actually say what we want to do (lean long, fade strength, stay defensive on duration, look for spread widening)?
- A morning note without a stance is useless.

TRADE IDEAS (1-10)
- 1-2 specific ideas tied to today's tape (e.g., "look to add belly of the IG curve on weakness ahead of ISM" or "selectively trim weakest credits before Fed speaker")?
- Generic ("be selective") gets marked down.

CALENDAR AWARENESS (1-10)
- ISM 8:30, Fed speaker 10, 30Y reopening 1pm, named explicitly with a "watch for" line?

VOICE (1-10)
- Trader tone, short sentences, conversational, no hedge-everything academic prose?
- Reject phrases like "it may be prudent to consider", replace with "we're better buyers".

LENGTH DISCIPLINE (1-10)
- 4-6 sentences? Tight?
- Long-winded commentary doesn't get read on a desk.

End with verdict in Mike's voice (under 60 words): "Send it out.", "Tighten [X] and resend.", or "Rewrite." Cite the strongest line and the weakest.`,
      requestedBy: 'sr-trader',
    },
    {
      id: 'axe-sheet',
      label: 'Starting Axe Sheet',
      format: 'xlsx',
      prompt: `Build the desk's starting axe sheet for today.
Columns: Bond, Coupon, Maturity, Side (B / O), Indicative Size, Indicative Level (spread to UST), Notes/Color

Required rows:
• XYZ 5.5% '32, we're long $40M, would BETTER OFFER (look to lighten) in $10M clips
• ABC 4.875% '29, long $25M, neutral/willing seller above current
• HealthCo 6.0% '30, short $15M, would PAY UP for the bonds, mark as bid wanted in size
• Add 2 additional comp names you'd quote on a runs basis (high-grade, similar duration)

Levels should make sense given current spreads (assume IG single-A ~G+110-140 area, IG BBB ~G+150-180). Notes column: 1-line color on why we're showing each level. Upload as .xlsx.`,
      rubric: `Grade as a senior IG trader reviewing an axe sheet that will be sent to sales for client distribution. Score 1-10:

POSITION ACCURACY (1-10)
- XYZ shown as offered (sell side)?
- HealthCo shown as bid (we need to cover the short)?
- ABC shown as offered or neutral (we're long but no specific axe to lighten)?
- Sides match the position, wrong side is a desk-killing error.

LEVELS PLAUSIBILITY (1-10)
- IG spreads in the right zip code (G+110-180 area for IG depending on rating/sector)?
- Spreads don't look obviously off-market vs the sector?

SIZE DISCIPLINE (1-10)
- Showing in reasonable clips ($5-10M typical)?
- Not showing the entire position size as available (rookie mistake, gives away the position).

COLOR COLUMN (1-10)
- Each line has a one-line "why this level" or "what we'd do bigger" note?
- Useful color for the salesforce, not boilerplate?

COVERAGE (1-10)
- 2 additional runs-quote names included with sensible levels?

FORMAT (1-10)
- Clean, scannable, one row per bond?
- Salesforce can read it in 10 seconds?

End with verdict in Mike's voice (under 60 words): "Sales has it.", "Fix [X] first.", or "Pull it back, redo." Cite the side and level on at least one specific bond.`,
      requestedBy: 'sr-trader',
    },
  ],
};

const ST_2: Scenario = {
  id: 'st-2',
  trackId: 'st',
  title: 'EOD P&L review',
  summary: 'Market close. Write the EOD P&L note. Defend the day to the senior trader.',
  timeframe: 'EOD',
  duration: '30 min',
  difficulty: 'Advanced',
  context: `Same IG credit desk. End of day. Today's actual tape: ISM Services hot at 56.2 (vs 54.5 expected), 10Y rallied 8bps to 4.40, IG spreads widened ~3bps in BBB, ~1-2bps in single-A. Desk activity today: sold $30M of the XYZ '32 long at G+138 (we owned at G+135, small loss on spread but rates rallied off our buy, mixed). Covered $10M of HealthCo short at G+165 (we were short from G+158, small loss). Added $15M of new long: PowerGrid 5.25% '31 at G+125. Net day: estimated daily P&L is -$140K (rates effect positive ~$60K, spread effect negative ~$200K). Senior trader wants an EOD note: what we did, why, P&L summary, position into tomorrow.`,
  personas: [
    { id: 'sr-trader', name: 'Mike Donato', title: 'Senior Trader', firm: 'Bulge Bracket / IG Credit', style: 'Same as ST_1. At EOD he wants honesty. A bad day with clear reasoning beats a good day with a confused write-up.', voice: 'direct-trader', initials: 'MD' },
  ],
  opening: [
    { personaId: 'sr-trader', text: `Long day. Need your EOD note in 25 minutes.` },
    { personaId: 'sr-trader', text: `What we did today, why, P&L attribution (rates vs. spread), positions going into tomorrow, any concerns. Be honest. I'd rather see 'we faded the wrong direction on HealthCo and paid for it' than spin.` },
  ],
  artifacts: [
    {
      id: 'eod-note',
      label: 'EOD P&L Note',
      format: 'docx',
      prompt: `Write the EOD desk note.
Required sections:
• HEADLINE (1 line): the day in one sentence
• TODAY'S ACTIVITY (3-5 bullets): trades done, sizes, levels, reasoning
• P&L ATTRIBUTION (3 lines): total P&L, split into rates effect and spread effect
• POSITIONS INTO TOMORROW (table or bullets): what's still on the book
• OUTLOOK / RISK (2-3 sentences): what we're watching tomorrow, any concerns

Tone: direct, honest. Don't spin a loss. Upload as .docx.`,
      rubric: `Grade as a senior trader reviewing an analyst's EOD note. Score 1-10:

HEADLINE (1-10)
- Captures the day in one sentence (e.g., "Spread widening on hot ISM cost us ~$140K despite a rates tailwind")?
- Avoid generic ("Mixed day in IG").

ACTIVITY CLARITY (1-10)
- Each trade: name, size, side, level, brief reason?
- Common error: missing the WHY, just saying "sold $30M XYZ at G+138" tells the trader nothing he doesn't already know.

P&L ATTRIBUTION (1-10)
- Total P&L stated (-$140K)?
- Split: rates contribution (+$60K from rally) vs spread contribution (-$200K from widening)?
- This is the most important thing senior traders read.

HONESTY (1-10)
- Does the note acknowledge what didn't work (HealthCo cover at a worse level than the short)?
- Spin-free? Senior traders trust honesty.

POSITIONS SECTION (1-10)
- Current book stated clearly: long $10M XYZ '32 (residual), long $25M ABC '29, short $5M HealthCo (residual), new long $15M PowerGrid '31?
- Net duration / spread exposure cited?

OUTLOOK (1-10)
- 2-3 sentences naming actual catalysts tomorrow (CPI, Fed speakers, supply calendar)?
- Real concerns flagged?

WRITING (1-10)
- Tight, trader prose. No fluff.

End with verdict in Mike's voice (under 60 words): "Saved it for the file.", "Tighten [X] and resend.", or "Rewrite, this isn't the story." Cite one specific line.`,
      requestedBy: 'sr-trader',
    },
  ],
};

const ST_3: Scenario = {
  id: 'st-3',
  trackId: 'st',
  title: 'Client RFQ, pricing a block',
  summary: 'Real-money client wants a price on a $20M block. Send the trade rationale memo for senior trader sign-off.',
  timeframe: 'Intraday',
  duration: '30 min',
  difficulty: 'Advanced',
  context: `Same desk. 11:20am. A real-money asset manager just sent the desk an RFQ: they want a bid on $20M of MidwestTel 5.875% '30, an IG BBB-rated telecom name. Think paper that trades alongside Verizon ($VZ) and AT&T ($T) but at a wider spread, more like Lumen ($LUMN) territory given the BBB rating and the bias toward widening. Recent screen: bonds last traded at G+155 about 90 minutes ago. Comparable BBB telecom paper of similar maturity is currently trading G+150-160 with a slight widening bias today. Desk position: zero (not currently long or short the name). Bond duration ~5.2 years, current spread duration ~5.2 years. Senior trader is on a call and wants a memo with the proposed bid, the rationale, and the risk we'd be taking on if we win it. Has to be sent within 15 minutes, client gave a 30-minute window.`,
  personas: [
    { id: 'sr-trader', name: 'Mike Donato', title: 'Senior Trader', firm: 'Bulge Bracket / IG Credit', style: 'Same as ST_1/ST_2. Wants a clear bid with a number and a defense in 5 minutes. Will ask "what\'s our edge here?", i.e., why win this trade at all if we don\'t have a buyer lined up.', voice: 'direct-trader', initials: 'MD' },
  ],
  opening: [
    { personaId: 'sr-trader', text: `Got an RFQ. Real-money wants a bid on $20M of MidwestTel '30. Last screen G+155 about 90 min ago, comp BBB telecom in the +150-160 zip. We're flat the name.` },
    { personaId: 'sr-trader', text: `Send me a memo in 10 minutes: your proposed bid (in spread terms), why that level, what the risk looks like if we win it, and whether we have a natural buyer to recycle.` },
    { personaId: 'sr-trader', text: `I'm on a call but I'll read it on the way back. If the bid makes sense I'll send back 'go' and you hit them.` },
  ],
  artifacts: [
    {
      id: 'trade-rationale',
      label: 'Trade Rationale Memo',
      format: 'docx',
      prompt: `Write a trade rationale memo for the MidwestTel RFQ.
Required sections:
• PROPOSED BID: spread level + your concession (e.g., "G+160, ~5bps below last screen") + dollar price approx
• RATIONALE: 2-3 sentences on why that level (recent prints, comp spreads, day's tape direction)
• RISK PROFILE: if we win, what's our exposure (DV01, spread DV01, holding period assumption)
• RECYCLING PLAN: do we have a natural buyer? If not, what's the plan to lay off the risk?
• GO / NO-GO recommendation

Tone: direct. Length: half a page max. Upload as .docx.`,
      rubric: `Grade as a senior IG trader reviewing a memo that will determine whether to bid on a $20M block. Score 1-10:

BID LEVEL (1-10)
- Specific spread bid (not "around the market")?
- Concession from last trade makes sense (~3-7bps wider given desk has no natural buyer)?
- Common error: bidding TOO tight to last trade (no concession for the position risk).

RATIONALE QUALITY (1-10)
- Cites recent prints, comp spreads, day's tone?
- Frames bid relative to where market is heading (widening today, that affects the bid)?

RISK SIZING (1-10)
- DV01 ~$10.4K per bp (spread duration × size, ~5.2 × $20M / 10000), calculated correctly?
- Holding period assumption stated (1 day? 3 days? 1 week?)?
- This is the senior trader's actual concern.

RECYCLING PLAN (1-10)
- Honest about whether we have an axe to recycle the bonds (no, we're flat the name)?
- If no buyer lined up, plan to either show them as a quick offer to other accounts or hedge the spread risk?

GO / NO-GO (1-10)
- A clear recommendation (not "depends")?
- Reasoning supports the recommendation?

LENGTH + CLARITY (1-10)
- Half a page or less?
- A trader on a call could read this in 60 seconds and decide?

End with verdict in Mike's voice (under 60 words): "Bid 'em.", "Adjust the level to [X] and bid.", or "Pass on this one." Cite the spread bid and the DV01 number the analyst proposed.`,
      requestedBy: 'sr-trader',
    },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
// ASSET MANAGEMENT
// ═════════════════════════════════════════════════════════════════════════════

const AM_1: Scenario = {
  id: 'am-1',
  trackId: 'am',
  title: 'Earnings update, model and PM brief',
  summary: 'A portfolio name just printed. Update the model, write a 200-word brief for the PM.',
  timeframe: 'Earnings day',
  duration: '40 min',
  difficulty: 'Intermediate',
  context: `Long-only equity fund ($8B AUM, large-cap quality strategy). The portfolio holds a 3.2% position in Old Dominion Freight Line (ODFL), a North American less-than-truckload (LTL) freight name. Q3 just printed AH: revenue $1.92B vs consensus $1.88B (+2% beat), operating ratio (key LTL metric, lower is better) 86.4% vs 86.8% expected (better), EPS $2.14 vs $2.05 expected. Guidance for Q4 raised: revenue +3-5% YoY (prior +2-4%), operating ratio expected to remain in mid-86s. Volume growth +2.1% YoY (decelerating from +3.5% last quarter), yield/pricing +3.8% YoY (accelerating). Stock initially trading +3% AH then drifted to +1.5%. The analyst's existing thesis: pricing power offsets volume softness; expanding margins despite freight recession; structural winner. The model needs updating: rebase Q4 to the raised guide, push out beyond, recompute fair value. PM wants a written brief by 7am tomorrow.`,
  personas: [
    { id: 'pm', name: 'Karthik Rangan', title: 'Portfolio Manager', firm: 'Quality-Growth LO Fund', style: 'Reads everything. Will challenge thesis drift. Wants to know what CHANGED in your view tonight vs. before the print, and what would change his mind. Doesn\'t care for a recap of the press release.', voice: 'thesis-tester', initials: 'KR' },
  ],
  opening: [
    { personaId: 'pm', text: `Old Dominion Freight Line ($ODFL) printed AH. Quick recap of what we got: revenue $1.92B (vs $1.88B consensus, beat), operating ratio 86.4% (better than 86.8% expected; lower is good in LTL), EPS $2.14 (vs $2.05). Q4 guide raised to +3-5% revenue YoY with OR in the mid-86s. Volume +2.1% (decelerating), yield/pricing +3.8% (accelerating).` },
    { personaId: 'pm', text: `By 7am I need two things. One, build the operating model in Excel from scratch. Quarterly view, last 4 quarters of actuals plus Q4E and FY. You're not pulling from any prior file, build it clean. Use the numbers above and reasonable estimates for the prior quarters (this is a craft exercise, not a data audit).` },
    { personaId: 'pm', text: `Show me revenue decomposed into yield × volume, operating ratio, operating income, EPS, and a fair value section: current price implied multiple, your view of fair multiple, and the gap. Variance vs. your prior view in a delta column.` },
    { personaId: 'pm', text: `Two, a 200-word brief. What changed in your view, what didn't, and your action recommendation (add, hold, trim). Don't recap the press release. Tell me what to do.` },
  ],
  artifacts: [
    {
      id: 'model-update',
      label: 'Updated Operating Model',
      format: 'xlsx',
      prompt: `Build the Old Dominion Freight Line operating model from scratch in Excel. You are starting from a blank file.

Required structure:
• Quarterly columns: Q1, Q2, Q3 (just printed), Q4E, FY total - minimum
• Revenue decomposed into Yield × Volume (this is the key LTL framing; without it the model is a black box)
• Operating Ratio (OR), Operating Income (revenue × (1 - OR)), Net Income, EPS
• Variance column: your number now vs. your number before the print (delta)

Numbers to use:
• Q3 actuals: revenue $1.92B, OR 86.4%, EPS $2.14
• Q4 guide: revenue +3-5% YoY (use midpoint, ~+4%), OR mid-86s (use 86.5%)
• Prior quarters: estimate reasonably from the run rate. This is a craft exercise, not a data audit. Document your assumptions.
• Volume +2.1% YoY trending down, yield/pricing +3.8% YoY trending up - use these as the next-quarter starting point

Fair value section:
• Implied multiple at the current price (assume ~22x P/E)
• Your view of fair multiple given the print and trajectory
• Implied price at your fair multiple, gap to current

Upload as .xlsx.`,
      rubric: `Grade as a buyside PM reviewing an analyst's post-print model update. Score 1-10:

ACTUALS CAPTURED (1-10)
- Q3 actuals updated correctly (revenue $1.92B, OR 86.4%, EPS $2.14)?
- Variance to prior estimates shown clearly (delta column)?

Q4 GUIDE INCORPORATED (1-10)
- Q4 revenue at midpoint of +3-5% YoY (so ~+4%)?
- OR at mid-86s as guided?
- EPS rolled forward to reflect that?

OUTER YEAR LOGIC (1-10)
- Did the analyst push 2025 numbers based on the read-through (pricing power continuing, OR sustainable)?
- Or just leave outer years untouched (often wrong, a raised Q4 usually flows)?
- Common error: bumping every year by the same %.

PRICING vs VOLUME DECOMP (1-10)
- Revenue decomposed into yield (+3.8% trending up) and volume (+2.1% trending down)?
- This is the key LTL metric, without it the model is a black box.

FAIR VALUE FRAMING (1-10)
- Fair value at current multiple AND at the analyst's view of fair multiple?
- The multiple discussion tied to: improved OR trajectory, raised guide, structural moat?
- A single fair value with no methodology is useless.

FORMATTING (1-10)
- Quarterly + annual visible, deltas highlighted?
- Inputs separated from outputs?

End with verdict in Karthik's voice (under 60 words): "Send me the brief, this is the right setup.", "Fix [X] in the model first.", or "Rebuild, your assumptions don't tie." Cite specific cells/rows.`,
      requestedBy: 'pm',
    },
    {
      id: 'pm-brief',
      label: 'PM Brief (200 words)',
      format: 'docx',
      prompt: `Write a 200-word brief on the Old Dominion print for the PM. Required:
• Recommendation in the FIRST sentence (add / hold / trim) with size
• What CHANGED in your view tonight (1-2 things, max)
• What DIDN'T change (1 line on thesis intact)
• Numbers anchor: revised PT, where stock trades now, implied upside
• What would make you change your mind (1 line, falsifiability)

200 words. Active voice. No recap of the press release. Upload as .docx.`,
      rubric: `Grade as a PM reviewing a post-print analyst brief. Score 1-10:

LEDE / RECOMMENDATION (1-10)
- Action recommendation in sentence 1 (Add 50bps / Hold / Trim 25bps)?
- Common error: 3 sentences of context before the recommendation.

WHAT CHANGED (1-10)
- 1-2 specific things ("Q4 guide raise re-rates the pricing-power thesis"; "OR trajectory pulled in 2 quarters")?
- Reject "guidance was raised", that's the news, not the analyst's view of it.

WHAT DIDN'T CHANGE (1-10)
- Brief mention that the structural thesis (LTL consolidation, network density moat) is intact?
- Without this, a PM doesn't know whether you're recommending tactical action or a thesis shift.

NUMBERS (1-10)
- Revised price target with the multiple driving it?
- Current price + implied upside %?

FALSIFIABILITY (1-10)
- 1 line on what would change the analyst's mind (e.g., "if volume decel accelerates below +1% YoY in Q1, the pricing-volume bridge starts cracking")?
- Without this the brief feels like advocacy, not analysis.

LENGTH + STYLE (1-10)
- ~200 words (give 10% leeway)?
- Active voice, no recap of the press release, no consultant prose?

End with verdict in Karthik's voice (under 60 words): "I'll act on this in the morning.", "Rewrite, lede is buried.", or "Push back, here's my concern." Cite the recommendation and one specific line.`,
      requestedBy: 'pm',
    },
  ],
};

const AM_2: Scenario = {
  id: 'am-2',
  trackId: 'am',
  title: 'Position monitoring brief, name on watch',
  summary: 'A 2.5% position has been weak for two weeks. PM wants a position monitoring brief.',
  timeframe: 'Mid-week',
  duration: '35 min',
  difficulty: 'Intermediate',
  context: `Same long-only fund. Position: 2.5% in RPM International (RPM), a specialty chemicals name added 18 months ago. Thesis: pricing power in specialty resins for industrial coatings, expanding margins, durable share. Recent: stock -11% over the past two weeks vs sector -3%, no specific news, no earnings imminent. Channel checks today: two industrial coating customers indicated softer order volumes in early September. Competitor (Arkema) said on Q2 call last week that resin pricing was "more competitive than we expected", analyst flagged it but didn't escalate. PM has noticed the weakness, asking the analyst for a position monitoring brief, is this noise, an early signal, or a thesis break.`,
  personas: [
    { id: 'pm', name: 'Karthik Rangan', title: 'Portfolio Manager', firm: 'Quality-Growth LO Fund', style: 'Same as AM_1.', voice: 'thesis-tester', initials: 'KR' },
  ],
  opening: [
    { personaId: 'pm', text: `RPM International ($RPM) is down 11% in two weeks vs. sector down 3%. No earnings, no news.` },
    { personaId: 'pm', text: `Two of your channel checks today suggested softer order volumes. Arkema said pricing was tougher than they expected last week and you flagged it.` },
    { personaId: 'pm', text: `Position monitoring brief. Is this noise, an early signal, or a real thesis crack? Be honest. If you think we should trim now, say it. Half a page.` },
  ],
  artifacts: [
    {
      id: 'position-brief',
      label: 'Position Monitoring Brief',
      format: 'docx',
      prompt: `Write a half-page position monitoring brief on RPM.
Required sections:
• CURRENT READ (1 line): noise / yellow / red
• WHAT WE'RE SEEING (3-4 bullets): the price action, the channel checks, the Arkema readthrough, anything else
• THESIS STATUS (3-4 lines): which legs of the thesis are intact, which are at risk
• ACTION RECOMMENDATION: hold / trim X% / add (with conviction reasoning)
• TRIPWIRES (2-3 bullets): what we'd need to see to change action, specific, observable

Honest, not advocacy. Upload as .docx.`,
      rubric: `Grade as a PM reviewing a position monitoring brief on a weakening 2.5% holding. Score 1-10:

CURRENT READ (1-10)
- A clear yellow / red label at the top, not buried?
- Without a label, the PM has to re-form your view from the prose.

EVIDENCE QUALITY (1-10)
- Price action, channel checks, competitor readthrough, anything else, laid out specifically?
- Reject vague: "market sentiment has weakened."

THESIS DECOMPOSITION (1-10)
- Which thesis legs are intact (share durability? specialty mix?) and which are at risk (pricing power)?
- The PM holds the position because of the thesis, the brief has to map the data back to those legs.

INTELLECTUAL HONESTY (1-10)
- Does the analyst acknowledge that they FLAGGED the Arkema comment but didn't escalate?
- Self-criticism where warranted earns credibility. Avoiding it loses it.

ACTION (1-10)
- A specific recommendation (hold / trim X% / add)?
- Conviction reasoning ("trim 50bps now, re-evaluate after the Q3 print which is 3 weeks out")?
- The hedge "monitor closely" without a position change is dodging.

TRIPWIRES (1-10)
- 2-3 SPECIFIC, OBSERVABLE things that would change the action (e.g., "if Q3 pricing comes in below +2% YoY," "if two more competitors echo the Arkema commentary")?
- Without tripwires, the PM is left to interpret signals alone.

WRITING (1-10)
- Half a page, direct, no advocacy?

End with verdict in Karthik's voice (under 70 words): "Trim per your rec, send the order.", "I disagree with the action, explain.", or "This is a thesis break, we should be discussing exit." Cite the recommendation specifically.`,
      requestedBy: 'pm',
    },
  ],
};

const AM_3: Scenario = {
  id: 'am-3',
  trackId: 'am',
  title: 'New name pitch, PM 1-pager',
  summary: 'A name you\'ve been working on is ready. Write the 1-page pitch for the PM meeting.',
  timeframe: 'Pitch prep',
  duration: '45 min',
  difficulty: 'Advanced',
  context: `Same long-only fund. The analyst has been working on PTC Inc. (PTC) for 6 weeks, a vertical SaaS name serving discrete manufacturing customers. Thesis: secular shift from on-prem MES (manufacturing execution systems) to cloud-native, PTC is the share gainer with the best customer references; pricing power is real (net retention 118%); margins expanding from 18% to mid-20s over 3 years. Risk: customer concentration (top 10 ~ 35% of revenue), valuation already at 9.5x NTM revenue (premium to comps avg ~7x). Recommended position size: 1.5% initial, 2.5% target on confirmation of Q4 print. PM meeting is Thursday, the 1-pager goes in the binder Wednesday EOD.`,
  personas: [
    { id: 'pm', name: 'Karthik Rangan', title: 'Portfolio Manager', firm: 'Quality-Growth LO Fund', style: 'Same.', voice: 'thesis-tester', initials: 'KR' },
  ],
  opening: [
    { personaId: 'pm', text: `Send me the PTC Inc. ($PTC) 1-pager for Thursday's meeting. Standard format. The thesis has to be on one page.` },
    { personaId: 'pm', text: `The thing I'm going to push on is the multiple. You have to defend why we pay up. Include your action proposal (size, entry plan) and what would kill the trade.` },
  ],
  artifacts: [
    {
      id: 'pitch-onepager',
      label: 'Pitch 1-Pager',
      format: 'docx',
      prompt: `Write a one-page pitch on PTC Inc. (PTC) for the PM meeting.
Required structure:
• HEADLINE + RECOMMENDATION (1 line): name, ticker, action (Initiate 1.5%, target 2.5%)
• THESIS (3 bullets, ~1 sentence each): the 3 reasons to own
• KEY METRICS BAR: market cap, NTM revenue, growth %, NTM rev multiple vs comps avg, NDR
• WHY NOW (2-3 sentences): catalyst path, sequence of events to fair value
• VALUATION DEFENSE (3 sentences): why paying 9.5x vs sector 7x makes sense, anchored to growth, margin trajectory, moat
• KEY RISKS (3 bullets): the most honest concerns, with how we'd monitor each
• THESIS KILLERS (2 bullets): specific things that would force exit
• SIZING + ENTRY PLAN (1-2 sentences)

One page. Active voice. Upload as .docx.`,
      rubric: `Grade as a quality-LO PM reviewing a 1-page pitch on a name with premium valuation. Score 1-10:

LEDE (1-10)
- Recommendation in sentence 1 with size?
- Common error: ticker + sector + market cap before the action.

THESIS BULLETS (1-10)
- 3 reasons that ARE the thesis, not features?
- "Cloud transition share gainer", "expanding margins from 18% to mid-20s", "best-in-class customer references with 118% NDR", substantive.
- Reject: "great management", "exciting market", vague.

METRICS DENSITY (1-10)
- Market cap, NTM revenue, growth, multiple vs comps, NDR, all present, anchored?

WHY NOW (1-10)
- Specific catalyst path (Q4 print → margin confirmation → re-rating)?
- Not "secular tailwinds", too vague.

VALUATION DEFENSE (1-10)
- This is the central question for a quality LO. Does the analyst defend the premium with growth, margin expansion, moat?
- "Trading at a premium but it's deserved" with no math = fail.
- Anchored math: "9.5x NTM rev for 28% growth + margin path = ~14% EBITDA-margin-adjusted growth-equivalent multiple, in line with quality SaaS at 6.5x trailing", credit for this kind of work.

RISKS HONESTY (1-10)
- Customer concentration (35% top 10) called out?
- 3 risks specific, with how we'd monitor each?

THESIS KILLERS (1-10)
- 2 specific kill conditions (e.g., "NDR drops below 110% for 2 consecutive quarters", "top customer leaves")?
- These are what PMs use to write the exit rule when they buy.

SIZING + ENTRY (1-10)
- Initial size (1.5%), target (2.5%), entry plan (tranche over X weeks or wait for Q4)?

End with verdict in Karthik's voice (under 80 words): "Put it in the binder, I'll back it Thursday.", "Tighten valuation defense.", or "Not ready, I'd rather see two more weeks of work." Cite the multiple defense and one risk specifically.`,
      requestedBy: 'pm',
    },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
// VENTURE CAPITAL
// ═════════════════════════════════════════════════════════════════════════════

const VC_1: Scenario = {
  id: 'vc-1',
  trackId: 'vc',
  title: 'Series A deck triage',
  summary: 'A founder deck landed at 9am. Partner wants a triage take by lunch. Memo or no.',
  timeframe: 'Triage day',
  duration: '40 min',
  difficulty: 'Intro',
  context: `Stage-focused Series A fund ($400M AUM, B2B software focus, 15-18 investments per fund, 6-8 per year). The partner sent over a brief on Lattice Robotics this morning, a warehouse robotics-as-a-service startup. Think of it as a much earlier-stage attempt at the category Symbotic ($SYM) operates in publicly, or AutoStore (Norway-listed) at scale. Co-founders are ex-Amazon Robotics (2 years out), seed round was $5M led by Initialized 18 months ago. Currently raising $18M Series A at $80M pre. ARR ~$2.4M (12 enterprise pilots converted to paid), growing ~25% MoM over last 3 months, gross margin 38% (hardware-heavy), burn $700K/month, 12 months runway. Three named customers in the briefing. Partner: "Give me a quick take by lunch. Are we taking the founder call?" All details you need are in this scenario; no actual deck file to open.`,
  personas: [
    { id: 'partner', name: 'Yusuf Bakir', title: 'Partner', firm: 'Lateral Ventures', style: 'Pattern-matches across hundreds of decks. Reads founder takes in 60 seconds. Cares about (a) is this category-creating or me-too, (b) is the team unfair, (c) what would make me regret passing in 5 years.', voice: 'pattern-fast', initials: 'YB' },
  ],
  opening: [
    { personaId: 'partner', text: `Brief on Lattice Robotics just landed. Everything we know is in the scenario above.` },
    { personaId: 'partner', text: `Series A, $18M at $80M pre. Warehouse RaaS, ex-Amazon team. $2.4M ARR growing 25% MoM.` },
    { personaId: 'partner', text: `By lunch I need a triage take. Half a page max. Your recommendation on whether we take the founder call, what you want to validate on the call. Be opinionated. I'd rather see a strong pass than a fence-sit.` },
  ],
  artifacts: [
    {
      id: 'triage-take',
      label: 'Triage Take',
      format: 'docx',
      prompt: `Write a half-page triage take on Lattice Robotics.
Required:
• RECOMMENDATION (1 line): take call / pass / take call with conditions
• WHAT WORKS (2-3 bullets): the strongest reasons to engage
• WHAT WORRIES YOU (2-3 bullets): the real reasons to pass, specific to RaaS / robotics / this team
• KEY DILIGENCE QUESTIONS (3-4 specific Qs you'd want on the call): pilot conversion, unit economics, hardware vs software margin trajectory, ARR vs MRR definition, etc.
• "WHY NOW" READ (1 line): is the category timing right?

Upload as .docx.`,
      rubric: `Grade as a VC partner reading a junior's triage take. Score 1-10:

RECOMMENDATION CLARITY (1-10)
- Take call / pass / call-with-conditions in line 1?
- Common error: "interesting but we should learn more", that's not a recommendation, that's a non-answer.

WHAT WORKS, SUBSTANCE (1-10)
- Strongest reasons specific to THIS deal (ex-Amazon team, real ARR with named enterprise customers, recurring revenue model in a category that's historically been one-off hardware)?
- Reject "great team" with no specificity.

WHAT WORRIES, HONESTY (1-10)
- Real worries specific to RaaS: 38% gross margin is too low for venture-scale, hardware capex drag, customer count low (12) means high concentration, founders are early in their post-Amazon arc?
- Reject generic ("market risk", "execution").

DILIGENCE QUESTIONS QUALITY (1-10)
- Questions that would actually expose the truth on a call:
  - "What's the path from 38% to 60%+ gross margins?"
  - "Walk us through the pilot-to-paid conversion, how many pilots didn't convert and why?"
  - "ARR vs MRR, are you counting hardware leases as recurring?"
- Generic "tell us about the team" wastes a call.

"WHY NOW" (1-10)
- Tied to specific market signals (labor cost inflation, e-comm fulfillment economics, Amazon Robotics talent diaspora)?
- Or hand-wavy ("AI is hot")?

WRITING DISCIPLINE (1-10)
- Half a page, opinionated, no fence-sitting?

End with verdict in Yusuf's voice (under 60 words): "Take the call.", "Pass, here's why.", or "I disagree with your read, push back." Cite the recommendation and one specific worry or question.`,
      requestedBy: 'partner',
    },
  ],
};

const VC_2: Scenario = {
  id: 'vc-2',
  trackId: 'vc',
  title: 'Investment memo defense',
  summary: 'Founder call went well. Write the partner-meeting memo and defend it Thursday.',
  timeframe: 'Pre-partner meeting',
  duration: '45 min',
  difficulty: 'Advanced',
  context: `Same fund. After Round 1's triage, the team took the Lattice call. Founder calls cleared the bar. The team has spent 3 weeks on diligence and the relevant outputs are summarized below (you don't need actual diligence files): 11 customer references (8 positive, 2 neutral, 1 critical), 2 former Amazon Robotics colleagues vouching for the founders, gross margin path validated through Q3 projection (38% → 52% by end of Year 2 once software-revenue mix kicks in), $1.8M of the $2.4M ARR is from contracted multi-year deals (so true recurring, not one-off pilots). The fund's recommendation: lead the Series A at $18M / $80M pre, 22.5% ownership, board seat. Partner meeting Thursday. Memo due Wednesday EOD. All information for your memo is in this scenario.`,
  personas: [
    { id: 'partner', name: 'Yusuf Bakir', title: 'Partner', firm: 'Lateral Ventures', style: 'Same as VC_1. In partner meetings, plays both sides, even when supportive he tests the case publicly.', voice: 'pattern-fast', initials: 'YB' },
    { id: 'gp', name: 'Helene Marchetti', title: 'General Partner', firm: 'Lateral Ventures', style: 'Quiet. Reads everything twice. Will sometimes say nothing all meeting and then ask one question that decides the vote. Cares about whether the writer ACTUALLY believes it.', voice: 'reads-twice', initials: 'HM' },
  ],
  opening: [
    { personaId: 'partner', text: `Memo for Lattice goes in the partner deck Wednesday EOD. Standard format. Recommendation up top, then thesis, market, team, business, financial profile, deal terms, risks, references.` },
    { personaId: 'partner', text: `The thing partner meeting will push on is 'what's the actual moat.' Be ready for it.` },
    { personaId: 'gp', text: `When you write the risks section: I want the risk you lose sleep over, not the consensus list. If everyone in the meeting says 'I knew that going in' when something goes wrong later, you didn't do the section right.` },
  ],
  artifacts: [
    {
      id: 'investment-memo',
      label: 'Series A Investment Memo',
      format: 'docx',
      prompt: `Write the Series A investment memo for Lattice Robotics. Required sections:
• RECOMMENDATION (top): lead the round, $18M at $80M pre, ~22.5% ownership, board seat, single line
• THESIS (4-5 sentences): the central argument for why this becomes a category leader
• MARKET (1-2 paragraphs): TAM and structure, what is the warehouse automation market actually worth, who plays in it, why is RaaS the right model now
• TEAM (1 paragraph): why this team can win
• BUSINESS (1-2 paragraphs): what they do, who they sell to, unit economics, gross margin path (38% → 52%), recurring revenue mix ($1.8M of $2.4M)
• FINANCIAL PROFILE (1 paragraph): ARR, growth rate, burn, runway, projected ARR at next round
• DEAL TERMS (bullets): round size, price, ownership, board, key terms (1x non-participating preferred, standard protective provisions, etc.)
• KEY RISKS (3-4 bullets): each with how we'd mitigate or monitor
• REFERENCE SUMMARY (1 paragraph): what we heard from 11 references, including the critical one

Upload as .docx.`,
      rubric: `Grade as a VC partner reviewing a Series A memo before partner meeting. Score 1-10:

RECOMMENDATION CLARITY (1-10)
- Lead, terms, ownership, board all in line 1?
- "Compelling opportunity" without the deal terms is fluff.

THESIS SHARPNESS (1-10)
- The "why this becomes the category leader" argument in 4-5 sentences?
- Anchored to specific advantages (team origin, customer logos, gross margin path)?
- Reject "winning company in a large market", too generic.

MARKET FRAMING (1-10)
- TAM stated with a credible build (not just McKinsey number)?
- Structure of the competitive landscape (incumbent point solutions vs RaaS)?

TEAM CASE (1-10)
- Specifics, what at Amazon Robotics did they own, what's the unfair advantage, what reference data backs it up?
- Not "experienced team."

BUSINESS DETAIL (1-10)
- Customer profile, ACV, sales cycle, gross margin path with the specific bridge (38% → 52%)?
- $1.8M / $2.4M recurring mix called out clearly?

FINANCIAL PROFILE (1-10)
- ARR ($2.4M), growth (25% MoM), burn ($700K), runway (12 months), projected ARR at next round?
- Path to Series B revenue threshold (~$10M ARR) in a believable timeframe?

DEAL TERMS (1-10)
- All standard terms cited: 1x non-participating preferred, board composition, protective provisions, pro rata rights, employee option pool post-close?

RISKS, REAL ONES (1-10)
- Specifically: customer concentration (12 logos), hardware-margin execution risk, founder bandwidth as they scale ops, robotics-talent retention?
- The "risk you lose sleep over", does the writer name something real, not consensus?

REFERENCE HONESTY (1-10)
- The critical reference acknowledged, what was said, why we still believe?
- A memo that buries critical references loses credibility.

WRITING (1-10)
- Memo style, direct, opinionated, no marketing prose?

End with verdict combining Yusuf and Helene's voices (under 100 words): "Bring it to partner meeting, I'll back it.", "Tighten [X] before Thursday.", or "Step back, the [X] isn't there." Cite the thesis line and one specific risk.`,
      requestedBy: 'partner',
    },
  ],
};

const VC_3: Scenario = {
  id: 'vc-3',
  trackId: 'vc',
  title: 'Market map, vertical AI sector dive',
  summary: 'Partner asks for a market map on legal-tech AI by Friday. You don\'t know the space yet.',
  timeframe: 'Diligence',
  duration: '40 min',
  difficulty: 'Intermediate',
  context: `Same fund. Partner returned from a dinner where two LPs were asking about the fund's exposure to vertical AI. Partner wants a clean map of the legal-tech AI landscape by Friday: who plays, what they do, where the white space is. Analyst doesn't have deep history in legal-tech but has 2 days. The deliverable is a structured map that lets the partner walk into the next dinner with a defensible view.`,
  personas: [
    { id: 'partner', name: 'Yusuf Bakir', title: 'Partner', firm: 'Lateral Ventures', style: 'Same.', voice: 'pattern-fast', initials: 'YB' },
  ],
  opening: [
    { personaId: 'partner', text: `By Friday I need a market map on legal-tech AI.` },
    { personaId: 'partner', text: `Structured. Segment the landscape. Name the players in each segment with a one-line description and rough stage and funding.` },
    { personaId: 'partner', text: `Identify 2-3 white space areas with a hypothesis on why no one has cracked them yet. End with what you'd be looking to fund. Half-page to one page, dense. Don't make me read a CB Insights report.` },
  ],
  artifacts: [
    {
      id: 'market-map',
      label: 'Legal-Tech AI Market Map',
      format: 'docx',
      prompt: `Build a market map on legal-tech AI.
Required structure:
• SEGMENT FRAMEWORK (3-5 segments): the cuts you're using to organize the space, e.g., "Pre-trial workflow," "Document review/discovery," "Contract lifecycle/CLM," "Litigation analytics," "Compliance/regulatory"
• Per segment: 3-5 named companies, each with a one-line description and rough stage (seed / Series A / Series B+ / public)
• WHITE SPACE (2-3 areas): where you'd want to fund, with a hypothesis on why no one has cracked it
• WHAT WE'D LOOK TO FUND (1 paragraph): the specific founder profile + product wedge you'd want to back next

Should fit on 1 page. Upload as .docx.`,
      rubric: `Grade as a VC partner reviewing an analyst's first market map. Score 1-10:

SEGMENTATION QUALITY (1-10)
- Are the 3-5 segments distinct, MECE-ish, and useful for thinking about competition?
- Common bad cut: "AI for lawyers" then "AI for in-house counsel", overlapping.
- Good cut: by workflow stage (pre-trial vs in-trial vs post-trial) or by buyer (firm vs in-house vs court).

PLAYER COVERAGE (1-10)
- Real companies in each segment, and recognizable ones at the top of each (Harvey, Casetext/Co-counsel, Ironclad, Spellbook, etc.)?
- Common error: filling each segment with seed-stage no-names while missing the Series B/C category leaders.

STAGE + FUNDING CONTEXT (1-10)
- Each named company tagged with rough stage so the partner sees concentration of capital?
- Helps identify "where the dollars already went" vs "where there's room."

WHITE SPACE HYPOTHESIS (1-10)
- 2-3 specific white space pockets, each with WHY no one has cracked them?
- "Hypothesis on regulatory friction in courts adopting AI", credible.
- "AI for niche practice areas without explaining why none have scaled", not credible.

FOUNDER + WEDGE THESIS (1-10)
- The "what we'd look to fund" paragraph names a specific profile (e.g., ex-BigLaw + ML, or domain-deep operator + GTM partner)?
- Tied to a specific product wedge?

DENSITY (1-10)
- Information density, does the analyst pack a lot into a small space?
- A 3-page version of this with 90% obvious content loses to a 1-page version with 70% non-obvious.

End with verdict in Yusuf's voice (under 70 words): "I can use this at the next dinner.", "Add [X] before Friday.", or "Restructure, segmentation is off." Cite one specific segment cut and one white space pocket.`,
      requestedBy: 'partner',
    },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
// REAL ESTATE
// ═════════════════════════════════════════════════════════════════════════════

const RE_1: Scenario = {
  id: 're-1',
  trackId: 're',
  title: 'Multifamily underwrite, new deal',
  summary: 'Rent roll and OM landed. Build the underwriting model and a one-page pre-read for IC.',
  timeframe: 'New deal',
  duration: '45 min',
  difficulty: 'Intermediate',
  context: `Value-add multifamily fund ($1.2B AUM, Sunbelt focus). Deal: Magnolia Pines, a 248-unit garden-style multifamily property in suburban Atlanta (Cobb County), built 2008. The asset sits in the same Sunbelt corridor where public multifamily REITs like Mid-America Apartment Communities ($MAA), Camden Property Trust ($CPT), and NexPoint Residential Trust ($NXRT) own significant portfolios, so their reported cap rates and rent comps are useful reference points. Seller's asking $58M ($233K/unit). Current avg rent $1,415/unit, occupancy 93.5%, T-12 NOI $2.78M. Comps for renovated units in submarket: $1,650-1,720. Sponsor's value-add plan: $14K/unit interior renovation budget over 24 months, push renovated rents to $1,650 ($235 premium), retain ~96% occupancy through reno. Submarket cap rates for 2008-vintage Class B in this area: 5.25-5.75% in-place, 5.50-6.00% on stabilized. Debt: agency loan 65% LTV at SOFR+185 fixed-rate equivalent ~6.35%, 30-year amort, 5-year IO then amortizing, 10-year term. 5-year hold target. All deal data points you need are in this scenario; you don't need to open a rent roll or OM file.`,
  personas: [
    { id: 'principal', name: 'Reese Tanaka', title: 'Principal, Acquisitions', firm: 'Cardinal Real Estate Partners', style: 'Spreadsheet-disciplined, will catch any math error in the rent roll or expense build. Cares about whether the deal makes sense BOTH in-place and post-stabilization.', voice: 'rent-roll-strict', initials: 'RT' },
  ],
  opening: [
    { personaId: 'principal', text: `Magnolia Pines is on our desk. 248-unit Class B in Cobb County, $58M ask, $233K per unit.` },
    { personaId: 'principal', text: `We're underwriting value-add. $14K per unit interior reno, push renovated rents to $1,650 (T-12 average is $1,415). 65% LTV agency at 6.35%, 5-year IO, 10-year term, 5-year hold. Renovate 50% of units in Y1 (10 units per month), 50% in Y2.` },
    { personaId: 'principal', text: `By EOD I need a Year 1 to Year 5 cash flow model and a one-page pre-read. Exit at 5.75% cap on Y5 stabilized NOI. Show levered and unlevered IRR, equity multiple, and Y5 NOI yield on cost.` },
  ],
  artifacts: [
    {
      id: 'underwriting-model',
      label: 'Underwriting Model',
      format: 'xlsx',
      prompt: `Build the underwriting model for Magnolia Pines in Excel.

Required sheets/sections (single workbook ok):
• INPUTS: purchase price ($58M), unit count (248), in-place rent ($1,415), renovated rent ($1,650), reno cost per unit ($14K), reno pace (10/month starting M1), in-place occupancy (93.5%), stabilized occupancy (95%), debt (65% LTV, 6.35%, 5-yr IO, 30-yr amort, 10-yr term)
• RENT ROLL ROLL-FORWARD: month-by-month or quarter-by-quarter showing # of units at in-place rent vs renovated rent
• OPERATING CF Y1-Y5: GPR, vacancy, EGR, OpEx (taxes, insurance, utilities, repairs/maint, payroll, mgmt fee 3% of EGR, replacements reserve $300/unit), NOI
• CAPEX SCHEDULE: $14K × 124 units Y1, $14K × 124 units Y2
• DEBT SERVICE: interest-only Y1-Y5
• LEVERED CF: NOI - capex - debt service
• EXIT: Y5 NOI / 5.75% cap = exit value, minus debt payoff, equity proceeds
• RETURNS: Levered IRR, equity multiple, unlevered IRR, Y5 NOI yield on cost (NOI / (purchase + capex))

Upload as .xlsx.`,
      rubric: `Grade as an RE acquisitions principal reviewing a value-add underwrite. Score 1-10:

INPUT INTEGRITY (1-10)
- Purchase price, units, rents, reno cost, debt terms all match brief?
- Inputs labeled and separated from formulas?

RENT ROLL ROLL-FORWARD (1-10)
- Does the model actually phase rents up as units are renovated (mid-month convention or stub period)?
- Common error: averaging rent jumps in Y1 (smoothing) instead of step-up as units are renovated.
- By end of Y2 all 248 units at renovated $1,650?

OPERATING EXPENSE BUILD (1-10)
- Real Cobb County Class B 2008-vintage operating ratios, total OpEx typically 38-44% of EGR?
- Taxes typically the largest single line; insurance trending up in Sunbelt?
- Management fee as % of EGR, not flat $?
- Replacement reserves modeled separately (typically $250-350/unit/year)?

NOI MATH (1-10)
- T-12 NOI from brief ($2.78M) sense-checks against the build?
- Y5 stabilized NOI computed: GPR (248 × $1,650 × 12 = $4.91M) × 95% occupancy × (1 - OpEx ratio)?
- Stabilized NOI should land roughly $3.2-3.5M (assuming ~38-42% OpEx ratio).

CAPEX SCHEDULE (1-10)
- $14K × 248 = $3.47M total capex, spread Y1-Y2?
- Common error: lumping all capex into one period.

DEBT SCHEDULE (1-10)
- Loan amount = 65% × $58M = $37.7M?
- Interest-only payments Y1-Y5 = $37.7M × 6.35%?
- Loan still outstanding at Y5 exit (not paid down, IO period)?

EXIT MATH (1-10)
- Y5 NOI / 5.75% cap = exit value?
- Net proceeds = exit value - cost of sale (~1.5%) - debt payoff?

RETURNS (1-10)
- Levered IRR computed from a 5-year cash flow stream (initial equity + interim distributions + exit equity)?
- Equity multiple (levered)?
- Unlevered IRR shown for comparison?
- Y5 yield on cost: stabilized NOI / (purchase $58M + capex $3.47M), typically 5.0-5.5% on a working value-add?
- Sanity range: levered IRR 14-18%, equity multiple 1.8-2.2x on a working deal.

FORMATTING (1-10)
- Year headers, units stated, formulas live?

End with verdict in Reese's voice (under 80 words): "Send the pre-read, I'll take it to IC.", "Fix [X] before pre-read.", or "Numbers don't tie, start over." Cite specific cells/years where issues are, AND state what IRR + multiple the analyst arrived at.`,
      requestedBy: 'principal',
    },
    {
      id: 'ic-preread',
      label: 'IC Pre-Read (1 page)',
      format: 'docx',
      prompt: `Write the 1-page IC pre-read for Magnolia Pines.
Required:
• DEAL SUMMARY (1 line): asset, size, price, business plan
• RETURNS HEADLINE (1 line): levered IRR, equity multiple, hold
• BUSINESS PLAN (3 bullets): the value-add levers and timing
• KEY ASSUMPTIONS (3-4 bullets): rent growth premium, reno pace, exit cap, occupancy
• KEY RISKS (3 bullets): submarket-specific, deal-specific, capital-markets
• ASKS (1-2 bullets): IC approval to bid at $X, or to advance to LOI

One page. Upload as .docx.`,
      rubric: `Grade as an RE acquisitions principal reviewing a 1-page IC pre-read. Score 1-10:

LEDE (1-10)
- Deal summary + returns headline in first 2 lines?
- Common error: 3 paragraphs of submarket context before the asset.

RETURNS FRAMING (1-10)
- Specific numbers (levered IRR %, equity multiple, hold period)?
- Tied to "does this clear our fund hurdle"?

BUSINESS PLAN (1-10)
- Specific value-add levers: interior reno scope, rent premium achieved, occupancy through reno?
- Reject vague "improve operations", needs the actual plan.

KEY ASSUMPTIONS (1-10)
- The 3-4 most important assumptions called out (rent premium $235, reno pace, exit cap 5.75%, stabilized occupancy 95%)?
- These are what IC will challenge, better to surface than bury.

RISKS, SUBMARKET (1-10)
- A real Cobb County / Atlanta-specific risk (e.g., supply pipeline in the submarket, Class B vs new construction competition)?

RISKS, DEAL (1-10)
- A deal-specific risk (e.g., reno cost overrun risk on 2008 vintage HVAC/plumbing, Y1 vacancy through reno)?

RISKS, CAPITAL MARKETS (1-10)
- Cap rate compression/expansion sensitivity? Refi risk on the IO loan? Rate environment at exit?

ASK CLARITY (1-10)
- A specific ask, "approve LOI at $58M" or "approve final bid at $57M", not "thoughts welcome"?

WRITING (1-10)
- One page, banker-style, no filler?

End with verdict in Reese's voice (under 70 words): "Take it to IC.", "Tighten [X].", or "Step back, this isn't IC-ready." Cite the headline number and one risk specifically.`,
      requestedBy: 'principal',
    },
  ],
};

const RE_2: Scenario = {
  id: 're-2',
  trackId: 're',
  title: 'IC defense, cap rate and rent growth pushback',
  summary: 'IC challenges your 5.75% exit cap and your $235 rent premium. Rewrite the memo section.',
  timeframe: 'IC day',
  duration: '40 min',
  difficulty: 'Advanced',
  context: `Same fund. Magnolia Pines went to IC. Two partners pushed back hard: (1) your 5.75% exit cap is too tight, recent comp transactions in Cobb County have been printing 6.00-6.25% as rates have moved; (2) your $235 rent premium is aggressive, comps you cited are 2-3 quarters old and the market has seen new supply deliveries that pressured asking rents in renovated units. IC didn't kill the deal but said "rewrite the assumptions section and re-run the returns with sensitivity, then re-circulate." You have 35 minutes. The original deal returns were levered IRR ~17%, multiple ~2.0x. Need to defend or revise.`,
  personas: [
    { id: 'principal', name: 'Reese Tanaka', title: 'Principal, Acquisitions', firm: 'Cardinal Real Estate Partners', style: 'Same.', voice: 'rent-roll-strict', initials: 'RT' },
    { id: 'mp', name: 'Aaron Mitchell', title: 'Managing Partner', firm: 'Cardinal Real Estate Partners', style: 'Cap-rate hawk. Believes the biggest deal-loser is exit assumption inflation. Will ask "what does this look like at a 6.25% cap" before any other question.', voice: 'cap-rate-hawk', initials: 'AM' },
  ],
  opening: [
    { personaId: 'mp', text: `Two issues with the Magnolia Pines underwrite. One, your 5.75% exit cap is light given where Cobb County has been trading. Recent printed comps are closer to 6.00 to 6.25%.` },
    { personaId: 'mp', text: `Two, the $235 rent premium relies on comps that are 2 to 3 quarters stale.` },
    { personaId: 'mp', text: `Re-run the returns. Base, base-at-6.0%-cap, downside-at-6.25%-cap-with-$200-premium. Rewrite the assumptions section of the memo defending whatever assumption you keep, and being honest about where you've conceded. 35 minutes.` },
    { personaId: 'principal', text: `Don't just lower the assumptions to make the numbers worse. Defend the ones you believe. If you think 5.75% is right, say why. If you concede on rent premium, say what you'd do operationally to recover it.` },
  ],
  artifacts: [
    {
      id: 'assumptions-defense',
      label: 'Assumptions Defense Memo',
      format: 'docx',
      prompt: `Rewrite the assumptions section of the Magnolia Pines IC memo and add a sensitivity table.

Required sections:
• REVISED RETURNS TABLE: Base case (your original), Base-at-6.0% cap, Downside (6.25% cap + $200 premium), show levered IRR and equity multiple for each
• EXIT CAP DEFENSE: Where you land (5.75% or revised), with specific justification. Reference: spread to in-place going-in cap, recent comp transactions, age/quality positioning, fund's view of rate trajectory
• RENT PREMIUM DEFENSE: Where you land ($235 or revised), with: rent comp source, freshness, supply pipeline in submarket, operational plan to defend the premium
• CONCESSIONS (if any): what assumptions you've moved and why
• REVISED RECOMMENDATION: bid at original price / lower bid by $X / pass

Half a page, dense. Upload as .docx.`,
      rubric: `Grade as a Managing Partner of a value-add multifamily fund reviewing a re-defended underwrite. Score 1-10:

RETURNS TABLE (1-10)
- Three scenarios shown? Base, sensitivity, downside?
- Numbers internally consistent? Base IRR matches the prior memo (~17%), 6.0% cap takes IRR down to ~14-15%, downside likely 10-12%?

EXIT CAP DEFENSE QUALITY (1-10)
- Is the analyst making a real argument or just lowering the assumption?
- Good defense: "We hold 5.75% based on spread to going-in (currently 5.50-5.65% going-in cap), 17-year asset (no obsolescence discount needed), and renovated-product premium vs unrenovated comps. Risk of cap rate expansion captured in the 6.0% sensitivity."
- Bad: "5.75% is reasonable" with no anchor.
- If conceding to 6.0%: explain WHY conceding and what operational lever offsets.

RENT PREMIUM DEFENSE (1-10)
- Comp freshness acknowledged?
- If holding the $235: cite specific recent comps (within 90 days), explain why you're not seeing the supply-pressure that worried IC?
- If conceding to $200: state the operational play to recover the difference (e.g., faster reno pace, amenity add)?

INTELLECTUAL HONESTY (1-10)
- Does the analyst acknowledge where IC's pushback is right, vs where they're holding?
- Reject defensive ego, IC respects "you're right, here's where I'm conceding."

CAPITAL MARKETS SOPHISTICATION (1-10)
- Does the analyst connect the cap rate question to the bigger context (where rates are, where multifamily transactions have been clearing recently)?
- A purely deal-level defense without macro framing scores lower.

REVISED RECOMMENDATION (1-10)
- Specific: hold the bid, lower by $X, or pass?
- Tied to the returns in the new sensitivity table?

WRITING (1-10)
- Half-page, dense, direct?
- No marketing prose?

End with verdict combining Aaron's and Reese's voices (under 100 words). One of: "Re-approved, proceed with revised bid.", "I'm comfortable but want one more look at [X].", or "Still not there, kill the deal." Cite the new IRR, where the analyst conceded, and where they held.`,
      requestedBy: 'mp',
    },
  ],
};

const RE_3: Scenario = {
  id: 're-3',
  trackId: 're',
  title: 'Submarket comps, Phoenix multifamily dive',
  summary: 'Senior wants comps for a Phoenix submarket. Build the trade-by-trade comp set with picks and rejections.',
  timeframe: 'Diligence',
  duration: '35 min',
  difficulty: 'Intro',
  context: `Same fund. Considering a new acquisition in West Phoenix / Glendale submarket. This is core territory for the public Sunbelt multifamily REITs (Mid-America Apartment Communities $MAA, Camden Property Trust $CPT, NexPoint Residential $NXRT), so their published submarket commentary and recent Phoenix-area transactions are the right reference universe. Senior wants a comp set of the last 12 months of transactions in Class B 1990s-2000s vintage multifamily within a 5-mile radius. Universe of identified transactions (all 14 provided in this scenario, no subscription database needed): 14 trades in the past 12 months ranging from 96-unit to 312-unit, $145K-$245K/unit, cap rates 4.85-5.95%. Senior wants the cleaned comp set (8-10 best comps), the criteria used for inclusion/exclusion, and the implied cap rate range for our target.`,
  personas: [
    { id: 'sr', name: 'Devon Wright', title: 'Senior Associate, Acquisitions', firm: 'Cardinal Real Estate Partners', style: 'Direct, will challenge any comp inclusion that doesn\'t match the deal box.', voice: 'comp-strict', initials: 'DW' },
  ],
  opening: [
    { personaId: 'sr', text: `Build me a comp set for the West Phoenix and Glendale deal. 14 trades in the universe. Pick the 8 to 10 that are actually comparable to our target (assume 1998-vintage Class B, 220 units, garden-style).` },
    { personaId: 'sr', text: `For each comp show: property, sale date, sale price, $/unit, cap rate, year built, unit count, vintage class. Then summarize implied cap range and $/unit range.` },
    { personaId: 'sr', text: `At the bottom: which 4 to 6 you rejected and why. Don't pad it.` },
  ],
  artifacts: [
    {
      id: 'comp-sheet',
      label: 'Phoenix Submarket Comp Sheet',
      format: 'xlsx',
      prompt: `Build a multifamily comp sheet for the West Phoenix / Glendale submarket.

Layout:
• INCLUDED COMPS table (8-10 rows): property name, address/submarket, sale date, units, year built, sale price, $/unit, cap rate, # bedrooms mix
• SUMMARY STATS at bottom of included table: mean and median for $/unit and cap rate, range
• EXCLUDED COMPS table (4-6 rows): same columns + REJECTION REASON column

Assume the 14-transaction universe is given to you. Make reasonable assumptions about which are likely outliers (e.g., a 2015-vintage Class A property at 4.85% cap should be excluded). Include 1-2 trades that are arguably close calls and explain the decision.

Upload as .xlsx.`,
      rubric: `Grade as an RE Senior Associate reviewing a junior's comp set. Score 1-10:

INCLUSION CRITERIA (1-10)
- 8-10 comps that match the box (1990s-2000s vintage, Class B, garden-style, similar unit count)?
- Outliers (Class A new construction, urban high-rise, small <100-unit deals) excluded?

EXCLUSION RATIONALE (1-10)
- Rejection reasons specific and tied to the deal profile?
- Examples of good reasons: "2017 vintage Class A, too new", "urban high-rise mid-rise product, different operating profile", "<100 units, institutional pricing different from sub-institutional"
- Reject generic: "doesn't fit."

SUMMARY STATS (1-10)
- Mean, median for $/unit and cap rate?
- Range stated?

CAP RATE RANGE PLAUSIBILITY (1-10)
- Implied cap range for the target (1998 Class B 220-unit West Phoenix), likely 5.40-5.85% based on the included comp set?
- Tight if 3 comps; reasonable if 8-10 comps from last 12 months.

$/UNIT RANGE PLAUSIBILITY (1-10)
- $/unit range for the target, likely $165-205K based on Phoenix Class B 1990s vintage?
- Comp set should produce this range cleanly.

CLOSE-CALL JUDGMENT (1-10)
- Did the analyst flag 1-2 close calls (e.g., a 1985 vintage that's borderline B/C, or a renovated comp where the post-reno comparison is different)?
- Demonstrates judgment, not just rule-following.

FORMATTING (1-10)
- Numbers right-aligned, dates consistent, columns clean?

End with verdict in Devon's voice (under 60 words): "Use this in the underwrite.", "Replace [X] with [Y] and ship.", or "Re-think, your box is wrong." Cite 1-2 specific comps by inclusion/exclusion.`,
      requestedBy: 'sr',
    },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
// EQUITY RESEARCH
// ═════════════════════════════════════════════════════════════════════════════

const ER_1: Scenario = {
  id: 'er-1',
  trackId: 'er',
  title: 'Earnings day, note before open',
  summary: 'Name you cover printed AH. Update the model and write a 300-word client note before pre-market.',
  timeframe: 'Pre-market',
  duration: '45 min',
  difficulty: 'Intermediate',
  context: `Sellside equity research at a bulge bracket. Coverage: large-cap industrials. Just printed AH: Illinois Tool Works (ITW), a diversified industrial manufacturer. Reported revenue $4.85B vs consensus $4.72B (+2.8% beat), adj EBITDA $782M vs $755M expected, adj EPS $2.18 vs $2.09 expected. Segment detail: Aerospace +18% organic growth (vs +14% expected, strong), Industrial Automation +4% (vs +6% expected, weak), Power Solutions +9% (vs +8%, in line). Margin expansion driven by mix (Aerospace pulling up). Guidance raised: FY revenue +6-8% YoY (prior +5-7%), adj EPS $9.20-9.40 (prior $8.95-9.15). Stock indicated +4% in pre-market. Analyst rating is Outperform, $148 price target. Senior wants the client note + updated model by 7:30am.`,
  personas: [
    { id: 'sr-analyst', name: 'Carmen Holloway', title: 'Senior Equity Research Analyst', firm: 'Bulge Bracket Research', style: 'Demanding on accuracy. Cares about whether the note has a CALL to action, what should clients DO with this?', voice: 'call-to-action', initials: 'CH' },
  ],
  opening: [
    { personaId: 'sr-analyst', text: `Illinois Tool Works ($ITW) printed AH. Diversified industrial conglomerate, our coverage list. Current rating Outperform, $148 PT.` },
    { personaId: 'sr-analyst', text: `Headline: strong beat. $4.85B revenue (vs $4.72B consensus, +2.8%), adj EBITDA $782M (beat), adj EPS $2.18 (vs $2.09). Segment color: Aerospace was the hero (+18% vs +14% expected), Industrial Automation missed (+4% vs +6%), Power Solutions in line (+9%). Guide raised: FY revenue +6-8% (prior +5-7%), adj EPS $9.20-9.40 (prior $8.95-9.15). Stock indicated +4% pre-market.` },
    { personaId: 'sr-analyst', text: `By 7:30am I need two things. One, build the earnings model in Excel from scratch (no starter file). Quarterly view with segment detail, FY rolled to new guide, FY+1 adjusted, new PT calculated. Use the numbers above and reasonable estimates for prior quarters.` },
    { personaId: 'sr-analyst', text: `Two, a 300-word client note. Call to action, key takes, what changed vs. prior view, PT update. Don't recap the press release.` },
  ],
  artifacts: [
    {
      id: 'earnings-model',
      label: 'Earnings Update Model',
      format: 'xlsx',
      prompt: `Build the Illinois Tool Works (ITW) earnings model from scratch in Excel. No starter file.

Required structure:
• Quarterly columns: Q1, Q2, Q3 (just printed), Q4E, FY total, then FY+1
• Segment rows: Aerospace, Industrial Automation, Power Solutions, Total
• For each segment, row for revenue and Y/Y growth %
• Below segment block: total revenue, adj EBITDA, adj EPS
• Variance vs consensus AND vs your prior estimate shown in delta columns

Q3 actuals to use:
• Total revenue $4.85B, adj EBITDA $782M, adj EPS $2.18
• Segment growth: Aerospace +18% Y/Y, Industrial Automation +4%, Power Solutions +9%

FY rolls to new guide:
• FY revenue +7% YoY midpoint
• FY adj EPS $9.30 midpoint
• Q4E = FY guide minus YTD (sense-check it)

FY+1 outer year:
• Aerospace 14-16% growth (was 12% prior)
• Industrial Automation 5% (was 7% prior, softer near-term)
• Power Solutions steady at +8%

Price target section:
• Target multiple × FY+1 EPS = new PT
• Old PT $148, new PT, % change
• Sensitivity table: PT at 15x, 16x, 17x FY+1 EPS

For prior quarters, estimate reasonably from the run rate. This is a craft exercise - grading is on structure and logic, not the precise prior-period numbers. Upload as .xlsx.`,
      rubric: `Grade as a senior ER analyst reviewing an associate's post-print model update. Score 1-10:

ACTUALS CAPTURED (1-10)
- Revenue $4.85B, EBITDA $782M, EPS $2.18 all in?
- Variances vs consensus AND vs prior estimate shown?

SEGMENT BUILD (1-10)
- Three segments shown separately with Y/Y growth?
- Aerospace +18%, Industrial Automation +4%, Power Solutions +9% captured?

GUIDE REFLECTION (1-10)
- FY revenue rolled to +7% midpoint?
- FY EPS rolled to $9.30 midpoint?
- Q4 implied from full-year guide minus YTD = sense-checked?

OUTER YEAR LOGIC (1-10)
- FY+1 segment growth adjusted to reflect Aerospace strength + IA softness, not just bumped uniformly?
- The key debate is whether Aerospace can sustain +14-16% growth or decelerates, analyst should make a defensible choice.

PRICE TARGET MATH (1-10)
- Target multiple × FY+1 EPS = PT?
- Old PT $148 → new PT (typically $158-165 with EPS raise + slight multiple expansion possible)?
- % change shown?

SENSITIVITY (1-10)
- PT sensitivity at 15x, 16x, 17x FY+1 EPS?
- Shows the range of plausible outcomes?

FORMATTING (1-10)
- Quarterly + annual, deltas highlighted?
- Inputs labeled, formulas live?

End with verdict in Carmen's voice (under 60 words): "Send the note off the model.", "Fix [X] before the note goes out.", or "Re-think, your outer year is wrong." Cite the new PT and one segment assumption.`,
      requestedBy: 'sr-analyst',
    },
    {
      id: 'client-note',
      label: 'Pre-Market Client Note',
      format: 'docx',
      prompt: `Write a 300-word client note on Illinois Tool Works's Q3 print.
Required structure:
• HEADLINE (1 line, bold): the action call (Reiterate Outperform / Raise PT / etc.) + 1-line read
• KEY TAKES (3 bullets): what mattered in the print (Aerospace strength, IA softness, guide raise)
• WHAT CHANGED vs PRIOR VIEW (2-3 sentences): mix matters more than headline beat; outer year EPS revised up by $X
• REVISED PRICE TARGET (1 sentence): old PT, new PT, multiple/methodology
• KEY DEBATES (2-3 sentences): what bears will push on (IA durability, Aerospace sustainability of growth)
• ACTION (1 line): what clients should do

300 words. No press release recap. Upload as .docx.`,
      rubric: `Grade as a senior ER analyst reviewing a 300-word pre-market client note. Score 1-10:

HEADLINE / CALL TO ACTION (1-10)
- Reiterate Outperform / Buy / Raise PT to $X in line 1?
- A note without a call is wasted research.

KEY TAKES (1-10)
- 3 specific takes that don't recap the press release?
- Aerospace beat WAS the story, make sure it's #1?
- IA miss called out honestly (not buried)?

WHAT CHANGED (1-10)
- Does the analyst say what changed in THEIR view, not what the company said?
- "Mix matters more than we expected, Aerospace's pull-up on margin is now structural, not transient", credible.
- Reject: "results were strong", that's the headline, not analysis.

PT MATH (1-10)
- Old PT, new PT, the multiple driving it shown?
- Methodology consistent with how you've been doing it (PE on FY+1 EPS)?

KEY DEBATES (1-10)
- Bear push-back named: IA durability, Aerospace cyclicality, multiple sustainability?
- Without this, the note feels like advocacy.

ACTION LINE (1-10)
- "Use any near-term consolidation to add" or "trim into the strength", a concrete action?

LENGTH + STYLE (1-10)
- ~300 words?
- Banker-research prose: punchy, numbers anchored, active voice?
- No "as we discussed in our prior note" filler?

End with verdict in Carmen's voice (under 60 words): "Send to sales for pre-open distribution.", "Tighten [X] and resend.", or "Rewrite, call to action is unclear." Cite the headline and one key take.`,
      requestedBy: 'sr-analyst',
    },
  ],
};

const ER_2: Scenario = {
  id: 'er-2',
  trackId: 'er',
  title: 'Buy-side call, tough questions',
  summary: 'Big buy-side PM wants 30 min to push on guidance and competitive dynamics. Write the prep doc.',
  timeframe: 'Post-print',
  duration: '30 min',
  difficulty: 'Advanced',
  context: `Same coverage, day after the Illinois Tool Works print. A top-3 client account, a $40B AUM long-only fund, wants 30 minutes with the analyst this afternoon. The PM is known for asking the hardest questions about Aerospace's growth durability and whether Industrial Automation's softness is cyclical or structural. The senior wants a prep doc: anticipated questions, the analyst's answers, the "I don't know" moments, and the firm's house view talking points.`,
  personas: [
    { id: 'sr-analyst', name: 'Carmen Holloway', title: 'Senior Equity Research Analyst', firm: 'Bulge Bracket Research', style: 'Same.', voice: 'call-to-action', initials: 'CH' },
  ],
  opening: [
    { personaId: 'sr-analyst', text: `Hartford Capital wants 30 min this afternoon. Their PM is going to push hard on two things.` },
    { personaId: 'sr-analyst', text: `One: Aerospace growth durability, is 14 to 16% sustainable through 2026. Two: is IA softness cyclical or share loss to MakerEdge and Schneider.` },
    { personaId: 'sr-analyst', text: `Write me a prep doc. 5 to 7 anticipated questions, your best answer to each, where you'd say 'I don't know' honestly, and our house talking points. Don't bullshit. Hartford has been holding ITW for 6 years, they know it better than half our coverage team.` },
  ],
  artifacts: [
    {
      id: 'call-prep-doc',
      label: 'Buy-Side Call Prep Doc',
      format: 'docx',
      prompt: `Write the buy-side call prep doc.
Required:
• Q1: Aerospace durability, anticipated question (1 line), best answer (3-4 sentences, anchored to specific data: defense backlog, commercial OE recovery, MRO mix), confidence level
• Q2: IA softness, anticipated question, best answer (cyclical vs structural debate, your view, what data would prove you wrong)
• Q3: Margin sustainability, at FY mix shift toward Aerospace, what's the margin trajectory?
• Q4: Capital allocation, buyback pace, M&A appetite, dividend trajectory
• Q5: Outer year FY+2 EPS, bull / base / bear estimates with the assumption that swings each
• 1-2 honest "I don't know" topics, things you'd flag as uncertain
• HOUSE TALKING POINTS (3 bullets): the firm's broader view on the industrial cycle

Upload as .docx.`,
      rubric: `Grade as a senior ER analyst reviewing a prep doc for a sophisticated buy-side call. Score 1-10:

QUESTION QUALITY (1-10)
- Anticipated questions actually hard ones (Aerospace durability, IA structural vs cyclical, margin sustainability), not soft ones?

ANSWER SPECIFICITY (1-10)
- Each answer anchored to a real number, data point, or backlog figure?
- Vague answers ("we think growth will be strong") fail.
- Specific answers ("Aerospace book-to-bill at 1.42x suggests 2 years of revenue visibility, supporting 14-16% growth through 2026") pass.

INTELLECTUAL HONESTY (1-10)
- Does the analyst name 1-2 things they DON'T KNOW?
- Without honesty, the buy-side PM treats the rest of the call as advocacy.

CYCLICAL vs STRUCTURAL (1-10)
- The IA question is the hardest one. Does the analyst stake a view with the data that would falsify it?
- Bonus: names competitors (MakerEdge, Schneider) and what share data would tell us.

CAPITAL ALLOCATION (1-10)
- Real answer to buyback pace, M&A appetite, dividend trajectory?
- A buy-side PM holding for 6 years cares about this more than the quarterly print.

OUTER YEAR FRAMING (1-10)
- Bull / base / bear FY+2 EPS with the swing factor?
- This is what the PM uses to size the position.

HOUSE TALKING POINTS (1-10)
- Cross-coverage view of industrial cycle, anchored to firm's broader research?

End with verdict in Carmen's voice (under 70 words): "You're ready, take the call.", "Reinforce [X] before the call.", or "I'll lead the call, you observe." Cite one specific answer that's strong and one that needs work.`,
      requestedBy: 'sr-analyst',
    },
  ],
};

const ER_3: Scenario = {
  id: 'er-3',
  trackId: 'er',
  title: 'Rating decision, does the print change the call',
  summary: 'Sit with the senior to decide if today\'s print moves the rating. Write the rating memo.',
  timeframe: 'Mid-day',
  duration: '35 min',
  difficulty: 'Intermediate',
  context: `Same coverage. It's now 11am the day after the print. Stock is up 6.5% (vs +4% pre-market, gathered momentum after the morning's positive note distribution). Buy-side feedback during the morning has been positive on Aerospace, mixed on IA. Current rating Outperform, prior PT $148, new PT $162 (post-print). Stock is now at $156. Senior wants a rating memo: do we stay Outperform or upgrade to Buy (top pick), or do we trim to Market Perform given the rapid stock move shrinks the upside to PT? Memo goes to the research director for sign-off this afternoon.`,
  personas: [
    { id: 'sr-analyst', name: 'Carmen Holloway', title: 'Senior Equity Research Analyst', firm: 'Bulge Bracket Research', style: 'Same.', voice: 'call-to-action', initials: 'CH' },
  ],
  opening: [
    { personaId: 'sr-analyst', text: `Stock is at $156, up 6.5% on the day. PT is $162. Implied upside is now ~4%.` },
    { personaId: 'sr-analyst', text: `Three options. Stay Outperform with thin upside. Upgrade to Buy because conviction is higher post-print. Trim to Market Perform because the multiple has re-rated.` },
    { personaId: 'sr-analyst', text: `Write me a rating memo. Take a position. The research director will sign off this afternoon.` },
  ],
  artifacts: [
    {
      id: 'rating-memo',
      label: 'Rating Decision Memo',
      format: 'docx',
      prompt: `Write the rating decision memo on Illinois Tool Works.
Required structure:
• RECOMMENDATION (1 line): Stay Outperform / Upgrade to Buy / Downgrade to Market Perform, pick one and own it
• UPSIDE MATH (1-2 lines): current price $156, new PT $162, implied upside 4%, total return potential including dividend
• CASE FOR EACH OF THE 3 OPTIONS (1 paragraph each):
  - Stay Outperform: thesis intact, conservative call, multiple has run but fundamentals support continued holding
  - Upgrade to Buy: post-print conviction is materially higher, Aerospace durability now de-risked, PT could see further upside
  - Downgrade to Market Perform: stock has re-rated, multiple now stretched, near-term upside thin
• YOUR DECISION RATIONALE (3-4 sentences): why your pick beats the alternatives
• WHAT WOULD CHANGE YOUR VIEW: specific events (negative datapoint, multiple compression, peer print)

Upload as .docx.`,
      rubric: `Grade as a senior ER analyst reviewing an associate's rating decision memo. Score 1-10:

POSITION TAKEN (1-10)
- A specific recommendation in line 1?
- Common error: hedging language ("could be argued for any of three"), that's not a recommendation.

UPSIDE MATH (1-10)
- Implied upside to PT computed correctly?
- Total return including dividend stated?
- For an Outperform rating: typically 8%+ upside required at most banks, does the analyst acknowledge the threshold issue?

THREE-CASE FRAMING (1-10)
- Each of the three options laid out fairly?
- Including the option the analyst is rejecting?
- Strong analysts argue ALL three before picking, shows the work.

DECISION RATIONALE (1-10)
- Why your pick beats the alternatives, specifically?
- Anchored to: thesis conviction, multiple sustainability, risk/reward, time horizon?

DISCIPLINE OF "WHAT CHANGES YOUR VIEW" (1-10)
- Specific tripwires (e.g., "if FY+1 EPS consensus moves above our number, multiple compression risk increases; if Aerospace orders decel below +12% Y/Y, we'd revisit")?
- Without tripwires, the call has no rigor.

PROFESSIONAL CONFIDENCE (1-10)
- Does the analyst sound like they believe the call, or hedge it?
- "We believe X" vs "It seems possible that X."

End with verdict in Carmen's voice (under 70 words): "I agree, sending to research director.", "I disagree, push back on [X].", or "Rewrite, your decision logic isn't clean." Cite the recommendation and one piece of reasoning.`,
      requestedBy: 'sr-analyst',
    },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
// ACCOUNTING & AUDIT
// ═════════════════════════════════════════════════════════════════════════════

const AU_1: Scenario = {
  id: 'audit-1',
  trackId: 'audit',
  title: 'Control testing, Q3 audit',
  summary: 'Senior assigns a revenue recognition control. Document the workpaper, pull samples, set the testing approach.',
  timeframe: 'Field work',
  duration: '40 min',
  difficulty: 'Intermediate',
  context: `Big Four audit. Client: SignalView Networks, a software company with $480M annual revenue, FY-end calendar. Q3 review and interim audit work. Revenue stream under test: subscription revenue recognized ratably over the contract term per ASC 606. Control under test: Control RR-04, "All new subscription contracts are reviewed by Revenue Operations Manager within 5 business days of execution; contract pricing and term are entered into the billing system; revenue recognition schedule is system-generated based on contract start/end dates and total contract value." Senior assigns: test design effectiveness AND operating effectiveness for Q1-Q3 (population: ~840 new contracts in the period). Junior associate's task: document the workpaper including process narrative, control attributes, sample selection rationale, testing approach.`,
  personas: [
    { id: 'senior', name: 'Priya Mehta', title: 'Audit Senior', firm: 'Big Four Audit', style: 'Methodical, will catch any sample selection rationale that\'s sloppy. Cares about whether the workpaper would stand up to PCAOB review.', voice: 'methodical', initials: 'PM' },
    { id: 'mgr', name: 'James Hartwell', title: 'Audit Manager', firm: 'Big Four Audit', style: 'Reviews everything, comments on everything. Believes if the workpaper isn\'t self-explanatory, it\'s not done.', voice: 'review-heavy', initials: 'JH' },
  ],
  opening: [
    { personaId: 'senior', text: `RR-04 control testing for SignalView. Population is ~840 new subscription contracts Q1-Q3. Test design effectiveness and operating effectiveness.` },
    { personaId: 'senior', text: `Document the workpaper end-to-end. Process narrative, control attributes (what we're actually testing per execution), sample selection rationale (size and method), testing approach for each attribute, and how we'll document results.` },
    { personaId: 'senior', text: `James is reviewing this. He'll comment on everything if it's not self-contained.` },
    { personaId: 'mgr', text: `When you write the sample size justification: I want the reasoning, not just the number. If you say '60 samples' because that's what the methodology guide says for a population this size, that's fine. But state why 60 and not 30 or 90. If you're going to use any inquiry-only sampling (judgmental selection), tell me why.` },
  ],
  artifacts: [
    {
      id: 'control-workpaper',
      label: 'Control Testing Workpaper',
      format: 'docx',
      prompt: `Document the workpaper for testing Control RR-04 at SignalView Networks.

Required sections:
• HEADER: Client, period, control ID + description, control owner (Rev Ops Manager), risk addressed (revenue completeness/accuracy/timing)
• PROCESS NARRATIVE (1 paragraph): the end-to-end flow of a new subscription contract from execution through revenue recognition
• CONTROL ATTRIBUTES TO TEST (numbered list): what we'll test for EACH sample, e.g., (1) review evidenced within 5 business days, (2) contract terms in billing system match executed contract, (3) revenue recognition schedule mathematically correct
• SAMPLE SIZE + RATIONALE: sample count, methodology (statistical / monetary unit / haphazard / random), why this size for a population of 840, period coverage
• SAMPLE SELECTION METHOD: how samples will be selected (random number generator? stratified by month? high-value bias?)
• TESTING APPROACH: what we look at (executed contract PDF, billing system screenshots, revenue rec schedule export, control owner sign-off email/system log), what evidence ties off each attribute
• EXCEPTION HANDLING: how exceptions are documented and escalated; threshold for control failure

Upload as .docx.`,
      rubric: `Grade as a Big Four audit manager reviewing a control testing workpaper for PCAOB-quality documentation. Score 1-10:

HEADER COMPLETENESS (1-10)
- Client, period, control ID, control owner, risk addressed all present?
- Common error: missing the risk addressed (financial statement assertion the control supports).

PROCESS NARRATIVE (1-10)
- End-to-end flow described in enough detail that a future reviewer who has never been on this engagement can understand?
- Names the systems involved (CRM → contract execution → billing system → revenue subledger → GL)?

CONTROL ATTRIBUTES (1-10)
- Each attribute is testable and aligns with the control's stated objective?
- Common error: testing the existence of the contract but not the timing of review (which is the actual control objective)?

SAMPLE SIZE + RATIONALE (1-10)
- Sample size stated (typically 25-60 for a population of 840 depending on frequency and risk)?
- Rationale ties to a methodology framework (AICPA, firm guidance), not just "feels right"?
- Period coverage: full Q1-Q3, not concentrated in one quarter?

SAMPLE SELECTION METHOD (1-10)
- Random or stratified selection method specified?
- If using judgmental/haphazard: explicitly justified?

TESTING APPROACH (1-10)
- Evidence to be obtained named specifically (contract PDF, billing screenshot, revenue rec export, control owner attestation)?
- Tie-out steps clear (e.g., "compare contract value in CRM to billing system, recompute monthly amortization")?

EXCEPTION HANDLING (1-10)
- Threshold for control failure stated (typically: 1 exception = control failure for tests of operating effectiveness)?
- Escalation process named?

PCAOB-READABILITY (1-10)
- Could an external inspector read this workpaper standalone and understand what was tested and how?

End with verdict in James's voice (under 80 words): "Approved, proceed with sampling.", "Address [X] and re-submit.", or "Not ready, workpaper isn't self-contained." Cite 1-2 specific gaps. Be honest, this gets PCAOB-inspected.`,
      requestedBy: 'mgr',
    },
  ],
};

const AU_2: Scenario = {
  id: 'audit-2',
  trackId: 'audit',
  title: 'Client controller pushback',
  summary: 'You asked for support documentation; the controller refuses. Document the dispute and escalate.',
  timeframe: 'Client site',
  duration: '30 min',
  difficulty: 'Advanced',
  context: `Same SignalView engagement. While testing the revenue recognition control sample, the junior associate flagged 4 contracts (out of a 42-sample) where the system-generated revenue recognition schedule appears to differ from the contract terms, implying potential revenue cut-off issues at quarter-end. The junior asked the client controller (Tom Bremmer, CPA, 12 years with SignalView, well-respected internally) for the underlying contract amendments and any side letters. Tom's response: "Those amendments are confidential client-facing legal documents. We don't share those with auditors as a matter of policy. The system-generated schedule is correct, if the system says it, that's our answer. Move on." This is a standard escalation moment. Junior needs to write the memo documenting the inquiry, the response, the implications, and the recommended escalation.`,
  personas: [
    { id: 'senior', name: 'Priya Mehta', title: 'Audit Senior', firm: 'Big Four Audit', style: 'Same as AU_1. Will take the junior\'s documentation upstream as-is, so it has to be correct.', voice: 'methodical', initials: 'PM' },
  ],
  opening: [
    { personaId: 'senior', text: `Tom is refusing to give you the contract amendments on the 4 exceptions. That's not optional. We have the right to those documents under our engagement letter and PCAOB AS 1105.` },
    { personaId: 'senior', text: `Write me the memo. What you asked for, what Tom said, why his 'policy' reasoning doesn't hold, the implication if we can't get the documents, your recommended next step.` },
    { personaId: 'senior', text: `James will take this to the partner if needed. Be professional but clear. This is the moment where junior auditors either hold the line or fold.` },
  ],
  artifacts: [
    {
      id: 'dispute-memo',
      label: 'Client Inquiry / Dispute Memo',
      format: 'docx',
      prompt: `Write the dispute documentation memo for the SignalView contract amendments issue.

Required sections:
• HEADER: client, control under test (RR-04), date, attendees of the inquiry
• REQUEST MADE: what specifically you asked for, when, in what form (verbal/email), why those documents are needed (testing tie-out)
• RESPONSE FROM CLIENT: Tom's exact response, the reason given ("confidential policy"), the alternative he offered (rely on the system-generated schedule)
• EVALUATION OF RESPONSE: why "internal policy" is not a valid reason to deny audit access; reference engagement letter scope clauses and applicable PCAOB standards (AS 1105 - Audit Evidence)
• IMPLICATION FOR THE AUDIT: if we cannot obtain the documents, the control RR-04 cannot be tested for these 4 exceptions; we cannot rely on the control; substantive procedures expand significantly; potential scope limitation if pattern repeats
• RECOMMENDED NEXT STEPS: (1) request in writing with reference to engagement letter, (2) escalate to CFO if controller continues to refuse, (3) document scope limitation in the audit file if access is ultimately denied
• PROFESSIONAL TONE NOTE: nothing in the memo should sound personal toward Tom, this is a process documentation, not an accusation

Upload as .docx.`,
      rubric: `Grade as an Audit Senior reviewing a junior's dispute documentation that may go to a partner. Score 1-10:

REQUEST CLARITY (1-10)
- What was asked for, when, why, all specifically documented?
- Common error: vague ("asked for additional documentation").

RESPONSE FIDELITY (1-10)
- Tom's response captured faithfully without editorializing?
- Exact words where possible, paraphrased professionally where not?

PROFESSIONAL STANDARDS CITED (1-10)
- AS 1105 (Audit Evidence) referenced?
- Engagement letter scope referenced?
- This is what separates a complaint from a properly documented dispute.

IMPLICATIONS FRAMED (1-10)
- What happens if the documents are not provided, clearly articulated?
- Cascading consequences: control reliance lost → substantive procedures expand → potential scope limitation if pattern repeats → impact on opinion?

ESCALATION PATH (1-10)
- Specific next steps (formal written request, CFO escalation, file documentation)?
- Not "we should talk about this", concrete actions?

PROFESSIONAL TONE (1-10)
- The memo is process documentation, NOT an attack on Tom?
- Neutral language ("the controller indicated", "the auditor requested") rather than ("Tom refused", "the controller blocked us")?

PCAOB-READABILITY (1-10)
- Could a PCAOB inspector read this and understand exactly what happened?
- This is the kind of file that gets inspected, clarity matters.

LEGAL/PROFESSIONAL JUDGMENT (1-10)
- Does the memo correctly identify that "internal policy" is not a valid basis to refuse audit access?
- Does it stop short of accusing the client of obstruction (a serious claim that requires partner involvement)?

End with verdict in Priya's voice (under 80 words): "I'm taking this to James.", "Tighten [X] before I escalate.", or "Step back, this could backfire if escalated like this." Cite 1-2 specific lines. The student should learn how careful this kind of memo has to be.`,
      requestedBy: 'senior',
    },
  ],
};

const AU_3: Scenario = {
  id: 'audit-3',
  trackId: 'audit',
  title: 'Manager review, redo the section',
  summary: 'Manager finds a gap in your testing approach. Redo the section with the response memo.',
  timeframe: 'Pre-review',
  duration: '40 min',
  difficulty: 'Intermediate',
  context: `Same SignalView engagement, two weeks later. The junior associate completed RR-04 testing. Manager James reviewed the workpaper and left review notes: (1) "Your sample of 42 doesn't have enough Q3 coverage, only 6 of 42 are from Q3, but Q3 is where the revenue spike happened. Re-stratify and re-test additional samples." (2) "You didn't tie out the contract value in the billing system back to the executed contract for 11 samples, you only checked the rev rec schedule. Without tie-out, you haven't tested attribute #2." (3) "Your conclusion memo says 'control operating effectively' but you had 4 exceptions still being investigated. Conclusion needs to change to 'control conclusion pending resolution of identified exceptions.'" Junior needs to redo the impacted sections and write a response memo addressing each of James's three notes.`,
  personas: [
    { id: 'mgr', name: 'James Hartwell', title: 'Audit Manager', firm: 'Big Four Audit', style: 'Same as AU_1. Review-heavy, will re-review every line until it\'s right.', voice: 'review-heavy', initials: 'JH' },
  ],
  opening: [
    { personaId: 'mgr', text: `Three review notes on RR-04. One: sample under-weights Q3. Two: tie-out missing on 11 samples. Three: conclusion language doesn't match what you actually found.` },
    { personaId: 'mgr', text: `Response memo. For each note: your remediation action, what additional work you'll do, the revised conclusion language. Then update the workpaper accordingly. Don't argue the notes. Fix them.` },
  ],
  artifacts: [
    {
      id: 'review-response',
      label: 'Manager Review Response Memo',
      format: 'docx',
      prompt: `Write the response memo addressing each of James's three review notes.

Required structure:
• NOTE 1, SAMPLE Q3 COVERAGE:
  - Acknowledge note
  - Remediation: re-stratify sample by quarter, target proportional coverage (Q3 should be ~33% of sample, currently 14%)
  - Action: select 8 additional Q3 samples to bring Q3 coverage to ~33%
  - Re-test additional samples per workpaper approach
• NOTE 2, TIE-OUT GAP:
  - Acknowledge note
  - Remediation: pull executed contract PDFs for all 11 samples missing tie-out, compare contract value to billing system entry
  - If tie-outs match: update workpaper to reflect completed testing
  - If tie-outs fail: document as additional exceptions and adjust conclusion
• NOTE 3, CONCLUSION LANGUAGE:
  - Acknowledge note
  - Remediation: rewrite conclusion section
  - Revised language: state that control testing is complete for sample, but conclusion on operating effectiveness is pending resolution of [X] identified exceptions, which are subject to additional procedures and management response
• OVERALL TIMELINE: when each note will be addressed and the file re-submitted for review

Upload as .docx.`,
      rubric: `Grade as an Audit Manager reviewing a junior's response to review notes. Score 1-10:

ACKNOWLEDGMENT TONE (1-10)
- Each note acknowledged without arguing the merits?
- Common error: pushing back on the note. Even if the junior disagrees, the response should remediate first and discuss judgment separately.

NOTE 1, REMEDIATION SPECIFICITY (1-10)
- Specific action (re-stratify, select N more samples from Q3)?
- Math on coverage: current 6/42 = 14%, target ~33%, need 8 more Q3 samples (8/(42+8) = ~28%, closer to balanced)?
- Reject vague "will add more Q3 samples."

NOTE 2, TIE-OUT REMEDIATION (1-10)
- Concrete action: pull contracts for 11 samples, compare contract value to billing system?
- Anticipates two outcomes: matches (workpaper update) vs failures (additional exceptions)?

NOTE 3, CONCLUSION LANGUAGE (1-10)
- Acknowledges that "control operating effectively" was premature given unresolved exceptions?
- Revised language correctly conditional ("conclusion pending resolution of identified exceptions")?
- This is a critical professional judgment moment, incorrect conclusions create file risk.

TIMELINE COMMITMENT (1-10)
- Specific commitment for when each remediation is complete?
- Without timing, the manager has no basis for planning the re-review.

PROFESSIONAL TONE (1-10)
- Junior accepts the feedback professionally?
- "Acknowledged, remediation as follows" rather than "I disagree but will comply"?
- Junior auditors who push back on review notes burn manager goodwill fast.

INTERNAL CONSISTENCY (1-10)
- Each remediation action aligns with the standard testing approach in the workpaper?
- No introduction of new approaches that contradict the original test design?

End with verdict in James's voice (under 70 words): "Make the changes, re-submit by EOD.", "On the right track but [X] still needs work.", or "Restart, your response misunderstands the notes." Cite one note specifically.`,
      requestedBy: 'mgr',
    },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
// EXPORT
// ═════════════════════════════════════════════════════════════════════════════

export const REPS_SCENARIOS: Record<RepsTrackId, Scenario[]> = {
  ib: [IB_1, IB_2, IB_3, IB_4, IB_5, IB_6],
  pe: [PE_1, PE_2, PE_3],
  consulting: [CON_1, CON_2, CON_3],
  rx: [RX_1, RX_2, RX_3],
  st: [ST_1, ST_2, ST_3],
  am: [AM_1, AM_2, AM_3],
  vc: [VC_1, VC_2, VC_3],
  re: [RE_1, RE_2, RE_3],
  er: [ER_1, ER_2, ER_3],
  audit: [AU_1, AU_2, AU_3],
};
