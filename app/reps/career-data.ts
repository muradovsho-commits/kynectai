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

export const SCHOOLS = [
  'Wharton', 'Harvard', 'Stanford', 'NYU Stern', 'Columbia', 'MIT Sloan',
  'Chicago Booth', 'Yale', 'Cornell Dyson', 'Michigan Ross', 'Berkeley Haas',
  'Georgetown McDonough', 'Duke Fuqua', 'UVA McIntire', 'UNC Kenan-Flagler',
  'Notre Dame Mendoza', 'Ohio State Fisher', 'UT Austin McCombs', 'Other',
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
// feels meaningful. Order within each career roughly mirrors street reputation
// but isn't prescriptive; players should pick the firm whose vibe they want.

export type FirmOption = {
  name: string;
  tagline: string;
  accent: string;
};

export const FIRMS_BY_CAREER: Record<CareerId, FirmOption[]> = {
  ib: [
    { name: 'Goldman Sachs',       tagline: 'The brand. Big deals, deep bench, a culture that\'s as much a religion as a job.',                    accent: '#7c2d12' },
    { name: 'Morgan Stanley',      tagline: 'Bulge bracket counterweight to Goldman. Strong M&A, strong tech coverage, slightly more humane.',       accent: '#1e40af' },
    { name: 'JPMorgan',            tagline: 'The biggest balance sheet on the street. Lev fin and M&A both heavy. The institution that won 2008.',  accent: '#1f2937' },
    { name: 'Evercore',            tagline: 'Top advisory boutique. M&A focus, smaller class sizes, more direct senior banker exposure.',           accent: '#365314' },
    { name: 'Centerview Partners', tagline: 'Lean elite. ~80 partners. The pay is mythical and the hours are too. You get smart fast.',             accent: '#1e3a8a' },
    { name: 'Lazard',              tagline: 'The old-money advisory house. Restructuring expertise, European reach, cerebral culture.',             accent: '#581c87' },
    { name: 'PJT Partners',        tagline: 'Spin-out from Blackstone. Strong restructuring and strategic advisory. Newer brand, sharp culture.',   accent: '#0c4a6e' },
    { name: 'Moelis & Company',    tagline: 'M&A-heavy advisory boutique. Lean teams, founder-led, deals get done.',                                accent: '#7e22ce' },
  ],
  pe: [
    { name: 'KKR',             tagline: 'Mega-fund. Industrials and tech heavy. The original buyout shop.',           accent: '#1f2937' },
    { name: 'Blackstone',      tagline: 'Largest alternative asset manager on earth. Real estate, PE, credit, all of it.', accent: '#1e3a8a' },
    { name: 'Apollo',          tagline: 'Distressed and credit DNA. Aggressive, contrarian, value-oriented.',           accent: '#7c2d12' },
    { name: 'Carlyle',         tagline: 'Washington-rooted. Aerospace, defense, government-adjacent exposure.',         accent: '#365314' },
    { name: 'Bain Capital',    tagline: 'Spun out of Bain & Co. Consulting-heavy diligence culture.',                    accent: '#7e22ce' },
    { name: 'TPG',             tagline: 'Mid-market and growth equity strong. Bay Area-leaning, healthcare/tech tilt.', accent: '#0c4a6e' },
    { name: 'Warburg Pincus',  tagline: 'Growth-focused, longer hold periods. Healthcare and financial services depth.', accent: '#581c87' },
    { name: 'Vista Equity',    tagline: 'B2B software specialist. Operationally intense, data-driven post-close.',      accent: '#7c3aed' },
  ],
  consulting: [
    { name: 'McKinsey',         tagline: 'The brand. Generalist firm, every industry, the broadest senior partner network.',         accent: '#0c4a6e' },
    { name: 'Bain & Company',   tagline: 'PE-adjacent culture. Results-oriented, smaller, tighter, friendlier than McK or BCG.',     accent: '#dc2626' },
    { name: 'BCG',              tagline: 'Strategy-heavy. Tech and digital practice especially strong, more intellectual culture.',  accent: '#16a34a' },
    { name: 'Oliver Wyman',     tagline: 'Financial services specialist. Lean teams, deep technical work.',                          accent: '#1e3a8a' },
    { name: 'L.E.K. Consulting',tagline: 'Healthcare and life sciences depth. Smaller than MBB, sharper focus.',                     accent: '#7c2d12' },
  ],
  rx: [
    { name: 'Lazard Restructuring',     tagline: 'The legacy debtor advisor. Largest, most established, every major bankruptcy.', accent: '#581c87' },
    { name: 'PJT RSSG',                 tagline: 'Aggressive new entrant. Picked up share fast. Sharp, ambitious team.',           accent: '#0c4a6e' },
    { name: 'Houlihan Lokey',           tagline: 'Mid-market restructuring king. Volume play, more deals than anyone.',           accent: '#365314' },
    { name: 'Centerview Restructuring', tagline: 'Lean elite, creditor-side focus, top-tier creditor advisory.',                   accent: '#1e3a8a' },
    { name: 'Moelis Rx',                tagline: 'Strong sponsor and creditor work. Founder-led culture extends here too.',       accent: '#7e22ce' },
  ],
  st: [
    { name: 'Goldman Sachs S&T',         tagline: 'The flow shop. Massive footprint across every product.',              accent: '#7c2d12' },
    { name: 'Morgan Stanley S&T',        tagline: 'Equities-strong. Prime brokerage, derivatives, more cerebral.',       accent: '#1e40af' },
    { name: 'JPMorgan Markets',          tagline: 'Rates and credit dominant. Largest dealer across most products.',     accent: '#1f2937' },
    { name: 'Citi Markets',              tagline: 'Global footprint, EM and FX strength, scrappier US presence.',        accent: '#0c4a6e' },
    { name: 'Bank of America Securities',tagline: 'Credit strong, growing equities, balance sheet behind you.',          accent: '#581c87' },
  ],
  am: [
    { name: 'BlackRock',           tagline: 'Largest asset manager on the planet. Passive and active, ETF dominance.',  accent: '#1f2937' },
    { name: 'Fidelity',            tagline: 'Mutual fund and active equity stronghold. Long-tenured PMs, less politics.', accent: '#16a34a' },
    { name: 'T. Rowe Price',       tagline: 'Active management traditionalist. Research-driven, lower turnover culture.', accent: '#7c2d12' },
    { name: 'Capital Group',       tagline: 'Multi-manager system. American Funds. Private, partnership culture.',       accent: '#1e3a8a' },
    { name: 'Wellington Management',tagline: 'Boston blue-blood. Long-only, deep research, employee-owned partnership.', accent: '#581c87' },
  ],
  vc: [
    { name: 'Sequoia Capital',         tagline: 'The dynasty. Seed to growth. Every legendary outcome of the last 40 years.',  accent: '#dc2626' },
    { name: 'Andreessen Horowitz',     tagline: 'Crypto, infrastructure, and platform plays. Big bets, public personalities.', accent: '#1e3a8a' },
    { name: 'Benchmark',               tagline: 'Five-partner shop. Equal economics. Smaller fund sizes by design.',           accent: '#1f2937' },
    { name: 'Accel',                   tagline: 'SaaS and enterprise. Series A specialist, long history, top of the league tables.', accent: '#365314' },
    { name: 'Lightspeed Venture Partners', tagline: 'Multi-stage, consumer and enterprise both. Global reach.',                accent: '#7e22ce' },
    { name: 'Insight Partners',        tagline: 'Growth equity at scale. Software-only, hands-on portfolio operations.',       accent: '#0c4a6e' },
  ],
  re: [
    { name: 'Blackstone Real Estate', tagline: 'Largest CRE investor in the world. Across every property type.',            accent: '#1e3a8a' },
    { name: 'Brookfield',             tagline: 'Real assets generalist. Real estate, infrastructure, renewables.',          accent: '#365314' },
    { name: 'Starwood Capital',       tagline: 'Opportunistic capital, hotels and multifamily expertise.',                  accent: '#7c2d12' },
    { name: 'KKR Real Estate',        tagline: 'Newer entrant but moving fast. Aggressive acquisitions in core-plus space.', accent: '#1f2937' },
    { name: 'Carlyle Real Estate',    tagline: 'Smaller real estate platform inside a mega-PE. Focused, less crowded.',     accent: '#581c87' },
  ],
  er: [
    { name: 'Goldman Sachs Research',   tagline: 'Top-ranked across most sectors. The franchise that sets the tone.',           accent: '#7c2d12' },
    { name: 'Morgan Stanley Research',  tagline: 'Tech and global macro especially strong. Slightly more cerebral house.',      accent: '#1e40af' },
    { name: 'JPMorgan Research',        tagline: 'Broad coverage, banks and consumer dominant. Institutional client breadth.',  accent: '#1f2937' },
    { name: 'Wells Fargo Securities',   tagline: 'Solid mid-tier sellside. Energy, REITs, financials core.',                    accent: '#dc2626' },
    { name: 'Evercore ISI',             tagline: 'Independent advisory firm with a top-ranked research arm. Lean, well-paid.',  accent: '#365314' },
  ],
  audit: [
    { name: 'Deloitte',       tagline: 'Largest of the Big Four by revenue. Broad practice across audit, tax, consulting.', accent: '#16a34a' },
    { name: 'PwC',            tagline: 'Audits roughly half the Fortune 500. Brand consistency, large global engagements.', accent: '#7c2d12' },
    { name: 'EY',             tagline: 'Building consulting fast. Strong financial services and tech audit practices.',     accent: '#1e3a8a' },
    { name: 'KPMG',           tagline: 'Often considered the smallest of the Big Four. Strong banking and insurance audit.', accent: '#0c4a6e' },
    { name: 'Grant Thornton', tagline: 'Mid-market specialist. Less prestige, smaller engagements, faster career mobility.', accent: '#581c87' },
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
  speaker?: string;
  speakerTitle?: string;
  speakerPersonaKey?: string;
  prompt: string;
  options: {
    id: string;
    label: string;
    consequence: string;
    effects?: EventEffects;
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

export type TrainingEvent = EventBase & {
  type: 'training';
  skill: SkillId;
  drillTitle: string;
  drillDescription: string;
  staminaCost: number;
  skillGain: number;
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
    drillTitle: 'Modeling fundamentals: index/match, INDIRECT, sensitivity tables',
    drillDescription: "Two days of timed exercises in a windowless conference room. The instructor is an ex-VP who left for a hedge fund and came back to teach because he 'missed the rhythm.' You don't believe him.",
    staminaCost: 10,
    skillGain: 4,
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
    options: [
      {
        id: 'eager',
        label: '"On it. Send me what you have."',
        consequence: "You take the work. Anna sends the materials. You work until 9pm and turn in something serviceable. Marcus glances at it, nods, and moves on. Anna remembers you said yes fast.",
        effects: {
          skills: { memo: 1 },
          stamina: -8,
          reputations: { staffer: 4, md: 1 },
        },
      },
      {
        id: 'clarify',
        label: '"Yes. Quick question: what level of detail does Marcus want? Two pages with comps or a one-pager?"',
        consequence: "You ask the right clarifying question. Anna gives you the answer. Your one-pager lands closer to what Marcus actually wanted. Priya notices the question.",
        effects: {
          skills: { memo: 2, voice: 1 },
          stamina: -8,
          reputations: { staffer: 3, vp: 2, md: 1 },
        },
      },
      {
        id: 'deflect',
        label: '"I have a training session at 6pm I was planning to attend, but I can squeeze it in after."',
        consequence: "You technically said yes but you led with a hedge. Anna sighs. The work gets done late and Marcus is mildly irritated. Anna files you mentally under 'needs management.'",
        effects: {
          skills: { memo: 1 },
          stamina: -6,
          reputations: { staffer: -3 },
        },
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
    options: [
      {
        id: 'self-aware',
        label: 'Name a real weakness (a recent mistake) and a real strength (specific, not generic).',
        consequence: "Priya nods. 'That's the right answer. Most people give me the 'I work too hard' bullshit. Keep doing what you said you're good at. Work on what you said you need to. Easy.'",
        effects: {
          skills: { voice: 3, commercial: 1 },
          reputations: { vp: 6 },
        },
      },
      {
        id: 'humble-brag',
        label: '"I think I work really hard, sometimes too hard. Maybe my weakness is I struggle with work-life balance."',
        consequence: "Priya sips her coffee. 'That's not a weakness. That's the entire job description. Try again next time.' She doesn't say it mean. She also doesn't say it nicely.",
        effects: {
          reputations: { vp: -2 },
        },
      },
      {
        id: 'deflect',
        label: '"Honestly I think I\'m still getting up to speed. Hard to say yet."',
        consequence: "Priya shrugs. 'Fair. Ask me in another month then.' She doesn't take you seriously after this.",
        effects: {
          reputations: { vp: -1 },
        },
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
    options: [
      {
        id: 'take-both',
        label: '"Take it. I can handle both."',
        consequence: "You take both deals. You stop sleeping for the next two weeks. Atlas suffers a little. The pitch goes fine. Anna marks you as someone who says yes.",
        effects: {
          stamina: -25,
          reputations: { staffer: 5, vp: -1 },
          skills: { commercial: 1 },
        },
      },
      {
        id: 'pass-honest',
        label: '"Pass. Atlas is heating up and I want to do it well, not split focus."',
        consequence: "Anna respects the answer. Priya later mentions it offhand: 'Good call. Most first-years take everything. The ones who survive learn to say no.' You stay focused on Atlas.",
        effects: {
          reputations: { staffer: 1, vp: 4 },
        },
      },
      {
        id: 'pass-soft',
        label: '"I can if you really need me, but I\'m worried about Atlas quality."',
        consequence: "Anna decides for you. She puts you on it. Now you're on both. You weren't decisive. The next staffing she'll make the call without asking.",
        effects: {
          stamina: -20,
          reputations: { staffer: -1, vp: -2 },
        },
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
    prompt: "What do you do with the first real weekend in eight weeks?",
    options: [
      {
        id: 'recover',
        label: 'Sleep, walk in the park, do absolutely nothing finance-related.',
        consequence: "You recover. Sunday night you feel human again. Monday you show up sharp.",
        effects: {
          stamina: 30,
        },
      },
      {
        id: 'networking',
        label: 'Grab drinks with two associates from another group on Saturday night.',
        consequence: "You spend three hours at a bar in Tribeca learning what the M&A group is really like. One of them flags an opening that might come up next quarter. You file it.",
        effects: {
          stamina: 15,
          skills: { voice: 2, commercial: 1 },
          reputations: { analyst_class: 4 },
        },
      },
      {
        id: 'study',
        label: 'Spend Saturday going through accounting / modeling refreshers.',
        consequence: "You're sharper on the technicals Monday morning. But you didn't really rest.",
        effects: {
          stamina: 5,
          skills: { modeling: 3, memo: 1 },
        },
      },
      {
        id: 'work-ahead',
        label: 'Quietly work on Atlas, even though Jordan said you didn\'t have to.',
        consequence: "You make some progress. Monday Jordan notices. He doesn't say anything but he notices. Priya later asks why you didn't take the weekend. You don't have a good answer.",
        effects: {
          stamina: -8,
          skills: { modeling: 2 },
          reputations: { assoc: 1, vp: -2 },
        },
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
