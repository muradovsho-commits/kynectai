// Reps - Day-in-the-Life Career Simulator Data

export type Persona = {
  id: string;
  name: string;
  title: string;
  firm: string;
  firmType: string;
  style: string; // personality description for AI prompt
  avatar: string; // initials
  color: string;
};

export type ScenarioStep = {
  id: string;
  type: 'message' | 'task' | 'call' | 'decision' | 'deliverable' | 'review' | 'interrupt';
  persona: string; // persona id
  content: string; // the prompt/situation description
  deliverableType?: 'excel' | 'word' | 'ppt' | 'memo' | 'analysis' | 'note' | 'model';
  timeLabel?: string; // e.g. "9:15 AM", "2:30 PM"
  branchOn?: string; // decision that changes flow
};

export type Scenario = {
  id: string;
  career: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  difficulty: 'Moderate' | 'Challenging' | 'Intense';
  personas: Persona[];
  context: string; // background info fed to AI
  steps: ScenarioStep[];
};

export type CareerTrack = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  icon: string;
  scenarios: Scenario[];
};

// ============================================================
// CAREER TRACKS
// ============================================================

export const CAREERS: CareerTrack[] = [
  {
    id: 'ib',
    title: 'Investment Banking',
    subtitle: 'Analyst',
    description: 'Live M&A pitches, fairness opinions, and the Tuesday-night deal sprint. Build comps, draft one-pagers, and manage an MD who changes their mind at 9pm.',
    color: '#3b82f6',
    icon: 'chart',
    scenarios: [
      {
        id: 'ib-1',
        career: 'ib',
        title: 'Tuesday on a Live M&A Pitch',
        subtitle: 'Bulge Bracket, TMT Group',
        description: 'Your VP needs a refreshed comp set and a one-page teaser by tomorrow morning. The MD just called with a new angle on the deal thesis. Your associate is on another deal. You are alone.',
        duration: '30-40 min',
        difficulty: 'Challenging',
        context: `You are a first-year Investment Banking Analyst at a bulge bracket bank in the TMT group. It is Tuesday, 3:00 PM. You are staffed on Project Lighthouse - a potential sell-side mandate for a $2B enterprise value SaaS company (CloudVault, a cloud security platform) considering a sale process. The company has $280M revenue growing 25% YoY, 18% EBITDA margins expanding, and strong net retention. Key peers include CrowdStrike, Palo Alto, Zscaler, SentinelOne, and Fortinet. The pitch is Thursday at 2pm. Your VP needs a refreshed trading comps analysis and a one-page company overview/teaser. You have the company's latest financials and a prior comp set that's 2 months old.`,
        personas: [
          { id: 'ib1-vp', name: 'Sarah Chen', title: 'Vice President', firm: 'Goldman Sachs', firmType: 'Bulge Bracket', style: 'Precise, efficient, expects clean work on first pass. Communicates in short, direct messages. Will mark up your work with specific feedback. Does not tolerate sloppy formatting.', avatar: 'SC', color: '#3b82f6' },
          { id: 'ib1-md', name: 'James Whitfield', title: 'Managing Director', firm: 'Goldman Sachs', firmType: 'Bulge Bracket', style: 'Big-picture thinker who changes direction frequently. Calls instead of messages. Expects you to figure out details yourself. Friendly but demanding. Will test your commercial awareness with quick questions.', avatar: 'JW', color: '#1d4ed8' },
          { id: 'ib1-assoc', name: 'Kevin Park', title: 'Associate', firm: 'Goldman Sachs', firmType: 'Bulge Bracket', style: 'Your direct supervisor but currently slammed on another deal. Helpful but distracted. Responds in short bursts. Will check in on your progress periodically.', avatar: 'KP', color: '#60a5fa' },
        ],
        steps: [
          { id: 's1', type: 'message', persona: 'ib1-vp', content: 'Hey - need you to refresh the CloudVault comp set. The old one is stale. Pull current trading data for the peer group we discussed (CRWD, PANW, ZS, S, FTNT). Need EV/Revenue, EV/EBITDA, and EV/FCF for CY and NY. Also need a clean one-pager - company overview, key metrics, investment highlights. Pitch is Thursday 2pm. Can you have both to me by tonight?', timeLabel: '3:05 PM' },
          { id: 's2', type: 'decision', persona: 'ib1-vp', content: 'How do you respond to the VP about the timeline?', timeLabel: '3:06 PM' },
          { id: 's3', type: 'task', persona: 'ib1-vp', content: 'Start building the comparable companies analysis. Think about the right peer set, the right metrics, and how CloudVault stacks up. What trading multiples would you expect for a $280M revenue, 25% growth, 18% margin SaaS security company?', timeLabel: '3:30 PM', deliverableType: 'analysis' },
          { id: 's4', type: 'interrupt', persona: 'ib1-md', content: 'Quick question - I just got off a call. The client is now thinking about a dual-track process - IPO alongside the M&A. How does that change how we position them? Think about what that means for valuation and the comp set. Also - I want you to add a section to the one-pager about "Why Now" for the sale. Three bullets, make them compelling. Call me when you have thoughts.', timeLabel: '4:15 PM' },
          { id: 's5', type: 'decision', persona: 'ib1-md', content: 'The MD wants your thoughts on the dual-track positioning. What do you tell him?', timeLabel: '4:20 PM' },
          { id: 's6', type: 'message', persona: 'ib1-assoc', content: 'Hey, just checking in. How are you doing on the comps? Make sure the formatting matches our standard template - blue headers, gray alternating rows, sources at the bottom. And double-check your calendarization - some of these companies have weird fiscal years. Ill try to review later tonight if you send by 9.', timeLabel: '5:45 PM' },
          { id: 's7', type: 'deliverable', persona: 'ib1-vp', content: 'Time to put it all together. Draft your one-page company overview for CloudVault. It should include: Company overview (what they do, key stats), Key investment highlights (3-4 bullets), Financial snapshot (revenue, growth, margins), and the "Why Now" section the MD requested. Keep it to one page. Every word matters.', timeLabel: '7:00 PM', deliverableType: 'memo' },
          { id: 's8', type: 'review', persona: 'ib1-vp', content: 'The VP reviews your work and provides feedback. She will evaluate the comp set logic and the one-pager quality.', timeLabel: '9:00 PM' },
          { id: 's9', type: 'message', persona: 'ib1-md', content: 'One more thing before you send the final - the client CEO mentioned they just signed a $40M contract with a Fortune 50 company. Make sure that shows up somewhere prominent. Good work getting this together.', timeLabel: '9:30 PM' },
        ],
      },
      {
        id: 'ib-2',
        career: 'ib',
        title: 'Thursday All-Nighter on a Fairness Opinion',
        subtitle: 'Elite Boutique, M&A',
        description: 'The board meets Monday. The fairness opinion needs to go to the printer Friday. Your DCF has an error. The MD wants a new sensitivity table. You are running on coffee.',
        duration: '35-45 min',
        difficulty: 'Intense',
        context: `You are a first-year Analyst at Centerview Partners working on a fairness opinion for a $5.2B take-private of MedTech Corp by a PE consortium. The board vote is Monday. The opinion needs to go to the printer Friday afternoon. It is Thursday, 8:00 PM. You just found a potential error in your DCF terminal value calculation. Your VP wants a new sensitivity table with additional scenarios. The transaction price is $78 per share. Your DCF range currently shows $72-$85. Key assumptions: 7% revenue growth declining to 4%, 22% EBITDA margins expanding to 25%, WACC of 9.5%, terminal growth rate of 2.5%.`,
        personas: [
          { id: 'ib2-vp', name: 'Michael Torres', title: 'Vice President', firm: 'Centerview Partners', firmType: 'Elite Boutique', style: 'Extremely detail-oriented. Will challenge every assumption. Known for sending marked-up pages at 2am. Expects intellectual rigor. Tests your understanding of the "why" behind every number.', avatar: 'MT', color: '#7c3aed' },
          { id: 'ib2-md', name: 'Rebecca Laurent', title: 'Managing Director', firm: 'Centerview Partners', firmType: 'Elite Boutique', style: 'Calm under pressure. Thinks in terms of how the board will receive the analysis. Focused on defensibility and narrative. Will ask you to explain your work as if presenting to non-technical board members.', avatar: 'RL', color: '#6d28d9' },
        ],
        steps: [
          { id: 's1', type: 'message', persona: 'ib2-vp', content: 'I just looked at the DCF. Walk me through your terminal value. I think there might be an issue with how you are handling the transition from explicit forecast to terminal year. What is your terminal year UFCF and how did you derive it?', timeLabel: '8:10 PM' },
          { id: 's2', type: 'task', persona: 'ib2-vp', content: 'Walk through your terminal value calculation step by step. Show the math. The VP will scrutinize every assumption.', timeLabel: '8:15 PM', deliverableType: 'analysis' },
          { id: 's3', type: 'message', persona: 'ib2-md', content: 'Before you go deeper on the DCF - I need you to build me a sensitivity table. I want to show the board how the per-share value changes across WACC (8.5% to 10.5%) and terminal growth (1.5% to 3.5%). Also add a row showing the premium/discount to the offer price at $78. This needs to tell a story.', timeLabel: '9:00 PM' },
          { id: 's4', type: 'deliverable', persona: 'ib2-md', content: 'Build the sensitivity table the MD requested. Think about what story it tells - does the $78 offer price look fair? In what scenarios does it look cheap? Expensive? The board needs to feel comfortable with their vote.', timeLabel: '9:30 PM', deliverableType: 'analysis' },
          { id: 's5', type: 'interrupt', persona: 'ib2-vp', content: 'Hold on - I just realized we need to check the precedent transactions analysis too. Our comps show 12-15x EBITDA for medtech deals in the last 3 years, but this deal is at 13.5x. Where does that fall in the range? And are there any recent deals that are truly comparable - same size, same sub-sector? I need you to sanity check this.', timeLabel: '10:45 PM' },
          { id: 's6', type: 'task', persona: 'ib2-vp', content: 'The VP wants you to defend the precedent transaction analysis. What deals are most comparable to this one and why?', timeLabel: '11:00 PM' },
          { id: 's7', type: 'review', persona: 'ib2-md', content: 'The MD reviews your sensitivity table and asks you to explain it as if you were presenting to the board. She wants to hear the narrative, not just the numbers.', timeLabel: '12:30 AM' },
        ],
      },
    ],
  },
  {
    id: 'pe',
    title: 'Private Equity',
    subtitle: 'Associate',
    description: 'A CIM just landed. Assess the deal, run a paper LBO, prep for management, and defend your thesis to the investment committee.',
    color: '#8b5cf6',
    icon: 'briefcase',
    scenarios: [
      {
        id: 'pe-1',
        career: 'pe',
        title: 'New Deal: CIM Just Dropped',
        subtitle: 'Upper Middle Market Fund',
        description: 'A CIM for a $600M EV industrials company just hit your inbox. Your deal lead wants a first-pass assessment and paper LBO by end of day tomorrow. Management presentation is Friday.',
        duration: '35-45 min',
        difficulty: 'Challenging',
        context: `You are a second-year Associate at a $5B upper middle market PE fund. A CIM for "Apex Manufacturing" just arrived - a $600M EV precision manufacturing company serving aerospace and defense end markets. Revenue is $320M growing 8% organically, EBITDA is $75M (23% margins). The company has a founder-CEO who wants to retire but stay involved on the board. Key considerations: cyclicality of A&D spending, customer concentration (top 3 customers = 45% of revenue), capex-intensive business ($25M/yr maintenance capex), and a potential bolt-on acquisition pipeline. The seller is running a "targeted" process with 6 PE funds invited. First round bids are due in 2 weeks.`,
        personas: [
          { id: 'pe1-lead', name: 'David Hwang', title: 'Principal', firm: 'Summit Partners', firmType: 'Upper Middle Market', style: 'Former banking analyst who thinks in frameworks. Wants structured, concise analysis. Will push you to think about "what could go wrong" more than "what could go right." Values intellectual honesty over deal enthusiasm.', avatar: 'DH', color: '#8b5cf6' },
          { id: 'pe1-partner', name: 'Catherine Ellis', title: 'Managing Partner', firm: 'Summit Partners', firmType: 'Upper Middle Market', style: 'Sees hundreds of deals a year and can spot a bad one in 5 minutes. Asks deceptively simple questions. If you cannot answer "why this company?" in one sentence, you are not ready. Values conviction backed by data.', avatar: 'CE', color: '#6d28d9' },
          { id: 'pe1-ceo', name: 'Robert Novak', title: 'CEO & Founder', firm: 'Apex Manufacturing', firmType: 'Target Company', style: 'Built the company over 30 years. Proud of his team and culture. Nervous about PE. Will be evaluating you as much as you evaluate him. Responds well to respect for the business, poorly to arrogance.', avatar: 'RN', color: '#a78bfa' },
        ],
        steps: [
          { id: 's1', type: 'message', persona: 'pe1-lead', content: 'CIM for Apex Manufacturing just came in. Read through it and give me your initial take. I want to know: (1) What makes this interesting at first glance, (2) What are the top 3 risks you see, (3) What entry multiple range makes sense. We have a team meeting at 4pm to decide if we want to pursue. Come prepared.', timeLabel: '9:00 AM' },
          { id: 's2', type: 'task', persona: 'pe1-lead', content: 'Give your initial assessment of Apex Manufacturing. What is your investment thesis? What are the key risks? What entry multiple range do you think is appropriate and why?', timeLabel: '10:00 AM', deliverableType: 'memo' },
          { id: 's3', type: 'message', persona: 'pe1-lead', content: 'Good start. Now run a quick paper LBO. Entry at 8x EBITDA, 5.5x turns of debt (4.0x senior, 1.5x sub), assume 5% revenue growth and 50bps of annual margin expansion. Exit at 8x in Year 5. What does the return profile look like? I want to see equity check, exit equity value, MOIC, and IRR.', timeLabel: '11:30 AM' },
          { id: 's4', type: 'deliverable', persona: 'pe1-lead', content: 'Build the paper LBO. Show your math clearly. Think about what drives the returns - is it growth, margin expansion, debt paydown, or multiple? Which levers are most realistic?', timeLabel: '12:00 PM', deliverableType: 'model' },
          { id: 's5', type: 'call', persona: 'pe1-ceo', content: 'You are now on a preliminary management call with Robert Novak, the founder-CEO. He wants to understand your fund and how you work with portfolio companies. He is also nervous about what PE means for his employees. He will ask about your approach to operational improvement and management transitions.', timeLabel: '2:00 PM' },
          { id: 's6', type: 'decision', persona: 'pe1-partner', content: 'The Managing Partner drops into the 4pm team meeting. She asks you directly: "In one sentence, why should we pursue this deal? And in one sentence, why should we pass?" What do you say?', timeLabel: '4:00 PM' },
          { id: 's7', type: 'review', persona: 'pe1-lead', content: 'The Principal reviews your paper LBO and initial assessment. He pushes back on your assumptions and asks you to defend your thesis.', timeLabel: '5:00 PM' },
        ],
      },
    ],
  },
  {
    id: 'consulting',
    title: 'Consulting',
    subtitle: 'Associate',
    description: 'A partner gives you a piece of the case. Structure the problem, run a client interview, build slides, and present back under pressure.',
    color: '#10b981',
    icon: 'grid',
    scenarios: [
      {
        id: 'con-1',
        career: 'consulting',
        title: 'Wednesday on a Client Engagement',
        subtitle: 'MBB, Strategy Practice',
        description: 'The partner needs your workstream analysis by Friday. The client stakeholder is difficult. Your engagement manager wants to see progress today. Build the slides and defend your thinking.',
        duration: '30-40 min',
        difficulty: 'Challenging',
        context: `You are a first-year Associate at McKinsey working on a growth strategy engagement for a $2B specialty chemicals company ("ChemCo"). The company's core business is mature (2% growth) but they have a high-growth specialty coatings division (15% growth, 35% margins). The CEO wants to know: should they double down on specialty coatings, acquire a competitor, or diversify into adjacent markets? You own the "market attractiveness" workstream - analyzing 4 adjacent markets the company could enter. The partner presentation is Friday. It is Wednesday, 9:00 AM.`,
        personas: [
          { id: 'con1-em', name: 'Priya Sharma', title: 'Engagement Manager', firm: 'McKinsey', firmType: 'MBB', style: 'Structured thinker who expects MECE frameworks. Will push you on "so what?" for every analysis. Wants to see the pyramid principle in your slides. Supportive but expects you to think independently.', avatar: 'PS', color: '#10b981' },
          { id: 'con1-partner', name: 'William Cross', title: 'Senior Partner', firm: 'McKinsey', firmType: 'MBB', style: 'Intimidatingly smart. Asks questions you did not prepare for. Thinks in terms of client impact, not analytical elegance. Will challenge whether your recommendation is actionable. Has been doing this for 20 years.', avatar: 'WC', color: '#059669' },
          { id: 'con1-client', name: 'Linda Torres', title: 'SVP Strategy', firm: 'ChemCo', firmType: 'Client', style: 'Skeptical of consultants. Has her own views on what the company should do. Will push back on your data and methodology. Responds well to humility and genuine insight, poorly to jargon.', avatar: 'LT', color: '#6ee7b7' },
        ],
        steps: [
          { id: 's1', type: 'message', persona: 'con1-em', content: 'Morning. Where are we on the market attractiveness analysis? I need to see your framework for evaluating the 4 adjacent markets. What dimensions are you scoring them on? And how are you weighting the dimensions? Let me see your initial thinking before the client interview at 11.', timeLabel: '9:15 AM' },
          { id: 's2', type: 'task', persona: 'con1-em', content: 'Present your framework for evaluating market attractiveness. What are the key dimensions? How would you score and weight them? The EM wants to see structured, MECE thinking.', timeLabel: '9:30 AM', deliverableType: 'analysis' },
          { id: 's3', type: 'call', persona: 'con1-client', content: 'You are interviewing Linda Torres, SVP Strategy at ChemCo. She has 15 years of experience in specialty chemicals. You need to understand her perspective on which adjacent markets are most promising and what capabilities the company would need to enter them. She is skeptical and will challenge your assumptions.', timeLabel: '11:00 AM' },
          { id: 's4', type: 'deliverable', persona: 'con1-em', content: 'Based on your framework and the client interview, build a slide that shows the market attractiveness scoring for the 4 adjacent markets. Use a clear visual (matrix, scorecard, or bubble chart concept). Include a "so what" at the top of the slide - what is the key takeaway?', timeLabel: '1:30 PM', deliverableType: 'ppt' },
          { id: 's5', type: 'review', persona: 'con1-partner', content: 'The Senior Partner swings by to check on progress. He looks at your slide and challenges your recommendation. He wants to know: "If we had to pick just one market, which one and why? And what would we need to believe to be true for that to be the right answer?"', timeLabel: '3:00 PM' },
          { id: 's6', type: 'interrupt', persona: 'con1-em', content: 'Change of plans. The CEO just called the partner. He is now leaning toward the acquisition path. The partner wants you to quickly assess: if ChemCo acquired their top competitor in specialty coatings, what would the combined entity look like? Revenue synergies? Cost synergies? Can you sketch that out by end of day?', timeLabel: '4:30 PM' },
          { id: 's7', type: 'task', persona: 'con1-em', content: 'Quickly structure the acquisition analysis. What are the key revenue and cost synergies? What would the combined entity look like? Be prepared to present a rough view to the partner tomorrow morning.', timeLabel: '5:00 PM', deliverableType: 'analysis' },
        ],
      },
    ],
  },
  {
    id: 'rx',
    title: 'Restructuring',
    subtitle: 'Analyst',
    description: 'A portfolio company just breached covenants. Build a situation overview, walk through cap stack options, and prep for an angry lender meeting.',
    color: '#dc2626',
    icon: 'alert',
    scenarios: [
      {
        id: 'rx-1',
        career: 'rx',
        title: 'Covenant Breach: Crisis Mode',
        subtitle: 'Elite RX Advisory',
        description: 'A sponsor calls at 7am - their portfolio company breached its leverage covenant overnight. You need a situation overview, cap stack analysis, and talking points for the lender group by end of day.',
        duration: '35-45 min',
        difficulty: 'Intense',
        context: `You are a first-year Analyst at PJT Partners (Park Hill restructuring group). At 7:15 AM, a PE sponsor calls - their portfolio company "Atlas Retail" (a specialty retailer with 200 stores) breached its 4.5x Total Leverage covenant last night when Q3 EBITDA came in at $85M vs $105M expected. The cap stack: $400M 1L Term Loan (L+400, matures 2027), $150M 2L Notes (8.5% fixed, matures 2028), $200M Unsecured Notes (7.25%, matures 2029), and $180M of equity. Total debt is $750M. LTM EBITDA is $85M = 8.8x total leverage vs 4.5x covenant. The 1L is trading at 82, 2L at 45, unsecureds at 20. The lender group is threatening to accelerate. You have until 5pm to prepare materials for a sponsor strategy call.`,
        personas: [
          { id: 'rx1-md', name: 'Elena Vasquez', title: 'Managing Director', firm: 'PJT Partners', firmType: 'Elite RX Advisory', style: 'Calm in crisis. Thinks in terms of leverage, liquidity, and runway. Expects you to know the cap stack cold. Will ask you to calculate recovery waterfalls in your head. Has worked on 50+ restructurings.', avatar: 'EV', color: '#dc2626' },
          { id: 'rx1-sponsor', name: 'Mark Thompson', title: 'Partner', firm: 'Apollo Global', firmType: 'PE Sponsor', style: 'Aggressive, impatient. Wants options, not problems. Will push for anything that protects the equity. Expects you to have a point of view. Does not tolerate waffling.', avatar: 'MT', color: '#b91c1c' },
          { id: 'rx1-vp', name: 'Ryan Kim', title: 'Vice President', firm: 'PJT Partners', firmType: 'Elite RX Advisory', style: 'Your direct supervisor. Organized, systematic. Will check your math and challenge your logic. Wants to see you think through all options before recommending one. Former IB analyst who moved to RX.', avatar: 'RK', color: '#ef4444' },
        ],
        steps: [
          { id: 's1', type: 'message', persona: 'rx1-vp', content: 'Atlas Retail just breached. We are on the clock. I need you to build a cap stack overview showing all tranches, current trading levels, and implied recovery percentages at current enterprise value. What is the enterprise value if the 1L is trading at 82? Start there.', timeLabel: '7:30 AM' },
          { id: 's2', type: 'task', persona: 'rx1-vp', content: 'Build the cap stack analysis. Calculate the implied enterprise value from the 1L trading level. Walk through the recovery waterfall - what does each tranche recover at current trading levels? Where is the fulcrum security?', timeLabel: '8:00 AM', deliverableType: 'analysis' },
          { id: 's3', type: 'message', persona: 'rx1-md', content: 'Good morning. I need you to think through three strategic paths for Atlas: (1) Amend and extend - negotiate a waiver and new terms with the lender group, (2) Out-of-court exchange - offer lenders new paper at a discount, (3) Chapter 11 - file for protection and restructure the balance sheet. For each path, I want to know: what does it require, what is the timeline, and what happens to the equity? This is for the sponsor call at 5pm.', timeLabel: '9:00 AM' },
          { id: 's4', type: 'deliverable', persona: 'rx1-md', content: 'Draft a situation overview memo for the sponsor. Include: current financial position, covenant breach details, cap stack with trading levels, the three strategic paths, and your recommendation on which path to pursue. Be specific about what each path means for the sponsor equity.', timeLabel: '11:00 AM', deliverableType: 'memo' },
          { id: 's5', type: 'interrupt', persona: 'rx1-sponsor', content: 'I just heard the 1L agent bank is calling a meeting of the lender group for Friday. They want to discuss remedies. This is moving faster than we expected. What is our play? Do we go in with an amend-and-extend proposal or do we let them come to us? I need a view.', timeLabel: '1:30 PM' },
          { id: 's6', type: 'decision', persona: 'rx1-md', content: 'The MD asks you directly: what do you recommend to the sponsor? Amend and extend, exchange, or file? And why? Be prepared to defend your answer.', timeLabel: '3:00 PM' },
          { id: 's7', type: 'review', persona: 'rx1-md', content: 'The MD reviews your situation overview memo and challenges your analysis. She wants to make sure everything is defensible before the 5pm sponsor call.', timeLabel: '4:00 PM' },
        ],
      },
    ],
  },
  {
    id: 'st',
    title: 'Sales & Trading',
    subtitle: 'Analyst',
    description: 'Morning meeting, live market, client RFQs, and a P&L review. Make pricing decisions, manage risk, and defend your trades.',
    color: '#f59e0b',
    icon: 'zap',
    scenarios: [
      {
        id: 'st-1',
        career: 'st',
        title: 'A Day on the Desk',
        subtitle: 'Rates Trading, Bulge Bracket',
        description: 'Morning meeting at 7:30. Market opens. Client RFQs flow in. You make pricing decisions, manage your book, and wrap with a P&L review where the senior trader questions every decision.',
        duration: '30-40 min',
        difficulty: 'Challenging',
        context: `You are a first-year Analyst on the Rates Trading desk at JP Morgan. It is Tuesday morning. You support the US rates flow trading desk covering investment-grade corporate clients. Overnight, the 10Y Treasury moved 8bps higher on a strong ADP jobs report. CPI prints tomorrow. Your book has a small duration short position. Key clients include large asset managers and insurance companies. You need to be ready for the morning meeting, manage client RFQs throughout the day, and track your P&L.`,
        personas: [
          { id: 'st1-head', name: 'Tom Bradley', title: 'Head of Rates', firm: 'JP Morgan', firmType: 'Bulge Bracket', style: 'Old-school trader. Thinks in terms of risk/reward and market positioning. Will grill you on your P&L and ask why you took every position. Values conviction and quick thinking. Hates when you say "I think" instead of "I believe."', avatar: 'TB', color: '#f59e0b' },
          { id: 'st1-sales', name: 'Alex Rivera', title: 'Sales', firm: 'JP Morgan', firmType: 'Bulge Bracket', style: 'Brings you client flow. Will pressure you to provide tight pricing to keep clients happy. Expects you to know your axe and communicate clearly. Will relay client feedback - both good and bad.', avatar: 'AR', color: '#d97706' },
        ],
        steps: [
          { id: 's1', type: 'message', persona: 'st1-head', content: 'Morning meeting in 15 minutes. Be ready to give a 2-minute view on rates. What happened overnight, where do you think 10s go today ahead of CPI tomorrow, and what is your positioning? Keep it tight.', timeLabel: '7:15 AM' },
          { id: 's2', type: 'task', persona: 'st1-head', content: 'Give your morning view. What is your read on the rates market today? What is your positioning and why? The desk head wants conviction and a clear thesis.', timeLabel: '7:30 AM', deliverableType: 'note' },
          { id: 's3', type: 'message', persona: 'st1-sales', content: 'Got an RFQ from Vanguard. They want to sell $200M 5Y Treasuries. Where are you showing them? Market is 4.52/4.53. They are a top-tier client and we want to keep the flow. But CPI is tomorrow and you are already short duration.', timeLabel: '9:15 AM' },
          { id: 's4', type: 'decision', persona: 'st1-sales', content: 'How do you price the Vanguard RFQ? Do you take the risk? Where do you show the bid? Think about your current positioning, the market backdrop, and the client relationship.', timeLabel: '9:20 AM' },
          { id: 's5', type: 'interrupt', persona: 'st1-head', content: 'Heads up - just saw a Bloomberg headline: "Fed Governor Waller suggests rate cuts may come sooner than expected." 10Y just rallied 3bps in 2 minutes. Your short is losing money. What do you do? Cover? Add? Hold? Tell me now.', timeLabel: '11:00 AM' },
          { id: 's6', type: 'decision', persona: 'st1-head', content: 'The market just moved against you on a headline. What is your move? Defend your decision.', timeLabel: '11:05 AM' },
          { id: 's7', type: 'review', persona: 'st1-head', content: 'End of day. P&L review. The desk head wants to walk through every decision you made today - the morning positioning, the Vanguard trade, and your reaction to the Waller headline. Be ready to defend every choice.', timeLabel: '4:00 PM' },
        ],
      },
    ],
  },
  {
    id: 'am',
    title: 'Asset Management',
    subtitle: 'Analyst',
    description: 'A portfolio company just reported earnings. Update the model, take a management call, brief the PM, and defend your conviction.',
    color: '#14b8a6',
    icon: 'trending',
    scenarios: [
      {
        id: 'am-1',
        career: 'am',
        title: 'Earnings Day: Portfolio Company Reports',
        subtitle: 'Long-Only Equity Fund',
        description: 'Your portfolio company just reported. Revenue beat, but margins missed. The stock is down 4% pre-market. The PM wants your updated view by the 3pm position review meeting.',
        duration: '30-40 min',
        difficulty: 'Moderate',
        context: `You are a junior Analyst at a $15B long-only equity fund. You cover the software sector. One of your portfolio companies, "DataSync Corp" (a data analytics platform), just reported Q3 earnings. Revenue: $420M vs $412M consensus (2% beat). EBITDA: $88M vs $95M consensus (7% miss). Full-year guidance: revenue raised by $15M, EBITDA guidance lowered by $10M due to increased S&M spend on a new product launch. The stock is down 4% pre-market at $62 (was $64.50 close). Your fund owns 2.5M shares (a $160M position, about 1% of AUM). Your current price target is $75. The earnings call is at 8:30am.`,
        personas: [
          { id: 'am1-pm', name: 'Jennifer Xu', title: 'Portfolio Manager', firm: 'Wellington', firmType: 'Long-Only', style: 'Calm, analytical. Wants to understand the "variant perception" - what do you know that the market does not? Will challenge your conviction. Expects you to know the company better than the sell-side. Values independent thinking over consensus views.', avatar: 'JX', color: '#14b8a6' },
          { id: 'am1-ir', name: 'Steve Mitchell', title: 'VP Investor Relations', firm: 'DataSync Corp', firmType: 'Portfolio Company', style: 'Professional but guarded. Will give you more color than the public call if you ask the right questions. Will not lie but will emphasize the positive. Knows the numbers cold.', avatar: 'SM', color: '#0d9488' },
        ],
        steps: [
          { id: 's1', type: 'message', persona: 'am1-pm', content: 'DataSync just reported. Stock is down 4%. I saw the top line beat but the margin miss. What is your initial read - is this a buying opportunity or a red flag? I want your view before the call at 8:30.', timeLabel: '7:45 AM' },
          { id: 's2', type: 'task', persona: 'am1-pm', content: 'Give your initial assessment of the DataSync earnings. What drove the margin miss? Is the revenue beat quality? Does the increased S&M spend concern you or excite you? How does this change your thesis?', timeLabel: '8:00 AM', deliverableType: 'note' },
          { id: 's3', type: 'call', persona: 'am1-ir', content: 'You are on a 1-on-1 call with DataSync IR after the earnings call. You have 15 minutes. The PM wants you to dig into the margin miss and the new product launch. What questions do you ask?', timeLabel: '10:00 AM' },
          { id: 's4', type: 'deliverable', persona: 'am1-pm', content: 'Write a brief note to the PM (one page max) with your updated view on DataSync. Include: what happened, what it means for the thesis, your updated price target (if any), and your recommendation - buy more, hold, or trim the position. Be specific and have conviction.', timeLabel: '1:00 PM', deliverableType: 'memo' },
          { id: 's5', type: 'review', persona: 'am1-pm', content: 'The 3pm position review meeting. The PM challenges your recommendation. She wants to know: what could you be wrong about? What would make you change your mind? If DataSync misses again next quarter, do you still hold?', timeLabel: '3:00 PM' },
        ],
      },
    ],
  },
  {
    id: 'vc',
    title: 'Venture Capital',
    subtitle: 'Analyst',
    description: 'A Series A pitch deck just landed. Read it, do a market scan, take a founder call, write the memo, and defend the deal to the partnership.',
    color: '#ec4899',
    icon: 'rocket',
    scenarios: [
      {
        id: 'vc-1',
        career: 'vc',
        title: 'Evaluating a Series A',
        subtitle: 'Early-Stage Fund',
        description: 'A Series A pitch deck for an AI infrastructure startup just hit the inbox. The partner wants your take. You have until end of day to write a memo and make a recommendation.',
        duration: '30-40 min',
        difficulty: 'Moderate',
        context: `You are an Analyst at a $500M early-stage venture fund. A pitch deck for "NeuralOps" just came in from a warm intro. NeuralOps is building AI infrastructure tooling for enterprise MLOps - specifically, they help companies deploy, monitor, and optimize ML models in production. Founded 18 months ago by two ex-Google ML engineers. Metrics: $2M ARR growing 4x YoY, 15 enterprise customers, 130% net retention, $180K ACV, 2 months of runway left. Raising $15M Series A at $60M pre-money. Comps: Weights & Biases, MLflow (open source), Tecton, Datarobot.`,
        personas: [
          { id: 'vc1-partner', name: 'Sarah Lin', title: 'General Partner', firm: 'Benchmark', firmType: 'Early-Stage Fund', style: 'Pattern-matching machine. Has seen 1000 pitches. Wants to know "why now" and "why this team." Will push you on market size and competitive dynamics. Values contrarian thinking. If everyone loves it, she is skeptical.', avatar: 'SL', color: '#ec4899' },
          { id: 'vc1-founder', name: 'Raj Patel', title: 'Co-Founder & CEO', firm: 'NeuralOps', firmType: 'Startup', style: 'Technical founder, brilliant engineer, first-time CEO. Articulate about the technology but less polished on go-to-market. Passionate and honest. Will be transparent about challenges if you ask the right way.', avatar: 'RP', color: '#db2777' },
        ],
        steps: [
          { id: 's1', type: 'message', persona: 'vc1-partner', content: 'NeuralOps deck just came in. Take a look and give me your initial reaction - does this pass the sniff test? I want to know in 3 sentences: what they do, why it matters, and what concerns you. I have a call with the founder at 2pm and I want your view before that.', timeLabel: '9:00 AM' },
          { id: 's2', type: 'task', persona: 'vc1-partner', content: 'Give your initial assessment of NeuralOps. What is the opportunity? What are the risks? How does the valuation compare to comps? Does this pass the "sniff test" for a $15M Series A?', timeLabel: '9:30 AM', deliverableType: 'analysis' },
          { id: 's3', type: 'call', persona: 'vc1-founder', content: 'You are on a call with Raj Patel, the CEO of NeuralOps. This is a chance to dig deeper on the product, the team, the market, and the go-to-market. He is open and honest but you need to ask the right questions. What do you want to know?', timeLabel: '11:00 AM' },
          { id: 's4', type: 'deliverable', persona: 'vc1-partner', content: 'Write the investment memo for NeuralOps. Include: company overview, market opportunity, product and technology, team assessment, key metrics and unit economics, competitive landscape, key risks, and your recommendation (invest / pass / need more info). The partner will read this before Monday partner meeting.', timeLabel: '1:00 PM', deliverableType: 'memo' },
          { id: 's5', type: 'review', persona: 'vc1-partner', content: 'The partner reads your memo and challenges your recommendation. She asks: "If this is so good, why is the valuation reasonable? What do the other funds in the process see that we might be missing? And if we pass, what is the risk that this becomes a $1B company and we kicked ourselves?"', timeLabel: '4:00 PM' },
        ],
      },
    ],
  },
  {
    id: 're',
    title: 'Real Estate',
    subtitle: 'Analyst',
    description: 'A rent roll and offering memo just landed. Build a cash flow model, analyze the market, write an IC memo, and present the deal.',
    color: '#78716c',
    icon: 'building',
    scenarios: [
      {
        id: 're-1',
        career: 're',
        title: 'Underwriting a New Acquisition',
        subtitle: 'Real Estate Private Equity',
        description: 'A 250-unit multifamily property in Austin just hit the market. Your VP wants a quick underwriting, market analysis, and IC memo by Friday. The offering is competitive.',
        duration: '30-40 min',
        difficulty: 'Challenging',
        context: `You are an Analyst at a $3B real estate private equity fund focused on multifamily. An offering memo for "The Meridian" just came in - a 250-unit Class B+ multifamily property in Austin, TX (Mueller submarket). Asking price: $62.5M ($250K/unit). Current NOI: $3.4M (5.4% cap rate). Average in-place rent: $1,450/unit. Market rent: $1,650/unit (12% mark-to-market). 93% occupied. Built in 2008, good condition but needs cosmetic renovations ($8K/unit for a value-add program). The market is competitive with 5+ groups expected to bid. Your fund targets 15%+ net IRR on value-add deals.`,
        personas: [
          { id: 're1-vp', name: 'Marcus Williams', title: 'Vice President', firm: 'Starwood Capital', firmType: 'REPE', style: 'Numbers-driven. Will challenge every assumption in your model. Expects you to know the Austin market - cap rates, rent growth, new supply. Does not accept "I assumed 3% growth" without a reason.', avatar: 'MW', color: '#78716c' },
          { id: 're1-md', name: 'Patricia Chen', title: 'Managing Director', firm: 'Starwood Capital', firmType: 'REPE', style: 'Big-picture thinker. Wants to know about the market thesis, not just the numbers. Will ask about the Austin market fundamentals - population growth, job growth, supply pipeline. Decides whether deals go to IC.', avatar: 'PC', color: '#57534e' },
        ],
        steps: [
          { id: 's1', type: 'message', persona: 're1-vp', content: 'Meridian OM just came in. I need a quick-turn underwriting. Start with the rent roll analysis - current rents vs market, what does the mark-to-market look like unit by unit? Then build a 5-year cash flow model with the value-add renovation program. Assume $2M renovation budget ($8K/unit over years 1-2), 3% annual rent growth post-renovation, 95% stabilized occupancy. I want to see unlevered IRR and cash-on-cash.', timeLabel: '9:00 AM' },
          { id: 's2', type: 'task', persona: 're1-vp', content: 'Walk through your underwriting assumptions. What rent growth are you assuming and why? What cap rate are you using for exit? How does the renovation program drive returns? The VP will challenge every number.', timeLabel: '10:00 AM', deliverableType: 'model' },
          { id: 's3', type: 'deliverable', persona: 're1-vp', content: 'Build the investment summary for IC. Include: property overview, market thesis (why Austin, why Mueller), financial summary (sources and uses, returns), key risks, and your recommendation on pricing. Where should we bid? Can we hit 15% net IRR at the ask price?', timeLabel: '1:00 PM', deliverableType: 'memo' },
          { id: 's4', type: 'review', persona: 're1-md', content: 'The MD reviews your IC memo. She asks: "Austin has a lot of new supply coming. Why do we believe this property will maintain occupancy and rent growth? And what happens to our returns if cap rates expand 50bps at exit?" Defend your thesis.', timeLabel: '3:30 PM' },
        ],
      },
    ],
  },
  {
    id: 'er',
    title: 'Equity Research',
    subtitle: 'Associate',
    description: 'A company you cover just reported earnings. Update your model, write a quick note, take a buy-side call, and decide if your rating changes.',
    color: '#06b6d4',
    icon: 'search',
    scenarios: [
      {
        id: 'er-1',
        career: 'er',
        title: 'Earnings Day: Company Reports',
        subtitle: 'Sell-Side Research',
        description: 'Your coverage company just reported after the close. Update the model, write a quick note for clients, handle buy-side calls, and decide with your senior analyst if the rating changes.',
        duration: '30-40 min',
        difficulty: 'Moderate',
        context: `You are a second-year Associate covering enterprise software at a major sell-side bank. Your coverage company "CloudGrid" (a cloud infrastructure company) just reported Q3 after the close. Results: Revenue $890M vs $875M consensus (beat), but billings growth decelerated from 28% to 22% (miss). Operating margin 18% vs 16% expected (beat on cost discipline). Stock is down 6% after-hours at $142 (was $151). Your current rating is Overweight with a $170 price target. The CEO blamed the billings deceleration on "elongated sales cycles" in enterprise. Your senior analyst is traveling and needs you to handle the initial update.`,
        personas: [
          { id: 'er1-senior', name: 'Daniel Park', title: 'Senior Analyst', firm: 'Morgan Stanley', firmType: 'Sell-Side', style: 'Traveling but available by phone. Wants you to handle the grunt work but will make the final call on the rating. Values nuanced, non-consensus views. Will push you to think about what the market is missing.', avatar: 'DP', color: '#06b6d4' },
          { id: 'er1-buyside', name: 'Amanda Foster', title: 'Portfolio Manager', firm: 'Fidelity', firmType: 'Buy-Side', style: 'One of your top-ranked buy-side clients. Smart, direct, and will ask hard questions. Wants your honest view, not the official party line. Values analysts who have conviction and are willing to be wrong.', avatar: 'AF', color: '#0891b2' },
        ],
        steps: [
          { id: 's1', type: 'message', persona: 'er1-senior', content: 'CloudGrid just reported. I am in transit. Can you handle the initial update? I need: (1) quick take on the quarter - beat or miss and why, (2) updated model with the new numbers, (3) a 1-page flash note for clients by 7am tomorrow. I will call you at 9pm to discuss the rating. Do not change the rating without talking to me first.', timeLabel: '5:30 PM' },
          { id: 's2', type: 'task', persona: 'er1-senior', content: 'Give your initial assessment of the CloudGrid quarter. Revenue beat but billings decelerated. Margins beat on cost cuts. What is the real story here? Is the billings decel a one-time issue or a structural concern?', timeLabel: '6:00 PM', deliverableType: 'analysis' },
          { id: 's3', type: 'deliverable', persona: 'er1-senior', content: 'Write the flash note for clients. Keep it to one page. Include: headline (what happened), key takeaways (2-3 bullets), estimate changes (revenue, EPS for this year and next), and your preliminary view on the stock. Remember, you cannot change the rating yet - but you can signal your thinking.', timeLabel: '7:30 PM', deliverableType: 'note' },
          { id: 's4', type: 'call', persona: 'er1-buyside', content: 'Amanda Foster from Fidelity calls. She owns 5M shares and is down $45M on the after-hours move. She wants your honest view: is this a buying opportunity or is something broken? She will push you hard on the billings decel and ask what you think the stock is worth now.', timeLabel: '8:30 PM' },
          { id: 's5', type: 'review', persona: 'er1-senior', content: 'Your senior analyst calls at 9pm as promised. He has read the transcript on the plane. He wants to discuss: should we keep Overweight, downgrade to Equal-Weight, or cut the price target but maintain the rating? What do you recommend and why?', timeLabel: '9:00 PM' },
        ],
      },
    ],
  },
  {
    id: 'accounting',
    title: 'Accounting & Audit',
    subtitle: 'Staff / Senior',
    description: 'Test controls, document workpapers, handle a difficult client, and survive manager review on a Q3 audit engagement.',
    color: '#64748b',
    icon: 'clipboard',
    scenarios: [
      {
        id: 'acct-1',
        career: 'accounting',
        title: 'Day Deep in a Q3 Audit',
        subtitle: 'Big Four, Audit Practice',
        description: 'Your senior assigns you a revenue recognition control to test. The client controller is uncooperative. Your manager finds issues in your workpapers. You have until end of day to fix them.',
        duration: '30-40 min',
        difficulty: 'Moderate',
        context: `You are a Staff 2 at a Big Four firm on the Q3 interim audit for "Pacific Distributors," a $800M revenue wholesale distribution company. You have been assigned to test the revenue recognition controls - specifically, the control over "cutoff" (ensuring revenue is recorded in the correct period). The control description states that the company reconciles shipping logs to revenue entries within 2 business days of month-end. You need to select a sample, obtain evidence, and document your testing. The client controller has been slow to respond to requests. Your senior wants clean workpapers by 4pm for manager review.`,
        personas: [
          { id: 'acct1-senior', name: 'Jessica Huang', title: 'Senior Associate', firm: 'KPMG', firmType: 'Big Four', style: 'Organized and methodical. Will check your workpapers line by line. Expects proper tickmarks, clear cross-references, and a logical flow. Helpful if you ask good questions, frustrated if you make the same mistake twice.', avatar: 'JH', color: '#64748b' },
          { id: 'acct1-manager', name: 'Brian O\'Sullivan', title: 'Manager', firm: 'KPMG', firmType: 'Big Four', style: 'Experienced auditor who has seen every kind of error. Reviews workpapers with a critical eye. Will push back on your sample size methodology and documentation quality. Wants to see professional skepticism, not just box-checking.', avatar: 'BO', color: '#475569' },
          { id: 'acct1-client', name: 'Karen Martinez', title: 'Controller', firm: 'Pacific Distributors', firmType: 'Client', style: 'Overworked and views auditors as an annoyance. Will delay providing documents, give partial responses, and push back on sample sizes. Not hostile, just busy and protective of her team. You need to be firm but diplomatic.', avatar: 'KM', color: '#94a3b8' },
        ],
        steps: [
          { id: 's1', type: 'message', persona: 'acct1-senior', content: 'Morning. I need you to test the revenue cutoff control for Pacific Distributors. Start by reviewing the control description in the audit program. Then determine your sample size - think about the risk level and what PCAOB standards require. Once you have your sample, request the shipping logs and revenue entries from Karen. She has been slow this week so be proactive. I need clean workpapers by 4pm.', timeLabel: '8:30 AM' },
          { id: 's2', type: 'task', persona: 'acct1-senior', content: 'Walk through your testing approach. What sample size are you selecting and why? What evidence do you need from the client? What are you looking for when you compare shipping logs to revenue entries? Show your professional skepticism.', timeLabel: '9:00 AM', deliverableType: 'analysis' },
          { id: 's3', type: 'call', persona: 'acct1-client', content: 'You need to request the shipping logs from Karen Martinez, the controller. She is busy and has been slow to respond. She might push back on your sample size or try to give you partial data. You need to be firm but professional. What do you ask for and how do you handle resistance?', timeLabel: '10:00 AM' },
          { id: 's4', type: 'deliverable', persona: 'acct1-senior', content: 'Document your testing in the workpaper. Include: objective of the test, control description, sample selection methodology, testing procedures performed, results, and your conclusion. Use proper tickmarks and cross-references. The manager will review this - it needs to be clean.', timeLabel: '1:00 PM', deliverableType: 'memo' },
          { id: 's5', type: 'interrupt', persona: 'acct1-client', content: 'Karen calls you back. She says two of the shipping logs in your sample cannot be located because they were in a system that was migrated last month. She says "the data is the same, it was just moved." How do you handle this? What are the audit implications?', timeLabel: '2:30 PM' },
          { id: 's6', type: 'review', persona: 'acct1-manager', content: 'The manager reviews your workpapers at 4pm. He has review notes. He questions your sample size rationale, asks about the missing shipping logs, and wants to know if you considered any fraud risk indicators. Be prepared to defend your work.', timeLabel: '4:00 PM' },
        ],
      },
    ],
  },
];

export function getCareer(id: string): CareerTrack | undefined {
  return CAREERS.find(c => c.id === id);
}

export function getScenario(careerId: string, scenarioId: string): Scenario | undefined {
  const career = getCareer(careerId);
  return career?.scenarios.find(s => s.id === scenarioId);
}
