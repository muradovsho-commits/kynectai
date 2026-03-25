export const PE_DEAL_PROCESS_SECTIONS = [
  {
    title: `1. The Deal Funnel Overview`,
    content: `<p>A private equity firm looks at hundreds of deals to execute just a handful each year. The "Deal Funnel" represents the rigorous filtering process.</p>
<br/>
<p><strong>Phase 1: Sourcing (Looking at ~500 companies)</strong><br/>
Associates and VP's scour the market, read CIMs (Confidential Information Memorandums) sent by investment banks, or attend conferences to find proprietary deals. If a company looks interesting, the firm signs an NDA (Non-Disclosure Agreement) to receive preliminary financials.</p>
<br/>
<p><strong>Phase 2: Initial Review & The IOI (Looking at ~50 companies)</strong><br/>
The deal team spends 1-2 weeks building a quick "back-of-the-envelope" LBO model. If the returns look promising (e.g., passing a 20% IRR hurdle rate), they submit an <strong>IOI (Indication of Interest)</strong>. This is a non-binding letter stating a vague price range they are willing to pay.</p>
<br/>
<p><strong>Phase 3: Deep Diligence & The LOI (Looking at ~10 companies)</strong><br/>
If the seller likes the IOI, the PE firm enters the data room. They hire external consultants (Bain/McKinsey for commercial, KPMG/PWC for accounting/QoE). After a month of intense scrutiny, if the thesis holds up, they submit an <strong>LOI (Letter of Intent)</strong>. This is a highly detailed, usually binding agreement that locks in an exact price and grants the PE firm "exclusivity" (so the seller can't shop the deal around anymore).</p>
<br/>
<p><strong>Phase 4: Closing (Investing in ~1-3 companies)</strong><br/>
During the exclusivity period (usually 30-60 days), lenders are locked in, legal contracts (Purchase Agreements) are drafted by lawyers, and the money is formally wired.</p>`
  },
  {
    title: `2. What is a "QoE" (Quality of Earnings)?`,
    content: `<p>A Quality of Earnings (QoE) report is the most important accounting document in a private equity transaction. It is typically prepared by a Big 4 accounting firm hired by the PE firm during diligence.</p>
<br/>
<p>A seller's management team will always present an "Adjusted EBITDA" that makes the company look amazingly profitable. They will add back all sorts of questionable expenses, claiming they are "one-time" or "non-recurring".</p>
<br/>
<p><strong>The QoE's Job:</strong><br/>
The QoE team tears apart the company's ledger to figure out the <em>true</em>, run-rate cash flow of the business. They look for:<br/>
• <strong>Fake Add-backs:</strong> "Management added back $500k in legal fees saying it was a one-time IP lawsuit, but looking at the last 5 years, they get sued for IP every year. This is a recurring operational expense, not an add-back."<br/>
• <strong>Cash vs. Accrual inconsistencies:</strong> Recognizing revenue before services were actually rendered.<br/>
• <strong>Working Capital abnormalities:</strong> Did the company purposely delay paying its suppliers right before the sale to hoard cash on the balance sheet?</p>
<br/>
<p>Because PE firms buy companies at multiples of EBITDA (e.g., 10x), discovering that the EBITDA is actually $2M lower than management claimed means the PE firm should reduce their purchase price by $20M.</p>`
  },
  {
    title: `3. Commercial Due Diligence`,
    content: `<p>Accounting tells you if the numbers are real today. Commercial Due Diligence (CDD) tells you if the numbers will exist tomorrow.</p>
<br/>
<p>CDD is usually outsourced to strategy consulting firms (like Bain or LEK), but PE Associates run point on asking the right questions. Key areas of focus:</p>
<br/>
<p><strong>1. TAM (Total Addressable Market):</strong> Is the overarching market growing or shrinking? Investing in a rapidly growing niche covers up a lot of operational mistakes.</p>
<p><strong>2. Competitive Landscape:</strong> Who are the main competitors? Is the market fragmented (making it ripe for roll-ups) or consolidated (dominated by heavyweights)?</p>
<p><strong>3. Customer Concentration:</strong> Are 60% of revenues coming from just 2 major clients? If one client leaves, the company defaults on its debt. This is a huge red flag in PE.</p>
<p><strong>4. Pricing Power & Moat:</strong> Can the company reliably raise prices 3-5% every year without losing customers to a cheaper rival?</p>`
  },
  {
    title: `4. Proprietary Deals vs. Auction Processes`,
    content: `<p>There are two primary ways a PE firm sources deals:</p>
<br/>
<p><strong>1. Broad Auctions (Banker-led):</strong><br/>
An investment bank is hired by the seller. The bank blasts out a teaser and CIM to 50+ private equity firms. It's highly competitive, highly structured, and moves on strict deadlines. <br/>
<em>Pros:</em> Lots of data readily available. <br/>
<em>Cons:</em> You are forced to pay the absolute maximum market price because you are competing against every other mega-fund ("The Winner's Curse").</p>
<br/>
<p><strong>2. Proprietary Sourcing (Prop Deals):</strong><br/>
A VP or Principal at the PE firm cold-calls the founder of a family-owned business for 3 years, takes them out to dinner, and eventually convinces them to sell a majority stake directly to the PE firm without hiring a banker.<br/>
<em>Pros:</em> No competition. You can often buy the company for a lower multiple (e.g., 7x instead of 10x), locking in massive value on day 1.<br/>
<em>Cons:</em> Insanely difficult and time-consuming to execute. The financials are usually a mess, requiring massive diligence to untangle.</p>`
  },
  {
    title: `Interview Question: How would you evaluate an investment in a local HVAC repair business?`,
    content: `<p><strong>Answer Structure:</strong> Follow a structured framework—Market, Competitive Position, Financials, and Returns.</p>
<br/>
<p><strong>1. Market / Industry Dynamics:</strong><br/>
HVAC repair is fantastic for PE. It's a non-cyclical, recession-resistant necessity (people need heating in winter regardless of the economy). The TAM is localized but massive in aggregate. It's also highly fragmented, consisting of thousands of \"mom and pop\" shops.</p>
<br/>
<p><strong>2. Competitive Position / Strategy:</strong><br/>
Because it's fragmented, the clear strategy is a "Roll-up." We acquire a baseline platform company, and then buy 20 smaller local competitors over 5 years. This gives us massive scale to negotiate cheaper parts from suppliers and consolidate back-office HR and dispatching.</p>
<br/>
<p><strong>3. Financials & Cash Flow:</strong><br/>
HVAC repair has high margins and low CapEx (mostly just vans and tools). Revenue is sticky if they have recurring annual maintenance contracts. We must look out for customer concentration (is it residential or heavily tied to one commercial real estate developer?).</p>
<br/>
<p><strong>4. Returns / Exit:</strong><br/>
We can buy mom-and-pop shops at 4x-5x EBITDA. Once we combine them into a massive regional powerhouse with professionalized management, a larger PE fund will pay 10x-12x EBITDA for the consolidated entity. This multiple arbitrage, combined with the cash flow generation, yields exceptional IRRs.</p>`
  }
];
