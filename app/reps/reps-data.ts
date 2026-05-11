// ─────────────────────────────────────────────────────────────────────────────
// Reps content data.
// Each scenario has: metadata, personas, a context block fed to the AI, and
// an `artifacts` array describing what work product the student is expected
// to upload. Each artifact has its own grading rubric — the AI reads the
// uploaded file's actual content and grades against the rubric, not against
// generic "is this good?" vibes.
//
// IB-1 is fully built out as the canonical example. The other scenarios are
// scaffolding — they render in the UI but the grading rubrics need to be
// filled in scenario-by-scenario (~1 day of careful work per scenario).
// ─────────────────────────────────────────────────────────────────────────────

export type Persona = {
  id: string;
  name: string;
  title: string;
  firm: string;
  style: string;       // tone/personality for the AI to embody
  voice: string;       // short tag: "precise", "big-picture", "demanding"
  initials: string;
};

export type ArtifactSpec = {
  id: string;
  label: string;       // "Comp sheet", "One-pager", "IC memo"
  format: 'xlsx' | 'docx' | 'pdf' | 'pptx';
  prompt: string;      // what the student is being asked to produce
  rubric: string;      // detailed grading criteria fed to the AI
  requestedBy: string; // persona id who is asking
};

export type Scenario = {
  id: string;
  trackId: RepsTrackId;
  title: string;
  summary: string;
  timeframe: string;
  duration: string;
  difficulty: 'Intro' | 'Intermediate' | 'Advanced';
  // The world the AI sits inside — fed as system context to every persona.
  context: string;
  personas: Persona[];
  // Opening messages that appear in the chat panel when the session starts.
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
  { id: 'pe', title: 'Private Equity', abbr: 'PE', tagline: 'CIM lands. Run the LBO. Defend it at IC.', description: 'You\'re an associate at a fund. A CIM hits your inbox. Read it, run a paper LBO, sit through management presentations, write the IC memo, defend the deal in front of partners.', accent: '#1d4ed8' },
  { id: 'consulting', title: 'Consulting', abbr: 'C', tagline: 'Partner drops a question. You structure it.', description: 'You\'re on a client engagement. The partner hands you a slice of the case. Structure the problem, interview a client stakeholder, build slides, defend your recommendation under pushback.', accent: '#0891b2' },
  { id: 'rx', title: 'Restructuring', abbr: 'Rx', tagline: 'Covenant breach overnight. Sponsor on the line.', description: 'Crisis mode at Lazard, PJT, Houlihan. Sponsor calls because their portfolio company tripped a covenant. Build a situation overview, walk through cap stack options, prep for an angry lender meeting.', accent: '#7c2d12' },
  { id: 'st', title: 'Sales & Trading', abbr: 'ST', tagline: 'Market opens. RFQs flow. P&L moves.', description: 'A morning at a bank\'s trading desk. Sit in on the morning meeting, manage your axe sheet as the market opens, price client RFQs in real time, defend your book at the end-of-day P&L review.', accent: '#dc2626' },
  { id: 'am', title: 'Asset Management', abbr: 'AM', tagline: 'Earnings print. Update the model. Brief the PM.', description: 'A quieter day at a long-only fund. A portfolio name just reported — update the model, take a call with the IR head, write a note for your PM, defend your conviction at the position review.', accent: '#166534' },
  { id: 'vc', title: 'Venture Capital', abbr: 'VC', tagline: 'Series A deck lands. Founder call at 3.', description: 'A partner forwards you a pitch deck. Skim it, run a quick market scan, take a founder call, write the memo, and defend the deal (or kill it) in front of the partners.', accent: '#7c3aed' },
  { id: 're', title: 'Real Estate', abbr: 'RE', tagline: 'Rent roll, OM, and an IC deadline.', description: 'Underwrite a new acquisition. Build the cash flow model from the rent roll, analyze the local market and comps, write the IC memo, defend your assumptions to the investment committee.', accent: '#92400e' },
  { id: 'er', title: 'Equity Research', abbr: 'ER', tagline: 'Company you cover just reported. Note before open.', description: 'Earnings day for a name you cover. Update your model with the print, join the earnings call, write a quick client note, take a tough call from a buy-side analyst, decide if your rating changes.', accent: '#0f766e' },
  { id: 'audit', title: 'Accounting & Audit', abbr: 'A', tagline: 'Q3 audit. Senior assigns. Client resists.', description: 'Deep in a Q3 audit. Your senior assigns a control to test, pull samples and document workpapers, push back when the client resists, redo a section after manager review.', accent: '#4f46e5' },
];

// ─────────────────────────────────────────────────────────────────────────────
// IB-1 — the canonical fully-built scenario. This is what students experience
// today. Other scenarios use the same structure but rubrics need filling in.
// ─────────────────────────────────────────────────────────────────────────────

const IB_1: Scenario = {
  id: 'ib-1',
  trackId: 'ib',
  title: 'Live M&A pitch — Tuesday afternoon',
  summary: 'Your MD wants a refreshed comp set for a healthcare software target before tomorrow\'s pitch. The VP will mark it up at 6. The clock is running.',
  timeframe: 'Tuesday PM',
  duration: '35 min',
  difficulty: 'Intermediate',
  context: `You are roleplaying inside an Investment Banking team at a bulge-bracket bank. The team is pitching a healthcare-software sell-side mandate to a target codenamed Project Lighthouse: a $2.0B EV vertical-SaaS healthcare RCM (revenue-cycle management) platform with $280M LTM revenue, ~25% YoY growth, ~18% adj. EBITDA margins, ~120% net dollar retention. Comparable trading universe the team is using: Veeva (VEEV), Doximity (DOCS), HealthEquity (HQY), Phreesia (PHR), Evolent (EVH), Definitive Healthcare (DH). The pitch is Wednesday at 9am to the CEO and CFO of Project Lighthouse. The student is the first-year analyst on the deal. The associate is on another live deal so the analyst is operating with limited cover.`,
  personas: [
    {
      id: 'md',
      name: 'David Chen',
      title: 'Managing Director',
      firm: 'GS / Healthcare Group',
      style: 'Big-picture, time-poor, talks in headlines. Cares about the client narrative, multiples that "make sense", and whether the analyst can defend a number under pushback. Doesn\'t want to see the math, wants to see the answer. Often changes direction mid-conversation if a new angle hits him.',
      voice: 'big-picture',
      initials: 'DC',
    },
    {
      id: 'vp',
      name: 'Priya Raman',
      title: 'Vice President',
      firm: 'GS / Healthcare Group',
      style: 'Sharp, exacting, kind but unrelenting on quality. Marks up everything. Will flag formatting (alignment, decimals, sourcing) and substance (peer selection, EV vs market cap, calendarization) in the same breath. Wants the analyst to think two steps ahead.',
      voice: 'precise',
      initials: 'PR',
    },
  ],
  opening: [
    { personaId: 'md', text: `Need a refreshed Lighthouse comp sheet for tomorrow's pitch. Use the peer set the team agreed on — VEEV, DOCS, HQY, PHR, EVH, DH. EV/Rev and EV/EBITDA, NTM. Calendarize. Send when ready, I want eyes on it before Priya marks it up.` },
    { personaId: 'vp', text: `When you get the comps to David, I'll review immediately. Quick reminders: peers should be defensible, multiples should reconcile to source, and please get the EV right — market cap plus net debt, no shortcuts. Format clean. Source footnoted.` },
  ],
  artifacts: [
    {
      id: 'comp-sheet',
      label: 'Trading Comp Sheet',
      format: 'xlsx',
      prompt: `Build a trading comp sheet for Project Lighthouse. Required:
- Peer set: VEEV, DOCS, HQY, PHR, EVH, DH (don't drop any without flagging why)
- For each peer: Market Cap, Net Debt, Enterprise Value, NTM Revenue, NTM EBITDA, EV/NTM Revenue, EV/NTM EBITDA, Revenue Growth %, EBITDA Margin %
- Show Mean, Median, Min, Max at the bottom
- Lighthouse implied valuation range using median peer multiples
- Source row at the bottom

Upload as .xlsx when ready. Priya will review the file directly.`,
      rubric: `Grade as a Healthcare IB VP at a bulge bracket reviewing a first-year analyst's comp sheet. Be specific, cite cells/columns when you see issues. Evaluate on these dimensions and give each a score 1-10:

PEER SELECTION (1-10)
- Did they include all 6 named peers? Did they drop any without explanation?
- Did they add any non-defensible peers (e.g., enterprise SaaS that isn't healthcare-vertical)?

ENTERPRISE VALUE CONSTRUCTION (1-10)
- Is EV computed correctly as Market Cap + Net Debt (Debt - Cash)? Common error: using Market Cap as a proxy.
- Are net debt values current and sourced?

MULTIPLE CALCULATIONS (1-10)
- EV/NTM Revenue and EV/NTM EBITDA: divide EV by the NTM figure (not LTM, not current year).
- Common error: using LTM, mixing periods, dividing by margins instead of dollars.
- Sanity-check ranges (healthcare-software NTM Revenue multiples should be roughly 5x-15x range; EBITDA 25x-60x for high-growth).

OPERATING METRICS (1-10)
- Revenue growth % and EBITDA margin % should be NTM, consistent definition.
- Negative EBITDA peers (if any) should show "nm" or "neg", not a calculated multiple.

SUMMARY STATISTICS (1-10)
- Mean, median, min, max for both multiples and operating metrics.
- Lighthouse implied EV range using median peer multiples applied to Lighthouse's $280M revenue and projected EBITDA.

FORMATTING & POLISH (1-10)
- Header row clear. Decimals consistent (one for multiples, one or two for percentages). Aligned numbers right.
- Source row present and credible (Capital IQ / FactSet / Bloomberg).
- File usable as a pitch attachment without further formatting.

End with an overall verdict in the VP's voice (under 80 words): would this go to the MD as-is, would it go back for one revision, or is it a full redo. Reference 2-3 specific things by cell or column name. Speak as Priya. Be honest. Don't soften the feedback.`,
      requestedBy: 'md',
    },
  ],
};

// Placeholder scenarios — same structure, rubrics will be added per scenario.
function placeholder(trackId: RepsTrackId, id: string, title: string, summary: string, timeframe: string, duration: string, difficulty: Scenario['difficulty']): Scenario {
  return {
    id, trackId, title, summary, timeframe, duration, difficulty,
    context: `Placeholder scenario — full configuration coming soon.`,
    personas: [
      { id: 'sr', name: 'Senior', title: 'Senior', firm: 'The Firm', style: 'Professional, demanding, time-poor.', voice: 'professional', initials: 'SR' },
    ],
    opening: [{ personaId: 'sr', text: 'This scenario is still being built out. Check back soon.' }],
    artifacts: [],
  };
}

export const REPS_SCENARIOS: Record<RepsTrackId, Scenario[]> = {
  ib: [
    IB_1,
    placeholder('ib', 'ib-2', 'Fairness opinion all-nighter', 'MD changed the deal thesis at 9pm. Redo the comps and the one-pager before the 8am call.', 'All-nighter', '45 min', 'Advanced'),
    placeholder('ib', 'ib-3', 'First-week ramp — comp set', 'Your first real task. Build a clean comp set on a TMT name. Get every multiple right and pick your peers defensibly.', 'First week', '30 min', 'Intro'),
  ],
  pe: [
    placeholder('pe', 'pe-1', 'Paper LBO — CIM just landed', 'A consumer CIM hit the inbox. Senior associate wants a paper LBO and a one-page take by EOD.', 'EOD ask', '40 min', 'Intermediate'),
    placeholder('pe', 'pe-2', 'IC memo defense', 'Your full LBO is done. Write the IC section on key risks and walk partners through it.', 'Pre-IC', '45 min', 'Advanced'),
    placeholder('pe', 'pe-3', 'Management presentation', 'Live mgmt presentation with a target CEO. Ask sharp questions, take notes, write up takeaways.', 'Diligence day', '35 min', 'Intermediate'),
  ],
  consulting: [
    placeholder('consulting', 'consulting-1', 'Client problem — Day 3 on the case', 'Partner hands you a slice: why are margins down 400bps YoY? Structure, slide, defend.', 'Wednesday', '40 min', 'Intermediate'),
    placeholder('consulting', 'consulting-2', 'Stakeholder interview', 'Interview the client\'s VP of Ops to test a hypothesis. They\'re skeptical of consultants.', 'Client site', '30 min', 'Intermediate'),
    placeholder('consulting', 'consulting-3', 'Recommendation slide review', 'Final readout tomorrow. Partner challenges every slide. Edit live.', 'Pre-readout', '45 min', 'Advanced'),
  ],
  rx: [
    placeholder('rx', 'rx-1', 'Covenant breach at 6am', 'Sponsor calls — portfolio co breached its leverage covenant overnight.', 'Early AM', '40 min', 'Advanced'),
    placeholder('rx', 'rx-2', 'Cap stack walkthrough', 'Walk the senior partner through cap stack options for a distressed retailer.', 'Pre-meeting', '35 min', 'Advanced'),
    placeholder('rx', 'rx-3', 'Recovery waterfall — first pass', 'Your first cut at a recovery waterfall on a real situation.', 'First week', '40 min', 'Intermediate'),
  ],
  st: [
    placeholder('st', 'st-1', 'Morning meeting + first hour of trading', 'Sit in on morning meeting. Market opens. Three RFQs in 20 minutes.', 'AM session', '35 min', 'Intermediate'),
    placeholder('st', 'st-2', 'P&L review with the senior trader', 'End of day. Senior trader grills you on every position.', 'EOD', '30 min', 'Advanced'),
    placeholder('st', 'st-3', 'Client call — pricing a block', 'Real-money client wants a price on a block. Show your bid.', 'Intraday', '25 min', 'Advanced'),
  ],
  am: [
    placeholder('am', 'am-1', 'Earnings update — model and PM brief', 'A name in your sleeve printed. Update the model, write a 200-word brief.', 'Earnings day', '40 min', 'Intermediate'),
    placeholder('am', 'am-2', 'IR call with the company', 'Take a 30-min call with the IR head. Ask the right questions.', 'Post-print', '35 min', 'Intermediate'),
    placeholder('am', 'am-3', 'Position review — PM challenge', 'PM pushes back on your conviction. Defend or revise.', 'Monthly review', '30 min', 'Advanced'),
  ],
  vc: [
    placeholder('vc', 'vc-1', 'Series A deck triage', 'A founder deck landed. Read it, market scan, founder call, memo or no.', 'Triage day', '40 min', 'Intro'),
    placeholder('vc', 'vc-2', 'Investment memo defense', 'You wrote the memo. Defend it at the partner meeting.', 'Partner meeting', '45 min', 'Advanced'),
    placeholder('vc', 'vc-3', 'Market map — sector dive', 'Partner asks for a market map on a vertical you don\'t know.', 'Diligence', '35 min', 'Intermediate'),
  ],
  re: [
    placeholder('re', 're-1', 'Underwrite a multifamily acquisition', 'Rent roll and OM landed. Build a cash flow model, write IC pre-read.', 'New deal', '45 min', 'Intermediate'),
    placeholder('re', 're-2', 'IC presentation — defend the underwrite', 'IC challenges cap rate, exits, rent growth. Hold the line or revise.', 'IC day', '40 min', 'Advanced'),
    placeholder('re', 're-3', 'Market comps — submarket dive', 'Senior wants comps for a Phoenix submarket.', 'Diligence', '30 min', 'Intro'),
  ],
  er: [
    placeholder('er', 'er-1', 'Earnings day — quick note before open', 'A name you cover just printed AH. Note out before open.', 'Pre-market', '40 min', 'Intermediate'),
    placeholder('er', 'er-2', 'Buy-side call — tough questions', 'Buy-side PM calls with hard questions on guidance.', 'Post-print', '30 min', 'Advanced'),
    placeholder('er', 'er-3', 'Rating decision with the senior analyst', 'Decide if today\'s print changes your rating.', 'Mid-day', '35 min', 'Intermediate'),
  ],
  audit: [
    placeholder('audit', 'audit-1', 'Control testing — Q3 audit', 'Senior assigns you a revenue control. Pull samples, document workpapers.', 'Field work', '40 min', 'Intermediate'),
    placeholder('audit', 'audit-2', 'Client controller pushes back', 'Ask for support; controller says no. Hold position professionally.', 'Client site', '25 min', 'Advanced'),
    placeholder('audit', 'audit-3', 'Manager review — redo the section', 'Manager finds a gap in testing approach. Redo before partner review.', 'Pre-review', '35 min', 'Intermediate'),
  ],
};
