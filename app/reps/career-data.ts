// ─────────────────────────────────────────────────────────────────────────────
// MyCareer data: types, content, and the year 1 event timeline for IB.
//
// The career mode runs on a Week clock. Events have a `week` field and fire
// in order. Between scripted events, the engine inserts time-skip beats so
// the calendar moves and stats drift naturally without padding playtime.
//
// Major deliverables reuse REPS_SCENARIOS from reps-data.ts. We don't dupe
// the work; the career layer just wraps the existing graded experience and
// applies the resulting scores back onto the player's stats and rep.
//
// Pacing target for year 1 IB: ~25 events spread across 50 weeks.
// Major deliverables: 4-6 per year. Quick decisions: 12-15 per year.
// Narrative beats / training / time skips fill the gaps.
// ─────────────────────────────────────────────────────────────────────────────

import { REPS_SCENARIOS } from './reps-data';

// ─── Skills ──────────────────────────────────────────────────────────────────

export type SkillId = 'modeling' | 'memo' | 'commercial' | 'voice';

export type Skills = {
  modeling: number;
  memo: number;
  commercial: number;
  voice: number;
};

export const SKILL_LABELS: Record<SkillId, string> = {
  modeling: 'Modeling',
  memo: 'Memo Writing',
  commercial: 'Commercial Judgment',
  voice: 'Client Voice',
};

export const SKILL_DESCRIPTIONS: Record<SkillId, string> = {
  modeling: 'Excel craft. Formulas, formatting, sense-check discipline.',
  memo: 'Written work. Structure, lede, the ability to say it in 200 words.',
  commercial: 'Thesis quality. Risk identification. Reading a deal.',
  voice: 'How you handle pings, pushback, and the room.',
};

// ─── Player save state ───────────────────────────────────────────────────────

export type CareerId = 'ib' | 'pe' | 'consulting' | 'rx' | 'st' | 'am' | 'vc' | 're' | 'er' | 'audit';

export type Reputations = Record<string, number>; // personaKey -> -100..+100

export type SignatureMoment = {
  id: string;
  week: number;
  year: number;
  title: string;
  body: string;
};

export type PlayerSave = {
  saveId: string;
  career: CareerId;
  // Identity
  playerName: string;
  playerSchool: string;
  playerHometown: string;
  playerBackgroundId: string;
  firmName: string; // randomized at start, e.g. "Goldman Sachs", "Morgan Stanley", "Centerview"
  // Time
  currentYear: number;       // 1, 2, 3...
  currentWeek: number;       // 0..50 within the current year
  // State
  skills: Skills;
  stamina: number;           // 0-100
  reputations: Reputations;
  completedEventIds: string[];
  badges: string[];
  signatureMoments: SignatureMoment[];
  // Status
  status: 'active' | 'year_end' | 'graduated' | 'pushed_out';
  branchUnlocked?: string;   // set at year end
  createdAt: number;
  lastPlayedAt: number;
};

// ─── Player creation choices ─────────────────────────────────────────────────

// Comprehensive school list, alphabetical. Includes the main schools that
// recruit into M&A IB programs, plus a wide tail. If the user's school isn't
// here they should pick "Other".
export const SCHOOLS = [
  'Amherst College',
  'Babson College',
  'Bates College',
  'Baylor University',
  'Berkeley Haas',
  'Boston College Carroll',
  'Boston University Questrom',
  'Bowdoin College',
  'Brown University',
  'Bucknell University',
  'Carnegie Mellon University',
  'Claremont McKenna',
  'Colgate University',
  'College of William & Mary',
  'Columbia University',
  'Cornell Dyson',
  'Cornell University',
  'Dartmouth College',
  'Davidson College',
  'Duke Fuqua',
  'Duke University',
  'Emory Goizueta',
  'Florida Warrington',
  'Fordham University',
  'Georgetown McDonough',
  'Georgia Institute of Technology',
  'Hamilton College',
  'Harvard University',
  'Howard University',
  'Indiana Kelley',
  'Johns Hopkins University',
  'Lafayette College',
  'Lehigh University',
  'MIT Sloan',
  'MIT',
  'Michigan Ross',
  'Middlebury College',
  'Morehouse College',
  'New York University',
  'NYU Stern',
  'Northeastern University',
  'Northwestern Kellogg',
  'Northwestern University',
  'Notre Dame Mendoza',
  'Ohio State Fisher',
  'Penn State Smeal',
  'Pomona College',
  'Princeton University',
  'Rice University',
  'Rutgers University',
  'SMU Cox',
  'Spelman College',
  'Stanford GSB',
  'Stanford University',
  'Tufts University',
  'Tulane Freeman',
  'UCLA Anderson',
  'UCLA',
  'UNC Kenan-Flagler',
  'USC Marshall',
  'UT Austin McCombs',
  'UVA McIntire',
  'University of Chicago Booth',
  'University of Chicago',
  'University of Florida',
  'University of Illinois',
  'University of Michigan',
  'University of Minnesota Carlson',
  'University of Pennsylvania',
  'University of Virginia',
  'University of Wisconsin',
  'Vanderbilt University',
  'Villanova University',
  'Wake Forest University',
  'Washington University in St. Louis',
  'Wellesley College',
  'Wharton School',
  'Williams College',
  'Yale University',
  'Other',
];

// US states for the hometown dropdown. A state is specific enough to feel
// personal in narrative ("Yeah, grew up in Ohio") without forcing a giant
// cities list. International + Other catch everyone else.
export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia',
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
  'International',
];

export type Background = {
  id: string;
  label: string;
  blurb: string;
  bonus: Partial<Skills>;
};

export const BACKGROUNDS: Background[] = [
  {
    id: 'modeler',
    label: 'Built models in your school finance club',
    blurb: 'You ran the DCF clinic for the M&A society. Excel is a comfort zone.',
    bonus: { modeling: 5 },
  },
  {
    id: 'writer',
    label: 'Wrote for the school newspaper',
    blurb: 'Two years of weekly columns. You can land a lede.',
    bonus: { memo: 5 },
  },
  {
    id: 'founder',
    label: 'Ran a small business in college',
    blurb: 'You sold something to someone. You understand revenue.',
    bonus: { commercial: 5 },
  },
  {
    id: 'athlete',
    label: 'Captained a varsity team',
    blurb: 'You know how to perform tired. Stamina and presence both come naturally.',
    bonus: { voice: 5 },
  },
  {
    id: 'generalist',
    label: 'Worked retail through school',
    blurb: 'You showed up early, dealt with people, and got nothing handed to you.',
    bonus: { modeling: 2, memo: 2, commercial: 2, voice: 2 },
  },
];

// ─── Firms by career ─────────────────────────────────────────────────────────

// Firms with character. Tagline is shown during player creation so the choice
// feels meaningful. The IB list is M&A-focused (S&T and Rx are their own
// careers). Tier groups firms in the UI under section headers.

export type FirmTier = 'bulge_bracket' | 'elite_boutique' | 'middle_market' | 'specialist';

export const FIRM_TIER_LABELS: Record<FirmTier, string> = {
  bulge_bracket: 'Bulge Bracket',
  elite_boutique: 'Elite Boutique',
  middle_market: 'Middle Market',
  specialist: 'Specialist / Industry',
};

export type FirmOption = {
  name: string;
  tagline: string;
  accent: string;
  tier?: FirmTier;
};

export const FIRMS_BY_CAREER: Record<CareerId, FirmOption[]> = {
  // IB MyCareer is an M&A simulation. Firm list reflects that.
  ib: [
    // Bulge Bracket
    { name: 'Goldman Sachs',             tier: 'bulge_bracket', accent: '#7c2d12', tagline: 'The brand. M&A league table mainstay, deep client roster, a culture that\'s as much a religion as a job.' },
    { name: 'Morgan Stanley',            tier: 'bulge_bracket', accent: '#1e40af', tagline: 'Bulge bracket counterweight to Goldman. Strong M&A, top tech coverage, slightly more humane culture.' },
    { name: 'JPMorgan',                  tier: 'bulge_bracket', accent: '#1f2937', tagline: 'The biggest balance sheet on the street. M&A heavy, healthcare and industrials especially dominant.' },
    { name: 'Bank of America',           tier: 'bulge_bracket', accent: '#dc2626', tagline: 'Full-service bulge bracket. Strong leveraged finance, growing M&A advisory, deep corporate client list.' },
    { name: 'Citi',                      tier: 'bulge_bracket', accent: '#0c4a6e', tagline: 'Global footprint, EM and cross-border M&A strength, scrappier US franchise.' },
    { name: 'Barclays',                  tier: 'bulge_bracket', accent: '#1e3a8a', tagline: 'Strong natural resources and industrials M&A. UK-rooted balance sheet, US ambitions.' },
    { name: 'UBS',                       tier: 'bulge_bracket', accent: '#7c2d12', tagline: 'Wealth management arm gives unique client access. Restructuring after Credit Suisse acquisition.' },
    { name: 'Deutsche Bank',             tier: 'bulge_bracket', accent: '#1e40af', tagline: 'Smaller US M&A footprint than peers, but solid TMT and industrials coverage.' },
    { name: 'RBC Capital Markets',       tier: 'bulge_bracket', accent: '#0c4a6e', tagline: 'Canadian bank with strong US energy, mining, and industrial coverage. Growing M&A practice.' },
    { name: 'Wells Fargo Securities',    tier: 'bulge_bracket', accent: '#dc2626', tagline: 'Massive US corporate banking footprint. Growing M&A advisory, still building street rep.' },

    // Elite Boutique
    { name: 'Centerview Partners',       tier: 'elite_boutique', accent: '#1e3a8a', tagline: 'Lean elite. ~80 partners. The pay is mythical and the hours are too. You get smart fast.' },
    { name: 'Evercore',                  tier: 'elite_boutique', accent: '#365314', tagline: 'Top advisory boutique. M&A focus, smaller class sizes, more direct senior banker exposure.' },
    { name: 'Lazard',                    tier: 'elite_boutique', accent: '#581c87', tagline: 'The old-money advisory house. Top financial advisory, European reach, cerebral culture.' },
    { name: 'PJT Partners',              tier: 'elite_boutique', accent: '#0c4a6e', tagline: 'Spin-out from Blackstone. Strong strategic advisory, restructuring, and capital advisory.' },
    { name: 'Moelis & Company',          tier: 'elite_boutique', accent: '#7e22ce', tagline: 'M&A-heavy advisory boutique. Lean teams, founder-led, deals get done.' },
    { name: 'Guggenheim Partners',       tier: 'elite_boutique', accent: '#1f2937', tagline: 'Independent advisory with healthcare, media, and consumer M&A strength.' },
    { name: 'Perella Weinberg Partners', tier: 'elite_boutique', accent: '#7c2d12', tagline: 'Lean elite advisory firm. Energy and financial sponsors M&A both notable.' },
    { name: 'Greenhill & Co.',           tier: 'elite_boutique', accent: '#365314', tagline: 'Pure-play independent advisory. Smaller now but the legacy M&A pedigree is real.' },
    { name: 'Qatalyst Partners',         tier: 'specialist',     accent: '#581c87', tagline: 'Pure tech M&A boutique. Founded by Frank Quattrone. Largest tech sell-side mandates.' },
    { name: 'Allen & Company',           tier: 'specialist',     accent: '#1e3a8a', tagline: 'Media and entertainment M&A specialist. Famously private, famously connected.' },

    // Middle Market
    { name: 'Houlihan Lokey',            tier: 'middle_market',  accent: '#365314', tagline: 'Mid-market M&A king. Volume play, more deals than anyone, plus strong restructuring.' },
    { name: 'Jefferies',                 tier: 'middle_market',  accent: '#0c4a6e', tagline: 'Aggressive middle-market and growth M&A. Building bulge-bracket ambitions.' },
    { name: 'William Blair',             tier: 'middle_market',  accent: '#1e40af', tagline: 'Chicago-based mid-market specialist. Healthcare, tech, and consumer M&A focus.' },
    { name: 'Piper Sandler',             tier: 'middle_market',  accent: '#7c2d12', tagline: 'Strong healthcare, financials, and energy M&A in the middle market.' },
    { name: 'Stifel',                    tier: 'middle_market',  accent: '#581c87', tagline: 'Diversified mid-market platform with growing M&A advisory across sectors.' },
    { name: 'Raymond James',             tier: 'middle_market',  accent: '#1f2937', tagline: 'Mid-market and lower middle market M&A. Conservative culture, broad reach.' },
    { name: 'Robert W. Baird',           tier: 'middle_market',  accent: '#365314', tagline: 'Mid-market generalist. Industrials and consumer M&A especially strong.' },
    { name: 'Rothschild & Co',           tier: 'elite_boutique', accent: '#7c2d12', tagline: 'European M&A heritage. Independent advisory, strong cross-border deal flow.' },
    { name: 'Harris Williams',           tier: 'middle_market',  accent: '#0c4a6e', tagline: 'Owned by PNC. Pure-play sell-side M&A advisory. Lower middle market focus.' },
    { name: 'Lincoln International',     tier: 'middle_market',  accent: '#1e3a8a', tagline: 'Mid-market M&A advisory with strong financial sponsor relationships.' },
  ],
  pe: [
    { name: 'KKR',             accent: '#1f2937', tagline: 'Mega-fund. Industrials and tech heavy. The original buyout shop.' },
    { name: 'Blackstone',      accent: '#1e3a8a', tagline: 'Largest alternative asset manager on earth. Real estate, PE, credit, all of it.' },
    { name: 'Apollo',          accent: '#7c2d12', tagline: 'Distressed and credit DNA. Aggressive, contrarian, value-oriented.' },
    { name: 'Carlyle',         accent: '#365314', tagline: 'Washington-rooted. Aerospace, defense, government-adjacent exposure.' },
    { name: 'Bain Capital',    accent: '#7e22ce', tagline: 'Spun out of Bain & Co. Consulting-heavy diligence culture.' },
    { name: 'TPG',             accent: '#0c4a6e', tagline: 'Mid-market and growth equity strong. Bay Area-leaning, healthcare/tech tilt.' },
    { name: 'Warburg Pincus',  accent: '#581c87', tagline: 'Growth-focused, longer hold periods. Healthcare and financial services depth.' },
    { name: 'Vista Equity',    accent: '#7c3aed', tagline: 'B2B software specialist. Operationally intense, data-driven post-close.' },
  ],
  consulting: [
    { name: 'McKinsey',          accent: '#0c4a6e', tagline: 'The brand. Generalist firm, every industry, the broadest senior partner network.' },
    { name: 'Bain & Company',    accent: '#dc2626', tagline: 'PE-adjacent culture. Results-oriented, smaller, tighter, friendlier than McK or BCG.' },
    { name: 'BCG',               accent: '#16a34a', tagline: 'Strategy-heavy. Tech and digital practice especially strong, more intellectual culture.' },
    { name: 'Oliver Wyman',      accent: '#1e3a8a', tagline: 'Financial services specialist. Lean teams, deep technical work.' },
    { name: 'L.E.K. Consulting', accent: '#7c2d12', tagline: 'Healthcare and life sciences depth. Smaller than MBB, sharper focus.' },
  ],
  rx: [
    { name: 'Lazard Restructuring',     accent: '#581c87', tagline: 'The legacy debtor advisor. Largest, most established, every major bankruptcy.' },
    { name: 'PJT RSSG',                 accent: '#0c4a6e', tagline: 'Aggressive new entrant. Picked up share fast. Sharp, ambitious team.' },
    { name: 'Houlihan Lokey',           accent: '#365314', tagline: 'Mid-market restructuring king. Volume play, more deals than anyone.' },
    { name: 'Centerview Restructuring', accent: '#1e3a8a', tagline: 'Lean elite, creditor-side focus, top-tier creditor advisory.' },
    { name: 'Moelis Rx',                accent: '#7e22ce', tagline: 'Strong sponsor and creditor work. Founder-led culture extends here too.' },
  ],
  st: [
    { name: 'Goldman Sachs S&T',          accent: '#7c2d12', tagline: 'The flow shop. Massive footprint across every product.' },
    { name: 'Morgan Stanley S&T',         accent: '#1e40af', tagline: 'Equities-strong. Prime brokerage, derivatives, more cerebral.' },
    { name: 'JPMorgan Markets',           accent: '#1f2937', tagline: 'Rates and credit dominant. Largest dealer across most products.' },
    { name: 'Citi Markets',               accent: '#0c4a6e', tagline: 'Global footprint, EM and FX strength, scrappier US presence.' },
    { name: 'Bank of America Securities', accent: '#581c87', tagline: 'Credit strong, growing equities, balance sheet behind you.' },
  ],
  am: [
    { name: 'BlackRock',            accent: '#1f2937', tagline: 'Largest asset manager on the planet. Passive and active, ETF dominance.' },
    { name: 'Fidelity',             accent: '#16a34a', tagline: 'Mutual fund and active equity stronghold. Long-tenured PMs, less politics.' },
    { name: 'T. Rowe Price',        accent: '#7c2d12', tagline: 'Active management traditionalist. Research-driven, lower turnover culture.' },
    { name: 'Capital Group',        accent: '#1e3a8a', tagline: 'Multi-manager system. American Funds. Private, partnership culture.' },
    { name: 'Wellington Management',accent: '#581c87', tagline: 'Boston blue-blood. Long-only, deep research, employee-owned partnership.' },
  ],
  vc: [
    { name: 'Sequoia Capital',             accent: '#dc2626', tagline: 'The dynasty. Seed to growth. Every legendary outcome of the last 40 years.' },
    { name: 'Andreessen Horowitz',         accent: '#1e3a8a', tagline: 'Crypto, infrastructure, and platform plays. Big bets, public personalities.' },
    { name: 'Benchmark',                   accent: '#1f2937', tagline: 'Five-partner shop. Equal economics. Smaller fund sizes by design.' },
    { name: 'Accel',                       accent: '#365314', tagline: 'SaaS and enterprise. Series A specialist, long history, top of the league tables.' },
    { name: 'Lightspeed Venture Partners', accent: '#7e22ce', tagline: 'Multi-stage, consumer and enterprise both. Global reach.' },
    { name: 'Insight Partners',            accent: '#0c4a6e', tagline: 'Growth equity at scale. Software-only, hands-on portfolio operations.' },
  ],
  re: [
    { name: 'Blackstone Real Estate', accent: '#1e3a8a', tagline: 'Largest CRE investor in the world. Across every property type.' },
    { name: 'Brookfield',             accent: '#365314', tagline: 'Real assets generalist. Real estate, infrastructure, renewables.' },
    { name: 'Starwood Capital',       accent: '#7c2d12', tagline: 'Opportunistic capital, hotels and multifamily expertise.' },
    { name: 'KKR Real Estate',        accent: '#1f2937', tagline: 'Newer entrant but moving fast. Aggressive acquisitions in core-plus space.' },
    { name: 'Carlyle Real Estate',    accent: '#581c87', tagline: 'Smaller real estate platform inside a mega-PE. Focused, less crowded.' },
  ],
  er: [
    { name: 'Goldman Sachs Research',  accent: '#7c2d12', tagline: 'Top-ranked across most sectors. The franchise that sets the tone.' },
    { name: 'Morgan Stanley Research', accent: '#1e40af', tagline: 'Tech and global macro especially strong. Slightly more cerebral house.' },
    { name: 'JPMorgan Research',       accent: '#1f2937', tagline: 'Broad coverage, banks and consumer dominant. Institutional client breadth.' },
    { name: 'Wells Fargo Securities',  accent: '#dc2626', tagline: 'Solid mid-tier sellside. Energy, REITs, financials core.' },
    { name: 'Evercore ISI',            accent: '#365314', tagline: 'Independent advisory firm with a top-ranked research arm. Lean, well-paid.' },
  ],
  audit: [
    { name: 'Deloitte',       accent: '#16a34a', tagline: 'Largest of the Big Four by revenue. Broad practice across audit, tax, consulting.' },
    { name: 'PwC',            accent: '#7c2d12', tagline: 'Audits roughly half the Fortune 500. Brand consistency, large global engagements.' },
    { name: 'EY',             accent: '#1e3a8a', tagline: 'Building consulting fast. Strong financial services and tech audit practices.' },
    { name: 'KPMG',           accent: '#0c4a6e', tagline: 'Often considered the smallest of the Big Four. Strong banking and insurance audit.' },
    { name: 'Grant Thornton', accent: '#581c87', tagline: 'Mid-market specialist. Less prestige, smaller engagements, faster career mobility.' },
  ],
};

// ─── Events ──────────────────────────────────────────────────────────────────

export type EventEffects = {
  skills?: Partial<Skills>;
  stamina?: number;          // signed
  reputations?: Reputations; // signed deltas
  badges?: string[];
  signatureMoment?: { title: string; body: string };
};

type EventBase = {
  id: string;
  career: CareerId;
  year: number;
  week: number;
  title: string;
  /** Used in the calendar bar and event log. */
  shortLabel: string;
};

export type NarrativeEvent = EventBase & {
  type: 'narrative';
  scenes: { speaker?: string; speakerTitle?: string; speakerPersonaKey?: string; text: string }[];
  effects?: EventEffects;
  defining?: boolean;
};

export type QuickDecisionEvent = EventBase & {
  type: 'quick_decision';
  setup: string;
  speaker: string;
  speakerTitle?: string;
  speakerPersonaKey?: string;
  /** What the persona says to open the conversation. */
  prompt: string;
  /** Shown to the player above the response input as a hint. */
  recommendedApproach: string;
  /**
   * Possible outcomes. The AI picks exactly one based on the player's typed
   * response. Each outcome has its own narrative + effects. Order them from
   * best to worst, but the player doesn't see this; the AI just matches by
   * description.
   */
  outcomes: {
    key: string;
    description: string;        // For the AI to match against
    narrative: string;          // Shown to the player as the consequence
    effects: EventEffects;
  }[];
  defining?: boolean;
};

export type MajorDeliverableEvent = EventBase & {
  type: 'major_deliverable';
  scenarioCareerId: CareerId;  // which REPS_SCENARIOS bucket
  scenarioId: string;          // which scenario in that bucket
  /**
   * Scoring threshold per artifact. If the average rubric score >= passThreshold,
   * the player gets the pass-case effects. Below, fail-case effects.
   */
  passThreshold: number;
  effectsOnPass: EventEffects;
  effectsOnFail: EventEffects;
  defining?: boolean;
};

export type DrillQuestion = {
  id: string;
  /** The question prompt. */
  prompt: string;
  /** Optional setup shown in a fixed-width box above the question. Useful for showing a small table for INDEX/MATCH style questions. */
  context?: string;
  choices: { id: string; label: string }[];
  correctChoiceId: string;
  /** Shown after the user answers, regardless of correct/incorrect. Teach the concept. */
  explanation: string;
};

export type TrainingEvent = EventBase & {
  type: 'training';
  skill: SkillId;
  drillTitle: string;
  drillDescription: string;
  staminaCost: number;
  /**
   * Skill gain if the player gets EVERY question right. For interactive drills,
   * actual skill gain scales with score: (correct / total) * maxSkillGain, rounded.
   * For flavor drills with no questions, the full amount is awarded on completion.
   */
  maxSkillGain: number;
  /**
   * Optional interactive questions. If present, the drill plays as a multiple-choice
   * skill challenge and the skill gain scales with score. If absent, the drill is a
   * flavor cutscene that awards the full maxSkillGain on click (use sparingly).
   */
  questions?: DrillQuestion[];
};

export type TimeSkipEvent = EventBase & {
  type: 'time_skip';
  weeksAdvanced: number;
  blurb: string;
  effects?: EventEffects;
};

export type EvaluationEvent = EventBase & {
  type: 'evaluation';
  evaluator: string;
  evaluatorTitle: string;
  prompts: string[];
};

export type CareerEvent =
  | NarrativeEvent
  | QuickDecisionEvent
  | MajorDeliverableEvent
  | TrainingEvent
  | TimeSkipEvent
  | EvaluationEvent;

// ─── Persona keys used in this career mode for reputation tracking ──────────
// These are decoupled from REPS_SCENARIOS persona ids so the career layer can
// track a stable "MD" relationship across multiple deals.

export const IB_PERSONA_KEYS = {
  md: 'md',
  vp: 'vp',
  associate: 'assoc',
  staffer: 'staffer',
  analyst_class: 'analyst_class',
} as const;

export const IB_PERSONA_PROFILE: Record<string, { name: string; title: string; photoKey: string }> = {
  md: { name: 'Marcus Whitfield', title: 'Managing Director', photoKey: 'Marcus Whitfield' },
  vp: { name: 'Priya Raman', title: 'Vice President', photoKey: 'Priya Raman' },
  assoc: { name: 'Jordan Park', title: 'Associate', photoKey: 'Jordan Park' },
  staffer: { name: 'Anna Liu', title: 'Staffer / VP', photoKey: 'Anna Liu' },
  analyst_class: { name: 'David Chen', title: 'Fellow Year-1 Analyst', photoKey: 'David Chen' },
};

// ─── IB Year 1 event timeline ────────────────────────────────────────────────

export const IB_YEAR_1_EVENTS: CareerEvent[] = [

  // ════════ Week 0: PREBOARDING ════════
  {
    id: 'ib-y1-w0-graduation',
    career: 'ib',
    year: 1,
    week: 0,
    title: 'Commencement',
    shortLabel: 'Graduation',
    type: 'narrative',
    scenes: [
      { text: 'You walk across a stage in a borrowed gown. Four years of all-nighters, finance club meetings, summer internship grinds, and the on-cycle SA recruiting circus, compressed into 90 seconds and a handshake.' },
      { text: "Your parents are in the third row. They're not sure exactly what an investment banking analyst does. You've explained it three times. They tell their friends you got a 'job at a Wall Street firm.' That's close enough." },
      { text: "Your firm sent a signing bonus the week of graduation. $15,000 in your account before you've drafted a single comp sheet. You spent some of it on a suit that actually fits. The rest is going toward New York rent." },
      { text: 'Two weeks from now you start training. Until then, you have nothing to do for the first time in years. It is the longest break you will get for a while.' },
    ],
  },

  // ════════ Week 1: ORIENTATION ════════
  {
    id: 'ib-y1-w1-orientation',
    career: 'ib',
    year: 1,
    week: 1,
    title: 'First day on the floor',
    shortLabel: 'Day one',
    type: 'narrative',
    scenes: [
      { text: 'You ride the elevator up with eleven other first-years. Nobody talks. Everyone has the same haircut and the same anxiety.' },
      { text: 'HR walks you through badges, laptops, expense systems. By 11am you have a Bloomberg login. By noon you have your desk.' },
      { speaker: 'Jordan Park', speakerTitle: 'Associate', speakerPersonaKey: 'assoc', text: "Hey, welcome. I'll be your associate on most of what hits this seat for the first few months. Settle in today. Tomorrow we get to work." },
      { speaker: 'Priya Raman', speakerTitle: 'Vice President', speakerPersonaKey: 'vp', text: "Couple of ground rules. One: respond to pings within ten minutes during the day. Two: don't ever lie to me about a number being checked when it isn't. Three: stay alive." },
    ],
    effects: {
      reputations: { assoc: 2, vp: 1 },
    },
  },

  // ════════ Week 2: TRAINING ════════
  {
    id: 'ib-y1-w2-training-excel',
    career: 'ib',
    year: 1,
    week: 2,
    title: 'Excel boot camp',
    shortLabel: 'Excel drill',
    type: 'training',
    skill: 'modeling',
    drillTitle: 'Modeling fundamentals: INDEX/MATCH, INDIRECT, sensitivity tables',
    drillDescription: "Two days of timed exercises in a windowless conference room. The instructor is an ex-VP who left for a hedge fund and came back to teach because he 'missed the rhythm.' You don't believe him. Five questions on the fundamentals every analyst needs cold.",
    staminaCost: 10,
    maxSkillGain: 6,
    questions: [
      {
        id: 'q1-vlookup-vs-index',
        prompt: 'Why do IB analysts prefer INDEX/MATCH over VLOOKUP?',
        choices: [
          { id: 'a', label: 'INDEX/MATCH executes faster on large datasets' },
          { id: 'b', label: 'INDEX/MATCH can look up to the left of the key column' },
          { id: 'c', label: "INDEX/MATCH doesn't break when columns are inserted or deleted between the key and the return column" },
          { id: 'd', label: 'Both B and C' },
        ],
        correctChoiceId: 'd',
        explanation: 'Both. VLOOKUP requires the return column to be to the right of the lookup column and hardcodes a column index, so inserting a column above breaks every formula referencing it. INDEX/MATCH is bidirectional and references column ranges by name, so it survives column shuffling. Speed is a tiny consideration on large models but not the main reason.',
      },
      {
        id: 'q2-index-match-application',
        prompt: 'Given the table below, which formula returns the company name for ticker "MSFT"?',
        context: '       A             B          C\n1      Company       Ticker     Price\n2      Apple         AAPL       180\n3      Microsoft     MSFT       420\n4      Alphabet      GOOGL      155',
        choices: [
          { id: 'a', label: '=VLOOKUP("MSFT", A2:B4, 1, FALSE)' },
          { id: 'b', label: '=INDEX(A2:A4, MATCH("MSFT", B2:B4, 0))' },
          { id: 'c', label: '=INDEX(B2:B4, MATCH("MSFT", A2:A4, 0))' },
          { id: 'd', label: '=MATCH("MSFT", B2:B4, 0)' },
        ],
        correctChoiceId: 'b',
        explanation: 'INDEX(A2:A4, MATCH("MSFT", B2:B4, 0)) finds the row where "MSFT" appears in the ticker column (B), then returns the value at that row in the company column (A). VLOOKUP cannot look to the left. Option C inverts the columns. Option D returns the position number, not the company.',
      },
      {
        id: 'q3-indirect-purpose',
        prompt: 'What does the INDIRECT function do?',
        choices: [
          { id: 'a', label: 'Returns the value of an indirect (calculated) cell' },
          { id: 'b', label: 'Converts a text string into a cell or range reference' },
          { id: 'c', label: 'Calculates indirect costs in a model' },
          { id: 'd', label: 'Creates a hyperlink between sheets' },
        ],
        correctChoiceId: 'b',
        explanation: 'INDIRECT takes a text string like "Sheet2!B5" or "A" & ROW() and converts it into a live reference. It is mostly used in IB to dynamically reference scenario sheets ("=INDIRECT($B$1 & \\"!C10\\")" picks the value from whichever sheet name is in B1). Powerful but volatile, so use sparingly.',
      },
      {
        id: 'q4-indirect-application',
        prompt: 'Cell A1 contains the text string "Sheet2!B5". Sheet2 cell B5 contains the number 100. What does =INDIRECT(A1) return?',
        choices: [
          { id: 'a', label: 'The text string "Sheet2!B5"' },
          { id: 'b', label: '100' },
          { id: 'c', label: '#REF! error' },
          { id: 'd', label: 'The cell address as a clickable link' },
        ],
        correctChoiceId: 'b',
        explanation: 'INDIRECT resolves the text in A1 ("Sheet2!B5") into a live reference, then returns the value at that reference. Sheet2!B5 = 100, so INDIRECT returns 100. This is the basis for scenario toggles, where a dropdown changes the sheet name and the model pulls from the matching scenario sheet.',
      },
      {
        id: 'q5-sensitivity-table',
        prompt: 'In an LBO model, a 2-variable sensitivity table on equity returns is most commonly built around:',
        choices: [
          { id: 'a', label: 'Revenue growth and EBITDA margin' },
          { id: 'b', label: 'Entry multiple and exit multiple' },
          { id: 'c', label: 'Tax rate and depreciation method' },
          { id: 'd', label: 'Working capital and capex' },
        ],
        correctChoiceId: 'b',
        explanation: 'Entry and exit multiples are the two biggest drivers of LBO equity returns. The classic LBO sensitivity table has entry multiple along one axis (typically the rows) and exit multiple along the other (columns), with MOIC or IRR populating the cells. Revenue growth and margins matter but feed indirectly through EBITDA; multiples directly determine purchase price and sale proceeds.',
      },
    ],
  },

  // ════════ Week 3: FIRST PING ════════
  {
    id: 'ib-y1-w3-first-ping',
    career: 'ib',
    year: 1,
    week: 3,
    title: 'Your first staffing ping',
    shortLabel: 'First ping',
    type: 'quick_decision',
    setup: "It's Wednesday 4:47pm. You're at your desk reading the FT. Your screen lights up with a Bloomberg IB from Anna Liu, the staffer.",
    speaker: 'Anna Liu',
    speakerTitle: 'Staffer',
    speakerPersonaKey: 'staffer',
    prompt: "Got a quick one for you. David is out at a dentist appointment. Marcus needs a one-page market update on industrial coatings for a pitch tomorrow morning. Two hours of work. Can you cover?",
    recommendedApproach: "Say yes clearly and ideally ask one sharp clarifying question (scope, format, intended audience). Don't lead with conflicting commitments or hedge. This is your first ping and Anna is gauging how you handle inbound work.",
    outcomes: [
      {
        key: 'eager-clarifying',
        description: 'Said yes clearly AND asked a useful clarifying question about scope, format, or detail level',
        narrative: "Anna sends the materials with the answer to your question. Your one-pager lands closer to what Marcus actually wanted. Priya notices the question.",
        effects: { skills: { memo: 2, voice: 1 }, stamina: -8, reputations: { staffer: 3, vp: 2, md: 1 } },
      },
      {
        key: 'eager',
        description: 'Said yes confidently but did not ask for any clarification on scope or format',
        narrative: "You take the work without asking for context. Anna sends the materials. You work until 9pm and turn in something serviceable. Marcus glances at it, nods, and moves on. Anna remembers you said yes fast.",
        effects: { skills: { memo: 1 }, stamina: -8, reputations: { staffer: 4, md: 1 } },
      },
      {
        key: 'hedging',
        description: 'Said yes but with hedging, mentioned conflicting commitments, or wasted time before committing',
        narrative: "You technically said yes but you led with a hedge. Anna sighs. The work gets done late and Marcus is mildly irritated. Anna files you mentally under needs management.",
        effects: { skills: { memo: 1 }, stamina: -6, reputations: { staffer: -3 } },
      },
      {
        key: 'refused',
        description: 'Said no, declined the work, or refused to take it',
        narrative: "Anna stares at her screen for a long moment. 'OK, I'll find someone else.' She doesn't say it warmly. The staffer remembers.",
        effects: { reputations: { staffer: -8, vp: -3 } },
      },
    ],
    defining: true,
  },

  // ════════ Week 4: FIRST LIVE DEAL ════════
  {
    id: 'ib-y1-w4-live-deal-intro',
    career: 'ib',
    year: 1,
    week: 4,
    title: 'Project Atlas',
    shortLabel: 'Atlas kickoff',
    type: 'narrative',
    scenes: [
      { speaker: 'Jordan Park', speakerTitle: 'Associate', speakerPersonaKey: 'assoc', text: "Welcome to your first live deal. Project Atlas, vertical SaaS construction software, $400M EV. We're pitching sell-side. Marcus wants a paper LBO and a comp set on my desk by EOD." },
      { speaker: 'Jordan Park', speakerTitle: 'Associate', speakerPersonaKey: 'assoc', text: "I'll send over the kickoff materials in five. Don't overthink the LBO. Just get the math right." },
      { text: "You open your notebook to a clean page and write 'Project Atlas' at the top. Real deal. Real numbers. First analyst rep." },
    ],
  },

  // The first major deliverable hooks into the existing IB_3 scenario,
  // which has both a comp set and a paper LBO.
  {
    id: 'ib-y1-w4-deliverable-atlas',
    career: 'ib',
    year: 1,
    week: 4,
    title: 'Atlas: comp set and paper LBO',
    shortLabel: 'Atlas deliverables',
    type: 'major_deliverable',
    scenarioCareerId: 'ib',
    scenarioId: 'ib-3',
    passThreshold: 6,
    effectsOnPass: {
      skills: { modeling: 4, commercial: 2 },
      stamina: -15,
      reputations: { assoc: 5, vp: 3, md: 2 },
      badges: ['First Live Deal'],
      signatureMoment: {
        title: 'First analyst rep',
        body: 'Comp set and paper LBO on Project Atlas. Jordan sent them up the chain without changes.',
      },
    },
    effectsOnFail: {
      skills: { modeling: 1 },
      stamina: -18,
      reputations: { assoc: -3, vp: -2 },
    },
    defining: true,
  },

  // ════════ Week 5: FEEDBACK ════════
  {
    id: 'ib-y1-w5-feedback',
    career: 'ib',
    year: 1,
    week: 5,
    title: 'Coffee with Priya',
    shortLabel: 'VP coffee',
    type: 'quick_decision',
    setup: "Priya stopped by your desk Friday afternoon. 'Walk down to the lobby with me.' You ride the elevator with her and stand in the Starbucks line.",
    speaker: 'Priya Raman',
    speakerTitle: 'Vice President',
    speakerPersonaKey: 'vp',
    prompt: "You're three weeks in. What do you think you're good at, and what do you think you need to work on? Be honest. I'd rather hear it from you than tell you.",
    recommendedApproach: "Be specific on both sides. Cite a real strength (something tangible you've done) and a real weakness (a recent mistake or area you're actively working on). Avoid humble-brags like 'I work too hard.' Avoid deflection like 'still getting up to speed.'",
    outcomes: [
      {
        key: 'self-aware',
        description: 'Named a specific real weakness AND a specific real strength, demonstrating genuine reflection',
        narrative: "Priya nods. 'That's the right answer. Most people give me the I-work-too-hard bullshit. Keep doing what you said you're good at. Work on what you said you need to. Easy.'",
        effects: { skills: { voice: 3, commercial: 1 }, reputations: { vp: 6 } },
      },
      {
        key: 'partial',
        description: 'Was specific on one side (strength OR weakness) but generic on the other',
        narrative: "Priya gives a small nod. 'Half-credit. Work on the part you didn't have an answer for. Try me again in a few weeks.'",
        effects: { skills: { voice: 1 }, reputations: { vp: 2 } },
      },
      {
        key: 'humble-brag',
        description: 'Gave a humble-brag answer like work-life balance, or made it sound like a strength disguised as a weakness',
        narrative: "Priya sips her coffee. 'That's not a weakness. That's the entire job description. Try again next time.' She doesn't say it mean. She also doesn't say it nicely.",
        effects: { reputations: { vp: -2 } },
      },
      {
        key: 'deflect',
        description: 'Deflected, said too early to say, or gave a non-answer',
        narrative: "Priya shrugs. 'Fair. Ask me in another month then.' She doesn't take you seriously after this.",
        effects: { reputations: { vp: -1 } },
      },
    ],
  },

  // ════════ Weeks 6-7: CRUNCH (time skip + decision) ════════
  {
    id: 'ib-y1-w6-crunch-skip',
    career: 'ib',
    year: 1,
    week: 6,
    title: 'Atlas drags on',
    shortLabel: 'Slow week',
    type: 'time_skip',
    weeksAdvanced: 1,
    blurb: 'Atlas turned out to be a longer process than the team thought. You spend the week chasing comps, refreshing trading multiples, and rebuilding a sensitivity table three times.',
    effects: {
      skills: { modeling: 1 },
      stamina: -5,
    },
  },

  {
    id: 'ib-y1-w7-second-deal-ping',
    career: 'ib',
    year: 1,
    week: 7,
    title: 'Cross-staffing decision',
    shortLabel: 'Second deal?',
    type: 'quick_decision',
    setup: "You're already on Atlas. Then Anna pings you Sunday night.",
    speaker: 'Anna Liu',
    speakerTitle: 'Staffer',
    speakerPersonaKey: 'staffer',
    prompt: "Need someone on a new pitch. Hit-the-ground-running. Healthcare RCM, sell-side mandate. You'd be the second analyst. I know you're on Atlas. Want it or pass?",
    recommendedApproach: "Be decisive either way. A clear yes shows hunger but stretches you thin and risks Atlas quality. A clear no shows judgment but signals risk aversion. Either real answer is better than 'I guess if you really need me' or hedging the decision back onto Anna.",
    outcomes: [
      {
        key: 'decisive-yes',
        description: 'Said yes clearly, took the second deal, owned the workload',
        narrative: "You take both deals. You stop sleeping for the next two weeks. Atlas suffers a little. The pitch goes fine. Anna marks you as someone who says yes.",
        effects: { stamina: -25, reputations: { staffer: 5, vp: -1 }, skills: { commercial: 1 } },
      },
      {
        key: 'decisive-no',
        description: 'Said no clearly with a reasonable rationale (Atlas focus, quality, capacity)',
        narrative: "Anna respects the answer. Priya later mentions it offhand: 'Good call. Most first-years take everything. The ones who survive learn to say no.'",
        effects: { reputations: { staffer: 1, vp: 4 } },
      },
      {
        key: 'wavering',
        description: 'Did not pick a clear direction, hedged, or put the decision back on Anna',
        narrative: "Anna decides for you. She puts you on it. Now you're on both. You weren't decisive. The next staffing she'll make the call without asking.",
        effects: { stamina: -20, reputations: { staffer: -1, vp: -2 } },
      },
    ],
    defining: true,
  },

  // ════════ Week 8: ALL-NIGHTER ════════
  {
    id: 'ib-y1-w8-all-nighter',
    career: 'ib',
    year: 1,
    week: 8,
    title: 'Wednesday night, 2:47am',
    shortLabel: 'All-nighter',
    type: 'narrative',
    scenes: [
      { text: "Priya's red turn comments came back at 11:30pm. Forty-three of them. The deck has to be in the printer by 8am for Marcus to take to a client breakfast." },
      { speaker: 'Jordan Park', speakerTitle: 'Associate', speakerPersonaKey: 'assoc', text: "I'll take the first half. You take the second half. We re-merge at 5. Don't fall asleep." },
      { text: "You order a third coffee from the all-night deli. The bullpen is empty except for you, Jordan, and one analyst three rows over crying quietly into a paper towel." },
      { text: "By 6am the deck is done. By 6:30 you've sent it to the printer. By 7:15 you're in the bathroom changing into the spare shirt you keep in your drawer." },
      { text: "By 8:01 the deck is in the client's hands. Marcus walks back into the office at 10am, sees you at your desk, and nods once. That's the closest thing to praise you'll get this week." },
    ],
    effects: {
      stamina: -25,
      skills: { memo: 2, voice: 1 },
      reputations: { vp: 3, md: 2, assoc: 2 },
      badges: ['First All-Nighter'],
    },
    defining: true,
  },

  // ════════ Week 9: WEEKEND DECISION ════════
  {
    id: 'ib-y1-w9-weekend',
    career: 'ib',
    year: 1,
    week: 9,
    title: 'Friday afternoon',
    shortLabel: 'How to weekend',
    type: 'quick_decision',
    setup: "The deck shipped. Atlas is in a quiet stretch. Jordan tells you to take the weekend.",
    speaker: 'Jordan Park',
    speakerTitle: 'Associate',
    speakerPersonaKey: 'assoc',
    prompt: "Take the weekend. You earned it. What are you actually going to do with it?",
    recommendedApproach: "There's no universally right answer. Rest restores stamina. Networking builds rep with peers. Technical refresh builds skills. Quietly working through the weekend builds nothing but anxiety and a flag with the VP.",
    outcomes: [
      {
        key: 'recover',
        description: 'Resting, sleeping, doing non-work activities to recharge',
        narrative: "You recover. Sunday night you feel human again. Monday you show up sharp.",
        effects: { stamina: 30 },
      },
      {
        key: 'networking',
        description: 'Drinks, social, or networking with other bankers, associates, or peers',
        narrative: "You spend a few hours at a bar in Tribeca learning what other groups are really like. One person flags an opening that might come up next quarter. You file it.",
        effects: { stamina: 15, skills: { voice: 2, commercial: 1 }, reputations: { analyst_class: 4 } },
      },
      {
        key: 'study',
        description: 'Working on technical, modeling, or accounting refresh / studying',
        narrative: "You're sharper on the technicals Monday morning. But you didn't really rest.",
        effects: { stamina: 5, skills: { modeling: 3, memo: 1 } },
      },
      {
        key: 'work-ahead',
        description: 'Quietly working on Atlas or current deal work despite being told to take the weekend',
        narrative: "You make some progress. Monday Jordan notices. He doesn't say anything but he notices. Priya later asks why you didn't take the weekend. You don't have a good answer.",
        effects: { stamina: -8, skills: { modeling: 2 }, reputations: { assoc: 1, vp: -2 } },
      },
    ],
  },

  // ════════ Week 10: MID-QUARTER REVIEW WITH VP ════════
  {
    id: 'ib-y1-w10-vp-checkin',
    career: 'ib',
    year: 1,
    week: 10,
    title: 'Mid-quarter check-in with Priya',
    shortLabel: 'VP check-in',
    type: 'evaluation',
    evaluator: 'Priya Raman',
    evaluatorTitle: 'Vice President',
    prompts: [
      'You sit across from Priya in a small conference room. She has a notebook open with handwritten notes about you from the past ten weeks.',
      "She reviews where you've been strong, where you've been weak, and what she expects in the next ten weeks. The system reads your stats and your reputation with Priya to generate her actual feedback.",
      "This is not a make-or-break moment. It's a temperature check. But she'll remember what you said in here when bonus season comes.",
    ],
  },

];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getStartingSkills(): Skills {
  return { modeling: 60, memo: 60, commercial: 60, voice: 60 };
}

export function applyBackgroundBonus(skills: Skills, backgroundId: string): Skills {
  const bg = BACKGROUNDS.find(b => b.id === backgroundId);
  if (!bg) return skills;
  return {
    modeling: skills.modeling + (bg.bonus.modeling || 0),
    memo: skills.memo + (bg.bonus.memo || 0),
    commercial: skills.commercial + (bg.bonus.commercial || 0),
    voice: skills.voice + (bg.bonus.voice || 0),
  };
}

export function computeOverall(skills: Skills): number {
  return Math.round((skills.modeling + skills.memo + skills.commercial + skills.voice) / 4);
}

export function clampSkill(n: number): number {
  return Math.min(99, Math.max(40, n));
}

export function clampStamina(n: number): number {
  return Math.min(100, Math.max(0, n));
}

export function getEventsForCareer(career: CareerId): CareerEvent[] {
  if (career === 'ib') return IB_YEAR_1_EVENTS;
  return []; // other careers added in subsequent batches
}

export function getNextEvent(save: PlayerSave): CareerEvent | null {
  const events = getEventsForCareer(save.career);
  // Find the first event whose week >= currentWeek and id isn't in completedEventIds.
  const upcoming = events
    .filter(e => e.year === save.currentYear)
    .filter(e => !save.completedEventIds.includes(e.id))
    .sort((a, b) => a.week - b.week || (a.id < b.id ? -1 : 1));
  return upcoming[0] || null;
}

export function applyEffects(save: PlayerSave, effects: EventEffects | undefined, eventWeek: number, eventTitle: string): PlayerSave {
  if (!effects) return save;
  const newSkills = { ...save.skills };
  if (effects.skills) {
    for (const k of ['modeling', 'memo', 'commercial', 'voice'] as SkillId[]) {
      if (effects.skills[k]) newSkills[k] = clampSkill(newSkills[k] + (effects.skills[k] || 0));
    }
  }
  const newStamina = clampStamina(save.stamina + (effects.stamina || 0));
  const newReps = { ...save.reputations };
  if (effects.reputations) {
    for (const [k, v] of Object.entries(effects.reputations)) {
      newReps[k] = Math.min(100, Math.max(-100, (newReps[k] || 0) + v));
    }
  }
  const newBadges = [...save.badges];
  if (effects.badges) {
    for (const b of effects.badges) {
      if (!newBadges.includes(b)) newBadges.push(b);
    }
  }
  const newMoments = [...save.signatureMoments];
  if (effects.signatureMoment) {
    newMoments.push({
      id: `mom-${Date.now()}`,
      week: eventWeek,
      year: save.currentYear,
      title: effects.signatureMoment.title,
      body: effects.signatureMoment.body,
    });
  }
  return {
    ...save,
    skills: newSkills,
    stamina: newStamina,
    reputations: newReps,
    badges: newBadges,
    signatureMoments: newMoments,
  };
}

// Sanity: every major_deliverable must reference a real scenario.
// This runs at import time in dev to catch typos.
if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
  for (const ev of IB_YEAR_1_EVENTS) {
    if (ev.type === 'major_deliverable') {
      const bucket = REPS_SCENARIOS[ev.scenarioCareerId];
      const scen = bucket?.find(s => s.id === ev.scenarioId);
      if (!scen) {
        // eslint-disable-next-line no-console
        console.warn(`[career-data] major_deliverable ${ev.id} references missing scenario ${ev.scenarioCareerId}/${ev.scenarioId}`);
      }
    }
  }
}
