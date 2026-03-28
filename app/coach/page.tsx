'use client';

import Sidebar from "../components/Sidebar";
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import '../contact-finder/contact-finder.css';
import './coach.css';

const TRACKS = [
  'Investment Banking',
  'Private Equity',
  'Consulting',
  'Asset Management',
  'Accounting & Audit',
  'Equity Research',
  'Sales & Trading',
  'Venture Capital',
  'Real Estate',
  'Restructuring',
];

const ICONS = {
  mail: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  chat: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  chart: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="6" width="4" height="15" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg>,
  users: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
  clock: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  file: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><polyline points="14 2 14 8 20 8"/></svg>,
  target: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  code: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  layers: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  scale: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 3v18"/><path d="m4 7 4-4 4 4"/><path d="m12 7 4-4 4 4"/></svg>,
  dollar: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  book: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  shield: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  building: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/></svg>,
  search: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  check: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
};

type Feature = { icon: React.ReactNode; title: string; desc: string; prompt: string; };

const TRACK_FEATURES: Record<string, Feature[]> = {
  'Investment Banking': [
    { icon: ICONS.mail, title: 'Cold email feedback', desc: 'Line-by-line edits on banker outreach', prompt: 'Review my cold email to an investment banker and give me specific, line-by-line edits:\n\n[paste your email here]' },
    { icon: ICONS.chat, title: 'Behavioral story prep', desc: 'Why IB? Tell me about yourself', prompt: 'Help me craft my "Why investment banking?" answer. I go to [school], I\'ve done [experience], and I\'m targeting [firm].' },
    { icon: ICONS.chart, title: 'Technical drill', desc: 'DCF, valuation, accounting, M&A', prompt: 'Give me an IB technical drill. Ask me DCF, valuation, accounting, and M&A questions one at a time with instant feedback.' },
    { icon: ICONS.users, title: 'Coffee chat prep', desc: 'Questions for analysts & VPs', prompt: 'I have a coffee chat with a [title] at [bank] this week. What IB-specific questions should I ask?' },
    { icon: ICONS.clock, title: 'Offer & timeline', desc: 'Superday timelines & offers', prompt: 'I need help navigating my IB offer timeline. I have [offer details] and need to communicate with [other banks].' },
    { icon: ICONS.file, title: 'Resume & deal list', desc: 'Polish for banking applications', prompt: 'Review my investment banking resume and deal list. Give me specific feedback for [target banks].' },
  ],
  'Private Equity': [
    { icon: ICONS.mail, title: 'Cold email feedback', desc: 'Outreach to PE associates & principals', prompt: 'Review my cold email to someone at a PE fund and give me specific edits:\n\n[paste your email here]' },
    { icon: ICONS.chat, title: 'Behavioral story prep', desc: 'Why PE? Deal walk-through', prompt: 'Help me craft my "Why PE?" answer. I\'m coming from [bank/role] and targeting [fund type].' },
    { icon: ICONS.chart, title: 'LBO & technical drill', desc: 'Returns, modeling, deal mechanics', prompt: 'Give me a PE technical drill. LBO mechanics, returns analysis, and deal structuring.' },
    { icon: ICONS.users, title: 'Coffee chat prep', desc: 'Portfolio & deal discussions', prompt: 'I have a coffee chat with a [title] at [PE fund]. What PE-specific questions show I understand the business?' },
    { icon: ICONS.layers, title: 'Case study prep', desc: 'Investment memos & presentations', prompt: 'Walk me through how to approach a PE case study / investment memo.' },
    { icon: ICONS.file, title: 'Resume & deal sheet', desc: 'Position for on-cycle recruiting', prompt: 'Review my PE resume and deal sheet for [megafund/MM/growth] targeting.' },
  ],
  'Consulting': [
    { icon: ICONS.mail, title: 'Cold email feedback', desc: 'Outreach to MBB consultants', prompt: 'Review my cold email to a consultant and give me specific, line-by-line edits:\n\n[paste your email here]' },
    { icon: ICONS.chat, title: 'Behavioral story prep', desc: 'Why consulting? Leadership stories', prompt: 'Help me craft my "Why consulting?" answer. I go to [school], I\'ve done [experience], and I\'m targeting [firm].' },
    { icon: ICONS.target, title: 'Case interview drill', desc: 'Frameworks, sizing, profitability', prompt: 'Give me a consulting case interview drill. Start with a market sizing question, then a profitability case.' },
    { icon: ICONS.users, title: 'Coffee chat prep', desc: 'Smart questions for consultants', prompt: 'I have a coffee chat with a [title] at [consulting firm]. What consulting-specific questions should I ask?' },
    { icon: ICONS.clock, title: 'Offer & timeline', desc: 'MBB, Big 4, boutique deadlines', prompt: 'I have a consulting offer from [firm] and am waiting on [other firms]. What\'s my strategy?' },
    { icon: ICONS.file, title: 'Resume review', desc: 'Impact-driven consulting bullets', prompt: 'Review my consulting resume. Help me rewrite bullets to emphasize impact and leadership for [target firms].' },
  ],
  'Asset Management': [
    { icon: ICONS.mail, title: 'Cold email feedback', desc: 'Outreach to PMs & analysts', prompt: 'Review my cold email to an asset management professional:\n\n[paste your email here]' },
    { icon: ICONS.chat, title: 'Behavioral story prep', desc: 'Why AM? Investment philosophy', prompt: 'Help me craft my "Why asset management?" answer for [firm].' },
    { icon: ICONS.dollar, title: 'Stock pitch drill', desc: 'Pitch structure, variant perception', prompt: 'Help me build a stock pitch for an AM interview. Walk me through the framework and critique my thesis.' },
    { icon: ICONS.chart, title: 'Technical drill', desc: 'Valuation, macro, portfolio theory', prompt: 'Give me an AM technical drill covering valuation methodologies, macro concepts, and portfolio construction.' },
    { icon: ICONS.users, title: 'Coffee chat prep', desc: 'Questions about strategy & AUM', prompt: 'I have a coffee chat with a [PM/analyst] at [AM firm]. What should I ask?' },
    { icon: ICONS.file, title: 'Resume review', desc: 'Highlight research & analysis', prompt: 'Review my AM resume. Help me position my experience for [target firms].' },
  ],
  'Accounting & Audit': [
    { icon: ICONS.mail, title: 'Cold email feedback', desc: 'Outreach to Big 4 professionals', prompt: 'Review my cold email to an accounting professional:\n\n[paste your email here]' },
    { icon: ICONS.chat, title: 'Behavioral story prep', desc: 'Why audit? Why this firm?', prompt: 'Help me craft my "Why accounting/audit?" answer for [firm].' },
    { icon: ICONS.shield, title: 'Technical drill', desc: 'GAAP, audit procedures, standards', prompt: 'Give me an accounting technical drill. Ask me questions on GAAP, audit procedures, and financial statements.' },
    { icon: ICONS.users, title: 'Coffee chat prep', desc: 'Questions for Big 4 professionals', prompt: 'I have a coffee chat with someone at [Big 4 firm]. What should I ask about their practice?' },
    { icon: ICONS.clock, title: 'Offer & timeline', desc: 'Big 4 vs mid-tier decisions', prompt: 'Help me decide between offers from [firms] and navigate the timeline.' },
    { icon: ICONS.file, title: 'Resume review', desc: 'CPA track & internship experience', prompt: 'Review my accounting resume for [Big 4/mid-tier] applications.' },
  ],
  'Equity Research': [
    { icon: ICONS.mail, title: 'Cold email feedback', desc: 'Outreach to research analysts', prompt: 'Review my cold email to an equity research analyst:\n\n[paste your email here]' },
    { icon: ICONS.chat, title: 'Behavioral story prep', desc: 'Why ER? What sector?', prompt: 'Help me craft my "Why equity research?" answer. I want to cover [sector] because [reason].' },
    { icon: ICONS.dollar, title: 'Stock pitch drill', desc: 'Long/short with catalysts & risks', prompt: 'Help me refine my stock pitch for an ER interview. Critique my thesis, catalysts, valuation, and risks.' },
    { icon: ICONS.chart, title: 'Technical drill', desc: 'EPS, P/E, modeling, comps', prompt: 'Give me an ER technical drill. Ask me about EPS forecasting, valuation multiples, and financial modeling.' },
    { icon: ICONS.search, title: 'Sector deep-dive', desc: 'Industry analysis & trends', prompt: 'Help me prepare a deep sector analysis for [industry]. Key companies, trends, and what drives value.' },
    { icon: ICONS.file, title: 'Writing sample review', desc: 'Research report structure', prompt: 'Review my sample equity research report and give me feedback on thesis quality, structure, and writing.' },
  ],
  'Sales & Trading': [
    { icon: ICONS.mail, title: 'Cold email feedback', desc: 'Outreach to S&T professionals', prompt: 'Review my cold email to someone on a trading desk:\n\n[paste your email here]' },
    { icon: ICONS.chat, title: 'Behavioral story prep', desc: 'Why S&T? Trading vs sales?', prompt: 'Help me craft my "Why sales & trading?" answer. I want to be on the [sales/trading/structuring] side because [reason].' },
    { icon: ICONS.chart, title: 'Market knowledge quiz', desc: 'Indices, rates, FX, commodities', prompt: 'Quiz me on current market levels and recent moves. Test my knowledge of equities, rates, FX, and commodities.' },
    { icon: ICONS.target, title: 'Probability & brainteaser drill', desc: 'Expected value, mental math', prompt: 'Give me S&T probability questions and brainteasers. Test my mental math speed and Bayesian thinking.' },
    { icon: ICONS.dollar, title: 'Trade idea prep', desc: 'Thesis, catalyst, risk framework', prompt: 'Help me structure a trade idea for my S&T interview. I want to pitch [long/short] on [asset] because [thesis].' },
    { icon: ICONS.file, title: 'Resume review', desc: 'Position for trading desks', prompt: 'Review my S&T resume. Help me highlight quantitative skills and market experience for [target desk].' },
  ],
  'Venture Capital': [
    { icon: ICONS.mail, title: 'Cold email feedback', desc: 'Outreach to VC investors', prompt: 'Review my cold email to a VC associate or partner:\n\n[paste your email here]' },
    { icon: ICONS.chat, title: 'Behavioral story prep', desc: 'Why VC? Sector thesis', prompt: 'Help me craft my "Why venture capital?" answer. I\'m excited about [sector] because [thesis].' },
    { icon: ICONS.search, title: 'Company deep-dive prep', desc: 'Startup analysis & metrics', prompt: 'Help me prepare a deep-dive on [company/startup] for a VC interview. Evaluate their product, metrics, team, and market.' },
    { icon: ICONS.layers, title: 'Pitch deck evaluation', desc: 'Would you invest? Framework', prompt: 'Walk me through how to evaluate a startup pitch deck. What do I look for in each section?' },
    { icon: ICONS.dollar, title: 'Fund math & deal terms', desc: 'Ownership, dilution, term sheets', prompt: 'Quiz me on VC fund economics, ownership math, and term sheet concepts like liquidation preference and anti-dilution.' },
    { icon: ICONS.file, title: 'Resume & memo review', desc: 'Investment memo writing', prompt: 'Review my VC resume and investment memo. Give me feedback on thesis clarity and analytical depth.' },
  ],
  'Real Estate': [
    { icon: ICONS.mail, title: 'Cold email feedback', desc: 'Outreach to REPE professionals', prompt: 'Review my cold email to a real estate PE professional:\n\n[paste your email here]' },
    { icon: ICONS.chat, title: 'Behavioral story prep', desc: 'Why RE? Why REPE?', prompt: 'Help me craft my "Why real estate?" answer for [REPE/REIT/development] roles.' },
    { icon: ICONS.chart, title: 'Technical drill', desc: 'Cap rates, NOI, DSCR, waterfalls', prompt: 'Give me a real estate technical drill. Ask me about cap rates, pro formas, waterfall distributions, and deal metrics.' },
    { icon: ICONS.building, title: 'Deal walkthrough prep', desc: 'Property acquisition analysis', prompt: 'Walk me through how to evaluate an apartment building acquisition. I need to practice the full deal walkthrough.' },
    { icon: ICONS.dollar, title: 'Investment idea prep', desc: 'Market, property type, returns', prompt: 'Help me develop a real estate investment idea with specific numbers — market, property type, cap rate, target IRR.' },
    { icon: ICONS.file, title: 'Resume review', desc: 'Position for REPE roles', prompt: 'Review my real estate resume for [REPE/REIT/brokerage] applications.' },
  ],
  'Restructuring': [
    { icon: ICONS.mail, title: 'Cold email feedback', desc: 'Outreach to RX bankers', prompt: 'Review my cold email to a restructuring banker:\n\n[paste your email here]' },
    { icon: ICONS.chat, title: 'Behavioral story prep', desc: 'Why RX? Why not M&A?', prompt: 'Help me craft my "Why restructuring?" answer and explain why I prefer RX over M&A.' },
    { icon: ICONS.chart, title: 'Technical drill', desc: 'Chapter 11, claims, credit analysis', prompt: 'Give me a restructuring technical drill. Ask me about Chapter 11, priority of claims, fulcrum security, DIP financing, and credit metrics.' },
    { icon: ICONS.layers, title: 'Case study prep', desc: 'Distressed situations & bankruptcy', prompt: 'Walk me through a restructuring case study. Give me a distressed company and ask me to analyze the capital structure and propose a solution.' },
    { icon: ICONS.shield, title: 'Distressed situations review', desc: 'Notable bankruptcies & outcomes', prompt: 'Quiz me on notable restructuring cases like Lehman, Hertz, J.Crew, and GM. Test my knowledge of what happened and why.' },
    { icon: ICONS.file, title: 'Resume review', desc: 'Position for RX groups', prompt: 'Review my resume for restructuring group applications at [target firms].' },
  ],
};

const TRACK_SUBS: Record<string, string> = {
  'Investment Banking': 'Focusing on bulge bracket M&A preparation and technical modeling excellence.',
  'Private Equity': 'Building deal fluency, LBO mastery, and on-cycle readiness.',
  'Consulting': 'Sharpening your case frameworks, behavioral stories, and firm-specific strategy.',
  'Asset Management': 'Crafting stock pitches, market views, and investment-driven narratives.',
  'Accounting & Audit': 'Mastering technical accounting, audit standards, and Big 4 positioning.',
  'Equity Research': 'Building sector expertise, EPS models, and differentiated stock pitches.',
  'Sales & Trading': 'Sharpening market awareness, mental math, and trade idea delivery.',
  'Venture Capital': 'Developing sector theses, startup evaluation skills, and fund-level thinking.',
  'Real Estate': 'Mastering pro forma modeling, cap rates, and REPE deal analysis.',
  'Restructuring': 'Building distressed analysis skills, bankruptcy fluency, and credit expertise.',
};

const QUOTES = [
  { text: '"In this industry, the <em>details</em> aren\'t just details. They are the deal."', attr: '— Your Coach' },
  { text: '"The best networkers don\'t <em>ask</em> for jobs. They build relationships that <em>lead</em> to them."', attr: '— Your Coach' },
  { text: '"Every cold email is an <em>audition</em>. Make the first line impossible to ignore."', attr: '— Your Coach' },
];

const SYSTEM = `You are Coach — an elite finance recruiting advisor. You have deep expertise in investment banking, private equity, hedge funds, consulting, and all aspects of finance recruiting. You help students with cold emails, networking, coffee chats, interview prep, recruiting stories, and offer decisions.

Be direct, specific, and warm — like a brilliant older friend who went through the process. Never give generic advice. When reviewing emails or stories, rewrite them. Remember everything in the conversation and build on it. Keep responses well-formatted with clear paragraphs. Use bullet points when listing multiple things. Always end with a specific follow-up question or next action.`;

type Message = { role: 'user' | 'assistant'; content: string; time?: number };

function formatText(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    .split(/\n\n+/)
    .map((p) => (p.startsWith('<ul>') || p.startsWith('<h3>') ? p : `<p>${p.replace(/\n/g, '<br>')}</p>`))
    .join('');
}

function fmtTime(ts?: number) {
  if (!ts) return '';
  return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function CoachPage() {
  const router = useRouter();
  const [activeTrack, setActiveTrack] = useState('Investment Banking');
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationHistory, setConversationHistory] = useState<Record<string, Message[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [userName, setUserName] = useState({ first: '', last: '' });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [quoteIdx] = useState(() => Math.floor(Math.random() * QUOTES.length));

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('offerbell_user_id');
    const plan = window.localStorage.getItem('offerbell_plan') || 'free';
    let profilePlan = 'free';
    try { const prof = JSON.parse(window.localStorage.getItem('offerbell_onboarding_profile') || '{}'); profilePlan = prof.plan || 'free'; } catch {}
    if (plan !== 'pro' && profilePlan !== 'pro') { router.replace('/dashboard?upgrade=coach'); return; }
    if (!stored) { router.replace('/signin'); return; }
    // Use saved theme preference
    const savedTheme = localStorage.getItem('offerbell-theme');
    if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
    try {
      const raw = localStorage.getItem('offerbell_onboarding_profile');
      if (raw) { const p = JSON.parse(raw); setUserName({ first: p.firstName || '', last: p.lastName || '' }); }
    } catch {}
  }, [router]);

  const scrollBottom = useCallback(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, []);

  const sendMessage = async (text: string) => {
    if (isLoading || !text.trim()) return;
    const userMsg: Message = { role: 'user', content: text.trim(), time: Date.now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputVal('');
    setIsLoading(true);
    scrollBottom();
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    try {
      const systemPrompt = SYSTEM + `\n\nThe user is on the "${activeTrack}" track. Tailor advice for ${activeTrack} recruiting.`;
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, system: systemPrompt, track: activeTrack }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: ' ' + (data.error || 'Coach is temporarily unavailable.'), time: Date.now() }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.text || 'Something went wrong.', time: Date.now() }]);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error: ' + (err?.message || 'please try again.'), time: Date.now() }]);
    }
    setIsLoading(false);
    scrollBottom();
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(inputVal); }
  };

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
  };

  const selectFeature = (title: string, prompt: string) => {
    // Save current conversation
    if (activeFeature && messages.length > 0) {
      setConversationHistory(prev => ({ ...prev, [activeFeature]: messages }));
    }
    setActiveFeature(title);
    // Restore or start new
    const prev = conversationHistory[title];
    if (prev && prev.length > 0) {
      setMessages(prev);
      setInputVal('');
    } else {
      setMessages([]);
      setInputVal(prompt);
    }
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const features = TRACK_FEATURES[activeTrack] || TRACK_FEATURES['Investment Banking'];
  const displayName = userName.first || 'there';

  return (
    <div className="app">
      <Sidebar activePage="coach" />

      <div className="coach-main">
        {/* ── Left Panel ── */}
        <div className="coach-left">
          <div className="coach-left-track-title">{activeTrack} <em>Track</em></div>
          <div className="coach-left-sub">{TRACK_SUBS[activeTrack]}</div>

          <select
            className="coach-track-select"
            value={activeTrack}
            onChange={e => {
              if (activeFeature && messages.length > 0) {
                setConversationHistory(prev => ({ ...prev, [activeFeature]: messages }));
              }
              setActiveTrack(e.target.value);
              setActiveFeature(null);
              setMessages([]);
              setInputVal('');
            }}
          >
            {TRACKS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <div className="coach-left-section">Focus Areas</div>
          <div className="coach-feature-list">
            {features.map(f => (
              <div
                key={f.title}
                className={`coach-feature-item${activeFeature === f.title ? ' active' : ''}`}
                onClick={() => selectFeature(f.title, f.prompt)}
              >
                <div className="coach-feature-icon">{f.icon}</div>
                <div>
                  <div className="coach-feature-item-text">{f.title}</div>
                  <div className="coach-feature-item-sub">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="coach-left-quote">
            <div className="coach-left-quote-text" dangerouslySetInnerHTML={{ __html: QUOTES[quoteIdx].text }} />
            <div className="coach-left-quote-attr">{QUOTES[quoteIdx].attr}</div>
          </div>
        </div>

        {/* ── Right Panel (Chat) ── */}
        <div className="coach-right">
          <div className="coach-chat-area">
            <div className="coach-chat-area-inner">
              {messages.length === 0 && !isLoading ? (
                <div className="coach-empty">
                  <div className="coach-empty-title">
                    {activeFeature ? activeFeature : `Hey ${displayName}, pick a focus area to start.`}
                  </div>
                  <div className="coach-empty-sub">
                    {activeFeature
                      ? 'Press Enter or click send to begin your coaching session.'
                      : 'Select a topic from the left panel, or just type a question below.'}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((m, i) => (
                    <div key={i} className="coach-msg-row">
                      {m.role === 'assistant' ? (
                        <>
                          <div className="coach-msg-label coach-label">
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2L9.5 8.5 3 11l6.5 2.5L12 20l2.5-6.5L21 11l-6.5-2.5z"/></svg>
                            Coach
                          </div>
                          <div className="coach-bubble coach-bubble-ai" dangerouslySetInnerHTML={{ __html: formatText(m.content) }} />
                          <div className="coach-msg-time">{fmtTime(m.time)}</div>
                        </>
                      ) : (
                        <>
                          <div className="coach-msg-label user-label">{userName.first ? userName.first.toUpperCase() : 'YOU'}</div>
                          <div className="coach-bubble coach-bubble-user">{m.content}</div>
                          <div className="coach-msg-time right">{fmtTime(m.time)}</div>
                        </>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="coach-msg-row">
                      <div className="coach-msg-label coach-label">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2L9.5 8.5 3 11l6.5 2.5L12 20l2.5-6.5L21 11l-6.5-2.5z"/></svg>
                        Coach
                      </div>
                      <div className="coach-bubble coach-bubble-ai">
                        <div className="coach-typing"><span /><span /><span /></div>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="coach-input-area">
            <div className="coach-input-area-inner">
              {activeFeature && (
                <div className="coach-context-label">Context: {activeTrack} — {activeFeature}</div>
              )}
              <div className="coach-input-box">
                <textarea
                  ref={textareaRef}
                  className="coach-chat-input"
                  placeholder="Type your strategic response..."
                  rows={1}
                  value={inputVal}
                  onChange={e => { setInputVal(e.target.value); autoResize(e.target); }}
                  onKeyDown={handleKey}
                />
                <button className="coach-send-btn" onClick={() => sendMessage(inputVal)} disabled={isLoading || !inputVal.trim()} type="button">
                  {isLoading ? <div className="coach-spinner" /> : <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </button>
              </div>
              <div className="coach-input-footer">The Coach is optimizing your professional trajectory.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
