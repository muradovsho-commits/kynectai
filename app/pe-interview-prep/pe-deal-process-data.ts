export const PE_DEAL_PROCESS_SECTIONS = [
  {
    title: 'Deal Sourcing',
    content: `<p>PE firms find acquisition targets through three main channels:</p>

<p><strong>Intermediated / Auction Processes:</strong> Investment banks and M&A advisors run sell-side processes on behalf of company owners. They contact potential buyers, distribute a "teaser" (anonymous summary) and Confidential Information Memorandum (CIM), and manage the bidding process. This is the most common source of deals, especially in the middle market and above. The downside: competitive auctions drive up prices and compress returns.</p>

<p><strong>Proprietary / Direct Sourcing:</strong> The PE firm contacts company owners directly, without an intermediary. This can be through cold outreach, industry conferences, operating partner networks, or relationships built over years. Proprietary deals are the holy grail because they involve less competition and often better pricing. However, they require significant relationship-building effort and a strong industry reputation.</p>

<p><strong>Referral Networks:</strong> Deals can come through accountants, lawyers, consultants, lenders, other PE firms (who may pass on deals that don't fit their strategy), and portfolio company executives. Building and maintaining these networks is a core competency for senior PE professionals.</p>`,
  },
  {
    title: 'Initial Screening',
    content: `<p>PE firms see hundreds of deals per year but invest in only a handful. The initial screening process filters opportunities rapidly based on key criteria:</p>

<p><strong>Does it fit our strategy?</strong> Right industry, right size, right geography? If the firm specializes in healthcare services and the deal is a semiconductor manufacturer, it's an immediate pass.</p>

<p><strong>Is the business quality sufficient?</strong> Stable revenue, defensible market position, strong management, recurring or contracted revenue streams, limited customer concentration.</p>

<p><strong>Can we underwrite attractive returns?</strong> A quick mental model (or paper LBO): Given the asking price, reasonable leverage, and conservative growth assumptions, can we achieve a 20%+ IRR and 2.0x+ MOIC? If the math doesn't work on the back of an envelope, it won't work in a detailed model.</p>

<p><strong>Is there a credible value creation plan?</strong> What specific levers can we pull to improve this business? If the answer is "we'll just ride market growth," that's not a PE-worthy thesis.</p>

<p><strong>What are the key risks, and are they manageable?</strong> Customer concentration, regulatory risk, technology disruption, cyclicality, management dependency. Every deal has risks; the question is whether they can be mitigated or priced appropriately.</p>`,
  },
  {
    title: 'Due Diligence',
    content: `<p>Once a deal passes initial screening, the PE firm conducts extensive due diligence&mdash;a systematic investigation of every material aspect of the business. Due diligence is the single most important risk management tool in PE. The goal is not just to verify the seller's claims, but to develop an independent, bottom-up view of the business's value and risks.</p>

<h4>Financial Due Diligence</h4>

<p>Usually conducted by a Big Four accounting firm. The analysis includes:</p>

<p><strong>Quality of Earnings (QoE):</strong> The most critical deliverable. The QoE analysis adjusts the company's reported EBITDA to arrive at a "normalized" or "adjusted" EBITDA that reflects the true, recurring, cash earning power of the business. Common adjustments include: removing one-time items (legal settlements, restructuring costs), normalizing owner compensation (privately held companies often pay their owners above-market salaries), adjusting for non-recurring revenue or expenses, identifying aggressive accounting treatments, and adjusting for run-rate effects of recent changes (new contracts, price increases, cost savings).</p>

<p><strong>Working Capital Analysis:</strong> Determine the "normal" level of net working capital required to run the business. This is critical for setting the working capital peg in the purchase agreement&mdash;the target level at which the buyer receives a dollar-for-dollar adjustment if actual working capital at closing differs from the peg.</p>

<p><strong>CapEx Analysis:</strong> Separate maintenance CapEx (required to sustain current operations) from growth CapEx (discretionary spending to expand). The distinction matters because maintenance CapEx is a real cost that reduces Free Cash Flow available for Debt service.</p>

<p><strong>Debt and Debt-like Items:</strong> Identify all obligations that should be treated as "Debt-like" for purposes of calculating the Enterprise Value. This goes beyond traditional bank Debt to include: unfunded pension obligations, deferred compensation, earn-out liabilities from prior acquisitions, capital lease obligations, deferred revenue that won't convert to cash, environmental liabilities, litigation reserves, and unpaid taxes.</p>

<h4>Commercial Due Diligence</h4>

<p>Often conducted by a strategy consulting firm (Bain, McKinsey, L.E.K., etc.). This analysis assesses the external market environment and the company's competitive position:</p>

<p><strong>Market sizing and growth:</strong> How big is the addressable market? Is it growing, stable, or shrinking? What are the secular trends (favorable tailwinds or structural headwinds)?</p>

<p><strong>Competitive landscape:</strong> Who are the key competitors? What is the company's market share? How defensible is its position? Are there barriers to entry (regulatory licenses, network effects, switching costs, brand loyalty)?</p>

<p><strong>Customer analysis:</strong> How concentrated is the customer base? What do customer contracts look like (length, renewal rates, price escalators)? Why do customers buy from this company? What's the churn or loss rate?</p>

<p><strong>Revenue durability:</strong> How much revenue is recurring vs. one-time? What percentage is contracted vs. at-risk? How sensitive is volume to economic cycles?</p>

<h4>Legal Due Diligence</h4>

<p>Conducted by the PE firm's law firm. Covers: corporate structure and governance, material contracts (reviewing key customer, supplier, and employee agreements), pending or threatened litigation, intellectual property ownership and protection, regulatory compliance, environmental liabilities, and tax structuring.</p>

<h4>Operational Due Diligence</h4>

<p>Conducted by the PE firm's operating team or specialized consultants. Covers: management team assessment (strengths, gaps, bench depth), IT systems and infrastructure, operational efficiency (benchmarking against best-in-class), supply chain resilience, human capital (compensation benchmarking, key person dependencies, labor relations), and facility condition.</p>

<h4>Management Assessment</h4>

<p>Perhaps the most important and most difficult piece of due diligence. PE firms spend significant time evaluating the CEO, CFO, and other senior leaders. Will the current management team execute the value creation plan? Are there gaps that need to be filled? Is the CEO coachable, or will they resist changes? Management meetings, reference checks, and psychometric assessments are all common tools.</p>

<div class="pro-tip">
Many PE professionals say the management team is the single most important factor in any investment decision. A strong team can execute a mediocre strategy; a weak team can squander a brilliant one. If you're unsure about the management team, that's usually a reason to pass&mdash;not a problem to solve post-close.
</div>`,
  },
  {
    title: 'The Investment Committee Process',
    content: `<p>Before committing to an acquisition, the deal team must present to the firm's <strong>Investment Committee (IC)</strong>&mdash;typically composed of the firm's senior partners. The IC memo is a comprehensive document covering: the investment thesis (why this deal), business overview, industry analysis, financial analysis (including the LBO model), value creation plan, risk factors and mitigants, deal terms, and the recommended decision.</p>

<p>Most firms have multiple IC "gates." An initial IC meeting approves submitting an Indication of Interest (IOI) or Letter of Intent (LOI). A final IC meeting approves signing the definitive purchase agreement. Between these gates, the deal team conducts progressively deeper due diligence.</p>`,
  },
  {
    title: 'Deal Structuring and Negotiation',
    content: `<p>Key terms negotiated in the purchase agreement include:</p>

<p><strong>Purchase Price and Adjustments:</strong> The headline price (usually an Enterprise Value) plus mechanisms for adjustments at closing. Common adjustments include a net working capital adjustment (dollar-for-dollar adjustment if closing NWC differs from the agreed-upon peg), a net Debt adjustment (subtracting actual Debt and Debt-like items), and a cash adjustment (adding actual Cash).</p>

<p><strong>Representations and Warranties:</strong> Statements by the seller about the condition of the business (accuracy of financial statements, ownership of assets, absence of undisclosed liabilities). These survive closing and provide the buyer with recourse if they turn out to be false.</p>

<p><strong>Indemnification:</strong> The seller's obligation to compensate the buyer for losses arising from breaches of reps and warranties or other specified risks. Often subject to a "basket" (minimum threshold before claims can be made) and a "cap" (maximum total indemnification, usually 10–20% of the purchase price).</p>

<p><strong>Escrow / Holdback:</strong> A portion of the purchase price (typically 5–15%) held in escrow for 12–24 months to fund potential indemnification claims.</p>

<p><strong>Earn-Out:</strong> A portion of the purchase price contingent on the company achieving specified performance targets post-closing. Common when buyer and seller disagree on the company's future performance. Earn-outs are a source of frequent disputes and should be structured carefully.</p>

<p><strong>Management Rollover:</strong> The percentage of the management team's proceeds that must be reinvested in the new PE-owned company. Typically 25–50% of the CEO's and CFO's net proceeds. This ensures alignment but requires careful tax structuring.</p>`,
  },
];
