'use client';

import Sidebar from "../components/Sidebar";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import '../contact-finder/contact-finder.css';
import './recruiting-manual.css';

type Section = { title: string; content: string };
type Chapter = { title: string; sections: Section[] };
type Track = { id: string; title: string; sub: string; chapters: Chapter[] };

/* ── SVG Icons ── */
const ICONS: Record<string,React.ReactElement> = {
  ib: <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  pe: <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  consulting: <svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  ge: <svg viewBox="0 0 24 24"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>,
  am: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  accounting: <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15L11 17L15 13"/></svg>,
  st: <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  er: <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  re: <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  vc: <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  rx: <svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
};

/* ── TRACK DATA ── */
const TRACKS: Track[] = [
  {
    id:'ib', title:'Investment Banking', sub:'Deals, advisory, capital markets',
    chapters: [
      { title:'What Is Investment Banking?', sections:[
        { title:'Overview', content:`<p>Investment banking is the division of a bank or financial institution that serves governments, corporations, and institutions by providing underwriting (capital raising) and M&A advisory services. Think of investment bankers as the intermediaries who help companies raise money by issuing stocks or bonds, and who advise on buying, selling, or merging with other companies.</p><p>IB is one of the most common entry points into high finance. It's often described as a "finishing school" because it teaches you financial modeling, valuation, and deal execution skills that are highly valued across the entire financial industry.</p>` },
        { title:'What They Actually Do', content:`<p>At the junior level (Analyst and Associate), your day-to-day revolves around:</p><ul><li><strong>Financial modeling:</strong> Building and maintaining complex Excel models - DCFs, LBOs, merger models, and comparable company analyses.</li><li><strong>Pitch books:</strong> Creating PowerPoint presentations that pitch your bank's services to potential clients.</li><li><strong>Due diligence:</strong> Researching companies, industries, and markets to support deal evaluation.</li></ul><p>At the senior level (VP, Director, MD), the job shifts primarily to <strong>relationship management and business development</strong> - finding new clients, winning mandates, and advising C-suite executives.</p>` },
        { title:'Firm Tiers & Key Players', content:`<p>Investment banks are categorized into tiers:</p><h4>Bulge Bracket Banks</h4><p>The largest, most global banks working on the biggest deals.</p><div class="firm-tier"><div class="firm-tier-list"><span class="firm-pill">Goldman Sachs</span><span class="firm-pill">J.P. Morgan</span><span class="firm-pill">Morgan Stanley</span><span class="firm-pill">Bank of America</span><span class="firm-pill">Citi</span><span class="firm-pill">UBS</span></div></div><h4>Elite Boutiques</h4><p>Smaller, advisory-focused firms. No trading floors - just pure advisory. Known for top-tier deal quality.</p><div class="firm-tier"><div class="firm-tier-list"><span class="firm-pill">Evercore</span><span class="firm-pill">Lazard</span><span class="firm-pill">Centerview</span><span class="firm-pill">PJT Partners</span><span class="firm-pill">Moelis</span></div></div><h4>Middle Market Banks</h4><p>Work on smaller deals ($50M-$500M enterprise value).</p><div class="firm-tier"><div class="firm-tier-list"><span class="firm-pill">Houlihan Lokey</span><span class="firm-pill">William Blair</span><span class="firm-pill">Jefferies</span><span class="firm-pill">Piper Sandler</span><span class="firm-pill">Baird</span></div></div>` },
        { title:'Compensation', content:`<table class="salary-table"><tr><th>Level</th><th>Base Salary</th><th>Bonus Range</th><th>Total Comp</th></tr><tr><td>1st Year Analyst</td><td>$110,000</td><td>$80K-$120K</td><td>$190K-$230K</td></tr><tr><td>Associate</td><td>$175,000</td><td>$100K-$200K</td><td>$275K-$375K</td></tr><tr><td>Vice President</td><td>$250,000</td><td>$200K-$400K</td><td>$450K-$650K</td></tr><tr><td>Managing Director</td><td>$400,000+</td><td>$500K-$2M+</td><td>$1M-$3M+</td></tr></table>` },
        { title:'Culture, Hours & Lifestyle', content:`<p>Investment banking is known for demanding hours. At the analyst level, expect <strong>70-90 hours per week</strong> on average, with spikes to 100+ hours during live deals. Weekends are not guaranteed off - you may work partial or full weekends depending on deal flow.</p><p>The culture varies significantly by firm and group. Elite boutiques tend to have flatter hierarchies, while Bulge brackets are more structured but offer broader networks. The worst part isn't the hours themselves - it's the unpredictability. Exit opportunities to PE/VC are the main draw.</p>` },
      ]},
      { title:'The Recruiting Process', sections:[
        { title:'How Recruiting Works', content:`<p>Banks hire heavily through a structured pipeline. The vast majority of full-time analyst hires come directly from the summer internship class. To secure a full-time role, you must first secure a junior-year summer internship.</p><p>The process generally has four stages: resume drop, first-round interviews (often HireVue or on-campus), superdays (final rounds consisting of 3-5 back-to-back interviews), and the offer.</p>` },
        { title:'Timeline & Pathways', content:`<p><strong>Undergraduate Timeline:</strong> Recruiting for junior-year summer internships now starts incredibly early, often <strong>Sophomore Year Spring</strong> (over a year in advance). You must start networking and preparing technicals by the fall of your sophomore year.</p><p><strong>MBA Timeline:</strong> If you missed the undergrad window, top MBA programs (H/W/S, Booth, Columbia) allow you to recruit as an Associate during your first year.</p>` },
        { title:'The Interview Process', content:`<p>IB interviews are split between <strong>behaviorals</strong> ("Walk me through your resume", "Why this bank?") and <strong>technicals</strong> (Accounting, Valuation, DCF, LBOs).</p><div class="info-box tip"><div class="info-box-label">Ace Your Technicals with OfferBell</div>Don't get caught off guard. Use OfferBell's <strong>AI Coach</strong> to simulate realistic superdays. The Coach will drill you on accounting treatments and valuation methodologies until they are second nature.</div>` },
      ]},
      { title:'Networking & Prep', sections:[
        { title:'Why Networking Matters', content:`<p>In investment banking, networking is not optional - it's the primary way people get interviews. At target schools, campus recruiting handles the pipeline. At non-targets, networking is how you get your resume seen.</p><p>Coffee chats - informal 20-30 minute conversations with professionals - are your gateway. They build relationships, give you insider knowledge, and often lead directly to interview referrals.</p>` },
        { title:'Outreach Strategy', content:`<p>Your cold email should be under 100 words, highly personalized, and sent from your .edu address.</p><div class="info-box tip"><div class="info-box-label">Automate the Grind</div>Stop wasting hours searching for emails. Use our <strong>Outreach Writer</strong> to generate hyper-personalized, high-converting cold emails based on your profile and their firm in one click.</div>` },
        { title:'During the Coffee Chat', content:`<p><strong>The Sacred 30-Minute Rule:</strong> NEVER exceed 30 minutes unless they extend. At 25 minutes, mention you want to respect their time.</p><p>Ask insightful questions about their groups, recent deals, and culture. Don't ask questions you could easily Google.</p><div class="info-box tip"><div class="info-box-label">Log Your Interactions</div>Keep track of who replies to what. Log your calls in OfferBell's <strong>Network Tracker</strong>.</div>` },
      ]},
    ]
  },
  {
    id:'pe', title:'Private Equity', sub:'Buyouts, LBOs, portfolio companies',
    chapters: [
      { title:'What Is Private Equity?', sections:[
        { title:'Overview', content:`<p>Private equity firms raise capital from institutional investors and use it to buy companies, improve their operations, and sell them for a profit - typically over a 3-7 year holding period. The most common strategy is the <strong>leveraged buyout (LBO)</strong>.</p><p>The core thesis is simple: buy an asset, make it more valuable through revenue growth or cost cutting, and use debt to amplify your equity returns.</p>` },
        { title:'What They Actually Do', content:`<p>At the junior level (Associate), your work includes:</p><ul><li><strong>Deal sourcing:</strong> Reviewing potential investments and screening companies.</li><li><strong>Financial modeling:</strong> Building highly detailed LBO and operating models.</li><li><strong>Due diligence:</strong> Deep research into market dynamics and interviewing management teams.</li><li><strong>Portfolio monitoring:</strong> Tracking the real-world performance of acquired companies.</li></ul><p>Seniors (Partners) focus on deal origination, oversight, and fundraising.</p>` },
        { title:'Firm Tiers & Key Players', content:`<p>Firms are typically grouped by Assets Under Management (AUM):</p><h4>Mega-Funds ($10B+ AUM)</h4><div class="firm-tier"><div class="firm-tier-list"><span class="firm-pill">Blackstone</span><span class="firm-pill">KKR</span><span class="firm-pill">Apollo</span><span class="firm-pill">Carlyle</span><span class="firm-pill">TPG</span></div></div><h4>Upper Middle Market</h4><div class="firm-tier"><div class="firm-tier-list"><span class="firm-pill">Thoma Bravo</span><span class="firm-pill">Vista Equity</span><span class="firm-pill">Silver Lake</span><span class="firm-pill">Hellman & Friedman</span></div></div><h4>Middle Market</h4><p>Smaller deals, but often more hands-on operational exposure for juniors.</p>` },
        { title:'Compensation', content:`<table class="salary-table"><tr><th>Level</th><th>Base</th><th>Bonus</th><th>Total Comp</th></tr><tr><td>Associate</td><td>$150-$200K</td><td>$150-$250K</td><td>$300-$450K</td></tr><tr><td>VP / Principal</td><td>$250-$400K</td><td>$200-$600K</td><td>$450-$1M+</td></tr><tr><td>Partner</td><td>$500K-$1M</td><td>$500K-$2M+</td><td>$1.5M-$10M+</td></tr></table><p>The real wealth in PE is <strong>carried interest</strong> (a slice of the fund's profits), which vests over years and can be worth millions.</p>` },
        { title:'Culture, Hours & Lifestyle', content:`<p>Hours run <strong>60-75 per week</strong>. Unlike the chaotic, pitch-driven lifestyle of banking, PE hours are more predictable and diligence-driven. However, when a live deal is in its final stages, expect banking-style hours.</p><p>The culture is highly intellectual. In banking, the goal is getting the deal done. In PE, the goal is getting the <i>right</i> deal done. You must think like an owner, not an advisor.</p>` },
      ]},
      { title:'The Recruiting Process', sections:[
        { title:'How Recruiting Works', content:`<p>PE recruiting is notorious for its speed and intensity. The vast majority of hires are made through standard <strong>headhunter</strong> channels.</p><p>Firms hire candidates who have already completed (or are currently completing) a 2-year analyst stint in Investment Banking or MBB Consulting.</p>` },
        { title:'Timeline & Pathways', content:`<p><strong>On-Cycle Recruiting:</strong> A wildly compressed period (often just a few days in late summer/fall) where first-year IB analysts are recruited for PE associate roles that begin 1.5 to 2 years later.</p><p><strong>Off-Cycle Recruiting:</strong> Everything else. Usually much slower paced, occurring as firms realize they have headcount needs. Increasingly, top undergraduates from target schools are also being hired directly out of college.</p>` },
        { title:'The Interview Process', content:`<p>You will face intense LBO modeling tests (ranging from 1-hour paper LBOs to 4-hour comprehensive Excel models) alongside deep investment case studies.</p><div class="info-box tip"><div class="info-box-label">Master the Paper LBO</div>PE firms want to see how you think about value creation. Use OfferBell's <strong>AI Coach</strong> to simulate grueling investment committee presentations and practice articulating an investment thesis on the fly.</div>` },
      ]},
      { title:'Networking & Prep', sections:[
        { title:'Why Networking Matters', content:`<p>While Headhunters control the front door to mega-funds, networking is the secret backbone of off-cycle recruiting and middle-market funds. Making a direct connection with a partner can bypass the traditional headhunter screen entirely.</p>` },
        { title:'Outreach Strategy', content:`<p>When reaching out to PE associates or partners, your messaging must be sharp. Show you understand their specific investment mandate (e.g., enterprise software buyouts).</p><div class="info-box tip"><div class="info-box-label">Scale Your Outreach</div>Finding emails for smaller middle-market funds is notoriously difficult. Use OfferBell's <strong>Outreach Writer</strong> for a bespoke connection.</div>` },
        { title:'During the Coffee Chat', content:`<p>PE professionals are pressed for time. Skip the basic questions and ask about their recent portfolio company add-on acquisitions or how they are viewing current debt markets.</p><div class="info-box tip"><div class="info-box-label">Track Your Funnel</div>If you are running an off-cycle process, use OfferBell's <strong>Network Tracker</strong> to monitor every stage of your pipeline across dozens of funds..</div>` },
      ]},
    ]
  },
  {
    id:'consulting', title:'Consulting', sub:'Strategy, cases, client work',
    chapters: [
      { title:'What Is Consulting?', sections:[
        { title:'Overview', content:`<p>Management consulting firms advise corporations and organizations on their most pressing strategic, operational, and organizational challenges. Consultants are hired when a company needs a problem solved that it can't handle internally - market entry, massive reorganizations, or M&A integration.</p><p>Consulting is one of the premier breeding grounds for future Fortune 500 CEOs, providing broad exposure across multiple industries.</p>` },
        { title:'What They Actually Do', content:`<p>At the junior level (Business Analyst / Associate), your key tasks are:</p><ul><li><strong>Data Analysis:</strong> Crunching client data, market sizing, and building heavy Excel models.</li><li><strong>Slide Creation:</strong> Translating deep analysis into clear, actionable executive PowerPoint decks.</li><li><strong>Client Interviews:</strong> Conducting expert calls and interviewing the client's personnel to gather intelligence.</li></ul><p>Managers and Partners spend their time selling engagements and managing the high-level delivery of client work.</p>` },
        { title:'Firm Tiers & Key Players', content:`<p>Consulting firms fall into clear tiers of prestige and focus:</p><h4>MBB (The "Big Three")</h4><p>The undisputed top tier of pure strategy consulting.</p><div class="firm-tier"><div class="firm-tier-list"><span class="firm-pill">McKinsey</span><span class="firm-pill">Bain</span><span class="firm-pill">BCG (Boston Consulting Group)</span></div></div><h4>Tier 2 / Big 4 Strategy</h4><p>Excellent firms with a mix of pure strategy and operational implementation.</p><div class="firm-tier"><div class="firm-tier-list"><span class="firm-pill">Oliver Wyman</span><span class="firm-pill">LEK</span><span class="firm-pill">Strategy&</span><span class="firm-pill">EY-Parthenon</span><span class="firm-pill">Kearney</span></div></div>` },
        { title:'Compensation', content:`<table class="salary-table"><tr><th>Level</th><th>Base</th><th>Bonus</th><th>Total Comp</th></tr><tr><td>Business Analyst (UG)</td><td>$100-$110K</td><td>$15-$30K</td><td>$115-$140K</td></tr><tr><td>Consultant (post-MBA)</td><td>$190-$210K</td><td>$40-$60K</td><td>$230-$270K</td></tr><tr><td>Engagement Manager</td><td>$250-$300K</td><td>$80-$120K</td><td>$330-$420K</td></tr><tr><td>Partner</td><td>$500K-$1M+</td><td>$300K-$2M+</td><td>$1M-$3M+</td></tr></table><p>Consulting pays slightly less than investment banking but offers significantly better work-life balance and lifestyle perks.</p>` },
        { title:'Culture, Hours & Lifestyle', content:`<p>Expect <strong>55-70 hours per week</strong> at MBB, and 45-60 at other firms. The defining characteristic of the consulting lifestyle is <strong>travel</strong>.</p><p>The classic model is Monday-Thursday at the client site (flying out Monday 6 AM, flying back Thursday evening) and Fridays in your home office. The culture is highly collegiate, feedback-heavy, and collaborative compared to the sharper elbows sometimes found in finance.</p>` },
      ]},
      { title:'The Recruiting Process', sections:[
        { title:'How Recruiting Works', content:`<p>Consulting highly values target schools (Ivies, Stanford, MIT, etc.). Firms conduct heavy on-campus recruiting, structured resume drops, and standardized testing (like the McKinsey Solve game).</p>` },
        { title:'Timeline & Pathways', content:`<p><strong>Undergrads:</strong> Applications open in late summer/early fall of junior year for summer internships. Full-time recruiting begins the August before senior year.</p><p><strong>MBA / Advanced Degrees (PhD, MD, JD):</strong> Firms heavily recruit from top advanced degree programs, offering "bridge" programs during the summer to fast-track candidates.</p>` },
        { title:'The Interview Process', content:`<p>The centerpiece is the <strong>Case Interview</strong>. You are given a business problem (e.g., "Our client is an airline facing declining profitability. Why?") and must structure the problem, do mental math, and provide a recommendation in 30 minutes.</p><div class="info-box tip"><div class="info-box-label">Crush the Case Interview</div>Don't just memorize frameworks. You need practice presenting out loud. Use OfferBell's <strong>AI Coach</strong> for unlimited, real-time audio case interviews, simulating the strict pressure of an MBB Partner.</div>` },
      ]},
      { title:'Networking & Prep', sections:[
        { title:'Why Networking Matters', content:`<p>Unlike banking where networking guarantees an interview, in consulting, networking helps secure an internal referral, which drastically increases the likelihood of your resume passing the initial screen.</p>` },
        { title:'Outreach Strategy', content:`<p>Consultants appreciate structured communication. Your emails must be MECE (Mutually Exclusive, Collectively Exhaustive) - short, punchy, and clear in their ask.</p><div class="info-box tip"><div class="info-box-label">The Perfect Pitch</div>Ensure your cold email is perfectly structured with OfferBell's <strong>Outreach Writer</strong>, which generates highly professional, succinct asks favored by consultants.</div>` },
        { title:'During the Coffee Chat', content:`<p>Use coffee chats to probe the realities of their staffing model. Ask about their favorite casework. Most importantly, demonstrate your inherent structured thinking in how you construct your questions.</p><div class="info-box tip"><div class="info-box-label">Data-Driven Networking</div>Consultants love data. Track it all via your <strong>Network Tracker</strong>.</div>` },
      ]},
    ]
  },
  {
    id:'ge', title:'Growth Equity', sub:'Scaling companies, minority stakes',
    chapters: [
      { title:'What Is Growth Equity?', sections:[
        { title:'Overview', content:`<p>Growth Equity sits right between Venture Capital and conventional Private Equity. GE firms invest in heavily de-risked companies with proven product-market fit and recurring revenues, that simply need massive capital injections to scale globally or dominate their market.</p><p>Unlike VC, the companies aren't burning cash on experiments; unlike PE, the returns don't rely heavily on massive debt (leverage) restructuring.</p>` },
        { title:'What They Actually Do', content:`<p>Growth Equity is fundamentally about <strong>sourcing</strong>. At the junior level, you are a hunter.</p><ul><li><strong>Deal Sourcing (Outbound):</strong> You will send thousands of emails and make hundreds of cold calls to founders of bootstrapped SaaS companies trying to convince them to take your firm's money.</li><li><strong>Market Mapping:</strong> Analyzing entire software ecosystems to identify the fastest growing startups.</li><li><strong>Financial Modeling:</strong> Building growth models and unit economic assessments (LTV/CAC, cohort analysis), rather than complex LBO debt schedules.</li></ul>` },
        { title:'Firm Tiers & Key Players', content:`<p>GE has firms focusing heavily on software, healthcare, and internet consumer tech:</p><h4>Top Tier Generalists & Tech Leaders</h4><div class="firm-tier"><div class="firm-tier-list"><span class="firm-pill">General Atlantic</span><span class="firm-pill">TA Associates</span><span class="firm-pill">Summit Partners</span><span class="firm-pill">Insight Partners</span><span class="firm-pill">TCV</span><span class="firm-pill">Bessemer</span><span class="firm-pill">a16z Growth</span></div></div>` },
        { title:'Compensation', content:`<table class="salary-table"><tr><th>Level</th><th>Base</th><th>Bonus</th><th>Total Comp</th></tr><tr><td>Analyst (UG)</td><td>$90-$110K</td><td>$30-$60K</td><td>$120-$170K</td></tr><tr><td>Associate</td><td>$130-$175K</td><td>$80-$150K</td><td>$210-$325K</td></tr><tr><td>VP</td><td>$200-$300K</td><td>$150-$350K</td><td>$350-$650K+ (plus carry)</td></tr></table><p>Cash compensation is lower than mega-fund PE, but lifestyle is better and the long-term carry potential on a unicorn exit can be staggering.</p>` },
        { title:'Culture, Hours & Lifestyle', content:`<p>Hours are highly sustainable, sitting right around <strong>50-60 a week</strong>. The culture is notoriously outgoing-you are essentially in high-end B2B sales when sourcing. You must be deeply curious about technology trends and incredibly comfortable talking to millionaire founders.</p>` },
      ]},
      { title:'The Recruiting Process', sections:[
        { title:'How Recruiting Works', content:`<p>Unlike standard PE, Growth Equity recruits heavily both from Investment Banking analyst classes <em>and</em> directly out of undergrad. Firms like Summit and TA Associates have massive, well-structured undergraduate analyst programs.</p>` },
        { title:'Timeline & Pathways', content:`<p>For undergrads, recruiting happens early in junior year alongside banking. For off-cycle professionals, lateral movement from product management, tech IB, and consulting is very common.</p>` },
        { title:'The Interview Process', content:`<p>Interviews blend PE and VC styles. You will do high-level modeling tests, but the defining interview is the <strong>Sourcing Test</strong> or <strong>Market Map</strong>. They will ask you to pitch 3 companies you believe they should invest in and defend the unit economics.</p><div class="info-box tip"><div class="info-box-label">Nail the Pitch</div>Use OfferBell's <strong>AI Coach</strong> to simulate arguing a tech investment thesis. Practice defending why a business's churn rate and CAC payback period makes it an ideal growth investment.</div>` },
      ]},
      { title:'Networking & Prep', sections:[
        { title:'Why Networking Matters', content:`<p>Because sourcing is half the job, showing that you can network your way into a coffee chat <em>proves</em> you have the exact skillset required to be a phenomenal GE associate.</p>` },
        { title:'Outreach Strategy', content:`<p>Be persistent. Growth equity professionals respect the hustle more than anyone else because they do it themselves every day.</p><div class="info-box tip"><div class="info-box-label">Outsource the Friction</div>Draft highly personalized cold emails with our <strong>Outreach Writer</strong>, allowing you to scale your networking like a pro.</div>` },
        { title:'During the Coffee Chat', content:`<p>Come prepared with ideas. Do not just ask about their career; pitch them a thesis. "I've been looking at the vertical SaaS space for construction, have you guys looked at Company X?"</p><div class="info-box tip"><div class="info-box-label">Track Every Touchpoint</div>Your network is your funnel. Keep rigorous tabs of your follow-ups using OfferBell's <strong>Network Tracker</strong>.</div>` },
      ]},
    ]
  },
  {
    id:'am', title:'Asset Management', sub:'Portfolios, mutual funds, long-term investing',
    chapters: [
      { title:'What Is Asset Management?', sections:[
        { title:'Overview', content:`<p>Asset Management (AM) firms manage massive pools of capital on behalf of institutions (pensions, endowments) and retail investors through mutual funds and ETFs. Unlike the rapid trading of hedge funds, traditional AM is characterized by long-term, fundamentals-based, "buy and hold" investing.</p><p>It is one of the most stable, intellectually stimulating, and highly coveted careers in the entire finance ecosystem.</p>` },
        { title:'What They Actually Do', content:`<p>The work revolves entirely around deep public-markets research.</p><ul><li><strong>Research Associates:</strong> Cover specific sectors (e.g. Healthcare), read annual reports, talk to management teams, and build multi-year earnings models.</li><li><strong>Portfolio Managers (PMs):</strong> Consume the research from their team and make the ultimate decisions on capital allocation across a billion-dollar fund.</li></ul><p>There is very little "execution" work or slide-making compared to banking. It is pure reading, modeling, and thinking.</p>` },
        { title:'Firm Tiers & Key Players', content:`<p>The industry is dominated by massive asset gatherers that hold trillions in AUM:</p><h4>The Titans</h4><div class="firm-tier"><div class="firm-tier-list"><span class="firm-pill">Fidelity</span><span class="firm-pill">Vanguard</span><span class="firm-pill">Capital Group</span><span class="firm-pill">T. Rowe Price</span><span class="firm-pill">Wellington</span><span class="firm-pill">BlackRock</span><span class="firm-pill">PIMCO</span></div></div>` },
        { title:'Compensation', content:`<table class="salary-table"><tr><th>Level</th><th>Base</th><th>Bonus</th><th>Total Comp</th></tr><tr><td>Associate (UG)</td><td>$100-$120K</td><td>$30-$50K</td><td>$130-$170K</td></tr><tr><td>Analyst (Post-MBA)</td><td>$150-$200K</td><td>$100-$200K</td><td>$250-$400K</td></tr><tr><td>Senior Analyst</td><td>$200-$300K</td><td>$200K-$600K</td><td>$400K-$900K</td></tr><tr><td>Portfolio Manager</td><td>$300-$500K</td><td>$1M-$5M+</td><td>$1.5M-$5M++</td></tr></table><p>Compensation scales enormously if your fund performs well. The key difference is the longevity-bankers burn out in 2 years; Portfolio Managers stay in their seats for 30 decades.</p>` },
        { title:'Culture, Hours & Lifestyle', content:`<p>The golden goose of finance. Hours are typically <strong>50-55 per week</strong>, heavily aligned to stock market hours. Weekends are almost always completely free. The culture is academic, quiet, and deeply focused on being right rather than being fast. Getting the <strong>CFA designation</strong> is highly respected and heavily subsidized.</p>` },
      ]},
      { title:'The Recruiting Process', sections:[
        { title:'How Recruiting Works', content:`<p>Extremely competitive but highly structured. Fidelity, Capital Group, and Wellington run notoriously selective undergraduate and MBA internship tracks. Headcount is incredibly small compared to banking classes.</p>` },
        { title:'Timeline & Pathways', content:`<p>Top undergrads recruit during their junior year. Post-MBA is a very common entry point. Lateraling from Equity Research (sell-side) at an investment bank into AM (buy-side) is the standard lateral path.</p>` },
        { title:'The Interview Process', content:`<p>You must know the markets. The core of the interview is the <strong>Stock Pitch</strong>. You will be expected to present a fully vetted long or short pitch on a public equities company, complete with catalysts, valuation metrics, and risk factors.</p><div class="info-box tip"><div class="info-box-label">Nail the Pitch</div>A weak stock pitch is an instant rejection. Refine your investment thesis using OfferBell's <strong>AI Coach</strong> to simulate aggressive pushback from a skeptical Portfolio Manager.</div>` },
      ]},
      { title:'Networking & Prep', sections:[
        { title:'Why Networking Matters', content:`<p>Asset managers are highly protective of their culture. Networking isn't just about getting the interview-it's about demonstrating your passion for investing and getting internal champions who can vouch for your personality.</p>` },
        { title:'Outreach Strategy', content:`<p>Reach out to junior analysts covering sectors you find interesting. Attach a 1-page stock writeup to show you actually know how to do the work.</p><div class="info-box tip"><div class="info-box-label">The Edge in Access</div>Let the <strong>Outreach Writer</strong> format your introduction perfectly so you can focus on building your actual stock pitch.</div>` },
        { title:'During the Coffee Chat', content:`<p>Ask about their investment philosophy. Talk about the markets. If the S&P dropped 2% yesterday, you better have a reasoned opinion on why.</p><div class="info-box tip"><div class="info-box-label">Analytics for the Buy-Side</div>Treat your networking like your portfolio. Monitor your networking progress with OfferBell's <strong>Network Tracker</strong>.</div>` },
      ]},
    ]
  },
  {
    id:'accounting', title:'Accounting & Audit', sub:'Big 4, tax, advisory, compliance',
    chapters: [
      { title:'What Is Public Accounting?', sections:[
        { title:'Overview', content:`<p>The "Big 4" public accounting firms dominate the global landscape for audit, tax, and advisory services. They provide the critical financial foundation and compliance checks that allow public markets and multinational corporations to operate.</p><p>A starting career in audit or tax provides unmatched visibility into corporate financials, serving as a powerful launching pad for CFO and controllership paths.</p>` },
        { title:'Firm Tiers & Key Players', content:`<p>The industry is famously consolidated at the top:</p><h4>The Big 4</h4><div class="firm-tier"><div class="firm-tier-list"><span class="firm-pill">Deloitte</span><span class="firm-pill">PwC</span><span class="firm-pill">EY</span><span class="firm-pill">KPMG</span></div></div><h4>Mid-Tier / Regional Leaders</h4><div class="firm-tier"><div class="firm-tier-list"><span class="firm-pill">RSM</span><span class="firm-pill">BDO</span><span class="firm-pill">Grant Thornton</span><span class="firm-pill">CBIZ</span></div></div>` },
        { title:'Compensation', content:`<table class="salary-table"><tr><th>Level</th><th>Base Salary</th><th>Bonus</th><th>Total Comp</th></tr><tr><td>Associate (Year 1)</td><td>$70K-$85K</td><td>$2K-$5K</td><td>$72K-$90K</td></tr><tr><td>Senior Associate</td><td>$90K-$115K</td><td>$5K-$10K</td><td>$95K-$125K</td></tr><tr><td>Manager</td><td>$130K-$160K</td><td>$10K-$20K</td><td>$140K-$180K</td></tr><tr><td>Partner</td><td>$300K+</td><td>Profit Share</td><td>$400K-$1M+</td></tr></table>` },
        { title:'Culture & Lifestyle', content:`<p>Hours are highly seasonal. During "busy season" (January to April for audit/tax), <strong>60-80 hour weeks</strong> are the norm. During the summer, hours often drop to 40 or even less. The CPA exam is essentially mandatory for promotion to Manager and beyond.</p>` },
      ]},
      { title:'The Recruiting Process', sections:[
        { title:'How Recruiting Works', content:`<p>The Big 4 hire in massive volume compared to investment banks, but the process begins just as early. Securing a "Summer Leadership Program" (SLP) during your sophomore year is the most reliable path to a junior-year intersection and subsequent full-time offer.</p>` },
        { title:'The Interview Process', content:`<p>Interviews are heavily behavioral. Firms test for "fit"-whether you can survive long hours in a cramped audit room with your team and confidently speak to client controllers. Technical questions will test basic accounting principles (e.g. depreciation schedules, deferred tax assets).</p><div class="info-box tip"><div class="info-box-label">Nail the Technicals</div>Use OfferBell's <strong>AI Coach</strong> to simulate Big 4 accounting questions, drilling journal entries and financial statement flows until they are automatic.</div>` },
      ]},
      { title:'Networking & Prep', sections:[
        { title:'Why Networking Matters', content:`<p>Because the Big 4 hire thousands of students, networking ensures your resume doesn't get lost in the portal. A referral from a Manager or Partner guarantees a first-round interview.</p>` },
        { title:'Outreach Strategy', content:`<p>Campus recruiters are the gatekeepers. Connect with them and school alumni early. Use the <strong>Outreach Writer</strong> to craft an introduction.</p>` },
      ]},
    ]
  },

  // ── Sales & Trading ──
  {
    id:'st', title:'Sales & Trading', sub:'Trading, research, algorithms',
    chapters:[
      { title:'What Is Sales & Trading?', sections:[
        { title:'Overview', content:`<p>Sales & Trading (S&T) is a division within investment banks that facilitates the buying and selling of financial instruments - stocks, bonds, commodities, derivatives, and currencies. Unlike investment banking, which is advisory, S&T is about <strong>making markets</strong> and <strong>managing risk</strong> in real time.</p><p>S&T professionals sit on the "sell side," connecting institutional investors (hedge funds, pension funds, asset managers) with the securities they want to buy or sell. The division generates revenue through bid-ask spreads, commissions, and proprietary positioning.</p>` },
        { title:'The Three Desks', content:`<p><strong>Sales:</strong> The relationship managers. They talk to institutional clients, understand their investment needs, and pitch trade ideas. Think of them as the bridge between the client and the trading floor.</p><p><strong>Trading:</strong> The execution engine. Traders make markets, manage inventory risk, and execute client orders. They are compensated on P&L - the actual money they make for the bank.</p><p><strong>Structuring:</strong> The engineers. They design custom derivative products for clients with specific hedging or investment needs. Highly quantitative.</p>` },
        { title:'Firm Tiers & Key Players', content:`<h4>Top S&T Franchises</h4><div class="firm-tier"><div class="firm-tier-list"><span class="firm-pill">Goldman Sachs</span><span class="firm-pill">J.P. Morgan</span><span class="firm-pill">Morgan Stanley</span><span class="firm-pill">Citi</span><span class="firm-pill">Bank of America</span></div></div><h4>Strong European Desks</h4><div class="firm-tier"><div class="firm-tier-list"><span class="firm-pill">Barclays</span><span class="firm-pill">Deutsche Bank</span><span class="firm-pill">UBS</span><span class="firm-pill">BNP Paribas</span></div></div>` },
        { title:'Compensation', content:`<table class="salary-table"><tr><th>Level</th><th>Base</th><th>Bonus</th><th>Total Comp</th></tr><tr><td>Analyst</td><td>$100-$110K</td><td>$50-$100K</td><td>$150-$210K</td></tr><tr><td>Associate</td><td>$150-$200K</td><td>$100-$250K</td><td>$250-$450K</td></tr><tr><td>VP/Director</td><td>$200-$300K</td><td>$200-$500K+</td><td>$400K-$800K+</td></tr><tr><td>MD</td><td>$400K+</td><td>$500K-$3M+</td><td>$1M-$5M+</td></tr></table><p>Compensation is more variable than IB - it's tied directly to your desk's P&L and individual contribution.</p>` },
        { title:'Culture, Hours & Lifestyle', content:`<p>Hours are <strong>market-driven</strong>: typically 7AM-6PM (equities) or 6AM-5PM (fixed income/FX). Live markets mean predictable hours - when the market closes, you can go home. Weekends are generally free unless you're studying for a licensing exam.</p><p>The culture is faster-paced and more meritocratic than IB. Performance is measured daily via P&L. It's less political but more stressful in real-time. You're making split-second decisions with millions of dollars.</p>` },
      ]},
      { title:'The Recruiting Process', sections:[
        { title:'How Recruiting Works', content:`<p>S&T hiring follows the same structure as IB: sophomore year networking → junior year summer internship → full-time conversion. However, S&T interviews test very different skills - market knowledge, mental math, and risk intuition rather than DCFs and LBOs.</p>` },
        { title:'The Interview Process', content:`<p>Expect a mix of:</p><ul><li><strong>Market questions:</strong> "Where is the S&P 500 trading? What happened to oil prices this week? What's the 10-year Treasury yield?"</li><li><strong>Brainteasers & probability:</strong> "I flip a coin - if it's heads, I give you $10. If tails, you give me $5. Would you play?"</li><li><strong>Trading games:</strong> Mock trading exercises testing risk management and quick math.</li><li><strong>Behavioral:</strong> "Why S&T over IB?" "Why trading over sales?"</li></ul>` },
      ]},
      { title:'Networking & Prep', sections:[
        { title:'How to Stand Out', content:`<p>Read the WSJ and Bloomberg daily. Have a view on markets. Know current rates, indices, and recent moves. Use OfferBell's <strong>Market Intel</strong> to stay sharp on what's moving and why. Practice mental math and probability daily.</p>` },
      ]},
    ]
  },

  // ── Equity Research ──
  {
    id:'er', title:'Equity Research', sub:'Stock analysis, coverage, reports',
    chapters:[
      { title:'What Is Equity Research?', sections:[
        { title:'Overview', content:`<p>Equity Research (ER) analysts study public companies in specific sectors and publish research reports with buy, hold, or sell recommendations. They are the sell-side's "opinion engine" - institutional investors (hedge funds, mutual funds) rely on ER reports to inform their investment decisions.</p><p>Unlike IB (which advises on transactions), ER is about <strong>deep fundamental analysis</strong> of businesses and forming a view on their stock price.</p>` },
        { title:'What They Actually Do', content:`<p>At the junior level (Research Associate), your work includes:</p><ul><li><strong>Modeling:</strong> Building and maintaining detailed financial models for companies in your coverage universe.</li><li><strong>Writing:</strong> Drafting research notes, earnings previews, initiation reports (30-50 page deep dives).</li><li><strong>Industry analysis:</strong> Tracking industry trends, attending conferences, listening to earnings calls.</li><li><strong>Client interaction:</strong> Hosting calls with buy-side investors to discuss your views.</li></ul>` },
        { title:'Firm Tiers & Key Players', content:`<h4>Top ER Platforms</h4><div class="firm-tier"><div class="firm-tier-list"><span class="firm-pill">Goldman Sachs</span><span class="firm-pill">J.P. Morgan</span><span class="firm-pill">Morgan Stanley</span><span class="firm-pill">BofA Securities</span><span class="firm-pill">Barclays</span></div></div><h4>Strong Independents</h4><div class="firm-tier"><div class="firm-tier-list"><span class="firm-pill">Bernstein</span><span class="firm-pill">Wolfe Research</span><span class="firm-pill">Cowen</span><span class="firm-pill">Evercore ISI</span></div></div>` },
        { title:'Compensation', content:`<table class="salary-table"><tr><th>Level</th><th>Base</th><th>Bonus</th><th>Total Comp</th></tr><tr><td>Research Associate</td><td>$100-$125K</td><td>$50-$100K</td><td>$150-$225K</td></tr><tr><td>Senior Associate / VP</td><td>$150-$250K</td><td>$100-$300K</td><td>$250-$550K</td></tr><tr><td>Senior Analyst (Named)</td><td>$300-$500K</td><td>$300K-$2M+</td><td>$600K-$3M+</td></tr></table><p>Comp is lower than IB at the junior level, but top-ranked senior analysts can earn $1M+ and become franchise players.</p>` },
        { title:'Culture, Hours & Lifestyle', content:`<p>Hours are <strong>50-65 per week</strong> normally, spiking to 70+ during earnings season (4 times a year). The rhythm is predictable - you know when earnings are and can plan around them.</p><p>It's one of the best lifestyle-to-comp ratios on Wall Street. You're paid to think deeply about businesses, write well, and form opinions - not pull all-nighters on pitch books.</p>` },
      ]},
      { title:'The Recruiting Process', sections:[
        { title:'How Recruiting Works', content:`<p>ER recruiting is less structured than IB. Many roles are filled through networking and direct applications. Some banks have formal summer programs; others hire on an as-needed basis when a senior analyst needs an associate.</p>` },
        { title:'The Interview Process', content:`<p>Expect:</p><ul><li><strong>Stock pitch:</strong> "Pitch me a stock you'd buy right now." This is the centerpiece of every ER interview.</li><li><strong>Accounting & valuation:</strong> DCF, comps, financial statement analysis.</li><li><strong>Industry knowledge:</strong> Deep questions about the sector you're interviewing for.</li><li><strong>Writing sample:</strong> Some firms ask for a sample research report or investment thesis.</li></ul>` },
      ]},
      { title:'Networking & Prep', sections:[
        { title:'How to Stand Out', content:`<p>Prepare 2-3 polished stock pitches with clear catalysts, valuation support, and risk/mitigants. Read 10-Ks, listen to earnings calls, and develop a genuine interest in following companies. Use OfferBell's <strong>Coach</strong> to practice pitching stocks and getting feedback on your thesis structure.</p>` },
      ]},
    ]
  },

  // ── Real Estate ──
  {
    id:'re', title:'Real Estate', sub:'REPE, REITs, development, brokerage',
    chapters:[
      { title:'What Is Real Estate Finance?', sections:[
        { title:'Overview', content:`<p>Real estate finance encompasses the investment, development, and management of physical properties - office buildings, apartments, retail centers, industrial warehouses, and hotels. The two main career paths are <strong>Real Estate Private Equity (REPE)</strong> and <strong>REITs (Real Estate Investment Trusts)</strong>.</p><p>REPE firms acquire, improve, and sell properties using leverage - similar to traditional PE but with real assets instead of companies. REITs are publicly traded companies that own and operate income-producing real estate.</p>` },
        { title:'Key Sectors', content:`<ul><li><strong>Multifamily:</strong> Apartment complexes. Considered the most recession-resistant.</li><li><strong>Office:</strong> Commercial office space. Highly cyclical post-COVID.</li><li><strong>Industrial:</strong> Warehouses and logistics centers. Booming due to e-commerce.</li><li><strong>Retail:</strong> Shopping centers and malls. Challenged but selectively attractive.</li><li><strong>Hospitality:</strong> Hotels and resorts. Highest risk, highest return potential.</li></ul>` },
        { title:'Firm Tiers & Key Players', content:`<h4>REPE Mega-Funds</h4><div class="firm-tier"><div class="firm-tier-list"><span class="firm-pill">Blackstone Real Estate</span><span class="firm-pill">Brookfield</span><span class="firm-pill">Starwood Capital</span><span class="firm-pill">KKR Real Estate</span></div></div><h4>Dedicated RE Firms</h4><div class="firm-tier"><div class="firm-tier-list"><span class="firm-pill">Hines</span><span class="firm-pill">Tishman Speyer</span><span class="firm-pill">Related Companies</span><span class="firm-pill">Greystar</span></div></div><h4>Top REITs</h4><div class="firm-tier"><div class="firm-tier-list"><span class="firm-pill">Prologis</span><span class="firm-pill">Equity Residential</span><span class="firm-pill">Simon Property Group</span><span class="firm-pill">Digital Realty</span></div></div>` },
        { title:'Compensation', content:`<table class="salary-table"><tr><th>Level</th><th>Base</th><th>Bonus</th><th>Total Comp</th></tr><tr><td>Analyst</td><td>$80-$100K</td><td>$20-$60K</td><td>$100-$160K</td></tr><tr><td>Associate</td><td>$120-$160K</td><td>$50-$150K</td><td>$170-$310K</td></tr><tr><td>VP / Principal</td><td>$200-$350K</td><td>$150-$500K</td><td>$350K-$850K</td></tr><tr><td>Partner / MD</td><td>$400K+</td><td>Carry + bonus</td><td>$1M-$5M+</td></tr></table>` },
        { title:'Culture, Hours & Lifestyle', content:`<p>Hours are <strong>55-70 per week</strong> at REPE firms, less at REITs and development companies. Real estate is tangible - you visit properties, walk construction sites, and negotiate with tenants. Many people love it because you can see and touch what you invest in.</p>` },
      ]},
      { title:'The Recruiting Process', sections:[
        { title:'How Recruiting Works', content:`<p>Real estate recruiting is less structured than IB/PE. Many positions are filled through networking and real estate-specific programs. Top feeder paths include IB real estate groups, REPE internships, and dedicated undergraduate real estate programs (Wharton, Wisconsin, Georgetown).</p>` },
        { title:'The Interview Process', content:`<p>Expect:</p><ul><li><strong>Real estate financial modeling:</strong> Pro forma models, development models, waterfall structures.</li><li><strong>Market knowledge:</strong> Cap rates, NOI, occupancy trends in specific markets.</li><li><strong>Deal walkthroughs:</strong> "Walk me through how you'd evaluate an apartment building acquisition."</li><li><strong>Case studies:</strong> Given a property and financials, determine whether to invest.</li></ul>` },
      ]},
      { title:'Networking & Prep', sections:[
        { title:'How to Stand Out', content:`<p>Learn the language: cap rate, NOI, IRR, cash-on-cash return, debt service coverage ratio. Understand how a real estate pro forma works. Follow local and national market trends via CBRE, JLL, and CoStar reports.</p>` },
      ]},
    ]
  },

  // ── Venture Capital ──
  {
    id:'vc', title:'Venture Capital', sub:'Startups, seed to growth stage',
    chapters:[
      { title:'What Is Venture Capital?', sections:[
        { title:'Overview', content:`<p>Venture Capital (VC) firms invest in early-stage startups and high-growth companies in exchange for equity ownership. Unlike PE (which buys mature companies with debt), VC invests in companies that often have little or no revenue - betting on the founder, the product, and the market opportunity.</p><p>VC is about <strong>pattern recognition</strong>: identifying which founding teams and markets have the potential for 10-100x returns.</p>` },
        { title:'The VC Stages', content:`<ul><li><strong>Pre-Seed / Seed:</strong> $100K-$3M checks. Investing in an idea or early prototype. Highest risk, highest potential return.</li><li><strong>Series A:</strong> $5-$15M. Product-market fit has been demonstrated. The company needs capital to scale.</li><li><strong>Series B-C:</strong> $20-$100M+. Growth-stage investing. The company is scaling revenue and building out the team.</li><li><strong>Late-Stage / Growth:</strong> $100M+. Near-IPO companies. Lower risk, lower return multiple.</li></ul>` },
        { title:'Firm Tiers & Key Players', content:`<h4>Top-Tier VC Firms</h4><div class="firm-tier"><div class="firm-tier-list"><span class="firm-pill">Sequoia Capital</span><span class="firm-pill">Andreessen Horowitz (a16z)</span><span class="firm-pill">Benchmark</span><span class="firm-pill">Lightspeed</span><span class="firm-pill">Accel</span></div></div><h4>Growth-Stage</h4><div class="firm-tier"><div class="firm-tier-list"><span class="firm-pill">General Catalyst</span><span class="firm-pill">Tiger Global</span><span class="firm-pill">Coatue</span><span class="firm-pill">Insight Partners</span></div></div><h4>Seed-Stage</h4><div class="firm-tier"><div class="firm-tier-list"><span class="firm-pill">Y Combinator</span><span class="firm-pill">First Round Capital</span><span class="firm-pill">Lux Capital</span><span class="firm-pill">Founders Fund</span></div></div>` },
        { title:'Compensation', content:`<table class="salary-table"><tr><th>Level</th><th>Base</th><th>Bonus / Carry</th><th>Total Comp</th></tr><tr><td>Analyst</td><td>$80-$120K</td><td>$10-$30K</td><td>$90-$150K</td></tr><tr><td>Associate</td><td>$120-$180K</td><td>$30-$80K + small carry</td><td>$150-$260K</td></tr><tr><td>Principal / VP</td><td>$200-$350K</td><td>Significant carry</td><td>$400K-$1M+</td></tr><tr><td>Partner</td><td>$300-$500K</td><td>Carry (fund-dependent)</td><td>$1M-$20M+</td></tr></table><p>Base pay is lower than PE/IB, but carried interest from successful exits (IPOs, acquisitions) is where the real wealth is created.</p>` },
        { title:'Culture, Hours & Lifestyle', content:`<p>Hours are <strong>50-60 per week</strong>, making VC one of the best lifestyles in finance. However, the work is always-on - you're constantly reading, networking, and evaluating opportunities. The culture is entrepreneurial and intellectually curious. You attend conferences, meet founders, and stay on top of technology trends.</p>` },
      ]},
      { title:'The Recruiting Process', sections:[
        { title:'How Recruiting Works', content:`<p>VC recruiting is the <strong>least structured</strong> path in finance. There is no centralized recruiting process. Most junior roles are filled through: direct networking, founder referrals, VC fellowship programs (like Kauffman Fellows), or transitions from IB/consulting/startups.</p><p>Some firms hire undergrads for 2-year analyst programs, but these are rare and ultra-competitive.</p>` },
        { title:'The Interview Process', content:`<p>Expect:</p><ul><li><strong>Market mapping:</strong> "What sectors excite you and why?"</li><li><strong>Startup evaluation:</strong> "Here's a pitch deck - would you invest?"</li><li><strong>Company deep-dives:</strong> "Tell me about a company you think is undervalued."</li><li><strong>Founder empathy:</strong> "What makes a great founding team?"</li><li><strong>Portfolio construction:</strong> Understanding power law, fund math, ownership targets.</li></ul>` },
      ]},
      { title:'Networking & Prep', sections:[
        { title:'How to Stand Out', content:`<p>Build a thesis. Identify 2-3 sectors you're genuinely passionate about and develop deep knowledge. Start a blog, write deal memos, or participate in VC fellowships. Network relentlessly with VCs and founders. Use OfferBell's <strong>Outreach Writer</strong> to craft cold emails to VCs that demonstrate your sector knowledge.</p>` },
      ]},
    ]
  },

  // ── Restructuring ──
  {
    id:'rx', title:'Restructuring', sub:'Distressed debt, turnarounds, bankruptcy',
    chapters:[
      { title:'What Is Restructuring?', sections:[
        { title:'Overview', content:`<p>Restructuring (RX) is the process of reorganizing a company's financial structure when it is in financial distress - facing potential bankruptcy, covenant violations, or inability to service debt. Restructuring professionals advise either the company (debtor) or the creditors (lenders) on how to renegotiate obligations and preserve value.</p><p>Unlike IB (which works on healthy companies doing M&A), restructuring works on <strong>companies in crisis</strong>. It is considered one of the most intellectually challenging areas of finance because it requires deep knowledge of capital structure, bankruptcy law, and negotiation dynamics.</p>` },
        { title:'What They Actually Do', content:`<ul><li><strong>Liability management:</strong> Analyzing the company's debt stack and finding ways to reduce obligations.</li><li><strong>Liquidity analysis:</strong> Building 13-week cash flow models to determine how long the company can survive.</li><li><strong>Negotiation:</strong> Mediating between debtors, creditors, and equity holders over who takes losses.</li><li><strong>Valuation in distress:</strong> Determining enterprise value when traditional metrics break down.</li><li><strong>Plan of Reorganization:</strong> Structuring the terms under which a company exits bankruptcy.</li></ul>` },
        { title:'Firm Tiers & Key Players', content:`<h4>Elite RX Advisory</h4><div class="firm-tier"><div class="firm-tier-list"><span class="firm-pill">Houlihan Lokey</span><span class="firm-pill">PJT Partners</span><span class="firm-pill">Evercore</span><span class="firm-pill">Lazard</span><span class="firm-pill">Moelis</span></div></div><h4>Bulge Bracket RX Groups</h4><div class="firm-tier"><div class="firm-tier-list"><span class="firm-pill">Goldman Sachs</span><span class="firm-pill">J.P. Morgan</span><span class="firm-pill">Morgan Stanley</span></div></div><h4>Distressed Debt Funds (Buy-Side)</h4><div class="firm-tier"><div class="firm-tier-list"><span class="firm-pill">Apollo</span><span class="firm-pill">Oaktree Capital</span><span class="firm-pill">Elliott Management</span><span class="firm-pill">Cerberus</span></div></div>` },
        { title:'Compensation', content:`<table class="salary-table"><tr><th>Level</th><th>Base</th><th>Bonus</th><th>Total Comp</th></tr><tr><td>Analyst</td><td>$110-$120K</td><td>$80-$130K</td><td>$190-$250K</td></tr><tr><td>Associate</td><td>$175-$225K</td><td>$120-$250K</td><td>$295-$475K</td></tr><tr><td>VP</td><td>$250-$350K</td><td>$200-$400K</td><td>$450-$750K</td></tr><tr><td>MD</td><td>$400K+</td><td>$500K-$2M+</td><td>$1M-$3M+</td></tr></table><p>Restructuring comp is on par with top IB groups and tends to be <strong>counter-cyclical</strong> - when the economy tanks, RX bankers are busiest and best-paid.</p>` },
        { title:'Culture, Hours & Lifestyle', content:`<p>Hours are <strong>70-85 per week</strong>, comparable to IB. When a company is on the brink of bankruptcy, timelines are compressed and the work is urgent. The culture attracts highly analytical, argumentative personalities who enjoy the intellectual combat of creditor negotiations.</p><p>The upside: restructuring is one of the most recession-proof careers in finance. When markets crash, your phone rings.</p>` },
      ]},
      { title:'The Recruiting Process', sections:[
        { title:'How Recruiting Works', content:`<p>RX recruiting follows IB timelines. Top RX groups (Houlihan Lokey, PJT, Evercore) recruit through the same OCR and networking channels as M&A groups. Many analysts rotate into restructuring from other IB groups after their first year.</p>` },
        { title:'The Interview Process', content:`<p>Expect:</p><ul><li><strong>Accounting deep-dives:</strong> 3-statement mastery, especially around debt and equity.</li><li><strong>Distressed-specific technicals:</strong> "What is a credit default swap?" "Walk me through a Chapter 11 process." "What is DIP financing?"</li><li><strong>Capital structure analysis:</strong> "Who gets paid first in a liquidation?"</li><li><strong>Behavioral:</strong> "Why restructuring over M&A?" - must show genuine intellectual curiosity about distress.</li></ul>` },
      ]},
      { title:'Networking & Prep', sections:[
        { title:'How to Stand Out', content:`<p>Understand the bankruptcy code (Chapter 7 vs. 11), priority of claims (the "waterfall"), and distressed valuation concepts. Follow distressed situations in the news (large bankruptcies, debt restructurings). Use OfferBell's <strong>Coach</strong> to practice RX-specific technical questions.</p>` },
      ]},
    ]
  },
];


/* ── Components ── */
function Chevron({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><polyline points="6 9 12 15 18 9"/></svg>;
}

function ExpandCard({ num, title, content, defaultOpen }: { num:number; title:string; content:string; defaultOpen?:boolean }) {
  const [open, setOpen] = useState(defaultOpen || false);
  return (
    <div className={'expand-card'+(open?' open':'')}>
      <div className="expand-header" onClick={()=>setOpen(!open)}>
        <div className="expand-header-left">
          <div className="expand-num">{num}</div>
          <div className="expand-title">{title}</div>
        </div>
        <Chevron className="expand-chevron"/>
      </div>
      {open && <div className="expand-body" dangerouslySetInnerHTML={{__html:content}}/>}
    </div>
  );
}

/* ── Main Page ── */
export default function RecruitingManualPage() {

  const [messagesSent, setMessagesSent] = useState(0);
  const [userPlan, setUserPlan] = useState('free');
  useEffect(() => {
    try { setMessagesSent(parseInt(localStorage.getItem('offerbell_messages_sent') || '0', 10)); } catch {}
    try {
      const plan = localStorage.getItem('offerbell_plan') || 'free';
      const prof = JSON.parse(localStorage.getItem('offerbell_onboarding_profile') || '{}');
      setUserPlan(prof.plan || plan);
    } catch { setUserPlan('free'); }
  }, []);

  const [isDark,setIsDark]=useState(false);
  const [userName,setUserName]=useState({first:'',last:''});
  const [activeTrack,setActiveTrack]=useState('');
  const [activeChapter,setActiveChapter]=useState(0);

  useEffect(()=>{
    const theme=localStorage.getItem('offerbell-theme');
    if(theme==='dark'){document.documentElement.setAttribute('data-theme','dark');setIsDark(true);}
    try{const raw=localStorage.getItem('offerbell_onboarding_profile');if(raw){const p=JSON.parse(raw);setUserName({first:p.firstName||'',last:p.lastName||''});}}catch{}
  },[]);

  const displayName=(userName.first+' '+userName.last).trim()||'User';
  const displayInitials=((userName.first[0]||'')+(userName.last[0]||'')).toUpperCase()||'U';
  const toggleTheme=()=>{const next=isDark?'light':'dark';document.documentElement.setAttribute('data-theme',next);setIsDark(!isDark);localStorage.setItem('offerbell-theme',next);};

  const track=TRACKS.find(t=>t.id===activeTrack)||TRACKS[0];
  const chapter=track.chapters[activeChapter]||track.chapters[0];

  // Standard industry 2-letter codes. Rendered in serif italic as a quiet
  // editorial alternative to icon tiles (matches Mock Interview).
  const TRACK_CODE: Record<string, string> = {
    ib: 'IB', pe: 'PE', consulting: 'CN', ge: 'GE', am: 'AM',
    accounting: 'AC', st: 'ST', er: 'ER', re: 'RE', vc: 'VC', rx: 'RX',
  };
  const TRACK_THEME: Record<string, string> = {
    ib: '#2563eb', pe: '#16a34a', consulting: '#7c3aed', ge: '#0891b2',
    am: '#dc2626', accounting: '#ea580c', st: '#0891b2', er: '#d97706',
    re: '#0d9488', vc: '#c026d3', rx: '#475569',
  };

  return (
    <div className="app">
      <Sidebar activePage="recruiting-manual" />

      <main className="main" style={{ padding: '32px 36px 80px', flex: 1, height: '100vh', overflowY: 'auto' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', fontFamily: "'Sora', sans-serif" }}>

          {/* Back link */}
          <div style={{ marginBottom: 18 }}>
            <Link href="/learn" style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:12.5,fontWeight:500,color:"var(--text-3)",textDecoration:"none"}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Learning Hub
            </Link>
          </div>

          {activeTrack === '' ? (
            <>
              {/* Hero - matches Mock Interview pattern */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 10 }}>Career Roadmaps</div>
                <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 46, lineHeight: 1, letterSpacing: '-1.2px', color: 'var(--text)', fontWeight: 400, margin: '0 0 14px' }}>
                  Understand the <em style={{ fontStyle: 'italic' }}>careers.</em>
                </h1>
                <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, maxWidth: 620, margin: 0 }}>
                  What each role does day-to-day, who the key firms are, what they pay, and how to break in. Not for interview prep, that lives in the <Link href="/learn" style={{color:'var(--text)', textDecoration:'underline', textUnderlineOffset: 3, fontWeight: 600}}>Interview Prep Guides</Link>.
                </p>
              </div>

              {/* Track list - same row pattern as Mock Interview landing */}
              <div style={{
                background: 'var(--surface)', border: '1.5px solid var(--border)',
                borderRadius: 14, overflow: 'hidden',
              }}>
                <div style={{
                  display: 'grid', gridTemplateColumns: '56px 1fr 120px 50px',
                  alignItems: 'center', gap: 16,
                  padding: '10px 20px',
                  background: 'var(--surface-2)', borderBottom: '1px solid var(--border)',
                  fontSize: 9.5, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: 'var(--text-3)',
                }}>
                  <span></span>
                  <span>Track</span>
                  <span style={{ textAlign: 'right' }}>Chapters</span>
                  <span></span>
                </div>

                {TRACKS.map((t, i) => {
                  const accent = TRACK_THEME[t.id] || 'var(--text-2)';
                  return (
                    <div
                      key={t.id}
                      onClick={() => {setActiveTrack(t.id); setActiveChapter(0);}}
                      className="cr-row"
                      style={{
                        display: 'grid', gridTemplateColumns: '56px 1fr 120px 50px',
                        alignItems: 'center', gap: 16,
                        padding: '18px 20px',
                        borderBottom: i < TRACKS.length - 1 ? '1px solid var(--border)' : 'none',
                        cursor: 'pointer',
                        transition: 'background 0.12s ease',
                      }}
                    >
                      <div style={{
                        fontFamily: "'Instrument Serif', serif",
                        fontStyle: 'italic',
                        fontSize: 26,
                        letterSpacing: '-0.5px',
                        color: accent,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        lineHeight: 1,
                      }}>{TRACK_CODE[t.id] || ''}</div>

                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>{t.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.45 }}>{t.sub}</div>
                      </div>

                      <div style={{ fontSize: 11.5, color: 'var(--text-3)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                        {t.chapters.length}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6"/>
                        </svg>
                      </div>
                    </div>
                  );
                })}
              </div>

              <style>{`.cr-row:hover { background: var(--surface-2); }`}</style>
            </>
          ) : (
            <>
              {/* Track detail view */}
              <div style={{ marginBottom: 18 }}>
                <button onClick={() => setActiveTrack('')} type="button" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'none', border: 'none', padding: 0,
                  fontSize: 12.5, fontWeight: 500, color: 'var(--text-3)',
                  cursor: 'pointer', fontFamily: "'Sora', sans-serif",
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  All roadmaps
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, marginBottom: 28 }}>
                <div style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: 'italic',
                  fontSize: 56,
                  letterSpacing: '-1.5px',
                  color: TRACK_THEME[track.id] || 'var(--text-2)',
                  lineHeight: 1,
                  flexShrink: 0,
                }}>{TRACK_CODE[track.id] || ''}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 8 }}>Career Roadmap</div>
                  <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, lineHeight: 1.05, letterSpacing: '-0.8px', color: 'var(--text)', fontWeight: 400, margin: '0 0 6px' }}>
                    {track.title}
                  </h1>
                  <div style={{ fontSize: 13, color: 'var(--text-3)' }}>{track.sub}</div>
                </div>
              </div>

              {/* Chapter pills */}
              <div className="chapter-nav">
                {track.chapters.map((ch,i)=>(
                  <button key={ch.title} className={'chapter-pill'+(activeChapter===i?' active':'')} onClick={()=>setActiveChapter(i)} type="button">{ch.title}</button>
                ))}
              </div>

              <div className="manual-section">
                <div className="manual-section-title">{chapter.title}</div>
                <div className="manual-section-sub">{track.title} - Chapter {activeChapter+1} of {track.chapters.length}</div>
              </div>

              {chapter.sections.map((sec,i)=>(
                <ExpandCard key={`${activeTrack}-${activeChapter}-${i}`} num={i+1} title={sec.title} content={sec.content} defaultOpen={i===0}/>
              ))}

              <div className="manual-nav">
                <button className="manual-nav-btn back" onClick={()=>{if(activeChapter>0)setActiveChapter(activeChapter-1);}} disabled={activeChapter===0} type="button">&larr; Previous</button>
                <button className="manual-nav-btn next" onClick={()=>{if(activeChapter<track.chapters.length-1)setActiveChapter(activeChapter+1);}} disabled={activeChapter>=track.chapters.length-1} type="button">Next Chapter &rarr;</button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
